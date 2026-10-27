import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

# 2160 x 2160 (Retina 2x resolution for Instagram 1080x1080)
W, H = 2160, 2160

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

def draw_card_box(d, bbox, fill=(15, 23, 42, 225), border=(255, 255, 255, 45), radius=40, width=2):
    d.rounded_rectangle(bbox, radius=radius, fill=fill, outline=border, width=width)

def create_sun_spacetime_background(W, H):
    base = Image.new('RGBA', (W, H), (6, 9, 18, 255))
    
    # 1. Distant Starfield
    import random
    random.seed(42)
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

    # 2. 3D Perspective Spacetime Curvature Grid (Einstein Funnel)
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

    base = Image.alpha_composite(base, grid_img)

    # 3. Celestial Sun
    sun_x = W // 2
    sun_y = 860

    sun_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_sun = ImageDraw.Draw(sun_layer)

    d_sun.ellipse([(sun_x - 750, sun_y - 750), (sun_x + 750, sun_y + 750)], fill=(234, 88, 12, 45))
    d_sun.ellipse([(sun_x - 460, sun_y - 460), (sun_x + 460, sun_y + 460)], fill=(245, 158, 11, 75))
    d_sun.ellipse([(sun_x - 280, sun_y - 280), (sun_x + 280, sun_y + 280)], fill=(251, 191, 36, 120))
    d_sun.ellipse([(sun_x - 190, sun_y - 190), (sun_x + 190, sun_y + 190)], fill=(255, 237, 160, 160))

    sun_layer = sun_layer.filter(ImageFilter.GaussianBlur(90))

    d_core = ImageDraw.Draw(sun_layer)
    d_core.ellipse([(sun_x - 145, sun_y - 145), (sun_x + 145, sun_y + 145)], fill=(255, 200, 50, 240))
    d_core.ellipse([(sun_x - 110, sun_y - 110), (sun_x + 110, sun_y + 110)], fill=(255, 245, 200, 255))
    d_core.ellipse([(sun_x - 70, sun_y - 70), (sun_x + 70, sun_y + 70)], fill=(255, 255, 255, 255))

    flare_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_flare = ImageDraw.Draw(flare_layer)
    d_flare.line([(sun_x - 900, sun_y), (sun_x + 900, sun_y)], fill=(255, 230, 150, 160), width=12)
    d_flare.line([(sun_x - 600, sun_y), (sun_x + 600, sun_y)], fill=(255, 255, 255, 220), width=6)
    flare_layer = flare_layer.filter(ImageFilter.GaussianBlur(14))

    base = Image.alpha_composite(base, sun_layer)
    base = Image.alpha_composite(base, flare_layer)

    vignette = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_vig = ImageDraw.Draw(vignette)
    for y in range(H):
        ratio = y / H
        alpha = int(140 + 65 * (math.cos(ratio * math.pi * 2 - math.pi) * 0.5 + 0.5))
        d_vig.line([(0, y), (W, y)], fill=(5, 8, 16, alpha))
    base = Image.alpha_composite(base, vignette)

    return base

def generate_card(lang='en', filename='public/instagram_post_en.jpg'):
    base = create_sun_spacetime_background(W, H)
    draw = ImageDraw.Draw(base)

    font_bold = '/System/Library/Fonts/HelveticaNeue.ttc'
    font_mono = '/System/Library/Fonts/Menlo.ttc'
    font_serif = '/System/Library/Fonts/Supplemental/Georgia.ttf'

    f_badge = ImageFont.truetype(font_bold, 36, index=1)
    f_title_main = ImageFont.truetype(font_bold, 114, index=1)
    f_title_accent = ImageFont.truetype(font_bold, 114, index=1)
    f_tagline = ImageFont.truetype(font_bold, 42, index=0)

    f_name = ImageFont.truetype(font_bold, 44, index=1)
    f_creds_title = ImageFont.truetype(font_bold, 28, index=1)
    f_creds = ImageFont.truetype(font_bold, 24, index=0)
    f_loc = ImageFont.truetype(font_bold, 26, index=1)

    f_phi_badge = ImageFont.truetype(font_serif, 32)
    f_card_tag = ImageFont.truetype(font_bold, 28, index=1)
    f_card_title = ImageFont.truetype(font_bold, 38, index=1)
    f_card_desc = ImageFont.truetype(font_bold, 26, index=0)

    f_cta_bold = ImageFont.truetype(font_bold, 48, index=1)
    f_cta_sub = ImageFont.truetype(font_bold, 32, index=0)
    f_url = ImageFont.truetype(font_mono, 38, index=1)

    if lang == 'es':
        pill_text = "★  PREPARACIÓN PARA EXÁMENES UNIVERSITARIOS & IB  ★"
        title_part1 = "CLASES DE "
        title_part2 = "FÍSICA & MATEMÁTICAS"
        tagline = "Mentoría Individual 1-a-1  •  100% Online para todo el mundo"
        creds_title = "DOBLE M.SC. & GEOFÍSICO"
        uni_text = "FCFM Universidad de Chile, CAU Kiel Germany, AMU Poznan Poland"
        loc_text = "📍 Online Worldwide"
        
        # Left card text directly beneath the DCL simulation
        left_sim_card = {
            "tag": "SIMULADORES INTERACTIVOS",
            "title": "Laboratorio en Tiempo Real",
            "desc": "Diagramas de Cuerpo Libre (DCL), mecánica orbital, osciladores y óptica con simulación interactiva paso a paso."
        }
        
        # 3 Right column features
        features = [
            {
                "tag": "MÉTODO PIAD™",
                "title": "De la Intuición a la Demostración",
                "desc": "Desde la visualización física y diagramas de cuerpo libre hasta el rigor matemático formal, sin memorización mecánica.",
                "border": (56, 189, 248, 140),
                "tag_color": (56, 189, 248)
            },
            {
                "tag": "RESÚMENES DE ALTO IMPACTO",
                "title": "Apuntes Clave & Enfoque de Examen",
                "desc": "Acceso a resúmenes increíbles y apuntes de alto impacto, enfocados exactamente en los contenidos y necesidades reales de tu curso.",
                "border": (245, 158, 11, 140),
                "tag_color": (251, 191, 36)
            },
            {
                "tag": "RESOLUCIÓN DE CERTÁMENES",
                "title": "Pautas Reales & Apuntes Vectoriales",
                "desc": "Entrenamiento directo en problemas de certámenes universitarios con pizarra interactiva Miro y entrega de apuntes PDF vectoriales.",
                "border": (168, 85, 247, 140),
                "tag_color": (192, 132, 252)
            }
        ]
        subjects_text = "Cálculo Diferencial & Integral  •  Álgebra Lineal  •  Física  •  Mecánica Clásica  •  Electromagnetismo"
        cta_main = "SESIÓN DIAGNÓSTICA GRATUITA (15 MIN) ➔"
        cta_sub = "100% en Español o Inglés  •  WhatsApp: +49 176 7649 7440  •  DM por interno"
    else:
        pill_text = "★  UNIVERSITY EXAM PREPARATION & IB CANDIDATES  ★"
        title_part1 = "MATH & PHYSICS "
        title_part2 = "CLASSES"
        tagline = "Rigorous 1-on-1 Mentorship  •  100% Online Worldwide"
        creds_title = "DOUBLE M.SC. & GEOPHYSICIST"
        uni_text = "FCFM Universidad de Chile, CAU Kiel Germany, AMU Poznan Poland"
        loc_text = "📍 Online Worldwide"

        # Left card text directly beneath the DCL simulation
        left_sim_card = {
            "tag": "INTERACTIVE SIMULATORS",
            "title": "Real-Time 3D Physics Lab",
            "desc": "Hands-on Free Body Diagrams (DCL), orbital mechanics, harmonic oscillators, optics, and wave dynamics in real time."
        }

        # 3 Right column features
        features = [
            {
                "tag": "PIAD METHOD™",
                "title": "Physical Intuition to Proofs",
                "desc": "From deep visual intuition and Free Body Diagrams to airtight mathematical rigor without blind formula memorization.",
                "border": (56, 189, 248, 140),
                "tag_color": (56, 189, 248)
            },
            {
                "tag": "TARGETED COURSE SUMMARIES",
                "title": "Tailored Notes & Exam Focus",
                "desc": "Access amazing, high-yield summary notes specifically targeted to your course syllabus, past exams, and real grading requirements.",
                "border": (245, 158, 11, 140),
                "tag_color": (251, 191, 36)
            },
            {
                "tag": "EXAM-FOCUSED PROBLEM SOLVING",
                "title": "Past Papers & Vector PDF Notes",
                "desc": "Step-by-step solutions to university exam problems on collaborative Miro whiteboards, with full vector PDF notes delivered after class.",
                "border": (168, 85, 247, 140),
                "tag_color": (192, 132, 252)
            }
        ]
        subjects_text = "Calculus  •  Linear Algebra  •  Physics  •  Classical Mechanics  •  Electromagnetism"
        cta_main = "FREE 15-MIN DIAGNOSTIC SESSION ➔"
        cta_sub = "Fluent English & Spanish  •  Direct WhatsApp: +49 176 7649 7440  •  DM for Inquiries"

    # --- TOP HEADER ---
    bbox_pill = draw.textbbox((0, 0), pill_text, font=f_badge)
    tw_pill = bbox_pill[2] - bbox_pill[0]
    pill_x = (W - tw_pill) // 2
    draw.rounded_rectangle([(pill_x - 45, 75), (pill_x + tw_pill + 45, 150)], radius=38, fill=(15, 23, 42, 235), outline=(56, 189, 248, 150), width=2)
    draw.text((pill_x, 93), pill_text, font=f_badge, fill=(56, 189, 248))

    bbox_t1 = draw.textbbox((0, 0), title_part1, font=f_title_main)
    bbox_t2 = draw.textbbox((0, 0), title_part2, font=f_title_accent)
    tot_title_w = (bbox_t1[2] - bbox_t1[0]) + (bbox_t2[2] - bbox_t2[0])
    title_x = (W - tot_title_w) // 2
    title_y = 185

    draw.text((title_x, title_y), title_part1, font=f_title_main, fill=(255, 255, 255))
    draw.text((title_x + (bbox_t1[2] - bbox_t1[0]), title_y), title_part2, font=f_title_accent, fill=(56, 189, 248))

    bbox_tag = draw.textbbox((0, 0), tagline, font=f_tagline)
    draw.text(((W - (bbox_tag[2] - bbox_tag[0])) // 2, 320), tagline, font=f_tagline, fill=(203, 213, 225))

    draw.line([(130, 395), (W - 130, 395)], fill=(255, 255, 255, 40), width=2)

    # --- MIDDLE SECTION (y: 430 to 1420) ---
    col_l_x = 130
    col_l_w = 880
    
    # 1. Left Card: Featured Interactive Simulators Showcase (Image + Explanatory Card)
    box_sim = [(col_l_x, 430), (col_l_x + col_l_w, 1070)]
    draw_card_box(draw, box_sim, fill=(10, 18, 38, 235), border=(56, 189, 248, 140), radius=44, width=2)

    # Embed DCL Incline with Spring illustration
    lab_img_path = 'public/emblems/dcl_incline_spring.jpg'
    if not os.path.exists(lab_img_path):
        import generate_dcl_incline_spring
        generate_dcl_incline_spring.generate_dcl_incline_spring(lab_img_path)

    if os.path.exists(lab_img_path):
        l_img = Image.open(lab_img_path).convert('RGBA')
        l_w, l_h = col_l_w - 40, 390
        l_img = ImageOps.fit(l_img, (l_w, l_h), method=Image.Resampling.LANCZOS)
        
        # Rounded mask for image
        l_mask = Image.new('L', (l_w, l_h), 0)
        d_lmask = ImageDraw.Draw(l_mask)
        d_lmask.rounded_rectangle([(0, 0), (l_w, l_h)], radius=28, fill=255)
        
        base.paste(l_img, (col_l_x + 20, 450), l_mask)
        draw.rounded_rectangle([(col_l_x + 20, 450), (col_l_x + 20 + l_w, 450 + l_h)], radius=28, outline=(56, 189, 248, 120), width=2)

    # Interactive Simulators Card content directly beneath the DCL image:
    draw.text((col_l_x + 35, 860), left_sim_card["tag"], font=f_card_tag, fill=(56, 189, 248))
    draw.text((col_l_x + 35, 902), left_sim_card["title"], font=f_card_title, fill=(255, 255, 255))
    wrapped_sim_desc = wrap_text(left_sim_card["desc"], col_l_w - 70, f_card_desc, draw)
    draw.multiline_text((col_l_x + 35, 955), wrapped_sim_desc, font=f_card_desc, fill=(203, 213, 225), spacing=6)

    # 2. Compact Tutor Profile Card (Small on border/corner)
    box_prof = [(col_l_x, 1100), (col_l_x + col_l_w, 1420)]
    draw_card_box(draw, box_prof, fill=(15, 23, 42, 235), border=(56, 189, 248, 90), radius=44, width=2)

    prof_img_path = 'public/profile.jpg'
    if os.path.exists(prof_img_path):
        p_img = Image.open(prof_img_path).convert('RGBA')
        circ_size = 190
        p_img = ImageOps.fit(p_img, (circ_size, circ_size), method=Image.Resampling.LANCZOS)

        mask = Image.new('L', (circ_size, circ_size), 0)
        d_mask = ImageDraw.Draw(mask)
        d_mask.ellipse([(0, 0), (circ_size, circ_size)], fill=255)

        ring_x = col_l_x + 35
        ring_y = 1135

        draw.ellipse([(ring_x - 6, ring_y - 6), (ring_x + circ_size + 6, ring_y + circ_size + 6)], outline=(56, 189, 248, 220), width=3)
        draw.ellipse([(ring_x - 12, ring_y - 12), (ring_x + circ_size + 12, ring_y + circ_size + 12)], outline=(245, 158, 11, 150), width=2)

        base.paste(p_img, (ring_x, ring_y), mask)

        phi_box = [(ring_x + circ_size - 45, ring_y + circ_size - 45), (ring_x + circ_size + 10, ring_y + circ_size + 10)]
        draw.ellipse(phi_box, fill=(245, 158, 11), outline=(15, 23, 42), width=2)
        draw.text((phi_box[0][0] + 16, phi_box[0][1] + 9), "Φ", font=f_phi_badge, fill=(15, 23, 42))

        # Profile text beside the avatar
        info_x = ring_x + circ_size + 35
        draw.text((info_x, 1140), "Daniel S. Santander Urrutia", font=f_name, fill=(255, 255, 255))
        draw.text((info_x, 1200), creds_title, font=f_creds_title, fill=(251, 191, 36))
        
        # Universities line
        wrapped_uni = wrap_text(uni_text, col_l_w - (info_x - col_l_x) - 25, f_creds, draw)
        draw.multiline_text((info_x, 1245), wrapped_uni, font=f_creds, fill=(148, 163, 184), spacing=4)
        
        # Location line
        draw.text((info_x, 1345), loc_text, font=f_loc, fill=(52, 211, 153))

    # --- Right Column: 3 Feature Cards (x: 1050 to W-130) ---
    col_r_x = 1050
    col_r_w = (W - 130) - col_r_x
    y_feat = 430
    h_feat = 310
    gap_feat = 25

    for i, feat in enumerate(features):
        top = y_feat + i * (h_feat + gap_feat)
        box = [(col_r_x, top), (W - 130, top + h_feat)]
        draw_card_box(draw, box, fill=(15, 23, 42, 225), border=feat["border"], radius=40, width=2)

        draw.text((col_r_x + 45, top + 30), feat["tag"], font=f_card_tag, fill=feat["tag_color"])
        draw.text((col_r_x + 45, top + 78), feat["title"], font=f_card_title, fill=(255, 255, 255))

        wrapped_desc = wrap_text(feat["desc"], col_r_w - 90, f_card_desc, draw)
        draw.multiline_text((col_r_x + 45, top + 144), wrapped_desc, font=f_card_desc, fill=(203, 213, 225), spacing=8)

    # --- BOTTOM SECTION (y: 1470 to 2070) ---
    bottom_box = [(130, 1470), (W - 130, 2060)]
    draw_card_box(draw, bottom_box, fill=(10, 18, 38, 245), border=(56, 189, 248, 140), radius=54, width=2)

    bbox_subjs = draw.textbbox((0, 0), subjects_text, font=f_tagline)
    draw.text(((W - (bbox_subjs[2] - bbox_subjs[0])) // 2, 1520), subjects_text, font=f_tagline, fill=(148, 163, 184))

    # Big CTA Button (NO 'Book', 15 mins)
    cta_box = [(280, 1600), (W - 280, 1750)]
    draw.rounded_rectangle(cta_box, radius=42, fill=(16, 185, 129), outline=(52, 211, 153), width=3)

    bbox_cta = draw.textbbox((0, 0), cta_main, font=f_cta_bold)
    draw.text(((W - (bbox_cta[2] - bbox_cta[0])) // 2, 1650), cta_main, font=f_cta_bold, fill=(3, 7, 18))

    # Sub-CTA
    bbox_sub = draw.textbbox((0, 0), cta_sub, font=f_cta_sub)
    draw.text(((W - (bbox_sub[2] - bbox_sub[0])) // 2, 1795), cta_sub, font=f_cta_sub, fill=(226, 232, 240))

    # Web URL Pill
    url_bg_w = 1200
    url_bg_x = (W - url_bg_w) // 2
    draw.rounded_rectangle([(url_bg_x, 1870), (url_bg_x + url_bg_w, 1960)], radius=28, fill=(15, 23, 42, 225), outline=(56, 189, 248, 100), width=2)

    url_text = "danisantanderurrutia-coder.github.io/classes"
    bbox_url = draw.textbbox((0, 0), url_text, font=f_url)
    draw.text(((W - (bbox_url[2] - bbox_url[0])) // 2, 1893), url_text, font=f_url, fill=(56, 189, 248))

    out_rgb = base.convert('RGB')
    out_rgb.save(filename, 'JPEG', quality=98, subsampling=0)
    print(f"Generated {filename} (2160x2160) successfully!")

# Generate English version
generate_card(lang='en', filename='public/instagram_post_en.jpg')
# Generate Spanish version
generate_card(lang='es', filename='public/instagram_post_es.jpg')
