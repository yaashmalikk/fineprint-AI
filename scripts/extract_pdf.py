import base64
import io
import json
import re
import sys
from pypdf import PdfReader


def extract_pdf(source):
    reader = PdfReader(source)
    pages = [p.extract_text() or "" for p in reader.pages]
    full_text = "\n\n".join(pages).strip()

    meta = {}
    if reader.metadata:
        for k, v in reader.metadata.items():
            if v:
                meta[str(k).lstrip("/")] = str(v)

    clause_regex = re.compile(
        r'(?:(?:Clause|Section|Article|Point)\s*(\d+(?:\.\d+)*)|(?:\n|^)(\d+\.\d+))\s*[:\.\-]?\s*([^\n]+)',
        re.IGNORECASE,
    )
    clauses = []
    for m in clause_regex.finditer(full_text):
        num = m.group(1) or m.group(2)
        title = (m.group(3) or "").strip()
        if num and len(title) > 2:
            clauses.append({"clause": num, "heading": title[:80]})

    return {
        "success": True,
        "num_pages": len(pages),
        "metadata": meta,
        "full_text": full_text,
        "detected_clauses": clauses[:25],
        "char_count": len(full_text),
    }


def main():
    try:
        if len(sys.argv) > 1 and sys.argv[1] != "--stdin":
            print(json.dumps(extract_pdf(sys.argv[1]), ensure_ascii=False))
            return

        raw = sys.stdin.read().strip()
        if not raw:
            print(json.dumps({"success": False, "error": "Empty input"}))
            return

        if raw.startswith("{"):
            payload = json.loads(raw)
            b64 = payload.get("base64") or payload.get("pdfBase64")
            if not b64:
                print(json.dumps({"success": False, "error": "Missing base64 data"}))
                return
            data = base64.b64decode(b64)
        else:
            data = base64.b64decode(raw)

        print(json.dumps(extract_pdf(io.BytesIO(data)), ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))


if __name__ == "__main__":
    main()
