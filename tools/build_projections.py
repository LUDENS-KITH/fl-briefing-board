"""Génère projections.js : la projection de chaque théâtre DCS, pour lire une mission.

Une mission DCS place tout en mètres, dans un repère plan propre au théâtre (x vers le
nord, y vers l'est). Pour poser ces points sur la carte, il faut la projection qui relie
ce repère à la latitude et à la longitude. Le fichier de configuration du terrain qui la
déclare est chiffré ; on ne le lit pas. On la mesure : les balises radio de
l'installation locale (Mods/terrains/<théâtre>/Beacons.lua) portent à la fois leur
position DCS et leur latitude/longitude. Sur ces paires, on ajuste une projection
transverse de Mercator (ellipsoïde WGS84) :

    x DCS = k0 · N(lat, lon ; lon0) + x0        y DCS = k0 · E(lat, lon ; lon0) + y0

N et E sont la projection de Mercator transverse d'échelle 1 (pyproj). Pour un lon0
donné, k0, x0 et y0 se trouvent par moindres carrés ; lon0 se cherche par balayage puis
affinage. L'écart quadratique moyen (rms) et le plus grand écart (max), en mètres,
disent si le modèle tient : un rms de l'ordre du mètre veut dire que c'est bien la
projection du jeu.

Seules quatre valeurs mesurées par théâtre sont publiées, avec leur qualité. Aucune
position de balise n'est écrite dans le dépôt.

Usage : python tools/build_projections.py [--dcs "C:/Program Files/Eagle Dynamics/DCS World"]
"""
import argparse
import json
import re
from pathlib import Path

import numpy as np
from pyproj import Transformer

HERE = Path(__file__).resolve().parent.parent
OUT = HERE / "projections.js"
# dossier du terrain → nom du théâtre dans une mission (champ `theatre`)
THEATRE = {"Sinai": "SinaiMap", "MarianasWWII": "MarianaIslandsWWII"}

PAIR = re.compile(
    r"position\s*=\s*\{\s*([-\d.eE+]+)\s*,\s*[-\d.eE+]+\s*,\s*([-\d.eE+]+)\s*\}\s*;"
    r"[^{}]*?positionGeo\s*=\s*\{\s*latitude\s*=\s*([-\d.]+)\s*[,;]\s*longitude\s*=\s*([-\d.]+)",
    re.S)


def pairs(beacons: Path):
    """(x nord, y est, lat, lon) de chaque balise qui porte les deux repères"""
    text = beacons.read_text(encoding="utf-8", errors="replace")
    return np.array([[float(v) for v in m.groups()] for m in PAIR.finditer(text)])


def tm(lat, lon, lon0):
    t = Transformer.from_crs("EPSG:4326", f"+proj=tmerc +lat_0=0 +lon_0={lon0} +k_0=1 +x_0=0 +y_0=0 "
                             "+ellps=WGS84 +units=m +no_defs", always_xy=True)
    e, n = t.transform(lon, lat)
    return np.asarray(n), np.asarray(e)


def fit_at(p, lon0):
    """k0, x0, y0 par moindres carrés pour un lon0 ; renvoie aussi les écarts en mètres"""
    n, e = tm(p[:, 2], p[:, 3], lon0)
    ones = np.ones_like(n)
    a = np.block([[n[:, None], ones[:, None], np.zeros_like(n)[:, None]],
                  [e[:, None], np.zeros_like(e)[:, None], ones[:, None]]])
    b = np.concatenate([p[:, 0], p[:, 1]])
    sol, *_ = np.linalg.lstsq(a, b, rcond=None)
    k0, x0, y0 = sol
    d = np.hypot(k0 * n + x0 - p[:, 0], k0 * e + y0 - p[:, 1])
    return k0, x0, y0, d


def fit(p):
    rms = lambda lon0: float(np.sqrt(np.mean(fit_at(p, lon0)[3] ** 2)))
    lo, hi = p[:, 3].min() - 15, p[:, 3].max() + 15
    best = min(np.arange(lo, hi, 0.25), key=rms)
    a, b = best - 0.5, best + 0.5                        # affinage par section dorée
    g = (5 ** .5 - 1) / 2
    for _ in range(80):
        c, d = b - g * (b - a), a + g * (b - a)
        if rms(c) < rms(d):
            b = d
        else:
            a = c
    lon0 = (a + b) / 2
    k0, x0, y0, d = fit_at(p, lon0)
    # la mesure tombe sur des valeurs rondes (méridien entier, échelle 0,9996, celles de
    # l'UTM) : on les retient quand elle les donne à 1e-4 près, et on réajuste x0, y0
    if abs(lon0 - round(lon0)) < 1e-4 and abs(k0 - 0.9996) < 1e-6:
        lon0, k0 = float(round(lon0)), 0.9996
        n, e = tm(p[:, 2], p[:, 3], lon0)
        x0, y0 = float(np.mean(p[:, 0] - k0 * n)), float(np.mean(p[:, 1] - k0 * e))
        d = np.hypot(k0 * n + x0 - p[:, 0], k0 * e + y0 - p[:, 1])
    return {"lon0": round(lon0, 6), "k0": round(float(k0), 8), "x0": round(float(x0), 2),
            "y0": round(float(y0), 2), "n": int(len(p)), "rms": round(float(np.sqrt(np.mean(d ** 2))), 2),
            "max": round(float(d.max()), 2)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dcs", default="C:/Program Files/Eagle Dynamics/DCS World")
    terrains = Path(ap.parse_args().dcs) / "Mods" / "terrains"
    out = {}
    for d in sorted(terrains.iterdir()):
        b = d / "Beacons.lua"
        p = pairs(b) if b.exists() else np.empty((0, 4))
        name = THEATRE.get(d.name, d.name)
        if len(p) < 6:
            print(f"{name:20} {len(p):4} balises — trop peu, pas de projection")
            continue
        out[name] = fit(p)
        r = out[name]
        print(f"{name:20} {r['n']:4} balises  lon0 {r['lon0']:>11}  k0 {r['k0']:.8f}  "
              f"rms {r['rms']:>8} m  max {r['max']:>8} m")
    OUT.write_text(
        "/* Généré par tools/build_projections.py — ne pas modifier à la main.\n"
        "   Projection transverse de Mercator (WGS84) de chaque théâtre DCS, mesurée sur les\n"
        "   balises d'une installation du jeu, qui portent leur position DCS et leur\n"
        "   latitude/longitude : x DCS = k0 · N + x0 (nord), y DCS = k0 · E + y0 (est), N et E\n"
        "   de la projection d'échelle 1 centrée sur lon0. n : balises ; rms et max : écarts\n"
        "   de l'ajustement, en mètres. */\n"
        f"const PROJECTIONS = {json.dumps(out, ensure_ascii=False)};\n"
        "if (typeof module !== 'undefined') module.exports = PROJECTIONS;\n", encoding="utf-8")
    print(f"écrit : {OUT.name}, {len(out)} théâtre(s)")


if __name__ == "__main__":
    main()
