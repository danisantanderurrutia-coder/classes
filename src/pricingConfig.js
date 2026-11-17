// ============================================================================
// GEO-PRICING, SUBJECT-COMPLEXITY TIERS & PURCHASING-POWER PARITY (PPP) ENGINE
// Supports live overrides from Admin Hub via localStorage ('ds_custom_pricing_v2')
// ============================================================================

export const CUSTOM_PRICING_STORAGE_KEY = 'ds_custom_pricing_v2';

// Course-to-Complexity-Tier mapping:
// - 'ib' (Tier 1: Cálculo I-II, Matemática Base, Física Plan Común, Bachillerato IB / PAES / Abitur / Cuántica Curiosos)
// - 'bachelor' (Tier 2: Álgebra Lineal, EDOs, Mecánica Analítica, Electromagnetismo)
// - 'master' (Tier 3: Física Atmosférica, Suelos & Hidrología, Python Científico, Tesis & Proyectos)
export const COURSE_TIER_MAP = {
  // Tier 1 • Fundamentos, Cálculo, Plan Común, Mentes Curiosas & Aficionados
  klausur: 'ib',
  math_bachelor: 'ib',
  physics_bachelor: 'ib',
  quantum_curious: 'ib',
  curious_minds: 'ib',
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
    badgeEs: 'Nivel 1 • Fundamentos & Mentes Curiosas',
    badgeEn: 'Tier 1 • Foundations & Curious Minds',
    shortEs: 'Cálculo, Física Base & Niños Curiosos',
    shortEn: 'Calculus, Physics I & Young Inquirers',
    coursesEs: 'Cálculo I–III, Matemática Base, Mentes Curiosas (Niños y Jóvenes 9–15 años), Cuántica para Curiosos, IB Diploma',
    coursesEn: 'Calculus I–III, Foundational Math, Curious Minds (Young Inquirers ages 9–15), Quantum Concepts, IB Diploma'
  },
  {
    id: 'bachelor',
    badgeEs: 'Nivel 2 • Ingeniería Intermedia',
    badgeEn: 'Tier 2 • Intermediate Engineering',
    shortEs: 'Álgebra, Mecánica & Electromagnetismo',
    shortEn: 'Linear Algebra, Mechanics & Electromagnetism',
    coursesEs: 'Álgebra Lineal, Mecánica Analítica, Electromagnetismo y Ecuaciones de Maxwell',
    coursesEn: 'Linear Algebra, Analytical Mechanics, Electromagnetism & Maxwell Equations'
  },
  {
    id: 'master',
    badgeEs: 'Nivel 3 • Avanzado, Datos & Tesis',
    badgeEn: 'Tier 3 • Advanced, Data & Thesis',
    shortEs: 'Atmósfera, Suelos, Datos & Tesis',
    shortEn: 'Atmosphere, Soils, Data & Thesis',
    coursesEs: 'Física Atmosférica, Física de Suelos & Hidrogeofísica, Python Científico & MATLAB, Tesis & Titulación',
    coursesEn: 'Atmospheric Physics, Soil Physics & Hydrogeophysics, Scientific Python & MATLAB, Thesis & Mentorship'
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
    ponderante: 1.00,
    ponderanteLabel: '1.00x (Base EUR)',
    ponderanteDescEs: 'Referencia base (1.00x): Es la tarifa estándar cobrada en Alemania y Europa Central (desde 15 €/h).',
    ponderanteDescEn: 'Base reference (1.00x): The standard baseline rate charged in Germany and Central Europe (from €15/h).',
    eurRate: 1.0,
    inPersonSurchargePerHour: 5,
    rates: {
      ib: 15,       // Nivel 1: Cálculo, Física I, IB (15 €/h)
      bachelor: 17, // Nivel 2: Álgebra Lineal, EDOs, Mecánica (17 €/h)
      mechanics: 17,
      master: 21    // Nivel 3: Fluidos, Geofísica, Python, Tesis (21 €/h)
    },
    packs8h: {
      ib: 102,      // ~12.75 €/h (-15%)
      bachelor: 116, // ~14.50 €/h (-15%)
      mechanics: 116,
      master: 143   // ~17.85 €/h (-15%)
    },
    paymentMethods: ['SEPA IBAN', 'PayPal', 'Wise', 'Revolut'],
    rationaleEs:
      'Piso súper accesible y competitivo de €15/h para Cálculo y Física Base que maximiza la captación y volumen en Alemania y España, escalando a €17/h en ramos intermedios y €21/h en Python/Geofísica/Tesis.',
    rationaleEn:
      'Super accessible €15/h entry point for Calculus & IB to maximize inquiry volume in Germany and Spain, scaling to €17/h for intermediate engineering and €21/h for Python/Geophysics/Thesis.'
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
    ponderante: 0.80,
    ponderanteLabel: '0.80x (Ajuste Real Chile)',
    ponderanteDescEs: 'Ponderante 0.80x: Calibrado a la capacidad de gasto de familias y universitarios en Chile ($12.000 CLP/h).',
    ponderanteDescEn: 'Weight 0.80x: Calibrated to Chilean university affordability ($12,000 CLP/h).',
    eurRate: 0.00098, // ~1.020 CLP = 1 EUR
    inPersonSurchargePerHour: 3500,
    rates: {
      ib: 12000,       // Nivel 1: Cálculo I-II, Física Base, IB/PAES ($12.000 CLP/h)
      bachelor: 14000, // Nivel 2: Álgebra Lineal, EDOs, Mecánica ($14.000 CLP/h)
      mechanics: 14000,
      master: 16000    // Nivel 3: Fluidos, Geofísica, Python + IA, Tesis ($16.000 CLP/h)
    },
    packs8h: {
      ib: 81600,      // $10.200 CLP/h (-15%)
      bachelor: 95200, // $11.900 CLP/h (-15%)
      mechanics: 95200,
      master: 108800   // $13.600 CLP/h (-15%)
    },
    paymentMethods: ['Transferencia Bancaria Chile (CLP)', 'Wise', 'PayPal'],
    rationaleEs:
      '$12.000 CLP/h para Cálculo y Física es una tarifa altamente competitiva y accesible en Chile, con packs de examen a ~$10.200/h y grupos de 2–3 amigos a ~$8.500/h cada uno, subiendo a $14.000 y $16.000 CLP/h para ramos avanzados de Beauchef/UC/USM.',
    rationaleEn:
      '$12,000 CLP/h for Calculus & Foundations offers extreme accessibility in Chile, with exam packs at ~$10,200/h and group rates down to ~$8,500/h per student.'
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
    ponderante: 1.65,
    ponderanteLabel: '1.65x (Poder Adquisitivo Suiza)',
    ponderanteDescEs: 'Ponderante 1.65x: Capacidad de gasto ~1.65 veces mayor que Alemania. 25 CHF/h es sumamente accesible en Suiza.',
    ponderanteDescEn: 'Weight 1.65x: Purchasing power ~1.65x higher than Germany. 25 CHF/h is highly accessible in Switzerland.',
    eurRate: 1.06,
    inPersonSurchargePerHour: 7,
    rates: {
      ib: 25,       // Nivel 1: Cálculo, Física I, IB (25 CHF/h)
      bachelor: 29, // Nivel 2: Álgebra, EDOs, Mecánica (29 CHF/h)
      mechanics: 29,
      master: 33    // Nivel 3: Fluidos, Geofísica, Python, Tesis (33 CHF/h)
    },
    packs8h: {
      ib: 170,
      bachelor: 197,
      mechanics: 197,
      master: 224
    },
    paymentMethods: ['SEPA / IBAN (CHF/EUR)', 'Wise', 'Revolut', 'PayPal'],
    rationaleEs:
      'Cobrar 25 a 33 CHF/h es extraordinariamente accesible para familias y universitarios suizos (ETH, EPFL, colegios IB), asegurando una alta tasa de conversión.',
    rationaleEn:
      'Pricing at 25–33 CHF/h is an exceptional bargain for Swiss families and students (ETH, EPFL, IB), maximizing student enrollment.'
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
    ponderante: 1.15,
    ponderanteLabel: '1.15x (GBP UK)',
    ponderanteDescEs: 'Ponderante 1.15x: Calibrado al mercado académico británico en libras (£15/h).',
    ponderanteDescEn: 'Weight 1.15x: Calibrated to the UK academic market in British pounds (£15/h).',
    eurRate: 1.18,
    inPersonSurchargePerHour: 5,
    rates: {
      ib: 15,
      bachelor: 17,
      mechanics: 17,
      master: 21
    },
    packs8h: {
      ib: 102,
      bachelor: 116,
      mechanics: 116,
      master: 143
    },
    paymentMethods: ['Wise (UK Sort Code / IBAN)', 'Revolut', 'PayPal'],
    rationaleEs:
      'Tarifa atractiva y accesible en libras (£15–£21/h) para captar rápido estudiantes de A-Levels, IB Diploma y pregrado de ingeniería en Reino Unido.',
    rationaleEn:
      'Highly competitive and affordable GBP pricing (£15–£21/h) calibrated to attract UK A-Level, IB Diploma, and engineering undergraduates.'
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
    ponderante: 1.10,
    ponderanteLabel: '1.10x (USD Global)',
    ponderanteDescEs: 'Ponderante 1.10x: Tarifa para colegios internacionales, familias expat y estudiantes en EE.UU. ($17 USD/h).',
    ponderanteDescEn: 'Weight 1.10x: Standard rate for international schools, expat families, and US students ($17 USD/h).',
    eurRate: 0.92,
    inPersonSurchargePerHour: 6,
    rates: {
      ib: 17,
      bachelor: 19,
      mechanics: 19,
      master: 23
    },
    packs8h: {
      ib: 116,
      bachelor: 129,
      mechanics: 129,
      master: 156
    },
    paymentMethods: ['Wise', 'PayPal', 'International Wire'],
    rationaleEs:
      'Rango de $17 a $23 USD/h ideal y muy asequible para familias internacionales, colegios americanos/IB y estudiantes universitarios globales.',
    rationaleEn:
      '$17–$23 USD/h range tailored and affordable for international families, American/IB schools, and global university students.'
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
  const tier = tiers[currencyCode] || tiers.EUR || DEFAULT_CURRENCY_TIERS.EUR;
  return Math.round((Number(amount) || 0) * (tier?.eurRate || 1));
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
  const tier = tiers[currencyCode] || tiers.EUR || DEFAULT_CURRENCY_TIERS.EUR;
  const rounded = Math.round(Number(amount) || 0);
  if (!tier) return `€${rounded}`;
  if (tier.code === 'CLP') {
    return `$${rounded.toLocaleString('es-CL')} CLP`;
  }
  if (tier.code === 'CHF') {
    return `CHF ${rounded.toLocaleString('de-CH')}`;
  }
  return `${tier.symbol || '€'}${rounded.toLocaleString('en-US')}${tier.suffix || ''}`;
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
  const tier = tiers[currencyCode] || tiers.EUR || DEFAULT_CURRENCY_TIERS.EUR;
  const key = getCourseTierKey(course);
  return tier?.rates?.[key] || tier?.rates?.bachelor || 15;
}

export function getCoursePackRate(course, currencyCode = 'EUR') {
  const tiers = getCurrencyTiers();
  const tier = tiers[currencyCode] || tiers.EUR || DEFAULT_CURRENCY_TIERS.EUR;
  const key = getCourseTierKey(course);
  return tier?.packs8h?.[key] || tier?.packs8h?.bachelor || 102;
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

