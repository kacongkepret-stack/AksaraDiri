"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Navigasi Arah Rezeki",
    badge: "Ultra Premium",
    subtitle: "Temukan koordinat optimal finansial dan karir berdasarkan algoritma numerologi kelahiran Anda. Perpaduan data empiris & strategi modern.",
    shareBtn: "Bagikan",
    inputs: {
      birthDay: "Hari Lahir",
      pasaran: "Pasaran Jawa",
      selectDay: "-- Pilih Hari --",
      selectPasaran: "-- Pilih Pasaran --",
      analyze: "🗺️ Petakan Sektor Finansial",
      computing: "Mengkalkulasi Probabilitas...",
      emptyMessage: "Masukkan data kelahiran Anda untuk mengekstrak kerangka kerja optimal dalam penciptaan kekayaan.",
    },
    labels: {
      neptu: "Base Neptu",
      compass: "Arah",
      philosophy: "Filosofi Finansial",
      watak: "Watak Neptu",
      element: "Elemen",
      luckyColor: "Warna Keberuntungan",
      bestDay: "Hari Optimal",
      careerFocus: "Fokus Eksekusi Karir",
      financialStyle: "Profil Arus Kas",
      hiddenTrap: "Risiko Sistemik (Blind Spot)",
      actionStrategy: "Strategi Mitigasi",
      quote: "\"Kekayaan sejati bukanlah tentang melacak kemana uang pergi, melainkan membangun sistem yang mengarahkan kemana uang harus datang.\"",
      disclaimer: "*Dikalibrasi dari kearifan algoritma lokal dan diintegrasikan dengan prinsip manajemen portofolio modern. Selalu perhitungkan risk/reward ratio sebelum mengeksekusi kapital.",
    },
    neptuWatak: {
      7: "Pengamat Strategis (Silent Executor) - Mengandalkan intuisi tajam dan eksekusi presisi dalam keheningan.",
      8: "Sistematis & Tangguh - Unggul dalam konsistensi jangka panjang dan manajemen risiko yang terukur.",
      9: "Katalisator Dinamis - Memiliki agilitas tinggi untuk beradaptasi dan menangkap peluang di market baru.",
      10: "Negosiator Harmonis - Ahli dalam membangun kemitraan strategis dan meredam konflik operasional.",
      11: "Visioner Agresif - Mampu melihat tren makro yang belum disadari kompetitor, namun butuh kontrol emosi.",
      12: "Kolaborator Empatik - Kekuatan utamanya ada pada kemampuan membangun loyalitas tim dan jaringan (trust).",
      13: "Inovator Pendobrak - Otak yang selalu mencari efisiensi algoritma atau sistem baru yang disruptif.",
      14: "Komandan Ambisius - Sangat fokus pada pencapaian target metrik dan ekspansi skala (scaling up).",
      15: "Kreator Solutif - Pendekatan out-of-the-box dalam memecahkan masalah kompleks, peka terhadap anomali.",
      16: "Filsuf Analitik - Berpikir beberapa langkah ke depan; tidak mudah terpancing oleh fluktuasi jangka pendek.",
      17: "Maverick Dominan - Kharismatik, berani mengambil keputusan paling tidak populer namun sangat rasional.",
      18: "Idealis Visioner - Menciptakan nilai tambah (value) masif karena berorientasi pada dampak sosial yang luas.",
    },
    defaultWatak: "Anomali Strategis - Potensi tak terbatas",
  },
  en: {
    title: "Wealth Direction Navigator",
    badge: "Ultra Premium",
    subtitle: "Discover your optimal financial and career coordinates based on your birth numerology algorithm. A blend of empirical data & modern strategy.",
    shareBtn: "Share",
    inputs: {
      birthDay: "Birth Day",
      pasaran: "Javanese Pasaran",
      selectDay: "-- Select Day --",
      selectPasaran: "-- Select Pasaran --",
      analyze: "🗺️ Map Your Financial Sector",
      computing: "Computing Probabilities...",
      emptyMessage: "Enter your birth data to extract the optimal framework for wealth creation.",
    },
    labels: {
      neptu: "Base Neptu",
      compass: "Direction",
      philosophy: "Financial Philosophy",
      watak: "Neptu Character",
      element: "Element",
      luckyColor: "Lucky Color",
      bestDay: "Optimal Day",
      careerFocus: "Career Execution Focus",
      financialStyle: "Cash Flow Profile",
      hiddenTrap: "Systemic Risk (Blind Spot)",
      actionStrategy: "Mitigation Strategy",
      quote: "\"True wealth is not about tracking where money goes, but building a system that directs where money should come from.\"",
      disclaimer: "*Calibrated from local wisdom algorithms and integrated with modern portfolio management principles. Always consider risk/reward ratio before executing capital.",
    },
    neptuWatak: {
      7: "Strategic Observer (Silent Executor) - Relies on sharp intuition and precision execution in silence.",
      8: "Systematic & Resilient - Excels in long-term consistency and measured risk management.",
      9: "Dynamic Catalyst - High agility to adapt and seize opportunities in new markets.",
      10: "Harmonious Negotiator - Expert in building strategic partnerships and defusing operational conflicts.",
      11: "Aggressive Visionary - Able to see macro trends unnoticed by competitors, but needs emotional control.",
      12: "Empathetic Collaborator - Main strength lies in building team loyalty and trust networks.",
      13: "Disruptive Innovator - Brain constantly seeks algorithm efficiency or new disruptive systems.",
      14: "Ambitious Commander - Highly focused on achieving metric targets and scaling up.",
      15: "Solution Creator - Out-of-the-box approach to solving complex problems, sensitive to anomalies.",
      16: "Analytical Philosopher - Thinks several steps ahead; not easily provoked by short-term fluctuations.",
      17: "Dominant Maverick - Charismatic, dares to make the most unpopular but highly rational decisions.",
      18: "Visionary Idealist - Creates massive added value due to focus on broad social impact.",
    },
    defaultWatak: "Strategic Anomaly - Unlimited potential",
  },
  es: {
    title: "Navegador de Dirección de Riqueza",
    badge: "Ultra Premium",
    subtitle: "Descubre tus coordenadas financieras y profesionales óptimas según el algoritmo de numerología de tu nacimiento. Fusión de datos empíricos y estrategia moderna.",
    shareBtn: "Compartir",
    inputs: {
      birthDay: "Día de Nacimiento",
      pasaran: "Pasaran Javanés",
      selectDay: "-- Seleccionar Día --",
      selectPasaran: "-- Seleccionar Pasaran --",
      analyze: "🗺️ Trazar Sector Financiero",
      computing: "Calculando Probabilidades...",
      emptyMessage: "Introduce tus datos de nacimiento para extraer el marco óptimo para la creación de riqueza.",
    },
    labels: {
      neptu: "Neptu Base",
      compass: "Dirección",
      philosophy: "Filosofía Financiera",
      watak: "Carácter Neptu",
      element: "Elemento",
      luckyColor: "Color de la Suerte",
      bestDay: "Día Óptimo",
      careerFocus: "Enfoque de Ejecución Profesional",
      financialStyle: "Perfil de Flujo de Caja",
      hiddenTrap: "Riesgo Sistémico (Punto Ciego)",
      actionStrategy: "Estrategia de Mitigación",
      quote: "\"La verdadera riqueza no consiste en rastrear hacia dónde va el dinero, sino en construir un sistema que dirija de dónde debe venir.\"",
      disclaimer: "*Calibrado a partir de algoritmos de sabiduría local e integrado con principios modernos de gestión de carteras. Siempre considera la relación riesgo/recompensa antes de ejecutar capital.",
    },
    neptuWatak: {
      7: "Observador Estratégico (Ejecutor Silencioso) - Depende de la intuición aguda y la ejecución de precisión en silencio.",
      8: "Sistemático y Resistente - Sobresale en consistencia a largo plazo y gestión de riesgos medida.",
      9: "Catalizador Dinámico - Alta agilidad para adaptarse y capturar oportunidades en nuevos mercados.",
      10: "Negociador Armonioso - Experto en construir alianzas estratégicas y calmar conflictos operativos.",
      11: "Visionario Agresivo - Capaz de ver tendencias macro que los competidores no notan, pero necesita control emocional.",
      12: "Colaborador Empático - Su principal fortaleza es construir lealtad de equipo y redes de confianza.",
      13: "Innovador Disruptivo - Cerebro que busca constantemente eficiencia algorítmica o nuevos sistemas disruptivos.",
      14: "Comandante Ambicioso - Muy centrado en alcanzar objetivos métricos y escalar.",
      15: "Creador de Soluciones - Enfoque innovador para resolver problemas complejos, sensible a las anomalías.",
      16: "Filósofo Analítico - Piensa varios pasos adelante; no se deja provocar fácilmente por fluctuaciones a corto plazo.",
      17: "Maverick Dominante - Carismático, se atreve a tomar decisiones impopulares pero altamente racionales.",
      18: "Idealista Visionario - Crea un valor añadido masivo gracias a su enfoque en el impacto social amplio.",
    },
    defaultWatak: "Anomalía Estratégica - Potencial ilimitado",
  },
};

// ========== DAYS & PASARAN ==========
const HARI_LIST = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};
const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"]; // tetap karena istilah Jawa

const HARI_VALUE: Record<string, number> = {
  "Minggu": 5, "Senin": 4, "Selasa": 3, "Rabu": 7, "Kamis": 8, "Jumat": 6, "Sabtu": 9,
  "Sunday": 5, "Monday": 4, "Tuesday": 3, "Wednesday": 7, "Thursday": 8, "Friday": 6, "Saturday": 9,
  "Domingo": 5, "Lunes": 4, "Martes": 3, "Miércoles": 7, "Jueves": 8, "Viernes": 6, "Sábado": 9,
};

const PASARAN_VALUE: Record<string, number> = {
  "Legi": 5, "Pahing": 9, "Pon": 7, "Wage": 4, "Kliwon": 8,
};

// ========== DIRECTION DATA (MULTI-LANGUAGE) ==========
const getDirectionData = (lang: string, modulo: number) => {
  const base = {
    compass: {
      1: { id: "Timur", en: "East", es: "Este" },
      2: { id: "Selatan", en: "South", es: "Sur" },
      3: { id: "Barat", en: "West", es: "Oeste" },
      0: { id: "Utara", en: "North", es: "Norte" },
    },
    title: {
      1: { id: "Sektor Ekspansi & Jaringan", en: "Expansion & Networking Sector", es: "Sector de Expansión y Redes" },
      2: { id: "Sektor Skalabilitas & Gairah", en: "Scalability & Passion Sector", es: "Sector de Escalabilidad y Pasión" },
      3: { id: "Sektor Sistem & Analitik", en: "Systems & Analytics Sector", es: "Sector de Sistemas y Analítica" },
      0: { id: "Sektor Stabilitas & Aset", en: "Stability & Asset Sector", es: "Sector de Estabilidad y Activos" },
    },
    philosophy: {
      1: { id: "Arah matahari terbit. Melambangkan permulaan, pertumbuhan eksponensial, dan likuiditas. Rezeki sangat bergantung pada penetrasi pasar dan ekspansi relasi.", en: "Direction of sunrise. Symbolizes beginnings, exponential growth, and liquidity. Fortune heavily depends on market penetration and relationship expansion.", es: "Dirección del amanecer. Simboliza comienzos, crecimiento exponencial y liquidez. La fortuna depende en gran medida de la penetración en el mercado y la expansión de relaciones." },
      2: { id: "Arah puncak matahari. Melambangkan visibilitas, energi agresif, dan volatilitas tinggi. Keuntungan maksimal didapat dengan mengambil risiko asimetris.", en: "Direction of the sun's peak. Symbolizes visibility, aggressive energy, and high volatility. Maximum profit is achieved by taking asymmetric risks.", es: "Dirección del cenit solar. Simboliza visibilidad, energía agresiva y alta volatilidad. La máxima ganancia se logra asumiendo riesgos asimétricos." },
      3: { id: "Arah matahari terbenam. Melambangkan akumulasi, evaluasi data, dan struktur logis. Uang bekerja untuk Anda melalui sistem yang terotomasi.", en: "Direction of sunset. Symbolizes accumulation, data evaluation, and logical structure. Money works for you through automated systems.", es: "Dirección del atardecer. Simboliza acumulación, evaluación de datos y estructura lógica. El dinero trabaja para usted a través de sistemas automatizados." },
      0: { id: "Arah kutub magnetik. Melambangkan fondasi absolut, ketahanan (endurance), dan perlindungan modal. Kemenangan diraih lewat lari maraton, bukan sprint.", en: "Direction of the magnetic pole. Symbolizes absolute foundation, endurance, and capital protection. Victory is achieved through marathon running, not sprinting.", es: "Dirección del polo magnético. Simboliza base absoluta, resistencia y protección de capital. La victoria se logra corriendo maratones, no esprints." },
    },
    careerFocus: {
      1: { id: "Penjualan, pemasaran digital, membangun startup front-end, atau bertindak sebagai konektor B2B.", en: "Sales, digital marketing, building front-end startups, or acting as a B2B connector.", es: "Ventas, marketing digital, creación de startups front-end o actuando como conector B2B." },
      2: { id: "Posisi manajerial eksekutif, entrepreneur, venture capital, atau eksekutor proyek berskala masif.", en: "Executive managerial positions, entrepreneur, venture capital, or executor of massive-scale projects.", es: "Puestos directivos ejecutivos, emprendedor, capital de riesgo o ejecutor de proyectos a gran escala." },
      3: { id: "Back-end engineer, quantitative analyst, algorithmic trader, atau arsitek sistem operasional bisnis.", en: "Back-end engineer, quantitative analyst, algorithmic trader, or business operational systems architect.", es: "Ingeniero de back-end, analista cuantitativo, trader algorítmico o arquitecto de sistemas operativos empresariales." },
      0: { id: "Manajemen aset kelembagaan, properti/real estat, auditor, atau konsultan fundamental bisnis jangka panjang.", en: "Institutional asset management, property/real estate, auditor, or long-term business fundamental consultant.", es: "Gestión de activos institucionales, propiedad/bienes raíces, auditor o consultor de fundamentos empresariales a largo plazo." },
    },
    financialStyle: {
      1: { id: "Aggressive Growth. Suka memutar modal cepat untuk capital gain. Ahli memanfaatkan momentum (trend following).", en: "Aggressive Growth. Likes to rotate capital quickly for capital gains. Expert at utilizing momentum (trend following).", es: "Crecimiento Agresivo. Le gusta rotar el capital rápidamente para obtener ganancias de capital. Experto en utilizar el momentum (seguimiento de tendencias)." },
      2: { id: "High Risk, High Reward. Sangat fasih menggunakan leverage (OPM/OPT) untuk melipatgandakan ROI.", en: "High Risk, High Reward. Very fluent in using leverage (OPM/OPT) to multiply ROI.", es: "Alto Riesgo, Alta Recompensa. Muy fluido en el uso del apalancamiento (OPM/OPT) para multiplicar el ROI." },
      3: { id: "Calculated Precision. Sangat mengandalkan probabilitas statistik untuk membangun arus kas pasif (Automated Wealth).", en: "Calculated Precision. Highly relies on statistical probabilities to build passive cash flow (Automated Wealth).", es: "Precisión Calculada. Depende en gran medida de probabilidades estadísticas para construir flujo de caja pasivo (Riqueza Automatizada)." },
      0: { id: "Defensive Compounding. Mengutamakan hedging (lindung nilai) dan membiarkan bunga majemuk bekerja tanpa intervensi berlebih.", en: "Defensive Compounding. Prioritizes hedging and lets compound interest work without excessive intervention.", es: "Composición Defensiva. Prioriza la cobertura y deja que el interés compuesto funcione sin intervención excesiva." },
    },
    hiddenTrap: {
      1: { id: "FOMO (Fear of Missing Out). Sering melakukan over-trading atau melompat antar proyek tanpa fundamental.", en: "FOMO (Fear of Missing Out). Often overtrades or jumps between projects without fundamentals.", es: "FOMO (Miedo a Perderse Algo). A menudo sobreopera o salta entre proyectos sin fundamentos." },
      2: { id: "Over-leveraging (rasio utang tak sehat) dan risiko burnout akibat ketidakmampuan mendelegasikan kontrol.", en: "Over-leveraging (unhealthy debt ratio) and burnout risk due to inability to delegate control.", es: "Sobreapalancamiento (ratio de deuda insalubre) y riesgo de agotamiento debido a la incapacidad para delegar el control." },
      3: { id: "Analysis Paralysis. Terlalu sibuk mencari indikator atau algoritma 'Holy Grail' sehingga melewatkan eksekusi pasar.", en: "Analysis Paralysis. Too busy searching for indicators or 'Holy Grail' algorithms, missing market execution.", es: "Parálisis por Análisis. Demasiado ocupado buscando indicadores o algoritmos del 'Santo Grial', perdiendo la ejecución del mercado." },
      0: { id: "Loss Aversion ekstrem. Terlalu takut kehilangan modal kecil hingga membiarkan aset tergerus inflasi.", en: "Extreme loss aversion. Too afraid to lose small capital, letting assets erode by inflation.", es: "Aversión extrema a las pérdidas. Demasiado miedo a perder pequeño capital, dejando que los activos se erosionen por la inflación." },
    },
    actionStrategy: {
      1: { id: "Fokus mendominasi satu instrumen/niche hingga mencapai cash flow positif, sebelum melakukan diversifikasi aset.", en: "Focus on dominating one instrument/niche until positive cash flow is achieved, before diversifying assets.", es: "Concéntrese en dominar un instrumento/niche hasta lograr un flujo de caja positivo, antes de diversificar activos." },
      2: { id: "Terapkan formula manajemen risiko ketat (seperti Kelly Criterion). Jangan biarkan bias emosi merusak logika sistem.", en: "Apply strict risk management formulas (like Kelly Criterion). Don't let emotional bias ruin system logic.", es: "Aplique fórmulas estrictas de gestión de riesgos (como el criterio de Kelly). No deje que el sesgo emocional arruine la lógica del sistema." },
      3: { id: "Lakukan iterative deployment. Lempar prototipe ke pasar (live test) dengan modal kecil, lalu optimasi secara real-time.", en: "Perform iterative deployment. Throw a prototype to market (live test) with small capital, then optimize in real-time.", es: "Realice un despliegue iterativo. Lance un prototipo al mercado (prueba en vivo) con poco capital, luego optimice en tiempo real." },
      0: { id: "Terapkan prinsip Barbell: 80% alokasi pada aset ultra-aman, 20% pada instrumen asimetris berisiko tinggi namun terukur.", en: "Apply the Barbell principle: 80% allocation to ultra-safe assets, 20% to asymmetric high-risk but measured instruments.", es: "Aplique el principio de Barbell: 80% de asignación a activos ultra seguros, 20% a instrumentos asimétricos de alto riesgo pero medidos." },
    },
    colorScheme: {
      1: "from-amber-400 to-orange-500",
      2: "from-rose-500 to-red-600",
      3: "from-indigo-400 to-cyan-500",
      0: "from-emerald-500 to-teal-600",
    },
    luckyColor: {
      1: { id: "Kuning, Oranye, Emas", en: "Yellow, Orange, Gold", es: "Amarillo, Naranja, Dorado" },
      2: { id: "Merah, Hitam, Emas", en: "Red, Black, Gold", es: "Rojo, Negro, Dorado" },
      3: { id: "Biru, Ungu, Putih", en: "Blue, Purple, White", es: "Azul, Morado, Blanco" },
      0: { id: "Hijau, Coklat, Hitam", en: "Green, Brown, Black", es: "Verde, Marrón, Negro" },
    },
    element: {
      1: { id: "Api Ekspansif", en: "Expansive Fire", es: "Fuego Expansivo" },
      2: { id: "Api Murni", en: "Pure Fire", es: "Fuego Puro" },
      3: { id: "Udara Dinamis", en: "Dynamic Air", es: "Aire Dinámico" },
      0: { id: "Tanah Solid", en: "Solid Earth", es: "Tierra Sólida" },
    },
    bestDay: {
      1: { id: "Selasa, Kamis", en: "Tuesday, Thursday", es: "Martes, Jueves" },
      2: { id: "Selasa, Jumat", en: "Tuesday, Friday", es: "Martes, Viernes" },
      3: { id: "Rabu, Sabtu", en: "Wednesday, Saturday", es: "Miércoles, Sábado" },
      0: { id: "Senin, Rabu", en: "Monday, Wednesday", es: "Lunes, Miércoles" },
    },
  };
  return {
    title: base.title[modulo][lang],
    compass: base.compass[modulo][lang],
    philosophy: base.philosophy[modulo][lang],
    careerFocus: base.careerFocus[modulo][lang],
    financialStyle: base.financialStyle[modulo][lang],
    hiddenTrap: base.hiddenTrap[modulo][lang],
    actionStrategy: base.actionStrategy[modulo][lang],
    colorScheme: base.colorScheme[modulo],
    luckyColor: base.luckyColor[modulo][lang],
    element: base.element[modulo][lang],
    bestDay: base.bestDay[modulo][lang],
  };
};

// ========== MAIN COMPONENT ==========
export default function WealthDirectionAnalyzer() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  const hariOptions = HARI_LIST[lang as keyof typeof HARI_LIST] || HARI_LIST["id"];

  const [selectedHari, setSelectedHari] = useState("");
  const [selectedPasaran, setSelectedPasaran] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const calculationResult = useMemo(() => {
    if (!selectedHari || !selectedPasaran) return null;
    const neptu = HARI_VALUE[selectedHari] + PASARAN_VALUE[selectedPasaran];
    const modulo = neptu % 4;
    const direction = getDirectionData(lang, modulo);
    const watak = dict.neptuWatak[neptu] || dict.defaultWatak;
    return { neptu, modulo, direction, watak };
  }, [selectedHari, selectedPasaran, lang, dict]);

  const handleAnalyze = () => {
    if (!selectedHari || !selectedPasaran) return;
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
    }, 800);
  };

  const handleShare = async () => {
    if (!calculationResult) return;
    const text = `${dict.title}: ${calculationResult.direction.compass} (${calculationResult.direction.title})\n${dict.labels.neptu}: ${calculationResult.neptu}\n${dict.labels.watak}: ${calculationResult.watak}\n${dict.labels.careerFocus}: ${calculationResult.direction.careerFocus}\n${dict.labels.luckyColor}: ${calculationResult.direction.luckyColor}\n\n${dict.labels.disclaimer}`;
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

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🧭💸</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">✨{dict.badge}</span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-emerald-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.birthDay}</label>
            <select
              value={selectedHari}
              onChange={(e) => setSelectedHari(e.target.value)}
              className="w-full bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all"
            >
              <option value="" disabled>{dict.inputs.selectDay}</option>
              {hariOptions.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-emerald-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.pasaran}</label>
            <select
              value={selectedPasaran}
              onChange={(e) => setSelectedPasaran(e.target.value)}
              className="w-full bg-slate-900/60 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all"
            >
              <option value="" disabled>{dict.inputs.selectPasaran}</option>
              {PASARAN_LIST.map(pasaran => <option key={pasaran} value={pasaran}>{pasaran}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading || !selectedHari || !selectedPasaran}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {loading ? dict.inputs.computing : dict.inputs.analyze}
          </button>
        </div>
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
      {!loading && analyzed && calculationResult && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Card */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${calculationResult.direction.colorScheme} blur-[80px] opacity-20`} />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${calculationResult.direction.colorScheme} shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0 border-4 border-slate-900`}>
                <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  {calculationResult.direction.compass.substring(0, 3)}
                </span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                  {dict.labels.neptu}: {calculationResult.neptu}
                </p>
                <h3 className={`text-2xl font-black bg-gradient-to-r ${calculationResult.direction.colorScheme} bg-clip-text text-transparent mb-2`}>
                  {calculationResult.direction.compass}: {calculationResult.direction.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{calculationResult.direction.philosophy}</p>
                <div className="inline-block px-4 py-1.5 bg-slate-800 border border-slate-600 rounded-full">
                  <p className="text-slate-200 text-xs font-semibold">🧬 {calculationResult.watak}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">🌿 {dict.labels.element}</p>
              <p className="text-sm font-semibold text-slate-200">{calculationResult.direction.element}</p>
            </div>
            <div className="bg-slate-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">🎨 {dict.labels.luckyColor}</p>
              <p className="text-sm font-semibold text-slate-200">{calculationResult.direction.luckyColor}</p>
            </div>
            <div className="bg-slate-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">📅 {dict.labels.bestDay}</p>
              <p className="text-sm font-semibold text-slate-200">{calculationResult.direction.bestDay}</p>
            </div>
          </div>

          {/* Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💼</span>
                <h4 className="font-bold text-emerald-100">{dict.labels.careerFocus}</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{calculationResult.direction.careerFocus}</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📊</span>
                <h4 className="font-bold text-emerald-100">{dict.labels.financialStyle}</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{calculationResult.direction.financialStyle}</p>
            </div>
            <div className="bg-rose-950/30 backdrop-blur-md border border-rose-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h4 className="font-bold text-rose-300">{dict.labels.hiddenTrap}</h4>
              </div>
              <p className="text-rose-200/70 text-sm leading-relaxed">{calculationResult.direction.hiddenTrap}</p>
            </div>
            <div className="bg-emerald-950/30 backdrop-blur-md border border-emerald-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">♟️</span>
                <h4 className="font-bold text-emerald-300">{dict.labels.actionStrategy}</h4>
              </div>
              <p className="text-emerald-200/70 text-sm font-medium leading-relaxed">{calculationResult.direction.actionStrategy}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/30">
            <p className="text-emerald-200 text-sm font-medium italic">"{dict.labels.quote}"</p>
          </div>

{/* Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
            {dict.labels.disclaimer}
          </div>
          
          {/* INJEKSI PAYWALL */}
          
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
            resultId={calculationResult.neptu.toString()} 
          />

        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
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