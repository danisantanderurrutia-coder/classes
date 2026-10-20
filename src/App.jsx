import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Atom,
  Orbit,
  Terminal,
  Calculator,
  Award,
  BookOpen,
  FileCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  Globe,
  Clock,
  Compass,
  Layers,
  ShieldCheck,
  Check,
  X,
  FileText,
  Send,
  Laptop,
  Binary,
  GraduationCap,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Library,
  BookMarked,
  Zap,
  MessageSquare,
  HelpCircle,
  BookmarkCheck,
  Phone,
  Mail,
  Share2,
  Copy
} from 'lucide-react';
import SolarSystem, { PLANET_SUBJECTS } from './components/SolarSystem';
import PhysicsLab, { LAB_PROBLEMS } from './components/PhysicsLab';
import { ProblemThumbnail } from './components/LabThumbnails';
import PIADMethod from './components/PIADMethod';

// Custom crisp GitHub SVG icon component
const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const Github = GithubIcon;

// Academic Curriculum Directory
const ACADEMIC_COURSES = [
  {
    id: "klausur",
    planetId: "earth",
    code: "HM-101/201",
    titleEn: "Higher Mathematics & Calculus I, II & III (Analysis for Engineers)",
    titleEs: "Cálculo Avanzado I, II y III (Análisis Matemático para Ingenieros)",
    facultyEn: "Faculty of Mathematics & Mechanical Engineering (University Standards)",
    facultyEs: "Facultad de Matemáticas e Ingeniería Mecánica",
    targetEn: "Engineering and science students preparing rigorous multivariable calculus and differential equations exams.",
    targetEs: "Estudiantes de ingeniería y ciencias que preparan exámenes exigentes de cálculo multivariable y ecuaciones diferenciales.",
    rateHourly: 55,
    packagePrice: 390,
    packageHours: 8,
    category: "bachelor",
    syllabusEn: [
      "Multivariable differential calculus & gradient vector fields: ∇f, ∇·F, ∇×F",
      "Integral theorems of vector analysis: Green's, Gauss's (Divergence), and Stokes' theorems",
      "Ordinary Differential Equations (ODEs): Separation of variables, integrating factors, Wronskian",
      "Complex numbers, power series, Taylor expansions, and Cauchy-Riemann conditions",
      "Official past-exam breakdown with examiner partial-point rubrics"
    ],
    syllabusEs: [
      "Cálculo diferencial multivariable y campos vectoriales: gradiente, divergencia y rotacional",
      "Teoremas integrales del análisis vectorial: Green, Gauss (Divergencia) y Stokes",
      "Ecuaciones Diferenciales Ordinarias (EDOs): Separación de variables, Wronskiano, sistemas lineales",
      "Números complejos, series de Taylor, criterios de convergencia y condiciones de Cauchy-Riemann",
      "Resolución exhaustiva de exámenes anteriores oficiales para asegurar el máximo de puntos parciales"
    ],
    keywordsEn: ["Intermediate Value Theorem", "Solids of Revolution", "Stokes' Theorem", "Divergence Theorem", "Homogeneous ODEs"],
    keywordsEs: ["Teorema del Valor Intermedio", "Sólidos de Revolución", "Teorema de Stokes", "Teorema de la Divergencia", "EDOs Homogéneas"],
    skriptKeywords: ["Intermediate Value Theorem", "Solids of Revolution", "Stokes' Theorem", "Divergence Theorem", "Homogeneous ODEs"],
    badgeEn: "University Calculus Track",
    badgeEs: "Cálculo Universitario",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?auto=format&fit=crop&w=700&q=80",
    color: "#0284C7"
  },
  {
    id: "linear_algebra",
    planetId: "saturn",
    code: "LA-102",
    titleEn: "Linear Algebra & Analytical Geometry",
    titleEs: "Álgebra Lineal y Geometría Analítica",
    facultyEn: "Applied Mathematics & Computational Sciences",
    facultyEs: "Matemáticas Aplicadas y Ciencias Computacionales",
    targetEn: "Students tackling vector spaces, spectral decomposition, and abstract proofs.",
    targetEs: "Estudiantes que necesitan dominar espacios vectoriales, descomposición espectral y demostraciones.",
    rateHourly: 55,
    packagePrice: 390,
    packageHours: 8,
    category: "bachelor",
    syllabusEn: [
      "Vector spaces, subspaces, linear independence, basis transformations, and dual spaces",
      "Linear mappings, kernel/image dimension theorems, and change-of-basis matrices",
      "Eigenvalues, eigenvectors, characteristic polynomials, and eigenspace multiplicities",
      "Principal axis transformation and quadratic forms",
      "Jordan canonical form, singular value decomposition (SVD), and orthogonal projections"
    ],
    syllabusEs: [
      "Espacios vectoriales, subespacios, independencia lineal, transformaciones de base y espacio dual",
      "Aplicaciones lineales, teorema de la dimensión (núcleo e imagen) y matrices asociadas",
      "Autovalores, autovectores, polinomio característico y multiplicidades algebraicas/geométricas",
      "Transformación a ejes principales y formas cuadráticas",
      "Forma canónica de Jordan, descomposición en valores singulares (SVD) y proyecciones ortogonales"
    ],
    keywordsEn: ["Eigenvalues & Eigenvectors", "Kernel & Image", "Principal Axis Theorem", "Jordan Canonical Form", "Bilinear Forms"],
    keywordsEs: ["Autovalores y Autovectores", "Núcleo e Imagen", "Ejes Principales", "Forma Canónica de Jordan", "Formas Bilineales"],
    skriptKeywords: ["Eigenvalues & Eigenvectors", "Kernel & Image", "Principal Axis Theorem", "Jordan Canonical Form", "Bilinear Forms"],
    badgeEn: "Proof Rigor",
    badgeEs: "Demostraciones",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80",
    color: "#4F46E5"
  },
  {
    id: "mechanics",
    planetId: "mercury",
    code: "PHY-201",
    titleEn: "Classical Mechanics & Analytical Dynamics",
    titleEs: "Mecánica Clásica y Dinámica Analítica",
    facultyEn: "Theoretical & Experimental Physics",
    facultyEs: "Física Teórica y Experimental",
    targetEn: "Physics & Engineering students mastering rigid body dynamics and Lagrangian mechanics.",
    targetEs: "Estudiantes de Física e Ingeniería que cursan Mecánica Teórica y sistemas oscilatorios.",
    rateHourly: 60,
    packagePrice: 430,
    packageHours: 8,
    category: "bachelor",
    syllabusEn: [
      "Newtonian dynamics with non-inertial reference frames (Coriolis & centrifugal forces)",
      "Generalized coordinates, D'Alembert's principle, and Euler-Lagrange equations of the 2nd kind",
      "Hamiltonian formulation: Legendre transformations, canonical equations, and Poisson brackets",
      "Rigid body kinematics: Inertia tensors, Euler angles, precession, and nutation",
      "Coupled harmonic oscillators, normal modes, and resonance under atmospheric dissipation"
    ],
    syllabusEs: [
      "Dinámica newtoniana en sistemas no inerciales (fuerzas de Coriolis y centrífugas)",
      "Coordenadas generalizadas, principio de D'Alembert y ecuaciones de Euler-Lagrange de 2ª especie",
      "Mecánica Hamiltoniana: Transformada de Legendre, ecuaciones canónicas y corchetes de Poisson",
      "Cinemática del sólido rígido: Tensor de inercia, ángulos de Euler, precesión y nutación",
      "Osciladores armónicos acoplados, modos normales de vibración y disipación"
    ],
    keywordsEn: ["Inertia Tensor", "Lagrangian Dynamics", "Coriolis Force", "Euler Angles", "Poisson Brackets"],
    keywordsEs: ["Tensor de Inercia", "Dinámica Lagrangiana", "Fuerza de Coriolis", "Ángulos de Euler", "Corchetes de Poisson"],
    skriptKeywords: ["Inertia Tensor", "Lagrangian Dynamics", "Coriolis Force", "Euler Angles", "Poisson Brackets"],
    badgeEn: "Theoretical Mechanics",
    badgeEs: "Mecánica Teórica",
    // Tested 200 OK Unsplash image
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80",
    color: "#475569"
  },
  {
    id: "geophysics",
    planetId: "mars",
    code: "GEO-301",
    titleEn: "Applied Geophysics & Inverse Theory",
    titleEs: "Geofísica Aplicada y Teoría Inversa",
    facultyEn: "Earth Sciences, Geodynamics & Environmental Engineering",
    facultyEs: "Ciencias de la Tierra, Geodinámica e Ingeniería Ambiental",
    targetEn: "Students investigating wave propagation, planetary interiors, and sensor data.",
    targetEs: "Estudiantes que investigan propagación de ondas, el interior planetario y datos geofísicos.",
    rateHourly: 65,
    packagePrice: 470,
    packageHours: 8,
    category: "master",
    syllabusEn: [
      "Elastodynamics & seismic wave propagation (P-waves, S-waves, Rayleigh & Love surface waves)",
      "Constitutive equations of linear elasticity and Hooke's generalized tensor: σ_ij = c_ijkl ε_kl",
      "Geophysical inverse theory: Linearized least-squares, Tikhonov regularization, singular values",
      "Potential field methods: Gravity anomalies (Bouguer reduction) & magnetic field modeling",
      "Borehole logging, seismic reflection travel-time processing, and spectral filtering"
    ],
    syllabusEs: [
      "Elastodinámica y propagación de ondas sísmicas (ondas P, S y ondas superficiales de Rayleigh/Love)",
      "Ecuaciones constitutivas de elasticidad lineal y tensor generalizado de Hooke",
      "Teoría de inversión geofísica: Mínimos cuadrados regularizados por Tikhonov y análisis SVD",
      "Métodos de campos potenciales: Anomalías gravimétricas (Bouguer) y modelado magnético",
      "Procesamiento de tiempos de viaje en reflexión sísmica, registros de pozo y filtrado espectral"
    ],
    keywordsEn: ["Wave Equation", "Tikhonov Regularization", "Bouguer Anomaly", "Elasticity Tensor", "Travel-time Curves"],
    keywordsEs: ["Ecuación de Onda", "Regularización de Tikhonov", "Anomalía de Bouguer", "Tensor de Elasticidad", "Curvas de Tiempo de Viaje"],
    skriptKeywords: ["Wave Equation", "Tikhonov Regularization", "Bouguer Anomaly", "Elasticity Tensor", "Travel-time Curves"],
    badgeEn: "Mentor Specialty",
    badgeEs: "Especialidad Geofísica",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80",
    color: "#DC2626"
  },
  {
    id: "computational",
    planetId: "sun",
    code: "COMP-205",
    titleEn: "Computational Physics & Scientific Python",
    titleEs: "Física Computacional y Python Científico",
    facultyEn: "Computational Engineering & Data Science",
    facultyEs: "Ingeniería Computacional y Ciencia de Datos",
    targetEn: "Engineers transforming continuous mathematical equations into vectorized numerical simulations.",
    targetEs: "Ingenieros que necesitan transformar ecuaciones matemáticas continuas en simulaciones numéricas.",
    rateHourly: 65,
    packagePrice: 470,
    packageHours: 8,
    category: "bachelor",
    syllabusEn: [
      "Numerical ODE/PDE integration: Runge-Kutta 4th order, Verlet algorithms, adaptive step sizing",
      "Vectorized scientific computing with NumPy, SciPy (solve_ivp, optimize, fft), and Matplotlib",
      "Finite difference schemes (FDM) for heat conduction, diffusion, and wave propagation",
      "Fourier spectral methods (FFT) for periodic boundary problems and signal decomposition",
      "Scientific data pipelines, error propagation analysis, and automated LaTeX figure export"
    ],
    syllabusEs: [
      "Integración numérica de EDOs/EDPs: Runge-Kutta 4º orden, algoritmos de Verlet y paso adaptable",
      "Cálculo científico vectorizado en NumPy, SciPy (solve_ivp, optimize, fft) y Matplotlib",
      "Esquemas de diferencias finitas (FDM) para conducción térmica, difusión y ondas",
      "Métodos espectrales de Fourier (FFT) para problemas de contorno periódico y descomposición",
      "Pipelines de datos científicos, análisis de propagación de errores y exportación a LaTeX"
    ],
    keywordsEn: ["Runge-Kutta Methods", "Finite Differences", "Fourier Transform", "Stability Analysis", "Vectorized Python"],
    keywordsEs: ["Métodos de Runge-Kutta", "Diferencias Finitas", "Transformada de Fourier", "Análisis de Estabilidad", "Python Vectorizado"],
    skriptKeywords: ["Runge-Kutta Methods", "Finite Differences", "Fourier Transform", "Stability Analysis", "Vectorized Python"],
    badgeEn: "Scientific Code",
    badgeEs: "Código Científico",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80",
    color: "#D97706"
  },
  {
    id: "ib",
    planetId: "jupiter",
    code: "IB-HL",
    titleEn: "IB Diploma: Mathematics AA HL & Physics HL",
    titleEs: "Bachillerato Internacional: Math AA HL y Física HL",
    facultyEn: "International Baccalaureate High School Senior Cohort",
    facultyEs: "Bachillerato Internacional (Alumnos de Último Año)",
    targetEn: "International School students aiming for grade 7s in higher-level Mathematics and Physics.",
    targetEs: "Alumnos de Colegios Internacionales que buscan obtener la máxima calificación (7) en Matemáticas y Física HL.",
    rateHourly: 50,
    packagePrice: 360,
    packageHours: 8,
    category: "ib",
    syllabusEn: [
      "Mathematics AA HL: Advanced calculus (Maclaurin series, integration by parts, differential equations)",
      "Vectors in 3D: Vector and scalar cross products, line-plane intersections, and geometric proofs",
      "Physics HL: Fields (gravitational, electric, magnetic), wave phenomena, and nuclear quantum physics",
      "Comprehensive Internal Assessment (IA) guidance: Mathematical modeling, error analysis, and formatting",
      "Past Paper exam drills (Paper 1 Non-Calculator, Paper 2, and Paper 3 investigative problem solving)"
    ],
    syllabusEs: [
      "Mathematics AA HL: Cálculo avanzado (series de Maclaurin, integración por partes, EDOs)",
      "Vectores en 3D: Productos vectorial y escalar, intersecciones recta-plano y demostraciones",
      "Physics HL: Campos (gravitatorio, eléctrico, magnético), óptica ondulatoria y física cuántica",
      "Supervisión completa de la Evaluación Interna (IA): Modelado matemático, cálculo de errores y formato",
      "Entrenamiento exhaustivo con exámenes oficiales (Paper 1 sin calculadora, Paper 2 y Paper 3)"
    ],
    keywordsEn: ["Internal Assessment (IA)", "Paper 1 (Non-Calc)", "Vector Planes", "Mark Scheme Precision", "Calculus AA"],
    keywordsEs: ["Evaluación Interna (IA)", "Paper 1 (Sin Calculadora)", "Planos Vectoriales", "Precisión de Pauta", "Cálculo AA"],
    skriptKeywords: ["Internal Assessment (IA)", "Paper 1 (Non-Calc)", "Vector Planes", "Mark Scheme Precision", "Calculus AA"],
    badgeEn: "Target Grade 7",
    badgeEs: "Objetivo Nota 7",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80",
    color: "#059669"
  },
  {
    id: "relativity",
    planetId: "blackhole",
    code: "AST-401",
    titleEn: "General Relativity, Gravitation & Black Hole Astrophysics",
    titleEs: "Relatividad General, Gravitación y Astrofísica de Agujeros Negros",
    facultyEn: "Theoretical Astrophysics & Gravitational Physics",
    facultyEs: "Astrofísica Teórica y Física Gravitacional",
    targetEn: "Students tackling differential geometry, curved spacetime metrics, and black hole dynamics.",
    targetEs: "Estudiantes que investigan geometría diferencial, métricas de espacio-tiempo y dinámica de agujeros negros.",
    rateHourly: 65,
    packagePrice: 470,
    packageHours: 8,
    category: "master",
    syllabusEn: [
      "Equivalence principle, metric tensor g_μν, Christoffel symbols, and geodesic equations",
      "Riemann curvature tensor, Ricci tensor R_μν, scalar curvature, and Bianchi identities",
      "Einstein field equations: G_μν + Λg_μν = (8πG/c⁴) T_μν and energy-momentum conservation",
      "Schwarzschild exterior solution, gravitational redshift, perihelion precession, and photon sphere",
      "Kerr rotating black holes, frame-dragging (Lense-Thirring), event horizons, and gravitational waves (h_μν)"
    ],
    syllabusEs: [
      "Principio de equivalencia, tensor métrico g_μν, símbolos de Christoffel y ecuaciones geodésicas",
      "Tensor de curvatura de Riemann, tensor de Ricci R_μν, curvatura escalar e identidades de Bianchi",
      "Ecuaciones de campo de Einstein: G_μν + Λg_μν = (8πG/c⁴) T_μν y conservación de energía-momento",
      "Solución exterior de Schwarzschild, desplazamiento al rojo gravitacional, esfera de fotones y horizonte",
      "Agujeros negros rotantes de Kerr, arrastre de marcos de referencia (Lense-Thirring) y ondas gravitacionales"
    ],
    keywordsEn: ["Schwarzschild Metric", "Christoffel Symbols", "Geodesic Equation", "Einstein Field Equations", "Kerr Black Hole"],
    keywordsEs: ["Métrica de Schwarzschild", "Símbolos de Christoffel", "Ecuación Geodésica", "Ecuaciones de Campo de Einstein", "Agujero Negro de Kerr"],
    skriptKeywords: ["Schwarzschild Metric", "Christoffel Symbols", "Geodesic Equation", "Einstein Field Equations", "Kerr Black Hole"],
    badgeEn: "General Relativity",
    badgeEs: "Relatividad General",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=700&q=80",
    color: "#8B5CF6"
  }
];

// Foundational Academic STEM Library (Verified 200 OK Unsplash images)
const FOUNDATIONAL_BOOKS = [
  {
    id: "goldstein",
    title: "Classical Mechanics",
    authors: "Herbert Goldstein, Charles P. Poole, John L. Safko",
    edition: "3rd Edition • Addison-Wesley",
    subjectEn: "Analytical Mechanics, Lagrangian & Hamiltonian Dynamics",
    subjectEs: "Mecánica Analítica, Dinámica Lagrangiana y Hamiltoniana",
    usedIn: ["PHY-201", "HM-201"],
    descriptionEn: "The undisputed international benchmark for graduate classical mechanics: D'Alembert's principle, canonical transformations, Hamilton-Jacobi theory, and rigid body inertia tensors.",
    descriptionEs: "El referente internacional indiscutible en mecánica clásica avanzada: principio de D'Alembert, transformaciones canónicas, teoría de Hamilton-Jacobi y tensor de inercia.",
    // Verified 200 OK image
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    tag: "Theoretical Physics"
  },
  {
    id: "feynman",
    title: "The Feynman Lectures on Physics (Vols. I, II & III)",
    authors: "Richard P. Feynman, Robert B. Leighton, Matthew Sands",
    edition: "Definitive Edition • Caltech",
    subjectEn: "Physical Intuition, Electrodynamics & Wave Mechanics",
    subjectEs: "Intuición Física, Electrodinámica y Mecánica Ondulatoria",
    usedIn: ["HM-101/201", "PHY-201", "IB-HL"],
    descriptionEn: "Masterclass in physical intuition: demystifying vector circulation, Gauss's law, harmonic resonance, and the deep physical necessity behind every differential equation.",
    descriptionEs: "La máxima referencia en intuición física: desmitifica la circulación de campos, la ley de Gauss, la resonancia armónica y la necesidad física tras cada ecuación diferencial.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    tag: "Physical Intuition"
  },
  {
    id: "aki_richards",
    title: "Quantitative Seismology",
    authors: "Keiiti Aki, Paul G. Richards",
    edition: "2nd Edition • University Science Books",
    subjectEn: "Elastodynamics, Wave Equations & Green's Tensors",
    subjectEs: "Elastodinámica, Ecuación de Ondas y Tensores de Green",
    usedIn: ["GEO-301", "COMP-205"],
    descriptionEn: "The definitive treatise on elastic wave propagation, representation theorems, stress-strain tensor constitutive laws, and ray theory in planetary media.",
    descriptionEs: "El tratado cumbre sobre propagación de ondas elásticas en medios continuos, teoremas de representación, leyes constitutivas de esfuerzos y teoría de rayos.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    tag: "Applied Geophysics"
  },
  {
    id: "strang",
    title: "Linear Algebra and Its Applications",
    authors: "Gilbert Strang",
    edition: "5th Edition • Wellesley-Cambridge Press",
    subjectEn: "Vector Spaces, Spectral Theorem & SVD Decomposition",
    subjectEs: "Espacios Vectoriales, Teorema Espectral y Descomposición SVD",
    usedIn: ["LA-102", "COMP-205"],
    descriptionEn: "Clear, geometric understanding of fundamental subspaces (column space, nullspace), orthogonal projections, eigenvalues, positive definite matrices, and singular value decomposition.",
    descriptionEs: "Comprensión geométrica cristalina de los 4 subespacios fundamentales, proyecciones ortogonales, autovalores, matrices simétricas definidas positivas y SVD.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    tag: "Linear Algebra"
  },
  {
    id: "courant",
    title: "Introduction to Calculus and Analysis (Vols. I & II)",
    authors: "Richard Courant, Fritz John",
    edition: "Classics in Mathematics • Springer",
    subjectEn: "Rigorous Multivariable Calculus & Differential Forms",
    subjectEs: "Cálculo Multivariable Riguroso y Formas Diferenciales",
    usedIn: ["HM-101/201"],
    descriptionEn: "The European rigorous foundation for higher mathematics: precise limits, uniform convergence, multiple integrals, curvilinear coordinate transforms, and Stokes' theorem.",
    descriptionEs: "La base rigurosa europea para el Cálculo Avanzado y Superior: límites estrictos, convergencia uniforme, integrales múltiples, transformaciones de coordenadas y teorema de Stokes.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    tag: "Cálculo Superior"
  },
  {
    id: "landau_lifshitz",
    title: "Fluid Mechanics (Course of Theoretical Physics Vol. 6)",
    authors: "L.D. Landau, E.M. Lifshitz",
    edition: "2nd Edition • Butterworth-Heinemann",
    subjectEn: "Navier-Stokes Equations, Turbulence & Boundary Layers",
    subjectEs: "Ecuaciones de Navier-Stokes, Turbulencia y Capas Límite",
    usedIn: ["GEO-301", "PHY-201"],
    descriptionEn: "The master formulation of continuous media: exact hydrodynamic equations, boundary conditions, viscous dissipation tensors, and acoustic wave dispersion.",
    descriptionEs: "La formulación magistral de los medios continuos: ecuaciones hidrodinámicas exactas, disipación viscosa, capas límite y dispersión de ondas acústicas.",
    // Verified 200 OK image
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=600&q=80",
    tag: "Continuum Physics"
  },
  {
    id: "mtw_gravitation",
    title: "Gravitation",
    authors: "Charles W. Misner, Kip S. Thorne, John Archibald Wheeler",
    edition: "Princeton University Press • Landmark Edition",
    subjectEn: "General Relativity, Spacetime Curvature & Geometrodynamics",
    subjectEs: "Relatividad General, Curvatura del Espacio-Tiempo y Geometrodinámica",
    usedIn: ["AST-401", "PHY-201"],
    descriptionEn: "The legendary bible of gravitational physics and black hole geometrodynamics: differential forms, Einstein field equations, Riemann curvature, and the Kerr black hole metric.",
    descriptionEs: "La legendaria biblia de la física gravitacional y la geometrodinámica de agujeros negros: cálculo diferencial de formas, ecuaciones de Einstein y métrica de Kerr.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    tag: "General Relativity"
  }
];

// Pitch: reasons to take classes (shown on the landing page)
const WHY_ME_REASONS = [
  {
    id: 'piad',
    icon: Compass,
    titleEn: 'Proprietary PIAD™ Method',
    titleEs: 'Metodología Propia PIAD™',
    textEn: 'Open & Digital Inquiry Pedagogy: leverage AI productively to design code, highlight the essential core of problems, and ground science in empirical intuition.',
    textEs: 'Pedagogía de la Indagación Abierta y Digital: utiliza la IA productivamente para diseñar código, relevar lo esencial de cada problema y conectar la ciencia con intuición empírica.',
  },
  {
    id: 'language',
    icon: Globe,
    titleEn: 'Classes in your language',
    titleEs: 'Clases en tu idioma',
    textEn: 'I explain in English or Spanish, so you can focus on the subject instead of translating.',
    textEs: 'Explico en español o inglés, para que te concentres en la materia y no en traducir.',
  },
  {
    id: 'context',
    icon: GraduationCap,
    titleEn: 'I know the context',
    titleEs: 'Conozco el contexto',
    textEn: 'Engineer and geophysicist (double M.Sc.) with proven experience preparing rigorous university examinations.',
    textEs: 'Ingeniero y geofísico (doble M.Sc.) con experiencia en el nivel de máxima exigencia universitaria.',
  },
  {
    id: 'intuition',
    icon: Orbit,
    titleEn: 'Intuition first',
    titleEs: 'Intuición primero',
    textEn: 'Every concept is explained with a real phenomenon, and you can test it in the interactive Physics Lab.',
    textEs: 'Cada concepto se explica con un fenómeno real y lo compruebas en el Laboratorio interactivo de Física.',
  },
  {
    id: 'altklausur',
    icon: FileCheck,
    titleEn: 'Past-exam preparation',
    titleEs: 'Preparación con Exámenes Reales',
    textEn: 'We practise with past exams, answer structure and how to earn partial points.',
    textEs: 'Practicamos con exámenes anteriores, estructura de respuesta y cómo conseguir puntos parciales.',
  },
  {
    id: 'applied',
    icon: Terminal,
    titleEn: 'Applied science',
    titleEs: 'Ciencia aplicada',
    textEn: 'From calculus to Python (NumPy/SciPy): see how what you study is used in practice.',
    textEs: 'Del cálculo a Python (NumPy/SciPy): ves cómo se usa en la práctica lo que estudias.',
  },
  {
    id: 'transparent',
    icon: ShieldCheck,
    titleEn: 'Clear and professional',
    titleEs: 'Claro y profesional',
    textEn: 'Prices from €50/h, 8-hour sprint packs, transparent rates, and direct communication.',
    textEs: 'Precios desde 50 €/h, paquetes de 8 h, calculadora transparente y comunicación directa.',
  },
];

// Mapping of academic courses to matching interactive Physics Lab benchmark problems
const COURSE_LAB_MAPPING = {
  klausur: 'vector_calculus',
  linear_algebra: 'coupled_oscillators',
  mechanics: 'newtonian',
  geophysics: 'seismology_beachball',
  computational: 'intro_physics',
  ib: 'electromagnetism'
};

// Official Spanish-speaking countries (ISO 3166-1 alpha-2)
const HISPANIC_COUNTRIES = new Set([
  'ES', // Spain
  'MX', // Mexico
  'CO', // Colombia
  'AR', // Argentina
  'PE', // Peru
  'VE', // Venezuela
  'CL', // Chile
  'EC', // Ecuador
  'GT', // Guatemala
  'CU', // Cuba
  'BO', // Bolivia
  'DO', // Dominican Republic
  'HN', // Honduras
  'PY', // Paraguay
  'SV', // El Salvador
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panama
  'UY', // Uruguay
  'PR', // Puerto Rico
  'GQ'  // Equatorial Guinea
]);

// Hispanic timezones for instantaneous 0ms client-side detection before GeoIP resolves
const HISPANIC_TIMEZONES = new Set([
  'America/Santiago',
  'America/Punta_Arenas',
  'Pacific/Easter',
  'Europe/Madrid',
  'Atlantic/Canary',
  'Africa/Ceuta',
  'America/Buenos_Aires',
  'America/Bogota',
  'America/Lima',
  'America/Caracas',
  'America/Mexico_City',
  'America/Cancun',
  'America/Merida',
  'America/Monterrey',
  'America/Mazatlan',
  'America/Chihuahua',
  'America/Hermosillo',
  'America/Tijuana',
  'America/Bahia_Banderas',
  'America/Guayaquil',
  'Pacific/Galapagos',
  'America/Guatemala',
  'America/Havana',
  'America/La_Paz',
  'America/Santo_Domingo',
  'America/Tegucigalpa',
  'America/Asuncion',
  'America/El_Salvador',
  'America/Managua',
  'America/Costa_Rica',
  'America/Panama',
  'America/Montevideo',
  'America/Puerto_Rico',
  'Africa/Malabo'
]);

function detectInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('preferred_lang');
    if (saved === 'en' || saved === 'es') return saved;

    // Instantaneous timezone check
    const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    if (tz && (HISPANIC_TIMEZONES.has(tz) || tz.startsWith('America/Argentina/'))) {
      return 'es';
    }

    // Default to English for all non-Hispanic locations (Germany, USA, UK, etc.)
    return 'en';
  } catch {
    return 'en';
  }
}

export default function App() {
  const [lang, setLangState] = useState(() => detectInitialLanguage());

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('preferred_lang', newLang);
    } catch {}
  };

  // GeoIP detection on mount: fetches country via lightweight API if no user override exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred_lang');
      if (saved) return; // User already chose explicitly

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      fetch('https://api.country.is/', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          if (data && data.country) {
            const isHispanic = HISPANIC_COUNTRIES.has(String(data.country).toUpperCase());
            setLangState(isHispanic ? 'es' : 'en');
          }
        })
        .catch(() => {
          // Keep the initial timezone detection result
        });
    } catch {}
  }, []);

  // Multi-page navigation state: 'landing' | 'lab' | 'courses' | 'library' | 'precios' | 'contact'
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeLabProblemId, setActiveLabProblemId] = useState('newtonian');
  const [selectedSubjectId, setSelectedSubjectId] = useState('klausur');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    courseCode: '',
    targetDate: '',
    languagePref: 'English',
    deliveryMode: 'Online 1-on-1',
    sessionType: 'Regular Sprint', // 'Regular Sprint' | 'Spontaneous Session'
    notes: ''
  });

  // Rate Calculator State
  const [calcLevel, setCalcLevel] = useState('bachelor');
  const [calcHours, setCalcHours] = useState(8);
  const [calcFormat, setCalcFormat] = useState('1on1');
  const [calcSprintDiscount, setCalcSprintDiscount] = useState(true);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  const baseRates = { ib: 50, bachelor: 55, master: 65 };
  const baseRate = baseRates[calcLevel] || 55;
  const groupMultiplier = calcFormat === 'group' ? 0.70 : 1.0;
  const sprintMultiplier = calcSprintDiscount ? 0.85 : 1.0;
  const effectiveRate = Math.round(baseRate * groupMultiplier * sprintMultiplier);
  const totalCost = Math.round(effectiveRate * calcHours);

  // Synchronize hash in URL with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'faq') {
        setCurrentPage('contact');
        setTimeout(() => {
          document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (['precios', 'calculator', 'mentor'].includes(hash)) {
        setCurrentPage('precios');
        if (hash === 'mentor') {
          setTimeout(() => {
            document.getElementById('mentor-dossier')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else if (['landing', 'lab', 'courses', 'piad', 'library', 'contact'].includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('landing');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page, sectionId) => {
    if (page === 'faq') {
      setCurrentPage('contact');
      window.location.hash = '#/contact';
      setTimeout(() => {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    if (page === 'mentor' || page === 'calculator' || page === 'precios') {
      setCurrentPage('precios');
      window.location.hash = '#/precios';
      if (page === 'mentor' || sectionId === 'mentor-dossier') {
        setTimeout(() => {
          document.getElementById('mentor-dossier')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openLabProblem = (problemId = 'newtonian') => {
    setActiveLabProblemId(problemId);
    navigateTo('lab');
  };

  // Keyboard Escape listener for Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenBooking = (course = null, isSpontaneous = false) => {
    setModalCourse(course);
    setBookingData(prev => ({
      ...prev,
      courseCode: course ? `${course.code} - ${course.titleEn}` : '',
      sessionType: isSpontaneous ? 'Spontaneous Session (On-Demand)' : 'Regular Sprint'
    }));
    setModalSubmitted(false);
    setIsModalOpen(true);
  };

  // Form Submit Handler with automatic email trigger to danisantander.urrutia@gmail.com
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `[Open Knowledge & Science Mentorship] ${bookingData.courseCode || 'Diagnostic Call'} - ${bookingData.name}`
    );
    const bodyText = 
`Hi Daniel,

I am requesting an Open Knowledge & Science Mentorship session.

--- STUDENT DETAILS ---
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone / WhatsApp: ${bookingData.phone || 'Not provided'}
University / School: ${bookingData.university}
Selected Course / Module: ${bookingData.courseCode || 'Diagnostic / General Mentorship'}
Type of Session: ${bookingData.sessionType}
Delivery Mode: ${bookingData.deliveryMode}
Language Preference: ${bookingData.languagePref}
Target Exam Date / Deadline: ${bookingData.targetDate || 'Not specified'}

--- QUESTIONS / BOTTLENECKS ---
${bookingData.notes || 'None provided'}

Sent from Open Knowledge & Science Mentorship Portal`;

    const mailto = `mailto:danisantander.urrutia@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setLastMailtoUrl(mailto);
    setModalSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#059669', '#0F172A', '#D97706']
      });
    } catch (err) {}

    // Automatically trigger mail draft in user's default client
    window.location.href = mailto;
  };

  const handleSelectPlanetSubject = (planetData) => {
    if (planetData && planetData.courseId) {
      setSelectedSubjectId(planetData.courseId);
    }
  };

  const filteredCourses = courseFilter === 'all' 
    ? ACADEMIC_COURSES 
    : ACADEMIC_COURSES.filter(c => c.category === courseFilter);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Subtle graph paper grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-60" />

      {/* ========================================================= */}
      {/* FLOATING CAPSULE HEADER (DYNAMIC ISLAND / RAYCAST STYLE)  */}
      {/* ========================================================= */}
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-2 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 rounded-full bg-black/90 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/90 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto ring-1 ring-white/10">
          
          {/* Identity Badge */}
          <button 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-mono text-sm font-bold group-hover:bg-white/20 transition-all shrink-0">
              Φ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white group-hover:text-slate-200 transition-colors whitespace-nowrap leading-tight">
                DANIEL SANTANDER
              </span>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider whitespace-nowrap leading-tight">
                Open Knowledge &amp; Science Mentorship
              </span>
            </div>
          </button>

          {/* Pill Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-mono font-medium">
            <button
              onClick={() => navigateTo('lab')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'lab'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Atom className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Lab' : 'Lab DCL'}</span>
            </button>

            <button
              onClick={() => navigateTo('courses')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'courses'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Courses' : 'Cursos'}</span>
            </button>

            <button
              onClick={() => navigateTo('piad')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'piad'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>PIAD™</span>
            </button>

            <button
              onClick={() => navigateTo('library')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'library'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Library className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Library' : 'Librería'}</span>
            </button>

            <button
              onClick={() => navigateTo('precios')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'precios'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Pricing' : 'Precios'}</span>
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentPage === 'contact'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Contact' : 'Contacto'}</span>
            </button>
          </nav>

          {/* Language & Rounded CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 text-xs font-mono shrink-0">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'es' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>

            <button
              onClick={() => handleOpenBooking()}
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>{lang === 'en' ? 'Book' : 'Reservar'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Floating Bottom Dock */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 px-3 py-2 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/90 flex items-center justify-around text-[10px] font-mono text-slate-400 ring-1 ring-white/10">
        <button
          onClick={() => navigateTo('landing')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'landing' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <span className="text-sm font-bold">Φ</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => navigateTo('lab')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'lab' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>Lab</span>
        </button>
        <button
          onClick={() => navigateTo('courses')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'courses' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Courses' : 'Cursos'}</span>
        </button>
        <button
          onClick={() => navigateTo('piad')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'piad' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>PIAD™</span>
        </button>
        <button
          onClick={() => navigateTo('precios')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'precios' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Pricing' : 'Precios'}</span>
        </button>
        <button
          onClick={() => navigateTo('contact')}
          className={`p-1 flex flex-col items-center gap-0.5 ${currentPage === 'contact' ? 'text-white font-bold' : 'hover:text-white'}`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Contact' : 'Contacto'}</span>
        </button>
      </nav>

      <main className="relative z-10">

        {/* ========================================================= */}
        {/* PAGE 1: ATTRACTIVE LANDING WITH PLANETARY OBSERVATORY     */}
        {/* ========================================================= */}
        {currentPage === 'landing' && (
          <div>
            {/* Landing Hero: Deep Obsidian Observatory Canvas Seamlessly Flowing into 3D Planetarium */}
            <section className="pt-24 sm:pt-28 pb-0 bg-black text-white relative overflow-hidden">
              {/* Atmospheric Celestial Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,165,233,0.12),rgba(0,0,0,0))] pointer-events-none" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 font-mono text-xs mb-5 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {lang === 'en'
                        ? 'OPEN KNOWLEDGE & SCIENCE MENTORSHIP • DANIEL SANTANDER • DOUBLE M.SC. & GEOPHYSICIST'
                        : 'OPEN KNOWLEDGE & SCIENCE MENTORSHIP • DANIEL SANTANDER • DOBLE M.SC. Y GEOFÍSICO'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5">
                    {lang === 'en'
                      ? 'From sensory intuition to exact science: master higher physics & math'
                      : 'De la intuición sensible a la ciencia exacta: domina la física y el cálculo'}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 font-normal max-w-3xl mx-auto mb-3 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Learn to see physical phenomena through direct observation before formulas, designing scientific code and sovereign criteria under the PIAD Method™ (Open & Digital Inquiry).'
                      : 'Aprende a ver los fenómenos mediante la observación directa antes de las fórmulas, diseñando código propio y criterio autónomo bajo el Método PIAD™ (Indagación Abierta y Digital).'}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Significantly improve your grades through 1-on-1 or group mentoring with a Double Master in Science & Geophysicist, tailored for university students and IB candidates.'
                      : 'Mejora considerablemente tus calificaciones mediante clases individuales o grupales con un Doble Máster en Ciencias y Geofísico, para estudiantes universitarios y de Bachillerato Internacional (IB).'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => openLabProblem('newtonian')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-sky-400/20 cursor-pointer"
                    >
                      <Atom className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Interactive Physics Lab (DCL) →' : 'Laboratorio Interactivo (DCL) →'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('courses')}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open Course Catalog →' : 'Abrir Catálogo de Clases →'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('piad')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lang === 'en' ? 'PIAD Method™ →' : 'Método PIAD™ →'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenBooking(null, true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Spontaneous 1-on-1 Class' : 'Clase Espontánea Urgente'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Direct Contact & WhatsApp' : 'Contacto Directo & WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Planetary Observatory Viewport: Restrained Margins for Seamless Downscroll */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                {/* Section Header connecting the Observatory to the Academic Courses */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 font-mono text-[11px] uppercase tracking-[0.25em] mb-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'en' ? 'Observatory of the Cosmos' : 'Observatorio del Cosmos'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {lang === 'en'
                      ? 'Interactive Mentorship Courses by Celestial Body'
                      : 'Explorador Interactivo de Cursos y Mentorías por Astro'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-1.5 font-sans leading-relaxed">
                    {lang === 'en'
                      ? 'Each celestial body represents a core university & IB discipline (Higher Calculus, Classical Mechanics, Electromagnetism, Quantum Physics & Relativity). Click any planet to inspect syllabus, exam exercises, and booking.'
                      : 'Cada astro representa una disciplina universitaria e IB (Cálculo Superior, Mecánica Clásica, Electromagnetismo, Cuántica y Relatividad). Haz clic en un planeta para explorar temarios, ejercicios de examen y reservas.'}
                  </p>
                </div>

                <div id="planetarium-viewport" className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_90px_rgba(56,189,248,0.07)]">
                  <SolarSystem
                    onSelectSubject={handleSelectPlanetSubject}
                    selectedSubjectId={selectedSubjectId}
                    lang={lang}
                    onNavigate={navigateTo}
                    onOpenBooking={handleOpenBooking}
                    courses={ACADEMIC_COURSES}
                  />
                </div>
              </div>
            </section>

            {/* Interactive Classical Physics Lab Preview Section on Landing */}
            <section className="py-16 bg-white text-slate-900 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {lang === 'en'
                          ? 'Interactive Sandbox • Free Body Diagrams (FBD) • Calculus Bridge'
                          : 'Laboratorio Tipo Juego • Botón de DCL • Puente Álgebra ↔ Cálculo'}
                      </span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      {lang === 'en'
                        ? 'Explore the Classical Physics & Engineering Problems'
                        : 'Explora los Problemas Clásicos de la Física y la Ingeniería'}
                    </h2>
                    <p className="text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed">
                      {lang === 'en'
                        ? 'Test each phenomenon experimentally: toggle Free Body Diagrams (DCL), see how linear algebra and trigonometry turn into differential equations, and solve a classic exam exercise.'
                        : 'Experimenta cada caso clásico como un mini-laboratorio: activa los Diagramas de Cuerpo Libre (DCL), conecta las ecuaciones de álgebra y cálculo, y resuelve un ejercicio real de examen.'}
                    </p>
                  </div>

                  <button
                    onClick={() => openLabProblem('newtonian')}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-mono text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-sky-600/20"
                  >
                    <Atom className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Launch Full Physics Lab (14 Problems) →' : 'Abrir Laboratorio Completo (14 Problemas) →'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {LAB_PROBLEMS.slice(0, 3).map((prob) => {
                    const Icon = prob.icon;
                    return (
                      <div
                        key={prob.id}
                        onClick={() => openLabProblem(prob.id)}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-500/70 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
                      >
                        <div>
                          {/* Top Badges & Icon */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-sky-800 font-bold border border-slate-200">
                              {lang === 'en' ? prob.badgeEn : prob.badgeEs}
                            </span>
                            <span className="w-8 h-8 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors border border-slate-200">
                              <Icon className="w-4 h-4" />
                            </span>
                          </div>

                          {/* Exercise Vector Diagram Thumbnail */}
                          <div className="mb-4 rounded-xl overflow-hidden shadow-inner border border-slate-200 group-hover:border-sky-400 transition-colors">
                            <ProblemThumbnail problemId={prob.id} lang={lang} />
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-1.5 leading-snug">
                            {lang === 'en' ? prob.titleEn : prob.titleEs}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {lang === 'en' ? prob.subtitleEn : prob.subtitleEs}
                          </p>

                          {/* Exercise prompt teaser snippet */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 mb-4 line-clamp-2">
                            <span className="text-emerald-700 font-bold mr-1">
                              {lang === 'en' ? 'Target:' : 'Objetivo:'}
                            </span>
                            <span>
                              {lang === 'en'
                                ? (prob.exercise?.questionEn || prob.klausurProblem?.titleEn || prob.titleEn)
                                : (prob.exercise?.questionEs || prob.klausurProblem?.titleEs || prob.titleEs)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-sky-700 font-bold">
                          <span>{lang === 'en' ? 'Open Interactive Lab & DCL →' : 'Abrir Simulador y DCL →'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 1. Courses & Classes Offered (Placed First Before 'Why Take Classes') */}
            <section id="courses-preview" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                      {lang === 'en' ? 'Classes & Modules Offered' : 'Clases que Ofrezco'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {lang === 'en' ? 'High-Demand University Exam Preparation Tracks' : 'Materias Críticas y Cursos Universitarios'}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('courses')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'View all 6 course tracks →' : 'Ver las 6 materias →'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ACADEMIC_COURSES.slice(0, 3).map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 transition-all">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={course.image} 
                          alt={course.titleEn} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute top-3 left-3">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs">
                            {course.code}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold">
                              {lang === 'en' ? course.badgeEn : course.badgeEs}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                            {lang === 'en' ? course.titleEn : course.titleEs}
                          </h3>
                          <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                            {lang === 'en' ? course.targetEn : course.targetEs}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-slate-900">€{course.rateHourly}<span className="text-xs font-normal text-slate-500">/hr</span></span>
                          <button
                            onClick={() => handleOpenBooking(course)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer"
                          >
                            {lang === 'en' ? 'Enroll' : 'Inscribirse'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Pitch: Why take classes with me */}
            <section id="why-me" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {lang === 'en' ? 'Why take classes with me?' : '¿Por qué tomar clases conmigo?'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {WHY_ME_REASONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-sky-700 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {lang === 'en' ? r.titleEn : r.titleEs}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {lang === 'en' ? r.textEn : r.textEs}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 max-w-3xl mx-auto text-center p-6 rounded-2xl bg-slate-900 text-white">
                  <p className="text-sm sm:text-base leading-relaxed mb-4">
                    {lang === 'en'
                      ? 'Start with a free 20-minute diagnostic session: tell me your module, your exam date and where you get stuck, and I will propose a plan.'
                      : 'Empieza con una sesión diagnóstica gratuita de 20 minutos: me cuentas tu módulo, tu fecha de examen y dónde te atascas, y te propongo un plan.'}
                  </p>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Book a free diagnostic session' : 'Reservar sesión diagnóstica gratis'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 3. Linked Finale at the End of Landing: Mentor Profile Followed by Proprietary PIAD Method */}
            <section id="mentor-and-method" className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* 3A. Profile Presentation: First presents Daniel Santander */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative">
                      <img
                        src="./profile.jpg"
                        alt="Daniel Santander"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-md">
                        M.Sc. Geophysics
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                      {lang === 'en' ? 'Academic Pedigree & Research Grounding' : 'Trayectoria Académica e Investigación'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Daniel Santander Urrutia
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-600">
                      Engineering Geophysics (Universidad de Chile) • Double European M.Sc. (CAU Kiel, Germany &amp; AMU Poznań, Poland)
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Combining high-impact territorial environmental science, hydrogeophysical catchment modeling, and digital twins with over 500 hours of 1-on-1 higher STEM mentorship in Germany.'
                        : 'Combinando ciencia ambiental territorial, modelación hidrogeofísica de cuencas y gemelos digitales con más de 500 horas de mentoría universitaria de alto rendimiento en Alemania.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigateTo('mentor')}
                        className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer"
                      >
                        {lang === 'en' ? 'Read Full Academic Dossier →' : 'Ver Dossier Académico Completo →'}
                      </button>
                      <button
                        onClick={() => navigateTo('contact')}
                        className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Contact (+49 176 7649 7440)' : 'Contacto (+49 176 7649 7440)'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3B. Direct Link to PIAD Method: Then presents the PIAD method developed by Daniel */}
                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Pedagogical Framework by Daniel Santander' : 'Metodología Pedagógica Desarrollada por Daniel'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                        {lang === 'en'
                          ? 'The PIAD Method™: Productive STEM & AI Inquiry'
                          : 'El Método PIAD™: STEM Productivo & Aprendizaje con IA'}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
                        {lang === 'en'
                          ? 'Students will use AI daily. PIAD turns it into a productive catalyst: exploring deeply, designing scientific code, democratizing programming tools, and conquering complex math and physics through hands-on inquiry.'
                          : 'Sabemos que los estudiantes usarán la IA sí o sí. El Método PIAD™ la canaliza productivamente: para explorar, diseñar código propio, democratizar las herramientas de programación y acercar dificultades complejas mediante ejercicios que profundizan el aprendizaje.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => navigateTo('piad')}
                          className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-indigo-500/30 cursor-pointer"
                        >
                          <Compass className="w-4 h-4" />
                          <span>{lang === 'en' ? 'Explore the 5-Step PIAD Manifesto →' : 'Conocer el Manifiesto PIAD en 5 Fases →'}</span>
                        </button>
                        <button
                          onClick={() => openLabProblem('newtonian')}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Atom className="w-4 h-4 text-sky-400" />
                          <span>{lang === 'en' ? 'Test in Physics Sandbox' : 'Probar en el Simulador Físico'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 font-mono text-xs">
                      <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold block">
                        {lang === 'en' ? 'The PIAD 5-Step DNA' : 'El Ciclo PIAD en 5 Fases'}
                      </span>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">1</span>
                          <span>{lang === 'en' ? 'Direct Observation & Intuition' : 'Observación Directa e Intuición'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">2</span>
                          <span>{lang === 'en' ? 'Questioning Prior Consensus & Dogmas' : 'Cuestionar Consensos y Dogmas Previos'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">3</span>
                          <span>{lang === 'en' ? 'Highlighting the Essential Core (Occam)' : 'Relevar lo Esencial de un Problema'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">4</span>
                          <span>{lang === 'en' ? 'Empirical Laboratory Verification' : 'Verificación y Laboratorio Empírico'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[10px]">5</span>
                          <span>{lang === 'en' ? 'Open Knowledge Artifact & Code' : 'Artefacto de Conocimiento Abierto'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 1.5: INTERACTIVE CLASSICAL PHYSICS & CALCULUS LAB    */}
        {/* ========================================================= */}
        {currentPage === 'lab' && (
          <PhysicsLab
            lang={lang}
            initialProblemId={activeLabProblemId}
            onOpenBooking={handleOpenBooking}
            onNavigate={navigateTo}
            courses={ACADEMIC_COURSES}
          />
        )}

        {/* ========================================================= */}
        {/* PAGE 2: FULL COURSE CATALOG & TACTICAL SPRINT PREVIEW     */}
        {/* ========================================================= */}
        {currentPage === 'courses' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Breadcrumb & Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                  <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slate-900 font-bold">Course Catalog</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {lang === 'en' ? 'Official Course Catalog & University Exam Modules' : 'Catálogo Curricular Oficial de Materias'}
                </h1>
                <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
                  {lang === 'en'
                    ? 'Every course is synchronized with university lecture notes and official examiner grading rubrics.'
                    : 'Cada asignatura está sincronizada con los apuntes universitarios y los criterios oficiales de corrección.'}
                </p>
              </div>

              {/* Punto 4: CONCRETE DELIVERABLES SECTION */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-md">
                <div className="max-w-3xl mb-6">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                    {lang === 'en' ? 'Tangible Session Deliverables' : 'Entregables Concretos de Cada Sesión'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {lang === 'en' ? 'What You Take Away After Every Single Class' : 'Lo Que Te Llevas Puesto al Terminar Cada Clase'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Vector PDF (Miro Export)' : 'PDF Vectorial (Export Miro)'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Complete step-by-step mathematical derivations exported in crisp 4K vector format with color-coded algebraic stages.'
                        : 'Demostraciones matemáticas paso a paso exportadas en formato vectorial 4K nítido con fases algebraicas en color.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                      <BookmarkCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Formula Cheat-Sheets' : 'Formularios Resumen'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Condensed 1-page formula summaries and conversion rules formatted specifically for quick review before exams.'
                        : 'Resúmenes condensados de fórmulas y reglas de cálculo en 1 página, optimizados para repasar antes del examen.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Python Verification Code' : 'Código Python de Verificación'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Executable NumPy/SciPy script confirming numerical roots, matrix eigenvalues, or ODE stability whenever applicable.'
                        : 'Scripts ejecutables en NumPy/SciPy que verifican raíces numéricas, autovalores matriciales o estabilidad de EDOs.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'Async WhatsApp Q&A' : 'Dudas por WhatsApp'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Send photos of exercise bottlenecks directly on WhatsApp/Telegram; get fast voice-note or audio guidance between sessions.'
                        : 'Envía fotos de tus dudas directamente por WhatsApp y recibe orientación rápida por audio o notas entre sesiones.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">
                      {lang === 'en' ? 'PIAD Critical AI Framework' : 'Criterio PIAD & IA Crítica'}
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {lang === 'en'
                        ? 'Prompts, scientific code scaffolding (Python/NumPy), and first-principles heuristics to harness AI productively and democratize analytical tools.'
                        : 'Prompts estructurados, diseño de código científico (Python/NumPy) y heurísticas para usar la IA de modo productivo y democratizar tus herramientas de análisis.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Punto 5: 3-STEP ROADMAP & SPONTANEOUS SESSION MODUS */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                      {lang === 'en' ? 'Fast-Track Execution Roadmap' : 'Hoja de Ruta Rápida en 3 Pasos'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {lang === 'en' ? 'How We Prepare Your Examination' : 'Cómo Preparamos tu Examen'}
                    </h3>
                    
                    <div className="space-y-3 pt-2 text-xs text-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">1</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? 'Send Your Syllabus & Problem Sets' : 'Envía tus apuntes y exámenes anteriores'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? "Upload your professor's lecture notes and target past exam papers."
                              : 'Comparte las guías de ejercicios, temarios y exámenes pasados de tu cátedra.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">2</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? '20-Min Free Strategy Call' : 'Llamada estratégica gratis (20 min)'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? 'We isolate your 3 primary conceptual bottlenecks and score traps.'
                              : 'Identificamos tus 3 bloqueos conceptuales principales y dónde pierdes puntos.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">3</span>
                        <div>
                          <strong className="text-slate-900 block">
                            {lang === 'en' ? 'Intensive Sprint or Spontaneous Drill' : 'Sprint intensivo o clase puntual'}
                          </strong>
                          <span className="text-slate-500">
                            {lang === 'en'
                              ? 'Lock in your schedule slots (Online worldwide or in-person in Hannover).'
                              : 'Fijamos tus sesiones en el calendario (Online en todo el mundo o presencial en Hannover).'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold uppercase">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'en' ? 'Urgent / Spontaneous Classes' : 'Clases Espontáneas e Inmediatas'}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {lang === 'en' ? 'Need an Emergency 1-on-1 Session This Week?' : '¿Necesitas una Clase Individual Urgente Esta Semana?'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {lang === 'en'
                        ? 'Available for high-urgency exercise problem sheets or last-minute university exam drills. Choose between online interactive whiteboarding or in-person coaching in Hannover.'
                        : 'Disponible para resolver guías de ejercicios urgentes o dudas de último minuto antes del examen. Modalidad online interactiva o presencial en Hannover.'}
                    </p>
                    <button
                      onClick={() => handleOpenBooking(null, true)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      {lang === 'en' ? 'Request Spontaneous Session →' : 'Pedir Clase Espontánea →'}
                    </button>
                  </div>

                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 pb-6 mb-8 border-b border-slate-200">
                {[
                  { id: 'all', labelEn: 'All Courses (6)', labelEs: 'Todas las Materias (6)' },
                  { id: 'bachelor', labelEn: 'Bachelor & Engineering Exams', labelEs: 'Grado Universitario e Ingeniería' },
                  { id: 'master', labelEn: 'Master & Geophysics', labelEs: 'Máster & Geofísica' },
                  { id: 'ib', labelEn: 'IB Diploma HL', labelEs: 'Bachillerato IB' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCourseFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      courseFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {lang === 'en' ? tab.labelEn : tab.labelEs}
                  </button>
                ))}
              </div>

              {/* Grid of Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-md transition-all"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={course.image} 
                        alt={course.titleEn} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 left-3">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs">
                          {course.code}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-semibold shadow-xs">
                          {lang === 'en' ? course.badgeEn : course.badgeEs}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                          {lang === 'en' ? course.titleEn : course.titleEs}
                        </h3>

                        <p className="font-mono text-[11px] text-slate-500 mb-3">
                          {lang === 'en' ? course.facultyEn : course.facultyEs}
                        </p>

                        <p className="text-xs text-slate-600 leading-relaxed mb-5 pb-4 border-b border-slate-100">
                          {lang === 'en' ? course.targetEn : course.targetEs}
                        </p>

                        <div className="mb-5 flex items-baseline justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-mono font-bold text-slate-900">€{course.rateHourly}</span>
                              <span className="text-xs font-mono text-slate-500">/ hour</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 block">
                              {lang === 'en' ? '1-on-1 Individual Session' : 'Sesión Individual 1-a-1'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-700 block">
                              €{course.packagePrice} / {course.packageHours}h Pack
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {lang === 'en' ? 'Exam Sprint Pack' : 'Pack Sprint de Examen'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                            {lang === 'en' ? 'Core Syllabus & University Exam Drills:' : 'Temario Clave y Exámenes:'}
                          </span>
                          <ul className="space-y-2 text-xs text-slate-700">
                            {(lang === 'en' ? course.syllabusEn : course.syllabusEs).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-6 pt-3 border-t border-slate-100">
                          <span className="font-mono text-[10px] text-slate-500 block mb-1.5 font-semibold">
                            {lang === 'en' ? 'Course Key Concepts:' : 'Conceptos Clave del Curso:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {course.skriptKeywords.map((kw, i) => (
                              <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <button
                          onClick={() => openLabProblem(COURSE_LAB_MAPPING[course.id] || 'newtonian')}
                          className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <Compass className="w-3.5 h-3.5 text-sky-600" />
                          <span>{lang === 'en' ? 'Open Subject Mini-Lab (DCL) →' : 'Ver Mini-Lab de esta Materia (DCL) →'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenBooking(course)}
                          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>{lang === 'en' ? 'Enroll / Request Diagnostic' : 'Inscribirse / Solicitar Diagnóstico'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 3: FOUNDATIONAL STEM LIBRARY (THE CLASSICS)          */}
        {/* ========================================================= */}
        {currentPage === 'library' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
                <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">STEM Library</span>
              </div>

              {/* Library Banner with Unsplash imagery */}
              <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 text-white shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80" 
                  alt="Academic Library" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25" 
                />
                <div className="relative z-10 p-8 sm:p-14 max-w-3xl">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold block mb-2">
                    {lang === 'en' ? 'Core Literature & Classical Foundations' : 'Literatura Fundamental & Fuentes Clásicas'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {lang === 'en' ? 'The Foundational STEM Library' : 'Biblioteca de Clásicos STEM'}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Every concept taught in our sessions is anchored directly in the great historical treatises of mathematics, classical mechanics, continuum geophysics, and numerical analysis.'
                      : 'Cada demostración y concepto impartido en nuestras sesiones se fundamenta directamente en los grandes tratados de la física matemática, la mecánica de medios continuos y el cálculo diferencial.'}
                  </p>
                </div>
              </div>

              {/* Grid of Foundational Books */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FOUNDATIONAL_BOOKS.map((book) => (
                  <div 
                    key={book.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-md transition-all"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={book.image} 
                        alt={book.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 backdrop-blur-xs font-bold">
                          {book.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 mb-2">
                          {book.authors}
                        </p>
                        <p className="text-[11px] font-mono text-sky-700 font-semibold mb-3">
                          {lang === 'en' ? book.subjectEn : book.subjectEs}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {lang === 'en' ? book.descriptionEn : book.descriptionEs}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">
                          {book.edition}
                        </span>
                        <div className="flex gap-1">
                          {book.usedIn.map((m, i) => (
                            <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}



        {/* ========================================================= */}
        {/* PAGE 3: PRECIOS (UNIFIED TUITION CALCULATOR & MENTOR DOSSIER) */}
        {/* ========================================================= */}
        {currentPage === 'precios' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">{lang === 'en' ? 'Pricing & Mentor Dossier' : 'Precios & Dossier del Mentor'}</span>
              </div>

              {/* Page Header */}
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  Transparent Tuition &amp; Academic Credentials
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {lang === 'en' ? 'Transparent Rates & Mentor Dossier' : 'Precios Transparentes & Perfil del Mentor'}
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto font-sans leading-relaxed">
                  {lang === 'en'
                    ? 'Calculate your customized investment, explore fixed intensive exam sprint bundles, and inspect Daniel Santander’s verified engineering and geophysics background.'
                    : 'Calcula tu inversión a medida, explora los planes de sprint intensivo para exámenes universitarios y conoce la formación y metodología de Daniel Santander.'}
                </p>
              </div>

              {/* --- SECTION 1: INTERACTIVE RATE CALCULATOR --- */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          {lang === 'en' ? 'Academic Level / Study Track' : 'Nivel Académico / Plan de Estudio'}
                        </label>
                        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                          {[
                            { id: 'ib', labelEn: 'IB Diploma', labelEs: 'Bachillerato IB' },
                            { id: 'bachelor', labelEn: 'Bachelor', labelEs: 'Grado Univ.' },
                            { id: 'master', labelEn: 'Master & Thesis', labelEs: 'Máster & Tesis' }
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              onClick={() => setCalcLevel(lvl.id)}
                              className={`py-2 px-3 rounded-lg border transition-all ${
                                calcLevel === lvl.id
                                  ? 'bg-slate-900 border-slate-900 text-white font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {lang === 'en' ? lvl.labelEn : lvl.labelEs}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 font-mono text-xs">
                          <span className="text-slate-500 uppercase font-semibold">
                            {lang === 'en' ? 'Mentorship Volume' : 'Horas de Mentoría'}
                          </span>
                          <span className="text-sky-800 font-bold text-lg">
                            {calcHours} {lang === 'en' ? 'hours' : 'horas'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="20"
                          step="1"
                          value={calcHours}
                          onChange={(e) => setCalcHours(parseInt(e.target.value, 10))}
                          className="w-full accent-sky-700 bg-slate-200 rounded-lg cursor-pointer h-2"
                        />
                        <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-1">
                          <span>{lang === 'en' ? '2h (Urgent drill)' : '2h (Repaso urgente)'}</span>
                          <span>{lang === 'en' ? '8h (Exam sprint)' : '8h (Sprint de examen)'}</span>
                          <span>{lang === 'en' ? '20h (Continuous prep)' : '20h (Acompañamiento continuo)'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          {lang === 'en' ? 'Delivery Format' : 'Modalidad de Clase'}
                        </label>
                        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                          <button
                            onClick={() => setCalcFormat('1on1')}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              calcFormat === '1on1'
                                ? 'bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="font-bold text-slate-900">
                              {lang === 'en' ? '1-on-1 Individual' : 'Individual 1-a-1'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {lang === 'en' ? 'Online & In-Person in Hannover' : 'Online y presencial en Hannover'}
                            </div>
                          </button>

                          <button
                            onClick={() => setCalcFormat('group')}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              calcFormat === 'group'
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="font-bold text-emerald-800">
                              {lang === 'en' ? 'Study Group (Max 3)' : 'Grupo de Estudio (Máx 3)'}
                            </div>
                            <div className="text-[11px] text-emerald-700">
                              {lang === 'en' ? '-30% discount per student' : '-30% descuento por alumno'}
                            </div>
                          </button>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-mono">
                        <input
                          type="checkbox"
                          checked={calcSprintDiscount}
                          onChange={(e) => setCalcSprintDiscount(e.target.checked)}
                          className="rounded border-slate-300 text-sky-700 focus:ring-sky-600"
                        />
                        <span className="text-slate-700 font-semibold">
                          {lang === 'en'
                            ? 'Apply 4-Week Exam Sprint Bundle (-15% discount)'
                            : 'Aplicar Paquete Sprint de Exámenes (-15% de descuento)'}
                        </span>
                      </label>

                    </div>

                    <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                          {lang === 'en' ? 'Estimated Investment' : 'Inversión Estimada'}
                        </span>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-mono font-extrabold text-white">€{totalCost}</span>
                          <span className="text-xs font-mono text-slate-400">{lang === 'en' ? 'total' : 'total'}</span>
                        </div>

                        <div className="text-xs font-mono text-slate-300 pb-4 mb-4 border-b border-slate-800">
                          <span>{lang === 'en' ? 'Effective Rate: ' : 'Tarifa Efectiva: '}<strong className="text-emerald-400">€{effectiveRate}/hr</strong></span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-300 font-mono mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Miro Whiteboard Vector PDF Export' : 'Exportación en PDF Vectorial (Pizarra Miro)'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Step-by-step Exam Problem Solutions' : 'Resolución Paso a Paso de Exámenes Anteriores'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Structured Formula Sheets & Exam Summaries' : 'Formularios Estructurados y Resúmenes de Examen'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lang === 'en' ? 'Direct Async WhatsApp Q&A Access' : 'Consultas Asíncronas Directas por WhatsApp'}</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleOpenBooking({ code: 'CALC', titleEn: `${calcLevel.toUpperCase()} - ${calcHours}h Plan` })}
                        className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{lang === 'en' ? 'Claim This Study Plan' : 'Elegir este Plan de Estudio'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* SECTION 2: MENTOR DOSSIER & VERIFIED CREDENTIALS */}
              <div id="mentor-dossier" className="pt-8 border-t border-slate-200">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                    {lang === 'en' ? 'Academic Background & Methodology' : 'Trayectoria Académica & Metodología'}
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {lang === 'en' ? 'Meet Your Mentor: Daniel Santander' : 'Conoce al Mentor: Daniel Santander'}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    {lang === 'en' ? 'Geophysicist & Double Master of Science Engineer based in Germany.' : 'Geofísico e Ingeniero Doble Máster radicado en Alemania.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Photo & University Verified Credentials (5 cols) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src="./profile.jpg"
                        alt="Daniel Santander"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Daniel Santander Urrutia</h3>
                        <p className="text-xs font-mono text-sky-700 font-semibold">
                          {lang === 'en' ? 'Geophysicist & Double M.Sc. Engineer' : 'Geofísico e Ingeniero Doble M.Sc.'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {lang === 'en' ? 'Hannover, Germany • Online Worldwide' : 'Hannover, Alemania • Online en todo el mundo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Formal University Degrees Box */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>{lang === 'en' ? 'Germany (CAU Kiel)' : 'Alemania (CAU Kiel)'}</span>
                          <span>{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">M.Sc. Environmental Management</span>
                        <span className="text-slate-500 text-[11px]">Christian-Albrechts-Universität zu Kiel</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>{lang === 'en' ? 'Poland (AMU Poznań)' : 'Polonia (AMU Poznań)'}</span>
                          <span>{lang === 'en' ? 'Double Master Degree' : 'Doble Grado de Máster'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">M.Sc. Integrated Catchment Management</span>
                        <span className="text-slate-500 text-[11px]">Adam Mickiewicz University</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>{lang === 'en' ? 'Chile (FCFM)' : 'Chile (FCFM)'}</span>
                          <span>{lang === 'en' ? 'Engineering Degree' : 'Título de Ingeniero'}</span>
                        </div>
                        <span className="text-slate-900 font-bold block">Engineering Geophysics (Geofísica)</span>
                        <span className="text-slate-500 text-[11px]">Universidad de Chile (Facultad de Cs. Físicas y Matemáticas)</span>
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="pt-2 space-y-2">
                      <a
                        href="https://wa.me/4917676497440"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp: +49 176 7649 7440</span>
                      </a>

                      <a
                        href="https://danisantanderurrutia-coder.github.io/portafolio/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Interactive Web Portfolio' : 'Portafolio Web Interactivo'}</span>
                        <ExternalLink className="w-3 h-3 opacity-75 ml-0.5" />
                      </a>

                      <a
                        href="https://github.com/danisantanderurrutia-coder/portafolio"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? "Daniel's GitHub Portfolio" : 'Portafolio GitHub de Daniel'}</span>
                      </a>
                    </div>

                  </div>

                  {/* Pedagogical Methodology & Experience (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                      <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                        {lang === 'en' ? 'The Mentorship Method' : 'El Método de Mentoría'}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {lang === 'en'
                          ? 'Rigorous physics intuition, exam-focused scoring, and zero linguistic friction.'
                          : 'Intuición física rigurosa, resolución enfocada al examen y cero fricción lingüística.'}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        {lang === 'en'
                          ? 'Most university students do not fail exams due to a lack of talent. They fail because university lectures present proofs as abstract formalisms without grounding the physical meaning, while professors demand precise, step-by-step justification to award partial points.'
                          : 'La mayoría de los estudiantes universitarios no reprueban por falta de talento. Se atascan cuando las clases presentan las demostraciones como formalismos abstractos sin explicar el sentido físico, mientras que en los exámenes se exige una justificación rigurosa paso a paso para otorgar puntos parciales.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center mb-3">01</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'Physical Intuition First' : 'Intuición Física Primero'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Visualizing the physical phenomenon before writing down differential equations.'
                            : 'Visualizar el fenómeno físico antes de escribir la ecuación diferencial.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center mb-3">02</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'University Exam Rubrics' : 'Criterios de Examen Universitario'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Structuring solutions step-by-step to earn every available partial point.'
                            : 'Estructura de respuesta para maximizar puntos parciales en cada pregunta.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center justify-center mb-3">03</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {lang === 'en' ? 'Classes in English or Spanish' : 'Clases en Español o Inglés'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en'
                            ? 'Zero language fatigue, working directly with your lecture notes and exam problem sheets.'
                            : 'Cero fatiga lingüística, trabajando con tus apuntes y exámenes anteriores oficiales.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'en' ? 'Want to review your syllabus with Daniel?' : '¿Quieres revisar tu temario con Daniel?'}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {lang === 'en' ? 'Book a free 20-minute diagnostic session with no obligation.' : 'Agenda una llamada diagnóstica de 20 minutos sin compromiso.'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenBooking()}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        {lang === 'en' ? 'Book Diagnostic Call →' : 'Reservar Diagnóstico →'}
                      </button>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 6: DIRECT CONTACT & PERSONAL CHANNELS                */}
        {/* ========================================================= */}
        {currentPage === 'contact' && (
          <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
                <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">Contact</span>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  {lang === 'en' ? 'Direct Communication Channels' : 'Canales de Comunicación Directa'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {lang === 'en' ? 'Get in Direct Touch with Daniel' : 'Contacta Directamente con Daniel'}
                </h1>
                <p className="text-slate-600 text-sm">
                  {lang === 'en'
                    ? 'Write directly via WhatsApp, send an email, or schedule your 20-minute diagnostic session.'
                    : 'Escribe directamente por WhatsApp, envía un correo o agenda tu sesión diagnóstica de 20 minutos.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                
                {/* WhatsApp & Phone */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'Phone & WhatsApp' : 'Teléfono & WhatsApp'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      +49 176 7649 7440
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? 'Direct WhatsApp messaging for fast inquiries, exercise photos, and appointment scheduling.'
                        : 'Mensajería directa por WhatsApp para consultas rápidas, fotos de ejercicios y coordinación de horarios.'}
                    </p>
                  </div>
                  <a
                    href="https://wa.me/4917676497440"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    {lang === 'en' ? 'Open WhatsApp Chat →' : 'Abrir Chat de WhatsApp →'}
                  </a>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'Direct Email' : 'Correo Electrónico'}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-slate-900 mb-1 break-all">
                      danisantander.urrutia@gmail.com
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? 'Send syllabi PDFs, exercise problem sets, and general inquiries. Reply guaranteed within 12 hours.'
                        : 'Envía PDFs de temarios, guías de ejercicios y consultas generales. Respuesta garantizada en menos de 12 horas.'}
                    </p>
                  </div>
                  <a
                    href="mailto:danisantander.urrutia@gmail.com?subject=STEM%20Mentorship%20Inquiry"
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    {lang === 'en' ? 'Send Email →' : 'Enviar Correo →'}
                  </a>
                </div>

                {/* GitHub Portfolio */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {lang === 'en' ? 'GitHub Repositories' : 'Repositorios GitHub'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      @danisantanderurrutia-coder
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      {lang === 'en'
                        ? "Explore Daniel's open-source repositories, geophysics scripts, digital twin tools, and web applications."
                        : 'Explora los repositorios de código abierto de Daniel, scripts de geofísica, gemelos digitales y aplicaciones web.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="https://danisantanderurrutia-coder.github.io/portafolio/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open Web Portfolio →' : 'Abrir Portafolio Web →'}</span>
                    </a>
                    <a
                      href="https://github.com/danisantanderurrutia-coder/portafolio"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'GitHub Repositories' : 'Repositorios GitHub'}</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* In-Person Hannover Location Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'en' ? 'In-Person Mentorship in Hannover' : 'Mentoría Presencial en Hannover'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {lang === 'en' ? 'Are you studying in Hannover or Niedersachsen?' : '¿Estudias en Hannover o en la región?'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl font-sans leading-relaxed">
                    {lang === 'en'
                      ? 'In-person sessions take place in university library study rooms (such as the TIB - Leibniz Information Centre for Science and Technology at Leibniz Universität Hannover) or quiet learning centers.'
                      : 'Las sesiones presenciales se coordinan en salas de estudio de bibliotecas universitarias (como la TIB de la Leibniz Universität Hannover) o espacios de estudio tranquilos.'}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBooking(null, false)}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap"
                >
                  {lang === 'en' ? 'Schedule Hannover Session →' : 'Agendar Sesión en Hannover →'}
                </button>
              </div>

              {/* Frequently Asked Questions (FAQ) Embedded in Contact */}
              <div id="faq-section" className="mt-16 pt-12 border-t border-slate-200">
                <div className="text-center mb-10">
                  <span className="text-xs font-mono text-sky-800 uppercase tracking-widest block mb-2 font-bold">
                    {lang === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {lang === 'en' ? 'University Exams & Session Logistics' : 'Logística de Exámenes Universitarios y Metodología'}
                  </h2>
                  <p className="text-slate-600 text-sm max-w-2xl mx-auto font-sans">
                    {lang === 'en'
                      ? 'Clear answers regarding university exams, in-person sessions in Hannover, digital tools, and scheduling.'
                      : 'Respuestas claras sobre exámenes universitarios, clases presenciales en Hannover, herramientas digitales y reservas.'}
                  </p>
                </div>

                <div className="space-y-3 max-w-4xl mx-auto">
                  {[
                    {
                      qEn: "Can sessions be conducted 100% in English or 100% in Spanish?",
                      qEs: "¿Se pueden impartir las clases 100% en español o 100% en inglés?",
                      aEn: "Yes. All sessions are taught completely in English or in Spanish according to your preference, allowing you to master complex physical and mathematical intuition without language fatigue. We work directly with your university lecture notes, exercise problem sets, and past exams.",
                      aEs: "Sí. Todas las clases se imparten completamente en español o en inglés según tu preferencia, para que te concentres en comprender la intuición física y matemática sin fatiga lingüística. Trabajamos directamente con los apuntes, guías de ejercicios y exámenes oficiales de tu universidad."
                    },
                    {
                      qEn: "Can we focus directly on past exams and exercise problem sets?",
                      qEs: "¿Podemos enfocarnos directamente en resolver exámenes anteriores y guías de ejercicios?",
                      aEn: "Yes, absolutely. Solving official past exams from your university is the single highest-yield strategy to pass. We dissect actual exam problems step-by-step, identifying grading rubrics, common traps, and time-saving derivation methods.",
                      aEs: "Sí, totalmente. Resolver exámenes oficiales anteriores de tu universidad es la estrategia más eficaz para aprobar. Desglosamos problemas de examen reales paso a paso, identificando los criterios de corrección, trampas frecuentes y métodos directos de resolución."
                    },
                    {
                      qEn: "Can classes be taken in-person in Hannover?",
                      qEs: "¿Se pueden tomar clases presenciales en Hannover?",
                      aEn: "Yes. In-person 1-on-1 sessions are available in Hannover for local students (e.g. from Leibniz Universität Hannover / LUH or nearby universities), coordinated in university library study rooms (such as TIB) or quiet learning spaces.",
                      aEs: "Sí. Ofrezco sesiones presenciales individuales en Hannover para estudiantes locales (ej. de la Leibniz Universität Hannover / LUH o alrededores), coordinadas en salas de estudio de bibliotecas universitarias (como la TIB) o espacios de estudio tranquilos."
                    },
                    {
                      qEn: "How does the 20-minute diagnostic session work?",
                      qEs: "¿En qué consiste la sesión diagnóstica inicial de 20 minutos?",
                      aEn: "We connect via Zoom or Google Meet, review your module syllabus, inspect past exams from your university, identify where you are losing points, and design a concrete schedule to ensure you pass.",
                      aEs: "Nos conectamos por Zoom o Google Meet, revisamos el temario de tu asignatura, examinamos exámenes anteriores, identificamos tus puntos débiles y diseñamos un plan estructurado para asegurar tu aprobado."
                    },
                    {
                      qEn: "What digital equipment and software are used in remote sessions?",
                      qEs: "¿Qué herramientas digitales y equipos utilizas en las clases online?",
                      aEn: "Sessions are conducted on high-resolution Miro interactive whiteboards with an Apple Pencil. We execute live scientific Python code when relevant and export high-resolution vector PDFs of every calculation right after the call.",
                      aEs: "Utilizamos pizarras interactivas Miro en alta resolución combinadas con Apple Pencil. Ejecutamos código Python en vivo cuando la materia lo requiere y enviamos un PDF vectorial de todas las demostraciones al terminar la sesión."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 text-sm">
                          {lang === 'en' ? faq.qEn : faq.qEs}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-sky-700 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-sans">
                          {lang === 'en' ? faq.aEn : faq.aEs}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 7: PIAD METHOD™ MANIFESTO & OPEN INQUIRY PEDAGOGY     */}
        {/* ========================================================= */}
        {currentPage === 'piad' && (
          <PIADMethod
            lang={lang}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
          />
        )}

      </main>

      {/* --- FOOTER (ACROSS ALL PAGES) --- */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('landing')} className="font-bold text-slate-900 hover:text-sky-700">[Φ] DANIEL SANTANDER</button>
            <span>•</span>
            <span>Geophysicist &amp; Double M.Sc.</span>
            <span>•</span>
            <a href="tel:+4917676497440" className="hover:text-emerald-700">+49 176 7649 7440</a>
          </div>
          <p>© 2026 Daniel Santander • {lang === 'en' ? 'Taught under the PIAD Method™ Framework (Open & Digital Inquiry)' : 'Enseñanza bajo el marco del Método PIAD™ (Indagación Abierta y Digital)'} • {lang === 'en' ? 'Hannover & Online Worldwide' : 'Hannover y Online en todo el mundo'}</p>
        </div>
      </footer>

      {/* --- MODAL: BOOKING & DIAGNOSTIC REQUEST (PROGRAMMED TO EMAIL DANISANTANDER.URRUTIA@GMAIL.COM) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

          <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!modalSubmitted ? (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                    {bookingData.sessionType} • Direct to Daniel Santander
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {bookingData.sessionType.includes('Spontaneous') 
                      ? (lang === 'en' ? 'Request a Spontaneous 1-on-1 Class' : 'Solicitar Clase Espontánea Urgente')
                      : (lang === 'en' ? 'Schedule University Exam Strategy Session' : 'Agendar Sesión de Estrategia para Examen')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'en'
                      ? 'Submitting generates an immediate notification to danisantander.urrutia@gmail.com and WhatsApp.'
                      : 'Al enviar se generará una notificación inmediata a danisantander.urrutia@gmail.com y por WhatsApp.'}
                  </p>
                </div>

                {modalCourse && (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-sky-300 text-xs font-mono text-sky-900">
                    {lang === 'en' ? 'Selected Subject:' : 'Materia Seleccionada:'} <strong>{modalCourse.code} — {lang === 'en' ? modalCourse.titleEn : modalCourse.titleEs}</strong>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 font-mono text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Full Name *' : 'Nombre Completo *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      placeholder={lang === 'en' ? 'e.g. Mateo Becker' : 'ej. Mateo Becker'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">
                        {lang === 'en' ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="student@university.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">
                        {lang === 'en' ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        placeholder="+49 176..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'University / School *' : 'Universidad o Colegio *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.university}
                      onChange={(e) => setBookingData({ ...bookingData, university: e.target.value })}
                      placeholder={lang === 'en' ? 'e.g. LUH Hannover, TUM, RWTH, TU Berlin' : 'ej. LUH Hannover, TUM, RWTH, TU Berlin'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  {/* Delivery Location Preference */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Format & Location Preference' : 'Preferencia de Formato y Ubicación'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, deliveryMode: 'Online 1-on-1' })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          bookingData.deliveryMode.includes('Online')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        🌐 {lang === 'en' ? 'Online (Miro + Stylus)' : 'Online (Miro + Stylus)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, deliveryMode: 'In-Person (Hannover)' })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          bookingData.deliveryMode.includes('Hannover')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        📍 {lang === 'en' ? 'In-Person (Hannover)' : 'Presencial (Hannover)'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Class Language' : 'Idioma de la Clase'}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: 'English', labelEn: 'English', labelEs: 'Inglés' },
                        { id: 'Español', labelEn: 'Spanish', labelEs: 'Español' },
                        { id: 'Mixed', labelEn: 'Mixed (EN/ES)', labelEs: 'Mixto (ES/EN)' }
                      ].map((lng) => (
                        <button
                          key={lng.id}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, languagePref: lng.id })}
                          className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                            bookingData.languagePref === lng.id
                              ? 'bg-slate-900 border-slate-900 text-white font-bold'
                              : 'bg-slate-50 border-slate-300 text-slate-600'
                          }`}
                        >
                          {lang === 'en' ? lng.labelEn : lng.labelEs}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">
                      {lang === 'en' ? 'Bottleneck / Urgent Topic / Target Date' : 'Dificultad Principal / Tema Urgente / Fecha de Examen'}
                    </label>
                    <textarea
                      rows={2}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      placeholder={
                        lang === 'en'
                          ? "e.g. Exam in 4 weeks, need help with line integrals and Green's theorem proofs..."
                          : 'ej. Examen en 4 semanas, necesito ayuda con integrales de línea y teorema de Green...'
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-sans text-xs focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'en' ? 'Send Request to danisantander.urrutia@gmail.com →' : 'Enviar Solicitud a danisantander.urrutia@gmail.com →'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 font-mono">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-800">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'en' ? 'Email Draft Generated & Prepared!' : '¡Borrador de Correo Generado y Listo!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-sans">
                  {lang === 'en'
                    ? 'Your request has been formulated to danisantander.urrutia@gmail.com. If your email client did not open automatically, click below:'
                    : 'Tu solicitud ha sido formulada para danisantander.urrutia@gmail.com. Si tu cliente de correo no se abrió automáticamente, haz clic abajo:'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  {lastMailtoUrl && (
                    <a
                      href={lastMailtoUrl}
                      className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open in Mail Client' : 'Abrir en Cliente de Correo'}</span>
                    </a>
                  )}

                  <a
                    href={`https://wa.me/4917676497440?text=${encodeURIComponent(`Hi Daniel! I just booked a session for ${bookingData.courseCode || 'Open Knowledge & Science Mentorship'}. My name is ${bookingData.name}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Send on WhatsApp' : 'Enviar por WhatsApp'}</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer"
                  >
                    {lang === 'en' ? 'Close Window' : 'Cerrar Ventana'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
