"use client";

import * as React from "react";
import { CloudShader } from "@/components/ui/cloud-shader";
import { FinePrintBento } from "@/components/ui/fineprint-bento";
import { PDFDropzone } from "@/components/ui/pdf-dropzone";
import { FullAuditResult } from "@/lib/model";
import { Scale, FileText, CheckCircle2, Sparkles, ArrowDown } from "lucide-react";

export function CloudShaderHeroDemo() {
  const [currentAudit, setCurrentAudit] = React.useState<FullAuditResult | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const dropzoneRef = React.useRef<HTMLDivElement>(null);

  const handleAuditComplete = (result: FullAuditResult) => {
    setCurrentAudit(result);
    setToast(
      `Audited "${result.documentName}" with pypdf (${result.pypdfExtracted?.numPages || 1} pages parsed)`
    );
    setTimeout(() => setToast(null), 4000);
  };

  const scrollToDropzone = () => {
    dropzoneRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[50rem] w-full overflow-hidden bg-sky-950 font-sans">
      <CloudShader className="absolute inset-0 h-full w-full" count={5} speed={0.9} />

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/95 px-5 py-3 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur-xl">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/95 text-sky-700 shadow-sm ring-2 ring-white/30">
            <Scale className="size-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            FinePrint AI
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          <a href="#audit" className="hover:text-white transition">PDF Auditor</a>
          <a href="#audit" className="hover:text-white transition">Sec 27 & 74 ICA</a>
          <a href="#audit" className="hover:text-white transition">Case Precedents</a>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-white/90 border border-white/20">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Python pypdf</span>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToDropzone}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-white/90 hover:scale-105 active:scale-95"
        >
          Upload Contract PDF
        </button>
      </nav>

      {/* Hero Headline */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 text-center md:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md mb-5 shadow-sm">
          <Sparkles className="size-3.5 text-amber-300" />
          <span>Indian Employment & Tenancy Bond Auditor</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Legal contract audit <br className="hidden md:block" /> above the clouds
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/95 drop-shadow-sm md:text-lg leading-relaxed">
          Audit employment offer letters, service bonds, and rental deeds using Python{" "}
          <strong className="font-semibold text-white underline decoration-white/40">pypdf</strong>. Detect illegal liquidated damages, marksheet retention, and void non-competes in seconds.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToDropzone}
            className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-sky-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-white/90 active:scale-95"
          >
            <span>Upload & Audit PDF</span>
            <ArrowDown className="size-4" />
          </button>
          <a
            href="#audit"
            className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:-translate-y-0.5"
          >
            Explore Dashboard
          </a>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div
        id="audit"
        ref={dropzoneRef}
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-20 md:mt-16 md:px-8"
      >
        <div className="rounded-2xl border border-white/30 bg-black/80 p-3 shadow-2xl backdrop-blur-2xl md:rounded-[2rem] md:p-6 text-foreground">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400 ring-1 ring-red-500/30">
                <Scale className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">FinePrint AI Legal Engine</h3>
                <p className="text-xs text-white/70">
                  Drop your contract PDF to extract text with pypdf and audit under Indian law
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentAudit?.pypdfExtracted && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 font-mono text-xs text-blue-300">
                  <FileText className="size-3.5" />
                  pypdf: {currentAudit.pypdfExtracted.numPages || 1} pgs •{" "}
                  {currentAudit.pypdfExtracted.charCount || 0} chars
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-xs text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                ICA 1872 Parser Active
              </span>
            </div>
          </div>

          <div className="mb-6">
            <PDFDropzone
              onAuditComplete={handleAuditComplete}
              currentDocumentName={currentAudit?.documentName}
            />
          </div>

          <FinePrintBento
            documentName={currentAudit?.documentName}
            jurisdiction={currentAudit?.jurisdiction}
            governingAct={currentAudit?.governingAct}
            overallRiskScore={currentAudit?.overallRiskScore}
            unenforceableClausesCount={currentAudit?.unenforceableClausesCount}
            liabilityTrapAmount={currentAudit?.liabilityTrapAmount}
            activeCards={currentAudit?.activeCards}
            violations={currentAudit?.violations}
            clauseAllocations={currentAudit?.clauseAllocations}
            auditLogs={currentAudit?.auditLogs}
            counterDraft={currentAudit?.counterDraft}
            pypdfExtracted={currentAudit?.pypdfExtracted}
            isLiveAI={currentAudit?.isLiveAI}
            engineNotice={currentAudit?.engineMessage}
            onUploadClick={scrollToDropzone}
            accent={currentAudit?.accent}
            accentAmber={currentAudit?.accentAmber}
            accentSafe={currentAudit?.accentSafe}
          />
        </div>
      </div>
    </div>
  );
}

export default CloudShaderHeroDemo;
