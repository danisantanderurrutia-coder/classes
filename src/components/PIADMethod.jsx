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
import EpistemicTimeline from './EpistemicTimeline';

const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const clean = url.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
};

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
      simulationImage: '/images/method-piad.webp',
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
      naiveAiEn: 'Mechanical follower of repetitive exercise recipes without deep understanding',
      naiveAiEs: 'Repetidor mecánico de recetas de ejercicios sin comprensión de fondo',
      piadEn: 'Sovereign investigator who uncovers first principles and models with their own code',
      piadEs: 'Investigador soberano que domina los primeros principios y modela con código propio'
    },
    {
      dimensionEn: 'Approach to Computation & Code',
      dimensionEs: 'Enfoque hacia el Código y la Computación',
      traditionalEn: 'Absent or restricted to abstract proofs on paper',
      traditionalEs: 'Ausente o restringido a demostraciones abstractas en papel',
      naiveAiEn: 'Pocket calculator approach for routine arithmetic without analysis',
      naiveAiEs: 'Uso de calculadora para aritmética rutinaria sin análisis conceptual',
      piadEn: 'Interactive numerical simulations in Python (NumPy/SciPy) to deduce physical laws',
      piadEs: 'Simulaciones numéricas interactivas en Python (NumPy/SciPy) para deducir leyes físicas'
    },
    {
      dimensionEn: 'Method of Proof',
      dimensionEs: 'Método de Demostración',
      traditionalEn: 'Rote formula memorization for 90-minute written exams',
      traditionalEs: 'Memorización mecánica para un examen escrito de 90 minutos',
      naiveAiEn: 'Blind substitution of numbers into textbook recipes',
      naiveAiEs: 'Reemplazo ciego de números en fórmulas prefijadas',
      piadEn: 'Occam\'s parsimony + empirical sandbox + official examiner scoring rubrics',
      piadEs: 'Parsimonia de Ockham + laboratorio experimental + rúbricas oficiales de examen'
    },
    {
      dimensionEn: 'End Deliverable',
      dimensionEs: 'Entregable Final',
      traditionalEn: 'A scored exam paper that gets archived and forgotten',
      traditionalEs: 'Una hoja de examen calificada que se archiva y se olvida',
      naiveAiEn: 'Disjointed notes without lasting conceptual connection',
      naiveAiEs: 'Apuntes desordenados sin conexión conceptual duradera',
      piadEn: 'Autonomous mental models, vector Miro cheat-sheets, and executable Python code',
      piadEs: 'Criterio autónomo permanente, esquemas vectoriales y código Python ejecutable'
    }
  ];

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="max-w-4xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-sky-300 font-mono text-xs font-bold mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>MÉTODO PIAD™ • PEDAGOGÍA DE LA INDAGACIÓN ABIERTA Y DIGITAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            {lang === 'en'
              ? 'First-Principles Intuition, Rigorous Modeling & Sovereign Problem Solving.'
              : 'Intuición por Primeros Principios, Modelación Rigurosa y Criterio Autónomo.'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'The PIAD Method™ (Pedagogy of Open & Digital Inquiry) connects sensory observation, rigorous mathematical modeling, and empirical verification. Students learn to isolate the essential core of problems and build sovereign analytical understanding.'
              : 'El Método PIAD™ (Pedagogía de la Indagación Abierta y Digital) une la observación sensible, el modelamiento matemático riguroso y la verificación empírica. El estudiante aprende a relevar lo esencial de cada problema y forjar un criterio analítico soberano.'}
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

        {/* MANIFESTO BOX: PEDAGOGÍA ABIERTA & SOBERANÍA INTELECTUAL */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Our Educational Philosophy' : 'Nuestra Filosofía Pedagógica'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === 'en'
                ? 'From Mechanical Memorization to Sovereign Problem-Solving'
                : 'De la Memorización Mecánica a la Soberanía Intelectual'}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {lang === 'en'
                ? 'Traditional university lectures often treat students as passive recipients of abstract proofs, while standard tutorials reduce problem-solving to rote recipes. The PIAD Method™ transforms this dynamic: students learn to formulate foundational questions, isolate the governing physical laws with Occam’s parsimony, design executable computational models in Python, and verify each step against official examination rubrics. Real mastery comes from understanding why a law holds, not memorizing how to replicate it.'
                : 'Las clases universitarias tradicionales suelen tratar al estudiante como un receptor pasivo de demostraciones abstractas, mientras que las ayudantías mecánicas se limitan a recetas de manual. El Método PIAD™ transforma esa dinámica: el estudiante formula preguntas de fondo, aísla la ley física gobernante con la parsimonia de Ockham, diseña modelos computacionales ejecutables en Python y contrasta cada paso con las rúbricas de exámenes reales. La maestría real nace de comprender por qué una ley se cumple, no de memorizar cómo repetirla.'}
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

              {/* Optional Illustrated Sketch for Step 1 (Da Vinci Notebook Style with Simulation Crossfade) */}
              {steps[activeStep].image && (
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950 max-w-sm group">
                    <div className="relative h-56 overflow-hidden bg-slate-950">
                      {/* Modern Analytical / Geometric Overlay (Back Layer) */}
                      {steps[activeStep].simulationImage && (
                        <img
                          src={getAssetUrl(steps[activeStep].simulationImage)}
                          alt="Analytical Model"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      {/* Classical Authentic Da Vinci Sketch (Front Layer) */}
                      <img
                        src={steps[activeStep].image}
                        alt="Da Vinci Notebook Sketch"
                        className={`absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-700 ease-in-out ${
                          steps[activeStep].simulationImage ? 'group-hover:opacity-0 group-hover:scale-105' : ''
                        }`}
                        loading="lazy"
                      />
                      {steps[activeStep].simulationImage && (
                        <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/85 text-amber-300 border border-amber-400/30 backdrop-blur-xs flex items-center gap-1 shadow-md">
                            <span>{lang === 'en' ? 'Digital Analysis' : 'Análisis Digital'}</span>
                          </span>
                        </div>
                      )}
                    </div>
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
                ? 'Moving beyond obsolete rote memorization and mechanical exercise recipes.'
                : 'Superando tanto la memorización obsoleta como las recetas mecánicas de ejercicios.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-mono text-slate-700">
                  <th className="p-4 font-bold">{lang === 'en' ? 'Dimension' : 'Dimensión'}</th>
                  <th className="p-4 font-semibold text-slate-500">{lang === 'en' ? 'Traditional Education' : 'Educación Tradicional'}</th>
                  <th className="p-4 font-semibold text-amber-700">{lang === 'en' ? 'Mechanical Tutorials' : 'Ayudantías Mecánicas'}</th>
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

        {/* Interactive Epistemic Timeline: Historical Progression of the Project's Philosophy */}
        <EpistemicTimeline lang={lang} onNavigate={onNavigate} />

        {/* Call to Action Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-sky-950 text-white text-center max-w-4xl mx-auto shadow-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold block mb-2">
            {lang === 'en' ? 'Experience the PIAD Difference' : 'Experimenta la Diferencia PIAD'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            {lang === 'en'
              ? 'Ready to master physics and higher mathematics with deep critical criteria?'
              : '¿Listo para dominar la física y las matemáticas avanzadas con criterio crítico profundo?'}
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
