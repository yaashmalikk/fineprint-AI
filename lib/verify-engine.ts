// ClaimProof AI – Verification Engine
// Client-side engine that performs claim extraction, RAG retrieval against the knowledge base,
// evidence ranking, and transparent assessment. Falls back to mock data when AI is unavailable.

import { parsePDFClient, parsePDFClientAsync } from "./pdf-client";
import { searchKnowledgeBase } from "./knowledge-base";
import { MOCK_VERIFICATION_RESULT, VIRAL_CORPORATE_SAMPLE_TEXT } from "./mock-data";
import type {
  VerificationResult,
  VerifiedClaim,
  VerifyRequest,
  ClaimCategory,
  VerificationStatus,
} from "./verify-types";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
export const isLiveAIConfigured = Boolean(apiKey && apiKey.trim().length > 10);

export function isGibberishOrDummy(text: string, isDocument = false): { isInvalid: boolean; reason?: string } {
  if (!text || !text.trim()) {
    if (isDocument) {
      return { isInvalid: false };
    }
    return { isInvalid: true, reason: "Text is empty. Please enter verifiable content." };
  }

  const lower = text.toLowerCase();

  // 1. Lorem ipsum check
  if (lower.includes("lorem ipsum") || lower.includes("dolor sit amet") || lower.includes("consectetur")) {
    return { isInvalid: true, reason: "Dummy/Placeholder text (Lorem Ipsum) detected. No verifiable claims found." };
  }

  // 2. Repetitive character / keyboard mash check
  if (/(.)\1{6,}/.test(lower)) {
    return { isInvalid: true, reason: "Repetitive gibberish pattern detected. No verifiable claims found." };
  }

  // 3. For uploaded documents (PDFs, images): NEVER reject on length!
  // Short PDFs, 1-page letters, certificates, and single-clause notices are 100% valid.
  if (isDocument) {
    return { isInvalid: false };
  }

  // 4. For raw pasted text: allow short text if it contains substantive legal/contractual terms
  const words = text.trim().split(/\s+/).filter(Boolean);
  const hasSubstantiveKeywords = /bond|penalty|non-compete|compete|salary|notice|certificate|marksheet|lakh|deposit|rent|contract|agreement|clause|section|fine|leave|employer|employee/i.test(text);

  if (words.length < 15 && !hasSubstantiveKeywords) {
    return { isInvalid: true, reason: "Text is too short to extract verifiable legal or factual claims." };
  }

  if (words.length < 3) {
    return { isInvalid: true, reason: "Text is too short to extract verifiable legal or factual claims." };
  }

  return { isInvalid: false };
}

export function createInvalidContentResult(reason: string, text: string): VerificationResult {
  return {
    content_type: "Unverifiable / Dummy Content",
    overall_credibility_score: 0,
    misinformation_verdict: `REJECTED_GIBBERISH_OR_DUMMY_TEXT: ${reason}`,
    verdict_summary: reason,
    is_valid_factual_content: false,
    claims: [],
    transparent_summary: `Verification halted: ${reason} No factual claims or verifiable real-world legal clauses were found in this text.`,
  };
}

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

async function generateWithGeminiFallback(
  parts: unknown[],
  isJson = true
): Promise<{ text: string; modelName: string }> {
  let lastError: Error | null = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const body: Record<string, unknown> = {
        contents: [{ parts }],
      };
      if (isJson) {
        body.generationConfig = { responseMimeType: "application/json" };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error((errJson as { error?: { message?: string } })?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
        ?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return { text, modelName };
      }
    } catch (err) {
      lastError = err as Error;
    }
  }

  throw lastError || new Error("All Gemini candidate models failed.");
}

function localClaimExtraction(text: string): string[] {
  const claims: string[] = [];
  const cleanedText = text.replace(/===.*?===\n?/g, "").trim();

  // 1. Look for explicit numbered clauses or sections
  const clauseRegex = /(?:(?:Clause|Section|Article|Point)\s*(\d+(?:\.\d+)*)|(?:\n|^)(\d+[\.\)]))\s*[:\.\-]?\s*([^\n\.;]+[\.\;]?)/gi;
  let match;
  while ((match = clauseRegex.exec(cleanedText)) !== null) {
    const clm = match[0].trim();
    if (clm.length > 8) claims.push(clm);
  }

  // 2. If no explicit clause headers found, split by lines or sentence boundaries
  if (claims.length === 0) {
    const lines = cleanedText.split(/[\n\r]+|\.\s+/);
    for (const line of lines) {
      const cleaned = line.replace(/^\d+[\.\)]\s*/, "").trim();
      if (cleaned.length > 8 && /[a-zA-Z]/.test(cleaned) && !cleaned.startsWith("===")) {
        claims.push(cleaned);
      }
    }
  }

  if (claims.length > 0) return claims.slice(0, 10);
  if (cleanedText.length > 0) return [cleanedText.slice(0, 500)];
  return ["Document terms audited for statutory compliance under Indian Contract Act 1872."];
}

function computeConflictScore(claimText: string, matchedEntries: ReturnType<typeof searchKnowledgeBase>): number {
  if (matchedEntries.length === 0) return 85; // No supporting evidence in statutory knowledge base = high conflict / unsupported claim
  const lower = claimText.toLowerCase();

  let contradictionSignals = 0;
  const redFlags = ["non-negotiable", "must submit", "shall not join", "immediate effect", "exclusive", "all work", "fixed", "non-refundable", "barred", "prohibited"];
  for (const flag of redFlags) {
    if (lower.includes(flag)) contradictionSignals++;
  }
  return Math.min(99, 45 + contradictionSignals * 15);
}

function determineStatus(conflictScore: number): VerificationStatus {
  if (conflictScore >= 80) return "DEBUNKED_MISINFORMATION";
  if (conflictScore >= 50) return "MISLEADING";
  return "VERIFIED";
}

function determineCategory(text: string): ClaimCategory {
  const lower = text.toLowerCase();
  if (/section|act|court|statute|ipc|ipc|bns|void|contract act/i.test(lower)) return "Legal";
  if (/policy|circular|ugc|aicte|directive|notification/i.test(lower)) return "Policy";
  return "Factual";
}

function localVerification(contentText: string): VerificationResult {
  const extractedClaims = localClaimExtraction(contentText);
  const claims: VerifiedClaim[] = [];

  let totalConflict = 0;

  for (let i = 0; i < extractedClaims.length; i++) {
    const claimText = extractedClaims[i];
    const matchedSources = searchKnowledgeBase(claimText, 3);
    const topSource = matchedSources[0];
    const conflictScore = computeConflictScore(claimText, matchedSources);
    const status = determineStatus(conflictScore);

    totalConflict += conflictScore;

    claims.push({
      claim_id: `CLM-${String(i + 1).padStart(3, "0")}`,
      claim_text: claimText,
      claim_category: determineCategory(claimText),
      verification_status: status,
      conflict_score: conflictScore,
      evidence: topSource
        ? {
            source_title: topSource.source_title,
            authority: topSource.authority,
            statutory_reference: topSource.statutory_reference,
            official_text_excerpt: topSource.official_text.slice(0, 300),
            relevance_rank: 1,
          }
        : {
            source_title: "No Statutory Evidence Found",
            authority: "Unverified Claim Source",
            statutory_reference: "No Corroborating Statutory Authority",
            official_text_excerpt: "No credible statutory law, gazette circular, or judicial ruling in the ground-truth knowledge base supports this claim.",
            relevance_rank: 0,
          },
      evidence_comparison: topSource
        ? `The claim conflicts with ${topSource.statutory_reference}, which states a different legal position.`
        : "Claim cannot be substantiated against statutory records or judicial precedents.",
      transparent_explanation: topSource
        ? `Based on ${topSource.authority}, this claim ${status === "VERIFIED" ? "aligns with" : "contradicts"} established law under ${topSource.statutory_reference}.`
        : "Uncorroborated claim: ClaimProof AI flags claims lacking primary source evidence as unverified rather than accepting them as facts.",
    });
  }

  const avgConflict = claims.length > 0 ? totalConflict / claims.length : 50;
  const credibilityScore = Math.max(0, Math.min(100, 100 - Math.round(avgConflict)));
  const debunked = claims.filter((c) => c.verification_status === "DEBUNKED_MISINFORMATION").length;
  const misleading = claims.filter((c) => c.verification_status === "MISLEADING").length;

  return {
    content_type: "Text Content",
    overall_credibility_score: credibilityScore,
    misinformation_verdict:
      debunked > 0
        ? `${debunked} claim(s) debunked as misinformation, ${misleading} misleading`
        : misleading > 0
          ? `${misleading} claim(s) identified as misleading`
          : "All claims verified as factually accurate",
    claims,
    transparent_summary: `Analysis of ${claims.length} extracted claims: ${debunked} debunked, ${misleading} misleading, ${claims.length - debunked - misleading} verified. Credibility score: ${credibilityScore}/100.`,
  };
}

const VERIFY_PROMPT = `You are ClaimProof AI, an autonomous misinformation and claim verification system. Your task is to:

1. EXTRACT distinct atomic factual/legal claims from the provided content.
2. For each claim, RETRIEVE the most relevant credible statutory source from Indian law (Indian Contract Act 1872, Supreme Court rulings, UGC/AICTE directives, Labor Codes).
3. COMPARE each claim against the retrieved source and compute an Evidence Conflict Index (0 = Verified True, 100 = Pure Misinformation).
4. Provide a TRANSPARENT assessment — cite specific sections, case law, and official text. No black-box AI opinions.

Return STRICTLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "content_type": "<type of content, e.g. Employment Contract, Social Media Post, News Article>",
  "overall_credibility_score": <number 0-100, where 100 = fully credible>,
  "misinformation_verdict": "<summary verdict string>",
  "claims": [
    {
      "claim_id": "CLM-001",
      "claim_text": "<exact extracted claim>",
      "claim_category": "<Legal | Factual | Policy>",
      "verification_status": "<DEBUNKED_MISINFORMATION | MISLEADING | VERIFIED>",
      "conflict_score": <number 0-100>,
      "evidence": {
        "source_title": "<title of the credible source>",
        "authority": "<governing body, e.g. Parliament of India, Supreme Court>",
        "statutory_reference": "<specific section, case citation, or notification ID>",
        "official_text_excerpt": "<exact relevant excerpt from the official source>",
        "relevance_rank": <1-3>
      },
      "evidence_comparison": "<side-by-side comparison of claim vs evidence>",
      "transparent_explanation": "<detailed reasoning citing specific law>"
    }
  ],
  "transparent_summary": "<2-3 sentence overall summary with statistics>"
}

Key Indian legal references to use:
- Section 27 ICA: Post-employment non-compete = void ab initio
- Section 74 ICA: Penalty must reflect actual loss, not arbitrary amounts
- Percept D'Mark v Zaheer Khan (2006) 4 SCC 227: Non-compete void
- UGC 2018 Notification: Certificate retention banned
- AICTE Circular: Original document retention prohibited
- IPC Section 403 / BNS 316: Misappropriation of documents
- Section 16 ICA: Undue influence in asymmetric contracts

CRITICAL VERIFICATION INTEGRITY RULE:
If the content contains placeholder text, dummy text, lorem ipsum, gibberish, or lacks real verifiable factual assertions, you MUST set overall_credibility_score to 0, misinformation_verdict to "REJECTED: Dummy or unverifiable content", and mark claims as DEBUNKED_MISINFORMATION with conflict_score: 100. NEVER return high credibility for placeholder or non-substantive text.`;

export async function verifyContent(request: VerifyRequest): Promise<{
  result: VerificationResult;
  isLiveAI: boolean;
  engineMessage: string;
}> {
  let contentText = request.contentText || "";

  // Normalize single or multiple uploaded files
  const files = request.files && request.files.length > 0
    ? request.files
    : request.pdfBase64
      ? [{ name: request.fileName || "document.pdf", base64: request.pdfBase64 }]
      : [];

  // Extract text across all uploaded documents
  if (files.length > 0) {
    const extractedParts: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const pdfRes = await parsePDFClientAsync(f.base64);
      const text = pdfRes.success && pdfRes.full_text ? pdfRes.full_text : "";
      if (text.trim().length > 0) {
        extractedParts.push(`=== [Document ${i + 1}: ${f.name}] ===\n${text}`);
      } else {
        extractedParts.push(`=== [Document ${i + 1}: ${f.name}] ===\n(Document content from ${f.name})`);
      }
    }
    contentText = extractedParts.join("\n\n");
  }

  // Content validation: Check for dummy/lorem ipsum, gibberish, or short text (never reject uploaded PDFs on length)
  const isDocument = files.length > 0;
  const check = isGibberishOrDummy(contentText, isDocument);
  if (check.isInvalid) {
    return {
      result: createInvalidContentResult(check.reason || "Invalid content", contentText),
      isLiveAI: false,
      engineMessage: check.reason || "Invalid content",
    };
  }

  // Try live Gemini AI
  if (isLiveAIConfigured) {
    try {
      const parts: unknown[] = [];
      for (const f of files) {
        if (f.base64 && f.name.toLowerCase().endsWith(".pdf")) {
          parts.push({
            inlineData: { mimeType: "application/pdf", data: f.base64 },
          });
        }
      }
      parts.push({ text: `Content to verify across ${files.length > 0 ? `${files.length} document(s)` : "submitted text"}:\n${contentText.slice(0, 15000)}` });
      parts.push({ text: VERIFY_PROMPT });

      const { text: aiResponse, modelName } = await generateWithGeminiFallback(parts);
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const parsed = JSON.parse((jsonMatch[1] || aiResponse).trim()) as VerificationResult;

      if (files.length > 1) {
        parsed.content_type = `Batch Audit (${files.length} Files: ${files.map((f) => f.name).join(", ")})`;
      }

      return {
        result: parsed,
        isLiveAI: true,
        engineMessage: `Verified ${files.length > 1 ? `${files.length} files ` : ""}live with Google Gemini (${modelName})`,
      };
    } catch (err) {
      console.warn("Gemini call failed, falling back to local engine:", (err as Error)?.message);
    }
  }

  // Local fallback: RAG against knowledge base
  const result = localVerification(contentText);
  if (files.length > 1) {
    result.content_type = `Batch Audit (${files.length} Files: ${files.map((f) => f.name).join(", ")})`;
  }
  return {
    result,
    isLiveAI: false,
    engineMessage: `Verified ${files.length > 1 ? `${files.length} files ` : ""}with local knowledge base engine (offline mode)`,
  };
}

export function loadViralSample(): { text: string; result: VerificationResult } {
  return {
    text: VIRAL_CORPORATE_SAMPLE_TEXT,
    result: MOCK_VERIFICATION_RESULT,
  };
}

