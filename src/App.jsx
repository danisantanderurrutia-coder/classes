import React, { useState, useEffect, Suspense, lazy } from 'react';
import confetti from 'canvas-confetti';
import {
  Atom,
  Orbit,
  Terminal,
  Calculator,
  Award,
  BookOpen,
  FileCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  Globe,
  Clock,
  Compass,
  Layers,
  ShieldCheck,
  Check,
  X,
  FileText,
  Send,
  Laptop,
  Binary,
  GraduationCap,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Library,
  BookMarked,
  Zap,
  MessageSquare,
  HelpCircle,
  BookmarkCheck,
  Phone,
  Mail,
  Share2,
  Copy,
  Heart,
  Repeat,
  Gamepad2,
  Music,
  Handshake
} from 'lucide-react';
import { PLANET_SUBJECTS } from './data/planetSubjects';
const SolarSystem = lazy(() => import('./components/SolarSystem'));
import { LAB_PROBLEMS } from './data/labProblems';
const PhysicsLab = lazy(() => import('./components/PhysicsLab'));
import { ProblemThumbnail } from './components/LabThumbnails';
const PIADMethod = lazy(() => import('./components/PIADMethod'));
const PhysicsToolkit = lazy(() => import('./components/PhysicsToolkit'));
const TutorPage = lazy(() => import('./components/TutorPage').then((m) => ({ default: m.TutorPage })));
const PhiFighterGame = lazy(() => import('./components/PhiFighterGame'));
import {
  CURRENCY_TIERS,
  SUBJECT_COMPLEXITY_TIERS,
  getCurrencyTiers,
  detectInitialCurrency,
  mapCountryToCurrency,
  formatMoney,
  getCourseHourlyRate,
  getCoursePackRate,
  getGroupPricing
} from './pricingConfig';
import { isAdminPin } from './adminGate';

// Custom crisp GitHub SVG icon component
const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const Github = GithubIcon;

// Safe asset URL resolver for GitHub Pages, custom domains, and standalone HTML
export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const clean = url.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
};

// Safe React Error Boundary to prevent white screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mb-4">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2">
            Algo no cargó correctamente / Something went wrong
          </h2>
          <p className="text-slate-400 text-sm max-w-md mb-6 font-sans">
            {this.state.error?.message || 'Ocurrió un error inesperado al renderizar esta sección.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.hash = '#/';
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Volver al Inicio / Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { COURSE_FILTER_TABS, ACADEMIC_COURSES, FOUNDATIONAL_BOOKS, WHY_ME_REASONS, COURSE_LAB_MAPPING } from './data/courseCatalog';

const HISPANIC_COUNTRIES = new Set([
  'ES', // Spain
  'MX', // Mexico
  'CO', // Colombia
  'AR', // Argentina
  'PE', // Peru
  'VE', // Venezuela
  'CL', // Chile
  'EC', // Ecuador
  'GT', // Guatemala
  'CU', // Cuba
  'BO', // Bolivia
  'DO', // Dominican Republic
  'HN', // Honduras
  'PY', // Paraguay
  'SV', // El Salvador
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panama
  'UY', // Uruguay
  'PR', // Puerto Rico
  'GQ'  // Equatorial Guinea
]);

// Hispanic timezones for instantaneous 0ms client-side detection before GeoIP resolves
const HISPANIC_TIMEZONES = new Set([
  'America/Santiago',
  'America/Punta_Arenas',
  'Pacific/Easter',
  'Europe/Madrid',
  'Atlantic/Canary',
  'Africa/Ceuta',
  'America/Buenos_Aires',
  'America/Bogota',
  'America/Lima',
  'America/Caracas',
  'America/Mexico_City',
  'America/Cancun',
  'America/Merida',
  'America/Monterrey',
  'America/Mazatlan',
  'America/Chihuahua',
  'America/Hermosillo',
  'America/Tijuana',
  'America/Bahia_Banderas',
  'America/Guayaquil',
  'Pacific/Galapagos',
  'America/Guatemala',
  'America/Havana',
  'America/La_Paz',
  'America/Santo_Domingo',
  'America/Tegucigalpa',
  'America/Asuncion',
  'America/El_Salvador',
  'America/Managua',
  'America/Costa_Rica',
  'America/Panama',
  'America/Montevideo',
  'America/Puerto_Rico',
  'Africa/Malabo'
]);

function detectInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('preferred_lang');
    if (saved === 'en' || saved === 'es') return saved;

    // Instantaneous timezone check
    const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    if (tz && (HISPANIC_TIMEZONES.has(tz) || tz.startsWith('America/Argentina/'))) {
      return 'es';
    }

    // Default to English for all non-Hispanic locations (Germany, USA, UK, etc.)
    return 'en';
  } catch {
    return 'en';
  }
}

export default function App() {
  const [lang, setLangState] = useState(() => detectInitialLanguage());
  const [currency, setCurrencyState] = useState(() => detectInitialCurrency());
  const [detectedCountry, setDetectedCountry] = useState('');

  // Keep <html lang>, document title and meta description in sync with the selected language
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'es';
    document.title = lang === 'en'
      ? 'Math & Physics Classes | Daniel S. Santander Urrutia'
      : 'Clases de Matemáticas y Física | Daniel S. Santander Urrutia';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute('content', lang === 'en'
        ? 'University & IB Exam Mentorship in Higher Mathematics, Classical Mechanics, Calculus, Linear Algebra & PDEs. Double European M.Sc. & Geophysicist (Hannover & Online).'
        : 'Mentoría universitaria y de exámenes IB en Matemáticas Superiores, Mecánica Clásica, Cálculo, Álgebra Lineal y EDP. Doble M.Sc. europeo y Geofísico (Hannover y online).');
    }
  }, [lang]);

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('preferred_lang', newLang);
    } catch {}
  };

  const setCurrency = (newCurr) => {
    if (!CURRENCY_TIERS[newCurr]) return;
    setCurrencyState(newCurr);
    try {
      localStorage.setItem('preferred_currency', newCurr);
    } catch {}
  };

  // GeoIP detection on mount: fetches country via lightweight API if no user override exists
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('preferred_lang');
      const savedCurr = localStorage.getItem('preferred_currency');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      fetch('https://api.country.is/', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          if (data && data.country) {
            const cc = String(data.country).toUpperCase();
            setDetectedCountry(cc);
            if (!savedLang) {
              const isHispanic = HISPANIC_COUNTRIES.has(cc);
              setLangState(isHispanic ? 'es' : 'en');
            }
            if (!savedCurr) {
              setCurrencyState(mapCountryToCurrency(cc));
            }
          }
        })
        .catch(() => {
          // Keep the initial timezone detection result
        });
    } catch {}
  }, []);

  // Multi-page navigation state: 'landing' | 'lab' | 'courses' | 'tutor' | 'piad' | 'library' | 'pricing' | 'contact' | 'game'
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeLabProblemId, setActiveLabProblemId] = useState('newtonian');
  const [selectedSubjectId, setSelectedSubjectId] = useState('klausur');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  // Discreet Admin Gate Modal State
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  const handleOpenAdminGate = () => {
    try {
      if (sessionStorage.getItem('ds_admin_unlocked') === 'true') {
        window.location.hash = '#/admin';
        return;
      }
    } catch {}
    setAdminPinInput('');
    setAdminPinError(false);
    setIsAdminAuthOpen(true);
  };

  const handleAdminPinSubmit = (e) => {
    e.preventDefault();
    if (isAdminPin(adminPinInput)) {
      try {
        sessionStorage.setItem('ds_admin_unlocked', 'true');
      } catch {}
      setIsAdminAuthOpen(false);
      setAdminPinInput('');
      setAdminPinError(false);
      window.location.hash = '#/admin';
    } else {
      setAdminPinError(true);
      setAdminPinInput('');
    }
  };
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    courseCode: '',
    targetDate: '',
    languagePref: 'English',
    deliveryMode: 'Online 1-on-1',
    sessionType: 'Regular Sprint', // 'Regular Sprint' | 'Spontaneous Session'
    notes: ''
  });

  // Rate Calculator State (defaults to Tier 1: Calculus, Physics I & IB, 1 hour)
  const [calcLevel, setCalcLevel] = useState('ib');
  const [calcHours, setCalcHours] = useState(1);
  const [calcStudents, setCalcStudents] = useState(1); // 1 (Solo), 2 (+1 colega), 3 (+2 colegas), 4 (+3 colegas)
  const [calcMode, setCalcMode] = useState('online'); // 'online' | 'inperson'
  const [calcSprintDiscount, setCalcSprintDiscount] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  // Library View State: 'books' (Classical Treatises) | 'laws' (Compendium of Laws & PDEs)
  const [libraryTab, setLibraryTab] = useState('books');
  const [bookCategory, setBookCategory] = useState('all');
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  const liveTiers = getCurrencyTiers();
  const activeTier = liveTiers[currency] || liveTiers.EUR;
  const baseRates = activeTier.rates;
  const baseRate = baseRates[calcLevel] || baseRates.ib;
  const inPersonExtraPerHour = activeTier.inPersonSurchargePerHour || Math.round(baseRate * 0.25);
  const hourlyRateWithMode = baseRate + (calcMode === 'inperson' ? inPersonExtraPerHour : 0);
  const sprintMultiplier = calcSprintDiscount ? 0.85 : 1.0;
  const singleEffectiveHourly = Math.round(hourlyRateWithMode * sprintMultiplier);
  const groupPricing = getGroupPricing(singleEffectiveHourly, calcStudents, currency);
  const effectiveRate = groupPricing.perStudentHourly;
  const totalCost = Math.round(effectiveRate * calcHours);
  const totalGroupCost = Math.round(groupPricing.totalGroupHourly * calcHours);

  // Synchronize hash in URL with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'faq') {
        setCurrentPage('contact');
        setTimeout(() => {
          document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (['tutor', 'mentor'].includes(hash)) {
        setCurrentPage('tutor');
      } else if (['pricing', 'calculator', 'precios'].includes(hash)) {
        // 'precios' kept as legacy alias for old shared links; normalize URL to English
        setCurrentPage('pricing');
        if (hash === 'precios') window.location.replace('#/pricing');
      } else if (['landing', 'lab', 'courses', 'tutor', 'piad', 'library', 'contact', 'game'].includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('landing');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page, sectionId) => {
    if (page === 'tutor' || page === 'mentor') {
      setCurrentPage('tutor');
      window.location.hash = '#/tutor';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'faq') {
      setCurrentPage('contact');
      window.location.hash = '#/contact';
      setTimeout(() => {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    if (page === 'calculator' || page === 'pricing') {
      setCurrentPage('pricing');
      window.location.hash = '#/pricing';
      if (sectionId === 'mentor-dossier') {
        setTimeout(() => {
          document.getElementById('mentor-dossier')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openLabProblem = (problemId = 'newtonian') => {
    setActiveLabProblemId(problemId);
    navigateTo('lab');
  };

  // Keyboard Escape listener for Modal + Ctrl/Cmd+Shift+A shortcut for Admin Hub
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isAdminAuthOpen) setIsAdminAuthOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdminGate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isAdminAuthOpen]);

  const handleOpenBooking = (course = null, isSpontaneous = false) => {
    setModalCourse(course);
    setBookingData(prev => ({
      ...prev,
      courseCode: course ? `${course.code} - ${course.titleEn}` : '',
      sessionType: isSpontaneous ? 'Spontaneous Session (On-Demand)' : 'Regular Sprint'
    }));
    setModalSubmitted(false);
    setIsModalOpen(true);
  };

  // Form Submit Handler with automatic email trigger to danisantander.urrutia@gmail.com
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `[Open Knowledge & Science Mentorship] ${bookingData.courseCode || 'Diagnostic Call'} - ${bookingData.name}`
    );
    const bodyText = 
`Hi Daniel,

I am requesting an Open Knowledge & Science Mentorship session.

--- STUDENT DETAILS ---
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone / WhatsApp: ${bookingData.phone || 'Not provided'}
University / School: ${bookingData.university}
Selected Course / Module: ${bookingData.courseCode || 'Diagnostic / General Mentorship'}
Type of Session: ${bookingData.sessionType}
Delivery Mode: ${bookingData.deliveryMode}${bookingData.deliveryMode.includes('Hannover') ? ' (Note: In-person session includes travel extra)' : ''}
Preferred Currency: ${currency}${detectedCountry ? ` (Country: ${detectedCountry})` : ''}
Language Preference: ${bookingData.languagePref}
Target Exam Date / Deadline: ${bookingData.targetDate || 'Not specified'}

--- QUESTIONS / BOTTLENECKS ---
${bookingData.notes || 'None provided'}

Sent from Open Knowledge & Science Mentorship Portal`;

    const mailto = `mailto:danisantander.urrutia@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setLastMailtoUrl(mailto);
    setModalSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#059669', '#0F172A', '#D97706']
      });
    } catch (err) {}

    // Automatically trigger mail draft in user's default client
    window.location.href = mailto;
  };

  const handleSelectPlanetSubject = (planetData) => {
    if (planetData && planetData.courseId) {
      setSelectedSubjectId(planetData.courseId);
    }
  };

  const filteredCourses = courseFilter === 'all' 
    ? ACADEMIC_COURSES 
    : ACADEMIC_COURSES.filter(c => c.category === courseFilter);

  const filteredBooks = FOUNDATIONAL_BOOKS.filter((b) => {
    const matchesCat = bookCategory === 'all' || b.category === bookCategory;
    const query = bookSearchQuery.toLowerCase().trim();
    if (!query) return matchesCat;
    const matchesQuery = 
      b.title.toLowerCase().includes(query) ||
      b.authors.toLowerCase().includes(query) ||
      (b.subjectEn && b.subjectEn.toLowerCase().includes(query)) ||
      (b.subjectEs && b.subjectEs.toLowerCase().includes(query)) ||
      (b.descriptionEn && b.descriptionEn.toLowerCase().includes(query)) ||
      (b.descriptionEs && b.descriptionEs.toLowerCase().includes(query)) ||
      b.usedIn.some((m) => m.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Subtle graph paper grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-60" />

      {/* ========================================================= */}
      {/* FLOATING CAPSULE HEADER (DYNAMIC ISLAND / RAYCAST STYLE)  */}
      {/* ========================================================= */}
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-2 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto min-h-[4.25rem] py-2 px-3 sm:px-6 rounded-2xl sm:rounded-full bg-black/90 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/90 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto ring-1 ring-white/10">
          
          {/* Identity Badge */}
          <button 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-mono text-sm font-bold group-hover:bg-white/20 transition-all shrink-0">
              Φ
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white group-hover:text-slate-200 transition-colors whitespace-nowrap leading-none mb-0.5">
                MATH &amp; PHYSICS CLASSES
              </span>
              <span className="text-[11px] font-semibold text-slate-200 tracking-tight whitespace-nowrap leading-none mb-0.5">
                Daniel S. Santander Urrutia
              </span>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider whitespace-nowrap leading-none">
                {lang === 'en' ? 'Double M.Sc. & Geophysicist' : 'Doble M.Sc. y Geofísico'}
              </span>
            </div>
          </button>

          {/* Pill Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs font-mono font-medium">
            <button
              onClick={() => navigateTo('lab')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'lab'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Atom className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Lab' : 'Lab DCL'}</span>
            </button>

            <button
              onClick={() => navigateTo('courses')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'courses'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Courses' : 'Cursos'}</span>
            </button>

            <button
              onClick={() => navigateTo('tutor')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'tutor'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{lang === 'en' ? 'Tutor' : 'Tutor'}</span>
            </button>

            <button
              onClick={() => navigateTo('piad')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'piad'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>PIAD™</span>
            </button>

            <button
              onClick={() => navigateTo('library')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'library'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Library className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Library' : 'Librería'}</span>
            </button>

            <button
              onClick={() => navigateTo('pricing')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'pricing'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Pricing' : 'Precios'}</span>
            </button>

            <button
              onClick={() => navigateTo('game')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'game'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30'
                  : 'text-amber-300 hover:text-white hover:bg-amber-400/15 border border-amber-400/30'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{lang === 'en' ? 'Game' : 'Game'}</span>
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'contact'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Contact' : 'Contacto'}</span>
            </button>
          </nav>

          {/* Language & Rounded CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 text-xs font-mono shrink-0">
              <button
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                aria-label="English"
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                aria-pressed={lang === 'es'}
                aria-label="Español"
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'es' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>

            <button
              onClick={() => handleOpenBooking()}
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>{lang === 'en' ? 'Book' : 'Reservar'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Floating Bottom Dock */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 px-3 py-2 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/90 flex items-center justify-around text-[10px] font-mono text-slate-400 ring-1 ring-white/10">
        <button
          onClick={() => navigateTo('landing')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'landing' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <span className="text-sm font-bold">Φ</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => navigateTo('lab')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'lab' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>Lab</span>
        </button>
        <button
          onClick={() => navigateTo('courses')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'courses' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Courses' : 'Cursos'}</span>
        </button>
        <button
          onClick={() => navigateTo('tutor')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'tutor' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Tutor</span>
        </button>
        <button
          onClick={() => navigateTo('piad')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'piad' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>PIAD™</span>
        </button>
        <button
          onClick={() => navigateTo('pricing')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'pricing' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Pricing' : 'Precios'}</span>
        </button>
        <button
          onClick={() => navigateTo('game')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'game' ? 'text-amber-400 font-bold' : 'text-amber-300/80 hover:text-white'}`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Game</span>
        </button>
        <button
          onClick={() => navigateTo('contact')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'contact' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Contact' : 'Contacto'}</span>
        </button>
      </nav>

      <main className="relative z-10">
        <ErrorBoundary key={currentPage}>
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-mono text-sm text-slate-500">{lang === 'en' ? 'Loading…' : 'Cargando…'}</div>}>

        {/* ========================================================= */}
        {/* PAGE 1: ATTRACTIVE LANDING WITH PLANETARY OBSERVATORY     */}
        {/* ========================================================= */}
        {currentPage === 'landing' && (
          <div>
            {/* Landing Hero: Deep Obsidian Observatory Canvas Seamlessly Flowing into 3D Planetarium */}
            <section className="pt-24 sm:pt-28 pb-0 bg-black text-white relative overflow-hidden">
              {/* Deep Space Universe Photographic Backdrop */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen pointer-events-none"
                style={{ backgroundImage: `url('${getAssetUrl('/images/hero-universe.webp')}')` }}
              />
              {/* Top & Bottom Vignette / Seamless Dark Fade to protect UI contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
              {/* Atmospheric Celestial Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.15),rgba(0,0,0,0))] pointer-events-none" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 font-mono text-xs mb-5 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {lang === 'en'
                        ? 'OPEN KNOWLEDGE & SCIENCE MENTORSHIP • DANIEL S. SANTANDER URRUTIA • DOUBLE M.SC. & GEOPHYSICIST'
                        : 'OPEN KNOWLEDGE & SCIENCE MENTORSHIP • DANIEL S. SANTANDER URRUTIA • DOBLE M.SC. Y GEOFÍSICO'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5">
                    {lang === 'en'
                      ? 'From sensory intuition to exact science: master higher physics & math'
                      : 'De la intuición sensible a la ciencia exacta: domina la física y el cálculo'}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 font-normal max-w-3xl mx-auto mb-3 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Learn to see physical phenomena through direct observation before formulas, designing scientific code and sovereign criteria under the PIAD Method™ (Open & Digital Inquiry).'
                      : 'Aprende a ver los fenómenos mediante la observación directa antes de las fórmulas, diseñando código propio y criterio autónomo bajo el Método PIAD™ (Indagación Abierta y Digital).'}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Significantly improve your grades through 1-on-1 or group mentoring with a Double Master in Science & Geophysicist, tailored for university students and IB candidates.'
                      : 'Mejora considerablemente tus calificaciones mediante clases individuales o grupales con un Doble Máster en Ciencias y Geofísico, para estudiantes universitarios y de Bachillerato Internacional (IB).'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => openLabProblem('newtonian')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-sky-400/20 cursor-pointer"
                    >
                      <Atom className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Interactive Physics Lab (DCL) →' : 'Laboratorio Interactivo (DCL) →'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('courses')}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open Course Catalog →' : 'Abrir Catálogo de Clases →'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('piad')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lang === 'en' ? 'PIAD Method™ →' : 'Método PIAD™ →'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenBooking(null, true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Spontaneous 1-on-1 Class' : 'Clase Espontánea Urgente'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Direct Contact & WhatsApp' : 'Contacto Directo & WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Planetary Observatory Viewport: Restrained Margins for Seamless Downscroll */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                {/* Section Header connecting the Observatory to the Academic Courses */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 font-mono text-[11px] uppercase tracking-[0.25em] mb-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'en' ? 'Observatory of the Cosmos' : 'Observatorio del Cosmos'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {lang === 'en'
                      ? 'Interactive Mentorship Courses by Celestial Body'
                      : 'Explorador Interactivo de Cursos y Mentorías por Astro'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-1.5 font-sans leading-relaxed">
                    {lang === 'en'
                      ? 'Each celestial body represents a core university & IB discipline (Higher Calculus, Classical Mechanics, Electromagnetism, Quantum Physics & Relativity). Click any planet to inspect syllabus, exam exercises, and booking.'
                      : 'Cada astro representa una disciplina universitaria e IB (Cálculo Superior, Mecánica Clásica, Electromagnetismo, Cuántica y Relatividad). Haz clic en un planeta para explorar temarios, ejercicios de examen y reservas.'}
                  </p>
                </div>

                <div id="planetarium-viewport" className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_90px_rgba(56,189,248,0.07)]">
                  <ErrorBoundary key="solar-system-boundary">
                    <Suspense fallback={<div className="h-[560px] sm:h-[620px] flex items-center justify-center bg-black text-slate-400 font-mono text-xs">{lang === 'en' ? 'Initializing 3D Observatory…' : 'Iniciando Observatorio 3D…'}</div>}>
                      <SolarSystem
                        onSelectSubject={handleSelectPlanetSubject}
                        selectedSubjectId={selectedSubjectId}
                        lang={lang}
                        onNavigate={navigateTo}
                        onOpenBooking={handleOpenBooking}
                        courses={ACADEMIC_COURSES}
                      />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            </section>

            {/* Interactive Classical Physics Lab Preview Section on Landing */}
            <section className="py-16 bg-white text-slate-900 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {lang === 'en'
                          ? 'Interactive Sandbox • Free Body Diagrams (FBD) • Calculus Bridge'
                          : 'Laboratorio Tipo Juego • Botón de DCL • Puente Álgebra ↔ Cálculo'}
                      </span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      {lang === 'en'
                        ? 'Explore the Classical Physics & Engineering Problems'
                        : 'Explora los Problemas Clásicos de la Física y la Ingeniería'}
                    </h2>
                    <p className="text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed">
                      {lang === 'en'
                        ? 'Test each phenomenon experimentally: toggle Free Body Diagrams (DCL), see how linear algebra and trigonometry turn into differential equations, and solve a classic exam exercise.'
                        : 'Experimenta cada caso clásico como un mini-laboratorio: activa los Diagramas de Cuerpo Libre (DCL), conecta las ecuaciones de álgebra y cálculo, y resuelve un ejercicio real de examen.'}
                    </p>
                  </div>

                  <button
                    onClick={() => openLabProblem('newtonian')}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-mono text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-sky-600/20"
                  >
                    <Atom className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Launch Full Physics Lab (14 Problems) →' : 'Abrir Laboratorio Completo (14 Problemas) →'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {LAB_PROBLEMS.slice(0, 3).map((prob) => {
                    const Icon = prob.icon;
                    return (
                      <div
                        key={prob.id}
                        onClick={() => openLabProblem(prob.id)}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-500/70 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
                      >
                        <div>
                          {/* Top Badges & Icon */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-sky-800 font-bold border border-slate-200">
                              {lang === 'en' ? prob.badgeEn : prob.badgeEs}
                            </span>
                            <span className="w-8 h-8 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors border border-slate-200">
                              <Icon className="w-4 h-4" />
                            </span>
                          </div>

                          {/* Exercise Vector Diagram Thumbnail */}
                          <div className="mb-4 rounded-xl overflow-hidden shadow-inner border border-slate-200 group-hover:border-sky-400 transition-colors">
                            <ProblemThumbnail problemId={prob.id} lang={lang} />
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-1.5 leading-snug">
                            {lang === 'en' ? prob.titleEn : prob.titleEs}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {lang === 'en' ? prob.subtitleEn : prob.subtitleEs}
                          </p>

                          {/* Exercise prompt teaser snippet */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 mb-4 line-clamp-2">
                            <span className="text-emerald-700 font-bold mr-1">
                              {lang === 'en' ? 'Target:' : 'Objetivo:'}
                            </span>
                            <span>
                              {lang === 'en'
                                ? (prob.exercise?.questionEn || prob.klausurProblem?.titleEn || prob.titleEn)
                                : (prob.exercise?.questionEs || prob.klausurProblem?.titleEs || prob.titleEs)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-sky-700 font-bold">
                          <span>{lang === 'en' ? 'Open Interactive Lab & DCL →' : 'Abrir Simulador y DCL →'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 1. Courses & Classes Offered (Placed First Before 'Why Take Classes') */}
            <section id="courses-preview" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                      {lang === 'en' ? 'Classes & Modules Offered' : 'Clases que Ofrezco'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {lang === 'en' ? 'High-Demand University Exam Preparation Tracks' : 'Materias Críticas y Cursos Universitarios'}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('courses')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'View all 12 course tracks →' : 'Ver las 12 materias →'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ACADEMIC_COURSES.slice(0, 3).map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-lg transition-all group">
                      <div className="h-44 overflow-hidden relative bg-slate-950">
                        {/* AI Simulation / Vector Overlay (Back Layer) */}
                        {course.simulationImage && (
                          <img 
                            src={getAssetUrl(course.simulationImage)} 
                            alt={`${course.titleEn} Simulation`} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                            loading="lazy"
                          />
                        )}
                        {/* Real Academic Photo (Front Layer, Crossfade on Hover) */}
                        <img 
                          src={course.image} 
                          alt={course.titleEn} 
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                            course.simulationImage ? 'group-hover:opacity-0 group-hover:scale-105' : ''
                          }`} 
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs border border-white/10 shadow-sm">
                            {course.code}
                          </span>
                        </div>
                        {/* Interactive Mode Badge on Hover */}
                        {course.simulationImage && (
                          <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/90 text-sky-300 border border-sky-400/30 backdrop-blur-sm flex items-center gap-1 shadow-md">
                              <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                              <span>{lang === 'en' ? 'Simulation Model' : 'Modelo Simulado'}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold">
                              {lang === 'en' ? course.badgeEn : course.badgeEs}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                            {lang === 'en' ? course.titleEn : course.titleEs}
                          </h3>
                          <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                            {lang === 'en' ? course.targetEn : course.targetEs}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-slate-900">
                            {formatMoney(getCourseHourlyRate(course, currency), currency)}
                            <span className="text-xs font-normal text-slate-500">/hr</span>
                          </span>
                          <button
                            onClick={() => handleOpenBooking(course)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer"
                          >
                            {lang === 'en' ? 'Enroll' : 'Inscribirse'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barter & Solidarity Callout Banner on Landing */}
                <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 border-2 border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                  <div className="space-y-2 text-center md:text-left max-w-2xl">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono font-bold text-slate-800">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] flex items-center gap-1">
                        <Repeat className="w-3 h-3 text-amber-700" />
                        <span>{lang === 'en' ? 'Barter' : 'Trueque'}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] flex items-center gap-1">
                        <Heart className="w-3 h-3 text-emerald-700" />
                        <span>{lang === 'en' ? 'Financial Solidarity' : 'Apoyo Solidario'}</span>
                      </span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-700">{lang === 'en' ? 'Education must be accessible to everyone' : 'Que nadie se quede sin aprender'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {lang === 'en'
                        ? '“Want to pay with an exchange? Need classes but short on funds?”'
                        : '“¿Quieres pagar a través del intercambio? ¿Necesitas clases pero no tienes el dinero?”'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                      {lang === 'en'
                        ? 'I gladly accept music, video games, psychology sessions or creative crafts! And if you are in a tough spot financially, tell me your situation: we can definitely work on it together.'
                        : 'Acepto música, videojuegos, sesiones de psicología u otros talentos, ¡ponte en contacto! Y si estás en un momento económico difícil, escríbeme y cuéntame tu caso: ¡totalmente podemos encontrar una solución!'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('pricing')}
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 shadow-sm flex items-center gap-2"
                  >
                    <span>{lang === 'en' ? 'View Barter & Solidarity Options →' : 'Ver Opciones de Trueque y Apoyo →'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Pitch: Why take classes with me (Updated with PIAD™, 14-Problem Lab, 5-Pillar Toolkit & Epistemic Rigor) */}
            <section id="why-me" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold mb-2">
                    <Compass className="w-3.5 h-3.5 text-sky-600" />
                    <span>
                      {lang === 'en'
                        ? 'Open Knowledge & Science Mentorship • The Pitch'
                        : 'Open Knowledge & Science Mentorship • Propuesta de Valor'}
                    </span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {lang === 'en'
                      ? 'Why study with Daniel S. Santander Urrutia?'
                      : '¿Por qué tomar clases con Daniel S. Santander Urrutia?'}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {lang === 'en'
                      ? 'More than traditional tutoring: an empirical research workshop combining the 5-step PIAD™ Method, 14 interactive physics & geophysics simulators with Free Body Diagrams (DCL), a 5-pillar applied mathematics toolkit, and 100% English or Spanish mentoring.'
                      : 'Más que clases particulares tradicionales: un taller de indagación empírica que combina el Método PIAD™ en 5 fases, 14 simuladores interactivos de física y geofísica con DCL en vivo, un toolkit matemático de 5 pilares y mentoría 100 % en español o inglés.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {WHY_ME_REASONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <div
                        key={r.id}
                        className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                              <Icon className="w-4 h-4" />
                            </span>
                            {r.badgeEn && (
                              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-bold">
                                {lang === 'en' ? r.badgeEn : r.badgeEs}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                            {lang === 'en' ? r.titleEn : r.titleEs}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                            {lang === 'en' ? r.textEn : r.textEs}
                          </p>
                        </div>

                        {r.actionPage && (
                          <button
                            onClick={() => navigateTo(r.actionPage, r.actionSection)}
                            className="pt-3 border-t border-slate-200/80 text-left text-xs font-mono font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between group cursor-pointer"
                          >
                            <span>{lang === 'en' ? r.actionLabelEn : r.actionLabelEs}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center md:text-left">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      {lang === 'en'
                        ? 'Zero Risk • 20-Minute Strategy & Diagnostic Session'
                        : 'Sin Compromiso • Sesión Diagnóstica Gratuita de 20 Minutos'}
                    </span>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                      {lang === 'en'
                        ? 'Tell me your university module or IB subject, your exam date, and where you get stuck. We inspect your syllabus and design a concrete action plan.'
                        : 'Cuéntame tu ramo universitario o asignatura IB, tu fecha de examen y dónde te atascas. Revisamos tus apuntes y armamos un plan concreto.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                    <button
                      onClick={() => handleOpenBooking()}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Book Free Diagnostic' : 'Reservar Diagnóstico Gratis'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('pricing')}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-sky-400" />
                      <span>{lang === 'en' ? 'Rate Calculator' : 'Calculadora'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Linked Finale at the End of Landing: Mentor Profile Followed by Proprietary PIAD Method */}
            <section id="mentor-and-method" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* 3A. Profile Presentation: First presents Daniel S. Santander Urrutia */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative">
                      <img
                        src="./profile.jpg"
                        alt="Daniel S. Santander Urrutia"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-md">
                        M.Sc. Geophysics
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                      {lang === 'en' ? 'Academic Pedigree & Research Grounding' : 'Trayectoria Académica e Investigación'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Daniel S. Santander Urrutia
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-600">
                      {lang === 'en' ? 'Engineering Geophysics (Universidad de Chile) • Double European M.Sc. (CAU Kiel, Germany & AMU Poznań, Poland)' : 'Ingeniería en Geofísica (Universidad de Chile) • Doble M.Sc. Europeo (CAU Kiel, Alemania y AMU Poznań, Polonia)'}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Combining high-impact territorial environmental science, hydrogeophysical catchment modeling, and digital twins with over 500 hours of 1-on-1 university physics and mathematics mentorship in Germany.'
                        : 'Combinando ciencia ambiental territorial, modelación hidrogeofísica de cuencas y gemelos digitales con más de 500 horas de mentoría universitaria de alto rendimiento en Alemania.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigateTo('tutor')}
                        className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer"
                      >
                        {lang === 'en' ? 'Read Full Academic Dossier →' : 'Ver Dossier Académico Completo →'}
                      </button>
                      <button
                        onClick={() => navigateTo('contact')}
                        className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Contact (+49 176 7649 7440)' : 'Contacto (+49 176 7649 7440)'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3B. Direct Link to PIAD Method: Then presents the PIAD method developed by Daniel */}
                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Pedagogical Framework by Daniel S. Santander Urrutia' : 'Metodología Pedagógica Desarrollada por Daniel S. Santander Urrutia'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                        {lang === 'en'
                          ? 'The PIAD Method™: Open & Digital Inquiry in Physics and Mathematics'
                          : 'El Método PIAD™: Indagación Abierta y Digital en Física y Matemáticas'}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
                        {lang === 'en'
                          ? 'A foundational pedagogical cycle connecting sensory intuition, Occam’s parsimony, and empirical simulation. Students learn to isolate the essential core of problems, write their own computational models in Python, and master challenging university coursework.'
                          : 'Un ciclo pedagógico que une la intuición sensible, la parsimonia de Ockham y la simulación empírica. El estudiante aprende a relevar lo esencial de cada problema, escribir modelos computacionales en Python y dominar materias universitarias de alta exigencia.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => navigateTo('piad')}
                          className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-indigo-500/30 cursor-pointer"
                        >
                          <Compass className="w-4 h-4" />
                          <span>{lang === 'en' ? 'Explore the 5-Step PIAD Manifesto →' : 'Conocer el Manifiesto PIAD en 5 Fases →'}</span>
                        </button>
                        <button
                          onClick={() => openLabProblem('newtonian')}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Atom className="w-4 h-4 text-sky-400" />
                          <span>{lang === 'en' ? 'Test in Physics Sandbox' : 'Probar en el Simulador Físico'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 font-mono text-xs">
                      <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold block">
                        {lang === 'en' ? 'The PIAD 5-Step DNA' : 'El Ciclo PIAD en 5 Fases'}
                      </span>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">1</span>
                          <span>{lang === 'en' ? 'Direct Observation & Intuition' : 'Observación Directa e Intuición'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">2</span>
                          <span>{lang === 'en' ? 'Questioning Prior Consensus & Dogmas' : 'Cuestionar Consensos y Dogmas Previos'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">3</span>
                          <span>{lang === 'en' ? 'Highlighting the Essential Core (Occam)' : 'Relevar lo Esencial de un Problema'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">4</span>
                          <span>{lang === 'en' ? 'Empirical Laboratory Verification' : 'Verificación y Laboratorio Empírico'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">5</span>
                          <span>{lang === 'en' ? 'Open Knowledge Artifact & Code' : 'Artefacto de Conocimiento Abierto'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 1.5: INTERACTIVE CLASSICAL PHYSICS & CALCULUS LAB    */}
        {/* ========================================================= */}
        {currentPage === 'lab' && (
          <PhysicsLab
            lang={lang}
            initialProblemId={activeLabProblemId}
            onOpenBooking={handleOpenBooking}
            onNavigate={navigateTo}
            courses={ACADEMIC_COURSES}
          />
        )}

        {/* ========================================================= */}
        {/* PAGE 2: FULL COURSE CATALOG & TACTICAL SPRINT PREVIEW     */}
        {/* ========================================================= */}
        {currentPage === 'courses' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Breadcrumb & Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                  <button onClick={() => navigateTo('landing')} className="hover:underline">{lang === 'en' ? 'Home' : 'Inicio'}</button>
                  <span>/</span>
                  <span className="text-slate-900 font-bold">{lang === 'en' ? 'Course Catalog' : 'Catálogo de Clases'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {lang === 'en' ? 'Official Course Catalog & University Exam Modules' : 'Catálogo Curricular Oficial de Materias'}
                </h1>
                <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
                  {lang === 'en'
                    ? 'Every course is synchronized with university lecture notes and official examiner grading rubrics.'
                    : 'Cada asignatura está sincronizada con los apuntes universitarios y los criterios oficiales de corrección.'}
                </p>
              </div>

              {/* Punto 4: CONCRETE DELIVERABLES SECTION */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-md">
                <div className="max-w-3xl mb-6">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                    {lang === 'en' ? 'Tangible Session Deliverables' : 'Entregables Concretos de Cada Sesión'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {lang === 'en' ? 'What You Take Away After Every Single Class' : 'Lo Que Te Llevas Puesto al Terminar Cada Clase'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Vector PDF (Miro Export)' : 'PDF Vectorial (Export Miro)'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Complete step-by-step mathematical derivations exported in crisp 4K vector format with color-coded algebraic stages.'
                        : 'Demostraciones matemáticas paso a paso exportadas en formato vectorial 4K nítido con fases algebraicas en color.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                      <BookmarkCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Formula Cheat-Sheets' : 'Formularios Resumen'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Condensed 1-page formula summaries and conversion rules formatted specifically for quick review before exams.'
                        : 'Resúmenes condensados de fórmulas y reglas de cálculo en 1 página, optimizados para repasar antes del examen.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Python Verification Code' : 'Código Python de Verificación'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Executable NumPy/SciPy script confirming numerical roots, matrix eigenvalues, or ODE stability whenever applicable.'
                        : 'Scripts ejecutables en NumPy/SciPy que verifican raíces numéricas, autovalores matriciales o estabilidad de EDOs.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Async WhatsApp Q&A' : 'Dudas por WhatsApp'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Send photos of exercise bottlenecks directly on WhatsApp/Telegram; get fast voice-note or audio guidance between sessions.'
                        : 'Envía fotos de tus dudas directamente por WhatsApp y recibe orientación rápida por audio o notas entre sesiones.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'PIAD First-Principles Framework' : 'Marco PIAD por Primeros Principios'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'First-principles heuristics, interactive physical simulations, and scientific code scaffolding (Python/NumPy) to democratize analytical mastery.'
                        : 'Heurísticas por primeros principios, simulaciones físicas interactivas y código científico (Python/NumPy) para democratizar el dominio analítico.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Punto 5: 3-STEP ROADMAP & SPONTANEOUS SESSION MODUS */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                      {lang === 'en' ? 'Fast-Track Execution Roadmap' : 'Hoja de Ruta Rápida en 3 Pasos'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {lang === 'en' ? 'How We Prepare Your Examination' : 'Cómo Preparamos tu Examen'}
                    </h3>
                    
                    <div className="space-y-3 pt-2 text-xs text-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">1</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? 'Send Your Syllabus & Problem Sets' : 'Envía tus apuntes y exámenes anteriores'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? "Upload your professor's lecture notes and target past exam papers."
                              : 'Comparte las guías de ejercicios, temarios y exámenes pasados de tu cátedra.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">2</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? '20-Min Free Strategy Call' : 'Llamada estratégica gratis (20 min)'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? 'We isolate your 3 primary conceptual bottlenecks and score traps.'
                              : 'Identificamos tus 3 bloqueos conceptuales principales y dónde pierdes puntos.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">3</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? 'Intensive Sprint or Spontaneous Drill' : 'Sprint intensivo o clase puntual'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? 'Lock in your schedule slots (Online worldwide or in-person in Hannover).'
                              : 'Fijamos tus sesiones en el calendario (Online en todo el mundo o presencial en Hannover).'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold uppercase">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'en' ? 'Urgent / Spontaneous Classes' : 'Clases Espontáneas e Inmediatas'}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {lang === 'en' ? 'Need an Emergency 1-on-1 Session This Week?' : '¿Necesitas una Clase Individual Urgente Esta Semana?'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Available for high-urgency exercise problem sheets or last-minute university exam drills. Choose between online interactive whiteboarding or in-person coaching in Hannover.'
                        : 'Disponible para resolver guías de ejercicios urgentes o dudas de último minuto antes del examen. Modalidad online interactiva o presencial en Hannover.'}
                    </p>
                    <button
                      onClick={() => handleOpenBooking(null, true)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      {lang === 'en' ? 'Request Spontaneous Session →' : 'Pedir Clase Espontánea →'}
                    </button>
                  </div>

                </div>
              </div>

              {/* Eye-catching & Organized Category Filter Tabs */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    {lang === 'en' ? 'Select Subject Discipline' : 'Selecciona Disciplina o Área Académica'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {lang === 'en' ? `Showing ${filteredCourses.length} of ${ACADEMIC_COURSES.length} courses` : `Mostrando ${filteredCourses.length} de ${ACADEMIC_COURSES.length} materias`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {COURSE_FILTER_TABS.map((tab) => {
                    const isActive = courseFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCourseFilter(tab.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          isActive
                            ? `${tab.activeClass} -translate-y-0.5`
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50/80 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="text-base sm:text-lg">{tab.icon}</span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </div>
                        <div>
                          <div className={`font-bold text-xs sm:text-sm leading-tight mb-0.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {lang === 'en' ? tab.labelEn : tab.labelEs}
                          </div>
                          <div className={`font-mono text-[10px] line-clamp-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {lang === 'en' ? tab.badgeEn : tab.badgeEs}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid of Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-lg transition-all group"
                  >
                    <div className="h-48 overflow-hidden relative bg-slate-950">
                      {/* Back Layer: AI Simulation / Vector Overlay (Always loaded underneath, zooms slightly on hover) */}
                      {course.simulationImage && (
                        <img 
                          src={getAssetUrl(course.simulationImage)} 
                          alt={`${course.titleEn} Simulation`} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                          loading="lazy"
                        />
                      )}
                      {/* Front Layer: Real Academic Photo (Fades out smoothly on hover to reveal simulation) */}
                      <img 
                        src={course.image} 
                        alt={course.titleEn} 
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                          course.simulationImage ? 'group-hover:opacity-0 group-hover:scale-105' : ''
                        }`} 
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs border border-white/10 shadow-sm">
                          {course.code}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-slate-900 font-bold shadow-sm backdrop-blur-xs">
                          {lang === 'en' ? course.badgeEn : course.badgeEs}
                        </span>
                      </div>
                      {/* Interactive Mode Badge on Hover */}
                      {course.simulationImage && (
                        <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/90 text-sky-300 border border-sky-400/30 backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                            <Sparkles className="w-3 h-3 text-sky-400" />
                            <span>{lang === 'en' ? 'Interactive Simulation' : 'Simulación Vectorial'}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                          {lang === 'en' ? course.titleEn : course.titleEs}
                        </h3>

                        <p className="font-mono text-[11px] text-slate-500 mb-3">
                          {lang === 'en' ? course.facultyEn : course.facultyEs}
                        </p>

                        <p className="text-xs text-slate-600 leading-relaxed mb-5 pb-4 border-b border-slate-100">
                          {lang === 'en' ? course.targetEn : course.targetEs}
                        </p>

                        <div className="mb-5 flex items-baseline justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-mono font-bold text-slate-900">{formatMoney(getCourseHourlyRate(course, currency), currency)}</span>
                              <span className="text-xs font-mono text-slate-500">/ hour</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 block">
                              {lang === 'en' ? '1-on-1 Individual Session' : 'Sesión Individual 1-a-1'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-700 block">
                              {formatMoney(getCoursePackRate(course, currency), currency)} / {course.packageHours}h Pack
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {lang === 'en' ? 'Exam Sprint Pack' : 'Pack Sprint de Examen'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                            {lang === 'en' ? 'Core Syllabus & University Exam Drills:' : 'Temario Clave y Exámenes:'}
                          </span>
                          <ul className="space-y-2 text-xs text-slate-700">
                            {(lang === 'en' ? course.syllabusEn : course.syllabusEs).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-6 pt-3 border-t border-slate-100">
                          <span className="font-mono text-[10px] text-slate-500 block mb-1.5 font-semibold">
                            {lang === 'en' ? 'Course Key Concepts:' : 'Conceptos Clave del Curso:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(lang === 'en' ? (course.keywordsEn || course.skriptKeywords) : (course.keywordsEs || course.skriptKeywords))?.map((kw, i) => (
                              <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <button
                          onClick={() => openLabProblem(COURSE_LAB_MAPPING[course.id] || 'newtonian')}
                          className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <Compass className="w-3.5 h-3.5 text-sky-600" />
                          <span>{lang === 'en' ? 'Open Subject Mini-Lab (DCL) →' : 'Ver Mini-Lab de esta Materia (DCL) →'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenBooking(course)}
                          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>{lang === 'en' ? 'Enroll / Request Diagnostic' : 'Inscribirse / Solicitar Diagnóstico'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 3: FOUNDATIONAL STEM LIBRARY & COMPENDIUM OF LAWS     */}
        {/* ========================================================= */}
        {currentPage === 'library' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <button onClick={() => navigateTo('landing')} className="hover:underline">{lang === 'en' ? 'Home' : 'Inicio'}</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">{lang === 'en' ? 'Classical Library & Compendium' : 'Biblioteca Clásica & Compendio de Leyes'}</span>
              </div>

              {/* Library Banner with Real Historical Library + Illuminated Treatises Crossfade */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-lg group">
                <img 
                  src="./images/stock/photo-1521587760476-6c12a4b040da-1600.webp" 
                  alt={lang === 'en' ? 'Academic Library' : 'Biblioteca Académica'} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-700 ease-in-out group-hover:opacity-0" 
                />
                <img 
                  src={getAssetUrl('/images/stem-library.webp')} 
                  alt={lang === 'en' ? 'Theoretical STEM Library Treatises' : 'Tratados Teóricos de la Biblioteca STEM'} 
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-35" 
                />
                <div className="relative z-10 p-8 sm:p-14 max-w-3xl">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold block mb-2">
                    {lang === 'en' ? 'Core Literature & Exact Mathematical Formulations' : 'Literatura Fundamental & Formulaciones Exactas'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {lang === 'en' ? 'Classical Library & Compendium of Laws' : 'Biblioteca Clásica y Compendio de Leyes'}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Every concept taught in our sessions is anchored directly in the great historical treatises and exact mathematical formulations of classical physics, continuum mechanics, multivariable calculus, and spectral analysis.'
                      : 'Cada demostración y concepto impartido en nuestras sesiones se fundamenta directamente en los grandes tratados de la física matemática, la mecánica de medios continuos y el cálculo diferencial.'}
                  </p>
                </div>
              </div>

              {/* Dual Sub-View Switcher: Classical Treatises vs Compendium of Laws */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setLibraryTab('books')}
                  className={`px-5 py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer border ${
                    libraryTab === 'books'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'en' ? 'Foundational Academic Books & Treatises' : 'Tratados Clásicos y Bibliografía'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold ml-1">
                    {FOUNDATIONAL_BOOKS.length}
                  </span>
                </button>

                <button
                  onClick={() => setLibraryTab('laws')}
                  className={`px-5 py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer border ${
                    libraryTab === 'laws'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-500/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'en' ? 'Compendium of Laws & Formulations (LaTeX)' : 'Compendio de Leyes & Formulaciones (LaTeX)'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold ml-1">
                    20+
                  </span>
                </button>
              </div>

              {/* Tab 1: Foundational Academic Treatises Grid with Search & Filters */}
              {libraryTab === 'books' && (
                <div className="space-y-6">
                  {/* Clean Search & Discipline Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* Live Search Input */}
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        value={bookSearchQuery}
                        onChange={(e) => setBookSearchQuery(e.target.value)}
                        placeholder={lang === 'en' ? 'Search title, author, or topic...' : 'Buscar libro, autor o materia...'}
                        className="w-full pl-9 pr-7 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                      />
                      {bookSearchQuery && (
                        <button 
                          onClick={() => setBookSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs w-full sm:w-auto">
                      {[
                        { id: 'all', labelEn: 'All Books (7)', labelEs: 'Todos (7)' },
                        { id: 'physics', labelEn: 'Physics & Mechanics (3)', labelEs: 'Física & Mecánica (3)' },
                        { id: 'math', labelEn: 'Calculus & Algebra (2)', labelEs: 'Cálculo & Álgebra (2)' },
                        { id: 'earth', labelEn: 'Earth & Atmosphere (2)', labelEs: 'Geociencias & Atmósfera (2)' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setBookCategory(tab.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                            bookCategory === tab.id
                              ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {lang === 'en' ? tab.labelEn : tab.labelEs}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredBooks.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="font-mono text-sm text-slate-600 mb-2">
                        {lang === 'en' ? 'No matching books found' : 'No se encontraron libros con esa búsqueda'}
                      </p>
                      <button 
                        onClick={() => { setBookSearchQuery(''); setBookCategory('all'); }}
                        className="text-xs font-mono text-sky-600 underline font-bold"
                      >
                        {lang === 'en' ? 'Clear search filters' : 'Restablecer filtros'}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBooks.map((book) => (
                        <div 
                          key={book.id} 
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-md transition-all"
                        >
                          <div className="h-44 overflow-hidden relative">
                            <img 
                              src={book.image} 
                              alt={book.title} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-3 right-3">
                              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 backdrop-blur-xs font-bold">
                                {book.tag}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                                {book.title}
                              </h3>
                              <p className="text-xs font-mono text-slate-500 mb-2">
                                {book.authors}
                              </p>
                              <p className="text-[11px] font-mono text-sky-700 font-semibold mb-3">
                                {lang === 'en' ? book.subjectEn : book.subjectEs}
                              </p>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                                {lang === 'en' ? book.descriptionEn : book.descriptionEs}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400">
                                {book.edition}
                              </span>
                              <div className="flex gap-1">
                                {book.usedIn.map((m, i) => (
                                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Compendium of Laws & Formulations (LaTeX) */}
              {libraryTab === 'laws' && (
                <div>
                  <PhysicsToolkit lang={lang} onOpenBooking={handleOpenBooking} />
                </div>
              )}

            </div>
          </div>
        )}



        {/* ========================================================= */}
        {/* PAGE 3: PRECIOS (UNIFIED TUITION CALCULATOR & MENTOR DOSSIER) */}
        {/* ========================================================= */}
        {currentPage === 'pricing' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <button onClick={() => navigateTo('landing')} className="hover:underline">{lang === 'en' ? 'Home' : 'Inicio'}</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">{lang === 'en' ? 'Pricing & Mentor Dossier' : 'Precios & Dossier del Mentor'}</span>
              </div>

              {/* Page Header */}
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  Transparent Tuition &amp; Academic Credentials
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {lang === 'en' ? 'Transparent Rates & Mentor Dossier' : 'Precios Transparentes & Perfil del Mentor'}
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto font-sans leading-relaxed">
                  {lang === 'en'
                    ? 'Calculate your customized investment, explore fixed intensive exam sprint bundles, and inspect Daniel S. Santander Urrutia’s verified engineering and geophysics background.'
                    : 'Calcula tu inversión a medida, explora los planes de sprint intensivo para exámenes universitarios y conoce la formación y metodología de Daniel S. Santander Urrutia.'}
                </p>
              </div>

              {/* --- SECTION 1: INTERACTIVE RATE CALCULATOR --- */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                  {/* Top Bar: Currency / Country Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        {lang === 'en' ? 'Select Your Country / Currency' : 'Selecciona tu País / Moneda'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {lang === 'en' ? 'Rates automatically adapted to regional market & currency' : 'Tarifas adaptadas automáticamente a tu moneda y región'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {Object.values(CURRENCY_TIERS).map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCurrency(c.code)}
                          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            currency === c.code
                              ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span>{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          {lang === 'en' ? 'Subject Complexity Tier (Price per Class Type)' : 'Complejidad de la Materia (Precio según Ramo)'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                          {SUBJECT_COMPLEXITY_TIERS.map((lvl) => {
                            const lvlRate = baseRates[lvl.id] || baseRates.ib;
                            const isSelected = calcLevel === lvl.id;
                            return (
                              <button
                                key={lvl.id}
                                type="button"
                                onClick={() => setCalcLevel(lvl.id)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                                }`}
                              >
                                <div>
                                  <div className={`text-[11px] font-bold leading-snug mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {lang === 'en' ? lvl.shortEn : lvl.shortEs}
                                  </div>
                                  <div className={`text-[10px] font-sans leading-tight mb-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {lang === 'en' ? lvl.coursesEn : lvl.coursesEs}
                                  </div>
                                </div>
                                <div className={`text-xs font-mono font-extrabold pt-1.5 border-t ${isSelected ? 'border-slate-700 text-emerald-400' : 'border-slate-100 text-sky-800'}`}>
                                  {formatMoney(lvlRate, currency)}/h
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 font-mono text-xs">
                          <span className="text-slate-500 uppercase font-semibold">
                            {lang === 'en' ? 'Mentorship Volume' : 'Horas de Mentoría'}
                          </span>
                          <span className="text-sky-800 font-bold text-lg">
                            {calcHours} {lang === 'en' ? 'hours' : 'horas'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={calcHours}
                          onChange={(e) => setCalcHours(parseInt(e.target.value, 10))}
                          className="w-full accent-sky-700 bg-slate-200 rounded-lg cursor-pointer h-2"
                        />
                        <div className="grid grid-cols-3 gap-2 mt-2.5 font-mono text-[11px]">
                          {[
                            { h: 1, sprint: false, labelEn: '1h Single Class', labelEs: '1h Clase Suelta' },
                            { h: 8, sprint: true, labelEn: '8h Exam Sprint (-15%)', labelEs: '8h Pack Examen (-15%)' },
                            { h: 16, sprint: true, labelEn: '16h Semester Support (-15%)', labelEs: '16h Semestre (-15%)' }
                          ].map((preset) => (
                            <button
                              key={preset.h}
                              type="button"
                              onClick={() => {
                                setCalcHours(preset.h);
                                setCalcSprintDiscount(preset.sprint);
                              }}
                              className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                                calcHours === preset.h
                                  ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {lang === 'en' ? preset.labelEn : preset.labelEs}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Logarithmic Group Scaling Selector (N = 1, 2, 3, 4 students) */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                            {lang === 'en' ? 'Study Solo or Add Classmates (Logarithmic Discount)' : '¿Solo o con Colegas? (Descuento Logarítmico por Persona)'}
                          </label>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">
                            {lang === 'en' ? 'More classmates = each pays less!' : '¡Más colegas = cada uno paga menos!'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                          {[
                            { n: 1, titleEn: 'Solo (1-on-1)', titleEs: 'Solo (1-a-1)', subEn: '1 student', subEs: '1 estudiante' },
                            { n: 2, titleEn: '+1 Classmate', titleEs: '+1 Colega', subEn: '2 students', subEs: '2 estudiantes' },
                            { n: 3, titleEn: '+2 Classmates', titleEs: '+2 Colegas', subEn: '3 students', subEs: '3 estudiantes' },
                            { n: 4, titleEn: '+3 Classmates', titleEs: '+3 Colegas', subEn: '4 students', subEs: '4 estudiantes' }
                          ].map((g) => {
                            const gp = getGroupPricing(singleEffectiveHourly, g.n, currency);
                            const isSelected = calcStudents === g.n;
                            return (
                              <button
                                key={g.n}
                                type="button"
                                onClick={() => setCalcStudents(g.n)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? g.n === 1
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                                      : 'bg-emerald-900 border-emerald-700 text-white shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                                }`}
                              >
                                <div>
                                  <div className={`font-bold text-[11px] ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {lang === 'en' ? g.titleEn : g.titleEs}
                                  </div>
                                  <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {formatMoney(gp.perStudentHourly, currency)}/h {lang === 'en' ? 'each' : 'c/u'}
                                  </div>
                                </div>
                                <div className={`text-[10px] font-bold mt-1.5 pt-1 border-t ${
                                  isSelected
                                    ? 'border-white/20 text-emerald-300'
                                    : g.n === 1
                                      ? 'border-slate-100 text-slate-400'
                                      : 'border-slate-100 text-emerald-700'
                                }`}>
                                  {g.n === 1
                                    ? (lang === 'en' ? '100% Personalized' : '100% Personalizado')
                                    : `-${gp.studentDiscountPct}% ${lang === 'en' ? 'per student' : 'por alumno'}`}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          {lang === 'en' ? 'Location Mode' : 'Modalidad / Ubicación'}
                        </label>
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => setCalcMode('online')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              calcMode === 'online'
                                ? 'bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="font-bold text-slate-900">Online (Google Meet + Miro)</div>
                            <div className="text-[10px] text-slate-500">
                              {lang === 'en' ? 'Live Vector PDF Whiteboard' : 'Pizarra Vectorial PDF en Vivo'}
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCalcMode('inperson')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              calcMode === 'inperson'
                                ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="font-bold text-slate-900">
                              {lang === 'en' ? 'In-Person (Hannover)' : 'Presencial (Hannover)'}
                            </div>
                            <div className="text-[10px] text-amber-700 font-semibold">
                              {lang === 'en' ? 'In-person is extra' : 'Clase presencial es extra'}
                            </div>
                          </button>
                        </div>
                      </div>

                      {calcMode === 'inperson' && (
                        <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-mono text-amber-900 flex items-center justify-between">
                          <span>
                            {lang === 'en'
                              ? '📍 In-person classes (Hannover area) include an extra travel fee per hour.'
                              : '📍 La clase presencial (zona Hannover) tiene un pequeño recargo extra por traslado.'}
                          </span>
                          <span className="font-bold">+{formatMoney(inPersonExtraPerHour, currency)}/h</span>
                        </div>
                      )}

                      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-mono">
                        <input
                          type="checkbox"
                          checked={calcSprintDiscount}
                          onChange={(e) => setCalcSprintDiscount(e.target.checked)}
                          className="rounded border-slate-300 text-sky-700 focus:ring-sky-600"
                        />
                        <span className="text-slate-700 font-semibold">
                          {lang === 'en'
                            ? 'Apply 8h Exam Sprint Bundle (-15% discount)'
                            : 'Aplicar Paquete Sprint de Exámenes (-15% de descuento)'}
                        </span>
                      </label>

                    </div>

                    <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                            {calcStudents === 1
                              ? (lang === 'en' ? 'Estimated Investment' : 'Inversión Estimada')
                              : (lang === 'en' ? `Per Student (${calcStudents} classmates)` : `Por Estudiante (${calcStudents} colegas)`)}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                            {activeTier.flag} {activeTier.code}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white">{formatMoney(totalCost, currency)}</span>
                          <span className="text-xs font-mono text-slate-400">
                            {calcStudents === 1
                              ? (lang === 'en' ? 'total' : 'total')
                              : (lang === 'en' ? 'per student' : 'por alumno')}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-slate-300 pb-3 mb-3 border-b border-slate-800 flex items-center justify-between">
                          <span>
                            {lang === 'en' ? 'Hourly per student: ' : 'Tarifa por alumno: '}
                            <strong className="text-emerald-400">{formatMoney(effectiveRate, currency)}/hr</strong>
                          </span>
                          {calcStudents > 1 && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              -{groupPricing.studentDiscountPct}% c/u
                            </span>
                          )}
                        </div>

                        {calcStudents > 1 && (
                          <div className="mb-4 p-3 rounded-xl bg-slate-800/90 border border-emerald-500/30 font-mono text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-slate-200">
                              <span>{lang === 'en' ? `Total Group (${calcStudents} students):` : `Total Grupo (${calcStudents} personas):`}</span>
                              <strong className="text-amber-300">{formatMoney(totalGroupCost, currency)}</strong>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{lang === 'en' ? 'Combined group hourly rate:' : 'Tarifa grupal combinada:'}</span>
                              <span>{formatMoney(groupPricing.totalGroupHourly, currency)}/hr</span>
                            </div>
                          </div>
                        )}

                        <ul className="space-y-2 text-xs text-slate-300 font-mono mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'PIAD™ Method + 14-Problem Interactive Lab' : 'Método PIAD™ + Lab Interactivo (14 Problemas)'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Miro Whiteboard Vector PDF + Study Sheet' : 'PDF Vectorial (Miro) + Hoja de Estudio PDF'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Productive AI Prompts to Write Python Code' : 'IA Productiva para Diseñar Código Python'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Direct Async WhatsApp Q&A Access' : 'Consultas Asíncronas Directas por WhatsApp'}</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleOpenBooking({
                          code: 'CALC',
                          titleEn: `${calcLevel.toUpperCase()} - ${calcHours}h (${calcStudents === 1 ? '1-on-1' : `Group of ${calcStudents}`}, ${calcMode === 'inperson' ? 'In-Person' : 'Online'}) [${formatMoney(totalCost, currency)}/student]`,
                          titleEs: `${calcLevel.toUpperCase()} - ${calcHours}h (${calcStudents === 1 ? '1-a-1' : `Grupo de ${calcStudents}`}, ${calcMode === 'inperson' ? 'Presencial' : 'Online'}) [${formatMoney(totalCost, currency)}/alumno]`
                        })}
                        className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{lang === 'en' ? 'Claim This Study Plan' : 'Elegir este Plan de Estudio'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* --- SECTION 1.5: SOLIDARITY ECONOMY & BARTER (TRUEQUE Y ACUERDOS SOLIDARIOS) --- */}
              <div id="barter-solidarity" className="max-w-5xl mx-auto space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                    {lang === 'en' ? 'Open Knowledge & Flexible Exchange' : 'Economía Abierta & Acceso Universal'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {lang === 'en' ? 'Barter, Skill Exchange & Financial Solidarity' : 'Trueque, Intercambio de Habilidades & Apoyo Solidario'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
                    {lang === 'en'
                      ? 'The pursuit of science and mathematics should be open to all. If standard tuition does not fit your reality, we have flexible human paths.'
                      : 'El rigor científico y el aprendizaje de las matemáticas deben ser accesibles para todos. Si la tarifa convencional no se ajusta a tu momento, tenemos caminos abiertos.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Trueque / Intercambio */}
                  <div className="bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-amber-500 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center border border-amber-500/30 shrink-0">
                          <Repeat className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                            {lang === 'en' ? 'Barter / Skill Exchange' : 'Pago por Trueque'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug mt-1">
                            {lang === 'en' ? 'Want to pay through an exchange?' : '¿Quieres pagar a través del intercambio?'}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                        {lang === 'en' ? (
                          <>
                            <strong>&ldquo;I gladly accept music, video games, psychology sessions or other creative crafts — get in touch!&rdquo;</strong> If you have creative or professional skills, production/instruments, games, languages or other talents, let’s talk and coordinate a fair, meaningful exchange.
                          </>
                        ) : (
                          <>
                            <strong>&ldquo;Acepto música, videojuegos, sesiones de psicología u otros, ¡ponte en contacto!&rdquo;</strong> Si tienes habilidades musicales, instrumentos, videojuegos, sesiones de terapia/psicología, diseño, idiomas u otros talentos, conversemos y acordemos un trueque justo y enriquecedor para ambos.
                          </>
                        )}
                      </p>

                      <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-1">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-amber-700" />
                          <span>{lang === 'en' ? 'Music &amp; Production' : 'Música &amp; Producción'}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1.5">
                          <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>{lang === 'en' ? 'Video Games' : 'Videojuegos'}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                          🧠 {lang === 'en' ? 'Psychology Sessions' : 'Sesiones de Psicología'}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                          🎨 {lang === 'en' ? 'Design &amp; Other Talents' : 'Diseño &amp; Otros Talentos'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-amber-200/60">
                      <a
                        href={`https://wa.me/4917676497440?text=${encodeURIComponent(
                          lang === 'en'
                            ? 'Hi Daniel! I am interested in STEM mentorship and would love to propose a skill exchange / barter for classes (music, psychology, games, etc.).'
                            : '¡Hola Daniel! Me interesan tus clases y me gustaría proponerte un intercambio/trueque (música, psicología, videojuegos u otro talento) para coordinar.'
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Repeat className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Propose a Barter via WhatsApp →' : 'Proponer un Trueque por WhatsApp →'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Card 2: Apoyo Solidario / Dificultad Económica */}
                  <div className="bg-gradient-to-br from-emerald-500/5 via-white to-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-emerald-500 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center border border-emerald-500/30 shrink-0">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                            {lang === 'en' ? 'Financial Solidarity & Scholarships' : 'Acceso Solidario & Becas'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug mt-1">
                            {lang === 'en' ? 'Need classes but running short on money?' : '¿Necesitas clases pero no tienes el dinero?'}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                        {lang === 'en' ? (
                          <>
                            <strong>&ldquo;Message me and tell me your situation: we can definitely work something out!&rdquo;</strong> Lack of financial resources must never stop you from mastering physics and calculus. Let’s talk openly and build a custom solidarity agreement or partial scholarship so you pass your exam.
                          </>
                        ) : (
                          <>
                            <strong>&ldquo;Escríbeme y cuéntame tu situación, ¡totalmente podemos trabajar en ello!&rdquo;</strong> La falta de dinero nunca debe ser una barrera para aprender física y matemáticas con rigor. Escríbeme con total confianza: buscamos un acuerdo adaptado a tu realidad o una beca parcial para que apruebes tu ramo.
                          </>
                        )}
                      </p>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 font-mono text-[11px] text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Handshake className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lang === 'en' ? '100% Confidential & Judgment-Free' : '100% Confidencial y sin juicios'}</span>
                        </div>
                        <p className="text-[10px] text-emerald-800 leading-normal">
                          {lang === 'en'
                            ? 'Tell me which university course you are taking and where you are stuck. We prioritize your academic success.'
                            : 'Cuéntame qué materia estás cursando y qué examen tienes cerca. Priorizamos tu aprendizaje y tu título.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-emerald-200/60">
                      <a
                        href={`https://wa.me/4917676497440?text=${encodeURIComponent(
                          lang === 'en'
                            ? 'Hi Daniel! I really need help with my STEM university exams, but I am currently facing financial constraints. I would love to tell you about my situation and see if we can work something out.'
                            : '¡Hola Daniel! Necesito apoyo urgente con mis ramos de ciencias pero actualmente tengo dificultades económicas. Me gustaría contarte mi situación para ver si podemos trabajar en un acuerdo solidario.'
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Tell Me Your Situation via WhatsApp →' : 'Cuéntame tu situación por WhatsApp →'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MENTOR DOSSIER & VERIFIED CREDENTIALS */}
              <div id="mentor-dossier" className="pt-8 border-t border-slate-200">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                    {lang === 'en' ? 'Academic Background & Methodology' : 'Trayectoria Académica & Metodología'}
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {lang === 'en' ? 'Meet Your Mentor: Daniel S. Santander Urrutia' : 'Conoce al Mentor: Daniel S. Santander Urrutia'}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    {lang === 'en' ? 'Geophysicist & Double Master of Science Engineer based in Germany.' : 'Geofísico e Ingeniero Doble Máster radicado en Alemania.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Photo & University Verified Credentials (5 cols) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src="./profile.jpg"
                        alt="Daniel S. Santander Urrutia"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Daniel S. Santander Urrutia</h3>
                        <p className="text-xs font-mono text-sky-700 font-semibold">
                          {lang === 'en' ? 'Geophysicist & Double M.Sc. Engineer' : 'Geofísico e Ingeniero Doble M.Sc.'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {lang === 'en' ? 'Hannover, Germany • Online Worldwide' : 'Hannover, Alemania • Online en todo el mundo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Formal University Degrees Box */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>{lang === 'en' ? 'Germany (CAU Kiel)' : 'Alemania (CAU Kiel)'}</span>
                          <span>{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">{lang === 'en' ? 'M.Sc. Environmental Management' : 'M.Sc. en Gestión Ambiental'}</span>
                        <span className="text-slate-500 text-[11px]">Christian-Albrechts-Universität zu Kiel</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>{lang === 'en' ? 'Poland (AMU Poznań)' : 'Polonia (AMU Poznań)'}</span>
                          <span>{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">{lang === 'en' ? 'M.Sc. Integrated Catchment Management' : 'M.Sc. en Gestión Integrada de Cuencas'}</span>
                        <span className="text-slate-500 text-[11px]">Adam Mickiewicz University</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>Chile (FCFM)</span>
                          <span>{lang === 'en' ? 'Engineering Degree' : 'Título de Ingeniero'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">{lang === 'en' ? 'Engineering Geophysics' : 'Ingeniería en Geofísica'}</span>
                        <span className="text-slate-500 text-[11px]">{lang === 'en' ? 'Universidad de Chile (Faculty of Physical &amp; Mathematical Sciences)' : 'Universidad de Chile (Facultad de Ciencias Físicas y Matemáticas)'}</span>
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('tutor')}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'en' ? 'View Full Tutor Dossier & Business Card →' : 'Ver Perfil y Tarjeta del Tutor →'}</span>
                      </button>

                      <a
                        href="https://wa.me/4917676497440"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp: +49 176 7649 7440</span>
                      </a>

                      <a
                        href="https://danisantanderurrutia-coder.github.io/portafolio/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Interactive Web Portfolio' : 'Portafolio Web Interactivo'}</span>
                        <ExternalLink className="w-3 h-3 opacity-75 ml-0.5" />
                      </a>

                      <a
                        href="https://github.com/danisantanderurrutia-coder/portafolio"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? "Daniel's GitHub Portfolio" : 'Portafolio GitHub de Daniel'}</span>
                      </a>
                    </div>

                  </div>

                  {/* Pedagogical Methodology & Experience (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                      <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                        {lang === 'en' ? 'The Mentorship Method' : 'El Método de Mentoría'}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {lang === 'en'
                          ? 'Rigorous physics intuition, exam-focused scoring, and zero linguistic friction.'
                          : 'Intuición física rigurosa, resolución enfocada al examen y cero fricción lingüística.'}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        {lang === 'en'
                          ? 'Most university students do not fail exams due to a lack of talent. They fail because university lectures present proofs as abstract formalisms without grounding the physical meaning, while professors demand precise, step-by-step justification to award partial points.'
                          : 'La mayoría de los estudiantes universitarios no reprueban por falta de talento. Se atascan cuando las clases presentan las demostraciones como formalismos abstractos sin explicar el sentido físico, mientras que en los exámenes se exige una justificación rigurosa paso a paso para otorgar puntos parciales.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center mb-3">01</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'Physical Intuition First' : 'Intuición Física Primero'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Visualizing the physical phenomenon before writing down differential equations.'
                            : 'Visualizar el fenómeno físico antes de escribir la ecuación diferencial.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center mb-3">02</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'University Exam Rubrics' : 'Criterios de Examen Universitario'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Structuring solutions step-by-step to earn every available partial point.'
                            : 'Estructura de respuesta para maximizar puntos parciales en cada pregunta.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center justify-center mb-3">03</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'Classes in English or Spanish' : 'Clases en Español o Inglés'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Zero language fatigue, working directly with your lecture notes and exam problem sheets.'
                            : 'Cero fatiga lingüística, trabajando con tus apuntes y exámenes anteriores oficiales.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'en' ? 'Want to review your syllabus with Daniel?' : '¿Quieres revisar tu temario con Daniel?'}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {lang === 'en' ? 'Book a free 20-minute diagnostic session with no obligation.' : 'Agenda una llamada diagnóstica de 20 minutos sin compromiso.'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenBooking()}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        {lang === 'en' ? 'Book Diagnostic Call →' : 'Reservar Diagnóstico →'}
                      </button>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 6: DIRECT CONTACT & PERSONAL CHANNELS                */}
        {/* ========================================================= */}
        {currentPage === 'contact' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
                <button onClick={() => navigateTo('landing')} className="hover:underline">{lang === 'en' ? 'Home' : 'Inicio'}</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">Contact</span>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  {lang === 'en' ? 'Direct Communication Channels' : 'Canales de Comunicación Directa'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {lang === 'en' ? 'Get in Direct Touch with Daniel' : 'Contacta Directamente con Daniel'}
                </h1>
                <p className="text-slate-600 text-sm">
                  {lang === 'en'
                    ? 'Write directly via WhatsApp, send an email, or schedule your 20-minute diagnostic session.'
                    : 'Escribe directamente por WhatsApp, envía un correo o agenda tu sesión diagnóstica de 20 minutos.'}
                </p>
              </div>

              {/* Mentor Identity Banner - Immediate Pedigree & Trust Grounding */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-xs mb-10">
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative">
                    <img
                      src="./profile.jpg"
                      alt="Daniel S. Santander Urrutia"
                      className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-2xl border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-3 -right-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-md">
                      M.Sc. Geophysics
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-3.5 text-center lg:text-left">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                    {lang === 'en' ? 'Academic Pedigree & Research Grounding' : 'Trayectoria Académica e Investigación'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Daniel S. Santander Urrutia
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-slate-600">
                    {lang === 'en' ? 'Engineering Geophysics (Universidad de Chile) • Double European M.Sc. (CAU Kiel, Germany & AMU Poznań, Poland)' : 'Ingeniería en Geofísica (Universidad de Chile) • Doble M.Sc. Europeo (CAU Kiel, Alemania y AMU Poznań, Polonia)'}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Combining high-impact territorial environmental science, hydrogeophysical catchment modeling, and digital twins with over 500 hours of 1-on-1 university physics and mathematics mentorship in Germany.'
                      : 'Combinando ciencia ambiental territorial, modelación hidrogeofísica de cuencas y gemelos digitales con más de 500 horas de mentoría universitaria de alto rendimiento en Alemania.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('tutor')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer transition-all shadow-xs"
                    >
                      {lang === 'en' ? 'Read Full Academic Dossier →' : 'Ver Dossier Académico Completo →'}
                    </button>
                    <a
                      href="https://wa.me/4917676497440"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Contact (+49 176 7649 7440)' : 'Contacto (+49 176 7649 7440)'}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                
                {/* WhatsApp & Phone */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'Phone & WhatsApp' : 'Teléfono & WhatsApp'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      +49 176 7649 7440
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? 'Direct WhatsApp messaging for fast inquiries, exercise photos, and appointment scheduling.'
                        : 'Mensajería directa por WhatsApp para consultas rápidas, fotos de ejercicios y coordinación de horarios.'}
                    </p>
                  </div>
                  <a
                    href="https://wa.me/4917676497440"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    {lang === 'en' ? 'Open WhatsApp Chat →' : 'Abrir Chat de WhatsApp →'}
                  </a>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'Direct Email' : 'Correo Electrónico'}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-slate-900 mb-1 break-all">
                      danisantander.urrutia@gmail.com
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? 'Send syllabi PDFs, exercise problem sets, and general inquiries. Reply guaranteed within 12 hours.'
                        : 'Envía PDFs de temarios, guías de ejercicios y consultas generales. Respuesta garantizada en menos de 12 horas.'}
                    </p>
                  </div>
                  <a
                    href="mailto:danisantander.urrutia@gmail.com?subject=Academic%20Mentorship%20Inquiry"
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    {lang === 'en' ? 'Send Email →' : 'Enviar Correo →'}
                  </a>
                </div>

                {/* GitHub Portfolio */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'GitHub Repositories' : 'Repositorios GitHub'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      @danisantanderurrutia-coder
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? "Explore Daniel's open-source repositories, geophysics scripts, digital twin tools, and web applications."
                        : 'Explora los repositorios de código abierto de Daniel, scripts de geofísica, gemelos digitales y aplicaciones web.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="https://danisantanderurrutia-coder.github.io/portafolio/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open Web Portfolio →' : 'Abrir Portafolio Web →'}</span>
                    </a>
                    <a
                      href="https://github.com/danisantanderurrutia-coder/portafolio"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'GitHub Repositories' : 'Repositorios GitHub'}</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* In-Person Hannover Location Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'en' ? 'In-Person Mentorship in Hannover' : 'Mentoría Presencial en Hannover'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {lang === 'en' ? 'Are you studying in Hannover or Niedersachsen?' : '¿Estudias en Hannover o en la región?'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl font-sans leading-relaxed">
                    {lang === 'en'
                      ? 'In-person sessions take place in university library study rooms (such as the TIB - Leibniz Information Centre for Science and Technology at Leibniz Universität Hannover) or quiet learning centers.'
                      : 'Las sesiones presenciales se coordinan en salas de estudio de bibliotecas universitarias (como la TIB de la Leibniz Universität Hannover) o espacios de estudio tranquilos.'}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBooking(null, false)}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap"
                >
                  {lang === 'en' ? 'Schedule Hannover Session →' : 'Agendar Sesión en Hannover →'}
                </button>
              </div>

              {/* Frequently Asked Questions (FAQ) Embedded in Contact */}
              <div id="faq-section" className="mt-16 pt-12 border-t border-slate-200">
                <div className="text-center mb-10">
                  <span className="text-xs font-mono text-sky-800 uppercase tracking-widest block mb-2 font-bold">
                    {lang === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {lang === 'en' ? 'University Exams & Session Logistics' : 'Logística de Exámenes Universitarios y Metodología'}
                  </h2>
                  <p className="text-slate-600 text-sm max-w-2xl mx-auto font-sans">
                    {lang === 'en'
                      ? 'Clear answers regarding university exams, in-person sessions in Hannover, digital tools, and scheduling.'
                      : 'Respuestas claras sobre exámenes universitarios, clases presenciales en Hannover, herramientas digitales y reservas.'}
                  </p>
                </div>

                <div className="space-y-3 max-w-4xl mx-auto">
                  {[
                    {
                      qEn: "Can sessions be conducted 100% in English or 100% in Spanish?",
                      qEs: "¿Se pueden impartir las clases 100% en español o 100% en inglés?",
                      aEn: "Yes. All sessions are taught completely in English or in Spanish according to your preference, allowing you to master complex physical and mathematical intuition without language fatigue. We work directly with your university lecture notes, exercise problem sets, and past exams.",
                      aEs: "Sí. Todas las clases se imparten completamente en español o en inglés según tu preferencia, para que te concentres en comprender la intuición física y matemática sin fatiga lingüística. Trabajamos directamente con los apuntes, guías de ejercicios y exámenes oficiales de tu universidad."
                    },
                    {
                      qEn: "Can we focus directly on past exams and exercise problem sets?",
                      qEs: "¿Podemos enfocarnos directamente en resolver exámenes anteriores y guías de ejercicios?",
                      aEn: "Yes, absolutely. Solving official past exams from your university is the single highest-yield strategy to pass. We dissect actual exam problems step-by-step, identifying grading rubrics, common traps, and time-saving derivation methods.",
                      aEs: "Sí, totalmente. Resolver exámenes oficiales anteriores de tu universidad es la estrategia más eficaz para aprobar. Desglosamos problemas de examen reales paso a paso, identificando los criterios de corrección, trampas frecuentes y métodos directos de resolución."
                    },
                    {
                      qEn: "Can classes be taken in-person in Hannover?",
                      qEs: "¿Se pueden tomar clases presenciales en Hannover?",
                      aEn: "Yes. In-person 1-on-1 sessions are available in Hannover for local students (e.g. from Leibniz Universität Hannover / LUH or nearby universities), coordinated in university library study rooms (such as TIB) or quiet learning spaces.",
                      aEs: "Sí. Ofrezco sesiones presenciales individuales en Hannover para estudiantes locales (ej. de la Leibniz Universität Hannover / LUH o alrededores), coordinadas en salas de estudio de bibliotecas universitarias (como la TIB) o espacios de estudio tranquilos."
                    },
                    {
                      qEn: "How does the 20-minute diagnostic session work?",
                      qEs: "¿En qué consiste la sesión diagnóstica inicial de 20 minutos?",
                      aEn: "We connect via Zoom or Google Meet, review your module syllabus, inspect past exams from your university, identify where you are losing points, and design a concrete schedule to ensure you pass.",
                      aEs: "Nos conectamos por Zoom o Google Meet, revisamos el temario de tu asignatura, examinamos exámenes anteriores, identificamos tus puntos débiles y diseñamos un plan estructurado para asegurar tu aprobado."
                    },
                    {
                      qEn: "What digital equipment and software are used in remote sessions?",
                      qEs: "¿Qué herramientas digitales y equipos utilizas en las clases online?",
                      aEn: "Sessions are conducted on high-resolution Miro interactive whiteboards with an Apple Pencil. We execute live scientific Python code when relevant and export high-resolution vector PDFs of every calculation right after the call.",
                      aEs: "Utilizamos pizarras interactivas Miro en alta resolución combinadas con Apple Pencil. Ejecutamos código Python en vivo cuando la materia lo requiere y enviamos un PDF vectorial de todas las demostraciones al terminar la sesión."
                    },
                    {
                      qEn: "Do you accept barter, skill exchange, or help students facing financial hardship?",
                      qEs: "¿Aceptas trueques, intercambio de habilidades o apoyo a estudiantes con dificultades económicas?",
                      aEn: "Yes, 100%! Open Knowledge means scientific education should be accessible. I gladly accept barter and skill exchanges (such as music production, video games, psychology sessions, design, or languages). And if you are currently in a tough financial situation, write to me with complete confidence and tell me your case — we can definitely work something out with a solidarity arrangement or partial scholarship so you don't miss out on learning.",
                      aEs: "¡Sí, totalmente! El conocimiento abierto implica que la educación debe ser accesible. Acepto pagos mediante trueque e intercambio de valor (como música, videojuegos, sesiones de psicología, diseño u otros talentos). Y si estás pasando por un momento económico difícil, escríbeme con total confianza y cuéntame tu situación: ¡totalmente podemos trabajar en ello y encontrar un acuerdo solidario o beca parcial para que no te quedes sin aprender!"
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 text-sm">
                          {lang === 'en' ? faq.qEn : faq.qEs}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-sky-700 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-sans">
                          {lang === 'en' ? faq.aEn : faq.aEs}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 7: TUTOR PROFILE & CREDENTIALS DOSSIER               */}
        {/* ========================================================= */}
        {currentPage === 'tutor' && (
          <TutorPage
            lang={lang}
            onOpenBooking={() => handleOpenBooking()}
            navigateTo={navigateTo}
          />
        )}

        {/* ========================================================= */}
        {/* PAGE 8: PIAD METHOD™ MANIFESTO & OPEN INQUIRY PEDAGOGY     */}
        {/* ========================================================= */}
        {currentPage === 'piad' && (
          <PIADMethod
            lang={lang}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {/* ========================================================= */}
        {/* PAGE 9: INTERACTIVE 3D ARCADE GAME (PROJECT PHI-FIGHTER) */}
        {/* ========================================================= */}
        {currentPage === 'game' && (
          <PhiFighterGame
            lang={lang}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
          />
        )}
        </Suspense>
        </ErrorBoundary>

      </main>

      {/* --- FOOTER (ACROSS ALL PAGES) --- */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('landing')} className="font-bold text-slate-900 hover:text-sky-700 cursor-pointer">[Φ] DANIEL S. SANTANDER URRUTIA</button>
            <span>•</span>
            <span>{lang === 'en' ? 'Geophysicist &amp; Double M.Sc.' : 'Geofísico y Doble M.Sc.'}</span>
            <span>•</span>
            <a href="tel:+4917676497440" className="hover:text-emerald-700">+49 176 7649 7440</a>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <p>
              © 2026 Daniel S. Santander Urrutia • {lang === 'en' ? 'Taught under the PIAD Method™ Framework (Open & Digital Inquiry)' : 'Enseñanza bajo el marco del Método PIAD™ (Indagación Abierta y Digital)'} • {lang === 'en' ? 'Hannover & Online Worldwide' : 'Hannover y Online en todo el mundo'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdminGate}
              aria-label={lang === 'en' ? 'Internal Console' : 'Consola interna'}
              className="text-[11px] text-slate-300 hover:text-slate-500 transition-colors px-1 cursor-pointer select-none"
            >
              π
            </button>
          </div>
        </div>
      </footer>

      {/* --- DISCREET ADMIN PASSWORD MODAL --- */}
      {isAdminAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAdminAuthOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 text-white font-mono">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                [Φ] Acceso Privado
              </span>
              <button
                type="button"
                onClick={() => setIsAdminAuthOpen(false)}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdminPinSubmit} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  if (adminPinError) setAdminPinError(false);
                }}
                placeholder="••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-lg tracking-[0.4em] text-white focus:outline-none focus:border-sky-500"
              />
              {adminPinError && (
                <p className="text-[11px] text-rose-400 text-center">
                  Clave incorrecta
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: BOOKING & DIAGNOSTIC REQUEST (PROGRAMMED TO EMAIL DANISANTANDER.URRUTIA@GMAIL.COM) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

          <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!modalSubmitted ? (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                    {bookingData.sessionType} • Direct to Daniel S. Santander Urrutia
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {bookingData.sessionType.includes('Spontaneous') 
                      ? (lang === 'en' ? 'Request a Spontaneous 1-on-1 Class' : 'Solicitar Clase Espontánea Urgente')
                      : (lang === 'en' ? 'Schedule University Exam Strategy Session' : 'Agendar Sesión de Estrategia para Examen')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'en'
                      ? 'Submitting generates an immediate notification to danisantander.urrutia@gmail.com and WhatsApp.'
                      : 'Al enviar se generará una notificación inmediata a danisantander.urrutia@gmail.com y por WhatsApp.'}
                  </p>
                </div>

                {modalCourse && (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-sky-300 text-xs font-mono text-sky-900">
                    {lang === 'en' ? 'Selected Subject:' : 'Materia Seleccionada:'} <strong>{modalCourse.code} — {lang === 'en' ? modalCourse.titleEn : modalCourse.titleEs}</strong>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 font-mono text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Full Name *' : 'Nombre Completo *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      placeholder={lang === 'en' ? 'e.g. Mateo Becker' : 'ej. Mateo Becker'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">
                        {lang === 'en' ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="student@university.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">
                        {lang === 'en' ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        placeholder="+49 176..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'University / School *' : 'Universidad o Colegio *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.university}
                      onChange={(e) => setBookingData({ ...bookingData, university: e.target.value })}
                      placeholder={lang === 'en' ? 'e.g. LUH Hannover, TUM, RWTH, TU Berlin' : 'ej. LUH Hannover, TUM, RWTH, TU Berlin'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  {/* Delivery Location Preference */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Format & Location Preference' : 'Preferencia de Formato y Ubicación'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, deliveryMode: 'Online 1-on-1' })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          bookingData.deliveryMode.includes('Online')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        🌐 {lang === 'en' ? 'Online (Miro + Stylus)' : 'Online (Miro + Stylus)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, deliveryMode: 'In-Person (Hannover)' })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          bookingData.deliveryMode.includes('Hannover')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        📍 {lang === 'en' ? 'In-Person (Hannover)' : 'Presencial (Hannover)'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Class Language' : 'Idioma de la Clase'}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: 'English', labelEn: 'English', labelEs: 'Inglés' },
                        { id: 'Español', labelEn: 'Spanish', labelEs: 'Español' },
                        { id: 'Mixed', labelEn: 'Mixed (EN/ES)', labelEs: 'Mixto (ES/EN)' }
                      ].map((lng) => (
                        <button
                          key={lng.id}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, languagePref: lng.id })}
                          className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                            bookingData.languagePref === lng.id
                              ? 'bg-slate-900 border-slate-900 text-white font-bold'
                              : 'bg-slate-50 border-slate-300 text-slate-600'
                          }`}
                        >
                          {lang === 'en' ? lng.labelEn : lng.labelEs}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment / Arrangement Type (Includes Barter & Solidarity Agreement) */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Payment or Arrangement Type' : 'Modalidad de Pago o Acuerdo'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, sessionType: 'Regular Sprint / Standard' })}
                        className={`py-2 px-3 rounded-xl border text-left transition-all ${
                          !bookingData.sessionType.includes('Trueque') && !bookingData.sessionType.includes('Barter')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="text-xs">💳 {lang === 'en' ? 'Standard Tuition / Pack' : 'Tarifa Estándar / Pack'}</div>
                        <div className="text-[10px] opacity-80">{lang === 'en' ? 'Regular payment rate' : 'Pago convencional por hora/pack'}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, sessionType: 'Trueque / Acuerdo Solidario' })}
                        className={`py-2 px-3 rounded-xl border text-left transition-all ${
                          bookingData.sessionType.includes('Trueque') || bookingData.sessionType.includes('Barter')
                            ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="text-xs">🔄 {lang === 'en' ? 'Barter or Solidarity' : 'Trueque o Acuerdo Solidario'}</div>
                        <div className="text-[10px] opacity-80">{lang === 'en' ? 'Skill exchange or financial hardship' : 'Música, juegos, psicología o falta de dinero'}</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Bottleneck / Urgent Topic / Target Date' : 'Dificultad Principal / Tema Urgente / Fecha de Examen'}
                    </label>
                    <textarea
                      rows={2}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      placeholder={
                        lang === 'en'
                          ? "e.g. Exam in 4 weeks, need help with line integrals and Green's theorem proofs..."
                          : 'ej. Examen en 4 semanas, necesito ayuda con integrales de línea y teorema de Green...'
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-sans text-xs focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'en' ? 'Send Request to danisantander.urrutia@gmail.com →' : 'Enviar Solicitud a danisantander.urrutia@gmail.com →'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 font-mono">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-800">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'en' ? 'Email Draft Generated & Prepared!' : '¡Borrador de Correo Generado y Listo!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-sans">
                  {lang === 'en'
                    ? 'Your request has been formulated to danisantander.urrutia@gmail.com. If your email client did not open automatically, click below:'
                    : 'Tu solicitud ha sido formulada para danisantander.urrutia@gmail.com. Si tu cliente de correo no se abrió automáticamente, haz clic abajo:'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  {lastMailtoUrl && (
                    <a
                      href={lastMailtoUrl}
                      className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open in Mail Client' : 'Abrir en Cliente de Correo'}</span>
                    </a>
                  )}

                  <a
                    href={`https://wa.me/4917676497440?text=${encodeURIComponent(`Hi Daniel! I just booked a session for ${bookingData.courseCode || 'Open Knowledge & Science Mentorship'}. My name is ${bookingData.name}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Send on WhatsApp' : 'Enviar por WhatsApp'}</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer"
                  >
                    {lang === 'en' ? 'Close Window' : 'Cerrar Ventana'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
