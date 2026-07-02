import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    // ========================================================
    // 🛑 FILTER MULTI-WEBSITE (KHUSUS AKSARADIRI)
    // ========================================================
    // Jika tidak diawali dengan AKSD-, berarti ini transaksi web sebelah
    if (!order_id || !order_id.startsWith('AKSD-')) {
      console.log(`⏩ AKSARADIRI: Mengabaikan transaksi ${order_id} karena bukan milik AksaraDiri.`);
      // Wajib return 200 OK agar Midtrans tidak mengirim ulang (retry)
      return NextResponse.json({ status: 'Ignored, cross-domain transaction' }, { status: 200 });
    }

    // 1. Verifikasi Keamanan (Signature Key)
    // Mencegah manipulasi status lunas dari pihak luar
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      console.error(`❌ AKSARADIRI: Signature Invalid untuk order ${order_id}`);
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 403 });
    }

    // 2. Logika Eksekusi Berdasarkan Status Pembayaran
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      
      console.log(`✅ [PEMBAYARAN LUNAS] Order ID: ${order_id}. Memulai aktivasi premium...`);
      
      // ==========================================================
      // 🚀 MASUKKAN LOGIKA AKTIVASI AI / UPDATE DATABASE DI SINI
      // Contoh: await triggerPdfGeneration(order_id);
      // Contoh: await prisma.transaction.update({...});
      // ==========================================================
      
    } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
      console.log(`❌ [PEMBAYARAN GAGAL/EXPIRED] Order ID: ${order_id}`);
      // Lakukan update status gagal di database jika diperlukan
    }

    // Return OK untuk memberitahu Midtrans bahwa server kita berhasil memproses
    return NextResponse.json({ status: 'OK' }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}