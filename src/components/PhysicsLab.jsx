import MathFormula from './MathFormula';
import React, { useState, useEffect, useRef } from 'react';
import { LAB_PROBLEMS } from '../data/labProblems';
export { LAB_PROBLEMS };
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Compass,
  Calculator,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Layers,
  Flame,
  Cpu,
  Magnet,
  Activity,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Printer,
  FileText,
  X,
  Download,
  Orbit,
  Wind,
  Wrench,
  Globe,
  Mountain,
  Waves,
  Radio
} from 'lucide-react';

// Picks the LaTeX source for a formula entry: language-specific latex first, then shared latex,
// then the legacy Unicode text (eqEn/eqEs/eq) as a last resort.
const getFormulaMath = (f, lang) =>
  (lang === 'en' ? f.latexEn : f.latexEs) ||
  f.latex ||
  (lang === 'en' ? (f.eqEn || f.eq) : (f.eqEs || f.eq));

// ============================================================================
// HELPER: DRAW COILED SPRING ON CANVAS
// ============================================================================
function drawCoiledSpring(ctx, x1, y1, x2, y2, coils = 7, color = '#94A3B8') {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.translate(x1, y1);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);

  const leadIn = 10;
  const leadOut = 10;
  const springLen = Math.max(10, dist - leadIn - leadOut);
  ctx.lineTo(leadIn, 0);

  const numZigs = coils * 2;
  const step = springLen / numZigs;
  for (let i = 1; i <= numZigs; i++) {
    const sx = leadIn + i * step;
    const sy = (i % 2 === 1 ? -1 : 1) * 7.5;
    ctx.lineTo(sx, i === numZigs ? 0 : sy);
  }
  ctx.lineTo(dist, 0);
  ctx.stroke();
  ctx.restore();
}

// ============================================================================
// HELPER: DRAW VECTOR ARROW WITH LABEL ON CANVAS
// ============================================================================
function drawArrow(ctx, x1, y1, x2, y2, color, label, lineWidth = 2.5) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 4) return;
  const angle = Math.atan2(dy, dx);
  const headLen = Math.min(10, Math.max(6, len * 0.25));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(label).width;
    const lx = x2 + Math.cos(angle) * 10 - textWidth / 2;
    const ly = y2 + Math.sin(angle) * 10 + 4;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(lx - 4, ly - 11, textWidth + 8, 15);
    ctx.fillStyle = color;
    ctx.fillText(label, lx, ly);
  }
  ctx.restore();
}

export const PROBLEM_CATEGORIES = [
  { id: 'all', labelEs: 'Todos los Problemas (14)', labelEn: 'All Benchmarks (14)', icon: '🌌' },
  { id: 'mechanics', labelEs: 'Mecánica & Oscilaciones (4)', labelEn: 'Mechanics & Oscillations (4)', icon: '⚙️', ids: ['newtonian', 'intro_physics', 'engineering', 'coupled_oscillators'] },
  { id: 'geophysics', labelEs: 'Geofísica & Tierra Sólida (5)', labelEn: 'Geophysics & Solid Earth (5)', icon: '🌍', ids: ['seismology_beachball', 'bouguer_gravity', 'waves_geophysics', 'ekman_spiral', 'magnetotellurics'] },
  { id: 'math_cosmos', labelEs: 'Física Matemática & Atmósfera (3)', labelEn: 'Mathematical Physics & Atmosphere (3)', icon: '🌪️', ids: ['geostrophic_wind', 'vector_calculus', 'relativity'] },
  { id: 'em_thermo', labelEs: 'Electromagnetismo & Termo (2)', labelEn: 'Electromagnetism & Thermo (2)', icon: '⚡', ids: ['electromagnetism', 'thermodynamics'] }
];

export default function PhysicsLab({
  lang = 'es',
  initialProblemId = 'newtonian',
  onOpenBooking,
  onNavigate,
  courses = []
}) {
  const [selectedId, setSelectedId] = useState(initialProblemId || 'newtonian');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const currentProblem = LAB_PROBLEMS.find((p) => p.id === selectedId) || LAB_PROBLEMS[0];

  const [params, setParams] = useState(currentProblem.defaults);
  // Guarantee every parameter key for the active problem is always defined even on synchronous tab switch
  const safeParams = { ...currentProblem.defaults, ...params };

  const [isPlaying, setIsPlaying] = useState(true);
  const [showDCL, setShowDCL] = useState(true);
  const [mathTab, setMathTab] = useState('both'); // 'both' | 'algebra' | 'calculus'
  const [simTime, setSimTime] = useState(0);

  // Exercise state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showStudySheet, setShowStudySheet] = useState(false);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const handleSelectProblem = (probId) => {
    const prob = LAB_PROBLEMS.find((p) => p.id === probId) || LAB_PROBLEMS[0];
    setSelectedId(prob.id);
    setParams(prob.defaults);
    setSimTime(0);
    setIsPlaying(true);
    setSelectedOption(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      const cat = PROBLEM_CATEGORIES.find((c) => c.id === catId);
      if (cat && !cat.ids.includes(selectedId)) {
        handleSelectProblem(cat.ids[0]);
      }
    }
  };

  const filteredProblems = selectedCategory === 'all'
    ? LAB_PROBLEMS
    : LAB_PROBLEMS.filter((p) => {
        const cat = PROBLEM_CATEGORIES.find((c) => c.id === selectedCategory);
        return cat?.ids?.includes(p.id);
      });

  useEffect(() => {
    if (initialProblemId && LAB_PROBLEMS.some((p) => p.id === initialProblemId)) {
      handleSelectProblem(initialProblemId);
    }
  }, [initialProblemId]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    lastTimeRef.current = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      setSimTime((prev) => (prev + dt) % 12);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...currentProblem.defaults, ...prev, [key]: value }));
    setSimTime(0);
  };

  const applyPreset = (presetValues) => {
    setParams({ ...currentProblem.defaults, ...presetValues });
    setSimTime(0);
    setIsPlaying(true);
  };

  // ==========================================================================
  // LIVE TELEMETRY & PHYSICS COMPUTATIONS PER PROBLEM
  // ==========================================================================
  const computeTelemetry = () => {
    const isEn = lang === 'en';
    const g = 9.81;
    if (selectedId === 'newtonian') {
      const { m1, m2, angle, mu } = safeParams;
      const rad = (angle * Math.PI) / 180;
      const N = m1 * g * Math.cos(rad);
      const Fgx = m1 * g * Math.sin(rad);
      const fsMax = mu * N;
      const pullDiff = m2 * g - Fgx;
      let a = 0;
      let fFriction = 0;
      let stateEs = 'Equilibrio Estático (Bloqueado)';
      let stateEn = 'Static Equilibrium (Locked)';

      if (Math.abs(pullDiff) <= fsMax) {
        a = 0;
        fFriction = pullDiff; // opposes tendency
      } else if (pullDiff > fsMax) {
        a = (pullDiff - fsMax) / (m1 + m2);
        fFriction = fsMax;
        stateEs = 'Subiendo por la rampa (a > 0)';
        stateEn = 'Accelerating Up-Ramp (a > 0)';
      } else {
        a = (pullDiff + fsMax) / (m1 + m2);
        fFriction = -fsMax;
        stateEs = 'Deslizando rampa abajo (a < 0)';
        stateEn = 'Sliding Down-Ramp (a < 0)';
      }
      const T = m2 * (g - a);
      return {
        items: [
          { label: isEn ? 'a (Acceleration)' : 'a (Aceleración)', value: `${a.toFixed(2)} m/s²` },
          { label: isEn ? 'T (String Tension)' : 'T (Tensión cuerda)', value: `${T.toFixed(1)} N` },
          { label: isEn ? 'N (Normal Force)' : 'N (Fuerza Normal)', value: `${N.toFixed(1)} N` },
          { label: isEn ? '|f_r| (Active Friction)' : '|f_r| (Roce activo)', value: `${Math.abs(fFriction).toFixed(1)} N` }
        ],
        status: lang === 'en' ? stateEn : stateEs,
        raw: { a, T, N, Fgx, fFriction, fsMax }
      };
    }

    if (selectedId === 'intro_physics') {
      const { v0, angle, g: grav, drag } = safeParams;
      const rad = (angle * Math.PI) / 180;
      const vx0 = v0 * Math.cos(rad);
      const vy0 = v0 * Math.sin(rad);
      const idealRange = (v0 * v0 * Math.sin(2 * rad)) / grav;
      const idealPeak = (vy0 * vy0) / (2 * grav);
      const tFlightIdeal = (2 * vy0) / grav;
      const tNow = simTime % Math.max(1.2, tFlightIdeal * 1.05);

      let vx, vy, x, y;
      if (drag < 0.001) {
        vx = vx0;
        vy = vy0 - grav * tNow;
        x = vx0 * tNow;
        y = Math.max(0, vy0 * tNow - 0.5 * grav * tNow * tNow);
      } else {
        const expTerm = Math.exp(-drag * tNow);
        vx = vx0 * expTerm;
        vy = -grav / drag + (vy0 + grav / drag) * expTerm;
        x = (vx0 / drag) * (1 - expTerm);
        y = Math.max(0, -(grav / drag) * tNow + ((vy0 + grav / drag) / drag) * (1 - expTerm));
      }
      const dydx = vx > 0.01 ? vy / vx : 0;
      return {
        items: [
          { label: isEn ? 'Ideal Range (γ=0)' : 'Alcance Ideal (γ=0)', value: `${idealRange.toFixed(1)} m` },
          { label: isEn ? 'Ideal Max Height' : 'Altura Máx Ideal', value: `${idealPeak.toFixed(1)} m` },
          { label: isEn ? 'Slope dy/dx (t)' : 'Pendiente dy/dx (t)', value: `${dydx.toFixed(2)}` },
          { label: isEn ? 'Instantaneous |v(t)|' : '|v(t)| Instantánea', value: `${Math.hypot(vx, vy).toFixed(1)} m/s` }
        ],
        status:
          drag > 0
            ? lang === 'en'
              ? 'With Atmospheric Drag (Non-parabolic ODE)'
              : 'Con Arrastre Atmosférico (EDO no parabólica)'
            : lang === 'en'
            ? 'Ideal Vacuum (Exact Parabola)'
            : 'Vacío Ideal (Parábola Exacta)',
        raw: { vx, vy, x, y, dydx, idealRange, idealPeak, tFlightIdeal }
      };
    }

    if (selectedId === 'engineering') {
      const { loadPos, mass, k, damping } = safeParams;
      const L = 10.0;
      const W = mass * g;
      const RB = W * (loadPos / L);
      const RA = W - RB;
      const Mmax = RA * loadPos;
      const gamma = damping / (2 * mass);
      const omega0 = Math.sqrt(k / mass);
      const discrim = omega0 * omega0 - gamma * gamma;
      const omegaD = discrim > 0 ? Math.sqrt(discrim) : 0;

      return {
        items: [
          { label: isEn ? 'Reaction R_A (Left)' : 'Reacción R_A (Izq)', value: `${RA.toFixed(1)} N` },
          { label: isEn ? 'Reaction R_B (Right)' : 'Reacción R_B (Der)', value: `${RB.toFixed(1)} N` },
          { label: isEn ? 'Max Moment M_max' : 'Momento Máx M_max', value: `${Mmax.toFixed(0)} N·m` },
          { label: isEn ? 'Frequency ω₀' : 'Frecuencia ω₀', value: `${omega0.toFixed(2)} rad/s` }
        ],
        status:
          discrim > 0.05
            ? lang === 'en'
              ? `Underdamped Oscillation (ω_d = ${omegaD.toFixed(2)} rad/s)`
              : `Sub-amortiguado (Oscila con ω_d = ${omegaD.toFixed(2)} rad/s)`
            : lang === 'en'
            ? 'Critically / Over-damped (No rebound)'
            : 'Crítico / Sobre-amortiguado (Sin rebote)',
        raw: { RA, RB, W, Mmax, gamma, omega0, omegaD }
      };
    }

    if (selectedId === 'electromagnetism') {
      const { E, B, v0, qSign } = safeParams;
      const FE = -qSign * E; // downward if q > 0
      const FB = qSign * v0 * B; // upward if q > 0
      const Fnet = FE + FB;
      const vFilter = B > 0 ? E / B : 0;
      const isBalanced = Math.abs(v0 - vFilter) < 0.8;

      return {
        items: [
          { label: isEn ? 'Filter Velocity (E/B)' : 'Velocidad Filtro (E/B)', value: `${vFilter.toFixed(1)} m/s` },
          { label: isEn ? 'Electric Force F_E' : 'Fuerza Eléctrica F_E', value: `${FE.toFixed(1)} µN` },
          { label: isEn ? 'Magnetic Force F_B' : 'Fuerza Magnética F_B', value: `${FB.toFixed(1)} µN` },
          { label: isEn ? 'Net Force F_y' : 'Fuerza Neta F_y', value: `${Fnet.toFixed(1)} µN` }
        ],
        status: isBalanced
          ? lang === 'en'
            ? 'Balanced Selector! (F_E + F_B = 0 → Straight Beam)'
            : '¡Selector en Equilibrio! (F_E + F_B = 0 → Haz Recto)'
          : Fnet > 0
          ? lang === 'en'
            ? 'Deflecting Upward (F_y > 0)'
            : 'Desviándose hacia Arriba (F_y > 0)'
          : lang === 'en'
          ? 'Deflecting Downward (F_y < 0)'
          : 'Desviándose hacia Abajo (F_y < 0)',
        raw: { FE, FB, Fnet, vFilter, isBalanced }
      };
    }

    if (selectedId === 'thermodynamics') {
      const { V1, V2, T, processType } = safeParams;
      const R = 8.314;
      const n = 1.0;
      const P1 = (n * R * T) / V1; // kPa (since L -> 10^-3 m^3)
      let W = 0;
      let dU = 0;
      let Q = 0;
      let P2 = P1;

      if (processType === 1) {
        // Isothermal
        P2 = (n * R * T) / V2;
        W = n * R * T * Math.log(V2 / V1);
        dU = 0;
        Q = W;
      } else {
        // Isobaric
        P2 = P1;
        W = P1 * (V2 - V1);
        const T2 = T * (V2 / V1);
        dU = 1.5 * n * R * (T2 - T);
        Q = dU + W;
      }

      return {
        items: [
          { label: isEn ? 'Work W = ∫P dV' : 'Trabajo W = ∫P dV', value: `${W.toFixed(0)} J` },
          { label: isEn ? 'Energy Change ΔU' : 'Cambio Energía ΔU', value: `${dU.toFixed(0)} J` },
          { label: isEn ? 'Heat Transferred Q' : 'Calor Transferido Q', value: `${Q.toFixed(0)} J` },
          { label: isEn ? 'Initial Pressure P₁' : 'Presión Inicial P₁', value: `${(P1 / 100).toFixed(1)} bar` }
        ],
        status:
          processType === 1
            ? lang === 'en'
              ? 'Isothermal Process (T = const, ΔU = 0, W = nRT·ln(V₂/V₁))'
              : 'Proceso Isotérmico (T = cte, ΔU = 0, W = nRT·ln(V₂/V₁))'
            : lang === 'en'
            ? 'Isobaric Process (P = const, W = P·ΔV)'
            : 'Proceso Isobárico (P = cte, W = P·ΔV)',
        raw: { P1, P2, W, dU, Q }
      };
    }

    if (selectedId === 'vector_calculus') {
      const { omega = 1.5, kDiv = 0.0, radius = 2.2 } = safeParams;
      const curlVal = 2 * omega;
      const divVal = 2 * kDiv;
      const area = Math.PI * radius * radius;
      const circulation = curlVal * area;
      const isConservative = Math.abs(curlVal) < 0.01;
      return {
        items: [
          { label: isEn ? '∇×F⃗ (Curl / Vorticity)' : '∇×F⃗ (Rotacional)', value: `${curlVal.toFixed(2)} k̂` },
          { label: isEn ? '∇·F⃗ (Divergence)' : '∇·F⃗ (Divergencia)', value: `${divVal.toFixed(2)}` },
          { label: isEn ? '∮ F⃗·dr⃗ (Circulation)' : '∮ F⃗·dr⃗ (Circulación)', value: `${circulation.toFixed(2)} J` },
          { label: isEn ? 'Loop Area (πR²)' : 'Área del Bucle (πR²)', value: `${area.toFixed(2)} m²` }
        ],
        status: isConservative
          ? lang === 'en'
            ? 'Conservative Field (∇×F=0, ∮F·dr=0)'
            : 'Campo Conservativo (∇×F=0, ∮F·dr=0)'
          : lang === 'en'
          ? `Vortex Active (Circulation = ${circulation.toFixed(1)} J)`
          : `Vórtice Activo (Circulación = ${circulation.toFixed(1)} J)`,
        raw: { omega, kDiv, radius, curlVal, divVal, circulation, area }
      };
    }

    if (selectedId === 'coupled_oscillators') {
      const { m1 = 2.0, m2 = 2.0, kOuter = 18.0, kCoupling = 10.0, mode = 1 } = safeParams;
      const tr = (kOuter + kCoupling) / m1 + (kOuter + kCoupling) / m2;
      const detMat = ((kOuter + kCoupling) * (kOuter + kCoupling) - kCoupling * kCoupling) / (m1 * m2);
      const disc = Math.max(0, tr * tr - 4 * detMat);
      const w1sq = Math.max(0.1, (tr - Math.sqrt(disc)) / 2);
      const w2sq = Math.max(0.2, (tr + Math.sqrt(disc)) / 2);
      const w1 = Math.sqrt(w1sq);
      const w2 = Math.sqrt(w2sq);
      const f1 = w1 / (2 * Math.PI);
      const f2 = w2 / (2 * Math.PI);
      const beatFreq = Math.abs(w2 - w1) / (2 * Math.PI);

      let modeDescEs = 'Modo 1: En Fase (Mismo sentido, resorte central quieto)';
      let modeDescEn = 'Mode 1: In-Phase (Same direction, central spring idle)';
      if (mode === 2) {
        modeDescEs = 'Modo 2: En Antifase (Sentidos opuestos, máxima compresión)';
        modeDescEn = 'Mode 2: Anti-Phase (Opposite direction, maximum stretch)';
      } else if (mode === 3) {
        modeDescEs = `Superposición / Batimiento (f_bat = ${beatFreq.toFixed(2)} Hz)`;
        modeDescEn = `Superposition / Energy Beat (f_beat = ${beatFreq.toFixed(2)} Hz)`;
      }

      return {
        items: [
          { label: isEn ? 'ω₁ (In-Phase Mode)' : 'ω₁ (Modo en Fase)', value: `${w1.toFixed(2)} rad/s` },
          { label: isEn ? 'ω₂ (Anti-Phase Mode)' : 'ω₂ (Modo en Antifase)', value: `${w2.toFixed(2)} rad/s` },
          { label: isEn ? 'f₁ (Frequency 1)' : 'f₁ (Frecuencia 1)', value: `${f1.toFixed(2)} Hz` },
          { label: isEn ? 'f₂ (Frequency 2)' : 'f₂ (Frecuencia 2)', value: `${f2.toFixed(2)} Hz` }
        ],
        status: lang === 'en' ? modeDescEn : modeDescEs,
        raw: { m1, m2, kOuter, kCoupling, mode, w1, w2, f1, f2, beatFreq }
      };
    }

    if (selectedId === 'geostrophic_wind') {
      const { deltaP = 16.0, latitude = 45, hemisphere = 1, rho = 1.20 } = safeParams;
      const omegaEarth = 7.292e-5;
      const latRad = (Math.abs(latitude) * Math.PI) / 180;
      const fCoriolis = 2 * omegaEarth * Math.sin(latRad) * (hemisphere >= 0 ? 1 : -1);
      const gradP = (deltaP * 100) / 100000; // Pa/m
      const vg = Math.abs(fCoriolis) > 1e-6 ? gradP / (rho * Math.abs(fCoriolis)) : 999;
      const vgKmh = vg * 3.6;

      const statusEs = hemisphere >= 0
        ? `Hemisferio Norte: Desviación a la DERECHA (${vgKmh.toFixed(1)} km/h)`
        : `Hemisferio Sur: Desviación a la IZQUIERDA (${vgKmh.toFixed(1)} km/h)`;
      const statusEn = hemisphere >= 0
        ? `Northern Hemisphere: Deflection to RIGHT (${vgKmh.toFixed(1)} km/h)`
        : `Southern Hemisphere: Deflection to LEFT (${vgKmh.toFixed(1)} km/h)`;

      return {
        items: [
          { label: isEn ? 'v_g (Geostrophic Wind)' : 'v_g (Viento Geostrófico)', value: `${vg.toFixed(1)} m/s` },
          { label: isEn ? 'v_g in km/h' : 'v_g en km/h', value: `${vgKmh.toFixed(1)} km/h` },
          { label: isEn ? 'Coriolis Parameter f' : 'Parámetro f (Coriolis)', value: `${(Math.abs(fCoriolis) * 1e4).toFixed(2)}×10⁻⁴ s⁻¹` },
          { label: isEn ? 'Pressure Gradient ∇P' : 'Gradiente ∇P', value: `${(gradP * 1000).toFixed(2)} mPa/m` }
        ],
        status: lang === 'en' ? statusEn : statusEs,
        raw: { deltaP, latitude, hemisphere, rho, fCoriolis, gradP, vg, vgKmh }
      };
    }

    if (selectedId === 'relativity') {
      const { mass = 1.0, eccentricity = 0.5, grFactor = 1.5, semiMajor = 2.8 } = safeParams;
      const rMin = semiMajor * (1 - eccentricity);
      const rMax = semiMajor * (1 + eccentricity);
      const deltaPhiDeg = grFactor * ((6 * Math.PI * mass) / (semiMajor * (1 - eccentricity * eccentricity))) * (180 / Math.PI) * 0.08;
      const isNewtonian = grFactor < 0.01;
      return {
        items: [
          { label: isEn ? 'Δφ (Precession / orbit)' : 'Δφ (Precesión / órbita)', value: isNewtonian ? (isEn ? '0.00° (Newtonian)' : '0.00° (Newton)') : `${deltaPhiDeg.toFixed(2)}°` },
          { label: isEn ? 'Perihelion (r_min)' : 'Perihelio (r_mín)', value: `${rMin.toFixed(2)} AU` },
          { label: isEn ? 'Aphelion (r_max)' : 'Afelio (r_máx)', value: `${rMax.toFixed(2)} AU` },
          { label: isEn ? 'Eccentricity (e)' : 'Excentricidad (e)', value: `${eccentricity.toFixed(2)}` }
        ],
        status: isNewtonian
          ? lang === 'en'
            ? 'Closed Kepler Ellipse (Newtonian Gravity)'
            : 'Elipse Cerrada Perenne (Gravedad Newtoniana)'
          : lang === 'en'
          ? `Relativistic Precession Active (Δφ = ${deltaPhiDeg.toFixed(1)}°/rev)`
          : `Precesión Relativista Activa (Δφ = ${deltaPhiDeg.toFixed(1)}°/rev)`,
        raw: { mass, eccentricity, grFactor, semiMajor, rMin, rMax, deltaPhiDeg }
      };
    }

    if (selectedId === 'seismology_beachball') {
      const { strike = 15, dip = 20, rake = 90, magnitude = 8.8 } = safeParams;
      const logM0 = 1.5 * magnitude + 9.1;
      const m0Exp = Math.floor(logM0);
      const m0Sci = Math.pow(10, logM0 - m0Exp);

      let regimeEs = 'Inversa / Subducción (Thrust)';
      let regimeEn = 'Reverse / Subduction (Thrust)';
      if (rake >= -135 && rake <= -45) {
        regimeEs = 'Normal / Extensión (Rifting)';
        regimeEn = 'Normal / Extension (Rifting)';
      } else if (Math.abs(rake) <= 45 || Math.abs(rake) >= 135) {
        regimeEs = rake >= 0 ? 'Rumbo Siniestral (Left-Lateral)' : 'Rumbo Dextral (Right-Lateral)';
        regimeEn = rake >= 0 ? 'Sinistral Strike-Slip' : 'Dextral Strike-Slip';
      }

      const vP = 6.0;
      const vS = (vP / Math.sqrt(3)).toFixed(2);

      return {
        items: [
          { label: isEn ? 'Moment Magnitude Mw' : 'Magnitud Mw', value: `${magnitude.toFixed(1)}` },
          { label: isEn ? 'Seismic Moment M₀' : 'Momento M₀', value: `${m0Sci.toFixed(2)}×10^${m0Exp} N·m` },
          { label: isEn ? 'Ratio v_P / v_S' : 'Razón v_P / v_S', value: `√3 ≈ 1.73 (${vP} / ${vS} km/s)` },
          { label: isEn ? 'Fault Regime' : 'Régimen Falla', value: isEn ? regimeEn : regimeEs }
        ],
        status: lang === 'en'
          ? `Strike φ=${strike}°, Dip δ=${dip}°, Rake λ=${rake}° (${regimeEn})`
          : `Rumbo φ=${strike}°, Buzamiento δ=${dip}°, Deslizamiento λ=${rake}° (${regimeEs})`,
        raw: { strike, dip, rake, magnitude, logM0, m0Sci, m0Exp, regimeEs, regimeEn, vP, vS }
      };
    }

    if (selectedId === 'bouguer_gravity') {
      const { mountainHeight = 4000, crustDensity = 2670, mantleDensity = 3300, crustThickness = 35 } = safeParams;
      const deltaRho = Math.max(100, mantleDensity - crustDensity);
      const rootMeters = mountainHeight * (crustDensity / deltaRho);
      const rootKm = rootMeters / 1000;
      const totalCrustKm = crustThickness + mountainHeight / 1000 + rootKm;
      const freeAirMgal = 0.3086 * mountainHeight;
      const bouguerSlabMgal = 0.04193 * (crustDensity / 1000) * mountainHeight;
      const rootDeficitMgal = -0.04193 * (deltaRho / 1000) * rootMeters * 0.72;
      const bouguerAnomalyMgal = freeAirMgal - bouguerSlabMgal + rootDeficitMgal;

      return {
        items: [
          { label: isEn ? 'Crustal Root (b)' : 'Raíz Cortical (b)', value: `${rootKm.toFixed(1)} km ${isEn ? 'in Mantle' : 'en Manto'}` },
          { label: isEn ? 'Total Crust Thickness' : 'Espesor Total Corteza', value: `${totalCrustKm.toFixed(1)} km (Moho)` },
          { label: isEn ? 'Bouguer Anomaly' : 'Anomalía de Bouguer', value: `${bouguerAnomalyMgal.toFixed(0)} mGal` },
          { label: isEn ? 'Bouguer Correction' : 'Corrección Bouguer', value: `-${bouguerSlabMgal.toFixed(0)} mGal` }
        ],
        status: lang === 'en'
          ? `Airy Isostasy Active: Mountain +${mountainHeight}m balanced by ${rootKm.toFixed(1)}km root`
          : `Isostasia de Airy Activa: Montaña +${mountainHeight}m compensada por raíz de ${rootKm.toFixed(1)}km`,
        raw: { mountainHeight, crustDensity, mantleDensity, crustThickness, deltaRho, rootMeters, rootKm, totalCrustKm, freeAirMgal, bouguerSlabMgal, bouguerAnomalyMgal }
      };
    }

    if (selectedId === 'ekman_spiral') {
      const { windSpeed = 12, latitude = -33, eddyViscosity = 0.05 } = safeParams;
      const omegaEarth = 7.292e-5;
      const latRad = (latitude * Math.PI) / 180;
      const fCoriolis = 2 * omegaEarth * Math.sin(latRad);
      const absF = Math.max(1e-6, Math.abs(fCoriolis));
      const ekmanDepth = Math.PI * Math.sqrt((2 * eddyViscosity) / absF);

      const rhoAir = 1.22;
      const cd = 1.3e-3;
      const tau0 = rhoAir * cd * windSpeed * windSpeed;
      const rhoWater = 1025;
      const v0 = tau0 / (rhoWater * Math.sqrt(absF * eddyViscosity));
      const ekmanTransport = tau0 / (rhoWater * absF);

      const isSouth = latitude < 0;
      const dirEs = isSouth ? 'Hacia el OESTE (Mar Adentro / Surgencia Activa)' : 'Hacia el ESTE / Costa';
      const dirEn = isSouth ? 'WESTWARD (Offshore / Active Upwelling)' : 'EASTWARD / Coastal Downwelling';

      return {
        items: [
          { label: isEn ? 'Ekman Depth (D_E)' : 'Profundidad de Ekman (D_E)', value: `${ekmanDepth.toFixed(1)} m` },
          { label: isEn ? 'Surface Velocity (V₀)' : 'Velocidad Superficie (V₀)', value: `${v0.toFixed(2)} m/s` },
          { label: isEn ? 'Net Ekman Transport' : 'Transporte Neto Ekman', value: `${ekmanTransport.toFixed(2)} m²/s` },
          { label: isEn ? 'Wind Stress (τ₀)' : 'Tensión Viento (τ₀)', value: `${tau0.toFixed(3)} Pa` }
        ],
        status: lang === 'en'
          ? `${latitude < 0 ? 'Chile / Southern Hemisphere' : 'Northern Hemisphere'}: Net 90° transport ${dirEn}`
          : `${latitude < 0 ? 'Chile / Hemisferio Sur' : 'Hemisferio Norte'}: Transporte neto 90° ${dirEs}`,
        raw: { windSpeed, latitude, eddyViscosity, fCoriolis, absF, ekmanDepth, tau0, v0, ekmanTransport, isSouth }
      };
    }

    if (selectedId === 'magnetotellurics') {
      const { frequency = 10, resTop = 20, resBottom = 500, layerThickness = 300 } = safeParams;
      const fVal = Math.max(0.01, frequency);
      const skinDepth1 = 503 * Math.sqrt(resTop / fVal);
      const skinDepth2 = 503 * Math.sqrt(resBottom / fVal);

      const ratio = skinDepth1 > 0 ? layerThickness / skinDepth1 : 1;
      const weight = Math.exp(-1.5 * ratio);
      const appRes = resTop * (1 - weight) + resBottom * weight;
      const period = 1 / fVal;

      return {
        items: [
          { label: isEn ? 'Skin Depth Layer 1 (δ₁)' : 'Skin Depth Capa 1 (δ₁)', value: `${skinDepth1.toFixed(0)} m` },
          { label: isEn ? 'Apparent Resistivity (ρ_a)' : 'Resistividad Aparente (ρ_a)', value: `${appRes.toFixed(1)} Ω·m` },
          { label: isEn ? 'Wave Period (T)' : 'Período de Onda (T)', value: `${period >= 1 ? period.toFixed(2) + ' s' : (period * 1000).toFixed(0) + ' ms'}` },
          { label: isEn ? 'Relative Penetration' : 'Penetración Relativa', value: skinDepth1 > layerThickness ? (isEn ? 'Penetrating basement' : 'Penetra al basamento') : (isEn ? 'Confined to Layer 1' : 'Confinada en Capa 1') }
        ],
        status: lang === 'en'
          ? `f=${fVal.toFixed(1)} Hz: Skin Depth δ=${skinDepth1.toFixed(0)}m in Layer 1 (${skinDepth1 > layerThickness ? 'Penetrating deeper layer' : 'Shallow confinement'})`
          : `f=${fVal.toFixed(1)} Hz: Profundidad de penetración δ=${skinDepth1.toFixed(0)}m (${skinDepth1 > layerThickness ? 'Alcanza el basamento resistivo' : 'Confinada en estrato somero'})`,
        raw: { frequency: fVal, resTop, resBottom, layerThickness, skinDepth1, skinDepth2, appRes, period }
      };
    }

    // Default: waves_geophysics
    const { theta1 = 30, v1 = 2.0, v2 = 3.5 } = safeParams;
    const rad1 = (theta1 * Math.PI) / 180;
    const sinTheta2 = (v2 / v1) * Math.sin(rad1);
    const isTIR = sinTheta2 >= 1.0;
    const theta2 = isTIR ? 90 : (Math.asin(sinTheta2) * 180) / Math.PI;
    const hasCrit = v2 > v1;
    const thetaCrit = hasCrit ? (Math.asin(v1 / v2) * 180) / Math.PI : null;

    return {
      items: [
        { label: isEn ? 'Incident Angle θ₁' : 'Ángulo Incidente θ₁', value: `${Number(theta1).toFixed(1)}°` },
        { label: isEn ? 'Refracted Angle θ₂' : 'Ángulo Refractado θ₂', value: isTIR ? (isEn ? 'Total Internal Reflection' : 'Reflexión Total') : `${Number(theta2).toFixed(1)}°` },
        { label: isEn ? 'Critical Angle θ_c' : 'Ángulo Crítico θ_c', value: hasCrit && thetaCrit !== null ? `${Number(thetaCrit).toFixed(1)}°` : 'N/A (v₁≥v₂)' },
        { label: isEn ? 'Velocity Ratio v₂ / v₁' : 'Relación v₂ / v₁', value: `${(v2 / v1).toFixed(2)}` }
      ],
      status: isTIR
        ? lang === 'en'
          ? 'Total Internal Reflection / Critical Head Wave!'
          : '¡Reflexión Total Interna / Onda Crítica Rasante!'
        : lang === 'en'
        ? `Refracted Ray Transmitted (θ₂ = ${Number(theta2).toFixed(1)}°)`
        : `Rayo Refractado Transmitido (θ₂ = ${Number(theta2).toFixed(1)}°)`,
      raw: { rad1, sinTheta2, isTIR, theta2, thetaCrit }
    };
  };

  const telemetry = computeTelemetry();

  // ==========================================================================
  // CANVAS RENDERING FOR ALL 6 INTERACTIVE SIMULATIONS + DCL OVERLAY
  // ==========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isEn = lang === 'en';
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Dark scientific blueprint background
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    // Subtle coordinate grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // ------------------------------------------------------------------------
    // 1. NEWTONIAN INCLINED PLANE & PULLEY
    // ------------------------------------------------------------------------
    if (selectedId === 'newtonian') {
      const { m1, m2, angle } = safeParams;
      const { a, T, N, Fgx, fFriction } = telemetry.raw;
      const rad = (angle * Math.PI) / 180;

      const baseX = 90;
      const baseY = H - 55;
      const rampLen = 300;
      const topX = baseX + rampLen * Math.cos(rad);
      const topY = baseY - rampLen * Math.sin(rad);

      // Draw wedge ramp
      ctx.fillStyle = showDCL ? 'rgba(30, 41, 59, 0.55)' : 'rgba(51, 65, 85, 0.85)';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(topX, topY);
      ctx.lineTo(topX, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Angle arc
      ctx.strokeStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(baseX, baseY, 42, -rad, 0);
      ctx.stroke();
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`θ=${angle}°`, baseX + 48, baseY - 10);

      // Pulley at top corner
      const pulleyR = 16;
      const pulleyX = topX + 10 * Math.cos(rad);
      const pulleyY = topY - 10 * Math.sin(rad);
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(pulleyX, pulleyY, pulleyR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Compute block displacement along ramp
      const tCycle = simTime % 4.5;
      const rawShift = 0.5 * a * tCycle * tCycle * 18;
      const clampedShift = Math.max(-75, Math.min(75, rawShift));
      const distAlongRamp = rampLen * 0.52 + clampedShift;

      const b1CenterX = baseX + distAlongRamp * Math.cos(rad) - 22 * Math.sin(rad);
      const b1CenterY = baseY - distAlongRamp * Math.sin(rad) - 22 * Math.cos(rad);

      // Hanging mass m2 position
      const m2X = pulleyX + pulleyR;
      const m2Y = Math.min(baseY - 25, Math.max(pulleyY + 45, pulleyY + 95 + clampedShift));

      // Rope
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b1CenterX + 20 * Math.cos(rad), b1CenterY - 20 * Math.sin(rad));
      ctx.lineTo(pulleyX - pulleyR * Math.sin(rad), pulleyY - pulleyR * Math.cos(rad));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(m2X, pulleyY);
      ctx.lineTo(m2X, m2Y - 20);
      ctx.stroke();

      // Draw Block m1 rotated on ramp
      ctx.save();
      ctx.translate(b1CenterX, b1CenterY);
      ctx.rotate(-rad);
      ctx.fillStyle = showDCL ? 'rgba(2, 132, 199, 0.35)' : '#0284C7';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.fillRect(-26, -20, 52, 40);
      ctx.strokeRect(-26, -20, 52, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`m₁=${m1}kg`, -22, 4);
      ctx.restore();

      // Draw Block m2 hanging
      ctx.fillStyle = showDCL ? 'rgba(16, 185, 129, 0.35)' : '#059669';
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2;
      ctx.fillRect(m2X - 24, m2Y - 22, 48, 44);
      ctx.strokeRect(m2X - 24, m2Y - 22, 48, 44);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`m₂=${m2}kg`, m2X - 21, m2Y + 4);

      // DCL OVERLAY (FREE BODY DIAGRAM VECTORS)
      if (showDCL) {
        const scale = 1.15;
        // Rotated axes dashed guide on m1
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(b1CenterX - 70 * Math.cos(rad), b1CenterY + 70 * Math.sin(rad));
        ctx.lineTo(b1CenterX + 70 * Math.cos(rad), b1CenterY - 70 * Math.sin(rad));
        ctx.moveTo(b1CenterX - 60 * Math.sin(rad), b1CenterY - 60 * Math.cos(rad));
        ctx.lineTo(b1CenterX + 60 * Math.sin(rad), b1CenterY + 60 * Math.cos(rad));
        ctx.stroke();
        ctx.restore();

        // 1. Weight m1*g straight down
        drawArrow(ctx, b1CenterX, b1CenterY, b1CenterX, b1CenterY + m1 * 9.81 * scale, '#EF4444', 'm₁g');
        // 2. Normal N perpendicular to ramp
        drawArrow(
          ctx,
          b1CenterX,
          b1CenterY,
          b1CenterX - N * scale * Math.sin(rad),
          b1CenterY - N * scale * Math.cos(rad),
          '#38BDF8',
          'N'
        );
        // 3. Component m1*g*sin(theta) down the ramp
        drawArrow(
          ctx,
          b1CenterX,
          b1CenterY,
          b1CenterX - Fgx * scale * Math.cos(rad),
          b1CenterY + Fgx * scale * Math.sin(rad),
          '#F97316',
          'm₁g·sinθ'
        );
        // 4. Tension T up the ramp
        drawArrow(
          ctx,
          b1CenterX,
          b1CenterY,
          b1CenterX + T * scale * Math.cos(rad),
          b1CenterY - T * scale * Math.sin(rad),
          '#FBBF24',
          'T'
        );
        // 5. Friction f_r
        if (Math.abs(fFriction) > 0.5) {
          const dir = fFriction > 0 ? -1 : 1; // opposes upward motion if fFriction > 0
          drawArrow(
            ctx,
            b1CenterX,
            b1CenterY,
            b1CenterX + dir * Math.abs(fFriction) * scale * Math.cos(rad),
            b1CenterY - dir * Math.abs(fFriction) * scale * Math.sin(rad),
            '#A855F7',
            'f_r'
          );
        }

        // DCL on m2
        drawArrow(ctx, m2X, m2Y, m2X, m2Y - T * scale, '#FBBF24', 'T');
        drawArrow(ctx, m2X, m2Y, m2X, m2Y + m2 * 9.81 * scale, '#EF4444', 'm₂g');
      }
    }

    // ------------------------------------------------------------------------
    // 2. PROJECTILE MOTION & DRAG
    // ------------------------------------------------------------------------
    if (selectedId === 'intro_physics') {
      const { v0, angle, g: grav, drag } = safeParams;
      const rad = (angle * Math.PI) / 180;
      const originX = 55;
      const originY = H - 45;
      const scale = 3.6;

      // Ground
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, originY);
      ctx.lineTo(W - 20, originY);
      ctx.stroke();

      // Ideal Vacuum Parabola (dashed)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let t = 0; t <= 8; t += 0.08) {
        const ix = v0 * Math.cos(rad) * t;
        const iy = v0 * Math.sin(rad) * t - 0.5 * grav * t * t;
        if (iy < 0 && t > 0) break;
        const px = originX + ix * scale;
        const py = originY - iy * scale;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Actual trajectory with drag
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const vx0 = v0 * Math.cos(rad);
      const vy0 = v0 * Math.sin(rad);
      let flightEndT = 2.5;
      for (let t = 0; t <= 10; t += 0.05) {
        let rx, ry;
        if (drag < 0.001) {
          rx = vx0 * t;
          ry = vy0 * t - 0.5 * grav * t * t;
        } else {
          const expTerm = Math.exp(-drag * t);
          rx = (vx0 / drag) * (1 - expTerm);
          ry = -(grav / drag) * t + ((vy0 + grav / drag) / drag) * (1 - expTerm);
        }
        if (ry < 0 && t > 0.1) {
          flightEndT = t;
          break;
        }
        const px = originX + rx * scale;
        const py = originY - ry * scale;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Moving particle at current time
      const tAnim = (simTime * 1.1) % Math.max(0.8, flightEndT);
      let curX, curY, curVx, curVy;
      if (drag < 0.001) {
        curVx = vx0;
        curVy = vy0 - grav * tAnim;
        curX = vx0 * tAnim;
        curY = Math.max(0, vy0 * tAnim - 0.5 * grav * tAnim * tAnim);
      } else {
        const expTerm = Math.exp(-drag * tAnim);
        curVx = vx0 * expTerm;
        curVy = -grav / drag + (vy0 + grav / drag) * expTerm;
        curX = (vx0 / drag) * (1 - expTerm);
        curY = Math.max(0, -(grav / drag) * tAnim + ((vy0 + grav / drag) / drag) * (1 - expTerm));
      }

      const px = originX + curX * scale;
      const py = originY - curY * scale;

      ctx.fillStyle = '#34D399';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      if (showDCL) {
        // Velocity components & total velocity tangent
        drawArrow(ctx, px, py, px + curVx * 1.7, py, '#38BDF8', 'v_x');
        drawArrow(ctx, px, py, px, py - curVy * 1.7, '#38BDF8', 'v_y');
        drawArrow(ctx, px, py, px + curVx * 1.7, py - curVy * 1.7, '#10B981', 'v⃗ (dy/dx)');
        // Gravity force m*g
        drawArrow(ctx, px, py, px, py + grav * 4.2, '#EF4444', 'm·g⃗');
        // Air drag force -gamma*v
        if (drag > 0.005) {
          drawArrow(
            ctx,
            px,
            py,
            px - curVx * drag * 7.5,
            py + curVy * drag * 7.5,
            '#F59E0B',
            'F⃗_drag = -γv⃗'
          );
        }
      }
    }

    // ------------------------------------------------------------------------
    // 3. ENGINEERING BEAM & DAMPED OSCILLATOR
    // ------------------------------------------------------------------------
    if (selectedId === 'engineering') {
      const { loadPos, mass } = safeParams;
      const { RA, RB, W: weight, gamma, omegaD } = telemetry.raw;

      const beamLeft = 75;
      const beamRight = W - 75;
      const beamLenPx = beamRight - beamLeft;
      const beamY = 145;

      // Damped oscillation displacement u(t)
      const tLocal = simTime % 4.0;
      const oscAmp = 22 * Math.exp(-gamma * tLocal) * Math.cos((omegaD || 1.5) * tLocal * 3);
      const loadX = beamLeft + (loadPos / 10) * beamLenPx;
      const deflectedY = beamY + oscAmp;

      // Supports A and B triangles
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(beamLeft, beamY + 6);
      ctx.lineTo(beamLeft - 14, beamY + 30);
      ctx.lineTo(beamLeft + 14, beamY + 30);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(beamRight, beamY + 6);
      ctx.lineTo(beamRight - 14, beamY + 30);
      ctx.lineTo(beamRight + 14, beamY + 30);
      ctx.closePath();
      ctx.fill();

      // Elastic deflection curve
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(beamLeft, beamY);
      ctx.quadraticCurveTo(loadX, deflectedY + 12, beamRight, beamY);
      ctx.stroke();

      // Mass block on beam
      ctx.fillStyle = showDCL ? 'rgba(217, 119, 6, 0.4)' : '#D97706';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.fillRect(loadX - 28, deflectedY - 38, 56, 36);
      ctx.strokeRect(loadX - 28, deflectedY - 38, 56, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`M=${mass}kg`, loadX - 24, deflectedY - 16);

      // Bending moment diagram M(x) below beam
      const diagTop = 225;
      const maxMomentPx = 55;
      const peakM = ((RA * loadPos) / 2500) * maxMomentPx;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(beamLeft, diagTop);
      ctx.lineTo(loadX, diagTop + Math.min(65, peakM));
      ctx.lineTo(beamRight, diagTop);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38BDF8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Bending Moment Diagram M(x)' : 'Diagrama Momento Flector M(x)', beamLeft, diagTop + 55);

      if (showDCL) {
        const fScale = 0.11;
        // Support reactions R_A and R_B upward
        drawArrow(ctx, beamLeft, beamY, beamLeft, beamY - Math.max(25, RA * fScale), '#10B981', `R_A=${RA.toFixed(0)}N`);
        drawArrow(ctx, beamRight, beamY, beamRight, beamY - Math.max(25, RB * fScale), '#10B981', `R_B=${RB.toFixed(0)}N`);
        // Load weight M*g downward
        drawArrow(ctx, loadX, deflectedY - 18, loadX, deflectedY - 18 + Math.max(30, weight * fScale), '#EF4444', `Mg=${weight.toFixed(0)}N`);
        // Spring-damper restoring force
        drawArrow(ctx, loadX + 36, deflectedY, loadX + 36, deflectedY - 38, '#A855F7', '-kx - c·du/dt');
      }
    }

    // ------------------------------------------------------------------------
    // 4. ELECTROMAGNETISM: VELOCITY SELECTOR (LORENTZ FORCE)
    // ------------------------------------------------------------------------
    if (selectedId === 'electromagnetism') {
      const { v0 } = safeParams;
      const { FE, FB, Fnet } = telemetry.raw;

      const plateLeft = 70;
      const plateRight = W - 70;
      const topPlateY = 55;
      const botPlateY = H - 55;
      const midY = (topPlateY + botPlateY) / 2;

      // Top (+) plate and Bottom (-) plate
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(plateLeft, topPlateY - 12, plateRight - plateLeft, 12);
      ctx.fillStyle = '#FCA5A5';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? '+ + + +  Top Plate (+)  →  E⃗ points downward  + + + +' : '+ + + +  Placa Superior (+)  →  E⃗ apunta hacia abajo  + + + +', plateLeft + 25, topPlateY - 2);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(plateLeft, botPlateY, plateRight - plateLeft, 12);
      ctx.fillStyle = '#93C5FD';
      ctx.fillText(isEn ? '- - - -  Bottom Plate (-)   |   B⃗ Field (⊗ into page)  - - - -' : '- - - -  Placa Inferior (-)   |   Campo B⃗ (⊗ entrando)  - - - -', plateLeft + 25, botPlateY + 10);

      // Draw B-field crosses (into page)
      ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.font = '13px "JetBrains Mono", monospace';
      for (let x = plateLeft + 30; x < plateRight - 20; x += 65) {
        for (let y = topPlateY + 35; y < botPlateY - 20; y += 50) {
          ctx.fillText('⊗', x, y);
        }
      }

      // Target slit on the right
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(plateRight, topPlateY);
      ctx.lineTo(plateRight, midY - 18);
      ctx.moveTo(plateRight, midY + 18);
      ctx.lineTo(plateRight, botPlateY);
      ctx.stroke();

      // Particle trajectory curve
      const ay = Fnet * 0.035; // transverse acceleration visual scale
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let s = 0; s <= 1; s += 0.02) {
        const px = plateLeft + s * (plateRight - plateLeft);
        const py = Math.max(topPlateY + 8, Math.min(botPlateY - 8, midY - 0.5 * ay * Math.pow(s * 6, 2)));
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Moving charge position
      const progress = (simTime * 0.45) % 1;
      const curX = plateLeft + progress * (plateRight - plateLeft);
      const curY = Math.max(topPlateY + 10, Math.min(botPlateY - 10, midY - 0.5 * ay * Math.pow(progress * 6, 2)));

      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(curX, curY, 9, 0, Math.PI * 2);
      ctx.fill();

      if (showDCL) {
        // Velocity vector v
        drawArrow(ctx, curX, curY, curX + v0 * 1.8, curY, '#10B981', 'v⃗');
        // Electric force F_E = qE
        drawArrow(ctx, curX, curY, curX, curY - FE * 0.85, '#EF4444', 'F⃗_E = qE⃗');
        // Magnetic force F_B = q(v x B)
        drawArrow(ctx, curX, curY, curX, curY - FB * 0.85, '#38BDF8', 'F⃗_B = q(v⃗×B⃗)');
      }
    }

    // ------------------------------------------------------------------------
    // 5. THERMODYNAMICS: IDEAL GAS PISTON & LIVE P-V DIAGRAM
    // ------------------------------------------------------------------------
    if (selectedId === 'thermodynamics') {
      const { V1, V2, T, processType } = safeParams;
      const phase = 0.5 - 0.5 * Math.cos(simTime * 1.6);
      const curV = V1 + (V2 - V1) * phase;

      // Left side: Cylinder & Moving Piston
      const cylX = 55;
      const cylY = 55;
      const cylW = 150;
      const cylH = 200;
      const pistonY = cylY + cylH - (curV / 8.5) * (cylH - 30);

      // Gas glow proportional to temperature
      ctx.fillStyle = T > 420 ? 'rgba(239, 68, 68, 0.22)' : 'rgba(249, 115, 22, 0.18)';
      ctx.fillRect(cylX, pistonY, cylW, cylY + cylH - pistonY);

      // Cylinder walls
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cylX, cylY);
      ctx.lineTo(cylX, cylY + cylH);
      ctx.lineTo(cylX + cylW, cylY + cylH);
      ctx.lineTo(cylX + cylW, cylY);
      ctx.stroke();

      // Piston head
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.fillRect(cylX + 3, pistonY - 16, cylW - 6, 16);
      ctx.strokeRect(cylX + 3, pistonY - 16, cylW - 6, 16);

      // Gas particles bouncing
      ctx.fillStyle = '#FBBF24';
      for (let i = 0; i < 14; i++) {
        const seed = i * 1.7 + simTime * (T / 95);
        const gx = cylX + 14 + ((Math.sin(seed * 1.3) * 0.5 + 0.5) * (cylW - 28));
        const gy = pistonY + 10 + ((Math.cos(seed * 1.7) * 0.5 + 0.5) * Math.max(15, cylY + cylH - pistonY - 20));
        ctx.beginPath();
        ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (showDCL) {
        const midCylX = cylX + cylW / 2;
        drawArrow(ctx, midCylX, pistonY - 8, midCylX, pistonY - 62, '#10B981', 'F_gas = P·A');
        drawArrow(ctx, midCylX - 28, pistonY - 8, midCylX - 28, pistonY + 42, '#38BDF8', 'P₀·A');
        drawArrow(ctx, midCylX + 28, pistonY - 8, midCylX + 28, pistonY + 38, '#EF4444', 'M_p·g');
      }

      // Right side: Live P-V Integral Plot
      const plotX = 270;
      const plotY = 240;
      const plotW = 240;
      const plotH = 175;

      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(plotX, plotY - plotH);
      ctx.lineTo(plotX, plotY);
      ctx.lineTo(plotX + plotW, plotY);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'P (Pressure)' : 'P (Presión)', plotX + 8, plotY - plotH + 12);
      ctx.fillText(isEn ? 'V (Volume) →' : 'V (Volumen) →', plotX + plotW - 95, plotY + 18);

      const vToX = (v) => plotX + (v / 8.5) * plotW;
      const pToY = (v) => {
        const pVal = processType === 1 ? (T * 0.25) / v : (T * 0.25) / V1;
        return plotY - Math.min(plotH - 10, pVal * 2.4);
      };

      // Shaded integral area W = \int P dV
      ctx.fillStyle = V2 >= V1 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.moveTo(vToX(V1), plotY);
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const vv = V1 + ((curV - V1) * i) / steps;
        ctx.lineTo(vToX(vv), pToY(vv));
      }
      ctx.lineTo(vToX(curV), plotY);
      ctx.closePath();
      ctx.fill();

      // P(V) curve
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const vv = 1.0 + (7.2 * i) / 40;
        const px = vToX(vv);
        const py = pToY(vv);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current state dot on P-V curve
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(vToX(curV), pToY(curV), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('W = ∫ P(V) dV', plotX + 65, plotY - 25);
    }

    // ------------------------------------------------------------------------
    // 6. WAVES & GEOPHYSICS: SNELL'S LAW & CRITICAL REFRACTION
    // ------------------------------------------------------------------------
    if (selectedId === 'waves_geophysics') {
      const { theta1, v1, v2, freq } = safeParams;
      const { rad1, isTIR, theta2 } = telemetry.raw;
      const rad2 = (theta2 * Math.PI) / 180;

      const midY = H / 2;
      const hitX = W / 2;

      // Upper Layer 1 & Lower Layer 2
      ctx.fillStyle = 'rgba(14, 116, 144, 0.16)';
      ctx.fillRect(0, 0, W, midY);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.55)';
      ctx.fillRect(0, midY, W, midY);

      // Interface line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(W, midY);
      ctx.stroke();

      // Normal dashed line
      ctx.save();
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(hitX, 18);
      ctx.lineTo(hitX, H - 18);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#93C5FD';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Layer 1 (v₁ = ${v1} km/s)` : `Estrato 1 (v₁ = ${v1} km/s)`, 18, 48);
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText(isEn ? `Layer 2 (v₂ = ${v2} km/s)` : `Estrato 2 (v₂ = ${v2} km/s)`, 18, H - 18);

      const rayLen = 135;
      const incStartX = hitX - rayLen * Math.sin(rad1);
      const incStartY = midY - rayLen * Math.cos(rad1);

      const reflEndX = hitX + rayLen * Math.sin(rad1);
      const reflEndY = midY - rayLen * Math.cos(rad1);

      const refrEndX = hitX + rayLen * Math.sin(rad2);
      const refrEndY = midY + rayLen * Math.cos(rad2);

      // Angle arcs for theta1 and theta2
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hitX, midY, 34, -Math.PI / 2 - rad1, -Math.PI / 2);
      ctx.stroke();

      if (!isTIR) {
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(hitX, midY, 34, Math.PI / 2 - rad2, Math.PI / 2);
        ctx.stroke();
      }

      // Animated wavefront pulses moving along rays
      const pulsePhase = (simTime * (freq || 2.0) * 0.6) % 1;
      for (let k = 0; k < 3; k++) {
        const frac = (pulsePhase + k / 3) % 1;
        // Incident pulse
        const ix = incStartX + frac * (hitX - incStartX);
        const iy = incStartY + frac * (midY - incStartY);
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(ix, iy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Reflected pulse
        const rx = hitX + frac * (reflEndX - hitX);
        const ry = midY + frac * (reflEndY - midY);
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Refracted / Head-wave pulse
        const tx = hitX + frac * (refrEndX - hitX);
        const ty = midY + frac * (refrEndY - midY);
        ctx.fillStyle = isTIR ? '#EF4444' : '#10B981';
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Incident ray
      drawArrow(ctx, incStartX, incStartY, hitX, midY, '#FBBF24', showDCL ? `k⃗_inc (θ₁=${theta1}°)` : '');
      // Reflected ray
      drawArrow(ctx, hitX, midY, reflEndX, reflEndY, '#38BDF8', showDCL ? `k⃗_refl (θ₁=${theta1}°)` : '');
      // Refracted or Critical Head wave ray
      drawArrow(
        ctx,
        hitX,
        midY,
        refrEndX,
        refrEndY,
        isTIR ? '#EF4444' : '#10B981',
        showDCL ? (isTIR ? 'Onda Crítica (90°)' : `k⃗_refr (θ₂=${Number(theta2).toFixed(0)}°)`) : ''
      );
    }

    // ------------------------------------------------------------------------
    // 7. VECTOR CALCULUS: CURL, DIVERGENCE & GREEN'S / STOKES' THEOREM
    // ------------------------------------------------------------------------
    if (selectedId === 'vector_calculus') {
      const { omega = 1.5, kDiv = 0.0, radius = 2.2, particles = 20 } = safeParams;
      const { curlVal = 3.0, circulation = 45.6 } = telemetry.raw;
      const midX = W / 2;
      const midY = H / 2;
      const scale = 48; // pixels per unit meter

      // Draw subtle axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(W, midY);
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, H);
      ctx.stroke();

      // Draw vector field arrows on a grid
      const gridStep = 0.65;
      for (let gx = -4.5; gx <= 4.5; gx += gridStep) {
        for (let gy = -2.6; gy <= 2.6; gy += gridStep) {
          const fx = kDiv * gx - omega * gy;
          const fy = omega * gx + kDiv * gy;
          const mag = Math.hypot(fx, fy);
          if (mag < 0.05) continue;

          const px = midX + gx * scale;
          const py = midY - gy * scale; // screen Y inverted

          const arrowLen = Math.min(22, Math.max(6, mag * 5));
          const dirX = fx / mag;
          const dirY = -fy / mag;

          const endX = px + dirX * arrowLen;
          const endY = py + dirY * arrowLen;

          const hue = Math.abs(omega) > 0.1 ? 240 : 160;
          ctx.strokeStyle = `hsla(${hue}, 70%, 65%, 0.45)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          const aAngle = Math.atan2(dirY, dirX);
          ctx.fillStyle = `hsla(${hue}, 70%, 65%, 0.55)`;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - 4 * Math.cos(aAngle - Math.PI / 6), endY - 4 * Math.sin(aAngle - Math.PI / 6));
          ctx.lineTo(endX - 4 * Math.cos(aAngle + Math.PI / 6), endY - 4 * Math.sin(aAngle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
        }
      }

      // Draw Closed Integration Curve C (Circle of radius R)
      const rPix = radius * scale;
      ctx.save();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(midX, midY, rPix, 0, Math.PI * 2);
      ctx.stroke();

      // Shaded area D inside C
      ctx.fillStyle = Math.abs(curlVal) > 0.05 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.12)';
      ctx.fill();

      // Label Curve C and Area D
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Curve C (R=${radius}m)` : `Curva C (R=${radius}m)`, midX + rPix * 0.72, midY - rPix * 0.72 - 6);
      ctx.fillStyle = '#C7D2FE';
      ctx.fillText(isEn ? `Area D: ∬(∇×F) dA = ${circulation.toFixed(1)} J` : `Área D: ∬(∇×F) dA = ${circulation.toFixed(1)} J`, midX - 95, midY + 4);
      ctx.restore();

      // Animated tracer particles following flow
      const numP = Math.min(40, Math.max(10, particles));
      for (let i = 0; i < numP; i++) {
        const seedAngle = (i * ((Math.PI * 2) / numP)) + simTime * omega * 0.5;
        const seedRadius = (0.3 + (i % 5) * 0.55) * radius * (kDiv < 0 ? Math.max(0.2, 1 - (simTime * 0.08) % 1) : 1);
        const ppx = midX + Math.cos(seedAngle) * seedRadius * scale;
        const ppy = midY - Math.sin(seedAngle) * seedRadius * scale;

        ctx.fillStyle = i % 2 === 0 ? '#38BDF8' : '#A78BFA';
        ctx.beginPath();
        ctx.arc(ppx, ppy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // DCL / VECTORS OVERLAY: Highlight line element dr, vector F, and tangent projection
      if (showDCL) {
        const tAngle = (simTime * 0.8) % (Math.PI * 2);
        const px = midX + rPix * Math.cos(tAngle);
        const py = midY - rPix * Math.sin(tAngle);

        const txScreen = -Math.sin(tAngle);
        const tyScreen = -Math.cos(tAngle);

        const mx = radius * Math.cos(tAngle);
        const my = radius * Math.sin(tAngle);
        const fx = kDiv * mx - omega * my;
        const fy = omega * mx + kDiv * my;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        drawArrow(ctx, px, py, px + txScreen * 45, py + tyScreen * 45, '#F59E0B', isEn ? 'd r⃗ (tangent)' : 'd r⃗ (tangente)', 2.5);

        const fScreenX = fx * 18;
        const fScreenY = -fy * 18;
        drawArrow(ctx, px, py, px + fScreenX, py + fScreenY, '#38BDF8', 'F⃗(x,y)', 2.5);

        if (Math.abs(omega) > 0.05) {
          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(-simTime * omega);
          ctx.strokeStyle = '#EC4899';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-18, 0);
          ctx.lineTo(18, 0);
          ctx.moveTo(0, -18);
          ctx.lineTo(0, 18);
          ctx.stroke();
          ctx.fillStyle = '#EC4899';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.fillStyle = '#F472B6';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText(isEn ? 'Paddle: ∇×F⃗ curls' : 'Paleta: ∇×F⃗ rota', midX - 45, midY + 28);
        }
      }
    }

    // ------------------------------------------------------------------------
    // 8. GENERAL RELATIVITY: SCHWARZSCHILD GEODESIC ROSETTE & PERIHELION SHIFT
    // ------------------------------------------------------------------------
    if (selectedId === 'relativity') {
      const { mass = 1.0, eccentricity = 0.5, grFactor = 1.5, semiMajor = 2.8 } = safeParams;
      const { rMin = 1.4, deltaPhiDeg = 4.5 } = telemetry.raw;
      const midX = W / 2 - 40;
      const midY = H / 2;
      const scale = 36; // pixels per AU

      // Draw faint background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 18; s++) {
        const sx = ((s * 79 + 43) % (W - 20)) + 10;
        const sy = ((s * 53 + 27) % (H - 20)) + 10;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Schwarzschild central mass (Sun / Black Hole)
      const starRadius = Math.max(10, mass * 12);
      const grad = ctx.createRadialGradient(midX, midY, 3, midX, midY, starRadius * 2.2);
      grad.addColorStop(0, '#FEF08A');
      grad.addColorStop(0.35, '#F59E0B');
      grad.addColorStop(0.7, 'rgba(234, 88, 12, 0.45)');
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(midX, midY, starRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(midX, midY, starRadius, 0, Math.PI * 2);
      ctx.fill();

      // Precessing Rosette Orbit Trajectory
      const precRate = grFactor * 0.18;
      const orbitLoops = grFactor > 0.05 ? 3.5 : 1.0;
      const totalTheta = orbitLoops * Math.PI * 2;
      const steps = 220;

      ctx.save();
      ctx.strokeStyle = grFactor > 0.05 ? 'rgba(236, 72, 153, 0.65)' : 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const th = (i / steps) * totalTheta;
        const phiShift = precRate * th;
        const r = (semiMajor * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(th));
        const px = midX + r * scale * Math.cos(th + phiShift);
        const py = midY - r * scale * Math.sin(th + phiShift);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Current Planet / Mercury position
      const currentTh = simTime * 2.2;
      const curShift = precRate * currentTh;
      const curR = (semiMajor * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(currentTh));
      const curX = midX + curR * scale * Math.cos(currentTh + curShift);
      const curY = midY - curR * scale * Math.sin(currentTh + curShift);

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // DCL / VECTORS OVERLAY: F_Newton, F_GR cubic correction, and velocity v
      if (showDCL) {
        const dx = midX - curX;
        const dy = midY - curY;
        const dist = Math.hypot(dx, dy);
        const nx = dx / dist;
        const ny = dy / dist;

        const fNewtonLen = Math.min(75, Math.max(25, (40 / Math.max(0.5, curR * curR)) * 25));
        drawArrow(ctx, curX, curY, curX + nx * fNewtonLen, curY + ny * fNewtonLen, '#38BDF8', 'F⃗_Newton', 2.5);

        if (grFactor > 0.05) {
          const fGRLen = Math.min(45, fNewtonLen * 0.45 * grFactor);
          drawArrow(ctx, curX, curY, curX + nx * fGRLen, curY + ny * fGRLen, '#EC4899', 'ΔF⃗_RG (r⁻⁴)', 2);
        }

        const vx = -Math.sin(currentTh + curShift);
        const vy = -Math.cos(currentTh + curShift);
        drawArrow(ctx, curX, curY, curX + vx * 36, curY + vy * 36, '#10B981', 'v⃗(t)', 2);

        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + rMin * scale, midY);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText(isEn ? `r_min = ${rMin.toFixed(2)} AU` : `r_mín = ${rMin.toFixed(2)} UA`, midX + rMin * scale * 0.45, midY - 6);
      }

      // Inset plot on the right: Effective Potential V_eff(r)
      const potX = W - 150;
      const potY = H - 35;
      const potW = 135;
      const potH = 95;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(potX - 5, potY - potH - 15, potW + 10, potH + 25);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(potX - 5, potY - potH - 15, potW + 10, potH + 25);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('V_eff(r) Schwarzschild', potX, potY - potH - 3);

      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let k = 0; k <= 30; k++) {
        const rv = 0.8 + (k / 30) * 4.5;
        const vval = -1.8 / rv + 2.2 / (rv * rv) - (grFactor * 0.6) / (rv * rv * rv);
        const kx = potX + (k / 30) * potW;
        const ky = potY - (vval + 1.2) * 28;
        if (k === 0) ctx.moveTo(kx, ky);
        else ctx.lineTo(kx, ky);
      }
      ctx.stroke();

      const normCurR = Math.min(1, Math.max(0, (curR - 0.8) / 4.5));
      const curVVal = -1.8 / curR + 2.2 / (curR * curR) - (grFactor * 0.6) / (curR * curR * curR);
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(potX + normCurR * potW, potY - (curVVal + 1.2) * 28, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ------------------------------------------------------------------------
    // 9. COUPLED OSCILLATORS: 2 MASSES, 3 SPRINGS & NORMAL MODES
    // ------------------------------------------------------------------------
    if (selectedId === 'coupled_oscillators') {
      const { m1 = 2.0, m2 = 2.0, kOuter = 18.0, kCoupling = 10.0, mode = 1 } = safeParams;
      const { w1 = 3.0, w2 = 4.36 } = telemetry.raw;

      const groundY = H / 2 + 35;
      const wallLeft = 50;
      const wallRight = W - 50;
      const blockW = 54;
      const blockH = 40;

      // Draw Walls & Ground
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(wallLeft - 18, groundY - 80, 18, 90);
      ctx.fillRect(wallRight, groundY - 80, 18, 90);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(wallLeft - 18, groundY - 80, 18, 90);
      ctx.strokeRect(wallRight, groundY - 80, 18, 90);

      ctx.beginPath();
      ctx.moveTo(wallLeft - 18, groundY);
      ctx.lineTo(wallRight + 18, groundY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      for (let hx = wallLeft - 10; hx < wallRight + 10; hx += 16) {
        ctx.beginPath();
        ctx.moveTo(hx, groundY);
        ctx.lineTo(hx - 8, groundY + 8);
        ctx.stroke();
      }

      // Rest equilibrium centers
      const eq1 = W / 2 - 85;
      const eq2 = W / 2 + 85;

      const amp = 32;
      let x1Disp = 0;
      let x2Disp = 0;

      if (mode === 1) {
        x1Disp = amp * Math.cos(simTime * w1);
        x2Disp = amp * Math.cos(simTime * w1);
      } else if (mode === 2) {
        x1Disp = amp * Math.cos(simTime * w2);
        x2Disp = -amp * Math.cos(simTime * w2);
      } else {
        const wMean = (w1 + w2) / 2;
        const wMod = Math.abs(w2 - w1) / 2;
        x1Disp = amp * Math.cos(simTime * wMod) * Math.cos(simTime * wMean);
        x2Disp = amp * Math.sin(simTime * wMod) * Math.sin(simTime * wMean);
      }

      const b1Center = eq1 + x1Disp;
      const b2Center = eq2 + x2Disp;

      const b1Left = b1Center - blockW / 2;
      const b1Right = b1Center + blockW / 2;
      const b2Left = b2Center - blockW / 2;
      const b2Right = b2Center + blockW / 2;
      const blockY = groundY - blockH;

      // Draw Springs
      drawCoiledSpring(ctx, wallLeft, groundY - blockH / 2, b1Left, groundY - blockH / 2, 7, '#38BDF8');
      drawCoiledSpring(ctx, b1Right, groundY - blockH / 2, b2Left, groundY - blockH / 2, 7, '#A78BFA');
      drawCoiledSpring(ctx, b2Right, groundY - blockH / 2, wallRight, groundY - blockH / 2, 7, '#34D399');

      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`k=${kOuter}`, (wallLeft + b1Left) / 2 - 16, groundY - blockH - 4);
      ctx.fillStyle = '#C084FC';
      ctx.fillText(`k₁₂=${kCoupling}`, (b1Right + b2Left) / 2 - 18, groundY - blockH - 4);
      ctx.fillStyle = '#34D399';
      ctx.fillText(`k=${kOuter}`, (b2Right + wallRight) / 2 - 16, groundY - blockH - 4);

      // Block 1
      ctx.fillStyle = showDCL ? 'rgba(56, 189, 248, 0.35)' : '#0284C7';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.fillRect(b1Left, blockY, blockW, blockH);
      ctx.strokeRect(b1Left, blockY, blockW, blockH);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`m₁=${m1}k`, b1Left + 6, blockY + 24);

      // Block 2
      ctx.fillStyle = showDCL ? 'rgba(16, 185, 129, 0.35)' : '#059669';
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2;
      ctx.fillRect(b2Left, blockY, blockW, blockH);
      ctx.strokeRect(b2Left, blockY, blockW, blockH);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`m₂=${m2}k`, b2Left + 6, blockY + 24);

      // Equilibrium marks
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(eq1, groundY - 55);
      ctx.lineTo(eq1, groundY + 10);
      ctx.moveTo(eq2, groundY - 55);
      ctx.lineTo(eq2, groundY + 10);
      ctx.stroke();
      ctx.restore();

      if (showDCL) {
        const f1Outer = -kOuter * (b1Center - eq1);
        const f1Coupl = kCoupling * ((b2Center - eq2) - (b1Center - eq1));
        drawArrow(ctx, b1Center, blockY + 12, b1Center + f1Outer * 1.4, blockY + 12, '#38BDF8', 'F_k1', 2);
        drawArrow(ctx, b1Center, blockY + 28, b1Center + f1Coupl * 1.4, blockY + 28, '#C084FC', 'F_k12', 2);

        const f2Outer = -kOuter * (b2Center - eq2);
        const f2Coupl = -f1Coupl;
        drawArrow(ctx, b2Center, blockY + 12, b2Center + f2Outer * 1.4, blockY + 12, '#34D399', 'F_k2', 2);
        drawArrow(ctx, b2Center, blockY + 28, b2Center + f2Coupl * 1.4, blockY + 28, '#C084FC', '-F_k12', 2);
      }
    }

    // ------------------------------------------------------------------------
    // 10. GEOSTROPHIC WIND: PRESSURE GRADIENT & CORIOLIS BALANCE
    // ------------------------------------------------------------------------
    if (selectedId === 'geostrophic_wind') {
      const { deltaP = 16.0, latitude = 45, hemisphere = 1, rho = 1.20 } = safeParams;
      const { vg = 129.3, vgKmh = 465.5 } = telemetry.raw;

      const numIsobars = 5;
      const isobarSpacing = H / (numIsobars + 1);

      ctx.save();
      for (let i = 1; i <= numIsobars; i++) {
        const iy = i * isobarSpacing;
        const pVal = 1000 + (numIsobars - i + 1) * (deltaP / 2);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, iy);
        ctx.lineTo(W - 35, iy);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText(`${pVal.toFixed(0)} hPa`, 40, iy - 6);
      }
      ctx.restore();

      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#EF4444';
      ctx.fillText(isEn ? 'L (Low Pressure - Cyclone)' : 'L (Baja Presión - Ciclón)', W / 2 - 80, isobarSpacing - 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(isEn ? 'H (High Pressure - Anticyclone)' : 'H (Alta Presión - Anticiclón)', W / 2 - 85, H - 15);

      const windDir = hemisphere >= 0 ? 1 : -1;
      const speedNorm = Math.min(6, Math.max(0.8, (vg / 35)));

      ctx.fillStyle = '#34D399';
      for (let p = 0; p < 24; p++) {
        const row = 1 + (p % numIsobars);
        const py = row * isobarSpacing;
        const progress = ((simTime * speedNorm * 0.25 + p * 0.14) % 1);
        const px = windDir > 0
          ? 35 + progress * (W - 70)
          : (W - 35) - progress * (W - 70);

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const parcelX = W / 2;
      const parcelY = H / 2;

      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(parcelX, parcelY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Air Parcel' : 'Parcela Aire', parcelX - 35, parcelY - 18);

      const vVecLen = Math.min(85, Math.max(30, speedNorm * 32));
      drawArrow(ctx, parcelX, parcelY, parcelX + windDir * vVecLen, parcelY, '#34D399', `v⃗_g (${vgKmh.toFixed(0)} km/h)`, 3);

      if (showDCL) {
        const fPLen = 55;
        drawArrow(ctx, parcelX, parcelY, parcelX, parcelY - fPLen, '#EF4444', 'F⃗_P = -(1/ρ)∇P', 2.5);

        const fCorLen = 55;
        drawArrow(ctx, parcelX, parcelY, parcelX, parcelY + fCorLen, '#38BDF8', 'F⃗_Cor = -2(Ω⃗×v⃗)', 2.5);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(parcelX + 45, parcelY - 32, 160, 64);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1;
        ctx.strokeRect(parcelX + 45, parcelY - 32, 160, 64);

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText(isEn ? 'Geostrophic Equilibrium:' : 'Equilibrio Geostrófico:', parcelX + 52, parcelY - 16);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('F⃗_P + F⃗_Cor = 0⃗', parcelX + 52, parcelY);
        ctx.fillText(hemisphere >= 0 ? (isEn ? 'Right Deflection (NH)' : 'Desviación Der. (NH)') : (isEn ? 'Left Deflection (SH)' : 'Desviación Izq. (SH)'), parcelX + 52, parcelY + 16);
      }
    }

    // ------------------------------------------------------------------------
    // 11. THEORETICAL SEISMOLOGY: BEACHBALL (FOCAL MECHANISM) & P/S WAVEFRONTS
    // ------------------------------------------------------------------------
    if (selectedId === 'seismology_beachball') {
      const { strike = 15, dip = 20, rake = 90, magnitude = 8.8 } = safeParams;
      const { regimeEs, regimeEn, logM0, m0Sci, m0Exp } = telemetry.raw;

      const bbCenterX = 135;
      const bbCenterY = H / 2;
      const bbRadius = 68;

      ctx.save();
      ctx.translate(bbCenterX, bbCenterY);

      // Background of focal sphere
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(0, 0, bbRadius, 0, Math.PI * 2);
      ctx.fill();

      const strikeRad = ((strike - 90) * Math.PI) / 180;
      ctx.rotate(strikeRad);

      const dipRatio = Math.sin((dip * Math.PI) / 180);

      ctx.beginPath();
      ctx.arc(0, 0, bbRadius, 0, Math.PI * 2);
      ctx.clip();

      if (rake >= 45 && rake <= 135) {
        // Thrust faulting (Chili / Subduction): Center is compressional
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, 0, bbRadius, 0, Math.PI * 2);
        ctx.fill();

        const crescentOffset = bbRadius * (1 - dipRatio * 0.7);
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(0, -crescentOffset, bbRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, crescentOffset + 15, bbRadius * 0.75, 0, Math.PI * 2);
        ctx.fill();
      } else if (rake >= -135 && rake <= -45) {
        // Normal faulting (Iceland / Rift): Center is dilatational, sides compressional
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(0, 0, bbRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#EF4444';
        const crescentOffset = bbRadius * (1 - dipRatio * 0.7);
        ctx.beginPath();
        ctx.arc(0, -crescentOffset, bbRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, crescentOffset + 15, bbRadius * 0.75, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Strike-slip faulting (Turkey / San Andreas): 4 alternating quadrants
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, bbRadius, 0, Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, bbRadius, Math.PI, (3 * Math.PI) / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, bbRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(-bbRadius, 0);
      ctx.lineTo(bbRadius, 0);
      ctx.moveTo(0, -bbRadius);
      ctx.lineTo(0, bbRadius);
      ctx.stroke();
      ctx.setLineDash([]);

      if (showDCL) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('P', -3, 3);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, -bbRadius * 0.65, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0284C7';
        ctx.fillText('T', -3, -bbRadius * 0.65 + 3);
      }

      ctx.restore();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('N', bbCenterX - 4, bbCenterY - bbRadius - 8);
      ctx.fillText('S', bbCenterX - 4, bbCenterY + bbRadius + 16);
      ctx.fillText('W', bbCenterX - bbRadius - 18, bbCenterY + 4);
      ctx.fillText('E', bbCenterX + bbRadius + 8, bbCenterY + 4);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Stereographic Projection' : 'Proyección Estereográfica', bbCenterX - 65, H - 25);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`φ=${strike}°  δ=${dip}°  λ=${rake}°`, bbCenterX - 55, H - 12);

      // Fault Plane Cross-Section & Expanding P/S Wavefronts
      const faultX = W - 180;
      const faultY = H / 2 - 10;
      const dipRad = (dip * Math.PI) / 180;

      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(faultX - 110, faultY - 90, 230, 180);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(faultX - 110, faultY - 90, 230, 180);

      const faultLen = 140;
      const fx1 = faultX - (faultLen / 2) * Math.cos(dipRad);
      const fy1 = faultY - (faultLen / 2) * Math.sin(dipRad);
      const fx2 = faultX + (faultLen / 2) * Math.cos(dipRad);
      const fy2 = faultY + (faultLen / 2) * Math.sin(dipRad);

      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fx1, fy1);
      ctx.lineTo(fx2, fy2);
      ctx.stroke();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(faultX, faultY, 5, 0, Math.PI * 2);
      ctx.fill();

      const pRadius = ((simTime * 48) % 110) + 12;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(faultX, faultY, pRadius, 0, Math.PI * 2);
      ctx.stroke();

      const sRadius = pRadius / Math.sqrt(3);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(faultX, faultY, sRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(isEn ? `P Wave (v_P=6.0 km/s)` : `Onda P (v_P=6.0 km/s)`, faultX + pRadius * 0.7 + 4, faultY - pRadius * 0.7);
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(isEn ? `S Wave (v_S=3.5 km/s)` : `Onda S (v_S=3.5 km/s)`, faultX + sRadius * 0.7 + 4, faultY + sRadius * 0.7);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Hanging Wall' : 'Bloque Techo', faultX - 75, faultY - 55);
      ctx.fillText(isEn ? 'Footwall' : 'Bloque Piso', faultX + 25, faultY + 65);

      if (showDCL) {
        const slipSign = rake >= 0 ? -1 : 1;
        const slipDx = slipSign * 35 * Math.cos(dipRad);
        const slipDy = slipSign * 35 * Math.sin(dipRad);
        drawArrow(ctx, faultX - 30, faultY - 30, faultX - 30 + slipDx, faultY - 30 + slipDy, '#34D399', 'u⃗ (Slip)', 2.5);

        const nDx = -35 * Math.sin(dipRad);
        const nDy = 35 * Math.cos(dipRad);
        drawArrow(ctx, faultX, faultY, faultX + nDx, faultY + nDy, '#C084FC', 'n̂ (Normal)', 2.5);

        drawArrow(ctx, faultX + 70, faultY, faultX + 20, faultY, '#EF4444', isEn ? 'P⃗ (Compression)' : 'P⃗ (Compresión)', 2);
        drawArrow(ctx, faultX - 70, faultY, faultX - 20, faultY, '#EF4444', 'P⃗', 2);
      }

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // 12. POTENTIAL FIELDS: GRAVIMETRY, POISSON PDE & AIRY ISOSTASY (ANDES)
    // ------------------------------------------------------------------------
    if (selectedId === 'bouguer_gravity') {
      const { mountainHeight = 4000, crustDensity = 2670, mantleDensity = 3300, crustThickness = 35 } = safeParams;
      const { rootKm, totalCrustKm, bouguerAnomalyMgal, freeAirMgal } = telemetry.raw;

      const profileW = W - 70;
      const profileStartX = 35;
      const midY = 110;

      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(profileStartX, midY);
      ctx.lineTo(profileStartX + profileW, midY);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('0 mGal', profileStartX - 28, midY + 3);
      ctx.fillText('+200', profileStartX - 28, midY - 35);
      ctx.fillText('-300', profileStartX - 28, midY + 45);

      // Curve 1: Free Air Anomaly
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px <= profileW; px += 4) {
        const xDist = (px - profileW / 2) / 75;
        const faVal = freeAirMgal * Math.exp(-xDist * xDist);
        const py = midY - (faVal / 300) * 50;
        if (px === 0) ctx.moveTo(profileStartX + px, py);
        else ctx.lineTo(profileStartX + px, py);
      }
      ctx.stroke();

      // Curve 2: Bouguer Anomaly
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 0; px <= profileW; px += 4) {
        const xDist = (px - profileW / 2) / 95;
        const bVal = bouguerAnomalyMgal * Math.exp(-xDist * xDist);
        const py = midY - (bVal / 300) * 45;
        if (px === 0) ctx.moveTo(profileStartX + px, py);
        else ctx.lineTo(profileStartX + px, py);
      }
      ctx.stroke();

      // Legend
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Δg_FA (Free-Air): +${freeAirMgal.toFixed(0)} mGal` : `Δg_FA (Aire Libre): +${freeAirMgal.toFixed(0)} mGal`, profileStartX + 8, 22);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(isEn ? `Δg_B (Bouguer): ${bouguerAnomalyMgal.toFixed(0)} mGal (Andean Minimum)` : `Δg_B (Bouguer): ${bouguerAnomalyMgal.toFixed(0)} mGal (Mínimo Andino)`, profileStartX + 8, 36);

      // Bottom Section: Crustal Cross-Section & Moho Root
      const groundY = 165;
      const seaY = groundY + 15;
      const normalMohoY = seaY + 45;
      const rootScale = Math.min(65, (rootKm / 30) * 55);

      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(profileStartX, seaY, profileW, H - seaY - 15);

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(profileStartX, seaY);

      for (let px = 0; px <= profileW; px += 4) {
        const xDist = (px - profileW / 2) / 65;
        const topoY = seaY - (mountainHeight / 6500) * 35 * Math.exp(-xDist * xDist);
        ctx.lineTo(profileStartX + px, topoY);
      }
      ctx.lineTo(profileStartX + profileW, seaY);
      ctx.lineTo(profileStartX + profileW, normalMohoY);

      for (let px = profileW; px >= 0; px -= 4) {
        const xDist = (px - profileW / 2) / 75;
        const mohoY = normalMohoY + rootScale * Math.exp(-xDist * xDist);
        ctx.lineTo(profileStartX + px, mohoY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px <= profileW; px += 4) {
        const xDist = (px - profileW / 2) / 75;
        const mohoY = normalMohoY + rootScale * Math.exp(-xDist * xDist);
        if (px === 0) ctx.moveTo(profileStartX + px, mohoY);
        else ctx.lineTo(profileStartX + px, mohoY);
      }
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Mountain Range (+${mountainHeight}m)` : `Cordillera (+${mountainHeight}m)`, W / 2 - 50, seaY - 24);
      ctx.fillText(isEn ? `Crust (ρ_c = ${crustDensity} kg/m³)` : `Corteza (ρ_c = ${crustDensity} kg/m³)`, profileStartX + 12, normalMohoY - 12);
      ctx.fillText(isEn ? `Upper Mantle (ρ_m = ${mantleDensity} kg/m³)` : `Manto Superior (ρ_m = ${mantleDensity} kg/m³)`, profileStartX + 12, H - 22);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Moho Discontinuity (Airy Root b = ${rootKm.toFixed(1)} km)` : `Discontinuidad de Moho (Raíz b = ${rootKm.toFixed(1)} km)`, W / 2 - 95, normalMohoY + rootScale + 14);

      if (showDCL) {
        drawArrow(ctx, W / 2, seaY - 25, W / 2, seaY + 15, '#EF4444', isEn ? 'Topographic Load' : 'Peso Topografía', 2.5);
        drawArrow(ctx, W / 2, normalMohoY + rootScale + 10, W / 2, normalMohoY + 20, '#10B981', isEn ? 'Isostatic Buoyancy' : 'Empuje Isostático', 2.5);
      }

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // 13. DYNAMICAL OCEANOGRAPHY: EKMAN SPIRAL & COASTAL UPWELLING (CHILE)
    // ------------------------------------------------------------------------
    if (selectedId === 'ekman_spiral') {
      const { windSpeed = 12, latitude = -33, eddyViscosity = 0.05 } = safeParams;
      const { ekmanDepth, v0, ekmanTransport, isSouth } = telemetry.raw;

      const oceanCenterX = 150;
      const oceanCenterY = 70;
      const depthLevels = 6;
      const maxVecLen = Math.min(85, Math.max(35, v0 * 65));

      ctx.save();
      ctx.translate(oceanCenterX, oceanCenterY);

      for (let lvl = 0; lvl <= depthLevels; lvl++) {
        const ly = lvl * 28;
        const normZ = lvl / depthLevels;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, ly, 75, 22, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`-${(normZ * ekmanDepth).toFixed(0)}m`, 82, ly + 3);
      }

      drawArrow(ctx, 0, -25, 0, -60, '#34D399', isEn ? `Wind W=${windSpeed} m/s` : `Viento W=${windSpeed} m/s`, 3);

      const deflAngle = isSouth ? (-Math.PI / 2 - Math.PI / 4) : (-Math.PI / 2 + Math.PI / 4);

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let lvl = 0; lvl <= depthLevels; lvl++) {
        const ly = lvl * 28;
        const normZ = lvl / depthLevels;
        const decay = Math.exp(-normZ * Math.PI);
        const rotAngle = deflAngle + (isSouth ? -1 : 1) * normZ * Math.PI;

        const curLen = maxVecLen * decay;
        const vx = curLen * Math.cos(rotAngle);
        const vy = ly + curLen * Math.sin(rotAngle) * 0.35;

        if (lvl === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);

        drawArrow(ctx, 0, ly, vx, vy, lvl === 0 ? '#0284C7' : 'rgba(56, 189, 248, 0.7)', lvl === 0 ? `V₀=${v0.toFixed(2)}m/s` : '', 2);
      }
      ctx.stroke();

      const transX = isSouth ? -90 : 90;
      drawArrow(ctx, 0, 50, transX, 50, '#C084FC', isEn ? `Net Transport 90° (${ekmanTransport.toFixed(1)} m²/s)` : `Transporte Neto 90° (${ekmanTransport.toFixed(1)} m²/s)`, 3.5);

      ctx.restore();

      // Right Side: Chilean Coast Upwelling Cross-Section
      const coastLeft = W - 220;
      const coastTop = 30;
      const coastW = 200;
      const coastH = H - 50;

      ctx.save();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(coastLeft, coastTop, coastW, coastH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(coastLeft, coastTop, coastW, coastH);

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(coastLeft + coastW - 35, coastTop);
      ctx.lineTo(coastLeft + coastW, coastTop);
      ctx.lineTo(coastLeft + coastW, coastTop + coastH);
      ctx.lineTo(coastLeft + coastW - 120, coastTop + coastH);
      ctx.lineTo(coastLeft + coastW - 65, coastTop + 80);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isSouth ? (isEn ? 'Chile Coast' : 'Costa de Chile') : (isEn ? 'Continental Coast' : 'Costa Continental'), coastLeft + coastW - 85, coastTop + 20);

      drawArrow(ctx, coastLeft + coastW - 55, coastTop + 14, coastLeft + 15, coastTop + 14, '#C084FC', isEn ? 'Offshore (West)' : 'Mar Adentro (Oeste)', 2.5);

      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(coastLeft + 25, coastTop + coastH - 25);
      ctx.quadraticCurveTo(coastLeft + 85, coastTop + coastH - 35, coastLeft + coastW - 75, coastTop + 35);
      ctx.stroke();

      ctx.fillStyle = '#34D399';
      for (let b = 0; b < 6; b++) {
        const bProgress = ((simTime * 0.4 + b * 0.18) % 1);
        const bx = coastLeft + 35 + bProgress * (coastW - 120);
        const by = coastTop + coastH - 30 - bProgress * (coastH - 70);
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Humboldt Upwelling' : 'Surgencia Humboldt', coastLeft + 10, coastTop + coastH - 12);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Cold nutrient-rich waters' : 'Aguas frías ricas en nutrientes', coastLeft + 10, coastTop + coastH);

      if (showDCL) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(coastLeft + 10, coastTop + 35, 125, 48);
        ctx.strokeStyle = '#06B6D4';
        ctx.strokeRect(coastLeft + 10, coastTop + 35, 125, 48);
        ctx.fillStyle = '#06B6D4';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText(isEn ? 'Ekman Balance:' : 'Balance de Ekman:', coastLeft + 16, coastTop + 48);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText('A_z (∂²V/∂z²) = if V', coastLeft + 16, coastTop + 62);
        ctx.fillText(`D_E = ${ekmanDepth.toFixed(1)} m`, coastLeft + 16, coastTop + 76);
      }

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // 14. ELECTROMAGNETIC METHODS: MAGNETOTELLURICS & SKIN DEPTH
    // ------------------------------------------------------------------------
    if (selectedId === 'magnetotellurics') {
      const { frequency = 10, resTop = 20, resBottom = 500, layerThickness = 300 } = safeParams;
      const { skinDepth1, appRes, period } = telemetry.raw;

      const strataLeft = 35;
      const strataW = 230;
      const strataH = H - 50;

      ctx.save();
      const layer1Height = Math.min(strataH * 0.65, Math.max(35, (layerThickness / 1000) * strataH * 0.7));
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(strataLeft, 25, strataW, layer1Height);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(strataLeft, 25, strataW, layer1Height);

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(strataLeft, 25 + layer1Height, strataW, strataH - layer1Height);
      ctx.strokeRect(strataLeft, 25 + layer1Height, strataW, strataH - layer1Height);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? `Layer 1: ρ₁ = ${resTop} Ω·m (h₁ = ${layerThickness}m)` : `Capa 1: ρ₁ = ${resTop} Ω·m (h₁ = ${layerThickness}m)`, strataLeft + 8, 42);
      ctx.fillStyle = '#C084FC';
      ctx.fillText(isEn ? `Basement: ρ₂ = ${resBottom} Ω·m` : `Basamento: ρ₂ = ${resBottom} Ω·m`, strataLeft + 8, 25 + layer1Height + 20);

      const waveMidX = strataLeft + strataW / 2 + 20;
      const skinDepthPx = Math.min(strataH - 10, (skinDepth1 / 1000) * strataH * 0.7);

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let y = 0; y <= strataH; y += 2) {
        const depthRatio = skinDepthPx > 0 ? y / skinDepthPx : 1;
        const amp = 45 * Math.exp(-depthRatio);
        const wave = amp * Math.cos(simTime * 8 - depthRatio * Math.PI * 2);
        const wx = waveMidX + wave;
        const wy = 25 + y;
        if (y === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      for (let y = 0; y <= strataH; y += 4) {
        const depthRatio = skinDepthPx > 0 ? y / skinDepthPx : 1;
        const amp = 45 * Math.exp(-depthRatio);
        if (y === 0) ctx.moveTo(waveMidX + amp, 25 + y);
        else ctx.lineTo(waveMidX + amp, 25 + y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let y = 0; y <= strataH; y += 4) {
        const depthRatio = skinDepthPx > 0 ? y / skinDepthPx : 1;
        const amp = 45 * Math.exp(-depthRatio);
        if (y === 0) ctx.moveTo(waveMidX - amp, 25 + y);
        else ctx.lineTo(waveMidX - amp, 25 + y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const skinMarkerY = 25 + skinDepthPx;
      if (skinMarkerY < 25 + strataH) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(strataLeft, skinMarkerY);
        ctx.lineTo(strataLeft + strataW, skinMarkerY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText(`Skin Depth δ = ${skinDepth1.toFixed(0)}m (1/e ≈ 37%)`, strataLeft + 8, skinMarkerY - 4);
      }

      // Cagniard Apparent Resistivity Sounding Curve
      const plotLeft = W - 240;
      const plotTop = 30;
      const plotW = 205;
      const plotH = strataH - 10;

      ctx.fillStyle = '#1E293B';
      ctx.fillRect(plotLeft, plotTop, plotW, plotH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(plotLeft, plotTop, plotW, plotH);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? 'Apparent Resistivity Curve' : 'Curva de Resistividad Aparente', plotLeft + 10, plotTop + 16);
      ctx.fillText('ρ_a (Ω·m)', plotLeft + 10, plotTop + 30);
      ctx.fillText(isEn ? 'log T (Period) →' : 'log T (Período) →', plotLeft + plotW - 105, plotTop + plotH - 6);

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 0; px <= plotW - 40; px += 3) {
        const normT = px / (plotW - 40);
        const curveVal = resTop + (resBottom - resTop) * (1 / (1 + Math.exp(-6 * (normT - 0.5))));
        const py = plotTop + plotH - 25 - (curveVal / Math.max(resTop, resBottom)) * (plotH - 60);
        if (px === 0) ctx.moveTo(plotLeft + 20 + px, py);
        else ctx.lineTo(plotLeft + 20 + px, py);
      }
      ctx.stroke();

      const opNormT = Math.min(1, Math.max(0, (Math.log10(period) + 3) / 4));
      const opX = plotLeft + 20 + opNormT * (plotW - 40);
      const opY = plotTop + plotH - 25 - (appRes / Math.max(resTop, resBottom)) * (plotH - 60);

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(opX, opY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`ρ_a = ${appRes.toFixed(1)} Ω·m`, opX - 35, opY - 10);

      if (showDCL) {
        drawArrow(ctx, waveMidX - 35, 55, waveMidX + 35, 55, '#38BDF8', 'E_x (V/m)', 2);
        drawArrow(ctx, waveMidX, 40, waveMidX, 70, '#F59E0B', 'H_y (A/m)', 2);
      }

      ctx.restore();
    }
  }, [selectedId, safeParams, simTime, showDCL, telemetry.raw]);

  const linkedCourse = courses.find((c) => c.id === currentProblem.courseId || (currentProblem.courseId === 'geophysics' && c.id === 'soil_physics')) || courses[0];

  return (
    <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Pedagogical Mission */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            {onNavigate && (
              <>
                <button onClick={() => onNavigate('landing')} className="hover:underline">
                  Home
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-sky-700 font-bold">
              {lang === 'en' ? 'Interactive Physics & Calculus Lab' : 'Laboratorio Interactivo de Problemas Clásicos'}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en'
                    ? 'Experiment • Toggle FBD Vectors • Connect Algebra & Calculus'
                    : 'Experimenta • Activa los DCL • Conecta Álgebra y Cálculo'}
                </span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'en'
                  ? 'The Classical Physics & Engineering Benchmarks'
                  : 'Los Problemas Clásicos de la Física y la Ingeniería'}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {lang === 'en'
                ? 'Select a course module below to manipulate physical variables, toggle Free Body Diagrams (FBD), inspect how algebraic sums turn into differential equations, and test yourself with an exam problem.'
                : 'Elige una materia para manipular las variables en vivo, encender los Diagramas de Cuerpo Libre (DCL), ver cómo el álgebra se convierte en cálculo diferencial e integral y resolver un ejercicio clásico.'}
            </p>
          </div>
        </div>

        {/* Shortcut banner to the Classical Library for theoretical laws */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-slate-800">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-sans text-xs text-slate-700">
              {lang === 'en'
                ? 'Looking for theoretical formulations, Maxwell equations, PDEs & spectral theorems? Explore the Compendium in the Classical Library.'
                : '¿Buscas formulaciones teóricas, ecuaciones de Maxwell, EDPs y teoremas espectrales? Explora el Compendio en la Biblioteca Clásica.'}
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('library')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shrink-0 shadow-xs"
            >
              {lang === 'en' ? 'Open Library & Laws →' : 'Ver Biblioteca & Leyes →'}
            </button>
          )}
        </div>

        {/* Discipline Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-2xl mb-5 border border-slate-200">
              {PROBLEM_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm border border-slate-300/80 ring-1 ring-slate-900/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{lang === 'en' ? cat.labelEn : cat.labelEs}</span>
                  </button>
                );
              })}
            </div>

            {/* Responsive Problem Selector Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
              {filteredProblems.map((prob) => {
                const Icon = prob.icon;
                const active = prob.id === selectedId;
                return (
                  <button
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      active
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-sky-500/50'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: active ? 'rgba(56, 189, 248, 0.2)' : '#F1F5F9',
                          color: active ? '#38BDF8' : prob.color
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      {active ? (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                          {lang === 'en' ? 'Active' : 'Activo'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                          {prob.courseId}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 ${active ? 'text-sky-300' : 'text-slate-500'}`}>
                        {lang === 'en' ? prob.badgeEn.split('&')[0] : prob.badgeEs.split('&')[0]}
                      </div>
                      <div className="text-xs font-bold leading-snug line-clamp-2">
                        {lang === 'en' ? prob.titleEn : prob.titleEs}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

        {/* ================================================================= */}
        {/* MAIN WORKBENCH: CANVAS + DCL TOGGLE + SLIDERS + WHAT-IF PRESETS   */}
        {/* ================================================================= */}
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 overflow-hidden shadow-xl mb-10">
          {/* Top Bar of Workbench */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold block">
                {lang === 'en' ? currentProblem.badgeEn : currentProblem.badgeEs}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {lang === 'en' ? currentProblem.titleEn : currentProblem.titleEs}
              </h2>
            </div>

            {/* Key Action Toggles: DCL Button + Study Sheet + Play/Pause + Reset */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowDCL((v) => !v)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  showDCL
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>
                  {showDCL
                    ? lang === 'en'
                      ? 'DCL / FBD: ON'
                      : 'DCL / Vectores: ON'
                    : lang === 'en'
                    ? 'Show DCL / FBD'
                    : 'Activar DCL'}
                </span>
              </button>

              <button
                onClick={() => setShowStudySheet(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer text-slate-200 hover:text-white transition-colors"
                title={lang === 'en' ? 'Export Study Sheet / Print Summary' : 'Exportar Ficha de Estudio / Imprimir'}
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'en' ? 'Study Sheet (PDF)' : 'Ficha de Estudio (PDF)'}</span>
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? (lang === 'en' ? 'Pause' : 'Pausar') : lang === 'en' ? 'Play' : 'Simular'}</span>
              </button>

              <button
                onClick={() => {
                  setParams(currentProblem.defaults);
                  setSimTime(0);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workbench Body: 7 cols Canvas + 5 cols Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Interactive Canvas & Telemetry */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {lang === 'en' ? currentProblem.subtitleEn : currentProblem.subtitleEs}
                </p>

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1120]">
                  <canvas ref={canvasRef} width={560} height={300} className="w-full h-[290px] sm:h-[310px] block" />

                  {/* Live Status Pill inside Canvas */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-sky-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{telemetry.status}</span>
                  </div>
                </div>
              </div>

              {/* 4 Telemetry Readouts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {telemetry.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">{item.label}</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sliders + "What If" Limit Cases */}
            <div className="lg:col-span-5 p-6 bg-slate-900/40 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Experimental Parameters' : 'Parámetros del Experimento'}</span>
                </div>

                {currentProblem.sliders.map((s) => (
                  <div key={s.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{lang === 'en' ? s.labelEn : s.labelEs}</span>
                      <span className="text-sky-300 font-bold">
                        {safeParams[s.key]}
                        {s.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={safeParams[s.key]}
                      onChange={(e) => handleParamChange(s.key, parseFloat(e.target.value))}
                      className="w-full accent-sky-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                    />
                  </div>
                ))}
              </div>

              {/* "¿Qué pasa si...? (Casos Límite de Examen)" */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  {lang === 'en' ? '⚡ "What If...?" Exam Limit Cases:' : '⚡ Modo "¿Qué pasa si...?" (Casos Límite):'}
                </span>
                <div className="space-y-2">
                  {currentProblem.presets.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => applyPreset(preset.values)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-mono text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{lang === 'en' ? preset.labelEn : preset.labelEs}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* LAYER 3: ALGEBRA <-> CALCULUS EQUATION BRIDGE                     */}
        {/* ================================================================= */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                {lang === 'en' ? 'Mathematical Formulation' : 'Formulación Matemática Paso a Paso'}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {lang === 'en'
                  ? 'How Algebra & Vectors Turn Into Differential Calculus'
                  : 'Puente de Ecuaciones: Del Álgebra Vectorial al Cálculo Diferencial'}
              </h3>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 font-mono text-xs font-semibold">
              {[
                { id: 'both', labelEs: 'Ver Ambos', labelEn: 'Show Both' },
                { id: 'algebra', labelEs: 'Sólo Álgebra / DCL', labelEn: 'Algebra / FBD Only' },
                { id: 'calculus', labelEs: 'Sólo Cálculo (EDO / ∫)', labelEn: 'Calculus (ODE / ∫)' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMathTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    mathTab === t.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? t.labelEn : t.labelEs}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid grid-cols-1 ${mathTab === 'both' ? 'lg:grid-cols-2' : ''} gap-6`}>
            {(mathTab === 'both' || mathTab === 'algebra') && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center">
                    ∑F
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 font-bold block">
                      {lang === 'en' ? 'Layer 1 • Linear Algebra & Trigonometry' : 'Capa 1 • Álgebra Lineal, Trigonometría y Estática'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'en' ? currentProblem.algebraSection?.titleEn : currentProblem.algebraSection?.titleEs}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentProblem.algebraSection?.formulas?.map((f, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        {lang === 'en' ? f.labelEn : f.labelEs}
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 overflow-x-auto">
                        <MathFormula math={getFormulaMath(f, lang)} display={true} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(mathTab === 'both' || mathTab === 'calculus') && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center">
                    ∫dx
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                      {lang === 'en' ? 'Layer 2 • Differential & Integral Calculus' : 'Capa 2 • Cálculo Diferencial, Integrales y EDOs'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'en' ? currentProblem.calculusSection?.titleEn : currentProblem.calculusSection?.titleEs}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentProblem.calculusSection?.formulas?.map((f, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        {lang === 'en' ? f.labelEn : f.labelEs}
                      </span>
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-emerald-950 overflow-x-auto">
                        <MathFormula math={getFormulaMath(f, lang)} display={true} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* LAYER 4: INTERACTIVE EXAM CHALLENGE (EJERCICIO RELACIONADO)       */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en'
                    ? 'Interactive University Exam Exercise'
                    : 'Ejercicio Clásico de Examen (Con Comprobación en el Lab)'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {lang === 'en' ? 'Test Your Intuition & Calculation' : 'Pon a Prueba tu Intuición y Cálculo'}
              </h3>
            </div>

            <button
              onClick={() => applyPreset(currentProblem.exercise?.presetValues || {})}
              className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? 'Load Exercise Values into Simulator ↑'
                  : 'Cargar Datos del Ejercicio en el Simulador ↑'}
              </span>
            </button>
          </div>

          <div className="py-6 space-y-6">
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {lang === 'en' ? currentProblem.exercise?.questionEn : currentProblem.exercise?.questionEs}
            </p>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProblem.exercise?.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-400';
                if (isSelected) {
                  btnStyle = opt.correct
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/30'
                    : 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/30';
                }
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-4 rounded-2xl border text-left font-mono text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>
                      <span className="uppercase mr-2 text-slate-400">{opt.id})</span>
                      {lang === 'en' ? (opt.textEn || opt.text) : (opt.textEs || opt.text)}
                    </span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 rounded font-bold">
                        {opt.correct
                          ? lang === 'en'
                            ? '✓ Correct!'
                            : '✓ ¡Correcto!'
                          : lang === 'en'
                          ? '✗ Try again'
                          : '✗ Revisa el DCL'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint & Step-by-Step Solution Toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowHint((h) => !h)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{showHint ? (lang === 'en' ? 'Hide Hint' : 'Ocultar Pista') : lang === 'en' ? 'Show Hint' : 'Ver Pista (Hint)'}</span>
              </button>

              <button
                onClick={() => setShowSolution((s) => !s)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>
                  {showSolution
                    ? lang === 'en'
                      ? 'Hide Full Derivation'
                      : 'Ocultar Solución Paso a Paso'
                    : lang === 'en'
                    ? 'Show Step-by-Step Derivation'
                    : 'Ver Solución Paso a Paso de Examen'}
                </span>
              </button>
            </div>

            {showHint && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed">
                <strong className="font-mono block mb-1">💡 {lang === 'en' ? 'Examiner Hint:' : 'Pista del Profesor:'}</strong>
                {lang === 'en' ? currentProblem.exercise?.hintEn : currentProblem.exercise?.hintEs}
              </div>
            )}

            {showSolution && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2.5 font-mono text-xs">
                <span className="text-emerald-400 uppercase tracking-wider font-bold block">
                  {lang === 'en'
                    ? 'Official Step-by-Step Exam Derivation:'
                    : 'Resolución Oficial Paso a Paso (Estructura de Puntaje Completo):'}
                </span>
                {(lang === 'en' ? currentProblem.exercise?.solutionStepsEn : currentProblem.exercise?.solutionStepsEs)?.map(
                  (step, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200">
                      {step}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Contextual CTA to Book this Course */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-900 block">
                {lang === 'en'
                  ? 'Want to master these problems for your upcoming exam?'
                  : '¿Quieres dominar este tipo de problemas con tus propios exámenes y ejercicios?'}
              </strong>
              <span>
                {lang === 'en'
                  ? 'We solve complex multi-body, 3D vector, and differential equation problems step-by-step on Miro.'
                  : 'Resolvemos sistemas acoplados, DCLs con múltiples cuerpos y ecuaciones diferenciales paso a paso.'}
              </span>
            </div>

            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking(linkedCourse)}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
              >
                <span>
                  {lang === 'en'
                    ? 'Book 1-on-1 Session for This Subject →'
                    : 'Agendar Clase de esta Materia →'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* MODAL: EXPORTAR FICHA DE ESTUDIO / IMPRIMIR RESUMEN OFICIAL       */}
        {/* ================================================================= */}
        {showStudySheet && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
            <div className="relative max-w-4xl w-full bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:rounded-none">
              {/* Header Bar */}
              <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between gap-4 print:bg-slate-900 print:text-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                      {lang === 'en' ? currentProblem.badgeEn : currentProblem.badgeEs}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      • {lang === 'en' ? 'Official University Exam Study Sheet' : 'Ficha Oficial de Estudio y Examen'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
                    {lang === 'en' ? currentProblem.titleEn : currentProblem.titleEs}
                  </h3>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Print / Save PDF' : 'Imprimir / Guardar PDF'}</span>
                  </button>
                  <button
                    onClick={() => setShowStudySheet(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Study Sheet Content Body */}
              <div className="p-6 sm:p-8 space-y-6 text-sm max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
                {/* 1. Problem Description & Active Experimental Variables */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    {lang === 'en' ? '1. Problem Setup & Physical Parameters' : '1. Planteamiento Físico y Parámetros Experimentales'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {lang === 'en' ? currentProblem.subtitleEn : currentProblem.subtitleEs}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                    {currentProblem.sliders.map((s) => (
                      <div key={s.key} className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono">
                        <span className="text-slate-500 block text-[10px]">{lang === 'en' ? s.labelEn : s.labelEs}</span>
                        <strong className="text-slate-900">{safeParams[s.key]}{s.unit}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Free Body Diagram & Telemetry Status */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                      {lang === 'en' ? '2. Free Body Diagram (FBD / DCL) & Live Telemetry' : '2. Diagrama de Cuerpo Libre (DCL) y Telemetría'}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {telemetry.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {telemetry.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] font-mono text-slate-400 block">{item.label}</span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Algebraic & Matrix Formulation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center">
                      ∑F
                    </span>
                    <h4 className="text-sm font-bold font-mono uppercase text-slate-900">
                      {lang === 'en' ? '3. Algebraic & Matrix Formulation' : '3. Planteamiento Algebraico y Matricial'}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {currentProblem.algebraSection?.formulas?.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-mono text-slate-600 block mb-1">
                          {lang === 'en' ? f.labelEn : f.labelEs}
                        </span>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-900 overflow-x-auto">
                          <MathFormula math={getFormulaMath(f, lang)} display={true} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Calculus & Differential Equations */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-mono text-xs font-bold flex items-center justify-center">
                      ∫dx
                    </span>
                    <h4 className="text-sm font-bold font-mono uppercase text-slate-900">
                      {lang === 'en' ? '4. Differential & Integral Calculus Connection' : '4. Conexión con el Cálculo Diferencial e Integral'}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {currentProblem.calculusSection?.formulas?.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-mono text-slate-600 block mb-1">
                          {lang === 'en' ? f.labelEn : f.labelEs}
                        </span>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-900 overflow-x-auto">
                          <MathFormula math={getFormulaMath(f, lang)} display={true} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Klausur Exam Exercise & Step-by-Step Scoring Solution */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {lang === 'en' ? '5. Benchmark University Exam Exercise & Derivation' : '5. Ejercicio Típico de Examen Universitario y Pauta Paso a Paso'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {lang === 'en' ? 'Full score rubric' : 'Puntaje completo'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lang === 'en' ? currentProblem.exercise?.questionEn : currentProblem.exercise?.questionEs}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentProblem.exercise?.options?.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between ${
                          opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>
                          <span className="uppercase mr-1.5 opacity-60">{opt.id})</span>
                          {lang === 'en' ? (opt.textEn || opt.text) : (opt.textEs || opt.text)}
                        </span>
                        {opt.correct && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">✓ Correct</span>}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5 text-xs font-mono">
                    <span className="text-amber-400 font-bold block">
                      💡 {lang === 'en' ? 'Examiner Hint:' : 'Pista del Profesor:'}
                    </span>
                    <p className="text-slate-300">
                      {lang === 'en' ? currentProblem.exercise?.hintEn : currentProblem.exercise?.hintEs}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <span className="text-emerald-400 font-bold block uppercase tracking-wider">
                      {lang === 'en' ? 'Official Step-by-Step Derivation:' : 'Resolución Oficial Paso a Paso:'}
                    </span>
                    {(lang === 'en' ? currentProblem.exercise?.solutionStepsEn : currentProblem.exercise?.solutionStepsEs)?.map((step, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Brand */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
                  <span>
                    Daniel S. Santander Urrutia • M.Sc. RWTH Aachen • Clases &amp; Mentoría Universitaria
                  </span>
                  <span>
                    classes-danielsantander.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
