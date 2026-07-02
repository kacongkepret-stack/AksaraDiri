import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Jika pengunjung datang ke halaman utama (root URL)
  if (request.nextUrl.pathname === "/") {
    // Otomatis lempar ke versi bahasa Indonesia
    return NextResponse.redirect(new URL("/id", request.url));
  }
}

// Konfigurasi ini memastikan middleware HANYA berjalan saat user membuka beranda
export const config = {
  matcher: "/",
};