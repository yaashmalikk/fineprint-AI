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
  FileText,
  Search,
  BarChart3,
  ClipboardList,
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
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-lg transition hover:border-white/20 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          {title && <span className="font-semibold text-white/80">{title}</span>}
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
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : active
                    ? "bg-sky-500/20 text-sky-300 border-sky-500/30 animate-pulse"
                    : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              {done ? (
                <CheckCircle2 className="size-3" />
              ) : active ? (
                <div className="size-2 rounded-full bg-sky-400 animate-pulse" />
              ) : (
                <div className="size-2 rounded-full bg-white/20" />
              )}
              <span>{label}</span>
            </div>
            {i < 3 && <ChevronRight className="size-3 text-white/20 shrink-0" />}
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
}: {
  score: number;
  verdict: string;
  claimsCount: number;
}) {
  const color =
    score >= 70
      ? "oklch(0.72 0.17 155)"
      : score >= 40
        ? "oklch(0.78 0.17 75)"
        : "oklch(0.65 0.24 25)";

  return (
    <Tile className="sm:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="size-2 rounded-full" style={{ background: color }} />
          <span className="font-mono uppercase tracking-wider">
            Credibility & Verification Index
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-2xl">
              {getCredibilityLabel(score)}
            </h2>
            <p className="mt-1 text-xs text-white/60 max-w-md">{verdict}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold font-mono" style={{ color }}>
              {score}
              <span className="text-sm font-normal text-white/40">/100</span>
            </div>
            <p className="text-[11px] font-semibold" style={{ color }}>
              {claimsCount} Claims Analyzed
            </p>
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Overall Credibility Score</span>
          <span className="font-mono text-white/80">
            {score >= 70 ? "Credible" : score >= 40 ? "Mixed" : "Misinformation"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
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
              <span className="text-xs text-white/70">{s.label}</span>
            </div>
            <span className="font-mono text-sm font-bold" style={{ color: s.color }}>
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* Mini pie */}
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
  score,
  totalClaims,
}: {
  score: number;
  totalClaims: number;
}) {
  const color =
    score >= 70
      ? "oklch(0.65 0.24 25)"
      : score >= 40
        ? "oklch(0.78 0.17 75)"
        : "oklch(0.72 0.17 155)";

  const inverseScore = 100 - score; // credibility

  return (
    <Tile title="Evidence Conflict Index" className="lg:col-start-4">
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="relative size-32">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (inverseScore / 100) * 251.2}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-black text-white">{inverseScore}%</span>
            <span className="text-[10px] uppercase tracking-wider text-white/50">
              Credibility
            </span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs text-white/60">{totalClaims} Claims Evaluated</p>
          <p className="font-mono text-sm font-bold" style={{ color }}>
            {score >= 70 ? "High Conflict" : score >= 40 ? "Moderate Conflict" : "Low Conflict"}
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
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-white/40">{claim.claim_id}</span>
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
        <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-1.5">
            <ShieldAlert className="size-3" />
            The Claim
          </div>
          <p className="text-xs text-white/90 leading-relaxed">"{claim.claim_text}"</p>
        </div>

        {/* Right: The Evidence */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
            <ShieldCheck className="size-3" />
            Verified Evidence
          </div>
          <p className="text-[11px] font-medium text-emerald-300 mb-1">
            {claim.evidence.statutory_reference}
          </p>
          <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
            "{claim.evidence.official_text_excerpt}"
          </p>
        </div>
      </div>

      {/* Evidence Comparison */}
      <div className="mt-3 rounded-lg bg-black/30 border border-white/10 p-3">
        <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
          Evidence Comparison
        </p>
        <p className="text-xs text-white/80 leading-relaxed">{claim.evidence_comparison}</p>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-white/50">
          <span className="font-medium text-white/70">{claim.evidence.authority}</span>
          {" · "}
          <span>{claim.evidence.source_title}</span>
        </div>
        <button
          type="button"
          onClick={() => onViewSource(claim)}
          className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10 transition"
        >
          <ExternalLink className="size-3" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-sky-400" />
            <h3 className="font-bold">Primary Source Citation</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Source Title
            </label>
            <p className="mt-1 text-sm font-semibold text-white">
              {claim.evidence.source_title}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Governing Authority
            </label>
            <p className="mt-1 text-sm text-white/90">{claim.evidence.authority}</p>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Statutory Reference
            </label>
            <p className="mt-1 text-sm font-mono text-sky-300">
              {claim.evidence.statutory_reference}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Official Text Excerpt
            </label>
            <div className="mt-1 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4">
              <p className="text-sm text-emerald-200 leading-relaxed font-mono">
                "{claim.evidence.official_text_excerpt}"
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Transparent Explanation
            </label>
            <p className="mt-1 text-sm text-white/80 leading-relaxed">
              {claim.transparent_explanation}
            </p>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase tracking-wider">
              Claim Under Review
            </label>
            <div className="mt-1 rounded-lg border border-rose-500/20 bg-rose-950/20 p-4">
              <p className="text-sm text-rose-200 leading-relaxed italic">
                "{claim.claim_text}"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 transition"
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
          <h3 className="text-sm font-bold text-white">Actions</h3>
          <p className="text-xs text-white/60 mt-0.5">{result.transparent_summary.slice(0, 120)}...</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-sky-950 transition hover:bg-white/90 active:scale-95"
          >
            <Download className="size-3.5" />
            Export Verified Audit Dossier
          </button>
          <button
            type="button"
            onClick={handleRebuttal}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
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

  const avgConflict =
    activeResult.claims.length > 0
      ? Math.round(activeResult.claims.reduce((s, c) => s + c.conflict_score, 0) / activeResult.claims.length)
      : 0;

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
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-white/80 border border-white/15">
              {engineNotice}
            </span>
          )}
          {isLiveAI && (
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              Live Gemini AI
            </span>
          )}
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-950 text-xs">
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
        />

        <StatsSummaryTile claims={activeResult.claims} />

        <ConflictGaugeTile score={avgConflict} totalClaims={activeResult.claims.length} />

        {/* Evidence Comparison Grid */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Tile title="Evidence Comparison Grid">
            <div className="space-y-3">
              {activeResult.claims.map((claim) => (
                <EvidenceCard
                  key={claim.claim_id}
                  claim={claim}
                  onViewSource={setSourceModalClaim}
                />
              ))}
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

