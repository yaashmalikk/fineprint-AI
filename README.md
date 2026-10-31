# ClaimProof AI ⚖️

> **Autonomous Misinformation & Claim Verification Assistant**  
> Extracts factual claims from online content and documents, retrieves relevant credible statutory sources via semantic RAG, compares evidence, and presents a transparent assessment rather than relying on unsupported black-box AI verdicts.

---

## ✨ Core Pipeline & Architecture

- **Stage 1: NLP Claim Extraction**: Parses raw content (social posts, text, PDFs) and extracts atomic factual/legal claims.
- **Stage 2: Semantic RAG Retrieval**: Queries a ground-truth statutory knowledge base (Section 27 & 74 Indian Contract Act, UGC 2018 directives, Supreme Court rulings like *Percept D'Mark v Zaheer Khan*).
- **Stage 3: Evidence Ranking & Contradiction Detection**: Directly compares claims against statutory provisions and computes an Evidence Conflict Index (0-100%).
- **Stage 4: Transparent Assessment**: Side-by-side evidence comparison cards with primary source citations and official excerpts.
- **Dual-Input Mode**: 
  - *Mode A: Document & Contract Audit* (PDF/Image upload)
  - *Mode B: Online Content & Post Verifier* (Social media, news, viral claims)
- **Instant Demo Resilience**: 1-click preset samples for offline demonstration without API dependence.
- **Action Dock**: One-click Markdown Dossier Export and Rebuttal / Counter-Notice Generator.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+

### 2. Environment Setup
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Disclaimer
*ClaimProof AI is an evidence-backed verification and informational research assistant. It cites primary statutes and judicial rulings transparently and does not constitute formal legal counsel.*
