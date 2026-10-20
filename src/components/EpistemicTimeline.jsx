import React, { useState } from 'react';
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
  Eye,
  Atom,
  Scissors,
  Share2,
  Code2,
  Brain,
  Quote,
  ShieldCheck
} from 'lucide-react';

export const HISTORICAL_NODES = [
  {
    id: 'ockham',
    era: 'c. 1320',
    epochEn: 'Late Middle Ages • Nominalism',
    epochEs: 'Baja Edad Media • Nominalismo',
    titleEn: 'William of Ockham & Parsimony',
    titleEs: 'Guillermo de Ockham & La Parsimonia',
    figureEn: 'William of Ockham',
    figureEs: 'Guillermo de Ockham',
    corePrincipleEn: 'Lex Parsimoniae (Occam\'s Razor)',
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
    epochEn: 'Scientific Revolution • Heresy & Method',
    epochEs: 'Revolución Científica • Herejía y Método',
    titleEn: 'Copernicus, Vanini, Kepler, Galileo & Descartes',
    titleEs: 'Copérnico, Vanini, Kepler, Galileo y Descartes',
    figureEn: 'The Free Thinkers & Heretics of the Canon',
    figureEs: 'Los Herejes y Pensadores Libres del Canon',
    corePrincipleEn: 'Methodological Doubt & Direct Observation over Ecclesiastical Authority',
    corePrincipleEs: 'Duda Metódica & Observación Directa frente a la Autoridad Dogmática',
    quoteEn: '"I think, therefore I am... and yet it moves."',
    quoteEs: '"Pienso, luego existo... y sin embargo, se mueve."',
    epistemicFocusEn: 'Copernicus dislodges human arrogance from the cosmic center. Vanini is burned at the stake for naturalism. Kepler replaces theological perfect circles with empirical ellipses based on Tycho’s telemetry. Galileo points the telescope to Jupiter. Descartes establishes systematic radical doubt.',
    epistemicFocusEs: 'Copérnico desplaza el antropocentrismo cosmológico. Vanini muere en la hoguera por su naturalismo radical. Kepler rompe el dogma de los círculos celestes perfectos por elipses basadas en datos reales. Galileo mira por el telescopio. Descartes instaura la duda metódica.',
    pedagogicalReflectionEn: 'New knowledge cannot emerge without questioning previous consensuses. We train students to never accept textbook formulas as sacred dogmas: every scientific law must justify its steps.',
    pedagogicalReflectionEs: 'El conocimiento nuevo no surge sin poner en duda los consensos heredados. Entrenamos a los estudiantes para que no acepten las fórmulas como dogmas de fe: toda ley debe justificar sus premisas.',
    tags: ['Heliocentrismo', 'Duda Cartesiana', 'Desobediencia Epistémica']
  },
  {
    id: 'popper-kuhn-feyerabend',
    era: '1934 – 1975',
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

  const activeNode = HISTORICAL_NODES.find((n) => n.id === selectedId) || HISTORICAL_NODES[0];

  return (
    <div className="py-12 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
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

        {/* Horizontal Timeline Scroller */}
        <div className="mb-10 pb-4 overflow-x-auto border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-[780px]">
            {HISTORICAL_NODES.map((node, index) => {
              const isSelected = node.id === selectedId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className={`px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shrink-0 w-48 ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-[1.02]'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {node.era}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">#{index + 1}</span>
                  </div>
                  <strong className="text-xs font-bold text-white block line-clamp-1 leading-snug">
                    {lang === 'en' ? node.figureEn : node.figureEs}
                  </strong>
                  <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5 font-sans">
                    {lang === 'en' ? node.corePrincipleEn : node.corePrincipleEs}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded Deep-Dive Historical Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-inner">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Historical Context & Philosophical Principle */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  {activeNode.era}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {lang === 'en' ? activeNode.epochEn : activeNode.epochEs}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? activeNode.titleEn : activeNode.titleEs}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
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
                  <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Connection to the Project's Philosophy Today */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
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
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Open Physics Lab' : 'Abrir Simulador'}</span>
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('courses')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Course Syllabi' : 'Catálogo de Temarios'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
