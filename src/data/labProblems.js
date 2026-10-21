import { Layers, Target, Cpu, Magnet, Flame, Activity, Compass, Orbit, Globe, Mountain, Waves, Radio } from 'lucide-react';

// Catalog of the classical physics, engineering & geophysics lab problems (bilingual EN/ES).
export const LAB_PROBLEMS = [
  {
    id: 'newtonian',
    courseId: 'mechanics',
    badgeEs: 'Mecánica & Sistemas Newtonianos',
    badgeEn: 'Mechanics & Newtonian Systems',
    titleEs: 'Plano Inclinado con Polea y Roce (Atwood en Rampa)',
    titleEn: 'Inclined Plane with Pulley & Friction (Ramp Atwood)',
    subtitleEs: 'El problema rey de Mecánica I: descomposición en ejes rotados, umbral de roce estático vs. cinético y tensiones acopladas.',
    subtitleEn: 'The classic Mechanics I benchmark: rotated coordinate axes, static vs. kinetic friction threshold, and coupled tensions.',
    color: '#0284C7',
    icon: Layers,
    defaults: { m1: 5.0, m2: 4.0, angle: 30, mu: 0.25 },
    sliders: [
      { key: 'm1', labelEs: 'Masa en rampa (m₁)', labelEn: 'Ramp Mass (m₁)', min: 1, max: 12, step: 0.5, unit: ' kg' },
      { key: 'm2', labelEs: 'Masa colgante (m₂)', labelEn: 'Hanging Mass (m₂)', min: 0.5, max: 12, step: 0.5, unit: ' kg' },
      { key: 'angle', labelEs: 'Ángulo de rampa (θ)', labelEn: 'Ramp Angle (θ)', min: 10, max: 65, step: 1, unit: '°' },
      { key: 'mu', labelEs: 'Coef. de Roce (μ)', labelEn: 'Friction Coeff (μ)', min: 0, max: 0.8, step: 0.05, unit: '' }
    ],
    presets: [
      {
        labelEs: 'Equilibrio sin roce (m₂ = m₁·sin30°)',
        labelEn: 'Frictionless Balance (m₂ = m₁·sin30°)',
        values: { m1: 6.0, m2: 3.0, angle: 30, mu: 0.0 }
      },
      {
        labelEs: 'Trabado por Roce Estático (a = 0)',
        labelEn: 'Locked by Static Friction (a = 0)',
        values: { m1: 6.0, m2: 4.0, angle: 30, mu: 0.45 }
      },
      {
        labelEs: 'm₂ domina (Sube por la rampa)',
        labelEn: 'm₂ Dominates (Accelerates Up-Ramp)',
        values: { m1: 4.0, m2: 7.5, angle: 30, mu: 0.2 }
      }
    ],
    algebraSection: {
      titleEs: 'Planteamiento Algebraico y Matricial (DCL → Ecuaciones)',
      titleEn: 'Algebraic & Matrix Formulation (FBD → Equations)',
      formulas: [
        {
          labelEs: '1. Equilibrio eje normal (y′) sobre m₁:',
          labelEn: '1. Normal axis equilibrium (y′) on m₁:',
          latex: '\\sum F_{y\'} = N - m_1 g \\cos\\theta = 0 \\implies N = m_1 g \\cos\\theta',
          eq: '∑F_y′ = N - m₁·g·cos(θ) = 0   ⇒   N = m₁·g·cos(θ)'
        },
        {
          labelEs: '2. Condición de bloqueo estático (¿Se mueve o no?):',
          labelEn: '2. Static lock threshold (Does it move?):',
          latex: '|m_2 g - m_1 g \\sin\\theta| \\le f_{s,\\max} = \\mu m_1 g \\cos\\theta \\implies a = 0',
          eq: '|m₂·g - m₁·g·sin(θ)| ≤ f_s,max = μ·m₁·g·cos(θ)   ⇒   a = 0'
        },
        {
          labelEs: '3. Sistema acoplado 2×2 en movimiento (Forma Matricial):',
          labelEn: '3. Coupled 2×2 system in motion (Matrix Form):',
          eq: '[ m₁   1 ] [ a ] = [ -m₁·g·sin(θ) ∓ μ·m₁·g·cos(θ) ]\n[ m₂  -1 ] [ T ]   [            m₂·g              ]',
          latex: '\\begin{bmatrix} m_1 & 1 \\\\ m_2 & -1 \\end{bmatrix} \\begin{bmatrix} a \\\\ T \\end{bmatrix} = \\begin{bmatrix} -m_1 g \\sin\\theta \\mp \\mu m_1 g \\cos\\theta \\\\ m_2 g \\end{bmatrix}',
        },
        {
          labelEs: '4. Solución explícita de aceleración (si sube por la rampa):',
          labelEn: '4. Explicit acceleration solution (moving up-ramp):',
          eq: 'a = g · (m₂ - m₁·sin(θ) - μ·m₁·cos(θ)) / (m₁ + m₂)',
          latex: 'a = g \\, \\frac{m_2 - m_1 \\sin\\theta - \\mu m_1 \\cos\\theta}{m_1 + m_2}',
        }
      ]
    },
    calculusSection: {
      titleEs: 'Conexión con el Cálculo Diferencial e Integral',
      titleEn: 'Differential & Integral Calculus Connection',
      formulas: [
        {
          labelEs: '1. Ecuación Diferencial de 2º Orden (Cinemática en cuerda inextensible s(t)):',
          labelEn: '1. 2nd-Order Differential Equation (Inextensible string coordinate s(t)):',
          latex: '(m_1 + m_2) \\frac{d^2 s}{dt^2} = (m_2 - m_1 \\sin\\theta) g - \\mu m_1 g \\cos\\theta \\operatorname{sgn}\\left(\\frac{ds}{dt}\\right)',
          eq: '(m₁ + m₂) · (d²s / dt²) = (m₂ - m₁·sin(θ))·g - μ·m₁·g·cos(θ)·sgn(ds/dt)'
        },
        {
          labelEs: '2. Integración temporal para velocidad y posición:',
          labelEn: '2. Time integration for velocity and displacement:',
          latex: 'v(t) = \\int_0^t a(\\tau) d\\tau = a t \\quad ; \\quad s(t) = \\int_0^t v(\\tau) d\\tau = \\frac{1}{2} a t^2',
          eq: 'v(t) = ∫₀ᵗ a(τ) dτ = a·t     ;     s(t) = ∫₀ᵗ v(τ) dτ = ½·a·t²'
        },
        {
          labelEs: '3. Teorema del Trabajo y la Energía No Conservativa:',
          labelEn: '3. Work-Energy Theorem with Non-Conservative Friction:',
          latex: 'W_{\\text{fric}} = -\\int_0^s (\\mu m_1 g \\cos\\theta) dx = \\Delta K + \\Delta U_g = \\frac{1}{2}(m_1+m_2)v^2 + (m_1 \\sin\\theta - m_2)gs',
          eq: 'W_roce = -∫₀ˢ (μ·m₁·g·cos(θ)) dx = ΔK + ΔU_g = ½(m₁+m₂)v² + (m₁·sin(θ) - m₂)g·s'
        }
      ]
    },
    exercise: {
      questionEs:
        'Un bloque de masa m₁ = 6.0 kg descansa sobre un plano inclinado de θ = 30° con coeficiente de roce μ = 0.20, conectado mediante una cuerda ideal a una masa colgante m₂ = 6.0 kg (g = 9.81 m/s²). ¿Cuál es la aceleración del sistema cuando m₂ desciende?',
      questionEn:
        'A block of mass m₁ = 6.0 kg rests on an incline of θ = 30° with friction coefficient μ = 0.20, connected via a massless cord to a hanging mass m₂ = 6.0 kg (g = 9.81 m/s²). What is the system acceleration as m₂ descends?',
      presetValues: { m1: 6.0, m2: 6.0, angle: 30, mu: 0.20 },
      options: [
        { id: 'a', textEs: 'a = 1.60 m/s²', textEn: 'a = 1.60 m/s²', text: 'a = 1.60 m/s²', correct: true },
        { id: 'b', textEs: 'a = 2.45 m/s² (Olvidando el roce)', textEn: 'a = 2.45 m/s² (Neglecting friction)', text: 'a = 2.45 m/s²', correct: false },
        { id: 'c', textEs: 'a = 0.00 m/s² (Bloqueado por roce estático)', textEn: 'a = 0.00 m/s² (Locked by static friction)', text: 'a = 0.00 m/s²', correct: false },
        { id: 'd', textEs: 'a = 3.27 m/s²', textEn: 'a = 3.27 m/s²', text: 'a = 3.27 m/s²', correct: false }
      ],
      hintEs:
        'Plantea el DCL: m₂ tira a favor con m₂·g = 58.86 N. En contra tiran la componente del peso m₁·g·sin(30°) = 29.43 N y el roce f_r = μ·m₁·g·cos(30°) ≈ 10.19 N. Divide la fuerza neta entre la masa total (m₁ + m₂ = 12 kg).',
      hintEn:
        'Set up the FBD: m₂ pulls with m₂·g = 58.86 N. Opposing forces are m₁·g·sin(30°) = 29.43 N and friction f_r = μ·m₁·g·cos(30°) ≈ 10.19 N. Divide net force by total mass (m₁ + m₂ = 12 kg).',
      solutionStepsEs: [
        '1. Normal en la rampa: N = m₁·g·cos(30°) = 6 · 9.81 · 0.866 = 50.97 N.',
        '2. Fuerza de roce oponiéndose a la subida: f_r = μ·N = 0.20 · 50.97 = 10.19 N.',
        '3. Componente gravitatoria en rampa: F_gx = m₁·g·sin(30°) = 6 · 9.81 · 0.5 = 29.43 N.',
        '4. Segunda Ley de Newton al sistema acoplado: a = (m₂g - F_gx - f_r) / (m₁ + m₂) = (58.86 - 29.43 - 10.19) / 12 = 19.24 / 12 = 1.60 m/s².'
      ],
      solutionStepsEn: [
        '1. Normal force on ramp: N = m₁·g·cos(30°) = 6 · 9.81 · 0.866 = 50.97 N.',
        '2. Friction opposing upward motion: f_r = μ·N = 0.20 · 50.97 = 10.19 N.',
        '3. Gravity component along ramp: F_gx = m₁·g·sin(30°) = 6 · 9.81 · 0.5 = 29.43 N.',
        '4. Coupled Newton’s 2nd Law: a = (m₂g - F_gx - f_r) / (m₁ + m₂) = (58.86 - 29.43 - 10.19) / 12 = 19.24 / 12 = 1.60 m/s².'
      ]
    }
  },
  {
    id: 'intro_physics',
    courseId: 'ib',
    badgeEs: 'Introducción a la Física & Cinemática',
    badgeEn: 'Intro to Physics & Kinematics',
    titleEs: 'Tiro Parabólico y Balística con Arrastre Atmosférico',
    titleEn: 'Projectile Motion & Ballistics with Atmospheric Drag',
    subtitleEs: 'Compara en vivo la parábola ideal en el vacío contra la ecuación diferencial real con resistencia del aire.',
    subtitleEn: 'Compare the ideal vacuum parabola against the real differential equation with air drag.',
    color: '#059669',
    icon: Target,
    defaults: { v0: 28, angle: 45, g: 9.81, drag: 0.12 },
    sliders: [
      { key: 'v0', labelEs: 'Velocidad inicial (v₀)', labelEn: 'Initial Velocity (v₀)', min: 10, max: 45, step: 1, unit: ' m/s' },
      { key: 'angle', labelEs: 'Ángulo de disparo (θ)', labelEn: 'Launch Angle (θ)', min: 15, max: 80, step: 1, unit: '°' },
      { key: 'g', labelEs: 'Gravedad (g)', labelEn: 'Gravity (g)', min: 1.6, max: 15.0, step: 0.2, unit: ' m/s²' },
      { key: 'drag', labelEs: 'Arrastre del aire (γ/m)', labelEn: 'Air Drag (γ/m)', min: 0.0, max: 0.4, step: 0.02, unit: ' s⁻¹' }
    ],
    presets: [
      {
        labelEs: 'Vacío Ideal (Alcance Máximo 45°)',
        labelEn: 'Ideal Vacuum (Max Range 45°)',
        values: { v0: 30, angle: 45, g: 9.81, drag: 0.0 }
      },
      {
        labelEs: 'Atmósfera Densa (Asimetría por Roce)',
        labelEn: 'Dense Atmosphere (Drag Asymmetry)',
        values: { v0: 35, angle: 50, g: 9.81, drag: 0.28 }
      },
      {
        labelEs: 'Gravedad Lunar (g = 1.62 m/s²)',
        labelEn: 'Lunar Gravity (g = 1.62 m/s²)',
        values: { v0: 18, angle: 40, g: 1.62, drag: 0.0 }
      }
    ],
    algebraSection: {
      titleEs: 'Descomposición Vectorial y Álgebra Parabólica (Caso γ = 0)',
      titleEn: 'Vector Decomposition & Parabolic Algebra (Case γ = 0)',
      formulas: [
        {
          labelEs: '1. Componentes iniciales de velocidad:',
          labelEn: '1. Initial velocity vector components:',
          latex: 'v_{0x} = v_0 \\cos\\theta \\quad ; \\quad v_{0y} = v_0 \\sin\\theta',
          eq: 'v₀ₓ = v₀ · cos(θ)     ;     v₀ᵧ = v₀ · sin(θ)'
        },
        {
          labelEs: '2. Eliminación algebraica del tiempo t para obtener la parábola y(x):',
          labelEn: '2. Algebraic elimination of time t to get parabola y(x):',
          eq: 'y(x) = x · tan(θ) - [ g / (2 · v₀² · cos²(θ)) ] · x²',
          latex: 'y(x) = x \\tan\\theta - \\frac{g}{2 v_0^2 \\cos^2\\theta} \\, x^2',
        },
        {
          labelEs: '3. Alcance horizontal máximo (R) y Altura máxima (H):',
          labelEn: '3. Maximum horizontal range (R) and Peak Altitude (H):',
          eq: 'R = (v₀² · sin(2θ)) / g     ;     H = (v₀² · sin²(θ)) / (2g)',
          latex: 'R = \\frac{v_0^2 \\sin 2\\theta}{g} \\quad ; \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g}',
        }
      ]
    },
    calculusSection: {
      titleEs: 'Formulaciones con Cálculo Diferencial (Pendiente y Arrastre)',
      titleEn: 'Differential Calculus Formulation (Tangent Slope & Drag)',
      formulas: [
        {
          labelEs: '1. La derivada espacial como dirección instantánea del vector velocidad:',
          labelEn: '1. Spatial derivative as instantaneous velocity slope:',
          latex: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{v_y(t)}{v_x(t)} = \\tan\\alpha(t)',
          eq: 'dy / dx = (dy/dt) / (dx/dt) = vᵧ(t) / vₓ(t) = tan(α(t))'
        },
        {
          labelEs: '2. Ecuación Diferencial Vectorial con Arrastre Lineal (F_d = -γ·v):',
          labelEn: '2. Vector Differential Equation with Linear Drag (F_d = -γ·v):',
          latex: 'm \\frac{d\\mathbf{v}}{dt} = m\\mathbf{g} - \\gamma \\mathbf{v} \\implies \\frac{dv_x}{dt} = -\\frac{\\gamma}{m}v_x, \\quad \\frac{dv_y}{dt} = -g - \\frac{\\gamma}{m}v_y',
          eq: 'm · (dv⃗ / dt) = m·g⃗ - γ·v⃗   ⇒   dvₓ/dt = -(γ/m)vₓ  ,  dvᵧ/dt = -g - (γ/m)vᵧ'
        },
        {
          labelEs: '3. Solución analítica por separación de variables:',
          labelEn: '3. Analytical solution via separation of variables:',
          latex: 'x(t) = \\frac{m v_{0x}}{\\gamma}(1 - e^{-\\gamma t/m}) \\quad ; \\quad v_y(t) = -\\frac{mg}{\\gamma} + \\left(v_{0y} + \\frac{mg}{\\gamma}\\right)e^{-\\gamma t/m}',
          eq: 'x(t) = (m·v₀ₓ/γ)·(1 - e^(-γt/m))   ;   vᵧ(t) = -m·g/γ + (v₀ᵧ + m·g/γ)·e^(-γt/m)'
        }
      ]
    },
    exercise: {
      questionEs:
        'Se lanza un proyectil en vacío (γ = 0) con velocidad inicial v₀ = 30 m/s y ángulo θ = 45° en la Tierra (g = 9.81 m/s²). ¿Cuál es su alcance horizontal total R y cuánto vale la derivada dy/dx justo en el punto de altura máxima?',
      questionEn:
        'A projectile is launched in vacuum (γ = 0) with v₀ = 30 m/s at θ = 45° on Earth (g = 9.81 m/s²). What is its horizontal range R and the derivative dy/dx at the exact peak altitude?',
      presetValues: { v0: 30, angle: 45, g: 9.81, drag: 0.0 },
      options: [
        { id: 'a', textEs: 'R = 91.74 m  y  dy/dx = 0 (en el vértice)', textEn: 'R = 91.74 m  and  dy/dx = 0 (at vertex)', text: 'R = 91.74 m, dy/dx = 0', correct: true },
        { id: 'b', textEs: 'R = 45.87 m  y  dy/dx = 1', textEn: 'R = 45.87 m  and  dy/dx = 1', text: 'R = 45.87 m, dy/dx = 1', correct: false },
        { id: 'c', textEs: 'R = 91.74 m  y  dy/dx = -9.81', textEn: 'R = 91.74 m  and  dy/dx = -9.81', text: 'R = 91.74 m, dy/dx = -9.81', correct: false },
        { id: 'd', textEs: 'R = 64.87 m  y  dy/dx = 0', textEn: 'R = 64.87 m  and  dy/dx = 0', text: 'R = 64.87 m, dy/dx = 0', correct: false }
      ],
      hintEs:
        'Usa R = (v₀² · sin(90°)) / g. En el ápice de la trayectoria, la componente vertical de la velocidad vᵧ se anula instantáneamente.',
      hintEn:
        'Use R = (v₀² · sin(90°)) / g. At the trajectory apex, the vertical velocity component vᵧ is instantaneously zero.',
      solutionStepsEs: [
        '1. En el punto más alto (extremo local de y(x)), la tangente es horizontal: dy/dx = vᵧ / vₓ = 0 / v₀ₓ = 0.',
        '2. Sustituyendo en la fórmula de alcance: R = (30² · sin(2·45°)) / 9.81 = 900 / 9.81 = 91.74 m.',
        '3. La altura máxima alcanzada es H = (900 · sin²(45°)) / (2 · 9.81) = 450 / 19.62 = 22.94 m.'
      ],
      solutionStepsEn: [
        '1. At the highest point (local extremum of y(x)), the tangent is horizontal: dy/dx = vᵧ / vₓ = 0 / v₀ₓ = 0.',
        '2. Substituting into the range equation: R = (30² · sin(2·45°)) / 9.81 = 900 / 9.81 = 91.74 m.',
        '3. Peak altitude is H = (900 · sin²(45°)) / (2 · 9.81) = 450 / 19.62 = 22.94 m.'
      ]
    }
  },
  {
    id: 'engineering',
    courseId: 'klausur',
    badgeEs: 'Introducción a la Ingeniería & Oscilaciones',
    badgeEn: 'Intro to Engineering & Vibrations',
    titleEs: 'Puente / Viga en Equilibrio y Resonancia Masa-Resorte-Amortiguador',
    titleEn: 'Bridge Beam Equilibrium & Mass-Spring-Damper Resonance',
    subtitleEs: 'Combina la Estática de Ingeniería (reacciones en apoyos y torques) con el cálculo de vibraciones mecánicas amortiguadas.',
    subtitleEn: 'Combines Engineering Statics (support reactions & torques) with damped mechanical vibration calculus.',
    color: '#D97706',
    icon: Cpu,
    defaults: { loadPos: 6.0, mass: 50, k: 120, damping: 12 },
    sliders: [
      { key: 'loadPos', labelEs: 'Posición de carga (x_L)', labelEn: 'Load Position (x_L)', min: 1, max: 9, step: 0.5, unit: ' m' },
      { key: 'mass', labelEs: 'Masa del equipo (M)', labelEn: 'Equipment Mass (M)', min: 10, max: 100, step: 5, unit: ' kg' },
      { key: 'k', labelEs: 'Rigidez estructural (k)', labelEn: 'Structural Stiffness (k)', min: 40, max: 300, step: 10, unit: ' N/m' },
      { key: 'damping', labelEs: 'Amortiguador (c)', labelEn: 'Damping (c)', min: 0, max: 60, step: 2, unit: ' N·s/m' }
    ],
    presets: [
      {
        labelEs: 'Carga Centrada (x_L = 5 m, Simetría R_A = R_B)',
        labelEn: 'Centered Load (x_L = 5 m, Symmetry R_A = R_B)',
        values: { loadPos: 5.0, mass: 60, k: 150, damping: 14 }
      },
      {
        labelEs: 'Sub-amortiguado (Oscilación libre c = 4)',
        labelEn: 'Underdamped (Strong Oscillation c = 4)',
        values: { loadPos: 7.0, mass: 50, k: 180, damping: 4 }
      },
      {
        labelEs: 'Amortiguamiento Crítico (Sin rebote)',
        labelEn: 'Critical Damping (Zero Overshoot)',
        values: { loadPos: 7.5, mass: 40, k: 160, damping: 56 }
      }
    ],
    algebraSection: {
      titleEs: 'Estática Algebraica: Equilibrio de Fuerzas y Momentos (Torques)',
      titleEn: 'Algebraic Statics: Force & Moment (Torque) Equilibrium',
      formulas: [
        {
          labelEs: '1. Condiciones fundamentales de equilibrio estático en el plano:',
          labelEn: '1. Fundamental planar static equilibrium conditions:',
          latex: '\\sum F_x = 0, \\quad \\sum F_y = R_A + R_B - M g = 0, \\quad \\sum M_A = R_B L - M g x_L = 0',
          eq: '∑Fₓ = 0   ,   ∑Fᵧ = R_A + R_B - M·g = 0   ,   ∑M_A = R_B·L - (M·g)·x_L = 0'
        },
        {
          labelEs: '2. Reacciones exactas en los apoyos A (x=0) y B (x=L=10m):',
          labelEn: '2. Exact reactions at supports A (x=0) and B (x=L=10m):',
          latex: 'R_B = M g \\frac{x_L}{L} \\quad ; \\quad R_A = M g \\left(1 - \\frac{x_L}{L}\\right)',
          eq: 'R_B = M·g · (x_L / L)     ;     R_A = M·g · (1 - x_L / L)'
        },
        {
          labelEs: '3. Momento flector máximo bajo el punto de aplicación de la carga:',
          labelEn: '3. Maximum bending moment right under the point load:',
          latex: 'M_{\\max} = R_A x_L = M g x_L \\left(1 - \\frac{x_L}{L}\\right)',
          eq: 'M_max = R_A · x_L = M·g · x_L · (1 - x_L / L)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Cálculo Diferencial: EDO de Vibraciones y Curva Elástica',
      titleEn: 'Differential Calculus: Vibration ODE & Elastic Deflection',
      formulas: [
        {
          labelEs: '1. Relación diferencial entre Carga q(x), Cortante V(x) y Momento M(x):',
          labelEn: '1. Differential relation between Load q(x), Shear V(x), and Moment M(x):',
          latex: '\\frac{dV}{dx} = -q(x), \\quad \\frac{dM}{dx} = V(x), \\quad E I \\frac{d^2 w}{dx^2} = -M(x)',
          eq: 'dV / dx = -q(x)     ;     dM / dx = V(x)     ;     EI · (d²w / dx²) = M(x)'
        },
        {
          labelEs: '2. EDO de 2º orden para la vibración vertical u(t) del soporte elástico:',
          labelEn: '2. 2nd-order ODE for vertical vibration u(t) of the elastic mount:',
          latex: 'M \\frac{d^2 u}{dt^2} + c \\frac{du}{dt} + k u(t) = 0',
          eq: 'M · (d²u / dt²) + c · (du / dt) + k · u(t) = 0'
        },
        {
          labelEs: '3. Polinomio característico (λ²·M + λ·c + k = 0) y solución sub-amortiguada:',
          labelEn: '3. Characteristic polynomial (λ²·M + λ·c + k = 0) & underdamped solution:',
          latex: 'u(t) = A e^{-\\gamma t} \\cos(\\omega_d t - \\phi), \\quad \\gamma = \\frac{c}{2M}, \\quad \\omega_d = \\sqrt{\\frac{k}{M} - \\gamma^2}',
          eq: 'u(t) = A · e^(-γt) · cos(ω_d·t - φ)',
          eqEs: 'u(t) = A · e^(-γt) · cos(ω_d·t - φ)   con   γ = c/(2M) , ω_d = √(k/M - γ²)',
          eqEn: 'u(t) = A · e^(-γt) · cos(ω_d·t - φ)   with   γ = c/(2M) , ω_d = √(k/M - γ²)'
        }
      ]
    },
    exercise: {
      questionEs:
        'Sobre una viga de longitud L = 10 m apoya un equipo de masa M = 80 kg en la posición x_L = 7.5 m desde el apoyo izquierdo A (usa g = 9.81 m/s²). ¿Cuáles son las fuerzas de reacción vertical R_A y R_B en los apoyos?',
      questionEn:
        'On a beam of length L = 10 m rests a machine of mass M = 80 kg at position x_L = 7.5 m from left support A (use g = 9.81 m/s²). What are the vertical support reactions R_A and R_B?',
      presetValues: { loadPos: 7.5, mass: 80, k: 160, damping: 16 },
      options: [
        { id: 'a', textEs: 'R_A = 196.2 N  y  R_B = 588.6 N', textEn: 'R_A = 196.2 N  and  R_B = 588.6 N', text: 'R_A = 196.2 N, R_B = 588.6 N', correct: true },
        { id: 'b', textEs: 'R_A = 392.4 N  y  R_B = 392.4 N', textEn: 'R_A = 392.4 N  and  R_B = 392.4 N', text: 'R_A = 392.4 N, R_B = 392.4 N', correct: false },
        { id: 'c', textEs: 'R_A = 588.6 N  y  R_B = 196.2 N', textEn: 'R_A = 588.6 N  and  R_B = 196.2 N', text: 'R_A = 588.6 N, R_B = 196.2 N', correct: false },
        { id: 'd', textEs: 'R_A = 245.0 N  y  R_B = 539.8 N', textEn: 'R_A = 245.0 N  and  R_B = 539.8 N', text: 'R_A = 245.0 N, R_B = 539.8 N', correct: false }
      ],
      hintEs:
        'Toma sumatoria de torques respecto al apoyo izquierdo A: ∑M_A = R_B·(10 m) - (80 · 9.81 N)·(7.5 m) = 0. Como la carga está a 3/4 del camino hacia B, B soporta 3/4 del peso total.',
      hintEn:
        'Take sum of moments about left support A: ∑M_A = R_B·(10 m) - (80 · 9.81 N)·(7.5 m) = 0. Since the load is 3/4 of the way toward B, support B carries 3/4 of the weight.',
      solutionStepsEs: [
        '1. Peso total de la carga: W = M·g = 80 · 9.81 = 784.8 N.',
        '2. Equilibrio de momentos respecto a A (∑M_A = 0): R_B · 10 - 784.8 · 7.5 = 0  ⇒  R_B = 784.8 · 0.75 = 588.6 N.',
        '3. Equilibrio de fuerzas verticales (∑F_y = 0): R_A = W - R_B = 784.8 - 588.6 = 196.2 N.'
      ],
      solutionStepsEn: [
        '1. Total weight of the load: W = M·g = 80 · 9.81 = 784.8 N.',
        '2. Moment equilibrium about A (∑M_A = 0): R_B · 10 - 784.8 · 7.5 = 0  ⇒  R_B = 784.8 · 0.75 = 588.6 N.',
        '3. Vertical force equilibrium (∑F_y = 0): R_A = W - R_B = 784.8 - 588.6 = 196.2 N.'
      ]
    }
  },
  {
    id: 'electromagnetism',
    courseId: 'klausur',
    badgeEs: 'Electromagnetismo & Campos',
    badgeEn: 'Electromagnetism & Fields',
    titleEs: 'Fuerza de Lorentz: Selector de Velocidades (Campos E⃗ y B⃗ Cruzados)',
    titleEn: 'Lorentz Force: Velocity Selector (Crossed E⃗ & B⃗ Fields)',
    subtitleEs: 'Visualiza el producto vectorial v⃗ × B⃗ en 3D y descubre cuándo la fuerza eléctrica y magnética se cancelan exactamente.',
    subtitleEn: 'Visualize the 3D cross product v⃗ × B⃗ and discover when electric and magnetic forces cancel out.',
    color: '#7C3AED',
    icon: Magnet,
    defaults: { E: 40, B: 2.0, v0: 20, qSign: 1 },
    sliders: [
      { key: 'E', labelEs: 'Campo Eléctrico (E)', labelEn: 'Electric Field (E)', min: 0, max: 80, step: 5, unit: ' V/m' },
      { key: 'B', labelEs: 'Campo Magnético (B)', labelEn: 'Magnetic Field (B)', min: 0.5, max: 4.0, step: 0.25, unit: ' T' },
      { key: 'v0', labelEs: 'Velocidad partícula (v₀)', labelEn: 'Particle Velocity (v₀)', min: 5, max: 40, step: 1, unit: ' m/s' },
      { key: 'qSign', labelEs: 'Carga q (+1 o -1)', labelEn: 'Charge q (+1 or -1)', min: -1, max: 1, step: 2, unit: ' e' }
    ],
    presets: [
      {
        labelEs: 'Filtro Perfecto: v₀ = E/B (Pasa recto sin desviarse)',
        labelEn: 'Perfect Filter: v₀ = E/B (Zero Deflection)',
        values: { E: 40, B: 2.0, v0: 20, qSign: 1 }
      },
      {
        labelEs: 'Sólo Campo Magnético (E = 0, Órbita de Ciclotrón)',
        labelEn: 'Pure Magnetic Field (E = 0, Cyclotron Orbit)',
        values: { E: 0, B: 2.5, v0: 22, qSign: 1 }
      },
      {
        labelEs: 'Fuerza Magnética Domina (v₀ > E/B)',
        labelEn: 'Magnetic Force Dominates (v₀ > E/B)',
        values: { E: 30, B: 2.5, v0: 32, qSign: 1 }
      }
    ],
    algebraSection: {
      titleEs: 'Álgebra Vectorial: Producto Cruz y Condición de Filtro',
      titleEn: 'Vector Algebra: Cross Product & Velocity Filter Condition',
      formulas: [
        {
          labelEs: '1. Fuerza de Lorentz total sobre una carga puntual q:',
          labelEn: '1. Total Lorentz force on a point charge q:',
          latex: '\\mathbf{F}_{\\text{total}} = \\mathbf{F}_E + \\mathbf{F}_B = q \\mathbf{E} + q (\\mathbf{v} \\times \\mathbf{B})',
          eq: 'F⃗_total = F⃗_E + F⃗_B = q·E⃗ + q·(v⃗ × B⃗)'
        },
        {
          labelEs: '2. Con E⃗ = -E·ĵ (hacia abajo), B⃗ = -B·k̂ (entrando) y v⃗ = v₀·î:',
          labelEn: '2. With E⃗ = -E·ĵ (downward), B⃗ = -B·k̂ (into page), and v⃗ = v₀·î:',
          latex: 'F_y = q (-E + v_0 B) \\implies F_{\\text{net}, y} = 0 \\iff v_0 = \\frac{E}{B}',
          eq: 'Fᵧ = q · ( -E + v₀ · B )'
        },
        {
          labelEs: '3. Condición de equilibrio dinámico (Trayectoria rectilínea Fᵧ = 0):',
          labelEn: '3. Dynamic equilibrium condition (Straight trajectory Fᵧ = 0):',
          latex: 'q E = q v_0 B \\implies v_{\\text{filter}} = \\frac{E}{B}',
          eq: 'q·E = q·v₀·B   ⇒   v_filtro = E / B   (¡Independiente de la masa y del signo de q!)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Cálculo Vectorial y Sistema de EDOs Acopladas',
      titleEn: 'Vector Calculus & Coupled ODE System',
      formulas: [
        {
          labelEs: '1. Sistema de ecuaciones diferenciales acopladas de movimiento:',
          labelEn: '1. Coupled differential equations of motion:',
          latex: 'm \\frac{dv_x}{dt} = -q B v_y \\quad ; \\quad m \\frac{dv_y}{dt} = q (v_x B - E)',
          eq: 'm · (dvₓ / dt) = -q·B·vᵧ     ;     m · (dvᵧ / dt) = q·(vₓ·B - E)'
        },
        {
          labelEs: '2. Potencia magnética nula (demostración por producto mixto):',
          labelEn: '2. Zero magnetic work (proof via scalar triple product):',
          latex: '\\frac{dK_B}{dt} = \\mathbf{F}_B \\cdot \\frac{d\\mathbf{r}}{dt} = q (\\mathbf{v} \\times \\mathbf{B}) \\cdot \\mathbf{v} = 0 \\implies |\\mathbf{v}| = \\text{const}',
          eq: 'dK_B / dt = F⃗_B · (dr⃗/dt) = q·(v⃗ × B⃗) · v⃗ = 0   ⇒   B⃗ nunca cambia la rapidez |v⃗| si E⃗ = 0'
        },
        {
          labelEs: '3. Frecuencia angular de ciclotrón (ω_c) y Radio de Larmor (R_L):',
          labelEn: '3. Cyclotron angular frequency (ω_c) and Larmor Radius (R_L):',
          latex: '\\omega_c = \\frac{q B}{m}, \\quad r_L = \\frac{m v_0}{q B}',
          eq: 'ω_c = |q|·B / m     ;     R_L = (m · v_⊥) / (|q| · B)'
        }
      ]
    },
    exercise: {
      questionEs:
        'Un haz de iones entra a un selector de velocidades donde el campo eléctrico es E = 60 V/m (hacia abajo) y el campo magnético perpendicular es B = 2.0 T. ¿Qué velocidad v₀ deben tener los iones para cruzar sin desviarse por la rendija central?',
      questionEn:
        'An ion beam enters a velocity selector where the electric field is E = 60 V/m (downward) and the perpendicular magnetic field is B = 2.0 T. What speed v₀ must the ions have to pass straight through the central slit?',
      presetValues: { E: 60, B: 2.0, v0: 30, qSign: 1 },
      options: [
        { id: 'a', textEs: 'v₀ = 30 m/s (Independiente de la carga q)', textEn: 'v₀ = 30 m/s (Independent of charge q)', text: 'v₀ = 30 m/s', correct: true },
        { id: 'b', textEs: 'v₀ = 120 m/s', textEn: 'v₀ = 120 m/s', text: 'v₀ = 120 m/s', correct: false },
        { id: 'c', textEs: 'v₀ = 15 m/s', textEn: 'v₀ = 15 m/s', text: 'v₀ = 15 m/s', correct: false },
        { id: 'd', textEs: 'Depende de si la carga q es positiva o negativa', textEn: 'Depends on whether charge q is positive or negative', text: 'Depends on charge sign', correct: false }
      ],
      hintEs:
        'Para que el ion viaje en línea recta horizontal, la sumatoria de fuerzas verticales en el DCL debe ser cero: |F_E| = |F_B|  ⇒  |q|·E = |q|·v₀·B.',
      hintEn:
        'For the ion to travel in a straight horizontal line, the vertical net force on the FBD must be zero: |F_E| = |F_B|  ⇒  |q|·E = |q|·v₀·B.',
      solutionStepsEs: [
        '1. Planteamos el DCL vertical sobre la partícula: F_y = q·(v₀·B - E).',
        '2. Igualamos a cero para que no haya aceleración transversal (d²y/dt² = 0): v₀·B = E.',
        '3. Despejamos v₀ = E / B = 60 / 2.0 = 30 m/s (nota que q se cancela en ambos lados).'
      ],
      solutionStepsEn: [
        '1. Set up the vertical FBD on the particle: F_y = q·(v₀·B - E).',
        '2. Set net force to zero for zero transverse acceleration (d²y/dt² = 0): v₀·B = E.',
        '3. Solve for v₀ = E / B = 60 / 2.0 = 30 m/s (notice charge q cancels on both sides).'
      ]
    }
  },
  {
    id: 'thermodynamics',
    courseId: 'mechanics',
    badgeEs: 'Termodinámica & Física Estadística',
    badgeEn: 'Thermodynamics & Statistical Physics',
    titleEs: 'Cilindro-Pistón de Gas Ideal y Trabajo en Diagrama P-V',
    titleEn: 'Ideal Gas Piston-Cylinder & Work on P-V Diagram',
    subtitleEs: 'Conecta el DCL mecánico del émbolo con la integral termodinámica W = ∫ P(V) dV y la agitación molecular.',
    subtitleEn: 'Connect the mechanical FBD of the piston with the thermodynamic integral W = ∫ P(V) dV and molecular motion.',
    color: '#EA580C',
    icon: Flame,
    defaults: { V1: 2.0, V2: 5.0, T: 350, processType: 1 },
    sliders: [
      { key: 'V1', labelEs: 'Volumen Inicial (V₁)', labelEn: 'Initial Volume (V₁)', min: 1.0, max: 4.0, step: 0.5, unit: ' L' },
      { key: 'V2', labelEs: 'Volumen Final (V₂)', labelEn: 'Final Volume (V₂)', min: 2.0, max: 8.0, step: 0.5, unit: ' L' },
      { key: 'T', labelEs: 'Temperatura (T)', labelEn: 'Temperature (T)', min: 200, max: 600, step: 25, unit: ' K' },
      { key: 'processType', labelEs: 'Proceso (1=Isotérmico, 2=Isobárico)', labelEn: 'Process (1=Isothermal, 2=Isobaric)', min: 1, max: 2, step: 1, unit: '' }
    ],
    presets: [
      {
        labelEs: 'Expansión Isotérmica al Doble (V₂ = 2·V₁)',
        labelEn: 'Isothermal Doubling Expansion (V₂ = 2·V₁)',
        values: { V1: 2.5, V2: 5.0, T: 400, processType: 1 }
      },
      {
        labelEs: 'Expansión Isobárica a Presión Constante',
        labelEn: 'Isobaric Constant-Pressure Expansion',
        values: { V1: 2.0, V2: 6.0, T: 350, processType: 2 }
      },
      {
        labelEs: 'Compresión Isotérmica (W < 0, Trabajo sobre el gas)',
        labelEn: 'Isothermal Compression (W < 0, Work on Gas)',
        values: { V1: 4.0, V2: 2.0, T: 300, processType: 1 }
      }
    ],
    algebraSection: {
      titleEs: 'Equilibrio Mecánico del Émbolo y Primera Ley (Álgebra)',
      titleEn: 'Mechanical Piston Balance & First Law (Algebra)',
      formulas: [
        {
          labelEs: '1. DCL cuasi-estático del émbolo de área A y masa M_p:',
          labelEn: '1. Quasi-static FBD of the piston with area A and mass M_p:',
          latex: 'P_1 V_1 = P_2 V_2 = n R T = \\text{const} \\quad (T = \\text{const})',
          eq: '∑Fᵧ = F_gas - F_atm - M_p·g = 0   ⇒   P_gas · A = P₀ · A + M_p · g'
        },
        {
          labelEs: '2. Ecuación de Estado del Gas Ideal y Energía Interna (gas monoatómico):',
          labelEn: '2. Ideal Gas Equation of State & Internal Energy (monatomic):',
          latex: 'P = P_0 + \\frac{M_p g}{A}',
          eq: 'P · V = n · R · T     ;     U = (3/2) · n · R · T'
        },
        {
          labelEs: '3. Primera Ley de la Termodinámica (Conservación de Energía):',
          labelEn: '3. First Law of Thermodynamics (Energy Conservation):',
          latex: '\\Delta U = Q - W = 0 \\implies Q = W',
          eq: 'ΔU = Q - W   (En proceso isotérmico ΔT = 0  ⇒  ΔU = 0  ⇒  Q = W)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Cálculo Integral: Trabajo como Área bajo la Curva P(V)',
      titleEn: 'Integral Calculus: Work as Area under the P(V) Curve',
      formulas: [
        {
          labelEs: '1. Definición diferencial del trabajo mecánico de frontera:',
          labelEn: '1. Differential definition of boundary mechanical work:',
          latex: 'W = \\int_{V_1}^{V_2} P(V) dV = \\int_{V_1}^{V_2} \\frac{n R T}{V} dV = n R T \\ln\\left(\\frac{V_2}{V_1}\\right)',
          eq: 'δW = F_gas · dy = (P · A) · dy = P · dV'
        },
        {
          labelEs: '2. Integración en Expansión Isotérmica (T = cte, P(V) = nRT / V):',
          labelEn: '2. Integration for Isothermal Expansion (T = const, P(V) = nRT / V):',
          latex: '\\Delta S_{\\text{gas}} = \\int_{T_1}^{T_2} \\frac{C_V dT}{T} + \\int_{V_1}^{V_2} \\frac{n R dV}{V} = n R \\ln\\left(\\frac{V_2}{V_1}\\right)',
          eq: 'W_iso = ∫_{V₁}^{V₂} (nRT / V) dV = n·R·T · ln(V₂ / V₁)'
        },
        {
          labelEs: '3. Integración en Proceso Isobárico (P = cte) y Cambio de Entropía:',
          labelEn: '3. Integration for Isobaric Process (P = const) & Entropy Change:',
          latex: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}',
          eq: 'W_isob = ∫_{V₁}^{V₂} P₀ dV = P₀ · (V₂ - V₁)     ;     ΔS = ∫ (δQ_rev / T)'
        }
      ]
    },
    exercise: {
      questionEs:
        'Un mol (n = 1) de gas ideal se expande isotérmicamente a T = 400 K desde un volumen inicial V₁ = 2.5 L hasta V₂ = 5.0 L (R = 8.314 J/(mol·K)). ¿Cuánto trabajo W realiza el gas y cuánto vale el cambio de energía interna ΔU?',
      questionEn:
        'One mole (n = 1) of an ideal gas expands isothermally at T = 400 K from V₁ = 2.5 L to V₂ = 5.0 L (R = 8.314 J/(mol·K)). How much work W does the gas perform, and what is ΔU?',
      presetValues: { V1: 2.5, V2: 5.0, T: 400, processType: 1 },
      options: [
        { id: 'a', textEs: 'W = +2305 J   y   ΔU = 0 J (Expansión isotérmica)', textEn: 'W = +2305 J   and   ΔU = 0 J (Isothermal expansion)', text: 'W = +2305 J, ΔU = 0 J', correct: true },
        { id: 'b', textEs: 'W = +3326 J   y   ΔU = +3326 J', textEn: 'W = +3326 J   and   ΔU = +3326 J', text: 'W = +3326 J, ΔU = +3326 J', correct: false },
        { id: 'c', textEs: 'W = -2305 J   y   ΔU = 0 J', textEn: 'W = -2305 J   and   ΔU = 0 J', text: 'W = -2305 J, ΔU = 0 J', correct: false },
        { id: 'd', textEs: 'W = +1663 J   y   ΔU = -1663 J', textEn: 'W = +1663 J   and   ΔU = -1663 J', text: 'W = +1663 J, ΔU = -1663 J', correct: false }
      ],
      hintEs:
        'En un gas ideal la energía interna U depende exclusivamente de la temperatura T. Como T = 400 K es constante, ΔU = 0. Usa la integral W = n·R·T·ln(V₂/V₁) con ln(2) ≈ 0.6931.',
      hintEn:
        'For an ideal gas, internal energy U depends solely on temperature T. Since T = 400 K is constant, ΔU = 0. Use the integral W = n·R·T·ln(V₂/V₁) with ln(2) ≈ 0.6931.',
      solutionStepsEs: [
        '1. Como el proceso es isotérmico (dT = 0), el cambio de energía interna es ΔU = (3/2)nRΔT = 0 J.',
        '2. Integramos la curva P(V) = nRT/V: W = ∫ P dV = (1 mol)·(8.314 J/mol·K)·(400 K)·ln(5.0 / 2.5).',
        '3. Calculando: W = 3325.6 · ln(2) = 3325.6 · 0.69315 ≈ +2305 J (Por 1ª Ley, absorbe Q = +2305 J de calor).'
      ],
      solutionStepsEn: [
        '1. Since the process is isothermal (dT = 0), the change in internal energy is ΔU = (3/2)nRΔT = 0 J.',
        '2. Integrate P(V) = nRT/V: W = ∫ P dV = (1 mol)·(8.314 J/mol·K)·(400 K)·ln(5.0 / 2.5).',
        '3. Evaluating: W = 3325.6 · ln(2) = 3325.6 · 0.69315 ≈ +2305 J (By the 1st Law, heat absorbed is Q = +2305 J).'
      ]
    }
  },
  {
    id: 'waves_geophysics',
    courseId: 'geophysics',
    badgeEs: 'Ondas, Óptica & Geofísica Aplicada',
    badgeEn: 'Waves, Optics & Applied Geophysics',
    titleEs: 'Refracción Sísmica / Óptica, Ley de Snell y Ángulo Crítico',
    titleEn: 'Seismic / Optical Refraction, Snell’s Law & Critical Angle',
    subtitleEs: 'Observa cómo una onda P o haz de luz se refleja y refracta entre dos estratos, deducido del Principio de Fermat (dT/dx = 0).',
    subtitleEn: 'Watch a P-wave or light beam reflect and refract across two strata, derived via Fermat’s Principle (dT/dx = 0).',
    color: '#DC2626',
    icon: Activity,
    defaults: { theta1: 28, v1: 2.0, v2: 3.5, freq: 2.0 },
    sliders: [
      { key: 'theta1', labelEs: 'Ángulo de incidencia (θ₁)', labelEn: 'Incidence Angle (θ₁)', min: 5, max: 75, step: 1, unit: '°' },
      { key: 'v1', labelEs: 'Velocidad Estrato 1 (v₁)', labelEn: 'Layer 1 Velocity (v₁)', min: 1.0, max: 4.5, step: 0.25, unit: ' km/s' },
      { key: 'v2', labelEs: 'Velocidad Estrato 2 (v₂)', labelEn: 'Layer 2 Velocity (v₂)', min: 1.0, max: 5.0, step: 0.25, unit: ' km/s' },
      { key: 'freq', labelEs: 'Frecuencia de onda (f)', labelEn: 'Wave Frequency (f)', min: 1.0, max: 4.0, step: 0.5, unit: ' Hz' }
    ],
    presets: [
      {
        labelEs: 'Refracción Estándar (v₂ > v₁, Se aleja de la normal)',
        labelEn: 'Standard Refraction (v₂ > v₁, Bends away from normal)',
        values: { theta1: 25, v1: 2.0, v2: 3.5, freq: 2.0 }
      },
      {
        labelEs: 'Ángulo Crítico / Onda Sísmica Refractada (θ₁ = 30°)',
        labelEn: 'Critical Angle / Seismic Head Wave (θ₁ = 30°)',
        values: { theta1: 30, v1: 2.0, v2: 4.0, freq: 2.5 }
      },
      {
        labelEs: 'Reflexión Total Interna (sin(θ₁) > v₁/v₂)',
        labelEn: 'Total Internal Reflection (sin(θ₁) > v₁/v₂)',
        values: { theta1: 48, v1: 2.0, v2: 4.0, freq: 2.5 }
      }
    ],
    algebraSection: {
      titleEs: 'Relación Algebraica y Trigonometría de Frentes de Onda',
      titleEn: 'Algebraic Wavefront Trigonometry & Snell’s Law',
      formulas: [
        {
          labelEs: '1. Ley de reflexión y Ley de refracción de Snell:',
          labelEn: '1. Law of reflection and Snell’s Law of refraction:',
          latex: '\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2} = p \\quad (\\text{Ray parameter } p)',
          eq: 'θ_reflexión = θ₁     ;     sin(θ₁) / v₁ = sin(θ₂) / v₂'
        },
        {
          labelEs: '2. Condición de Ángulo Crítico (θ₂ = 90°, Onda de Cabeza / Head Wave):',
          labelEn: '2. Critical Angle Condition (θ₂ = 90°, Seismic Head Wave):',
          latex: '\\sin\\theta_c = \\frac{v_1}{v_2} \\implies \\theta_c = \\arcsin\\left(\\frac{v_1}{v_2}\\right) \\quad (v_2 > v_1)',
          eq: 'sin(θ_c) = v₁ / v₂   (Existe sólo si el estrato inferior es más rápido: v₂ > v₁)'
        },
        {
          labelEs: '3. Conservación de la componente horizontal del vector de onda (kₓ):',
          labelEn: '3. Conservation of horizontal wavevector component (kₓ):',
          latex: 'k_1 \\sin\\theta_1 = k_2 \\sin\\theta_2, \\quad k_i = \\frac{\\omega}{v_i}',
          eq: 'k₁ · sin(θ₁) = k₂ · sin(θ₂)',
          eqEs: 'k₁ · sin(θ₁) = k₂ · sin(θ₂)   con   kᵢ = 2π·f / vᵢ = ω / vᵢ',
          eqEn: 'k₁ · sin(θ₁) = k₂ · sin(θ₂)   with   kᵢ = 2π·f / vᵢ = ω / vᵢ'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Cálculo Variacional (Principio de Fermat) y Ecuación de Onda',
      titleEn: 'Variational Calculus (Fermat’s Principle) & Wave PDE',
      formulas: [
        {
          labelEs: '1. Tiempo de viaje total T(x) entre A(0, h₁) y B(L, -h₂) cruzando en x:',
          labelEn: '1. Total travel time T(x) from A(0, h₁) to B(L, -h₂) crossing at x:',
          latex: '\\delta \\int_A^B \\frac{ds}{v(\\mathbf{r})} = 0 \\implies \\text{Fermat\'s Principle of Stationary Travel Time}',
          eq: 'T(x) = √(x² + h₁²) / v₁  +  √((L - x)² + h₂²) / v₂'
        },
        {
          labelEs: '2. Optimización por Cálculo Diferencial (Tiempo estacionario dT/dx = 0):',
          labelEn: '2. Differential Calculus Optimization (Stationary time dT/dx = 0):',
          eq: 'dT / dx = [ x / (v₁·√(x² + h₁²)) ] - [ (L - x) / (v₂·√((L-x)² + h₂²)) ] = sin(θ₁)/v₁ - sin(θ₂)/v₂ = 0',
          latex: '\\frac{dT}{dx} = \\frac{x}{v_1 \\sqrt{x^2 + h_1^2}} - \\frac{L - x}{v_2 \\sqrt{(L-x)^2 + h_2^2}} = \\frac{\\sin\\theta_1}{v_1} - \\frac{\\sin\\theta_2}{v_2} = 0',
        },
        {
          labelEs: '3. Ecuación en Derivadas Parciales (EDP) de Onda Elástica / Acústica:',
          labelEn: '3. Partial Differential Equation (PDE) for Elastic / Acoustic Waves:',
          eq: '∂²u / ∂t² = v² · ( ∂²u / ∂x² + ∂²u / ∂z² )',
          latex: '\\frac{\\partial^2 u}{\\partial t^2} = v^2 \\left( \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial z^2} \\right)',
        }
      ]
    },
    exercise: {
      questionEs:
        'En una prospección sísmica, una onda P viaja por un estrato superficial de arcilla con velocidad v₁ = 2.0 km/s e incide sobre un basamento granítico más rápido con v₂ = 4.0 km/s. ¿Cuál es el ángulo crítico θ_c a partir del cual ocurre reflexión total y se genera la onda refractada crítica?',
      questionEn:
        'In a seismic survey, a P-wave travels through an upper clay layer at v₁ = 2.0 km/s and hits a faster granite basement with v₂ = 4.0 km/s. What is the critical angle θ_c at which total internal reflection and a head wave occur?',
      presetValues: { theta1: 30, v1: 2.0, v2: 4.0, freq: 2.5 },
      options: [
        { id: 'a', textEs: 'θ_c = 30.0° (sin θ_c = 2.0 / 4.0 = 0.50)', textEn: 'θ_c = 30.0° (sin θ_c = 2.0 / 4.0 = 0.50)', text: 'θ_c = 30.0°', correct: true },
        { id: 'b', textEs: 'θ_c = 45.0°', textEn: 'θ_c = 45.0°', text: 'θ_c = 45.0°', correct: false },
        { id: 'c', textEs: 'θ_c = 60.0°', textEn: 'θ_c = 60.0°', text: 'θ_c = 60.0°', correct: false },
        { id: 'd', textEs: 'No existe ángulo crítico cuando v₂ > v₁', textEn: 'No critical angle exists when v₂ > v₁', text: 'No critical angle', correct: false }
      ],
      hintEs:
        'El ángulo crítico ocurre cuando el rayo refractado sale rasante a la interfaz (θ₂ = 90°, por lo que sin(θ₂) = 1). Aplica sin(θ_c) = v₁ / v₂.',
      hintEn:
        'The critical angle occurs when the refracted ray grazes the interface (θ₂ = 90°, so sin(θ₂) = 1). Apply sin(θ_c) = v₁ / v₂.',
      solutionStepsEs: [
        '1. Por la Ley de Snell (demostrada vía dT/dx = 0): sin(θ₁)/v₁ = sin(θ₂)/v₂.',
        '2. En el límite crítico, θ₂ = 90° ⇒ sin(90°) = 1.',
        '3. Despejamos: sin(θ_c) = v₁ / v₂ = 2.0 / 4.0 = 0.50  ⇒  θ_c = arcsin(0.50) = 30.0°.'
      ],
      solutionStepsEn: [
        '1. By Snell’s Law (derived via dT/dx = 0): sin(θ₁)/v₁ = sin(θ₂)/v₂.',
        '2. At the critical limit, θ₂ = 90° ⇒ sin(90°) = 1.',
        '3. Solve: sin(θ_c) = v₁ / v₂ = 2.0 / 4.0 = 0.50  ⇒  θ_c = arcsin(0.50) = 30.0°.'
      ]
    }
  },
  {
    id: 'vector_calculus',
    courseId: 'klausur',
    badgeEs: 'Cálculo Vectorial & Avanzado',
    badgeEn: 'Vector Calculus & Higher Mathematics',
    titleEs: 'Campos Vectoriales, Rotacional y Teorema de Green / Stokes',
    titleEn: 'Vector Fields, Curl & Green’s / Stokes’ Theorem',
    subtitleEs: 'El pilar de HM-II y electromagnetismo: campos conservativos (∇×F=0) vs. con vorticidad, circulación cerrada ∮ F·dr y flujo.',
    subtitleEn: 'The core of HM-II & electromagnetism: conservative (∇×F=0) vs. vortex fields, closed line circulation ∮ F·dr, and flux.',
    color: '#6366F1',
    icon: Compass,
    defaults: { omega: 1.5, kDiv: 0.0, radius: 2.2, particles: 20 },
    sliders: [
      { key: 'omega', labelEs: 'Vorticidad / Rotacional (ω)', labelEn: 'Vorticity / Curl (ω)', min: -3.0, max: 3.0, step: 0.5, unit: ' rad/s' },
      { key: 'kDiv', labelEs: 'Fuerza de Divergencia (k)', labelEn: 'Divergence Source (k)', min: -2.0, max: 2.0, step: 0.5, unit: ' s⁻¹' },
      { key: 'radius', labelEs: 'Radio del Bucle C (R)', labelEn: 'Loop Radius (R)', min: 1.0, max: 3.5, step: 0.25, unit: ' m' },
      { key: 'particles', labelEs: 'Trazadores en flujo', labelEn: 'Flow Tracer Particles', min: 10, max: 40, step: 5, unit: '' }
    ],
    presets: [
      {
        labelEs: 'Campo Conservativo Puro (ω = 0, ∮ F·dr = 0)',
        labelEn: 'Pure Conservative Field (ω = 0, ∮ F·dr = 0)',
        values: { omega: 0.0, kDiv: 1.0, radius: 2.0, particles: 25 }
      },
      {
        labelEs: 'Vórtice Rígido Puro (∇×F = 2ω, Circulación Máxima)',
        labelEn: 'Pure Rigid Vortex (∇×F = 2ω, Max Circulation)',
        values: { omega: 2.0, kDiv: 0.0, radius: 2.5, particles: 30 }
      },
      {
        labelEs: 'Sumidero Espiral (Divergencia < 0 + Giro)',
        labelEn: 'Spiral Sink (Negative Divergence + Spin)',
        values: { omega: 1.5, kDiv: -1.2, radius: 2.2, particles: 35 }
      }
    ],
    algebraSection: {
      titleEs: 'Planteamiento Algebraico: Campo F(x,y) y Matriz Jacobiana',
      titleEn: 'Algebraic Formulation: Field F(x,y) & Jacobian Matrix',
      formulas: [
        {
          labelEs: '1. Descomposición del campo vectorial en componentes P y Q:',
          labelEn: '1. Vector field decomposition into P and Q components:',
          latex: '\\mathbf{F}(x,y) = -3y\\,\\hat{\\mathbf{i}} + 3x\\,\\hat{\\mathbf{j}}',
          eq: 'F⃗(x, y) = P(x, y) î + Q(x, y) ĵ = (k·x - ω·y) î + (ω·x + k·y) ĵ'
        },
        {
          labelEs: '2. Matriz Jacobiana J_F del campo vectorial 2×2:',
          labelEn: '2. 2×2 Jacobian Matrix J_F of the vector field:',
          eq: 'J_F = [ ∂P/∂x   ∂P/∂y ] = [  k   -ω ]   =  k·I  +  ω·[  0  -1 ]\n      [ ∂Q/∂x   ∂Q/∂y ]   [  ω    k ]              [  1   0 ]',
          latex: 'J_F = \\begin{bmatrix} \\partial P/\\partial x & \\partial P/\\partial y \\\\ \\partial Q/\\partial x & \\partial Q/\\partial y \\end{bmatrix} = \\begin{bmatrix} k & -\\omega \\\\ \\omega & k \\end{bmatrix} = k I + \\omega \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}',
        },
        {
          labelEs: '3. Rotacional (Vorticidad) y Divergencia locales:',
          labelEn: '3. Local Curl (Vorticity) and Divergence:',
          eq: 'rot(F⃗) = (∂Q/∂x - ∂P/∂y) k̂ = 2ω k̂    ;    div(F⃗) = ∂P/∂x + ∂Q/∂y = 2k',
          latex: '\\mathrm{rot}(\\vec{F}) = \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) \\hat{k} = 2\\omega \\, \\hat{k} \\quad ; \\quad \\mathrm{div}(\\vec{F}) = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} = 2k',
        }
      ]
    },
    calculusSection: {
      titleEs: 'Teorema de Green y Circulación por Cálculo Integral',
      titleEn: 'Green’s Theorem & Circulation via Integral Calculus',
      formulas: [
        {
          labelEs: '1. Teorema de Green en el plano (Integral de línea ↔ Integral doble de área):',
          labelEn: '1. Green’s Theorem in the plane (Line integral ↔ Double area integral):',
          latex: '\\nabla \\times \\mathbf{F} = \\left(\\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y}\\right)\\hat{\\mathbf{k}} = (3 - (-3))\\hat{\\mathbf{k}} = 6\\hat{\\mathbf{k}}',
          eq: '∮_C F⃗ · d r⃗ = ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA = ∬_D (2ω) dA = 2ω · Área(D)'
        },
        {
          labelEs: '2. Verificación por parametrización explícita r⃗(t) = (R cos t, R sin t):',
          labelEn: '2. Verification by explicit parametrization r⃗(t) = (R cos t, R sin t):',
          eq: '∮_C F⃗ · d r⃗ = ∫₀²ᵖⁱ [ -ω R sin(t) (-R sin t) + ω R cos(t) (R cos t) ] dt = ∫₀²ᵖⁱ ω R² dt = 2π R² ω',
          latex: '\\oint_C \\vec{F} \\cdot d\\vec{r} = \\int_0^{2\\pi} \\left[ -\\omega R \\sin t \\, (-R \\sin t) + \\omega R \\cos t \\, (R \\cos t) \\right] dt = \\int_0^{2\\pi} \\omega R^2 \\, dt = 2\\pi R^2 \\omega',
        },
        {
          labelEs: '3. Criterio de independencia de la trayectoria (Campo Conservativo):',
          labelEn: '3. Path independence criterion (Conservative Field):',
          eq: 'rot(F⃗) = 0⃗   ⇔   F⃗ = ∇φ   ⇒   ∮_C F⃗ · d r⃗ = 0',
          eqEs: 'rot(F⃗) = 0⃗   ⇔   F⃗ = ∇φ   ⇒   ∮_C F⃗ · d r⃗ = 0  (para cualquier curva cerrada simple C)',
          eqEn: 'curl(F⃗) = 0⃗   ⇔   F⃗ = ∇φ   ⇒   ∮_C F⃗ · d r⃗ = 0  (for any simple closed curve C)',
          latexEs: '\\mathrm{rot}(\\vec{F}) = \\vec{0} \\iff \\vec{F} = \\nabla\\varphi \\Rightarrow \\oint_C \\vec{F} \\cdot d\\vec{r} = 0 \\quad \\text{(para cualquier curva cerrada simple } C\\text{)}',
          latexEn: '\\mathrm{curl}(\\vec{F}) = \\vec{0} \\iff \\vec{F} = \\nabla\\varphi \\Rightarrow \\oint_C \\vec{F} \\cdot d\\vec{r} = 0 \\quad \\text{(for any simple closed curve } C\\text{)}',
        }
      ]
    },
    exercise: {
      questionEs:
        'Dado el campo vectorial F⃗(x, y) = (-3y, 3x), calcula la circulación cerrada ∮_C F⃗·dr a lo largo de una circunferencia de radio R = 2.0 m orientada en sentido antihorario, aplicando el Teorema de Green.',
      questionEn:
        'Given the vector field F⃗(x, y) = (-3y, 3x), calculate the closed line circulation ∮_C F⃗·dr along a circle of radius R = 2.0 m oriented counterclockwise, applying Green’s Theorem.',
      presetValues: { omega: 3.0, kDiv: 0.0, radius: 2.0, particles: 25 },
      options: [
        { id: 'a', textEs: '∮ F·dr = 24π ≈ 75.40 J (rot F = 6 k̂)', textEn: '∮ F·dr = 24π ≈ 75.40 J (curl F = 6 k̂)', text: '∮ F·dr = 24π ≈ 75.40 J', correct: true },
        { id: 'b', textEs: '∮ F·dr = 0 J (campo conservativo)', textEn: '∮ F·dr = 0 J (conservative field)', text: '∮ F·dr = 0 J', correct: false },
        { id: 'c', textEs: '∮ F·dr = 12π ≈ 37.70 J', textEn: '∮ F·dr = 12π ≈ 37.70 J', text: '∮ F·dr = 12π ≈ 37.70 J', correct: false },
        { id: 'd', textEs: '∮ F·dr = 6π ≈ 18.85 J', textEn: '∮ F·dr = 6π ≈ 18.85 J', text: '∮ F·dr = 6π ≈ 18.85 J', correct: false }
      ],
      hintEs:
        'Aplica el Teorema de Green: ∮_C F·dr = ∬_D (∂Q/∂x - ∂P/∂y) dA. Aquí P = -3y y Q = 3x. El rotacional escalar es constante: ∂Q/∂x - ∂P/∂y = 3 - (-3) = 6.',
      hintEn:
        'Apply Green’s Theorem: ∮_C F·dr = ∬_D (∂Q/∂x - ∂P/∂y) dA. Here P = -3y and Q = 3x. The scalar curl is constant: ∂Q/∂x - ∂P/∂y = 3 - (-3) = 6.',
      solutionStepsEs: [
        '1. Identificamos P(x,y) = -3y y Q(x,y) = 3x.',
        '2. Calculamos el rotacional escalar: ∂Q/∂x - ∂P/∂y = 3 - (-3) = 6.',
        '3. Por el Teorema de Green: ∮_C F·dr = ∬_D 6 dA = 6 · Área(D) = 6 · (π R²).',
        '4. Sustituyendo R = 2.0: ∮_C F·dr = 6 · π · (2)² = 24π ≈ 75.40 J.'
      ],
      solutionStepsEn: [
        '1. Identify P(x,y) = -3y and Q(x,y) = 3x.',
        '2. Compute scalar curl: ∂Q/∂x - ∂P/∂y = 3 - (-3) = 6.',
        '3. By Green’s Theorem: ∮_C F·dr = ∬_D 6 dA = 6 · Area(D) = 6 · (π R²).',
        '4. Substituting R = 2.0: ∮_C F·dr = 6 · π · (2)² = 24π ≈ 75.40 J.'
      ]
    }
  },
  {
    id: 'relativity',
    courseId: 'mechanics',
    badgeEs: 'Relatividad General & Astrofísica',
    badgeEn: 'General Relativity & Astrophysics',
    titleEs: 'Órbitas Geodésicas de Schwarzschild y Precesión del Perihelio',
    titleEn: 'Schwarzschild Geodesic Orbits & Perihelion Precession',
    subtitleEs: 'El triunfo histórico de Einstein: potencial efectivo relativista V_eff(r) con término cúbico -GM L²/(c² r³) que rompe la elipse cerrada y produce la roseta cósmica.',
    subtitleEn: 'Einstein’s historical triumph: Schwarzschild effective potential V_eff(r) with cubic term -GM L²/(c² r³) breaking closed Keplerian ellipses into a precessing cosmic rosette.',
    color: '#EC4899',
    icon: Orbit,
    defaults: { mass: 1.0, eccentricity: 0.5, grFactor: 1.5, semiMajor: 2.8 },
    sliders: [
      { key: 'grFactor', labelEs: 'Factor Relativista (RG)', labelEn: 'Relativistic Factor (GR)', min: 0.0, max: 3.0, step: 0.25, unit: '×' },
      { key: 'eccentricity', labelEs: 'Excentricidad Orbital (e)', labelEn: 'Orbital Eccentricity (e)', min: 0.1, max: 0.75, step: 0.05, unit: '' },
      { key: 'mass', labelEs: 'Masa Central (M/M☉)', labelEn: 'Central Mass (M/M☉)', min: 0.5, max: 3.0, step: 0.25, unit: ' M☉' },
      { key: 'semiMajor', labelEs: 'Semieje Mayor (a)', labelEn: 'Semi-Major Axis (a)', min: 1.8, max: 4.5, step: 0.2, unit: ' UA' }
    ],
    presets: [
      {
        labelEs: 'Newton Puro Clásico (RG = 0, Elipse Cerrada Perenne)',
        labelEn: 'Pure Classical Newton (GR = 0, Closed Kepler Ellipse)',
        values: { mass: 1.0, eccentricity: 0.5, grFactor: 0.0, semiMajor: 3.0 }
      },
      {
        labelEs: 'Precesión de Mercurio Relativista (RG = 1.0, Avance Anómalo)',
        labelEn: 'Mercury Relativistic Precession (GR = 1.0, Anomalous Advance)',
        values: { mass: 1.0, eccentricity: 0.45, grFactor: 1.0, semiMajor: 2.8 }
      },
      {
        labelEs: 'Campo Fuerte / Agujero Negro (RG = 2.5, Roseta Pronunciada)',
        labelEn: 'Strong Gravity / Black Hole (GR = 2.5, Sharp Rosette)',
        values: { mass: 2.0, eccentricity: 0.65, grFactor: 2.5, semiMajor: 2.2 }
      }
    ],
    algebraSection: {
      titleEs: 'Álgebra de Fuerzas Centrales y Ecuación de Binet',
      titleEn: 'Central Force Algebra & Binet’s Equation',
      formulas: [
        {
          labelEs: '1. Conservación de energía E y momento angular L:',
          labelEn: '1. Conservation of energy E and angular momentum L:',
          latex: '\\Delta\\phi_{\\text{GR}} = \\frac{6\\pi G M}{c^2 a (1 - e^2)} \\quad (\\text{radians per orbit})',
          eq: 'L = r² · (dθ/dt) = cte     ;     E = ½ m (dr/dt)² + V_eff(r) = cte'
        },
        {
          labelEs: '2. Potencial Efectivo de Schwarzschild (Término cúbico relativista):',
          labelEn: '2. Schwarzschild Effective Potential (Cubic relativistic term):',
          latex: 'r_{\\min} = a(1 - e) \\quad ; \\quad r_{\\max} = a(1 + e)',
          eq: 'V_eff(r) = - (G·M·m) / r  +  L² / (2m·r²)  -  (G·M·L²) / (c²·m·r³)'
        },
        {
          labelEs: '3. Ecuación de Binet modificada en variable u = 1/r:',
          labelEn: '3. Modified Binet equation in variable u = 1/r:',
          latex: 'E = \\frac{m c^2 (1 - 2GM/c^2 r)}{\\sqrt{1 - 2GM/c^2 r - v^2/c^2}}',
          eq: 'd²u / dθ² + u = (G·M·m²) / L²  +  (3·G·M / c²) · u²   (El término u² rompe la simetría de Kepler)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Cálculo Variacional de Geodésicas e Integración Perturbativa',
      titleEn: 'Variational Geodesics & Perturbative Integration',
      formulas: [
        {
          labelEs: '1. Métrica de Schwarzschild y Principio Variacional de Acción Geodésica:',
          labelEn: '1. Schwarzschild Metric & Variational Geodesic Action Principle:',
          latex: '\\left(\\frac{dr}{d\\tau}\\right)^2 = \\frac{E^2}{m^2 c^2} - \\left(1 - \\frac{2GM}{c^2 r}\\right)\\left(c^2 + \\frac{L^2}{m^2 r^2}\\right)',
          eq: 'ds² = - (1 - 2GM/c²r) c² dt² + (1 - 2GM/c²r)⁻¹ dr² + r² dθ²     ;     δ ∫ ds = 0'
        },
        {
          labelEs: '2. Desplazamiento angular del perihelio por órbita (Teorema de Perturbaciones):',
          labelEn: '2. Perihelion angular shift per orbit (Perturbation Theory):',
          latex: '\\frac{d^2 u}{d\\phi^2} + u = \\frac{G M}{h^2} + \\frac{3 G M}{c^2} u^2 \\quad \\left(u = \\frac{1}{r}\\right)',
          eq: 'Δφ = ∮ (dθ/du) du - 2π ≈ (6π · G · M) / (c² · a · (1 - e²))'
        },
        {
          labelEs: '3. Límite Clásico Newtoniano (Velocidad de la luz c → ∞):',
          labelEn: '3. Classical Newtonian Limit (Speed of light c → ∞):',
          latex: '\\Delta\\tau = \\int \\sqrt{1 - \\frac{2GM}{c^2 r} - \\frac{v^2}{c^2}} \\, dt',
          eq: 'lim_{c → ∞} Δφ = 0   ⇒   Órbita perfectamente cerrada (Teorema de Bertrand: sólo V~1/r y V~r² cierran)'
        }
      ]
    },
    exercise: {
      questionEs:
        'En la órbita de un planeta con semieje mayor a y excentricidad e alrededor de una estrella de masa M, la corrección relativista predice un avance del perihelio de Δφ = 6π·G·M / [c²·a·(1 - e²)] radianes por revolución. Si la excentricidad aumenta de e = 0.2 a e = 0.6 manteniendo a y M constantes, ¿por qué factor se multiplica la precesión Δφ?',
      questionEn:
        'In a planet’s orbit with semi-major axis a and eccentricity e around a star of mass M, the relativistic correction yields a perihelion advance of Δφ = 6π·G·M / [c²·a·(1 - e²)] rad/rev. If the eccentricity increases from e = 0.2 to e = 0.6 keeping a and M constant, by what factor is the precession Δφ multiplied?',
      presetValues: { mass: 1.0, eccentricity: 0.6, grFactor: 1.5, semiMajor: 2.8 },
      options: [
        { id: 'a', textEs: 'Factor = 1.50 (Aumenta un 50% por excentricidad)', textEn: 'Factor = 1.50 (Increases by 50% via eccentricity)', text: 'Factor = 1.50', correct: true },
        { id: 'b', textEs: 'Factor = 1.00 (No depende de e)', textEn: 'Factor = 1.00 (Independent of e)', text: 'Factor = 1.00', correct: false },
        { id: 'c', textEs: 'Factor = 0.67 (Disminuye)', textEn: 'Factor = 0.67 (Decreases)', text: 'Factor = 0.67', correct: false },
        { id: 'd', textEs: 'Factor = 3.00 (Se triplica)', textEn: 'Factor = 3.00 (Triples)', text: 'Factor = 3.00', correct: false }
      ],
      hintEs:
        'Nota que Δφ es inversamente proporcional a (1 - e²). Calcula (1 - 0.2²) y (1 - 0.6²) y evalúa el cociente (1 - 0.2²) / (1 - 0.6²).',
      hintEn:
        'Note that Δφ is inversely proportional to (1 - e²). Calculate (1 - 0.2²) and (1 - 0.6²) and evaluate the ratio (1 - 0.2²) / (1 - 0.6²).',
      solutionStepsEs: [
        '1. La fórmula indica: Δφ ∝ 1 / (1 - e²).',
        '2. Para e₁ = 0.2: (1 - e₁²) = 1 - 0.04 = 0.96.',
        '3. Para e₂ = 0.6: (1 - e₂²) = 1 - 0.36 = 0.64.',
        '4. Cociente de precesión: Δφ₂ / Δφ₁ = (1 - e₁²) / (1 - e₂²) = 0.96 / 0.64 = 1.50 (aumenta un 50%).'
      ],
      solutionStepsEn: [
        '1. The formula states: Δφ ∝ 1 / (1 - e²).',
        '2. For e₁ = 0.2: (1 - e₁²) = 1 - 0.04 = 0.96.',
        '3. For e₂ = 0.6: (1 - e₂²) = 1 - 0.36 = 0.64.',
        '4. Precession ratio: Δφ₂ / Δφ₁ = (1 - e₁²) / (1 - e₂²) = 0.96 / 0.64 = 1.50 (increases by 50%).'
      ]
    }
  },
  {
    id: 'coupled_oscillators',
    courseId: 'mechanics',
    badgeEs: 'Vibraciones & Osciladores Acoplados',
    badgeEn: 'Vibrations & Coupled Oscillators',
    titleEs: 'Osciladores Acoplados (2 Masas, 3 Resortes) y Modos Normales',
    titleEn: 'Coupled Oscillators (2 Masses, 3 Springs) & Normal Modes',
    subtitleEs: 'El puente supremo entre el Álgebra Lineal y la Física: autovalores de la matriz dinámica M⁻¹K, desacoplamiento en coordenadas normales y batimiento.',
    subtitleEn: 'The ultimate bridge between Linear Algebra and Physics: eigenvalues of dynamic matrix M⁻¹K, normal coordinate decoupling, and energy beats.',
    color: '#8B5CF6',
    icon: Activity,
    defaults: { m1: 2.0, m2: 2.0, kOuter: 18.0, kCoupling: 10.0, mode: 1 },
    sliders: [
      { key: 'm1', labelEs: 'Masa 1 (m₁)', labelEn: 'Mass 1 (m₁)', min: 1.0, max: 6.0, step: 0.5, unit: ' kg' },
      { key: 'm2', labelEs: 'Masa 2 (m₂)', labelEn: 'Mass 2 (m₂)', min: 1.0, max: 6.0, step: 0.5, unit: ' kg' },
      { key: 'kOuter', labelEs: 'Rigidez resortes externos (k)', labelEn: 'Outer Springs Stiffness (k)', min: 5, max: 35, step: 1, unit: ' N/m' },
      { key: 'kCoupling', labelEs: 'Rigidez acoplamiento (k₁₂)', labelEn: 'Coupling Stiffness (k₁₂)', min: 2, max: 30, step: 1, unit: ' N/m' }
    ],
    presets: [
      {
        labelEs: 'Modo Normal 1: En Fase (Mismo Sentido, ω₁ baja, resorte central quieto)',
        labelEn: 'Mode 1: In-Phase (Same Direction, Low ω₁, Central Spring Idle)',
        values: { m1: 2.0, m2: 2.0, kOuter: 18.0, kCoupling: 10.0, mode: 1 }
      },
      {
        labelEs: 'Modo Normal 2: En Antifase (Sentidos Opuestos, ω₂ alta, máxima compresión)',
        labelEn: 'Mode 2: Anti-Phase (Opposite Direction, High ω₂, Max Central Stretch)',
        values: { m1: 2.0, m2: 2.0, kOuter: 18.0, kCoupling: 10.0, mode: 2 }
      },
      {
        labelEs: 'Batimiento / Transferencia de Energía (m₁ arranca quieta, m₂ a tope)',
        labelEn: 'Energy Beat / Resonance Transfer (m₁ starts at rest, m₂ at peak)',
        values: { m1: 2.0, m2: 2.0, kOuter: 18.0, kCoupling: 4.0, mode: 3 }
      }
    ],
    algebraSection: {
      titleEs: 'Formulación Matricial y Problema de Autovalores (M⁻¹K)',
      titleEn: 'Matrix Formulation & Eigenvalue Problem (M⁻¹K)',
      formulas: [
        {
          labelEs: '1. Sistema matricial acoplado de 2º orden:',
          labelEn: '1. Coupled 2nd-order matrix system:',
          eq: '[ M ] d²x⃗/dt² + [ K ] x⃗ = 0⃗   con   K = [  k+k₁₂   -k₁₂  ]\n                                          [  -k₁₂    k+k₁₂ ]',
          latex: '[M] \\, \\frac{d^2 \\vec{x}}{dt^2} + [K] \\, \\vec{x} = \\vec{0}, \\quad K = \\begin{bmatrix} k + k_{12} & -k_{12} \\\\ -k_{12} & k + k_{12} \\end{bmatrix}',
        },
        {
          labelEs: '2. Ecuación secular característica: det(K - ω²M) = 0:',
          labelEn: '2. Characteristic secular equation: det(K - ω²M) = 0:',
          eq: 'ω₁² = k / m     ;     ω₂² = (k + 2k₁₂) / m   (para masas idénticas m₁ = m₂ = m)',
          latexEs: '\\omega_1^2 = \\frac{k}{m} \\quad ; \\quad \\omega_2^2 = \\frac{k + 2k_{12}}{m} \\quad \\text{(para masas idénticas } m_1 = m_2 = m\\text{)}',
          latexEn: '\\omega_1^2 = \\frac{k}{m} \\quad ; \\quad \\omega_2^2 = \\frac{k + 2k_{12}}{m} \\quad \\text{(for identical masses } m_1 = m_2 = m\\text{)}',
        },
        {
          labelEs: '3. Autovectores modales ortogonales normalizados:',
          labelEn: '3. Normalized orthogonal modal eigenvectors:',
          eq: 'v⃗₁ = (1/√2) [ 1,  1 ]ᵀ  (Modo en Fase)  ;  v⃗₂ = (1/√2) [ 1, -1 ]ᵀ  (Modo en Antifase)',
          latexEs: '\\vec{v}_1 = \\frac{1}{\\sqrt{2}} \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} \\; \\text{(Modo en Fase)} \\quad ; \\quad \\vec{v}_2 = \\frac{1}{\\sqrt{2}} \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} \\; \\text{(Modo en Antifase)}',
          latexEn: '\\vec{v}_1 = \\frac{1}{\\sqrt{2}} \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} \\; \\text{(In-Phase Mode)} \\quad ; \\quad \\vec{v}_2 = \\frac{1}{\\sqrt{2}} \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} \\; \\text{(Out-of-Phase Mode)}',
        }
      ]
    },
    calculusSection: {
      titleEs: 'Desacoplamiento en Coordenadas Normales y Batimiento',
      titleEn: 'Normal Coordinates Decoupling & Energy Beat ODEs',
      formulas: [
        {
          labelEs: '1. Sistema de Ecuaciones Diferenciales Ordinarias (EDOs) acopladas:',
          labelEn: '1. Coupled Ordinary Differential Equations (ODEs):',
          latex: 'L = T - V = \\frac{1}{2}m(\\dot{x}_1^2 + \\dot{x}_2^2) - \\frac{1}{2}k(x_1^2 + x_2^2) - \\frac{1}{2}k_{12}(x_2 - x_1)^2',
          eq: 'm₁ d²x₁/dt² = -k x₁ + k₁₂(x₂ - x₁)     ;     m₂ d²x₂/dt² = -k x₂ - k₁₂(x₂ - x₁)'
        },
        {
          labelEs: '2. Cambio de base a coordenadas normales desacopladas q₁ y q₂:',
          labelEn: '2. Change of basis to decoupled normal coordinates q₁ & q₂:',
          latex: '\\eta_1(t) = \\frac{x_1 + x_2}{\\sqrt{2}} = A_1 \\cos(\\omega_1 t + \\phi_1), \\quad \\eta_2(t) = \\frac{x_1 - x_2}{\\sqrt{2}} = A_2 \\cos(\\omega_2 t + \\phi_2)',
          eq: 'q₁ = (x₁ + x₂)/√2  ⇒  d²q₁/dt² + ω₁² q₁ = 0     ;     q₂ = (x₁ - x₂)/√2  ⇒  d²q₂/dt² + ω₂² q₂ = 0'
        },
        {
          labelEs: '3. Frecuencia de batimiento (Beats) y modulación periódica de energía:',
          labelEn: '3. Beat frequency and periodic energy envelope modulation:',
          latex: 'x_1(t) = 2 A \\cos\\left(\\frac{\\omega_2 - \\omega_1}{2} t\\right) \\sin\\left(\\frac{\\omega_1 + \\omega_2}{2} t\\right) \\implies \\Omega_{\\text{beat}} = \\frac{\\omega_2 - \\omega_1}{2}',
          eq: 'x₁(t) = 2A · cos(½(ω₂ - ω₁)t) · sin(½(ω₁ + ω₂)t)   ⇒   ω_batimiento = ω₂ - ω₁'
        }
      ]
    },
    exercise: {
      questionEs:
        'Dos masas idénticas m₁ = m₂ = 2.0 kg oscilan sin roce conectadas a paredes fijas con resortes exteriores de rigidez k = 18.0 N/m y un resorte central de acoplamiento k₁₂ = 10.0 N/m. ¿Cuál es el valor de la frecuencia angular del modo en antifase (ω₂) y del modo en fase (ω₁)?',
      questionEn:
        'Two identical masses m₁ = m₂ = 2.0 kg oscillate frictionlessly connected to fixed walls with outer springs k = 18.0 N/m and a central coupling spring k₁₂ = 10.0 N/m. What is the angular frequency of the anti-phase mode (ω₂) and in-phase mode (ω₁)?',
      presetValues: { m1: 2.0, m2: 2.0, kOuter: 18.0, kCoupling: 10.0, mode: 2 },
      options: [
        { id: 'a', textEs: 'ω₁ = 3.00 rad/s (fase)  y  ω₂ = 4.36 rad/s (antifase)', textEn: 'ω₁ = 3.00 rad/s (in-phase)  and  ω₂ = 4.36 rad/s (anti-phase)', text: 'ω₁ = 3.00 rad/s, ω₂ = 4.36 rad/s', correct: true },
        { id: 'b', textEs: 'ω₁ = 3.00 rad/s  y  ω₂ = 3.00 rad/s', textEn: 'ω₁ = 3.00 rad/s  and  ω₂ = 3.00 rad/s', text: 'ω₁ = 3.00 rad/s, ω₂ = 3.00 rad/s', correct: false },
        { id: 'c', textEs: 'ω₁ = 2.50 rad/s  y  ω₂ = 5.00 rad/s', textEn: 'ω₁ = 2.50 rad/s  and  ω₂ = 5.00 rad/s', text: 'ω₁ = 2.50 rad/s, ω₂ = 5.00 rad/s', correct: false },
        { id: 'd', textEs: 'ω₁ = 4.36 rad/s  y  ω₂ = 3.00 rad/s', textEn: 'ω₁ = 4.36 rad/s  and  ω₂ = 3.00 rad/s', text: 'ω₁ = 4.36 rad/s, ω₂ = 3.00 rad/s', correct: false }
      ],
      hintEs:
        'Para masas iguales, el modo en fase no estira el resorte central: ω₁ = √(k/m). El modo en antifase estira el resorte central el doble: ω₂ = √((k + 2k₁₂)/m).',
      hintEn:
        'For equal masses, the in-phase mode does not stretch the central spring: ω₁ = √(k/m). The anti-phase mode stretches it doubly: ω₂ = √((k + 2k₁₂)/m).',
      solutionStepsEs: [
        '1. Calculamos la frecuencia del modo en fase: ω₁ = √(k/m) = √(18.0 / 2.0) = √9.0 = 3.00 rad/s.',
        '2. Calculamos la frecuencia del modo en antifase: ω₂ = √((k + 2k₁₂)/m) = √((18.0 + 2·10.0) / 2.0) = √(38.0 / 2.0) = √19.0 ≈ 4.3589 rad/s.',
        '3. Conclusión: ω₁ = 3.00 rad/s y ω₂ = 4.36 rad/s.'
      ],
      solutionStepsEn: [
        '1. Compute in-phase frequency: ω₁ = √(k/m) = √(18.0 / 2.0) = √9.0 = 3.00 rad/s.',
        '2. Compute anti-phase frequency: ω₂ = √((k + 2k₁₂)/m) = √((18.0 + 2·10.0) / 2.0) = √(38.0 / 2.0) = √19.0 ≈ 4.3589 rad/s.',
        '3. Conclusion: ω₁ = 3.00 rad/s and ω₂ = 4.36 rad/s.'
      ]
    }
  },
  {
    id: 'geostrophic_wind',
    courseId: 'geophysics',
    badgeEs: 'Geofísica de Atmósfera & Océano',
    badgeEn: 'Atmospheric & Oceanic Geophysics',
    titleEs: 'Viento Geostrófico, Gradiente de Presión y Fuerza de Coriolis',
    titleEn: 'Geostrophic Wind, Pressure Gradient & Coriolis Force',
    subtitleEs: 'El equilibrio rey de la meteorología y oceanografía dinámica: por qué el viento fluye paralelo a las isobaras y los huracanes giran al revés en cada hemisferio.',
    subtitleEn: 'The fundamental balance of meteorology & physical oceanography: why wind blows parallel to isobars and hurricanes rotate oppositely in each hemisphere.',
    color: '#0D9488',
    icon: Compass,
    defaults: { deltaP: 16.0, latitude: 45, hemisphere: 1, rho: 1.20 },
    sliders: [
      { key: 'deltaP', labelEs: 'Gradiente de Presión (ΔP / 100km)', labelEn: 'Pressure Gradient (ΔP / 100km)', min: 4, max: 32, step: 2, unit: ' hPa' },
      { key: 'latitude', labelEs: 'Latitud Geográfica (φ)', labelEn: 'Geographic Latitude (φ)', min: 10, max: 80, step: 5, unit: '°' },
      { key: 'hemisphere', labelEs: 'Hemisferio (+1 Norte, -1 Sur)', labelEn: 'Hemisphere (+1 North, -1 South)', min: -1, max: 1, step: 2, unit: '' },
      { key: 'rho', labelEs: 'Densidad del Aire (ρ)', labelEn: 'Air Density (ρ)', min: 1.05, max: 1.35, step: 0.05, unit: ' kg/m³' }
    ],
    presets: [
      {
        labelEs: 'Borrasca Hemisferio Norte (Desviación Derecha, Giro Antihorario)',
        labelEn: 'Northern Hemisphere Low (Right Deflection, Cyclonic Counter-Clockwise)',
        values: { deltaP: 16.0, latitude: 45, hemisphere: 1, rho: 1.20 }
      },
      {
        labelEs: 'Borrasca Hemisferio Sur (Desviación Izquierda, Giro Horario)',
        labelEn: 'Southern Hemisphere Low (Left Deflection, Cyclonic Clockwise)',
        values: { deltaP: 16.0, latitude: 45, hemisphere: -1, rho: 1.20 }
      },
      {
        labelEs: 'Corriente en Chorro (Jet Stream) Polar (Fuerte Gradiente de Altura)',
        labelEn: 'Polar Jet Stream (Intense Upper-Air Gradient, Fast Wind)',
        values: { deltaP: 28.0, latitude: 55, hemisphere: 1, rho: 1.10 }
      },
      {
        labelEs: 'Zona Ecuatorial / Calmas (f ≈ 0, El Viento Fluye Directo a la Baja)',
        labelEn: 'Equatorial Zone (f ≈ 0, Direct Flow Down-Gradient)',
        values: { deltaP: 10.0, latitude: 10, hemisphere: 1, rho: 1.20 }
      }
    ],
    algebraSection: {
      titleEs: 'Álgebra del Equilibrio Geostrófico en Marco Rotante',
      titleEn: 'Algebraic Geostrophic Balance in Rotating Frame',
      formulas: [
        {
          labelEs: '1. Parámetro de Coriolis f en función de la latitud φ:',
          labelEn: '1. Coriolis parameter f as a function of latitude φ:',
          latex: '-\\frac{1}{\\rho}\\nabla P - 2\\boldsymbol{\\Omega}\\times\\mathbf{v}_g = \\mathbf{0}',
          eq: 'f = 2 · Ω · sin(φ)',
          eqEs: 'f = 2 · Ω_Tierra · sin(φ)   con   Ω_Tierra = 7.292 × 10⁻⁵ rad/s',
          eqEn: 'f = 2 · Ω_Earth · sin(φ)   with   Ω_Earth = 7.292 × 10⁻⁵ rad/s'
        },
        {
          labelEs: '2. Sistema lineal 2×2 del equilibrio horizontal (Fuerza P + Coriolis = 0):',
          labelEn: '2. 2×2 horizontal balance system (Pressure Gradient + Coriolis = 0):',
          eq: '[  0   -f ] [ u_g ] = - (1/ρ) [ ∂P/∂x ]\n[  f    0 ] [ v_g ]          [ ∂P/∂y ]',
          latex: '\\begin{bmatrix} 0 & -f \\\\ f & 0 \\end{bmatrix} \\begin{bmatrix} u_g \\\\ v_g \\end{bmatrix} = -\\frac{1}{\\rho} \\begin{bmatrix} \\partial P/\\partial x \\\\ \\partial P/\\partial y \\end{bmatrix}',
        },
        {
          labelEs: '3. Solución explícita del vector viento geostrófico (v⃗_g ⟂ ∇P):',
          labelEn: '3. Explicit solution of geostrophic wind vector (v⃗_g ⟂ ∇P):',
          eq: 'u_g = - (1 / (ρ · f)) · (∂P / ∂y)     ;     v_g = (1 / (ρ · f)) · (∂P / ∂x)',
          latex: 'u_g = -\\frac{1}{\\rho f} \\frac{\\partial P}{\\partial y} \\quad ; \\quad v_g = \\frac{1}{\\rho f} \\frac{\\partial P}{\\partial x}',
        }
      ]
    },
    calculusSection: {
      titleEs: 'Ecuaciones de Navier-Stokes Geofísicas y Número de Rossby',
      titleEn: 'Geophysical Navier-Stokes Equations & Rossby Number',
      formulas: [
        {
          labelEs: '1. Ecuación de Navier-Stokes en sistema no inercial rotante:',
          labelEn: '1. Navier-Stokes in rotating non-inertial frame:',
          latex: '\\frac{D\\mathbf{v}}{Dt} + 2\\boldsymbol{\\Omega}\\times\\mathbf{v} = -\\frac{1}{\\rho}\\nabla P + \\mathbf{g} + \\nu \\nabla^2 \\mathbf{v}',
          eq: 'D v⃗ / Dt = ∂v⃗/∂t + (v⃗·∇)v⃗ = - (1/ρ) ∇P - 2 (Ω⃗ × v⃗) + g⃗ + ν ∇²v⃗'
        },
        {
          labelEs: '2. Escalamiento sinóptico y Número de Rossby (Ro ≪ 1):',
          labelEn: '2. Synoptic scaling and Rossby Number (Ro ≪ 1):',
          latex: 'Ro = \\frac{U}{f L} \\ll 1 \\implies \\frac{D\\mathbf{v}}{Dt} \\approx \\mathbf{0}',
          eq: 'Ro = U / (f · L) ≈ 0.1 ≪ 1   ⇒   La aceleración inercial D v⃗ / Dt ≈ 0 es despreciable'
        },
        {
          labelEs: '3. Ley de Buys Ballot (Geofísica Meteorológica):',
          labelEn: '3. Buys Ballot’s Law (Meteorological Geophysics):',
          latex: '\\frac{D}{Dt}\\left(\\frac{\\zeta + f}{H}\\right) = 0 \\quad (\\text{Ertel\'s Potential Vorticity Conservation})',
          eq: 'Hemisferio Norte: Si te paras de espaldas al viento, la BAJA presión queda a tu IZQUIERDA.'
        }
      ]
    },
    exercise: {
      questionEs:
        'A una latitud de φ = 45° N en el Hemisferio Norte (f = 2 · 7.292×10⁻⁵ · sin(45°) = 1.031×10⁻⁴ s⁻¹), un frente meteorológico presenta una caída de presión de ΔP = 16.0 hPa a lo largo de una distancia horizontal de Δn = 100 km en aire con densidad ρ = 1.20 kg/m³. ¿Cuál es la magnitud de la velocidad del viento geostrófico resultante v_g?',
      questionEn:
        'At latitude φ = 45° N in the Northern Hemisphere (f = 1.031×10⁻⁴ s⁻¹), a weather front has a pressure drop of ΔP = 16.0 hPa across a horizontal distance Δn = 100 km in air of density ρ = 1.20 kg/m³. What is the resulting geostrophic wind speed v_g?',
      presetValues: { deltaP: 16.0, latitude: 45, hemisphere: 1, rho: 1.20 },
      options: [
        { id: 'a', textEs: 'v_g ≈ 129.3 m/s (≈ 465 km/h, Corriente en Chorro / Jet Stream)', textEn: 'v_g ≈ 129.3 m/s (≈ 465 km/h, Jet Stream Core)', text: 'v_g ≈ 129.3 m/s', correct: true },
        { id: 'b', textEs: 'v_g ≈ 12.9 m/s (Brisa moderada de superficie)', textEn: 'v_g ≈ 12.9 m/s (Moderate surface breeze)', text: 'v_g ≈ 12.9 m/s', correct: false },
        { id: 'c', textEs: 'v_g ≈ 0.0 m/s (El viento se anula por Coriolis)', textEn: 'v_g ≈ 0.0 m/s (Wind canceled by Coriolis)', text: 'v_g ≈ 0.0 m/s', correct: false },
        { id: 'd', textEs: 'v_g ≈ 550.0 m/s (Régimen supersónico)', textEn: 'v_g ≈ 550.0 m/s (Supersonic regime)', text: 'v_g ≈ 550.0 m/s', correct: false }
      ],
      hintEs:
        'Convierte ΔP a Pascales (16.0 hPa = 1600 Pa) y Δn a metros (100 km = 100,000 m). Aplica la fórmula v_g = (1 / (ρ · f)) · (ΔP / Δn).',
      hintEn:
        'Convert ΔP to Pascals (16.0 hPa = 1600 Pa) and Δn to meters (100 km = 100,000 m). Apply v_g = (1 / (ρ · f)) · (ΔP / Δn).',
      solutionStepsEs: [
        '1. Gradiente de presión: ∂P/∂n = 1600 Pa / 100,000 m = 0.016 Pa/m.',
        '2. Denominador: ρ · f = 1.20 kg/m³ · 1.031×10⁻⁴ s⁻¹ = 1.2372×10⁻⁴ kg/(m²·s).',
        '3. Velocidad geostrófica: v_g = 0.016 / (1.2372×10⁻⁴) ≈ 129.3 m/s (≈ 465.5 km/h).'
      ],
      solutionStepsEn: [
        '1. Pressure gradient: ∂P/∂n = 1600 Pa / 100,000 m = 0.016 Pa/m.',
        '2. Denominator: ρ · f = 1.20 kg/m³ · 1.031×10⁻⁴ s⁻¹ = 1.2372×10⁻⁴ kg/(m²·s).',
        '3. Geostrophic speed: v_g = 0.016 / (1.2372×10⁻⁴) ≈ 129.3 m/s (≈ 465.5 km/h).'
      ]
    }
  },
  {
    id: 'seismology_beachball',
    courseId: 'geophysics',
    badgeEs: 'Sismología Teórica (GF-401 FCFM)',
    badgeEn: 'Theoretical Seismology (GF-401)',
    titleEs: 'Mecanismo Focal, Pelota de Playa y Frentes P/S en Zonas de Falla Mundiales',
    titleEn: 'Focal Mechanism, Beachball & P/S Wavefronts in Global Fault Zones',
    subtitleEs: 'El estándar de la sismología moderna: orientación espacial de la falla (rumbo, buzamiento, deslizamiento), tensor de momento Mij y comparación entre la subducción chilena, Islandia, Turquía y los Alpes.',
    subtitleEn: 'The modern seismology standard: fault orientation (strike, dip, rake), moment tensor Mij, and comparison of Chilean subduction, Iceland rift, Turkey strike-slip, and Alpine collision.',
    color: '#EF4444',
    icon: Globe,
    defaults: { strike: 15, dip: 20, rake: 90, magnitude: 8.8 },
    sliders: [
      { key: 'strike', labelEs: 'Rumbo / Strike (φ)', labelEn: 'Strike Angle (φ)', min: 0, max: 360, step: 5, unit: '°' },
      { key: 'dip', labelEs: 'Buzamiento / Dip (δ)', labelEn: 'Dip Angle (δ)', min: 10, max: 90, step: 1, unit: '°' },
      { key: 'rake', labelEs: 'Deslizamiento / Rake (λ)', labelEn: 'Rake Angle (λ)', min: -180, max: 180, step: 5, unit: '°' },
      { key: 'magnitude', labelEs: 'Magnitud de Momento (Mw)', labelEn: 'Moment Magnitude (Mw)', min: 5.0, max: 9.5, step: 0.1, unit: '' }
    ],
    presets: [
      {
        labelEs: '🇨🇱 Subducción Chilena (Megaterremoto Maule 2010 / Valdivia 1960)',
        labelEn: '🇨🇱 Chilean Subduction Megathrust (Maule 2010 / Valdivia 1960)',
        values: { strike: 15, dip: 18, rake: 90, magnitude: 8.8 }
      },
      {
        labelEs: '🇮🇸 Dorsal / Rift en Islandia (Falla Normal Tensional en Thingvellir)',
        labelEn: '🇮🇸 Iceland Rift Zone (Extensional Normal Faulting in Thingvellir)',
        values: { strike: 30, dip: 60, rake: -90, magnitude: 6.5 }
      },
      {
        labelEs: '🇹🇷 Falla de Anatolia / San Andrés (Falla de Rumbo / Strike-Slip Kahramanmaraş)',
        labelEn: '🇹🇷 Anatolian Fault / San Andreas (Pure Strike-Slip Kahramanmaraş 2023)',
        values: { strike: 75, dip: 90, rake: 0, magnitude: 7.8 }
      },
      {
        labelEs: '🏔️ Colisión Orogénica en los Alpes / Himalaya (Cabalgamiento Cortical)',
        labelEn: '🏔️ Alpine / Himalayan Continental Collision (Deep Crustal Thrusting)',
        values: { strike: 80, dip: 35, rake: 90, magnitude: 7.5 }
      }
    ],
    algebraSection: {
      titleEs: 'Tensor de Momento Sísmico M_ij y Proyección Estereográfica',
      titleEn: 'Seismic Moment Tensor M_ij & Stereographic Projection',
      formulas: [
        {
          labelEs: '1. Tensor de Momento Sísmico de Doble Par (Double Couple):',
          labelEn: '1. Double Couple Seismic Moment Tensor:',
          latex: 'M_{ij} = M_0 (u_i n_j + u_j n_i)',
          eq: 'M_ij = M₀ (u_i n_j + u_j n_i)',
          eqEs: 'M_ij = M₀ (u_i n_j + u_j n_i)   donde u⃗ = slip, n̂ = normal de falla, Tr(M) = 0',
          eqEn: 'M_ij = M₀ (u_i n_j + u_j n_i)   where u⃗ = slip, n̂ = fault normal, Tr(M) = 0'
        },
        {
          labelEs: '2. Relación de Kanamori para Magnitud de Momento (Mw):',
          labelEn: '2. Kanamori Relation for Moment Magnitude (Mw):',
          latex: 'M_0 = \\mu A \\bar{D} \\quad ; \\quad M_w = \\frac{2}{3}(\\log_{10} M_0 - 9.1)',
          eq: 'M_w = ⅔ (log₁₀ M₀ - 9.1)     ;     M₀ = μ · A · D  (N·m)'
        },
        {
          labelEs: '3. Descomposición Espectral en Ejes Principales (P, T, B):',
          labelEn: '3. Spectral Decomposition into Principal Axes (P, T, B):',
          latex: '\\hat{\\mathbf{P}} = \\frac{\\hat{\\mathbf{n}} - \\hat{\\mathbf{u}}}{\\sqrt{2}}, \\quad \\hat{\\mathbf{T}} = \\frac{\\hat{\\mathbf{n}} + \\hat{\\mathbf{u}}}{\\sqrt{2}}',
          eq: 'P⃗ = (n̂ - u⃗)/√2   ;   T⃗ = (n̂ + u⃗)/√2',
          eqEs: 'P⃗ = (n̂ - u⃗)/√2 (Compresión Máxima)   ;   T⃗ = (n̂ + u⃗)/√2 (Tracción Máxima)',
          eqEn: 'P⃗ = (n̂ - u⃗)/√2 (Maximum Compression)   ;   T⃗ = (n̂ + u⃗)/√2 (Maximum Tension)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Ecuación Elastodinámica de Navier-Cauchy y Ondas P/S',
      titleEn: 'Navier-Cauchy Elastodynamic PDE & P/S Wave Separation',
      formulas: [
        {
          labelEs: '1. Ecuación de Navier-Cauchy en medios continuos elásticos:',
          labelEn: '1. Navier-Cauchy elastodynamic continuous medium equation:',
          latex: '\\rho \\frac{\\partial^2 \\mathbf{u}}{\\partial t^2} = (\\lambda + \\mu)\\nabla(\\nabla \\cdot \\mathbf{u}) + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}',
          eq: 'ρ ∂²u⃗/∂t² = (λ + μ) ∇(∇·u⃗) + μ ∇²u⃗ + f⃗'
        },
        {
          labelEs: '2. Descomposición de Helmholtz en potencial escalar y vectorial:',
          labelEn: '2. Helmholtz decomposition into scalar & vector potentials:',
          latex: '\\mathbf{u} = \\nabla\\phi + \\nabla \\times \\boldsymbol{\\psi} \\implies \\frac{\\partial^2 \\phi}{\\partial t^2} = v_P^2 \\nabla^2 \\phi, \\quad \\frac{\\partial^2 \\boldsymbol{\\psi}}{\\partial t^2} = v_S^2 \\nabla^2 \\boldsymbol{\\psi}',
          eq: 'u⃗ = ∇φ + ∇ × ψ⃗   ⇒   ∂²φ/∂t² = v_P² ∇²φ   ;   ∂²ψ⃗/∂t² = v_S² ∇²ψ⃗'
        },
        {
          labelEs: '3. Velocidades elásticas de ondas de cuerpo y razón teórica:',
          labelEn: '3. Elastic body wave velocities & theoretical ratio:',
          latex: 'v_P = \\sqrt{\\frac{\\lambda + 2\\mu}{\\rho}}, \\quad v_S = \\sqrt{\\frac{\\mu}{\\rho}} \\implies \\frac{v_P}{v_S} = \\sqrt{\\frac{\\lambda + 2\\mu}{\\mu}} \\approx \\sqrt{3} \\approx 1.73',
          eq: 'v_P = √((λ + 2μ)/ρ)   ;   v_S = √(μ/ρ)   ⇒   v_P / v_S = √((λ+2μ)/μ) ≈ √3 ≈ 1.73'
        }
      ]
    },
    exercise: {
      questionEs:
        'En un megaterremoto de subducción en Chile con Mw = 8.8 (M₀ ≈ 1.995 × 10²² N·m) y área de ruptura A = 400 km × 150 km en corteza con rigidez μ = 3.5×10¹⁰ Pa, ¿cuál es el desplazamiento medio de deslizamiento cosísmico D en la falla?',
      questionEn:
        'In a Chilean subduction megathrust earthquake with Mw = 8.8 (M₀ ≈ 1.995 × 10²² N·m) and rupture area A = 400 km × 150 km in crust with μ = 3.5×10¹⁰ Pa, what is the mean coseismic fault slip D?',
      presetValues: { strike: 15, dip: 18, rake: 90, magnitude: 8.8 },
      options: [
        { id: 'a', textEs: 'D ≈ 9.5 m (Deslizamiento cosísmico masivo característico de Mw 8.8)', textEn: 'D ≈ 9.5 m (Massive coseismic slip typical of Mw 8.8 megathrust)', text: 'D ≈ 9.5 m', correct: true },
        { id: 'b', textEs: 'D ≈ 0.95 m (Deslizamiento subestimado)', textEn: 'D ≈ 0.95 m (Underestimated slip)', text: 'D ≈ 0.95 m', correct: false },
        { id: 'c', textEs: 'D ≈ 95.0 m (Físicamente inconsistente)', textEn: 'D ≈ 95.0 m (Physically inconsistent)', text: 'D ≈ 95.0 m', correct: false },
        { id: 'd', textEs: 'D ≈ 0.10 m (Régimen de microsismicidad)', textEn: 'D ≈ 0.10 m (Microseismicity regime)', text: 'D ≈ 0.10 m', correct: false }
      ],
      hintEs: 'Aplica la relación fundamental del momento sísmico escalar: M₀ = μ · A · D. Despeja el deslizamiento medio D = M₀ / (μ · A).',
      hintEn: 'Apply the fundamental scalar seismic moment relation: M₀ = μ · A · D. Isolate mean slip D = M₀ / (μ · A).',
      solutionStepsEs: [
        '1. Momento sísmico: M₀ = 10^(1.5 · 8.8 + 9.1) = 10^22.3 ≈ 1.995 × 10²² N·m.',
        '2. Área de ruptura: A = (400 × 10³ m) × (150 × 10³ m) = 6.0 × 10¹⁰ m².',
        '3. Deslizamiento medio: D = M₀ / (μ · A) = (1.995 × 10²²) / (3.5 × 10¹⁰ × 6.0 × 10¹⁰) ≈ 9.50 metros.'
      ],
      solutionStepsEn: [
        '1. Seismic moment: M₀ = 10^(1.5 · 8.8 + 9.1) = 10^22.3 ≈ 1.995 × 10²² N·m.',
        '2. Rupture area: A = (400 × 10³ m) × (150 × 10³ m) = 6.0 × 10¹⁰ m².',
        '3. Mean fault slip: D = M₀ / (μ · A) = (1.995 × 10²²) / (3.5 × 10¹⁰ × 6.0 × 10¹⁰) ≈ 9.50 meters.'
      ]
    }
  },
  {
    id: 'bouguer_gravity',
    courseId: 'geophysics',
    badgeEs: 'Campos Potenciales & Gravimetría (GF-402 FCFM)',
    badgeEn: 'Potential Fields & Gravimetry (GF-402)',
    titleEs: 'Campos Potenciales: Gravimetría, Ecuación de Poisson e Isostasia de Airy en los Andes',
    titleEn: 'Potential Fields: Gravimetry, Poisson Equation & Airy Isostasy in the Andes',
    subtitleEs: 'El problema fundacional de corteza y prospección: por qué los Andes presentan una anomalía de Bouguer fuertemente negativa (-300 mGal) debido a la raíz cortical de baja densidad que desplaza al manto.',
    subtitleEn: 'The core crustal & geophysical prospecting benchmark: why the Andes display an intense negative Bouguer anomaly (-300 mGal) due to their low-density crustal root displacing dense mantle.',
    color: '#F59E0B',
    icon: Mountain,
    defaults: { mountainHeight: 4000, crustDensity: 2670, mantleDensity: 3300, crustThickness: 35 },
    sliders: [
      { key: 'mountainHeight', labelEs: 'Altura de la Cordillera (h)', labelEn: 'Mountain Elevation (h)', min: 500, max: 6500, step: 250, unit: ' m' },
      { key: 'crustDensity', labelEs: 'Densidad de Corteza (ρ_c)', labelEn: 'Crustal Density (ρ_c)', min: 2400, max: 2900, step: 20, unit: ' kg/m³' },
      { key: 'mantleDensity', labelEs: 'Densidad de Manto (ρ_m)', labelEn: 'Mantle Density (ρ_m)', min: 3100, max: 3500, step: 20, unit: ' kg/m³' },
      { key: 'crustThickness', labelEs: 'Espesor Normal de Corteza (H₀)', labelEn: 'Normal Crust Thickness (H₀)', min: 20, max: 50, step: 1, unit: ' km' }
    ],
    presets: [
      {
        labelEs: '🏔️ Cordillera de los Andes / Altiplano (h = 4200m, Raíz Profunda ~20km)',
        labelEn: '🏔️ Andes Range / Altiplano Plateau (h = 4200m, Deep ~20km Root)',
        values: { mountainHeight: 4200, crustDensity: 2670, mantleDensity: 3300, crustThickness: 35 }
      },
      {
        labelEs: '🛡️ Escudo Continental Estable (h = 300m, Sin Raíz Cortical)',
        labelEn: '🛡️ Stable Continental Shield (h = 300m, No Significant Root)',
        values: { mountainHeight: 300, crustDensity: 2670, mantleDensity: 3300, crustThickness: 35 }
      },
      {
        labelEs: '🌊 Fosa de Atacama / Trinchera Oceánica (h = -7000m, Adelgazamiento Cortical)',
        labelEn: '🌊 Atacama Trench / Deep Ocean (h = -7000m, Thin Oceanic Crust)',
        values: { mountainHeight: 800, crustDensity: 2850, mantleDensity: 3300, crustThickness: 15 }
      },
      {
        labelEs: '🌋 Edificio Volcánico Descompensado (Carga Topográfica Inelástica)',
        labelEn: '🌋 Uncompensated Volcanic Edifice (Rigid Plate Topographic Load)',
        values: { mountainHeight: 5500, crustDensity: 2500, mantleDensity: 3300, crustThickness: 40 }
      }
    ],
    algebraSection: {
      titleEs: 'Balance Isostático de Airy y Correcciones Gravimétricas',
      titleEn: 'Airy Isostatic Balance & Gravimetric Reductions',
      formulas: [
        {
          labelEs: '1. Condición de Compensación Isostática de Airy (Presión Litostática):',
          labelEn: '1. Airy Isostatic Compensation (Lithostatic Pressure Balance):',
          latex: '\\rho_c (h + H_0 + b) = \\rho_c H_0 + \\rho_m b \\implies b = h \\frac{\\rho_c}{\\rho_m - \\rho_c}',
          eq: 'ρ_c (h + H₀ + b) = ρ_c H₀ + ρ_m b   ⇒   b = h · ρ_c / (ρ_m - ρ_c)'
        },
        {
          labelEs: '2. Corrección de Placa de Bouguer (Atracción de Masa Topográfica):',
          labelEn: '2. Bouguer Slab Reduction (Topographic Mass Attraction):',
          latex: '\\delta g_{\\text{BS}} = -2\\pi G \\rho_c h \\approx -0.04193 \\cdot 10^{-3} \\rho_c h \\quad (\\text{mGal})',
          eq: 'δg_BS = -2π G ρ_c h ≈ -0.04193 · 10⁻³ · ρ_c · h  (mGal)'
        },
        {
          labelEs: '3. Anomalía Completa de Bouguer en Cordillera:',
          labelEn: '3. Complete Bouguer Anomaly across Mountain Ranges:',
          latex: '\\Delta g_B = g_{\\text{obs}} - \\gamma_0 + 0.3086 h - 2\\pi G \\rho_c h + \\delta g_{\\text{root}}',
          eq: 'Δg_B = g_obs - g₀ + 0.3086 h - 2πG ρ_c h + δg_root  (Valores fuertemente negativos en Andes)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Ecuación de Poisson para el Potencial Gravitacional',
      titleEn: 'Poisson PDE for Gravitational Potential Fields',
      formulas: [
        {
          labelEs: '1. Ecuación diferencial parcial de Poisson (Ley de Gauss gravitatoria):',
          labelEn: '1. Poisson Partial Differential Equation (Gravitational Gauss Law):',
          latex: '\\nabla^2 U = 4\\pi G \\rho(\\mathbf{r}) \\implies \\mathbf{g} = -\\nabla U',
          eq: '∇² U = 4π G ρ(x⃗)   ⇒   g⃗ = -∇U'
        },
        {
          labelEs: '2. Solución integral por función de Green en semiespacio 3D:',
          labelEn: '2. Green function integral solution in 3D half-space:',
          latex: 'U(\\mathbf{r}) = -G \\iiint \\frac{\\rho(\\mathbf{r}\')}{|\\mathbf{r} - \\mathbf{r}\'|} d^3\\mathbf{r}\'',
          eq: 'U(x⃗) = -G ∭ (ρ(x⃗\') / |x⃗ - x⃗\'|) dV\''
        },
        {
          labelEs: '3. Tensor de Gradiente Gravimétrico (Segundas Derivadas Cruzadas):',
          labelEn: '3. Gravity Gradient Tensor (Cross Second Derivatives):',
          latex: '\\Gamma_{ij} = \\frac{\\partial^2 U}{\\partial x_i \\partial x_j} = \\frac{\\partial g_i}{\\partial x_j}',
          eq: 'Γ_ij = ∂²U / ∂x_i ∂x_j',
          eqEs: 'Γ_ij = ∂²U / ∂x_i ∂x_j   con   Tr(Γ) = ∇²U = 4π G ρ (Ecuación diferencial local)',
          eqEn: 'Γ_ij = ∂²U / ∂x_i ∂x_j   with   Tr(Γ) = ∇²U = 4π G ρ (Local Poisson field PDE)'
        }
      ]
    },
    exercise: {
      questionEs:
        'En los Andes Centrales a una altitud de h = 4000 m (ρ_c = 2670 kg/m³, manto ρ_m = 3300 kg/m³), ¿cuál es el espesor b de la raíz cortical que penetra en el manto según la compensación isostática de Airy?',
      questionEn:
        'In the Central Andes at elevation h = 4000 m (crustal density ρ_c = 2670 kg/m³, mantle ρ_m = 3300 kg/m³), what is the thickness b of the crustal root penetrating the mantle under Airy isostasy?',
      presetValues: { mountainHeight: 4000, crustDensity: 2670, mantleDensity: 3300, crustThickness: 35 },
      options: [
        { id: 'a', textEs: 'b ≈ 17.0 km (Profunda raíz cortical que genera anomalía de Bouguer negativa)', textEn: 'b ≈ 17.0 km (Deep crustal root producing negative Bouguer anomaly)', text: 'b ≈ 17.0 km', correct: true },
        { id: 'b', textEs: 'b ≈ 4.0 km (Igual a la elevación superficial h)', textEn: 'b ≈ 4.0 km (Equal to surface elevation h)', text: 'b ≈ 4.0 km', correct: false },
        { id: 'c', textEs: 'b ≈ 35.0 km (Corteza basal sobrecompensada)', textEn: 'b ≈ 35.0 km (Overcompensated basal crust)', text: 'b ≈ 35.0 km', correct: false },
        { id: 'd', textEs: 'b ≈ 0.5 km (Topografía no compensada)', textEn: 'b ≈ 0.5 km (Uncompensated topography)', text: 'b ≈ 0.5 km', correct: false }
      ],
      hintEs: 'Aplica el balance isostático de masas a nivel de compensación: b = h · [ρ_c / (ρ_m - ρ_c)]. El contraste de densidades es Δρ = 630 kg/m³.',
      hintEn: 'Apply the isostatic mass balance at compensation depth: b = h · [ρ_c / (ρ_m - ρ_c)]. The density contrast is Δρ = 630 kg/m³.',
      solutionStepsEs: [
        '1. Contraste de densidad corteza-manto: Δρ = ρ_m - ρ_c = 3300 - 2670 = 630 kg/m³.',
        '2. Fórmula de raíz isostática: b = h · (ρ_c / Δρ) = 4000 m · (2670 / 630).',
        '3. Cálculo: b ≈ 16,952 m ≈ 17.0 km de raíz cortical.'
      ],
      solutionStepsEn: [
        '1. Crust-mantle density contrast: Δρ = ρ_m - ρ_c = 3300 - 2670 = 630 kg/m³.',
        '2. Isostatic root formula: b = h · (ρ_c / Δρ) = 4000 m · (2670 / 630).',
        '3. Result: b ≈ 16,952 m ≈ 17.0 km of crustal root.'
      ]
    }
  },
  {
    id: 'ekman_spiral',
    courseId: 'geophysics',
    badgeEs: 'Oceanografía Dinámica (GF-403 FCFM)',
    badgeEn: 'Dynamical Oceanography (GF-403)',
    titleEs: 'Espiral de Ekman y Surgencia Costera en la Corriente de Humboldt (Chile)',
    titleEn: 'Ekman Spiral & Coastal Upwelling in the Humboldt Current (Chile)',
    subtitleEs: 'El motor biogeoquímico marino: balance entre tensión del viento, viscosidad turbulenta y Coriolis, provocando transporte a 90° hacia mar abierto y surgencia de aguas profundas frías ricas en nutrientes.',
    subtitleEn: 'The marine biogeochemical engine: balance between wind stress, turbulent eddy viscosity, and Coriolis, driving 90° offshore transport and cold nutrient-rich deep upwelling.',
    color: '#06B6D4',
    icon: Waves,
    defaults: { windSpeed: 12, latitude: -33, eddyViscosity: 0.05 },
    sliders: [
      { key: 'windSpeed', labelEs: 'Velocidad del Viento Superficial (W)', labelEn: 'Surface Wind Speed (W)', min: 2, max: 25, step: 1, unit: ' m/s' },
      { key: 'latitude', labelEs: 'Latitud Geográfica (φ)', labelEn: 'Latitude (φ, Negative = Chile)', min: -70, max: 70, step: 5, unit: '°' },
      { key: 'eddyViscosity', labelEs: 'Viscosidad Turbulenta (A_z)', labelEn: 'Turbulent Eddy Viscosity (A_z)', min: 0.01, max: 0.20, step: 0.01, unit: ' m²/s' }
    ],
    presets: [
      {
        labelEs: '🇨🇱 Costa Central de Chile (Valparaíso -33°S, Viento Sur Fuerte & Surgencia Humboldt)',
        labelEn: '🇨🇱 Central Chile Coast (Valparaíso -33°S, Southerly Wind & Humboldt Upwelling)',
        values: { windSpeed: 12, latitude: -33, eddyViscosity: 0.05 }
      },
      {
        labelEs: '🇨🇱 Norte de Chile / Antofagasta (-23°S, Alisios Permanentes)',
        labelEn: '🇨🇱 Northern Chile / Antofagasta (-23°S, Permanent Trade Wind Upwelling)',
        values: { windSpeed: 14, latitude: -23, eddyViscosity: 0.04 }
      },
      {
        labelEs: '🇺🇸 Costa de California / Oregón (+38°N, Hemisferio Norte)',
        labelEn: '🇺🇸 California / Oregon Coast (+38°N, Northern Hemisphere)',
        values: { windSpeed: 12, latitude: 38, eddyViscosity: 0.05 }
      },
      {
        labelEs: '🌴 Zona Ecuatorial (φ ≈ 0°, Coriolis Nulo, Sin Espiral)',
        labelEn: '🌴 Equatorial Doldrums (φ ≈ 0°, Zero Coriolis, Collapsed Spiral)',
        values: { windSpeed: 8, latitude: 5, eddyViscosity: 0.05 }
      }
    ],
    algebraSection: {
      titleEs: 'Velocidad Compleja V(z) y Transporte Neto de Ekman a 90°',
      titleEn: 'Complex Velocity V(z) & 90° Net Ekman Transport',
      formulas: [
        {
          labelEs: '1. Desviación superficial a 45° de la corriente inducida por viento:',
          labelEn: '1. Surface current 45° deflection under wind stress:',
          latex: 'V_0 = \\frac{\\tau_0}{\\rho \\sqrt{|f| A_z}} e^{-i \\pi/4} \\quad (45^\\circ \\text{ surface deflection})',
          eq: 'V₀ = τ₀ / (ρ √( |f| A_z ))',
          eqEs: 'V₀ = τ₀ / (ρ √( |f| A_z ))   con   θ_sup = ±45° (Izquierda en Chile, Derecha en Hem. Norte)',
          eqEn: 'V₀ = τ₀ / (ρ √( |f| A_z ))   with   θ_surf = ±45° (Left in Chile/SH, Right in NH)'
        },
        {
          labelEs: '2. Transporte Neto Integrado de Masa de Ekman (M_E):',
          labelEn: '2. Net Depth-Integrated Ekman Transport (M_E):',
          latex: '\\mathbf{M}_E = \\int_{-\\infty}^0 \\rho \\mathbf{V}(z) dz = \\frac{\\boldsymbol{\\tau}_0 \\times \\hat{\\mathbf{k}}}{|f|}',
          eq: 'M⃗_E = (τ⃗₀ × k̂) / (ρ f)   ⇒   Dirección exactamente ortogonal (90°) al viento'
        },
        {
          labelEs: '3. Parámetro de Coriolis y Profundidad de Ekman:',
          labelEn: '3. Coriolis Parameter & Ekman Boundary Layer Depth:',
          latex: 'f = 2\\Omega\\sin\\phi \\quad ; \\quad D_E = \\pi \\sqrt{\\frac{2 A_z}{|f|}}',
          eq: 'f = 2Ω sin(φ)     ;     D_E = π √( 2 A_z / |f| )'
        }
      ]
    },
    calculusSection: {
      titleEs: 'EDO Compleja de Viscosidad y Bombeo de Surgencia Costera',
      titleEn: 'Complex Viscous ODE & Coastal Upwelling Ekman Pumping',
      formulas: [
        {
          labelEs: '1. Sistema de EDOs acopladas unificadas en variable compleja V = u + iv:',
          labelEn: '1. Coupled viscous ODE system unified via complex velocity V = u + iv:',
          latex: 'A_z \\frac{\\partial^2 \\mathbf{V}}{\\partial z^2} - i f \\mathbf{V} = 0 \\quad (\\mathbf{V} = u + i v)',
          eq: 'A_z d²V/dz² - i f V = 0',
          eqEs: 'A_z d²V/dz² - i f V = 0   con condición de borde   A_z dV/dz|_{z=0} = τ₀/ρ',
          eqEn: 'A_z d²V/dz² - i f V = 0   with boundary condition   A_z dV/dz|_{z=0} = τ₀/ρ'
        },
        {
          labelEs: '2. Solución analítica exponencial amortiguada (Espiral):',
          labelEn: '2. Damped exponential analytical solution (Spiral):',
          latex: '\\mathbf{V}(z) = V_0 \\exp\\left(-\\frac{z}{D_E}\\right) \\exp\\left(-i \\frac{z}{D_E}\\right)',
          eq: 'V(z) = V₀ · exp( -(1 ± i) z / D_E )'
        },
        {
          labelEs: '3. Velocidad vertical de surgencia por divergencia (Bombeo de Ekman):',
          labelEn: '3. Vertical upwelling velocity via transport divergence (Ekman Pumping):',
          latex: 'w_E = \\frac{1}{\\rho f} (\\nabla \\times \\boldsymbol{\\tau}_0)_z \\quad (\\text{Ekman Pumping / Upwelling})',
          eq: 'w_E = (1 / (ρ f)) (∇ × τ⃗₀)_z   (Ascenso de aguas frías ricas en nutrientes)'
        }
      ]
    },
    exercise: {
      questionEs:
        'En las costas de Valparaíso (φ = -33°S, f = -7.94×10⁻⁵ s⁻¹), un viento del sur produce una tensión superficial τ₀ = 0.228 Pa en agua marina (ρ = 1025 kg/m³). ¿Cuál es la magnitud del Transporte neto de Ekman M_E y hacia qué dirección se desplaza la masa de agua superficial?',
      questionEn:
        'Off the coast of Valparaíso (φ = -33°S, f = -7.94×10⁻⁵ s⁻¹), a southerly wind produces surface stress τ₀ = 0.228 Pa in seawater (ρ = 1025 kg/m³). What is the net Ekman transport M_E magnitude, and in what direction does the surface water mass move?',
      presetValues: { windSpeed: 12, latitude: -33, eddyViscosity: 0.05 },
      options: [
        { id: 'a', textEs: 'M_E ≈ 2.80 m²/s hacia el Oeste (mar adentro a 90° a la izquierda), induciendo surgencia costera', textEn: 'M_E ≈ 2.80 m²/s Westward (offshore 90° to the left), driving coastal upwelling', text: 'M_E ≈ 2.80 m²/s Westward', correct: true },
        { id: 'b', textEs: 'M_E ≈ 2.80 m²/s hacia el Este (hacia la costa), provocando hundimiento', textEn: 'M_E ≈ 2.80 m²/s Eastward (onshore), driving downwelling', text: 'M_E ≈ 2.80 m²/s Eastward', correct: false },
        { id: 'c', textEs: 'M_E ≈ 0.23 m²/s hacia el Norte (paralelo exacto al viento)', textEn: 'M_E ≈ 0.23 m²/s Northward (parallel to wind)', text: 'M_E ≈ 0.23 m²/s Northward', correct: false },
        { id: 'd', textEs: 'M_E ≈ 28.5 m²/s hacia el Sur (en contra del viento)', textEn: 'M_E ≈ 28.5 m²/s Southward (against wind)', text: 'M_E ≈ 28.5 m²/s Southward', correct: false }
      ],
      hintEs: 'La magnitud del transporte neto integrado es M_E = τ₀ / (ρ · |f|). En el Hemisferio Sur, la fuerza de Coriolis desvía el transporte neto a 90° a la izquierda de la dirección del viento.',
      hintEn: 'Net integrated transport magnitude is M_E = τ₀ / (ρ · |f|). In the Southern Hemisphere, Coriolis deflects net transport 90° to the left of wind direction.',
      solutionStepsEs: [
        '1. Parámetro de Coriolis: |f| = 2 · (7.292×10⁻⁵ s⁻¹) · sin(33°) ≈ 7.943 × 10⁻⁵ s⁻¹.',
        '2. Transporte de Ekman: M_E = τ₀ / (ρ · |f|) = 0.228 / (1025 · 7.943×10⁻⁵) ≈ 2.80 m²/s.',
        '3. Dirección: 90° a la izquierda de un viento que sopla hacia el Norte apunta al Oeste (mar abierto), forzando la surgencia de aguas profundas ricas en nutrientes.'
      ],
      solutionStepsEn: [
        '1. Coriolis parameter: |f| = 2 · (7.292×10⁻⁵ s⁻¹) · sin(33°) ≈ 7.943 × 10⁻⁵ s⁻¹.',
        '2. Ekman transport: M_E = τ₀ / (ρ · |f|) = 0.228 / (1025 · 7.943×10⁻⁵) ≈ 2.80 m²/s.',
        '3. Direction: 90° to the left of a northward wind points West (offshore), forcing upwelling of deep nutrient-rich water.'
      ]
    }
  },
  {
    id: 'magnetotellurics',
    courseId: 'geophysics',
    badgeEs: 'Métodos Electromagnéticos (GF-404 FCFM)',
    badgeEn: 'Electromagnetic Methods (GF-404)',
    titleEs: 'Magnetotelúrica: Difusión de Maxwell, Efecto Pelicular (Skin Depth) y Resistividad Aparente',
    titleEn: 'Magnetotellurics: Maxwell Diffusion, Skin Depth & Apparent Resistivity',
    subtitleEs: 'El sondeo electromagnético profundo de la Tierra: penetración de ondas EM naturales en medios conductores, atenuación exponencial δ y relación de impedancia Z = Ex / Hy.',
    subtitleEn: 'Deep Earth electromagnetic sounding: natural EM wave penetration into conductive media, exponential skin depth δ, and impedance ratio Z = Ex / Hy.',
    color: '#8B5CF6',
    icon: Radio,
    defaults: { frequency: 10, resTop: 20, resBottom: 500, layerThickness: 300 },
    sliders: [
      { key: 'frequency', labelEs: 'Frecuencia de Onda EM (f)', labelEn: 'EM Wave Frequency (f)', min: 0.1, max: 200, step: 1, unit: ' Hz' },
      { key: 'resTop', labelEs: 'Resistividad Capa 1 (ρ₁)', labelEn: 'Layer 1 Resistivity (ρ₁)', min: 2, max: 150, step: 2, unit: ' Ω·m' },
      { key: 'resBottom', labelEs: 'Resistividad Capa 2 (ρ₂)', labelEn: 'Layer 2 Resistivity (ρ₂)', min: 50, max: 2000, step: 50, unit: ' Ω·m' },
      { key: 'layerThickness', labelEs: 'Espesor Capa 1 (h₁)', labelEn: 'Layer 1 Thickness (h₁)', min: 50, max: 1000, step: 25, unit: ' m' }
    ],
    presets: [
      {
        labelEs: '🌋 Reservorio Geotérmico / Volcánico (Capa Arcillosa Conductora sobre Basamento Resistivo)',
        labelEn: '🌋 Geothermal / Volcanic Reservoir (Conductive Clay Cap over Resistive Basement)',
        values: { frequency: 10, resTop: 15, resBottom: 600, layerThickness: 250 }
      },
      {
        labelEs: '🌊 Acuífero Salino / Cuenca de Salar en Atacama (ρ₁ Muy Conductor)',
        labelEn: '🌊 Saline Aquifer / Atacama Salt Flat Basin (Highly Conductive ρ₁)',
        values: { frequency: 25, resTop: 4, resBottom: 300, layerThickness: 150 }
      },
      {
        labelEs: '🪨 Basamento Cristalino Homogéneo (Semiespacio Uniforme)',
        labelEn: '🪨 Homogeneous Crystalline Basement (Uniform Half-Space)',
        values: { frequency: 5, resTop: 500, resBottom: 500, layerThickness: 500 }
      },
      {
        labelEs: '📡 Sondeo de Alta Frecuencia (Investigación Geotécnica Somera)',
        labelEn: '📡 High-Frequency Sounding (Shallow Geotechnical Investigation)',
        values: { frequency: 150, resTop: 25, resBottom: 800, layerThickness: 80 }
      }
    ],
    algebraSection: {
      titleEs: 'Impedancia de Superficie y Resistividad Aparente de Cagniard',
      titleEn: 'Surface Wave Impedance & Cagniard Apparent Resistivity',
      formulas: [
        {
          labelEs: '1. Módulo de impedancia de onda electromagnética en superficie:',
          labelEn: '1. Surface electromagnetic wave impedance modulus:',
          latex: 'Z(\\omega) = \\frac{E_x}{H_y} = \\sqrt{i \\omega \\mu_0 \\rho} \\quad (\\Omega)',
          eq: 'Z(ω) = E_x / H_y = √( i ω μ₀ ρ )   (Ω, Volts/Ampere)'
        },
        {
          labelEs: '2. Fórmula de resistividad aparente de Cagniard:',
          labelEn: '2. Cagniard apparent resistivity formula:',
          latex: '\\rho_a(T) = \\frac{1}{\\omega \\mu_0}\\left|\\frac{E_x}{H_y}\\right|^2 \\approx 0.2 T \\left|\\frac{E_x}{H_y}\\right|^2',
          eq: 'ρ_a(T) = (1 / (ω μ₀)) |E_x / H_y|²',
          eqEs: 'ρ_a(T) = (1 / (ω μ₀)) |E_x / H_y|² = 0.2 · T · |E_x / H_y|²  (con T = 1/f)',
          eqEn: 'ρ_a(T) = (1 / (ω μ₀)) |E_x / H_y|² = 0.2 · T · |E_x / H_y|²  (with T = 1/f)'
        },
        {
          labelEs: '3. Fórmula práctica de profundidad de penetración (Skin Depth):',
          labelEn: '3. Practical Skin Depth penetration formula:',
          latex: '\\delta \\approx \\sqrt{\\frac{2}{\\omega \\mu_0 \\sigma}} \\approx 503 \\sqrt{\\frac{\\rho}{f}} \\quad (\\text{meters})',
          eq: 'δ ≈ √( 2 / (ω μ₀ σ) ) ≈ 503 √( ρ / f )   (metros)'
        }
      ]
    },
    calculusSection: {
      titleEs: 'Ecuación de Difusión de Maxwell y Función de Impedancia de Riccati',
      titleEn: 'Maxwell Diffusion PDE & Riccati Multilayer Impedance',
      formulas: [
        {
          labelEs: '1. Ecuación de difusión electromagnética cuasi-estacionaria en la Tierra:',
          labelEn: '1. Quasi-stationary electromagnetic diffusion PDE in conductive Earth:',
          latex: '\\nabla^2 \\mathbf{E} = \\mu_0 \\sigma \\frac{\\partial \\mathbf{E}}{\\partial t} \\quad \\left(\\frac{\\partial \\mathbf{D}}{\\partial t} \\approx \\mathbf{0}\\right)',
          eq: '∇² E⃗ = μ₀ σ ∂E⃗/∂t   (Corriente de desplazamiento ∂D/∂t despreciable)'
        },
        {
          labelEs: '2. Solución armónica en profundidad para semiespacio homogéneo:',
          labelEn: '2. Harmonic depth solution in homogeneous half-space:',
          latex: 'E_x(z, t) = E_0 e^{-z/\\delta} \\cos(\\omega t - z/\\delta)',
          eq: 'E_x(z, t) = E₀ · e^{-z/δ} · cos(ω t - z/δ)'
        },
        {
          labelEs: '3. Ecuación diferencial no lineal de Riccati para subsuelo estratificado:',
          labelEn: '3. Nonlinear Riccati differential equation for stratified ground:',
          latex: '\\frac{dZ}{dz} - \\frac{\\sigma}{\\mu_0} Z^2 = i\\omega \\quad (\\text{Nonlinear Riccati ODE})',
          eq: 'dZ/dz - (σ / μ₀) Z² = i ω',
          eqEs: 'dZ/dz - (σ / μ₀) Z² = i ω   (Recursión de capas para inversión tomográfica)',
          eqEn: 'dZ/dz - (σ / μ₀) Z² = i ω   (Layer recursion for tomographic inversion)'
        }
      ]
    },
    exercise: {
      questionEs:
        'En un sondeo magnetotelúrico sobre una capa arcillosa geotérmica de resistividad ρ₁ = 16 Ω·m, se registra una señal natural de frecuencia f = 4 Hz. ¿Cuál es la profundidad de penetración (Skin Depth) δ en el subsuelo?',
      questionEn:
        'In a magnetotelluric survey over a geothermal clay cap of resistivity ρ₁ = 16 Ω·m, an EM natural signal of frequency f = 4 Hz is measured. What is the subsurface skin depth δ?',
      presetValues: { frequency: 4, resTop: 16, resBottom: 600, layerThickness: 250 },
      options: [
        { id: 'a', textEs: 'δ ≈ 1006 m (Aproximadamente 1.0 km de penetración de la onda EM)', textEn: 'δ ≈ 1006 m (Approximately 1.0 km EM wave skin depth)', text: 'δ ≈ 1006 m', correct: true },
        { id: 'b', textEs: 'δ ≈ 200 m (Atenuación excesiva inmediata)', textEn: 'δ ≈ 200 m (Excessive immediate attenuation)', text: 'δ ≈ 200 m', correct: false },
        { id: 'c', textEs: 'δ ≈ 5030 m (Sobreestimación por omisión de frecuencia)', textEn: 'δ ≈ 5030 m (Overestimate from omitted frequency)', text: 'δ ≈ 5030 m', correct: false },
        { id: 'd', textEs: 'δ ≈ 64 m (Escala dimensional errónea)', textEn: 'δ ≈ 64 m (Incorrect dimensional scale)', text: 'δ ≈ 64 m', correct: false }
      ],
      hintEs: 'Aplica la aproximación práctica para el Skin Depth electromagnético cuasi-estacionario: δ ≈ 503 · √(ρ / f).',
      hintEn: 'Apply the practical quasi-stationary electromagnetic skin depth formula: δ ≈ 503 · √(ρ / f).',
      solutionStepsEs: [
        '1. Relación de resistividad y frecuencia: ρ / f = 16 / 4 = 4.0.',
        '2. Raíz cuadrada: √(ρ / f) = √4.0 = 2.0.',
        '3. Skin depth: δ ≈ 503 · 2.0 = 1006 metros.'
      ],
      solutionStepsEn: [
        '1. Resistivity to frequency ratio: ρ / f = 16 / 4 = 4.0.',
        '2. Square root: √(ρ / f) = √4.0 = 2.0.',
        '3. Skin depth: δ ≈ 503 · 2.0 = 1006 meters.'
      ]
    }
  }
];
