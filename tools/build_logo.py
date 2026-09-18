"""Génère le logo de FL Briefing Board.

Lignée : écusson de sous-produit FL (« Patch Wall »), frère de FL Creator Missions.
Motif : la flèche tactique courbe posée sur la grille radar — le geste de l'outil.

Règles du manuel de marque (FlightLedger_BRAND) respectées :
  - SVG pur, aucune balise <text> : les lettres sont converties en contours ;
  - palette officielle uniquement (tokens/colors.json) ;
  - aucun effet (ombre, lueur, dégradé) dans le fichier maître.

Sorties :
  FlightLedger_BRAND/logo/master-svg/fl-briefing-board-patch.svg   (maître, avec nom)
  FlightLedger_BRAND/logo/master-svg/fl-briefing-board-icon.svg    (maître, favicon)
  FlightLedger_BriefingBoard/assets/                               (copies d'export)

Usage : python tools/build_logo.py
"""
import math
import shutil
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = Path(__file__).resolve().parent.parent
BRAND = HERE.parent / "FlightLedger_BRAND" / "logo" / "master-svg"
ASSETS = HERE / "assets"
FONT = Path(r"C:\Windows\Fonts\bahnschrift.ttf")

# palette officielle FL
NAVY_EDGE = "#05080D"
BG_0 = "#070B10"
BG_1 = "#0B1220"
BLUE = "#2F8CFF"
BLUE_DEEP = "#123A73"
GOLD = "#D1A94A"
GOLD_PALE = "#FFF3D1"
ORANGE = "#FF8A00"
DANGER = "#FF4D4D"

# ---------------------------------------------------------------- texte → contours

_font = instantiateVariableFont(TTFont(FONT), {"wght": 700, "wdth": 87.5})
_glyphs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
_upm = _font["head"].unitsPerEm


def text_width(s, size, track=0.0):
    k = size / _upm
    adv = sum(_font["hmtx"][_cmap[ord(ch)]][0] for ch in s) * k
    return adv + track * size * (len(s) - 1)


def text_path(s, x, baseline, size, track=0.0):
    """Contours SVG d'une chaîne, ancrée à gauche sur la ligne de base."""
    k = size / _upm
    parts = []
    cx = x
    for ch in s:
        name = _cmap[ord(ch)]
        pen = SVGPathPen(_glyphs)
        _glyphs[name].draw(TransformPen(pen, (k, 0, 0, -k, cx, baseline)))
        parts.append(pen.getCommands())
        cx += _font["hmtx"][name][0] * k + track * size
    return " ".join(p for p in parts if p)


def centered(s, cx, baseline, size, track=0.0):
    return text_path(s, cx - text_width(s, size, track) / 2, baseline, size, track)


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def pts(p):
    return " ".join(f"{f(x)},{f(y)}" for x, y in p)


# ---------------------------------------------------------------- géométrie commune

def hexagon(cx, cy, rx, ry, notch=0.0):
    """Écusson hexagonal pointe en haut et en bas, flancs verticaux.
    `notch` creuse un cran au milieu des flancs, comme l'écusson de Creator."""
    top, bot = cy - ry, cy + ry
    shoulder = ry * 0.45
    l, r = cx - rx, cx + rx
    p = [(cx, top), (r, top + shoulder)]
    if notch:
        p += [(r, cy - notch * 2), (r - notch, cy - notch), (r - notch, cy + notch), (r, cy + notch * 2)]
    p += [(r, bot - shoulder), (cx, bot), (l, bot - shoulder)]
    if notch:
        p += [(l, cy + notch * 2), (l + notch, cy + notch), (l + notch, cy - notch), (l, cy - notch * 2)]
    p += [(l, top + shoulder)]
    return p


def quad(p0, c, p1, t):
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
            u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1])


def radar(cx, cy, r, rings, stroke, sweep=True):
    out = []
    if sweep:                                   # faisceau de balayage, secteur 40°
        a0, a1 = math.radians(-78), math.radians(-38)
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        out.append(f'<path d="M{f(cx)} {f(cy)}L{f(x0)} {f(y0)}A{f(r)} {f(r)} 0 0 1 {f(x1)} {f(y1)}Z" '
                   f'fill="{BLUE}" fill-opacity=".22"/>')
        out.append(f'<path d="M{f(cx)} {f(cy)}L{f(x1)} {f(y1)}" stroke="{BLUE}" '
                   f'stroke-width="{f(stroke * 1.6)}" stroke-linecap="round"/>')
    for i in range(rings):
        rr = r * (i + 1) / rings
        out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(rr)}" fill="none" stroke="{BLUE}" '
                   f'stroke-opacity="{".55" if i == rings - 1 else ".32"}" stroke-width="{f(stroke)}"/>')
    for a in (0, 45, 90, 135):                  # rayons de la grille polaire
        ra = math.radians(a)
        dx, dy = r * math.cos(ra), r * math.sin(ra)
        out.append(f'<path d="M{f(cx - dx)} {f(cy - dy)}L{f(cx + dx)} {f(cy + dy)}" stroke="{BLUE}" '
                   f'stroke-opacity="{".32" if a % 90 == 0 else ".18"}" stroke-width="{f(stroke)}"/>')
    return out


def tactical_arrow(p0, c, p1, width, head, waypoint=True, wp_r=0.0, friend_r=0.0, hostile_r=0.0):
    """Axe d'attaque : ami → (waypoint) → hostile, flèche quadratique orange."""
    out = []
    # la courbe s'arrête avant la pointe pour que le trait ne dépasse pas du triangle
    ang = math.atan2(p1[1] - c[1], p1[0] - c[0])
    tip = p1
    base = (tip[0] - head * math.cos(ang) * .85, tip[1] - head * math.sin(ang) * .85)
    out.append(f'<path d="M{f(p0[0])} {f(p0[1])}Q{f(c[0])} {f(c[1])} {f(base[0])} {f(base[1])}" '
               f'fill="none" stroke="{ORANGE}" stroke-width="{f(width)}" stroke-linecap="round"/>')
    hl = [(tip[0], tip[1]),
          (tip[0] - head * math.cos(ang - .45), tip[1] - head * math.sin(ang - .45)),
          (tip[0] - head * math.cos(ang + .45), tip[1] - head * math.sin(ang + .45))]
    out.append(f'<polygon points="{pts(hl)}" fill="{ORANGE}" stroke="{ORANGE}" '
               f'stroke-width="{f(width * .35)}" stroke-linejoin="round"/>')
    if friend_r:                                # départ : cercle ami
        out.append(f'<circle cx="{f(p0[0])}" cy="{f(p0[1])}" r="{f(friend_r)}" fill="{BG_1}" '
                   f'stroke="{BLUE}" stroke-width="{f(width * .55)}"/>')
    if waypoint:                                # waypoint losange or sur la trajectoire
        m = quad(p0, c, p1, .47)
        d = [(m[0], m[1] - wp_r), (m[0] + wp_r, m[1]), (m[0], m[1] + wp_r), (m[0] - wp_r, m[1])]
        out.append(f'<polygon points="{pts(d)}" fill="{BG_1}" stroke="{GOLD}" '
                   f'stroke-width="{f(width * .5)}" stroke-linejoin="round"/>')
    if hostile_r:                               # cible : losange hostile au-delà de la pointe
        hx = tip[0] + hostile_r * 1.55 * math.cos(ang)
        hy = tip[1] + hostile_r * 1.55 * math.sin(ang)
        d = [(hx, hy - hostile_r), (hx + hostile_r, hy), (hx, hy + hostile_r), (hx - hostile_r, hy)]
        out.append(f'<polygon points="{pts(d)}" fill="{DANGER}" fill-opacity=".25" stroke="{DANGER}" '
                   f'stroke-width="{f(width * .5)}" stroke-linejoin="round"/>')
    return out


# ---------------------------------------------------------------- écusson complet

def patch_svg():
    W = 512
    cx = 256
    outer = hexagon(cx, 256, 214, 238, notch=10)
    inner = hexagon(cx, 256, 186, 210, notch=0)
    body = [
        f'<polygon points="{pts(outer)}" fill="{BG_1}" stroke="{NAVY_EDGE}" stroke-width="20" '
        f'stroke-linejoin="round"/>',
        f'<polygon points="{pts(outer)}" fill="none" stroke="{GOLD}" stroke-width="5" '
        f'stroke-linejoin="round"/>',
        f'<polygon points="{pts(inner)}" fill="{BG_0}" stroke="{BLUE}" stroke-width="6" '
        f'stroke-linejoin="round" stroke-opacity=".85"/>',
    ]
    body += radar(cx, 288, 116, 4, 2.4)
    body += tactical_arrow((184, 360), (170, 236), (322, 224), width=12, head=32,
                           wp_r=14, friend_r=13, hostile_r=16)

    # nom : « FL BRIEFING » en haut (FL bleu, BRIEFING or), « BOARD » en bas
    size, track = 44, .06
    w_fl = text_width("FL", size, track)
    w_gap = size * .30
    w_br = text_width("BRIEFING", size, track)
    x0 = cx - (w_fl + w_gap + w_br) / 2
    body.append(f'<path d="{text_path("FL", x0, 160, size, track)}" fill="{BLUE}"/>')
    body.append(f'<path d="{text_path("BRIEFING", x0 + w_fl + w_gap, 160, size, track)}" fill="{GOLD}"/>')
    body.append(f'<path d="{centered("BOARD", cx, 434, 40, .14)}" fill="{BLUE}"/>')

    chev = [(cx - 22, 452), (cx, 466), (cx + 22, 452), (cx + 22, 459), (cx, 473), (cx - 22, 459)]
    body.append(f'<polygon points="{pts(chev)}" fill="{ORANGE}"/>')
    return svg(W, "FL Briefing Board — écusson",
               "Écusson de sous-produit FlightLedger : axe d'attaque courbe sur grille radar.", body)


# ---------------------------------------------------------------- icône (favicon)

def icon_svg():
    """Sans texte ni waypoint : à 16 px, seuls l'écusson, le radar et la flèche lisent."""
    W = 64
    cx = 32
    outer = hexagon(cx, 32, 27, 30.5)
    body = [
        f'<polygon points="{pts(outer)}" fill="{BG_1}" stroke="{GOLD}" stroke-width="3" '
        f'stroke-linejoin="round"/>',
    ]
    body += radar(cx, 33, 19, 2, 1.6, sweep=True)
    body += tactical_arrow((20, 45), (16, 26), (40, 22), width=4.6, head=11,
                           waypoint=False, hostile_r=4.6)
    return svg(W, "FL Briefing Board — icône",
               "Icône FL Briefing Board : écusson, radar et axe d'attaque.", body)


def svg(w, title, desc, body):
    inner = "\n  ".join(body)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {w}" role="img" '
            f'aria-labelledby="title desc">\n'
            f'  <title id="title">{title}</title>\n'
            f'  <desc id="desc">{desc}</desc>\n'
            f'  {inner}\n</svg>\n')


if __name__ == "__main__":
    BRAND.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    for name, content in (("fl-briefing-board-patch.svg", patch_svg()),
                          ("fl-briefing-board-icon.svg", icon_svg())):
        master = BRAND / name
        master.write_text(content, encoding="utf-8")
        shutil.copyfile(master, ASSETS / name)
        print(f"{name}: {len(content)} octets -> {master} + assets/")
