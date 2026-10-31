// ClaimProof AI – Mock Fallback Data for Instant Offline Demonstration
// Simulates the output of the full verification pipeline on a viral corporate misinformation sample.

import type { VerificationResult } from "./verify-types";

export const VIRAL_CORPORATE_SAMPLE_TEXT = `IMPORTANT: Employment Terms & Service Agreement

1. Training Bond: Upon joining, you agree to a mandatory non-negotiable service bond of Rs 2,50,000 (Two Lakh Fifty Thousand Rupees) if you leave within 2 years. This amount is fixed and non-refundable regardless of circumstances.

2. Original Certificates: You must submit your original degree certificates, mark sheets, and academic documents to HR on the day of joining. These will be held by the company for the duration of your employment and returned only upon successful completion of the service bond period.

3. Non-Compete Agreement: Upon separation from the company, you shall not join any competitor company, directly or indirectly, anywhere in India for a period of 24 months. Violation will result in legal action and recovery of Rs 5,00,000.

4. Notice Period: Employee must serve a 90-day notice period. The company reserves the right to terminate employment with immediate effect (0 days notice) at its sole discretion.

5. Intellectual Property: All work, ideas, inventions, and side projects created during your tenure, including personal projects done outside office hours, shall be the exclusive intellectual property of the company.

— Acme TechCorp Pvt. Ltd. HR Department`;

export const MOCK_VERIFICATION_RESULT: VerificationResult = {
  content_type: "Employment Offer Letter / Service Agreement",
  overall_credibility_score: 22,
  misinformation_verdict: "High Misinformation Density – Multiple claims are legally unenforceable or directly contradict Indian statutory law",
  claims: [
    {
      claim_id: "CLM-001",
      claim_text: "Mandatory non-negotiable service bond of Rs 2,50,000 if you leave within 2 years. This amount is fixed and non-refundable regardless of circumstances.",
      claim_category: "Legal",
      verification_status: "DEBUNKED_MISINFORMATION",
      conflict_score: 92,
      evidence: {
        source_title: "Compensation for Breach – Liquidated Damages",
        authority: "Indian Contract Act, 1872 – Parliament of India",
        statutory_reference: "Section 74, Indian Contract Act, 1872",
        official_text_excerpt:
          "The party complaining of the breach is entitled to receive reasonable compensation not exceeding the amount so named. A fixed, non-negotiable penalty without proof of actual loss incurred is unenforceable.",
        relevance_rank: 1,
      },
      evidence_comparison:
        "The claim states the bond is 'non-negotiable' and 'non-refundable regardless of circumstances.' Section 74 ICA explicitly requires the penalty to represent reasonable compensation tied to actual loss. A blanket ₹2.5L penalty without itemized training costs is legally unenforceable.",
      transparent_explanation:
        "Under Indian law, liquidated damages clauses must reflect genuine pre-estimated loss. Courts consistently reduce arbitrary penalties to proven actual damages. The employer cannot enforce a fixed sum without demonstrating what the ₹2.5L covers (training vendor invoices, certification costs, etc.).",
    },
    {
      claim_id: "CLM-002",
      claim_text: "You must submit your original degree certificates, mark sheets, and academic documents to HR. These will be held by the company for the duration of your employment.",
      claim_category: "Legal",
      verification_status: "DEBUNKED_MISINFORMATION",
      conflict_score: 98,
      evidence: {
        source_title: "UGC Directive on Original Certificates",
        authority: "University Grants Commission (UGC) – Gazette of India",
        statutory_reference: "UGC Notification 2018, F.No. 1-1/2017(CPP-II)",
        official_text_excerpt:
          "No employer or institution shall retain original certificates, mark sheets, or academic documents of any employee or student. Employers may only take photocopies for verification purposes.",
        relevance_rank: 1,
      },
      evidence_comparison:
        "The offer letter demands surrender and retention of original certificates. This is explicitly banned by UGC 2018 notifications and AICTE circulars. Retention constitutes dishonest misappropriation under IPC Section 403 (now BNS 316).",
      transparent_explanation:
        "Multiple regulatory bodies (UGC, AICTE) and the Indian Penal Code prohibit employers from retaining original academic documents. The employer may verify photocopies but must return originals immediately. This clause is outright illegal.",
    },
    {
      claim_id: "CLM-003",
      claim_text: "Upon separation, you shall not join any competitor company anywhere in India for 24 months. Violation will result in legal action and recovery of Rs 5,00,000.",
      claim_category: "Legal",
      verification_status: "DEBUNKED_MISINFORMATION",
      conflict_score: 99,
      evidence: {
        source_title: "Restraint of Trade – Void Agreement",
        authority: "Indian Contract Act, 1872 – Parliament of India",
        statutory_reference: "Section 27, Indian Contract Act, 1872",
        official_text_excerpt:
          "Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.",
        relevance_rank: 1,
      },
      evidence_comparison:
        "The clause imposes a 24-month post-employment non-compete across all of India. Section 27 ICA renders all post-employment restraints of trade void ab initio. The Supreme Court in Percept D'Mark v Zaheer Khan (2006) 4 SCC 227 confirmed this position unequivocally.",
      transparent_explanation:
        "Post-employment non-compete clauses are completely void in India. The Supreme Court has ruled that an employee's right to earn a livelihood through any lawful profession cannot be restricted after the contract ends. The ₹5L penalty threat is legally meaningless.",
    },
    {
      claim_id: "CLM-004",
      claim_text: "Employee must serve 90-day notice period. The company reserves the right to terminate with immediate effect (0 days notice) at its sole discretion.",
      claim_category: "Legal",
      verification_status: "MISLEADING",
      conflict_score: 74,
      evidence: {
        source_title: "Asymmetric Notice Period – Unconscionable Contract",
        authority: "Indian Contract Act, 1872 – Judicial Interpretation",
        statutory_reference: "Section 16, Indian Contract Act, 1872 (Undue Influence)",
        official_text_excerpt:
          "A contract where the employer can terminate immediately while requiring 60-90 days notice from the employee is held unconscionable under the doctrine of undue influence.",
        relevance_rank: 1,
      },
      evidence_comparison:
        "The clause imposes a 90-day notice on the employee but allows immediate termination by the employer. This asymmetry reflects unequal bargaining power. Courts have struck down such terms as unconscionable and potentially an unfair trade practice.",
      transparent_explanation:
        "While notice periods are standard, a 90:0 asymmetry is considered unfair. The doctrine of mutuality requires both parties to have reasonably equivalent obligations. Courts have moderated such clauses to require mutual notice periods.",
    },
    {
      claim_id: "CLM-005",
      claim_text: "All work, ideas, inventions, and side projects created during your tenure, including personal projects done outside office hours, shall be the exclusive IP of the company.",
      claim_category: "Legal",
      verification_status: "MISLEADING",
      conflict_score: 68,
      evidence: {
        source_title: "Employee IP Assignment – Scope Limitation",
        authority: "Indian Patents Act, 1970 & Copyright Act, 1957",
        statutory_reference: "Section 17, Copyright Act 1957; Section 2(1)(s), Patents Act 1970",
        official_text_excerpt:
          "Works created by an employee in the course of employment belong to the employer. However, blanket IP assignment clauses claiming ownership over personal projects or work done outside office hours using personal resources are not enforceable.",
        relevance_rank: 1,
      },
      evidence_comparison:
        "Copyright Act Section 17 assigns employer ownership only to works created 'in the course of employment.' Personal projects outside office hours using personal resources do not fall under this scope. The blanket claim over all ideas and side projects exceeds legal boundaries.",
      transparent_explanation:
        "While employer IP ownership during work hours is standard law, the clause overreaches by claiming personal projects and side work. This overbroad language violates proportionality principles and would not survive judicial scrutiny.",
    },
  ],
  transparent_summary:
    "This document contains 5 factual claims, of which 3 are DEBUNKED as outright misinformation (unenforceable under Indian law), and 2 are MISLEADING (partially valid but containing overreach). The overall credibility score is 22/100, indicating high misinformation density. Key violations include: illegal certificate retention (UGC/AICTE ban), void post-employment non-compete (Section 27 ICA), and unenforceable arbitrary bond penalty (Section 74 ICA). Every assessment is backed by specific statutory citations and Supreme Court rulings – no AI-generated opinions are used.",
};

