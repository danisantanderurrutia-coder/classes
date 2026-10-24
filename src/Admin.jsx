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
  Eye,
  Rocket,
  Atom,
  Brain,
  Terminal,
  GraduationCap,
  Sun,
  Moon,
  Layout,
  PanelLeft,
  CreditCard
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
  { id: 'New Inquiry', labelEs: '1. Nueva Consulta', labelEn: '1. New Inquiry', dot: 'bg-sky-400', border: 'border-sky-500/30' },
  { id: 'Diagnostic Booked', labelEs: '2. Diagnóstico Agendado', labelEn: '2. Diagnostic Booked', dot: 'bg-amber-400', border: 'border-amber-500/30' },
  { id: 'Active Student', labelEs: '3. Alumno Activo', labelEn: '3. Active Student', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  { id: 'Completed / Exam Passed', labelEs: '4. Examen Aprobado', labelEn: '4. Exam Passed / Completed', dot: 'bg-indigo-400', border: 'border-indigo-500/30' },
  { id: 'Archived', labelEs: '5. Archivado', labelEn: '5. Archived', dot: 'bg-slate-500', border: 'border-slate-700' }
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
    id: 'mentes_curiosas',
    tier: 'ib',
    nameEs: 'Mentes Curiosas: Niños y Jóvenes (Geometría, Lógica y Física Lúdica)',
    nameEn: 'Curious Minds: Young Inquirers (Geometry, Logic & Playful Science)',
    simUrl: `${BASE_SITE_URL}?src=wa-curious#courses`,
    simLabelEs: 'nuestro planetario 3D interactivo y simuladores visuales de física',
    simLabelEn: 'our interactive 3D solar system and visual physics simulators'
  },
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
    id: 'python_modeling',
    tier: 'master',
    nameEs: 'Python Científico (NumPy/SciPy) y Modelación Numérica (Nivel 3)',
    nameEn: 'Scientific Python (NumPy/SciPy) & Numerical Modeling (Tier 3)',
    simUrl: `${BASE_SITE_URL}?src=wa-python#piad`,
    simLabelEs: 'mi metodología PIAD™ para modelación y verificación de código científico en Python',
    simLabelEn: 'my PIAD™ workflow for modeling and verifying scientific Python code'
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
  },
  {
    id: 'forum-reddit-chile',
    country: '🇨🇱 Chile (Reddit)',
    platform: 'Reddit • r/chile (Hilo Semanal Servicios / Datos)',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.reddit.com/r/chile',
    notes: 'Publicar en el hilo semanal de datos/servicios. Compartir los simuladores como recurso educativo abierto.'
  },
  {
    id: 'forum-reddit-stem',
    country: '🌍 Global (Reddit STEM)',
    platform: 'Reddit • r/EngineeringStudents / r/learnmath / r/PhysicsStudents',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.reddit.com/r/EngineeringStudents',
    notes: 'Excelente para tesis, cuántica y física. Compartir los simuladores interactivos como aporte pedagógico.'
  },
  {
    id: 'forum-reddit-quantum',
    country: '🌍 Global (Reddit Cuántica)',
    platform: 'Reddit • r/physics / r/popularscience / r/QuantumComputing',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.reddit.com/r/physics',
    notes: 'Comunidades de entusiastas y autodidactas. Publicar el post con el hook de Einstein y simulador en Python.'
  },
  {
    id: 'forum-reddit-grad',
    country: '🌍 Global (Reddit Tesis)',
    platform: 'Reddit • r/GradSchool / r/AskAcademia',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.reddit.com/r/GradSchool',
    notes: 'Estudiantes de B.Sc. y M.Sc. trancados con modelación numérica, Python o gráficos de paper.'
  },
  {
    id: 'forum-studis-online',
    country: '🇩🇪 Alemania (Foro Universitario)',
    platform: 'Studis-Online.de • Forum Nachhilfe & Klausuren',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.studis-online.de/Fragen-Brett/',
    notes: 'El mayor foro estudiantil en Alemania. Hilos de Klausurvorbereitung y ayuda con Technische Mechanik y HM.'
  },
  {
    id: 'forum-fb-plancomun',
    country: '🇨🇱 Chile (Facebook)',
    platform: 'Facebook Grupos • Plan Común Beauchef / FCFM / Ing. UC',
    currency: 'CLP',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.facebook.com/groups/',
    notes: 'Grupos masivos de estudiantes de 1er y 2do año. Postear en semanas previas a controles 1 y 2.'
  },
  {
    id: 'forum-fb-hannover',
    country: '🇩🇪 Alemania (Facebook)',
    platform: 'Facebook Grupos • Latinos / Estudiantes en Hannover & LUH',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://www.facebook.com/groups/hannover/',
    notes: 'Comunidades internacionales y de habla hispana en Hannover para clases presenciales u online.'
  },
  {
    id: 'forum-discord-stem',
    country: '🌍 Global (Discord)',
    platform: 'Discord • Servidores STEM (3Blue1Brown / Math Sorcerer / r/EngineeringStudents)',
    currency: 'EUR',
    status: 'pendiente',
    lastPosted: '',
    url: 'https://discord.com',
    notes: 'Canales de #homework-help y #physics-math. Demostrar solvencia en dudas puntuales y enlazar simuladores.'
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

const INITIAL_MASTER_CHECKLIST = [
  // FÍSICOS HANNOVER
  {
    id: 'st-1',
    category: 'fisico',
    name: 'Hauptgebäude LUH (Welfengarten 1)',
    zone: 'Nordstadt / Mitte (Hannover)',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Tablones de corcho junto a la cafetería central, entrada principal y pasillos.',
    qrTag: 'flyer-luh-main'
  },
  {
    id: 'st-2',
    category: 'fisico',
    name: 'TIB Technik & Naturwissenschaften (Welfengarten 1B)',
    zone: 'Nordstadt (Hannover)',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Entrada principal, zona de lockers y pasillos hacia salas de estudio silencioso.',
    qrTag: 'flyer-tib'
  },
  {
    id: 'st-3',
    category: 'fisico',
    name: 'Campus Maschinenbau Garbsen (LUH)',
    zone: 'Garbsen (Hannover)',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Mensa central de Garbsen, edificios de ingeniería mecánica y materiales.',
    qrTag: 'flyer-garbsen'
  },
  {
    id: 'st-4',
    category: 'fisico',
    name: 'Hochschule Hannover (HsH - Ricklinger Stadtweg)',
    zone: 'Linden / Ricklingen',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Facultad de Ingeniería (Maschinenbau, Elektrotechnik) y tablón del AStA HsH.',
    qrTag: 'flyer-hsh'
  },
  {
    id: 'st-5',
    category: 'fisico',
    name: 'International School Hannover Region (ISH)',
    zone: 'Mitte / Maschsee',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Cafés cercanos y paradas de tranvía ÜSTRA frecuentadas por familias expat e IB.',
    qrTag: 'flyer-ish'
  },
  {
    id: 'st-6',
    category: 'fisico',
    name: 'Bibliotecas Públicas & Cafés de Estudio (Nordstadt / E-Damm / List)',
    zone: 'Nordstadt / Lister Meile',
    country: '🇩🇪 Hannover',
    status: 'pendiente',
    lastChecked: '',
    url: '',
    notes: 'Cafés con tablón comunitario libre y bibliotecas municipales de Hannover.',
    qrTag: 'flyer-cafe'
  },

  // PORTALES DE CLASIFICADOS
  {
    id: 'ch-kleinanzeigen-de',
    category: 'clasificado',
    name: 'Kleinanzeigen.de (Alemán)',
    zone: 'Alemania / Hannover',
    country: '🇩🇪 Alemania',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Precio gancho: Ab 25 €/h. Cat: Unterricht & Kurse -> Nachhilfe. Renovar cada 5 días.'
  },
  {
    id: 'ch-kleinanzeigen-en',
    category: 'clasificado',
    name: 'Kleinanzeigen.de (Inglés - Expat / IB)',
    zone: 'Alemania / Hannover',
    country: '🇩🇪 Alemania',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.kleinanzeigen.de',
    notes: 'Enfocado en familias expat, IB Diploma (ISH) y programas de grado en inglés.'
  },
  {
    id: 'ch-luh-brett',
    category: 'clasificado',
    name: 'Leibniz Uni Hannover • Schwarzes Brett / AStA',
    zone: 'Hannover (Digital)',
    country: '🇩🇪 Alemania',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.asta-hannover.de',
    notes: 'Jobbörse / Nachhilfe digital en portal oficial de estudiantes de LUH.'
  },
  {
    id: 'ch-tutti',
    category: 'clasificado',
    name: 'Tutti.ch (Zürich / Basel / Bern)',
    zone: 'Suiza Alemana (ETH / Uni Basel)',
    country: '🇨🇭 Suiza',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.tutti.ch',
    notes: 'Tarifa: 42–55 CHF/h. Mercado de altísimo poder adquisitivo y gran demanda de física/cálculo.'
  },
  {
    id: 'ch-anibis',
    category: 'clasificado',
    name: 'Anibis.ch (Suiza Romanda / EPFL)',
    zone: 'Suiza Francesa (Ginebra / Lausanne)',
    country: '🇨🇭 Suiza',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.anibis.ch',
    notes: 'Estudiantes de EPFL, UNIL y colegios internacionales en Ginebra/Vaud.'
  },
  {
    id: 'cl-tusclases',
    category: 'clasificado',
    name: 'Tusclasesparticulares.cl / Superprof.cl',
    zone: 'Santiago / Valparaíso / Concepción',
    country: '🇨🇱 Chile',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.tusclasesparticulares.cl',
    notes: 'Precio tracción: $20.000 CLP/h. Resaltar Geofísico U. de Chile y método PIAD™.'
  },
  {
    id: 'cl-yapo',
    category: 'clasificado',
    name: 'Yapo.cl (Servicios / Clases Particulares)',
    zone: 'Todo Chile',
    country: '🇨🇱 Chile',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.yapo.cl',
    notes: 'Excelente para captar alumnos de Plan Común de Ingeniería y grupos de 2 a 4 amigos.'
  },
  {
    id: 'es-tusclases',
    category: 'clasificado',
    name: 'Tusclasesparticulares.com / Milanuncios',
    zone: 'Madrid / Barcelona / Valencia',
    country: '🇪🇸 España',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.tusclasesparticulares.com',
    notes: 'Desde 25 €/h. Muy activo para Álgebra, Cálculo y Física de primer año.'
  },
  {
    id: 'uk-gumtree',
    category: 'clasificado',
    name: 'Gumtree UK / Marktplaats.nl',
    zone: 'Reino Unido & Países Bajos',
    country: '🇬🇧 UK / 🇳🇱 NL',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.gumtree.com',
    notes: 'A-Levels, IB Diploma y programas de Bachelor en ingeniería (£24–£34/h).'
  },

  // FOROS WEB & COMUNIDADES DIGITALES
  {
    id: 'forum-reddit-chile',
    category: 'foro',
    name: 'Reddit • r/chile (Hilo Semanal Servicios / Datos)',
    zone: 'Comunidad Chile',
    country: '🇨🇱 Chile',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.reddit.com/r/chile',
    notes: 'Postear en el thread semanal de datos/servicios. Compartir los simuladores interactivos abiertos.'
  },
  {
    id: 'forum-reddit-stem',
    category: 'foro',
    name: 'Reddit • r/EngineeringStudents & r/learnmath',
    zone: 'Comunidad Global STEM',
    country: '🌍 Global',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.reddit.com/r/EngineeringStudents',
    notes: 'Ideal para compartir simuladores y ofrecer mentoría en cálculo y física universitaria.'
  },
  {
    id: 'forum-reddit-quantum',
    category: 'foro',
    name: 'Reddit • r/physics & r/popularscience (Cuántica)',
    zone: 'Mentes Curiosas / Autodidactas',
    country: '🌍 Global',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.reddit.com/r/physics',
    notes: 'Usar el copy con el hook de Einstein y simulador en Python de paquetes de onda.'
  },
  {
    id: 'forum-reddit-grad',
    category: 'foro',
    name: 'Reddit • r/GradSchool & r/AskAcademia (Tesis)',
    zone: 'Tesistas Bachelor / Master',
    country: '🌍 Global',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.reddit.com/r/GradSchool',
    notes: 'Ayuda técnica con modelación numérica, depuración en Python y gráficos de paper.'
  },
  {
    id: 'forum-studis-online',
    category: 'foro',
    name: 'Studis-Online.de • Forum Nachhilfe & Klausuren',
    zone: 'Alemania Universitaria',
    country: '🇩🇪 Alemania',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.studis-online.de/Fragen-Brett/',
    notes: 'El mayor foro de estudiantes universitarios en Alemania. Hilos de Klausurvorbereitung.'
  },
  {
    id: 'forum-fb-plancomun',
    category: 'foro',
    name: 'Facebook • Plan Común Beauchef / FCFM U. de Chile',
    zone: 'Beauchef (FCFM)',
    country: '🇨🇱 Chile',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.facebook.com/groups/',
    notes: 'Grupos masivos de estudiantes de 1er y 2do año antes de controles de cálculo y física.'
  },
  {
    id: 'forum-fb-ing-uc',
    category: 'foro',
    name: 'Facebook • Grupos Comunidad Ingeniería UC & USM',
    zone: 'San Joaquín / Valparaíso',
    country: '🇨🇱 Chile',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.facebook.com/groups/',
    notes: 'Grupos de generación y avisos de clases particulares.'
  },
  {
    id: 'forum-fb-hannover',
    category: 'foro',
    name: 'Facebook • Latinos / Estudiantes en Hannover & LUH',
    zone: 'Hannover & Baja Sajonia',
    country: '🇩🇪 Alemania',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://www.facebook.com/groups/hannover/',
    notes: 'Comunidad hispanohablante e internacional en Hannover para clases presenciales u online.'
  },
  {
    id: 'forum-discord-stem',
    category: 'foro',
    name: 'Discord • Servidores STEM (3Blue1Brown / Math Sorcerer)',
    zone: 'Discord Global',
    country: '🌍 Global',
    status: 'pendiente',
    lastChecked: '',
    url: 'https://discord.com',
    notes: 'Canales de #homework-help y #math-physics. Responder dudas y compartir simuladores.'
  }
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
    id: 'ad-en-kids',
    lang: 'en',
    badge: '🇬🇧 🌱 Curious Minds (Ages 9–15) – International / Expat Families',
    title: 'Curious Minds: Intuitive Math, Spatial Geometry & Playful Physics for Kids & Teens (Ages 9–15) – Double M.Sc. Mentor',
    priceNote: 'Tier 1 (€25 / £24 / $28 / 42 CHF / $20,000 CLP) — Interactive 3D Solar System + Fun First Principles',
    body: `Does your child or teenager love asking "Why?" about space, science, and numbers, but feels constrained by rote school drills?

Hi! I’m Daniel S. Santander Urrutia, a Geophysicist and Double M.Sc. Engineer based in Hannover, Germany. I mentor young curious minds (ages 9–15) to build authentic scientific intuition, visual geometry, and analytical thinking in a playful, low-pressure environment.

🌱 WHAT MAKES "CURIOUS MINDS" DIFFERENT?
• Interactive 3D Solar System & Visual Simulators: In my custom web lab, we explore planetary orbits, gravity wells, pendulums, and wave interference in real time. We don't just memorize formulas — we see and touch physical phenomena!
• Visual Geometry & Logic Puzzles: We develop spatial intuition, proportions, and deductive reasoning through engaging visual challenges before jumping into formal algebra.
• First-Principles Thinking: Encouraging healthy inquiry, asking big questions (How do satellites orbit? Why is the sky blue? How do sound waves travel?), and discovering answers together.
• Bilingual Immersion: Taught 1-on-1 in clear, engaging English or Spanish.
• After-Session Study Artifacts: After every session, parents receive a high-resolution vector PDF summarizing what we explored, complete with visual diagrams and curiosity challenges.

💰 TRANSPARENT RATES (Tier 1):
• €25 / £24 / $28 / 42 CHF / $20,000 CLP per 60-min session.
• 15% discount on an 8-session Curiosity Pack.
• Small-group option available (up to 3 friends or siblings) at -30% per student!

🎯 Book a FREE 15-minute diagnostic & explore our interactive 3D planetarium together:
🌐 ${BASE_SITE_URL}?src=kids-en#courses
📲 WhatsApp: +49 176 7649 7440`
  },
  {
    id: 'ad-es-kids',
    lang: 'es',
    badge: '🇪🇸🇨🇱 🌱 Mentes Curiosas (9 a 15 años) – Niños y Jóvenes Curiosos',
    title: 'Mentes Curiosas: Geometría Visual, Lógica y Física Lúdica para Niños y Jóvenes (9 a 15 años) – Geofísico U. Chile + Doble Máster Europa',
    priceNote: 'Nivel 1 ($20.000 CLP / €25 / £24 / 42 CHF) — Planetario 3D Interactivo + Pensamiento Crítico',
    body: `¿Tu hijo/a hace preguntas constantes sobre el universo, cómo funcionan las cosas o las matemáticas, pero la escuela tradicional se las hace aburridas con repetición mecánica?

Soy Daniel S. Santander Urrutia, Geofísico de la Universidad de Chile (FCFM - Beauchef) e Ingeniero con Doble Máster (M.Sc.) en Europa. Diseñé el programa "Mentes Curiosas" para niños y jóvenes (9 a 15 años) con sed de aprender más allá del currículum escolar.

🌱 ¿QUÉ APRENDERÁ EN "MENTES CURIOSAS"?
• Planetario 3D y Simuladores Interactivos Propios: En mi web exploramos en tiempo real órbitas planetarias, pozos gravitacionales, ondas y péndulos. La física se entiende viendo y manipulando, no memorizando hojas de fórmulas.
• Geometría Visual y Razonamiento Lógico: Desarrollamos intuición espacial, proporcionalidad, coordenadas y deducción lógica antes de mecanizar álgebra abstracta.
• Método de Primeros Principios: Enseño a formular hipótesis, pensar con criterio científico y asombrarse con el porqué de la naturaleza.
• Apuntes en PDF para Padres: Al terminar cada sesión, envío un reporte visual en PDF de alta resolución con lo trabajado y acertijos para seguir explorando.
• Clases 1-a-1 o grupos pequeños de hermanos/amigos (online para todo el mundo o presencial en Hannover).

💰 VALORES TRANSPARENTES (NIVEL 1):
• $20.000 CLP / €25 / £24 / 42 CHF por hora pedagógica.
• -15% de descuento en Pack de 8 sesiones.
• -30% por alumno en grupos de hasta 3 niños.

🎯 Agenda 15 minutos de diagnóstico GRATIS y prueba el planetario 3D interactivo en:
🌐 ${BASE_SITE_URL}?src=mentes-curiosas-es#courses
📲 WhatsApp directo: +49 176 7649 7440`
  },
  {
    id: 'ad-ib-en',
    lang: 'en',
    badge: '🇬🇧🎓 IB Diploma Specialists (Mathematics AA/AI HL/SL & Physics HL/SL)',
    title: 'IB Physics & Math AA/AI HL Mentor (Double M.Sc. Engineer) | 14 Interactive Simulators & Past Paper Mastery – From €25 / £24',
    priceNote: 'Tier 1 (€25 / £24 / $28 / 42 CHF) — Exam Sprint Packs (-15%) & Study Sheets Included',
    body: `Struggling with IB Physics HL or Mathematics Analysis & Approaches (AA) HL? Feeling overwhelmed by tricky mark schemes, paper 2/3 problem setups, or Internal Assessment (IA) modeling?

I’m Daniel S. Santander Urrutia, a Geophysicist and Double M.Sc. Engineer based in Hannover, Germany. I specialize in mentoring IB Diploma candidates worldwide to turn abstract IB syllabus objectives into deep visual intuition and reliable 7s.

🚀 WHY IB STUDENTS EXCEL WITH THIS METHODOLOGY:
• Free Body Diagrams (DCL) & Force Vectors First: No more freezing on complex mechanics problems. We derive the physics step-by-step before touching your calculator.
• 14 Interactive Physics Simulators: Practice on our custom web platform covering mechanics, wave interference, thermodynamics, and fields with real-time vector visualization.
• 5-Pillar Mathematics Toolkit: Live visualizers for Taylor Series, Differential Equations (ODEs), Matrix Eigenvalues, and Fourier Analysis (FFT) directly mapped to IB Math AA HL.
• Past Paper & Mark Scheme Auditing: We deconstruct how examiners allocate M, A, and R marks so you write rigorous, concise proofs under exam time pressure.
• High-Resolution Miro PDF Board: Receive full vector notes after every single class.

💰 TRANSPARENT IB RATES (Tier 1):
• €25/h (€21/h in 8h Exam Sprint Pack) | £24/h | $28/h | 42 CHF/h | $20,000 CLP/h.
• Up to 3 classmates can study together at -30% per student!

🎯 Book your FREE 15-minute diagnostic consultation and test our interactive simulators at:
🌐 ${BASE_SITE_URL}?src=ib-en#lab
📲 WhatsApp: +49 176 7649 7440`
  },
  {
    id: 'ad-uni-en',
    lang: 'en',
    badge: '🇬🇧🇺🇸 University Engineering (Calculus, Linear Algebra, Mechanics, Fluids & Python)',
    title: 'University Engineering Calculus, Linear Algebra, Mechanics, Fluids & Python Mentor (Double M.Sc.) | Interactive Lab & First Principles',
    priceNote: 'Tier 1: €25 / £24 | Tier 2: €29 / £28 | Tier 3 (Fluids/Python): €35 / £34 | Free 15-min Diagnostic',
    body: `Facing high-stakes exams in Higher Engineering Mathematics, Classical Mechanics, Vector Calculus, Differential Equations, Fluid Dynamics, or Scientific Python?

I’m Daniel S. Santander Urrutia, a Geophysicist and Double M.Sc. Engineer with graduate degrees in Europe. I provide rigorous 1-on-1 and small group mentorship for university engineering and science students worldwide (UK, US, Germany, Switzerland, Canada, and beyond).

🚀 HOW WE ACCELERATE YOUR UNIVERSITY MASTERY (PIAD™ METHOD):
1. First Principles & Geometry First: Before calculating complex line integrals or stress tensors, we map the physical system so you never face a blank exam paper without a strategy.
2. 14 Interactive Physics Simulators & 5-Pillar Math Toolkit: Free online platform with live Taylor series, matrix transformations, Navier-Stokes/Poiseuille flow, and geostrophic wind simulations.
3. Scientific Python & Numerical Modeling: Learn to structure, simulate, and audit numerical modeling using NumPy, SciPy, and Matplotlib grounded in first principles.
4. Exported Vector PDF Notes: Every derivation from our Miro board is delivered immediately after class as a searchable, printable study artifact.

💰 TRANSPARENT RATES BY TIER:
• Tier 1 (Calculus I–II, Mechanics, General Physics): €25/h (£24 / $28 / 42 CHF / $20,000 CLP)
• Tier 2 (Linear Algebra, Multi-variable Calculus, ODEs, Thermodynamics): €29/h (£28 / $32 / 48 CHF / $23,000 CLP)
• Tier 3 (Fluid Mechanics, Geophysics, Scientific Python, M.Sc. Thesis): €35/h (£34 / $38 / 55 CHF / $26,000 CLP)
• 15% discount on 8h Exam Sprint Packs. Group discounts available.

🎯 Book a FREE 15-minute diagnostic call & try our interactive lab:
🌐 ${BASE_SITE_URL}?src=uni-en#toolkit
📲 WhatsApp: +49 176 7649 7440`
  },
  {
    id: 'ad-cl-es',
    lang: 'es',
    badge: '🇨🇱 Chile (Beauchef FCFM / UC / USM / UdeC) – Tarifas Escalonadas por Ramo',
    title: 'Clases Cálculo, Física, Álgebra, Fluidos y Python (Geofísico U. de Chile + Doble M.Sc. Europa)',
    priceNote: 'Chile: $20.000 CLP/h (Cálculo/Física I), $23.000 (Álgebra/EDOs), $26.000 (Fluidos/Python) | Packs -15% y Grupos -30%',
    body: `¿Se acerca tu control, certamen o examen de Cálculo I–III, Física Mecánica, Álgebra Lineal, Ecuaciones Diferenciales, Mecánica de Fluidos o Python?

Soy Daniel S. Santander Urrutia, Geofísico de la Universidad de Chile (FCFM - Beauchef) e Ingeniero con Doble Máster (M.Sc.) en Europa. Hago clases particulares 1-a-1 y a grupos pequeños con una plataforma interactiva propia.

🚀 ¿POR QUÉ APRENDERÁS MÁS RÁPIDO CONMIGO? (MÉTODO PIAD™):
• Laboratorio Interactivo Propio (14 Simuladores + DCL en vivo): En mi web puedes practicar gratis con problemas reales de controles de la U. de Chile (Beauchef) y universidades europeas, viendo los vectores de fuerza y el paso a paso entre Álgebra y Cálculo.
• Toolkit Matemático de 5 Pilares: Visualizador en tiempo real de Series de Taylor, Matrices/Autovalores, EDOs, Gradientes y Transformada de Fourier (FFT).
• Python Científico y Modelación Numérica: Aprende a estructurar, modelar y auditar tu propio código en NumPy, SciPy y Matplotlib con rigor matemático y primeros principios.
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
    id: 'ad-es-general',
    lang: 'es',
    badge: '🇪🇸 España & Latam (Grado en Ingeniería, Física y Matemáticas)',
    title: 'Profesor Particular Análisis Matemático, Álgebra Lineal, Mecánica, Termodinámica y Python (Doble Máster Europa)',
    priceNote: 'Nivel 1: 25 €/h | Nivel 2: 29 €/h | Nivel 3: 35 €/h | Diagnóstico 15 min Gratis',
    body: `¿Preparando tus exámenes de Grado en Ingeniería, Física o Matemáticas (Cálculo / Análisis, Álgebra Lineal, Mecánica Clásica, Ecuaciones Diferenciales, Termodinámica o Fluidos)?

Soy Daniel S. Santander Urrutia, Geofísico e Ingeniero con Doble Máster (M.Sc.) en Europa. Ofrezco mentorías individuales estructuradas y apoyo para exámenes universitarios con enfoque en intuición visual y primeros principios.

🚀 ¿POR QUÉ ESTE MÉTODO MARCA LA DIFERENCIA?:
• Diagramas de Cuerpo Libre (DCL) y Geometría Antes de Operar: Desarrollamos el planteamiento físico antes de empezar a integrar o derivar, eliminando el bloqueo frente a la hoja en blanco.
• Laboratorio Web de 14 Simuladores + Toolkit Matemático: Plataforma propia interactiva donde puedes manipular vectores, ciclos termodinámicos, series de Taylor y EDOs en tiempo real.
• Python Científico: Modelación numérica estructurada con NumPy, SciPy y Matplotlib.
• Pizarra Miro Vectorial: Tras cada clase recibes el archivo PDF en alta resolución con todo el desarrollo detallado.

💰 TARIFAS POR NIVEL DE COMPLEJIDAD:
• Nivel 1 (Cálculo I–II, Física Mecánica, Bachillerato / Selectividad): 25 €/h (con Pack de Examen ~21 €/h).
• Nivel 2 (Álgebra Lineal, EDOs, Mecánica Analítica, Termodinámica): 29 €/h.
• Nivel 3 (Mecánica de Fluidos, Geofísica, Python Científico y TFG/TFM): 35 €/h.
• Clases online en directo con pizarra digital o presenciales en Hannover.

🎯 Reserva tu diagnóstico gratuito de 15 minutos y prueba el laboratorio interactivo:
🌐 ${BASE_SITE_URL}?src=anuncios-es#lab
📲 WhatsApp: +49 176 7649 7440`
  },
  {
    id: 'ad-de',
    lang: 'de',
    badge: '🇩🇪🇨🇭 Kleinanzeigen / Tutti.ch (Deutsches Skript -> Unterricht auf Englisch/Spanisch)',
    title: 'Nachhilfe Mathematik, Analysis, Physik & Python (Uni / FH / IB) – M.Sc. Ingenieur – Ab 25 €',
    priceNote: 'Deutschland: 25 €/h (Level 1), 29 €/h (Level 2), 35 €/h (Level 3) | Schweiz: 42–55 CHF/h',
    body: `Steht deine Klausur in Höherer Mathematik (Analysis / Lineare Algebra), Technischer Mechanik, Physik, Fluiddynamik oder Python bevor?

Ich bin Daniel S. Santander Urrutia, Geophysiker und Ingenieur mit Doppel-Masterabschluss (M.Sc.) in Europa. Ich biete strukturierte, hochwirksame 1-zu-1 Mentorships (Online oder Präsenz in Hannover) an.

⚠️ WICHTIGER HINWEIS ZUR SPRACHE:
Der Unterricht findet auf ENGLISCH oder SPANISCH statt (ich spreche kein Deutsch). 
ABER: Du kannst mir problemlos deine deutschen Vorlesungsfolien (Skripte), Übungsblätter und Altklausuren schicken! Mathematische Gleichungen, Freikörperbilder (DCL) und physikalische Gesetze sind universell.

🚀 WAS MEINE METHODE EINZIGARTIG MACHT (PIAD™-Methode & Interaktives Labor):
• Eigenes Interaktives Physik- & Mathe-Labor: Auf meiner Website kannst du vorab 14 interaktive Echtzeit-Simulatoren mit Freikörperbildern (DCL) und ein 5-Säulen Mathe-Toolkit (Taylor, Eigenwerte, ODEs, FFT) kostenlos testen.
• Wissenschaftliches Python & Numerik: Ich zeige dir, wie du sauberen, robusten Python-Code (NumPy/SciPy/Matplotlib) auf Basis mathematischer Prinzipien strukturierst und auditierst.
• Open-Knowledge Artefakte: Nach jeder Sitzung erhältst du alle Herleitungen als hochauflösendes Vektor-PDF (Miro-Board + druckbares Study Sheet).

💰 FAIRE PREISE NACH FACH-LEVEL:
• Level 1 (Analysis I–II, Klassische Physik, IB / Abitur): 25 €/Std. (im 8h-Paket nur ~21 €/Std.!)
• Level 2 (Lineare Algebra, DGL/ODEs, Technische Mechanik): 29 €/Std.
• Level 3 (Fluiddynamik, Geophysik, Wissenschaftliches Python & Masterarbeit): 35 €/Std.
• Präsenz in Hannover (TIB, LUH Campus): Kleiner Aufpreis für die Anfahrt.
• Kostenloses 15-minütiges Diagnosegespräch vorab!

🌐 Teste mein interaktives Labor: ${BASE_SITE_URL}?src=kleinanzeigen-de
📲 Schreib mir direkt auf WhatsApp (Englisch oder Spanisch): +49 176 7649 7440`
  }
];

function EinsteinCartoon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wild Einstein Hair */}
      <path d="M15 45 C10 30, 25 15, 45 18 C50 10, 65 10, 75 20 C85 15, 95 30, 85 45 C95 55, 90 70, 80 72 C85 85, 70 90, 60 85 C50 92, 35 90, 30 80 C15 85, 10 70, 18 60 C8 55, 10 45, 15 45 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
      {/* Face */}
      <ellipse cx="50" cy="52" rx="26" ry="28" fill="#FDE68A" stroke="#0F172A" strokeWidth="2.5" />
      {/* Eyebrows & Eyes */}
      <path d="M35 40 Q40 37 45 41" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M55 41 Q60 37 65 40" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="47" r="3" fill="#0F172A" />
      <circle cx="60" cy="47" r="3" fill="#0F172A" />
      <circle cx="41" cy="46" r="1" fill="#FFFFFF" />
      <circle cx="61" cy="46" r="1" fill="#FFFFFF" />
      {/* Nose */}
      <path d="M49 48 Q52 56 46 58 Q51 60 54 58" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Iconic Mustache */}
      <path d="M30 63 C38 58, 48 64, 50 63 C52 64, 62 58, 70 63 C65 70, 53 69, 50 68 C47 69, 35 70, 30 63 Z" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2" />
      {/* Playful Tongue */}
      <path d="M45 69 Q50 75 55 69" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="#EF4444" />
    </svg>
  );
}

const FLYER_PRESETS = {
  de_en: {
    name: '🇩🇪 Hannover / German University (Exams DE/EN)',
    badge: 'OPEN KNOWLEDGE STEM MENTORSHIP • HANNOVER & ONLINE',
    headline: 'EXAM AT RISK? STRUGGLING WITH UNI MATH, PHYSICS OR PYTHON?',
    subheadline: '1-on-1 Mentorship by a Geophysicist & Double M.Sc. Engineer • From 25 €/h (Study Packs from ~21 €/h)',
    languageNotice: '📌 Bilingual Mentorship: English & German/Spanish • Online Worldwide & In-Person in Hannover • Miro Vector PDF Notes after every session',
    bullets: [
      'Tier 1 (25 €/h): Calculus / Analysis I–II, Classical Physics & IB Diploma / Abitur',
      'Tier 2 (29 €/h): Linear Algebra, Eigenvalues, ODEs, Analytical Mechanics & Electromagnetism',
      'Tier 3 (35 €/h): Fluid Dynamics, Geophysics, Scientific Python (NumPy/SciPy) & Thesis Support',
      'Includes: Free access to 14-Problem Interactive Physics Lab + Vector PDF Notes after every session'
    ],
    footerCallout: 'Free 15-min Diagnostic Call • Online Worldwide or In-Person in Hannover • Scan QR Code to test simulators',
    tearOffTitle: 'Math/Physics/Python • From 25€',
    qrTag: 'flyer-hannover-de',
    illustrationType: 'standard_physics',
    targetForums: 'r/Hannover, r/germany, Studis-Online.de, AStA LUH Schwarzes Brett, WG-Gesucht',
    socialMedia: {
      reddit: `### [Hannover / Online] Klausurvorbereitung: 1-on-1 Mentorship in Higher Math, Physics & Python

Hey everyone! If you are preparing for your upcoming exam in *Höhere Mathematik I/II*, *Technische Mechanik*, *Electrodynamics*, or *Computational Physics* and need someone to walk through your syllabus with visual intuition rather than dry proofs:

I'm Daniel Santander, a Geophysicist (FCFM) with a Double M.Sc. in Engineering in Germany. I provide 1-on-1 and small-group mentorship in English and Spanish.
- We solve past exam problems on collaborative vector whiteboards (Miro).
- You get free access to my 14-Problem Interactive Physics Lab with live vector force diagrams.
- Rates start at 25 €/h (discounts up to -52% for 2–4 student study groups).

Test the free interactive simulators here:
👉 ${BASE_SITE_URL}?src=reddit-de

WhatsApp direct: +49 176 7649 7440`,
      whatsapp: `👋 Hey! If you're preparing for your Calculus, Linear Algebra, Mechanics, or Physics exams in Hannover or online:
I offer 1-on-1 mentorship and small study groups (up to 4 students with up to 52% off).
🔬 Miro vector whiteboard + free access to 14 interactive physics simulators:
👉 ${BASE_SITE_URL}?src=wa-group
DM me or reach out on WhatsApp at +49 176 7649 7440 for a free 15-min diagnostic call!`,
      facebook: `🎓 [University STEM Support & Exam Prep in Hannover / Online]
Struggling with Calculus (HM I/II), Physics, Mechanics, or Python?
I'm Daniel Santander, a Geophysicist with a Double M.Sc. in Engineering in Europe. I teach with the PIAD™ method: physical intuition, real-time force diagrams, and clean code.
• 1-on-1 sessions or study groups with friends (-30% to -52% each).
• High-resolution Miro board with vector PDF notes delivered after every session.
Test the free interactive simulators here: ${BASE_SITE_URL}?src=fb-hannover
Direct WhatsApp: +49 176 7649 7440`
    }
  },
  es_latam: {
    name: '🌎 Bilingual STEM Mentorship (English & Spanish)',
    badge: 'OPEN KNOWLEDGE STEM MENTORSHIP • PIAD™ METHOD',
    headline: 'STRUGGLING WITH CALCULUS, PHYSICS, LINEAR ALGEBRA, FLUIDS OR PYTHON?',
    subheadline: 'Geophysicist (FCFM) & Double M.Sc. in Engineering • From €25/h ($20.000 CLP/h)',
    languageNotice: '📌 Bilingual Mentorship: English & Spanish • Live Interactive Whiteboards (Miro) with Vector PDF delivery • Up to 52% off for study groups',
    bullets: [
      'Tier 1 (€25 / $20k CLP): Calculus I–II, Classical Mechanics, Wave Physics & IB / AP Diploma',
      'Tier 2 (€29 / $23k CLP): Linear Algebra, ODEs, Analytical Mechanics, Electromagnetism & Thermodynamics',
      'Tier 3 (€35 / $26k CLP): Fluid Dynamics, Geophysics, Scientific Python + Applied AI & Thesis Sprint',
      '14 Live Web Simulators: Interactive Free Body Diagrams (DCL) & real university exam problems solved step-by-step'
    ],
    footerCallout: 'Scan the QR code to test 14 free interactive simulators & book your 15-min diagnostic call.',
    tearOffTitle: 'Math/Physics/Python • €25/h',
    qrTag: 'flyer-bilingual',
    illustrationType: 'standard_physics',
    targetForums: 'r/EngineeringStudents, r/learnmath, Expat groups, University forums & Discord',
    socialMedia: {
      reddit: `### Struggling with Calculus, Physics, or Linear Algebra? [1-on-1 Mentorship + Free Simulators]

Hey everyone! Engineering and STEM midterms can be brutal, especially when courses focus on dry formulas instead of visual intuition.

I'm Daniel Santander, a Geophysicist with a Double M.Sc. in Engineering in Germany. I built an open web platform with 14 interactive physics simulators where you can see real-time Free Body Diagrams (FBD) and toggle between algebra and calculus:
👉 ${BASE_SITE_URL}?src=reddit-bilingual

I also offer 1-on-1 and small group mentorship (if you team up with 2 to 4 classmates, the price drops by up to 52% per student). Sessions are available in English or Spanish.

Feel free to reach out directly via WhatsApp: +49 176 7649 7440.`,
      whatsapp: `📚 Preparing for Calculus, Linear Algebra, or Physics exams?
I offer online 1-on-1 mentorship with Miro vector whiteboards and downloadable PDF notes.
• Form a study group with friends (2-4 students) and save up to 52% each!
• Free interactive simulators to master the concepts:
👉 ${BASE_SITE_URL}?src=wa-bilingual
WhatsApp: +49 176 7649 7440`,
      facebook: `📢 [University Mentorship: Calculus, Linear Algebra, Physics & Python]
Hi everyone! For anyone preparing for university STEM midterms and finals:
1-on-1 private mentorship with Daniel Santander (Geophysicist & Double M.Sc. in Engineering).
- Intuitive, visual problem-solving methodology (PIAD™).
- Collaborative Miro whiteboard & custom web simulators.
- Strong discounts for study groups of 2 to 4 students.
Test the simulators and book a free 15-min chat here: ${BASE_SITE_URL}?src=fb-bilingual`
    }
  },
  quantum_nerds: {
    name: '⚛️ Quantum Mechanics for Curious Minds (Intuitive / Non-Academic)',
    badge: 'THEORETICAL PHYSICS FOR SELF-TAUGHT & CURIOUS MINDS',
    headline: 'FASCINATED BY QUANTUM PHYSICS BUT TIRED OF DRY TEXTBOOKS?',
    subheadline: 'From Wave-Particle Duality and Schrödinger’s Cat to Quantum Computing without boring academic gatekeeping.',
    languageNotice: '💬 “God does not play dice with the universe... but we can simulate the odds!” — Master the real physics (Hilbert spaces, spin, superposition & entanglement) with pure geometric intuition and Python simulations.',
    bullets: [
      'Real Physics vs. Pop-Sci Mysticism: Demystify wave function collapse and the double-slit experiment with scientific clarity.',
      'Mathematical Intuition without Suffering: Pauli matrices, Hermitian operators & bra-ket notation explained with visual geometry.',
      'Hands-on Python Simulations: Code your own Gaussian wave packets and visualize quantum tunneling in real time.',
      'Modern Quantum Computing: Qubits, Bloch spheres and quantum logic gates (Hadamard, CNOT) for curious learners.'
    ],
    footerCallout: '1-on-1 mentorship for programmers, nerds & curious minds • English or Spanish • Scan QR to chat.',
    tearOffTitle: 'Quantum Physics • 1-on-1',
    qrTag: 'flyer-quantum',
    illustrationType: 'quantum_einstein',
    einsteinQuote: '“God does not play dice with the universe... but we can simulate the odds!”',
    targetForums: 'r/physics, r/popularscience, r/learnmath, r/QuantumComputing, Discord STEM, Hacker News',
    socialMedia: {
      reddit: `### Fascinated by Quantum Mechanics but tired of mystical pop-science and dry textbooks? [1-on-1 Mentorship for Curious Minds]

*"God does not play dice with the universe... but we can simulate the odds!"*

I've always loved teaching modern physics to people who want to genuinely understand how nature works at the fundamental level—without having to sit through 3 years of abstract academic gatekeeping or falling into YouTube pseudo-science.

I'm Daniel Santander, a Geophysicist and Double M.Sc. Engineer based in Germany. I designed a 1-on-1 program tailored for programmers, nerds, and curious self-learners:
1. **Demystifying the double-slit & collapse:** What the Copenhagen interpretation vs. Many-Worlds actually says.
2. **Hilbert spaces & Hermitian operators:** Explained with vectors, transformations, and geometric intuition.
3. **Numerical Python simulations:** Gaussian wave packets, finite-well potentials, and quantum tunneling in real time.
4. **Quantum Computing foundations:** Qubits, Bloch spheres, entanglement (Bell's theorem / EPR paradox), and quantum logic gates (Hadamard, CNOT).

Explore my open interactive physics platform here:
👉 ${BASE_SITE_URL}?src=reddit-quantum

If you'd like a free 15-minute introductory chat to talk physics and see what you'd love to explore, message me on WhatsApp: +49 176 7649 7440.`,
      whatsapp: `⚛️ Want to learn real Quantum Mechanics without impenetrable math or New Age mysticism?
I'm opening spots for 1-on-1 mentorship designed for curious minds, programmers, and self-learners.
We cover:
• EPR Paradox & Bell's Theorem (why Einstein doubted Copenhagen).
• Schrödinger's equation explained with live Python simulations.
• Qubits, superposition & Quantum Computing logic gates.
🔬 Test my interactive simulators here:
👉 ${BASE_SITE_URL}?src=wa-quantum
Let's talk on WhatsApp: +49 176 7649 7440!`,
      facebook: `⚛️ [Quantum Mechanics for Curious Minds: From Schrödinger to Quantum Computing]
Fascinated by quantum physics but bored by standard textbooks?
Learn it through visual intuition, live numerical simulations, and mathematical rigor without rigid academic barriers.
Personalized 1-on-1 mentorship with Daniel Santander (Geophysicist & Double M.Sc. in Germany).
Test the free interactive platform and schedule a 15-min chat:
${BASE_SITE_URL}?src=fb-quantum
WhatsApp: +49 176 7649 7440`
    }
  },
  thesis_support: {
    name: '🎓 Bachelor / Master Thesis (Modeling, Data & Python)',
    badge: 'RESEARCH & THESIS SPRINT • 1-ON-1 SCIENTIFIC MENTORSHIP',
    headline: 'STUCK WITH YOUR BACHELOR OR MASTER THESIS?',
    subheadline: 'Mentorship in Numerical Modeling, Scientific Python (NumPy/SciPy), Data Analysis & Publication-Grade Figures',
    languageNotice: '📌 Don’t let a broken simulation or poor plots delay your graduation. Guidance by a Geophysicist & Double M.Sc. Engineer.',
    bullets: [
      'Scientific Code Debugging: Fix your Python / MATLAB / R scripts so your numerical models run fast and bug-free.',
      'Paper-Quality Visualization: Turn raw data into publication-ready vector figures with Matplotlib, Seaborn & geospatial maps.',
      'Physical Process Modeling: Differential equations, finite differences, fluid flow, wave propagation or time series.',
      'Thesis Defense Preparation: Rigorous methodology structuring, result discussion & live simulation demos to impress your committee.'
    ],
    footerCallout: 'Free 15-min Methodological Diagnostic Call • Online Worldwide • Scan QR to book.',
    tearOffTitle: 'Thesis Support • Python/Data',
    qrTag: 'flyer-thesis',
    illustrationType: 'thesis_rocket',
    targetForums: 'r/GradSchool, r/EngineeringStudents, r/AskAcademia, Thesis Facebook Groups, University Discord',
    socialMedia: {
      reddit: `### [Thesis & Research Support] Stuck with your numerical modeling, Python scripts, or paper figures?

Many of us experience this during our Bachelor's or Master's thesis: your advisor has no time, your Python or MATLAB scripts crash with cryptic numerical errors, and the submission deadline is getting close.

I'm Daniel Santander (Geophysicist, Double M.Sc. in Engineering in Germany). I help thesis students with:
- Debugging and optimizing scientific code (NumPy, SciPy, Pandas).
- Publication-quality vector figures (Matplotlib, Seaborn, Paraview).
- Modeling physical systems, transport phenomena, time-series, and PDE solvers.
- Structuring your methodology and building interactive defense demos.

Explore my platform and interactive simulators here:
👉 ${BASE_SITE_URL}?src=reddit-thesis

Reach out on WhatsApp (+49 176 7649 7440) for a free 15-minute diagnostic call to review your thesis topic.`,
      whatsapp: `🎓 Stuck with numerical modeling or data visualization in your Bachelor's or Master's thesis?
Don't let code errors delay your graduation.
1-on-1 mentorship in:
• Data cleaning & numerical modeling in Python (NumPy/SciPy).
• Publication-grade vector figures.
• Preparation and demos for your thesis defense.
👉 ${BASE_SITE_URL}?src=wa-thesis
Let's chat for 15 mins (free): +49 176 7649 7440!`,
      facebook: `🎓 [S.O.S. Engineering & STEM Thesis: Numerical Modeling, Python & Figures]
Is your model failing to converge? Do your plots look unprofessional for your final defense?
I offer 1-on-1 technical and methodological mentorship for undergraduate and graduate students.
Web platform with simulators & research methodology:
${BASE_SITE_URL}?src=fb-thesis
WhatsApp: +49 176 7649 7440`
    }
  },
  python_stem_bootcamp: {
    name: '🐍 Scientific Python & Applied AI for STEM',
    badge: 'COMPUTATIONAL STEM BOOTCAMP • APPLIED AI & PYTHON',
    headline: 'FROM ZERO TO SIMULATING PHYSICS & ANALYZING DATA IN PYTHON WITH AI',
    subheadline: 'Master NumPy, SciPy, Matplotlib & precise mathematical prompting to accelerate your scientific workflow',
    languageNotice: '📌 Stop blindly copying AI snippets: learn to formulate the underlying physical model and audit code like a professional.',
    bullets: [
      'Vectorization & Performance: Master NumPy arrays and eliminate slow loops to simulate complex physical systems at high speed.',
      'Numerical Solvers: From non-linear oscillators to heat diffusion and orbital mechanics with scipy.integrate.',
      'Productive AI for Scientific Code: Advanced mathematical prompting techniques to code 3x faster without losing mathematical rigor.',
      'Real Portfolio Projects: Build your own interactive web simulators (like the 14 in this platform) for your research or CV.'
    ],
    footerCallout: 'Learn with universal code • 1-on-1 or small study groups • Scan QR to test the platform.',
    tearOffTitle: 'Python STEM + AI • 1-on-1',
    qrTag: 'flyer-python',
    illustrationType: 'python_ai',
    targetForums: 'r/Python, r/learnprogramming, r/datascience, Programming Discord Servers, LinkedIn',
    socialMedia: {
      reddit: `### From zero to simulating physics and analyzing scientific data in Python [AI-Assisted 1-on-1 Mentorship]

Many engineers and scientists learn Python by copying random StackOverflow snippets or trusting ChatGPT blindly, without understanding how to vectorize with NumPy or solve differential equations numerically.

I'm Daniel Santander, a Geophysicist and Double M.Sc. in Engineering in Germany.
I created a 1-on-1 mentorship focused on real computational STEM code:
- Pure vectorization in NumPy (say goodbye to slow for-loops).
- Numerical methods in SciPy (ODEs, optimization, Fourier transforms).
- Publication-grade figures with Matplotlib.
- Rigorous mathematical prompting: how to use AI to draft 80% of routine code while auditing formulation errors.

Test my 14 open-source simulators built with this philosophy:
👉 ${BASE_SITE_URL}?src=reddit-python

Message me on WhatsApp to chat: +49 176 7649 7440!`,
      whatsapp: `🐍 Want to master Python applied to engineering and science without wasting time on generic tutorials?
1-on-1 mentorship in Scientific Python (NumPy, SciPy, Matplotlib) + Productive AI techniques for scientific research.
👉 ${BASE_SITE_URL}?src=wa-python
Direct WhatsApp: +49 176 7649 7440!`,
      facebook: `🐍 [1-on-1 Bootcamp: Scientific Python & Numerical Simulation for STEM]
Learn to write physical simulations, data analysis pipelines, and differential equation solvers with NumPy and SciPy.
Interactive platform with live demos: ${BASE_SITE_URL}?src=fb-python
Contact: +49 176 7649 7440`
    }
  },
  math_for_ai: {
    name: '🧠 Mathematics for Machine Learning & Data Science',
    badge: 'AI MATHEMATICAL FOUNDATIONS • INTUITION FIRST',
    headline: 'THE MULTIVARIABLE CALCULUS & LINEAR ALGEBRA YOU ACTUALLY NEED FOR AI',
    subheadline: 'Understand Gradient Descent, Backpropagation, Covariance Matrices & SVD without 2 years of dry theory.',
    languageNotice: '📌 Connect pure mathematics directly to training Machine Learning models through interactive geometric visualizations.',
    bullets: [
      'Multivariable Calculus & Gradients: Jacobians, Hessians & chain rule applied directly to neural network optimization.',
      'Linear Algebra & Latent Spaces: Linear transformations, eigenvalues, eigenvectors & Singular Value Decomposition (SVD).',
      'Probability & Information Theory: Cross-entropy, continuous distributions & KL divergence explained with intuitive geometry.',
      'Direct Python Implementation: Every mathematical concept is implemented live to see how it minimizes a real loss function.'
    ],
    footerCallout: 'Master the mathematical foundations that separate a true AI engineer from a prompt copier • Scan QR to begin.',
    tearOffTitle: 'Math for AI • 1-on-1',
    qrTag: 'flyer-math-ai',
    illustrationType: 'math_ai',
    targetForums: 'r/MachineLearning, r/datascience, r/learnmath, Hacker News, Tech and Data Forums',
    socialMedia: {
      reddit: `### Want to truly understand Machine Learning but missing the calculus and linear algebra foundations?

It's easy to \`import torch\` or use Scikit-learn, but when a model fails to converge or you need to design custom architectures, understanding Jacobians, covariance matrices, and SVD is what separates a script runner from a senior ML scientist.

I offer 1-on-1 mentorship in the essential mathematical foundations for AI:
- Gradient descent & backpropagation derived through visual multivariable calculus.
- Geometric linear algebra: eigenvectors, orthogonal projection, and PCA from first principles.
- Information theory: cross-entropy and loss functions explained with geometry.
- Every single equation is translated into live Python code.

Try out my interactive 5-pillar mathematical toolkit here:
👉 ${BASE_SITE_URL}?src=reddit-math-ai

Direct WhatsApp: +49 176 7649 7440`,
      whatsapp: `🧠 Want to master the math behind Machine Learning (Multivariable Calculus, Linear Algebra & SVD)?
Personalized 1-on-1 mentorship focused on visual intuition and live Python implementation.
👉 ${BASE_SITE_URL}?src=wa-math-ai
WhatsApp: +49 176 7649 7440!`,
      facebook: `🧠 [Mathematics for Artificial Intelligence & Data Science]
Master vector calculus, linear algebra, and optimization behind modern neural networks.
1-on-1 mentorship with Daniel Santander (Geophysicist & Double M.Sc. in Engineering).
Interactive simulators: ${BASE_SITE_URL}?src=fb-math-ai
WhatsApp: +49 176 7649 7440`
    }
  },
  ib_en: {
    name: '🌍 International & IB Diploma (AA/AI SL & HL)',
    badge: 'IB DIPLOMA & UNIVERSITY STEM MENTORSHIP',
    headline: 'MASTER IB & UNIVERSITY MATH, PHYSICS & PYTHON WITH VISUAL INTUITION',
    subheadline: 'Geophysicist & Double M.Sc. Engineer • The PIAD™ Scientific Inquiry Method • From €25/h',
    languageNotice: '📌 Bilingual Mentorship: English & Spanish • Online Worldwide & In-Person in Hannover',
    bullets: [
      'IB Physics & Math (AA / AI — SL & HL): Exam paper drills, Internal Assessments (IA) & scientific lab graphs (€25/h)',
      'Interactive 14-Problem Physics Lab: Live Free Body Diagrams (DCL) & Algebra ↔ Calculus toggle',
      '5-Pillar Applied Math Toolkit: Taylor Series, 2D Matrices, Damped ODEs, Vector Fields & FFT Signals',
      'Productive AI for Python: Learn to design & verify scientific code + get full Miro Vector PDF notes'
    ],
    footerCallout: 'Scan the QR Code to test the 14 Interactive Simulators for free & book your 15-min diagnostic!',
    tearOffTitle: 'IB & Uni STEM • €25/h',
    qrTag: 'flyer-ib-en',
    illustrationType: 'standard_physics',
    targetForums: 'r/IBO, r/learnmath, Expat Facebook Groups, International School Hannover Region',
    socialMedia: {
      reddit: `### [IB Diploma & Uni STEM] 1-on-1 Mentorship in Physics, Math AA/AI & Scientific Python

Struggling with IB Physics HL, Math Analysis & Approaches (AA), or your Internal Assessment (IA)?

I'm Daniel Santander, a Geophysicist and Double M.Sc. Engineer based in Hannover, Germany. I provide bilingual (English/Spanish) mentorship for IB and university students:
- Visual intuition first: Free Body Diagrams (DCL) and algebra-calculus connections.
- Free access to my custom 14-Simulator Interactive Physics Lab and 5-Pillar Math Toolkit.
- Support with Internal Assessments (IA) and scientific Python data visualization.

Test the simulators here:
👉 ${BASE_SITE_URL}?src=reddit-ib

WhatsApp direct: +49 176 7649 7440`,
      whatsapp: `🌍 IB Diploma & University STEM Mentorship (Physics, Math, Python).
Interactive simulations, past paper drills, and vector PDF notes after every class.
👉 ${BASE_SITE_URL}?src=wa-ib
WhatsApp: +49 176 7649 7440`,
      facebook: `🌍 [IB Physics & Math AA/AI Mentorship • English & Spanish]
1-on-1 scientific mentorship with Daniel Santander (Geophysicist & Double M.Sc. Engineer).
Interactive simulators + Internal Assessment guidance.
Explore: ${BASE_SITE_URL}?src=fb-ib
WhatsApp: +49 176 7649 7440`
    }
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
  const [adminLang, setAdminLang] = useState(() => {
    try {
      return localStorage.getItem('ds_admin_lang') || 'es';
    } catch {
      return 'es';
    }
  });

  const handleToggleAdminLang = (newLang) => {
    setAdminLang(newLang);
    try {
      localStorage.setItem('ds_admin_lang', newLang);
    } catch (e) {}
    setWaLang(newLang);
    setAdminInstaLang(newLang);
  };

  const t = (esText, enText) => (adminLang === 'en' ? enText : esText);

  const [adminTheme, setAdminTheme] = useState(() => {
    try {
      return localStorage.getItem('ds_admin_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const handleSetAdminTheme = (newTheme) => {
    setAdminTheme(newTheme);
    try {
      localStorage.setItem('ds_admin_theme', newTheme);
    } catch (e) {}
  };

  const [adminLayout, setAdminLayout] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_layout');
      if (saved === 'tabbed') {
        localStorage.setItem('ds_admin_layout', 'sidebar');
        return 'sidebar';
      }
      return saved || 'sidebar';
    } catch {
      return 'sidebar';
    }
  });

  const handleSetAdminLayout = (newLayout) => {
    setAdminLayout(newLayout);
    try {
      localStorage.setItem('ds_admin_layout', newLayout);
    } catch (e) {}
  };

  const [activeTab, setActiveTab] = useState('strategy');
  const [adLangFilter, setAdLangFilter] = useState('all');
  const [crmSearch, setCrmSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [pipelineView, setPipelineView] = useState('kanban');

  // Marketing & Social Studio State
  const [adminInstaLang, setAdminInstaLang] = useState('es');
  const [adminInstaCaptionMode, setAdminInstaCaptionMode] = useState('referral');
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
  const [simBaseEur, setSimBaseEur] = useState(25);

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
      const saved = localStorage.getItem('ds_admin_channels_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('ds_admin_channels_v3');
      if (old) {
        const oldArr = JSON.parse(old);
        if (Array.isArray(oldArr)) {
          const existingIds = new Set(oldArr.map((c) => c.id));
          const merged = [...oldArr, ...INITIAL_CHANNELS.filter((c) => !existingIds.has(c.id))];
          return merged;
        }
      }
      return INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // Persisted Street Boards
  const [streetLocations, setStreetLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_street_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_STREET_LOCATIONS;
    } catch {
      return INITIAL_STREET_LOCATIONS;
    }
  });

  // Persisted Leads (CRM Pipeline)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_leads_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_LEADS;
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

  // Master Posting Checklist State (Physical + Digital Channels + Forums)
  const [masterChecklist, setMasterChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_admin_master_checklist_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_MASTER_CHECKLIST;
    } catch {
      return INITIAL_MASTER_CHECKLIST;
    }
  });
  const [checklistFilter, setChecklistFilter] = useState('all'); // 'all' | 'fisico' | 'clasificado' | 'foro' | 'pending' | 'completed'
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: 'fisico',
    zone: '',
    country: '🇩🇪 Hannover',
    url: '',
    notes: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('ds_admin_master_checklist_v1', JSON.stringify(masterChecklist));
    } catch {}
  }, [masterChecklist]);

  const toggleMasterChecklistItem = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setMasterChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isCurrentlyDone = item.status === 'publicado';
          return {
            ...item,
            status: isCurrentlyDone ? 'pendiente' : 'publicado',
            lastChecked: isCurrentlyDone ? '' : todayStr
          };
        }
        return item;
      })
    );
  };

  const markItemCheckedToday = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setMasterChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'publicado', lastChecked: todayStr } : item
      )
    );
  };

  const handleAddNewPlace = (e) => {
    e.preventDefault();
    if (!newPlace.name.trim()) return;
    const item = {
      id: `custom-${Date.now()}`,
      category: newPlace.category,
      name: newPlace.name.trim(),
      zone: newPlace.zone.trim() || 'General',
      country: newPlace.country.trim() || 'Internacional',
      status: 'pendiente',
      lastChecked: '',
      url: newPlace.url.trim(),
      notes: newPlace.notes.trim() || 'Lugar personalizado añadido por Daniel.'
    };
    setMasterChecklist((prev) => [item, ...prev]);
    setNewPlace({
      name: '',
      category: 'fisico',
      zone: '',
      country: '🇩🇪 Hannover',
      url: '',
      notes: ''
    });
    setShowAddPlaceModal(false);
  };

  const deleteMasterChecklistItem = (id) => {
    setMasterChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const resetMasterChecklist = () => {
    if (window.confirm('¿Deseas reiniciar todos los lugares a "Pendiente" para iniciar un nuevo ciclo de difusión?')) {
      setMasterChecklist((prev) => prev.map((i) => ({ ...i, status: 'pendiente', lastChecked: '' })));
    }
  };

  // Printable A4 Flyer Generator state
  const [flyerPresetKey, setFlyerPresetKey] = useState('de_en');
  const [flyerInkSaving, setFlyerInkSaving] = useState(true);
  const [flyerTabsCount, setFlyerTabsCount] = useState(10);
  const [customFlyer, setCustomFlyer] = useState(FLYER_PRESETS.de_en);
  const [flyerSocialChannel, setFlyerSocialChannel] = useState('reddit');

  useEffect(() => {
    try {
      localStorage.setItem('ds_admin_channels_v4', JSON.stringify(channels));
    } catch {}
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_admin_street_v3', JSON.stringify(streetLocations));
    } catch {}
  }, [streetLocations]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_admin_leads_v3', JSON.stringify(leads));
    } catch {}
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_admin_goal_eur', String(monthlyGoalEur));
    } catch {}
  }, [monthlyGoalEur]);

  const copyToClipboard = (text, id) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch {}
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

  const handleApplyPonderanteSimulation = () => {
    const base = Math.max(10, Number(simBaseEur) || 25);
    const updated = { ...liveTiers };
    for (const code of Object.keys(updated)) {
      const t = updated[code];
      const pond = t.ponderante || 1.0;
      let newIb = 25;
      if (code === 'EUR') {
        newIb = Math.round(base);
      } else if (code === 'CHF') {
        newIb = Math.round(base * pond);
      } else if (code === 'GBP') {
        newIb = Math.round((base * pond) / 1.18);
      } else if (code === 'USD') {
        newIb = Math.round((base * pond) / 0.92);
      } else if (code === 'CLP') {
        newIb = Math.round(((base * pond) / 0.00098) / 1000) * 1000;
      }

      const newBachelor = code === 'CLP' ? Math.round((newIb * 1.15) / 1000) * 1000 : Math.round(newIb * 1.16);
      const newMaster = code === 'CLP' ? Math.round((newIb * 1.30) / 1000) * 1000 : Math.round(newIb * 1.40);

      updated[code] = {
        ...t,
        rates: {
          ib: newIb,
          bachelor: newBachelor,
          mechanics: newBachelor,
          master: newMaster
        },
        packs8h: {
          ib: Math.round(newIb * 8 * 0.85),
          bachelor: Math.round(newBachelor * 8 * 0.85),
          mechanics: Math.round(newBachelor * 8 * 0.85),
          master: Math.round(newMaster * 8 * 0.85)
        }
      };
    }
    setLiveTiers(updated);
    saveCustomCurrencyRates(updated);
    setPriceSavedBanner(true);
    setTimeout(() => setPriceSavedBanner(false), 4000);
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
  } else if (selectedWaSubject.id === 'mentes_curiosas') {
    generatedWhatsAppMessage =
      waLang === 'es'
        ? `¡Hola${waStudentName ? ` ${waStudentName}` : ''}! Qué tal, te habla Daniel S. Santander Urrutia (Geofísico de la U. de Chile y Doble M.Sc. en Alemania).

¡Me alegra muchísimo tu mensaje! Tengo un espacio formativo diseñado especialmente para niños y jóvenes con alta curiosidad e interés por las matemáticas y las ciencias naturales.

Lejos de la repetición mecánica o la presión de notas del colegio, aquí trabajamos la intuición geométrica espacial, la lógica deductiva, el porqué de los números primos y física intuitiva (como las órbitas planetarias y la gravedad de Kepler) a través de los simuladores interactivos de mi propia plataforma:
${selectedWaSubject.simUrl}

💰 *Valores (${waMode === 'inperson' ? 'Presencial en Hannover' : 'Online en vivo por Meet'}):*
• *Individual (1-a-1):* ${formatMoney(waFinalHourly, waCurrency)}/h
• *Pack Formativo de 8h (-15% dcto.):* ${formatMoney(waPackHourly, waCurrency)}/h (${formatMoney(waPackHourly * 8, waCurrency)} total)
${waG2.studentDiscountPct > 0 ? `• *Grupo de 2 niños/hermanos/amigos (-${waG2.studentDiscountPct}% c/u):* ${formatMoney(waG2.perStudentHourly, waCurrency)}/h cada uno` : ''}

Podemos coordinar una *videollamada breve de 15 minutos sin costo* para conocernos, conversar con tu hijo/a y ver qué temas le apasionan más. ¿Qué día y horario les acomodaría?`
        : `Hi${waStudentName ? ` ${waStudentName}` : ''}! This is Daniel S. Santander Urrutia (Geophysicist & Double European M.Sc. in Germany).

I am delighted by your message! I run a mentorship track tailored specifically for curious children and teenagers who love asking deep questions about mathematics and nature.

Far from rote memorization or school pressure, we explore spatial geometric intuition, first-principles logic, the secret patterns of prime numbers, and hands-on physics (like Keplerian orbits and gravity) through the interactive simulators on my platform:
${selectedWaSubject.simUrl}

💰 *Tuition Rates (${waMode === 'inperson' ? 'In-Person in Hannover' : 'Live Online via Meet'}):*
• *Solo (1-on-1):* ${formatMoney(waFinalHourly, waCurrency)}/h
• *8-Hour Learning Bundle (15% off):* ${formatMoney(waPackHourly, waCurrency)}/h (${formatMoney(waPackHourly * 8, waCurrency)} total)
${waG2.studentDiscountPct > 0 ? `• *Pair (2 siblings or friends, -${waG2.studentDiscountPct}% each):* ${formatMoney(waG2.perStudentHourly, waCurrency)}/h per student` : ''}

We can schedule a *free 15-minute introductory video call* to meet, chat with your child, and discover what scientific topics spark their interest most. What days and times work best for you?`;
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

💰 *Tuition Rates (${waMode === 'inperson' ? 'In-Person in Hannover' : 'Live Online'}):*
• *Solo (1-on-1):* ${formatMoney(waFinalHourly, waCurrency)}/h (or *${formatMoney(waPackHourly, waCurrency)}/h* with the 8h Exam Sprint Pack -15%)
• *With +1 classmate (2 students, -${waG2.studentDiscountPct}% each):* ${formatMoney(waG2.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG2.totalGroupHourly, waCurrency)}/h total)
• *With +2 classmates (3 students, -${waG3.studentDiscountPct}% each):* ${formatMoney(waG3.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG3.totalGroupHourly, waCurrency)}/h total)
• *With +3 classmates (4 students, -${waG4.studentDiscountPct}% each):* ${formatMoney(waG4.perStudentHourly, waCurrency)}/h per student (${formatMoney(waG4.totalGroupHourly, waCurrency)}/h total)

*(Note: I also gladly accept barter/skill exchange or solidarity arrangements if you are facing financial hardship).*

Would you like to hop on a *free 15-minute diagnostic call* on Google Meet today or tomorrow to review your syllabus and exam date?`;
  }

  const flyerTargetUrl = `${BASE_SITE_URL}?src=${encodeURIComponent(customFlyer.qrTag || 'flyer')}`;
  const flyerQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(flyerTargetUrl)}`;
  const currentSocialPostText =
    customFlyer?.socialMedia?.[flyerSocialChannel] ||
    customFlyer?.socialMedia?.reddit ||
    `Hey! Preparing for STEM exams or exploring physics simulations... ${BASE_SITE_URL}?src=${customFlyer?.qrTag || 'flyer'}`;

  const handleSelectFlyerPreset = (key) => {
    setFlyerPresetKey(key);
    setCustomFlyer(FLYER_PRESETS[key]);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-200 ${
      adminTheme === 'light'
        ? 'ds-admin-light bg-slate-50 text-slate-900'
        : adminTheme === 'warm'
        ? 'ds-admin-warm bg-[#FBF9F4] text-stone-900'
        : 'ds-admin-dark bg-[#070B14] text-slate-100'
    }`}>
      {/* Subtle Ambient Background Glows (hidden when printing) */}
      <div className="no-print pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Mission Control Header */}
      <header className="no-print sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-md shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Daniel S. Santander Urrutia
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('Cockpit Activo', 'Cockpit Active')}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{t('Panel de Administración & Conversión', 'Admin & Conversion Workspace')}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{t('Base EUR 1.00x', 'Base EUR 1.00x')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Layout Switcher (Tabs vs Sidebar) */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-0.5 font-mono text-xs shadow-inner">
              <button
                type="button"
                onClick={() => handleSetAdminLayout('tabbed')}
                title={t('Diseño Barra Superior (Tabs)', 'Top Navigation Layout')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminLayout === 'tabbed'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{t('Pestañas', 'Tabs')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetAdminLayout('sidebar')}
                title={t('Diseño Barra Lateral (Sidebar)', 'Sidebar Navigation Layout')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminLayout === 'sidebar'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PanelLeft className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{t('Lateral', 'Sidebar')}</span>
              </button>
            </div>

            {/* Theme Selector: Claro / Cálido / Oscuro */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-0.5 font-mono text-xs shadow-inner">
              <button
                type="button"
                onClick={() => handleSetAdminTheme('light')}
                title={t('Tema Claro / SaaS White', 'Light Theme / Clean SaaS White')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  adminTheme === 'light'
                    ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t('Claro', 'Light')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetAdminTheme('warm')}
                title={t('Tema Cálido / Cuaderno Marfil', 'Warm Theme / Engineering Cream')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  adminTheme === 'warm'
                    ? 'bg-amber-600/30 text-amber-200 font-bold border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📖</span>
                <span className="hidden sm:inline">{t('Cálido', 'Warm')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetAdminTheme('dark')}
                title={t('Tema Oscuro / Cockpit Espacial', 'Dark Theme / Space Cockpit')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  adminTheme === 'dark'
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">{t('Oscuro', 'Dark')}</span>
              </button>
            </div>

            {/* Bilingual Language Switcher (ES / EN) */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-0.5 font-mono text-xs shadow-inner">
              <button
                type="button"
                onClick={() => handleToggleAdminLang('es')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  adminLang === 'es'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇪🇸</span>
                <span>ES</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleAdminLang('en')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  adminLang === 'en'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <a
              href="https://wa.me/4917676497440"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700/80 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Volver', 'Exit')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${adminLayout === 'sidebar' ? 'flex flex-col lg:flex-row gap-6' : 'space-y-6'}`}>

        {/* ================================================================= */}
        {/* SIDEBAR NAVIGATION (When layout === 'sidebar')                    */}
        {/* ================================================================= */}
        {adminLayout === 'sidebar' && (
          <aside className="no-print lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-0.5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-2">
                {t('Navegación del Cockpit', 'Cockpit Navigation')}
              </span>
              {[
                { id: 'strategy', label: t('Tarifas & PPP', 'Rates & PPP'), icon: Sliders, badge: '1.00x' },
                { id: 'whatsapp', label: t('Cerrador WhatsApp', 'WhatsApp Closer'), icon: MessageSquare, badge: '60s' },
                { id: 'crm', label: t('Alumnos CRM', 'Students CRM'), icon: Users, badge: `${activeStudentsCount}` },
                { id: 'classifieds', label: t('Avisos & Portales', 'Ads & Portals'), icon: CheckCircle2, badge: `${channels.length}` },
                { id: 'flyer', label: t('Flyer A4 Imprimible', 'Printable A4 Flyer'), icon: Printer },
                { id: 'marketing', label: t('Social Media Kit', 'Social Media Kit'), icon: Megaphone }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-md shadow-sky-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Profile Snapshot Card in Sidebar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-emerald-400 font-bold block">
                {t('Resumen Rápido', 'Quick Snapshot')}
              </span>
              <div className="flex justify-between text-slate-400">
                <span>{t('Meta Mensual:', 'Target:')}</span>
                <strong className="text-white">€{monthlyGoalEur}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('Cobrado hoy:', 'Collected:')}</span>
                <strong className="text-emerald-400">€{paidRevenueEur}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('Alumnos activos:', 'Active:')}</span>
                <strong className="text-sky-400">{activeStudentsCount}</strong>
              </div>
            </div>
          </aside>
        )}

        {/* Content Area (Wide) */}
        <div className={`flex-1 space-y-6 ${adminLayout === 'sidebar' ? 'min-w-0' : ''}`}>

          {/* ================================================================= */}
          {/* TOP NAV TABS (When layout === 'tabbed')                           */}
          {/* ================================================================= */}
          {adminLayout === 'tabbed' && (
            <div className="no-print flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
              {[
                { id: 'strategy', label: t('Tarifas & PPP', 'Rates & PPP'), icon: Sliders, badge: '1.00x' },
                { id: 'whatsapp', label: t('Cerrador WhatsApp', 'WhatsApp Closer'), icon: MessageSquare, badge: '60s' },
                { id: 'crm', label: t('Alumnos CRM', 'Students CRM'), icon: Users, badge: `${activeStudentsCount}` },
                { id: 'classifieds', label: t('Avisos & Portales', 'Ads & Portals'), icon: CheckCircle2, badge: `${channels.length}` },
                { id: 'flyer', label: t('Flyer A4 Imprimible', 'Printable A4 Flyer'), icon: Printer },
                { id: 'marketing', label: t('Social Media Kit', 'Social Media Kit'), icon: Megaphone }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-md shadow-sky-600/20'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ================================================================= */}
          {/* EXECUTIVE 4-METRIC DASHBOARD GRID                                */}
          {/* ================================================================= */}
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Monthly Revenue Goal */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t('Meta Mensual', 'Monthly Target')}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                  {goalProgressPct}%
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">€{paidRevenueEur}</span>
                  <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
                    <span>meta: €</span>
                    <input
                      type="number"
                      step="100"
                      min="200"
                      value={monthlyGoalEur}
                      onChange={(e) => setMonthlyGoalEur(Number(e.target.value) || 1000)}
                      className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-white text-right font-bold"
                    />
                  </div>
                </div>
                {/* Clean mini progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden mt-2 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-300 transition-all duration-500"
                    style={{ width: `${Math.max(4, goalProgressPct)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>{t('Faltan ~', 'Remaining ~')}<strong className="text-white">{Math.ceil(Math.max(0, monthlyGoalEur - paidRevenueEur) / 25)}h</strong></span>
                <span className="text-sky-400">Pipeline: <strong>€{pipelineRevenueEur}</strong></span>
              </div>
            </div>

            {/* Metric 2: Active Students & Pipeline */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('Alumnos & Leads', 'Students & Leads')}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold text-[10px]">
                  {leads.length} {t('totales', 'total')}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">{activeStudentsCount}</span>
                  <span className="text-xs font-mono text-slate-400">{t('alumnos activos', 'active students')}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {leads.filter(l => l.status === 'Diagnostic Booked').length} {t('diagnósticos agendados', 'diagnostics booked')}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>{t('Horas dictadas:', 'Delivered hours:')}</span>
                <strong className="text-emerald-300">{totalHoursCompleted}h</strong>
              </div>
            </div>

            {/* Metric 3: Channels & Renewal */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t('Portales & Avisos', 'Portals & Ads')}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  expiredChannelsCount > 0
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                }`}>
                  {expiredChannelsCount > 0 ? `${expiredChannelsCount} ${t('renovar', 'renew')}` : t('Al día ✓', 'Up to date ✓')}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">{activeChannelsCount}</span>
                  <span className="text-xs font-mono text-slate-400">/ {channels.length} {t('activos', 'active')}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {masterChecklist.filter(i => i.status === 'publicado').length}/{masterChecklist.length} {t('puntos cubiertos', 'checkpoints covered')}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>{t('Flyers en calle:', 'Street flyers:')}</span>
                <strong className="text-amber-300">{activeStreetCount} / {streetLocations.length}</strong>
              </div>
            </div>

            {/* Metric 4: Quick Actions & Cockpit Helpers */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t('Acceso Inmediato', 'Quick Actions')}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">1-clic</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('crm')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Alumno</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('classifieds')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span>Anuncio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('strategy')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Precios</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>{t('Base de cobro:', 'Base rate:')}</span>
                <strong className="text-white">€25 / $20k CLP</strong>
              </div>
            </div>

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
                    {t('Tarifación Escalonada por Complejidad de Materia + Poder Adquisitivo (PPP)', 'Tiered Tuition by Subject Complexity + Purchasing Power (PPP)')}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {t('Editor de Precios en Vivo (Sincronizado con la Calculadora Pública)', 'Live Rate Editor (Synced with Public Pricing Calculator)')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    {t(
                      'Cálculo y Física I parten ahora en $20.000 CLP/h en Chile y €25/h en Europa para que te lleguen muchos más alumnos desde el primer día. Puedes modificar cualquier número aquí abajo y pulsar Guardar Cambios en la Web cuando quieras subir tus tarifas.',
                      'Calculus and Physics I start at $20,000 CLP/h in Chile and €25/h in Europe to maximize inquiry volume from day one. Modify any figure below and click Save Changes to Website whenever you wish to adjust rates.'
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleResetDefaultPrices}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('Restaurar Sugeridos ($20k / €25)', 'Restore Recommended ($20k / €25)')}</span>
                  </button>
                  <button
                    onClick={handleSaveCustomPrices}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t('Guardar Cambios en la Web', 'Save Changes to Website')}</span>
                  </button>
                </div>
              </div>

              {priceSavedBanner && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t('¡Precios actualizados! La calculadora pública y las tarjetas de cursos ya muestran estos valores.', 'Rates successfully saved! The public pricing calculator and course modules are now live with these values.')}</span>
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
                      {adminLang === 'en' ? st.badgeEn : st.badgeEs}
                    </div>
                    <div className="text-xs text-white font-semibold">
                      {adminLang === 'en' ? st.shortEn : st.shortEs}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {adminLang === 'en' ? st.coursesEn : st.coursesEs}
                    </p>
                  </div>
                ))}
              </div>

              {/* ================================================================= */}
              {/* PONDERANTES ECONÓMICOS POR PAÍS (BASE EURO = 1.00x) & SIMULADOR    */}
              {/* ================================================================= */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 border border-sky-500/30 space-y-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400 font-bold">
                        {t('Ponderantes Económicos por País', 'Purchasing Power Factors by Country')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold">
                        {t('Base EUR = 1.00x', 'Base EUR = 1.00x')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {t('Relación de Precios según Capacidad de Gasto por País', 'Price Multipliers by Regional Spending Capacity')}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
                      {t(
                        'Tomando el Euro como valor ponderante base de 1.00x (lo que se cobra en Alemania y Europa), cada país tiene su ponderante respectivo que indica cuántas veces se multiplica el valor de acuerdo a lo que pueden gastar sus estudiantes y familias.',
                        'Setting the Euro as the baseline anchor of 1.00x (standard tuition in Germany & EU), each currency operates on an empirical multiplier reflecting local purchasing power parity.'
                      )}
                    </p>
                  </div>

                  {/* Simulator Box */}
                  <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 space-y-3 font-mono text-xs shrink-0 shadow-lg">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{t('Simulador Rápido por Ponderante', 'Quick Multiplier Simulator')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{t('Base EUR: €', 'Base EUR: €')}</span>
                      <input
                        type="number"
                        min="15"
                        max="80"
                        value={simBaseEur}
                        onChange={(e) => setSimBaseEur(Number(e.target.value) || 25)}
                        className="w-16 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-sky-500/50 text-white font-bold text-center"
                      />
                      <span className="text-[11px] text-slate-400">/h {t('Nivel 1', 'Tier 1')}</span>
                      <button
                        onClick={handleApplyPonderanteSimulation}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm shadow-sky-600/30"
                      >
                        ⚡ {t('Aplicar a la Web', 'Apply to Site')}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t('Calcula CHF (1.65x), CLP (0.80x), GBP (1.15x) y USD (1.10x) al instante.', 'Recalculates CHF (1.65x), CLP (0.80x), GBP (1.15x), USD (1.10x) instantly.')}
                    </div>
                  </div>
                </div>

                {/* 5 Currency Cards with Ponderante Multipliers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
                  {Object.values(liveTiers).map((tier) => {
                    const isBase = tier.code === 'EUR';
                    const pond = tier.ponderante || 1.0;
                    return (
                      <div
                        key={tier.code}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isBase
                            ? 'bg-sky-950/30 border-sky-500/40 shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base">{tier.flag}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isBase
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : pond > 1.0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {pond.toFixed(2)}x
                          </span>
                        </div>
                        <div className="font-bold text-white text-xs mb-1">
                          {tier.code} — {adminLang === 'en' ? (tier.labelEn?.split('•')[1] || tier.code) : (tier.labelEs.split('•')[1] || tier.code)}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-extrabold mb-1.5">
                          {formatMoney(tier.rates.ib, tier.code)}/h
                        </div>
                        <p className="text-[10px] font-sans text-slate-400 leading-tight">
                          {adminLang === 'en' ? tier.ponderanteDescEn : tier.ponderanteDescEs}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Visual Purchasing Power Benchmark Bar */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t('Escala Comparativa de Poder Adquisitivo vs. Base EUR (1.00x)', 'Purchasing Power Benchmark vs. Base EUR (1.00x)')}</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">{t('Alemania/UE = 100% Benchmark', 'Germany/EU = 100% Benchmark')}</span>
                  </div>
                  <div className="space-y-2 pt-1 font-mono text-[11px]">
                    {[
                      { code: 'CHF', name: t('Suiza (ETH / EPFL / Expat)', 'Switzerland (ETH / EPFL / Expat)'), flag: '🇨🇭', mult: 1.65, pct: 100, color: 'bg-emerald-500' },
                      { code: 'GBP', name: t('Reino Unido (Imperial / Cambridge)', 'United Kingdom (Imperial / Cambridge)'), flag: '🇬🇧', mult: 1.15, pct: 70, color: 'bg-sky-400' },
                      { code: 'USD', name: t('EE.UU. / Internacional (Ivy League / Tech)', 'USA / International (Ivy / Tech)'), flag: '🇺🇸', mult: 1.10, pct: 67, color: 'bg-cyan-400' },
                      { code: 'EUR', name: t('Alemania & Zona Euro (LUH / TUM / Uni)', 'Germany & Eurozone (LUH / TUM / Uni)'), flag: '🇩🇪🇪🇺', mult: 1.00, pct: 61, color: 'bg-indigo-400' },
                      { code: 'CLP', name: t('Chile (FCFM Beauchef / PUC / USM)', 'Chile (FCFM Beauchef / PUC / USM)'), flag: '🇨🇱', mult: 0.80, pct: 48, color: 'bg-amber-400' },
                    ].map((item) => (
                      <div key={item.code} className="flex items-center gap-3">
                        <span className="w-16 shrink-0 font-bold text-white flex items-center gap-1">
                          <span>{item.flag}</span>
                          <span>{item.code}</span>
                        </span>
                        <div className="flex-1 h-2.5 rounded-full bg-slate-900 overflow-hidden relative border border-slate-800">
                          <div
                            className={`h-full rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                        <span className="w-14 text-right font-extrabold text-white shrink-0">
                          {item.mult.toFixed(2)}x
                        </span>
                        <span className="hidden sm:inline w-56 text-slate-400 text-[10px] truncate shrink-0">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Editable Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="py-3.5 px-4">País / Moneda</th>
                      <th className="py-3.5 px-4">Ponderante</th>
                      <th className="py-3.5 px-4">🟢 Nivel 1: Cálculo, Física I &amp; Mentes Curiosas (1h)</th>
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
                      const pond = tier.ponderante || 1.0;
                      return (
                        <tr key={tier.code} className="hover:bg-slate-800/30">
                          <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                            <span className="mr-2 text-base">{tier.flag}</span>
                            {tier.code} — {tier.labelEs.split('•')[1] || tier.code}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tier.code === 'EUR'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : pond > 1.0
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {pond.toFixed(2)}x
                            </span>
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
                  <h2 className="text-lg font-bold text-white">
                    {t('Registrar Nuevo Alumno / Lead', 'Register New Student / Lead')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t(
                      'Al marcar un alumno como Pagado ✓, su monto se suma automáticamente a tu barra de Meta Mensual arriba.',
                      'Marking a student as Paid ✓ automatically tallies their tuition towards your Monthly Target above.'
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Live Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('Buscar alumno o ramo...', 'Search student or course...')}
                      value={crmSearch}
                      onChange={(e) => setCrmSearch(e.target.value)}
                      className="px-3 py-1.5 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs placeholder:text-slate-500 w-44 sm:w-56 focus:outline-none focus:border-sky-500 shadow-inner"
                    />
                    <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    {crmSearch && (
                      <button
                        type="button"
                        onClick={() => setCrmSearch('')}
                        className="text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs shadow-inner">
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
                      <span>{t('Tabla', 'Table')}</span>
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddLead} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                <input
                  type="text"
                  placeholder={t('Nombre del alumno *', 'Student name *')}
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Ramo (ej. Cálculo I, Fluidos)', 'Course (e.g. Calculus, Fluids)')}
                  value={newLead.subject}
                  onChange={(e) => setNewLead({ ...newLead, subject: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <input
                  type="text"
                  placeholder={t('Universidad / Colegio', 'University / School')}
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
                    placeholder={t('Tarifa/h', 'Rate/h')}
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
                    title={t('Horas del plan', 'Plan hours')}
                  />
                  <span className="text-slate-400 text-[11px]">hrs</span>
                  <select
                    value={newLead.mode}
                    onChange={(e) => setNewLead({ ...newLead, mode: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person Hannover">{t('Presencial (+Extra)', 'In-Person (+Extra)')}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('Añadir Alumno', 'Add Student')}</span>
                </button>
              </form>
            </div>

            {pipelineView === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {KANBAN_COLUMNS.map((col) => {
                  const colLeads = leads.filter((l) => {
                    if (l.status !== col.id) return false;
                    if (!crmSearch.trim()) return true;
                    const q = crmSearch.toLowerCase();
                    return l.name?.toLowerCase().includes(q) || l.subject?.toLowerCase().includes(q) || l.university?.toLowerCase().includes(q);
                  });
                  return (
                    <div
                      key={col.id}
                      className={`bg-slate-900/90 border ${col.border} rounded-2xl p-4 flex flex-col min-h-[430px]`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                          <span className="font-mono text-xs font-bold text-white">
                            {adminLang === 'en' ? (col.labelEn || col.label) : (col.labelEs || col.label)}
                          </span>
                        </div>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 font-bold">
                          {colLeads.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colLeads.length === 0 && (
                          <div className="text-center py-10 text-xs text-slate-600 font-mono">
                            {crmSearch ? t('Sin coincidencias', 'No matches found') : t('Sin alumnos en esta etapa', 'No students in this stage')}
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
            {/* Master Checklist Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Header & Overall Progress */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold block">
                      Difusión Multi-Canal • Checklist Operativo
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                      {masterChecklist.filter((i) => i.status === 'publicado').length}/{masterChecklist.length} Cubiertos
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Checklist de Posteo &amp; Lugares (Físicos, Clasificados &amp; Foros)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Haz clic en el checkbox conforme vayas pegando carteles en campus o publicando anuncios en portales y foros. El sistema guarda la fecha y te avisa cuando un anuncio cumpla más de 5 días para republicarlo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowAddPlaceModal(!showAddPlaceModal)}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddPlaceModal ? 'Cerrar Formulario' : 'Añadir Nuevo Lugar'}</span>
                  </button>
                  <button
                    onClick={resetMasterChecklist}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Reiniciar todos a pendiente para un nuevo ciclo de exámenes"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nuevo Ciclo</span>
                  </button>
                </div>
              </div>

              {/* Progress Summary Cards */}
              {(() => {
                const totalCount = masterChecklist.length;
                const completedCount = masterChecklist.filter((i) => i.status === 'publicado').length;
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                const countFisicosDone = masterChecklist.filter((i) => i.category === 'fisico' && i.status === 'publicado').length;
                const countFisicosTotal = masterChecklist.filter((i) => i.category === 'fisico').length;
                const countClasificadosDone = masterChecklist.filter((i) => i.category === 'clasificado' && i.status === 'publicado').length;
                const countClasificadosTotal = masterChecklist.filter((i) => i.category === 'clasificado').length;
                const countForosDone = masterChecklist.filter((i) => i.category === 'foro' && i.status === 'publicado').length;
                const countForosTotal = masterChecklist.filter((i) => i.category === 'foro').length;

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-base font-extrabold shrink-0">
                          {pct}%
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">Progreso Total</div>
                          <div className="text-sm font-bold text-white">{completedCount} de {totalCount} hechos</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">Físicos (Hannover)</div>
                          <div className="text-sm font-bold text-amber-300">{countFisicosDone} de {countFisicosTotal} pegados</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">Clasificados (5 Países)</div>
                          <div className="text-sm font-bold text-sky-300">{countClasificadosDone} de {countClasificadosTotal} activos</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">Foros &amp; Reddit</div>
                          <div className="text-sm font-bold text-purple-300">{countForosDone} de {countForosTotal} publicados</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Cobertura de Canales de Difusión</span>
                        <span className="text-emerald-400 font-bold">{pct}% ({completedCount}/{totalCount})</span>
                      </div>
                      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Add Custom Place Accordion Form */}
              {showAddPlaceModal && (
                <form
                  onSubmit={handleAddNewPlace}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-sky-500/40 space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-400" />
                      <span>Añadir Nuevo Lugar de Posteo (Físico o Digital)</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Se guardará automáticamente en tu navegador</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-mono text-slate-400 mb-1">Nombre del Lugar / Portal / Grupo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Tablón Fachschaft Maschinenbau / r/learnmath"
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-slate-400 mb-1">Tipo de Canal</label>
                      <select
                        value={newPlace.category}
                        onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      >
                        <option value="fisico">🏫 Físico (Campus / Calle)</option>
                        <option value="clasificado">🌐 Portal de Clasificados</option>
                        <option value="foro">💬 Foro Web / Comunidad / Reddit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-slate-400 mb-1">Zona / Mercado</label>
                      <input
                        type="text"
                        placeholder="Ej. Campus Garbsen / Santiago / Chile"
                        value={newPlace.zone}
                        onChange={(e) => setNewPlace({ ...newPlace, zone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-mono text-slate-400 mb-1">URL Directa (opcional si es digital)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newPlace.url}
                        onChange={(e) => setNewPlace({ ...newPlace, url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-slate-400 mb-1">Notas / Consejos de Publicación</label>
                      <input
                        type="text"
                        placeholder="Ej. Pegar junto a la puerta principal / Hilo semanal los lunes"
                        value={newPlace.notes}
                        onChange={(e) => setNewPlace({ ...newPlace, notes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPlaceModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold cursor-pointer shadow-md"
                    >
                      Guardar y Añadir a la Lista
                    </button>
                  </div>
                </form>
              )}

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
                {[
                  { id: 'all', label: `🌟 Todos (${masterChecklist.length})` },
                  { id: 'fisico', label: `🏫 Físicos (${masterChecklist.filter((i) => i.category === 'fisico').length})` },
                  { id: 'clasificado', label: `🌐 Clasificados (${masterChecklist.filter((i) => i.category === 'clasificado').length})` },
                  { id: 'foro', label: `💬 Foros & Reddit (${masterChecklist.filter((i) => i.category === 'foro').length})` },
                  { id: 'pending', label: `⏳ Pendientes (${masterChecklist.filter((i) => i.status !== 'publicado').length})` },
                  { id: 'completed', label: `✓ Publicados (${masterChecklist.filter((i) => i.status === 'publicado').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setChecklistFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      checklistFilter === f.id
                        ? 'bg-sky-600/20 border-sky-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Master Checklist Items List */}
              <div className="space-y-3">
                {masterChecklist
                  .filter((item) => {
                    if (checklistFilter === 'fisico') return item.category === 'fisico';
                    if (checklistFilter === 'clasificado') return item.category === 'clasificado';
                    if (checklistFilter === 'foro') return item.category === 'foro';
                    if (checklistFilter === 'pending') return item.status !== 'publicado';
                    if (checklistFilter === 'completed') return item.status === 'publicado';
                    return true;
                  })
                  .map((item) => {
                    const days = getDaysSince(item.lastChecked);
                    const isDone = item.status === 'publicado';
                    const needsRenewal = isDone && days !== null && days >= 5;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isDone
                            ? 'bg-slate-950/80 border-slate-800/90'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Left: Checkbox + Info */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleMasterChecklistItem(item.id)}
                            className={`mt-0.5 w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900 border-slate-700 hover:border-sky-400 text-transparent'
                            }`}
                            title={isDone ? 'Marcar como pendiente' : 'Marcar como publicado / pegado'}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Category Badge */}
                              {item.category === 'fisico' && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>Físico Hannover</span>
                                </span>
                              )}
                              {item.category === 'clasificado' && (
                                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[10px] font-bold flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  <span>Clasificado</span>
                                </span>
                              )}
                              {item.category === 'foro' && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] font-bold flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Foro / Red</span>
                                </span>
                              )}

                              <span className="font-bold text-sm text-white truncate">
                                {item.name}
                              </span>

                              <span className="text-[11px] font-mono text-slate-400">
                                • {item.zone || item.country}
                              </span>
                            </div>

                            <div className="text-xs text-slate-400 leading-snug">
                              {item.notes}
                            </div>

                            {/* Quick Tag / Link */}
                            <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] font-mono">
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-1 hover:underline"
                                >
                                  <span>Abrir Portal / Foro</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {item.qrTag && (
                                <span className="text-slate-500">
                                  Tag QR: <code className="text-sky-400">{item.qrTag}</code>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Status Pill & Action Buttons */}
                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                          {/* Status Badge */}
                          <div className="font-mono text-xs">
                            {!isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                                ⏳ Pendiente
                              </span>
                            ) : needsRenewal ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Renovar ({days}d)</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{days === 0 ? 'Hecho hoy' : `Hace ${days}d`}</span>
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => markItemCheckedToday(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 border border-sky-500/40 text-sky-300 hover:text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Actualizar fecha a hoy"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span className="hidden sm:inline">Hoy</span>
                            </button>

                            {item.id.startsWith('custom-') && (
                              <button
                                type="button"
                                onClick={() => deleteMasterChecklistItem(item.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition-all cursor-pointer"
                                title="Eliminar este lugar personalizado"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {t('Plantillas de Avisos con Precios Escalonados (Base 1.00x EUR / $20.000 CLP)', 'Classified Ad Templates with Tiered Pricing (Base 1.00x EUR / $20,000 CLP)')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('Avisos listos para copiar y pegar en portales clasificados, foros y redes sociales con enlaces de trazabilidad y números de WhatsApp.', 'Ready-to-post classified templates with attribution links and direct WhatsApp action.')}
                  </p>
                </div>

                {/* Ad Language Filter Bar */}
                <div className="flex flex-wrap gap-1.5 font-mono text-xs p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto shadow-inner">
                  {[
                    { id: 'all', label: t('Todos', 'All'), count: AD_TEMPLATES.length },
                    { id: 'en', label: '🇬🇧 English', count: AD_TEMPLATES.filter((a) => a.lang === 'en').length },
                    { id: 'es', label: '🇪🇸 Español', count: AD_TEMPLATES.filter((a) => a.lang === 'es').length },
                    { id: 'de', label: '🇩🇪 Deutsch', count: AD_TEMPLATES.filter((a) => a.lang === 'de').length }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAdLangFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        adLangFilter === f.id
                          ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white font-bold shadow-md shadow-sky-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className="text-[10px] px-1 rounded-full bg-slate-800 text-slate-300">
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {AD_TEMPLATES.filter((ad) => adLangFilter === 'all' || ad.lang === adLangFilter).map((ad) => (
                  <div key={ad.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 block">
                            {ad.badge}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 uppercase font-semibold">
                            {ad.lang === 'en' ? '🇬🇧 English' : ad.lang === 'es' ? '🇪🇸 Español' : '🇩🇪 Deutsch'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{ad.title}</h4>
                        <span className="text-xs font-mono text-emerald-400">{ad.priceNote}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ad.title, `${ad.id}-title`)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700/80 transition-colors"
                        >
                          {copiedId === `${ad.id}-title` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{t('Copiar Título', 'Copy Title')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ad.body, `${ad.id}-body`)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-600/20 transition-all"
                        >
                          {copiedId === `${ad.id}-body` ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === `${ad.id}-body` ? t('¡Texto Copiado!', 'Copied to Clipboard!') : t('Copiar Anuncio Completo', 'Copy Full Ad')}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed max-h-96 overflow-y-auto selection:bg-sky-500/30">
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
                className="w-full max-w-[794px] bg-white text-slate-900 rounded-2xl border-2 border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:max-w-none print:w-full print:h-full print:min-h-0"
                style={{ minHeight: '1080px' }}
              >
                <div className="p-8 pb-6 print:p-0 flex-1 flex flex-col justify-between">
                  <div
                    className={`rounded-2xl p-6 mb-6 border-2 print:p-3.5 print:mb-2 ${
                      flyerInkSaving
                        ? 'bg-white border-slate-900 text-slate-900'
                        : 'bg-slate-900 border-slate-900 text-white'
                    }`}
                  >
                    <div className="font-mono text-xs uppercase tracking-widest font-bold mb-2 print:mb-1 text-sky-700">
                      {customFlyer.badge}
                    </div>
                    <h1 className="text-2xl sm:text-3xl print:text-2xl font-extrabold tracking-tight leading-tight mb-2 print:mb-1">
                      {customFlyer.headline}
                    </h1>
                    <p className={`text-sm font-mono font-semibold ${flyerInkSaving ? 'text-slate-700' : 'text-slate-300'}`}>
                      {customFlyer.subheadline}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 border-2 border-slate-900 text-xs font-mono font-bold text-slate-900 mb-6 print:mb-2 print:p-2 print:text-[11px] leading-relaxed">
                    {customFlyer.languageNotice}
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-center mb-6 print:gap-3.5 print:mb-2">
                    <div className="col-span-7 space-y-3 print:space-y-2">
                      <div className="font-mono text-xs uppercase tracking-wider font-extrabold text-slate-900 border-b-2 border-slate-900 pb-1">
                        SUBJECT TIERS &amp; INTERACTIVE STEM PLATFORM:
                      </div>
                      <ul className="space-y-2.5 print:space-y-1.5 text-xs text-slate-900 font-medium">
                        {customFlyer.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono font-extrabold text-slate-900">▸</span>
                            <span className="leading-snug">{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Dynamic Visual Badges based on Flyer Preset */}
                      {customFlyer.illustrationType === 'quantum_einstein' && (
                        <div className="pt-2 space-y-2">
                          <div className="p-3 rounded-xl border-2 border-slate-900 bg-amber-50 flex items-center gap-3">
                            <div className="w-14 h-14 shrink-0 bg-white border-2 border-slate-900 rounded-xl p-1 flex items-center justify-center">
                              <EinsteinCartoon />
                            </div>
                            <div className="text-[11px] font-mono leading-tight">
                              <div className="font-extrabold text-slate-900">
                                {customFlyer.einsteinQuote || '“God does not play dice with the universe... but we can simulate the odds!”'}
                              </div>
                              <div className="text-[10px] text-amber-950 font-bold mt-0.5">
                                — Albert Einstein (&amp; Daniel Santander)
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">HILBERT &amp; BLOCH</div>
                              <div className="text-[10px] text-slate-700">Superposition, spin &amp; qubits</div>
                            </div>
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">PYTHON SIMULATIONS</div>
                              <div className="text-[10px] text-slate-700">Wave packets &amp; tunneling</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {customFlyer.illustrationType === 'thesis_rocket' && (
                        <div className="pt-2 space-y-2">
                          <div className="p-3 rounded-xl border-2 border-slate-900 bg-emerald-50 flex items-center gap-3">
                            <div className="w-12 h-12 shrink-0 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-emerald-600">
                              <Rocket className="w-7 h-7" />
                            </div>
                            <div className="text-[11px] font-mono leading-tight">
                              <div className="font-extrabold text-slate-900">
                                “From broken scripts &amp; diverging simulations to a thesis defense with honors”
                              </div>
                              <div className="text-[10px] text-emerald-950 font-bold mt-0.5">
                                Methodological &amp; technical guidance • Geophysicist &amp; Double M.Sc.
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">NUMERICAL DEBUGGING</div>
                              <div className="text-[10px] text-slate-700">Python, SciPy, MATLAB &amp; Pandas</div>
                            </div>
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">PUBLICATION PLOTS</div>
                              <div className="text-[10px] text-slate-700">Vector figures in Matplotlib &amp; Seaborn</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {customFlyer.illustrationType === 'python_ai' && (
                        <div className="pt-2 space-y-2">
                          <div className="p-3 rounded-xl border-2 border-slate-900 bg-sky-50 flex items-center gap-3">
                            <div className="w-12 h-12 shrink-0 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-sky-600">
                              <Terminal className="w-7 h-7" />
                            </div>
                            <div className="text-[11px] font-mono leading-tight">
                              <div className="font-extrabold text-slate-900">
                                “Mathematical Prompting &amp; Simulation: Code with AI without losing control”
                              </div>
                              <div className="text-[10px] text-sky-950 font-bold mt-0.5">
                                Formulate physical models &amp; audit code like a professional
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">NUMPY &amp; SCIPY SOLVERS</div>
                              <div className="text-[10px] text-slate-700">Finite differences, oscillators &amp; fluids</div>
                            </div>
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">SCIENTIFIC PORTFOLIO</div>
                              <div className="text-[10px] text-slate-700">Interactive web simulators for your CV</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {customFlyer.illustrationType === 'math_ai' && (
                        <div className="pt-2 space-y-2">
                          <div className="p-3 rounded-xl border-2 border-slate-900 bg-purple-50 flex items-center gap-3">
                            <div className="w-12 h-12 shrink-0 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-purple-600">
                              <Brain className="w-7 h-7" />
                            </div>
                            <div className="text-[11px] font-mono leading-tight">
                              <div className="font-extrabold text-slate-900">
                                “The intuitive bridge between multivariable calculus &amp; neural networks”
                              </div>
                              <div className="text-[10px] text-purple-950 font-bold mt-0.5">
                                Gradient descent, backprop &amp; SVD with geometric clarity
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">GRADIENTS &amp; SVD</div>
                              <div className="text-[10px] text-slate-700">Jacobians, Hessians &amp; latent spaces</div>
                            </div>
                            <div className="p-2 rounded-lg border border-slate-900 bg-slate-50">
                              <div className="font-extrabold text-slate-900">DIRECT CODE</div>
                              <div className="text-[10px] text-slate-700">From theory to live Python execution</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {(!customFlyer.illustrationType || customFlyer.illustrationType === 'standard_physics') && (
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
                      )}
                    </div>

                    <div className="col-span-5 flex flex-col items-center justify-center p-4 print:p-2.5 rounded-2xl border-2 border-slate-900 bg-white text-center">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold text-slate-900 mb-2 print:mb-1">
                        SCAN TO TEST THE LAB FOR FREE
                      </span>
                      <img
                        src={flyerQrImageUrl}
                        alt="QR Code to STEM Platform"
                        className="w-40 h-40 print:w-28 print:h-28 object-contain border border-slate-300 rounded-lg p-1 mb-2 print:mb-1"
                      />
                      <span className="font-mono text-[11px] font-extrabold text-slate-900">
                        WhatsApp: +49 176 7649 7440
                      </span>
                      <span className="font-mono text-[9px] text-slate-600 break-all mt-0.5">
                        danisantanderurrutia-coder.github.io/classes
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border-2 border-slate-900 bg-slate-50 text-center font-mono text-xs font-extrabold text-slate-900 print:p-2 print:text-[11px]">
                    {customFlyer.footerCallout}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-900 bg-white px-4 pt-2 pb-4 print:px-0 print:pt-1 print:pb-0 shrink-0">
                  <div className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2 print:mb-1">
                    ✂️ Tear off a tab (WhatsApp &amp; Interactive STEM Lab QR) ✂️
                  </div>
                  <div
                    className="grid gap-0 border-2 border-slate-900"
                    style={{ gridTemplateColumns: `repeat(${flyerTabsCount}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: flyerTabsCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border-r last:border-r-0 border-dashed border-slate-900 p-1.5 flex flex-col items-center justify-between text-center print:p-1 print:min-h-0 print:h-[165px]"
                        style={{ minHeight: '210px' }}
                      >
                        <img
                          src={flyerQrImageUrl}
                          alt="QR"
                          className="w-11 h-11 print:w-8 print:h-8 object-contain mb-1 print:mb-0.5"
                        />
                        <div
                          className="font-mono text-[9px] print:text-[8px] leading-tight text-slate-900 font-bold py-1 print:py-0.5"
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          {customFlyer.tearOffTitle}
                          {' • '}
                          WA: +49 176 7649 7440
                        </div>
                        <span className="font-mono text-[8px] font-extrabold text-slate-700 mt-1">
                          ENGLISH
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA & FORUMS DISTRIBUTION KIT FOR CURRENT FLYER */}
            <div className="no-print bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    Distribución Digital &amp; Copy-Paste
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-sky-400" />
                    <span>Versión Social Media &amp; Foros Web para este Afiche</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Post listo para copiar y pegar en Reddit, WhatsApp o foros universitarios para la temática seleccionada arriba.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setFlyerSocialChannel('reddit')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        flyerSocialChannel === 'reddit'
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Reddit (Markdown)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlyerSocialChannel('whatsapp')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        flyerSocialChannel === 'whatsapp'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      WhatsApp / Discord
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlyerSocialChannel('facebook')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                        flyerSocialChannel === 'facebook'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Facebook / Foros
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentSocialPostText, 'flyer-social')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    {copiedId === 'flyer-social' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'flyer-social' ? '¡Texto Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
              </div>

              {/* Target Channel Advice Pill */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="text-slate-300">
                  <span className="text-emerald-400 font-bold">🎯 Foros sugeridos para este afiche: </span>
                  <span className="text-white font-semibold">
                    {customFlyer?.targetForums || 'r/chile, r/EngineeringStudents, Grupos Facebook, Schwarzes Brett'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  💡 Tip: En Reddit aporta primero el simulador web gratis; en WhatsApp ve directo al grano.
                </div>
              </div>

              {/* Text Area */}
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {currentSocialPostText}
              </pre>
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
                    onClick={() => setAdminInstaLang('es')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      adminInstaLang === 'es'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇪🇸 Versión en Español
                  </button>
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
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: 2160px Image Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square shadow-2xl">
                    <img
                      key={adminInstaLang}
                      src={adminInstaLang === 'es' ? './instagram_post_es.jpg?v=spacetime' : './instagram_post_en.jpg?v=spacetime'}
                      alt={`Instagram Post Preview (${adminInstaLang.toUpperCase()})`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg?v=spacetime' : './instagram_post_en.jpg?v=spacetime'}
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
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg?v=spacetime' : './instagram_post_en.jpg?v=spacetime'}
                        download={adminInstaLang === 'es' ? 'Daniel_S_Santander_Urrutia_Instagram_Post_ES_2160x2160.jpg' : 'Daniel_S_Santander_Urrutia_Instagram_Post_EN_2160x2160.jpg'}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-mono text-xs font-bold transition-all shadow-md shadow-pink-500/20"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Imagen ({adminInstaLang.toUpperCase()} 2160px)</span>
                      </a>
                      <a
                        href={adminInstaLang === 'es' ? './instagram_post_es.jpg?v=spacetime' : './instagram_post_en.jpg?v=spacetime'}
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
                  {/* Caption Mode Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAdminInstaCaptionMode('referral')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          adminInstaCaptionMode === 'referral'
                            ? 'bg-rose-500 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🤝 Red de Contactos / Búsqueda Laboral
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminInstaCaptionMode('pitch')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          adminInstaCaptionMode === 'pitch'
                            ? 'bg-pink-500 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🎯 Pitch Académico Formal
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const captionReferralEn = `Hi everyone! 👋

I’m offering private university tutoring (Physics, Calculus, Linear Algebra) and B.Sc. / M.Sc. thesis guidance while I look for a job :) If you know anyone who might need this, let me know!

🔬 Focused on deep physical intuition, rigorous derivations, and 14 interactive 3D physics simulators.
📍 Available 1-on-1 online worldwide & in-person in Hannover.

👉 Free 20-min diagnostic & interactive simulators:
🔗 danisantanderurrutia-coder.github.io/classes

#UniversityPhysics #Calculus #PhysicsTutor #ThesisGuidance #STEMEducation #Hannover #MathTutor`;

                        const captionReferralEs = `¡Hola a todos! 👋

Estoy abriendo cupos para clases particulares universitarias (Física, Cálculo, Álgebra Lineal) y asesoría en tesis de pregrado/máster mientras busco trabajo :) Si saben de alguien a quien le pueda servir, ¡se agradece mucho si le avisan o comparten el dato!

🔬 Enfoque en intuición física profunda, demostraciones formales y 14 simuladores 3D interactivos.
📍 Clases 1 a 1 online para todo el mundo y presenciales en Hannover.

👉 Detalles y sesión diagnóstica gratuita:
🔗 danisantanderurrutia-coder.github.io/classes

#FisicaUniversitaria #Calculo #AlgebraLineal #ClasesParticulares #AsesoriaTesis #Ingenieria #UniversidadDeChile #Hannover #TutorSTEM`;

                        const captionPitchEn = `🚀 Master University Physics & Calculus with Mathematical Rigor & Physical Intuition!

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

                        const captionPitchEs = `🚀 ¡Domina la Física y el Cálculo Universitario con Rigor Matemático e Intuición Física!

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

                        const textToCopy = adminInstaCaptionMode === 'referral'
                          ? (adminInstaLang === 'en' ? captionReferralEn : captionReferralEs)
                          : (adminInstaLang === 'en' ? captionPitchEn : captionPitchEs);

                        handleCopyMarketing(`caption_${adminInstaCaptionMode}_${adminInstaLang}`, textToCopy);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedMarketingKey === `caption_${adminInstaCaptionMode}_${adminInstaLang}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMarketingKey === `caption_${adminInstaCaptionMode}_${adminInstaLang}` ? '¡Copiado!' : 'Copiar Texto'}</span>
                    </button>
                  </div>

                  {/* Caption Text Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto">
                    {adminInstaCaptionMode === 'referral' ? (
                      adminInstaLang === 'en' ? (
                        `Hi everyone! 👋

I’m offering private university tutoring (Physics, Calculus, Linear Algebra) and B.Sc. / M.Sc. thesis guidance while I look for a job :) If you know anyone who might need this, let me know!

🔬 Focused on deep physical intuition, rigorous derivations, and 14 interactive 3D physics simulators.
📍 Available 1-on-1 online worldwide & in-person in Hannover.

👉 Free 20-min diagnostic & interactive simulators:
🔗 danisantanderurrutia-coder.github.io/classes

#UniversityPhysics #Calculus #PhysicsTutor #ThesisGuidance #STEMEducation #Hannover #MathTutor`
                      ) : (
                        `¡Hola a todos! 👋

Estoy abriendo cupos para clases particulares universitarias (Física, Cálculo, Álgebra Lineal) y asesoría en tesis de pregrado/máster mientras busco trabajo :) Si saben de alguien a quien le pueda servir, ¡se agradece mucho si le avisan o comparten el dato!

🔬 Enfoque en intuición física profunda, demostraciones formales y 14 simuladores 3D interactivos.
📍 Clases 1 a 1 online para todo el mundo y presenciales en Hannover.

👉 Detalles y sesión diagnóstica gratuita:
🔗 danisantanderurrutia-coder.github.io/classes

#FisicaUniversitaria #Calculo #AlgebraLineal #ClasesParticulares #AsesoriaTesis #Ingenieria #UniversidadDeChile #Hannover #TutorSTEM`
                      )
                    ) : (
                      adminInstaLang === 'en' ? (
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
                      )
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
    </div>
  );
}
