"use client";

import * as React from "react";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  Scale,
  ArrowRight,
} from "lucide-react";
import {
  auditContractDocument,
  generateSimulatedAudit,
  FullAuditResult,
} from "@/lib/model";

interface PDFDropzoneProps {
  onAuditComplete: (result: FullAuditResult) => void;
  currentDocumentName?: string;
  className?: string;
}

const SCAN_STEPS = [
  "Extracting pages & clauses with pypdf...",
  "Auditing Section 27 & 74 ICA compliance...",
  "Synthesizing legal risks & counter-draft...",
];

export function PDFDropzone({
  onAuditComplete,
  currentDocumentName,
  className = "",
}: PDFDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<{
    name: string;
    size: number;
    base64: string;
  } | null>(null);
  const [isAuditing, setIsAuditing] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) setIsDragging(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files?.[0]) handleFile(e.dataTransfer.files[0]);
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

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError("Please choose a valid PDF file (.pdf)");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File exceeds maximum 25MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string).split(",")[1] || "";
      setSelectedFile({ name: file.name, size: file.size, base64: b64 });
      runAudit(b64, file.name, file.size);
    };
    reader.readAsDataURL(file);
  };

  const runAudit = async (pdfBase64?: string, fileName?: string, fileSize?: number) => {
    setIsAuditing(true);
    setScanStep(0);
    setError(null);

    const stepTimer = setInterval(() => {
      setScanStep((s) => (s < SCAN_STEPS.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const data = await auditContractDocument({ pdfBase64, fileName, fileSize });
      onAuditComplete(data);
    } catch (err: any) {
      setError(err?.message || "Audit request failed");
    } finally {
      clearInterval(stepTimer);
      setIsAuditing(false);
    }
  };

  const loadSample = (type: string) => {
    setIsAuditing(true);
    setError(null);
    try {
      const names: Record<string, string> = {
        safe: "Fair_Startup_SDE2_Offer.pdf",
        rent: "Bangalore_HSR_Rent_Agreement.pdf",
        bond: "Tech_Corp_2Y_Service_Bond.pdf",
      };
      const data = generateSimulatedAudit(names[type] || "Acme_Corp_Offer_Letter.pdf");
      onAuditComplete(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load sample");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dragging Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-950/90 backdrop-blur-md p-6">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-sky-600/30 ring-2 ring-sky-400 text-sky-200 animate-bounce">
            <UploadCloud className="size-12" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">Drop your Contract PDF here</h2>
          <p className="mt-1 text-sm text-sky-200">pypdf will extract text and audit statutory clauses</p>
        </div>
      )}

      {/* Main Dropzone Card */}
      <div
        onClick={() => !isAuditing && fileInputRef.current?.click()}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 transition hover:border-sky-400/60 hover:bg-white/[0.08] active:scale-[0.99]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30 transition group-hover:scale-110">
            {isAuditing ? (
              <RefreshCw className="size-7 animate-spin text-sky-300" />
            ) : (
              <UploadCloud className="size-7" />
            )}
          </div>

          <div className="mt-4">
            <p className="text-base font-semibold text-white">
              {isAuditing ? "Processing contract..." : "Drop your contract PDF here, or browse"}
            </p>
            <p className="mt-1 text-xs text-white/60">
              Works with offer letters, service bonds, and rental deeds up to 25MB
            </p>
          </div>

          {/* Stepper progress during audit */}
          {isAuditing && (
            <div className="mt-4 w-full max-w-sm rounded-xl border border-sky-500/30 bg-sky-950/60 p-3">
              <div className="flex items-center justify-between text-xs text-sky-200">
                <span className="font-mono">Step {scanStep + 1} of {SCAN_STEPS.length}</span>
                <span className="animate-pulse">{SCAN_STEPS[scanStep]}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-400">
              <AlertTriangle className="size-4" />
              <span>{error}</span>
            </div>
          )}

          {selectedFile && !isAuditing && (
            <div className="mt-3 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90">
              <FileText className="size-3.5 text-sky-400" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-white/50">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset Samples */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-xs font-medium text-white/60">Or test with presets:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "bond", label: "₹2.5L Bond Agreement" },
            { id: "safe", label: "Compliant SDE Offer" },
            { id: "rent", label: "Rental Agreement" },
          ].map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={isAuditing}
              onClick={() => loadSample(sample.id)}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
