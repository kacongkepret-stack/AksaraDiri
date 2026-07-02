"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== INTERFACES ==========
interface InitialData {
  title: string; desc: string; karakter: string; caraBertemu: string;
  kekuatanHubungan: string; warnaKeberuntungan: string; quote: string;
}

// ========== KAMUS UI MULTI-BAHASA ==========
const UI_DICT: Record<string, any> = {
  id: {
    title: "Inisial Jodoh Algoritmik",
    subtitle: "Prediksi huruf awalan nama pasangan hidup Anda berdasarkan komputasi karakter atau tarikan probabilitas acak.",
    inputPh: "Ketik nama lengkap Anda di sini...",
    btnPredict: "🔮 Sinkronisasi Algoritma", btnLoading: "Memindai...",
    loadRandom: "Mengacak Roda Takdir...", loadPredict: "Mengkalkulasi Probabilitas...",
    lblRandom: "Tarik Acak", lblPredict: "Hasil Algoritma",
    char: "Karakter Dasar", meet: "Potensi Titik Temu",
    synergy: "Sinergi Hubungan", color: "Resonansi Warna",
    shareBtn: "📤 Bagikan Analisis", tweetBtn: "🐦 Tweet",
    emptyStart: "Klik sinkronisasi untuk memulai", emptyWait: "Masukkan nama Anda untuk memulai komputasi",
    sharePrefix: "Berdasarkan kalkulasi matriks dari nama", shareRandom: "Tarik Kartu Takdir:",
    shareText: "Inisial pasangan hidupmu mengarah pada huruf:", copied: "Hasil ramalan disalin ke clipboard!"
  },
  en: {
    title: "Algorithmic Soulmate Initial",
    subtitle: "Predict your soulmate's initial based on character computation or random probability draw.",
    inputPh: "Type your full name here...",
    btnPredict: "🔮 Algorithm Sync", btnLoading: "Scanning...",
    loadRandom: "Shuffling the Wheel of Fate...", loadPredict: "Calculating Probabilities...",
    lblRandom: "Random Draw", lblPredict: "Algorithm Result",
    char: "Core Character", meet: "Meeting Potential",
    synergy: "Relationship Synergy", color: "Color Resonance",
    shareBtn: "📤 Share Analysis", tweetBtn: "🐦 Tweet",
    emptyStart: "Click sync to start", emptyWait: "Enter your name to start computation",
    sharePrefix: "Based on matrix calculation of the name", shareRandom: "Destiny Card Draw:",
    shareText: "Your soulmate's initial points to the letter:", copied: "Prediction copied to clipboard!"
  },
  es: {
    title: "Inicial del Alma Gemela",
    subtitle: "Predice la inicial de tu alma gemela basándose en cómputos de carácter o probabilidad aleatoria.",
    inputPh: "Escribe tu nombre completo aquí...",
    btnPredict: "🔮 Sincronización", btnLoading: "Escaneando...",
    loadRandom: "Barajando la Rueda del Destino...", loadPredict: "Calculando Probabilidades...",
    lblRandom: "Sorteo Aleatorio", lblPredict: "Resultado del Algoritmo",
    char: "Carácter Principal", meet: "Encuentro Potencial",
    synergy: "Sinergia de Relación", color: "Resonancia de Color",
    shareBtn: "📤 Compartir Análisis", tweetBtn: "🐦 Tuitear",
    emptyStart: "Haz clic en sincronizar para comenzar", emptyWait: "Ingresa tu nombre para comenzar",
    sharePrefix: "Basado en el cálculo matricial del nombre", shareRandom: "Sorteo del Destino:",
    shareText: "La inicial de tu alma gemela apunta a la letra:", copied: "¡Predicción copiada al portapapeles!"
  }
};

// ==========================================
// DATABASE INISIAL: INDONESIA (ID)
// ==========================================
const DB_ID: Record<string, InitialData> = {
  A: { title: "Ambisi & Kepemimpinan", desc: "Pasangan dengan inisial A adalah sosok pemimpin alami, berani, dan penuh inisiatif. Mereka memiliki aura yang kuat dan sering menjadi pusat perhatian.", karakter: "Percaya diri, ambisius, kreatif, dan sangat mandiri. Mereka tidak takut mengambil risiko.", caraBertemu: "Kemungkinan besar Anda akan bertemu di acara formal, kompetisi, atau saat mengejar mimpi bersama.", kekuatanHubungan: "Kalian akan saling memotivasi untuk meraih impian. Hubungan ini penuh gairah.", warnaKeberuntungan: "Merah & Emas", quote: "Bersamanya, setiap hari adalah petualangan baru yang mendebarkan." },
  B: { title: "Lembut & Setia", desc: "Inisial B melambangkan ketulusan, kesabaran, dan cinta yang dalam. Pasangan Anda adalah sosok yang tenang namun memiliki pendirian kuat.", karakter: "Penyayang, setia, pekerja keras, dan suka menolong. Pendengar yang baik.", caraBertemu: "Di perpustakaan, toko buku, acara amal, atau melalui teman dekat.", kekuatanHubungan: "Stabilitas dan kenyamanan. Anda akan merasa sangat dihargai dan dilindungi.", warnaKeberuntungan: "Hijau & Coklat", quote: "Cinta sejati tidak berteriak, ia berbisik namun tetap abadi." },
  C: { title: "Kreatif & Ceria", desc: "Pasangan dengan inisial C adalah jiwa seni yang penuh warna. Mereka membawa tawa dan inspirasi ke mana pun pergi.", karakter: "Optimis, komunikatif, imajinatif, dan mudah bergaul. Suka kejutan.", caraBertemu: "Di konser, galeri seni, kafe, atau saat traveling. Bisa juga di media sosial.", kekuatanHubungan: "Hubungan yang menyenangkan dan penuh kreativitas. Tidak monoton.", warnaKeberuntungan: "Kuning & Oranye", quote: "Bersamanya, dunia terasa lebih berwarna dan penuh tawa." },
  D: { title: "Tangguh & Bertanggung Jawab", desc: "Inisial D mencerminkan keteguhan dan dedikasi. Pasangan Anda adalah sosok yang bisa diandalkan dalam situasi apa pun.", karakter: "Disiplin, praktis, jujur, dan sangat bertanggung jawab.", caraBertemu: "Di tempat kerja, proyek sosial, atau saat Anda membutuhkan bantuan profesional.", kekuatanHubungan: "Fondasi yang kokoh. Anda merasa aman secara finansial dan emosional.", warnaKeberuntungan: "Biru Dongker & Abu-abu", quote: "Bersamanya, badai apa pun terasa lebih ringan." },
  E: { title: "Ekspresif & Empatik", desc: "Pasangan inisial E sangat peka terhadap perasaan orang lain. Mereka pendengar ulung dan pemberi semangat.", karakter: "Ramah, ekspresif, penuh kasih, dan mudah beradaptasi.", caraBertemu: "Di acara seni, sesi konseling, atau saat berbagi cerita di tempat relaksasi.", kekuatanHubungan: "Dukungan emosional kuat. Selalu merasa didengarkan dan divalidasi.", warnaKeberuntungan: "Biru Muda & Putih", quote: "Cintanya adalah pelukan yang tidak pernah terlihat tapi selalu terasa." },
  F: { title: "Loyal & Protektif", desc: "Inisial F adalah simbol kesetiaan dan perlindungan. Pasangan Anda akan menjadi perisai bagi Anda dan keluarga.", karakter: "Setia, bertanggung jawab, hati-hati, dan sangat protektif.", caraBertemu: "Di lingkungan sekitar perumahan, atau saat butuh pertolongan.", kekuatanHubungan: "Keamanan mutlak. Tidak akan merasa sendirian menghadapi masalah.", warnaKeberuntungan: "Coklat & Krem", quote: "Bersamanya, sebuah rumah tidak sekadar bangunan, tapi rasa aman." },
  G: { title: "Bijaksana & Spiritual", desc: "Pasangan dengan inisial G memiliki kedalaman jiwa dan pandangan hidup yang filosofis dan menenangkan.", karakter: "Intuitif, bijaksana, tenang, suka merenung dan berdiskusi mendalam.", caraBertemu: "Di tempat retreat, yoga, atau saat mencari makna hidup.", kekuatanHubungan: "Hubungan yang menenangkan dan penuh makna. Tumbuh secara spiritual.", warnaKeberuntungan: "Ungu & Perak", quote: "Cintanya adalah cahaya di tengah kebingungan dan kebisingan dunia." },
  H: { title: "Harmonis & Penuh Kasih", desc: "Inisial H membawa energi kedamaian dan keseimbangan. Pasangan Anda adalah perekat hubungan yang handal.", karakter: "Lembut, penyayang, diplomatis, dan selalu menghindari konflik tidak perlu.", caraBertemu: "Di acara kumpul keluarga, pesta teman, atau di keramaian sosial.", kekuatanHubungan: "Harmoni yang langgeng. Kompromi selalu menjadi jalan keluar utama.", warnaKeberuntungan: "Merah Muda & Lavender", quote: "Bersamanya, hati terasa tenang dan penuh rasa syukur." },
  I: { title: "Idealis & Romantis", desc: "Pasangan dengan inisial I adalah pemimpi romantis. Menghargai nilai kesetiaan dan takdir.", karakter: "Idealis, kreatif, sensitif, dan penuh dengan imajinasi romantis.", caraBertemu: "Di tempat indah seperti pantai, taman bunga, atau destinasi wisata alam.", kekuatanHubungan: "Cinta penuh kejutan manis dan gestur puitis. Terasa seperti dongeng.", warnaKeberuntungan: "Putih & Perak", quote: "Bersamanya, setiap hari adalah lembaran cerita yang menakjubkan." },
  J: { title: "Jenaka & Energik", desc: "Inisial J menjanjikan pasangan humoris dan penuh energi positif. Sumber tawa harian Anda.", karakter: "Ceria, spontan, supel, dan sangat suka bertualang secara impulsif.", caraBertemu: "Di pesta, festival, atau saat perjalanan liburan spontan.", kekuatanHubungan: "Tidak pernah membosankan. Tawa adalah fondasi hubungan.", warnaKeberuntungan: "Kuning & Oranye", quote: "Bersamanya, tertawa lepas adalah bahasa cinta yang paling murni." },
  K: { title: "Karismatik & Visioner", desc: "Pasangan dengan inisial K memiliki daya tarik luar biasa dan visi masa depan yang terstruktur.", karakter: "Percaya diri, visioner, ambisius, dan memiliki aura yang menginspirasi.", caraBertemu: "Di seminar, acara bisnis, atau lingkungan profesional.", kekuatanHubungan: "Terus termotivasi untuk menjadi versi terbaik diri Anda.", warnaKeberuntungan: "Emas & Hitam", quote: "Bersamanya, mimpi besar terasa sangat logis untuk dicapai." },
  L: { title: "Luwes & Penyayang", desc: "Inisial L melambangkan keluwesan adaptasi dan cinta yang lembut. Mudah diterima di mana saja.", karakter: "Baik hati, sabar, mudah bergaul, dan sangat suka memberikan bantuan.", caraBertemu: "Di kegiatan sosial, acara amal, atau saat menjadi relawan.", kekuatanHubungan: "Keharmonisan tinggi dan penerimaan karakter tanpa syarat.", warnaKeberuntungan: "Hijau Muda & Putih", quote: "Cintanya mengalir seperti air, lembut namun tak terbendung." },
  M: { title: "Misterius & Magnetis", desc: "Pasangan dengan inisial M memiliki daya tarik gravitasi yang sulit dijelaskan. Penuh rahasia memikat.", karakter: "Intuitif, tenang, penuh pesona, memancarkan aura misterius elegan.", caraBertemu: "Di tempat eksklusif, pameran, atau saat perjalanan sendirian.", kekuatanHubungan: "Ketertarikan tak pudar. Selalu ada sisi baru yang ditemukan.", warnaKeberuntungan: "Hitam & Perak", quote: "Bersamanya, setiap hari adalah teka-teki indah yang seru dipecahkan." },
  N: { title: "Navigator Kehidupan", desc: "Inisial N membawa energi kebijaksanaan praktis. Pemandu arah yang baik dalam mengambil keputusan.", karakter: "Analitis, rasional, sangat sabar, dan haus pengetahuan.", caraBertemu: "Di perpustakaan, kampus, toko buku, atau komunitas intelektual.", kekuatanHubungan: "Stabilitas intelektual. Selalu punya teman diskusi sepadan.", warnaKeberuntungan: "Biru & Hijau", quote: "Bersamanya, persimpangan jalan hidup terasa memiliki arah jelas." },
  O: { title: "Optimis & Terbuka", desc: "Pasangan inisial O selalu melihat sisi terang dari segala hal. Mereka sangat positif.", karakter: "Sangat optimis, berpikiran terbuka, dermawan, ekstrovert sosial.", caraBertemu: "Di acara perayaan, festival, atau saat bersantai di akhir pekan.", kekuatanHubungan: "Rumah yang ceria, bebas prasangka, dan penuh harapan.", warnaKeberuntungan: "Emas & Oranye", quote: "Bersamanya, badai hari ini hanyalah persiapan pelangi esok hari." },
  P: { title: "Protektif & Penuh Gairah", desc: "Inisial P adalah wujud nyata perlindungan dan gairah. Akan bertarung demi Anda.", karakter: "Sangat setia, penuh gairah hidup, protektif, ambisi membara.", caraBertemu: "Di tempat kompetitif, gym, atau situasi menantang.", kekuatanHubungan: "Perlindungan absolut dan intensitas cinta yang tidak mudah padam.", warnaKeberuntungan: "Merah & Hitam", quote: "Bersamanya, Anda ditempatkan di tumpuan prioritas tertinggi." },
  Q: { title: "Unik & Intuitif", desc: "Pasangan inisial Q sangat langka. Memiliki keunikan pemikiran out-of-the-box.", karakter: "Sangat kreatif, intuitif, sedikit eksentrik, penuh ide brilian.", caraBertemu: "Di festival seni alternatif, kedai kopi tersembunyi, atau tempat baru.", kekuatanHubungan: "Anti-mainstream. Selalu ada kejutan dan cara pandang baru.", warnaKeberuntungan: "Ungu & Hijau Toska", quote: "Belajar membongkar aturan lama dan menciptakan dunia kalian sendiri." },
  R: { title: "Romantis & Realistis", desc: "Inisial R adalah master penyeimbang. Tahu kapan puitis dan kapan logis.", karakter: "Romantis namun membumi, bertanggung jawab, pekerja keras setia.", caraBertemu: "Di tempat makan kasual, perayaan kantor, atau pertemuan via rekan.", kekuatanHubungan: "Keseimbangan sempurna antara fantasi cinta dan realitas kehidupan.", warnaKeberuntungan: "Merah Muda & Coklat", quote: "Bersamanya, impian cinta terasa sangat nyata dan dapat disentuh." },
  S: { title: "Supel & Sensitif", desc: "Pasangan inisial S memiliki kecerdasan sosial tinggi dan radar kepekaan batin kuat.", karakter: "Sangat ramah, emosional/sensitif, artistik, mudah bersimpati.", caraBertemu: "Di ruang publik santai, konser akustik, atau saat me-time.", kekuatanHubungan: "Koneksi batin tinggi. Merasa dipahami tanpa banyak menjelaskan.", warnaKeberuntungan: "Perak & Biru Muda", quote: "Bersamanya, keheningan bukanlah hal canggung, melainkan bahasa cinta." },
  T: { title: "Teguh & Tangguh", desc: "Inisial T melambangkan baja. Resiliensi yang tidak mudah hancur oleh masalah.", karakter: "Sangat disiplin, mental kuat, ulet, mengambil tanggung jawab penuh.", caraBertemu: "Di lingkungan kerja tekanan tinggi, atau saat melewati krisis.", kekuatanHubungan: "Ketangguhan tim. Mampu melewati badai terburuk sekalipun.", warnaKeberuntungan: "Coklat & Abu-abu", quote: "Bersamanya, setiap masalah besar hanyalah kerikil yang bisa dilompati." },
  U: { title: "Cinta Tanpa Syarat", desc: "Pasangan inisial U mencintai melebihi fisik atau materi. Ketulusan murni.", karakter: "Sangat pemaaf, tulus, penyayang ekstrem, empati melimpah.", caraBertemu: "Di organisasi kerelawanan, tempat ibadah, atau titik terendah hidup.", kekuatanHubungan: "Penerimaan total atas masa lalu dan kekurangan Anda.", warnaKeberuntungan: "Putih & Emas", quote: "Tidak perlu berpura-pura menjadi orang lain untuk dicintai." },
  V: { title: "Visioner & Vitalitas", desc: "Inisial V ibarat generator energi. Memancarkan vitalitas tinggi yang menular.", karakter: "Pemikir visioner, energik, inovatif, percaya diri.", caraBertemu: "Di pameran teknologi, kompetisi ide, atau perayaan pencapaian.", kekuatanHubungan: "Akselerasi kesuksesan. Berlari sangat cepat menuju impian.", warnaKeberuntungan: "Ungu & Emas", quote: "Masa depan bukan sesuatu yang ditunggu, melainkan diciptakan." },
  W: { title: "Bijaksana & Hangat", desc: "Pasangan inisial W adalah pelabuhan aman. Kebijaksanaan mentor, kehangatan sahabat.", karakter: "Sangat bijaksana, merangkul hangat, sabar, empati rasional.", caraBertemu: "Dalam diskusi kelompok, komunitas, atau saat mencari mentor.", kekuatanHubungan: "Kedamaian absolut dan keputusan yang win-win solution.", warnaKeberuntungan: "Biru Tua & Hijau Toska", quote: "Bersamanya, gejolak emosi mereda, menyisakan pikiran jernih." },
  X: { title: "Misteri & Eksotis", desc: "Inisial X adalah anomali. Menolak konvensi sosial dan memiliki jalan hidup sendiri.", karakter: "Ultra-unik, misterius, eksentrik, tindakannya sulit ditebak.", caraBertemu: "Di destinasi antah-berantah, backpacking, atau kejadian ajaib.", kekuatanHubungan: "Keluar dari zona nyaman. Eksplorasi tanpa peta.", warnaKeberuntungan: "Hitam Pekat & Perak", quote: "Normalitas itu membosankan. Hidup adalah misteri eksotis." },
  Y: { title: "Berjiwa Muda & Yakin", desc: "Pasangan inisial Y seperti memiliki serum anti-penuaan mental. Selalu optimis.", karakter: "Berjiwa muda, sangat optimis, penuh keyakinan, pendobrak rasa takut.", caraBertemu: "Di petualangan alam, wahana ekstrem, atau mencoba hobi baru.", kekuatanHubungan: "Semangat bermain yang tak pudar meski usia bertambah.", warnaKeberuntungan: "Kuning Cerah & Hijau Daun", quote: "Bersamanya, angka usia kehilangan maknanya." },
  Z: { title: "Antusiasme Membara", desc: "Inisial Z adalah puncak gairah hidup. Melakukan segala sesuatu dengan totalitas.", karakter: "Sangat antusias, ulet, pemikir cepat, letupan energi kuat.", caraBertemu: "Di garis depan pergerakan, konser megah, atau merintis proyek.", kekuatanHubungan: "Suntikan motivasi tanpa henti. Rasa malas tak ada ruang.", warnaKeberuntungan: "Oranye Terang & Hitam", quote: "Rutinitas sepele terasa seperti misi petualangan epik." }
};
// ==========================================
// DATABASE INISIAL: INGGRIS (EN)
// ==========================================
const DB_EN: Record<string, InitialData> = {
  A: { title: "Ambition & Leadership", desc: "A partner with initial A is a natural leader, brave, and full of initiative. They have a strong aura and often become the center of attention.", karakter: "Confident, ambitious, creative, and highly independent. Not afraid to take risks.", caraBertemu: "Most likely you will meet at formal events, competitions, or while pursuing dreams together.", kekuatanHubungan: "You will motivate each other to achieve dreams. This relationship is passionate.", warnaKeberuntungan: "Red & Gold", quote: "With them, every day is a thrilling new adventure." },
  B: { title: "Gentle & Loyal", desc: "Initial B symbolizes sincerity, patience, and deep love. Your partner is calm yet has a strong stance.", karakter: "Affectionate, loyal, hardworking, and helpful. A great listener.", caraBertemu: "At a library, bookstore, charity event, or through close friends.", kekuatanHubungan: "Stability and comfort. You will feel highly valued and protected.", warnaKeberuntungan: "Green & Brown", quote: "True love doesn't shout, it whispers yet remains eternal." },
  C: { title: "Creative & Cheerful", desc: "A partner with initial C is a colorful artistic soul. They bring laughter and inspiration wherever they go.", karakter: "Optimistic, communicative, imaginative, and sociable. Loves surprises.", caraBertemu: "At concerts, art galleries, cafes, or while traveling. Also on social media.", kekuatanHubungan: "A fun and highly creative relationship. Never monotonous.", warnaKeberuntungan: "Yellow & Orange", quote: "With them, the world feels more colorful and full of laughter." },
  D: { title: "Tough & Responsible", desc: "Initial D reflects firmness and dedication. Your partner is reliable in any situation.", karakter: "Disciplined, practical, honest, and highly responsible.", caraBertemu: "At work, social projects, or when you need professional help.", kekuatanHubungan: "A solid foundation. You feel financially and emotionally secure.", warnaKeberuntungan: "Navy Blue & Gray", quote: "With them, any storm feels lighter." },
  E: { title: "Expressive & Empathetic", desc: "An initial E partner is highly sensitive to others' feelings. They are master listeners and encouragers.", karakter: "Friendly, expressive, affectionate, and adaptable.", caraBertemu: "At art events, counseling sessions, or while sharing stories in relaxing places.", kekuatanHubungan: "Strong emotional support. Always feeling heard and validated.", warnaKeberuntungan: "Light Blue & White", quote: "Their love is an unseen hug that is always felt." },
  F: { title: "Loyal & Protective", desc: "Initial F is a symbol of loyalty and protection. Your partner will be a shield for you and your family.", karakter: "Loyal, responsible, cautious, and highly protective.", caraBertemu: "In the neighborhood, or when you need a helping hand.", kekuatanHubungan: "Absolute security. Never feeling alone when facing problems.", warnaKeberuntungan: "Brown & Cream", quote: "With them, a home is not just a building, but a sense of safety." },
  G: { title: "Wise & Spiritual", desc: "A partner with initial G has depth of soul and a calming, philosophical outlook on life.", karakter: "Intuitive, wise, calm, loves to reflect and have deep discussions.", caraBertemu: "At a retreat, yoga, or while searching for life's meaning.", kekuatanHubungan: "A calming and meaningful connection. Growing together spiritually.", warnaKeberuntungan: "Purple & Silver", quote: "Their love is a light amidst the world's confusion and noise." },
  H: { title: "Harmonious & Loving", desc: "Initial H brings energy of peace and balance. Your partner is a reliable relationship glue.", karakter: "Gentle, affectionate, diplomatic, and avoids unnecessary conflicts.", caraBertemu: "At family gatherings, friends' parties, or social crowds.", kekuatanHubungan: "Enduring harmony. Compromise is always the main way out.", warnaKeberuntungan: "Pink & Lavender", quote: "With them, the heart feels calm and full of gratitude." },
  I: { title: "Idealistic & Romantic", desc: "A partner with initial I is a romantic dreamer. Values loyalty and destiny.", karakter: "Idealistic, creative, sensitive, and full of romantic imagination.", caraBertemu: "In beautiful places like beaches, flower gardens, or nature destinations.", kekuatanHubungan: "Love full of sweet surprises and poetic gestures. Feels like a fairy tale.", warnaKeberuntungan: "White & Silver", quote: "With them, every day is a breathtaking page of a story." },
  J: { title: "Witty & Energetic", desc: "Initial J promises a humorous partner full of positive energy. Your daily source of laughter.", karakter: "Cheerful, spontaneous, sociable, and impulsively adventurous.", caraBertemu: "At parties, festivals, or during spontaneous holiday trips.", kekuatanHubungan: "Never boring. Laughter is the foundation of the relationship.", warnaKeberuntungan: "Yellow & Orange", quote: "With them, laughing freely is the purest language of love." },
  K: { title: "Charismatic & Visionary", desc: "A partner with initial K has incredible appeal and a structured vision for the future.", karakter: "Confident, visionary, ambitious, and has an inspiring aura.", caraBertemu: "At seminars, business events, or in professional environments.", kekuatanHubungan: "Constantly motivated to become the best version of yourself.", warnaKeberuntungan: "Gold & Black", quote: "With them, huge dreams feel incredibly logical to achieve." },
  L: { title: "Flexible & Affectionate", desc: "Initial L symbolizes adaptability and gentle love. Easily accepted anywhere.", karakter: "Kind-hearted, patient, sociable, and loves to help.", caraBertemu: "At social activities, charity events, or while volunteering.", kekuatanHubungan: "High harmony and unconditional acceptance of character.", warnaKeberuntungan: "Light Green & White", quote: "Their love flows like water, gently adapting yet unstoppable." },
  M: { title: "Mysterious & Magnetic", desc: "A partner with initial M has an unexplainable gravitational pull. Full of captivating secrets.", karakter: "Intuitive, calm, charming, radiating an elegant mysterious aura.", caraBertemu: "In exclusive places, exhibitions, or while traveling alone.", kekuatanHubungan: "Unfading attraction. Always a new side to discover.", warnaKeberuntungan: "Black & Silver", quote: "With them, every day is a beautiful puzzle to solve." },
  N: { title: "Life Navigator", desc: "Initial N brings practical wisdom. Your partner is a great guide in making decisions.", karakter: "Analytical, rational, highly patient, and thirsty for knowledge.", caraBertemu: "At a library, campus, bookstore, or intellectual community.", kekuatanHubungan: "Intellectual stability. Always having an equal discussion partner.", warnaKeberuntungan: "Blue & Green", quote: "With them, life's crossroads have clear directions." },
  O: { title: "Optimistic & Open", desc: "An initial O partner always sees the silver lining. They are incredibly positive.", karakter: "Highly optimistic, open-minded, generous, and socially extroverted.", caraBertemu: "At celebrations, festivals, or while relaxing on the weekend.", kekuatanHubungan: "A consistently cheerful home, free from prejudice, full of hope.", warnaKeberuntungan: "Gold & Orange", quote: "With them, today's storm is just preparation for tomorrow's rainbow." },
  P: { title: "Protective & Passionate", desc: "Initial P embodies protection and passion. They will fight for you.", karakter: "Highly loyal, passionate about life, protective, with burning ambition.", caraBertemu: "In competitive places, gyms, or challenging situations.", kekuatanHubungan: "Absolute protection and love intensity that doesn't easily fade.", warnaKeberuntungan: "Red & Black", quote: "With them, you are placed on the highest pedestal of priority." },
  Q: { title: "Unique & Intuitive", desc: "A partner with initial Q is a rare find. They possess out-of-the-box thinking.", karakter: "Highly creative, intuitive, slightly eccentric, full of brilliant ideas.", caraBertemu: "At alternative art festivals, hidden coffee shops, or new places.", kekuatanHubungan: "Anti-mainstream. Always new surprises and perspectives.", warnaKeberuntungan: "Purple & Turquoise", quote: "Learn to break old rules and create your own world together." },
  R: { title: "Romantic & Realistic", desc: "Initial R is the master balancer. Knows when to be poetic and when to be logical.", karakter: "Romantic yet grounded, responsible, loyal hardworking.", caraBertemu: "At casual dining, office celebrations, or set up by colleagues.", kekuatanHubungan: "Perfect balance between love fantasy and daily reality.", warnaKeberuntungan: "Pink & Brown", quote: "With them, the dream of love feels very real and tangible." },
  S: { title: "Sociable & Sensitive", desc: "An initial S partner has high social intelligence alongside a strong inner radar.", karakter: "Very friendly, emotional/sensitive, artistic, easily sympathizes.", caraBertemu: "In relaxed public spaces, acoustic concerts, or during me-time.", kekuatanHubungan: "High-level soul connection. Feeling understood without much explaining.", warnaKeberuntungan: "Silver & Light Blue", quote: "With them, silence is not awkward, it's a love language." },
  T: { title: "Firm & Resilient", desc: "Initial T symbolizes steel. Unbreakable resilience against life's problems.", karakter: "Highly disciplined, mentally strong, tenacious, takes full responsibility.", caraBertemu: "In high-pressure work environments, or while going through a crisis.", kekuatanHubungan: "Team resilience. Able to weather even the worst storms.", warnaKeberuntungan: "Brown & Gray", quote: "With them, every massive problem is just a pebble to skip over." },
  U: { title: "Unconditional Love", desc: "A partner with initial U loves beyond the physical or material. Pure sincerity.", karakter: "Highly forgiving, sincere heart, extremely affectionate, overflowing empathy.", caraBertemu: "At volunteer organizations, places of worship, or at your lowest point.", kekuatanHubungan: "Total acceptance of your past and physical/mental flaws.", warnaKeberuntungan: "White & Gold", quote: "With them, you don't need to pretend to be someone else to be loved." },
  V: { title: "Visionary & Vitality", desc: "Initial V is an energy generator. Radiates high vitality that is contagious.", karakter: "Visionary thinker, tirelessly energetic, innovative, confident.", caraBertemu: "At tech expos, idea competitions, or celebrating major milestones.", kekuatanHubungan: "Accelerated success. Running very fast towards shared dreams.", warnaKeberuntungan: "Purple & Gold", quote: "With them, the future isn't waited for, it's created." },
  W: { title: "Wise & Warm", desc: "A partner with initial W is a safe harbor. A mentor's wisdom and a friend's warmth.", karakter: "Highly wise, warmly embracing, highly patient, rational empathy.", caraBertemu: "In group discussions, self-development communities, or seeking a mentor.", kekuatanHubungan: "Absolute peace and decisions that always prioritize win-win solutions.", warnaKeberuntungan: "Dark Blue & Turquoise", quote: "With them, emotional turbulence subsides, leaving a clear mind." },
  X: { title: "Mystery & Exotic", desc: "Initial X is an anomaly. Rejects social conventions and follows their own path.", karakter: "Ultra-unique, mysterious, eccentric, unpredictable actions.", caraBertemu: "In the middle of nowhere, backpacking trips, or magical coincidences.", kekuatanHubungan: "Stepping out of comfort zones. Life together is an unmapped exploration.", warnaKeberuntungan: "Pitch Black & Silver", quote: "Normalcy is boring. Life is an exotic mystery." },
  Y: { title: "Youthful & Confident", desc: "A partner with initial Y seemingly holds mental anti-aging serum. Always optimistic.", karakter: "Youthful, highly optimistic, full of self-belief, breaking down fears.", caraBertemu: "On nature adventures, extreme rides, or trying a new hobby.", kekuatanHubungan: "A playful spirit that never fades despite physical age.", warnaKeberuntungan: "Bright Yellow & Leaf Green", quote: "With them, the number of age loses its meaning." },
  Z: { title: "Burning Enthusiasm", desc: "Initial Z is the peak of life's passion. Does everything with 100% totality.", karakter: "Highly enthusiastic, tenacious, quick thinker, strong bursts of energy.", caraBertemu: "At the forefront of a movement, grand concerts, or initiating big projects.", kekuatanHubungan: "Nonstop motivation injection. Laziness has no room here.", warnaKeberuntungan: "Bright Orange & Black", quote: "With them, trivial routines feel like epic adventure missions." }
};
// ==========================================
// DATABASE INISIAL: SPANYOL (ES)
// ==========================================
const DB_ES: Record<string, InitialData> = {
  A: { title: "Ambición y Liderazgo", desc: "Una pareja con la inicial A es un líder natural, valiente y lleno de iniciativa. Tienen un aura fuerte y suelen ser el centro de atención.", karakter: "Confiado, ambicioso, creativo y muy independiente. No teme arriesgarse.", caraBertemu: "Es muy probable que se conozcan en eventos formales, competiciones o persiguiendo sueños juntos.", kekuatanHubungan: "Se motivarán mutuamente para alcanzar sus sueños. Es una relación apasionada.", warnaKeberuntungan: "Rojo y Oro", quote: "Con ellos, cada día es una nueva y emocionante aventura." },
  B: { title: "Suave y Leal", desc: "La inicial B simboliza sinceridad, paciencia y amor profundo. Tu pareja es tranquila pero tiene una postura firme.", karakter: "Cariñoso, leal, trabajador y servicial. Un gran oyente.", caraBertemu: "En una biblioteca, librería, evento benéfico o a través de amigos cercanos.", kekuatanHubungan: "Estabilidad y confort. Te sentirás muy valorado y protegido.", warnaKeberuntungan: "Verde y Marrón", quote: "El amor verdadero no grita, susurra pero sigue siendo eterno." },
  C: { title: "Creativo y Alegre", desc: "Una pareja con la inicial C es un alma artística colorida. Llevan risas e inspiración a donde quiera que vayan.", karakter: "Optimista, comunicativo, imaginativo y sociable. Ama las sorpresas.", caraBertemu: "En conciertos, galerías de arte, cafés o viajando. También en redes sociales.", kekuatanHubungan: "Una relación divertida y muy creativa. Nunca monótona.", warnaKeberuntungan: "Amarillo y Naranja", quote: "Con ellos, el mundo se siente más colorido y lleno de risas." },
  D: { title: "Fuerte y Responsable", desc: "La inicial D refleja firmeza y dedicación. Tu pareja es confiable en cualquier situación.", karakter: "Disciplinado, práctico, honesto y muy responsable.", caraBertemu: "En el trabajo, proyectos sociales o cuando necesites ayuda profesional.", kekuatanHubungan: "Una base sólida. Te sientes seguro financiera y emocionalmente.", warnaKeberuntungan: "Azul Marino y Gris", quote: "Con ellos, cualquier tormenta se siente más ligera." },
  E: { title: "Expresivo y Empático", desc: "Una pareja con la inicial E es muy sensible a los sentimientos de los demás. Son grandes oyentes y animadores.", karakter: "Amigable, expresivo, cariñoso y adaptable.", caraBertemu: "En eventos de arte, sesiones de terapia o compartiendo historias en lugares relajantes.", kekuatanHubungan: "Fuerte apoyo emocional. Siempre te sentirás escuchado y validado.", warnaKeberuntungan: "Azul Claro y Blanco", quote: "Su amor es un abrazo invisible que siempre se siente." },
  F: { title: "Leal y Protector", desc: "La inicial F es un símbolo de lealtad y protección. Tu pareja será un escudo para ti y tu familia.", karakter: "Leal, responsable, cauteloso y muy protector.", caraBertemu: "En el vecindario o cuando necesites una mano amiga.", kekuatanHubungan: "Seguridad absoluta. Nunca te sentirás solo al enfrentar problemas.", warnaKeberuntungan: "Marrón y Crema", quote: "Con ellos, un hogar no es solo un edificio, sino una sensación de seguridad." },
  G: { title: "Sabio y Espiritual", desc: "Una pareja con la inicial G tiene profundidad de alma y una visión de la vida calmada y filosófica.", karakter: "Intuitivo, sabio, tranquilo, le encanta reflexionar y tener debates profundos.", caraBertemu: "En un retiro, yoga o mientras buscas el sentido de la vida.", kekuatanHubungan: "Una conexión calmante y significativa. Creciendo juntos espiritualmente.", warnaKeberuntungan: "Púrpura y Plata", quote: "Su amor es una luz en medio de la confusión y el ruido del mundo." },
  H: { title: "Armonioso y Amoroso", desc: "La inicial H trae energía de paz y equilibrio. Tu pareja es el pegamento de la relación.", karakter: "Suave, cariñoso, diplomático y evita conflictos innecesarios.", caraBertemu: "En reuniones familiares, fiestas de amigos o multitudes sociales.", kekuatanHubungan: "Armonía duradera. El compromiso es siempre la salida principal.", warnaKeberuntungan: "Rosa y Lavanda", quote: "Con ellos, el corazón se siente en calma y lleno de gratitud." },
  I: { title: "Idealista y Romántico", desc: "Una pareja con la inicial I es un soñador romántico. Valora la lealtad y el destino.", karakter: "Idealista, creativo, sensible y lleno de imaginación romántica.", caraBertemu: "En lugares hermosos como playas, jardines de flores o destinos naturales.", kekuatanHubungan: "Amor lleno de dulces sorpresas y gestos poéticos. Se siente como un cuento de hadas.", warnaKeberuntungan: "Blanco y Plata", quote: "Con ellos, cada día es una página impresionante de una historia." },
  J: { title: "Ingenioso y Enérgico", desc: "La inicial J promete una pareja humorística llena de energía positiva. Tu fuente diaria de risas.", karakter: "Alegre, espontáneo, sociable e impulsivamente aventurero.", caraBertemu: "En fiestas, festivales o durante viajes de vacaciones espontáneos.", kekuatanHubungan: "Nunca es aburrido. La risa es la base de la relación.", warnaKeberuntungan: "Amarillo y Naranja", quote: "Con ellos, reír libremente es el lenguaje de amor más puro." },
  K: { title: "Carismático y Visionario", desc: "Una pareja con la inicial K tiene un atractivo increíble y una visión estructurada para el futuro.", karakter: "Seguro, visionario, ambicioso y tiene un aura inspiradora.", caraBertemu: "En seminarios, eventos de negocios o en entornos profesionales.", kekuatanHubungan: "Constantemente motivado para convertirte en la mejor versión de ti mismo.", warnaKeberuntungan: "Oro y Negro", quote: "Con ellos, los sueños enormes parecen increíblemente lógicos de alcanzar." },
  L: { title: "Flexible y Afectuoso", desc: "La inicial L simboliza adaptabilidad y amor suave. Fácilmente aceptado en cualquier lugar.", karakter: "De buen corazón, paciente, sociable y le encanta ayudar.", caraBertemu: "En actividades sociales, eventos benéficos o como voluntario.", kekuatanHubungan: "Alta armonía y aceptación incondicional del carácter.", warnaKeberuntungan: "Verde Claro y Blanco", quote: "Su amor fluye como el agua, adaptándose suavemente pero imparable." },
  M: { title: "Misterioso y Magnético", desc: "Una pareja con la inicial M tiene una atracción gravitacional inexplicable. Lleno de secretos cautivadores.", karakter: "Intuitivo, tranquilo, encantador, irradiando un aura elegante y misteriosa.", caraBertemu: "En lugares exclusivos, exposiciones o viajando solo.", kekuatanHubungan: "Atracción inmarcesible. Siempre hay un lado nuevo por descubrir.", warnaKeberuntungan: "Negro y Plata", quote: "Con ellos, cada día es un hermoso rompecabezas por resolver." },
  N: { title: "Navegante de la Vida", desc: "La inicial N trae sabiduría práctica. Tu pareja es un gran guía para tomar decisiones.", karakter: "Analítico, racional, muy paciente y sediento de conocimiento.", caraBertemu: "En una biblioteca, campus, librería o comunidad intelectual.", kekuatanHubungan: "Estabilidad intelectual. Siempre tendrás un compañero de debate a tu nivel.", warnaKeberuntungan: "Azul y Verde", quote: "Con ellos, las encrucijadas de la vida tienen direcciones claras." },
  O: { title: "Optimista y Abierto", desc: "Una pareja con la inicial O siempre ve el lado positivo. Son increíblemente positivos.", karakter: "Muy optimista, de mente abierta, generoso y socialmente extrovertido.", caraBertemu: "En celebraciones, festivales o relajándote el fin de semana.", kekuatanHubungan: "Un hogar constantemente alegre, libre de prejuicios, lleno de esperanza.", warnaKeberuntungan: "Oro y Naranja", quote: "Con ellos, la tormenta de hoy es solo la preparación para el arcoíris de mañana." },
  P: { title: "Protector y Apasionado", desc: "La inicial P encarna protección y pasión. Lucharán por ti.", karakter: "Altamente leal, apasionado por la vida, protector, con una ambición ardiente.", caraBertemu: "En lugares competitivos, gimnasios o situaciones desafiantes.", kekuatanHubungan: "Protección absoluta e intensidad de amor que no se desvanece fácilmente.", warnaKeberuntungan: "Rojo y Negro", quote: "Con ellos, estás ubicado en el pedestal más alto de prioridad." },
  Q: { title: "Único e Intuitivo", desc: "Una pareja con la inicial Q es un hallazgo raro. Poseen un pensamiento fuera de lo común.", karakter: "Altamente creativo, intuitivo, un poco excéntrico, lleno de ideas brillantes.", caraBertemu: "En festivales de arte alternativo, cafeterías ocultas o lugares nuevos.", kekuatanHubungan: "Anticonvencional. Siempre nuevas sorpresas y perspectivas.", warnaKeberuntungan: "Púrpura y Turquesa", quote: "Aprendan a romper las viejas reglas y crear su propio mundo juntos." },
  R: { title: "Romántico y Realista", desc: "La inicial R es el maestro del equilibrio. Sabe cuándo ser poético y cuándo ser lógico.", karakter: "Romántico pero con los pies en la tierra, responsable, leal y trabajador.", caraBertemu: "En cenas informales, celebraciones de oficina o presentados por colegas.", kekuatanHubungan: "Equilibrio perfecto entre la fantasía amorosa y la realidad diaria.", warnaKeberuntungan: "Rosa y Marrón", quote: "Con ellos, el sueño del amor se siente muy real y tangible." },
  S: { title: "Sociable y Sensible", desc: "Una pareja con la inicial S tiene una alta inteligencia social junto con un fuerte radar interior.", karakter: "Muy amigable, emocional/sensible, artístico, empatiza fácilmente.", caraBertemu: "En espacios públicos relajados, conciertos acústicos o durante tiempo a solas.", kekuatanHubungan: "Conexión del alma de alto nivel. Sentirse comprendido sin explicar mucho.", warnaKeberuntungan: "Plata y Azul Claro", quote: "Con ellos, el silencio no es incómodo, es un lenguaje de amor." },
  T: { title: "Firme y Resiliente", desc: "La inicial T simboliza el acero. Resiliencia inquebrantable ante los problemas de la vida.", karakter: "Altamente disciplinado, mentalmente fuerte, tenaz, asume toda la responsabilidad.", caraBertemu: "En entornos de trabajo de alta presión o atravesando una crisis.", kekuatanHubungan: "Resiliencia en equipo. Capaces de capear incluso las peores tormentas.", warnaKeberuntungan: "Marrón y Gris", quote: "Con ellos, cada problema masivo es solo un guijarro para saltar." },
  U: { title: "Amor Incondicional", desc: "Una pareja con la inicial U ama más allá de lo físico o material. Sinceridad pura.", karakter: "Muy perdonador, corazón sincero, extremadamente cariñoso, empatía desbordante.", caraBertemu: "En organizaciones de voluntarios, lugares de culto o en tu punto más bajo.", kekuatanHubungan: "Aceptación total de tu pasado y defectos físicos/mentales.", warnaKeberuntungan: "Blanco y Oro", quote: "Con ellos, no necesitas fingir ser alguien más para ser amado." },
  V: { title: "Visionario y Vitalidad", desc: "La inicial V es un generador de energía. Irradia una alta vitalidad que es contagiosa.", karakter: "Pensador visionario, incansablemente enérgico, innovador, seguro.", caraBertemu: "En exposiciones tecnológicas, concursos de ideas o celebrando grandes hitos.", kekuatanHubungan: "Éxito acelerado. Corriendo muy rápido hacia sueños compartidos.", warnaKeberuntungan: "Púrpura y Oro", quote: "Con ellos, el futuro no se espera, se crea." },
  W: { title: "Sabio y Cálido", desc: "Una pareja con la inicial W es un puerto seguro. Sabiduría de un mentor y calidez de un amigo.", karakter: "Altamente sabio, abraza cálidamente, muy paciente, empatía racional.", caraBertemu: "En discusiones grupales, comunidades de autodesarrollo o buscando un mentor.", kekuatanHubungan: "Paz absoluta y decisiones que siempre priorizan soluciones en las que todos ganan.", warnaKeberuntungan: "Azul Oscuro y Turquesa", quote: "Con ellos, la turbulencia emocional cede, dejando una mente clara." },
  X: { title: "Misterio y Exótico", desc: "La inicial X es una anomalía. Rechaza las convenciones sociales y sigue su propio camino.", karakter: "Ultra-único, misterioso, excéntrico, acciones impredecibles.", caraBertemu: "En medio de la nada, viajes de mochilero o coincidencias mágicas.", kekuatanHubungan: "Salir de las zonas de confort. La vida juntos es una exploración sin mapa.", warnaKeberuntungan: "Negro Azabache y Plata", quote: "La normalidad es aburrida. La vida es un misterio exótico." },
  Y: { title: "Joven y Seguro", desc: "Una pareja con la inicial Y parece tener un suero antienvejecimiento mental. Siempre optimista.", karakter: "Joven, muy optimista, lleno de confianza en sí mismo, derribando miedos.", caraBertemu: "En aventuras en la naturaleza, atracciones extremas o probando un nuevo pasatiempo.", kekuatanHubungan: "Un espíritu lúdico que nunca se desvanece a pesar de la edad física.", warnaKeberuntungan: "Amarillo Brillante y Verde Hoja", quote: "Con ellos, el número de la edad pierde su significado." },
  Z: { title: "Entusiasmo Ardiente", desc: "La inicial Z es la cima de la pasión por la vida. Hace todo con el 100% de totalidad.", karakter: "Altamente entusiasta, tenaz, pensador rápido, fuertes ráfagas de energía.", caraBertemu: "Al frente de un movimiento, grandes conciertos o iniciando grandes proyectos.", kekuatanHubungan: "Inyección de motivación sin parar. La pereza no tiene lugar aquí.", warnaKeberuntungan: "Naranja Brillante y Negro", quote: "Con ellos, las rutinas triviales se sienten como misiones de aventuras épicas." }
};

// ==========================================
// FUNGSI SELECTOR BAHASA & HASH DETERMINISTIK
// ==========================================
function getInitialDB(lang: string) {
  if (lang === "en") return DB_EN;
  if (lang === "es") return DB_ES;
  return DB_ID;
}

// Mengubah string menjadi satu karakter alfabet (A-Z) secara konsisten
function getInitialFromName(name: string): string {
  const clean = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length === 0) return "A";
  
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  
  const index = Math.abs(hash) % 26;
  return String.fromCharCode(65 + index); // 65 adalah ASCII untuk 'A'
}
// ==========================================
// PART 4: KOMPONEN UTAMA & ANTARMUKA UI
// ==========================================
export default function InitialSoulmate({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const ui = UI_DICT[activeLang] || UI_DICT["id"];
  const db = getInitialDB(activeLang);

  const [name, setName] = useState("");
  const [initial, setInitial] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State khusus untuk mode acak
  const [randomMode, setRandomMode] = useState(false);
  const [randomInit, setRandomInit] = useState<string | null>(null);

  const handlePredict = () => {
    if (!name.trim()) return;
    setLoading(true);
    setInitial(null);
    setRandomMode(false);
    
    // Delay simulasi pemrosesan algoritma
    setTimeout(() => {
      const init = getInitialFromName(name);
      setInitial(init);
      setRandomInit(null);
      setLoading(false);
      
      // Easter Egg: Confetti jika inisial prediksi = inisial nama penginput
      if (init === name.trim().toUpperCase()[0]) {
        import("canvas-confetti").then(mod => {
          mod.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }).catch(() => console.warn("Confetti not loaded"));
      }
    }, 1500);
  };

  const handleRandom = () => {
    setLoading(true);
    setRandomMode(true);
    setInitial(null); 
    
    setTimeout(() => {
      const randomAscii = 65 + Math.floor(Math.random() * 26);
      setRandomInit(String.fromCharCode(randomAscii));
      setLoading(false);
    }, 800);
  };

  const shareResults = async () => {
    const activeInit = randomMode ? randomInit : initial;
    if (!activeInit) return;
    
    const data = db[activeInit];
    const prefix = randomMode ? ui.shareRandom : `${ui.sharePrefix} "${name.trim()}":`;
    const text = `✨ ${ui.title} ✨\n\n${prefix}\n${ui.shareText} 【 ${activeInit} 】\n\n${data.title}\n"${data.quote}"\n\nAksaraDiri!`;
    
    if (navigator.share) {
      try { await navigator.share({ title: ui.title, text }); } catch(e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert(ui.copied);
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }
    }
  };

  const tweetResult = () => {
    const activeInit = randomMode ? randomInit : initial;
    if (!activeInit) return;
    const data = db[activeInit];
    const text = `${ui.shareText} 【 ${activeInit} 】 (${data.title})\n\nAksaraDiri!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const displayInit = randomMode ? randomInit : initial;
  const data = displayInit ? db[displayInit] : null;

  return (
    <div className="max-w-2xl mx-auto text-white font-sans px-4 py-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce drop-shadow-lg" style={{ animationDuration: '3s' }}>🔤💕</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent pb-1">
          {ui.title}
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          {ui.subtitle}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="relative z-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ui.inputPh}
            maxLength={50}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold text-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all placeholder-slate-500"
            onKeyDown={(e) => e.key === "Enter" && handlePredict()}
          />
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={handlePredict} 
              disabled={loading || !name.trim()} 
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] tracking-wider uppercase text-sm flex items-center justify-center gap-2"
            >
              {loading && !randomMode ? ui.btnLoading : ui.btnPredict}
            </button>
            <button 
              onClick={handleRandom} 
              disabled={loading}
              className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center disabled:opacity-50 hover:scale-105" 
              title="Random Mode"
            >
              🎲
            </button>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex flex-col justify-center items-center my-16 gap-4">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-400 rounded-full animate-spin shadow-[0_0_20px_rgba(236,72,153,0.3)]"></div>
          <span className="text-pink-400 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
            {randomMode ? ui.loadRandom : ui.loadPredict}
          </span>
        </div>
      )}

      {/* Result Section */}
      {displayInit && data && !loading && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* Label Mode */}
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {randomMode ? ui.lblRandom : ui.lblPredict}
            </span>
          </div>

          <div className="bg-gradient-to-br from-pink-950/40 via-slate-900 to-purple-950/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Kartu Takdir (Initial Display) */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-40 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-pink-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-30 mix-blend-overlay"></div>
                <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-rose-500 drop-shadow-lg relative z-10">
                  {displayInit}
                </span>
              </div>
            </div>

            <div className="text-center mb-8 relative z-10">
              <h3 className="text-2xl font-black text-slate-100">{data.title}</h3>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-lg mx-auto">{data.desc}</p>
            </div>

            {/* Grid Detail Karakteristik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 text-left relative z-10">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                <p className="flex items-center gap-2 text-pink-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>💫</span> {ui.char}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{data.karakter}</p>
              </div>
              
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                <p className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>🌹</span> {ui.meet}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{data.caraBertemu}</p>
              </div>
              
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                <p className="flex items-center gap-2 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>💪</span> {ui.synergy}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{data.kekuatanHubungan}</p>
              </div>
              
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                <p className="flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>🎨</span> {ui.color}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{data.warnaKeberuntungan}</p>
              </div>
            </div>

            {/* Quote Box */}
            <div className="mt-6 p-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border-l-4 border-pink-500 relative z-10">
              <p className="italic text-slate-100 text-sm font-medium">"{data.quote}"</p>
            </div>

            {/* Share Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <button 
                onClick={shareResults} 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all uppercase tracking-wider text-slate-100"
              >
                {ui.shareBtn}
              </button>
              <button 
                onClick={tweetResult} 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 text-[#1DA1F2] text-xs font-bold transition-all uppercase tracking-wider"
              >
                {ui.tweetBtn}
              </button>
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
              resultId={displayInit} 
            />
            {/* SAMPAI SINI */}

          </div>
        </div>
      )}

      {/* Empty State Instructions */}
      {!displayInit && !loading && (
        <div className="text-center text-slate-500 text-xs mt-10 uppercase tracking-widest font-medium">
          {name.trim() ? ui.emptyStart : ui.emptyWait}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}