"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ==========================================
// PART 1: KAMUS UI, PESAN HARIAN & HURUF
// ==========================================
const UI_DICT: Record<string, any> = {
  id: {
    title: "Makna Nama Premium",
    subtitle: "Setiap nama memiliki getaran rahasia. Ungkap potensi terpendammu.",
    placeholder: "Masukkan namamu (contoh: Sarah, Budi)",
    btn: "🔮 Ungkap Makna Nama 🔮",
    loading: "Membaca getaran nama...",
    expression: "Angka Ekspresi",
    strength: "✨ Kekuatan", weakness: "⚠️ Tantangan", career: "💼 Karir",
    love: "❤️ Cinta", spiritual: "🧘 Spiritual",
    firstLetter: "🔤 Huruf Pertama",
    vowel: "❤️ Heart's Desire (Vokal)", vowelDesc: "Kekuatan batin",
    consonant: "🎭 Personality (Konsonan)", consonantDesc: "Cara orang melihatmu",
    daily: "🌟 Pesan Harian untukmu:",
    shareBtn: "📤 Bagikan Makna Nama",
    disclaimer: "*Numerologi nama berdasarkan sistem Pythagorean. Setiap huruf memiliki getaran yang membentuk karakter."
  },
  en: {
    title: "Premium Name Meaning",
    subtitle: "Every name holds a secret vibration. Unlock your hidden potential.",
    placeholder: "Enter your name (e.g., Sarah, John)",
    btn: "🔮 Reveal Name Meaning 🔮",
    loading: "Reading name vibrations...",
    expression: "Expression Number",
    strength: "✨ Strength", weakness: "⚠️ Challenge", career: "💼 Career",
    love: "❤️ Love", spiritual: "🧘 Spiritual",
    firstLetter: "🔤 First Letter",
    vowel: "❤️ Heart's Desire (Vowels)", vowelDesc: "Inner strength",
    consonant: "🎭 Personality (Consonants)", consonantDesc: "How others see you",
    daily: "🌟 Daily Message for you:",
    shareBtn: "📤 Share Name Meaning",
    disclaimer: "*Name numerology is based on the Pythagorean system. Each letter vibrates to shape character."
  },
  es: {
    title: "Significado del Nombre",
    subtitle: "Cada nombre tiene una vibración secreta. Desbloquea tu potencial.",
    placeholder: "Ingresa tu nombre (ej., Sara, Juan)",
    btn: "🔮 Revelar Significado 🔮",
    loading: "Leyendo vibraciones...",
    expression: "Número de Expresión",
    strength: "✨ Fortaleza", weakness: "⚠️ Desafío", career: "💼 Carrera",
    love: "❤️ Amor", spiritual: "🧘 Espiritual",
    firstLetter: "🔤 Primera Letra",
    vowel: "❤️ Deseo del Corazón (Vocales)", vowelDesc: "Fuerza interior",
    consonant: "🎭 Personalidad (Consonantes)", consonantDesc: "Cómo te ven los demás",
    daily: "🌟 Mensaje Diario para ti:",
    shareBtn: "📤 Compartir Significado",
    disclaimer: "*La numerología se basa en el sistema pitagórico. Cada letra vibra para formar el carácter."
  }
};

const letterValues: Record<string, number> = {
  'a':1,'b':2,'c':3,'d':4,'e':5,'f':6,'g':7,'h':8,'i':9,
  'j':1,'k':2,'l':3,'m':4,'n':5,'o':6,'p':7,'q':8,'r':9,
  's':1,'t':2,'u':3,'v':4,'w':5,'x':6,'y':7,'z':8
};

const FIRST_LETTER_ML: Record<string, Record<string, string>> = {
  id: {
    'a':'Kemandirian, ambisi, dan kemampuan memulai sesuatu dari nol.', 'b':'Kesabaran, ketekunan, dan cinta pada keindahan alam.',
    'c':'Kreativitas, komunikasi, dan pesona alami yang menarik orang.', 'd':'Disiplin, tanggung jawab, dan fondasi yang kokoh dalam hidup.',
    'e':'Ekspresif, penuh rasa ingin tahu, dan mudah beradaptasi.', 'f':'Kesetiaan, kehangatan, dan kemampuan merawat orang lain.',
    'g':'Intuisi kuat, artistik, dan kadang misterius.', 'h':'Ambisi materi, praktis, dan pendekatan sistematis.',
    'i':'Idealisme, kreativitas tinggi, dan kepekaan estetika.', 'j':'Kemandirian, energik, dan suka menjadi pusat perhatian.',
    'k':'Karismatik, intuitif, dan memiliki visi spiritual.', 'l':'Penyayang, artistik, dan mudah beradaptasi dengan lingkungan.',
    'm':'Tekun, bertanggung jawab, dan sangat protektif pada keluarga.', 'n':'Pembelajar sejati, analitis, dan suka tantangan intelektual.',
    'o':'Terbuka, dermawan, dan memiliki jiwa kepemimpinan.', 'p':'Kreatif, persuasif, dan suka mempelajari hal baru.',
    'q':'Unik, independen, dan memiliki pemikiran out of the box.', 'r':'Praktis, pekerja keras, dan dapat diandalkan dalam krisis.',
    's':'Karismatik, percaya diri, dan suka memotivasi orang lain.', 't':'Disiplin, setia, dan memiliki ketahanan mental tinggi.',
    'u':'Humanis, kreatif, dan suka berbagi kebahagiaan.', 'v':'Petualang, intuitif, dan memiliki bakat seni.',
    'w':'Praktis, bertanggung jawab, dan suka membantu sesama.', 'x':'Misterius, analitis, dan memiliki ketajaman intuisi.',
    'y':'Idealistis, bebas, dan suka perubahan positif.', 'z':'Ambigu, kreatif, dan mampu melihat peluang unik.'
  },
  en: {
    'a':'Independence, ambition, and the ability to start from scratch.', 'b':'Patience, perseverance, and love for nature\'s beauty.',
    'c':'Creativity, communication, and a natural charm.', 'd':'Discipline, responsibility, and a solid foundation in life.',
    'e':'Expressive, curious, and easily adaptable.', 'f':'Loyalty, warmth, and the ability to care for others.',
    'g':'Strong intuition, artistic, and sometimes mysterious.', 'h':'Material ambition, practical, and a systematic approach.',
    'i':'Idealism, high creativity, and aesthetic sensitivity.', 'j':'Independence, energetic, and loves being the center of attention.',
    'k':'Charismatic, intuitive, and has a spiritual vision.', 'l':'Loving, artistic, and easily adapts to environments.',
    'm':'Diligent, responsible, and highly protective of family.', 'n':'A true learner, analytical, and loves intellectual challenges.',
    'o':'Open, generous, and has a leadership spirit.', 'p':'Creative, persuasive, and loves learning new things.',
    'q':'Unique, independent, and thinks out of the box.', 'r':'Practical, hardworking, and reliable in a crisis.',
    's':'Charismatic, confident, and loves motivating others.', 't':'Disciplined, loyal, and has high mental endurance.',
    'u':'Humanist, creative, and loves sharing happiness.', 'v':'Adventurous, intuitive, and has artistic talent.',
    'w':'Practical, responsible, and loves helping others.', 'x':'Mysterious, analytical, and has sharp intuition.',
    'y':'Idealistic, free, and loves positive change.', 'z':'Ambiguous, creative, and able to see unique opportunities.'
  },
  es: {
    'a':'Independencia, ambición y capacidad de empezar de cero.', 'b':'Paciencia, perseverancia y amor por la belleza natural.',
    'c':'Creatividad, comunicación y encanto natural.', 'd':'Disciplina, responsabilidad y una base sólida.',
    'e':'Expresivo, curioso y fácilmente adaptable.', 'f':'Lealtad, calidez y capacidad para cuidar a los demás.',
    'g':'Fuerte intuición, artístico y a veces misterioso.', 'h':'Ambición material, práctico y enfoque sistemático.',
    'i':'Idealismo, alta creatividad y sensibilidad estética.', 'j':'Independiente, enérgico y ama ser el centro de atención.',
    'k':'Carismático, intuitivo y con visión espiritual.', 'l':'Amoroso, artístico y se adapta a los entornos.',
    'm':'Diligente, responsable y muy protector de la familia.', 'n':'Un verdadero aprendiz, analítico y ama los desafíos.',
    'o':'Abierto, generoso y con espíritu de liderazgo.', 'p':'Creativo, persuasivo y ama aprender cosas nuevas.',
    'q':'Único, independiente y piensa fuera de la caja.', 'r':'Práctico, trabajador y confiable en una crisis.',
    's':'Carismático, seguro y ama motivar a otros.', 't':'Disciplinado, leal y tiene alta resistencia mental.',
    'u':'Humanista, creativo y ama compartir la felicidad.', 'v':'Aventurero, intuitivo y con talento artístico.',
    'w':'Práctico, responsable y ama ayudar a los demás.', 'x':'Misterioso, analítico y con aguda intuición.',
    'y':'Idealista, libre y ama el cambio positivo.', 'z':'Ambiguo, creativo y capaz de ver oportunidades únicas.'
  }
};

const DAILY_MSG_ML: Record<string, string[]> = {
  id: [
    "Hari ini, bintang-bintang berbisik: gunakan kreativitas alami dari namamu untuk menyelesaikan tantangan.",
    "Semesta mendukung langkahmu. Percayalah bahwa namamu sudah membawa berkah tersendiri.",
    "Cobalah untuk tersenyum pada orang asing. Kebaikan kecil akan kembali padamu berlipat.",
    "Jangan bandingkan perjalananmu dengan orang lain. Namamu unik, begitu pula takdirmu.",
    "Ada pesan dari alam lewat firasatmu. Perhatikan hal-hal kecil sepanjang hari.",
    "Hari ini cocok untuk memulai sesuatu yang baru, bahkan hanya kebiasaan baik 5 menit.",
    "Maafkan dirimu atas kesalahan kemarin. Namamu membawa energi pembaharuan."
  ],
  en: [
    "Today, the stars whisper: use the natural creativity of your name to solve a challenge.",
    "The universe supports your steps. Believe that your name carries its own blessing.",
    "Try smiling at a stranger. A small act of kindness will return to you manifold.",
    "Don't compare your journey with others. Your name is unique, and so is your destiny.",
    "There is a message from nature through your intuition. Pay attention to small details.",
    "Today is perfect to start something new, even just a 5-minute good habit.",
    "Forgive yourself for yesterday's mistakes. Your name brings renewing energy."
  ],
  es: [
    "Hoy, las estrellas susurran: usa la creatividad natural de tu nombre para resolver un desafío.",
    "El universo apoya tus pasos. Cree que tu nombre lleva su propia bendición.",
    "Intenta sonreír a un extraño. Un pequeño acto de bondad regresará a ti multiplicado.",
    "No compares tu viaje con el de otros. Tu nombre es único, al igual que tu destino.",
    "Hay un mensaje de la naturaleza a través de tu intuición. Presta atención a los detalles.",
    "Hoy es perfecto para comenzar algo nuevo, incluso un buen hábito de 5 minutos.",
    "Perdónate por los errores de ayer. Tu nombre trae energía renovadora."
  ]
};
// ==========================================
// PART 2: DATABASE NUMEROLOGI (ID & EN)
// ==========================================
const NAME_DB_ID: Record<number, any> = {
  1: {
    title: "Sang Pelopor – Jiwa Kepemimpinan",
    desc: "Nama Anda memancarkan energi nomor 1, angka dari inisiatif, keberanian, dan kemandirian. Anda tidak menunggu peluang, tapi menciptakannya. Anda memiliki bakat memimpin dan tampil beda. Belajar dari kegagalan, jiwa Anda adalah api yang menerangi jalan.",
    strength: "Mandiri, berani mengambil risiko, kreatif, optimis, bertekad baja.",
    weakness: "Egois, tidak sabar, sulit dalam tim, mudah frustasi.",
    career: "Pengusaha, direktur kreatif, pemimpin proyek, atlet, arsitek.",
    love: "Mencari pasangan yang mengagumi ambisi namun setara. Tidak suka posesif.",
    spiritual: "Damai saat mengejar panggilan jiwa. Meditasi aktif lebih cocok.",
    quote: "🚀 'Jangan takut sendirian di jalan yang benar, di sanalah pemimpin ditempa.'",
    affirmation: "Aku adalah pemimpin atas hidupku. Aku berani memulai."
  },
  2: {
    title: "Sang Penengah – Hati yang Lembut",
    desc: "Nama Anda bergetar pada angka 2, kepekaan dan kerja sama. Kemampuan luar biasa untuk mendengar dan menyelaraskan. Kehadiran Anda menenangkan, diplomatis, tapi kadang mengorbankan diri sendiri demi orang lain.",
    strength: "Empati tinggi, kooperatif, sabar, intuitif, hangat.",
    weakness: "Terlalu sensitif, sulit ambil keputusan, mudah dimanfaatkan.",
    career: "Konselor, diplomat, perawat, psikolog, desainer interior.",
    love: "Pasangan setia dan penuh perhatian. Butuh kepastian dan stabilitas.",
    spiritual: "Dekat dengan Tuhan di alam, musik lembut, atau pelukan.",
    quote: "🌊 'Kelembutan bukan kelemahan, melainkan kekuatan pelindung.'",
    affirmation: "Aku menerima kepekaanku. Aku berani berkata tidak."
  },
  3: {
    title: "Sang Penghibur – Cahaya Kreativitas",
    desc: "Energi nomor 3, ekspresi dan kegembiraan. Terlahir berbagi cerita dan tawa. Kata-kata mengalir, ide bermunculan. Tidak suka rutinitas, butuh tantangan. Di balik keceriaan, sangat sensitif terhadap kritik.",
    strength: "Komunikatif, kreatif, optimis, humoris, karismatik.",
    weakness: "Mudah bosan, kurang fokus, dramatis, berlebihan.",
    career: "Penulis, aktor, penyanyi, desainer grafis, youtuber.",
    love: "Mencintai dengan kejutan. Cepat bosan jika hubungan monoton.",
    spiritual: "Kehadiran Ilahi dalam seni dan tawa. Meditasi lewat karya.",
    quote: "🎭 'Hidup adalah panggung, perankan peran terbaikmu.'",
    affirmation: "Aku bebas mengekspresikan diriku tanpa rasa takut."
  },
  4: {
    title: "Sang Pembangun – Fondasi yang Kokoh",
    desc: "Angka 4 adalah kerja keras, disiplin, dan stabilitas. Dapat diandalkan dan tidak kenal lelah. Membangun sukses batu demi batu. Kadang terlalu kaku dan sulit menerima perubahan mendadak.",
    strength: "Tekun, jujur, terorganisir, bertanggung jawab, praktis.",
    weakness: "Keras kepala, perfeksionis, terlalu serius.",
    career: "Insinyur, akuntan, manajer proyek, pegawai negeri.",
    love: "Cinta lewat tindakan nyata. Pastikan pasangan merasa aman secara finansial.",
    spiritual: "Kerja keras adalah ibadah. Membantu secara praktis adalah doa.",
    quote: "🧱 'Sukses bukan seberapa tinggi melompat, tapi seberapa kokoh mendarat.'",
    affirmation: "Aku menghargai proses. Setiap langkah adalah kemenangan."
  },
  5: {
    title: "Sang Petualang – Jiwa yang Merdeka",
    desc: "Angka 5 berarti kebebasan dan perubahan. Haus pengalaman baru, tidak bisa diam lama. Adaptif dan cepat belajar, tapi kadang lari dari tanggung jawab. Anda adalah angin pengubah arah.",
    strength: "Adaptif, energik, persuasif, berani mengambil risiko.",
    weakness: "Impulsif, mudah bosan, tidak konsisten, boros.",
    career: "Jurnalis, pramugari, travel blogger, fotografer.",
    love: "Butuh pasangan yang tidak posesif dan suka petualangan.",
    spiritual: "Menemukan Tuhan di setiap sudut dunia. Alam adalah kuil.",
    quote: "🌍 'Kebebasan adalah berani menjadi dirimu yang otentik.'",
    affirmation: "Aku menyambut perubahan dengan pikiran positif."
  },
  6: {
    title: "Sang Pengasuh – Cinta Tanpa Batas",
    desc: "Angka 6 adalah cinta dan keluarga. Pusat kehangatan, penyayang, rela berkorban. Rumah adalah istana. Sering lupa merawat diri sendiri karena terlalu sibuk merawat orang lain.",
    strength: "Penyayang, setia, bertanggung jawab, artistik.",
    weakness: "Suka mengatur, mudah cemas, sulit melepaskan.",
    career: "Guru, perawat, konselor, koki, pekerja sosial.",
    love: "Memanjakan pasangan. Butuh dihargai agar tidak kelelahan memberi.",
    spiritual: "Merawat keluarga dan memasak dengan cinta adalah doa.",
    quote: "🏡 'Cinta sejati tak membuatmu kehilangan dirimu sendiri.'",
    affirmation: "Aku memberi dengan ikhlas, aku juga menerima cinta."
  },
  7: {
    title: "Sang Perenung – Pencari Kebenaran",
    desc: "Angka 7 adalah analisis dan spiritualitas. Pemikir dalam, suka menyendiri. Punya intuisi tajam, tahu lebih dari yang diucap. Kadang terlalu kritis dan terisolasi.",
    strength: "Analitis, intuitif, bijaksana, mandiri, perfeksionis.",
    weakness: "Skeptis, penyendiri, pesimis, sulit percaya orang.",
    career: "Peneliti, ilmuwan, filsuf, programmer, penulis.",
    love: "Tidak mudah jatuh cinta. Sekali percaya, setia dan dalam.",
    spiritual: "Dekat dengan Ilahi dalam keheningan dan meditasi.",
    quote: "🔍 'Semakin dalam menyelam, sadar bahwa permukaan hanya ilusi.'",
    affirmation: "Aku percaya pada proses pencarian menuju kedamaian."
  },
  8: {
    title: "Sang Raja – Kekuatan dan Kelimpahan",
    desc: "Angka 8 adalah kekuasaan dan materi. Bakat alami dalam bisnis. Ambisius, efisien, pekerja keras. Jangan sampai terobsesi sukses hingga lupa kebahagiaan sederhana.",
    strength: "Ambisius, efisien, percaya diri, organisatoris.",
    weakness: "Workaholic, materialistis, sulit tunjukkan emosi.",
    career: "CEO, bankir, pengusaha, hakim, konsultan manajemen.",
    love: "Memberi kemewahan dan stabilitas. Butuh quality time.",
    spiritual: "Hukum alam dan keadilan adalah jalan spiritual.",
    quote: "👑 'Kekayaan tertinggi adalah siapa yang kau bantu.'",
    affirmation: "Aku menarik kelimpahan dan membaginya dengan murah hati."
  },
  9: {
    title: "Sang Humanis – Kasih Universal",
    desc: "Angka 9 adalah kemanusiaan. Empati luas, ingin menyelamatkan dunia. Seniman sejati dan pemaaf. Mudah kecewa karena realitas tak seindah idealisme.",
    strength: "Empati universal, pemaaf, toleran, dermawan.",
    weakness: "Terlalu altruis, mudah dimanfaatkan, sulit move on.",
    career: "Aktivis, seniman, pekerja sosial, guru spiritual.",
    love: "Cinta tanpa syarat. Pasangan harus mengerti visi sosial Anda.",
    spiritual: "Memaafkan musuh dan membantu sesama adalah ibadah.",
    quote: "🕊️ 'Bahagia adalah membuat orang tersenyum tanpa pamrih.'",
    affirmation: "Aku melepaskan masa lalu dan membuka hati."
  },
  11: {
    title: "Master Intuitif – Sang Pencerah",
    desc: "Angka Master 11. Intuisi tingkat tinggi dan inspirasi. Kepekaan luar biasa membaca energi. Rentan cemas karena terlalu banyak menyerap energi lingkungan.",
    strength: "Intuisi super, inspiratif, karismatik, visioner.",
    weakness: "Cemas berlebihan, sensitif, mudah stres.",
    career: "Motivator, guru spiritual, penulis, seniman visioner.",
    love: "Butuh pasangan pengertian sebagai sauh kestabilan emosi.",
    spiritual: "Mengakses alam bawah sadar, meditasi adalah napas.",
    quote: "✨ 'Di dalam kegelapan, bintang bersinar paling terang.'",
    affirmation: "Aku menerima kepekaanku dan menjaga batasan energiku."
  },
  22: {
    title: "Master Builder – Arsitek Peradaban",
    desc: "Angka Master 22. Mewujudkan mimpi besar menjadi nyata. Membangun fondasi untuk banyak orang. Tekanan tanggung jawab tinggi, harus belajar delegasi.",
    strength: "Visi besar, eksekutor andal, kepemimpinan global.",
    weakness: "Beban berat, sulit bersantai, bisa diktator.",
    career: "CEO global, arsitek, pemimpin proyek kemanusiaan.",
    love: "Butuh pasangan mandiri yang mendukung misi hidup.",
    spiritual: "Bekerja untuk kebaikan bersama adalah ibadah tertinggi.",
    quote: "🏗️ 'Aku membangun jembatan antara langit dan bumi.'",
    affirmation: "Setiap langkah kecilku adalah fondasi masa depan."
  },
  33: {
    title: "Master Teacher – Cinta Tanpa Pamrih",
    desc: "Angka Master 33. Cinta universal dan penyembuhan. Mampu menyembuhkan luka batin orang lain. Sering lupa merawat diri sendiri demi orang lain.",
    strength: "Cinta tanpa syarat, bijak, empati tingkat dewa.",
    weakness: "Abaikan diri sendiri, terlalu altruis, lelah mental.",
    career: "Guru spiritual, pemimpin yayasan, terapis holistik.",
    love: "Pasangan harus dewasa dan ikut melayani dunia.",
    spiritual: "Mencapai puncak saat sadar segala sesuatu adalah satu.",
    quote: "🌟 'Guru sejati paling banyak memberi tanpa pamrih.'",
    affirmation: "Aku memberi dengan cinta dan layak dirawat."
  }
};

const NAME_DB_EN: Record<number, any> = {
  1: {
    title: "The Pioneer – Leadership Soul",
    desc: "Your name radiates the energy of 1, the number of initiative and independence. You create opportunities, lead naturally, and stand out. Learning from failure, your soul is a guiding fire.",
    strength: "Independent, risk-taker, creative, optimistic, determined.",
    weakness: "Selfish, impatient, poor team player, easily frustrated.",
    career: "Entrepreneur, creative director, project leader, athlete.",
    love: "Seeks an equal partner who admires ambition. Dislikes possessiveness.",
    spiritual: "Finds peace pursuing a soul calling. Active meditation suits you.",
    quote: "🚀 'Fear not walking alone on the right path, there leaders are forged.'",
    affirmation: "I am the leader of my life. I dare to begin."
  },
  2: {
    title: "The Mediator – Gentle Heart",
    desc: "Vibrating at 2, the number of sensitivity and cooperation. You listen, understand, and harmonize. You are the glue in groups, though you often sacrifice yourself for others.",
    strength: "Empathetic, cooperative, patient, intuitive, warm.",
    weakness: "Oversensitive, indecisive, easily manipulated.",
    career: "Counselor, diplomat, nurse, psychologist, designer.",
    love: "Loyal and caring. Needs reassurance and stability.",
    spiritual: "Connects with the Divine in nature, soft music, or hugs.",
    quote: "🌊 'Gentleness is not weakness, but a protective strength.'",
    affirmation: "I embrace my sensitivity. I dare to say no."
  },
  3: {
    title: "The Entertainer – Light of Creativity",
    desc: "Energy of 3 means expression and joy. Born to share stories and beauty. Words flow, ideas pop. Hates dull routines. Highly sensitive to criticism behind the cheerful facade.",
    strength: "Communicative, creative, optimistic, humorous, charismatic.",
    weakness: "Easily bored, lacks focus, dramatic, excessive.",
    career: "Writer, actor, singer, graphic designer, youtuber.",
    love: "Loves with passion and surprises. Gets bored if relationships stagnate.",
    spiritual: "Divine presence in art and laughter. Meditation through creation.",
    quote: "🎭 'Life is a stage, play your best role every day.'",
    affirmation: "I freely express myself without fear."
  },
  4: {
    title: "The Builder – Solid Foundation",
    desc: "Number 4 is hard work, discipline, and stability. Reliable and tireless. You build success stone by stone. Can be too rigid and resistant to sudden changes.",
    strength: "Diligent, honest, organized, responsible, practical.",
    weakness: "Stubborn, perfectionist, too serious.",
    career: "Engineer, accountant, project manager, civil servant.",
    love: "Shows love through actions. Ensures financial and emotional security.",
    spiritual: "Hard work is worship. Practical help is a prayer.",
    quote: "🧱 'Success is not how high you jump, but how solid you land.'",
    affirmation: "I value the process. Every small step is a victory."
  },
  5: {
    title: "The Adventurer – Free Spirit",
    desc: "Number 5 is freedom and change. Thirsty for new experiences, adaptable, and quick to learn. Sometimes runs from responsibility. You are the wind that shifts the sails.",
    strength: "Adaptive, energetic, persuasive, risk-taker.",
    weakness: "Impulsive, easily bored, inconsistent, wasteful.",
    career: "Journalist, flight attendant, travel blogger, photographer.",
    love: "Needs a non-possessive partner who loves adventure.",
    spiritual: "Finds God in unexplored corners of the world.",
    quote: "🌍 'Freedom is daring to be your most authentic self.'",
    affirmation: "I welcome change with an open mind."
  },
  6: {
    title: "The Caregiver – Boundless Love",
    desc: "Number 6 is love and family. The center of warmth, willing to sacrifice. Your home is a palace. You often forget to care for yourself because you are busy caring for others.",
    strength: "Loving, loyal, responsible, artistic.",
    weakness: "Bossy, anxious, plays the victim, hard to let go.",
    career: "Teacher, nurse, counselor, chef, social worker.",
    love: "Spoils partners. Needs appreciation to avoid burnout.",
    spiritual: "Caring for family and cooking with love is a prayer.",
    quote: "🏡 'True love doesn't make you lose yourself.'",
    affirmation: "I give willingly, and I also receive love."
  },
  7: {
    title: "The Ponderer – Truth Seeker",
    desc: "Number 7 is analysis and spirituality. A deep thinker who loves solitude. Sharp intuition, knows more than spoken. Can be overly critical and isolated.",
    strength: "Analytical, intuitive, wise, independent, perfectionist.",
    weakness: "Skeptical, loner, pessimistic, hard to trust.",
    career: "Researcher, scientist, philosopher, programmer, writer.",
    love: "Hard to fall in love. Once trusted, deeply loyal.",
    spiritual: "Close to the Divine in silence and deep meditation.",
    quote: "🔍 'The deeper you dive, the more you realize the surface is an illusion.'",
    affirmation: "I trust the process of searching for peace."
  },
  8: {
    title: "The Executive – Power & Abundance",
    desc: "Number 8 is power and material success. Natural business talent. Ambitious, efficient, hardworking. Do not let obsession with success erase simple happiness.",
    strength: "Ambitious, efficient, confident, authoritative.",
    weakness: "Workaholic, materialistic, hides emotions.",
    career: "CEO, banker, real estate, judge, management consultant.",
    love: "Provides luxury and stability. Needs to invest in quality time.",
    spiritual: "Natural law and justice form your spiritual path.",
    quote: "👑 'Ultimate wealth is who you help when you have it.'",
    affirmation: "I attract abundance and share it generously."
  },
  9: {
    title: "The Humanist – Universal Love",
    desc: "Number 9 is humanity. Broad empathy, wants to save the world. A true artist and forgiver. Easily disappointed because reality doesn't match idealism.",
    strength: "Universal empathy, forgiving, tolerant, generous.",
    weakness: "Overly altruistic, easily used, holds onto past.",
    career: "Activist, artist, social worker, spiritual teacher.",
    love: "Unconditional love. Partner must understand your social vision.",
    spiritual: "Forgiving enemies and helping others is worship.",
    quote: "🕊️ 'Happiness is making someone smile effortlessly.'",
    affirmation: "I release the past and open my heart."
  },
  11: {
    title: "Intuitive Master – The Illuminator",
    desc: "Master Number 11. High intuition and inspiration. Incredible sensitivity to read energy. Prone to anxiety due to absorbing too much environmental energy.",
    strength: "Super intuition, inspiring, charismatic, visionary.",
    weakness: "Over-anxious, sensitive, easily stressed.",
    career: "Motivator, spiritual teacher, writer, visionary artist.",
    love: "Needs an understanding partner as an emotional anchor.",
    spiritual: "Accessing the subconscious; meditation is your breath.",
    quote: "✨ 'In the dark, stars shine the brightest.'",
    affirmation: "I embrace my sensitivity and guard my boundaries."
  },
  22: {
    title: "Master Builder – Architect of Civilization",
    desc: "Master Number 22. Turns huge dreams into reality. Builds foundations for the masses. High pressure of responsibility; must learn to delegate.",
    strength: "Grand vision, reliable executor, global leadership.",
    weakness: "Heavy burden, hard to relax, can be dictatorial.",
    career: "Global CEO, architect, humanitarian project leader.",
    love: "Needs an independent partner who supports life missions.",
    spiritual: "Working for the common good is the highest worship.",
    quote: "🏗️ 'I build bridges between heaven and earth.'",
    affirmation: "Every small step is a foundation for the future."
  },
  33: {
    title: "Master Teacher – Selfless Love",
    desc: "Master Number 33. Universal love and healing. Capable of healing others' inner wounds. Often neglects self-care for the sake of others.",
    strength: "Unconditional love, wise, god-tier empathy.",
    weakness: "Neglects self, overly altruistic, mental fatigue.",
    career: "Spiritual teacher, foundation leader, holistic therapist.",
    love: "Partner must be mature and join in serving the world.",
    spiritual: "Reaches the peak realizing everything is one.",
    quote: "🌟 'A true teacher gives the most without expecting return.'",
    affirmation: "I give with love and deserve to be cared for."
  }
};
// ==========================================
// PART 3: DATABASE NUMEROLOGI (ES) & LOGIKA FUNGSI
// ==========================================
const NAME_DB_ES: Record<number, any> = {
  1: {
    title: "El Pionero – Alma de Liderazgo",
    desc: "Tu nombre irradia la energía del 1, iniciativa e independencia. Creas oportunidades, lideras con naturalidad. Aprendiendo del fracaso, tu alma es un fuego guía.",
    strength: "Independiente, tomador de riesgos, creativo, determinado.",
    weakness: "Egoísta, impaciente, mal jugador de equipo.",
    career: "Emprendedor, director creativo, líder de proyecto, atleta.",
    love: "Busca una pareja igualitaria. No le gusta la posesividad.",
    spiritual: "Encuentra la paz siguiendo la vocación de su alma.",
    quote: "🚀 'No temas caminar solo, allí se forjan los líderes.'",
    affirmation: "Soy el líder de mi vida. Me atrevo a empezar."
  },
  2: {
    title: "El Mediador – Corazón Gentil",
    desc: "Vibra en el 2, sensibilidad y cooperación. Escuchas, entiendes y armonizas. Eres el pegamento en los grupos, aunque a menudo te sacrificas por los demás.",
    strength: "Empático, cooperativo, paciente, intuitivo, cálido.",
    weakness: "Hipersensible, indeciso, fácilmente manipulable.",
    career: "Consejero, diplomático, enfermero, psicólogo, diseñador.",
    love: "Leal y cariñoso. Necesita tranquilidad y estabilidad.",
    spiritual: "Se conecta con lo Divino en la naturaleza o abrazos.",
    quote: "🌊 'La gentileza no es debilidad, sino fuerza protectora.'",
    affirmation: "Abrazo mi sensibilidad. Me atrevo a decir no."
  },
  3: {
    title: "El Animador – Luz de Creatividad",
    desc: "La energía del 3 significa expresión. Nacido para compartir historias. Las ideas surgen rápido. Odia las rutinas. Muy sensible a las críticas tras la fachada alegre.",
    strength: "Comunicativo, creativo, optimista, humorístico.",
    weakness: "Se aburre rápido, falta de concentración, dramático.",
    career: "Escritor, actor, cantante, diseñador gráfico, youtuber.",
    love: "Ama con pasión. Se aburre si las relaciones se estancan.",
    spiritual: "Presencia divina en el arte y la risa.",
    quote: "🎭 'La vida es un escenario, juega tu mejor papel.'",
    affirmation: "Me expreso libremente sin miedo."
  },
  4: {
    title: "El Constructor – Base Sólida",
    desc: "El 4 es trabajo duro, disciplina y estabilidad. Confiable e incansable. Construyes el éxito piedra a piedra. Puede ser demasiado rígido a los cambios.",
    strength: "Diligente, honesto, organizado, responsable, práctico.",
    weakness: "Terco, perfeccionista, demasiado serio.",
    career: "Ingeniero, contador, gerente de proyectos, funcionario.",
    love: "Muestra amor con acciones. Garantiza seguridad financiera.",
    spiritual: "El trabajo duro es adoración. La ayuda práctica es oración.",
    quote: "🧱 'El éxito no es qué tan alto saltas, sino qué tan sólido aterrizas.'",
    affirmation: "Valoro el proceso. Cada pequeño paso es una victoria."
  },
  5: {
    title: "El Aventurero – Espíritu Libre",
    desc: "El 5 es libertad y cambio. Sed de nuevas experiencias, adaptable. A veces huye de la responsabilidad. Eres el viento que cambia las velas.",
    strength: "Adaptable, enérgico, persuasivo, toma riesgos.",
    weakness: "Impulsivo, se aburre rápido, inconsistente.",
    career: "Periodista, asistente de vuelo, fotógrafo de viajes.",
    love: "Necesita una pareja no posesiva que ame la aventura.",
    spiritual: "Encuentra a Dios en rincones inexplorados del mundo.",
    quote: "🌍 'La libertad es atreverse a ser uno mismo.'",
    affirmation: "Acojo el cambio con una mente abierta."
  },
  6: {
    title: "El Cuidador – Amor Ilimitado",
    desc: "El 6 es amor y familia. Centro de calidez, dispuesto a sacrificarse. Tu hogar es un palacio. A menudo olvidas cuidarte a ti mismo por cuidar a otros.",
    strength: "Amoroso, leal, responsable, artístico.",
    weakness: "Mandón, ansioso, se hace la víctima.",
    career: "Maestro, enfermero, consejero, chef, trabajador social.",
    love: "Mima a su pareja. Necesita aprecio para evitar el agotamiento.",
    spiritual: "Cuidar a la familia y cocinar con amor es una oración.",
    quote: "🏡 'El amor verdadero no te hace perderte a ti mismo.'",
    affirmation: "Doy de buena gana y también recibo amor."
  },
  7: {
    title: "El Pensador – Buscador de la Verdad",
    desc: "El 7 es análisis y espiritualidad. Un pensador profundo que ama la soledad. Intuición aguda. Puede ser demasiado crítico y aislado.",
    strength: "Analítico, intuitivo, sabio, independiente, perfeccionista.",
    weakness: "Escéptico, solitario, pesimista, difícil de confiar.",
    career: "Investigador, científico, filósofo, programador, escritor.",
    love: "Difícil de enamorar. Una vez confía, profundamente leal.",
    spiritual: "Cerca de lo Divino en el silencio y meditación.",
    quote: "🔍 'Cuanto más profundo buceas, más te das cuenta de la ilusión.'",
    affirmation: "Confío en el proceso de buscar la paz."
  },
  8: {
    title: "El Ejecutivo – Poder y Abundancia",
    desc: "El 8 es poder y éxito material. Talento natural para los negocios. Ambicioso y trabajador. No dejes que la obsesión borre la felicidad simple.",
    strength: "Ambicioso, eficiente, seguro, autoritario.",
    weakness: "Adicto al trabajo, materialista, oculta emociones.",
    career: "CEO, banquero, bienes raíces, juez, consultor.",
    love: "Proporciona lujo y estabilidad. Necesita tiempo de calidad.",
    spiritual: "La ley natural y la justicia forman tu camino espiritual.",
    quote: "👑 'La máxima riqueza es a quién ayudas cuando la tienes.'",
    affirmation: "Atraigo abundancia y la comparto generosamente."
  },
  9: {
    title: "El Humanista – Amor Universal",
    desc: "El 9 es la humanidad. Amplia empatía, quiere salvar al mundo. Un verdadero artista. Se decepciona fácilmente por la dura realidad.",
    strength: "Empatía universal, perdonador, tolerante, generoso.",
    weakness: "Demasiado altruista, se aferra al pasado.",
    career: "Activista, artista, trabajador social, maestro espiritual.",
    love: "Amor incondicional. La pareja debe entender tu visión social.",
    spiritual: "Perdonar y ayudar a los demás es adoración.",
    quote: "🕊️ 'La felicidad es hacer sonreír a alguien sin esfuerzo.'",
    affirmation: "Libero el pasado y abro mi corazón."
  },
  11: {
    title: "Maestro Intuitivo – El Iluminador",
    desc: "Número Maestro 11. Alta intuición e inspiración. Sensibilidad para leer energía. Propenso a la ansiedad por absorber demasiada energía.",
    strength: "Súper intuición, inspirador, carismático, visionario.",
    weakness: "Demasiado ansioso, sensible, se estresa fácil.",
    career: "Motivador, maestro espiritual, escritor, artista visionario.",
    love: "Necesita una pareja comprensiva como ancla emocional.",
    spiritual: "Acceder al subconsciente; la meditación es vital.",
    quote: "✨ 'En la oscuridad, las estrellas brillan más.'",
    affirmation: "Abrazo mi sensibilidad y guardo mis límites."
  },
  22: {
    title: "Maestro Constructor – Arquitecto de la Civilización",
    desc: "Número Maestro 22. Convierte enormes sueños en realidad. Construye bases para las masas. Alta presión, debe aprender a delegar.",
    strength: "Gran visión, ejecutor confiable, liderazgo global.",
    weakness: "Carga pesada, difícil de relajar, puede ser dictatorial.",
    career: "CEO global, arquitecto, líder de proyectos humanitarios.",
    love: "Necesita una pareja independiente que apoye sus misiones.",
    spiritual: "Trabajar por el bien común es la mayor adoración.",
    quote: "🏗️ 'Construyo puentes entre el cielo y la tierra.'",
    affirmation: "Cada pequeño paso es una base para el futuro."
  },
  33: {
    title: "Maestro de Maestros – Amor Desinteresado",
    desc: "Número Maestro 33. Amor y sanación universal. Capaz de curar las heridas de otros. A menudo descuida el cuidado personal.",
    strength: "Amor incondicional, sabio, empatía nivel dios.",
    weakness: "Se descuida a sí mismo, demasiado altruista.",
    career: "Maestro espiritual, líder de fundación, terapeuta.",
    love: "La pareja debe ser madura y unirse al servicio del mundo.",
    spiritual: "Alcanza la cima dándose cuenta de que todo es uno.",
    quote: "🌟 'Un verdadero maestro da más sin esperar retorno.'",
    affirmation: "Doy con amor y merezco ser cuidado."
  }
};

function getMeaningsDB(lang: string) {
  if (lang === "en") return NAME_DB_EN;
  if (lang === "es") return NAME_DB_ES;
  return NAME_DB_ID;
}

function calculateNameNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (let char of cleanName) total += letterValues[char] || 0;
  const reduce = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num > 9) return reduce(String(num).split('').reduce((a,b) => a + parseInt(b), 0));
    return num;
  };
  return reduce(total);
}

function calculateVowelNumber(name: string): number {
  const vowels = ['a','e','i','o','u','y'];
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (let char of cleanName) if (vowels.includes(char)) total += letterValues[char] || 0;
  const reduce = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num > 9) return reduce(String(num).split('').reduce((a,b) => a + parseInt(b), 0));
    return num;
  };
  return reduce(total);
}

function calculateConsonantNumber(name: string): number {
  const vowels = ['a','e','i','o','u','y'];
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (let char of cleanName) if (!vowels.includes(char)) total += letterValues[char] || 0;
  const reduce = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num > 9) return reduce(String(num).split('').reduce((a,b) => a + parseInt(b), 0));
    return num;
  };
  return reduce(total);
}

function getDailyMessage(name: string, dateStr: string, lang: string): string {
  const seed = name + dateStr;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const messages = DAILY_MSG_ML[lang] || DAILY_MSG_ML["id"];
  return messages[Math.abs(hash) % messages.length];
}
// ==========================================
// PART 4: KOMPONEN UTAMA REACT & UI
// ==========================================
export default function NameMeaning({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const ui = UI_DICT[activeLang] || UI_DICT["id"];
  const nameDB = getMeaningsDB(activeLang);
  const firstLetters = FIRST_LETTER_ML[activeLang] || FIRST_LETTER_ML["id"];

  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    setTodayStr(new Date().toISOString().slice(0,10));
  }, []);

  const handleAnalyze = () => {
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const expressionNum = calculateNameNumber(name);
      const vowelNum = calculateVowelNumber(name);
      const consonantNum = calculateConsonantNumber(name);
      const firstLetter = name.trim()[0].toLowerCase();
      
      const meaning = nameDB[expressionNum] || nameDB[expressionNum % 9 || 9];
      const dailyMessage = getDailyMessage(name, todayStr, activeLang);
      
      setResult({
        name: name.trim(),
        expression: expressionNum,
        vowel: vowelNum,
        consonant: consonantNum,
        firstLetter,
        firstMeaning: firstLetters[firstLetter] || "...",
        meaning,
        dailyMessage,
      });
      setLoading(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `✨ ${ui.title}: ${result.name} ✨\n${ui.expression}: ${result.expression} - ${result.meaning.title}\n${result.meaning.desc.substring(0, 150)}...\n\nAksaraDiri!`;
    if (navigator.share) {
      try { await navigator.share({ title: `${ui.title} ${result.name}`, text }); } catch(e) {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6 selection:bg-teal-500/30">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-3 drop-shadow-2xl">📖✨</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent pb-2">
          {ui.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{ui.subtitle}</p>
      </div>

      {/* INPUT FORM */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative z-20">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ui.placeholder}
          className="w-full bg-black/50 border border-white/20 rounded-2xl px-6 py-4 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !name.trim()}
          className="w-full mt-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-[length:200%_auto] animate-gradient-x font-black text-lg hover:scale-[1.02] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(20,184,166,0.3)] tracking-wide uppercase"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {ui.loading}
            </span>
          ) : ui.btn}
        </button>
      </div>

      {/* LOADING ANIMATION */}
      {loading && (
        <div className="flex justify-center mt-16">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin"></div>
          </div>
        </div>
      )}

      {/* RESULT SECTION */}
      {result && !loading && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-br from-[#021f22] to-[#041216] border border-teal-500/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* MAIN HEADER RESULT */}
            <div className="text-center relative z-10 mb-8">
              <div className="inline-block max-w-full px-4">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black break-words whitespace-normal leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-cyan-200 drop-shadow-lg">
                  {result.name}
                </span>
              </div>
              <div className="mt-6 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{ui.expression}</span>
                <span className="text-6xl font-black text-teal-400 drop-shadow-[0_0_20px_rgba(20,184,166,0.4)]">{result.expression}</span>
              </div>
            </div>

            {/* MAIN DESCRIPTION */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 text-center backdrop-blur-sm mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">{result.meaning.title}</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{result.meaning.desc}</p>
            </div>

            {/* GRID STATS (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center hover:bg-emerald-500/20 transition-colors">
                <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">{ui.strength}</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{result.meaning.strength}</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-center hover:bg-rose-500/20 transition-colors">
                <h4 className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">{ui.weakness}</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{result.meaning.weakness}</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-2xl text-center hover:bg-cyan-500/20 transition-colors">
                <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2">{ui.career}</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{result.meaning.career}</p>
              </div>
            </div>

            {/* GRID LOVE & SPIRITUAL (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="bg-pink-500/10 border border-pink-500/20 p-6 rounded-2xl">
                <h4 className="text-pink-400 font-black text-xs uppercase tracking-widest mb-3">{ui.love}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{result.meaning.love}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl">
                <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-3">{ui.spiritual}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{result.meaning.spiritual}</p>
              </div>
            </div>

            {/* NUMEROLOGY BREAKDOWN (Vowel, Consonant, First Letter) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center flex flex-col justify-center">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">{ui.firstLetter}: {result.firstLetter.toUpperCase()}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{result.firstMeaning}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center">
                <span className="text-rose-400 text-xs font-bold uppercase tracking-widest block mb-2">{ui.vowel}</span>
                <p className="text-4xl font-black text-white mb-1">{result.vowel}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{ui.vowelDesc}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">{ui.consonant}</span>
                <p className="text-4xl font-black text-white mb-1">{result.consonant}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{ui.consonantDesc}</p>
              </div>
            </div>

            {/* QUOTE & AFFIRMATION */}
            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 text-center relative z-10 mb-6">
              <p className="text-amber-300 italic text-base md:text-lg font-medium">"{result.meaning.quote.replace(/['"]+/g, '')}"</p>
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-white font-bold text-sm tracking-wide">✨ {result.meaning.affirmation}</p>
              </div>
            </div>

            {/* DAILY MESSAGE */}
            <div className="p-5 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-center animate-pulse-slow relative z-10 mb-8">
              <p className="text-teal-100 text-sm">
                🌟 <span className="font-bold uppercase tracking-wider text-teal-400 text-xs mr-2">{ui.daily}</span> 
                {result.dailyMessage}
              </p>
            </div>

            {/* SHARE BUTTON */}
            <button
              onClick={handleShare}
              className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest relative z-10"
            >
              {ui.shareBtn}
            </button>

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
              toolName={ui.title} 
              resultId={name} 
            />
</>
            {/* SAMPAI SINI */}

          </div>
        </div>
      )}

      <div className="mt-12 text-center pb-8">
        <p className="text-[11px] text-slate-500 italic max-w-lg mx-auto leading-relaxed">{ui.disclaimer}</p>
      </div>

      <style jsx>{`
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 2s ease infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}