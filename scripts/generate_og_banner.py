import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

# 2400 x 1260 (2x Retina scale for 1200x630)
W, H = 2400, 1260

# 1. Background image (hero-universe)
bg = Image.open('public/images/hero-universe.jpg').convert('RGB')
bg_ratio = bg.width / bg.height
target_ratio = W / H
if bg_ratio > target_ratio:
    new_w = int(H * bg_ratio)
    bg_resized = bg.resize((new_w, H), Image.Resampling.LANCZOS)
    left = (new_w - W) // 2
    bg_cropped = bg_resized.crop((left, 0, left + W, H))
else:
    new_h = int(W / bg_ratio)
    bg_resized = bg.resize((W, new_h), Image.Resampling.LANCZOS)
    top = (new_h - H) // 2
    bg_cropped = bg_resized.crop((0, top, W, top + H))

overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw_ov = ImageDraw.Draw(overlay)

for x in range(W):
    alpha = int(245 - (x / W) * 110)
    draw_ov.line([(x, 0), (x, H)], fill=(7, 12, 24, alpha))

for y in range(H - 240, H):
    alpha = int(((y - (H - 240)) / 240) * 200)
    draw_ov.line([(0, y), (W, y)], fill=(7, 12, 24, alpha))

bg_final = Image.alpha_composite(bg_cropped.convert('RGBA'), overlay).convert('RGB')
draw = ImageDraw.Draw(bg_final)

# Fonts (scaled 2x)
font_brand = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 30, index=1)
font_title = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 108, index=1)
font_sub = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 48, index=1)
font_name = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 52, index=1)
font_cred = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 32, index=0)
font_pill = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 26, index=0)

# Top Brand Pill
draw.rounded_rectangle([140, 110, 960, 180], radius=36, fill=(15, 23, 42, 210), outline=(56, 189, 248, 140), width=2)
draw.ellipse([176, 136, 196, 156], fill=(52, 211, 153))
draw.text((220, 130), 'Φ OPEN KNOWLEDGE & SCIENCE MENTORSHIP', font=font_brand, fill=(226, 232, 240))

# Title
draw.text((140, 230), 'MATH & PHYSICS', font=font_title, fill=(255, 255, 255))
draw.text((140, 350), 'CLASSES', font=font_title, fill=(56, 189, 248))

# Target Audience
draw.text((140, 510), 'University Exams & IB Candidates', font=font_sub, fill=(52, 211, 153))

# Separator line
draw.line([(140, 610), (1320, 610)], fill=(51, 65, 85), width=2)

# Mentor Name & Credentials
draw.text((140, 660), 'Daniel S. Santander Urrutia', font=font_name, fill=(255, 255, 255))
draw.text((140, 740), 'Double M.Sc. & Geophysicist • U. de Chile & CAU Kiel', font=font_cred, fill=(148, 163, 184))
draw.text((140, 800), 'Hannover, Germany • 1-on-1 Online Worldwide', font=font_cred, fill=(56, 189, 248))

# Bottom Feature Pills
pills = [
    ('⚡ 14 Physics Simulators (FBD)', (14, 165, 233)),
    ('📐 PIAD Method™', (168, 85, 247)),
    ('🚀 High-Impact Mentorship', (16, 185, 129))
]

px = 140
py = 960
for text, col in pills:
    bbox = font_pill.getbbox(text)
    pw = bbox[2] - bbox[0] + 56
    draw.rounded_rectangle([px, py, px + pw, py + 68], radius=20, fill=(15, 23, 42, 220), outline=col, width=2)
    draw.text((px + 28, py + 18), text, font=font_pill, fill=(241, 245, 249))
    px += pw + 28

# Right Side: Mentor Photo
profile = Image.open('public/profile.jpg').convert('RGB')
pw_target = 680

mask = Image.new('L', (pw_target * 2, pw_target * 2), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.ellipse((0, 0, pw_target * 2, pw_target * 2), fill=255)
mask = mask.resize((pw_target, pw_target), Image.Resampling.LANCZOS)

profile_circle = ImageOps.fit(profile, (pw_target, pw_target), centering=(0.5, 0.2))
profile_circle.putalpha(mask)

photo_x = 1560
photo_y = 230

# Glowing halo behind photo
halo = Image.new('RGBA', (pw_target + 160, pw_target + 160), (0, 0, 0, 0))
halo_draw = ImageDraw.Draw(halo)
halo_draw.ellipse([40, 40, pw_target + 120, pw_target + 120], fill=(56, 189, 248, 65))
halo = halo.filter(ImageFilter.GaussianBlur(radius=50))
bg_final.paste(halo, (photo_x - 80, photo_y - 80), halo)

# Border ring
ring = Image.new('RGBA', (pw_target + 24, pw_target + 24), (0, 0, 0, 0))
ring_draw = ImageDraw.Draw(ring)
ring_draw.ellipse([4, 4, pw_target + 20, pw_target + 20], outline=(56, 189, 248, 230), width=8)
bg_final.paste(ring, (photo_x - 12, photo_y - 12), ring)

bg_final.paste(profile_circle, (photo_x, photo_y), profile_circle)

# Badge over photo
badge_icon = Image.new('RGBA', (120, 120), (0, 0, 0, 0))
b_draw = ImageDraw.Draw(badge_icon)
b_draw.ellipse([0, 0, 116, 116], fill=(15, 23, 42, 240), outline=(52, 211, 153, 230), width=4)
font_phi = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 56, index=0)
b_draw.text((40, 24), 'Φ', font=font_phi, fill=(52, 211, 153))
bg_final.paste(badge_icon, (photo_x - 20, photo_y + 20), badge_icon)

# Ribbon over photo
ribbon_w = 620
ribbon = Image.new('RGBA', (ribbon_w, 84), (0, 0, 0, 0))
r_draw = ImageDraw.Draw(ribbon)
r_draw.rounded_rectangle([0, 0, ribbon_w, 80], radius=24, fill=(15, 23, 42, 245), outline=(56, 189, 248, 170), width=2)
font_ribbon = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 26, index=1)
r_draw.text((44, 24), 'DANIEL S. SANTANDER URRUTIA', font=font_ribbon, fill=(248, 250, 252))
bg_final.paste(ribbon, (photo_x + 30, photo_y + pw_target - 40), ribbon)

# Save with highest quality and no subsampling (subsampling=0)
# Downscale to the declared og:image size (1200x630) to keep the file light for link previews
bg_final.resize((1200, 630), Image.LANCZOS).save('public/og_banner_preview.jpg', 'JPEG', quality=85, optimize=True)
print('Generated public/og_banner_preview.jpg (1200x630, quality=85) successfully!')
