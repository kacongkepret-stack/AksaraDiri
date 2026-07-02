import { NextResponse } from 'next/server';
import { aiKeyManager } from '../../../utils/apiManager'; // Import sistem rotasi kita

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolName, resultId } = body;

    // 1. Ambil API Key menggunakan Round-Robin
    // Jika ada 10 key di .env, sistem ini akan mengambilnya bergiliran dengan presisi absolut
    const apiKey = aiKeyManager.getNextKey();

    console.log(`[SYSTEM INFO] Menjalankan AI untuk ${toolName}. Menggunakan API Key berakhiran: ...${apiKey.slice(-4)}`);

    // 2. Susun Prompt Spesifik
    const prompt = `
      Buatkan laporan analisis psikologi dan nasib sepanjang 1500 kata untuk alat: ${toolName} dengan hasil dasar: ${resultId}.
      Fokuskan pada:
      1. Karir dan Siklus Keuangan
      2. Kecocokan Jodoh Mutlak dan Red Flags
      3. Kelemahan Psikologis Tersembunyi (Shadow Self)
      Format output dalam JSON yang rapi untuk di-render ke PDF.
    `;

    // 3. Panggil API AI (Contoh menggunakan endpoint Google Gemini)
    // Gunakan apiKey yang didapat dari rotator
    /*
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const aiData = await aiResponse.json();
    */

    // 4. Proses data dari AI ke React-PDF (Akan diimplementasikan di fase berikutnya)
    
    // RETURN RESPON SUKSES SEMENTARA
    return NextResponse.json({ 
      status: 'success', 
      message: 'PDF Generated successfully',
      data: {
        // Mock data
        fileUrl: "https://aksaradiri.my.id/download/pdf/12345"
      }
    });

  } catch (error: any) {
    console.error("Kesalahan API Generate Premium:", error.message);
    return NextResponse.json(
      { status: 'error', message: 'Gagal men-generate dokumen' },
      { status: 500 }
    );
  }
}
