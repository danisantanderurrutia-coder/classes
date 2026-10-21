import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export const DEFAULT_VIEWER_SETTINGS = {
  sunIntensity: 2.2,       // Calibrated from 5.2 to avoid blown-out sector
  ambientIntensity: 0.42,   // Calibrated from 0.90 for rich shadow contrast
  bloomStrength: 0.36,      // Calibrated from 0.65 to avoid foggy glare
  bloomThreshold: 0.82,     // Calibrated from 0.55 so planet surfaces don't glow
  sgrExposure: 0.95,        // Calibrated from 2.2-2.5 for crisp accretion disk & event horizon
  planetContrast: 1.15,
  antiGlare: true,
};

// ============================================================================
// 0. CINEMATIC LAYER: FINAL GRADE SHADER + GENERATIVE AMBIENT AUDIO
// ============================================================================
const CINE_FONT = "'Michroma','Orbitron','JetBrains Mono',ui-sans-serif,system-ui,sans-serif";

/**
 * Runs AFTER tone mapping (display-referred sRGB):
 *  1. Gravitational lensing of the full frame around Sgr A* (beta = theta - thetaE^2/theta)
 *  2. Radial chromatic aberration (lens fringing)
 *  3. 70mm-style horizontal anamorphic streak from over-bright pixels (cool blue)
 *  4. Teal-shadows / warm-highlights grade with a gentle S-curve
 *  5. Luma-dependent film grain + vignette
 */
const CineShader = {
  name: 'CineShader',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uLensPos: { value: new THREE.Vector2(0.5, 0.5) },
    uThetaE: { value: 0.0 },
    uLensStrength: { value: 0.0 },
    uGrain: { value: 0.05 },
    uVignette: { value: 0.55 },
    uCA: { value: 0.0018 },
    uStreak: { value: 0.32 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAspect;
    uniform vec2 uLensPos;
    uniform float uThetaE;
    uniform float uLensStrength;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uCA;
    uniform float uStreak;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uv = vUv;

      // 1. Gravitational lensing (thin-lens deflection, softened)
      if (uLensStrength > 0.001) {
        vec2 d = uv - uLensPos;
        d.x *= uAspect;
        float r2 = dot(d, d) + 1e-6;
        float f = clamp(0.6 * uThetaE * uThetaE / r2, 0.0, 0.75) * uLensStrength;
        d *= (1.0 - f);
        d.x /= uAspect;
        uv = uLensPos + d;
      }

      // 2. Chromatic aberration (grows toward the frame edge)
      vec2 c = vUv - 0.5;
      float r = length(c);
      vec2 caOff = c * (r * uCA * 6.0);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + caOff).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - caOff).b;

      // 3. Anamorphic horizontal streak (14 taps per side, quadratic stride)
      vec3 streak = vec3(0.0);
      for (int i = 1; i <= 14; i++) {
        float fi = float(i);
        float off = fi * fi * 0.0011;
        float w = exp(-fi * 0.22);
        vec3 a = texture2D(tDiffuse, uv + vec2(off, 0.0)).rgb;
        vec3 b = texture2D(tDiffuse, uv - vec2(off, 0.0)).rgb;
        streak += (max(a - 0.86, 0.0) + max(b - 0.86, 0.0)) * w;
      }
      col += streak * vec3(0.22, 0.52, 1.0) * uStreak;

      // 4. Grade: cool shadows, warm highlights, soft S-curve
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col *= mix(vec3(0.93, 1.0, 1.07), vec3(1.0), smoothstep(0.0, 0.35, lum));
      col = mix(col, col * vec3(1.06, 1.0, 0.92), smoothstep(0.55, 1.0, lum));
      vec3 s = clamp(col, 0.0, 1.0);
      col = mix(col, s * s * (3.0 - 2.0 * s), 0.30);

      // 5. Film grain (stronger in mid-tones) + vignette
      float g = hash(vUv * 1400.0 + fract(uTime) * 91.7) - 0.5;
      col += g * uGrain * (1.0 - clamp(lum, 0.0, 1.0) * 0.55);
      float vig = smoothstep(0.95, 0.25, r * (1.0 + 0.15 * uAspect * 0.5));
      col *= mix(1.0, vig, uVignette);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/**
 * Generative ambient engine (Web Audio, no assets): a slow organ-like drone
 * (stacked detuned partials) through a breathing low-pass and a dark feedback
 * delay. Root note and brightness change with the architectural level.
 */
function createAmbientEngine() {
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;
  filter.Q.value = 0.7;
  filter.connect(master);

  // Dark feedback delay acts as a cheap cathedral reverb
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = 0.43;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.55;
  const delayLP = ctx.createBiquadFilter();
  delayLP.type = 'lowpass';
  delayLP.frequency.value = 1300;
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  filter.connect(delay);
  delay.connect(delayLP);
  delayLP.connect(feedback);
  feedback.connect(delay);
  delayLP.connect(wet);
  wet.connect(master);

  const bus = ctx.createGain();
  bus.gain.value = 0.5;
  bus.connect(filter);

  const ratios = [1, 1.5, 2, 3, 4, 6];
  const gains = [0.55, 0.3, 0.26, 0.12, 0.07, 0.035];
  const oscs = [];
  ratios.forEach((ratio, i) => {
    [-7, 7].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = i < 2 ? 'sawtooth' : 'triangle';
      o.detune.value = cents;
      o.frequency.value = 55 * ratio;
      const g = ctx.createGain();
      g.gain.value = gains[i] * 0.5;
      o.connect(g);
      g.connect(bus);
      o.start();
      oscs.push({ o, ratio });
    });
  });

  // Slow "breathing": LFO on filter cutoff and on bus level
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoFilterDepth = ctx.createGain();
  lfoFilterDepth.gain.value = 140;
  lfo.connect(lfoFilterDepth);
  lfoFilterDepth.connect(filter.frequency);
  const lfo2 = ctx.createOscillator();
  lfo2.frequency.value = 0.11;
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 0.12;
  lfo2.connect(lfoAmp);
  lfoAmp.connect(bus.gain);
  lfo.start();
  lfo2.start();

  const LEVELS = {
    planetary: { root: 73.42, cutoff: 620 }, // D2: warm, close
    solar: { root: 55.0, cutoff: 460 },      // A1: vast, calm
    galaxy: { root: 36.71, cutoff: 300 },    // D1: abyssal
  };
  const VOLUME = 0.17;
  let currentCutoff = LEVELS.solar.cutoff;

  return {
    setLevel(level) {
      const cfg = LEVELS[level] || LEVELS.solar;
      currentCutoff = cfg.cutoff;
      const t = ctx.currentTime;
      oscs.forEach(({ o, ratio }) => o.frequency.setTargetAtTime(cfg.root * ratio, t, 2.2));
      filter.frequency.setTargetAtTime(cfg.cutoff, t, 2.0);
    },
    swell() {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(VOLUME * 1.9, t, 0.9);
      master.gain.setTargetAtTime(VOLUME, t + 2.4, 1.8);
      filter.frequency.cancelScheduledValues(t);
      filter.frequency.setTargetAtTime(1100, t, 0.8);
      filter.frequency.setTargetAtTime(currentCutoff, t + 2.2, 1.6);
    },
    start() {
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 1.4);
    },
    stop() {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    },
    dispose() {
      try {
        oscs.forEach(({ o }) => o.stop());
        lfo.stop();
        lfo2.stop();
        ctx.close();
      } catch (e) {
        /* already closed */
      }
    },
  };
}

// ============================================================================
// 1. ASTROPHYSICAL & ACADEMIC METADATA (11 CELESTIAL BODIES: 8 PLANETS + SUN + MOON + SGR A*)
// ============================================================================
export const PLANET_SUBJECTS = [
  {
    id: 'sun',
    name: 'The Sun',
    nameEn: 'The Sun',
    nameEs: 'El Sol',
    shortName: 'Sun',
    shortNameEn: 'Sun',
    shortNameEs: 'Sol',
    emoji: '☀️',
    spectralClass: 'G2V Main Sequence Star',
    academicAreaEn: 'General Physics (Bachelor / Plan Común)',
    academicAreaEs: 'Física General (Nivel Bachelor / Plan Común)',
    shortCourseEn: 'General Physics',
    shortCourseEs: 'Física General',
    courseId: 'physics_bachelor',
    courseCode: 'PHY-101',
    rateHourly: 55,
    packagePrice: 390,
    inLineup: true,
    lineupIndex: 0,
    lineupX: -30.0,
    lineupScale: 0.50,
    descriptionEn: 'Foundational university physics: Newtonian mechanics, work and energy conservation, thermodynamics, wave optics, and laboratory problem solving.',
    descriptionEs: 'Física fundamental universitaria: mecánica newtoniana, leyes de conservación de energía y momento, termodinámica, ondas y resolución sistemática de problemas.',
    color: '#FFB703',
    size: 3.4,
    distance: 0,
    speed: 0,
    eccentricity: 0,
    axialTilt: 7.25,
    orbitalPeriod: '0 days',
    temperatureK: '5,778 K (Photosphere) / 1.5×10⁷ K (Core)',
    semiMajorAxisAU: '0.00 AU',
    orbitalSpeedKms: '0.0 km/s (Galactic: 230 km/s)',
    realSize: 10.0,
    realDistance: 0,
    massKg: 1.989e30,
    surfaceGravityMs2: 274.0,
    escapeVelocityKms: 617.5,
    magneticFieldTesla: '100–3000 G (Bipolar Cycle)',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    nameEn: 'Mercury',
    nameEs: 'Mercurio',
    shortName: 'Mercury',
    shortNameEn: 'Mercury',
    shortNameEs: 'Mercurio',
    emoji: '🪨',
    spectralClass: 'Hermian Silicate Regolith',
    academicAreaEn: 'Classical Mechanics & Dynamics',
    academicAreaEs: 'Mecánica Clásica y Dinámica',
    shortCourseEn: 'Mechanics',
    shortCourseEs: 'Mecánica',
    courseId: 'mechanics',
    courseCode: 'PHY-201',
    rateHourly: 60,
    packagePrice: 430,
    inLineup: true,
    lineupIndex: 1,
    lineupX: -24.0,
    lineupScale: 2.50,
    descriptionEn: 'Newtonian dynamics, non-inertial frames, rigid body rotations, inertia tensors, harmonic oscillators, and central gravitational potentials.',
    descriptionEs: 'Dinámica newtoniana, sistemas no inerciales, cinemática del sólido rígido, tensores de inercia, osciladores armónicos y potenciales gravitatorios.',
    color: '#A3A8B5',
    size: 0.65,
    distance: 7.5,
    speed: 2.3,
    eccentricity: 0.2056,
    inclination: 0.122,
    axialTilt: 0.034,
    orbitalPeriod: '87.97 days',
    temperatureK: '100 K – 700 K',
    semiMajorAxisAU: '0.387 AU',
    orbitalSpeedKms: '47.4 km/s',
    realSize: 0.05,
    realDistance: 75,
    massKg: 3.301e23,
    surfaceGravityMs2: 3.7,
    escapeVelocityKms: 4.3,
    magneticFieldTesla: '300 nT (Weak Dipole)',
  },
  {
    id: 'venus',
    name: 'Venus',
    nameEn: 'Venus',
    nameEs: 'Venus',
    shortName: 'Venus',
    shortNameEn: 'Venus',
    shortNameEs: 'Venus',
    emoji: '🌕',
    spectralClass: 'Supercritical Greenhouse Atmosphere',
    academicAreaEn: 'Atmospheric Physics & Gas Dynamics',
    academicAreaEs: 'Física Atmosférica y Dinámica de Gases',
    shortCourseEn: 'Atmospheric Physics',
    shortCourseEs: 'Física Atmosférica',
    courseId: 'atmospheric',
    courseCode: 'ATM-201',
    rateHourly: 60,
    packagePrice: 430,
    inLineup: true,
    lineupIndex: 2,
    lineupX: -18.0,
    lineupScale: 1.65,
    descriptionEn: 'Atmospheric thermodynamics, hydrostatic balance, greenhouse radiative transfer, baroclinic fluid instability, and planetary boundary layers.',
    descriptionEs: 'Termodinámica atmosférica, equilibrio hidrostático, transferencia radiativa, efecto invernadero, fluidos baroclínicos y capas límite planetarias.',
    color: '#FCD34D',
    size: 1.08,
    distance: 11.2,
    speed: 1.65,
    eccentricity: 0.0067,
    inclination: 0.059,
    axialTilt: 177.36,
    orbitalPeriod: '224.70 days',
    temperatureK: '737 K (Mean Surface)',
    semiMajorAxisAU: '0.723 AU',
    orbitalSpeedKms: '35.0 km/s',
    realSize: 0.12,
    realDistance: 140,
    massKg: 4.867e24,
    surfaceGravityMs2: 8.87,
    escapeVelocityKms: 10.4,
    magneticFieldTesla: '~0 nT (Induced Ionosphere)',
  },
  {
    id: 'earth',
    name: 'Earth',
    nameEn: 'Earth',
    nameEs: 'Tierra',
    shortName: 'Earth',
    shortNameEn: 'Earth',
    shortNameEs: 'Tierra',
    emoji: '🌍',
    spectralClass: 'Active Biosphere / Human Civilization',
    academicAreaEn: 'Calculus & Mathematical Analysis (I, II & III)',
    academicAreaEs: 'Cálculo y Análisis Matemático (I, II y III)',
    shortCourseEn: 'Calculus I–III',
    shortCourseEs: 'Cálculo I–III',
    courseId: 'klausur',
    courseCode: 'HM-101',
    rateHourly: 55,
    packagePrice: 390,
    inLineup: true,
    lineupIndex: 3,
    lineupX: -12.0,
    lineupScale: 1.65,
    descriptionEn: 'Multivariable differential calculus, gradient vector fields (∇f, ∇·F, ∇×F), Gauss and Stokes theorems, Taylor series, and exam drills.',
    descriptionEs: 'Cálculo diferencial multivariable, campos vectoriales (∇f, ∇·F, ∇×F), teoremas integrales de Gauss y Stokes, series de Taylor y preparación de exámenes.',
    color: '#38BDF8',
    size: 1.15,
    distance: 15.0,
    speed: 1.25,
    eccentricity: 0.0167,
    inclination: 0.0,
    axialTilt: 23.44,
    hasClouds: true,
    hasAtmosphere: true,
    hasMoon: false,
    hasSatellites: true,
    orbitalPeriod: '365.25 days',
    temperatureK: '288 K (Mean)',
    semiMajorAxisAU: '1.000 AU',
    orbitalSpeedKms: '29.8 km/s',
    realSize: 0.13,
    realDistance: 195,
    massKg: 5.972e24,
    surfaceGravityMs2: 9.807,
    escapeVelocityKms: 11.186,
    magneticFieldTesla: '30.5 µT (Equator) / 60 µT (Poles)',
  },
  {
    id: 'moon',
    name: 'The Moon',
    nameEn: 'The Moon',
    nameEs: 'La Luna',
    shortName: 'Moon',
    shortNameEn: 'Moon',
    shortNameEs: 'Luna',
    emoji: '🌑',
    spectralClass: 'Silicate Lunar Regolith',
    academicAreaEn: 'Soil Physics, Porous Media & Hydrogeophysics',
    academicAreaEs: 'Física de Suelos, Medios Porosos e Hidrogeofísica',
    shortCourseEn: 'Soil Physics',
    shortCourseEs: 'Física de Suelos',
    courseId: 'soil_physics',
    courseCode: 'GEO-202',
    rateHourly: 60,
    packagePrice: 430,
    inLineup: true,
    lineupIndex: 4,
    lineupX: -7.0,
    lineupScale: 2.80,
    descriptionEn: 'Porous media transport, Darcy\'s law, unsaturated flow, apparent electrical resistivity (VES / SEV), and groundwater catchment balances.',
    descriptionEs: 'Transporte en medios porosos, ley de Darcy, flujo no saturado, resistividad eléctrica aparente (SEV / VES) y balances hídricos de cuencas.',
    color: '#E2E8F0',
    size: 0.52,
    distance: 17.6,
    speed: 1.15,
    eccentricity: 0.0549,
    inclination: 0.089,
    axialTilt: 1.54,
    orbitalPeriod: '27.32 days',
    temperatureK: '120 K – 390 K',
    semiMajorAxisAU: '1.002 AU',
    orbitalSpeedKms: '1.02 km/s',
    realSize: 0.035,
    realDistance: 198,
    massKg: 7.342e22,
    surfaceGravityMs2: 1.62,
    escapeVelocityKms: 2.38,
    magneticFieldTesla: '~0 nT (Crustal Remanence)',
  },
  {
    id: 'mars',
    name: 'Mars',
    nameEn: 'Mars',
    nameEs: 'Marte',
    shortName: 'Mars',
    shortNameEn: 'Mars',
    shortNameEs: 'Marte',
    emoji: '🔴',
    spectralClass: 'Oxidized Ferric Crust',
    academicAreaEn: 'Foundational Mathematics (Bachelor / Plan Común)',
    academicAreaEs: 'Matemática Fundamental (Nivel Bachelor / Plan Común)',
    shortCourseEn: 'Foundational Math',
    shortCourseEs: 'Matemática Base',
    courseId: 'math_bachelor',
    courseCode: 'MAT-101',
    rateHourly: 55,
    packagePrice: 390,
    inLineup: true,
    lineupIndex: 5,
    lineupX: -1.5,
    lineupScale: 2.15,
    descriptionEn: 'Formal university mathematical foundations: functions, trigonometry, limits, sequences, analytical geometry, and deductive proofs.',
    descriptionEs: 'Bases matemáticas universitarias: álgebra de funciones, trigonometría, límites, sucesiones, geometría analítica y demostraciones deductivas.',
    color: '#E05A36',
    size: 0.82,
    distance: 22.0,
    speed: 0.98,
    eccentricity: 0.0934,
    inclination: 0.032,
    axialTilt: 25.19,
    hasAtmosphere: true,
    orbitalPeriod: '686.98 days',
    temperatureK: '210 K (Mean)',
    semiMajorAxisAU: '1.524 AU',
    orbitalSpeedKms: '24.1 km/s',
    realSize: 0.07,
    realDistance: 295,
    massKg: 6.417e23,
    surfaceGravityMs2: 3.72,
    escapeVelocityKms: 5.03,
    magneticFieldTesla: 'Remanent Crustal Striping',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameEn: 'Jupiter',
    nameEs: 'Júpiter',
    shortName: 'Jupiter',
    shortNameEn: 'Jupiter',
    shortNameEs: 'Júpiter',
    emoji: '🟠',
    spectralClass: 'Jovian Gas Giant (Giant Magnetosphere)',
    academicAreaEn: 'Electromagnetism & Maxwell Equations',
    academicAreaEs: 'Electromagnetismo y Ecuaciones de Maxwell',
    shortCourseEn: 'Electromagnetism',
    shortCourseEs: 'Electromagnetismo',
    courseId: 'electromagnetism',
    courseCode: 'PHY-202',
    rateHourly: 60,
    packagePrice: 430,
    inLineup: true,
    lineupIndex: 6,
    lineupX: 5.5,
    lineupScale: 0.72,
    descriptionEn: 'Electric and magnetic vector fields, Coulomb & Gauss laws, Lorentz force, Ampère-Maxwell circulation, Faraday induction, and electromagnetic waves.',
    descriptionEs: 'Campos vectoriales eléctricos y magnéticos, leyes de Coulomb y Gauss, fuerza de Lorentz, circulación de Ampère-Maxwell, inducción de Faraday y ondas EM.',
    color: '#D97706',
    size: 2.65,
    distance: 32.5,
    speed: 0.52,
    eccentricity: 0.0484,
    inclination: 0.023,
    axialTilt: 3.13,
    orbitalPeriod: '11.86 Earth years',
    temperatureK: '165 K (Cloud top)',
    semiMajorAxisAU: '5.204 AU',
    orbitalSpeedKms: '13.1 km/s',
    realSize: 1.40,
    realDistance: 1010,
    massKg: 1.898e27,
    surfaceGravityMs2: 24.79,
    escapeVelocityKms: 59.5,
    magneticFieldTesla: '420 µT (Equator) / 1.4 mT (Poles)',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameEn: 'Saturn',
    nameEs: 'Saturno',
    shortName: 'Saturn',
    shortNameEn: 'Saturn',
    shortNameEs: 'Saturno',
    emoji: '🪐',
    spectralClass: 'Ringed Chronian Gas Giant',
    academicAreaEn: 'Linear Algebra & Matrix Geometry',
    academicAreaEs: 'Álgebra Lineal y Geometría Matricial',
    shortCourseEn: 'Linear Algebra',
    shortCourseEs: 'Álgebra Lineal',
    courseId: 'linear_algebra',
    courseCode: 'LA-102',
    rateHourly: 55,
    packagePrice: 390,
    inLineup: true,
    lineupIndex: 7,
    lineupX: 12.0,
    lineupScale: 0.70,
    descriptionEn: 'Vector spaces, subspaces, linear independence, basis transformations, linear maps, kernel/image dimension theorems, eigenvalues, and diagonalization.',
    descriptionEs: 'Espacios vectoriales, subespacios, independencia lineal, cambios de base, aplicaciones lineales, teorema del rango-nulidad, autovalores y diagonalización.',
    color: '#FDE68A',
    size: 2.15,
    distance: 44.0,
    speed: 0.38,
    eccentricity: 0.0541,
    inclination: 0.043,
    axialTilt: 26.73,
    hasRings: true,
    orbitalPeriod: '29.45 Earth years',
    temperatureK: '134 K (Cloud top)',
    semiMajorAxisAU: '9.582 AU',
    orbitalSpeedKms: '9.7 km/s',
    realSize: 1.18,
    realDistance: 1860,
    massKg: 5.683e26,
    surfaceGravityMs2: 10.44,
    escapeVelocityKms: 35.5,
    magneticFieldTesla: '21 µT (Aligned Axisymmetric)',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameEn: 'Uranus',
    nameEs: 'Urano',
    shortName: 'Uranus',
    shortNameEn: 'Uranus',
    shortNameEs: 'Urano',
    emoji: '🧊',
    spectralClass: 'Aquamarine Methane Cryogenic Ice Giant',
    academicAreaEn: 'Quantum Physics for Enthusiasts (Conceptual / Non-University)',
    academicAreaEs: 'Física Cuántica para Curiosos (Nivel Aficionados / No Universitario)',
    shortCourseEn: 'Quantum Concepts',
    shortCourseEs: 'Cuántica Curiosos',
    courseId: 'quantum_curious',
    courseCode: 'QNT-100',
    rateHourly: 45,
    packagePrice: 320,
    inLineup: true,
    lineupIndex: 8,
    lineupX: 18.0,
    lineupScale: 0.85,
    descriptionEn: 'Fascinating conceptual exploration for science enthusiasts: wave-particle duality, photon quanta, photoelectric effect, and Heisenberg uncertainty without university operator stress.',
    descriptionEs: 'Exploración conceptual para aficionados de la ciencia: dualidad onda-partícula, fotones, efecto fotoeléctrico e incertidumbre de Heisenberg sin el estrés de operadores universitarios.',
    color: '#7DD3FC',
    size: 1.75,
    distance: 53.0,
    speed: 0.31,
    eccentricity: 0.0472,
    inclination: 0.013,
    axialTilt: 97.77,
    orbitalPeriod: '84.0 Earth years',
    temperatureK: '76 K (Cloud top)',
    semiMajorAxisAU: '19.22 AU',
    orbitalSpeedKms: '6.8 km/s',
    realSize: 0.54,
    realDistance: 3800,
    massKg: 8.681e25,
    surfaceGravityMs2: 8.87,
    escapeVelocityKms: 21.3,
    magneticFieldTesla: '23 µT (Tilted 59° Dipole)',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameEn: 'Neptune',
    nameEs: 'Neptuno',
    shortName: 'Neptune',
    shortNameEn: 'Neptune',
    shortNameEs: 'Neptuno',
    emoji: '🔵',
    spectralClass: 'Deep Methane/Ammonia Cryogenic Giant',
    academicAreaEn: 'Scientific Data Analysis (Python & MATLAB)',
    academicAreaEs: 'Análisis de Datos Científicos (Python y MATLAB)',
    shortCourseEn: 'Data Analysis',
    shortCourseEs: 'Data Analysis',
    courseId: 'computational',
    courseCode: 'COMP-205',
    rateHourly: 65,
    packagePrice: 470,
    inLineup: true,
    lineupIndex: 9,
    lineupX: 24.0,
    lineupScale: 0.80,
    descriptionEn: 'Vectorized numerical arrays with NumPy, SciPy scientific libraries, curve fitting, signal processing, MATLAB computational pipelines, and publication-quality plots.',
    descriptionEs: 'Arreglos vectorizados en NumPy, librerías científicas SciPy, ajuste de curvas empíricas, procesamiento de señales, pipelines en MATLAB y gráficos de publicación.',
    color: '#38BDF8',
    size: 1.85,
    distance: 62.0,
    speed: 0.26,
    eccentricity: 0.0086,
    inclination: 0.031,
    axialTilt: 28.32,
    orbitalPeriod: '164.8 Earth years',
    temperatureK: '72 K (Cloud top)',
    semiMajorAxisAU: '30.07 AU',
    orbitalSpeedKms: '5.4 km/s',
    realSize: 0.52,
    realDistance: 5850,
    massKg: 1.024e26,
    surfaceGravityMs2: 11.15,
    escapeVelocityKms: 23.5,
    magneticFieldTesla: '14 µT (Tilted Quadrupole 47°)',
  },
  {
    id: 'blackhole',
    name: 'Sagittarius A*',
    nameEn: 'Sagittarius A* (Galactic Center)',
    nameEs: 'Sagitario A* (Centro Galáctico)',
    shortName: 'Sgr A*',
    shortNameEn: 'Sgr A*',
    shortNameEs: 'Sgr A*',
    emoji: '🕳️',
    spectralClass: 'Supermassive Kerr Black Hole (4.15×10⁶ M☉)',
    academicAreaEn: 'Thesis Mentorship, Research Projects & Graduation Coaching',
    academicAreaEs: 'Mentoría de Tesis de Grado, Proyectos de Investigación y Titulación',
    shortCourseEn: 'Thesis & Projects',
    shortCourseEs: 'Tesis & Proyectos',
    courseId: 'thesis_projects',
    courseCode: 'RES-501',
    rateHourly: 75,
    packagePrice: 540,
    inLineup: true,
    lineupIndex: 10,
    lineupX: 30.5,
    lineupScale: 0.105,
    descriptionEn: 'The gravitational anchor for completing your degree: numerical model debugging, simulation code optimization, scientific writing, literature methodology, and thesis defense rehearsal.',
    descriptionEs: 'El ancla gravitatoria para terminar tu carrera: depuración de modelos numéricos, optimización de simulaciones, redacción científica, metodología y preparación de la defensa de grado.',
    color: '#C084FC',
    size: 7.2,
    distance: 320,
    speed: 0.024,
    eccentricity: 0.06,
    axialTilt: 63.0,
    orbitalPeriod: '230 Million Years (Galactic Year)',
    temperatureK: '10¹¹ K (Inner Relativistic Plasma)',
    semiMajorAxisAU: '1.68×10⁹ AU (26,000 ly)',
    orbitalSpeedKms: '230.0 km/s',
    realSize: 80.0,
    realDistance: 48000,
    massKg: 8.26e36, // 4.15 million solar masses
    surfaceGravityMs2: Infinity,
    escapeVelocityKms: 299792.458,
    magneticFieldTesla: '10–100 G (Horizon Magnetosphere)',
  }
];

export const LINEUP_PLANETS = PLANET_SUBJECTS.filter((p) => p.inLineup);

export const getPlanetName = (p, lang) => !p ? '' : (lang === 'en' ? (p.nameEn || p.name) : (p.nameEs || p.name));
export const getPlanetShortName = (p, lang) => !p ? '' : (lang === 'en' ? (p.shortNameEn || p.shortName || p.name) : (p.shortNameEs || p.shortName || p.name));


export function calculateAstrodynamics(planet, currentR_AU = 1.0, currentSpeedKms = 29.8) {
  const G = 6.6743e-11;
  const M_sun = 1.989e30; // kg
  const AU_in_m = 1.495978707e11; // m
  
  const m = planet.massKg || 5.972e24;
  const r_m = Math.max(1e8, (parseFloat(currentR_AU) || 1.0) * AU_in_m);
  const v_ms = (parseFloat(currentSpeedKms) || 29.8) * 1000.0;
  
  // Gravitational Force F = G*M*m / r^2
  const F_gravity = (G * M_sun * m) / (r_m * r_m);
  
  // Centripetal Acceleration ac = v^2 / r
  const a_centripetal = (v_ms * v_ms) / r_m;
  
  // Orbital angular momentum L = m * r * v
  const L_angular = m * r_m * v_ms;
  
  // Kinetic and Potential Energy
  const E_k = 0.5 * m * v_ms * v_ms;
  const U_g = -(G * M_sun * m) / r_m;
  const E_total = E_k + U_g;
  
  // Escape velocity
  const v_escapeKms = Math.sqrt((2 * G * M_sun) / r_m) / 1000.0;
  
  return {
    F_gravityN: F_gravity,
    F_gravityScientific: F_gravity.toExponential(3),
    a_centripetalMs2: a_centripetal,
    a_centripetalScientific: a_centripetal.toExponential(3),
    L_angularScientific: L_angular.toExponential(3),
    E_kScientific: E_k.toExponential(3),
    U_gScientific: U_g.toExponential(3),
    E_totalScientific: E_total.toExponential(3),
    v_escapeKms: v_escapeKms.toFixed(1),
    r_millionKm: (r_m / 1e9).toFixed(2),
  };
}

/**
 * Creates high-DPI 3D billboard sprites for physical vector components (Fg, ac, v, Fcf, L)
 */
function createVectorLabelSprite(text, borderColor = '#38BDF8', textColor = '#FFFFFF') {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 110;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background rounded box
  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 5;

  const r = 20;
  const x = 6, y = 6, w = 512 - 12, h = 110 - 12;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle glow
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 12;

  // Typography
  ctx.fillStyle = textColor;
  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 55);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.renderOrder = 999;
  return sprite;
}

// ============================================================================
// 2. ULTRA-FAST FRACTAL VALUE & PERLIN NOISE ENGINE
// ============================================================================
function createNoiseGenerator() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t, a, b) => a + t * (b - a);
  const grad = (hash, x, y) => {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  };

  const noise2D = (x, y) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const a = perm[X] + Y;
    const b = perm[X + 1] + Y;
    return lerp(
      v,
      lerp(u, grad(perm[a], xf, yf), grad(perm[b], xf - 1, yf)),
      lerp(u, grad(perm[a + 1], xf, yf - 1), grad(perm[b + 1], xf - 1, yf - 1))
    );
  };

  const fbm2D = (x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) => {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return total / maxValue;
  };

  return { noise2D, fbm2D };
}

const noise = createNoiseGenerator();

// ============================================================================
// 3. SCIENTIFIC PROCEDURAL TEXTURES (DAY + NIGHT CITY LIGHTS)
// ============================================================================

function createStarSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, 'rgba(240, 248, 255, 0.90)');
  grad.addColorStop(0.42, 'rgba(180, 215, 255, 0.40)');
  grad.addColorStop(0.75, 'rgba(120, 170, 255, 0.10)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createBrightStarSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64, cy = 64;

  // Core glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.30, 'rgba(200, 230, 255, 0.45)');
  grad.addColorStop(0.70, 'rgba(120, 180, 255, 0.08)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  // 4-point diffraction spike (Hubble / James Webb astrophotography aesthetic)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.70)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy); ctx.lineTo(cx + 50, cy);
  ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50);
  ctx.stroke();

  // Secondary diagonal subtle rays
  ctx.strokeStyle = 'rgba(190, 225, 255, 0.28)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 24); ctx.lineTo(cx + 24, cy + 24);
  ctx.moveTo(cx - 24, cy + 24); ctx.lineTo(cx + 24, cy - 24);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createCosmicNebulaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep obsidian cosmos background
  ctx.fillStyle = '#020307';
  ctx.fillRect(0, 0, 2048, 1024);

  // Soft atmospheric Milky Way galactic plane & nebulae
  const nebulae = [
    // Galactic center bulge (Sagittarius / Scorpius region)
    { x: 1024, y: 512, r1: 0, r2: 500, c1: 'rgba(52, 98, 200, 0.18)', c2: 'rgba(2, 3, 7, 0)' },
    { x: 1024, y: 512, r1: 0, r2: 280, c1: 'rgba(130, 75, 200, 0.15)', c2: 'rgba(2, 3, 7, 0)' },
    { x: 990, y: 500, r1: 0, r2: 150, c1: 'rgba(210, 160, 255, 0.20)', c2: 'rgba(2, 3, 7, 0)' },
    // Cygnus / Cassiopeia arm
    { x: 440, y: 390, r1: 0, r2: 420, c1: 'rgba(20, 80, 170, 0.14)', c2: 'rgba(2, 3, 7, 0)' },
    { x: 620, y: 440, r1: 0, r2: 360, c1: 'rgba(95, 45, 150, 0.11)', c2: 'rgba(2, 3, 7, 0)' },
    // Carina / Crux arm
    { x: 1560, y: 610, r1: 0, r2: 450, c1: 'rgba(28, 92, 195, 0.15)', c2: 'rgba(2, 3, 7, 0)' },
    { x: 1700, y: 660, r1: 0, r2: 340, c1: 'rgba(150, 50, 130, 0.10)', c2: 'rgba(2, 3, 7, 0)' },
    // Orion / Taurus reflection clouds
    { x: 1260, y: 360, r1: 0, r2: 310, c1: 'rgba(35, 120, 180, 0.12)', c2: 'rgba(2, 3, 7, 0)' },
    { x: 790, y: 640, r1: 0, r2: 330, c1: 'rgba(25, 75, 155, 0.10)', c2: 'rgba(2, 3, 7, 0)' },
  ];

  nebulae.forEach(n => {
    const rad = ctx.createRadialGradient(n.x, n.y, n.r1, n.x, n.y, n.r2);
    rad.addColorStop(0.0, n.c1);
    rad.addColorStop(1.0, n.c2);
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 2048, 1024);
  });

  // Dark dust lanes (Great Rift of the Milky Way)
  const dustLanes = [
    { x: 1010, y: 520, rx: 270, ry: 40, rot: 0.10, alpha: 0.28 },
    { x: 610, y: 430, rx: 300, ry: 32, rot: 0.08, alpha: 0.22 },
    { x: 1530, y: 605, rx: 280, ry: 36, rot: 0.14, alpha: 0.24 },
  ];

  dustLanes.forEach(d => {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx);
    rad.addColorStop(0.0, `rgba(2, 3, 7, ${d.alpha})`);
    rad.addColorStop(0.65, `rgba(2, 3, 7, ${d.alpha * 0.45})`);
    rad.addColorStop(1.0, 'rgba(2, 3, 7, 0)');
    ctx.scale(1.0, d.ry / d.rx);
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(0, 0, d.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Micro-stardust resolution layer across galactic belt
  const imgData = ctx.getImageData(0, 0, 2048, 1024);
  const data = imgData.data;
  for (let i = 0; i < 18000; i++) {
    const u = Math.random();
    const galacticY = 512 + Math.sin(u * Math.PI * 2) * 150 + (Math.random() - 0.5) * 160 * (1 - Math.abs(u - 0.5));
    const px = Math.floor(u * 2048);
    const py = Math.floor(Math.max(0, Math.min(1023, galacticY)));
    const idx = (py * 2048 + px) * 4;
    const b = Math.floor(45 + Math.random() * 150);
    data[idx] = Math.min(255, data[idx] + b);
    data[idx + 1] = Math.min(255, data[idx + 1] + Math.floor(b * 0.9));
    data[idx + 2] = Math.min(255, data[idx + 2] + Math.floor(b * 1.15));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createAnamorphicStreakTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 1024, 128);

  const horizGrad = ctx.createLinearGradient(0, 64, 1024, 64);
  horizGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0)');
  horizGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.18)');
  horizGrad.addColorStop(0.46, 'rgba(255, 248, 230, 0.9)');
  horizGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
  horizGrad.addColorStop(0.54, 'rgba(255, 248, 230, 0.9)');
  horizGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.18)');
  horizGrad.addColorStop(1.0, 'rgba(56, 189, 248, 0)');

  ctx.fillStyle = horizGrad;
  ctx.beginPath();
  ctx.ellipse(512, 64, 510, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(160, 62, 704, 3);
  return new THREE.CanvasTexture(canvas);
}

function createVenusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const xNorm = x / 1024;
      const chevron = Math.abs(lat) * 2.5 + Math.sin(xNorm * Math.PI * 2) * 0.4;
      const turb = noise.fbm2D(xNorm * 10.0 + chevron, lat * 6.0, 5, 0.55, 2.0);

      const r = Math.min(255, Math.floor(242 - turb * 25));
      const g = Math.min(255, Math.floor(220 - turb * 35));
      const b = Math.min(255, Math.floor(165 - turb * 45));

      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createEarthDiffuseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    for (let x = 0; x < 1024; x++) {
      const lon = (x / 1024) * Math.PI * 2;
      const idx = (y * 1024 + x) * 4;

      const nx = Math.cos(lon) * cosLat;
      const ny = Math.sin(lat);
      const nz = Math.sin(lon) * cosLat;

      const continentField = noise.fbm2D(nx * 1.8 + 10.0, ny * 1.8 + nz * 1.8, 6, 0.52, 2.05);
      const elevation = continentField + noise.fbm2D(nx * 8.0, ny * 8.0 + nz * 8.0, 3, 0.5, 2.0) * 0.15;
      const isIce = (Math.abs(lat) / (Math.PI * 0.5)) + noise.noise2D(nx * 4.0, nz * 4.0) * 0.08 > 0.82;

      let r, g, b;
      if (isIce) {
        r = 245; g = 250; b = 255;
      } else if (elevation < 0.05) {
        const shelf = Math.max(0, elevation + 0.1) / 0.15;
        r = Math.floor(12 + shelf * 20);
        g = Math.floor(45 + shelf * 70);
        b = Math.floor(115 + shelf * 95);
      } else {
        const landHeight = (elevation - 0.05) / 0.95;
        if (landHeight < 0.35) {
          r = Math.floor(45 + landHeight * 50);
          g = Math.floor(130 + landHeight * 45);
          b = Math.floor(58 + landHeight * 25);
        } else if (landHeight < 0.65) {
          r = Math.floor(195 + (landHeight - 0.35) * 45);
          g = Math.floor(165 + (landHeight - 0.35) * 35);
          b = Math.floor(105 + (landHeight - 0.35) * 20);
        } else {
          r = Math.floor(190 + (landHeight - 0.65) * 65);
          g = Math.floor(190 + (landHeight - 0.65) * 65);
          b = Math.floor(190 + (landHeight - 0.65) * 65);
        }
      }
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

function createEarthNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#010204';
  ctx.fillRect(0, 0, 1024, 512);

  const paintCityNode = (cx, cy, radius, intensity = 1.0) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0.0, `rgba(255, 225, 140, ${0.98 * intensity})`);
    grad.addColorStop(0.35, `rgba(255, 180, 70, ${0.7 * intensity})`);
    grad.addColorStop(0.7, `rgba(255, 120, 30, ${0.3 * intensity})`);
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const paintCorridor = (x1, y1, x2, y2) => {
    ctx.strokeStyle = 'rgba(255, 205, 110, 0.5)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // Major global urban networks
  paintCityNode(295, 138, 22, 1.2);
  paintCityNode(255, 142, 16, 1.0);
  paintCityNode(175, 160, 15, 1.0);
  paintCityNode(168, 145, 12, 0.9);
  paintCityNode(260, 175, 14, 0.9);
  paintCityNode(285, 178, 12, 0.85);
  paintCorridor(295, 138, 255, 142);
  paintCorridor(255, 142, 260, 175);

  paintCityNode(515, 115, 14, 1.1);
  paintCityNode(522, 125, 14, 1.1);
  paintCityNode(535, 118, 18, 1.3);
  paintCityNode(510, 145, 12, 0.9);
  paintCityNode(542, 140, 13, 0.95);
  paintCityNode(550, 112, 12, 0.9);
  paintCityNode(615, 105, 16, 1.0);
  paintCorridor(515, 115, 522, 125);
  paintCorridor(522, 125, 535, 118);

  paintCityNode(915, 152, 24, 1.5);
  paintCityNode(895, 158, 16, 1.2);
  paintCityNode(875, 148, 16, 1.2);
  paintCityNode(860, 165, 20, 1.3);
  paintCityNode(845, 142, 18, 1.2);
  paintCityNode(838, 192, 22, 1.4);
  paintCityNode(865, 185, 12, 0.9);
  paintCorridor(915, 152, 895, 158);
  paintCorridor(860, 165, 838, 192);

  paintCityNode(735, 175, 20, 1.2);
  paintCityNode(720, 205, 16, 1.1);
  paintCityNode(745, 220, 14, 1.0);
  paintCityNode(605, 180, 14, 1.1);
  paintCityNode(545, 172, 18, 1.3);
  paintCorridor(545, 172, 545, 215);

  paintCityNode(380, 318, 18, 1.2);
  paintCityNode(345, 355, 16, 1.1);
  paintCityNode(310, 345, 12, 0.9);
  paintCityNode(595, 335, 14, 1.0);
  paintCityNode(945, 350, 14, 1.0);
  paintCityNode(925, 362, 13, 0.95);

  for (let i = 0; i < 600; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 512;
    if (ry > 95 && ry < 240 && Math.random() > 0.4) {
      ctx.fillStyle = `rgba(255, 210, 115, ${Math.random() * 0.45})`;
      ctx.fillRect(rx, ry, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

function createEarthCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    for (let x = 0; x < 1024; x++) {
      const lon = (x / 1024) * Math.PI * 2;
      const idx = (y * 1024 + x) * 4;

      const nx = Math.cos(lon) * cosLat;
      const ny = Math.sin(lat);
      const nz = Math.sin(lon) * cosLat;

      const cloudNoise = noise.fbm2D(nx * 3.2, ny * 3.2 + nz * 3.2, 5, 0.55, 2.1);
      const itcz = Math.exp(-Math.pow(lat / 0.35, 2.0)) * 0.25;
      const density = Math.max(0, cloudNoise + itcz - 0.12) / 0.88;
      const alpha = Math.min(255, Math.floor(Math.pow(density, 1.4) * 245));

      d[idx] = 255; d[idx + 1] = 255; d[idx + 2] = 255; d[idx + 3] = alpha;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createMercuryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    for (let x = 0; x < 1024; x++) {
      const lon = (x / 1024) * Math.PI * 2;
      const idx = (y * 1024 + x) * 4;
      const nx = Math.cos(lon) * cosLat;
      const ny = Math.sin(lat);
      const nz = Math.sin(lon) * cosLat;
      const baseAlbedo = noise.fbm2D(nx * 2.5, ny * 2.5 + nz * 2.5, 6, 0.5, 2.0);
      const tone = 0.48 + baseAlbedo * 0.38;
      const byteVal = Math.min(255, Math.max(45, Math.floor(tone * 255)));
      d[idx] = byteVal; d[idx + 1] = Math.floor(byteVal * 0.98); d[idx + 2] = Math.floor(byteVal * 0.95); d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    const cosLat = Math.cos(lat);
    for (let x = 0; x < 1024; x++) {
      const lon = (x / 1024) * Math.PI * 2;
      const idx = (y * 1024 + x) * 4;
      const nx = Math.cos(lon) * cosLat;
      const ny = Math.sin(lat);
      const nz = Math.sin(lon) * cosLat;
      const elevation = noise.fbm2D(nx * 2.2 + 5.0, ny * 2.2 + nz * 2.2, 6, 0.52, 2.0);
      const isPolarCap = (Math.abs(lat) / (Math.PI * 0.5)) > 0.85;

      let r, g, b;
      if (isPolarCap) {
        r = 250; g = 252; b = 255;
      } else if (elevation < -0.05) {
        r = 95; g = 50; b = 35;
      } else {
        r = Math.floor(225 + elevation * 30);
        g = Math.floor(105 + elevation * 25);
        b = Math.floor(55 + elevation * 15);
      }
      d[idx] = Math.min(255, Math.max(0, r));
      d[idx + 1] = Math.min(255, Math.max(0, g));
      d[idx + 2] = Math.min(255, Math.max(0, b));
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.strokeStyle = 'rgba(60, 25, 15, 0.9)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(380, 260);
  ctx.quadraticCurveTo(460, 275, 540, 265);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const turb = noise.fbm2D((x / 1024) * 18.0, lat * 8.0, 5, 0.55, 2.1);
      const bandWave = Math.sin(lat * 18.0 + turb * 1.5) * 0.5 + 0.5;

      let r, g, b;
      if (Math.abs(lat) > 1.1) {
        r = Math.floor(155 + turb * 40); g = Math.floor(145 + turb * 35); b = Math.floor(130 + turb * 30);
      } else if (bandWave > 0.55) {
        r = Math.floor(248 + turb * 8); g = Math.floor(232 + turb * 12); b = Math.floor(210 + turb * 15);
      } else {
        r = Math.floor(195 + turb * 40); g = Math.floor(120 + turb * 30); b = Math.floor(75 + turb * 20);
      }
      d[idx] = Math.min(255, Math.max(0, r));
      d[idx + 1] = Math.min(255, Math.max(0, g));
      d[idx + 2] = Math.min(255, Math.max(0, b));
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const grsGrad = ctx.createRadialGradient(640, 320, 5, 640, 320, 65);
  grsGrad.addColorStop(0.0, 'rgba(215, 55, 28, 0.98)');
  grsGrad.addColorStop(0.5, 'rgba(235, 115, 55, 0.88)');
  grsGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(640, 320, 65, 38, -0.05, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const vNorm = y / 512;
    // Map y to latitude: lat in [-PI/2, +PI/2]
    const lat = (0.5 - vNorm) * Math.PI;
    const absLat = Math.abs(lat);

    for (let x = 0; x < 1024; x++) {
      const uNorm = x / 1024;
      const theta = uNorm * Math.PI * 2;
      const idx = (y * 1024 + x) * 4;

      // Multi-octave zonal turbulence
      const turb1 = noise.fbm2D(uNorm * 16.0, lat * 9.0, 4, 0.5, 2.0) * 0.08;
      const turb2 = noise.fbm2D(uNorm * 32.0 + 3.1, lat * 18.0, 3, 0.45, 2.2) * 0.04;
      const turb = turb1 + turb2;

      // Zonal harmonic waves
      const bandFine = Math.sin(lat * 36.0 + turb * 2.2) * 0.5 + 0.5;
      const bandBroad = Math.cos(lat * 10.0 + turb) * 0.5 + 0.5;

      let r = 185;
      let g = 160;
      let b = 115;

      if (lat > 1.26) {
        // NORTH POLAR HEXAGON & VORTEX
        // Standing wave of 6 lobes in azimuthal direction
        const hexWave = Math.cos(6.0 * theta) * 0.038;
        const hexDist = lat - (1.34 + hexWave);
        if (lat > 1.45) {
          // Central cyclonic storm eye
          r = 75 + Math.floor(turb * 20);
          g = 98 + Math.floor(turb * 25);
          b = 114 + Math.floor(turb * 30);
        } else if (Math.abs(hexDist) < 0.045) {
          // Hexagonal jet stream perimeter (slate-cyan / olive border)
          r = 95 + Math.floor(turb * 20);
          g = 122 + Math.floor(turb * 25);
          b = 138 + Math.floor(turb * 30);
        } else {
          // High-latitude olive-golden collar
          r = 145 + Math.floor(turb * 25);
          g = 138 + Math.floor(turb * 20);
          b = 110 + Math.floor(turb * 15);
        }
      } else if (absLat < 0.22) {
        // EQUATORIAL ZONE: Creamy butterscotch with convective storm plumes
        const plume = Math.sin(uNorm * 48.0 + turb * 3.5) * 12;
        r = Math.floor(214 + bandFine * 16 + plume);
        g = Math.floor(192 + bandFine * 12 + plume * 0.8);
        b = Math.floor(146 + bandFine * 8 + plume * 0.5);
      } else if (absLat < 0.52) {
        // TROPICAL & EQUATORIAL BELTS: Warm amber and terracotta
        r = Math.floor(174 + bandFine * 24 - bandBroad * 18 + turb * 35);
        g = Math.floor(144 + bandFine * 18 - bandBroad * 16 + turb * 28);
        b = Math.floor(96 + bandFine * 12 - bandBroad * 12 + turb * 20);
      } else if (absLat < 0.95) {
        // TEMPERATE BELTS: Golden honey and caramel
        r = Math.floor(188 + bandFine * 20 + bandBroad * 14 + turb * 25);
        g = Math.floor(160 + bandFine * 16 + bandBroad * 12 + turb * 20);
        b = Math.floor(116 + bandFine * 10 + bandBroad * 8 + turb * 15);
      } else {
        // SOUTH POLAR REGION: Olive-tan
        r = Math.floor(148 - bandFine * 14 + turb * 20);
        g = Math.floor(138 - bandFine * 12 + turb * 18);
        b = Math.floor(112 - bandFine * 8 + turb * 12);
      }

      d[idx] = Math.min(255, Math.max(0, r));
      d[idx + 1] = Math.min(255, Math.max(0, g));
      d[idx + 2] = Math.min(255, Math.max(0, b));
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createSaturnRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 64);
  const d = imgData.data;

  for (let x = 0; x < 1024; x++) {
    const u = x / 1024;
    let r, g, b, alpha;

    if (u < 0.05) {
      // Innermost D Ring haze
      r = 145; g = 135; b = 115;
      alpha = Math.floor(u * 20.0 * 25);
    } else if (u < 0.28) {
      // C Ring (Crepe Ring): semi-transparent dusky amber with fine ripples
      const ripple = Math.sin(u * 420.0) * 12 + Math.sin(u * 1150.0) * 6;
      r = Math.min(255, Math.floor(172 + ripple));
      g = Math.min(255, Math.floor(155 + ripple * 0.8));
      b = Math.min(255, Math.floor(125 + ripple * 0.6));
      alpha = Math.floor(65 + Math.sin(u * 80.0) * 20);
    } else if (u < 0.31) {
      // Maxwell & Colombo gap between C and B
      r = 18; g = 16; b = 14;
      alpha = 8;
    } else if (u < 0.69) {
      // B Ring (Main, Brightest Ring): dense, creamy ivory with hundreds of ringlets
      const fineRinglets = Math.sin(u * 580.0) * 16 + Math.sin(u * 1480.0) * 9 + Math.sin(u * 3200.0) * 5;
      r = Math.min(255, Math.floor(236 + fineRinglets * 0.5));
      g = Math.min(255, Math.floor(218 + fineRinglets * 0.45));
      b = Math.min(255, Math.floor(174 + fineRinglets * 0.35));
      alpha = 248;
    } else if (u < 0.76) {
      // CASSINI DIVISION (The prominent dark gap between B and A)
      r = 12; g = 12; b = 10;
      alpha = 4; // sharp dark void
    } else if (u < 0.95) {
      // A Ring: icy golden ring with Encke and Keeler gaps
      const isEncke = u > 0.865 && u < 0.884;
      const isKeeler = u > 0.932 && u < 0.940;
      if (isEncke || isKeeler) {
        r = 12; g = 12; b = 10;
        alpha = 6;
      } else {
        const ringlet = Math.sin(u * 460.0) * 14 + Math.sin(u * 1120.0) * 7;
        r = Math.min(255, Math.floor(214 + ringlet * 0.6));
        g = Math.min(255, Math.floor(196 + ringlet * 0.5));
        b = Math.min(255, Math.floor(156 + ringlet * 0.4));
        alpha = 205;
      }
    } else {
      // Outer F Ring boundary
      r = 165; g = 150; b = 125;
      alpha = Math.floor((1.0 - u) * 20.0 * 28);
    }

    for (let y = 0; y < 64; y++) {
      const idx = (y * 1024 + x) * 4;
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b;
      d[idx + 3] = Math.min(255, Math.max(0, alpha));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createNeptuneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const turb = noise.fbm2D((x / 1024) * 14.0, lat * 8.0, 5, 0.55, 2.0) * 0.15;
      const band = Math.sin(lat * 16.0 + turb) * 0.5 + 0.5;

      const r = Math.floor(25 + band * 20);
      const g = Math.floor(85 + band * 45);
      const b = Math.floor(205 + band * 45);
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.fillStyle = 'rgba(12, 35, 95, 0.85)';
  ctx.beginPath();
  ctx.ellipse(600, 310, 55, 28, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(240, 248, 255, 0.88)';
  ctx.beginPath();
  ctx.ellipse(605, 345, 42, 6, -0.06, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createUranusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const lat = ((y / 512) - 0.5) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const turb = noise.fbm2D((x / 1024) * 8.0, lat * 6.0, 4, 0.5, 2.0) * 0.08;
      const band = Math.sin(lat * 8.0 + turb) * 0.5 + 0.5;

      // Pale cyan / aquamarine ice giant palette with subtle methane haze
      const r = Math.floor(135 + band * 25);
      const g = Math.floor(212 + band * 22);
      const b = Math.floor(236 + band * 16);
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(512, 256);
  const d = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      const n = noise.fbm2D(x * 0.03, y * 0.03, 5, 0.5, 2.0);
      const val = n < -0.05 ? 75 + Math.floor(Math.random() * 20) : 185 + Math.floor(Math.random() * 40);
      d[idx] = val; d[idx + 1] = val; d[idx + 2] = val; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// 4. SCIENTIFIC GLSL SHADERS (SOLAR PLASMA, EARTH DAY-NIGHT & GARGANTUA LENSING)
// ============================================================================

const SunShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#FFF8EB') },
    uColorMid: { value: new THREE.Color('#FFAA1D') },
    uColorEdge: { value: new THREE.Color('#8C1800') },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorEdge;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec3 normPos = normalize(vPosition);
      float t = uTime * 0.18;
      float n1 = snoise(normPos * 3.8 + vec3(0.0, t * 0.6, t * 0.3));
      float n2 = snoise(normPos * 7.5 - vec3(t * 0.4, t * 0.8, 0.0));
      float plasma = (n1 * 0.6 + n2 * 0.4) * 0.5 + 0.5;

      // Realistic Solar Activity: Sunspot Active Latitudes (Spörer's law ±10° to ±35°)
      float lat = abs(normPos.y);
      float activeBand = smoothstep(0.10, 0.24, lat) * (1.0 - smoothstep(0.55, 0.72, lat));
      float spotNoise = snoise(normPos * 14.0 + vec3(t * 0.04, 0.0, 0.0));
      float spotNoise2 = snoise(normPos * 28.0);
      float spotVal = (spotNoise * 0.7 + spotNoise2 * 0.3);

      // Umbra (dark central core, T ~ 3800 K) & Penumbra (filamentary border, T ~ 5400 K)
      float umbra = smoothstep(0.58, 0.72, spotVal) * activeBand;
      float penumbra = smoothstep(0.42, 0.58, spotVal) * activeBand;
      float faculae = smoothstep(0.32, 0.42, spotVal) * activeBand * 0.65;

      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float mu = max(0.0, dot(vNormal, viewDir));
      float limbFactor = pow(mu, 0.62);

      vec3 color = mix(uColorMid, uColorCore, pow(plasma, 2.2) * 1.5);
      // Bright magnetic faculae surrounding spots
      color = mix(color, vec3(1.0, 0.98, 0.88), faculae);
      // Penumbra
      color = mix(color, vec3(0.42, 0.14, 0.02), penumbra);
      // Umbra
      color = mix(color, vec3(0.08, 0.015, 0.005), umbra);

      color = mix(uColorEdge, color, limbFactor);
      color += pow(mu, 3.5) * 0.35 * uColorCore;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const EarthDayNightShader = {
  uniforms: {
    uDayMap: { value: null },
    uNightMap: { value: null },
    uSunDir: { value: new THREE.Vector3(-0.38, 0.28, 0.88).normalize() },
    uUseCustomSunDir: { value: 1.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform sampler2D uDayMap;
    uniform sampler2D uNightMap;
    uniform vec3 uSunDir;
    uniform float uUseCustomSunDir;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = uUseCustomSunDir > 0.5 ? normalize(uSunDir) : normalize(-vWorldPosition);

      float nDotL = dot(normal, sunDir);
      float dayFactor = smoothstep(-0.18, 0.22, nDotL);
      float nightFactor = smoothstep(0.15, -0.18, nDotL);

      vec4 dayColor = texture2D(uDayMap, vUv);
      vec4 nightLights = texture2D(uNightMap, vUv);

      float isOcean = step(dayColor.r, 0.14) * (1.0 - step(dayColor.b, 0.25));
      vec3 halfVector = normalize(sunDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfVector)), 28.0) * isOcean * dayFactor;

      float diffuse = clamp(nDotL, 0.0, 1.0);
      vec3 litDay = dayColor.rgb * (diffuse * 0.92 + 0.10) + spec * 0.35 * vec3(0.85, 0.95, 1.0);
      vec3 nightSilhouette = dayColor.rgb * 0.04;
      vec3 litNight = nightSilhouette + nightLights.rgb * nightFactor * 1.5;

      vec3 finalColor = mix(litNight, litDay, dayFactor);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// PHOTOREALISTIC INTERSTELLAR (KIP THORNE) RELATIVISTIC ACCRETION DISK SHADER
const GargantuaDiskShader = {
  uniforms: {
    uTime: { value: 0 },
    uExposure: { value: 1.0 },
    uInnerRadius: { value: 8.6 },
    uOuterRadius: { value: 34.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec3 vWorldTangent;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec3 localTangent = normalize(vec3(-position.y, position.x, 0.0));
      vWorldTangent = normalize(mat3(modelMatrix) * localTangent);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uExposure;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying vec3 vWorldTangent;

    void main() {
      float r = length(vPosition.xy);
      if (r < uInnerRadius) {
        discard;
      }
      float angle = atan(vPosition.y, vPosition.x);

      // Relativistic Keplerian differential flow (inner plasma orbits much faster)
      float omega = 3.6 / pow(max(1.0, r * 0.15), 1.35);
      float flowAngle = angle - uTime * omega;

      // Turbulent plasma spiral streamers (MRI instability)
      float spiral = sin(flowAngle * 7.0 + r * 2.4) * cos(flowAngle * 3.0 - r * 1.6);
      float filament = sin(flowAngle * 16.0 + sin(r * 5.0));
      float plasma = 0.5 + 0.32 * spiral + 0.18 * filament;

      // Temperature gradient:
      // Inner edge (ISCO) is brilliant golden-white (~10^7 K)
      // Mid-disk is vibrant amber and solar orange
      // Outer disk cools down to deep cosmic crimson/terracotta
      float rNorm = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
      vec3 cHot = vec3(1.0, 0.94, 0.82);
      vec3 cMid = vec3(0.98, 0.50, 0.06);
      vec3 cCool = vec3(0.52, 0.08, 0.01);
      vec3 diskColor = mix(cHot, cMid, pow(rNorm, 0.70));
      diskColor = mix(diskColor, cCool, pow(rNorm, 2.0));

      // Relativistic Doppler Beaming (Kip Thorne effect):
      // Approaching plasma is brightened; receding side is dimmed
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float dopplerFactor = dot(normalize(vWorldTangent), -viewDir);
      float beaming = 1.0 + 0.50 * clamp(dopplerFactor, -1.0, 1.0);
      diskColor *= beaming;

      // Soft ISCO edge cutoff and outer fade
      float innerCut = smoothstep(uInnerRadius, uInnerRadius + 0.7, r);
      float outerFade = smoothstep(uOuterRadius, uOuterRadius - 4.5, r);
      float alpha = innerCut * outerFade * (0.80 + 0.20 * plasma);

      vec3 finalCol = diskColor * (0.88 * uExposure);
      gl_FragColor = vec4(finalCol, alpha * 0.94);
    }
  `
};

// EINSTEIN GRAVITATIONAL LENSING HALO SHADER (INTERSTELLAR BENT LIGHT ARCH)
const GravitationalLensingShader = {
  uniforms: {
    uTime: { value: 0 },
    uExposure: { value: 1.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uExposure;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - abs(dot(normalize(vNormal), viewDir));
      float intensity = pow(rim, 2.5);

      // Relativistic Doppler asymmetry across the Einstein halo arch
      float doppler = 1.0 + 0.32 * dot(normalize(vPosition), vec3(1.0, 0.0, 0.0));

      vec3 haloColor = mix(vec3(0.95, 0.42, 0.05), vec3(1.0, 0.86, 0.62), rim);
      vec3 finalHalo = haloColor * doppler * (0.82 * uExposure);
      gl_FragColor = vec4(finalHalo, intensity * 0.82);
    }
  `
};

// ============================================================================
// 5. MAIN OBSERVATORY COMPONENT
export default function SolarSystem({
  onSelectSubject,
  selectedSubjectId,
  lang = 'en',
  onNavigate,
  onOpenBooking,
  courses = [],
}) {
  const containerRef = useRef(null);
  const lineupLabelsRef = useRef({});
  const lineupUiTopRef = useRef(null);
  const lineupUiBottomRef = useRef(null);
  const [activePlanet, setActivePlanet] = useState(PLANET_SUBJECTS[3]); // Earth (Höhere Mathematik)
  const [viewVariant, setViewVariant] = useState('option3'); // 'option3' (Lineup -> Zoom) | 'orbital' (Planetarium)
  const [lineupZoomed, setLineupZoomed] = useState(false); // false = row of 7 planets, true = zoomed into clicked planet
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [archLevel, setArchLevel] = useState('solar'); // 'planetary' | 'solar' | 'galaxy'
  const [isRealScale, setIsRealScale] = useState(false);
  const [isGalacticDriftActive, setIsGalacticDriftActive] = useState(true);
  const [liveTelemetry, setLiveTelemetry] = useState({ rAU: '1.000 AU', velKms: '29.8 km/s', nuDeg: '0.0°' });
  const [cinemaMode, setCinemaMode] = useState(true);
  const [letterbox, setLetterbox] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [caption, setCaption] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);

  // Optical Telemetry & Glare Control State (Controls the Sun, Bloom, Ambient and Features)
  const [viewerSettings, setViewerSettings] = useState(DEFAULT_VIEWER_SETTINGS);
  
  // Physics & Magnetism States (Visual Physic mode & Magnetic Field mode)
  const [visualPhysicMode, setVisualPhysicMode] = useState(false); // Naturally deactivated by default
  const [magneticFieldMode, setMagneticFieldMode] = useState(false); // Naturally deactivated by default
  const [showMagnetMenu, setShowMagnetMenu] = useState(false);
  const [showDcl, setShowDcl] = useState(false);
  const [showMagnetosphere, setShowMagnetosphere] = useState(false);
  const [showAuroras, setShowAuroras] = useState(true);
  const [showParkerSpiral, setShowParkerSpiral] = useState(false);
  const [isCmeActive, setIsCmeActive] = useState(false);
  const [magneticPolarity, setMagneticPolarity] = useState(1); // 1 = Normal, -1 = Reversed
  const [isReversing, setIsReversing] = useState(false);
  const [cmeToast, setCmeToast] = useState(null);
  const [activePhysicsTab, setActivePhysicsTab] = useState('syllabus'); // 'syllabus' | 'dcl' | 'magnetism' | 'nuclear'

  const audioRef = useRef(null);

  const activeCourse = useMemo(() => {
    if (!activePlanet) return courses[0] || null;
    return (
      courses.find((c) => c.id === activePlanet.courseId) ||
      courses.find((c) => c.planetId === activePlanet.id) ||
      courses[0] ||
      null
    );
  }, [activePlanet, courses]);

  const animStateRef = useRef({
    activePlanet: PLANET_SUBJECTS[3],
    viewVariant: 'option3',
    lineupZoomed: false,
    triggerIntroReplay: false,
    isPaused: false,
    speedMultiplier: 1,
    archLevel: 'solar',
    isRealScale: false,
    isGalacticDriftActive: true,
    galacticAngle: 0.85,
    isTransitioning: true,
    cinemaMode: true,
    shot: null,
    autoOrbit: false,
    visualPhysicMode: false,
    magneticFieldMode: false,
    showDcl: false,
    showMagnetosphere: false,
    showAuroras: true,
    showParkerSpiral: false,
    isCmeActive: false,
    cmeProgress: 0.0,
    magneticPolarity: 1,
    isReversing: false,
    reversalProgress: 0.0,
    viewerSettings: DEFAULT_VIEWER_SETTINGS,
  });

  useEffect(() => {
    animStateRef.current.viewerSettings = viewerSettings;
  }, [viewerSettings]);

  const replayIntroAnimation = () => {
    setIsRealScale(false);
    setViewVariant('option3');
    setLineupZoomed(false);
    setIntroDone(false);
    animStateRef.current.isRealScale = false;
    animStateRef.current.viewVariant = 'option3';
    animStateRef.current.lineupZoomed = false;
    animStateRef.current.triggerIntroReplay = true;
    animStateRef.current.isTransitioning = true;
  };

  useEffect(() => {
    animStateRef.current.viewVariant = viewVariant;
    animStateRef.current.isTransitioning = true;
    setTimeout(() => window.dispatchEvent(new Event('resize')), 40);
  }, [viewVariant]);

  useEffect(() => {
    animStateRef.current.lineupZoomed = lineupZoomed;
    animStateRef.current.isTransitioning = true;
  }, [lineupZoomed]);

  useEffect(() => {
    animStateRef.current.cinemaMode = cinemaMode;
  }, [cinemaMode]);

  useEffect(() => {
    animStateRef.current.visualPhysicMode = visualPhysicMode;
    animStateRef.current.showDcl = visualPhysicMode;
  }, [visualPhysicMode]);

  useEffect(() => {
    animStateRef.current.magneticFieldMode = magneticFieldMode;
    animStateRef.current.showMagnetosphere = magneticFieldMode;
  }, [magneticFieldMode]);

  useEffect(() => {
    animStateRef.current.showDcl = showDcl;
  }, [showDcl]);

  useEffect(() => {
    animStateRef.current.showMagnetosphere = showMagnetosphere;
  }, [showMagnetosphere]);

  useEffect(() => {
    animStateRef.current.showAuroras = showAuroras;
  }, [showAuroras]);

  useEffect(() => {
    animStateRef.current.showParkerSpiral = showParkerSpiral;
  }, [showParkerSpiral]);

  useEffect(() => {
    animStateRef.current.isCmeActive = isCmeActive;
  }, [isCmeActive]);

  useEffect(() => {
    animStateRef.current.magneticPolarity = magneticPolarity;
  }, [magneticPolarity]);

  useEffect(() => {
    animStateRef.current.isReversing = isReversing;
  }, [isReversing]);

  const triggerCME = () => {
    setIsCmeActive(true);
    animStateRef.current.isCmeActive = true;
    animStateRef.current.cmeProgress = 0.0;
    if (audioRef.current && audioOn) {
      audioRef.current.swell();
    }
    setCmeToast(lang === 'en' ? '🌪️ CORONAL MASS EJECTION (CME) BLAST DETECTED: 1,200 km/s' : '🌪️ EYECCIÓN DE MASA CORONAL (CME) DISPARADA: 1.200 km/s HACIA LA TIERRA');
    setTimeout(() => setCmeToast(null), 6500);
  };

  const triggerGeomagneticReversal = () => {
    setIsReversing(true);
    animStateRef.current.isReversing = true;
    animStateRef.current.reversalProgress = 0.0;
    setCmeToast(lang === 'en' ? '🔄 GEOMAGNETIC REVERSAL TRIGGERED: DIPOLE COLLAPSE & MULTIPOLE EXCURSION' : '🔄 INVERSIÓN GEOMAGNÉTICA EN CURSO: COLAPSO DEL DIPOLO Y FASE MULTIPOLAR CAÓTICA');
    setTimeout(() => setCmeToast(null), 6500);
  };

  // Cinematic scientific subtitles (only in orbital mode)
  useEffect(() => {
    if (!introDone || viewVariant !== 'orbital') {
      setCaption(null);
      return;
    }
    const en = lang === 'en';
    const bodyName = activePlanet.name.split(' (')[0];
    let title;
    let sub;
    if (archLevel === 'galaxy') {
      title = 'Sagittarius A*';
      sub = en ? '4.15 × 10⁶ M☉ · 26,000 light-years' : '4.15 × 10⁶ M☉ · 26 000 años luz';
    } else if (archLevel === 'solar') {
      title = en ? 'Solar System' : 'Sistema Solar';
      sub = '1 AU = 149 597 870 km';
    } else {
      title = bodyName;
      sub = activePlanet.spectralClass;
    }
    if (isRealScale) sub += ' · 1:1';
    setCaption({ key: `${archLevel}-${activePlanet.id}-${isRealScale}-${Date.now()}`, title, sub });
  }, [archLevel, activePlanet.id, isRealScale, introDone, lang, viewVariant]);

  // Ambient audio follows the architectural level
  useEffect(() => {
    if (audioRef.current && audioOn) {
      audioRef.current.setLevel(archLevel);
      audioRef.current.swell();
    }
  }, [archLevel, audioOn]);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createAmbientEngine();
      if (!audioRef.current) return;
    }
    if (audioOn) {
      audioRef.current.stop();
      setAudioOn(false);
    } else {
      audioRef.current.setLevel(archLevel);
      audioRef.current.start();
      setAudioOn(true);
    }
  };

  const triggerShot = (shot) => {
    const st = animStateRef.current;
    if (shot === 'gargantua') {
      setArchLevel('galaxy');
      setActivePlanet(PLANET_SUBJECTS.find((p) => p.id === 'blackhole') || PLANET_SUBJECTS[3]);
      st.autoOrbit = true;
    } else if (shot === 'ecliptic') {
      setArchLevel('solar');
      st.autoOrbit = false;
    } else {
      // backlit: needs a solid body lit by the Sun
      const current = animStateRef.current.activePlanet;
      if (current.id === 'sun' || current.id === 'blackhole') {
        setActivePlanet(PLANET_SUBJECTS[3]);
      }
      setArchLevel('planetary');
      st.autoOrbit = false;
    }
    st.shot = shot;
    st.isTransitioning = true;
  };

  useEffect(() => {
    animStateRef.current.activePlanet = activePlanet;
  }, [activePlanet]);

  useEffect(() => {
    animStateRef.current.isPaused = isPaused;
  }, [isPaused]);

  useEffect(() => {
    animStateRef.current.speedMultiplier = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    animStateRef.current.archLevel = archLevel;
  }, [archLevel]);

  useEffect(() => {
    animStateRef.current.isRealScale = isRealScale;
  }, [isRealScale]);

  useEffect(() => {
    animStateRef.current.isGalacticDriftActive = isGalacticDriftActive;
  }, [isGalacticDriftActive]);

  useEffect(() => {
    if (selectedSubjectId) {
      const match = PLANET_SUBJECTS.find(p => p.courseId === selectedSubjectId || p.id === selectedSubjectId);
      if (match && match.id !== activePlanet.id) {
        handleSelectPlanet(match, false);
      }
    }
  }, [selectedSubjectId]);

  const handleSelectPlanet = (planet, fromUserClick = true) => {
    setActivePlanet(planet);
    animStateRef.current.activePlanet = planet;
    animStateRef.current.isTransitioning = true;
    if (fromUserClick && animStateRef.current.viewVariant === 'option3') {
      setLineupZoomed(true);
      animStateRef.current.lineupZoomed = true;
    }
    if (planet.id === 'blackhole') {
      setArchLevel('galaxy');
    } else if (planet.id === 'sun') {
      setArchLevel('solar');
    } else {
      setArchLevel('planetary');
    }
    if (onSelectSubject) {
      onSelectSubject(planet);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010204);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 85000);
    camera.position.set(0, 48, 70);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
      });
    } catch (e) {
      console.warn('WebGL is not supported or failed to initialize:', e);
      const fallback = document.createElement('div');
      fallback.className = 'w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-950 p-6 text-center select-none';
      fallback.innerHTML = `
        <div class="text-4xl mb-3">🪐</div>
        <p class="font-mono text-sm text-slate-300 mb-1">WebGL 3D Solar System</p>
        <p class="text-xs text-slate-500">Hardware acceleration or WebGL is required to render the interactive 3D planetary model.</p>
      `;
      container.appendChild(fallback);
      return () => {
        if (container.contains(fallback)) container.removeChild(fallback);
      };
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 65000;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.target.set(0, 0, 0);

    controls.addEventListener('start', () => {
      animStateRef.current.isTransitioning = false;
      animStateRef.current.shot = null;
      animStateRef.current.autoOrbit = false;
    });

    // ========================================================================
    // CELESTIAL BACKGROUND: COSMIC NEBULA SKY DOME & DUAL-TIER STARFIELD
    // ========================================================================
    const cosmicNebulaTex = createCosmicNebulaTexture();
    const skyDomeGeo = new THREE.SphereGeometry(12000, 48, 32);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      map: cosmicNebulaTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    scene.add(skyDome);

    // 1. High-Density Pinpoint Starfield (7,200 stars with Spectral Colors)
    const starSprite = createStarSpriteTexture();
    const starCount = 7200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const spectralColors = [
      new THREE.Color(0.72, 0.84, 1.0),  // O/B: Bluish-white (hot stars)
      new THREE.Color(0.88, 0.94, 1.0),  // A: Brilliant pure white (Vega, Sirius)
      new THREE.Color(0.98, 0.98, 0.94),  // F: Soft yellowish-white
      new THREE.Color(1.0, 0.94, 0.82),  // G: Solar warm golden (Sun, Alpha Centauri)
      new THREE.Color(1.0, 0.80, 0.58),  // K: Orange (Arcturus)
      new THREE.Color(1.0, 0.58, 0.42),  // M: Red giant (Betelgeuse, Antares)
      new THREE.Color(0.60, 0.90, 1.0),  // Cyan celestial accent
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 2500 + Math.random() * 4500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorPick = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      // Calibrated brightness for crisp starry contrast
      const brightness = 0.50 + Math.pow(Math.random(), 2.8) * 0.50;
      starColors[i * 3] = colorPick.r * brightness;
      starColors[i * 3 + 1] = colorPick.g * brightness;
      starColors[i * 3 + 2] = colorPick.b * brightness;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      sizeAttenuation: false, // Ensures pinpoint razor-sharp stars on all displays & zooms
      map: starSprite,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 2. Bright Navigational Stars with 4-Point Diffraction Glint (~450 stars)
    const brightStarSprite = createBrightStarSpriteTexture();
    const brightStarCount = 450;
    const brightStarGeo = new THREE.BufferGeometry();
    const brightStarPositions = new Float32Array(brightStarCount * 3);
    const brightStarColors = new Float32Array(brightStarCount * 3);

    for (let i = 0; i < brightStarCount; i++) {
      const radius = 2400 + Math.random() * 4000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      brightStarPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      brightStarPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      brightStarPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorPick = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      const brightness = 0.70 + Math.random() * 0.30;
      brightStarColors[i * 3] = colorPick.r * brightness;
      brightStarColors[i * 3 + 1] = colorPick.g * brightness;
      brightStarColors[i * 3 + 2] = colorPick.b * brightness;
    }

    brightStarGeo.setAttribute('position', new THREE.BufferAttribute(brightStarPositions, 3));
    brightStarGeo.setAttribute('color', new THREE.BufferAttribute(brightStarColors, 3));

    const brightStarMat = new THREE.PointsMaterial({
      size: 5.5,
      sizeAttenuation: false,
      map: brightStarSprite,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const brightStarPoints = new THREE.Points(brightStarGeo, brightStarMat);
    scene.add(brightStarPoints);

    // ========================================================================
    // LIGHTING SYSTEM (HDR Calibrated Anti-Glare Baseline)
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0xDCE8FC, DEFAULT_VIEWER_SETTINGS.ambientIntensity);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF8EB, 0x1E293B, DEFAULT_VIEWER_SETTINGS.ambientIntensity * 0.75);
    scene.add(hemiLight);

    // ========================================================================
    // 1. GALACTIC CENTER: SAGITTARIUS A* (PHOTOREALISTIC KIP THORNE INTERSTELLAR)
    // ========================================================================
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.position.set(0, 0, 0);
    scene.add(blackHoleGroup);

    // 1.1 Event Horizon (Absolute Singularity Shadow)
    const sgrGeo = new THREE.SphereGeometry(7.0, 64, 64);
    const sgrMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sgrMesh = new THREE.Mesh(sgrGeo, sgrMat);
    sgrMesh.renderOrder = 2;
    blackHoleGroup.add(sgrMesh);

    // 1.2 Relativistic Photon Ring (Thin brilliant filament at edge of shadow)
    const photonRingGeo = new THREE.TorusGeometry(7.22, 0.08, 32, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xFFAA44,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.rotation.x = Math.PI / 2;
    blackHoleGroup.add(photonRing);

    // 1.3 Horizontal Relativistic Doppler Accretion Disk
    const diskGeo = new THREE.RingGeometry(8.6, 34.0, 128, 8);
    const diskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: DEFAULT_VIEWER_SETTINGS.sgrExposure },
        uInnerRadius: { value: 8.6 },
        uOuterRadius: { value: 34.0 },
      },
      vertexShader: GargantuaDiskShader.vertexShader,
      fragmentShader: GargantuaDiskShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.rotation.x = Math.PI / 2 + 0.18;
    diskMesh.rotation.z = 0.25;
    blackHoleGroup.add(diskMesh);

    // 1.4 Einstein Gravitational Lensing Halo (The Iconic Interstellar Curved Arch)
    const lensingArchGeo = new THREE.TorusGeometry(12.8, 1.25, 32, 128);
    const lensingArchMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: DEFAULT_VIEWER_SETTINGS.sgrExposure },
      },
      vertexShader: GravitationalLensingShader.vertexShader,
      fragmentShader: GravitationalLensingShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const lensingArchMesh = new THREE.Mesh(lensingArchGeo, lensingArchMat);
    lensingArchMesh.rotation.y = 0.28;
    lensingArchMesh.rotation.x = 0.16;
    blackHoleGroup.add(lensingArchMesh);

    // 1.5 Relativistic Bipolar Jets
    const jetGeo = new THREE.CylinderGeometry(0.8, 5.5, 78, 32, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const jetMeshNorth = new THREE.Mesh(jetGeo, jetMat);
    jetMeshNorth.position.y = 44;
    jetMeshNorth.rotation.x = 0.18;
    blackHoleGroup.add(jetMeshNorth);

    const jetMeshSouth = new THREE.Mesh(jetGeo, jetMat);
    jetMeshSouth.position.y = -44;
    jetMeshSouth.rotation.x = Math.PI - 0.18;
    blackHoleGroup.add(jetMeshSouth);

    // 1.6 S-Star Nuclear Star Cluster
    const sStarCount = 1200;
    const sStarGeo = new THREE.BufferGeometry();
    const sStarPositions = new Float32Array(sStarCount * 3);
    const sStarColors = new Float32Array(sStarCount * 3);
    const sStarSpeeds = new Float32Array(sStarCount);
    const sStarRadii = new Float32Array(sStarCount);
    const sStarAngles = new Float32Array(sStarCount);
    const sStarIncs = new Float32Array(sStarCount);

    for (let i = 0; i < sStarCount; i++) {
      const rad = 11.0 + Math.pow(Math.random(), 2.2) * 58.0;
      const angle = Math.random() * Math.PI * 2;
      const inc = (Math.random() - 0.5) * Math.PI * 0.85;

      sStarRadii[i] = rad;
      sStarAngles[i] = angle;
      sStarIncs[i] = inc;
      sStarSpeeds[i] = 1.6 / Math.sqrt(rad);

      sStarPositions[i * 3] = rad * Math.cos(angle);
      sStarPositions[i * 3 + 1] = rad * Math.sin(inc) * Math.sin(angle);
      sStarPositions[i * 3 + 2] = rad * Math.cos(inc) * Math.sin(angle);

      const isBlue = Math.random() > 0.35;
      sStarColors[i * 3] = isBlue ? 0.75 : 1.0;
      sStarColors[i * 3 + 1] = isBlue ? 0.85 : 0.8;
      sStarColors[i * 3 + 2] = isBlue ? 1.0 : 0.55;
    }

    sStarGeo.setAttribute('position', new THREE.BufferAttribute(sStarPositions, 3));
    sStarGeo.setAttribute('color', new THREE.BufferAttribute(sStarColors, 3));

    const sStarMat = new THREE.PointsMaterial({
      size: 2.2,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sStarPoints = new THREE.Points(sStarGeo, sStarMat);
    blackHoleGroup.add(sStarPoints);

    // Galactic Orbit Line for the Solar System around Sagittarius A*
    const galOrbitRes = 180;
    const galOrbitRadiusBalanced = 320;
    const galOrbitPoints = [];
    for (let i = 0; i <= galOrbitRes; i++) {
      const th = (i / galOrbitRes) * Math.PI * 2;
      const gx = galOrbitRadiusBalanced * Math.cos(th);
      const gz = galOrbitRadiusBalanced * Math.sin(th);
      const gy = Math.sin(th * 2.8) * 8.0;
      galOrbitPoints.push(new THREE.Vector3(gx, gy, gz));
    }
    const galOrbitGeo = new THREE.BufferGeometry().setFromPoints(galOrbitPoints);
    const galOrbitMat = new THREE.LineBasicMaterial({
      color: 0xC084FC,
      transparent: true,
      opacity: 0.25,
    });
    const galOrbitLine = new THREE.LineLoop(galOrbitGeo, galOrbitMat);
    scene.add(galOrbitLine);

    // ========================================================================
    // 2. SOLAR SYSTEM HIERARCHY & SHOWCASE LIGHTING
    // ========================================================================
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    const sunAnchor = new THREE.Group();
    solarSystemGroup.add(sunAnchor);

    // Front-angled directional light for the 7-planet side-by-side showcase (Calibrated HDR)
    const showcaseDirLight = new THREE.DirectionalLight(0xFFFBF2, 1.4);
    showcaseDirLight.position.set(-14, 22, 42);
    scene.add(showcaseDirLight);

    // 3D Active Selection Halo Ring for Lineup Mode
    const selectionHaloGroup = new THREE.Group();
    scene.add(selectionHaloGroup);
    const haloRingGeo = new THREE.RingGeometry(2.35, 2.52, 64);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloRingMesh = new THREE.Mesh(haloRingGeo, haloRingMat);
    selectionHaloGroup.add(haloRingMesh);

    const haloOuterGeo = new THREE.RingGeometry(2.68, 2.74, 64);
    const haloOuterMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloOuterMesh = new THREE.Mesh(haloOuterGeo, haloOuterMat);
    selectionHaloGroup.add(haloOuterMesh);

    // Sun Point Light (Anti-Glare Calibrated)
    const sunLight = new THREE.PointLight(0xFFFBF0, DEFAULT_VIEWER_SETTINGS.sunIntensity, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.bias = -0.0002;
    sunAnchor.add(sunLight);

    // Sun Mesh & Corona
    const sunUniforms = {
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color('#FFF8EB') },
      uColorMid: { value: new THREE.Color('#FFAA1D') },
      uColorEdge: { value: new THREE.Color('#8C1800') },
    };

    const sunGeo = new THREE.SphereGeometry(3.4, 64, 64);
    const sunMat = new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: SunShader.vertexShader,
      fragmentShader: SunShader.fragmentShader,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData.planetData = PLANET_SUBJECTS[0];
    sunAnchor.add(sunMesh);

    const coronaGeo = new THREE.SphereGeometry(3.9, 48, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xFFA500,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.userData.planetData = PLANET_SUBJECTS[0];
    sunAnchor.add(coronaMesh);

    const streakTex = createAnamorphicStreakTexture();
    const streakMat = new THREE.SpriteMaterial({
      map: streakTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const streakSprite = new THREE.Sprite(streakMat);
    streakSprite.scale.set(34, 1.8, 1);
    sunAnchor.add(streakSprite);

    // Solar Galactic Beacon Marker (Visible from Galaxy Scale)
    const sunBeaconMat = new THREE.SpriteMaterial({
      map: starSprite,
      color: 0xFFB703,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
    });
    const sunBeacon = new THREE.Sprite(sunBeaconMat);
    sunBeacon.scale.set(16, 16, 1);
    sunAnchor.add(sunBeacon);

    // ========================================================================
    // 1B. 3D CORONAL MAGNETIC PROMINENCE LOOPS (SOLAR ACTIVE REGIONS)
    // ========================================================================
    const coronalLoopsGroup = new THREE.Group();
    const loopConfigs = [
      { p1: new THREE.Vector3(2.6, 1.3, 1.4), p2: new THREE.Vector3(2.2, 1.5, 2.0), apex: 4.6 },
      { p1: new THREE.Vector3(-2.5, -1.1, 1.6), p2: new THREE.Vector3(-2.1, -1.4, 2.1), apex: 4.5 },
      { p1: new THREE.Vector3(1.6, 1.6, -2.6), p2: new THREE.Vector3(2.2, 1.2, -2.4), apex: 4.7 },
      { p1: new THREE.Vector3(-1.9, 1.4, -2.4), p2: new THREE.Vector3(-1.3, 1.7, -2.5), apex: 4.65 },
      { p1: new THREE.Vector3(2.7, -1.0, -1.4), p2: new THREE.Vector3(2.3, -1.3, -1.9), apex: 4.55 },
      { p1: new THREE.Vector3(-2.6, 1.1, 1.3), p2: new THREE.Vector3(-2.2, 1.5, 1.8), apex: 4.5 },
    ];
    loopConfigs.forEach((cfg) => {
      const mid = new THREE.Vector3().addVectors(cfg.p1, cfg.p2).multiplyScalar(0.5).normalize().multiplyScalar(cfg.apex);
      const curve = new THREE.QuadraticBezierCurve3(cfg.p1, mid, cfg.p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xFDBA74,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      coronalLoopsGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
    });
    sunAnchor.add(coronalLoopsGroup);

    // ========================================================================
    // 1C. CORONAL MASS EJECTION (CME) BLAST WAVE & HIGH-ENERGY PARTICLES
    // ========================================================================
    const cmeGroup = new THREE.Group();
    cmeGroup.visible = false;
    const cmeGeo = new THREE.RingGeometry(1.2, 3.2, 48);
    const cmeMat = new THREE.MeshBasicMaterial({
      color: 0xF97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const cmeMesh = new THREE.Mesh(cmeGeo, cmeMat);
    cmeMesh.rotation.x = Math.PI / 2;
    cmeGroup.add(cmeMesh);

    const cmeParticleCount = 280;
    const cmeParticleGeo = new THREE.BufferGeometry();
    const cmePositions = new Float32Array(cmeParticleCount * 3);
    for (let i = 0; i < cmeParticleCount; i++) {
      const rad = 2.0 + Math.random() * 2.8;
      const theta = (Math.random() - 0.5) * 1.5;
      const phi = (Math.random() - 0.5) * 0.7;
      cmePositions[i * 3] = rad * Math.cos(theta) * Math.cos(phi);
      cmePositions[i * 3 + 1] = rad * Math.sin(phi);
      cmePositions[i * 3 + 2] = rad * Math.sin(theta) * Math.cos(phi);
    }
    cmeParticleGeo.setAttribute('position', new THREE.BufferAttribute(cmePositions, 3));
    const cmeParticleMat = new THREE.PointsMaterial({
      color: 0xFDE047,
      size: 0.38,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const cmeParticles = new THREE.Points(cmeParticleGeo, cmeParticleMat);
    cmeGroup.add(cmeParticles);
    sunAnchor.add(cmeGroup);

    // ========================================================================
    // 1D. PARKER SPIRAL: INTERPLANETARY MAGNETIC FIELD (IMF)
    // ========================================================================
    const parkerGroup = new THREE.Group();
    parkerGroup.visible = false;
    const spiralArms = 4;
    const ptsPerArm = 160;
    for (let arm = 0; arm < spiralArms; arm++) {
      const pts = [];
      const theta0 = (arm / spiralArms) * Math.PI * 2;
      for (let s = 0; s <= ptsPerArm; s++) {
        const r = 3.6 + (s / ptsPerArm) * 72.0;
        const theta = theta0 - 0.155 * r;
        pts.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
      }
      const armGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const armMat = new THREE.LineBasicMaterial({
        color: 0xFBBF24,
        transparent: true,
        opacity: 0.38,
      });
      parkerGroup.add(new THREE.Line(armGeo, armMat));
    }
    sunAnchor.add(parkerGroup);

    // ========================================================================
    // 1E. SOLAR GLOBAL MAGNETIC FIELD (DIPOLE LOOPS, OPEN POLAR LINES & STREAMERS)
    // ========================================================================
    const solarMagneticGroup = new THREE.Group();
    solarMagneticGroup.visible = false;

    // A. Global Poloidal Dipole Magnetic Field Lines: r = L * sin^2(theta)
    const solarDipoleL = [5.2, 8.2, 12.0, 16.5, 22.0];
    const solarPlanesCount = 10;
    const solarDipoleLines = [];
    solarDipoleL.forEach((L) => {
      for (let pl = 0; pl < solarPlanesCount; pl++) {
        const phi = (pl / solarPlanesCount) * Math.PI * 2;
        const pts = [];
        for (let st = 0; st <= 48; st++) {
          const theta = 0.18 + (st / 48) * (Math.PI - 0.36);
          const rL = L * Math.sin(theta) * Math.sin(theta);
          const xL = rL * Math.sin(theta) * Math.cos(phi);
          const yL = rL * Math.cos(theta); // Magnetic axis
          const zL = rL * Math.sin(theta) * Math.sin(phi);
          pts.push(new THREE.Vector3(xL, yL, zL));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xF59E0B, // Solar Magnetic Amber
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
        });
        const dLine = new THREE.Line(lineGeo, lineMat);
        solarDipoleLines.push(dLine);
        solarMagneticGroup.add(dLine);
      }
    });

    // B. Open Polar Magnetic Field Lines (Polar Coronal Holes)
    const polarOpenCount = 16;
    for (let p = 0; p < polarOpenCount; p++) {
      const phi = (p / polarOpenCount) * Math.PI * 2;
      // North polar open funnel
      const ptsN = [];
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        const rH = 0.8 + t * 4.5;
        const yH = 2.8 + t * 24.0;
        ptsN.push(new THREE.Vector3(rH * Math.cos(phi), yH, rH * Math.sin(phi)));
      }
      const geoN = new THREE.BufferGeometry().setFromPoints(ptsN);
      const matN = new THREE.LineBasicMaterial({
        color: 0xFBBF24,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      solarMagneticGroup.add(new THREE.Line(geoN, matN));

      // South polar open funnel
      const ptsS = [];
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        const rH = 0.8 + t * 4.5;
        const yH = -2.8 - t * 24.0;
        ptsS.push(new THREE.Vector3(rH * Math.cos(phi), yH, rH * Math.sin(phi)));
      }
      const geoS = new THREE.BufferGeometry().setFromPoints(ptsS);
      solarMagneticGroup.add(new THREE.Line(geoS, matN));
    }

    // C. Solar Wind Outflowing Charged Particles
    const solarWindCount = 260;
    const solarWindGeo = new THREE.BufferGeometry();
    const solarWindPos = new Float32Array(solarWindCount * 3);
    const solarWindVels = [];
    for (let i = 0; i < solarWindCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2
      ).normalize();
      const r = 3.2 + Math.random() * 35.0;
      solarWindPos[i * 3] = dir.x * r;
      solarWindPos[i * 3 + 1] = dir.y * r;
      solarWindPos[i * 3 + 2] = dir.z * r;
      solarWindVels.push({ dir, speed: 0.18 + Math.random() * 0.22 });
    }
    solarWindGeo.setAttribute('position', new THREE.BufferAttribute(solarWindPos, 3));
    const solarWindMat = new THREE.PointsMaterial({
      color: 0xFDE047,
      size: 0.26,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const solarWindPoints = new THREE.Points(solarWindGeo, solarWindMat);
    solarMagneticGroup.add(solarWindPoints);

    sunAnchor.add(solarMagneticGroup);

    // ========================================================================
    // PLANETARY OBJECTS & ORBITAL MESHES
    // ========================================================================
    const planetObjects = [];
    const clickableMeshes = [sunMesh, coronaMesh];

    const bhData = PLANET_SUBJECTS.find(p => p.id === 'blackhole');
    if (bhData) {
      sgrMesh.userData.planetData = bhData;
      diskMesh.userData.planetData = bhData;
      lensingArchMesh.userData.planetData = bhData;
      clickableMeshes.push(sgrMesh, diskMesh, lensingArchMesh);
    }

    planetObjects.push({
      data: PLANET_SUBJECTS[0],
      mesh: sunMesh,
      anchor: sunAnchor,
      angle: 0,
      radius: 0,
    });

    const earthDayTex = createEarthDiffuseTexture();
    const earthNightTex = createEarthNightTexture();
    let earthShaderMatRef = null;

    PLANET_SUBJECTS.slice(1, -1).forEach((pData) => {
      const a = pData.distance;
      const e = pData.eccentricity;
      const inc = pData.inclination || 0;

      const orbitPoints = [];
      const orbitRes = 140;
      for (let s = 0; s <= orbitRes; s++) {
        const theta = (s / orbitRes) * Math.PI * 2;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
        const ox = r * Math.cos(theta);
        const oz = r * Math.sin(theta);
        const oy = -oz * Math.sin(inc);
        const ozTilted = oz * Math.cos(inc);
        orbitPoints.push(new THREE.Vector3(ox, oy, ozTilted));
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.22,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      solarSystemGroup.add(orbitLine);

      const planetAnchor = new THREE.Group();
      solarSystemGroup.add(planetAnchor);

      const axialTiltGroup = new THREE.Group();
      axialTiltGroup.rotation.z = THREE.MathUtils.degToRad(pData.axialTilt || 0);
      planetAnchor.add(axialTiltGroup);

      const pGeo = new THREE.SphereGeometry(pData.size, 48, 48);
      let pMesh;

      if (pData.id === 'earth') {
        const earthMat = new THREE.ShaderMaterial({
          uniforms: {
            uDayMap: { value: earthDayTex },
            uNightMap: { value: earthNightTex },
            uSunDir: { value: new THREE.Vector3(-0.38, 0.28, 0.88).normalize() },
            uUseCustomSunDir: { value: 1.0 },
          },
          vertexShader: EarthDayNightShader.vertexShader,
          fragmentShader: EarthDayNightShader.fragmentShader,
        });
        earthShaderMatRef = earthMat;
        pMesh = new THREE.Mesh(pGeo, earthMat);
      } else {
        let pTex;
        if (pData.id === 'mercury') pTex = createMercuryTexture();
        else if (pData.id === 'venus') pTex = createVenusTexture();
        else if (pData.id === 'moon') pTex = createMoonTexture();
        else if (pData.id === 'mars') pTex = createMarsTexture();
        else if (pData.id === 'jupiter') pTex = createJupiterTexture();
        else if (pData.id === 'saturn') pTex = createSaturnTexture();
        else if (pData.id === 'uranus') pTex = createUranusTexture();
        else if (pData.id === 'neptune') pTex = createNeptuneTexture();

        const pMat = new THREE.MeshStandardMaterial({
          map: pTex,
          roughness: 0.62,
          metalness: 0.04,
          emissive: new THREE.Color(0x060c18),
          emissiveIntensity: 0.10,
        });
        pMesh = new THREE.Mesh(pGeo, pMat);
      }

      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pMesh.userData.planetData = pData;
      axialTiltGroup.add(pMesh);
      clickableMeshes.push(pMesh);

      let cloudsMesh = null;
      let moonAnchor = null;
      let satellitesGroup = null;

      if (pData.hasClouds) {
        const cloudTex = createEarthCloudsTexture();
        const cloudGeo = new THREE.SphereGeometry(pData.size * 1.018, 48, 48);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.30,
          roughness: 0.85,
          depthWrite: false,
        });
        cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudsMesh.castShadow = true;
        cloudsMesh.userData.planetData = pData;
        axialTiltGroup.add(cloudsMesh);
        clickableMeshes.push(cloudsMesh);
      }

      if (pData.hasMoon) {
        moonAnchor = new THREE.Group();
        planetAnchor.add(moonAnchor);

        const moonTex = createMoonTexture();
        const moonGeo = new THREE.SphereGeometry(0.32, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.85 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(4.2, 0.5, 0);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonAnchor.add(moonMesh);
      }

      // Realistic 3D Spacecraft: ISS (LEO) and GEO Communications Satellite
      if (pData.hasSatellites) {
        satellitesGroup = new THREE.Group();
        planetAnchor.add(satellitesGroup);

        // ISS in LEO at r = 1.36
        const issGroup = new THREE.Group();
        const moduleGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8);
        const moduleMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, metalness: 0.9, roughness: 0.15 });
        const moduleMesh = new THREE.Mesh(moduleGeo, moduleMat);
        moduleMesh.rotation.z = Math.PI / 2;
        issGroup.add(moduleMesh);

        const panelGeo = new THREE.BoxGeometry(0.008, 0.08, 0.22);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x1E3A8A, metalness: 0.95, roughness: 0.1 });
        const leftPanel = new THREE.Mesh(panelGeo, panelMat);
        leftPanel.position.set(0.11, 0, 0);
        issGroup.add(leftPanel);
        const rightPanel = new THREE.Mesh(panelGeo, panelMat);
        rightPanel.position.set(-0.11, 0, 0);
        issGroup.add(rightPanel);

        const leoOrbitGroup = new THREE.Group();
        leoOrbitGroup.rotation.x = THREE.MathUtils.degToRad(51.6);
        issGroup.position.set(1.36, 0, 0);
        leoOrbitGroup.add(issGroup);
        satellitesGroup.add(leoOrbitGroup);

        const leoTraceGeo = new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, 1.36, 1.36, 0, Math.PI * 2, false, 0).getPoints(96).map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const leoTraceMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.28 });
        leoOrbitGroup.add(new THREE.LineLoop(leoTraceGeo, leoTraceMat));

        // GEO Satellite at r = 1.95
        const geoSatellite = new THREE.Group();
        const geoBusGeo = new THREE.BoxGeometry(0.045, 0.045, 0.045);
        const geoBusMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.88, roughness: 0.2 });
        geoSatellite.add(new THREE.Mesh(geoBusGeo, geoBusMat));

        const geoPanelGeo = new THREE.BoxGeometry(0.006, 0.06, 0.14);
        const geoPanelMat = new THREE.MeshStandardMaterial({ color: 0x1E40AF, metalness: 0.95, roughness: 0.12 });
        geoSatellite.add(new THREE.Mesh(geoPanelGeo, geoPanelMat));

        const geoOrbitGroup = new THREE.Group();
        geoSatellite.position.set(1.95, 0, 0);
        geoOrbitGroup.add(geoSatellite);
        satellitesGroup.add(geoOrbitGroup);

        const geoTraceGeo = new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, 1.95, 1.95, 0, Math.PI * 2, false, 0).getPoints(96).map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const geoTraceMat = new THREE.LineBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.18 });
        geoOrbitGroup.add(new THREE.LineLoop(geoTraceGeo, geoTraceMat));
      }

      // Saturn Rings
      let ringMesh = null;
      if (pData.hasRings) {
        const ringInner = pData.size * 1.35;
        const ringOuter = pData.size * 2.55;
        const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 96, 4);

        const posAttr = ringGeo.attributes.position;
        const uvAttr = ringGeo.attributes.uv;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const vr = Math.sqrt(vx * vx + vy * vy);
          const uRad = (vr - ringInner) / (ringOuter - ringInner);
          const theta = (Math.atan2(vy, vx) + Math.PI) / (2 * Math.PI);
          uvAttr.setXY(i, uRad, theta);
        }
        uvAttr.needsUpdate = true;

        const ringTex = createSaturnRingTexture();
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          alphaMap: ringTex,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
          roughness: 0.45,
          metalness: 0.02,
        });

        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.castShadow = true;
        ringMesh.receiveShadow = true;
        ringMesh.userData.planetData = pData;
        axialTiltGroup.add(ringMesh);
        clickableMeshes.push(ringMesh);
      }

      // ----------------------------------------------------------------------
      // 3D DCL (FREE BODY DIAGRAM) VECTORS FOR PLANETARY ORBITAL MECHANICS
      // ----------------------------------------------------------------------
      const dclGroup = new THREE.Group();
      dclGroup.visible = false; // Naturally deactivated by default until Visual Physic mode is toggled

      // Fg: Gravitational attraction (Red, pointing toward Sol)
      const arrowFg = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        pData.size * 2.8,
        0xEF4444, // Red
        pData.size * 0.7,
        pData.size * 0.35
      );
      dclGroup.add(arrowFg);

      // v: Orbital velocity tangent (Green)
      const arrowV = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        pData.size * 2.5,
        0x10B981, // Emerald Green
        pData.size * 0.65,
        pData.size * 0.32
      );
      dclGroup.add(arrowV);

      // ac: Centripetal acceleration (Cyan)
      const arrowAc = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        pData.size * 2.2,
        0x06B6D4, // Cyan
        pData.size * 0.55,
        pData.size * 0.28
      );
      dclGroup.add(arrowAc);

      // Fcf: Apparent centrifugal force (Amber, pointing outward)
      const arrowFcf = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        pData.size * 2.2,
        0xF59E0B, // Amber
        pData.size * 0.55,
        pData.size * 0.28
      );
      dclGroup.add(arrowFcf);

      // L: Orbital angular momentum (Purple, normal to orbital plane)
      const arrowL = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        pData.size * 2.6,
        0xA855F7, // Purple
        pData.size * 0.6,
        pData.size * 0.3
      );
      dclGroup.add(arrowL);

      // Dynamic Component Badges / Labels beside each vector in 3D
      const pAstro = calculateAstrodynamics(pData, pData.semiMajorAxisAU || 1.0, pData.orbitalSpeedKms || 29.8);
      const labelScale = Math.max(0.65, pData.size * 0.85);

      const labelFg = createVectorLabelSprite(`Fg = ${pAstro.F_gravityScientific} N`, '#EF4444', '#FCA5A5');
      if (labelFg) {
        labelFg.scale.set(labelScale * 2.7, labelScale * 0.65, 1);
        dclGroup.add(labelFg);
      }

      const labelV = createVectorLabelSprite(`v = ${pData.orbitalSpeedKms || '29.8 km/s'}`, '#10B981', '#A7F3D0');
      if (labelV) {
        labelV.scale.set(labelScale * 2.3, labelScale * 0.65, 1);
        dclGroup.add(labelV);
      }

      const labelAc = createVectorLabelSprite(`ac = ${pAstro.a_centripetalScientific} m/s²`, '#06B6D4', '#BAE6FD');
      if (labelAc) {
        labelAc.scale.set(labelScale * 2.6, labelScale * 0.65, 1);
        dclGroup.add(labelAc);
      }

      const labelFcf = createVectorLabelSprite(`Fcf = ${pAstro.F_gravityScientific} N`, '#F59E0B', '#FDE68A');
      if (labelFcf) {
        labelFcf.scale.set(labelScale * 2.7, labelScale * 0.65, 1);
        dclGroup.add(labelFcf);
      }

      const labelL = createVectorLabelSprite(`L = ${pAstro.L_angularScientific} kg·m²/s`, '#A855F7', '#E9D5FF');
      if (labelL) {
        labelL.scale.set(labelScale * 3.0, labelScale * 0.65, 1);
        dclGroup.add(labelL);
      }

      planetAnchor.add(dclGroup);

      // ----------------------------------------------------------------------
      // EARTH 3D MAGNETOSPHERE, DIPOLE LINES, BOW SHOCK & POLAR AURORAS
      // ----------------------------------------------------------------------
      let magnetosphereGroup = null;
      let dipoleLines = [];
      let bowShockMesh = null;
      let northAurora = null;
      let southAurora = null;

      if (pData.id === 'earth') {
        magnetosphereGroup = new THREE.Group();
        magnetosphereGroup.visible = false; // Naturally deactivated by default until Magnetic Field mode is toggled

        // Dipole field lines: r = L * sin^2(theta)
        const lShells = [2.0, 3.0, 4.2, 5.6];
        const planesCount = 8;
        lShells.forEach((L) => {
          for (let pl = 0; pl < planesCount; pl++) {
            const phi = (pl / planesCount) * Math.PI * 2;
            const pts = [];
            for (let st = 0; st <= 40; st++) {
              const theta = 0.22 + (st / 40) * (Math.PI - 0.44);
              const rL = L * Math.sin(theta) * Math.sin(theta);
              const xL = rL * Math.sin(theta) * Math.cos(phi);
              const yL = rL * Math.cos(theta); // magnetic dipole axis
              const zL = rL * Math.sin(theta) * Math.sin(phi);
              pts.push(new THREE.Vector3(xL, yL, zL));
            }
            const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0x38BDF8,
              transparent: true,
              opacity: 0.42,
            });
            const dLine = new THREE.Line(lineGeo, lineMat);
            dipoleLines.push(dLine);
            magnetosphereGroup.add(dLine);
          }
        });

        // Van Allen Radiation Belts (Inner Proton Belt & Outer Electron Belt)
        const innerBeltGeo = new THREE.TorusGeometry(1.65, 0.38, 16, 48);
        const innerBeltMat = new THREE.MeshBasicMaterial({
          color: 0x818CF8, // Violet-blue (Inner proton belt)
          transparent: true,
          opacity: 0.32,
          wireframe: true,
          blending: THREE.AdditiveBlending,
        });
        const innerBeltMesh = new THREE.Mesh(innerBeltGeo, innerBeltMat);
        innerBeltMesh.rotation.x = Math.PI / 2;
        magnetosphereGroup.add(innerBeltMesh);

        const outerBeltGeo = new THREE.TorusGeometry(2.9, 0.72, 16, 48);
        const outerBeltMat = new THREE.MeshBasicMaterial({
          color: 0x38BDF8, // Cyan (Outer electron belt)
          transparent: true,
          opacity: 0.20,
          wireframe: true,
          blending: THREE.AdditiveBlending,
        });
        const outerBeltMesh = new THREE.Mesh(outerBeltGeo, outerBeltMat);
        outerBeltMesh.rotation.x = Math.PI / 2;
        magnetosphereGroup.add(outerBeltMesh);

        // Bow Shock Parabolic Shield facing Sun
        const bowGeo = new THREE.CylinderGeometry(3.6, 1.3, 4.4, 32, 1, true, -Math.PI / 2, Math.PI);
        const bowMat = new THREE.MeshBasicMaterial({
          color: 0x0284C7,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          wireframe: true,
        });
        bowShockMesh = new THREE.Mesh(bowGeo, bowMat);
        bowShockMesh.rotation.z = Math.PI / 2;
        bowShockMesh.rotation.y = Math.PI / 2;
        bowShockMesh.position.set(-1.2, 0, 0); // facing Sun
        magnetosphereGroup.add(bowShockMesh);

        // Polar Auroral Ovals (Green O I 557.7nm / Purple N2+)
        const aurGeo = new THREE.TorusGeometry(0.38, 0.055, 12, 48);
        const northAurMat = new THREE.MeshBasicMaterial({
          color: 0x10B981,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });
        northAurora = new THREE.Mesh(aurGeo, northAurMat);
        northAurora.position.set(0, 1.12, 0);
        northAurora.rotation.x = Math.PI / 2;
        magnetosphereGroup.add(northAurora);

        const southAurMat = new THREE.MeshBasicMaterial({
          color: 0x10B981,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });
        southAurora = new THREE.Mesh(aurGeo, southAurMat);
        southAurora.position.set(0, -1.12, 0);
        southAurora.rotation.x = Math.PI / 2;
        magnetosphereGroup.add(southAurora);

        planetAnchor.add(magnetosphereGroup);
      }

      planetObjects.push({
        data: pData,
        anchor: planetAnchor,
        tiltGroup: axialTiltGroup,
        mesh: pMesh,
        cloudsMesh,
        moonAnchor,
        satellitesGroup,
        ringMesh,
        angle: Math.random() * Math.PI * 2,
        orbitLine,
        dclGroup,
        arrowFg,
        arrowV,
        arrowAc,
        arrowFcf,
        arrowL,
        labelFg,
        labelV,
        labelAc,
        labelFcf,
        labelL,
        magnetosphereGroup,
        dipoleLines,
        bowShockMesh,
        northAurora,
        southAurora,
      });
    });

    // Register Sagittarius A* into selectable bodies
    planetObjects.push({
      data: bhData,
      mesh: sgrMesh,
      anchor: blackHoleGroup,
      angle: 0,
      radius: 0,
    });

    // ========================================================================
    // 3. 3D INSTANCED ROCKY ASTEROID BELT (BETWEEN MARS AND JUPITER)
    // ========================================================================
    const beltCount = 1400;
    const rockGeo = new THREE.DodecahedronGeometry(0.12, 1);
    const rPos = rockGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const vx = rPos.getX(i);
      const vy = rPos.getY(i);
      const vz = rPos.getZ(i);
      const disp = 1.0 + (Math.sin(vx * 14.0) + Math.cos(vy * 12.0) + Math.sin(vz * 16.0)) * 0.12;
      rPos.setXYZ(i, vx * disp, vy * disp, vz * disp);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x64748B,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true,
    });

    const asteroidBelt = new THREE.InstancedMesh(rockGeo, rockMat, beltCount);
    asteroidBelt.castShadow = true;
    asteroidBelt.receiveShadow = true;

    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyRot = new THREE.Euler();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3();

    const asteroidData = [];
    for (let i = 0; i < beltCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 24.6 + Math.random() * 3.0 + (Math.random() - 0.5) * 0.6;
      const verticalDispersion = (Math.random() - 0.5) * 1.4;
      const speed = (0.42 / Math.sqrt(r)) * (0.85 + Math.random() * 0.3);
      const scale = 0.06 + Math.pow(Math.random(), 2.8) * 0.26;
      const rotSpeedX = (Math.random() - 0.5) * 1.8;
      const rotSpeedY = (Math.random() - 0.5) * 1.8;

      asteroidData.push({
        r,
        angle,
        verticalDispersion,
        speed,
        scale,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX,
        rotSpeedY,
      });

      dummyPos.set(r * Math.cos(angle), verticalDispersion, r * Math.sin(angle));
      dummyRot.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
      dummyQuat.setFromEuler(dummyRot);
      dummyScale.set(scale, scale, scale);
      dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
      asteroidBelt.setMatrixAt(i, dummyMatrix);
    }
    asteroidBelt.instanceMatrix.needsUpdate = true;
    solarSystemGroup.add(asteroidBelt);

    // ========================================================================
    // INTERACTION & RAYCASTER (Distinguishes click vs camera drag)
    // ========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getVisibleClickable = () =>
      clickableMeshes.filter((m) => {
        if (!m) return false;
        let cur = m;
        while (cur) {
          if (cur.visible === false) return false;
          cur = cur.parent;
        }
        return true;
      });

    const onPointerDown = (event) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event) => {
      const distMoved = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
      if (distMoved > 9) return; // User was dragging to orbit camera

      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(getVisibleClickable(), false);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const pData = hitMesh.userData?.planetData;
        if (pData) {
          handleSelectPlanet(pData, true);
        }
      }
    };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(getVisibleClickable(), false);
      container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);

    // ========================================================================
    // CINEMATIC POST-PROCESSING (Bloom -> ACES output -> Lens/Streak/Grade/Grain)
    // ========================================================================
    const pr = renderer.getPixelRatio();
    const composerTarget = new THREE.WebGLRenderTarget(width * pr, height * pr, {
      type: THREE.HalfFloatType,
      samples: pr > 1.5 ? 2 : 4,
    });
    const composer = new EffectComposer(renderer, composerTarget);
    composer.setPixelRatio(pr);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      DEFAULT_VIEWER_SETTINGS.bloomStrength,
      0.55,
      DEFAULT_VIEWER_SETTINGS.bloomThreshold
    );
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    const cinePass = new ShaderPass(CineShader);
    composer.addPass(cinePass);
    const cineUniforms = cinePass.uniforms;
    cineUniforms.uAspect.value = width / height;

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    }
    // ========================================================================
    // ANIMATION & HIERARCHY LOOP
    // ========================================================================
    let animId;
    const clock = new THREE.Clock();
    let prevFocalWorldPos = new THREE.Vector3();
    let simTime = 0;
    let wasTransitioning = false;
    let lastNavKey = '';
    const travel = { t: 0, dur: 5.2, p0: new THREE.Vector3(), t0: new THREE.Vector3() };
    const tmpTarget = new THREE.Vector3();
    const tmpDesired = new THREE.Vector3();
    const tmpOffset = new THREE.Vector3();
    const tmpSun = new THREE.Vector3();
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpUp = new THREE.Vector3();
    const tmpDir = new THREE.Vector3();
    const tmpSide = new THREE.Vector3();
    const tmpCtrl = new THREE.Vector3();
    const tmpBH = new THREE.Vector3();
    const tmpProj = new THREE.Vector3();
    const tmpWorld = new THREE.Vector3();

    // Intro: Start deep in space behind/above the Solar System, flying in towards the orbiting planets
    camera.position.set(-290, 90, 1140);
    controls.target.set(210, 0, 241);

    let alignBlend = 0.0; // 0.0 = 100% Keplerian Orbit, 1.0 = 100% 7-Planet Lineup
    let isInitialIntro = true;
    let curSunLineupY = 0;
    let curSunLineupZ = 0;
    let curSunLineupScale = PLANET_SUBJECTS[0].lineupScale;
    let curBhLineupY = 0;
    let curBhLineupZ = 0;
    let curBhLineupScale = bhData?.lineupScale || 0.155;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Check if user requested an intro replay
      if (animStateRef.current.triggerIntroReplay) {
        animStateRef.current.triggerIntroReplay = false;
        camera.position.set(-290, 90, 1140);
        controls.target.set(210, 0, 241);
        alignBlend = 0.0;
        isInitialIntro = true;
        wasTransitioning = false;
        animStateRef.current.isTransitioning = true;
      }

      const {
        activePlanet: currentActive,
        viewVariant: currentVariant,
        lineupZoomed: isLineupZoomed,
        isPaused: paused,
        speedMultiplier: warp,
        archLevel: currentLevel,
        isRealScale: realScaleMode,
        isGalacticDriftActive: driftActive,
        isTransitioning: transitioning,
      } = animStateRef.current;

      const isShowcase = currentVariant !== 'orbital' && !realScaleMode;

      // Update target alignment factor:
      // In initial intro: keep at 0 while camera approaches from deep space, then ease to 1 as camera nears the Solar System
      let targetAlign = 0.0;
      if (isShowcase) {
        if (isInitialIntro) {
          const introU = THREE.MathUtils.clamp(travel.t / Math.max(0.1, travel.dur), 0, 1);
          if (introU < 0.52) {
            targetAlign = 0.0;
          } else {
            targetAlign = THREE.MathUtils.smoothstep(introU, 0.52, 0.94);
          }
          if (introU >= 0.96) {
            isInitialIntro = false;
            targetAlign = 1.0;
          }
        } else {
          targetAlign = 1.0;
        }
      } else {
        targetAlign = 0.0;
        isInitialIntro = false;
      }

      // Smooth interpolation of alignment blend
      if (isInitialIntro) {
        alignBlend = targetAlign;
      } else {
        alignBlend += (targetAlign - alignBlend) * Math.min(1.0, delta * 3.2);
        if (Math.abs(targetAlign - alignBlend) < 0.001) alignBlend = targetAlign;
      }
      const b = alignBlend * alignBlend * (3.0 - 2.0 * alignBlend); // Cubic smoothstep

      // Gravitational time dilation (cinematic): slows down near Sgr A*
      const bhR = 7.0 * blackHoleGroup.scale.x;
      const dil = animStateRef.current.cinemaMode && !isShowcase
        ? THREE.MathUtils.clamp((camera.position.length() - bhR * 2.0) / (bhR * 10.0), 0.1, 1.0)
        : 1.0;
      simTime += delta * dil;

      sunUniforms.uTime.value = elapsedTime;
      diskMat.uniforms.uTime.value = simTime;
      lensingArchMat.uniforms.uTime.value = simTime;

      sunMesh.rotation.y += 0.0025;
      streakSprite.position.set(0, 0, 0);

      // Rotate 3D Coronal Magnetic Loops with solar photosphere
      coronalLoopsGroup.rotation.y = sunMesh.rotation.y;

      // Update Solar Global Magnetic Field & Plasma Streamers
      const isMagFieldOn = !!animStateRef.current.magneticFieldMode;
      solarMagneticGroup.visible = isMagFieldOn;
      if (isMagFieldOn) {
        solarMagneticGroup.rotation.y = sunMesh.rotation.y;
        const posAttr = solarWindGeo.attributes.position;
        const arr = posAttr.array;
        for (let i = 0; i < solarWindCount; i++) {
          const v = solarWindVels[i];
          arr[i * 3] += v.dir.x * v.speed;
          arr[i * 3 + 1] += v.dir.y * v.speed;
          arr[i * 3 + 2] += v.dir.z * v.speed;
          const distSq = arr[i * 3] * arr[i * 3] + arr[i * 3 + 1] * arr[i * 3 + 1] + arr[i * 3 + 2] * arr[i * 3 + 2];
          if (distSq > 45.0 * 45.0) {
            arr[i * 3] = v.dir.x * 3.2;
            arr[i * 3 + 1] = v.dir.y * 3.2;
            arr[i * 3 + 2] = v.dir.z * 3.2;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Update Parker Spiral IMF
      parkerGroup.visible = !isShowcase && (isMagFieldOn || !!animStateRef.current.showParkerSpiral);
      parkerGroup.rotation.y = sunMesh.rotation.y;

      // Update CME (Coronal Mass Ejection) shockwave & high-energy particles
      if (animStateRef.current.isCmeActive) {
        animStateRef.current.cmeProgress += delta * 0.28 * warp;
        const prog = animStateRef.current.cmeProgress;
        const curRadius = 3.4 + prog * 42.0;
        cmeGroup.visible = true;
        cmeMesh.scale.set(curRadius / 2.2, curRadius / 2.2, curRadius / 2.2);
        const cAlpha = Math.max(0, (1.0 - prog) * 0.85);
        cmeMesh.material.opacity = cAlpha;
        cmeParticles.material.opacity = cAlpha * 0.95;
        cmeParticles.rotation.y += delta * 0.4;
        if (prog >= 1.0) {
          animStateRef.current.isCmeActive = false;
          setIsCmeActive(false);
          cmeGroup.visible = false;
        }
      } else {
        cmeGroup.visible = false;
      }

      // Rotate Black Hole Components
      sgrMesh.rotation.y += delta * 0.35 * dil;
      lensingArchMesh.rotation.z -= delta * 0.05 * dil;

      let activeWorldPos = new THREE.Vector3(0, 0, 0);
      let activeSpeedKms = 29.8;

      // ======================================================================
      // UNIFIED POSITIONS & HIERARCHY: BLENDING ORBITAL & 7-PLANET LINEUP
      // ======================================================================
      // 1. Galactic Heliocentric Orbit
      const galRadius = realScaleMode ? 48000 : 320;
      if (!paused && driftActive && b < 0.05) {
        animStateRef.current.galacticAngle += delta * (realScaleMode ? 0.004 : 0.018) * warp;
      }
      const gAngle = animStateRef.current.galacticAngle;
      const sunGalX = galRadius * Math.cos(gAngle);
      const sunGalZ = galRadius * Math.sin(gAngle);
      const sunGalY = Math.sin(gAngle * 2.8) * (realScaleMode ? 120.0 : 8.0);
      solarSystemGroup.position.set(sunGalX, sunGalY, sunGalZ);

      // Environment visibility & lighting blends
      galOrbitLine.visible = b < 0.95;
      galOrbitLine.material.opacity = 0.25 * (1.0 - b);
      asteroidBelt.visible = b < 0.85;
      streakSprite.visible = b < 0.95;
      streakSprite.material.opacity = 0.85 * (1.0 - b);
      sunBeacon.visible = b < 0.5;
      jetMeshNorth.visible = b < 0.25;
      jetMeshSouth.visible = b < 0.25;
      sStarPoints.visible = b < 0.25;

      const curSettings = animStateRef.current.viewerSettings || DEFAULT_VIEWER_SETTINGS;
      const targetSunInt = curSettings.sunIntensity;
      const targetAmbInt = curSettings.ambientIntensity;

      showcaseDirLight.intensity = THREE.MathUtils.lerp(0.45, 1.35, b) * (targetSunInt / 2.2);
      sunLight.intensity = THREE.MathUtils.lerp(targetSunInt, targetSunInt * 0.42, b);
      ambientLight.intensity = targetAmbInt;
      hemiLight.intensity = targetAmbInt * 0.75;
      bloomPass.strength = curSettings.bloomStrength;
      bloomPass.threshold = curSettings.bloomThreshold;
      if (diskMat?.uniforms?.uExposure) {
        diskMat.uniforms.uExposure.value = curSettings.sgrExposure;
      }
      if (lensingArchMat?.uniforms?.uExposure) {
        lensingArchMat.uniforms.uExposure.value = curSettings.sgrExposure;
      }
      if (earthShaderMatRef) {
        earthShaderMatRef.uniforms.uUseCustomSunDir.value = b;
        earthShaderMatRef.uniforms.uSunDir.value.set(-0.38, 0.28, 0.88).normalize();
      }

      // S-Stars relativistic orbits around Sgr A* (when orbital)
      if (b < 0.25) {
        const posArray = sStarGeo.attributes.position.array;
        for (let i = 0; i < sStarCount; i++) {
          if (!paused) {
            sStarAngles[i] += sStarSpeeds[i] * delta * 0.18 * warp;
          }
          const ang = sStarAngles[i];
          const rad = sStarRadii[i] * (realScaleMode ? 6.5 : 1.0);
          const inc = sStarIncs[i];
          posArray[i * 3] = rad * Math.cos(ang);
          posArray[i * 3 + 1] = rad * Math.sin(inc) * Math.sin(ang);
          posArray[i * 3 + 2] = rad * Math.cos(inc) * Math.sin(ang);
        }
        sStarGeo.attributes.position.needsUpdate = true;
      }

      // Asteroid Belt tumbling & orbit
      if (!paused && b < 0.85) {
        for (let i = 0; i < beltCount; i++) {
          const ast = asteroidData[i];
          ast.angle += ast.speed * delta * 0.35 * warp;
          ast.rotX += ast.rotSpeedX * delta;
          ast.rotY += ast.rotSpeedY * delta;

          dummyPos.set(
            ast.r * Math.cos(ast.angle),
            ast.verticalDispersion,
            ast.r * Math.sin(ast.angle)
          );
          dummyRot.set(ast.rotX, ast.rotY, ast.rotZ);
          dummyQuat.setFromEuler(dummyRot);
          dummyScale.set(ast.scale, ast.scale, ast.scale);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          asteroidBelt.setMatrixAt(i, dummyMatrix);
        }
        asteroidBelt.instanceMatrix.needsUpdate = true;
      }

      const isPanoramaLineup = isShowcase && !isLineupZoomed;

      // 2. Position & Scale of Sun
      const sunData = PLANET_SUBJECTS[0];
      const isSunSelected = currentActive.id === 'sun';
      const targetSunY = isSunSelected && isPanoramaLineup ? 0.38 : 0;
      const targetSunZ = isSunSelected && isPanoramaLineup ? 1.6 : (isSunSelected && isLineupZoomed ? 2.2 : 0);
      const targetSunLineupScale = sunData.lineupScale * (isSunSelected ? 1.18 : 1.0);
      curSunLineupY += (targetSunY - curSunLineupY) * 0.14;
      curSunLineupZ += (targetSunZ - curSunLineupZ) * 0.14;
      curSunLineupScale += (targetSunLineupScale - curSunLineupScale) * 0.14;

      sunAnchor.visible = true;
      sunAnchor.position.set(sunData.lineupX * b, curSunLineupY * b, curSunLineupZ * b);
      const orbSunScale = (realScaleMode ? 10.0 : 3.4) / 3.4;
      const finalSunScale = THREE.MathUtils.lerp(orbSunScale, curSunLineupScale, b);
      sunAnchor.scale.setScalar(finalSunScale);
      sunMesh.scale.set(1, 1, 1);
      if (isSunSelected) {
        sunAnchor.getWorldPosition(activeWorldPos);
      }

      // 3. Position & Scale of Sagittarius A* (Black Hole)
      const isBhSelected = currentActive.id === 'blackhole';
      const targetBhY = isBhSelected && isPanoramaLineup ? 0.38 : 0;
      const targetBhZ = isBhSelected && isPanoramaLineup ? 1.6 : (isBhSelected && isLineupZoomed ? 2.2 : 0);
      const targetBhLineupScale = (bhData?.lineupScale || 0.155) * (isBhSelected ? 1.18 : 1.0);
      curBhLineupY += (targetBhY - curBhLineupY) * 0.14;
      curBhLineupZ += (targetBhZ - curBhLineupZ) * 0.14;
      curBhLineupScale += (targetBhLineupScale - curBhLineupScale) * 0.14;

      blackHoleGroup.visible = true;
      blackHoleGroup.position.set(
        THREE.MathUtils.lerp(0, sunGalX + (bhData?.lineupX || 21), b),
        THREE.MathUtils.lerp(0, sunGalY + curBhLineupY, b),
        THREE.MathUtils.lerp(0, sunGalZ + curBhLineupZ, b)
      );
      const orbBhScale = realScaleMode ? 9.5 : 1.0;
      const finalBhScale = THREE.MathUtils.lerp(orbBhScale, curBhLineupScale, b);
      blackHoleGroup.scale.setScalar(finalBhScale);
      if (isBhSelected) {
        blackHoleGroup.getWorldPosition(activeWorldPos);
      }

      // 4. Position & Scale of Planets
      planetObjects.forEach((pObj) => {
        if (pObj.data.id === 'sun' || pObj.data.id === 'blackhole') return;

        const curA = realScaleMode ? pObj.data.realDistance : pObj.data.distance;
        const curSize = realScaleMode ? pObj.data.realSize : pObj.data.size;
        const e = pObj.data.eccentricity;
        const inc = pObj.data.inclination || 0;
        const orbScale = curSize / pObj.data.size;

        if (!paused && b < 0.85) {
          const currentR = (curA * (1 - e * e)) / (1 + e * Math.cos(pObj.angle));
          const instantaneousSpeed = (pObj.data.speed * 0.32 * warp * (curA / Math.max(1, currentR))) * (1.0 - b * 0.85);
          pObj.angle += instantaneousSpeed * delta;
        }

        const r = (curA * (1 - e * e)) / (1 + e * Math.cos(pObj.angle));
        const orbX = r * Math.cos(pObj.angle);
        const orbZRaw = r * Math.sin(pObj.angle);
        const orbY = -orbZRaw * Math.sin(inc);
        const orbZ = orbZRaw * Math.cos(inc);

        if (pObj.orbitLine) {
          pObj.orbitLine.visible = b < 0.98;
          pObj.orbitLine.material.opacity = 0.22 * (1.0 - b);
        }

        const isSel = currentActive.id === pObj.data.id;

        if (pObj.data.inLineup) {
          pObj.anchor.visible = true;
          const targetPy = isSel && isPanoramaLineup ? 0.38 : 0;
          const targetPz = isSel && isPanoramaLineup ? 1.6 : (isSel && isLineupZoomed ? 2.2 : 0);
          const targetLScale = (pObj.data.lineupScale || 1.0) * (isSel ? 1.18 : 1.0);

          pObj.curLineupY = (pObj.curLineupY ?? 0) + (targetPy - (pObj.curLineupY ?? 0)) * 0.14;
          pObj.curLineupZ = (pObj.curLineupZ ?? 0) + (targetPz - (pObj.curLineupZ ?? 0)) * 0.14;
          pObj.curLineupScale = (pObj.curLineupScale ?? targetLScale) + (targetLScale - (pObj.curLineupScale ?? targetLScale)) * 0.14;

          pObj.anchor.position.set(
            THREE.MathUtils.lerp(orbX, pObj.data.lineupX, b),
            THREE.MathUtils.lerp(orbY, pObj.curLineupY, b),
            THREE.MathUtils.lerp(orbZ, pObj.curLineupZ, b)
          );

          const finalScale = THREE.MathUtils.lerp(orbScale, pObj.curLineupScale, b);
          pObj.mesh.scale.setScalar(finalScale);
          if (pObj.cloudsMesh) pObj.cloudsMesh.scale.setScalar(finalScale);
          if (pObj.ringMesh) pObj.ringMesh.scale.setScalar(THREE.MathUtils.lerp(1.0, finalScale, b));
          if (pObj.moonAnchor) pObj.moonAnchor.scale.setScalar(THREE.MathUtils.lerp(1.0, 0.5, b));
        } else {
          pObj.anchor.position.set(orbX, orbY, orbZ);
          const nonLineupScale = Math.max(0.001, orbScale * (1.0 - b));
          pObj.mesh.scale.setScalar(nonLineupScale);
          if (pObj.cloudsMesh) pObj.cloudsMesh.scale.setScalar(nonLineupScale);
          if (pObj.ringMesh) pObj.ringMesh.scale.setScalar(Math.max(0.001, 1.0 - b));
          pObj.anchor.visible = b < 0.98;
        }

        pObj.mesh.rotation.y += delta * 0.45;
        if (pObj.cloudsMesh) pObj.cloudsMesh.rotation.y += delta * 0.55;
        if (pObj.moonAnchor) pObj.moonAnchor.rotation.y += delta * 1.1;
        if (pObj.satellitesGroup) pObj.satellitesGroup.rotation.y += delta * 0.95;

        // DCL Vectors in Orbital or Selected Mode
        if (pObj.dclGroup) {
          const isFocalOrSolar = currentLevel === 'solar' || isSel;
          pObj.dclGroup.visible = (!!animStateRef.current.visualPhysicMode || !!animStateRef.current.showDcl) && isFocalOrSolar;
        }

        // Magnetosphere in Orbital or Selected Mode
        if (pObj.magnetosphereGroup) {
          pObj.magnetosphereGroup.visible = (!!animStateRef.current.magneticFieldMode || !!animStateRef.current.showMagnetosphere || !!animStateRef.current.isCmeActive || !!animStateRef.current.isReversing) && (b < 0.5 || isSel);
        }

        if (isSel) {
          pObj.anchor.getWorldPosition(activeWorldPos);
          activeSpeedKms = (pObj.data.distance / Math.max(1, r)) * 29.8;
        }
      });

      // 5. Active Selection Halo Ring in Lineup
      if (isPanoramaLineup && b > 0.75) {
        selectionHaloGroup.visible = true;
        selectionHaloGroup.position.copy(activeWorldPos);
        haloRingMat.color.set(currentActive.color || '#38BDF8');
        haloOuterMat.color.set(currentActive.color || '#38BDF8');
        const haloAlpha = THREE.MathUtils.smoothstep(b, 0.75, 0.98);
        haloRingMat.opacity = 0.85 * haloAlpha;
        haloOuterMat.opacity = 0.35 * haloAlpha;
        const pulse = 1.0 + Math.sin(elapsedTime * 3.2) * 0.04;
        selectionHaloGroup.scale.setScalar(pulse);
        selectionHaloGroup.lookAt(camera.position);
      } else {
        selectionHaloGroup.visible = false;
      }

      // Update telemetry
      if (Math.random() < 0.1) {
        const trueAnomalyDeg = ((activeWorldPos.length() > 0 ? Math.atan2(activeWorldPos.z, activeWorldPos.x) : 0) * (180 / Math.PI) + 360) % 360;
        setLiveTelemetry({
          rAU: currentActive.semiMajorAxisAU || '1.000 AU',
          velKms: currentActive.orbitalSpeedKms || `${activeSpeedKms.toFixed(1)} km/s`,
          nuDeg: `${trueAnomalyDeg.toFixed(1)}°`,
        });
      }

      // ======================================================================
      // CAMERA FRAMING SYSTEM: DEEP SPACE FLY-IN -> LINEUP -> ZOOM
      // ======================================================================
      const st = animStateRef.current;
      const shot = st.shot;
      const cineOn = st.cinemaMode;
      const bhRadiusNow = 7.0 * blackHoleGroup.scale.x;
      const navKey = `${isInitialIntro}|${currentVariant}|${isLineupZoomed}|${currentLevel}|${currentActive.id}|${realScaleMode}|${shot}`;
      const targetCenter = tmpTarget.set(0, 0, 0);
      const desiredCamPos = tmpDesired.set(0, 0, 0);

      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(20));
      const effAspect = Math.max(1.15, camera.aspect);
      const lineupCamDist = Math.max(30.0, 26.2 / (tanHalfFov * effAspect));

      solarSystemGroup.getWorldPosition(tmpSun);

      if (isShowcase) {
        if (!isLineupZoomed) {
          targetCenter.set(tmpSun.x, tmpSun.y - 0.55, tmpSun.z);
          desiredCamPos.set(tmpSun.x, tmpSun.y + 1.35, tmpSun.z + lineupCamDist);
        } else {
          const isWideBody = currentActive.id === 'saturn' || currentActive.id === 'blackhole';
          const closeZ = isWideBody ? 10.8 : 7.4;
          const closeY = isWideBody ? 2.0 : 1.0;
          const rightPanelOffset = container.clientWidth >= 1024 ? (isWideBody ? 2.8 : 2.1) : 0.0;
          targetCenter.set(activeWorldPos.x + rightPanelOffset, activeWorldPos.y, activeWorldPos.z);
          desiredCamPos.set(activeWorldPos.x + rightPanelOffset + 0.8, activeWorldPos.y + closeY, activeWorldPos.z + closeZ);
        }
      } else if (currentLevel === 'galaxy') {
        targetCenter.set(0, 0, 0);
        if (shot === 'gargantua') {
          const camDist = bhRadiusNow * 11;
          desiredCamPos.set(camDist * 0.93, camDist * 0.14, camDist * 0.34);
        } else {
          const camDist = realScaleMode ? 75000 : 420;
          desiredCamPos.set(0, camDist * 0.45, camDist * 0.85);
        }
      } else if (currentLevel === 'solar') {
        targetCenter.copy(tmpSun);
        const camDist = realScaleMode ? 6200 : 70;
        if (shot === 'ecliptic') {
          desiredCamPos.copy(targetCenter).add(tmpOffset.set(camDist * 0.92, camDist * 0.07, camDist * 0.38));
        } else {
          desiredCamPos.copy(targetCenter).add(tmpOffset.set(0, camDist * 0.55, camDist * 0.85));
        }
      } else {
        targetCenter.copy(activeWorldPos);
        const sunToPlanet = tmpA.copy(activeWorldPos).sub(tmpSun).normalize();
        const orbitTangent = tmpB.set(-sunToPlanet.z, 0, sunToPlanet.x).normalize();

        const pRadius = realScaleMode ? currentActive.realSize : currentActive.size;
        const framingDistance = realScaleMode
          ? Math.max(pRadius * 5.0, 3.5)
          : Math.max(pRadius * 3.6, currentActive.hasRings ? 14.5 : 4.5);

        if (shot === 'backlit') {
          tmpOffset.set(0, 0, 0)
            .addScaledVector(sunToPlanet, 0.92)
            .addScaledVector(orbitTangent, 0.34)
            .add(tmpUp.set(0, 0.13, 0))
            .normalize()
            .multiplyScalar(framingDistance * 1.15);
        } else {
          tmpOffset.set(0, 0, 0)
            .addScaledVector(sunToPlanet, 0.38)
            .addScaledVector(orbitTangent, 0.85)
            .add(tmpUp.set(0, 0.35, 0))
            .normalize()
            .multiplyScalar(framingDistance);
        }
        desiredCamPos.copy(activeWorldPos).add(tmpOffset);
      }

      let travelS = 0;
      if (transitioning) {
        if (!wasTransitioning || navKey !== lastNavKey) {
          travel.t = 0;
          travel.p0.copy(camera.position);
          travel.t0.copy(controls.target);
          const dist = travel.p0.distanceTo(desiredCamPos);
          if (isInitialIntro) {
            travel.dur = 5.2; // 5.2s epic fly-in from deep space approaching the orbiting planets
          } else if (isShowcase) {
            travel.dur = THREE.MathUtils.clamp(0.75 + dist * 0.015, 0.75, 1.35);
          } else {
            travel.dur = THREE.MathUtils.clamp(1.8 + 0.7 * Math.log10(1 + dist), 2.0, 4.8);
          }
          if (!st.shot) st.autoOrbit = false;
        }
        travel.t += delta;
        const u = Math.min(1, travel.t / travel.dur);
        const s = u * u * u * (u * (u * 6 - 15) + 10);
        travelS = s;

        if (isInitialIntro) {
          // Curved Bezier swoop from deep space down to the front of the aligned Solar System
          const len = travel.p0.distanceTo(desiredCamPos);
          tmpDir.subVectors(desiredCamPos, travel.p0);
          tmpSide.crossVectors(tmpDir, tmpUp.set(0, 1, 0));
          if (tmpSide.lengthSq() < 1e-9) tmpSide.set(1, 0, 0);
          tmpSide.normalize();
          tmpCtrl.addVectors(travel.p0, desiredCamPos).multiplyScalar(0.5)
            .addScaledVector(tmpUp.set(0, 1, 0), len * 0.14)
            .addScaledVector(tmpSide, len * 0.10);
          const ca = (1 - s) * (1 - s);
          const cb = 2 * (1 - s) * s;
          const cc = s * s;
          camera.position.set(
            ca * travel.p0.x + cb * tmpCtrl.x + cc * desiredCamPos.x,
            ca * travel.p0.y + cb * tmpCtrl.y + cc * desiredCamPos.y,
            ca * travel.p0.z + cb * tmpCtrl.z + cc * desiredCamPos.z
          );
          controls.target.lerpVectors(travel.t0, targetCenter, s);
        } else if (isShowcase) {
          camera.position.lerpVectors(travel.p0, desiredCamPos, s);
          controls.target.lerpVectors(travel.t0, targetCenter, s);
        } else {
          const len = travel.p0.distanceTo(desiredCamPos);
          tmpDir.subVectors(desiredCamPos, travel.p0);
          tmpSide.crossVectors(tmpDir, tmpUp.set(0, 1, 0));
          if (tmpSide.lengthSq() < 1e-9) tmpSide.set(1, 0, 0);
          tmpSide.normalize();
          tmpCtrl.addVectors(travel.p0, desiredCamPos).multiplyScalar(0.5)
            .addScaledVector(tmpUp.set(0, 1, 0), len * 0.16)
            .addScaledVector(tmpSide, len * 0.12);
          const ca = (1 - s) * (1 - s);
          const cb = 2 * (1 - s) * s;
          const cc = s * s;
          camera.position.set(
            ca * travel.p0.x + cb * tmpCtrl.x + cc * desiredCamPos.x,
            ca * travel.p0.y + cb * tmpCtrl.y + cc * desiredCamPos.y,
            ca * travel.p0.z + cb * tmpCtrl.z + cc * desiredCamPos.z
          );
          controls.target.lerpVectors(travel.t0, targetCenter, s);
        }

        if (u >= 1) {
          st.isTransitioning = false;
          st.shot = null;
          isInitialIntro = false;
        }
      } else {
        tmpDir.subVectors(targetCenter, prevFocalWorldPos);
        camera.position.add(tmpDir);
        controls.target.copy(targetCenter);
      }
      wasTransitioning = transitioning && st.isTransitioning;
      lastNavKey = navKey;

      // Cinematic FOV dolly
      const desiredFov = 40 + (cineOn && !isShowcase ? Math.sin(Math.PI * travelS) * 9 : 0);
      if (Math.abs(camera.fov - desiredFov) > 0.01) {
        camera.fov += (desiredFov - camera.fov) * 0.2;
        camera.updateProjectionMatrix();
      }

      prevFocalWorldPos.copy(targetCenter);
      controls.autoRotate = !!st.autoOrbit && !st.isTransitioning;
      controls.autoRotateSpeed = 0.45;
      controls.update();

      // Celestial Background follows camera for infinite cosmic parallax
      skyDome.position.copy(camera.position);
      starPoints.position.copy(camera.position);
      brightStarPoints.position.copy(camera.position);
      starPoints.rotation.y += delta * 0.0012;
      brightStarPoints.rotation.y += delta * 0.0012;
      skyDome.rotation.y += delta * 0.0006;

      // ======================================================================
      // 2D PROJECTED SCREEN COORDINATES FOR THE 7 LINEUP FLOATING COURSE BADGES
      // ======================================================================
      const labelAlpha = isShowcase && !isLineupZoomed ? THREE.MathUtils.smoothstep(alignBlend, 0.80, 0.98) : 0;

      // Fade top & bottom UI prompt bars simultaneously
      if (lineupUiTopRef.current) {
        lineupUiTopRef.current.style.opacity = labelAlpha.toFixed(3);
        lineupUiTopRef.current.style.pointerEvents = labelAlpha > 0.5 ? 'auto' : 'none';
      }
      if (lineupUiBottomRef.current) {
        lineupUiBottomRef.current.style.opacity = labelAlpha.toFixed(3);
        lineupUiBottomRef.current.style.pointerEvents = labelAlpha > 0.5 ? 'auto' : 'none';
      }

      camera.updateMatrixWorld();
      planetObjects.forEach((pObj) => {
        if (!pObj.data?.inLineup) return;
        const el = lineupLabelsRef.current[pObj.data.id];
        if (!el || !container) return;

        if (labelAlpha <= 0.01) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        pObj.anchor.getWorldPosition(tmpWorld);
        tmpProj.set(tmpWorld.x, tmpWorld.y - 2.45, tmpWorld.z).project(camera);
        const sx = (tmpProj.x * 0.5 + 0.5) * container.clientWidth;
        const staggerY = container.clientWidth < 920 ? (pObj.data.lineupIndex % 2) * 38 : 0;
        const sy = (-tmpProj.y * 0.5 + 0.5) * container.clientHeight + staggerY;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, 0)`;
        const inBounds = tmpProj.z < 1 && sx > 16 && sx < container.clientWidth - 16;
        el.style.opacity = inBounds ? labelAlpha.toFixed(3) : '0';
        el.style.pointerEvents = inBounds && labelAlpha > 0.5 ? 'auto' : 'none';
      });

      // Handheld breathing + flight roll (orbital cinema mode)
      if (cineOn && !isShowcase) {
        const nx = Math.sin(elapsedTime * 0.37) * 0.6 + Math.sin(elapsedTime * 0.91 + 1.3) * 0.4;
        const ny = Math.sin(elapsedTime * 0.29 + 0.7) * 0.6 + Math.sin(elapsedTime * 0.83) * 0.4;
        camera.rotateX(nx * 0.0022);
        camera.rotateY(ny * 0.0022);
        camera.rotateZ(Math.sin(Math.PI * travelS) * 0.07 + Math.sin(elapsedTime * 0.23) * 0.0022);
      }

      // Gravitational lensing of Sgr A* (fades to 0 in lineup mode so neighboring planets aren't distorted)
      if (cineOn) {
        blackHoleGroup.getWorldPosition(tmpBH);
        camera.updateMatrixWorld();
        camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
        const bhDist = camera.position.distanceTo(tmpBH);
        tmpBH.project(camera);
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5);
        const rho = (bhRadiusNow / Math.max(bhDist, 1e-3)) / tanHalf * 0.5;
        const inFront = tmpBH.z < 1 ? 1 : 0;
        const nearFade = THREE.MathUtils.smoothstep(bhDist, bhRadiusNow * 1.6, bhRadiusNow * 4.0);
        const farFade = THREE.MathUtils.smoothstep(rho, 0.004, 0.03);
        cineUniforms.uLensPos.value.set(tmpBH.x * 0.5 + 0.5, tmpBH.y * 0.5 + 0.5);
        cineUniforms.uThetaE.value = rho * 2.0;
        cineUniforms.uLensStrength.value = isShowcase ? 0.0 : (inFront * nearFade * farFade * (1.0 - b));
        cineUniforms.uAspect.value = camera.aspect;
        cineUniforms.uTime.value = elapsedTime;
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      controls.dispose();
      haloRingGeo.dispose();
      haloRingMat.dispose();
      haloOuterGeo.dispose();
      haloOuterMat.dispose();

      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      streakTex.dispose();
      streakMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starSprite.dispose();
      brightStarGeo.dispose();
      brightStarMat.dispose();
      brightStarSprite.dispose();
      skyDomeGeo.dispose();
      skyDomeMat.dispose();
      cosmicNebulaTex.dispose();
      sgrGeo.dispose();
      sgrMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      photonRingGeo.dispose();
      photonRingMat.dispose();
      lensingArchGeo.dispose();
      lensingArchMat.dispose();
      earthDayTex.dispose();
      earthNightTex.dispose();

      coronalLoopsGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      cmeGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      parkerGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      solarMagneticGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
      rockGeo.dispose();
      rockMat.dispose();

      planetObjects.forEach(pObj => {
        if (pObj.mesh && pObj.mesh.geometry) pObj.mesh.geometry.dispose();
        if (pObj.mesh && pObj.mesh.material) {
          if (pObj.mesh.material.map) pObj.mesh.material.map.dispose();
          pObj.mesh.material.dispose();
        }
        if (pObj.orbitLine) {
          pObj.orbitLine.geometry.dispose();
          pObj.orbitLine.material.dispose();
        }
        if (pObj.ringMesh) {
          pObj.ringMesh.geometry.dispose();
          pObj.ringMesh.material.dispose();
        }
        if (pObj.dclGroup) {
          pObj.dclGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          });
        }
        if (pObj.magnetosphereGroup) {
          pObj.magnetosphereGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      composer.dispose();
      bloomPass.dispose();
      cinePass.material.dispose();
      outputPass.dispose();
      if (audioRef.current) {
        audioRef.current.dispose();
        audioRef.current = null;
      }
      renderer.dispose();
    };
  }, []);

  const astroData = useMemo(() => {
    return calculateAstrodynamics(activePlanet, liveTelemetry.rAU, liveTelemetry.velKms);
  }, [activePlanet, liveTelemetry.rAU, liveTelemetry.velKms]);

  const isShowcaseMode = viewVariant !== 'orbital' && !isRealScale;

  // Reusable Course & Physics Dossier Content
  const renderCourseDossier = (isCompact = false) => {
    const courseTitle = activeCourse
      ? (lang === 'en' ? activeCourse.titleEn : activeCourse.titleEs)
      : (lang === 'en' ? activePlanet.academicAreaEn : activePlanet.academicAreaEs);
    const courseSub = activeCourse
      ? (lang === 'en' ? activeCourse.subtitleEn : activeCourse.subtitleEs)
      : activePlanet.spectralClass;
    const courseDesc = activeCourse
      ? (lang === 'en' ? activeCourse.descriptionEn : activeCourse.descriptionEs)
      : (lang === 'en' ? activePlanet.descriptionEn : activePlanet.descriptionEs);
    const syllabusList = activeCourse
      ? (lang === 'en' ? activeCourse.syllabusEn : activeCourse.syllabusEs)
      : [];
    const skriptKeywords = activeCourse
      ? (lang === 'en'
          ? (activeCourse.keywordsEn || activeCourse.skriptKeywords || [])
          : (activeCourse.keywordsEs || activeCourse.skriptKeywords || []))
      : [];
    const hourlyRate = activeCourse?.rateHourly || activePlanet.rateHourly || 38;
    const packPrice = activeCourse?.packagePrice || activePlanet.packagePrice || 275;
    const courseCode = activeCourse?.code || activePlanet.courseCode || 'COURSE';
    const levelLabel = activeCourse
      ? (lang === 'en' ? activeCourse.levelEn : activeCourse.levelEs)
      : 'B.Sc. / M.Sc. / IB';

    return (
      <div className="flex flex-col h-full justify-between">
        {/* Dossier Top Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shadow-inner border border-white/15 shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${activePlanet.color}, #020617 85%)`,
                }}
              >
                {activePlanet.emoji || '🪐'}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    {courseCode}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {getPlanetName(activePlanet, lang)} • {levelLabel}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate mt-0.5">
                  {courseTitle}
                </h4>
                <p className="text-xs text-sky-300/90 font-mono truncate">{courseSub}</p>
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                  €{hourlyRate}<span className="text-[11px] font-normal text-slate-400">/h</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  Pack 8h: €{packPrice}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onOpenBooking && activeCourse) {
                    onOpenBooking(activeCourse);
                  } else if (onOpenBooking) {
                    onOpenBooking({ code: courseCode, titleEn: courseTitle });
                  } else if (onNavigate) {
                    onNavigate('courses');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <span>📅</span>
                <span>{lang === 'en' ? 'Book Class' : 'Reservar Clase'}</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs: Temario & Klausur (default) vs Astrophysical Labs */}
          <div className="px-4 sm:px-5 py-2 bg-slate-950/80 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
              <button
                onClick={() => setActivePhysicsTab('syllabus')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activePhysicsTab === 'syllabus'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📚 {lang === 'en' ? 'Course Syllabus & Pricing' : 'Temario de la Clase & Tarifas'}
              </button>
              <button
                onClick={() => setActivePhysicsTab('dcl')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activePhysicsTab === 'dcl'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📐 {lang === 'en' ? '3D Physics (DCL)' : 'Física del Astro (DCL)'}
              </button>
              <button
                onClick={() => setActivePhysicsTab('magnetism')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activePhysicsTab === 'magnetism'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧲 {lang === 'en' ? 'MHD & Space' : 'Magnetismo'}
              </button>
              <button
                onClick={() => setActivePhysicsTab('nuclear')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activePhysicsTab === 'nuclear'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚛️ {lang === 'en' ? 'Core Physics' : 'Física Nuclear'}
              </button>
            </div>

            {lineupZoomed && (
              <button
                onClick={() => {
                  setLineupZoomed(false);
                  animStateRef.current.lineupZoomed = false;
                }}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>←</span>
                <span>{lang === 'en' ? 'Back to Panoramic Lineup' : 'Volver a la Fila de Astros'}</span>
              </button>
            )}
          </div>

          {/* TAB CONTENT AREA */}
          <div className={`${isCompact ? 'p-4' : 'p-4 sm:p-5'} text-slate-300 font-mono text-xs`}>
            {activePhysicsTab === 'syllabus' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {courseDesc}
                </p>

                {syllabusList.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{lang === 'en' ? 'Topics Covered in Class:' : 'Temas que cubrimos en esta clase:'}</span>
                    </div>
                    <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-2`}>
                      {syllabusList.map((topic, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-900/75 border border-slate-800/90 flex items-start gap-2 text-[11px] text-slate-200 font-sans"
                        >
                          <span className="text-sky-400 font-mono font-bold mt-0.5">0{idx + 1}.</span>
                          <span className="leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {skriptKeywords.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">
                      {lang === 'en' ? 'Core Concepts:' : 'Conceptos Clave:'}
                    </span>
                    {skriptKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-sky-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-sans">
                    <span>{lang === 'en' ? '🎯 1-on-1 Online Format (iPad + LaTeX whiteboard + live code)' : '🎯 Modalidad 1-a-1 online (iPad + pizarra LaTeX + código en vivo)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onSelectSubject) onSelectSubject(activePlanet);
                        if (onNavigate) {
                          onNavigate('courses');
                        } else {
                          window.location.hash = '#/courses';
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer"
                    >
                      {lang === 'en' ? 'Full Course Catalog →' : 'Ver en Catálogo Completo →'}
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenBooking && activeCourse) {
                          onOpenBooking(activeCourse);
                        } else if (onOpenBooking) {
                          onOpenBooking({ code: courseCode, titleEn: courseTitle });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {lang === 'en' ? 'Schedule 1-on-1 Session →' : 'Agendar Tutoría de este Curso →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: DCL & NEWTON */}
            {activePhysicsTab === 'dcl' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-[11px] tracking-wider uppercase">
                    <span>📐</span>
                    <span>{lang === 'en' ? 'FREE BODY DIAGRAM & ASTRODYNAMICS' : 'DIAGRAMA DE CUERPO LIBRE & ASTRODINÁMICA'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-400">{lang === 'en' ? 'Orbit Radius:' : 'Radio Orbital:'} <strong className="text-slate-200">{liveTelemetry.rAU}</strong> ({astroData.r_millionKm} Mkm)</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Orbital Speed:' : 'Velocidad Orbital:'} <strong className="text-emerald-400">{liveTelemetry.velKms}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold">{lang === 'en' ? 'Gravitational Force (Fg)' : 'Fuerza Gravitacional (Fg)'}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs" />
                    </div>
                    <div className="text-[10px] text-slate-400">Fg = G · (M☉ · m) / r²</div>
                    <div className="text-sm font-bold text-white tracking-wide">{astroData.F_gravityScientific} N</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold">{lang === 'en' ? 'Centripetal Acceleration (ac)' : 'Aceleración Centrípeta (ac)'}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs" />
                    </div>
                    <div className="text-[10px] text-slate-400">ac = v² / r</div>
                    <div className="text-sm font-bold text-white tracking-wide">{astroData.a_centripetalScientific} m/s²</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{lang === 'en' ? 'Angular Momentum (L)' : 'Momento Angular (L)'}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
                    </div>
                    <div className="text-[10px] text-slate-400">L = r × m·v</div>
                    <div className="text-sm font-bold text-white tracking-wide">{astroData.L_angularScientific} kg·m²/s</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 text-[11px] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sky-200">
                    {lang === 'en'
                      ? `Escape Velocity v_esc = ${astroData.v_escapeKms} km/s.`
                      : `Velocidad de Escape Solar v_esc = ${astroData.v_escapeKms} km/s.`}
                  </span>
                  <button
                    onClick={() => setShowDcl(!showDcl)}
                    className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                  >
                    {showDcl
                      ? (lang === 'en' ? 'Hide 3D Vectors' : 'Ocultar Vectores 3D')
                      : (lang === 'en' ? 'Show 3D Vectors' : 'Mostrar Vectores 3D')}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MAGNETOHYDRODYNAMICS & SPACE WEATHER */}
            {activePhysicsTab === 'magnetism' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-amber-400 font-bold block">{lang === 'en' ? 'Surface Dipole Field (B)' : 'Campo Dipolar Superficial (B)'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">
                      {activePlanet.magneticFieldTesla || (lang === 'en' ? 'Negligible (< 10⁻⁹ T)' : 'Inapreciable (< 10⁻⁹ T)')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-sky-400 font-bold block">{lang === 'en' ? 'Bow Shock' : 'Choque de Proa (Bow Shock)'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">
                      {isCmeActive
                        ? (lang === 'en' ? '5.8 R_E (Sub-geostationary)' : '5.8 R_E (Sub-geoestacionario)')
                        : (lang === 'en' ? '10 - 12 R_E (Nominal)' : '10 - 12 R_E (Nominal)')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-rose-400 font-bold block">{lang === 'en' ? 'Geomagnetic Polarity' : 'Polaridad Geomagnética'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">
                      {magneticPolarity === 1
                        ? (lang === 'en' ? 'Normal (North in South geo)' : 'Normal (Norte en Sur geo)')
                        : (lang === 'en' ? 'Reversed (Reversal Phase)' : 'Invertida (Fase Reversa)')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NUCLEAR PHYSICS & SOLAR CORE */}
            {activePhysicsTab === 'nuclear' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-amber-400 font-bold block">{lang === 'en' ? 'Hydrostatic Equilibrium' : 'Equilibrio Hidrostático'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">∇P = -ρ · g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-rose-400 font-bold block">{lang === 'en' ? 'Proton-Proton Chain (p-p)' : 'Cadena Protón-Protón (p-p)'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">Q = +26.73 MeV</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-sky-400 font-bold block">{lang === 'en' ? 'Matter to Energy Conversion' : 'Conversión Materia a Energía'}</span>
                    <div className="text-sm font-bold text-white tracking-wide">4.26 × 10⁹ kg / s</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        isRealScale
          ? 'fixed inset-0 z-50 w-screen h-screen bg-[#010204] flex flex-col overflow-hidden select-none'
          : 'w-full flex flex-col bg-black overflow-hidden border-y border-slate-800 shadow-2xl selection:bg-sky-500/30'
      }
    >
      {/* ==================================================================== */}
      {/* 1. TOP HEADER: INTEGRATED TOGGLE (MODO CLASES ↔ MODO PLANETARIO)     */}
      {/* ==================================================================== */}
      {!isRealScale && (
        <div className="px-3 py-2.5 sm:px-5 sm:py-3 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md relative z-40 flex flex-wrap items-center justify-between gap-2.5">
          {/* Mode Title & Active Context */}
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-sm ${
                viewVariant === 'orbital'
                  ? 'bg-purple-400 shadow-purple-400/80'
                  : 'bg-emerald-400 shadow-emerald-400/80'
              }`}
            />
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider uppercase">
                {viewVariant === 'orbital'
                  ? (lang === 'en' ? 'Observatory of the Cosmos • Courses & Physics' : 'Observatorio del Cosmos • Cursos & Física')
                  : (lang === 'en' ? 'Interactive Courses by Celestial Body' : 'Explorador de Clases por Astro')}
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-300">
                {viewVariant === 'orbital' ? archLevel.toUpperCase() : '7 PLANETAS'}
              </span>
            </div>
          </div>

          {/* Right Action Controls: Toggle Planetario / Clases & Intro Replay */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Replay Intro Animation button */}
            <button
              onClick={replayIntroAnimation}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-mono text-xs font-medium transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title={lang === 'en' ? 'Replay intro animation' : 'Volver a reproducir la animación de inicio'}
              aria-label={lang === 'en' ? 'Replay intro' : 'Repetir intro'}
            >
              <span className="text-sm leading-none">🔁</span>
            </button>

            {/* Toggle between Modo Clases and Modo Planetario */}
            {viewVariant === 'orbital' ? (
              <button
                onClick={() => {
                  setViewVariant('option3');
                  setLineupZoomed(false);
                  animStateRef.current.lineupZoomed = false;
                  setActivePhysicsTab('syllabus');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎓</span>
                <span>{lang === 'en' ? 'Back to All Subjects & Planets →' : 'Ver Todos los Astros & Materias →'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setViewVariant('orbital');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 hover:text-white font-mono text-xs font-bold shadow-md shadow-purple-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Explora el sistema solar con sus órbitas elípticas, vectores DCL de fuerzas, magnetosfera y simulaciones"
              >
                <span>🌌</span>
                <span>{lang === 'en' ? 'Open Planetarium (Orbits & Physics) →' : 'Ir al Planetario (Órbitas & Física) →'}</span>
              </button>
            )}

            {/* In Orbital mode, show physical level selector and physics toggle */}
            {viewVariant === 'orbital' && (
              <>
                <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px]">
                  <button
                    onClick={() => {
                      setArchLevel('planetary');
                      animStateRef.current.isTransitioning = true;
                    }}
                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                      archLevel === 'planetary'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌍 {lang === 'en' ? 'Planet' : 'Planetario'}
                  </button>
                  <button
                    onClick={() => {
                      setArchLevel('solar');
                      animStateRef.current.isTransitioning = true;
                    }}
                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                      archLevel === 'solar'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ☀️ {lang === 'en' ? 'Solar' : 'Solar'}
                  </button>
                  <button
                    onClick={() => {
                      setArchLevel('galaxy');
                      animStateRef.current.isTransitioning = true;
                    }}
                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                      archLevel === 'galaxy'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌌 {lang === 'en' ? 'Galaxy' : 'Galaxia'}
                  </button>
                </div>

                <button
                  onClick={() => setShowControls(!showControls)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{showControls ? '▲ Options' : '⚙️ Options ▾'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* EXPANDABLE TECHNICAL DRAWER IN ORBITAL MODE */}
      {viewVariant === 'orbital' && showControls && !isRealScale && (
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800/80 space-y-3 z-30">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isRealScale;
                setIsRealScale(nextState);
                animStateRef.current.isTransitioning = true;
                setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
              }}
              className="px-3 py-1 rounded-lg border font-mono text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 cursor-pointer"
            >
              🔭 Escala Real 1:1
            </button>
            <button
              onClick={() => {
                const nextVal = !visualPhysicMode;
                setVisualPhysicMode(nextVal);
                setShowDcl(nextVal);
                animStateRef.current.visualPhysicMode = nextVal;
                animStateRef.current.showDcl = nextVal;
                if (nextVal) setActivePhysicsTab('dcl');
              }}
              className={`px-3 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                visualPhysicMode
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              ⚛️ Visual Physic mode
            </button>
            <button
              onClick={() => {
                const nextVal = !magneticFieldMode;
                setMagneticFieldMode(nextVal);
                setShowMagnetosphere(nextVal);
                animStateRef.current.magneticFieldMode = nextVal;
                animStateRef.current.showMagnetosphere = nextVal;
                if (nextVal) setActivePhysicsTab('magnetism');
              }}
              className={`px-3 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                magneticFieldMode
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              🧲 Magnetic Field mode
            </button>
            <button
              onClick={() => setIsGalacticDriftActive(!isGalacticDriftActive)}
              className="px-3 py-1 rounded-lg border font-mono text-[11px] bg-slate-900 text-slate-400 border-slate-800 cursor-pointer"
            >
              {isGalacticDriftActive ? '🌀 Órbita: Activa' : '⏸ Órbita: Pausada'}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] cursor-pointer"
            >
              {isPaused ? '▶ Play' : '⏸ Pause'}
            </button>
            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2.5 : 1)}
              className="px-3 py-1 rounded-lg border font-mono text-[11px] bg-slate-900 text-slate-400 border-slate-800 cursor-pointer"
            >
              {speedMultiplier > 1 ? '⚡ 2.5x Warp' : '1.0x Real'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 mr-1.5 uppercase">Astro:</span>
            {PLANET_SUBJECTS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all border cursor-pointer ${
                  activePlanet.id === planet.id
                    ? 'bg-sky-600 text-white border-sky-400 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {planet.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. REAL SCALE EXPLANATORY BANNER                                     */}
      {/* ==================================================================== */}
      {isRealScale && (
        <div className="bg-gradient-to-r from-rose-950/95 via-slate-950/95 to-purple-950/95 border-b border-rose-500/40 p-4 sm:p-5 backdrop-blur-xl text-white font-mono text-xs shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-4xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold tracking-wider text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LEYENDA DE ESCALA FÍSICA REAL 1:1 ({archLevel.toUpperCase()})</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
              {archLevel === 'galaxy'
                ? 'NIVEL GALAXIA: Sagittarius A* tiene un horizonte de sucesos masivo y una masa de 4.15 millones de soles. En la escala real, el Sol se encuentra a 26,000 años luz (~1.68×10⁹ UA) orbitando a 230 km/s.'
                : (archLevel === 'solar'
                    ? 'NIVEL SOLAR: Si el Sol tuviera este tamaño visual (~10 metros de radio), la Tierra sería una mota de 13 milímetros a casi 200 metros de distancia.'
                    : 'NIVEL PLANETARIO: La Tierra y la Luna se muestran con sus diámetros proporcionales reales (la Luna a 60 radios terrestres de distancia).'
                  )}
            </p>
          </div>
          <button
            onClick={() => {
              setIsRealScale(false);
              setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shrink-0 cursor-pointer"
          >
            ✕ Salir de Escala Real
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MAIN 3D COSMIC VIEWPORT                                           */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={`relative w-full bg-black overflow-hidden transition-all duration-500 ${
            isRealScale
              ? 'flex-1'
              : viewVariant === 'option3'
                ? 'h-[560px] sm:h-[660px] md:h-[740px] lg:h-[820px]'
                : 'h-[540px] sm:h-[640px] md:h-[720px] lg:h-[800px]'
          }`}
          style={{ containerType: 'size' }}
        >
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* SHOWCASE INSTRUCTION BANNER (FADES IN SMOOTHLY ONCE PLANETS ALIGN) */}
          {isShowcaseMode && !lineupZoomed && (
            <div
              ref={lineupUiTopRef}
              style={{ opacity: 0 }}
              className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3 w-full max-w-2xl flex justify-center transition-opacity duration-300"
            >
              <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-sky-500/40 backdrop-blur-md shadow-lg flex items-center gap-2 text-xs text-slate-200 font-mono">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
                <span>{lang === 'en' ? 'Click any celestial body (or its card) to zoom in 3D and view its syllabus' : 'Haz click en cualquier astro (o su tarjeta) para hacer zoom 3D y abrir su clase'}</span>
              </div>
            </div>
          )}

          {/* 3D-TRACKED FLOATING COURSE BADGES UNDER EACH OF THE 7 PLANETS */}
          {isShowcaseMode && !lineupZoomed && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {LINEUP_PLANETS.map((planet) => {
                const isSelected = activePlanet.id === planet.id;
                return (
                  <button
                    key={planet.id}
                    ref={(el) => {
                      lineupLabelsRef.current[planet.id] = el;
                    }}
                    onClick={() => handleSelectPlanet(planet, true)}
                    style={{ left: 0, top: 0, opacity: 0 }}
                    className={`absolute pointer-events-auto px-2.5 py-1.5 rounded-xl border backdrop-blur-md transition-colors duration-200 text-center cursor-pointer select-none min-w-[104px] sm:min-w-[122px] max-w-[144px] ${
                      isSelected
                        ? 'bg-sky-950/95 border-sky-400 text-white shadow-lg shadow-sky-500/30 ring-1 ring-sky-300/60'
                        : 'bg-slate-950/85 border-slate-700/80 text-slate-200 hover:border-sky-400/70 hover:bg-slate-900/95'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[9px] font-mono uppercase tracking-wider text-sky-300">
                      <span>{planet.emoji}</span>
                      <span className="truncate">{getPlanetShortName(planet, lang)}</span>
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight line-clamp-1 mt-0.5">
                      {lang === 'en' ? planet.shortCourseEn : planet.shortCourseEs}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-semibold mt-0.5">
                      €{planet.rateHourly}/h · {planet.courseCode}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* OPTION 3: ZOOMED SIDE OVERLAY PANEL (SLIDES IN ON THE RIGHT WHEN A PLANET IS CLICKED) */}
          {isShowcaseMode && lineupZoomed && (
            <div className="absolute inset-y-3 right-3 left-3 lg:left-auto lg:w-[58%] xl:w-[55%] z-30 bg-slate-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-y-auto flex flex-col">
              {/* Top quick switcher inside zoomed Option 3 */}
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setLineupZoomed(false);
                    animStateRef.current.lineupZoomed = false;
                  }}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>←</span>
                  <span>{lang === 'en' ? 'View Celestial Bodies in Line' : 'Ver Astros en Fila'}</span>
                </button>

                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {LINEUP_PLANETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPlanet(p, true)}
                      title={lang === 'en' ? p.shortCourseEn : p.shortCourseEs}
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all cursor-pointer shrink-0 ${
                        activePlanet.id === p.id
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.emoji} {getPlanetShortName(p, lang)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {renderCourseDossier(true)}
              </div>
            </div>
          )}

          {/* OPTION 3 UNZOOMED BOTTOM PROMPT BAR (FADES IN ONCE PLANETS ALIGN) */}
          {isShowcaseMode && !lineupZoomed && (
            <div
              ref={lineupUiBottomRef}
              style={{ opacity: 0 }}
              className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-3xl bg-slate-950/90 border border-slate-800/90 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3 transition-opacity duration-300"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{activePlanet.emoji || '🌍'}</span>
                <div>
                  <div className="text-xs font-bold text-white">
                    {getPlanetName(activePlanet, lang)}:{' '}
                    <span className="text-sky-300">
                      {lang === 'en' ? activePlanet.shortCourseEn : activePlanet.shortCourseEs}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {lang === 'en' ? 'Click any planet in the 3D row to zoom in and open its syllabus.' : 'Haz click en cualquier planeta de la fila 3D para acercar la cámara y abrir su temario.'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewVariant('orbital')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 font-mono text-xs transition-all cursor-pointer"
                >
                  {lang === 'en' ? '🌌 View Orbits' : '🌌 Ver Órbitas'}
                </button>
                <button
                  onClick={() => {
                    setLineupZoomed(true);
                    animStateRef.current.lineupZoomed = true;
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'en' ? `🔍 Syllabus: ${getPlanetShortName(activePlanet, lang)} →` : `🔍 Ver Temario de ${getPlanetShortName(activePlanet, lang)} →`}
                </button>
              </div>
            </div>
          )}

          {/* ORBITAL MODE OVERLAYS */}
          {viewVariant === 'orbital' && (
            <>
              <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pointer-events-auto px-3 max-w-full">
                <button
                  onClick={() => {
                    setViewVariant('option3');
                    setLineupZoomed(false);
                    animStateRef.current.lineupZoomed = false;
                  }}
                  className="group px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-sky-400/80 hover:border-sky-300 text-white font-mono text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>{lang === 'en' ? '🎓 Back to 7 Courses (Align Planets)' : '🎓 Volver a las 7 Clases (Alinear Planetas)'}</span>
                  <span className="text-sky-400 group-hover:translate-x-1 transition-transform text-xs">→</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenBooking) {
                      onOpenBooking({ code: 'THESIS', titleEn: "Master's Thesis & Research Mentoring" });
                    } else if (onNavigate) {
                      onNavigate('courses');
                    } else {
                      window.location.hash = '#/courses';
                    }
                  }}
                  className="group px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-emerald-400/60 hover:border-emerald-300 text-white font-mono text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'en' ? 'Project / Thesis Mentoring' : 'Tutoría de proyectos / tesis'}</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform text-xs">→</span>
                </button>
              </div>

              {cmeToast && (
                <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-amber-950/90 border border-amber-400 text-amber-200 font-mono text-xs sm:text-sm shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="font-bold tracking-wide">{cmeToast}</span>
                </div>
              )}

              <div
                className="absolute inset-x-0 top-0 bg-black pointer-events-none z-20"
                style={{ height: letterbox ? 'max(0px, calc((100cqh - 100cqw / 2.39) / 2))' : '0px', transition: 'height 900ms cubic-bezier(.65,0,.35,1)' }}
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-black pointer-events-none z-20"
                style={{ height: letterbox ? 'max(0px, calc((100cqh - 100cqw / 2.39) / 2))' : '0px', transition: 'height 900ms cubic-bezier(.65,0,.35,1)' }}
              />

              {caption && (
                <div
                  key={caption.key}
                  className="absolute inset-x-0 bottom-16 sm:bottom-20 z-30 flex flex-col items-center text-center pointer-events-none px-6"
                  style={{ animation: 'cineCaption 5.2s ease-in-out forwards', fontFamily: CINE_FONT }}
                >
                  <span className="text-[10px] sm:text-xs tracking-[0.42em] uppercase text-white/90">{caption.title}</span>
                  <span className="mt-1.5 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-sky-200/60">{caption.sub}</span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 sm:right-4 z-30 flex flex-wrap justify-end items-center gap-1.5 text-[10px]" style={{ fontFamily: CINE_FONT }}>
                <div className="hidden md:flex items-center gap-1 bg-black/55 backdrop-blur-md border border-white/10 rounded-full px-1 py-1">
                  <span className="px-2 text-white/40 tracking-[0.25em] uppercase">{lang === 'en' ? 'Shots' : 'Planos'}</span>
                  <button onClick={() => triggerShot('backlit')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider">
                    {lang === 'en' ? 'Backlit' : 'Contraluz'}
                  </button>
                  <button onClick={() => triggerShot('ecliptic')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider">
                    {lang === 'en' ? 'Ecliptic' : 'Eclíptica'}
                  </button>
                  <button onClick={() => triggerShot('gargantua')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider">
                    Gargantúa
                  </button>
                </div>
                <button
                  onClick={() => setCinemaMode(v => !v)}
                  className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] uppercase transition-colors ${cinemaMode ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
                >
                  Cine
                </button>
                <button
                  onClick={() => setLetterbox(v => !v)}
                  className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] transition-colors ${letterbox ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
                >
                  2.39:1
                </button>
                <button
                  onClick={toggleAudio}
                  className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] uppercase transition-colors ${audioOn ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
                >
                  {audioOn ? '♪ On' : '♪ Off'}
                </button>
              </div>
            </>
          )}

          {/* Intro: fade from absolute black */}
          {!introDone && (
            <div
              className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center pointer-events-none px-4 select-none"
              style={{ animation: 'cineIntro 5.2s ease-in-out forwards', fontFamily: CINE_FONT }}
              onAnimationEnd={() => setIntroDone(true)}
            >
              {/* Epígrafe / Subtítulo: Observatory of the Cosmos */}
              <div className="flex items-center gap-2 mb-2 text-sky-400 text-[10px] sm:text-xs tracking-[0.45em] uppercase font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>{lang === 'en' ? 'OBSERVATORY OF THE COSMOS' : 'OBSERVATORIO DEL COSMOS'}</span>
              </div>

              {/* Título Principal: Conexión explícita con los Cursos y Mentorías */}
              <h2 className="text-white text-base sm:text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-center max-w-2xl leading-relaxed drop-shadow-[0_2px_14px_rgba(56,189,248,0.3)]">
                {lang === 'en'
                  ? 'ACADEMIC COURSES & MENTORSHIP BY CELESTIAL BODY'
                  : 'CURSOS Y MENTORÍAS CIENTÍFICAS POR ASTRO'}
              </h2>

              {/* Bajada Descriptiva */}
              <p className="mt-2 text-slate-300 text-[9px] sm:text-[11px] tracking-[0.25em] uppercase text-center font-mono max-w-xl">
                {lang === 'en'
                  ? 'Higher Physics • Advanced Calculus • Geophysics • 1-on-1 Mentorship'
                  : 'Física Superior • Cálculo Avanzado • Geofísica • Clases 1 a 1'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. BOTTOM PANEL: DOSSIER IN ORBITAL MODE                             */}
      {/* ==================================================================== */}
      {activePlanet && !isRealScale && viewVariant === 'orbital' && (
        <div className="bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md text-left transition-all">
          {renderCourseDossier(false)}
        </div>
      )}
    </div>
  );
}


