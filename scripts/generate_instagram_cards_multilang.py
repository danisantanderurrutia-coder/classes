import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

# 2160 x 2160 (Retina 2x resolution for Instagram 1080x1080)
W, H = 2160, 2160
SCALE = 2

# Helper: Wrap text cleanly
def wrap_text(text, max_w, font, draw_ctx):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        w = draw_ctx.textbbox((0, 0), test_line, font=font)[2] - draw_ctx.textbbox((0, 0), test_line, font=font)[0]
        if w <= max_w:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return '\n'.join(lines)

def draw_card_box(d, bbox, fill=(15, 23, 42, 215), border=(255, 255, 255, 45), radius=40, width=2):
    d.rounded_rectangle(bbox, radius=radius, fill=fill, outline=border, width=width)

def create_sun_spacetime_background(W, H):
    # Deep obsidian cosmic base
    base = Image.new('RGBA', (W, H), (6, 9, 18, 255))
    
    # 1. Distant Starfield with stellar magnitude distribution
    import random
    random.seed(42)  # Consistent aesthetic starfield
    d_stars = ImageDraw.Draw(base)
    for _ in range(400):
        sx = random.randint(0, W)
        sy = random.randint(0, H)
        s_size = random.choice([1, 1, 2, 2, 3, 4])
        s_brightness = random.randint(120, 255)
        color_choice = random.choice([
            (s_brightness, s_brightness, s_brightness),
            (int(s_brightness * 0.8), int(s_brightness * 0.9), s_brightness),
            (s_brightness, int(s_brightness * 0.9), int(s_brightness * 0.7))
        ])
        d_stars.ellipse([(sx, sy), (sx + s_size, sy + s_size)], fill=color_choice)

    # 2. 3D Perspective Spacetime Curvature Grid (Einstein Gravitational Funnel)
    grid_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_grid = ImageDraw.Draw(grid_img)

    focal = 1250.0
    cam_y = 680.0
    center_z = 1150.0

    def project(x, y, z):
        dist_z = z + 500.0
        if dist_z <= 50:
            return None
        scale = focal / dist_z
        sx = W / 2 + x * scale
        sy = H * 0.50 - (y - cam_y) * scale
        return (sx, sy)

    def get_funnel_y(x, z):
        dx = x
        dz = z - center_z
        r = math.sqrt(dx * dx + dz * dz)
        return -72000.0 / (r**0.84 + 130.0)

    # Longitudinal geodesic grid lines (cyan/laser)
    for x in range(-1800, 1801, 75):
        pts = []
        for z in range(250, 2550, 30):
            y = get_funnel_y(x, z)
            p = project(x, y, z)
            if p and -150 <= p[0] <= W + 150 and -150 <= p[1] <= H + 150:
                pts.append(p)
        if len(pts) > 1:
            dist_c = abs(x) / 1800.0
            alpha = int(max(25, min(190, (1.0 - dist_c * 0.65) * 175)))
            d_grid.line(pts, fill=(0, 240, 255, alpha), width=3)

    # Transverse geodesic grid lines
    for z in range(300, 2500, 70):
        pts = []
        for x in range(-1800, 1801, 30):
            y = get_funnel_y(x, z)
            p = project(x, y, z)
            if p and -150 <= p[0] <= W + 150 and -150 <= p[1] <= H + 150:
                pts.append(p)
        if len(pts) > 1:
            dist_z = abs(z - center_z) / 1300.0
            alpha = int(max(25, min(180, (1.0 - dist_z * 0.6) * 165)))
            d_grid.line(pts, fill=(0, 225, 255, alpha), width=3)

    # Concentric circular orbital rings around the gravitational funnel throat
    for r in [90, 160, 250, 360, 500, 680, 900, 1180, 1500]:
        pts = []
        for deg in range(0, 361, 4):
            rad = math.radians(deg)
            x = r * math.cos(rad)
            z = center_z + r * math.sin(rad)
            y = get_funnel_y(x, z)
            p = project(x, y, z)
            if p:
                pts.append(p)
        if len(pts) > 2:
            alpha = int(max(40, min(240, (1.0 - (r / 1600.0)) * 235)))
            d_grid.line(pts, fill=(0, 255, 220, alpha), width=4 if r < 600 else 3)

    # Composite Grid onto Base
    base = Image.alpha_composite(base, grid_img)

    # 3. The Brilliant Celestial Sun (Einstein Gravitational Source)
    sun_x = W // 2
    sun_y = 860

    # Solar Corona & Plasma Halos
    sun_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_sun = ImageDraw.Draw(sun_layer)

    # Massive deep crimson & orange outer atmosphere (R ~ 750px)
    d_sun.ellipse([(sun_x - 750, sun_y - 750), (sun_x + 750, sun_y + 750)], fill=(234, 88, 12, 45))
    # Radiant amber/gold mid corona (R ~ 460px)
    d_sun.ellipse([(sun_x - 460, sun_y - 460), (sun_x + 460, sun_y + 460)], fill=(245, 158, 11, 75))
    # Intense solar plasma ring (R ~ 280px)
    d_sun.ellipse([(sun_x - 280, sun_y - 280), (sun_x + 280, sun_y + 280)], fill=(251, 191, 36, 120))
    # Relativistic photon ring (lensed bright boundary)
    d_sun.ellipse([(sun_x - 190, sun_y - 190), (sun_x + 190, sun_y + 190)], fill=(255, 237, 160, 160))

    # Blur solar halos smoothly
    sun_layer = sun_layer.filter(ImageFilter.GaussianBlur(90))

    # Core Sun Disk (Intense thermonuclear fusion core)
    d_core = ImageDraw.Draw(sun_layer)
    d_core.ellipse([(sun_x - 145, sun_y - 145), (sun_x + 145, sun_y + 145)], fill=(255, 200, 50, 240))
    d_core.ellipse([(sun_x - 110, sun_y - 110), (sun_x + 110, sun_y + 110)], fill=(255, 245, 200, 255))
    d_core.ellipse([(sun_x - 70, sun_y - 70), (sun_x + 70, sun_y + 70)], fill=(255, 255, 255, 255))

    # Horizontal anamorphic lens flare beam through the Sun
    flare_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_flare = ImageDraw.Draw(flare_layer)
    d_flare.line([(sun_x - 900, sun_y), (sun_x + 900, sun_y)], fill=(255, 230, 150, 160), width=12)
    d_flare.line([(sun_x - 600, sun_y), (sun_x + 600, sun_y)], fill=(255, 255, 255, 220), width=6)
    flare_layer = flare_layer.filter(ImageFilter.GaussianBlur(14))

    # Composite Sun & Flares onto Base
    base = Image.alpha_composite(base, sun_layer)
    base = Image.alpha_composite(base, flare_layer)

    # 4. Vignette Overlay for maximum contrast
    vignette = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_vig = ImageDraw.Draw(vignette)
    for y in range(H):
        ratio = y / H
        alpha = int(140 + 65 * (math.cos(ratio * math.pi * 2 - math.pi) * 0.5 + 0.5))
        d_vig.line([(0, y), (W, y)], fill=(5, 8, 16, alpha))
    base = Image.alpha_composite(base, vignette)

    return base

def generate_card(lang='es', filename='public/instagram_post_preview.jpg'):
    # 1. Base Sun + Spacetime Curvature Grid Background
    base = create_sun_spacetime_background(W, H)

    draw = ImageDraw.Draw(base)

    # Fonts (scaled 2x for 2160x2160)
    font_bold = '/System/Library/Fonts/HelveticaNeue.ttc'
    font_mono = '/System/Library/Fonts/Menlo.ttc'
    font_serif = '/System/Library/Fonts/Supplemental/Georgia.ttf'

    f_badge = ImageFont.truetype(font_bold, 36, index=1)
    f_title_main = ImageFont.truetype(font_bold, 114, index=1)
    f_title_accent = ImageFont.truetype(font_bold, 114, index=1)
    f_tagline = ImageFont.truetype(font_bold, 42, index=0)

    f_name = ImageFont.truetype(font_bold, 50, index=1)
    f_creds_title = ImageFont.truetype(font_bold, 32, index=1)
    f_creds = ImageFont.truetype(font_bold, 28, index=0)
    f_loc = ImageFont.truetype(font_bold, 30, index=1)

    f_phi_badge = ImageFont.truetype(font_serif, 46)
    f_card_tag = ImageFont.truetype(font_bold, 28, index=1)
    f_card_title = ImageFont.truetype(font_bold, 40, index=1)
    f_card_desc = ImageFont.truetype(font_bold, 28, index=0)

    f_cta_bold = ImageFont.truetype(font_bold, 46, index=1)
    f_cta_sub = ImageFont.truetype(font_bold, 34, index=0)
    f_url = ImageFont.truetype(font_mono, 40, index=1)

    # Language strings (Strictly NO German)
    if lang == 'es':
        pill_text = "★  PREPARACIÓN PARA EXÁMENES UNIVERSITARIOS & IB  ★"
        title_part1 = "CLASES DE "
        title_part2 = "FÍSICA & MATEMÁTICAS"
        tagline = "Mentoría Individual 1-a-1  •  Online para todo el mundo"
        creds_title = "DOBLE M.SC. & GEOFÍSICO"
        uni_text = "Facultad de Ciencias Físicas y Matemáticas\nUniversidad de Chile • CAU Kiel (Alemania)"
        loc_text = "📍 Hannover, Alemania • Clases Online Internacionales"
        features = [
            {
                "tag": "MÉTODO PIAD™",
                "title": "De la Intuición a la Demostración",
                "desc": "Desde la visualización física y diagramas de cuerpo libre hasta el rigor matemático formal, sin memorización mecánica.",
                "border": (56, 189, 248, 120),
                "tag_color": (56, 189, 248)
            },
            {
                "tag": "14 SIMULADORES INTERACTIVOS",
                "title": "Laboratorio de Física en Tiempo Real",
                "desc": "Mecánica orbital, osciladores, óptica, termodinámica y pozos cuánticos con simulación interactiva paso a paso.",
                "border": (168, 85, 247, 120),
                "tag_color": (192, 132, 252)
            },
            {
                "tag": "ENTRENAMIENTO DE EXÁMENES",
                "title": "Resolución Formal & Puntaje Parcial",
                "desc": "Estrategias para redactar demostraciones paso a paso, evitar errores algebraicos y asegurar el máximo puntaje en cada problema.",
                "border": (245, 158, 11, 120),
                "tag_color": (251, 191, 36)
            }
        ]
        subjects_text = "Cálculo Diferencial & Integral  •  Álgebra Lineal  •  Mecánica Clásica  •  Electromagnetismo  •  Física Cuántica"
        cta_main = "AGENDAR SESIÓN DIAGNÓSTICA (20 MIN) ➔"
        cta_sub = "100% en Español o Inglés  •  Planes Intensivos  •  Claridad Conceptual Garantizada"
    else:
        pill_text = "★  UNIVERSITY EXAM PREPARATION & IB CANDIDATES  ★"
        title_part1 = "MATH & PHYSICS "
        title_part2 = "CLASSES"
        tagline = "Rigorous 1-on-1 Mentorship  •  Online Worldwide & In-Person"
        creds_title = "DOUBLE M.SC. & GEOPHYSICIST"
        uni_text = "Facultad de Ciencias Físicas y Matemáticas\nUniversidad de Chile • CAU Kiel (Germany)"
        loc_text = "📍 Hannover, Germany • Worldwide Online"
        features = [
            {
                "tag": "PIAD METHOD™",
                "title": "Physical Intuition to Proofs",
                "desc": "From deep visual intuition and Free Body Diagrams to airtight mathematical rigor without blind formula memorization.",
                "border": (56, 189, 248, 120),
                "tag_color": (56, 189, 248)
            },
            {
                "tag": "14 INTERACTIVE SIMULATORS",
                "title": "Real-Time 3D Physics Lab",
                "desc": "Hands-on orbital mechanics, harmonic oscillators, optics, thermodynamics, and quantum well wavefunctions in real time.",
                "border": (168, 85, 247, 120),
                "tag_color": (192, 132, 252)
            },
            {
                "tag": "EXAM SPRINT DRILLS",
                "title": "Scoring Partial Credit & Proofs",
                "desc": "Targeted drills to master multi-step problem solving, formal proof structures, and secure maximum partial credit on exam day.",
                "border": (245, 158, 11, 120),
                "tag_color": (251, 191, 36)
            }
        ]
        subjects_text = "Calculus  •  Linear Algebra  •  Classical Mechanics  •  Electromagnetism  •  Quantum Physics"
        cta_main = "BOOK FREE 20-MIN DIAGNOSTIC SESSION ➔"
        cta_sub = "Fluent English & Spanish  •  Targeted Study Sprints  •  Guaranteed Conceptual Clarity"

    # --- TOP SECTION ---
    # 1. Pill
    bbox_pill = draw.textbbox((0, 0), pill_text, font=f_badge)
    tw_pill = bbox_pill[2] - bbox_pill[0]
    pill_x = (W - tw_pill) // 2
    draw.rounded_rectangle([(pill_x - 45, 80), (pill_x + tw_pill + 45, 160)], radius=40, fill=(15, 23, 42, 235), outline=(56, 189, 248, 150), width=2)
    draw.text((pill_x, 98), pill_text, font=f_badge, fill=(56, 189, 248))

    # 2. Main Title
    bbox_t1 = draw.textbbox((0, 0), title_part1, font=f_title_main)
    bbox_t2 = draw.textbbox((0, 0), title_part2, font=f_title_accent)
    tot_title_w = (bbox_t1[2] - bbox_t1[0]) + (bbox_t2[2] - bbox_t2[0])
    title_x = (W - tot_title_w) // 2
    title_y = 200

    draw.text((title_x, title_y), title_part1, font=f_title_main, fill=(255, 255, 255))
    draw.text((title_x + (bbox_t1[2] - bbox_t1[0]), title_y), title_part2, font=f_title_accent, fill=(56, 189, 248))

    # 3. Subtitle / Tagline
    bbox_tag = draw.textbbox((0, 0), tagline, font=f_tagline)
    draw.text(((W - (bbox_tag[2] - bbox_tag[0])) // 2, 340), tagline, font=f_tagline, fill=(203, 213, 225))

    # Divider line
    draw.line([(140, 430), (W - 140, 430)], fill=(255, 255, 255, 35), width=2)

    # --- MIDDLE SECTION (y: 470 to 1340) ---
    prof_w = 780
    prof_box = [(130, 470), (130 + prof_w, 1340)]
    draw_card_box(draw, prof_box, fill=(15, 23, 42, 225), border=(56, 189, 248, 90), radius=48, width=2)

    # Circular photo
    prof_img_path = 'public/profile.jpg'
    if os.path.exists(prof_img_path):
        p_img = Image.open(prof_img_path).convert('RGBA')
        circ_size = 400
        p_img = ImageOps.fit(p_img, (circ_size, circ_size), method=Image.Resampling.LANCZOS)

        mask = Image.new('L', (circ_size, circ_size), 0)
        d_mask = ImageDraw.Draw(mask)
        d_mask.ellipse([(0, 0), (circ_size, circ_size)], fill=255)

        ring_x = 130 + (prof_w - circ_size) // 2
        ring_y = 510

        # Rings
        draw.ellipse([(ring_x - 10, ring_y - 10), (ring_x + circ_size + 10, ring_y + circ_size + 10)], outline=(56, 189, 248, 230), width=4)
        draw.ellipse([(ring_x - 18, ring_y - 18), (ring_x + circ_size + 18, ring_y + circ_size + 18)], outline=(245, 158, 11, 150), width=2)

        base.paste(p_img, (ring_x, ring_y), mask)

        # Golden Phi Badge
        phi_box = [(ring_x + circ_size - 75, ring_y + circ_size - 75), (ring_x + circ_size + 15, ring_y + circ_size + 15)]
        draw.ellipse(phi_box, fill=(245, 158, 11), outline=(15, 23, 42), width=3)
        draw.text((phi_box[0][0] + 25, phi_box[0][1] + 12), "Φ", font=f_phi_badge, fill=(15, 23, 42))

    # Tutor Name
    name_text = "Daniel S. Santander Urrutia"
    bbox_n = draw.textbbox((0, 0), name_text, font=f_name)
    name_x = 130 + (prof_w - (bbox_n[2] - bbox_n[0])) // 2
    draw.text((name_x, 950), name_text, font=f_name, fill=(255, 255, 255))

    # Credentials Title
    bbox_ct = draw.textbbox((0, 0), creds_title, font=f_creds_title)
    draw.text((130 + (prof_w - (bbox_ct[2] - bbox_ct[0])) // 2, 1025), creds_title, font=f_creds_title, fill=(251, 191, 36))

    # University
    bbox_u = draw.multiline_textbbox((0, 0), uni_text, font=f_creds, align='center')
    draw.multiline_text((130 + (prof_w - (bbox_u[2] - bbox_u[0])) // 2, 1085), uni_text, font=f_creds, fill=(148, 163, 184), align='center', spacing=6)

    # Location pill
    bbox_loc = draw.textbbox((0, 0), loc_text, font=f_loc)
    draw.text((130 + (prof_w - (bbox_loc[2] - bbox_loc[0])) // 2, 1250), loc_text, font=f_loc, fill=(52, 211, 153))

    # Right Column: 3 Feature Cards
    col_r_x = 950
    col_r_w = (W - 130) - col_r_x
    y_feat = 470
    h_feat = 265
    gap_feat = 30

    for i, feat in enumerate(features):
        top = y_feat + i * (h_feat + gap_feat)
        box = [(col_r_x, top), (W - 130, top + h_feat)]
        draw_card_box(draw, box, fill=(15, 23, 42, 225), border=feat["border"], radius=40, width=2)

        # Tag
        draw.text((col_r_x + 44, top + 26), feat["tag"], font=f_card_tag, fill=feat["tag_color"])

        # Title
        draw.text((col_r_x + 44, top + 70), feat["title"], font=f_card_title, fill=(255, 255, 255))

        # Description
        wrapped_desc = wrap_text(feat["desc"], col_r_w - 88, f_card_desc, draw)
        draw.multiline_text((col_r_x + 44, top + 130), wrapped_desc, font=f_card_desc, fill=(203, 213, 225), spacing=8)

    # --- BOTTOM CALL TO ACTION CAPSULE (y: 1390 to 2040) ---
    bottom_box = [(130, 1390), (W - 130, 2040)]
    draw_card_box(draw, bottom_box, fill=(10, 18, 38, 245), border=(56, 189, 248, 140), radius=56, width=2)

    # Subjects strip
    bbox_subjs = draw.textbbox((0, 0), subjects_text, font=f_tagline)
    draw.text(((W - (bbox_subjs[2] - bbox_subjs[0])) // 2, 1440), subjects_text, font=f_tagline, fill=(148, 163, 184))

    # Big CTA Button
    cta_box = [(300, 1530), (W - 300, 1690)]
    draw.rounded_rectangle(cta_box, radius=44, fill=(16, 185, 129), outline=(52, 211, 153), width=3)

    bbox_cta = draw.textbbox((0, 0), cta_main, font=f_cta_bold)
    draw.text(((W - (bbox_cta[2] - bbox_cta[0])) // 2, 1585), cta_main, font=f_cta_bold, fill=(3, 7, 18))

    # Sub-CTA
    bbox_bil = draw.textbbox((0, 0), cta_sub, font=f_cta_sub)
    draw.text(((W - (bbox_bil[2] - bbox_bil[0])) // 2, 1740), cta_sub, font=f_cta_sub, fill=(226, 232, 240))

    # Web URL Pill
    url_bg_w = 1240
    url_bg_x = (W - url_bg_w) // 2
    draw.rounded_rectangle([(url_bg_x, 1825), (url_bg_x + url_bg_w, 1915)], radius=28, fill=(15, 23, 42, 225), outline=(56, 189, 248, 100), width=2)

    url_text = "danisantanderurrutia-coder.github.io/classes"
    bbox_url = draw.textbbox((0, 0), url_text, font=f_url)
    draw.text(((W - (bbox_url[2] - bbox_url[0])) // 2, 1847), url_text, font=f_url, fill=(56, 189, 248))

    # Save 2160x2160 with highest quality 98 and no chroma downsampling (subsampling=0)
    out_rgb = base.convert('RGB')
    out_rgb.save(filename, 'JPEG', quality=98, subsampling=0)
    print(f"Generated {filename} (2160x2160, quality=98, subsampling=0) successfully!")

# Generate English version
generate_card(lang='en', filename='public/instagram_post_en.jpg')
# Generate Spanish version
generate_card(lang='es', filename='public/instagram_post_es.jpg')
# Default preview to Spanish
generate_card(lang='es', filename='public/instagram_post_preview.jpg')
