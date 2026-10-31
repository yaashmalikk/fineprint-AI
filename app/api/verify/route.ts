import { NextRequest, NextResponse } from "next/server";
import { parsePDFClient } from "@/lib/pdf-client";
import { searchKnowledgeBase } from "@/lib/knowledge-base";
import { MOCK_VERIFICATION_RESULT } from "@/lib/mock-data";
import type { VerificationResult, VerifiedClaim, VerificationStatus, ClaimCategory } from "@/lib/verify-types";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

const VERIFY_PROMPT = `You are VerifyAI, an autonomous misinformation and claim verification system. Your task is to:

1. EXTRACT distinct atomic factual/legal claims from the provided content.
2. For each claim, RETRIEVE the most relevant credible statutory source from Indian law (Indian Contract Act 1872, Supreme Court rulings, UGC/AICTE directives, Labor Codes).
3. COMPARE each claim against the retrieved source and compute an Evidence Conflict Index (0 = Verified True, 100 = Pure Misinformation).
4. Provide a TRANSPARENT assessment — cite specific sections, case law, and official text. No black-box AI opinions.

Return STRICTLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "content_type": "<type of content>",
  "overall_credibility_score": <number 0-100>,
  "misinformation_verdict": "<summary verdict>",
  "claims": [
    {
      "claim_id": "CLM-001",
      "claim_text": "<exact extracted claim>",
      "claim_category": "<Legal | Factual | Policy>",
      "verification_status": "<DEBUNKED_MISINFORMATION | MISLEADING | VERIFIED>",
      "conflict_score": <number 0-100>,
      "evidence": {
        "source_title": "<credible source title>",
        "authority": "<governing body>",
        "statutory_reference": "<section, case citation, or notification ID>",
        "official_text_excerpt": "<relevant excerpt from official source>",
        "relevance_rank": <1-3>
      },
      "evidence_comparison": "<claim vs evidence comparison>",
      "transparent_explanation": "<detailed reasoning citing law>"
    }
  ],
  "transparent_summary": "<2-3 sentence summary>"
}

Key legal references:
- Section 27 ICA: Non-compete = void
- Section 74 ICA: Penalty = actual loss only
- Percept D'Mark v Zaheer Khan (2006) 4 SCC 227
- UGC 2018: Certificate retention banned
- AICTE Circular: Document retention prohibited
- IPC 403 / BNS 316: Misappropriation`;

async function callGemini(parts: unknown[]): Promise<{ text: string; modelName: string } | null> {
  if (!apiKey || apiKey.trim().length < 10) return null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const text = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
        ?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return { text, modelName };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function localVerify(contentText: string): VerificationResult {
  const claims: VerifiedClaim[] = [];
  const lines = contentText.split(/\n+/);
  let idx = 0;

  for (const line of lines) {
    const cleaned = line.replace(/^\d+[\.\)]\s*/, "").trim();
    if (cleaned.length < 30 || !/[a-zA-Z]/.test(cleaned)) continue;

    idx++;
    const lower = cleaned.toLowerCase();
    const matchedSources = searchKnowledgeBase(cleaned, 3);
    const top = matchedSources[0];

    const redFlags = ["non-negotiable", "must submit", "shall not join", "immediate effect", "exclusive", "all work", "fixed", "non-refundable"];
    let signals = 0;
    for (const flag of redFlags) {
      if (lower.includes(flag)) signals++;
    }
    const conflictScore = Math.min(99, matchedSources.length > 0 ? 40 + signals * 15 : 30);
    const status: VerificationStatus =
      conflictScore >= 80 ? "DEBUNKED_MISINFORMATION" : conflictScore >= 50 ? "MISLEADING" : "VERIFIED";
    const category: ClaimCategory =
      /section|act|court|statute/i.test(lower) ? "Legal" : /policy|circular|ugc|aicte/i.test(lower) ? "Policy" : "Factual";

    claims.push({
      claim_id: `CLM-${String(idx).padStart(3, "0")}`,
      claim_text: cleaned,
      claim_category: category,
      verification_status: status,
      conflict_score: conflictScore,
      evidence: top
        ? {
            source_title: top.source_title,
            authority: top.authority,
            statutory_reference: top.statutory_reference,
            official_text_excerpt: top.official_text.slice(0, 300),
            relevance_rank: 1,
          }
        : {
            source_title: "No matching source",
            authority: "N/A",
            statutory_reference: "N/A",
            official_text_excerpt: "No credible source matched this claim.",
            relevance_rank: 0,
          },
      evidence_comparison: top
        ? `Claim conflicts with ${top.statutory_reference}.`
        : "No direct evidence found.",
      transparent_explanation: top
        ? `Based on ${top.authority}, this claim ${status === "VERIFIED" ? "aligns with" : "contradicts"} ${top.statutory_reference}.`
        : "Could not verify against knowledge base.",
    });
  }

  const totalConflict = claims.reduce((s, c) => s + c.conflict_score, 0);
  const credScore = claims.length > 0 ? Math.max(0, 100 - Math.round(totalConflict / claims.length)) : 50;
  const debunked = claims.filter((c) => c.verification_status === "DEBUNKED_MISINFORMATION").length;
  const misleading = claims.filter((c) => c.verification_status === "MISLEADING").length;

  return {
    content_type: "Text Content",
    overall_credibility_score: credScore,
    misinformation_verdict: `${debunked} debunked, ${misleading} misleading out of ${claims.length} claims`,
    claims,
    transparent_summary: `Analyzed ${claims.length} claims. ${debunked} debunked as misinformation, ${misleading} misleading. Credibility: ${credScore}/100.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, pdfBase64, fileName, contentText, sourceUrl } = body as {
      mode?: string;
      pdfBase64?: string;
      fileName?: string;
      contentText?: string;
      sourceUrl?: string;
    };

    let text = contentText || "";

    if (pdfBase64) {
      const pdfResult = parsePDFClient(pdfBase64);
      if (pdfResult.success && pdfResult.full_text) {
        text = pdfResult.full_text;
      }
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({
        result: MOCK_VERIFICATION_RESULT,
        isLiveAI: false,
        engineMessage: "Loaded demonstration data (insufficient content)",
      });
    }

    // Try Gemini
    const parts: unknown[] = [];
    if (pdfBase64) {
      parts.push({ inlineData: { mimeType: "application/pdf", data: pdfBase64 } });
    }
    parts.push({ text: `Content to verify:\n${text.slice(0, 12000)}` });
    parts.push({ text: VERIFY_PROMPT });

    const aiResult = await callGemini(parts);
    if (aiResult) {
      try {
        const jsonMatch = aiResult.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResult.text];
        const parsed = JSON.parse((jsonMatch[1] || aiResult.text).trim()) as VerificationResult;
        return NextResponse.json({
          result: parsed,
          isLiveAI: true,
          engineMessage: `Verified live with Google Gemini (${aiResult.modelName})`,
        });
      } catch {
        // Parse failed, fall through to local
      }
    }

    const result = localVerify(text);
    return NextResponse.json({
      result,
      isLiveAI: false,
      engineMessage: "Verified with local knowledge base engine",
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error)?.message || "Verification failed" },
      { status: 500 }
    );
  }
}

