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
import PhysicsToolkit from './PhysicsToolkit';

// ============================================================================
// CATALOG OF 14 CLASSICAL PHYSICS, ENGINEERING & GEOPHYSICS LAB PROBLEMS
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
  },
  {
    id: 'vector_calculus',
    courseId: 'klausur',
    badgeEs: 'Cálculo Vectorial & Höhere Mathematik',
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
          eq: 'F⃗(x, y) = P(x, y) î + Q(x, y) ĵ = (k·x - ω·y) î + (ω·x + k·y) ĵ'
        },
        {
          labelEs: '2. Matriz Jacobiana J_F del campo vectorial 2×2:',
          labelEn: '2. 2×2 Jacobian Matrix J_F of the vector field:',
          eq: 'J_F = [ ∂P/∂x   ∂P/∂y ] = [  k   -ω ]   =  k·I  +  ω·[  0  -1 ]\n      [ ∂Q/∂x   ∂Q/∂y ]   [  ω    k ]              [  1   0 ]'
        },
        {
          labelEs: '3. Rotacional (Vorticidad) y Divergencia locales:',
          labelEn: '3. Local Curl (Vorticity) and Divergence:',
          eq: 'rot(F⃗) = (∂Q/∂x - ∂P/∂y) k̂ = 2ω k̂    ;    div(F⃗) = ∂P/∂x + ∂Q/∂y = 2k'
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
          eq: '∮_C F⃗ · d r⃗ = ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA = ∬_D (2ω) dA = 2ω · Área(D)'
        },
        {
          labelEs: '2. Verificación por parametrización explícita r⃗(t) = (R cos t, R sin t):',
          labelEn: '2. Verification by explicit parametrization r⃗(t) = (R cos t, R sin t):',
          eq: '∮_C F⃗ · d r⃗ = ∫₀²ᵖⁱ [ -ω R sin(t) (-R sin t) + ω R cos(t) (R cos t) ] dt = ∫₀²ᵖⁱ ω R² dt = 2π R² ω'
        },
        {
          labelEs: '3. Criterio de independencia de la trayectoria (Campo Conservativo):',
          labelEn: '3. Path independence criterion (Conservative Field):',
          eq: 'rot(F⃗) = 0⃗   ⇔   F⃗ = ∇φ   ⇒   ∮_C F⃗ · d r⃗ = 0  (para cualquier curva cerrada simple C)'
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
        { id: 'a', text: '∮ F·dr = 24π ≈ 75.40 J', correct: true },
        { id: 'b', text: '∮ F·dr = 0 J (campo conservativo)', correct: false },
        { id: 'c', text: '∮ F·dr = 12π ≈ 37.70 J', correct: false },
        { id: 'd', text: '∮ F·dr = 6π ≈ 18.85 J', correct: false }
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
          eq: 'L = r² · (dθ/dt) = cte     ;     E = ½ m (dr/dt)² + V_eff(r) = cte'
        },
        {
          labelEs: '2. Potencial Efectivo de Schwarzschild (Término cúbico relativista):',
          labelEn: '2. Schwarzschild Effective Potential (Cubic relativistic term):',
          eq: 'V_eff(r) = - (G·M·m) / r  +  L² / (2m·r²)  -  (G·M·L²) / (c²·m·r³)'
        },
        {
          labelEs: '3. Ecuación de Binet modificada en variable u = 1/r:',
          labelEn: '3. Modified Binet equation in variable u = 1/r:',
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
          eq: 'ds² = - (1 - 2GM/c²r) c² dt² + (1 - 2GM/c²r)⁻¹ dr² + r² dθ²     ;     δ ∫ ds = 0'
        },
        {
          labelEs: '2. Desplazamiento angular del perihelio por órbita (Teorema de Perturbaciones):',
          labelEn: '2. Perihelion angular shift per orbit (Perturbation Theory):',
          eq: 'Δφ = ∮ (dθ/du) du - 2π ≈ (6π · G · M) / (c² · a · (1 - e²))'
        },
        {
          labelEs: '3. Límite Clásico Newtoniano (Velocidad de la luz c → ∞):',
          labelEn: '3. Classical Newtonian Limit (Speed of light c → ∞):',
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
        { id: 'a', text: 'Factor = 1.50 (Aumenta un 50%)', correct: true },
        { id: 'b', text: 'Factor = 1.00 (No depende de e)', correct: false },
        { id: 'c', text: 'Factor = 0.67 (Disminuye)', correct: false },
        { id: 'd', text: 'Factor = 3.00 (Se triplica)', correct: false }
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
          eq: '[ M ] d²x⃗/dt² + [ K ] x⃗ = 0⃗   con   K = [  k+k₁₂   -k₁₂  ]\n                                          [  -k₁₂    k+k₁₂ ]'
        },
        {
          labelEs: '2. Ecuación secular característica: det(K - ω²M) = 0:',
          labelEn: '2. Characteristic secular equation: det(K - ω²M) = 0:',
          eq: 'ω₁² = k / m     ;     ω₂² = (k + 2k₁₂) / m   (para masas idénticas m₁ = m₂ = m)'
        },
        {
          labelEs: '3. Autovectores modales ortogonales normalizados:',
          labelEn: '3. Normalized orthogonal modal eigenvectors:',
          eq: 'v⃗₁ = (1/√2) [ 1,  1 ]ᵀ  (Modo en Fase)  ;  v⃗₂ = (1/√2) [ 1, -1 ]ᵀ  (Modo en Antifase)'
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
          eq: 'm₁ d²x₁/dt² = -k x₁ + k₁₂(x₂ - x₁)     ;     m₂ d²x₂/dt² = -k x₂ - k₁₂(x₂ - x₁)'
        },
        {
          labelEs: '2. Cambio de base a coordenadas normales desacopladas q₁ y q₂:',
          labelEn: '2. Change of basis to decoupled normal coordinates q₁ & q₂:',
          eq: 'q₁ = (x₁ + x₂)/√2  ⇒  d²q₁/dt² + ω₁² q₁ = 0     ;     q₂ = (x₁ - x₂)/√2  ⇒  d²q₂/dt² + ω₂² q₂ = 0'
        },
        {
          labelEs: '3. Frecuencia de batimiento (Beats) y modulación periódica de energía:',
          labelEn: '3. Beat frequency and periodic energy envelope modulation:',
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
        { id: 'a', text: 'ω₁ = 3.00 rad/s  y  ω₂ = 4.36 rad/s', correct: true },
        { id: 'b', text: 'ω₁ = 3.00 rad/s  y  ω₂ = 3.00 rad/s', correct: false },
        { id: 'c', text: 'ω₁ = 2.50 rad/s  y  ω₂ = 5.00 rad/s', correct: false },
        { id: 'd', text: 'ω₁ = 4.36 rad/s  y  ω₂ = 3.00 rad/s', correct: false }
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
          eq: 'f = 2 · Ω_Tierra · sin(φ)   con   Ω_Tierra = 7.292 × 10⁻⁵ rad/s'
        },
        {
          labelEs: '2. Sistema lineal 2×2 del equilibrio horizontal (Fuerza P + Coriolis = 0):',
          labelEn: '2. 2×2 horizontal balance system (Pressure Gradient + Coriolis = 0):',
          eq: '[  0   -f ] [ u_g ] = - (1/ρ) [ ∂P/∂x ]\n[  f    0 ] [ v_g ]          [ ∂P/∂y ]'
        },
        {
          labelEs: '3. Solución explícita del vector viento geostrófico (v⃗_g ⟂ ∇P):',
          labelEn: '3. Explicit solution of geostrophic wind vector (v⃗_g ⟂ ∇P):',
          eq: 'u_g = - (1 / (ρ · f)) · (∂P / ∂y)     ;     v_g = (1 / (ρ · f)) · (∂P / ∂x)'
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
          eq: 'D v⃗ / Dt = ∂v⃗/∂t + (v⃗·∇)v⃗ = - (1/ρ) ∇P - 2 (Ω⃗ × v⃗) + g⃗ + ν ∇²v⃗'
        },
        {
          labelEs: '2. Escalamiento sinóptico y Número de Rossby (Ro ≪ 1):',
          labelEn: '2. Synoptic scaling and Rossby Number (Ro ≪ 1):',
          eq: 'Ro = U / (f · L) ≈ 0.1 ≪ 1   ⇒   La aceleración inercial D v⃗ / Dt ≈ 0 es despreciable'
        },
        {
          labelEs: '3. Ley de Buys Ballot (Geofísica Meteorológica):',
          labelEn: '3. Buys Ballot’s Law (Meteorological Geophysics):',
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
        { id: 'a', text: 'v_g ≈ 129.3 m/s (≈ 465 km/h, Corriente en Chorro / Jet Stream)', correct: true },
        { id: 'b', text: 'v_g ≈ 12.9 m/s (Brisa moderada)', correct: false },
        { id: 'c', text: 'v_g ≈ 0.0 m/s (El viento se detiene por Coriolis)', correct: false },
        { id: 'd', text: 'v_g ≈ 550.0 m/s (Supersónico)', correct: false }
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
    theory: {
      formula: 'M_{ij} = M_0 (u_i n_j + u_j n_i) \\quad , \\quad \\frac{v_P}{v_S} = \\sqrt{\\frac{\\lambda + 2\\mu}{\\mu}} \\approx \\sqrt{3}',
      descriptionEs:
        'Un terremoto es una dislocación por cizalle en una falla geológica caracterizada por tres ángulos: Rumbo (Strike φ, dirección respecto al Norte), Buzamiento (Dip δ, inclinación respecto a la horizontal) y Deslizamiento (Rake λ, dirección del movimiento relativo del bloque techo). La pelota de playa (beachball) es la proyección estereográfica del hemisferio inferior de la esfera focal: los cuadrantes oscuros representan compresión (primer arribo de onda P hacia arriba) y los blancos dilatación (primer arribo hacia abajo).',
      descriptionEn:
        'An earthquake is a shear dislocation on a fault plane defined by three angles: Strike (φ, orientation from North), Dip (δ, angle from horizontal), and Rake (λ, slip direction of hanging wall). The beachball represents the lower-hemisphere stereographic projection: shaded quadrants are compressional (P-wave upward first motion) and white quadrants are dilatational (downward first motion).'
    },
    klausurProblem: {
      titleEs: 'Problema Klausur: Momento Sísmico y Clasificación Tectónica de Falla',
      titleEn: 'Klausur Exam Problem: Seismic Moment & Fault Tectonic Classification',
      statementEs:
        'En la zona de subducción de Chile central ocurre un megaterremoto de magnitud Mw = 8.8 sobre un plano de falla con rumbo φ = 15°, buzamiento δ = 18° y ángulo de deslizamiento λ = 90°. (a) Calcule el momento sísmico escalar M₀ en N·m usando la escala de Kanamori (log₁₀ M₀ = 1.5 Mw + 9.1). (b) Clasifique el régimen cinemático de la falla y determine las orientaciones relativas de los ejes de presión (P) y tensión (T). (c) Si la rigidez cortical es μ = 3.5×10¹⁰ Pa y el área de ruptura es A = 400 km × 150 km, calcule el desplazamiento medio de deslizamiento D en metros.',
      statementEn:
        'In the central Chile subduction zone, a megathrust earthquake of magnitude Mw = 8.8 occurs on a fault plane with strike φ = 15°, dip δ = 18°, and rake λ = 90°. (a) Compute scalar seismic moment M₀ in N·m via Kanamori formula (log₁₀ M₀ = 1.5 Mw + 9.1). (b) Classify the kinematic fault regime and identify orientations of pressure (P) and tension (T) axes. (c) Given crustal shear modulus μ = 3.5×10¹⁰ Pa and rupture area A = 400 km × 150 km, compute mean fault slip D in meters.',
      hintEs: 'Aplica log₁₀ M₀ = 1.5 · 8.8 + 9.1 = 22.3, luego M₀ = 10²²·³. Para el deslizamiento, despeja D = M₀ / (μ · A).',
      hintEn: 'Compute log₁₀ M₀ = 1.5 · 8.8 + 9.1 = 22.3, so M₀ = 10²²·³. For slip, isolate D = M₀ / (μ · A).',
      solutionStepsEs: [
        '1. Momento sísmico: log₁₀ M₀ = 1.5 · 8.8 + 9.1 = 13.2 + 9.1 = 22.30 ⇒ M₀ = 10²²·³⁰ ≈ 1.995 × 10²² N·m.',
        '2. Clasificación: Rake λ = 90° corresponde a una falla inversa pura (thrust faulting). El eje P (compresión máxima) es horizontal subhorizontal en dirección E-W (perpendicular a la fosa), mientras que el eje T es casi vertical.',
        '3. Área: A = 400×10³ m × 150×10³ m = 6.0 × 10¹⁰ m².',
        '4. Deslizamiento medio: D = M₀ / (μ · A) = (1.995 × 10²² N·m) / (3.5 × 10¹⁰ Pa × 6.0 × 10¹⁰ m²) ≈ 9.50 metros de desplazamiento cosísmico.'
      ],
      solutionStepsEn: [
        '1. Seismic moment: log₁₀ M₀ = 1.5 · 8.8 + 9.1 = 22.30 ⇒ M₀ = 10²²·³⁰ ≈ 1.995 × 10²² N·m.',
        '2. Classification: Rake λ = 90° corresponds to pure reverse/thrust faulting. The P-axis (maximum compression) is subhorizontal E-W perpendicular to trench, while T-axis is nearly vertical.',
        '3. Area: A = 400×10³ m × 150×10³ m = 6.0 × 10¹⁰ m².',
        '4. Mean fault slip: D = M₀ / (μ · A) = (1.995 × 10²² N·m) / (3.5 × 10¹⁰ Pa × 6.0 × 10¹⁰ m²) ≈ 9.50 meters of coseismic displacement.'
      ]
    },
    exercise: {
      questionEs:
        'En un megaterremoto de subducción en Chile con Mw = 8.8 (M₀ ≈ 1.995 × 10²² N·m) y área de ruptura A = 400 km × 150 km en corteza con rigidez μ = 3.5×10¹⁰ Pa, ¿cuál es el desplazamiento medio de deslizamiento cosísmico D en la falla?',
      questionEn:
        'In a Chilean subduction megathrust earthquake with Mw = 8.8 (M₀ ≈ 1.995 × 10²² N·m) and rupture area A = 400 km × 150 km in crust with μ = 3.5×10¹⁰ Pa, what is the mean coseismic fault slip D?',
      presetValues: { strike: 15, dip: 18, rake: 90, magnitude: 8.8 },
      options: [
        { id: 'a', text: 'D ≈ 9.5 m (Deslizamiento cosísmico masivo característico de Mw 8.8)', correct: true },
        { id: 'b', text: 'D ≈ 0.95 m (Deslizamiento menor)', correct: false },
        { id: 'c', text: 'D ≈ 95.0 m (Físicamente inconsistente)', correct: false },
        { id: 'd', text: 'D ≈ 0.10 m (Régimen de microsismicidad)', correct: false }
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
    theory: {
      formula: '\\nabla^2 U = 4\\pi G \\rho \\quad , \\quad b = h\\frac{\\rho_c}{\\rho_m - \\rho_c} \\quad , \\quad \\Delta g_B = g_{\\text{obs}} - g_0 + 0.3086 h - 2\\pi G \\rho_c h',
      descriptionEs:
        'En gravimetría, la ley de gravitación de Newton se expresa mediante la Ecuación de Poisson para el potencial gravitacional U. La anomalía de Bouguer elimina la atracción de la placa topográfica sobre el nivel del mar (+2πGρ_c h). En cordilleras jóvenes en equilibrio isostático de Airy, el exceso de masa superficial está compensado por una raíz cortical de baja densidad (ρ_c ≈ 2670 kg/m³) que penetra en el manto denso (ρ_m ≈ 3300 kg/m³). Como el sensor en superficie está más cerca de la corteza que de la raíz, pero la corrección de Bouguer resta la montaña, la anomalía de Bouguer resultante es fuertemente negativa.',
      descriptionEn:
        'In gravimetry, Newton gravitational law becomes Poissons PDE ∇²U = 4πGρ. The Bouguer correction removes the gravitational pull of the elevated terrain slab (+2πGρ_c h). In mountain belts under Airy isostatic equilibrium, topographic load is compensated by a low-density crustal root displacing dense mantle. Subtracting the topographic slab reveals the negative gravitational deficit of the deep root.'
    },
    klausurProblem: {
      titleEs: 'Problema Klausur: Raíz Isostática y Anomalía de Bouguer en los Andes',
      titleEn: 'Klausur Exam Problem: Isostatic Root & Bouguer Anomaly in the Andes',
      statementEs:
        'En un perfil transversal de los Andes Centrales a 22°S, la altitud media del Altiplano es h = 4000 m. Suponiendo equilibrio isostático de Airy con densidad de corteza ρ_c = 2670 kg/m³ y densidad de manto ρ_m = 3300 kg/m³: (a) Deduzca el espesor de la raíz cortical b que penetra en el manto. (b) Calcule el espesor total de corteza bajo el Altiplano si la corteza de referencia en la costa es H₀ = 35 km. (c) Calcule la corrección de placa de Bouguer Δg_BP producida por la topografía superficial.',
      statementEn:
        'Across an Andean transect at 22°S, average Altiplano elevation is h = 4000 m. Under Airy isostasy with crustal density ρ_c = 2670 kg/m³ and mantle density ρ_m = 3300 kg/m³: (a) Derive depth b of the crustal root penetrating the mantle. (b) Calculate total crustal thickness beneath the Altiplano given reference normal crust H₀ = 35 km. (c) Calculate the Bouguer plate correction Δg_BP produced by the surface topography.',
      hintEs: 'Iguala la presión litostática a la profundidad de compensación: ρ_c · (h + H₀ + b) = ρ_c · H₀ + ρ_m · b. Luego despeja b = h · ρ_c / (ρ_m - ρ_c).',
      hintEn: 'Equate lithostatic pressure at the compensation level: ρ_c · (h + H₀ + b) = ρ_c · H₀ + ρ_m · b. Then b = h · ρ_c / (ρ_m - ρ_c).',
      solutionStepsEs: [
        '1. Balance isostático de Airy: b = h · ρ_c / (ρ_m - ρ_c).',
        '2. Sustitución de densidades: Contraste Δρ = 3300 - 2670 = 630 kg/m³.',
        '3. Espesor de la raíz: b = 4000 m · (2670 / 630) ≈ 16,952 metros (≈ 17.0 km de raíz cortical en el manto).',
        '4. Espesor total de corteza: H_total = H₀ + h + b = 35 km + 4.0 km + 17.0 km ≈ 56.0 km de corteza engrosada.',
        '5. Corrección de Bouguer: Δg_BP = 2π G ρ_c h = 0.04193 · 10⁻³ · 2670 · 4000 ≈ 447.8 mGal de masa topográfica eliminada.'
      ],
      solutionStepsEn: [
        '1. Airy isostatic balance: b = h · ρ_c / (ρ_m - ρ_c).',
        '2. Density contrast: Δρ = 3300 - 2670 = 630 kg/m³.',
        '3. Root thickness: b = 4000 m · (2670 / 630) ≈ 16,952 meters (≈ 17.0 km crustal root in mantle).',
        '4. Total crustal thickness: H_total = H₀ + h + b = 35 km + 4.0 km + 17.0 km ≈ 56.0 km thickened crust.',
        '5. Bouguer slab correction: Δg_BP = 2π G ρ_c h = 0.04193 · 10⁻³ · 2670 · 4000 ≈ 447.8 mGal of topographic mass subtracted.'
      ]
    },
    exercise: {
      questionEs:
        'En los Andes Centrales a una altitud de h = 4000 m (ρ_c = 2670 kg/m³, manto ρ_m = 3300 kg/m³), ¿cuál es el espesor b de la raíz cortical que penetra en el manto según la compensación isostática de Airy?',
      questionEn:
        'In the Central Andes at elevation h = 4000 m (crustal density ρ_c = 2670 kg/m³, mantle ρ_m = 3300 kg/m³), what is the thickness b of the crustal root penetrating the mantle under Airy isostasy?',
      presetValues: { mountainHeight: 4000, crustDensity: 2670, mantleDensity: 3300, crustThickness: 35 },
      options: [
        { id: 'a', text: 'b ≈ 17.0 km (Profunda raíz de baja densidad que genera anomalía de Bouguer negativa)', correct: true },
        { id: 'b', text: 'b ≈ 4.0 km (Igual a la altura superficial)', correct: false },
        { id: 'c', text: 'b ≈ 35.0 km (Corteza basal duplicada sin compensación)', correct: false },
        { id: 'd', text: 'b ≈ 0.5 km (Topografía no compensada)', correct: false }
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
    theory: {
      formula: 'A_z \\frac{\\partial^2 V}{\\partial z^2} - i f V = 0 \\quad \\implies \\quad V(z) = V_0 e^{-(1+i)z/D_E} \\quad , \\quad \\vec{M}_E = \\frac{\\vec{\\tau}_0 \\times \\hat{k}}{\\rho f}',
      descriptionEs:
        'Vagn Walfrid Ekman resolvió en 1905 la interacción entre el viento y el océano. En la columna de agua, la fricción turbulenta transmite momento hacia abajo, mientras que la rotación terrestre introduce la aceleración de Coriolis. El sistema de EDOs acopladas se unifica elegantemente en variable compleja con la velocidad compleja V(z) = u(z) + i v(z). En superficie, la corriente se desvía 45° de la dirección del viento (a la izquierda en Chile / Hemisferio Sur). Al integrar en toda la columna, el Transporte Neto de Ekman es exactamente ortogonal (90°) al viento. Cuando vientos soplan hacia el norte a lo largo de la costa de Chile, el agua superficial es empujada mar adentro (hacia el oeste), obligando a aguas abisales frías y ricas en fosfatos y nitratos a emerger (surgencia costera).',
      descriptionEn:
        'Ekman solved the wind-ocean interface in 1905. Turbulent friction transfers wind stress downward while Earth rotation imparts Coriolis acceleration. The coupled system unifies in complex variables V(z) = u + iv. Surface currents deflect 45° (to the left in the Southern Hemisphere / Chile). Integrating vertically yields a net Ekman Transport exactly 90° to the wind. Northerly winds along Chiles coast transport surface water westward offshore, forcing cold, nutrient-rich deep waters to upwell.'
    },
    klausurProblem: {
      titleEs: 'Problema Klausur: Profundidad de Ekman y Transporte de Surgencia en Valparaíso',
      titleEn: 'Klausur Exam Problem: Ekman Depth & Coastal Upwelling Transport in Valparaíso',
      statementEs:
        'Frente a las costas de Valparaíso (latitud φ = -33°S), un viento del sur sopla paralelo a la costa con velocidad W = 12 m/s. La viscosidad turbulenta vertical del agua es A_z = 0.05 m²/s y la densidad del agua de mar es ρ = 1025 kg/m³. El coeficiente de arrastre del viento es C_D = 1.3×10⁻³ con densidad del aire ρ_a = 1.22 kg/m³. (a) Calcule el parámetro de Coriolis f y la profundidad de la capa de Ekman D_E. (b) Calcule la tensión superficial del viento τ₀ en Pa. (c) Calcule la magnitud del Transporte neto de Ekman M_E por unidad de ancho de costa y determine su dirección geográfica.',
      statementEn:
        'Off the coast of Valparaíso (latitude φ = -33°S), a southerly wind blows parallel to the coast at W = 12 m/s. Vertical eddy viscosity is A_z = 0.05 m²/s, seawater density is ρ = 1025 kg/m³, drag coefficient C_D = 1.3×10⁻³, and air density ρ_a = 1.22 kg/m³. (a) Calculate Coriolis parameter f and Ekman depth D_E. (b) Compute surface wind stress τ₀ in Pa. (c) Compute the magnitude of net Ekman transport M_E per unit coastline width and identify its geographic direction.',
      hintEs: 'Usa f = 2 · Ω · sin(φ) con Ω = 7.292×10⁻⁵ rad/s. D_E = π · √(2 A_z / |f|). M_E = τ₀ / (ρ · |f|).',
      hintEn: 'Use f = 2 · Ω · sin(φ) with Ω = 7.292×10⁻⁵ rad/s. D_E = π · √(2 A_z / |f|). M_E = τ₀ / (ρ · |f|).',
      solutionStepsEs: [
        '1. Parámetro de Coriolis: f = 2 · 7.292×10⁻⁵ · sin(-33°) ≈ -7.943 × 10⁻⁵ s⁻¹ (|f| = 7.943×10⁻⁵ s⁻¹).',
        '2. Profundidad de Ekman: D_E = π · √(2 · 0.05 / 7.943×10⁻⁵) = π · √(1258.9) ≈ π · 35.48 ≈ 111.5 metros.',
        '3. Tensión del viento: τ₀ = ρ_a · C_D · W² = 1.22 · 1.3×10⁻³ · 12² = 1.22 · 0.0013 · 144 ≈ 0.228 Pa (N/m²).',
        '4. Transporte de Ekman: M_E = τ₀ / (ρ · |f|) = 0.228 / (1025 · 7.943×10⁻⁵) = 0.228 / 0.0814 ≈ 2.80 m² / s (toneladas de agua por segundo por cada metro de costa).',
        '5. Dirección: En el Hemisferio Sur, el transporte neto es a 90° a la IZQUIERDA del viento. Si el viento va hacia el Norte, el agua se desplaza hacia el OESTE (mar adentro), activando la surgencia costera.'
      ],
      solutionStepsEn: [
        '1. Coriolis parameter: f = 2 · 7.292×10⁻⁵ · sin(-33°) ≈ -7.943 × 10⁻⁵ s⁻¹ (|f| = 7.943×10⁻⁵ s⁻¹).',
        '2. Ekman depth: D_E = π · √(2 · 0.05 / 7.943×10⁻⁵) = π · √(1258.9) ≈ 111.5 meters.',
        '3. Wind stress: τ₀ = ρ_a · C_D · W² = 1.22 · 1.3×10⁻³ · 12² ≈ 0.228 Pa (N/m²).',
        '4. Ekman transport: M_E = τ₀ / (ρ · |f|) = 0.228 / (1025 · 7.943×10⁻⁵) ≈ 2.80 m²/s per meter of coastline.',
        '5. Direction: In the Southern Hemisphere, transport is 90° to the LEFT of wind. With a northward wind, transport is directed WESTWARD (offshore), triggering coastal upwelling.'
      ]
    },
    exercise: {
      questionEs:
        'En las costas de Valparaíso (φ = -33°S, f = -7.94×10⁻⁵ s⁻¹), un viento del sur produce una tensión superficial τ₀ = 0.228 Pa en agua marina (ρ = 1025 kg/m³). ¿Cuál es la magnitud del Transporte neto de Ekman M_E y hacia qué dirección se desplaza la masa de agua superficial?',
      questionEn:
        'Off the coast of Valparaíso (φ = -33°S, f = -7.94×10⁻⁵ s⁻¹), a southerly wind produces surface stress τ₀ = 0.228 Pa in seawater (ρ = 1025 kg/m³). What is the net Ekman transport M_E magnitude, and in what direction does the surface water mass move?',
      presetValues: { windSpeed: 12, latitude: -33, eddyViscosity: 0.05 },
      options: [
        { id: 'a', text: 'M_E ≈ 2.80 m²/s hacia el Oeste (mar adentro a 90° a la izquierda), induciendo surgencia costera', correct: true },
        { id: 'b', text: 'M_E ≈ 2.80 m²/s hacia el Este (hacia la costa), provocando hundimiento', correct: false },
        { id: 'c', text: 'M_E ≈ 0.23 m²/s hacia el Norte (paralelo exacto al viento)', correct: false },
        { id: 'd', text: 'M_E ≈ 28.5 m²/s hacia el Sur (en contra del viento)', correct: false }
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
    theory: {
      formula: '\\nabla^2 \\vec{E} = \\mu_0 \\sigma \\frac{\\partial \\vec{E}}{\\partial t} \\quad \\implies \\quad \\delta \\approx 503 \\sqrt{\\frac{\\rho}{f}} \\quad , \\quad \\rho_a(\\omega) = \\frac{1}{\\omega \\mu_0} \\left| \\frac{E_x}{H_y} \\right|^2',
      descriptionEs:
        'En medios conductores como la Tierra, las ecuaciones de Maxwell para bajas frecuencias desprecian la corriente de desplazamiento (∂D/∂t ≈ 0), convirtiéndose en la Ecuación de Difusión electromagnética. Las ondas EM planas incidentes verticalmente se atenúan exponencialmente con la profundidad z como exp(-z / δ), donde δ es el Skin Depth (profundidad donde la amplitud cae a 1/e ≈ 37%). A menor frecuencia f, mayor es la profundidad sondeada. La impedancia de superficie Z = Ex / Hy permite calcular la resistividad aparente ρ_a(T) y la fase φ(T), permitiendo reconstruir la estratigrafía y acuíferos del subsuelo sin perforar.',
      descriptionEn:
        'In conducting media like the Earth, Maxwell equations at low frequencies neglect displacement currents (∂D/∂t ≈ 0), reducing to an EM diffusion equation. Plane EM waves decay exponentially as exp(-z / δ), where skin depth δ ≈ 503 √(ρ/f). Lower frequencies penetrate deeper into the Earth. Measuring surface impedance Z = Ex / Hy yields apparent resistivity ρ_a(T) and phase φ(T), imaging deep subsurface geology and geothermal reservoirs non-invasively.'
    },
    klausurProblem: {
      titleEs: 'Problema Klausur: Skin Depth e Impedancia Magnetotelúrica en Campo Geotérmico',
      titleEn: 'Klausur Exam Problem: Skin Depth & MT Surface Impedance in Geothermal Field',
      statementEs:
        'En una campaña magnetotelúrica en el campo geotérmico de El Tatio (Antofagasta, Chile), se mide una onda EM de frecuencia f = 4 Hz sobre una capa arcillosa hidrotermal de resistividad ρ₁ = 16 Ω·m. (a) Calcule la profundidad de penetración (Skin Depth) δ en metros. (b) Calcule el módulo de la impedancia de onda superficial |Z| = |Ex / Hy| en Ohms si μ₀ = 4π×10⁻⁷ H/m. (c) Si se desea investigar la cámara magmática situada a z = 8000 m en una roca de resistividad media ρ = 100 Ω·m, ¿cuál es la frecuencia máxima f_max que puede emplearse?',
      statementEn:
        'In a magnetotelluric survey at El Tatio geothermal field (Antofagasta, Chile), an EM wave with frequency f = 4 Hz is recorded over a hydrothermal clay cap of resistivity ρ₁ = 16 Ω·m. (a) Calculate skin depth δ in meters. (b) Compute surface wave impedance |Z| = |Ex / Hy| in Ohms with μ₀ = 4π×10⁻⁷ H/m. (c) To image a magma chamber at depth z = 8000 m through host rock of average resistivity ρ = 100 Ω·m, what maximum frequency f_max must be used?',
      hintEs: 'Aplica δ ≈ 503 · √(ρ / f). Para la impedancia, |Z| = √(ω · μ₀ · ρ) con ω = 2π f. Para la frecuencia, iguala δ = z y despeja f.',
      hintEn: 'Apply δ ≈ 503 · √(ρ / f). For impedance, |Z| = √(ω · μ₀ · ρ) with ω = 2π f. For frequency, set δ = z and solve for f.',
      solutionStepsEs: [
        '1. Skin depth en capa geotérmica: δ₁ = 503 · √(16 / 4) = 503 · √4 = 503 · 2 = 1006 metros.',
        '2. Frecuencia angular: ω = 2π · 4 = 8π ≈ 25.13 rad/s.',
        '3. Módulo de impedancia Cagniard: |Z| = √(ω · μ₀ · ρ₁) = √(25.13 · 4π×10⁻⁷ · 16) = √(5.053×10⁻⁴) ≈ 0.0225 Ω (V/A).',
        '4. Frecuencia para investigar z = 8000 m: Despejamos f de δ = 503 · √(ρ / f) ⇒ √f = 503 · √ρ / z ⇒ f = (503 · √100 / 8000)² = (5030 / 8000)² = (0.62875)² ≈ 0.395 Hz (período T ≈ 2.53 segundos).'
      ],
      solutionStepsEn: [
        '1. Geothermal skin depth: δ₁ = 503 · √(16 / 4) = 503 · 2 = 1006 meters.',
        '2. Angular frequency: ω = 2π · 4 ≈ 25.13 rad/s.',
        '3. Cagniard surface impedance: |Z| = √(ω · μ₀ · ρ₁) = √(25.13 · 4π×10⁻⁷ · 16) ≈ 0.0225 Ω.',
        '4. Maximum frequency for z = 8000 m: δ = 503 · √(ρ / f) ⇒ √f = 503 · √100 / 8000 ⇒ f = (5030 / 8000)² ≈ 0.395 Hz (period T ≈ 2.53 seconds).'
      ]
    },
    exercise: {
      questionEs:
        'En un sondeo magnetotelúrico sobre una capa arcillosa geotérmica de resistividad ρ₁ = 16 Ω·m, se registra una señal natural de frecuencia f = 4 Hz. ¿Cuál es la profundidad de penetración (Skin Depth) δ en el subsuelo?',
      questionEn:
        'In a magnetotelluric survey over a geothermal clay cap of resistivity ρ₁ = 16 Ω·m, an EM natural signal of frequency f = 4 Hz is measured. What is the subsurface skin depth δ?',
      presetValues: { frequency: 4, resTop: 16, resBottom: 600, layerThickness: 250 },
      options: [
        { id: 'a', text: 'δ ≈ 1006 m (Aproximadamente 1.0 km de penetración de la onda EM)', correct: true },
        { id: 'b', text: 'δ ≈ 200 m (Atenuación excesiva inmediata)', correct: false },
        { id: 'c', text: 'δ ≈ 5030 m (Sobreestimación por omisión de frecuencia)', correct: false },
        { id: 'd', text: 'δ ≈ 64 m (Escala errónea)', correct: false }
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
  const [showStudySheet, setShowStudySheet] = useState(false);
  const [viewMode, setViewMode] = useState('benchmarks'); // 'benchmarks' | 'toolkit'

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const handleSelectProblem = (probId) => {
    setViewMode('benchmarks');
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

    if (selectedId === 'vector_calculus') {
      const { omega = 1.5, kDiv = 0.0, radius = 2.2 } = safeParams;
      const curlVal = 2 * omega;
      const divVal = 2 * kDiv;
      const area = Math.PI * radius * radius;
      const circulation = curlVal * area;
      const isConservative = Math.abs(curlVal) < 0.01;
      return {
        items: [
          { label: '∇×F⃗ (Rotacional)', value: `${curlVal.toFixed(2)} k̂` },
          { label: '∇·F⃗ (Divergencia)', value: `${divVal.toFixed(2)}` },
          { label: '∮ F⃗·dr⃗ (Circulación)', value: `${circulation.toFixed(2)} J` },
          { label: 'Área del Bucle (πR²)', value: `${area.toFixed(2)} m²` }
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
          { label: 'ω₁ (Modo en Fase)', value: `${w1.toFixed(2)} rad/s` },
          { label: 'ω₂ (Modo en Antifase)', value: `${w2.toFixed(2)} rad/s` },
          { label: 'f₁ (Frecuencia 1)', value: `${f1.toFixed(2)} Hz` },
          { label: 'f₂ (Frecuencia 2)', value: `${f2.toFixed(2)} Hz` }
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
          { label: 'v_g (Viento Geostrófico)', value: `${vg.toFixed(1)} m/s` },
          { label: 'v_g en km/h', value: `${vgKmh.toFixed(1)} km/h` },
          { label: 'Parámetro f (Coriolis)', value: `${(Math.abs(fCoriolis) * 1e4).toFixed(2)}×10⁻⁴ s⁻¹` },
          { label: 'Gradiente ∇P', value: `${(gradP * 1000).toFixed(2)} mPa/m` }
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
          { label: 'Δφ (Precesión / órbita)', value: isNewtonian ? '0.00° (Newton)' : `${deltaPhiDeg.toFixed(2)}°` },
          { label: 'Perihelio (r_mín)', value: `${rMin.toFixed(2)} UA` },
          { label: 'Afelio (r_máx)', value: `${rMax.toFixed(2)} UA` },
          { label: 'Excentricidad (e)', value: `${eccentricity.toFixed(2)}` }
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
          { label: 'Magnitud Mw', value: `${magnitude.toFixed(1)}` },
          { label: 'Momento M₀', value: `${m0Sci.toFixed(2)}×10^${m0Exp} N·m` },
          { label: 'Razón v_P / v_S', value: `√3 ≈ 1.73 (${vP} / ${vS} km/s)` },
          { label: 'Régimen Falla', value: lang === 'en' ? regimeEn : regimeEs }
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
          { label: 'Raíz Cortical (b)', value: `${rootKm.toFixed(1)} km en Manto` },
          { label: 'Espesor Total Corteza', value: `${totalCrustKm.toFixed(1)} km (Moho)` },
          { label: 'Anomalía de Bouguer', value: `${bouguerAnomalyMgal.toFixed(0)} mGal` },
          { label: 'Corrección Bouguer', value: `-${bouguerSlabMgal.toFixed(0)} mGal` }
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
          { label: 'Profundidad de Ekman (D_E)', value: `${ekmanDepth.toFixed(1)} m` },
          { label: 'Velocidad Superficie (V₀)', value: `${v0.toFixed(2)} m/s` },
          { label: 'Transporte Neto Ekman', value: `${ekmanTransport.toFixed(2)} m²/s` },
          { label: 'Tensión Viento (τ₀)', value: `${tau0.toFixed(3)} Pa` }
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
          { label: 'Skin Depth Capa 1 (δ₁)', value: `${skinDepth1.toFixed(0)} m` },
          { label: 'Resistividad Aparente (ρ_a)', value: `${appRes.toFixed(1)} Ω·m` },
          { label: 'Período de Onda (T)', value: `${period >= 1 ? period.toFixed(2) + ' s' : (period * 1000).toFixed(0) + ' ms'}` },
          { label: 'Penetración Relativa', value: `${skinDepth1 > layerThickness ? 'Penetra al basamento' : 'Confinada en Capa 1'}` }
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
      ctx.fillText(`Curva C (R=${radius}m)`, midX + rPix * 0.72, midY - rPix * 0.72 - 6);
      ctx.fillStyle = '#C7D2FE';
      ctx.fillText(`Área D: ∬(∇×F) dA = ${circulation.toFixed(1)} J`, midX - 95, midY + 4);
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

        drawArrow(ctx, px, py, px + txScreen * 45, py + tyScreen * 45, '#F59E0B', 'd r⃗ (tangente)', 2.5);

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
          ctx.fillText('Paleta: ∇×F⃗ rota', midX - 45, midY + 28);
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
        ctx.fillText(`r_mín = ${rMin.toFixed(2)} UA`, midX + rMin * scale * 0.45, midY - 6);
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
      ctx.fillText('L (Baja Presión - Ciclón)', W / 2 - 80, isobarSpacing - 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('H (Alta Presión - Anticiclón)', W / 2 - 85, H - 15);

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
      ctx.fillText('Parcela Aire', parcelX - 35, parcelY - 18);

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
        ctx.fillText('Equilibrio Geostrófico:', parcelX + 52, parcelY - 16);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('F⃗_P + F⃗_Cor = 0⃗', parcelX + 52, parcelY);
        ctx.fillText(hemisphere >= 0 ? 'Desviación Der. (NH)' : 'Desviación Izq. (SH)', parcelX + 52, parcelY + 16);
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
      ctx.fillText('Proyección Estereográfica', bbCenterX - 65, H - 25);
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
      ctx.fillText(`Onda P (v_P=6.0 km/s)`, faultX + pRadius * 0.7 + 4, faultY - pRadius * 0.7);
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(`Onda S (v_S=3.5 km/s)`, faultX + sRadius * 0.7 + 4, faultY + sRadius * 0.7);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('Bloque Techo', faultX - 75, faultY - 55);
      ctx.fillText('Bloque Piso', faultX + 25, faultY + 65);

      if (showDCL) {
        const slipSign = rake >= 0 ? -1 : 1;
        const slipDx = slipSign * 35 * Math.cos(dipRad);
        const slipDy = slipSign * 35 * Math.sin(dipRad);
        drawArrow(ctx, faultX - 30, faultY - 30, faultX - 30 + slipDx, faultY - 30 + slipDy, '#34D399', 'u⃗ (Slip)', 2.5);

        const nDx = -35 * Math.sin(dipRad);
        const nDy = 35 * Math.cos(dipRad);
        drawArrow(ctx, faultX, faultY, faultX + nDx, faultY + nDy, '#C084FC', 'n̂ (Normal)', 2.5);

        drawArrow(ctx, faultX + 70, faultY, faultX + 20, faultY, '#EF4444', 'P⃗ (Compresión)', 2);
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
      ctx.fillText(`Δg_FA (Aire Libre): +${freeAirMgal.toFixed(0)} mGal`, profileStartX + 8, 22);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`Δg_B (Bouguer): ${bouguerAnomalyMgal.toFixed(0)} mGal (Mínimo Andino)`, profileStartX + 8, 36);

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
      ctx.fillText(`Cordillera (+${mountainHeight}m)`, W / 2 - 50, seaY - 24);
      ctx.fillText(`Corteza (ρ_c = ${crustDensity} kg/m³)`, profileStartX + 12, normalMohoY - 12);
      ctx.fillText(`Manto Superior (ρ_m = ${mantleDensity} kg/m³)`, profileStartX + 12, H - 22);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`Discontinuidad de Moho (Raíz b = ${rootKm.toFixed(1)} km)`, W / 2 - 95, normalMohoY + rootScale + 14);

      if (showDCL) {
        drawArrow(ctx, W / 2, seaY - 25, W / 2, seaY + 15, '#EF4444', 'Peso Topografía', 2.5);
        drawArrow(ctx, W / 2, normalMohoY + rootScale + 10, W / 2, normalMohoY + 20, '#10B981', 'Empuje Isostático', 2.5);
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

      drawArrow(ctx, 0, -25, 0, -60, '#34D399', `Viento W=${windSpeed} m/s`, 3);

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
      drawArrow(ctx, 0, 50, transX, 50, '#C084FC', `Transporte Neto 90° (${ekmanTransport.toFixed(1)} m²/s)`, 3.5);

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
      ctx.fillText(isSouth ? 'Costa de Chile' : 'Costa Continental', coastLeft + coastW - 85, coastTop + 20);

      drawArrow(ctx, coastLeft + coastW - 55, coastTop + 14, coastLeft + 15, coastTop + 14, '#C084FC', 'Mar Adentro (Oeste)', 2.5);

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
      ctx.fillText('Surgencia Humboldt', coastLeft + 10, coastTop + coastH - 12);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('Aguas frías ricas en nutrientes', coastLeft + 10, coastTop + coastH);

      if (showDCL) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(coastLeft + 10, coastTop + 35, 125, 48);
        ctx.strokeStyle = '#06B6D4';
        ctx.strokeRect(coastLeft + 10, coastTop + 35, 125, 48);
        ctx.fillStyle = '#06B6D4';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('Balance de Ekman:', coastLeft + 16, coastTop + 48);
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
      ctx.fillText(`Capa 1: ρ₁ = ${resTop} Ω·m (h₁ = ${layerThickness}m)`, strataLeft + 8, 42);
      ctx.fillStyle = '#C084FC';
      ctx.fillText(`Basamento: ρ₂ = ${resBottom} Ω·m`, strataLeft + 8, 25 + layer1Height + 20);

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
      ctx.fillText('Curva de Resistividad Aparente', plotLeft + 10, plotTop + 16);
      ctx.fillText('ρ_a (Ω·m)', plotLeft + 10, plotTop + 30);
      ctx.fillText('log T (Período) →', plotLeft + plotW - 105, plotTop + plotH - 6);

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

  const linkedCourse = courses.find((c) => c.id === currentProblem.courseId) || courses[0];

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

        {/* Dual Mode Switcher: 10 Benchmarks vs Compendium Toolkit */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={() => setViewMode('benchmarks')}
            className={`px-5 py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer border ${
              viewMode === 'benchmarks'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-500/30'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>
              {lang === 'en'
                ? '10 Benchmark Lab Simulations & FBDs'
                : 'Laboratorio de 10 Problemas Clásicos & DCL'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold ml-1">
              10
            </span>
          </button>

          <button
            onClick={() => setViewMode('toolkit')}
            className={`px-5 py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer border ${
              viewMode === 'toolkit'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'en'
                ? 'Compendium of Laws & Tools (Physics • Algebra • Calculus)'
                : 'Compendio de Leyes & Herramientas (Física • Álgebra • Cálculo)'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-1">
              ✨ {lang === 'en' ? 'Toolkit' : 'Herramientas'}
            </span>
          </button>
        </div>

        {viewMode === 'toolkit' ? (
          <PhysicsToolkit lang={lang} onOpenBooking={onOpenBooking} />
        ) : (
          <>
            {/* 10-Course Problem Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
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
        </>
        )}

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
                      • {lang === 'en' ? 'Official Klausur Study Sheet' : 'Ficha Oficial de Estudio y Examen'}
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
                    {currentProblem.algebraSection.formulas.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-mono text-slate-600 block mb-1">
                          {lang === 'en' ? f.labelEn : f.labelEs}
                        </span>
                        <pre className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap">
                          {f.eq}
                        </pre>
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
                    {currentProblem.calculusSection.formulas.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-mono text-slate-600 block mb-1">
                          {lang === 'en' ? f.labelEn : f.labelEs}
                        </span>
                        <pre className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap">
                          {f.eq}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Klausur Exam Exercise & Step-by-Step Scoring Solution */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {lang === 'en' ? '5. Benchmark Klausur Exam Exercise & Derivation' : '5. Ejercicio Típico de Examen Klausur y Pauta Paso a Paso'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {lang === 'en' ? 'Full score rubric' : 'Puntaje completo'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lang === 'en' ? currentProblem.exercise.questionEn : currentProblem.exercise.questionEs}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentProblem.exercise.options.map((opt) => (
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
                          {opt.text}
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
                      {lang === 'en' ? currentProblem.exercise.hintEn : currentProblem.exercise.hintEs}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <span className="text-emerald-400 font-bold block uppercase tracking-wider">
                      {lang === 'en' ? 'Official Step-by-Step Derivation:' : 'Resolución Oficial Paso a Paso:'}
                    </span>
                    {(lang === 'en' ? currentProblem.exercise.solutionStepsEn : currentProblem.exercise.solutionStepsEs).map((step, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Brand */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
                  <span>
                    Daniel Santander Urrutia • M.Sc. RWTH Aachen • Clases &amp; Mentoría TU9
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
