import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1680, 960  # 2x of 840x480

font_bold = '/System/Library/Fonts/HelveticaNeue.ttc'
font_mono = '/System/Library/Fonts/Menlo.ttc'

f_title = ImageFont.truetype(font_bold, 36, index=1)
f_sub = ImageFont.truetype(font_bold, 24, index=0)
f_tag = ImageFont.truetype(font_bold, 22, index=1)
f_code = ImageFont.truetype(font_mono, 20, index=0)
f_code_bold = ImageFont.truetype(font_mono, 22, index=1)
f_math = ImageFont.truetype(font_mono, 26, index=1)
f_pill = ImageFont.truetype(font_bold, 20, index=1)

def draw_grid_background(draw, w, h):
    draw.rectangle([(0, 0), (w, h)], fill=(7, 13, 26))
    # Grid lines
    for x in range(0, w, 40):
        alpha = 35 if x % 200 == 0 else 15
        draw.line([(x, 0), (x, h)], fill=(56, 189, 248, alpha), width=1)
    for y in range(0, h, 40):
        alpha = 35 if y % 200 == 0 else 15
        draw.line([(0, y), (w, y)], fill=(56, 189, 248, alpha), width=1)

# =========================================================================
# OPCIÓN 1: BLUEPRINT & LISSAJOUS (Espacio de Configuración + Autovectores)
# =========================================================================
def render_option_1():
    img = Image.new('RGBA', (W, H), (7, 13, 26, 255))
    draw = ImageDraw.Draw(img)
    draw_grid_background(draw, W, H)

    # Header Bar
    draw.rounded_rectangle([(30, 25), (W - 30, 85)], radius=18, fill=(15, 23, 42, 230), outline=(56, 189, 248, 120), width=2)
    draw.text((50, 42), "EIGENMODE SOLVER: det(K - ω²M) = 0", font=f_title, fill=(56, 189, 248))
    draw.text((W - 550, 44), "COUPLED OSCILLATORS • 2-DOF PHASE SPACE", font=f_pill, fill=(148, 163, 184))

    # Left: 2D Configuration Plane (x1, x2) & Lissajous Orbit
    cx, cy = 460, 520
    radius_box = 360
    draw.rectangle([(cx - radius_box, cy - radius_box), (cx + radius_box, cy + radius_box)], fill=(10, 18, 36, 200), outline=(56, 189, 248, 80), width=2)
    
    # Grid in phase box
    draw.line([(cx - radius_box, cy), (cx + radius_box, cy)], fill=(148, 163, 184, 80), width=2)
    draw.line([(cx, cy - radius_box), (cx, cy + radius_box)], fill=(148, 163, 184, 80), width=2)
    draw.text((cx + radius_box - 40, cy + 10), "x₁", font=f_math, fill=(148, 163, 184))
    draw.text((cx + 10, cy - radius_box + 15), "x₂", font=f_math, fill=(148, 163, 184))

    # Eigenvector axes rotated 45 deg
    # Mode 1: v1 = [1, 1] (cyan)
    draw.line([(cx - 280, cy + 280), (cx + 280, cy - 280)], fill=(56, 189, 248, 200), width=3)
    draw.text((cx + 210, cy - 320), "v₁ = [1, 1]ᵀ (In-Phase)", font=f_tag, fill=(56, 189, 248))

    # Mode 2: v2 = [1, -1] (magenta)
    draw.line([(cx - 280, cy - 280), (cx + 280, cy + 280)], fill=(236, 72, 153, 200), width=3)
    draw.text((cx + 210, cy + 290), "v₂ = [1, -1]ᵀ (Anti-Phase)", font=f_tag, fill=(236, 72, 153))

    # Glowing Lissajous Trajectory: superposition of w1 and w2
    w1, w2 = 1.0, 1.4142
    pts = []
    for step in range(1200):
        t = step * 0.05
        # Lissajous curve in (x1, x2)
        x1 = 200 * math.cos(w1 * t) + 80 * math.cos(w2 * t)
        x2 = 200 * math.cos(w1 * t) - 80 * math.cos(w2 * t)
        pts.append((cx + x1, cy - x2))
    
    # Draw glowing curve
    for i in range(len(pts) - 1):
        ratio = i / len(pts)
        r = int(56 + (236 - 56) * ratio)
        g = int(189 + (72 - 189) * ratio)
        b = int(248 + (153 - 248) * ratio)
        draw.line([pts[i], pts[i+1]], fill=(r, g, b, 230), width=3)

    # Right side: Mechanical schematic + Python SciPy code card
    rx = 940
    # 1. Mechanical system box
    draw.rounded_rectangle([(rx, 110), (W - 40, 480)], radius=24, fill=(15, 23, 42, 220), outline=(56, 189, 248, 100), width=2)
    draw.text((rx + 30, 130), "MECHANICAL SYSTEM (2 MASSES & 3 SPRINGS)", font=f_tag, fill=(251, 191, 36))

    # Draw spring-mass schematic
    my = 280
    # Left wall
    draw.line([(rx + 50, my - 60), (rx + 50, my + 60)], fill=(148, 163, 184), width=6)
    # Right wall
    draw.line([(W - 90, my - 60), (W - 90, my + 60)], fill=(148, 163, 184), width=6)

    # Spring 1
    draw.line([(rx + 50, my), (rx + 190, my)], fill=(56, 189, 248), width=3)
    draw.text((rx + 110, my - 35), "k₁", font=f_code_bold, fill=(56, 189, 248))

    # Mass 1
    m1_box = [(rx + 190, my - 45), (rx + 290, my + 45)]
    draw.rounded_rectangle(m1_box, radius=12, fill=(14, 165, 233), outline=(224, 242, 254), width=2)
    draw.text((rx + 225, my - 15), "m₁", font=f_title, fill=(255, 255, 255))
    # Displacement arrow x1
    draw.line([(rx + 240, my + 65), (rx + 280, my + 65)], fill=(56, 189, 248), width=3)
    draw.text((rx + 250, my + 72), "x₁", font=f_code, fill=(56, 189, 248))

    # Coupling Spring k12
    draw.line([(rx + 290, my), (rx + 440, my)], fill=(245, 158, 11), width=4)
    draw.text((rx + 350, my - 35), "k₁₂", font=f_code_bold, fill=(245, 158, 11))

    # Mass 2
    m2_box = [(rx + 440, my - 45), (rx + 540, my + 45)]
    draw.rounded_rectangle(m2_box, radius=12, fill=(236, 72, 153), outline=(253, 231, 243), width=2)
    draw.text((rx + 475, my - 15), "m₂", font=f_title, fill=(255, 255, 255))
    # Displacement arrow x2
    draw.line([(rx + 490, my + 65), (rx + 530, my + 65)], fill=(236, 72, 153), width=3)
    draw.text((rx + 500, my + 72), "x₂", font=f_code, fill=(236, 72, 153))

    # Spring 3
    draw.line([(rx + 540, my), (W - 90, my)], fill=(56, 189, 248), width=3)
    draw.text((rx + 580, my - 35), "k₂", font=f_code_bold, fill=(56, 189, 248))

    draw.text((rx + 40, my + 130), "• Mode 1: Masses in sync  ->  ω₁ = √(k/m)", font=f_sub, fill=(56, 189, 248))
    draw.text((rx + 40, my + 165), "• Mode 2: Masses in opposition -> ω₂ = √((k + 2k₁₂)/m)", font=f_sub, fill=(236, 72, 153))

    # 2. Python & Linear Algebra Solver card
    draw.rounded_rectangle([(rx, 510), (W - 40, 920)], radius=24, fill=(10, 18, 38, 230), outline=(168, 85, 247, 120), width=2)
    draw.text((rx + 30, 530), "NUMERICAL SCIENTIFIC PYTHON SOLVER", font=f_tag, fill=(192, 132, 252))

    code_lines = [
        "import numpy as np, scipy.linalg",
        "",
        "# Stiffness and Mass Matrices",
        "K = np.array([[k + k12, -k12],",
        "              [-k12,     k + k12]])",
        "M = np.diag([m1, m2])",
        "",
        "# Solve Generalized Eigenvalue Problem",
        "eigenvalues, eigenvectors = scipy.linalg.eigh(K, M)",
        "frequencies = np.sqrt(eigenvalues)",
        "",
        "# General Superposition Solution",
        "x(t) = c1*v[:,0]*cos(w1*t) + c2*v[:,1]*cos(w2*t)"
    ]
    for idx, cl in enumerate(code_lines):
        color = (192, 132, 252) if "scipy" in cl or "eigh" in cl else (203, 213, 225)
        if cl.startswith("#"):
            color = (100, 116, 139)
        draw.text((rx + 30, 570 + idx * 25), cl, font=f_code, fill=color)

    return img.convert('RGB')

# =========================================================================
# OPCIÓN 2: DUAL MODE HARMONICS (Simétrico vs Antisimétrico)
# =========================================================================
def render_option_2():
    img = Image.new('RGBA', (W, H), (7, 13, 26, 255))
    draw = ImageDraw.Draw(img)
    draw_grid_background(draw, W, H)

    draw.rounded_rectangle([(30, 25), (W - 30, 85)], radius=18, fill=(15, 23, 42, 230), outline=(56, 189, 248, 120), width=2)
    draw.text((50, 42), "HARMONIC DECOUPLING: NORMAL MODES OF VIBRATION", font=f_title, fill=(56, 189, 248))
    draw.text((W - 510, 44), "EIGENFREQUENCIES & STANDING WAVES", font=f_pill, fill=(148, 163, 184))

    # Upper Half: MODE 1 (IN-PHASE / SYMMETRIC)
    m1_box = [(40, 110), (W - 40, 490)]
    draw.rounded_rectangle(m1_box, radius=24, fill=(10, 25, 48, 220), outline=(56, 189, 248, 140), width=2)
    
    draw.text((70, 135), "MODE 1: IN-PHASE (SYMMETRIC MODE)", font=f_title, fill=(56, 189, 248))
    draw.text((70, 180), "Autovector: v₁ = [ 1,  1 ]ᵀ  •  Frecuencia: ω₁ = √(k / m)  •  Resorte central k₁₂ sin deformación", font=f_sub, fill=(203, 213, 225))

    # Mechanical visualization Mode 1
    y1 = 280
    # Left & Right walls
    draw.line([(80, y1 - 40), (80, y1 + 40)], fill=(148, 163, 184), width=5)
    draw.line([(680, y1 - 40), (680, y1 + 40)], fill=(148, 163, 184), width=5)
    draw.line([(80, y1), (220, y1)], fill=(56, 189, 248), width=3)
    # Mass 1
    draw.rounded_rectangle([(220, y1 - 35), (320, y1 + 35)], radius=10, fill=(14, 165, 233), outline=(224, 242, 254), width=2)
    draw.text((255, y1 - 12), "m₁", font=f_title, fill=(255, 255, 255))
    # Vector arrows pointing right
    draw.line([(330, y1), (390, y1)], fill=(52, 211, 153), width=4)
    draw.polygon([(400, y1), (385, y1 - 7), (385, y1 + 7)], fill=(52, 211, 153))

    # Center spring
    draw.line([(320, y1), (460, y1)], fill=(100, 116, 139), width=3)
    # Mass 2
    draw.rounded_rectangle([(460, y1 - 35), (560, y1 + 35)], radius=10, fill=(14, 165, 233), outline=(224, 242, 254), width=2)
    draw.text((495, y1 - 12), "m₂", font=f_title, fill=(255, 255, 255))
    # Vector arrows pointing right
    draw.line([(570, y1), (630, y1)], fill=(52, 211, 153), width=4)
    draw.polygon([(640, y1), (625, y1 - 7), (625, y1 + 7)], fill=(52, 211, 153))
    draw.line([(560, y1), (680, y1)], fill=(56, 189, 248), width=3)

    # Right of Mode 1: Clean harmonic sine wave
    wave_x = 730
    draw.line([(wave_x, y1), (W - 80, y1)], fill=(148, 163, 184, 80), width=1)
    w_pts1 = []
    for step in range(800):
        t = step * 0.015
        x = wave_x + step
        y = y1 - 85 * math.sin(t * 2.5)
        w_pts1.append((x, y))
    draw.line(w_pts1, fill=(56, 189, 248), width=4)
    draw.text((W - 320, y1 + 50), "x₁(t) = x₂(t) = A·cos(ω₁t)", font=f_code_bold, fill=(56, 189, 248))

    # Lower Half: MODE 2 (ANTI-PHASE / ANTISYMMETRIC)
    m2_box = [(40, 520), (W - 40, 900)]
    draw.rounded_rectangle(m2_box, radius=24, fill=(35, 10, 35, 220), outline=(236, 72, 153, 140), width=2)

    draw.text((70, 545), "MODE 2: ANTI-PHASE (ANTISYMMETRIC MODE)", font=f_title, fill=(236, 72, 153))
    draw.text((70, 590), "Autovector: v₂ = [ 1, -1 ]ᵀ  •  Frecuencia: ω₂ = √((k + 2k₁₂) / m)  •  Máxima compresión/tensión central", font=f_sub, fill=(203, 213, 225))

    y2 = 690
    draw.line([(80, y2 - 40), (80, y2 + 40)], fill=(148, 163, 184), width=5)
    draw.line([(680, y2 - 40), (680, y2 + 40)], fill=(148, 163, 184), width=5)
    draw.line([(80, y2), (220, y2)], fill=(236, 72, 153), width=3)
    # Mass 1 moving RIGHT
    draw.rounded_rectangle([(220, y2 - 35), (320, y2 + 35)], radius=10, fill=(219, 39, 119), outline=(253, 231, 243), width=2)
    draw.text((255, y2 - 12), "m₁", font=f_title, fill=(255, 255, 255))
    draw.line([(330, y2), (370, y2)], fill=(245, 158, 11), width=4)
    draw.polygon([(380, y2), (365, y2 - 7), (365, y2 + 7)], fill=(245, 158, 11))

    # Strained central spring
    draw.line([(320, y2), (460, y2)], fill=(239, 68, 68), width=5)
    # Mass 2 moving LEFT
    draw.rounded_rectangle([(460, y2 - 35), (560, y2 + 35)], radius=10, fill=(219, 39, 119), outline=(253, 231, 243), width=2)
    draw.text((495, y2 - 12), "m₂", font=f_title, fill=(255, 255, 255))
    draw.line([(450, y2), (410, y2)], fill=(245, 158, 11), width=4)
    draw.polygon([(400, y2), (415, y2 - 7), (415, y2 + 7)], fill=(245, 158, 11))
    draw.line([(560, y2), (680, y2)], fill=(236, 72, 153), width=3)

    # Wave for Mode 2 (faster frequency)
    draw.line([(wave_x, y2), (W - 80, y2)], fill=(148, 163, 184, 80), width=1)
    w_pts2 = []
    for step in range(800):
        t = step * 0.015
        x = wave_x + step
        y = y2 - 85 * math.sin(t * 4.2)
        w_pts2.append((x, y))
    draw.line(w_pts2, fill=(236, 72, 153), width=4)
    draw.text((W - 350, y2 + 50), "x₁(t) = -x₂(t) = B·cos(ω₂t)", font=f_code_bold, fill=(236, 72, 153))

    # Bottom pill
    draw.text((70, 850), "Diagonalización: det(K - ω²M) = 0  ➔  Paso de coordenadas acopladas a coordenadas normales", font=f_math, fill=(251, 191, 36))

    return img.convert('RGB')

# =========================================================================
# OPCIÓN 3: SELLO CIRCULAR DE FRECUENCIAS (The Normal Mode Seal)
# =========================================================================
def render_option_3():
    img = Image.new('RGBA', (W, H), (7, 13, 26, 255))
    draw = ImageDraw.Draw(img)
    draw_grid_background(draw, W, H)

    cx, cy = W // 2, H // 2
    R = 400

    # Outer decorative ring
    draw.ellipse([(cx - R - 30, cy - R - 30), (cx + R + 30, cy + R + 30)], outline=(56, 189, 248, 80), width=2)
    draw.ellipse([(cx - R, cy - R), (cx + R, cy + R)], outline=(56, 189, 248, 220), width=4)
    draw.ellipse([(cx - R + 25, cy - R + 25), (cx + R - 25, cy + R - 25)], outline=(245, 158, 11, 150), width=2)

    # Dial graduation ticks around the ring
    for deg in range(0, 360, 5):
        rad = math.radians(deg)
        r1 = R - 15 if deg % 30 == 0 else R - 8
        r2 = R
        x1 = cx + r1 * math.cos(rad)
        y1 = cy + r1 * math.sin(rad)
        x2 = cx + r2 * math.cos(rad)
        y2 = cy + r2 * math.sin(rad)
        color = (251, 191, 36) if deg % 30 == 0 else (56, 189, 248, 160)
        draw.line([(x1, y1), (x2, y2)], fill=color, width=3 if deg % 30 == 0 else 1)

    # Crossed Eigenvector axes inside circle
    diag = R - 40
    # Axis 1: Mode 1 (Cyan)
    draw.line([(cx - diag * 0.707, cy + diag * 0.707), (cx + diag * 0.707, cy - diag * 0.707)], fill=(56, 189, 248, 200), width=3)
    # Axis 2: Mode 2 (Magenta)
    draw.line([(cx - diag * 0.707, cy - diag * 0.707), (cx + diag * 0.707, cy + diag * 0.707)], fill=(236, 72, 153, 200), width=3)

    # Intricate multi-harmonic rosette / phase torus
    pts = []
    for deg in range(0, 360 * 6, 2):
        rad = math.radians(deg)
        r_mod = 190 + 90 * math.sin(3 * rad) + 40 * math.cos(5 * rad)
        px = cx + r_mod * math.cos(rad)
        py = cy + r_mod * math.sin(rad)
        pts.append((px, py))
    for i in range(len(pts) - 1):
        ratio = i / len(pts)
        r = int(56 + (236 - 56) * ratio)
        g = int(189 + (72 - 189) * ratio)
        b = int(248 + (153 - 248) * ratio)
        draw.line([pts[i], pts[i+1]], fill=(r, g, b, 240), width=3)

    # Central Golden Phi Seal Core
    draw.ellipse([(cx - 70, cy - 70), (cx + 70, cy + 70)], fill=(15, 23, 42, 240), outline=(245, 158, 11), width=4)
    f_phi = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia.ttf', 72)
    draw.text((cx - 24, cy - 48), "Φ", font=f_phi, fill=(251, 191, 36))

    # Two orbital masses on the ring
    m_r = 30
    draw.ellipse([(cx - 260 - m_r, cy - m_r), (cx - 260 + m_r, cy + m_r)], fill=(14, 165, 233), outline=(255, 255, 255), width=3)
    draw.text((cx - 275, cy - 14), "m₁", font=f_tag, fill=(255, 255, 255))
    
    draw.ellipse([(cx + 260 - m_r, cy - m_r), (cx + 260 + m_r, cy + m_r)], fill=(236, 72, 153), outline=(255, 255, 255), width=3)
    draw.text((cx + 245, cy - 14), "m₂", font=f_tag, fill=(255, 255, 255))

    # Top & Bottom Banners
    draw.rounded_rectangle([(cx - 420, 40), (cx + 420, 100)], radius=22, fill=(15, 23, 42, 230), outline=(56, 189, 248, 150), width=2)
    draw.text((cx - 360, 56), "★ NORMAL MODES & EIGENVALUES SEAL ★", font=f_title, fill=(56, 189, 248))

    draw.rounded_rectangle([(cx - 480, H - 100), (cx + 480, H - 40)], radius=22, fill=(15, 23, 42, 230), outline=(245, 158, 11, 150), width=2)
    draw.text((cx - 440, H - 82), "PHYSICAL INTUITION • LINEAR ALGEBRA • SCIENTIFIC PYTHON", font=f_sub, fill=(251, 191, 36))

    return img.convert('RGB')

# =========================================================================
# OPCIÓN 4: WORKBENCH DEL LABORATORIO INTERACTIVO (Cómo trabajarían los chicos)
# =========================================================================
def render_option_4():
    img = Image.new('RGBA', (W, H), (7, 13, 26, 255))
    draw = ImageDraw.Draw(img)
    draw_grid_background(draw, W, H)

    # 1. Top Window Frame Header (IDE / Web Workbench Style)
    draw.rectangle([(20, 20), (W - 20, 80)], fill=(15, 23, 42), outline=(56, 189, 248, 80), width=2)
    # Mac Window Dots
    draw.ellipse([(45, 42), (61, 58)], fill=(239, 68, 68))
    draw.ellipse([(73, 42), (89, 58)], fill=(245, 158, 11))
    draw.ellipse([(101, 42), (117, 58)], fill=(16, 185, 129))

    draw.text((140, 38), "Interactive STEM Lab • Coupled Oscillators Simulation & Normal Mode Analyzer", font=f_pill, fill=(226, 232, 240))
    draw.rounded_rectangle([(W - 320, 32), (W - 40, 68)], radius=12, fill=(16, 185, 129), outline=(52, 211, 153), width=2)
    draw.text((W - 290, 40), "▶ LIVE SOLVER (dt=0.01s)", font=f_pill, fill=(3, 7, 18))

    # 2. Main 3D Simulation Viewport (Left side: x: 20 to 1020)
    vp_box = [(20, 80), (1020, 940)]
    draw.rectangle(vp_box, fill=(5, 10, 20, 240), outline=(56, 189, 248, 80), width=2)

    # 3D Viewport Title Pill
    draw.rounded_rectangle([(40, 100), (380, 145)], radius=12, fill=(15, 23, 42, 220), outline=(56, 189, 248, 100), width=2)
    draw.text((55, 112), "3D DYNAMICS & VECTOR FIELD", font=f_pill, fill=(56, 189, 248))

    # Perspective Grid in Viewport
    for x in range(60, 1000, 80):
        draw.line([(x, 500), (x - 80, 880)], fill=(56, 189, 248, 25), width=1)
    for y in range(540, 880, 45):
        draw.line([(60, y), (980, y)], fill=(56, 189, 248, 25), width=1)

    # The 2 Masses on frictionless track
    sim_y = 480
    # Left Wall
    draw.line([(100, sim_y - 90), (100, sim_y + 90)], fill=(148, 163, 184), width=8)
    # Right Wall
    draw.line([(940, sim_y - 90), (940, sim_y + 90)], fill=(148, 163, 184), width=8)

    # Spring 1 (Zig-zag)
    draw.line([(100, sim_y), (310, sim_y)], fill=(56, 189, 248), width=4)
    # Mass 1 (Glowing 3D sphere/box)
    draw.rounded_rectangle([(310, sim_y - 65), (450, sim_y + 65)], radius=18, fill=(14, 165, 233), outline=(224, 242, 254), width=3)
    draw.text((355, sim_y - 20), "m₁", font=f_title, fill=(255, 255, 255))
    # Vector arrows on mass 1: Force F_spring (green) and Velocity v (yellow)
    draw.line([(380, sim_y - 65), (380, sim_y - 125)], fill=(245, 158, 11), width=4)
    draw.polygon([(380, sim_y - 135), (372, sim_y - 120), (388, sim_y - 120)], fill=(245, 158, 11))
    draw.text((395, sim_y - 110), "v₁ = +1.42 m/s", font=f_code_bold, fill=(245, 158, 11))

    # Central Coupling Spring (Stretched)
    draw.line([(450, sim_y), (630, sim_y)], fill=(239, 68, 68), width=5)
    draw.text((510, sim_y - 35), "k₁₂ = 5 N/m", font=f_code_bold, fill=(239, 68, 68))

    # Mass 2
    draw.rounded_rectangle([(630, sim_y - 65), (770, sim_y + 65)], radius=18, fill=(236, 72, 153), outline=(253, 231, 243), width=3)
    draw.text((675, sim_y - 20), "m₂", font=f_title, fill=(255, 255, 255))
    # Vector arrow on mass 2: pointing downward / opposing
    draw.line([(700, sim_y + 65), (700, sim_y + 125)], fill=(245, 158, 11), width=4)
    draw.polygon([(700, sim_y + 135), (692, sim_y + 120), (708, sim_y + 120)], fill=(245, 158, 11))
    draw.text((715, sim_y + 90), "v₂ = -1.42 m/s", font=f_code_bold, fill=(245, 158, 11))

    # Spring 3
    draw.line([(770, sim_y), (940, sim_y)], fill=(56, 189, 248), width=4)

    # Real-time oscilloscope strip at bottom of 3D viewport
    draw.rectangle([(40, 680), (1000, 910)], fill=(10, 18, 38, 240), outline=(56, 189, 248, 120), width=2)
    draw.text((60, 695), "REAL-TIME OSCILLOSCOPE: x₁(t) [CYAN] vs x₂(t) [MAGENTA]", font=f_code_bold, fill=(56, 189, 248))
    
    # Waves in scope
    osc_pts1 = []
    osc_pts2 = []
    for step in range(920):
        t = step * 0.02
        x = 60 + step
        y1 = 800 - 55 * math.sin(t * 1.8)
        y2 = 800 - 55 * math.sin(t * 1.8 + math.pi)
        osc_pts1.append((x, y1))
        osc_pts2.append((x, y2))
    draw.line(osc_pts1, fill=(56, 189, 248), width=3)
    draw.line(osc_pts2, fill=(236, 72, 153), width=3)

    # 3. Right Control & Analysis Panels (x: 1040 to W-20)
    rx = 1040
    rw = (W - 20) - rx

    # 3A. Interactive Sliders Card (What the student tweaks in class!)
    draw.rectangle([(rx, 80), (W - 20, 480)], fill=(15, 23, 42, 240), outline=(56, 189, 248, 80), width=2)
    draw.text((rx + 25, 105), "STUDENT PARAMETER CONTROLS", font=f_tag, fill=(251, 191, 36))

    sliders = [
        ("Masa m₁ [kg]", "1.00", 0.45, (14, 165, 233)),
        ("Masa m₂ [kg]", "1.00", 0.45, (236, 72, 153)),
        ("Rigidez k₁ = k₂ [N/m]", "10.0", 0.60, (56, 189, 248)),
        ("Acoplamiento k₁₂ [N/m]", "4.50", 0.35, (239, 68, 68)),
    ]

    for idx, (label, val, pos, s_color) in enumerate(sliders):
        sy = 155 + idx * 62
        draw.text((rx + 25, sy), label, font=f_sub, fill=(203, 213, 225))
        draw.text((W - 130, sy), val, font=f_code_bold, fill=s_color)
        
        # Track line
        track_y = sy + 30
        draw.rounded_rectangle([(rx + 25, track_y), (W - 50, track_y + 8)], radius=4, fill=(30, 41, 59))
        draw.rounded_rectangle([(rx + 25, track_y), (rx + 25 + int((rw - 75) * pos), track_y + 8)], radius=4, fill=s_color)
        # Thumb handle
        th_x = rx + 25 + int((rw - 75) * pos)
        draw.ellipse([(th_x - 12, track_y - 8), (th_x + 12, track_y + 16)], fill=(255, 255, 255), outline=s_color, width=3)

    # Mode Selector Buttons
    btn_y = 415
    draw.rounded_rectangle([(rx + 25, btn_y), (rx + 25 + 260, btn_y + 45)], radius=10, fill=(14, 165, 233), outline=(56, 189, 248), width=2)
    draw.text((rx + 45, btn_y + 12), "✓ Mode 1: In-Phase", font=f_pill, fill=(255, 255, 255))

    draw.rounded_rectangle([(rx + 310, btn_y), (W - 50, btn_y + 45)], radius=10, fill=(30, 41, 59), outline=(100, 116, 139), width=2)
    draw.text((rx + 335, btn_y + 12), "Mode 2: Anti-Phase", font=f_pill, fill=(148, 163, 184))

    # 3B. Real-Time Math & Python Derivation Card
    draw.rectangle([(rx, 490), (W - 20, 940)], fill=(10, 18, 38, 240), outline=(168, 85, 247, 80), width=2)
    draw.text((rx + 25, 510), "FORMAL DERIVATION & PYTHON OUTPUT", font=f_tag, fill=(192, 132, 252))

    lines = [
        "1. Ecuaciones Diferenciales Acopladas (Cálculo):",
        "   m₁·ẍ₁ = -(k + k₁₂)·x₁ + k₁₂·x₂",
        "   m₂·ẍ₂ =   k₁₂·x₁ - (k + k₁₂)·x₂",
        "",
        "2. Formulación Matricial (Álgebra Lineal):",
        "   M·Ẍ + K·X = 0   ➔   det(K - ω²M) = 0",
        "",
        "3. Autovalores Resonantes Computados:",
        "   ω₁ = 3.16 rad/s (f₁ = 0.50 Hz) ➔ [ 1,  1 ]ᵀ",
        "   ω₂ = 4.36 rad/s (f₂ = 0.69 Hz) ➔ [ 1, -1 ]ᵀ",
        "",
        "4. Solución General en Python:",
        "   X(t) = c₁·v₁·cos(ω₁t + φ₁) + c₂·v₂·cos(ω₂t + φ₂)"
    ]

    for idx, l in enumerate(lines):
        color = (251, 191, 36) if l.startswith("   ω") else (203, 213, 225)
        if l.startswith("1.") or l.startswith("2.") or l.startswith("3.") or l.startswith("4."):
            color = (56, 189, 248)
        draw.text((rx + 25, 545 + idx * 30), l, font=f_code, fill=color)

    return img.convert('RGB')

# Render and save all 4 options
os.makedirs('/Users/danielsantander/.gemini/antigravity/brain/3688fd5b-824b-4d3a-889b-5962e2983355', exist_ok=True)
os.makedirs('public/emblems', exist_ok=True)

opt1 = render_option_1()
opt1.save('/Users/danielsantander/.gemini/antigravity/brain/3688fd5b-824b-4d3a-889b-5962e2983355/emblem_1_blueprint.jpg', 'JPEG', quality=95)
opt1.save('public/emblems/emblem_1_blueprint.jpg', 'JPEG', quality=95)

opt2 = render_option_2()
opt2.save('/Users/danielsantander/.gemini/antigravity/brain/3688fd5b-824b-4d3a-889b-5962e2983355/emblem_2_dual_mode.jpg', 'JPEG', quality=95)
opt2.save('public/emblems/emblem_2_dual_mode.jpg', 'JPEG', quality=95)

opt3 = render_option_3()
opt3.save('/Users/danielsantander/.gemini/antigravity/brain/3688fd5b-824b-4d3a-889b-5962e2983355/emblem_3_circular_seal.jpg', 'JPEG', quality=95)
opt3.save('public/emblems/emblem_3_circular_seal.jpg', 'JPEG', quality=95)

opt4 = render_option_4()
opt4.save('/Users/danielsantander/.gemini/antigravity/brain/3688fd5b-824b-4d3a-889b-5962e2983355/emblem_4_lab_workbench.jpg', 'JPEG', quality=95)
opt4.save('public/emblems/emblem_4_lab_workbench.jpg', 'JPEG', quality=95)

print("Generated all 4 emblem options successfully!")
