"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Hari Baik Nikah",
    badge: "Ultra Premium",
    subtitle: "Tentukan hari pernikahan ideal berdasarkan weton kedua mempelai. Perpaduan primbon Jawa dan logika modern.",
    shareBtn: "Bagikan",
    inputs: {
      brideLabel: "👰 Calon Mempelai 1",
      groomLabel: "🤵 Calon Mempelai 2",
      analyze: "🌸 Tentukan Hari Baik Nikah 🌸",
      computing: "Menghitung & Mencari Hari Baik...",
      emptyMessage: "Masukkan weton kedua calon mempelai untuk mendapatkan rekomendasi hari dan bulan baik.",
    },
    labels: {
      totalNeptu: "Total Neptu Pasangan",
      compatibility: "Kecocokan",
      bestMonths: "Bulan-Bulan Baik untuk Nikah",
      goodDays: "Hari & Pasaran yang Baik",
      philosophy: "Filosofi & Pantangan",
      disclaimer: "*Rekomendasi ini berdasarkan primbon tradisional. Konsultasikan juga dengan tokoh agama atau penghulu setempat.",
      quote: "\"Pernikahan bukan sekadar hitungan weton. Doa kedua orang tua dan niat tulus adalah penentu utama kebahagiaan.\"",
    },
    // Untuk hasil kecocokan
    matchMeanings: {
      0: { title: "Sandang", desc: "Kecukupan sandang pangan, hidup harmonis." },
      1: { title: "Pangan", desc: "Rezeki melimpah, hati-hati kesombongan." },
      2: { title: "Cinta", desc: "Penuh kasih, rawan masalah ekonomi." },
      3: { title: "Lara", desc: "Sering sakit-sakitan atau konflik batin." },
      4: { title: "Pati", desc: "Potensi perceraian/kematian, butuh ruwatan." },
      5: { title: "Pesthi", desc: "Rukun, damai, panjang umur." },
      6: { title: "Lumbung", desc: "Kaya raya, perlu komunikasi kuat." },
    },
  },
  en: {
    title: "Good Wedding Day",
    badge: "Ultra Premium",
    subtitle: "Determine the ideal wedding day based on the Javanese weton of both partners. A blend of Javanese primbon and modern logic.",
    shareBtn: "Share",
    inputs: {
      brideLabel: "👰 Bride-to-be",
      groomLabel: "🤵 Groom-to-be",
      analyze: "🌸 Find Good Wedding Day 🌸",
      computing: "Calculating & Finding Good Days...",
      emptyMessage: "Enter the weton of both partners to get recommended good days and months.",
    },
    labels: {
      totalNeptu: "Total Neptu Couple",
      compatibility: "Compatibility",
      bestMonths: "Good Months for Wedding",
      goodDays: "Good Days & Pasaran",
      philosophy: "Philosophy & Taboos",
      disclaimer: "*These recommendations are based on traditional primbon. Consult also with religious leaders or local officials.",
      quote: "\"Marriage is not just about weton calculation. The prayers of parents and sincere intentions are the main determinants of happiness.\"",
    },
    matchMeanings: {
      0: { title: "Sandang", desc: "Sufficient clothing and food, harmonious life." },
      1: { title: "Pangan", desc: "Abundant sustenance, beware of arrogance." },
      2: { title: "Cinta", desc: "Full of love, prone to financial problems." },
      3: { title: "Lara", desc: "Often sick or inner conflict." },
      4: { title: "Pati", desc: "Potential divorce/death, need a ritual." },
      5: { title: "Pesthi", desc: "Harmonious, peaceful, long life." },
      6: { title: "Lumbung", desc: "Very wealthy, need strong communication." },
    },
  },
  es: {
    title: "Buen Día para Bodas",
    badge: "Ultra Premium",
    subtitle: "Determine el día ideal para la boda según el weton javanés de ambos contrayentes. Mezcla de primbon javanés y lógica moderna.",
    shareBtn: "Compartir",
    inputs: {
      brideLabel: "👰 Futura novia",
      groomLabel: "🤵 Futuro novio",
      analyze: "🌸 Encontrar Buen Día para Boda 🌸",
      computing: "Calculando y buscando buenos días...",
      emptyMessage: "Ingrese el weton de ambos contrayentes para obtener días y meses recomendados.",
    },
    labels: {
      totalNeptu: "Neptu Total de la Pareja",
      compatibility: "Compatibilidad",
      bestMonths: "Buenos Meses para Bodas",
      goodDays: "Buenos Días y Pasaran",
      philosophy: "Filosofía y Tabúes",
      disclaimer: "*Estas recomendaciones se basan en el primbon tradicional. Consulte también con líderes religiosos o funcionarios locales.",
      quote: "\"El matrimonio no es solo un cálculo de weton. Las oraciones de los padres y las intenciones sinceras son los principales determinantes de la felicidad.\"",
    },
    matchMeanings: {
      0: { title: "Sandang", desc: "Ropa y comida suficientes, vida armoniosa." },
      1: { title: "Pangan", desc: "Sustento abundante, cuidado con la arrogancia." },
      2: { title: "Cinta", desc: "Lleno de amor, propenso a problemas financieros." },
      3: { title: "Lara", desc: "A menudo enfermo o conflicto interno." },
      4: { title: "Pati", desc: "Potencial divorcio/muerte, necesita un ritual." },
      5: { title: "Pesthi", desc: "Armonioso, pacífico, vida larga." },
      6: { title: "Lumbung", desc: "Muy rico, necesita comunicación fuerte." },
    },
  },
};

// ========== DATA HARI DAN PASARAN (tetap karena istilah lokal, tetapi nilai numeriknya universal) ==========
const HARI_LIST = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
const HARI_NILAI: Record<string, number> = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 };
const PASARAN_NILAI: Record<string, number> = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };

// ========== FUNGSI REKOMENDASI (tetap menggunakan logika yang sama, hanya outputnya multi-language) ==========
function getBestMonths(totalNeptu: number, lang: string): { month: string; score: number; reason: string }[] {
  // Nama bulan dan deskripsi dalam multi-bahasa
  const monthsData: Record<string, any> = {
    id: [
      { name: "Sura (Muharram)", baseScore: 5, desc: "Bulan suci, baik untuk memulai sesuatu yang sakral." },
      { name: "Sapar (Shafar)", baseScore: 3, desc: "Cukup baik, namun waspadai ujian kecil." },
      { name: "Mulud (Rabiul Awal)", baseScore: 5, desc: "Bulan kelahiran Nabi, sangat utama untuk pernikahan." },
      { name: "Bakda Mulud (Rabiul Akhir)", baseScore: 4, desc: "Baik, rezeki lancar." },
      { name: "Jumadil Awal", baseScore: 3, desc: "Lumayan, namun kurang disukai untuk pesta besar." },
      { name: "Jumadil Akhir", baseScore: 2, desc: "Kurang baik, rawan konflik kecil." },
      { name: "Rejeb (Rajab)", baseScore: 5, desc: "Bulan istimewa untuk ibadah, cocok untuk nikah." },
      { name: "Ruwah (Sya'ban)", baseScore: 4, desc: "Bulan persiapan, baik untuk pernikahan." },
      { name: "Pasa (Ramadhan)", baseScore: 1, desc: "Tidak dianjurkan karena puasa, kecuali sangat darurat." },
      { name: "Sawal (Syawal)", baseScore: 5, desc: "Sangat baik, banyak orang memilih bulan ini." },
      { name: "Dulkaidah (Zulkaidah)", baseScore: 3, desc: "Bulan larangan perang, tapi cukup baik untuk nikah." },
      { name: "Besar (Zulhijjah)", baseScore: 4, desc: "Bulan haji, baik untuk pernikahan setelah tanggal 10." },
    ],
    en: [
      { name: "Sura (Muharram)", baseScore: 5, desc: "Sacred month, good for starting something sacred." },
      { name: "Sapar (Shafar)", baseScore: 3, desc: "Fairly good, but beware of small trials." },
      { name: "Mulud (Rabiul Awal)", baseScore: 5, desc: "Prophet's birth month, very excellent for weddings." },
      { name: "Bakda Mulud (Rabiul Akhir)", baseScore: 4, desc: "Good, smooth sustenance." },
      { name: "Jumadil Awal", baseScore: 3, desc: "So-so, but less favored for big parties." },
      { name: "Jumadil Akhir", baseScore: 2, desc: "Not good, prone to small conflicts." },
      { name: "Rejeb (Rajab)", baseScore: 5, desc: "Special month for worship, good for marriage." },
      { name: "Ruwah (Sya'ban)", baseScore: 4, desc: "Preparation month, good for weddings." },
      { name: "Pasa (Ramadhan)", baseScore: 1, desc: "Not recommended due to fasting, unless very urgent." },
      { name: "Sawal (Syawal)", baseScore: 5, desc: "Very good, many people choose this month." },
      { name: "Dulkaidah (Zulkaidah)", baseScore: 3, desc: "Month of war prohibition, but quite good for marriage." },
      { name: "Besar (Zulhijjah)", baseScore: 4, desc: "Hajj month, good for weddings after the 10th." },
    ],
    es: [
      { name: "Sura (Muharram)", baseScore: 5, desc: "Mes sagrado, bueno para comenzar algo sagrado." },
      { name: "Sapar (Shafar)", baseScore: 3, desc: "Bastante bueno, pero cuidado con pequeñas pruebas." },
      { name: "Mulud (Rabiul Awal)", baseScore: 5, desc: "Mes del nacimiento del Profeta, muy excelente para bodas." },
      { name: "Bakda Mulud (Rabiul Akhir)", baseScore: 4, desc: "Bueno, sustento fluido." },
      { name: "Jumadil Awal", baseScore: 3, desc: "Regular, pero menos favorecido para grandes fiestas." },
      { name: "Jumadil Akhir", baseScore: 2, desc: "No bueno, propenso a pequeños conflictos." },
      { name: "Rejeb (Rajab)", baseScore: 5, desc: "Mes especial para adoración, bueno para matrimonio." },
      { name: "Ruwah (Sya'ban)", baseScore: 4, desc: "Mes de preparación, bueno para bodas." },
      { name: "Pasa (Ramadhan)", baseScore: 1, desc: "No recomendado por el ayuno, a menos que sea muy urgente." },
      { name: "Sawal (Syawal)", baseScore: 5, desc: "Muy bueno, mucha gente elige este mes." },
      { name: "Dulkaidah (Zulkaidah)", baseScore: 3, desc: "Mes de prohibición de guerra, pero bastante bueno para matrimonio." },
      { name: "Besar (Zulhijjah)", baseScore: 4, desc: "Mes del Hajj, bueno para bodas después del día 10." },
    ],
  };
  const months = monthsData[lang] || monthsData["id"];
  let adjusted = months.map((m: any) => ({ ...m, score: m.baseScore + (totalNeptu > 25 ? 1 : totalNeptu < 15 ? -1 : 0) }));
  adjusted.sort((a: any, b: any) => b.score - a.score);
  return adjusted.slice(0, 4).map((m: any) => ({ month: m.name, score: m.score, reason: m.desc }));
}

function getGoodDaysWeton(totalNeptu: number, lang: string): { hari: string; pasaran: string; neptu: number; reason: string }[] {
  const allCombos: { hari: string; pasaran: string; neptu: number }[] = [];
  for (let h of HARI_LIST) {
    for (let p of PASARAN_LIST) {
      allCombos.push({ hari: h, pasaran: p, neptu: HARI_NILAI[h] + PASARAN_NILAI[p] });
    }
  }
  let good = allCombos.filter(c => c.neptu >= 10 && c.neptu <= 15);
  good.sort((a, b) => Math.abs(a.neptu - 13) - Math.abs(b.neptu - 13));
  // Alasannya multi-language
  const reasons: Record<string, (neptu: number) => string> = {
    id: (neptu) => {
      if (neptu === 13) return "Neptu 13 (ideal) melambangkan cinta seimbang dan keberkahan.";
      if (neptu > 13) return `Neptu ${neptu} cukup tinggi, memberi energi semangat dalam rumah tangga.`;
      return `Neptu ${neptu} menunjukkan kemudahan rezeki dan keharmonisan awal.`;
    },
    en: (neptu) => {
      if (neptu === 13) return "Neptu 13 (ideal) symbolizes balanced love and blessings.";
      if (neptu > 13) return `Neptu ${neptu} is quite high, giving enthusiastic energy in the household.`;
      return `Neptu ${neptu} indicates ease of sustenance and initial harmony.`;
    },
    es: (neptu) => {
      if (neptu === 13) return "Neptu 13 (ideal) simboliza amor equilibrado y bendiciones.";
      if (neptu > 13) return `Neptu ${neptu} es bastante alto, dando energía entusiasta en el hogar.`;
      return `Neptu ${neptu} indica facilidad de sustento y armonía inicial.`;
    },
  };
  const reasonFunc = reasons[lang] || reasons["id"];
  return good.slice(0, 12).map(c => ({
    hari: c.hari,
    pasaran: c.pasaran,
    neptu: c.neptu,
    reason: reasonFunc(c.neptu),
  }));
}

function getMatchMeaning(totalNeptu: number, dict: any) {
  const sisa = totalNeptu % 7;
  const meanings = dict.matchMeanings;
  return meanings[sisa] || { title: "Unknown", desc: "" };
}

// ========== KOMPONEN UTAMA ==========
export default function HariBaikNikah() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [hari1, setHari1] = useState("Minggu");
  const [pasaran1, setPasaran1] = useState("Legi");
  const [hari2, setHari2] = useState("Senin");
  const [pasaran2, setPasaran2] = useState("Pahing");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const neptu1 = HARI_NILAI[hari1] + PASARAN_NILAI[pasaran1];
      const neptu2 = HARI_NILAI[hari2] + PASARAN_NILAI[pasaran2];
      const totalNeptu = neptu1 + neptu2;
      const matchMeaning = getMatchMeaning(totalNeptu, dict);
      const bestMonths = getBestMonths(totalNeptu, lang);
      const goodDays = getGoodDaysWeton(totalNeptu, lang);
      setResult({
        neptu1,
        neptu2,
        totalNeptu,
        weton1: `${hari1} ${pasaran1}`,
        weton2: `${hari2} ${pasaran2}`,
        matchMeaning,
        bestMonths,
        goodDays,
      });
      setAnalyzed(true);
      setLoading(false);
    }, 1300);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${result.weton1} & ${result.weton2}\n${dict.labels.totalNeptu}: ${result.totalNeptu} (${result.matchMeaning.title})\n${dict.labels.bestMonths}: ${result.bestMonths.map((m: any) => m.month).join(", ")}\n${dict.labels.goodDays}: ${result.goodDays.slice(0, 3).map((d: any) => `${d.hari} ${d.pasaran}`).join(", ")}\n\n${dict.labels.disclaimer}`;
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

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">💒📅</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-emerald-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.brideLabel}</label>
            <div className="flex gap-2">
              <select
                value={hari1}
                onChange={(e) => setHari1(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select
                value={pasaran1}
                onChange={(e) => setPasaran1(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-cyan-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.groomLabel}</label>
            <div className="flex gap-2">
              <select
                value={hari2}
                onChange={(e) => setHari2(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select
                value={pasaran2}
                onChange={(e) => setPasaran2(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full mt-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {loading ? dict.inputs.computing : dict.inputs.analyze}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-400 text-xs font-mono tracking-widest animate-pulse">COMPUTING...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !analyzed && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results */}
      {!loading && analyzed && result && (
        <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Card */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br from-emerald-950/30 to-teal-950/30">
            <div className="relative z-10 text-center">
              <div className="flex flex-wrap justify-center gap-3 text-lg font-bold">
                <span className="bg-white/10 px-3 py-1 rounded-full">{result.weton1} <span className="text-teal-300 text-sm">({result.neptu1})</span></span>
                <span className="text-2xl">💍</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{result.weton2} <span className="text-teal-300 text-sm">({result.neptu2})</span></span>
              </div>
              <div className="mt-4 text-5xl font-black text-teal-300">{result.totalNeptu}</div>
              <p className="text-slate-400 text-sm mt-1">{dict.labels.totalNeptu}</p>
              <div className="inline-block mt-3 px-4 py-1.5 bg-amber-500/20 rounded-full text-xs font-semibold">
                {dict.labels.compatibility}: {result.matchMeaning.title} – {result.matchMeaning.desc}
              </div>
            </div>
          </div>

          {/* Best Months */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5">
            <h3 className="text-emerald-300 font-bold text-lg flex items-center gap-2 mb-3">
              <span className="text-xl">📆</span> {dict.labels.bestMonths}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.bestMonths.map((m: any, idx: number) => (
                <div key={idx} className="bg-white/10 p-3 rounded-xl text-center">
                  <p className="font-bold text-amber-300 text-sm">{m.month}</p>
                  <p className="text-[11px] text-slate-300 mt-1">{m.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 italic">*Bulan-bulan ini dipilih berdasarkan primbon dan total neptu pasangan.</p>
          </div>

          {/* Good Days */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5">
            <h3 className="text-cyan-300 font-bold text-lg flex items-center gap-2 mb-3">
              <span className="text-xl">🌞</span> {dict.labels.goodDays}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {result.goodDays.slice(0, 9).map((d: any, idx: number) => (
                <div key={idx} className="bg-black/30 p-2 rounded-lg">
                  <span className="font-bold text-yellow-300">{d.hari} {d.pasaran}</span>
                  <span className="text-slate-300 text-xs ml-2">(Neptu {d.neptu})</span>
                  <p className="text-[10px] text-slate-400 mt-1">{d.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3">✨ Hari dengan neptu antara 10–15 dianggap membawa keberkahan.</p>
          </div>

          {/* Philosophy & Taboos */}
          <div className="bg-amber-950/30 backdrop-blur-md border border-amber-900/50 rounded-2xl p-5">
            <h4 className="text-amber-300 font-bold text-sm flex items-center gap-2 mb-2">
              <span className="text-xl">🙏</span> {dict.labels.philosophy}
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">
              Menurut primbon Jawa, pernikahan sebaiknya tidak dilaksanakan pada bulan Suro (Muharram) tanggal 1–10, saat Ramadhan (kecuali sangat terpaksa), dan pada hari Selasa Wage serta Sabtu Pahing (neptu rendah). Sangat dianjurkan untuk menggelar selamatan “tumpeng putih” sebelum akad dan memberi sedekah kepada fakir miskin.
            </p>
            <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-emerald-200 italic">✨ “{dict.labels.quote}”</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
            {dict.labels.disclaimer}
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
            resultId={`${result.neptu1}-${result.neptu2}`} 
          />
</>
          {/* SAMPAI SINI */}

        </div>
      )}

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
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}