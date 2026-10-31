"use client";

import * as React from "react";
import { CloudShader } from "@/components/ui/cloud-shader";
import { VerifyAIBento } from "@/components/ui/verifyai-bento";
import { VerifyInput } from "@/components/ui/verify-input";
import type { VerificationResult, PipelineStage } from "@/lib/verify-types";
import { MOCK_VERIFICATION_RESULT } from "@/lib/mock-data";
import { Shield, CheckCircle2, Sparkles, ArrowDown, Search } from "lucide-react";

export function CloudShaderHeroDemo() {
  const [currentResult, setCurrentResult] = React.useState<VerificationResult>(MOCK_VERIFICATION_RESULT);
  const [isLiveAI, setIsLiveAI] = React.useState(false);
  const [engineMessage, setEngineMessage] = React.useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = React.useState<PipelineStage | "complete">("complete");
  const [toast, setToast] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLDivElement>(null);

  const handleVerificationComplete = (
    result: VerificationResult,
    live: boolean,
    msg: string
  ) => {
    setCurrentResult(result);
    setIsLiveAI(live);
    setEngineMessage(msg);
    setToast(
      `Verified ${result.claims.length} claims — Credibility: ${result.overall_credibility_score}/100`
    );
    setTimeout(() => setToast(null), 4000);
  };

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
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
            <Shield className="size-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            VerifyAI
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          <a href="#verify" className="hover:text-white transition">
            Claim Verifier
          </a>
          <a href="#verify" className="hover:text-white transition">
            Evidence RAG
          </a>
          <a href="#verify" className="hover:text-white transition">
            Knowledge Base
          </a>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-white/90 border border-white/20">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NLP Pipeline</span>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToInput}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-white/90 hover:scale-105 active:scale-95"
        >
          Verify Content
        </button>
      </nav>

      {/* Hero Headline */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 text-center md:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md mb-5 shadow-sm">
          <Sparkles className="size-3.5 text-amber-300" />
          <span>Evidence-Backed Misinformation & Claim Verification System</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Verify claims with <br className="hidden md:block" /> transparent evidence
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/95 drop-shadow-sm md:text-lg leading-relaxed">
          Extract factual claims from online content, retrieve credible sources via{" "}
          <strong className="font-semibold text-white underline decoration-white/40">
            semantic RAG
          </strong>
          , compare evidence, and present transparent assessments — no black-box AI verdicts.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToInput}
            className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-sky-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-white/90 active:scale-95"
          >
            <span>Start Verifying</span>
            <ArrowDown className="size-4" />
          </button>
          <a
            href="#verify"
            className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:-translate-y-0.5"
          >
            Explore Dashboard
          </a>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div
        id="verify"
        ref={inputRef}
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-20 md:mt-16 md:px-8"
      >
        <div className="rounded-2xl border border-white/30 bg-black/80 p-3 shadow-2xl backdrop-blur-2xl md:rounded-[2rem] md:p-6 text-foreground">
          {/* Engine Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400 ring-1 ring-sky-500/30">
                <Search className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  VerifyAI Verification Engine
                </h3>
                <p className="text-xs text-white/70">
                  Paste content or upload a document to extract and verify claims
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {engineMessage && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] text-white/80">
                  {engineMessage}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-xs text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                NLP + RAG Pipeline Active
              </span>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <VerifyInput
              onVerificationComplete={handleVerificationComplete}
              onPipelineStageChange={setPipelineStage}
            />
          </div>

          {/* Results Bento */}
          <VerifyAIBento
            result={currentResult}
            isLiveAI={isLiveAI}
            engineNotice={engineMessage || undefined}
            pipelineStage={pipelineStage}
          />
        </div>
      </div>
    </div>
  );
}

export default CloudShaderHeroDemo;
