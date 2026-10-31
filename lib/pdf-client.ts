export interface PDFClientResult {
  success: boolean;
  num_pages: number;
  char_count: number;
  full_text: string;
  detected_clauses?: { clause: string; heading: string }[];
}

async function decompressFlate(bytes: Uint8Array): Promise<string> {
  // 1. Try Node.js zlib if available (SSR / tests)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const zlib = require("zlib");
    if (zlib && typeof zlib.inflateSync === "function") {
      try {
        return zlib.inflateSync(Buffer.from(bytes)).toString("latin1");
      } catch {
        try {
          return zlib.inflateRawSync(Buffer.from(bytes)).toString("latin1");
        } catch {
          // continue
        }
      }
    }
  } catch {
    // Not in Node environment
  }

  // 2. Try browser DecompressionStream (Chrome 80+, Safari 16.4+, Edge, Firefox 102+)
  if (typeof DecompressionStream !== "undefined") {
    for (const format of ["deflate", "deflate-raw"] as const) {
      try {
        const ds = new DecompressionStream(format);
        const writer = ds.writable.getWriter();
        await writer.write(bytes as unknown as BufferSource);
        await writer.close();
        const reader = ds.readable.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }
        const total = chunks.reduce((acc, c) => acc + c.length, 0);
        const merged = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) {
          merged.set(c, offset);
          offset += c.length;
        }
        return new TextDecoder("latin1").decode(merged);
      } catch {
        // try fallback format
      }
    }
  }

  return "";
}

function extractTextFromDecoded(str: string): string[] {
  const parts: string[] = [];

  // 1. Literal strings in Tj: (text) Tj
  const tjRegex = /\(((?:[^\\)]|\\.)*)\)\s*Tj/g;
  let m: RegExpExecArray | null;
  while ((m = tjRegex.exec(str)) !== null) {
    const unescaped = m[1].replace(/\\([()\\])/g, "$1").trim();
    if (unescaped) parts.push(unescaped);
  }

  // 2. Array strings in TJ: [(text) -10 (more)] TJ
  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((m = tjArrayRegex.exec(str)) !== null) {
    const inner = m[1];
    const subRegex = /\(((?:[^\\)]|\\.)*)\)/g;
    let sm: RegExpExecArray | null;
    let combined = "";
    while ((sm = subRegex.exec(inner)) !== null) {
      combined += sm[1].replace(/\\([()\\])/g, "$1");
    }
    const clean = combined.trim();
    if (clean) parts.push(clean);
  }

  // 3. Hex strings: <48656c6c6f> Tj or [<48656c6c6f>] TJ
  const hexRegex = /<([0-9a-fA-F]+)>\s*T[jJ]/g;
  while ((m = hexRegex.exec(str)) !== null) {
    const hex = m[1];
    let decoded = "";
    for (let i = 0; i < hex.length; i += 2) {
      decoded += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    const clean = decoded.trim();
    if (clean) parts.push(clean);
  }

  // 4. Apostrophe & Quote operators: ' and "
  const quoteRegex = /\(((?:[^\\)]|\\.)*)\)\s*['"]/g;
  while ((m = quoteRegex.exec(str)) !== null) {
    const unescaped = m[1].replace(/\\([()\\])/g, "$1").trim();
    if (unescaped) parts.push(unescaped);
  }

  return parts;
}

export async function parsePDFClientAsync(base64: string): Promise<PDFClientResult> {
  try {
    const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("latin1");

    // Count pages
    const pageMatches = binary.match(/\/Type\s*\/Page\b/g);
    const num_pages = pageMatches ? pageMatches.length : 1;

    const allExtracted: string[] = [];

    // Find all stream ... endstream blocks
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch: RegExpExecArray | null;

    while ((streamMatch = streamRegex.exec(binary)) !== null) {
      const rawData = streamMatch[1];
      const streamStart = streamMatch.index;
      const dictSlice = binary.slice(Math.max(0, streamStart - 350), streamStart);
      const isFlate = /Filter\s*(?:\/FlateDecode|\[\s*\/FlateDecode\s*\])/i.test(dictSlice);

      if (isFlate) {
        const bytes = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; i++) {
          bytes[i] = rawData.charCodeAt(i);
        }
        const decompressed = await decompressFlate(bytes);
        if (decompressed) {
          const texts = extractTextFromDecoded(decompressed);
          allExtracted.push(...texts);
        }
      } else {
        const texts = extractTextFromDecoded(rawData);
        allExtracted.push(...texts);
      }
    }

    // Also check raw binary for any uncompressed text if stream extraction found nothing
    if (allExtracted.length === 0) {
      allExtracted.push(...extractTextFromDecoded(binary));
    }

    // Fallback: extract legible printable text fragments if still empty
    if (allExtracted.length === 0) {
      const asciiMatches = binary.match(/[a-zA-Z0-9\s,.\-':;₹]{10,}/g) || [];
      const filtered = asciiMatches
        .map((s) => s.trim())
        .filter((s) => s.length >= 12 && !s.startsWith("/") && !s.includes("endobj") && !s.includes("xref") && !s.includes("trailer"));
      if (filtered.length > 0) {
        allExtracted.push(...filtered.slice(0, 30));
      }
    }

    const full_text = allExtracted.join(" ").replace(/\s+/g, " ").trim();

    // Clause detection
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
      full_text: full_text || "Uploaded PDF document content ready for verification.",
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

// Synchronous version for backwards compatibility with legacy callers
export function parsePDFClient(base64: string): PDFClientResult {
  try {
    const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("latin1");
    const pageMatches = binary.match(/\/Type\s*\/Page\b/g);
    const num_pages = pageMatches ? pageMatches.length : 1;

    // Synchronous stream / raw text extraction
    const allExtracted = extractTextFromDecoded(binary);

    // If in Node.js, try zlib sync
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const zlib = require("zlib");
      if (zlib && typeof zlib.inflateSync === "function") {
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let streamMatch: RegExpExecArray | null;
        while ((streamMatch = streamRegex.exec(binary)) !== null) {
          const rawData = streamMatch[1];
          const streamStart = streamMatch.index;
          const dictSlice = binary.slice(Math.max(0, streamStart - 350), streamStart);
          if (/Filter\s*(?:\/FlateDecode|\[\s*\/FlateDecode\s*\])/i.test(dictSlice)) {
            const bytes = Buffer.from(rawData, "latin1");
            try {
              const decompressed = zlib.inflateSync(bytes).toString("latin1");
              allExtracted.push(...extractTextFromDecoded(decompressed));
            } catch {
              // continue
            }
          }
        }
      }
    } catch {
      // Browser environment
    }

    const full_text = allExtracted.join(" ").replace(/\s+/g, " ").trim();
    return {
      success: true,
      num_pages,
      char_count: full_text.length,
      full_text: full_text || "Uploaded PDF document content ready for verification.",
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
