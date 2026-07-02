"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== STRICT INTERFACES (SCALABLE & TYPE-SAFE) ==========
interface NeptuData {
  watak: string; positif: string; negatif: string; rezeki: string;
  warna: string; elemen: string; hariBaik: string; hariNaas: string;
  pantangan: string; jodohIdeal: number[];
}

interface ArchetypeData {
  trait: string; // REFACTOR: Properti khusus untuk injeksi string yang aman
  title: string; desc: string; strength: string; weakness: string; hack: string;
}

interface ResultState {
  hari: string; pasaran: string; nilaiHari: number; nilaiPasaran: number; neptu: number;
  neptuData: NeptuData; hariArchetype: ArchetypeData; pasaranArchetype: ArchetypeData; synergy: string;
}

// ========== DATA HARI & PASARAN ==========
const HARI_LIST = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const HARI_NILAI: Record<string, number> = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 };
const PASARAN_NILAI: Record<string, number> = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };

// ========== KAMUS UI MULTI-BAHASA ==========
const UI_DICT: Record<string, any> = {
  id: {
    title: "Watak Kelahiran Primbon", subtitle: "Perpaduan Algoritma Numerologi Jawa & Psikologi Arketipe Modern",
    lblHari: "Hari Lahir", lblPasaran: "Pasaran Jawa", selHari: "Pilih Hari", selPasaran: "Pilih Pasaran",
    btnAnalyze: "🔮 Ekstrak Analisis Lengkap", btnLoading: "Menyinkronkan Data Komputasi...",
    loadText: "Analyzing Vectors...", intrinsic: "NILAI INTRINSIK",
    superpower: "✨ Superpower (Kekuatan)", blindspot: "⚠️ Blind Spot (Titik Buta)",
    rezeki: "🧭 Vektor Rezeki", warna: "🎨 Aura Warna", elemen: "🌿 Elemen Dasar", hariOptimal: "📅 Hari Optimal",
    mitigasi: "🛡️ Mitigasi Risiko (Pantangan)", sinergiJodoh: "🤝 Sinergi Relasi (Jodoh/Partner)",
    resonansi: "Resonansi terbaik dengan neptu:", dimensi: "🧩 Dimensi Psikologi Arketipe",
    pondasi: "Pondasi Karakter", katalis: "Katalis Insting", lifeHack: "Life-Hack:",
    footer: "*Interpretasi ini adalah peleburan filosofi siklus waktu Nusantara dengan kerangka kerja psikologi kepribadian modern. Gunakan sebagai alat introspeksi proaktif untuk pertumbuhan diri.",
    shareText: "🧬 Matriks Karakter Pribadi:"
  },
  en: {
    title: "Primbon Birth Character", subtitle: "Fusion of Javanese Numerology Algorithms & Modern Archetype Psychology",
    lblHari: "Day of Birth", lblPasaran: "Javanese Pasaran", selHari: "Select Day", selPasaran: "Select Pasaran",
    btnAnalyze: "🔮 Extract Full Analysis", btnLoading: "Synchronizing Computational Data...",
    loadText: "Analyzing Vectors...", intrinsic: "INTRINSIC VALUE",
    superpower: "✨ Superpower", blindspot: "⚠️ Blind Spot",
    rezeki: "🧭 Fortune Vector", warna: "🎨 Aura Color", elemen: "🌿 Base Element", hariOptimal: "📅 Optimal Days",
    mitigasi: "🛡️ Risk Mitigation (Taboos)", sinergiJodoh: "🤝 Relationship Synergy (Partner)",
    resonansi: "Best resonance with neptu:", dimensi: "🧩 Archetypal Psychology Dimension",
    pondasi: "Character Foundation", katalis: "Instinct Catalyst", lifeHack: "Life-Hack:",
    footer: "*This interpretation fuses the philosophy of the Archipelago's time cycles with modern personality psychology frameworks. Use as a proactive introspection tool for self-growth.",
    shareText: "🧬 Personal Character Matrix:"
  },
  es: {
    title: "Carácter de Nacimiento Primbon", subtitle: "Fusión de Algoritmos de Numerología Javanesa y Psicología Moderna",
    lblHari: "Día de Nacimiento", lblPasaran: "Pasaran Javanés", selHari: "Seleccionar Día", selPasaran: "Seleccionar Pasaran",
    btnAnalyze: "🔮 Extraer Análisis Completo", btnLoading: "Sincronizando Datos Computacionales...",
    loadText: "Analizando Vectores...", intrinsic: "VALOR INTRÍNSECO",
    superpower: "✨ Superpoder (Fortaleza)", blindspot: "⚠️ Punto Ciego (Debilidad)",
    rezeki: "🧭 Vector de Fortuna", warna: "🎨 Color de Aura", elemen: "🌿 Elemento Base", hariOptimal: "📅 Días Óptimos",
    mitigasi: "🛡️ Mitigación de Riesgos (Tabúes)", sinergiJodoh: "🤝 Sinergia de Relación (Pareja)",
    resonansi: "Mejor resonancia con neptu:", dimensi: "🧩 Dimensión Psicológica Arquetípica",
    pondasi: "Fundación del Carácter", katalis: "Catalizador de Instinto", lifeHack: "Life-Hack:",
    footer: "*Esta interpretación fusiona la filosofía de los ciclos de tiempo del Archipiélago con marcos de psicología moderna. Úselo como herramienta de introspección proactiva.",
    shareText: "🧬 Matriz de Carácter Personal:"
  }
};

// ==========================================
// DATABASE NEPTU: INDONESIA (ID)
// ==========================================
const NEPTU_ID: Record<number, NeptuData> = {
  7: { watak: "Sang Pengamat Senyap (Observan)", positif: "Kapasitas analisis tinggi, mampu membaca situasi dengan akurat, dan sangat bisa dipercaya memegang rahasia strategis.", negatif: "Cenderung membangun tembok emosional, terlalu independen hingga menolak bantuan, dan sering disalahpahami sebagai sosok arogan.", rezeki: "Utara & Timur Laut (Sektor Logika & Sistem)", warna: "Biru Tua (Fokus) & Putih (Kemurnian)", elemen: "Air Tenang", hariBaik: "Selasa, Kamis", hariNaas: "Sabtu", pantangan: "Jangan mengambil keputusan besar hanya mengandalkan logika tanpa memvalidasi intuisi Anda.", jodohIdeal: [11, 16, 9, 4] },
  8: { watak: "Sang Pondasi Kuat (Eksekutor)", positif: "Ketahanan mental yang luar biasa, disiplin bagai mesin, dan selalu menuntaskan apa yang telah dimulai.", negatif: "Rentan terjebak dalam micro-managing, kaku terhadap perubahan mendadak, dan mudah stres jika rencana melenceng.", rezeki: "Timur & Tenggara (Sektor Stabilitas & Real Estat)", warna: "Coklat (Bumi) & Hijau Tua (Pertumbuhan)", elemen: "Tanah Liat", hariBaik: "Senin, Rabu", hariNaas: "Minggu", pantangan: "Hindari berinvestasi pada hal yang tidak memiliki wujud fisik atau fundamental bisnis yang jelas.", jodohIdeal: [12, 8, 5, 13] },
  9: { watak: "Sang Pengelana Bebas (Katalisator)", positif: "Energi yang menular, kemampuan adaptasi instan di lingkungan baru, dan keberanian mengambil risiko yang terukur.", negatif: "Mudah bosan pada rutinitas (Shiny Object Syndrome), sering meninggalkan proyek di tengah jalan, dan kurang kalkulatif.", rezeki: "Selatan & Barat Daya (Sektor Jaringan & Ekspansi)", warna: "Kuning (Optimisme) & Oranye (Kreativitas)", elemen: "Api Terbuka", hariBaik: "Jumat, Minggu", hariNaas: "Selasa", pantangan: "Jangan meminjamkan uang atau aset berharga atas dasar 'rasa tidak enak' atau pertemanan semata.", jodohIdeal: [9, 14, 6, 11] },
  10: { watak: "Sang Penyeimbang Harmoni (Diplomat)", positif: "Kemampuan negosiasi tingkat tinggi, penengah konflik yang adil, dan pendengar yang empatik.", negatif: "Kesulitan membuat keputusan tegas karena terlalu mempertimbangkan perasaan semua pihak (decision fatigue).", rezeki: "Barat & Barat Laut (Sektor Komunikasi & Kemitraan)", warna: "Biru Langit (Ketenangan) & Putih (Kejelasan)", elemen: "Udara Bergerak", hariBaik: "Kamis, Sabtu", hariNaas: "Rabu", pantangan: "Jangan mengorbankan batasan pribadi Anda demi menyenangkan orang yang manipulatif.", jodohIdeal: [10, 15, 7, 12] },
  11: { watak: "Sang Visioner Empatik (Kreator)", positif: "Gagasan out-of-the-box, mampu menginspirasi massa, dan memiliki intuisi tajam membaca tren masa depan.", negatif: "Fluktuasi emosi yang ekstrem, rentan terhadap kritik, dan seringkali idenya terlalu maju sehingga sulit dieksekusi realitas.", rezeki: "Tenggara & Timur (Sektor Inovasi & Media)", warna: "Merah (Gairah) & Emas (Nilai Tinggi)", elemen: "Api Biru", hariBaik: "Senin, Kamis", hariNaas: "Jumat", pantangan: "Jangan mengeksekusi ide besar saat sedang dalam kondisi euforia atau burnout tingkat tinggi.", jodohIdeal: [13, 9, 4, 6] },
  12: { watak: "Sang Penyembuh Tulus (Caregiver)", positif: "Kapasitas empati tanpa batas, pembawa ketenangan dalam krisis, dan dedikasi tinggi pada orang terdekat.", negatif: "Sering melupakan kesejahteraan diri sendiri (Self-neglect), mudah dimanfaatkan, dan memendam amarah.", rezeki: "Barat Daya & Selatan (Sektor Layanan & Relasi)", warna: "Hijau Muda (Penyembuhan) & Putih", elemen: "Air Pegunungan", hariBaik: "Selasa, Sabtu", hariNaas: "Kamis", pantangan: "Berhenti mengatakan 'Ya' saat tubuh dan pikiran Anda secara jelas menuntut untuk beristirahat.", jodohIdeal: [12, 17, 8, 10] },
  13: { watak: "Sang Pelopor Dinamis (Inovator)", positif: "Sangat agile menghadapi masalah, otak terus mencari solusi efisien, tidak takut mendobrak tradisi.", negatif: "Terlalu impulsif, minim kesabaran terhadap orang yang lambat, dan cenderung argumentatif.", rezeki: "Timur & Utara (Sektor Teknologi & Perubahan)", warna: "Oranye (Dinamis) & Hitam (Ketegasan)", elemen: "Tanah Bergerak", hariBaik: "Minggu, Rabu", hariNaas: "Senin", pantangan: "Jangan meremehkan detail administratif atau legalitas hanya karena Anda ingin bergerak cepat.", jodohIdeal: [15, 11, 6, 8] },
  14: { watak: "Sang Pemimpin Berwibawa (Komandan)", positif: "Aura kepemimpinan alami, manajemen sumber daya efisien, fokus laser pada pencapaian target.", negatif: "Sering terjebak workaholic, kesulitan menunjukkan kerentanan (vulnerability), kurang toleran pada kegagalan.", rezeki: "Selatan & Tenggara (Sektor Skala & Kekuasaan)", warna: "Merah (Keberanian) & Hitam (Otoritas)", elemen: "Api Solid", hariBaik: "Selasa, Jumat", hariNaas: "Kamis", pantangan: "Jangan biarkan ambisi finansial mengorbankan kesehatan fisik jangka panjang Anda.", jodohIdeal: [16, 12, 7, 9] },
  15: { watak: "Sang Romantis Artistik (Seniman)", positif: "Melihat dunia dengan kacamata keindahan, peka terhadap nuansa, menerjemahkan emosi menjadi karya nyata.", negatif: "Terlalu perfeksionis secara estetika, cenderung menghindari realitas pahit (escapism), rentan cemas.", rezeki: "Barat & Timur Laut (Sektor Kreatif & Hiburan)", warna: "Ungu (Spiritualitas) & Perak (Intuisi)", elemen: "Air Laut", hariBaik: "Rabu, Sabtu", hariNaas: "Selasa", pantangan: "Jangan memendam kekecewaan. Komunikasikan batasan Anda dengan jelas sebelum menjadi bom waktu.", jodohIdeal: [17, 13, 8, 10] },
  16: { watak: "Sang Penasihat Bijak (Filsuf)", positif: "Pemikir strategis jangka panjang, objektif menilai masalah, tempat orang mencari pencerahan.", negatif: "Kecenderungan mengisolasi diri, overthinking hingga menunda aksi, sering merasa teralienasi.", rezeki: "Timur Laut & Utara (Sektor Pengetahuan & Institusi)", warna: "Hitam (Kedalaman) & Abu-abu (Kenetralan)", elemen: "Batu Karang", hariBaik: "Kamis, Minggu", hariNaas: "Jumat", pantangan: "Keluar dari kepala Anda. Jangan biarkan ide brilian hanya membusuk di otak tanpa dieksekusi di dunia nyata.", jodohIdeal: [18, 14, 9, 11] },
  17: { watak: "Sang Penakluk Tantangan (Maverick)", positif: "Kharisma intimidatif namun dihormati, pelindung bagi yang lemah, berani mengambil keputusan tidak populer.", negatif: "Ego sangat kuat, otoriter jika dibantah, kesulitan mengakui kesalahan secara terbuka.", rezeki: "Selatan & Barat Daya (Sektor Kepemimpinan & Bisnis High-Risk)", warna: "Merah (Dominasi) & Emas (Kejayaan)", elemen: "Api Lahar", hariBaik: "Senin, Selasa", hariNaas: "Minggu", pantangan: "Jangan menggunakan amarah sebagai alat kendali utama. Kekuatan sejati ada pada ketenangan pikiran.", jodohIdeal: [13, 9, 6, 10] },
  18: { watak: "Sang Altruis Paripurna (Idealist)", positif: "Dedikasi total pada kebaikan komunitas, berprinsip teguh, memancarkan aura kebijaksanaan meneduhkan.", negatif: "Terlalu memikul beban dunia, sering kecewa karena ekspektasi moral tinggi tidak terpenuhi orang lain.", rezeki: "Barat Laut & Barat (Sektor Kemanusiaan & Dampak Sosial)", warna: "Hijau (Kehidupan) & Coklat (Kestabilan)", elemen: "Air Kehidupan", hariBaik: "Rabu, Jumat", hariNaas: "Sabtu", pantangan: "Ingat prinsip pesawat terbang: Pakai masker oksigen Anda sendiri terlebih dahulu sebelum menolong orang lain.", jodohIdeal: [14, 10, 7, 9] }
};

// ==========================================
// DATABASE NEPTU: INGGRIS (EN)
// ==========================================
const NEPTU_EN: Record<number, NeptuData> = {
  7: { watak: "The Silent Observer", positif: "High analytical capacity, accurately reads situations, and highly trusted with strategic secrets.", negatif: "Tends to build emotional walls, overly independent refusing help, often misunderstood as arrogant.", rezeki: "North & Northeast (Logic & System Sector)", warna: "Dark Blue (Focus) & White (Purity)", elemen: "Calm Water", hariBaik: "Tuesday, Thursday", hariNaas: "Saturday", pantangan: "Do not make major decisions relying solely on logic without validating your intuition.", jodohIdeal: [11, 16, 9, 4] },
  8: { watak: "The Strong Foundation (Executor)", positif: "Exceptional mental endurance, machine-like discipline, and always finishes what is started.", negatif: "Prone to micro-managing, rigid against sudden changes, and easily stressed if plans derail.", rezeki: "East & Southeast (Stability & Real Estate Sector)", warna: "Brown (Earth) & Dark Green (Growth)", elemen: "Clay", hariBaik: "Monday, Wednesday", hariNaas: "Sunday", pantangan: "Avoid investing in things lacking physical form or clear business fundamentals.", jodohIdeal: [12, 8, 5, 13] },
  9: { watak: "The Free Wanderer (Catalyst)", positif: "Contagious energy, instant adaptability in new environments, and courage to take calculated risks.", negatif: "Easily bored by routines (Shiny Object Syndrome), often leaves projects midway, lacks calculation.", rezeki: "South & Southwest (Network & Expansion Sector)", warna: "Yellow (Optimism) & Orange (Creativity)", elemen: "Open Fire", hariBaik: "Friday, Sunday", hariNaas: "Tuesday", pantangan: "Do not lend money or valuable assets purely out of guilt or friendship.", jodohIdeal: [9, 14, 6, 11] },
  10: { watak: "The Harmony Balancer (Diplomat)", positif: "High-level negotiation skills, a fair conflict mediator, and an empathetic listener.", negatif: "Difficulty making firm decisions due to over-considering everyone's feelings (decision fatigue).", rezeki: "West & Northwest (Communication & Partnership Sector)", warna: "Sky Blue (Calmness) & White (Clarity)", elemen: "Moving Air", hariBaik: "Thursday, Saturday", hariNaas: "Wednesday", pantangan: "Do not sacrifice your personal boundaries to please manipulative people.", jodohIdeal: [10, 15, 7, 12] },
  11: { watak: "The Empathetic Visionary (Creator)", positif: "Out-of-the-box ideas, able to inspire masses, and has sharp intuition in reading future trends.", negatif: "Extreme emotional fluctuations, vulnerable to criticism, and ideas are often too advanced to execute.", rezeki: "Southeast & East (Innovation & Media Sector)", warna: "Red (Passion) & Gold (High Value)", elemen: "Blue Fire", hariBaik: "Monday, Thursday", hariNaas: "Friday", pantangan: "Do not execute big ideas while in a state of euphoria or high-level burnout.", jodohIdeal: [13, 9, 4, 6] },
  12: { watak: "The Sincere Healer (Caregiver)", positif: "Limitless empathy capacity, a bringer of calm in crises, and highly dedicated to loved ones.", negatif: "Often forgets self-care (Self-neglect), easily exploited by energy vampires, and suppresses anger.", rezeki: "Southwest & South (Service & Relation Sector)", warna: "Light Green (Healing) & White", elemen: "Mountain Water", hariBaik: "Tuesday, Saturday", hariNaas: "Thursday", pantangan: "Stop saying 'Yes' when your body and mind clearly demand rest.", jodohIdeal: [12, 17, 8, 10] },
  13: { watak: "The Dynamic Pioneer (Innovator)", positif: "Highly agile in facing problems, brain constantly seeks efficient solutions, unafraid to break tradition.", negatif: "Too impulsive, zero patience for slow people, and tends to be argumentative if feeling right.", rezeki: "East & North (Technology & Change Sector)", warna: "Orange (Dynamic) & Black (Firmness)", elemen: "Moving Earth", hariBaik: "Sunday, Wednesday", hariNaas: "Monday", pantangan: "Do not underestimate administrative or legal details just because you want to move fast.", jodohIdeal: [15, 11, 6, 8] },
  14: { watak: "The Authoritative Leader (Commander)", positif: "Natural leadership aura, efficient resource management, and laser focus on achieving targets.", negatif: "Often trapped as a workaholic, difficulty showing vulnerability, and intolerant of subordinates' failures.", rezeki: "South & Southeast (Scale & Power Sector)", warna: "Red (Courage) & Black (Authority)", elemen: "Solid Fire", hariBaik: "Tuesday, Friday", hariNaas: "Thursday", pantangan: "Do not let financial ambition sacrifice your long-term physical health.", jodohIdeal: [16, 12, 7, 9] },
  15: { watak: "The Artistic Romantic (Artist)", positif: "Sees the world through the lens of beauty, sensitive to nuances, translates emotions into tangible works.", negatif: "Too aesthetically perfectionist, tends to avoid bitter reality (escapism), and prone to anxiety.", rezeki: "West & Northeast (Creative & Entertainment Sector)", warna: "Purple (Spirituality) & Silver (Intuition)", elemen: "Sea Water", hariBaik: "Wednesday, Saturday", hariNaas: "Tuesday", pantangan: "Do not bottle up disappointment. Communicate your boundaries clearly before they become a ticking bomb.", jodohIdeal: [17, 13, 8, 10] },
  16: { watak: "The Wise Advisor (Philosopher)", positif: "Long-term strategic thinker, objective in assessing problems, a source of enlightenment for others.", negatif: "Tendency to isolate, overthinking leading to delayed action, often feels alienated from society.", rezeki: "Northeast & North (Knowledge & Institution Sector)", warna: "Black (Depth) & Gray (Neutrality)", elemen: "Bedrock", hariBaik: "Thursday, Sunday", hariNaas: "Friday", pantangan: "Get out of your head. Don't let brilliant ideas rot in your brain without real-world execution.", jodohIdeal: [18, 14, 9, 11] },
  17: { watak: "The Challenge Conqueror (Maverick)", positif: "Intimidating yet respected charisma, protector of the weak, dares to make highly unpopular decisions.", negatif: "Extremely strong ego, authoritarian when contradicted, difficulty admitting mistakes openly.", rezeki: "South & Southwest (Leadership & High-Risk Business Sector)", warna: "Red (Dominance) & Gold (Glory)", elemen: "Lava Fire", hariBaik: "Monday, Tuesday", hariNaas: "Sunday", pantangan: "Do not use anger as a primary control tool. True strength lies in peace of mind.", jodohIdeal: [13, 9, 6, 10] },
  18: { watak: "The Supreme Altruist (Idealist)", positif: "Total dedication to community welfare, strongly principled, radiates a calming aura of wisdom.", negatif: "Carries the weight of the world, often disappointed because high moral expectations aren't met by others.", rezeki: "Northwest & West (Humanitarian & Social Impact Sector)", warna: "Green (Life) & Brown (Stability)", elemen: "Water of Life", hariBaik: "Wednesday, Friday", hariNaas: "Saturday", pantangan: "Remember the airplane principle: Put on your own oxygen mask first before helping others.", jodohIdeal: [14, 10, 7, 9] }
};
// ==========================================
// DATABASE NEPTU: SPANYOL (ES)
// ==========================================
const NEPTU_ES: Record<number, NeptuData> = {
  7: { watak: "El Observador Silencioso", positif: "Alta capacidad analítica, lee situaciones con precisión y es muy confiable con secretos estratégicos.", negatif: "Tiende a construir muros emocionales, excesivamente independiente rechazando ayuda, a menudo malinterpretado como arrogante.", rezeki: "Norte y Noreste (Sector de Lógica y Sistemas)", warna: "Azul Oscuro (Enfoque) y Blanco (Pureza)", elemen: "Agua Tranquila", hariBaik: "Martes, Jueves", hariNaas: "Sábado", pantangan: "No tome decisiones importantes basándose únicamente en la lógica sin validar su intuición.", jodohIdeal: [11, 16, 9, 4] },
  8: { watak: "La Fundación Fuerte (Ejecutor)", positif: "Resistencia mental excepcional, disciplina de máquina y siempre termina lo que comienza.", negatif: "Propenso a la microgestión, rígido ante cambios repentinos y se estresa fácilmente si los planes se desvían.", rezeki: "Este y Sureste (Sector de Estabilidad y Bienes Raíces)", warna: "Marrón (Tierra) y Verde Oscuro (Crecimiento)", elemen: "Arcilla", hariBaik: "Lunes, Miércoles", hariNaas: "Domingo", pantangan: "Evite invertir en cosas que carezcan de forma física o fundamentos comerciales claros.", jodohIdeal: [12, 8, 5, 13] },
  9: { watak: "El Caminante Libre (Catalizador)", positif: "Energía contagiosa, adaptabilidad instantánea en nuevos entornos y coraje para tomar riesgos calculados.", negatif: "Se aburre fácilmente de las rutinas (Síndrome del Objeto Brillante), a menudo deja proyectos a medias, carece de cálculo.", rezeki: "Sur y Suroeste (Sector de Redes y Expansión)", warna: "Amarillo (Optimismo) y Naranja (Creatividad)", elemen: "Fuego Abierto", hariBaik: "Viernes, Domingo", hariNaas: "Martes", pantangan: "No preste dinero ni bienes valiosos puramente por culpa o amistad.", jodohIdeal: [9, 14, 6, 11] },
  10: { watak: "El Equilibrador de Armonía (Diplomático)", positif: "Habilidades de negociación de alto nivel, un mediador de conflictos justo y un oyente empático.", negatif: "Dificultad para tomar decisiones firmes debido a que considera demasiado los sentimientos de todos (fatiga de decisión).", rezeki: "Oeste y Noroeste (Sector de Comunicación y Asociación)", warna: "Azul Cielo (Calma) y Blanco (Claridad)", elemen: "Aire en Movimiento", hariBaik: "Jueves, Sábado", hariNaas: "Miércoles", pantangan: "No sacrifique sus límites personales para complacer a personas manipuladoras.", jodohIdeal: [10, 15, 7, 12] },
  11: { watak: "El Visionario Empático (Creador)", positif: "Ideas innovadoras, capaz de inspirar a las masas y tiene una aguda intuición para leer las tendencias futuras.", negatif: "Fluctuaciones emocionales extremas, vulnerable a las críticas y las ideas a menudo son demasiado avanzadas para ejecutarse.", rezeki: "Sureste y Este (Sector de Innovación y Medios)", warna: "Rojo (Pasión) y Oro (Alto Valor)", elemen: "Fuego Azul", hariBaik: "Lunes, Jueves", hariNaas: "Viernes", pantangan: "No ejecute grandes ideas mientras se encuentre en estado de euforia o agotamiento extremo.", jodohIdeal: [13, 9, 4, 6] },
  12: { watak: "El Sanador Sincero (Cuidador)", positif: "Capacidad de empatía ilimitada, portador de calma en las crisis y muy dedicado a sus seres queridos.", negatif: "A menudo olvida el autocuidado (Auto-negligencia), es fácilmente explotado por vampiros de energía y reprime la ira.", rezeki: "Suroeste y Sur (Sector de Servicio y Relación)", warna: "Verde Claro (Sanación) y Blanco", elemen: "Agua de Montaña", hariBaik: "Martes, Sábado", hariNaas: "Jueves", pantangan: "Deje de decir 'Sí' cuando su cuerpo y su mente claramente exigen descanso.", jodohIdeal: [12, 17, 8, 10] },
  13: { watak: "El Pionero Dinámico (Innovador)", positif: "Muy ágil para enfrentar problemas, el cerebro busca constantemente soluciones eficientes, no teme romper la tradición.", negatif: "Demasiado impulsivo, cero paciencia para las personas lentas y tiende a ser argumentativo si se siente en lo correcto.", rezeki: "Este y Norte (Sector de Tecnología y Cambio)", warna: "Naranja (Dinámico) y Negro (Firmeza)", elemen: "Tierra en Movimiento", hariBaik: "Domingo, Miércoles", hariNaas: "Lunes", pantangan: "No subestime los detalles administrativos o legales solo porque quiere moverse rápido.", jodohIdeal: [15, 11, 6, 8] },
  14: { watak: "El Líder Autoritativo (Comandante)", positif: "Aura de liderazgo natural, gestión eficiente de recursos y enfoque láser en el logro de objetivos.", negatif: "A menudo atrapado como adicto al trabajo, dificultad para mostrar vulnerabilidad e intolerante a los fracasos de los subordinados.", rezeki: "Sur y Sureste (Sector de Escala y Poder)", warna: "Rojo (Coraje) y Negro (Autoridad)", elemen: "Fuego Sólido", hariBaik: "Martes, Viernes", hariNaas: "Jueves", pantangan: "No permita que la ambición financiera sacrifique su salud física a largo plazo.", jodohIdeal: [16, 12, 7, 9] },
  15: { watak: "El Romántico Artístico (Artista)", positif: "Ve el mundo a través del lente de la belleza, sensible a los matices, traduce emociones en obras tangibles.", negatif: "Estéticamente demasiado perfeccionista, tiende a evitar la amarga realidad (escapismo) y es propenso a la ansiedad.", rezeki: "Oeste y Noreste (Sector Creativo y de Entretenimiento)", warna: "Púrpura (Espiritualidad) y Plata (Intuición)", elemen: "Agua de Mar", hariBaik: "Miércoles, Sábado", hariNaas: "Martes", pantangan: "No embotelle la decepción. Comunique sus límites claramente antes de que se conviertan en una bomba de tiempo.", jodohIdeal: [17, 13, 8, 10] },
  16: { watak: "El Consejero Sabio (Filósofo)", positif: "Pensador estratégico a largo plazo, objetivo al evaluar problemas, una fuente de iluminación para otros.", negatif: "Tendencia a aislarse, pensar demasiado lleva a la inacción, a menudo se siente alienado de la sociedad.", rezeki: "Noreste y Norte (Sector de Conocimiento e Institución)", warna: "Negro (Profundidad) y Gris (Neutralidad)", elemen: "Roca Base", hariBaik: "Jueves, Domingo", hariNaas: "Viernes", pantangan: "Salga de su cabeza. No deje que las ideas brillantes se pudran en su cerebro sin ejecución real.", jodohIdeal: [18, 14, 9, 11] },
  17: { watak: "El Conquistador de Desafíos (Maverick)", positif: "Carisma intimidante pero respetado, protector de los débiles, se atreve a tomar decisiones muy impopulares.", negatif: "Ego extremadamente fuerte, autoritario cuando se le contradice, dificultad para admitir errores abiertamente.", rezeki: "Sur y Suroeste (Sector de Liderazgo y Negocios de Alto Riesgo)", warna: "Rojo (Dominancia) y Oro (Gloria)", elemen: "Fuego de Lava", hariBaik: "Lunes, Martes", hariNaas: "Domingo", pantangan: "No utilice la ira como principal herramienta de control. La verdadera fuerza radica en la paz mental.", jodohIdeal: [13, 9, 6, 10] },
  18: { watak: "El Altruista Supremo (Idealista)", positif: "Dedicación total al bienestar de la comunidad, de principios sólidos, irradia un aura de sabiduría.", negatif: "Lleva el peso del mundo, a menudo decepcionado porque los demás no cumplen sus altas expectativas morales.", rezeki: "Noroeste y Oeste (Sector de Impacto Social y Humanitario)", warna: "Verde (Vida) y Marrón (Estabilidad)", elemen: "Agua de Vida", hariBaik: "Miércoles, Viernes", hariNaas: "Sábado", pantangan: "Recuerde el principio del avión: póngase su propia máscara de oxígeno antes de ayudar a los demás.", jodohIdeal: [14, 10, 7, 9] }
};

// ==========================================
// DATABASE ARKETIPE HARI (ID, EN, ES)
// (Note: Keys tetap menggunakan bahasa Indonesia agar sinkron dengan dropdown)
// ==========================================
const DAY_ARCHETYPE_ID: Record<string, ArchetypeData> = {
  Senin: {
    trait: "empati dan kapasitas sensorik emosional",
    title: "Empati & Intuitif", desc: "Merepresentasikan empati murni dan kapasitas sensorik emosional. Anda berfungsi sebagai radar yang mendeteksi atmosfer ruangan.",
    strength: "Pendengar aktif level tinggi, Kecerdasan Emosional (EQ) superior, mudah diterima di lingkaran sosial manapun.", weakness: "Sindrom People-pleaser, menguras energi demi orang lain, dan mood swing akibat menyerap beban lingkungan.",
    hack: "Audit energi Anda. Pelajari seni berkata 'TIDAK' secara elegan dan jadwalkan waktu 'me-time' tanpa kompromi."
  },
  Selasa: {
    trait: "kecepatan akselerasi dan pendobrakan batasan",
    title: "Petarung & Ambisius", desc: "Akselerator alami. Anda terlahir dengan mesin ber-cc besar yang dirancang untuk inisiasi dan pendobrakan batasan.",
    strength: "Persistensi tanpa ampun, berani mengambil langkah saat yang lain ragu, dan kapabilitas kepemimpinan krisis.", weakness: "Sumbu pendek, intoleran pada proses yang lambat, dan cenderung mengambil keputusan berdasarkan lonjakan adrenalin.",
    hack: "Praktikkan jeda taktis. Gunakan aturan 24 jam sebelum bereaksi terhadap provokasi atau mengambil komitmen finansial besar."
  },
  Rabu: {
    trait: "pengolahan informasi dan pemecahan pola rumit",
    title: "Komunikator & Logis", desc: "Arsitek informasi. Otak Anda bekerja layaknya superkomputer yang memilah probabilitas dan memecahkan pola yang rumit.",
    strength: "Cerdas dalam asimilasi data, negosiator yang logis, dan mampu melihat blind spot yang dilewatkan kompetitor.", weakness: "Anxiety karena overthinking, kelumpuhan analisis (Analysis Paralysis), dan cepat bosan pada hal monoton.",
    hack: "Eksternalisasi pikiran Anda. Gunakan jurnaling atau mind-mapping untuk mencegah otak Anda over-heating."
  },
  Kamis: {
    trait: "optimisme ekspansif dan perancangan visi masa depan",
    title: "Visioner & Optimis", desc: "Pandangan Anda selalu tertuju ke horizon. Pembawa energi ekspansi yang percaya bahwa selalu ada jalan keluar yang lebih baik.",
    strength: "Resiliensi berbasis optimisme, mampu merancang grand-design, dan memiliki kompas moral yang kuat.", weakness: "Terkadang terlalu idealis hingga abai pada gesekan realitas, keras kepala, dan payah pada urusan administratif mendetail.",
    hack: "Turunkan pandangan Anda sesekali. Pecah visi megah Anda menjadi KPI mingguan atau to-do list harian yang sangat pragmatis."
  },
  Jumat: {
    trait: "pencarian keindahan dan keseimbangan harmoni",
    title: "Estetik & Harmonis", desc: "Anda mengkalibrasi dunia melalui lensa keindahan dan keseimbangan. Menolak kekacauan dan selalu mencari harmoni operasional.",
    strength: "Kreativitas tingkat dewa, diplomasi yang elegan, dan insting tajam untuk mengkurasi kualitas dan estetika.", weakness: "Phobia terhadap konfrontasi (pasif-agresif), dan mudah kehilangan momentum jika tidak berada di 'mood' yang tepat.",
    hack: "Pahami bahwa gesekan/konflik adalah bahan bakar inovasi. Jangan menyapu masalah di bawah karpet demi harmoni palsu."
  },
  Sabtu: {
    trait: "struktur, komitmen, dan pencapaian melalui penderitaan",
    title: "Pembangun & Disiplin", desc: "Batu karang di tengah badai. Anda menghargai struktur, komitmen, dan pencapaian yang diraih melalui penderitaan (Grit).",
    strength: "Reliabilitas maksimum, stamina pekerja keras yang konsisten, dan kemampuan mengelola krisis dengan kepala dingin.", weakness: "Kekakuan operasional, kesulitan melakukan pivot strategi dengan cepat, dan stres akibat memendam beban sendirian.",
    hack: "Rangkul ketidaksempurnaan. Berikan toleransi pada diri sendiri untuk rileks, karena delegasi tugas bukanlah sebuah kelemahan."
  },
  Minggu: {
    trait: "kemandirian ekstrem dan standar kualitas tinggi",
    title: "Pemimpin & Mandiri", desc: "Karakter gravitasi sentral. Anda memancarkan kemandirian ekstrem dan tidak suka diatur oleh otoritas yang kurang kompeten.",
    strength: "Integritas pendirian, karisma pembuka jalan, dan standar kualitas tinggi yang memaksa lingkungan ikut naik level.", weakness: "Ego terselubung, kebiasaan mengambil alih (mendominasi), dan perisai yang tebal terhadap kritik konstruktif.",
    hack: "Ubah mindset dari 'Saya yang paling tahu' menjadi 'Mari kita gali dari yang lain'. Berlatihlah menjadi fasilitator, bukan sekadar komandan."
  }
};

const DAY_ARCHETYPE_EN: Record<string, ArchetypeData> = {
  Senin: {
    trait: "empathy and emotional sensory capacity",
    title: "Empathetic & Intuitive", desc: "Represents pure empathy and emotional sensory capacity. You function as a radar detecting the room's atmosphere.",
    strength: "High-level active listener, superior Emotional Intelligence (EQ), easily accepted in any social circle.", weakness: "People-pleaser syndrome, draining energy for others, and mood swings from absorbing environmental burdens.",
    hack: "Audit your energy. Learn the art of saying 'NO' elegantly and schedule uncompromising 'me-time'."
  },
  Selasa: {
    trait: "rapid acceleration and breaking boundaries",
    title: "Fighter & Ambitious", desc: "A natural accelerator. Born with a large engine designed for initiation and breaking boundaries.",
    strength: "Relentless persistence, daring to take steps when others hesitate, and crisis leadership capabilities.", weakness: "Short-tempered, intolerant of slow processes, and prone to making decisions based on adrenaline rushes.",
    hack: "Practice tactical pauses. Use the 24-hour rule before reacting to provocation or making major financial commitments."
  },
  Rabu: {
    trait: "information processing and complex pattern solving",
    title: "Communicator & Logical", desc: "Information architect. Your brain works like a supercomputer sorting probabilities and solving complex patterns.",
    strength: "Brilliant in data assimilation, logical negotiator, and able to spot blind spots missed by competitors.", weakness: "Anxiety from overthinking, Analysis Paralysis, and gets bored quickly with monotony.",
    hack: "Externalize your thoughts. Use journaling or mind-mapping to prevent your brain from over-heating."
  },
  Kamis: {
    trait: "expansive optimism and future vision design",
    title: "Visionary & Optimistic", desc: "Your gaze is always set on the horizon. A bringer of expansive energy who believes there's always a better way.",
    strength: "Optimism-based resilience, able to design grand visions, and possesses a strong moral compass.", weakness: "Sometimes too idealistic ignoring reality's friction, stubborn, and poor at detailed administrative matters.",
    hack: "Lower your gaze occasionally. Break your grand vision down into weekly KPIs or highly pragmatic daily to-do lists."
  },
  Jumat: {
    trait: "the pursuit of beauty and harmonic balance",
    title: "Aesthetic & Harmonious", desc: "You calibrate the world through the lens of beauty and balance. Rejecting chaos and always seeking operational harmony.",
    strength: "God-tier creativity, elegant diplomacy, and sharp instincts for curating quality and aesthetics.", weakness: "Phobia of confrontation (passive-aggressive), and easily loses momentum if not in the right 'mood'.",
    hack: "Understand that friction/conflict is the fuel for innovation. Don't sweep problems under the rug for fake harmony."
  },
  Sabtu: {
    trait: "structure, commitment, and achievement through endurance",
    title: "Builder & Disciplined", desc: "A rock in the storm. You value structure, commitment, and achievements gained through endurance (Grit).",
    strength: "Maximum reliability, consistent hardworking stamina, and ability to manage crises with a cool head.", weakness: "Operational rigidity, difficulty pivoting strategies quickly, and stress from carrying burdens alone.",
    hack: "Embrace imperfection. Tolerate yourself to relax, because delegating tasks is not a weakness."
  },
  Minggu: {
    trait: "extreme independence and high-quality standards",
    title: "Leader & Independent", desc: "Central gravity character. You radiate extreme independence and dislike being managed by incompetent authority.",
    strength: "Integrity of stance, path-clearing charisma, and high-quality standards that force the environment to level up.", weakness: "Hidden ego, habit of taking over (dominating), and a thick shield against constructive criticism.",
    hack: "Change your mindset from 'I know best' to 'Let's dig from others'. Practice being a facilitator, not just a commander."
  }
};

const DAY_ARCHETYPE_ES: Record<string, ArchetypeData> = {
  Senin: {
    trait: "empatía y capacidad sensorial emocional",
    title: "Empático e Intuitivo", desc: "Representa la empatía pura y la capacidad sensorial emocional. Funcionas como un radar detectando la atmósfera.",
    strength: "Oyente activo de alto nivel, Inteligencia Emocional (EQ) superior, fácilmente aceptado socialmente.", weakness: "Síndrome de complacer a todos, drena energía por otros y cambios de humor por absorber cargas del entorno.",
    hack: "Audita tu energía. Aprende el arte de decir 'NO' elegantemente y programa tiempo para ti sin compromisos."
  },
  Selasa: {
    trait: "aceleración rápida y ruptura de límites",
    title: "Luchador y Ambicioso", desc: "Acelerador natural. Nacido con un gran motor diseñado para iniciar y romper límites.",
    strength: "Persistencia implacable, atrevimiento al dar pasos cuando otros dudan y capacidades de liderazgo en crisis.", weakness: "Irritable, intolerante a los procesos lentos y propenso a tomar decisiones por descargas de adrenalina.",
    hack: "Practica pausas tácticas. Usa la regla de las 24 horas antes de reaccionar a una provocación o compromiso financiero."
  },
  Rabu: {
    trait: "procesamiento de información y resolución de patrones complejos",
    title: "Comunicador y Lógico", desc: "Arquitecto de información. Tu cerebro funciona como una supercomputadora ordenando probabilidades y patrones complejos.",
    strength: "Brillante en asimilación de datos, negociador lógico y capaz de detectar puntos ciegos pasados por alto.", weakness: "Ansiedad por pensar demasiado, parálisis por análisis y se aburre rápidamente con la monotonía.",
    hack: "Externaliza tus pensamientos. Usa un diario o mapas mentales para evitar que tu cerebro se sobrecaliente."
  },
  Kamis: {
    trait: "optimismo expansivo y diseño de visión futura",
    title: "Visionario y Optimista", desc: "Tu mirada siempre está en el horizonte. Portador de energía expansiva que cree que siempre hay un camino mejor.",
    strength: "Resiliencia basada en el optimismo, capaz de diseñar grandes visiones y posee una fuerte brújula moral.", weakness: "A veces demasiado idealista ignorando la realidad, terco y deficiente en asuntos administrativos detallados.",
    hack: "Baja la mirada de vez en cuando. Divide tu gran visión en KPI semanales o listas de tareas pragmáticas."
  },
  Jumat: {
    trait: "la búsqueda de la belleza y el equilibrio armónico",
    title: "Estético y Armonioso", desc: "Calibras el mundo a través del lente de la belleza y el equilibrio. Rechazando el caos y buscando la armonía.",
    strength: "Creatividad divina, diplomacia elegante e instintos agudos para curar la calidad y la estética.", weakness: "Fobia a la confrontación (pasivo-agresivo) y pierde impulso fácilmente si no está del 'humor' adecuado.",
    hack: "Entiende que la fricción/conflicto es el combustible de la innovación. No escondas los problemas bajo la alfombra."
  },
  Sabtu: {
    trait: "estructura, compromiso y logro a través de la resistencia",
    title: "Constructor y Disciplinado", desc: "Una roca en la tormenta. Valoras la estructura, el compromiso y los logros obtenidos a través de la resistencia (Grit).",
    strength: "Máxima confiabilidad, resistencia de trabajo constante y capacidad para gestionar crisis con la cabeza fría.", weakness: "Rigidez operativa, dificultad para pivotar estrategias rápido y estrés por llevar cargas solo.",
    hack: "Acepta la imperfección. Tolérate a ti mismo para relajarte, porque delegar tareas no es una debilidad."
  },
  Minggu: {
    trait: "independencia extrema y altos estándares de calidad",
    title: "Líder e Independiente", desc: "Personaje de gravedad central. Irradias independencia extrema y no te gusta ser dirigido por autoridad incompetente.",
    strength: "Integridad de postura, carisma que abre caminos y altos estándares que obligan al entorno a subir de nivel.", weakness: "Ego oculto, hábito de tomar el control (dominar) y un escudo grueso contra la crítica constructiva.",
    hack: "Cambia tu mentalidad de 'Yo sé más' a 'Indaguemos en los demás'. Practica ser un facilitador, no solo un comandante."
  }
};
// ==========================================
// DATABASE ARKETIPE PASARAN (ID, EN, ES)
// (Note: Keys tetap Legi, Pahing, Pon, Wage, Kliwon)
// ==========================================
const PASARAN_ARCHETYPE_ID: Record<string, ArchetypeData> = {
  Legi: {
    trait: "kapasitas keluwesan sosial dan pengisian ruang kosong",
    title: "Katalis Keluwesan", desc: "Membawa energi angin yang mengisi celah kosong. Anda adalah pelumas dalam mesin sosial atau organisasi.",
    strength: "Modal sosial (Networking) yang sangat mahal, adaptif 360 derajat, dan pembawa keceriaan.", weakness: "Ceroboh pada kontrak/detail teknis, atensi mudah terdistraksi, dan sering janji berlebihan.",
    hack: "Otomatisasi pengingat Anda. Gunakan teknik kalender ketat agar eksekusi sejalan dengan janji."
  },
  Pahing: {
    trait: "kalkulasi pragmatis dan proteksi sumber daya",
    title: "Mesin Kalkulasi", desc: "Membawa energi api dan materialistis positif. Insting bertahan hidup Anda terkalibrasi pada pengamanan sumber daya/aset.",
    strength: "Mandiri secara finansial sejak dini, insting profit tajam, dan protektif terhadap properti.", weakness: "Sangat transaksional hingga dinilai dingin, skeptisisme tinggi, dan pelit secara emosional.",
    hack: "Investasi kapital bukan segalanya. Mulailah berinvestasi pada 'Bank Emosi' secara tulus pada kolega dan keluarga."
  },
  Pon: {
    trait: "strategi tersembunyi dan manuver diplomatis",
    title: "Strategis Tersembunyi", desc: "Permukaan air yang tenang namun berarus deras di bawahnya. Anda membaca 3 langkah ke depan sebelum bertindak.",
    strength: "Kemampuan manuver diplomatis, problem solver spesifik saat krisis, dan pertahanan mental berlapis baja.", weakness: "Kecenderungan manipulatif untuk melindungi diri, memendam intensi asli, dan bisa mendendam diam-diam.",
    hack: "Kurangi tembok pertahanan Anda di lingkungan aman. Keterbukaan komunikasi adalah investasi terbaik untuk Trust."
  },
  Wage: {
    trait: "fondasi loyalitas dan manajemen risiko ekstrem",
    title: "Fondasi Loyalitas", desc: "Energi bumi yang tak tergoyahkan. Anda adalah akar yang menahan pohon saat diterjang badai kapitalis atau sosial.",
    strength: "Kesetiaan tanpa syarat pada prinsip/orang yang tepat, mitigasi risiko luar biasa, dan sangat stabil.", weakness: "Resistensi tinggi pada inovasi, lambat mengeksekusi akibat analisis berlebih, dan keras kepala.",
    hack: "Latihlah mentalitas 'Iterative Deployment'. Jangan menunggu rencana sempurna 100%, luncurkan saat 80%."
  },
  Kliwon: {
    trait: "pencarian sinyal spiritual dan ketajaman intuisi batin",
    title: "Radar Spiritual", desc: "Berada di titik poros. Memiliki akses pada gelombang frekuensi informasi yang sering terlewatkan oleh rasionalitas murni.",
    strength: "Intuisi yang kerap terbukti akurat, kharisma persuasif, dan kemampuan melihat korelasi hal tak kasat mata.", weakness: "Fluktuasi mood yang merusak jadwal, keras kepala meyakini instingnya sendiri, dan kadang eksentrik.",
    hack: "Pahami bahasa orang awam. Terjemahkan firasat Anda ke logika agar disetujui oleh tim atau atasan."
  }
};

const PASARAN_ARCHETYPE_EN: Record<string, ArchetypeData> = {
  Legi: {
    trait: "social flexibility capacity and filling empty spaces",
    title: "Flexibility Catalyst", desc: "Brings the energy of wind that fills empty gaps. You are the lubricant in social or organizational machines.",
    strength: "Invaluable social capital (Networking), 360-degree adaptability, and a bringer of joy.", weakness: "Careless with technical contracts/details, easily distracted attention, and often over-promises.",
    hack: "Automate your reminders. Use strict calendar techniques so execution aligns with promises."
  },
  Pahing: {
    trait: "pragmatic calculation and resource protection",
    title: "Calculation Engine", desc: "Brings fire energy and positive materialism. Your survival instinct is calibrated towards securing resources/assets.",
    strength: "Financially independent early on, sharp profit instincts, and protective of property.", weakness: "Highly transactional leading to seeming cold, high skepticism, and emotionally stingy.",
    hack: "Capital investment isn't everything. Start investing sincerely in your 'Emotional Bank Account' with colleagues and family."
  },
  Pon: {
    trait: "hidden strategy and diplomatic maneuvering",
    title: "Hidden Strategist", desc: "A calm water surface with a strong undercurrent. You read 3 steps ahead before acting.",
    strength: "Diplomatic maneuvering skills, specific crisis problem solver, and iron-clad mental defense.", weakness: "Manipulative tendencies for self-protection, hiding true intentions, and can hold silent grudges.",
    hack: "Lower your defense walls in safe environments. Open communication is the best investment for Trust."
  },
  Wage: {
    trait: "foundation of loyalty and extreme risk management",
    title: "Loyalty Foundation", desc: "Unshakable earth energy. You are the root that holds the tree during capitalist or social storms.",
    strength: "Unconditional loyalty to the right principles/people, exceptional risk mitigation, and highly stable.", weakness: "High resistance to disruptive innovation, slow execution due to over-analysis, and stubbornness.",
    hack: "Practice the 'Iterative Deployment' mentality. Don't wait for a 100% perfect plan, launch at 80%."
  },
  Kliwon: {
    trait: "spiritual signal seeking and sharp inner intuition",
    title: "Spiritual Radar", desc: "Located at the pivot point. Has access to information frequency waves often missed by pure rationality.",
    strength: "Intuition that often proves accurate, persuasive charisma, and ability to see correlations of the invisible.", weakness: "Mood fluctuations that ruin schedules, stubbornness in believing own instincts, and sometimes eccentric.",
    hack: "Understand layman's language. Translate your hunches into logic so they can be approved by the team or superiors."
  }
};

const PASARAN_ARCHETYPE_ES: Record<string, ArchetypeData> = {
  Legi: {
    trait: "capacidad de flexibilidad social y llenado de espacios vacíos",
    title: "Catalizador de Flexibilidad", desc: "Trae la energía del viento que llena los vacíos. Eres el lubricante en las máquinas sociales u organizativas.",
    strength: "Capital social invaluable (Networking), adaptabilidad de 360 grados y portador de alegría.", weakness: "Descuidado con contratos/detalles técnicos, atención fácilmente distraída y a menudo promete demasiado.",
    hack: "Automatiza tus recordatorios. Usa técnicas estrictas de calendario para que la ejecución se alinee con las promesas."
  },
  Pahing: {
    trait: "cálculo pragmático y protección de recursos",
    title: "Motor de Cálculo", desc: "Trae energía de fuego y materialismo positivo. Tu instinto de supervivencia está calibrado hacia la protección de recursos/activos.",
    strength: "Financieramente independiente desde el principio, agudos instintos de ganancias y protector de la propiedad.", weakness: "Altamente transaccional, parece frío, alto escepticismo y emocionalmente tacaño.",
    hack: "La inversión de capital no lo es todo. Comienza a invertir sinceramente en tu 'Cuenta Bancaria Emocional' con colegas y familiares."
  },
  Pon: {
    trait: "estrategia oculta y maniobra diplomática",
    title: "Estratega Oculto", desc: "Superficie de agua tranquila con una fuerte corriente subterránea. Lees 3 pasos por delante antes de actuar.",
    strength: "Habilidades de maniobra diplomática, solucionador de crisis específicas y férrea defensa mental.", weakness: "Tendencias manipuladoras para autoprotección, oculta verdaderas intenciones y puede guardar rencor en silencio.",
    hack: "Baja tus muros de defensa en entornos seguros. La comunicación abierta es la mejor inversión para la Confianza."
  },
  Wage: {
    trait: "base de lealtad y gestión extrema de riesgos",
    title: "Base de Lealtad", desc: "Energía de tierra inquebrantable. Eres la raíz que sostiene el árbol durante tormentas capitalistas o sociales.",
    strength: "Lealtad incondicional a los principios/personas correctas, mitigación de riesgos excepcional y altamente estable.", weakness: "Alta resistencia a la innovación, ejecución lenta por exceso de análisis y terquedad.",
    hack: "Practica la mentalidad de 'Despliegue Iterativo'. No esperes un plan 100% perfecto, lanza al 80%."
  },
  Kliwon: {
    trait: "búsqueda de señales espirituales y aguda intuición interior",
    title: "Radar Espiritual", desc: "Ubicado en el punto de pivote. Tiene acceso a ondas de frecuencia que a menudo la pura racionalidad pasa por alto.",
    strength: "Intuición que a menudo resulta precisa, carisma persuasivo y capacidad para ver correlaciones de lo invisible.", weakness: "Fluctuaciones de humor que arruinan horarios, terquedad al creer en sus propios instintos y a veces excéntrico.",
    hack: "Comprende el lenguaje de los laicos. Traduce tus corazonadas en lógica para que sean aprobadas por el equipo o superiores."
  }
};

// ==========================================
// SELECTOR BAHASA & FUNGSI SINERGI (SAFE STRING INJECTION)
// ==========================================
function getNeptuDB(lang: string) {
  if (lang === "en") return NEPTU_EN;
  if (lang === "es") return NEPTU_ES;
  return NEPTU_ID;
}

function getDayDB(lang: string) {
  if (lang === "en") return DAY_ARCHETYPE_EN;
  if (lang === "es") return DAY_ARCHETYPE_ES;
  return DAY_ARCHETYPE_ID;
}

function getPasaranDB(lang: string) {
  if (lang === "en") return PASARAN_ARCHETYPE_EN;
  if (lang === "es") return PASARAN_ARCHETYPE_ES;
  return PASARAN_ARCHETYPE_ID;
}

// Fungsi Sinergi Tahan Banting (Anti-Error Translasi)
function getSynergyText(hariTrait: string, pasaranTrait: string, lang: string): string {
  if (lang === "en") {
    return `Psychologically, your personality architecture is a unique blend. Your core character, which is centered on ${hariTrait}, is constantly catalyzed by the instinctual drive of ${pasaranTrait} from the Pasaran side. To maximize this leverage, you must balance emotional dominance with execution logic, and patch the blind spots in your character matrix.`;
  }
  if (lang === "es") {
    return `Psicológicamente, la arquitectura de su personalidad es una mezcla única. Su carácter central, enfocado en ${hariTrait}, es constantemente catalizado por el impulso instintivo de ${pasaranTrait} desde el lado Pasaran. Para maximizar este potencial, debe equilibrar la dominancia emocional con la lógica de ejecución y reparar los puntos ciegos en su matriz de carácter.`;
  }
  return `Secara psikologis, arsitektur kepribadian Anda adalah perpaduan unik. Karakter dasar Anda yang berpusat pada ${hariTrait}, secara konstan dikatalisasi oleh dorongan insting ${pasaranTrait} dari sisi pasaran. Untuk memaksimalkan potensi (Leverage) ini, Anda harus menyeimbangkan antara dominasi emosi dasar dengan logika eksekusi, serta menambal blind-spot yang ada di matriks karakter Anda.`;
}
// ==========================================
// PART 4: KOMPONEN UTAMA REACT & ANTARMUKA UI
// ==========================================
export default function WatakKelahiran({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const ui = UI_DICT[activeLang] || UI_DICT["id"];
  const neptuDB = getNeptuDB(activeLang);
  const dayDB = getDayDB(activeLang);
  const pasaranDB = getPasaranDB(activeLang);

  const [hari, setHari] = useState("");
  const [pasaran, setPasaran] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);

  const handleAnalyze = () => {
    if (!hari || !pasaran) return;
    setLoading(true);
    setTimeout(() => {
      const nilaiHari = HARI_NILAI[hari];
      const nilaiPasaran = PASARAN_NILAI[pasaran];
      const neptu = nilaiHari + nilaiPasaran;
      
      const neptuData = neptuDB[neptu] || neptuDB[9]; // Fallback aman
      const hariArchetype = dayDB[hari];
      const pasaranArchetype = pasaranDB[pasaran];
      
      // Injeksi trait yang aman dari error translasi
      const synergy = getSynergyText(hariArchetype.trait, pasaranArchetype.trait, activeLang);
      
      setResult({
        hari, pasaran,
        nilaiHari, nilaiPasaran, neptu, neptuData,
        hariArchetype, pasaranArchetype, synergy
      });
      setLoading(false);
    }, 800);
  };

  const handleShare = () => {
    if (!result) return;
    const text = `${ui.shareText} ${result.hari} ${result.pasaran}\nNeptu: ${result.neptu}\nArketipe: ${result.neptuData.watak}\n\nSuperpower: ${result.hariArchetype.strength}\n${ui.rezeki.replace('🧭 ', '')}: ${result.neptuData.rezeki}\n\nAksaraDiri!`;
    if (navigator.share) {
      navigator.share({ title: ui.title, text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-2 drop-shadow-lg">🧬📜</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500 bg-clip-text text-transparent pb-1">
          {ui.title}
        </h2>
        <p className="text-slate-300 text-sm mt-1">{ui.subtitle}</p>
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-md shadow-xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">{ui.lblHari}</label>
            <select
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              className="w-full mt-1.5 bg-black/40 border border-white/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all"
            >
              <option value="" disabled>{ui.selHari}</option>
              {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">{ui.lblPasaran}</label>
            <select
              value={pasaran}
              onChange={(e) => setPasaran(e.target.value)}
              className="w-full mt-1.5 bg-black/40 border border-white/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all"
            >
              <option value="" disabled>{ui.selPasaran}</option>
              {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading || !hari || !pasaran}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-black text-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.25)] tracking-wide"
          >
            {loading ? ui.btnLoading : ui.btnAnalyze}
          </button>
          {result && (
            <button
              onClick={handleShare}
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-xl"
              title="Share"
            >
              📤
            </button>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-14 flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
          <span className="text-amber-400/80 text-xs font-mono tracking-widest uppercase animate-pulse">{ui.loadText}</span>
        </div>
      )}

      {/* Hasil Analisis */}
      {result && !loading && (
        <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* Primbon Jawa (Neptu) */}
          <div className="bg-gradient-to-br from-slate-900/90 to-amber-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center relative z-10">
              <div className="text-3xl font-bold">
                {result.hari} <span className="text-amber-400">{result.pasaran}</span>
              </div>
              <div className="mt-2 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-lg">
                {result.neptu}
              </div>
              <p className="text-slate-400 text-xs font-mono mt-2 tracking-widest">{ui.intrinsic} (H{result.nilaiHari} + P{result.nilaiPasaran})</p>
              
              <div className="mt-5 inline-block px-6 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-amber-200 font-bold tracking-wide shadow-inner text-lg">
                {result.neptuData.watak}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative z-10">
              <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">{ui.superpower}</p>
                <p className="text-slate-200 text-sm leading-relaxed">{result.neptuData.positif}</p>
              </div>
              <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">{ui.blindspot}</p>
                <p className="text-slate-200 text-sm leading-relaxed">{result.neptuData.negatif}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-center relative z-10">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <p className="text-amber-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{ui.rezeki}</p>
                <p className="text-xs font-semibold text-slate-200">{result.neptuData.rezeki}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <p className="text-amber-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{ui.warna}</p>
                <p className="text-xs font-semibold text-slate-200">{result.neptuData.warna}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <p className="text-amber-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{ui.elemen}</p>
                <p className="text-xs font-semibold text-slate-200">{result.neptuData.elemen}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <p className="text-amber-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{ui.hariOptimal}</p>
                <p className="text-xs font-semibold text-slate-200">{result.neptuData.hariBaik}</p>
              </div>
            </div>

            <div className="mt-5 p-5 bg-amber-500/10 rounded-2xl border border-amber-500/30 relative z-10">
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">{ui.mitigasi}</p>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">{result.neptuData.pantangan}</p>
              
              <div className="h-px w-full bg-amber-500/20 my-4" />
              
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">{ui.sinergiJodoh}</p>
              <p className="text-slate-300 text-sm">{ui.resonansi} <span className="font-bold text-amber-100 bg-amber-500/20 px-2 py-0.5 rounded">{result.neptuData.jodohIdeal.join(", ")}</span></p>
            </div>
          </div>

          {/* Arketipe Modern */}
          <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-center mb-8">
              {ui.dimensi}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Sifat Dasar */}
              <div className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl shadow-inner">👤</div>
                  <div>
                    <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-0.5">{ui.pondasi}</p>
                    <p className="font-bold text-xl text-slate-100">{result.hari} – {result.hariArchetype.title}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{result.hariArchetype.desc}</p>
                <div className="space-y-3 bg-black/30 p-5 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-200 leading-relaxed"><span className="text-emerald-400 font-bold mr-2 text-lg leading-none">✓</span> {result.hariArchetype.strength}</p>
                  <p className="text-sm text-slate-200 leading-relaxed"><span className="text-rose-400 font-bold mr-2 text-lg leading-none">✗</span> {result.hariArchetype.weakness}</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm text-amber-100 leading-relaxed"><span className="text-amber-400 mr-2 text-lg leading-none">💡</span> <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500">{ui.lifeHack}</span> {result.hariArchetype.hack}</p>
                  </div>
                </div>
              </div>

              {/* Katalisator */}
              <div className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-2xl hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl shadow-inner">🔥</div>
                  <div>
                    <p className="text-[10px] text-purple-300 uppercase tracking-widest font-bold mb-0.5">{ui.katalis}</p>
                    <p className="font-bold text-xl text-slate-100">{result.pasaran} – {result.pasaranArchetype.title}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{result.pasaranArchetype.desc}</p>
                <div className="space-y-3 bg-black/30 p-5 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-200 leading-relaxed"><span className="text-emerald-400 font-bold mr-2 text-lg leading-none">✓</span> {result.pasaranArchetype.strength}</p>
                  <p className="text-sm text-slate-200 leading-relaxed"><span className="text-rose-400 font-bold mr-2 text-lg leading-none">✗</span> {result.pasaranArchetype.weakness}</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm text-amber-100 leading-relaxed"><span className="text-amber-400 mr-2 text-lg leading-none">💡</span> <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500">{ui.lifeHack}</span> {result.pasaranArchetype.hack}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sinergi */}
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl text-center shadow-inner">
              <p className="text-indigo-100 text-sm md:text-base leading-relaxed font-medium">{result.synergy}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[11px] text-slate-500 pt-6 border-t border-white/10 max-w-2xl mx-auto leading-relaxed">
            {ui.footer}
          </div>

          {/* INJEKSI PAYWALL MULAI DARI SINI */}
          <PremiumPaywall 
            toolName="Zodiac Compatibility" 
            resultId="zodiac-compatibility" 
          />
          {/* SAMPAI SINI */}

        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}