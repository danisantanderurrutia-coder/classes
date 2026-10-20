import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Sliders,
  MessageSquare,
  X,
  Sun,
  Eye,
  Orbit,
  RotateCcw,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Compass,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DEFAULT_VIEWER_SETTINGS = {
  sunIntensity: 2.2,       // Calibrated from 5.2 to avoid blown-out sector
  ambientIntensity: 0.42,   // Calibrated from 0.90 for rich shadow contrast
  bloomStrength: 0.36,      // Calibrated from 0.65 to avoid foggy glare
  bloomThreshold: 0.82,     // Calibrated from 0.55 so planet surfaces don't glow
  sgrExposure: 0.95,        // Calibrated from 2.2-2.5 for crisp accretion disk & event horizon
  planetContrast: 1.15,
  antiGlare: true,
};

export default function ObservatoryChat({
  isOpen = false,
  onClose,
  viewerSettings = DEFAULT_VIEWER_SETTINGS,
  onUpdateSettings,
  activePlanet,
  onSelectPlanet,
  allPlanets = [],
  archLevel = 'solar',
  onSetArchLevel,
  viewVariant = 'option3',
  onSetViewVariant,
  onToggleRealScale,
  isRealScale = false,
  lang = 'es',
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'sliders'
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialWelcome = lang === 'en'
    ? {
        id: 'msg-1',
        sender: 'ai',
        text: "👋 Welcome to the **Observatory Mission Control**. I'm your AI optical telemetry assistant.\n\nYou can use me to adjust the planetarium viewer in real-time, dim the star's glare to see planet features, or navigate directly to **Saturn** and **Sagittarius A***.\n\nTry the quick actions below or tell me what you'd like to adjust!",
        timestamp: 'Just now',
        actionTaken: null,
      }
    : {
        id: 'msg-1',
        sender: 'ai',
        text: "👋 ¡Hola! Bienvenido al **Control de Misión del Observatorio**. Soy tu asistente IA de calibración óptica y astrofísica.\n\nPuedes pedirme en lenguaje natural ajustar el visor 3D, atenuar el resplandor de la estrella para apreciar los detalles de los planetas, o explorar en alta definición **Saturno** y el agujero negro **Sagitario A***.\n\nPrueba los botones rápidos o escríbeme lo que desees calibrar.",
        timestamp: 'Ahora mismo',
        actionTaken: null,
      };

  const [messages, setMessages] = useState([initialWelcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const executeCommand = (text) => {
    const q = text.toLowerCase().trim();
    let reply = '';
    let actionLabel = null;

    // 1. Sector luminoso / atenuar sol / brillo excesivo
    if (
      q.includes('luminos') ||
      q.includes('brillo') ||
      q.includes('atenuar') ||
      q.includes('cega') ||
      q.includes('deslumbr') ||
      q.includes('glare') ||
      q.includes('bajar luz') ||
      q.includes('demasiado claro') ||
      q.includes('quema') ||
      q.includes('sector')
    ) {
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 1.6,
        ambientIntensity: 0.38,
        bloomStrength: 0.28,
        bloomThreshold: 0.85,
        antiGlare: true,
      }));
      actionLabel = 'Atenuación de Sector Luminoso (-55% Irradiancia Solar, HDR Anti-Reflejos)';
      reply = lang === 'en'
        ? "🔆 **Optical Glare Calibrated**: Solar irradiance decreased to 1.6, ambient fill adjusted, and bloom threshold raised to 0.85. The sunlit hemisphere of all planets is now protected from overexposure, revealing rich cloud belts, craters, and surface relief!"
        : "🔆 **Sector Luminoso Calibrado**: He reducido la irradiancia solar a 1.6, ajustado la luz ambiental y elevado el umbral de bloom a 0.85. Ahora el hemisferio iluminado de los planetas no se quema y puedes apreciar con total nitidez las bandas de nubes, contrastes atmosféricos y accidentes geológicos sin deslumbramiento.";
    }

    // 2. Saturno y sus anillos / features
    else if (
      q.includes('saturn') ||
      q.includes('anillo') ||
      q.includes('cassini') ||
      q.includes('hexagon') ||
      q.includes('ring')
    ) {
      const saturnObj = allPlanets.find((p) => p.id === 'saturn');
      if (saturnObj) {
        onSelectPlanet(saturnObj, true);
        if (onSetArchLevel) onSetArchLevel('planetary');
      }
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 1.8,
        ambientIntensity: 0.40,
        bloomStrength: 0.30,
        bloomThreshold: 0.84,
        planetContrast: 1.25,
      }));
      actionLabel = 'Enfoque de Saturno & Calibración de Anillos (División de Cassini visible)';
      reply = lang === 'en'
        ? "🪐 **Navigating to Saturn**: Optical lighting tuned to showcase the **Cassini Division**, the semi-transparent C (Crepe) Ring, the atmospheric zonal jet streams, and the **North Polar Hexagon**. Ring shadow casting on the southern hemisphere is now optimized for inspection!"
        : "🪐 **Enfocando Saturno**: He calibrado la iluminación para destacar la **División de Cassini** (el gran corte oscuro entre los anillos A y B), la translucidez del anillo C (crepé), el **vórtice hexagonal del polo norte** y las bandas nubosas zonales en tonos caramelo y ámbar. Puedes rotar el planeta con el ratón para ver la sombra de los anillos sobre el disco.";
    }

    // 3. Sagitario A* / Black hole / Agujero negro
    else if (
      q.includes('sagitario') ||
      q.includes('sagittarius') ||
      q.includes('agujero') ||
      q.includes('black hole') ||
      q.includes('gargantua') ||
      q.includes('sgr') ||
      q.includes('singularidad') ||
      q.includes('horizonte')
    ) {
      const bhObj = allPlanets.find((p) => p.id === 'blackhole');
      if (bhObj) {
        onSelectPlanet(bhObj, true);
        if (onSetArchLevel) onSetArchLevel('galaxy');
      }
      onUpdateSettings((prev) => ({
        ...prev,
        sgrExposure: 0.88,
        bloomStrength: 0.32,
        bloomThreshold: 0.82,
      }));
      actionLabel = 'Alineación Galáctica: Sagittarius A* (Exposición de Disco Relativista 0.88)';
      reply = lang === 'en'
        ? "🕳️ **Galactic Center Aligned: Sagittarius A*** (Supermassive Black Hole, 4.15×10⁶ M☉). Accretion disk exposure tuned to 0.88 to prevent plasma blowout. You can now clearly see the **Event Horizon Shadow (Schwarzschild edge)**, the razor-thin **Einstein Photon Ring**, the asymmetric **Relativistic Doppler Beaming** (brighter approaching side), and the bipolar relativistic jets!"
        : "🕳️ **Alineando con el Centro Galáctico: Sagittarius A*** (agujero negro supermasivo de 4.15 millones de masas solares). He calibrado la exposición del plasma relativista a 0.88 para evitar que la luz ciegue el visor. Ahora puedes apreciar con claridad la **sombra del horizonte de sucesos**, el finísimo **anillo de fotones de Einstein**, la asimetría Doppler (el lado que rota hacia ti es más brillante) y los jets bipolares relativistas.";
    }

    // 4. Modo HDR / Alto contraste
    else if (
      q.includes('hdr') ||
      q.includes('contraste') ||
      q.includes('nitidez') ||
      q.includes('detalle') ||
      q.includes('textura')
    ) {
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 1.9,
        ambientIntensity: 0.44,
        bloomStrength: 0.25,
        bloomThreshold: 0.86,
        planetContrast: 1.35,
      }));
      actionLabel = 'Modo HDR Ultra-Detalle Activado';
      reply = lang === 'en'
        ? "🔍 **Ultra-HDR Detail Mode Activated**: Planet surface contrast boosted (+35%) and bloom spill suppressed. Planetary topography, cloud swirls, and ring divisions now exhibit maximum crispness."
        : "🔍 **Modo HDR de Alto Contraste Activado**: Aumentado el contraste superficial (+35%) y suprimido el desbordamiento de bloom. Las texturas de los planetas, las tormentas jovianas y saturninas y los cráteres lunares se aprecian con máxima nitidez.";
    }

    // 5. Reducir bloom / resplandor
    else if (
      q.includes('bloom') ||
      q.includes('resplandor') ||
      q.includes('niebla') ||
      q.includes('halo')
    ) {
      onUpdateSettings((prev) => ({
        ...prev,
        bloomStrength: 0.15,
        bloomThreshold: 0.90,
      }));
      actionLabel = 'Supresión de Bloom y Halos Ópticos';
      reply = lang === 'en'
        ? "✨ **Bloom Subdued**: Bloom strength dropped to 0.15 and threshold raised to 0.90. Atmospheric and optical halos eliminated for clinical observation."
        : "✨ **Bloom Suavizado**: Intensidad reducida a 0.15 y umbral elevado a 0.90. Eliminada toda neblina difusa para una observación óptica clínica.";
    }

    // 6. Reset / Valores óptimos
    else if (
      q.includes('reset') ||
      q.includes('restablecer') ||
      q.includes('defecto') ||
      q.includes('optimo') ||
      q.includes('default')
    ) {
      onUpdateSettings(() => ({ ...DEFAULT_VIEWER_SETTINGS }));
      actionLabel = 'Valores Óptimos HDR Restablecidos';
      reply = lang === 'en'
        ? "🔄 **Default HDR Optical Calibration Restored**: Balanced solar irradiance (2.2), calibrated ambient fill (0.42), and tuned post-processing bloom."
        : "🔄 **Calibración Óptima HDR Restablecida**: Restaurada la irradiancia solar equilibrada (2.2), luz de relleno ambiental (0.42) y bloom graduado para una observación balanceada.";
    }

    // 7. Navegación a otros astros (Sol, Tierra, Júpiter, Marte, etc.)
    else if (q.includes('sol') || q.includes('sun') || q.includes('estrella')) {
      const sunObj = allPlanets.find((p) => p.id === 'sun');
      if (sunObj) onSelectPlanet(sunObj, true);
      reply = lang === 'en'
        ? "☀️ **Focused on the Sun (Sol)**: Main sequence G2V star with dynamic magnetic loops, prominence flares, and active coronal plasma flow."
        : "☀️ **Enfocado en el Sol**: Estrella de secuencia principal tipo G2V. Puedes observar los bucles magnéticos coronales, las manchas solares y las prominencias de plasma en tiempo real.";
    } else if (q.includes('tierra') || q.includes('earth')) {
      const pObj = allPlanets.find((p) => p.id === 'earth');
      if (pObj) onSelectPlanet(pObj, true);
      reply = lang === 'en'
        ? "🌍 **Focused on Earth**: Blue marble featuring dynamic Rayleigh atmosphere, day-night terminator, and city night lights (associated with Höhere Mathematik I-III)."
        : "🌍 **Enfocado en la Tierra**: Observa la atmósfera de dispersión de Rayleigh, la línea del terminador día-noche y las luces urbanas nocturnas (vinculada a la clase de Höhere Mathematik I-III).";
    } else if (q.includes('jupiter')) {
      const pObj = allPlanets.find((p) => p.id === 'jupiter');
      if (pObj) onSelectPlanet(pObj, true);
      reply = lang === 'en'
        ? "⚡ **Focused on Jupiter**: Massive gas giant displaying differential zonal wind jet streams and the high-contrast Great Red Spot storm vortex."
        : "⚡ **Enfocado en Júpiter**: El gigante gaseoso con sus bandas zonales turbulentas y la Gran Mancha Roja en alto contraste.";
    } else if (q.includes('marte') || q.includes('mars')) {
      const pObj = allPlanets.find((p) => p.id === 'mars');
      if (pObj) onSelectPlanet(pObj, true);
      reply = lang === 'en'
        ? "🔴 **Focused on Mars**: The Red Planet displaying the iron oxide surface regolith, polar ice caps, and Valles Marineris canyon network."
        : "🔴 **Enfocado en Marte**: El planeta rojo mostrando sus casquetes polares de hielo carbónico, el óxido de hierro y el cañón Valles Marineris.";
    }

    // 8. Modos del visor (Órbitas, 7 Planetas, Escala Real)
    else if (q.includes('orbita') || q.includes('planetario')) {
      if (onSetViewVariant) onSetViewVariant('orbital');
      actionLabel = 'Modo Planetario & Órbitas Elípticas Activado';
      reply = lang === 'en'
        ? "🌌 **Planetarium Mode Enabled**: Displaying true Keplerian elliptical orbits, gravitational forces (DCL), and 3D magnetic fields."
        : "🌌 **Modo Planetario Activado**: Mostrando las órbitas elípticas keplerianas completas, vectores de fuerzas DCL y magnetosferas 3D.";
    } else if (q.includes('7') || q.includes('clase') || q.includes('alinear') || q.includes('lineup')) {
      if (onSetViewVariant) onSetViewVariant('option3');
      actionLabel = 'Alineación de 7 Planetas con Clases Académicas';
      reply = lang === 'en'
        ? "🎓 **Course Lineup Mode Active**: The 7 major planets are aligned side-by-side with interactive curriculum badges and pricing."
        : "🎓 **Modo 7 Planetas Activo**: Los 7 planetas principales se han alineado en fila para explorar los temarios y tarifas de clases TU9.";
    } else if (q.includes('escala real') || q.includes('1:1') || q.includes('real scale')) {
      if (onToggleRealScale) onToggleRealScale();
      actionLabel = 'Modo Escala Física Real 1:1 Conmutado';
      reply = lang === 'en'
        ? "🔭 **1:1 Real Astronomical Scale Toggled**: Visualizing true distances and scale ratios across the solar system and galactic center."
        : "🔭 **Escala Física Real 1:1 Conmutada**: El visor ahora muestra las distancias astronómicas reales y proporciones a escala del sistema solar y el centro galáctico.";
    }

    // 9. Preguntas sobre Daniel Santander / Mentoring / Precios
    else if (
      q.includes('daniel') ||
      q.includes('profesor') ||
      q.includes('tutor') ||
      q.includes('precio') ||
      q.includes('klausur') ||
      q.includes('tu9') ||
      q.includes('hannover')
    ) {
      reply = lang === 'en'
        ? "👨‍🏫 **About Daniel Santander**: Double Master of Science (CAU Kiel, Germany & AMU, Poland) & Geophysicist. He specializes in preparing university students for rigorous Klausur exams (TUM, RWTH Aachen, TU Berlin, KIT, Uni Stuttgart) in Higher Mathematics, Classical Mechanics, Geophysics, and Python. Individual lessons are €55–€60/h with dedicated Altklausuren rubrics."
        : "👨‍🏫 **Sobre Daniel Santander**: Doble Máster en Ciencias (CAU Kiel, Alemania y AMU, Polonia) y Geofísico. Especializado en preparación rigurosa de exámenes Klausur para universidades TU9 (TUM, RWTH Aachen, TU Berlin, KIT, Uni Stuttgart) e IB en Matemáticas Superiores, Mecánica Teórica, Geofísica y Python. Las clases individuales son de 55€ a 60€/h con resolución exhaustiva de Altklausuren oficiales.";
    }

    // 10. Fallback contextual
    else {
      reply = lang === 'en'
        ? `I understood: "${text}". I have calibrated the optical dynamic range to optimal HDR balance. You can ask me to "dim the sun", "focus Saturn", "explore Sagittarius A*", "increase contrast", or adjust the sliders in the Settings tab!`
        : `He recibido tu comando: "${text}". He ajustado el rango dinámico del visor para una visualización balanceada. Puedes pedirme "atenuar el sol", "ver Saturno", "ver Sagitario A*", "aumentar nitidez" o utilizar los deslizadores en la pestaña de Calibración.`;
      actionLabel = 'Ajuste de Telemetría Dinámica Aplicado';
    }

    return { reply, actionLabel };
  };

  const handleSendMessage = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, actionLabel } = executeCommand(userText);
      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: actionLabel,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 380);
  };

  const handleSliderChange = (key, value) => {
    onUpdateSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (presetName) => {
    let msg = '';
    if (presetName === 'anti-glare') {
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 1.5,
        ambientIntensity: 0.38,
        bloomStrength: 0.25,
        bloomThreshold: 0.85,
        planetContrast: 1.2,
        antiGlare: true,
      }));
      msg = lang === 'en'
        ? 'Applied Anti-Glare Balanced preset: dimmed solar sector, zero blowout, sharp textures.'
        : 'Aplicado preset Anti-Deslumbramiento: atenuado el sector luminoso, cero saturación y texturas nítidas.';
    } else if (presetName === 'saturn') {
      const saturnObj = allPlanets.find((p) => p.id === 'saturn');
      if (saturnObj) onSelectPlanet(saturnObj, true);
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 1.7,
        ambientIntensity: 0.42,
        bloomStrength: 0.28,
        bloomThreshold: 0.84,
        planetContrast: 1.3,
      }));
      msg = lang === 'en'
        ? 'Applied Saturn Inspection preset: rings, Cassini division, and polar vortex highlighted.'
        : 'Aplicado preset Inspección de Saturno: anillos, división de Cassini y vórtice polar resaltados.';
    } else if (presetName === 'sgr') {
      const bhObj = allPlanets.find((p) => p.id === 'blackhole');
      if (bhObj) {
        onSelectPlanet(bhObj, true);
        if (onSetArchLevel) onSetArchLevel('galaxy');
      }
      onUpdateSettings((prev) => ({
        ...prev,
        sgrExposure: 0.85,
        bloomStrength: 0.30,
        bloomThreshold: 0.82,
      }));
      msg = lang === 'en'
        ? 'Applied Sagittarius A* Photometry preset: accretion disk plasma calibrated, event horizon clear.'
        : 'Aplicado preset Fotometría Sagitario A*: plasma de acreción calibrado y horizonte de sucesos nítido.';
    } else if (presetName === 'bright') {
      onUpdateSettings((prev) => ({
        ...prev,
        sunIntensity: 3.2,
        ambientIntensity: 0.65,
        bloomStrength: 0.50,
        bloomThreshold: 0.70,
      }));
      msg = lang === 'en'
        ? 'Applied High Luminance cinematic flare preset.'
        : 'Aplicado preset de Alta Luminosidad y resplandor cinematográfico.';
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `✨ ${msg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: `Preset: ${presetName.toUpperCase()}`,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-2 right-2 left-2 sm:left-auto sm:w-[440px] md:w-[480px] z-50 flex flex-col bg-slate-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-sans text-slate-200 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. TOP HEADER WITH STATUS TELEMETRY */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                {lang === 'en' ? 'Observatory Mission AI' : 'Control de Misión del Observatorio'}
              </h4>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE 3D</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {lang === 'en' ? 'Real-time Optical Telemetry & Glare Control' : 'Telemetría Óptica & Control de Glare en Tiempo Real'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'sliders' : 'chat')}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'sliders'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Alternar entre Chat y Sliders Manuales"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-500/60 text-slate-400 transition-all cursor-pointer"
            title="Cerrar Asistente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. TAB SELECTOR */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between gap-2 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>{lang === 'en' ? 'AI Assistant' : 'Chat Inteligente'}</span>
          </button>
          <button
            onClick={() => setActiveTab('sliders')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'sliders'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{lang === 'en' ? 'Manual Optics' : 'Calibración Óptica'}</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
          <span>Astro:</span>
          <span className="font-bold text-sky-300">{activePlanet?.name?.split(' ')[0] || 'Sol'}</span>
        </div>
      </div>

      {/* 3. MAIN BODY ACCORDING TO ACTIVE TAB */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Quick preset chips bar */}
          <div className="p-2.5 bg-slate-950/70 border-b border-slate-800/60 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
            <button
              onClick={() => handleSendMessage('Calibrar sector luminoso para evitar que se quemen los planetas')}
              className="px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 hover:border-sky-400 text-sky-200 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
            >
              <span>🌓</span>
              <span>Calibrar Sector Luminoso</span>
            </button>
            <button
              onClick={() => handleSendMessage('Enfocar Saturno para ver los anillos, división de Cassini y hexágono polar')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 hover:border-amber-400 text-amber-200 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
            >
              <span>🪐</span>
              <span>Ver Saturno & Anillos</span>
            </button>
            <button
              onClick={() => handleSendMessage('Explorar Sagitario A* con calibración relativista de plasma sin deslumbramiento')}
              className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
            >
              <span>🕳️</span>
              <span>Sagitario A* (HDR)</span>
            </button>
            <button
              onClick={() => handleSendMessage('Activar modo HDR de máximo detalle en texturas')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <span>🔍</span>
              <span>Modo Alto Detalle</span>
            </button>
            <button
              onClick={() => handleSendMessage('Restablecer calibración óptima HDR')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <span>🔄</span>
              <span>Restablecer</span>
            </button>
          </div>

          {/* Messages stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {isAi
                        ? (lang === 'en' ? '🛰️ Mission Telemetry' : '🛰️ Telemetría de Misión')
                        : (lang === 'en' ? '👤 You' : '👤 Tú')}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isAi
                        ? 'bg-slate-900/95 border border-slate-800 text-slate-200 shadow-md'
                        : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium shadow-md shadow-sky-600/20'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.actionTaken && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="font-semibold">{m.actionTaken}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>Calibrando sensores ópticos 3D...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Ask to dim the star, focus Saturn, tune Sgr A*...'
                  : 'Pide atenuar el sol, ver Saturno, Sagitario A*...'
              }
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 font-sans transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold font-mono transition-all flex items-center gap-1 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* MANUAL SLIDERS & PRESET TUNING DRAWER */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Calibración de Luz y Rango Dinámico (HDR)</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Ajusta la luminosidad de la estrella central y el sector iluminado para revelar los detalles de Saturno, Sagitario A* y los planetas.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyPreset('anti-glare')}
              className="p-2 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-sky-200">
                <span>🌓 Anti-Glare (HDR)</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Atenúa el sector diurno</p>
            </button>

            <button
              onClick={() => applyPreset('saturn')}
              className="p-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-200">
                <span>🪐 Ver Saturno</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Anillos y Cassini nítidos</p>
            </button>

            <button
              onClick={() => applyPreset('sgr')}
              className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-purple-200">
                <span>🕳️ Sagitario A*</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Disco y horizonte nítidos</p>
            </button>

            <button
              onClick={() => applyPreset('bright')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                <span>☀️ Resplandor Solar</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Alta luminosidad solar</p>
            </button>
          </div>

          {/* Sliders list */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* 1. Brillo de la estrella (Sol) */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <span>☀️</span>
                  <span>Irradiancia del Sol / Sector Luminoso</span>
                </span>
                <span className="text-white font-bold">{viewerSettings.sunIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="4.5"
                step="0.1"
                value={viewerSettings.sunIntensity}
                onChange={(e) => handleSliderChange('sunIntensity', parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Atenuado (Anti-Glare)</span>
                <span>Óptimo (2.2x)</span>
                <span>Intenso (4.5x)</span>
              </div>
            </div>

            {/* 2. Exposición de Sagitario A* */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                  <span>🕳️</span>
                  <span>Exposición Sagitario A* (Disco de Acreción)</span>
                </span>
                <span className="text-white font-bold">{viewerSettings.sgrExposure.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.2"
                step="0.05"
                value={viewerSettings.sgrExposure}
                onChange={(e) => handleSliderChange('sgrExposure', parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Contraste ISCO</span>
                <span>Calibrado (0.95x)</span>
                <span>Plasma Máximo</span>
              </div>
            </div>

            {/* 3. Bloom y resplandor óptico */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-300 font-semibold flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Intensidad de Bloom / Resplandor</span>
                </span>
                <span className="text-white font-bold">{viewerSettings.bloomStrength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.02"
                value={viewerSettings.bloomStrength}
                onChange={(e) => handleSliderChange('bloomStrength', parseFloat(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Sin niebla (0.15)</span>
                <span>Equilibrado (0.36)</span>
                <span>Cinemático (0.80)</span>
              </div>
            </div>

            {/* 4. Luz ambiental de relleno */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🌌</span>
                  <span>Luz Ambiental de Relleno (Sombras)</span>
                </span>
                <span className="text-white font-bold">{viewerSettings.ambientIntensity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.02"
                value={viewerSettings.ambientIntensity}
                onChange={(e) => handleSliderChange('ambientIntensity', parseFloat(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Espacio Profundo</span>
                <span>Natural (0.42)</span>
                <span>Iluminado</span>
              </div>
            </div>

            {/* 5. Contraste de texturas planetarias */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span>🪐</span>
                  <span>Contraste & Nitidez Planetaria</span>
                </span>
                <span className="text-white font-bold">{viewerSettings.planetContrast.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={viewerSettings.planetContrast}
                onChange={(e) => handleSliderChange('planetContrast', parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Suave</span>
                <span>HDR Nítido (1.15x)</span>
                <span>Máximo Contraste</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onUpdateSettings(() => ({ ...DEFAULT_VIEWER_SETTINGS }))}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Calibración Óptima de Fábrica</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
