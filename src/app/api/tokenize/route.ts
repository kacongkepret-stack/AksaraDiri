import { NextResponse } from 'next/server';
// @ts-ignore
import midtransClient from 'midtrans-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Tangkap data dari frontend
    const { toolName, resultId, amount } = body;

    // Proteksi Keamanan Dasar
    if (!amount || amount < 5000) {
       return NextResponse.json({ error: 'Harga tidak valid' }, { status: 400 });
    }

    // Inisialisasi Snap Midtrans
    // Pastikan Key dari .env SAMA dengan LatihanOnline / PersonaHub
    let snap = new midtransClient.Snap({
      isProduction: true, // Ubah ke true jika sudah live di production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    // 🔒 CETAK ORDER ID KHUSUS AKSARADIRI
    const secureOrderId = `AKSD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let parameter = {
      "transaction_details": {
        "order_id": secureOrderId, 
        "gross_amount": amount 
      },
      "item_details": [{
        "id": resultId || "premium-report",
        "price": amount,
        "quantity": 1,
        "name": `Paket Analisis: ${toolName || 'Premium'}`
      }],
      // Membatasi hanya QRIS dan E-Wallet agar konversi lebih cepat
      "enabled_payments": ["gopay", "shopeepay", "other_qris"]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ token: transaction.token });

  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}