import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    hasSatellites: true, // LEO, MEO, GEO & ISS satellite fleet
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
  },
  {
    id: 'blackhole',
    name: 'Sagittarius A* (Galactic Center)',
    spectralClass: 'Supermassive Black Hole (4.15×10⁶ M☉)',
    academicAreaEn: 'General Relativity, Gravitational Waves & Black Holes',
    academicAreaEs: 'Relatividad General, Ondas Gravitacionales y Agujeros Negros',
    courseId: 'relativity',
    descriptionEn: 'The supermassive gravitational anchor of the Milky Way (26,000 light-years away). Schwarzschild & Kerr spacetime metrics, event horizon geometry, gravitational lensing photon sphere, and relativistic Doppler accretion.',
    descriptionEs: 'El ancla gravitacional supermasiva de la Vía Láctea (a 26.000 años luz). Métricas de Schwarzschild y Kerr, horizonte de sucesos, esfera de fotones por lente gravitacional y disco de acreción con emisión Doppler relativista.',
    color: '#A855F7',
    size: 7.2,
    distance: 195,
    speed: 0.1,
    eccentricity: 0.07,
    axialTilt: 62.0,
    orbitalPeriod: '230 Million Years (Cosmic Year)',
    temperatureK: '1.4×10⁻¹⁴ K (Hawking) / 10⁷ K (Accretion Disk)',
    semiMajorAxisAU: '26,000 Light-Years (8.2 kpc)',
    orbitalSpeedKms: '230 km/s (Galactic Orbit of Sol)',
    realSize: 32.0,
    realDistance: 12000,
    isBlackHole: true,
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
// 3. SCIENTIFIC PROCEDURAL TEXTURES (DAY + PHOTOREALISTIC NIGHT CITY LIGHTS)
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

// VENUS
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

// EARTH: Daytime surface (Oceans, Continents, Ice)
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

// EARTH: NIGHT CITY LIGHTS MAP (NASA Black Marble Photography Style)
function createEarthNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Pitch black deep ocean background
  ctx.fillStyle = '#010204';
  ctx.fillRect(0, 0, 1024, 512);

  // Helper to render glowing incandescent metropolitan nodes
  const paintCityNode = (cx, cy, radius, intensity = 1.0, color = 'rgba(255, 215, 120, ') => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0.0, `${color}${0.95 * intensity})`);
    grad.addColorStop(0.3, `${color}${0.65 * intensity})`);
    grad.addColorStop(0.7, `rgba(255, 160, 50, ${0.25 * intensity})`);
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const paintCorridor = (x1, y1, x2, y2, width = 1.5) => {
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.45)';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // 1. NORTH AMERICA (US East Coast, Midwest, California, Texas)
  paintCityNode(295, 138, 22, 1.2); // NYC / Boston / DC Megalopolis
  paintCityNode(255, 142, 16, 1.0); // Chicago / Great Lakes
  paintCityNode(175, 160, 15, 1.0); // Los Angeles / SoCal
  paintCityNode(168, 145, 12, 0.9); // Bay Area
  paintCityNode(260, 175, 14, 0.9); // Texas Triangle (Houston/Dallas)
  paintCityNode(285, 178, 12, 0.85); // Florida / Atlanta
  paintCorridor(295, 138, 255, 142, 2);
  paintCorridor(255, 142, 260, 175, 1.5);

  // 2. WESTERN & CENTRAL EUROPE (Dense urban web)
  paintCityNode(515, 115, 14, 1.1); // London
  paintCityNode(522, 125, 14, 1.1); // Paris
  paintCityNode(535, 118, 18, 1.3); // Rhine-Ruhr / Benelux
  paintCityNode(510, 145, 12, 0.9); // Madrid / Lisbon
  paintCityNode(542, 140, 13, 0.95); // Po Valley / Milan / Rome
  paintCityNode(550, 112, 12, 0.9); // Berlin / Warsaw
  paintCityNode(615, 105, 16, 1.0); // Moscow
  paintCorridor(515, 115, 522, 125, 2);
  paintCorridor(522, 125, 535, 118, 2);
  paintCorridor(535, 118, 542, 140, 1.5);

  // 3. ASIA (Tokyo, Shanghai, Beijing, Seoul, Pearl River)
  paintCityNode(915, 152, 24, 1.5); // Tokyo Greater Area (Most luminous cluster on Earth)
  paintCityNode(895, 158, 16, 1.2); // Osaka / Nagoya
  paintCityNode(875, 148, 16, 1.2); // Seoul & South Korea
  paintCityNode(860, 165, 20, 1.3); // Shanghai / Yangtze Delta
  paintCityNode(845, 142, 18, 1.2); // Beijing / Tianjin
  paintCityNode(838, 192, 22, 1.4); // Pearl River Delta (Guangzhou / HK / Shenzhen)
  paintCityNode(865, 185, 12, 0.9); // Taiwan
  paintCorridor(915, 152, 895, 158, 2.5);
  paintCorridor(860, 165, 838, 192, 1.8);

  // 4. INDIA & MIDDLE EAST
  paintCityNode(735, 175, 20, 1.2); // New Delhi & Indo-Gangetic Plain
  paintCityNode(720, 205, 16, 1.1); // Mumbai
  paintCityNode(745, 220, 14, 1.0); // Bangalore / Chennai
  paintCityNode(605, 180, 14, 1.1); // Dubai / Abu Dhabi / Persian Gulf
  paintCityNode(545, 172, 18, 1.3); // Nile River Delta (Iconic glowing lotus flower)
  paintCorridor(545, 172, 545, 215, 2.0); // The Nile River ribbon

  // 5. SOUTH AMERICA, AFRICA & OCEANIA
  paintCityNode(380, 318, 18, 1.2); // São Paulo & Rio de Janeiro
  paintCityNode(345, 355, 16, 1.1); // Buenos Aires
  paintCityNode(310, 345, 12, 0.9); // Santiago
  paintCityNode(595, 335, 14, 1.0); // Johannesburg / Pretoria
  paintCityNode(945, 350, 14, 1.0); // Sydney
  paintCityNode(925, 362, 13, 0.95); // Melbourne

  // Background subtle web of human transport corridors and towns
  for (let i = 0; i < 600; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 512;
    // Concentrate in Northern Hemisphere temperate latitudes
    if (ry > 95 && ry < 240 && Math.random() > 0.4) {
      ctx.fillStyle = `rgba(255, 205, 110, ${Math.random() * 0.45})`;
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

// SAGITTARIUS A*: Relativistic Doppler-beamed accretion disk with turbulent Keplerian plasma filaments
function createBlackHoleAccretionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  for (let y = 0; y < 512; y++) {
    const thetaNorm = y / 512;
    const theta = thetaNorm * Math.PI * 2;
    // Relativistic Doppler beaming boost factor on approaching side
    const doppler = Math.pow(Math.max(0.08, 0.58 + 0.42 * Math.cos(theta)), 2.2);

    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const u = x / 1024; // 0 at inner radius (ISCO), 1 at outer boundary

      // Swirling Keplerian plasma filaments along logarithmic spirals
      const spiralCoord = thetaNorm * 18.0 + u * 12.0;
      const filamentNoise = noise.fbm2D(u * 12.0, spiralCoord, 4, 0.52, 2.1);
      const intensity = Math.max(0, Math.min(1.0, (1.0 - u) * 1.35 * filamentNoise * doppler));

      let r, g, b, alpha;
      if (u < 0.22) {
        // Blistering hot inner boundary (white-hot to incandescent amber)
        const t = u / 0.22;
        r = 255;
        g = Math.floor(245 - t * 55);
        b = Math.floor(215 - t * 165);
        alpha = Math.floor(intensity * 255);
      } else if (u < 0.65) {
        // Relativistic orange-vermilion synchrotron plasma
        const t = (u - 0.22) / 0.43;
        r = Math.floor(255 - t * 45);
        g = Math.floor(180 - t * 110);
        b = Math.floor(40 - t * 30);
        alpha = Math.floor(intensity * 240);
      } else {
        // Outer cooler accretion boundary fading into dark interstellar medium
        const t = (u - 0.65) / 0.35;
        r = Math.floor(210 * (1.0 - t));
        g = Math.floor(70 * (1.0 - t));
        b = Math.floor(20 * (1.0 - t));
        alpha = Math.floor(intensity * (1.0 - t) * 190);
      }

      d[idx] = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = Math.min(255, Math.max(0, alpha));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

// ============================================================================
// 4. SCIENTIFIC GLSL SHADERS (SOLAR PLASMA & EARTH DAY-NIGHT WITH CITY LIGHTS)
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

// Earth Custom Day-Night Shader: Direct Sunlight on Day Side + Incandescent City Lights on Night Side
const EarthDayNightShader = {
  uniforms: {
    uDayMap: { value: null },
    uNightMap: { value: null },
    uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
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
    uniform vec3 uSunPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(uSunPosition - vWorldPosition);

      float nDotL = dot(normal, sunDir);
      
      // Smooth terminator transition
      float dayFactor = smoothstep(-0.18, 0.22, nDotL);
      float nightFactor = smoothstep(0.15, -0.18, nDotL);

      vec4 dayColor = texture2D(uDayMap, vUv);
      vec4 nightLights = texture2D(uNightMap, vUv);

      // Specular ocean sun glint
      float isOcean = step(dayColor.r, 0.14) * (1.0 - step(dayColor.b, 0.25));
      vec3 halfVector = normalize(sunDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfVector)), 24.0) * isOcean * dayFactor;

      // Day side: Direct warm sunlight + base ambiance
      vec3 litDay = dayColor.rgb * (dayFactor * 4.4 + 0.42) + spec * vec3(1.0, 0.95, 0.85);

      // Night side: Soft legible continental silhouette + blazing golden city lights!
      vec3 nightSilhouette = dayColor.rgb * 0.35;
      vec3 litNight = nightSilhouette + nightLights.rgb * nightFactor * 2.8;

      vec3 finalColor = mix(litNight, litDay, dayFactor);
      gl_FragColor = vec4(finalColor, 1.0);
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
  const [isGalacticDriftActive, setIsGalacticDriftActive] = useState(true);
  const [liveTelemetry, setLiveTelemetry] = useState({ rAU: '1.000 AU', velKms: '29.8 km/s', nuDeg: '0.0°' });

  const animStateRef = useRef({
    activePlanet: PLANET_SUBJECTS[3],
    isPaused: false,
    speedMultiplier: 1,
    cameraMode: 'focus',
    isRealScale: false,
    isTransitioning: false,
    isGalacticDriftActive: true,
    galacticAngle: 0,
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
    // LIGHTING & AMBIENT SYSTEM
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0xDCE8FC, 0.90);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF8EB, 0x1E293B, 0.65);
    scene.add(hemiLight);

    // ========================================================================
    // 1. GALACTIC CENTER: SUPERMASSIVE BLACK HOLE (SAGITTARIUS A*) AT (0, 0, 0)
    // ========================================================================
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.position.set(0, 0, 0);
    scene.add(blackHoleGroup);

    // Event Horizon (Absolute Singularity Shadow)
    const sgrGeo = new THREE.SphereGeometry(7.2, 64, 64);
    const sgrMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sgrMesh = new THREE.Mesh(sgrGeo, sgrMat);
    blackHoleGroup.add(sgrMesh);

    // Relativistic Doppler-Beamed Accretion Disk
    const diskInner = 9.2;
    const diskOuter = 34.0;
    const diskGeo = new THREE.RingGeometry(diskInner, diskOuter, 128, 8);
    const posAttrD = diskGeo.attributes.position;
    const uvAttrD = diskGeo.attributes.uv;
    for (let i = 0; i < posAttrD.count; i++) {
      const vx = posAttrD.getX(i);
      const vy = posAttrD.getY(i);
      const vr = Math.sqrt(vx * vx + vy * vy);
      const uRad = (vr - diskInner) / (diskOuter - diskInner);
      const theta = (Math.atan2(vy, vx) + Math.PI) / (2 * Math.PI);
      uvAttrD.setXY(i, uRad, theta);
    }
    uvAttrD.needsUpdate = true;

    const diskTex = createBlackHoleAccretionTexture();
    const diskMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.rotation.x = Math.PI / 2 + 0.18;
    diskMesh.rotation.z = 0.25;
    blackHoleGroup.add(diskMesh);

    // Gravitational Lensing Photon Halo Rings
    const photonHaloGeo = new THREE.TorusGeometry(9.6, 0.48, 30, 100);
    const photonHaloMat = new THREE.MeshBasicMaterial({
      color: 0xFFA000,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });
    const photonHaloMesh = new THREE.Mesh(photonHaloGeo, photonHaloMat);
    photonHaloMesh.rotation.y = 0.28;
    photonHaloMesh.rotation.x = 0.15;
    blackHoleGroup.add(photonHaloMesh);

    const outerHaloGeo = new THREE.TorusGeometry(11.8, 0.32, 24, 96);
    const outerHaloMat = new THREE.MeshBasicMaterial({
      color: 0x818CF8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const outerHaloMesh = new THREE.Mesh(outerHaloGeo, outerHaloMat);
    outerHaloMesh.rotation.y = 0.28;
    blackHoleGroup.add(outerHaloMesh);

    // Photon Sphere Glow Shell
    const photonSphereGeo = new THREE.SphereGeometry(7.8, 48, 48);
    const photonSphereMat = new THREE.MeshBasicMaterial({
      color: 0xFFB703,
      transparent: true,
      opacity: 0.45,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const photonSphereMesh = new THREE.Mesh(photonSphereGeo, photonSphereMat);
    blackHoleGroup.add(photonSphereMesh);

    // Relativistic Bipolar Jets
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

    // S-Star Nuclear Star Cluster
    const sStarCount = 1200;
    const sStarGeo = new THREE.BufferGeometry();
    const sStarPositions = new Float32Array(sStarCount * 3);
    const sStarColors = new Float32Array(sStarCount * 3);
    const sStarSpeeds = new Float32Array(sStarCount);
    const sStarRadii = new Float32Array(sStarCount);
    const sStarAngles = new Float32Array(sStarCount);
    const sStarIncs = new Float32Array(sStarCount);

    for (let i = 0; i < sStarCount; i++) {
      const rad = 14 + Math.random() * 65;
      const ang = Math.random() * Math.PI * 2;
      const inc = (Math.random() - 0.5) * Math.PI * 0.75;
      sStarRadii[i] = rad;
      sStarAngles[i] = ang;
      sStarIncs[i] = inc;
      sStarSpeeds[i] = Math.sqrt(800 / rad) * (0.8 + Math.random() * 0.4);

      sStarPositions[i * 3] = rad * Math.cos(ang);
      sStarPositions[i * 3 + 1] = rad * Math.sin(inc) * Math.sin(ang);
      sStarPositions[i * 3 + 2] = rad * Math.cos(inc) * Math.sin(ang);

      const isHot = Math.random() > 0.35;
      sStarColors[i * 3] = isHot ? 0.85 : 1.0;
      sStarColors[i * 3 + 1] = isHot ? 0.92 : 0.65;
      sStarColors[i * 3 + 2] = isHot ? 1.0 : 0.35;
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

    // Galactic Orbit Trajectory Line for the Sun
    const galOrbitRes = 180;
    const galOrbitRadius = 195;
    const galOrbitPoints = [];
    for (let i = 0; i <= galOrbitRes; i++) {
      const th = (i / galOrbitRes) * Math.PI * 2;
      const gx = galOrbitRadius * Math.cos(th);
      const gz = galOrbitRadius * Math.sin(th);
      const gy = Math.sin(th * 2.8) * 7.0;
      galOrbitPoints.push(new THREE.Vector3(gx, gy, gz));
    }
    const galOrbitGeo = new THREE.BufferGeometry().setFromPoints(galOrbitPoints);
    const galOrbitMat = new THREE.LineBasicMaterial({
      color: 0x818CF8,
      transparent: true,
      opacity: 0.38,
    });
    const galOrbitLine = new THREE.LineLoop(galOrbitGeo, galOrbitMat);
    scene.add(galOrbitLine);

    // ========================================================================
    // 2. SOLAR SYSTEM HIERARCHY (ORBITING AROUND SAGITTARIUS A*)
    // ========================================================================
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Point Sunlight (Attached to the moving Sun)
    const sunLight = new THREE.PointLight(0xFFFBF0, 5.2, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.bias = -0.0002;
    solarSystemGroup.add(sunLight);

    // Sol Thermonuclear Mesh & Corona
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

    // Solar Apex Velocity Vector (Forward direction through the galaxy)
    const apexArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      8.5,
      0x10B981,
      2.0,
      1.1
    );
    solarSystemGroup.add(apexArrow);

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

    // Cache Earth textures
    const earthDayTex = createEarthDiffuseTexture();
    const earthNightTex = createEarthNightTexture();

    let earthMaterialRef = null;

    const orbitalPlanets = PLANET_SUBJECTS.filter(p => p.id !== 'sun' && p.id !== 'blackhole');

    orbitalPlanets.forEach((pData) => {
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
      solarSystemGroup.add(orbitLine);

      // Planet Anchor & Axial Tilt
      const planetAnchor = new THREE.Group();
      solarSystemGroup.add(planetAnchor);

      const axialTiltGroup = new THREE.Group();
      axialTiltGroup.rotation.z = THREE.MathUtils.degToRad(pData.axialTilt || 0);
      planetAnchor.add(axialTiltGroup);

      const pGeo = new THREE.SphereGeometry(pData.size, 48, 48);
      let pMesh;

      // EARTH USES DUAL DAY-NIGHT CITY LIGHTS SHADER
      if (pData.id === 'earth') {
        const earthMat = new THREE.ShaderMaterial({
          uniforms: {
            uDayMap: { value: earthDayTex },
            uNightMap: { value: earthNightTex },
            uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
          },
          vertexShader: EarthDayNightShader.vertexShader,
          fragmentShader: EarthDayNightShader.fragmentShader,
        });
        earthMaterialRef = earthMat;
        pMesh = new THREE.Mesh(pGeo, earthMat);
      } else {
        // OTHER PLANETS USE PBR STANDARD MATERIAL
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

      // Earth Features: Clouds, Moon & Real Artificial Satellites (LEO, MEO, GEO, ISS)
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
        // Realistic Moon position (r = 4.2), far outside all artificial satellites
        moonMesh.position.set(4.2, 0.5, 0);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonAnchor.add(moonMesh);
      }

      // REALISTIC 3D SPACECRAFT (ISS AT LEO r=1.36 & GEO COMM SATELLITE AT r=1.95 - WELL INSIDE MOON)
      if (pData.hasSatellites) {
        satellitesGroup = new THREE.Group();
        planetAnchor.add(satellitesGroup);

        // 1. Low Earth Orbit (LEO) - International Space Station (ISS) with 3D Solar Arrays
        const issGroup = new THREE.Group();
        const moduleGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8);
        const moduleMat = new THREE.MeshStandardMaterial({
          color: 0xF1F5F9,
          metalness: 0.9,
          roughness: 0.15,
        });
        const moduleMesh = new THREE.Mesh(moduleGeo, moduleMat);
        moduleMesh.rotation.z = Math.PI / 2;
        issGroup.add(moduleMesh);

        const panelGeo = new THREE.BoxGeometry(0.008, 0.08, 0.22);
        const panelMat = new THREE.MeshStandardMaterial({
          color: 0x1E3A8A,
          metalness: 0.95,
          roughness: 0.1,
        });
        const leftPanel = new THREE.Mesh(panelGeo, panelMat);
        leftPanel.position.set(0.11, 0, 0);
        issGroup.add(leftPanel);

        const rightPanel = new THREE.Mesh(panelGeo, panelMat);
        rightPanel.position.set(-0.11, 0, 0);
        issGroup.add(rightPanel);

        // Orbit Anchor inclined at real 51.6°
        const leoOrbitGroup = new THREE.Group();
        leoOrbitGroup.rotation.x = THREE.MathUtils.degToRad(51.6);
        issGroup.position.set(1.36, 0, 0);
        leoOrbitGroup.add(issGroup);
        satellitesGroup.add(leoOrbitGroup);

        // Clean, subtle LEO Orbit Trace
        const leoTraceGeo = new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, 1.36, 1.36, 0, Math.PI * 2, false, 0)
            .getPoints(96)
            .map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const leoTraceMat = new THREE.LineBasicMaterial({
          color: 0x38BDF8,
          transparent: true,
          opacity: 0.28,
        });
        const leoTrace = new THREE.LineLoop(leoTraceGeo, leoTraceMat);
        leoOrbitGroup.add(leoTrace);

        // 2. Geostationary (GEO) Communications Satellite at r = 1.95 (Equatorial, well inside Moon at 4.2)
        const geoSatellite = new THREE.Group();
        const geoBusGeo = new THREE.BoxGeometry(0.045, 0.045, 0.045);
        const geoBusMat = new THREE.MeshStandardMaterial({
          color: 0xF59E0B, // Golden Kapton MLI thermal insulation
          metalness: 0.88,
          roughness: 0.2,
        });
        const geoBusMesh = new THREE.Mesh(geoBusGeo, geoBusMat);
        geoSatellite.add(geoBusMesh);

        const geoPanelGeo = new THREE.BoxGeometry(0.006, 0.06, 0.14);
        const geoPanelMat = new THREE.MeshStandardMaterial({
          color: 0x1E40AF,
          metalness: 0.95,
          roughness: 0.12,
        });
        const geoPanelMesh = new THREE.Mesh(geoPanelGeo, geoPanelMat);
        geoSatellite.add(geoPanelMesh);

        const geoOrbitGroup = new THREE.Group();
        geoSatellite.position.set(1.95, 0, 0);
        geoOrbitGroup.add(geoSatellite);
        satellitesGroup.add(geoOrbitGroup);

        const geoTraceGeo = new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, 1.95, 1.95, 0, Math.PI * 2, false, 0)
            .getPoints(96)
            .map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const geoTraceMat = new THREE.LineBasicMaterial({
          color: 0xF59E0B,
          transparent: true,
          opacity: 0.18,
        });
        const geoTrace = new THREE.LineLoop(geoTraceGeo, geoTraceMat);
        geoOrbitGroup.add(geoTrace);
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

    // Register Sagittarius A* into selectable planetObjects
    planetObjects.push({
      data: PLANET_SUBJECTS.find(p => p.id === 'blackhole'),
      mesh: sgrMesh,
      anchor: blackHoleGroup,
      angle: 0,
      radius: 0,
    });

    // ========================================================================
    // 3. REALISTIC 3D INSTANCED ROCKY ASTEROID BELT (BETWEEN MARS AND JUPITER)
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
      dummyScale.set(scale, scale * (0.8 + Math.random() * 0.4), scale * (0.8 + Math.random() * 0.4));
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

      // 1. Galactic Drift: The Sun and its entire solar system orbit Sagittarius A*
      if (!paused && animStateRef.current.isGalacticDriftActive) {
        animStateRef.current.galacticAngle += delta * 0.024 * warp;
      }
      const gAngle = animStateRef.current.galacticAngle;
      const sunGalX = galOrbitRadius * Math.cos(gAngle);
      const sunGalZ = galOrbitRadius * Math.sin(gAngle);
      const sunGalY = Math.sin(gAngle * 2.8) * 7.0;
      solarSystemGroup.position.set(sunGalX, sunGalY, sunGalZ);
      solarSystemGroup.rotation.y = -gAngle + Math.PI / 2;

      // 2. Rotate Black Hole Accretion Disk & S-Stars
      diskMesh.rotation.z += delta * 0.14;
      photonHaloMesh.rotation.z -= delta * 0.08;

      // S-Stars relativistic Keplerian orbits around Sgr A*
      const posArray = sStarGeo.attributes.position.array;
      for (let i = 0; i < sStarCount; i++) {
        if (!paused) {
          sStarAngles[i] += sStarSpeeds[i] * delta * 0.18 * warp;
        }
        const ang = sStarAngles[i];
        const rad = sStarRadii[i];
        const inc = sStarIncs[i];
        posArray[i * 3] = rad * Math.cos(ang);
        posArray[i * 3 + 1] = rad * Math.sin(inc) * Math.sin(ang);
        posArray[i * 3 + 2] = rad * Math.cos(inc) * Math.sin(ang);
      }
      sStarGeo.attributes.position.needsUpdate = true;

      // 3. Realistic 3D Instanced Asteroids tumbling and revolving around the Sun
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

      // Update Sun position in Earth Day/Night shader
      if (earthMaterialRef) {
        sunMesh.getWorldPosition(earthMaterialRef.uniforms.uSunPosition.value);
      }

      const targetSunSize = realScaleMode ? 12.0 : 3.4;
      sunMesh.scale.lerp(new THREE.Vector3(targetSunSize / 3.4, targetSunSize / 3.4, targetSunSize / 3.4), 0.08);

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

        // Diurnal axial rotation
        pObj.mesh.rotation.y += delta * 0.45;

        if (pObj.cloudsMesh) {
          pObj.cloudsMesh.rotation.y += delta * 0.55;
          pObj.cloudsMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        if (pObj.moonAnchor) {
          pObj.moonAnchor.rotation.y += delta * 1.2;
        }

        // Real 3D Spacecraft (ISS & GEO) Rapid Orbit passes around Earth
        if (pObj.satellitesGroup) {
          pObj.satellitesGroup.rotation.y += delta * 0.85;
        }

        if (currentActive.id === pObj.data.id) {
          pObj.anchor.getWorldPosition(activeWorldPos);
          activeSpeedKms = (pObj.data.distance / Math.max(1, r)) * 29.8;
        }
      });

      if (Math.random() < 0.1) {
        if (currentActive.id === 'blackhole') {
          setLiveTelemetry({
            rAU: '26,000 ly (8.2 kpc)',
            velKms: '230 km/s (Sol Orbit)',
            nuDeg: `${((gAngle * 180 / Math.PI) % 360).toFixed(1)}°`,
          });
        } else {
          const trueAnomalyDeg = ((activeWorldPos.length() > 0 ? Math.atan2(activeWorldPos.z, activeWorldPos.x) : 0) * (180 / Math.PI) + 360) % 360;
          setLiveTelemetry({
            rAU: currentActive.semiMajorAxisAU || '1.000 AU',
            velKms: currentActive.orbitalSpeedKms || `${activeSpeedKms.toFixed(1)} km/s`,
            nuDeg: `${trueAnomalyDeg.toFixed(1)}°`,
          });
        }
      }

      // Camera Positioning
      if (currentActive.id === 'blackhole') {
        const sgrCamPos = realScaleMode ? new THREE.Vector3(0, 350, 520) : new THREE.Vector3(0, 24, 46);
        if (transitioning) {
          controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.06);
          camera.position.lerp(sgrCamPos, 0.06);
          if (camera.position.distanceTo(sgrCamPos) < 1.0) {
            animStateRef.current.isTransitioning = false;
          }
        } else {
          controls.target.copy(activeWorldPos);
        }
      } else if (mode === 'overview' || currentActive.id === 'sun') {
        const overviewOffset = realScaleMode ? new THREE.Vector3(0, 1800, 2600) : new THREE.Vector3(0, 52, 76);
        const overviewCamPos = activeWorldPos.clone().add(overviewOffset);
        if (transitioning) {
          controls.target.lerp(activeWorldPos, 0.05);
          camera.position.lerp(overviewCamPos, 0.05);
          if (camera.position.distanceTo(overviewCamPos) < 1.0) {
            animStateRef.current.isTransitioning = false;
          }
        } else {
          const sunDelta = activeWorldPos.clone().sub(prevActivePlanetPos);
          camera.position.add(sunDelta);
          controls.target.copy(activeWorldPos);
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
      rockGeo.dispose();
      rockMat.dispose();
      asteroidBelt.dispose();
      sgrGeo.dispose();
      sgrMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      diskTex.dispose();
      photonHaloGeo.dispose();
      photonHaloMat.dispose();
      outerHaloGeo.dispose();
      outerHaloMat.dispose();
      photonSphereGeo.dispose();
      photonSphereMat.dispose();
      jetGeo.dispose();
      jetMat.dispose();
      sStarGeo.dispose();
      sStarMat.dispose();
      galOrbitGeo.dispose();
      galOrbitMat.dispose();
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
                8 Planets + Satellites + Belt
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Epoch J2000.0 • Galactic Orbit around Sgr A* • 3D Satellite Fleet (ISS/GEO) & Rocky Asteroid Belt
            </p>
          </div>

          {/* Mode, Warp, and REAL SCALE Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs self-start md:self-auto">
            <button
              onClick={() => setIsGalacticDriftActive(!isGalacticDriftActive)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isGalacticDriftActive
                  ? 'bg-purple-900/80 text-purple-200 border-purple-500 shadow-md shadow-purple-900/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle heliocentric drift around Sagittarius A* supermassive black hole"
            >
              <span>{isGalacticDriftActive ? '🌀 Galactic Orbit: Active' : '⏸ Galactic Orbit: Frozen'}</span>
            </button>

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
              {cameraMode === 'overview' ? '🔭 System Overview' : '🎯 Focus Body'}
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
              <span className="text-white font-bold">{activePlanet.id === 'blackhole' ? 'Sgr A*' : activePlanet.name.split(' ')[0]}</span>
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
            {PLANET_SUBJECTS.map((planet) => {
              const isBlackHole = planet.id === 'blackhole';
              const isSelected = activePlanet.id === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelectPlanet(planet)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition-all border flex items-center gap-1 ${
                    isSelected
                      ? isBlackHole
                        ? 'bg-purple-700 text-white border-purple-400 font-bold shadow-md shadow-purple-700/50 ring-2 ring-purple-400/40'
                        : 'bg-galileo-600/90 text-white border-galileo-400 font-semibold shadow-md shadow-galileo-600/40'
                      : isBlackHole
                        ? 'bg-purple-950/60 text-purple-300 border-purple-900 hover:border-purple-600 hover:bg-purple-900/40'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isBlackHole ? '🕳️ Sgr A*' : planet.name.split(' ')[0]}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* ==================================================================== */}
      {/* 2. REAL SCALE EXPLANATORY BANNER (ONLY IN REAL SCALE MODE)          */}
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
        
        {/* Active features indicators */}
        <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-slate-400 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center gap-3">
          <span>🖱 Click body to focus • Drag to rotate camera • Scroll to zoom</span>
          <span className="text-purple-400 hidden sm:inline">• Sgr A* Supermassive Black Hole & Relativistic Jets</span>
          <span className="text-sky-400 hidden md:inline">• 3D Spacecraft (ISS & GEO inside Lunar Orbit)</span>
          <span className="text-amber-400 hidden lg:inline">• 3D Instanced Asteroid Belt</span>
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
                {activePlanet.id === 'earth'
                  ? 'City Lights & 3D Orbital Fleet'
                  : activePlanet.id === 'blackhole'
                  ? 'Supermassive Event Horizon & Doppler Beaming'
                  : '360° Clear Penumbra View'}
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
