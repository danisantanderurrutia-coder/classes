import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Eye,
  Zap,
  Scissors,
  CheckCircle2,
  Share2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Atom,
  Terminal,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function PIADMethod({ lang = 'es', onNavigate, onOpenBooking }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      id: 'observation',
      icon: Eye,
      tagEn: 'Phenomenology & Direct Sensing',
      tagEs: 'Fenomenología & Percepción Directa',
      titleEn: '1. Da Vinci Observation (Hands & Senses First)',
      titleEs: '1. Observación Da Vinci (Mano, Ojo y Sentido)',
      mentorEn: 'Leonardo Da Vinci',
      quoteEn: '"Study the science of art. Study the art of science. Develop your senses — especially learn how to see."',
      quoteEs: '"Estudia la ciencia del arte. Estudia el arte de la ciencia. Desarrolla tus sentidos: aprende especialmente a ver."',
      descEn: 'Before touching a screen or asking an AI, we start from a visible, tangible physical phenomenon. The student sketches, calculates orders of magnitude, and engages their bodily intuition.',
      descEs: 'Antes de tocar una pantalla o preguntar a una IA, partimos de un fenómeno real y visible. El estudiante dibuja a mano alzada, estima órdenes de magnitud y conecta su intuición física.',
      actionEn: 'Freehand sketching • Free Body Diagrams (DCL) • Physical intuition',
      actionEs: 'Dibujo a mano alzada • Diagramas de Cuerpo Libre (DCL) • Intuición física'
    },
    {
      number: '02',
      id: 'ai-dialogue',
      icon: Zap,
      tagEn: 'Digital Provocation',
      tagEs: 'Provocación Digital',
      titleEn: '2. Socratic AI Interrogation (Doubt the Consensus)',
      titleEs: '2. Interrogación Socrática a la IA (Dudar del Consenso)',
      mentorEn: 'Galileo Galilei & René Descartes',
      quoteEn: '"In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual."',
      quoteEs: '"En cuestiones de ciencia, la autoridad de mil no vale más que el humilde razonamiento de un solo individuo."',
      descEn: 'We consult the AI not as an undisputed oracle, but as a generator of working hypotheses. We formulate precise prompts and demand that the model justify its mathematical steps without hiding assumptions.',
      descEs: 'Consultamos a la IA no como un oráculo incuestionable, sino como un generador de hipótesis de trabajo. Formulamos preguntas exigentes y obligamos al modelo a justificar sus pasos sin esconder suposiciones.',
      actionEn: 'Rigorous prompting • Exposing hidden assumptions • Socratic dialectic',
      actionEs: 'Prompting riguroso • Exposición de supuestos ocultos • Dialéctica socrática'
    },
    {
      number: '03',
      id: 'ockham',
      icon: Scissors,
      tagEn: 'Conceptual Parsimony',
      tagEs: 'Parsimonia Conceptual',
      titleEn: '3. Occam\'s Razor (Pruning AI Verbosity)',
      titleEs: '3. La Navaja de Ockham (Podar el Humo de la IA)',
      mentorEn: 'William of Ockham',
      quoteEn: '"Entities must not be multiplied beyond necessity."',
      quoteEs: '"No deben multiplicarse los entes sin necesidad."',
      descEn: 'AI models tend to produce bloated, jargon-heavy explanations that obscure understanding. In this phase, the student strips away unnecessary jargon and reduces the concept to its minimal, beautiful core law.',
      descEs: 'Las IA tienden a producir explicaciones infladas y llenas de jerga que esconden la falta de comprensión. En esta fase, el estudiante poda la palabrería y extrae la ley fundamental limpia en 3 líneas.',
      actionEn: 'Jargon removal • Dimensional analysis • First-principles distillation',
      actionEs: 'Eliminación de jerga • Análisis dimensional • Destilación por primeros principios'
    },
    {
      number: '04',
      id: 'popper',
      icon: Atom,
      tagEn: 'Empirical Verification',
      tagEs: 'Verificación Empírica',
      titleEn: '4. The Galileo Telescope & Popper Falsification',
      titleEs: '4. El Telescopio de Galileo & Falsación de Popper',
      mentorEn: 'Karl Popper & Galileo Galilei',
      quoteEn: '"A theory which is not refutable by any conceivable event is non-scientific."',
      quoteEs: '"Una teoría que no es refutable por ningún suceso concebible no es científica."',
      descEn: 'We do not ask the AI if it is right. We test it against physical simulation, calculus benchmarks, or real lab data. The student\'s badge of honor is discovering edge cases where the AI hallucinated or oversimplified.',
      descEs: 'No le pedimos a la IA que nos dé la razón. Contrastamos sus ecuaciones con simulaciones numéricas (DCL interactivo) o exámenes reales. El mérito del estudiante es cazar las contradicciones del modelo.',
      actionEn: 'Interactive physics sandbox • Altklausur verification • Boundary testing',
      actionEs: 'Laboratorio interactivo • Verificación en exámenes reales • Casos límite'
    },
    {
      number: '05',
      id: 'liberation',
      icon: Share2,
      tagEn: 'Open Knowledge & Emancipation',
      tagEs: 'Conocimiento Abierto & Emancipación',
      titleEn: '5. Open Knowledge Artifact (Freire & Elbakyan)',
      titleEs: '5. Artefacto de Conocimiento Abierto (Freire & Elbakyan)',
      mentorEn: 'Paulo Freire & Alexandra Elbakyan',
      quoteEn: '"Education either functions as an instrument of conformity or becomes the practice of freedom."',
      quoteEs: '"La educación o funciona como un instrumento de conformidad o se convierte en la práctica de la libertad."',
      descEn: 'Knowledge is not memorized to be locked away in an exam folder. The student produces a tangible, high-clarity artifact (a vector Miro sheet, Python code, an open infographic) that helps their peers and community.',
      descEs: 'El conocimiento no se memoriza para guardarlo en una carpeta cerrada. El estudiante crea un artefacto tangible (resumen vectorial en Miro, código Python, esquema didáctico) listo para compartir con su comunidad.',
      actionEn: 'Vector Miro PDF • Python scripts • Open community sharing',
      actionEs: 'PDF vectorial en Miro • Scripts en Python • Difusión abierta'
    }
  ];

  const comparisons = [
    {
      dimensionEn: 'Role of the Student',
      dimensionEs: 'Rol del Estudiante',
      traditionalEn: 'Passive recipient of textbook formulas ("Banking education")',
      traditionalEs: 'Receptor pasivo de fórmulas de manual ("Educación bancaria")',
      naiveAiEn: 'Prompter who copies and pastes without understanding',
      naiveAiEs: 'Copiador pasivo que delega el pensamiento a la IA',
      piadEn: 'Sovereign investigator who challenges the AI and tests physical reality',
      piadEs: 'Investigador soberano que somete a prueba a la IA y comprueba la realidad'
    },
    {
      dimensionEn: 'Role of Artificial Intelligence',
      dimensionEs: 'Rol de la Inteligencia Artificial',
      traditionalEn: 'Banned or treated as a cheating threat',
      traditionalEs: 'Prohibida o perseguida como trampa',
      naiveAiEn: 'Comfortable crutch that answers homework exercises',
      naiveAiEs: 'Muleta cómoda que resuelve ejercicios sin dejar criterio',
      piadEn: 'Dialectical sparring partner; hypothesis generator subject to pruning',
      piadEs: 'Sparring dialéctico socrático; generador de hipótesis sujeto a poda'
    },
    {
      dimensionEn: 'Method of Proof',
      dimensionEs: 'Método de Demostración',
      traditionalEn: 'Rote formula memorization for 90-minute written exams',
      traditionalEs: 'Memorización mecánica para un examen escrito de 90 minutos',
      naiveAiEn: 'Accepting the AI output without cross-checking assumptions',
      naiveAiEs: 'Creer en la respuesta del LLM sin revisar los supuestos',
      piadEn: 'Occam\'s Razor + Galilean sandbox + past-exam examiner partial points',
      piadEs: 'Navaja de Ockham + simulación experimental + rúbricas oficiales'
    },
    {
      dimensionEn: 'End Deliverable',
      dimensionEs: 'Entregable Final',
      traditionalEn: 'A scored exam paper that gets archived and forgotten',
      traditionalEs: 'Una hoja de examen calificada que se archiva y se olvida',
      naiveAiEn: 'Generic AI-generated text with no lasting mental model',
      naiveAiEs: 'Texto genérico que se desvanece de la memoria en 48 horas',
      piadEn: 'Autonomous mental models, vector Miro cheat-sheets, and applied code',
      piadEs: 'Criterio autónomo permanente, esquemas vectoriales y código vivo'
    }
  ];

  return (
    <div className="py-12 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="max-w-4xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-sky-300 font-mono text-xs font-bold mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>MÉTODO PIAD™ • PEDAGOGÍA DE LA INDAGACIÓN ABIERTA Y DIGITAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            {lang === 'en'
              ? 'Don’t let AI think for you. Use AI to sharpen your critical reasoning.'
              : 'No estudies para que la IA piense por ti. Usa la IA para afilar tu pensamiento crítico.'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'The PIAD Method™ is a high-rigor educational framework uniting the empirical rebellion of Galileo, the multi-disciplinary curiosity of Da Vinci, and the razor-sharp parsimony of Occam with critical, dialectical AI tools.'
              : 'El Método PIAD™ es un marco formativo propio que une la rebeldía empírica de Galileo, la polimatía humanista de Da Vinci y la parsimonia de Ockham con el uso crítico de la Inteligencia Artificial.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => onNavigate && onNavigate('lab')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Atom className="w-4 h-4" />
              <span>{lang === 'en' ? 'Test it in the Physics Lab →' : 'Probar en el Laboratorio de Física →'}</span>
            </button>
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'Book a PIAD Diagnostic Call' : 'Reservar Sesión Diagnóstica PIAD'}</span>
            </button>
          </div>
        </div>

        {/* The 5 Pillars Flow (Interactive Steps) */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              {lang === 'en' ? 'The 5-Step Dialectical Cycle' : 'El Ciclo Didáctico en 5 Fases'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'en' ? 'How a PIAD Learning Session Works' : 'Cómo se Vive una Sesión bajo el Método PIAD'}
            </h2>
          </div>

          {/* Stepper Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {st.number}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : 'text-slate-500'}`} />
                  </div>
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {lang === 'en' ? st.tagEn : st.tagEs}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none select-none font-mono text-9xl font-black">
              {steps[activeStep].number}
            </div>

            <div className="max-w-3xl relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 font-mono text-xs font-bold border border-slate-700">
                <span>{steps[activeStep].mentorEn}</span>
                <span>•</span>
                <span>{lang === 'en' ? steps[activeStep].tagEn : steps[activeStep].tagEs}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? steps[activeStep].titleEn : steps[activeStep].titleEs}
              </h3>

              <blockquote className="border-l-2 border-sky-400 pl-4 italic text-slate-300 text-sm font-serif">
                {lang === 'en' ? steps[activeStep].quoteEn : steps[activeStep].quoteEs}
              </blockquote>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {lang === 'en' ? steps[activeStep].descEn : steps[activeStep].descEs}
              </p>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    <strong className="text-white">
                      {lang === 'en' ? 'Tangible practice: ' : 'Práctica tangible: '}
                    </strong>
                    {lang === 'en' ? steps[activeStep].actionEn : steps[activeStep].actionEs}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    ← Anterior
                  </button>
                  <button
                    disabled={activeStep === steps.length - 1}
                    onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paradigm Comparison Table */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
              {lang === 'en' ? 'Pedagogical Contrast' : 'Contraste Metodológico'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'en' ? 'Why the PIAD Method™ is Different' : '¿Por Qué el Método PIAD™ Marca la Diferencia?'}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {lang === 'en'
                ? 'Moving beyond obsolete rote memorization and passive AI dependency.'
                : 'Superando tanto la memorización obsoleta como la dependencia pasiva de la IA.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-mono text-slate-700">
                  <th className="p-4 font-bold">{lang === 'en' ? 'Dimension' : 'Dimensión'}</th>
                  <th className="p-4 font-semibold text-slate-500">{lang === 'en' ? 'Traditional Education' : 'Educación Tradicional'}</th>
                  <th className="p-4 font-semibold text-amber-700">{lang === 'en' ? 'Passive AI Usage' : 'Uso Ingenuo de la IA'}</th>
                  <th className="p-4 font-extrabold bg-slate-900 text-sky-300">{lang === 'en' ? 'PIAD Method™' : 'Método PIAD™'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisons.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs">
                      {lang === 'en' ? c.dimensionEn : c.dimensionEs}
                    </td>
                    <td className="p-4 text-slate-600 leading-relaxed">
                      {lang === 'en' ? c.traditionalEn : c.traditionalEs}
                    </td>
                    <td className="p-4 text-amber-900/80 leading-relaxed bg-amber-50/30">
                      {lang === 'en' ? c.naiveAiEn : c.naiveAiEs}
                    </td>
                    <td className="p-4 font-semibold text-slate-900 bg-sky-50/50 border-l border-sky-200 leading-relaxed">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{lang === 'en' ? c.piadEn : c.piadEs}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Founding Fathers of PIAD (Galileo, Da Vinci, Ockham, Freire, Elbakyan) */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              {lang === 'en' ? 'Philosophical Lineage' : 'Árbol Genealógico Filosófico'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'en' ? 'Guided by Rebel Thinkers, Not Academic Bureaucracy' : 'Guiado por Pensadores Libres, No por Burocracia Académica'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-mono">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🔭 Galileo Galilei</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Persecuted for turning the telescope to Jupiter. Replaces authority with direct experimental observation.'
                  : 'Perseguido por apuntar su telescopio a Júpiter. Reemplaza el argumento de autoridad por la observación empírica directa.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🎨 Leonardo Da Vinci</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'The complete polymath. Art, mechanics, anatomy, and hydraulics forming one unified sensory intelligence.'
                  : 'El ser humano completo. Arte, mecánica, anatomía e hidráulica integrados como una sola inteligencia sensible.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🗡️ Guillermo de Ockham</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'The razor of parsimony. Cutting through bloated artificial rhetoric to discover the minimal irreducible truth.'
                  : 'La navaja de la parsimonia. Podar la retórica artificial inflada para hallar la verdad mínima irreducible.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">✊ Paulo Freire</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Pedagogy of the Oppressed. Breaking banking education; teaching as a shared dialogue of mutual liberation.'
                  : 'Pedagogía del Oprimido. Superación de la educación bancaria; el aprendizaje como diálogo de liberación mutua.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🔓 Alexandra Elbakyan</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Founder of Sci-Hub. Breaking institutional paywalls so science and culture belong to every human being.'
                  : 'Fundadora de Sci-Hub. Demolición de paywalls institucionales para que la ciencia sea libre y universal.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">⚡ Karl Popper & Paul Feyerabend</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Falsification over blind confirmation; methodological disobedience against rigid dogmas ("Anything goes").'
                  : 'Falsación audaz frente a la confirmación ciega; desobediencia metodológica contra los dogmas rígidos.'}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-sky-950 text-white text-center max-w-4xl mx-auto shadow-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold block mb-2">
            {lang === 'en' ? 'Experience the PIAD Difference' : 'Experimenta la Diferencia PIAD'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            {lang === 'en'
              ? 'Ready to master higher STEM with deep critical criteria?'
              : '¿Listo para dominar las ciencias exactas con criterio crítico profundo?'}
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            {lang === 'en'
              ? 'All 1-on-1 sprint coaching and university exam tracks are taught following the PIAD Method™. Start with a 20-minute diagnostic session.'
              : 'Todas las clases individuales y sprints para exámenes se imparten bajo el marco del Método PIAD™. Empieza con una sesión diagnóstica gratuita de 20 minutos.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              {lang === 'en' ? 'Book Free PIAD Diagnostic Session' : 'Reservar Sesión Diagnóstica PIAD Gratis'}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('courses')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {lang === 'en' ? 'View Course Tracks & Syllabi →' : 'Ver Catálogo de Materias →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
