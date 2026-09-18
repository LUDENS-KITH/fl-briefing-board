"""Génère theatres.js : les théâtres DCS, cadrés sur l'emprise réelle de leurs aérodromes.

Version publique (par défaut) : seules les emprises sont écrites — quatre coordonnées par
théâtre. Aucun nom ni aucune position d'aérodrome : leur source ne publie pas de licence.
Avec --aerodromes, la couche des aérodromes DCS est ajoutée, pour un usage local seulement :
ne pas publier le fichier ainsi produit.

Source : FlightLedger_V2/apps/api/app/data/airfields/fallback_airodromes.json
(791 aérodromes, extraits du dépôt public DCS-Web-Editor). Lecture seule : ce script
n'écrit que dans FlightLedger_BriefingBoard.

Coordonnées : reference_point_geo, sinon la position caméra par défaut. Les points
(0, 0) sont rejetés — trois FOB afghanes portent ce « null island » en amont.

Usage : python tools/build_theatres.py [--aerodromes]
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
SRC = HERE.parent / "FlightLedger_V2" / "apps" / "api" / "app" / "data" / "airfields" / "fallback_airodromes.json"
OUT = HERE / "theatres.js"

NAMES = {                                   # noms affichés, dans l'ordre de la liste
    "Caucasus": "Caucase", "Syria": "Syrie", "PersianGulf": "Golfe Persique",
    "SinaiMap": "Sinaï", "Iraq": "Irak", "Afghanistan": "Afghanistan",
    "MarianaIslands": "Mariannes", "MarianaIslandsWWII": "Mariannes 1944",
    "Nevada": "Nevada", "Normandy": "Normandie", "TheChannel": "La Manche",
    "Falklands": "Atlantique Sud", "Kola": "Kola", "GermanyCW": "Allemagne (Guerre froide)",
}


def coords(r):
    for g in ((r.get("reference_point_geo") or {}),
              ((r.get("default_camera_position_geo") or {}).get("pnt") or {})):
        lat, lon = g.get("lat"), g.get("lon")
        if lat is not None and lon is not None and not (lat == 0 and lon == 0):
            return round(lat, 4), round(lon, 4)
    return None


def main():
    rows = json.loads(SRC.read_text(encoding="utf-8"))
    by = {}
    for r in rows:
        c = coords(r)
        if c:
            name = r.get("display_name") or (r.get("names") or {}).get("en") or r.get("id")
            by.setdefault(r["theatre"], []).append((name, *c))
    unknown = sorted(set(by) - set(NAMES))
    assert not unknown, f"théâtres sans nom affiché : {unknown}"

    theatres, airfields = [], []
    for i, (tid, label) in enumerate(NAMES.items()):
        pts = by.get(tid, [])
        assert pts, f"aucun aérodrome localisé pour {tid}"
        la = [p[1] for p in pts]; lo = [p[2] for p in pts]
        theatres.append({"id": tid, "name": label, "n": len(pts),
                         "bounds": [min(la), min(lo), max(la), max(lo)]})
        airfields += [[i, n, lat, lon] for n, lat, lon in sorted(pts)]

    if "--aerodromes" not in sys.argv:
        airfields = []                  # version publique : la source n'a pas de licence
    OUT.write_text(
        "/* Généré par tools/build_theatres.py — ne pas modifier à la main.\n"
        "   Théâtres DCS : emprise [sud, ouest, nord, est] de leurs aérodromes.\n"
        "   Aérodromes : [indice du théâtre, nom DCS, latitude, longitude]. */\n"
        f"const THEATRES = {json.dumps(theatres, ensure_ascii=False)};\n"
        f"const AIRFIELDS = {json.dumps(airfields, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8")
    print(f"{len(theatres)} théâtres, {len(airfields)} aérodromes -> {OUT} ({OUT.stat().st_size} octets)")


if __name__ == "__main__":
    main()
