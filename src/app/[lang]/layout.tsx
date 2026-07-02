import Link from "next/link";
import "../globals.css";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Metadata } from "next";
import Script from "next/script";
import AnimatedBackground from "../../components/AnimatedBackground";
// ========== TRANSLASI & SEO METADATA ==========
const translations: Record<string, any> = {
  id: {
    home: "Beranda", personality: "Kepribadian", astrology: "Zodiak", local: "Weton", viral: "Hiburan",
    brand: "AksaraDiri",
    brandDesc: "Supermarket psikologi dan hiburan personal. Temukan potensi tersembunyi, kecocokan, dan takdir Anda hari ini.",
    popular: "Tes Populer", legal: "Legal", privacy: "Kebijakan Privasi", terms: "Syarat Layanan", contact: "Hubungi Kami",
    copyright: `© ${new Date().getFullYear()} AksaraDiri Portal. Hak cipta dilindungi.`,
    seo: {
      title: "AksaraDiri | Tes Psikologi, Primbon Weton & Takdir",
      desc: "Platform terbaik untuk tes kepribadian, zodiak, perhitungan weton primbon Jawa, kartu takdir, dan analisis kecocokan jodoh secara akurat dan gratis.",
      keywords: "tes kepribadian, primbon jawa, weton jodoh, kartu takdir, kuis geografi, zodiak, astrologi, tes mbti, psikologi"
    }
  },
  en: {
    home: "Home", personality: "Personality", astrology: "Astrology", local: "Local", viral: "Viral",
    brand: "AksaraDiri",
    brandDesc: "Supermarket of psychology and personal entertainment. Discover hidden potential, compatibility, and your destiny today.",
    popular: "Popular Tests", legal: "Legal", privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us",
    copyright: `© ${new Date().getFullYear()} AksaraDiri Portal. All rights reserved.`,
    seo: {
      title: "AksaraDiri | Psychology Tests, Astrology & Destiny",
      desc: "The ultimate platform for personality tests, zodiac readings, destiny cards, geographic quizzes, and accurate compatibility analysis for free.",
      keywords: "personality test, destiny cards, geographic quiz, zodiac, astrology, mbti test, psychology, compatibility"
    }
  },
  es: {
    home: "Inicio", personality: "Personalidad", astrology: "Astrología", local: "Local", viral: "Viral",
    brand: "AksaraDiri",
    brandDesc: "Supermercado de psicología y entretenimiento personal. Descubre tu potencial oculto, compatibilidad y destino hoy.",
    popular: "Pruebas Populares", legal: "Legal", privacy: "Política de Privacidad", terms: "Términos de Servicio", contact: "Contáctanos",
    copyright: `© ${new Date().getFullYear()} AksaraDiri Portal. Todos los derechos reservados.`,
    seo: {
      title: "AksaraDiri | Pruebas Psicológicas, Astrología y Destino",
      desc: "La mejor plataforma para pruebas de personalidad, lecturas del zodiaco, cartas del destino, cuestionarios geográficos y análisis de compatibilidad gratis.",
      keywords: "prueba de personalidad, cartas del destino, cuestionario geográfico, zodiaco, astrología, prueba mbti, psicología"
    }
  }
};

// ========== DYNAMIC METADATA GENERATOR UNTUK GOOGLE ==========
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || "id";
  const t = translations[lang] || translations.id;

  return {
    title: t.seo.title,
    description: t.seo.desc,
    keywords: t.seo.keywords,
    openGraph: {
      title: t.seo.title,
      description: t.seo.desc,
      url: "https://aksaradiri.my.id", // Ganti dengan domain asli Anda saat deploy
      siteName: "AksaraDiri",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.title,
      description: t.seo.desc,
    },
    alternates: {
      canonical: `https://aksaradiri.my.id/${lang}`,
      languages: {
        'id-ID': '/id',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  };
}

export default function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const t = translations[params.lang] || translations.id;

  return (
    <html lang={params.lang} className="text-[14px]">
      <body className="bg-slate-950 text-slate-200 font-sans antialiased flex flex-col min-h-screen selection:bg-cyan-500/30 relative">
        <AnimatedBackground />
        
        {/* ========== INJEKSI SCRIPT MIDTRANS GLOBAL ========== */}
        {/* Memastikan Snap berjalan independen dari siklus re-render React */}
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />

        {/* 🟢 TAMBAHKAN SCRIPT MONETAG DI SINI */}
        {/* Menggunakan strategy afterInteractive agar tidak memperlambat loading utama web */}
        <Script
          id="monetag-tag-11093000"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11093000',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
          }}
        />

        {/* ========== GOOGLE ANALYTICS ========== */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-SGKMGNHHFW`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SGKMGNHHFW', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* ====================================== */}

        {/* NAVBAR */}
        <header className="bg-slate-950/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${params.lang}`} className="flex items-center space-x-1.5 group">
              <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🧩</span>
              <span className="text-lg font-black tracking-tight text-white">
                Aksara<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">Diri</span>
              </span>
            </Link>

            {/* Menu Navigasi */}
            <nav className="hidden md:flex space-x-5 text-sm font-medium text-slate-300">
              <Link href={`/${params.lang}/category/personality`} className="hover:text-cyan-400 transition-colors">{t.personality}</Link>
              <Link href={`/${params.lang}/category/astrology`} className="hover:text-purple-400 transition-colors">{t.astrology}</Link>
              <Link href={`/${params.lang}/category/local`} className="hover:text-amber-400 transition-colors">{t.local}</Link>
              <Link href={`/${params.lang}/category/viral`} className="hover:text-pink-400 transition-colors">{t.viral}</Link>
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher lang={params.lang} />
          </div>
        </header>

        {/* KONTEN UTAMA */}
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-md text-slate-500 py-6 mt-auto relative z-10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="font-bold text-white mb-1.5 block text-base">{t.brand}</span>
              <p className="text-[11px] leading-relaxed max-w-[220px]">{t.brandDesc}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2 uppercase text-[10px] tracking-widest opacity-50">{t.popular}</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href={`/${params.lang}/tools/destiny-card`} className="hover:text-cyan-400 transition-colors">Kartu Takdir Semesta</Link></li>
                <li><Link href={`/${params.lang}/tools/weton`} className="hover:text-cyan-400 transition-colors">Watak Weton Primbon</Link></li>
                <li><Link href={`/${params.lang}/tools/geo-quiz`} className="hover:text-cyan-400 transition-colors">Kuis Negara Ideal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2 uppercase text-[10px] tracking-widest opacity-50">{t.legal}</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href={`/${params.lang}/legal/privacy`} className="hover:text-cyan-400 transition-colors">{t.privacy}</Link></li>
                <li><Link href={`/${params.lang}/legal/terms`} className="hover:text-cyan-400 transition-colors">{t.terms}</Link></li>
                <li><Link href={`/${params.lang}/contact`} className="hover:text-cyan-400 transition-colors">{t.contact}</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 mt-6 pt-4 border-t border-white/5 text-[10px] text-center opacity-40">
            {t.copyright}
          </div>
        </footer>
      </body>
    </html>
  );
}
