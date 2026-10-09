/* Langue de l'interface (lot 16) : vérifications sans navigateur.
     node tools/test_i18n.js
   Ce qui s'affiche passe par le dictionnaire de i18n.js (clé : le texte français exact).
   Un texte qui lui échappe resterait en français dans l'interface anglaise : ce test le
   cherche dans la page (textes, info-bulles, blocs data-i18n), dans chaque tr() du code,
   dans les noms des formes, des groupes et des théâtres, et refuse un texte écrit en dur
   là où il s'affiche (toast, confirm, alert, prompt, title, textContent, fillText). */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const { EN, pickLang } = require(path.join(root, 'i18n.js'));
const own = k => Object.prototype.hasOwnProperty.call(EN, k);

let n = 0, ko = 0;
function ok(cond, msg){ n++; if (!cond){ ko++; console.log('✗ ' + msg); } }
const norm = s => s.replace(/\s+/g, ' ').trim();
const hasWord = s => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(s);
/* une mesure (« 40 NM ») se lit pareil dans les deux langues */
const neutral = s => /^[\d\s.,]+(NM|km|ft|kt|m)$/.test(s);
/* un littéral JS tel que le moteur le lit (échappements compris) */
const lit = q => Function('"use strict"; return (' + q + ');')();

/* ---------- choix de la langue ---------- */
ok(pickLang('?lang=en', 'fr', ['fr-FR']) === 'en', "l'adresse ?lang=en ne l'emporte pas");
ok(pickLang('?demo&lang=fr', 'en', ['en-US']) === 'fr', "l'adresse ?lang=fr ne l'emporte pas");
ok(pickLang('', 'en', ['fr-FR']) === 'en', 'la langue gardée ne l\'emporte pas sur le navigateur');
ok(pickLang('', null, ['fr-FR', 'en']) === 'fr', 'un navigateur en français ne donne pas le français');
ok(pickLang('', null, ['fr']) === 'fr', 'un navigateur « fr » ne donne pas le français');
ok(pickLang('', null, ['en-GB']) === 'en', 'un navigateur en anglais ne donne pas l\'anglais');
ok(pickLang('', null, ['de-DE']) === 'en', 'un navigateur ni français ni anglais ne donne pas l\'anglais');
ok(pickLang('', 'xx', []) === 'fr', 'sans rien, la langue n\'est pas le français');

/* ---------- la page ---------- */
const html = read('index.html');
const body = html.slice(html.indexOf('<body'), html.indexOf('</body>'));
const pageStrings = [];                                   // [texte, où]
const i18nBlocks = [];
{
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g;
  const stack = [];                                       // [balise, sautée ?]
  let m;
  const skipping = () => stack.some(e => e[1]);
  const VOID = new Set(['img', 'input', 'br', 'meta', 'link', 'hr']);
  while ((m = re.exec(body))){
    if (m[0].startsWith('<!--')) continue;
    if (m[4] !== undefined){
      if (!skipping() && hasWord(m[4]) && !neutral(norm(m[4]))) pageStrings.push([norm(m[4].replace(/&amp;/g, '&')), 'texte']);
      continue;
    }
    const [, close, tag, attrs] = m, t = tag.toLowerCase();
    if (close){ while (stack.length && stack.pop()[0] !== t); continue; }
    const block = /\bdata-i18n="([^"]+)"/.exec(attrs);
    if (block) i18nBlocks.push(block[1]);
    if (!skipping())
      for (const [, a, v] of attrs.matchAll(/\b(title|placeholder|alt|aria-label)="([^"]*)"/g))
        if (hasWord(v)) pageStrings.push([norm(v.replace(/&amp;/g, '&')), a]);
    if (!VOID.has(t) && !attrs.trim().endsWith('/'))
      stack.push([t, !!block || ['script', 'style', 'noscript'].includes(t)]);
  }
}
ok(pageStrings.length > 100, `la page ne rend que ${pageStrings.length} textes : lecture cassée ?`);
for (const [s, where] of pageStrings) ok(own(s), `page (${where}) sans traduction : « ${s} »`);
ok(i18nBlocks.length >= 5, `blocs data-i18n : ${i18nBlocks.length}`);
for (const k of i18nBlocks) ok(own('html:' + k), `bloc data-i18n="${k}" sans traduction (clé html:${k})`);
const title = /<title>([^<]*)<\/title>/.exec(html)[1];
ok(own(title), `titre de la page sans traduction : « ${title} »`);
ok(/<script src="i18n\.js[^"]*"><\/script>\s*<script src="theatres\.js/.test(html), 'i18n.js n\'est pas chargé avant les autres scripts');

/* ---------- le code : chaque tr() a sa traduction ---------- */
const board = read('board.js');
const STR = String.raw`'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\x60(?:\\.|[^\x60\\$])*\x60`;
const trKeys = [];
for (const m of board.matchAll(new RegExp(String.raw`\btr\(\s*(${STR})\s*[,)]`, 'g'))) trKeys.push(lit(m[1]));
/* tr(cond ? 'a' : 'b') : les deux branches, pas la condition */
for (const m of board.matchAll(new RegExp(String.raw`\btr\(([^()]*?\?\s*(?:${STR})\s*:\s*[\s\S]*?)\)`, 'g')))
  for (const q of m[1].matchAll(new RegExp(String.raw`[?:]\s*(${STR})`, 'g'))) trKeys.push(lit(q[1]));
ok(trKeys.length > 90, `seulement ${trKeys.length} tr() trouvés dans board.js : lecture cassée ?`);
for (const k of trKeys) ok(own(k), `board.js : tr() sans traduction : « ${k} »`);
for (const k of ['côté:G', 'côté:D', 'cap:V', 'déclinaison:O']) ok(own(k), `clé à contexte absente : ${k}`);

/* ---------- formes, groupes, théâtres ---------- */
const symbols = read('symbols.js');
const labels = [...symbols.matchAll(/\blabel:\s*('(?:\\.|[^'\\])*')/g)].map(m => lit(m[1]));
ok(labels.length >= 40, `seulement ${labels.length} noms de formes lus`);
for (const s of labels) ok(own(s), `forme sans traduction : « ${s} »`);
const groups = [...symbols.matchAll(/\[\s*'[a-z0-9]+'\s*,\s*('(?:\\.|[^'\\])*')\s*\]/g)].map(m => lit(m[1]));
ok(groups.length >= 6, `seulement ${groups.length} groupes lus`);
for (const s of groups) ok(own(s), `groupe sans traduction : « ${s} »`);
const theatres = JSON.parse(/const THEATRES = (\[[\s\S]*?\]);/.exec(read('theatres.js'))[1]);
for (const t of theatres) ok(own(t.name), `théâtre sans traduction : « ${t.name} »`);

/* ---------- erreurs de miz.js ---------- */
const mizErrors = [...read('miz.js').matchAll(/(?:throw new Error|fail)\(\s*('(?:\\.|[^'\\])*')\s*\)/g)].map(m => lit(m[1]));
ok(mizErrors.length >= 4, `seulement ${mizErrors.length} erreurs lues dans miz.js`);
for (const s of mizErrors) ok(own(s), `miz.js : erreur sans traduction : « ${s} »`);

/* ---------- rien d'écrit en dur là où ça s'affiche ---------- */
const NEUTRE = new Set(['+ phase', 'KNEEBOARD', 'BRIEFING BOARD', 'FL', 'km', 'NM', '×']);
const sinks = [
  new RegExp(String.raw`\b(?:toast|confirm|alert|prompt)\(\s*(${STR})`, 'g'),
  new RegExp(String.raw`\.(?:title|textContent|placeholder)\s*=\s*(${STR})\s*;`, 'g'),
  new RegExp(String.raw`\bfillText\(\s*(${STR})`, 'g'),
  new RegExp(String.raw`\b(?:err|msg):\s*(${STR})`, 'g'),
];
for (const re of sinks) for (const m of board.matchAll(re)){
  const s = m[1].slice(1, -1);
  if (hasWord(s) && !NEUTRE.has(s) && !s.includes('${')) ok(false, `board.js : texte affiché sans tr() : ${m[0].slice(0, 90)}`);
  if (s.includes('${') && /[a-zà-ÿ]{3}/i.test(s.replace(/\$\{[^}]*\}/g, ''))) ok(false, `board.js : gabarit affiché sans tr() : ${m[0].slice(0, 90)}`);
}

/* ---------- le dictionnaire lui-même ---------- */
const slots = s => [...s.matchAll(/\{(\d+)\}/g)].map(m => m[1]).sort().join(',');
for (const [k, v] of Object.entries(EN)){
  ok(typeof v === 'string' && v.length > 0, `traduction vide : « ${k} »`);
  if (!k.startsWith('html:')) ok(slots(k) === slots(v), `valeurs insérées différentes : « ${k} » → « ${v} »`);
  ok(!/[àâçéèêëîïôûùüœ]/i.test(v), `traduction qui garde un accent français : « ${v} »`);
}
/* une clé que plus rien n'affiche est du poids mort : elle doit apparaître dans un source */
const sources = ['index.html', 'board.js', 'symbols.js', 'theatres.js', 'miz.js'].map(read).join('\n');
const shown = new Set([...pageStrings.map(p => p[0]), title, ...trKeys, ...labels, ...groups, ...theatres.map(t => t.name), ...mizErrors]);
for (const k of Object.keys(EN)){
  if (k.startsWith('html:')) ok(i18nBlocks.includes(k.slice(5)), `clé ${k} sans bloc data-i18n dans la page`);
  else if (!/^[a-zàâçéèêîôû]+:/.test(k)) ok(shown.has(k) || sources.includes(k), `clé morte : « ${k} »`);
}

console.log(`${n} vérifications, ${ko} en échec`);
process.exit(ko ? 1 : 0);
