import sys
import os
from PIL import Image

def slice_quad(input_path, out_names, margin_pct=0.01):
    """
    Slices a 2x2 grid image into 4 separate images.
    out_names order: [top_left, top_right, bottom_left, bottom_right]
    margin_pct: small percentage to trim from center seams to avoid borders.
    """
    img = Image.open(input_path)
    width, height = img.size
    
    mid_x = width // 2
    mid_y = height // 2
    
    pad_x = int(width * margin_pct)
    pad_y = int(height * margin_pct)
    
    quads = [
        # top_left
        (0, 0, mid_x - pad_x, mid_y - pad_y),
        # top_right
        (mid_x + pad_x, 0, width, mid_y - pad_y),
        # bottom_left
        (0, mid_y + pad_y, mid_x - pad_x, height),
        # bottom_right
        (mid_x + pad_x, mid_y + pad_y, width, height)
    ]
    
    for bbox, out_name in zip(quads, out_names):
        cropped = img.crop(bbox)
        # Save as optimized webp if name ends with .webp, else png/jpg
        if out_name.endswith('.webp'):
            cropped.save(out_name, 'WEBP', quality=88)
        else:
            cropped.save(out_name, quality=90)
        print(f"Saved: {out_name} ({cropped.size[0]}x{cropped.size[1]})")

if __name__ == '__main__':
    if len(sys.argv) < 6:
        print("Usage: python3 slice_quad.py <input_image> <tl> <tr> <bl> <br>")
        sys.exit(1)
    
    in_img = sys.argv[1]
    out_files = sys.argv[2:6]
    slice_quad(in_img, out_files)
