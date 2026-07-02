"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// ========== DATA DASAR (TIDAK DITERJEMAHKAN KARENA PAKEM ALGORITMA) ==========
const HARI_MINGGU = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_NILAI: Record<string, number> = {
  Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9
};
const PASARAN_NILAI: Record<string, number> = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8
};

// ========== KAMUS UI 3 BAHASA ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Kalender Jawa Presisi",
    subtitle: "Menggunakan algoritma Lunar UTC Absolut untuk menjamin akurasi Pasaran dan Neptu seumur hidup.",
    todayBtn: "Hari Ini", searchBtn: "Cari",
    legendLibur: "Hari Libur / Minggu", legendToday: "Hari Ini", legendPeringatan: "Peringatan Penting",
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    daysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    daysFull: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    alertYear: "Sistem hanya memvalidasi tahun antara 1900 hingga 2100 demi akurasi astrologi.",
    kombinasi: "Kombinasi Hari", totalNeptu: "Total Neptu", holiday: "HARI BESAR / LIBUR NASIONAL",
    peringatanNasional: "Peringatan Nasional", karakter: "Karakteristik Weton", faseBulan: "Fase Bulan Jawa",
    tradisiNone: "Tidak ada tradisi mayor tercatat.", shareBtn: "BAGIKAN TANGGAL INI", monthTxt: "Bulan",
    alertShare: "Fitur bagikan belum didukung di browser ini."
  },
  en: {
    title: "Precise Javanese Calendar",
    subtitle: "Using Absolute Lunar UTC algorithm to ensure lifetime Pasaran and Neptu accuracy.",
    todayBtn: "Today", searchBtn: "Search",
    legendLibur: "Holiday / Sunday", legendToday: "Today", legendPeringatan: "Important Event",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    alertYear: "The system only validates years between 1900 and 2100 for astrological accuracy.",
    kombinasi: "Day Combination", totalNeptu: "Total Neptu", holiday: "NATIONAL HOLIDAY",
    peringatanNasional: "National Event", karakter: "Weton Characteristics", faseBulan: "Javanese Lunar Phase",
    tradisiNone: "No major traditions recorded.", shareBtn: "SHARE THIS DATE", monthTxt: "Month",
    alertShare: "Share feature is not supported in this browser."
  },
  es: {
    title: "Calendario Javanés Preciso",
    subtitle: "Usando el algoritmo Lunar UTC Absoluto para garantizar precisión de por vida en Pasaran y Neptu.",
    todayBtn: "Hoy", searchBtn: "Buscar",
    legendLibur: "Festivo / Domingo", legendToday: "Hoy", legendPeringatan: "Evento Importante",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    daysFull: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    alertYear: "El sistema solo valida años entre 1900 y 2100 por precisión astrológica.",
    kombinasi: "Combinación de Días", totalNeptu: "Neptu Total", holiday: "FIESTA NACIONAL",
    peringatanNasional: "Evento Nacional", karakter: "Características de Weton", faseBulan: "Fase Lunar Javanesa",
    tradisiNone: "No hay tradiciones importantes registradas.", shareBtn: "COMPARTIR ESTA FECHA", monthTxt: "Mes",
    alertShare: "La función de compartir no es compatible en este navegador."
  }
};

// ========== LOGIKA KALENDER ABSOLUT ==========
function isLiburNasional(date: Date): boolean {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  if (day === 1 && month === 1) return true;
  if (day === 1 && month === 5) return true;
  if (day === 1 && month === 6) return true;
  if (day === 17 && month === 8) return true;
  if (day === 25 && month === 12) return true;
  return false;
}

// <-- FUNGSI DIBUAT DINAMIS (BAHASA)
function getPeringatan(date: Date, lang: string): string | null {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  if (lang === "en") {
    if (day === 1 && month === 1) return "New Year's Day";
    if (day === 1 && month === 5) return "International Labor Day";
    if (day === 1 && month === 6) return "Pancasila Day";
    if (day === 17 && month === 8) return "Indonesian Independence Day";
    if (day === 25 && month === 12) return "Christmas Day";
    if (day === 21 && month === 4) return "Kartini Day (Non-Holiday)";
    if (day === 28 && month === 10) return "Youth Pledge Day (Non-Holiday)";
    if (day === 10 && month === 11) return "Heroes' Day (Non-Holiday)";
    return null;
  }
  if (lang === "es") {
    if (day === 1 && month === 1) return "Día de Año Nuevo";
    if (day === 1 && month === 5) return "Día Internacional del Trabajo";
    if (day === 1 && month === 6) return "Día de Pancasila";
    if (day === 17 && month === 8) return "Día de la Independencia de Indonesia";
    if (day === 25 && month === 12) return "Día de Navidad";
    if (day === 21 && month === 4) return "Día de Kartini (No Festivo)";
    if (day === 28 && month === 10) return "Día del Compromiso Juvenil (No Festivo)";
    if (day === 10 && month === 11) return "Día de los Héroes (No Festivo)";
    return null;
  }
  
  if (day === 1 && month === 1) return "Tahun Baru Masehi";
  if (day === 1 && month === 5) return "Hari Buruh Internasional";
  if (day === 1 && month === 6) return "Hari Lahir Pancasila";
  if (day === 17 && month === 8) return "Hari Kemerdekaan RI";
  if (day === 25 && month === 12) return "Hari Raya Natal";
  if (day === 21 && month === 4) return "Hari Kartini (Non-Libur)";
  if (day === 28 && month === 10) return "Hari Sumpah Pemuda (Non-Libur)";
  if (day === 10 && month === 11) return "Hari Pahlawan (Non-Libur)";
  return null;
}

function getPasaran(date: Date): string {
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(utcDate / 86400000);
  const pasaranArr = ["Wage", "Kliwon", "Legi", "Pahing", "Pon"];
  const index = ((diffDays % 5) + 5) % 5;
  return pasaranArr[index];
}

function getNeptu(date: Date): number {
  const hari = HARI_MINGGU[date.getDay()];
  const pasaran = getPasaran(date);
  return (HARI_NILAI[hari] || 0) + (PASARAN_NILAI[pasaran] || 0);
}

function getBulanJawa(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric' });
    const monthStr = formatter.format(date); 
    const islamicMonth = parseInt(monthStr, 10);
    const BULAN_JAWA_ARR = ["", "Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadil Awal", "Jumadil Akhir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Dulkangidah", "Besar"];
    return BULAN_JAWA_ARR[islamicMonth] || "Tidak Diketahui";
  } catch(e) {
    return "Tidak Didukung";
  }
}

function getTahunSaka(date: Date): number {
  let tahunSaka = date.getFullYear() - 78;
  if (date.getMonth() < 2) tahunSaka -= 1; 
  return tahunSaka;
}

// <-- FUNGSI DIBUAT DINAMIS (BAHASA)
function getWatak(neptu: number, lang: string): string {
  if (lang === "en") {
    if (neptu <= 8) return "Strategic Observer (Quiet, authoritative, silent executor).";
    if (neptu <= 11) return "Harmonious Negotiator (Friendly, sociable, flexible).";
    if (neptu <= 14) return "Breakthrough Innovator (Visionary, tough, sharp thinker).";
    return "Ambitious Commander (Strong leader, brave, hard worker).";
  }
  if (lang === "es") {
    if (neptu <= 8) return "Observador Estratégico (Tranquilo, autoritario, ejecutor silencioso).";
    if (neptu <= 11) return "Negociador Armonioso (Amigable, sociable, flexible).";
    if (neptu <= 14) return "Innovador Rompedor (Visionario, duro, pensador agudo).";
    return "Comandante Ambicioso (Líder fuerte, valiente, trabajador).";
  }
  if (neptu <= 8) return "Pengamat Strategis (Pendiam, berwibawa, eksekutor senyap).";
  if (neptu <= 11) return "Negosiator Harmonis (Ramah, mudah bergaul, luwes).";
  if (neptu <= 14) return "Inovator Pendobrak (Visioner, tangguh, pemikir tajam).";
  return "Komandan Ambisius (Pemimpin kuat, berani, pekerja keras).";
}

// <-- FUNGSI DIBUAT DINAMIS (BAHASA)
function getTradisiDesc(bulan: string, lang: string): string {
  if (lang === "en") {
    const TRADISI_EN: Record<string, string> = {
      "Sura": "1 Sura: Javanese New Year, a sacred month, recommended for fasting and contemplation.",
      "Sapar": "Rebo Wekasan (Last Wednesday) is believed to be the day misfortune descends.",
      "Mulud": "Commemoration of the Prophet's Birthday, Muludan feast.",
      "Bakda Mulud": "A quiet month, a transition period after the Prophet's Birthday celebrations.",
      "Jumadil Awal": "A good month to start a business or a long journey.",
      "Jumadil Akhir": "A month for introspection, problem-solving, and preparation.",
      "Rejeb": "A sacred month, Ruwahan tradition or preparation for Ramadan.",
      "Ruwah": "Ruwah Month: Tradition of visiting ancestral graves (Sadranan).",
      "Pasa": "Month of obligatory fasting (Ramadan), increase worship.",
      "Sawal": "1 Syawal: Eid al-Fitr, gathering and forgiveness.",
      "Dulkangidah": "Sela/Apit Month. Prohibition against holding big events/weddings.",
      "Besar": "Month of Hajj and sacrifice. Excellent for wedding celebrations."
    };
    return TRADISI_EN[bulan] || "";
  }
  if (lang === "es") {
    const TRADISI_ES: Record<string, string> = {
      "Sura": "1 Sura: Año Nuevo Javanés, un mes sagrado, se recomienda ayunar y reflexionar.",
      "Sapar": "Rebo Wekasan (Último miércoles) se cree que es el día en que desciende la desgracia.",
      "Mulud": "Conmemoración del Nacimiento del Profeta, festín Muludan.",
      "Bakda Mulud": "Un mes tranquilo, transición después de las celebraciones del Profeta.",
      "Jumadil Awal": "Un buen mes para iniciar un negocio o un largo viaje.",
      "Jumadil Akhir": "Un mes para la introspección, resolución de problemas y preparación.",
      "Rejeb": "Un mes sagrado, tradición Ruwahan o preparación para el Ramadán.",
      "Ruwah": "Mes de Ruwah: Tradición de visitar tumbas ancestrales (Sadranan).",
      "Pasa": "Mes de ayuno obligatorio (Ramadán), aumentar la adoración.",
      "Sawal": "1 Syawal: Eid al-Fitr, reunión y perdón.",
      "Dulkangidah": "Mes Sela/Apit. Prohibición de realizar grandes eventos/bodas.",
      "Besar": "Mes del Hajj y el sacrificio. Excelente para bodas."
    };
    return TRADISI_ES[bulan] || "";
  }
  
  const TRADISI_ID: Record<string, string> = {
    "Sura": "1 Sura: Tahun Baru Jawa, bulan sakral, dianjurkan puasa dan tirakat.",
    "Sapar": "Rebo Wekasan (Rabu terakhir) dipercaya sebagai hari turunnya bala.",
    "Mulud": "Peringatan Maulid Nabi, selamatan Muludan.",
    "Bakda Mulud": "Bulan tenang, masa transisi setelah perayaan Maulid.",
    "Jumadil Awal": "Bulan baik untuk memulai usaha atau perjalanan jauh.",
    "Jumadil Akhir": "Bulan untuk introspeksi, penyelesaian masalah, dan persiapan.",
    "Rejeb": "Bulan sakral, tradisi Ruwahan atau persiapan menyambut Ramadhan.",
    "Ruwah": "Bulan Ruwah: tradisi nyekar ke makam leluhur (Sadranan).",
    "Pasa": "Bulan puasa wajib (Ramadhan), perbanyak ibadah.",
    "Sawal": "1 Syawal: Hari Raya Idul Fitri, silaturahmi.",
    "Dulkangidah": "Bulan Sela/Apit. Larangan mengadakan hajat besar/pernikahan.",
    "Besar": "Bulan haji dan kurban. Sangat baik untuk hajatan pernikahan."
  };
  return TRADISI_ID[bulan] || "";
}

// ========== INTERFACES ==========
interface CalendarDay {
  date: Date;
  dayIndex: number;
  pasaran: string;
  neptu: number;
  isLibur: boolean;
}

// ========== KOMPONEN UTAMA ==========
export default function KalenderJawaBulanan({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [searchDateStr, setSearchDateStr] = useState("");

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays: CalendarDay[] = [];
    
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonthDate.getDate();
    for (let i = prevMonthDaysCount - startDayOfWeek + 1; i <= prevMonthDaysCount; i++) {
      const d = new Date(year, month - 1, i);
      calendarDays.push({ date: d, dayIndex: d.getDay(), pasaran: getPasaran(d), neptu: getNeptu(d), isLibur: isLiburNasional(d) });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      calendarDays.push({ date: d, dayIndex: d.getDay(), pasaran: getPasaran(d), neptu: getNeptu(d), isLibur: isLiburNasional(d) });
    }
    
    const remaining = 42 - calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      calendarDays.push({ date: d, dayIndex: d.getDay(), pasaran: getPasaran(d), neptu: getNeptu(d), isLibur: isLiburNasional(d) });
    }
    setDays(calendarDays);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => { setCurrentDate(new Date()); setSearchDateStr(""); };

  const handleDayClick = (day: CalendarDay) => setSelectedDay(day);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDateStr) {
      const [year, month, day] = searchDateStr.split("-").map(Number);
      if (year < 1900 || year > 2100) { alert(dict.alertYear); return; }
      const searchDate = new Date(year, month - 1, day);
      setCurrentDate(searchDate); 
      setSelectedDay({ date: searchDate, dayIndex: searchDate.getDay(), pasaran: getPasaran(searchDate), neptu: getNeptu(searchDate), isLibur: isLiburNasional(searchDate) });
    }
  };

  const closeModal = () => setSelectedDay(null);

  const bulanJawa = getBulanJawa(currentDate);
  const tahunSaka = getTahunSaka(currentDate);

  return (
    <div className="max-w-5xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">📅🌾</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent pb-1">
          {dict.title}
        </h2>
        <p className="text-slate-300 text-sm mt-1">{dict.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/60 border border-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex gap-2 w-full md:w-auto justify-center">
          <button onClick={prevMonth} className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 transition text-amber-300">◀</button>
          <button onClick={goToday} className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 transition text-sm font-bold text-amber-100">{dict.todayBtn}</button>
          <button onClick={nextMonth} className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 transition text-amber-300">▶</button>
        </div>
        
        <div className="text-center">
          <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            {dict.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            {dict.monthTxt} {bulanJawa} - {tahunSaka} Saka
          </div>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto justify-center">
          <input 
            type="date" 
            value={searchDateStr}
            onChange={(e) => setSearchDateStr(e.target.value)}
            className="w-full md:w-40 bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 color-scheme-dark"
            title="Pilih Tanggal"
            required
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 transition font-bold text-sm text-amber-100 flex-shrink-0 flex items-center gap-2">
            🔍 {dict.searchBtn}
          </button>
        </form>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-7 gap-2 mb-3 text-center">
          {dict.daysShort.map((h: string, i: number) => (
            <div key={h} className={`text-xs font-black uppercase tracking-wider py-2 rounded-lg ${i === 0 ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
              {h}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isSunday = day.dayIndex === 0;
            const isRedDay = isSunday || day.isLibur;
            const peringatan = getPeringatan(day.date, activeLang);
            
            let dayBg = "bg-white/5 border-white/5";
            let dayText = "text-white";
            
            if (!isCurrentMonth) {
              dayBg = "opacity-30 bg-black/20 border-transparent";
            } else if (isToday) {
              dayBg = "bg-amber-500/20 border-amber-500/50 ring-1 ring-amber-400";
              dayText = "text-amber-300 font-black";
            } else if (isRedDay) {
              dayBg = "bg-red-500/10 border-red-500/20";
              dayText = "text-red-400 font-bold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`relative p-2 min-h-[80px] md:min-h-[100px] border rounded-xl transition-all hover:scale-[1.05] hover:z-10 focus:outline-none flex flex-col justify-between ${dayBg}`}
              >
                <div className="w-full flex justify-between items-start">
                  <div className="flex gap-1">
                    {day.isLibur && isCurrentMonth && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>}
                    {!day.isLibur && peringatan && isCurrentMonth && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                  </div>
                  <span className={`text-base md:text-lg ${dayText}`}>
                    {day.date.getDate()}
                  </span>
                </div>
                
                <div className="w-full text-center mt-2">
                  <div className={`text-[10px] md:text-xs font-bold ${isCurrentMonth ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {day.pasaran}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-slate-400 font-medium">
                    Neptu {day.neptu}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] sm:text-xs text-slate-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div> {dict.legendLibur}</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50 ring-1 ring-amber-400"></div> {dict.legendToday}</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> {dict.legendPeringatan}</div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-sm sm:max-w-md w-full p-6 border border-amber-500/30 shadow-2xl relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors">&times;</button>
            
            <div className="text-center mb-6 pt-2">
              <h3 className="text-3xl font-black text-slate-100">
                {selectedDay.date.getDate()} {dict.months[selectedDay.date.getMonth()]} {selectedDay.date.getFullYear()}
              </h3>
              
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-xl">
                  <p className="text-[10px] text-amber-200 uppercase tracking-widest font-semibold mb-0.5">{dict.kombinasi}</p>
                  <p className="text-xl font-black text-amber-400">{dict.daysFull[selectedDay.dayIndex]} {selectedDay.pasaran}</p>
                </div>
                
                <div className="px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{dict.totalNeptu}</p>
                  <p className="text-xl font-black text-slate-200">{selectedDay.neptu}</p>
                </div>
              </div>

              {selectedDay.isLibur && (
                <div className="mt-4 inline-block px-4 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-bold text-red-400 tracking-widest animate-pulse">
                  {dict.holiday}
                </div>
              )}
            </div>

            <div className="space-y-4 mt-6">
              {getPeringatan(selectedDay.date, activeLang) && (
                <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                  <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><span>📢</span> {dict.peringatanNasional}</p>
                  <p className="text-slate-200 text-sm font-medium">{getPeringatan(selectedDay.date, activeLang)}</p>
                </div>
              )}

              <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><span>🧠</span> {dict.karakter}</p>
                <p className="text-slate-200 text-sm leading-relaxed">{getWatak(selectedDay.neptu, activeLang)}</p>
              </div>

              <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><span>🌙</span> {dict.faseBulan}</p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  <span className="font-bold text-purple-300">{dict.monthTxt} {getBulanJawa(selectedDay.date)}</span> – {getTradisiDesc(getBulanJawa(selectedDay.date), activeLang) || dict.tradisiNone}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const liburNote = selectedDay.isLibur ? ` (${dict.holiday})` : "";
                const dateStr = selectedDay.date.toLocaleDateString(activeLang === "en" ? "en-US" : activeLang === "es" ? "es-ES" : "id-ID");
                const shareText = `📅 ${dateStr}${liburNote}\n${dict.kombinasi}: ${dict.daysFull[selectedDay.dayIndex]} ${selectedDay.pasaran}\nNeptu: ${selectedDay.neptu}\n${dict.monthTxt} Jawa: ${getBulanJawa(selectedDay.date)}\n\nAksaraDiri!`;
                if (navigator.share) navigator.share({ title: dict.title, text: shareText }).catch(()=>{});
                else alert(dict.alertShare);
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              📤 {dict.shareBtn}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in { animation: fade-in 0.2s ease-out forwards; }
        .color-scheme-dark { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.8; transition: 0.2s; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
      `}</style>
    </div>
  );
}