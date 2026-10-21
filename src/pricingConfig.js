// ============================================================================
// GEO-PRICING, SUBJECT-COMPLEXITY TIERS & PURCHASING-POWER PARITY (PPP) ENGINE
// Supports live overrides from Admin Hub via localStorage ('ds_custom_pricing_v1')
// ============================================================================

export const CUSTOM_PRICING_STORAGE_KEY = 'ds_custom_pricing_v1';

// Course-to-Complexity-Tier mapping:
// - 'ib' (Tier 1: Cálculo I-II, Matemática Base, Física Plan Común, Bachillerato IB / PAES / Abitur / Cuántica Curiosos)
// - 'bachelor' (Tier 2: Álgebra Lineal, EDOs, Mecánica Analítica, Electromagnetismo)
// - 'master' (Tier 3: Física Atmosférica, Suelos & Hidrología, Python Científico, Tesis & Proyectos)
export const COURSE_TIER_MAP = {
  // Tier 1 • Fundamentos, Cálculo, Plan Común & Aficionados
  klausur: 'ib',
  math_bachelor: 'ib',
  physics_bachelor: 'ib',
  quantum_curious: 'ib',
  ib: 'ib',

  // Tier 2 • Ingeniería Intermedia & Física Aplicada
  linear_algebra: 'bachelor',
  mechanics: 'bachelor',
  electromagnetism: 'bachelor',

  // Tier 3 • Especialidad, Python, Suelos, Atmósfera & Tesis
  computational: 'master',
  atmospheric: 'master',
  soil_physics: 'master',
  thesis_projects: 'master'
};

export const SUBJECT_COMPLEXITY_TIERS = [
  {
    id: 'ib',
    badgeEs: 'Nivel 1 • Fundamentos & Plan Común',
    badgeEn: 'Tier 1 • Foundations & Calculus',
    shortEs: 'Cálculo, Física Base & IB',
    shortEn: 'Calculus, Physics I & IB',
    coursesEs: 'Cálculo I–II, Física General, IB Diploma, Abitur, PAES',
    coursesEn: 'Calculus I–II, General Physics, IB Diploma, Abitur'
  },
  {
    id: 'bachelor',
    badgeEs: 'Nivel 2 • Ingeniería Intermedia',
    badgeEn: 'Tier 2 • Intermediate Engineering',
    shortEs: 'Álgebra, EDOs & Mecánica',
    shortEn: 'Linear Algebra, ODEs & Mechanics',
    coursesEs: 'Álgebra Lineal, EDOs, Mecánica Analítica, Electromagnetismo',
    coursesEn: 'Linear Algebra, ODEs, Analytical Mechanics, Electromagnetism'
  },
  {
    id: 'master',
    badgeEs: 'Nivel 3 • Avanzado, Python & Tesis',
    badgeEn: 'Tier 3 • Advanced, Python & Thesis',
    shortEs: 'Fluidos, Geofísica, Python & Tesis',
    shortEn: 'Fluids, Geophysics, Python & Thesis',
    coursesEs: 'Mecánica de Fluidos, Geofísica, Python Científico + IA, Tesis',
    coursesEn: 'Fluid Mechanics, Geophysics, Scientific Python + AI, Thesis'
  }
];

export const DEFAULT_CURRENCY_TIERS = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    suffix: '',
    flag: '🇪🇺',
    labelEn: 'EUR (€) • Europe / Germany',
    labelEs: 'EUR (€) • Europa / Alemania',
    shortLabel: 'EUR €',
    tierNameEn: 'European Traction Anchor (Germany / Spain / NL)',
    tierNameEs: 'Ancla Europea de Alta Tracción (Alemania / España / NL)',
    pppIndex: '1.00x (Base EUR)',
    eurRate: 1.0,
    inPersonSurchargePerHour: 8,
    rates: {
      ib: 25,       // Nivel 1: Cálculo, Física I, IB
      bachelor: 29, // Nivel 2: Álgebra Lineal, EDOs, Mecánica
      mechanics: 29,
      master: 35    // Nivel 3: Fluidos, Geofísica, Python, Tesis
    },
    packs8h: {
      ib: 170,      // ~21.25 €/h (-15%)
      bachelor: 197, // ~24.60 €/h (-15%)
      mechanics: 197,
      master: 238   // ~29.75 €/h (-15%)
    },
    paymentMethods: ['SEPA IBAN', 'PayPal', 'Wise', 'Revolut'],
    rationaleEs:
      'Piso competitivo de €25/h para Cálculo y Física Base que multiplica por 3x los mensajes en Kleinanzeigen (Hannover) y Tusclasesparticulares (España), escalando a €29/h en ramos intermedios y €35/h en Python/Geofísica/Tesis.',
    rationaleEn:
      'High-conversion €25/h entry point for Calculus & IB to maximize initial student inquiries in Germany and Spain, scaling to €29/h for intermediate engineering and €35/h for Python/Geophysics/Thesis.'
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    suffix: ' CLP',
    flag: '🇨🇱',
    labelEn: 'CLP ($) • Chile',
    labelEs: 'CLP ($) • Chile',
    shortLabel: 'CLP $',
    tierNameEn: 'Chile Calibrated by Subject Complexity (FCFM / UC / USM)',
    tierNameEs: 'Chile Escalado por Complejidad de Ramo (FCFM / UC / USM)',
    pppIndex: '0.80x (Ajuste Real Chile)',
    eurRate: 0.00098, // ~1.020 CLP = 1 EUR
    inPersonSurchargePerHour: 6000,
    rates: {
      ib: 20000,       // Nivel 1: Cálculo I-II, Física Base, IB/PAES ($20.000 CLP/h)
      bachelor: 23000, // Nivel 2: Álgebra Lineal, EDOs, Mecánica ($23.000 CLP/h)
      mechanics: 23000,
      master: 26000    // Nivel 3: Fluidos, Geofísica, Python + IA, Tesis ($26.000 CLP/h)
    },
    packs8h: {
      ib: 136000,      // $17.000 CLP/h (-15%)
      bachelor: 156000, // $19.500 CLP/h (-15%)
      mechanics: 156000,
      master: 176000   // $22.000 CLP/h (-15%)
    },
    paymentMethods: ['Transferencia Bancaria Chile (CLP)', 'Wise', 'PayPal'],
    rationaleEs:
      '$20.000 CLP/h para Cálculo y Física es el punto exacto en Chile: competitivo frente a profesores particulares ($18k–$25k), muy atractivo en pack ($17.000/h) o grupo de 2–3 amigos ($14.000/h), y sube a $23.000 y $26.000 CLP/h para ramos avanzados de Beauchef/UC/USM.',
    rationaleEn:
      '$20,000 CLP/h for Calculus & Foundations hits the exact sweet spot in Chile—accessible for university students while respecting your U. de Chile Geophysics + European Double M.Sc. credentials.'
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    suffix: '',
    flag: '🇨🇭',
    labelEn: 'CHF (Fr.) • Switzerland',
    labelEs: 'CHF (Fr.) • Suiza',
    shortLabel: 'CHF',
    tierNameEn: 'Switzerland High Purchasing Power Tier (ETH / EPFL / IB)',
    tierNameEs: 'Suiza Alta Capacidad de Pago (ETH / EPFL / IB)',
    pppIndex: '1.65x (Premium CHF)',
    eurRate: 1.06,
    inPersonSurchargePerHour: 12,
    rates: {
      ib: 42,       // Nivel 1: Cálculo, Física I, IB (42 CHF/h)
      bachelor: 48, // Nivel 2: Álgebra, EDOs, Mecánica (48 CHF/h)
      mechanics: 48,
      master: 55    // Nivel 3: Fluidos, Geofísica, Python, Tesis (55 CHF/h)
    },
    packs8h: {
      ib: 285,
      bachelor: 326,
      mechanics: 326,
      master: 374
    },
    paymentMethods: ['SEPA / IBAN (CHF/EUR)', 'Wise', 'Revolut', 'PayPal'],
    rationaleEs:
      'En Suiza el sueldo estudiantil básico es ~25 CHF/h y las academias cobran 80–120 CHF/h. Cobrar 42 a 55 CHF/h es súper competitivo para familias suizas (ETH, EPFL, colegios IB en Zúrich/Ginebra) y te rinde ~€45–€58 por hora.',
    rationaleEn:
      'In Switzerland, basic student jobs pay ~25 CHF/h and tutoring agencies charge 80–120 CHF/h. Pricing at 42–55 CHF/h is a bargain for Swiss families while yielding ~€45–€58/h.'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    suffix: '',
    flag: '🇬🇧',
    labelEn: 'GBP (£) • United Kingdom',
    labelEs: 'GBP (£) • Reino Unido',
    shortLabel: 'GBP £',
    tierNameEn: 'UK Academic Tier (A-Levels / IB / B.Sc.)',
    tierNameEs: 'Reino Unido Competitivo (A-Levels / IB / Grado)',
    pppIndex: '1.15x (GBP)',
    eurRate: 1.18,
    inPersonSurchargePerHour: 8,
    rates: {
      ib: 24,
      bachelor: 28,
      mechanics: 28,
      master: 34
    },
    packs8h: {
      ib: 163,
      bachelor: 190,
      mechanics: 190,
      master: 231
    },
    paymentMethods: ['Wise (UK Sort Code / IBAN)', 'Revolut', 'PayPal'],
    rationaleEs:
      'Tarifa atractiva en libras (£24–£34/h) para captar rápido estudiantes de A-Levels, IB Diploma y pregrado de ingeniería en Reino Unido.',
    rationaleEn:
      'Competitive GBP pricing (£24–£34/h) calibrated to attract UK A-Level, IB Diploma, and engineering undergraduates.'
  },
  USD: {
    code: 'USD',
    symbol: 'US$',
    suffix: '',
    flag: '🌎',
    labelEn: 'USD ($) • USA & International',
    labelEs: 'USD ($) • EE.UU. e Internacional',
    shortLabel: 'USD $',
    tierNameEn: 'Global / Expat Tier (USD)',
    tierNameEs: 'Internacional / Expat (USD)',
    pppIndex: '1.10x (USD)',
    eurRate: 0.92,
    inPersonSurchargePerHour: 10,
    rates: {
      ib: 28,
      bachelor: 32,
      mechanics: 32,
      master: 38
    },
    packs8h: {
      ib: 190,
      bachelor: 218,
      mechanics: 218,
      master: 258
    },
    paymentMethods: ['Wise', 'PayPal', 'International Wire'],
    rationaleEs:
      'Rango de $28 a $38 USD/h ideal para familias internacionales, colegios americanos/IB y estudiantes universitarios globales.',
    rationaleEn:
      '$28–$38 USD/h range tailored for international families, American/IB schools, and global university students.'
  }
};

export function getCurrencyTiers() {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY_TIERS;
  try {
    const raw = localStorage.getItem(CUSTOM_PRICING_STORAGE_KEY);
    if (!raw) return DEFAULT_CURRENCY_TIERS;
    const custom = JSON.parse(raw);
    const merged = {};
    for (const code of Object.keys(DEFAULT_CURRENCY_TIERS)) {
      const def = DEFAULT_CURRENCY_TIERS[code];
      const ov = custom[code] || {};
      const rates = {
        ...def.rates,
        ...(ov.rates || {})
      };
      rates.mechanics = rates.bachelor;
      const packs8h = {
        ib: Math.round(rates.ib * 8 * 0.85),
        bachelor: Math.round(rates.bachelor * 8 * 0.85),
        mechanics: Math.round(rates.bachelor * 8 * 0.85),
        master: Math.round(rates.master * 8 * 0.85)
      };
      merged[code] = {
        ...def,
        inPersonSurchargePerHour:
          ov.inPersonSurchargePerHour !== undefined
            ? Number(ov.inPersonSurchargePerHour)
            : def.inPersonSurchargePerHour,
        rates,
        packs8h
      };
    }
    return merged;
  } catch {
    return DEFAULT_CURRENCY_TIERS;
  }
}

export function saveCustomCurrencyRates(customMap) {
  try {
    localStorage.setItem(CUSTOM_PRICING_STORAGE_KEY, JSON.stringify(customMap));
    window.dispatchEvent(new Event('ds-pricing-updated'));
  } catch {}
}

export function resetCustomCurrencyRates() {
  try {
    localStorage.removeItem(CUSTOM_PRICING_STORAGE_KEY);
    window.dispatchEvent(new Event('ds-pricing-updated'));
  } catch {}
}

// Keep CURRENCY_TIERS & CURRENCY_LIST exports for backwards compatibility
export const CURRENCY_TIERS = getCurrencyTiers();
export const CURRENCY_LIST = Object.values(DEFAULT_CURRENCY_TIERS);

export function convertToEur(amount, currencyCode = 'EUR') {
  const tiers = getCurrencyTiers();
  const tier = tiers[currencyCode] || tiers.EUR;
  return Math.round((Number(amount) || 0) * (tier.eurRate || 1));
}

export function mapCountryToCurrency(countryCode) {
  const cc = String(countryCode || '').toUpperCase();
  if (cc === 'CH' || cc === 'LI') return 'CHF';
  if (cc === 'CL') return 'CLP';
  if (cc === 'GB' || cc === 'UK') return 'GBP';
  if (['US', 'CA', 'AU', 'NZ', 'SG', 'AE'].includes(cc)) return 'USD';
  return 'EUR';
}

export function detectInitialCurrency() {
  if (typeof window === 'undefined') return 'EUR';
  try {
    const saved = localStorage.getItem('preferred_currency');
    if (saved && DEFAULT_CURRENCY_TIERS[saved]) return saved;

    const tz =
      typeof Intl !== 'undefined' && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        : '';

    if (tz === 'Europe/Zurich' || tz === 'Europe/Vaduz') return 'CHF';
    if (tz === 'America/Santiago' || tz === 'America/Punta_Arenas' || tz === 'Pacific/Easter') return 'CLP';
    if (tz === 'Europe/London' || tz === 'Europe/Belfast') return 'GBP';
    if (tz.startsWith('America/') && !tz.includes('Santiago')) return 'USD';

    return 'EUR';
  } catch {
    return 'EUR';
  }
}

export function formatMoney(amount, currencyCode = 'EUR') {
  const tiers = getCurrencyTiers();
  const tier = tiers[currencyCode] || tiers.EUR;
  const rounded = Math.round(Number(amount) || 0);
  if (tier.code === 'CLP') {
    return `$${rounded.toLocaleString('es-CL')} CLP`;
  }
  if (tier.code === 'CHF') {
    return `CHF ${rounded.toLocaleString('de-CH')}`;
  }
  return `${tier.symbol}${rounded.toLocaleString('en-US')}${tier.suffix}`;
}

export function getCourseTierKey(course) {
  if (!course) return 'bachelor';
  if (COURSE_TIER_MAP[course.id]) return COURSE_TIER_MAP[course.id];
  if (course.category === 'ib') return 'ib';
  if (course.category === 'master') return 'master';
  return 'bachelor';
}

export function getCourseHourlyRate(course, currencyCode = 'EUR') {
  const tiers = getCurrencyTiers();
  const tier = tiers[currencyCode] || tiers.EUR;
  const key = getCourseTierKey(course);
  return tier.rates[key] || tier.rates.bachelor;
}

export function getCoursePackRate(course, currencyCode = 'EUR') {
  const tiers = getCurrencyTiers();
  const tier = tiers[currencyCode] || tiers.EUR;
  const key = getCourseTierKey(course);
  return tier.packs8h[key] || tier.packs8h.bachelor;
}

// ============================================================================
// LOGARITHMIC GROUP SCALING ENGINE: P_total(N) = P_1 * (1 + k * ln(N))
// With k = 0.65:
// - N = 1 (Solo):      Total = 1.00x P_1 | Per student = 1.000x P_1 (0% off)
// - N = 2 (+1 colega): Total = 1.45x P_1 | Per student = 0.725x P_1 (-28% off each)
// - N = 3 (+2 colegas):Total = 1.71x P_1 | Per student = 0.571x P_1 (-43% off each)
// - N = 4 (+3 colegas):Total = 1.90x P_1 | Per student = 0.475x P_1 (-52% off each)
// ============================================================================
export const GROUP_LOG_K = 0.65;

export function roundCurrencyClean(amount, currencyCode = 'EUR') {
  const val = Number(amount) || 0;
  if (currencyCode === 'CLP') {
    return Math.round(val / 500) * 500;
  }
  return Math.round(val);
}

export function getGroupPricing(baseSingleHourly, studentsCount = 1, currencyCode = 'EUR') {
  const n = Math.max(1, Math.min(4, Number(studentsCount) || 1));
  const p1 = Number(baseSingleHourly) || 0;
  if (n === 1) {
    return {
      n: 1,
      totalFactor: 1,
      perStudentHourly: p1,
      totalGroupHourly: p1,
      studentDiscountPct: 0,
      tutorBonusPct: 0
    };
  }
  const totalFactor = 1 + GROUP_LOG_K * Math.log(n);
  const rawPerStudent = (p1 * totalFactor) / n;
  const perStudentHourly = roundCurrencyClean(rawPerStudent, currencyCode);
  const totalGroupHourly = perStudentHourly * n;
  const studentDiscountPct = p1 > 0 ? Math.round((1 - perStudentHourly / p1) * 100) : 0;
  const tutorBonusPct = p1 > 0 ? Math.round((totalGroupHourly / p1 - 1) * 100) : 0;

  return {
    n,
    totalFactor,
    perStudentHourly,
    totalGroupHourly,
    studentDiscountPct,
    tutorBonusPct
  };
}

