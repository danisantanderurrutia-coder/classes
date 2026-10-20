import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  History,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Globe,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  Atom,
  Scissors,
  Share2,
  Code2,
  Brain,
  Quote,
  ShieldCheck,
  Orbit,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const HISTORICAL_NODES = [
  {
    id: 'ockham',
    era: 'c. 1320',
    icon: Scissors,
    color: '#38BDF8', // Sky
    epochEn: 'Late Middle Ages • Nominalism',
    epochEs: 'Baja Edad Media • Nominalismo',
    titleEn: 'William of Ockham & Parsimony',
    titleEs: 'Guillermo de Ockham & La Parsimonia',
    figureEn: 'William of Ockham',
    figureEs: 'Guillermo de Ockham',
    corePrincipleEn: "Lex Parsimoniae (Occam's Razor)",
    corePrincipleEs: 'Lex Parsimoniae (La Navaja de Ockham)',
    quoteEn: '"Entities must not be multiplied beyond necessity."',
    quoteEs: '"No deben multiplicarse los entes sin necesidad."',
    epistemicFocusEn: 'Epistemic economy: stripping away ornamental metaphysics and theological scholasticism to preserve only the indispensable axioms.',
    epistemicFocusEs: 'Economía epistemológica: podar la metafísica ornamental y el escolasticismo para conservar únicamente los axiomas indispensables.',
    pedagogicalReflectionEn: 'Students are taught that intellectual depth is not wordiness. In math and physics, true mastery is the ability to state the minimal essential law that governs the phenomenon without redundant variables.',
    pedagogicalReflectionEs: 'Enseñamos que la profundidad conceptual no es verborrea. En ciencias, la maestría real es saber formular la ley mínima que gobierna el fenómeno, descartando el ruido y las variables superfluas.',
    tags: ['Parsimonia', 'Método Analítico', 'Primeros Principios']
  },
  {
    id: 'davinci',
    era: 'c. 1490',
    icon: Eye,
    color: '#F59E0B', // Amber
    epochEn: 'Italian Renaissance • Polymathy',
    epochEs: 'Renacimiento Italiano • Polimatía',
    titleEn: 'Leonardo Da Vinci & The Unified Human',
    titleEs: 'Leonardo Da Vinci & El Ser Humano Completo',
    figureEn: 'Leonardo Da Vinci',
    figureEs: 'Leonardo Da Vinci',
    corePrincipleEn: 'Homo Universalis & Sensory Cognition',
    corePrincipleEs: 'Homo Universalis & Cognición Sensible',
    quoteEn: '"Principles for the development of a complete mind: Study the science of art. Study the art of science. Learn how to see. Realize that everything connects to everything else."',
    quoteEs: '"Principios para desarrollar una mente completa: Estudia la ciencia del arte. Estudia el arte de la ciencia. Aprende a ver. Date cuenta de que todo se conecta con todo."',
    epistemicFocusEn: 'Unification of art, anatomy, hydraulics, and mechanics. The eye and hand as instruments of cognition; sketching not as illustration, but as active inquiry.',
    epistemicFocusEs: 'Unificación de arte, anatomía, hidráulica y mecánica. La mano y el ojo como herramientas cognitivas; el dibujo no como adorno, sino como indagación activa.',
    pedagogicalReflectionEn: 'Before touching equations or screens, the student draws, measures spatial relations, and connects bodily intuition with mechanics. We refuse the false dichotomy between STEM and the arts.',
    pedagogicalReflectionEs: 'Antes de tocar ecuaciones abstractas o pantallas, el estudiante dibuja a mano, estima órdenes de magnitud y conecta la intuición corporal con la física. Rechazamos la falsa división entre ciencias y humanidades.',
    tags: ['Polimatía', 'Observación Fenomenológica', 'Dibujo Analítico']
  },
  {
    id: 'heretics',
    era: '1543 – 1637',
    icon: Orbit,
    color: '#818CF8', // Indigo
    epochEn: 'Scientific Revolution • Heresy & Method',
    epochEs: 'Revolución Científica • Herejía y Método',
    titleEn: 'Copernicus, Vanini, Kepler, Newton & Descartes',
    titleEs: 'Copérnico, Vanini, Kepler, Newton y Descartes',
    figureEn: 'The Free Thinkers & Heretics of the Canon',
    figureEs: 'Los Herejes y Pensadores Libres del Canon',
    corePrincipleEn: 'Methodological Doubt & Direct Observation over Ecclesiastical Authority',
    corePrincipleEs: 'Duda Metódica & Observación Directa frente a la Autoridad Dogmática',
    quoteEn: '"I think, therefore I am... hypotheses non fingo."',
    quoteEs: '"Pienso, luego existo... hypotheses non fingo: las leyes se demuestran empíricamente."',
    epistemicFocusEn: 'Copernicus dislodges human arrogance from the cosmic center. Vanini is burned at the stake for naturalism. Kepler replaces theological perfect circles with empirical ellipses based on Tycho’s telemetry. Newton establishes empirical gravitation and calculus. Descartes establishes systematic radical doubt.',
    epistemicFocusEs: 'Copérnico desplaza el antropocentrismo cosmológico. Vanini muere en la hoguera por su naturalismo radical. Kepler rompe el dogma de los círculos celestes perfectos por elipses basadas en datos reales. Newton funda la gravitación y el cálculo desde la física empírica. Descartes instaura la duda metódica.',
    pedagogicalReflectionEn: 'New knowledge cannot emerge without questioning previous consensuses. We train students to never accept textbook formulas as sacred dogmas: every scientific law must justify its steps.',
    pedagogicalReflectionEs: 'El conocimiento nuevo no surge sin poner en duda los consensos heredados. Entrenamos a los estudiantes para que no acepten las fórmulas como dogmas de fe: toda ley debe justificar sus premisas.',
    tags: ['Heliocentrismo', 'Duda Cartesiana', 'Desobediencia Epistémica']
  },
  {
    id: 'popper-kuhn-feyerabend',
    era: '1934 – 1975',
    icon: Flame,
    color: '#F43F5E', // Rose
    epochEn: '20th Century Epistemology • Crisis & Paradigm Shifts',
    epochEs: 'Epistemología del Siglo XX • Ruptura de Paradigmas',
    titleEn: 'Popper, Kuhn & Feyerabend',
    titleEs: 'Popper, Kuhn y Feyerabend',
    figureEn: 'The Critics of Linear Positivism',
    figureEs: 'Los Críticos del Positivismo Lineal',
    corePrincipleEn: 'Falsification, Paradigm Shifts & Methodological Anarchism',
    corePrincipleEs: 'Falsacionismo, Saltos Paradigmáticos y Anarquismo Metodológico',
    quoteEn: '"The only principle that does not inhibit progress is: anything goes."',
    quoteEs: '"El único principio que no inhibe el progreso es: todo vale."',
    epistemicFocusEn: 'Popper breaks inductivism: science progresses through bold refutation, not confirmation. Kuhn reveals science as historical revolutions and incommensurable paradigms. Feyerabend demonstrates that rigid methodological rules obstruct true discovery ("Against Method").',
    epistemicFocusEs: 'Popper rompe el inductivismo: la ciencia avanza por refutación audaz, no por acumulación acrítica. Kuhn demuestra que la ciencia evoluciona por crisis y revoluciones paradigmáticas. Feyerabend demuestra que las reglas metodológicas fijas bloquean la innovación ("Tratado contra el método").',
    pedagogicalReflectionEn: 'Science is historical, contingent, and alive. In the lab, students learn to test edge cases where standard models fail, embracing heuristic freedom rather than following rigid recipe-book exercises.',
    pedagogicalReflectionEs: 'La ciencia es histórica, contingente y viva. En el laboratorio, el estudiante busca casos límite donde los modelos habituales fallan, usando la libertad heurística en lugar de seguir recetas mecánicas de manual.',
    tags: ['Falsacionismo', 'Revoluciones de Kuhn', 'Anarquismo Metodológico']
  },
  {
    id: 'kripke-phenomenology',
    era: '1970 – 1980',
    icon: Brain,
    color: '#C084FC', // Purple
    epochEn: 'Analytic Metaphysics & Subjective Experience',
    epochEs: 'Metafísica Analítica & Experiencia Subjetiva',
    titleEn: 'Kripkean Modal Semantics & Phenomenology',
    titleEs: 'Semántica Modal de Kripke & Fenomenología',
    figureEn: 'Saul Kripke, Edmund Husserl & Maurice Merleau-Ponty',
    figureEs: 'Saul Kripke, Edmund Husserl y Maurice Merleau-Ponty',
    corePrincipleEn: 'Possible Worlds (Modal Logic) & Lived Phenomenological Perception',
    corePrincipleEs: 'Mundos Posibles (Lógica Modal) & Percepción Fenomenológica Vivida',
    quoteEn: '"A rigid designator designates the same object in all possible worlds... and consciousness is the measuring instrument."',
    quoteEs: '"Un designador rígido designa el mismo objeto en todos los mundos posibles... y la consciencia es el instrumento medidor."',
    epistemicFocusEn: 'Kripke formalizes necessity vs. contingency: distinguishing a priori analytic truths from empirical a posteriori necessities (e.g. Water = H2O). Merleau-Ponty reinstates the living body and subjective consciousness as the primary instrument of physical observation.',
    epistemicFocusEs: 'Kripke formaliza la distinción entre lo necesario (□) y lo contingente (◇): separa lo analítico a priori de lo necesario a posteriori (ej. Agua = H2O). Merleau-Ponty recupera el cuerpo vivido y la experiencia sentida como instrumento primario de medición del mundo.',
    pedagogicalReflectionEn: 'Students learn to think modally: exploring "possible worlds" through computational simulations (what if gravity changed? what if air resistance were non-linear?), while grounding all reasoning in felt phenomenological reality.',
    pedagogicalReflectionEs: 'El alumno aprende a razonar modalmente: simular "mundos posibles" en la computadora (¿qué pasaría si la gravedad dependiera de la distancia al cubo?), manteniendo anclado el raciocinio a la vivencia fenomenológica.',
    tags: ['Lógica Modal', 'Mundos Posibles', 'Fenomenología Corpórea']
  },
  {
    id: 'freire-elbakyan',
    era: '1968 – Present',
    icon: BookOpen,
    color: '#34D399', // Emerald
    epochEn: 'Critical Pedagogy & Radical Open Knowledge',
    epochEs: 'Pedagogía Crítica & Conocimiento Abierto',
    titleEn: 'Paulo Freire & Alexandra Elbakyan',
    titleEs: 'Paulo Freire y Alexandra Elbakyan',
    figureEn: 'Emancipators of the Word & Open Science',
    figureEs: 'Emancipadores de la Palabra y la Ciencia Abierta',
    corePrincipleEn: 'Overcoming Banking Education & Demolishing Paywalls to Knowledge',
    corePrincipleEs: 'Superación de la Educación Bancaria & Demolición de Peajes Cognitivos',
    quoteEn: '"No one educates anyone else, no one educates oneself alone; humans educate each other in community, mediated by the world."',
    quoteEs: '"Nadie educa a nadie, nadie se educa a sí mismo; las personas se educan entre sí con la mediación del mundo."',
    epistemicFocusEn: 'Freire\'s "Pedagogy of the Oppressed" demolishes the banking concept of education where teachers deposit pre-packaged data into passive minds. Alexandra Elbakyan creates Sci-Hub to dismantle private corporate paywalls, establishing that scientific research is a universal human right.',
    epistemicFocusEs: 'La "Pedagogía del Oprimido" de Freire demuele la educación bancaria donde el docente deposita datos en mentes pasivas. Alexandra Elbakyan crea Sci-Hub para derribar los muros de pago corporativos, defendiendo que la ciencia pertenece a toda la humanidad.',
    pedagogicalReflectionEn: 'The classroom is not a transaction; it is a shared investigative workshop. The student’s deliverables are made open-source (Miro vectors, Python scripts, open formulas) so knowledge circulates freely rather than sitting in a grade book.',
    pedagogicalReflectionEs: 'El aula no es una transacción mercantil; es un taller de investigación compartida. Lo que el alumno produce se construye con licencias abiertas y código libre, asegurando la soberanía y libre circulación del saber.',
    tags: ['Pedagogía del Oprimido', 'Sci-Hub', 'Soberanía del Saber']
  },
  {
    id: 'ai-era',
    era: 'Current Era',
    icon: Sparkles,
    color: '#22D3EE', // Cyan
    epochEn: 'Computational Synthesis • The AI Horizon',
    epochEs: 'Síntesis Computacional • El Horizonte de la IA',
    titleEn: 'The PIAD Horizon: Productive AI & Democratization of Code',
    titleEs: 'El Horizonte PIAD: IA Productiva y Democratización del Código',
    figureEn: 'The Sovereign Student in the Digital Age',
    figureEs: 'El Estudiante Soberano en la Era Digital',
    corePrincipleEn: 'Democratizing Programming & Transforming the Algorithmic Oracle into a Thinking Canvas',
    corePrincipleEs: 'Democratizar la Programación y Convertir el Oráculo Algorítmico en Lienzo de Indagación',
    quoteEn: '"We know students will use AI daily. Our purpose is for them to use it productively: to explore, design code, and bring historical difficulties to hand through simple, deep inquiry."',
    quoteEs: '"Sabemos que los estudiantes usarán la IA sí o sí. Nuestro propósito es que la ocupen de modo productivo: para explorar, diseñar código propio y acercar las dificultades del pasado a su manejo mediante ejercicios simples que profundicen el aprendizaje."',
    epistemicFocusEn: 'Convergence of 700 years of critical epistemology. Facing the contemporary risk of cognitive outsourcing to language models, PIAD positions AI as a high-leverage tool to design scientific code (NumPy, SciPy) and simulate physical dynamics.',
    epistemicFocusEs: 'Convergencia de 700 años de epistemología crítica. Frente al riesgo contemporáneo de delegar el pensamiento en modelos opacos, PIAD posiciona a la IA como una palanca para diseñar código científico (NumPy, SciPy) y simular dinámicas físicas.',
    pedagogicalReflectionEn: 'Democratizing programming: complex mathematical modeling and numerical calculus, which once required months of bureaucratic coding, are now accessible to every student as intuitive, runnable experiments.',
    pedagogicalReflectionEs: 'Democratizar la programación: modelos matemáticos complejos y cálculo diferencial, que antes tomaban meses de barreras técnicas, ahora están al alcance de cualquier estudiante mediante experimentos ejecutables.',
    tags: ['Democratización del Código', 'Python Científico', 'Criterio Autónomo']
  }
];

export default function EpistemicTimeline({ lang = 'es', onNavigate }) {
  const [selectedId, setSelectedId] = useState('davinci');
  const scrollContainerRef = useRef(null);
  const nodeRefs = useRef({});

  const currentIndex = HISTORICAL_NODES.findIndex((n) => n.id === selectedId);
  const activeNode = HISTORICAL_NODES[currentIndex >= 0 ? currentIndex : 0];

  const handleSelectNode = (id) => {
    setSelectedId(id);
    if (nodeRefs.current[id] && scrollContainerRef.current) {
      nodeRefs.current[id].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelectNode(HISTORICAL_NODES[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < HISTORICAL_NODES.length - 1) {
      handleSelectNode(HISTORICAL_NODES[currentIndex + 1].id);
    }
  };

  // Progress percentage across the 7 milestones
  const progressPercent = (currentIndex / (HISTORICAL_NODES.length - 1)) * 100;

  return (
    <div className="py-12 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold mb-3">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'en' ? 'HISTORICAL EPISTEMOLOGY & PHILOSOPHY' : 'GENEALOGÍA HISTÓRICA & FILOSOFÍA DEL PROYECTO'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            {lang === 'en'
              ? 'From Medieval Nominalism to the AI Era: The Intellectual Roots'
              : 'Del Nominalismo Medieval a la Era de la IA: Las Raíces Teóricas'}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            {lang === 'en'
              ? 'This project does not originate as a commercial teaching gadget. It is the continuation of a long historical battle for intellectual sovereignty, empirical observation, parsimony, and the democratization of knowledge.'
              : 'Este proyecto no nace como un producto comercial o una receta empaquetada. Es la continuación de una progresión histórica de siglos: la lucha por la soberanía del criterio, la observación empírica, la parsimonia y la democratización del saber.'}
          </p>
        </div>

        {/* ==================================================================== */}
        {/* TIMELINE CONTROL & CHRONOLOGICAL INDICATOR BAR                       */}
        {/* ==================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-sky-400">
              {lang === 'en' ? 'CHRONOLOGICAL TIMELINE' : 'LÍNEA DE TIEMPO CRONOLÓGICA'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              {lang === 'en' ? 'c. 1320 CE ➔ 21st Century' : 'c. 1320 d.C. ➔ Siglo XXI'}
            </span>
          </div>

          {/* Stepper Controls: Previous / Next milestone */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2 hidden sm:inline">
              {lang === 'en'
                ? `Milestone ${currentIndex + 1} of ${HISTORICAL_NODES.length}`
                : `Hito ${currentIndex + 1} de ${HISTORICAL_NODES.length}`}
            </span>

            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1 transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-950/40'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer shadow-xs'
              }`}
              title={lang === 'en' ? 'Previous milestone' : 'Hito anterior'}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Prev' : 'Anterior'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === HISTORICAL_NODES.length - 1}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1 transition-all ${
                currentIndex === HISTORICAL_NODES.length - 1
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-950/40'
                  : 'border-sky-500/50 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-white cursor-pointer shadow-xs'
              }`}
              title={lang === 'en' ? 'Next milestone' : 'Hito siguiente'}
            >
              <span className="hidden sm:inline">{lang === 'en' ? 'Next' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TRUE VISUAL TIMELINE TRACK (LÍNEA DE TIEMPO CON EJE, HITOS Y CONECTORES) */}
        {/* ==================================================================== */}
        <div
          ref={scrollContainerRef}
          className="mb-8 p-5 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto"
        >
          <div className="relative min-w-[880px] lg:min-w-full pb-2 pt-1">
            
            {/* 1. CONTINUOUS HORIZONTAL AXIS RAIL (LA LÍNEA DE TIEMPO CENTRAL) */}
            <div className="absolute top-[64px] left-[5%] right-[5%] h-1.5 bg-slate-800/90 rounded-full z-0">
              {/* Illuminated progress bar tracking selected position */}
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-sky-400/50"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Chronological Arrow at the future end */}
              <div className="absolute -right-3 -top-[5px] text-slate-600 text-xs font-mono font-bold select-none">
                ▶
              </div>
            </div>

            {/* 2. NODES GRID (DISTRIBUTED EVENLY ACROSS THE AXIS) */}
            <div className="grid grid-cols-7 gap-3 relative z-10">
              {HISTORICAL_NODES.map((node, index) => {
                const isSelected = node.id === selectedId;
                const isPast = index < currentIndex;
                const NodeIcon = node.icon || History;

                return (
                  <div
                    key={node.id}
                    ref={(el) => (nodeRefs.current[node.id] = el)}
                    className="flex flex-col items-center"
                  >
                    {/* ERA / DATE PILL (TOP OF NODE) */}
                    <button
                      onClick={() => handleSelectNode(node.id)}
                      className={`mb-2 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30 ring-2 ring-sky-300/80 scale-105'
                          : isPast
                            ? 'bg-slate-800 text-sky-300 border border-slate-700 hover:bg-slate-700'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {node.era}
                    </button>

                    {/* VERTICAL TICK CONNECTING DATE PILL TO CENTRAL NODE */}
                    <div
                      className={`w-0.5 h-2 transition-colors ${
                        isSelected ? 'bg-sky-400' : isPast ? 'bg-indigo-500/70' : 'bg-slate-800'
                      }`}
                    />

                    {/* CENTRAL CIRCULAR NODE ON THE TIMELINE RAIL */}
                    <button
                      onClick={() => handleSelectNode(node.id)}
                      aria-label={`${node.era}: ${lang === 'en' ? node.figureEn : node.figureEs}`}
                      className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'w-11 h-11 bg-slate-950 border-2 border-sky-400 shadow-xl shadow-sky-500/50 ring-4 ring-sky-500/20 scale-110 z-20'
                          : isPast
                            ? 'w-9 h-9 bg-slate-900 border-2 border-indigo-500 hover:border-sky-400 hover:scale-105 z-10'
                            : 'w-9 h-9 bg-slate-900 border-2 border-slate-700 hover:border-slate-500 hover:scale-105 z-10'
                      }`}
                    >
                      <NodeIcon
                        className={`transition-all ${
                          isSelected
                            ? 'w-5 h-5 text-sky-400 animate-pulse'
                            : isPast
                              ? 'w-4 h-4 text-indigo-400'
                              : 'w-4 h-4 text-slate-500'
                        }`}
                      />
                      {isSelected && (
                        <span className="absolute -inset-1 rounded-full border border-sky-400/60 animate-ping opacity-30" />
                      )}
                    </button>

                    {/* VERTICAL STEM CONNECTING CENTRAL NODE TO SUMMARY CARD */}
                    <div
                      className={`w-0.5 h-3 transition-colors ${
                        isSelected ? 'bg-sky-400' : isPast ? 'bg-indigo-500/70' : 'bg-slate-800'
                      }`}
                    />

                    {/* MILESTONE SUMMARY CARD (ANCHORED UNDER THE TIMELINE) */}
                    <button
                      onClick={() => handleSelectNode(node.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-gradient-to-b from-slate-900 to-indigo-950/70 border-sky-400 text-white shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40 scale-[1.02]'
                          : isPast
                            ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-850'
                            : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Little upward pointer arrow when selected */}
                      {isSelected && (
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-sky-400 rotate-45" />
                      )}

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono text-slate-500">
                          #{index + 1}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {lang === 'en' ? 'Active' : 'Activo'}
                          </span>
                        )}
                      </div>

                      <strong className="text-xs font-bold text-white block line-clamp-1 leading-snug">
                        {lang === 'en' ? node.figureEn : node.figureEs}
                      </strong>
                      <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5 font-sans">
                        {lang === 'en' ? node.corePrincipleEn : node.corePrincipleEs}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* ACTIVE MILESTONE DEEP-DIVE CARD                                      */}
        {/* ==================================================================== */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Subtle top indicator connecting timeline to this dossier */}
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white border border-white/20 shadow-sm shrink-0"
                style={{ backgroundColor: activeNode.color || '#38BDF8' }}
              >
                {React.createElement(activeNode.icon || History, { className: 'w-4 h-4 text-slate-950' })}
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  {lang === 'en'
                    ? `HISTORICAL MILESTONE #${currentIndex + 1} OF ${HISTORICAL_NODES.length}`
                    : `HITO HISTÓRICO #${currentIndex + 1} DE ${HISTORICAL_NODES.length}`}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-300">
                    {activeNode.era}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-300">
                    {lang === 'en' ? activeNode.epochEn : activeNode.epochEs}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={lang === 'en' ? 'Previous' : 'Anterior'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === HISTORICAL_NODES.length - 1}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={lang === 'en' ? 'Next' : 'Siguiente'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Historical Context & Philosophical Principle */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? activeNode.titleEn : activeNode.titleEs}
              </h3>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 shadow-inner">
                <Quote className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <p className="italic text-slate-200 text-xs sm:text-sm font-serif leading-relaxed">
                  {lang === 'en' ? activeNode.quoteEn : activeNode.quoteEs}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold block">
                  {lang === 'en' ? 'The Historical Rupture' : 'La Ruptura Epistemológica'}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {lang === 'en' ? activeNode.epistemicFocusEn : activeNode.epistemicFocusEs}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activeNode.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Connection to the Project's Philosophy Today */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'en' ? 'Philosophical Grounding in the Project' : 'Cómo se Encarna en la Filosofía del Proyecto'}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {lang === 'en' ? activeNode.pedagogicalReflectionEn : activeNode.pedagogicalReflectionEs}
              </p>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                  {lang === 'en' ? 'Explore in Practice:' : 'Explorar en la Práctica:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate('lab')}
                    className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Open Physics Lab' : 'Abrir Simulador'}</span>
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('courses')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Course Syllabi' : 'Catálogo de Temarios'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Stepper Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              {currentIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-sky-400" />
                  <span>
                    {lang === 'en'
                      ? `Previous: ${HISTORICAL_NODES[currentIndex - 1].figureEn}`
                      : `Anterior: ${HISTORICAL_NODES[currentIndex - 1].figureEs}`}
                  </span>
                </button>
              ) : (
                <span className="text-slate-600">
                  {lang === 'en' ? 'Start of timeline' : 'Inicio de la línea temporal'}
                </span>
              )}
            </div>

            <div>
              {currentIndex < HISTORICAL_NODES.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="text-sky-300 hover:text-white flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
                >
                  <span>
                    {lang === 'en'
                      ? `Next: ${HISTORICAL_NODES[currentIndex + 1].figureEn}`
                      : `Siguiente: ${HISTORICAL_NODES[currentIndex + 1].figureEs}`}
                  </span>
                  <ChevronRight className="w-4 h-4 text-sky-400" />
                </button>
              ) : (
                <span className="text-emerald-400 font-bold">
                  {lang === 'en' ? 'Present Era (PIAD Horizon)' : 'Era Presente (Horizonte PIAD)'}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
