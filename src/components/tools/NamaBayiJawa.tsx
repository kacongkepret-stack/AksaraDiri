"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== STRICT INTERFACES ==========
type Gender = "L" | "P";

interface BabyName {
  id: number;
  nama: string;
  gender: Gender;
  arti: string;
  filosofi: string;
  harapan: string;
  asal: string;
  wetonCocok?: string[];
}

// ========== KAMUS UI (3 BAHASA) ==========
const UI_DICT: Record<string, any> = {
  id: {
    title: "Katalog Nama Bayi Jawa",
    subtitle: "Temukan nama bermakna filosofis dari tradisi luhur Jawa yang sarat doa dan harapan untuk si buah hati.",
    searchLbl: "Pencarian", searchPh: "Ketik nama atau arti...",
    genderLbl: "Gender", genderAll: "-- Semua Gender --", male: "👦 Laki-laki", female: "👧 Perempuan",
    listTitle: "Daftar Nama", found: "ditemukan",
    emptyTitle: "Katalog nama tidak menemukan kecocokan.", emptyDesc: "Silakan sesuaikan kata kunci pencarian atau filter gender Anda.",
    modalArti: "Arti Nama", modalFilosofi: "Makna Filosofis", modalHarapan: "Doa & Harapan", modalWeton: "Resonansi Weton Optimal",
    shareBtn: "📤 BAGIKAN NAMA INI", sharePrefix: "✨ Rekomendasi Nama Bayi Jawa:", shareSuffix: "Cari inspirasi nama bayi di AksaraDiri!",
    copied: "Detail nama berhasil disalin ke clipboard!", copyFailed: "Gagal menyalin. Silakan copy secara manual.",
    genderMale: "Laki-laki", genderFemale: "Perempuan"
  },
  en: {
    title: "Javanese Baby Names",
    subtitle: "Find philosophically meaningful names from noble Javanese traditions, full of prayers and hopes for your little one.",
    searchLbl: "Search", searchPh: "Type name or meaning...",
    genderLbl: "Gender", genderAll: "-- All Genders --", male: "👦 Male", female: "👧 Female",
    listTitle: "Name List", found: "found",
    emptyTitle: "No matching names found in the catalog.", emptyDesc: "Please adjust your search keywords or gender filter.",
    modalArti: "Name Meaning", modalFilosofi: "Philosophical Meaning", modalHarapan: "Prayer & Hope", modalWeton: "Optimal Weton Resonance",
    shareBtn: "📤 SHARE THIS NAME", sharePrefix: "✨ Javanese Baby Name Recommendation:", shareSuffix: "Find name inspiration at AksaraDiri!",
    copied: "Name details copied to clipboard!", copyFailed: "Failed to copy. Please copy manually.",
    genderMale: "Male", genderFemale: "Female"
  },
  es: {
    title: "Nombres de Bebé Javaneses",
    subtitle: "Encuentra nombres con significado filosófico de las nobles tradiciones javanesas, llenos de esperanza para tu pequeño.",
    searchLbl: "Buscar", searchPh: "Escribe nombre o significado...",
    genderLbl: "Género", genderAll: "-- Todos los Géneros --", male: "👦 Masculino", female: "👧 Femenino",
    listTitle: "Lista de Nombres", found: "encontrado",
    emptyTitle: "No se encontraron nombres coincidentes.", emptyDesc: "Ajusta tus palabras clave de búsqueda o el filtro de género.",
    modalArti: "Significado", modalFilosofi: "Significado Filosófico", modalHarapan: "Oración y Esperanza", modalWeton: "Resonancia Weton Óptima",
    shareBtn: "📤 COMPARTIR ESTE NOMBRE", sharePrefix: "✨ Recomendación de Nombre Javanés:", shareSuffix: "¡Encuentra inspiración en AksaraDiri!",
    copied: "¡Detalles copiados al portapapeles!", copyFailed: "Error al copiar. Por favor, copia manualmente.",
    genderMale: "Masculino", genderFemale: "Femenino"
  }
};

// ==========================================
// PART 1B: DATABASE NAMA BAHASA INDONESIA (ID)
// ==========================================
const NAMA_JAWA_ID: BabyName[] = [
  { id: 1, nama: "Arjuna", gender: "L", arti: "Bersinar, putih, suci", filosofi: "Tokoh wayang yang bijaksana, kuat, dan setia. Melambangkan kesatria sejati.", harapan: "Menjadi pribadi yang gagah berani, jujur, dan berbudi luhur.", asal: "Mahabharata", wetonCocok: ["Selasa Legi", "Kamis Pahing"] },
  { id: 2, nama: "Bima", gender: "L", arti: "Besar, kuat, teguh", filosofi: "Pendekar tangguh dengan kekuatan fisik dan mental. Tidak kenal takut.", harapan: "Memiliki keteguhan hati dan keberanian membela kebenaran.", asal: "Mahabharata", wetonCocok: ["Selasa Kliwon", "Jumat Wage"] },
  { id: 3, nama: "Cahyo", gender: "L", arti: "Cahaya, terang", filosofi: "Penerang dalam kegelapan, membawa kehangatan bagi keluarga.", harapan: "Menjadi sumber kebahagiaan dan petunjuk bagi orang sekitar.", asal: "Jawa Kuna" },
  { id: 4, nama: "Danendra", gender: "L", arti: "Pemilik kekayaan", filosofi: "Kemakmuran lahir batin, kemampuan mengelola harta dengan bijak.", harapan: "Sukses dalam karier dan mampu membahagiakan orang tua.", asal: "Sansekerta-Jawa" },
  { id: 5, nama: "Eka", gender: "L", arti: "Satu, pertama", filosofi: "Anak pertama yang menjadi panutan adik-adiknya.", harapan: "Menjadi pemimpin dan pelindung keluarga.", asal: "Jawa Kuna" },
  { id: 6, nama: "Fajar", gender: "L", arti: "Subuh, awal terang", filosofi: "Permulaan yang penuh harapan, semangat baru setiap hari.", harapan: "Rajin dan optimis dalam menjalani hidup.", asal: "Jawa Modern" },
  { id: 7, nama: "Gatotkaca", gender: "L", arti: "Bertulang besi", filosofi: "Kesatria sakti yang tak terkalahkan. Simbol kekuatan luar biasa.", harapan: "Sehat, kuat, dan pemberani.", asal: "Wayang", wetonCocok: ["Selasa Pon", "Kamis Legi"] },
  { id: 8, nama: "Hardi", gender: "L", arti: "Keras, tegar", filosofi: "Mental baja yang tidak mudah menyerah pada kesulitan.", harapan: "Pantang mundur dalam meraih cita-cita.", asal: "Jawa Kuna" },
  { id: 9, nama: "Indra", gender: "L", arti: "Dewa tertinggi", filosofi: "Kepemimpinan dan kewibawaan. Raja para dewa.", harapan: "Menjadi pemimpin yang adil dan bijaksana.", asal: "Sansekerta" },
  { id: 10, nama: "Jaka", gender: "L", arti: "Pemuda, bujang", filosofi: "Simbol masa muda yang penuh energi dan potensi.", harapan: "Tumbuh menjadi pria dewasa yang bertanggung jawab.", asal: "Jawa Kuna" },
  { id: 11, nama: "Kusuma", gender: "L", arti: "Bunga", filosofi: "Keindahan hati dan ketulusan.", harapan: "Dikenang karena kebaikannya.", asal: "Sansekerta" },
  { id: 12, nama: "Langgeng", gender: "L", arti: "Abadi, kekal", filosofi: "Keharmonisan yang bertahan sepanjang masa.", harapan: "Hubungan keluarga selalu rukun dan bahagia.", asal: "Jawa Kuna" },
  { id: 13, nama: "Mahesa", gender: "L", arti: "Kerbau jantan", filosofi: "Kekuatan dan ketabahan. Bekerja keras tanpa kenal lelah.", harapan: "Rajin dan ulet dalam bekerja.", asal: "Jawa Kuna" },
  { id: 14, nama: "Narendra", gender: "L", arti: "Raja manusia", filosofi: "Kepemimpinan yang mengayomi, bukan menindas.", harapan: "Jadi pemimpin yang dicintai rakyat.", asal: "Sansekerta" },
  { id: 15, nama: "Prasetyo", gender: "L", arti: "Janji, komitmen", filosofi: "Kesetiaan pada kata hati dan tanggung jawab.", harapan: "Menjadi pribadi yang bisa dipegang janjinya.", asal: "Jawa Kuna" },
  { id: 16, nama: "Ragil", gender: "L", arti: "Bungsu, anak terakhir", filosofi: "Buah hati penutup yang membawa kebahagiaan tersendiri.", harapan: "Disayang keluarga dan membawa berkah.", asal: "Jawa Kuna" },
  { id: 17, nama: "Sapta", gender: "L", arti: "Tujuh", filosofi: "Angka keramat. Keseimbangan antara dunia dan akhirat.", harapan: "Hidup seimbang dan penuh makna.", asal: "Sansekerta" },
  { id: 18, nama: "Teguh", gender: "L", arti: "Kokoh, kuat", filosofi: "Pendirian yang tidak goyah oleh godaan apa pun.", harapan: "Konsisten dalam kebenaran.", asal: "Jawa Kuna" },
  { id: 19, nama: "Umar", gender: "L", arti: "Umur, kehidupan", filosofi: "Panjang umur dan berkah.", harapan: "Diberi kesehatan dan umur panjang.", asal: "Jawa Islam" },
  { id: 20, nama: "Wicaksono", gender: "L", arti: "Bijaksana", filosofi: "Kemampuan berpikir jernih dan mengambil keputusan tepat.", harapan: "Menjadi orang yang arif dan disegani.", asal: "Jawa Kuna" },
  { id: 21, nama: "Yudhistira", gender: "L", arti: "Teguh dalam perang", filosofi: "Raja yang adil, jujur, dan bijaksana.", harapan: "Selalu di jalan kebenaran.", asal: "Mahabharata", wetonCocok: ["Rabu Wage", "Jumat Legi"] },
  { id: 22, nama: "Zain", gender: "L", arti: "Indah, bagus", filosofi: "Keindahan lahir batin.", harapan: "Berkepribadian menarik dan baik hati.", asal: "Jawa Islam" },
  { id: 23, nama: "Ayu", gender: "P", arti: "Cantik, molek", filosofi: "Kecantikan yang terpancar dari hati.", harapan: "Menjadi pribadi yang menawan dan berbudi luhur.", asal: "Jawa Kuna" },
  { id: 24, nama: "Bulan", gender: "P", arti: "Bulan", filosofi: "Penerang malam, sumber ketenangan.", harapan: "Membawa kedamaian bagi keluarga.", asal: "Jawa Kuna" },
  { id: 25, nama: "Citra", gender: "P", arti: "Gambaran, imej", filosofi: "Wanita yang menjadi teladan.", harapan: "Menjadi contoh baik bagi lingkungan.", asal: "Sansekerta" },
  { id: 26, nama: "Dewi", gender: "P", arti: "Dewi, bidadari", filosofi: "Kecantikan surgawi dan keanggunan.", harapan: "Menjadi wanita yang dimuliakan.", asal: "Sansekerta" },
  { id: 27, nama: "Endah", gender: "P", arti: "Indah", filosofi: "Keindahan yang sederhana namun memikat.", harapan: "Selalu bersyukur dan rendah hati.", asal: "Jawa Kuna" },
  { id: 28, nama: "Fitri", gender: "P", arti: "Suci, alami", filosofi: "Kesucian hati seperti anak baru lahir.", harapan: "Terhindar dari dosa dan selalu dalam lindungan Tuhan.", asal: "Jawa Islam" },
  { id: 29, nama: "Gita", gender: "P", arti: "Lagu, nyanyian", filosofi: "Kebahagiaan yang mengalir lewat kata-kata.", harapan: "Pandai menenangkan hati orang lain.", asal: "Sansekerta" },
  { id: 30, nama: "Harum", gender: "P", arti: "Wangian", filosofi: "Nama harum yang dikenang baik.", harapan: "Dikenang karena kebaikannya.", asal: "Jawa Kuna" },
  { id: 31, nama: "Indah", gender: "P", arti: "Cantik", filosofi: "Kecantikan lahir dan batin.", harapan: "Menjadi perhiasan keluarga.", asal: "Jawa Kuna" },
  { id: 32, nama: "Jamilah", gender: "P", arti: "Cantik", filosofi: "Keindahan yang menenangkan.", harapan: "Dicintai banyak orang karena budi pekertinya.", asal: "Jawa Islam" },
  { id: 33, nama: "Kartini", gender: "P", arti: "Pahlawan wanita", filosofi: "Emansipasi dan perjuangan untuk kesetaraan.", harapan: "Cerdas dan berani menyuarakan kebenaran.", asal: "Jawa Modern" },
  { id: 34, nama: "Laras", gender: "P", arti: "Selaras, harmonis", filosofi: "Kemampuan menjalin hubungan yang serasi.", harapan: "Cakap dalam berkomunikasi dan bersosialisasi.", asal: "Jawa Kuna" },
  { id: 35, nama: "Mawar", gender: "P", arti: "Bunga mawar", filosofi: "Keindahan dengan duri, tegas namun lembut.", harapan: "Tangguh dalam menghadapi tantangan.", asal: "Jawa Modern" },
  { id: 36, nama: "Ningrum", gender: "P", arti: "Yang tercinta", filosofi: "Anak yang sangat disayang keluarga.", harapan: "Membawa kehangatan di rumah.", asal: "Jawa Kuna" },
  { id: 37, nama: "Puspa", gender: "P", arti: "Bunga", filosofi: "Keharuman nama dan ketulusan hati.", harapan: "Memberi manfaat bagi banyak orang.", asal: "Sansekerta" },
  { id: 38, nama: "Ratri", gender: "P", arti: "Malam", filosofi: "Ketenangan dan kedalaman batin.", harapan: "Pandai merenung dan introspeksi.", asal: "Sansekerta" },
  { id: 39, nama: "Sari", gender: "P", arti: "Inti, esensi", filosofi: "Wanita yang menjadi inti keluarga.", harapan: "Menjadi pusat kasih sayang.", asal: "Jawa Kuna" },
  { id: 40, nama: "Tresna", gender: "P", arti: "Cinta", filosofi: "Cinta yang tulus dan abadi.", harapan: "Menyebarkan cinta di sekitarnya.", asal: "Jawa Kuna" },
  { id: 41, nama: "Utami", gender: "P", arti: "Utama, terbaik", filosofi: "Wanita berkelas dan bermartabat.", harapan: "Menjadi kebanggaan keluarga.", asal: "Jawa Kuna" },
  { id: 42, nama: "Wati", gender: "P", arti: "Wanita", filosofi: "Perempuan yang tangguh dan sabar.", harapan: "Teladan dalam kesabaran.", asal: "Jawa Kuna" },
  { id: 43, nama: "Yanti", gender: "P", arti: "Perempuan mulia", filosofi: "Derajat yang tinggi di mata Tuhan.", harapan: "Selalu dalam kebaikan.", asal: "Jawa Islam" },
  { id: 44, nama: "Zahra", gender: "P", arti: "Bunga, berseri", filosofi: "Wajah berseri-seri membawa kebahagiaan.", harapan: "Menjadi penyejuk hati orang tua.", asal: "Jawa Islam" },
  { id: 45, nama: "Anggit", gender: "L", arti: "Karya, ciptaan", filosofi: "Pencipta dan inovator.", harapan: "Banyak berkarya untuk bangsa.", asal: "Jawa Kuna" },
  { id: 46, nama: "Bayu", gender: "L", arti: "Angin", filosofi: "Kebebasan dan kecepatan.", harapan: "Lincah dan gesit dalam berpikir.", asal: "Jawa Kuna" },
  { id: 47, nama: "Candra", gender: "L", arti: "Bulan", filosofi: "Penerang dalam gelap.", harapan: "Memberi petunjuk bagi sesama.", asal: "Sansekerta" },
  { id: 48, nama: "Darma", gender: "L", arti: "Kebenaran", filosofi: "Kewajiban dan kebajikan.", harapan: "Menjunjung tinggi kebenaran.", asal: "Sansekerta" },
  { id: 49, nama: "Elok", gender: "P", arti: "Cantik", filosofi: "Paras yang menawan.", harapan: "Selalu dikelilingi kebaikan.", asal: "Jawa Kuna" },
  { id: 50, nama: "Galuh", gender: "P", arti: "Permata", filosofi: "Berharga dan tak ternilai.", harapan: "Dihargai orang lain.", asal: "Jawa Kuna" },
  { id: 51, nama: "Hastono", gender: "L", arti: "Tangan kanan", filosofi: "Andalan dan kepercayaan.", harapan: "Jadi orang yang bisa diandalkan.", asal: "Jawa Kuna" },
  { id: 52, nama: "Intan", gender: "P", arti: "Berlian", filosofi: "Keras namun berkilau.", harapan: "Teguh pendirian namun baik hati.", asal: "Jawa Kuna" },
  { id: 53, nama: "Jatmiko", gender: "L", arti: "Terpuji", filosofi: "Berkelakuan baik.", harapan: "Dicintai masyarakat.", asal: "Jawa Kuna" },
  { id: 54, nama: "Kenanga", gender: "P", arti: "Bunga kenanga", filosofi: "Wangian yang menyegarkan.", harapan: "Menyebarkan aroma kebaikan.", asal: "Jawa Kuna" },
  { id: 55, nama: "Lukita", gender: "P", arti: "Seni, tulisan", filosofi: "Kreativitas dan ekspresi.", harapan: "Berbakat seni dan sastra.", asal: "Sansekerta" },
  { id: 56, nama: "Abimanyu", gender: "L", arti: "Berani, tidak takut kesulitan", filosofi: "Kesatria termuda yang gugur dengan gagah berani di Bharatayuddha. Simbol keberanian absolut.", harapan: "Menjadi pria yang berani memperjuangkan kebenaran meski di tengah kesulitan besar.", asal: "Mahabharata", wetonCocok: ["Senin Pahing", "Selasa Legi"] },
  { id: 57, nama: "Aditya", gender: "L", arti: "Matahari", filosofi: "Pusat tata surya yang menyinari tanpa diskriminasi. Simbol pencerahan dan energi.", harapan: "Mampu menjadi penerang dan sumber inspirasi bagi lingkungan sekitarnya.", asal: "Sansekerta-Jawa" },
  { id: 58, nama: "Bagas", gender: "L", arti: "Sehat, kuat, dan tegap", filosofi: "Kekuatan fisik yang merepresentasikan kekuatan fondasi batin dalam menghadapi arus kehidupan.", harapan: "Tumbuh sehat walafiat, tegar, dan menjadi sandaran keluarga.", asal: "Jawa Kuna", wetonCocok: ["Rabu Pon", "Kamis Kliwon"] },
  { id: 59, nama: "Baskara", gender: "L", arti: "Matahari yang bersinar terang", filosofi: "Cahaya kehidupan yang mengusir kegelapan kebodohan dan kemiskinan.", harapan: "Menjadi sosok yang sukses, berilmu tinggi, dan mencerahkan.", asal: "Kawi/Jawa" },
  { id: 60, nama: "Cakra", gender: "L", arti: "Roda, senjata pusaka", filosofi: "Senjata sakti Prabu Kresna. Melambangkan putaran takdir dan keadilan yang tajam.", harapan: "Mampu membedakan yang benar dan salah serta menegakkan keadilan.", asal: "Sansekerta-Wayang" },
  { id: 61, nama: "Damar", gender: "L", arti: "Lampu, penerang", filosofi: "Meski kecil, nyala api damar sanggup mengusir gelapnya malam. Simbol harapan di masa krisis.", harapan: "Menjadi anak yang solutif dan senantiasa membawa secercah harapan.", asal: "Jawa Tradisional" },
  { id: 62, nama: "Danu", gender: "L", arti: "Busur panah, air", filosofi: "Tergantung tarikannya, panah bisa melesat cepat mencapai target. Simbol fokus dan ketenangan air.", harapan: "Memiliki cita-cita tinggi dan fokus tajam dalam meraihnya.", asal: "Jawa Kuna" },
  { id: 63, nama: "Dimas", gender: "L", arti: "Adik laki-laki kesayangan", filosofi: "Panggilan kasih sayang untuk pria muda yang dihormati namun tetap membumi.", harapan: "Menjadi anak yang disayangi semua orang dan rendah hati.", asal: "Jawa Modern" },
  { id: 64, nama: "Dirga", gender: "L", arti: "Udara, langit yang luas", filosofi: "Kebebasan tanpa batas, pemikiran yang terbuka dan visi yang jauh ke depan.", harapan: "Memiliki wawasan luas dan tidak picik dalam berpikir.", asal: "Sansekerta-Jawa" },
  { id: 65, nama: "Galang", gender: "L", arti: "Membuat, mendirikan", filosofi: "Pembangun fondasi. Merepresentasikan semangat gotong royong dan kemauan keras.", harapan: "Mampu membangun masa depan yang solid dan mandiri.", asal: "Jawa Kawi" },
  { id: 66, nama: "Gilang", gender: "L", arti: "Bercahaya sangat terang", filosofi: "Batu mulia yang bersinar setelah digosok keras. Sukses berkat tempaan hidup.", harapan: "Memiliki masa depan yang cemerlang dan dihormati.", asal: "Jawa" },
  { id: 67, nama: "Gunawan", gender: "L", arti: "Laki-laki yang berguna/mulia", filosofi: "Kekayaan sesungguhnya adalah seberapa besar manfaat seseorang bagi orang lain.", harapan: "Menjadi pribadi yang bermanfaat bagi agama, bangsa, dan keluarga.", asal: "Jawa Kuna" },
  { id: 68, nama: "Handoko", gender: "L", arti: "Pemimpin yang membawa kehormatan", filosofi: "Integritas moral yang dipegang teguh melebihi harta benda.", harapan: "Sukses dalam karir dan selalu menjaga nama baik keluarga.", asal: "Jawa Ningrat", wetonCocok: ["Jumat Kliwon", "Sabtu Legi"] },
  { id: 69, nama: "Haryo", gender: "L", arti: "Mulia, berdarah biru", filosofi: "Kehormatan sejati bukan dari keturunan, melainkan dari budi pekerti yang luhur.", harapan: "Menjadi pria yang elegan, santun, dan berbudi tinggi.", asal: "Jawa Ningrat" },
  { id: 70, nama: "Jati", gender: "L", arti: "Pohon jati, esensi/kebenaran sejati", filosofi: "Kayu yang semakin tua semakin kuat dan bernilai. Integritas yang tak lapuk.", harapan: "Berpendirian teguh, tidak mudah terpengaruh pergaulan buruk.", asal: "Jawa Tradisional" },
  { id: 71, nama: "Kresna", gender: "L", arti: "Hitam, nama raja bijaksana", filosofi: "Ahli strategi ulung dalam Mahabharata, pembisik jalan kebenaran.", harapan: "Tumbuh menjadi pemikir strategis, cerdas, dan bijaksana.", asal: "Wayang", wetonCocok: ["Kamis Pahing", "Minggu Wage"] },
  { id: 72, nama: "Lintang", gender: "L", arti: "Bintang di langit", filosofi: "Meskipun jauh, sinarnya mampu menjadi penunjuk arah bagi para pelaut di malam hari.", harapan: "Menjadi sosok inspiratif dan petunjuk jalan bagi sesama.", asal: "Jawa Kuno" },
  { id: 73, nama: "Luhur", gender: "L", arti: "Tinggi, mulia", filosofi: "Derajat spiritual dan moral yang melampaui kedudukan duniawi.", harapan: "Berbudi pekerti mulia dan menjauhi perbuatan hina.", asal: "Jawa Kawi" },
  { id: 74, nama: "Manggala", gender: "L", arti: "Panglima, komandan", filosofi: "Berada di garis depan untuk melindungi yang lemah dan memimpin pasukan.", harapan: "Memiliki jiwa kepemimpinan yang protektif dan tangguh.", asal: "Jawa Kuna" },
  { id: 75, nama: "Nugroho", gender: "L", arti: "Anugerah Tuhan, pemberian", filosofi: "Kehadirannya adalah hadiah terbesar yang patut disyukuri dan dijaga.", harapan: "Menjadi berkah dan pembawa rejeki bagi keluarga.", asal: "Jawa Modern" },
  { id: 76, nama: "Pandu", gender: "L", arti: "Penunjuk jalan", filosofi: "Ayah dari para Pandawa. Simbol kebijaksanaan dan pengorbanan demi keadilan.", harapan: "Menjadi pelopor kebaikan dan sosok ayah yang ideal di masa depan.", asal: "Mahabharata" },
  { id: 77, nama: "Panji", gender: "L", arti: "Bendera, lambang kebesaran", filosofi: "Tokoh ksatria berwajah tampan penakluk kesulitan. Simbol harga diri.", harapan: "Menjadi pria yang dihormati, tampan rupa, dan baik hatinya.", asal: "Kisah Panji Jawa" },
  { id: 78, nama: "Permana", gender: "L", arti: "Mengetahui dengan jelas, waspada", filosofi: "Ketajaman mata batin dalam melihat potensi bahaya dan peluang.", harapan: "Tumbuh menjadi orang yang waspada, cerdas, dan teliti.", asal: "Jawa Kawi" },
  { id: 79, nama: "Raden", gender: "L", arti: "Gelar kebangsawanan", filosofi: "Bukan sekadar gelar, namun menuntut tanggung jawab sosial yang besar.", harapan: "Berperilaku bak bangsawan yang mengayomi, bukan menindas.", asal: "Jawa Keraton" },
  { id: 80, nama: "Rama", gender: "L", arti: "Ayah, tokoh kebenaran", filosofi: "Titisan Dewa Wisnu yang melindungi semesta dari keangkuhan.", harapan: "Bertanggung jawab, berjiwa ksatria, dan penyayang keluarga.", asal: "Ramayana", wetonCocok: ["Rabu Legi", "Minggu Kliwon"] },
  { id: 81, nama: "Rangga", gender: "L", arti: "Pegawai kerajaan, perisai", filosofi: "Dedikasi dan perlindungan. Orang yang menjaga kehormatan.", harapan: "Menjadi pria pelindung bagi keluarga dan pekerja keras.", asal: "Jawa Tradisional" },
  { id: 82, nama: "Restu", gender: "L", arti: "Izin, berkat", filosofi: "Segala kesuksesan hanya bisa dicapai melalui restu Tuhan dan orang tua.", harapan: "Anak yang berbakti dan hidupnya selalu diberkahi.", asal: "Jawa Modern" },
  { id: 83, nama: "Satria", gender: "L", arti: "Prajurit yang gagah berani", filosofi: "Berani berkorban demi kehormatan dan membela yang tertindas.", harapan: "Memiliki jiwa ksatria, jujur, dan pantang menyerah.", asal: "Sansekerta-Jawa" },
  { id: 84, nama: "Seno", gender: "L", arti: "Bercahaya, pintar", filosofi: "Pemikiran tajam yang memotong masalah bagai pedang.", harapan: "Tumbuh cerdas, intelektual, dan memiliki karir cemerlang.", asal: "Jawa" },
  { id: 85, nama: "Sigit", gender: "L", arti: "Tampan, baik budi", filosofi: "Keseimbangan antara keindahan rupa fisik dan keluhuran batin.", harapan: "Pria yang rupawan dan memiliki sopan santun tinggi.", asal: "Jawa Tradisional" },
  { id: 86, nama: "Surya", gender: "L", arti: "Matahari", filosofi: "Pemberi energi kehidupan tanpa pamrih. Mandiri dan berkuasa.", harapan: "Menjadi sosok yang sukses secara mandiri dan mengayomi.", asal: "Sansekerta", wetonCocok: ["Senin Kliwon", "Kamis Pon"] },
  { id: 87, nama: "Susilo", gender: "L", arti: "Sopan, bertata krama", filosofi: "Ilmu yang tinggi tidak ada artinya tanpa adab dan sopan santun.", harapan: "Pria yang menjunjung tinggi etika moral dalam masyarakat.", asal: "Jawa Kawi" },
  { id: 88, nama: "Tirta", gender: "L", arti: "Air suci", filosofi: "Membersihkan hal-hal kotor dan memberikan kehidupan yang sejuk.", harapan: "Membawa kedamaian dan solusi dalam setiap konflik.", asal: "Jawa Kuna" },
  { id: 89, nama: "Wahyu", gender: "L", arti: "Petunjuk dari Tuhan", filosofi: "Orang terpilih yang diberi kelebihan untuk menyelesaikan tugas besar.", harapan: "Hidupnya selalu mendapat kemudahan dan petunjuk Ilahi.", asal: "Jawa-Islam" },
  { id: 90, nama: "Wira", gender: "L", arti: "Pahlawan laki-laki", filosofi: "Keberanian mengambil alih tanggung jawab saat yang lain mundur.", harapan: "Tangguh, pemberani, dan siap berkorban demi kebenaran.", asal: "Sansekerta" },
  { id: 91, nama: "Yuda", gender: "L", arti: "Perang, perjuangan", filosofi: "Hidup adalah medan perang menundukkan ego diri sendiri.", harapan: "Memiliki mental pemenang dan pantang mundur sebelum berhasil.", asal: "Jawa Kuna", wetonCocok: ["Selasa Wage", "Sabtu Pahing"] }
];
// ==========================================
// PART 2: DATABASE NAMA BAHASA INGGRIS (EN)
// ==========================================
const NAMA_JAWA_EN: BabyName[] = [
  { id: 1, nama: "Arjuna", gender: "L", arti: "Shining, white, pure", filosofi: "A wise, strong, and loyal shadow puppet (wayang) figure. Symbolizes a true knight.", harapan: "To become a brave, honest, and noble person.", asal: "Mahabharata", wetonCocok: ["Selasa Legi", "Kamis Pahing"] },
  { id: 2, nama: "Bima", gender: "L", arti: "Big, strong, firm", filosofi: "A tough warrior with physical and mental strength. Fearless.", harapan: "To possess a firm heart and the courage to defend the truth.", asal: "Mahabharata", wetonCocok: ["Selasa Kliwon", "Jumat Wage"] },
  { id: 3, nama: "Cahyo", gender: "L", arti: "Light, bright", filosofi: "An illuminator in the dark, bringing warmth to the family.", harapan: "To be a source of happiness and guidance for those around him.", asal: "Old Javanese" },
  { id: 4, nama: "Danendra", gender: "L", arti: "Owner of wealth", filosofi: "Inner and outer prosperity, the ability to manage wealth wisely.", harapan: "Successful in career and able to bring happiness to parents.", asal: "Sanskrit-Javanese" },
  { id: 5, nama: "Eka", gender: "L", arti: "One, first", filosofi: "The first child who becomes a role model for younger siblings.", harapan: "To become a leader and protector of the family.", asal: "Old Javanese" },
  { id: 6, nama: "Fajar", gender: "L", arti: "Dawn, the first light", filosofi: "A beginning full of hope, a new spirit every day.", harapan: "Diligent and optimistic in living life.", asal: "Modern Javanese" },
  { id: 7, nama: "Gatotkaca", gender: "L", arti: "Iron-boned", filosofi: "An invincible knight. A symbol of extraordinary strength.", harapan: "Healthy, strong, and brave.", asal: "Wayang", wetonCocok: ["Selasa Pon", "Kamis Legi"] },
  { id: 8, nama: "Hardi", gender: "L", arti: "Hard, firm", filosofi: "A mentality of steel that does not easily surrender to difficulties.", harapan: "Never backing down in achieving goals.", asal: "Old Javanese" },
  { id: 9, nama: "Indra", gender: "L", arti: "Highest god", filosofi: "Leadership and authority. The king of the gods.", harapan: "To become a fair and wise leader.", asal: "Sanskrit" },
  { id: 10, nama: "Jaka", gender: "L", arti: "Young man, bachelor", filosofi: "A symbol of youth full of energy and potential.", harapan: "To grow into a responsible adult man.", asal: "Old Javanese" },
  { id: 11, nama: "Kusuma", gender: "L", arti: "Flower", filosofi: "Beauty of the heart and sincerity.", harapan: "Remembered for his kindness.", asal: "Sanskrit" },
  { id: 12, nama: "Langgeng", gender: "L", arti: "Eternal, everlasting", filosofi: "Harmony that lasts throughout time.", harapan: "Family relationships are always peaceful and happy.", asal: "Old Javanese" },
  { id: 13, nama: "Mahesa", gender: "L", arti: "Male buffalo", filosofi: "Strength and perseverance. Working hard tirelessly.", harapan: "Diligent and persistent in work.", asal: "Old Javanese" },
  { id: 14, nama: "Narendra", gender: "L", arti: "King of men", filosofi: "Leadership that protects, not oppresses.", harapan: "To be a leader loved by the people.", asal: "Sanskrit" },
  { id: 15, nama: "Prasetyo", gender: "L", arti: "Promise, commitment", filosofi: "Loyalty to one's conscience and responsibility.", harapan: "To become a person who keeps their promises.", asal: "Old Javanese" },
  { id: 16, nama: "Ragil", gender: "L", arti: "Youngest, last child", filosofi: "The final child who brings a unique joy.", harapan: "Loved by the family and brings blessings.", asal: "Old Javanese" },
  { id: 17, nama: "Sapta", gender: "L", arti: "Seven", filosofi: "A sacred number. Balance between the world and the afterlife.", harapan: "A balanced and meaningful life.", asal: "Sanskrit" },
  { id: 18, nama: "Teguh", gender: "L", arti: "Sturdy, strong", filosofi: "A stance that is not shaken by any temptation.", harapan: "Consistent in truth.", asal: "Old Javanese" },
  { id: 19, nama: "Umar", gender: "L", arti: "Age, life", filosofi: "Long life and blessings.", harapan: "Blessed with health and a long life.", asal: "Islamic Javanese" },
  { id: 20, nama: "Wicaksono", gender: "L", arti: "Wise", filosofi: "The ability to think clearly and make the right decisions.", harapan: "To become a wise and respected person.", asal: "Old Javanese" },
  { id: 21, nama: "Yudhistira", gender: "L", arti: "Firm in war", filosofi: "A king who is fair, honest, and wise.", harapan: "Always on the path of truth.", asal: "Mahabharata", wetonCocok: ["Rabu Wage", "Jumat Legi"] },
  { id: 22, nama: "Zain", gender: "L", arti: "Beautiful, good", filosofi: "Inner and outer beauty.", harapan: "Has an attractive personality and a kind heart.", asal: "Islamic Javanese" },
  { id: 23, nama: "Ayu", gender: "P", arti: "Beautiful, elegant", filosofi: "Beauty that radiates from the heart.", harapan: "To become a charming and noble person.", asal: "Old Javanese" },
  { id: 24, nama: "Bulan", gender: "P", arti: "Moon", filosofi: "Illuminator of the night, a source of calmness.", harapan: "Brings peace to the family.", asal: "Old Javanese" },
  { id: 25, nama: "Citra", gender: "P", arti: "Image, reflection", filosofi: "A woman who becomes a role model.", harapan: "To be a good example for the environment.", asal: "Sanskrit" },
  { id: 26, nama: "Dewi", gender: "P", arti: "Goddess, fairy", filosofi: "Heavenly beauty and grace.", harapan: "To become a highly respected woman.", asal: "Sanskrit" },
  { id: 27, nama: "Endah", gender: "P", arti: "Beautiful", filosofi: "A simple yet captivating beauty.", harapan: "Always grateful and humble.", asal: "Old Javanese" },
  { id: 28, nama: "Fitri", gender: "P", arti: "Pure, natural", filosofi: "Purity of heart like a newborn child.", harapan: "Protected from sin and always under God's protection.", asal: "Islamic Javanese" },
  { id: 29, nama: "Gita", gender: "P", arti: "Song, melody", filosofi: "Happiness that flows through words.", harapan: "Good at calming others' hearts.", asal: "Sanskrit" },
  { id: 30, nama: "Harum", gender: "P", arti: "Fragrant", filosofi: "A good name that is remembered well.", harapan: "Remembered for her kindness.", asal: "Old Javanese" },
  { id: 31, nama: "Indah", gender: "P", arti: "Beautiful", filosofi: "Inner and outer beauty.", harapan: "To be the jewel of the family.", asal: "Old Javanese" },
  { id: 32, nama: "Jamilah", gender: "P", arti: "Beautiful", filosofi: "A calming beauty.", harapan: "Loved by many for her good character.", asal: "Islamic Javanese" },
  { id: 33, nama: "Kartini", gender: "P", arti: "Heroine", filosofi: "Emancipation and the struggle for equality.", harapan: "Smart and brave in voicing the truth.", asal: "Modern Javanese" },
  { id: 34, nama: "Laras", gender: "P", arti: "Harmonious, in tune", filosofi: "The ability to build harmonious relationships.", harapan: "Capable in communication and socialization.", asal: "Old Javanese" },
  { id: 35, nama: "Mawar", gender: "P", arti: "Rose", filosofi: "Beauty with thorns, firm yet gentle.", harapan: "Tough in facing challenges.", asal: "Modern Javanese" },
  { id: 36, nama: "Ningrum", gender: "P", arti: "The beloved", filosofi: "A child deeply loved by the family.", harapan: "Brings warmth to the home.", asal: "Old Javanese" },
  { id: 37, nama: "Puspa", gender: "P", arti: "Flower", filosofi: "The fragrance of a name and sincerity of heart.", harapan: "Beneficial to many people.", asal: "Sanskrit" },
  { id: 38, nama: "Ratri", gender: "P", arti: "Night", filosofi: "Calmness and inner depth.", harapan: "Good at contemplation and introspection.", asal: "Sanskrit" },
  { id: 39, nama: "Sari", gender: "P", arti: "Core, essence", filosofi: "A woman who becomes the core of the family.", harapan: "To be the center of affection.", asal: "Old Javanese" },
  { id: 40, nama: "Tresna", gender: "P", arti: "Love", filosofi: "Sincere and eternal love.", harapan: "Spreads love to her surroundings.", asal: "Old Javanese" },
  { id: 41, nama: "Utami", gender: "P", arti: "Main, best", filosofi: "A classy and dignified woman.", harapan: "To be the pride of the family.", asal: "Old Javanese" },
  { id: 42, nama: "Wati", gender: "P", arti: "Woman", filosofi: "A tough and patient woman.", harapan: "A role model in patience.", asal: "Old Javanese" },
  { id: 43, nama: "Yanti", gender: "P", arti: "Noble woman", filosofi: "A high status in the eyes of God.", harapan: "Always in goodness.", asal: "Islamic Javanese" },
  { id: 44, nama: "Zahra", gender: "P", arti: "Flower, radiant", filosofi: "A radiant face that brings happiness.", harapan: "To be a comfort to her parents' hearts.", asal: "Islamic Javanese" },
  { id: 45, nama: "Anggit", gender: "L", arti: "Work, creation", filosofi: "Creator and innovator.", harapan: "Creates many works for the nation.", asal: "Old Javanese" },
  { id: 46, nama: "Bayu", gender: "L", arti: "Wind", filosofi: "Freedom and speed.", harapan: "Agile and quick in thinking.", asal: "Old Javanese" },
  { id: 47, nama: "Candra", gender: "L", arti: "Moon", filosofi: "Illuminator in the dark.", harapan: "Provides guidance for others.", asal: "Sanskrit" },
  { id: 48, nama: "Darma", gender: "L", arti: "Truth", filosofi: "Duty and virtue.", harapan: "Upholds the truth highly.", asal: "Sanskrit" },
  { id: 49, nama: "Elok", gender: "P", arti: "Beautiful", filosofi: "A captivating face.", harapan: "Always surrounded by goodness.", asal: "Old Javanese" },
  { id: 50, nama: "Galuh", gender: "P", arti: "Gem", filosofi: "Valuable and priceless.", harapan: "Respected by others.", asal: "Old Javanese" },
  { id: 51, nama: "Hastono", gender: "L", arti: "Right hand", filosofi: "Reliance and trust.", harapan: "To be a reliable person.", asal: "Old Javanese" },
  { id: 52, nama: "Intan", gender: "P", arti: "Diamond", filosofi: "Hard but sparkling.", harapan: "Firm in stance but kind-hearted.", asal: "Old Javanese" },
  { id: 53, nama: "Jatmiko", gender: "L", arti: "Praiseworthy", filosofi: "Good behavior.", harapan: "Loved by the community.", asal: "Old Javanese" },
  { id: 54, nama: "Kenanga", gender: "P", arti: "Ylang-ylang flower", filosofi: "A refreshing fragrance.", harapan: "Spreads the scent of goodness.", asal: "Old Javanese" },
  { id: 55, nama: "Lukita", gender: "P", arti: "Art, writing", filosofi: "Creativity and expression.", harapan: "Talented in arts and literature.", asal: "Sanskrit" },
  { id: 56, nama: "Abimanyu", gender: "L", arti: "Brave, unafraid of difficulties", filosofi: "The youngest knight who fell bravely in Bharatayuddha. A symbol of absolute courage.", harapan: "To be a man brave enough to fight for truth despite great difficulties.", asal: "Mahabharata", wetonCocok: ["Senin Pahing", "Selasa Legi"] },
  { id: 57, nama: "Aditya", gender: "L", arti: "Sun", filosofi: "The center of the solar system that shines without discrimination. A symbol of enlightenment and energy.", harapan: "Capable of being an illuminator and a source of inspiration for his surroundings.", asal: "Sanskrit-Javanese" },
  { id: 58, nama: "Bagas", gender: "L", arti: "Healthy, strong, and sturdy", filosofi: "Physical strength representing the power of inner foundation in facing life's currents.", harapan: "To grow up healthy, strong, and become a pillar of the family.", asal: "Old Javanese", wetonCocok: ["Rabu Pon", "Kamis Kliwon"] },
  { id: 59, nama: "Baskara", gender: "L", arti: "Brightly shining sun", filosofi: "The light of life that drives away the darkness of ignorance and poverty.", harapan: "To be a successful, highly educated, and enlightening figure.", asal: "Kawi/Javanese" },
  { id: 60, nama: "Cakra", gender: "L", arti: "Wheel, heirloom weapon", filosofi: "The sacred weapon of King Krishna. Symbolizes the wheel of fate and sharp justice.", harapan: "Capable of distinguishing right from wrong and upholding justice.", asal: "Sanskrit-Wayang" },
  { id: 61, nama: "Damar", gender: "L", arti: "Lamp, illuminator", filosofi: "Though small, the flame of a damar can drive away the dark of night. A symbol of hope in crises.", harapan: "To be a solution-oriented child who always brings a glimmer of hope.", asal: "Traditional Javanese" },
  { id: 62, nama: "Danu", gender: "L", arti: "Bow, water", filosofi: "Depending on the pull, an arrow can shoot fast to reach its target. A symbol of focus and the calmness of water.", harapan: "Has high ambitions and sharp focus in achieving them.", asal: "Old Javanese" },
  { id: 63, nama: "Dimas", gender: "L", arti: "Beloved younger brother", filosofi: "An affectionate term for a young man who is respected yet remains grounded.", harapan: "To be a child loved by everyone and stays humble.", asal: "Modern Javanese" },
  { id: 64, nama: "Dirga", gender: "L", arti: "Air, vast sky", filosofi: "Limitless freedom, open-mindedness, and far-reaching vision.", harapan: "Has broad knowledge and is not narrow-minded.", asal: "Sanskrit-Javanese" },
  { id: 65, nama: "Galang", gender: "L", arti: "To make, to build", filosofi: "A foundation builder. Represents the spirit of mutual cooperation and strong will.", harapan: "Capable of building a solid and independent future.", asal: "Javanese Kawi" },
  { id: 66, nama: "Gilang", gender: "L", arti: "Shining very brightly", filosofi: "A precious stone that shines after being rubbed hard. Success through life's trials.", harapan: "To have a brilliant future and be respected.", asal: "Javanese" },
  { id: 67, nama: "Gunawan", gender: "L", arti: "Useful/noble man", filosofi: "True wealth is how much benefit a person brings to others.", harapan: "To be a person beneficial to religion, nation, and family.", asal: "Old Javanese" },
  { id: 68, nama: "Handoko", gender: "L", arti: "A leader who brings honor", filosofi: "Moral integrity held higher than material wealth.", harapan: "Successful in career and always protecting the family's good name.", asal: "Noble Javanese", wetonCocok: ["Jumat Kliwon", "Sabtu Legi"] },
  { id: 69, nama: "Haryo", gender: "L", arti: "Noble, blue-blooded", filosofi: "True honor comes not from lineage, but from noble character.", harapan: "To be an elegant, polite, and highly virtuous man.", asal: "Noble Javanese" },
  { id: 70, nama: "Jati", gender: "L", arti: "Teak tree, true essence/truth", filosofi: "Wood that gets stronger and more valuable with age. Unfading integrity.", harapan: "Firm in stance, not easily influenced by bad company.", asal: "Traditional Javanese" },
  { id: 71, nama: "Kresna", gender: "L", arti: "Black, name of a wise king", filosofi: "A master strategist in the Mahabharata, a whisperer of the path of truth.", harapan: "To grow into a strategic, smart, and wise thinker.", asal: "Wayang", wetonCocok: ["Kamis Pahing", "Minggu Wage"] },
  { id: 72, nama: "Lintang", gender: "L", arti: "Star in the sky", filosofi: "Though far, its light can guide sailors at night.", harapan: "To be an inspiring figure and a guide for others.", asal: "Old Javanese" },
  { id: 73, nama: "Luhur", gender: "L", arti: "High, noble", filosofi: "Spiritual and moral status that surpasses worldly positions.", harapan: "Has noble character and avoids despicable acts.", asal: "Javanese Kawi" },
  { id: 74, nama: "Manggala", gender: "L", arti: "Commander, general", filosofi: "At the front lines to protect the weak and lead the troops.", harapan: "Possesses a protective and tough leadership spirit.", asal: "Old Javanese" },
  { id: 75, nama: "Nugroho", gender: "L", arti: "God's grace, gift", filosofi: "Their presence is the greatest gift to be grateful for and protected.", harapan: "To be a blessing and bringer of fortune to the family.", asal: "Modern Javanese" },
  { id: 76, nama: "Pandu", gender: "L", arti: "Guide, pathfinder", filosofi: "Father of the Pandavas. A symbol of wisdom and sacrifice for justice.", harapan: "To be a pioneer of goodness and an ideal father figure in the future.", asal: "Mahabharata" },
  { id: 77, nama: "Panji", gender: "L", arti: "Banner, symbol of greatness", filosofi: "A handsome knight figure who conquers difficulties. A symbol of dignity.", harapan: "To be a respected man, handsome in looks, and kind in heart.", asal: "Javanese Panji Tales" },
  { id: 78, nama: "Permana", gender: "L", arti: "Knowing clearly, vigilant", filosofi: "Sharpness of the inner eye in seeing potential dangers and opportunities.", harapan: "To grow into someone vigilant, smart, and meticulous.", asal: "Javanese Kawi" },
  { id: 79, nama: "Raden", gender: "L", arti: "Noble title", filosofi: "Not just a title, but demands great social responsibility.", harapan: "Behaves like a noble who protects, not oppresses.", asal: "Javanese Royal" },
  { id: 80, nama: "Rama", gender: "L", arti: "Father, figure of truth", filosofi: "Incarnation of Lord Vishnu who protects the universe from arrogance.", harapan: "Responsible, chivalrous, and loving to the family.", asal: "Ramayana", wetonCocok: ["Rabu Legi", "Minggu Kliwon"] },
  { id: 81, nama: "Rangga", gender: "L", arti: "Royal official, shield", filosofi: "Dedication and protection. A person who guards honor.", harapan: "To be a protective man for the family and a hard worker.", asal: "Traditional Javanese" },
  { id: 82, nama: "Restu", gender: "L", arti: "Permission, blessing", filosofi: "All success can only be achieved through the blessings of God and parents.", harapan: "A devoted child whose life is always blessed.", asal: "Modern Javanese" },
  { id: 83, nama: "Satria", gender: "L", arti: "Brave warrior", filosofi: "Brave enough to sacrifice for honor and defend the oppressed.", harapan: "Has a knightly soul, honest, and unyielding.", asal: "Sanskrit-Javanese" },
  { id: 84, nama: "Seno", gender: "L", arti: "Shining, smart", filosofi: "Sharp thinking that cuts through problems like a sword.", harapan: "To grow up smart, intellectual, and have a brilliant career.", asal: "Javanese" },
  { id: 85, nama: "Sigit", gender: "L", arti: "Handsome, good-natured", filosofi: "A balance between physical beauty and inner nobility.", harapan: "A handsome man with high politeness.", asal: "Traditional Javanese" },
  { id: 86, nama: "Surya", gender: "L", arti: "Sun", filosofi: "Giver of life energy without expecting anything. Independent and powerful.", harapan: "To become a successfully independent and protective figure.", asal: "Sanskrit", wetonCocok: ["Senin Kliwon", "Kamis Pon"] },
  { id: 87, nama: "Susilo", gender: "L", arti: "Polite, well-mannered", filosofi: "High knowledge is meaningless without manners and politeness.", harapan: "A man who upholds moral ethics in society.", asal: "Javanese Kawi" },
  { id: 88, nama: "Tirta", gender: "L", arti: "Holy water", filosofi: "Cleanses dirty things and provides a cool life.", harapan: "Brings peace and solutions to every conflict.", asal: "Old Javanese" },
  { id: 89, nama: "Wahyu", gender: "L", arti: "Divine revelation", filosofi: "A chosen one given advantages to complete great tasks.", harapan: "His life always receives ease and divine guidance.", asal: "Islamic Javanese" },
  { id: 90, nama: "Wira", gender: "L", arti: "Male hero", filosofi: "The courage to take responsibility when others retreat.", harapan: "Tough, brave, and ready to sacrifice for truth.", asal: "Sanskrit" },
  { id: 91, nama: "Yuda", gender: "L", arti: "War, struggle", filosofi: "Life is a battlefield to conquer one's own ego.", harapan: "Has a winner's mentality and never retreats before succeeding.", asal: "Old Javanese", wetonCocok: ["Selasa Wage", "Sabtu Pahing"] }
];
// ==========================================
// PART 3: DATABASE NAMA BAHASA SPANYOL (ES)
// ==========================================
const NAMA_JAWA_ES: BabyName[] = [
  { id: 1, nama: "Arjuna", gender: "L", arti: "Brillante, blanco, puro", filosofi: "Figura de títeres de sombras (wayang) sabia, fuerte y leal. Simboliza a un verdadero caballero.", harapan: "Convertirse en una persona valiente, honesta y noble.", asal: "Mahabharata", wetonCocok: ["Selasa Legi", "Kamis Pahing"] },
  { id: 2, nama: "Bima", gender: "L", arti: "Grande, fuerte, firme", filosofi: "Un guerrero duro con fuerza física y mental. Sin miedo.", harapan: "Poseer un corazón firme y el coraje de defender la verdad.", asal: "Mahabharata", wetonCocok: ["Selasa Kliwon", "Jumat Wage"] },
  { id: 3, nama: "Cahyo", gender: "L", arti: "Luz, brillante", filosofi: "Un iluminador en la oscuridad, que aporta calidez a la familia.", harapan: "Ser una fuente de felicidad y guía para quienes lo rodean.", asal: "Javanés Antiguo" },
  { id: 4, nama: "Danendra", gender: "L", arti: "Dueño de riqueza", filosofi: "Prosperidad interior y exterior, capacidad para gestionar la riqueza sabiamente.", harapan: "Exitoso en su carrera y capaz de hacer felices a sus padres.", asal: "Sánscrito-Javanés" },
  { id: 5, nama: "Eka", gender: "L", arti: "Uno, primero", filosofi: "El primer hijo que se convierte en modelo a seguir para sus hermanos menores.", harapan: "Convertirse en líder y protector de la familia.", asal: "Javanés Antiguo" },
  { id: 6, nama: "Fajar", gender: "L", arti: "Amanecer, primera luz", filosofi: "Un comienzo lleno de esperanza, un nuevo espíritu cada día.", harapan: "Diligente y optimista en la vida.", asal: "Javanés Moderno" },
  { id: 7, nama: "Gatotkaca", gender: "L", arti: "Huesos de hierro", filosofi: "Un caballero invencible. Símbolo de fuerza extraordinaria.", harapan: "Sano, fuerte y valiente.", asal: "Wayang", wetonCocok: ["Selasa Pon", "Kamis Legi"] },
  { id: 8, nama: "Hardi", gender: "L", arti: "Duro, firme", filosofi: "Una mentalidad de acero que no se rinde fácilmente ante las dificultades.", harapan: "Nunca retroceder en el logro de objetivos.", asal: "Javanés Antiguo" },
  { id: 9, nama: "Indra", gender: "L", arti: "Dios supremo", filosofi: "Liderazgo y autoridad. El rey de los dioses.", harapan: "Convertirse en un líder justo y sabio.", asal: "Sánscrito" },
  { id: 10, nama: "Jaka", gender: "L", arti: "Joven, soltero", filosofi: "Símbolo de la juventud llena de energía y potencial.", harapan: "Convertirse en un hombre adulto responsable.", asal: "Javanés Antiguo" },
  { id: 11, nama: "Kusuma", gender: "L", arti: "Flor", filosofi: "Belleza del corazón y sinceridad.", harapan: "Recordado por su amabilidad.", asal: "Sánscrito" },
  { id: 12, nama: "Langgeng", gender: "L", arti: "Eterno, duradero", filosofi: "Armonía que perdura a través del tiempo.", harapan: "Las relaciones familiares son siempre pacíficas y felices.", asal: "Javanés Antiguo" },
  { id: 13, nama: "Mahesa", gender: "L", arti: "Búfalo macho", filosofi: "Fuerza y perseverancia. Trabajar duro incansablemente.", harapan: "Diligente y persistente en el trabajo.", asal: "Javanés Antiguo" },
  { id: 14, nama: "Narendra", gender: "L", arti: "Rey de los hombres", filosofi: "Liderazgo que protege, no que oprime.", harapan: "Ser un líder amado por el pueblo.", asal: "Sánscrito" },
  { id: 15, nama: "Prasetyo", gender: "L", arti: "Promesa, compromiso", filosofi: "Lealtad a la propia conciencia y responsabilidad.", harapan: "Convertirse en una persona que cumple sus promesas.", asal: "Javanés Antiguo" },
  { id: 16, nama: "Ragil", gender: "L", arti: "Menor, último hijo", filosofi: "El último hijo que trae una alegría única.", harapan: "Amado por la familia y trae bendiciones.", asal: "Javanés Antiguo" },
  { id: 17, nama: "Sapta", gender: "L", arti: "Siete", filosofi: "Un número sagrado. Equilibrio entre el mundo y la otra vida.", harapan: "Una vida equilibrada y significativa.", asal: "Sánscrito" },
  { id: 18, nama: "Teguh", gender: "L", arti: "Firme, fuerte", filosofi: "Una postura que no se deja sacudir por ninguna tentación.", harapan: "Consistente en la verdad.", asal: "Javanés Antiguo" },
  { id: 19, nama: "Umar", gender: "L", arti: "Edad, vida", filosofi: "Larga vida y bendiciones.", harapan: "Bendecido con salud y una larga vida.", asal: "Javanés Islámico" },
  { id: 20, nama: "Wicaksono", gender: "L", arti: "Sabio", filosofi: "La capacidad de pensar con claridad y tomar las decisiones correctas.", harapan: "Convertirse en una persona sabia y respetada.", asal: "Javanés Antiguo" },
  { id: 21, nama: "Yudhistira", gender: "L", arti: "Firme en la guerra", filosofi: "Un rey justo, honesto y sabio.", harapan: "Siempre en el camino de la verdad.", asal: "Mahabharata", wetonCocok: ["Rabu Wage", "Jumat Legi"] },
  { id: 22, nama: "Zain", gender: "L", arti: "Hermoso, bueno", filosofi: "Belleza interior y exterior.", harapan: "Tiene una personalidad atractiva y un buen corazón.", asal: "Javanés Islámico" },
  { id: 23, nama: "Ayu", gender: "P", arti: "Hermosa, elegante", filosofi: "Belleza que irradia desde el corazón.", harapan: "Convertirse en una persona encantadora y noble.", asal: "Javanés Antiguo" },
  { id: 24, nama: "Bulan", gender: "P", arti: "Luna", filosofi: "Iluminadora de la noche, fuente de calma.", harapan: "Trae paz a la familia.", asal: "Javanés Antiguo" },
  { id: 25, nama: "Citra", gender: "P", arti: "Imagen, reflejo", filosofi: "Una mujer que se convierte en un modelo a seguir.", harapan: "Ser un buen ejemplo para el entorno.", asal: "Sánscrito" },
  { id: 26, nama: "Dewi", gender: "P", arti: "Diosa, hada", filosofi: "Belleza celestial y gracia.", harapan: "Convertirse en una mujer muy respetada.", asal: "Sánscrito" },
  { id: 27, nama: "Endah", gender: "P", arti: "Hermosa", filosofi: "Una belleza simple pero cautivadora.", harapan: "Siempre agradecida y humilde.", asal: "Javanés Antiguo" },
  { id: 28, nama: "Fitri", gender: "P", arti: "Puro, natural", filosofi: "Pureza de corazón como un niño recién nacido.", harapan: "Protegido del pecado y siempre bajo la protección de Dios.", asal: "Javanés Islámico" },
  { id: 29, nama: "Gita", gender: "P", arti: "Canción, melodía", filosofi: "Felicidad que fluye a través de las palabras.", harapan: "Buena para calmar los corazones de los demás.", asal: "Sánscrito" },
  { id: 30, nama: "Harum", gender: "P", arti: "Fragante", filosofi: "Un buen nombre que se recuerda bien.", harapan: "Recordada por su amabilidad.", asal: "Javanés Antiguo" },
  { id: 31, nama: "Indah", gender: "P", arti: "Hermosa", filosofi: "Belleza interior y exterior.", harapan: "Ser la joya de la familia.", asal: "Javanés Antiguo" },
  { id: 32, nama: "Jamilah", gender: "P", arti: "Hermosa", filosofi: "Una belleza relajante.", harapan: "Amada por muchos por su buen carácter.", asal: "Javanés Islámico" },
  { id: 33, nama: "Kartini", gender: "P", arti: "Heroína", filosofi: "Emancipación y lucha por la igualdad.", harapan: "Inteligente y valiente para expresar la verdad.", asal: "Javanés Moderno" },
  { id: 34, nama: "Laras", gender: "P", arti: "Armonioso, en sintonía", filosofi: "La capacidad de construir relaciones armoniosas.", harapan: "Capaz en comunicación y socialización.", asal: "Javanés Antiguo" },
  { id: 35, nama: "Mawar", gender: "P", arti: "Rosa", filosofi: "Belleza con espinas, firme pero gentil.", harapan: "Fuerte ante los desafíos.", asal: "Javanés Moderno" },
  { id: 36, nama: "Ningrum", gender: "P", arti: "La amada", filosofi: "Una niña profundamente amada por la familia.", harapan: "Trae calidez al hogar.", asal: "Javanés Antiguo" },
  { id: 37, nama: "Puspa", gender: "P", arti: "Flor", filosofi: "La fragancia de un nombre y la sinceridad del corazón.", harapan: "Beneficioso para muchas personas.", asal: "Sánscrito" },
  { id: 38, nama: "Ratri", gender: "P", arti: "Noche", filosofi: "Calma y profundidad interior.", harapan: "Buena para la contemplación y la introspección.", asal: "Sánscrito" },
  { id: 39, nama: "Sari", gender: "P", arti: "Núcleo, esencia", filosofi: "Una mujer que se convierte en el núcleo de la familia.", harapan: "Ser el centro del afecto.", asal: "Javanés Antiguo" },
  { id: 40, nama: "Tresna", gender: "P", arti: "Amor", filosofi: "Amor sincero y eterno.", harapan: "Difunde amor a su alrededor.", asal: "Javanés Antiguo" },
  { id: 41, nama: "Utami", gender: "P", arti: "Principal, mejor", filosofi: "Una mujer elegante y digna.", harapan: "Ser el orgullo de la familia.", asal: "Javanés Antiguo" },
  { id: 42, nama: "Wati", gender: "P", arti: "Mujer", filosofi: "Una mujer dura y paciente.", harapan: "Un modelo a seguir en paciencia.", asal: "Javanés Antiguo" },
  { id: 43, nama: "Yanti", gender: "P", arti: "Mujer noble", filosofi: "Un alto estatus a los ojos de Dios.", harapan: "Siempre en la bondad.", asal: "Javanés Islámico" },
  { id: 44, nama: "Zahra", gender: "P", arti: "Flor, radiante", filosofi: "Un rostro radiante que trae felicidad.", harapan: "Ser un consuelo para el corazón de sus padres.", asal: "Javanés Islámico" },
  { id: 45, nama: "Anggit", gender: "L", arti: "Obra, creación", filosofi: "Creador e innovador.", harapan: "Crea muchas obras para la nación.", asal: "Javanés Antiguo" },
  { id: 46, nama: "Bayu", gender: "L", arti: "Viento", filosofi: "Libertad y velocidad.", harapan: "Ágil y rápido de pensamiento.", asal: "Javanés Antiguo" },
  { id: 47, nama: "Candra", gender: "L", arti: "Luna", filosofi: "Iluminador en la oscuridad.", harapan: "Proporciona orientación a los demás.", asal: "Sánscrito" },
  { id: 48, nama: "Darma", gender: "L", arti: "Verdad", filosofi: "Deber y virtud.", harapan: "Defiende la verdad altamente.", asal: "Sánscrito" },
  { id: 49, nama: "Elok", gender: "P", arti: "Hermosa", filosofi: "Un rostro cautivador.", harapan: "Siempre rodeada de bondad.", asal: "Javanés Antiguo" },
  { id: 50, nama: "Galuh", gender: "P", arti: "Joya", filosofi: "Valiosa e incalculable.", harapan: "Respetada por los demás.", asal: "Javanés Antiguo" },
  { id: 51, nama: "Hastono", gender: "L", arti: "Mano derecha", filosofi: "Dependencia y confianza.", harapan: "Ser una persona confiable.", asal: "Javanés Antiguo" },
  { id: 52, nama: "Intan", gender: "P", arti: "Diamante", filosofi: "Dura pero brillante.", harapan: "Firme en su postura pero de buen corazón.", asal: "Javanés Antiguo" },
  { id: 53, nama: "Jatmiko", gender: "L", arti: "Loable", filosofi: "Buen comportamiento.", harapan: "Amado por la comunidad.", asal: "Javanés Antiguo" },
  { id: 54, nama: "Kenanga", gender: "P", arti: "Flor de Ylang-ylang", filosofi: "Una fragancia refrescante.", harapan: "Difunde el aroma de la bondad.", asal: "Javanés Antiguo" },
  { id: 55, nama: "Lukita", gender: "P", arti: "Arte, escritura", filosofi: "Creatividad y expresión.", harapan: "Con talento para las artes y la literatura.", asal: "Sánscrito" },
  { id: 56, nama: "Abimanyu", gender: "L", arti: "Valiente, sin miedo a las dificultades", filosofi: "El caballero más joven que cayó valientemente en Bharatayuddha. Un símbolo de coraje absoluto.", harapan: "Ser un hombre lo suficientemente valiente como para luchar por la verdad a pesar de las grandes dificultades.", asal: "Mahabharata", wetonCocok: ["Senin Pahing", "Selasa Legi"] },
  { id: 57, nama: "Aditya", gender: "L", arti: "Sol", filosofi: "El centro del sistema solar que brilla sin discriminación. Símbolo de iluminación y energía.", harapan: "Capaz de ser un iluminador y una fuente de inspiración para su entorno.", asal: "Sánscrito-Javanés" },
  { id: 58, nama: "Bagas", gender: "L", arti: "Sano, fuerte y robusto", filosofi: "La fuerza física representa el poder de la base interior para enfrentar las corrientes de la vida.", harapan: "Crecer sano, fuerte y convertirse en un pilar de la familia.", asal: "Javanés Antiguo", wetonCocok: ["Rabu Pon", "Kamis Kliwon"] },
  { id: 59, nama: "Baskara", gender: "L", arti: "Sol brillando intensamente", filosofi: "La luz de la vida que aleja la oscuridad de la ignorancia y la pobreza.", harapan: "Ser una figura exitosa, muy educada y esclarecedora.", asal: "Kawi/Javanés" },
  { id: 60, nama: "Cakra", gender: "L", arti: "Rueda, arma heredada", filosofi: "El arma sagrada del rey Krishna. Simboliza la rueda del destino y la justicia aguda.", harapan: "Capaz de distinguir el bien del mal y defender la justicia.", asal: "Sánscrito-Wayang" },
  { id: 61, nama: "Damar", gender: "L", arti: "Lámpara, iluminador", filosofi: "Aunque pequeña, la llama de un damar puede alejar la oscuridad de la noche. Símbolo de esperanza en las crisis.", harapan: "Ser un niño orientado a las soluciones que siempre trae un rayo de esperanza.", asal: "Javanés Tradicional" },
  { id: 62, nama: "Danu", gender: "L", arti: "Arco, agua", filosofi: "Dependiendo del tirón, una flecha puede disparar rápido para alcanzar su objetivo. Símbolo de enfoque y calma.", harapan: "Tiene altas ambiciones y un enfoque agudo para lograrlas.", asal: "Javanés Antiguo" },
  { id: 63, nama: "Dimas", gender: "L", arti: "Hermano menor amado", filosofi: "Un término afectuoso para un joven que es respetado pero se mantiene con los pies en la tierra.", harapan: "Ser un niño amado por todos y mantenerse humilde.", asal: "Javanés Moderno" },
  { id: 64, nama: "Dirga", gender: "L", arti: "Aire, cielo vasto", filosofi: "Libertad ilimitada, mentalidad abierta y visión de gran alcance.", harapan: "Tiene un amplio conocimiento y no es de mente estrecha.", asal: "Sánscrito-Javanés" },
  { id: 65, nama: "Galang", gender: "L", arti: "Hacer, construir", filosofi: "Un constructor de cimientos. Representa el espíritu de cooperación mutua y fuerte voluntad.", harapan: "Capaz de construir un futuro sólido e independiente.", asal: "Javanés Kawi" },
  { id: 66, nama: "Gilang", gender: "L", arti: "Brillando muy intensamente", filosofi: "Una piedra preciosa que brilla después de ser frotada con fuerza. Éxito a través de las pruebas de la vida.", harapan: "Tener un futuro brillante y ser respetado.", asal: "Javanés" },
  { id: 67, nama: "Gunawan", gender: "L", arti: "Hombre útil/noble", filosofi: "La verdadera riqueza es cuánto beneficio aporta una persona a los demás.", harapan: "Ser una persona beneficiosa para la religión, la nación y la familia.", asal: "Javanés Antiguo" },
  { id: 68, nama: "Handoko", gender: "L", arti: "Un líder que trae honor", filosofi: "La integridad moral se mantiene por encima de la riqueza material.", harapan: "Exitoso en la carrera y siempre protegiendo el buen nombre de la familia.", asal: "Javanés Noble", wetonCocok: ["Jumat Kliwon", "Sabtu Legi"] },
  { id: 69, nama: "Haryo", gender: "L", arti: "Noble, de sangre azul", filosofi: "El verdadero honor no proviene del linaje, sino de un carácter noble.", harapan: "Ser un hombre elegante, educado y muy virtuoso.", asal: "Javanés Noble" },
  { id: 70, nama: "Jati", gender: "L", arti: "Árbol de teca, esencia verdadera", filosofi: "Madera que se vuelve más fuerte y valiosa con la edad. Integridad que no se desvanece.", harapan: "Firme en su postura, no se deja influenciar fácilmente por las malas compañías.", asal: "Javanés Tradicional" },
  { id: 71, nama: "Kresna", gender: "L", arti: "Negro, nombre de un rey sabio", filosofi: "Un maestro estratega en el Mahabharata, un susurrador del camino de la verdad.", harapan: "Crecer para ser un pensador estratégico, inteligente y sabio.", asal: "Wayang", wetonCocok: ["Kamis Pahing", "Minggu Wage"] },
  { id: 72, nama: "Lintang", gender: "L", arti: "Estrella en el cielo", filosofi: "Aunque lejos, su luz puede guiar a los marineros en la noche.", harapan: "Ser una figura inspiradora y un guía para los demás.", asal: "Javanés Antiguo" },
  { id: 73, nama: "Luhur", gender: "L", arti: "Alto, noble", filosofi: "Estatus espiritual y moral que supera las posiciones mundanas.", harapan: "Tiene un carácter noble y evita los actos despreciables.", asal: "Javanés Kawi" },
  { id: 74, nama: "Manggala", gender: "L", arti: "Comandante, general", filosofi: "En primera línea para proteger a los débiles y liderar las tropas.", harapan: "Posee un espíritu de liderazgo protector y duro.", asal: "Javanés Antiguo" },
  { id: 75, nama: "Nugroho", gender: "L", arti: "Gracia de Dios, regalo", filosofi: "Su presencia es el mayor regalo por el que estar agradecido y protegido.", harapan: "Ser una bendición y portador de fortuna para la familia.", asal: "Javanés Moderno" },
  { id: 76, nama: "Pandu", gender: "L", arti: "Guía, explorador", filosofi: "Padre de los Pandavas. Símbolo de sabiduría y sacrificio por la justicia.", harapan: "Ser un pionero de la bondad y una figura paterna ideal en el futuro.", asal: "Mahabharata" },
  { id: 77, nama: "Panji", gender: "L", arti: "Bandera, símbolo de grandeza", filosofi: "Una figura de caballero guapo que conquista las dificultades. Símbolo de dignidad.", harapan: "Ser un hombre respetado, guapo y de buen corazón.", asal: "Cuentos Panji Javaneses" },
  { id: 78, nama: "Permana", gender: "L", arti: "Saber con claridad, vigilante", filosofi: "Agudeza del ojo interior para ver peligros potenciales y oportunidades.", harapan: "Crecer para ser alguien vigilante, inteligente y meticuloso.", asal: "Javanés Kawi" },
  { id: 79, nama: "Raden", gender: "L", arti: "Título noble", filosofi: "No es solo un título, exige una gran responsabilidad social.", harapan: "Se comporta como un noble que protege, no que oprime.", asal: "Javanés Real" },
  { id: 80, nama: "Rama", gender: "L", arti: "Padre, figura de la verdad", filosofi: "Encarnación del Señor Vishnu que protege al universo de la arrogancia.", harapan: "Responsable, caballeroso y cariñoso con la familia.", asal: "Ramayana", wetonCocok: ["Rabu Legi", "Minggu Kliwon"] },
  { id: 81, nama: "Rangga", gender: "L", arti: "Oficial real, escudo", filosofi: "Dedicación y protección. Una persona que guarda el honor.", harapan: "Ser un hombre protector para la familia y un gran trabajador.", asal: "Javanés Tradicional" },
  { id: 82, nama: "Restu", gender: "L", arti: "Permiso, bendición", filosofi: "Todo el éxito solo se puede lograr a través de las bendiciones de Dios y los padres.", harapan: "Un hijo devoto cuya vida siempre está bendecida.", asal: "Javanés Moderno" },
  { id: 83, nama: "Satria", gender: "L", arti: "Guerrero valiente", filosofi: "Lo suficientemente valiente como para sacrificarse por el honor y defender a los oprimidos.", harapan: "Tiene alma de caballero, es honesto e inquebrantable.", asal: "Sánscrito-Javanés" },
  { id: 84, nama: "Seno", gender: "L", arti: "Brillante, inteligente", filosofi: "Pensamiento agudo que corta los problemas como una espada.", harapan: "Crecer inteligente, intelectual y tener una carrera brillante.", asal: "Javanés" },
  { id: 85, nama: "Sigit", gender: "L", arti: "Guapo, de buen corazón", filosofi: "Un equilibrio entre la belleza física y la nobleza interior.", harapan: "Un hombre apuesto con gran cortesía.", asal: "Javanés Tradicional" },
  { id: 86, nama: "Surya", gender: "L", arti: "Sol", filosofi: "Dador de energía vital sin esperar nada. Independiente y poderoso.", harapan: "Convertirse en una figura exitosamente independiente y protectora.", asal: "Sánscrito", wetonCocok: ["Senin Kliwon", "Kamis Pon"] },
  { id: 87, nama: "Susilo", gender: "L", arti: "Educado, de buenos modales", filosofi: "El alto conocimiento no tiene sentido sin modales y cortesía.", harapan: "Un hombre que defiende la ética moral en la sociedad.", asal: "Javanés Kawi" },
  { id: 88, nama: "Tirta", gender: "L", arti: "Agua bendita", filosofi: "Limpia las cosas sucias y proporciona una vida fresca.", harapan: "Trae paz y soluciones a cada conflicto.", asal: "Javanés Antiguo" },
  { id: 89, nama: "Wahyu", gender: "L", arti: "Revelación divina", filosofi: "Un elegido al que se le dan ventajas para completar grandes tareas.", harapan: "Su vida siempre recibe facilidad y guía divina.", asal: "Javanés Islámico" },
  { id: 90, nama: "Wira", gender: "L", arti: "Héroe masculino", filosofi: "El coraje de asumir la responsabilidad cuando otros se retiran.", harapan: "Duro, valiente y listo para sacrificarse por la verdad.", asal: "Sánscrito" },
  { id: 91, nama: "Yuda", gender: "L", arti: "Guerra, lucha", filosofi: "La vida es un campo de batalla para conquistar el propio ego.", harapan: "Tiene mentalidad de ganador y nunca retrocede antes de tener éxito.", asal: "Javanés Antiguo", wetonCocok: ["Selasa Wage", "Sabtu Pahing"] }
];

// ==========================================
// MENGGABUNGKAN DATABASE BERDASARKAN BAHASA
// ==========================================
function getNamesByLanguage(lang: string): BabyName[] {
  if (lang === "en") return NAMA_JAWA_EN;
  if (lang === "es") return NAMA_JAWA_ES;
  return NAMA_JAWA_ID;
}
// ========== KOMPONEN UTAMA ==========
export default function NamaBayiJawa({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const ui = UI_DICT[activeLang] || UI_DICT["id"];
  const activeNames = getNamesByLanguage(activeLang);

  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<Gender | "">("");
  const [selectedNama, setSelectedNama] = useState<BabyName | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Optimasi filtering dengan sanitasi string (trim & lowercase)
  const filteredNames = useMemo(() => {
    let filtered = activeNames;
    
    if (genderFilter) {
      filtered = filtered.filter(n => n.gender === genderFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(n => 
        n.nama.toLowerCase().includes(term) || 
        n.arti.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [genderFilter, searchTerm, activeNames]);

  const openDetail = (nama: BabyName) => {
    setSelectedNama(nama);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Timeout untuk membiarkan animasi selesai sebelum state dihapus
    setTimeout(() => setSelectedNama(null), 200);
  };

  // UX Enhancement: Handle Escape key & Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (showModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const handleShare = async () => {
    if (!selectedNama) return;
    const genderText = selectedNama.gender === "L" ? ui.genderMale : ui.genderFemale;
    const text = `${ui.sharePrefix} ${selectedNama.nama} (${genderText})\n${ui.modalArti}: ${selectedNama.arti}\n${ui.modalFilosofi}: ${selectedNama.filosofi}\n\n${ui.shareSuffix}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: `Baby Name: ${selectedNama.nama}`, text });
      } catch (err) {
        console.warn("Share API cancelled/failed", err);
      }
    } else {
      // Fallback andal jika browser tidak mendukung Web Share API
      try {
        await navigator.clipboard.writeText(text);
        alert(ui.copied);
      } catch (err) {
        alert(ui.copyFailed);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto text-white font-sans px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-2">👶🌾</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent pb-1">
          {ui.title}
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">
          {ui.subtitle}
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search-nama" className="text-amber-300 text-xs font-bold uppercase tracking-wider block mb-1">
              {ui.searchLbl}
            </label>
            <input
              id="search-nama"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={ui.searchPh}
              className="w-full bg-slate-900/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:bg-slate-800/60"
            />
          </div>
          <div className="w-full sm:w-56">
            <label htmlFor="filter-gender" className="text-amber-300 text-xs font-bold uppercase tracking-wider block mb-1">
              {ui.genderLbl}
            </label>
            <select
              id="filter-gender"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as Gender | "")}
              className="w-full bg-slate-900/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all hover:bg-slate-800/60 appearance-none"
            >
              <option value="">{ui.genderAll}</option>
              <option value="L">{ui.male}</option>
              <option value="P">{ui.female}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Counter */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-lg font-bold text-slate-200">{ui.listTitle}</h3>
        <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          {filteredNames.length} {ui.found}
        </span>
      </div>

      {/* Grid Nama */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredNames.map((nama) => (
          <button
            key={nama.id}
            onClick={() => openDetail(nama)}
            className="group bg-slate-900/40 hover:bg-slate-800/80 border border-white/10 hover:border-amber-500/50 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl opacity-80 group-hover:opacity-100 transition-opacity">
                {nama.gender === "L" ? "👦" : "👧"}
              </span>
              <span className="font-bold text-amber-100 group-hover:text-amber-400 transition-colors">
                {nama.nama}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {nama.arti}
            </p>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredNames.length === 0 && (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/5 mt-4">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="text-slate-300 font-medium">{ui.emptyTitle}</p>
          <p className="text-slate-500 text-sm mt-1">{ui.emptyDesc}</p>
        </div>
      )}

      {/* Modal Detail */}
      {showModal && selectedNama && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in" 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-md w-full p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-y-auto max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              aria-label="Close Detail"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-3 drop-shadow-md">{selectedNama.gender === "L" ? "👦" : "👧"}</div>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                {selectedNama.nama}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {selectedNama.gender === "L" ? ui.genderMale : ui.genderFemale}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {selectedNama.asal}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span>📖</span> {ui.modalArti}
                </p>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{selectedNama.arti}</p>
              </div>
              
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span>🧠</span> {ui.modalFilosofi}
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">{selectedNama.filosofi}</p>
              </div>
              
              <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span>🌟</span> {ui.modalHarapan}
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">{selectedNama.harapan}</p>
              </div>
              
              {selectedNama.wetonCocok && (
                <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span>📅</span> {ui.modalWeton}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedNama.wetonCocok.map((weton, idx) => (
                      <span key={idx} className="bg-indigo-500/20 text-indigo-200 text-xs px-2.5 py-1 rounded-md border border-indigo-500/30">
                        {weton}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
                onClick={handleShare}
                className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 tracking-wide"
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
                resultId={selectedNama.nama} 
              />
</>
              {/* SAMPAI SINI */}

            </div>
          </div>
        )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}