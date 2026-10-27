"use client";

import * as React from "react";
import {
  UploadCloud,
  Mail,
  Copy,
  Check,
  Download,
  X,
  FileText,
  AlertTriangle,
  Scale,
  Shield,
  FileCheck2,
} from "lucide-react";
import {
  ClauseRiskAllocation,
  LegalAuditViolation,
  LegalAuditCard,
  AuditLogItem,
  CounterDraftData,
} from "@/lib/model";

export interface FinePrintBentoProps {
  documentName?: string;
  jurisdiction?: string;
  governingAct?: string;
  overallRiskScore?: number;
  unenforceableClausesCount?: number;
  liabilityTrapAmount?: string;
  activeCards?: LegalAuditCard[];
  violations?: LegalAuditViolation[];
  clauseAllocations?: ClauseRiskAllocation[];
  auditLogs?: AuditLogItem[];
  counterDraft?: CounterDraftData;
  pypdfExtracted?: {
    numPages?: number;
    charCount?: number;
    detectedClausesCount?: number;
  };
  isLiveAI?: boolean;
  engineNotice?: string;
  onUploadClick?: () => void;
  accent?: string;
  accentAmber?: string;
  accentSafe?: string;
  className?: string;
}

export const DEMO_AUDIT = {
  documentName: "Acme_Corp_Offer_Letter.pdf",
  jurisdiction: "Republic of India",
  governingAct: "Indian Contract Act, 1872",
  overallRiskScore: 84,
  unenforceableClausesCount: 3,
  liabilityTrapAmount: "₹2,50,000",
  activeCards: [
    {
      id: "doc-1",
      title: "Offer & Service Bond",
      documentType: "Employment Offer Letter",
      contractRef: "ACME/2026/SDE-049",
      riskScore: 84,
      riskLevel: "Critical Risk" as const,
      bondTrap: "₹2.5L Bond · 24 Mo",
      noticePeriod: "90 Days Employee / 0d Employer",
      governingLaw: "Sec 27 & 74 ICA",
      color: "oklch(0.55 0.22 25)",
      color2: "oklch(0.38 0.18 15)",
      ink: "oklch(0.98 0.02 20)",
    },
    {
      id: "doc-2",
      title: "Fair SDE Contract",
      documentType: "Standard Employment",
      contractRef: "COMPL/2026/001",
      riskScore: 18,
      riskLevel: "Low Risk" as const,
      bondTrap: "₹0 · No Bond",
      noticePeriod: "30 Days Mutual",
      governingLaw: "Compliant ICA",
      color: "oklch(0.68 0.16 160)",
      color2: "oklch(0.48 0.15 175)",
      ink: "oklch(0.12 0.04 160)",
    },
    {
      id: "doc-3",
      title: "Bangalore Rent Agreement",
      documentType: "Residential Tenancy",
      contractRef: "RENT/2026/KA",
      riskScore: 62,
      riskLevel: "Medium Risk" as const,
      bondTrap: "₹85k Deposit Trap",
      noticePeriod: "30 Days Notice",
      governingLaw: "Model Tenancy Act",
      color: "oklch(0.72 0.16 75)",
      color2: "oklch(0.52 0.17 50)",
      ink: "oklch(0.18 0.05 40)",
    },
  ],
  violations: [
    {
      id: "v-1",
      kind: "non-compete" as const,
      title: "Post-Employment Non-Compete Restraint",
      clauseRef: "Clause 14.1",
      statuteDetail: "Supreme Court in Percept D'Mark v Zaheer Khan held all post-employment restraints void ab initio under Section 27.",
      financialExposure: "Void ab initio",
      severity: "Void" as const,
      statusColor: "oklch(0.65 0.24 25)",
    },
    {
      id: "v-2",
      kind: "bond" as const,
      title: "₹2.5 Lakh Training Cost Penalty",
      clauseRef: "Clause 11.4",
      statuteDetail: "Section 74 ICA requires proof of actual incurred loss. Arbitrary bond penalties are unenforceable.",
      financialExposure: "₹2,50,000 Penalty",
      severity: "Critical" as const,
      statusColor: "oklch(0.65 0.24 25)",
    },
    {
      id: "v-3",
      kind: "certificate" as const,
      title: "Original Marksheet & Degree Impoundment",
      clauseRef: "Clause 8.1",
      statuteDetail: "Banned under AICTE & UGC circulars; punishable under IPC Section 403.",
      financialExposure: "Illegal Impound",
      severity: "Critical" as const,
      statusColor: "oklch(0.65 0.24 25)",
    },
  ],
  clauseAllocations: [
    { category: "Illegal & Void (Sec 27)", percentage: 45, clausesCount: 2, color: "oklch(0.65 0.24 25)", statute: "ICA Section 27" },
    { category: "Asymmetrical / One-Sided", percentage: 35, clausesCount: 4, color: "oklch(0.78 0.17 75)", statute: "Sec 74 Unreasonable Penalty" },
    { category: "Standard & Enforceable", percentage: 20, clausesCount: 3, color: "oklch(0.72 0.17 155)", statute: "Compliant" },
  ],
  auditLogs: [
    { id: "l-1", clauseId: "Cl. 8.1", section: "Custody", description: "Mandatory original degree surrender", severityScore: 0.99, verdict: "ILLEGAL" as const },
    { id: "l-2", clauseId: "Cl. 11.4", section: "Bond", description: "Arbitrary exit penalty without cost proof", severityScore: 0.95, verdict: "PENAL" as const },
    { id: "l-3", clauseId: "Cl. 14.1", section: "Non-Compete", description: "24-month post-exit competitor restraint", severityScore: 0.98, verdict: "VOID" as const },
    { id: "l-4", clauseId: "Cl. 6.2", section: "Notice", description: "90-day employee notice vs 0-day employer", severityScore: 0.74, verdict: "PENAL" as const },
    { id: "l-5", clauseId: "Cl. 2.1", section: "Remuneration", description: "Salary schedule and tax compliance", severityScore: 0.1, verdict: "VALID" as const },
  ],
  counterDraft: {
    flagsCount: 3,
    statutoryDefenseStrength: 95,
    subjectLine: "Offer Letter Alignment - Statutory Provisions - Acme Corp",
    bodyText: `Dear Hiring Team,\n\nThank you for the offer. In reviewing the terms against the Indian Contract Act 1872, I request 3 standard alignments:\n\n1. Original Certificates: Return following verification per AICTE/UGC guidelines.\n2. Service Agreement: Training cost recovery limited strictly to verifiable third-party expenses (Sec 74 ICA).\n3. Non-Compete: Removal of post-employment restraint per Section 27 (Supreme Court in Percept D'Mark v Zaheer Khan).\n\nLooking forward to joining the team.\n\nBest regards,\nCandidate`,
    citedPrecedents: [
      "Percept D'Mark v Zaheer Khan, (2006) 4 SCC 227",
      "Section 27 & 74, Indian Contract Act 1872",
      "AICTE Marksheet Retention Directive",
    ],
  },
};

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

function HeroAuditTile({
  documentName,
  riskScore,
  unenforceableCount,
  auditLogs = [],
  pypdfExtracted,
  accent,
  accentAmber,
  accentSafe,
}: {
  documentName: string;
  riskScore: number;
  unenforceableCount: number;
  auditLogs?: AuditLogItem[];
  pypdfExtracted?: any;
  accent: string;
  accentAmber: string;
  accentSafe: string;
}) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const bars = auditLogs.length > 0
    ? auditLogs.map((l) => ({
        id: l.clauseId,
        score: Math.round(l.severityScore * 100),
        color: l.severityScore > 0.7 ? accent : l.severityScore > 0.35 ? accentAmber : accentSafe,
        label: `${l.section}: ${l.verdict}`,
      }))
    : [
        { id: "Cl. 1", score: 15, color: accentSafe, label: "Remuneration: VALID" },
        { id: "Cl. 2", score: 40, color: accentAmber, label: "Probation: MODERATE" },
        { id: "Cl. 3", score: 98, color: accent, label: "Certificate: ILLEGAL" },
        { id: "Cl. 4", score: 95, color: accent, label: "Bond Penalty: PENAL" },
        { id: "Cl. 5", score: 99, color: accent, label: "Non-Compete: VOID" },
      ];

  const active = hoveredIdx !== null ? bars[hoveredIdx] : null;

  return (
    <Tile className="sm:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="size-2 rounded-full" style={{ background: accent }} />
          <span className="font-mono uppercase tracking-wider">Contract Audit Summary</span>
          {pypdfExtracted && (
            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 font-mono text-[10px] text-blue-400">
              pypdf {pypdfExtracted.numPages || 1}p • {pypdfExtracted.charCount || 0}c
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{documentName}</h2>
            <p className="mt-1 text-xs text-white/60">
              Audited against Indian Contract Act 1872 & Supreme Court Rulings
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono" style={{ color: accent }}>
              {riskScore}
              <span className="text-sm font-normal text-white/40">/100</span>
            </div>
            <p className="text-[11px] font-semibold text-rose-400">
              {unenforceableCount} Unenforceable Clauses
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Clause Risk Profile</span>
          <span className="font-mono text-white/80">
            {active ? `${active.id} (${active.label})` : "Hover bar to inspect"}
          </span>
        </div>
        <div className="mt-2 flex h-14 items-end gap-1.5" onMouseLeave={() => setHoveredIdx(null)}>
          {bars.map((b, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoveredIdx(i)}
              className="flex-1 rounded transition-all"
              style={{
                height: `${b.score}%`,
                background: b.color,
                opacity: hoveredIdx === null ? 0.75 : hoveredIdx === i ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </Tile>
  );
}

function DocumentsStackTile({ cards = [] }: { cards?: LegalAuditCard[] }) {
  const validCards = React.useMemo(() => {
    if (!cards || cards.length === 0) return DEMO_AUDIT.activeCards;
    if (cards.length === 1) {
      const rest = DEMO_AUDIT.activeCards.filter((x) => x.id !== cards[0].id);
      return [cards[0], ...rest.slice(0, 2)];
    }
    return cards;
  }, [cards]);

  const [order, setOrder] = React.useState<string[]>(() => validCards.map((c) => c.id));

  React.useEffect(() => {
    setOrder(validCards.map((c) => c.id));
  }, [validCards]);

  const renderOrder = React.useMemo(() => {
    const matched = order.filter((id) => validCards.some((c) => c.id === id));
    return matched.length > 0 ? matched : validCards.map((c) => c.id);
  }, [order, validCards]);

  const front = validCards.find((c) => c.id === renderOrder[renderOrder.length - 1]) || validCards[0];

  return (
    <Tile title="Documents Stack" className="lg:col-start-3">
      <div className="relative min-h-[160px] flex flex-col justify-end">
        <div className="relative h-28">
          {renderOrder.map((id, pos) => {
            const c = validCards.find((x) => x.id === id);
            if (!c) return null;
            const fromFront = renderOrder.length - 1 - pos;
            const isFront = fromFront === 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => !isFront && setOrder((o) => [...o.filter((x) => x !== id), id])}
                className="absolute left-1/2 -translate-x-1/2 w-full max-w-[260px] rounded-xl p-3 text-left transition-all duration-300 shadow-xl border border-white/20"
                style={{
                  top: `${pos * 18}px`,
                  zIndex: pos + 1,
                  background: `linear-gradient(135deg, ${c.color || "#1e293b"}, ${c.color2 || "#0f172a"})`,
                  transform: `translateX(-50%) scale(${1 - fromFront * 0.05})`,
                }}
              >
                <div className="flex items-center justify-between text-[11px] text-white/90">
                  <span className="font-semibold truncate">{c.documentType}</span>
                  <span className="font-mono text-[9px] bg-black/40 px-1.5 py-0.5 rounded">
                    {c.riskLevel}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-white truncate">{c.title}</p>
                <p className="text-[10px] text-white/70 truncate">{c.bondTrap}</p>
              </button>
            );
          })}
        </div>
      </div>

      {front && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            <p className="font-mono text-white font-medium">{front.contractRef}</p>
            <p className="text-white/50 text-[11px]">{front.noticePeriod}</p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
            style={{ color: front.color, backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            {front.bondTrap}
          </span>
        </div>
      )}
    </Tile>
  );
}

function LitigationRiskGaugeTile({
  trapAmount = "₹2,50,000",
  riskScore = 84,
  accent,
}: {
  trapAmount?: string;
  riskScore?: number;
  accent: string;
}) {
  const angle = (riskScore / 100) * 180;

  return (
    <Tile title="Litigation Exposure" className="lg:col-start-4">
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="relative size-32">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={accent}
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (riskScore / 100) * 251.2}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-black text-white">{riskScore}%</span>
            <span className="text-[10px] uppercase tracking-wider text-white/50">Risk Index</span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs text-white/60">Estimated Financial Trap</p>
          <p className="font-mono text-xl font-bold text-rose-400">{trapAmount}</p>
        </div>
      </div>
    </Tile>
  );
}

function FlaggedViolationsTile({ violations = [] }: { violations: LegalAuditViolation[] }) {
  return (
    <Tile title="Flagged Statutory Violations" className="sm:col-span-2">
      <div className="space-y-2.5">
        {violations.map((v) => (
          <div
            key={v.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:bg-white/[0.05]"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">{v.title}</p>
                <p className="text-[11px] text-white/50 mt-0.5">{v.clauseRef} • {v.statuteDetail}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-bold text-rose-400">{v.financialExposure}</span>
              <span className="block text-[10px] font-mono uppercase text-white/40">{v.severity}</span>
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
}

function CounterDraftShieldTile({
  counterDraft,
  documentName,
}: {
  counterDraft?: CounterDraftData;
  documentName: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const data = counterDraft || DEMO_AUDIT.counterDraft;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${data.subjectLine}\n\n${data.bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `# Counter-Draft Legal Proposal\nDocument: ${documentName}\nDefense Strength: ${data.statutoryDefenseStrength}%\n\nSubject: ${data.subjectLine}\n\n${data.bodyText}\n\nCited Precedents:\n${data.citedPrecedents.map((p) => `- ${p}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentName.replace(/\.[^/.]+$/, "")}_CounterDraft.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Tile title="Legal Counter-Draft Shield" className="sm:col-span-2">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold font-mono text-emerald-300">
              {data.statutoryDefenseStrength}% Defense Rating
            </span>
            <span className="text-xs text-white/60">Ready to negotiate with HR</span>
          </div>

          <p className="mt-3 text-xs font-medium text-white line-clamp-1">
            Subject: {data.subjectLine}
          </p>
          <p className="mt-1 text-xs text-white/60 line-clamp-3 bg-black/30 p-2.5 rounded-lg border border-white/10 font-mono">
            {data.bodyText}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-sky-950 transition hover:bg-white/90"
          >
            Review & Edit Counter-Draft
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border border-white/20 bg-white/5 p-2 text-white hover:bg-white/10"
            title="Copy email text"
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl border border-white/20 bg-white/5 p-2 text-white hover:bg-white/10"
            title="Download markdown report"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-emerald-400" />
                <h3 className="font-bold">Statutory HR Counter-Draft</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-white/50">Subject Line</label>
                <input
                  readOnly
                  value={data.subjectLine}
                  className="w-full mt-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-white/50">Email Body</label>
                <textarea
                  readOnly
                  rows={8}
                  value={data.bodyText}
                  className="w-full mt-1 rounded-lg border border-white/10 bg-black/40 p-3 text-xs font-mono leading-relaxed resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-white/50">Cited Precedents</label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {data.citedPrecedents.map((p, i) => (
                    <span key={i} className="rounded bg-sky-950 px-2 py-1 text-[11px] text-sky-300 border border-sky-800/40">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20"
              >
                <Download className="size-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Tile>
  );
}

export function FinePrintBento({
  documentName = DEMO_AUDIT.documentName,
  jurisdiction = DEMO_AUDIT.jurisdiction,
  governingAct = DEMO_AUDIT.governingAct,
  overallRiskScore = DEMO_AUDIT.overallRiskScore,
  unenforceableClausesCount = DEMO_AUDIT.unenforceableClausesCount,
  liabilityTrapAmount = DEMO_AUDIT.liabilityTrapAmount,
  activeCards = DEMO_AUDIT.activeCards,
  violations = DEMO_AUDIT.violations,
  clauseAllocations = DEMO_AUDIT.clauseAllocations,
  auditLogs = DEMO_AUDIT.auditLogs,
  counterDraft = DEMO_AUDIT.counterDraft,
  pypdfExtracted,
  isLiveAI,
  engineNotice,
  onUploadClick,
  accent = "oklch(0.65 0.24 25)",
  accentAmber = "oklch(0.78 0.17 75)",
  accentSafe = "oklch(0.72 0.17 155)",
  className = "",
}: FinePrintBentoProps) {
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

        <div className="flex items-center gap-2">
          {onUploadClick && (
            <button
              type="button"
              onClick={onUploadClick}
              className="flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-500 px-3 py-1.5 font-bold text-white shadow transition active:scale-95"
            >
              <UploadCloud className="size-3.5" />
              <span>Upload PDF</span>
            </button>
          )}
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-white/70">
            {governingAct}
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-950">
            {jurisdiction}
          </span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HeroAuditTile
          documentName={documentName}
          riskScore={overallRiskScore}
          unenforceableCount={unenforceableClausesCount}
          auditLogs={auditLogs}
          pypdfExtracted={pypdfExtracted}
          accent={accent}
          accentAmber={accentAmber}
          accentSafe={accentSafe}
        />

        <DocumentsStackTile cards={activeCards} />

        <LitigationRiskGaugeTile
          trapAmount={liabilityTrapAmount}
          riskScore={overallRiskScore}
          accent={accent}
        />

        <FlaggedViolationsTile violations={violations} />

        <CounterDraftShieldTile
          counterDraft={counterDraft}
          documentName={documentName}
        />
      </div>
    </section>
  );
}

export default FinePrintBento;
