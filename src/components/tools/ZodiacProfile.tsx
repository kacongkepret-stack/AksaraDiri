"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ==========================================
// 1. KAMUS UI & HARIAN (MULTI-BAHASA)
// ==========================================
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Profil Zodiak", badge: "Ultra Premium", subtitle: "Membongkar kepribadian aslimu sampai ke akar. Asmara, karir, red-flag, kesehatan, hingga inspirasi harian.", shareBtn: "Bagikan",
    labels: { overview: "Overview", love: "Asmara", career: "Karir", secret: "Sisi Gelap", wellness: "Wellness", strengths: "Kekuatan Utama", weaknesses: "Titik Lemah", misunderstood: "Apa Yang Orang Sering Salah Pahami", loveTip: "Percintaan & Komitmen", redFlag: "Red Flag Saat Pacaran", careerTip: "Karir & Keuangan", friendship: "Gaya Pertemanan", hiddenTrait: "Hidden Trait", stressMode: "Mode Stres", spiritual: "Spiritual Vibe", health: "Kesehatan", affirmation: "Afirmasi Positif", famousPeople: "Tokoh Terkenal", luckyColor: "Warna Pembangkit Energi", luckyStone: "Batu Simbolis", compatibility: "Paling Cocok Dengan", dailyEnergy: "Live: Energi Hari Ini", luckyNum: "Angka Hoki", bestHour: "Jam Emas", moodRadar: "Mood Radar", auraCapacity: "Kapasitas Aura", loveAdvice: "Pesan Asmara", careerAdvice: "Nasihat Karir", repeatAffirmation: "Ulangi afirmasi:", quickFacts: "Quick Facts" },
    dailyEnergies: [
      "Hari ini membawa gelombang energi positif yang besar. Saat yang tepat untuk mengeksekusi ide liar di kepalamu.",
      "Kamu mungkin merasa sedikit kewalahan hari ini. Ambil napas panjang, tidak semua hal harus selesai sekarang.",
      "Kabar baik soal finansial atau peluang karir sedang mengintip. Pasang telinga baik-baik pada setiap percakapan siang ini.",
      "Seseorang dari masa lalu mungkin melintas di pikiranmu. Jaga batasan emosionalmu hari ini.",
      "Fokuslah pada perawatan diri (self-care). Tubuhmu menuntut haknya untuk istirahat setelah bekerja keras.",
      "Intuisi (firasat) mu sedang sangat tajam. Jika hatimu tiba-tiba meragukan sesuatu, percayalah dan mundurlah.",
      "Hari yang luar biasa produktif! Momentummu sedang bagus, dorong terus sampai to-do list hari ini bersih."
    ],
    loveAdvice: ["Jangan takut mengungkapkan perasaanmu terlebih dahulu.", "Luangkan waktu berkualitas tanpa gawai.", "Beri kejutan romantis kecil: secangkir kopi atau catatan cinta.", "Pasanganmu mungkin butuh didengarkan, bukan diselesaikan masalahnya."],
    careerAdvice: ["Tunjukkan inisiatif hari ini. Atasan akan memperhatikan usahamu.", "Networking membawakan kejutan. Hubungi kolega lama.", "Fokus pada satu tugas besar, jangan multitasking berlebihan.", "Jangan takut meminta bantuan. Kerja tim lebih mengesankan."],
    moods: ["Sangat Positif ☀️", "Stabil 🍃", "Reflektif 🤔", "Bersemangat 🔥", "Sensitif 💧"]
  },
  en: {
    title: "Zodiac Profile", badge: "Ultra Premium", subtitle: "Uncover your true personality to the core. Romance, career, red-flags, health, and daily inspiration.", shareBtn: "Share",
    labels: { overview: "Overview", love: "Romance", career: "Career", secret: "Dark Side", wellness: "Wellness", strengths: "Core Strengths", weaknesses: "Weaknesses", misunderstood: "Often Misunderstood As", loveTip: "Romance & Commitment", redFlag: "Dating Red Flags", careerTip: "Career & Finance", friendship: "Friendship Style", hiddenTrait: "Hidden Trait", stressMode: "Stress Mode", spiritual: "Spiritual Vibe", health: "Health & Wellness", affirmation: "Positive Affirmation", famousPeople: "Famous People", luckyColor: "Energy Booster Color", luckyStone: "Symbolic Stone", compatibility: "Most Compatible With", dailyEnergy: "Live: Today's Energy", luckyNum: "Lucky Number", bestHour: "Golden Hour", moodRadar: "Mood Radar", auraCapacity: "Aura Capacity", loveAdvice: "Love Message", careerAdvice: "Career Advice", repeatAffirmation: "Repeat affirmation:", quickFacts: "Quick Facts" },
    dailyEnergies: [
      "Today brings a massive wave of positive energy. Great time to execute your wild ideas.",
      "You might feel a bit overwhelmed today. Take a deep breath, things take time.",
      "Good financial or career news is peeking around the corner.",
      "Someone from the past might cross your mind. Keep your emotional boundaries.",
      "Focus on self-care today. Your body demands rest.",
      "Your intuition is extremely sharp today. Trust your gut feeling.",
      "A wonderfully productive day! Keep pushing until your to-do list is clear."
    ],
    loveAdvice: ["Don't be afraid to express your feelings first.", "Spend quality time without gadgets.", "Give a small romantic surprise today.", "Your partner might just need to be heard."],
    careerAdvice: ["Show extra initiative today. Bosses will notice.", "Networking brings surprises. Contact an old colleague.", "Focus on one main task, avoid multitasking.", "Don't be afraid to ask for help."],
    moods: ["Very Positive ☀️", "Stable 🍃", "Reflective 🤔", "Energized 🔥", "Sensitive 💧"]
  },
  es: {
    title: "Perfil Zodiacal", badge: "Ultra Premium", subtitle: "Descubre tu verdadera personalidad. Romance, carrera, banderas rojas, salud e inspiración diaria.", shareBtn: "Compartir",
    labels: { overview: "Resumen", love: "Amor", career: "Carrera", secret: "Lado Oscuro", wellness: "Bienestar", strengths: "Fortalezas", weaknesses: "Debilidades", misunderstood: "Incomprendido Como", loveTip: "Romance y Compromiso", redFlag: "Banderas Rojas", careerTip: "Carrera y Finanzas", friendship: "Estilo de Amistad", hiddenTrait: "Rasgo Oculto", stressMode: "Modo de Estrés", spiritual: "Vibra Espiritual", health: "Salud", affirmation: "Afirmación Positiva", famousPeople: "Famosos", luckyColor: "Color de Energía", luckyStone: "Piedra Simbólica", compatibility: "Compatible Con", dailyEnergy: "Energía de Hoy", luckyNum: "Número de la Suerte", bestHour: "Hora Dorada", moodRadar: "Radar de Humor", auraCapacity: "Capacidad de Aura", loveAdvice: "Mensaje de Amor", careerAdvice: "Consejo de Carrera", repeatAffirmation: "Repite la afirmación:", quickFacts: "Datos Rápidos" },
    dailyEnergies: [
      "Hoy trae una gran ola de energía positiva. Buen momento para ejecutar ideas.",
      "Puedes sentirte un poco abrumado hoy. Respira profundo.",
      "Buenas noticias financieras se acercan.",
      "Alguien del pasado podría cruzarse en tu mente. Mantén tus límites.",
      "Concéntrate en el autocuidado hoy. Tu cuerpo exige descanso.",
      "Tu intuición está muy aguda hoy. Confía en tu instinto.",
      "¡Un día maravillosamente productivo! Sigue así."
    ],
    loveAdvice: ["No temas expresar tus sentimientos primero.", "Pasa tiempo de calidad sin dispositivos.", "Da una pequeña sorpresa romántica hoy.", "Tu pareja podría necesitar ser escuchada."],
    careerAdvice: ["Muestra iniciativa extra hoy.", "El networking trae sorpresas.", "Céntrate en una tarea principal.", "No temas pedir ayuda."],
    moods: ["Muy Positivo ☀️", "Estable 🍃", "Reflexivo 🤔", "Energizado 🔥", "Sensible 💧"]
  }
};

// ==========================================
// 2. DATA ZODIAK ASLI (TIDAK ADA YG DIPOTONG)
// ==========================================
const zodiacDataID: Record<string, any> = {
  Aries: {
    symbol: "♈", name: "Aries", date: "21 Maret – 19 April", element: "Api", planet: "Mars",
    strengths: ["Berani", "Enerjik", "Optimis", "Mandiri", "Percaya diri"],
    weaknesses: ["Impulsif", "Moody", "Agresif", "Tidak sabaran", "Keras kepala"],
    personality: "Aries adalah pionir yang lahir secara alami — selalu menjadi yang pertama dalam segala hal. Dikuasai oleh Mars (planet perang), mereka memiliki energi tak terbatas dan dorongan konstan untuk menaklukkan tantangan. Mereka tidak takut mengambil risiko dan sering kali bertindak sebelum berpikir, yang membuat mereka menjadi pendobrak batasan yang hebat. Keberanian adalah nama tengah mereka; kemunduran hanya membuat mereka lebih bertekad.",
    love: "Dalam asmara, Aries adalah pengejar sejati. Mereka menyukai sensasi 'berburu' dan percintaan yang penuh gairah seperti api yang menyala-nyala. Mereka butuh pasangan yang bisa mengimbangi energi mereka dan tidak mudah tersinggung oleh gaya bicara mereka yang blak-blakan. Kebosanan adalah musuh utama asmara Aries — jika hubungan terasa monoton, mereka akan mencari api di tempat lain.",
    career: "Terlahir sebagai pemimpin (Alpha). Mereka tidak suka diatur dan sangat cocok menjadi pengusaha, atlet, militer, atau manajer tingkat atas. Tantangan terbesarnya adalah konsistensi dalam menyelesaikan apa yang sudah mereka mulai dengan menggebu-gebu. Mereka berkembang pesat di lingkungan kompetitif yang menghargai inisiatif.",
    hiddenTrait: "Di balik cangkang luar mereka yang sangat tangguh, kompetitif, dan 'tidak butuh siapa-siapa', Aries sebenarnya sangat takut diabaikan dan sangat mendambakan validasi serta kasih sayang yang tulus. Rasa percaya diri mereka yang meledak-ledak seringkali adalah topeng untuk menyembunyikan keraguan batin.",
    stressMode: "Saat sangat tertekan, Aries akan menjadi sumbu pendek — mudah marah dan frustrasi. Mereka melampiaskannya lewat aktivitas fisik ekstrem (olahraga berlebihan, lari maraton dadakan) atau memicu argumen hanya untuk melepaskan tekanan batin.",
    friendship: "Teman yang sangat protektif dan royal. Jika kamu bermasalah, Aries adalah orang pertama yang akan maju membelamu, meski kadang mereka bersaing dengan temannya sendiri. Mereka adalah sahabat yang akan mengajakmu mengambil risiko besar dan tertawa bersama di ujung tebing.",
    redFlag: "Cepat meledak marah dan sering bertindak sangat egois atau impulsif tanpa mempertimbangkan dampak emosional pada pasangannya. Sulit mengakui kesalahan karena ego yang besar.",
    misunderstood: "Sering dianggap arogan dan pemarah, padahal mereka hanya sangat jujur, mandiri, dan tidak suka basa-basi yang membuang waktu. Mereka tidak bermaksud menyakiti — mereka hanya tidak punya filter.",
    spiritual: "Aries menemukan pencerahan spiritual melalui penaklukan ketakutan diri dan tindakan berani yang melampaui batas fisik. Meditasi aktif (seperti berjalan di alam liar atau olahraga ekstrem) lebih cocok bagi mereka daripada duduk diam.",
    compatibility: ["Leo", "Sagitarius", "Gemini", "Aquarius"],
    luckyColor: "Merah Menyala", luckyStone: "Berlian",
    healthAdvice: "Aries cenderung mengalami sakit kepala dan ketegangan otot akibat stres. Rutinlah melakukan peregangan atau yoga dinamis. Hindari olahraga berlebihan — dengarkan sinyal lelah tubuhmu.",
    affirmation: "Aku adalah pelopor. Aku berani memulai, dan setiap langkahku membawa perubahan positif.",
    famousPeople: "Leonardo da Vinci, Lady Gaga, Robert Downey Jr., Emma Watson",
  },
  Taurus: {
    symbol: "♉", name: "Taurus", date: "20 April – 20 Mei", element: "Tanah", planet: "Venus",
    strengths: ["Setia", "Praktis", "Sabar", "Pekerja keras", "Sangat Stabil"],
    weaknesses: ["Keras kepala", "Posesif", "Materialistis", "Sulit kompromi", "Lambat bergerak"],
    personality: "Taurus adalah simbol stabilitas absolut — seperti gunung yang tidak tergoyahkan oleh badai. Dikuasai oleh Venus, mereka sangat menghargai kenyamanan, kemewahan, dan keindahan duniawi. Mereka bukan pemalas, melainkan pengukur energi yang cermat. Mereka tahu persis kapan harus bekerja memeras keringat dan kapan harus menikmati hasilnya di sofa yang empuk. Kesetiaan mereka adalah perisai baja.",
    love: "Mereka sangat sensual dan mencari keamanan komitmen jangka panjang. Taurus tidak suka drama, games, o tarik-ulur. Sekali mereka jatuh cinta, mereka akan sangat setia, namun sifat territorial mereka bisa berubah menjadi kecemburuan y sikap posesif berlebih. Bahasa cinta mereka: sentuhan fisik y hadiah bermakna.",
    career: "Sangat unggul dalam mengelola aset y proyek maraton. Cocok di bidang perbankan, real estate, seni, kuliner, o arsitektur. Mereka adalah tiang penyangga yang menjaga perusahaan tidak runtuh di masa krisis. Kenaikan karier mereka lambat tapi pasti — y ketika sampai di puncak, mereka sulit digeser.",
    hiddenTrait: "Meski terlihat sangat sabar seperti danau yang tenang, amarah Taurus yang dipendam bertahun-tahun bisa meledak sangat dahsyat bagaikan banteng mengamuk. Pemaafan mereka nyaris mustahil didapat kembali. Sekali kepercayaan hancur, pintu hatinya tertutup rapat.",
    stressMode: "Saat stres, Taurus akan mengisolasi diri, makan berlebihan (stress-eating), o memborong barang mewah untuk mengembalikan sensasi kenyamanan yang hilang. Mereka juga bisa menjadi sangat keras kepala y menolak masukan apapun.",
    friendship: "Teman yang paling bisa diandalkan. Mereka mungkin bukan pusat pesta, tapi merekalah yang akan meminjamkanmu uang o tempat tinggal saat kamu jatuh. Setia sampai mati, tapi jangan pernah mengkhianati mereka.",
    redFlag: "Sangat menolak perubahan (stubborn) y sering memaksa pasangannya hidup dalam rutinitas yang monoton bersamanya. Materialistis hingga rela mengorbankan kebahagiaan demi keamanan finansial.",
    misunderstood: "Sering dituduh materialistis y rakus, padahal mereka hanya mencari keamanan dari ketidakpastian dunia yang menakutkan. Mereka menghargai benda bukan karena keserakahan, tapi karena benda membawa kenangan y stabilitas.",
    spiritual: "Terhubung secara mendalam con alam. Mereka menyerap energi spiritual melalui sentuhan pada tanah, berkebun, o menikmati kesunyian hutan. Ritual sederhana seperti berjalan tanpa alas kaki di rerumputan bisa menjadi meditasi bagi mereka.",
    compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    luckyColor: "Hijau Zamrud", luckyStone: "Emerald",
    healthAdvice: "Rawan masalah tenggorokan, leher, y kelenjar tiroid. Jaga pola makan — hindari makan berlebihan saat stres. Olahraga rutin seperti jalan cepat o bersepeda sangat baik.",
    affirmation: "Aku kokoh y tenang. Aku menarik kelimpahan con kerja keras y rasa syukur.",
    famousPeople: "William Shakespeare, Adele, Dwayne 'The Rock' Johnson, David Beckham",
  },
  Gemini: {
    symbol: "♊", name: "Gemini", date: "21 Mei – 20 Juni", element: "Udara", planet: "Merkurius",
    strengths: ["Sangat Cerdas", "Adaptif", "Komunikatif", "Kritis", "Multitasking"],
    weaknesses: ["Plin-plan", "Gelisah", "Bermuka dua (Dualisme)", "Inkonsisten", "Mudah bosan"],
    personality: "Diwakili oleh si Kembar, Gemini memiliki otak yang bekerja layaknya browser con 50 tab terbuka sekaligus. Mereka sangat fleksibel, cerdas secara verbal, y benci kebosanan. Menyerap informasi baru adalah makanan sehari-hari mereka. Mereka mampu melihat dua sisi koin dalam sekejap, itulah mengapa mereka sering terlihat 'plin-plan' — padahal mereka hanya terlalu pintar untuk berpikir hitam-putih.",
    love: "Bagi Gemini, otak adalah organ paling seksi. Jika kamu tidak bisa menstimulasi pikiran mereka lewat debat jenaka o obrolan mendalam, mereka akan hilang minat. Mereka butuh partner yang juga bisa menjadi sahabat diskusi. Komitmen jangka panjang terasa menakutkan bagi mereka karena takut kehilangan kebebasan intelektual.",
    career: "Ahli komunikasi sejati. Sangat cocok di bidang jurnalisme, public relations, negosiator, penulis, o marketing. Kemampuan mereka beradaptasi di lingkungan baru tidak ada duanya. Namun mereka bisa kesulitan di pekerjaan yang sangat repetitif tanpa variasi.",
    hiddenTrait: "Di balik keceriaan, selera humor tinggi, y circle pertemanan yang sangat luas, Gemini sering tersiksa oleh kecemasan mental (anxiety) y overthinking parah di saat sendirian. Pikiran mereka yang terlalu cepat sering menjadi monster bagi diri mereka sendiri.",
    stressMode: "Menjadi hiperaktif, bicara sangat cepat, o malah terjebak dalam kelumpuhan analisis di mana mereka meragukan semua keputusan hidupnya. Mereka bisa beralih topik con sangat cepat sebagai mekanisme lari dari stres.",
    friendship: "Teman yang paling seru diajak ngobrol y berpetualang. Namun, jangan terlalu mengandalkan mereka untuk hal-hal yang butuh komitmen waktu yang ketat. Mereka hadir saat kamu butuh tawa segar y perspektif baru.",
    redFlag: "Cenderung memanipulasi kebenaran con kata-kata (gaslighting) o lari dari masalah saat dihadapkan pada emosi yang terlalu berat. Inkonsistensi janji adalah hal biasa.",
    misunderstood: "Sering dicap 'bermuka dua' o palsu, padahal pikiran y perasaan mereka memang terus berevolusi setiap jam, membuat mereka seolah menjadi orang yang berbeda. Mereka tidak berpura-pura, mereka benar-benar berubah pikiran.",
    spiritual: "Pencarian spiritual Gemini dilakukan melalui perdebatan filosofis, membaca buku, y menyerap sebanyak mungkin perspektif berbeda tentang alam semesta. Mereka menemukan kedamaian ketika pikirannya sibuk con ide-ide besar.",
    compatibility: ["Libra", "Aquarius", "Aries", "Leo"],
    luckyColor: "Kuning Cerah", luckyStone: "Agate",
    healthAdvice: "Sistem saraf y paru-paru perlu perhatian. Latihan pernapasan y meditasi untuk menenangkan pikiran yang terlalu aktif. Kurangi kafein jika mudah cemas.",
    affirmation: "Aku adalah aliran ide yang tak terbatas. Aku memilih fokus y ketenangan di tengah hiruk-pikuk.",
    famousPeople: "Marilyn Monroe, Johnny Depp, Angelina Jolie, Kanye West",
  },
  Cancer: {
    symbol: "♋", name: "Cancer", date: "21 Juni – 22 Juli", element: "Air", planet: "Bulan",
    strengths: ["Sangat Intuitif", "Setia", "Protektif", "Penuh Empati", "Penyayang"],
    weaknesses: ["Sensitif", "Moody", "Manipulatif", "Sulit move on", "Pendendam pasif"],
    personality: "Cancer ibarat kepiting; memiliki cangkang luar yang keras untuk melindungi bagian dalam yang luar biasa lembut y rapuh. Emosi mereka diatur oleh fase Bulan, membuat mereka bisa sangat moody. Prioritas utama mereka adalah 'rumah' (keluarga y kedamaian hati). Mereka perasa, nostalgia, y memiliki ingatan yang luar biasa kuat — baik untuk kenangan indah maupun luka lama.",
    love: "Mencintai Cancer berarti harus siap diayomi sepenuhnya. Mereka sangat romantis, melayani, y protektif. Namun, mereka butuh jaminan keamanan terus-menerus y sangat mudah terluka oleh nada bicara yang sedikit saja salah. Mereka akan melakukan apa pun untuk orang yang dicintai, namun juga bisa menarik diri secara emosional sebagai hukuman.",
    career: "Intuisi tinggi membuat mereka unggul membaca niat orang. Cocok di bidang psikologi, kesehatan, perawatan (caregiver), kuliner, o mengelola bisnis keluarga. Mereka loyal pada atasan yang menghargai mereka, y akan menjadi karyawan yang sangat berdedikasi.",
    hiddenTrait: "Cancer sering memanipulasi situasi secara emosional (guilt-tripping) tanpa sadar ketika merasa terancam, memastikan agar orang yang mereka sayang merasa bersalah jika meninggalkan mereka. Mereka juga bisa sangat posesif terhadap orang y benda yang mereka anggap 'milik'.",
    stressMode: "Menarik diri masuk ke dalam 'cangkang', menangis sendirian, y membangun tembok tinggi di mana tidak ada seorang pun yang boleh mendekat. Mereka bisa menjadi sangat sensitif y mudah tersinggung.",
    friendship: "Teman yang akan mendengarkan curhatanmu sampai jam 3 pagi y membawakanmu sup saat sakit. Sahabat seumur hidup yang tak tergantikan. Namun mereka juga bisa manja y mengharapkan perhatian konstan.",
    redFlag: "Suka mengungkit-ungkit kesalahan masa lalu secara pasif-agresif y mengharapkan pasangannya bisa membaca pikirannya tanpa diberi tahu. Mood swing yang drastis bisa melelahkan.",
    misunderstood: "Dikira cengeng y lemah, padahal untuk memproses y bertahan dari badai emosi sedalam itu dibutuhkan kekuatan mental yang luar biasa besar. Mereka adalah pejuang emosi yang tak terlihat.",
    spiritual: "Mereka sangat terhubung secara batin con leluhur, memori masa lalu, y menemukan kedamaian saat berada di dekat elemen air (laut, danau, sungai). Air adalah tempat mereka melepas y mengisi ulang.",
    compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    luckyColor: "Putih Mutiara & Perak", luckyStone: "Moonstone",
    healthAdvice: "Pencernaan sensitif karena emosi yang cepat berubah. Makanlah con teratur y hindari makanan berminyak saat stres. Tidur yang cukup sangat penting.",
    affirmation: "Hatiku adalah rumah yang aman. Aku memberi y menerima cinta con batasan yang sehat.",
    famousPeople: "Nelson Mandela, Princess Diana, Tom Hanks, Selena Gomez",
  },
  Leo: {
    symbol: "♌", name: "Leo", date: "23 Juli – 22 Agustus", element: "Api", planet: "Matahari",
    strengths: ["Karismatik", "Murah hati", "Pemimpin", "Kreatif", "Setia Kawan"],
    weaknesses: ["Sombong", "Dramatis", "Haus pujian", "Dominan", "Sulit menerima kritik"],
    personality: "Leo terlahir sebagai pusat tata surya. Mereka hangat, teaterikal, y memiliki aura 'bintang' yang tak terbantahkan. Ego mereka besar, namun kemurahan hati mereka terhadap 'rakyat' (orang-orang yang mereka cintai) jauh lebih besar. Mereka adalah raja o ratu yang murah senyum, tetapi jangan pernah berani menghina mereka di depan umum — dendam mereka akan terasa dingin.",
    love: "Cinta bagi Leo adalah pertunjukan megah. Mereka memanjakan pasangannya bak bangsawan. Sebagai gantinya, mereka menuntut pemujaan mutlak, kesetiaan absolut, y harus selalu menjadi prioritas nomor satu. Jika mereka merasa diabaikan, drama akan muncul. Namun pasangan yang setia akan dimanjakan con pujian y kemewahan.",
    career: "Aktor, CEO, politisi, o pembicara publik. Leo harus berada di bawah sorotan lampu. Mereka tidak suka diatur-atur oleh bawahan y memimpin con karisma, bukan diktator. Mereka brilian dalam peran yang membutuhkan kepercayaan diri y kemampuan menghibur orang banyak.",
    hiddenTrait: "Kesombongan Leo sebenarnya adalah perisai pelindung. Mereka sangat bergantung pada validasi eksternal y bisa merasa hancur, depresi, o insecure parah jika diabaikan. Di balik singa yang mengaum, ada anak kecil yang haus pujian.",
    stressMode: "Menjadi sangat dramatis, menuntut, meledak-ledak, y membesar-besarkan masalah (playing victim) untuk mendapatkan kembali perhatian yang hilang. Mereka bisa mengisolasi diri con marah.",
    friendship: "Teman yang akan mentraktirmu di restoran mahal y selalu membela kehormatanmu di depan umum. Tapi bersiaplah karena mereka akan selalu mendominasi percakapan. Mereka setia tetapi juga mengharapkan loyalitas yang sama.",
    redFlag: "Ego yang terlalu tinggi sering membuat mereka meremehkan perasaan pasangan y enggan meminta maaf meskipun terbukti salah. Haus pujian hingga rela mengorbankan integritas.",
    misunderstood: "Sering dianggap gila hormat, padahal kebanggaan terbesar mereka adalah bisa membagikan cahaya y mengangkat derajat orang-orang di sekitar mereka. Mereka murah hati bukan karena ingin dipuja, tapi karena secara alami mereka royal.",
    spiritual: "Menemukan energi penciptaan batiniah melalui seni, ekspresi diri yang jujur, y kebahagiaan batin (inner child). Meditasi con visualisasi warna emas y matahari sangat kuat bagi Leo.",
    compatibility: ["Aries", "Sagitarius", "Gemini", "Libra"],
    luckyColor: "Emas & Oranye", luckyStone: "Ruby",
    healthAdvice: "Jaga kesehatan jantung y punggung. Olahraga kardio baik, tapi hindari overtraining karena ambisi. Perlu waktu istirahat yang cukup agar tidak burnout.",
    affirmation: "Aku bersinar terang tanpa membakar orang lain. Aku berharga, y aku membagikan cahayaku con rendah hati.",
    famousPeople: "Barack Obama, Jennifer Lopez, Madonna, Chris Hemsworth",
  },
  Virgo: {
    symbol: "♍", name: "Virgo", date: "23 Agustus – 22 September", element: "Tanah", planet: "Merkurius",
    strengths: ["Teliti", "Analitis", "Pekerja keras", "Praktis", "Suka Menolong"],
    weaknesses: ["Perfeksionis", "Sangat kritis", "Overthinking", "Gampang cemas", "Sulit puas"],
    personality: "Virgo adalah sang penyempurna. Pikiran mereka ibarat komputer super yang tak henti memproses data, mencari bug, y memperbaikinya. Mereka sangat mengutamakan efisiensi, kebersihan, y logika di atas emosi. Tidak ada detail yang terlewat — kadang sampai obsesif. Mereka adalah penolong sejati, namun sering lupa menolong diri sendiri.",
    love: "Bahasa cinta mereka adalah tindakan pelayanan (Acts of Service). Mereka mungkin tidak pandai merayu, tapi merekalah yang akan memastikan pajakmu dibayar, obatmu diminum, y hidupmu tertata con sangat rapi. Mereka butuh pasangan yang menghargai usaha kecil mereka y tidak terlalu emosional.",
    career: "Tulang punggung perusahaan. Sangat unggul sebagai auditor, data analyst, dokter, editor, o asisten eksekutif. Mereka membenci kemalasan y ketidakteraturan. Setiap pekerjaan akan dilakukan con standar tinggi, sering kali di luar jam kerja.",
    hiddenTrait: "Kritikan pedas Virgo kepada orang lain sebenarnya tidak ada apa-apanya dibandingkan siksaan mental y kritikan kejam yang mereka lemparkan kepada diri mereka sendiri. Rasa tidak pernah cukup terhadap diri sendiri adalah beban terbesar mereka.",
    stressMode: "Melakukan micro-managing, menjadi sangat cerewet soal hal-hal sepele, y membersihkan rumah/kamar secara obsesif untuk mengembalikan ilusi kendali. Bisa juga menjadi hipokondriak.",
    friendship: "Penasihat paling logis yang akan memberikanmu solusi nyata, bukan sekadar pelukan. Mereka selalu ada untuk membereskan kekacauan yang kamu buat. Namun, jangan harap mereka bisa diajak spontan tanpa rencana.",
    redFlag: "Sering mencoba membetulkan o 'mereparasi' pasangannya, membuat pasangan merasa seperti proyek perbaikan alih-alih manusia yang dicintai. Kritis berlebihan hingga melukai perasaan.",
    misunderstood: "Sering dicap dingin, judgemental, y kaku, padahal semua kritikan itu lahir dari kepedulian yang sangat dalam agar orang tersebut menjadi versi terbaiknya. Mereka tidak bisa diam saat melihat potensi yang terbuang.",
    spiritual: "Menemukan keseimbangan spiritual melalui rutinitas (mindfulness), diet yang bersih, y pengabdian (pelayanan) tanpa pamrih kepada sesama. Membantu orang lain adalah doa mereka.",
    compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    luckyColor: "Biru Dongker & Cokelat Tanah", luckyStone: "Sapphire",
    healthAdvice: "Sistem pencernaan y usus sangat sensitif terhadap stres. Hindari perfeksionisme dalam pola makan. Olahraga ringan seperti yoga o jalan kaki untuk meredakan kecemasan.",
    affirmation: "Aku cukup. Aku melepaskan perfeksionisme y merayakan proses. Kesalahan adalah guru, bukan kegagalan.",
    famousPeople: "Beyoncé, Mother Teresa, Keanu Reeves, Zendaya",
  },
  Libra: {
    symbol: "♎", name: "Libra", date: "23 September – 22 Oktober", element: "Udara", planet: "Venus",
    strengths: ["Adil", "Sosial", "Estetis", "Diplomatis", "Penuh Pesona"],
    weaknesses: ["Bimbang ekstrim", "People-pleaser", "Menghindari konflik", "Pasif-agresif", "Takut konfrontasi"],
    personality: "Libra terobsesi con harmoni, keindahan, y keadilan. Dikuasai Venus, mereka diberkahi pesona alami, selera fashion berkelas, y kepandaian mencairkan suasana canggung di ruangan mana pun. Mereka membenci ketidakadilan y akan mati-matian menyeimbangkan timbangan, namun ironisnya mereka sering tidak bisa memutuskan apa yang ingin mereka makan untuk makan malam.",
    love: "Libra benci kesendirian. Mereka berkembang paling pesat saat bermitra. Sangat romantis y ahli merayu (flirting). Tantangannya: mereka sering bertahan dalam hubungan toxic hanya karena terlalu takut putus y melukai perasaan orang. Mereka butuh pasangan yang tegas tapi juga artistik.",
    career: "Negosiator y diplomat ulung. Sangat cocok di bidang hukum, desain interior, wedding planner, kecantikan, o penengah konflik. Mereka adalah jembatan pendamai. Bekerja dalam tim yang harmonis adalah kunci kebahagiaan mereka.",
    hiddenTrait: "Demi menjaga perdamaian palsu, Libra sering menelan kekesalan mereka yang ujung-ujungnya menumpuk y meledak menjadi sikap pasif-agresif yang sangat manipulatif. Mereka juga bisa sangat manipulatif dalam hal menjaga citra diri.",
    stressMode: "Menjadi lumpuh dalam mengambil keputusan (analysis paralysis), belanja impulsif untuk hal-hal cantik, o mengurung diri karena terlalu lelah menyenangkan orang. Mereka juga bisa menghindari orang yang dianggap mengganggu ketenangan.",
    friendship: "Teman sosialita yang paling tahu tempat nongkrong asyik y ahli memberikan advice berimbang dari dua sudut pandang. Mereka membuat semua orang merasa didengar, namun jarang mengungkapkan perasaan mereka yang sebenarnya.",
    redFlag: "Sering tidak berani memihak pada kebenaran jika itu berarti mereka harus dimusuhi oleh pihak lain, membuat pasangannya merasa tak dibela. Sifat people-pleaser bisa berujung pada pengkhianatan kecil.",
    misunderstood: "Sering dianggap suka tebar pesona y tidak setia, padahal mereka hanya bersikap ramah pada semua orang karena ingin disukai. Mereka tidak suka konflik, jadi ellos memilih para bersikap baik kepada semua orang — termasuk mantan.",
    spiritual: "Spiritualitas Libra ditemukan melalui keindahan seni, musik klasik, y keseimbangan mutlak antara aksi (Yin) y reaksi (Yang) dalam karma. Mereka menemukan kedamaian saat lingkungan sekitarnya estetis y damai.",
    compatibility: ["Gemini", "Aquarius", "Leo", "Sagitarius"],
    luckyColor: "Baby Pink & Biru Muda", luckyStone: "Opal",
    healthAdvice: "Masalah ginjal y keseimbangan cairan. Perbanyak minum air putih. Olahraga yang melibatkan pasangan (seperti dansa o tennis) sangat baik para motivasi.",
    affirmation: "Aku memilih harmoni tanpa mengorbankan suaraku. Aku berani memutuskan y bertanggung jawab.",
    famousPeople: "Mahatma Gandhi, Kim Kardashian, Will Smith, Serena Williams",
  },
  Scorpio: {
    symbol: "♏", name: "Scorpio", date: "23 Oktober – 21 November", element: "Air", planet: "Pluto & Mars",
    strengths: ["Bertekad baja", "Berani", "Sangat Setia", "Intuitif", "Penuh Gairah"],
    weaknesses: ["Cemburu buta", "Obsesif", "Pendendam", "Suka rahasia", "Sulit percaya"],
    personality: "Scorpio adalah wujud dari intensitas. Mereka memandang dunia menembus permukaan, ibarat radar yang bisa mencium kebohongan dari jarak satu kilometer. Sekali mereka mengunci target, tidak ada yang bisa menghentikannya. Mereka misterius, magnetis, y memiliki kedalaman emosi yang tidak bisa dijangkau oleh kebanyakan orang. Transformasi adalah jalan hidup mereka.",
    love: "Cinta Scorpio bersifat 'Semuanya o Tidak Sama Sekali' (All or Nothing). Keintiman emosional yang ekstrem sangat krusial. Begitu percaya, kesetiaan mereka tak tertandingi. Tapi jika dikhianati, mereka tak segan menghancurkan sang pengkhianat. Mereka ingin tahu semua rahasia pasangan.",
    career: "Detektif, psikolog, bedah medis, periset, o posisi ahli strategi di balik layar. Mereka berkembang pesat di situasi krisis que menakutkan bagi orang lain. Kekuatan observasi membuat mereka sukses di bidang investigasi.",
    hiddenTrait: "Di balik tatapan tajam y aura mematikan itu, hati Scorpio sangatlah rapuh. Sengatan racunnya hanyalah tembok pertahanan agar tidak lagi terluka oleh pengkhianatan masa lalu. Mereka sangat takut ditolak.",
    stressMode: "Menjadi sangat paranoid, terobsesi mengontrol segala hal (control freak), y menyusun rencana balas dendam secara diam-diam di kepala mereka. Mereka bisa menjadi sangat sunyi y misterius.",
    friendship: "Teman yang akan membawakan rahasiamu sampai ke liang lahat. Mereka tidak butuh banyak kenalan, cukup 1 o 2 sahabat que berani mati demi mereka. Jangan pernah mengkhianati kepercayaan Scorpio.",
    redFlag: "Kecemburuan que posesif y kecenderungan para memanipulasi pasangan lewat tes-tes psikologis rahasia para membuktikan kesetiaan. Sulit memaafkan y melupakan kesalahan.",
    misunderstood: "Sering diasosiasikan con kejahatan o aura gelap, padahal mereka adalah simbol transformasi—kemampuan para mati, bangkit kembali dari abu, y memulihkan diri. Ellos tidak jahat, ellos hanya tidak takut pada sisi gelap kehidupan.",
    spiritual: "Terhubung kuat con alam bawah sadar, misteri kematian, proses regenerasi kehidupan, y kekuatan okultisme. Meditasi mendalam y terapi trauma adalah jalur spiritual mereka.",
    compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    luckyColor: "Merah Darah & Hitam", luckyStone: "Topaz",
    healthAdvice: "Area reproduksi y organ panggul sensitif. Kelola stres con seks yang sehat o olahraga intens. Hindari alkohol y obat-obatan karena bisa memicu sisi obsesif.",
    affirmation: "Aku melepaskan apa yang tidak lagi melayaniku. Aku terlahir kembali setiap hari dalam kekuatan y kelembutan.",
    famousPeople: "Marie Curie, Bill Gates, Katy Perry, Leonardo DiCaprio",
  },
  Sagitarius: {
    symbol: "♐", name: "Sagitarius", date: "22 November – 21 Desember", element: "Api", planet: "Jupiter",
    strengths: ["Petualang", "Optimis tinggi", "Jujur tanpa filter", "Filosofis", "Murah hati"],
    weaknesses: ["Takut komitmen", "Ceroboh", "Terlalu blak-blakan", "Cepat bosan", "Tidak peka"],
    personality: "Sagitarius adalah pengembara zodiak. Dikuasai planet ekspansi (Jupiter), mereka selalu optimis memandang hari esok. Kebebasan adalah harga mati bagi mereka. Aturan, rutinitas, y batasan adalah musuh terbesar Sagitarius. Mereka mencari makna hidup melalui perjalanan fisik y intelektual.",
    love: "Mereka mencari partner-in-crime para menjelajah dunia, bukan sipir penjara. Ellos seru y menggebu di awal, namun akan melarikan diri sekencang-kencangnya jika mulai merasa dikekang o dituntut komitmen berat. Cinta sejati bagi ellos adalah kebebasan.",
    career: "Pekerjaan meja jam 9-5 adalah neraka. Mereka bersinar sebagai pemandu wisata, akademisi, pengusaha travel, jurnalis internasional, o motivator. Mereka butuh dinamika y ruang gerak tanpa batas.",
    hiddenTrait: "Kejujuran mereka yang sering kali kejam secara tak sadar digunakan sebagai tameng para menjauhkan orang agar tidak terlalu terikat secara emosional. Mereka sebenarnya takut akan keintiman.",
    stressMode: "Melarikan diri secara fisik (packing koper y kabur dari kota) o melontarkan lelucon y sarkasme pedas para menghindari kenyataan pahit. Mereka bisa menjadi sangat gelisah y impulsif.",
    friendship: "Teman hangout paling gila que akan mengajakmu melakukan hal-hal nekat di jam 2 pagi. Selalu bisa diandalkan para membangkitkan suasana hati que murung. Namun ellos bisa menghilang berbulan-bulan.",
    redFlag: "Sering menjanjikan dunia namun gagal mengeksekusinya. Berpotensi menelantarkan perasaan pasangannya demi ambisi pribadi o 'petualangan baru'. Takut komitmen parah.",
    misunderstood: "Dikira tidak punya perasaan o dangkal, padahal di dalam kepalanya, ellos terus-menerus memikirkan makna hidup, agama, y filsafat eksistensi manusia. Ellos sangat filosofis.",
    spiritual: "Spiritualitas bagi Sagitarius adalah perjalanan fisik y intelektual (ziarah) ke tempat-tempat asing para menemukan kebenaran universal lintas budaya.",
    compatibility: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyColor: "Ungu & Indigo", luckyStone: "Turquoise",
    healthAdvice: "Pinggul y paha rentan cedera karena terlalu aktif. Jaga sendi con pemanasan que cukup. Hati-hati con kecenderungan makan berlebihan saat sosial.",
    affirmation: "Aku bebas menjelajah, y aku kembali con bijaksana. Aku terbuka pada petualangan y komitmen que berarti.",
    famousPeople: "Walt Disney, Taylor Swift, Brad Pitt, Miley Cyrus",
  },
  Capricorn: {
    symbol: "♑", name: "Capricorn", date: "22 Desember – 19 Januari", element: "Tanah", planet: "Saturnus",
    strengths: ["Disiplin Mutlak", "Bertanggung jawab", "Ambisius", "Praktis", "Ketahanan Tinggi"],
    weaknesses: ["Kaku", "Pesimis", "Workaholic", "Dingin", "Terlalu perhitungan"],
    personality: "Capricorn ibarat Kambing Gunung que perlahan tapi pasti mendaki tebing paling curam para mencapai puncak kekuasaan. Ellos memandang hidup sebagai proyek raksasa que harus diselesaikan. Waktu y reputasi sangat berharga bagi ellos. Ellos pragmatis, disiplin, y tidak kenal lelah.",
    love: "Ellos bukan tipe romantis picisan. Capricorn menunjukkan cinta con cara memastikan finansial pasangan aman, tagihan terbayar, y berdiri sebagai pelindung que tak tergoyahkan. Cinta adalah investasi jangka panjang.",
    career: "CEO alami, direktur keuangan, arsitek, o hakim. Ellos tidak butuh pujian semu, ellos butuh hasil nyata. Ketahanan ellos menanggung stres kerja adalah yang tertinggi.",
    hiddenTrait: "Meski terlihat sukses y tangguh, Capricorn sering merasa sangat kesepian y merasa 'harus memikul beban dunia sendirian' karena gengsi para meminta bantuan.",
    stressMode: "Mengubur diri semakin dalam ke tumpukan pekerjaan (workaholism ekstrem), menjadi sangat pesimis, y bersikap kejam pada orang que bekerja lambat. Ellos bisa menjadi sangat dingin.",
    friendship: "Teman yang akan menamparmu con realita agar kamu bangkit dari kemalasan. Ellos tidak pandai menghibur, tapi ellos tahu cara menyusun strategi agar kamu sukses.",
    redFlag: "Membiarkan ambisi y pekerjaan merenggut seluruh waktu ellos, sehingga pasangannya merasa seperti nomor dua. Kaku dalam ekspresi kasih sayang.",
    misunderstood: "Sering dicap sebagai bos que kejam y tak berperasaan, padahal ketegasan itu muncul karena ellos merasa bertanggung jawab penuh atas kelangsungan hidup semua orang di bawah ellos.",
    spiritual: "Bagi Capricorn, kerja keras, dedikasi, y mematuhi aturan etika moral adalah bentuk ibadah (spiritual) yang tertinggi.",
    compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    luckyColor: "Hitam & Cokelat Tua", luckyStone: "Garnet",
    healthAdvice: "Masalah tulang, sendi, y lutut. Perhatikan postur tubuh. Olahraga rutin seperti berenang o pilates sangat baik.",
    affirmation: "Aku mendaki gunungku con sabar. Setiap langkah kecil adalah kemenangan. Aku layak mencapai puncak.",
    famousPeople: "Michelle Obama, Elvis Presley, Denzel Washington, Zayn Malik",
  },
  Aquarius: {
    symbol: "♒", name: "Aquarius", date: "20 Januari – 18 Februari", element: "Udara", planet: "Uranus",
    strengths: ["Inovatif (Genius)", "Independen", "Humanis", "Objektif", "Pikiran maju"],
    weaknesses: ["Eksentrik", "Sangat Dingin", "Keras kepala ekstrim", "Pemberontak", "Tidak terduga"],
    personality: "Aquarius hidup di masa depan. Ellos adalah kaum intelektual pemberontak que datang para menghancurkan aturan kuno. Sangat peduli pada isu sosial skala besar, namun ironisnya sering merasa canggung dalam kedekatan antar-individu.",
    love: "Sahabat adalah dasar dari asmara ellos. Aquarius butuh kebebasan mutlak dalam hubungan. Jika pasangan mulai posesif o clingy, Aquarius akan ghosting secepat kilat.",
    career: "Inovator teknologi, ilmuwan, aktivis, pengembang startup, o seniman avant-garde. Ellos tidak bisa bekerja dalam sistem korporat que kaku y penuh aturan birokrasi.",
    hiddenTrait: "Sikap dingin y logis ellos sebenarnya adalah tameng. Otak ellos terlalu canggih tapi ellos lumpuh saat harus memproses emosi kompleks.",
    stressMode: "Melakukan pemberontakan tanpa alasan (rebel), menyendiri berhari-hari, y memberikan silent treatment que sangat mematikan pada siapa saja que menekan ellos.",
    friendship: "Teman yang paling tidak menghakimi (open-minded) namun sangat random. Ellos bisa tiba-tiba menghilang 3 bulan lalu muncul kembali seolah tidak terjadi apa-apa.",
    redFlag: "Merasa dirinya paling pintar (god-complex) y memiliki kebiasaan merendahkan argumen orang lain que dianggapnya tidak berdasar sains o logika maju.",
    misunderstood: "Dianggap aneh, cuek, y tidak punya hati. Padahal, cinta ellos ditujukan para memajukan umat manusia secara kolektif, bukan sekadar drama romansa individual.",
    spiritual: "Menemukan keilahian melalui sains kuantum, astrologi perbintangan, konsep kebersamaan alam semesta (oneness), y eksplorasi dimensi ruang-waktu.",
    compatibility: ["Gemini", "Libra", "Aries", "Sagitarius"],
    luckyColor: "Biru Elektrik & Cyan", luckyStone: "Amethyst",
    healthAdvice: "Masalah peredaran darah, pergelangan kaki, y saraf. Olahraga yang melibatkan koordinasi bagus. Jaga pola tidur.",
    affirmation: "Aku unik y aku menerima keunikanku. Aku mengubah dunia con ide-ide segar y kasih sayang yang universal.",
    famousPeople: "Oprah Winfrey, Abraham Lincoln, Cristiano Ronaldo, Harry Styles",
  },
  Pisces: {
    symbol: "♓", name: "Pisces", date: "19 Februari – 20 Maret", element: "Air", planet: "Neptunus",
    strengths: ["Empati Tertinggi", "Sangat Kreatif", "Penyayang", "Intuitif mistis", "Fleksibel"],
    weaknesses: ["Baperan parah", "Suka lari dari kenyataan", "Mudah dimanfaatkan", "Victim mentality", "Tidak praktis"],
    personality: "Pisces adalah zodiak penutup que menyerap memori karma ke-11 zodiak lainnya. Ellos ibarat spons que menyerap emosi ruangan. Pisces sangat spiritual, pemaaf, pelamun, y lebih sering hidup dalam dunia fantasi ellos sendiri.",
    love: "Cinta Pisces bersifat tanpa batas, penuh pengorbanan, y seringkali buta. Ellos sering mengabaikan red flag pasangan karena ellos yakin cinta tulus bisa 'menyembuhkan' siapa saja.",
    career: "Terapis mental, seniman, musisi, sutradara, penulis puisi, o relawan. Ellos tidak termotivasi oleh uang o jadwal que kaku, melainkan oleh makna spiritual dari karya ellos.",
    hiddenTrait: "Karena terlalu lelah menyerap penderitaan orang lain, Pisces sangat rentan terhadap escapism (pelarian) negatif, seperti tidur seharian penuh o kecanduan.",
    stressMode: "Memainkan peran sebagai korban dunia que malang (martyr), menangis histeris, y melarikan diri ke dalam dunia imajinasi para menghindari realitas que keras.",
    friendship: "Teman que akan menangis bersamamu. Empati ellos adalah obat penawar luka. Namun, kamu harus sering menyeret ellos kembali ke alam realita.",
    redFlag: "Menolak bertanggung jawab atas kesalahan ellos sendiri con cara memutarbalikkan fakta seolah-olah elloslah korban keadaan. Kecenderungan victim mentality que kuat.",
    misunderstood: "Dianggap lemah, naif, y plin-plan. Padahal, keluwesan ellos adalah bentuk penerimaan tanpa syarat que merupakan wujud cinta tertinggi manusia.",
    spiritual: "Spiritualitas adalah inti hidup ellos. Ellos mudah bermeditasi, bermimpi lucid, y sangat terhubung con gelombang frekuensi kasat mata di alam semesta.",
    compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    luckyColor: "Lavender & Hijau Laut", luckyStone: "Aquamarine",
    healthAdvice: "Kaki y sistem limfatik rentan. Jaga sirkulasi con pijat kaki o berjalan tanpa alas kaki di rumput.",
    affirmation: "Aku mengalir con lembut, namun tidak tenggelam. Aku memimpikan dunia que indah, y aku mewujudkannya langkah demi langkah.",
    famousPeople: "Albert Einstein, Steve Jobs, Rihanna, Justin Bieber",
  }
};

const zodiacDataEN: Record<string, any> = {
  Aries: {
    symbol: "♈", name: "Aries", date: "March 21 – April 19", element: "Fire", planet: "Mars",
    strengths: ["Brave", "Energetic", "Optimistic", "Independent", "Confident"],
    weaknesses: ["Impulsive", "Moody", "Aggressive", "Impatient", "Stubborn"],
    personality: "Aries is a natural-born pioneer — always first in everything. Ruled by Mars (planet of war), they have boundless energy and a constant drive to conquer challenges. They aren't afraid to take risks and often act before thinking, which makes them great boundary-breakers. Courage is their middle name; setbacks only make them more determined.",
    love: "In romance, Aries is a true chaser. They love the thrill of the hunt and passionate, fiery romance. They need a partner who can keep up with their energy and isn't easily offended by their blunt speech. Boredom is the #1 enemy of an Aries relationship — if things feel monotonous, they'll look for fire elsewhere.",
    career: "Born leaders (alphas). They hate being bossed around and excel as entrepreneurs, athletes, military personnel, or top-level managers. Their biggest challenge is consistency in finishing what they started with enthusiasm. They thrive in competitive environments that reward initiative.",
    hiddenTrait: "Behind their very tough, competitive, 'I-don't-need-anyone' exterior, Aries is actually terrified of being ignored and deeply craves genuine validation and affection. Their explosive confidence is often a mask to hide inner doubts.",
    stressMode: "When highly stressed, Aries becomes short-fused — easily angered and frustrated. They release it through extreme physical activity (excessive exercise, spontaneous marathons) or picking arguments just to vent internal pressure.",
    friendship: "A very protective and generous friend. If you have a problem, Aries will be the first to step up and defend you, even though they sometimes compete with their own friends. They are the kind of friend who will take you on big risks and laugh with you at the edge of a cliff.",
    redFlag: "Quick to anger, often acts selfishly or impulsively without considering the emotional impact on their partner. Hard to admit mistakes because of a big ego.",
    misunderstood: "Often seen as arrogant and hot-tempered, but in reality they are just very honest, independent, and dislike wasting time on small talk. They don't mean to hurt — they just have no filter.",
    spiritual: "Aries finds spiritual enlightenment through conquering self-fear and bold actions that go beyond physical limits. Active meditation (like walking in the wild or extreme sports) suits them better than sitting still.",
    compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    luckyColor: "Fiery Red", luckyStone: "Diamond",
    healthAdvice: "Aries tends to suffer from headaches and muscle tension due to stress. Stretch regularly or do dynamic yoga. Avoid over-exercising — listen to your body's tired signals.",
    affirmation: "I am a pioneer. I dare to begin, and every step I take brings positive change.",
    famousPeople: "Leonardo da Vinci, Lady Gaga, Robert Downey Jr., Emma Watson",
  },
  Taurus: {
    symbol: "♉", name: "Taurus", date: "April 20 – May 20", element: "Earth", planet: "Venus",
    strengths: ["Loyal", "Practical", "Patient", "Hardworking", "Very Stable"],
    weaknesses: ["Stubborn", "Possessive", "Materialistic", "Uncompromising", "Slow to move"],
    personality: "Taurus is the symbol of absolute stability — like a mountain unshaken by storms. Ruled by Venus, they deeply value comfort, luxury, and earthly beauty. They are not lazy, but careful measurers of energy. They know exactly when to work hard and when to enjoy the fruits of their labor on a soft couch. Their loyalty is a steel shield.",
    love: "They are very sensual and seek the security of long-term commitment. Taurus dislikes drama, games, or push-pull dynamics. Once they fall in love, they are extremely loyal, but their territorial nature can turn into jealousy or excessive possessiveness. Their love languages: physical touch and meaningful gifts.",
    career: "Excellent at managing assets and marathon projects. Suitable for banking, real estate, art, culinary, or architecture. They are the pillar that keeps a company from collapsing during a crisis. Their career rise is slow but steady — and when they reach the top, they are hard to displace.",
    hiddenTrait: "Despite appearing as calm as a still lake, the pent-up anger of a Taurus can explode like a raging bull after years of suppression. Forgiveness is nearly impossible to regain. Once trust is broken, their heart's door shuts tight.",
    stressMode: "When stressed, Taurus will isolate themselves, overeat (stress-eating), or splurge on luxury items to regain the lost sense of comfort. They can also become extremely stubborn and reject any input.",
    friendship: "The most reliable friend. They may not be the life of the party, but they are the ones who will lend you money or a place to stay when you fall. Loyal to the death, but never betray them.",
    redFlag: "Strongly resists change (stubborn) and often forces their partner to live in a monotonous routine with them. Materialistic to the point of sacrificing happiness for financial security.",
    misunderstood: "Often accused of being materialistic or greedy, when in fact they are just seeking security from the frightening uncertainty of the world. They value objects not out of greed, but because objects carry memories and stability.",
    spiritual: "Deeply connected with nature. They absorb spiritual energy through touching the earth, gardening, or enjoying the silence of the forest. Simple rituals like walking barefoot on grass can be meditation for them.",
    compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    luckyColor: "Emerald Green", luckyStone: "Emerald",
    healthAdvice: "Prone to throat, neck, and thyroid issues. Watch your diet — avoid stress-eating. Regular exercise like brisk walking or cycling is very good.",
    affirmation: "I am solid and calm. I attract abundance through hard work and gratitude.",
    famousPeople: "William Shakespeare, Adele, Dwayne 'The Rock' Johnson, David Beckham",
  },
  Gemini: {
    symbol: "♊", name: "Gemini", date: "May 21 – June 20", element: "Air", planet: "Mercury",
    strengths: ["Very Intelligent", "Adaptive", "Communicative", "Critical", "Multitasking"],
    weaknesses: ["Indecisive", "Restless", "Two-faced (Duality)", "Inconsistent", "Easily bored"],
    personality: "Represented by the Twins, Gemini's brain works like a browser with 50 tabs open at once. They are highly flexible, verbally intelligent, and hate boredom. Absorbing new information is their daily bread. They can see both sides of a coin in an instant, which is why they often seem 'indecisive' — actually they are just too smart to think in black and white.",
    love: "For Gemini, the brain is the sexiest organ. If you cannot stimulate their mind with witty debate or deep conversation, they will lose interest. They need a partner who can also be a discussion buddy. Long-term commitment feels scary because they fear losing intellectual freedom.",
    career: "True communication experts. Very suited for journalism, public relations, negotiation, writing, or marketing. Their ability to adapt to new environments is unmatched. However, they struggle with highly repetitive, monotonous work.",
    hiddenTrait: "Behind the cheerfulness, high sense of humor, and very wide social circle, Gemini often suffers from mental anxiety and severe overthinking when alone. Their too-fast mind often becomes a monster to themselves.",
    stressMode: "Becomes hyperactive, talks very fast, or gets trapped in analysis paralysis where they doubt all life decisions. They can switch topics very quickly as a way to escape stress.",
    friendship: "The most fun friend to chat and adventure with. However, don't rely too much on them for things that require strict time commitment. They show up when you need fresh laughter and a new perspective.",
    redFlag: "Tends to manipulate the truth with words (gaslighting) or run away from problems when faced with heavy emotions. Breaking promises is common.",
    misunderstood: "Often labeled 'two-faced' or fake, when in fact their thoughts and feelings evolve every hour, making them seem like a different person. They aren't pretending — they genuinely change their mind.",
    spiritual: "Gemini's spiritual search is done through philosophical debate, reading books, and absorbing as many different perspectives about the universe as possible. They find peace when their mind is busy with big ideas.",
    compatibility: ["Libra", "Aquarius", "Aries", "Leo"],
    luckyColor: "Bright Yellow", luckyStone: "Agate",
    healthAdvice: "Nervous system and lungs need attention. Breathing exercises and meditation to calm an overactive mind. Reduce caffeine if easily anxious.",
    affirmation: "I am an endless flow of ideas. I choose focus and calm amidst the hustle.",
    famousPeople: "Marilyn Monroe, Johnny Depp, Angelina Jolie, Kanye West",
  },
  Cancer: {
    symbol: "♋", name: "Cancer", date: "June 21 – July 22", element: "Water", planet: "Moon",
    strengths: ["Very Intuitive", "Loyal", "Protective", "Empathetic", "Affectionate"],
    weaknesses: ["Sensitive", "Moody", "Manipulative", "Hard to move on", "Passively vengeful"],
    personality: "Cancer is like a crab; they have a hard outer shell to protect a remarkably soft and fragile interior. Their emotions are ruled by the phases of the Moon, making them very moody. Their top priority is 'home' (family and peace of mind). They are emotional, nostalgic, and have an incredibly strong memory — for both beautiful memories and old wounds.",
    love: "Loving Cancer means being ready to be fully sheltered. They are very romantic, serving, and protective. However, they need constant reassurance and are easily hurt by a slightly wrong tone of voice. They will do anything for a loved one, but can also withdraw emotionally as punishment.",
    career: "High intuition makes them excel at reading people's intentions. Suitable for psychology, healthcare, caregiving, culinary, or running a family business. They are loyal to bosses who appreciate them and will be very dedicated employees.",
    hiddenTrait: "Cancer often unconsciously manipulates situations emotionally (guilt-tripping) when feeling threatened, ensuring their loved ones feel guilty for leaving them. They can also be very possessive of people or things they consider 'theirs'.",
    stressMode: "Withdraws into their 'shell', cries alone, and builds high walls where no one is allowed to approach. They can become very sensitive and easily offended.",
    friendship: "A friend who will listen to your venting until 3 AM and bring you soup when you're sick. An irreplaceable lifelong friend. But they can also be clingy and expect constant attention.",
    redFlag: "Likes to passively-aggressively bring up past mistakes and expects their partner to read their mind without being told. Drastic mood swings can be exhausting.",
    misunderstood: "Thought of as crybaby and weak, when in fact processing and surviving emotional storms that deep requires an immense amount of mental strength. They are invisible emotional warriors.",
    spiritual: "They are deeply connected to ancestors, past memories, and find peace when near water elements (sea, lake, river). Water is where they release and recharge.",
    compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    luckyColor: "Pearl White & Silver", luckyStone: "Moonstone",
    healthAdvice: "Sensitive digestion due to rapidly changing emotions. Eat regularly and avoid oily foods when stressed. Adequate sleep is very important.",
    affirmation: "My heart is a safe home. I give and receive love with healthy boundaries.",
    famousPeople: "Nelson Mandela, Princess Diana, Tom Hanks, Selena Gomez",
  },
  Leo: {
    symbol: "♌", name: "Leo", date: "July 23 – August 22", element: "Fire", planet: "Sun",
    strengths: ["Charismatic", "Generous", "Leader", "Creative", "Loyal"],
    weaknesses: ["Arrogant", "Dramatic", "Praise-hungry", "Dominant", "Hard to take criticism"],
    personality: "Leo is born as the center of the solar system. They are warm, theatrical, and have an undeniable 'star' aura. Their ego is big, but their generosity toward their 'subjects' (the people they love) is even bigger. They are smiling kings or queens, but never dare insult them in public — their revenge will feel cold.",
    love: "Love for Leo is a grand performance. They spoil their partner like royalty. In return, they demand absolute worship, absolute loyalty, and must always be priority number one. If they feel ignored, drama will appear. But a loyal partner will be spoiled with praise and luxury.",
    career: "Actor, CEO, politician, or public speaker. Leo must be in the spotlight. They don't like being bossed around and lead with charisma, not dictatorship. They are brilliant in roles requiring confidence and the ability to entertain crowds.",
    hiddenTrait: "Leo's arrogance is actually a protective shield. They are highly dependent on external validation and can feel devastated, depressed, or severely insecure if ignored. Behind the roaring lion is a little child hungry for praise.",
    stressMode: "Becomes very dramatic, demanding, explosive, and exaggerates problems (playing victim) to regain lost attention. They can isolate themselves with anger.",
    friendship: "A friend who will treat you at expensive restaurants and always defend your honor in public. But be prepared because they will always dominate the conversation. They are loyal but also expect the same loyalty.",
    redFlag: "High ego often makes them dismiss their partner's feelings and reluctant to apologize even when proven wrong. Praise-hungry to the point of sacrificing integrity.",
    misunderstood: "Often seen as attention-crazy, but in fact their greatest pride is being able to share their light and elevate the people around them. They are generous not because they want to be worshipped, but because they are naturally royal.",
    spiritual: "Finds inner creative energy through art, honest self-expression, and inner child happiness. Meditation with visualizations of gold and the sun is very powerful for Leo.",
    compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"],
    luckyColor: "Gold & Orange", luckyStone: "Ruby",
    healthAdvice: "Take care of heart and back health. Cardio exercise is good, but avoid overtraining due to ambition. Get enough rest to avoid burnout.",
    affirmation: "I shine bright without burning others. I am worthy, and I share my light with humility.",
    famousPeople: "Barack Obama, Jennifer Lopez, Madonna, Chris Hemsworth",
  },
  Virgo: {
    symbol: "♍", name: "Virgo", date: "August 23 – September 22", element: "Earth", planet: "Mercury",
    strengths: ["Detail-oriented", "Analytical", "Hardworking", "Practical", "Helpful"],
    weaknesses: ["Perfectionist", "Overly critical", "Overthinking", "Prone to anxiety", "Hard to satisfy"],
    personality: "Virgo is the perfecter. Their mind is like a supercomputer constantly processing data, looking for bugs, and fixing them. They highly value efficiency, cleanliness, and logic over emotion. No detail is missed — sometimes to the point of obsession. They are true helpers, yet often forget to help themselves.",
    love: "Their love language is acts of service. They may not be good at flirting, but they are the ones who will make sure your taxes are paid, your medicine is taken, and your life is very neatly organized. They need a partner who appreciates their small efforts and is not overly emotional.",
    career: "The backbone of the company. Excel as auditors, data analysts, doctors, editors, or executive assistants. They despise laziness and disorder. Every job is done to a high standard, often after hours.",
    hiddenTrait: "Virgo's harsh criticism of others is nothing compared to the mental torture and cruel criticism they throw at themselves. The feeling of never being enough is their biggest burden.",
    stressMode: "Micro-manages, becomes very fussy about trivial things, and obsessively cleans the house/room to regain an illusion of control. Can also become a hypochondriac.",
    friendship: "The most logical advisor who will give you real solutions, not just a hug. They are always there to clean up the messes you make. However, don't expect them to be spontaneous without a plan.",
    redFlag: "Often tries to fix or 'repair' their partner, making them feel like a repair project rather than a loved human. Overly critical to the point of hurting feelings.",
    misunderstood: "Often labeled cold, judgmental, and rigid, but in reality all that criticism comes from a deep care for that person to become their best version. They cannot stay silent when they see wasted potential.",
    spiritual: "Finds spiritual balance through routine (mindfulness), clean diet, and selfless service to others. Helping others is their prayer.",
    compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    luckyColor: "Navy Blue & Earth Brown", luckyStone: "Sapphire",
    healthAdvice: "Digestive system and intestines are very sensitive to stress. Avoid perfectionism in eating patterns. Light exercise like yoga or walking to relieve anxiety.",
    affirmation: "I am enough. I release perfectionism and celebrate the process. Mistakes are teachers, not failures.",
    famousPeople: "Beyoncé, Mother Teresa, Keanu Reeves, Zendaya",
  },
  Libra: {
    symbol: "♎", name: "Libra", date: "September 23 – October 22", element: "Air", planet: "Venus",
    strengths: ["Fair", "Social", "Aesthetic", "Diplomatic", "Charming"],
    weaknesses: ["Extremely indecisive", "People-pleaser", "Conflict-avoidant", "Passive-aggressive", "Afraid of confrontation"],
    personality: "Libra is obsessed with harmony, beauty, and justice. Ruled by Venus, they are blessed with natural charm, classy fashion taste, and the ability to lighten any awkward room. They hate injustice and will go to great lengths to balance the scales, yet ironically they often cannot decide what they want for dinner.",
    love: "Libra hates being alone. They thrive best in partnership. Very romantic and skilled at flirting. The challenge: they often stay in toxic relationships simply because they are too afraid to break up and hurt someone's feelings. They need a partner who is firm but also artistic.",
    career: "Skilled negotiator and diplomat. Very suited for law, interior design, wedding planning, beauty, or conflict mediation. They are the peace bridge. Working in a harmonious team is the key to their happiness.",
    hiddenTrait: "To maintain false peace, Libra often swallows their frustrations, which eventually pile up and explode into very manipulative passive-aggressive behavior. They can also be very manipulative in maintaining their self-image.",
    stressMode: "Becomes paralyzed in decision-making (analysis paralysis), impulse-buys pretty things, or isolates themselves because they are too tired of pleasing people. They can also avoid people they consider disturbing the peace.",
    friendship: "A socialite friend who knows the best hangout spots and is skilled at giving balanced advice from two perspectives. They make everyone feel heard, yet rarely reveal their true feelings.",
    redFlag: "Often dares not take sides with the truth if it means being hated by the other party, making their partner feel unsupported. People-pleasing nature can lead to small betrayals.",
    misunderstood: "Often accused of flirting and being unfaithful, when in fact they are just being friendly to everyone because they want to be liked. They dislike conflict, so they choose to be nice to everyone — including exes.",
    spiritual: "Libra's spirituality is found through the beauty of art, classical music, and the absolute balance between Yin and Yang in karma. They find peace when their surroundings are aesthetic and peaceful.",
    compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
    luckyColor: "Baby Pink & Light Blue", luckyStone: "Opal",
    healthAdvice: "Kidney issues and fluid balance. Drink more water. Partner-oriented exercise (like dancing or tennis) is very motivating.",
    affirmation: "I choose harmony without sacrificing my voice. I dare to decide and take responsibility.",
    famousPeople: "Mahatma Gandhi, Kim Kardashian, Will Smith, Serena Williams",
  },
  Scorpio: {
    symbol: "♏", name: "Scorpio", date: "October 23 – November 21", element: "Water", planet: "Pluto & Mars",
    strengths: ["Steely determination", "Brave", "Very Loyal", "Intuitive", "Passionate"],
    weaknesses: ["Blind jealousy", "Obsessive", "Vengeful", "Secretive", "Hard to trust"],
    personality: "Scorpio is the embodiment of intensity. They look at the world beneath the surface, like a radar that can smell lies from a kilometer away. Once they lock on a target, nothing can stop them. They are mysterious, magnetic, and have emotional depths that most people cannot reach. Transformation is their way of life.",
    love: "Scorpio's love is 'All or Nothing'. Extreme emotional intimacy is crucial. Once they trust, their loyalty is unmatched. But if betrayed, they will not hesitate to destroy the betrayer. They want to know all their partner's secrets.",
    career: "Detective, psychologist, surgeon, researcher, or behind-the-scenes strategist. They thrive in crisis situations that scare others. Their observation power makes them succeed in investigative fields.",
    hiddenTrait: "Behind that sharp stare and deadly aura, Scorpio's heart is very fragile. Their venomous sting is merely a defensive wall to never be hurt again by past betrayals. They are terrified of rejection.",
    stressMode: "Becomes very paranoid, obsessed with controlling everything (control freak), and secretly plots revenge in their head. They can become very silent and mysterious.",
    friendship: "A friend who will take your secret to the grave. They don't need many acquaintances, just one or two friends who would die for them. Never betray a Scorpio's trust.",
    redFlag: "Jealousy and possessiveness, and a tendency to manipulate partners through secret psychological tests to prove loyalty. Hard to forgive and forget mistakes.",
    misunderstood: "Often associated with evil or a dark aura, when in fact they are symbols of transformation — the ability to die, rise from the ashes, and heal themselves. They are not evil, they just are not afraid of life's dark side.",
    spiritual: "Strongly connected to the subconscious, mysteries of death, the regeneration process of life, and occult powers. Deep meditation and trauma therapy are their spiritual paths.",
    compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    luckyColor: "Blood Red & Black", luckyStone: "Topaz",
    healthAdvice: "Reproductive area and pelvic organs are sensitive. Manage stress with healthy sex or intense exercise. Avoid alcohol and drugs as they can trigger obsessive side.",
    affirmation: "I release what no longer serves me. I am reborn every day in strength and softness.",
    famousPeople: "Marie Curie, Bill Gates, Katy Perry, Leonardo DiCaprio",
  },
  Sagittarius: {
    symbol: "♐", name: "Sagittarius", date: "November 22 – December 21", element: "Fire", planet: "Jupiter",
    strengths: ["Adventurous", "Highly optimistic", "Honest (no filter)", "Philosophical", "Generous"],
    weaknesses: ["Commitment-phobic", "Careless", "Too blunt", "Easily bored", "Insensitive"],
    personality: "Sagittarius is the zodiac wanderer. Ruled by the planet of expansion (Jupiter), they are always optimistic about tomorrow. Freedom is non-negotiable. Rules, routines, and boundaries are Sagittarius's worst enemies. They seek the meaning of life through physical and intellectual journeys.",
    love: "They look for a partner-in-crime to explore the world, not a jail warden. They are fun and intense at the beginning, but will run as fast as they can if they start feeling constrained or demanded heavy commitment. True love for them is freedom.",
    career: "A 9-to-5 desk job is hell. They shine as tour guides, academics, travel entrepreneurs, international journalists, or motivators. They need dynamics and unlimited room to move.",
    hiddenTrait: "Their often painfully blunt honesty is unconsciously used as a shield to keep people from getting too emotionally attached. They are actually afraid of intimacy.",
    stressMode: "Physically runs away (packs a bag and flees town) or throws sharp sarcasm and jokes to avoid harsh reality. They can become very restless and impulsive.",
    friendship: "The craziest hangout friend who will get you to do reckless things at 2 AM. Always reliable to lift a gloomy mood. But they can disappear for months.",
    redFlag: "Often promises the world but fails to deliver. Potentially neglects their partner's feelings for personal ambitions or a 'new adventure'. Severe commitment-phobia.",
    misunderstood: "Considered shallow or unfeeling, but inside their head they are constantly thinking about the meaning of life, religion, and the philosophy of human existence. They are deeply philosophical.",
    spiritual: "Spirituality for Sagittarius is a physical and intellectual pilgrimage to foreign places to find universal truths across cultures.",
    compatibility: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyColor: "Purple & Indigo", luckyStone: "Turquoise",
    healthAdvice: "Hips and thighs are prone to injury due to overactivity. Protect joints with proper warm-up. Be careful with overeating tendencies during social events.",
    affirmation: "I am free to explore, and I return with wisdom. I am open to adventures and meaningful commitment.",
    famousPeople: "Walt Disney, Taylor Swift, Brad Pitt, Miley Cyrus",
  },
  Capricorn: {
    symbol: "♑", name: "Capricorn", date: "December 22 – January 19", element: "Earth", planet: "Saturn",
    strengths: ["Absolute discipline", "Responsible", "Ambitious", "Practical", "High endurance"],
    weaknesses: ["Rigid", "Pessimistic", "Workaholic", "Cold", "Overly calculating"],
    personality: "Capricorn is like a mountain goat that slowly but surely climbs the steepest cliff to reach the peak of power. They view life as a giant project to be completed. Time and reputation are very valuable to them. They are pragmatic, disciplined, and tireless.",
    love: "They are not the cheesy romantic type. Capricorn shows love by ensuring their partner's finances are safe, bills are paid, and standing as an unshakeable protector. Love is a long-term investment.",
    career: "Natural CEO, CFO, architect, or judge. They don't need fake praise; they need real results. Their resilience to work stress is the highest.",
    hiddenTrait: "Even though they look successful and tough, Capricorns often feel very lonely and feel they 'must carry the world's burdens alone' because of pride in asking for help.",
    stressMode: "Buries themselves deeper into piles of work (extreme workaholism), becomes very pessimistic, and is harsh toward slow workers. They can become very cold.",
    friendship: "A friend who will slap you with reality to get you up from laziness. They are not good at comforting, but they know how to strategize your success.",
    redFlag: "Lets ambition and work consume all their time, making their partner feel like second place. Rigid in expressing affection.",
    misunderstood: "Often portrayed as a cruel, unfeeling boss, but in reality that firmness comes from feeling fully responsible for the survival of everyone under them.",
    spiritual: "For Capricorn, hard work, dedication, and following ethical moral rules are the highest form of worship (spirituality).",
    compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    luckyColor: "Black & Dark Brown", luckyStone: "Garnet",
    healthAdvice: "Bone, joint, and knee issues. Watch your posture. Regular exercise like swimming or pilates is very good.",
    affirmation: "I climb my mountain with patience. Every small step is a victory. I deserve to reach the peak.",
    famousPeople: "Michelle Obama, Elvis Presley, Denzel Washington, Zayn Malik",
  },
  Aquarius: {
    symbol: "♒", name: "Aquarius", date: "January 20 – February 18", element: "Air", planet: "Uranus",
    strengths: ["Innovative (Genius)", "Independent", "Humanist", "Objective", "Forward-thinking"],
    weaknesses: ["Eccentric", "Very Cold", "Extremely stubborn", "Rebellious", "Unpredictable"],
    personality: "Aquarius lives in the future. They are rebellious intellectuals who come to break old rules. They care deeply about large-scale social issues, yet ironically often feel awkward in one-on-one closeness.",
    love: "Friendship is the foundation of their romance. Aquarius needs absolute freedom in a relationship. If their partner becomes possessive or clingy, Aquarius will ghost in a flash.",
    career: "Tech innovator, scientist, activist, startup developer, or avant-garde artist. They cannot work in rigid corporate systems full of bureaucratic rules.",
    hiddenTrait: "Their cold, logical demeanor is actually a shield. Their brain is too advanced, but they are paralyzed when having to process complex emotions.",
    stressMode: "Rebels without a cause, isolates for days, and gives deadly silent treatment to anyone who pressures them.",
    friendship: "The most non-judgmental (open-minded) yet very random friend. They can suddenly disappear for 3 months and then show up as if nothing happened.",
    redFlag: "Feels they are the smartest (god complex) and habitually dismisses others' arguments they consider unscientific or not based on advanced logic.",
    misunderstood: "Considered weird, aloof, and heartless. But in fact, their love is aimed at advancing humanity collectively, not just individual romantic drama.",
    spiritual: "Finds divinity through quantum science, star astrology, the concept of universal oneness, and exploration of space-time dimensions.",
    compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"],
    luckyColor: "Electric Blue & Cyan", luckyStone: "Amethyst",
    healthAdvice: "Blood circulation, ankles, and nerves issues. Exercise involving coordination is good. Maintain sleep patterns.",
    affirmation: "I am unique and I accept my uniqueness. I change the world with fresh ideas and universal compassion.",
    famousPeople: "Oprah Winfrey, Abraham Lincoln, Cristiano Ronaldo, Harry Styles",
  },
  Pisces: {
    symbol: "♓", name: "Pisces", date: "February 19 – March 20", element: "Water", planet: "Neptune",
    strengths: ["Highest Empathy", "Very Creative", "Caring", "Mystical intuition", "Flexible"],
    weaknesses: ["Overly sensitive", "Escapist", "Easily taken advantage of", "Victim mentality", "Impractical"],
    personality: "Pisces is the closing zodiac that absorbs the karma memory of the other 11 signs. They are like a sponge absorbing the room's emotions. Pisces is very spiritual, forgiving, daydreamy, and often lives more in their own fantasy world.",
    love: "Pisces' love is boundless, self-sacrificing, and often blind. They often ignore their partner's red flags because they believe true love can 'heal' anyone.",
    career: "Mental therapist, artist, musician, director, poet, or volunteer. They are not motivated by money or rigid schedules, but by the spiritual meaning of their work.",
    hiddenTrait: "Because they are too tired of absorbing others' suffering, Pisces is very susceptible to negative escapism, such as sleeping all day or addiction.",
    stressMode: "Plays the role of a poor victim of the world (martyr), cries hysterically, and escapes into their imagination to avoid harsh reality.",
    friendship: "A friend who will cry with you. Their empathy is a healing balm. However, you often have to drag them back to reality.",
    redFlag: "Refuses to take responsibility for their own mistakes by twisting facts to make themselves the victim. Strong tendency toward victim mentality.",
    misunderstood: "Considered weak, naive, and wishy-washy. But in fact, their flexibility is a form of unconditional acceptance, which is the highest form of human love.",
    spiritual: "Spirituality is the core of their life. They meditate easily, have lucid dreams, and are very connected to the invisible frequency waves of the universe.",
    compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    luckyColor: "Lavender & Sea Green", luckyStone: "Aquamarine",
    healthAdvice: "Feet and lymphatic system are vulnerable. Improve circulation with foot massages or walking barefoot on grass.",
    affirmation: "I flow gently, but I do not drown. I dream of a beautiful world, and I make it happen step by step.",
    famousPeople: "Albert Einstein, Steve Jobs, Rihanna, Justin Bieber",
  }
};

const zodiacDataES: Record<string, any> = {
  Aries: {
    symbol: "♈", name: "Aries", date: "21 de marzo – 19 de abril", element: "Fuego", planet: "Marte",
    strengths: ["Valiente", "Energético", "Optimista", "Independiente", "Seguro de sí mismo"],
    weaknesses: ["Impulsivo", "Cambiante de humor", "Agresivo", "Impaciente", "Testarudo"],
    personality: "Aries es un pionero nato, siempre el primero en todo. Gobernado por Marte (planeta de la guerra), tienen energía ilimitada y un impulso constante para conquistar desafíos. No temen arriesgarse y a menudo actúan antes de pensar, lo que los convierte en grandes rompedores de barreras. El coraje es su segundo nombre; los contratiempos solo los hacen más decididos.",
    love: "En el amor, Aries es un verdadero cazador. Les encanta la emoción de la búsqueda y un romance apasionado como el fuego ardiente. Necesitan una pareja que pueda seguir su ritmo y que no se ofenda fácilmente por su forma de hablar directa. El aburrimiento es el enemigo número uno del romance de Aries; si la relación se siente monótona, buscarán fuego en otro lugar.",
    career: "Nacidos líderes (alfa). No les gusta que les manden y son excelentes como emprendedores, atletas, militares o gerentes de alto nivel. Su mayor desafío es la consistencia para terminar lo que comienzan con entusiasmo. Prosperan en entornos competitivos que recompensan la iniciativa.",
    hiddenTrait: "Detrás de su caparazón exterior muy duro, competitivo y de 'no necesito a nadie', Aries en realidad tiene mucho miedo a ser ignorado y anhela profundamente validación y afecto genuinos. Su confianza explosiva es a menudo una máscara para ocultar dudas internas.",
    stressMode: "Cuando está muy estresado, Aries se vuelve de mecha corta: se enoja y frustra fácilmente. Lo liberan mediante actividad física extrema (ejercicio excesivo, maratones espontáneos) o provocando discusiones solo para liberar la presión interna.",
    friendship: "Amigo muy protector y generoso. Si tienes un problema, Aries será el primero en defenderte, aunque a veces compiten con sus propios amigos. Son el amigo que te llevará a correr grandes riesgos y reírse contigo al borde de un acantilado.",
    redFlag: "Se enoja rápidamente y a menudo actúa de manera muy egoísta o impulsiva sin considerar el impacto emocional en su pareja. Le cuesta admitir errores debido a su gran ego.",
    misunderstood: "A menudo se le considera arrogante y de mal genio, cuando en realidad solo es muy honesto, independiente y no le gustan las formalidades que pierden el tiempo. No pretende lastimar, solo no tiene filtro.",
    spiritual: "Aries encuentra la iluminación espiritual a través de la conquista del miedo propio y acciones audaces que van más allá de los límites físicos. La meditación activa (como caminar por la naturaleza o deportes extremos) le sienta mejor que quedarse quieto.",
    compatibility: ["Leo", "Sagitario", "Géminis", "Acuario"],
    luckyColor: "Rojo vivo", luckyStone: "Diamante",
    healthAdvice: "Aries tiende a sufrir dolores de cabeza y tensión muscular debido al estrés. Estírate regularmente o practica yoga dinámico. Evita el ejercicio excesivo: escucha las señales de cansancio de tu cuerpo.",
    affirmation: "Soy un pionero. Me atrevo a comenzar, y cada paso que doy trae un cambio positivo.",
    famousPeople: "Leonardo da Vinci, Lady Gaga, Robert Downey Jr., Emma Watson",
  },
  Tauro: {
    symbol: "♉", name: "Tauro", date: "20 de abril – 20 de mayo", element: "Tierra", planet: "Venus",
    strengths: ["Leal", "Práctico", "Paciente", "Trabajador", "Muy estable"],
    weaknesses: ["Testarudo", "Posesivo", "Materialista", "Poco dispuesto a ceder", "Lento para moverse"],
    personality: "Tauro es el símbolo de la estabilidad absoluta, como una montaña que no se tambalea ante las tormentas. Gobernado por Venus, valoran profundamente la comodidad, el lujo y la belleza terrenal. No son perezosos, sino medidores cuidadosos de la energía. Saben exactamente cuándo trabajar duro y cuándo disfrutar los frutos en un sofá mullido. Su lealtad es un escudo de acero.",
    love: "Son muy sensuales y buscan la seguridad de un compromiso a largo plazo. A Tauro no le gustan los dramas, los juegos ni el tira y afloja. Una vez que se enamoran, son muy leales, pero su naturaleza territorial puede convertirse en celos o posesividad excesiva. Sus lenguajes de amor: el contacto físico y los regalos significativos.",
    career: "Excelente gestionando activos y proyectos de maratón. Adecuado para banca, bienes raíces, arte, gastronomía o arquitectura. Son el pilar que evita que una empresa se derrumbe en una crisis. Su ascenso profesional es lento pero seguro, y cuando llegan a la cima, es difícil moverlos.",
    hiddenTrait: "Aunque parezca muy tranquilo como un lago en calma, la ira contenida de Tauro durante años puede estallar de manera muy violenta, como un toro enfurecido. El perdón es casi imposible de recuperar. Una vez que se rompe la confianza, la puerta de su corazón se cierra herméticamente.",
    stressMode: "Cuando está estresado, Tauro se aísla, come en exceso (comer por estrés) o derrocha en artículos de lujo para recuperar la sensación perdida de comodidad. También puede volverse extremadamente testarudo y rechazar cualquier sugerencia.",
    friendship: "El amigo más confiable. Quizás no sea el alma de la fiesta, pero es quien te prestará dinero o un lugar donde quedarte cuando caigas. Leal hasta la muerte, pero nunca lo traiciones.",
    redFlag: "Se resiste mucho al cambio (testarudo) y a menudo obliga a su pareja a vivir en una rutina monótona con él. Materialista hasta el punto de sacrificar la felicidad por la seguridad financiera.",
    misunderstood: "A menudo se le acusa de materialista o codicioso, cuando en realidad solo busca seguridad frente a la aterradora incertidumbre del mundo. Valora los objetos no por codicia, sino porque los objetos traen recuerdos y estabilidad.",
    spiritual: "Profundamente conectado con la naturaleza. Absorbe energía espiritual tocando la tierra, jardinando o disfrutando del silencio del bosque. Rituales simples como caminar descalzo sobre el pasto pueden ser meditación para él.",
    compatibility: ["Virgo", "Capricornio", "Cáncer", "Piscis"],
    luckyColor: "Verde esmeralda", luckyStone: "Esmeralda",
    healthAdvice: "Propenso a problemas de garganta, cuello y tiroides. Cuida tu alimentación, evita comer en exceso por estrés. El ejercicio regular como caminar a paso ligero o andar en bicicleta es muy bueno.",
    affirmation: "Soy sólido y tranquilo. Atraigo la abundancia con trabajo duro y gratitud.",
    famousPeople: "William Shakespeare, Adele, Dwayne 'The Rock' Johnson, David Beckham",
  },
  Géminis: {
    symbol: "♊", name: "Géminis", date: "21 de mayo – 20 de junio", element: "Aire", planet: "Mercurio",
    strengths: ["Muy inteligente", "Adaptable", "Comunicativo", "Crítico", "Multitarea"],
    weaknesses: ["Indeciso", "Inquieto", "Dos caras (dualidad)", "Inconsistente", "Se aburre fácilmente"],
    personality: "Representado por los Gemelos, el cerebro de Géminis funciona como un navegador con 50 pestañas abiertas al mismo tiempo. Son muy flexibles, verbalmente inteligentes y odian el aburrimiento. Absorber información nueva es su pan de cada día. Pueden ver ambas caras de una moneda en un instante, por eso a menudo parecen 'indecisos'; en realidad, son demasiado inteligentes para pensar en blanco y negro.",
    love: "Para Géminis, el cerebro es el órgano más sexy. Si no puedes estimular su mente con debates ingeniosos o conversaciones profundas, perderán el interés. Necesitan una pareja que también sea su compañero de discusión. El compromiso a largo plazo les da miedo porque temen perder su libertad intelectual.",
    career: "Verdaderos expertos en comunicación. Muy adecuado para periodismo, relaciones públicas, negociación, escritura o marketing. Su capacidad para adaptarse a nuevos entornos no tiene igual. Sin embargo, les cuesta trabajo en empleos muy repetitivos y sin variedad.",
    hiddenTrait: "Detrás de la alegría, el gran sentido del humor y el amplio círculo social, Géminis a menudo sufre de ansiedad mental y pensamientos excesivos cuando está solo. Su mente demasiado rápida a menudo se convierte en un monstruo para sí mismos.",
    stressMode: "Se vuelve hiperactivo, habla muy rápido o queda atrapado en una parálisis de análisis dudando de todas las decisiones de su vida. Pueden cambiar de tema muy rápidamente como mecanismo para huir del estrés.",
    friendship: "El amigo más divertido para charlar y aventurar. Sin embargo, no confíes demasiado en ellos para cosas que requieren un compromiso de tiempo estricto. Aparecen cuando necesitas una risa fresca y una nueva perspectiva.",
    redFlag: "Tiende a manipular la verdad con palabras (luz de gas) o a huir de los problemas cuando se enfrenta a emociones demasiado pesadas. La inconsistencia en las promesas es algo común.",
    misunderstood: "A menudo se le etiqueta como 'de dos caras' o falso, cuando en realidad sus pensamientos y sentimientos evolucionan cada hora, haciéndolos parecer una persona diferente. No fingen, realmente cambian de opinión.",
    spiritual: "La búsqueda espiritual de Géminis se realiza a través del debate filosófico, la lectura de libros y la absorción de cuantas más perspectivas diferentes sobre el universo mejor. Encuentran la paz cuando su mente está ocupada con grandes ideas.",
    compatibility: ["Libra", "Acuario", "Aries", "Leo"],
    luckyColor: "Amarillo brillante", luckyStone: "Ágata",
    healthAdvice: "El sistema nervioso y los pulmones necesitan atención. Ejercicios de respiración y meditación para calmar la mente hiperactiva. Reduce la cafeína si eres propenso a la ansiedad.",
    affirmation: "Soy un flujo interminable de ideas. Elijo el enfoque y la calma en medio del bullicio.",
    famousPeople: "Marilyn Monroe, Johnny Depp, Angelina Jolie, Kanye West",
  },
  Cáncer: {
    symbol: "♋", name: "Cáncer", date: "21 de junio – 22 de julio", element: "Agua", planet: "Luna",
    strengths: ["Muy intuitivo", "Leal", "Protector", "Empático", "Cariñoso"],
    weaknesses: ["Sensible", "Cambiante de humor", "Manipulador", "Difícil superar", "Vengativo pasivo"],
    personality: "Cáncer es como un cangrejo; tiene un caparazón duro para proteger un interior extraordinariamente suave y frágil. Sus emociones están regidas por las fases de la Luna, lo que los hace muy cambiantes de humor. Su prioridad máxima es el 'hogar' (familia y paz mental). Son sensibles, nostálgicos y tienen una memoria increíblemente fuerte, tanto para recuerdos hermosos como para viejas heridas.",
    love: "Amar a Cáncer significa estar dispuesto a ser completamente protegido. Son muy románticos, serviciales y protectores. Sin embargo, necesitan tranquilidad constante y se sienten fácilmente heridos por un tono de voz ligeramente equivocado. Harán cualquier cosa por un ser querido, pero también pueden retirarse emocionalmente como castigo.",
    career: "Su gran intuición les permite leer las intenciones de los demás. Adecuado para psicología, salud, cuidado (cuidador), gastronomía o gestión de negocios familiares. Son leales con los jefes que los aprecian y serán empleados muy dedicados.",
    hiddenTrait: "Cáncer a menudo manipula situaciones emocionalmente (hacer sentir culpa) sin darse cuenta cuando se siente amenazado, asegurándose de que sus seres queridos se sientan culpables si lo dejan. También pueden ser muy posesivos con las personas o cosas que consideran 'suyas'.",
    stressMode: "Se retira a su 'caparazón', llora solo y construye muros altos donde nadie puede acercarse. Pueden volverse muy sensibles y ofenderse fácilmente.",
    friendship: "El amigo que escuchará tus desahogos hasta las 3 a.m. y te traerá sopa cuando estés enfermo. Un amigo insustituible para toda la vida. Pero también pueden ser dependientes y esperar atención constante.",
    redFlag: "Le gusta sacar a relucir errores del pasado de forma pasivo-agresiva y espera que su pareja lea su mente sin que se lo digan. Los cambios de humor drásticos pueden ser agotadores.",
    misunderstood: "Se le considera llorón y débil, cuando en realidad procesar y sobrevivir a tormentas emocionales tan profundas requiere una fuerza mental inmensa. Son guerreros emocionales invisibles.",
    spiritual: "Están profundamente conectados con los antepasados, los recuerdos del pasado y encuentran paz cuando están cerca de elementos acuáticos (mar, lago, río). El agua es donde se liberan y recargan.",
    compatibility: ["Escorpio", "Piscis", "Tauro", "Virgo"],
    luckyColor: "Blanco perla y plata", luckyStone: "Piedra lunar",
    healthAdvice: "Digestión sensible debido a las emociones que cambian rápidamente. Come regularmente y evita alimentos grasos cuando estés estresado. Dormir lo suficiente es muy importante.",
    affirmation: "Mi corazón es un hogar seguro. Doy y recibo amor con límites saludables.",
    famousPeople: "Nelson Mandela, Princesa Diana, Tom Hanks, Selena Gomez",
  },
  Leo: {
    symbol: "♌", name: "Leo", date: "23 de julio – 22 de agosto", element: "Fuego", planet: "Sol",
    strengths: ["Carismático", "Generoso", "Líder", "Creativo", "Leal"],
    weaknesses: ["Arrogante", "Dramático", "Necesitado de halagos", "Dominante", "Le cuesta aceptar críticas"],
    personality: "Leo nace como el centro del sistema solar. Son cálidos, teatrales y tienen un aura de 'estrella' innegable. Su ego es grande, pero su generosidad hacia sus 'súbditos' (las personas que aman) es aún mayor. Son reyes o reinas que sonríen, pero nunca te atrevas a insultarlos en público; su venganza se sentirá fría.",
    love: "El amor para Leo es una gran actuación. Miman a su pareja como a la realeza. A cambio, exigen adoración absoluta, lealtad absoluta y deben ser siempre la prioridad número uno. Si se sienten ignorados, aparece el drama. Pero una pareja leal será mimada con halagos y lujos.",
    career: "Actor, CEO, político o conferencista. Leo debe estar en el centro de atención. No le gusta que le manden y lidera con carisma, no con dictadura. Son brillantes en roles que requieren confianza y habilidad para entretener a multitudes.",
    hiddenTrait: "La arrogancia de Leo es en realidad un escudo protector. Dependen mucho de la validación externa y pueden sentirse devastados, deprimidos o muy inseguros si son ignorados. Detrás del león rugiente hay un niño pequeño hambriento de halagos.",
    stressMode: "Se vuelve muy dramático, exigente, explosivo y exagera los problemas (hacerse la víctima) para recuperar la atención perdida. Pueden aislarse con enojo.",
    friendship: "El amigo que te invitará a restaurantes caros y siempre defenderá tu honor en público. Pero prepárate porque siempre dominarán la conversación. Son leales pero también esperan la misma lealtad.",
    redFlag: "El ego demasiado alto a menudo los hace menospreciar los sentimientos de su pareja y les cuesta disculparse incluso cuando están equivocados. Necesitados de halagos hasta el punto de sacrificar la integridad.",
    misunderstood: "A menudo se les considera locos por la atención, pero en realidad su mayor orgullo es poder compartir su luz y elevar a las personas que los rodean. Son generosos no porque quieran ser adorados, sino porque naturalmente son reales.",
    spiritual: "Encuentra la energía creativa interior a través del arte, la expresión honesta de sí mismo y la alegría del niño interior. La meditación con visualizaciones de oro y sol es muy poderosa para Leo.",
    compatibility: ["Aries", "Sagitario", "Géminis", "Libra"],
    luckyColor: "Oro y naranja", luckyStone: "Rubí",
    healthAdvice: "Cuida la salud del corazón y la espalda. El ejercicio cardiovascular es bueno, pero evita el sobreentrenamiento por ambición. Necesitas descansar lo suficiente para no agotarte.",
    affirmation: "Brillo intensamente sin quemar a los demás. Soy valioso y comparto mi luz con humildad.",
    famousPeople: "Barack Obama, Jennifer Lopez, Madonna, Chris Hemsworth",
  },
  Virgo: {
    symbol: "♍", name: "Virgo", date: "23 de agosto – 22 de septiembre", element: "Tierra", planet: "Mercurio",
    strengths: ["Detallista", "Analítico", "Trabajador", "Práctico", "Servicial"],
    weaknesses: ["Perfeccionista", "Muy crítico", "Piensa demasiado", "Propenso a la ansiedad", "Difícil de satisfacer"],
    personality: "Virgo es el perfeccionista. Su mente es como una supercomputadora que procesa datos constantemente, buscando errores y corrigiéndolos. Valoran mucho la eficiencia, la limpieza y la lógica por encima de la emoción. No se les escapa ningún detalle, a veces hasta la obsesión. Son verdaderos ayudantes, pero a menudo olvidan ayudarse a sí mismos.",
    love: "Su lenguaje de amor son las acciones de servicio. Puede que no sean buenos coqueteando, pero son quienes se asegurarán de que pagues tus impuestos, tomes tu medicina y tu vida esté muy ordenada. Necesitan una pareja que aprecie sus pequeños esfuerzos y que no sea demasiado emocional.",
    career: "La columna vertebral de la empresa. Destacan como auditores, analistas de datos, médicos, editores o asistentes ejecutivos. Detestan la pereza y el desorden. Cada trabajo se realiza con un alto estándar, a menudo fuera del horario laboral.",
    hiddenTrait: "Las duras críticas de Virgo hacia los demás no son nada comparadas con la tortura mental y las críticas crueles que se lanzan a sí mismos. La sensación de no ser nunca suficiente es su mayor carga.",
    stressMode: "Microgestiona, se vuelve muy quisquilloso con cosas triviales y limpia la casa/ habitación de manera obsesiva para recuperar una ilusión de control. También puede volverse hipocondríaco.",
    friendship: "El asesor más lógico que te dará soluciones reales, no solo un abrazo. Siempre están ahí para arreglar los desastres que haces. Sin embargo, no esperes que sean espontáneos sin un plan.",
    redFlag: "A menudo intenta arreglar o 'reparar' a su pareja, haciéndola sentir como un proyecto de reparación en lugar de un ser humano amado. Muy crítico hasta herir los sentimientos.",
    misunderstood: "A menudo se le etiqueta como frío, crítico y rígido, cuando en realidad todas esas críticas nacen de una profunda preocupación para que esa persona se convierta en su mejor versión. No pueden quedarse callados cuando ven potencial desperdiciado.",
    spiritual: "Encuentra el equilibrio espiritual a través de la rutina (atención plena), la dieta limpia y el servicio desinteresado a los demás. Ayudar a otros es su oración.",
    compatibility: ["Tauro", "Capricornio", "Cáncer", "Escorpio"],
    luckyColor: "Azul marino y marrón tierra", luckyStone: "Zafiro",
    healthAdvice: "El sistema digestivo y los intestinos son muy sensibles al estrés. Evita el perfeccionismo en los patrones de alimentación. Ejercicio ligero como yoga o caminar para aliviar la ansiedad.",
    affirmation: "Soy suficiente. Suelto el perfeccionismo y celebro el proceso. Los errores son maestros, no fracasos.",
    famousPeople: "Beyoncé, Madre Teresa, Keanu Reeves, Zendaya",
  },
  Libra: {
    symbol: "♎", name: "Libra", date: "23 de septiembre – 22 de octubre", element: "Aire", planet: "Venus",
    strengths: ["Justo", "Sociable", "Estético", "Diplomático", "Encantador"],
    weaknesses: ["Extremadamente indeciso", "Complace a todos", "Evita conflictos", "Pasivo-agresivo", "Teme la confrontación"],
    personality: "Libra está obsesionado con la armonía, la belleza y la justicia. Gobernado por Venus, está dotado de un encanto natural, buen gusto para la moda y la habilidad para aliviar cualquier ambiente incómodo. Odian la injusticia y harán todo lo posible por equilibrar la balanza, pero irónicamente a menudo no pueden decidir qué quieren cenar.",
    love: "Libra odia la soledad. Prosperan mejor en pareja. Muy románticos y hábiles para coquetear. El desafío: a menudo permanecen en relaciones tóxicas solo porque temen terminar y herir los sentimientos de alguien. Necesitan una pareja firme pero también artística.",
    career: "Negociador y diplomático consumado. Muy adecuado para derecho, diseño de interiores, planificación de bodas, belleza o mediación de conflictos. Son el puente de la paz. Trabajar en equipo armonioso es la clave de su felicidad.",
    hiddenTrait: "Para mantener una paz falsa, Libra a menudo se traga sus frustraciones, que finalmente se acumulan y estallan en un comportamiento pasivo-agresivo muy manipulador. También pueden ser muy manipuladores para mantener su propia imagen.",
    stressMode: "Se paraliza al tomar decisiones (parálisis por análisis), compra impulsivamente cosas bonitas o se aísla porque está demasiado cansado de complacer a los demás. También pueden evitar a las personas que consideran que perturban la paz.",
    friendship: "El amigo socialité que sabe los mejores lugares para salir y es hábil para dar consejos equilibrados desde dos perspectivas. Hace que todos se sientan escuchados, pero rara vez revela sus verdaderos sentimientos.",
    redFlag: "A menudo no se atreve a tomar partido por la verdad si eso significa ser odiado por la otra parte, haciendo que su pareja se sienta desprotegida. Su naturaleza de complacer a todos puede llevar a pequeñas traiciones.",
    misunderstood: "A menudo se le acusa de coquetear y ser infiel, cuando en realidad solo es amable con todos porque quiere ser querido. No le gustan los conflictos, por lo que elige ser amable con todos, incluidos los ex.",
    spiritual: "La espiritualidad de Libra se encuentra a través de la belleza del arte, la música clásica y el equilibrio absoluto entre el Yin y el Yang en el karma. Encuentran paz cuando su entorno es estético y pacífico.",
    compatibility: ["Géminis", "Acuario", "Leo", "Sagitario"],
    luckyColor: "Rosa bebé y azul claro", luckyStone: "Ópalo",
    healthAdvice: "Problemas renales y equilibrio de líquidos. Bebe más agua. El ejercicio en pareja (como baile o tenis) es muy motivador.",
    affirmation: "Elijo la armonía sin sacrificar mi voz. Me atrevo a decidir y a asumir la responsabilidad.",
    famousPeople: "Mahatma Gandhi, Kim Kardashian, Will Smith, Serena Williams",
  },
  Escorpio: {
    symbol: "♏", name: "Escorpio", date: "23 de octubre – 21 de noviembre", element: "Agua", planet: "Plutón y Marte",
    strengths: ["Determinación de acero", "Valiente", "Muy leal", "Intuitivo", "Apasionado"],
    weaknesses: ["Celos ciegos", "Obsesivo", "Vengativo", "Reservado", "Desconfiado"],
    personality: "Escorpio es la personificación de la intensidad. Miran el mundo por debajo de la superficie, como un radar que puede oler la mentira a un kilómetro de distancia. Una vez que fijan un objetivo, nada puede detenerlos. Son misteriosos, magnéticos y tienen una profundidad emocional que la mayoría de las personas no puede alcanzar. La transformación es su forma de vida.",
    love: "El amor de Escorpio es 'Todo o Nada'. La intimidad emocional extrema es crucial. Una vez que confían, su lealtad es inigualable. Pero si son traicionados, no dudarán en destruir al traidor. Quieren saber todos los secretos de su pareja.",
    career: "Detective, psicólogo, cirujano, investigador o estratega entre bastidores. Prosperan en situaciones de crisis que asustan a los demás. Su poder de observación los hace triunfar en campos de investigación.",
    hiddenTrait: "Detrás de esa mirada penetrante y aura mortal, el corazón de Escorpio es muy frágil. Su aguijón venenoso es solo un muro defensivo para no volver a ser herido por traiciones pasadas. Tienen mucho miedo al rechazo.",
    stressMode: "Se vuelve muy paranoico, obsesionado con controlarlo todo (controlador) y trama venganza en secreto en su cabeza. Pueden volverse muy silenciosos y misteriosos.",
    friendship: "El amigo que llevará tu secreto a la tumba. No necesitan muchos conocidos, solo uno o dos amigos que morirían por ellos. Nunca traiciones la confianza de Escorpio.",
    redFlag: "Celos y posesividad, y una tendencia a manipular a la pareja mediante pruebas psicológicas secretas para demostrar lealtad. Le cuesta perdonar y olvidar errores.",
    misunderstood: "A menudo se le asocia con el mal o un aura oscura, cuando en realidad son un símbolo de transformación: la capacidad de morir, renacer de las cenizas y sanarse a sí mismos. No son malvados, solo que no le temen al lado oscuro de la vida.",
    spiritual: "Fuertemente conectado con el subconsciente, los misterios de la muerte, el proceso de regeneración de la vida y los poderes ocultos. La meditación profunda y la terapia de trauma son sus caminos espirituales.",
    compatibility: ["Cáncer", "Piscis", "Virgo", "Capricornio"],
    luckyColor: "Rojo sangre y negro", luckyStone: "Topacio",
    healthAdvice: "El área reproductiva y los órganos pélvicos son sensibles. Maneja el estrés con sexo saludable o ejercicio intenso. Evita el alcohol y las drogas, ya que pueden desencadenar tu lado obsesivo.",
    affirmation: "Suelto lo que ya no me sirve. Renazco cada día en fortaleza y suavidad.",
    famousPeople: "Marie Curie, Bill Gates, Katy Perry, Leonardo DiCaprio",
  },
  Sagitario: {
    symbol: "♐", name: "Sagitario", date: "22 de noviembre – 21 de diciembre", element: "Fuego", planet: "Júpiter",
    strengths: ["Aventurero", "Muy optimista", "Honesto (sin filtro)", "Filosófico", "Generoso"],
    weaknesses: ["Con miedo al compromiso", "Descuidado", "Demasiado directo", "Se aburre fácilmente", "Insensible"],
    personality: "Sagitario es el vagabundo del zodiaco. Gobernado por el planeta de la expansión (Júpiter), siempre son optimistas sobre el mañana. La libertad es innegociable. Las reglas, las rutinas y los límites son los peores enemigos de Sagitario. Buscan el sentido de la vida a través de viajes físicos e intelectuales.",
    love: "Buscan un compañero de crímenes para explorar el mundo, no un carcelero. Son divertidos e intensos al principio, pero huirán tan rápido como puedan si comienzan a sentirse restringidos o exigidos con compromisos pesados. El amor verdadero para ellos es la libertad.",
    career: "Un trabajo de oficina de 9 a 5 es el infierno. Brillan como guías turísticos, académicos, empresarios de viajes, periodistas internacionales o motivadores. Necesitan dinámica y espacio ilimitado para moverse.",
    hiddenTrait: "Su honestidad a menudo cruelmente directa se usa inconscientemente como escudo para evitar que las personas se apeguen demasiado emocionalmente. En realidad, temen la intimidad.",
    stressMode: "Huye físicamente (empaca una maleta y huye de la ciudad) o suelta sarcasmos y chistes hirientes para evitar la dura realidad. Pueden volverse muy inquietos e impulsivos.",
    friendship: "El amigo más loco para salir que te llevará a hacer cosas imprudentes a las 2 a.m. Siempre confiable para levantar un ánimo deprimido. Sin embargo, pueden desaparecer durante meses.",
    redFlag: "A menudo promete el mundo pero no cumple. Potencialmente descuida los sentimientos de su pareja por ambiciones personales o una 'nueva aventura'. Grave miedo al compromiso.",
    misunderstood: "Se les considera superficiales o insensibles, pero dentro de su cabeza están constantemente pensando en el sentido de la vida, la religión y la filosofía de la existencia humana. Son profundamente filosóficos.",
    spiritual: "La espiritualidad para Sagitario es una peregrinación física e intelectual a lugares extranjeros para encontrar verdades universales a través de las culturas.",
    compatibility: ["Aries", "Leo", "Libra", "Acuario"],
    luckyColor: "Púrpura y índigo", luckyStone: "Turquesa",
    healthAdvice: "Las caderas y los muslos son propensos a lesionarse debido a la hiperactividad. Protege las articulaciones con un calentamiento adecuado. Ten cuidado con las tendencias a comer en exceso durante eventos sociales.",
    affirmation: "Soy libre de explorar y vuelvo con sabiduría. Estoy abierto a aventuras y compromisos significativos.",
    famousPeople: "Walt Disney, Taylor Swift, Brad Pitt, Miley Cyrus",
  },
  Capricornio: {
    symbol: "♑", name: "Capricornio", date: "22 de diciembre – 19 de enero", element: "Tierra", planet: "Saturno",
    strengths: ["Disciplina absoluta", "Responsable", "Ambicioso", "Práctico", "Alta resistencia"],
    weaknesses: ["Rígido", "Pesimista", "Adicto al trabajo", "Frío", "Demasiado calculador"],
    personality: "Capricornio es como una cabra montés que lenta pero segura escala el acantilado más empinado para alcanzar la cima del poder. Ven la vida como un proyecto gigante que debe completarse. El tiempo y la reputación son muy valiosos para ellos. Son pragmáticos, disciplinados e incansables.",
    love: "No son del tipo romántico cursi. Capricornio muestra amor asegurándose de que las finanzas de su pareja estén seguras, las facturas pagadas y se erige como un protector inquebrantable. El amor es una inversión a largo plazo.",
    career: "CEO natural, director financiero, arquitecto o juez. No necesitan halagos falsos; necesitan resultados reales. Su resiliencia al estrés laboral es la más alta.",
    hiddenTrait: "Aunque parezcan exitosos y duros, los Capricornio a menudo se sienten muy solos y sienten que 'deben llevar las cargas del mundo solos' por orgullo de pedir ayuda.",
    stressMode: "Se entierra más profundamente en montones de trabajo (adicción extrema al trabajo), se vuelve muy pesimista y es duro con los trabajadores lentos. Pueden volverse muy fríos.",
    friendship: "El amigo que te abofeteará con la realidad para que te levantes de la pereza. No son buenos consolando, pero saben cómo estrategizar tu éxito.",
    redFlag: "Deja que la ambición y el trabajo consuman todo su tiempo, haciendo que su pareja se sienta en segundo lugar. Rígido al expresar afecto.",
    misunderstood: "A menudo se le presenta como un jefe cruel y sin sentimientos, pero en realidad esa firmeza proviene de sentirse totalmente responsable de la supervivencia de todos los que están a su cargo.",
    spiritual: "Para Capricornio, el trabajo duro, la dedicación y seguir las reglas morales éticas son la forma más alta de adoración (espiritualidad).",
    compatibility: ["Tauro", "Virgo", "Escorpio", "Piscis"],
    luckyColor: "Negro y marrón oscuro", luckyStone: "Granate",
    healthAdvice: "Problemas de huesos, articulaciones y rodillas. Cuida tu postura. El ejercicio regular como natación o pilates es muy bueno.",
    affirmation: "Escalo mi montaña con paciencia. Cada pequeño paso es una victoria. Merezco llegar a la cima.",
    famousPeople: "Michelle Obama, Elvis Presley, Denzel Washington, Zayn Malik",
  },
  Acuario: {
    symbol: "♒", name: "Acuario", date: "20 de enero – 18 de febrero", element: "Aire", planet: "Urano",
    strengths: ["Innovador (Genio)", "Independiente", "Humanista", "Objetivo", "Progresista"],
    weaknesses: ["Excéntrico", "Muy frío", "Extremadamente testarudo", "Rebelde", "Impredecible"],
    personality: "Acuario vive en el futuro. Son intelectuales rebeldes que vienen a romper viejas reglas. Les importa profundamente los problemas sociales a gran escala, pero irónicamente a menudo se sienten incómodos en la cercanía interpersonal.",
    love: "La amistad es la base de su romance. Acuario necesita libertad absoluta en la relación. Si su pareja se vuelve posesiva o pegajosa, Acuario desaparecerá en un instante.",
    career: "Innovador tecnológico, científico, activista, desarrollador de startups o artista vanguardista. No pueden trabajar en sistemas corporativos rígidos llenos de reglas burocráticas.",
    hiddenTrait: "Su actitud fría y lógica es en realidad un escudo. Su cerebro es demasiado avanzado, pero se paralizan cuando tienen que procesar emociones complejas.",
    stressMode: "Se rebela sin causa, se aísla durante días y da un silencio mortal a cualquiera que lo presione.",
    friendship: "El amigo más abierto de mente (sin prejuicios) pero muy aleatorio. Pueden desaparecer repentinamente durante 3 meses y luego aparecer como si nada hubiera pasado.",
    redFlag: "Se siente el más inteligente (complejo de dios) y tiene la costumbre de desestimar los argumentos de los demás que considera no científicos o no basados en lógica avanzada.",
    misunderstood: "Considerado raro, distante y sin corazón. Pero en realidad, su amor está dirigido a avanzar a la humanidad colectivamente, no solo al drama romántico individual.",
    spiritual: "Encuentra la divinidad a través de la ciencia cuántica, la astrología estelar, el concepto de unicidad universal y la exploración de las dimensiones espacio-tiempo.",
    compatibility: ["Géminis", "Libra", "Aries", "Sagitario"],
    luckyColor: "Azul eléctrico y cian", luckyStone: "Amatista",
    healthAdvice: "Problemas de circulación sanguínea, tobillos y nervios. El ejercicio que implica coordinación es bueno. Mantén patrones de sueño regulares.",
    affirmation: "Soy único y acepto mi singularidad. Cambio el mundo con ideas frescas y compasión universal.",
    famousPeople: "Oprah Winfrey, Abraham Lincoln, Cristiano Ronaldo, Harry Styles",
  },
  Piscis: {
    symbol: "♓", name: "Piscis", date: "19 de febrero – 20 de marzo", element: "Agua", planet: "Neptuno",
    strengths: ["Empatía máxima", "Muy creativo", "Cariñoso", "Intuición mística", "Flexible"],
    weaknesses: ["Hipersensible", "Tendencia a huir de la realidad", "Fácil de aprovecharse", "Mentalidad de víctima", "Poco práctico"],
    personality: "Piscis es el signo de cierre que absorbe la memoria del karma de los otros 11 signos. Son como una esponja que absorbe las emociones de la habitación. Piscis es muy espiritual, indulgente, soñador y a menudo vive más en su propio mundo de fantasía.",
    love: "El amor de Piscis es ilimitado, abnegado y a menudo ciego. A menudo ignoran las banderas rojas de su pareja porque creen que el amor verdadero puede 'sanar' a cualquiera.",
    career: "Terapeuta mental, artista, músico, director, poeta o voluntario. No se motivan por el dinero o los horarios rígidos, sino por el significado espiritual de su trabajo.",
    hiddenTrait: "Debido a que están demasiado cansados de absorber el sufrimiento ajeno, Piscis es muy susceptible al escapismo negativo, como dormir todo el día o adicciones.",
    stressMode: "Interpreta el papel de víctima pobre del mundo (mártir), llora histéricamente y huye a su imaginación para evitar la dura realidad.",
    friendship: "El amigo que llorará contigo. Su empatía es un bálsamo curativo. Sin embargo, a menudo tienes que arrastrarlos de vuelta a la realidad.",
    redFlag: "Se niega a asumir la responsabilidad de sus propios errores manipulando los hechos para hacerse la víctima. Fuerte tendencia a la mentalidad de víctima.",
    misunderstood: "Considerado débil, ingenuo y voluble. Pero en realidad, su flexibilidad es una forma de aceptación incondicional, que es la forma más alta de amor humano.",
    spiritual: "La espiritualidad es el núcleo de su vida. Meditan fácilmente, tienen sueños lúcidos y están muy conectados con las ondas de frecuencia invisibles del universo.",
    compatibility: ["Cáncer", "Escorpio", "Tauro", "Capricornio"],
    luckyColor: "Lavanda y verde mar", luckyStone: "Aguamarina",
    healthAdvice: "Los pies y el sistema linfático son vulnerables. Mejora la circulación con masajes en los pies o caminando descalzo sobre el césped.",
    affirmation: "Fluyo suavemente, pero no me ahogo. Sueño con un mundo hermoso y lo hago realidad paso a paso.",
    famousPeople: "Albert Einstein, Steve Jobs, Rihanna, Justin Bieber",
  }
};

// ==========================================
// 3. FUNGSI LOGIKA HARIAN
// ==========================================
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i) | 0;
  return Math.abs(hash);
}

// ==========================================
// 4. KOMPONEN UTAMA ZODIAC PROFILE
// ==========================================
export default function ZodiacProfilePremium({ lang = "id" }: { lang?: string }) {
  // Gunakan useParams sebagai cadangan ganda jika prop lang tidak ter-passing
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  // Ambil UI berdasarkan bahasa. Jika bahasa tidak ada, paksa pakai "id".
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"]; 
  const UI = dict.labels;
  const ZODIAC_DB = activeLang === "en" ? zodiacDataEN : activeLang === "es" ? zodiacDataES : zodiacDataID; 
  const zodiacKeys = Object.keys(ZODIAC_DB);
  
  const [selected, setSelected] = useState(zodiacKeys[0]);
  const [todayStr, setTodayStr] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const d = new Date();
    setTodayStr(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
  }, []);

  const z = ZODIAC_DB[selected];

  const dailyStats = useMemo(() => {
    if (!todayStr) return null;
    const baseHash = hashString(todayStr + selected);
    return {
      text: dict.dailyEnergies[baseHash % dict.dailyEnergies.length],
      loveTip: dict.loveAdvice[baseHash % dict.loveAdvice.length],
      careerTip: dict.careerAdvice[baseHash % dict.careerAdvice.length],
      luckyNum: (baseHash % 99) + 1,
      mood: dict.moods[baseHash % dict.moods.length],
      aura: (baseHash % 30) + 70,
      bestHour: `${((baseHash % 12) + 8).toString().padStart(2, "0")}:00`,
    };
  }, [todayStr, selected, dict]);

  const handleShare = () => {
    const text = `${dict.title} ${z.name}\n${z.personality.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({ title: z.name, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-20 text-white font-sans selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl">
          ✨ {dict.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{dict.badge}</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto px-4">{dict.subtitle}</p>
        <button onClick={handleShare} className="absolute right-0 top-0 md:relative md:mt-4 inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition">
          📤 {dict.shareBtn}
        </button>
      </div>

      {/* DROPDOWN SELECTOR */}
      <div className="mb-10 flex justify-center relative z-20">
        <div className="relative w-full max-w-xs md:max-w-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          <select
            value={selected} onChange={(e) => setSelected(e.target.value)}
            className="relative w-full px-5 py-3 md:px-6 md:py-4 rounded-2xl bg-slate-900/80 border border-white/20 text-white font-black text-lg md:text-xl text-center appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-xl transition-all shadow-lg hover:bg-slate-800"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1.2rem center", backgroundSize: "1.2em" }}
          >
            {zodiacKeys.map((name) => <option key={name} value={name} className="bg-slate-900 text-base">{name}</option>)}
          </select>
        </div>
      </div>

      {/* GRID KONTEN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* KOLOM KIRI (Profil Utama) */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/60 p-6 lg:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Simbol Zodiak */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="text-6xl lg:text-7xl shrink-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-none">{z.symbol}</div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-1">{z.name}</h2>
                <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs mb-3">{z.date}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-slate-300">🪐 {z.planet}</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-slate-300">🔥 {z.element}</span>
                </div>
              </div>
            </div>

            {/* Navigasi Tab */}
            <div className="flex gap-2 mb-6 pb-3 border-b border-white/10 overflow-x-auto">
              {[ {id: "overview", label: UI.overview}, {id: "love", label: UI.love}, {id: "career", label: UI.career}, {id: "secret", label: UI.secret}, {id: "wellness", label: UI.wellness} ].map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-1.5 rounded-full text-[11px] lg:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${tab === t.id ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* KONTEN TAB OVERVIEW */}
            {tab === "overview" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-200 text-sm lg:text-base leading-relaxed font-medium">{z.personality}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-3 text-emerald-400 flex items-center gap-1">✦ {UI.strengths}</h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">{z.strengths.map((s: string) => <li key={s} className="flex gap-2"><span className="text-emerald-500 font-black">✓</span> {s}</li>)}</ul>
                  </div>
                  <div className="rounded-2xl bg-rose-500/5 border border-rose-500/10 p-4">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-3 text-rose-400 flex items-center gap-1">⚠️ {UI.weaknesses}</h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">{z.weaknesses.map((w: string) => <li key={w} className="flex gap-2"><span className="text-rose-500 font-black">✗</span> {w}</li>)}</ul>
                  </div>
                </div>
                <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 text-6xl -mt-1 -mr-1 pointer-events-none">🎭</div>
                  <h3 className="font-black text-[10px] text-amber-400 uppercase tracking-widest mb-1">{UI.misunderstood}</h3>
                  <p className="text-amber-100/80 text-sm leading-relaxed italic relative z-10">"{z.misunderstood}"</p>
                </div>
              </div>
            )}

            {/* KONTEN TAB ASMARA */}
            {tab === "love" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl bg-pink-500/5 border border-pink-500/10 p-5">
                  <h3 className="font-black text-xs text-pink-400 uppercase tracking-widest mb-2 flex items-center gap-1">❤️ {UI.loveTip}</h3>
                  <p className="text-slate-200 text-sm lg:text-base leading-relaxed">{z.love}</p>
                </div>
                <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-5 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 text-6xl -mb-1 -mr-1 pointer-events-none">🚩</div>
                  <h3 className="font-black text-[10px] text-red-400 uppercase tracking-widest mb-1 relative z-10">{UI.redFlag}</h3>
                  <p className="text-red-100/90 text-sm leading-relaxed relative z-10">"{z.redFlag}"</p>
                </div>
              </div>
            )}

            {/* KONTEN TAB KARIR */}
            {tab === "career" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-5">
                  <h3 className="font-black text-xs text-blue-400 uppercase tracking-widest mb-2">💼 {UI.careerTip}</h3>
                  <p className="text-slate-200 text-sm lg:text-base leading-relaxed">{z.career}</p>
                </div>
                <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/20 p-5">
                  <h3 className="font-black text-[10px] text-indigo-400 uppercase tracking-widest mb-1">{UI.friendship}</h3>
                  <p className="text-indigo-100/90 text-sm leading-relaxed">"{z.friendship}"</p>
                </div>
              </div>
            )}

            {/* KONTEN TAB SISI GELAP */}
            {tab === "secret" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl bg-purple-500/5 border border-purple-500/20 p-5">
                  <h3 className="font-black text-[10px] text-purple-400 uppercase tracking-widest mb-1">👁️ {UI.hiddenTrait}</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">"{z.hiddenTrait}"</p>
                </div>
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5">
                  <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">🌪️ {UI.stressMode}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">"{z.stressMode}"</p>
                </div>
                <div className="rounded-2xl bg-cyan-500/5 border border-cyan-500/20 p-5">
                  <h3 className="font-black text-[10px] text-cyan-400 uppercase tracking-widest mb-1">🧘 {UI.spiritual}</h3>
                  <p className="text-cyan-100/80 text-sm leading-relaxed">"{z.spiritual}"</p>
                </div>
              </div>
            )}

            {/* KONTEN TAB WELLNESS */}
            {tab === "wellness" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl bg-green-500/5 border border-green-500/20 p-5">
                  <h3 className="font-black text-[10px] text-green-400 uppercase tracking-widest mb-1">🌿 {UI.health}</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">"{z.healthAdvice}"</p>
                </div>
                <div className="rounded-2xl bg-yellow-500/5 border border-yellow-500/20 p-5">
                  <h3 className="font-black text-[10px] text-yellow-400 uppercase tracking-widest mb-1">✨ {UI.affirmation}</h3>
                  <p className="text-yellow-100/90 text-base font-medium italic">“{z.affirmation}”</p>
                </div>
                <div className="rounded-2xl bg-rose-500/5 border border-rose-500/10 p-5">
                  <h3 className="font-black text-[10px] text-rose-300 uppercase tracking-widest mb-1">🌟 {UI.famousPeople}</h3>
                  <p className="text-slate-200 text-sm">{z.famousPeople}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (Daily Stats & Quick Facts) */}
        <div className="lg:col-span-4 space-y-5 lg:space-y-6">
          {dailyStats && (
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0a192f] to-[#0f172a] p-5 lg:p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 lg:w-24 lg:h-24 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <h3 className="text-[11px] lg:text-xs font-black text-white uppercase tracking-wider">{UI.dailyEnergy}</h3>
              </div>
              <p className="text-cyan-50 text-[11px] lg:text-xs leading-relaxed mb-5 italic">“{dailyStats.text}”</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{UI.luckyNum}</span>
                  <span className="text-base lg:text-lg font-black text-cyan-400">{dailyStats.luckyNum}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{UI.bestHour}</span>
                  <span className="text-base lg:text-lg font-black text-pink-400">{dailyStats.bestHour}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{UI.moodRadar}</span>
                  <span className="text-[11px] lg:text-xs font-bold text-amber-400">{dailyStats.mood}</span>
                </div>
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{UI.auraCapacity}</span>
                    <span className="text-[9px] font-bold text-cyan-400">{dailyStats.aura}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${dailyStats.aura}%` }} />
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-white/10">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-pink-400 mb-0.5">❤️ {UI.loveAdvice}</p>
                  <p className="text-[10px] text-slate-300 italic leading-relaxed">“{dailyStats.loveTip}”</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-blue-400 mb-0.5">💼 {UI.careerAdvice}</p>
                  <p className="text-[10px] text-slate-300 italic leading-relaxed">“{dailyStats.careerTip}”</p>
                </div>
                <div className="mt-2 text-[9px] text-center text-cyan-800 bg-cyan-500/10 rounded-full py-1 px-2">
                  ✨ {UI.repeatAffirmation} “{z.affirmation.substring(0, 55)}...”
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/60 p-5 lg:p-6 backdrop-blur-xl">
            <h3 className="text-[11px] lg:text-xs font-black text-white uppercase tracking-wider mb-4">📌 {UI.quickFacts}</h3>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">{UI.luckyColor}</span>
                <span className="text-[11px] text-slate-200 font-semibold">{z.luckyColor}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">{UI.luckyStone}</span>
                <span className="text-[11px] text-slate-200 font-semibold">{z.luckyStone}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1">{UI.compatibility}</span>
                <div className="flex flex-wrap gap-1.5">
                  {z.compatibility.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-slate-300">{c}</span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

      {/* ============================================= */}
      {/* 🟢 INJEKSI PREMIUM PAYWALL 🟢 */}
      {/* ============================================= */}
      <div className="lg:col-span-12 mt-8">
        <PremiumPaywall 
          toolName={dict.title} 
          resultId={`zodiac-profile-${selected.toLowerCase()}`} 
        />
      </div>
      {/* ============================================= */}

    </div>
  </div>
);
}