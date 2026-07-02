"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Zodiac Match",
    badge: "Ultra Premium",
    subtitle: "Analisis kecocokan asmara tingkat lanjut. Berbasis pemetaan elemen alam dan matriks sinkronisasi rasi bintang.",
    shareBtn: "Bagikan",
    inputs: {
      partner1: "Partner 1",
      partner2: "Partner 2",
      vs: "VS",
      calculate: "Hitung Kecocokan",
      calculating: "Menyelaraskan Bintang...",
      random: "🎲 Acak Pasangan",
    },
    labels: {
      conclusion: "Kesimpulan Sistem",
      pillarsTitle: "📊 4 Pilar Asmara",
      communication: "Komunikasi",
      trust: "Kepercayaan",
      intimacy: "Keintiman & Fisik",
      commitment: "Komitmen",
      dynamicsTitle: "🌌 Dinamika Pasangan",
      adviceTitle: "💡 Saran & Potensi",
      positive: "✓",
      challenge: "⚠",
      disclaimer: "*Hasil ini bersifat prediktif berdasarkan astrologi klasik. Hubungan sejati tetap bergantung pada komunikasi dan usaha nyata.",
    },
    scoreTexts: {
      soulmate: "Pasangan Jiwa (Soulmate)",
      veryCompatible: "Sangat Serasi",
      needCompromise: "Butuh Kompromi",
      hardChallenge: "Tantangan Berat",
    },
    emptyMessage: "Pilih dua zodiak dan tekan tombol hitung untuk melihat kecocokan.",
  },
  en: {
    title: "Zodiac Match",
    badge: "Ultra Premium",
    subtitle: "Advanced love compatibility analysis based on elemental mapping and star sign synchronization matrix.",
    shareBtn: "Share",
    inputs: {
      partner1: "Partner 1",
      partner2: "Partner 2",
      vs: "VS",
      calculate: "Calculate Compatibility",
      calculating: "Aligning Stars...",
      random: "🎲 Random Pair",
    },
    labels: {
      conclusion: "System Conclusion",
      pillarsTitle: "📊 4 Love Pillars",
      communication: "Communication",
      trust: "Trust",
      intimacy: "Intimacy & Physical",
      commitment: "Commitment",
      dynamicsTitle: "🌌 Pair Dynamics",
      adviceTitle: "💡 Advice & Potential",
      positive: "✓",
      challenge: "⚠",
      disclaimer: "*Results are predictive based on classical astrology. True relationships still depend on communication and real effort.",
    },
    scoreTexts: {
      soulmate: "Soulmate",
      veryCompatible: "Very Compatible",
      needCompromise: "Needs Compromise",
      hardChallenge: "Hard Challenge",
    },
    emptyMessage: "Select two zodiacs and press calculate to see compatibility.",
  },
  es: {
    title: "Zodiac Match",
    badge: "Ultra Premium",
    subtitle: "Análisis avanzado de compatibilidad amorosa basado en mapeo de elementos y matriz de sincronización de signos.",
    shareBtn: "Compartir",
    inputs: {
      partner1: "Pareja 1",
      partner2: "Pareja 2",
      vs: "VS",
      calculate: "Calcular Compatibilidad",
      calculating: "Alineando Estrellas...",
      random: "🎲 Pareja Aleatoria",
    },
    labels: {
      conclusion: "Conclusión del Sistema",
      pillarsTitle: "📊 4 Pilares del Amor",
      communication: "Comunicación",
      trust: "Confianza",
      intimacy: "Intimidad & Físico",
      commitment: "Compromiso",
      dynamicsTitle: "🌌 Dinámica de Pareja",
      adviceTitle: "💡 Consejos y Potencial",
      positive: "✓",
      challenge: "⚠",
      disclaimer: "*Los resultados son predictivos basados en astrología clásica. Las relaciones verdaderas dependen de la comunicación y el esfuerzo real.",
    },
    scoreTexts: {
      soulmate: "Alma Gemela",
      veryCompatible: "Muy Compatible",
      needCompromise: "Necesita Compromiso",
      hardChallenge: "Desafío Difícil",
    },
    emptyMessage: "Selecciona dos zodíacos y presiona calcular para ver la compatibilidad.",
  },
};

// ========== DATABASE ZODIAK (tetap, karena nama universal) ==========
const ZODIACS = [
  { name: "Aries", icon: "♈", element: "Api", color: "from-red-500 to-orange-400" },
  { name: "Taurus", icon: "♉", element: "Tanah", color: "from-emerald-600 to-green-500" },
  { name: "Gemini", icon: "♊", element: "Udara", color: "from-yellow-400 to-amber-300" },
  { name: "Cancer", icon: "♋", element: "Air", color: "from-blue-400 to-cyan-300" },
  { name: "Leo", icon: "♌", element: "Api", color: "from-orange-500 to-red-500" },
  { name: "Virgo", icon: "♍", element: "Tanah", color: "from-lime-600 to-emerald-600" },
  { name: "Libra", icon: "♎", element: "Udara", color: "from-pink-300 to-rose-400" },
  { name: "Scorpio", icon: "♏", element: "Air", color: "from-purple-700 to-indigo-800" },
  { name: "Sagitarius", icon: "♐", element: "Api", color: "from-amber-500 to-orange-600" },
  { name: "Capricorn", icon: "♑", element: "Tanah", color: "from-stone-600 to-neutral-700" },
  { name: "Aquarius", icon: "♒", element: "Udara", color: "from-cyan-500 to-blue-500" },
  { name: "Pisces", icon: "♓", element: "Air", color: "from-indigo-300 to-purple-400" },
];

// ========== MATRIKS KECOCOKAN (SKOR TETAP) ==========
const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  Aries: { Aries: 70, Taurus: 40, Gemini: 80, Cancer: 50, Leo: 90, Virgo: 30, Libra: 60, Scorpio: 50, Sagitarius: 95, Capricorn: 40, Aquarius: 70, Pisces: 45 },
  Taurus: { Aries: 40, Taurus: 75, Gemini: 30, Cancer: 90, Leo: 50, Virgo: 85, Libra: 55, Scorpio: 80, Sagitarius: 30, Capricorn: 85, Aquarius: 40, Pisces: 70 },
  Gemini: { Aries: 80, Taurus: 30, Gemini: 85, Cancer: 40, Leo: 75, Virgo: 50, Libra: 80, Scorpio: 40, Sagitarius: 90, Capricorn: 35, Aquarius: 85, Pisces: 50 },
  Cancer: { Aries: 50, Taurus: 90, Gemini: 40, Cancer: 80, Leo: 60, Virgo: 70, Libra: 55, Scorpio: 85, Sagitarius: 40, Capricorn: 70, Aquarius: 45, Pisces: 95 },
  Leo: { Aries: 90, Taurus: 50, Gemini: 75, Cancer: 60, Leo: 85, Virgo: 40, Libra: 70, Scorpio: 55, Sagitarius: 90, Capricorn: 50, Aquarius: 65, Pisces: 45 },
  Virgo: { Aries: 30, Taurus: 85, Gemini: 50, Cancer: 70, Leo: 40, Virgo: 75, Libra: 60, Scorpio: 65, Sagitarius: 45, Capricorn: 80, Aquarius: 50, Pisces: 60 },
  Libra: { Aries: 60, Taurus: 55, Gemini: 80, Cancer: 55, Leo: 70, Virgo: 60, Libra: 80, Scorpio: 50, Sagitarius: 75, Capricorn: 45, Aquarius: 75, Pisces: 55 },
  Scorpio: { Aries: 50, Taurus: 80, Gemini: 40, Cancer: 85, Leo: 55, Virgo: 65, Libra: 50, Scorpio: 85, Sagitarius: 45, Capricorn: 75, Aquarius: 45, Pisces: 90 },
  Sagitarius: { Aries: 95, Taurus: 30, Gemini: 90, Cancer: 40, Leo: 90, Virgo: 45, Libra: 75, Scorpio: 45, Sagitarius: 90, Capricorn: 30, Aquarius: 80, Pisces: 50 },
  Capricorn: { Aries: 40, Taurus: 85, Gemini: 35, Cancer: 70, Leo: 50, Virgo: 80, Libra: 45, Scorpio: 75, Sagitarius: 30, Capricorn: 85, Aquarius: 40, Pisces: 60 },
  Aquarius: { Aries: 70, Taurus: 40, Gemini: 85, Cancer: 45, Leo: 65, Virgo: 50, Libra: 75, Scorpio: 45, Sagitarius: 80, Capricorn: 40, Aquarius: 90, Pisces: 50 },
  Pisces: { Aries: 45, Taurus: 70, Gemini: 50, Cancer: 95, Leo: 45, Virgo: 60, Libra: 55, Scorpio: 90, Sagitarius: 50, Capricorn: 60, Aquarius: 50, Pisces: 85 }
};
// ========== DINAMIKA ELEMEN (MULTI-LANGUAGE) ==========
const ELEMENTAL_DYNAMICS: Record<string, Record<string, string>> = {
  id: {
    "Api-Api": "Kalian berdua memiliki energi yang eksplosif. Hubungan ini akan penuh gairah, sangat intens, dan tidak pernah membosankan. Namun waspadai ego yang bisa memicu pertengkaran dramatis.",
    "Api-Udara": "Udara mengipasi Api. Pasangan ini sangat merangsang secara intelektual. Kalian saling memotivasi untuk bergerak maju. Hubungan ini sangat dinamis dan dipenuhi ide-ide liar.",
    "Api-Tanah": "Api yang spontan bertemu dengan Tanah yang stabil. Membutuhkan kompromi besar. Tanah bisa memberikan pijakan realita bagi Api, sedangkan Api bisa membakar semangat Tanah yang kaku.",
    "Api-Air": "Kombinasi yang tricky. Air bisa memadamkan antusiasme Api, atau Api bisa membuat Air mendidih secara emosional. Butuh kedewasaan tinggi agar tidak saling menyakiti.",
    "Tanah-Tanah": "Fondasi yang absolut. Hubungan ini dibangun di atas kestabilan finansial, kesetiaan, dan rencana masa depan yang jelas. Mungkin kurang romantis, tapi tak akan mudah goyah oleh badai.",
    "Tanah-Udara": "Praktis vs Teoretis. Tanah ingin bukti nyata, Udara hidup dalam konsep dan obrolan. Perlu usaha keras agar Tanah tidak merasa digantung dan Udara tidak merasa terkekang.",
    "Tanah-Air": "Kombinasi yang sangat subur. Air menutrisi Tanah untuk bertumbuh. Hubungan ini sangat emosional, saling melindungi, dan sangat berfokus pada pembangunan keluarga atau rumah yang nyaman.",
    "Udara-Udara": "Koneksi mental tingkat dewa. Komunikasi kalian luar biasa lancar layaknya sahabat sejati. Tantangannya adalah kalian mungkin terlalu logis dan sering menghindari keintiman emosional yang dalam.",
    "Udara-Air": "Logika bertemu Perasaan. Udara menganalisis segalanya, sementara Air merasakan segalanya. Ini bisa memicu frustrasi jika Udara dianggap terlalu dingin dan Air dianggap terlalu baper.",
    "Air-Air": "Empati yang berenang di lautan yang sama. Kalian seolah bisa membaca pikiran satu sama lain tanpa bicara. Sangat romantis dan intuitif, namun rentan tenggelam bersama dalam drama emosional."
  },
  en: {
    "Api-Api": "You both have explosive energy. This relationship will be passionate, very intense, and never boring. But watch out for egos that can trigger dramatic fights.",
    "Api-Udara": "Air fuels Fire. This couple is highly intellectually stimulating. You motivate each other to move forward. Very dynamic and filled with wild ideas.",
    "Api-Tanah": "Spontaneous Fire meets stable Earth. Needs big compromise. Earth provides reality grounding for Fire, while Fire can ignite the rigid spirit of Earth.",
    "Api-Air": "Tricky combination. Water can extinguish Fire's enthusiasm, or Fire can make Water boil emotionally. Requires high maturity to avoid hurting each other.",
    "Tanah-Tanah": "Absolute foundation. Built on financial stability, loyalty, and clear future plans. Maybe less romantic, but won't easily waver in storms.",
    "Tanah-Udara": "Practical vs Theoretical. Earth wants tangible proof, Air lives in concepts and chatter. Hard work needed so Earth doesn't feel left hanging and Air doesn't feel constrained.",
    "Tanah-Air": "Very fertile combination. Water nourishes Earth to grow. Highly emotional, protective, and focused on building a comfortable family or home.",
    "Udara-Udara": "God-level mental connection. Communication flows incredibly smoothly like true best friends. Challenge: you may be too logical and avoid deep emotional intimacy.",
    "Udara-Air": "Logic meets Feeling. Air analyzes everything, while Water feels everything. Can cause frustration if Air is seen as too cold and Water as too emotional.",
    "Air-Air": "Empathy swimming in the same ocean. You can read each other's minds without speaking. Very romantic and intuitive, but prone to drowning together in emotional drama."
  },
  es: {
    "Api-Api": "Ambos tienen energía explosiva. Esta relación será apasionada, muy intensa y nunca aburrida. Pero cuidado con los egos que pueden desencadenar peleas dramáticas.",
    "Api-Udara": "El aire aviva el fuego. Esta pareja es muy estimulante intelectualmente. Se motivan mutuamente para avanzar. Muy dinámica y llena de ideas locas.",
    "Api-Tanah": "Fuego espontáneo se encuentra con Tierra estable. Necesita gran compromiso. La Tierra proporciona base realista al Fuego, mientras el Fuego puede encender el espíritu rígido de la Tierra.",
    "Api-Air": "Combinación complicada. El agua puede apagar el entusiasmo del Fuego, o el Fuego puede hacer hervir el agua emocionalmente. Se necesita alta madurez para no lastimarse.",
    "Tanah-Tanah": "Fundación absoluta. Construida sobre estabilidad financiera, lealtad y planes futuros claros. Quizás menos romántica, pero no se tambaleará fácilmente ante las tormentas.",
    "Tanah-Udara": "Práctico vs Teórico. La Tierra quiere pruebas tangibles, el Aire vive en conceptos y charlas. Se necesita trabajo duro para que la Tierra no se sienta colgada y el Aire no se sienta restringido.",
    "Tanah-Air": "Combinación muy fértil. El agua nutre a la Tierra para crecer. Relación muy emocional, protectora y enfocada en construir un hogar o familia cómoda.",
    "Udara-Udara": "Conexión mental de nivel divino. La comunicación fluye increíblemente como mejores amigos. Desafío: pueden ser demasiado lógicos y evitar la intimidad emocional profunda.",
    "Udara-Air": "La lógica se encuentra con el sentimiento. El Aire analiza todo, mientras el Agua lo siente todo. Puede causar frustración si el Aire es visto como demasiado frío y el Agua como demasiado emocional.",
    "Air-Air": "Empatía nadando en el mismo océano. Pueden leerse la mente sin hablar. Muy romántico e intuitivo, pero propenso a hundirse juntos en el drama emocional."
  }
};

// ========== FUNGSI HELPER (MULTI-LANGUAGE) ==========
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getElementSynergy(e1: string, e2: string, lang: string): string {
  const pair = `${e1}-${e2}`;
  const reversePair = `${e2}-${e1}`;
  const dynamics = ELEMENTAL_DYNAMICS[lang] || ELEMENTAL_DYNAMICS["id"];
  const defaultMsg = lang === "id" ? "Dinamika elemen yang unik dan penuh kejutan. Cobalah untuk saling memahami perbedaan dasar." :
                      lang === "en" ? "Unique and surprising elemental dynamics. Try to understand each other's basic differences." :
                      "Dinámicas elementales únicas y sorprendentes. Intenta comprender las diferencias básicas del otro.";
  return dynamics[pair] || dynamics[reversePair] || defaultMsg;
}

function getAdvice(score: number, lang: string): { positive: string; challenge: string } {
  const adviceData = {
    id: {
      high: { positive: "Hubungan kalian memiliki fondasi yang sangat kuat. Manfaatkan energi positif ini untuk membangun mimpi bersama.", challenge: "Jangan sampai terlalu nyaman hingga melupakan pertumbuhan pribadi. Tetaplah memberi ruang masing-masing." },
      mediumHigh: { positive: "Potensi besar untuk menjadi pasangan yang harmonis. Saling melengkapi dengan baik.", challenge: "Masih ada perbedaan kecil yang perlu dikomunikasikan secara terbuka, jangan pendam perasaan." },
      mediumLow: { positive: "Masih ada titik temu yang bisa dikembangkan, terutama dalam nilai-nilai hidup.", challenge: "Butuh kesabaran ekstra dan kompromi di banyak hal. Jangan memaksakan kehendak." },
      low: { positive: "Kalian sangat berbeda, tapi justru itu bisa menjadi pelajaran berharga.", challenge: "Jika tidak ada kesamaan visi, hubungan akan terasa melelahkan. Evaluasi ulang prioritas." }
    },
    en: {
      high: { positive: "Your relationship has a very strong foundation. Use this positive energy to build dreams together.", challenge: "Don't get too comfortable that you forget personal growth. Keep giving each other space." },
      mediumHigh: { positive: "Great potential to become a harmonious couple. Complement each other well.", challenge: "There are still small differences that need open communication, don't bottle up feelings." },
      mediumLow: { positive: "There is still common ground to develop, especially in life values.", challenge: "Needs extra patience and compromise in many things. Don't force your will." },
      low: { positive: "You are very different, but that can be a valuable lesson.", challenge: "If no shared vision, the relationship will feel exhausting. Re-evaluate priorities." }
    },
    es: {
      high: { positive: "Su relación tiene una base muy sólida. Usen esta energía positiva para construir sueños juntos.", challenge: "No se sientan tan cómodos que olviden el crecimiento personal. Sigan dándose espacio mutuamente." },
      mediumHigh: { positive: "Gran potencial para ser una pareja armoniosa. Se complementan bien.", challenge: "Todavía hay pequeñas diferencias que necesitan comunicación abierta, no repriman sentimientos." },
      mediumLow: { positive: "Todavía hay puntos en común para desarrollar, especialmente en valores de vida.", challenge: "Necesita paciencia extra y compromiso en muchas cosas. No impongas tu voluntad." },
      low: { positive: "Son muy diferentes, pero eso puede ser una lección valiosa.", challenge: "Si no hay visión compartida, la relación será agotadora. Reevalúa prioridades." }
    }
  };
  const dict = adviceData[lang] || adviceData["id"];
  if (score >= 80) return dict.high;
  if (score >= 60) return dict.mediumHigh;
  if (score >= 40) return dict.mediumLow;
  return dict.low;
}

function getScoreText(score: number, lang: string): string {
  const texts = DICTIONARY[lang]?.scoreTexts || DICTIONARY["id"].scoreTexts;
  if (score >= 85) return texts.soulmate;
  if (score >= 70) return texts.veryCompatible;
  if (score >= 50) return texts.needCompromise;
  return texts.hardChallenge;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "from-emerald-400 to-green-500";
  if (score >= 60) return "from-blue-400 to-cyan-500";
  if (score >= 40) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-red-500";
}

// ========== KOMPONEN UTAMA ==========
export default function ZodiacMatch() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [z1, setZ1] = useState("Aries");
  const [z2, setZ2] = useState("Taurus");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const handleCalculate = () => {
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const baseScore = COMPATIBILITY_MATRIX[z1]?.[z2] ?? 50;
      const zodiac1Data = ZODIACS.find(z => z.name === z1)!;
      const zodiac2Data = ZODIACS.find(z => z.name === z2)!;
      
      const seed = hashString(z1 + z2);
      const communication = Math.min(99, Math.max(20, baseScore + (seed % 15) - 5));
      const intimacy = Math.min(99, Math.max(20, baseScore + ((seed * 2) % 20) - 10));
      const trust = Math.min(99, Math.max(20, baseScore + ((seed * 3) % 15) - 5));
      const commitment = Math.floor((communication + intimacy + trust + baseScore) / 4);

      setResultData({
        score: baseScore,
        zodiac1Data,
        zodiac2Data,
        aspects: { communication, intimacy, trust, commitment },
        synergy: getElementSynergy(zodiac1Data.element, zodiac2Data.element, lang),
        advice: getAdvice(baseScore, lang),
      });
      setLoading(false);
      setAnalyzed(true);
    }, 1500);
  };

  const handleRandom = () => {
    const randomIndex1 = Math.floor(Math.random() * ZODIACS.length);
    let randomIndex2 = Math.floor(Math.random() * ZODIACS.length);
    while (randomIndex2 === randomIndex1 && ZODIACS.length > 1) {
      randomIndex2 = Math.floor(Math.random() * ZODIACS.length);
    }
    setZ1(ZODIACS[randomIndex1].name);
    setZ2(ZODIACS[randomIndex2].name);
    setTimeout(() => handleCalculate(), 100);
  };

  const handleShare = async () => {
    if (!resultData) return;
    const text = `${dict.title}: ${resultData.zodiac1Data.icon} ${z1} vs ${resultData.zodiac2Data.icon} ${z2}\n${dict.labels.conclusion}: ${getScoreText(resultData.score, lang)} (${resultData.score}%)\n${dict.labels.pillarsTitle}: Komunikasi ${resultData.aspects.communication}%, Kepercayaan ${resultData.aspects.trust}%, Keintiman ${resultData.aspects.intimacy}%, Komitmen ${resultData.aspects.commitment}%\n${dict.labels.dynamicsTitle}: ${resultData.synergy.substring(0, 100)}...\n\n${dict.labels.disclaimer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dict.title, text });
      } catch (e) { console.warn(e); }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
      } catch (err) { alert("Failed to copy."); }
    }
  };

  // Empty state (belum dianalisis)
  if (!loading && !analyzed && !resultData) {
    return (
      <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">💞🧭</div>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
            {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">{dict.subtitle}</p>
        </div>
        <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <div className="w-full max-w-xs bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">{dict.inputs.partner1}</label>
              <select value={z1} onChange={(e) => setZ1(e.target.value)} className="w-full bg-transparent text-xl font-black focus:outline-none appearance-none cursor-pointer text-center">
                {ZODIACS.map(z => <option key={z.name} value={z.name} className="bg-slate-900 text-base">{z.icon} {z.name}</option>)}
              </select>
            </div>
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 border border-white/10">
              <span className="font-black text-slate-400 text-sm">{dict.inputs.vs}</span>
            </div>
            <div className="w-full max-w-xs bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">{dict.inputs.partner2}</label>
              <select value={z2} onChange={(e) => setZ2(e.target.value)} className="w-full bg-transparent text-xl font-black focus:outline-none appearance-none cursor-pointer text-center">
                {ZODIACS.map(z => <option key={z.name} value={z.name} className="bg-slate-900 text-base">{z.icon} {z.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={handleCalculate} className="px-8 py-3 rounded-full font-black text-base bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:scale-105 transition-transform">
              {dict.inputs.calculate}
            </button>
            <button onClick={handleRandom} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-all">
              {dict.inputs.random}
            </button>
          </div>
          <div className="text-center mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-sm">{dict.emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-white font-sans px-4 py-6">
      {/* Header dengan share button */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">💞🧭</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">{dict.subtitle}</p>
        {analyzed && resultData && (
          <button onClick={handleShare} className="absolute right-0 top-0 md:relative md:mt-3 inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition">
            📤 {dict.shareBtn}
          </button>
        )}
      </div>

      {/* Input Section (compact) */}
      <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full max-w-xs bg-slate-900/60 border border-white/10 rounded-2xl p-3 text-center">
            <select value={z1} onChange={(e) => setZ1(e.target.value)} className="w-full bg-transparent text-lg font-bold focus:outline-none appearance-none cursor-pointer text-center">
              {ZODIACS.map(z => <option key={z.name} value={z.name}>{z.icon} {z.name}</option>)}
            </select>
          </div>
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-white/10">
            <span className="font-black text-slate-400 text-xs">{dict.inputs.vs}</span>
          </div>
          <div className="w-full max-w-xs bg-slate-900/60 border border-white/10 rounded-2xl p-3 text-center">
            <select value={z2} onChange={(e) => setZ2(e.target.value)} className="w-full bg-transparent text-lg font-bold focus:outline-none appearance-none cursor-pointer text-center">
              {ZODIACS.map(z => <option key={z.name} value={z.name}>{z.icon} {z.name}</option>)}
            </select>
          </div>
          <button onClick={handleCalculate} disabled={loading} className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform disabled:opacity-50">
            {loading ? dict.inputs.calculating : dict.inputs.calculate}
          </button>
          <button onClick={handleRandom} disabled={loading} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10">
            {dict.inputs.random}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-pink-400 text-xs font-mono tracking-widest animate-pulse">{dict.inputs.calculating}</p>
        </div>
      )}

      {/* Results */}
      {!loading && analyzed && resultData && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none bg-gradient-to-br ${getScoreColor(resultData.score)}`} />

            {/* Top Score */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-white/10 pb-8">
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ stroke: 'url(#gradientCircle)', strokeDasharray: 283, strokeDashoffset: 283 - (283 * resultData.score) / 100 }} />
                  <defs>
                    <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={resultData.score >= 60 ? "#ec4899" : "#f43f5e"} />
                      <stop offset="100%" stopColor={resultData.score >= 60 ? "#8b5cf6" : "#f59e0b"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black">{resultData.score}<span className="text-xl text-slate-400">%</span></span>
                  <span className={`text-[9px] uppercase tracking-widest font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(resultData.score)}`}>
                    {dict.labels.conclusion.split(" ")[0]}
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-3">
                  {dict.labels.conclusion}
                </div>
                <h2 className={`text-2xl lg:text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(resultData.score)}`}>
                  {getScoreText(resultData.score, lang)}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5 inline-flex">
                  <span>{resultData.zodiac1Data.icon} {z1} ({resultData.zodiac1Data.element})</span>
                  <span className="text-pink-500">×</span>
                  <span>{resultData.zodiac2Data.icon} {z2} ({resultData.zodiac2Data.element})</span>
                </div>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">{dict.labels.pillarsTitle}</h3>
                {[
                  { label: dict.labels.communication, score: resultData.aspects.communication, color: "bg-cyan-400" },
                  { label: dict.labels.trust, score: resultData.aspects.trust, color: "bg-emerald-400" },
                  { label: dict.labels.intimacy, score: resultData.aspects.intimacy, color: "bg-pink-400" },
                  { label: dict.labels.commitment, score: resultData.aspects.commitment, color: "bg-purple-400" }
                ].map((aspect) => (
                  <div key={aspect.label}>
                    <div className="flex justify-between text-xs mb-1"><span>{aspect.label}</span><span>{aspect.score}%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${aspect.color}`} style={{ width: `${aspect.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 rounded-2xl border border-indigo-500/20">
                  <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 mb-3">{dict.labels.dynamicsTitle}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{resultData.synergy}</p>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
                  <h3 className="font-black text-xs uppercase tracking-widest text-amber-400 mb-3">{dict.labels.adviceTitle}</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2"><span className="text-emerald-400 text-sm">{dict.labels.positive}</span><p className="text-xs text-slate-300">{resultData.advice.positive}</p></div>
                    <div className="flex gap-2"><span className="text-rose-400 text-sm">{dict.labels.challenge}</span><p className="text-xs text-slate-300">{resultData.advice.challenge}</p></div>
                  </div>
                </div>
              </div>
            </div>

                        <div className="mt-8 text-center text-[10px] text-slate-500 italic border-t border-white/5 pt-5">
              {dict.labels.disclaimer}
            </div>

            {/* ============================================= */}
            {/* 🟢 INJEKSI PREMIUM PAYWALL DILETAKKAN DI SINI 🟢 */}
            {/* ============================================= */}
            <PremiumPaywall 
              toolName={dict.title} 
              resultId={`zodiac-match-${z1}-${z2}`} 
            />
            {/* ============================================= */}

          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}