import Link from "next/link";
import { Metadata } from "next";

const DICT: Record<string, any> = {
  id: {
    title: "Kebijakan Privasi",
    lastUpdated: "Terakhir Diperbarui: Mei 2026",
    content: [
      { h: "1. Pengumpulan Data", p: "AksaraDiri menghormati privasi Anda. Kami tidak mewajibkan pembuatan akun untuk menggunakan sebagian besar alat kami. Data yang dikumpulkan secara otomatis (seperti alamat IP, jenis browser) hanya digunakan untuk analitik dan kinerja situs." },
      { h: "2. Penggunaan Data Kuis", p: "Input yang Anda berikan pada alat tes kepribadian, weton, zodiak, dan kuis lainnya diproses secara lokal di browser Anda atau melalui algoritma sementara. Kami tidak menyimpan data sensitif atau hasil tes Anda di server kami tanpa izin eksplisit." },
      { h: "3. Cookie & Pelacakan", p: "Kami menggunakan cookie untuk menyimpan preferensi bahasa Anda (ID/EN/ES) dan meningkatkan pengalaman pengguna. Anda dapat menonaktifkan cookie melalui pengaturan browser Anda." },
      { h: "4. Pihak Ketiga", p: "Kami mungkin menggunakan layanan analitik pihak ketiga (seperti Google Analytics) yang mengumpulkan data anonim tentang lalu lintas web. Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga." },
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: May 2026",
    content: [
      { h: "1. Data Collection", p: "AksaraDiri respects your privacy. We do not require account creation to use most of our tools. Automatically collected data (like IP addresses, browser types) is used solely for analytics and site performance." },
      { h: "2. Quiz Data Usage", p: "Inputs provided in personality tests, zodiac, and other quizzes are processed locally in your browser or via temporary algorithms. We do not store sensitive data or test results on our servers without explicit permission." },
      { h: "3. Cookies & Tracking", p: "We use cookies to store your language preferences (ID/EN/ES) and improve user experience. You can disable cookies through your browser settings." },
      { h: "4. Third Parties", p: "We may use third-party analytics services (like Google Analytics) that collect anonymous web traffic data. We never sell your personal data to third parties." },
    ]
  },
  es: {
    title: "Política de Privacidad",
    lastUpdated: "Última Actualización: Mayo 2026",
    content: [
      { h: "1. Recopilación de Datos", p: "AksaraDiri respeta su privacidad. No requerimos la creación de una cuenta para usar la mayoría de nuestras herramientas. Los datos recopilados automáticamente se utilizan solo para análisis y rendimiento del sitio." },
      { h: "2. Uso de Datos de Cuestionarios", p: "Los datos proporcionados en pruebas de personalidad y zodiaco se procesan localmente en su navegador. No almacenamos datos sensibles ni resultados de pruebas en nuestros servidores sin permiso explícito." },
      { h: "3. Cookies y Rastreo", p: "Usamos cookies para almacenar sus preferencias de idioma y mejorar la experiencia del usuario. Puede desactivar las cookies en la configuración de su navegador." },
      { h: "4. Terceros", p: "Podemos utilizar servicios de análisis de terceros que recopilan datos anónimos de tráfico web. Nunca vendemos sus datos personales a terceros." },
    ]
  }
};

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || "id";
  const t = DICT[lang] || DICT.id;
  return { title: `${t.title} | AksaraDiri` };
}

export default function PrivacyPolicyPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "id";
  const data = DICT[lang] || DICT.id;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900/50 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm shadow-xl">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{data.title}</h1>
        <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-10">{data.lastUpdated}</p>
        
        <div className="space-y-8">
          {data.content.map((section: any, idx: number) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-slate-100 mb-3">{section.h}</h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">{section.p}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}