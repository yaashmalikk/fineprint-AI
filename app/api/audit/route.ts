import { NextResponse } from "next/server";
import {
  auditContractDocument,
  auditContractClause,
  generateSimulatedAudit,
  isLiveAIConfigured,
} from "@/lib/model";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { pdfBase64, fileName, fileSize, clauseText, sampleType } =
      await req.json().catch(() => ({}));

    if (sampleType) {
      const names: Record<string, string> = {
        safe: "Fair_Startup_SDE2_Offer.pdf",
        rent: "Bangalore_HSR_Rent_Agreement.pdf",
        bond: "Tech_Corp_2Y_Service_Bond.pdf",
      };
      const sampleAudit = generateSimulatedAudit(names[sampleType] || "Acme_Corp_Offer_Letter.pdf");
      return NextResponse.json({
        success: true,
        data: sampleAudit,
        isLiveAI: false,
        engineNotice: "Loaded benchmark template",
      });
    }

    if (pdfBase64 || clauseText || fileName) {
      const result = await auditContractDocument({
        pdfBase64,
        fileName,
        fileSize,
        clauseText,
      });

      return NextResponse.json({
        success: true,
        data: result,
        isLiveAI: result.isLiveAI ?? isLiveAIConfigured,
        engineNotice: result.engineMessage,
      });
    }

    if (clauseText) {
      const result = await auditContractClause(clauseText);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Provide a PDF file or clause text to audit." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Audit processing failed" },
      { status: 500 }
    );
  }
}
