"use client";

import * as React from "react";
import { CloudShader } from "@/components/ui/cloud-shader";
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

  // Safe check for dark mode with mounted fallback
  const isDark = mounted ? isDarkMode : true;

  return (
    <div
      className={`relative min-h-[50rem] w-full overflow-hidden font-sans transition-colors duration-500 ease-in-out ${
        isDark ? "bg-[#05070f] text-white" : "bg-sky-50/70 text-slate-900"
      }`}
    >
      {/* Dynamic Cloud Shader background */}
      <CloudShader
        className="absolute inset-0 h-full w-full pointer-events-none opacity-85 transition-opacity duration-700"
        count={5}
        speed={0.8}
        skyTopColor={isDark ? "#030712" : "#3876ba"}
        skyBottomColor={isDark ? "#070f26" : "#8cbfe8"}
        cloudColor={isDark ? "#2563eb" : "#ffffff"}
      />

      {/* Ambient background glow & floating luminous clouds (Peeche Wale Baadal) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Top-left luminous cloud */}
        <div
          className={`absolute -top-32 -left-20 size-[38rem] rounded-full blur-3xl transition-all duration-700 animate-float-slow ${
            isDark
              ? "bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent"
              : "bg-gradient-to-br from-white/80 via-sky-200/50 to-transparent"
          }`}
        />
        {/* Top-right vibrant cyan-blue cloud */}
        <div
          className={`absolute top-1/4 -right-32 size-[44rem] rounded-full blur-3xl transition-all duration-700 animate-float-reverse ${
            isDark
              ? "bg-gradient-to-bl from-cyan-500/25 via-blue-600/20 to-transparent"
              : "bg-gradient-to-bl from-sky-200/40 via-blue-100/40 to-transparent"
          }`}
        />
        {/* Center ambient glow behind workspace flash card */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[52rem] rounded-full blur-3xl transition-all duration-700 animate-pulse-glow ${
            isDark
              ? "bg-gradient-to-r from-blue-600/25 via-sky-500/15 to-indigo-600/20"
              : "bg-gradient-to-r from-sky-200/30 via-white/50 to-blue-200/20"
          }`}
        />
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
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/95 text-sky-700 shadow-sm ring-2 ring-white/30">
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
            isDark ? "text-white/90" : "text-slate-700"
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
                ? "bg-white/10 text-white/90 border-white/20"
                : "bg-white/80 text-slate-700 border-slate-200 shadow-sm"
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
                ? "bg-white text-sky-900 hover:bg-white/90"
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
              ? "border border-white/30 bg-white/15 text-white"
              : "border border-sky-300/60 bg-white/80 text-sky-900"
          }`}
        >
          <Sparkles className={`size-3.5 ${isDark ? "text-amber-300" : "text-amber-500"}`} />
          <span>Evidence-Backed Misinformation & Claim Verification System</span>
        </div>

        <h1
          className={`text-4xl font-extrabold tracking-tight transition-colors duration-500 sm:text-6xl lg:text-7xl ${
            isDark ? "text-white drop-shadow-md" : "text-slate-900"
          }`}
        >
          Verify claims with <br className="hidden md:block" /> transparent evidence
        </h1>

        <p
          className={`mt-6 max-w-2xl text-base transition-colors duration-500 md:text-lg leading-relaxed ${
            isDark ? "text-white/95 drop-shadow-sm" : "text-slate-600"
          }`}
        >
          Extract factual claims from online content, retrieve credible sources via{" "}
          <strong
            className={`font-semibold underline ${
              isDark ? "text-white decoration-white/40" : "text-slate-900 decoration-sky-400"
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
                ? "bg-white text-sky-700 hover:bg-white/90"
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
                ? "border border-white/40 bg-white/10 text-white hover:bg-white/20"
                : "border border-slate-300 bg-white/80 text-slate-800 hover:bg-white shadow-sm"
            }`}
          >
            Explore Dashboard
          </a>
        </div>
      </div>

      {/* Main Interactive Container (Flash Card Workspace) */}
      <div
        id="verify"
        ref={inputRef}
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-20 md:mt-16 md:px-8"
      >
        <div
          className={`rounded-2xl md:rounded-[2rem] p-4 md:p-8 transition-all duration-500 bg-white text-slate-900 ${
            isDark
              ? "border border-sky-400/30 shadow-[0_0_55px_-10px_rgba(59,130,246,0.38)]"
              : "border border-slate-200/90 shadow-xl shadow-slate-200/70"
          }`}
        >
          {/* Engine Header inside flash card */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-200 shadow-sm">
                <Search className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ClaimProof AI Verification Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Paste content or upload a document to extract and verify claims
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {engineMessage && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-700">
                  {engineMessage}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
