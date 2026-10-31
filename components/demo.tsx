"use client";

import * as React from "react";
import { CloudShader } from "@/components/ui/cloud-shader";
import { StarField } from "@/components/ui/starfield";
import { VerifyAIBento } from "@/components/ui/verifyai-bento";
import { VerifyInput } from "@/components/ui/verify-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import type { VerificationResult, PipelineStage } from "@/lib/verify-types";
import { MOCK_VERIFICATION_RESULT } from "@/lib/mock-data";
import { Shield, CheckCircle2, Sparkles, ArrowDown, Search } from "lucide-react";

export function CloudShaderHeroDemo() {
  const { isDarkMode, mounted } = useTheme();
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

  // When not yet mounted, render default light mode to guarantee zero hydration mismatches
  const isDark = mounted ? isDarkMode : false;

  return (
    <div
      className={`relative min-h-[50rem] w-full overflow-hidden font-sans transition-colors duration-500 ease-in-out ${
        isDark ? "bg-[#030712] text-white" : "bg-sky-950 text-white"
      }`}
    >
      {/* Background: CloudShader for Light Mode, Twinkling Starfield for Dark Mode */}
      {isDark ? (
        <div className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700">
          <StarField />
        </div>
      ) : (
        <div className="absolute inset-0 h-full w-full transition-opacity duration-700">
          <CloudShader className="absolute inset-0 h-full w-full" count={5} speed={0.9} />
        </div>
      )}

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/95 px-5 py-3 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-8 items-center justify-center rounded-lg shadow-sm ring-2 transition-colors ${
              isDark
                ? "bg-zinc-900 text-sky-400 ring-zinc-700/80"
                : "bg-white/95 text-sky-700 ring-white/30"
            }`}
          >
            <Shield className="size-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            ClaimProof AI
          </span>
        </div>

        <div
          className={`hidden items-center gap-8 text-sm font-medium transition-colors md:flex ${
            isDark ? "text-zinc-300" : "text-white/90"
          }`}
        >
          <a href="#verify" className="hover:text-white transition">
            Claim Verifier
          </a>
          <a href="#verify" className="hover:text-white transition">
            Evidence RAG
          </a>
          <a href="#verify" className="hover:text-white transition">
            Knowledge Base
          </a>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono border transition-colors ${
              isDark
                ? "bg-zinc-900/80 text-zinc-300 border-zinc-800"
                : "bg-white/10 text-white/90 border-white/20"
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NLP Pipeline</span>
          </div>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={scrollToInput}
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-md transition hover:scale-105 active:scale-95 ${
              isDark
                ? "bg-white text-slate-950 hover:bg-zinc-100"
                : "bg-white text-sky-700 hover:bg-white/90"
            }`}
          >
            Verify Content
          </button>
        </div>
      </nav>

      {/* Hero Headline */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 text-center md:pt-16">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-md mb-5 shadow-sm transition-colors ${
            isDark
              ? "border border-zinc-800 bg-zinc-900/80 text-zinc-300"
              : "border border-white/30 bg-white/15 text-white"
          }`}
        >
          <Sparkles className={`size-3.5 ${isDark ? "text-amber-400" : "text-amber-300"}`} />
          <span>Evidence-Backed Misinformation & Claim Verification System</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Verify claims with <br className="hidden md:block" /> transparent evidence
        </h1>

        <p
          className={`mt-6 max-w-2xl text-base drop-shadow-sm md:text-lg leading-relaxed ${
            isDark ? "text-zinc-400" : "text-white/95"
          }`}
        >
          Extract factual claims from online content, retrieve credible sources via{" "}
          <strong
            className={`font-semibold underline ${
              isDark ? "text-white decoration-zinc-600" : "text-white underline decoration-white/40"
            }`}
          >
            semantic RAG
          </strong>
          , compare evidence, and present transparent assessments — no black-box AI verdicts.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToInput}
            className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-xl transition hover:-translate-y-0.5 active:scale-95 ${
              isDark
                ? "bg-white text-slate-950 hover:bg-zinc-100"
                : "bg-white text-sky-700 hover:bg-white/90"
            }`}
          >
            <span>Start Verifying</span>
            <ArrowDown className="size-4" />
          </button>
          <a
            href="#verify"
            className={`rounded-full px-7 py-3 text-sm font-semibold backdrop-blur-sm transition hover:-translate-y-0.5 ${
              isDark
                ? "border border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
                : "border border-white/40 bg-white/10 text-white hover:bg-white/20"
            }`}
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
        <div
          className={`rounded-2xl transition-all duration-500 backdrop-blur-2xl ${
            isDark
              ? "border border-zinc-800/80 bg-zinc-950/90 p-4 md:p-8 text-white shadow-[0_0_40px_-15px_rgba(255,255,255,0.07)] md:rounded-[2rem]"
              : "border border-sky-300/25 bg-gradient-to-b from-sky-900/35 via-sky-950/55 to-sky-950/75 p-4 md:p-8 shadow-[0_25px_60px_-15px_rgba(2,6,23,0.7),0_0_45px_rgba(56,189,248,0.14)] ring-1 ring-white/15 md:rounded-[2rem] text-white"
          }`}
        >
          {/* Engine Header */}
          <div
            className={`mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4 transition-colors ${
              isDark ? "border-zinc-800/80" : "border-white/15"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                  isDark
                    ? "bg-zinc-900 text-sky-400 ring-1 ring-zinc-800"
                    : "bg-sky-600/20 text-sky-400 ring-1 ring-sky-500/30"
                }`}
              >
                <Search className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  ClaimProof AI Verification Engine
                </h3>
                <p className={`text-xs transition-colors ${isDark ? "text-zinc-400" : "text-white/70"}`}>
                  Paste content or upload a document to extract and verify claims
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {engineMessage && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] border transition-colors ${
                    isDark
                      ? "border border-zinc-800 bg-zinc-900/80 text-zinc-300"
                      : "border border-white/20 bg-white/10 text-white/80"
                  }`}
                >
                  {engineMessage}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                  isDark
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                }`}
              >
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
