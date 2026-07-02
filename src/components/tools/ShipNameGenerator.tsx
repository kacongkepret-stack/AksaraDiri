"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Generator Nama Pasangan",
    subtitle: "Fusi nama natural & estetis untuk kalian berdua",
    placeholders: ["Nama pertama", "Nama kedua"],
    btnGenerate: "🚀 Gabungkan Nama",
    btnLoading: "Menggabungkan...",
    errorEmpty: "Tidak dapat menghasilkan nama gabungan yang natural. Coba dengan nama yang lebih panjang atau berbeda.",
    resultTitle: "✨ Rekomendasi Nama Gabungan:",
    badgeBest: "Terbaik",
    synergy: "Sinergi",
    btnCopy: "Salin",
    btnCopied: "Disalin",
    btnShare: "📤 Bagikan Hasil",
    disclaimer: "*Nama dihasilkan dengan algoritma peleburan fonetik. Hasil bersifat kreatif & hiburan.",
    sharePrefix: "🚢 Ship Name Generator 🚢",
    shareSuffix: "Ciptakan nama pasanganmu di AksaraDiri!",
    vibes: [
      "Kekuatan Dominan (Power Couple) 👑",
      "Harmoni Lembut (Soft & Sweet) 🌸",
      "Energi Karismatik (Main Character) ✨",
      "Dinamika Unik (Chaotic Good) 🌪️",
      "Misterius & Elegan (Dark Academia) 🌙",
      "Ceria & Hangat (Golden Retriever) ☀️",
      "Sinergi Intelektual (Smart Duo) 🧠"
    ]
  },
  en: {
    title: "Couple Name Generator",
    subtitle: "Natural & aesthetic name fusion for the two of you",
    placeholders: ["First name", "Second name"],
    btnGenerate: "🚀 Combine Names",
    btnLoading: "Combining...",
    errorEmpty: "Could not generate a natural combined name. Try longer or different names.",
    resultTitle: "✨ Combined Name Recommendations:",
    badgeBest: "Best",
    synergy: "Synergy",
    btnCopy: "Copy",
    btnCopied: "Copied",
    btnShare: "📤 Share Results",
    disclaimer: "*Names are generated using a phonetic blending algorithm. Results are for creative & entertainment.",
    sharePrefix: "🚢 Ship Name Generator 🚢",
    shareSuffix: "Create your couple name at AksaraDiri!",
    vibes: [
      "Dominant Power (Power Couple) 👑",
      "Soft Harmony (Soft & Sweet) 🌸",
      "Charismatic Energy (Main Character) ✨",
      "Unique Dynamics (Chaotic Good) 🌪️",
      "Mysterious & Elegant (Dark Academia) 🌙",
      "Cheerful & Warm (Golden Retriever) ☀️",
      "Intellectual Synergy (Smart Duo) 🧠"
    ]
  },
  es: {
    title: "Generador de Nombres de Pareja",
    subtitle: "Fusión de nombres natural y estética para ustedes dos",
    placeholders: ["Primer nombre", "Segundo nombre"],
    btnGenerate: "🚀 Combinar Nombres",
    btnLoading: "Combinando...",
    errorEmpty: "No se pudo generar un nombre combinado natural. Prueba con nombres más largos o diferentes.",
    resultTitle: "✨ Recomendaciones de Nombres:",
    badgeBest: "Mejor",
    synergy: "Sinergia",
    btnCopy: "Copiar",
    btnCopied: "Copiado",
    btnShare: "📤 Compartir Resultados",
    disclaimer: "*Los nombres se generan usando un algoritmo de mezcla fonética. Fines creativos y de entretenimiento.",
    sharePrefix: "🚢 Generador de Nombres 🚢",
    shareSuffix: "¡Crea tu nombre de pareja en AksaraDiri!",
    vibes: [
      "Poder Dominante (Power Couple) 👑",
      "Armonía Suave (Soft & Sweet) 🌸",
      "Energía Carismática (Main Character) ✨",
      "Dinámica Única (Chaotic Good) 🌪️",
      "Misterioso y Elegante (Dark Academia) 🌙",
      "Alegre y Cálido (Golden Retriever) ☀️",
      "Sinergia Intelectual (Smart Duo) 🧠"
    ]
  }
};

const VIBES_COLORS = [
  "from-amber-500 to-orange-600",
  "from-pink-400 to-rose-500",
  "from-purple-500 to-indigo-600",
  "from-emerald-400 to-teal-500",
  "from-slate-600 to-slate-800",
  "from-yellow-400 to-amber-500",
  "from-blue-500 to-cyan-500"
];

// ========== INTERFACES ==========
interface ShipResult {
  name: string;
  synergyScore: number;
  vibe: string;
  gradient: string;
}

// ========== FUNGSI HASH ==========
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ========== ALGORITMA PORTMANTEAU ==========
function generateShipNames(name1: string, name2: string, vibesTextArray: string[]): ShipResult[] {
  const n1 = name1.trim().toLowerCase().replace(/[^a-z]/g, "");
  const n2 = name2.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (n1.length < 2 || n2.length < 2) return [];

  const candidates = new Set<string>();

  // 1. Ambil 3 huruf awal n1 + 3 huruf akhir n2
  if (n1.length >= 3 && n2.length >= 3) {
    candidates.add(n1.slice(0, 3) + n2.slice(-3));
    candidates.add(n2.slice(0, 3) + n1.slice(-3));
  }

  // 2. Ambil 2 huruf awal + 2 huruf akhir
  if (n1.length >= 2 && n2.length >= 2) {
    candidates.add(n1.slice(0, 2) + n2.slice(-2));
    candidates.add(n2.slice(0, 2) + n1.slice(-2));
  }

  // 3. Metode vokal bridge
  const vowelRegex = /[aiueo]/i;
  const match1 = n1.match(vowelRegex);
  const match2 = n2.match(vowelRegex);
  if (match1 && match2 && match1.index !== undefined && match2.index !== undefined) {
    const idx1 = match1.index + 1; 
    const idx2 = match2.index;     
    if (idx1 > 0 && idx1 <= n1.length && idx2 >= 0) {
      candidates.add(n1.slice(0, idx1) + n2.slice(idx2));
      candidates.add(n2.slice(0, idx2 + 1) + n1.slice(idx1 - 1));
    }
  }

  // 4. Metode campuran 4 huruf
  if (n1.length >= 4 && n2.length >= 4) {
    candidates.add(n1.slice(0, 4) + n2.slice(-4));
    candidates.add(n2.slice(0, 4) + n1.slice(-4));
  }

  const valid = Array.from(candidates)
    .filter(name => name.length >= 3 && name !== n1 && name !== n2 && !/([^aiueo]{4,})/i.test(name))
    .map(name => name.charAt(0).toUpperCase() + name.slice(1));

  const scored = valid.map(name => {
    const hash = hashString(name);
    let score = 70 + (hash % 30);
    const consonantRun = (name.match(/[^aiueo]{3,}/gi) || []).length;
    if (consonantRun === 0) score += 10;
    else if (consonantRun === 1) score += 5;
    if (/[aiueo]/i.test(name[0]) && /[aiueo]/i.test(name[name.length-1])) score += 8;
    if (name.length >= 5 && name.length <= 7) score += 7;
    
    score = Math.min(99, score);
    const vibeIndex = hash % vibesTextArray.length;
    
    return { 
      name, 
      synergyScore: score, 
      vibe: vibesTextArray[vibeIndex], 
      gradient: VIBES_COLORS[vibeIndex] 
    };
  });

  scored.sort((a, b) => {
    if (a.synergyScore !== b.synergyScore) return b.synergyScore - a.synergyScore;
    return a.name.length - b.name.length;
  });

  return scored.slice(0, 4);
}

// ========== KOMPONEN UTAMA ==========
export default function ShipNameGenerator({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShipResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setResults([]);
    
    setTimeout(() => {
      const generated = generateShipNames(name1, name2, dict.vibes);
      setResults(generated);
      setLoading(false);
      
      if (generated.length > 0 && generated[0].synergyScore > 90) {
        import("canvas-confetti").then((mod) => {
          mod.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }).catch(() => {});
      }
    }, 1000);
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setResults([]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const shareResults = async () => {
    if (results.length === 0) return;
    const top = results[0];
    const text = `${dict.sharePrefix}\n\n${name1.trim()} + ${name2.trim()} = ${top.name}\n${dict.synergy}: ${top.synergyScore}% | ${top.vibe}\n\n${dict.shareSuffix}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: dict.title, text }); } catch(e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert(dict.btnCopied);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-pulse drop-shadow-xl">🚢✨</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent pb-1">
          {dict.title}
        </h2>
        <p className="text-slate-300 text-sm mt-3">{dict.subtitle}</p>
      </div>

      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <input 
            type="text" 
            value={name1} 
            onChange={(e) => setName1(e.target.value)} 
            placeholder={dict.placeholders[0]} 
            maxLength={20} 
            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold text-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" 
          />
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(6,182,212,0.4)] text-xl font-black">
            +
          </div>
          <input 
            type="text" 
            value={name2} 
            onChange={(e) => setName2(e.target.value)} 
            placeholder={dict.placeholders[1]} 
            maxLength={20} 
            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold text-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" 
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !name1 || !name2} 
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-lg hover:scale-[1.02] transition-all disabled:opacity-50 tracking-wide shadow-lg shadow-cyan-500/25"
          >
            {loading ? dict.btnLoading : dict.btnGenerate}
          </button>
          {results.length > 0 && (
            <button 
              onClick={handleReset} 
              className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-14">
          <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      )}

      {!loading && results.length === 0 && name1 && name2 && (
        <div className="mt-8 text-center p-5 bg-rose-500/10 rounded-2xl border border-rose-500/30 animate-in fade-in">
          <p className="text-rose-300 text-sm font-medium">{dict.errorEmpty}</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <h3 className="text-xl font-bold text-cyan-300 flex items-center justify-center gap-2">
            {dict.resultTitle}
          </h3>
          <div className="grid gap-4">
            {results.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl border ${idx === 0 ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-500/50 shadow-lg shadow-cyan-900/20' : 'bg-white/5 border-white/10'} gap-4 sm:gap-0`}
              >
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-2xl font-black text-white drop-shadow-md">{item.name}</span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {dict.badgeBest}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-slate-300 bg-black/40 px-3 py-1 rounded-lg">
                      {dict.synergy} <span className="text-cyan-400">{item.synergyScore}%</span>
                    </span>
                    <span className={`text-xs bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent font-bold`}>
                      {item.vibe}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(item.name, idx)} 
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${copiedIndex === idx ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-white/10 hover:bg-white/20 border border-transparent'}`}
                >
                  {copiedIndex === idx ? dict.btnCopied : dict.btnCopy}
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={shareResults} 
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              {dict.btnShare}
            </button>
          </div>
          
          {/* Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-6 mt-6 border-t border-white/10 max-w-lg mx-auto">
            {dict.disclaimer}
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
            resultId="shipname-generator" 
          />
          {/* SAMPAI SINI */}

        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>
  );
}