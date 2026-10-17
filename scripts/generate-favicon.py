import os
from PIL import Image, ImageDraw

def create_repostory_favicon():
    size = 256
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Base Squircle (Rounded Rectangle)
    pad = 12
    radius = 56
    
    # Outer Glow / Border
    for offset in range(6, 0, -1):
        alpha = int(35 + (6 - offset) * 30)
        draw.rounded_rectangle(
            [pad - offset, pad - offset, size - pad + offset, size - pad + offset],
            radius=radius + offset,
            outline=(0, 240, 255, alpha),
            width=2
        )

    # Main dark cyber body
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=radius,
        fill=(3, 7, 18, 255),
        outline=(0, 240, 255, 230),
        width=4
    )

    # Secondary Lime Accent rim on bottom-right
    draw.arc(
        [pad, pad, size - pad, size - pad],
        start=0,
        end=90,
        fill=(57, 255, 20, 240),
        width=5
    )

    # 2. Circuit Track Dots
    draw.ellipse([50, 48, 58, 56], fill=(0, 240, 255, 200))
    draw.ellipse([size - 58, 48, size - 50, 56], fill=(57, 255, 20, 200))
    draw.line([58, 52, 75, 52], fill=(0, 240, 255, 120), width=2)
    draw.line([size - 75, 52, size - 58, 52], fill=(57, 255, 20, 120), width=2)

    # 3. Left Book Wing (Cyan gradient look)
    left_points = [
        (128, 88),   # Top center spine
        (104, 72),
        (56, 76),
        (48, 80),    # Top left corner
        (48, 168),   # Bottom left corner
        (56, 172),
        (104, 168),
        (128, 188)   # Bottom center spine
    ]
    draw.polygon(left_points, fill=(14, 165, 233, 245), outline=(0, 240, 255, 255))

    # Inner left highlight stripe
    draw.line([(62, 94), (62, 154)], fill=(0, 240, 255, 180), width=3)
    draw.line([(80, 92), (80, 158)], fill=(0, 240, 255, 140), width=3)

    # 4. Right Book Wing (Lime/Sky gradient look)
    right_points = [
        (128, 88),   # Top center spine
        (152, 72),
        (200, 76),
        (208, 80),   # Top right corner
        (208, 168),  # Bottom right corner
        (200, 172),
        (152, 168),
        (128, 188)   # Bottom center spine
    ]
    draw.polygon(right_points, fill=(16, 185, 129, 245), outline=(57, 255, 20, 255))

    # Inner right highlight stripe
    draw.line([(176, 92), (176, 158)], fill=(57, 255, 20, 140), width=3)
    draw.line([(194, 94), (194, 154)], fill=(57, 255, 20, 180), width=3)

    # 5. Central Energy Lightning Bolt (Electric White + Cyan glow)
    bolt_points = [
        (136, 56),
        (112, 120),
        (134, 120),
        (116, 192),
        (152, 110),
        (130, 110),
    ]
    # Subtle glow behind bolt
    for g_offset in range(4, 0, -1):
        draw.polygon(bolt_points, outline=(0, 240, 255, 40 * g_offset))

    draw.polygon(bolt_points, fill=(255, 255, 255, 255), outline=(0, 240, 255, 255))

    # Save PNGs and multi-res ICO
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    # 1. High-res Apple Touch Icon
    apple_icon_path = os.path.join(base_dir, 'public', 'apple-icon.png')
    img.resize((180, 180), Image.Resampling.LANCZOS).save(apple_icon_path, format='PNG')
    print(f"Saved: {apple_icon_path}")

    # 2. Standard Web PNG Icon
    icon_png_path = os.path.join(base_dir, 'public', 'icon.png')
    img.save(icon_png_path, format='PNG')
    print(f"Saved: {icon_png_path}")

    # 3. Multi-resolution Favicon.ico
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    
    app_ico_path = os.path.join(base_dir, 'src', 'app', 'favicon.ico')
    public_ico_path = os.path.join(base_dir, 'public', 'favicon.ico')
    
    img.save(app_ico_path, format='ICO', sizes=ico_sizes)
    img.save(public_ico_path, format='ICO', sizes=ico_sizes)
    print(f"Saved: {app_ico_path}")
    print(f"Saved: {public_ico_path}")

if __name__ == '__main__':
    create_repostory_favicon()
