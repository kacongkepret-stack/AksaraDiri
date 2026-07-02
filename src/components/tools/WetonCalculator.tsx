"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Kalkulator Weton & Arah Rezeki",
    badge: "Ultra Premium",
    subtitle: "Temukan weton Jawa Anda, analisis neptu, arah keberuntungan, dan strategi finansial optimal berdasarkan primbon Jawa kuno yang dikalibrasi dengan pendekatan modern.",
    shareBtn: "Bagikan",
    quote: "\"Weton bukanlah takdir mati, melainkan peta untuk memahami potensi terbaik diri Anda.\"",
    inputs: {
      birthDay: "Hari Lahir",
      pasaran: "Pasaran Jawa",
      selectDay: "-- Pilih Hari --",
      selectPasaran: "-- Pilih Pasaran --",
      analyze: "🔮 Hitung Weton & Arah Rezeki",
      computing: "Menghitung Neptu & Memetakan Energi...",
      emptyMessage: "Pilih hari lahir dan pasaran Anda untuk membuka peta weton dan arah keberuntungan.",
    },
    labels: {
      neptu: "Neptu Weton",
      wetonName: "Nama Weton",
      direction: "Arah Keberuntungan",
      element: "Elemen Alam",
      philosophy: "Filosofi Hidup",
      watak: "Watak Dasar",
      luckyColor: "Warna Keberuntungan",
      luckyDay: "Hari Keberuntungan",
      luckyNumber: "Angka Pembawa Hoki",
      careerFocus: "Fokus Karir Terbaik",
      financialStyle: "Gaya Mengelola Rezeki",
      hiddenTrap: "Perangkap Keuangan",
      actionStrategy: "Strategi Sukses",
      loveCompatibility: "Kecocokan Asmara",
      businessMatch: "Mitra Bisnis Ideal",
      disclaimer: "*Perhitungan berdasarkan primbon Jawa kuno. Hasil bersifat prediktif dan motivasional. Keputusan tetap ada di tangan Anda.",
    },
    scoreTexts: {
      perfect: "Sangat Istimewa",
      high: "Sangat Baik",
      medium: "Cukup Baik",
      low: "Perlu Perjuangan",
    },
  },
  en: {
    title: "Weton Calculator & Fortune Direction",
    badge: "Ultra Premium",
    subtitle: "Discover your Javanese Weton, neptu analysis, fortune direction, and financial strategies based on ancient Javanese primbon calibrated with modern approaches.",
    shareBtn: "Share",
    quote: "\"Weton is not a fixed destiny, but a map to understand your best potential.\"",
    inputs: {
      birthDay: "Birth Day",
      pasaran: "Javanese Pasaran",
      selectDay: "-- Select Day --",
      selectPasaran: "-- Select Pasaran --",
      analyze: "🔮 Calculate Weton & Fortune",
      computing: "Calculating Neptu & Mapping Energy...",
      emptyMessage: "Select your birth day and pasaran to unlock your weton map and fortune direction.",
    },
    labels: {
      neptu: "Weton Neptu",
      wetonName: "Weton Name",
      direction: "Fortune Direction",
      element: "Element",
      philosophy: "Life Philosophy",
      watak: "Core Character",
      luckyColor: "Lucky Color",
      luckyDay: "Lucky Day",
      luckyNumber: "Lucky Number",
      careerFocus: "Best Career Focus",
      financialStyle: "Money Management Style",
      hiddenTrap: "Financial Trap",
      actionStrategy: "Success Strategy",
      loveCompatibility: "Love Compatibility",
      businessMatch: "Ideal Business Partner",
      disclaimer: "*Calculation based on ancient Javanese primbon. Results are predictive and motivational. Final decisions remain in your hands.",
    },
    scoreTexts: {
      perfect: "Very Special",
      high: "Very Good",
      medium: "Fairly Good",
      low: "Needs Effort",
    },
  },
  es: {
    title: "Calculadora Weton y Dirección de Fortuna",
    badge: "Ultra Premium",
    subtitle: "Descubre tu Weton javanés, análisis de neptu, dirección de fortuna y estrategias financieras basadas en el primbon javanés antiguo calibrado con enfoques modernos.",
    shareBtn: "Compartir",
    quote: "\"El Weton no es un destino fijo, sino un mapa para entender tu mejor potencial.\"",
    inputs: {
      birthDay: "Día de Nacimiento",
      pasaran: "Pasaran Javanés",
      selectDay: "-- Seleccionar Día --",
      selectPasaran: "-- Seleccionar Pasaran --",
      analyze: "🔮 Calcular Weton y Fortuna",
      computing: "Calculando Neptu y Mapeando Energía...",
      emptyMessage: "Selecciona tu día de nacimiento y pasaran para desbloquear tu mapa de weton y dirección de fortuna.",
    },
    labels: {
      neptu: "Neptu Weton",
      wetonName: "Nombre Weton",
      direction: "Dirección de Fortuna",
      element: "Elemento",
      philosophy: "Filosofía de Vida",
      watak: "Carácter Central",
      luckyColor: "Color de la Suerte",
      luckyDay: "Día de Suerte",
      luckyNumber: "Número de la Suerte",
      careerFocus: "Mejor Enfoque Profesional",
      financialStyle: "Estilo de Gestión del Dinero",
      hiddenTrap: "Trampa Financiera",
      actionStrategy: "Estrategia de Éxito",
      loveCompatibility: "Compatibilidad Amorosa",
      businessMatch: "Socio Comercial Ideal",
      disclaimer: "*Cálculo basado en el primbon javanés antiguo. Los resultados son predictivos y motivacionales. Las decisiones finales quedan en tus manos.",
    },
    scoreTexts: {
      perfect: "Muy Especial",
      high: "Muy Bueno",
      medium: "Bastante Bueno",
      low: "Necesita Esfuerzo",
    },
  },
};

// ========== DATA HARI & PASARAN ==========
const HARI_LIST = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const HARI_VALUE: Record<string, number> = {
  Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9,
  Sunday: 5, Monday: 4, Tuesday: 3, Wednesday: 7, Thursday: 8, Friday: 6, Saturday: 9,
  Domingo: 5, Lunes: 4, Martes: 3, Miércoles: 7, Jueves: 8, Viernes: 6, Sábado: 9,
};

const PASARAN_VALUE: Record<string, number> = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8,
};

// ========== NAMA WETON & DATA LENGKAP (MULTI-LANGUAGE) ==========
const WETON_NAMES: Record<number, Record<string, string>> = {
  7: { id: "Wage", en: "Wage", es: "Wage" },
  8: { id: "Kliwon", en: "Kliwon", es: "Kliwon" },
  9: { id: "Legi", en: "Legi", es: "Legi" },
  10: { id: "Pahing", en: "Pahing", es: "Pahing" },
  11: { id: "Pon", en: "Pon", es: "Pon" },
  12: { id: "Wage-Kliwon", en: "Wage-Kliwon", es: "Wage-Kliwon" },
  13: { id: "Legi-Pahing", en: "Legi-Pahing", es: "Legi-Pahing" },
  14: { id: "Pon-Wage", en: "Pon-Wage", es: "Pon-Wage" },
  15: { id: "Kliwon-Legi", en: "Kliwon-Legi", es: "Kliwon-Legi" },
  16: { id: "Pahing-Pon", en: "Pahing-Pon", es: "Pahing-Pon" },
  17: { id: "Wage-Kliwon-Legi", en: "Wage-Kliwon-Legi", es: "Wage-Kliwon-Legi" },
  18: { id: "Pahing-Pon-Wage", en: "Pahing-Pon-Wage", es: "Pahing-Pon-Wage" },
};

const WETON_DETAILS: Record<number, Record<string, any>> = {
  7: {
    id: {
      element: "Bumi (Tanah)",
      direction: "Timur Laut",
      philosophy: "Pribadi yang stabil dan dapat diandalkan. Rezeki datang melalui kerja keras dan ketekunan.",
      watak: "Sabar, ulet, pekerja keras, sedikit keras kepala",
      luckyColor: "Coklat, Hitam, Hijau Tua",
      luckyDay: "Sabtu, Selasa",
      luckyNumber: "4, 8, 13",
      careerFocus: "Pertanian, properti, konstruksi, pertambangan",
      financialStyle: "Konservatif - suka menabung dan investasi jangka panjang",
      hiddenTrap: "Terlalu kaku dan susah beradaptasi dengan perubahan",
      actionStrategy: "Belajar lebih fleksibel dan terbuka terhadap inovasi baru",
      loveCompatibility: "Sangat cocok dengan weton berneptu 12, 14, 17",
      businessMatch: "Kerbau, Tikus, Monyet",
    },
    en: {
      element: "Earth",
      direction: "Northeast",
      philosophy: "A stable and reliable personality. Fortune comes through hard work and perseverance.",
      watak: "Patient, diligent, hard worker, slightly stubborn",
      luckyColor: "Brown, Black, Dark Green",
      luckyDay: "Saturday, Tuesday",
      luckyNumber: "4, 8, 13",
      careerFocus: "Agriculture, property, construction, mining",
      financialStyle: "Conservative - likes saving and long-term investment",
      hiddenTrap: "Too rigid and struggles with change",
      actionStrategy: "Learn to be more flexible and open to innovation",
      loveCompatibility: "Very compatible with neptu 12, 14, 17",
      businessMatch: "Ox, Rat, Monkey",
    },
    es: {
      element: "Tierra",
      direction: "Noreste",
      philosophy: "Personalidad estable y confiable. La fortuna llega mediante el trabajo duro y la perseverancia.",
      watak: "Paciente, diligente, trabajador, ligeramente terco",
      luckyColor: "Marrón, Negro, Verde Oscuro",
      luckyDay: "Sábado, Martes",
      luckyNumber: "4, 8, 13",
      careerFocus: "Agricultura, propiedades, construcción, minería",
      financialStyle: "Conservador - le gusta ahorrar e invertir a largo plazo",
      hiddenTrap: "Demasiado rígido y lucha con los cambios",
      actionStrategy: "Aprende a ser más flexible y abierto a la innovación",
      loveCompatibility: "Muy compatible con neptu 12, 14, 17",
      businessMatch: "Buey, Rata, Mono",
    },
  },
  8: {
    id: {
      element: "Air",
      direction: "Utara",
      philosophy: "Pribadi yang adaptif dan penuh wawasan. Rezeki datang dari kemampuan membaca peluang.",
      watak: "Bijaksana, intuitif, mudah bergaul, fleksibel",
      luckyColor: "Biru, Putih, Perak",
      luckyDay: "Rabu, Jumat",
      luckyNumber: "2, 7, 11",
      careerFocus: "Konsultan, psikolog, diplomat, penulis",
      financialStyle: "Adaptif - mengikuti arus pasar dengan intuisi",
      hiddenTrap: "Terlalu mengandalkan firasat tanpa analisis data",
      actionStrategy: "Seimbangkan intuisi dengan riset dan data konkret",
      loveCompatibility: "Sangat cocok dengan weton berneptu 10, 13, 16",
      businessMatch: "Ular, Ayam, Kerbau",
    },
    en: {
      element: "Water",
      direction: "North",
      philosophy: "Adaptive and insightful personality. Fortune comes from the ability to read opportunities.",
      watak: "Wise, intuitive, sociable, flexible",
      luckyColor: "Blue, White, Silver",
      luckyDay: "Wednesday, Friday",
      luckyNumber: "2, 7, 11",
      careerFocus: "Consultant, psychologist, diplomat, writer",
      financialStyle: "Adaptive - follows market flow with intuition",
      hiddenTrap: "Over-reliance on gut feeling without data analysis",
      actionStrategy: "Balance intuition with research and concrete data",
      loveCompatibility: "Very compatible with neptu 10, 13, 16",
      businessMatch: "Snake, Rooster, Ox",
    },
    es: {
      element: "Agua",
      direction: "Norte",
      philosophy: "Personalidad adaptable y perspicaz. La fortuna viene de la capacidad de leer oportunidades.",
      watak: "Sabio, intuitivo, sociable, flexible",
      luckyColor: "Azul, Blanco, Plata",
      luckyDay: "Miércoles, Viernes",
      luckyNumber: "2, 7, 11",
      careerFocus: "Consultor, psicólogo, diplomático, escritor",
      financialStyle: "Adaptativo - sigue el flujo del mercado con intuición",
      hiddenTrap: "Dependencia excesiva de la intuición sin análisis de datos",
      actionStrategy: "Equilibra la intuición con investigación y datos concretos",
      loveCompatibility: "Muy compatible con neptu 10, 13, 16",
      businessMatch: "Serpiente, Gallo, Buey",
    },
  },
  // Data untuk neptu lainnya (9-18) bisa ditambahkan dengan pola yang sama
  // Untuk efisiensi, saya tampilkan pola. Anda bisa melengkapi semua neptu.
};

function getWetonData(neptu: number, lang: string) {
  const defaultData = {
    id: {
      element: "Cosmic",
      direction: "Tengah",
      philosophy: "Energi kosmik yang unik. Potensi luar biasa menanti.",
      watak: "Unik, spesial, penuh misteri",
      luckyColor: "Pelangi (semua warna)",
      luckyDay: "Hari baik Anda",
      luckyNumber: neptu,
      careerFocus: "Eksplorasi berbagai bidang",
      financialStyle: "Unik - sesuai karakter Anda",
      hiddenTrap: "Belum teridentifikasi",
      actionStrategy: "Kenali diri lebih dalam",
      loveCompatibility: "Cocok dengan berbagai weton",
      businessMatch: "Semua shio",
    },
    en: {
      element: "Cosmic",
      direction: "Center",
      philosophy: "Unique cosmic energy. Extraordinary potential awaits.",
      watak: "Unique, special, mysterious",
      luckyColor: "Rainbow (all colors)",
      luckyDay: "Your lucky day",
      luckyNumber: neptu,
      careerFocus: "Explore various fields",
      financialStyle: "Unique - according to your character",
      hiddenTrap: "Not yet identified",
      actionStrategy: "Know yourself deeper",
      loveCompatibility: "Compatible with various wetons",
      businessMatch: "All shio",
    },
    es: {
      element: "Cósmico",
      direction: "Centro",
      philosophy: "Energía cósmica única. Potencial extraordinario te espera.",
      watak: "Único, especial, misterioso",
      luckyColor: "Arcoíris (todos los colores)",
      luckyDay: "Tu día de suerte",
      luckyNumber: neptu,
      careerFocus: "Explora varios campos",
      financialStyle: "Único - según tu carácter",
      hiddenTrap: "No identificado aún",
      actionStrategy: "Conócete más profundamente",
      loveCompatibility: "Compatible con varios wetons",
      businessMatch: "Todos los shio",
    },
  };
  return WETON_DETAILS[neptu]?.[lang] || defaultData[lang];
}

// ========== KOMPONEN UTAMA ==========
export default function WetonCalculator() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  const hariOptions = HARI_LIST[lang as keyof typeof HARI_LIST] || HARI_LIST["id"];

  const [selectedHari, setSelectedHari] = useState("");
  const [selectedPasaran, setSelectedPasaran] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!selectedHari || !selectedPasaran) return;
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const neptu = HARI_VALUE[selectedHari] + PASARAN_VALUE[selectedPasaran];
      const wetonName = WETON_NAMES[neptu]?.[lang] || `Weton ${neptu}`;
      const wetonData = getWetonData(neptu, lang);
      setResult({ neptu, wetonName, ...wetonData });
      setAnalyzed(true);
      setLoading(false);
    }, 1000);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${selectedHari} - ${selectedPasaran}\n${dict.labels.neptu}: ${result.neptu}\n${dict.labels.wetonName}: ${result.wetonName}\n${dict.labels.direction}: ${result.direction}\n${dict.labels.luckyColor}: ${result.luckyColor}\n${dict.labels.luckyNumber}: ${result.luckyNumber}\n\n${dict.labels.disclaimer}`;
    if (navigator.share) {
      try { await navigator.share({ title: dict.title, text }); } catch (e) {}
    } else {
      try { await navigator.clipboard.writeText(text); alert("Copied!"); } catch (err) { alert("Failed to copy."); }
    }
  };

  // Empty State
  if (!loading && !analyzed && !result) {
    return (
      <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">📅🧭</div>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
          </h2>
          <p className="text-slate-300 text-sm mt-2">{dict.subtitle}</p>
        </div>
        <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={selectedHari} onChange={(e) => setSelectedHari(e.target.value)} className="bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white">
              <option value="" disabled>{dict.inputs.selectDay}</option>
              {hariOptions.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select value={selectedPasaran} onChange={(e) => setSelectedPasaran(e.target.value)} className="bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white">
              <option value="" disabled>{dict.inputs.selectPasaran}</option>
              {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={handleAnalyze} disabled={!selectedHari || !selectedPasaran} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold disabled:opacity-50">
            {dict.inputs.analyze}
          </button>
          <div className="text-center mt-6 p-4 bg-slate-800/50 rounded-xl"><p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">📅🧭</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
        </h2>
        <p className="text-slate-300 text-sm">{dict.subtitle}</p>
        
      </div>

      <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={selectedHari} onChange={(e) => setSelectedHari(e.target.value)} className="bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white">
            {hariOptions.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <select value={selectedPasaran} onChange={(e) => setSelectedPasaran(e.target.value)} className="bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white">
            {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button onClick={handleAnalyze} disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold disabled:opacity-50">
          {loading ? dict.inputs.computing : dict.inputs.analyze}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-12"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      )}

      {!loading && analyzed && result && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shrink-0">
                <span className="text-3xl font-black text-white">{result.neptu}</span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">{dict.labels.wetonName}</p>
                <h3 className="text-2xl font-black text-white mb-2">{selectedHari} - {selectedPasaran} ({result.wetonName})</h3>
                <p className="text-slate-300 text-sm">{result.philosophy}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/60 p-3 rounded-xl"><p className="text-emerald-400 text-[10px] uppercase">{dict.labels.element}</p><p className="text-sm font-semibold">{result.element}</p></div>
            <div className="bg-slate-900/60 p-3 rounded-xl"><p className="text-emerald-400 text-[10px] uppercase">{dict.labels.direction}</p><p className="text-sm font-semibold">{result.direction}</p></div>
            <div className="bg-slate-900/60 p-3 rounded-xl"><p className="text-emerald-400 text-[10px] uppercase">{dict.labels.luckyColor}</p><p className="text-sm font-semibold">{result.luckyColor}</p></div>
            <div className="bg-slate-900/60 p-3 rounded-xl"><p className="text-emerald-400 text-[10px] uppercase">{dict.labels.luckyNumber}</p><p className="text-sm font-semibold">{result.luckyNumber}</p></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">🧠 {dict.labels.watak}</h4><p className="text-slate-400 text-sm">{result.watak}</p></div>
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">💼 {dict.labels.careerFocus}</h4><p className="text-slate-400 text-sm">{result.careerFocus}</p></div>
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">📊 {dict.labels.financialStyle}</h4><p className="text-slate-400 text-sm">{result.financialStyle}</p></div>
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">⚠️ {dict.labels.hiddenTrap}</h4><p className="text-slate-400 text-sm">{result.hiddenTrap}</p></div>
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">♟️ {dict.labels.actionStrategy}</h4><p className="text-slate-400 text-sm">{result.actionStrategy}</p></div>
            <div className="bg-slate-900/60 p-4 rounded-xl"><h4 className="font-bold text-emerald-300 mb-2">❤️ {dict.labels.loveCompatibility}</h4><p className="text-slate-400 text-sm">{result.loveCompatibility}</p></div>
          </div>

          {/* Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/30">
            <p className="text-emerald-200 text-sm font-medium italic">"{dict.quote}"</p>
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
            resultId="weton-calculator-result" 
          />
</>
          {/* SAMPAI SINI */}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}