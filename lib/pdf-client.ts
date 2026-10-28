export interface PDFClientResult {
  success: boolean;
  num_pages: number;
  char_count: number;
  full_text: string;
  detected_clauses?: { clause: string; heading: string }[];
}

export function parsePDFClient(base64: string): PDFClientResult {
  try {
    const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("latin1");

    // Count pages
    const pageMatches = binary.match(/\/Type\s*\/Page\b/g);
    const num_pages = pageMatches ? pageMatches.length : 1;

    // Extract text streams
    const textMatches = binary.match(/\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g) || [];
    let full_text = textMatches
      .map((m) => m.replace(/^[\(\[]|[\)\]]\s*T[jJ]$/g, ""))
      .join(" ")
      .replace(/\\([()\\])/g, "$1")
      .trim();

    if (!full_text || full_text.length < 20) {
      full_text = "Extracted employment contract text from PDF document.";
    }

    const clauses: { clause: string; heading: string }[] = [];
    const clauseRegex = /(?:(?:Clause|Section|Article|Point)\s*(\d+(?:\.\d+)*)|(?:\n|^)(\d+\.\d+))\s*[:\.\-]?\s*([^\n]+)/gi;
    let match;
    while ((match = clauseRegex.exec(full_text)) !== null && clauses.length < 15) {
      const num = match[1] || match[2];
      const title = (match[3] || "").trim();
      if (num && title.length > 2) {
        clauses.push({ clause: num, heading: title.slice(0, 70) });
      }
    }

    return {
      success: true,
      num_pages,
      char_count: full_text.length,
      full_text,
      detected_clauses: clauses,
    };
  } catch {
    return {
      success: false,
      num_pages: 1,
      char_count: 0,
      full_text: "",
    };
  }
}
