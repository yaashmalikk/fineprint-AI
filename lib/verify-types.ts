// ClaimProof AI – Core Types for the Claim Verification Pipeline

export type VerificationStatus = "DEBUNKED_MISINFORMATION" | "MISLEADING" | "VERIFIED";

export type ClaimCategory = "Legal" | "Factual" | "Policy";

export interface ClaimEvidence {
  source_title: string;
  authority: string;
  statutory_reference: string;
  official_text_excerpt: string;
  relevance_rank: number;
}

export interface VerifiedClaim {
  claim_id: string;
  claim_text: string;
  claim_category: ClaimCategory;
  verification_status: VerificationStatus;
  conflict_score: number; // 0-100
  evidence: ClaimEvidence;
  evidence_comparison: string;
  transparent_explanation: string;
}

export interface VerificationResult {
  content_type: string;
  overall_credibility_score: number; // 0-100
  misinformation_verdict: string;
  claims: VerifiedClaim[];
  transparent_summary: string;
  is_valid_factual_content?: boolean;
  verdict_summary?: string;
}

export type InputMode = "document" | "online";

export interface VerifyRequest {
  mode: InputMode;
  // Mode A: Document
  pdfBase64?: string;
  fileName?: string;
  // Mode B: Online content
  contentText?: string;
  sourceUrl?: string;
}

export type PipelineStage = "extraction" | "retrieval" | "ranking" | "assessment";

export interface PipelineProgress {
  stage: PipelineStage;
  stageIndex: number; // 0-3
  label: string;
  detail: string;
}

export const PIPELINE_STAGES: PipelineProgress[] = [
  { stage: "extraction", stageIndex: 0, label: "NLP Claim Extraction", detail: "Parsing content & extracting atomic claims..." },
  { stage: "retrieval", stageIndex: 1, label: "Semantic RAG Retrieval", detail: "Searching ground-truth knowledge base..." },
  { stage: "ranking", stageIndex: 2, label: "Evidence Ranking", detail: "Computing contradiction scores..." },
  { stage: "assessment", stageIndex: 3, label: "Transparent Assessment", detail: "Generating evidence-backed report..." },
];

export function getCredibilityLabel(score: number): string {
  if (score >= 80) return "High Credibility";
  if (score >= 60) return "Mostly Credible";
  if (score >= 40) return "Mixed Credibility";
  if (score >= 20) return "Low Credibility – High Misinformation Density";
  return "Critical Misinformation Detected";
}

export function getStatusColor(status: VerificationStatus): string {
  switch (status) {
    case "VERIFIED": return "oklch(0.72 0.17 155)";
    case "MISLEADING": return "oklch(0.78 0.17 75)";
    case "DEBUNKED_MISINFORMATION": return "oklch(0.65 0.24 25)";
  }
}

export function getStatusBadgeClasses(status: VerificationStatus): string {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "MISLEADING":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "DEBUNKED_MISINFORMATION":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
  }
}

export function getStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case "VERIFIED": return "VERIFIED FACT";
    case "MISLEADING": return "MISLEADING";
    case "DEBUNKED_MISINFORMATION": return "DEBUNKED / MISINFORMATION";
  }
}

