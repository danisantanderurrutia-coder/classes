// ============================================================================
// GEO-PRICING & PURCHASING-POWER PARITY (PPP) ENGINE
// Automatically adapts tuition rates to local purchasing power (Ability-to-Pay)
// ============================================================================

export const CURRENCY_TIERS = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    suffix: '',
    flag: '🇪🇺',
    labelEn: 'EUR (€) • Europe / Germany',
    labelEs: 'EUR (€) • Europa / Alemania',
    shortLabel: 'EUR €',
    tierNameEn: 'Standard European Anchor (DE / NL / ES / EU)',
    tierNameEs: 'Ancla Europea Estándar (Alemania / Países Bajos / España)',
    pppIndex: '1.00x (Base)',
    rates: {
      ib: 50,
      bachelor: 55,
      mechanics: 60,
      master: 65,
    },
    packs8h: {
      ib: 360,
      bachelor: 390,
      mechanics: 430,
      master: 470,
    },
    paymentMethods: ['SEPA IBAN', 'PayPal', 'Wise', 'Revolut'],
    rationaleEs:
      'Tarifa base competitiva para universidades alemanas (LUH, TUM, RWTH, KIT), Países Bajos (TU Delft) y colegios internacionales en la Eurozona.',
    rationaleEn:
      'Competitive baseline rate for German universities (LUH, TUM, RWTH, KIT), Netherlands (TU Delft), and Eurozone international schools.',
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    suffix: '',
    flag: '🇨🇭',
    labelEn: 'CHF (Fr.) • Switzerland',
    labelEs: 'CHF (Fr.) • Suiza',
    shortLabel: 'CHF',
    tierNameEn: 'High Purchasing Power Tier (+55% • Switzerland)',
    tierNameEs: 'Tier Alta Capacidad de Pago (+55% • Suiza)',
    pppIndex: '1.55x (Premium)',
    rates: {
      ib: 75,
      bachelor: 85,
      mechanics: 90,
      master: 95,
    },
    packs8h: {
      ib: 520,
      bachelor: 590,
      mechanics: 620,
      master: 660,
    },
    paymentMethods: ['SEPA / IBAN (CHF/EUR)', 'Wise', 'Revolut', 'PayPal'],
    rationaleEs:
      'En Suiza (ETH Zürich, EPFL, UZH y colegios IB en Ginebra/Zúrich/Basilea), una hora de tutoría especializada cuesta entre 80 y 130 CHF. Cobrar más refleja el alto poder adquisitivo local y evita que perciban el servicio como de baja gama.',
    rationaleEn:
      'In Switzerland (ETH Zürich, EPFL, UZH, and Geneva/Zurich IB schools), specialist STEM mentoring ranges from 80 to 130 CHF/h. Pricing in this tier matches local purchasing power and signals high academic authority.',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    suffix: '',
    flag: '🇬🇧',
    labelEn: 'GBP (£) • United Kingdom',
    labelEs: 'GBP (£) • Reino Unido',
    shortLabel: 'GBP £',
    tierNameEn: 'UK Academic Tier (+20% Real Value)',
    tierNameEs: 'Tier Reino Unido (+20% Valor Real)',
    pppIndex: '1.20x (High)',
    rates: {
      ib: 55,
      bachelor: 60,
      mechanics: 65,
      master: 70,
    },
    packs8h: {
      ib: 380,
      bachelor: 420,
      mechanics: 450,
      master: 490,
    },
    paymentMethods: ['Wise (UK Sort Code / IBAN)', 'Revolut', 'PayPal'],
    rationaleEs:
      'Ajustado al mercado británico (Imperial, UCL, King’s, Bristol y colegios IB/A-Level de Londres), donde las familias e internacionales pagan en libras esterlinas con mayor poder adquisitivo.',
    rationaleEn:
      'Calibrated for the UK university and IB/A-Level market (Imperial, UCL, King’s), leveraging strong GBP purchasing power.',
  },
  USD: {
    code: 'USD',
    symbol: 'US$',
    suffix: '',
    flag: '🌎',
    labelEn: 'USD ($) • USA & International',
    labelEs: 'USD ($) • EE.UU. e Internacional',
    shortLabel: 'USD $',
    tierNameEn: 'Global / North America Premium Tier (+25%)',
    tierNameEs: 'Tier Global / Norteamérica (+25%)',
    pppIndex: '1.25x (High)',
    rates: {
      ib: 65,
      bachelor: 70,
      mechanics: 75,
      master: 85,
    },
    packs8h: {
      ib: 450,
      bachelor: 480,
      mechanics: 520,
      master: 580,
    },
    paymentMethods: ['Wise', 'PayPal', 'International Wire'],
    rationaleEs:
      'Para estudiantes en EE. UU., Canadá o programas internacionales fuera de Europa/Chile habituados a tarifas de mentoría STEM de 70–120 USD/h.',
    rationaleEn:
      'For students in the US, Canada, or global international programs accustomed to 70–120 USD/h specialist STEM rates.',
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    suffix: ' CLP',
    flag: '🇨🇱',
    labelEn: 'CLP ($) • Chile',
    labelEs: 'CLP ($) • Chile',
    shortLabel: 'CLP $',
    tierNameEn: 'Chile Adapted Purchasing Power Tier (Beauchef / PUC / IB)',
    tierNameEs: 'Tier Chile Ajustado por Capacidad de Pago (Beauchef / PUC / IB)',
    pppIndex: '0.68x (Ajuste PPP Local)',
    rates: {
      ib: 35000,
      bachelor: 38000,
      mechanics: 40000,
      master: 45000,
    },
    packs8h: {
      ib: 240000,
      bachelor: 260000,
      mechanics: 275000,
      master: 310000,
    },
    paymentMethods: ['Transferencia Bancaria Chile (CLP)', 'Wise', 'PayPal'],
    rationaleEs:
      'Adaptado al poder adquisitivo chileno para captar alumnos de Plan Común de Ingeniería (U. de Chile FCFM, PUC, USM, UdeC) y colegios IB de alto ingreso en Santiago, aprovechando directamente tu prestigio como Geofísico de la U. de Chile + Doble M.Sc. en Alemania.',
    rationaleEn:
      'Adapted to Chilean purchasing power for top engineering faculties (U. de Chile FCFM, PUC, USM) and Santiago IB schools, leveraging your U. de Chile Geophysics + German Double M.Sc. pedigree.',
  },
};

export const CURRENCY_LIST = Object.values(CURRENCY_TIERS);

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
    if (saved && CURRENCY_TIERS[saved]) return saved;

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
  const tier = CURRENCY_TIERS[currencyCode] || CURRENCY_TIERS.EUR;
  const rounded = Math.round(Number(amount) || 0);
  if (tier.code === 'CLP') {
    return `$${rounded.toLocaleString('es-CL')} CLP`;
  }
  if (tier.code === 'CHF') {
    return `CHF ${rounded.toLocaleString('de-CH')}`;
  }
  return `${tier.symbol}${rounded.toLocaleString('en-US')}${tier.suffix}`;
}

export function getCourseHourlyRate(course, currencyCode = 'EUR') {
  const tier = CURRENCY_TIERS[currencyCode] || CURRENCY_TIERS.EUR;
  if (!course) return tier.rates.bachelor;
  if (course.id === 'mechanics') return tier.rates.mechanics;
  if (course.category === 'ib') return tier.rates.ib;
  if (course.category === 'master') return tier.rates.master;
  return tier.rates.bachelor;
}

export function getCoursePackRate(course, currencyCode = 'EUR') {
  const tier = CURRENCY_TIERS[currencyCode] || CURRENCY_TIERS.EUR;
  if (!course) return tier.packs8h.bachelor;
  if (course.id === 'mechanics') return tier.packs8h.mechanics;
  if (course.category === 'ib') return tier.packs8h.ib;
  if (course.category === 'master') return tier.packs8h.master;
  return tier.packs8h.bachelor;
}
