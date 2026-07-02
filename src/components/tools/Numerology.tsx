"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== PYTHAGOREAN LETTER VALUE MAPPING ==========
const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// ========== MULTI-LANGUAGE UI DICTIONARY ==========
const UI_DICTIONARY: Record<string, any> = {
  id: {
    title: "Numerologi Nama",
    badge: "Ultra Premium",
    subtitle: "Ungkap kode cetak biru jiwa dan potensi kesuksesan takdir yang tertanam di dalam nama lengkap Anda berdasarkan getaran Pythagorean.",
    shareBtn: "Bagikan",
    inputs: {
      nameLabel: "Masukkan Nama Lengkap Sesuai Akta Lahir",
      placeholder: "Contoh: Alexander Mahardika",
      calculate: "🔮 Dekode Energi Nama",
      calculating: "Mendekode Getaran Huruf...",
      emptyMessage: "Ketikkan nama lengkap Anda di atas untuk memulai analisis matriks energi nama.",
    },
    labels: {
      expressionNum: "Angka Ekspresi Nama",
      strengths: "Sisi Terang (Potensi Utama)",
      shadow: "Sisi Bayangan (Blind Spot)",
      career: "💼 Karir & Struktur Finansial",
      love: "❤️ Dinamika Resonansi Asmara",
      quote: "\"Nama Anda bukan sekadar identitas sosial; ia adalah mantra frekuensi yang mengarahkan ke mana takdir dan potensi kesuksesan Anda mengalir.\"",
      disclaimer: "*Analisis ini mengekstrak getaran huruf nama lewat metode Pythagorean klasik untuk introspeksi strategis. Eksekusi nyata di dunia nyata tetap di tangan Anda.",
    }
  },
  en: {
    title: "Name Numerology",
    badge: "Ultra Premium",
    subtitle: "Unveil the soul blueprint and destiny code embedded within your full name based on Pythagorean frequency vibrations.",
    shareBtn: "Share",
    inputs: {
      nameLabel: "Enter Full Name (As written in Birth Certificate)",
      placeholder: "Example: Alexander Mahardika",
      calculate: "🔮 Decode Name Energy",
      calculating: "Decoding Letter Vibrations...",
      emptyMessage: "Type your full name above to begin analyzing your name's energy matrix.",
    },
    labels: {
      expressionNum: "Expression Number",
      strengths: "Bright Side (Core Strengths)",
      shadow: "Shadow Side (Blind Spot)",
      career: "💼 Strategic Career & Wealth",
      love: "❤️ Romance & Connection Dynamics",
      quote: "\"Your name is not just a social label; it is a frequency mantra that guides the direction of your destiny and innate success potential.\"",
      disclaimer: "*This analysis extracts name letter vibrations using the classical Pythagorean system for strategic introspection. Real-world execution remains yours.",
    }
  },
  es: {
    title: "Numerología del Nombre",
    badge: "Ultra Premium",
    subtitle: "Descubre el plano del alma y el código del destino arraigados en tu nombre completo basados en las vibraciones pitagóricas.",
    shareBtn: "Compartir",
    inputs: {
      nameLabel: "Ingrese Nombre Completo (Como en el Certificado de Nacimiento)",
      placeholder: "Ejemplo: Alexander Mahardika",
      calculate: "🔮 Decodificar Energía",
      calculating: "Decodificando Vibraciones...",
      emptyMessage: "Escribe tu nombre completo arriba para comenzar a analizar la matriz de energía de tu nombre.",
    },
    labels: {
      expressionNum: "Número de Expresión",
      strengths: "Lado Luminoso (Fortalezas Core)",
      shadow: "Lado Oscuro (Punto Ciego)",
      career: "💼 Carrera Estratégica y Riqueza",
      love: "❤️ Dinámicas del Amor y Conexión",
      quote: "\"Tu nombre no es solo una etiqueta social; es un mantra de frecuencia que guía la dirección de tu destino y tu potencial de éxito innato.\"",
      disclaimer: "*Este análisis extrae vibraciones a través del sistema pitagórico clásico para la introspección estratégica. La ejecución real depende de ti.",
    }
  }
};

// ========== MULTI-LANGUAGE INTERPRETATION DATABASE ==========
const NUMEROLOGY_DATA_ML: Record<string, Record<number, any>> = {
  id: {
    1: { title: "Sang Pemimpin Lahiriah (The Pioneer)", strengths: "Independen, memiliki daya dorong kuat, inovatif, berani mengambil risiko, dan penuh inisiatif.", shadow: "Egosentris, keras kepala, tidak suka diatur, dan rawan menjadi tidak sabaran.", career: "Sangat optimal sebagai Entrepreneur, CEO, Pemimpin Proyek, atau Konsultan Independen.", love: "Mencari pasangan yang mandiri dan menghargai ruang banyank untuk bermanuver." },
    2: { title: "Sang Penyelaras Harmoni (The Peacemaker)", strengths: "Diplomatis, intuitif, peka, kooperatif, dan sangat ahli dalam mediasi.", shadow: "Terlalu sensitif, menghindari konflik secara ekstrem, dan rawan menjadi people-pleaser.", career: "Unggul di bidang Hubungan Internasional, Konselor, Psikolog, HRD, atau Administrator Sistem.", love: "Mendambakan kedamaian batin, cinta yang penuh kelembutan, komunikasi verbal dua arah." },
    3: { title: "Sang Komunikator Kreatif (The Expressor)", strengths: "Ekspresif, karismatik, pandai mencairkan suasana, imajinatif, dan komunikator ulung.", shadow: "Kurang fokus, emosi tidak stabil, cenderung menyebarkan energi terlalu luas sehingga tidak konsisten.", career: "Sektor Industri Kreatif, Hubungan Masyarakat (PR), Penulis, Pemasaran digital, atau Entertainer.", love: "Butuh pasangan yang seru, humoris, tidak kaku, dan bisa diajak berdiskusi tentang ide-ide gila." },
    4: { title: "Sang Arsitek Sistem (The Builder)", strengths: "Sistematis, metodis, disiplin tinggi, sangat andal, dan fondasi kokoh bagi tim.", shadow: "Kaku terhadap perubahan, terlalu konservatif, dan rentan terjebak dalam rutinitas kerja.", career: "Manajemen Keuangan, Analis Data, Insinyur Teknik, Auditor, atau Arsitek Operasional.", love: "Menunjukkan cinta lewat aksi nyata, keamanan finansial, serta komitmen jangka panjang stabilitas." },
    5: { title: "Sang Agen Perubahan (The Visionary)", strengths: "Adaptif, dinamis, magnetis, menyukai kebebasan, dan pemecah masalah instan.", shadow: "Mudah gelisah jika monoton, impulsif, dan cenderung lari dari komitmen rutin.", career: "Stratejik Marketing, Jurnalis Lapangan, Event Organizer, Sektor Startup, atau Penjelajah Bisnis.", love: "Membutuhkan pasangan yang tidak posesif, dinamis, dan siap diajak bertualang kapan saja." },
    6: { title: "Sang Pelindung & Pengasuh (The Nurturer)", strengths: "Bertanggung jawab, penuh empati, protektif, idealis, dan penyejuk batin.", shadow: "Cenderung mencampuri urusan orang lain karena terlalu khawatir, sulit berkata 'tidak'.", career: "Sektor Kesehatan, Pendidikan, Manajemen Hospitaliti, Pekerja Sosial, atau Konsultan SDM.", love: "Cinta total tanpa pamrih. Rumah tangga yang harmonis dan aman adalah prioritas tertinggi jiwanya." },
    7: { title: "Sang Analis Filosofis (The Seeker)", strengths: "Analitis mendalam, memiliki intuisi spiritual tajam, pemikir independen, pencari fakta sahih.", shadow: "Skeptis berlebihan, tertutup, dingin di permukaan, dan rawan terisolasi sosial.", career: "Riset Akademis, Programmer Backend, Strategi Intelijen, Investigasi, atau Analis Risiko.", love: "Mencari koneksi tingkat intelektual dan spiritual yang dalam. Butuh waktu menyendiri secara reguler." },
    8: { title: "Sang Eksekutor Finansial (The Maverick)", strengths: "Ambisius, berwibawa, cerdas mengelola kapital, memiliki daya tahan mental luar biasa.", shadow: "Workaholic ekstrem, cenderung mendominasi, mengukur segala hal dari sudut pandang materi.", career: "Direktur Keuangan, Pengusaha Skala Besar, Manajemen Investasi, atau Perbankan Korporasi.", love: "Menginginkan mitra strategis yang setara dalam mendukung ambisi karir dan kestabilan status sosial." },
    9: { title: "Sang Filantropis Global (The Humanitarian)", strengths: "Welas asih luas, idealis, pemaaf, berpikiran terbuka, dan berorientasi dampak sosial.", shadow: "Terlalu emosional, mudah kecewa pada realitas dunia, mengabaikan kebutuhan diri sendiri.", career: "Pemimpin Organisasi Non-Profit, Aktivis Lingkungan, Penulis Buku Filsafat, Seni, atau Edukator.", love: "Mencintai secara universal, mendambakan pasangan yang memiliki jiwa sosial tinggi dan berwawasan luas." },
    11: { title: "Sang Visioner Spiritual (The Intuitive Leader)", strengths: "Intuisi tingkat tinggi, karisma spiritual magnetis, mampu menginspirasi jutaan orang.", shadow: "Kecemasan akut, rentan stres akibat menyerap energi sekitar, ekspektasi terlalu ekstrem.", career: "Motivator Makro, Konselor Spiritual, Guru Besar, Penulis Pemikiran Disruptif, Inovator Global.", love: "Membutuhkan kestabilan emosional mutlak dari pasangan untuk menyeimbangkan badai intuisi batinnya." },
    22: { title: "Sang Arsitek Semesta (The Master Builder)", strengths: "Mampu mengubah visi abstrak raksasa menjadi realitas fisik yang nyata dan masif.", shadow: "Beban batin luar biasa berat, rawan depresi operasional jika proyek tersendat.", career: "Pembangun Infrastruktur, Founder Konglomerasi, Perencana Kota, Pengembang Teknologi Global.", love: "Membutuhkan pasangan dengan ketahanan mental baja yang siap mendukung misi hidup raksasanya." },
    33: { title: "Sang Guru Agung (The Master Teacher)", strengths: "Emanasi kasih sayang universal murni dikombinasikan dengan kemampuan mendidik yang tinggi.", shadow: "Beban tanggung jawab emosional berlebih, cenderung memikul penderitaan orang lain.", career: "Edukatator Global, Penulis Buku Pencerahan Batin, Pemimpin Gerakan Kemanusiaan Internasional.", love: "Cinta yang sakral dan penuh kedamaian. Pasangan harus siap menjadi pilar pendukung moral." }
  },
  en: {
    1: { title: "The Pioneer", strengths: "Independent, driven, innovative, risk-taker, full of initiative.", shadow: "Egocentric, stubborn, dislikes being managed, can be impatient.", career: "Optimal as Entrepreneur, CEO, Project Leader, or Independent Consultant.", love: "Seeks an independent partner who respects plenty of maneuvering space." },
    2: { title: "The Peacemaker", strengths: "Diplomatic, intuitive, sensitive, cooperative, excellent at mediation.", shadow: "Overly sensitive, extreme conflict-avoider, prone to people-pleasing.", career: "Excels in International Relations, Counselor, Psychologist, HR, or Systems Admin.", love: "Craves inner peace, gentle love, and two-way verbal communication." },
    3: { title: "The Expressor", strengths: "Expressive, charismatic, witty, imaginative, master communicator.", shadow: "Lack of focus, emotional instability, scatters energy too widely.", career: "Creative Industry, Public Relations (PR), Author, Digital Marketing, or Entertainer.", love: "Needs an exciting, humorous partner who can embrace wild and deep ideas." },
    4: { title: "The Builder", strengths: "Systematic, methodical, highly disciplined, reliable, a solid foundation.", shadow: "Rigid to change, overly conservative, prone to work routines.", career: "Financial Management, Data Analyst, Engineering, Auditor, or Operations Architect.", love: "Shows love through real actions, financial security, and long-term commitment." },
    5: { title: "The Visionary", strengths: "Adaptive, dynamic, magnetic, liberty-loving, instant problem solver.", shadow: "Restless under monotony, impulsive, prone to escaping routine commitment.", career: "Strategic Marketing, Field Journalist, Event Organizer, Startup Sector, or Biz Explorer.", love: "Requires a non-possessive, dynamic partner who is always ready for a prompt adventure." },
    6: { title: "The Nurturer", strengths: "Responsible, empathetic, protective, idealistic, soothing presence.", shadow: "Interfering due to over-worry, struggles to say 'no'.", career: "Healthcare Sector, Education, Hospitality Management, Social Work, or HR Consultant.", love: "Total unconditional love. A harmonious and safe household is the highest priority." },
    7: { title: "The Seeker", strengths: "Deeply analytical, sharp spiritual intuition, independent thinker, fact finder.", shadow: "Overly skeptical, secretive, cold on the surface, prone to social isolation.", career: "Academic Research, Backend Programmer, Intelligence Strategy, Investigation, or Risk Analyst.", love: "Seeks deep intellectual and spiritual connection. Requires regular solo time." },
    8: { title: "The Maverick", strengths: "Ambitious, authoritative, smart capital manager, remarkable mental resilience.", shadow: "Extreme workaholic, dominant tendency, measures things purely by material metrics.", career: "CFO, Large-Scale Entrepreneur, Investment Management, or Corporate Banking.", love: "Wants an equal strategic partner to support career ambitions and social status." },
    9: { title: "The Humanitarian", strengths: "Broad compassion, idealistic, forgiving, open-minded, impact-oriented.", shadow: "Overly emotional, easily disappointed by world realities, neglects self-needs.", career: "NGO Leader, Environmental Activist, Philosophy Writer, Arts, or Educator.", love: "Loves universally, craves a partner with high social awareness and broad vision." },
    11: { title: "The Intuitive Leader", strengths: "High-level intuition, magnetic spiritual charisma, able to inspire millions.", shadow: "Acute anxiety, absorbs surrounding stress easily, overly extreme expectations.", career: "Macro Motivator, Spiritual Counselor, Professor, Disruptive Thinker, Global Innovator.", love: "Needs absolute emotional stability from a partner to balance internal intuitive storms." },
    22: { title: "The Master Builder", strengths: "Able to turn giant abstract visions into concrete, massive physical realities.", shadow: "Extremely heavy internal burden, prone to operational depression if stalled.", career: "Infrastructure Builder, Conglomerate Founder, City Planner, Global Tech Developer.", love: "Requires a partner with iron mental resilience to support their giant life mission." },
    33: { title: "The Master Teacher", strengths: "Pure universal compassion combined with top-tier educational mastery.", shadow: "Excessive emotional responsibility burden, tends to carry others' suffering.", career: "Global Educator, Spiritual Author, International Humanitarian Leader.", love: "Sacred and peaceful love. Partner must be ready to serve as a strong moral pillar." }
  },
  es: {
    1: { title: "El Pionero", strengths: "Independiente, motivado, innovador, arriesgado, lleno de iniciativa.", shadow: "Egocéntrico, testarudo, no le gusta que lo dirijan, impaciente.", career: "Óptimo como Emprendedor, CEO, Líder de Proyectos o Consultor Independiente.", love: "Busca una pareja independiente que respete el espacio de maniobra." },
    2: { title: "El Pacificador", strengths: "Diplomático, intuitivo, sensible, cooperativo, excelente mediador.", shadow: "Hipersensible, evita conflictos extremos, propenso a complacer a todos.", career: "Relaciones Internacionales, Consejero, Psicólogo, RRHH o Admin de Sistemas.", love: "Anhela la paz interior, el amor tierno y la comunicación verbal bidireccional." },
    3: { title: "El Comunicador", strengths: "Expresivo, carismático, ingenioso, imaginativo, maestro de la comunicación.", shadow: "Falta de enfoque, inestabilidad emocional, dispersa demasiado la energía.", career: "Industria Creativa, Relaciones Públicas, Autor, Marketing Digital o Entretenimiento.", love: "Necesita una pareja emocionante y divertida que comparta ideas locas y profundas." },
    4: { title: "El Constructor", strengths: "Sistemático, metódico, muy disciplinado, confiable, base sólida.", shadow: "Rígido al cambio, demasiado conservador, propenso a rutinas de trabajo.", career: "Gestión Financiera, Analista de Datos, Ingeniería, Auditor u Arquitecto de Operaciones.", love: "Muestra amor con acciones reales, seguridad financiera y compromiso a largo plazo." },
    5: { title: "El Aventurero", strengths: "Adaptable, dinámico, magnético, amante de la libertad, solucionador instantáneo.", shadow: "Inquieto bajo monotonía, impulsivo, propenso a escapar del compromiso rutinario.", career: "Marketing Estratégico, Periodista, Organizador de Eventos o Explorador de Negocios.", love: "Requiere una pareja no posesiva y dinámica, lista para la aventura en cualquier momento." },
    6: { title: "El Protector", strengths: "Responsable, empático, protector, idealista, presencia calmante.", shadow: "Interferir por exceso de preocupación, lucha por decir 'no'.", career: "Sector Salud, Educación, Gestión Hotelera, Trabajo Social o Consultor de RRHH.", love: "Amor total incondicional. Un hogar armonioso y seguro es su máxima prioridad." },
    7: { title: "El Filósofo", strengths: "Profundamente analítico, intuición espiritual aguda, pensador independiente.", shadow: "Excesivamente escéptico, reservado, frío en la superficie, aislamiento social.", career: "Investigación Académica, Programador Backend, Estrategia de Inteligencia o Analista de Riesgos.", love: "Busca una conexión intelectual y espiritual profunda. Requiere tiempo a solas regular." },
    8: { title: "El Ejecutivo", strengths: "Ambicioso, autoritario, gestor de capital inteligente, resiliencia mental.", shadow: "Adicta al trabajo, tendencia dominante, mide todo por métricas materiales.", career: "Director Financiero, Emprendedor a Gran Escala, Gestión de Inversiones o Banca.", love: "Quiere un socio estratégico igualitario para apoyar ambiciones profesionales y estatus." },
    9: { title: "El Humanitario", strengths: "Amplia compasión, idealista, indulgente, de mente abierta, orientado al impacto.", shadow: "Demasiado emocional, se decepciona con la realidad, descuida necesidades propias.", career: "Líder de ONG, Activista Ambiental, Escritor de Filosofía, Artes o Educador.", love: "Ama universalmente, anhela una pareja con alta conciencia social y visión amplia." },
    11: { title: "El Iluminador Intuitivo", strengths: "Intuición de alto nivel, carisma espiritual, capaz de inspirar a millones.", shadow: "Ansiedad aguda, absorbe el estrés circundante, expectativas extremas.", career: "Motivador, Consejero Espiritual, Profesor, Pensador Disruptivo, Innovador Global.", love: "Necesita estabilidad emocional absoluta de su pareja para equilibrar tormentas intuitivas." },
    22: { title: "El Maestro Constructor", strengths: "Capaz de convertir visiones abstractas gigantes en realidades físicas masivas.", shadow: "Carga interna pesada, propenso a depresión operativa si se estanca.", career: "Constructor de Infraestructura, Fundador de Conglomerados, Planificador Urbano.", love: "Requiere una pareja con resiliencia mental de hierro para apoyar su gran misión de vida." },
    33: { title: "El Maestro Guía", strengths: "Pura compasión universal combinada con maestría educativa superior.", shadow: "Carga excesiva de responsabilidad emocional, tiende a cargar con el sufrimiento ajeno.", career: "Educador Global, Autor Espiritual, Líder Humanitario Internacional.", love: "Amor sagrado y pacífico. La pareja debe servir como un fuerte pilar moral." }
  }
};

// ========== MAIN COMPONENT ==========
export default function Numerology() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = UI_DICTIONARY[lang] || UI_DICTIONARY["id"];
  const database = NUMEROLOGY_DATA_ML[lang] || NUMEROLOGY_DATA_ML["id"];

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [finalResult, setFinalResult] = useState<number | null>(null);

  // Core Algoritma: Menghitung Angka Ekspresi Berdasarkan Nilai Huruf Pythagorean
  const calculateExpressionNumber = (nameStr: string): number => {
    // Sanitisasi: Hanya ambil karakter alfabet A-Z dalam format uppercase
    const cleanName = nameStr.toUpperCase().replace(/[^A-Z]/g, "");
    let total = 0;

    for (let i = 0; i < cleanName.length; i++) {
      total += LETTER_VALUES[cleanName[i]] || 0;
    }

    // Fungsi rekursif reduksi angka (menjaga Master Numbers 11, 22, 33)
    const reduceNum = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      if (num > 9) {
        const next = String(num).split("").map(Number).reduce((a, b) => a + b, 0);
        return reduceNum(next);
      }
      return num;
    };

    return reduceNum(total);
  };

  const handleCalculate = () => {
    if (!fullName.trim()) return;
    setLoading(true);
    setAnalyzed(false);
    
    setTimeout(() => {
      const result = calculateExpressionNumber(fullName);
      setFinalResult(result);
      setAnalyzed(true);
      setLoading(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (!finalResult || !database[finalResult]) return;
    const data = database[finalResult];
    const text = `${dict.title}: ${dict.labels.expressionNum} ${finalResult} - ${data.title}\n\n${dict.labels.strengths}: ${data.strengths}\n${dict.labels.career}: ${data.career}\n\n${dict.labels.quote}`;
    
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
        console.error("Clipboard access failed", err);
      }
    }
  };

  const currentResultData = useMemo(() => {
    if (finalResult === null) return null;
    return database[finalResult] || null;
  }, [finalResult, database]);

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🔢✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto leading-relaxed">{dict.subtitle}</p>
        {analyzed && finalResult && (
          <button
            onClick={handleShare}
            className="absolute right-0 top-0 md:relative md:mt-3 inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition"
          >
            📤 {dict.shareBtn}
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-2">
          <label className="text-purple-300 text-xs font-bold px-1 uppercase tracking-widest">
            {dict.inputs.nameLabel}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={dict.inputs.placeholder}
            className="w-full bg-slate-900/60 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center font-semibold text-lg"
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading || !fullName.trim()}
          className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 font-black text-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25 active:scale-[0.99] hover:scale-[1.01]"
        >
          {loading ? dict.inputs.calculating : dict.inputs.calculate}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-16">
          <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !analyzed && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results Display */}
      {!loading && analyzed && finalResult && currentResultData && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="bg-gradient-to-br from-[#1c1226] to-[#0d0714] border border-purple-500/20 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="text-center mb-6 border-b border-purple-500/10 pb-6">
              <span className="text-[10px] text-purple-400 font-black tracking-widest uppercase block mb-1">
                {dict.labels.expressionNum}
              </span>
              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-orange-400 drop-shadow-md">
                {finalResult}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mt-2 text-white">
                {currentResultData.title}
              </h3>
            </div>

            {/* Grid Informasi Numerologi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-xl">
                <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span>✨</span> {dict.labels.strengths}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{currentResultData.strengths}</p>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-xl">
                <h4 className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span>⚠️</span> {dict.labels.shadow}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{currentResultData.shadow}</p>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-xl">
                <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  {dict.labels.career}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{currentResultData.career}</p>
              </div>

              <div className="bg-pink-500/5 border border-pink-500/10 p-5 rounded-xl">
                <h4 className="text-pink-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  {dict.labels.love}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{currentResultData.love}</p>
              </div>
            </div>

            {/* Quote Block */}
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
              <p className="text-purple-200 text-sm font-medium italic">"{dict.labels.quote}"</p>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-[10px] text-slate-500 pt-3 mt-4 opacity-70 border-t border-slate-800">
              {dict.labels.disclaimer}
            </div>

            {/* INJEKSI PAYWALL */}
            <PremiumPaywall 
              toolName={dict.title} 
              resultId={finalResult.toString()} 
            />

          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}