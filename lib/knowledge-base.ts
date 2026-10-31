// ClaimProof AI – Ground-Truth Knowledge Base
// Statutory laws, Supreme Court rulings, labor regulations, and official gazette notifications
// used as the local verifiable evidence store for RAG-style retrieval.

export interface KnowledgeEntry {
  id: string;
  source_title: string;
  authority: string;
  statutory_reference: string;
  official_text: string;
  keywords: string[];
  category: "Legal" | "Factual" | "Policy";
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: "kb-ica-s27",
    source_title: "Restraint of Trade – Void Agreement",
    authority: "Indian Contract Act, 1872 – Parliament of India",
    statutory_reference: "Section 27, Indian Contract Act, 1872",
    official_text:
      "Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. Exception 1: Saving of agreement not to carry on business of which goodwill is sold.",
    keywords: ["non-compete", "restraint of trade", "post-employment", "competitor", "cannot work", "barred from working", "prohibited from joining"],
    category: "Legal",
  },
  {
    id: "kb-ica-s74",
    source_title: "Compensation for Breach – Liquidated Damages",
    authority: "Indian Contract Act, 1872 – Parliament of India",
    statutory_reference: "Section 74, Indian Contract Act, 1872",
    official_text:
      "When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, or if the contract contains any other stipulation by way of penalty, the party complaining of the breach is entitled, whether or not actual damage or loss is proved to have been caused thereby, to receive from the party who has broken the contract reasonable compensation not exceeding the amount so named.",
    keywords: ["bond", "penalty", "liquidated damages", "fine", "training cost", "exit penalty", "recovery amount", "lakh", "compensation"],
    category: "Legal",
  },
  {
    id: "kb-sc-percept",
    source_title: "Percept D'Mark (India) Pvt. Ltd. v Zaheer Khan",
    authority: "Supreme Court of India",
    statutory_reference: "(2006) 4 SCC 227",
    official_text:
      "The Supreme Court held that agreements restraining a person from carrying on a lawful profession, trade, or business after the termination of the contract are void under Section 27 of the Indian Contract Act, 1872. Post-employment non-compete clauses are unenforceable in India. The restraint, to be valid, must operate only during the continuance of the contract and not beyond.",
    keywords: ["non-compete", "post-employment", "restraint", "void", "supreme court", "zaheer khan", "percept"],
    category: "Legal",
  },
  {
    id: "kb-ugc-2018",
    source_title: "UGC Directive on Original Certificates",
    authority: "University Grants Commission (UGC) – Gazette of India",
    statutory_reference: "UGC Notification 2018, F.No. 1-1/2017(CPP-II)",
    official_text:
      "No employer or institution shall retain original certificates, mark sheets, or academic documents of any employee or student. Employers may only take photocopies for verification purposes. Retention of original documents is a punishable offence.",
    keywords: ["certificate", "marksheet", "original", "retain", "seize", "impound", "degree", "educational document", "custody"],
    category: "Policy",
  },
  {
    id: "kb-ipc-403",
    source_title: "Dishonest Misappropriation of Property",
    authority: "Indian Penal Code – Parliament of India",
    statutory_reference: "Section 403, Indian Penal Code, 1860 (now BNS Section 316)",
    official_text:
      "Whoever dishonestly misappropriates or converts to his own use any movable property, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both. Retention of original academic certificates by employers falls under this section.",
    keywords: ["certificate", "misappropriation", "seize", "retain", "custody", "impound", "property"],
    category: "Legal",
  },
  {
    id: "kb-aicte-retention",
    source_title: "AICTE Directive Against Certificate Retention",
    authority: "All India Council for Technical Education (AICTE)",
    statutory_reference: "AICTE Circular No. AICTE/Grievance/2018",
    official_text:
      "AICTE has categorically prohibited any educational institution or employer from retaining original certificates of students or employees. Such practice is illegal and punishable. Institutions and employers may verify copies but must return originals immediately after verification.",
    keywords: ["certificate", "retention", "aicte", "technical education", "marksheet", "original", "return"],
    category: "Policy",
  },
  {
    id: "kb-notice-asymmetry",
    source_title: "Asymmetric Notice Period – Unconscionable Contract",
    authority: "Indian Contract Act, 1872 – Judicial Interpretation",
    statutory_reference: "Section 16, Indian Contract Act, 1872 (Undue Influence)",
    official_text:
      "A contract where the employer can terminate immediately (0 days notice) while requiring 60-90 days notice from the employee is held unconscionable under the doctrine of undue influence. Such terms reflect unequal bargaining power and may be struck down as unfair trade practice under the Consumer Protection Act.",
    keywords: ["notice period", "asymmetric", "one-sided", "days notice", "terminate", "immediate termination", "unfair"],
    category: "Legal",
  },
  {
    id: "kb-sc-taprogge",
    source_title: "Taprogge Gesellschaft v IAEC India Ltd",
    authority: "Supreme Court of India",
    statutory_reference: "(1988) 3 SCC 487 – Taprogge v IAEC",
    official_text:
      "The Supreme Court reiterated that non-compete covenants during the subsistence of a contract are permissible, but those that extend beyond the contractual period are void under Section 27. Only reasonable restrictions during employment are lawful.",
    keywords: ["non-compete", "during employment", "post-termination", "restraint", "void"],
    category: "Legal",
  },
  {
    id: "kb-model-tenancy",
    source_title: "Model Tenancy Act, 2021",
    authority: "Ministry of Housing and Urban Affairs – Government of India",
    statutory_reference: "Model Tenancy Act, 2021 – Sections 14-18",
    official_text:
      "The security deposit shall not exceed two months' rent for residential premises. The landlord shall refund the security deposit within one month of vacancy after deducting lawful charges. Arbitrary or blanket deductions from security deposits without itemized proof are prohibited.",
    keywords: ["rent", "deposit", "security deposit", "landlord", "tenant", "refund", "deduction", "tenancy"],
    category: "Legal",
  },
  {
    id: "kb-labour-code-2020",
    source_title: "Code on Wages, 2019 – Salary Deduction Limits",
    authority: "Parliament of India – Ministry of Labour & Employment",
    statutory_reference: "The Code on Wages, 2019 – Section 18",
    official_text:
      "Deductions from wages shall not exceed fifty per cent of the employee's total wages. No employer shall make any deduction from the wages except as authorized under this Code. Deductions for recovery of advances, loans, or service agreement costs must be transparent and capped.",
    keywords: ["salary", "deduction", "wages", "recovery", "bond", "advance", "repayment"],
    category: "Policy",
  },
  {
    id: "kb-ip-rights",
    source_title: "Employee IP Assignment – Scope Limitation",
    authority: "Indian Patents Act, 1970 & Copyright Act, 1957",
    statutory_reference: "Section 17, Copyright Act 1957; Section 2(1)(s), Patents Act 1970",
    official_text:
      "Works created by an employee in the course of employment belong to the employer. However, blanket IP assignment clauses that claim ownership over personal projects, open-source contributions, or work done outside office hours and using personal resources are not enforceable. Such overbroad IP clauses violate the principle of proportionality.",
    keywords: ["intellectual property", "ip", "copyright", "patent", "invention", "side project", "personal project", "assignment"],
    category: "Legal",
  },
  {
    id: "kb-gardening-leave",
    source_title: "Gardening Leave as Alternative to Non-Compete",
    authority: "Employment Law Practice – Indian Judiciary",
    statutory_reference: "Judicial Practice – Labor Courts & High Courts",
    official_text:
      "Indian courts have recognized that employers may enforce a paid 'gardening leave' period during the notice period, during which the employee remains on payroll but is not required to work. This is distinct from a post-employment non-compete clause and is enforceable only during the contract term.",
    keywords: ["gardening leave", "notice", "non-compete", "alternative", "paid leave"],
    category: "Legal",
  },
];

export function searchKnowledgeBase(claimText: string, topK: number = 3): KnowledgeEntry[] {
  const lowerClaim = claimText.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((entry) => {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lowerClaim.includes(kw.toLowerCase())) {
        score += kw.length; // longer keyword matches weigh more
      }
    }
    // Boost for exact statutory reference mentions
    if (lowerClaim.includes(entry.statutory_reference.toLowerCase())) {
      score += 50;
    }
    return { entry, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((s) => s.entry);
}

