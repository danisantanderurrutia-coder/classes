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
  ExternalLink,
  Code2,
  Laptop
} from 'lucide-react';

export default function PIADMethod({ lang = 'es', onNavigate, onOpenBooking }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      id: 'observation',
      icon: Eye,
      tagEn: 'Direct Observation & Physical Sense',
      tagEs: 'Observación Directa & Intuición Física',
      titleEn: '1. Observation (Sensory Intuition & Sketching)',
      titleEs: '1. Observación (Intuición Sensible y Bocetos)',
      mentorEn: 'Leonardo Da Vinci',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
      imageCaptionEn: 'Da Vinci method: analytical sketching and observational geometry before abstract formalisms.',
      imageCaptionEs: 'Método Da Vinci: dibujo analítico y geometría observacional antes del formalismo abstracto.',
      quoteEn: '"Study the science of art. Study the art of science. Develop your senses — especially learn how to see."',
      quoteEs: '"Estudia la ciencia del arte. Estudia el arte de la ciencia. Desarrolla tus sentidos: aprende especialmente a ver."',
      descEn: 'Before touching a screen, we start from a visible, tangible physical phenomenon. The student sketches by hand, estimates orders of magnitude, and engages their bodily and spatial intuition.',
      descEs: 'Antes de tocar una pantalla, partimos de un fenómeno real y visible. El estudiante dibuja a mano alzada, estima órdenes de magnitud y conecta su intuición física y espacial con la realidad.',
      actionEn: 'Freehand sketching • Free Body Diagrams (DCL) • Physical scale intuition',
      actionEs: 'Dibujo a mano alzada • Diagramas de Cuerpo Libre (DCL) • Intuición de escala física'
    },
    {
      number: '02',
      id: 'questioning-dogma',
      icon: Zap,
      tagEn: 'Clearing Space for New Knowledge',
      tagEs: 'Espacio para el Nuevo Conocimiento',
      titleEn: '2. Questioning Prior Consensus & Dogmas',
      titleEs: '2. Cuestionar Consensos y Dogmas Previos',
      mentorEn: 'René Descartes & Francis Bacon',
      quoteEn: '"To examine what is true, it is necessary to doubt all things, as far as possible, at least once in a lifetime."',
      quoteEs: '"Para examinar la verdad es preciso dudar, en cuanto sea posible, de todas las cosas una vez en la vida."',
      descEn: 'For genuine new understanding to emerge, we must pause inherited consensus, textbook formulas, and pre-packaged answers. The student identifies what premises are being taken for granted and formulates daring questions.',
      descEs: 'Para que surja una comprensión genuina y nueva, es indispensable poner en pausa las explicaciones mecánicas, las fórmulas heredadas y los consensos previos. El estudiante examina qué premisas se están dando por sentadas y formula preguntas audaces.',
      actionEn: 'Exposing hidden premises • Challenging preconceptions • Critical inquiry',
      actionEs: 'Exposición de premisas ocultas • Desafío de ideas preconcebidas • Diálogo crítico'
    },
    {
      number: '03',
      id: 'relevance-essential',
      icon: Scissors,
      tagEn: 'Core Essence & Parsimony',
      tagEs: 'Esencia y Parsimonia',
      titleEn: '3. Highlighting the Essential Core of a Problem',
      titleEs: '3. Relevar lo Esencial de un Problema',
      mentorEn: 'Guillermo de Ockham',
      quoteEn: '"Entities must not be multiplied beyond necessity."',
      quoteEs: '"No deben multiplicarse los entes sin necesidad."',
      descEn: 'Every complex engineering problem contains an elegant governing core hidden beneath layers of noise, excess variables, and decorative jargon. Guided by Occam\'s razor, the student extracts what truly matters.',
      descEs: 'Todo problema complejo contiene una estructura esencial limpia oculta bajo capas de ruido, exceso de variables o jerga innecesaria. Guiados por la navaja de Ockham, aprendemos a identificar las variables que realmente gobiernan el fenómeno y formular la ley mínima fundamental.',
      actionEn: 'Critical variable isolation • Dimensional analysis • First-principles distillation',
      actionEs: 'Aislamiento de variables críticas • Análisis dimensional • Destilación por primeros principios'
    },
    {
      number: '04',
      id: 'empirical-lab',
      icon: Atom,
      tagEn: 'Empirical Verification',
      tagEs: 'Verificación Empírica',
      titleEn: '4. Empirical Verification & Laboratory Testing',
      titleEs: '4. Verificación y Laboratorio Empírico',
      mentorEn: 'Isaac Newton & Karl Popper',
      quoteEn: '"I do not feign hypotheses. Whatever is not deduced from the phenomena must be called a hypothesis, and has no place in experimental philosophy."',
      quoteEs: '"No invento hipótesis. Todo lo que no se deduce de los fenómenos debe llamarse hipótesis, y no tiene lugar en la filosofía experimental."',
      descEn: 'We test every mathematical conjecture against the physical sandbox: numerical simulations, free body diagrams, and official past-exam exercises. We explore boundary limits to see where the physical model holds and where it breaks down.',
      descEs: 'Contrastamos toda conjetura y desarrollo matemático con el laboratorio empírico: simulaciones numéricas, diagramas de fuerzas (DCL) y problemas de exámenes reales. Comprobamos casos límite para entender con precisión cuándo un modelo físico funciona y cuándo colapsa.',
      actionEn: 'Interactive physics sandbox • Altklausur verification • Boundary testing',
      actionEs: 'Laboratorio interactivo • Verificación en exámenes reales • Casos límite'
    },
    {
      number: '05',
      id: 'open-artifact',
      icon: Share2,
      tagEn: 'Accessible Science & Code',
      tagEs: 'Ciencia y Código Accesibles',
      titleEn: '5. Open Knowledge Artifact',
      titleEs: '5. Artefacto de Conocimiento Abierto',
      mentorEn: 'Paulo Freire & Alexandra Elbakyan',
      quoteEn: '"Knowledge emerges only through invention and re-invention, through restless, impatient, continuing inquiry."',
      quoteEs: '"El conocimiento emerge solo a través de la invención y la reinvención, a través de la indagación inquieta, impaciente y permanente."',
      descEn: 'Knowledge is not meant to be archived in a drawer. The student cements understanding by building a tangible artifact: a crisp vector Miro cheat-sheet, an executable Python script, or an open explanatory guide for peers.',
      descEs: 'El conocimiento no se queda en una carpeta cerrada. El estudiante consolida su dominio construyendo un artefacto tangible: un formulario vectorial nítido en Miro, un script ejecutable en Python o un esquema explicativo abierto que democratiza las herramientas para sí mismo y para otros.',
      actionEn: 'Vector Miro PDF • Python scripts • Open community sharing',
      actionEs: 'PDF vectorial en Miro • Scripts en Python • Difusión comunitaria abierta'
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
      piadEn: 'Sovereign investigator who uncovers first principles and writes code',
      piadEs: 'Investigador soberano que domina los primeros principios y diseña su propio código'
    },
    {
      dimensionEn: 'Role of Artificial Intelligence',
      dimensionEs: 'Rol de la Inteligencia Artificial',
      traditionalEn: 'Banned or treated as a cheating threat',
      traditionalEs: 'Prohibida o perseguida como trampa',
      naiveAiEn: 'Comfortable crutch that answers homework exercises',
      naiveAiEs: 'Muleta cómoda que resuelve ejercicios sin dejar criterio',
      piadEn: 'Productive catalyst to design code, explore simulations, and accelerate learning',
      piadEs: 'Catalizador productivo para diseñar código, explorar simulaciones y acelerar el aprendizaje'
    },
    {
      dimensionEn: 'Method of Proof',
      dimensionEs: 'Método de Demostración',
      traditionalEn: 'Rote formula memorization for 90-minute written exams',
      traditionalEs: 'Memorización mecánica para un examen escrito de 90 minutos',
      naiveAiEn: 'Accepting the AI output without cross-checking assumptions',
      naiveAiEs: 'Creer en la respuesta del LLM sin revisar los supuestos',
      piadEn: 'Occam\'s parsimony + empirical sandbox + past-exam examiner partial points',
      piadEs: 'Parsimonia de Ockham + simulación experimental + rúbricas oficiales'
    },
    {
      dimensionEn: 'End Deliverable',
      dimensionEs: 'Entregable Final',
      traditionalEn: 'A scored exam paper that gets archived and forgotten',
      traditionalEs: 'Una hoja de examen calificada que se archiva y se olvida',
      naiveAiEn: 'Generic AI-generated text with no lasting mental model',
      naiveAiEs: 'Texto genérico que se desvanece de la memoria en 48 horas',
      piadEn: 'Autonomous mental models, vector Miro cheat-sheets, and executable Python code',
      piadEs: 'Criterio autónomo permanente, esquemas vectoriales y código Python ejecutable'
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
              ? 'Harness AI productively: explore, design code, and master higher STEM.'
              : 'Usa la IA de modo productivo: explora, diseña código propio y domina las ciencias.'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'We know students will use AI. The PIAD Method™ ensures they use it constructively: to explore deeply, design executable code, and make historically difficult math and physics accessible through simple, hands-on inquiry.'
              : 'Sabemos que los estudiantes usarán la IA sí o sí. El Método PIAD™ la transforma en una palanca de aprendizaje productivo: para explorar con curiosidad, democratizar la programación y acercar dificultades complejas mediante ejercicios simples que profundizan la comprensión real.'}
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

        {/* SPECIAL MANIFESTO BOX: LA IA PRODUCTIVA & DEMOCRATIZACIÓN DEL CÓDIGO */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Our AI Philosophy' : 'Nuestra Filosofía con la Inteligencia Artificial'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === 'en'
                ? 'From Passive Cheating to Computational Empowerment'
                : 'De la Dependencia Pasiva a la Democratización del Código'}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {lang === 'en'
                ? 'We recognize that students will use AI daily. Rather than futile prohibitions, PIAD channels AI into a powerful accelerator: students learn to formulate exact logic, generate and debug scientific Python code (NumPy, SciPy), and bridge historical bottlenecks in calculus and physics through interactive simulations. AI becomes the gateway to democratizing programming and higher analytical skills for everyone.'
                : 'Sabemos que los estudiantes usarán la IA sí o sí. En lugar de prohibiciones inútiles, el Método PIAD la canaliza como un acelerador de criterio: enseñamos al alumno a estructurar la lógica, diseñar y depurar código científico en Python (NumPy, SciPy), y acercar dificultades históricas del cálculo y la física mediante ejercicios simples e interactivos. La IA se convierte en la puerta de entrada para democratizar las herramientas de programación y el pensamiento analítico riguroso.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{lang === 'en' ? 'Scientific Python & NumPy scripts' : 'Scripts en Python científico y NumPy'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'en' ? 'Interactive physical intuition' : 'Intuición física interactiva'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{lang === 'en' ? 'Sovereign problem-solving skills' : 'Criterio autónomo e intransferible'}</span>
              </div>
            </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className={`space-y-5 ${steps[activeStep].image ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
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

              {/* Optional Illustrated Sketch for Step 1 (Da Vinci Notebook Style) */}
              {steps[activeStep].image && (
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950 max-w-sm">
                    <img
                      src={steps[activeStep].image}
                      alt="Da Vinci Notebook Sketch"
                      className="w-full h-56 object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="p-3 text-[11px] font-mono text-slate-400 border-t border-slate-800">
                      {lang === 'en' ? steps[activeStep].imageCaptionEn : steps[activeStep].imageCaptionEs}
                    </div>
                  </div>
                </div>
              )}

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

        {/* Founding Thinkers of PIAD (Newton, Da Vinci, Ockham, Freire, Elbakyan) */}
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
              <span className="font-bold text-sm text-slate-900 block">🎨 Leonardo Da Vinci</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'The complete polymath. Art, mechanics, anatomy, and hydraulics forming one unified sensory intelligence.'
                  : 'El ser humano completo. Arte, mecánica, anatomía e hidráulica integrados como una sola inteligencia sensible.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🔭 Isaac Newton</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Built classical mechanics and calculus from experimental optics and gravitation. "Hypotheses non fingo".'
                  : 'Fundó la mecánica clásica y el cálculo desde la óptica y la gravitación. "Hypotheses non fingo": rigor empírico antes que dogma.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🗡️ Guillermo de Ockham</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'The razor of parsimony. Isolating the governing core of every problem without superfluous entities.'
                  : 'La navaja de la parsimonia. Aislar el núcleo esencial que gobierna cada problema sin multiplicar entidades superfluas.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">✊ Paulo Freire</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Pedagogy of the Oppressed. Overcoming banking education: learning as active dialogue and emancipation.'
                  : 'Pedagogía del Oprimido. Superación de la educación bancaria; el aprendizaje como diálogo activo y emancipación.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">🔓 Alexandra Elbakyan</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Founder of Sci-Hub. Democratizing scientific literature and open tools so knowledge belongs to all.'
                  : 'Fundadora de Sci-Hub. Democratización de la literatura científica y herramientas abiertas para que el conocimiento sea universal.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-sm text-slate-900 block">⚡ Karl Popper & Paul Feyerabend</span>
              <p className="text-slate-600 font-sans leading-relaxed">
                {lang === 'en'
                  ? 'Critical testing over blind consensus; methodological freedom to tackle scientific bottlenecks.'
                  : 'Puesta a prueba crítica frente al consenso ciego; libertad metodológica para superar obstáculos científicos.'}
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
