import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  QrCode,
  MapPin,
  Globe,
  Megaphone,
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
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
  Cpu
} from 'lucide-react';
import { CURRENCY_TIERS, formatMoney } from './pricingConfig';

const BASE_SITE_URL = 'https://danisantanderurrutia-coder.github.io/classes/';

const KANBAN_COLUMNS = [
  { id: 'New Inquiry', label: '1. Nueva Consulta', badgeClass: 'bg-sky-50 text-sky-800 border-sky-200' },
  { id: 'Diagnostic Booked', label: '2. Diagnóstico Agendado', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'Active Student', label: '3. Alumno Activo', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'Completed / Exam Passed', label: '4. Examen Aprobado', badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { id: 'Archived', label: '5. Archivado', badgeClass: 'bg-slate-100 text-slate-600 border-slate-300' }
];

const PAYMENT_METHODS = ['SEPA IBAN', 'Wise', 'PayPal', 'Transferencia Chile', 'Efectivo (Hannover)'];

const INITIAL_CHANNELS = [
  // Alemania / Hannover
  {
    id: 'ch-kleinanzeigen-de',
    country: '🇩🇪 Alemania (Hannover)',
    platform: 'Kleinanzeigen.de (Anuncio con título DE)',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Categoría: Unterricht & Kurse -> Nachhilfe. Renovar cada 5 días.'
  },
  {
    id: 'ch-kleinanzeigen-en',
    country: '🇩🇪 Alemania (Expat/IB)',
    platform: 'Kleinanzeigen.de (Anuncio en Inglés)',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Enfocado en familias expat, IB Diploma (ISH) y programas internacionales.'
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
  // Suiza (Alto poder adquisitivo)
  {
    id: 'ch-tutti',
    country: '🇨🇭 Suiza (ETH / EPFL / IB)',
    platform: 'Tutti.ch (Zürich / Basel / Bern)',
    currency: 'CHF',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tutti.ch',
    notes: 'Mercado premium en CHF (55–75 CHF/h). Publicar en inglés/alemán aclarando clases en EN/ES.'
  },
  {
    id: 'ch-anibis',
    country: '🇨🇭 Suiza (Ginebra / Lausanne)',
    platform: 'Anibis.ch (Suiza Romanda / EPFL)',
    currency: 'CHF',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.anibis.ch',
    notes: 'Excelente para estudiantes de EPFL y colegios IB en Ginebra/Lausanne (tarifa CHF).'
  },
  // España
  {
    id: 'es-tusclases',
    country: '🇪🇸 España',
    platform: 'Tusclasesparticulares.com',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tusclasesparticulares.com',
    notes: 'Destacar Método PIAD™, doble máster en Europa y simuladores interactivos.'
  },
  {
    id: 'es-milanuncios',
    country: '🇪🇸 España',
    platform: 'Milanuncios / Wallapop Servicios',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.milanuncios.com',
    notes: 'Renovar anuncio cada 5 días para mantenerse arriba en Ingeniería y Física.'
  },
  // Chile
  {
    id: 'cl-tusclases',
    country: '🇨🇱 Chile (FCFM / UC / USM)',
    platform: 'Tusclasesparticulares.cl / Superprof.cl',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.tusclasesparticulares.cl',
    notes: 'Gran gancho: Ex-alumno Geofísica U. de Chile (Beauchef) con controles reales resueltos en el Lab.'
  },
  {
    id: 'cl-yapo',
    country: '🇨🇱 Chile',
    platform: 'Yapo.cl (Servicios / Clases)',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.yapo.cl',
    notes: 'Ideal para captar alumnos de Plan Común de Ingeniería y Bachillerato IB en Santiago.'
  },
  // UK / NL
  {
    id: 'uk-gumtree',
    country: '🇬🇧 UK / 🇳🇱 Países Bajos',
    platform: 'Gumtree UK / Marktplaats.nl',
    currency: 'GBP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.gumtree.com',
    notes: 'Enfocado en A-Levels, IB Diploma y Bachelor en Ingeniería (cobro en GBP / EUR).'
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
    subject: 'Höhere Mathematik I / Linear Algebra',
    university: 'Leibniz Universität Hannover (LUH)',
    countryCurrency: 'EUR',
    mode: 'In-Person Hannover',
    quotedRate: '42',
    paymentMethod: 'SEPA IBAN',
    contact: '+49 176 ... (Kleinanzeigen)',
    status: 'Diagnostic Booked',
    date: '2026-10-20',
    notes: 'Prefiere explicaciones en inglés siguiendo su Skript en alemán. Quiere clase presencial en TIB.'
  },
  {
    id: 'lead-demo-2',
    name: 'Matías R. (Ejemplo)',
    subject: 'Mecánica de Fluidos / Geofísica',
    university: 'FCFM U. de Chile (Beauchef)',
    countryCurrency: 'CLP',
    mode: 'Online',
    quotedRate: '28000',
    paymentMethod: 'Transferencia Chile',
    contact: '+56 9 ... (WhatsApp)',
    status: 'New Inquiry',
    date: '2026-10-20',
    notes: 'Vio los problemas de viento geostrófico y Poiseuille en el Laboratorio Interactivo.'
  }
];

const AD_TEMPLATES = [
  {
    id: 'ad-de',
    badge: '🇩🇪🇨🇭 Kleinanzeigen / Tutti.ch (Título en Alemán -> Clase EN/ES)',
    title: 'Nachhilfe Mathematik, Physik & Python (Uni / FH / IB / Abitur) – M.Sc. Ingenieur',
    priceNote: '35 € VB (Alemania) | 55 CHF (Suiza) — Presencial en Hannover tiene pequeño costo extra',
    body: `Steht deine Klausur in Höherer Mathematik, Technischer Mechanik, Physik, Fluiddynamik oder Python-Programmierung bevor?

Ich bin Daniel Santander, Geophysiker und Ingenieur mit Doppel-Masterabschluss (M.Sc.) in Europa. Ich biete strukturierte, hochwirksame 1-zu-1 Mentorships (Online oder Präsenz in Hannover) an.

⚠️ WICHTIGER HINWEIS ZUR SPRACHE:
Der Unterricht findet auf ENGLISCH oder SPANISCH statt (ich spreche kein Deutsch). 
ABER: Du kannst mir problemlos deine deutschen Vorlesungsfolien (Skripte), Übungsblätter und Altklausuren schicken! Mathematische Gleichungen, Freikörperbilder (DCL) und physikalische Gesetze sind universell.

🚀 WAS MEINE METHODE EINZIGARTIG MACHT (PIAD™-Methode & Interaktives Labor):
• Eigenes Interaktives Physik- & Mathe-Labor: Auf meiner Website kannst du vorab 14 interaktive Echtzeit-Simulatoren mit Freikörperbildern (DCL) und ein 5-Säulen Mathe-Toolkit (Taylor, Eigenwerte, ODEs, FFT) kostenlos testen.
• Produktive KI für Python: Ich zeige dir, wie du KI als wissenschaftlichen Co-Piloten nutzt, um sauberen Python-Code (NumPy/SciPy/Matplotlib) zu schreiben und zu verstehen.
• Open-Knowledge Artefakte: Nach jeder Sitzung erhältst du alle Herleitungen als hochauflösendes Vektor-PDF (Miro-Board + druckbares Study Sheet).

📚 FÄCHER:
• Höhere Mathematik I–III: Analysis, Lineare Algebra, Differentialgleichungen, Vektoranalysis.
• Physik & Ingenieurwesen: Klassische Mechanik, Elektromagnetismus, Wellen, Thermodynamik, Fluiddynamik.
• Wissenschaftliches Programmieren: Python, NumPy, SciPy, Datenanalyse & Simulation.

📍 ORT & PREISE:
• Online (Google Meet + Miro): Ab 35 €/Std. (Bachelor/IB) | 15% Rabatt im 8h Klausur-Sprint-Paket.
• Präsenz in Hannover (TIB, LUH Campus, Café): Kleiner Aufpreis für die Anfahrt (+10 €/Std.).
• Kostenloses 15-minütiges Diagnosegespräch vorab!

🌐 Teste mein interaktives Labor: ${BASE_SITE_URL}?src=kleinanzeigen-de
📲 Schreib mir direkt auf WhatsApp (Englisch oder Spanisch): +49 176 7649 7440`
  },
  {
    id: 'ad-en',
    badge: '🇬🇧🌍 International / IB Diploma / UK / Expat (English)',
    title: 'IB & University Math, Physics & Python Tutor (Double M.Sc.) | Interactive STEM Lab',
    priceNote: 'EUR 35 / GBP 38 / CHF 55 / USD 42 (Adapted to region)',
    body: `Struggling with IB Physics/Math HL, University Calculus, Linear Algebra, Fluid Mechanics, or Scientific Python?

Hi! I’m Daniel Santander, a Geophysicist and Double M.Sc. Engineer based in Hannover, Germany. I help university students (B.Sc. / M.Sc.) and IB Diploma students master complex STEM subjects without rote memorization.

🚀 WHY LEARN WITH ME? (THE PIAD™ METHOD):
1. Free Body Diagrams (DCL) & Visual Intuition First: Before touching any integral, we sketch the physical system and force vectors so you never get stuck on a blank exam page.
2. 14-Simulator Interactive Physics Lab & 5-Pillar Math Toolkit: Explore my custom web platform featuring real university exam problems, live Algebra ↔ Calculus bridges, and printable PDF Study Sheets.
3. Productive AI for Python: Learn how to prompt AI with mathematical precision to design, debug, and verify your own Python (NumPy, SciPy, Matplotlib) simulations.
4. Open-Knowledge PDF Artifacts: Every session includes exported vector PDF notes from our collaborative Miro whiteboard.

📍 MODES:
• Online Worldwide (Google Meet + Vector Whiteboard)
• In-Person in Hannover (LUH / TIB / Cafés — in-person sessions include a small travel extra)

🎯 Book a FREE 15-minute diagnostic call & test the interactive simulators at:
🌐 ${BASE_SITE_URL}?src=classifieds-en
📲 WhatsApp: +49 176 7649 7440`
  },
  {
    id: 'ad-es',
    badge: '🇪🇸🇨🇱 España y Latinoamérica / FCFM / Ingeniería (Español)',
    title: 'Mentor de Física, Cálculo, Fluidos y Python (Doble M.Sc. Europa + Geofísico U. de Chile)',
    priceNote: '€35/h (España/Europa) | $25.000 CLP/h (Chile)',
    body: `¿Se acerca tu certamen, control o examen final de Cálculo, Álgebra Lineal, Física Clásica, Mecánica de Fluidos, Geofísica o Programación en Python?

Soy Daniel Santander, Geofísico de la Universidad de Chile (Beauchef) e Ingeniero con Doble Máster (M.Sc.) en Europa. Imparto mentorías 1-a-1 de alto rendimiento para estudiantes de Ingeniería, Ciencias y Bachillerato Internacional (IB).

🚀 ¿POR QUÉ MI METODOLOGÍA (MÉTODO PIAD™) ES DIFERENTE?
• Laboratorio Interactivo Propio (14 Simuladores + DCL en vivo): En mi web puedes practicar gratis con controles reales de la U. de Chile (FCFM) y universidades europeas, viendo cómo cambian los vectores de fuerza y el puente entre Álgebra y Cálculo.
• Toolkit Matemático de 5 Pilares: Visualizador interactivo de Series de Taylor, Autovalores ( Álgebra Lineal), EDOs, Gradientes 2D y Transformada de Fourier (FFT).
• IA Productiva para Programar en Python: Te enseño a usar la Inteligencia Artificial como copiloto científico para estructurar y auditar tu propio código en NumPy, SciPy y Matplotlib.
• Artefactos en PDF Vectorial: Al terminar cada sesión recibes el PDF de alta resolución de nuestra pizarra Miro + Hojas de Estudio descargables.

🎯 Agenda una llamada de diagnóstico GRATUITA de 15 minutos y prueba el laboratorio en:
🌐 ${BASE_SITE_URL}?src=clasificados-es
📲 WhatsApp directo: +49 176 7649 7440`
  }
];

const FLYER_PRESETS = {
  de_en: {
    name: '🇩🇪 Hannover / Uni Alemana (DE + EN)',
    badge: 'OPEN KNOWLEDGE STEM MENTORSHIP • HANNOVER & ONLINE',
    headline: 'KLAUSUR IN GEFAHR? STRUGGLING WITH UNI MATH, PHYSICS OR PYTHON?',
    subheadline: '1-on-1 Mentorship by a Geophysicist & Double M.Sc. Engineer (LUH / HsH / IB / Abitur)',
    languageNotice: '📌 Honest Language Note: Sessions are taught in ENGLISH or SPANISH. Send me your German Skripte, Übungsblätter & Altklausuren — math, physics diagrams (DCL) and code are universal!',
    bullets: [
      'Higher Mathematics: Calculus I–III, Linear Algebra, Eigenvalues, ODEs & Vector Analysis',
      'Physics & Engineering: Classical Mechanics, Electromagnetism, Waves, Thermodynamics & Fluids',
      'Scientific Python & Productive AI: NumPy, SciPy, Matplotlib & AI-assisted simulation design',
      'Includes: Interactive 14-Problem Physics Lab + Vector PDF Whiteboard Notes after every session'
    ],
    footerCallout: 'Free 15-min Diagnostic Call • Online or In-Person in Hannover (in-person class has a small travel extra)',
    tearOffTitle: 'STEM Mentorship (Math / Physics / Python)',
    qrTag: 'flyer-hannover-de'
  },
  ib_en: {
    name: '🌍 International & IB Diploma (EN)',
    badge: 'IB DIPLOMA & UNIVERSITY STEM MENTORSHIP',
    headline: 'MASTER IB & UNIVERSITY MATH, PHYSICS & PYTHON WITH VISUAL INTUITION',
    subheadline: 'Geophysicist & Double M.Sc. Engineer • The PIAD™ Scientific Inquiry Method',
    languageNotice: '📌 Bilingual Mentorship (English & Spanish) • Online Worldwide & In-Person in Hannover (extra for travel)',
    bullets: [
      'IB Physics & Math (AA / AI — SL & HL): Exam-style paper drills, Internal Assessments (IA) & lab graphs',
      'Interactive 14-Problem Physics Lab: Live Free Body Diagrams (DCL) & Algebra ↔ Calculus toggle',
      '5-Pillar Applied Math Toolkit: Taylor Series, 2D Matrices, Damped ODEs, Vector Fields & FFT Signals',
      'Productive AI for Python: Learn to design & verify scientific code + get full Miro Vector PDF notes'
    ],
    footerCallout: 'Scan the QR Code to test the 14 Interactive Simulators for free & book your 15-min diagnostic!',
    tearOffTitle: 'IB & Uni Math/Physics Mentor',
    qrTag: 'flyer-ib-en'
  },
  es_latam: {
    name: '🇪🇸🇨🇱 Ingeniería & Ciencias (Español)',
    badge: 'MENTORÍA CIENTÍFICA ABIERTA • MÉTODO PIAD™',
    headline: '¿PROBLEMAS CON CÁLCULO, FÍSICA, MECÁNICA DE FLUIDOS O PYTHON?',
    subheadline: 'Geofísico U. de Chile (FCFM) & Doble M.Sc. en Ingeniería en Europa • Clases 1-a-1',
    languageNotice: '📌 Clases Online en vivo (Pizarra Miro con entrega de PDF Vectorial) o Presenciales en Hannover (recargo por traslado)',
    bullets: [
      'Matemáticas Superiores: Cálculo I–III, Álgebra Lineal, Ecuaciones Diferenciales (EDOs) y Análisis Vectorial',
      'Física e Ingeniería: Mecánica Clásica, Electromagnetismo, Termodinámica, Fluidos y Geofísica',
      'Laboratorio Web con 14 Simuladores: Diagramas de Cuerpo Libre (DCL) y controles reales resueltos paso a paso',
      'IA Productiva para Python: Aprende a diseñar código científico en NumPy/SciPy sin depender de cajas negras'
    ],
    footerCallout: 'Escanea el código QR para probar gratis el Laboratorio Interactivo y agendar 15 min de diagnóstico.',
    tearOffTitle: 'Mentoría Mate / Física / Python',
    qrTag: 'flyer-es'
  }
};

// Recommends a direct simulator link based on subject keywords
function getRecommendedLabLink(subject = '') {
  const s = subject.toLowerCase();
  if (s.includes('fluid') || s.includes('geof') || s.includes('meteo') || s.includes('poiseuille')) {
    return { label: 'Simulador Geofísica / Fluidos (Viento Geostrófico)', url: `${BASE_SITE_URL}?src=lead-lab#lab` };
  }
  if (s.includes('álgebra') || s.includes('algebra') || s.includes('taylor') || s.includes('cálculo') || s.includes('calculo') || s.includes('math') || s.includes('hm') || s.includes('mathe')) {
    return { label: 'Toolkit Matemático 5 Pilares (Taylor / Matrices / EDOs)', url: `${BASE_SITE_URL}?src=lead-toolkit#toolkit` };
  }
  if (s.includes('termo') || s.includes('thermo') || s.includes('calor')) {
    return { label: 'Simulador Termodinámica (Ciclos PV / Adiabático)', url: `${BASE_SITE_URL}?src=lead-thermo#lab` };
  }
  return { label: 'Laboratorio Interactivo 14 Problemas (DCL + Examen)', url: `${BASE_SITE_URL}?src=lead-physics#lab` };
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
  const [pipelineView, setPipelineView] = useState('kanban'); // 'kanban' | 'table'

  // Persisted Channels
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_channels_v2');
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // Persisted Street Boards
  const [streetLocations, setStreetLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_street_v2');
      return saved ? JSON.parse(saved) : INITIAL_STREET_LOCATIONS;
    } catch {
      return INITIAL_STREET_LOCATIONS;
    }
  });

  // Persisted Leads (CRM Pipeline)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_leads_v2');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [newLead, setNewLead] = useState({
    name: '',
    subject: '',
    university: '',
    countryCurrency: 'EUR',
    mode: 'Online',
    quotedRate: '35',
    paymentMethod: 'SEPA IBAN',
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
    localStorage.setItem('ds_admin_channels_v2', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('ds_admin_street_v2', JSON.stringify(streetLocations));
  }, [streetLocations]);

  useEffect(() => {
    localStorage.setItem('ds_admin_leads_v2', JSON.stringify(leads));
  }, [leads]);

  const handleSelectFlyerPreset = (key) => {
    setFlyerPresetKey(key);
    setCustomFlyer(FLYER_PRESETS[key]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

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

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.name.trim()) return;
    const item = {
      ...newLead,
      id: `lead-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setLeads([item, ...leads]);
    setNewLead({
      name: '',
      subject: '',
      university: '',
      countryCurrency: 'EUR',
      mode: 'Online',
      quotedRate: '35',
      paymentMethod: 'SEPA IBAN',
      contact: '',
      status: 'New Inquiry',
      notes: ''
    });
  };

  const updateLeadStatus = (id, status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // KPIs
  const activeChannelsCount = channels.filter((c) => c.status === 'activo').length;
  const expiredChannelsCount = channels.filter((c) => {
    const days = getDaysSince(c.lastPosted);
    return c.status === 'activo' && days !== null && days >= 5;
  }).length;
  const activeStreetCount = streetLocations.filter((s) => s.status === 'pegado').length;
  const activeStudentsCount = leads.filter((l) => l.status === 'Active Student').length;

  const flyerTargetUrl = `${BASE_SITE_URL}?src=${encodeURIComponent(customFlyer.qrTag || 'flyer')}`;
  const flyerQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(flyerTargetUrl)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Admin Header (hidden when printing A4 flyer) */}
      <header className="no-print sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Admin Growth &amp; Geo-Pricing Hub
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  EN / ES • PIAD™ &amp; 14-Lab Integrated
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Panel de Captación, Geo-Pricing y Operaciones • Daniel Santander
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/4917676497440"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp (+49 176 7649 7440)</span>
            </a>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Sitio Público</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* KPI Row (hidden on print) */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>CLASIFICADOS ACTIVOS</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              {activeChannelsCount} <span className="text-base font-normal text-slate-500">/ {channels.length}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Alemania, Suiza (CHF), España, Chile y UK
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>ALERTAS DE RENOVACIÓN (5 DÍAS)</span>
              <AlertTriangle className={`w-4 h-4 ${expiredChannelsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              {expiredChannelsCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {expiredChannelsCount > 0
                ? 'Anuncios con más de 5 días: republicar hoy'
                : 'Todos los anuncios activos están al día (<5 días)'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>TABLONES HANNOVER (FLYERS)</span>
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              {activeStreetCount} <span className="text-base font-normal text-slate-500">/ {streetLocations.length}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              LUH Hauptgebäude, TIB, Garbsen, HsH &amp; ISH
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>PIPELINE CRM (LEADS / ACTIVOS)</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              {leads.length} <span className="text-sm font-normal text-emerald-400">({activeStudentsCount} activos)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Kanban 5 etapas guardado en tu navegador
            </p>
          </div>
        </div>

        {/* Navigation Tabs (hidden on print) */}
        <div className="no-print flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'strategy', label: '1. Geo-Pricing (Capacidad de Pago) & Plan', icon: DollarSign },
            { id: 'crm', label: '2. Pipeline CRM (Kanban + Lab Links)', icon: Columns },
            { id: 'classifieds', label: '3. Clasificados Multi-País & Avisos Copy-Paste', icon: Globe },
            { id: 'flyer', label: '4. Generador de Flyer A4 Imprimible & Calle', icon: Printer }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: GEO-PRICING (ABILITY-TO-PAY) & WEEKLY EXECUTION STRATEGY   */}
        {/* ================================================================= */}
        {activeTab === 'strategy' && (
          <div className="space-y-8">
            {/* Ability-to-Pay / Purchasing Power Parity Methodology */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    Metodología de Tarifación Internacional (Purchasing-Power Parity / Capacidad de Pago)
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    Estrategia de Cobro Basada en Posibilidad de Pago por País y Moneda
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    El sitio público detecta automáticamente la zona horaria y el país del visitante (con opción de cambiar la moneda manualmente en el encabezado o en la calculadora). Si el alumno ingresa desde mercados con mayor poder adquisitivo (Suiza, Reino Unido, EE.UU.), el sistema presenta tarifas superiores acordes a su mercado local; si ingresa desde Chile, adapta la tarifa a pesos chilenos para no frenar la conversión.
                  </p>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-xs font-mono text-emerald-300">
                  <div>✓ Detección automática activa en Web</div>
                  <div>✓ Recargo presencial Hannover incluido</div>
                  <div>✓ Sin menciones de § 19 UStG</div>
                </div>
              </div>

              {/* Currency Tiers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="py-3 px-4">Moneda / Región</th>
                      <th className="py-3 px-4">IB / Abitur (1h)</th>
                      <th className="py-3 px-4">Bachelor / Grado (1h)</th>
                      <th className="py-3 px-4">Máster / Tesis (1h)</th>
                      <th className="py-3 px-4">Extra Presencial</th>
                      <th className="py-3 px-4">Racional Estratégico (Capacidad de Pago)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {Object.values(CURRENCY_TIERS).map((tier) => (
                      <tr key={tier.code} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                          <span className="mr-2">{tier.flag}</span>
                          {tier.code} — {tier.labelEs}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-sky-300 font-bold">
                          {formatMoney(tier.rates.ib, tier.code)}/h
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                          {formatMoney(tier.rates.bachelor, tier.code)}/h
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-300 font-bold">
                          {formatMoney(tier.rates.master, tier.code)}/h
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          +{formatMoney(tier.inPersonSurchargePerHour, tier.code)}/h
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-md">
                          {tier.rationaleEs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Operational Rules for Quoting */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="font-mono text-xs font-bold text-amber-400 mb-1">
                    1. Regla Suiza / Colegios IB Privados (CHF / GBP)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    En Suiza (Tutti.ch / Anibis.ch) un tutor universitario cobra entre 60 y 90 CHF/h. Cobrar muy barato genera desconfianza. Mantén siempre la tarifa de <strong>55–75 CHF/h</strong> y destaca tu Doble M.Sc. y el Laboratorio Interactivo.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="font-mono text-xs font-bold text-sky-400 mb-1">
                    2. Regla Clase Presencial en Hannover (+Extra)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tu ventaja competitiva es la pizarra Miro + Laboratorio interactivo online. Si un alumno en Hannover quiere sesión presencial (TIB, LUH o domicilio), la calculadora muestra automáticamente que <em>la clase presencial tiene un costo extra</em> (+€10/h) para compensar tu tiempo de traslado.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="font-mono text-xs font-bold text-emerald-400 mb-1">
                    3. Regla Chile / LatAm (Volumen &amp; Prestigio U. de Chile)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    En Chile ($25.000–$35.000 CLP/h) tu credencial de Geofísico de Beauchef (FCFM) + Doble M.Sc. en Europa te posiciona en el tope del mercado. Ofrece grupos de estudio de hasta 3 compañeros (-30% c/u) para maximizar tu ingreso por hora.
                  </p>
                </div>
              </div>
            </div>

            {/* How our new Web Tools feed the Marketing Funnel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <span>Cómo usar las Nuevas Herramientas de la Web para Cerrar Alumnos sin Casos Previos</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-sky-400 uppercase">Gancho 1: El Laboratorio de 14 Problemas</div>
                  <p className="text-slate-300 leading-relaxed">
                    Cuando un alumno te escriba por WhatsApp preguntando precio, no le respondas solo con el valor. Envíale el link al simulador de su materia (ej. Mecánica o Fluidos) y dile: <em>&ldquo;Mira cómo desglosamos el Diagrama de Cuerpo Libre (DCL) en vivo en mi plataforma antes de integrar&rdquo;</em>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-emerald-400 uppercase">Gancho 2: Toolkit Matemático de 5 Pilares</div>
                  <p className="text-slate-300 leading-relaxed">
                    Para alumnos de <em>Höhere Mathematik</em>, Cálculo o Álgebra Lineal, muéstrales el visualizador de Series de Taylor, Autovalores 2D y EDOs. Ven en 30 segundos que tienes una plataforma de ingeniería superior a cualquier profesor particular tradicional.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-amber-400 uppercase">Gancho 3: Método PIAD™ + IA para Python</div>
                  <p className="text-slate-300 leading-relaxed">
                    Muchos estudiantes usan ChatGPT mal y reprueban en el examen escrito o en entregas de Python. Diles que les enseñas a usar IA como copiloto científico para estructurar código en NumPy/SciPy que ellos mismos saben defender.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PIPELINE CRM (KANBAN + TABLE + SIMULATOR RECOMMENDER)      */}
        {/* ================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            {/* Add Lead Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Registrar Nuevo Lead / Alumno</h2>
                  <p className="text-xs text-slate-400">
                    Guarda cada contacto que llegue por Kleinanzeigen, Tutti.ch, Flyers o WhatsApp y muévelo por el embudo.
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

              <form onSubmit={handleAddLead} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
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
                  placeholder="Materia (ej. HM I, Fluidos, IB Physics)"
                  value={newLead.subject}
                  onChange={(e) => setNewLead({ ...newLead, subject: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <input
                  type="text"
                  placeholder="Universidad / Colegio (ej. LUH, ETH, UCh)"
                  value={newLead.university}
                  onChange={(e) => setNewLead({ ...newLead, university: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <div className="flex gap-2">
                  <select
                    value={newLead.countryCurrency}
                    onChange={(e) => {
                      const code = e.target.value;
                      const defaultRate = CURRENCY_TIERS[code]?.rates?.bachelor || 35;
                      setNewLead({ ...newLead, countryCurrency: code, quotedRate: String(defaultRate) });
                    }}
                    className="px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  >
                    {Object.values(CURRENCY_TIERS).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Tarifa / h"
                    value={newLead.quotedRate}
                    onChange={(e) => setNewLead({ ...newLead, quotedRate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <select
                  value={newLead.mode}
                  onChange={(e) => setNewLead({ ...newLead, mode: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Online">Online (Meet + Miro)</option>
                  <option value="In-Person Hannover">Presencial Hannover (+Extra)</option>
                </select>

                <select
                  value={newLead.paymentMethod}
                  onChange={(e) => setNewLead({ ...newLead, paymentMethod: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>{pm}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Contacto (WhatsApp / Canal)"
                  value={newLead.contact}
                  onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <input
                  type="text"
                  placeholder="Notas (ej. tiene Skript en alemán, examen en 3 semanas)"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="sm:col-span-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir al Pipeline</span>
                </button>
              </form>
            </div>

            {/* KANBAN VIEW */}
            {pipelineView === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {KANBAN_COLUMNS.map((col) => {
                  const colLeads = leads.filter((l) => l.status === col.id);
                  return (
                    <div key={col.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-[420px]">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <span className="font-mono text-xs font-bold text-white">{col.label}</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 font-bold">
                          {colLeads.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colLeads.length === 0 && (
                          <div className="text-center py-10 text-xs text-slate-600 font-mono">
                            Sin leads en esta etapa
                          </div>
                        )}
                        {colLeads.map((lead) => {
                          const recLab = getRecommendedLabLink(lead.subject);
                          return (
                            <div key={lead.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-bold text-white text-sm">{lead.name}</div>
                                  <div className="text-[11px] text-sky-400 font-mono">{lead.subject || 'STEM General'}</div>
                                </div>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                                  title="Eliminar lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {lead.university && (
                                <div className="text-[11px] text-slate-400">{lead.university}</div>
                              )}

                              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                                  {lead.countryCurrency} {lead.quotedRate}/h
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                                  {lead.mode}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                  {lead.paymentMethod}
                                </span>
                              </div>

                              {lead.notes && (
                                <p className="text-[11px] text-slate-400 bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                                  {lead.notes}
                                </p>
                              )}

                              {/* 1-Click Recommended Simulator Link to send to student */}
                              <div className="pt-1">
                                <button
                                  onClick={() => copyToClipboard(recLab.url, `lab-${lead.id}`)}
                                  className="w-full py-1.5 px-2 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-mono text-[10px] flex items-center justify-between gap-1 cursor-pointer transition-colors"
                                  title={recLab.label}
                                >
                                  <span className="truncate flex items-center gap-1">
                                    <Compass className="w-3 h-3 shrink-0" />
                                    {copiedId === `lab-${lead.id}` ? '¡Link del Lab copiado!' : 'Copiar Link Simulador'}
                                  </span>
                                  <Copy className="w-3 h-3 shrink-0" />
                                </button>
                              </div>

                              <div className="pt-1 border-t border-slate-900">
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200"
                                >
                                  {KANBAN_COLUMNS.map((c) => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
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
              /* TABLE VIEW */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
                      <th className="py-3.5 px-4">Alumno / Contacto</th>
                      <th className="py-3.5 px-4">Materia &amp; Universidad</th>
                      <th className="py-3.5 px-4">Modalidad &amp; Pago</th>
                      <th className="py-3.5 px-4">Tarifa Cotizada</th>
                      <th className="py-3.5 px-4">Simulador Recomendado</th>
                      <th className="py-3.5 px-4">Etapa Pipeline</th>
                      <th className="py-3.5 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {leads.map((lead) => {
                      const recLab = getRecommendedLabLink(lead.subject);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{lead.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{lead.contact}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-sky-400 font-mono font-semibold">{lead.subject}</div>
                            <div className="text-[11px] text-slate-400">{lead.university}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div>{lead.mode}</div>
                            <div className="text-slate-400">{lead.paymentMethod}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {lead.countryCurrency} {lead.quotedRate}/h
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => copyToClipboard(recLab.url, `tbl-lab-${lead.id}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedId === `tbl-lab-${lead.id}` ? '¡Copiado!' : recLab.label}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                            >
                              {KANBAN_COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>{c.label}</option>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MULTI-COUNTRY CLASSIFIEDS TRACKER & COPY-PASTE ADS         */}
        {/* ================================================================= */}
        {activeTab === 'classifieds' && (
          <div className="space-y-8">
            {/* Multi-Country Channel Matrix with 5-Day Renewal Alert */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400 font-bold block mb-1">
                    Step A Checklist • Recordatorio Automático cada 5 Días
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Matriz de Portales de Clasificados (Alemania, Suiza, España, Chile, UK/NL)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    En portales como Kleinanzeigen, Tutti.ch o Milanuncios, republicar cada 5 días mantiene tu aviso en la primera página sin pagar anuncios destacados.
                  </p>
                </div>
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
                                title="Abrir plataforma"
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

            {/* Copy-Paste Ads Updated with PIAD™ + 14-Problem Lab + Productive AI */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Plantillas de Avisos Actualizadas (Método PIAD™ + Lab de 14 Problemas + IA Productiva)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {AD_TEMPLATES.map((ad) => (
                  <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
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
        {/* TAB 4: PRINTABLE A4 FLYER GENERATOR (ABREISSZETTEL + QR) & STREET */}
        {/* ================================================================= */}
        {activeTab === 'flyer' && (
          <div className="space-y-10">
            {/* Flyer Controls (hidden when printing) */}
            <div className="no-print bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
                    Generador A4 con Pestañas Recortables (Abreißzettel) + Código QR Dinámico
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Diseñador de Carteles Imprimibles para Campus (LUH / TIB / HsH / Colegios IB)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Elige una plantilla, personaliza los textos si lo deseas y pulsa <strong>Imprimir / Guardar PDF (A4)</strong>. La hoja se formatea automáticamente en tamaño A4 con 10 pestañas recortables en la parte inferior.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar PDF (A4)</span>
                </button>
              </div>

              {/* Preset & Mode Controls */}
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
                      <span>Modo Ahorro de Tinta (Fondo 100% Blanco)</span>
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

            {/* ============================================================= */}
            {/* ACTUAL PRINTABLE A4 FLYER PREVIEW (#printable-a4-flyer)       */}
            {/* ============================================================= */}
            <div className="flex justify-center">
              <div
                id="printable-a4-flyer"
                className="w-full max-w-[794px] bg-white text-slate-900 rounded-2xl border-2 border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between"
                style={{ minHeight: '1080px' }}
              >
                {/* Top Banner */}
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

                  {/* Honest Language & Skript Notice */}
                  <div className="p-4 rounded-xl bg-slate-100 border-2 border-slate-900 text-xs font-mono font-bold text-slate-900 mb-6 leading-relaxed">
                    {customFlyer.languageNotice}
                  </div>

                  {/* Main Body: Left Bullets + Right QR & Lab Highlight */}
                  <div className="grid grid-cols-12 gap-6 items-center mb-6">
                    <div className="col-span-7 space-y-3">
                      <div className="font-mono text-xs uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-slate-900 pb-1">
                        CORE SUBJECTS &amp; INTERACTIVE STEM PLATFORM:
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

                  {/* Callout Bar */}
                  <div className="p-3 rounded-xl border-2 border-slate-900 bg-slate-50 text-center font-mono text-xs font-extrabold text-slate-900">
                    {customFlyer.footerCallout}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* PERFORATED TEAR-OFF TABS (ABREISSZETTEL) AT BOTTOM        */}
                {/* ========================================================= */}
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

            {/* Street Poster Locations Checklist (hidden when printing) */}
            <div className="no-print bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
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
      </div>
    </div>
  );
}
