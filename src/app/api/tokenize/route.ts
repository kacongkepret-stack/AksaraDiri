import { NextResponse } from 'next/server';
// @ts-ignore
import midtransClient from 'midtrans-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolName, resultId, amount, selectedTier } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!serverKey) {
      return NextResponse.json({ error: 'Server key is missing' }, { status: 500 });
    }

    // PENGAMANAN HARGA RESMI (Anti Client-Side Price Tampering):
    // Paket Basic = Rp 5.000, Paket VIP / Lengkap = Rp 10.000
    let authoritativePrice = 5000;
    if (amount === 10000 || selectedTier === 'vip' || selectedTier === 'comprehensive') {
      authoritativePrice = 10000;
    }

    // Inisialisasi Snap Midtrans
    const snap = new midtransClient.Snap({
      isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' || !serverKey.startsWith('SB-'),
      serverKey: serverKey,
      clientKey: clientKey || ''
    });

    // CETAK ORDER ID KHUSUS AKSARADIRI (Prefix AKSD-)
    const secureOrderId = `AKSD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

    const parameter = {
      transaction_details: {
        order_id: secureOrderId, 
        gross_amount: authoritativePrice 
      },
      item_details: [{
        id: resultId ? String(resultId).slice(0, 40) : "premium-report",
        price: authoritativePrice,
        quantity: 1,
        name: `Paket Analisis: ${(toolName || 'Premium').slice(0, 40)}`
      }],
      // Membatasi pembayaran agar instan
      enabled_payments: ["gopay", "shopeepay", "other_qris", "bca_va", "bni_va", "bri_va", "mandiri_clickpay"]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ 
      token: transaction.token,
      order_id: secureOrderId,
      amount: authoritativePrice 
    });

  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}
