"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Horoskop Hari Ini",
    badge: "Ultra Premium",
    subtitle: "Ramalan bintang personal yang berganti setiap hari berdasarkan posisi planet. Temukan panduan untuk karir, asmara, kesehatan, dan spiritualitas.",
    shareBtn: "Bagikan",
    loadingText: "Menghubungkan dengan bintang...",
    mood: "Mood",
    career: "Karier & Keuangan",
    love: "Asmara",
    health: "Kesehatan",
    do: "✅ Lakukan Hari Ini",
    avoid: "❌ Hindari Hari Ini",
    luckyNumber: "🍀 ANGKA KEBERUNTUNGAN",
    luckyColorLabel: "🎨 Warna",
    spiritual: "🧘 Spiritual",
    element: "Elemen",
    ruler: "Penguasa",
    disclaimer: "✨ Ramalan ini dihasilkan berdasarkan posisi bintang dan berganti setiap hari. Kembali besok untuk pesan baru! ✨",
    quotePrefix: "Kutipan Bintang",
  },
  en: {
    title: "Today's Horoscope",
    badge: "Ultra Premium",
    subtitle: "Personal daily horoscope that changes every day based on planetary positions. Find guidance for career, love, health, and spirituality.",
    shareBtn: "Share",
    loadingText: "Connecting with the stars...",
    mood: "Mood",
    career: "Career & Finance",
    love: "Love",
    health: "Health",
    do: "✅ Do Today",
    avoid: "❌ Avoid Today",
    luckyNumber: "🍀 LUCKY NUMBER",
    luckyColorLabel: "🎨 Color",
    spiritual: "🧘 Spiritual",
    element: "Element",
    ruler: "Ruler",
    disclaimer: "✨ This horoscope is generated based on star positions and changes daily. Come back tomorrow for new messages! ✨",
    quotePrefix: "Star Quote",
  },
  es: {
    title: "Horóscopo de Hoy",
    badge: "Ultra Premium",
    subtitle: "Horóscopo diario personal que cambia cada día según las posiciones planetarias. Encuentra orientación para carrera, amor, salud y espiritualidad.",
    shareBtn: "Compartir",
    loadingText: "Conectando con las estrellas...",
    mood: "Estado de ánimo",
    career: "Carrera y Finanzas",
    love: "Amor",
    health: "Salud",
    do: "✅ Haz Hoy",
    avoid: "❌ Evita Hoy",
    luckyNumber: "🍀 NÚMERO DE LA SUERTE",
    luckyColorLabel: "🎨 Color",
    spiritual: "🧘 Espiritual",
    element: "Elemento",
    ruler: "Gobernante",
    disclaimer: "✨ Este horóscopo se genera según las posiciones de las estrellas y cambia diariamente. ¡Vuelve mañana para nuevos mensajes! ✨",
    quotePrefix: "Cita Estelar",
  },
};

// ========== DATABASE ZODIAK (tetap) ==========
const ZODIAC_LIST = [
  { name: "Aries", symbol: "♈", date: "21 Mar - 19 Apr", elementKey: "Api", rulerKey: "Mars", color: "#ef4444" },
  { name: "Taurus", symbol: "♉", date: "20 Apr - 20 Mei", elementKey: "Tanah", rulerKey: "Venus", color: "#22c55e" },
  { name: "Gemini", symbol: "♊", date: "21 Mei - 20 Jun", elementKey: "Udara", rulerKey: "Merkurius", color: "#eab308" },
  { name: "Cancer", symbol: "♋", date: "21 Jun - 22 Jul", elementKey: "Air", rulerKey: "Bulan", color: "#3b82f6" },
  { name: "Leo", symbol: "♌", date: "23 Jul - 22 Agt", elementKey: "Api", rulerKey: "Matahari", color: "#f97316" },
  { name: "Virgo", symbol: "♍", date: "23 Agt - 22 Sep", elementKey: "Tanah", rulerKey: "Merkurius", color: "#84cc16" },
  { name: "Libra", symbol: "♎", date: "23 Sep - 22 Okt", elementKey: "Udara", rulerKey: "Venus", color: "#ec4899" },
  { name: "Scorpio", symbol: "♏", date: "23 Okt - 21 Nov", elementKey: "Air", rulerKey: "Pluto", color: "#8b5cf6" },
  { name: "Sagitarius", symbol: "♐", date: "22 Nov - 21 Des", elementKey: "Api", rulerKey: "Yupiter", color: "#f59e0b" },
  { name: "Capricorn", symbol: "♑", date: "22 Des - 19 Jan", elementKey: "Tanah", rulerKey: "Saturnus", color: "#78716c" },
  { name: "Aquarius", symbol: "♒", date: "20 Jan - 18 Feb", elementKey: "Udara", rulerKey: "Uranus", color: "#06b6d4" },
  { name: "Pisces", symbol: "♓", date: "19 Feb - 20 Mar", elementKey: "Air", rulerKey: "Neptunus", color: "#a855f7" },
];

// Elemen dan penguasa multi-bahasa
const ELEMENTS: Record<string, Record<string, string>> = {
  id: { Api: "Api", Tanah: "Tanah", Udara: "Udara", Air: "Air" },
  en: { Api: "Fire", Tanah: "Earth", Udara: "Air", Air: "Water" },
  es: { Api: "Fuego", Tanah: "Tierra", Udara: "Aire", Air: "Agua" },
};

const RULERS: Record<string, Record<string, string>> = {
  id: { Mars: "Mars", Venus: "Venus", Merkurius: "Merkurius", Bulan: "Bulan", Matahari: "Matahari", Pluto: "Pluto", Yupiter: "Yupiter", Saturnus: "Saturnus", Uranus: "Uranus", Neptunus: "Neptunus" },
  en: { Mars: "Mars", Venus: "Venus", Merkurius: "Mercury", Bulan: "Moon", Matahari: "Sun", Pluto: "Pluto", Yupiter: "Jupiter", Saturnus: "Saturn", Uranus: "Uranus", Neptunus: "Neptune" },
  es: { Mars: "Marte", Venus: "Venus", Merkurius: "Mercurio", Bulan: "Luna", Matahari: "Sol", Pluto: "Plutón", Yupiter: "Júpiter", Saturnus: "Saturno", Uranus: "Urano", Neptunus: "Neptuno" },
};

// ========== FUNGSI HASH DETERMINISTIK ==========
function getDailyHash(zodiacName: string, dateStr: string): number {
  const seed = zodiacName + dateStr;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
// ========== DATABASE TEKS MULTI-BAHASA ==========
// CAREER TEXTS
const CAREER_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Peluang promosi atau proyek besar akan muncul dari arah tak terduga. Jangan ragu mengambil peran lebih.",
    "Hari ini cocok untuk menyelesaikan pekerjaan yang tertunda. Fokus pada detail kecil.",
    "Kerja sama tim akan membuahkan hasil manis. Beri apresiasi pada rekan kerja.",
    "Ide kreatifmu akan diperhatikan atasan. Sampaikan dengan percaya diri.",
    "Hindari konflik dengan kolega. Lebih baik diam sementara jika ada perbedaan pendapat.",
    "Ada kemungkinan tawaran kerja baru atau kolaborasi menarik. Jelajahi dengan hati-hati.",
    "Keuangan membaik, tapi jangan tergoda belanja impulsif. Buat anggaran.",
    "Waktu tepat untuk meminta kenaikan gaji atau evaluasi kinerja. Siapkan data pendukung.",
    "Jika merasa jenuh, ambil cuti sebentar. Istirahat akan mengembalikan produktivitas.",
    "Networking membawa berkah. Hadiri acara profesional atau hubungi mentor lama.",
  ],
  en: [
    "Opportunities for promotion or big projects will come from unexpected directions. Don't hesitate to take on more role.",
    "Today is good for finishing pending work. Focus on small details.",
    "Teamwork will yield sweet results. Appreciate your colleagues.",
    "Your creative ideas will be noticed by your boss. Convey them confidently.",
    "Avoid conflict with colleagues. Better to stay silent temporarily if there's disagreement.",
    "There's a chance of a new job offer or interesting collaboration. Explore carefully.",
    "Finances are improving, but don't be tempted by impulsive shopping. Create a budget.",
    "The right time to ask for a raise or performance evaluation. Prepare supporting data.",
    "If feeling bored, take a short break. Rest will restore productivity.",
    "Networking brings blessings. Attend professional events or contact an old mentor.",
  ],
  es: [
    "Las oportunidades de ascenso o grandes proyectos vendrán de direcciones inesperadas. No dudes en asumir más responsabilidad.",
    "Hoy es bueno para terminar el trabajo pendiente. Concéntrate en los pequeños detalles.",
    "El trabajo en equipo dará dulces frutos. Agradece a tus colegas.",
    "Tus ideas creativas serán notadas por tu jefe. Preséntalas con confianza.",
    "Evita conflictos con colegas. Mejor guarda silencio temporalmente si hay desacuerdo.",
    "Existe la posibilidad de una nueva oferta de trabajo o colaboración interesante. Explora con cuidado.",
    "Las finanzas mejoran, pero no te dejes tentar por las compras impulsivas. Haz un presupuesto.",
    "Es el momento adecuado para pedir un aumento o evaluación de desempeño. Prepara datos de respaldo.",
    "Si te sientes aburrido, tómate un descanso corto. El descanso restaurará la productividad.",
    "El networking trae bendiciones. Asiste a eventos profesionales o contacta a un mentor antiguo.",
  ],
};

// LOVE TEXTS
const LOVE_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Pasangan akan memberi kejutan manis. Terima dengan hati terbuka.",
    "Komunikasi dengan pasangan perlu ditingkatkan. Jangan pendam perasaan.",
    "Jika lajang, hari ini peluang bertemu orang baru lewat aktivitas sosial.",
    "Cobalah melakukan hal romantis sederhana: menulis surat atau memasak bersama.",
    "Jangan terlalu posesif. Beri ruang pada pasangan untuk berkembang.",
    "Ada kemungkinan pertengkaran kecil karena kesalahpahaman. Tenangkan diri dulu.",
    "Waktu yang tepat untuk merencanakan liburan bersama atau kencan istimewa.",
    "Perasaanmu mungkin tidak direspon sesuai harapan. Tetap jaga harga diri.",
    "Beri pujian tulus pada pasangan. Kata-kata positif bisa memperkuat ikatan.",
    "Jika sendiri, fokus pada cinta diri dulu. Cinta sejati datang saat kamu utuh.",
  ],
  en: [
    "Your partner will give a sweet surprise. Accept it with an open heart.",
    "Communication with your partner needs improvement. Don't bottle up feelings.",
    "If single, today is a chance to meet new people through social activities.",
    "Try a simple romantic gesture: writing a letter or cooking together.",
    "Don't be too possessive. Give your partner space to grow.",
    "There's a possibility of a small argument due to misunderstanding. Calm down first.",
    "The right time to plan a vacation together or a special date.",
    "Your feelings may not be responded to as expected. Still maintain your self-esteem.",
    "Give sincere praise to your partner. Positive words can strengthen the bond.",
    "If alone, focus on self-love first. True love comes when you are whole.",
  ],
  es: [
    "Tu pareja te dará una dulce sorpresa. Acéptala con el corazón abierto.",
    "La comunicación con tu pareja necesita mejorar. No guardes los sentimientos.",
    "Si estás soltero, hoy es una oportunidad para conocer gente nueva a través de actividades sociales.",
    "Prueba un gesto romántico simple: escribir una carta o cocinar juntos.",
    "No seas demasiado posesivo. Dale a tu pareja espacio para crecer.",
    "Existe la posibilidad de una pequeña discusión debido a un malentendido. Cálmate primero.",
    "Es el momento adecuado para planificar unas vacaciones juntos o una cita especial.",
    "Tus sentimientos pueden no ser respondidos como esperabas. Mantén tu autoestima.",
    "Da elogios sinceros a tu pareja. Las palabras positivas pueden fortalecer el vínculo.",
    "Si estás solo, concéntrate en el amor propio primero. El amor verdadero llega cuando estás completo.",
  ],
};

// HEALTH TEXTS
const HEALTH_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Energi fisik sedang tinggi. Manfaatkan untuk olahraga ringan atau jalan kaki.",
    "Kurang tidur bisa mempengaruhi mood. Usahakan tidur lebih awal malam ini.",
    "Stres mungkin meningkat. Coba meditasi 5 menit atau tarik napas dalam.",
    "Perhatikan asupan makanan. Hindari gula berlebih dan perbanyak sayur.",
    "Sakit kepala ringan mungkin muncul. Perbanyak minum air putih.",
    "Sistem imun sedang baik. Ini saat tepat untuk memulai rutinitas sehat baru.",
    "Jangan paksakan diri jika lelah. Istirahat adalah bentuk perawatan diri.",
    "Olahraga ringan seperti yoga atau peregangan akan menyegarkan pikiran.",
    "Ada potensi alergi musiman. Jaga kebersihan lingkungan sekitar.",
    "Pikiran positif bisa menyembuhkan lebih cepat. Kelilingi diri dengan hal-hal menyenangkan.",
  ],
  en: [
    "Physical energy is high. Use it for light exercise or walking.",
    "Lack of sleep can affect mood. Try to sleep earlier tonight.",
    "Stress may increase. Try 5 minutes of meditation or deep breathing.",
    "Pay attention to food intake. Avoid excess sugar and eat more vegetables.",
    "A mild headache may appear. Drink more water.",
    "Immune system is good. This is the right time to start a new healthy routine.",
    "Don't force yourself if tired. Rest is a form of self-care.",
    "Light exercise like yoga or stretching will refresh your mind.",
    "There is potential for seasonal allergies. Keep your environment clean.",
    "Positive thoughts can heal faster. Surround yourself with pleasant things.",
  ],
  es: [
    "La energía física es alta. Úsala para hacer ejercicio ligero o caminar.",
    "La falta de sueño puede afectar el estado de ánimo. Intenta dormir más temprano esta noche.",
    "El estrés puede aumentar. Prueba 5 minutos de meditación o respiración profunda.",
    "Presta atención a la ingesta de alimentos. Evita el exceso de azúcar y come más verduras.",
    "Puede aparecer un dolor de cabeza leve. Bebe más agua.",
    "El sistema inmunológico está bien. Es el momento adecuado para comenzar una nueva rutina saludable.",
    "No te esfuerces si estás cansado. Descansar es una forma de cuidado personal.",
    "El ejercicio ligero como el yoga o los estiramientos refrescará tu mente.",
    "Existe la posibilidad de alergias estacionales. Mantén limpio tu entorno.",
    "Los pensamientos positivos pueden sanar más rápido. Rodéate de cosas agradables.",
  ],
};

// SPIRITUAL TEXTS
const SPIRITUAL_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Semesta mendukung langkahmu hari ini. Percaya pada timing ilahi.",
    "Ada pesan dari alam lewat mimpi atau firasat. Perhatikan tanda kecil.",
    "Energi positif mengelilingimu. Tebarkan kebaikan, maka kebaikan kembali.",
    "Meditasi singkat akan membuka wawasan baru. Cobalah hening sejenak.",
    "Intuisimu sangat tajam. Dengarkan bisikan hati dalam mengambil keputusan.",
    "Hubungan dengan orang tua atau leluhur membawa berkah. Hubungi mereka.",
    "Bersyukur atas hal kecil akan melipatgandakan kebahagiaan hari ini.",
    "Ada pelajaran spiritual dalam setiap tantangan. Jangan menyerah terlalu cepat.",
    "Saatnya melepaskan dendam dan kekecewaan. Maafkan untuk ketenanganmu.",
    "Kamu terhubung dengan alam lebih dari yang kamu sadari. Jalan-jalan ke taman.",
  ],
  en: [
    "The universe supports your steps today. Trust divine timing.",
    "There is a message from nature through dreams or feelings. Pay attention to small signs.",
    "Positive energy surrounds you. Spread kindness, and kindness returns.",
    "A short meditation will open new insights. Try to be silent for a moment.",
    "Your intuition is very sharp. Listen to your heart's whisper when making decisions.",
    "Relationship with parents or ancestors brings blessings. Contact them.",
    "Being grateful for small things will multiply today's happiness.",
    "There is a spiritual lesson in every challenge. Don't give up too quickly.",
    "Time to let go of grudges and disappointments. Forgive for your peace.",
    "You are more connected to nature than you realize. Take a walk to the park.",
  ],
  es: [
    "El universo apoya tus pasos hoy. Confía en el tiempo divino.",
    "Hay un mensaje de la naturaleza a través de sueños o corazonadas. Presta atención a las pequeñas señales.",
    "La energía positiva te rodea. Difunde bondad, y la bondad regresa.",
    "Una meditación corta abrirá nuevas perspectivas. Intenta guardar silencio por un momento.",
    "Tu intuición es muy aguda. Escucha el susurro de tu corazón al tomar decisiones.",
    "La relación con los padres o antepasados trae bendiciones. Contáctalos.",
    "Agradecer por las pequeñas cosas multiplicará la felicidad de hoy.",
    "Hay una lección espiritual en cada desafío. No te rindas demasiado rápido.",
    "Es momento de soltar rencores y decepciones. Perdona por tu paz.",
    "Estás más conectado con la naturaleza de lo que crees. Da un paseo al parque.",
  ],
};

// QUOTES
const QUOTES_ML: Record<string, string[]> = {
  id: [
    "✨ 'Hari ini adalah awal dari sisa hidupmu. Buatlah berarti.'",
    "🌟 'Kebahagiaan bukan tujuan, tapi cara kamu melangkah.'",
    "💫 'Jangan bandingkan chapter pertamamu dengan chapter orang lain yang sudah ke-20.'",
    "🌙 'Bintang tidak takut gelap, mereka justru bersinar di dalamnya.'",
    "🌞 'Matahari terbit setiap hari mengingatkan bahwa kesempatan selalu baru.'",
    "🍃 'Lepaskan apa yang tidak bisa kau kendalikan. Itulah keberanian sejati.'",
    "💖 'Cinta paling penting adalah cinta pada dirimu sendiri.'",
    "🕯️ 'Kamu lebih kuat dari yang kamu pikirkan, dan lebih dicintai dari yang kamu sadari.'",
    "🌸 'Setiap musim semi datang setelah musim dingin. Kesabaran membawa keindahan.'",
    "🦋 'Kadang kita harus hancur berkeping-keping untuk kemudian disusun kembali menjadi lebih indah.'",
  ],
  en: [
    "✨ 'Today is the beginning of the rest of your life. Make it meaningful.'",
    "🌟 'Happiness is not a goal, but the way you walk.'",
    "💫 'Don't compare your first chapter with someone else's twentieth.'",
    "🌙 'Stars aren't afraid of darkness; they shine in it.'",
    "🌞 'The sun rises every day reminding that opportunities are always new.'",
    "🍃 'Let go of what you cannot control. That is true courage.'",
    "💖 'The most important love is love for yourself.'",
    "🕯️ 'You are stronger than you think, and more loved than you realize.'",
    "🌸 'Every spring comes after winter. Patience brings beauty.'",
    "🦋 'Sometimes we have to shatter into pieces to then be reassembled more beautifully.'",
  ],
  es: [
    "✨ 'Hoy es el comienzo del resto de tu vida. Haz que valga la pena.'",
    "🌟 'La felicidad no es una meta, sino la forma en que caminas.'",
    "💫 'No compares tu primer capítulo con el vigésimo de otro.'",
    "🌙 'Las estrellas no le temen a la oscuridad; brillan en ella.'",
    "🌞 'El sol sale cada día recordando que las oportunidades siempre son nuevas.'",
    "🍃 'Suelta lo que no puedes controlar. Eso es verdadero coraje.'",
    "💖 'El amor más importante es el amor por ti mismo.'",
    "🕯️ 'Eres más fuerte de lo que piensas, y más amado de lo que te das cuenta.'",
    "🌸 'Cada primavera llega después del invierno. La paciencia trae belleza.'",
    "🦋 'A veces tenemos que romper en pedazos para luego ser reensamblados más bellamente.'",
  ],
};

// OVERVIEWS
const OVERVIEWS_ML: Record<string, string[]> = {
  id: [
    "Hari ini energi {zodiac} sedang dalam posisi yang baik untuk memulai. Bintang-bintang menunjukkan bahwa apa yang selama ini kau rencanakan mulai membuahkan hasil.",
    "Ada getaran positif yang menyelimuti harimu, {zodiac}. Keberuntungan berpihak pada mereka yang berani melangkah.",
    "Waspadai sedikit hambatan di pagi hari, tapi setelah siang semuanya akan mengalir lebih lancar. Jangan menyerah.",
    "Intuisimu sangat tajam hari ini. Gunakan untuk mengambil keputusan penting.",
    "Kemarin mungkin melelahkan, tapi hari ini adalah lembaran baru. Buka hati pada kemungkinan.",
    "Planet {ruler} memberi energi keberanian. Manfaatkan!",
    "Hari ini, fokus pada apa yang bisa kau kendalikan. Sisanya, serahkan pada alam.",
    "Kreativitasmu sedang berada di puncak. Sangat cocok untuk pekerjaan seni atau pemecahan masalah.",
    "Jangan takut menjadi diri sendiri. Keaslianmu adalah kekuatan terbesarmu hari ini.",
    "Perubahan kecil dalam rutinitas bisa membawa keberuntungan besar.",
  ],
  en: [
    "Today the energy of {zodiac} is in a good position to start. The stars show that what you've been planning is starting to bear fruit.",
    "There is a positive vibration enveloping your day, {zodiac}. Luck favors those who dare to step forward.",
    "Beware of a little obstacle in the morning, but after noon everything will flow more smoothly. Don't give up.",
    "Your intuition is very sharp today. Use it to make important decisions.",
    "Yesterday may have been tiring, but today is a new page. Open your heart to possibility.",
    "Planet {ruler} gives you the energy of courage. Take advantage!",
    "Today, focus on what you can control. The rest, leave to nature.",
    "Your creativity is at its peak. Very suitable for art work or problem solving.",
    "Don't be afraid to be yourself. Your authenticity is your greatest strength today.",
    "Small changes in routine can bring big luck.",
  ],
  es: [
    "Hoy la energía de {zodiac} está en una buena posición para comenzar. Las estrellas muestran que lo que has estado planeando está empezando a dar frutos.",
    "Hay una vibración positiva envolviendo tu día, {zodiac}. La suerte favorece a quienes se atreven a dar un paso adelante.",
    "Cuidado con un pequeño obstáculo por la mañana, pero después del mediodía todo fluirá más suavemente. No te rindas.",
    "Tu intuición es muy aguda hoy. Úsala para tomar decisiones importantes.",
    "Ayer pudo haber sido agotador, pero hoy es una página nueva. Abre tu corazón a la posibilidad.",
    "El planeta {ruler} te da la energía del coraje. ¡Aprovéchala!",
    "Hoy, concéntrate en lo que puedes controlar. El resto, déjalo a la naturaleza.",
    "Tu creatividad está en su punto máximo. Muy adecuado para el trabajo artístico o la resolución de problemas.",
    "No tengas miedo de ser tú mismo. Tu autenticidad es tu mayor fortaleza hoy.",
    "Pequeños cambios en la rutina pueden traer gran suerte.",
  ],
};

// DO TEXTS
const DO_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Tulis jurnal syukur hari ini.",
    "Tersenyumlah pada orang asing.",
    "Minum air putih lebih banyak dari biasanya.",
    "Luangkan waktu untuk hobi yang sudah lama ditinggalkan.",
    "Hubungi sahabat lama tanpa alasan tertentu.",
    "Bersih-bersih meja kerja atau kamar.",
    "Buat daftar target minggu ini.",
    "Belajar satu hal baru yang simpel.",
    "Jalan kaki 15 menit tanpa HP.",
    "Berdoa atau meditasi sebelum tidur.",
  ],
  en: [
    "Write a gratitude journal today.",
    "Smile at a stranger.",
    "Drink more water than usual.",
    "Take time for a long-abandoned hobby.",
    "Contact an old friend for no particular reason.",
    "Clean your desk or room.",
    "Make a list of this week's targets.",
    "Learn one simple new thing.",
    "Walk for 15 minutes without your phone.",
    "Pray or meditate before sleep.",
  ],
  es: [
    "Escribe un diario de gratitud hoy.",
    "Sonríe a un extraño.",
    "Bebe más agua de lo habitual.",
    "Tómate un tiempo para un hobby abandonado hace mucho tiempo.",
    "Contacta a un viejo amigo sin ninguna razón en particular.",
    "Limpia tu escritorio o habitación.",
    "Haz una lista de los objetivos de esta semana.",
    "Aprende una cosa nueva y simple.",
    "Camina 15 minutos sin tu teléfono.",
    "Reza o medita antes de dormir.",
  ],
};

// AVOID TEXTS
const AVOID_TEXTS_ML: Record<string, string[]> = {
  id: [
    "Menunda pekerjaan penting.",
    "Berkata kasar meski sedang emosi.",
    "Membandingkan diri dengan orang lain di medsos.",
    "Mengambil keputusan penting saat lelah.",
    "Menggosipkan orang lain.",
    "Berpikir negatif berlebihan.",
    "Membuang-buang waktu scrolling tanpa tujuan.",
    "Mengabaikan sinyal tubuh lelah.",
    "Mengonsumsi gula atau kafein terlalu banyak.",
    "Menghindari tanggung jawab.",
  ],
  en: [
    "Procrastinating important work.",
    "Speaking harshly even when emotional.",
    "Comparing yourself to others on social media.",
    "Making important decisions when tired.",
    "Gossiping about others.",
    "Excessive negative thinking.",
    "Wasting time scrolling aimlessly.",
    "Ignoring signs of body tiredness.",
    "Consuming too much sugar or caffeine.",
    "Avoiding responsibility.",
  ],
  es: [
    "Posponer el trabajo importante.",
    "Hablar con dureza incluso cuando estás emocionado.",
    "Compararte con otros en las redes sociales.",
    "Tomar decisiones importantes cuando estás cansado.",
    "Chismear sobre los demás.",
    "Pensamiento negativo excesivo.",
    "Perder el tiempo desplazándose sin rumbo.",
    "Ignorar las señales de cansancio del cuerpo.",
    "Consumir demasiado azúcar o cafeína.",
    "Evitar la responsabilidad.",
  ],
};
// ========== FUNGSI PEMBANGUN RAMALAN MULTI-BAHASA ==========
function getTextByLang<T>(obj: Record<string, T[]>, lang: string): T[] {
  return obj[lang] || obj["id"];
}

function buildHoroscope(zodiac: string, dateStr: string, lang: string) {
  const hash = getDailyHash(zodiac, dateStr);
  
  // Ambil array teks sesuai bahasa
  const careerArray = getTextByLang(CAREER_TEXTS_ML, lang);
  const loveArray = getTextByLang(LOVE_TEXTS_ML, lang);
  const healthArray = getTextByLang(HEALTH_TEXTS_ML, lang);
  const spiritualArray = getTextByLang(SPIRITUAL_TEXTS_ML, lang);
  const quoteArray = getTextByLang(QUOTES_ML, lang);
  const overviewArray = getTextByLang(OVERVIEWS_ML, lang);
  const doArray = getTextByLang(DO_TEXTS_ML, lang);
  const avoidArray = getTextByLang(AVOID_TEXTS_ML, lang);
  
  // Pilih indeks berdasarkan hash (agar deterministik per hari)
  const careerIdx = hash % careerArray.length;
  const loveIdx = (hash >> 3) % loveArray.length;
  const healthIdx = (hash >> 6) % healthArray.length;
  const spiritualIdx = (hash >> 9) % spiritualArray.length;
  const quoteIdx = (hash >> 12) % quoteArray.length;
  const overviewIdx = (hash >> 27) % overviewArray.length;
  const doIdx = (hash >> 21) % doArray.length;
  const avoidIdx = (hash >> 24) % avoidArray.length;
  
  // Lucky numbers & colors (universal)
  const luckyNumbers = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,31,33,37,42,45,55,66,77,88,99];
  const luckyColors = ["Merah","Biru","Hijau","Kuning","Ungu","Pink","Oranye","Hitam","Putih","Emas","Perak","Turquoise","Lavender","Koral","Magenta","Teal","Lime","Navy","Platinum"];
  const luckyNumIdx = (hash >> 15) % luckyNumbers.length;
  const colorIdx = (hash >> 18) % luckyColors.length;
  
  // Mood dinamis
  const moodValue = 30 + (hash % 70);
  let moodText = "";
  if (moodValue >= 80) moodText = lang === "id" ? "Sangat Bahagia 🌟" : (lang === "en" ? "Very Happy 🌟" : "Muy Feliz 🌟");
  else if (moodValue >= 65) moodText = lang === "id" ? "Positif & Semangat ☀️" : (lang === "en" ? "Positive & Energetic ☀️" : "Positivo y Enérgico ☀️");
  else if (moodValue >= 45) moodText = lang === "id" ? "Stabil & Tenang 🍃" : (lang === "en" ? "Stable & Calm 🍃" : "Estable y Tranquilo 🍃");
  else if (moodValue >= 25) moodText = lang === "id" ? "Sedikit Lelah 🌧️" : (lang === "en" ? "Slightly Tired 🌧️" : "Un Poco Cansado 🌧️");
  else moodText = lang === "id" ? "Butuh Istirahat 🛌" : (lang === "en" ? "Need Rest 🛌" : "Necesita Descanso 🛌");
  
  // Dapatkan ruler zodiak untuk ditampilkan di overview (jika placeholder {ruler} ada)
  const zodiacData = ZODIAC_LIST.find(z => z.name === zodiac);
  const rulerName = zodiacData ? (RULERS[lang]?.[zodiacData.rulerKey] || zodiacData.rulerKey) : "";
  
  // Overview teks mungkin mengandung placeholder {zodiac} dan {ruler}
  let overviewText = overviewArray[overviewIdx];
  overviewText = overviewText.replace(/\{zodiac\}/g, zodiac);
  overviewText = overviewText.replace(/\{ruler\}/g, rulerName);
  
  return {
    career: careerArray[careerIdx],
    love: loveArray[loveIdx],
    health: healthArray[healthIdx],
    spiritual: spiritualArray[spiritualIdx],
    quote: quoteArray[quoteIdx],
    luckyNumber: luckyNumbers[luckyNumIdx],
    luckyColor: luckyColors[colorIdx],
    doActivity: doArray[doIdx],
    avoidActivity: avoidArray[avoidIdx],
    mood: moodText,
    moodValue,
    overview: overviewText,
  };
}
// ========== KOMPONEN UTAMA ==========
export default function TodayHoroscope() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  const elements = ELEMENTS[lang] || ELEMENTS["id"];
  const rulers = RULERS[lang] || RULERS["id"];
  
  const [selectedZodiac, setSelectedZodiac] = useState("Aries");
  const [todayStr, setTodayStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [horoscope, setHoroscope] = useState<any>(null);
  const [analyzed, setAnalyzed] = useState(false);

  // Set tanggal hari ini dengan format sesuai bahasa
  useEffect(() => {
    const now = new Date();
    const weekdays: Record<string, string[]> = {
      id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
      en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    };
    const months: Record<string, string[]> = {
      id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    };
    const weekdayName = weekdays[lang]?.[now.getDay()] || weekdays["id"][now.getDay()];
    const monthName = months[lang]?.[now.getMonth()] || months["id"][now.getMonth()];
    setTodayStr(`${weekdayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`);
  }, [lang]);

  // Update ramalan saat zodiak berubah atau tanggal berubah
  useEffect(() => {
    if (todayStr) {
      setLoading(true);
      setAnalyzed(false);
      setTimeout(() => {
        const data = buildHoroscope(selectedZodiac, todayStr, lang);
        setHoroscope(data);
        setAnalyzed(true);
        setLoading(false);
      }, 700);
    }
  }, [selectedZodiac, todayStr, lang]);

  const currentZodiac = ZODIAC_LIST.find(z => z.name === selectedZodiac);
  const elementName = currentZodiac ? elements[currentZodiac.elementKey] : "";
  const rulerName = currentZodiac ? rulers[currentZodiac.rulerKey] : "";

  const handleShare = async () => {
    if (!horoscope) return;
    const text = `${dict.title} - ${selectedZodiac} ${currentZodiac?.symbol}\n${todayStr}\n\n${horoscope.overview}\n\n${dict.career}: ${horoscope.career}\n${dict.love}: ${horoscope.love}\n${dict.health}: ${horoscope.health}\n${dict.luckyNumber}: ${horoscope.luckyNumber} | ${dict.luckyColorLabel}: ${horoscope.luckyColor}\n${dict.do}: ${horoscope.doActivity}\n${dict.avoid}: ${horoscope.avoidActivity}\n\n${horoscope.quote}\n\n${dict.disclaimer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${dict.title} ${selectedZodiac}`, text });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
      } catch (err) {}
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🔮✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        {analyzed && horoscope && (
          <button
            onClick={handleShare}
            className="absolute right-0 top-0 md:relative md:mt-3 inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition"
          >
            📤 {dict.shareBtn}
          </button>
        )}
        <div className="mt-2 text-xs text-cyan-400 flex items-center justify-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {todayStr}
        </div>
      </div>

      {/* Pilih Zodiak */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {ZODIAC_LIST.map((z) => (
          <button
            key={z.name}
            onClick={() => setSelectedZodiac(z.name)}
            className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
              selectedZodiac === z.name
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 ring-2 ring-white/30"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span className="mr-1">{z.symbol}</span> {z.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-pink-500 animate-spin"></div>
          </div>
          <p className="text-purple-400 text-xs font-mono tracking-widest animate-pulse">{dict.loadingText}</p>
        </div>
      )}

      {/* Empty state (sebelum loading pertama) */}
      {!loading && !analyzed && !horoscope && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">Memuat horoskop...</p>
        </div>
      )}

      {/* Hasil Ramalan */}
      {!loading && analyzed && horoscope && currentZodiac && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-pink-950/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <span className="text-8xl drop-shadow-2xl">{currentZodiac.symbol}</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                {selectedZodiac}
              </h3>
              <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-slate-300">
                <span className="bg-white/10 px-2 py-1 rounded-full">📅 {currentZodiac.date}</span>
                <span className="bg-white/10 px-2 py-1 rounded-full">🔥 {dict.element} {elementName}</span>
                <span className="bg-white/10 px-2 py-1 rounded-full">🪐 {dict.ruler} {rulerName}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                {dict.mood}: {horoscope.mood}
              </div>
            </div>

            {/* Overview */}
            <div className="mt-6 p-5 bg-white/5 rounded-xl border border-white/10 text-center">
              <p className="text-cyan-200 text-sm md:text-base leading-relaxed">{horoscope.overview}</p>
            </div>

            {/* 3 Kolom Ramalan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">
              <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 hover:scale-105 transition-transform duration-300">
                <h4 className="text-blue-400 font-black text-xs uppercase tracking-wider">💼 {dict.career}</h4>
                <p className="text-slate-200 text-xs mt-2 leading-relaxed">{horoscope.career}</p>
              </div>
              <div className="bg-pink-500/10 p-4 rounded-xl border border-pink-500/20 hover:scale-105 transition-transform duration-300">
                <h4 className="text-pink-400 font-black text-xs uppercase tracking-wider">❤️ {dict.love}</h4>
                <p className="text-slate-200 text-xs mt-2 leading-relaxed">{horoscope.love}</p>
              </div>
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 hover:scale-105 transition-transform duration-300">
                <h4 className="text-emerald-400 font-black text-xs uppercase tracking-wider">🩺 {dict.health}</h4>
                <p className="text-slate-200 text-xs mt-2 leading-relaxed">{horoscope.health}</p>
              </div>
            </div>

            {/* Do & Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                <h4 className="text-green-400 font-black text-xs uppercase tracking-wider">{dict.do}</h4>
                <p className="text-slate-200 text-sm mt-1">{horoscope.doActivity}</p>
              </div>
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-black text-xs uppercase tracking-wider">{dict.avoid}</h4>
                <p className="text-slate-200 text-sm mt-1">{horoscope.avoidActivity}</p>
              </div>
            </div>

            {/* Lucky & Spiritual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 text-center">
                <span className="text-yellow-400 text-sm font-black">{dict.luckyNumber}</span>
                <p className="text-4xl font-black text-yellow-300 mt-1">{horoscope.luckyNumber}</p>
                <span className="text-xs text-slate-300">{dict.luckyColorLabel}: {horoscope.luckyColor}</span>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <h4 className="text-purple-400 font-black text-xs uppercase tracking-wider">{dict.spiritual}</h4>
                <p className="text-slate-200 text-xs mt-1 leading-relaxed">{horoscope.spiritual}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 p-5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
              <p className="text-amber-200 text-sm md:text-base italic">{horoscope.quote}</p>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-[10px] text-slate-500 pt-3 mt-4 opacity-70 border-t border-slate-800">
              {dict.disclaimer}
            </div>

            {/* INJEKSI PAYWALL MULAI DARI SINI */}
            <PremiumPaywall 
              toolName={dict.title} 
              resultId={`${selectedZodiac}-${todayStr}`} 
            />
            {/* SAMPAI SINI */}

          </div>
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
      `}</style>
    </div>
  );
}