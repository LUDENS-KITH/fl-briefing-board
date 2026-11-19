"""Table des missiles air-air et de leur guidage, lue dans les fichiers de DCS (lot 30).

    python tools/build_missiles.py ["C:/Program Files/Eagle Dynamics/DCS World"]

Chaque fichier d'armement lisible de l'installation (CoreMods, Mods) est exécuté dans un
bac à sable Lua (lupa) : ses `declare_weapon` et ses tables sont relevés. Un missile
air-air est une arme dont `wsTypeOfWeapon` a pour troisième niveau `wsType_AA_Missile`
(7, Scripts/Database/wsTypes.lua). Son autodirecteur, `Head_Type`, donne sa catégorie
dans la phraséologie des pilotes :
    6  radar semi-actif  → Fox 1 (l'avion éclaire la cible jusqu'à l'impact)
    1  infrarouge        → Fox 2
    2  radar actif       → Fox 3
Rien d'autre ne fait foi : un missile dont le jeu ne déclare pas l'autodirecteur dans un
fichier lisible n'est pas classé par ce script (voir MISSILES_HORS_FICHIERS dans
missiles.js, et docs/PLAN.md, lot 30).

Écrit tools/data/missiles_dcs.tsv (nom interne, nom affiché, Head_Type, fichier), puis
missiles.js à la racine : la palette « Missiles » du tableau.

    python tools/build_missiles.py --js    réécrit missiles.js depuis le .tsv, sans DCS
"""
import csv, json, os, sys
from pathlib import Path
from lupa import LuaRuntime

ROOT = Path(__file__).resolve().parent.parent
DCS = Path(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1] != '--js' else Path(r"C:\Program Files\Eagle Dynamics\DCS World")
FOX = {6: 1, 1: 2, 2: 3}

# Lancés d'un navire ou du sol : pas dans la palette des missiles air-air.
EXCLUS = {'RIM-7M'}
# Noms affichés par le jeu, raccourcis pour la palette.
RENOMME = {'PL-12 AAM': 'PL-12', 'SD-10A AAM': 'SD-10A'}
# Missiles air-air du jeu dont la fiche est dans la base chiffrée : aucun fichier lisible
# ne déclare leur autodirecteur. Classés d'après leur désignation dans
# Scripts/Database/wsTypes.lua (commentaire du jeu entre guillemets) et la lettre de la
# désignation russe (R : radar semi-actif, T : infrarouge).
DESIGNATION = [
    ('MICA IR', 2, 'MICA_T « MICA, IR »'),
    ('MICA EM', 3, 'MICA_R « MICA, AR » (radar actif)'),
    ('R-77', 3, 'P_77 « P-77 (PBB-AE) » : AE, autodirecteur actif'),
    ('R-73', 2, 'P_73 « AA-11 Archer », combat rapproché : autodirecteur infrarouge'),
    ('R-24R', 1, 'P_24R : R, radar semi-actif'),
    ('R-24T', 2, 'P_24T : T, infrarouge'),
    ('R-40R', 1, 'P_40R : R, radar semi-actif'),
    ('R-40T', 2, 'P_40T : T, infrarouge'),
    ('R-33', 1, 'P_33E « AA-9 Amos », longue portée : radar semi-actif'),
]

SANDBOX = r'''
local real = {}
local P
local function proxy() return P end
P = setmetatable({}, {
  __index = function(_, k) if type(k) == 'number' then return nil end return P end,
  __newindex = function() end,
  __call = proxy, __add = proxy, __sub = proxy, __mul = proxy, __div = proxy, __mod = proxy,
  __pow = proxy, __unm = proxy, __len = function() return 0 end,
  __concat = function() return '?' end, __tostring = function() return '?' end,
  __lt = function() return false end, __le = function() return false end,
})
local function loadenv(path, env)
  local h = io.open(path, 'rb'); if not h then return nil, 'absent' end
  local src = h:read('a'); h:close()
  return load(src, '@' .. path, 't', env)
end
return function(wstypes_path, file, dir)
  local found = {}
  local env = {}
  local G = _G
  setmetatable(env, { __index = function(_, k)
    local v = G[k]; if v ~= nil then return v end
    return P end })
  env._ = function(s) return s end
  env.declare_weapon = function(t) found[#found + 1] = t; return t end
  env.declare_missile = env.declare_weapon
  env.declare_loadout = function(t) return t end
  env.current_mod_path = dir
  env.dofile = function(p)
    local f = loadenv(tostring(p), env) or loadenv(dir .. '/' .. tostring(p), env)
    if not f then return P end
    local ok, r = pcall(f); return ok and r or P end
  env.require = function() return P end
  local function deep(dst, src)               -- copy_recursive du jeu : src recopié dans dst
    if type(dst) ~= 'table' or type(src) ~= 'table' then return dst end
    for k, v in pairs(src) do
      if type(v) == 'table' then
        if type(rawget(dst, k)) ~= 'table' then rawset(dst, k, {}) end
        deep(dst[k], v)
      else rawset(dst, k, v) end
    end
    return dst
  end
  env.copy_recursive = deep
  env.copyTable = deep

  env.loadfile = function(p) return loadenv(tostring(p), env) end
  local w = loadenv(wstypes_path, env); if w then pcall(w) end
  local f, err = loadenv(file, env)
  if not f then return found, 'illisible : ' .. tostring(err) end
  local ok, e = pcall(f)
  -- les tables rangées dans l'environnement, déclarées ou non
  local seen = {}
  local function walk(t, depth)
    if type(t) ~= 'table' or seen[t] or t == P or depth > 4 then return end
    seen[t] = true
    if rawget(t, 'Head_Type') ~= nil then found[#found + 1] = t end
    for _, v in pairs(t) do walk(v, depth + 1) end
  end
  for k, v in pairs(env) do if k ~= '_G' then walk(v, 0) end end
  return found, ok and '' or tostring(e)
end
'''


def lua_files():
    for base in (DCS / 'CoreMods', DCS / 'Mods'):
        for p in base.rglob('*.lua'):
            try:
                txt = p.read_bytes()
            except OSError:
                continue
            if b'Head_Type' in txt:
                yield p


def write_js(tsv):
    rows = list(csv.DictReader(open(tsv, encoding='utf-8'), delimiter='	'))
    table, seen = [], set()
    for r in rows:
        name = RENOMME.get(r['user_name'], r['user_name'])
        head = int(r['Head_Type'])
        if name in EXCLUS or head not in FOX or name in seen:
            continue
        seen.add(name)
        table.append((name, FOX[head], 'jeu'))
    for name, fox, why in DESIGNATION:
        if name in seen:
            sys.exit(f'{name} est maintenant lisible dans les fichiers du jeu : le retirer de DESIGNATION')
        seen.add(name)
        table.append((name, fox, 'désignation'))
    table.sort(key=lambda t: (t[1], t[0].lower()))
    lines = [f'  [{json.dumps(n, ensure_ascii=False)}, {f}, {json.dumps(s, ensure_ascii=False)}],' for n, f, s in table]
    NL, Q = chr(10), chr(39)
    head = ['/* Généré par tools/build_missiles.py — ne pas modifier à la main.',
            '   Les missiles air-air de DCS et leur guidage, dans la phraséologie des pilotes :',
            '   Fox 1 radar semi-actif, Fox 2 infrarouge, Fox 3 radar actif. [nom, Fox, source] :',
            '   « jeu » = l' + Q + 'autodirecteur (Head_Type) déclaré par un fichier lisible de',
            '   l' + Q + 'installation (tools/data/missiles_dcs.tsv) ; « désignation » = fiche chiffrée,',
            '   classé d' + Q + 'après sa désignation dans le jeu (voir DESIGNATION dans le script). */']
    js = NL.join(head + ['const MISSILES = ['] + lines + ['];',
                 'if (typeof module !== ' + Q + 'undefined' + Q + ') module.exports = { MISSILES };', ''])
    open(ROOT / 'missiles.js', 'w', encoding='utf-8', newline=NL).write(js)
    print(f'{len(table)} missiles écrits dans missiles.js')


def main():
    if '--js' in sys.argv:
        return write_js(ROOT / 'tools' / 'data' / 'missiles_dcs.tsv')
    lua = LuaRuntime(unpack_returned_tuples=True)
    run = lua.execute(SANDBOX)
    wst = str(DCS / 'Scripts' / 'Database' / 'wsTypes.lua')
    rows, seen = [], set()
    for p in sorted(lua_files()):
        found, err = run(wst, str(p), str(p.parent))
        if err:
            print(f'  {p.relative_to(DCS)} : arrêté en cours de lecture ({err[:90]})')
        for t in found.values():
            ws = t['wsTypeOfWeapon']
            if not (lua.eval('type')(ws) == 'table' and ws[3] == 7):
                continue
            head = t['Head_Type']
            if not isinstance(head, (int, float)):
                continue
            name = t['name'] if isinstance(t['name'], str) else ''
            shown = t['user_name'] if isinstance(t['user_name'], str) else (t['display_name'] if isinstance(t['display_name'], str) else name)
            key = (name, shown)
            if not name or key in seen:
                continue
            seen.add(key)
            rows.append((name, shown, int(head), p.relative_to(DCS).as_posix()))
    out = ROOT / 'tools' / 'data' / 'missiles_dcs.tsv'
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f, delimiter='\t', lineterminator='\n')
        w.writerow(['name', 'user_name', 'Head_Type', 'fichier'])
        for r in sorted(rows, key=lambda r: r[1].lower()):
            w.writerow(r)
    by = {}
    for r in rows:
        by[FOX.get(r[2], 'autre')] = by.get(FOX.get(r[2], 'autre'), 0) + 1
    print(f'{len(rows)} missiles air-air relevés : ' + ', '.join(f'Fox {k} : {v}' if k != 'autre' else f'autre : {v}' for k, v in sorted(by.items(), key=str)))
    write_js(out)


if __name__ == '__main__':
    main()
