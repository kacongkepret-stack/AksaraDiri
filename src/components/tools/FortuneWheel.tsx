"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Roda Keberuntungan",
    badge: "Ultra Premium",
    subtitle: "Putar roda nasib ini untuk mendapatkan pencerahan, afirmasi positif, dan arahan taktis untuk hari Anda.",
    shareBtn: "Bagikan",
    spinBtn: "🎲 Putar Roda Nasib",
    spinningText: "🔮 Sinkronisasi...",
    emptyMessage: "Putar roda untuk menerima petunjuk dari alam semesta.",
    disclaimer: "*Alat probabilitas ini dikembangkan murni untuk tujuan hiburan (entertainment). Keberuntungan sejati adalah hasil perpaduan antara kesiapan mental dan eksekusi yang konsisten.",
    quote: "\"Keberuntungan adalah pertemuan antara persiapan dan kesempatan.\"",
    labels: {
      yourAura: "Aura Utama Anda Hari Ini",
      sector: "Sektor",
      enlightenment: "Kutipan Pencerahan",
      strategy: "Strategi Eksekusi",
    },
    segments: {
      love: "Cinta",
      career: "Karir",
      finance: "Keuangan",
      health: "Kesehatan",
      connection: "Koneksi",
      spiritual: "Spiritual",
      exploration: "Eksplorasi",
      creativity: "Kreativitas",
    },
  },
  en: {
    title: "Wheel of Fortune",
    badge: "Ultra Premium",
    subtitle: "Spin the wheel of fate to receive enlightenment, positive affirmations, and tactical guidance for your day.",
    shareBtn: "Share",
    spinBtn: "🎲 Spin the Wheel",
    spinningText: "🔮 Syncing...",
    emptyMessage: "Spin the wheel to receive a message from the universe.",
    disclaimer: "*This probabilistic tool is developed purely for entertainment purposes. True luck is the result of mental readiness and consistent execution.",
    quote: "\"Luck is the meeting of preparation and opportunity.\"",
    labels: {
      yourAura: "Your Main Aura Today",
      sector: "Sector",
      enlightenment: "Enlightenment Quote",
      strategy: "Execution Strategy",
    },
    segments: {
      love: "Love",
      career: "Career",
      finance: "Finance",
      health: "Health",
      connection: "Connection",
      spiritual: "Spiritual",
      exploration: "Exploration",
      creativity: "Creativity",
    },
  },
  es: {
    title: "Rueda de la Fortuna",
    badge: "Ultra Premium",
    subtitle: "Gira la rueda del destino para recibir iluminación, afirmaciones positivas y orientación táctica para tu día.",
    shareBtn: "Compartir",
    spinBtn: "🎲 Girar la Rueda",
    spinningText: "🔮 Sincronizando...",
    emptyMessage: "Gira la rueda para recibir un mensaje del universo.",
    disclaimer: "*Esta herramienta probabilística se desarrolla puramente con fines de entretenimiento. La verdadera suerte es el resultado de la preparación mental y la ejecución constante.",
    quote: "\"La suerte es el encuentro entre la preparación y la oportunidad.\"",
    labels: {
      yourAura: "Tu Aura Principal Hoy",
      sector: "Sector",
      enlightenment: "Cita de Iluminación",
      strategy: "Estrategia de Ejecución",
    },
    segments: {
      love: "Amor",
      career: "Carrera",
      finance: "Finanzas",
      health: "Salud",
      connection: "Conexión",
      spiritual: "Espiritual",
      exploration: "Exploración",
      creativity: "Creatividad",
    },
  },
};

// ========== MULTI-LANGUAGE SEGMENT DATA ==========
// Setiap segmen memiliki data untuk id, en, es
const SEGMENTS_ML = [
  {
    id: 0,
    hexFrom: "#ec4899", hexTo: "#f43f5e",
    gradientBg: "from-pink-900/40 to-rose-950/40",
    gradientText: "from-pink-300 to-rose-400",
    emoji: "💖",
    data: {
      id: {
        name: "Cinta",
        desc: "Keberuntungan sedang berpihak pada hatimu. Momen romantis atau kedatangan seseorang yang spesial ada di depan mata.",
        message: "Cinta sejati bukan tentang menemukan yang sempurna, tapi belajar melihat kesempurnaan dari ketidaksempurnaan.",
        action: "Luangkan waktu untuk berkencan atau sekadar mengirim pesan apresiasi manis pada orang tersayang.",
      },
      en: {
        name: "Love",
        desc: "Luck is on the side of your heart. Romantic moments or the arrival of someone special are just ahead.",
        message: "True love is not about finding perfection, but learning to see perfection in imperfection.",
        action: "Take time for a date or simply send a sweet appreciation message to your loved one.",
      },
      es: {
        name: "Amor",
        desc: "La suerte está de parte de tu corazón. Momentos románticos o la llegada de alguien especial están por venir.",
        message: "El amor verdadero no se trata de encontrar la perfección, sino de aprender a ver la perfección en la imperfección.",
        action: "Tómate un tiempo para una cita o simplemente envía un dulce mensaje de agradecimiento a tu ser querido.",
      },
    },
  },
  {
    id: 1,
    hexFrom: "#3b82f6", hexTo: "#06b6d4",
    gradientBg: "from-blue-900/40 to-cyan-950/40",
    gradientText: "from-blue-300 to-cyan-400",
    emoji: "💼",
    data: {
      id: {
        name: "Karir",
        desc: "Peluang eskalasi tanggung jawab atau proyek besar menanti. Tunjukkan kepemimpinan dan kompetensi terbaikmu.",
        message: "Kesuksesan bukan tentang seberapa tinggi kau melompat, tapi seberapa kokoh kau mendarat.",
        action: "Ambil inisiatif lebih di tempat kerja hari ini. Keberanianmu akan mendapat atensi.",
      },
      en: {
        name: "Career",
        desc: "Opportunities for responsibility escalation or big projects await. Show your best leadership and competence.",
        message: "Success is not about how high you jump, but how firmly you land.",
        action: "Take more initiative at work today. Your courage will get attention.",
      },
      es: {
        name: "Carrera",
        desc: "Te esperan oportunidades de escalar responsabilidades o grandes proyectos. Muestra tu mejor liderazgo y competencia.",
        message: "El éxito no se trata de qué tan alto saltas, sino de qué tan firmemente aterrizas.",
        action: "Toma más iniciativa en el trabajo hoy. Tu valentía llamará la atención.",
      },
    },
  },
  {
    id: 2,
    hexFrom: "#10b981", hexTo: "#22c55e",
    gradientBg: "from-emerald-900/40 to-green-950/40",
    gradientText: "from-emerald-300 to-green-400",
    emoji: "💰",
    data: {
      id: {
        name: "Keuangan",
        desc: "Arus kas positif atau keuntungan finansial tersembunyi akan segera terwujud. Pastikan dikelola dengan logis.",
        message: "Kekayaan sejati bukanlah mengumpulkan sebanyak-banyaknya, melainkan merasa cukup.",
        action: "Tahan impulsivitas belanja. Alokasikan ekstra 10% pendapatanmu untuk instrumen investasi.",
      },
      en: {
        name: "Finance",
        desc: "Positive cash flow or hidden financial gains will soon materialize. Make sure to manage them logically.",
        message: "True wealth is not about accumulating as much as possible, but feeling sufficient.",
        action: "Resist shopping impulsivity. Allocate an extra 10% of your income to investment instruments.",
      },
      es: {
        name: "Finanzas",
        desc: "Pronto se materializarán flujos de efectivo positivos o ganancias financieras ocultas. Asegúrate de gestionarlos lógicamente.",
        message: "La verdadera riqueza no se trata de acumular lo más posible, sino de sentirse suficiente.",
        action: "Resiste la impulsividad de compras. Asigna un 10% extra de tus ingresos a instrumentos de inversión.",
      },
    },
  },
  {
    id: 3,
    hexFrom: "#14b8a6", hexTo: "#0d9488",
    gradientBg: "from-teal-900/40 to-emerald-950/40",
    gradientText: "from-teal-300 to-emerald-400",
    emoji: "🩺",
    data: {
      id: {
        name: "Kesehatan",
        desc: "Aura revitalisasi menyelimuti tubuh dan pikiranmu. Ini adalah momentum puncak untuk mengatur ulang pola hidup.",
        message: "Kesehatan adalah mahkota di atas kepala orang sehat, yang hanya bisa dilihat oleh orang sakit.",
        action: "Lakukan peregangan 15 menit hari ini, kurangi gula, dan perbaiki kualitas hidrasi harianmu.",
      },
      en: {
        name: "Health",
        desc: "A revitalizing aura envelops your body and mind. This is the peak moment to reset your lifestyle.",
        message: "Health is a crown on the head of the healthy, seen only by the sick.",
        action: "Do 15 minutes of stretching today, reduce sugar, and improve your daily hydration.",
      },
      es: {
        name: "Salud",
        desc: "Un aura revitalizante envuelve tu cuerpo y mente. Este es el momento cumbre para reiniciar tu estilo de vida.",
        message: "La salud es una corona en la cabeza del sano, vista solo por el enfermo.",
        action: "Haz 15 minutos de estiramientos hoy, reduce el azúcar y mejora tu hidratación diaria.",
      },
    },
  },
  {
    id: 4,
    hexFrom: "#a855f7", hexTo: "#6366f1",
    gradientBg: "from-purple-900/40 to-indigo-950/40",
    gradientText: "from-purple-300 to-indigo-400",
    emoji: "🤝",
    data: {
      id: {
        name: "Koneksi",
        desc: "Jaringan sosial yang sangat berharga akan beririsan dengan hidupmu. Terbukalah pada komunikasi baru.",
        message: "Sahabat sejati adalah keluarga yang kita pilih sendiri melalui seleksi waktu.",
        action: "Hubungi mentor atau teman lama yang sudah lama terputus komunikasinya. Inisiasi obrolan hangat.",
      },
      en: {
        name: "Connection",
        desc: "Invaluable social networks will intersect with your life. Be open to new communication.",
        message: "A true friend is the family we choose ourselves through time selection.",
        action: "Contact a mentor or old friend you've lost touch with. Initiate a warm conversation.",
      },
      es: {
        name: "Conexión",
        desc: "Redes sociales invaluables se cruzarán con tu vida. Abrete a nuevas comunicaciones.",
        message: "Un verdadero amigo es la familia que elegimos nosotros mismos a través de la selección del tiempo.",
        action: "Contacta a un mentor o viejo amigo con quien hayas perdido el contacto. Inicia una conversación cálida.",
      },
    },
  },
  {
    id: 5,
    hexFrom: "#8b5cf6", hexTo: "#7c3aed",
    gradientBg: "from-violet-900/40 to-purple-950/40",
    gradientText: "from-violet-300 to-purple-400",
    emoji: "🧘",
    data: {
      id: {
        name: "Spiritual",
        desc: "Kedamaian batin dan kejernihan pikiran sedang berada di puncaknya. Sangat cocok untuk refleksi.",
        message: "Kedamaian bukanlah ketiadaan badai, melainkan ketenangan di pusat badai tersebut.",
        action: "Lakukan meditasi 10 menit, atau tuliskan 3 hal kecil yang paling Anda syukuri hari ini.",
      },
      en: {
        name: "Spiritual",
        desc: "Inner peace and mental clarity are at their peak. Perfect for reflection.",
        message: "Peace is not the absence of storm, but calm at its center.",
        action: "Meditate for 10 minutes, or write down 3 small things you are most grateful for today.",
      },
      es: {
        name: "Espiritual",
        desc: "La paz interior y la claridad mental están en su punto máximo. Perfecto para la reflexión.",
        message: "La paz no es la ausencia de tormenta, sino la calma en su centro.",
        action: "Medita durante 10 minutos, o escribe 3 pequeñas cosas por las que estás más agradecido hoy.",
      },
    },
  },
  {
    id: 6,
    hexFrom: "#f97316", hexTo: "#f59e0b",
    gradientBg: "from-orange-900/40 to-amber-950/40",
    gradientText: "from-orange-300 to-amber-400",
    emoji: "🗺️",
    data: {
      id: {
        name: "Eksplorasi",
        desc: "Rasa penasaranmu akan memicu pengalaman epik yang baru. Inilah saatnya keluar dari cangkang zona nyaman.",
        message: "Rutinitas yang aman membunuh jiwa secara perlahan. Hidup ada di luar sana.",
        action: "Pilih rute pulang yang berbeda, tonton genre film baru, atau rencanakan liburan spontan.",
      },
      en: {
        name: "Exploration",
        desc: "Your curiosity will spark epic new experiences. Time to break out of your comfort zone.",
        message: "Safe routine slowly kills the soul. Life is out there.",
        action: "Take a different route home, watch a new movie genre, or plan a spontaneous trip.",
      },
      es: {
        name: "Exploración",
        desc: "Tu curiosidad desencadenará nuevas experiencias épicas. Es hora de salir de tu zona de confort.",
        message: "La rutina segura mata el alma lentamente. La vida está ahí fuera.",
        action: "Toma una ruta diferente a casa, mira un nuevo género de película o planea un viaje espontáneo.",
      },
    },
  },
  {
    id: 7,
    hexFrom: "#f43f5e", hexTo: "#e11d48",
    gradientBg: "from-rose-900/40 to-pink-950/40",
    gradientText: "from-rose-300 to-pink-400",
    emoji: "🎨",
    data: {
      id: {
        name: "Kreativitas",
        desc: "Bendungan inspirasi dalam otakmu sedang terbuka lebar. Ide-ide brilian siap untuk dieksekusi menjadi karya.",
        message: "Kreativitas adalah wujud dari kecerdasan yang sedang bermain dan bersenang-senang.",
        action: "Alokasikan 30 menit fokus penuh untuk menulis, merancang, atau berkarya tanpa memikirkan kesempurnaan.",
      },
      en: {
        name: "Creativity",
        desc: "The dam of inspiration in your brain is wide open. Brilliant ideas are ready to be executed into works.",
        message: "Creativity is a form of intelligence that is playing and having fun.",
        action: "Allocate 30 minutes of full focus to write, design, or create without thinking about perfection.",
      },
      es: {
        name: "Creatividad",
        desc: "La presa de inspiración en tu cerebro está abierta de par en par. Las ideas brillantes están listas para convertirse en obras.",
        message: "La creatividad es una forma de inteligencia que juega y se divierte.",
        action: "Dedica 30 minutos de enfoque total para escribir, diseñar o crear sin pensar en la perfección.",
      },
    },
  },
];

// ========== KOMPONEN UTAMA ==========
export default function WheelOfFortune() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const DURATION_MS = 4000;

  // Data segmen dalam bahasa yang dipilih
  const segments = SEGMENTS_ML.map(seg => ({
    ...seg,
    data: seg.data[lang] || seg.data["id"],
  }));

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    setResult(null);

    const baseSpins = (6 + Math.floor(Math.random() * 4)) * 360;
    const extraDegree = Math.floor(Math.random() * 360);
    const newRotation = rotation + baseSpins + extraDegree;
    setRotation(newRotation);

    setTimeout(() => {
      const finalMod = newRotation % 360;
      const normalizedPointer = (360 - finalMod) % 360;
      const winningIndex = Math.floor(normalizedPointer / 45);
      const selected = segments[winningIndex];
      setResult(selected);
      setShowResult(true);
      setSpinning(false);

      import("canvas-confetti")
        .then((mod) => {
          mod.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        })
        .catch(() => console.warn("Confetti failed to load"));
    }, DURATION_MS);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${result.emoji} ${result.data.name}\n\n${result.data.message}\n${dict.labels.strategy}: ${result.data.action}\n\n${dict.disclaimer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dict.title, text });
      } catch (e) {
        console.warn(e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
      } catch (err) {
        alert("Failed to copy.");
      }
    }
  };

  // Siapkan data untuk SVG (tetap menggunakan hexFrom/hexTo dari segmen asli)
  const svgSegments = SEGMENTS_ML; // untuk gradient SVG (tidak perlu bahasa)

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🎡✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Wheel Container */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px]">
          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            <div className="w-6 h-8 bg-gradient-to-b from-white to-slate-300 rounded-t-full shadow-inner border-2 border-slate-400"></div>
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-slate-300 -mt-1"></div>
          </div>

          {/* Spinning Wheel */}
          <div
            className="w-full h-full rounded-full border-8 border-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-slate-900"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: `transform ${DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.1, 1)`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
              <defs>
                {svgSegments.map((seg, idx) => (
                  <linearGradient key={`grad${idx}`} id={`grad${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={seg.hexFrom} />
                    <stop offset="100%" stopColor={seg.hexTo} />
                  </linearGradient>
                ))}
              </defs>

              {svgSegments.map((seg, idx) => {
                const startAngle = idx * 45;
                const endAngle = (idx + 1) * 45;
                const midAngle = startAngle + 22.5;
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <g key={idx}>
                    <path d={pathData} fill={`url(#grad${idx})`} stroke="#1e293b" strokeWidth="0.8" />
                    <g transform={`translate(50, 50) rotate(${midAngle - 90}) translate(35, 0) rotate(90)`}>
                      <text
                        x="0"
                        y="0"
                        fontSize="10"
                        textAnchor="middle"
                        alignmentBaseline="central"
                        className="drop-shadow-lg"
                        style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))" }}
                      >
                        {seg.emoji}
                      </text>
                    </g>
                  </g>
                );
              })}

              <circle cx="50" cy="50" r="12" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="5" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="flex justify-center">
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-black tracking-widest uppercase text-sm md:text-base hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2"
        >
          {spinning ? dict.spinningText : dict.spinBtn}
        </button>
      </div>

      {/* Loading/Spinning Indicator */}
      {spinning && (
        <div className="flex justify-center my-8 flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-[10px] font-mono tracking-widest animate-pulse">
            SPINNING...
          </p>
        </div>
      )}

      {/* Empty State (sebelum putaran pertama) */}
      {!spinning && !showResult && !result && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.emptyMessage}</p>
        </div>
      )}

      {/* Result Card */}
      {!spinning && showResult && result && (
        <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div
            className={`relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br ${result.gradientBg}`}
          >
            <div className="relative z-10 text-center">
              <div className="text-7xl mb-3 drop-shadow-2xl">{result.emoji}</div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-300 mb-1">
                {dict.labels.yourAura}
              </p>
              <h3
                className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${result.gradientText} bg-clip-text text-transparent pb-1 drop-shadow-sm`}
              >
                {dict.labels.sector} {result.data.name}
              </h3>

              <div className="mt-6 bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                <p className="text-slate-200 text-sm leading-relaxed">{result.data.desc}</p>
              </div>

              <div className="mt-5 p-5 bg-gradient-to-r from-white/10 to-transparent rounded-2xl border-l-4 border-amber-500 text-left">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <span>✨</span> {dict.labels.enlightenment}
                </p>
                <p className="text-slate-100 text-sm italic leading-relaxed">"{result.data.message}"</p>
              </div>

              <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-white/5 text-left">
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <span>🎯</span> {dict.labels.strategy}
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">{result.data.action}</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all uppercase tracking-wider text-slate-100"
                >
                  📤 {dict.shareBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
            <p className="text-amber-200 text-sm font-medium italic">"{dict.quote}"</p>
          </div>
          
          {/* INJEKSI PAYWALL MULAI DARI SINI */}
          
            <div className="flex justify-center mt-6 mb-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleShare} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-all active:scale-95 gap-2"
              >
                📤 {dict.shareBtn || "Bagikan Hasil"}
              </button>
            </div>
            <PremiumPaywall 
            toolName={dict.title} 
            resultId={result.id.toString()} 
          />
          {/* SAMPAI SINI */}

        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800 max-w-lg mx-auto">
        {dict.disclaimer}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}