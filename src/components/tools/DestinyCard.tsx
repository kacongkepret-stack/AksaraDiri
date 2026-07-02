"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";
// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Kartu Takdir Semesta", badge: "Ultra Premium",
    subtitle: "Tarik kartu, temukan pesan dari alam semesta untuk harimu. Perpaduan arketipe kuno & refleksi diri modern.",
    shareBtn: "Bagikan", drawBtn: "🃏 Tarik Kartu Takdir",
    drawingText: "Mengocok takdir...", emptyMessage: "Klik kartu di bawah untuk memulai perjalananmu.",
    flipHint: "Klik untuk menarik", historyLabel: "📜 3 Kartu Terakhir",
    drawAgain: "🔄 Tarik Ulang",
    disclaimer: "*Kartu takdir bersifat reflektif untuk hiburan & introspeksi. Keputusan terakhir tetap di tangan Anda.",
    quote: "\"Setiap kartu adalah cermin; bukan untuk meramal masa depan, tetapi untuk memahami masa kini.\"",
    labels: { theme: "Tema", meaning: "Makna", advice: "Petunjuk", affirmation: "Afirmasi", color: "Warna", element: "Elemen" },
  },
  en: {
    title: "Destiny Card", badge: "Ultra Premium",
    subtitle: "Draw a card, receive a message from the universe for your day. A blend of ancient archetypes and modern self-reflection.",
    shareBtn: "Share", drawBtn: "🃏 Draw Destiny Card",
    drawingText: "Shuffling fate...", emptyMessage: "Click the card below to begin your journey.",
    flipHint: "Click to draw", historyLabel: "📜 Last 3 Cards",
    drawAgain: "🔄 Draw Again",
    disclaimer: "*Destiny cards are reflective tools for entertainment and introspection. Final decisions remain yours.",
    quote: "\"Each card is a mirror; not to predict the future, but to understand the present.\"",
    labels: { theme: "Theme", meaning: "Meaning", advice: "Guidance", affirmation: "Affirmation", color: "Color", element: "Element" },
  },
  es: {
    title: "Carta del Destino", badge: "Ultra Premium",
    subtitle: "Tira una carta, recibe un mensaje del universo para tu día. Mezcla de arquetipos antiguos y reflexión personal moderna.",
    shareBtn: "Compartir", drawBtn: "🃏 Tirar Carta del Destino",
    drawingText: "Barajando el destino...", emptyMessage: "Haz clic en la carta de abajo para comenzar tu viaje.",
    flipHint: "Haz clic para tirar", historyLabel: "📜 Últimas 3 Cartas",
    drawAgain: "🔄 Tirar de Nuevo",
    disclaimer: "*Las cartas del destino son herramientas reflexivas para entretenimiento e introspección. Las decisiones finales son tuyas.",
    quote: "\"Cada carta es un espejo; no para predecir el futuro, sino para entender el presente.\"",
    labels: { theme: "Tema", meaning: "Significado", advice: "Guía", affirmation: "Afirmación", color: "Color", element: "Elemento" },
  },
};

// ========== DATABASE KARTU DENGAN GAMBAR ==========
const DESTINY_CARDS_ML = [
  {
    id: "SUN",
    image: "/images/sun.png",
    gradientBg: "from-amber-900/40 to-yellow-950/30",
    data: {
      id: { name: "Sang Matahari", theme: "Pencerahan & Kelimpahan", desc: "Kartu ini melambangkan puncak vitalitas, kesuksesan, dan kejelasan absolut. Kabut kebingungan yang selama ini menyelimuti Anda sedang menyingkir, digantikan oleh pemahaman yang terang benderang. Kebahagiaan, kesehatan, dan keberuntungan sedang berpihak pada Anda.", meaning: "Anda sedang memasuki fase di mana segala sesuatunya terasa 'bercahaya'. Masalah yang dulu rumit kini terlihat sederhana. Ini adalah waktu terbaik untuk memulai proyek baru.", advice: "Jangan sembunyikan potensi Anda. Inilah saatnya mengambil panggung utama, membagikan kehangatan pada orang sekitar, dan mengeksekusi rencana yang sempat tertunda.", affirmation: "Aku adalah cahaya. Aku berharga, aku dicintai, dan aku mampu menciptakan kebahagiaan.", color: "Emas & Oranye", element: "Api" },
      en: { name: "The Sun", theme: "Enlightenment & Abundance", desc: "This card symbolizes peak vitality, success, and absolute clarity. The fog of confusion is clearing, replaced by radiant understanding. Happiness, health, and luck are on your side.", meaning: "You are entering a phase where everything feels 'illuminated'. Previously complex problems now seem simple. This is the best time to start new projects.", advice: "Don't hide your potential. It's time to take center stage, share warmth, and execute delayed plans.", affirmation: "I am light. I am worthy, I am loved, and I am capable of creating happiness.", color: "Gold & Orange", element: "Fire" },
      es: { name: "El Sol", theme: "Iluminación & Abundancia", desc: "Esta carta simboliza vitalidad máxima, éxito y claridad absoluta. La niebla de confusión se disipa, reemplazada por un entendimiento radiante. La felicidad, la salud y la suerte están de tu lado.", meaning: "Estás entrando en una fase donde todo se siente 'iluminado'. Los problemas complejos ahora parecen simples. Es el mejor momento para iniciar proyectos.", advice: "No ocultes tu potencial. Es momento de tomar el centro del escenario, compartir calidez y ejecutar planes postergados.", affirmation: "Soy luz. Soy valioso, soy amado y soy capaz de crear felicidad.", color: "Oro & Naranja", element: "Fuego" },
    },
  },
  {
    id: "MOON",
    image: "/images/moon.png",
    gradientBg: "from-slate-900/60 to-indigo-950/40",
    data: {
      id: { name: "Sang Bulan", theme: "Intuisi & Ilusi", desc: "Bulan merepresentasikan alam bawah sadar, intuisi, dan hal-hal yang belum terungkap ke permukaan. Sesuatu dalam hidup Anda saat ini mungkin tidak seperti yang terlihat.", meaning: "Ada energi misterius yang menyelimuti harimu. Jangan terlalu cepat percaya pada apa yang tampak di permukaan. Ada pesan tersembunyi dalam mimpi atau firasatmu.", advice: "Berhentilah terlalu mengandalkan logika murni. Dengarkan firasat Anda. Jangan mengambil keputusan final sampai semua fakta benar-benar jelas.", affirmation: "Aku percaya pada proses kehidupan. Dalam ketidakpastian, aku menemukan kedamaian.", color: "Perak & Biru Malam", element: "Air" },
      en: { name: "The Moon", theme: "Intuition & Illusion", desc: "The Moon represents the subconscious, intuition, and things not yet revealed. Something in your life may not be as it seems.", meaning: "Mysterious energy surrounds your day. Don't trust appearances too quickly. Hidden messages exist in dreams or gut feelings.", advice: "Stop relying purely on logic. Listen to your gut feeling. Don't make final decisions until all facts are clear.", affirmation: "I trust the process of life. In uncertainty, I find peace.", color: "Silver & Night Blue", element: "Water" },
      es: { name: "La Luna", theme: "Intuición & Ilusión", desc: "La Luna representa el subconsciente, la intuición y las cosas aún no reveladas. Algo en tu vida puede no ser lo que parece.", meaning: "Una energía misteriosa envuelve tu día. No confíes demasiado en las apariencias. Hay mensajes ocultos en sueños o corazonadas.", advice: "Deja de confiar puramente en la lógica. Escucha tu instinto. No tomes decisiones finales hasta que todos los hechos estén claros.", affirmation: "Confío en el proceso de la vida. En la incertidumbre, encuentro paz.", color: "Plata & Azul Noche", element: "Agua" },
    },
  },
  {
    id: "FOOL",
    image: "/images/fool.png",
    gradientBg: "from-emerald-900/40 to-teal-950/30",
    data: {
      id: { name: "Sang Pengembara", theme: "Awal Baru & Lompatan Iman", desc: "Sebuah siklus baru berdiri tepat di hadapan Anda. Kartu ini muncul ketika Anda dituntut untuk melepaskan beban masa lalu dan berani mengambil langkah pertama menuju wilayah yang tak diketahui.", meaning: "Kamu berada di ambang petualangan baru. Jangan biarkan rasa takut akan kegagalan menghentikanmu. Dunia menanti keberanianmu.", advice: "Turunkan ego dan kembalilah menjadi 'pemula'. Lakukan satu tindakan spontan hari ini yang mendekatkan Anda pada impian terbesar Anda.", affirmation: "Aku berani memulai perjalanan baru. Setiap langkah adalah petualangan yang indah.", color: "Hijau & Emas", element: "Udara" },
      en: { name: "The Fool", theme: "New Beginnings & Leap of Faith", desc: "A new cycle stands right before you. This card appears when you must let go of past burdens and dare to step into uncharted territory.", meaning: "You are on the verge of a new adventure. Don't let fear of failure stop you. The world awaits your courage.", advice: "Lower your ego and become a 'beginner' again. Take one spontaneous action today that brings you closer to your dream.", affirmation: "I dare to begin a new journey. Every step is a beautiful adventure.", color: "Green & Gold", element: "Air" },
      es: { name: "El Loco", theme: "Nuevos Comienzos & Salto de Fe", desc: "Un nuevo ciclo está frente a ti. Esta carta aparece cuando debes soltar cargas pasadas y atreverte a entrar en territorio desconocido.", meaning: "Estás al borde de una nueva aventura. No dejes que el miedo te detenga. El mundo espera tu coraje.", advice: "Baja tu ego y vuelve a ser un 'principiante'. Toma una acción espontánea hoy que te acerque a tu sueño.", affirmation: "Me atrevo a comenzar un nuevo viaje. Cada paso es una aventura hermosa.", color: "Verde & Oro", element: "Aire" },
    },
  },
  {
    id: "TOWER",
    image: "/images/tower.png",
    gradientBg: "from-red-900/40 to-rose-950/30",
    data: {
      id: { name: "Sang Menara", theme: "Runtuhnya Ego & Pembebasan", desc: "Sesuatu yang selama ini Anda anggap sebagai fondasi yang aman sedang dirombak paksa oleh semesta. Ini bukan hukuman, melainkan pembebasan dari struktur usang.", meaning: "Perubahan besar akan terjadi. Sesuatu yang dipegang erat mungkin runtuh. Tapi setelah kehancuran selalu ada pembangunan yang lebih kokoh.", advice: "Jangan melawan arus keruntuhan ini. Biarkan ilusi hancur. Di atas puing-puing ini, Anda akan membangun realitas yang lebih autentik.", affirmation: "Aku melepaskan apa yang tidak lagi melayaniku. Dari reruntuhan, aku bangkit lebih kuat.", color: "Merah & Hitam", element: "Api" },
      en: { name: "The Tower", theme: "Collapse of Ego & Liberation", desc: "Something you considered a safe foundation is being forcibly dismantled. This is not punishment but liberation from outdated structures.", meaning: "Big change will occur. What you've held tightly may crumble. But after destruction, a stronger rebuild always follows.", advice: "Don't resist this collapse. Let illusions shatter. On these ruins, you will build a far more authentic reality.", affirmation: "I release what no longer serves me. From the rubble, I rise stronger.", color: "Red & Black", element: "Fire" },
      es: { name: "La Torre", theme: "Colapso del Ego & Liberación", desc: "Algo que considerabas un cimiento seguro está siendo desmantelado. No es castigo sino liberación de estructuras obsoletas.", meaning: "Un gran cambio ocurrirá. Aquello que has aferrado puede colapsar. Pero tras la destrucción, viene una reconstrucción más fuerte.", advice: "No resistas este colapso. Deja que las ilusiones se rompan. Sobre estas ruinas, construirás una realidad más auténtica.", affirmation: "Suelto lo que ya no me sirve. Entre los escombros, me levanto más fuerte.", color: "Rojo & Negro", element: "Fuego" },
    },
  },
  {
    id: "STAR",
    image: "/images/star.png",
    gradientBg: "from-cyan-900/40 to-blue-950/30",
    data: {
      id: { name: "Sang Bintang", theme: "Harapan & Penyembuhan", desc: "Setelah melewati masa melelahkan, Sang Bintang hadir membawa energi penyembuhan. Anda dibimbing kembali menuju kedamaian batin.", meaning: "Luka lama mulai mengering. Kamu akan menemukan harapan baru. Alam semesta mengirimkan pertolongan.", advice: "Izinkan diri Anda untuk bersikap rentan. Alam semesta memulihkan energi Anda. Tetaplah optimis, masa depan cerah telah digariskan.", affirmation: "Aku layak sembuh dan bahagia. Masa depanku cerah dan penuh harapan.", color: "Biru Langit & Perak", element: "Air" },
      en: { name: "The Star", theme: "Hope & Healing", desc: "After exhausting times, The Star brings healing energy. You are guided back to inner peace.", meaning: "Old wounds begin to dry. You will find new hope. The universe sends help.", advice: "Allow yourself to be vulnerable. The universe is restoring your energy. Stay optimistic, a brighter future is destined.", affirmation: "I deserve to heal and be happy. My future is bright and full of hope.", color: "Sky Blue & Silver", element: "Water" },
      es: { name: "La Estrella", theme: "Esperanza & Sanación", desc: "Tras tiempos agotadores, La Estrella trae energía sanadora. Te guían de vuelta a la paz interior.", meaning: "Las viejas heridas comienzan a secarse. Encontrarás nueva esperanza. El universo envía ayuda.", advice: "Permítete ser vulnerable. El universo está restaurando tu energía. Mantente optimista, un futuro brillante está destinado.", affirmation: "Merezco sanar y ser feliz. Mi futuro es brillante y lleno de esperanza.", color: "Azul Cielo & Plata", element: "Agua" },
    },
  },
  {
    id: "WHEEL",
    image: "/images/wheel.png",
    gradientBg: "from-purple-900/40 to-fuchsia-950/30",
    data: {
      id: { name: "Roda Semesta", theme: "Titik Balik Takdir", desc: "Roda nasib sedang berputar. Melambangkan keberuntungan tak terduga dan perubahan siklus.", meaning: "Ada titik balik dalam hidupmu. Bersiaplah untuk kejutan, baik menyenangkan maupun menantang.", advice: "Lepaskan kendali atas hal-hal di luar kapasitas Anda. Belajarlah beradaptasi dan mengalir bersama perubahan.", affirmation: "Aku mengalir bersama roda kehidupan. Setiap perubahan membawa berkah tersendiri.", color: "Ungu & Emas", element: "Tanah" },
      en: { name: "Wheel of Fortune", theme: "Turning Point of Destiny", desc: "The wheel of fate is turning. Signifies unexpected luck and cyclical change.", meaning: "A turning point in your life. Be ready for surprises, pleasant or challenging.", advice: "Release control over things beyond your capacity. Learn to adapt and flow with change.", affirmation: "I flow with the wheel of life. Every change brings its own blessing.", color: "Purple & Gold", element: "Earth" },
      es: { name: "Rueda de la Fortuna", theme: "Punto de Inflexión del Destino", desc: "La rueda del destino está girando. Significa suerte inesperada y cambio cíclico.", meaning: "Un punto de inflexión en tu vida. Prepárate para sorpresas, placenteras o desafiantes.", advice: "Suelta el control sobre lo que está fuera de tu capacidad. Aprende a adaptarte y fluir con el cambio.", affirmation: "Fluyo con la rueda de la vida. Cada cambio trae su propia bendición.", color: "Púrpura & Oro", element: "Tierra" },
    },
  },
{
    id: "HERMIT",
    image: "/images/hermit.png",
    gradientBg: "from-gray-900/60 to-slate-950/50",
    data: {
      id: { name: "Sang Pertapa", theme: "Pencarian Jiwa & Isolasi", desc: "Kebisingan dunia luar mulai meredam suara hati Anda. Sang Pertapa adalah panggilan untuk menarik diri sejenak dari interaksi sosial guna mencari jawaban yang hanya bisa ditemukan dalam keheningan.", meaning: "Kamu butuh waktu menyendiri untuk menemukan jawaban atas pertanyaan yang selama ini mengganggu. Dalam kesunyian, suara hatimu paling jelas terdengar.", advice: "Luangkan waktu untuk menyendiri, bermeditasi, atau menulis jurnal. Semua jawaban yang Anda cari sudah ada di dalam diri Anda.", affirmation: "Dalam keheningan, aku menemukan kebijaksanaan. Aku cukup tanpa validasi orang lain.", color: "Abu-abu & Putih", element: "Tanah" },
      en: { name: "The Hermit", theme: "Soul Searching & Isolation", desc: "The noise of the outside world is drowning your inner voice. The Hermit is a call to withdraw briefly from social interaction to find answers found only in silence.", meaning: "You need time alone to find answers to nagging questions. In silence, your inner voice is clearest.", advice: "Spend time alone, meditating or journaling. All the answers you seek are already within you.", affirmation: "In silence, I find wisdom. I am enough without others' validation.", color: "Gray & White", element: "Earth" },
      es: { name: "El Ermitaño", theme: "Búsqueda Interior & Aislamiento", desc: "El ruido del mundo exterior está ahogando tu voz interior. El Ermitaño es un llamado a retirarte brevemente de la interacción social para encontrar respuestas solo en el silencio.", meaning: "Necesitas tiempo a solas para encontrar respuestas a preguntas persistentes. En silencio, tu voz interior es más clara.", advice: "Pasa tiempo a solas, meditando o escribiendo un diario. Todas las respuestas que buscas ya están dentro de ti.", affirmation: "En el silencio, encuentro sabiduría. Soy suficiente sin la validación de otros.", color: "Gris & Blanco", element: "Tierra" },
    },
  },
  {
    id: "EMPRESS",
    image: "/images/empress.png",
    gradientBg: "from-pink-900/40 to-rose-950/30",
    data: {
      id: { name: "Sang Permaisuri", theme: "Kreativitas & Kesuburan", desc: "Energi penciptaan sedang mengalir deras dalam diri Anda. Ini adalah masa di mana proyek baru, ide bisnis, atau hubungan pribadi akan tumbuh subur dan memberikan hasil yang berlimpah.", meaning: "Kreativitasmu sedang mekar. Proyek yang kamu mulai akan membuahkan hasil. Hubungan asmara juga akan berkembang indah jika dirawat dengan cinta.", advice: "Berikan nutrisi pada ide-ide kreatif Anda. Sambut dunia dengan cinta kasih, rawat diri Anda, dan perhatikan estetika lingkungan.", affirmation: "Aku adalah pencipta. Aku melahirkan ide-ide indah dan merealisasikannya dengan cinta.", color: "Merah Muda & Hijau", element: "Tanah" },
      en: { name: "The Empress", theme: "Creativity & Fertility", desc: "Creative energy is flowing strongly within you. This is a time when new projects, business ideas, or personal relationships will thrive and yield abundant results.", meaning: "Your creativity is blooming. Projects you start will bear fruit. Romantic relationships will also flourish if nurtured with love.", advice: "Nurture your creative ideas. Greet the world with loving-kindness, practice self-care, and pay attention to your environment's aesthetics.", affirmation: "I am a creator. I give birth to beautiful ideas and realize them with love.", color: "Pink & Green", element: "Earth" },
      es: { name: "La Emperatriz", theme: "Creatividad & Fertilidad", desc: "La energía creativa fluye fuertemente dentro de ti. Es un momento en que nuevos proyectos, ideas de negocio o relaciones personales prosperarán y darán resultados.", meaning: "Tu creatividad está floreciendo. Los proyectos que inicies darán frutos. Las relaciones amorosas también florecerán si se cuidan con amor.", advice: "Nutre tus ideas creativas. Saluda al mundo con bondad amorosa, practica el autocuidado y presta atención a la estética de tu entorno.", affirmation: "Soy un creador. Doy a luz ideas hermosas y las realizo con amor.", color: "Rosa & Verde", element: "Tierra" },
    },
  },
  {
    id: "EMPEROR",
    image: "/images/emperor.png",
    gradientBg: "from-orange-900/40 to-red-950/30",
    data: {
      id: { name: "Sang Kaisar", theme: "Struktur & Otoritas", desc: "Kekacauan tidak lagi bisa ditoleransi. Sang Kaisar menuntut disiplin, struktur, dan aturan yang jelas. Anda dipanggil untuk mengambil peran kepemimpinan.", meaning: "Saatnya mengambil kendali. Kamu adalah raja atas hidupmu sendiri. Buat aturan, tetapkan batasan, dan jaga stabilitas.", advice: "Saatnya bersikap tegas dan rasional. Susun strategi jangka panjang, buat batasan yang tidak bisa diganggu gugat.", affirmation: "Aku memegang kendali atas hidupku. Aku pemimpin yang bijaksana dan bertanggung jawab.", color: "Merah & Emas", element: "Api" },
      en: { name: "The Emperor", theme: "Structure & Authority", desc: "Chaos can no longer be tolerated. The Emperor demands discipline, structure, and clear rules. You are called to take a leadership role.", meaning: "Time to take control. You are the king of your own life. Make rules, set boundaries, and maintain stability.", advice: "It's time to be firm and rational. Develop a long-term strategy, set non-negotiable boundaries.", affirmation: "I am in control of my life. I am a wise and responsible leader.", color: "Red & Gold", element: "Fire" },
      es: { name: "El Emperador", theme: "Estructura & Autoridad", desc: "El caos ya no se puede tolerar. El Emperador exige disciplina, estructura y reglas claras. Estás llamado a asumir un rol de liderazgo.", meaning: "Es momento de tomar el control. Eres el rey de tu propia vida. Haz reglas, establece límites y mantén la estabilidad.", advice: "Es momento de ser firme y racional. Desarrolla una estrategia a largo plazo, establece límites no negociables.", affirmation: "Tengo el control de mi vida. Soy un líder sabio y responsable.", color: "Rojo & Oro", element: "Fuego" },
    },
  },
  {
    id: "JUSTICE",
    image: "/images/justice.png",
    gradientBg: "from-yellow-900/40 to-amber-950/30",
    data: {
      id: { name: "Neraca Keadilan", theme: "Keseimbangan & Karma", desc: "Hukum sebab-akibat sedang bekerja. Kebenaran akan segera terungkap, dan segala tindakan di masa lalu akan menerima balasannya secara proporsional.", meaning: "Apa yang kamu tabur, itulah yang akan kamu tuai. Jika selama ini berbuat baik, kebaikan akan kembali. Jika sebaliknya, bersiaplah.", advice: "Timbang setiap keputusan dengan sangat rasional. Jangan biarkan bias perasaan mengaburkan fakta. Jika berbuat salah, akui.", affirmation: "Aku menerima hukum karma dengan lapang dada. Aku memilih tindakan yang baik dan adil.", color: "Kuning & Biru", element: "Udara" },
      en: { name: "Justice", theme: "Balance & Karma", desc: "The law of cause and effect is at work. Truth will soon be revealed, and all past actions will receive proportional consequences.", meaning: "You reap what you sow. If you have done good, good will return. If not, be ready.", advice: "Weigh every decision very rationally. Don't let emotional bias cloud facts. If you've done wrong, admit it.", affirmation: "I accept the law of karma with an open heart. I choose good and just actions.", color: "Yellow & Blue", element: "Air" },
      es: { name: "La Justicia", theme: "Equilibrio & Karma", desc: "La ley de causa y efecto está funcionando. La verdad pronto será revelada, y todas las acciones pasadas recibirán consecuencias.", meaning: "Cosechas lo que siembras. Si has hecho el bien, el bien regresará. Si no, prepárate.", advice: "Pesa cada decisión muy racionalmente. No dejes que el sesgo emocional nuble los hechos. Si has hecho mal, admítelo.", affirmation: "Acepto la ley del karma con el corazón abierto. Elijo acciones buenas y justas.", color: "Amarillo & Azul", element: "Aire" },
    },
  },
  {
    id: "DEATH",
    image: "/images/death.png",
    gradientBg: "from-slate-900/60 to-gray-950/50",
    data: {
      id: { name: "Transformasi", theme: "Akhir & Awal Baru", desc: "Jangan takut dengan nama kartu ini. Kematian di sini melambangkan berakhirnya sebuah fase untuk memberi ruang bagi fase baru yang lebih baik.", meaning: "Ada bagian dari dirimu atau hidupmu yang harus 'mati' agar kamu bisa bertumbuh. Lepaskan dengan ikhlas.", advice: "Identifikasi apa yang sudah tidak lagi melayanimu: kebiasaan buruk, hubungan yang merugikan. Lepaskan dengan keberanian.", affirmation: "Aku melepaskan masa lalu dengan cinta. Aku terbuka untuk transformasi dan kelahiran baru.", color: "Hitam & Ungu", element: "Air" },
      en: { name: "Transformation", theme: "Endings & New Beginnings", desc: "Don't fear this card's name. Death here symbolizes the end of a phase to make room for a better new phase.", meaning: "A part of you or your life must 'die' for you to grow. Release it sincerely.", advice: "Identify what no longer serves you: bad habits, harmful relationships. Let go with courage.", affirmation: "I release the past with love. I am open to transformation and rebirth.", color: "Black & Purple", element: "Water" },
      es: { name: "Transformación", theme: "Finales & Nuevos Comienzos", desc: "No temas el nombre de esta carta. La Muerte aquí simboliza el fin de una fase para hacer espacio a una nueva y mejor.", meaning: "Una parte de ti o de tu vida debe 'morir' para que crezcas. Suéltala sinceramente.", advice: "Identifica lo que ya no te sirve: malos hábitos, relaciones dañinas. Suelta con valentía.", affirmation: "Suelto el pasado con amor. Estoy abierto a la transformación y el renacimiento.", color: "Negro & Púrpura", element: "Agua" },
    },
  },
  {
    id: "LOVERS",
    image: "/images/lovers.png",
    gradientBg: "from-rose-900/40 to-pink-950/30",
    data: {
      id: { name: "Sang Kekasih", theme: "Pilihan & Komitmen", desc: "Kartu ini melambangkan pilihan penting dalam hubungan, baik dengan pasangan, keluarga, atau diri sendiri. Ada persimpangan jalan yang mengharuskanmu memilih dari hati.", meaning: "Kamu dihadapkan pada pilihan yang sulit. Ikuti kata hatimu, bukan logika semata. Pilihan yang tepat akan membawa kebahagiaan.", advice: "Jangan biarkan tekanan eksternal mempengaruhi keputusanmu. Tanyakan pada hati: apa yang benar-benar membuatmu bahagia?", affirmation: "Aku memilih dengan cinta dan kebijaksanaan. Setiap pilihan adalah langkah menuju pertumbuhan.", color: "Merah Muda & Ungu", element: "Udara" },
      en: { name: "The Lovers", theme: "Choice & Commitment", desc: "This card symbolizes an important choice in relationships, whether with a partner, family, or yourself. A crossroads requires you to choose from the heart.", meaning: "You are faced with a difficult choice. Follow your heart, not pure logic. The right choice will bring happiness.", advice: "Don't let external pressure influence your decision. Ask your heart: what truly makes you happy?", affirmation: "I choose with love and wisdom. Every choice is a step toward growth.", color: "Pink & Purple", element: "Air" },
      es: { name: "Los Amantes", theme: "Elección & Compromiso", desc: "Esta carta simboliza una elección importante en relaciones, ya sea con pareja, familia o uno mismo. Una encrucijada requiere que elijas desde el corazón.", meaning: "Te enfrentas a una elección difícil. Sigue tu corazón, no la lógica pura. La elección correcta traerá felicidad.", advice: "No dejes que la presión externa influya en tu decisión. Pregunta a tu corazón: ¿qué te hace realmente feliz?", affirmation: "Elijo con amor y sabiduría. Cada elección es un paso hacia el crecimiento.", color: "Rosa & Púrpura", element: "Aire" },
    },
  },
];
// ========== KOMPONEN UTAMA ==========
export default function DestinyCard({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [isDrawing, setIsDrawing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [drawnCard, setDrawnCard] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  // Data kartu dalam bahasa yang dipilih
  const cardData = useMemo(() => {
    if (!drawnCard) return null;
    return drawnCard.data[activeLang] || drawnCard.data["id"];
  }, [drawnCard, activeLang]);

  const handleDrawCard = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsFlipped(false);
    setAnalyzed(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * DESTINY_CARDS_ML.length);
      const card = DESTINY_CARDS_ML[randomIndex];
      setDrawnCard(card);
      
      // Update history (simpan full object untuk multi-language)
      setHistory(prev => {
        const newHistory = [card, ...prev].slice(0, 3);
        return newHistory;
      });

      setTimeout(() => {
        setIsFlipped(true);
        setIsDrawing(false);
        setAnalyzed(true);

        // Confetti untuk kartu positif
        const positiveIds = ["SUN", "STAR", "WHEEL", "EMPRESS", "LOVERS"];
        if (positiveIds.includes(card.id)) {
          import("canvas-confetti").then((mod) => {
            mod.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          }).catch(() => {});
        }
      }, 600);
    }, 1500);
  };

  const handleShare = async () => {
    if (!cardData) return;
    const text = `✨ ${dict.title} ✨\n\n[ ${cardData.name} ]\n${dict.labels.theme}: ${cardData.theme}\n\n${cardData.advice.substring(0, 100)}...\n\n${dict.labels.affirmation}: “${cardData.affirmation}”\n\n${dict.disclaimer}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: dict.title, text }); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Disalin ke clipboard!");
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }
    }
  };

  const resetAndDrawAgain = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setDrawnCard(null);
      setAnalyzed(false);
      handleDrawCard();
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto text-white font-sans px-4 py-8">
      {/* Header with badge & share */}
      <div className="text-center mb-10 relative">
        <div className="text-6xl mb-4 drop-shadow-2xl">🃏✨</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}
        </h2>
        <div className="mt-2 mb-3">
          <span className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white uppercase shadow-lg">
            {dict.badge}
          </span>
        </div>
        <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          {dict.subtitle}
        </p>
        
        
      </div>

      {/* Arena Kartu 3D dengan Gambar Asli */}
      <div className="flex justify-center perspective-1000 my-8 h-[380px] md:h-[450px]">
        <div
          className={`relative w-64 md:w-[300px] h-full transition-all duration-700 transform-style-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          } ${isDrawing ? "animate-shake" : "hover:scale-105"}`}
          onClick={!isDrawing && !isFlipped ? handleDrawCard : undefined}
        >
          {/* SISI BELAKANG (back.png) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)] border-2 border-purple-500/30 group">
            <img 
              src="/images/back.png" 
              alt="Back of Card" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            {!isDrawing && !isFlipped && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] font-bold text-purple-300 uppercase tracking-widest animate-pulse border border-purple-500/50">
                  {dict.flipHint}
                </div>
              </div>
            )}
            {isDrawing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-xs font-bold text-purple-300 animate-pulse tracking-widest uppercase">
                  {dict.drawingText}
                </span>
              </div>
            )}
          </div>

          {/* SISI DEPAN (Gambar Kartu Spesifik) */}
          {drawnCard && cardData && (
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden border border-white/20">
              {/* Gambar Utama (Cover Penuh) */}
              <img 
                src={drawnCard.image} 
                alt={cardData.name} 
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay dari bawah ke atas agar teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="text-center transform translate-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-1">{cardData.name}</h3>
                  <p className="text-[11px] font-bold text-amber-300 uppercase tracking-widest drop-shadow-md">
                    {cardData.theme}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state sebelum tarikan pertama */}
      {!analyzed && !isDrawing && !drawnCard && (
        <div className="mt-8 text-center p-6 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-sm max-w-md mx-auto">
          <p className="text-slate-300 text-sm font-medium">{dict.emptyMessage}</p>
        </div>
      )}
{/* Hasil setelah kartu terbuka */}
      {!isDrawing && analyzed && drawnCard && cardData && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* Main Card Info (Detail Utama) */}
          <div className={`relative overflow-hidden bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br ${drawnCard.gradientBg}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Thumbnail Gambar di Samping Teks */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg border border-white/20 shrink-0">
                  <img 
                    src={drawnCard.image} 
                    alt={cardData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <p className="text-purple-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1.5">
                    {dict.labels.theme}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent pb-1">
                    {cardData.theme}
                  </h3>
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed mt-4">
                    {cardData.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Grid: Makna, Petunjuk, Afirmasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-lg hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl drop-shadow-md">📖</span>
                <h4 className="font-bold text-lg text-purple-200 uppercase tracking-widest text-[11px]">{dict.labels.meaning}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{cardData.meaning}</p>
            </div>
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-lg hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl drop-shadow-md">✨</span>
                <h4 className="font-bold text-lg text-emerald-300 uppercase tracking-widest text-[11px]">{dict.labels.advice}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{cardData.advice}</p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-6 md:col-span-2 shadow-lg">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <span className="text-2xl drop-shadow-md">🌟</span>
                <h4 className="font-bold text-lg text-amber-300 uppercase tracking-widest text-[11px]">{dict.labels.affirmation}</h4>
              </div>
              <p className="text-amber-200/90 text-base md:text-lg font-medium italic leading-relaxed text-center md:text-left">
                “{cardData.affirmation}”
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner flex flex-col justify-center">
              <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">{dict.labels.color}</p>
              <p className="text-slate-200 font-semibold">{cardData.color}</p>
            </div>
            
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner flex flex-col justify-center">
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">{dict.labels.element}</p>
              <p className="text-slate-200 font-semibold">{cardData.element}</p>
            </div>
          </div>

          {/* Tombol Aksi Tarik Ulang */}
          <div className="flex justify-center mt-6">
            <button
              onClick={resetAndDrawAgain}
              className="w-full md:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              {dict.drawAgain}
            </button>
          </div>
        </div>
      )}

      {/* Riwayat 3 Kartu Terakhir (Dengan Gambar Asli) */}
      {history.length > 0 && !isDrawing && (
        <div className="mt-10 p-5 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm max-w-md mx-auto">
          <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mb-4">
            {dict.historyLabel}
          </p>
          <div className="flex justify-center gap-4">
            {history.map((card, idx) => {
              const cardLangData = card.data[activeLang] || card.data["id"];
              return (
                <div key={idx} className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-lg bg-black flex items-center justify-center">
                    <img 
                      src={card.image} 
                      alt={cardLangData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-slate-300 mt-2 truncate max-w-[70px] uppercase tracking-wider">
                    {cardLangData.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quote & Disclaimer */}
      <div className="mt-8 text-center p-5 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 max-w-2xl mx-auto">
        <p className="text-purple-200 text-sm font-medium italic">
          {dict.quote}
        </p>
      </div>
      
      <div className="text-center text-[10px] text-slate-500 pt-5 mt-6 opacity-70 border-t border-slate-800/50 max-w-2xl mx-auto leading-relaxed">
        {dict.disclaimer}
      </div>

{drawnCard && (
  
            <div className="flex justify-center mt-6 mb-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleShare} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-all active:scale-95 gap-2"
              >
                📤 {dict.shareBtn || "Bagikan Hasil"}
              </button>
            </div>
            <PremiumPaywall 
    toolName="Kartu Takdir Semesta" 
    resultId={drawnCard.id} 
  />
)}
      {/* GLOBAL CSS UNTUK ANIMASI 3D & SHAKE */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-4px) rotate(-2deg); }
          75% { transform: translateX(4px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}