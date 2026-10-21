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
  Cpu,
  Atom,
  Flame,
  Wind
} from 'lucide-react';
import MathFormula from './MathFormula';

export default function PhysicsToolkit({ lang = 'en', onOpenBooking }) {
  const isEn = lang === 'en';
  // Tabs: 'physics' | 'algebra' | 'calculus' | 'signals' | 'complex'
  const [activeTab, setActiveTab] = useState('physics');

  // Sub-filter for physics laws
  const [physicsLawCategory, setPhysicsLawCategory] = useState('all');

  // Sub-filter for linear algebra formulations
  const [algebraCategory, setAlgebraCategory] = useState('all');

  // Sub-filter for calculus formulations
  const [calculusCategory, setCalculusCategory] = useState('all');

  // ==========================================================================
  // 1. RIGHT HAND RULE (RHR) INTERACTIVE STATE
  // ==========================================================================
  const [rhrMode, setRhrMode] = useState('lorentz'); // 'lorentz' | 'torque' | 'omega' | 'coriolis' | 'pure'
  const [vectorAngle, setVectorAngle] = useState(60); // degrees between A and B
  const [magA, setMagA] = useState(3.5);
  const [magB, setMagB] = useState(3.0);
  const rhrCanvasRef = useRef(null);

  // ==========================================================================
  // 2. 2x2 MATRIX DIAGONALIZATION & SPECTRAL THEOREM STATE
  // Matrix A = [ [matA, matB], [matB, matD] ] (symmetric)
  // ==========================================================================
  const [matA, setMatA] = useState(4);
  const [matB, setMatB] = useState(2);
  const [matD, setMatD] = useState(1);
  const [leastSquaresEps, setLeastSquaresEps] = useState(0.20); // damping parameter epsilon^2

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

  // Least Squares with Tikhonov damping on test data d = [6, 2]^T
  // (A^T A + eps^2 I) m = A^T d
  const m11 = matA * matA + matB * matB + leastSquaresEps;
  const m12 = matA * matB + matB * matD;
  const m22 = matB * matB + matD * matD + leastSquaresEps;
  const detM = m11 * m22 - m12 * m12;
  const at_d1 = matA * 6 + matB * 2;
  const at_d2 = matB * 6 + matD * 2;
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
  // 4. COMPLEX POTENTIAL FLOW STATE
  // ==========================================================================
  const [complexFlowMode, setComplexFlowMode] = useState('dipole'); // 'dipole' | 'cylinder'
  const complexCanvasRef = useRef(null);

  // ==========================================================================
  // MASTER COMPENDIUM OF FUNDAMENTAL LAWS (KATEX LATEX FORMULATIONS)
  // ==========================================================================
  const ALL_FUNDAMENTAL_LAWS = [
    {
      id: "newton_first",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Newton's 1st Law of Motion (Law of Inertia)",
      titleEs: "1ª Ley de Newton (Principio de Inercia)",
      latex: "\\sum \\mathbf{F} = \\mathbf{0} \\implies \\frac{d\\mathbf{v}}{dt} = \\mathbf{0} \\quad (\\mathbf{v} = \\text{const})",
      descEn: "An object remains at rest or in uniform straight-line motion unless acted upon by a net external force. Defines inertial reference frames.",
      descEs: "Un cuerpo permanece en reposo o en movimiento rectilíneo uniforme a menos que actúe sobre él una fuerza neta externa. Define los marcos de referencia inerciales."
    },
    {
      id: "newton_second",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Newton's 2nd Law of Motion (Momentum Formulation)",
      titleEs: "2ª Ley de Newton (Dinámica y Momento Lineal)",
      latex: "\\mathbf{F}_{\\text{net}} = \\frac{d\\mathbf{p}}{dt} = m\\mathbf{a}",
      descEn: "The rate of change of linear momentum equals the net external force. In constant mass systems, it reduces to F = ma, the bedrock of classical dynamics.",
      descEs: "La tasa temporal de cambio del momento lineal es igual a la fuerza neta exterior. Con masa constante se reduce a F = ma, base de la dinámica clásica."
    },
    {
      id: "newton_third",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Newton's 3rd Law of Motion (Action and Reaction)",
      titleEs: "3ª Ley de Newton (Acción y Reacción)",
      latex: "\\mathbf{F}_{12} = -\\mathbf{F}_{21} \\quad \\Big| \\quad \\sum_{i=1}^N \\mathbf{p}_i = \\text{const}",
      descEn: "When two bodies interact, forces occur in equal and opposite pairs collinear with the interaction axis, leading directly to global conservation of momentum.",
      descEs: "Al interactuar dos cuerpos, las fuerzas surgen en pares de igual magnitud y sentido opuesto, fundamentando la conservación del momento lineal del sistema."
    },
    {
      id: "universal_gravitation",
      category: "mechanics",
      courseCode: "AST-401 / PHY-201",
      titleEn: "Newton's Law of Universal Gravitation & Gravitational Potential",
      titleEs: "Ley de Gravitación Universal y Potencial Gravitatorio",
      latex: "\\mathbf{F}_g = -G \\frac{M m}{r^2} \\hat{\\mathbf{r}} \\quad \\Big| \\quad \\Phi(r) = -\\frac{G M}{r}",
      descEn: "Every mass attracts every other mass along the radial line. The conservative force field derives from the scalar potential via F = -m∇Φ, obeying Gauss's law for gravity.",
      descEs: "Toda masa atrae a cualquier otra a lo largo de la línea radial. El campo conservativo deriva del potencial escalar F = -m∇Φ y satisface la ley de Gauss gravitatoria."
    },
    {
      id: "conservation_energy_momentum",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Conservation of Mechanical Energy & Angular Momentum",
      titleEs: "Conservación de Energía Mecánica y Momento Angular",
      latex: "E = T + V = \\text{const} \\quad \\Big| \\quad \\mathbf{L} = \\mathbf{r} \\times \\mathbf{p}, \\; \\frac{d\\mathbf{L}}{dt} = \\boldsymbol{\\tau}_{\\text{ext}}",
      descEn: "By Noether's theorem, time translation invariance yields energy conservation, while rotational symmetry yields angular momentum conservation in central force fields.",
      descEs: "Por el teorema de Noether, la simetría temporal garantiza la conservación de la energía, y la simetría rotacional conserva el momento angular en campos centrales."
    },
    {
      id: "kepler_laws",
      category: "mechanics",
      courseCode: "AST-401",
      titleEn: "Kepler's Planetary Laws (Harmonic Law & Equal Areas)",
      titleEs: "Leyes de Kepler (Ley Armónica y Áreas Iguales)",
      latex: "T^2 = \\frac{4\\pi^2}{G (M + m)} \\, a^3 \\quad \\Big| \\quad \\frac{dA}{dt} = \\frac{L}{2m} = \\text{const}",
      descEn: "Orbital periods scale with semi-major axes cubed (3rd law). The radius vector sweeps equal orbital areas in equal intervals (2nd law), reflecting constant angular momentum.",
      descEs: "El cuadrado del período orbital es proporcional al cubo del semieje mayor (3ª ley). El radio vector barre áreas iguales en tiempos iguales (2ª ley) por conservación de L."
    },
    {
      id: "harmonic_oscillator",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Damped & Forced Harmonic Oscillator Equation",
      titleEs: "Oscilador Armónico Amortiguado y Forzado",
      latex: "m \\ddot{x} + c \\dot{x} + k x = F_0 \\cos(\\omega t) \\implies x_p(t) = A(\\omega)\\cos(\\omega t - \\delta)",
      descEn: "Fundamental resonance equation for structural, seismic, and mechanical vibrations. Yields quality factor Q, bandwidth Δω, and sharp resonance peaks at ω₀.",
      descEs: "Ecuación fundamental de resonancia para vibraciones estructurales y sísmicas. Determina el factor de calidad Q, ancho de banda y picos de resonancia en ω₀."
    },
    {
      id: "coupled_oscillators_modes",
      category: "mechanics",
      courseCode: "PHY-201 / MAT-102",
      titleEn: "Coupled Oscillators & Normal Vibration Modes",
      titleEs: "Osciladores Acoplados y Modos Normales de Vibración",
      latex: "\\mathbf{M} \\ddot{\\mathbf{x}} + \\mathbf{K} \\mathbf{x} = \\mathbf{0} \\implies \\det(\\mathbf{K} - \\omega^2 \\mathbf{M}) = 0",
      descEn: "Generalized eigenvalue problem governing multi-degree-of-freedom buildings, molecular lattices, and terrestrial normal modes excited by megathrust earthquakes.",
      descEs: "Problema generalizado de autovalores que rige edificios multisísmicos, redes moleculares y modos normales de la Tierra tras megaterremotos."
    },
    {
      id: "work_energy",
      category: "mechanics",
      courseCode: "PHY-201",
      titleEn: "Work-Kinetic Energy Theorem",
      titleEs: "Teorema del Trabajo y la Energía Cinética",
      latex: "W_{\\text{net}} = \\int \\mathbf{F}_{\\text{net}} \\cdot d\\mathbf{r} = \\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2",
      descEn: "The line integral of net force along a particle's trajectory equals the exact change in kinetic energy, independent of conservative or non-conservative paths.",
      descEs: "La integral de línea de la fuerza neta a lo largo de la trayectoria equivale exactamente a la variación de energía cinética, con fuerzas conservativas o disipativas."
    },
    {
      id: "lagrange_hamilton_mechanics",
      category: "mechanics",
      courseCode: "PHY-201 / FCFM-501",
      titleEn: "Euler-Lagrange & Hamilton's Canonical Equations",
      titleEs: "Mecánica Analítica de Lagrange y Hamilton",
      latex: "\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0, \\quad \\dot{q}_i = \\frac{\\partial H}{\\partial p_i}, \\; \\dot{p}_i = -\\frac{\\partial H}{\\partial q_i}",
      descEn: "Variational principle of stationary action (Hamilton's Principle). Reformulates Newtonian mechanics in generalized coordinates, crucial for geodynamics and modern physics.",
      descEs: "Principio variacional de acción estacionaria (Hamilton). Reformula la mecánica newtoniana en coordenadas generalizadas, vital en geodinámica y física teórica."
    },
    {
      id: "navier_cauchy_elastodynamics",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Navier-Cauchy Equation of Elastodynamics (Seismic Waves)",
      titleEs: "Ecuación de Navier-Cauchy (Elastodinámica y Ondas Sísmicas)",
      latex: "\\rho \\frac{\\partial^2 \\mathbf{u}}{\\partial t^2} = (\\lambda + \\mu) \\nabla(\\nabla \\cdot \\mathbf{u}) + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}",
      descEn: "Governing equation for seismic wave propagation in isotropic elastic media. Governs both body wave types and boundary-guided surface waves (Rayleigh & Love).",
      descEs: "Ecuación diferencial que rige la propagación de ondas sísmicas en sólidos elásticos isotrópicos. Determina ondas de cuerpo y ondas superficiales (Rayleigh y Love)."
    },
    {
      id: "helmholtz_p_s_waves",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Helmholtz Decomposition & P and S Wave Speeds",
      titleEs: "Descomposición de Helmholtz y Velocidades de Onda P y S",
      latex: "\\mathbf{u} = \\nabla\\phi + \\nabla \\times \\boldsymbol{\\psi} \\implies v_P = \\sqrt{\\frac{\\lambda + 2\\mu}{\\rho}}, \\quad v_S = \\sqrt{\\frac{\\mu}{\\rho}}",
      descEn: "Separates displacement into irrotational dilational P-waves (compressional) and equivoluminal rotational S-waves (shear). Since μ > 0, v_P is always greater than v_S.",
      descEs: "Descompone el desplazamiento en ondas P compresionales (sin rotación) y ondas S de cizalle (sin cambio de volumen). Dado que μ > 0, v_P siempre supera a v_S."
    },
    {
      id: "snell_seismic_refraction",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Snell's Law of Seismic Refraction & Ray Parameter",
      titleEs: "Ley de Snell Sísmica, Parámetro de Rayo y Ángulo Crítico",
      latex: "\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2} = p \\quad \\implies \\quad \\sin\\theta_c = \\frac{v_1}{v_2}",
      descEn: "Governs seismic ray bending across acoustic interfaces with ray parameter p. At critical angle θ_c, waves generate head waves propagating along the Moho discontinuity.",
      descEs: "Rige la refracción de rayos sísmicos en interfaces acústicas. En el ángulo crítico θ_c se generan ondas cónicas que viajan por discontinuidades como el Moho."
    },
    {
      id: "seismic_moment_magnitude",
      category: "geophysics",
      courseCode: "GEO-401",
      titleEn: "Seismic Moment & Moment Magnitude Scale (Hanks-Kanamori)",
      titleEs: "Momento Sísmico y Escala de Magnitud de Momento (Mw)",
      latex: "M_0 = \\mu A \\bar{D} \\quad \\Big| \\quad M_w = \\frac{2}{3}\\left(\\log_{10} M_0 - 9.1\\right)",
      descEn: "Physical quantification of earthquake rupture size based on shear modulus μ, fault rupture area A, and average slip D. Unlike Richter scales, Mw does not saturate.",
      descEs: "Cuantificación física de la energía de ruptura sísmica basada en rigidez μ, área de falla A y deslizamiento medio D. No se satura en megaterremotos de subducción."
    },
    {
      id: "gutenberg_richter",
      category: "geophysics",
      courseCode: "GEO-401",
      titleEn: "Gutenberg-Richter Frequency-Magnitude Distribution",
      titleEs: "Ley de Gutenberg-Richter (Frecuencia-Magnitud Sísmica)",
      latex: "\\log_{10} N(\\ge M_w) = a - b M_w \\quad (b \\approx 1.0)",
      descEn: "Statistical scaling law stating that the cumulative number of earthquakes N with magnitude ≥ Mw decreases exponentially. Parameter b reveals regional tectonic stress state.",
      descEs: "Ley empírica universal que indica que el número acumulado de sismos de magnitud ≥ Mw decae exponencialmente. El valor b refleja el estado de esfuerzo tectónico."
    },
    {
      id: "omori_utsu_aftershocks",
      category: "geophysics",
      courseCode: "GEO-401",
      titleEn: "Modified Omori-Utsu Law for Aftershock Decay Rate",
      titleEs: "Ley Modificada de Omori-Utsu (Tasa de Réplicas Sísmicas)",
      latex: "n(t) = \\frac{K}{(t + c)^p} \\quad (p \\approx 1.0 - 1.2)",
      descEn: "Predicts the temporal frequency of aftershocks n(t) following a mainshock. The power-law decay parameter p characterizes crustal thermal gradient and stress relaxation.",
      descEs: "Describe el decaimiento hiperbólico temporal de réplicas tras un sismo principal. El parámetro p refleja el gradiente térmico cortical y la relajación de esfuerzos."
    },
    {
      id: "isostasy_airy_pratt",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Airy-Heiskanen Isostasy & Crustal Root Compensation",
      titleEs: "Isostasia de Airy y Compensación de Raíces Corticales",
      latex: "\\rho_c (h + H_0 + b) = \\rho_c H_0 + \\rho_m b \\implies b = h \\frac{\\rho_c}{\\rho_m - \\rho_c}",
      descEn: "Hydrostatic balance of Earth's lithosphere floating atop the denser asthenosphere. Mountain topography of height h is buoyantly supported by deep crustal roots b.",
      descEs: "Equilibrio hidrostático de la litosfera sobre la astenosfera. Cordilleras de altitud h están compensadas por raíces corticales profundas b según el empuje de Arquímedes."
    },
    {
      id: "gravimetry_bouguer_poisson",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Poisson's Gravitational Equation & Complete Bouguer Anomaly",
      titleEs: "Ecuación de Poisson Gravitatoria y Anomalía de Bouguer",
      latex: "\\nabla^2 U = 4\\pi G \\rho \\quad \\Big| \\quad \\Delta g_B = g_{\\text{obs}} - \\gamma_0 + 0.3086 h - 2\\pi G \\rho_c h",
      descEn: "Gravimetric potential equation and reduction formula isolating subsurface density contrasts from free-air and slab topographic effects, imaging magma and subduction slabs.",
      descEs: "Ecuación de potencial gravitatorio y reducción de Bouguer que aísla contrastes de densidad en el subsuelo corrigiendo aire libre y relieve topográfico."
    },
    {
      id: "fourier_geothermal_heat",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Fourier's Law of Heat Conduction & Lithospheric Geotherm",
      titleEs: "Ley de Conducción de Fourier y Geoterma Litosférica",
      latex: "\\mathbf{q} = -k \\nabla T \\quad \\Big| \\quad \\rho c_p \\frac{\\partial T}{\\partial t} = k \\nabla^2 T + A(z)",
      descEn: "Thermal conduction equation with radiogenic crustal heat production A(z). Explains oceanic plate cooling (half-space cooling model) and continental geotherms.",
      descEs: "Ecuación de conducción térmica con generación radiogénica A(z). Explica el enfriamiento de la litosfera oceánica y la geoterma continental profunda."
    },
    {
      id: "cagniard_magnetotellurics",
      category: "geophysics",
      courseCode: "GEO-401",
      titleEn: "Cagniard Impedance & Magnetotelluric Skin Depth",
      titleEs: "Impedancia de Cagniard y Profundidad de Penetración (MT)",
      latex: "Z_{xy}(\\omega) = \\frac{E_x}{H_y} = \\sqrt{\\frac{i \\omega \\mu_0}{\\sigma}} \\implies \\delta = \\sqrt{\\frac{2}{\\omega \\mu_0 \\sigma}} \\approx 503 \\sqrt{\\frac{\\rho}{f}}",
      descEn: "Induction of natural electromagnetic variations in conductive subterranean strata. Resolves electrical resistivity profiles to depths of tens of kilometers in the crust.",
      descEs: "Inducción de variaciones electromagnéticas naturales en la corteza terrestre. Permite resolver la resistividad eléctrica y localizar zonas fluidas o magmáticas."
    },
    {
      id: "hooke_elasticity",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Hooke's Generalized Law of Linear Elasticity (Stress Tensor)",
      titleEs: "Ley Generalizada de Hooke (Tensor de Esfuerzos y Deformaciones)",
      latex: "\\sigma_{ij} = \\lambda \\delta_{ij} \\varepsilon_{kk} + 2\\mu \\varepsilon_{ij}",
      descEn: "Relates the 2nd-order Cauchy stress tensor σ to infinitesimal strain ε via Lamé parameters (λ, μ), governing seismic P and S wave propagation in solid earth.",
      descEs: "Relaciona el tensor de esfuerzos de Cauchy con la deformación infinitesimal mediante los parámetros de Lamé (λ, μ), rigiendo las ondas sísmicas P y S."
    },
    {
      id: "darcy_archie_porous",
      category: "geophysics",
      courseCode: "GEO-301",
      titleEn: "Darcy's Law of Fluid Flow & Archie's Law in Porous Media",
      titleEs: "Ley de Darcy y Ley de Archie en Medios Porosos y Acuíferos",
      latex: "\\mathbf{q} = -\\frac{k}{\\mu} (\\nabla P - \\rho \\mathbf{g}) \\quad \\Big| \\quad \\rho_w = a \\phi^{-m} S_w^{-n} \\rho_f",
      descEn: "Pore fluid flow through permeable rock matrices (Darcy) and empirical electrical resistivity relation (Archie) linking bulk resistivity to porosity φ and fluid saturation.",
      descEs: "Flujo de fluidos en medios porosos permeables (Darcy) y correlación de resistividad eléctrica (Archie) con porosidad φ y saturación de agua en reservorios y acuíferos."
    },
    {
      id: "continuity_equation",
      category: "fluids",
      courseCode: "PHY-201",
      titleEn: "Fluid Mass Continuity Equation (Conservation of Mass)",
      titleEs: "Ecuación de Continuidad de Fluidos (Conservación de Masa)",
      latex: "\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{u}) = 0 \\quad (\\nabla \\cdot \\mathbf{u} = 0 \\text{ for incompressible})",
      descEn: "Fundamental differential law stating that the local rate of density change equals the negative divergence of mass flux. For liquids, velocity is solenoidal.",
      descEs: "Ley diferencial fundamental: la variación local de densidad equilibra la divergencia del flujo de masa. Para fluidos incompresibles, la velocidad es solenoidal."
    },
    {
      id: "navier_stokes",
      category: "fluids",
      courseCode: "PHY-201 / GEO-301",
      titleEn: "Navier-Stokes Equations of Momentum for Viscous Fluids",
      titleEs: "Ecuaciones de Navier-Stokes (Conservación de Momento en Fluidos)",
      latex: "\\rho \\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla)\\mathbf{u}\\right) = -\\nabla P + \\mu \\nabla^2 \\mathbf{u} + \\rho \\mathbf{g}",
      descEn: "Describes Newton's 2nd law in continuum fluids, balancing convective acceleration, pressure gradients, viscous shear dissipation, and body forces.",
      descEs: "Aplica la 2ª ley de Newton a medios continuos: equilibra aceleración advectiva, gradientes de presión, disipación viscosa por cizalle y gravedad."
    },
    {
      id: "bernoulli_principle",
      category: "fluids",
      courseCode: "PHY-201",
      titleEn: "Bernoulli's Streamline Energy Conservation Principle",
      titleEs: "Ecuación de Bernoulli (Conservación de Energía en Líneas de Corriente)",
      latex: "P + \\frac{1}{2} \\rho v^2 + \\rho g z = \\text{const} \\quad (\\text{along streamline})",
      descEn: "Conservation of energy in steady, incompressible, and inviscid fluid flow: static pressure drops where kinetic flow speed increases (Venturi effect).",
      descEs: "Conservación de energía mecánica para flujo estacionario e incompresible sin viscosidad: la presión estática disminuye cuando la velocidad aumenta (efecto Venturi)."
    },
    {
      id: "hydrostatic_equation",
      category: "fluids",
      courseCode: "GEO-301 / AST-401",
      titleEn: "Hydrostatic Equilibrium & Atmospheric Hypsometric Equation",
      titleEs: "Equilibrio Hidrostático y Ecuación Hipsométrica Atmosférica",
      latex: "\\frac{dP}{dz} = -\\rho(z) g \\implies P(z) = P_0 e^{-z / H}, \\quad H = \\frac{R_d \\bar{T}}{g}",
      descEn: "Balance between vertical upward pressure gradient and downward gravity. Determines atmospheric scale height H, ocean water columns, and barometric altimetry.",
      descEs: "Equilibrio entre el gradiente vertical de presión hacia arriba y la gravedad. Determina la altura de escala atmosférica H y perfiles barométricos de altimetría."
    },
    {
      id: "geostrophic_wind_balance",
      category: "fluids",
      courseCode: "GEO-301",
      titleEn: "Geostrophic Balance & Thermal Wind Equation",
      titleEs: "Balance Geostrófico y Viento Térmico",
      latex: "-f v_g = -\\frac{1}{\\rho}\\frac{\\partial P}{\\partial x}, \\quad f u_g = -\\frac{1}{\\rho}\\frac{\\partial P}{\\partial y} \\quad \\Big| \\quad f = 2\\Omega\\sin\\phi",
      descEn: "Exact equilibrium between horizontal pressure gradient force and Coriolis force in large-scale mid-latitude atmospheric cyclones and oceanic gyres.",
      descEs: "Equilibrio exacto entre el gradiente de presión horizontal y la fuerza de Coriolis en ciclones atmosféricos de escala sinóptica y corrientes marinas."
    },
    {
      id: "ekman_transport_spiral",
      category: "fluids",
      courseCode: "GEO-301",
      titleEn: "Ekman Spiral & Coastal Upwelling Transport",
      titleEs: "Espiral de Ekman y Transporte de Surgencia Costera",
      latex: "A_z \\frac{\\partial^2 \\mathbf{V}}{\\partial z^2} = i f \\mathbf{V} \\implies \\mathbf{M}_E = \\frac{\\boldsymbol{\\tau}_0 \\times \\hat{\\mathbf{k}}}{\\rho |f|}",
      descEn: "Wind stress balance with vertical eddy viscosity and Coriolis force. Induces a net ocean mass transport 90° to the wind, driving Humboldt upwelling along Chile's coast.",
      descEs: "Balance entre tensión del viento, viscosidad turbulenta y Coriolis. Produce transporte neto a 90° del viento, motor de la surgencia de la corriente de Humboldt en Chile."
    },
    {
      id: "potential_vorticity_rossby",
      category: "fluids",
      courseCode: "GEO-301",
      titleEn: "Ertel's Potential Vorticity Conservation & Planetary Rossby Waves",
      titleEs: "Conservación de Vorticidad Potencial y Ondas de Rossby",
      latex: "\\frac{D}{Dt}\\left( \\frac{\\zeta + f}{H} \\right) = 0 \\quad \\implies \\quad c_x = U - \\frac{\\beta}{k^2 + l^2}",
      descEn: "Conservation of absolute vorticity divided by fluid layer depth. Explains large-scale meandering planetary jet streams and oceanic planetary wave propagation.",
      descEs: "Conservación de la vorticidad absoluta dividida por el espesor de la capa fluida. Explica los meandros de la corriente en chorro y las ondas planetarias de Rossby."
    },
    {
      id: "brunt_vaisala_buoyancy",
      category: "fluids",
      courseCode: "GEO-301",
      titleEn: "Brunt-Väisälä Buoyancy Frequency (Atmospheric Stability)",
      titleEs: "Frecuencia de Brunt-Väisälä (Estabilidad Térmica Atmosférica)",
      latex: "N^2 = -\\frac{g}{\\rho}\\frac{\\partial \\rho}{\\partial z} = \\frac{g}{\\theta}\\frac{\\partial \\theta}{\\partial z}",
      descEn: "Angular oscillation frequency of vertically displaced fluid parcels in stably stratified atmospheres and oceans. N² > 0 indicates stability; N² < 0 indicates deep convection.",
      descEs: "Frecuencia angular de oscilación de una parcela fluida en una atmósfera u océano estratificado. N² > 0 indica estabilidad; N² < 0 desata convección violenta."
    },
    {
      id: "gauss_electric",
      category: "electromagnetism",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "Gauss's Law for Electricity (1st Maxwell Equation)",
      titleEs: "Ley de Gauss para el Campo Eléctrico (1ª Ecuación de Maxwell)",
      latex: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0} \\quad \\Big| \\quad \\oiint_{\\partial V} \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}",
      descEn: "Electric charges act as sources (positive) or sinks (negative) of electric displacement flux. Directly yields Coulomb's law by spherical symmetry.",
      descEs: "Las cargas eléctricas actúan como fuentes (positivas) o sumideros (negativas) del flujo eléctrico. Deduce la ley de Coulomb por simetría esférica."
    },
    {
      id: "gauss_magnetic",
      category: "electromagnetism",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "Gauss's Law for Magnetism (2nd Maxwell Equation)",
      titleEs: "Ley de Gauss para el Magnetismo (2ª Ecuación de Maxwell)",
      latex: "\\nabla \\cdot \\mathbf{B} = 0 \\quad \\Big| \\quad \\oiint_{\\partial V} \\mathbf{B} \\cdot d\\mathbf{A} = 0",
      descEn: "There are no isolated magnetic monopoles in nature. Magnetic field lines always form closed continuous loops with zero divergence everywhere.",
      descEs: "No existen monopolos magnéticos aislados en la naturaleza. Las líneas de campo magnético siempre forman bucles cerrados con divergencia nula."
    },
    {
      id: "faraday_lenz",
      category: "electromagnetism",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "Faraday-Lenz Law of Induction (3rd Maxwell Equation)",
      titleEs: "Ley de Inducción de Faraday-Lenz (3ª Ecuación de Maxwell)",
      latex: "\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\quad \\Big| \\quad \\mathcal{E} = -\\frac{d\\Phi_B}{dt}",
      descEn: "A time-varying magnetic field induces a rotational electric field. The negative sign represents Lenz's law of opposing change, powering transformers and dynamos.",
      descEs: "Un campo magnético variable en el tiempo induce un campo eléctrico rotacional. El signo negativo representa la oposición de Lenz, base de transformadores y dínamos."
    },
    {
      id: "ampere_maxwell",
      category: "electromagnetism",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "Ampère-Maxwell Circuital Law with Displacement Current (4th)",
      titleEs: "Ley de Ampère-Maxwell con Corriente de Desplazamiento (4ª)",
      latex: "\\nabla \\times \\mathbf{B} = \\mu_0 \\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)",
      descEn: "Electric currents and changing electric fields generate circulating magnetic fields. Maxwell's displacement term predicts electromagnetic wave propagation at speed c.",
      descEs: "Las corrientes eléctricas y los campos eléctricos variables generan campos magnéticos. El término de Maxwell predice la propagación de ondas de luz a velocidad c."
    },
    {
      id: "lorentz_force_law",
      category: "electromagnetism",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "Lorentz Force Law on Charged Particles",
      titleEs: "Ley de Fuerza de Lorentz sobre Partículas Cargadas",
      latex: "\\mathbf{F} = q (\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})",
      descEn: "Complete electromagnetic force combining electric acceleration collinear with E and perpendicular magnetic deflecting force responsible for cyclotron orbits.",
      descEs: "Fuerza electromagnética total que combina aceleración eléctrica colineal con E y deflexión magnética perpendicular responsable de órbitas ciclotrónicas."
    },
    {
      id: "poynting_vector",
      category: "electromagnetism",
      courseCode: "PHY-201",
      titleEn: "Poynting Vector & Electromagnetic Energy Flux Density",
      titleEs: "Vector de Poynting y Teorema de Conservación de Energía EM",
      latex: "\\mathbf{S} = \\frac{1}{\\mu_0} (\\mathbf{E} \\times \\mathbf{B}) \\quad \\Big| \\quad \\frac{\\partial u_{\\text{em}}}{\\partial t} + \\nabla \\cdot \\mathbf{S} = -\\mathbf{J} \\cdot \\mathbf{E}",
      descEn: "Represents the directional energy flux density (W/m²) carried by an electromagnetic wave. Its divergence balances field energy density and Ohmic dissipation.",
      descEs: "Representa el flujo direccional de energía (W/m²) transportado por ondas EM. Su divergencia equilibra la densidad de energía del campo y la disipación óhmica."
    },
    {
      id: "em_wave_speed_light",
      category: "electromagnetism",
      courseCode: "PHY-201",
      titleEn: "Electromagnetic Wave Equation & Speed of Light",
      titleEs: "Ecuación de Onda Electromagnética y Velocidad de la Luz",
      latex: "\\nabla^2 \\mathbf{E} - \\frac{1}{c^2}\\frac{\\partial^2 \\mathbf{E}}{\\partial t^2} = \\mathbf{0} \\quad \\implies \\quad c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 3\\times 10^8 \\; \\text{m/s}",
      descEn: "Direct consequence of Maxwell's curl equations in vacuum. Unified optics and electromagnetism by proving that light is an electromagnetic transverse disturbance.",
      descEs: "Consecuencia directa del rotacional de Maxwell en el vacío. Unificó la óptica con el electromagnetismo al demostrar que la luz es una onda transversal."
    },
    {
      id: "biot_savart",
      category: "electromagnetism",
      courseCode: "PHY-201",
      titleEn: "Biot-Savart Law of Magnetostatics",
      titleEs: "Ley de Biot-Savart de la Magnetostática",
      latex: "d\\mathbf{B} = \\frac{\\mu_0 I}{4\\pi} \\frac{d\\mathbf{l} \\times \\hat{\\mathbf{r}}}{r^2} \\quad \\implies \\quad B = \\frac{\\mu_0 I}{2\\pi r}",
      descEn: "Calculates the magnetic field generated by steady electric currents. The cross product enforces perpendicularity between the current element and the induced B field.",
      descEs: "Calcula el campo magnético generado por corrientes eléctricas continuas. El producto cruz asegura la perpendicularidad entre el conductor y las líneas de B."
    },
    {
      id: "snell_descartes_brewster",
      category: "electromagnetism",
      courseCode: "PHY-201",
      titleEn: "Snell-Descartes Law of Refraction & Brewster's Angle",
      titleEs: "Ley de Refracción de Snell y Ángulo de Polarización de Brewster",
      latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad \\Big| \\quad \\theta_B = \\arctan\\left(\\frac{n_2}{n_1}\\right)",
      descEn: "Derived from Fermat's principle of least time and Maxwell boundary conditions. At Brewster's angle, reflected light is 100% linearly polarized perpendicular to the plane.",
      descEs: "Derivada del principio de Fermat y condiciones de borde EM. En el ángulo de Brewster, la onda reflejada queda totalmente polarizada en dirección paralela a la interfaz."
    },
    {
      id: "thermo_first_law",
      category: "thermo_relativity",
      courseCode: "PHY-201 / IB-HL",
      titleEn: "First Law of Thermodynamics (Conservation of Energy)",
      titleEs: "Primera Ley de la Termodinámica (Conservación de Energía)",
      latex: "\\Delta U = Q - W = Q - \\int P \\, dV",
      descEn: "The change in internal energy of a closed system equals heat supplied minus mechanical work done on the surroundings. Internal energy U is a state function.",
      descEs: "La variación de energía interna de un sistema cerrado equivale al calor absorbido menos el trabajo realizado. La energía interna U es función de estado."
    },
    {
      id: "thermo_second_law",
      category: "thermo_relativity",
      courseCode: "PHY-201",
      titleEn: "Second Law of Thermodynamics (Entropy & Irreversibility)",
      titleEs: "Segunda Ley de la Termodinámica (Entropía e Irreversibilidad)",
      latex: "dS = \\frac{\\delta Q_{\\text{rev}}}{T} \\quad \\Big| \\quad \\Delta S_{\\text{universe}} \\ge 0",
      descEn: "Spontaneous natural processes increase the net entropy of an isolated universe. Defines the thermodynamic arrow of time and sets the Carnot efficiency ceiling.",
      descEs: "Los procesos espontáneos aumentan la entropía total del universo aislado. Define la flecha del tiempo termodinámica y el límite de eficiencia de Carnot."
    },
    {
      id: "thermo_third_carnot",
      category: "thermo_relativity",
      courseCode: "PHY-201",
      titleEn: "Third Law of Thermodynamics & Maximum Carnot Efficiency",
      titleEs: "Tercera Ley de la Termodinámica y Eficiencia Máxima de Carnot",
      latex: "\\lim_{T \\to 0} S = 0 \\quad \\Big| \\quad \\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}",
      descEn: "Nernst heat theorem: entropy of a pure crystalline substance approaches zero as temperature reaches absolute zero. Sets the absolute theoretical efficiency limit for heat engines.",
      descEs: "Teorema de Nernst: la entropía tiende a cero en el cero absoluto. Establece el límite físico insuperable para el rendimiento de cualquier máquina térmica entre dos focos."
    },
    {
      id: "boltzmann_entropy_distribution",
      category: "thermo_relativity",
      courseCode: "PHY-201 / AST-401",
      titleEn: "Boltzmann's Statistical Entropy & Maxwell-Boltzmann Statistics",
      titleEs: "Entropía Estadística de Boltzmann y Distribución Canónica",
      latex: "S = k_B \\ln \\Omega \\quad \\Big| \\quad P_i = \\frac{1}{Z} e^{-E_i / k_B T}",
      descEn: "Bridges microscopic quantum microstates Ω with macroscopic thermodynamic entropy S. Predicts molecular velocity profiles and thermal gas equilibrium.",
      descEs: "Conecta los microestados microscópicos Ω con la entropía termodinámica macroscópica S. Determina la distribución de velocidades moleculares y equilibrios térmicos."
    },
    {
      id: "planck_stefan_boltzmann",
      category: "thermo_relativity",
      courseCode: "AST-401",
      titleEn: "Planck's Blackbody Radiation & Stefan-Boltzmann Law",
      titleEs: "Ley de Radiación de Planck y Ley de Stefan-Boltzmann",
      latex: "B_\\lambda(T) = \\frac{2hc^2}{\\lambda^5 \\left(e^{\\frac{hc}{\\lambda k_B T}} - 1\\right)} \\quad \\Big| \\quad j^* = \\sigma T^4",
      descEn: "Quantized spectral energy density emitted by an ideal thermal blackbody. Integrating over all wavelengths yields the T⁴ total radiative flux powering stars and planetary atmospheres.",
      descEs: "Densidad de energía espectral emitida por un cuerpo negro ideal. Su integral en todas las longitudes de onda produce el flujo radiativo T⁴ clave en climatología y astrofísica."
    },
    {
      id: "lorentz_transformation",
      category: "thermo_relativity",
      courseCode: "PHY-201 / AST-401",
      titleEn: "Lorentz Spacetime Transformation & Time Dilation",
      titleEs: "Transformaciones de Lorentz y Dilatación Temporal Relativista",
      latex: "x' = \\gamma (x - vt), \\quad t' = \\gamma \\left(t - \\frac{vx}{c^2}\\right), \\quad \\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}",
      descEn: "Invariance of the speed of light c requires non-Galilean coordinates mixing space and time. Yields Lorentz contraction and kinematic time dilation verified in particle colliders.",
      descEs: "La invariancia de la velocidad de la luz c exige transformaciones que mezclan espacio y tiempo. Deduce la contracción espacial y dilatación del tiempo para velocidades relativistas."
    },
    {
      id: "mass_energy_equivalence",
      category: "thermo_relativity",
      courseCode: "PHY-201 / AST-401",
      titleEn: "Einstein's Relativistic Energy-Momentum Relation",
      titleEs: "Relación Energía-Momento Relativista de Einstein",
      latex: "E^2 = (p c)^2 + (m_0 c^2)^2 \\quad \\implies \\quad E_0 = m_0 c^2",
      descEn: "Universal equivalence between mass and energy. At zero rest momentum p=0, it collapses to E=mc², explaining nuclear binding energies, fusion in stars, and positron annihilation.",
      descEs: "Equivalencia universal entre masa y energía. Con momento nulo p=0 se reduce a E=mc², explicando la energía nuclear de enlace, la fusión estelar y aniquilación de pares."
    },
    {
      id: "einstein_field_equations",
      category: "thermo_relativity",
      courseCode: "AST-401",
      titleEn: "Einstein's Field Equations of Spacetime Curvature (General Relativity)",
      titleEs: "Ecuaciones de Campo de Einstein (Relatividad General y Curvatura)",
      latex: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu} \\quad (G_{\\mu\\nu} = R_{\\mu\\nu} - \\tfrac{1}{2}R g_{\\mu\\nu})",
      descEn: "Spacetime tells matter how to move; matter tells spacetime how to curve. The Einstein tensor G balances the stress-energy-momentum tensor T of matter and radiation.",
      descEs: "El espacio-tiempo le dice a la materia cómo moverse; la materia le dice al espacio-tiempo cómo curvarse. El tensor G equilibra el tensor energía-momento T."
    },
    {
      id: "schwarzschild_metric",
      category: "thermo_relativity",
      courseCode: "AST-401",
      titleEn: "Schwarzschild Metric & Gravitational Horizon Radius",
      titleEs: "Métrica de Schwarzschild y Radio del Horizonte de Sucesos",
      latex: "ds^2 = -\\left(1 - \\frac{r_s}{r}\\right)c^2 dt^2 + \\left(1 - \\frac{r_s}{r}\\right)^{-1} dr^2 + r^2 d\\Omega^2 \\quad (r_s = \\tfrac{2GM}{c^2})",
      descEn: "Exact vacuum solution to Einstein's equations outside a static, spherically symmetric mass. Defines the event horizon r_s and gravitational time dilation.",
      descEs: "Solución exacta al vacío fuera de una masa esférica estática. Define el radio del horizonte de sucesos r_s y la dilatación temporal gravitatoria."
    }
  ];

  const filteredLaws = physicsLawCategory === 'all'
    ? ALL_FUNDAMENTAL_LAWS
    : ALL_FUNDAMENTAL_LAWS.filter((l) => l.category === physicsLawCategory);

  // ==========================================================================
  // MASTER COMPENDIUM OF LINEAR ALGEBRA, AXIOMS & MATRIX THEORY (MAT-102 / COMP-205)
  // ==========================================================================
  const ALL_ALGEBRA_LAWS = [
    {
      id: 'vector_space_axioms',
      category: 'axioms',
      courseCode: 'MAT-102',
      titleEn: 'The 8 Axioms of a Vector Space over Field 𝕂',
      titleEs: 'Los 8 Axiomas de Espacio Vectorial sobre un Cuerpo 𝕂',
      latex: '\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}, \\quad \\alpha(\\mathbf{u} + \\mathbf{v}) = \\alpha\\mathbf{u} + \\alpha\\mathbf{v}, \\quad 1\\mathbf{u} = \\mathbf{u}',
      descEn: 'A set V with addition (+) and scalar multiplication (·) over field 𝕂 satisfies 8 axioms: 4 for abelian group addition (closure, associativity, commutativity, zero element 0, inverse -u) and 4 for scalar scaling (scalar distributivity, vector distributivity, mixed associativity a(bu)=(ab)u, and unit scalar 1u=u).',
      descEs: 'Un conjunto V con suma (+) y producto por escalar (·) sobre un cuerpo 𝕂 satisface 8 axiomas: 4 de grupo abeliano aditivo (cerradura, asociatividad, conmutatividad, elemento neutro 0, elemento opuesto -u) y 4 de escala (distributividad escalar, distributividad vectorial, asociatividad mixta y neutro 1u=u).',
      relevanceEn: 'Classic university midterm proof: proving whether a given set and custom operations satisfy vector space axioms.',
      relevanceEs: 'Pregunta clásica de certamen en Álgebra Lineal: demostrar si un conjunto dado con operaciones no estándar es un espacio vectorial.'
    },
    {
      id: 'subspace_criterion',
      category: 'axioms',
      courseCode: 'MAT-102',
      titleEn: 'Vector Subspace Criterion (Linear Closure Theorem)',
      titleEs: 'Criterio de Subespacio Vectorial (Teorema de Clausura)',
      latex: 'W \\le V \\iff \\mathbf{0} \\in W \\quad \\land \\quad \\forall \\alpha, \\beta \\in \\mathbb{K}, \\; \\mathbf{u}, \\mathbf{v} \\in W \\implies \\alpha\\mathbf{u} + \\beta\\mathbf{v} \\in W',
      descEn: 'A non-empty subset W ⊆ V is a vector subspace if and only if it contains the zero vector 0 and is closed under arbitrary linear combinations of vectors.',
      descEs: 'Un subconjunto no vacío W ⊆ V es subespacio vectorial si y solo si contiene al vector nulo 0 y es cerrado bajo combinaciones lineales arbitrarias.',
      relevanceEn: 'Universally used to classify kernel nullspaces, solution sets, and polynomial families as valid subspaces.',
      relevanceEs: 'Herramienta fundamental para clasificar núcleos, imágenes y conjuntos solución como subespacios vectoriales.'
    },
    {
      id: 'linear_independence_basis',
      category: 'axioms',
      courseCode: 'MAT-102',
      titleEn: 'Linear Independence, Spanning Set & Vector Basis',
      titleEs: 'Independencia Lineal, Conjunto Generador y Base',
      latex: '\\sum_{i=1}^k c_i \\mathbf{v}_i = \\mathbf{0} \\implies c_1 = \\dots = c_k = 0 \\quad \\Big| \\quad \\mathcal{B} = \\{\\mathbf{v}_i\\}_{i=1}^n, \\; \\dim(V) = n',
      descEn: 'Vectors are linearly independent if only the trivial combination produces zero. A basis is a linearly independent spanning set; its cardinality defines the dimension dim(V).',
      descEs: 'Un conjunto es linealmente independiente si la única combinación lineal que da el vector cero es la trivial. Una base es un conjunto L.I. que genera todo el espacio; su cantidad de elementos define la dimensión dim(V).',
      relevanceEn: 'Evaluated in coordinate transformations, basis changes, and solutions to homogeneous systems of ODEs.',
      relevanceEs: 'Evaluado en cambio de base, rango matricial y soluciones fundamentales de sistemas de ecuaciones diferenciales.'
    },
    {
      id: 'linear_transformation',
      category: 'transformations',
      courseCode: 'MAT-102',
      titleEn: 'Linear Transformation, Kernel (Nullspace) & Image',
      titleEs: 'Transformación Lineal, Núcleo (Kernel) e Imagen',
      latex: 'T(\\alpha \\mathbf{u} + \\beta \\mathbf{v}) = \\alpha T(\\mathbf{u}) + \\beta T(\\mathbf{v}) \\quad \\Big| \\quad \\ker(T) = \\{\\mathbf{v} \\in V : T(\\mathbf{v}) = \\mathbf{0}\\}',
      descEn: 'A map T: V → W preserving algebraic vector operations. The kernel ker(T) represents vectors collapsed to zero (T is injective iff ker(T) = {0}); the image im(T) is the range subspace spanned in W.',
      descEs: 'Una función T: V → W que preserva suma y escala. El núcleo ker(T) agrupa los vectores transformados al cero (T es inyectiva si y solo si ker(T) = {0}); la imagen im(T) es el subespacio generado en el codominio.',
      relevanceEn: 'Foundational for matrix representation of geometric transformations (rotations, reflections, projections).',
      relevanceEs: 'Pilar para matrices asociadas a transformaciones geométricas (rotaciones, reflexiones, proyecciones).'
    },
    {
      id: 'rank_nullity_theorem',
      category: 'transformations',
      courseCode: 'MAT-102',
      titleEn: 'Rank-Nullity Theorem (Fundamental Dimension Theorem)',
      titleEs: 'Teorema de la Dimensión (Rango y Nulidad)',
      latex: '\\dim(\\operatorname{im} T) + \\dim(\\ker T) = \\dim(V) \\quad \\Longleftrightarrow \\quad \\operatorname{rank}(A) + \\operatorname{nullity}(A) = n',
      descEn: 'Relates domain dimension n to the dimensions of image (column rank) and kernel (nullity). Dictates the degrees of freedom in systems of linear equations Ax = b.',
      descEs: 'Conecta la dimensión del dominio n con la dimensión de la imagen (rango) y el núcleo (nulidad). Dicta los grados de libertad en sistemas lineales Ax = b.',
      relevanceEn: 'Crucial for analyzing underdetermined and overdetermined inverse problems in geophysics and data science.',
      relevanceEs: 'Esencial para determinar la existencia y unicidad de soluciones en problemas inversos y sistemas indeterminados.'
    },
    {
      id: 'invertible_matrix_theorem',
      category: 'matrices',
      courseCode: 'MAT-102',
      titleEn: 'The Invertible Matrix Theorem (Fundamental Equivalences)',
      titleEs: 'Teorema de la Matriz Inversible (Equivalencias Fundamentales)',
      latex: 'A \\in \\mathbb{R}^{n \\times n} \\text{ inv} \\iff \\det(A) \\ne 0 \\iff \\operatorname{rank}(A) = n \\iff \\ker(A) = \\{\\mathbf{0}\\} \\iff \\lambda_i \\ne 0',
      descEn: 'A square n×n matrix A is invertible if and only if: det(A) ≠ 0, columns form a linearly independent basis of ℝⁿ, nullity is 0, rank is n, 0 is not an eigenvalue, and Ax = b has a unique solution for every b.',
      descEs: 'Una matriz cuadrada n×n es invertible si y solo si: det(A) ≠ 0, sus columnas forman una base L.I. de ℝⁿ, la nulidad es 0, el rango es n, ningún autovalor es cero, y Ax = b tiene solución única para todo b.',
      relevanceEn: 'The cornerstone equivalence theorem for university linear algebra exams.',
      relevanceEs: 'El teorema de equivalencias más preguntado en exámenes y controles de álgebra lineal de primer año.'
    },
    {
      id: 'determinants_laplace',
      category: 'matrices',
      courseCode: 'MAT-102',
      titleEn: 'Determinant Multiplicativity & Laplace Expansion',
      titleEs: 'Multiplicatividad del Determinante y Regla de Laplace',
      latex: '\\det(AB) = \\det(A)\\det(B), \\quad \\det(A^T) = \\det(A), \\quad \\det(A^{-1}) = \\frac{1}{\\det(A)}',
      descEn: 'The determinant measures oriented hypervolume scaling of a linear transformation. Evaluated recursively via Laplace expansion along row i: det(A) = ∑ⱼ aᵢⱼ (-1)ⁱ⁺ʲ Mᵢⱼ.',
      descEs: 'El determinante mide el factor de dilatación del hipervolumen orientado por una transformación lineal. Se calcula recursivamente mediante desarrollo de Laplace: det(A) = ∑ⱼ aᵢⱼ (-1)ⁱ⁺ʲ Mᵢⱼ.',
      relevanceEn: 'Used in Jacobian determinants for multiple integrals and Cramer’s rule for solving linear systems.',
      relevanceEs: 'Imprescindible para el jacobiano en integrales múltiples y cálculo de áreas orientadas en geometría analítica.'
    },
    {
      id: 'inner_product_cauchy_schwarz',
      category: 'inner_product',
      courseCode: 'MAT-102',
      titleEn: 'Inner Product Axioms & Cauchy-Schwarz Inequality',
      titleEs: 'Axiomas de Producto Interno y Desigualdad de Cauchy-Schwarz',
      latex: '|\\langle \\mathbf{u}, \\mathbf{v} \\rangle| \\le \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\quad \\Big| \\quad \\cos \\theta = \\frac{\\langle \\mathbf{u}, \\mathbf{v} \\rangle}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
      descEn: 'An inner product satisfies conjugate symmetry, linearity in the first argument, and positive definiteness (⟨u, u⟩ > 0 for u ≠ 0). The Cauchy-Schwarz inequality provides a rigorous geometric angle and triangle inequality.',
      descEs: 'Un producto interior satisface linealidad, simetría (o conjugación) y positividad estricta (⟨u, u⟩ > 0 si u ≠ 0). La desigualdad de Cauchy-Schwarz fundamenta la noción geométrica de ángulo y la desigualdad triangular.',
      relevanceEn: 'The bedrock of Hilbert spaces, Fourier analysis, and signal correlation in geophysics.',
      relevanceEs: 'Base de los espacios de Hilbert, series de Fourier y correlación cruzada de señales geofísicas.'
    },
    {
      id: 'gram_schmidt_process',
      category: 'inner_product',
      courseCode: 'MAT-102',
      titleEn: 'Gram-Schmidt Orthonormalization Algorithm',
      titleEs: 'Proceso de Ortogonalización de Gram-Schmidt',
      latex: '\\mathbf{u}_k = \\mathbf{v}_k - \\sum_{j=1}^{k-1} \\frac{\\langle \\mathbf{v}_k, \\mathbf{u}_j \\rangle}{\\|\\mathbf{u}_j\\|^2} \\mathbf{u}_j, \\quad \\mathbf{e}_k = \\frac{\\mathbf{u}_k}{\\|\\mathbf{u}_k\\|}',
      descEn: 'Iterative algorithm that transforms any arbitrary linearly independent basis into an orthonormal basis (eᵢ · eⱼ = δᵢⱼ), subtracting successive orthogonal projections.',
      descEs: 'Algoritmo recursivo que transforma cualquier base linealmente independiente en una base ortonormal (eᵢ · eⱼ = δᵢⱼ), restando proyecciones ortogonales sucesivas.',
      relevanceEn: 'Directly yields QR matrix decomposition and Legendre polynomial orthogonal basis functions.',
      relevanceEs: 'Genera la factorización QR de matrices y las bases ortogonales de polinomios de Legendre en física matemática.'
    },
    {
      id: 'eigenvalues_characteristic_poly',
      category: 'spectral',
      courseCode: 'MAT-102',
      titleEn: 'Eigenvalues, Eigenvectors & Characteristic Polynomial',
      titleEs: 'Autovalores, Autovectores y Polinomio Característico',
      latex: 'A\\mathbf{v} = \\lambda \\mathbf{v} \\quad (\\mathbf{v} \\ne \\mathbf{0}) \\iff p(\\lambda) = \\det(A - \\lambda I) = 0',
      descEn: 'Eigenvectors v are non-zero vectors whose direction is unchanged by matrix A, being scaled only by eigenvalue λ. Computed by finding roots of characteristic polynomial p(λ) = det(A - λI).',
      descEs: 'Los autovectores son direcciones invariantes bajo la matriz A, escaladas únicamente por el autovalor λ. Se obtienen hallando las raíces del polinomio característico p(λ) = det(A - λI).',
      relevanceEn: 'Fundamental for normal modes of vibration, structural resonance, and stability of dynamical systems.',
      relevanceEs: 'Fundamental para modos normales de oscilación sísmica, resonancia mecánica y estabilidad de sistemas dinámicos.'
    },
    {
      id: 'spectral_theorem',
      category: 'spectral',
      courseCode: 'MAT-102 / COMP-205',
      titleEn: 'Spectral Theorem for Real Symmetric Matrices',
      titleEs: 'Teorema Espectral para Matrices Simétricas Reales',
      latex: 'A = Q \\Lambda Q^T \\quad (Q^T Q = I, \\; \\Lambda = \\operatorname{diag}(\\lambda_1, \\dots, \\lambda_n))',
      descEn: 'Every real symmetric matrix (A = A^T) possesses strictly real eigenvalues and an orthonormal basis of eigenvectors. It can be diagonalized by an orthogonal rotation matrix Q.',
      descEs: 'Toda matriz simétrica real (A = A^T) posee exclusivamente autovalores reales y una base ortonormal de autovectores. Se diagonaliza mediante una matriz de rotación ortogonal Q.',
      relevanceEn: 'Used to diagonalize moment of inertia tensors, strain tensors, and covariance matrices in PCA.',
      relevanceEs: 'Permite diagonalizar el tensor de momentos de inercia, tensores de deformación y matrices de covarianza en PCA.'
    },
    {
      id: 'svd_decomposition',
      category: 'spectral',
      courseCode: 'COMP-205',
      titleEn: 'Singular Value Decomposition (SVD)',
      titleEs: 'Descomposición en Valores Singulares (SVD)',
      latex: 'A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T \\quad (\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0)',
      descEn: 'Factorizes any rectangular m×n matrix into two orthogonal coordinate rotations (U, V) and a diagonal matrix of non-negative singular values Σ, providing Moore-Penrose pseudoinverse A⁺.',
      descEs: 'Factoriza cualquier matriz rectangular m×n en dos rotaciones ortogonales (U, V) y una matriz diagonal de valores singulares positivos Σ, proveyendo la pseudoinversa de Moore-Penrose.',
      relevanceEn: 'Gold standard algorithm for low-rank image compression, principal component analysis, and noise filtering.',
      relevanceEs: 'El estándar de oro para compresión de datos sísmicos, reducción dimensional PCA y filtrado de ruido.'
    },
    {
      id: 'least_squares_projection',
      category: 'spectral',
      courseCode: 'LA-102 / COMP-205',
      titleEn: 'Orthogonal Projection & Least Squares (Normal Equations)',
      titleEs: 'Proyección Ortogonal y Mínimos Cuadrados (Ecuaciones Normales)',
      latex: 'A^T A \\hat{\\mathbf{x}} = A^T \\mathbf{b} \\quad \\Longleftrightarrow \\quad \\hat{\\mathbf{x}} = (A^T A)^{-1} A^T \\mathbf{b}',
      descEn: 'The fundamental theorem of linear least squares: projecting a vector b onto the column space of A to minimize the Euclidean residual norm ||Ax - b||.',
      descEs: 'El teorema fundamental de mínimos cuadrados lineales: proyecta un vector b sobre el espacio columna de A minimizando la norma residual ||Ax - b||.',
      relevanceEn: 'Core exam proof in Linear Algebra and experimental curve fitting in Scientific Computing.',
      relevanceEs: 'Demostración clásica obligada de Álgebra Lineal y ajuste de modelos experimentales en computación científica.'
    }
  ];

  const filteredAlgebraLaws = algebraCategory === 'all'
    ? ALL_ALGEBRA_LAWS
    : ALL_ALGEBRA_LAWS.filter((l) => l.category === algebraCategory);

  // ==========================================================================
  // MASTER COMPENDIUM OF CALCULUS, LIMITS, DERIVATIVES & INTEGRALS (MAT-101 / MAT-201)
  // ==========================================================================
  const ALL_CALCULUS_LAWS = [
    {
      id: 'epsilon_delta_limit',
      category: 'limits',
      courseCode: 'MAT-101',
      titleEn: 'Rigorous ε-δ Definition of Limit (Cauchy-Weierstrass)',
      titleEs: 'Definición Rigurosa de Límite (Épsilon-Delta)',
      latex: '\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0, \\, \\exists \\delta > 0 : 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon',
      descEn: 'The formal definition of functional limit: for every target tolerance band ε > 0 around L, there exists a symmetric puncture radius δ > 0 around a such that whenever x is within δ of a, f(x) is trapped within ε of L.',
      descEs: 'La definición formal de límite: para toda tolerancia ε > 0 alrededor de L, existe un radio δ > 0 alrededor de a tal que si x dista menos de δ de a, entonces f(x) dista menos de ε de L.',
      relevanceEn: 'The classic opening proof of university Calculus 1 exams: proving limits directly from definition.',
      relevanceEs: 'La demostración inicial obligada en certámenes de Cálculo 1: demostrar límites directamente por definición ε-δ.'
    },
    {
      id: 'continuity_intermediate_value',
      category: 'limits',
      courseCode: 'MAT-101',
      titleEn: 'Continuity & Intermediate Value Theorem (Bolzano)',
      titleEs: 'Continuidad y Teorema del Valor Intermedio (Bolzano)',
      latex: '\\lim_{x \\to a} f(x) = f(a) \\quad \\Big| \\quad f \\in C[a,b], \\, u \\in [f(a), f(b)] \\implies \\exists c \\in [a,b] : f(c) = u',
      descEn: 'A function is continuous at a if the limit exists and equals f(a). Bolzano’s theorem guarantees that a continuous function on [a,b] takes every intermediate value u, guaranteeing the existence of roots f(c) = 0 if f(a) and f(b) have opposite signs.',
      descEs: 'Una función es continua en a si el límite existe y coincide con f(a). El teorema de Bolzano asegura que una función continua en [a,b] toma todos los valores intermedios, garantizando la existencia de ceros si los extremos tienen signos opuestos.',
      relevanceEn: 'Universally used to prove root existence for non-linear equations and bisection algorithm convergence.',
      relevanceEs: 'Utilizado para demostrar existencia de raíces en ecuaciones no lineales y convergencia del método de bisección.'
    },
    {
      id: 'extreme_value_fermat',
      category: 'differential',
      courseCode: 'MAT-101',
      titleEn: 'Extreme Value Theorem (Weierstrass) & Fermat’s Stationary Points',
      titleEs: 'Teorema de Valores Extremos (Weierstrass) y Teorema de Fermat',
      latex: '\\max_{x \\in [a,b]} f(x), \\, \\min_{x \\in [a,b]} f(x) \\text{ exist} \\quad \\Big| \\quad f\'(c) = 0 \\text{ at local extremum } c \\in (a,b)',
      descEn: 'Every continuous function on a closed bounded interval [a,b] achieves an absolute maximum and minimum. By Fermat’s interior extremum theorem, if f is differentiable at an interior local extremum c, then its derivative must vanish (f’(c) = 0).',
      descEs: 'Toda función continua en un intervalo cerrado y acotado alcanza un máximo y un mínimo absoluto. Por el teorema de Fermat, si f es derivable en un extremo local interior c, la derivada se anula forzosamente: f’(c) = 0.',
      relevanceEn: 'The mathematical justification for optimization, finding critical points and stationary states in physics.',
      relevanceEs: 'La justificación matemática para problemas de optimización y búsqueda de puntos críticos estacionarios.'
    },
    {
      id: 'derivative_definition',
      category: 'differential',
      courseCode: 'MAT-101',
      titleEn: 'Definition of the Derivative as a Difference Quotient Limit',
      titleEs: 'Definición de la Derivada como Límite del Cociente Incremental',
      latex: 'f\'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = \\lim_{z \\to x} \\frac{f(z) - f(x)}{z - x}',
      descEn: 'The instantaneous rate of change of f with respect to x, representing the geometric slope of the tangent line to the curve. Differentiability strictly implies continuity, but the converse is not true (e.g., |x| at 0).',
      descEs: 'La tasa instantánea de cambio de f con respecto a x, geométricamente la pendiente de la recta tangente a la curva. Toda función diferenciable es continua, pero el recíproco no siempre se cumple (ej. |x| en el origen).',
      relevanceEn: 'Foundation for differential equations, linear approximations, and instantaneous kinematics v(t) = dx/dt.',
      relevanceEs: 'Base de las ecuaciones diferenciales, aproximaciones lineales por plano tangente y cinemática instantánea.'
    },
    {
      id: 'differentiation_rules',
      category: 'differential',
      courseCode: 'MAT-101',
      titleEn: 'Core Differentiation Rules: Product, Quotient & Chain Rule',
      titleEs: 'Reglas Operativas de Derivación: Producto, Cociente y Regla de la Cadena',
      latex: '(fg)\' = f\'g + fg\', \\quad \\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}, \\quad (f \\circ g)\'(x) = f\'(g(x)) \\cdot g\'(x)',
      descEn: 'The fundamental algebraic engine of differential calculus. The chain rule handles composite functions; the product rule accounts for cross-term variations in geometry and conservation flux.',
      descEs: 'El motor operativo del cálculo diferencial. La regla de la cadena permite derivar funciones compuestas y la regla del producto descompone variaciones en áreas y flujos físicos.',
      relevanceEn: 'Constant use in all university engineering, physics and economics exams.',
      relevanceEs: 'De uso continuo en todos los certámenes de ingeniería, cálculo diferencial y física universitaria.'
    },
    {
      id: 'mean_value_rolle',
      category: 'differential',
      courseCode: 'MAT-101',
      titleEn: 'Mean Value Theorem (Lagrange) & Rolle’s Theorem',
      titleEs: 'Teorema del Valor Medio de Lagrange y Teorema de Rolle',
      latex: 'f\'(c) = \\frac{f(b) - f(a)}{b - a} \\quad (c \\in (a,b)) \\quad \\Big| \\quad f(a)=f(b) \\implies f\'(c) = 0',
      descEn: 'If f is continuous on [a,b] and differentiable on (a,b), there exists at least one point c where the instantaneous tangent slope matches the secant line chord slope. Vital for proving monotonicity (f’ > 0 implies strictly increasing).',
      descEs: 'Si f es continua en [a,b] y derivable en (a,b), existe al menos un punto intermedio c donde la pendiente instantánea coincide con la pendiente secante promedio. Demuestra la monotonía (f’ > 0 implica f estrictamente creciente).',
      relevanceEn: 'Required theoretical proof in almost every university first-year calculus examination.',
      relevanceEs: 'Demostración teórica obligada en casi todo examen o control de cálculo diferencial universitario.'
    },
    {
      id: 'lhopital_rule',
      category: 'differential',
      courseCode: 'MAT-101',
      titleEn: 'L’Hôpital’s Rule for Indeterminate Forms',
      titleEs: 'Regla de L’Hôpital para Formas Indeterminadas',
      latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)} \\quad \\left(\\text{for indeterminate } \\left[\\frac{0}{0}\\right] \\text{ or } \\left[\\frac{\\pm\\infty}{\\pm\\infty}\\right]\\right)',
      descEn: 'Evaluates limits of quotients where direct substitution yields 0/0 or ±∞/±∞, comparing the ratio of instantaneous growth rates of f and g (derived via Cauchy’s generalized mean value theorem).',
      descEs: 'Permite resolver límites indeterminados del tipo 0/0 o ±∞/±∞ derivando numerador y denominador por separado, comparando sus velocidades de crecimiento instantáneo.',
      relevanceEn: 'Indispensable tool for resolving complex limit problems in university and IB HL exams.',
      relevanceEs: 'Herramienta fundamental para el cálculo ágil de límites indeterminados en exámenes y olimpiadas.'
    },
    {
      id: 'taylor_lagrange_series',
      category: 'differential',
      courseCode: 'MAT-101 / COMP-205',
      titleEn: 'Taylor Polynomial & Maclaurin Series with Lagrange Remainder',
      titleEs: 'Polinomio de Taylor y Serie de Maclaurin con Resto de Lagrange',
      latex: 'f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!} (x-a)^k + R_n(x), \\quad R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} (x-a)^{n+1}',
      descEn: 'Approximates any smooth function as an n-th degree polynomial centered at a. The Lagrange remainder Rn(x) with ξ between a and x provides exact bounds on the numerical approximation error.',
      descEs: 'Aproxima cualquier función suave mediante un polinomio de grado n centrado en a. El resto de Lagrange Rn(x) con ξ entre a y x proporciona una cota analítica exacta del error de truncamiento.',
      relevanceEn: 'The basis for numerical finite differences, perturbation methods in physics, and algorithmic function evaluation.',
      relevanceEs: 'La base del método de diferencias finitas, teoría de perturbaciones físicas y algoritmos numéricos.'
    },
    {
      id: 'riemann_integral',
      category: 'integral',
      courseCode: 'MAT-101',
      titleEn: 'Riemann Definite Integral & Darboux Upper/Lower Sums',
      titleEs: 'Integral Definida de Riemann y Sumas de Darboux',
      latex: '\\int_a^b f(x) \\, dx = \\lim_{\\|P\\| \\to 0} \\sum_{i=1}^n f(x_i^*) \\, \\Delta x_i \\quad \\Big| \\quad L(f, P) \\le \\int_a^b f \\le U(f, P)',
      descEn: 'The rigorous definition of area under a curve as the limit of Riemann sums as partition mesh norm ‖P‖ approaches zero. Continuous and piecewise continuous functions are always Riemann integrable.',
      descEs: 'La definición formal del área bajo la curva mediante el límite de sumas rectangulares finitas cuando la norma de la partición ‖P‖ tiende a cero. Toda función continua en [a,b] es integrable Riemann.',
      relevanceEn: 'Used to model physical accumulation: cumulative displacement from velocity, work from force, mass from density.',
      relevanceEs: 'Modela la acumulación física: desplazamiento total a partir de velocidad, trabajo por fuerza y masa total.'
    },
    {
      id: 'fundamental_theorem_calculus',
      category: 'integral',
      courseCode: 'MAT-101',
      titleEn: 'Fundamental Theorem of Calculus (FTC Part 1 & Part 2)',
      titleEs: 'Teorema Fundamental del Cálculo (Partes 1 y 2)',
      latex: '\\frac{d}{dx} \\left[ \\int_a^x f(t) \\, dt \\right] = f(x) \\quad \\Big| \\quad \\int_a^b f(x) \\, dx = F(b) - F(a) \\quad (F\' = f)',
      descEn: 'The supreme bridge of calculus: Part 1 proves that the rate of change of an accumulation function is the original integrand. Part 2 proves that definite integrals can be computed using antiderivatives F.',
      descEs: 'El puente maestro del cálculo: la Parte 1 demuestra que la derivada de la función de acumulación es el integrando original; la Parte 2 permite evaluar la integral definida mediante cualquier primitiva F.',
      relevanceEn: 'The central theoretical result of single-variable calculus, tested without exception in all STEM curricula.',
      relevanceEs: 'El resultado teórico supremo del cálculo de una variable, evaluado sin excepción en toda carrera STEM.'
    },
    {
      id: 'integration_techniques',
      category: 'integral',
      courseCode: 'MAT-101',
      titleEn: 'Integration by Parts & Substitution Rule',
      titleEs: 'Integración por Partes y Regla de Sustitución',
      latex: '\\int u \\, dv = uv - \\int v \\, du \\quad \\Big| \\quad \\int f(g(x)) g\'(x) \\, dx = \\int f(u) \\, du \\quad (u = g(x))',
      descEn: 'The primary techniques for solving non-trivial antiderivatives: substitution reverses the chain rule, and integration by parts reverses the product rule.',
      descEs: 'Las técnicas operativas reinas para calcular primitivas: la sustitución invierte la regla de la cadena y la integración por partes invierte la regla del producto.',
      relevanceEn: 'Essential for finding Fourier coefficients, solving differential equations, and probability expectations.',
      relevanceEs: 'Indispensable para coeficientes de Fourier, resolución de EDOs lineales y cálculo de esperanzas estadísticas.'
    },
    {
      id: 'nabla_spatial_calculus',
      category: 'multivariable',
      courseCode: 'MAT-201',
      titleEn: 'The Nabla (∇) Spatial Operator Dictionary',
      titleEs: 'El Diccionario del Operador Diferencial Espacial Nabla (∇)',
      latex: '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right), \\quad \\nabla \\cdot \\mathbf{F}, \\quad \\nabla \\times \\mathbf{F}, \\quad \\nabla^2 f',
      descEn: 'Gradient (maximum spatial ascent), Divergence (source/sink volumetric flux density), Curl (vorticity/circulation density), and Laplacian (local curvature and diffusion).',
      descEs: 'Gradiente (máximo ascenso espacial), Divergencia (flujo neto por unidad de volumen), Rotacional (vorticidad y circulación) y Laplaciano (curvatura promedio del campo y difusión).',
      relevanceEn: 'Governs all continuum field equations: Maxwell electrodynamics, Navier-Stokes fluids, and seismology.',
      relevanceEs: 'Rige todas las ecuaciones de campo continuo: electrodinámica de Maxwell, fluidos y sismología.'
    },
    {
      id: 'canonical_pdes',
      category: 'multivariable',
      courseCode: 'MAT-201 / PHY-201',
      titleEn: 'The 3 Canonical PDEs of Mathematical Physics',
      titleEs: 'Las 3 EDPs Canónicas de la Física Matemática',
      latex: '\\nabla^2 u = 0 \\text{ (Elliptic)} \\; \\Big| \\; \\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u \\text{ (Parabolic)} \\; \\Big| \\; \\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u \\text{ (Hyperbolic)}',
      descEn: 'Laplace/Poisson (time-independent potential equilibria), Heat/Diffusion (dissipative, time-irreversible), and Wave equation (finite velocity c, time-reversible, governing seismic P and S waves).',
      descEs: 'Laplace/Poisson (equilibrio estacionario de potenciales), Calor/Difusión (procesos disipativos irreversibles) y Onda Elastodinámica (velocidad finita c, reversible, ondas sísmicas P y S).',
      relevanceEn: 'The foundation of boundary-value engineering, geophysics, acoustics, and heat transfer.',
      relevanceEs: 'La columna vertebral de la geofísica teórica, acústica, transferencia térmica y electromagnetismo.'
    },
    {
      id: 'vector_integral_theorems',
      category: 'multivariable',
      courseCode: 'MAT-201 / PHY-201',
      titleEn: 'The 3 Pillar Integral Theorems: Green, Gauss & Stokes',
      titleEs: 'Los 3 Grandes Teoremas Integrales: Green, Gauss y Stokes',
      latex: '\\oint_{\\partial D} (Ldx + Mdy) = \\iint_D \\left(\\frac{\\partial M}{\\partial x} - \\frac{\\partial L}{\\partial y}\\right)dA \\quad \\Big| \\quad \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{A} = \\iiint_V (\\nabla \\cdot \\mathbf{F}) dV',
      descEn: 'Converts boundary circulation into area curl (Green), boundary outward flux into volume divergence (Gauss), and closed-loop circulation into surface curl flux (Stokes). Unifies 1D, 2D, and 3D calculus into differential forms ∫_∂Ω ω = ∫_Ω dω.',
      descEs: 'Convierte circulación de contorno en rotacional de área (Green), flujo neto superficial en integral de volumen de divergencia (Gauss) y circulación cerrada en flujo de rotacional (Stokes). Unifica el cálculo en el Teorema de Stokes generalizado.',
      relevanceEn: 'Tested in every advanced multivariable calculus and electromagnetic field theory exam.',
      relevanceEs: 'Pregunta fija en exámenes de cálculo vectorial multivariable y teoría de campos electromagnéticos.'
    }
  ];

  const filteredCalculusLaws = calculusCategory === 'all'
    ? ALL_CALCULUS_LAWS
    : ALL_CALCULUS_LAWS.filter((l) => l.category === calculusCategory);

  // ==========================================================================
  // CANVAS DRAWING: RIGHT-HAND RULE 3D CROSS PRODUCT
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'physics') return;
    const canvas = rhrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);

    const originX = W * 0.42;
    const originY = H * 0.65;

    // Grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const radAngle = (vectorAngle * Math.PI) / 180;
    const lenA = magA * 26;
    const lenB = magB * 24;

    // Vector A (Index Finger pointing along baseline)
    const ax = originX + lenA * 0.95;
    const ay = originY - lenA * 0.18;

    // Vector B (Middle Finger rotated by theta)
    const bx = originX + lenB * Math.cos(radAngle) * 0.85 - lenB * Math.sin(radAngle) * 0.5;
    const by = originY - lenB * Math.cos(radAngle) * 0.3 - lenB * Math.sin(radAngle) * 0.7;

    // Vector C = A x B (Thumb pointing UP)
    const sinTheta = Math.sin(radAngle);
    const magC = magA * magB * sinTheta;
    const lenC = Math.min(130, magC * 11);
    const cx = originX;
    const cy = originY - lenC;

    // Bilingual vector labels
    let labelA = isEn ? 'v (Velocity)' : 'v (Velocidad)';
    let labelB = isEn ? 'B (Magnetic Field)' : 'B (Campo Magnético)';
    let labelC = isEn ? 'F_L = q(v × B)' : 'F_L = q(v × B)';
    let subDesc = isEn ? 'Lorentz Force on positive test charge' : 'Fuerza de Lorentz sobre carga positiva';

    if (rhrMode === 'torque') {
      labelA = isEn ? 'r (Lever Arm)' : 'r (Brazo de Palanca)';
      labelB = isEn ? 'F (Applied Force)' : 'F (Fuerza Aplicada)';
      labelC = isEn ? 'τ = r × F (Torque)' : 'τ = r × F (Torque)';
      subDesc = isEn ? 'Torque relative to rotation axis' : 'Momento de fuerza respecto al eje de rotación';
    } else if (rhrMode === 'omega') {
      labelA = isEn ? 'ω (Angular Velocity)' : 'ω (Velocidad Angular)';
      labelB = isEn ? 'r (Position Vector)' : 'r (Radio vector)';
      labelC = isEn ? 'v = ω × r (Velocity)' : 'v = ω × r';
      subDesc = isEn ? 'Tangential velocity in rigid body rotation' : 'Velocidad tangencial en rotación de cuerpo rígido';
    } else if (rhrMode === 'coriolis') {
      labelA = isEn ? 'Ω (Earth Rotation)' : 'Ω (Rotación Terrestre)';
      labelB = isEn ? 'v (Fluid Velocity)' : 'v (Velocidad Viento/Océano)';
      labelC = isEn ? 'a_Cor = -2(Ω × v)' : 'a_Cor = -2(Ω × v)';
      subDesc = isEn ? 'Apparent Coriolis acceleration in non-inertial frames' : 'Aceleración aparente de Coriolis en sistemas no inerciales';
    } else if (rhrMode === 'pure') {
      labelA = isEn ? 'A (First Vector)' : 'A (Primer Vector)';
      labelB = isEn ? 'B (Second Vector)' : 'B (Segundo Vector)';
      labelC = isEn ? 'C = A × B' : 'C = A × B';
      subDesc = isEn ? '|C| = |A||B| sin(θ) [Area of Parallelogram]' : '|C| = |A||B| sin(θ) [Área del paralelogramo]';
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
    ctx.fillText(isEn ? `Angle θ = ${vectorAngle}° | sin(θ) = ${sinTheta.toFixed(2)} | Magnitude |A×B| = ${magC.toFixed(2)}` : `Ángulo θ = ${vectorAngle}° | sin(θ) = ${sinTheta.toFixed(2)} | Magnitud |A×B| = ${magC.toFixed(2)}`, 20, 24);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(subDesc, 20, H - 15);
  }, [rhrMode, vectorAngle, magA, magB, lang, isEn]);

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
    ctx.fillText(isEn ? 'Time Domain Signal f(t)' : 'Dominio del Tiempo f(t)', 25, 20);

    // Draw individual harmonics faintly
    for (let k = 1; k <= fourierHarmonics; k++) {
      const harmIdx = 2 * k - 1;
      const ampK = (4 / Math.PI) * (1 / harmIdx) * 45;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + (1 / k) * 0.25})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let px = 25; px < splitX - 20; px += 2) {
        const t = ((px - 25) / (splitX - 45)) * Math.PI * 4;
        const py = midY - ampK * Math.sin(harmIdx * t);
        if (px === 25) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Draw total composite synthesized wave
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 25; px < splitX - 20; px += 2) {
      const t = ((px - 25) / (splitX - 45)) * Math.PI * 4;
      let sumY = 0;
      for (let k = 1; k <= fourierHarmonics; k++) {
        const harmIdx = 2 * k - 1;
        sumY += (4 / Math.PI) * (1 / harmIdx) * 45 * Math.sin(harmIdx * t);
      }
      const py = midY - sumY;
      if (px === 25) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Right Section: Frequency Spectrum (Bar Chart)
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Spectral Amplitude |c_n|' : 'Espectro de Amplitud |c_n|', splitX + 15, 20);

    const barW = 16;
    const barGap = 12;
    const baseBarY = H - 30;

    for (let k = 1; k <= 7; k++) {
      const harmIdx = 2 * k - 1;
      const active = k <= fourierHarmonics;
      const barH = active ? ((4 / Math.PI) * (1 / harmIdx)) * 95 : 0;
      const bx = splitX + 20 + (k - 1) * (barW + barGap);

      ctx.fillStyle = active ? '#38BDF8' : 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(bx, baseBarY - barH, barW, barH);

      ctx.fillStyle = active ? '#F8FAFC' : '#475569';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`${harmIdx}ω`, bx, baseBarY + 14);
    }
  }, [activeTab, fourierHarmonics, lang, isEn]);

  // ==========================================================================
  // CANVAS DRAWING: CONVOLUTIONAL SEISMOGRAM & RICKER WAVELET
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
    ctx.fillText(isEn ? `1. Ricker Wavelet w(t) [Central Frequency f₀ = ${rickerFreq} Hz]` : `1. Ondícula de Ricker w(t) [f₀ = ${rickerFreq} Hz]`, 20, 20);
    ctx.fillText(isEn ? '2. Earth Reflectivity Series r(t) (Acoustic Impedance Contrasts)' : '2. Serie de Reflectividad Geológica r(t)', 20, 90);
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
  }, [activeTab, rickerFreq, lang, isEn]);

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
    ctx.fillText(isEn ? `Geophone Frequency Response |H(ω)| [Damping Factor h = ${geophoneDamping.toFixed(3)}]` : `Respuesta en Frecuencia del Geófono |H(ω)| [Amortiguamiento h = ${geophoneDamping.toFixed(3)}]`, 20, 20);

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

    // Damping curve highlight
    ctx.strokeStyle = Math.abs(geophoneDamping - 0.707) < 0.05 ? '#10B981' : geophoneDamping < 0.707 ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const hFactor = geophoneDamping;
    for (let px = 0; px <= plotW; px += 2) {
      const u = (px / plotW) * 3.5; // u = omega / omega0 (0 to 3.5)
      const u2 = u * u;
      const denom = Math.sqrt(Math.pow(1 - u2, 2) + 4 * hFactor * hFactor * u2);
      const resp = denom > 1e-4 ? u2 / denom : 0;
      const py = basePlotY - Math.min(plotH, resp * (plotH * 0.75));

      if (px === 0) ctx.moveTo(20 + px, py);
      else ctx.lineTo(20 + px, py);
    }
    ctx.stroke();

    // Critical damping marker
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Cutoff Resonance ω = ω₀' : 'Corte de Resonancia ω = ω₀', 20 + plotW * (1.0 / 3.5) - 25, basePlotY + 16);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(20 + plotW * (1.0 / 3.5), basePlotY);
    ctx.lineTo(20 + plotW * (1.0 / 3.5), basePlotY - plotH);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [activeTab, geophoneDamping, lang, isEn]);

  // ==========================================================================
  // CANVAS DRAWING: COMPLEX POTENTIAL FLOW & STREAMLINES
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
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(isEn ? 'Complex Velocity Potential W(z) = φ(x,y) + i ψ(x,y) (Orthogonal Streamlines)' : 'Potencial Complejo W(z) = φ(x,y) + i ψ(x,y) (Líneas de Corriente Ortogonales)', 20, 20);

    if (complexFlowMode === 'dipole') {
      // Hydraulic Dipole: Streamlines ψ = const (Circles passing through origin)
      for (let k = -6; k <= 6; k++) {
        if (k === 0) continue;
        const R = Math.abs(k) * 14;
        const cy = midY + (k > 0 ? R : -R);

        ctx.strokeStyle = k > 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(midX, cy, R, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Source (+) and Sink (-) dots
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(midX - 25, midY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#34D399';
      ctx.beginPath();
      ctx.arc(midX + 25, midY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(isEn ? '+ Source (Extraction)' : '+ Fuente (Recarga)', midX - 85, midY + 16);
      ctx.fillText(isEn ? '- Sink (Pumping Well)' : '- Sumidero (Pozo)', midX + 15, midY + 16);
    } else {
      // Flow past circular cylinder obstacle (Milne-Thomson Theorem)
      const cylR = 32;

      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(midX, midY, cylR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      for (let psi = -50; psi <= 50; psi += 10) {
        if (Math.abs(psi) < 4) continue;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.2;
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
  }, [activeTab, complexFlowMode, lang, isEn]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'University & TU9 STEM Rigorous Reference' : 'Referencia Universitaria FCFM & TU9'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{isEn ? 'Compendium of Laws, Algebra & Mathematical Physics' : 'Compendio de Leyes, Álgebra y Física Matemática'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-4xl leading-relaxed">
            {isEn
              ? 'The conceptual pillars that university and IB examinations demand: from interactive 3D right-hand rules and matrix diagonalization to canonical PDEs, Fourier signal decomposition, and complex residue theorems.'
              : 'Los pilares obligados en la formación de geofísica y ciencias exactas: desde la regla de la mano derecha 3D y la diagonalización matricial hasta las 3 EDPs canónicas, descomposición de señales y residuos complejos.'}
          </p>
        </div>

        {/* 5 Main Compendium Section Pills - Dedicated full-width navigation strip */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
          {[
            { id: 'physics', labelEs: '1. Física & Leyes', labelEn: '1. Physics & Laws', icon: Compass },
            { id: 'algebra', labelEs: '2. Álgebra & Axiomas', labelEn: '2. Algebra & Axioms', icon: Calculator },
            { id: 'calculus', labelEs: '3. Cálculo & Análisis', labelEn: '3. Calculus & Analysis', icon: BookOpen },
            { id: 'signals', labelEs: '4. Señales & Fourier', labelEn: '4. Signals & Fourier', icon: Activity },
            { id: 'complex', labelEs: '5. Complejos & Lagrange', labelEn: '5. Complex & Lagrange', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs sm:text-sm font-mono font-bold ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{isEn ? tab.labelEn : tab.labelEs}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PHYSICS LAWS & INTERACTIVE RIGHT-HAND RULE                     */}
      {/* ==================================================================== */}
      {activeTab === 'physics' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  {isEn ? 'Interactive 3D Cross Product Simulator' : 'Simulador 3D del Producto Cruz Vectorial'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isEn ? 'The Right-Hand Rule in Vector Physics' : 'La Regla de la Mano Derecha en Física Vectorial'}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'lorentz', label: 'q(v×B)' },
                  { id: 'torque', label: 'r×F' },
                  { id: 'omega', label: 'ω×r' },
                  { id: 'coriolis', label: '-2(Ω×v)' },
                  { id: 'pure', label: 'A×B' }
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
                  {isEn ? 'Interactive Vector Controls:' : 'Controles Interactivos:'}
                </h4>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>{isEn ? 'Angle θ between A & B:' : 'Ángulo θ entre A y B:'}</span>
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
                    <span>{isEn ? 'Magnitude |A|:' : 'Magnitud |A|:'}</span>
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
                    <span>{isEn ? 'Magnitude |B|:' : 'Magnitud |B|:'}</span>
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
                  💡 <strong className="text-white">{isEn ? 'Practical Rule:' : 'Regla práctica:'}</strong>{' '}
                  {isEn
                    ? 'Point your index finger along vector A, curl your middle finger towards B; your extended thumb points in the direction of C.'
                    : 'Apunta con el índice hacia A, gira los dedos hacia B; el pulgar extendido apunta en dirección de C.'}
                </div>
              </div>
            </div>
          </div>

          {/* Section Divider & Laws Category Filter Bar */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  {isEn ? 'Universal Principles & Analytical Formulations' : 'Principios Universales y Formulaciones Analíticas'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {isEn ? 'Fundamental Laws Across Mentorship Disciplines' : 'Leyes Fundamentales en todas las Disciplinas'}
                </h3>
              </div>

              {/* Sub-filter chips */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs">
                {[
                  { id: 'all', labelEn: `All (${ALL_FUNDAMENTAL_LAWS.length})`, labelEs: `Todas (${ALL_FUNDAMENTAL_LAWS.length})`, icon: Sparkles },
                  { id: 'mechanics', labelEn: `Mechanics (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'mechanics').length})`, labelEs: `Mecánica (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'mechanics').length})`, icon: Compass },
                  { id: 'geophysics', labelEn: `Geophysics & Earth (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'geophysics').length})`, labelEs: `Geofísica & Tierra (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'geophysics').length})`, icon: Layers },
                  { id: 'fluids', labelEn: `Fluids & Atmosphere (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'fluids').length})`, labelEs: `Fluidos & Atmósfera (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'fluids').length})`, icon: Wind },
                  { id: 'electromagnetism', labelEn: `Electrodynamics (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'electromagnetism').length})`, labelEs: `Electrodinámica (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'electromagnetism').length})`, icon: Zap },
                  { id: 'thermo_relativity', labelEn: `Thermo & Relativity (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'thermo_relativity').length})`, labelEs: `Termo & Relatividad (${ALL_FUNDAMENTAL_LAWS.filter(l => l.category === 'thermo_relativity').length})`, icon: Flame }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPhysicsLawCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      physicsLawCategory === cat.id
                        ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    <span>{isEn ? cat.labelEn : cat.labelEs}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comprehensive Grid of Fundamental Laws with KaTeX LaTeX rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLaws.map((card) => (
                <div key={card.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase tracking-wider">
                        {card.courseCode}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono leading-snug">
                      {isEn ? card.titleEn : card.titleEs}
                    </h4>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-amber-300 text-xs sm:text-sm text-center">
                    <MathFormula math={card.latex} display={true} />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {isEn ? card.descEn : card.descEs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: LINEAR ALGEBRA, AXIOMATIC SPACES & SPECTRAL SVD               */}
      {/* ==================================================================== */}
      {activeTab === 'algebra' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              {isEn ? 'Linear Algebra, Axiomatic Vector Spaces & Spectral Inversion' : 'Álgebra Lineal, Espacios Axiomáticos e Inversión Espectral'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {isEn ? 'Vector Space Axioms, Transformations, Matrices & Diagonalization' : 'Axiomas de Espacios Vectoriales, Transformaciones, Matrices y Diagonalización'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'The complete structural pipeline of university linear algebra: from the 8 formal axioms over a field 𝕂 and subspace criteria to linear transformations, Gram-Schmidt orthonormalization, and 2x2 matrix spectral diagonalization.'
                : 'La columna vertebral del álgebra lineal universitaria: desde los 8 axiomas formales sobre un cuerpo 𝕂 y criterios de subespacio hasta transformaciones lineales, ortogonalización de Gram-Schmidt y diagonalización espectral de matrices 2x2.'}
            </p>
          </div>

          {/* Sub-Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', count: ALL_ALGEBRA_LAWS.length, labelEn: 'All Formulations', labelEs: 'Todas las Formulaciones' },
              { id: 'axioms', count: 3, labelEn: 'Vector Space Axioms & Bases', labelEs: 'Axiomas & Bases' },
              { id: 'transformations', count: 2, labelEn: 'Linear Maps & Rank-Nullity', labelEs: 'Transformaciones & Rango' },
              { id: 'matrices', count: 2, labelEn: 'Matrices & Determinants', labelEs: 'Matrices & Determinantes' },
              { id: 'inner_product', count: 2, labelEn: 'Inner Product & Gram-Schmidt', labelEs: 'Producto Interno & Ortonormalidad' },
              { id: 'spectral', count: 4, labelEn: 'Spectral, SVD & Inversion', labelEs: 'Teoría Espectral & SVD' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setAlgebraCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  algebraCategory === cat.id
                    ? 'bg-indigo-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{isEn ? cat.labelEn : cat.labelEs}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  algebraCategory === cat.id ? 'bg-indigo-600/40 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive 2x2 Matrix Sandbox (Shown when All or Spectral is active) */}
          {(algebraCategory === 'all' || algebraCategory === 'spectral') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                    {isEn ? 'Interactive Matrix Sandbox A:' : 'Sandbox de Matriz Simétrica A:'}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    A = Aᵀ
                  </span>
                </div>

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
                      <span>{isEn ? 'Matrix Element a₁₁:' : 'Elemento a₁₁:'}</span>
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
                      <span>{isEn ? 'Element a₁₂ = a₂₁ (Coupling):' : 'Elemento a₁₂ = a₂₁ (Acoplamiento):'}</span>
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
                      <span>{isEn ? 'Matrix Element a₂₂:' : 'Elemento a₂₂:'}</span>
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
                      <span>{isEn ? 'Least Squares Damping Parameter (ε²):' : 'Amortiguamiento de Mínimos Cuadrados (ε²):'}</span>
                      <strong className="text-amber-400">{leastSquaresEps.toFixed(2)}</strong>
                    </div>
                    <input
                      type="range"
                      min="0.00"
                      max="2.00"
                      step="0.05"
                      value={leastSquaresEps}
                      onChange={(e) => setLeastSquaresEps(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Results: Characteristic Polynomial, Eigenvalues & Spectral Decomposition */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold block">
                  {isEn ? 'Real-Time Spectral & Matrix Decomposition:' : 'Descomposición Espectral y Matricial en Vivo:'}
                </span>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">
                    {isEn ? '1. Characteristic Polynomial: det(A - λI) = 0' : '1. Polinomio Característico: det(A - λI) = 0'}
                  </span>
                  <div className="text-sm font-bold text-amber-300">
                    <MathFormula math={`\\lambda^2 - (${tr})\\lambda + (${det}) = 0`} display={true} />
                  </div>
                  <span className="text-slate-500 text-[10px]">
                    {isEn ? `Trace(A) = ${tr} | Det(A) = ${det}` : `Traza(A) = ${tr} | Det(A) = ${det}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-sky-400 text-[10px] uppercase block font-bold">
                      {isEn ? 'Eigenvalue λ₁' : 'Autovalor λ₁'}
                    </span>
                    <span className="text-base font-bold text-white block mt-1">{lambda1.toFixed(3)}</span>
                    <span className="text-[10px] text-slate-400">
                      <MathFormula math={`\\mathbf{v}_1 = [${v1x.toFixed(2)}, \\; ${v1y.toFixed(2)}]^T`} />
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 text-[10px] uppercase block font-bold">
                      {isEn ? 'Eigenvalue λ₂' : 'Autovalor λ₂'}
                    </span>
                    <span className="text-base font-bold text-white block mt-1">{lambda2.toFixed(3)}</span>
                    <span className="text-[10px] text-slate-400">
                      <MathFormula math={`\\mathbf{v}_2 = [${v2x.toFixed(2)}, \\; ${v2y.toFixed(2)}]^T`} />
                    </span>
                  </div>
                </div>

                {/* SVD and Condition Number */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-950/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 text-[10px] uppercase font-bold">
                      {isEn ? 'SVD & Condition Number (A = U Σ Vᵀ)' : 'SVD y Número de Condición (A = U Σ Vᵀ)'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${condNumber > 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      κ(A) = {condNumber > 100 ? (isEn ? '>100 (Ill-Conditioned)' : '>100 (Mal Condicionado)') : condNumber.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isEn
                      ? `Singular values: σ₁ = ${sigma1.toFixed(2)}, σ₂ = ${sigma2.toFixed(2)}`
                      : `Valores singulares: σ₁ = ${sigma1.toFixed(2)}, σ₂ = ${sigma2.toFixed(2)}`}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex justify-between items-center">
                    <span>{isEn ? 'Estimated Solution m̂ for d=[6, 2]ᵀ:' : 'Solución Estimada m̂ para d=[6, 2]ᵀ:'}</span>
                    <strong className="text-amber-400">[{mEst1.toFixed(2)}, {mEst2.toFixed(2)}]ᵀ</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Master Linear Algebra Laws & Axioms Grid */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                {isEn ? 'Foundational Theorems, Axioms & Formulations:' : 'Teoremas Fundamentales, Axiomas y Formulaciones:'}
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {filteredAlgebraLaws.length} {isEn ? 'items' : 'leyes'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredAlgebraLaws.map((law) => {
                const catBadge = law.category === 'axioms'
                  ? 'text-violet-400 bg-violet-500/10 border-violet-500/30'
                  : law.category === 'transformations'
                  ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
                  : law.category === 'matrices'
                  ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
                  : law.category === 'inner_product'
                  ? 'text-teal-400 bg-teal-500/10 border-teal-500/30'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                return (
                  <div
                    key={law.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 font-bold border border-slate-700">
                          {law.courseCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${catBadge}`}>
                          {law.category}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        {isEn ? law.titleEn : law.titleEs}
                      </h5>
                      <div className="p-3 bg-slate-950 rounded-xl text-amber-300 text-xs sm:text-sm text-center border border-slate-800/80 overflow-x-auto shadow-inner">
                        <MathFormula math={law.latex} display={true} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {isEn ? law.descEn : law.descEs}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800/70 text-[11px] text-indigo-300 font-mono leading-relaxed bg-indigo-950/20 p-2 rounded-lg">
                      💡 {isEn ? law.relevanceEn : law.relevanceEs}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: CALCULUS, REAL ANALYSIS & PARTIAL DIFFERENTIAL EQUATIONS       */}
      {/* ==================================================================== */}
      {activeTab === 'calculus' && (
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              {isEn ? 'Single & Multivariable Calculus, Real Analysis & PDEs' : 'Cálculo Diferencial e Integral, Análisis Real y EDPs'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {isEn ? 'Limits, Differential Laws, FTC & Vector Calculus' : 'Límites, Cálculo Diferencial, TFC y Cálculo Vectorial'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'From formal ε-δ limit definitions, mean value theorems and differentiation rules to Riemann integration, the Fundamental Theorem of Calculus, the Nabla dictionary, and the 3 canonical PDEs.'
                : 'Desde la definición rigurosa de límites con ε-δ, teorema del valor medio y reglas operativas hasta integrales de Riemann, el Teorema Fundamental del Cálculo, operador Nabla y las 3 EDPs canónicas.'}
            </p>
          </div>

          {/* Sub-Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', count: ALL_CALCULUS_LAWS.length, labelEn: 'All Calculus & Analysis', labelEs: 'Todo Cálculo & Análisis' },
              { id: 'limits', count: 2, labelEn: 'Limits & Continuity (ε-δ)', labelEs: 'Límites & Continuidad (ε-δ)' },
              { id: 'differential', count: 6, labelEn: 'Differential Calculus & MVT', labelEs: 'Cálculo Diferencial & MVT' },
              { id: 'integral', count: 3, labelEn: 'Integral Calculus & FTC', labelEs: 'Cálculo Integral & TFC' },
              { id: 'multivariable', count: 3, labelEn: 'Multivariable, PDEs & Theorems', labelEs: 'Multivariable & EDPs' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCalculusCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  calculusCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{isEn ? cat.labelEn : cat.labelEs}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  calculusCategory === cat.id ? 'bg-emerald-600/40 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Multivariable Specialized Modules (Shown when All or Multivariable is active) */}
          {(calculusCategory === 'all' || calculusCategory === 'multivariable') && (
            <div className="space-y-6 pt-2">
              {/* The Nabla Operator Grid with KaTeX */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                  {isEn ? 'Spatial Differential Operators (Nabla ∇):' : 'Operadores Diferenciales Espaciales (Nabla ∇):'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      latex: '\\nabla f',
                      nameEs: 'Gradiente',
                      nameEn: 'Gradient',
                      inOutEn: 'Scalar → Vector',
                      inOutEs: 'Escalar → Vector',
                      color: 'text-sky-400',
                      meaningEn: 'Vector pointing along the maximum spatial rate of increase (e.g., -∇P drives atmospheric winds towards low pressure).',
                      meaningEs: 'Vector en la dirección de máxima tasa de crecimiento espacial (ej. -∇P empuja el viento hacia la baja presión).'
                    },
                    {
                      latex: '\\nabla \\cdot \\mathbf{F}',
                      nameEs: 'Divergencia',
                      nameEn: 'Divergence',
                      inOutEn: 'Vector → Scalar',
                      inOutEs: 'Vector → Escalar',
                      color: 'text-emerald-400',
                      meaningEn: 'Measures net outward flux per unit volume. Positive = Source; Negative = Sink; Zero = Incompressible flow.',
                      meaningEs: 'Mide la tasa neta de flujo que sale de un punto. Positiva = Fuente; Negativa = Sumidero; Cero = Incompresible.'
                    },
                    {
                      latex: '\\nabla \\times \\mathbf{F}',
                      nameEs: 'Rotacional (Curl)',
                      nameEn: 'Curl',
                      inOutEn: 'Vector → Vector',
                      inOutEs: 'Vector → Vector',
                      color: 'text-amber-400',
                      meaningEn: 'Measures local microscopic vorticity or circulation density. Governs magnetic field circulation and shear S-waves.',
                      meaningEs: 'Mide la rotación local o vorticidad en un fluido. Rige la generación de ondas S por cizalle y ondas electromagnéticas.'
                    },
                    {
                      latex: '\\nabla^2 f',
                      nameEs: 'Laplaciano',
                      nameEn: 'Laplacian',
                      inOutEn: 'Scalar → Scalar',
                      inOutEs: 'Escalar → Escalar',
                      color: 'text-purple-400',
                      meaningEn: 'Measures the difference between a field at a point and its local average curvature. Drives thermal diffusion and waves.',
                      meaningEs: 'Mide la curvatura promedio de un campo. Gobierna difusión térmica, campos potenciales y propagación ondulatoria.'
                    }
                  ].map((op, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className={`text-lg font-bold ${op.color}`}>
                          <MathFormula math={op.latex} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{isEn ? op.inOutEn : op.inOutEs}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white font-mono">{isEn ? op.nameEn : op.nameEs}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{isEn ? op.meaningEn : op.meaningEs}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The 3 Canonical PDEs of Mathematical Physics */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {isEn
                    ? 'The 3 Canonical PDEs in Physics & Geophysics:'
                    : 'Las 3 Grandes Ecuaciones Diferenciales Parciales en Geofísica:'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-mono text-sky-400 uppercase font-bold block">
                      {isEn ? '1. Elliptic (Laplace / Poisson)' : '1. Elíptica (Laplace / Poisson)'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-sky-300 text-xs sm:text-sm text-center">
                      <MathFormula math="\nabla^2 u = 4\pi G \rho \quad (\text{or } \nabla^2 u = 0)" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? 'Time-independent steady states. Governs gravitational potential fields U, electrostatics, Bouguer gravity anomalies, and steady groundwater aquifer flow.'
                        : 'Estados estacionarios independientes del tiempo. Gobierna el potencial gravitacional U, la gravimetría de Bouguer y el flujo freático subterráneo permanente.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-mono text-amber-400 uppercase font-bold block">
                      {isEn ? '2. Parabolic (Heat / Diffusion)' : '2. Parabólica (Difusión / Calor)'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 text-xs sm:text-sm text-center">
                      <MathFormula math="\frac{\partial u}{\partial t} = \alpha \nabla^2 u" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? 'Irreversible in time. Models thermal cooling of tectonic plates, geothermal heat dissipation in continental crust, and electromagnetic diffusion in magnetotellurics.'
                        : 'Irreversible en el tiempo. Modela el enfriamiento térmico de la placa oceánica de Nazca, disipación de calor geotérmico y difusión electromagnética en magnetotelúrica.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">
                      {isEn ? '3. Hyperbolic (Elastodynamic Wave Equation)' : '3. Hiperbólica (Onda Elastodinámica)'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 text-xs sm:text-sm text-center">
                      <MathFormula math="\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? 'Reversible in time with finite propagation velocity c. Fundamental equation of seismology and acoustics: elastic P and S waves traveling across Earth mantle and core.'
                        : 'Reversible en el tiempo con velocidad finita c. Ecuación fundamental de la sismología: propagación de ondas elásticas P y S a través del manto y núcleo terrestre.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* The 3 Fundamental Integral Theorems of Vector Analysis with KaTeX */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {isEn
                    ? 'The 3 Pillar Integral Theorems of Vector Calculus:'
                    : 'Los 3 Teoremas Integrales del Análisis Vectorial (Green, Gauss y Stokes):'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-sky-400 uppercase font-bold block">
                      {isEn ? "Green's Theorem in the Plane" : 'Teorema de Green en el Plano'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl text-amber-300 text-xs sm:text-sm text-center border border-slate-800">
                      <MathFormula math="\oint_{\partial D} (L \, dx + M \, dy) = \iint_D \left(\frac{\partial M}{\partial x} - \frac{\partial L}{\partial y}\right) dA" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {isEn
                        ? 'Converts a 1D boundary circulation line integral into a 2D surface integral of microscopic curl, foundational for work and fluid circulation.'
                        : 'Convierte una integral de línea sobre la frontera en una integral de área del rotacional, base del trabajo y circulación en 2D.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">
                      {isEn ? "Gauss's Divergence Theorem" : 'Teorema de la Divergencia de Gauss'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl text-amber-300 text-xs sm:text-sm text-center border border-slate-800">
                      <MathFormula math="\oiint_{\partial V} \mathbf{F} \cdot \hat{\mathbf{n}} \, dS = \iiint_V (\nabla \cdot \mathbf{F}) \, dV" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {isEn
                        ? 'The outward flux of a vector field through a closed boundary surface equals the volume integral of divergence inside, proving Gauss electric/magnetic laws.'
                        : 'El flujo neto a través de una superficie cerrada equivale a la integral de volumen de su divergencia, demostrando las leyes de Gauss.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-purple-400 uppercase font-bold block">
                      {isEn ? "Stokes's Curl Theorem" : 'Teorema del Rotacional de Stokes'}
                    </span>
                    <div className="p-3 bg-slate-950 rounded-xl text-amber-300 text-xs sm:text-sm text-center border border-slate-800">
                      <MathFormula math="\oint_{\partial S} \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}" display={true} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {isEn
                        ? 'Line integral of a vector field around a closed curve equals the flux of its curl through any spanning open surface, crucial for Faraday and Ampère laws.'
                        : 'La circulación de un campo vectorial por una curva cerrada equivale al flujo de su rotacional a través de cualquier superficie que la encierra.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Master Calculus Formulations & Theorems Grid */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                {isEn ? 'Foundational Calculus Theorems & Analytical Laws:' : 'Teoremas Fundamentales del Cálculo y Leyes Analíticas:'}
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {filteredCalculusLaws.length} {isEn ? 'items' : 'leyes'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCalculusLaws.map((law) => {
                const catBadge = law.category === 'limits'
                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                  : law.category === 'differential'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : law.category === 'integral'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-purple-400 bg-purple-500/10 border-purple-500/30';

                return (
                  <div
                    key={law.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 font-bold border border-slate-700">
                          {law.courseCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${catBadge}`}>
                          {law.category}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        {isEn ? law.titleEn : law.titleEs}
                      </h5>
                      <div className="p-3 bg-slate-950 rounded-xl text-amber-300 text-xs sm:text-sm text-center border border-slate-800/80 overflow-x-auto shadow-inner">
                        <MathFormula math={law.latex} display={true} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {isEn ? law.descEn : law.descEs}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800/70 text-[11px] text-emerald-300 font-mono leading-relaxed bg-emerald-950/20 p-2 rounded-lg">
                      💡 {isEn ? law.relevanceEn : law.relevanceEs}
                    </div>
                  </div>
                );
              })}
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
              {isEn ? 'Signal Analysis & Instrumental Response' : 'Análisis de Señales y Respuesta Instrumental'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {isEn ? 'Fourier Decomposition, Wavelet Convolution & Geophone Laplace ODEs' : 'Descomposición de Fourier, Convolución de Ondículas y EDOs de Geófonos'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'From sampling theorems (Nyquist) and seismic reflection convolution models to the 2nd-order transfer functions of seismometers in national observation networks.'
                : 'Desde el teorema de muestreo de Nyquist y el modelo convolutivo s(t) = w(t)*r(t) hasta la función de transferencia de 2º orden del sismómetro con amortiguamiento crítico.'}
            </p>
          </div>

          {/* Module A: Fourier Decomposition Live */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase font-bold block">
                  {isEn ? 'A. Fourier Spectral Wave Synthesis' : 'A. Descomposición Espectral de Fourier'}
                </span>
                <div className="text-sm font-bold text-white">
                  <MathFormula math="f(t) = \frac{4}{\pi} \sum_{k=1}^N \frac{\sin((2k-1)\omega t)}{2k-1}" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">
                  {isEn ? 'Harmonics N:' : 'Armónicos N:'}
                </span>
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
                <span className="text-xs font-mono text-amber-400 uppercase font-bold block">
                  {isEn ? 'B. Convolutional Model of the Seismogram' : 'B. Modelo Convolutivo del Sismograma'}
                </span>
                <div className="text-sm font-bold text-white">
                  <MathFormula math="s(t) = w(t) * r(t) + n(t)" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">
                  {isEn ? 'Wavelet Frequency f₀:' : 'Frecuencia Ondícula f₀:'}
                </span>
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
                  <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">
                    {isEn ? 'C. Laplace Response of the Seismometer' : 'C. Respuesta de Laplace del Sismógrafo'}
                  </span>
                  <div className="text-sm font-bold text-white">
                    <MathFormula math="H(s) = \frac{s^2}{s^2 + 2h\omega_0 s + \omega_0^2}" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">
                    {isEn ? 'Damping Factor h:' : 'Amortiguamiento h:'}
                  </span>
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
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">
                {isEn ? 'D. Nyquist-Shannon Sampling Theorem' : 'D. Teorema de Muestreo de Nyquist'}
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {isEn
                  ? 'To reconstruct an analog continuous bandlimited signal with maximum frequency f_max without aliasing distortion, the sampling rate f_s must satisfy:'
                  : 'Para registrar una frecuencia máxima f_max sin distorsión por solapamiento espectral (aliasing), la tasa de muestreo debe ser al menos el doble:'}
              </p>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center text-cyan-300">
                <MathFormula math="f_s \ge 2 f_{\max} \quad \Longleftrightarrow \quad \Delta t \le \frac{1}{2 f_{\max}}" display={true} />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{isEn ? 'Sampling Interval Δt:' : 'Paso de muestreo Δt:'}</span>
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
                  <span>{isEn ? 'Nyquist Frequency f_N:' : 'Frecuencia de Nyquist:'}</span>
                  <span>{((1 / (2 * (samplingDt / 1000)))).toFixed(0)} Hz</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {isEn
                  ? '💡 In National Seismological Networks (e.g., CSN Chile), signals digitize at 100 Hz (Δt = 10 ms), fixing f_Nyquist at 50 Hz.'
                  : '💡 En la red sismológica nacional (CSN) se digitaliza a 100 Hz (Δt = 10 ms), fijando f_Nyquist = 50 Hz.'}
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
              {isEn ? 'Complex Variables & Analytical Variational Mechanics' : 'Variable Compleja y Mecánica Variacional'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {isEn ? 'Cauchy-Riemann Conditions, Residue Integrals, Euler-Lagrange & Fermat' : 'Condiciones de Cauchy-Riemann, Residuos, Euler-Lagrange y Fermat'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'Complex potential flow in hydrodynamics, contour integration for seismic wave dispersion, and Hamilton’s principle of stationary action in advanced physics.'
                : 'Flujo potencial complejo en hidrogeología, cálculo de integrales de contorno en dispersión de ondas superficiales y el principio de mínima acción.'}
            </p>
          </div>

          {/* Module A: Cauchy-Riemann & Potential Flow */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase font-bold block">
                  {isEn ? 'A. Cauchy-Riemann Conditions & 2D Hydrodynamic Potential' : 'A. Condiciones de Cauchy-Riemann y Flujo 2D'}
                </span>
                <div className="text-xs sm:text-sm font-bold text-white">
                  <MathFormula math="W(z) = \phi(x,y) + i \psi(x,y) \implies \frac{\partial \phi}{\partial x} = \frac{\partial \psi}{\partial y}, \quad \frac{\partial \phi}{\partial y} = -\frac{\partial \psi}{\partial x}" />
                </div>
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
                    {mode === 'dipole'
                      ? (isEn ? 'Hydraulic Dipole' : 'Dipolo Hidráulico')
                      : (isEn ? 'Flow Past Cylinder' : 'Flujo con Obstáculo')}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <canvas ref={complexCanvasRef} width={540} height={210} className="w-full h-[200px] block" />
            </div>
          </div>

          {/* Module B & C: Residue Theorem & Fermat Ray Tracing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-xs font-mono text-amber-400 uppercase font-bold block">
                {isEn ? "B. Cauchy's Residue Theorem (Contour Integration)" : 'B. Teorema de los Residuos de Cauchy'}
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 font-bold text-center">
                <MathFormula math="\oint_\Gamma f(z) \, dz = 2\pi i \sum_k \operatorname{Res}(f, z_k)" display={true} />
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {isEn
                  ? 'The premier analytical tool for evaluating improper real Fourier integrals across the elastic half-space. Enables calculating surface wave dispersion (Rayleigh & Love) and intrinsic seismic attenuation Q⁻¹ through complex pole evaluation.'
                  : 'La herramienta analítica definitiva para evaluar integrales impropias de Fourier en el semiespacio elástico. Permite calcular la dispersión de las ondas superficiales de Rayleigh y Love y deducir la atenuación sísmica intrínseca Q⁻¹ mediante polos en el plano complejo.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">
                {isEn ? "C. Fermat's Principle & Seismic Ray Tracing" : 'C. Principio de Fermat & Trazado de Rayos'}
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 font-bold text-center">
                <MathFormula math="\delta \int \frac{ds}{v(\mathbf{x})} = 0 \implies p = \frac{\sin i}{v} = \text{const}" display={true} />
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {isEn
                  ? 'Fermat variational principle of stationary travel time: seismic ray paths between hypocenters and seismometer stations minimize acoustic transit duration. Directly derives Snell’s law and the horizontal ray parameter p that bends wavefronts inside Earth.'
                  : 'Principio variacional de mínimo tiempo de Fermat: el trayecto que recorre un rayo sísmico entre el hipocentro y el sismómetro minimiza el tiempo de viaje. De aquí se deduce directamente la Ley de Snell y el parámetro de rayo p que curva los frentes de onda en el interior de la Tierra.'}
              </p>
            </div>
          </div>

          {/* Module D: Analytical Mechanics (Euler-Lagrange & Hamilton) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
            <span className="text-xs font-mono text-purple-400 uppercase font-bold block">
              {isEn ? 'D. Analytical Mechanics: Euler-Lagrange & Hamilton’s Canonical Equations' : 'D. Mecánica Analítica: Ecuaciones de Euler-Lagrange y Hamilton'}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-sky-400 font-bold block">
                  {isEn ? 'Euler-Lagrange Equations of Motion (Lagrangian L = T - V):' : 'Ecuaciones de Euler-Lagrange (Lagrangiano L = T - V):'}
                </span>
                <div className="text-sm font-bold text-amber-300 text-center py-1 bg-slate-900/60 rounded-lg">
                  <MathFormula math="\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_i}\right) - \frac{\partial L}{\partial q_i} = 0" display={true} />
                </div>
                <p className="text-slate-400 font-sans text-xs leading-relaxed">
                  {isEn
                    ? 'Replaces Newton vector forces with scalar energy gradients in generalized coordinates q_i, eliminating geometric constraint forces in double pendulums, robotic arms, and celestial Kepler orbits.'
                    : 'Reemplaza las fuerzas vectoriales de Newton por gradientes escalares en coordenadas generalizadas q_i, eliminando fuerzas de restricción en péndulos y órbitas.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold block">
                  {isEn ? 'Hamilton’s Canonical Phase Space Equations (H = ∑ p_i q̇_i - L):' : 'Ecuaciones Canónicas de Hamilton (Espacio de Fase):'}
                </span>
                <div className="text-sm font-bold text-emerald-300 text-center py-1 bg-slate-900/60 rounded-lg">
                  <MathFormula math="\dot{q}_i = \frac{\partial H}{\partial p_i}, \quad \dot{p}_i = -\frac{\partial H}{\partial q_i}" display={true} />
                </div>
                <p className="text-slate-400 font-sans text-xs leading-relaxed">
                  {isEn
                    ? 'Transforms n second-order differential equations into 2n first-order symplectic flow equations on phase space (q, p), preserving Liouville volume density and bridging directly into quantum mechanics.'
                    : 'Transforma n ecuaciones diferenciales de 2º orden en 2n ecuaciones de 1er orden en el espacio de fase (q, p), conservando el volumen de Liouville y conectando con mecánica cuántica.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
