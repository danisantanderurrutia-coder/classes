// Comprehensive University-Style Academic Guides for All 13 Courses
// Comprehensive University-Style Academic Guides for All 13 Courses
export const COURSE_ACADEMIC_GUIDES = {
  "physics_bachelor": {
    "courseCode": "PHY-101",
    "courseTitle": "General Physics I & II (Bachelor / Common Core)",
    "faculty": "Faculty of Physical & Mathematical Sciences (Engineering Common Core)",
    "academicLevel": "Undergraduate B.Sc. (1st & 2nd Year)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Live Problem Solving)",
    "courseOverview": "A foundational university physics program bridging calculus with real-world physical systems. Focuses on classical Newtonian mechanics, conservative fields, work-energy theorems, multi-particle systems, fluids, and thermodynamics.",
    "prerequisites": "Single-variable differential and integral calculus, basic vector algebra, and high school kinematics.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Vector Kinematics & Coordinate Frames",
        "description": "Position, velocity, and acceleration vectors across Cartesian, Cylindrical, Spherical, and Frenet-Serret intrinsic coordinate frames.",
        "competencies": [
          "Coordinate transformations",
          "Curvilinear trajectory modeling",
          "Relative velocity frames"
        ]
      },
      {
        "number": 2,
        "title": "Newton's Axioms & Energy Landscapes",
        "description": "Free body diagrams in 3D, conservative force fields, potential energy surfaces, and work-kinetic energy theorems.",
        "competencies": [
          "Equilibrium stability analysis",
          "Line integrals of force fields",
          "Conservative vs non-conservative dynamics"
        ]
      },
      {
        "number": 3,
        "title": "Multi-Particle Systems & Rigid Body Rotations",
        "description": "Center of mass dynamics, linear and angular momentum conservation, collisions, moment of inertia, and Steiner's parallel axis theorem.",
        "competencies": [
          "Tensor-based moment of inertia",
          "Impulse-momentum balance",
          "Fixed-axis and rolling planar motion"
        ]
      },
      {
        "number": 4,
        "title": "Fluids & Thermodynamic Cycles",
        "description": "Hydrostatic pressure, Pascal/Archimedes principles, Bernoulli flow, and 1st/2nd laws of thermodynamics with entropy calculations.",
        "competencies": [
          "Control volume continuity equation",
          "Carnot and Otto cycle efficiencies",
          "Entropy generation and T-s diagrams"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Diagnostic & Gap Detection",
        "description": "Screening prerequisite gaps in calculus and vector trigonometry before addressing complex physical scenarios."
      },
      {
        "phase": 2,
        "name": "Step-by-Step Whiteboard Derivation",
        "description": "Interactive development of free-body diagrams and mathematical differential equations without skipping algebraic steps."
      },
      {
        "phase": 3,
        "name": "Algorithmic Intuition",
        "description": "Visualizing boundary conditions, limiting behaviors, and unit-dimension consistency."
      },
      {
        "phase": 4,
        "name": "Exam & Synthesis Mastery",
        "description": "Solving past university exam problems under real time constraints to ensure maximum partial credit."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Physics for Scientists and Engineers with Modern Physics",
        "author": "Raymond A. Serway & John W. Jewett",
        "edition": "10th Edition",
        "scope": "Core text for mechanics, waves, and thermodynamics."
      },
      {
        "title": "University Physics with Modern Physics",
        "author": "Hugh D. Young & Roger A. Freedman",
        "edition": "15th Edition",
        "scope": "Standard university reference for problem sets and worked examples."
      },
      {
        "title": "The Feynman Lectures on Physics, Vol. I",
        "author": "Richard P. Feynman",
        "edition": "Definitive Edition",
        "scope": "Conceptual depth, conservation principles, and physical intuition."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "mechanics": {
    "courseCode": "PHY-201",
    "courseTitle": "Classical Mechanics & Analytical Dynamics",
    "faculty": "Theoretical & Applied Physics / Mechanical Engineering",
    "academicLevel": "Undergraduate B.Sc. (2nd & 3rd Year)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Live Code)",
    "courseOverview": "An advanced analytical mechanics curriculum covering Newtonian mechanics in non-inertial reference systems, Lagrangian and Hamiltonian formalisms, rigid body rotations, inertia tensors, and coupled oscillatory systems.",
    "prerequisites": "General Physics I, Multivariable Calculus (partial derivatives, gradient), and Linear Algebra (matrices, eigenvalues).",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Non-Inertial Reference Frames & Fictitious Forces",
        "description": "Kinematics in rotating coordinate frames, Coriolis acceleration, centrifugal potentials, and Earth-rotation geophysical effects.",
        "competencies": [
          "Foucault pendulum modeling",
          "Coriolis drift calculations",
          "Apparent gravity corrections"
        ]
      },
      {
        "number": 2,
        "title": "Lagrangian Formulation & Variational Principles",
        "description": "Generalized coordinates, holonomic constraints, D'Alembert principle, Hamilton's principle of least action, and Euler-Lagrange equations.",
        "competencies": [
          "Formulating Lagrangians for multi-degree systems",
          "Noether's theorem and cyclic coordinates",
          "Lagrange multipliers for constraint forces"
        ]
      },
      {
        "number": 3,
        "title": "Hamiltonian Mechanics & Phase Space Dynamics",
        "description": "Legendre transformations, canonical equations of motion, Poisson brackets, canonical invariants, and Liouville's theorem.",
        "competencies": [
          "Phase space trajectory plotting",
          "Constants of motion via Poisson brackets",
          "Canonical transformations"
        ]
      },
      {
        "number": 4,
        "title": "Rigid Body Kinematics & Coupled Oscillators",
        "description": "Inertia tensor diagonalisation, principal axes, Euler angles, torque-free symmetric top precession, and normal modes of coupled oscillators.",
        "competencies": [
          "Calculating moments and products of inertia",
          "Euler dynamic equations for tops",
          "Eigenvalue determination of normal mode frequencies"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Geometric & Constraint Audit",
        "description": "Deconstructing physical degrees of freedom and identifying constraint equations before picking generalized coordinates."
      },
      {
        "phase": 2,
        "name": "Analytic Formal Derivation",
        "description": "Constructing kinetic and potential energy matrices step-by-step to formulate the Lagrangian or Hamiltonian."
      },
      {
        "phase": 3,
        "name": "Limit & Symmetry Checks",
        "description": "Testing conservation laws via Noether symmetries and validating small-oscillation limits."
      },
      {
        "phase": 4,
        "name": "Klausur Problem Architecture",
        "description": "Training with university exam problem structures to guarantee full partial credit on complex multi-body systems."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Classical Mechanics",
        "author": "Herbert Goldstein, Charles P. Poole & John L. Safko",
        "edition": "3rd Edition",
        "scope": "The definitive gold standard for theoretical and analytical mechanics worldwide."
      },
      {
        "title": "Mechanics (Course of Theoretical Physics, Vol. 1)",
        "author": "L.D. Landau & E.M. Lifshitz",
        "edition": "3rd Edition",
        "scope": "Elegant, concise variational formulation of classical physics."
      },
      {
        "title": "Classical Dynamics of Particles and Systems",
        "author": "Stephen T. Thornton & Jerry B. Marion",
        "edition": "5th Edition",
        "scope": "Extensive worked examples in Lagrangian dynamics, oscillations, and central forces."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "atmospheric": {
    "courseCode": "ATM-201",
    "courseTitle": "Atmospheric Physics, Thermodynamics & Gas Dynamics",
    "faculty": "Atmospheric Sciences, Meteorology & Environmental Physics",
    "academicLevel": "Undergraduate B.Sc. & Graduate M.Sc.",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Data Analysis)",
    "courseOverview": "Covers geophysical fluid dynamics and atmospheric thermodynamics: hydrostatic equilibrium, moist air thermodynamics, tephigram/emagram analysis, radiative transfer balances, geostrophic wind approximations, and boundary layer turbulent fluxes.",
    "prerequisites": "General Physics, Multivariable Calculus, and Introductory Thermodynamics.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Atmospheric Statics & Hydrostatic Balance",
        "description": "Equation of state for ideal gases, virtual temperature, barometric formulas, geopotential height, and atmospheric column stability.",
        "competencies": [
          "Hypsometric equation calculations",
          "Virtual temperature corrections",
          "Dry static stability and Brunt-Väisälä frequency"
        ]
      },
      {
        "number": 2,
        "title": "Thermodynamics of Moist Air & Thermodynamic Charts",
        "description": "Clausius-Clapeyron equation, dry/saturated adiabatic lapse rates, equivalent potential temperature, and skew-T / tephigram analysis.",
        "competencies": [
          "Lifting Condensation Level (LCL) computation",
          "CAPE and CIN convective index evaluations",
          "Latent heat release modeling"
        ]
      },
      {
        "number": 3,
        "title": "Radiative Transfer & Planetary Energy Balance",
        "description": "Blackbody radiation, Planck law, Beer-Lambert-Bouguer extinction, greenhouse absorption spectra, and zero-dimensional radiative models.",
        "competencies": [
          "Atmospheric window transmission",
          "Radiative equilibrium profiles",
          "Shortwave and longwave planetary budgets"
        ]
      },
      {
        "number": 4,
        "title": "Geophysical Fluid Dynamics & Boundary Layer Fluxes",
        "description": "Navier-Stokes on rotating spheres, Coriolis acceleration, geostrophic and gradient wind balance, thermal wind relation, and Eddy Covariance fluxes.",
        "competencies": [
          "Geostrophic wind vector computation",
          "Thermal wind shear diagnostics",
          "Logarithmic wind profile and surface roughness"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Thermodynamic Baseline Audit",
        "description": "Clarifying the thermodynamic variables (temperature, potential temperature, virtual temperature, humidity metrics) before entering complex atmospheric balances."
      },
      {
        "phase": 2,
        "name": "Equation System Derivation",
        "description": "Deriving the momentum equations on a rotating frame and establishing scaling approximations (Rossby number)."
      },
      {
        "phase": 3,
        "name": "Diagrammatic & Data Grounding",
        "description": "Connecting mathematical formulas to soundings, tephigrams, and satellite radiation profiles."
      },
      {
        "phase": 4,
        "name": "Klausur & Exam Problem Solving",
        "description": "Solving real university meteorological and geophysics exam problems with complete derivation clarity."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Atmospheric Science: An Introductory Survey",
        "author": "John M. Wallace & Peter V. Hobbs",
        "edition": "2nd Edition",
        "scope": "Comprehensive benchmark text for atmospheric physics and cloud processes."
      },
      {
        "title": "An Introduction to Dynamic Meteorology",
        "author": "James R. Holton & Gregory J. Hakim",
        "edition": "5th Edition",
        "scope": "Standard textbook for geophysical fluid dynamics and geostrophic balance."
      },
      {
        "title": "Atmospheric Thermodynamics",
        "author": "Craig F. Bohren & Bruce A. Albrecht",
        "edition": "Oxford University Press",
        "scope": "Unrivaled physical depth on phase changes and moisture thermodynamics."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "klausur": {
    "courseCode": "HM-101",
    "courseTitle": "Calculus & Mathematical Analysis I, II & III",
    "faculty": "Faculty of Mathematics & Engineering (University Standards)",
    "academicLevel": "Undergraduate B.Sc. (1st & 2nd Year Engineering & Science)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Exam Strategy)",
    "courseOverview": "Rigorous university-level analysis and multivariable calculus tailored for science and engineering students facing high-stakes examinations (Klausuren / Certámenes). Focuses on vector fields, integral theorems, differential equations, and partial credit scoring strategies.",
    "prerequisites": "High school algebra, trigonometric identities, and introductory limits.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Single-Variable Rigor & Series Convergence",
        "description": "Epsilon-delta limits, continuity proofs, intermediate value theorem, Taylor series expansions with Lagrange remainder, and convergence tests.",
        "competencies": [
          "Ratio, root, and integral tests",
          "Radius of convergence for power series",
          "L'Hôpital theorem applications"
        ]
      },
      {
        "number": 2,
        "title": "Multivariable Differential Calculus & Vector Fields",
        "description": "Partial derivatives, directional derivatives, gradient vectors, tangent hyperplanes, Hessian matrices, and constrained Lagrange multipliers.",
        "competencies": [
          "Critical point classification via Hessians",
          "Lagrange multiplier optimization",
          "Divergence and curl computations"
        ]
      },
      {
        "number": 3,
        "title": "Multiple Integrals & Vector Integral Theorems",
        "description": "Double and triple integrals across curvilinear coordinates, Green's theorem, Gauss's Divergence theorem, and Stokes' curl theorem.",
        "competencies": [
          "Volume and flux integrals",
          "Parametrizing surfaces and boundary curves",
          "Verifying integral identities in exam problems"
        ]
      },
      {
        "number": 4,
        "title": "Ordinary Differential Equations (ODEs) & Exam Bootcamp",
        "description": "Separable equations, integrating factors, second-order linear ODEs with constant coefficients, variation of parameters, and past exam problem sets.",
        "competencies": [
          "Wronskian independence tests",
          "Undetermined coefficients method",
          "Partial-credit exam structuring"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Algebraic & Conceptual Audit",
        "description": "Isolating recurring algebra slips (chain rule, sign conventions, coordinate jacobians) that cause exam point losses."
      },
      {
        "phase": 2,
        "name": "Parametric & Geometric Whiteboard Derivation",
        "description": "Visualizing domains, normal vectors, and vector fields in 3D before executing integrals."
      },
      {
        "phase": 3,
        "name": "Rubric-Aligned Formatting",
        "description": "Structuring mathematical answers precisely according to university examiner correction rubrics to secure maximum partial credit."
      },
      {
        "phase": 4,
        "name": "Timed Klausur Simulations",
        "description": "Simulating full past-paper exam problems under exam conditions to build stamina and speed."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Calculus: Early Transcendentals",
        "author": "James Stewart",
        "edition": "9th Edition",
        "scope": "Classic comprehensive calculus reference with rich geometric intuition."
      },
      {
        "title": "Vector Calculus",
        "author": "Jerrold E. Marsden & Anthony Tromba",
        "edition": "6th Edition",
        "scope": "Rigorous presentation of multivariable calculus and integral theorems."
      },
      {
        "title": "Höhere Mathematik 1, 2 & 3",
        "author": "Kurt Meyberg & Peter Vachenauer",
        "edition": "Springer",
        "scope": "Standard German university engineering reference for rigorous Klausur preparation."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "soil_physics": {
    "courseCode": "GEO-202",
    "courseTitle": "Soil Physics, Porous Media & Hydrogeophysics",
    "faculty": "Geophysics, Environmental Engineering & Earth Sciences",
    "academicLevel": "Undergraduate B.Sc. & Graduate M.Sc.",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Python Simulations)",
    "courseOverview": "Investigates transport phenomena in porous geologic media, combining physical soil mechanics, unsaturated moisture flow modeling, catchment water balances, and geophysical subsurface imaging techniques such as Vertical Electrical Sounding (VES).",
    "prerequisites": "Calculus, General Physics, and basic Geology or Environmental Engineering.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Physical Properties of Porous Media",
        "description": "Grain size distributions, bulk density, porosity, matric potential, capillarity, and soil water retention curves (van Genuchten and Brooks-Corey models).",
        "competencies": [
          "Calculating volumetric water content",
          "Retention curve parameter fitting",
          "Capillary rise height calculations"
        ]
      },
      {
        "number": 2,
        "title": "Saturated & Unsaturated Flow in Porous Media",
        "description": "Darcy's Law, hydraulic conductivity tensors, hydraulic head gradients, and the non-linear 1D/2D Richards equation.",
        "competencies": [
          "Permeability tensor calculations",
          "Numerical discretization of Richards equation",
          "Steady and transient infiltration modeling"
        ]
      },
      {
        "number": 3,
        "title": "Catchment Hydrology & Solute Transport",
        "description": "Water balances (Precipitation - Evapotranspiration = Runoff + Storage), Green-Ampt infiltration, and advection-dispersion solute transport equations.",
        "competencies": [
          "Péclet number evaluation",
          "Retardation factors for environmental tracers",
          "Catchment hydrograph separation"
        ]
      },
      {
        "number": 4,
        "title": "Applied Geoelectrics: Vertical Electrical Sounding (VES)",
        "description": "Current flow in conductive media, apparent resistivity, Schlumberger and Wenner electrode geometries, apparent resistivity curves, and 1D layer inversion.",
        "competencies": [
          "Electrode geometry factor computation",
          "Forward modeling of multilayer resistivity",
          "Interpretation of groundwater tables and salt intrusion"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Porous Medium Conceptualization",
        "description": "Grounding abstract Darcy and Richards equations in physical soil structures and pore geometry."
      },
      {
        "phase": 2,
        "name": "Differential Balance Formulation",
        "description": "Deriving mass conservation and transport differential equations step-by-step on digital whiteboard."
      },
      {
        "phase": 3,
        "name": "Geophysical Signal Inversion",
        "description": "Translating field apparent resistivity sounding curves into stratified subsurface layer models."
      },
      {
        "phase": 4,
        "name": "Applied Engineering Case Studies",
        "description": "Solving real-world catchment and geotechnical problems from past university and research exams."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Soil Physics",
        "author": "William A. Jury & Robert Horton",
        "edition": "6th Edition",
        "scope": "Standard reference for unsaturated moisture flow, heat transfer, and solute transport."
      },
      {
        "title": "Environmental Soil Physics",
        "author": "Daniel Hillel",
        "edition": "Academic Press",
        "scope": "In-depth conceptual and physical exploration of soil-water-atmosphere systems."
      },
      {
        "title": "An Introduction to Applied and Environmental Geophysics",
        "author": "John M. Reynolds",
        "edition": "2nd Edition",
        "scope": "Standard geophysics reference for electrical resistivity and VES sounding surveys."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "math_bachelor": {
    "courseCode": "MAT-101",
    "courseTitle": "Foundational Mathematics (Bachelor / Common Core)",
    "faculty": "Faculty of Mathematical Sciences & Engineering Foundations",
    "academicLevel": "Undergraduate B.Sc. (1st Year Engineering & Science)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Proof Training)",
    "courseOverview": "An intensive bridge curriculum for first-year undergraduates transitioning into university-level mathematics. Builds unwavering fluency in deductive reasoning, formal mathematical induction, complex numbers, abstract functions, and coordinate transformations.",
    "prerequisites": "Secondary school mathematics and algebraic equations.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Mathematical Logic & Proof Techniques",
        "description": "Propositional calculus, truth tables, direct proofs, proofs by contraposition and contradiction, and strong mathematical induction.",
        "competencies": [
          "Formal proof structuring",
          "Formulating induction base and step",
          "Identifying logical fallacies"
        ]
      },
      {
        "number": 2,
        "title": "Set Theory & Real Analysis Foundations",
        "description": "Sets, relations, injective, surjective, and bijective mappings, image and pre-image, infimum/supremum, and Archimedean property.",
        "competencies": [
          "Proof of function injectivity and invertibility",
          "Supremum and infimum determination",
          "De Morgan laws in sets"
        ]
      },
      {
        "number": 3,
        "title": "Sequences, Limits & Epsilon-Delta Rigor",
        "description": "Convergence of sequences, Cauchy sequences, monotone convergence theorem, and the formal epsilon-delta definition of function limits.",
        "competencies": [
          "Epsilon-delta limit proofs",
          "Squeeze theorem applications",
          "Indeterminate forms evaluation"
        ]
      },
      {
        "number": 4,
        "title": "Complex Numbers & Polynomial Algebra",
        "description": "Field of complex numbers, Argand diagram, polar and exponential forms (Euler formula), De Moivre's theorem, polynomial roots, and partial fractions.",
        "competencies": [
          "Complex root extraction",
          "De Moivre trigonometric identities",
          "Partial fraction decomposition for integration"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Cognitive & Notational Audit",
        "description": "Overcoming the shock of university mathematical abstraction by systematically defining all quantifier symbols and terminology."
      },
      {
        "phase": 2,
        "name": "Proof Architecture Training",
        "description": "Teaching the exact logical blueprint for writing direct, contrapositive, and induction proofs."
      },
      {
        "phase": 3,
        "name": "Counterexample & Limit Testing",
        "description": "Testing mathematical hypotheses by constructing edge cases and counterexamples."
      },
      {
        "phase": 4,
        "name": "Exam & Past Paper Mastery",
        "description": "Practicing formal proof and computation problems from university exams with rigorous formatting."
      }
    ],
    "recommendedReadings": [
      {
        "title": "How to Prove It: A Structured Approach",
        "author": "Daniel J. Velleman",
        "edition": "3rd Edition",
        "scope": "Essential guide for transitioning from algorithmic math to formal proof writing."
      },
      {
        "title": "Calculus, Vol. 1: One-Variable Calculus with an Introduction to Linear Algebra",
        "author": "Tom M. Apostol",
        "edition": "2nd Edition",
        "scope": "Rigorous axiomatic treatment of foundational university mathematics."
      },
      {
        "title": "Understanding Analysis",
        "author": "Stephen Abbott",
        "edition": "2nd Edition (Springer)",
        "scope": "Intuitive, lucid presentation of sequences, limits, and proof rigor."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "electromagnetism": {
    "courseCode": "PHY-202",
    "courseTitle": "Electromagnetism & Maxwell Equations",
    "faculty": "Faculty of Physical & Engineering Sciences",
    "academicLevel": "Undergraduate B.Sc. (2nd & 3rd Year)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Vector Visualizations)",
    "courseOverview": "A deep dive into classical electrodynamics: electrostatic potentials, dielectric polarization, magnetostatics, magnetic vector potentials, Faraday induction, and the complete unified differential and integral synthesis of Maxwell's Equations.",
    "prerequisites": "General Physics I & II, Multivariable Vector Calculus (divergence, curl, Stokes theorem), and Ordinary Differential Equations.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Electrostatics & Boundary Value Problems",
        "description": "Coulomb's Law, Gauss's Law (differential and integral), electrostatic potential V, Poisson and Laplace equations, and method of images.",
        "competencies": [
          "Solving boundary value problems with Laplace equation",
          "Method of images for spherical and planar conductors",
          "Capacitance and electrostatic energy density"
        ]
      },
      {
        "number": 2,
        "title": "Electric Fields in Matter & Dielectrics",
        "description": "Electric dipoles, polarization vector P, bound charge densities, displacement field D, linear dielectrics, and electrostatic boundary conditions.",
        "competencies": [
          "Calculating bound surface and volume charges",
          "Boundary conditions for D and E vectors",
          "Dielectric sphere in uniform electric field"
        ]
      },
      {
        "number": 3,
        "title": "Magnetostatics & Magnetic Media",
        "description": "Biot-Savart Law, Ampère's Law, divergence and curl of B, magnetic vector potential A, magnetization M, and auxiliary field H.",
        "competencies": [
          "Vector potential calculations for current loops",
          "Magnetic boundary conditions for B and H",
          "Ferromagnetic and paramagnetic materials"
        ]
      },
      {
        "number": 4,
        "title": "Electrodynamics & Maxwell's Equations Synthesis",
        "description": "Electromotive force, Faraday's induction law, Lenz's law, Maxwell's displacement current, Maxwell's 4 unified equations, Poynting energy flux, and EM waves in vacuum.",
        "competencies": [
          "Complete Maxwell equations in differential form",
          "Poynting theorem and energy conservation",
          "Wave equation derivation and speed of light"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Vector Calculus Readiness Audit",
        "description": "Ensuring absolute fluency in divergence, curl, gradient, Laplacian, and the integral theorems of Gauss and Stokes."
      },
      {
        "phase": 2,
        "name": "Symmetry & Field Line Modeling",
        "description": "Exploiting geometric symmetries (cylindrical, spherical, planar) to select Gaussian surfaces and Ampèrian loops."
      },
      {
        "phase": 3,
        "name": "Differential vs Integral Duality",
        "description": "Seamlessly switching between local point differential equations and global boundary integrals."
      },
      {
        "phase": 4,
        "name": "University Exam Synthesis",
        "description": "Solving complex university exam problems in induction, boundary value problems, and wave propagation."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Introduction to Electrodynamics",
        "author": "David J. Griffiths",
        "edition": "4th Edition",
        "scope": "The undisputed worldwide university standard for undergraduate electrodynamics."
      },
      {
        "title": "Classical Electrodynamics",
        "author": "John David Jackson",
        "edition": "3rd Edition",
        "scope": "Advanced graduate-level benchmark for boundary value problems and radiation."
      },
      {
        "title": "The Feynman Lectures on Physics, Vol. II: The Electromagnetic Field",
        "author": "Richard P. Feynman",
        "edition": "Definitive Edition",
        "scope": "Masterpiece on electromagnetic field geometry and Maxwell synthesis."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "linear_algebra": {
    "courseCode": "LA-102",
    "courseTitle": "Linear Algebra & Matrix Geometry",
    "faculty": "Applied Mathematics & Computational Sciences",
    "academicLevel": "Undergraduate B.Sc. (1st & 2nd Year)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Matrix Visualizations)",
    "courseOverview": "Covers abstract vector spaces, coordinate transforms, linear mappings, rank-nullity theorems, determinants, eigenspaces, matrix diagonalization, and inner product spaces with applications in physics and scientific machine learning.",
    "prerequisites": "Foundational university mathematics and system of linear equations.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university course syllabus, professor lecture slides, official problem sets, and past exams; and 50% powered by proprietary PIAD vector notes, custom-tailored diagnostic drills, and structured step-by-step synthesis sheets.",
    "modules": [
      {
        "number": 1,
        "title": "Vector Spaces, Subspaces & Bases",
        "description": "Vector space axioms, linear combinations, span, linear independence, basis, dimension, and coordinate representations relative to arbitrary bases.",
        "competencies": [
          "Proof of linear independence and spanning",
          "Computing basis coordinates",
          "Intersection and sum of subspaces"
        ]
      },
      {
        "number": 2,
        "title": "Linear Transformations & Matrix Representations",
        "description": "Linear mappings, kernel and image, Rank-Nullity Theorem, matrix representation of transformations, and change-of-basis similarity transformations.",
        "competencies": [
          "Computing kernel and image dimensions",
          "Formulating transformation matrices",
          "Change-of-basis matrix transformations"
        ]
      },
      {
        "number": 3,
        "title": "Determinants, Systems & Invertibility",
        "description": "Properties of determinants, Leibniz formula, Laplace expansion, Cramer's rule, Gaussian elimination, and invertible matrix characterizations.",
        "competencies": [
          "Determinant computation via row operations",
          "Inverting matrices via adjugate and Gauss-Jordan",
          "Solvability conditions of linear systems"
        ]
      },
      {
        "number": 4,
        "title": "Eigenvalues, Diagonalization & Inner Product Spaces",
        "description": "Characteristic polynomial, algebraic and geometric multiplicities, matrix diagonalization, inner products, Gram-Schmidt orthogonalization, and spectral theorem.",
        "competencies": [
          "Finding eigenvalues and eigenspaces",
          "Diagonalizing diagonalizable matrices",
          "Gram-Schmidt orthonormalization and QR concepts"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Geometric & Algebraic Duality",
        "description": "Connecting matrix algebra with geometric transformations (rotations, reflections, projections) in 2D and 3D."
      },
      {
        "phase": 2,
        "name": "Formal Proof Structure",
        "description": "Training the precise deductive steps required to prove that a subset is a subspace or that a set of vectors forms a basis."
      },
      {
        "phase": 3,
        "name": "Eigenvalue & Coordinate Intuition",
        "description": "Visualizing eigenvectors as invariant directional axes under matrix action."
      },
      {
        "phase": 4,
        "name": "Klausur Problem Drills",
        "description": "Mastering standard university exam problems: rank-nullity calculations, characteristic polynomials, and matrix powers."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Introduction to Linear Algebra",
        "author": "Gilbert Strang",
        "edition": "5th Edition",
        "scope": "Celebrated for lucid geometric intuition and fundamental subspaces."
      },
      {
        "title": "Linear Algebra Done Right",
        "author": "Sheldon Axler",
        "edition": "4th Edition (Springer)",
        "scope": "Elegant determinant-free theoretical approach to vector spaces and linear operators."
      },
      {
        "title": "Linear Algebra and Its Applications",
        "author": "David C. Lay, Steven R. Lay & Judi J. McDonald",
        "edition": "6th Edition",
        "scope": "Standard university textbook with worked engineering examples."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "quantum_curious": {
    "courseCode": "QNT-100",
    "courseTitle": "Quantum Physics for Enthusiasts (Conceptual & Accessible)",
    "faculty": "Open Science & Physics Outreach (Non-University Track)",
    "academicLevel": "Enthusiasts, Lifelong Learners & Curious Inquirers (No Exams)",
    "format": "1-on-1 Interactive Mentorship (Visual Simulations + Conceptual Whiteboard)",
    "courseOverview": "A deeply engaging, intuitive exploration of quantum mechanics designed for curious thinkers, science enthusiasts, and professionals without academic exam stress. Explores wave-particle duality, the uncertainty principle, entanglement, and quantum computing concepts.",
    "prerequisites": "Curiosity and an open mind; no advanced differential calculus required.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's personal inquiry interests, curated popular scientific literature, and questions; and 50% powered by proprietary PIAD conceptual vector notes, thought experiments, and visual interactive simulations.",
    "modules": [
      {
        "number": 1,
        "title": "The Breakdown of Classical Physics & Quanta",
        "description": "Blackbody radiation, the ultraviolet catastrophe, Planck's revolutionary quantum hypothesis, and Einstein's photoelectric effect.",
        "competencies": [
          "Understanding energy quantization E = hf",
          "Photoelectric cutoff frequency logic",
          "Photons as discrete energy packets"
        ]
      },
      {
        "number": 2,
        "title": "Wave-Particle Duality & The Double Slit",
        "description": "De Broglie matter waves, electron diffraction, the classic double-slit experiment, and the observer effect.",
        "competencies": [
          "Wave-particle duality concepts",
          "Wave interference patterns vs particle impacts",
          "Delayed-choice thought experiments"
        ]
      },
      {
        "number": 3,
        "title": "Heisenberg Uncertainty & Probability Clouds",
        "description": "Heisenberg's uncertainty relation, physical measurement limits, atomic orbitals as electron probability density clouds, and quantum tunneling.",
        "competencies": [
          "Uncertainty principle Δx · Δp ≥ ℏ/2",
          "Alpha decay and tunneling through barriers",
          "Bohr atom vs modern quantum clouds"
        ]
      },
      {
        "number": 4,
        "title": "Superposition, Entanglement & Quantum Computing",
        "description": "Schrödinger's Cat paradox, quantum superposition, EPR paradox, Bell's theorem, quantum entanglement, and the fundamentals of qubits.",
        "competencies": [
          "Qubit superposition vs classical bits",
          "Spooky action at a distance and Bell tests",
          "Overview of quantum cryptography and computers"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Myth-Busting & Foundational Framing",
        "description": "Separating genuine quantum physics from science fiction tropes through rigorous yet non-mathematical thought experiments."
      },
      {
        "phase": 2,
        "name": "Visual Whiteboard Thought Experiments",
        "description": "Drawing out historical experiments (Stern-Gerlach, double slit, interferometer) on interactive canvas."
      },
      {
        "phase": 3,
        "name": "Conceptual Physical Intuition",
        "description": "Developing clear physical mental models of wavefunctions, measurement collapse, and quantum spin."
      },
      {
        "phase": 4,
        "name": "Synthesized Discussion & Modern Insights",
        "description": "Discussing contemporary quantum breakthroughs: quantum computers, quantum teleportation, and cosmic cosmology."
      }
    ],
    "recommendedReadings": [
      {
        "title": "QED: The Strange Theory of Light and Matter",
        "author": "Richard P. Feynman",
        "edition": "Princeton University Press",
        "scope": "Feynman's brilliant, accessible introduction to quantum electrodynamics."
      },
      {
        "title": "Quantum: A Guide for the Perplexed",
        "author": "Jim Al-Khalili",
        "edition": "Weidenfeld & Nicolson",
        "scope": "Clear, modern exposition of quantum concepts for the general public."
      },
      {
        "title": "Six Easy Pieces & Six Not-So-Easy Pieces",
        "author": "Richard P. Feynman",
        "edition": "Basic Books",
        "scope": "Timeless lectures introducing quantum behavior and special relativity."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with illustrated concepts, summary infographics, and suggested reading links, backed by direct asynchronous WhatsApp support."
  },
  "computational": {
    "courseCode": "COMP-205",
    "courseTitle": "Scientific Data Analysis (Python & MATLAB)",
    "faculty": "Scientific Computing & Computational Data Analysis",
    "academicLevel": "Undergraduate B.Sc. & Graduate M.Sc.",
    "format": "1-on-1 Online Mentorship (Live Screen Share + Jupyter Notebooks + Code Debugging)",
    "courseOverview": "Hands-on computational training in high-performance scientific programming. Teaches students and researchers how to clean, model, fit, and visualize empirical datasets using NumPy, SciPy, Pandas, and Matplotlib.",
    "prerequisites": "Introductory programming concepts and elementary linear algebra / calculus.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's university lab code, research datasets, problem sets, and assignments; and 50% powered by proprietary PIAD vector scripts, code templates, numerical algorithms, and profiling guides.",
    "modules": [
      {
        "number": 1,
        "title": "Vectorized Computing with NumPy",
        "description": "Multi-dimensional arrays, slicing, broadcasting rules, memory contiguity, vectorized mathematical operations, and linear algebra routines.",
        "competencies": [
          "Eliminating Python slow loops via vectorization",
          "Array broadcasting mastery",
          "Matrix multiplication and solving linear systems"
        ]
      },
      {
        "number": 2,
        "title": "Data Wrangling & Time Series with Pandas",
        "description": "Series, DataFrames, indexing, handling missing values, temporal resamplings, group-by aggregations, and exporting structured datasets.",
        "competencies": [
          "Cleaning messy experimental sensor outputs",
          "Time-series rolling statistics and resampling",
          "Merging and joining heterogeneous data"
        ]
      },
      {
        "number": 3,
        "title": "Scientific Numerical Algorithms with SciPy",
        "description": "Non-linear least squares curve fitting (curve_fit), numerical integration (quad, dblquad), root finding, and ODE solvers (solve_ivp).",
        "competencies": [
          "Fitting custom non-linear models with parameter bounds",
          "Numerical integration of experimental curves",
          "Simulating dynamic physical differential equations"
        ]
      },
      {
        "number": 4,
        "title": "Spectral Analysis & Publication Visualizations",
        "description": "Discrete Fourier Transforms (FFT), frequency filtering, power spectral density (PSD), spectrograms, and publication-ready Matplotlib figures.",
        "competencies": [
          "Computing FFT and filtering noise via Butterworth filters",
          "Designing publication-quality multi-panel scientific plots",
          "Translating legacy MATLAB code into modern clean Python"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Code Architecture & Data Audit",
        "description": "Inspecting student data formats, memory bottlenecks, and algorithmic complexity."
      },
      {
        "phase": 2,
        "name": "Live Pair-Programming",
        "description": "Writing vectorized, clean Python / MATLAB code side-by-side with immediate debugging."
      },
      {
        "phase": 3,
        "name": "Numerical Verification & Sanity Checks",
        "description": "Testing edge cases, conservation of energy/mass in numerical models, and convergence tolerances."
      },
      {
        "phase": 4,
        "name": "Deployment & Modularization",
        "description": "Refactoring scripts into clean, reusable Python functions and scripts with comprehensive documentation."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Python for Data Analysis",
        "author": "Wes McKinney",
        "edition": "3rd Edition (O'Reilly)",
        "scope": "Written by the creator of Pandas; the definitive data manipulation bible."
      },
      {
        "title": "Numerical Python: Scientific Computing and Data Science Applications with NumPy, SciPy and Matplotlib",
        "author": "Robert Johansson",
        "edition": "2nd Edition (Apress)",
        "scope": "Comprehensive reference for scientific numerical programming in Python."
      },
      {
        "title": "Mastering MATLAB",
        "author": "Duane Hanselman & Bruce Littlefield",
        "edition": "Pearson",
        "scope": "Standard reference for MATLAB syntax and algorithmic translation."
      }
    ],
    "lectureNotesMaterial": "Executable Jupyter Notebooks (.ipynb) with fully commented Python code, alongside high-resolution Miro vector notes and sample data sets, backed by direct asynchronous WhatsApp support."
  },
  "thesis_projects": {
    "courseCode": "RES-501",
    "courseTitle": "Thesis Mentorship, Research Projects & Graduation Coaching",
    "faculty": "Academic Research Coaching & Engineering Defense Preparation",
    "academicLevel": "B.Sc. & M.Sc. Graduating Candidates (Capstone & Thesis)",
    "format": "1-on-1 High-Level Research Mentorship (Code Review + Manuscript Coaching + Defense Rehearsal)",
    "courseOverview": "Comprehensive 1-on-1 research mentorship for B.Sc. and M.Sc. students. Covers hypothesis definition, literature review structuring, numerical simulation debugging, scientific visualization refinement, academic writing, and defense committee rehearsals.",
    "prerequisites": "Enrollment in an undergraduate or graduate thesis / capstone research project.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official university thesis requirements, professor advisor feedback, manuscript drafts, and committee expectations; and 50% powered by proprietary PIAD research methodology, code profiling frameworks, figure design standards, and defense training.",
    "modules": [
      {
        "number": 1,
        "title": "Research Scoping & Methodological Architecture",
        "description": "Refining research questions, structuring testable hypotheses, defining measurable milestone deliverables, and synthesizing the state of the art.",
        "competencies": [
          "Formulating bulletproof research hypotheses",
          "Structuring literature reviews systematically",
          "Creating a realistic thesis milestone timeline"
        ]
      },
      {
        "number": 2,
        "title": "Numerical Simulation & Scientific Code Optimization",
        "description": "Profiling code bottlenecks, numerical convergence verification, vectorized algorithm refactoring, and automated simulation pipeline development.",
        "competencies": [
          "Debugging stubborn numerical simulation instability",
          "Profiling memory and CPU hotspots",
          "Ensuring reproducibility and automated batch execution"
        ]
      },
      {
        "number": 3,
        "title": "Data Synthesis & Publication-Quality Figure Design",
        "description": "Transforming dense experimental or model outputs into lucid, compelling diagrams, maps, and vector figures adhering to top peer-reviewed journal standards.",
        "competencies": [
          "Designing communicative multi-panel figures",
          "Eliminating visual clutter and chart junk",
          "Color palette selection for accessibility and print clarity"
        ]
      },
      {
        "number": 4,
        "title": "Academic Writing & Defense Committee Rehearsal",
        "description": "Structuring thesis chapters (Introduction, Methodology, Results, Discussion, Conclusion), polishing academic rhetoric, and intensive mock defense rehearsals.",
        "competencies": [
          "Writing clear, academically rigorous results and discussions",
          "Designing an impactful 20-minute defense presentation deck",
          "Mastering answers to challenging technical jury questions"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Scope & Advisor Alignment Audit",
        "description": "Deconstructing professor/advisor expectations and rubric requirements to align research trajectory."
      },
      {
        "phase": 2,
        "name": "Systematic Technical Iteration",
        "description": "Weekly code reviews, equation verifications, and data model debugging."
      },
      {
        "phase": 3,
        "name": "Manuscript Quality Control",
        "description": "Line-by-line editorial coaching on precision, formal mathematical terminology, and figure quality."
      },
      {
        "phase": 4,
        "name": "Defense Committee Simulation",
        "description": "Rigorous mock defense under realistic exam timing with simulated tough jury cross-examination."
      }
    ],
    "recommendedReadings": [
      {
        "title": "The Craft of Research",
        "author": "Wayne C. Booth, Gregory G. Colomb & Joseph M. Williams",
        "edition": "4th Edition (University of Chicago Press)",
        "scope": "The undisputed guide to planning, executing, and reporting academic research."
      },
      {
        "title": "Writing Science: How to Write Papers That Get Cited and Proposals That Get Funded",
        "author": "Joshua Schimel",
        "edition": "Oxford University Press",
        "scope": "Mastering narrative structure and clarity in scientific manuscripts."
      },
      {
        "title": "A Manual for Writers of Research Papers, Theses, and Dissertations",
        "author": "Kate L. Turabian",
        "edition": "9th Edition",
        "scope": "Standard reference for thesis formatting, citation, and scholarly presentation."
      }
    ],
    "lectureNotesMaterial": "Comprehensive annotated manuscript reviews, code refactoring diffs, Miro vector project roadmaps, and presentation slide annotations, backed by direct asynchronous WhatsApp support."
  },
  "ib": {
    "courseCode": "IB-HL",
    "courseTitle": "IB Diploma: Mathematics AA HL & Physics HL",
    "faculty": "International Baccalaureate High School Senior Cohort",
    "academicLevel": "IB Diploma Programme (Grades 11 & 12 / High School Seniors)",
    "format": "1-on-1 Online Mentorship (iPad + LaTeX Whiteboard + Past Paper Mark Schemes)",
    "courseOverview": "Specialized, rigorous preparation for high-achieving IB candidates aiming for Grade 7s. Covers the complete Higher Level syllabus for Math AA and Physics, with intensive mark scheme precision training for Papers 1, 2, 3 and the Internal Assessment (IA).",
    "prerequisites": "Enrolled in IB Diploma Programme (Grade 11 or 12 / Pre-U).",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the student's official IB syllabus, school teacher assignments, official past papers, and examiner mark schemes; and 50% powered by proprietary PIAD vector notes, mark scheme precision checklists, and diagnostic problem sets.",
    "modules": [
      {
        "number": 1,
        "title": "Mathematics AA HL: Advanced Calculus & Series",
        "description": "Differentiation rules, integration by parts and substitution, Maclaurin series expansions, separable and homogeneous differential equations.",
        "competencies": [
          "Integration techniques for Paper 1 (Non-Calculator)",
          "Formulating Maclaurin series for composite functions",
          "Solving first-order differential equations"
        ]
      },
      {
        "number": 2,
        "title": "Mathematics AA HL: 3D Vectors & Proofs",
        "description": "Vector and scalar products, vector equations of lines and planes in 3D, intersections, shortest distance formulas, and proof by induction.",
        "competencies": [
          "Line-plane and plane-plane geometric intersections",
          "Calculating perpendicular distances in 3D space",
          "Formal mathematical induction for AA HL Paper 1"
        ]
      },
      {
        "number": 3,
        "title": "Physics HL: Mechanics, Fields & Wave Phenomena",
        "description": "Rotational dynamics, gravitational and electric fields, orbital mechanics, simple harmonic motion, single-slit diffraction, and interference.",
        "competencies": [
          "Free body diagrams and rotational torque dynamics",
          "Gravitational and electric potential energy calculations",
          "Doppler effect and diffraction grating equations"
        ]
      },
      {
        "number": 4,
        "title": "Physics HL: Electromagnetic Induction & Internal Assessment (IA)",
        "description": "Faraday-Lenz induction, quantum physics, radioactive decay, nuclear binding energy, and complete structural guidance for the Physics/Math IA.",
        "competencies": [
          "Solving complex electromagnetic induction past papers",
          "Structuring the Internal Assessment (IA) for full marks (Criterion A-E)",
          "Paper 3 experimental data analysis and uncertainties"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "IB Mark Scheme Audit",
        "description": "Identifying where students drop method marks (M), answer marks (A), and accuracy marks in official examiners' reports."
      },
      {
        "phase": 2,
        "name": "Paper 1 Mental & Algebraic Agility",
        "description": "Training non-calculator algebra speed, geometric vector sketching, and trigonometric identities."
      },
      {
        "phase": 3,
        "name": "Internal Assessment (IA) Mentorship",
        "description": "Refining mathematical modeling, error propagation, and formatting to secure top marks in Criteria A–E."
      },
      {
        "phase": 4,
        "name": "Full Past Paper Simulations",
        "description": "Timed exam drills with strict examiner mark schemes across Papers 1, 2, and 3."
      }
    ],
    "recommendedReadings": [
      {
        "title": "Oxford IB Diploma Programme: Mathematics: Analysis and Approaches HL",
        "author": "Paul La Rondie, Ed Kemp, Laurie Buchanan & Jim Fensom",
        "edition": "Oxford University Press",
        "scope": "Standard course companion aligned with the latest IB Math AA syllabus."
      },
      {
        "title": "Physics for the IB Diploma",
        "author": "K. A. Tsokos",
        "edition": "6th Edition (Cambridge University Press)",
        "scope": "The benchmark physics textbook for IB Physics HL with rich problem sets."
      },
      {
        "title": "Official IB Questionbank & Subject Reports",
        "author": "International Baccalaureate Organization (IBO)",
        "edition": "Official Releases",
        "scope": "Past examination papers, mark schemes, and examiner feedback."
      }
    ],
    "lectureNotesMaterial": "High-resolution vector Miro PDF exported within 1 hour after each session, complete with color-coded LaTeX equation derivations, free body diagrams, and step-by-step problem templates, backed by direct asynchronous WhatsApp support."
  },
  "curious_minds": {
    "courseCode": "EXPLORE-101",
    "courseTitle": "Advanced Mathematical Thinking & Natural Sciences for Young Inquirers",
    "faculty": "Early Scientific Inquiry • Visual Geometry, Logic, Space & Playful Physics",
    "academicLevel": "Curious Inquirers (Approx. Ages 9–15)",
    "format": "1-on-1 Interactive Mentorship (Visual Puzzles + Space Simulations + Digital Whiteboard)",
    "courseOverview": "A dynamic, high-engagement STEM mentoring program for curious children and teenagers (approx. 9–15 years). Cultivates mathematical intuition, visual spatial geometry, logical deduction, and fundamental physical laws through interactive thought experiments.",
    "prerequisites": "Curiosity, willingness to ask questions, and foundational arithmetic skills.",
    "fiftyFiftyPolicy": "Instruction is structured with a strict 50/50 balance across all sessions: 50% dedicated strictly to the young student's school curriculum, homework doubts, and academic enrichment; and 50% powered by proprietary PIAD playful challenges, visual geometry explorations, and deep-thinking scientific riddles.",
    "modules": [
      {
        "number": 1,
        "title": "Visual Geometry & Spatial Intuition",
        "description": "Angles, regular polygons, Platonic solids, tessellations, why bubbles are spherical (minimal surface area), and the geometry of snowflakes.",
        "competencies": [
          "Spatial reasoning and 3D folding intuition",
          "Discovering Euler's formula (V - E + F = 2)",
          "Symmetry and rotational patterns in nature"
        ]
      },
      {
        "number": 2,
        "title": "The Secret Code of Numbers",
        "description": "Prime numbers as cosmic building blocks, modular clock arithmetic, the Fibonacci sequence in sunflowers and pinecones, and infinity paradoxes.",
        "competencies": [
          "Sieve of Eratosthenes and prime factorization",
          "Modular arithmetic logic",
          "Recognizing recursive patterns and self-similarity"
        ]
      },
      {
        "number": 3,
        "title": "Planets, Gravity & Space Physics",
        "description": "Why planets orbit instead of falling, Newton's cannonball thought experiment, how pendulums keep time, and the speeds of rockets.",
        "competencies": [
          "Intuition of centripetal forces and gravity",
          "Period of a pendulum and resonance",
          "Basic celestial orbits and escape speed"
        ]
      },
      {
        "number": 4,
        "title": "Logic, Paradoxes & First-Principles Problem Solving",
        "description": "Classic riddles, knights and knaves logic puzzles, the Monty Hall paradox, and breaking big problems down into simple unbreakable truths.",
        "competencies": [
          "Deductive logic and systematic case testing",
          "Probability intuition without memorizing dry formulas",
          "Confidence in asking why things work"
        ]
      }
    ],
    "piadMethodology": [
      {
        "phase": 1,
        "name": "Curiosity Spark & Puzzle Framing",
        "description": "Starting each session with a fascinating physical or mathematical puzzle that hooks attention naturally."
      },
      {
        "phase": 2,
        "name": "Visual Digital Whiteboard Exploration",
        "description": "Co-creating diagrams, moving shapes, and drawing out experiments on digital canvas."
      },
      {
        "phase": 3,
        "name": "Socratic Guided Discovery",
        "description": "Asking guiding questions so the student deduces the underlying scientific rule on their own."
      },
      {
        "phase": 4,
        "name": "Confidence & Reflection Wrap-Up",
        "description": "Summarizing the key discovery in a fun, illustrated visual takeaways note the student keeps forever."
      }
    ],
    "recommendedReadings": [
      {
        "title": "The Number Devil: A Mathematical Adventure",
        "author": "Hans Magnus Enzensberger",
        "edition": "Metropolitan Books",
        "scope": "Enchanting story-based exploration of prime numbers, series, and combinatorics."
      },
      {
        "title": "Mathematics: A Human Endeavor",
        "author": "Harold R. Jacobs",
        "edition": "W. H. Freeman",
        "scope": "Masterpiece textbook on cultivating real mathematical thinking and puzzle appreciation."
      },
      {
        "title": "What Is Mathematics? An Elementary Approach to Ideas and Methods",
        "author": "Richard Courant & Herbert Robbins",
        "edition": "Oxford University Press",
        "scope": "Classic inspiring survey of deep mathematical ideas accessible to curious minds."
      }
    ],
    "lectureNotesMaterial": "Colorful, engaging Miro whiteboard PDF with visual illustrations, puzzle diagrams, and fun challenges after every session, with direct support for questions between meetings."
  }
};

