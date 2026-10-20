import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUp
} from 'lucide-react';

// ============================================================================
// CATALOG OF 6 CLASSICAL PHYSICS & ENGINEERING LAB PROBLEMS
// ============================================================================
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
          eq: '∑F_y′ = N - m₁·g·cos(θ) = 0   ⇒   N = m₁·g·cos(θ)'
        },
        {
          labelEs: '2. Condición de bloqueo estático (¿Se mueve o no?):',
          labelEn: '2. Static lock threshold (Does it move?):',
          eq: '|m₂·g - m₁·g·sin(θ)| ≤ f_s,max = μ·m₁·g·cos(θ)   ⇒   a = 0'
        },
        {
          labelEs: '3. Sistema acoplado 2×2 en movimiento (Forma Matricial):',
          labelEn: '3. Coupled 2×2 system in motion (Matrix Form):',
          eq: '[ m₁   1 ] [ a ] = [ -m₁·g·sin(θ) ∓ μ·m₁·g·cos(θ) ]\n[ m₂  -1 ] [ T ]   [            m₂·g              ]'
        },
        {
          labelEs: '4. Solución explícita de aceleración (si sube por la rampa):',
          labelEn: '4. Explicit acceleration solution (moving up-ramp):',
          eq: 'a = g · (m₂ - m₁·sin(θ) - μ·m₁·cos(θ)) / (m₁ + m₂)'
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
          eq: '(m₁ + m₂) · (d²s / dt²) = (m₂ - m₁·sin(θ))·g - μ·m₁·g·cos(θ)·sgn(ds/dt)'
        },
        {
          labelEs: '2. Integración temporal para velocidad y posición:',
          labelEn: '2. Time integration for velocity and displacement:',
          eq: 'v(t) = ∫₀ᵗ a(τ) dτ = a·t     ;     s(t) = ∫₀ᵗ v(τ) dτ = ½·a·t²'
        },
        {
          labelEs: '3. Teorema del Trabajo y la Energía No Conservativa:',
          labelEn: '3. Work-Energy Theorem with Non-Conservative Friction:',
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
        { id: 'a', text: 'a = 1.60 m/s²', correct: true },
        { id: 'b', text: 'a = 2.45 m/s² (Olvidando el roce)', correct: false },
        { id: 'c', text: 'a = 0.00 m/s² (Bloqueado)', correct: false },
        { id: 'd', text: 'a = 3.27 m/s²', correct: false }
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
    subtitleEs: 'Compara en vivo la parábola ideal de Galileo en el vacío contra la ecuación diferencial real con resistencia del aire.',
    subtitleEn: 'Compare Galileo’s ideal vacuum parabola against the real differential equation with air drag.',
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
        labelEs: 'Vacío Ideal de Galileo (Alcance Máximo 45°)',
        labelEn: 'Galileo Ideal Vacuum (Max Range 45°)',
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
          eq: 'v₀ₓ = v₀ · cos(θ)     ;     v₀ᵧ = v₀ · sin(θ)'
        },
        {
          labelEs: '2. Eliminación algebraica del tiempo t para obtener la parábola y(x):',
          labelEn: '2. Algebraic elimination of time t to get parabola y(x):',
          eq: 'y(x) = x · tan(θ) - [ g / (2 · v₀² · cos²(θ)) ] · x²'
        },
        {
          labelEs: '3. Alcance horizontal máximo (R) y Altura máxima (H):',
          labelEn: '3. Maximum horizontal range (R) and Peak Altitude (H):',
          eq: 'R = (v₀² · sin(2θ)) / g     ;     H = (v₀² · sin²(θ)) / (2g)'
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
          eq: 'dy / dx = (dy/dt) / (dx/dt) = vᵧ(t) / vₓ(t) = tan(α(t))'
        },
        {
          labelEs: '2. Ecuación Diferencial Vectorial con Arrastre Lineal (F_d = -γ·v):',
          labelEn: '2. Vector Differential Equation with Linear Drag (F_d = -γ·v):',
          eq: 'm · (dv⃗ / dt) = m·g⃗ - γ·v⃗   ⇒   dvₓ/dt = -(γ/m)vₓ  ,  dvᵧ/dt = -g - (γ/m)vᵧ'
        },
        {
          labelEs: '3. Solución analítica por separación de variables:',
          labelEn: '3. Analytical solution via separation of variables:',
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
        { id: 'a', text: 'R = 91.74 m  y  dy/dx = 0', correct: true },
        { id: 'b', text: 'R = 45.87 m  y  dy/dx = 1', correct: false },
        { id: 'c', text: 'R = 91.74 m  y  dy/dx = -9.81', correct: false },
        { id: 'd', text: 'R = 64.87 m  y  dy/dx = 0', correct: false }
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
          eq: '∑Fₓ = 0   ,   ∑Fᵧ = R_A + R_B - M·g = 0   ,   ∑M_A = R_B·L - (M·g)·x_L = 0'
        },
        {
          labelEs: '2. Reacciones exactas en los apoyos A (x=0) y B (x=L=10m):',
          labelEn: '2. Exact reactions at supports A (x=0) and B (x=L=10m):',
          eq: 'R_B = M·g · (x_L / L)     ;     R_A = M·g · (1 - x_L / L)'
        },
        {
          labelEs: '3. Momento flector máximo bajo el punto de aplicación de la carga:',
          labelEn: '3. Maximum bending moment right under the point load:',
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
          eq: 'dV / dx = -q(x)     ;     dM / dx = V(x)     ;     EI · (d²w / dx²) = M(x)'
        },
        {
          labelEs: '2. EDO de 2º orden para la vibración vertical u(t) del soporte elástico:',
          labelEn: '2. 2nd-order ODE for vertical vibration u(t) of the elastic mount:',
          eq: 'M · (d²u / dt²) + c · (du / dt) + k · u(t) = 0'
        },
        {
          labelEs: '3. Polinomio característico (λ²·M + λ·c + k = 0) y solución sub-amortiguada:',
          labelEn: '3. Characteristic polynomial (λ²·M + λ·c + k = 0) & underdamped solution:',
          eq: 'u(t) = A · e^(-γt) · cos(ω_d·t - φ)   con   γ = c/(2M) , ω_d = √(k/M - γ²)'
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
        { id: 'a', text: 'R_A = 196.2 N  y  R_B = 588.6 N', correct: true },
        { id: 'b', text: 'R_A = 392.4 N  y  R_B = 392.4 N', correct: false },
        { id: 'c', text: 'R_A = 588.6 N  y  R_B = 196.2 N', correct: false },
        { id: 'd', text: 'R_A = 245.0 N  y  R_B = 539.8 N', correct: false }
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
          eq: 'F⃗_total = F⃗_E + F⃗_B = q·E⃗ + q·(v⃗ × B⃗)'
        },
        {
          labelEs: '2. Con E⃗ = -E·ĵ (hacia abajo), B⃗ = -B·k̂ (entrando) y v⃗ = v₀·î:',
          labelEn: '2. With E⃗ = -E·ĵ (downward), B⃗ = -B·k̂ (into page), and v⃗ = v₀·î:',
          eq: 'Fᵧ = q · ( -E + v₀ · B )'
        },
        {
          labelEs: '3. Condición de equilibrio dinámico (Trayectoria rectilínea Fᵧ = 0):',
          labelEn: '3. Dynamic equilibrium condition (Straight trajectory Fᵧ = 0):',
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
          eq: 'm · (dvₓ / dt) = -q·B·vᵧ     ;     m · (dvᵧ / dt) = q·(vₓ·B - E)'
        },
        {
          labelEs: '2. Potencia magnética nula (demostración por producto mixto):',
          labelEn: '2. Zero magnetic work (proof via scalar triple product):',
          eq: 'dK_B / dt = F⃗_B · (dr⃗/dt) = q·(v⃗ × B⃗) · v⃗ = 0   ⇒   B⃗ nunca cambia la rapidez |v⃗| si E⃗ = 0'
        },
        {
          labelEs: '3. Frecuencia angular de ciclotrón (ω_c) y Radio de Larmor (R_L):',
          labelEn: '3. Cyclotron angular frequency (ω_c) and Larmor Radius (R_L):',
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
        { id: 'a', text: 'v₀ = 30 m/s', correct: true },
        { id: 'b', text: 'v₀ = 120 m/s', correct: false },
        { id: 'c', text: 'v₀ = 15 m/s', correct: false },
        { id: 'd', text: 'Depende de si la carga q es positiva o negativa', correct: false }
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
          eq: '∑Fᵧ = F_gas - F_atm - M_p·g = 0   ⇒   P_gas · A = P₀ · A + M_p · g'
        },
        {
          labelEs: '2. Ecuación de Estado del Gas Ideal y Energía Interna (gas monoatómico):',
          labelEn: '2. Ideal Gas Equation of State & Internal Energy (monatomic):',
          eq: 'P · V = n · R · T     ;     U = (3/2) · n · R · T'
        },
        {
          labelEs: '3. Primera Ley de la Termodinámica (Conservación de Energía):',
          labelEn: '3. First Law of Thermodynamics (Energy Conservation):',
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
          eq: 'δW = F_gas · dy = (P · A) · dy = P · dV'
        },
        {
          labelEs: '2. Integración en Expansión Isotérmica (T = cte, P(V) = nRT / V):',
          labelEn: '2. Integration for Isothermal Expansion (T = const, P(V) = nRT / V):',
          eq: 'W_iso = ∫_{V₁}^{V₂} (nRT / V) dV = n·R·T · ln(V₂ / V₁)'
        },
        {
          labelEs: '3. Integración en Proceso Isobárico (P = cte) y Cambio de Entropía:',
          labelEn: '3. Integration for Isobaric Process (P = const) & Entropy Change:',
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
        { id: 'a', text: 'W = +2305 J   y   ΔU = 0 J', correct: true },
        { id: 'b', text: 'W = +3326 J   y   ΔU = +3326 J', correct: false },
        { id: 'c', text: 'W = -2305 J   y   ΔU = 0 J', correct: false },
        { id: 'd', text: 'W = +1663 J   y   ΔU = -1663 J', correct: false }
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
          eq: 'θ_reflexión = θ₁     ;     sin(θ₁) / v₁ = sin(θ₂) / v₂'
        },
        {
          labelEs: '2. Condición de Ángulo Crítico (θ₂ = 90°, Onda de Cabeza / Head Wave):',
          labelEn: '2. Critical Angle Condition (θ₂ = 90°, Seismic Head Wave):',
          eq: 'sin(θ_c) = v₁ / v₂   (Existe sólo si el estrato inferior es más rápido: v₂ > v₁)'
        },
        {
          labelEs: '3. Conservación de la componente horizontal del vector de onda (kₓ):',
          labelEn: '3. Conservation of horizontal wavevector component (kₓ):',
          eq: 'k₁ · sin(θ₁) = k₂ · sin(θ₂)   con   kᵢ = 2π·f / vᵢ = ω / vᵢ'
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
          eq: 'T(x) = √(x² + h₁²) / v₁  +  √((L - x)² + h₂²) / v₂'
        },
        {
          labelEs: '2. Optimización por Cálculo Diferencial (Tiempo estacionario dT/dx = 0):',
          labelEn: '2. Differential Calculus Optimization (Stationary time dT/dx = 0):',
          eq: 'dT / dx = [ x / (v₁·√(x² + h₁²)) ] - [ (L - x) / (v₂·√((L-x)² + h₂²)) ] = sin(θ₁)/v₁ - sin(θ₂)/v₂ = 0'
        },
        {
          labelEs: '3. Ecuación en Derivadas Parciales (EDP) de Onda Elástica / Acústica:',
          labelEn: '3. Partial Differential Equation (PDE) for Elastic / Acoustic Waves:',
          eq: '∂²u / ∂t² = v² · ( ∂²u / ∂x² + ∂²u / ∂z² )'
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
        { id: 'a', text: 'θ_c = 30.0°', correct: true },
        { id: 'b', text: 'θ_c = 45.0°', correct: false },
        { id: 'c', text: 'θ_c = 60.0°', correct: false },
        { id: 'd', text: 'No existe ángulo crítico cuando v₂ > v₁', correct: false }
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
  }
];

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

export default function PhysicsLab({
  lang = 'es',
  initialProblemId = 'newtonian',
  onOpenBooking,
  onNavigate,
  courses = []
}) {
  const [selectedId, setSelectedId] = useState(initialProblemId || 'newtonian');
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
          { label: 'a (Aceleración)', value: `${a.toFixed(2)} m/s²` },
          { label: 'T (Tensión cuerda)', value: `${T.toFixed(1)} N` },
          { label: 'N (Fuerza Normal)', value: `${N.toFixed(1)} N` },
          { label: '|f_r| (Roce activo)', value: `${Math.abs(fFriction).toFixed(1)} N` }
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
          { label: 'Alcance Ideal (γ=0)', value: `${idealRange.toFixed(1)} m` },
          { label: 'Altura Máx Ideal', value: `${idealPeak.toFixed(1)} m` },
          { label: 'Pendiente dy/dx (t)', value: `${dydx.toFixed(2)}` },
          { label: '|v(t)| Instantánea', value: `${Math.hypot(vx, vy).toFixed(1)} m/s` }
        ],
        status:
          drag > 0
            ? lang === 'en'
              ? 'With Atmospheric Drag (Non-parabolic ODE)'
              : 'Con Arrastre Atmosférico (EDO no parabólica)'
            : lang === 'en'
            ? 'Galilean Vacuum (Exact Parabola)'
            : 'Vacío de Galileo (Parábola Exacta)',
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
          { label: 'Reacción R_A (Izq)', value: `${RA.toFixed(1)} N` },
          { label: 'Reacción R_B (Der)', value: `${RB.toFixed(1)} N` },
          { label: 'Momento Máx M_max', value: `${Mmax.toFixed(0)} N·m` },
          { label: 'Frecuencia ω₀', value: `${omega0.toFixed(2)} rad/s` }
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
          { label: 'Velocidad Filtro (E/B)', value: `${vFilter.toFixed(1)} m/s` },
          { label: 'Fuerza Eléctrica F_E', value: `${FE.toFixed(1)} uN` },
          { label: 'Fuerza Magnética F_B', value: `${FB.toFixed(1)} uN` },
          { label: 'Fuerza Neta F_y', value: `${Fnet.toFixed(1)} uN` }
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
          { label: 'Trabajo W = ∫P dV', value: `${W.toFixed(0)} J` },
          { label: 'Cambio Energía ΔU', value: `${dU.toFixed(0)} J` },
          { label: 'Calor Transferido Q', value: `${Q.toFixed(0)} J` },
          { label: 'Presión Inicial P₁', value: `${(P1 / 100).toFixed(1)} bar` }
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

    // waves_geophysics
    const { theta1, v1, v2 } = safeParams;
    const rad1 = (theta1 * Math.PI) / 180;
    const sinTheta2 = (v2 / v1) * Math.sin(rad1);
    const isTIR = sinTheta2 >= 1.0;
    const theta2 = isTIR ? 90 : (Math.asin(sinTheta2) * 180) / Math.PI;
    const hasCrit = v2 > v1;
    const thetaCrit = hasCrit ? (Math.asin(v1 / v2) * 180) / Math.PI : null;

    return {
      items: [
        { label: 'Ángulo Incidente θ₁', value: `${Number(theta1).toFixed(1)}°` },
        { label: 'Ángulo Refractado θ₂', value: isTIR ? 'Reflexión Total' : `${Number(theta2).toFixed(1)}°` },
        { label: 'Ángulo Crítico θ_c', value: hasCrit && thetaCrit !== null ? `${Number(thetaCrit).toFixed(1)}°` : 'N/A (v₁≥v₂)' },
        { label: 'Relación v₂ / v₁', value: `${(v2 / v1).toFixed(2)}` }
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
      ctx.fillText('Diagrama Momento Flector M(x)', beamLeft, diagTop + 55);

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
      ctx.fillText('+ + + +  Placa Superior (+)  →  E⃗ apunta hacia abajo  + + + +', plateLeft + 25, topPlateY - 2);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(plateLeft, botPlateY, plateRight - plateLeft, 12);
      ctx.fillStyle = '#93C5FD';
      ctx.fillText('- - - -  Placa Inferior (-)   |   Campo B⃗ (⊗ entrando)  - - - -', plateLeft + 25, botPlateY + 10);

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
      ctx.fillText('P (Presión)', plotX + 8, plotY - plotH + 12);
      ctx.fillText('V (Volumen) →', plotX + plotW - 95, plotY + 18);

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
      ctx.fillText(`Estrato 1 (v₁ = ${v1} km/s)`, 18, 48);
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText(`Estrato 2 (v₂ = ${v2} km/s)`, 18, H - 18);

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
  }, [selectedId, safeParams, simTime, showDCL, telemetry.raw]);

  const linkedCourse = courses.find((c) => c.id === currentProblem.courseId) || courses[0];

  return (
    <div className="py-10">
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

        {/* 6-Course Problem Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {LAB_PROBLEMS.map((prob) => {
            const Icon = prob.icon;
            const active = prob.id === selectedId;
            return (
              <button
                key={prob.id}
                onClick={() => handleSelectProblem(prob.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-sky-500/40'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: active ? 'rgba(56, 189, 248, 0.2)' : '#F1F5F9',
                      color: active ? '#38BDF8' : prob.color
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  {active && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                      Activo
                    </span>
                  )}
                </div>
                <div>
                  <div className={`text-[10px] font-mono uppercase tracking-wider ${active ? 'text-sky-300' : 'text-slate-500'}`}>
                    {lang === 'en' ? prob.badgeEn.split('&')[0] : prob.badgeEs.split('&')[0]}
                  </div>
                  <div className="text-xs font-bold leading-snug mt-0.5 line-clamp-2">
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

            {/* Key Action Toggles: DCL Button + Play/Pause + Reset */}
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
                      ? 'DCL / FBD Vectors: ON'
                      : 'DCL / Vectores: ACTIVADO'
                    : lang === 'en'
                    ? 'Show DCL / FBD Vectors'
                    : 'Activar DCL (Diagrama Cuerpo Libre)'}
                </span>
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
                      {lang === 'en' ? currentProblem.algebraSection.titleEn : currentProblem.algebraSection.titleEs}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentProblem.algebraSection.formulas.map((f, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        {lang === 'en' ? f.labelEn : f.labelEs}
                      </span>
                      <pre className="font-mono text-xs sm:text-sm text-slate-900 font-bold whitespace-pre-wrap overflow-x-auto bg-white p-2.5 rounded-xl border border-slate-200">
                        {f.eq}
                      </pre>
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
                      {lang === 'en' ? currentProblem.calculusSection.titleEn : currentProblem.calculusSection.titleEs}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentProblem.calculusSection.formulas.map((f, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        {lang === 'en' ? f.labelEn : f.labelEs}
                      </span>
                      <pre className="font-mono text-xs sm:text-sm text-emerald-950 font-bold whitespace-pre-wrap overflow-x-auto bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/80">
                        {f.eq}
                      </pre>
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
                    ? 'Interactive Klausur / Exam Exercise'
                    : 'Ejercicio Clásico de Examen (Con Comprobación en el Lab)'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {lang === 'en' ? 'Test Your Intuition & Calculation' : 'Pon a Prueba tu Intuición y Cálculo'}
              </h3>
            </div>

            <button
              onClick={() => applyPreset(currentProblem.exercise.presetValues)}
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
              {lang === 'en' ? currentProblem.exercise.questionEn : currentProblem.exercise.questionEs}
            </p>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProblem.exercise.options.map((opt) => {
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
                      {opt.text}
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
                {lang === 'en' ? currentProblem.exercise.hintEn : currentProblem.exercise.hintEs}
              </div>
            )}

            {showSolution && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2.5 font-mono text-xs">
                <span className="text-emerald-400 uppercase tracking-wider font-bold block">
                  {lang === 'en'
                    ? 'Official Step-by-Step Klausur Derivation:'
                    : 'Resolución Oficial Paso a Paso (Estructura de Puntaje Completo):'}
                </span>
                {(lang === 'en' ? currentProblem.exercise.solutionStepsEn : currentProblem.exercise.solutionStepsEs).map(
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
                  : '¿Quieres dominar este tipo de problemas con tus propios exámenes (Altklausuren)?'}
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
      </div>
    </div>
  );
}
