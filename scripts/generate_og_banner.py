import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

W, H = 1200, 630
img = Image.new('RGB', (W, H), color='#070c18')

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

# Apply dark gradient overlay
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw_ov = ImageDraw.Draw(overlay)

for x in range(W):
    alpha = int(245 - (x / W) * 110)
    draw_ov.line([(x, 0), (x, H)], fill=(7, 12, 24, alpha))

for y in range(H - 120, H):
    alpha = int(((y - (H - 120)) / 120) * 200)
    draw_ov.line([(0, y), (W, y)], fill=(7, 12, 24, alpha))

bg_final = Image.alpha_composite(bg_cropped.convert('RGBA'), overlay).convert('RGB')

draw = ImageDraw.Draw(bg_final)

# Fonts
font_brand = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 15, index=1)
font_title = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 54, index=1)
font_sub = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 24, index=1)
font_name = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 26, index=1)
font_cred = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 16, index=0)
font_pill = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 13, index=0)

# Top Brand Pill
draw.rounded_rectangle([70, 55, 480, 90], radius=18, fill=(15, 23, 42, 200), outline=(56, 189, 248, 120), width=1)
draw.ellipse([88, 68, 98, 78], fill=(52, 211, 153))
draw.text((110, 65), 'Φ OPEN KNOWLEDGE & SCIENCE MENTORSHIP', font=font_brand, fill=(226, 232, 240))

# Title
draw.text((70, 115), 'MATH & PHYSICS', font=font_title, fill=(255, 255, 255))
draw.text((70, 175), 'CLASSES', font=font_title, fill=(56, 189, 248))

# Target Audience
draw.text((70, 255), 'University Exams & IB Candidates', font=font_sub, fill=(52, 211, 153))

# Separator line
draw.line([(70, 305), (660, 305)], fill=(51, 65, 85), width=1)

# Mentor Name & Credentials
draw.text((70, 330), 'Daniel S. Santander Urrutia', font=font_name, fill=(255, 255, 255))
draw.text((70, 370), 'Double M.Sc. & Geophysicist • U. de Chile & CAU Kiel', font=font_cred, fill=(148, 163, 184))
draw.text((70, 400), 'Hannover, Germany • 1-on-1 Online Worldwide', font=font_cred, fill=(56, 189, 248))

# Bottom Feature Pills
pills = [
    ('⚡ 14 Physics Simulators (FBD)', (14, 165, 233)),
    ('📐 PIAD Method™', (168, 85, 247)),
    ('🚀 High-Impact Mentorship', (16, 185, 129))
]

px = 70
py = 480
for text, col in pills:
    bbox = font_pill.getbbox(text)
    pw = bbox[2] - bbox[0] + 28
    draw.rounded_rectangle([px, py, px + pw, py + 34], radius=10, fill=(15, 23, 42, 220), outline=col, width=1)
    draw.text((px + 14, py + 9), text, font=font_pill, fill=(241, 245, 249))
    px += pw + 14

# Right Side: Mentor Photo with Glowing Frame
profile = Image.open('public/profile.jpg').convert('RGB')
pw_target = 340
profile_sq = profile.resize((pw_target, pw_target), Image.Resampling.LANCZOS)

mask = Image.new('L', (pw_target * 2, pw_target * 2), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.ellipse((0, 0, pw_target * 2, pw_target * 2), fill=255)
mask = mask.resize((pw_target, pw_target), Image.Resampling.LANCZOS)

profile_circle = ImageOps.fit(profile, (pw_target, pw_target), centering=(0.5, 0.2))
profile_circle.putalpha(mask)

photo_x = 780
photo_y = 115

halo = Image.new('RGBA', (pw_target + 80, pw_target + 80), (0, 0, 0, 0))
halo_draw = ImageDraw.Draw(halo)
halo_draw.ellipse([20, 20, pw_target + 60, pw_target + 60], fill=(56, 189, 248, 60))
halo = halo.filter(ImageFilter.GaussianBlur(radius=25))
bg_final.paste(halo, (photo_x - 40, photo_y - 40), halo)

ring = Image.new('RGBA', (pw_target + 12, pw_target + 12), (0, 0, 0, 0))
ring_draw = ImageDraw.Draw(ring)
ring_draw.ellipse([2, 2, pw_target + 10, pw_target + 10], outline=(56, 189, 248, 220), width=4)
bg_final.paste(ring, (photo_x - 6, photo_y - 6), ring)

bg_final.paste(profile_circle, (photo_x, photo_y), profile_circle)

badge_icon = Image.new('RGBA', (60, 60), (0, 0, 0, 0))
b_draw = ImageDraw.Draw(badge_icon)
b_draw.ellipse([0, 0, 58, 58], fill=(15, 23, 42, 240), outline=(52, 211, 153, 220), width=2)
font_phi = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 28, index=0)
b_draw.text((20, 12), 'Φ', font=font_phi, fill=(52, 211, 153))
bg_final.paste(badge_icon, (photo_x - 10, photo_y + 10), badge_icon)

ribbon_w = 310
ribbon = Image.new('RGBA', (ribbon_w, 42), (0, 0, 0, 0))
r_draw = ImageDraw.Draw(ribbon)
r_draw.rounded_rectangle([0, 0, ribbon_w, 40], radius=12, fill=(15, 23, 42, 245), outline=(56, 189, 248, 160), width=1)
font_ribbon = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 13, index=1)
r_draw.text((22, 12), 'DANIEL S. SANTANDER URRUTIA', font=font_ribbon, fill=(248, 250, 252))
bg_final.paste(ribbon, (photo_x + 15, photo_y + pw_target - 20), ribbon)

bg_final.save('public/og_banner_preview.jpg', 'JPEG', quality=95)
print('Generated public/og_banner_preview.jpg successfully!')
