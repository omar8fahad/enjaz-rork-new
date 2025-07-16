// Hijri date utilities
export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
}

// Hijri month names in Arabic
const HIJRI_MONTHS = [
  'محرم',
  'صفر', 
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

// Day names in Arabic
const DAY_NAMES = [
  'الأحد',
  'الاثنين', 
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

// Convert Gregorian date to Hijri (simplified algorithm)
export function gregorianToHijri(gregorianDate: Date): HijriDate {
  // This is a simplified conversion algorithm
  // For production, you might want to use a more accurate library
  
  const gYear = gregorianDate.getFullYear();
  const gMonth = gregorianDate.getMonth() + 1;
  const gDay = gregorianDate.getDate();
  
  // Julian day calculation
  let jd = Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
           Math.floor((367 * (gMonth - 2 - 12 * (Math.floor((gMonth - 14) / 12)))) / 12) -
           Math.floor((3 * (Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100))) / 4) +
           gDay - 32075;
  
  // Convert Julian day to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + 
            (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - 
             (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  const hijriYear = y;
  const hijriMonth = m;
  const hijriDay = d;
  
  const dayOfWeek = gregorianDate.getDay();
  
  return {
    year: hijriYear,
    month: hijriMonth,
    day: hijriDay,
    monthName: HIJRI_MONTHS[hijriMonth - 1] || '',
    dayName: DAY_NAMES[dayOfWeek]
  };
}

// Format Hijri date as string
export function formatHijriDate(hijriDate: HijriDate): string {
  return `${hijriDate.dayName}، ${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} هـ`;
}

// Get current Hijri date
export function getCurrentHijriDate(): HijriDate {
  return gregorianToHijri(new Date());
}

// Format date based on calendar type
export function formatDateByCalendar(date: Date, calendarType: 'gregorian' | 'hijri'): string {
  if (calendarType === 'hijri') {
    const hijriDate = gregorianToHijri(date);
    return formatHijriDate(hijriDate);
  } else {
    // Gregorian format in Arabic
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}، ${day} ${monthName} ${year} م`;
  }
}