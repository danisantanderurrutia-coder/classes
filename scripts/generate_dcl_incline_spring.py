import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1680, 960

def generate_dcl_incline_spring(filename='public/emblems/dcl_incline_spring.jpg'):
    img = Image.new('RGBA', (W, H), (6, 11, 24, 255))
    draw = ImageDraw.Draw(img)

    # 1. Spacetime Grid Background (Cosmic perspective)
    # Distant Stars
    random.seed(137)
    for _ in range(180):
        sx = random.randint(0, W)
        sy = random.randint(0, H)
        s_size = random.choice([1, 2, 3])
        s_b = random.randint(140, 255)
        draw.ellipse([(sx, sy), (sx + s_size, sy + s_size)], fill=(s_b, s_b, s_b, 180))

    # Curved Spacetime Perspective Lines
    grid_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d_grid = ImageDraw.Draw(grid_layer)
    
    # Perspective longitudinal lines converging
    vanish_x, vanish_y = W // 2, 280
    for x in range(-400, W + 600, 90):
        d_grid.line([(vanish_x, vanish_y), (x, H + 100)], fill=(56, 189, 248, 22), width=2)
    # Transverse hyperbolic curvature lines
    for y_base in range(350, H + 120, 55):
        curve_pts = []
        for x in range(0, W + 40, 40):
            dx = (x - W / 2) / 600.0
            y = y_base + 35 * (dx * dx)
            curve_pts.append((x, y))
        d_grid.line(curve_pts, fill=(56, 189, 248, 28), width=2)

    img = Image.alpha_composite(img, grid_layer)
    draw = ImageDraw.Draw(img)

    # Fonts
    font_bold = '/System/Library/Fonts/HelveticaNeue.ttc'
    font_mono = '/System/Library/Fonts/Menlo.ttc'
    f_large = ImageFont.truetype(font_bold, 44, index=1)
    f_title = ImageFont.truetype(font_bold, 36, index=1)
    f_tag = ImageFont.truetype(font_bold, 28, index=1)
    f_math = ImageFont.truetype(font_mono, 32, index=1)
    f_math_sm = ImageFont.truetype(font_mono, 26, index=1)

    # 2. Incline Geometry
    # Ramp base: (160, 780) to (1480, 780)
    # Ramp top: (1480, 240)
    # Incline runs from (160, 780) up to (1480, 240)
    p_start = (180, 780)
    p_base_r = (1440, 780)
    p_top = (1440, 250)
    
    dx = p_top[0] - p_start[0]  # 1260
    dy = p_start[1] - p_top[1]  # 530
    length = math.hypot(dx, dy)
    theta = math.atan2(dy, dx)  # in radians (~22.8 deg)
    theta_deg = math.degrees(theta)

    # Unit vectors
    # u_ramp: parallel to incline pointing up-right
    ux, uy = dx / length, -dy / length
    # n_ramp: perpendicular to incline pointing up-left
    nx, ny = -uy, ux  # rotated 90 deg counterclockwise

    # Draw solid ramp polygon with glowing neon outline
    ramp_poly = [p_start, p_base_r, p_top]
    draw.polygon(ramp_poly, fill=(10, 25, 52, 220), outline=(56, 189, 248, 240))
    draw.line([p_start, p_top], fill=(56, 189, 248, 255), width=5)
    draw.line([p_start, p_base_r], fill=(100, 116, 139), width=3)
    draw.line([p_base_r, p_top], fill=(100, 116, 139), width=3)

    # Incline Angle Arc θ
    arc_r = 130
    arc_box = [(p_start[0] - arc_r, p_start[1] - arc_r), (p_start[0] + arc_r, p_start[1] + arc_r)]
    draw.arc(arc_box, start=360 - theta_deg, end=360, fill=(245, 158, 11), width=4)
    # θ label
    draw.text((p_start[0] + 145, p_start[1] - 42), "θ = 25°", font=f_math_sm, fill=(245, 158, 11))

    # Top Wall (Perpendicular support)
    wall_len = 110
    w_top = (p_top[0] + nx * wall_len * 0.8, p_top[1] + ny * wall_len * 0.8)
    w_bot = (p_top[0] - nx * wall_len * 0.2, p_top[1] - ny * wall_len * 0.2)
    draw.line([w_bot, w_top], fill=(226, 232, 240), width=10)
    # Hatching on wall
    for h_i in range(5):
        h_t = h_i / 4.0
        hx = w_bot[0] + (w_top[0] - w_bot[0]) * h_t
        hy = w_bot[1] + (w_top[1] - w_bot[1]) * h_t
        draw.line([(hx, hy), (hx + ux * 22, hy + uy * 22)], fill=(148, 163, 184), width=3)

    # 3. Mass Block on the Incline
    # Position along ramp: ~0.55 of the length
    t_mass = 0.52
    mass_center_on_incline = (p_start[0] + ux * length * t_mass, p_start[1] + uy * length * t_mass)
    
    # Block dimensions
    bw, bh = 150, 110
    # Center of mass is raised along normal by bh/2
    cm_x = mass_center_on_incline[0] + nx * (bh / 2)
    cm_y = mass_center_on_incline[1] + ny * (bh / 2)

    # 4. Glowing Neon Spring (Connecting top wall to block)
    # Spring start at wall:
    spring_start = (p_top[0] + nx * (bh / 2), p_top[1] + ny * (bh / 2))
    # Spring end at block:
    spring_end = (cm_x + ux * (bw / 2), cm_y + uy * (bw / 2))
    
    s_dx = spring_end[0] - spring_start[0]
    s_dy = spring_end[1] - spring_start[1]
    s_len = math.hypot(s_dx, s_dy)
    s_ux, s_uy = s_dx / s_len, s_dy / s_len
    s_nx, s_ny = -s_uy, s_ux

    num_coils = 14
    spring_pts = [spring_start]
    coil_width = 32
    for c in range(1, num_coils):
        f = c / float(num_coils)
        px = spring_start[0] + s_ux * s_len * f
        py = spring_start[1] + s_uy * s_len * f
        side = 1 if c % 2 == 1 else -1
        spring_pts.append((px + s_nx * coil_width * side, py + s_ny * coil_width * side))
    spring_pts.append(spring_end)

    # Draw neon pink spring
    draw.line(spring_pts, fill=(236, 72, 153), width=5)
    # Spring label
    s_mid = spring_pts[len(spring_pts) // 2]
    draw.text((s_mid[0] + s_nx * 38 - 40, s_mid[1] + s_ny * 38 - 15), "k", font=f_math, fill=(236, 72, 153))

    # Draw Block Corners (Rotated rectangle)
    corners = [
        (cm_x - ux * (bw/2) - nx * (bh/2), cm_y - uy * (bw/2) - ny * (bh/2)),
        (cm_x + ux * (bw/2) - nx * (bh/2), cm_y + uy * (bw/2) - ny * (bh/2)),
        (cm_x + ux * (bw/2) + nx * (bh/2), cm_y + uy * (bw/2) + ny * (bh/2)),
        (cm_x - ux * (bw/2) + nx * (bh/2), cm_y - uy * (bw/2) + ny * (bh/2)),
    ]
    # Block Fill & Glowing Outline
    draw.polygon(corners, fill=(14, 165, 233, 235), outline=(255, 255, 255), width=3)
    # Center dot
    draw.ellipse([(cm_x - 7, cm_y - 7), (cm_x + 7, cm_y + 7)], fill=(255, 255, 255))
    draw.text((cm_x - 18, cm_y - 22), "m", font=f_large, fill=(255, 255, 255))

    # 5. Free Body Diagram (DCL) Vector Arrows:
    # Arrow drawing helper with arrowhead
    def draw_vector(p_from, p_to, color, width=5, label="", label_offset=(15, -15)):
        draw.line([p_from, p_to], fill=color, width=width)
        # Arrowhead
        ax = p_to[0] - p_from[0]
        ay = p_to[1] - p_from[1]
        v_len = math.hypot(ax, ay)
        if v_len > 10:
            ux_v, uy_v = ax / v_len, ay / v_len
            nx_v, ny_v = -uy_v, ux_v
            head_sz = 18
            p_h1 = (p_to[0] - ux_v * head_sz + nx_v * (head_sz * 0.55), p_to[1] - uy_v * head_sz + ny_v * (head_sz * 0.55))
            p_h2 = (p_to[0] - ux_v * head_sz - nx_v * (head_sz * 0.55), p_to[1] - uy_v * head_sz - ny_v * (head_sz * 0.55))
            draw.polygon([p_to, p_h1, p_h2], fill=color)
        if label:
            draw.text((p_to[0] + label_offset[0], p_to[1] + label_offset[1]), label, font=f_math, fill=color)

    # 5A. Normal Force N (Perpendicular to ramp, cyan)
    len_N = 210
    p_N = (cm_x + nx * len_N, cm_y + ny * len_N)
    draw_vector((cm_x, cm_y), p_N, (56, 189, 248), width=5, label="N", label_offset=(-25, -45))

    # 5B. Spring Force F_s = -k·Δx (Along ramp up towards wall, neon pink)
    len_Fs = 250
    p_Fs = (cm_x + ux * len_Fs, cm_y + uy * len_Fs)
    draw_vector((cm_x, cm_y), p_Fs, (236, 72, 153), width=6, label="Fs = k·Δx", label_offset=(15, -25))

    # 5C. Gravity / Weight W = mg (Straight down, gold/white)
    len_mg = 230
    p_mg = (cm_x, cm_y + len_mg)
    draw_vector((cm_x, cm_y), p_mg, (251, 191, 36), width=5, label="mg", label_offset=(15, 5))

    # 5D. Decomposed Gravity Components (Dashed lines):
    # mg·cosθ (Opposite to N along -n_ramp)
    len_mg_cos = len_mg * math.cos(theta)
    p_mg_cos = (cm_x - nx * len_mg_cos, cm_y - ny * len_mg_cos)
    draw.line([(cm_x, cm_y), p_mg_cos], fill=(56, 189, 248, 180), width=3)
    draw.text((p_mg_cos[0] - 150, p_mg_cos[1] + 15), "mg·cosθ", font=f_math_sm, fill=(56, 189, 248))
    # Dashed perpendicular link to mg
    draw.line([p_mg_cos, p_mg], fill=(148, 163, 184, 120), width=2)

    # mg·sinθ (Down ramp along -u_ramp)
    len_mg_sin = len_mg * math.sin(theta)
    p_mg_sin = (cm_x - ux * len_mg_sin, cm_y - uy * len_mg_sin)
    draw.line([(cm_x, cm_y), p_mg_sin], fill=(236, 72, 153, 180), width=3)
    draw.text((p_mg_sin[0] - 170, p_mg_sin[1] - 40), "mg·sinθ", font=f_math_sm, fill=(236, 72, 153))
    # Dashed parallel link to mg
    draw.line([p_mg_sin, p_mg], fill=(148, 163, 184, 120), width=2)

    # 6. Coordinate system badge (Rotated x|| and y⊥)
    axis_x, axis_y = 320, 320
    draw.line([(axis_x, axis_y), (axis_x + ux * 90, axis_y + uy * 90)], fill=(236, 72, 153), width=3)
    draw.polygon([(axis_x + ux * 95, axis_y + uy * 95), 
                  (axis_x + ux * 80 + nx * 6, axis_y + uy * 80 + ny * 6),
                  (axis_x + ux * 80 - nx * 6, axis_y + uy * 80 - ny * 6)], fill=(236, 72, 153))
    draw.text((axis_x + ux * 105, axis_y + uy * 105 - 10), "+x", font=f_math_sm, fill=(236, 72, 153))

    draw.line([(axis_x, axis_y), (axis_x + nx * 90, axis_y + ny * 90)], fill=(56, 189, 248), width=3)
    draw.polygon([(axis_x + nx * 95, axis_y + ny * 95), 
                  (axis_x + nx * 80 + ux * 6, axis_y + ny * 80 + uy * 6),
                  (axis_x + nx * 80 - ux * 6, axis_y + ny * 80 - uy * 6)], fill=(56, 189, 248))
    draw.text((axis_x + nx * 105 - 15, axis_y + ny * 105 - 20), "+y", font=f_math_sm, fill=(56, 189, 248))

    # 7. Modern Technical Pill Header / Footer
    draw.rounded_rectangle([(40, 35), (780, 95)], radius=18, fill=(15, 23, 42, 230), outline=(56, 189, 248, 140), width=2)
    draw.text((60, 50), "FREE BODY DIAGRAM • DCL & DYNAMICS", font=f_title, fill=(56, 189, 248))

    draw.rounded_rectangle([(W - 740, 35), (W - 40, 95)], radius=18, fill=(15, 23, 42, 230), outline=(236, 72, 153, 140), width=2)
    draw.text((W - 710, 52), "∑Fx = k·Δx - mg·sinθ = m·ẍ", font=f_math, fill=(236, 72, 153))

    out = img.convert('RGB')
    out.save(filename, 'JPEG', quality=98)
    print(f"Generated {filename} successfully!")
    return out

if __name__ == '__main__':
    generate_dcl_incline_spring()
