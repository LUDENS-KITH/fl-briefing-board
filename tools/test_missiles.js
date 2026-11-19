/* Onglet « Missiles » (lot 30) : vérifications sans navigateur.
     node tools/test_missiles.js
   La table missiles.js dit le guidage de chaque missile air-air de DCS en Fox 1, 2 ou 3 ;
   ce qui vient du jeu doit être ce que déclare son fichier (tools/data/missiles_dcs.tsv,
   relevé par tools/build_missiles.py), et chaque missile a sa vignette dans la palette,
   rangée sous son Fox, dans l'onglet Missiles. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

let n = 0, ko = 0;
function ok(cond, msg){ n++; if (!cond){ ko++; console.log('✗ ' + msg); } }

const { MISSILES } = require(path.join(root, 'missiles.js'));
const FOX = { 6: 1, 1: 2, 2: 3 };

/* ---------- la table ---------- */
ok(Array.isArray(MISSILES) && MISSILES.length >= 50, `seulement ${MISSILES && MISSILES.length} missiles`);
const names = MISSILES.map(m => m[0]);
ok(new Set(names).size === names.length, 'un missile en double');
for (const [nom, fox, src] of MISSILES){
  ok([1, 2, 3].includes(fox), `${nom} : Fox ${fox}`);
  ok(src === 'jeu' || src === 'désignation', `${nom} : source « ${src} »`);
}
const fox = nom => (MISSILES.find(m => m[0] === nom) || [])[1];
for (const [nom, f] of [['AIM-7M', 1], ['R-27ER', 1], ['S530D', 1], ['AIM-9M', 2], ['AIM-9X', 2], ['R-27ET', 2],
                         ['R550 Magic 2', 2], ['AIM-120C', 3], ['AIM-54C-Mk60', 3], ['SD-10A', 3],
                         ['R-73', 2], ['R-77', 3], ['MICA IR', 2], ['MICA EM', 3]])
  ok(fox(nom) === f, `${nom} : Fox ${fox(nom)}, attendu Fox ${f}`);
ok(!names.includes('RIM-7M'), 'le Sea Sparrow (lancé d’un navire) est dans la palette air-air');

/* ce qui vient du jeu est ce que son fichier déclare */
const tsv = read('tools/data/missiles_dcs.tsv').trim().split('\n').slice(1).map(l => l.split('\t'));
const declared = new Map(tsv.map(([, user, head]) => [user, FOX[+head]]));
const RENOMME = { 'PL-12': 'PL-12 AAM', 'SD-10A': 'SD-10A AAM' };
for (const [nom, f, src] of MISSILES.filter(m => m[2] === 'jeu')){
  const d = declared.get(RENOMME[nom] || nom);
  ok(d === f, `${nom} : Fox ${f} dans la table, Fox ${d} déclaré par le jeu`);
}
ok(MISSILES.filter(m => m[2] === 'jeu').length >= 45, 'moins de 45 missiles classés par les fichiers du jeu');

/* ---------- la palette ---------- */
const box = { console };
vm.createContext(box);
vm.runInContext(read('missiles.js'), box, { filename: 'missiles.js' });
vm.runInContext(read('symbols.js') + ';this.__S = SHAPES; this.__G = GROUPS;', box, { filename: 'symbols.js' });
const S = box.__S, G = box.__G;
for (const f of [1, 2, 3]){
  const g = G.find(r => r[0] === 'fox' + f);
  ok(!!g, `groupe Fox ${f} absent de la palette`);
  if (g){
    ok(g[3] === 'missiles', `Fox ${f} : pas dans l'onglet Missiles (${g[3]})`);
    ok(new RegExp('^Fox ' + f + ' · ').test(g[1]), `Fox ${f} : titre « ${g[1]} »`);
  }
}
const shapes = Object.entries(S).filter(([, s]) => /^fox[123]$/.test(s.g));
ok(shapes.length === MISSILES.length, `${shapes.length} vignettes de missiles pour ${MISSILES.length} missiles`);
for (const [nom, f] of MISSILES){
  const e = shapes.find(([, s]) => s.label === nom);
  ok(!!e, `${nom} : pas de vignette`);
  if (!e) continue;
  const [k, s] = e;
  ok(s.g === 'fox' + f, `${nom} : rangé sous ${s.g}, attendu fox${f}`);
  ok(s.fox === f && s.tag === nom && s.proper === true, `${nom} : fox ${s.fox}, étiquette ${s.tag}, nom propre ${s.proper}`);
  ok(typeof s.draw === 'function' && !s.nato, `${nom} : dessin`);
  ok(/^msl_[a-z0-9_]+$/.test(k), `${nom} : clé ${k}`);
}
/* le dessin passe sans erreur, en grand et en vignette */
const calls = [];
const ctx = new Proxy({}, { get: (t, p) => p in t ? t[p] : (...a) => { calls.push(p); return { width: 10 }; },
                            set: (t, p, v) => { t[p] = v; return true; } });
let drawn = 0;
for (const [, s] of shapes){ try { s.draw(ctx, {}); drawn++; } catch (e){ ok(false, `${s.label} : ${e.message}`); } }
ok(drawn === shapes.length && calls.includes('fillText'), 'le chiffre du Fox n’est pas écrit sur le missile');

console.log(`${n} vérifications, ${ko} en échec`);
if (ko) process.exit(1);
