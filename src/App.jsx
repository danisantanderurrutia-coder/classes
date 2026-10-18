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
    titleEn: "Höhere Mathematik I, II & III (Calculus & Analysis for Engineers)",
    titleEs: "Höhere Mathematik I, II y III (Cálculo y Análisis para Ingenieros)",
    facultyEn: "Faculty of Mathematics & Mechanical Engineering (TU9 Standards)",
    facultyEs: "Facultad de Matemáticas e Ingeniería Mecánica (Estándar TU9)",
    targetEn: "International students at TUM, RWTH Aachen, TU Berlin, KIT, Uni Stuttgart facing rigorous Klausur phases.",
    targetEs: "Estudiantes en TUM, RWTH Aachen, TU Berlin, KIT o Uni Stuttgart preparando su fase de exámenes (Klausurphase).",
    rateHourly: 55,
    packagePrice: 390,
    packageHours: 8,
    category: "bachelor",
    syllabusEn: [
      "Multivariable differential calculus & gradient vector fields: ∇f, ∇·F, ∇×F",
      "Integral theorems of vector analysis: Green's, Gauss's (Divergence), and Stokes' theorems",
      "Ordinary Differential Equations (ODEs): Separation of variables, integrating factors, Wronskian",
      "Complex numbers, power series, Taylor expansions, and Cauchy-Riemann conditions",
      "Official German Altklausuren breakdown with examiner partial-point rubrics"
    ],
    syllabusEs: [
      "Cálculo diferencial multivariable y campos vectoriales: gradiente, divergencia y rotacional",
      "Teoremas integrales del análisis vectorial: Green, Gauss (Divergencia) y Stokes",
      "Ecuaciones Diferenciales Ordinarias (EDOs): Separación de variables, Wronskiano, sistemas lineales",
      "Números complejos, series de Taylor, criterios de convergencia y condiciones de Cauchy-Riemann",
      "Resolución exhaustiva de Altklausuren oficiales para asegurar el máximo de puntos parciales"
    ],
    skriptKeywords: ["Zwischenwertsatz", "Rotationskörper", "Satz von Stokes", "Divergenzsatz", "Homogene DGL"],
    badgeEn: "Core TU9 Klausur",
    badgeEs: "Klausur Fundamental",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?auto=format&fit=crop&w=700&q=80",
    color: "#0284C7"
  },
  {
    id: "linear_algebra",
    planetId: "earth",
    code: "LA-102",
    titleEn: "Lineare Algebra & Analytische Geometrie",
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
      "Principal axis transformation (Hauptachsentransformation) and quadratic forms",
      "Jordan canonical form, singular value decomposition (SVD), and orthogonal projections"
    ],
    syllabusEs: [
      "Espacios vectoriales, subespacios, independencia lineal, transformaciones de base y espacio dual",
      "Aplicaciones lineales, teorema de la dimensión (núcleo e imagen) y matrices asociadas",
      "Autovalores, autovectores, polinomio característico y multiplicidades algebraicas/geométricas",
      "Transformación a ejes principales (Hauptachsentransformation) y formas cuadráticas",
      "Forma canónica de Jordan, descomposición en valores singulares (SVD) y proyecciones ortogonales"
    ],
    skriptKeywords: ["Eigenwert", "Kern & Bild", "Hauptachsentransformation", "Jordan-Normalform", "Bilinearform"],
    badgeEn: "Proof Rigor",
    badgeEs: "Demostraciones",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80",
    color: "#4F46E5"
  },
  {
    id: "mechanics",
    planetId: "mercury",
    code: "PHY-201",
    titleEn: "Klassische Mechanik & Analytische Dynamik",
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
    skriptKeywords: ["Trägheitstensor", "Lagrange-Funktion", "Corioliskraft", "Euler-Winkel", "Poisson-Klammern"],
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
    skriptKeywords: ["Wellengleichung", "Tikhonov-Regularisierung", "Bouguer-Anomalie", "Elastizitätstensor", "Laufzeitkurve"],
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
    skriptKeywords: ["Runge-Kutta-Verfahren", "Finite-Differenzen", "Fourier-Transformation", "Stabilität", "NumPy Vectorisierung"],
    badgeEn: "Scientific Code",
    badgeEs: "Código Científico",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80",
    color: "#D97706"
  },
  {
    id: "ib",
    planetId: "earth",
    code: "IB-HL",
    titleEn: "IB Diploma: Mathematics AA HL & Physics HL",
    titleEs: "Bachillerato Internacional: Math AA HL y Física HL",
    facultyEn: "International Baccalaureate High School Senior Cohort",
    facultyEs: "Bachillerato Internacional (Alumnos de Último Año)",
    targetEn: "International School students in Germany & Switzerland aiming for grade 7s.",
    targetEs: "Alumnos de Colegios Internacionales en Alemania y Suiza que buscan obtener la máxima nota (7).",
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
    skriptKeywords: ["Schwarzschild-Metrik", "Christoffel-Symbole", "Geodätengleichung", "Einstein-Feldgleichungen", "Kerr-Lösung"],
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
    descriptionEs: "La base rigurosa europea para Höhere Mathematik: límites estrictos, convergencia uniforme, integrales múltiples, transformaciones de coordenadas y teorema de Stokes.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    tag: "Höhere Mathematik"
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
    textEn: 'Engineer and geophysicist (double M.Sc.) with experience at the level German universities demand.',
    textEs: 'Ingeniero y geofísico (doble M.Sc.) con experiencia en el nivel que piden las universidades alemanas.',
  },
  {
    id: 'intuition',
    icon: Orbit,
    titleEn: 'Intuition first',
    titleEs: 'Intuición primero',
    textEn: 'Every concept is explained with a real phenomenon, and you can test it in the interactive Galileo Lab.',
    textEs: 'Cada concepto se explica con un fenómeno real y lo compruebas en el Galileo Lab interactivo.',
  },
  {
    id: 'altklausur',
    icon: FileCheck,
    titleEn: 'Past-exam preparation',
    titleEs: 'Preparación con Altklausuren',
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

export default function App() {
  const [lang, setLang] = useState('en');
  // Multi-page navigation state: 'landing' | 'courses' | 'library' | 'precios' | 'contact'
  const [currentPage, setCurrentPage] = useState('landing');
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
      } else if (['landing', 'courses', 'library', 'contact'].includes(hash)) {
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
      `[STEM Mentorship] ${bookingData.courseCode || 'Diagnostic Call'} - ${bookingData.name}`
    );
    const bodyText = 
`Hi Daniel,

I am requesting a STEM Mentorship session.

--- STUDENT DETAILS ---
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone / WhatsApp: ${bookingData.phone || 'Not provided'}
University / School: ${bookingData.university}
Selected Course / Module: ${bookingData.courseCode || 'Diagnostic / General STEM'}
Type of Session: ${bookingData.sessionType}
Delivery Mode: ${bookingData.deliveryMode}
Language Preference: ${bookingData.languagePref}
Target Exam Date / Deadline: ${bookingData.targetDate || 'Not specified'}

--- QUESTIONS / BOTTLENECKS ---
${bookingData.notes || 'None provided'}

Sent from Galileo STEM Mentorship Portal`;

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
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Subtle graph paper grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-60" />

      {/* --- STICKY NAVIGATION BAR WITH DISTINCT PAGE ROUTING --- */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Identity & Seal */}
          <button 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3.5 group text-left cursor-pointer shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-mono text-xl font-bold shadow-sm group-hover:border-sky-400 group-hover:text-white transition-all">
              [Φ]
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors block leading-snug">
                DANIEL SANTANDER
              </span>
              <p className="text-[11px] text-sky-400 font-mono font-semibold leading-tight">
                Double M.Sc. &amp; Geophysicist
              </p>
              <p className="text-[10px] text-slate-400 font-mono leading-tight">
                Online &amp; In-Person (Hannover, DE)
              </p>
            </div>
          </button>

          {/* Dedicated Page Tabs (Cursos, Librería, Precios, Contact & FAQ) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono font-semibold shadow-inner">
            <button
              onClick={() => navigateTo('courses')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentPage === 'courses'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{lang === 'en' ? 'Courses' : 'Cursos'}</span>
            </button>

            <button
              onClick={() => navigateTo('library')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentPage === 'library'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Library className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Library' : 'Librería'}</span>
            </button>

            <button
              onClick={() => navigateTo('precios')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentPage === 'precios'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'en' ? 'Pricing & Dossier' : 'Precios & Dossier'}</span>
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentPage === 'contact'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact &amp; FAQ</span>
            </button>
          </nav>

          {/* Language Switcher & Call CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  lang === 'en' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  lang === 'es' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>

            <button
              onClick={() => handleOpenBooking()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 border border-sky-400/40 text-white text-xs font-mono font-bold transition-all flex items-center gap-2.5 shadow-md shadow-sky-600/25 shrink-0 text-left cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sky-200 shrink-0" />
              <span className="leading-tight block text-[11px]">
                {lang === 'en' ? (
                  <>Book Diagnostic<br /><span className="text-sky-200 font-semibold">Call (20 min)</span></>
                ) : (
                  <>Reservar Sesión<br /><span className="text-sky-200 font-semibold">Diagnóstica</span></>
                )}
              </span>
            </button>
          </div>

        </div>
      </header>

      <main className="relative z-10">

        {/* ========================================================= */}
        {/* PAGE 1: ATTRACTIVE LANDING WITH PLANETARY OBSERVATORY     */}
        {/* ========================================================= */}
        {currentPage === 'landing' && (
          <div>
            {/* Landing Hero */}
            <section className="pt-8 pb-16 bg-black border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-4xl mx-auto text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-slate-300 font-mono text-xs mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      {lang === 'en'
                        ? 'DANIEL SANTANDER • GEOPHYSICIST & DOUBLE M.SC. ENGINEER • HANNOVER & ONLINE'
                        : 'DANIEL SANTANDER • GEOFÍSICO E INGENIERO DOBLE M.SC. • HANNOVER Y ONLINE'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    STEM Mentoring for your university exams
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 font-medium max-w-3xl mx-auto mb-6 leading-relaxed font-sans">
                    {lang === 'en'
                      ? 'Significantly improve your grades through 1-on-1 or group classes with a Double Master in Science & Geophysicist, for university and IB students.'
                      : 'Mejora considerablemente tus notas mediante 1-on-1 or groupal classes with a double master in science and geophysicist, for university and IB Students.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => navigateTo('courses')}
                      className="px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Open Course Catalog →' : 'Abrir Catálogo de Clases →'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenBooking(null, true)}
                      className="px-5 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-200 font-mono text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Spontaneous 1-on-1 Class' : 'Clase Espontánea Urgente'}</span>
                    </button>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-mono text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Direct Contact & WhatsApp' : 'Contacto Directo & WhatsApp'}</span>
                    </button>
                  </div>
                </div>

                {/* 3D Realistic Planetary Observatory Viewport */}
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_90px_rgba(56,189,248,0.07)]">
                  <SolarSystem
                    onSelectSubject={handleSelectPlanetSubject}
                    selectedSubjectId={selectedSubjectId}
                    lang={lang}
                    onNavigate={navigateTo}
                    onOpenBooking={handleOpenBooking}
                  />
                </div>

                {/* Minimalist Trust Indicator Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>CAU Kiel (DE) &amp; AMU (PL) Double M.Sc.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Past-Exam (Altklausur) Focused Prep' : 'Preparación con Altklausuren'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>In-Person in Hannover &amp; Online Worldwide</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{lang === 'en' ? 'Classes in English & Español' : 'Clases en inglés y español'}</span>
                  </div>
                </div>

              </div>
            </section>

            {/* Pitch: Why take classes with me */}
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
                    className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Book a free diagnostic session' : 'Reservar sesión diagnóstica gratis'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Teaser: Featured Modules Grid on Landing */}
            <section className="py-16 bg-[#FAFAFB] border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                      {lang === 'en' ? 'Curriculum Spotlight' : 'Módulos Más Solicitados'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {lang === 'en' ? 'High-Demand Klausur Preparation Modules' : 'Materias Críticas en Universidades Alemanas'}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('courses')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 hover:text-sky-900"
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
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold"
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

            {/* Quick Teaser: Mentor Spotlight with Portfolio Link */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
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
                        className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold"
                      >
                        {lang === 'en' ? 'Read Full Academic Dossier →' : 'Ver Dossier Académico Completo →'}
                      </button>
                      <button
                        onClick={() => navigateTo('contact')}
                        className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Contact (+49 176 7649 7440)' : 'Contacto (+49 176 7649 7440)'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: FULL COURSE CATALOG & TACTICAL SPRINT PREVIEW     */}
        {/* ========================================================= */}
        {currentPage === 'courses' && (
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Breadcrumb & Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                  <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slate-900 font-bold">Course Catalog</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {lang === 'en' ? 'Official Course Catalog & Klausur Modules' : 'Catálogo Curricular Oficial de Materias'}
                </h1>
                <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
                  {lang === 'en'
                    ? 'Every course is synchronized with German university lecture scripts (Skripte) and examiner mark schemes (TUM, RWTH Aachen, KIT, TU Berlin).'
                    : 'Cada asignatura está sincronizada con los Skripte universitarios y los criterios oficiales de corrección de los catedráticos alemanes.'}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">Vector PDF (Miro Export)</span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      Complete step-by-step mathematical derivations exported in crisp 4K vector format with color-coded algebraic stages.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                      <BookmarkCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">Formula Cheat-Sheets</span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      Condensed 1-page formula summaries and conversion rules formatted specifically for quick review before the Klausur.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">Python Verification Code</span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      Executable NumPy/SciPy script confirming numerical roots, matrix eigenvalues, or ODE stability whenever applicable.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block text-sm">Async WhatsApp Q&amp;A</span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      Send photos of exercise bottlenecks directly on WhatsApp/Telegram; get fast voice-note or audio guidance between sessions.
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
                          <strong className="text-slate-900 block">Send Your Skript &amp; Altklausuren</strong>
                          <span className="text-slate-500">Upload your professor's lecture notes and target past exam papers.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">2</span>
                        <div>
                          <strong className="text-slate-900 block">20-Min Free Strategy Call</strong>
                          <span className="text-slate-500">We isolate your 3 primary conceptual bottlenecks and score traps.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center font-bold shrink-0">3</span>
                        <div>
                          <strong className="text-slate-900 block">Intensive Sprint or Spontaneous Drill</strong>
                          <span className="text-slate-500">Lock in your calendar slots (Online worldwide or in-person in Hannover, Germany).</span>
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
                        ? 'Available for high-urgency exercise problem sheets or last-minute Klausur drills. Choose between online interactive whiteboarding or in-person coaching in Hannover.'
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
                  { id: 'bachelor', labelEn: 'TU9 Bachelor Klausuren', labelEs: 'Grado Universitario TU9' },
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
                            <span className="text-[10px] font-mono text-slate-500 block">1-on-1 Individual Session</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-700 block">
                              €{course.packagePrice} / {course.packageHours}h Pack
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">Klausur Survival Sprint</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                            {lang === 'en' ? 'Core Syllabus & Klausur Drills:' : 'Temario Clave y Exámenes:'}
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
                            German Skript Keywords:
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

                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenBooking(course)}
                          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
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
          <div className="py-12">
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
          <div className="py-12">
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
                    ? 'Calculate your customized investment, explore fixed Klausur sprint bundles, and inspect Daniel Santander’s verified engineering and geophysics background.'
                    : 'Calcula tu inversión a medida, explora los planes de sprint para exámenes (Klausur) y conoce la formación y metodología de Daniel Santander.'}
                </p>
              </div>

              {/* --- SECTION 1: INTERACTIVE RATE CALCULATOR --- */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          Academic Level / Study Cohort
                        </label>
                        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                          {[
                            { id: 'ib', label: 'IB Diploma' },
                            { id: 'bachelor', label: 'Bachelor (TU9)' },
                            { id: 'master', label: 'Master & Thesis' }
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
                              {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 font-mono text-xs">
                          <span className="text-slate-500 uppercase font-semibold">Mentorship Volume</span>
                          <span className="text-sky-800 font-bold text-lg">{calcHours} hours</span>
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
                          <span>2h (Drill urgente)</span>
                          <span>8h (Klausur Sprint)</span>
                          <span>20h (Acompañamiento continuo)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                          Delivery Format
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
                            <div className="font-bold text-slate-900">1-on-1 Individual</div>
                            <div className="text-[11px] text-slate-500">Online &amp; In-Person in Hannover</div>
                          </button>

                          <button
                            onClick={() => setCalcFormat('group')}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              calcFormat === 'group'
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="font-bold text-emerald-800">Study Group (Max 3)</div>
                            <div className="text-[11px] text-emerald-700">-30% discount per student</div>
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
                          Apply 4-Week Klausur Sprint Bundle (-15% discount)
                        </span>
                      </label>

                    </div>

                    <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                          Estimated Investment
                        </span>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-mono font-extrabold text-white">€{totalCost}</span>
                          <span className="text-xs font-mono text-slate-400">total</span>
                        </div>

                        <div className="text-xs font-mono text-slate-300 pb-4 mb-4 border-b border-slate-800">
                          <span>Effective Rate: <strong className="text-emerald-400">€{effectiveRate}/hr</strong></span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-300 font-mono mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Miro Whiteboard Vector PDF Export</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Step-by-step Altklausuren Solutions</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Structured Formula Sheets &amp; Exam Summaries</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Direct Async WhatsApp Q&amp;A Access</span>
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
                    Academic Background &amp; Methodology
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
                        <p className="text-xs font-mono text-sky-700 font-semibold">Geophysicist &amp; Double M.Sc. Engineer</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hannover, Germany • Online Worldwide</span>
                        </div>
                      </div>
                    </div>

                    {/* Formal University Degrees Box */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>Germany (CAU Kiel)</span>
                          <span>Double Master Degree</span>
                        </div>
                        <span className="text-slate-900 font-bold block">M.Sc. Environmental Management</span>
                        <span className="text-slate-500 text-[11px]">Christian-Albrechts-Universität zu Kiel</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>Poland (AMU Poznań)</span>
                          <span>Double Master Degree</span>
                        </div>
                        <span className="text-slate-900 font-bold block">M.Sc. Integrated Catchment Management</span>
                        <span className="text-slate-500 text-[11px]">Adam Mickiewicz University</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-0.5">
                          <span>Chile (FCFM)</span>
                          <span>Engineering Degree</span>
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
                        href="https://github.com/danisantanderurrutia-coder/portafolio"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Daniel's GitHub Portfolio</span>
                      </a>
                    </div>

                  </div>

                  {/* Pedagogical Methodology & Experience (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                      <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                        The Mentorship Method
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Rigorous physics intuition, exam-focused scoring, and zero linguistic friction.
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        Most university students do not fail exams due to a lack of talent. They fail because university lectures present proofs as abstract formalisms without grounding the physical meaning, while professors in Germany demand precise, step-by-step justification to award partial points.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold flex items-center justify-center mb-3">01</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Intuición Física Primero</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Visualizar el fenómeno físico antes de escribir la ecuación diferencial.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center mb-3">02</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Criterios de Examen Alemán</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Estructura de respuesta para maximizar puntos parciales en cada pregunta.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center justify-center mb-3">03</span>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Clases en Español o Inglés</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Cero fatiga lingüística, trabajando con tus Skripte y Altklausuren oficiales.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">¿Quieres revisar tu temario con Daniel?</h4>
                        <p className="text-xs text-slate-600">Agenda una llamada diagnóstica de 20 minutos sin compromiso.</p>
                      </div>
                      <button
                        onClick={() => handleOpenBooking()}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        Reservar Diagnóstico →
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
          <div className="py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
                <button onClick={() => navigateTo('landing')} className="hover:underline">Home</button>
                <span>/</span>
                <span className="text-slate-900 font-bold">Contact</span>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  Direct Communication Channels
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Get in Direct Touch with Daniel
                </h1>
                <p className="text-slate-600 text-sm">
                  Write directly via WhatsApp, send an email, or schedule your 20-minute diagnostic session.
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
                      Phone &amp; WhatsApp
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      +49 176 7649 7440
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      Direct WhatsApp messaging for fast inquiries, exercise photos, and appointment scheduling.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/4917676497440"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      Direct Email
                    </span>
                    <h3 className="text-sm font-bold font-mono text-slate-900 mb-1 break-all">
                      danisantander.urrutia@gmail.com
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      Send syllabi PDFs, Altklausur documents, and general inquiries. Reply guaranteed within 12 hours.
                    </p>
                  </div>
                  <a
                    href="mailto:danisantander.urrutia@gmail.com?subject=STEM%20Mentorship%20Inquiry"
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    Send Email →
                  </a>
                </div>

                {/* GitHub Portfolio */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      GitHub Repositories
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      @danisantanderurrutia-coder
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                      Explore Daniel's open-source repositories, geophysics scripts, digital twin tools, and web applications.
                    </p>
                  </div>
                  <a
                    href="https://github.com/danisantanderurrutia-coder/portafolio"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    View GitHub Portfolio →
                  </a>
                </div>

              </div>

              {/* In-Person Hannover Location Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>In-Person Mentorship in Hannover, Germany</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Are you studying in Hannover or Niedersachsen?
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl font-sans leading-relaxed">
                    In-person sessions take place in university library study rooms (such as the TIB - Leibniz Information Centre for Science and Technology at Leibniz Universität Hannover) or quiet learning centers.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBooking(null, false)}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold whitespace-nowrap"
                >
                  Schedule Hannover Session →
                </button>
              </div>

              {/* Frequently Asked Questions (FAQ) Embedded in Contact */}
              <div id="faq-section" className="mt-16 pt-12 border-t border-slate-200">
                <div className="text-center mb-10">
                  <span className="text-xs font-mono text-sky-800 uppercase tracking-widest block mb-2 font-bold">
                    {lang === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {lang === 'en' ? 'German University & Administrative Logistics' : 'Logística Universitaria en Alemania y Metodología'}
                  </h2>
                  <p className="text-slate-600 text-sm max-w-2xl mx-auto font-sans">
                    {lang === 'en'
                      ? 'Clear answers regarding German exams, in-person sessions in Hannover, digital tools, and scheduling.'
                      : 'Respuestas claras sobre exámenes alemanes, clases presenciales en Hannover, herramientas digitales y reservas.'}
                  </p>
                </div>

                <div className="space-y-3 max-w-4xl mx-auto">
                  {[
                    {
                      qEn: "Can sessions be conducted in English or Spanish if my exam is officially in German?",
                      qEs: "¿Se pueden impartir las clases en inglés o español si mi examen oficial es en alemán?",
                      aEn: "Yes. All sessions are taught in English or Spanish (not in German), so you can focus on understanding the physical and mathematical intuition without language fatigue. We work from your own lecture notes (Skripte) and past exams, so you can see how the concepts appear in your German-language exam.",
                      aEs: "Sí. Todas las clases se imparten en español o inglés (no en alemán), para que te concentres en comprender la intuición física y matemática sin fatiga idiomática. Trabajamos con tus propios apuntes (Skripte) y exámenes anteriores, para que veas cómo aparecen los conceptos en tu examen en alemán."
                    },
                    {
                      qEn: "Can we focus directly on past exams (Altklausuren) and exercise problem sets?",
                      qEs: "¿Podemos enfocarnos directamente en resolver exámenes anteriores (Altklausuren) y ejercicios?",
                      aEn: "Yes, absolutely. Solving official past exams (Altklausuren) from your chair is the single highest-yield strategy. We dissect actual exam problems step-by-step, identifying grading rubrics, common traps, and time-saving derivation methods.",
                      aEs: "Sí, totalmente. Resolver Altklausuren oficiales de tu cátedra es la estrategia más eficaz para aprobar. Desglosamos exámenes reales paso a paso, identificando los criterios del examinador, trampas frecuentes y métodos directos de resolución."
                    },
                    {
                      qEn: "Can classes be taken in-person in Hannover, Germany?",
                      qEs: "¿Se pueden tomar clases presenciales en Hannover, Alemania?",
                      aEn: "Yes. In-person 1-on-1 sessions are available in Hannover, Germany for local students (e.g. from Leibniz Universität Hannover / LUH or nearby universities). Sessions can be held in university library study rooms (e.g. TIB) or quiet learning spaces.",
                      aEs: "Sí. Ofrezco sesiones presenciales individuales en Hannover, Alemania para estudiantes locales (ej. de la Leibniz Universität Hannover / LUH o alrededores), coordinadas en salas de estudio de bibliotecas universitarias (como la TIB) o espacios de estudio tranquilos."
                    },
                    {
                      qEn: "How does the 20-minute diagnostic session work?",
                      qEs: "¿En qué consiste la sesión diagnóstica inicial de 20 minutos?",
                      aEn: "We meet via Zoom/Google Meet, review your module syllabus, inspect previous exams (Altklausuren) from your chair, identify where you are losing partial points, and design a concrete schedule to ensure you pass.",
                      aEs: "Nos conectamos por Zoom o Google Meet, revisamos el temario de tu cátedra, examinamos Altklausuren reales, identificamos tus puntos débiles y diseñamos un plan estructurado para asegurar tu aprobado."
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
          <p>© 2026 Daniel Santander • STEM Mentorship &amp; Applied Geophysics • Hannover, Germany &amp; Online</p>
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
                      : (lang === 'en' ? 'Schedule Klausur Strategy Session' : 'Agendar Sesión de Estrategia para Klausur')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'en'
                      ? 'Submitting generates an immediate notification to danisantander.urrutia@gmail.com and WhatsApp.'
                      : 'Al enviar se generará una notificación inmediata a danisantander.urrutia@gmail.com y por WhatsApp.'}
                  </p>
                </div>

                {modalCourse && (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-sky-300 text-xs font-mono text-sky-900">
                    Selected Subject: <strong>{modalCourse.code} — {modalCourse.titleEn}</strong>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 font-mono text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      placeholder="e.g. Mateo Becker"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">Email *</label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="student@tum.de"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">Phone / WhatsApp</label>
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
                    <label className="block text-slate-700 mb-1 font-semibold">University / School *</label>
                    <input
                      type="text"
                      required
                      value={bookingData.university}
                      onChange={(e) => setBookingData({ ...bookingData, university: e.target.value })}
                      placeholder="e.g. LUH Hannover, TUM, RWTH, TU Berlin"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  {/* Delivery Location Preference: Online vs Presencial en Hannover */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Format &amp; Location Preference</label>
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
                        🌐 Online (Miro + Stylus)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, deliveryMode: 'In-Person (Hannover, Germany)' })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          bookingData.deliveryMode.includes('Hannover')
                            ? 'bg-slate-900 border-slate-900 text-white font-bold'
                            : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        📍 In-Person (Hannover, DE)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Language Preference</label>
                    <div className="flex gap-2">
                      {['English', 'Español', 'Mixed'].map((lng) => (
                        <button
                          key={lng}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, languagePref: lng })}
                          className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                            bookingData.languagePref === lng
                              ? 'bg-slate-900 border-slate-900 text-white font-bold'
                              : 'bg-slate-50 border-slate-300 text-slate-600'
                          }`}
                        >
                          {lng}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Bottleneck / Urgent Problem / Target Date</label>
                    <textarea
                      rows={2}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      placeholder="e.g. Exam in 4 weeks, need help with multivariable line integrals and Green's theorem proofs..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-sans text-xs focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Send Request to danisantander.urrutia@gmail.com →</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 font-mono">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-800">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email Draft Generated &amp; Prepared!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-sans">
                  Your request has been formulated to <strong>danisantander.urrutia@gmail.com</strong>. If your email client did not open automatically, click below:
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  {lastMailtoUrl && (
                    <a
                      href={lastMailtoUrl}
                      className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Mail Client</span>
                    </a>
                  )}

                  <a
                    href={`https://wa.me/4917676497440?text=${encodeURIComponent(`Hi Daniel! I just booked a session for ${bookingData.courseCode || 'STEM Mentorship'}. My name is ${bookingData.name}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono"
                  >
                    Close Window
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
