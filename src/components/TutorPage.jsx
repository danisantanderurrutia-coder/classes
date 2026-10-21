import React, { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  Code2,
  Compass,
  FileCheck2,
  Atom,
  Layers,
  Award,
  Share2,
  Copy,
  Check,
  Eye
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const TutorPage = ({ lang = 'es', onOpenBooking, navigateTo }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const shareUrl = 'https://danisantanderurrutia-coder.github.io/classes/';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  // Downloadable digital vCard file
  const handleDownloadVCard = () => {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Santander Urrutia;Daniel S.;;;',
      'FN:Daniel S. Santander Urrutia',
      'ORG:Φ Science Mentorship & Hydro-Geophysics',
      'TITLE:Geophysicist & Double M.Sc. Environmental Management',
      'TEL;TYPE=CELL,VOICE,WHATSAPP:+4917676497440',
      'EMAIL;TYPE=INTERNET,PREF:danisantander.urrutia@gmail.com',
      'URL:https://danisantanderurrutia-coder.github.io/portafolio/',
      'ADR;TYPE=WORK:;;Hannover;Lower Saxony;;Germany',
      'NOTE:German Freiberufler • University Physics & Math Mentoring (PIAD Method)',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Daniel_S_Santander_Urrutia_STEM_Tutor.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <button onClick={() => navigateTo('landing')} className="hover:underline cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">
            {lang === 'en' ? 'Tutor Profile & Credentials' : 'Perfil del Tutor & Credenciales'}
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold tracking-wide">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lang === 'en'
                ? 'ACADEMIC PEDIGREE & RESEARCH GROUNDING'
                : 'TRAYECTORIA ACADÉMICA & RIGOR CIENTÍFICO'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'en'
              ? 'Meet Your Mentor: Daniel S. Santander Urrutia'
              : 'Conoce a tu Tutor: Daniel S. Santander Urrutia'}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            {lang === 'en'
              ? 'Geophysicist (FCFM, Universidad de Chile) and Double Master of Science Engineer (CAU Kiel, Germany & AMU Poznań, Poland) based in Hannover. Over 500 hours of 1-on-1 university physics, differential calculus, and IB exam preparation with 100% Spanish or English fluency.'
              : 'Geofísico (FCFM, Universidad de Chile) e Ingeniero Doble Máster en Ciencias Ambientales (CAU Kiel, Alemania y AMU Poznań, Polonia) radicado en Hannover. Más de 500 horas de mentoría 1-a-1 en física universitaria, cálculo diferencial y preparación intensiva para exámenes (Klausuren) e IB.'}
          </p>
        </div>

        {/* ========================================================= */}
        {/* THE DIGITAL BUSINESS CARD HUD (TARJETA DE PRESENTACIÓN)   */}
        {/* ========================================================= */}
        <div className="relative rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Portrait & Live Badges (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div className="relative inline-block">
                {/* Profile Photo Frame */}
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-black p-1 border-2 border-white/40 shadow-2xl overflow-hidden">
                  <img
                    src="./profile.jpg"
                    alt="Daniel S. Santander Urrutia"
                    className="w-full h-full object-cover object-top filter contrast-105"
                  />
                </div>

                {/* Geofrecuencia Brand Icon Badge */}
                <div className="absolute -top-3 -left-3 bg-amber-400 p-2 rounded-xl border-2 border-slate-900 shadow-lg" title="Sello de Investigación Geofísica">
                  <img src="./geofrecuencia_symbol.svg" alt="Geofrecuencia" className="w-5 h-5 text-slate-950" />
                </div>

                {/* Status Beacon */}
                <div className="absolute -bottom-3 -right-2 bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>HANNOVER, DE</span>
                </div>
              </div>

              {/* Identity & Legal Trust Badge */}
              <div className="space-y-1.5">
                <div className="inline-block bg-white text-slate-950 px-3 py-0.5 rounded font-mono font-extrabold text-sm tracking-tight uppercase">
                  DANIEL S. SANTANDER URRUTIA
                </div>
                <div className="text-xs font-mono text-amber-300 font-semibold">
                  Geophysicist (B.Sc.) • Double European M.Sc.
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'en' ? 'Hannover & Online Worldwide' : 'Hannover y Online en todo el mundo'}</span>
                </div>
              </div>

              {/* Official Invoicing Notice */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 space-y-1 w-full max-w-sm">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'en' ? 'Official Invoices in Germany' : 'Facturas Oficiales en Alemania'}</span>
                </div>
                <p className="text-slate-400 leading-snug">
                  {lang === 'en'
                    ? 'Registered independent educator (Freiberufler). Official compliant receipts and invoices provided for all tutoring programs.'
                    : 'Educador independiente registrado en Alemania (Freiberufler). Comprobantes y facturas oficiales para todos los programas.'}
                </p>
              </div>
            </div>

            {/* Right Column: Academic Pedigree & Quick Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Three Official University Degrees */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold block">
                  {lang === 'en' ? 'Verified University Degrees' : 'Títulos Universitarios Oficiales'}
                </span>

                <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
                  {/* Chile */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-0.5">
                      <span>🇨🇱 CHILE (FCFM)</span>
                      <span className="text-amber-300 font-bold">{lang === 'en' ? 'Geophysics Degree' : 'Título en Geofísica'}</span>
                    </div>
                    <div className="text-white font-bold text-sm">Geofísica (Hydro-Geophysics & Earth Science)</div>
                    <div className="text-slate-400 text-[11px]">Universidad de Chile • Facultad de Ciencias Físicas y Matemáticas (Beauchef)</div>
                  </div>

                  {/* Germany */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-0.5">
                      <span>🇩🇪 ALEMANIA (CAU KIEL)</span>
                      <span className="text-emerald-400 font-bold">{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                    </div>
                    <div className="text-white font-bold text-sm">M.Sc. Environmental Management</div>
                    <div className="text-slate-400 text-[11px]">Christian-Albrechts-Universität zu Kiel (Alemania) • Tesis en Dinámica de Gases GEI y Humedales</div>
                  </div>

                  {/* Poland */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-0.5">
                      <span>🇵🇱 POLONIA (AMU POZNAŃ)</span>
                      <span className="text-emerald-400 font-bold">{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                    </div>
                    <div className="text-white font-bold text-sm">M.Sc. Integrated Catchment Management</div>
                    <div className="text-slate-400 text-[11px]">Adam Mickiewicz University (Polonia) • Tesis en Limnología y Gestión Integral de Cuencas</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons of the Business Card */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                
                {/* Download vCard Button */}
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer shadow-md group"
                  title="Guardar contacto en tu teléfono (vCard)"
                >
                  <Download className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
                  <span>{lang === 'en' ? 'Save Contact (vCard)' : 'Guardar Contacto (vCard)'}</span>
                </button>

                {/* WhatsApp Direct */}
                <a
                  href="https://wa.me/4917676497440"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: +49 176 7649 7440</span>
                </a>

                {/* Interactive Portfolio Bridge */}
                <a
                  href="https://danisantanderurrutia-coder.github.io/portafolio/"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Web Portfolio & Research' : 'Portafolio Web de Proyectos'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

                {/* Book Session CTA */}
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'en' ? 'Book Diagnostic Call →' : 'Agendar Sesión Diagnóstica →'}</span>
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* PEDAGOGICAL METHODOLOGY & WHY STUDENTS SUCCEED           */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
              {lang === 'en' ? 'The Mentorship Core' : 'Filosofía Pedagógica'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'en'
                ? 'From Phenomenological Intuition to Exact Exam Proofs'
                : 'De la Intuición Física al Rigor del Examen Universitario'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {lang === 'en'
                ? 'University students rarely struggle because of intellectual limits. They fail because academic lectures often present proofs as dry, abstract equations without grounding their physical meaning. When exam day arrives, professors grade strictly on rigorous, step-by-step mathematical justification.'
                : 'La mayoría de los estudiantes universitarios no reprueban por falta de talento. Se atascan cuando las cátedras presentan los teoremas como fórmulas desconectadas de la intuición física, pero en los exámenes (Klausuren) se exige una justificación matemática rigurosa paso a paso para otorgar puntos parciales.'}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {lang === 'en'
                ? 'Under the PIAD Method™, we reconstruct each principle from first principles, test it on interactive simulators, and practice directly with past exam papers (Altklausuren).'
                : 'Bajo el Método PIAD™, reconstruimos cada principio desde sus fundamentos, lo visualizamos en simuladores numéricos y lo entrenamos directamente sobre exámenes pasados (Altklausuren).'}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center mb-4">
                  01
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'en' ? 'Sensory Physical Intuition' : 'Intuición Física Sensorial'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {lang === 'en'
                    ? 'Free body diagrams (DCL), vector field visualization, and geometric insight before formula manipulation.'
                    : 'Diagramas de cuerpo libre (DCL), visualización de campos vectoriales e intuición geométrica previa a la fórmula.'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center mb-4">
                  02
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'en' ? 'Python Numerical Modeling' : 'Modelación y Python Científico'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {lang === 'en'
                    ? 'Turning ODEs and differential systems into concrete, executable code with NumPy and SciPy.'
                    : 'Transformación de sistemas de EDOs y álgebra lineal en código ejecutable con NumPy, SciPy y visualización.'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-mono text-xs font-bold flex items-center justify-center mb-4">
                  03
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'en' ? 'Partial Credit Maximization' : 'Maximización de Teilpunkte'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {lang === 'en'
                    ? 'Targeted Altklausur drills teaching students how to present proofs so German professors grant maximum points.'
                    : 'Entrenamiento intensivo en Altklausuren para redactar demostraciones y asegurar cada punto parcial del corrector.'}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* RESEARCH PORTFOLIO BRIDGE & VERIFIED SCIENTIFIC EVIDENCE  */}
        {/* ========================================================= */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                {lang === 'en' ? 'Verified Scientific Background' : 'Evidencia Científica & Proyectos Reales'}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {lang === 'en' ? 'Research Grounding & Field Environmental Science' : 'Investigación de Terreno, Cuencas y Políticas Públicas'}
              </h2>
            </div>
            
            <a
              href="https://danisantanderurrutia-coder.github.io/portafolio/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{lang === 'en' ? 'Explore 30+ Projects in Portfolio ↗' : 'Explorar +30 Proyectos en Portafolio ↗'}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Hydro-Geophysics & Soil Resistivity */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-sky-700 uppercase">
                {lang === 'en' ? 'Hydro-Geophysics & Soils (Chile)' : 'Hidrogeofísica & Resistividad (Chile)'}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Vertical Electrical Soundings & Water Balances' : 'Sondeos Eléctricos Verticales & Balances Hídricos'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Field surveys using vertical electrical soundings (VES/SEV), soil resistivity profiling, rain gauges, and watershed balance equations in Maule and central Chile basins (FCFM, Universidad de Chile).'
                  : 'Campañas de terreno con sondeos eléctricos verticales (SEV), resistividad de suelos, redes de pluviómetros y balances hídricos de cuencas en el Maule y Chile central (FCFM, Universidad de Chile).'}
              </p>
            </div>

            {/* Card 2: Peatlands, GHG & Catchments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase">
                {lang === 'en' ? 'Peatland GHG & Catchments (Europe)' : 'Gases GEI & Cuencas (Europa)'}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Eddy Covariance & Rewetted Wetlands' : 'Eddy Covariance & Humedales Rehumedecidos'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Micrometeorological greenhouse gas flux monitoring (CH₄/CO₂) with Eddy Covariance towers in European rewetted peatlands (CAU Kiel, Germany) and limnological lake dynamics (AMU Poznań, Poland).'
                  : 'Monitoreo micrometeorológico de flujos de gases de efecto invernadero (CH₄/CO₂) con torres Eddy Covariance en turberas rehumedecidas (CAU Kiel, Alemania) y dinámica limnológica de lagos (AMU Poznań, Polonia).'}
              </p>
            </div>

            {/* Card 3: International Policy, EPN & Congress */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-indigo-700 uppercase">
                {lang === 'en' ? 'Public Advocacy & Publications' : 'Incidencia Pública & Publicaciones'}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'EPN 2024 Report & National Congress' : 'Informe EPN 2024 & Congreso Nacional'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Lead author of the international Environmental Paper Network (EPN 2024) biomass report; official expert testimony before the Emergency & Disaster Commission at Chile’s Chamber of Deputies in Valparaíso.'
                  : 'Autor principal del informe internacional EPN 2024 sobre biomasa forestal; expositor técnico oficial ante la Comisión de Emergencia y Desastres de la Cámara de Diputadas y Diputados de Chile en el Congreso Nacional en Valparaíso.'}
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* OFFICIAL WEB SOCIAL CARD (SHARING BANNER)                 */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden">
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 blur-[90px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />

          {/* Section Heading */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Official Shareable Social Card' : 'Tarjeta Oficial de Presentación & Difusión'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? 'Digital Social Card & Web Preview' : 'Tarjeta Social Digital & Vista Previa Web'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                {lang === 'en'
                  ? 'Official high-resolution banner generated for instant rich link previews across WhatsApp, LinkedIn, Telegram, and Twitter/X.'
                  : 'Banner oficial en ultra alta resolución optimizado para vistas previas instantáneas al compartir enlaces por WhatsApp, LinkedIn, Telegram y Twitter/X.'}
              </p>
            </div>

            {/* Quick Share Link button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 hover:border-sky-400/50 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
              title="Copy website link to clipboard"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? (lang === 'en' ? 'Link Copied!' : '¡Enlace Copiado!') : (lang === 'en' ? 'Copy Web Link' : 'Copiar Enlace Web')}</span>
            </button>
          </div>

          {/* Web Social Card Showcase */}
          <div className="relative z-10 bg-slate-950/80 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm font-mono">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>{lang === 'en' ? 'Open Graph Banner • 2400 × 1260 px' : 'Banner Open Graph • 2400 × 1260 px'}</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-400/30 font-bold uppercase tracking-wider">
                Ultra HD Retina • 1.91:1 Landscape
              </span>
            </div>

            {/* Image Preview Container */}
            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[1200/630] max-w-4xl mx-auto shadow-2xl">
              <img
                src="./og_banner_preview.jpg"
                alt="Math & Physics Classes • Social Preview Card"
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href="./og_banner_preview.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs font-bold border border-white/20 flex items-center gap-2 hover:bg-slate-900 transition-all"
                >
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'en' ? 'View 2400px Full Resolution ↗' : 'Ver en 2400px Ultra HD ↗'}</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <a
                href="./og_banner_preview.jpg"
                download="Daniel_S_Santander_Urrutia_Social_Card_2400x1260.jpg"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-sky-500/20"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'en' ? 'Download Social Card (JPG)' : 'Descargar Tarjeta Social (JPG)'}</span>
              </a>
              <a
                href="./og_banner_preview.jpg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 transition-all"
                title="Open full resolution in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Open in New Tab' : 'Abrir en Pestaña Nueva'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CALL TO ACTION                                     */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              {lang === 'en'
                ? 'Ready to Prepare Your Next Exam or Master Thesis?'
                : '¿Listo para preparar tu próximo examen o tesis de máster?'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {lang === 'en'
                ? 'Schedule a free 20-minute diagnostic session to review your syllabus, identify exam bottlenecks, and set up your study sprint.'
                : 'Agenda una sesión diagnóstica gratuita de 20 minutos para revisar tu temario, detectar los puntos críticos y definir tu plan de estudio.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenBooking}
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {lang === 'en' ? 'Book Diagnostic Call →' : 'Agendar Diagnóstico →'}
            </button>
            <a
              href="https://wa.me/4917676497440"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all border border-white/20"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
