import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ============================================================================
// 1. ASTROPHYSICAL & ACADEMIC METADATA (INCLUDES VENUS, NEPTUNE & ASTEROIDS)
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
    realSize: 12.0,
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
    inclination: 0.122, // 7.00°
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
    inclination: 0.059, // 3.39°
    axialTilt: 177.36, // Retrograde spin
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
    spectralClass: 'Active Biosphere / Hydro-Atmosphere',
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
    inclination: 0.0, // Ecliptic reference
    axialTilt: 23.44,
    hasClouds: true,
    hasAtmosphere: true,
    hasMoon: true,
    hasAsteroidCloud: true, // Near-Earth Asteroid Swarm
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
    inclination: 0.032, // 1.85°
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
    inclination: 0.023, // 1.30°
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
    inclination: 0.043, // 2.49°
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
    inclination: 0.031, // 1.77°
    axialTilt: 28.32,
    orbitalPeriod: '164.8 Earth years',
    temperatureK: '72 K (Cloud top)',
    semiMajorAxisAU: '30.07 AU',
    orbitalSpeedKms: '5.4 km/s',
    realSize: 0.52,
    realDistance: 5850,
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
// 3. SCIENTIFIC PROCEDURAL TEXTURES
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

// VENUS: Dense, swirling sulfuric acid & carbon dioxide atmosphere
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

      // Equatorial chevron / Y-feature super-rotation wave
      const chevron = Math.abs(lat) * 2.5 + Math.sin(xNorm * Math.PI * 2) * 0.4;
      const turb = noise.fbm2D(xNorm * 10.0 + chevron, lat * 6.0, 5, 0.55, 2.0);

      // Pale amber & buttery cream cloud decks
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

// EARTH: Vibrant oceans and continents
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

  // Valles Marineris canyon
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
      const xNorm = x / 1024;

      const turb = noise.fbm2D(xNorm * 18.0, lat * 8.0, 5, 0.55, 2.1);
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

  // Great Red Spot
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

// NEPTUNE: Deep royal azure blue with Great Dark Spot & methane cirrus streaks
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
      const xNorm = x / 1024;

      const turb = noise.fbm2D(xNorm * 14.0, lat * 8.0, 5, 0.55, 2.0) * 0.15;
      const band = Math.sin(lat * 16.0 + turb) * 0.5 + 0.5;

      // Radiant azure/cobalt blue palette
      const r = Math.floor(25 + band * 20);
      const g = Math.floor(85 + band * 45);
      const b = Math.floor(205 + band * 45);

      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Great Dark Spot (Neptunian anticyclone)
  ctx.fillStyle = 'rgba(12, 35, 95, 0.85)';
  ctx.beginPath();
  ctx.ellipse(600, 310, 55, 28, -0.08, 0, Math.PI * 2);
  ctx.fill();

  // White methane cirrus companion clouds ("Scooter")
  ctx.fillStyle = 'rgba(240, 248, 255, 0.88)';
  ctx.beginPath();
  ctx.ellipse(605, 345, 42, 6, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(320, 210, 65, 8, 0.05, 0, Math.PI * 2);
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
// 4. SCIENTIFIC GLSL SHADERS
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

// ============================================================================
// 5. MAIN OBSERVATORY COMPONENT
// ============================================================================
export default function SolarSystem({ onSelectSubject, selectedSubjectId, lang = 'en' }) {
  const containerRef = useRef(null);
  const [activePlanet, setActivePlanet] = useState(PLANET_SUBJECTS[3]); // Earth
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cameraMode, setCameraMode] = useState('focus');
  const [isRealScale, setIsRealScale] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState({ rAU: '1.000 AU', velKms: '29.8 km/s', nuDeg: '0.0°' });

  const animStateRef = useRef({
    activePlanet: PLANET_SUBJECTS[3],
    isPaused: false,
    speedMultiplier: 1,
    cameraMode: 'focus',
    isRealScale: false,
    isTransitioning: false,
  });

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
    animStateRef.current.cameraMode = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    animStateRef.current.isRealScale = isRealScale;
  }, [isRealScale]);

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
    if (planet.id === 'sun') {
      setCameraMode('overview');
    } else {
      setCameraMode('focus');
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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 18000);
    camera.position.set(0, 38, 56);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    controls.maxDistance = 15000;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.target.set(0, 0, 0);

    controls.addEventListener('start', () => {
      animStateRef.current.isTransitioning = false;
    });

    // ========================================================================
    // STARFIELD & MILKY WAY
    // ========================================================================
    const starSprite = createStarSpriteTexture();
    const starCount = 3600;
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
      const radius = 2500 + Math.random() * 5000;
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
    // LIGHTING SYSTEM: BRIGHT SUNLIGHT + FULL 360° VISIBILITY OF DARK SECTOR
    // ========================================================================
    // Direct point sunlight without quadratic falloff (decay = 0)
    const sunLight = new THREE.PointLight(0xFFFBF0, 5.2, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);

    // High-clarity ambient and hemisphere illumination:
    // Guarantees the dark hemisphere is clearly legible, translucent, and visible 360°
    const ambientLight = new THREE.AmbientLight(0xDCE8FC, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF8EB, 0x334155, 0.65);
    scene.add(hemiLight);

    // ========================================================================
    // SOL MESH & CORONA
    // ========================================================================
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
    scene.add(sunMesh);

    const coronaGeo = new THREE.SphereGeometry(3.9, 48, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xFFA500,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    scene.add(coronaMesh);

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
    scene.add(streakSprite);

    // ========================================================================
    // PLANETARY OBJECTS & ORBITAL MESHES
    // ========================================================================
    const planetObjects = [];

    planetObjects.push({
      data: PLANET_SUBJECTS[0],
      mesh: sunMesh,
      anchor: sunMesh,
      angle: 0,
      radius: 0,
    });

    PLANET_SUBJECTS.slice(1).forEach((pData) => {
      const a = pData.distance;
      const e = pData.eccentricity;
      const inc = pData.inclination || 0;

      // Orbit Line
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
      scene.add(orbitLine);

      // Planet Hierarchy
      const planetAnchor = new THREE.Group();
      scene.add(planetAnchor);

      const axialTiltGroup = new THREE.Group();
      axialTiltGroup.rotation.z = THREE.MathUtils.degToRad(pData.axialTilt || 0);
      planetAnchor.add(axialTiltGroup);

      // Textures
      let pTex;
      if (pData.id === 'mercury') pTex = createMercuryTexture();
      else if (pData.id === 'venus') pTex = createVenusTexture();
      else if (pData.id === 'earth') pTex = createEarthDiffuseTexture();
      else if (pData.id === 'mars') pTex = createMarsTexture();
      else if (pData.id === 'jupiter') pTex = createJupiterTexture();
      else if (pData.id === 'saturn') pTex = createSaturnTexture();
      else if (pData.id === 'neptune') pTex = createNeptuneTexture();

      const pGeo = new THREE.SphereGeometry(pData.size, 48, 48);
      const pMat = new THREE.MeshStandardMaterial({
        map: pTex,
        roughness: 0.52,
        metalness: 0.04,
        emissive: new THREE.Color(0x1a2638),
        emissiveIntensity: 0.28, // Guarantees the dark side remains translucent and clear 360°
      });

      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      axialTiltGroup.add(pMesh);

      let cloudsMesh = null;
      let moonAnchor = null;
      let asteroidCloudMesh = null;

      // Earth Features: Clouds, Moon & Near-Earth Asteroid Swarm
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
        moonMesh.position.set(2.8, 0.4, 0);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonAnchor.add(moonMesh);
      }

      // NEAR-EARTH ASTEROID SWARM (NEO CLOUD AROUND EARTH)
      if (pData.hasAsteroidCloud) {
        const neoCount = 420;
        const neoGeo = new THREE.BufferGeometry();
        const neoPositions = new Float32Array(neoCount * 3);
        const neoColors = new Float32Array(neoCount * 3);

        for (let k = 0; k < neoCount; k++) {
          const uRad = 2.2 + Math.random() * 2.8;
          const uTheta = Math.random() * Math.PI * 2;
          const uPhi = (Math.random() - 0.5) * 0.5;

          neoPositions[k * 3] = uRad * Math.cos(uTheta);
          neoPositions[k * 3 + 1] = uRad * Math.sin(uPhi);
          neoPositions[k * 3 + 2] = uRad * Math.sin(uTheta);

          // Stony asteroid chondrite hues
          neoColors[k * 3] = 0.75 + Math.random() * 0.2;
          neoColors[k * 3 + 1] = 0.7 + Math.random() * 0.2;
          neoColors[k * 3 + 2] = 0.65 + Math.random() * 0.2;
        }

        neoGeo.setAttribute('position', new THREE.BufferAttribute(neoPositions, 3));
        neoGeo.setAttribute('color', new THREE.BufferAttribute(neoColors, 3));

        const neoMat = new THREE.PointsMaterial({
          size: 1.8,
          map: starSprite,
          vertexColors: true,
          transparent: true,
          opacity: 0.88,
        });

        asteroidCloudMesh = new THREE.Points(neoGeo, neoMat);
        planetAnchor.add(asteroidCloudMesh);
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
        asteroidCloudMesh,
        ringMesh,
        angle: Math.random() * Math.PI * 2,
        orbitLine,
      });
    });

    // ========================================================================
    // MAIN ASTEROID BELT (BETWEEN MARS AND JUPITER, r ∈ [24.5, 27.5])
    // ========================================================================
    const beltCount = 2800;
    const beltGeo = new THREE.BufferGeometry();
    const beltPositions = new Float32Array(beltCount * 3);
    const beltColors = new Float32Array(beltCount * 3);

    for (let i = 0; i < beltCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Kirkwood resonance distribution
      const r = 24.8 + Math.random() * 2.8 + (Math.random() - 0.5) * 0.4;
      const verticalDispersion = (Math.random() - 0.5) * 1.2;

      beltPositions[i * 3] = r * Math.cos(angle);
      beltPositions[i * 3 + 1] = verticalDispersion;
      beltPositions[i * 3 + 2] = r * Math.sin(angle);

      // C-type carbonaceous & S-type stony minerals
      const isStony = Math.random() > 0.4;
      beltColors[i * 3] = isStony ? 0.8 : 0.55;
      beltColors[i * 3 + 1] = isStony ? 0.72 : 0.52;
      beltColors[i * 3 + 2] = isStony ? 0.6 : 0.48;
    }

    beltGeo.setAttribute('position', new THREE.BufferAttribute(beltPositions, 3));
    beltGeo.setAttribute('color', new THREE.BufferAttribute(beltColors, 3));

    const beltMat = new THREE.PointsMaterial({
      size: 1.6,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
    });
    const asteroidBelt = new THREE.Points(beltGeo, beltMat);
    scene.add(asteroidBelt);

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

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================
    let animId;
    const clock = new THREE.Clock();
    let prevActivePlanetPos = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      const {
        activePlanet: currentActive,
        isPaused: paused,
        speedMultiplier: warp,
        cameraMode: mode,
        isRealScale: realScaleMode,
        isTransitioning: transitioning,
      } = animStateRef.current;

      sunUniforms.uTime.value = elapsedTime;
      sunMesh.rotation.y += 0.002;
      streakSprite.position.set(0, 0, 0);

      // Asteroid Belt Keplerian spin
      if (!paused) {
        asteroidBelt.rotation.y += delta * 0.08 * warp;
      }

      // Smoothly transition scale and distance between Balanced vs Real Scale
      const targetSunSize = realScaleMode ? 12.0 : 3.4;
      sunMesh.scale.lerp(new THREE.Vector3(targetSunSize / 3.4, targetSunSize / 3.4, targetSunSize / 3.4), 0.08);

      let activeWorldPos = new THREE.Vector3(0, 0, 0);
      let activeSpeedKms = 0;

      planetObjects.forEach((pObj) => {
        if (pObj.data.id === 'sun') {
          if (currentActive.id === 'sun') {
            activeWorldPos.set(0, 0, 0);
          }
          return;
        }

        // Interpolate distance and size for Real Scale vs Balanced View
        const curA = realScaleMode ? pObj.data.realDistance : pObj.data.distance;
        const curSize = realScaleMode ? pObj.data.realSize : pObj.data.size;
        const e = pObj.data.eccentricity;
        const inc = pObj.data.inclination || 0;

        // Apply scale transition to planet mesh
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

        if (pObj.asteroidCloudMesh) {
          pObj.asteroidCloudMesh.rotation.y += delta * 0.65;
        }

        if (currentActive.id === pObj.data.id) {
          activeWorldPos.copy(pObj.anchor.position);
          activeSpeedKms = (pObj.data.distance / Math.max(1, r)) * 29.8;
        }
      });

      // Telemetry update
      if (Math.random() < 0.1) {
        const trueAnomalyDeg = ((activeWorldPos.length() > 0 ? Math.atan2(activeWorldPos.z, activeWorldPos.x) : 0) * (180 / Math.PI) + 360) % 360;
        setLiveTelemetry({
          rAU: currentActive.semiMajorAxisAU || '1.000 AU',
          velKms: currentActive.orbitalSpeedKms || `${activeSpeedKms.toFixed(1)} km/s`,
          nuDeg: `${trueAnomalyDeg.toFixed(1)}°`,
        });
      }

      // Camera Positioning
      if (mode === 'overview' || currentActive.id === 'sun') {
        const overviewCamPos = realScaleMode ? new THREE.Vector3(0, 1800, 2600) : new THREE.Vector3(0, 48, 70);
        if (transitioning) {
          controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
          camera.position.lerp(overviewCamPos, 0.05);
          if (camera.position.distanceTo(overviewCamPos) < 1.0) {
            animStateRef.current.isTransitioning = false;
          }
        }
      } else {
        const sunToPlanet = activeWorldPos.clone().normalize();
        const orbitTangent = new THREE.Vector3(-sunToPlanet.z, 0, sunToPlanet.x).normalize();

        const pRadius = realScaleMode ? currentActive.realSize : currentActive.size;
        const framingDistance = realScaleMode
          ? Math.max(pRadius * 6.0, 4.0)
          : Math.max(pRadius * 3.6, currentActive.hasRings ? 14.5 : 4.5);

        const terminatorOffset = new THREE.Vector3()
          .addScaledVector(sunToPlanet, 0.38)
          .addScaledVector(orbitTangent, 0.85)
          .add(new THREE.Vector3(0, 0.35, 0))
          .normalize()
          .multiplyScalar(framingDistance);

        const desiredCamPos = activeWorldPos.clone().add(terminatorOffset);

        if (transitioning) {
          controls.target.lerp(activeWorldPos, 0.06);
          camera.position.lerp(desiredCamPos, 0.06);
          if (camera.position.distanceTo(desiredCamPos) < 0.2) {
            animStateRef.current.isTransitioning = false;
          }
        } else {
          const planetDelta = activeWorldPos.clone().sub(prevActivePlanetPos);
          camera.position.add(planetDelta);
          controls.target.copy(activeWorldPos);
        }
      }

      prevActivePlanetPos.copy(activeWorldPos);
      controls.update();
      renderer.render(scene, camera);
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
      beltGeo.dispose();
      beltMat.dispose();

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
          if (pObj.ringMesh.material.map) pObj.ringMesh.material.map.dispose();
          pObj.ringMesh.material.dispose();
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={
        isRealScale
          ? 'fixed inset-0 z-50 w-screen h-screen bg-[#010204] flex flex-col overflow-hidden select-none'
          : 'w-full flex flex-col bg-[#050811] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden selection:bg-galileo-500/30'
      }
    >
      
      {/* ==================================================================== */}
      {/* 1. TOP HEADER PANEL                                                  */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
        
        {/* Title row & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
              <h3 className="font-mono text-xs sm:text-sm font-bold text-galileo-300 tracking-wider uppercase">
                {isRealScale ? 'Astronomical 1:1 Real Scale Engine' : 'Heliocentric Astrodynamics Model'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-sky-400">
                8 Planets + Asteroid Belts
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Epoch J2000.0 • Full-Illumination Penumbra • 360° Planetary Silhouette
            </p>
          </div>

          {/* Mode, Warp, and REAL SCALE Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs self-start md:self-auto">
            {/* Real Scale Toggle Button */}
            <button
              onClick={() => {
                const nextState = !isRealScale;
                setIsRealScale(nextState);
                animStateRef.current.isTransitioning = true;
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                }, 80);
              }}
              className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                isRealScale
                  ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/40 animate-pulse'
                  : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
              }`}
            >
              <span>{isRealScale ? '✕ Exit Real Scale' : '🔭 Real Scale 1:1'}</span>
            </button>

            <button
              onClick={() => {
                const newMode = cameraMode === 'overview' ? 'focus' : 'overview';
                setCameraMode(newMode);
                animStateRef.current.isTransitioning = true;
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                cameraMode === 'overview'
                  ? 'bg-galileo-600 text-white font-semibold border-galileo-400 shadow-md shadow-galileo-600/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              {cameraMode === 'overview' ? '🔭 System Overview' : '🎯 Terminator Focus'}
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 transition-colors"
            >
              {isPaused ? '▶ Play' : '⏸ Pause'}
            </button>

            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2.5 : 1)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                speedMultiplier > 1
                  ? 'bg-amber-600 text-white font-semibold border-amber-500 shadow-md shadow-amber-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {speedMultiplier > 1 ? '⚡ 2.5x Warp' : '1.0x Real'}
            </button>
          </div>
        </div>

        {/* Telemetry Bar & Planet Navigation Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3.5 border-t border-slate-800/80">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">TARGET BODY</span>
              <span className="text-white font-bold">{activePlanet.name.split(' ')[0]}</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SEMI-MAJOR AXIS</span>
              <span className="text-sky-300 font-semibold">{liveTelemetry.rAU}</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ORBITAL VELOCITY</span>
              <span className="text-emerald-400 font-semibold">{liveTelemetry.velKms}</span>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">TRUE ANOMALY (ν)</span>
              <span className="text-amber-300 font-semibold">{liveTelemetry.nuDeg}</span>
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
      {/* 2. REAL SCALE EXPLANATORY BANNER (ONLY VISIBLE IN REAL SCALE MODE)   */}
      {/* ==================================================================== */}
      {isRealScale && (
        <div className="bg-gradient-to-r from-rose-950/90 via-slate-950/95 to-amber-950/90 border-b border-rose-500/40 p-4 sm:p-5 backdrop-blur-xl text-white font-mono text-xs shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-4xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold tracking-wider text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LEYENDA DE ESCALA ASTRONÓMICA REAL 1:1</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
              En este modelo a escala real, <strong>los tamaños y distancias orbitales reflejan la física estelar auténtica</strong>. 
              Si el Sol tuviera este tamaño visual (~12 metros de radio), la Tierra sería una diminuta mota de apenas <strong>13 milímetros</strong> situada a <strong>195 metros</strong> de distancia, 
              Júpiter estaría a más de <strong>1 kilómetro</strong> y Neptuno a casi <strong>6 kilómetros</strong>. 
              El 99.9999% del universo es vacío absoluto.
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
      <div className={`relative w-full ${isRealScale ? 'flex-1' : 'h-[500px] sm:h-[600px] md:h-[640px]'} bg-[#010204] overflow-hidden`}>
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Subtle hints & Active indicators */}
        <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-slate-400 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <span>🖱 Click planet to focus • Drag to rotate camera • Scroll to zoom</span>
          <span className="text-sky-400 hidden sm:inline">• Earth NEO Swarm Active</span>
          <span className="text-amber-400 hidden md:inline">• Main Asteroid Belt Active</span>
        </div>
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
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-semibold shadow-inner">
                360° Clear Penumbra View
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
                  <span className="text-slate-500 block text-[10px] uppercase">Surface Temp</span>
                  <span className="text-slate-200 font-semibold">{activePlanet.temperatureK}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Orbital Period</span>
                  <span className="text-sky-300 font-semibold">{activePlanet.orbitalPeriod}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Eccentricity (e)</span>
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
