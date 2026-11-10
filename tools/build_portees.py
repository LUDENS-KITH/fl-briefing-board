"""Table des portées des défenses aériennes, relevée dans DCS (lot 25).

    python tools/build_portees.py "<Saved Games>/DCS/Logs/fl_portees.tsv"

Le fichier vient de tools/portees_probe.lua, posé une fois dans les Hooks de DCS : il
contient, pour chaque type que le jeu connaît, les champs `ThreatRange`,
`ThreatRangeMin` et `DetectionRange` de sa fiche — les rayons des cercles que l'éditeur
de mission et la carte F10 dessinent. Rien d'autre ne fait foi : pas de site, pas de
wiki, pas la portée du missile (une autre grandeur : 46 km pour le 9M38M1 du Buk, que
l'encyclopédie du jeu engage de 3 à 35 km).

Écrit portees.js à la racine : type → [portée max., portée min., détection], en mètres,
0 quand le jeu ne donne rien. Refuse un fichier vide ou une valeur hors de toute
vraisemblance (au-delà de 500 km).
"""
import csv, io, json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
MAX_M = 500_000


def read(path):
    text = open(path, encoding='utf-8-sig', errors='strict').read()
    rows = list(csv.DictReader(io.StringIO(text), delimiter='\t'))
    out = {}
    for r in rows:
        t = (r.get('type') or '').strip()
        if not t:
            continue
        vals = []
        for k in ('ThreatRange', 'ThreatRangeMin', 'DetectionRange'):
            v = (r.get(k) or '').strip()
            n = int(v) if v else 0
            if not 0 <= n <= MAX_M:
                sys.exit(f'{t} : {k} = {n} m, hors de toute vraisemblance — relevé à refaire')
            vals.append(n)
        if vals[0] or vals[2]:
            out[t] = vals
    return out


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    table = read(sys.argv[1])
    if not table:
        sys.exit('aucune portée dans le relevé : DCS a-t-il atteint le menu principal ?')
    lines = [f'  {json.dumps(t)}: {json.dumps(v)},' for t, v in sorted(table.items(), key=lambda kv: kv[0].lower())]
    js = ('/* Généré par tools/build_portees.py — ne pas modifier à la main.\n'
          '   Type d\'unité DCS → [portée max. d\'engagement, portée min., portée de détection],\n'
          '   en mètres (0 : le jeu ne donne rien), lus dans DCS par tools/portees_probe.lua :\n'
          '   les rayons des cercles de l\'éditeur de mission et de la carte F10. */\n'
          'const PORTEES = {\n' + '\n'.join(lines) + '\n};\n'
          'if (typeof module !== \'undefined\') module.exports = { PORTEES };\n')
    open(os.path.join(ROOT, 'portees.js'), 'w', encoding='utf-8', newline='\n').write(js)
    print(f'{len(table)} types écrits dans portees.js')


if __name__ == '__main__':
    main()
