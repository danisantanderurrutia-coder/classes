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
  Maximize2
} from 'lucide-react';

export default function PhysicsToolkit({ lang = 'es', onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('physics'); // 'physics' | 'algebra' | 'calculus'

  // ==========================================================================
  // RIGHT HAND RULE (RHR) INTERACTIVE STATE
  // ==========================================================================
  const [rhrMode, setRhrMode] = useState('lorentz'); // 'lorentz' | 'torque' | 'omega' | 'coriolis' | 'pure'
  const [vectorAngle, setVectorAngle] = useState(60); // degrees between A and B
  const [magA, setMagA] = useState(3.5);
  const [magB, setMagB] = useState(3.0);
  const rhrCanvasRef = useRef(null);

  // ==========================================================================
  // 2x2 MATRIX DIAGONALIZATION SANDBOX STATE
  // Matrix A = [ [a, b], [b, d] ] (symmetric)
  // ==========================================================================
  const [matA, setMatA] = useState(4);
  const [matB, setMatB] = useState(2);
  const [matD, setMatD] = useState(1);

  // Compute eigenvalues for [ [matA, matB], [matB, matD] ]
  const tr = matA + matD;
  const det = matA * matD - matB * matB;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = (tr + Math.sqrt(disc)) / 2;
  const lambda2 = (tr - Math.sqrt(disc)) / 2;

  // Eigenvectors
  // For lambda1: (matA - lambda1)*v1x + matB*v1y = 0 => v1 = [-matB, matA - lambda1]
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

  let v2x = -v1y; // orthogonal since matrix is symmetric
  let v2y = v1x;

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

    // Subtle 3D grid plane
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    const originX = W / 2 - 20;
    const originY = H / 2 + 45;

    // Grid on X-Y plane (isometric tilt)
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

    // Origin point
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Vector A (along X-axis tilted: 2.5D projection)
    const scaleA = magA * 26;
    const ax = originX + scaleA * 0.95;
    const ay = originY + scaleA * 0.22;

    // Vector B (rotated by vectorAngle in the horizontal plane)
    const rad = (vectorAngle * Math.PI) / 180;
    const scaleB = magB * 24;
    const bx = originX + scaleB * Math.cos(rad) * 0.95 - scaleB * Math.sin(rad) * 0.65;
    const by = originY + scaleB * Math.cos(rad) * 0.22 - scaleB * Math.sin(rad) * 0.45;

    // Vector C = A x B (perpendicular vertical axis pointing UP!)
    const crossMag = magA * magB * Math.sin(rad);
    const scaleC = Math.min(130, Math.max(30, crossMag * 14));
    const cx = originX;
    const cy = originY - scaleC;

    // Helper: draw 3D vector arrow
    const drawVec = (x1, y1, x2, y2, color, label, lw = 3) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const head = 9;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Label with pill
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      const tw = ctx.measureText(label).width;
      const lx = x2 + Math.cos(angle) * 12 - tw / 2;
      const ly = y2 + Math.sin(angle) * 12 + 4;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(lx - 5, ly - 12, tw + 10, 16);
      ctx.fillStyle = color;
      ctx.fillText(label, lx, ly);
      ctx.restore();
    };

    // Arc between Vector A and Vector B
    ctx.save();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.ellipse(originX, originY, 40, 20, 0, 0, -rad);
    ctx.stroke();
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`θ = ${vectorAngle}°`, originX + 38, originY - 14);
    ctx.restore();

    // Draw Vector A (Pulgar / Thumb)
    let labelA = 'A⃗ (Pulgar)';
    let labelB = 'B⃗ (Índice)';
    let labelC = 'C⃗ = A⃗ × B⃗ (Palma / Saliente)';

    if (rhrMode === 'lorentz') {
      labelA = 'v⃗ (Velocidad)';
      labelB = 'B⃗ (Campo Magnético)';
      labelC = 'F⃗_m = q(v⃗ × B⃗) (Fuerza)';
    } else if (rhrMode === 'torque') {
      labelA = 'r⃗ (Brazo de Palanca)';
      labelB = 'F⃗ (Fuerza Aplicada)';
      labelC = 'τ⃗ = r⃗ × F⃗ (Torque / Momento)';
    } else if (rhrMode === 'omega') {
      labelA = 'ω⃗ (Velocidad Angular)';
      labelB = 'r⃗ (Radio Vector)';
      labelC = 'v⃗ = ω⃗ × r⃗ (Velocidad Tangencial)';
    } else if (rhrMode === 'coriolis') {
      labelA = 'Ω⃗ (Rotación Terrestre)';
      labelB = 'v⃗ (Viento / Corriente)';
      labelC = 'a⃗_cor = -2(Ω⃗ × v⃗) (Coriolis)';
    }

    drawVec(originX, originY, ax, ay, '#38BDF8', labelA, 3);
    drawVec(originX, originY, bx, by, '#34D399', labelB, 3);
    drawVec(originX, originY, cx, cy, '#F59E0B', labelC, 3.5);

    // Curled fingers rotation arc indicator around C-axis
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(originX, originY - scaleC * 0.45, 28, 14, 0, 0, Math.PI * 1.8);
    ctx.stroke();
    // Arrowhead on curl
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(originX + 28, originY - scaleC * 0.45, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Dedos giran de A⃗ hacia B⃗', originX - 65, originY - scaleC * 0.45 - 8);
    ctx.restore();
  }, [rhrMode, vectorAngle, magA, magB]);

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 overflow-hidden shadow-2xl mb-12">
      {/* Compendium Header */}
      <div className="px-6 py-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Foundational STEM Laws & Master Tools'
                : 'Leyes Fundamentales & Caja de Herramientas Clave'}
            </span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {lang === 'en'
              ? 'Compendium of Universal Laws: Physics • Linear Algebra • Calculus'
              : 'Compendio de Leyes y Herramientas: Física • Álgebra • Cálculo'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'en'
              ? 'The conceptual pillars that university exams always test: from interactive right-hand rule vectors to matrix diagonalization recipes and the divergence/curl dictionary.'
              : 'Los pilares conceptuales obligados en todo examen universitario: desde la regla de la mano derecha en vivo hasta la receta de diagonalización y el diccionario del operador Nabla.'}
          </p>
        </div>

        {/* 3 Main Compendium Section Pills */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold shrink-0">
          {[
            {
              id: 'physics',
              labelEs: '1. Leyes de la Física & Mano Derecha',
              labelEn: '1. Physics Laws & Right-Hand Rule'
            },
            {
              id: 'algebra',
              labelEs: '2. Álgebra: Diagonalización (A=PDP⁻¹)',
              labelEn: '2. Algebra: Diagonalization (A=PDP⁻¹)'
            },
            {
              id: 'calculus',
              labelEs: '3. Cálculo: Diccionario ∇ & Teoremas',
              labelEn: '3. Calculus: Nabla ∇ & Theorems'
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {lang === 'en' ? tab.labelEn : tab.labelEs}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PHYSICS LAWS & INTERACTIVE RIGHT-HAND RULE                     */}
      {/* ==================================================================== */}
      {activeTab === 'physics' && (
        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Right Hand Rule Interactive Canvas */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  {lang === 'en' ? 'Interactive 3D Vector Cross Product' : 'Visualizador 3D Interactivo de Producto Vectorial'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'en'
                    ? 'The Universal Right-Hand Rule (RHR)'
                    : 'La Regla de la Mano Derecha y el Producto Cruz (A⃗ × B⃗)'}
                </h3>
              </div>

              {/* RHR Application Case Selector */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                {[
                  { id: 'lorentz', label: 'Lorentz (q v⃗ × B⃗)' },
                  { id: 'torque', label: 'Torque (r⃗ × F⃗)' },
                  { id: 'omega', label: 'Velocidad (ω⃗ × r⃗)' },
                  { id: 'coriolis', label: 'Coriolis (-2Ω⃗ × v⃗)' },
                  { id: 'pure', label: 'Puro (A⃗ × B⃗)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRhrMode(item.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      rhrMode === item.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
              {/* Canvas 2.5D Vector Representation */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1120]">
                  <canvas ref={rhrCanvasRef} width={520} height={290} className="w-full h-[260px] sm:h-[280px] block" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-amber-300">
                    |C⃗| = |A⃗||B⃗| sin(θ) = {(magA * magB * Math.sin((vectorAngle * Math.PI) / 180)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Sliders & Finger Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>{lang === 'en' ? 'Angle between vectors (θ):' : 'Ángulo entre vectores (θ):'}</span>
                      <strong className="text-amber-400">{vectorAngle}°</strong>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={170}
                      step={5}
                      value={vectorAngle}
                      onChange={(e) => setVectorAngle(parseInt(e.target.value))}
                      className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>|A⃗|:</span>
                        <strong className="text-sky-400">{magA}</strong>
                      </div>
                      <input
                        type="range"
                        min={1.5}
                        max={5}
                        step={0.5}
                        value={magA}
                        onChange={(e) => setMagA(parseFloat(e.target.value))}
                        className="w-full accent-sky-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>|B⃗|:</span>
                        <strong className="text-emerald-400">{magB}</strong>
                      </div>
                      <input
                        type="range"
                        min={1.5}
                        max={5}
                        step={0.5}
                        value={magB}
                        onChange={(e) => setMagB(parseFloat(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Pedagogical Finger Rule Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-amber-400 font-bold uppercase tracking-wider">
                    🖐️ {lang === 'en' ? 'Finger Orientation Standard:' : 'Mapeo Oficial de los Dedos:'}
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>
                      <span className="text-sky-400 font-bold">1. Pulgar:</span> Apunta en la dirección del primer vector (A⃗).
                    </li>
                    <li>
                      <span className="text-emerald-400 font-bold">2. Índice:</span> Apunta en la dirección del segundo vector (B⃗).
                    </li>
                    <li>
                      <span className="text-amber-400 font-bold">3. Palma / Dedo Medio:</span> Emerge hacia afuera indicando el producto cruz (A⃗ × B⃗).
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-300">
                    ⚠️ <em>¡Trampa de Examen!</em> Si la carga es negativa (electrón, q &lt; 0), la fuerza magnética se invierte: F⃗_m apunta al revés de la regla.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: The 4 Maxwell Equations Master Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-mono text-xs font-bold flex items-center justify-center">
                ∇·B
              </span>
              <h3 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'The 4 Maxwell Equations (Differential & Integral Forms)'
                  : 'Las 4 Ecuaciones de Maxwell (Forma Diferencial e Integral)'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  nameEs: '1. Ley de Gauss Eléctrica',
                  nameEn: '1. Gauss’s Law for Electricity',
                  diff: '∇ · E⃗ = ρ / ε₀',
                  integ: '∮ E⃗ · d A⃗ = Q_enc / ε₀',
                  meaningEs: 'Las cargas eléctricas positivas son fuentes de campo y las negativas son sumideros. No hay campo sin carga.',
                  meaningEn: 'Electric charges act as sources and sinks of E-field. Lines diverge from positive to negative.'
                },
                {
                  nameEs: '2. Ley de Gauss Magnética',
                  nameEn: '2. Gauss’s Law for Magnetism',
                  diff: '∇ · B⃗ = 0',
                  integ: '∮ B⃗ · d A⃗ = 0',
                  meaningEs: 'No existen los monopolos magnéticos aislados en la naturaleza. Las líneas de campo magnético son siempre bucles cerrados.',
                  meaningEn: 'No magnetic monopoles exist. Magnetic field lines always form closed continuous loops.'
                },
                {
                  nameEs: '3. Ley de Faraday-Lenz (Inducción)',
                  nameEn: '3. Faraday’s Law of Induction',
                  diff: '∇ × E⃗ = - ∂B⃗ / ∂t',
                  integ: '∮ E⃗ · d r⃗ = - dΦ_B / dt',
                  meaningEs: 'Un campo magnético que varía en el tiempo genera un campo eléctrico circulante (fem inducida) que frena la causa que lo produjo.',
                  meaningEn: 'A time-varying magnetic flux induces a circulating electric field (EMF) opposing the change.'
                },
                {
                  nameEs: '4. Ley de Ampère-Maxwell',
                  nameEn: '4. Ampère-Maxwell Law',
                  diff: '∇ × B⃗ = μ₀ J⃗ + μ₀ ε₀ (∂E⃗ / ∂t)',
                  integ: '∮ B⃗ · d r⃗ = μ₀ I_enc + μ₀ ε₀ (dΦ_E / dt)',
                  meaningEs: 'Tanto las corrientes eléctricas como los campos eléctricos variables en el tiempo generan campos magnéticos circulantes.',
                  meaningEn: 'Both electric currents and changing electric flux induce circulating magnetic fields (displacement current).'
                }
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-sky-300 font-mono">
                      {lang === 'en' ? m.nameEn : m.nameEs}
                    </strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Diferencial (∇)</span>
                      <strong className="text-emerald-400">{m.diff}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Integral (∮)</span>
                      <strong className="text-amber-400">{m.integ}</strong>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {lang === 'en' ? m.meaningEn : m.meaningEs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: LINEAR ALGEBRA MASTER RECIPE: DIAGONALIZATION (A = P D P⁻¹)   */}
      {/* ==================================================================== */}
      {activeTab === 'algebra' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold block">
              {lang === 'en' ? 'Linear Algebra Core Algorithm' : 'Algoritmo Central de Álgebra Lineal en Ingeniería'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en'
                ? 'Matrix Diagonalization: A = P D P⁻¹ (Spectral Decomposition)'
                : 'Receta Maestra de Diagonalización de Matrices: A = P D P⁻¹'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'Why do we diagonalize in physics and engineering? Because diagonalizing rotates the coordinate system into the principal axes where coupled differential equations completely decouple into independent single-degree-of-freedom oscillators!'
                : '¿Por qué diagonalizamos en física e ingeniería? Porque rotar la matriz a sus ejes propios desacopla sistemas de osciladores acoplados, diagonaliza el tensor de inercia y simplifica la resolución de EDOs lineales complejas.'}
            </p>
          </div>

          {/* Interactive 2x2 Matrix Diagonalizer Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
            {/* Left: Input Matrix Sliders */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase text-purple-300 font-bold block">
                {lang === 'en' ? 'Matriz Simétrica A (2×2):' : 'Manipula la Matriz Simétrica A (2×2):'}
              </span>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-center text-lg space-y-1">
                <div className="text-slate-400 text-xs mb-2">A = [ [a, b], [b, d] ]</div>
                <div className="flex items-center justify-center gap-4 text-purple-400 font-bold">
                  <span>[</span>
                  <span className="text-sky-300">{matA}</span>
                  <span className="text-amber-300">{matB}</span>
                  <span>]</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-purple-400 font-bold">
                  <span>[</span>
                  <span className="text-amber-300">{matB}</span>
                  <span className="text-emerald-300">{matD}</span>
                  <span>]</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Parámetro a:</span>
                    <strong className="text-sky-300">{matA}</strong>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={8}
                    step={1}
                    value={matA}
                    onChange={(e) => setMatA(parseInt(e.target.value))}
                    className="w-full accent-sky-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Parámetro b (Acoplamiento):</span>
                    <strong className="text-amber-300">{matB}</strong>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={8}
                    step={1}
                    value={matB}
                    onChange={(e) => setMatB(parseInt(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Parámetro d:</span>
                    <strong className="text-emerald-300">{matD}</strong>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={8}
                    step={1}
                    value={matD}
                    onChange={(e) => setMatD(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>
            </div>

            {/* Right: Step-by-Step Mathematical Derivation */}
            <div className="lg:col-span-7 space-y-3 font-mono text-xs">
              <span className="text-xs uppercase text-emerald-400 font-bold block">
                {lang === 'en' ? 'Live Klausur Derivation Steps:' : 'Paso a Paso Oficial de Resolución (Klausur):'}
              </span>

              {/* Step 1 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">1. Polinomio Característico: det(A - λI) = 0</span>
                <div className="text-slate-200">
                  λ² - ({tr})λ + ({det}) = 0   ⇒   Discriminante Δ = {disc.toFixed(1)}
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">2. Autovalores (Valores Propios / Frecuencias):</span>
                <div className="flex items-center gap-4 text-emerald-400 font-bold">
                  <span>λ₁ = {lambda1.toFixed(2)}</span>
                  <span>λ₂ = {lambda2.toFixed(2)}</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">3. Autovectores Normalizados (Base Ortogonal en Ker(A - λI)):</span>
                <div className="grid grid-cols-2 gap-2 text-sky-300">
                  <div>v⃗₁ = [{v1x.toFixed(2)}, {v1y.toFixed(2)}]ᵀ</div>
                  <div>v⃗₂ = [{v2x.toFixed(2)}, {v2y.toFixed(2)}]ᵀ</div>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Verificación de ortogonalidad: v⃗₁ · v⃗₂ = {(v1x * v2x + v1y * v2y).toFixed(3)} ≈ 0 (Ortogonales)
                </span>
              </div>

              {/* Step 4 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">4. Forma Diagonal Desacoplada: D = P⁻¹ A P = Pᵀ A P</span>
                <div className="text-amber-300 font-bold">
                  D = [ [ {lambda1.toFixed(2)}, 0.00 ], [ 0.00, {lambda2.toFixed(2)} ] ]
                </div>
              </div>
            </div>
          </div>

          {/* Practical Application Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <strong className="text-sky-300 font-mono block">1. En Oscilaciones & Ondas</strong>
              <p className="text-slate-400 leading-relaxed font-sans">
                Las masas acopladas por resortes tienen frecuencias naturales dadas por los autovalores:
                <code className="text-white block font-mono mt-1">ω_i = √(λ_i)</code>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <strong className="text-emerald-300 font-mono block">2. En Sólido Rígido</strong>
              <p className="text-slate-400 leading-relaxed font-sans">
                Diagonalizar el tensor de inercia 3×3 elimina los productos de inercia y revela los 3 ejes principales de rotación sin cabeceo.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <strong className="text-purple-300 font-mono block">3. En Geofísica & Geotecnia</strong>
              <p className="text-slate-400 leading-relaxed font-sans">
                Diagonalizar el tensor de tensiones de Cauchy encuentra las tensiones principales máximas (σ₁, σ₂) de rotura del suelo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: VECTOR CALCULUS: NABLA (∇) DICTIONARY & INTEGRAL THEOREMS     */}
      {/* ==================================================================== */}
      {activeTab === 'calculus' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              {lang === 'en' ? 'Multivariable Differential & Integral Calculus' : 'Cálculo Multivariable y Análisis Vectorial'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {lang === 'en'
                ? 'The Nabla Operator (∇) Dictionary & The 3 Fundamental Integral Theorems'
                : 'El Diccionario del Operador Nabla (∇) y los 3 Teoremas Integrales'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'The mathematical language of fluid dynamics, electromagnetism, and gravitation: what gradient, divergence, curl, and laplacian physically represent.'
                : 'El lenguaje matemático universal de la geofísica, los fluidos y el electromagnetismo: qué miden físicamente el gradiente, la divergencia, el rotacional y el laplaciano.'}
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
                meaningEs: 'Vector que apunta en la dirección de máximo crecimiento del campo escalar. Su módulo es la tasa de cambio espacial (ej. -∇P empuja el viento hacia la baja presión).'
              },
              {
                sym: '∇ · F⃗',
                nameEs: 'Divergencia',
                nameEn: 'Divergence',
                inOut: 'Vector → Escalar',
                color: 'text-emerald-400',
                meaningEs: 'Mide la tasa neta de flujo que sale de un volumen puntual infinitesimal. Positiva = Fuente (manantial); Negativa = Sumidero (drenaje); Cero = Incompresible.'
              },
              {
                sym: '∇ × F⃗',
                nameEs: 'Rotacional (Curl)',
                nameEn: 'Curl',
                inOut: 'Vector → Vector',
                color: 'text-amber-400',
                meaningEs: 'Mide la tendencia de un campo a girar o rotar en torno a un punto. Si colocas una paleta flotante en el fluido, rotará a velocidad angular proporcional a ∇×F⃗.'
              },
              {
                sym: '∇² f',
                nameEs: 'Laplaciano',
                nameEn: 'Laplacian',
                inOut: 'Escalar → Escalar',
                color: 'text-purple-400',
                meaningEs: 'Divergencia del gradiente (∇·∇f). Mide cuánto difiere el valor en un punto del promedio de sus vecinos. Gobierna difusión, calor (∂u/∂t = α∇²u) y ondas.'
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

          {/* The 3 Fundamental Integral Theorems */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white font-mono uppercase tracking-wider text-slate-200">
              {lang === 'en'
                ? 'The 3 Big Integral Theorems of University Klausuren:'
                : 'La Trinidad de Teoremas Integrales en Exámenes Universitarios:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-sky-400 uppercase font-bold block">1. Teorema del Gradiente</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∫_A^B (∇φ) · d r⃗ = φ(B) - φ(A)
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Independencia de la trayectoria: El trabajo en un campo conservativo sólo depende de los puntos extremos, no del camino recorrido.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold block">2. Teorema de Green / Stokes</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∮_C F⃗ · d r⃗ = ∬_S (∇ × F⃗) · d A⃗
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Circulación de línea cerrada a lo largo del borde C es igual al flujo del rotacional atravesando la superficie abierta S contenida por C.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">3. Teorema de la Divergencia de Gauss</span>
                <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 font-bold overflow-x-auto whitespace-pre-wrap">
                  ∯_S F⃗ · d A⃗ = ∭_V (∇ · F⃗) dV
                </pre>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Flujo neto hacia afuera a través de una superficie cerrada S es igual a la suma integral de todas las divergencias internas en el volumen V.
                </p>
              </div>
            </div>
          </div>

          {/* Jacobian and Coordinate Transformations Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
              {lang === 'en' ? 'Jacobian Differential Volume Elements (dx dy dz):' : 'Elementos de Volumen y Factores de Escala (Jacobianos):'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Coordenadas Polares (2D)</span>
                <strong className="text-white block mt-1">dA = r · dr · dθ</strong>
                <span className="text-slate-500 text-[10px]">Jacobiano = r</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Coordenadas Cilíndricas (3D)</span>
                <strong className="text-white block mt-1">dV = r · dr · dθ · dz</strong>
                <span className="text-slate-500 text-[10px]">Jacobiano = r</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Coordenadas Esféricas (3D)</span>
                <strong className="text-white block mt-1">dV = ρ² sin(φ) · dρ · dφ · dθ</strong>
                <span className="text-slate-500 text-[10px]">Jacobiano = ρ² sin(φ)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
