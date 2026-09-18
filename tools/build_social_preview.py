"""Compose l'image d'aperçu du dépôt (1280 × 640) : celle qu'affichent GitHub, Discord
et les réseaux quand le lien est partagé.

Entrées : l'écusson rastérisé (--ecusson), la capture de la démo
(assets/readme/demo-caucase.png) et le logo LK Studio (assets/lk-studio-logo.png).
Sortie : assets/readme/apercu-social.png — à déposer dans Settings › Social preview.

Usage : python tools/build_social_preview.py --ecusson chemin/ecusson-300.png
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent.parent
W, H = 1280, 640
BG, GOLD, BLUE, SILVER, PAPER, INK = "#070B10", "#D1A94A", "#2F8CFF", "#B7C3CF", "#F4F1EA", "#1D1D1B"


def font(size, weight=700):
    f = ImageFont.truetype(r"C:\Windows\Fonts\bahnschrift.ttf", size)
    try:
        f.set_variation_by_axes([weight, 100])
    except Exception:
        pass
    return f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ecusson", required=True)
    args = ap.parse_args()

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # capture de la démo, à droite, cadrée sur la carte et la coupe
    shot = Image.open(HERE / "assets" / "readme" / "demo-caucase.png").convert("RGB")
    shot = shot.crop((172, 86, shot.width, shot.height))
    tw = 700
    shot = shot.resize((tw, round(shot.height * tw / shot.width)), Image.LANCZOS)
    x0, y0 = W - tw - 40, (H - shot.height) // 2
    glow = Image.new("RGB", (tw + 40, shot.height + 40), BG)
    img.paste(glow.filter(ImageFilter.GaussianBlur(8)), (x0 - 20, y0 - 20))
    img.paste(shot, (x0, y0))
    d.rounded_rectangle((x0 - 3, y0 - 3, x0 + tw + 2, y0 + shot.height + 2), radius=6, outline=GOLD, width=3)

    # écusson et texte, à gauche
    patch = Image.open(args.ecusson).convert("RGBA").resize((150, 150), Image.LANCZOS)
    img.paste(patch, (48, 48), patch)
    d.text((48, 220), "FL Briefing Board", font=font(46), fill="#E6EDF5")
    d.text((50, 278), "Le tableau de briefing", font=font(24, 400), fill=SILVER)
    d.text((50, 308), "des escadrons DCS World", font=font(24, 400), fill=SILVER)
    y = 360
    for line in ("Formes aéro prêtes à poser", "Cartes des 14 théâtres DCS",
                 "Coupe liée à la route", "Caps magnétiques · kneeboard"):
        d.text((50, y), "›", font=font(20), fill=GOLD)
        d.text((72, y), line, font=font(20, 500), fill="#E6EDF5")
        y += 30

    # signature LK Studio, en bas à gauche, sur son papier
    lk = Image.open(HERE / "assets" / "lk-studio-logo.png").convert("RGBA")
    lk = lk.resize((72, round(lk.height * 72 / lk.width)), Image.LANCZOS)
    card = (48, H - 48 - 88, 48 + 410, H - 48)
    d.rounded_rectangle(card, radius=10, fill=PAPER)
    img.paste(lk, (card[0] + 10, card[1] + (88 - lk.height) // 2), lk)
    d.text((card[0] + 96, card[1] + 18), "Un projet LK Studio", font=font(22), fill=INK)
    d.text((card[0] + 96, card[1] + 50), "l-k-studio.com", font=font(19, 500), fill=INK)

    out = HERE / "assets" / "readme" / "apercu-social.png"
    img.save(out, optimize=True)
    print(f"{out} ({out.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
