/* Écrans de bord par module (lots 27 et 28) : vérifications sans navigateur.
     node tools/test_ecrans.js
   Chaque fichier de ecrans/ est chargé par la page (pas de fichier mort) ; chaque écran
   se dessine, en grand et en vignette, sans exception ni coordonnée non finie, dans un
   boîtier connu ; chaque groupe d'écrans dit son module ; chaque écran est cité dans
   docs/RADAR.md, la table des sources, avec sa page ou sa figure. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

let n = 0, ko = 0;
function ok(cond, msg){ n++; if (!cond){ ko++; console.log('✗ ' + msg); } }

const html = read('index.html');
const loaded = [...html.matchAll(/<script src="(ecrans\/[^"?]+)/g)].map(m => m[1]);
const files = fs.readdirSync(path.join(root, 'ecrans')).filter(f => f.endsWith('.js')).map(f => 'ecrans/' + f);
for (const f of files) ok(loaded.includes(f), `${f} n'est pas chargé par index.html`);
ok(loaded.length >= 8, `seulement ${loaded.length} fichiers d'écrans chargés`);
const iSym = html.indexOf('src="symbols.js'), iBoard = html.indexOf('src="board.js');
for (const f of loaded){
  const i = html.indexOf('src="' + f);
  ok(i > iSym && i < iBoard, `${f} doit se charger après symbols.js et avant board.js`);
}

const box = { console };
vm.createContext(box);
vm.runInContext(read('symbols.js'), box, { filename: 'symbols.js' });
const before = new Set(vm.runInContext('Object.keys(SHAPES)', box));
for (const f of loaded) vm.runInContext(read(f), box, { filename: f });
vm.runInContext('this.__S = SHAPES; this.__G = GROUPS; this.__B = BEZELS;', box);
const S = box.__S, G = box.__G, B = box.__B;

/* un contexte 2D qui accepte tout et refuse les nombres non finis */
let bad = null;
const ctx = new Proxy({}, {
  get(t, k){
    if (k in t) return t[k];
    if (k === 'measureText') return s => ({ width: String(s).length * 6 });
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop(){} });
    if (k === 'getLineDash') return () => [];
    return (...a) => { for (const v of a) if (typeof v === 'number' && !Number.isFinite(v)) bad = bad || `${String(k)}(${a.join(', ')})`; };
  },
  set(t, k, v){ if (typeof v === 'number' && !Number.isFinite(v)) bad = bad || `${String(k)} = ${v}`; t[k] = v; return true; },
});

const screens = Object.entries(S).filter(([, s]) => s.scope);
ok(screens.length >= 35, `seulement ${screens.length} écrans`);
const groupOf = Object.fromEntries(G.map(g => [g[0], g]));
const doc = read('docs/RADAR.md');
for (const [k, s] of screens){
  ok(!!B[s.scope.bez || 'ddi'], `${k} : boîtier inconnu « ${s.scope.bez} »`);
  ok(!!groupOf[s.g] && typeof groupOf[s.g][2] === 'string' && groupOf[s.g][2].length > 0, `${k} : groupe ${s.g} sans module`);
  ok(typeof s.label === 'string' && s.label.length > 0, `${k} : sans nom`);
  for (const mini of [false, true]){
    bad = null;
    try {
      Object.assign(ctx, { lineWidth: .02, strokeStyle: s.col || '#34D399', fillStyle: s.col || '#34D399' });
      s.draw(ctx, { k, s: 1, mini, x: 0, y: 0, a: 0 });
    } catch (e){ bad = 'exception : ' + e.message; }
    ok(!bad, `${k}${mini ? ' (vignette)' : ''} : ${bad}`);
  }
  if (!before.has(k)) ok(doc.includes('`' + k + '`'), `${k} : absent de docs/RADAR.md`);
}
/* les clés d'un fichier de module portent le préfixe du module : jamais une clé reprise */
for (const k of Object.keys(S).filter(k => !before.has(k)))
  ok(/^(fa18|f16|a10|ah64|f14|f15|mf1|su25t)_/.test(k), `${k} : clé sans préfixe de module`);
/* les modules de la palette, dans l'ordre où la page les montre */
const mods = [...new Set(G.filter(g => g[2]).map(g => g[2]))];
ok(mods.join() === 'F/A-18C,F-16C,A-10C II,AH-64D,F-14B,F-15C,Mirage F1,Su-25T', `modules : ${mods.join(', ')}`);

console.log(`${n} vérifications, ${ko} en échec`);
process.exit(ko ? 1 : 0);
