"""Génère mapclass.js : pour chaque type d'unité DCS qui déclare son icône de carte en Lua
lisible, la clé de cette icône (mapclasskey) et la famille du tableau qui la dessine (lot 21).

Source : l'installation de DCS du poste, en lecture seule —
  - CoreMods/ et Mods/ de l'installation, puis Mods/ des dossiers « Saved Games/DCS* » :
    chaque définition d'unité (table passée à add_surface_unit, add_aircraft, …) porte
    son `Name` (le type écrit dans la mission) et son `mapclasskey`. Les fichiers sont
    exécutés par bin/luae.exe de l'installation dans un bac à sable (mapclass_probe.lua) :
    une lecture au texte prenait un `Name` imbriqué pour le type ;
  - MissionEditor/data/NewMap/classifier.lua : les clés connues de la carte F10.
Les véhicules et navires de base de DCS ne déclarent leur clé dans aucun fichier lisible
(leur base, Scripts/Database.edce, est chiffrée) : ils ne sont pas dans la table, et
l'import les range à leur catégorie (miz.js). Aucune image ni aucun texte d'ED n'est
publié : seuls le nom du type, la clé et la famille.

Usage : python tools/build_mapclass.py [dossier de DCS]
"""
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
OUT = HERE / "mapclass.js"
DCS = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\Program Files\Eagle Dynamics\DCS World")
SAVED = Path.home() / "Saved Games"

# clé DCS (4 derniers chiffres) → famille du tableau (symbols.js, lot 19 et SYMBOLES.md)
FAMILY = {
    "0001": "tank", "0002": "ifv", "0003": "ifv", "0004": "ifv", "0005": "truck",
    "0006": "artillery", "0007": "mlrs", "0009": "sam", "0011": "sam_short",
    "0012": "sam_med", "0013": "sam_long", "0014": "sam_short", "0015": "aaa", "0016": "aaa",
    "0020": "helo", "0021": "attack_helo", "0022": "farp", "0023": "drone", "0024": "fighter",
    "0025": "attack", "0026": "recon", "0027": "bomber", "0028": "ew", "0029": "cargo",
    "0036": "radar", "0037": "ship", "0038": "sub", "0045": "cp", "0046": "cp", "0047": "cp",
    "0050": "cp", "0054": "sam_med", "0056": "awacs", "0064": "tanker", "0065": "carrier",
    "0066": "ship", "0067": "ship", "0068": "ship", "0069": "ship", "0070": "ship", "0071": "cp",
    # relevées pour l'import (lot 21), titres de classifier.lua et images de images/nato/ :
    # ЗРК ближнего действия / ЗСУ / БМ ЗРК ближн. действ. ; боевой катер ; мобильная РЛС ;
    # пусковые ЗРК БД (courte), СД (moyenne), МД (малой дальности : courte) ; hélicoptère de reco
    "0010": "sam_short", "0017": "sam_short", "0018": "sam_short", "0039": "ship",
    "0078": "sam_short", "0079": "sam_short", "0080": "sam_med", "0081": "sam_med", "0082": "sam_med",
    "0083": "radar", "0084": "sam_short", "0085": "sam_short", "0086": "sam_short", "0087": "sam_short",
    "0088": "sam_short", "0089": "sam_med", "0096": "helo",
    # icônes « POINT 2xx » de classifier.lua, sans titre : lues sur leur image —
    # 0201 rectangle barré (infanterie, celle des fantassins et du personnel de pont),
    # 0205 canons antiaériens, 0202 et 0213 à 0217 missile sol-air ; et d'après les types qui
    # les portent : 0212 camions et engins de servitude, 0208 lanceurs sol-sol (Scud, M142,
    # TOS-1A), 0204 véhicules antichars (BRDM-2 Malyutka, VAB Mephisto)
    "0201": "infantry", "0205": "aaa", "0202": "sam", "0213": "sam", "0214": "sam", "0215": "sam",
    "0216": "sam", "0217": "sam", "0212": "truck", "0208": "mlrs", "0204": "ifv",
}

def norm(k):
    """P0091000024 et P91000024 désignent la même icône (classifier.lua, champ file)"""
    m = re.fullmatch(r"P0*91(\d{6})", k)
    return m.group(1)[-4:] if m else None


def probe(files):
    """les définitions exécutées par l'interpréteur de DCS dans le bac à sable de
    mapclass_probe.lua : chaque table d'unité rendue avec son `Name` et sa clé"""
    fd, name = tempfile.mkstemp(suffix=".txt")
    os.close(fd)
    lst = Path(name)
    lst.write_text(chr(10).join(str(f) for f in files), encoding="utf-8")
    try:
        r = subprocess.run([str(DCS / "bin" / "luae.exe"), str(HERE / "tools" / "mapclass_probe.lua"), str(lst)],
                           capture_output=True, timeout=600, cwd=str(DCS))
    finally:
        lst.unlink()
    rows = [tuple(line.split(chr(9), 2)) for line in r.stdout.decode("utf-8", "replace").splitlines()
            if line.count(chr(9)) == 2]
    done = {f for _, _, f in rows}
    for name, key, _ in rows:
        yield name, key, "exécuté"
    # un fichier arrêté en route, ou sans table rendue : l'affectation lue au texte, quand
    # le nom et la clé sont posés sur la même table et qu'elle n'en porte qu'un de chaque
    for f in files:
        if str(f) in done:
            continue
        text = f.read_text(encoding="utf-8", errors="replace")
        names, keys = {}, {}
        for var, val in re.findall(r'(?m)^\s*(\w+)\.Name\s*=\s*["\']([^"\']+)["\']', text):
            names.setdefault(var, set()).add(val)
        for var, val in re.findall(r'(?m)^\s*(\w+)\.mapclasskey\s*=\s*["\']([^"\']+)["\']', text):
            keys.setdefault(var, set()).add(val)
        found = False
        for var in names.keys() & keys.keys():
            if len(names[var]) == 1 and len(keys[var]) == 1:
                found = True
                yield next(iter(names[var])), next(iter(keys[var])), "lu"
        if not found:
            yield None, f, "sans"


def main():
    known = set(norm(k) for k in re.findall(r"^\s*(P\d+)\s*=", (DCS / "MissionEditor/data/NewMap/classifier.lua")
                           .read_text(encoding="utf-8", errors="replace"), re.M))
    roots = [DCS / "CoreMods", DCS / "Mods"] + [d / "Mods" for d in SAVED.glob("DCS*") if (d / "Mods").is_dir()]
    files = []
    for root in roots:
        for f in sorted(root.rglob("*.lua")):
            try:
                if "mapclasskey" in f.read_text(encoding="utf-8", errors="replace"):
                    files.append(f)
            except OSError:
                pass
    table, skipped, clash, how, lost = {}, 0, 0, {"exécuté": 0, "lu": 0}, []
    for name, key, via in probe(files):
        if via == "sans":
            lost.append(key)
            continue
        how[via] += 1
        k4 = norm(key)
        if not k4 or k4 not in known:
            skipped += 1
            continue
        fam = FAMILY.get(k4)
        if name in table and table[name] != [k4, fam]:
            clash += 1
            print("doublon divergent :", name, table[name], [k4, fam])
        table.setdefault(name, [k4, fam])
    rows = dict(sorted(table.items()))
    body = ",\n".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}" for k, v in rows.items())
    OUT.write_text(
        "/* Généré par tools/build_mapclass.py — ne pas modifier à la main.\n"
        "   Type d'unité DCS → [clé de l'icône de la carte F10, famille du tableau (null : icône\n"
        "   sans famille au tableau)], relevés dans les définitions lisibles de l'installation\n"
        "   (CoreMods, Mods). Les véhicules et navires de base n'y sont pas : leur base est\n"
        "   chiffrée ; l'import les range à leur catégorie (miz.js). */\n"
        f"const MAPCLASS = {{\n{body}\n}};\n"
        "if (typeof module !== 'undefined') module.exports = MAPCLASS;\n",
        encoding="utf-8", newline="\n")
    fams = sum(1 for v in rows.values() if v[1])
    print(f"{len(rows)} types ({fams} à une famille du tableau) ; {how['exécuté']} définitions exécutées, "
          f"{how['lu']} lues au texte ; {skipped} clés inconnues de classifier.lua, {clash} doublons divergents ; "
          f"{len(lost)} fichiers sans définition appariée")
    for f in lost:
        print("  sans définition appariée :", f)


if __name__ == "__main__":
    main()
