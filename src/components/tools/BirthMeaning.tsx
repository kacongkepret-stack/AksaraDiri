"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ==========================================
// PART 1: DATABASE INDONESIA (ASLI 100% TANPA POTONG)
// ==========================================
const dataID = {
  ui: {
    title: "Birthday Meaning",
    subtitle: "Setiap tanggal lahir menyimpan puisi rahasia. Buka pesan dari alam semesta untukmu.",
    placeholder: "Pilih Tanggal Lahir",
    btn: "🎁 Ungkap Makna Kelahiran 🎁",
    loading: "Membaca bintang...",
    lblMonth: "Elemen",
    lblColor: "Warna",
    lblStrength: "✨ Kekuatan dari Tanggal Lahir",
    lblChallenge: "⚠️ Tantangan yang Membentuk",
    lblLove: "❤️ Bahasa Cinta Alami",
    lblDaily: "🌟 Pesan Harian untukmu:",
    shareBtn: "📤 Bagikan Makna Kelahiran",
    disclaimer: "*Makna ini adalah cermin reflektif, bukan ramalan. Setiap hari adalah kesempatan baru."
  },
  months: {
    1: { k: "Pelopor", e: "Api", c: "Merah & Emas", d: "Lahir di awal tahun memberi Anda energi kepemimpinan yang kuat. Anda pembuka jalan, penemu ide, dan tidak takut tampil beda. Semangat Anda menular, dan Anda selalu ingin memulai sesuatu yang baru." },
    2: { k: "Penjaga Hati", e: "Air", c: "Biru Muda & Putih", d: "Anda dilahirkan sebagai penyejuk di tengah panasnya dunia. Kepekaan Anda adalah karunia, karena Anda bisa merasakan apa yang tidak terucap. Anda adalah pendengar terbaik, peneduh bagi jiwa yang lelah." },
    3: { k: "Pesta Kreativitas", e: "Udara", c: "Kuning & Oranye", d: "Anda pembawa tawa, warna, dan ide-ide segar. Anda suka berbagi cerita, menari, atau sekadar membuat orang tersenyum. Kreativitas Anda tidak pernah kering, bagaikan mata air di padang pasir." },
    4: { k: "Pembangun", e: "Tanah", c: "Hijau & Coklat", d: "Anda adalah fondasi bagi siapa pun di sekitar Anda. Kerja keras, ketekunan, dan kejujuran adalah nama tengah Anda. Anda tidak mencari ketenaran, tapi kepuasan karena tahu segalanya berdiri kokoh berkat Anda." },
    5: { k: "Pengembara", e: "Api", c: "Oranye & Biru Langit", d: "Jiwa Anda bebas seperti angin. Anda penasaran dengan dunia, ingin menjelajahi setiap sudut, mencicipi setiap rasa. Hari-hari Anda penuh dengan perubahan dan petualangan kecil." },
    6: { k: "Pengasuh", e: "Air", c: "Hijau Muda & Merah Muda", d: "Anda hadir di dunia untuk merawat, melindungi, dan menciptakan kehangatan. Rumah Anda adalah surga kecil, dan keluarga adalah pusat semesta Anda. Kebaikan Anda menular." },
    7: { k: "Perenung", e: "Air", c: "Ungu & Biru Gelap", d: "Anda menyelami lautan pikiran dan jiwa. Kesendirian bukanlah kutukan, melainkan ruang untuk menemukan jawaban. Anda memiliki kebijaksanaan yang matang di usia muda." },
    8: { k: "Penguasa", e: "Tanah", c: "Hitam & Emas", d: "Anda terlahir dengan naluri bisnis dan kekuasaan yang tajam. Anda melihat peluang di mana orang lain melihat masalah. Namun Anda juga belajar bahwa kekuatan sejati adalah saat bisa membagi." },
    9: { k: "Manusia Sejagat", e: "Api", c: "Putih & Perak", d: "Anda mencintai seluruh umat manusia. Air mata orang asing pun bisa membuat Anda terharu. Anda ada di dunia untuk memaafkan, memulihkan, dan menebar welas asih." },
    10: { k: "Visi Besar", e: "Udara", c: "Biru Langit & Emas", d: "Kombinasi 1 dan 0 memberi Anda kemampuan memulai sesuatu dari nol dan mengembangkannya menjadi besar. Anda adalah pemimpi yang juga eksekutor." },
    11: { k: "Duta Spiritual", e: "Udara", c: "Lavender & Putih", d: "Anda memiliki indra keenam yang tajam. Anda bisa merasakan energi, memprediksi suasana, dan sering 'kebetulan' berada di tempat yang tepat. Anda adalah jembatan antara dunia fisik dan spiritual." },
    12: { k: "Jiwa Seni Total", e: "Air", c: "Turquoise & Merah Muda", d: "Anda adalah kanvas hidup. Setiap emosi Anda adalah warna, setiap pengalaman adalah goresan. Anda menyukai keindahan dan mampu menciptakannya dari hal-hal sederhana." }
  },
  days: {
    1: { t: "Kemandirian Abadi", s: "Berani, inisiatif tinggi", c: "Sulit menerima bantuan", l: "Butuh pasangan yang mengagumi kebebasannya" },
    2: { t: "Pendengar Sejati", s: "Empati, bijak", c: "Overthinking", l: "Romantis dan penuh perhatian pada detail kecil" },
    3: { t: "Bintang Panggung", s: "Kreatif, ekspresif", c: "Mudah bosan", l: "Cinta yang penuh kejutan dan tawa" },
    4: { t: "Benteng", s: "Tekun, dapat diandalkan", c: "Kaku", l: "Setia dan bertanggung jawab, tapi butuh diajak spontan" },
    5: { t: "Jiwa Petualang", s: "Adaptif, energik", c: "Impulsif", l: "Membutuhkan pasangan yang tidak posesif" },
    6: { t: "Ibu/Bapak bagi Dunia", s: "Penyayang, protektif", c: "Suka mengatur", l: "Cinta total dan pengorbanan" },
    7: { t: "Sang Filosof", s: "Analitis, intuitif", c: "Terisolasi", l: "Mencari koneksi jiwa, butuh ruang pribadi" },
    8: { t: "Mogul", s: "Ambisius, cerdas finansial", c: "Workaholic", l: "Pasangan yang setara dan mendukung karier" },
    9: { t: "Dermawan", s: "Pemaaf, idealis", c: "Mudah dimanfaatkan", l: "Cinta universal, kadang lupa diri" },
    10: { t: "Pemimpin Lahiriah", s: "Mandiri, visioner", c: "Dominan", l: "Ingin menjadi pusat perhatian pasangan" },
    11: { t: "Pencerah", s: "Intuitif super", c: "Cemas berlebihan", l: "Butuh pasangan yang stabil secara emosi" },
    12: { t: "Kreator", s: "Imajinasi liar", c: "Kurang praktis", l: "Menyukai kejutan romantis" },
    13: { t: "Pekerja Tangguh", s: "Tekad baja", c: "Pesimis", l: "Setia tapi butuh dorongan semangat" },
    14: { t: "Penjelajah", s: "Fleksibel", c: "Lari dari komitmen", l: "Pasangan harus sebebas dirinya" },
    15: { t: "Seniman Hati", s: "Artistik, penyayang", c: "Mudah terluka", l: "Sangat romantis dan ekspresif" },
    16: { t: "Pencari Kebenaran", s: "Analitis, jujur", c: "Kritis berlebihan", l: "Butuh diskusi mendalam" },
    17: { t: "Raja/Ratu", s: "Karismatik, ambisius", c: "Egois", l: "Ingin dimanjakan dan dipuja" },
    18: { t: "Pembaharu", s: "Idealisme, kepemimpinan", c: "Mudah frustrasi", l: "Pasangan yang sejalan dengan visi besar" },
    19: { t: "Sang Pendobrak", s: "Berani, independen", c: "Cepat marah", l: "Butuh pasangan yang tidak membatasi" },
    20: { t: "Penyejuk", s: "Diplomatis, sabar", c: "Sulit berkata tidak", l: "Mencari kedamaian dan kenyamanan" },
    21: { t: "Inspirator", s: "Optimis, kreatif", c: "Overpromise", l: "Penuh ide romantis" },
    22: { t: "Master Builder", s: "Visi besar + eksekusi", c: "Beban berat", l: "Pasangan yang mendukung misi hidup" },
    23: { t: "Komunikator Ulung", s: "Karismatik, meyakinkan", c: "Inkonsisten", l: "Perlu stimulasi dialog terus" },
    24: { t: "Pengayom", s: "Bertanggung jawab", c: "Khawatir berlebihan", l: "Membangun rumah tangga yang aman" },
    25: { t: "Pemikir Dalam", s: "Intelektual, intuitif", c: "Tertutup", l: "Butuh kepercayaan total" },
    26: { t: "Eksekutor", s: "Praktis, ambisius", c: "Workaholic", l: "Memberi lewat aksi nyata" },
    27: { t: "Filantropis", s: "Pemaaf, dermawan", c: "Mudah kecewa", l: "Mencintai tanpa pamrih" },
    28: { t: "Pemimpin Karismatik", s: "Berwibawa, mandiri", c: "Sulit mendelegasi", l: "Ingin dikagumi pasangan" },
    29: { t: "Pelihat", s: "Intuisi luar biasa", c: "Cemas", l: "Butuh pasangan yang pengertian" },
    30: { t: "Ekspresif Total", s: "Kreatif, sosial", c: "Kurang fokus", l: "Penuh warna dan tawa" },
    31: { t: "Praktisi Ambisius", s: "Disiplin, praktis", c: "Kaku", l: "Setia dan suka merencanakan masa depan" }
  }
};
// ==========================================
// PART 2: DATABASE INGGRIS & SPANYOL (ASLI 100% TANPA POTONG)
// ==========================================
const dataEN = {
  ui: {
    title: "Birth Meaning",
    subtitle: "Every birth date holds a secret poem. Unlock the universe's message for you.",
    placeholder: "Select Birth Date",
    btn: "🎁 Reveal Birth Meaning 🎁",
    loading: "Reading the stars...",
    lblMonth: "Element",
    lblColor: "Color",
    lblStrength: "✨ Core Strengths",
    lblChallenge: "⚠️ Shaping Challenges",
    lblLove: "❤️ Natural Love Language",
    lblDaily: "🌟 Daily Wisdom for you:",
    shareBtn: "📤 Share Birth Meaning",
    disclaimer: "*This reading is a reflective mirror, not a prophecy. Every day is a new opportunity."
  },
  months: {
    1: { k: "The Pioneer", e: "Fire", c: "Red & Gold", d: "Being born at the beginning of the year gives you strong leadership energy. You are a trailblazer, an idea generator, and unafraid to stand out. Your enthusiasm is contagious, and you always want to start something new." },
    2: { k: "Heart Guardian", e: "Water", c: "Light Blue & White", d: "You were born as a soothing presence in a heated world. Your sensitivity is a gift, as you can feel what remains unspoken. You are the best listener, a shelter for weary souls." },
    3: { k: "Creative Party", e: "Air", c: "Yellow & Orange", d: "You bring laughter, color, and fresh ideas. You love sharing stories, dancing, or simply making people smile. Your creativity never runs dry, like a spring in the desert." },
    4: { k: "The Builder", e: "Earth", c: "Green & Brown", d: "You are the foundation for everyone around you. Hard work, perseverance, and honesty are your middle names. You don't seek fame, but the satisfaction of knowing everything stands strong because of you." },
    5: { k: "The Wanderer", e: "Fire", c: "Orange & Sky Blue", d: "Your soul is free as the wind. You are curious about the world, wanting to explore every corner and taste every flavor. Your days are filled with changes and little adventures." },
    6: { k: "The Caregiver", e: "Water", c: "Light Green & Pink", d: "You are in this world to nurture, protect, and create warmth. Your home is a little paradise, and family is the center of your universe. Your kindness is contagious." },
    7: { k: "The Ponderer", e: "Water", c: "Purple & Dark Blue", d: "You dive into the ocean of thoughts and souls. Solitude is not a curse, but a space to find answers. You possess mature wisdom at a young age." },
    8: { k: "The Ruler", e: "Earth", c: "Black & Gold", d: "You are born with sharp business and power instincts. You see opportunities where others see problems. However, you also learn that true power comes when you can share." },
    9: { k: "Universal Human", e: "Fire", c: "White & Silver", d: "You love all of humanity. Even a stranger's tears can move you. You are in the world to forgive, heal, and spread compassion." },
    10: { k: "Grand Vision", e: "Air", c: "Sky Blue & Gold", d: "The combination of 1 and 0 gives you the ability to start from scratch and grow it into something massive. You are a dreamer who is also an executor." },
    11: { k: "Spiritual Envoy", e: "Air", c: "Lavender & White", d: "You have a sharp sixth sense. You can feel energies, predict moods, and often 'coincidentally' find yourself in the right place. You are a bridge between the physical and spiritual worlds." },
    12: { k: "Total Artist", e: "Water", c: "Turquoise & Pink", d: "You are a living canvas. Every emotion is a color, every experience a brushstroke. You love beauty and can create it from simple things." }
  },
  days: {
    1: { t: "Eternal Independence", s: "Brave, high initiative", c: "Hard to accept help", l: "Needs a partner who admires their freedom" },
    2: { t: "True Listener", s: "Empathetic, wise", c: "Overthinking", l: "Romantic and attentive to small details" },
    3: { t: "Stage Star", s: "Creative, expressive", c: "Easily bored", l: "Love full of surprises and laughter" },
    4: { t: "The Fortress", s: "Persistent, reliable", c: "Rigid", l: "Loyal and responsible, but needs spontaneous dates" },
    5: { t: "Adventurous Soul", s: "Adaptive, energetic", c: "Impulsive", l: "Needs a non-possessive partner" },
    6: { t: "World's Parent", s: "Loving, protective", c: "Bossy", l: "Total love and sacrifice" },
    7: { t: "The Philosopher", s: "Analytical, intuitive", c: "Isolated", l: "Seeks deep soul connections, needs personal space" },
    8: { t: "The Mogul", s: "Ambitious, financially smart", c: "Workaholic", l: "An equal partner who supports their career" },
    9: { t: "The Philanthropist", s: "Forgiving, idealist", c: "Easily taken advantage of", l: "Universal love, sometimes forgets themselves" },
    10: { t: "Born Leader", s: "Independent, visionary", c: "Dominant", l: "Wants to be the center of attention for their partner" },
    11: { t: "Soul Illuminator", s: "Super intuitive", c: "Overly anxious", l: "Needs an emotionally stable partner" },
    12: { t: "The Creator", s: "Wild imagination", c: "Impractical", l: "Loves romantic surprises" },
    13: { t: "Tough Worker", s: "Iron will", c: "Pessimistic", l: "Loyal but needs words of encouragement" },
    14: { t: "The Explorer", s: "Flexible", c: "Runs from commitment", l: "Partner must be as free as they are" },
    15: { t: "Heart Artist", s: "Artistic, gentle", c: "Easily hurt", l: "Very romantic and expressive" },
    16: { t: "Truth Seeker", s: "Analytical, honest", c: "Overly critical", l: "Needs deep discussions" },
    17: { t: "The Royal", s: "Charismatic, ambitious", c: "Selfish", l: "Wants to be pampered and adored" },
    18: { t: "The Reformer", s: "Idealism, leadership", c: "Easily frustrated", l: "A partner aligned with their grand vision" },
    19: { t: "The Breaker", s: "Brave, independent", c: "Quick-tempered", l: "Needs a partner who doesn't restrict them" },
    20: { t: "Heart Soother", s: "Diplomatic, patient", c: "Can't say no", l: "Seeks peace and comfort" },
    21: { t: "The Inspirer", s: "Optimistic, creative", c: "Overpromises", l: "Full of romantic ideas" },
    22: { t: "Master Builder", s: "Grand vision + execution", c: "Heavy burden", l: "A partner who supports their life mission" },
    23: { t: "Master Communicator", s: "Charismatic, convincing", c: "Inconsistent", l: "Needs constant dialogue stimulation" },
    24: { t: "The Protector", s: "Responsible", c: "Over-worries", l: "Builds a safe and secure household" },
    25: { t: "Deep Thinker", s: "Intellectual, intuitive", c: "Closed off", l: "Needs total trust" },
    26: { t: "The Executor", s: "Practical, ambitious", c: "Workaholic", l: "Gives love through real actions" },
    27: { t: "The Philanthropist", s: "Forgiving, generous", c: "Easily disappointed", l: "Loves selflessly" },
    28: { t: "Charismatic Leader", s: "Authoritative, independent", c: "Hard to delegate", l: "Wants to be admired by their partner" },
    29: { t: "The Seer", s: "Incredible intuition", c: "Anxious", l: "Needs an understanding partner" },
    30: { t: "Total Expressive", s: "Creative, social", c: "Lacks focus", l: "Colorful and full of laughter" },
    31: { t: "Ambitious Practitioner", s: "Disciplined, practical", c: "Rigid", l: "Loyal and loves planning the future" }
  }
};

const dataES = {
  ui: {
    title: "Significado de Nacimiento",
    subtitle: "Cada fecha de nacimiento guarda un poema secreto. Descubre el mensaje del universo para ti.",
    placeholder: "Selecciona tu fecha de nacimiento",
    btn: "🎁 Revelar Significado 🎁",
    loading: "Leyendo las estrellas...",
    lblMonth: "Elemento",
    lblColor: "Color",
    lblStrength: "✨ Fortalezas",
    lblChallenge: "⚠️ Desafíos Formativos",
    lblLove: "❤️ Lenguaje del Amor",
    lblDaily: "🌟 Mensaje Diario para ti:",
    shareBtn: "📤 Compartir Significado",
    disclaimer: "*Esta lectura es un espejo reflexivo, no una profecía. Cada día es una nueva oportunidad."
  },
  months: {
    1: { k: "El Pionero", e: "Fuego", c: "Rojo y Oro", d: "Nacer a principios de año te da una fuerte energía de liderazgo. Eres un pionero, generador de ideas y no temes destacar. Tu entusiasmo es contagioso y siempre quieres empezar algo nuevo." },
    2: { k: "Guardián del Corazón", e: "Agua", c: "Azul Claro y Blanco", d: "Naciste como una presencia calmante en un mundo acalorado. Tu sensibilidad es un don, ya que puedes sentir lo que no se dice. Eres el mejor oyente, un refugio para almas cansadas." },
    3: { k: "Fiesta Creativa", e: "Aire", c: "Amarillo y Naranja", d: "Traes risas, color e ideas frescas. Te encanta compartir historias, bailar o simplemente hacer sonreír a la gente. Tu creatividad nunca se seca, como un manantial en el desierto." },
    4: { k: "El Constructor", e: "Tierra", c: "Verde y Marrón", d: "Eres la base para todos a tu alrededor. Trabajo duro, perseverancia y honestidad son tu segundo nombre. No buscas la fama, sino la satisfacción de saber que todo se mantiene firme gracias a ti." },
    5: { k: "El Viajero", e: "Fuego", c: "Naranja y Azul Cielo", d: "Tu alma es libre como el viento. Tienes curiosidad por el mundo, queriendo explorar cada rincón y probar cada sabor. Tus días están llenos de cambios y pequeñas aventuras." },
    6: { k: "El Cuidador", e: "Agua", c: "Verde Claro y Rosa", d: "Estás en este mundo para nutrir, proteger y crear calidez. Tu hogar es un pequeño paraíso, y la familia es el centro de tu universo. Tu amabilidad es contagiosa." },
    7: { k: "El Pensador", e: "Agua", c: "Púrpura y Azul Oscuro", d: "Te sumerges en el océano de pensamientos y almas. La soledad no es una maldición, sino un espacio para encontrar respuestas. Posees una sabiduría madura a una edad temprana." },
    8: { k: "El Gobernante", e: "Tierra", c: "Negro y Oro", d: "Naciste con agudos instintos comerciales y de poder. Ves oportunidades donde otros ven problemas. Sin embargo, también aprendes que el verdadero poder surge cuando puedes compartir." },
    9: { k: "Humano Universal", e: "Fuego", c: "Blanco y Plata", d: "Amas a toda la humanidad. Incluso las lágrimas de un extraño pueden conmoverte. Estás en el mundo para perdonar, sanar y difundir compasión." },
    10: { k: "Gran Visión", e: "Aire", c: "Azul Cielo y Oro", d: "La combinación de 1 y 0 te da la capacidad de empezar de cero y hacerlo crecer hasta convertirlo en algo enorme. Eres un soñador que también es ejecutor." },
    11: { k: "Enviado Espiritual", e: "Aire", c: "Lavanda y Blanco", d: "Tienes un agudo sexto sentido. Puedes sentir energías, predecir estados de ánimo y, a menudo, encontrarte 'casualmente' en el lugar correcto. Eres un puente entre el mundo físico y espiritual." },
    12: { k: "Artista Total", e: "Agua", c: "Turquesa y Rosa", d: "Eres un lienzo vivo. Cada emoción es un color, cada experiencia una pincelada. Amas la belleza y puedes crearla a partir de cosas simples." }
  },
  days: {
    1: { t: "Independencia Eterna", s: "Valiente, gran iniciativa", c: "Difícil aceptar ayuda", l: "Necesita una pareja que admire su libertad" },
    2: { t: "Oyente Verdadero", s: "Empático, sabio", c: "Piensa demasiado", l: "Romántico y atento a los pequeños detalles" },
    3: { t: "Estrella de Escenario", s: "Creativo, expresivo", c: "Se aburre fácilmente", l: "Amor lleno de sorpresas y risas" },
    4: { t: "La Fortaleza", s: "Persistente, confiable", c: "Rígido", l: "Leal y responsable, pero necesita citas espontáneas" },
    5: { t: "Alma Aventurera", s: "Adaptable, enérgico", c: "Impulsivo", l: "Necesita una pareja no posesiva" },
    6: { t: "Padre del Mundo", s: "Amoroso, protector", c: "Mandón", l: "Amor total y sacrificio" },
    7: { t: "El Filósofo", s: "Analítico, intuitivo", c: "Aislado", l: "Busca conexiones profundas, necesita espacio personal" },
    8: { t: "El Magnate", s: "Ambicioso, inteligente", c: "Adicta al trabajo", l: "Una pareja igualitaria que apoye su carrera" },
    9: { t: "El Filántropo", s: "Indulgente, idealista", c: "Fácil de aprovechar", l: "Amor universal, a veces se olvida de sí mismo" },
    10: { t: "Líder Nato", s: "Independiente, visionario", c: "Dominante", l: "Quiere ser el centro de atención de su pareja" },
    11: { t: "Iluminador de Almas", s: "Súper intuitivo", c: "Excesivamente ansioso", l: "Necesita una pareja emocionalmente estable" },
    12: { t: "El Creador", s: "Imaginación salvaje", c: "Poco práctico", l: "Ama las sorpresas románticas" },
    13: { t: "Trabajador Duro", s: "Voluntad de hierro", c: "Pesimista", l: "Leal pero necesita palabras de aliento" },
    14: { t: "El Explorador", s: "Flexible", c: "Huye del compromiso", l: "La pareja debe ser tan libre como ellos" },
    15: { t: "Artista del Corazón", s: "Artístico, gentil", c: "Se lastima fácilmente", l: "Muy romántico y expresivo" },
    16: { t: "Buscador de la Verdad", s: "Analítico, honesto", c: "Demasiado crítico", l: "Necesita discusiones profundas" },
    17: { t: "La Realeza", s: "Carismático, ambicioso", c: "Egoísta", l: "Quiere ser mimado y adorado" },
    18: { t: "El Reformador", s: "Idealismo, liderazgo", c: "Se frustra fácilmente", l: "Una pareja alineada con su gran visión" },
    19: { t: "El Rompedor", s: "Valiente, independiente", c: "Irascible", l: "Necesita una pareja que no le restrinja" },
    20: { t: "Chupete de Corazón", s: "Diplomático, paciente", c: "No puede decir no", l: "Busca paz y comodidad" },
    21: { t: "El Inspirador", s: "Optimista, creativo", c: "Promete en exceso", l: "Lleno de ideas románticas" },
    22: { t: "Maestro Constructor", s: "Gran visión + ejecución", c: "Carga pesada", l: "Una pareja que apoye su misión de vida" },
    23: { t: "Maestro Comunicador", s: "Carismático, convincente", c: "Inconsistente", l: "Necesita estimulación constante de diálogo" },
    24: { t: "El Protector", s: "Responsable", c: "Se preocupa en exceso", l: "Construye un hogar seguro" },
    25: { t: "Pensador Profundo", s: "Intelectual, intuitivo", c: "Cerrado", l: "Necesita confianza total" },
    26: { t: "El Ejecutor", s: "Práctico, ambicioso", c: "Adicto al trabajo", l: "Da amor a través de acciones reales" },
    27: { t: "El Filántropo", s: "Indulgente, generoso", c: "Se decepciona fácilmente", l: "Ama desinteresadamente" },
    28: { t: "Líder Carismático", s: "Autoritario, independiente", c: "Difícil delegar", l: "Quiere ser admirado por su pareja" },
    29: { t: "El Vidente", s: "Increíble intuición", c: "Ansioso", l: "Necesita una pareja comprensiva" },
    30: { t: "Expresivo Total", s: "Creativo, social", c: "Falta de enfoque", l: "Colorido y lleno de risas" },
    31: { t: "Practicante Ambicioso", s: "Disciplinado, práctico", c: "Rígido", l: "Leal y ama planificar el futuro" }
  }
};

// ==========================================
// PENGGABUNGAN KAMUS 3 BAHASA
// ==========================================
const DICTIONARY: Record<string, any> = {
  id: dataID,
  en: dataEN,
  es: dataES
};
// ==========================================
// PART 3: FUNGSI LOGIKA (OTOMATIS 3 BAHASA)
// ==========================================
function getArchetypeText(m: number, d: number, mData: any, dData: any, lang: string): string {
  if (lang === "en") {
    const templates = [
      `${mData.k} with a touch of ${dData.t}. ${mData.d} The nature of ${dData.t} makes you ${dData.s.toLowerCase()}, while remaining aware of ${dData.c.toLowerCase()}.`,
      `You are a blend of the ${mData.k} energy and the ${dData.t} date. Like ${mData.e} mixed with the color ${mData.c}, you carry ${dData.s} and a sensitivity to ${dData.c}. Every step is a dance of courage and wisdom.`,
      `Being born in month ${m} (${mData.k}) and day ${d} (${dData.t}) makes you truly unique. You are gifted with ${dData.s}. In love, you need: ${dData.l.toLowerCase()}. This combination makes you well-liked.`
    ];
    return templates[(m * d) % templates.length];
  } else if (lang === "es") {
    const templates = [
      `${mData.k} con un toque de ${dData.t}. ${mData.d} La naturaleza de ${dData.t} te hace ${dData.s.toLowerCase()}, mientras eres consciente de ${dData.c.toLowerCase()}.`,
      `Eres una mezcla de la energía de ${mData.k} y la fecha ${dData.t}. Como ${mData.e} mezclado con el color ${mData.c}, llevas ${dData.s} y una sensibilidad a ${dData.c}. Cada paso es una danza de coraje y sabiduría.`,
      `Hacer nacido en el mes ${m} (${mData.k}) y el día ${d} (${dData.t}) te hace único. Estás dotado de ${dData.s}. En el amor: ${dData.l.toLowerCase()}. Esta combinación te hace muy querido.`
    ];
    return templates[(m * d) % templates.length];
  } else {
    // Default: Indonesia (100% sama dengan format asli Anda)
    const templates = [
      `${mData.k} dengan sentuhan ${dData.t}. ${mData.d} Sifat ${dData.t} membuat Anda ${dData.s.toLowerCase()}, namun tetap sadar akan ${dData.c.toLowerCase()}.`,
      `Anda adalah perpaduan antara energi bulan ${mData.k} dan tanggal ${dData.t}. Seperti ${mData.e} yang berpadu dengan warna ${mData.c}, Anda membawa ${dData.s} serta kepekaan terhadap ${dData.c}. Setiap langkah Anda adalah tarian antara keberanian dan kebijaksanaan.`,
      `Lahir di bulan ${m} (${mData.k}) dan tanggal ${d} (${dData.t}) menjadikan Anda pribadi yang unik. Anda memiliki panggilan untuk ${mData.d.substring(0, 80)}... Sedangkan dari sisi tanggal, Anda dianugerahi ${dData.s}. Dalam cinta, Anda cenderung ${dData.l.toLowerCase()}. Kombinasi ini membuat Anda disukai banyak orang.`
    ];
    return templates[(m * d) % templates.length];
  }
}

function getAffirmation(m: number, d: number, lang: string): string {
  const affirmations: Record<string, string[]> = {
    id: [
      `Aku menerima keunikan kelahiranku pada tanggal ${d}. Setiap napas adalah hadiah.`,
      `Aku bersyukur atas energi elemen yang membentuk diriku. Aku cukup dan berharga.`,
      `Hari ini aku merayakan diriku. Aku layak dicintai, berhasil, dan bahagia.`,
      `Aku memaafkan masa laluku, dan melangkah dengan keberanian yang lahir dari tanggal ${d}.`,
      `Aku menarik kebaikan, kemakmuran, dan cinta karena aku percaya pada takdir baikku.`
    ],
    en: [
      `I embrace the uniqueness of my birth on the ${d}th. Every breath is a gift.`,
      `I am grateful for the elemental energy that shapes me. I am enough and worthy.`,
      `Today I celebrate myself. I deserve love, success, and happiness.`,
      `I forgive my past and step forward with the courage born on the ${d}th.`,
      `I attract goodness, prosperity, and love because I believe in my good destiny.`
    ],
    es: [
      `Acepto la singularidad de mi nacimiento el día ${d}. Cada respiro es un regalo.`,
      `Estoy agradecido por la energía elemental que me moldea. Soy suficiente y valioso.`,
      `Hoy me celebro. Merezco amor, éxito y felicidad.`,
      `Perdono mi pasado y avanzo con el coraje nacido el día ${d}.`,
      `Atraigo bondad, prosperidad y amor porque creo en mi buen destino.`
    ]
  };
  const list = affirmations[lang] || affirmations["id"];
  return list[(m + d) % list.length];
}

function getDailyWisdom(m: number, d: number, dateSeed: string, lang: string, mData: any, dData: any): string {
  const wisdoms: Record<string, string[]> = {
    id: [
      `🌼 Kelahiranmu sebagai ${mData.k} memberi kekuatan ekstra hari ini. Gunakan ${dData.s.split(",")[0]} untuk menghadapi tantangan.`,
      `🌈 Warna keberuntunganmu ${mData.c} membawa energi positif. Kenakan aksesori dengan warna itu hari ini.`,
      `💫 Luangkan waktu melakukan hal yang membuatmu merasa damai dan mandiri.`,
      `📖 Ulangi afirmasi: "${getAffirmation(m, d, lang).substring(0, 50)}..."`,
      `🍀 Angka keberuntunganmu hari ini: ${(Math.abs(m * d * dateSeed.length) % 99) + 1}. Percayalah pada firasat kecil.`
    ],
    en: [
      `🌼 Being born as ${mData.k} gives you extra strength today. Use your courage to face challenges.`,
      `🌈 Your lucky color ${mData.c} brings positive energy. Wear something with that color today.`,
      `💫 Take time to do things that make you feel peaceful and independent.`,
      `📖 Repeat affirmation: "${getAffirmation(m, d, lang).substring(0, 50)}..."`,
      `🍀 Your lucky number today: ${(Math.abs(m * d * dateSeed.length) % 99) + 1}. Trust your small instincts.`
    ],
    es: [
      `🌼 Nacer como ${mData.k} te da fuerza extra hoy. Usa tu coraje para enfrentar los desafíos.`,
      `🌈 Tu color de la suerte ${mData.c} trae energía positiva. Usa algo de ese color hoy.`,
      `💫 Tómate un tiempo para hacer cosas que te hagan sentir en paz e independiente.`,
      `📖 Repite la afirmación: "${getAffirmation(m, d, lang).substring(0, 50)}..."`,
      `🍀 Tu número de la suerte hoy: ${(Math.abs(m * d * dateSeed.length) % 99) + 1}. Confía en tus pequeños instintos.`
    ]
  };
  const list = wisdoms[lang] || wisdoms["id"];
  const hash = (m + d + dateSeed.length) % list.length;
  return list[hash];
}

// ==========================================
// PART 4A: KOMPONEN UTAMA (STATE & HANDLERS)
// ==========================================
export default function BirthdayMeaning({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];
  
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleReveal = () => {
    if (!birthDate) return;
    setLoading(true);
    
    setTimeout(() => {
      const [year, month, day] = birthDate.split("-").map(Number);
      const mData = dict.months[month];
      const dData = dict.days[day] || dict.days[1];
      
      const archetype = getArchetypeText(month, day, mData, dData, activeLang);
      const affirmation = getAffirmation(month, day, activeLang);
      const dailyWisdom = getDailyWisdom(month, day, birthDate, activeLang, mData, dData);
      
      setResult({ month, day, mData, dData, archetype, affirmation, dailyWisdom });
      setLoading(false);
    }, 1300);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `🎂 ${dict.ui.title}: ${result.day}/${result.month}. ${result.mData.k} & ${result.dData.t}. \n\nAksaraDiri!`;
    if (navigator.share) {
      try { await navigator.share({ title: dict.ui.title, text }); } catch (e) {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // ==========================================
  // PART 4B: ANTARMUKA UI (ULTRA PREMIUM)
  // ==========================================
  return (
    <div className="max-w-2xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-10">
        <div className="text-6xl mb-2 drop-shadow-2xl">🎂✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {dict.ui.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
          {dict.ui.subtitle}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white text-center [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <button
          onClick={handleReveal}
          disabled={loading || !birthDate}
          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-gradient-x font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {dict.ui.loading}
            </span>
          ) : (
            dict.ui.btn
          )}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-12">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-gradient-to-br from-indigo-950/40 to-cyan-950/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

            <div className="text-center relative z-10">
              <span className="inline-block text-7xl drop-shadow-2xl">
                {result.month}/{result.day}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
                {result.mData.k} & {result.dData.t}
              </h3>
              <div className="flex justify-center gap-3 mt-2 text-xs">
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{dict.ui.lblMonth}: {result.mData.e}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{dict.ui.lblColor}: {result.mData.c}</span>
              </div>
            </div>

            <div className="mt-6 text-slate-200 leading-relaxed text-sm md:text-base space-y-4">
              <p>{result.archetype}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">{dict.ui.lblStrength}</h4>
                <p className="text-sm text-slate-200 mt-1">{result.dData.s}</p>
              </div>
              <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                <h4 className="text-rose-400 font-bold text-xs uppercase tracking-wider">{dict.ui.lblChallenge}</h4>
                <p className="text-sm text-slate-200 mt-1">{result.dData.c}</p>
              </div>
              <div className="bg-pink-500/10 p-4 rounded-xl border border-pink-500/20 md:col-span-2">
                <h4 className="text-pink-400 font-bold text-xs uppercase tracking-wider">{dict.ui.lblLove}</h4>
                <p className="text-sm text-slate-200 mt-1">{result.dData.l}</p>
              </div>
            </div>

            <div className="mt-6 p-5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
              <p className="text-amber-200 italic text-sm">✨ {result.affirmation}</p>
            </div>

            <div className="mt-5 p-4 bg-white/5 rounded-xl text-center animate-pulse-slow">
              <p className="text-cyan-200 text-sm">
                🌟 <span className="font-bold">{dict.ui.lblDaily}</span> {result.dailyWisdom}
              </p>
            </div>

            <button
              onClick={handleShare}
              className="mt-7 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
              {dict.ui.shareBtn}
            </button>

            <p className="text-center text-[10px] text-slate-500 mt-5 italic">{dict.ui.disclaimer}</p>
            
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
              toolName={dict.ui.title} 
              resultId={`${result.month}-${result.day}`} 
            />
            {/* SAMPAI SINI */}

          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 2s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}