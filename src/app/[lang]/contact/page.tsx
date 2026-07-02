"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// ========== DATABASE TEKS MULTI-BAHASA ==========
const DICT: Record<string, any> = {
  id: {
    title: "Hubungi Kami",
    subtitle: "Punya pertanyaan, umpan balik, atau tawaran kerja sama? Kirimkan pesan kepada kami, dan tim AksaraDiri akan merespons secepatnya.",
    form: { name: "Nama Lengkap", email: "Alamat Email", subject: "Subjek", message: "Pesan Anda", send: "Kirim Pesan", sent: "Pesan Terkirim!" },
    info: { title: "Informasi Kontak", email: "Email Bantuan", location: "Lokasi Operasional" }
  },
  en: {
    title: "Contact Us",
    subtitle: "Have questions, feedback, or collaboration offers? Send us a message, and the AksaraDiri team will respond shortly.",
    form: { name: "Full Name", email: "Email Address", subject: "Subject", message: "Your Message", send: "Send Message", sent: "Message Sent!" },
    info: { title: "Contact Information", email: "Support Email", location: "Operational Location" }
  },
  es: {
    title: "Contáctanos",
    subtitle: "¿Tienes preguntas, comentarios u ofertas de colaboración? Envíanos un mensaje y el equipo de AksaraDiri responderá en breve.",
    form: { name: "Nombre Completo", email: "Correo Electrónico", subject: "Asunto", message: "Tu Mensaje", send: "Enviar Mensaje", sent: "¡Mensaje Enviado!" },
    info: { title: "Información de Contacto", email: "Correo de Soporte", location: "Ubicación Operativa" }
  }
};

export default function ContactPage() {
  const params = useParams();
  const [lang, setLang] = useState("id");
  const [isSent, setIsSent] = useState(false);

  // Mencegah error Hydration di Next.js dengan mengambil bahasa setelah komponen dimuat
  useEffect(() => {
    if (params?.lang) {
      setLang(params.lang as string);
    }
  }, [params]);

  const data = DICT[lang] || DICT.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    // Simulasi pengiriman pesan
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <main className="min-h-[80vh] flex flex-col justify-center bg-slate-950 text-white py-16 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            {data.title}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed px-4">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Info Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm shadow-xl">
              <h3 className="text-lg font-bold text-slate-100 mb-6 border-b border-white/5 pb-4">{data.info.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">{data.info.email}</p>
                  <a href="mailto:support@aksaradiri.my.id" className="text-slate-300 text-sm md:text-base hover:text-white transition-colors">
                    support@aksaradiri.my.id
                  </a>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">{data.info.location}</p>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Denpasar, Bali<br />
                    Indonesia (WITA)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 p-6 md:p-10 rounded-3xl backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{data.form.name}</label>
                  <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{data.form.email}</label>
                  <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{data.form.subject}</label>
                <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{data.form.message}</label>
                <textarea required rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"></textarea>
              </div>

              <button type="submit" disabled={isSent} className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-cyan-500/20">
                {isSent ? `✓ ${data.form.sent}` : data.form.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}