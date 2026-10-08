/* Référencement : ce que lit un moteur de recherche ou un aperçu de partage (lots 14 et 15).
   node tools/test_seo.js              → les fichiers du dépôt
   node tools/test_seo.js <adresse>    → en plus, les pages servies à cette adresse (GitHub Pages)
   Toutes les adresses absolues partent d'une seule base : changer de domaine, c'est
   changer BASE et relancer ce test. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://ludens-kith.github.io/fl-briefing-board/';
const PAGES = { app: 'index.html', fr: 'fr/index.html', en: 'en/index.html' };
const INTERNES = ['docs/PLAN.md', 'docs/ETAT.md', 'docs/MODELE.md', 'docs/RADAR.md', 'docs/DEVELOPPER.md', 'docs/VISIBILITE.md'];

let n = 0, ko = 0;
const ok = (cond, msg) => { n++; if (!cond){ ko++; console.log('✗ ' + msg); } };
const read = f => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };
const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
const meta = (html, key) => attr(html, new RegExp(`<meta\\s+(?:name|property)="${key}"\\s+content="([^"]*)"`));
const canon = html => attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/);
const fromBase = url => url.startsWith(BASE) ? url.slice(BASE.length) : null;
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/* une adresse de la base désigne un fichier du dépôt : `x/` → x/index.html, x.html → x.md */
function exists(rel){
  const f = rel === '' || rel.endsWith('/') ? rel + 'index.html' : rel;
  return [f, f.replace(/\.html$/, '.md')].some(c => fs.existsSync(path.join(ROOT, c)));
}

/* un lien relatif d'une page du dépôt : dossier → son index.html, fichier → lui-même */
function linkOk(file, href){
  const h = href.split(/[?#]/)[0], dir = h === '' || h.endsWith('/') || /(^|\/)\.\.?$/.test(h);
  const p = path.posix.normalize(path.posix.join(path.posix.dirname(file), h)).replace(/^\.\/?$/, '').replace(/\/$/, '');
  return exists(dir ? (p ? p + '/' : '') : p);
}

function common(file, html, { lang, url }){
  ok(attr(html, /<html\s+lang="([^"]+)"/) === lang, `${file} : langue « ${attr(html, /<html\s+lang="([^"]+)"/)} », attendue ${lang}`);
  const title = attr(html, /<title>([^<]*)<\/title>/) || '';
  ok(/FL Briefing Board/.test(title) && /DCS World/.test(title), `${file} : titre « ${title} »`);
  const d = decode(meta(html, 'description') || '');
  ok(d.length >= 50 && d.length <= 160, `${file} : description de ${d.length} caractères (50 à 160)`);
  ok(canon(html) === url, `${file} : canonique ${canon(html)}, attendue ${url}`);
  ok(meta(html, 'og:url') === url, `${file} : og:url ${meta(html, 'og:url')}`);
  ok(!!meta(html, 'og:title') && !!meta(html, 'og:description'), `${file} : og:title ou og:description absent`);
  const img = meta(html, 'og:image') || '';
  ok(fromBase(img) !== null && exists(fromBase(img)), `${file} : image de partage ${img || 'absente'}`);
  ok(meta(html, 'twitter:card') === 'summary_large_image', `${file} : twitter:card ${meta(html, 'twitter:card')}`);
  for (const [, u] of html.matchAll(/(?:href|src|content)="(https?:\/\/[^"]*github\.io[^"]*)"/g))
    ok(u.startsWith(BASE), `${file} : adresse hors de la base ${u}`);
  for (const [, h] of html.matchAll(/(?:href|src)="([^"#:]+)(?:#[^"]*)?"/g))
    if (!h.startsWith('//')) ok(linkOk(file, h), `${file} : lien local cassé ${h}`);
}

/* ---------- le tableau ---------- */
const app = read(PAGES.app);
common(PAGES.app, app, { lang: 'fr', url: BASE });
const ns = (app.match(/<noscript>([\s\S]*?)<\/noscript>/) || [, ''])[1];
ok(ns.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length > 150, `index.html : texte sans script de ${ns.length} caractères`);
ok(/href="fr\/"/.test(app) && /href="en\/"/.test(app), 'index.html : pas de lien vers les pages de présentation');

/* ---------- les pages de présentation ---------- */
for (const [lang, file, html_lang] of [['fr', PAGES.fr, 'fr'], ['en', PAGES.en, 'en']]){
  const html = read(file);
  ok(html.length > 0, `${file} absent`);
  if (!html) continue;
  common(file, html, { lang: html_lang, url: BASE + lang + '/' });
  const alt = {};
  for (const [, l, h] of html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)) alt[l] = h;
  ok(alt.fr === BASE + 'fr/' && alt.en === BASE + 'en/' && alt['x-default'] === BASE + 'en/', `${file} : hreflang ${JSON.stringify(alt)}`);
  let ld = null;
  try { ld = JSON.parse((html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1]); } catch {}
  ok(ld && ld['@type'] === 'SoftwareApplication' && ld.name === 'FL Briefing Board' && ld.url === BASE
     && ld.offers && String(ld.offers.price) === '0' && ld.applicationCategory && ld.operatingSystem
     && ld.publisher && ld.publisher.name === 'LK Studio', `${file} : données structurées ${JSON.stringify(ld)}`);
  ok(/href="\.\.\/"/.test(html) && /href="\.\.\/\?demo"/.test(html), `${file} : boutons vers le tableau et la démo`);
  ok(/Eagle Dynamics/.test(html), `${file} : mention de non-affiliation absente`);
  ok(/<h1[\s>]/.test(html) && (html.match(/<h1[\s>]/g) || []).length === 1, `${file} : un seul titre h1`);
  for (const [, a] of html.matchAll(/<img\b([^>]*)>/g))
    ok(/\balt="/.test(a) &&/\bwidth="\d+"/.test(a) && /\bheight="\d+"/.test(a), `${file} : image sans alt ou sans dimensions ${a.trim().slice(0, 60)}`);
}

/* ---------- plan du site, robots, guides ---------- */
const sm = read('sitemap.xml');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const want of ['', 'fr/', 'en/', 'docs/GUIDE.html', 'docs/GUIDE.en-US.html'])
  ok(locs.includes(BASE + want), `sitemap.xml : ${BASE + want} absent`);
for (const l of locs) ok(fromBase(l) !== null && exists(fromBase(l)), `sitemap.xml : ${l} ne désigne aucun fichier`);
ok(!locs.some(l => /demo/.test(l)), 'sitemap.xml : la démo ne doit pas y être');
ok(read('robots.txt').includes('Sitemap: ' + BASE + 'sitemap.xml'), 'robots.txt : ligne Sitemap absente');

const cfg = read('_config.yml');
ok(/^title:\s*FL Briefing Board\s*$/m.test(cfg), '_config.yml : titre');
ok(/^lang:\s*fr\s*$/m.test(cfg), '_config.yml : langue');
ok(/^image:\s*\/assets\/readme\/apercu-social\.png\s*$/m.test(cfg), '_config.yml : image de partage');
for (const f of INTERNES){
  ok(fs.existsSync(path.join(ROOT, f)), `${f} n'existe plus`);
  ok(new RegExp(`path:\\s*"${f.replace(/\./g, '\\.')}"[\\s\\S]{0,80}noindex:\\s*true`).test(cfg), `_config.yml : ${f} pas en noindex`);
}
ok(/page\.noindex/.test(read('_includes/head-custom.html')), '_includes/head-custom.html : balise noindex absente');

/* ---------- les pages servies ---------- */
(async () => {
  const site = process.argv[2];
  if (site){
    const get = async u => { try { const r = await fetch(u, { redirect: 'follow' }); return { s: r.status, t: r.headers.get('content-type') || '', b: await r.text() }; } catch (e){ return { s: 0, t: '', b: '' }; } };
    const u = rel => site.replace(/\/?$/, '/') + rel;
    for (const rel of ['', 'fr/', 'en/', 'sitemap.xml', 'docs/GUIDE.html', 'docs/GUIDE.en-US.html']){
      const r = await get(u(rel)); ok(r.s === 200, `servi : ${rel || '/'} répond ${r.s}`);
    }
    const g = await get(u('docs/GUIDE.html'));
    ok(!/name="robots"\s+content="noindex"/.test(g.b), 'servi : le guide est en noindex');
    ok(/property="og:image"\s+content="https?:[^"]+apercu-social\.png"/.test(g.b), 'servi : le guide sans image de partage');
    ok(/<meta property="og:site_name" content="FL Briefing Board"/.test(g.b), 'servi : nom du site du guide');
    const p = await get(u('docs/PLAN.html'));
    ok(/name="robots"\s+content="noindex"/.test(p.b), 'servi : PLAN indexable');
    const im = await fetch(BASE + 'assets/readme/apercu-social.png').catch(() => null);
    ok(im && im.status === 200 && /image\/png/.test(im.headers.get('content-type')), 'servi : image de partage');
  }
  console.log(`${n} vérifications, ${ko} en échec`);
  process.exit(ko ? 1 : 0);
})();
