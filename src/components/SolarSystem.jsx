import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

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
// 1. ASTROPHYSICAL & ACADEMIC METADATA
// ============================================================================
export const PLANET_SUBJECTS = [
  {
    id: 'sun',
    name: 'Sol (The Sun)',
    spectralClass: 'G2V Main Sequence Star',
    academicAreaEn: 'Foundational Physics & Computational Core',
    academicAreaEs: 'Física Fundamental y Núcleo Computacional',
    courseId: 'computational',
    descriptionEn: 'The central thermonuclear engine: Differential calculus, vector fields, magnetohydrodynamics, and high-performance Python simulation.',
    descriptionEs: 'El motor termonuclear central: Cálculo diferencial, campos vectoriales, magnetohidrodinámica y simulación científica en Python.',
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
  },
  {
    id: 'mercury',
    name: 'Mercury',
    spectralClass: 'Hermian Silicate Regolith',
    academicAreaEn: 'Advanced Analytical Mechanics & Relativity',
    academicAreaEs: 'Mecánica Analítica Avanzada y Relatividad',
    courseId: 'mechanics',
    descriptionEn: 'Relativistic perihelion precession (Einstein 43"/century), Lagrangian & Hamiltonian formalisms, and perturbation theory.',
    descriptionEs: 'Precesión relativista del perihelio (43"/siglo), formalismo Lagrangiano y Hamiltoniano, y teoría analítica de perturbaciones.',
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
  },
  {
    id: 'venus',
    name: 'Venus',
    spectralClass: 'Supercritical Greenhouse Atmosphere',
    academicAreaEn: 'Non-Linear Thermodynamics & Chaotic Planetary Systems',
    academicAreaEs: 'Termodinámica No Lineal y Sistemas Planetarios Caóticos',
    courseId: 'thermodynamics',
    descriptionEn: 'Runaway greenhouse thermal dynamics, Navier-Stokes fluid transitions, high-pressure phase equilibria, and retrograde atmospheric super-rotation.',
    descriptionEs: 'Termodinámica de efecto invernadero desbocado, transiciones fluidas de Navier-Stokes, equilibrio de fases a 92 bar y superrotación atmosférica.',
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
  },
  {
    id: 'earth',
    name: 'Earth',
    spectralClass: 'Active Biosphere / Human Civilization',
    academicAreaEn: 'Höhere Mathematik & Classical Mechanics (TU9 Core)',
    academicAreaEs: 'Höhere Mathematik y Mecánica Clásica (Núcleo TU9)',
    courseId: 'klausur',
    descriptionEn: 'Rigorous multivariable calculus, Gauss/Stokes integral theorems, linear algebra, and German Klausur preparation (TUM, RWTH, KIT).',
    descriptionEs: 'Cálculo multivariable riguroso, teoremas integrales de Gauss/Stokes, álgebra lineal y preparación exhaustiva de exámenes alemanes (Klausuren).',
    color: '#38BDF8',
    size: 1.15,
    distance: 15.0,
    speed: 1.25,
    eccentricity: 0.0167,
    inclination: 0.0,
    axialTilt: 23.44,
    hasClouds: true,
    hasAtmosphere: true,
    hasMoon: true,
    hasSatellites: true,
    orbitalPeriod: '365.25 days',
    temperatureK: '288 K (Mean)',
    semiMajorAxisAU: '1.000 AU',
    orbitalSpeedKms: '29.8 km/s',
    realSize: 0.13,
    realDistance: 195,
  },
  {
    id: 'mars',
    name: 'Mars',
    spectralClass: 'Oxidized Ferric Crust',
    academicAreaEn: 'Applied Geophysics, Seismology & Inverse Theory',
    academicAreaEs: 'Geofísica Aplicada, Sismología y Problemas Inversos',
    courseId: 'geophysics',
    descriptionEn: 'Planetary interior modeling, seismic wave propagation, elastic tensors, crustal dichotomy, and geophysical inversion algorithms.',
    descriptionEs: 'Modelado del interior planetario, propagación de ondas sísmicas, tensores elásticos e inversión de datos geofísicos.',
    color: '#E05A36',
    size: 0.82,
    distance: 19.8,
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
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    spectralClass: 'Jovian Gas Giant (H/He Fluid Mantle)',
    academicAreaEn: 'Continuum Mechanics, PDEs & Fluid Dynamics',
    academicAreaEs: 'Mecánica de Medios Continuos, EDPs y Fluidos',
    courseId: 'pde',
    descriptionEn: 'Navier-Stokes equations, atmospheric Kelvin-Helmholtz vorticity, magnetohydrodynamics (MHD), and planetary boundary layer dynamics.',
    descriptionEs: 'Ecuaciones de Navier-Stokes, turbulencia zonal de Kelvin-Helmholtz, magnetohidrodinámica (MHD) y dinámica de capas límite.',
    color: '#D97706',
    size: 2.65,
    distance: 31.5,
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
  },
  {
    id: 'saturn',
    name: 'Saturn',
    spectralClass: 'Ringed Chronian Gas Giant',
    academicAreaEn: 'Orbital Resonances & Differential Geometry',
    academicAreaEs: 'Resonancias Orbitales y Geometría Diferencial',
    courseId: 'geometry',
    descriptionEn: 'Ring density wave resonance (Lindblad / Cassini division), Hamiltonian chaos, differential 2-forms, and Riemannian curvature tensors.',
    descriptionEs: 'Dinámica resonante de anillos (ondas de densidad de Lindblad / Cassini), caos Hamiltoniano, geometría de variedades y tensores de curvatura.',
    color: '#FDE68A',
    size: 2.15,
    distance: 43.5,
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
  },
  {
    id: 'neptune',
    name: 'Neptune',
    spectralClass: 'Deep Methane/Ammonia Cryogenic Giant',
    academicAreaEn: 'Spectral Methods & Cryogenic Fluid Dynamics',
    academicAreaEs: 'Métodos Espectrales e Hidrodinámica Criogénica',
    courseId: 'fluid_dynamics',
    descriptionEn: 'Supersonic zonal winds (2,100 km/h), baroclinic instability, spherical harmonics decomposition, and deep ice giant mantle convection.',
    descriptionEs: 'Vientos zonales supersónicos (2.100 km/h), inestabilidad baroclínica, armónicos esféricos y convección profunda en mantos de hielo.',
    color: '#38BDF8',
    size: 1.85,
    distance: 54.0,
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
  },
  {
    id: 'blackhole',
    name: 'Sagittarius A* (Galactic Center)',
    spectralClass: 'Supermassive Kerr Black Hole (4.15×10⁶ M☉)',
    academicAreaEn: 'General Relativity, Gravitational Waves & Black Holes',
    academicAreaEs: 'Relatividad General, Ondas Gravitacionales y Agujeros Negros',
    courseId: 'relativity',
    descriptionEn: 'The supermassive gravitational anchor of the Milky Way (26,000 light-years away). Schwarzschild & Kerr spacetime metrics, event horizon shadow, gravitational lensing photon sphere, and relativistic Doppler accretion.',
    descriptionEs: 'El ancla gravitatoria supermasiva de la Vía Láctea (a 26.000 años luz). Métricas de Schwarzschild y Kerr, sombra del horizonte de sucesos, curvatura gravitacional de la luz (lente de Einstein) y acreción relativista Doppler.',
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
  }
];

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
  grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.35, 'rgba(210, 230, 255, 0.25)');
  grad.addColorStop(0.7, 'rgba(150, 190, 255, 0.05)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
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
    const lat = ((y / 512) - 0.5) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const turb = noise.fbm2D((x / 1024) * 12.0, lat * 8.0, 4, 0.5, 2.0) * 0.08;
      const band = Math.sin(lat * 22.0 + turb) * 0.5 + 0.5;

      const r = Math.floor(245 - band * 20 + turb * 20);
      const g = Math.floor(226 - band * 25 + turb * 15);
      const b = Math.floor(180 - band * 30 + turb * 15);

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

    if (u < 0.16) {
      r = 205; g = 190; b = 160; alpha = Math.floor(u * 2.5 * 140);
    } else if (u < 0.56) {
      const ringlet = Math.sin(u * 380.0) * 15 + Math.sin(u * 920.0) * 8;
      r = Math.min(255, Math.floor(250 + ringlet * 0.4));
      g = Math.min(255, Math.floor(235 + ringlet * 0.3));
      b = Math.min(255, Math.floor(195 + ringlet * 0.3));
      alpha = 250;
    } else if (u < 0.63) {
      r = 10; g = 10; b = 10; alpha = 4;
    } else if (u < 0.94) {
      const isEncke = u > 0.81 && u < 0.83;
      if (isEncke) {
        r = 12; g = 12; b = 12; alpha = 6;
      } else {
        const ringlet = Math.sin(u * 280.0) * 12;
        r = Math.min(255, Math.floor(232 + ringlet));
        g = Math.min(255, Math.floor(215 + ringlet * 0.8));
        b = Math.min(255, Math.floor(175 + ringlet * 0.6));
        alpha = 210;
      }
    } else {
      r = 210; g = 195; b = 165; alpha = Math.floor((1.0 - u) * 140);
    }

    for (let y = 0; y < 64; y++) {
      const idx = (y * 1024 + x) * 4;
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = Math.min(255, Math.max(0, alpha));
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

      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float mu = max(0.0, dot(vNormal, viewDir));
      float limbFactor = pow(mu, 0.62);

      vec3 color = mix(uColorMid, uColorCore, pow(plasma, 2.2) * 1.5);
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
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(-vWorldPosition);

      float nDotL = dot(normal, sunDir);
      float dayFactor = smoothstep(-0.18, 0.22, nDotL);
      float nightFactor = smoothstep(0.15, -0.18, nDotL);

      vec4 dayColor = texture2D(uDayMap, vUv);
      vec4 nightLights = texture2D(uNightMap, vUv);

      float isOcean = step(dayColor.r, 0.14) * (1.0 - step(dayColor.b, 0.25));
      vec3 halfVector = normalize(sunDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfVector)), 24.0) * isOcean * dayFactor;

      vec3 litDay = dayColor.rgb * (dayFactor * 4.4 + 0.42) + spec * vec3(1.0, 0.95, 0.85);
      vec3 nightSilhouette = dayColor.rgb * 0.35;
      vec3 litNight = nightSilhouette + nightLights.rgb * nightFactor * 2.8;

      vec3 finalColor = mix(litNight, litDay, dayFactor);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// PHOTOREALISTIC INTERSTELLAR (KIP THORNE) RELATIVISTIC ACCRETION DISK SHADER
const GargantuaDiskShader = {
  uniforms: {
    uTime: { value: 0 },
    uInnerRadius: { value: 9.0 },
    uOuterRadius: { value: 34.0 },
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
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      float r = length(vPosition.xz);
      float angle = atan(vPosition.z, vPosition.x);

      // Relativistic Keplerian differential flow (inner plasma orbits much faster)
      float omega = 3.8 / pow(max(1.0, r * 0.15), 1.4);
      float flowAngle = angle - uTime * omega;

      // Turbulent plasma spiral streamers (MRI instability)
      float spiral = sin(flowAngle * 7.0 + r * 2.4) * cos(flowAngle * 3.0 - r * 1.6);
      float filament = sin(flowAngle * 16.0 + sin(r * 5.0));
      float plasma = 0.5 + 0.32 * spiral + 0.18 * filament;

      // Temperature gradient:
      // Inner edge (ISCO) is blistering hot white-cyan (> 10^7 K)
      // Mid-disk is golden-white and amber
      // Outer disk cools down to deep crimson/terracotta
      float rNorm = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
      vec3 cHot = vec3(1.0, 0.98, 0.94);
      vec3 cMid = vec3(1.0, 0.58, 0.08);
      vec3 cCool = vec3(0.68, 0.12, 0.01);
      vec3 diskColor = mix(cHot, cMid, pow(rNorm, 0.65));
      diskColor = mix(diskColor, cCool, pow(rNorm, 2.2));

      // Relativistic Doppler Beaming (Kip Thorne effect):
      // Approaching side is Doppler boosted (intensely brightened and blue-shifted)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 tangent = normalize(vec3(-vPosition.z, 0.0, vPosition.x));
      float dopplerFactor = dot(tangent, -viewDir);
      float beaming = exp(dopplerFactor * 0.95);
      diskColor *= beaming;

      // Soft ISCO edge cutoff and outer fade
      float alpha = smoothstep(uInnerRadius - 0.4, uInnerRadius + 1.2, r) *
                    smoothstep(uOuterRadius, uOuterRadius - 6.0, r) *
                    (0.85 + 0.15 * plasma);

      gl_FragColor = vec4(diskColor * 2.2, alpha * 0.96);
    }
  `
};

// EINSTEIN GRAVITATIONAL LENSING HALO SHADER (INTERSTELLAR BENT LIGHT ARCH)
const GravitationalLensingShader = {
  uniforms: {
    uTime: { value: 0 },
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
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - abs(dot(normalize(vNormal), viewDir));
      float intensity = pow(rim, 2.2);

      // Relativistic Doppler asymmetry across the Einstein halo arch
      float doppler = 1.0 + 0.65 * dot(normalize(vPosition), vec3(1.0, 0.0, 0.0));

      vec3 haloColor = mix(vec3(1.0, 0.55, 0.08), vec3(1.0, 0.96, 0.85), rim);
      gl_FragColor = vec4(haloColor * doppler * 2.5, intensity * 0.92);
    }
  `
};

// ============================================================================
// 5. MAIN OBSERVATORY COMPONENT
// ============================================================================
export default function SolarSystem({ onSelectSubject, selectedSubjectId, lang = 'en' }) {
  const containerRef = useRef(null);
  const [activePlanet, setActivePlanet] = useState(PLANET_SUBJECTS[3]); // Earth
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
  const audioRef = useRef(null);

  const animStateRef = useRef({
    activePlanet: PLANET_SUBJECTS[3],
    isPaused: false,
    speedMultiplier: 1,
    archLevel: 'solar',
    isRealScale: false,
    isGalacticDriftActive: true,
    galacticAngle: 0.85,
    isTransitioning: true, // intro fly-in
    cinemaMode: true,
    shot: null,
    autoOrbit: false,
  });

  useEffect(() => {
    animStateRef.current.cinemaMode = cinemaMode;
  }, [cinemaMode]);

  // Cinematic scientific subtitles
  useEffect(() => {
    if (!introDone) return;
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
  }, [archLevel, activePlanet.id, isRealScale, introDone, lang]);

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
      if (match) {
        handleSelectPlanet(match);
      }
    }
  }, [selectedSubjectId]);

  const handleSelectPlanet = (planet) => {
    setActivePlanet(planet);
    animStateRef.current.isTransitioning = true;
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

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
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
    // STARFIELD & MILKY WAY
    // ========================================================================
    const starSprite = createStarSpriteTexture();
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const spectralColors = [
      new THREE.Color(0.68, 0.78, 1.0),
      new THREE.Color(0.85, 0.90, 1.0),
      new THREE.Color(0.98, 0.98, 0.94),
      new THREE.Color(1.0, 0.92, 0.80),
      new THREE.Color(1.0, 0.78, 0.58),
      new THREE.Color(1.0, 0.55, 0.38),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 3500 + Math.random() * 8000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorPick = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      const brightness = 0.35 + Math.pow(Math.random(), 3.5) * 0.65;
      starColors[i * 3] = colorPick.r * brightness;
      starColors[i * 3 + 1] = colorPick.g * brightness;
      starColors[i * 3 + 2] = colorPick.b * brightness;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ========================================================================
    // LIGHTING SYSTEM
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0xDCE8FC, 0.90);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF8EB, 0x1E293B, 0.65);
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
    blackHoleGroup.add(sgrMesh);

    // 1.2 Relativistic Photon Ring (Thin brilliant filament at edge of shadow)
    const photonRingGeo = new THREE.TorusGeometry(7.22, 0.09, 32, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xFFF9E8,
      transparent: true,
      opacity: 0.98,
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
      uniforms: { uTime: { value: 0 } },
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
    // 2. SOLAR SYSTEM HIERARCHY
    // ========================================================================
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Sun Point Light
    const sunLight = new THREE.PointLight(0xFFFBF0, 5.2, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.bias = -0.0002;
    solarSystemGroup.add(sunLight);

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
    solarSystemGroup.add(sunMesh);

    const coronaGeo = new THREE.SphereGeometry(3.9, 48, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xFFA500,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    solarSystemGroup.add(coronaMesh);

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
    solarSystemGroup.add(streakSprite);

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
    solarSystemGroup.add(sunBeacon);

    // ========================================================================
    // PLANETARY OBJECTS & ORBITAL MESHES
    // ========================================================================
    const planetObjects = [];

    planetObjects.push({
      data: PLANET_SUBJECTS[0],
      mesh: sunMesh,
      anchor: solarSystemGroup,
      angle: 0,
      radius: 0,
    });

    const earthDayTex = createEarthDiffuseTexture();
    const earthNightTex = createEarthNightTexture();

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
          },
          vertexShader: EarthDayNightShader.vertexShader,
          fragmentShader: EarthDayNightShader.fragmentShader,
        });
        pMesh = new THREE.Mesh(pGeo, earthMat);
      } else {
        let pTex;
        if (pData.id === 'mercury') pTex = createMercuryTexture();
        else if (pData.id === 'venus') pTex = createVenusTexture();
        else if (pData.id === 'mars') pTex = createMarsTexture();
        else if (pData.id === 'jupiter') pTex = createJupiterTexture();
        else if (pData.id === 'saturn') pTex = createSaturnTexture();
        else if (pData.id === 'neptune') pTex = createNeptuneTexture();

        const pMat = new THREE.MeshStandardMaterial({
          map: pTex,
          roughness: 0.52,
          metalness: 0.04,
          emissive: new THREE.Color(0x1a2638),
          emissiveIntensity: 0.25,
        });
        pMesh = new THREE.Mesh(pGeo, pMat);
      }

      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      axialTiltGroup.add(pMesh);

      let cloudsMesh = null;
      let moonAnchor = null;
      let satellitesGroup = null;

      if (pData.hasClouds) {
        const cloudTex = createEarthCloudsTexture();
        const cloudGeo = new THREE.SphereGeometry(pData.size * 1.018, 48, 48);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.72,
          roughness: 0.85,
          depthWrite: false,
        });
        cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudsMesh.castShadow = true;
        axialTiltGroup.add(cloudsMesh);
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
        axialTiltGroup.add(ringMesh);
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
      });
    });

    // Register Sagittarius A* into selectable bodies
    planetObjects.push({
      data: PLANET_SUBJECTS.find(p => p.id === 'blackhole'),
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
    // INTERACTION & RAYCASTER
    // ========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const clickable = planetObjects.map(p => p.mesh).filter(Boolean);
      const intersects = raycaster.intersectObjects(clickable, false);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const matched = planetObjects.find(p => p.mesh === hitMesh);
        if (matched) {
          handleSelectPlanet(matched.data);
        }
      }
    };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const clickable = planetObjects.map(p => p.mesh).filter(Boolean);
      const intersects = raycaster.intersectObjects(clickable, false);
      container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
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
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.55, 0.65, 0.92);
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    const cinePass = new ShaderPass(CineShader);
    composer.addPass(cinePass);
    const cineUniforms = cinePass.uniforms;
    cineUniforms.uAspect.value = width / height;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================================
    // ANIMATION & HIERARCHY LOOP
    // ========================================================================
    let animId;
    const clock = new THREE.Clock();
    let prevFocalWorldPos = new THREE.Vector3();
    let simTime = 0;
    let wasTransitioning = false;
    let lastNavKey = '';
    const travel = { t: 0, dur: 4, p0: new THREE.Vector3(), t0: new THREE.Vector3() };
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

    // Intro: start deep in the void, then fly in
    camera.position.set(-290, 90, 1140);
    controls.target.set(210, 0, 241);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      const {
        activePlanet: currentActive,
        isPaused: paused,
        speedMultiplier: warp,
        archLevel: currentLevel,
        isRealScale: realScaleMode,
        isGalacticDriftActive: driftActive,
        isTransitioning: transitioning,
      } = animStateRef.current;

      // Gravitational time dilation (cinematic): sqrt(1 - Rs/r)-like slowdown as the camera nears the horizon
      const bhR = 7.0 * blackHoleGroup.scale.x;
      const dil = animStateRef.current.cinemaMode
        ? THREE.MathUtils.clamp((camera.position.length() - bhR * 2.0) / (bhR * 10.0), 0.1, 1.0)
        : 1.0;
      simTime += delta * dil;

      sunUniforms.uTime.value = elapsedTime;
      diskMat.uniforms.uTime.value = simTime;
      lensingArchMat.uniforms.uTime.value = simTime;

      sunMesh.rotation.y += 0.002;
      streakSprite.position.set(0, 0, 0);

      // 1. Galactic Heliocentric Orbit around Sagittarius A*
      const galRadius = realScaleMode ? 48000 : 320;
      if (!paused && driftActive) {
        animStateRef.current.galacticAngle += delta * (realScaleMode ? 0.004 : 0.018) * warp;
      }
      const gAngle = animStateRef.current.galacticAngle;
      const sunGalX = galRadius * Math.cos(gAngle);
      const sunGalZ = galRadius * Math.sin(gAngle);
      const sunGalY = Math.sin(gAngle * 2.8) * (realScaleMode ? 120.0 : 8.0);
      solarSystemGroup.position.set(sunGalX, sunGalY, sunGalZ);

      // Rotate Black Hole Components
      sgrMesh.rotation.y += delta * 0.35 * dil;
      lensingArchMesh.rotation.z -= delta * 0.05 * dil;

      // S-Stars relativistic orbits around Sgr A*
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

      // Asteroid Belt tumbling & orbit
      if (!paused) {
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

      // Smooth scale transitions for Sun and Sagittarius A*
      const targetSunSize = realScaleMode ? 10.0 : 3.4;
      sunMesh.scale.lerp(new THREE.Vector3(targetSunSize / 3.4, targetSunSize / 3.4, targetSunSize / 3.4), 0.08);

      const targetSgrScale = realScaleMode ? 9.5 : 1.0;
      blackHoleGroup.scale.lerp(new THREE.Vector3(targetSgrScale, targetSgrScale, targetSgrScale), 0.08);

      // Compute Planets Motion
      let activeWorldPos = new THREE.Vector3(0, 0, 0);
      let activeSpeedKms = 0;

      planetObjects.forEach((pObj) => {
        if (pObj.data.id === 'sun') {
          if (currentActive.id === 'sun') {
            sunMesh.getWorldPosition(activeWorldPos);
          }
          return;
        }

        if (pObj.data.id === 'blackhole') {
          if (currentActive.id === 'blackhole') {
            blackHoleGroup.getWorldPosition(activeWorldPos);
          }
          return;
        }

        const curA = realScaleMode ? pObj.data.realDistance : pObj.data.distance;
        const curSize = realScaleMode ? pObj.data.realSize : pObj.data.size;
        const e = pObj.data.eccentricity;
        const inc = pObj.data.inclination || 0;

        const scaleFactor = curSize / pObj.data.size;
        pObj.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        if (!paused) {
          const currentR = (curA * (1 - e * e)) / (1 + e * Math.cos(pObj.angle));
          const instantaneousSpeed = (pObj.data.speed * 0.32 * warp * (curA / Math.max(1, currentR)));
          pObj.angle += instantaneousSpeed * delta;
        }

        const r = (curA * (1 - e * e)) / (1 + e * Math.cos(pObj.angle));
        const x = r * Math.cos(pObj.angle);
        const z = r * Math.sin(pObj.angle);
        const y = -z * Math.sin(inc);
        const zTilted = z * Math.cos(inc);

        pObj.anchor.position.set(x, y, zTilted);
        pObj.mesh.rotation.y += delta * 0.45;

        if (pObj.cloudsMesh) {
          pObj.cloudsMesh.rotation.y += delta * 0.55;
          pObj.cloudsMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        if (pObj.moonAnchor) {
          pObj.moonAnchor.rotation.y += delta * 1.2;
        }

        if (pObj.satellitesGroup) {
          pObj.satellitesGroup.rotation.y += delta * 0.95;
        }

        if (currentActive.id === pObj.data.id) {
          pObj.anchor.getWorldPosition(activeWorldPos);
          activeSpeedKms = (pObj.data.distance / Math.max(1, r)) * 29.8;
        }
      });

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
      // 3-LEVEL ARCHITECTURAL CAMERA SYSTEM + CINEMATIC SHOTS
      // ======================================================================
      const st = animStateRef.current;
      const shot = st.shot;
      const cineOn = st.cinemaMode;
      const bhRadiusNow = 7.0 * blackHoleGroup.scale.x;
      const navKey = `${currentLevel}|${currentActive.id}|${realScaleMode}|${shot}`;
      const targetCenter = tmpTarget.set(0, 0, 0);
      const desiredCamPos = tmpDesired.set(0, 0, 0);

      if (currentLevel === 'galaxy') {
        // LEVEL 3: GALAXY (Centered on Sagittarius A*)
        targetCenter.set(0, 0, 0);
        if (shot === 'gargantua') {
          // Near edge-on, ~8 deg above the disk plane: the iconic Gargantua silhouette
          const camDist = bhRadiusNow * 11;
          desiredCamPos.set(camDist * 0.93, camDist * 0.14, camDist * 0.34);
        } else {
          const camDist = realScaleMode ? 75000 : 420;
          desiredCamPos.set(0, camDist * 0.45, camDist * 0.85);
        }

      } else if (currentLevel === 'solar') {
        // LEVEL 2: SOLAR (Centered on the Sun)
        solarSystemGroup.getWorldPosition(targetCenter);
        const camDist = realScaleMode ? 6200 : 70;
        if (shot === 'ecliptic') {
          desiredCamPos.copy(targetCenter).add(tmpOffset.set(camDist * 0.92, camDist * 0.07, camDist * 0.38));
        } else {
          desiredCamPos.copy(targetCenter).add(tmpOffset.set(0, camDist * 0.55, camDist * 0.85));
        }

      } else {
        // LEVEL 1: PLANETARY (Centered on Earth / Active Planet)
        targetCenter.copy(activeWorldPos);
        solarSystemGroup.getWorldPosition(tmpSun);

        const sunToPlanet = tmpA.copy(activeWorldPos).sub(tmpSun).normalize();
        const orbitTangent = tmpB.set(-sunToPlanet.z, 0, sunToPlanet.x).normalize();

        const pRadius = realScaleMode ? currentActive.realSize : currentActive.size;
        const framingDistance = realScaleMode
          ? Math.max(pRadius * 5.0, 3.5)
          : Math.max(pRadius * 3.6, currentActive.hasRings ? 14.5 : 4.5);

        if (shot === 'backlit') {
          // Camera on the far side of the body: the Sun peeks over the limb (rim light)
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
          // Rising edge: start a new cinematic travel
          travel.t = 0;
          travel.p0.copy(camera.position);
          travel.t0.copy(controls.target);
          const dist = travel.p0.distanceTo(desiredCamPos);
          travel.dur = THREE.MathUtils.clamp(2.4 + 0.9 * Math.log10(1 + dist), 2.8, 6.8);
          if (!st.shot) st.autoOrbit = false;
        }
        travel.t += delta;
        const u = Math.min(1, travel.t / travel.dur);
        const s = u * u * u * (u * (u * 6 - 15) + 10); // smootherstep (C2 continuous)
        travelS = s;

        // Quadratic Bezier arc: lifted + laterally offset control point (never a straight line)
        const len = travel.p0.distanceTo(desiredCamPos);
        tmpDir.subVectors(desiredCamPos, travel.p0);
        tmpSide.crossVectors(tmpDir, tmpUp.set(0, 1, 0));
        if (tmpSide.lengthSq() < 1e-9) tmpSide.set(1, 0, 0);
        tmpSide.normalize();
        tmpCtrl.addVectors(travel.p0, desiredCamPos).multiplyScalar(0.5)
          .addScaledVector(tmpUp.set(0, 1, 0), len * 0.16)
          .addScaledVector(tmpSide, len * 0.12);
        const a = (1 - s) * (1 - s);
        const b = 2 * (1 - s) * s;
        const c = s * s;
        camera.position.set(
          a * travel.p0.x + b * tmpCtrl.x + c * desiredCamPos.x,
          a * travel.p0.y + b * tmpCtrl.y + c * desiredCamPos.y,
          a * travel.p0.z + b * tmpCtrl.z + c * desiredCamPos.z
        );
        controls.target.lerpVectors(travel.t0, targetCenter, s);

        if (u >= 1) {
          st.isTransitioning = false;
          st.shot = null;
        }
      } else {
        tmpDir.subVectors(targetCenter, prevFocalWorldPos);
        camera.position.add(tmpDir);
        controls.target.copy(targetCenter);
      }
      wasTransitioning = transitioning && st.isTransitioning;
      lastNavKey = navKey;

      // Cinematic FOV dolly: widen mid-flight, settle at 40 deg
      const desiredFov = 40 + (cineOn ? Math.sin(Math.PI * travelS) * 9 : 0);
      if (Math.abs(camera.fov - desiredFov) > 0.01) {
        camera.fov += (desiredFov - camera.fov) * 0.2;
        camera.updateProjectionMatrix();
      }

      prevFocalWorldPos.copy(targetCenter);
      controls.autoRotate = !!st.autoOrbit && !st.isTransitioning;
      controls.autoRotateSpeed = 0.45;
      controls.update();

      // Handheld breathing + flight roll (applied after lookAt, so it never accumulates)
      if (cineOn) {
        const nx = Math.sin(elapsedTime * 0.37) * 0.6 + Math.sin(elapsedTime * 0.91 + 1.3) * 0.4;
        const ny = Math.sin(elapsedTime * 0.29 + 0.7) * 0.6 + Math.sin(elapsedTime * 0.83) * 0.4;
        camera.rotateX(nx * 0.0022);
        camera.rotateY(ny * 0.0022);
        camera.rotateZ(Math.sin(Math.PI * travelS) * 0.07 + Math.sin(elapsedTime * 0.23) * 0.0022);
      }

      // Gravitational lensing of the whole frame around Sgr A* (screen-space)
      if (cineOn) {
        tmpBH.set(0, 0, 0);
        camera.updateMatrixWorld();
        camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
        const bhDist = camera.position.distanceTo(tmpBH);
        tmpBH.project(camera);
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5);
        const rho = (bhRadiusNow / Math.max(bhDist, 1e-3)) / tanHalf * 0.5; // shadow radius in uv-height units
        const inFront = tmpBH.z < 1 ? 1 : 0;
        const nearFade = THREE.MathUtils.smoothstep(bhDist, bhRadiusNow * 1.6, bhRadiusNow * 4.0);
        const farFade = THREE.MathUtils.smoothstep(rho, 0.004, 0.03);
        cineUniforms.uLensPos.value.set(tmpBH.x * 0.5 + 0.5, tmpBH.y * 0.5 + 0.5);
        cineUniforms.uThetaE.value = rho * 2.0;
        cineUniforms.uLensStrength.value = inFront * nearFade * farFade;
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
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      controls.dispose();

      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      streakTex.dispose();
      streakMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starSprite.dispose();
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

  return (
    <div
      className={
        isRealScale
          ? 'fixed inset-0 z-50 w-screen h-screen bg-[#010204] flex flex-col overflow-hidden select-none'
          : 'w-full flex flex-col bg-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden selection:bg-galileo-500/30'
      }
    >
      
      {/* ==================================================================== */}
      {/* 1. TOP HEADER PANEL: 3 ARCHITECTURAL LEVELS & TELEMETRY              */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
        
        {/* Title row & 3-Level Architecture View Switcher */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
              <h3 className="font-mono text-xs sm:text-sm font-bold text-galileo-300 tracking-wider uppercase">
                {isRealScale ? 'Astronomical 1:1 Scale Engine' : 'Heliocentric & Galactic Observatory'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300">
                Sgr A* Kerr Metric Active
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Architectural Multi-Scale: Planetary • Solar • Galactic Hierarchy
            </p>
          </div>

          {/* 3 ARCHITECTURAL LEVELS SELECTOR BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner font-mono text-xs">
              <button
                onClick={() => {
                  setArchLevel('planetary');
                  animStateRef.current.isTransitioning = true;
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  archLevel === 'planetary'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/40 border border-sky-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Level 1: Focus on Earth, Moon, ISS & GEO satellites"
              >
                🌍 1. Planetario
              </button>

              <button
                onClick={() => {
                  setArchLevel('solar');
                  animStateRef.current.isTransitioning = true;
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  archLevel === 'solar'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 border border-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Level 2: Focus on Sol and the 8 Keplerian planetary orbits"
              >
                ☀️ 2. Solar
              </button>

              <button
                onClick={() => {
                  setArchLevel('galaxy');
                  animStateRef.current.isTransitioning = true;
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  archLevel === 'galaxy'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Level 3: Focus on Sagittarius A* Supermassive Black Hole & Galactic Center"
              >
                🌌 3. Galaxia
              </button>
            </div>

            {/* REAL SCALE TOGGLE */}
            <button
              onClick={() => {
                const nextState = !isRealScale;
                setIsRealScale(nextState);
                animStateRef.current.isTransitioning = true;
                setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
              }}
              className={`px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all shadow-lg ${
                isRealScale
                  ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/40 animate-pulse'
                  : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
              }`}
            >
              <span>{isRealScale ? '✕ Exit Real Scale' : '🔭 Real Scale 1:1'}</span>
            </button>

            {/* Galactic Drift Toggle */}
            <button
              onClick={() => setIsGalacticDriftActive(!isGalacticDriftActive)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs transition-all ${
                isGalacticDriftActive
                  ? 'bg-purple-900/80 text-purple-200 border-purple-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle heliocentric orbital drift around Sagittarius A*"
            >
              <span>{isGalacticDriftActive ? '🌀 Galactic Orbit: On' : '⏸ Orbit: Frozen'}</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-mono text-xs"
            >
              {isPaused ? '▶ Play' : '⏸ Pause'}
            </button>

            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2.5 : 1)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs transition-all ${
                speedMultiplier > 1
                  ? 'bg-amber-600 text-white font-semibold border-amber-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {speedMultiplier > 1 ? '⚡ 2.5x Warp' : '1.0x Real'}
            </button>

          </div>

        </div>

        {/* Dynamic Telemetry Bar & Planet Navigation Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3.5 border-t border-slate-800/80">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CURRENT ARCHITECTURE</span>
              <span className="text-white font-bold capitalize">{archLevel}</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">FOCAL METRIC</span>
              <span className="text-sky-300 font-semibold">
                {archLevel === 'galaxy' ? 'Mass: 4.15×10⁶ M☉' : (archLevel === 'solar' ? 'Radius: 1.00 AU' : 'LEO/GEO Satellites')}
              </span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ORBITAL VELOCITY</span>
              <span className="text-emerald-400 font-semibold">
                {archLevel === 'galaxy' ? '230 km/s (Galactic)' : liveTelemetry.velKms}
              </span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SCALE MODE</span>
              <span className={isRealScale ? 'text-rose-400 font-bold' : 'text-amber-300 font-semibold'}>
                {isRealScale ? 'Real Physical (1:1)' : 'Balanced Observatory'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {PLANET_SUBJECTS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  activePlanet.id === planet.id
                    ? 'bg-galileo-600/90 text-white border-galileo-400 font-semibold shadow-md shadow-galileo-600/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {planet.name.split(' ')[0]}
              </button>
            ))}
          </div>

        </div>

      </div>

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
                ? 'NIVEL GALAXIA: Sagittarius A* tiene un horizonte de sucesos masivo y una masa de 4.15 millones de soles. En la escala real, el Sol se encuentra a 26,000 años luz (~1.68×10⁹ UA) orbitando a 230 km/s. Observa cómo la inmensidad galáctica empequeñece a las estrellas.'
                : (archLevel === 'solar'
                    ? 'NIVEL SOLAR: Si el Sol tuviera este tamaño visual (~10 metros de radio), la Tierra sería una mota de 13 milímetros a casi 200 metros de distancia, Júpiter estaría a 1 kilómetro y Neptuno a casi 6 kilómetros.'
                    : 'NIVEL PLANETARIO: La Tierra y la Luna se muestran con sus diámetros proporcionales reales (la Luna a 60 radios terrestres de distancia), y la ISS orbita a escasos milímetros sobre la atmósfera.'
                  )}
            </p>
          </div>
          <button
            onClick={() => {
              setIsRealScale(false);
              setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shrink-0"
          >
            ✕ Salir de Escala Real
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. 3D COSMIC OBSERVATORY VIEWPORT                                   */}
      {/* ==================================================================== */}
      <div
        className={`relative w-full ${isRealScale ? 'flex-1' : 'h-[500px] sm:h-[600px] md:h-[640px]'} bg-black overflow-hidden`}
        style={{ containerType: 'size' }}
      >
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Letterbox 2.39:1 (anamorphic cinema bars) */}
        <div
          className="absolute inset-x-0 top-0 bg-black pointer-events-none z-20"
          style={{ height: letterbox ? 'max(0px, calc((100cqh - 100cqw / 2.39) / 2))' : '0px', transition: 'height 900ms cubic-bezier(.65,0,.35,1)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 bg-black pointer-events-none z-20"
          style={{ height: letterbox ? 'max(0px, calc((100cqh - 100cqw / 2.39) / 2))' : '0px', transition: 'height 900ms cubic-bezier(.65,0,.35,1)' }}
        />

        {/* Cinematic scientific subtitle */}
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

        {/* Cine control strip */}
        <div className="absolute bottom-3 right-3 sm:right-4 z-30 flex flex-wrap justify-end items-center gap-1.5 text-[10px]" style={{ fontFamily: CINE_FONT }}>
          <div className="hidden md:flex items-center gap-1 bg-black/55 backdrop-blur-md border border-white/10 rounded-full px-1 py-1">
            <span className="px-2 text-white/40 tracking-[0.25em] uppercase">{lang === 'en' ? 'Shots' : 'Planos'}</span>
            <button onClick={() => triggerShot('backlit')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider" title={lang === 'en' ? 'Sun behind the limb of the active body' : 'Sol tras el limbo del cuerpo activo'}>
              {lang === 'en' ? 'Backlit' : 'Contraluz'}
            </button>
            <button onClick={() => triggerShot('ecliptic')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider" title={lang === 'en' ? 'Low panorama along the ecliptic' : 'Panorámica baja sobre la eclíptica'}>
              {lang === 'en' ? 'Ecliptic' : 'Eclíptica'}
            </button>
            <button onClick={() => triggerShot('gargantua')} className="px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors tracking-wider" title={lang === 'en' ? 'Orbit Sgr A* with time dilation' : 'Órbita sobre Sgr A* con dilatación temporal'}>
              Gargantúa
            </button>
          </div>
          <button
            onClick={() => setCinemaMode(v => !v)}
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] uppercase transition-colors ${cinemaMode ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
            title={lang === 'en' ? 'Bloom, grain, anamorphic flare, grading & lensing' : 'Bloom, grano, flare anamórfico, etalonaje y lente gravitacional'}
          >
            Cine
          </button>
          <button
            onClick={() => setLetterbox(v => !v)}
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] transition-colors ${letterbox ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
            title="Letterbox 2.39:1"
          >
            2.39:1
          </button>
          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md tracking-[0.2em] uppercase transition-colors ${audioOn ? 'bg-white/90 text-black border-white' : 'bg-black/55 text-white/60 border-white/15 hover:text-white'}`}
            title={lang === 'en' ? 'Generative ambient drone (changes per level)' : 'Drone ambiental generativo (cambia por nivel)'}
          >
            {audioOn ? '♪ On' : '♪ Off'}
          </button>
        </div>

        {/* Mission-control level tag */}
        <div className="absolute bottom-3 left-4 z-30 pointer-events-none text-[10px] text-white/45 tracking-[0.3em] uppercase hidden sm:flex items-center gap-3" style={{ fontFamily: CINE_FONT }}>
          <span>{archLevel}</span>
          <span className="w-6 h-px bg-white/25" />
          <span>{isRealScale ? '1:1' : 'Observatory'}</span>
        </div>

        {/* Intro: fade from absolute black */}
        {!introDone && (
          <div
            className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center pointer-events-none"
            style={{ animation: 'cineIntro 5.6s ease-in-out forwards', fontFamily: CINE_FONT }}
            onAnimationEnd={() => setIntroDone(true)}
          >
            <span className="text-white/90 text-xs sm:text-sm tracking-[0.6em] uppercase">Galileo</span>
            <span className="mt-3 text-sky-200/50 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase">
              {lang === 'en' ? 'Observatory of the Cosmos' : 'Observatorio del Cosmos'}
            </span>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 4. BOTTOM PANEL: CELESTIAL DOSSIER & SYLLABUS CARD                   */}
      {/* ==================================================================== */}
      {activePlanet && !isRealScale && (
        <div className="p-5 sm:p-6 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full inline-block shadow-md ring-2 ring-slate-850"
                style={{ backgroundColor: activePlanet.color }}
              />
              <div>
                <span className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  {activePlanet.name}
                </span>
                <span className="font-mono text-xs text-slate-400 block sm:inline sm:ml-2">
                  • {activePlanet.spectralClass}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-purple-400 font-semibold shadow-inner">
                {activePlanet.id === 'blackhole' ? 'Relativistic Einstein Ring' : (activePlanet.id === 'earth' ? 'City Lights & Orbital Fleet' : 'Photorealistic PBR Render')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="lg:col-span-2 space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {lang === 'en' ? activePlanet.academicAreaEn : activePlanet.academicAreaEs}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {lang === 'en' ? activePlanet.descriptionEn : activePlanet.descriptionEs}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/60 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Temperature</span>
                  <span className="text-slate-200 font-semibold">{activePlanet.temperatureK}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Period</span>
                  <span className="text-sky-300 font-semibold">{activePlanet.orbitalPeriod}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Eccentricity</span>
                  <span className="text-amber-300 font-semibold">{activePlanet.eccentricity}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Axial Tilt</span>
                  <span className="text-emerald-400 font-semibold">{activePlanet.axialTilt}°</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => {
                  if (onSelectSubject) onSelectSubject(activePlanet);
                  const el = document.getElementById('courses');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 rounded-xl bg-galileo-600 hover:bg-galileo-500 text-white font-semibold text-xs sm:text-sm font-mono transition-all text-center shadow-lg shadow-galileo-600/30 hover:shadow-galileo-600/50"
              >
                {lang === 'en' ? 'View Course Syllabus & Klausur Plan →' : 'Ver Temario y Plan de Klausur →'}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
