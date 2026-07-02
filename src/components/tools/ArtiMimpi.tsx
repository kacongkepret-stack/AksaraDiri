"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY (TEKS ANTARMUKA UI) ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Arti Mimpi Dinamis",
    badge: "Ultra Premium",
    subtitle: "Ceritakan mimpimu secara lengkap, kami akan deteksi semua simbol penting.",
    shareBtn: "Bagikan",
    placeholder: "Contoh: Tadi malam saya bermimpi melihat ular hitam besar melintas di jalan saat saya sedang berlari...",
    analyzeBtn: "🔮 Tafsirkan Mimpi",
    analyzing: "Menganalisis Subconscious...",
    emptyTitle: "Sistem belum menangkap simbol dominan",
    emptyMessage: "Coba ceritakan lebih detail atau gunakan kata kunci lain yang spesifik.",
    combinedPrefix: "📖 Analisis Bawah Sadar",
    positiveLabel: "✨ Positif",
    negativeLabel: "⚠️ Negatif",
    adviceLabel: "💡 Saran Logis",
    disclaimer: "*Semakin banyak simbol, semakin kompleks maknanya. Fokus pada membenahi pemicu emosi yang paling kuat di dunia nyata.",
    combinedSingle: "Alam bawah sadar Anda sedang sangat fokus pada aspek \"{keyword}\". Ini adalah sinyal tunggal yang kuat. Refleksikan bagaimana perasaan Anda terhadap simbol ini di dunia nyata.",
    combinedDouble: "Mimpi ini menyoroti dinamika antara \"{a}\" and \"{b}\". Ada tarik-ulur antara dua aspek kehidupan Anda saat ini. Perhatikan apakah keduanya saling mendukung atau justru berkonflik dalam mimpi Anda.",
    combinedComplex: "Mimpi Anda memiliki lapisan yang kompleks, melibatkan simbol {list}, dan {last}. ",
    combinedAnimal: "Dominasi simbol hewan menunjukkan bahwa saat ini Anda sedang dikendalikan oleh insting, intuisi, atau emosi primal (bertahan hidup) yang sangat kuat dibanding logika.",
    combinedNature: "Dominasi elemen alam adalah cerminan langsung dari gejolak emosi dan kondisi spiritual Anda yang sedang mencari keseimbangan.",
    combinedMixed: "Kombinasi berbagai elemen ini menandakan Anda sedang memproses banyak beban informasi dari kehidupan nyata ke dalam alam bawah sadar. Fokuslah membenahi simbol yang terasa paling mengancam/memorable terlebih dahulu.",
    dbLoading: "Memuat database kecerdasan buatan...",
    dbError: "Gagal memuat database. Pastikan file JSON tersedia di /public/data/",
    fallbackTitle: "Mimpi tentang {symbol}",
    fallbackDesc: "Alam bawah sadar Anda sedang memproses memori atau jangkar emosi yang sangat spesifik terkait dengan \"{symbol}\". Ini adalah simbol personal yang unik dan merepresentasikan variabel tersembunyi yang sedang menyita fokus batin Anda belakangan ini.",
    fallbackPositive: "Sebuah kesempatan emas bagi Anda untuk memahami pola emosi unik yang hanya bisa dipecahkan oleh kejujuran diri Anda sendiri.",
    fallbackNegative: "Adanya akumulasi kebingungan, stres ringan, atau detail emosional yang belum sempat Anda rapikan dengan baik di kehidupan nyata.",
    fallbackAdvice: "Perhatikan kapan objek atau situasi terkait \"{symbol}\" ini terlintas di pikiran Anda saat terjaga, di sanalah letak akar pemicu kecemasan Anda.",
    fallbackCategory: "Personal Anchor"
  },
  en: {
    title: "Dynamic Dream Meaning",
    badge: "Ultra Premium",
    subtitle: "Tell your dream in detail, we will detect all important symbols.",
    shareBtn: "Share",
    placeholder: "Example: Last night I dreamed of seeing a large black snake crossing the road while I was running...",
    analyzeBtn: "🔮 Interpret Dream",
    analyzing: "Analyzing Subconscious...",
    emptyTitle: "System didn't capture dominant symbols",
    emptyMessage: "Try telling it in more detail or use other specific keywords.",
    combinedPrefix: "📖 Subconscious Analysis",
    positiveLabel: "✨ Positive",
    negativeLabel: "⚠️ Negative",
    adviceLabel: "💡 Logical Advice",
    disclaimer: "*The more symbols, the more complex the meaning. Focus on fixing the strongest emotional trigger in the real world.",
    combinedSingle: "Your subconscious is very focused on the aspect \"{keyword}\". This is a single strong signal. Reflect on how you feel about this symbol in the real world.",
    combinedDouble: "This dream highlights the dynamics between \"{a}\" and \"{b}\". There is a push-pull between two aspects of your current life. Pay attention to whether they support each other or conflict in your dream.",
    combinedComplex: "Your dream has complex layers, involving symbols {list}, and {last}. ",
    combinedAnimal: "Dominance of animal symbols indicates that you are currently driven by instinct, intuition, or primal (survival) emotions rather than logic.",
    combinedNature: "Dominance of natural elements is a direct reflection of emotional turmoil and your spiritual condition seeking balance.",
    combinedMixed: "This combination of various elements indicates that you are processing a lot of information from real life into your subconscious. Focus on fixing the symbol that feels most threatening/memorable first.",
    dbLoading: "Loading artificial intelligence database...",
    dbError: "Failed to load database. Ensure JSON files are placed in /public/data/",
    fallbackTitle: "Dream of {symbol}",
    fallbackDesc: "Your subconscious is processing a highly specific personal anchor or emotional trigger related to \"{symbol}\". This represents a hidden internal variable currently occupying your deeper psychological focus.",
    fallbackPositive: "A valuable opportunity to gain deeper insight into unique emotional patterns that only you can truly decipher.",
    fallbackNegative: "Indicates accumulated mild stress, subconscious clutter, or unresolved mental details in your waking life.",
    fallbackAdvice: "Pay close attention to when this concept of \"{symbol}\" occupies your daytime thoughts; that is where your current core stressor is anchored.",
    fallbackCategory: "Personal Anchor"
  },
  es: {
    title: "Significado Dinámico de los Sueños",
    badge: "Ultra Premium",
    subtitle: "Cuenta tu sueño en detalle, detectaremos todos los símbolos importantes.",
    shareBtn: "Compartir",
    placeholder: "Ejemplo: Anoche soñé que veía una gran serpiente negra cruzar el camino mientras corría...",
    analyzeBtn: "🔮 Interpretar Sueño",
    analyzing: "Analizando el Subconsciente...",
    emptyTitle: "El sistema no capturó símbolos dominantes",
    emptyMessage: "Intenta contarlo con más detalle o usa otras palabras clave específicas.",
    combinedPrefix: "📖 Análisis del Subconsciente",
    positiveLabel: "✨ Positivo",
    negativeLabel: "⚠️ Negativo",
    adviceLabel: "💡 Consejo Lógico",
    disclaimer: "*Cuantos más símbolos, más complejo es el significado. Concéntrate en arreglar el desencadenante emocional más fuerte en el mundo real.",
    combinedSingle: "Tu subconsciente está muy enfocado en el aspecto \"{keyword}\". Es una señal única y fuerte. Reflexiona sobre cómo te sientes con respecto a este símbolo en el mundo real.",
    combinedDouble: "Este sueño destaca la dinámica entre \"{a}\" y \"{b}\". Hay una tensión entre dos aspectos de tu vida actual. Presta atención a si se apoyan mutuamente o entran en conflicto en tu sueño.",
    combinedComplex: "Tu sueño tiene capas complejas, que involucran los símbolos {list} y {last}. ",
    combinedAnimal: "El dominio de símbolos animales indica que actualmente te guían el instinto, la intuición o emociones primarias (de supervivencia) más que la lógica.",
    combinedNature: "El dominio de elementos naturales es un reflejo directo de la turbulencia emocional y tu condición espiritual en busca de equilibrio.",
    combinedMixed: "Esta combinación de varios elementos indica que estás procesando mucha información de la vida real en tu subconsciente. Concéntrate en arreglar primero el símbolo que se siente más amenazador/memorable.",
    dbLoading: "Cargando base de datos de inteligencia artificial...",
    dbError: "Error al cargar la base de datos. Verifica que los archivos JSON estén en /public/data/",
    fallbackTitle: "Sueño de {symbol}",
    fallbackDesc: "Tu subconsciente está procesando un ancla personal o un desencadenante emocional muy específico relacionado con \"{symbol}\". Esto representa una variable interna oculta que ocupa tu enfoque bicológico.",
    fallbackPositive: "Una excelente oportunidad para comprender patrones emocionales únicos que solo tú puedes resolver con honestidad.",
    fallbackNegative: "Presencia de estrés acumulado leve, confusión interna o detalles no resueltos en tu vida cotidiana.",
    fallbackAdvice: "Presta atención a cuándo este concepto de \"{symbol}\" cruza tu mente durante el día; ahí es donde se encuentra la raíz de tu ansiedad.",
    fallbackCategory: "Ancla Personal"
  },
};

// ========== STOP WORDS DICTIONARY (PEMBERSIH KATA SAMBUNG) ==========
const STOP_WORDS: Record<string, Set<string>> = {
  id: new Set(["saya", "aku", "tadi", "malam", "bermimpi", "mimpi", "melihat", "adalah", "yang", "dan", "lalu", "kemudian", "saat", "waktu", "dengan", "di", "ke", "dari", "ada", "sebuah", "seekor", "seorang", "buat", "kamu", "dia", "mereka", "kita", "kami"]),
  en: new Set(["i", "dreamed", "dream", "saw", "seeing", "last", "night", "was", "the", "and", "then", "after", "while", "with", "in", "at", "from", "on", "a", "an", "there", "is", "of", "you", "he", "she", "they", "we", "about"]),
  es: new Set(["yo", "soñé", "sueño", "vi", "viendo", "anoche", "era", "el", "la", "los", "y", "entonces", "después", "mientras", "con", "en", "de", "desde", "un", "una", "había", "es", "tu", "usted", "ellos", "nosotros", "sobre"])
};

// ========== INTERFACES ==========
interface DreamData {
  title: string;
  desc: string;
  positive: string;
  negative: string;
  advice: string;
  category: string;
}

interface ExtractedKeyword {
  keyword: string;
  data: DreamData;
  position: number;
}

// ========== COMBINED INTERPRETATION LOGIC ==========
function getCombinedInterpretation(results: ExtractedKeyword[], dict: any): string {
  const count = results.length;
  if (count === 0) return "";

  const keywords = results.map(r => r.data.title || r.keyword);
  const categories = results.map(r => r.data.category);
  const uniqueCategories = Array.from(new Set(categories));

  if (count === 1) {
    return dict.combinedSingle.replace("{keyword}", keywords[0]);
  }
  if (count === 2) {
    return dict.combinedDouble.replace("{a}", keywords[0]).replace("{b}", keywords[1]);
  }

  let interpretation = dict.combinedComplex
    .replace("{list}", keywords.slice(0, -1).join(", "))
    .replace("{last}", keywords[count - 1]);

  if (uniqueCategories.length === 1 && (uniqueCategories[0].toLowerCase().includes("hewan") || uniqueCategories[0].toLowerCase().includes("fauna"))) {
    interpretation += dict.combinedAnimal;
  } else if (uniqueCategories.length === 1 && (uniqueCategories[0].toLowerCase().includes("alam") || uniqueCategories[0].toLowerCase().includes("nature"))) {
    interpretation += dict.combinedNature;
  } else {
    interpretation += dict.combinedMixed;
  }
  return interpretation;
}

// ========== MAIN COMPONENT ==========
export default function DreamMeaning() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  const stopwords = STOP_WORDS[lang] || STOP_WORDS["id"];

  // DATABASE STATE
  const [dreamDB, setDreamDB] = useState<Record<string, DreamData>>({});
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  // USER INTERACTION STATE
  const [dreamText, setDreamText] = useState("");
  const [results, setResults] = useState<ExtractedKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [combinedInterpretation, setCombinedInterpretation] = useState("");

  // ASYNCHRONOUS LAZY LOAD DATABASE
  useEffect(() => {
    setIsDbLoading(true);
    setDbError(false);
    
    fetch(`/data/dreams_${lang}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Database file missing");
        return res.json();
      })
      .then((data: any[]) => {
        const dbMap: Record<string, DreamData> = {};
        
        data.forEach(item => {
          if (item.keyword) {
            const cleanKey = item.keyword.toLowerCase().trim();
            dbMap[cleanKey] = {
              title: item.title || item.keyword,
              desc: item.desc || item.meaning || "",
              positive: item.positive || "",
              negative: item.negative || "",
              advice: item.advice || "",
              category: item.category || "Umum"
            };
          }
        });
        
        setDreamDB(dbMap);
        setSortedKeys(Object.keys(dbMap).sort((a, b) => b.length - a.length));
      })
      .catch(err => {
        console.error("Critical Failure Loading Dream Database:", err);
        setDbError(true);
      })
      .finally(() => setIsDbLoading(false));
  }, [lang]);

  // ========== ADVANCED FUZZY TOKENIZATION & SCORING ENGINE ==========
  const extractKeywordsAdvanced = (text: string): ExtractedKeyword[] => {
    const cleanInput = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ");
    const rawTokens = cleanInput.split(/\s+/).filter(Boolean);
    const userTokens = rawTokens.filter(token => token.length > 2 && !stopwords.has(token));

    if (userTokens.length === 0) return [];

    const matchedScores: { keyword: string; data: DreamData; score: number; hits: number }[] = [];

    for (const dbKeyword of sortedKeys) {
      const dbTokens = dbKeyword.split(/\s+/).filter(token => token.length > 2);
      if (dbTokens.length === 0) continue;

      let hitCount = 0;
      let totalWeightScore = 0;

      for (const dbToken of dbTokens) {
        if (userTokens.includes(dbToken)) {
          hitCount++;
          totalWeightScore += dbToken.length;
        }
      }

      if (hitCount > 0) {
        const matchDensityRatio = hitCount / dbTokens.length;
        const finalCalculatedScore = totalWeightScore * matchDensityRatio;

        matchedScores.push({
          keyword: dbKeyword,
          data: dreamDB[dbKeyword],
          score: finalCalculatedScore,
          hits: hitCount
        });
      }
    }

    if (matchedScores.length === 0) return [];

    // =========================================================================
    // FILTER THRESHOLD: Tolak semua hasil yang nilai relevansinya di bawah 5
    // Ini mengunci agar kecocokan palsu (seperti kamboja ke mawar) langsung dibuang
    // =========================================================================
    const strictFilteredScores = matchedScores.filter(item => item.score >= 5);

    // Jika setelah difilter ketat hasilnya kosong, kembalikan array kosong 
    // agar fungsi handleAnalyze otomatis memicu Engine Fallback yang akurat
    if (strictFilteredScores.length === 0) return [];

    // Jalankan sorting hanya pada data yang benar-benar valid dan lolos sensor
    strictFilteredScores.sort((a, b) => {
      if (b.score === a.score) {
        return b.hits - a.hits;
      }
      return b.score - a.score;
    });

    const finalUIFormattedResults = strictFilteredScores.slice(0, 3).map((item, idx) => ({
      keyword: item.keyword,
      data: item.data,
      position: idx
    }));

    return finalUIFormattedResults;
  };

  // ========== EXECUTOR DENGAN ENGINE AUTO-FALLBACK ANTI-GAGAL ==========
  const handleAnalyze = () => {
    if (!dreamText.trim() || Object.keys(dreamDB).length === 0) return;
    setLoading(true);

    setTimeout(() => {
      // 1. Eksekusi pencarian tingkat tinggi pada database JSON lokal
      let extracted = extractKeywordsAdvanced(dreamText);
      
      // 2. INTERCEPTOR FALLBACK JIKA DATABASE KOSONG / TIDAK COCOK
      if (extracted.length === 0) {
        const cleanInput = dreamText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ");
        // Ambil potongan kata murni yang valid
        const fallbackTokens = cleanInput.split(/\s+/).filter(token => token.length > 3 && !stopwords.has(token));
        
        // Ambil token kata pertama yang paling berbobot, jika benar-benar kosong gunakan default universal
        const extractedSymbol = fallbackTokens.length > 0 ? fallbackTokens[0] : "misteri";
        const capitalizedSymbol = extractedSymbol.charAt(0).toUpperCase() + extractedSymbol.slice(1);

        // Lahirkan struktur object DreamData tiruan dengan kualitas sastra premium secara real-time
        const perfectFallbackObject: ExtractedKeyword = {
          keyword: extractedSymbol,
          data: {
            title: dict.fallbackTitle.replace("{symbol}", capitalizedSymbol),
            desc: dict.fallbackDesc.replace("{symbol}", extractedSymbol),
            positive: dict.fallbackPositive,
            negative: dict.fallbackNegative,
            advice: dict.fallbackAdvice.replace("{symbol}", extractedSymbol),
            category: dict.fallbackCategory
          },
          position: 0
        };

        setResults([perfectFallbackObject]);
        setCombinedInterpretation(getCombinedInterpretation([perfectFallbackObject], dict));
      } else {
        // 3. JIKA DATABASE MENEMUKAN KATA KUNCI, JALANKAN PROSES NORMAL
        setResults(extracted);
        setCombinedInterpretation(getCombinedInterpretation(extracted, dict));
      }
      setLoading(false);
    }, 800);
  };

  const handleShare = () => {
    if (results.length === 0) return;
    const topKeywords = results.slice(0, 2).map(r => r.data.title || r.keyword).join(", ");
    const text = `${dict.title}: ${dreamText.substring(0, 80)}...\n${dict.combinedPrefix}: ${topKeywords}\n\n${dict.shareBtn}`;
    if (navigator.share) {
      try { navigator.share({ title: dict.title, text }); } catch(e) {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* HEADER SECTION */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🌙🔍</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
          {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
        </h2>
        <p className="text-slate-300 text-sm mt-1">{dict.subtitle}</p>
      </div>

      {/* INPUT CARD CONSOLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
        
        {/* OVERLAY INDICATOR: LOADING DATABASE */}
        {isDbLoading && (
          <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-purple-300 text-sm">{dict.dbLoading}</p>
          </div>
        )}

        {/* OVERLAY INDICATOR: ERROR DATABASE */}
        {dbError && (
          <div className="absolute inset-0 z-10 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl mb-2">⚠️</span>
            <p className="text-red-400 text-sm">{dict.dbError}</p>
          </div>
        )}

        <textarea
          rows={4}
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder={dict.placeholder}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !dreamText.trim() || isDbLoading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? dict.analyzing : dict.analyzeBtn}
          </button>
          {results.length > 0 && (
            <button
              onClick={handleShare}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              📤
            </button>
          )}
        </div>
      </div>

      {/* SEARCHING LOADER SPINNER */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* TAMPILAN OUTPUT KONSOL TAFSIR MIMPI */}
      {!loading && results.length > 0 && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-500">
          
          {/* Compound Global subconscious Analisys Card */}
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-xl border border-purple-500/30 text-center">
            <p className="text-purple-200 text-sm font-semibold">{dict.combinedPrefix}</p>
            <p className="text-slate-200 text-sm mt-1">{combinedInterpretation}</p>
          </div>

          {/* Grid Iterasi Hasil Pencarian */}
          <div className="grid gap-5">
            {results.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg relative">
                <div className="absolute top-4 right-4 text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-stone-300">
                  #{idx + 1} Relevansi
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔮</span>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                    {item.data.title}
                  </h3>
                  <span className="text-[10px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.data.category}
                  </span>
                </div>
                
                <p className="text-slate-200 text-sm leading-relaxed mb-4">{item.data.desc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <p className="text-emerald-300 text-xs font-bold mb-1">{dict.positiveLabel}</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{item.data.positive}</p>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    <p className="text-rose-300 text-xs font-bold mb-1">{dict.negativeLabel}</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{item.data.negative}</p>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-300 text-xs font-bold mb-1">{dict.adviceLabel}</p>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.data.advice}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-2">
            {dict.disclaimer}
          </div>
          
          {/* INJEKSI PAYWALL GATEWAY */}
          <PremiumPaywall 
            toolName={dict.title} 
            resultId={`dream-${results.map(r => r.keyword.replace(/\s+/g, "_")).join("-")}`} 
          />
        </div>
      )}

      {/* ANIMATION KEYFRAMES */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}