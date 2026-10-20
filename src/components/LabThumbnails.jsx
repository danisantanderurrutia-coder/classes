import React from 'react';

/**
 * High-precision vector schematic thumbnails for each Physics & Calculus Lab Problem.
 * Displays the free-body diagram, geometry, force vectors, and exercise parameters.
 */

export function ProblemThumbnail({ problemId, lang = 'es' }) {
  const isEn = lang === 'en';

  switch (problemId) {
    case 'newtonian':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-sky-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-newt" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
              </pattern>
              <linearGradient id="rampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0369A1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <rect width="360" height="160" fill="url(#grid-newt)" />

            {/* Incline Triangle */}
            <polygon points="40,140 250,140 250,45" fill="url(#rampGrad)" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="20" y1="140" x2="340" y2="140" stroke="#334155" strokeWidth="1.5" />
            
            {/* Angle Arc */}
            <path d="M 80,140 A 40,40 0 0,0 75,124" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x="88" y="134" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="bold">θ=30°</text>

            {/* Block m1 on Ramp (Rotated 30 deg approx) */}
            <g transform="translate(150, 90) rotate(-24.5)">
              <rect x="-18" y="-22" width="36" height="22" rx="3" fill="#0EA5E9" stroke="#E0F2FE" strokeWidth="1.5" />
              <text x="0" y="-7" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">m₁</text>
              {/* Normal Force N */}
              <line x1="0" y1="-22" x2="0" y2="-45" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrow)" />
              <polygon points="0,-48 -3,-40 3,-40" fill="#EF4444" />
              <text x="5" y="-36" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono">N</text>
              {/* Tension T */}
              <line x1="18" y1="-11" x2="45" y2="-11" stroke="#38BDF8" strokeWidth="2" />
              <polygon points="48,-11 40,-14 40,-8" fill="#38BDF8" />
              <text x="32" y="-16" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">T</text>
              {/* Friction fr */}
              <line x1="-18" y1="-2" x2="-38" y2="-2" stroke="#F59E0B" strokeWidth="1.8" />
              <polygon points="-41,-2 -34,-5 -34,1" fill="#F59E0B" />
              <text x="-38" y="10" fill="#F59E0B" fontSize="9" fontFamily="JetBrains Mono">f_r</text>
            </g>

            {/* Pulley at Apex */}
            <circle cx="250" cy="45" r="9" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="250" cy="45" r="2.5" fill="#38BDF8" />
            
            {/* Cord from m1 to Pulley & Down to m2 */}
            <line x1="165" y1="83" x2="250" y2="36" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3,1" />
            <line x1="259" y1="45" x2="259" y2="85" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3,1" />

            {/* Hanging Block m2 */}
            <rect x="249" y="85" width="20" height="20" rx="3" fill="#10B981" stroke="#D1FAE5" strokeWidth="1.5" />
            <text x="259" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">m₂</text>
            {/* m2 Gravity */}
            <line x1="259" y1="105" x2="259" y2="128" stroke="#10B981" strokeWidth="2" />
            <polygon points="259,132 256,124 262,124" fill="#10B981" />
            <text x="265" y="122" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono">m₂g</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="195" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: m₁=6kg, m₂=6kg → a=?' : 'EXAMEN: m₁=6kg, m₂=6kg → a=?'}
            </text>
            <text x="280" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              a = 1.60 m/s²
            </text>
          </svg>
        </div>
      );

    case 'intro_physics':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-emerald-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-ballistics" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-ballistics)" />

            {/* Ground line */}
            <line x1="20" y1="135" x2="340" y2="135" stroke="#334155" strokeWidth="1.5" />

            {/* Trajectory 1: Ideal Vacuum Parabola (Cyan Dashed) */}
            <path
              d="M 45,135 Q 180,10 315,135"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.8"
              strokeDasharray="4,3"
            />
            {/* Trajectory 2: With Real Atmospheric Drag (Emerald Solid) */}
            <path
              d="M 45,135 Q 165,30 255,135"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
            />

            {/* Launch Cannon / Base */}
            <circle cx="45" cy="135" r="5" fill="#10B981" />
            <line x1="45" y1="135" x2="80" y2="100" stroke="#34D399" strokeWidth="2.5" />
            <polygon points="84,96 75,98 81,104" fill="#34D399" />
            <text x="86" y="96" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">v₀, θ</text>

            {/* Drag vector at flight point */}
            <circle cx="160" cy="55" r="4.5" fill="#F59E0B" />
            <line x1="160" y1="55" x2="135" y2="40" stroke="#EF4444" strokeWidth="2" />
            <polygon points="132,38 136,45 142,40" fill="#EF4444" />
            <text x="100" y="38" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono">F_drag</text>

            {/* Height Peak Line */}
            <line x1="180" y1="73" x2="180" y2="135" stroke="#64748B" strokeWidth="1" strokeDasharray="2,2" />
            <text x="184" y="105" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">H_max</text>

            {/* Range markers */}
            <line x1="45" y1="145" x2="315" y2="145" stroke="#38BDF8" strokeWidth="1" />
            <line x1="45" y1="141" x2="45" y2="149" stroke="#38BDF8" strokeWidth="1" />
            <line x1="315" y1="141" x2="315" y2="149" stroke="#38BDF8" strokeWidth="1" />
            <text x="270" y="155" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'R_vacuum' : 'R_vacío'}</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: v₀=30m/s, θ=45° → R=?' : 'EXAMEN: v₀=30m/s, θ=45° → R=?'}
            </text>
            <text x="255" y="24" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              R = 91.74 m
            </text>
          </svg>
        </div>
      );

    case 'engineering':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-sky-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-eng" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-eng)" />

            {/* Beam Body */}
            <rect x="50" y="70" width="260" height="12" rx="2" fill="#1E293B" stroke="#0284C7" strokeWidth="1.8" />
            <line x1="50" y1="76" x2="310" y2="76" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4,2" />

            {/* Support A (Pin Triangle) */}
            <polygon points="70,82 60,105 80,105" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="55" y1="105" x2="85" y2="105" stroke="#64748B" strokeWidth="2" />
            {/* Reaction R_A */}
            <line x1="70" y1="125" x2="70" y2="92" stroke="#10B981" strokeWidth="2" />
            <polygon points="70,87 67,95 73,95" fill="#10B981" />
            <text x="76" y="125" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">R_A</text>

            {/* Support B (Roller Circle) */}
            <circle cx="290" cy="91" r="9" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="275" y1="105" x2="305" y2="105" stroke="#64748B" strokeWidth="2" />
            {/* Reaction R_B */}
            <line x1="290" y1="125" x2="290" y2="102" stroke="#10B981" strokeWidth="2" />
            <polygon points="290,97 287,105 293,105" fill="#10B981" />
            <text x="296" y="125" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">R_B</text>

            {/* Concentrated Load F at 3/4 L */}
            <line x1="230" y1="35" x2="230" y2="68" stroke="#EF4444" strokeWidth="2.5" />
            <polygon points="230,72 226,62 234,62" fill="#EF4444" />
            <text x="236" y="48" fill="#EF4444" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">F = 785 N</text>

            {/* Beam Dimensions L=4m */}
            <line x1="70" y1="140" x2="290" y2="140" stroke="#64748B" strokeWidth="1" />
            <line x1="70" y1="136" x2="70" y2="144" stroke="#64748B" strokeWidth="1" />
            <line x1="290" y1="136" x2="290" y2="144" stroke="#64748B" strokeWidth="1" />
            <text x="165" y="150" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">L = 4.0 m</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: ∑M_A = 0 → R_B = ?' : 'EXAMEN: ∑M_A = 0 → R_B = ?'}
            </text>
            <text x="248" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              R_B = 588.6 N
            </text>
          </svg>
        </div>
      );

    case 'electromagnetism':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-purple-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-em" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-em)" />

            {/* Magnetic Field Crosses Grid */}
            {[80, 140, 200, 260].map((x) =>
              [50, 90, 130].map((y) => (
                <g key={`${x}-${y}`} stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.2">
                  <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
                  <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
                </g>
              ))
            )}
            <text x="310" y="60" fill="#A855F7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">B (⊗)</text>

            {/* Circular Cyclotron Orbit */}
            <circle cx="180" cy="90" r="42" fill="none" stroke="#818CF8" strokeWidth="1.8" strokeDasharray="4,2" />
            <circle cx="180" cy="90" r="2" fill="#818CF8" />

            {/* Charged Particle (+q) at top of circle */}
            <g transform="translate(180, 48)">
              <circle cx="0" cy="0" r="7" fill="#EF4444" stroke="#FECACA" strokeWidth="1.5" />
              <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">+q</text>
              {/* Velocity vector (horizontal right) */}
              <line x1="7" y1="0" x2="35" y2="0" stroke="#38BDF8" strokeWidth="2" />
              <polygon points="38,0 30,-3 30,3" fill="#38BDF8" />
              <text x="25" y="-6" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">v</text>
              {/* Lorentz Force F_B towards center (downward) */}
              <line x1="0" y1="7" x2="0" y2="28" stroke="#10B981" strokeWidth="2" />
              <polygon points="0,32 -3,24 3,24" fill="#10B981" />
              <text x="6" y="22" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono">F_B</text>
            </g>

            {/* Radius Marker */}
            <line x1="180" y1="90" x2="218" y2="105" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2,2" />
            <text x="202" y="112" fill="#CBD5E1" fontSize="9" fontFamily="JetBrains Mono">r = mv/qB</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: q·v·B = m·v²/r → v₀=?' : 'EXAMEN: q·v·B = m·v²/r → v₀=?'}
            </text>
            <text x="258" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              v₀ = 30 m/s
            </text>
          </svg>
        </div>
      );

    case 'thermodynamics':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-amber-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-thermo" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(245, 158, 11, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-thermo)" />

            {/* P-V Axes */}
            <line x1="60" y1="135" x2="310" y2="135" stroke="#64748B" strokeWidth="1.5" />
            <polygon points="314,135 306,132 306,138" fill="#64748B" />
            <text x="316" y="138" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">V</text>

            <line x1="60" y1="135" x2="60" y2="30" stroke="#64748B" strokeWidth="1.5" />
            <polygon points="60,26 57,34 63,34" fill="#64748B" />
            <text x="48" y="32" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">P</text>

            {/* Closed Cycle Polygon: 1(100,50) -> 2(230,95) [Isotherm curve] -> 3(100,95) [Isobaric] -> 1 */}
            <path
              d="M 100,50 Q 170,75 240,105 L 100,105 Z"
              fill="rgba(245, 158, 11, 0.15)"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            {/* Cycle Direction Arrows */}
            <polygon points="175,77 167,73 170,81" fill="#F59E0B" />
            <polygon points="170,105 178,102 178,108" fill="#F59E0B" />
            <polygon points="100,75 97,83 103,83" fill="#F59E0B" />

            {/* Cycle States */}
            <circle cx="100" cy="50" r="3.5" fill="#EF4444" />
            <text x="90" y="44" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">1</text>
            <circle cx="240" cy="105" r="3.5" fill="#38BDF8" />
            <text x="246" y="108" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">2</text>
            <circle cx="100" cy="105" r="3.5" fill="#10B981" />
            <text x="88" y="115" fill="#10B981" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">3</text>

            <text x="140" y="94" fill="#FBBF24" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">W = ∮ P dV</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#FBBF24" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: W = n·R·T·ln(V₂/V₁) → W=?' : 'EXAMEN: W = n·R·T·ln(V₂/V₁) → W=?'}
            </text>
            <text x="250" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              W = +2305 J
            </text>
          </svg>
        </div>
      );

    case 'waves_geophysics':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-red-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-waves" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-waves)" />

            {/* Earth Surface */}
            <line x1="20" y1="50" x2="340" y2="50" stroke="#94A3B8" strokeWidth="1.8" />
            <text x="290" y="44" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">z = 0</text>

            {/* Layer Boundary (Refractor at z = 40m) */}
            <line x1="20" y1="105" x2="340" y2="105" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="25" y="75" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono">{isEn ? 'Layer 1: v₁=2.0 km/s' : 'Capa 1: v₁=2.0 km/s'}</text>
            <text x="25" y="130" fill="#EF4444" fontSize="10" fontFamily="JetBrains Mono">{isEn ? 'Layer 2: v₂=4.0 km/s' : 'Capa 2: v₂=4.0 km/s'}</text>

            {/* Seismic Source (Explosion / Hammer) */}
            <circle cx="60" cy="50" r="5" fill="#F59E0B" />
            <text x="54" y="42" fill="#F59E0B" fontSize="12">💥</text>

            {/* Critical Incident Ray */}
            <line x1="60" y1="50" x2="130" y2="105" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="98,80 91,73 99,71" fill="#F59E0B" />

            {/* Critical Angle Arc */}
            <text x="80" y="65" fill="#FBBF24" fontSize="9" fontFamily="JetBrains Mono">θ_c=30°</text>

            {/* Head Wave propagating along interface at v2 */}
            <line x1="130" y1="105" x2="230" y2="105" stroke="#EF4444" strokeWidth="2.5" />
            <polygon points="185,105 178,101 178,109" fill="#EF4444" />

            {/* Critically emerging ray back to geophone */}
            <line x1="230" y1="105" x2="300" y2="50" stroke="#10B981" strokeWidth="2" />
            <polygon points="268,75 260,78 266,84" fill="#10B981" />
            <circle cx="300" cy="50" r="4" fill="#10B981" />
            <text x="295" y="42" fill="#10B981" fontSize="10">📍</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#F87171" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: sin(θ_c) = v₁/v₂ → θ_c=?' : 'EXAMEN: sin(θ_c) = v₁/v₂ → θ_c=?'}
            </text>
            <text x="260" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              θ_c = 30.0°
            </text>
          </svg>
        </div>
      );

    case 'vector_calculus':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-sky-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-vc" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-vc)" />

            {/* Vector Field Whirlpool Curvature */}
            {[
              { x: 180, y: 55, dx: 18, dy: 0 },
              { x: 220, y: 90, dx: 0, dy: 18 },
              { x: 180, y: 125, dx: -18, dy: 0 },
              { x: 140, y: 90, dx: 0, dy: -18 },
              { x: 195, y: 65, dx: 15, dy: 6 },
              { x: 215, y: 105, dx: -6, dy: 15 },
              { x: 165, y: 115, dx: -15, dy: -6 },
              { x: 145, y: 75, dx: 6, dy: -15 }
            ].map((v, i) => (
              <g key={i}>
                <line x1={v.x} y1={v.y} x2={v.x + v.dx} y2={v.y + v.dy} stroke="#0284C7" strokeWidth="1.2" opacity="0.6" />
                <circle cx={v.x + v.dx} cy={v.y + v.dy} r="1.5" fill="#38BDF8" opacity="0.8" />
              </g>
            ))}

            {/* Closed Loop C (Ellipse) */}
            <ellipse
              cx="180"
              cy="90"
              rx="55"
              ry="32"
              fill="rgba(2, 132, 199, 0.12)"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Direction Arrows on C */}
            <polygon points="185,58 175,55 178,63" fill="#38BDF8" />
            <polygon points="175,122 185,125 182,117" fill="#38BDF8" />
            <text x="240" y="85" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">C</text>
            <text x="180" y="93" fill="#E2E8F0" fontSize="10" fontFamily="JetBrains Mono">S</text>

            {/* Curl Vector ∇×F (Vertical Out of Plane) */}
            <line x1="180" y1="90" x2="180" y2="40" stroke="#10B981" strokeWidth="2.5" />
            <polygon points="180,35 176,44 184,44" fill="#10B981" />
            <text x="186" y="44" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">∇×F = 6</text>

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'STOKES: ∮ F·dr = ∬(∇×F)·dS' : 'STOKES: ∮ F·dr = ∬(∇×F)·dS'}
            </text>
            <text x="246" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              ∮ F·dr = 24π J
            </text>
          </svg>
        </div>
      );

    case 'relativity':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-purple-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-rel" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1" />
              </pattern>
              <radialGradient id="bhGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="60%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="360" height="160" fill="url(#grid-rel)" />

            {/* Central Black Hole & Event Horizon */}
            <circle cx="160" cy="85" r="28" fill="url(#bhGlow)" />
            <circle cx="160" cy="85" r="14" fill="#000000" stroke="#A855F7" strokeWidth="1.8" />
            <circle cx="160" cy="85" r="18" fill="none" stroke="#F43F5E" strokeWidth="0.8" strokeDasharray="2,2" />
            <text x="160" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="JetBrains Mono">M</text>

            {/* Orbit 1: Ellipse */}
            <ellipse
              cx="195"
              cy="85"
              rx="65"
              ry="34"
              fill="none"
              stroke="#818CF8"
              strokeWidth="1.5"
              transform="rotate(-15 160 85)"
            />
            {/* Orbit 2: Precessed Ellipse */}
            <ellipse
              cx="195"
              cy="85"
              rx="65"
              ry="34"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="1.5"
              strokeDasharray="3,2"
              transform="rotate(15 160 85)"
            />

            {/* Perihelion Shift Angle Arc */}
            <path d="M 255,62 A 90,90 0 0,1 255,108" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
            <text x="265" y="88" fill="#FBBF24" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Δφ</text>

            {/* Orbiting Body */}
            <circle cx="255" cy="62" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />

            {/* Exercise Formula / Target Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: Δφ ∝ 1/(1 - e²) → Factor=?' : 'EXAMEN: Δφ ∝ 1/(1 - e²) → Factor=?'}
            </text>
            <text x="250" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              Factor = 1.50
            </text>
          </svg>
        </div>
      );

    case 'coupled_oscillators':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-indigo-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-coupled" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-coupled)" />

            {/* Walls & Ground */}
            <line x1="20" y1="125" x2="340" y2="125" stroke="#334155" strokeWidth="1.5" />
            <rect x="25" y="45" width="12" height="80" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
            <rect x="323" y="45" width="12" height="80" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

            {/* Spring 1 */}
            <path d="M 37,85 L 50,85 L 55,75 L 65,95 L 75,75 L 85,95 L 95,75 L 105,95 L 110,85 L 120,85" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
            {/* Mass 1 */}
            <rect x="120" y="65" width="38" height="40" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="139" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">m₁</text>

            {/* Coupling Spring 12 */}
            <path d="M 158,85 L 168,85 L 173,75 L 183,95 L 193,75 L 203,95 L 213,75 L 223,95 L 228,85 L 238,85" fill="none" stroke="#C084FC" strokeWidth="2" />

            {/* Mass 2 */}
            <rect x="238" y="65" width="38" height="40" rx="4" fill="#059669" stroke="#34D399" strokeWidth="1.5" />
            <text x="257" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">m₂</text>

            {/* Spring 2 */}
            <path d="M 276,85 L 285,85 L 290,75 L 298,95 L 305,75 L 312,95 L 318,85 L 323,85" fill="none" stroke="#34D399" strokeWidth="1.8" />

            {/* Normal mode vibration arrows */}
            <line x1="130" y1="52" x2="148" y2="52" stroke="#38BDF8" strokeWidth="2" />
            <polygon points="152,52 145,49 145,55" fill="#38BDF8" />
            <line x1="266" y1="52" x2="248" y2="52" stroke="#34D399" strokeWidth="2" />
            <polygon points="244,52 251,49 251,55" fill="#34D399" />
            <text x="198" y="55" textAnchor="middle" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? 'Anti-Phase Mode' : 'Modo Antifase'}</text>

            {/* Exercise Callout */}
            <rect x="8" y="8" width="215" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: k=18, k₁₂=10 → ω₂=?' : 'EXAMEN: k=18, k₁₂=10 → ω₂=?'}
            </text>
            <text x="260" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              ω₂ = 4.36 rad/s
            </text>
          </svg>
        </div>
      );

    case 'geostrophic_wind':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-teal-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-geo" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(13, 148, 136, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="160" fill="url(#grid-geo)" />

            {/* Isobars */}
            <line x1="20" y1="42" x2="340" y2="42" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />
            <text x="25" y="38" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">{isEn ? '1004 hPa (Low - L)' : '1004 hPa (Baja - L)'}</text>
            <line x1="20" y1="85" x2="340" y2="85" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="25" y="81" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">1012 hPa</text>
            <line x1="20" y1="128" x2="340" y2="128" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />
            <text x="25" y="124" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">{isEn ? '1020 hPa (High - H)' : '1020 hPa (Alta - H)'}</text>

            {/* Air parcel */}
            <circle cx="180" cy="85" r="10" fill="rgba(251, 191, 36, 0.3)" stroke="#FBBF24" strokeWidth="2" />
            
            {/* Pressure Gradient Force UP */}
            <line x1="180" y1="85" x2="180" y2="50" stroke="#EF4444" strokeWidth="2.2" />
            <polygon points="180,45 176,53 184,53" fill="#EF4444" />
            <text x="187" y="55" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">F⃗_P</text>

            {/* Coriolis Force DOWN */}
            <line x1="180" y1="85" x2="180" y2="120" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="180,125 176,117 184,117" fill="#38BDF8" />
            <text x="187" y="118" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">F⃗_Cor</text>

            {/* Geostrophic Wind Vector RIGHT */}
            <line x1="180" y1="85" x2="245" y2="85" stroke="#34D399" strokeWidth="2.5" />
            <polygon points="250,85 242,81 242,89" fill="#34D399" />
            <text x="215" y="78" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">v⃗_g</text>

            {/* Exercise Callout */}
            <rect x="8" y="8" width="220" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(13, 148, 136, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#2DD4BF" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: ΔP=16hPa, φ=45° → vg=?' : 'EXAMEN: ΔP=16hPa, φ=45° → vg=?'}
            </text>
            <text x="260" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              v_g = 129 m/s
            </text>
          </svg>
        </div>
      );

    case 'seismology_beachball':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-rose-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="bb-clip">
                <circle cx="85" cy="85" r="42" />
              </clipPath>
            </defs>
            <rect width="360" height="160" fill="#070D18" />

            {/* Stereographic Beachball on the Left */}
            <g clipPath="url(#bb-clip)">
              {/* White dilatational background */}
              <circle cx="85" cy="85" r="42" fill="#F8FAFC" />
              {/* Red compressional center for thrust/subduction */}
              <circle cx="85" cy="85" r="42" fill="#EF4444" />
              <ellipse cx="85" cy="55" rx="38" ry="24" fill="#F8FAFC" />
              <ellipse cx="85" cy="118" rx="34" ry="18" fill="#F8FAFC" />
            </g>
            <circle cx="85" cy="85" r="42" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <text x="85" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">P</text>
            <text x="85" y="142" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'Focal Mechanism' : 'Mecanismo Focal'}</text>

            {/* Expanding P and S Wavefronts on Right */}
            <circle cx="245" cy="85" r="5" fill="#EF4444" />
            <text x="245" y="74" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? 'Hypocenter' : 'Hipocentro'}</text>

            <circle cx="245" cy="85" r="32" fill="none" stroke="#FBBF24" strokeWidth="2" />
            <text x="282" y="80" fill="#FBBF24" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'S-Wave' : 'Onda S'}</text>

            <circle cx="245" cy="85" r="54" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="4,4" />
            <text x="303" y="72" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'P-Wave' : 'Onda P'}</text>

            {/* Exercise Callout */}
            <rect x="8" y="8" width="220" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#FB7185" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: Subduction Mw=8.8 → M₀=?' : 'EXAMEN: Subducción Mw=8.8 → M₀=?'}
            </text>
            <text x="245" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              M₀ = 2.0×10²² N·m
            </text>
          </svg>
        </div>
      );

    case 'bouguer_gravity':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-amber-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <rect width="360" height="160" fill="#070D18" />

            {/* Topography and Airy Root */}
            {/* Mantle */}
            <rect x="20" y="85" width="320" height="60" fill="#1E1B4B" />
            <text x="25" y="140" fill="#818CF8" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'Mantle (ρ_m=3300)' : 'Manto (ρ_m=3300)'}</text>

            {/* Crust with mountain and root */}
            <path d="M 20,85 L 120,85 Q 180,48 240,85 L 340,85 L 340,115 L 240,115 Q 180,140 120,115 L 20,115 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <text x="155" y="62" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Andes (+4000m)</text>
            <text x="155" y="125" fill="#F59E0B" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? 'Root b=17km' : 'Raíz b=17km'}</text>

            {/* Bouguer Anomaly Curve (Negative Trough) */}
            <path d="M 30,36 Q 180,48 330,36" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 30,36 Q 180,48 180,48" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2,2" />
            <path d="M 30,32 L 120,32 Q 180,46 240,32 L 330,32" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <text x="25" y="28" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">Δg_Bouguer (-300 mGal)</text>

            {/* Exercise Callout */}
            <rect x="180" y="8" width="170" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />
            <text x="188" y="23" fill="#FBBF24" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'Airy: b = 17.0 km' : 'Isostasia: b = 17.0 km'}
            </text>
          </svg>
        </div>
      );

    case 'ekman_spiral':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-cyan-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <rect width="360" height="160" fill="#070D18" />

            {/* Water Column Ellipses */}
            <ellipse cx="110" cy="55" rx="55" ry="14" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <ellipse cx="110" cy="80" rx="55" ry="14" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <ellipse cx="110" cy="105" rx="55" ry="14" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <ellipse cx="110" cy="130" rx="55" ry="14" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />

            {/* Wind Vector */}
            <line x1="110" y1="55" x2="110" y2="35" stroke="#34D399" strokeWidth="2.5" />
            <polygon points="110,30 106,38 114,38" fill="#34D399" />
            <text x="118" y="38" fill="#34D399" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? 'Wind' : 'Viento'}</text>

            {/* Current Spiral Vectors */}
            <line x1="110" y1="55" x2="75" y2="46" stroke="#0284C7" strokeWidth="2.5" />
            <line x1="110" y1="80" x2="85" y2="76" stroke="#38BDF8" strokeWidth="2" />
            <line x1="110" y1="105" x2="100" y2="108" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="35" y="55" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">45° V₀</text>

            {/* Net Transport Vector 90° */}
            <line x1="110" y1="90" x2="45" y2="90" stroke="#C084FC" strokeWidth="3" />
            <polygon points="40,90 48,86 48,94" fill="#C084FC" />
            <text x="40" y="104" fill="#C084FC" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? '90° Transport' : 'Transporte 90°'}</text>

            {/* Upwelling schematic on the Right */}
            <path d="M 240,45 L 330,45 L 330,145 L 290,145 Q 260,110 240,45 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <text x="270" y="70" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'Chile Coast' : 'Costa Chile'}</text>
            
            {/* Upwelling Arrow */}
            <path d="M 230,135 Q 240,95 210,65" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
            <polygon points="208,60 216,66 211,71" fill="#06B6D4" />
            <text x="175" y="125" fill="#06B6D4" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">{isEn ? 'Upwelling' : 'Surgencia'}</text>

            {/* Exercise Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: W=12m/s → M_E=?' : 'EXAMEN: W=12m/s → M_E=?'}
            </text>
            <text x="235" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              M_E = 2.80 m²/s
            </text>
          </svg>
        </div>
      );

    case 'magnetotellurics':
      return (
        <div className="relative w-full h-36 bg-[#070D18] rounded-xl overflow-hidden border border-purple-500/20 flex items-center justify-center">
          <svg viewBox="0 0 360 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <rect width="360" height="160" fill="#070D18" />

            {/* Subsurface Layers */}
            <rect x="25" y="45" width="200" height="42" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
            <text x="32" y="60" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'Layer 1: ρ₁=20 Ω·m' : 'Capa 1: ρ₁=20 Ω·m'}</text>
            <rect x="25" y="87" width="200" height="55" fill="#0F172A" stroke="#475569" strokeWidth="1.2" />
            <text x="32" y="105" fill="#C084FC" fontSize="9" fontFamily="JetBrains Mono">{isEn ? 'Basement: ρ₂=500 Ω·m' : 'Basamento: ρ₂=500 Ω·m'}</text>

            {/* Attenuating EM Wave */}
            <path d="M 125,45 Q 155,55 125,65 Q 105,75 125,85 Q 138,95 125,105 Q 118,115 125,125 Q 128,135 125,142" fill="none" stroke="#F59E0B" strokeWidth="2.2" />
            {/* Skin depth line */}
            <line x1="25" y1="80" x2="225" y2="80" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="135" y="78" fill="#EF4444" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">Skin Depth δ=1006m</text>

            {/* Apparent Resistivity Sounding Plot on Right */}
            <rect x="240" y="45" width="100" height="95" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <text x="245" y="58" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">ρ_a (Ω·m)</text>
            {/* S-curve transition */}
            <path d="M 250,118 C 275,118 285,75 330,75" fill="none" stroke="#10B981" strokeWidth="2.2" />
            <circle cx="285" cy="95" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />

            {/* Exercise Callout */}
            <rect x="8" y="8" width="205" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
            <text x="14" y="23" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {isEn ? 'EXAM: f=4Hz, ρ₁=16 → δ₁=?' : 'EXAMEN: f=4Hz, ρ₁=16 → δ₁=?'}
            </text>
            <text x="240" y="24" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              δ₁ = 1006 m
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
