// Enhanced color palette with visual identities only (removed basic themes)
export const colors = {
  // === الهويات النهارية ===
  
  // 1. فسيفساء الأندلس
  andalusianMosaic: {
    background: '#F5F1E8', // عاجي ناعم
    card: '#FFFFFF',
    text: '#1C3D5A', // أزرق فينيق
    subtext: '#4BB1A0', // فيروزي فاتح
    border: '#D4AF37', // ذهبي باهت
    primary: '#1C3D5A', // أزرق فينيق
    secondary: '#4BB1A0', // فيروزي فاتح
    success: '#4BB1A0',
    warning: '#D4AF37',
    error: '#C53030',
    info: '#4BB1A0',
    // Quran specific colors
    quranRead: '#4BB1A0', // فيروزي للتلاوة
    quranMemorized: '#1C3D5A', // أزرق فينيق للحفظ
    quranRevised: '#D4AF37', // ذهبي للمراجعة
    purple: '#6B46C1',
    pink: '#EC4899',
    teal: '#4BB1A0',
    orange: '#F97316',
    lime: '#84CC16',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    violet: '#7C3AED',
  },
  // 2. خطوط القِبلة
  qiblaLines: {
    background: '#F2EEE8', // أبيض ترابي فاتح
    card: '#FFFFFF',
    text: '#0B3D2E', // أخضر مسجدي داكن
    subtext: '#3FA796', // أخضر نعناعي
    border: '#C9B79C', // عاجي متوسط
    primary: '#0B3D2E', // أخضر مسجدي داكن
    secondary: '#3FA796', // أخضر نعناعي
    success: '#3FA796',
    warning: '#C9B79C',
    error: '#C53030',
    info: '#3FA796',
    // Quran specific colors
    quranRead: '#3FA796', // أخضر نعناعي للتلاوة
    quranMemorized: '#0B3D2E', // أخضر مسجدي للحفظ
    quranRevised: '#C9B79C', // عاجي للمراجعة
    purple: '#6B46C1',
    pink: '#EC4899',
    teal: '#3FA796',
    orange: '#F97316',
    lime: '#84CC16',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    violet: '#7C3AED',
  },
  // 3. أريج النخيل
  palmBreeze: {
    background: '#FAF5ED', // كريمي فاتح
    card: '#FFFFFF',
    text: '#60503D', // بني رطب
    subtext: '#7A9E7E', // أخضر نخلي
    border: '#D9C47E', // أصفر رطب
    primary: '#60503D', // بني رطب
    secondary: '#7A9E7E', // أخضر نخلي
    success: '#7A9E7E',
    warning: '#D9C47E',
    error: '#C53030',
    info: '#7A9E7E',
    // Quran specific colors
    quranRead: '#7A9E7E', // أخضر نخلي للتلاوة
    quranMemorized: '#60503D', // بني رطب للحفظ
    quranRevised: '#D9C47E', // أصفر رطب للمراجعة
    purple: '#6B46C1',
    pink: '#EC4899',
    teal: '#7A9E7E',
    orange: '#F97316',
    lime: '#84CC16',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    violet: '#7C3AED',
  },
  // 4. ليالي الأندلس
  andalusianNights: {
    background: '#ECECEC', // رمادي فاتح جداً
    card: '#FFFFFF',
    text: '#0F1E3D', // أزرق سمائي داكن
    subtext: '#6D5A7A', // بنفسجي هادئ
    border: '#B8B8B8', // فضي خافت
    primary: '#0F1E3D', // أزرق سمائي داكن
    secondary: '#6D5A7A', // بنفسجي هادئ
    success: '#6D5A7A',
    warning: '#B8B8B8',
    error: '#C53030',
    info: '#6D5A7A',
    // Quran specific colors
    quranRead: '#6D5A7A', // بنفسجي للتلاوة
    quranMemorized: '#0F1E3D', // أزرق سمائي للحفظ
    quranRevised: '#B8B8B8', // فضي للمراجعة
    purple: '#6D5A7A',
    pink: '#EC4899',
    teal: '#14B8A6',
    orange: '#F97316',
    lime: '#84CC16',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    violet: '#6D5A7A',
  },
  // 5. فجر الصحراء
  desertDawn: {
    background: '#FFF6EE', // بيج فاتح
    card: '#FFFFFF',
    text: '#E57A44', // برتقالي شروق
    subtext: '#C9A66B', // بني رملي
    border: '#F0C6A8', // وردي شاحب
    primary: '#E57A44', // برتقالي شروق
    secondary: '#F0C6A8', // وردي شاحب
    success: '#C9A66B',
    warning: '#F0C6A8',
    error: '#C53030',
    info: '#C9A66B',
    // Quran specific colors
    quranRead: '#F0C6A8', // وردي شاحب للتلاوة
    quranMemorized: '#E57A44', // برتقالي شروق للحفظ
    quranRevised: '#C9A66B', // بني رملي للمراجعة
    purple: '#6B46C1',
    pink: '#F0C6A8',
    teal: '#14B8A6',
    orange: '#E57A44',
    lime: '#84CC16',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    violet: '#7C3AED',
  },

  // === الهويات الليلية ===
  
  // 1. سِحر الغُسق
  twilightMagic: {
    background: '#1F2E3F', // كُحلي فاتح
    card: '#2A3B4F',
    text: '#E6E8EA', // أبيض لؤلؤي
    subtext: '#8A79A6', // ليلكي بارد
    border: '#4A5A6A', // رمادي دخاني
    primary: '#8A79A6', // ليلكي بارد
    secondary: '#4A5A6A', // رمادي دخاني
    success: '#8A79A6',
    warning: '#4A5A6A',
    error: '#E57373',
    info: '#8A79A6',
    // Quran specific colors
    quranRead: '#8A79A6', // ليلكي للتلاوة
    quranMemorized: '#0A1B2D', // أزرق غسق للحفظ
    quranRevised: '#4A5A6A', // رمادي دخاني للمراجعة
    purple: '#8A79A6',
    pink: '#C48FB1',
    teal: '#5A8A8A',
    orange: '#D4956B',
    lime: '#9ABA5A',
    cyan: '#5A9ABA',
    rose: '#C48F8F',
    violet: '#8A79A6',
  },
  // 2. وميض القمر
  moonGlow: {
    background: '#0D1117', // كحلي داكن جداً
    card: '#1A1F26',
    text: '#E6E8EA', // أبيض لؤلؤي
    subtext: '#BFC7D1', // فضي قمري
    border: '#2C303A', // أزرق فحمي
    primary: '#BFC7D1', // فضي قمري
    secondary: '#2C303A', // أزرق فحمي
    success: '#BFC7D1',
    warning: '#E6E8EA',
    error: '#E57373',
    info: '#BFC7D1',
    // Quran specific colors
    quranRead: '#BFC7D1', // فضي قمري للتلاوة
    quranMemorized: '#E6E8EA', // أبيض لؤلؤي للحفظ
    quranRevised: '#2C303A', // أزرق فحمي للمراجعة
    purple: '#A6A1C7',
    pink: '#D1BFC7',
    teal: '#7ABFC7',
    orange: '#D1A67A',
    lime: '#A6D17A',
    cyan: '#7AC7D1',
    rose: '#D17A7A',
    violet: '#A6A1C7',
  },
  // 3. ليالي الصحراء
  desertNights: {
    background: '#1A132A', // بنفسجي غامق
    card: '#2A1F3A',
    text: '#E6D4B8', // بيج فاتح
    subtext: '#CC7A4B', // برتقالي غروب
    border: '#7A7D85', // ستيل رمادي
    primary: '#CC7A4B', // برتقالي غروب
    secondary: '#7A7D85', // ستيل رمادي
    success: '#CC7A4B',
    warning: '#7A7D85',
    error: '#E57373',
    info: '#CC7A4B',
    // Quran specific colors
    quranRead: '#CC7A4B', // برتقالي غروب للتلاوة
    quranMemorized: '#2E2B3C', // كحلي رملي للحفظ
    quranRevised: '#7A7D85', // ستيل رمادي للمراجعة
    purple: '#8A7A9E',
    pink: '#CC8FA6',
    teal: '#4BCC9E',
    orange: '#CC7A4B',
    lime: '#9ECC4B',
    cyan: '#4B9ECC',
    rose: '#CC4B7A',
    violet: '#8A7A9E',
  },
  // 4. ظلال الغابة الليلية
  forestShadows: {
    background: '#0A0F0D', // أسود مخضر
    card: '#1A2B1D',
    text: '#E8F5E8', // أبيض مخضر
    subtext: '#6BAE6B', // أخضر فسفوري خافت
    border: '#475047', // رمادي زيتي
    primary: '#6BAE6B', // أخضر فسفوري خافت
    secondary: '#475047', // رمادي زيتي
    success: '#6BAE6B',
    warning: '#AE9E6B',
    error: '#AE6B6B',
    info: '#6BAE6B',
    // Quran specific colors
    quranRead: '#6BAE6B', // أخضر فسفوري للتلاوة
    quranMemorized: '#1E2B29', // أخضر داكن أرجواني للحفظ
    quranRevised: '#475047', // رمادي زيتي للمراجعة
    purple: '#8A6BAE',
    pink: '#AE6B8A',
    teal: '#6BAEAE',
    orange: '#AE8A6B',
    lime: '#8AAE6B',
    cyan: '#6B8AAE',
    rose: '#AE6B6B',
    violet: '#8A6BAE',
  },
  // 5. أمواج الليل
  nightWaves: {
    background: '#0E1F33', // كحلي سلس
    card: '#1A2E43',
    text: '#E6F3F7', // أبيض مائي
    subtext: '#3AA7A6', // فيروزي عميق
    border: '#225E8A', // أزرق بحري متوسط
    primary: '#3AA7A6', // فيروزي عميق
    secondary: '#225E8A', // أزرق بحري متوسط
    success: '#3AA7A6',
    warning: '#A6A73A',
    error: '#A63A3A',
    info: '#3AA7A6',
    // Quran specific colors
    quranRead: '#3AA7A6', // فيروزي عميق للتلاوة
    quranMemorized: '#042A4B', // أزرق بحري غامق للحفظ
    quranRevised: '#225E8A', // أزرق بحري متوسط للمراجعة
    purple: '#7A3AA6',
    pink: '#A63A7A',
    teal: '#3AA7A6',
    orange: '#A67A3A',
    lime: '#7AA63A',
    cyan: '#3A7AA6',
    rose: '#A63A3A',
    violet: '#7A3AA6',
  }
};

// Theme names in Arabic
export const themeNames = {
  // الهويات النهارية
  andalusianMosaic: 'فسيفساء الأندلس',
  qiblaLines: 'خطوط القِبلة',
  palmBreeze: 'أريج النخيل',
  andalusianNights: 'ليالي الأندلس',
  desertDawn: 'فجر الصحراء',
  // الهويات الليلية
  twilightMagic: 'سِحر الغُسق',
  moonGlow: 'وميض القمر',
  desertNights: 'ليالي الصحراء',
  forestShadows: 'ظلال الغابة الليلية',
  nightWaves: 'أمواج الليل',
};

export type ThemeName = keyof typeof colors;