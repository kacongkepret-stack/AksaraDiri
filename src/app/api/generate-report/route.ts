import { NextResponse } from "next/server";
import { generatePremiumReport } from "../../../lib/reportEngine"; // Sesuaikan path jika berbeda

export async function POST(request: Request) {
  try {
    // TANGKAP tier DAN resultId DARI FRONTEND PAYWALL
    const { userName, toolName, lang, resultId, tier } = await request.json();
    
    // Proteksi data kosong
    if (!userName || !toolName || !tier || !resultId) {
      return NextResponse.json({ error: "Data parameter tidak lengkap." }, { status: 400 });
    }
    
    // LEMPAR KE FUNGSI ENGINE AI ANDA
    const htmlReport = await generatePremiumReport(userName, toolName, lang || "id", resultId, tier);
    
    return NextResponse.json({ success: true, report: htmlReport });
  } catch (error: any) {
    console.error("REPORT GENERATION ERROR:", error.message);
    return NextResponse.json({ error: "Gagal membuat laporan: " + error.message }, { status: 500 });
  }
}