import { spawn } from "child_process";
import path from "path";

export interface PyPDFExtractionResult {
  success: boolean;
  num_pages?: number;
  metadata?: Record<string, string>;
  full_text?: string;
  detected_clauses?: { clause: string; heading: string }[];
  char_count?: number;
  error?: string;
}

export async function extractPDFWithPyPDF(
  pdfBase64: string,
  timeoutMs = 15000
): Promise<PyPDFExtractionResult> {
  return new Promise((resolve) => {
    try {
      const scriptPath = path.join(process.cwd(), "scripts", "extract_pdf.py");
      const py = spawn("python", [scriptPath, "--stdin"], { windowsHide: true });

      let stdout = "";
      let stderr = "";

      const timer = setTimeout(() => {
        py.kill();
        resolve({ success: false, error: "Extraction timed out" });
      }, timeoutMs);

      py.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      py.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      py.on("close", (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          resolve({ success: false, error: stderr || `Process exited with code ${code}` });
          return;
        }
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch {
          resolve({ success: false, error: "Failed to parse extraction result" });
        }
      });

      py.on("error", (err) => {
        clearTimeout(timer);
        resolve({ success: false, error: err.message });
      });

      py.stdin.write(JSON.stringify({ pdfBase64 }));
      py.stdin.end();
    } catch (err: any) {
      resolve({ success: false, error: err?.message || "Execution error" });
    }
  });
}
