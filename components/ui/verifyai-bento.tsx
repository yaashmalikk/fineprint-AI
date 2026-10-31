"use client";

import * as React from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  X,
  ChevronRight,
} from "lucide-react";
import type {
  VerificationResult,
  VerifiedClaim,
  PipelineStage,
} from "@/lib/verify-types";
import { MOCK_VERIFICATION_RESULT } from "@/lib/mock-data";
import {
  PIPELINE_STAGES,
  getCredibilityLabel,
  getStatusBadgeClasses,
  getStatusLabel,
  getStatusColor,
} from "@/lib/verify-types";

/* ─────────────────────── shared tile ──────────────────────── */

function Tile({
  title,
  action,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 shadow-sm transition hover:border-slate-300 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          {title && <span className="font-semibold text-slate-700">{title}</span>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─────────────────── pipeline indicator ───────────────────── */

function PipelineIndicator({
  currentStage,
  claimsCount,
  sourcesCount,
}: {
  currentStage: PipelineStage | "complete";
  claimsCount: number;
  sourcesCount: number;
}) {
  const stageIdx = currentStage === "complete" ? 4 : PIPELINE_STAGES.findIndex((s) => s.stage === currentStage);

  const labels = [
    `NLP Extraction (${claimsCount} Claims)`,
    `Semantic RAG (${sourcesCount} Sources)`,
    "Evidence Ranking",
    "Transparent Report",
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {labels.map((label, i) => {
        const done = i < stageIdx;
        const active = i === stageIdx;
        return (
          <React.Fragment key={i}>
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap border transition-all ${
                done
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : active
                    ? "bg-sky-50 text-sky-800 border-sky-300 animate-pulse"
                    : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {done ? (
                <CheckCircle2 className="size-3 text-emerald-600" />
              ) : active ? (
                <div className="size-2 rounded-full bg-sky-600 animate-pulse" />
              ) : (
                <div className="size-2 rounded-full bg-slate-300" />
              )}
              <span>{label}</span>
            </div>
            {i < 3 && <ChevronRight className="size-3 text-slate-300 shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ──────────────── credibility score hero ───────────────────── */

function CredibilityScoreTile({
  score,
  verdict,
  claimsCount,
  isInvalid = false,
}: {
  score: number;
  verdict: string;
  claimsCount: number;
  isInvalid?: boolean;
}) {
  const displayScore = isInvalid ? 0 : Math.max(0, Math.min(100, score));
  const color =
    displayScore >= 70
      ? "oklch(0.72 0.17 155)"
      : displayScore >= 40
        ? "oklch(0.78 0.17 75)"
        : "oklch(0.65 0.24 25)";

  return (
    <Tile className="sm:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="size-2 rounded-full" style={{ background: color }} />
          <span className="font-mono uppercase tracking-wider">
            Credibility & Verification Index
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
              {isInvalid ? "REJECTED (0%)" : `${displayScore}% Credible`}
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-md leading-relaxed">
              {verdict}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold font-mono" style={{ color }}>
              {displayScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[11px] font-semibold" style={{ color }}>
              {isInvalid ? "0 Claims Valid" : `${claimsCount} Claims Analyzed`}
            </p>
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Overall Credibility Score</span>
          <span className="font-mono text-slate-800">
            {displayScore === 0 ? "0% (Rejected / Dummy Text)" : displayScore >= 70 ? "Credible" : displayScore >= 40 ? "Mixed" : "Misinformation"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${displayScore}%`,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
            }}
          />
        </div>
      </div>
    </Tile>
  );
}

/* ──────────────── stats summary tile ──────────────────────── */

function StatsSummaryTile({
  claims,
}: {
  claims: VerifiedClaim[];
}) {
  const debunked = claims.filter((c) => c.verification_status === "DEBUNKED_MISINFORMATION").length;
  const misleading = claims.filter((c) => c.verification_status === "MISLEADING").length;
  const verified = claims.filter((c) => c.verification_status === "VERIFIED").length;

  const stats = [
    { label: "Debunked", count: debunked, color: "oklch(0.65 0.24 25)", icon: XCircle },
    { label: "Misleading", count: misleading, color: "oklch(0.78 0.17 75)", icon: AlertTriangle },
    { label: "Verified", count: verified, color: "oklch(0.72 0.17 155)", icon: CheckCircle2 },
  ];

  return (
    <Tile title="Verification Breakdown" className="lg:col-start-3">
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <s.icon className="size-4" style={{ color: s.color }} />
              <span className="text-xs text-slate-600 font-medium">{s.label}</span>
            </div>
            <span className="font-mono text-sm font-bold" style={{ color: s.color }}>
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* Mini breakdown bar */}
      <div className="mt-4 flex items-center gap-1.5">
        {stats.map((s) => {
          const pct = claims.length > 0 ? (s.count / claims.length) * 100 : 0;
          return pct > 0 ? (
            <div
              key={s.label}
              className="h-2 rounded-full transition-all"
              style={{ width: `${pct}%`, background: s.color, minWidth: 4 }}
            />
          ) : null;
        })}
      </div>
    </Tile>
  );
}

/* ──────────────── conflict gauge tile ─────────────────────── */

function ConflictGaugeTile({
  credibilityScore,
  totalClaims,
  isInvalid = false,
}: {
  credibilityScore: number;
  totalClaims: number;
  isInvalid?: boolean;
}) {
  const displayCredibility = isInvalid ? 0 : Math.max(0, Math.min(100, credibilityScore));
  const color =
    displayCredibility >= 70
      ? "oklch(0.72 0.17 155)"
      : displayCredibility >= 40
        ? "oklch(0.78 0.17 75)"
        : "oklch(0.65 0.24 25)";

  return (
    <Tile title="Evidence Conflict Index" className="lg:col-start-4">
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="relative size-32">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (displayCredibility / 100) * 251.2}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-black text-slate-900">{displayCredibility}%</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              {isInvalid ? "0% Credibility" : "Credibility"}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs text-slate-500 font-medium">
            {isInvalid ? "Dummy / Unverifiable" : `${totalClaims} Claims Evaluated`}
          </p>
          <p className="font-mono text-sm font-bold" style={{ color }}>
            {isInvalid
              ? "100% Conflict (Rejected)"
              : displayCredibility >= 70
                ? "Low Conflict / Verified"
                : displayCredibility >= 40
                  ? "Moderate Conflict"
                  : "High Conflict / Misinformation"}
          </p>
        </div>
      </div>
    </Tile>
  );
}

/* ──────────────── evidence comparison card ─────────────────── */

function EvidenceCard({
  claim,
  onViewSource,
}: {
  claim: VerifiedClaim;
  onViewSource: (claim: VerifiedClaim) => void;
}) {
  const statusClasses = getStatusBadgeClasses(claim.verification_status);
  const statusLabel = getStatusLabel(claim.verification_status);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-slate-400">{claim.claim_id}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusClasses}`}>
            {statusLabel}
          </span>
        </div>
        <span
          className="font-mono text-xs font-bold"
          style={{ color: getStatusColor(claim.verification_status) }}
        >
          {claim.conflict_score}% conflict
        </span>
      </div>

      {/* Split View: Claim vs Evidence */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Left: The Claim */}
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1.5">
            <ShieldAlert className="size-3" />
            The Claim
          </div>
          <p className="text-xs text-slate-900 font-medium leading-relaxed">"{claim.claim_text}"</p>
        </div>

        {/* Right: The Evidence */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
            <ShieldCheck className="size-3" />
            Verified Evidence
          </div>
          <p className="text-[11px] font-bold text-emerald-800 font-mono mb-1">
            {claim.evidence.statutory_reference}
          </p>
          <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
            "{claim.evidence.official_text_excerpt}"
          </p>
        </div>
      </div>

      {/* Evidence Comparison */}
      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200/80 p-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Evidence Comparison
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">{claim.evidence_comparison}</p>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-500 truncate max-w-sm">
          <span className="font-semibold text-slate-700">{claim.evidence.authority}</span>
          {" · "}
          <span>{claim.evidence.source_title}</span>
        </div>
        <button
          type="button"
          onClick={() => onViewSource(claim)}
          className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-sm shrink-0"
        >
          <ExternalLink className="size-3 text-sky-600" />
          View Primary Source
        </button>
      </div>
    </div>
  );
}

/* ──────────────── primary source modal ─────────────────────── */

function SourceModal({
  claim,
  onClose,
}: {
  claim: VerifiedClaim;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">Primary Statutory Evidence Source</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Source Title
            </label>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {claim.evidence.source_title}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Governing Authority
            </label>
            <p className="mt-1 text-sm text-slate-700 font-medium">{claim.evidence.authority}</p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Statutory Reference
            </label>
            <p className="mt-1 text-sm font-mono font-bold text-sky-700">
              {claim.evidence.statutory_reference}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Official Text Excerpt
            </label>
            <div className="mt-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-sm text-slate-800 leading-relaxed font-serif italic">
                "{claim.evidence.official_text_excerpt}"
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Transparent Explanation
            </label>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              {claim.transparent_explanation}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Claim Under Review
            </label>
            <div className="mt-1 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <p className="text-sm text-rose-950 leading-relaxed font-semibold">
                "{claim.claim_text}"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────── action dock ─────────────────────────────── */

function ActionDock({
  result,
}: {
  result: VerificationResult;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleExport = () => {
    const lines = [
      "# ClaimProof AI – Verified Audit Dossier",
      "",
      `**Content Type:** ${result.content_type}`,
      `**Credibility Score:** ${result.overall_credibility_score}/100`,
      `**Verdict:** ${result.misinformation_verdict}`,
      "",
      "---",
      "",
    ];

    for (const claim of result.claims) {
      lines.push(`## ${claim.claim_id}: ${getStatusLabel(claim.verification_status)}`);
      lines.push("");
      lines.push(`**Claim:** "${claim.claim_text}"`);
      lines.push(`**Category:** ${claim.claim_category}`);
      lines.push(`**Conflict Score:** ${claim.conflict_score}%`);
      lines.push("");
      lines.push(`**Evidence Source:** ${claim.evidence.source_title}`);
      lines.push(`**Authority:** ${claim.evidence.authority}`);
      lines.push(`**Reference:** ${claim.evidence.statutory_reference}`);
      lines.push(`**Official Text:** "${claim.evidence.official_text_excerpt}"`);
      lines.push("");
      lines.push(`**Comparison:** ${claim.evidence_comparison}`);
      lines.push(`**Explanation:** ${claim.transparent_explanation}`);
      lines.push("");
      lines.push("---");
      lines.push("");
    }

    lines.push(`## Summary`);
    lines.push(result.transparent_summary);

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ClaimProof_AI_Audit_Dossier.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRebuttal = () => {
    const debunked = result.claims.filter(
      (c) => c.verification_status === "DEBUNKED_MISINFORMATION" || c.verification_status === "MISLEADING"
    );

    const text = [
      "Subject: Counter-Notice – Factual Corrections Required",
      "",
      "Dear Sir/Madam,",
      "",
      "Upon evidence-based verification of the content against established statutory law and official sources, the following claims have been identified as factually incorrect or misleading:",
      "",
      ...debunked.map(
        (c, i) =>
          `${i + 1}. "${c.claim_text}"\n   → ${c.evidence.statutory_reference}: ${c.evidence.official_text_excerpt.slice(0, 150)}...`
      ),
      "",
      "Please rectify the above claims to align with the cited legal provisions.",
      "",
      "Regards,",
      "[Your Name]",
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Tile className="sm:col-span-2 lg:col-span-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Audit Actions</h3>
          <p className="text-xs text-slate-500 mt-0.5">{result.transparent_summary.slice(0, 120)}...</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            <Download className="size-3.5" />
            Export Verified Audit Dossier
          </button>
          <button
            type="button"
            onClick={handleRebuttal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 active:scale-95"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : "Generate Rebuttal / Counter-Notice"}
          </button>
        </div>
      </div>
    </Tile>
  );
}

/* ──────────────── main VerifyAI Bento ──────────────────────── */

export interface VerifyAIBentoProps {
  result: VerificationResult | null;
  isLiveAI?: boolean;
  engineNotice?: string;
  pipelineStage?: PipelineStage | "complete";
  className?: string;
}

export function VerifyAIBento({
  result = MOCK_VERIFICATION_RESULT,
  isLiveAI,
  engineNotice,
  pipelineStage = "complete",
  className = "",
}: VerifyAIBentoProps) {
  const [sourceModalClaim, setSourceModalClaim] = React.useState<VerifiedClaim | null>(null);

  const activeResult = result || MOCK_VERIFICATION_RESULT;

  const isInvalid =
    activeResult.is_valid_factual_content === false ||
    activeResult.content_type.toLowerCase().includes("unverifiable") ||
    activeResult.content_type.toLowerCase().includes("dummy") ||
    activeResult.misinformation_verdict.toLowerCase().includes("rejected_gibberish");

  const totalSources = activeResult.claims.reduce(
    (s, c) => s + (c.evidence.relevance_rank > 0 ? 1 : 0),
    0
  );

  return (
    <section className={`w-full text-foreground ${className}`}>
      {/* Top Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {engineNotice && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-700 border border-slate-200">
              {engineNotice}
            </span>
          )}
          {isLiveAI && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-700 border border-emerald-300">
              Live Gemini AI
            </span>
          )}
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white text-xs shadow-sm">
          {activeResult.content_type}
        </span>
      </div>

      {/* Pipeline Indicator */}
      <div className="mb-4">
        <PipelineIndicator
          currentStage={pipelineStage}
          claimsCount={activeResult.claims.length}
          sourcesCount={totalSources}
        />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CredibilityScoreTile
          score={activeResult.overall_credibility_score}
          verdict={activeResult.misinformation_verdict}
          claimsCount={activeResult.claims.length}
          isInvalid={isInvalid}
        />

        <StatsSummaryTile claims={activeResult.claims} />

        <ConflictGaugeTile
          credibilityScore={activeResult.overall_credibility_score}
          totalClaims={activeResult.claims.length}
          isInvalid={isInvalid}
        />

        {/* Evidence Comparison Grid */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Tile title="Evidence Comparison Grid">
            <div className="space-y-3">
              {activeResult.claims.length === 0 ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
                  <AlertTriangle className="size-8 mx-auto text-rose-500 mb-2" />
                  <p className="text-sm font-bold text-rose-900">
                    {activeResult.verdict_summary || "No factual claims or verifiable real-world legal clauses were found in this text."}
                  </p>
                  <p className="text-xs text-rose-700 mt-1">
                    Rejected by ClaimProof AI Zero-Tolerance Claim Extraction Protocol.
                  </p>
                </div>
              ) : (
                activeResult.claims.map((claim) => (
                  <EvidenceCard
                    key={claim.claim_id}
                    claim={claim}
                    onViewSource={setSourceModalClaim}
                  />
                ))
              )}
            </div>
          </Tile>
        </div>

        <ActionDock result={activeResult} />
      </div>

      {/* Source Modal */}
      {sourceModalClaim && (
        <SourceModal claim={sourceModalClaim} onClose={() => setSourceModalClaim(null)} />
      )}
    </section>
  );
}

export default VerifyAIBento;
