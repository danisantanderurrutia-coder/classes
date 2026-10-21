import React, { useState, useRef } from 'react';
import {
  Gamepad2,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Zap,
  Atom,
  HelpCircle,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Cpu,
  Orbit,
  Compass,
  Rocket
} from 'lucide-react';

const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const clean = url.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
};

export default function PhiFighterGame({ lang = 'es', onNavigate, onOpenBooking }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const gameContainerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err.message);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const openStandalone = () => {
    window.open(getAssetUrl('/phi-fighter/index.html'), '_blank', 'noopener,noreferrer');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      lang === 'en'
        ? 'Hi Daniel! I played Project Phi-Fighter on your site and would like to ask about 1-on-1 Physics / Math / Programming mentorship (Classes).'
        : '¡Hola Daniel! Estuve jugando Project Phi-Fighter en tu web y me gustaría consultar por clases particulares de Física / Matemáticas / Programación (Classes).'
    );
    window.open(`https://wa.me/4917676497440?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-20 text-white min-h-screen bg-slate-950 relative overflow-hidden">
      
      {/* Celestial Ambient Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.08),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button 
            onClick={() => onNavigate && onNavigate('landing')} 
            className="hover:text-amber-400 hover:underline transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Arcade Game' : 'Juego Arcade 3D'}
          </span>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'INTERACTIVE 3D STEM LAB' : 'SIMULADOR EDUCATIVO INTERACTIVO'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">60 FPS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-white flex items-center gap-3">
              <span className="text-amber-400">PROJECT</span> PHI-FIGHTER
            </h1>
            
            <p className="text-slate-300 font-sans text-sm sm:text-base max-w-3xl leading-relaxed">
              {lang === 'en'
                ? 'Relativistic 3D space flight simulator written from scratch in procedural Three.js. Pilot through 10 Celestial Sectors from the Sun to the supermassive black hole Sagittarius A*, testing real-time gravitational force vectors, orbital mechanics, and customizable starfighters.'
                : 'Simulador de vuelo espacial 3D desarrollado desde cero en Three.js procedural. Pilota a través de 10 Sectores Celestiales desde el Sol hasta el agujero negro supermasivo Sagitario A*, experimentando vectores gravitacionales en tiempo real, mecánicas orbitales y cazas desbloqueables.'}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-400 flex items-center gap-1.5">
              <Orbit className="w-3 h-3 text-sky-400" /> 10 Solar Sectors
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> Web Audio Synthesis
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-emerald-400" /> Ultra-Light (263 KB)
            </span>
          </div>
        </div>

        {/* Action Bar (Above the Screen) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-mono text-xs text-slate-300 font-medium">
              {lang === 'en' ? 'Simulator Active' : 'Simulador Activo'}
            </span>
          </div>

          {/* Toolbar Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'Controls' : 'Controles'}</span>
              {showControls ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handleReload}
              title={lang === 'en' ? 'Reload Simulator' : 'Reiniciar Simulador'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-emerald-400" /> : <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isFullscreen ? (lang === 'en' ? 'Exit Fullscreen' : 'Salir') : (lang === 'en' ? 'Fullscreen' : 'Pantalla Completa')}</span>
            </button>

            <button
              onClick={openStandalone}
              className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-mono font-semibold border border-amber-400/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'New Tab' : 'Abrir Aparte'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Flight Controls Drawer */}
        {showControls && (
          <div className="bg-slate-900/95 border border-amber-400/30 rounded-xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono backdrop-blur-xl animate-in fade-in duration-200 shadow-xl shadow-amber-500/5">
            <div className="space-y-1">
              <span className="text-amber-400 font-bold block">{lang === 'en' ? 'FLIGHT STICK' : 'MANIOBRAS'}</span>
              <div className="text-slate-300 space-y-0.5">
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">W / S</kbd> : Pitch (Cabeceo)</div>
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">A / D</kbd> : Roll & Yaw (Giro)</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-amber-400 font-bold block">{lang === 'en' ? 'WEAPONS' : 'ARMAMENTO'}</span>
              <div className="text-slate-300 space-y-0.5">
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">SPACE</kbd> : Twin Lasers</div>
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">X / F</kbd> : Homing Missile</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-amber-400 font-bold block">{lang === 'en' ? 'TACTICAL AVIONICS' : 'AVIÓNICA'}</span>
              <div className="text-slate-300 space-y-0.5">
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">V</kbd> : Toggle Force Vectors</div>
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">C</kbd> : Cockpit / Chase View</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-amber-400 font-bold block">{lang === 'en' ? 'DIFFICULTY & SOUND' : 'CONFIGURACIÓN'}</span>
              <div className="text-slate-300 space-y-0.5">
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">T</kbd> : Cadet / Pilot / Ace</div>
                <div><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">M</kbd> : Audio / Synth Mode</div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Game Iframe Container */}
        <div 
          ref={gameContainerRef}
          className="w-full bg-black rounded-2xl border-2 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden relative group transition-all"
          style={{ height: '720px', minHeight: '520px', maxHeight: '85vh' }}
        >
          <iframe
            key={iframeKey}
            src={getAssetUrl('/phi-fighter/index.html')}
            className="w-full h-full border-0 block"
            title="Project Phi-Fighter 3D Game"
            allow="autoplay; fullscreen"
          />
        </div>

        {/* Educational Physics Showcase */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Atom className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
              {lang === 'en' ? 'Physics & Engineering Behind the Simulation' : 'Principios de Física e Ingeniería Demostrados'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-sky-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5" /> 1. Gravitación Orbital
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Simulates Newton\'s Law of Universal Gravitation Fg = G·(M·m)/r² in real time with dynamic screen-space force vectors and orbital banking.'
                  : 'Modela la Ley de Gravitación Universal Fg = G·(M·m)/r² en tiempo real con vectores visuales de fuerza centrípeta, empuje y velocidad neta.'}
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-rose-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> 2. Relatividad General
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Sector 10 models the Schwarzschild radius rs = 2GM/c², gravitational time dilation Δt\' = Δt√(1 - rs/r), and tidal spaghettification near Sagittarius A*.'
                  : 'El Sector 10 simula el radio de Schwarzschild rs = 2GM/c², dilatación temporal por gravedad y fuerzas de marea extremas cerca de Sagitario A*.'}
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> 3. Algoritmos Numéricos
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {lang === 'en'
                  ? '60 FPS Euler-Cromer and Runge-Kutta step integration powering homing missile pursuit trajectories and particle dispersion.'
                  : 'Integración numérica Euler-Cromer a 60 FPS para trayectorias de misiles guiados por radar, colisiones elásticas y campos de debris.'}
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 4. Síntesis Web Audio
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {lang === 'en'
                  ? 'Zero downloaded audio files: real-time procedural frequency oscillators generating punk rock riffs, ion turbine hums, and explosions.'
                  : 'Cero archivos de audio descargados: sintetizadores en tiempo real con Web Audio API que generan música punk, láseres y turbinas iónicas.'}
              </p>
            </div>
          </div>

          {/* Tutoring CTA Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-sky-500/15 border border-amber-400/40 rounded-xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-mono text-lg sm:text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span>🎓</span>
                <span>{lang === 'en' ? 'Want to Code 3D Physics Simulations Like This?' : '¿Quieres Aprender a Programar Simulaciones Como Esta?'}</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                {lang === 'en'
                  ? 'Learn 3D computational physics, numerical methods, Python/JS game engines, or master university physics and calculus with personalized mentorship from Daniel Santander (Classes).'
                  : 'Aprende física computacional 3D, métodos numéricos, motores en JavaScript/Python o supera tus asignaturas universitarias de Física y Cálculo con mentoría personalizada de Daniel Santander (Classes).'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={openWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+49 176 76497440)</span>
              </button>

              <button
                onClick={() => onOpenBooking && onOpenBooking()}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{lang === 'en' ? 'Book Mentorship' : 'Reservar Clase'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
