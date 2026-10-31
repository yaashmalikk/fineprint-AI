"use client";

import * as React from "react";
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

  const isDark = mounted ? isDarkMode : true;

  return (
    <div
      className={`relative min-h-[50rem] w-full overflow-hidden font-sans transition-colors duration-500 ease-in-out ${
        isDark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Starry Night Sky: Subtle blinking & twinkling stars, completely clean with NO clouds */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <StarField />
      </div>

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
            className={`flex size-8 items-center justify-center rounded-lg shadow-sm ring-1 transition-colors ${
              isDark
                ? "bg-zinc-900 text-sky-400 ring-zinc-700/80"
                : "bg-white text-sky-700 ring-slate-200"
            }`}
          >
            <Shield className="size-4" />
          </div>
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white drop-shadow-sm" : "text-slate-900"
            }`}
          >
            ClaimProof AI
          </span>
        </div>

        <div
          className={`hidden items-center gap-8 text-sm font-medium transition-colors duration-500 md:flex ${
            isDark ? "text-zinc-300" : "text-slate-700"
          }`}
        >
          <a href="#verify" className={`transition ${isDark ? "hover:text-white" : "hover:text-sky-600"}`}>
            Claim Verifier
          </a>
          <a href="#verify" className={`transition ${isDark ? "hover:text-white" : "hover:text-sky-600"}`}>
            Evidence RAG
          </a>
          <a href="#verify" className={`transition ${isDark ? "hover:text-white" : "hover:text-sky-600"}`}>
            Knowledge Base
          </a>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono border transition-colors ${
              isDark
                ? "bg-zinc-900/80 text-zinc-300 border-zinc-800"
                : "bg-white text-slate-700 border-slate-200 shadow-sm"
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NLP Pipeline</span>
          </div>
        </div>

        {/* Top-Right Action Controls (Theme Toggle + CTA) */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={scrollToInput}
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-md transition hover:scale-105 active:scale-95 ${
              isDark
                ? "bg-white text-slate-950 hover:bg-zinc-100"
                : "bg-sky-600 text-white hover:bg-sky-700"
            }`}
          >
            Verify Content
          </button>
        </div>
      </nav>

      {/* Hero Headline */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 text-center md:pt-16">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-md mb-5 shadow-sm transition-colors duration-500 ${
            isDark
              ? "border border-zinc-800 bg-zinc-900/80 text-zinc-300"
              : "border border-slate-200 bg-white text-slate-800"
          }`}
        >
          <Sparkles className={`size-3.5 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
          <span>Evidence-Backed Misinformation & Claim Verification System</span>
        </div>

        <h1
          className={`text-4xl font-extrabold tracking-tight transition-colors duration-500 sm:text-6xl lg:text-7xl ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Verify claims with <br className="hidden md:block" /> transparent evidence
        </h1>

        <p
          className={`mt-6 max-w-2xl text-base transition-colors duration-500 md:text-lg leading-relaxed ${
            isDark ? "text-zinc-400" : "text-slate-600"
          }`}
        >
          Extract factual claims from online content, retrieve credible sources via{" "}
          <strong
            className={`font-semibold underline ${
              isDark ? "text-white decoration-zinc-600" : "text-slate-900 decoration-sky-400"
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
                : "bg-sky-600 text-white hover:bg-sky-700"
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
                : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-sm"
            }`}
          >
            Explore Dashboard
          </a>
        </div>
      </div>

      {/* Main Interactive Workspace Card (Sleek Dark Glassmorphism in Dark Mode / Crisp White in Light Mode) */}
      <div
        id="verify"
        ref={inputRef}
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-20 md:mt-16 md:px-8"
      >
        <div
          className={`rounded-2xl md:rounded-[2rem] p-4 md:p-8 transition-all duration-500 backdrop-blur-md ${
            isDark
              ? "bg-zinc-950/80 border border-zinc-800/80 text-white shadow-[0_0_40px_-15px_rgba(255,255,255,0.07)]"
              : "bg-white border border-slate-200/90 text-slate-900 shadow-sm"
          }`}
        >
          {/* Engine Header inside card */}
          <div
            className={`mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4 transition-colors ${
              isDark ? "border-zinc-800/80" : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                  isDark
                    ? "bg-zinc-900 text-sky-400 ring-1 ring-zinc-800"
                    : "bg-sky-50 text-sky-600 ring-1 ring-sky-200 shadow-sm"
                }`}
              >
                <Search className="size-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  ClaimProof AI Verification Engine
                </h3>
                <p className={`text-xs transition-colors ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                  Paste content or upload a document to extract and verify claims
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {engineMessage && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] border transition-colors ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900/80 text-zinc-300"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  }`}
                >
                  {engineMessage}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border transition-colors ${
                  isDark
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-emerald-500/30 bg-emerald-50 text-emerald-700"
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
