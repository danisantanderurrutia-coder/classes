import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  MapPin,
  Globe,
  Megaphone,
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Printer,
  Send,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Columns,
  Table,
  Compass,
  MessageSquare,
  TrendingUp,
  Sliders,
  Clock,
  RotateCcw,
  Save,
  Award,
  Zap,
  Share2,
  Download,
  Eye
} from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import {
  DEFAULT_CURRENCY_TIERS,
  SUBJECT_COMPLEXITY_TIERS,
  getCurrencyTiers,
  saveCustomCurrencyRates,
  resetCustomCurrencyRates,
  convertToEur,
  formatMoney,
  getGroupPricing
} from './pricingConfig';

const BASE_SITE_URL = 'https://danisantanderurrutia-coder.github.io/classes/';

const KANBAN_COLUMNS = [
  { id: 'New Inquiry', label: '1. Nueva Consulta', dot: 'bg-sky-400', border: 'border-sky-500/30' },
  { id: 'Diagnostic Booked', label: '2. Diagnóstico Agendado', dot: 'bg-amber-400', border: 'border-amber-500/30' },
  { id: 'Active Student', label: '3. Alumno Activo', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  { id: 'Completed / Exam Passed', label: '4. Examen Aprobado', dot: 'bg-indigo-400', border: 'border-indigo-500/30' },
  { id: 'Archived', label: '5. Archivado', dot: 'bg-slate-500', border: 'border-slate-700' }
];

const PAYMENT_METHODS = [
  'SEPA IBAN',
  'Transferencia Chile',
  'Wise',
  'PayPal',
  'Trueque / Intercambio',
  'Acuerdo Solidario',
  'Efectivo (Hannover)'
];

const WHATSAPP_SUBJECT_PRESETS = [
  {
    id: 'calculo',
    tier: 'ib',
    nameEs: 'Cálculo I, II y III / Análisis (Nivel 1)',
    nameEn: 'Calculus I, II & III / Analysis (Tier 1)',
    simUrl: `${BASE_SITE_URL}?src=wa-calc#toolkit`,
    simLabelEs: 'el visualizador de Series de Taylor y Ecuaciones Diferenciales de mi plataforma',
    simLabelEn: 'the interactive Taylor Series & Differential Equations visualizer on my platform'
  },
  {
    id: 'fisica_mecanica',
    tier: 'ib',
    nameEs: 'Física Clásica: Mecánica y Ondas (Nivel 1)',
    nameEn: 'Classical Physics: Mechanics & Waves (Tier 1)',
    simUrl: `${BASE_SITE_URL}?src=wa-mech#lab`,
    simLabelEs: 'mi Laboratorio Interactivo con Diagramas de Cuerpo Libre (DCL) en vivo',
    simLabelEn: 'my Interactive Physics Lab with live Free Body Diagrams (DCL)'
  },
  {
    id: 'ib_diploma',
    tier: 'ib',
    nameEs: 'IB Diploma: Physics & Math AA/AI HL (Nivel 1)',
    nameEn: 'IB Diploma: Physics & Math AA/AI HL (Tier 1)',
    simUrl: `${BASE_SITE_URL}?src=wa-ib#lab`,
    simLabelEs: 'mi Laboratorio de 14 simuladores físicos y hojas de estudio en PDF',
    simLabelEn: 'my 14-problem interactive Physics Lab and printable PDF study sheets'
  },
  {
    id: 'algebra_edos',
    tier: 'bachelor',
    nameEs: 'Álgebra Lineal, Matrices y EDOs (Nivel 2)',
    nameEn: 'Linear Algebra, Matrices & ODEs (Tier 2)',
    simUrl: `${BASE_SITE_URL}?src=wa-linalg#toolkit`,
    simLabelEs: 'el Toolkit interactivo de Transformaciones Matriciales 2D, Autovalores y EDOs',
    simLabelEn: 'the interactive 2D Matrix Transformations, Eigenvalues & ODEs Toolkit'
  },
  {
    id: 'electro_termo',
    tier: 'bachelor',
    nameEs: 'Electromagnetismo y Termodinámica (Nivel 2)',
    nameEn: 'Electromagnetism & Thermodynamics (Tier 2)',
    simUrl: `${BASE_SITE_URL}?src=wa-thermo#lab`,
    simLabelEs: 'el simulador de Ciclos Termodinámicos P-V y Campos Vectoriales 2D',
    simLabelEn: 'the interactive P-V Thermodynamic Cycles & 2D Vector Fields simulator'
  },
  {
    id: 'fluidos_geofisica',
    tier: 'master',
    nameEs: 'Mecánica de Fluidos y Geofísica (Nivel 3)',
    nameEn: 'Fluid Mechanics & Geophysics (Tier 3)',
    simUrl: `${BASE_SITE_URL}?src=wa-fluids#lab`,
    simLabelEs: 'los simuladores de Flujo de Poiseuille, Viento Geostrófico y Ondas Sísmicas de mi web',
    simLabelEn: 'the Poiseuille Flow, Geostrophic Wind & Seismic Waves simulators on my site'
  },
  {
    id: 'python_ia',
    tier: 'master',
    nameEs: 'Python Científico (NumPy/SciPy) + IA Productiva (Nivel 3)',
    nameEn: 'Scientific Python (NumPy/SciPy) + Productive AI (Tier 3)',
    simUrl: `${BASE_SITE_URL}?src=wa-python#piad`,
    simLabelEs: 'mi metodología PIAD™ para diseñar y verificar código científico en Python con IA',
    simLabelEn: 'my PIAD™ workflow for designing and verifying scientific Python code with AI'
  }
];

const INITIAL_CHANNELS = [
  {
    id: 'ch-kleinanzeigen-de',
    country: '🇩🇪 Alemania (Hannover)',
    platform: 'Kleinanzeigen.de (Título en Alemán -> Clase EN/ES)',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Precio gancho: Ab 25 €/h. Categoría: Unterricht & Kurse -> Nachhilfe. Renovar cada 5 días.'
  },
  {
    id: 'ch-kleinanzeigen-en',
    country: '🇩🇪 Alemania (Expat/IB)',
    platform: 'Kleinanzeigen.de (Anuncio en Inglés)',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Enfocado en familias expat, IB Diploma (ISH) y programas internacionales (Ab 25 €/h).'
  },
  {
    id: 'ch-luh-brett',
    country: '🇩🇪 Alemania (Hannover)',
    platform: 'Leibniz Uni Hannover • Schwarzes Brett / AStA',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.asta-hannover.de',
    notes: 'Jobbörse / Nachhilfe digital y grupos estudiantiles de Maschinenbau e Ingeniería.'
  },
  {
    id: 'ch-tutti',
    country: '🇨🇭 Suiza (ETH / EPFL / IB)',
    platform: 'Tutti.ch (Zürich / Basel / Bern)',
    currency: 'CHF',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tutti.ch',
    notes: 'Mercado alto poder adquisitivo (42–55 CHF/h). Sigue siendo económico para Suiza y rinde ~€48/h.'
  },
  {
    id: 'ch-anibis',
    country: '🇨🇭 Suiza (Ginebra / Lausanne)',
    platform: 'Anibis.ch (Suiza Romanda / EPFL)',
    currency: 'CHF',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.anibis.ch',
    notes: 'Ideal para estudiantes de EPFL y colegios IB en Ginebra/Lausanne (42–55 CHF/h).'
  },
  {
    id: 'cl-tusclases',
    country: '🇨🇱 Chile (FCFM / UC / USM)',
    platform: 'Tusclasesparticulares.cl / Superprof.cl',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tusclasesparticulares.cl',
    notes: 'Precio tracción: $20.000 CLP/h para Cálculo/Física I ($17.000/h en pack). Destacar Geofísico U. de Chile.'
  },
  {
    id: 'cl-yapo',
    country: '🇨🇱 Chile',
    platform: 'Yapo.cl (Servicios / Clases)',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.yapo.cl',
    notes: 'Ideal para captar alumnos de Plan Común de Ingeniería ($20.000 CLP/h) y grupos de 2–3 amigos.'
  },
  {
    id: 'es-tusclases',
    country: '🇪🇸 España',
    platform: 'Tusclasesparticulares.com / Milanuncios',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tusclasesparticulares.com',
    notes: 'Desde €25/h para Cálculo y Física I. Destacar Método PIAD™ y simuladores interactivos.'
  },
  {
    id: 'uk-gumtree',
    country: '🇬🇧 UK / 🇳🇱 Países Bajos',
    platform: 'Gumtree UK / Marktplaats.nl',
    currency: 'GBP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.gumtree.com',
    notes: 'Enfocado en A-Levels, IB Diploma y Bachelor en Ingeniería (£24–£34/h).'
  }
];

const INITIAL_STREET_LOCATIONS = [
  { id: 'st-1', place: 'Hauptgebäude LUH (Welfengarten 1) - Tablones junto a cafetería y pasillos', zone: 'Nordstadt / Mitte', status: 'pendiente', flyersCount: 5, qrTag: 'flyer-luh-main' },
  { id: 'st-2', place: 'TIB Technik / Naturwissenschaften (Welfengarten 1B) - Entrada y lockers', zone: 'Nordstadt', status: 'pendiente', flyersCount: 4, qrTag: 'flyer-tib' },
  { id: 'st-3', place: 'Campus Maschinenbau Garbsen (LUH) - Comedor (Mensa) y edificio central', zone: 'Garbsen', status: 'pendiente', flyersCount: 5, qrTag: 'flyer-garbsen' },
  { id: 'st-4', place: 'Hochschule Hannover (HsH - Ricklinger Stadtweg) - Facultad de Ingeniería', zone: 'Linden / Ricklingen', status: 'pendiente', flyersCount: 4, qrTag: 'flyer-hsh' },
  { id: 'st-5', place: 'International School Hannover Region (ISH) - Cafés cercanos y paradas ÜSTRA', zone: 'Mitte / Maschsee', status: 'pendiente', flyersCount: 4, qrTag: 'flyer-ish' },
  { id: 'st-6', place: 'Bibliotecas públicas y cafés de estudio en Nordstadt / E-Damm / Lister Meile', zone: 'Nordstadt / List', status: 'pendiente', flyersCount: 5, qrTag: 'flyer-cafe' }
];

const INITIAL_LEADS = [
  {
    id: 'lead-demo-1',
    name: 'Lukas M. (Ejemplo)',
    subject: 'Höhere Mathematik I (Cálculo)',
    university: 'Leibniz Universität Hannover (LUH)',
    countryCurrency: 'EUR',
    mode: 'In-Person Hannover',
    quotedRate: '25',
    hoursTotal: 8,
    hoursCompleted: 2,
    paymentStatus: 'paid',
    paymentMethod: 'SEPA IBAN',
    contact: '+49 176 ... (Kleinanzeigen)',
    status: 'Active Student',
    date: '2026-10-20',
    notes: 'Pack 8h Cálculo I. Explicaciones en inglés sobre su Skript en alemán.'
  },
  {
    id: 'lead-demo-2',
    name: 'Matías R. (Ejemplo)',
    subject: 'Cálculo I & Física Mecánica',
    university: 'FCFM U. de Chile (Plan Común)',
    countryCurrency: 'CLP',
    mode: 'Online',
    quotedRate: '20000',
    hoursTotal: 4,
    hoursCompleted: 1,
    paymentStatus: 'pending',
    paymentMethod: 'Transferencia Chile',
    contact: '+56 9 ... (WhatsApp)',
    status: 'Diagnostic Booked',
    date: '2026-10-20',
    notes: 'Entró por el precio de $20.000 CLP/h para Cálculo y probó el DCL en el Lab.'
  }
];

const AD_TEMPLATES = [
  {
    id: 'ad-de',
    badge: '🇩🇪🇨🇭 Kleinanzeigen / Tutti.ch (Título en Alemán -> Clase EN/ES)',
    title: 'Nachhilfe Mathematik, Analysis, Physik & Python (Uni / FH / IB) – M.Sc. Ingenieur – Ab 25 €',
    priceNote: 'Alemania: 25 €/h (Cálculo/Física/IB), 29 €/h (Álgebra/EDOs), 35 €/h (Fluidos/Python) | Suiza: 42–55 CHF/h',
    body: `Steht deine Klausur in Höherer Mathematik (Analysis / Lineare Algebra), Technischer Mechanik, Physik, Fluiddynamik oder Python bevor?

Ich bin Daniel S. Santander Urrutia, Geophysiker und Ingenieur mit Doppel-Masterabschluss (M.Sc.) in Europa. Ich biete strukturierte, hochwirksame 1-zu-1 Mentorships (Online oder Präsenz in Hannover) an.

⚠️ WICHTIGER HINWEIS ZUR SPRACHE:
Der Unterricht findet auf ENGLISCH oder SPANISCH statt (ich spreche kein Deutsch). 
ABER: Du kannst mir problemlos deine deutschen Vorlesungsfolien (Skripte), Übungsblätter und Altklausuren schicken! Mathematische Gleichungen, Freikörperbilder (DCL) und physikalische Gesetze sind universell.

🚀 WAS MEINE METHODE EINZIGARTIG MACHT (PIAD™-Methode & Interaktives Labor):
• Eigenes Interaktives Physik- & Mathe-Labor: Auf meiner Website kannst du vorab 14 interaktive Echtzeit-Simulatoren mit Freikörperbildern (DCL) und ein 5-Säulen Mathe-Toolkit (Taylor, Eigenwerte, ODEs, FFT) kostenlos testen.
• Produktive KI für Python: Ich zeige dir, wie du KI als wissenschaftlichen Co-Piloten nutzt, um sauberen Python-Code (NumPy/SciPy/Matplotlib) zu schreiben und zu verstehen.
• Open-Knowledge Artefakte: Nach jeder Sitzung erhältst du alle Herleitungen als hochauflösendes Vektor-PDF (Miro-Board + druckbares Study Sheet).

💰 FAIRE PREISE NACH FACH-LEVEL:
• Level 1 (Analysis I–II, Klassische Physik, IB / Abitur): 25 €/Std. (im 8h-Paket nur ~21 €/Std.!)
• Level 2 (Lineare Algebra, DGL/ODEs, Technische Mechanik): 29 €/Std.
• Level 3 (Fluiddynamik, Geophysik, Wissenschaftliches Python & Masterarbeit): 35 €/Std.
• Präsenz in Hannover (TIB, LUH Campus): Kleiner Aufpreis für die Anfahrt.
• Kostenloses 15-minütiges Diagnosegespräch vorab!

🌐 Teste mein interaktives Labor: ${BASE_SITE_URL}?src=kleinanzeigen-de
📲 Schreib mir direkt auf WhatsApp (Englisch oder Spanisch): +49 176 7649 7440`
  },
  {
    id: 'ad-cl-es',
    badge: '🇨🇱🇪🇸 Chile (Yapo / Tusclasesparticulares) & España — Tarifas Escalonadas por Ramo',
    title: 'Clases Cálculo, Física, Álgebra, Fluidos y Python (Geofísico U. de Chile + Doble M.Sc. Europa)',
    priceNote: 'Chile: $20.000 CLP/h (Cálculo/Física I), $23.000 (Álgebra/EDOs), $26.000 (Fluidos/Python) | España: €25–€35/h',
    body: `¿Se acerca tu control, certamen o examen de Cálculo I–III, Física Mecánica, Álgebra Lineal, Ecuaciones Diferenciales, Mecánica de Fluidos o Python?

Soy Daniel S. Santander Urrutia, Geofísico de la Universidad de Chile (FCFM - Beauchef) e Ingeniero con Doble Máster (M.Sc.) en Europa. Hago clases particulares 1-a-1 y a grupos pequeños con una plataforma interactiva propia.

🚀 ¿POR QUÉ APRENDERÁS MÁS RÁPIDO CONMIGO? (MÉTODO PIAD™):
• Laboratorio Interactivo Propio (14 Simuladores + DCL en vivo): En mi web puedes practicar gratis con problemas reales de controles de la U. de Chile (Beauchef) y universidades europeas, viendo los vectores de fuerza y el paso a paso entre Álgebra y Cálculo.
• Toolkit Matemático de 5 Pilares: Visualizador en tiempo real de Series de Taylor, Matrices/Autovalores, EDOs, Gradientes y Transformada de Fourier (FFT).
• IA Productiva para Python: Aprende a usar la Inteligencia Artificial con rigor matemático para estructurar y auditar tu propio código en NumPy, SciPy y Matplotlib.
• Apuntes en PDF Vectorial: Al terminar cada clase te envío el PDF de alta resolución de nuestra pizarra Miro + Hojas de Estudio resumidas.

💰 TARIFAS SEGÚN COMPLEJIDAD DEL RAMO (CHILE / EUROPA):
• Nivel 1 (Cálculo I–II, Física Mecánica, Bachillerato IB / PAES): $20.000 CLP/h (€25/h en Europa) — ¡Con Pack de Examen (-15%) te queda en $17.000 CLP/h, o en grupo de hasta 3 amigos (-30%) en $14.000 CLP/h cada uno!
• Nivel 2 (Álgebra Lineal, EDOs, Electromagnetismo y Termodinámica): $23.000 CLP/h (€29/h).
• Nivel 3 (Mecánica de Fluidos, Geofísica, Python Científico y Tesis): $26.000 CLP/h (€35/h).

🎯 Agenda 15 minutos de diagnóstico GRATIS y prueba los simuladores en:
🌐 ${BASE_SITE_URL}?src=clasificados-cl
📲 WhatsApp directo: +49 176 7649 7440`
  },
  {
    id: 'ad-en',
    badge: '🇬🇧🌍 International / IB Diploma / UK / Expat (English)',
    title: 'IB & University Calculus, Physics & Python Mentor (Double M.Sc.) | Interactive Lab – From €25 / £24',
    priceNote: 'Tier 1 (Calculus/Physics/IB): €25 / £24 / $28 | Tier 2: €29 / £28 | Tier 3 (Fluids/Python): €35 / £34',
    body: `Struggling with IB Physics/Math HL, University Calculus, Linear Algebra, Fluid Mechanics, or Scientific Python?

Hi! I’m Daniel S. Santander Urrutia, a Geophysicist and Double M.Sc. Engineer based in Hannover, Germany. I help university students (B.Sc. / M.Sc.) and IB Diploma students master STEM subjects through visual intuition rather than rote memorization.

🚀 WHY LEARN WITH ME? (THE PIAD™ METHOD):
1. Free Body Diagrams (DCL) & Visual Intuition First: Before touching any integral, we sketch the physical system and force vectors so you never get stuck on a blank exam page.
2. 14-Simulator Interactive Physics Lab & 5-Pillar Math Toolkit: Explore my custom web platform featuring real university exam problems, live Algebra ↔ Calculus bridges, and printable PDF Study Sheets.
3. Productive AI for Python: Learn how to prompt AI with mathematical precision to design, debug, and verify your own Python (NumPy, SciPy, Matplotlib) simulations.
4. Open-Knowledge PDF Artifacts: Every session includes exported vector PDF notes from our collaborative Miro whiteboard.

💰 TRANSPARENT RATES BY SUBJECT COMPLEXITY:
• Tier 1 (Calculus I–II, General Physics, IB Diploma): €25/h (£24 / $28 / 42 CHF) — or save 15% with an Exam Sprint Pack!
• Tier 2 (Linear Algebra, ODEs, Analytical Mechanics, Electromagnetism): €29/h (£28 / $32 / 48 CHF)
• Tier 3 (Fluid Mechanics, Geophysics, Scientific Python & Thesis): €35/h (£34 / $38 / 55 CHF)
• Online Worldwide or In-Person in Hannover (in-person classes include a small travel extra).

🎯 Book a FREE 15-minute diagnostic call & test the interactive simulators at:
🌐 ${BASE_SITE_URL}?src=classifieds-en
📲 WhatsApp: +49 176 7649 7440`
  }
];

const FLYER_PRESETS = {
  de_en: {
    name: '🇩🇪 Hannover / Uni Alemana (DE + EN)',
    badge: 'OPEN KNOWLEDGE STEM MENTORSHIP • HANNOVER & ONLINE',
    headline: 'KLAUSUR IN GEFAHR? STRUGGLING WITH UNI MATH, PHYSICS OR PYTHON?',
    subheadline: '1-on-1 Mentorship by a Geophysicist & Double M.Sc. Engineer • From 25 €/h (Packs from ~21 €/h)',
    languageNotice: '📌 Honest Language Note: Sessions are taught in ENGLISH or SPANISH. Send me your German Skripte, Übungsblätter & Altklausuren — math, physics diagrams (DCL) and code are universal!',
    bullets: [
      'Tier 1 (25 €/h): Calculus / Analysis I–II, Classical Physics & IB Diploma / Abitur',
      'Tier 2 (29 €/h): Linear Algebra, Eigenvalues, ODEs, Analytical Mechanics & Electromagnetism',
      'Tier 3 (35 €/h): Fluid Dynamics, Geophysics, Scientific Python (NumPy/SciPy) & Thesis Support',
      'Includes: Free access to 14-Problem Interactive Physics Lab + Vector PDF Notes after every session'
    ],
    footerCallout: 'Free 15-min Diagnostic Call • Online or In-Person in Hannover (in-person class has a small travel extra)',
    tearOffTitle: 'Math/Physics/Python • Ab 25€',
    qrTag: 'flyer-hannover-de'
  },
  ib_en: {
    name: '🌍 International & IB Diploma (EN)',
    badge: 'IB DIPLOMA & UNIVERSITY STEM MENTORSHIP',
    headline: 'MASTER IB & UNIVERSITY MATH, PHYSICS & PYTHON WITH VISUAL INTUITION',
    subheadline: 'Geophysicist & Double M.Sc. Engineer • The PIAD™ Scientific Inquiry Method • From €25/h',
    languageNotice: '📌 Bilingual Mentorship (English & Spanish) • Online Worldwide & In-Person in Hannover (extra for travel)',
    bullets: [
      'IB Physics & Math (AA / AI — SL & HL): Exam paper drills, Internal Assessments (IA) & lab graphs (€25/h)',
      'Interactive 14-Problem Physics Lab: Live Free Body Diagrams (DCL) & Algebra ↔ Calculus toggle',
      '5-Pillar Applied Math Toolkit: Taylor Series, 2D Matrices, Damped ODEs, Vector Fields & FFT Signals',
      'Productive AI for Python: Learn to design & verify scientific code + get full Miro Vector PDF notes'
    ],
    footerCallout: 'Scan the QR Code to test the 14 Interactive Simulators for free & book your 15-min diagnostic!',
    tearOffTitle: 'IB & Uni STEM Mentor • €25/h',
    qrTag: 'flyer-ib-en'
  },
  es_latam: {
    name: '🇨🇱🇪🇸 Ingeniería & Ciencias (Español)',
    badge: 'MENTORÍA CIENTÍFICA ABIERTA • MÉTODO PIAD™',
    headline: '¿PROBLEMAS CON CÁLCULO, FÍSICA, ÁLGEBRA LINEAL, FLUIDOS O PYTHON?',
    subheadline: 'Geofísico U. de Chile (FCFM) & Doble M.Sc. en Ingeniería en Europa • Desde $20.000 CLP/h (€25/h)',
    languageNotice: '📌 Clases Online en vivo (Pizarra Miro con entrega de PDF Vectorial) o Grupales (hasta 3 amigos con 30% dcto.)',
    bullets: [
      'Nivel 1 ($20.000 CLP / €25): Cálculo I–II, Física Mecánica, Ondas y Bachillerato IB / PAES',
      'Nivel 2 ($23.000 CLP / €29): Álgebra Lineal, EDOs, Mecánica Clásica, Electromagnetismo y Termodinámica',
      'Nivel 3 ($26.000 CLP / €35): Mecánica de Fluidos, Geofísica, Python Científico + IA y Tesis',
      'Laboratorio Web con 14 Simuladores: Diagramas de Cuerpo Libre (DCL) y controles reales resueltos paso a paso'
    ],
    footerCallout: 'Escanea el código QR para probar gratis el Laboratorio Interactivo y agendar 15 min de diagnóstico.',
    tearOffTitle: 'Mate/Física/Python • $20k CLP',
    qrTag: 'flyer-es'
  }
};

function getRecommendedLabLink(subject = '') {
  const s = subject.toLowerCase();
  if (s.includes('fluid') || s.includes('geof') || s.includes('meteo') || s.includes('poiseuille')) {
    return { label: 'Simulador Geofísica / Fluidos', url: `${BASE_SITE_URL}?src=lead-lab#lab` };
  }
  if (s.includes('álgebra') || s.includes('algebra') || s.includes('taylor') || s.includes('cálculo') || s.includes('calculo') || s.includes('math') || s.includes('hm') || s.includes('mathe')) {
    return { label: 'Toolkit Matemático 5 Pilares', url: `${BASE_SITE_URL}?src=lead-toolkit#toolkit` };
  }
  if (s.includes('python') || s.includes('code') || s.includes('num')) {
    return { label: 'Método PIAD™ & Python IA', url: `${BASE_SITE_URL}?src=lead-python#piad` };
  }
  return { label: 'Lab 14 Problemas (DCL en vivo)', url: `${BASE_SITE_URL}?src=lead-physics#lab` };
}

function getDaysSince(dateStr) {
  if (!dateStr) return null;
  const posted = new Date(dateStr);
  if (isNaN(posted.getTime())) return null;
  const now = new Date();
  const diffTime = now.getTime() - posted.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export default function Admin({ onBack }) {
  const [activeTab, setActiveTab] = useState('strategy');
  const [copiedId, setCopiedId] = useState(null);
  const [pipelineView, setPipelineView] = useState('kanban');

  // Marketing & Social Studio State
  const [adminInstaLang, setAdminInstaLang] = useState('en');
  const [copiedMarketingKey, setCopiedMarketingKey] = useState(null);

  const handleCopyMarketing = (key, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMarketingKey(key);
        setTimeout(() => setCopiedMarketingKey(null), 2500);
      });
    }
  };

  // Live Pricing State (synced with localStorage so Admin can tweak rates live)
  const [liveTiers, setLiveTiers] = useState(() => getCurrencyTiers());
  const [priceSavedBanner, setPriceSavedBanner] = useState(false);

  // Monthly Revenue Goal in EUR
  const [monthlyGoalEur, setMonthlyGoalEur] = useState(() => {
    try {
      return Number(localStorage.getItem('ds_admin_goal_eur')) || 1200;
    } catch {
      return 1200;
    }
  });

  // WhatsApp Quick Closer Generator State
  const [waStudentName, setWaStudentName] = useState('');
  const [waLang, setWaLang] = useState('es');
  const [waIntent, setWaIntent] = useState('standard'); // 'standard' | 'barter' | 'solidarity'
  const [waSubjectId, setWaSubjectId] = useState('calculo');
  const [waCurrency, setWaCurrency] = useState('CLP');
  const [waMode, setWaMode] = useState('online');

  // Persisted Channels
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_channels_v3');
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // Persisted Street Boards
  const [streetLocations, setStreetLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_street_v3');
      return saved ? JSON.parse(saved) : INITIAL_STREET_LOCATIONS;
    } catch {
      return INITIAL_STREET_LOCATIONS;
    }
  });

  // Persisted Leads (CRM Pipeline)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_leads_v3');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [newLead, setNewLead] = useState({
    name: '',
    subject: '',
    university: '',
    countryCurrency: 'CLP',
    mode: 'Online',
    quotedRate: '20000',
    hoursTotal: 4,
    hoursCompleted: 0,
    paymentStatus: 'pending',
    paymentMethod: 'Transferencia Chile',
    contact: '',
    status: 'New Inquiry',
    notes: ''
  });

  // Printable A4 Flyer Generator state
  const [flyerPresetKey, setFlyerPresetKey] = useState('de_en');
  const [flyerInkSaving, setFlyerInkSaving] = useState(true);
  const [flyerTabsCount, setFlyerTabsCount] = useState(10);
  const [customFlyer, setCustomFlyer] = useState(FLYER_PRESETS.de_en);

  useEffect(() => {
    localStorage.setItem('ds_admin_channels_v3', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('ds_admin_street_v3', JSON.stringify(streetLocations));
  }, [streetLocations]);

  useEffect(() => {
    localStorage.setItem('ds_admin_leads_v3', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('ds_admin_goal_eur', String(monthlyGoalEur));
  }, [monthlyGoalEur]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Live Pricing Handlers
  const handleRateInputChange = (currCode, tierKey, value) => {
    const num = Math.max(0, Number(value) || 0);
    setLiveTiers((prev) => ({
      ...prev,
      [currCode]: {
        ...prev[currCode],
        rates: {
          ...prev[currCode].rates,
          [tierKey]: num
        }
      }
    }));
  };

  const handleSurchargeInputChange = (currCode, value) => {
    const num = Math.max(0, Number(value) || 0);
    setLiveTiers((prev) => ({
      ...prev,
      [currCode]: {
        ...prev[currCode],
        inPersonSurchargePerHour: num
      }
    }));
  };

  const handleSaveCustomPrices = () => {
    const customMap = {};
    for (const code of Object.keys(liveTiers)) {
      customMap[code] = {
        inPersonSurchargePerHour: liveTiers[code].inPersonSurchargePerHour,
        rates: liveTiers[code].rates
      };
    }
    saveCustomCurrencyRates(customMap);
    setLiveTiers(getCurrencyTiers());
    setPriceSavedBanner(true);
    setTimeout(() => setPriceSavedBanner(false), 3000);
  };

  const handleResetDefaultPrices = () => {
    resetCustomCurrencyRates();
    setLiveTiers(DEFAULT_CURRENCY_TIERS);
    setPriceSavedBanner(true);
    setTimeout(() => setPriceSavedBanner(false), 3000);
  };

  // Channels & Street Handlers
  const markChannelPostedToday = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'activo', lastPosted: today } : c))
    );
  };

  const toggleChannelStatus = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'activo' ? 'pendiente' : 'activo';
        return {
          ...c,
          status: nextStatus,
          lastPosted: nextStatus === 'activo' ? today : c.lastPosted
        };
      })
    );
  };

  const toggleStreetStatus = (id) => {
    setStreetLocations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'pegado' ? 'pendiente' : 'pegado' } : s))
    );
  };

  // CRM Lead Handlers
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.name.trim()) return;
    const item = {
      ...newLead,
      id: `lead-${Date.now()}`,
      hoursTotal: Number(newLead.hoursTotal) || 1,
      hoursCompleted: Number(newLead.hoursCompleted) || 0,
      date: new Date().toISOString().split('T')[0]
    };
    setLeads([item, ...leads]);
    const defaultRate = liveTiers[newLead.countryCurrency]?.rates?.ib || 25;
    setNewLead({
      name: '',
      subject: '',
      university: '',
      countryCurrency: newLead.countryCurrency,
      mode: 'Online',
      quotedRate: String(defaultRate),
      hoursTotal: 4,
      hoursCompleted: 0,
      paymentStatus: 'pending',
      paymentMethod: newLead.countryCurrency === 'CLP' ? 'Transferencia Chile' : 'SEPA IBAN',
      contact: '',
      status: 'New Inquiry',
      notes: ''
    });
  };

  const updateLeadStatus = (id, status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const toggleLeadPaymentStatus = (id) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, paymentStatus: l.paymentStatus === 'paid' ? 'pending' : 'paid' } : l
      )
    );
  };

  const adjustLeadHours = (id, delta) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const nextCompleted = Math.max(0, (Number(l.hoursCompleted) || 0) + delta);
        return { ...l, hoursCompleted: nextCompleted };
      })
    );
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Revenue & Operational Metrics for Mission Control
  const activeChannelsCount = channels.filter((c) => c.status === 'activo').length;
  const expiredChannelsCount = channels.filter((c) => {
    const days = getDaysSince(c.lastPosted);
    return c.status === 'activo' && days !== null && days >= 5;
  }).length;
  const activeStreetCount = streetLocations.filter((s) => s.status === 'pegado').length;
  const activeStudentsCount = leads.filter((l) => l.status === 'Active Student').length;

  // Calculate Confirmed Paid Revenue (EUR) & Pipeline Potential Revenue (EUR)
  const paidRevenueEur = leads.reduce((acc, l) => {
    if (l.paymentStatus !== 'paid') return acc;
    const rate = Number(l.quotedRate) || 0;
    const hrs = Math.max(Number(l.hoursTotal) || 1, Number(l.hoursCompleted) || 1);
    return acc + convertToEur(rate * hrs, l.countryCurrency);
  }, 0);

  const pipelineRevenueEur = leads.reduce((acc, l) => {
    if (l.status === 'Archived') return acc;
    const rate = Number(l.quotedRate) || 0;
    const hrs = Math.max(Number(l.hoursTotal) || 1, 1);
    return acc + convertToEur(rate * hrs, l.countryCurrency);
  }, 0);

  const totalHoursCompleted = leads.reduce((acc, l) => acc + (Number(l.hoursCompleted) || 0), 0);
  const goalProgressPct = Math.min(100, Math.round((paidRevenueEur / Math.max(monthlyGoalEur, 100)) * 100));

  // Build Dynamic WhatsApp Quick-Closer Message with Logarithmic Group Scaling (N = 1..4)
  const selectedWaSubject = WHATSAPP_SUBJECT_PRESETS.find((s) => s.id === waSubjectId) || WHATSAPP_SUBJECT_PRESETS[0];
  const selectedWaTierObj = liveTiers[waCurrency] || liveTiers.EUR;
  const waBaseHourly = selectedWaTierObj.rates[selectedWaSubject.tier] || selectedWaTierObj.rates.ib;
  const waInPersonExtra = selectedWaTierObj.inPersonSurchargePerHour || 0;
  const waFinalHourly = waBaseHourly + (waMode === 'inperson' ? waInPersonExtra : 0);
  const waPackHourly = Math.round(waFinalHourly * 0.85);
  const waG2 = getGroupPricing(waFinalHourly, 2, waCurrency);
  const waG3 = getGroupPricing(waFinalHourly, 3, waCurrency);
  const waG4 = getGroupPricing(waFinalHourly, 4, waCurrency);
  const waGroupHourly = waG3.perStudentHourly;

  let generatedWhatsAppMessage = '';
  if (waIntent === 'barter') {
    generatedWhatsAppMessage =
      waLang === 'es'
        ? `¡Hola${waStudentName ? ` ${waStudentName}` : ''}! Qué tal, te habla Daniel S. Santander Urrutia (Geofísico U. de Chile y Doble M.Sc. en Alemania).

¡Me parece una excelente iniciativa! En mi plataforma tengo un espacio dedicado al trueque porque creo firmemente en el intercambio directo de habilidades y talentos.

Acepto con gusto música, producción o instrumentos, videojuegos, sesiones de psicología, diseño u otros talentos creativos.

🔬 Cuéntame qué materia o examen estás preparando (puedes ver mis simuladores interactivos aquí: ${selectedWaSubject.simUrl}) y qué propuesta de trueque tienes en mente. ¿Te tinca que coordinemos una videollamada breve de 10 minutos por Meet para acordar un intercambio justo para ambos?`
        : `Hi${waStudentName ? ` ${waStudentName}` : ''}! This is Daniel S. Santander Urrutia (Geophysicist & Double M.Sc. Engineer).

I love this initiative! On my platform I actively welcome barter and skill exchanges because scientific education should be flexible and human.

I gladly accept music production/instruments, video games, psychology sessions, design, or other creative crafts.

🔬 Tell me which course you are preparing for (feel free to check out my interactive simulators here: ${selectedWaSubject.simUrl}) and what exchange you have in mind. Would you like to hop on a quick 10-minute call to agree on a fair exchange?`;
  } else if (waIntent === 'solidarity') {
    generatedWhatsAppMessage =
      waLang === 'es'
        ? `¡Hola${waStudentName ? ` ${waStudentName}` : ''}! Qué tal, te habla Daniel S. Santander Urrutia. Primero que todo, te agradezco mucho la honestidad y confianza al escribirme.

Quiero decirte con total claridad: la falta de dinero nunca debe ser una barrera para que aprendas física o matemáticas con rigor ni para que apruebes tu universidad. Totalmente podemos trabajar en ello y encontrar una solución juntos.

Cuéntame qué materia estás cursando, qué control o examen tienes cerca y cuál es tu situación actual: podemos coordinar un acuerdo solidario o una beca parcial adaptada a lo que realmente puedas aportar.

¿Qué horario te acomoda hoy o mañana para conversar 10 minutos con calma por Google Meet?`
        : `Hi${waStudentName ? ` ${waStudentName}` : ''}! This is Daniel S. Santander Urrutia. First of all, thank you for your honesty and trust in reaching out.

I want to be crystal clear: running short on funds should never stop you from mastering physics and calculus, nor from passing your exams. We can definitely work something out together.

Tell me which subject you are taking, which exam is coming up, and what your current situation looks like: we can arrange a flexible solidarity agreement or partial scholarship that fits your reality.

What time works best for a calm 10-minute chat on Google Meet today or tomorrow?`;
  } else {
    generatedWhatsAppMessage =
      waLang === 'es'
        ? `¡Hola${waStudentName ? ` ${waStudentName}` : ''}! Qué tal, te habla Daniel S. Santander Urrutia (Geofísico U. de Chile y Doble M.Sc. en Ingeniería en Europa).

Para *${selectedWaSubject.nameEs}*, trabajamos directo con tus guías y controles/exámenes anteriores usando pizarra vectorial Miro (te llevas el PDF en alta resolución al terminar cada clase) y mi método PIAD™.

🔬 Antes de nuestra sesión, puedes probar gratis ${selectedWaSubject.simLabelEs} aquí:
${selectedWaSubject.simUrl}

💰 *Valores (${waMode === 'inperson' ? 'Presencial en Hannover, incluye traslado' : 'Online en vivo'}):*
• *Individual (1-a-1):* ${formatMoney(waFinalHourly, waCurrency)}/h (o *${formatMoney(waPackHourly, waCurrency)}/h* en Pack de 8h con 15% dcto.)
• *Con +1 colega (2 personas, -${waG2.studentDiscountPct}% c/u):* ${formatMoney(waG2.perStudentHourly, waCurrency)}/h cada uno (Total: ${formatMoney(waG2.totalGroupHourly, waCurrency)}/h)
• *Con +2 colegas (3 personas, -${waG3.studentDiscountPct}% c/u):* ${formatMoney(waG3.perStudentHourly, waCurrency)}/h cada uno (Total: ${formatMoney(waG3.totalGroupHourly, waCurrency)}/h)
• *Con +3 colegas (4 personas, -${waG4.studentDiscountPct}% c/u):* ${formatMoney(waG4.perStudentHourly, waCurrency)}/h cada uno (Total: ${formatMoney(waG4.totalGroupHourly, waCurrency)}/h)

*(Nota: También acepto trueques de música/psicología/juegos o acuerdos solidarios si estás en una situación económica difícil).*

Si quieres, conectemos *15 minutos gratis* hoy o mañana por Google Meet para ver tu temario y armar el plan. ¿Qué horario te acomoda?`
        : `Hi${waStudentName ? ` ${waStudentName}` : ''}! This is Daniel S. Santander Urrutia (Geophysicist & Double M.Sc. Engineer).

For *${selectedWaSubject.nameEn}*, we work directly with your lecture notes (Skripte) and past exams on a collaborative Miro whiteboard (you receive the full vector PDF notes right after every session).

🔬 Before we start, you can test ${selectedWaSubject.simLabelEn} for free right here:
${selectedWaSubject.simUrl}

💰 *Tuition Rates (${waMode === 'inperson' ? 'In-Person in Hannover, incl. travel extra' : 'Live Online'}):*
• *Solo (1-on-1):* ${formatMoney(waFinalHourly, waCurrency)}/h (or *${formatMoney(waPackHourly, waCurrency)}/h* with the 8h Exam Sprint Pack -15%)
• *With +1 classmate (2 students, -${waG2.studentDiscountPct}% each):* ${formatMoney(waG2.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG2.totalGroupHourly, waCurrency)}/h total)
• *With +2 classmates (3 students, -${waG3.studentDiscountPct}% each):* ${formatMoney(waG3.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG3.totalGroupHourly, waCurrency)}/h total)
• *With +3 classmates (4 students, -${waG4.studentDiscountPct}% each):* ${formatMoney(waG4.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG4.totalGroupHourly, waCurrency)}/h total)

*(Note: I also gladly accept barter/skill exchange or solidarity arrangements if you are facing financial hardship).*

Would you like to hop on a *free 15-minute diagnostic call* on Google Meet today or tomorrow to review your syllabus and exam date?`;
  }

  const flyerTargetUrl = `${BASE_SITE_URL}?src=${encodeURIComponent(customFlyer.qrTag || 'flyer')}`;
  const flyerQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(flyerTargetUrl)}`;

  const handleSelectFlyerPreset = (key) => {
    setFlyerPresetKey(key);
    setCustomFlyer(FLYER_PRESETS[key]);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-sky-500/30">
      {/* Subtle Ambient Background Glows (hidden when printing) */}
      <div className="no-print pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Mission Control Header */}
      <header className="no-print sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  Mission Control • Daniel S. Santander Urrutia
                </span>
                <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                  $20.000 CLP / €25 Base • 3 Escalones por Materia
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Centro de Comando: Precios, Captación &amp; Conversión STEM
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/4917676497440"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center gap-2 border border-slate-700/80 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Web</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* ================================================================= */}
        {/* MISSION CONTROL HERO: MONTHLY REVENUE GOAL & KPI CARDS            */}
        {/* ================================================================= */}
        <div className="no-print bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 7 cols: Monthly Goal Tracker */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    Meta de Ingresos Mensual (Conversión Automática a EUR)
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">Tu Meta: €</span>
                  <input
                    type="number"
                    step="100"
                    min="200"
                    value={monthlyGoalEur}
                    onChange={(e) => setMonthlyGoalEur(Number(e.target.value) || 1000)}
                    className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-right"
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white">
                    €{paidRevenueEur}
                  </span>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    cobrados / €{monthlyGoalEur} meta ({goalProgressPct}%)
                  </span>
                </div>
                <div className="text-right font-mono text-xs text-sky-400">
                  Pipeline total: <strong>€{pipelineRevenueEur}</strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-300 transition-all duration-500"
                  style={{ width: `${Math.max(4, goalProgressPct)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <span>
                  💡 Con Cálculo a <strong>€25/h</strong> ($20.000 CLP/h), necesitas ~<strong>{Math.ceil(Math.max(0, monthlyGoalEur - paidRevenueEur) / 25)} horas</strong> para completar tu meta.
                </span>
                <span className="text-emerald-300">
                  Horas ya dictadas: <strong>{totalHoursCompleted}h</strong>
                </span>
              </div>
            </div>

            {/* Right 5 cols: 4 Compact KPI Pills */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase mb-1">
                  <span>Alumnos Activos</span>
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {activeStudentsCount} <span className="text-xs font-normal text-slate-500">/ {leads.length} leads</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase mb-1">
                  <span>Portales Activos</span>
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {activeChannelsCount} <span className="text-xs font-normal text-slate-500">/ {channels.length}</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase mb-1">
                  <span>Renovar (&gt;5 días)</span>
                  <AlertTriangle className={`w-3.5 h-3.5 ${expiredChannelsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {expiredChannelsCount}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase mb-1">
                  <span>Flyers en Calle</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {activeStreetCount} <span className="text-xs font-normal text-slate-500">/ {streetLocations.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (hidden on print) */}
        <div className="no-print flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
          {[
            { id: 'strategy', label: '1. Precios por Materia (Editor en Vivo)', icon: Sliders },
            { id: 'whatsapp', label: '2. Cerrador Rápido WhatsApp (60s)', icon: MessageSquare },
            { id: 'crm', label: '3. Pipeline CRM & Control de Horas/Pagos', icon: Columns },
            { id: 'classifieds', label: '4. Clasificados (5 Países) & Avisos', icon: Globe },
            { id: 'flyer', label: '5. Generador Flyer A4 Imprimible & Calle', icon: Printer },
            { id: 'marketing', label: '6. Social Media & Instagram Kit (Marketing)', icon: Megaphone }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-lg shadow-sky-600/20'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: LIVE SUBJECT-TIER PRICE EDITOR & GEO-PRICING MATRIX        */}
        {/* ================================================================= */}
        {activeTab === 'strategy' && (
          <div className="space-y-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    Tarifación Escalonada por Complejidad de Materia + Poder Adquisitivo (PPP)
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    Editor de Precios en Vivo (Sincronizado con la Calculadora Pública)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    Cálculo y Física I parten ahora en <strong>$20.000 CLP/h</strong> en Chile y <strong>€25/h</strong> en Europa para que te lleguen muchos más alumnos desde el primer día. Puedes modificar cualquier número aquí abajo y pulsar <strong>Guardar Cambios en la Web</strong> cuando quieras subir tus tarifas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleResetDefaultPrices}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Sugeridos ($20k / €25)</span>
                  </button>
                  <button
                    onClick={handleSaveCustomPrices}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Cambios en la Web</span>
                  </button>
                </div>
              </div>

              {priceSavedBanner && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>¡Precios actualizados! La calculadora pública y las tarjetas de cursos ya muestran estos valores.</span>
                </div>
              )}

              {/* The 3 Complexity Tiers Legend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUBJECT_COMPLEXITY_TIERS.map((st, idx) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-1.5"
                  >
                    <div className="font-mono text-xs font-bold text-sky-400">
                      {idx === 0 ? '🟢 ' : idx === 1 ? '🔵 ' : '🟣 '}
                      {st.badgeEs}
                    </div>
                    <div className="text-xs text-white font-semibold">{st.shortEs}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{st.coursesEs}</p>
                  </div>
                ))}
              </div>

              {/* Live Editable Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="py-3.5 px-4">País / Moneda</th>
                      <th className="py-3.5 px-4">🟢 Nivel 1: Cálculo, Física I &amp; IB (1h)</th>
                      <th className="py-3.5 px-4">🔵 Nivel 2: Álgebra, EDOs &amp; Mecánica (1h)</th>
                      <th className="py-3.5 px-4">🟣 Nivel 3: Fluidos, Geofísica &amp; Python (1h)</th>
                      <th className="py-3.5 px-4">Extra Presencial /h</th>
                      <th className="py-3.5 px-4">Pack 8h Nivel 1 (-15%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {Object.values(liveTiers).map((tier) => {
                      const pack8hTier1 = Math.round(tier.rates.ib * 8 * 0.85);
                      const perHourPack = Math.round(tier.rates.ib * 0.85);
                      return (
                        <tr key={tier.code} className="hover:bg-slate-800/30">
                          <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                            <span className="mr-2 text-base">{tier.flag}</span>
                            {tier.code} — {tier.labelEs.split('•')[1] || tier.code}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <input
                                type="number"
                                value={tier.rates.ib}
                                onChange={(e) => handleRateInputChange(tier.code, 'ib', e.target.value)}
                                className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold"
                              />
                              <span className="text-[11px] text-slate-400">{tier.code}/h</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <input
                                type="number"
                                value={tier.rates.bachelor}
                                onChange={(e) => handleRateInputChange(tier.code, 'bachelor', e.target.value)}
                                className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-sky-500/40 text-sky-300 font-bold"
                              />
                              <span className="text-[11px] text-slate-400">{tier.code}/h</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <input
                                type="number"
                                value={tier.rates.master}
                                onChange={(e) => handleRateInputChange(tier.code, 'master', e.target.value)}
                                className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300 font-bold"
                              />
                              <span className="text-[11px] text-slate-400">{tier.code}/h</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="text-slate-400">+</span>
                              <input
                                type="number"
                                value={tier.inPersonSurchargePerHour}
                                onChange={(e) => handleSurchargeInputChange(tier.code, e.target.value)}
                                className="w-20 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            <div className="font-bold text-emerald-400">
                              {formatMoney(pack8hTier1, tier.code)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ({formatMoney(perHourPack, tier.code)}/h efectivo)
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Logarithmic Group Scaling Visual Breakdown Card */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400 font-bold block">
                      Función Logarítmica de Escala Grupal: P_total(N) = P_1 · (1 + 0.65 · ln(N))
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Cómo sube tu Ingreso por Hora mientras baja lo que paga cada Colega (N = 1 a 4)
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-mono text-xs text-emerald-300 font-bold">
                    Efecto Viral: ¡El alumno invita amigos para pagar menos!
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { n: 1, title: 'N = 1 • Solo (1-a-1)', badge: 'Base 100%' },
                    { n: 2, title: 'N = 2 • Tú + 1 Colega', badge: '-28% c/u | +45% para ti' },
                    { n: 3, title: 'N = 3 • Tú + 2 Colegas', badge: '-43% c/u | +73% para ti' },
                    { n: 4, title: 'N = 4 • Tú + 3 Colegas', badge: '-53% c/u | +90% para ti' }
                  ].map((item) => {
                    const clpG = getGroupPricing(liveTiers.CLP.rates.ib, item.n, 'CLP');
                    const eurG = getGroupPricing(liveTiers.EUR.rates.ib, item.n, 'EUR');
                    const chfG = getGroupPricing(liveTiers.CHF.rates.ib, item.n, 'CHF');
                    return (
                      <div
                        key={item.n}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-white">{item.title}</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-bold">{item.badge}</div>
                        <div className="space-y-2 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <div className="text-slate-400 text-[10px]">🇨🇱 Cálculo Chile (Nivel 1):</div>
                            <div className="text-white font-bold">
                              Cada uno: {formatMoney(clpG.perStudentHourly, 'CLP')}/h
                            </div>
                            <div className="text-amber-300 font-bold">
                              Tu total: {formatMoney(clpG.totalGroupHourly, 'CLP')}/h
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <div className="text-slate-400 text-[10px]">🇪🇺 Cálculo Europa (Nivel 1):</div>
                            <div className="text-white font-bold">
                              Cada uno: {formatMoney(eurG.perStudentHourly, 'EUR')}/h
                            </div>
                            <div className="text-amber-300 font-bold">
                              Tu total: {formatMoney(eurG.totalGroupHourly, 'EUR')}/h
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                            <div className="text-slate-400 text-[10px]">🇨🇭 Cálculo Suiza (Nivel 1):</div>
                            <div className="text-white font-bold">
                              Cada uno: {formatMoney(chfG.perStudentHourly, 'CHF')}/h
                            </div>
                            <div className="text-amber-300 font-bold">
                              Tu total: {formatMoney(chfG.totalGroupHourly, 'CHF')}/h
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: WHATSAPP 60-SECOND CLOSER GENERATOR                        */}
        {/* ================================================================= */}
        {activeTab === 'whatsapp' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 cols: Selector Controls */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  Respuesta Instantánea de Alta Conversión
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Cerrador Rápido de WhatsApp
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cuando te escriban preguntando precios, selecciona la materia y moneda del alumno: el sistema arma la respuesta con el link al simulador exacto y la tarifa escalonada.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Tipo de Consulta / Propósito</label>
                  <div className="grid grid-cols-3 gap-1.5 font-mono">
                    <button
                      type="button"
                      onClick={() => setWaIntent('standard')}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold cursor-pointer text-center transition-all ${
                        waIntent === 'standard'
                          ? 'bg-sky-600/20 border-sky-500 text-sky-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💰 Tarifas
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaIntent('barter')}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold cursor-pointer text-center transition-all ${
                        waIntent === 'barter'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🔄 Trueque
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaIntent('solidarity')}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold cursor-pointer text-center transition-all ${
                        waIntent === 'solidarity'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🌱 Solidario
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Nombre del Alumno (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Sebastián / Lukas"
                    value={waStudentName}
                    onChange={(e) => setWaStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-slate-400 mb-1">Idioma del Mensaje</label>
                    <select
                      value={waLang}
                      onChange={(e) => setWaLang(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    >
                      <option value="es">🇪🇸 Español</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-slate-400 mb-1">País / Moneda</label>
                    <select
                      value={waCurrency}
                      onChange={(e) => setWaCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    >
                      {Object.values(liveTiers).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Materia / Nivel de Complejidad</label>
                  <select
                    value={waSubjectId}
                    onChange={(e) => setWaSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  >
                    {WHATSAPP_SUBJECT_PRESETS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {waLang === 'es' ? s.nameEs : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Modalidad</label>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <button
                      type="button"
                      onClick={() => setWaMode('online')}
                      className={`py-2 px-3 rounded-xl border cursor-pointer ${
                        waMode === 'online'
                          ? 'bg-sky-600/20 border-sky-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🌐 Online (Meet + Miro)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaMode('inperson')}
                      className={`py-2 px-3 rounded-xl border cursor-pointer ${
                        waMode === 'inperson'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      📍 Presencial (+Extra)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 cols: Live Message Preview & Copy */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      Vista Previa del Mensaje de WhatsApp
                    </span>
                    <div className="text-[11px] font-mono text-slate-400">
                      {waIntent === 'barter' && (
                        <span className="text-amber-300 font-semibold">🔄 Enfoque: Propuesta de trueque & intercambio de habilidades</span>
                      )}
                      {waIntent === 'solidarity' && (
                        <span className="text-emerald-300 font-semibold">🌱 Enfoque: Dificultades económicas / Acuerdo solidario y beca</span>
                      )}
                      {waIntent === 'standard' && (
                        <>1h: <strong>{formatMoney(waFinalHourly, waCurrency)}</strong> • Pack 8h (-15%): <strong>{formatMoney(waPackHourly, waCurrency)}/h</strong> • Grupo (-30%): <strong>{formatMoney(waGroupHourly, waCurrency)}/h</strong></>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedWhatsAppMessage, 'wa-msg')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    {copiedId === 'wa-msg' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === 'wa-msg' ? '¡Mensaje Copiado!' : 'Copiar para WhatsApp'}</span>
                  </button>
                </div>

                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200 bg-slate-950 p-5 rounded-2xl border border-slate-800 leading-relaxed">
                  {generatedWhatsAppMessage}
                </pre>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200 font-mono">
                💡 <strong>Tip de Cierre:</strong> Enviar el link al simulador de su ramo antes de hablar de horarios hace que el alumno vea que tienes una plataforma propia de ingeniería y acepte de inmediato los 15 minutos de diagnóstico.
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PIPELINE CRM (KANBAN + HOURS & PAYMENT TRACKING)           */}
        {/* ================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Registrar Nuevo Alumno / Lead</h2>
                  <p className="text-xs text-slate-400">
                    Al marcar un alumno como <strong>Pagado ✓</strong>, su monto se suma automáticamente a tu barra de Meta Mensual arriba.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
                  <button
                    onClick={() => setPipelineView('kanban')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                      pipelineView === 'kanban' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Kanban</span>
                  </button>
                  <button
                    onClick={() => setPipelineView('table')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                      pipelineView === 'table' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Tabla</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddLead} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Nombre del alumno *"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Ramo (ej. Cálculo I, Fluidos)"
                  value={newLead.subject}
                  onChange={(e) => setNewLead({ ...newLead, subject: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <input
                  type="text"
                  placeholder="Universidad / Colegio"
                  value={newLead.university}
                  onChange={(e) => setNewLead({ ...newLead, university: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <div className="flex gap-1.5">
                  <select
                    value={newLead.countryCurrency}
                    onChange={(e) => {
                      const code = e.target.value;
                      const defaultRate = liveTiers[code]?.rates?.ib || 25;
                      setNewLead({
                        ...newLead,
                        countryCurrency: code,
                        quotedRate: String(defaultRate),
                        paymentMethod: code === 'CLP' ? 'Transferencia Chile' : 'SEPA IBAN'
                      });
                    }}
                    className="px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  >
                    {Object.values(liveTiers).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Tarifa/h"
                    value={newLead.quotedRate}
                    onChange={(e) => setNewLead({ ...newLead, quotedRate: e.target.value })}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newLead.hoursTotal}
                    onChange={(e) => setNewLead({ ...newLead, hoursTotal: e.target.value })}
                    className="w-16 px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    title="Horas del plan"
                  />
                  <span className="text-slate-400 text-[11px]">hrs</span>
                  <select
                    value={newLead.mode}
                    onChange={(e) => setNewLead({ ...newLead, mode: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person Hannover">Presencial (+Extra)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Alumno</span>
                </button>
              </form>
            </div>

            {pipelineView === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {KANBAN_COLUMNS.map((col) => {
                  const colLeads = leads.filter((l) => l.status === col.id);
                  return (
                    <div
                      key={col.id}
                      className={`bg-slate-900/90 border ${col.border} rounded-2xl p-4 flex flex-col min-h-[430px]`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                          <span className="font-mono text-xs font-bold text-white">{col.label}</span>
                        </div>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 font-bold">
                          {colLeads.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colLeads.length === 0 && (
                          <div className="text-center py-10 text-xs text-slate-600 font-mono">
                            Sin alumnos en esta etapa
                          </div>
                        )}
                        {colLeads.map((lead) => {
                          const recLab = getRecommendedLabLink(lead.subject);
                          const hrsTotal = Math.max(1, Number(lead.hoursTotal) || 1);
                          const hrsDone = Number(lead.hoursCompleted) || 0;
                          const isPaid = lead.paymentStatus === 'paid';
                          return (
                            <div
                              key={lead.id}
                              className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5 text-xs shadow-md"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-bold text-white text-sm">{lead.name}</div>
                                  <div className="text-[11px] text-sky-400 font-mono">
                                    {lead.subject || 'STEM General'}
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {lead.university && (
                                <div className="text-[11px] text-slate-400">{lead.university}</div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono text-[10px]">
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30 font-bold">
                                  {formatMoney(lead.quotedRate, lead.countryCurrency)}/h
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleLeadPaymentStatus(lead.id)}
                                  className={`px-2 py-0.5 rounded border font-bold cursor-pointer transition-colors ${
                                    isPaid
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  }`}
                                >
                                  {isPaid ? '✓ Pagado' : '⏳ Pago Pendiente'}
                                </button>
                              </div>

                              {/* Hours Progress Control */}
                              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                                <span className="text-slate-300 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-sky-400" />
                                  Clases: <strong>{hrsDone}/{hrsTotal}h</strong>
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => adjustLeadHours(lead.id, -1)}
                                    className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => adjustLeadHours(lead.id, 1)}
                                    className="w-5 h-5 rounded bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* 1-Click Recommended Simulator Link */}
                              <button
                                onClick={() => copyToClipboard(recLab.url, `lab-${lead.id}`)}
                                className="w-full py-1.5 px-2 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-mono text-[10px] flex items-center justify-between gap-1 cursor-pointer transition-colors"
                              >
                                <span className="truncate flex items-center gap-1">
                                  <Compass className="w-3 h-3 shrink-0" />
                                  {copiedId === `lab-${lead.id}` ? '¡Link copiado!' : recLab.label}
                                </span>
                                <Copy className="w-3 h-3 shrink-0" />
                              </button>

                              <div className="pt-1 border-t border-slate-900">
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200"
                                >
                                  {KANBAN_COLUMNS.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
                      <th className="py-3.5 px-4">Alumno</th>
                      <th className="py-3.5 px-4">Materia &amp; Universidad</th>
                      <th className="py-3.5 px-4">Tarifa</th>
                      <th className="py-3.5 px-4">Horas</th>
                      <th className="py-3.5 px-4">Estado Pago</th>
                      <th className="py-3.5 px-4">Etapa</th>
                      <th className="py-3.5 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-white">{lead.name}</td>
                        <td className="py-3.5 px-4">
                          <div className="text-sky-400 font-mono">{lead.subject}</div>
                          <div className="text-[11px] text-slate-400">{lead.university}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {formatMoney(lead.quotedRate, lead.countryCurrency)}/h
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {lead.hoursCompleted || 0}/{lead.hoursTotal || 1}h
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleLeadPaymentStatus(lead.id)}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                              lead.paymentStatus === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {lead.paymentStatus === 'paid' ? '✓ Pagado' : '⏳ Pendiente'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                          >
                            {KANBAN_COLUMNS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: MULTI-COUNTRY CLASSIFIEDS TRACKER & COPY-PASTE ADS         */}
        {/* ================================================================= */}
        {activeTab === 'classifieds' && (
          <div className="space-y-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400 font-bold block mb-1">
                  Step A Checklist • Recordatorio Automático cada 5 Días
                </span>
                <h2 className="text-xl font-bold text-white">
                  Matriz de Portales de Clasificados (Alemania, Suiza, Chile, España, UK/NL)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Publica con los nuevos precios de tracción (<strong>Ab 25 €</strong> en Alemania/España, <strong>$20.000 CLP</strong> en Chile, <strong>42 CHF</strong> en Suiza) y renueva cada 5 días.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
                      <th className="py-3 px-4">País / Mercado</th>
                      <th className="py-3 px-4">Plataforma</th>
                      <th className="py-3 px-4">Moneda</th>
                      <th className="py-3 px-4">Última Publicación</th>
                      <th className="py-3 px-4">Estado / Alerta 5 Días</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {channels.map((ch) => {
                      const days = getDaysSince(ch.lastPosted);
                      const needsRenewal = ch.status === 'activo' && days !== null && days >= 5;
                      return (
                        <tr key={ch.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                            {ch.country}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{ch.platform}</span>
                              <a
                                href={ch.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-400 hover:text-sky-300"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-400">{ch.notes}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {ch.currency}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {ch.lastPosted ? (
                              <span>{ch.lastPosted} ({days === 0 ? 'hoy' : `hace ${days}d`})</span>
                            ) : (
                              <span className="text-slate-500">Sin publicar</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            {ch.status !== 'activo' ? (
                              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                                Pendiente
                              </span>
                            ) : needsRenewal ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3" />
                                Renovar (&gt;5 días)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" />
                                Activo al día
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => markChannelPostedToday(ch.id)}
                              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Publicado Hoy</span>
                            </button>
                            <button
                              onClick={() => toggleChannelStatus(ch.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] cursor-pointer"
                            >
                              {ch.status === 'activo' ? 'Pausar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Plantillas de Avisos con Precios Escalonados ($20.000 CLP / €25 Base + Método PIAD™)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {AD_TEMPLATES.map((ad) => (
                  <div key={ad.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-sky-400 block mb-1">
                          {ad.badge}
                        </span>
                        <h4 className="text-base font-bold text-white">{ad.title}</h4>
                        <span className="text-xs font-mono text-emerald-400">{ad.priceNote}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(ad.title, `${ad.id}-title`)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === `${ad.id}-title` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copiar Título</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(ad.body, `${ad.id}-body`)}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === `${ad.id}-body` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === `${ad.id}-body` ? '¡Texto Copiado!' : 'Copiar Anuncio Completo'}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                      {ad.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: PRINTABLE A4 FLYER GENERATOR (ABREISSZETTEL + QR) & STREET */}
        {/* ================================================================= */}
        {activeTab === 'flyer' && (
          <div className="space-y-10">
            <div className="no-print bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
                    Generador A4 con Pestañas Recortables (Abreißzettel) + Código QR Dinámico
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Diseñador de Carteles Imprimibles para Campus (LUH / TIB / HsH / Colegios IB)
                  </h2>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar PDF (A4)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-2">1. Idioma / Plantilla del Flyer</label>
                  <div className="flex flex-col gap-2">
                    {Object.entries(FLYER_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectFlyerPreset(key)}
                        className={`px-3 py-2 rounded-xl font-mono text-xs text-left border transition-all cursor-pointer ${
                          flyerPresetKey === key
                            ? 'bg-sky-600/20 border-sky-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">2. Titular Principal</label>
                    <input
                      type="text"
                      value={customFlyer.headline}
                      onChange={(e) => setCustomFlyer({ ...customFlyer, headline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">Subtítulo Académico</label>
                    <input
                      type="text"
                      value={customFlyer.subheadline}
                      onChange={(e) => setCustomFlyer({ ...customFlyer, subheadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">3. Etiqueta de Rastreo QR (?src=...)</label>
                    <input
                      type="text"
                      value={customFlyer.qrTag}
                      onChange={(e) => setCustomFlyer({ ...customFlyer, qrTag: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flyerInkSaving}
                        onChange={(e) => setFlyerInkSaving(e.target.checked)}
                        className="rounded border-slate-700"
                      />
                      <span>Modo Ahorro de Tinta (Fondo Blanco)</span>
                    </label>
                    <select
                      value={flyerTabsCount}
                      onChange={(e) => setFlyerTabsCount(Number(e.target.value))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                    >
                      <option value={10}>10 pestañas</option>
                      <option value={12}>12 pestañas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* PRINTABLE A4 FLYER PREVIEW */}
            <div className="flex justify-center">
              <div
                id="printable-a4-flyer"
                className="w-full max-w-[794px] bg-white text-slate-900 rounded-2xl border-2 border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between"
                style={{ minHeight: '1080px' }}
              >
                <div className="p-8 pb-6">
                  <div
                    className={`rounded-2xl p-6 mb-6 border-2 ${
                      flyerInkSaving
                        ? 'bg-white border-slate-900 text-slate-900'
                        : 'bg-slate-900 border-slate-900 text-white'
                    }`}
                  >
                    <div className="font-mono text-xs uppercase tracking-widest font-bold mb-2 text-sky-700">
                      {customFlyer.badge}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2">
                      {customFlyer.headline}
                    </h1>
                    <p className={`text-sm font-mono font-semibold ${flyerInkSaving ? 'text-slate-700' : 'text-slate-300'}`}>
                      {customFlyer.subheadline}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 border-2 border-slate-900 text-xs font-mono font-bold text-slate-900 mb-6 leading-relaxed">
                    {customFlyer.languageNotice}
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-center mb-6">
                    <div className="col-span-7 space-y-3">
                      <div className="font-mono text-xs uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-slate-900 pb-1">
                        SUBJECT TIERS &amp; INTERACTIVE STEM PLATFORM:
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-900 font-medium">
                        {customFlyer.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono font-extrabold text-slate-900">▸</span>
                            <span className="leading-snug">{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-50">
                          <div className="font-extrabold text-slate-900">14 LIVE SIMULATORS</div>
                          <div className="text-[10px] text-slate-700">Free Body Diagrams (DCL) &amp; Exam Steps</div>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-50">
                          <div className="font-extrabold text-slate-900">5-PILLAR MATH TOOLKIT</div>
                          <div className="text-[10px] text-slate-700">Taylor, Matrices, ODEs, Grad &amp; FFT</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-900 bg-white text-center">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold text-slate-900 mb-2">
                        SCAN TO TEST THE LAB FOR FREE
                      </span>
                      <img
                        src={flyerQrImageUrl}
                        alt="QR Code to STEM Platform"
                        className="w-40 h-40 object-contain border border-slate-300 rounded-lg p-1 mb-2"
                      />
                      <span className="font-mono text-[11px] font-extrabold text-slate-900">
                        WhatsApp: +49 176 7649 7440
                      </span>
                      <span className="font-mono text-[9px] text-slate-600 break-all mt-0.5">
                        danisantanderurrutia-coder.github.io/classes
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border-2 border-slate-900 bg-slate-50 text-center font-mono text-xs font-extrabold text-slate-900">
                    {customFlyer.footerCallout}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-900 bg-white px-4 pt-2 pb-4">
                  <div className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">
                    ✂️ Tear off a tab / Abreißzettel mitnehmen (WhatsApp &amp; Interactive STEM Lab QR) ✂️
                  </div>
                  <div
                    className="grid gap-0 border-2 border-slate-900"
                    style={{ gridTemplateColumns: `repeat(${flyerTabsCount}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: flyerTabsCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border-r last:border-r-0 border-dashed border-slate-900 p-1.5 flex flex-col items-center justify-between text-center"
                        style={{ minHeight: '210px' }}
                      >
                        <img
                          src={flyerQrImageUrl}
                          alt="QR"
                          className="w-11 h-11 object-contain mb-1"
                        />
                        <div
                          className="font-mono text-[9px] leading-tight text-slate-900 font-bold py-1"
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          {customFlyer.tearOffTitle}
                          {' • '}
                          WA: +49 176 7649 7440
                        </div>
                        <span className="font-mono text-[8px] font-extrabold text-slate-700 mt-1">
                          EN / ES
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="no-print bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Ruta de Tablones Físicos en Hannover (Schwarze Bretter)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streetLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{loc.place}</div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        Zona: {loc.zone} • Tag QR sugerido: <code className="text-sky-400">{loc.qrTag}</code>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleStreetStatus(loc.id)}
                      className={`px-3 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer shrink-0 ${
                        loc.status === 'pegado'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {loc.status === 'pegado' ? '✓ Cartel Pegado' : 'Marcar Pegado'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: SOCIAL MEDIA & INSTAGRAM KIT (MARKETING STUDIO)            */}
        {/* ================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header & Overview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Marketing Digital & Social Media Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Kit de Marketing para Redes Sociales & Difusión
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                    Piezas publicitarias en Ultra HD (2160×2160 y 2400×1260) con textos persuasivos listos para copiar y publicar en Instagram, LinkedIn, WhatsApp y portales estudiantiles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyMarketing('web_link', BASE_SITE_URL)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 hover:border-sky-400/50 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    {copiedMarketingKey === 'web_link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMarketingKey === 'web_link' ? '¡Link Copiado!' : 'Copiar Link Web'}</span>
                  </button>
                  <a
                    href={BASE_SITE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visitar Web en Vivo ↗</span>
                  </a>
                </div>
              </div>

              {/* Quick Marketing KPIs / Direct Asset Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-pink-400 font-bold">Post Instagram (2160px)</div>
                  <div className="text-white font-bold text-xs">Cuadrado 1:1 • Ultra HD Retina</div>
                  <div className="text-[11px] text-slate-400">Inglés y Español disponibles</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">Web Social Card (2400px)</div>
                  <div className="text-white font-bold text-xs">Paisaje 1.91:1 • Open Graph</div>
                  <div className="text-[11px] text-slate-400">Para WhatsApp, LinkedIn y Twitter</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Copywriting Copilot</div>
                  <div className="text-white font-bold text-xs">Textos con Emojis & Hashtags</div>
                  <div className="text-[11px] text-slate-400">Copia directa con un solo clic</div>
                </div>
              </div>
            </div>

            {/* SECTION 1: INSTAGRAM POST STUDIO (ULTRA HD 2160x2160) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-400/20">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Instagram Studio • Post Cuadrado 1:1</h3>
                    <p className="text-xs text-slate-400">Gráfico de alta definición para Feed, Carruseles y Stories (sin términos en alemán).</p>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="inline-flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAdminInstaLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      adminInstaLang === 'en'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇬🇧 English Version
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminInstaLang('es')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      adminInstaLang === 'es'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇪🇸 Versión en Español
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: 2160px Image Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square shadow-2xl">
                    <img
                      key={adminInstaLang}
                      src={adminInstaLang === 'es' ? './instagram_post_es.jpg' : './instagram_post_en.jpg'}
                      alt={`Instagram Post Preview (${adminInstaLang.toUpperCase()})`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg' : './instagram_post_en.jpg'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs font-bold border border-white/20 flex items-center gap-2 hover:bg-slate-900 transition-all"
                      >
                        <Eye className="w-4 h-4 text-pink-400" />
                        <span>Ver 2160px Ultra HD ↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Image specs & download buttons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Resolución: <b className="text-white">2160 × 2160 px</b> (Retina 2x)</span>
                      <span>Formato: <b className="text-white">JPG 98% (4:4:4)</b></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg' : './instagram_post_en.jpg'}
                        download={adminInstaLang === 'es' ? 'Daniel_S_Santander_Urrutia_Instagram_Post_ES_2160x2160.jpg' : 'Daniel_S_Santander_Urrutia_Instagram_Post_EN_2160x2160.jpg'}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-mono text-xs font-bold transition-all shadow-md shadow-pink-500/20"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Imagen ({adminInstaLang.toUpperCase()} 2160px)</span>
                      </a>
                      <a
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg' : './instagram_post_en.jpg'}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                        title="Abrir imagen completa en pestaña nueva"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Caption & Copywriting Copilot (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">
                      {adminInstaLang === 'en' ? '📝 Ready-to-Post Instagram Caption (English)' : '📝 Texto Listo para Publicar (Español)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const captionEn = `🚀 Master University Physics & Calculus with Mathematical Rigor & Physical Intuition!

Preparing for high-stakes university exam sessions or IB Higher Level Physics & Math?

I offer specialized 1-on-1 mentorship designed to bridge the gap between abstract concepts and airtight mathematical proofs:
🔬 PIAD Method™: From Physical Intuition & Free Body Diagrams to formal derivations
🔭 14 Interactive 3D Simulators: Hands-on exploration of orbital mechanics, optics, wavefunctions & oscillators
🎯 Exam Sprint Drills: Step-by-step scoring strategies to capture every partial credit point

👨‍🏫 Mentor: Daniel S. Santander Urrutia
🎓 Geophysicist (FCFM, Universidad de Chile) • Double M.Sc. (CAU Kiel, Germany)
📍 Hannover & 1-on-1 Online Worldwide (Fluent English & Spanish)

👉 Book your free 20-minute diagnostic session via link in bio!
🔗 danisantanderurrutia-coder.github.io/classes

#UniversityPhysics #Calculus #LinearAlgebra #IBPhysics #PhysicsTutor #STEMEducation #Hannover #MathTutor`;

                        const captionEs = `🚀 ¡Domina la Física y el Cálculo Universitario con Rigor Matemático e Intuición Física!

¿Preparando exámenes de grado, cálculo diferencial o física universitaria / IB Higher Level?

Te ofrezco mentoría 1-a-1 personalizada enfocada en entender los fundamentos a fondo y redactar demostraciones impecables:
🔬 Método PIAD™: Desde la intuición visual y diagramas DCL hasta el rigor matemático formal
🔭 14 Simuladores Interactivos: Laboratorio en tiempo real de mecánica orbital, óptica y física cuántica
🎯 Entrenamiento para Exámenes: Estrategias paso a paso para evitar errores algebraicos y asegurar todo el puntaje parcial

👨‍🏫 Tutor: Daniel S. Santander Urrutia
🎓 Geofísico (FCFM, Universidad de Chile) • Doble Máster en Ciencias (CAU Kiel, Alemania)
📍 Hannover, Alemania y Clases Online para todo el mundo (100% en Español o Inglés)

👉 Agenda tu sesión diagnóstica gratuita de 20 minutos en el enlace de la bio!
🔗 danisantanderurrutia-coder.github.io/classes

#FisicaUniversitaria #Calculo #AlgebraLineal #ClasesParticulares #Ingenieria #UniversidadDeChile #Hannover #TutorSTEM`;

                        handleCopyMarketing(adminInstaLang === 'en' ? 'caption_en' : 'caption_es', adminInstaLang === 'en' ? captionEn : captionEs);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedMarketingKey === (adminInstaLang === 'en' ? 'caption_en' : 'caption_es') ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMarketingKey === (adminInstaLang === 'en' ? 'caption_en' : 'caption_es') ? '¡Copiado!' : 'Copiar Texto Completo'}</span>
                    </button>
                  </div>

                  {/* Caption Text Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto">
                    {adminInstaLang === 'en' ? (
                      `🚀 Master University Physics & Calculus with Mathematical Rigor & Physical Intuition!

Preparing for high-stakes university exam sessions or IB Higher Level Physics & Math?

I offer specialized 1-on-1 mentorship designed to bridge the gap between abstract concepts and airtight mathematical proofs:
🔬 PIAD Method™: From Physical Intuition & Free Body Diagrams to formal derivations
🔭 14 Interactive 3D Simulators: Hands-on exploration of orbital mechanics, optics, wavefunctions & oscillators
🎯 Exam Sprint Drills: Step-by-step scoring strategies to capture every partial credit point

👨‍🏫 Mentor: Daniel S. Santander Urrutia
🎓 Geophysicist (FCFM, Universidad de Chile) • Double M.Sc. (CAU Kiel, Germany)
📍 Hannover & 1-on-1 Online Worldwide (Fluent English & Spanish)

👉 Book your free 20-minute diagnostic session via link in bio!
🔗 danisantanderurrutia-coder.github.io/classes

#UniversityPhysics #Calculus #LinearAlgebra #IBPhysics #PhysicsTutor #STEMEducation #Hannover #MathTutor`
                    ) : (
                      `🚀 ¡Domina la Física y el Cálculo Universitario con Rigor Matemático e Intuición Física!

¿Preparando exámenes de grado, cálculo diferencial o física universitaria / IB Higher Level?

Te ofrezco mentoría 1-a-1 personalizada enfocada en entender los fundamentos a fondo y redactar demostraciones impecables:
🔬 Método PIAD™: Desde la intuición visual y diagramas DCL hasta el rigor matemático formal
🔭 14 Simuladores Interactivos: Laboratorio en tiempo real de mecánica orbital, óptica y física cuántica
🎯 Entrenamiento para Exámenes: Estrategias paso a paso para evitar errores algebraicos y asegurar todo el puntaje parcial

👨‍🏫 Tutor: Daniel S. Santander Urrutia
🎓 Geofísico (FCFM, Universidad de Chile) • Doble Máster en Ciencias (CAU Kiel, Alemania)
📍 Hannover, Alemania y Clases Online para todo el mundo (100% en Español o Inglés)

👉 Agenda tu sesión diagnóstica gratuita de 20 minutos en el enlace de la bio!
🔗 danisantanderurrutia-coder.github.io/classes

#FisicaUniversitaria #Calculo #AlgebraLineal #ClasesParticulares #Ingenieria #UniversidadDeChile #Hannover #TutorSTEM`
                    )}
                  </div>

                  {/* Quick Hashtag Packs */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-500">Packs de Hashtags:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyMarketing('hash_physics', '#UniversityPhysics #Calculus #LinearAlgebra #IBPhysics #PhysicsTutor #STEMTutoring #Hannover #MathTutor')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedMarketingKey === 'hash_physics' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>#Physics & Math (EN)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyMarketing('hash_es', '#FisicaUniversitaria #Calculo #AlgebraLineal #ClasesParticulares #Ingenieria #UniversidadDeChile #TutorSTEM')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedMarketingKey === 'hash_es' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>#Física & Cálculo (ES)</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2: WEB SOCIAL CARD & OPEN GRAPH STUDIO (2400x1260) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Web Social Card Studio • Banner 1.91:1</h3>
                  <p className="text-xs text-slate-400">Banner Open Graph oficial para WhatsApp, LinkedIn, Telegram y Twitter/X.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: 2400x1260 Image Preview (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[1200/630] shadow-2xl">
                    <img
                      src="./og_banner_preview.jpg"
                      alt="Web Social Card Preview"
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href="./og_banner_preview.jpg"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs font-bold border border-white/20 flex items-center gap-2 hover:bg-slate-900 transition-all"
                      >
                        <Eye className="w-4 h-4 text-sky-400" />
                        <span>Ver 2400px Ultra HD ↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="./og_banner_preview.jpg"
                      download="Daniel_S_Santander_Urrutia_Social_Card_2400x1260.jpg"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Web Social Card (2400x1260)</span>
                    </a>
                    <a
                      href="./og_banner_preview.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                      title="Abrir imagen completa"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right: Broadcast message for WhatsApp & LinkedIn (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      💬 Difusión para WhatsApp & LinkedIn
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `👋 ¡Hola a todos! Para quienes estén preparando asignaturas de Física y Cálculo este semestre:

Daniel S. Santander Urrutia (Geofísico U. de Chile & Doble Máster en Ciencias CAU Kiel, radicado en Hannover) abrió cupos de mentoría individual 1-a-1:

🔹 Cálculo Diferencial, Integral, Multivariable y EDOs
🔹 Mecánica Clásica, Electromagnetismo, Termodinámica y Cuántica
🔹 14 Simuladores físicos interactivos en tiempo real con DCL
🔹 Método PIAD™: De la intuición física a la demostración matemática formal

Incluye sesión diagnóstica inicial gratuita de 20 minutos para revisar temarios y fijar el plan de estudio:
👉 ${BASE_SITE_URL}`;
                        handleCopyMarketing('wa_broadcast', msg);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-400/30 font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedMarketingKey === 'wa_broadcast' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMarketingKey === 'wa_broadcast' ? '¡Copiado!' : 'Copiar Mensaje'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                    {`👋 ¡Hola a todos! Para quienes estén preparando asignaturas de Física y Cálculo este semestre:

Daniel S. Santander Urrutia (Geofísico U. de Chile & Doble Máster en Ciencias CAU Kiel, radicado en Hannover) abrió cupos de mentoría individual 1-a-1:

🔹 Cálculo Diferencial, Integral, Multivariable y EDOs
🔹 Mecánica Clásica, Electromagnetismo, Termodinámica y Cuántica
🔹 14 Simuladores físicos interactivos en tiempo real con DCL
🔹 Método PIAD™: De la intuición física a la demostración matemática formal

Incluye sesión diagnóstica inicial gratuita de 20 minutos para revisar temarios y fijar el plan de estudio:
👉 ${BASE_SITE_URL}`}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
