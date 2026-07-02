"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== INTERFACE & KAMUS UI ==========
interface PastLifeData {
  id: string; emoji: string; crystal: string; element: string; planet: string;
  gradientBg: string; gradientText: string;
  data: Record<string, { role: string; era: string; location: string; desc: string; karma: string; message: string; color: string; }>;
}

const UI_DICT: Record<string, any> = {
  id: {
    title: "Misteri Reinkarnasi", subtitle: "Setiap jiwa menyimpan memori kuno. Masukkan identitas Anda untuk membongkar", akashic: "Catatan Akashic",
    phName: "Nama lengkap Anda", btnReveal: "Bongkar Kehidupan Masa Lalu",
    steps: ["Menyusuri lorong waktu...", "Membaca memori DNA...", "Menyandingkan karma..."],
    badge: "JEJAK MASA LALU", lblStory: "📖 Kisah Hidup", lblKarma: "✨ Karma Bawaan", lblMsg: "🌠 Pesan Alam Semesta",
    lblCrystal: "🔮 Batu", lblElement: "🌿 Elemen", lblPlanet: "🪐 Planet", lblColor: "🎨 Warna Aura",
    shareBtn: "📤 Bagikan Sejarah Jiwa", tweetBtn: "🐦 Tweet",
    sharePrefix: "Di kehidupan lalu aku adalah seorang", shareSuffix: "Bongkar misteri reinkarnasimu di AksaraDiri!",
    disclaimer: "*Algoritma ini menggunakan sistem komputasi hash berdasarkan resonansi nama dan konstelasi waktu kelahiran untuk memicu narasi arketipe psikologis.",
    copied: "Catatan Akashic disalin ke clipboard!"
  },
  en: {
    title: "Reincarnation Mystery", subtitle: "Every soul holds ancient memories. Enter your identity to unlock the", akashic: "Akashic Records",
    phName: "Your full name", btnReveal: "Reveal Past Life",
    steps: ["Tracing the corridors of time...", "Reading DNA memory...", "Aligning karma..."],
    badge: "PAST TRACES", lblStory: "📖 Life Story", lblKarma: "✨ Innate Karma", lblMsg: "🌠 Universe's Message",
    lblCrystal: "🔮 Crystal", lblElement: "🌿 Element", lblPlanet: "🪐 Planet", lblColor: "🎨 Aura Color",
    shareBtn: "📤 Share Soul History", tweetBtn: "🐦 Tweet",
    sharePrefix: "In a past life, I was a", shareSuffix: "Uncover your reincarnation mystery at AksaraDiri!",
    disclaimer: "*This algorithm uses a hash computation system based on name resonance and birth time constellations to trigger psychological archetype narratives.",
    copied: "Akashic Records copied to clipboard!"
  },
  es: {
    title: "Misterio de Reencarnación", subtitle: "Cada alma guarda recuerdos antiguos. Ingresa tu identidad para desbloquear los", akashic: "Registros Akáshicos",
    phName: "Tu nombre completo", btnReveal: "Revelar Vida Pasada",
    steps: ["Trazando los pasillos del tiempo...", "Leyendo memoria de ADN...", "Alineando el karma..."],
    badge: "RASTROS PASADOS", lblStory: "📖 Historia de Vida", lblKarma: "✨ Karma Innato", lblMsg: "🌠 Mensaje del Universo",
    lblCrystal: "🔮 Cristal", lblElement: "🌿 Elemento", lblPlanet: "🪐 Planeta", lblColor: "🎨 Color de Aura",
    shareBtn: "📤 Compartir Historia", tweetBtn: "🐦 Tuitear",
    sharePrefix: "En una vida pasada, fui", shareSuffix: "¡Descubre tu misterio de reencarnación en AksaraDiri!",
    disclaimer: "*Este algoritmo utiliza un sistema hash basado en la resonancia del nombre y las constelaciones de nacimiento para desencadenar narrativas de arquetipos.",
    copied: "¡Registros Akáshicos copiados al portapapeles!"
  }
};

// ========== DATABASE REINKARNASI (20 ARKETIPE MULTI-BAHASA) ==========
const PAST_LIFE_DB: PastLifeData[] = [
  {
    id: "ALX", emoji: "📜", crystal: "Safir Biru / Blue Sapphire", element: "Udara / Air", planet: "Merkurius / Mercury",
    gradientBg: "from-amber-900/60 to-yellow-950/80 border-amber-700/50", gradientText: "from-amber-300 to-yellow-500",
    data: {
      id: { role: "Pustakawan Agung", era: "Abad ke-3 SM", location: "Perpustakaan Alexandria, Mesir", color: "Biru Muda",
        desc: "Anda menghabiskan hidup dikelilingi ribuan gulungan perkamen rahasia alam semesta. Anda adalah pelindung ilmu yang mendedikasikan hidup demi melestarikan kebijaksanaan umat manusia dari ancaman perang.",
        karma: "Anda memiliki rasa haus tak terpuaskan akan informasi, sering overthinking, dan selalu mencari makna logis di balik setiap peristiwa.",
        message: "Jangan biarkan rasa ingin tahu menguras energimu. Ketahui apa yang perlu, dan biarkan misteri tetap menjadi keindahan." },
      en: { role: "Grand Librarian", era: "3rd Century BC", location: "Library of Alexandria, Egypt", color: "Light Blue",
        desc: "You spent your life surrounded by thousands of parchment scrolls of universe secrets. You were a protector of knowledge, preserving human wisdom from war.",
        karma: "You have an unquenchable thirst for information, often overthink, and always seek logical meaning behind every event.",
        message: "Don't let curiosity drain your energy. Know what is necessary, and let the mystery remain beautiful." },
      es: { role: "Gran Bibliotecario", era: "Siglo III a.C.", location: "Biblioteca de Alejandría, Egipto", color: "Azul Claro",
        desc: "Pasaste tu vida rodeado de pergaminos con secretos del universo. Fuiste un protector del conocimiento, preservando la sabiduría humana de la guerra.",
        karma: "Tienes una sed insaciable de información, piensas demasiado y buscas el significado lógico detrás de cada evento.",
        message: "No dejes que la curiosidad drene tu energía. Conoce lo necesario y deja que el misterio siga siendo hermoso." }
    }
  },
  {
    id: "SAM", emoji: "⚔️", crystal: "Batu Giok / Jade", element: "Api / Fire", planet: "Mars",
    gradientBg: "from-red-900/60 to-slate-950/80 border-red-700/50", gradientText: "from-red-400 to-rose-500",
    data: {
      id: { role: "Samurai Tanpa Tuan (Ronin)", era: "Periode Sengoku", location: "Kyoto, Jepang", color: "Merah Gelap",
        desc: "Setelah tuan Anda gugur, Anda menolak menyerah pada sistem korup. Anda berkelana sebagai pendekar pedang soliter yang melindungi desa miskin tanpa pamrih dengan kode etik ketat.",
        karma: "Anda sangat mandiri, benci ketidakadilan, dan rela berkorban demi orang yang pantas dilindungi.",
        message: "Kehormatan sejati bukanlah tentang kemenangan, tapi tentang keteguhan hati saat sendirian." },
      en: { role: "Masterless Samurai (Ronin)", era: "Sengoku Period", location: "Kyoto, Japan", color: "Dark Red",
        desc: "After your lord fell, you refused to yield to a corrupt system. You wandered as a solitary swordsman protecting poor villages with a strict code of honor.",
        karma: "You are fiercely independent, hate injustice, and willing to sacrifice yourself for those worth protecting.",
        message: "True honor is not about victory, but about steadfastness when you are alone." },
      es: { role: "Samurái Sin Señor (Ronin)", era: "Período Sengoku", location: "Kioto, Japón", color: "Rojo Oscuro",
        desc: "Tras la caída de tu señor, te negaste a ceder ante un sistema corrupto. Vagaste como un espadachín solitario protegiendo aldeas pobres con un estricto código de honor.",
        karma: "Eres ferozmente independiente, odias la injusticia y estás dispuesto a sacrificarte por quienes lo merecen.",
        message: "El verdadero honor no se trata de la victoria, sino de la firmeza cuando estás solo." }
    }
  },
  {
    id: "BOH", emoji: "🎨", crystal: "Ametis / Amethyst", element: "Air / Water", planet: "Neptunus / Neptune",
    gradientBg: "from-purple-900/60 to-fuchsia-950/80 border-purple-700/50", gradientText: "from-purple-300 to-fuchsia-400",
    data: {
      id: { role: "Seniman Bohemian", era: "Belle Époque", location: "Paris, Prancis", color: "Ungu Muda",
        desc: "Hidup miskin materi namun kaya emosi. Hari-hari dihabiskan melukis mahakarya yang tak dihargai di masanya, dan mencintai dengan gairah membara.",
        karma: "Apresiasi tinggi terhadap estetika, sering merasa disalahpahami, dan emosi yang fluktuatif.",
        message: "Karya terbaikmu bukanlah yang di galeri, tapi jejak cinta pada mereka yang kau sentuh." },
      en: { role: "Bohemian Artist", era: "Belle Époque", location: "Paris, France", color: "Light Purple",
        desc: "Lived poor in material but rich in emotion. Spent days painting unappreciated masterpieces, loving with burning passion.",
        karma: "High appreciation for aesthetics, often feel misunderstood, and have highly fluctuating emotions.",
        message: "Your best work isn't in a gallery, but the trace of love left on those you touched." },
      es: { role: "Artista Bohemio", era: "Belle Époque", location: "París, Francia", color: "Púrpura Claro",
        desc: "Vivió pobre en lo material pero rico en emociones. Pintaba obras maestras poco apreciadas, amando con pasión ardiente.",
        karma: "Alta apreciación por la estética, a menudo te sientes incomprendido y con emociones fluctuantes.",
        message: "Tu mejor obra no está en una galería, sino en la huella de amor en quienes tocaste." }
    }
  },
  {
    id: "NRS", emoji: "🌿", crystal: "Kuarsa / Quartz", element: "Tanah / Earth", planet: "Bulan / Moon",
    gradientBg: "from-emerald-900/60 to-teal-950/80 border-emerald-700/50", gradientText: "from-emerald-300 to-teal-400",
    data: {
      id: { role: "Tabib Hutan", era: "Zaman Viking", location: "Skandinavia", color: "Hijau Toska",
        desc: "Anda meracik ramuan herbal di gubuk kayu. Memahami bahasa tanaman, Anda sering dianggap penyihir putih yang menolong prajurit.",
        karma: "Empati tingkat tinggi, sering jadi tempat curhat, energi terkuras jika lama di keramaian.",
        message: "Menyembuhkan orang lain dimulai dari menyembuhkan diri sendiri." },
      en: { role: "Forest Healer", era: "Viking Age", location: "Scandinavia", color: "Turquoise",
        desc: "You brewed herbal potions in a wooden hut. Understanding plants, you were considered a white witch who helped soldiers.",
        karma: "High empathy, often a confidant, energy drains quickly in crowds.",
        message: "Healing others begins with healing yourself." },
      es: { role: "Sanador del Bosque", era: "Era Vikinga", location: "Escandinavia", color: "Turquesa",
        desc: "Preparabas pociones en una cabaña. Entendías las plantas y eras considerado un brujo blanco que ayudaba a los soldados.",
        karma: "Alta empatía, a menudo confidente, la energía se drena rápido en multitudes.",
        message: "Sanar a otros comienza con sanarte a ti mismo." }
    }
  },
  {
    id: "MJP", emoji: "🏯", crystal: "Akik / Agate", element: "Api / Fire", planet: "Matahari / Sun",
    gradientBg: "from-orange-900/60 to-red-950/80 border-orange-700/50", gradientText: "from-orange-400 to-red-500",
    data: {
      id: { role: "Senopati Kerajaan", era: "Abad ke-14", location: "Kerajaan Majapahit", color: "Oranye",
        desc: "Panglima perang yang menaklukkan lautan dan menyatukan nusantara. Ahli strategi yang ditakuti musuh dan dihormati bawahan.",
        karma: "Insting kepemimpinan dominan, tidak suka diatur orang tidak kompeten, sangat protektif.",
        message: "Kekuatan sejati bukan menguasai orang lain, tapi menguasai diri sendiri." },
      en: { role: "Royal Commander", era: "14th Century", location: "Majapahit Empire", color: "Orange",
        desc: "A warlord who conquered seas and united the archipelago. A feared strategist respected by subordinates.",
        karma: "Dominant leadership instinct, dislikes being managed by incompetents, highly protective.",
        message: "True strength isn't mastering others, but mastering yourself." },
      es: { role: "Comandante Real", era: "Siglo XIV", location: "Imperio Majapahit", color: "Naranja",
        desc: "Un señor de la guerra que conquistó mares y unió el archipiélago. Un estratega temido y respetado.",
        karma: "Instinto de liderazgo dominante, no le gusta ser dirigido por incompetentes, muy protector.",
        message: "La verdadera fuerza no es dominar a otros, sino dominarte a ti mismo." }
    }
  },
{
    id: "NAV", emoji: "🧭", crystal: "Larimar", element: "Air / Water", planet: "Jupiter",
    gradientBg: "from-cyan-900/60 to-blue-950/80 border-cyan-700/50", gradientText: "from-cyan-300 to-blue-400",
    data: {
      id: { role: "Navigator Bintang", era: "Abad ke-16", location: "Polinesia", color: "Biru Langit",
        desc: "Mengarungi lautan ganas tanpa kompas, hanya bermodal rasi bintang. Jiwa bebas yang selalu mencari cakrawala baru.",
        karma: "Fobia rutinitas monoton, bosan jika di satu tempat terlalu lama, dan mendambakan kebebasan absolut.",
        message: "Rumah bukanlah tempat, melainkan perasaan damai di hati yang kau bawa ke mana pun." },
      en: { role: "Star Navigator", era: "16th Century", location: "Polynesia", color: "Sky Blue",
        desc: "Sailed fierce oceans without a compass, guided only by stars. A free spirit always seeking new horizons.",
        karma: "Phobia of monotonous routines, bored if in one place too long, craving absolute freedom.",
        message: "Home is not a place, but a feeling of peace in your heart that you carry everywhere." },
      es: { role: "Navegante de Estrellas", era: "Siglo XVI", location: "Polinesia", color: "Azul Cielo",
        desc: "Navegaste océanos feroces sin brújula, guiado solo por las estrellas. Un espíritu libre buscando nuevos horizontes.",
        karma: "Fobia a las rutinas monótonas, te aburres si estás en un lugar demasiado tiempo y anhelas libertad absoluta.",
        message: "El hogar no es un lugar, sino un sentimiento de paz en tu corazón que llevas a todas partes." }
    }
  },
  {
    id: "PHI", emoji: "🏛️", crystal: "Obsidian", element: "Udara / Air", planet: "Saturnus / Saturn",
    gradientBg: "from-slate-800/60 to-gray-950/80 border-slate-600/50", gradientText: "from-slate-300 to-gray-400",
    data: {
      id: { role: "Filsuf Jalanan", era: "Abad ke-4 SM", location: "Athena, Yunani Kuno", color: "Hitam",
        desc: "Menghabiskan hari berdebat di alun-alun, menantang doktrin penguasa. Dieksekusi karena pemikiran revolusioner.",
        karma: "Sering over-analisis, skeptis terhadap aturan buta, lebih suka kebenaran pahit daripada kebohongan manis.",
        message: "Keraguan adalah awal kebijaksanaan, tapi terlalu banyak keraguan melumpuhkan tindakan." },
      en: { role: "Street Philosopher", era: "4th Century BC", location: "Athens, Ancient Greece", color: "Black",
        desc: "Spent days debating in squares, challenging doctrines. Executed for revolutionary thoughts.",
        karma: "Often over-analyze, skeptical of blind rules, preferring bitter truths over sweet lies.",
        message: "Doubt is the beginning of wisdom, but too much doubt paralyzes action." },
      es: { role: "Filósofo Callejero", era: "Siglo IV a.C.", location: "Atenas, Antigua Grecia", color: "Negro",
        desc: "Pasabas días debatiendo en plazas, desafiando doctrinas. Ejecutado por pensamientos revolucionarios.",
        karma: "A menudo analizas en exceso, eres escéptico ante reglas ciegas y prefieres verdades amargas a mentiras dulces.",
        message: "La duda es el principio de la sabiduría, pero demasiada duda paraliza la acción." }
    }
  },
  {
    id: "VIC", emoji: "🎩", crystal: "Turmalin Hitam / Black Tourmaline", element: "Tanah / Earth", planet: "Venus",
    gradientBg: "from-rose-900/60 to-pink-950/80 border-rose-700/50", gradientText: "from-rose-300 to-pink-400",
    data: {
      id: { role: "Bangsawan Pemberontak", era: "Era Victoria", location: "London, Inggris", color: "Marun",
        desc: "Lahir kaya namun muak dengan kemunafikan kelas atas. Diam-diam mendanai panti asuhan dan mengkritik pemerintah.",
        karma: "Punya selera tinggi alami namun benci kesombongan. Paling tidak suka dihakimi dari harta.",
        message: "Kebebasan sejati adalah saat kau bisa menjadi dirimu tanpa topeng, di mana pun berada." },
      en: { role: "Rebel Aristocrat", era: "Victorian Era", location: "London, England", color: "Maroon",
        desc: "Born rich but sick of high-class hypocrisy. Secretly funded orphanages and criticized the government.",
        karma: "Natural high taste but hates arrogance. Dislikes being judged by wealth.",
        message: "True freedom is when you can be yourself without a mask, wherever you are." },
      es: { role: "Aristócrata Rebelde", era: "Era Victoriana", location: "Londres, Inglaterra", color: "Granate",
        desc: "Nacido rico pero harto de la hipocresía de la clase alta. Financiabas orfanatos en secreto y criticabas al gobierno.",
        karma: "Buen gusto natural pero odias la arrogancia. No te gusta que te juzguen por la riqueza.",
        message: "La verdadera libertad es cuando puedes ser tú mismo sin máscara, dondequiera que estés." }
    }
  },
  {
    id: "ALC", emoji: "🧪", crystal: "Batu Bulan / Moonstone", element: "Api / Fire", planet: "Pluto",
    gradientBg: "from-indigo-900/60 to-violet-950/80 border-indigo-700/50", gradientText: "from-indigo-400 to-violet-500",
    data: {
      id: { role: "Alkemis Misterius", era: "Renaisans", location: "Praha", color: "Perak",
        desc: "Mengurung diri mencari ramuan keabadian dan mengubah timah jadi emas. Eksperimen gagal namun meletakkan dasar sains.",
        karma: "Terobsesi pengembangan diri dan mencoba segala sistem baru untuk efisiensi hidup.",
        message: "Transformasi sejati bukan mengubah logam, tapi mengubah hati dan pikiran." },
      en: { role: "Mysterious Alchemist", era: "Renaissance", location: "Prague", color: "Silver",
        desc: "Locked yourself away seeking the elixir of immortality and turning lead to gold. Failed but laid science foundations.",
        karma: "Obsessed with self-development and trying new systems for life efficiency.",
        message: "True transformation is not about changing metals, but changing hearts and minds." },
      es: { role: "Alquimista Misterioso", era: "Renacimiento", location: "Praga", color: "Plata",
        desc: "Te encerraste buscando el elixir de la inmortalidad y convertir plomo en oro. Fallaste pero sentaste bases científicas.",
        karma: "Obsesionado con el autodesarrollo y probar nuevos sistemas para la eficiencia de la vida.",
        message: "La verdadera transformación no se trata de cambiar metales, sino de cambiar corazones y mentes." }
    }
  },
  {
    id: "ORC", emoji: "👁️", crystal: "Lapis Lazuli", element: "Udara / Air", planet: "Uranus",
    gradientBg: "from-teal-900/60 to-emerald-950/80 border-teal-700/50", gradientText: "from-teal-300 to-emerald-400",
    data: {
      id: { role: "Penjaga Kuil (Oracle)", era: "1000 SM", location: "Pegunungan Andes", color: "Biru Tua",
        desc: "Terisolasi di puncak kuil membaca pesan dewa. Para raja datang sebelum memutuskan perang.",
        karma: "Intuisi (firasat) menakutkan yang sering benar. Bisa merasakan niat jahat seseorang dari tatapan.",
        message: "Intuisi adalah bisikan jiwa masa lalumu. Jangan abaikan, tapi jangan biarkan menguasai logika." },
      en: { role: "Temple Oracle", era: "1000 BC", location: "Andes Mountains", color: "Dark Blue",
        desc: "Isolated atop a temple reading gods' messages. Kings came before deciding on war.",
        karma: "Frighteningly accurate intuition. Can sense malicious intent just from a glance.",
        message: "Intuition is the whisper of your past soul. Don't ignore it, but don't let it overpower logic." },
      es: { role: "Oráculo del Templo", era: "1000 a.C.", location: "Montañas de los Andes", color: "Azul Oscuro",
        desc: "Aislado en la cima de un templo leyendo mensajes divinos. Los reyes venían antes de ir a la guerra.",
        karma: "Intuición aterradoramente precisa. Puedes sentir intenciones maliciosas solo con una mirada.",
        message: "La intuición es el susurro de tu alma pasada. No la ignores, pero no dejes que domine la lógica." }
    }
  },
  {
    id: "SLK", emoji: "🐫", crystal: "Kalsit Emas / Gold Calcite", element: "Tanah / Earth", planet: "Merkurius / Mercury",
    gradientBg: "from-yellow-900/60 to-amber-950/80 border-yellow-700/50", gradientText: "from-yellow-400 to-amber-500",
    data: {
      id: { role: "Pedagang Jalur Sutra", era: "Abad ke-13", location: "Persia / Jalur Sutra", color: "Kuning",
        desc: "Melintasi gurun berdagang sutra dan permata. Mahir banyak bahasa, selamat dari penyergapan berkat diplomasi.",
        karma: "Kemampuan negosiasi (hustling) natural. Mudah berbaur dan ahli melihat peluang cuan.",
        message: "Kekayaan bukan apa yang kau kumpulkan, tapi berapa banyak kau membantu orang berkembang." },
      en: { role: "Silk Road Merchant", era: "13th Century", location: "Persia / Silk Road", color: "Yellow",
        desc: "Crossed deserts trading silk and gems. Fluent in many languages, survived ambushes through diplomacy.",
        karma: "Natural negotiating (hustling) skills. Blends easily and spots profitable opportunities.",
        message: "Wealth isn't what you hoard, but how much you help others grow." },
      es: { role: "Comerciante de la Ruta de la Seda", era: "Siglo XIII", location: "Persia / Ruta de la Seda", color: "Amarillo",
        desc: "Cruzaste desiertos comerciando seda y gemas. Fluido en muchos idiomas, sobreviviste emboscadas por diplomacia.",
        karma: "Habilidades naturales de negociación. Te mezclas fácilmente y detectas oportunidades rentables.",
        message: "La riqueza no es lo que acumulas, sino cuánto ayudas a otros a crecer." }
    }
  },
  {
    id: "REV", emoji: "🔥", crystal: "Garnet", element: "Api / Fire", planet: "Mars",
    gradientBg: "from-red-900/60 to-orange-950/80 border-red-700/50", gradientText: "from-red-400 to-orange-500",
    data: {
      id: { role: "Pemimpin Revolusi", era: "Akhir Abad ke-18", location: "Paris, Prancis", color: "Merah Terang",
        desc: "Berdiri di barikade meneriakkan kebebasan. Mengorbankan nyawa demi runtuhnya monarki tiran.",
        karma: "Semangat berapi-api, sulit tunduk pada otoritas sewenang-wenang, sering jadi 'suara' bagi yang tak berani.",
        message: "Perubahan besar dimulai dari keberanian satu orang untuk mengatakan 'cukup'." },
      en: { role: "Revolution Leader", era: "Late 18th Century", location: "Paris, France", color: "Bright Red",
        desc: "Stood on barricades shouting for freedom. Sacrificed your life for the fall of a tyrant monarchy.",
        karma: "Fiery spirit, hard to submit to arbitrary authority, often the 'voice' for the voiceless.",
        message: "Great change begins with one person's courage to say 'enough'." },
      es: { role: "Líder de la Revolución", era: "Finales del Siglo XVIII", location: "París, Francia", color: "Rojo Brillante",
        desc: "Te paraste en las barricadas gritando por la libertad. Sacrificaste tu vida por la caída de una tiranía.",
        karma: "Espíritu ardiente, difícil someterse a la autoridad, a menudo eres la 'voz' de los que no tienen voz.",
        message: "El gran cambio comienza con el coraje de una persona para decir 'suficiente'." }
    }
  },
{
    id: "DNC", emoji: "💃", crystal: "Batu Topas / Topaz", element: "Udara / Air", planet: "Venus",
    gradientBg: "from-amber-800/60 to-orange-900/80 border-amber-600/50", gradientText: "from-amber-300 to-orange-400",
    data: {
      id: { role: "Penari Istana", era: "Abad ke-17", location: "Agra, India", color: "Kuning Emas",
        desc: "Penari istana yang membius sultan. Di balik tirai, Anda adalah mata-mata yang mencegah perang saudara.",
        karma: "Keluwesan sosial tinggi, bisa membaca ruangan instan, suka jadi pusat perhatian tapi pandai menyembunyikan agenda.",
        message: "Terkadang topeng yang kita pakai untuk bertahan justru menjadi wajah asli yang baru." },
      en: { role: "Palace Dancer", era: "17th Century", location: "Agra, India", color: "Golden Yellow",
        desc: "A palace dancer mesmerizing sultans. Behind the curtain, you were a spy preventing civil war.",
        karma: "High social flexibility, can read a room instantly, loves attention but hides hidden agendas.",
        message: "Sometimes the mask we wear to survive becomes our new true face." },
      es: { role: "Bailarina de Palacio", era: "Siglo XVII", location: "Agra, India", color: "Amarillo Dorado",
        desc: "Bailarina que hipnotizaba sultanes. Detrás de la cortina, eras una espía que prevenía guerras civiles.",
        karma: "Alta flexibilidad social, lees una habitación al instante, amas la atención pero ocultas agendas.",
        message: "A veces, la máscara que usamos para sobrevivir se convierte en nuestro nuevo rostro verdadero." }
    }
  },
  {
    id: "BKH", emoji: "🧘", crystal: "Giok / Jade", element: "Air / Water", planet: "Bulan / Moon",
    gradientBg: "from-green-900/60 to-lime-950/80 border-green-700/50", gradientText: "from-green-300 to-lime-400",
    data: {
      id: { role: "Bhiksu Pengembara", era: "Abad ke-8", location: "Gunung Tianshan, Cina", color: "Hijau Lumut",
        desc: "Meninggalkan istana menjadi biksu pengembara. Menyebarkan welas asih dan mencatat kitab di gua terpencil.",
        karma: "Sangat menghargai kesendirian, mudah memaafkan, dan terlihat tenang walau di dalam ada badai.",
        message: "Kedamaian bukanlah absennya konflik, tapi kemampuan untuk tidak terikat pada hasil." },
      en: { role: "Wandering Monk", era: "8th Century", location: "Tianshan Mountains, China", color: "Moss Green",
        desc: "Left palace life to be a wandering monk. Spread compassion and wrote scriptures in remote caves.",
        karma: "Deeply values solitude, forgives easily, and looks calm even when there's a storm inside.",
        message: "Peace is not the absence of conflict, but the ability to remain unattached to the outcome." },
      es: { role: "Monje Errante", era: "Siglo VIII", location: "Montañas Tianshan, China", color: "Verde Musgo",
        desc: "Dejaste la vida de palacio para ser un monje errante. Esparcías compasión y escribías escrituras en cuevas.",
        karma: "Valoras mucho la soledad, perdonas fácilmente y pareces tranquilo aunque haya una tormenta en tu interior.",
        message: "La paz no es la ausencia de conflicto, sino la capacidad de no apegarse al resultado." }
    }
  },
  {
    id: "AMZ", emoji: "🏹", crystal: "Akik / Agate", element: "Api / Fire", planet: "Mars",
    gradientBg: "from-rose-800/60 to-red-900/80 border-rose-600/50", gradientText: "from-rose-400 to-red-500",
    data: {
      id: { role: "Prajurit Amazon", era: "1200 SM", location: "Tepi Laut Hitam", color: "Merah Bata",
        desc: "Panglima perang wanita yang mahir memanah di atas kuda. Dihormati oleh bangsa Yunani kuno.",
        karma: "Jiwa petarung yang tak kenal menyerah, sangat mandiri, dan tidak mentolerir diskriminasi.",
        message: "Kekuatan pejuang sejati bukan seberapa keras memukul, tapi seberapa gigih bangkit." },
      en: { role: "Amazon Warrior", era: "1200 BC", location: "Black Sea Coast", color: "Brick Red",
        desc: "A female warlord skilled at horseback archery. Respected by ancient Greeks.",
        karma: "An unyielding fighter's soul, highly independent, and tolerates no discrimination.",
        message: "A true warrior's strength is not how hard they hit, but how fiercely they rise." },
      es: { role: "Guerrera Amazona", era: "1200 a.C.", location: "Costa del Mar Negro", color: "Rojo Ladrillo",
        desc: "Señora de la guerra experta en tiro con arco a caballo. Respetada por los antiguos griegos.",
        karma: "Alma de luchadora inquebrantable, muy independiente y no tolera la discriminación.",
        message: "La fuerza de un verdadero guerrero no es qué tan duro golpea, sino qué tan ferozmente se levanta." }
    }
  },
  {
    id: "SUN", emoji: "☀️", crystal: "Citrine", element: "Api / Fire", planet: "Matahari / Sun",
    gradientBg: "from-yellow-800/60 to-amber-900/80 border-yellow-600/50", gradientText: "from-yellow-400 to-amber-500",
    data: {
      id: { role: "Pendeta Matahari", era: "Abad ke-15", location: "Cusco, Peru", color: "Kuning Cerah",
        desc: "Pemimpin spiritual dewa Inti. Membaca musim dan menjadi penasihat Sapa Inca.",
        karma: "Energi positif menular, suka memotivasi, selalu melihat sisi terang di situasi sulit.",
        message: "Seperti matahari, setiap hari adalah kesempatan baru untuk bersinar." },
      en: { role: "Sun Priest", era: "15th Century", location: "Cusco, Peru", color: "Bright Yellow",
        desc: "Spiritual leader for the sun god Inti. Read seasons and advised the Sapa Inca.",
        karma: "Contagious positive energy, loves motivating, always sees the bright side in hardships.",
        message: "Like the sun, every day is a new chance to shine." },
      es: { role: "Sacerdote del Sol", era: "Siglo XV", location: "Cusco, Perú", color: "Amarillo Brillante",
        desc: "Líder espiritual del dios Inti. Leía las estaciones y aconsejaba al Sapa Inca.",
        karma: "Energía positiva contagiosa, ama motivar, siempre ve el lado bueno en las dificultades.",
        message: "Como el sol, cada día es una nueva oportunidad para brillar." }
    }
  },
  {
    id: "MIN", emoji: "💎", crystal: "Berlian / Diamond", element: "Tanah / Earth", planet: "Saturnus / Saturn",
    gradientBg: "from-slate-800/60 to-neutral-900/80 border-slate-600/50", gradientText: "from-slate-300 to-gray-400",
    data: {
      id: { role: "Penambang Berlian", era: "Abad ke-19", location: "Kimberley, Afrika Selatan", color: "Putih",
        desc: "Menggali tanah tandus bertahun-tahun. Tak pernah menyerah hingga menemukan bongkahan terbesar yang mengubah sejarah.",
        karma: "Sangat tekun dan pantang menyerah. Terkadang terlalu perfeksionis mencari hasil instan.",
        message: "Berlian hanyalah batu biasa sebelum dipoles. Begitu juga dirimu." },
      en: { role: "Diamond Miner", era: "19th Century", location: "Kimberley, South Africa", color: "White",
        desc: "Dug barren land for years. Never gave up until finding the biggest rock that changed history.",
        karma: "Extremely diligent and unyielding. Sometimes too perfectionist seeking instant results.",
        message: "A diamond is just a common rock before it is polished. So are you." },
      es: { role: "Minero de Diamantes", era: "Siglo XIX", location: "Kimberley, Sudáfrica", color: "Blanco",
        desc: "Cavaste tierras estériles por años. Nunca te rendiste hasta encontrar la roca que cambió la historia.",
        karma: "Extremadamente diligente e inquebrantable. A veces demasiado perfeccionista buscando resultados.",
        message: "Un diamante es solo una roca común antes de ser pulido. Tú también lo eres." }
    }
  },
  {
    id: "QUE", emoji: "👸", crystal: "Safir / Sapphire", element: "Udara / Air", planet: "Venus",
    gradientBg: "from-indigo-800/60 to-purple-900/80 border-indigo-600/50", gradientText: "from-indigo-400 to-purple-500",
    data: {
      id: { role: "Ratu Pengadilan", era: "Abad ke-12", location: "Aquitaine, Perancis", color: "Biru Kerajaan",
        desc: "Ratu cerdik yang memainkan politik di balik takhta. Mendirikan universitas dan membawa masa keemasan budaya.",
        karma: "Pandai membaca orang, pengaruh besar di lingkungan sosial, suka mengatur strategi.",
        message: "Kekuasaan bukanlah takhta, tapi seberapa banyak kau memberdayakan orang lain." },
      en: { role: "Court Queen", era: "12th Century", location: "Aquitaine, France", color: "Royal Blue",
        desc: "Astute queen playing politics behind the throne. Founded universities and brought a cultural golden age.",
        karma: "Good at reading people, highly influential socially, loves to strategize.",
        message: "Power is not a throne, but how much you empower others." },
      es: { role: "Reina de la Corte", era: "Siglo XII", location: "Aquitania, Francia", color: "Azul Real",
        desc: "Reina astuta jugando política tras el trono. Fundaste universidades y trajiste una edad de oro.",
        karma: "Buena leyendo a la gente, muy influyente socialmente, ama crear estrategias.",
        message: "El poder no es un trono, sino cuánto empoderas a los demás." }
    }
  },
  {
    id: "PIR", emoji: "🏴‍☠️", crystal: "Giok / Jade", element: "Air / Water", planet: "Neptunus / Neptune",
    gradientBg: "from-cyan-800/60 to-blue-900/80 border-cyan-600/50", gradientText: "from-cyan-400 to-blue-500",
    data: {
      id: { role: "Kapten Bajak Laut", era: "Abad ke-18", location: "Karibia", color: "Biru Laut",
        desc: "Memimpin pemberontak menjarah kapal kaya dengan kode etik: tak menyakiti tawanan tak bersenjata.",
        karma: "Menyukai kebebasan, menentang aturan tak adil, sangat setia pada kelompok kecil.",
        message: "Kebebasan sejati adalah saat kau bisa memilih jalan sendiri, meski berbahaya." },
      en: { role: "Pirate Captain", era: "18th Century", location: "Caribbean", color: "Sea Blue",
        desc: "Led rebels looting rich ships with a code of honor: never hurt unarmed captives.",
        karma: "Loves freedom, defies unfair rules, fiercely loyal to your small crew.",
        message: "True freedom is choosing your own path, even if it's dangerous." },
      es: { role: "Capitán Pirata", era: "Siglo XVIII", location: "Caribe", color: "Azul Mar",
        desc: "Lideraste rebeldes saqueando barcos ricos con honor: nunca lastimar cautivos desarmados.",
        karma: "Ama la libertad, desafía reglas injustas, ferozmente leal a su pequeña tripulación.",
        message: "La verdadera libertad es elegir tu propio camino, incluso si es peligroso." }
    }
  },
  {
    id: "CAT", emoji: "⛪", crystal: "Batu Bata / Brick", element: "Tanah / Earth", planet: "Saturnus / Saturn",
    gradientBg: "from-stone-800/60 to-neutral-900/80 border-stone-600/50", gradientText: "from-stone-400 to-neutral-500",
    data: {
      id: { role: "Pembangun Katedral", era: "Abad ke-13", location: "Chartres, Perancis", color: "Coklat",
        desc: "Arsitek katedral raksasa yang butuh puluhan tahun. Tak pernah melihat hasil akhir, namun imanmu diteruskan generasi berikutnya.",
        karma: "Visi jangka panjang, sabar, sering memulai proyek yang baru berbuah bertahun-tahun kemudian.",
        message: "Apa yang kau tanam hari ini akan memberi naungan bagi anak cucu." },
      en: { role: "Cathedral Builder", era: "13th Century", location: "Chartres, France", color: "Brown",
        desc: "Architect of giant cathedrals taking decades. Never saw the end result, but your faith lived on.",
        karma: "Long-term vision, patient, often starting projects that fruit years later.",
        message: "What you plant today will provide shelter for descendants." },
      es: { role: "Constructor de Catedrales", era: "Siglo XIII", location: "Chartres, Francia", color: "Marrón",
        desc: "Arquitecto de catedrales gigantes. Nunca viste el resultado final, pero tu fe perduró.",
        karma: "Visión a largo plazo, paciente, a menudo inicia proyectos que dan frutos años después.",
        message: "Lo que siembres hoy dará refugio a tus descendientes." }
    }
  }
];

// ========== FUNGSI ALGORITMA PENCARIAN ==========
function getPastLifeIndex(name: string, dob: string): number {
  const seed = (name.trim().toLowerCase() + dob.replace(/-/g, "")).replace(/[^a-z0-9]/g, "");
  if (seed.length === 0) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % PAST_LIFE_DB.length;
}
// ==========================================
// PART 4: KOMPONEN UTAMA & ANTARMUKA UI
// ==========================================
export default function PastLife({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const ui = UI_DICT[activeLang] || UI_DICT["id"];

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PastLifeData | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleReveal = () => {
    if (!name.trim() || !dob) return;
    setLoading(true);
    setResult(null);
    setLoadingStep(0);
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < 2) {
        step++;
        setLoadingStep(step);
      }
    }, 700);
    
    setTimeout(() => {
      clearInterval(interval);
      const index = getPastLifeIndex(name, dob);
      setResult(PAST_LIFE_DB[index]);
      setLoading(false);
      // Confetti mistis
      import("canvas-confetti").then((mod) => {
        mod.default({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#d97706', '#8b5cf6', '#c084fc'] });
      }).catch(() => {});
    }, 2200);
  };

  const handleReset = () => {
    setName("");
    setDob("");
    setResult(null);
  };

  const shareResult = async () => {
    if (!result) return;
    const activeData = result.data[activeLang] || result.data["id"];
    
    const text = `⏳ ${ui.akashic} ⏳\n\n${ui.sharePrefix} ${activeData.role} (${activeData.location}, ${activeData.era}).\n\n${activeData.karma}\n\n${ui.lblMsg}: "${activeData.message}"\n\n${ui.shareSuffix}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: ui.title, text }); } catch(e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert(ui.copied);
    }
  };

  const tweetResult = () => {
    if (!result) return;
    const activeData = result.data[activeLang] || result.data["id"];
    const text = `${ui.sharePrefix} ${activeData.role}. ${ui.shareSuffix}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const activeData = result ? (result.data[activeLang] || result.data["id"]) : null;

  return (
    <div className="max-w-2xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-8">
        <div className="text-7xl mb-3 animate-spin-slow drop-shadow-xl">⏳</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent pb-2">
          {ui.title}
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          {ui.subtitle} <span className="italic text-amber-300">{ui.akashic}</span>.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="space-y-4">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder={ui.phName} 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold text-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
          />
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold focus:ring-2 focus:ring-amber-500 outline-none color-scheme-dark transition-all" 
          />
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleReveal} 
              disabled={loading || !name || !dob} 
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <><span className="animate-spin">⏳</span> {ui.steps[loadingStep]}</>
              ) : (
                <><span>🕰️</span> {ui.btnReveal}</>
              )}
            </button>
            {result && (
              <button 
                onClick={handleReset} 
                className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
                aria-label="Reset"
              >
                🔄
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-16">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-yellow-500/20 border-b-yellow-400 rounded-full animate-spin animate-reverse"></div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">👁️</span>
          </div>
        </div>
      )}

      {result && activeData && !loading && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className={`bg-gradient-to-br ${result.gradientBg} backdrop-blur-xl border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>
            
            <div className="text-center mb-6 relative z-10">
              <div className="text-8xl mb-3 hover:scale-110 transition-transform duration-300 cursor-default drop-shadow-lg">{result.emoji}</div>
              <div className="inline-block px-4 py-1.5 bg-black/40 border border-white/10 rounded-full mb-3">
                <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">{ui.badge}</span>
              </div>
              <h3 className={`text-4xl md:text-5xl font-black bg-gradient-to-b ${result.gradientText} bg-clip-text text-transparent leading-tight pb-1`}>
                {activeData.role}
              </h3>
              <p className="mt-2 text-sm text-amber-400/80 font-medium tracking-wide">
                {activeData.era} • {activeData.location}
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">{ui.lblStory}</p>
                <p className="text-slate-200 text-sm leading-relaxed">{activeData.desc}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 rounded-2xl border-l-4 border-amber-500">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">{ui.lblKarma}</p>
                <p className="text-amber-50 text-sm italic leading-relaxed">{activeData.karma}</p>
              </div>
              <div className="bg-purple-500/10 p-5 rounded-2xl border border-purple-500/20">
                <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-2">{ui.lblMsg}</p>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{activeData.message}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs mt-4">
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-amber-400 font-bold mb-1">{ui.lblCrystal}</span>
                  <span className="text-slate-200">{result.crystal.split('/')[activeLang === 'id' ? 0 : 1]?.trim() || result.crystal}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-amber-400 font-bold mb-1">{ui.lblElement}</span>
                  <span className="text-slate-200">{result.element.split('/')[activeLang === 'id' ? 0 : 1]?.trim() || result.element}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-amber-400 font-bold mb-1">{ui.lblPlanet}</span>
                  <span className="text-slate-200">{result.planet.split('/')[activeLang === 'id' ? 0 : 1]?.trim() || result.planet}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-amber-400 font-bold mb-1">{ui.lblColor}</span>
                  <span className="text-slate-200">{activeData.color}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <button 
                onClick={shareResult} 
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
              >
                {ui.shareBtn}
              </button>
              <button 
                onClick={tweetResult} 
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 text-sm font-bold flex items-center justify-center gap-2 text-[#1DA1F2] transition-all uppercase tracking-wider"
              >
                {ui.tweetBtn}
              </button>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 text-center text-[10px] text-slate-500 border-t border-slate-800/50 pt-5 max-w-lg mx-auto leading-relaxed">
            {ui.disclaimer}
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
            toolName={ui.title} 
            resultId={result.id} 
          />
          {/* SAMPAI SINI */}

        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-reverse { animation-direction: reverse; }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .color-scheme-dark { color-scheme: dark; }
      `}</style>
    </div>
  );
}