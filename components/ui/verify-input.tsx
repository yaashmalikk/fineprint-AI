"use client";

import * as React from "react";
import {
  UploadCloud,
  Globe,
  FileText,
  Files,
  AlertTriangle,
  RefreshCw,
  X,
  Zap,
  Link2,
  Plus,
  Trash2,
} from "lucide-react";
import { verifyContent, loadViralSample } from "@/lib/verify-engine";
import type { VerificationResult, InputMode, PipelineStage } from "@/lib/verify-types";
import { PIPELINE_STAGES } from "@/lib/verify-types";
import { VIRAL_CORPORATE_SAMPLE_TEXT } from "@/lib/mock-data";

interface VerifyInputProps {
  onVerificationComplete: (result: VerificationResult, isLiveAI: boolean, engineMsg: string) => void;
  onPipelineStageChange: (stage: PipelineStage | "complete") => void;
  className?: string;
}

export function VerifyInput({
  onVerificationComplete,
  onPipelineStageChange,
  className = "",
}: VerifyInputProps) {
  const [mode, setMode] = React.useState<InputMode>("online");
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<
    { name: string; size: number; base64: string }[]
  >([]);
  const [contentText, setContentText] = React.useState(VIRAL_CORPORATE_SAMPLE_TEXT);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Drag-and-drop handlers
  React.useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      const hasFiles = e.dataTransfer?.types ? Array.from(e.dataTransfer.types).includes("Files") : false;
      if (hasFiles) setIsDragging(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setMode("document");
        handleFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  const handleFiles = (files: FileList | File[]) => {
    setError(null);
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const invalid = fileArray.filter((f) => {
      const name = (f.name || "").toLowerCase();
      const type = (f.type || "").toLowerCase();
      const hasValidExt = validExtensions.some((ext) => name.endsWith(ext));
      const hasValidMime = type.includes("pdf") || type.includes("image");
      return !hasValidExt && !hasValidMime;
    });

    if (invalid.length > 0) {
      setError(
        `Unsupported file format for: ${invalid.map((f) => f.name).join(", ")}. Please upload PDF or image files.`
      );
      return;
    }

    const oversize = fileArray.filter((f) => f.size > 25 * 1024 * 1024);
    if (oversize.length > 0) {
      setError(`File exceeds maximum 25MB limit: ${oversize.map((f) => f.name).join(", ")}`);
      return;
    }

    const readers = fileArray.map((file) => {
      return new Promise<{ name: string; size: number; base64: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = (reader.result as string) || "";
          const b64 = res.includes(",") ? res.split(",")[1] : res;
          resolve({ name: file.name, size: file.size, base64: b64 || "" });
        };
        reader.onerror = () => {
          resolve({ name: file.name, size: file.size, base64: "" });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newItems) => {
      const validItems = newItems.filter((item) => item.base64 && item.base64.length > 0);
      if (validItems.length === 0 && newItems.length > 0) {
        setError("Could not read uploaded document data. Please try selecting the file again.");
        return;
      }
      setSelectedFiles((prev) => {
        const existing = new Set(prev.map((p) => p.name));
        const filtered = validItems.filter((item) => !existing.has(item.name));
        return [...prev, ...filtered];
      });
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const runVerification = async () => {
    setIsVerifying(true);
    setScanStep(0);
    setError(null);

    const stepTimer = setInterval(() => {
      setScanStep((s) => {
        const next = Math.min(s + 1, PIPELINE_STAGES.length - 1);
        onPipelineStageChange(PIPELINE_STAGES[next].stage);
        return next;
      });
    }, 1200);

    onPipelineStageChange("extraction");

    try {
      const { result, isLiveAI, engineMessage } = await verifyContent({
        mode,
        files: selectedFiles,
        pdfBase64: selectedFiles[0]?.base64,
        fileName: selectedFiles[0]?.name,
        contentText: mode === "online" ? contentText : undefined,
      });
      onPipelineStageChange("complete");
      onVerificationComplete(result, isLiveAI, engineMessage);
      if (result.is_valid_factual_content === false) {
        setError(result.verdict_summary || engineMessage);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Verification failed");
    } finally {
      clearInterval(stepTimer);
      setIsVerifying(false);
    }
  };

  const handleLoadSample = () => {
    setIsVerifying(true);
    setError(null);
    onPipelineStageChange("extraction");

    setTimeout(() => {
      onPipelineStageChange("retrieval");
      setTimeout(() => {
        onPipelineStageChange("ranking");
        setTimeout(() => {
          onPipelineStageChange("assessment");
          setTimeout(() => {
            const { text, result } = loadViralSample();
            setContentText(text);
            onPipelineStageChange("complete");
            onVerificationComplete(result, false, "Loaded viral corporate misinformation sample (demo mode)");
            setIsVerifying(false);
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dragging Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-sky-950/90 backdrop-blur-md p-6">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-sky-600/30 ring-2 ring-sky-400 text-sky-200 animate-bounce">
            <UploadCloud className="size-12" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">Drop your file here</h2>
          <p className="mt-1 text-sm text-sky-200">PDF or image — we'll extract and verify claims</p>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("document")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
            mode === "document"
              ? "bg-white text-sky-900 shadow-md"
              : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <FileText className="size-4" />
          Document & Contract Audit
        </button>
        <button
          type="button"
          onClick={() => setMode("online")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
            mode === "online"
              ? "bg-white text-sky-900 shadow-md"
              : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Globe className="size-4" />
          Online Content & Post Verifier
        </button>

        <div className="ml-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isVerifying}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-2 text-[11px] font-bold text-amber-300 transition hover:bg-amber-500/30 disabled:opacity-50 active:scale-95"
          >
            <Zap className="size-3.5" />
            Load Viral Corporate Misinformation Sample
          </button>
        </div>
      </div>

      {/* Input Area */}
      {mode === "document" ? (
        <div
          onClick={() => !isVerifying && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 transition hover:border-sky-400/60 hover:bg-white/[0.08] active:scale-[0.99]"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf,.png,.jpg,.jpeg,.webp,image/*"
            className="hidden"
            onClick={(e) => {
              e.stopPropagation();
              (e.target as HTMLInputElement).value = "";
            }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(Array.from(e.target.files));
              }
            }}
          />

          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30 transition group-hover:scale-110">
              {isVerifying ? (
                <RefreshCw className="size-7 animate-spin text-sky-300" />
              ) : selectedFiles.length > 1 ? (
                <Files className="size-7" />
              ) : (
                <UploadCloud className="size-7" />
              )}
            </div>

            <div className="mt-4">
              <p className="text-base font-semibold text-white">
                {isVerifying
                  ? `Extracting & verifying claims across ${selectedFiles.length} file(s)...`
                  : selectedFiles.length > 0
                    ? `${selectedFiles.length} Document(s) Selected — Click to Add More`
                    : "Drop PDF(s) or images here, or browse (Multiple Files Supported)"}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Upload one or multiple offer letters, annexures, bond deeds, or scanned notices (up to 25MB each)
              </p>
            </div>

            {selectedFiles.length > 0 && !isVerifying && (
              <div className="mt-4 w-full">
                <div className="flex flex-wrap items-center justify-center gap-2 max-h-48 overflow-y-auto p-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/40 px-3 py-1.5 text-xs text-white/90 shadow-sm transition hover:border-sky-400"
                    >
                      <FileText className="size-3.5 text-sky-400 shrink-0" />
                      <span className="font-medium truncate max-w-[180px]">{file.name}</span>
                      <span className="text-white/50 text-[11px] shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="hover:text-rose-400 transition ml-1"
                        title="Remove file"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-sky-300 hover:bg-sky-500/20 transition"
                  >
                    <Plus className="size-3" />
                    Add More Files
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFiles();
                    }}
                    className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-rose-300 hover:bg-rose-900/30 transition"
                  >
                    <Trash2 className="size-3" />
                    Clear All ({selectedFiles.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Paste any viral claim, social media post, LinkedIn announcement, news article, or URL here..."
            rows={7}
            className="w-full rounded-2xl border border-white/20 bg-white/5 p-4 text-sm font-mono text-white placeholder-white/30 backdrop-blur-xl resize-none focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition leading-relaxed"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Link2 className="size-3.5" />
              <span>Or load preset claim:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setContentText(VIRAL_CORPORATE_SAMPLE_TEXT)}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
              >
                Full Viral Offer
              </button>
              <button
                type="button"
                onClick={() => setContentText("Candidate must pay non-negotiable exit penalty of Rs 2,50,000 if resigning before 24 months. Amount cannot be challenged in court.")}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
              >
                ₹2.5L Bond Clause
              </button>
              <button
                type="button"
                onClick={() => setContentText("Employee original degree marksheets and graduation certificate will remain in company physical custody during probation.")}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
              >
                Certificate Custody
              </button>
              <button
                type="button"
                onClick={() => setContentText("Employee is strictly prohibited from working in tech or joining any competitor anywhere across India for 2 years post exit.")}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10 transition"
              >
                Void Non-Compete
              </button>
              <button
                type="button"
                onClick={() => setContentText("")}
                className="rounded-full border border-rose-500/20 bg-rose-950/20 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-900/30 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      {isVerifying && (
        <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-950/60 p-3">
          <div className="flex items-center justify-between text-xs text-sky-200">
            <span className="font-mono">
              Stage {scanStep + 1} of {PIPELINE_STAGES.length}
            </span>
            <span className="animate-pulse">{PIPELINE_STAGES[scanStep].detail}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${((scanStep + 1) / PIPELINE_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-400">
          <AlertTriangle className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Verify Button */}
      <button
        type="button"
        disabled={isVerifying || (mode === "online" ? contentText.trim().length === 0 : selectedFiles.length === 0)}
        onClick={runVerification}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isVerifying ? (
          <RefreshCw className="size-4 animate-spin text-white" />
        ) : (
          <Zap className="size-4" />
        )}
        {isVerifying
          ? "Verifying with RAG Pipeline..."
          : mode === "document" && selectedFiles.length > 1
            ? `Verify & Cross-Audit ${selectedFiles.length} Documents`
            : "Verify & Extract Claims"}
      </button>
    </div>
  );
}

export default VerifyInput;

