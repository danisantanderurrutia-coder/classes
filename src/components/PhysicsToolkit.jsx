import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Calculator,
  BookOpen,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  Activity,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sliders,
  Award,
  Magnet,
  Maximize2,
  Radio,
  Waves,
  Mountain,
  Globe,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function PhysicsToolkit({ lang = 'es', onOpenBooking }) {
  const isEn = lang === 'en';
  // Tabs: 'physics' | 'algebra' | 'calculus' | 'signals' | 'complex'
  const [activeTab, setActiveTab] = useState('physics');

  // ==========================================================================
  // 1. RIGHT HAND RULE (RHR) INTERACTIVE STATE
  // ==========================================================================
  const [rhrMode, setRhrMode] = useState('lorentz'); // 'lorentz' | 'torque' | 'omega' | 'coriolis' | 'pure'
  const [vectorAngle, setVectorAngle] = useState(60); // degrees between A and B
  const [magA, setMagA] = useState(3.5);
  const [magB, setMagB] = useState(3.0);
  const rhrCanvasRef = useRef(null);

  // ==========================================================================
  // 2. 2x2 MATRIX DIAGONALIZATION & SVD / TIKHONOV INVERSE THEORY STATE
  // Matrix A = [ [matA, matB], [matB, matD] ] (symmetric)
  // ==========================================================================
  const [matA, setMatA] = useState(4);
  const [matB, setMatB] = useState(2);
  const [matD, setMatD] = useState(1);
  const [tikhonovEps, setTikhonovEps] = useState(0.20); // damping parameter epsilon^2

  // Compute eigenvalues for [ [matA, matB], [matB, matD] ]
  const tr = matA + matD;
  const det = matA * matD - matB * matB;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = (tr + Math.sqrt(disc)) / 2;
  const lambda2 = (tr - Math.sqrt(disc)) / 2;

  // SVD Singular Values & Condition Number
  const sigma1 = Math.max(Math.abs(lambda1), Math.abs(lambda2));
  const sigma2 = Math.min(Math.abs(lambda1), Math.abs(lambda2));
  const condNumber = sigma2 > 1e-4 ? sigma1 / sigma2 : 999;

  // Tikhonov Regularization on test data d = [6, 2]^T
  // (A^T A + eps^2 I) m = A^T d
  // Let M = A^2 + eps^2 I
  const m11 = matA * matA + matB * matB + tikhonovEps;
  const m12 = matA * matB + matB * matD;
  const m22 = matB * matB + matD * matD + tikhonovEps;
  const detM = m11 * m22 - m12 * m12;
  // A * d where d = [6, 2]^T
  const at_d1 = matA * 6 + matB * 2;
  const at_d2 = matB * 6 + matD * 2;
  // m_est = M^-1 * (A * d)
  const mEst1 = detM !== 0 ? (m22 * at_d1 - m12 * at_d2) / detM : 0;
  const mEst2 = detM !== 0 ? (-m12 * at_d1 + m11 * at_d2) / detM : 0;

  // Eigenvectors
  let v1x = -matB;
  let v1y = matA - lambda1;
  let len1 = Math.hypot(v1x, v1y);
  if (len1 < 1e-4) {
    v1x = 1;
    v1y = 0;
  } else {
    v1x /= len1;
    v1y /= len1;
  }
  let v2x = -v1y;
  let v2y = v1x;

  // ==========================================================================
  // 3. SIGNAL PROCESSING INTERACTIVE STATE
  // ==========================================================================
  const [fourierHarmonics, setFourierHarmonics] = useState(3);
  const [rickerFreq, setRickerFreq] = useState(30); // Hz
  const [samplingDt, setSamplingDt] = useState(4); // ms
  const [geophoneDamping, setGeophoneDamping] = useState(0.707); // h
  const fourierCanvasRef = useRef(null);
  const rickerCanvasRef = useRef(null);
  const geophoneCanvasRef = useRef(null);

  // ==========================================================================
  // 4. COMPLEX ANALYSIS & POTENTIAL FLOW STATE
  // ==========================================================================
  const [complexFlowMode, setComplexFlowMode] = useState('dipole'); // 'dipole' | 'cylinder'
  const complexCanvasRef = useRef(null);

  // ==========================================================================
  // CANVAS DRAWING: 2.5D INTERACTIVE RIGHT HAND RULE
  // ==========================================================================
  useEffect(() => {
    const canvas = rhrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    const originX = W / 2 - 20;
    const originY = H / 2 + 45;

    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(originX + i * 35 - 120 * 0.7, originY + 120 * 0.35);
      ctx.lineTo(originX + i * 35 + 120 * 0.7, originY - 120 * 0.35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX - 140 + i * 25 * 0.7, originY - i * 25 * 0.35);
      ctx.lineTo(originX + 140 + i * 25 * 0.7, originY - i * 25 * 0.35);
      ctx.stroke();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, Math.PI * 2);
    ctx.fill();

    const radAngle = (vectorAngle * Math.PI) / 180;
    const lenA = magA * 26;
    const lenB = magB * 26;

    // Vector A (Index Finger)
    const ax = originX + lenA * 0.85;
    const ay = originY - lenA * 0.3;

    // Vector B (Middle Finger)
    const bx = originX + lenB * Math.cos(radAngle) * 0.85 - lenB * Math.sin(radAngle) * 0.5;
    const by = originY - lenB * Math.cos(radAngle) * 0.3 - lenB * Math.sin(radAngle) * 0.7;

    // Vector C = A x B (Thumb pointing UP)
    const sinTheta = Math.sin(radAngle);
    const magC = magA * magB * sinTheta;
    const lenC = Math.min(130, magC * 11);
    const cx = originX;
    const cy = originY - lenC;

    // Labels config
    let labelA = 'v⃗ (Velocidad)';
    let labelB = 'B⃗ (Campo Magnético)';
    let labelC = 'F⃗_L = q(v⃗ × B⃗)';
    let subDesc = 'Fuerza de Lorentz sobre carga positiva';

    if (rhrMode === 'torque') {
      labelA = 'r⃗ (Brazo de Palanca)';
      labelB = 'F⃗ (Fuerza Aplicada)';
      labelC = 'τ⃗ = r⃗ × F⃗ (Torque)';
      subDesc = 'Momento de fuerza respecto al eje de rotación';
    } else if (rhrMode === 'omega') {
      labelA = 'ω⃗ (Velocidad Angular)';
      labelB = 'r⃗ (Radio vector)';
      labelC = 'v⃗ = ω⃗ × r⃗';
      subDesc = 'Velocidad tangencial en rotación de cuerpo rígido';
    } else if (rhrMode === 'coriolis') {
      labelA = 'Ω⃗ (Rotación Terrestre)';
      labelB = 'v⃗ (Velocidad Viento/Océano)';
      labelC = 'a⃗_Cor = -2(Ω⃗ × v⃗)';
      subDesc = 'Aceleración aparente de Coriolis en sistemas no inerciales';
    } else if (rhrMode === 'pure') {
      labelA = 'A⃗ (Primer Vector)';
      labelB = 'B⃗ (Segundo Vector)';
      labelC = 'C⃗ = A⃗ × B⃗';
      subDesc = '|C⃗| = |A⃗||B⃗| sin(θ) [Área del paralelogramo]';
    }

    const drawVector = (x2, y2, color, label, isC = false) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = isC ? 3.5 : 2.5;

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - originY, x2 - originX);
      const headLen = isC ? 12 : 9;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(label, x2 + 8, y2 + (isC ? -8 : 4));
      ctx.restore();
    };

    drawVector(ax, ay, '#38BDF8', labelA);
    drawVector(bx, by, '#34D399', labelB);
    drawVector(cx, cy, '#F43F5E', labelC, true);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? `Angle θ = ${vectorAngle}° | sin(θ) = ${sinTheta.toFixed(2)} | Magnitude |A⃗×B⃗| = ${magC.toFixed(2)}` : `Ángulo θ = ${vectorAngle}° | sin(θ) = ${sinTheta.toFixed(2)} | Magnitud |A⃗×B⃗| = ${magC.toFixed(2)}`, 20, 24);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(subDesc, 20, H - 15);
  }, [rhrMode, vectorAngle, magA, magB, lang]);

  // ==========================================================================
  // CANVAS DRAWING: FOURIER DECOMPOSITION
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'signals') return;
    const canvas = fourierCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    const splitX = W * 0.62;

    // Left Section: Time Domain Synthesis f(t)
    const midY = H / 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(25, midY);
    ctx.lineTo(splitX - 20, midY);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Time Domain f(t)' : 'Dominio del Tiempo f(t)', 25, 20);

    // Draw individual harmonics faintly
    for (let k = 1; k <= fourierHarmonics; k++) {
      const harmIdx = 2 * k - 1;
      const ampK = (4 / Math.PI) * (1 / harmIdx) * 45;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + k * 0.08})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      for (let px = 25; px < splitX - 20; px += 2) {
        const t = ((px - 25) / (splitX - 45)) * Math.PI * 4;
        const py = midY - ampK * Math.sin(harmIdx * t);
        if (px === 25) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Sum Waveform (Thick cyan)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 25; px < splitX - 20; px += 2) {
      const t = ((px - 25) / (splitX - 45)) * Math.PI * 4;
      let sumVal = 0;
      for (let k = 1; k <= fourierHarmonics; k++) {
        const harmIdx = 2 * k - 1;
        sumVal += (4 / Math.PI) * (1 / harmIdx) * Math.sin(harmIdx * t);
      }
      const py = midY - sumVal * 45;
      if (px === 25) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Divider line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.beginPath();
    ctx.moveTo(splitX, 15);
    ctx.lineTo(splitX, H - 15);
    ctx.stroke();

    // Right Section: Frequency Spectrum |F(ω)|
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Spectrum |f̂(ω)|' : 'Espectro |f̂(ω)|', splitX + 15, 20);

    const baseBarY = H - 35;
    const barSpacing = (W - splitX - 40) / 7;

    for (let k = 1; k <= 7; k++) {
      const harmIdx = 2 * k - 1;
      const bx = splitX + 20 + (k - 1) * barSpacing;
      const isIncluded = k <= fourierHarmonics;
      const barAmp = isIncluded ? (4 / Math.PI) * (1 / harmIdx) * 80 : 0;

      ctx.fillStyle = isIncluded ? '#10B981' : 'rgba(148, 163, 184, 0.2)';
      ctx.fillRect(bx, baseBarY - barAmp, barSpacing * 0.7, barAmp);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`${harmIdx}ω`, bx, baseBarY + 14);
    }
  }, [activeTab, fourierHarmonics]);

  // ==========================================================================
  // CANVAS DRAWING: RICKER WAVELET & CONVOLUTION
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'signals') return;
    const canvas = rickerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    const midY1 = 45; // Ricker wavelet
    const midY2 = 115; // Reflectivity spikes
    const midY3 = 195; // Synthetic Seismogram

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? `1. Ricker Wavelet w(t) [f₀ = ${rickerFreq} Hz]` : `1. Ondícula de Ricker w(t) [f₀ = ${rickerFreq} Hz]`, 20, 20);
    ctx.fillText(isEn ? '2. Geological Reflectivity Series r(t)' : '2. Serie de Reflectividad Geológica r(t)', 20, 90);
    ctx.fillText(isEn ? '3. Convolutional Seismogram s(t) = w(t) * r(t)' : '3. Sismograma Convolutivo s(t) = w(t) * r(t)', 20, 165);

    // 1. Draw Ricker Wavelet
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const f0 = rickerFreq;
    for (let px = 20; px < W - 20; px += 2) {
      const t = (px - W / 2) / 1800; // seconds
      const pi2f2t2 = Math.PI * Math.PI * f0 * f0 * t * t;
      const wVal = (1 - 2 * pi2f2t2) * Math.exp(-pi2f2t2);
      const py = midY1 - wVal * 25;
      if (px === 20) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 2. Reflectivity spikes
    const reflectors = [
      { x: 120, r: 0.65, label: isEn ? 'Sandstone Top' : 'Techo Arenisca' },
      { x: 250, r: -0.45, label: isEn ? 'Marine Shale' : 'Lutita Marina' },
      { x: 380, r: 0.85, label: isEn ? 'Igneous Basement' : 'Basamento Ígneo' }
    ];

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.beginPath();
    ctx.moveTo(20, midY2);
    ctx.lineTo(W - 20, midY2);
    ctx.stroke();

    reflectors.forEach((rf) => {
      ctx.strokeStyle = rf.r > 0 ? '#10B981' : '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rf.x, midY2);
      ctx.lineTo(rf.x, midY2 - rf.r * 26);
      ctx.stroke();

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillText(rf.label, rf.x - 20, midY2 + 14);
    });

    // 3. Synthetic Seismogram (Sum of convolved shifted Rickers)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 20; px < W - 20; px += 2) {
      let traceVal = 0;
      reflectors.forEach((rf) => {
        const t = (px - rf.x) / 1800;
        const pi2f2t2 = Math.PI * Math.PI * f0 * f0 * t * t;
        const wVal = (1 - 2 * pi2f2t2) * Math.exp(-pi2f2t2);
        traceVal += rf.r * wVal;
      });
      const py = midY3 - traceVal * 26;
      if (px === 20) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [activeTab, rickerFreq, lang]);

  // ==========================================================================
  // CANVAS DRAWING: GEOPHONE LAPLACE TRANSFER FUNCTION
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'signals') return;
    const canvas = geophoneCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? `Geophone Frequency Response |H(ω)| [Damping h = ${geophoneDamping.toFixed(3)}]` : `Respuesta en Frecuencia del Geófono |H(ω)| [Amortiguamiento h = ${geophoneDamping.toFixed(3)}]`, 20, 20);

    const basePlotY = H - 30;
    const plotH = H - 55;
    const plotW = W - 40;

    // Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, basePlotY);
    ctx.lineTo(20 + plotW, basePlotY);
    ctx.moveTo(20, basePlotY - plotH);
    ctx.lineTo(20, basePlotY);
    ctx.stroke();

    // Critical damping curve highlight
    ctx.strokeStyle = geophoneDamping === 0.707 ? '#10B981' : geophoneDamping < 0.707 ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const hFactor = geophoneDamping;
    for (let px = 0; px <= plotW; px += 2) {
      const u = (px / plotW) * 3.5; // u = omega / omega0 (0 to 3.5)
      const u2 = u * u;
      const denom = Math.sqrt(Math.pow(1 - u2, 2) + 4 * hFactor * hFactor * u2);
      const resp = denom > 1e-4 ? u2 / denom : 0;
      const py = basePlotY - Math.min(plotH, resp * (plotH * 0.55));
      if (px === 0) ctx.moveTo(20 + px, py);
      else ctx.lineTo(20 + px, py);
    }
    ctx.stroke();

    // Omega0 resonant marker
    const omega0X = 20 + (1.0 / 3.5) * plotW;
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(omega0X, 35);
    ctx.lineTo(omega0X, basePlotY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'ω₀ (Natural Freq)' : 'ω₀ (Frec. Propia)', omega0X - 35, basePlotY + 15);

    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(
      geophoneDamping === 0.707
        ? (isEn ? '✓ Optimal Critical Damping (h=0.707): Flat response' : '✓ Amortiguamiento Crítico (h=0.707): Respuesta plana óptima')
        : geophoneDamping < 0.707
        ? (isEn ? '⚠️ Under-damped (h<0.707): Resonant peak & ringing' : '⚠️ Sub-amortiguado (h<0.707): Pico resonante e inestabilidad')
        : (isEn ? 'ℹ️ Over-damped (h>0.707): Sensitivity drop-off' : 'ℹ️ Sobre-amortiguado (h>0.707): Caída de sensibilidad'),
      omega0X + 15,
      48
    );
  }, [activeTab, geophoneDamping, lang]);

  // ==========================================================================
  // CANVAS DRAWING: CAUCHY-RIEMANN ORTHOGONAL STREAMLINES & EQUIPOTENTIALS
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'complex') return;
    const canvas = complexCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    const midX = W / 2;
    const midY = H / 2;

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? '2D Potential Flow: Equipotential Lines (Gold) ⊥ Streamlines (Blue)' : 'Flujo Potencial 2D: Líneas Equipotenciales (Oro) ⊥ Líneas de Corriente (Azul)', 20, 22);

    // Draw Streamlines psi(x,y) = const and Equipotentials phi(x,y) = const
    if (complexFlowMode === 'dipole') {
      // Dipole W(z) = mu / z = mu(x - iy) / (x^2 + y^2)
      // phi = mu x / r^2 (Circles touching origin along X)
      // psi = -mu y / r^2 (Circles touching origin along Y)
      for (let r = 25; r <= 130; r += 26) {
        // Equipotentials (phi = const) - Amber
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(midX + r, midY, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(midX - r, midY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Streamlines (psi = const) - Sky Blue
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(midX, midY + r, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(midX, midY - r, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // Flow around cylinder: W(z) = U (z + R^2 / z)
      const cylR = 45;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(midX, midY, cylR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let psi = -80; psi <= 80; psi += 20) {
        if (Math.abs(psi) < 10) continue;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = -W / 2 + 20; x <= W / 2 - 20; x += 4) {
          const r = Math.hypot(x, psi);
          if (r < cylR) continue;
          const y = psi * (1 - (cylR * cylR) / (r * r));
          if (x === -W / 2 + 20) ctx.moveTo(midX + x, midY + y);
          else ctx.lineTo(midX + x, midY + y);
        }
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Cauchy-Riemann Condition: ∇φ · ∇ψ = (∂φ/∂x)(∂ψ/∂x) + (∂φ/∂y)(∂ψ/∂y) = 0 (Exact Orthogonality)' : 'Condición de Cauchy-Riemann: ∇φ · ∇ψ = (∂φ/∂x)(∂ψ/∂x) + (∂φ/∂y)(∂ψ/∂y) = 0 (Ortogonalidad Exacta)', 20, H - 12);
  }, [activeTab, complexFlowMode, lang]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'FCFM U. de Chile & TU9 Reference' : 'Referencia FCFM U. de Chile & TU9'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{lang === 'en' ? 'Compendium of Laws, Algebra & Geophysics' : 'Compendio de Leyes, Álgebra y Geofísica'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {lang === 'en'
              ? 'The conceptual pillars that university examinations demand: from interactive 3D right-hand rules and matrix SVD inversion to canonical PDEs, Fourier signal convolution, and complex residues.'
              : 'Los pilares obligados en la formación de geofísica y ciencias exactas: desde la regla de la mano derecha 3D y la inversión SVD hasta las 3 EDPs canónicas, convolución de señales y residuos complejos.'}
          </p>
        </div>

        {/* 5 Main Compendium Section Pills */}
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold shrink-0">
          {[
            { id: 'physics', labelEs: '1. Física & DCLs', labelEn: '1. Physics & FBDs', icon: Compass },
            { id: 'algebra', labelEs: '2. Álgebra & SVD', labelEn: '2. Algebra & SVD', icon: Calculator },
            { id: 'calculus', labelEs: '3. Cálculo & EDPs', labelEn: '3. Calculus & PDEs', icon: BookOpen },
            { id: 'signals', labelEs: '4. Señales & Fourier', labelEn: '4. Signals & Fourier', icon: Activity },
            { id: 'complex', labelEs: '5. Complejos & Lagrange', labelEn: '5. Complex & Lagrange', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{lang === 'en' ? tab.labelEn : tab.labelEs}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PHYSICS LAWS & INTERACTIVE RIGHT-HAND RULE                     */}
      {/* ==================================================================== */}
      {activeTab === 'physics' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  {lang === 'en' ? 'Interactive 3D Cross Product Simulator' : 'Simulador 3D del Producto Cruz Vectorial'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'en' ? 'The Right-Hand Rule in Vector Physics' : 'La Regla de la Mano Derecha en Física Vectorial'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'lorentz', label: 'q(v⃗×B⃗)' },
                  { id: 'torque', label: 'r⃗×F⃗' },
                  { id: 'omega', label: 'ω⃗×r⃗' },
                  { id: 'coriolis', label: '-2(Ω⃗×v⃗)' },
                  { id: 'pure', label: 'A⃗×B⃗' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setRhrMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      rhrMode === mode.id
                        ? 'bg-sky-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                <canvas ref={rhrCanvasRef} width={540} height={260} className="w-full h-[240px] block" />
              </div>

              <div className="lg:col-span-4 space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  {lang === 'en' ? 'Interactive Vector Controls:' : 'Controles Interactivos:'}
                </h4>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>{lang === 'en' ? 'Angle θ between A & B:' : 'Ángulo θ entre A⃗ y B⃗:'}</span>
                    <strong className="text-sky-400">{vectorAngle}°</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="170"
                    step="5"
                    value={vectorAngle}
                    onChange={(e) => setVectorAngle(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>{lang === 'en' ? 'Magnitude |A⃗|:' : 'Magnitud |A⃗|:'}</span>
                    <strong className="text-sky-400">{magA}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={magA}
                    onChange={(e) => setMagA(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>{lang === 'en' ? 'Magnitude |B⃗|:' : 'Magnitud |B⃗|:'}</span>
                    <strong className="text-sky-400">{magB}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={magB}
                    onChange={(e) => setMagB(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed">
                  💡 <strong className="text-white">Regla práctica:</strong> Apunta con el índice hacia <span className="text-sky-400 font-bold">A⃗</span>, gira los dedos hacia <span className="text-emerald-400 font-bold">B⃗</span>; el pulgar extendido apunta en dirección de <span className="text-rose-400 font-bold">C⃗</span>.
                </div>
              </div>
            </div>
          </div>

          {/* Maxwell & Fundamental Laws Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Ley de Gauss (Eléctrica)',
                formula: '∇ · E⃗ = ρ / ε₀',
                desc: 'Las cargas eléctricas son fuentes (positivas) o sumideros (negativas) del campo eléctrico.'
              },
              {
                title: 'Ley de Gauss (Magnética)',
                formula: '∇ · B⃗ = 0',
                desc: 'No existen monopolos magnéticos aislados en la naturaleza; las líneas de campo magnético siempre son cerradas.'
              },
              {
                title: 'Ley de Faraday-Lenz',
                formula: '∇ × E⃗ = -∂B⃗/∂t',
                desc: 'Un campo magnético variable en el tiempo induce un campo eléctrico rotacional (principio de generadores e inductores).'
              },
              {
                title: 'Ley de Ampère-Maxwell',
                formula: '∇ × B⃗ = μ₀(J⃗ + ε₀∂E⃗/∂t)',
                desc: 'Las corrientes eléctricas y los campos eléctricos variables en el tiempo generan campos magnéticos (ondas EM).'
              }
            ].map((card, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-sky-400 uppercase font-bold block">{card.title}</span>
                <div className="p-2 bg-slate-950 rounded-lg font-mono text-xs text-amber-300 font-bold border border-slate-800/80">
                  {card.formula}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: LINEAR ALGEBRA, SVD & INVERSE THEORY (GEOPHYSICS)              */}
      {/* ==================================================================== */}
      {activeTab === 'algebra' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              {lang === 'en' ? 'Applied Spectral Theory & Inverse Problems' : 'Teoría Espectral Aplicada e Inversión Geofísica'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en' ? 'Matrix Diagonalization, SVD & Tikhonov Regularization' : 'Diagonalización de Matrices, SVD y Regularización de Tikhonov'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'From decoupling coupled harmonic oscillators into normal vibration modes to solving ill-posed inverse problems in seismic tomography.'
                : 'Desde el desacoplamiento de osciladores armónicos en modos normales hasta la resolución de problemas inversos mal condicionados en tomografía sísmica y gravimetría.'}
            </p>
          </div>

          {/* Matrix Sandbox & SVD Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                {lang === 'en' ? 'Configure Symmetric Matrix A:' : 'Configurar Matriz Simétrica A:'}
              </span>

              <div className="flex items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm text-white">
                <div className="text-2xl font-bold mr-3 text-indigo-400">A = </div>
                <div className="border-l-2 border-r-2 border-white px-3 py-1 grid grid-cols-2 gap-4 text-center font-bold">
                  <span className="text-sky-400">{matA}</span>
                  <span className="text-indigo-400">{matB}</span>
                  <span className="text-indigo-400">{matB}</span>
                  <span className="text-emerald-400">{matD}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Elemento a₁₁:</span>
                    <strong className="text-sky-400">{matA}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={matA}
                    onChange={(e) => setMatA(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Elemento a₁₂ = a₂₁ (Acoplamiento):</span>
                    <strong className="text-indigo-400">{matB}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={matB}
                    onChange={(e) => setMatB(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Elemento a₂₂:</span>
                    <strong className="text-emerald-400">{matD}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={matD}
                    onChange={(e) => setMatD(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Amortiguamiento Tikhonov (ε²):</span>
                    <strong className="text-amber-400">{tikhonovEps.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="2.00"
                    step="0.05"
                    value={tikhonovEps}
                    onChange={(e) => setTikhonovEps(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Results: Characteristic Polynomial, Eigenvalues & SVD Inverse */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold block">
                {lang === 'en' ? 'Real-Time Spectral & Inverse Decomposition:' : 'Descomposición Espectral e Inversión en Vivo:'}
              </span>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">1. Polinomio Característico: det(A - λI) = 0</span>
                <p className="text-sm font-bold text-amber-300">
                  λ² - ({tr})λ + ({det}) = 0
                </p>
                <span className="text-slate-500 text-[10px]">Traza(A) = {tr} | Det(A) = {det}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-sky-400 text-[10px] uppercase block font-bold">Autovalor λ₁</span>
                  <span className="text-base font-bold text-white block mt-1">{lambda1.toFixed(3)}</span>
                  <span className="text-[10px] text-slate-400">v⃗₁ = [{v1x.toFixed(2)}, {v1y.toFixed(2)}]</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 text-[10px] uppercase block font-bold">Autovalor λ₂</span>
                  <span className="text-base font-bold text-white block mt-1">{lambda2.toFixed(3)}</span>
                  <span className="text-[10px] text-slate-400">v⃗₂ = [{v2x.toFixed(2)}, {v2y.toFixed(2)}]</span>
                </div>
              </div>

              {/* SVD and Condition Number */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-950/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-400 text-[10px] uppercase font-bold">Descomposición SVD (A = U Σ Vᵀ)</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${condNumber > 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    κ(A) = {condNumber > 100 ? '>100 (Mal Condicionado)' : condNumber.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Valores singulares: <strong className="text-white">σ₁ = {sigma1.toFixed(2)}</strong>, <strong className="text-white">σ₂ = {sigma2.toFixed(2)}</strong>
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex justify-between items-center">
                  <span>Solución Inversa Tikhonov m⃗_est para d⃗=[6, 2]ᵀ:</span>
                  <strong className="text-amber-400">[{mEst1.toFixed(2)}, {mEst2.toFixed(2)}]ᵀ</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: MULTIVARIABLE CALCULUS & THE 3 CANONICAL PDES                  */}
      {/* ==================================================================== */}
      {activeTab === 'calculus' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              {lang === 'en' ? 'Multivariable Calculus & Partial Differential Equations' : 'Cálculo Multivariable y Ecuaciones Diferenciales Parciales'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en' ? 'The Nabla (∇) Dictionary & The 3 Canonical PDEs' : 'El Diccionario del Operador Nabla (∇) y las 3 EDPs Canónicas'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'The universal mathematical foundation for fluid dynamics, potential fields, and elastic wave equations in geophysics.'
                : 'La base matemática rigurosa para fluidodinámica, campos potenciales gravimétricos y elastodinámica sísmica.'}
            </p>
          </div>

          {/* The Nabla Operator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                sym: '∇ f',
                nameEs: 'Gradiente',
                nameEn: 'Gradient',
                inOut: 'Escalar → Vector',
                color: 'text-sky-400',
                meaningEs: 'Vector en la dirección de máxima tasa de crecimiento espacial (ej. -∇P empuja el viento hacia la baja presión).'
              },
              {
                sym: '∇ · F⃗',
                nameEs: 'Divergencia',
                nameEn: 'Divergence',
                inOut: 'Vector → Escalar',
                color: 'text-emerald-400',
                meaningEs: 'Mide la tasa neta de flujo que sale de un punto. Positiva = Fuente; Negativa = Sumidero; Cero = Incompresible.'
              },
              {
                sym: '∇ × F⃗',
                nameEs: 'Rotacional (Curl)',
                nameEn: 'Curl',
                inOut: 'Vector → Vector',
                color: 'text-amber-400',
                meaningEs: 'Mide la rotación local o vorticidad en un fluido. Rige la generación de ondas S por cizalle y ondas electromagnéticas.'
              },
              {
                sym: '∇² f',
                nameEs: 'Laplaciano',
                nameEn: 'Laplacian',
                inOut: 'Escalar → Escalar',
                color: 'text-purple-400',
                meaningEs: 'Mide la curvatura promedio de un campo. Gobierna difusión térmica, campos potenciales y propagación ondulatoria.'
              }
            ].map((op, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold font-mono ${op.color}`}>{op.sym}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{op.inOut}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">{lang === 'en' ? op.nameEn : op.nameEs}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{op.meaningEs}</p>
              </div>
            ))}
          </div>

          {/* The 3 Canonical PDEs of Mathematical Physics */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white font-mono uppercase tracking-wider text-slate-200">
              {lang === 'en'
                ? 'The 3 Canonical PDEs of Mathematical Physics in Geophysics:'
                : 'Las 3 Grandes Ecuaciones Diferenciales Parciales en Geofísica:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-sky-400 uppercase font-bold block">1. Elíptica (Laplace / Poisson)</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∇² u = 4π G ρ
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Estados estacionarios independientes del tiempo. Gobierna el potencial gravitacional U, la gravimetría de Bouguer y el flujo freático subterráneo permanente.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold block">2. Parabólica (Difusión / Calor)</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∂u/∂t = α ∇² u
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Irreversible en el tiempo. Modela el enfriamiento térmico de la placa oceánica de Nazca, disipación de calor geotérmico y difusión electromagnética en magnetotelúrica.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">3. Hiperbólica (Onda Elastodinámica)</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∂²u/∂t² = c² ∇² u
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reversible en el tiempo con velocidad finita c. Ecuación fundamental de la sismología: propagación de ondas elásticas P y S a través del manto y núcleo terrestre.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: GEOPHYSICAL SIGNAL PROCESSING & INSTRUMENTAL ODES              */}
      {/* ==================================================================== */}
      {activeTab === 'signals' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              {lang === 'en' ? 'Signal Analysis & Instrumental Response' : 'Análisis de Señales y Respuesta Instrumental'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en' ? 'Fourier Decomposition, Wavelet Convolution & Geophone Laplace ODEs' : 'Descomposición de Fourier, Convolución de Ondículas y EDOs de Geófonos'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'From sampling theorems (Nyquist) and seismic reflection convolution models to the 2nd-order transfer functions of seismometers in Chilean observation networks.'
                : 'Desde el teorema de muestreo de Nyquist y el modelo convolutivo s(t) = w(t)*r(t) hasta la función de transferencia de 2º orden del sismómetro con amortiguamiento crítico.'}
            </p>
          </div>

          {/* Module A: Fourier Decomposition Live */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase font-bold block">A. Descomposición Espectral de Fourier</span>
                <h4 className="text-sm font-bold text-white font-mono">f(t) = (4/π) ∑ [sin((2k-1)ωt) / (2k-1)]</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">Armónicos N:</span>
                <strong className="text-sky-400 font-mono text-sm">{fourierHarmonics}</strong>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={fourierHarmonics}
                  onChange={(e) => setFourierHarmonics(Number(e.target.value))}
                  className="w-32 accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <canvas ref={fourierCanvasRef} width={540} height={180} className="w-full h-[170px] block" />
            </div>
          </div>

          {/* Module B: Convolutional Seismogram & Ricker Wavelet */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-bold block">B. Modelo Convolutivo del Sismograma</span>
                <h4 className="text-sm font-bold text-white font-mono">s(t) = w(t) * r(t) + n(t)</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">Frecuencia Ondícula f₀:</span>
                <strong className="text-amber-400 font-mono text-sm">{rickerFreq} Hz</strong>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={rickerFreq}
                  onChange={(e) => setRickerFreq(Number(e.target.value))}
                  className="w-32 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <canvas ref={rickerCanvasRef} width={540} height={230} className="w-full h-[220px] block" />
            </div>
          </div>

          {/* Module C: Geophone Transfer Function & Nyquist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">C. Respuesta de Laplace del Sismógrafo</span>
                  <h4 className="text-sm font-bold text-white font-mono">H(s) = s² / (s² + 2hω₀s + ω₀²)</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">Amortiguamiento h:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{geophoneDamping.toFixed(3)}</strong>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.05"
                    value={geophoneDamping}
                    onChange={(e) => setGeophoneDamping(Number(e.target.value))}
                    className="w-28 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <canvas ref={geophoneCanvasRef} width={540} height={180} className="w-full h-[170px] block" />
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">D. Teorema de Muestreo de Nyquist</span>
              <p className="text-slate-300 leading-relaxed font-sans">
                Para registrar una frecuencia máxima <strong className="text-white">f_max</strong> sin distorsión por solapamiento espectral (aliasing), la tasa de muestreo debe ser al menos el doble.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Paso de muestreo Δt:</span>
                  <strong className="text-white">{samplingDt} ms</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={samplingDt}
                  onChange={(e) => setSamplingDt(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-cyan-300 font-bold">
                  <span>Frecuencia de Nyquist:</span>
                  <span>{((1 / (2 * (samplingDt / 1000)))).toFixed(0)} Hz</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                💡 En la red sismológica nacional (CSN) se digitaliza a 100 Hz (Δt = 10 ms), fijando f_Nyquist = 50 Hz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: COMPLEX ANALYSIS, RESIDUES & ANALYTICAL MECHANICS             */}
      {/* ==================================================================== */}
      {activeTab === 'complex' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold block">
              {lang === 'en' ? 'Complex Variables & Variational Mechanics' : 'Variable Compleja y Mecánica Variacional'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en' ? 'Cauchy-Riemann Conditions, Residue Integrals & Fermat Ray Tracing' : 'Condiciones de Cauchy-Riemann, Teorema de los Residuos y Trazado de Rayos de Fermat'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'Complex potential flow in hydrogeology, contour integration of seismic surface waves, and the principle of least action.'
                : 'Flujo potencial complejo en hidrogeología, cálculo de integrales de contorno en dispersión de ondas superficiales y el principio de mínima acción.'}
            </p>
          </div>

          {/* Module A: Cauchy-Riemann & Potential Flow */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase font-bold block">A. Condiciones de Cauchy-Riemann y Flujo 2D</span>
                <h4 className="text-sm font-bold text-white font-mono">W(z) = φ(x,y) + i ψ(x,y) ⇒ ∂φ/∂x = ∂ψ/∂y , ∂φ/∂y = -∂ψ/∂x</h4>
              </div>
              <div className="flex items-center gap-2">
                {['dipole', 'cylinder'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setComplexFlowMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      complexFlowMode === mode
                        ? 'bg-rose-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'dipole' ? 'Dipolo Hidráulico' : 'Flujo con Obstáculo'}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <canvas ref={complexCanvasRef} width={540} height={210} className="w-full h-[200px] block" />
            </div>
          </div>

          {/* Module B: Residue Theorem & Fermat Ray Tracing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-xs font-mono text-amber-400 uppercase font-bold block">B. Teorema de los Residuos de Cauchy</span>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 font-bold overflow-x-auto">
                ∮_Γ f(z) dz = 2π i ∑ Res(f, z_k)
              </pre>
              <p className="text-slate-300 leading-relaxed font-sans">
                La herramienta analítica definitiva para evaluar integrales impropias de Fourier en el semiespacio elástico. Permite calcular la dispersión de las ondas superficiales de Rayleigh y Love y deducir la atenuación sísmica intrínseca Q⁻¹ mediante polos en el plano complejo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">C. Principio de Fermat & Trazado de Rayos</span>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 font-bold overflow-x-auto">
                δ ∫ (ds / v(x⃗)) = 0 ⇒ p = sin(i) / v = const
              </pre>
              <p className="text-slate-300 leading-relaxed font-sans">
                Principio variacional de mínimo tiempo de Fermat: el trayecto que recorre un rayo sísmico entre el hipocentro y el sismómetro minimiza el tiempo de viaje. De aquí se deduce directamente la Ley de Snell y el parámetro de rayo p que curva los frentes de onda en el interior de la Tierra.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
