import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

W, H = 1080, 1080

# 1. Background Universe
bg_path = 'public/images/hero-universe.jpg'
if os.path.exists(bg_path):
    bg = Image.open(bg_path).convert('RGBA')
    bg = ImageOps.fit(bg, (W, H), method=Image.Resampling.LANCZOS)
else:
    bg = Image.new('RGBA', (W, H), (10, 15, 30, 255))

# Dark gradient overlay for rich contrast and readability
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw_ov = ImageDraw.Draw(overlay)
for y in range(H):
    ratio = y / H
    alpha = int(200 + 40 * math.sin(ratio * math.pi * 0.8))
    draw_ov.line([(0, y), (W, y)], fill=(8, 14, 30, alpha))

base = Image.alpha_composite(bg, overlay)

# Atmospheric glow blobs
glows = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d_glow = ImageDraw.Draw(glows)
d_glow.ellipse([(-80, -80), (450, 450)], fill=(14, 165, 233, 45))
d_glow.ellipse([(W-450, H-450), (W+100, H+100)], fill=(245, 158, 11, 35))
d_glow.ellipse([(W//2 - 250, 300), (W//2 + 250, 750)], fill=(99, 102, 241, 30))
glows = glows.filter(ImageFilter.GaussianBlur(90))
base = Image.alpha_composite(base, glows)

draw = ImageDraw.Draw(base)

# Fonts
font_bold = '/System/Library/Fonts/HelveticaNeue.ttc'
font_mono = '/System/Library/Fonts/Menlo.ttc'
font_serif = '/System/Library/Fonts/Supplemental/Georgia.ttf'

f_badge = ImageFont.truetype(font_bold, 18, index=1)
f_title_main = ImageFont.truetype(font_bold, 58, index=1)
f_title_accent = ImageFont.truetype(font_bold, 58, index=1)
f_tagline = ImageFont.truetype(font_bold, 21, index=0)

f_name = ImageFont.truetype(font_bold, 26, index=1)
f_creds_title = ImageFont.truetype(font_bold, 16, index=1)
f_creds = ImageFont.truetype(font_bold, 14, index=0)

f_phi_badge = ImageFont.truetype(font_serif, 24)
f_card_tag = ImageFont.truetype(font_bold, 15, index=1)
f_card_title = ImageFont.truetype(font_bold, 20, index=1)
f_card_desc = ImageFont.truetype(font_bold, 14, index=0)

f_cta_bold = ImageFont.truetype(font_bold, 24, index=1)
f_cta_sub = ImageFont.truetype(font_bold, 17, index=0)
f_url = ImageFont.truetype(font_mono, 21, index=1)

def draw_card_box(d, bbox, fill=(15, 23, 42, 210), border=(255, 255, 255, 45), radius=20):
    d.rounded_rectangle(bbox, radius=radius, fill=fill, outline=border, width=1)

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

# --- TOP SECTION ---
# 1. Category Pill
pill_text = "★  UNIVERSITY EXAM PREPARATION & PRE-U STEM  ★"
bbox_pill = draw.textbbox((0, 0), pill_text, font=f_badge)
tw_pill = bbox_pill[2] - bbox_pill[0]
pill_x = (W - tw_pill) // 2
draw.rounded_rectangle([(pill_x - 24, 42), (pill_x + tw_pill + 24, 82)], radius=20, fill=(15, 23, 42, 230), outline=(56, 189, 248, 140), width=1)
draw.text((pill_x, 52), pill_text, font=f_badge, fill=(56, 189, 248))

# 2. Main Title
title_math = "MATH & PHYSICS "
title_classes = "CLASSES"
bbox_tm = draw.textbbox((0, 0), title_math, font=f_title_main)
bbox_tc = draw.textbbox((0, 0), title_classes, font=f_title_accent)
total_w = (bbox_tm[2] - bbox_tm[0]) + (bbox_tc[2] - bbox_tc[0])
title_x = (W - total_w) // 2
title_y = 102

draw.text((title_x, title_y), title_math, font=f_title_main, fill=(255, 255, 255))
draw.text((title_x + (bbox_tm[2] - bbox_tm[0]), title_y), title_classes, font=f_title_accent, fill=(56, 189, 248))

# 3. Subtitle
tagline = "Rigorous 1-on-1 Mentorship  •  Online Worldwide & In-Person Hannover"
bbox_tag = draw.textbbox((0, 0), tagline, font=f_tagline)
draw.text(((W - (bbox_tag[2] - bbox_tag[0])) // 2, 172), tagline, font=f_tagline, fill=(203, 213, 225))

# Divider
draw.line([(70, 218), (W - 70, 218)], fill=(255, 255, 255, 30), width=1)

# --- MIDDLE SECTION (y: 238 to 675) ---
# Left: Tutor Profile Card
prof_w = 385
prof_box = [(65, 238), (65 + prof_w, 675)]
draw_card_box(draw, prof_box, fill=(15, 23, 42, 220), border=(56, 189, 248, 80), radius=24)

# Circle portrait
prof_img_path = 'public/profile.jpg'
if os.path.exists(prof_img_path):
    p_img = Image.open(prof_img_path).convert('RGBA')
    circ_size = 200
    p_img = ImageOps.fit(p_img, (circ_size, circ_size), method=Image.Resampling.LANCZOS)
    
    mask = Image.new('L', (circ_size, circ_size), 0)
    d_mask = ImageDraw.Draw(mask)
    d_mask.ellipse([(0, 0), (circ_size, circ_size)], fill=255)
    
    ring_x = 65 + (prof_w - circ_size) // 2
    ring_y = 258
    
    # Outer glow rings
    draw.ellipse([(ring_x - 5, ring_y - 5), (ring_x + circ_size + 5, ring_y + circ_size + 5)], outline=(56, 189, 248, 220), width=2)
    draw.ellipse([(ring_x - 9, ring_y - 9), (ring_x + circ_size + 9, ring_y + circ_size + 9)], outline=(245, 158, 11, 140), width=1)
    
    base.paste(p_img, (ring_x, ring_y), mask)
    
    # Golden Phi badge overlay on photo
    phi_box = [(ring_x + circ_size - 38, ring_y + circ_size - 38), (ring_x + circ_size + 6, ring_y + circ_size + 6)]
    draw.ellipse(phi_box, fill=(245, 158, 11), outline=(15, 23, 42), width=2)
    draw.text((phi_box[0][0] + 13, phi_box[0][1] + 6), "Φ", font=f_phi_badge, fill=(15, 23, 42))

# Tutor Name
name_text = "Daniel S. Santander Urrutia"
bbox_n = draw.textbbox((0, 0), name_text, font=f_name)
name_x = 65 + (prof_w - (bbox_n[2] - bbox_n[0])) // 2
draw.text((name_x, 478), name_text, font=f_name, fill=(255, 255, 255))

# Credentials title
creds_title = "DOUBLE M.SC. & GEOPHYSICIST"
bbox_ct = draw.textbbox((0, 0), creds_title, font=f_creds_title)
draw.text((65 + (prof_w - (bbox_ct[2] - bbox_ct[0])) // 2, 516), creds_title, font=f_creds_title, fill=(251, 191, 36))

# Universities
uni_text = "Facultad de Ciencias Físicas y Matemáticas\nUniversidad de Chile • CAU Kiel (Germany)"
bbox_u = draw.multiline_textbbox((0, 0), uni_text, font=f_creds, align='center')
draw.multiline_text((65 + (prof_w - (bbox_u[2] - bbox_u[0])) // 2, 546), uni_text, font=f_creds, fill=(148, 163, 184), align='center')

# Location pill
loc_text = "📍 Hannover, Germany • Worldwide Online"
bbox_loc = draw.textbbox((0, 0), loc_text, font=f_creds)
draw.text((65 + (prof_w - (bbox_loc[2] - bbox_loc[0])) // 2, 630), loc_text, font=f_creds, fill=(52, 211, 153))

# Right Column: 3 Strategic Feature Cards (x: 475 to 1015)
col_r_x = 475
col_r_w = 1015 - col_r_x
features = [
    {
        "tag": "PIAD METHOD™",
        "title": "Physical Intuition ➔ Proofs",
        "desc": "From deep physical visualization & Free Body Diagrams to airtight mathematical rigor without blind formula memorization.",
        "border": (56, 189, 248, 100),
        "tag_color": (56, 189, 248)
    },
    {
        "tag": "14 INTERACTIVE SIMULATORS",
        "title": "3D Physics Lab & Sandbox",
        "desc": "Hands-on orbital mechanics, harmonic oscillators, optics, thermodynamics, and quantum well wavefunctions in real time.",
        "border": (168, 85, 247, 100),
        "tag_color": (192, 132, 252)
    },
    {
        "tag": "EXAM SPRINT DRILLS",
        "title": "Altklausuren & Partial Points Focus",
        "desc": "Targeted drills tailored to German university Klausuren, IB Higher Level, and Pre-U entrance exams to capture maximum points.",
        "border": (245, 158, 11, 100),
        "tag_color": (251, 191, 36)
    }
]

y_feat = 238
h_feat = 130
gap_feat = 15

for i, feat in enumerate(features):
    top = y_feat + i * (h_feat + gap_feat)
    box = [(col_r_x, top), (1015, top + h_feat)]
    draw_card_box(draw, box, fill=(15, 23, 42, 220), border=feat["border"], radius=20)
    
    # Tag
    draw.text((col_r_x + 22, top + 14), feat["tag"], font=f_card_tag, fill=feat["tag_color"])
    
    # Title
    draw.text((col_r_x + 22, top + 36), feat["title"], font=f_card_title, fill=(255, 255, 255))
    
    # Description (wrapped)
    wrapped_desc = wrap_text(feat["desc"], col_r_w - 44, f_card_desc, draw)
    draw.multiline_text((col_r_x + 22, top + 68), wrapped_desc, font=f_card_desc, fill=(203, 213, 225), spacing=3)

# --- BOTTOM CALL TO ACTION CAPSULE (y: 698 to 1025) ---
bottom_box = [(65, 698), (1015, 1025)]
draw_card_box(draw, bottom_box, fill=(10, 18, 38, 240), border=(56, 189, 248, 130), radius=28)

# Subjects strip
subjects_text = "Calculus  •  Linear Algebra  •  Classical Mechanics  •  Electromagnetism  •  Quantum Physics"
bbox_subjs = draw.textbbox((0, 0), subjects_text, font=f_tagline)
draw.text(((W - (bbox_subjs[2] - bbox_subjs[0])) // 2, 722), subjects_text, font=f_tagline, fill=(148, 163, 184))

# Big CTA Button
cta_box = [(160, 768), (920, 848)]
draw.rounded_rectangle(cta_box, radius=22, fill=(16, 185, 129), outline=(52, 211, 153), width=2)

cta_main = "BOOK FREE 20-MIN DIAGNOSTIC SESSION ➔"
bbox_cta = draw.textbbox((0, 0), cta_main, font=f_cta_bold)
draw.text(((W - (bbox_cta[2] - bbox_cta[0])) // 2, 794), cta_main, font=f_cta_bold, fill=(3, 7, 18))

# Sub-CTA Value Prop
bilingual_note = "English & Español  •  Targeted Study Sprints  •  Guaranteed Conceptual Clarity"
bbox_bil = draw.textbbox((0, 0), bilingual_note, font=f_cta_sub)
draw.text(((W - (bbox_bil[2] - bbox_bil[0])) // 2, 872), bilingual_note, font=f_cta_sub, fill=(226, 232, 240))

# Web URL footer pill
url_bg_w = 640
url_bg_x = (W - url_bg_w) // 2
draw.rounded_rectangle([(url_bg_x, 915), (url_bg_x + url_bg_w, 960)], radius=14, fill=(15, 23, 42, 220), outline=(56, 189, 248, 90), width=1)

url_text = "danisantanderurrutia-coder.github.io/classes"
bbox_url = draw.textbbox((0, 0), url_text, font=f_url)
draw.text(((W - (bbox_url[2] - bbox_url[0])) // 2, 926), url_text, font=f_url, fill=(56, 189, 248))

# Save image
out_rgb = base.convert('RGB')
out_rgb.save('public/instagram_post_preview.jpg', quality=95, optimize=True)
print("Saved public/instagram_post_preview.jpg successfully!")
