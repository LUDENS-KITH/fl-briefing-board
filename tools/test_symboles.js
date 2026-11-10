/* Bibliothèque OTAN (lot 19) : vérifications sans navigateur.
     node tools/test_symboles.js
   Chaque forme qui porte un code OTAN doit avoir un code que milsymbol sait dessiner, la
   clé de l'icône DCS qu'il reproduit et sa ligne dans docs/SYMBOLES.md. Les familles de
   la carte DCS ajoutées au tableau doivent toutes y être, avec un dessin de repli en
   silhouettes. Aucune forme d'aéronef ou d'unité au sol ne reste sans code sans que la
   table dise pourquoi. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const ms = require(path.join(root, 'vendor', 'milsymbol-3.0.4.js'));

let n = 0, ko = 0;
function ok(cond, msg){ n++; if (!cond){ ko++; console.log('✗ ' + msg); } }

const box = {};
vm.createContext(box);
vm.runInContext(read('symbols.js') + ';this.__S = SHAPES;', box);
const S = box.__S;
const doc = read('docs/SYMBOLES.md');
const rowOf = k => doc.split('\n').find(l => l.startsWith('| `' + k + '` |'));

/* ---------- les codes ---------- */
const coded = Object.keys(S).filter(k => S[k].nato || S[k].natoDraw);
ok(coded.length >= 28, `seulement ${coded.length} formes avec un dessin OTAN`);
for (const k of coded){
  const sh = S[k];
  if (sh.nato){
    const sym = new ms.Symbol(sh.nato, { size: 30 });
    ok(sym.isValid(), `${k} : code ${sh.nato} refusé par milsymbol`);
    ok(/<path|<text/.test(sym.asSVG()), `${k} : milsymbol ne dessine rien pour ${sh.nato}`);
  }
  ok(typeof sh.dcs === 'string' && sh.dcs.length > 0, `${k} : pas de clé d'icône DCS`);
  ok(typeof sh.dir === 'boolean' || !sh.nato, `${k} : flèche de direction non décidée`);
  const row = rowOf(k);
  ok(!!row, `${k} : absente de docs/SYMBOLES.md`);
  if (row){
    if (sh.nato) ok(row.includes('`' + sh.nato + '`'), `${k} : SYMBOLES.md ne cite pas le code ${sh.nato}`);
    ok(row.includes(sh.dcs), `${k} : SYMBOLES.md ne cite pas l'icône DCS ${sh.dcs}`);
  }
}

/* ---------- les familles de la carte DCS ---------- */
const FAMILIES = ['attack', 'cargo', 'recon', 'attack_helo', 'ifv', 'artillery', 'mlrs', 'truck', 'aaa',
                  'sam_short', 'sam_med', 'sam_long', 'cp', 'ew', 'sub'];
for (const k of FAMILIES){
  const sh = S[k];
  ok(!!sh, `famille DCS absente : ${k}`);
  if (!sh) continue;
  ok(sh.natoOnly === true, `${k} : devrait n'être dans la palette qu'en OTAN`);
  ok(!!S[sh.like] && typeof sh.draw === 'function', `${k} : pas de dessin de repli en silhouettes (${sh.like})`);
  ok(typeof sh.silTag === 'string' && sh.silTag.length > 0, `${k} : pas de repère écrit en silhouettes`);
  ok(sh.g === 'air' || sh.g === 'sol', `${k} : groupe de palette ${sh.g}`);
}

/* ---------- ce qui reste sans code est dit ---------- */
const WITHOUT = { airport: 'Aéroport' };
for (const k of Object.keys(S).filter(k => (S[k].g === 'air' || S[k].g === 'sol') && !S[k].nato && !S[k].natoDraw)){
  ok(k in WITHOUT, `${k} : aéronef ou unité sans code OTAN, et la table ne dit pas pourquoi`);
  if (k in WITHOUT) ok(doc.includes('**' + WITHOUT[k] + '**'), `${k} : SYMBOLES.md ne dit pas pourquoi il reste sans code`);
}
for (const k of Object.keys(S).filter(k => S[k].g === 'tac' || S[k].g === 'arm'))
  ok(!S[k].nato && !S[k].natoDraw, `${k} : marqueur tactique ou armement avec un code — SYMBOLES.md dit qu'ils gardent leur dessin`);

console.log(`${n} vérifications, ${ko} en échec`);
process.exit(ko ? 1 : 0);
