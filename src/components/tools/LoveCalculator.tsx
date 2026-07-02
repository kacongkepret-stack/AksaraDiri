"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Kalkulator Resonansi",
    badge: "Ultra Premium",
    subtitle: "Analisis kecocokan nama berdasarkan matriks numerologi & algoritma hash energi. Temukan potensi harmonimu.",
    shareBtn: "Bagikan",
    inputs: {
      name1Placeholder: "Masukkan Nama Anda...",
      name2Placeholder: "Masukkan Nama Pasangan...",
      analyze: "🔮 Eksekusi Kalkulasi",
      computing: "Menyinkronkan Matriks...",
      emptyMessage: "Masukkan kedua nama untuk memulai analisis resonansi.",
    },
    labels: {
      communication: "Komunikasi Visual",
      trust: "Kepercayaan Fundamental",
      passion: "Intensitas Gairah",
      commitment: "Kapasitas Komitmen",
      recommendation: "Rekomendasi Eksekusi",
      profile: "Profil Numerologi Pythagorean",
      disclaimer: "*Kalkulasi di atas menggabungkan metode Numerologi Pythagorean dengan algoritma hash statis murni untuk tujuan hiburan (entertainment). Hubungan dunia nyata dibangun dengan komunikasi aktif, bukan sekadar angka probabilitas.",
      quote: "\"Cinta bukan tentang menemukan orang yang sempurna, tapi belajar melihat kesempurnaan dalam ketidaksempurnaan.\"",
    },
    categories: {
      high: "🔥 Harmoni Tinggi",
      medium: "💧 Potensi Kuat",
      low: "🌸 Fase Adaptasi",
      veryLow: "💤 Rasionalisasi",
    },
  },
  en: {
    title: "Resonance Calculator",
    badge: "Ultra Premium",
    subtitle: "Name compatibility analysis based on numerology matrix & energy hash algorithm. Discover your harmony potential.",
    shareBtn: "Share",
    inputs: {
      name1Placeholder: "Enter Your Name...",
      name2Placeholder: "Enter Partner's Name...",
      analyze: "🔮 Execute Calculation",
      computing: "Synchronizing Matrix...",
      emptyMessage: "Enter both names to start resonance analysis.",
    },
    labels: {
      communication: "Visual Communication",
      trust: "Fundamental Trust",
      passion: "Passion Intensity",
      commitment: "Commitment Capacity",
      recommendation: "Execution Recommendation",
      profile: "Pythagorean Numerology Profile",
      disclaimer: "*The above calculation combines Pythagorean Numerology with a static hash algorithm for entertainment purposes. Real-world relationships are built on active communication, not just probability numbers.",
      quote: "\"Love is not about finding the perfect person, but learning to see perfection in imperfection.\"",
    },
    categories: {
      high: "🔥 High Harmony",
      medium: "💧 Strong Potential",
      low: "🌸 Adaptation Phase",
      veryLow: "💤 Rationalization",
    },
  },
  es: {
    title: "Calculador de Resonancia",
    badge: "Ultra Premium",
    subtitle: "Análisis de compatibilidad de nombres basado en matriz de numerología y algoritmo hash de energía. Descubre tu potencial de armonía.",
    shareBtn: "Compartir",
    inputs: {
      name1Placeholder: "Ingresa tu nombre...",
      name2Placeholder: "Ingresa el nombre de tu pareja...",
      analyze: "🔮 Ejecutar Cálculo",
      computing: "Sincronizando Matriz...",
      emptyMessage: "Ingresa ambos nombres para comenzar el análisis de resonancia.",
    },
    labels: {
      communication: "Comunicación Visual",
      trust: "Confianza Fundamental",
      passion: "Intensidad de Pasión",
      commitment: "Capacidad de Compromiso",
      recommendation: "Recomendación de Ejecución",
      profile: "Perfil de Numerología Pitagórica",
      disclaimer: "*El cálculo anterior combina Numerología Pitagórica con un algoritmo hash estático con fines de entretenimiento. Las relaciones del mundo real se construyen con comunicación activa, no solo con números de probabilidad.",
      quote: "\"El amor no se trata de encontrar a la persona perfecta, sino de aprender a ver la perfección en la imperfección.\"",
    },
    categories: {
      high: "🔥 Armonía Alta",
      medium: "💧 Potencial Fuerte",
      low: "🌸 Fase de Adaptación",
      veryLow: "💤 Racionalización",
    },
  },
};

// ========== INTERFACES ==========
interface PillarData {
  communication: number;
  trust: number;
  passion: number;
  commitment: number;
}

interface LoveResult {
  score: number;
  pillars: PillarData;
  message: string;
  dateIdea: string;
  funFact: string;
  numer1: number;
  numer2: number;
  heart1: number;
  heart2: number;
  n1?: string;
  n2?: string;
  personality1: number;
  personality2: number;
}

interface CategoryData {
  name: string;
  emoji: string;
  bgGradient: string;
  textGradient: string;
}

// ========== NUMEROLOGI NAMA (PYTHAGOREAN) ==========
const letterValues: Record<string, number> = {
  a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
  j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
  s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
};

function getNumerologyNumber(name: string): number {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (const ch of clean) total += letterValues[ch] || 0;
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total).split('').reduce((a,b) => a + parseInt(b), 0);
  }
  return total;
}

function getHeartDesire(name: string): number {
  const vowels = ['a','e','i','o','u','y'];
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (const ch of clean) if (vowels.includes(ch)) total += letterValues[ch] || 0;
  while (total > 9 && total !== 11 && total !== 22) {
    total = String(total).split('').reduce((a,b) => a + parseInt(b), 0);
  }
  return total;
}

function getPersonality(name: string): number {
  const vowels = ['a','e','i','o','u','y'];
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (const ch of clean) if (!vowels.includes(ch)) total += letterValues[ch] || 0;
  while (total > 9 && total !== 11 && total !== 22) {
    total = String(total).split('').reduce((a,b) => a + parseInt(b), 0);
  }
  return total;
}

// ========== ALGORITMA HASH ==========
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function calculateLoveScore(name1: string, name2: string): number {
  const clean1 = name1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const clean2 = name2.toLowerCase().replace(/[^a-z0-9]/g, "");
  const combined = [clean1, clean2].sort().join("");
  return hashString(combined) % 101;
}

function getPillarScores(name1: string, name2: string): PillarData {
  const clean1 = name1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const clean2 = name2.toLowerCase().replace(/[^a-z0-9]/g, "");
  const combined = [clean1, clean2].sort().join("");
  const seed = hashString(combined);
  const base = calculateLoveScore(name1, name2);
  return {
    communication: Math.min(99, Math.max(20, base + (seed % 15) - 5)),
    trust: Math.min(99, Math.max(20, base + ((seed >> 2) % 20) - 10)),
    passion: Math.min(99, Math.max(20, base + ((seed >> 4) % 18) - 8)),
    commitment: Math.min(99, Math.max(20, Math.floor((base + (seed % 12) + (seed >> 3) % 12) / 2))),
  };
}

// ========== PESAN MULTI-BAHASA ==========
const getLoveMessage = (score: number, lang: string): string => {
  if (lang === "en") {
    if (score >= 85) return "✨ Extraordinary compatibility! The universe approves. Maintain this love fire by continuously appreciating each other.";
    if (score >= 70) return "💖 Very promising relationship! Your communication is good, improve trust by being more open.";
    if (score >= 50) return "🌸 Natural vibration exists. Focus on building commitment and resolving differences with a cool head.";
    if (score >= 30) return "🌱 Building a relationship takes time. Use differences as evaluation material; don't force it if not aligned.";
    return "🕯️ Algorithmically, many energy collisions. Perhaps you are better suited as friends/acquaintances.";
  }
  if (lang === "es") {
    if (score >= 85) return "✨ ¡Compatibilidad extraordinaria! El universo lo aprueba. Mantén este fuego de amor apreciándolos mutuamente.";
    if (score >= 70) return "💖 ¡Relación muy prometedora! Tu comunicación es buena, mejora la confianza siendo más abierto.";
    if (score >= 50) return "🌸 Existe vibración natural. Concéntrate en construir compromiso y resolver diferencias con cabeza fría.";
    if (score >= 30) return "🌱 Construir una relación lleva tiempo. Usa las diferencias como material de evaluación; no fuerces si no hay alineación.";
    return "🕯️ Algorítmicamente, muchas colisiones de energía. Quizás sean más adecuados como amigos/conocidos.";
  }
  // default Indonesian
  if (score >= 85) return "✨ Kecocokan luar biasa! Alam semesta merestui. Pertahankan api cinta ini dengan terus saling mengapresiasi.";
  if (score >= 70) return "💖 Hubungan yang sangat potensial! Komunikasi Anda sudah baik, tingkatkan kepercayaan dengan lebih terbuka.";
  if (score >= 50) return "🌸 Terdapat vibrasi alami. Fokus pada membangun komitmen dan menyelesaikan perbedaan dengan kepala dingin.";
  if (score >= 30) return "🌱 Membangun relasi butuh waktu. Jadikan perbedaan sebagai bahan evaluasi, jangan paksakan jika tidak selaras.";
  return "🕯️ Secara algoritma, banyak benturan energi. Mungkin saat ini kalian lebih cocok sebagai relasi/sahabat.";
};

const getDateIdea = (score: number, lang: string): string => {
  if (lang === "en") {
    if (score >= 80) return "Casual dinner at your favorite spot, or just spend time without smartphone distractions.";
    if (score >= 60) return "Collaborative activities like cooking together or playing quiz games to strengthen teamwork.";
    if (score >= 40) return "An evening walk with light conversation, or watch a comedy movie to ease tension.";
    return "Give time for each other's hobbies. Being together too often can trigger ego friction.";
  }
  if (lang === "es") {
    if (score >= 80) return "Cena informal en tu lugar favorito, o simplemente pasar tiempo sin distracciones del teléfono.";
    if (score >= 60) return "Actividades colaborativas como cocinar juntos o jugar juegos de preguntas para fortalecer el trabajo en equipo.";
    if (score >= 40) return "Un paseo vespertino con conversación ligera, o ver una película de comedia para aliviar la tensión.";
    return "Da tiempo a los pasatiempos de cada uno. Estar juntos demasiado tiempo puede provocar fricciones de ego.";
  }
  // default Indonesian
  if (score >= 80) return "Makan malam santai di tempat favorit, atau sekadar menghabiskan waktu tanpa gangguan smartphone.";
  if (score >= 60) return "Aktivitas kolaboratif seperti memasak bersama atau bermain game kuis untuk mempererat kerja sama tim.";
  if (score >= 40) return "Jalan sore sambil mengobrol ringan, atau menonton film komedi untuk mencairkan ketegangan.";
  return "Berikan waktu untuk hobi masing-masing. Terlalu sering bersama justru bisa memicu gesekan ego.";
};

const getFunFact = (name1: string, name2: string, lang: string): string => {
  const vowel1 = (name1.match(/[aiueo]/gi) || []).length;
  const vowel2 = (name2.match(/[aiueo]/gi) || []).length;
  const init1 = name1.charAt(0).toUpperCase();
  const init2 = name2.charAt(0).toUpperCase();
  const sameMsg = init1 === init2 
    ? (lang === "id" ? "sama, pertanda kesamaan visi pola pikir!" : lang === "en" ? "same, indicating similar mindset vision!" : "¡iguales, indican una visión de mentalidad similar!")
    : (lang === "id" ? "berbeda, saling melengkapi layaknya yin & yang!" : lang === "en" ? "different, complementing each other like yin & yang!" : "diferentes, ¡se complementan como el yin y el yang!");
  if (lang === "en") return `Fun Fact: Your name has ${vowel1} vowels, partner's name has ${vowel2}. Initials ${init1} & ${init2} – ${sameMsg}`;
  if (lang === "es") return `Dato Curioso: Tu nombre tiene ${vowel1} vocales, el de tu pareja ${vowel2}. Iniciales ${init1} & ${init2} – ${sameMsg}`;
  return `Fakta Unik: Nama Anda memiliki ${vowel1} vokal, pasangan ${vowel2}. Inisial ${init1} & ${init2} – ${sameMsg}`;
};

function getCategory(score: number, dict: any): CategoryData {
  if (score >= 80) {
    return {
      name: dict.categories.high,
      emoji: "💘",
      bgGradient: "from-rose-950/40 to-red-950/30",
      textGradient: "from-rose-400 to-red-500"
    };
  }
  if (score >= 60) {
    return {
      name: dict.categories.medium,
      emoji: "💝",
      bgGradient: "from-cyan-950/40 to-blue-950/30",
      textGradient: "from-cyan-400 to-blue-500"
    };
  }
  if (score >= 40) {
    return {
      name: dict.categories.low,
      emoji: "💞",
      bgGradient: "from-purple-950/40 to-fuchsia-950/30",
      textGradient: "from-purple-400 to-fuchsia-500"
    };
  }
  return {
    name: dict.categories.veryLow,
    emoji: "💔",
    bgGradient: "from-slate-900/60 to-gray-900/60",
    textGradient: "from-slate-400 to-gray-400"
  };
}

// ========== CONFETTI ==========
const triggerConfetti = async () => {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.7, x: 0.2 }, startVelocity: 15 });
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.7, x: 0.8 }, startVelocity: 15 });
  } catch (e) {
    console.warn("Canvas confetti not installed, skipping animation.");
  }
};

// ========== KOMPONEN UTAMA ==========
export default function LoveCalculator() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<LoveResult | null>(null);

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setAnalyzed(false);
    setResult(null);
    
    setTimeout(() => {
      const score = calculateLoveScore(name1, name2);
      const pillars = getPillarScores(name1, name2);
      const message = getLoveMessage(score, lang);
      const dateIdea = getDateIdea(score, lang);
      const funFact = getFunFact(name1, name2, lang);
      const numer1 = getNumerologyNumber(name1);
      const numer2 = getNumerologyNumber(name2);
      const heart1 = getHeartDesire(name1);
      const heart2 = getHeartDesire(name2);
      const personality1 = getPersonality(name1);
      const personality2 = getPersonality(name2);
      
      setResult({ score, pillars, message, dateIdea, funFact, numer1, numer2, heart1, heart2, personality1, personality2 });
      setAnalyzed(true);
      setLoading(false);
      
      if (score >= 80) {
        triggerConfetti();
      }
    }, 1800);
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setResult(null);
    setAnalyzed(false);
  };

  const handleShare = async () => {
    if (!result) return;
    const cat = getCategory(result.score, dict);
    const text = `${dict.title}: ${name1.trim()} ❤️ ${name2.trim()}\n${dict.labels.communication}: ${result.pillars.communication}% | ${dict.labels.trust}: ${result.pillars.trust}%\nSkor Total: ${result.score}% (${cat.name})\n\n${result.message}\n\n${dict.labels.disclaimer}`;
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

  const category = result ? getCategory(result.score, dict) : null;

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2 animate-bounce drop-shadow-lg" style={{ animationDuration: '3s' }}>💘✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="space-y-4">
          <input 
            type="text" 
            value={name1} 
            onChange={(e) => setName1(e.target.value)} 
            placeholder={dict.inputs.name1Placeholder} 
            maxLength={40}
            className="w-full bg-slate-900/60 border border-pink-500/30 rounded-xl px-5 py-3.5 text-center font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all placeholder-slate-500" 
          />
          <div className="text-center text-xl text-pink-400 font-bold opacity-80">&</div>
          <input 
            type="text" 
            value={name2} 
            onChange={(e) => setName2(e.target.value)} 
            placeholder={dict.inputs.name2Placeholder} 
            maxLength={40}
            className="w-full bg-slate-900/60 border border-pink-500/30 rounded-xl px-5 py-3.5 text-center font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all placeholder-slate-500" 
          />
        </div>
        
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleCalculate} 
            disabled={loading || !name1.trim() || !name2.trim()} 
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {loading ? dict.inputs.computing : dict.inputs.analyze}
          </button>
          {result && !loading && (
            <button 
              onClick={handleReset} 
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center text-lg" 
              title="Reset"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
          <p className="text-pink-400 text-xs font-mono tracking-widest animate-pulse">COMPUTING...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !analyzed && !result && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results Container */}
      {!loading && analyzed && result && category && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className={`relative overflow-hidden bg-gradient-to-br ${category.bgGradient} border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl`}>
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Score Display */}
            <div className="text-center relative z-10">
              <div className="text-6xl drop-shadow-md">{category.emoji}</div>
              <div className={`text-6xl md:text-7xl font-black mt-2 bg-gradient-to-r ${category.textGradient} bg-clip-text text-transparent drop-shadow-sm`}>
                {result.score}%
              </div>
              <div className="inline-block mt-3 px-4 py-1.5 bg-black/30 rounded-full border border-white/10">
                <p className="text-sm font-bold tracking-widest uppercase text-slate-200">{category.name}</p>
              </div>
            </div>

            {/* 4 Pilar Progress Bars */}
            <div className="mt-8 space-y-4 relative z-10 bg-black/20 p-5 rounded-2xl border border-white/5">
              <Pillar label={dict.labels.communication} value={result.pillars.communication} bgClass="bg-blue-500" textClass="text-blue-300" />
              <Pillar label={dict.labels.trust} value={result.pillars.trust} bgClass="bg-emerald-500" textClass="text-emerald-300" />
              <Pillar label={dict.labels.passion} value={result.pillars.passion} bgClass="bg-pink-500" textClass="text-pink-300" />
              <Pillar label={dict.labels.commitment} value={result.pillars.commitment} bgClass="bg-purple-500" textClass="text-purple-300" />
            </div>

            {/* Narrative Messages */}
            <div className="relative z-10 mt-6 space-y-3">
              <div className="p-4 bg-gradient-to-r from-rose-500/10 to-transparent border-l-4 border-rose-500 rounded-r-xl">
                <p className="text-slate-100 text-sm italic font-medium leading-relaxed">"{result.message}"</p>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">💡 {dict.labels.recommendation}</p>
                <p className="text-slate-200 text-xs leading-relaxed">{result.dateIdea}</p>
              </div>

              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">✨ {dict.labels.profile}</p>
                <p className="text-slate-200 text-xs leading-relaxed">{result.funFact}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-xl border border-pink-500/30">
              <p className="text-pink-200 text-sm font-medium italic">"{dict.labels.quote}"</p>
            </div>

            {/* INJEKSI PAYWALL MULAI DARI SINI */}
            
            <>
<div className="flex justify-center mt-6 mb-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleShare} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-all active:scale-95 gap-2"
              >
                📤 "Bagikan Hasil"
              </button>
            </div>
            <PremiumPaywall 
              toolName={dict.title} 
              resultId={`${result.n1}-${result.n2}`} 
            />
</>
            {/* SAMPAI SINI */}

          </div>
        </div>
      )}
      
      {/* Footer Disclaimer */}
      <div className="mt-8 text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4 px-2">
        {dict.labels.disclaimer}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// ========== SUB-KOMPONEN PILLAR ==========
function Pillar({ label, value, bgClass, textClass }: { label: string; value: number; bgClass: string; textClass: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wide">
        <span className="text-slate-300">{label}</span>
        <span className={textClass}>{value}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div 
          className={`h-full rounded-full ${bgClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}