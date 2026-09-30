/* FL Briefing Board — moteur du tableau.
   Objets posés, jamais dessinés à la main : on pose, on oriente, on recolore.
   Le briefing se raconte en planches (phases) ; chacune a sa scène, son historique
   et son échelle. */

const stage = document.getElementById('stage');
const cv    = document.getElementById('c');
let   ctx   = cv.getContext('2d');      // réassigné le temps d'un export kneeboard
const ti    = document.getElementById('ti');
const pal   = document.getElementById('pal');
const bar   = document.getElementById('bar');
const tabs  = document.getElementById('tabs');
const KEY     = 'fl-briefing-board-v3';
const OLD_KEY = 'fl-briefing-board-v2';   // relu une fois, pour ne pas perdre un tableau v0.2–v0.4
const SIZE  = 34;                       // demi-taille de référence d'un symbole
/* LK Studio : la signature des exports et la fenêtre « À propos » */
const APP = { version: '1.9.2', studio: 'https://l-k-studio.com', flightledger: 'https://flightledger.io',
              code: 'https://github.com/LUDENS-KITH/fl-briefing-board' };
const SIGNATURE = 'FL Briefing Board · LK Studio · l-k-studio.com';

let objs = [], draft = null, sel = null, drag = null, textTarget = null;
let tool = 'select', symKey = 'fighter', color = '#2F8CFF', width = 4, ls = 'solid', dark = true;
let wpN = 1, nmPx = 0;                  // numéro du prochain waypoint ; pixels par mille nautique
let tb = 1;                             // grossissement des textes : > 1 seulement pendant l'export kneeboard
let bare = false;                       // dessin d'export : sans les aides d'édition (cadre du kneeboard)
let unit = 'nm', measOn = false;        // unité d'affichage des distances ; cotes sur les prochains traits

/* ---------- carte vivante : fond de carte réel, objets accrochés au terrain ----------
   Sans carte, le plan garde son repère écran (cam = null), comme avant. Avec une carte,
   les objets du plan sont rangés en coordonnées terrain : pixels Mercator au zoom de
   référence REF_Z. La caméra dit quel point du terrain est au centre et à quel zoom.
   Les positions suivent la carte ; symboles, textes et épaisseurs gardent leur taille
   à l'écran. Distances et caps viennent de la carte : plus d'étalonnage. */
const REF_Z = 12, WORLD = 256 * 2 ** REF_Z;
let cam = null;                          // { x, y, z } : centre en pixels terrain, zoom
let mapCfg = null;                       // { theatre, style } de la planche montée
let showAF = true;                       // aérodromes DCS par-dessus la carte
let vp = null;                           // taille de vue imposée, le temps d'un export
/* caps magnétiques : la déclinaison saisie pour la planche l'emporte (celle de la
   mission DCS) ; sinon, sur une carte, le modèle magnétique mondial WMM2025 au point
   mesuré ; sans carte ni saisie, elle est inconnue et l'on reste au cap écran */
let headRef = 'true';                    // 'true' caps vrais, 'mag' caps magnétiques
let magDec = null;                       // déclinaison saisie pour la planche (° Est +), null = auto
const x2lon = x => x / WORLD * 360 - 180;
function decimalYear(){
  const d = new Date(), y = d.getFullYear();
  return y + (d - new Date(y, 0, 1)) / (new Date(y + 1, 0, 1) - new Date(y, 0, 1));
}
function declAt(x, y){
  if (magDec !== null && magDec !== undefined) return magDec;
  if (cam && typeof wmmDeclination === 'function')
    return wmmDeclination(y2lat(y), x2lon(x), Math.min(decimalYear(), WMM.until));
  return null;
}
const fmtDecl = d => Math.abs(d).toFixed(1).replace('.', ',') + '° ' + (d >= 0 ? 'E' : 'O');
/* « 6 », « 6,5 », « 6E », « 2W », « 2 O », « -2 » ; vide = automatique ; undefined = illisible */
function parseDecl(v){
  const s = String(v).trim().toUpperCase().replace(',', '.').replace('°', '');
  if (!s) return null;
  const m = s.match(/^([+-]?\d+(?:\.\d+)?)\s*([EWO])?$/);
  if (!m) return undefined;
  let d = +m[1];
  if (m[2] === 'W' || m[2] === 'O') d = -Math.abs(d);
  if (m[2] === 'E') d = Math.abs(d);
  return Math.abs(d) <= 30 ? d : undefined;
}
const lon2x = lon => (lon + 180) / 360 * WORLD;
const lat2y = lat => { const s = Math.sin(lat * Math.PI / 180);
                       return (.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * WORLD; };
const y2lat = y => 180 / Math.PI * Math.atan(Math.sinh(Math.PI * (1 - 2 * y / WORLD)));
/* mètres par pixel terrain à cette latitude : Mercator étire vers les pôles */
const mppAt = y => Math.cos(y2lat(y) * Math.PI / 180) * 2 * Math.PI * 6378137 / WORLD;
/* pixels (du repère des objets) par mille nautique, là où l'on mesure */
const nmAt = y => cam ? 1852 / mppAt(y) : nmPx;
const camK = () => cam ? 2 ** (cam.z - REF_Z) : 1;
const viewSize = () => vp ? [vp.w, vp.h] : [stage.clientWidth, planH()];
function camOff(){
  if (!cam) return [0, 0];
  const k = camK(), [vw, vh] = viewSize();
  return [vw / 2 - cam.x * k, vh / 2 - cam.y * k];
}
const w2s = (x, y) => { const k = camK(), [ox, oy] = camOff(); return [x * k + ox, y * k + oy]; };
const s2w = (x, y) => { const k = camK(), [ox, oy] = camOff(); return [(x - ox) / k, (y - oy) / k]; };
const kv  = () => view === 'm' ? camK() : 1;          // pixels écran par unité de la vue du geste
const toW = (x, y) => view === 'm' ? s2w(x, y) : [x, y];
/* copie d'un objet du plan dans le repère écran, pour le dessiner et le désigner.
   __src garde l'original : les mesures se font toujours sur le terrain. */
function toScreen(o){
  if (!cam || (o.v || 'm') !== 'm') return o;
  const k = camK(), [ox, oy] = camOff(), fx = v => v * k + ox, fy = v => v * k + oy;
  const c = { ...o, __src: o };
  for (const key of ['x', 'x1', 'x2', 'cx']) if (typeof o[key] === 'number') c[key] = fx(o[key]);
  for (const key of ['y', 'y1', 'y2', 'cy']) if (typeof o[key] === 'number') c[key] = fy(o[key]);
  if (o.pts) c.pts = o.pts.map(([x, y]) => [fx(x), fy(y)]);
  if (o.hov) c.hov = [fx(o.hov[0]), fy(o.hov[1])];
  if (o.t === 'img'){ c.w2 = o.w2 * k; c.h2 = o.h2 * k; }
  if (o.t === 'kframe') c.w2 = o.w2 * k;
  return c;
}
/* bascule du plan entre repère écran et repère terrain, sans rien déplacer à l'écran */
function convertPlan(toScreenSpace){
  const k = camK(), [ox, oy] = camOff();
  const fx = toScreenSpace ? v => v * k + ox : v => (v - ox) / k;
  const fy = toScreenSpace ? v => v * k + oy : v => (v - oy) / k;
  const fs = toScreenSpace ? v => v * k : v => v / k;
  for (const o of objs){
    if ((o.v || 'm') !== 'm') continue;
    for (const key of ['x', 'x1', 'x2', 'cx']) if (typeof o[key] === 'number') o[key] = fx(o[key]);
    for (const key of ['y', 'y1', 'y2', 'cy']) if (typeof o[key] === 'number') o[key] = fy(o[key]);
    if (o.pts) o.pts = o.pts.map(([x, y]) => [fx(x), fy(y)]);
    if (o.t === 'img') for (const key of ['w2', 'h2', 'w0', 'h0']) o[key] = fs(o[key]);
    if (o.t === 'kframe') o.w2 = fs(o.w2);
  }
}
function fitCam(b){
  const [s, w, n, e] = b, x0 = lon2x(w), x1 = lon2x(e), y0 = lat2y(n), y1 = lat2y(s);
  const [vw, vh] = viewSize();
  const k = Math.min(vw / ((x1 - x0) * 1.2 || 1), vh / ((y1 - y0) * 1.2 || 1));
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: Math.max(3, Math.min(14, REF_Z + Math.log2(k))) };
}

/* fonds de carte : trois fournisseurs vérifiés depuis un fichier local le 2026-09-18
   (CARTO écarté : il renvoie une image « API KEY REQUIRED » qui se charge très bien) */
const STYLES = {
  topo: { max: 17, attr: '© contributeurs OpenStreetMap · SRTM · style © OpenTopoMap (CC-BY-SA)',
          url: (z, x, y) => `https://${'abc'[(x + y) % 3]}.tile.opentopomap.org/${z}/${x}/${y}.png` },
  sat:  { max: 18, attr: 'Imagerie © Esri, Maxar, Earthstar Geographics',
          url: (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}` },
  osm:  { max: 19, attr: '© contributeurs OpenStreetMap',
          url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png` },
};
const tileCache = new Map();
const ready = im => !!(im && im.complete && im.naturalWidth > 0);
let rafId = 0;
function requestDraw(){ if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; draw(); }); }
function tileImg(style, z, x, y){
  const key = style + '/' + z + '/' + x + '/' + y;
  if (!tileCache.has(key)){
    const im = new Image();
    im.crossOrigin = 'anonymous';            // sans CORS, le canvas ne s'exporterait plus
    im.onload = requestDraw;
    im.onerror = () => tileCache.set(key, null);
    im.src = STYLES[style].url(z, x, y);
    tileCache.set(key, im);
    if (tileCache.size > 900) tileCache.delete(tileCache.keys().next().value);
  }
  return tileCache.get(key);
}
function tileRange(c, w, h){
  const st = STYLES[mapCfg.style] || STYLES.topo;
  const tz = Math.max(1, Math.min(st.max, Math.round(c.z)));
  const ts = 256 * 2 ** (c.z - tz), k = 2 ** (c.z - REF_Z), n = 2 ** tz;
  const ox = w / 2 - c.x * k, oy = h / 2 - c.y * k;
  return { tz, ts, ox, oy,
           x0: Math.max(0, Math.floor(-ox / ts)), x1: Math.min(n - 1, Math.floor((w - ox) / ts)),
           y0: Math.max(0, Math.floor(-oy / ts)), y1: Math.min(n - 1, Math.floor((h - oy) / ts)) };
}
function drawTiles(w, h){
  const R = tileRange(cam, w, h), style = mapCfg.style;
  ctx.save();
  ctx.fillStyle = dark ? '#0A1019' : '#E8EDF2'; ctx.fillRect(0, 0, w, h);
  for (let ty = R.y0; ty <= R.y1; ty++) for (let tx = R.x0; tx <= R.x1; tx++){
    const dx = R.ox + tx * R.ts, dy = R.oy + ty * R.ts, im = tileImg(style, R.tz, tx, ty);
    if (ready(im)){ ctx.drawImage(im, dx, dy, R.ts + .6, R.ts + .6); continue; }
    for (let up = 1; up <= 4 && R.tz - up >= 0; up++){      // en attendant : la tuile parente
      const f = 2 ** up, p = tileCache.get(style + '/' + (R.tz - up) + '/' + (tx >> up) + '/' + (ty >> up));
      if (ready(p)){ const s = 256 / f; ctx.drawImage(p, (tx % f) * s, (ty % f) * s, s, s, dx, dy, R.ts + .6, R.ts + .6); break; }
    }
  }
  if (dark && style !== 'sat'){ ctx.fillStyle = 'rgba(7,11,16,.32)'; ctx.fillRect(0, 0, w, h); }  // voile : les symboles ressortent
  ctx.restore();
}
function preloadTiles(c, w, h){
  const R = tileRange(c, w, h), style = mapCfg.style, waits = [];
  for (let ty = R.y0; ty <= R.y1; ty++) for (let tx = R.x0; tx <= R.x1; tx++){
    const im = tileImg(style, R.tz, tx, ty);
    if (im && !ready(im)) waits.push(new Promise(r => {
      im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); }));
  }
  return Promise.race([Promise.all(waits), new Promise(r => setTimeout(r, 8000))]);
}
/* aérodromes DCS, sous leur nom DCS : c'est ce qui fait de la carte une carte du jeu */
const AF = (typeof AIRFIELDS !== 'undefined' ? AIRFIELDS : [])
  .map(([ti, name, lat, lon]) => ({ ti, name, x: lon2x(lon), y: lat2y(lat) }));
function drawAirfields(w, h){
  if (!showAF || !cam || cam.z < 6) return;
  ctx.save();
  for (const a of AF){
    const [sx, sy] = w2s(a.x, a.y);
    if (sx < -60 || sy < -20 || sx > w + 60 || sy > h + 20) continue;
    ctx.beginPath(); ctx.arc(sx, sy, 5 * tb, 0, 7);
    ctx.fillStyle = '#070B10'; ctx.fill();
    ctx.lineWidth = 2 * tb; ctx.strokeStyle = '#D1A94A'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx - 4 * tb, sy + 2 * tb); ctx.lineTo(sx + 4 * tb, sy - 2 * tb); ctx.stroke();
    if (cam.z >= 7.5) label(ctx, sx, sy + 8 * tb, a.name, '#FFF3D1');
  }
  ctx.restore();
}
function drawAttribution(w){
  const t = (STYLES[mapCfg.style] || STYLES.topo).attr;
  ctx.save();
  ctx.font = '600 ' + 10 * tb + 'px ui-sans-serif, system-ui, sans-serif';
  const tw = ctx.measureText(t).width;
  ctx.fillStyle = 'rgba(7,11,16,.72)'; ctx.fillRect(6, 6, tw + 12, 16 * tb);
  ctx.fillStyle = '#B7C3CF'; ctx.textBaseline = 'middle'; ctx.fillText(t, 12, 6 + 8 * tb);
  ctx.restore();
}
/* zoom autour d'un point de l'écran : ce point du terrain reste sous le curseur */
function zoomAt(sx, sy, dz){
  if (!cam) return;
  const [wx, wy] = s2w(sx, sy);
  cam.z = Math.max(3, Math.min(18, cam.z + Math.max(-.6, Math.min(.6, dz))));
  const k = camK(), [vw, vh] = viewSize();
  cam.x = wx - (sx - vw / 2) / k; cam.y = wy - (sy - vh / 2) / k;
  requestDraw(); saveSoon();
}
let saveT = 0;
function saveSoon(){ clearTimeout(saveT); saveT = setTimeout(commit, 400); }
function syncMapUI(){
  const th = document.getElementById('theatre'), st = document.getElementById('mstyle');
  if (th) th.value = mapCfg ? mapCfg.theatre : '';
  if (st) st.value = mapCfg ? mapCfg.style : st.value || 'topo';
  document.body.classList.toggle('mapped', !!cam);
  const af = document.getElementById('afs'); if (af) af.checked = showAF;
}
function setTheatre(id){
  leaveGesture();
  const th = THEATRES.find(t => t.id === id) || null;
  if (!th && !cam) return;
  snapshot();
  if (!th){ convertPlan(true); cam = null; mapCfg = null; }            // retour au tableau sans carte
  else if (!cam){                                                     // première carte de la planche
    cam = fitCam(th.bounds); convertPlan(false);
    mapCfg = { theatre: id, style: document.getElementById('mstyle').value || 'topo' };
  }
  else { cam = fitCam(th.bounds); mapCfg = { ...mapCfg, theatre: id }; }  // les objets restent sur leur terrain
  sel = null; syncMapUI(); commit();
}


/* ---------- coupe : vue de profil sous la vue de dessus ----------
   Chaque objet porte sa vue : v absent = plan, v = 'p' = coupe. Les objets de la
   coupe vivent dans le repère du panneau (origine en haut à gauche), de hauteur
   fixe : une altitude reste une altitude quand la fenêtre change de taille. */
const PROF_H = 300, PROF_HEAD = 34;     // hauteur du panneau de coupe et de son bandeau
const PROF_L = 56, PROF_TOP = 16, PROF_BOT = 26, PROF_REF_W = 1000;
let split = false;                      // écran partagé plan / coupe
let prof = { ceil: 40000, range: 40 };  // plafond (ft) et largeur (NM) de la planche montée
let view = 'm';                         // vue du geste en cours : 'm' plan, 'p' coupe
const groundY  = () => PROF_H - PROF_BOT;
const altAt    = y  => prof.ceil * (groundY() - y) / (groundY() - PROF_TOP);
const yAt      = ft => groundY() - ft / prof.ceil * (groundY() - PROF_TOP);
const profNmPx = () => (PROF_REF_W - PROF_L) / prof.range;
const planH    = () => split ? Math.max(120, stage.clientHeight - PROF_H - PROF_HEAD) : stage.clientHeight;
const profTop  = () => planH() + PROF_HEAD;
const inView   = o  => (o.v || 'm') === view;
const snapAlt  = y  => yAt(Math.max(0, Math.round(altAt(y) / 500) * 500));
/* altitudes : niveau de vol au-dessus de 18 000 ft (altitude de transition des
   cartes DCS américaines), pieds en dessous */
function altText(ft){
  ft = Math.max(0, Math.round(ft / 100) * 100);
  return ft >= 18000 ? 'FL' + String(ft / 100).padStart(3, '0') : ft.toLocaleString('fr-FR') + ' ft';
}

/* ---------- identité des objets ----------
   Chaque objet porte un `uid`, posé à sa première écriture. « + phase » le garde : c'est
   par lui que l'animation reconnaît un objet d'une planche à l'autre. Une copie
   (Ctrl+D) en reçoit un neuf. */
let uidN = 0;
const newUid = () => 'o' + Date.now().toString(36) + (uidN++).toString(36);
const withUids = list => { for (const o of list) if (!o.uid) o.uid = newUid(); return list; };

/* ---------- historique par instantanés ---------- */
let past = [], future = [];
const snap  = o => ({ ...o, pts: o.pts && o.pts.map(p => p.slice()) });
const state = () => ({ objs: objs.map(snap), wpN, nmPx, prof: { ...prof }, magDec,
                       map: mapCfg && { ...mapCfg }, cam: cam && { ...cam } });
function snapshot(){
  past.push(state());
  if (past.length > 100) past.shift();
  future = [];
}
function restore(from, to){
  if (draft){ draft = null; past.pop(); draw(); return; }   // annuler une zone en cours de tracé
  if (!from.length) return;
  to.push(state());
  const s = from.pop();
  const mapBefore = JSON.stringify(mapCfg || null);
  objs = s.objs; wpN = s.wpN; nmPx = s.nmPx || 0; sel = null;
  if (s.prof) prof = { ...s.prof };
  magDec = s.magDec ?? null;
  /* la caméra n'est rendue que si la carte change : annuler un déplacement de symbole
     ne doit pas faire sauter la vue */
  if (JSON.stringify(s.map || null) !== mapBefore){
    mapCfg = s.map ? { ...s.map } : null; cam = s.cam ? { ...s.cam } : null; syncMapUI();
  }
  commit();
}

/* ---------- planches (phases du briefing) ---------- */
let boards = [], cur = 0;

function stash(){ boards[cur] = { ...boards[cur], objs, wpN, nmPx, prof: { ...prof }, magDec,
                                  map: mapCfg && { ...mapCfg }, cam: cam && { ...cam }, past, future }; }
function load(i){
  cur = i;
  const b = boards[i];
  objs = withUids(b.objs); wpN = b.wpN || 1; nmPx = b.nmPx || 0; past = b.past || []; future = b.future || [];
  prof = b.prof ? { ...b.prof } : { ceil: 40000, range: 40 };
  mapCfg = b.map ? { ...b.map } : null; cam = b.cam ? { ...b.cam } : null;
  magDec = b.magDec ?? null;
  sel = null; draft = null; drag = null;
  syncMapUI();
}
function leaveGesture(){ finishZone(); closeText(true); }

function switchBoard(i){
  if (i === cur || i < 0 || i >= boards.length) return;
  leaveGesture(); stash(); load(i); renderTabs(); commit();
}
/* une nouvelle phase part de la planche affichée : entre « ingress » et « attaque »,
   on déplace les appareils, on ne redessine pas la carte */
function addBoard(){
  leaveGesture(); stash();
  const b = boards[cur];
  let n = boards.length + 1;
  while (boards.some(x => x.name === 'Phase ' + n)) n++;
  boards.splice(cur + 1, 0, { name: 'Phase ' + n, objs: b.objs.map(snap), wpN: b.wpN, nmPx: b.nmPx,
                              prof: { ...b.prof }, map: b.map && { ...b.map }, cam: b.cam && { ...b.cam },
                              magDec: b.magDec ?? null,
                              past: [], future: [] });
  load(cur + 1); renderTabs(); commit();
}
function removeBoard(i){
  if (boards.length < 2 || !confirm(`Supprimer la planche « ${boards[i].name} » ?`)) return;
  stash(); boards.splice(i, 1); load(Math.min(i, boards.length - 1)); renderTabs(); commit();
}
function renameBoard(i){
  const v = prompt('Nom de la planche', boards[i].name);
  if (v && v.trim()){ boards[i].name = v.trim(); renderTabs(); commit(); }
}
function renderTabs(){
  tabs.innerHTML = '';
  boards.forEach((b, i) => {
    const t = document.createElement('button');
    t.className = 'tab' + (i === cur ? ' on' : '');
    t.textContent = b.name;
    t.title = 'Clic : afficher · double-clic : renommer · PgPréc / PgSuiv';
    t.onclick = () => switchBoard(i);
    t.ondblclick = () => renameBoard(i);
    tabs.appendChild(t);
    if (i === cur && boards.length > 1){
      const x = document.createElement('button');
      x.className = 'tab x'; x.textContent = '×'; x.title = 'Supprimer cette planche';
      x.onclick = () => removeBoard(i);
      tabs.appendChild(x);
    }
  });
  const p = document.createElement('button');
  p.className = 'tab add'; p.textContent = '+ phase';
  p.title = 'Nouvelle planche : copie de celle affichée, à faire évoluer';
  p.onclick = addBoard;
  tabs.appendChild(p);
  presentBadge();
}

/* ---------- mise à l'échelle ---------- */
function fit(){
  const r = devicePixelRatio || 1, w = stage.clientWidth, h = stage.clientHeight;
  cv.width = w * r; cv.height = h * r;
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  ctx.setTransform(r, 0, 0, r, 0, 0);
  layout();
  draw();
}
addEventListener('resize', fit);

/* le bandeau de la coupe, les onglets et l'aide suivent la frontière plan / coupe */
function layout(){
  const pb = document.getElementById('profbar'), off = split ? PROF_H + PROF_HEAD : 0;
  pb.style.display = split ? 'flex' : 'none';
  pb.style.top = planH() + 'px';
  tabs.style.bottom = (off + 8) + 'px';
  document.getElementById('hint').style.bottom = (off + 12) + 'px';
  document.getElementById('split').classList.toggle('on', split);
}

/* ---------- rendu ---------- */
const BG = () => dark ? '#070B10' : '#F4F7FA';

/* pendant une transition, on dessine l'état interpolé — objets et caméra — sans rien
   écrire : objs et cam sont rendus aussitôt le dessin fini */
function draw(){
  if (!anim) return drawFrame();
  const k = Math.min(1, (performance.now() - anim.t0) / ANIM_MS);
  if (k >= 1){ anim = null; return drawFrame(); }
  const real = objs, realCam = cam, e = ease(k);
  objs = tweenAt(e);
  if (anim.camA && realCam) cam = { x: anim.camA.x + (realCam.x - anim.camA.x) * e,
                                   y: anim.camA.y + (realCam.y - anim.camA.y) * e,
                                   z: anim.camA.z + (realCam.z - anim.camA.z) * e };
  try { drawFrame(); } finally { objs = real; cam = realCam; }
  requestDraw();
}
function drawFrame(){
  const w = stage.clientWidth, h = planH();
  route = computeRoute();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG();
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.restore();

  ctx.save();                                     // vue de dessus
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  drawPlan(w, h);
  ctx.restore();

  if (split){                                     // coupe ou radar, dans leur propre repère
    ctx.save();
    ctx.translate(0, profTop());
    ctx.beginPath(); ctx.rect(0, 0, w, PROF_H); ctx.clip();
    if (prof.pane) drawRadarPane(w);
    else { drawProfAxes(w); drawPane('p'); drawRoute(w); }
    ctx.restore();
  }
  if (presenting) drawLaser();
  document.getElementById('lock').classList.toggle('on', !!(sel && sel.locked));
  document.getElementById('kframe').classList.toggle('on', objs.some(o => o.t === 'kframe'));
}
function drawPlan(w, h){
  if (cam){ drawTiles(w, h); drawAirfields(w, h); }
  else {
    ctx.save();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,.045)' : 'rgba(10,20,35,.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 24){ ctx.beginPath(); ctx.moveTo(x+.5, 0); ctx.lineTo(x+.5, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 24){ ctx.beginPath(); ctx.moveTo(0, y+.5); ctx.lineTo(w, y+.5); ctx.stroke(); }
    ctx.restore();
  }
  if (split && prof.pane) drawRadarCone();
  drawPane('m');
  if (cam) drawAttribution(w);
}
function drawPane(v){
  for (const o of objs) if ((o.v || 'm') === v) drawObj(toScreen(o));
  if (draft && (draft.v || 'm') === v) drawObj(toScreen(draft));
  if (sel && objs.includes(sel) && (sel.v || 'm') === v) handles(toScreen(sel));
}

/* axes de la coupe : altitudes à gauche, distances au sol, dans l'unité choisie */
function drawProfAxes(w){
  ctx.save();
  ctx.fillStyle = dark ? '#0A1019' : '#EDF1F5'; ctx.fillRect(0, 0, w, PROF_H);
  const step = { 10000: 1000, 20000: 2500, 40000: 5000, 60000: 10000 }[prof.ceil] || prof.ceil / 8;
  ctx.font = '600 ' + 10 * tb + 'px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let ft = 0; ft <= prof.ceil; ft += step){
    const y = yAt(ft);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,.07)' : 'rgba(10,20,35,.09)';
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PROF_L, y + .5); ctx.lineTo(w, y + .5); ctx.stroke();
    ctx.fillStyle = dark ? '#7F8C98' : '#4A5661';
    ctx.fillText(ft === 0 ? 'SOL' : ft >= 18000 ? 'FL' + String(ft / 100).padStart(3, '0')
                                                : ft.toLocaleString('fr-FR'), PROF_L - 6, y);
  }
  ctx.strokeStyle = dark ? '#7F8C98' : '#4A5661'; ctx.lineWidth = 2;   // le sol
  ctx.beginPath(); ctx.moveTo(PROF_L, groundY()); ctx.lineTo(w, groundY()); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(PROF_L, PROF_TOP - 6); ctx.lineTo(PROF_L, groundY()); ctx.stroke();

  const k = unit === 'km' ? KM_PER_NM : 1, pxU = profNmPx() / k;           // pixels par unité
  const span = (w - PROF_L) / pxU;
  const dStep = [1, 2, 5, 10, 20, 25, 50, 100, 200].find(s => span / s <= 10) || 500;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let d = 0; PROF_L + d * pxU < w - 10; d += dStep){
    const x = PROF_L + d * pxU;
    ctx.beginPath(); ctx.moveTo(x, groundY()); ctx.lineTo(x, groundY() + 5); ctx.stroke();
    ctx.fillText(d === 0 ? '0' : d + (PROF_L + (d + dStep) * pxU >= w - 10 ? ' ' + (unit === 'km' ? 'km' : 'NM') : ''),
                 x, groundY() + 8);
  }
  ctx.restore();
}

/* styles de trait : plein = réel, tirets = prévu, pointillés = menace / incertain */
const DASH = { dash: w => [w * 3.2, w * 2.4], dot: w => [.01, w * 2.4] };
const dash = o => ctx.setLineDash(DASH[o.ls] ? DASH[o.ls](o.w || 4) : []);

function drawObj(o){
  ctx.save();
  if (o.__alpha !== undefined) ctx.globalAlpha = o.__alpha;   // transition : il paraît ou disparaît
  ctx.strokeStyle = o.c; ctx.fillStyle = o.c;
  ctx.lineWidth = o.w || 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  if (o.t === 'img'){ if (ready(o.el)) ctx.drawImage(o.el, o.x, o.y, o.w2, o.h2); }

  else if (o.t === 'kframe') drawKFrame(o);

  else if (o.t === 'stroke'){
    dash(o);
    ctx.beginPath(); ctx.moveTo(o.pts[0][0], o.pts[0][1]);
    for (const [x, y] of o.pts) ctx.lineTo(x, y);
    ctx.stroke();
  }
  else if (o.t === 'line' || o.t === 'arrow'){
    dash(o);
    ctx.beginPath(); ctx.moveTo(o.x1, o.y1); ctx.quadraticCurveTo(o.cx, o.cy, o.x2, o.y2);
    ctx.stroke();
    if (o.t === 'arrow') head(o.x2, o.y2, Math.atan2(o.y2 - o.cy, o.x2 - o.cx), o.w);
    if (o.both)          head(o.x1, o.y1, Math.atan2(o.y1 - o.cy, o.x1 - o.cx), o.w);
    if (o.meas)          drawMeasure(o);
  }
  else if (o.t === 'rect'){
    dash(o);
    ctx.strokeRect(Math.min(o.x1,o.x2), Math.min(o.y1,o.y2), Math.abs(o.x2-o.x1), Math.abs(o.y2-o.y1));
  }
  else if (o.t === 'circle'){
    dash(o);
    ctx.beginPath(); ctx.arc(o.x1, o.y1, Math.hypot(o.x2-o.x1, o.y2-o.y1), 0, 7); ctx.stroke();
  }
  else if (o.t === 'text'){
    ctx.font = '600 ' + (13 + o.w * 3) * tb + 'px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(o.s, o.x, o.y);
  }
  else if (o.t === 'zone')  drawZone(o);
  else if (o.t === 'terrain') drawTerrain(o);
  else if (o.t === 'dome')  drawDome(o);
  else if (o.t === 'block') drawBlock(o);
  else if (o.t === 'ruler') drawRuler(o);
  else if (o.t === 'sym')   paintSym(ctx, o);

  ctx.restore();
}

function head(x, y, a, w){
  const h = 9 + w * 2.4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - h * Math.cos(a - .42), y - h * Math.sin(a - .42));
  ctx.lineTo(x - h * Math.cos(a + .42), y - h * Math.sin(a + .42));
  ctx.closePath(); ctx.fill();
}

/* texte détouré : lisible sur une carte chargée comme sur le fond uni */
function label(c, x, y, txt, col, base){
  c.save();
  c.font = '700 ' + 12 * tb + 'px ui-sans-serif, system-ui, sans-serif';
  c.textAlign = 'center'; c.textBaseline = base || 'top';
  c.setLineDash([]); c.lineJoin = 'round';
  c.lineWidth = 4 * tb; c.strokeStyle = BG(); c.strokeText(txt, x, y);
  c.fillStyle = col; c.fillText(txt, x, y);
  c.restore();
}

/* ---------- zones (CAP, engagement, interdite…) ---------- */
function zonePath(pts, closed){
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (closed) ctx.closePath();
}
function drawZone(o){
  const pts = o.hov ? [...o.pts, o.hov] : o.pts;
  if (pts.length < 2){ ctx.beginPath(); ctx.arc(pts[0][0], pts[0][1], 4, 0, 7); ctx.fill(); return; }
  if (pts.length > 2){
    zonePath(pts, true);
    ctx.save(); ctx.globalAlpha = .10; ctx.fill(); ctx.restore();
    ctx.save();                                  // hachures à 45°, découpées par la zone
    zonePath(pts, true); ctx.clip();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    ctx.globalAlpha = .4; ctx.lineWidth = 1.5; ctx.setLineDash([]);
    ctx.beginPath();
    for (let d = 0; d < w + h; d += 11){ ctx.moveTo(x0 + d, y0); ctx.lineTo(x0 + d - h, y0 + h); }
    ctx.stroke();
    ctx.restore();
  }
  zonePath(pts, !o.hov); dash(o); ctx.stroke();
  if (o.hov){                                    // point de départ : là où l'on referme
    ctx.setLineDash([]); ctx.beginPath(); ctx.arc(o.pts[0][0], o.pts[0][1], 6, 0, 7); ctx.stroke();
  }
  if (o.lbl){ const [lx, ly] = zoneLabelAt(o.pts); label(ctx, lx, ly, o.lbl, o.c); }
}
/* l'étiquette d'une zone se place en haut, pas au centre : le centre est justement
   là où l'on pose le SAM, l'AWACS ou l'objectif qui la justifient */
const zoneLabelAt = pts => [pts.reduce((s, p) => s + p[0], 0) / pts.length,
                            Math.min(...pts.map(p => p[1])) + 10];

function zoneClick(x, y){
  if (!draft || draft.t !== 'zone'){
    snapshot(); sel = null;
    draft = { t:'zone', pts:[[x, y]], hov:[x, y], c:color, w:width, ls };
    if (view === 'p') draft.v = 'p';
    draw(); return;
  }
  const p = draft.pts;
  if (p.length >= 3 && near(x, y, p[0][0], p[0][1], 14 / kv())){ finishZone(); return; }
  const last = p[p.length - 1];
  if (!near(x, y, last[0], last[1], 4 / kv())) p.push([x, y]);
  draw();
}
function finishZone(){
  if (!draft || draft.t !== 'zone') return;
  const z = draft; draft = null; delete z.hov;
  if (z.pts.length < 3){ past.pop(); draw(); return; }
  let at = 0;                                   // sous les symboles, au-dessus de la carte
  objs.forEach((o, i) => { if (o.t === 'img' || o.t === 'terrain') at = i + 1; });
  objs.splice(at, 0, z); sel = z;
  commit();
}

/* ---------- objets propres à la coupe ---------- */
/* relief : la crête tracée à main levée, remplie jusqu'au sol */
function drawTerrain(o){
  const p = o.pts;
  ctx.beginPath(); ctx.moveTo(p[0][0], groundY());
  for (const [x, y] of p) ctx.lineTo(x, Math.min(y, groundY()));
  ctx.lineTo(p[p.length - 1][0], groundY()); ctx.closePath();
  ctx.save(); ctx.globalAlpha = .28; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(p[0][0], Math.min(p[0][1], groundY()));
  for (const [x, y] of p) ctx.lineTo(x, Math.min(y, groundY()));
  dash(o); ctx.stroke();
}
/* enveloppe sol-air : demi-ellipse posée au sol, du site jusqu'à son rayon et son plafond */
function domeGeom(o){ return { rx: Math.max(4, Math.abs(o.x2 - o.x1)), ry: Math.max(4, groundY() - o.y2) }; }
function drawDome(o){
  const { rx, ry } = domeGeom(o), g = groundY();
  const path = () => { ctx.beginPath(); ctx.ellipse(o.x1, g, rx, ry, 0, Math.PI, 2 * Math.PI); ctx.closePath(); };
  path(); ctx.save(); ctx.globalAlpha = .10; ctx.fill(); ctx.restore();
  ctx.save(); path(); ctx.clip();                 // hachures, comme les zones du plan
  ctx.globalAlpha = .35; ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.beginPath();
  for (let d = 0; d < 2 * rx + ry; d += 11){ ctx.moveTo(o.x1 - rx + d, g - ry); ctx.lineTo(o.x1 - rx + d - ry, g); }
  ctx.stroke(); ctx.restore();
  path(); dash(o); ctx.stroke();
  label(ctx, o.x1, g - ry - 18, (o.lbl ? o.lbl + ' · ' : '') + altText(altAt(g - ry)) + ' max', o.c);
}
/* bloc d'altitude : une tranche sur toute la largeur, pour étager et séparer */
const blockSpan = o => [Math.min(o.y1, o.y2), Math.max(o.y1, o.y2)];
function drawBlock(o){
  const [t, b] = blockSpan(o), w = stage.clientWidth;
  ctx.save(); ctx.globalAlpha = .12; ctx.fillRect(PROF_L, t, w - PROF_L, b - t); ctx.restore();
  dash(o); ctx.lineWidth = Math.max(1.5, (o.w || 4) / 2);
  ctx.beginPath(); ctx.moveTo(PROF_L, t); ctx.lineTo(w, t); ctx.moveTo(PROF_L, b); ctx.lineTo(w, b); ctx.stroke();
  ctx.save(); ctx.textAlign = 'left';
  label(ctx, PROF_L + 110, t + 3, (o.lbl ? o.lbl + ' · ' : '') + altText(altAt(b)) + ' – ' + altText(altAt(t)), o.c);
  ctx.restore();
}
/* tout ce qui se pose sous les symboles : zones du plan, relief, menaces, blocs */
function insertLow(o){
  let at = 0;
  objs.forEach((x, i) => { if (x.t === 'img' || x.t === 'terrain') at = i + 1; });
  objs.splice(o.t === 'terrain' ? objs.filter(x => x.t === 'img').length : at, 0, o);
}
/* changer le plafond ou la largeur de la coupe recale les objets : une altitude et une
   distance posées restent vraies, seule leur place à l'écran change */
function reprof(ceil, range){
  const g = groundY(), kY = prof.ceil / ceil, kX = prof.range / range;
  const fx = x => PROF_L + (x - PROF_L) * kX, fy = y => g - (g - y) * kY;
  snapshot();
  for (const o of objs){
    if (o.v !== 'p') continue;
    for (const k of ['x', 'x1', 'x2', 'cx']) if (typeof o[k] === 'number') o[k] = fx(o[k]);
    for (const k of ['y', 'y1', 'y2', 'cy']) if (typeof o[k] === 'number') o[k] = fy(o[k]);
    if (o.pts) o.pts = o.pts.map(([x, y]) => [fx(x), fy(y)]);
  }
  prof = { ...prof, ceil, range };
  commit();
}

/* ---------- coupe liée à la route ----------
   La route, ce sont les waypoints de la vue de dessus, dans l'ordre de leurs numéros.
   Rien n'est stocké dans la coupe : la route y est recalculée à chaque dessin, si bien
   que déplacer un waypoint en haut la redessine en bas. Seule l'altitude de chaque
   waypoint (champ alt) est une donnée ; sans valeur, un waypoint reprend celle du
   précédent, et le premier 10 000 ft. */
let route = { pts: [], err: '' }, routeAlt = new Map();
function computeRoute(){
  routeAlt = new Map();
  if (!prof.linked) return { pts: [], err: '' };
  const wps = objs.filter(o => o.t === 'sym' && o.k === 'wp' && (o.v || 'm') === 'm')
                  .sort((a, b) => a.n - b.n);
  let prev = null;
  for (const w of wps){ const alt = w.alt ?? prev ?? 10000; routeAlt.set(w, alt); prev = alt; }
  if (wps.length < 2) return { pts: [], err: 'Posez au moins deux waypoints dans la vue de dessus : la route va de 1 à 2, 3…' };
  if (!cam && !nmPx) return { pts: [], err: 'Étalonnez la vue de dessus (règle, puis Échelle), ou choisissez une carte : sans échelle, pas de distance le long de la route.' };
  let d = 0;
  return { err: '', pts: wps.map((w, i) => {
    if (i) d += Math.hypot(w.x - wps[i - 1].x, w.y - wps[i - 1].y) / nmAt((w.y + wps[i - 1].y) / 2);
    const alt = routeAlt.get(w);
    return { w, nm: d, alt, x: PROF_L + d * profNmPx(), y: yAt(Math.min(alt, prof.ceil)) };
  }) };
}
const routeNm = () => route.pts.length ? route.pts[route.pts.length - 1].nm : 0;
function fmtNm(nm){ return unit === 'km' ? (nm * KM_PER_NM).toFixed(1) + ' km' : nm.toFixed(1) + ' NM'; }
function drawRoute(w){
  if (!prof.linked) return;
  ctx.save();
  if (route.err){
    ctx.font = '600 ' + 12 * tb + 'px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#D1A94A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(route.err, PROF_L + (w - PROF_L) / 2, PROF_TOP + 26);
    ctx.restore(); return;
  }
  const P = route.pts, col = P[0].w.c;
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);
  for (const p of P) ctx.lineTo(p.x, p.y);
  ctx.stroke();
  for (let i = 1; i < P.length; i++){                 // longueur de chaque branche
    const a = P[i - 1], b = P[i];
    tag(fmtNm(b.nm - a.nm), (a.x + b.x) / 2, (a.y + b.y) / 2 + 16 * tb, a.w.c);
  }
  for (const p of P){
    paintSym(ctx, { t:'sym', k:'wp', x:p.x, y:p.y, a:0, s:.8, c:p.w.c, w:3, n:p.w.n, mini:true });
    label(ctx, p.x, p.y - 30 * tb, altText(p.alt) + (p.alt > prof.ceil ? ' ↑' : ''), p.w.c);
  }
  ctx.restore();
}
const routeHit = (x, y) => route.pts.find(p => Math.hypot(p.x - x, p.y - y) < 14) || null;
/* altitude tapée : « FL250 », « 25000 », « 25 000 » */
function parseAlt(v){
  const s = String(v).trim().toLowerCase().replace(/\s|ft|\u202f/g, '');
  const fl = s.match(/^fl(\d{1,3})$/);
  const ft = fl ? +fl[1] * 100 : /^\d+$/.test(s) ? +s : NaN;
  return Number.isFinite(ft) ? Math.max(0, Math.min(60000, ft)) : null;
}
function setLinked(on){
  if (on === !!prof.linked) return;
  if (on){
    /* à l'activation, la largeur s'ouvre assez pour montrer toute la route ;
       reprof() prend l'instantané d'avant : une seule annulation défait les deux */
    prof.linked = true; route = computeRoute(); const need = routeNm(); prof.linked = false;
    const r = need ? ([10, 20, 40, 80, 160].find(v => v >= need * 1.08) || 160) : prof.range;
    if (r !== prof.range){ reprof(prof.ceil, r); prof.linked = true; commit(); return; }
  }
  snapshot();
  prof = { ...prof, linked: on };
  commit();
}

/* ---------- vue radar liée (lot 3) ----------
   Le panneau du bas montre, au choix, la coupe ou l'écran radar d'un porteur. Rien
   n'est stocké : l'écran se recalcule à chaque dessin depuis la vue de dessus
   (radar.js), comme la route liée. Il montre la géométrie ; il ne simule pas la
   détection. */
const RADAR_PAGE = { fa18: 'fa18_tws', f16: 'f16_tws' };
const radarScope = () => SHAPES[RADAR_PAGE[prof.pane]].scope;
/* identité d'une piste du F/A-18C : la couleur du symbole posé, comme la palette la
   nomme — rouge hostile, bleu ami ; toute autre, inconnue */
const hafuFor = c => c === '#FF4D4D' ? 'fa18_hafu_h' : c === '#2F8CFF' ? 'fa18_hafu_f' : 'fa18_hafu_u';

function radarView(){
  const own = objs.find(o => o.own && (o.v || 'm') === 'm');
  if (!own) return { msg: 'Sélectionnez un appareil dans la vue de dessus, puis « Porteur ».' };
  const pxPerNm = cam ? nmAt(own.y) : nmPx;             // rien d'inventé sans échelle
  if (!pxPerNm) return { own, msg: 'Il faut une carte, ou une planche étalonnée (bouton Échelle), pour mesurer les distances.' };
  const sc = radarScope();
  const tgts = objs.filter(o => o !== own && o.t === 'sym' && (o.v || 'm') === 'm' && (SHAPES[o.k] || {}).g === 'air');
  return { own, pxPerNm, ...RADAR.radarPicture(own, tgts,
    { pxPerNm, rangeNm: prof.rrng ?? sc.rng, span: sc.span, cone: sc.cone(prof.raz ?? sc.az) }) };
}

/* l'écran du porteur à gauche, sa lecture à droite */
function drawRadarPane(w){
  const k = RADAR_PAGE[prof.pane], sc = SHAPES[k].scope, v = radarView();
  ctx.save();
  ctx.fillStyle = dark ? '#0A1019' : '#EDF1F5'; ctx.fillRect(0, 0, w, PROF_H);
  const half = PROF_H / 2 - 8, cx = 12 + half, cy = PROF_H / 2;
  /* drawObj, pas paintSym : c'est lui qui pose la couleur du trait */
  drawObj({ t:'sym', k, x:cx, y:cy, a:0, s: half / SIZE, c: SHAPES[k].col, w:4,
            rng: prof.rrng ?? sc.rng, az: prof.raz ?? sc.az });
  const [L, T, R, B] = sc.area;
  const X = f => cx + half * (L + (f + 1) / 2 * (R - L)), Y = f => cy + half * (B - f * (B - T));
  const list = (v.shown || []).slice().sort((p, q) => p.nm - q.nm);
  list.forEach((c, i) => {
    /* F/A-18C : HAFU selon la couleur, tige au cap relatif ; F-16C : piste TWS, qui
       tourne du cap relatif (p. 404) */
    const tk = prof.pane === 'f16' ? 'f16_track' : hafuFor(c.src.c), x = X(c.fx), y = Y(c.fy);
    drawObj({ t:'sym', k:tk, x, y, a:c.rel, s: SHAPES[tk].s0 * half / (SIZE * 4.5), c: SHAPES[tk].col, w:2.5 });
    ctx.fillStyle = SHAPES[tk].col; ctx.font = '700 ' + 10 * tb + 'px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x + 10, y - 9);
  });

  const ink = dark ? '#E6EDF5' : '#0A1019', dim = dark ? '#7F8C98' : '#4A5661', tx = cx + half + 22;
  let ty = 22;
  const line = (txt, col = ink, size = 12, weight = 600) => {
    ctx.fillStyle = col; ctx.font = `${weight} ${size * tb}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, tx, ty); ty += (size + 7) * tb;
  };
  line((prof.pane === 'f16' ? 'F-16C · FCR' : 'F/A-18C · RDR ATTK') + ' · TWS', ink, 13, 700);
  if (v.msg){ line(v.msg, dim); ctx.restore(); return; }
  const azv = prof.raz ?? sc.az;
  line(`Porteur : ${v.own.lbl || SHAPES[v.own.k].label} · échelle ${prof.rrng ?? sc.rng} NM · balayage `
       + (prof.pane === 'f16' ? 'A' + azv : azv + '°'), dim);
  list.slice(0, 8).forEach((c, i) => {
    /* à 0 % affiché, la cible n'est ni chaude ni froide : elle est au travers */
    const o = c.src, az = Math.round(c.az), rad = Math.round(c.radial * 100);
    line(`${i + 1}. ${o.lbl || SHAPES[o.k].label} — ${fmtNm(c.nm)}, ${Math.abs(az)}°${az ? (az < 0 ? ' G' : ' D') : ''}`
         + ` · aspect ${RADAR.aspectText(c)} · ${rad ? (c.hot ? 'chaude' : 'froide') : 'au travers'} · radiale ${rad} %`);
  });
  if (list.length > 8) line(`… et ${list.length - 8} autres`, dim);
  if (!list.length) line('Aucun contact dans le balayage et l\'échelle.', dim);
  const miss = [v.outCone && `${v.outCone} hors balayage`, v.beyond && `${v.beyond} au-delà de l'échelle`].filter(Boolean);
  if (miss.length) line(miss.join(' · '), dim);
  ty = PROF_H - 34;
  line('Radiale : part de sa vitesse le long de la ligne de visée. Proche de 0 % (au travers),', dim, 11, 500);
  line('le filtre Doppler peut rejeter la cible en regard vers le bas (manuel F-16C, p. 391).', dim, 11, 500);
  ctx.restore();
}

/* sur la vue de dessus, le volume balayé par le porteur : son cône, jusqu'à l'échelle */
function drawRadarCone(){
  const v = radarView();
  if (!v.own || !v.pxPerNm) return;
  const sc = radarScope(), o = toScreen(v.own);
  const r = (prof.rrng ?? sc.rng) * v.pxPerNm * camK(), h = (v.own.a || 0) - Math.PI / 2;
  const c = sc.cone(prof.raz ?? sc.az) * Math.PI / 180;
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = SHAPES[RADAR_PAGE[prof.pane]].col;
  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.arc(o.x, o.y, r, h - c, h + c); ctx.closePath();
  ctx.globalAlpha = .1; ctx.fill();
  ctx.globalAlpha = .6; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

/* le bandeau suit la vue du panneau : réglages de la coupe, ou du radar */
function syncPane(){
  const r = !!prof.pane;
  $('pane').value = prof.pane || '';
  $('pcoupe').style.display = r ? 'none' : '';
  $('pradar').style.display = r ? 'flex' : 'none';
  if (!r) return;
  const sc = radarScope(), lab = prof.pane === 'f16' ? a => 'A' + a : a => a + '°';
  $('rrng').value = prof.rrng ?? sc.rng;
  $('raz').innerHTML = sc.azs.map(a => `<option value="${a}">${lab(a)}</option>`).join('');
  $('raz').value = prof.raz ?? sc.az;
}

/* ---------- règle : distance et cap ---------- */
/* une distance d'écran, dite dans l'unité choisie ; en pixels tant que la planche
   n'est pas étalonnée — mieux vaut une unité honnête qu'un chiffre inventé */
const KM_PER_NM = 1.852;
function distText(px, per = nmPx){
  if (!per) return Math.round(px) + ' px';
  const nm = px / per;
  return unit === 'km' ? (nm * KM_PER_NM).toFixed(1) + ' km' : nm.toFixed(1) + ' NM';
}
/* cap du point 1 vers le point 2, nord en haut de l'écran, 001° à 360° */
/* V = vrai (nord géographique d'une carte), M = magnétique ; sans suffixe, c'est le
   haut de l'écran d'une planche sans carte */
function bearing(x1, y1, x2, y2){
  /* V : vrai, sur une carte ; G : grille DCS, sur une mission importée sans carte */
  let b = Math.atan2(x2 - x1, -(y2 - y1)) * 180 / Math.PI, suf = cam ? 'V' : prof.grid ? 'G' : '';
  if (headRef === 'mag'){
    const d = declAt((x1 + x2) / 2, (y1 + y2) / 2);
    if (d !== null){ b -= d; suf = 'M'; }                // cap magnétique = cap vrai − déclinaison Est
  }
  const r = Math.round((b + 720) % 360) || 360;
  return String(r).padStart(3, '0') + '°' + suf;
}
/* dans la coupe, une mesure dit la distance au sol et l'écart d'altitude, pas un cap */
function profText(o){
  const dz = altAt(o.y2) - altAt(o.y1), r = Math.round(Math.abs(dz) / 100) * 100;
  return distText(Math.abs(o.x2 - o.x1), profNmPx()) + ' · ' + (dz >= 0 ? '+' : '−') +
         r.toLocaleString('fr-FR') + ' ft';
}
function rulerText(o){
  if (o.v === 'p') return profText(o);
  const g = o.__src || o;                               // toujours sur le terrain, jamais à l'écran
  return distText(Math.hypot(g.x2 - g.x1, g.y2 - g.y1), nmAt((g.y1 + g.y2) / 2)) + ' · ' +
         bearing(g.x1, g.y1, g.x2, g.y2);
}
/* longueur du chemin réellement tracé : sur une flèche courbe, c'est ce qu'on vole */
function curveLength(o){
  let len = 0, px = o.x1, py = o.y1;
  for (let i = 1; i <= 32; i++){
    const t = i / 32, u = 1 - t;
    const x = u*u*o.x1 + 2*u*t*o.cx + t*t*o.x2, y = u*u*o.y1 + 2*u*t*o.cy + t*t*o.y2;
    len += Math.hypot(x - px, y - py); px = x; py = y;
  }
  return len;
}
const measText = o => { if (o.v === 'p') return profText(o);
  const g = o.__src || o;
  return distText(curveLength(g), nmAt((g.y1 + g.y2) / 2)) + ' · ' + bearing(g.x1, g.y1, g.x2, g.y2); };

/* cartouche sombre : lisible sur n'importe quelle carte */
function tag(t, x, y, col){
  ctx.save();
  ctx.setLineDash([]);
  ctx.font = '700 ' + 12 * tb + 'px ui-sans-serif, system-ui, sans-serif';
  const tw = ctx.measureText(t).width;
  ctx.fillStyle = 'rgba(7,11,16,.88)'; ctx.fillRect(x - tw / 2 - 6 * tb, y - 10 * tb, tw + 12 * tb, 20 * tb);
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(t, x, y + 1);
  ctx.restore();
}
/* cote d'un trait ou d'une flèche : au milieu du chemin, décalée du côté haut
   pour ne pas masquer le trait */
function drawMeasure(o){
  const u = .5, mx = u*u*o.x1 + 2*u*u*o.cx + u*u*o.x2, my = u*u*o.y1 + 2*u*u*o.cy + u*u*o.y2;
  let nx = -(o.y2 - o.y1), ny = o.x2 - o.x1;
  const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
  if (ny > 0){ nx = -nx; ny = -ny; }
  const off = (14 + (o.w || 4)) * tb;
  tag(measText(o), mx + nx * off, my + ny * off, o.c);
}
function drawRuler(o){
  ctx.setLineDash([]); ctx.lineWidth = 2;
  const a = Math.atan2(o.y2 - o.y1, o.x2 - o.x1), nx = -Math.sin(a) * 7, ny = Math.cos(a) * 7;
  ctx.beginPath();
  ctx.moveTo(o.x1, o.y1); ctx.lineTo(o.x2, o.y2);
  ctx.moveTo(o.x1 - nx, o.y1 - ny); ctx.lineTo(o.x1 + nx, o.y1 + ny);
  ctx.moveTo(o.x2 - nx, o.y2 - ny); ctx.lineTo(o.x2 + nx, o.y2 + ny);
  ctx.stroke();
  tag(rulerText(o), (o.x1 + o.x2) / 2, (o.y1 + o.y2) / 2, o.c);
}

/* ---------- symboles ---------- */
/* translation, rotation, échelle — l'épaisseur de trait reste constante */
function paintSym(c, o){
  const sh = SHAPES[o.k]; if (!sh) return;
  const s = SIZE * (o.s || 1), side = o.v === 'p' && sh.side;
  c.save();
  c.translate(o.x, o.y);
  if (!sh.upright) c.rotate(o.a || 0);      // une forme droite (écran, HAFU) ne tourne jamais
  /* un appareil de profil qui vole vers la gauche est retourné, pas mis sur le dos */
  if (side && Math.cos(o.a || 0) < 0) c.scale(1, -1);
  c.scale(s, s);
  c.lineWidth = (o.w || 4) / s;
  c.lineJoin = 'round'; c.lineCap = 'round';
  if (side) sh.side(c); else sh.draw(c, o);
  if (sh.stem){                              // seule sa tige suit le cap
    c.save(); c.rotate(o.a || 0);
    c.beginPath(); c.moveTo(0, -sh.stem[0]); c.lineTo(0, -sh.stem[1]); c.stroke();
    c.restore();
  }
  if (!side) withMark(c, o);                 // L&S, DT2 : par-dessus la tige, pour rester lisibles
  c.restore();
  /* dans la coupe, tout s'écrit au-dessus : dessous, c'est le sol. Un aéronef ou une
     munition y ajoute son altitude — « HAWG 1-1 · 1 000 ft » */
  if (o.v === 'p' && !o.mini){
    const alt = (sh.g === 'air' || sh.g === 'arm') ? altText(altAt(o.y)) : '';
    const txt = [o.lbl, alt].filter(Boolean).join(' · ');
    if (txt) label(c, o.x, o.y - s * .95 - 16, txt, o.c);
    if (sh.num){
      c.save();
      c.font = '700 ' + Math.max(11 * tb, s * .58) + 'px ui-sans-serif, system-ui, sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(o.n, o.x, o.y + 1);
      c.restore();
    }
    return;
  }

  /* légendes toujours horizontales, quelle que soit la rotation du symbole */
  if (sh.num){                                 // numéro de waypoint : au centre
    c.save();
    c.font = '700 ' + Math.max(11 * tb, s * .58) + 'px ui-sans-serif, system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(o.n, o.x, o.y + 1);
    c.restore();
  } else if (sh.tag && !o.mini){               // étiquette fixe de la forme
    c.save();
    c.font = '700 ' + Math.max(11 * tb, s * .38) + 'px ui-sans-serif, system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillText(sh.tag, o.x, o.y + s * (o.k === 'sam' ? 1.7 : 1.05));
    c.restore();
  }
  /* sous un waypoint de la route liée, son altitude rejoint l'étiquette */
  const src = o.__src || o;
  const ra = !o.mini && routeAlt.has(src) ? altText(routeAlt.get(src)) : '';
  const under = [o.lbl, ra].filter(Boolean).join(' · ');
  if (under && !o.mini) label(c, o.x, labelY(o), under, o.c);   // indicatif, altitude…
}
function labelY(o){
  const sh = SHAPES[o.k] || {}, s = SIZE * (o.s || 1);
  if (o.v === 'p') return o.y - s * .95 - 16;         // coupe : étiquette au-dessus
  return o.y + s * (sh.ldy || (o.k === 'sam' ? 1.7 : 1.2)) + (sh.tag ? 15 : 2);
}

/* le cadre du kneeboard : une aide d'édition, qui ne se montre ni en présentation, ni
   dans un export (bare) */
function drawKFrame(o){
  if (presenting || bare) return;
  ctx.strokeStyle = ctx.fillStyle = '#D1A94A'; ctx.lineWidth = 2;
  ctx.setLineDash([10, 6]); ctx.strokeRect(o.x, o.y, o.w2, kbHeight(o)); ctx.setLineDash([]);
  ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif'; ctx.textBaseline = 'bottom';
  ctx.fillText('KNEEBOARD', o.x + 2, o.y - 4);
}

/* ---------- poignées ---------- */
function handleList(o){
  if (o.locked) return [];                       // ancré : ni rotation, ni taille, ni sommets
  if (o.t === 'sym'){
    const sh = SHAPES[o.k] || {}, side = o.v === 'p' && sh.side;
    /* une forme droite sans tige (écran, brique, curseur) se dimensionne par son coin haut droit */
    const r = SIZE * (o.s || 1) * 1.45, a = sh.upright && !sh.stem ? -Math.PI / 4 : (o.a || 0) - (side ? 0 : Math.PI / 2);
    return [{ id:'rot', x: o.x + Math.cos(a) * r, y: o.y + Math.sin(a) * r }];
  }
  if (o.t === 'dome')  return [{ id:'p2', x:o.x2, y:o.y2 }];
  if (o.t === 'block') return [{ id:'p1', x:PROF_L + 24, y:o.y1 }, { id:'p2', x:PROF_L + 24, y:o.y2 }];
  if (o.t === 'arrow' || o.t === 'line')
    return [{ id:'p1', x:o.x1, y:o.y1 }, { id:'p2', x:o.x2, y:o.y2 }, { id:'ctl', x:o.cx, y:o.cy }];
  if (o.t === 'ruler') return [{ id:'p1', x:o.x1, y:o.y1 }, { id:'p2', x:o.x2, y:o.y2 }];
  if (o.t === 'zone')  return o.pts.map((p, i) => ({ id:'v' + i, x:p[0], y:p[1] }));
  if (o.t === 'rect' || o.t === 'circle') return [{ id:'p2', x:o.x2, y:o.y2 }];
  if (o.t === 'img')  return [{ id:'size', x:o.x + o.w2, y:o.y + o.h2 }];
  if (o.t === 'kframe') return [{ id:'size', x:o.x + o.w2, y:o.y + kbHeight(o) }];
  return [];
}
function handles(o){
  ctx.save();
  ctx.strokeStyle = o.locked ? '#D1A94A' : '#2F8CFF'; ctx.fillStyle = BG(); ctx.lineWidth = 2;
  const b = bbox(o);
  ctx.setLineDash([5, 5]); ctx.globalAlpha = .55;
  ctx.strokeRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
  ctx.setLineDash([]); ctx.globalAlpha = 1;
  for (const h of handleList(o)){
    ctx.beginPath(); ctx.arc(h.x, h.y, 7, 0, 7); ctx.fill(); ctx.stroke();
  }
  if (o.locked) pin(b.x + b.w + 6, b.y - 6);
  ctx.restore();
}
/* l'épingle d'un objet ancré, au coin du cadre de sélection — jamais dans un export,
   qui se dessine sans sélection */
function pin(x, y){
  ctx.save();
  ctx.translate(x, y); ctx.rotate(.5);
  ctx.strokeStyle = '#D1A94A'; ctx.fillStyle = '#D1A94A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 9); ctx.stroke();       // aiguille
  ctx.beginPath(); ctx.arc(0, -5, 4.5, 0, 7); ctx.fill();                  // tête
  ctx.restore();
}

function bbox(o){
  if (o.t === 'sym'){ const r = SIZE * (o.s || 1) * ((SHAPES[o.k] || {}).box || 1.15); return { x:o.x-r, y:o.y-r, w:r*2, h:r*2 }; }
  if (o.t === 'text'){ const w = o.s.length * (7 + o.w * 1.6); return { x:o.x-4, y:o.y-14, w:w+8, h:28 }; }
  if (o.t === 'img')  return { x:o.x, y:o.y, w:o.w2, h:o.h2 };
  if (o.t === 'kframe') return { x:o.x, y:o.y, w:o.w2, h:kbHeight(o) };
  if (o.t === 'dome'){ const { rx, ry } = domeGeom(o); return { x:o.x1 - rx, y:groundY() - ry, w:2 * rx, h:ry }; }
  if (o.t === 'block'){ const [t, b] = blockSpan(o); return { x:PROF_L, y:t, w:220, h:b - t }; }
  if (o.t === 'stroke' || o.t === 'zone' || o.t === 'terrain'){
    const xs = o.pts.map(p => p[0]), ys = o.pts.map(p => p[1]);
    return { x:Math.min(...xs), y:Math.min(...ys), w:Math.max(...xs)-Math.min(...xs), h:Math.max(...ys)-Math.min(...ys) };
  }
  if (o.t === 'circle'){ const r = Math.hypot(o.x2-o.x1, o.y2-o.y1); return { x:o.x1-r, y:o.y1-r, w:r*2, h:r*2 }; }
  return { x:Math.min(o.x1,o.x2), y:Math.min(o.y1,o.y2), w:Math.abs(o.x2-o.x1), h:Math.abs(o.y2-o.y1) };
}

/* ---------- désignation ---------- */
const near = (ax, ay, bx, by, r) => Math.hypot(ax-bx, ay-by) < r;

/* distance d'un point au segment [1,2] — borne le projeté aux extrémités */
function segDist(x1, y1, x2, y2, x, y){
  const dx = x2-x1, dy = y2-y1, L2 = dx*dx + dy*dy;
  if (!L2) return Math.hypot(x-x1, y-y1);
  const t = Math.max(0, Math.min(1, ((x-x1)*dx + (y-y1)*dy) / L2));
  return Math.hypot(x1 + t*dx - x, y1 + t*dy - y);
}
function inPoly(p, x, y){
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++){
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function hit(o, x, y){
  /* la zone de préhension suit l'encombrement réel de la forme : on doit pouvoir
     attraper un bombardier par son aile, pas seulement par son fuselage */
  if (o.t === 'sym'){
    const sh = SHAPES[o.k] || {}, r = SIZE * (o.s || 1);
    if (sh.box) return Math.abs(x - o.x) < r * sh.box && Math.abs(y - o.y) < r * sh.box;   // un écran : ses coins aussi
    return near(x, y, o.x, o.y, r * (sh.hit || 1.15));
  }
  /* le cadre du kneeboard se saisit par son bord ou son titre : dedans, on continue de
     travailler sur le plan */
  if (o.t === 'kframe'){
    const b = bbox(o), m = 9;
    const out = x > b.x - m && x < b.x + b.w + m && y > b.y - m - 14 && y < b.y + b.h + m;
    return out && !(x > b.x + m && x < b.x + b.w - m && y > b.y + m && y < b.y + b.h - m);
  }
  if (o.t === 'text' || o.t === 'img'){
    const b = bbox(o); return x > b.x && x < b.x+b.w && y > b.y && y < b.y+b.h;
  }
  /* on teste les segments, pas seulement les points : un geste rapide n'enregistre
     que quelques points et le milieu du trait doit rester attrapable */
  if (o.t === 'dome'){
    const { rx, ry } = domeGeom(o), dx = (x - o.x1) / rx, dy = (y - groundY()) / ry;
    return y <= groundY() + 6 && dx * dx + dy * dy <= 1.15;
  }
  if (o.t === 'block'){ const [t, b] = blockSpan(o); return x >= PROF_L && y >= t - 6 && y <= b + 6; }
  if (o.t === 'stroke' || o.t === 'terrain'){
    for (let i = 1; i < o.pts.length; i++)
      if (segDist(o.pts[i-1][0], o.pts[i-1][1], o.pts[i][0], o.pts[i][1], x, y) < 13) return true;
    return near(x, y, o.pts[0][0], o.pts[0][1], 13);
  }
  if (o.t === 'zone'){
    if (inPoly(o.pts, x, y)) return true;
    return o.pts.some((p, i) => { const q = o.pts[(i + 1) % o.pts.length];
                                  return segDist(p[0], p[1], q[0], q[1], x, y) < 12; });
  }
  if (o.t === 'ruler') return segDist(o.x1, o.y1, o.x2, o.y2, x, y) < 12;
  if (o.t === 'circle') return Math.abs(Math.hypot(x-o.x1, y-o.y1) - Math.hypot(o.x2-o.x1, o.y2-o.y1)) < 14;
  if (o.t === 'rect'){
    const b = bbox(o), m = 12;
    const inOut = x > b.x-m && x < b.x+b.w+m && y > b.y-m && y < b.y+b.h+m;
    const inIn  = x > b.x+m && x < b.x+b.w-m && y > b.y+m && y < b.y+b.h-m;
    return inOut && !inIn;
  }
  for (let t = 0; t <= 1.001; t += .05){          // courbe quadratique échantillonnée
    const u = 1 - t;
    const px = u*u*o.x1 + 2*u*t*o.cx + t*t*o.x2;
    const py = u*u*o.y1 + 2*u*t*o.cy + t*t*o.y2;
    if (near(x, y, px, py, 12)) return true;
  }
  return false;
}
/* on désigne à l'écran : les tolérances (12 px, rayon d'un symbole) sont des pixels
   écran, quel que soit le zoom de la carte */
const topmost = (x, y, keep) => {
  const [sx, sy] = view === 'm' ? w2s(x, y) : [x, y];
  for (let i = objs.length-1; i >= 0; i--)
    if (inView(objs[i]) && keep(objs[i]) && hit(toScreen(objs[i]), sx, sy)) return objs[i];
  return null;
};
/* ce qu'on attrape sans changer d'outil quand une forme est choisie : formes et
   textes seulement — flèches, zones, écrans radar et carte restent traversables,
   pour pouvoir poser un symbole dessus */
const grab  = (x, y) => topmost(x, y, o => (o.t === 'text' || o.t === 'sym' && !(SHAPES[o.k] || {}).under)
                                          && !o.locked);
/* à l'outil Sélection, un objet libre passe devant un objet ancré qui le recouvre ;
   l'ancré ne se désigne que seul sous le doigt — c'est ainsi qu'on le libère */
const pick  = (x, y) => topmost(x, y, o => !o.locked) || topmost(x, y, () => true);
/* ce qui porte un texte modifiable : l'étiquette d'une forme ou d'une zone, un texte */
const named = (x, y) => topmost(x, y, o => ['sym', 'zone', 'text', 'dome', 'block'].includes(o.t));

function move(o, dx, dy){
  if (o.t === 'dome'){ o.x1 += dx; o.x2 += dx; o.cx += dx; return; }     // reste posée au sol
  if (o.t === 'block'){ o.y1 += dy; o.y2 += dy; return; }                // pleine largeur
  if (o.pts){ for (const p of o.pts){ p[0]+=dx; p[1]+=dy; } return; }
  if (o.x1 !== undefined){ o.x1+=dx; o.y1+=dy; o.x2+=dx; o.y2+=dy; o.cx+=dx; o.cy+=dy; return; }
  o.x += dx; o.y += dy;
}

/* ---------- pointeur ---------- */
/* position dans le repère de la vue touchée ; pendant un geste, la vue ne change pas */
/* rend [x, y] dans le repère de la vue (terrain pour le plan cartographié),
   la hauteur brute, et [sx, sy] dans le repère écran de la vue */
function locate(e, keepView){
  const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (!keepView) view = split && y >= profTop() ? 'p' : 'm';
  if (view === 'p') return [x, y - profTop(), y, x, y - profTop()];
  const [wx, wy] = s2w(x, y);
  return [wx, wy, y, x, y];
}
/* navigation de la carte : clic droit glissé, clic molette, espace, outil main, pincement.
   rpress suit un appui du bouton droit : il ne se décide qu'au relâché */
let spaceHeld = false, pinch = null, rpress = null;
const touches = new Map();
function cancelGesture(){
  if (draft){ draft = null; past.pop(); }
  else if (drag){
    if (drag.saved && drag.m !== 'pan'){ const s = past.pop(); if (s){ objs = s.objs; wpN = s.wpN; } }
    drag = null; sel = null;
  }
}
const startPan = (sx, sy) => { drag = { m:'pan', sx, sy, cx: cam.x, cy: cam.y, saved: true }; cv.style.cursor = 'grabbing'; };
/* le clic droit a son propre sens sur le tableau : le menu du navigateur n'y apparaît jamais */
cv.addEventListener('contextmenu', e => e.preventDefault());

/* clic droit sans bouger, ou Échap : on abandonne le geste en cours et l'on revient à
   l'outil Sélection, la fonction par défaut. Ce n'est pas l'Annuler de l'historique. */
function backToSelect(){
  closeText(true);
  cancelGesture();
  sel = null;
  setTool('select');
  commit();
}
/* marques de piste — L&S et DT2 du F/A-18C (p. 173, 176), cible désignée du F-16C
   (p. 404, 415) : une seule de chaque par vue, sur une piste du même appareil. Reposer
   la même marque sur la même piste l'enlève. Une piste ancrée l'accepte : c'est un
   état, pas une géométrie.
   Hors d'une piste, la marque désigne un écho, comme au cockpit : un écho brut (brique,
   cible de recherche) devient la piste qui la porte ; ailleurs, une nouvelle piste
   (SHAPES[…].newTrack) la porte là où l'on touche. Jamais sur l'écran, la piste ou
   l'écho d'un autre appareil.
   Une piste ne porte qu'une marque. Posée sur la piste qui porte l'autre, la marque
   l'échange avec la piste qui la portait (F/A-18C p. 173) ; sans elle, la marque d'une
   vignette `keep` (la L&S) ne se retire pas en silence : refus. */
const radarGroup = g => Object.values(SHAPES).some(k => k.g === g && k.mark);
function markTrack(x, y, mk){
  const sh = SHAPES[symKey], name = g => (GROUPS.find(([k]) => k === g) || [])[1];
  const kind = o => o.t === 'sym' && SHAPES[o.k] || {};
  const mine = o => kind(o).g === sh.g, other = o => kind(o).g !== sh.g && radarGroup(kind(o).g);
  let t = topmost(x, y, o => kind(o).track && mine(o)), raw = null;
  if (!t){
    const foreign = topmost(x, y, o => other(o) && (kind(o).track || kind(o).raw));
    if (foreign){ toast(`${sh.label} est une marque du ${name(sh.g)} : pas sur une piste du ${name(kind(foreign).g)}`); return; }
    raw = topmost(x, y, o => kind(o).raw && mine(o) && !o.locked);
  }
  /* à portée de doigt d'une piste : c'est elle — le bout d'une tige compte */
  if (!t && !raw){
    const [sx, sy] = view === 'm' ? w2s(x, y) : [x, y];
    let best = Infinity;
    for (const o of objs){
      if (!inView(o) || !kind(o).track || !mine(o)) continue;
      const p = toScreen(o), d = Math.hypot(p.x - sx, p.y - sy);
      if (d < Math.max(40, SIZE * (o.s || 1) * 1.15 + 16) && d < best){ best = d; t = o; }
    }
  }
  if (!t){
    const scope = topmost(x, y, o => other(o) && kind(o).scope);
    if (scope){ toast(`${sh.label} est une marque du ${name(sh.g)} : pas sur l'écran du ${name(kind(scope).g)}`); return; }
  }
  const prev = t && t.mark && t.mark !== mk ? t.mark : null;
  const holder = prev && objs.find(o => o !== t && o.mark === mk && (o.v || 'm') === (t.v || 'm'));
  const kept = prev && Object.values(SHAPES).find(k => k.mark === prev && k.keep);
  if (kept && !holder){ toast(`Cette piste porte la ${kept.label} : ${sh.label} se pose sur une autre piste`); return; }
  snapshot();
  if (!t){                                             // un écho désigné : sa piste porte la marque
    const nk = SHAPES[sh.newTrack];
    t = { t:'sym', k:sh.newTrack, x, y, a:0, s:nk.s0 || 1, c:nk.col || color, w:width, n:0 };
    if (view === 'p') t.v = 'p';
    if (raw){
      Object.assign(t, { x: raw.x, y: raw.y, a: SHAPES[raw.k].rawA ?? raw.a ?? 0, uid: raw.uid });
      if (raw.lbl) t.lbl = raw.lbl;
      objs[objs.indexOf(raw)] = t;
    }
    else objs.push(t);
  }
  const on = t.mark !== mk;
  for (const o of objs) if (o.mark === mk && (o.v || 'm') === (t.v || 'm')) delete o.mark;
  if (holder) holder.mark = prev;                      // échange : l'autre piste prend la marque de celle-ci
  if (on) t.mark = mk;
  commit();
}
cv.addEventListener('wheel', e => {
  if (!cam) return;
  const r = cv.getBoundingClientRect(), sx = e.clientX - r.left, sy = e.clientY - r.top;
  if (split && sy >= planH()) return;
  e.preventDefault();
  zoomAt(sx, sy, -e.deltaY * (e.deltaMode ? .05 : .0022));
}, { passive: false });
const PROF_TOOLS = ['terrain', 'dome', 'block'];

cv.addEventListener('pointerdown', e => {
  try { cv.setPointerCapture(e.pointerId); } catch(_){}
  const [x, y, raw, sx, sy] = locate(e);
  if (presenting){                                                    // présentation : rien ne s'édite
    if (e.button === 0){ laserDown = true; laser.stroke++; laserPoint(e); }
    else if (cam && view === 'm') startPan(sx, sy);                   // droit ou molette : la carte
    return;
  }
  if (split && raw >= planH() && raw < profTop()) return;           // bandeau de la coupe
  if (view === 'p' && prof.pane) return;                              // vue radar : calculée, pas éditée
  if (view === 'm') touches.set(e.pointerId, [sx, sy]);
  if (cam && view === 'm' && touches.size === 2){                    // deux doigts : pincer
    cancelGesture();
    const [a, b] = [...touches.values()], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    pinch = { d0: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, z0: cam.z, w: s2w(mx, my) };
    draw(); return;
  }
  /* bouton droit : glissé, il déplace la carte ; relâché sans bouger, il ramène à la
     sélection (releasePointer). Il ne pose et ne trace jamais rien. */
  if (e.button === 2){
    rpress = { sx, sy, moved: false };
    if (cam && view === 'm') startPan(sx, sy);
    return;
  }
  if (e.button === 1){                                                // molette : la carte, rien d'autre
    if (cam && view === 'm') startPan(sx, sy);
    return;
  }
  if (cam && view === 'm' && (spaceHeld || tool === 'pan')){
    startPan(sx, sy); return;
  }
  closeText(true);
  if (draft && draft.t === 'zone' && (draft.v || 'm') !== view) finishZone();
  if (PROF_TOOLS.includes(tool) && view !== 'p') return;            // outils propres à la coupe

  /* coupe liée : un waypoint de la route se tire verticalement, pour son altitude */
  if (view === 'p' && prof.linked && !draft){
    const rp = routeHit(x, y);
    if (rp && rp.w.locked){ toast(LOCKED); return; }
    if (rp){ sel = null; drag = { m:'alt', o: rp.w }; draw(); return; }
  }

  /* une poignée de la sélection a toujours la priorité */
  if (!draft && sel && objs.includes(sel) && inView(sel)){
    for (const h of handleList(toScreen(sel))){
      if (near(sx, sy, h.x, h.y, 13)){ drag = { m:h.id, o:sel, w2s: sel.w2 }; return; }
    }
  }

  if (tool === 'zone'){ zoneClick(x, y); return; }

  if (tool === 'erase'){
    /* la gomme ignore l'image de fond : un clic dans une zone vide ne doit pas
       faire disparaître la carte. Elle se retire par sélection puis Suppr. */
    const o = topmost(x, y, o => o.t !== 'img' && !o.locked);
    if (o){ snapshot(); objs.splice(objs.indexOf(o), 1); sel = null; commit(); }
    else if (topmost(x, y, o => o.t !== 'img')) toast(LOCKED);
    return;
  }

  if (tool === 'select'){
    const o = pick(x, y);
    sel = o;
    if (o && !o.locked) drag = { m:'move', o, x, y };
    else if (cam && view === 'm') startPan(sx, sy);                 // le vide ou un objet ancré : la carte
    draw(); return;
  }

  if (tool === 'sym'){
    const sh = SHAPES[symKey];
    if (sh.mark){ markTrack(x, y, sh.mark); return; }  // L&S, DT2 : l'état d'une piste
    /* toucher une forme ou un texte existant le saisit ; toucher le vide pose une
       nouvelle forme. Sans cela, déplacer exigeait de changer d'outil. Un curseur,
       lui, se pose par-dessus ce qu'il désigne. */
    const g = !sh.over && grab(x, y);
    if (g){ sel = g; drag = { m:'move', o:g, x, y }; draw(); return; }
    snapshot();
    const o = { t:'sym', k:symKey, x, y, a:0, s:sh.s0 || 1, c: sh.col || color, w:width, n: sh.num ? wpN++ : 0 };
    if (view === 'p') o.v = 'p';
    if (sh.under) insertLow(o); else objs.push(o);      // un écran passe sous ce qu'on posera dessus
    sel = o;
    drag = { m:'place', o, x, y, saved:true };   // glisser en posant = orienter et dimensionner
    draw(); return;
  }

  if (tool === 'text'){
    sel = null;
    const o = named(x, y);                     // sur une forme : son étiquette ; sur un texte : le texte
    if (o) editText(o); else openText(x, y);
    return;
  }

  snapshot();
  if (tool === 'pen' || tool === 'terrain')
    draft = { t: tool === 'pen' ? 'stroke' : 'terrain', pts:[[x, y]], c:color, w:width, ls };
  else if (tool === 'dome')
    draft = { t:'dome', x1:x, y1:groundY(), x2:x, y2:y, cx:x, cy:y, c:color, w:width, ls };
  else if (tool === 'block')
    draft = { t:'block', x1:PROF_L + 24, y1:y, x2:PROF_L + 24, y2:y, cx:PROF_L + 24, cy:y, c:color, w:width, ls };
  else
    draft = { t:tool, x1:x, y1:y, x2:x, y2:y, cx:x, cy:y, c:color, w: tool === 'ruler' ? 2 : width,
              ls, both:false, meas: measOn && (tool === 'line' || tool === 'arrow') };
  if (view === 'p') draft.v = 'p';
  sel = null; draw();
});

cv.addEventListener('pointermove', e => {
  const [x, y, , sx, sy] = locate(e, !!(drag || draft || pinch));
  if (presenting && !(drag && drag.m === 'pan')){ laserPoint(e); return; }
  /* bouton droit enfoncé pendant un geste du gauche (pose, tracé, déplacement) : abandon */
  if (e.button === 2 && (draft || (drag && drag.m !== 'pan'))){ backToSelect(); return; }
  if (rpress && Math.hypot(sx - rpress.sx, sy - rpress.sy) > 5) rpress.moved = true;

  if (pinch && touches.has(e.pointerId)){
    touches.set(e.pointerId, [sx, sy]);
    if (touches.size >= 2){
      const [a, b] = [...touches.values()], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      cam.z = Math.max(3, Math.min(18, pinch.z0 + Math.log2(Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d0)));
      const k = camK(), [vw, vh] = viewSize();
      cam.x = pinch.w[0] - (mx - vw / 2) / k; cam.y = pinch.w[1] - (my - vh / 2) / k;
      requestDraw();
    }
    return;
  }
  if (drag && drag.m === 'pan'){
    const k = camK();
    cam.x = drag.cx - (sx - drag.sx) / k; cam.y = drag.cy - (sy - drag.sy) / k;
    requestDraw(); return;
  }

  if (drag){
    const o = drag.o;
    /* l'instantané n'est pris qu'au premier mouvement : un simple toucher pour
       sélectionner ne doit pas laisser d'entrée vide dans l'historique */
    if (!drag.saved){ snapshot(); drag.saved = true; }
    if (drag.m === 'move'){ move(o, x - drag.x, y - drag.y); drag.x = x; drag.y = y; }
    else if (drag.m === 'place' || drag.m === 'rot'){
      const d = Math.hypot(x - o.x, y - o.y) * kv();     // en pixels écran, quel que soit le zoom
      if (d > 14){
        const sh = SHAPES[o.k], side = o.v === 'p' && sh.side;     // de profil : 0 = nez à droite
        o.a = Math.atan2(y - o.y, x - o.x) + (side ? 0 : Math.PI / 2);
        /* une piste radar se pose à sa taille : le geste l'oriente ; la poignée, elle, redimensionne */
        if (!sh.fixed || drag.m === 'rot') o.s = Math.max(.35, Math.min(sh.smax || 6, d / (SIZE * 1.45)));
      }
    }
    else if (drag.m === 'p1'){ o.x1 = x; o.y1 = y; if (!o.bent) recenter(o); }
    else if (drag.m === 'p2'){ o.x2 = x; o.y2 = y; if (!o.bent) recenter(o); }
    else if (drag.m === 'ctl'){ o.cx = x; o.cy = y; o.bent = true; }
    else if (drag.m[0] === 'v'){ o.pts[+drag.m.slice(1)] = [x, y]; }
    else if (drag.m === 'alt'){ o.alt = Math.max(0, Math.min(prof.ceil, altAt(y))); }
    else if (drag.m === 'size' && o.t === 'kframe') o.w2 = Math.max(60 / kv(), x - o.x);   // la hauteur suit la page
    else if (drag.m === 'size'){
      const k = Math.max(.1, (x - o.x) / o.w0);
      o.w2 = o.w0 * k; o.h2 = o.h0 * k;
    }
    draw(); return;
  }

  if (draft && draft.t === 'zone'){ draft.hov = [x, y]; draw(); return; }

  if (!draft){
    cv.style.cursor = view === 'p' && prof.pane ? 'default'
      : cam && view === 'm' && (tool === 'pan' || spaceHeld) ? 'grab'
      : view === 'p' && prof.linked && routeHit(x, y) ? 'ns-resize'
      : cursorOver(tool === 'select' ? pick(x, y) : tool === 'sym' ? grab(x, y) : null);
    return;
  }
  if (draft.t === 'stroke' || draft.t === 'terrain') draft.pts.push([x, y]);
  else if (draft.t === 'dome'){ draft.x2 = x; draft.y2 = Math.min(y, groundY() - 4); }
  else if (draft.t === 'block') draft.y2 = y;
  else { draft.x2 = x; draft.y2 = y; recenter(draft); }
  draw();
});

const recenter = o => { o.cx = (o.x1 + o.x2) / 2; o.cy = (o.y1 + o.y2) / 2; };
const cursorOver = o => !o ? 'crosshair' : !o.locked ? 'move' : cam && view === 'm' ? 'grab' : 'default';

function endPointer(){
  if (drag){
    /* une forme posée est lâchée : choisir une couleur pour la suivante ne doit pas
       repeindre celle-ci. On la reprend en la touchant. */
    if (drag.m === 'place') sel = null;
    if (drag.m === 'alt' && drag.saved) drag.o.alt = Math.round(drag.o.alt / 500) * 500;
    /* dans la coupe, altitudes calées sur 500 ft : un briefing parle en niveaux ronds */
    const o = drag.o || {};                             // un glisser de carte n'a pas d'objet
    if (o.v === 'p' && drag.saved){
      if (o.t === 'sym' && ['air', 'arm'].includes((SHAPES[o.k] || {}).g)) o.y = snapAlt(o.y);
      if (o.t === 'block'){ o.y1 = snapAlt(o.y1); o.y2 = snapAlt(o.y2); }
      if (o.t === 'dome') o.y2 = Math.min(snapAlt(o.y2), groundY() - 4);
    }
    /* agrandir la carte agrandit les distances : l'échelle suit */
    if (drag.m === 'size' && drag.o.t === 'img' && drag.saved && nmPx && drag.w2s) nmPx *= drag.o.w2 / drag.w2s;
    drag = null; commit(); return;
  }
  if (!draft || draft.t === 'zone') return;     // une zone se referme au clic, pas au relâché
  const tiny = (draft.t === 'stroke' || draft.t === 'terrain')
    ? draft.pts.length < 2
    : Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1) * kv() < 6;
  if (tiny) past.pop();                         // geste avorté : pas d'entrée d'historique
  else if (['terrain', 'dome', 'block'].includes(draft.t)){
    if (draft.t === 'block'){ draft.y1 = snapAlt(draft.y1); draft.y2 = snapAlt(draft.y2); }
    if (draft.t === 'dome') draft.y2 = Math.min(snapAlt(draft.y2), groundY() - 4);
    insertLow(draft); if (draft.t !== 'terrain') sel = draft;
  }
  else { objs.push(draft); if (draft.t !== 'stroke') sel = draft; }
  draft = null; commit();
}
function releasePointer(e){
  laserDown = false;
  touches.delete(e.pointerId);
  if (pinch){ if (touches.size < 2){ pinch = null; saveSoon(); } return; }
  const click = rpress && !rpress.moved && e.type === 'pointerup';
  rpress = null;
  if (click && drag && drag.m === 'pan'){ cam.x = drag.cx; cam.y = drag.cy; }   // un clic ne déplace pas la carte
  endPointer();
  if (click) backToSelect();
}
cv.addEventListener('pointerup', releasePointer);
cv.addEventListener('pointercancel', releasePointer);

/* double-clic : referme une zone, ou ouvre le texte de ce qu'on touche */
cv.addEventListener('dblclick', e => {
  if (presenting) return;
  const [x, y] = locate(e, !!(draft && draft.t === 'zone'));
  if (draft && draft.t === 'zone'){ finishZone(); return; }
  if (view === 'p' && prof.pane) return;
  if (view === 'p' && prof.linked){                     // altitude exacte d'un waypoint
    const rp = routeHit(x, y);
    if (rp) return openText(rp.x - 60, rp.y - 44, { t:'wpalt', w: rp.w }, altText(rp.alt));
  }
  const o = named(x, y);
  if (o) editText(o);
});

/* ---------- texte et étiquettes ---------- */
function openText(x, y, target = null, value = ''){
  closeText(true);
  textTarget = target;
  const r = cv.getBoundingClientRect(), oy = view === 'p' ? profTop() : 0;
  ti.dataset.v = view;
  ti.style.display = 'block';
  const [px, py] = view === 'm' ? w2s(x, y) : [x, y];
  ti.style.left = (r.left + px) + 'px'; ti.style.top = (r.top + oy + py - 16) + 'px';
  ti.placeholder = target && target.t !== 'text' ? 'étiquette : indicatif, altitude… puis Entrée'
                                                  : 'texte puis Entrée';
  ti.value = value; ti.dataset.x = x; ti.dataset.y = y;
  setTimeout(() => { ti.focus(); ti.select(); }, 0);
}
function editText(o){
  view = o.v || 'm';
  if (o.t === 'text') return openText(o.x, o.y, o, o.s);
  if (o.t === 'dome') return openText(o.x1 - 90, groundY() - domeGeom(o).ry - 10, o, o.lbl || '');
  if (o.t === 'block') return openText(PROF_L + 20, blockSpan(o)[0] + 8, o, o.lbl || '');
  const so = toScreen(o);                               // on place le champ à l'écran
  if (o.t === 'zone'){ const [lx, ly] = zoneLabelAt(so.pts); return openText(...toW(lx - 90, ly + 8), o, o.lbl || ''); }
  openText(...toW(so.x - 90, labelY(so) + 8), o, o.lbl || '');
}
function closeText(keep){
  if (ti.style.display !== 'block') return;
  ti.style.display = 'none';
  const v = ti.value.trim(), t = textTarget;
  textTarget = null;
  if (keep){
    if (t && t.t === 'wpalt'){
      const ft = parseAlt(v);
      if (ft !== null && ft !== t.w.alt && objs.includes(t.w)){ snapshot(); t.w.alt = ft; }
    } else if (t){
      const before = t.t === 'text' ? t.s : (t.lbl || '');
      if (v !== before && objs.includes(t)){
        snapshot();
        if (t.t !== 'text') t.lbl = v;           // vide : l'étiquette disparaît
        else if (v) t.s = v;
        else objs.splice(objs.indexOf(t), 1);    // un texte vidé est supprimé
      }
    } else if (v){
      snapshot();
      const o = { t:'text', s:v, x:+ti.dataset.x, y:+ti.dataset.y, c:color, w:width };
      if (ti.dataset.v === 'p') o.v = 'p';
      objs.push(o);
    }
  }
  commit();
}
ti.addEventListener('keydown', e => {
  if (e.key === 'Enter')  closeText(true);
  if (e.key === 'Escape') closeText(false);
  e.stopPropagation();
});
ti.addEventListener('blur', () => closeText(true));

/* ---------- images de fond ----------
   Une image porte un identifiant ; ses octets vivent en mémoire (imgBlobs) et, hors
   démo, en IndexedDB, pour survivre au rechargement : localStorage n'en garde que la
   place et la taille. Un échec est capturé — l'image sera seulement oubliée au
   rechargement, comme avant la v1.5. */
const imgBlobs = new Map(), imgEls = new Map();
const newImgId = () => 'img-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
/* un seul élément par image, partagé par ses copies d'une planche à l'autre */
function imageOf(id){
  if (!imgEls.has(id)){
    const el = new Image();
    el.onload = requestDraw;
    el.src = URL.createObjectURL(imgBlobs.get(id));
    imgEls.set(id, el);
  }
  return imgEls.get(id);
}
const IDB_NAME = 'fl-briefing-board';
let idbOpen = null;
function idbStore(mode){
  idbOpen = idbOpen || new Promise((ok, ko) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('images');
    r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
  });
  return idbOpen.then(db => db.transaction('images', mode).objectStore('images'));
}
const idbReq = q => new Promise((ok, ko) => { q.onsuccess = () => ok(q.result); q.onerror = () => ko(q.error); });
/* la démo n'écrit jamais chez le visiteur : ni localStorage, ni IndexedDB */
const idbPut = (id, blob) => DEMO ? Promise.resolve() : idbStore('readwrite').then(s => idbReq(s.put(blob, id)));
const idbGet = id => idbStore('readonly').then(s => idbReq(s.get(id)));
/* ne garder en IndexedDB que les images qu'une planche cite encore */
async function idbKeep(ids){
  const keys = await idbStore('readonly').then(s => idbReq(s.getAllKeys()));
  const gone = keys.filter(k => !ids.has(k));
  if (gone.length){ const s = await idbStore('readwrite'); await Promise.all(gone.map(k => idbReq(s.delete(k)))); }
}

function addImage(blob){
  const id = newImgId();
  imgBlobs.set(id, blob);
  const el = imageOf(id);
  const place = () => {
    const k = Math.min(stage.clientWidth / el.width, planH() / el.height, 1);
    let w2 = el.width * k, h2 = el.height * k, x = (stage.clientWidth - w2) / 2, y = (planH() - h2) / 2;
    if (cam){ [x, y] = s2w(x, y); w2 /= camK(); h2 /= camK(); }   // posée sur le terrain
    snapshot();
    objs.unshift({ t:'img', id, el, x, y, w2, h2, w0:w2, h0:h2, c:'#000', w:1 });
    commit();
    idbPut(id, blob).catch(() => {});
  };
  if (ready(el)) place(); else el.addEventListener('load', place, { once: true });
}

/* au démarrage, chaque image retrouve ses octets ; celles qu'on ne retrouve plus sont
   retirées, et on le dit. Puis IndexedDB ne garde que ce qui est encore cité. */
async function restoreImages(){
  const ids = new Set(boards.flatMap(b => b.objs.filter(o => o.t === 'img').map(o => o.id)));
  for (const id of ids)
    if (!imgBlobs.has(id)){ const blob = await idbGet(id).catch(() => null); if (blob) imgBlobs.set(id, blob); }
  stash();                                 // un geste a pu changer la planche pendant la lecture
  let lost = 0;
  for (const b of boards){
    const n = b.objs.length;
    b.objs = b.objs.filter(o => o.t !== 'img' || imgBlobs.has(o.id));
    lost += n - b.objs.length;
    for (const o of b.objs) if (o.t === 'img') o.el = imageOf(o.id);
  }
  objs = boards[cur].objs;
  if (lost) toast(lost > 1 ? `${lost} images de fond n'ont pas pu être relues` : 'Une image de fond n\'a pas pu être relue');
  if (!DEMO) idbKeep(new Set(boards.flatMap(b => b.objs.filter(o => o.t === 'img').map(o => o.id)))).catch(() => {});
  commit();
}
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', e => {
  e.preventDefault();
  const files = [...e.dataTransfer.files];
  const miz = files.find(f => /\.miz$/i.test(f.name));
  if (miz) return openMission(miz);                      // une mission DCS
  const brief = files.find(f => /\.json$/i.test(f.name) || f.type === 'application/json');
  if (brief) return openBriefing(brief);                 // un briefing enregistré
  const f = files.find(f => f.type.startsWith('image/'));
  if (f) addImage(f);
});
addEventListener('paste', e => {
  const it = [...e.clipboardData.items].find(i => i.type.startsWith('image/'));
  if (it) addImage(it.getAsFile());
});

/* ---------- palette de formes ---------- */
for (const [g, titre] of GROUPS){
  const h = document.createElement('div'); h.className = 'grp'; h.textContent = titre;
  pal.appendChild(h);
  const grid = document.createElement('div'); grid.className = 'grid';
  pal.appendChild(grid);

  for (const k in SHAPES){
    if (SHAPES[k].g !== g) continue;
    const b = document.createElement('button');
    b.className = 'tile' + (tool === 'sym' && k === symKey ? ' on' : '');
    b.dataset.k = k; b.title = SHAPES[k].label;

    const tc = document.createElement('canvas');
    tc.width = 52; tc.height = 46;
    const c2 = tc.getContext('2d');
    c2.strokeStyle = c2.fillStyle = '#B7C3CF';
    paintSym(c2, { t:'sym', k, x:26, y:23, a:SHAPES[k].tileA || 0, s:(SHAPES[k].tile || .45) * 34/SIZE,
                   c:'#B7C3CF', w:2.4, n:1, mini:true });
    b.appendChild(tc);

    const lab = document.createElement('span'); lab.textContent = SHAPES[k].label;
    b.appendChild(lab);
    grid.appendChild(b);
  }
}
pal.addEventListener('click', e => {
  const b = e.target.closest('.tile'); if (!b) return;
  finishZone();
  symKey = b.dataset.k; tool = 'sym'; sel = null; draw();
  pal.querySelectorAll('.tile').forEach(t => t.classList.toggle('on', t === b));
  document.querySelectorAll('[data-tool]').forEach(t => t.classList.remove('on'));
});

/* un seul outil courant, que le bouton soit dans la barre ou dans le bandeau de la coupe */
function setTool(t){
  finishZone();
  tool = t;
  document.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x.dataset.tool === t));
  pal.querySelectorAll('.tile').forEach(x => x.classList.remove('on'));
  if (tool !== 'select') sel = null;
  draw();
}
document.getElementById('profbar').addEventListener('click', e => {
  const b = e.target.closest('[data-tool]'); if (b) setTool(b.dataset.tool);
});
document.getElementById('ceil').onchange  = e => reprof(+e.target.value, prof.range);
document.getElementById('range').onchange = e => reprof(prof.ceil, +e.target.value);
document.getElementById('linked').onchange = e => setLinked(e.target.checked);

/* ---------- barre ---------- */
const LINED = ['stroke', 'line', 'arrow', 'rect', 'circle', 'zone', 'terrain', 'dome', 'block'];

bar.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.tool) setTool(b.dataset.tool);
  if (b.dataset.color){
    color = b.dataset.color;
    bar.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b));
    if (sel){ snapshot(); sel.c = color; commit(); }     // recolorer la sélection
  }
  if (b.dataset.w){
    width = +b.dataset.w;
    bar.querySelectorAll('.wd').forEach(x => x.classList.toggle('on', x === b));
    if (sel && sel.t !== 'ruler'){ snapshot(); sel.w = width; commit(); }
  }
  if (b.dataset.ls){
    ls = b.dataset.ls;
    bar.querySelectorAll('.ls').forEach(x => x.classList.toggle('on', x === b));
    if (sel && LINED.includes(sel.t)){ snapshot(); sel.ls = ls; commit(); }
  }
});

const $ = id => document.getElementById(id);
$('undo').onclick  = () => restore(past, future);
$('redo').onclick  = () => restore(future, past);
$('theme').onclick = () => { dark = !dark; draw(); };
$('flip').onclick  = () => {      // flèche simple / double
  if (sel && (sel.t === 'arrow' || sel.t === 'line')){ snapshot(); sel.both = !sel.both; commit(); }
};
$('front').onclick = () => {
  if (!sel) return;
  snapshot(); objs.splice(objs.indexOf(sel), 1); objs.push(sel); commit();
};
$('dup').onclick = () => {
  if (!sel || sel.t === 'kframe') return;                   // un seul cadre par planche
  snapshot();
  const kk = (sel.v || 'm') === 'm' ? camK() : 1;
  const o = snap(sel); delete o.locked; delete o.uid; move(o, 24 / kk, 24 / kk);   // la copie naît libre, et neuve
  if (o.t === 'sym' && SHAPES[o.k].num) o.n = wpN++;
  objs.push(o); sel = o; commit();
};
/* ancrer : la sélection ne se déplace plus, ne tourne plus, ne s'efface plus ; on pose
   par-dessus. Couleur, trait et étiquette restent libres. */
$('lock').onclick = () => {
  if (!sel){ toast('Sélectionnez d\'abord l\'objet à ancrer (outil Sélection, V)'); return; }
  snapshot();
  if (sel.locked) delete sel.locked; else sel.locked = true;
  commit();
};
/* un refus n'est jamais muet : message bref en haut du tableau */
const LOCKED = 'Objet ancré — 📌 ou K pour le libérer';
let toastT = 0;
function toast(msg){
  const t = $('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2200);
}
$('clear').onclick = () => {
  if (objs.length && confirm(`Effacer la planche « ${boards[cur].name} » ?`)){
    snapshot(); objs = []; sel = null; wpN = 1; commit();
  }
};
$('scale').onclick = () => {
  if (cam){ alert('Sur une carte, l\'échelle est automatique : distances et caps viennent de la carte.'); return; }
  const r = (sel && sel.t === 'ruler') ? sel : [...objs].reverse().find(o => o.t === 'ruler');
  if (!r){
    alert('Mesurez d\'abord avec la règle (M) une distance que vous connaissez sur la carte, ' +
          'par exemple entre deux waypoints, puis revenez ici.');
    return;
  }
  const len = Math.hypot(r.x2 - r.x1, r.y2 - r.y1), k = unit === 'km' ? KM_PER_NM : 1;
  const v = prompt(unit === 'km' ? 'Distance réelle de cette mesure, en kilomètres (km) :'
                                 : 'Distance réelle de cette mesure, en milles nautiques (NM) :',
                   nmPx ? (len / nmPx * k).toFixed(1) : '');
  if (v === null) return;
  const d = parseFloat(String(v).replace(',', '.'));
  if (!(d > 0)){ alert('Distance invalide.'); return; }
  snapshot(); nmPx = len / (d / k); commit();
};

const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                   .replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'planche';
function stamp(){
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
function download(url, name){ const a = document.createElement('a'); a.download = name; a.href = url; a.click(); }

/* chaque image partagée porte la signature du studio : c'est elle qui circule sur les
   Discord d'escadrons */
function signed(){
  const c = document.createElement('canvas'), g = c.getContext('2d'), r = devicePixelRatio || 1;
  c.width = cv.width; c.height = cv.height;
  g.drawImage(cv, 0, 0);
  g.font = `600 ${11 * r}px ui-sans-serif, system-ui, sans-serif`;
  const tw = g.measureText(SIGNATURE).width;
  g.fillStyle = 'rgba(7,11,16,.8)'; g.fillRect(c.width - tw - 20 * r, c.height - 24 * r, tw + 14 * r, 19 * r);
  g.fillStyle = '#D1A94A'; g.textBaseline = 'middle';
  g.fillText(SIGNATURE, c.width - tw - 13 * r, c.height - 14.5 * r);
  return c;
}
$('png').onclick = () => {
  const keep = sel; sel = null; bare = true;
  try { draw(); download(signed().toDataURL('image/png'), `fl-briefing-${slug(boards[cur].name)}-${stamp()}.png`); }
  finally { sel = keep; bare = false; draw(); }
};

/* ---------- export kneeboard DCS : portrait 768 × 1157 ----------
   DCS étire chaque image du dossier Kneeboard sur toute sa planchette, dont les
   proportions sont 0,142 × 0,214 (Scripts/Aircrafts/_Common/Cockpit/KNEEBOARD :
   declare_kneeboard_device.lua pour la taille, indicator/init.lua pour l'image posée
   sur toute la page). Une page à ces proportions s'affiche sans déformation ; une page
   768 × 1024 y était écrasée d'un huitième en largeur. */
const KB_W = 768, KB_H = Math.round(KB_W * .214 / .142), KB_HEAD = 66, KB_FOOT = 30;
/* la page : un en-tête, un pied, et la coupe en bas, sur toute la largeur, quand elle
   est affichée ; le plan prend le reste (area) */
function kbLayout(){
  const withProf = split && (prof.pane ? !!radarView().own
                                       : objs.some(o => o.v === 'p') || (prof.linked && route.pts.length > 0));
  const sw = stage.clientWidth, kp = (KB_W - 32) / sw, bandH = withProf ? PROF_H * kp : 0;
  const area = { x:16, y:KB_HEAD + 10, w:KB_W - 32, h:KB_H - KB_HEAD - KB_FOOT - 20 - (bandH ? bandH + 12 : 0) };
  return { withProf, sw, kp, bandH, area };
}
/* le cadre a les proportions de la zone du plan : sa largeur est gardée, sa hauteur suit */
const kbAspect = () => { const a = kbLayout().area; return a.w / a.h; };
const kbHeight = f => f.w2 / kbAspect();
/* ce que la page montre du plan. Le cadre, s'il y en a un : il remplit toute la zone du
   plan. Sinon, sur une carte, l'emprise vue à l'écran (ecam) ; sans carte, tous les
   objets, dans la transformation k, ox, oy. */
function kbFit(f){
  const L = kbLayout(), area = L.area;
  if (f && cam) return { ...L, ecam: { x: f.x + f.w2 / 2, y: f.y + kbHeight(f) / 2,
                                       z: REF_Z + Math.log2(area.w / f.w2) } };
  if (f){ const k = area.w / f.w2; return { ...L, k, ox: area.x - f.x * k, oy: area.y - f.y * k }; }
  if (cam){
    const [pw, ph] = viewSize(), kf = Math.min(area.w / pw, area.h / ph);
    return { ...L, ecam: { x: cam.x, y: cam.y, z: cam.z + Math.log2(kf) } };
  }
  const pad = 36;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const o of objs){
    if ((o.v || 'm') !== 'm' || o.t === 'kframe') continue;
    const b = bbox(o);
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h);
  }
  x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
  if (!isFinite(x0)){ x0 = 0; y0 = 0; x1 = 1; y1 = 1; }         // rien sur le plan
  const k = Math.min(area.w / (x1 - x0), area.h / (y1 - y0), 2.2);
  return { ...L, k, ox: area.x + (area.w - (x1 - x0) * k) / 2 - x0 * k,
                    oy: area.y + (area.h - (y1 - y0) * k) / 2 - y0 * k };
}
async function kneeboardCanvas(){
  const planObjs = objs.filter(o => (o.v || 'm') === 'm' && o.t !== 'kframe');
  const { withProf, sw, kp, bandH, area, k, ox, oy, ecam } = kbFit(objs.find(o => o.t === 'kframe'));
  if (!planObjs.length && !withProf && !cam) return null;
  const W = KB_W, H = KB_H, HEAD = KB_HEAD, FOOT = KB_FOOT;
  /* sur une carte, les tuiles sont chargées avant de dessiner, sinon la page sortirait trouée */
  if (ecam) await preloadTiles(ecam, area.w, area.h);

  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const screen = ctx, keepSel = sel;
  ctx = off.getContext('2d'); sel = null; bare = true;
  /* une planche paysage réduite dans une page portrait rendrait les textes illisibles
     en cockpit : les symboles se réduisent, les textes gardent au moins leur taille écran */
  tb = ecam ? 1 : Math.min(1.8, Math.max(1, 1 / k));
  try {
    ctx.fillStyle = BG(); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#0B1220'; ctx.fillRect(0, 0, W, HEAD);
    ctx.fillStyle = '#D1A94A'; ctx.fillRect(0, HEAD - 3, W, 3);
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 12px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#2F8CFF'; ctx.fillText('FL', 18, 24);
    ctx.fillStyle = '#B7C3CF'; ctx.fillText('BRIEFING BOARD', 38, 24);
    ctx.font = '700 24px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#E6EDF5'; ctx.fillText(boards[cur].name, 18, 52);
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'right'; ctx.fillStyle = '#B7C3CF';
    ctx.fillText(`Planche ${cur + 1} / ${boards.length}`, W - 18, 24);
    ctx.fillText(new Date().toLocaleDateString('fr-FR'), W - 18, 52);
    ctx.textAlign = 'left';

    ctx.save();
    ctx.beginPath(); ctx.rect(area.x, area.y, area.w, area.h); ctx.clip();
    if (ecam){
      const keepCam = cam; cam = ecam; vp = { w: area.w, h: area.h };
      try { ctx.translate(area.x, area.y); drawPlan(area.w, area.h); }
      finally { cam = keepCam; vp = null; }
    } else {
      ctx.setTransform(k, 0, 0, k, ox, oy);
      for (const o of planObjs) drawObj(o);
    }
    ctx.restore();

    if (withProf){
      /* la bande de coupe a sa propre réduction : ses textes se règlent sur elle */
      const tbPlan = tb;
      tb = Math.min(1.8, Math.max(1, 1 / kp));
      ctx.save();
      ctx.translate(16, H - FOOT - 10 - bandH); ctx.scale(kp, kp);
      ctx.beginPath(); ctx.rect(0, 0, sw, PROF_H); ctx.clip();
      if (prof.pane) drawRadarPane(sw);
      else {
        drawProfAxes(sw);
        for (const o of objs) if (o.v === 'p') drawObj(o);
        drawRoute(sw);
      }
      ctx.restore();
      tb = tbPlan;
    }

    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = dark ? '#4A5661' : '#7F8C98';
    const dk = cam ? declAt(cam.x, cam.y) : declAt(0, 0);
    ctx.fillText(SIGNATURE + (headRef === 'mag' && dk !== null
      ? ` · caps magnétiques, déclinaison ${fmtDecl(dk)}${magDec !== null ? ' (saisie)' : ' (WMM2025)'}`
      : cam ? ' · caps vrais' : ''), 18, H - 12);
  } finally {
    ctx = screen; sel = keepSel; tb = 1; bare = false;
  }
  return off;
}
$('meas').onclick = () => {
  measOn = !measOn;
  $('meas').classList.toggle('on', measOn);
  if (sel && (sel.t === 'line' || sel.t === 'arrow')){ snapshot(); sel.meas = measOn; commit(); }
};
$('unit').onclick = () => {
  unit = unit === 'nm' ? 'km' : 'nm';
  $('unit').textContent = unit === 'km' ? 'km' : 'NM';
  commit();
};

/* le cadre du kneeboard : un par planche. Le bouton le pose au milieu de la vue, ou l'ôte ;
   il se déplace par son bord et s'agrandit par sa poignée, sans changer de proportions. */
$('kframe').onclick = () => {
  leaveGesture();
  const f = objs.find(o => o.t === 'kframe');
  snapshot();
  if (f){ objs.splice(objs.indexOf(f), 1); if (sel === f) sel = null; commit(); return; }
  const w = stage.clientWidth, h = planH(), a = kbAspect();
  const fh = Math.min(h * .8, w * .8 / a), fw = fh * a;
  const [x, y] = cam ? s2w((w - fw) / 2, (h - fh) / 2) : [(w - fw) / 2, (h - fh) / 2];
  const o = { t:'kframe', x, y, w2: fw / camK(), c:'#D1A94A' };
  objs.push(o); sel = o; commit();
};

$('knee').onclick = async () => {
  leaveGesture();
  const off = await kneeboardCanvas();
  if (!off){ alert('Planche vide : rien à exporter.'); return; }
  download(off.toDataURL('image/png'), `fl-kneeboard-${slug(boards[cur].name)}-${stamp()}.png`);
};

const thSel = document.getElementById('theatre');
for (const t of THEATRES){
  const o = document.createElement('option'); o.value = t.id; o.textContent = t.name; thSel.appendChild(o);
}
thSel.onchange = e => setTheatre(e.target.value);
document.getElementById('mstyle').onchange = e => { if (mapCfg){ mapCfg.style = e.target.value; commit(); } };
document.getElementById('afs').onchange = e => { showAF = e.target.checked; commit(); };
/* version publique : pas de couche d'aérodromes, pas de case pour l'afficher */
if (!AF.length) document.getElementById('afs').parentElement.style.display = 'none';
document.getElementById('zin').onclick  = () => { const [w, h] = viewSize(); zoomAt(w / 2, h / 2, .6); };
document.getElementById('zout').onclick = () => { const [w, h] = viewSize(); zoomAt(w / 2, h / 2, -.6); };
document.getElementById('zfit').onclick = () => {
  const th = mapCfg && THEATRES.find(t => t.id === mapCfg.theatre);
  if (th){ cam = fitCam(th.bounds); commit(); }
};
addEventListener('keyup', e => { if (e.key === ' ') spaceHeld = false; });

$('hdg').onclick = () => { headRef = headRef === 'mag' ? 'true' : 'mag'; commit(); };
$('decl').onclick = () => {
  const v = prompt('Déclinaison magnétique de cette planche, en degrés : Est positif (6 ou 6E), ' +
                   'Ouest négatif (-2 ou 2W).\nRecopiez celle de votre mission DCS pour des caps identiques ' +
                   'au cockpit. Laissez vide pour le calcul automatique sur carte (WMM2025).',
                   magDec === null ? '' : String(magDec).replace('.', ','));
  if (v === null) return;
  const d = parseDecl(v);
  if (d === undefined){ alert('Déclinaison illisible : par exemple 6, 6,5, 6E, 2W ou -2 (entre -30 et 30).'); return; }
  if (d === magDec) return;
  snapshot(); magDec = d; commit();
};

/* ---------- fichier de briefing ----------
   Tout le tableau dans un .json : planches, réglages, images comprises (en data URL),
   pour préparer un briefing sur un poste et le mener sur un autre, ou le passer au
   meneur suivant. `format` et `version` sont vérifiés à l'ouverture. */
const FILE_FORMAT = 'fl-briefing-board', FILE_VERSION = 1;
/* un objet tel qu'il s'écrit : sans l'élément image, qui se recrée à la lecture */
const record = o => { const { el, ...r } = snap(o); return r; };
const boardsRecord = () => boards.map(b => ({ name: b.name, wpN: b.wpN, nmPx: b.nmPx || 0, prof: b.prof, map: b.map,
                                              cam: b.cam, magDec: b.magDec ?? null, objs: b.objs.map(record) }));
const blobData = blob => new Promise((ok, ko) => {
  const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => ko(r.error); r.readAsDataURL(blob);
});
function dataBlob(url){
  const [head, b64] = url.split(','), bin = atob(b64), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: head.slice(5, head.indexOf(';')) });
}
async function briefingFile(){
  stash();
  const out = { format: FILE_FORMAT, version: FILE_VERSION, app: APP.version, saved: new Date().toISOString(),
                cur, unit, split, headRef, boards: boardsRecord(), images: {} };
  for (const b of out.boards) for (const o of b.objs)
    if (o.t === 'img' && !(o.id in out.images) && imgBlobs.has(o.id)) out.images[o.id] = await blobData(imgBlobs.get(o.id));
  return out;
}
$('save').onclick = async () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(await briefingFile())], { type: 'application/json' }));
  download(url, `fl-briefing-${slug(boards[0].name)}-${stamp()}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

/* un fichier reçu vient d'ailleurs : on ne garde que ce que le moteur sait dessiner, et
   une image n'est acceptée qu'en PNG, JPEG, WebP ou GIF */
const KNOWN_T = new Set(['sym', 'arrow', 'line', 'rect', 'circle', 'stroke', 'zone', 'ruler', 'terrain', 'dome',
                         'block', 'text', 'img']);
const IMG_DATA = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
async function openBriefing(file){
  let j = null;
  try { j = JSON.parse(await file.text()); } catch(_){}
  if (!j || j.format !== FILE_FORMAT || j.version !== FILE_VERSION || !Array.isArray(j.boards) || !j.boards.length){
    toast('Ce fichier n\'est pas un briefing FL Briefing Board'); return;
  }
  stash();
  if (boards.some(b => b.objs.length) && !confirm('Ouvrir ce briefing remplace tout le tableau affiché. Continuer ?')) return;
  const blobs = new Map();
  for (const [id, url] of Object.entries(j.images || {}))
    if (typeof url === 'string' && IMG_DATA.test(url)) blobs.set(id, dataBlob(url));
  const keep = o => o && typeof o === 'object' && KNOWN_T.has(o.t) && (o.t !== 'sym' || SHAPES[o.k])
                    && (o.t !== 'img' || blobs.has(o.id));
  const known = m => m && THEATRES.some(t => t.id === m.theatre) ? m : null;
  const okProf = p => p && typeof p === 'object' && p.ceil > 0 && p.range > 0 ? p : undefined;
  leaveGesture();
  boards = j.boards.map(b => ({
    name: String(b.name || 'Phase').slice(0, 80), objs: (Array.isArray(b.objs) ? b.objs : []).filter(keep),
    wpN: b.wpN || 1, nmPx: +b.nmPx || 0, prof: okProf(b.prof), map: known(b.map), cam: known(b.map) && b.cam || null,
    magDec: b.magDec ?? null, past: [], future: [] }));
  for (const [id, blob] of blobs){ imgBlobs.set(id, blob); imgEls.delete(id); idbPut(id, blob).catch(() => {}); }
  for (const b of boards) for (const o of b.objs) if (o.t === 'img') o.el = imageOf(o.id);
  unit = j.unit === 'km' ? 'km' : 'nm'; $('unit').textContent = unit === 'km' ? 'km' : 'NM';
  split = !!j.split; headRef = j.headRef === 'mag' ? 'mag' : 'true';
  load(Math.max(0, Math.min(+j.cur || 0, boards.length - 1)));
  sel = null; renderTabs(); fit(); commit();
  toast(`Briefing ouvert : ${boards.length} planche${boards.length > 1 ? 's' : ''}`);
}
$('open').onclick = () => $('openfile').click();
$('openfile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) openBriefing(f); };

/* ---------- import d'une mission DCS (lot 6) ----------
   Une .miz devient une nouvelle planche : la route du vol choisi (waypoints numérotés,
   altitudes pour la route liée), le bullseye de sa coalition, les défenses aériennes et
   les navires (miz.js). Sur un théâtre dont la projection est mesurée (projections.js),
   tout se pose sur la carte ; sinon, sur une planche sans carte à l'échelle exacte, nord
   de la grille DCS en haut, et ses caps le disent (« G »). */
async function openMission(file){
  let m;
  try { m = await MIZ.readMiz(new Uint8Array(await file.arrayBuffer())); }
  catch (e){ toast('Mission illisible : ' + e.message); return; }
  const base = file.name.replace(/\.miz$/i, '').slice(0, 40) || 'Mission';
  if (m.flights.length > 1) return chooseFlight(m, base);
  importMission(m, m.flights[0] || null, base);
}
/* plusieurs vols pilotables : le meneur choisit le sien */
function chooseFlight(m, base){
  const th = THEATRES.find(t => t.id === m.theatre);
  $('mizinfo').textContent = `${base} · ${th ? th.name : m.theatre} · ${m.flights.length} vols pilotables`;
  $('mizlist').textContent = '';
  for (const f of m.flights){
    const b = document.createElement('button');
    b.textContent = `${f.name || 'Vol sans nom'} · ${f.type} ×${f.units} · ${f.points.length} point${f.points.length > 1 ? 's' : ''}`;
    b.onclick = () => { $('mizbox').hidden = true; importMission(m, f, base); };
    $('mizlist').appendChild(b);
  }
  $('mizbox').hidden = false;
}
$('mizbox').onclick = e => { if (e.target.id === 'mizbox' || e.target.id === 'mizclose') $('mizbox').hidden = true; };

const SIDE_COL = { blue: '#2F8CFF', red: '#FF4D4D', neutrals: '#D1A94A' };
const THREAT_SYM = { sam: 'sam', radar: 'radar', ship: 'ship', carrier: 'carrier' };
function importMission(m, f, base){
  const proj = PROJECTIONS[m.theatre], onMap = !!(proj && THEATRES.some(t => t.id === m.theatre));
  const be = m.bullseye[f ? f.side : 'blue'], wps = f ? f.points : [];
  const all = [...wps, ...m.threats, ...(be ? [be] : [])];
  if (!all.length){ toast('Rien à importer : ni vol pilotable, ni menace, ni bullseye'); return; }
  cancelGesture(); leaveGesture();
  split = true; fit();                                   // la route liée se lit dans la coupe
  let pos, camM = null, nmPxM = 0;
  if (onMap){
    const geo = new Map(all.map(q => [q, MIZ.toGeo(proj, q.x, q.y)]));
    pos = q => { const [la, lo] = geo.get(q); return [lon2x(lo), lat2y(la)]; };
    const la = [...geo.values()].map(g => g[0]), lo = [...geo.values()].map(g => g[1]);
    camM = fitCam([Math.min(...la), Math.min(...lo), Math.max(...la), Math.max(...lo)]);
  } else {
    /* les mètres DCS à l'échelle de l'écran, nord de la grille en haut */
    const xs = all.map(q => q.x), ys = all.map(q => q.y), [vw, vh] = viewSize();
    const dn = Math.max(...xs) - Math.min(...xs) || 1852, de = Math.max(...ys) - Math.min(...ys) || 1852;
    const k = Math.min((vw - 160) / de, (vh - 120) / dn), top = Math.max(...xs), left = Math.min(...ys);
    const ox = (vw - de * k) / 2, oy = (vh - dn * k) / 2;
    pos = q => [ox + (q.y - left) * k, oy + (top - q.x) * k];
    nmPxM = 1852 * k;
  }
  const sym = (k, q, c, extra) => { const [x, y] = pos(q); return { t:'sym', k, x, y, a:0, s: SHAPES[k].s0 || 1, c, w:4, n:0, ...extra }; };
  const out = m.threats.map(t => sym(THREAT_SYM[t.kind], t, SIDE_COL[t.side] || SIDE_COL.neutrals, { lbl: t.name }));
  if (be) out.push(sym('bullseye', be, '#D1A94A'));
  /* le premier point porte le nom du vol : l'étiquette de l'appareil, posé au même endroit, le cacherait */
  wps.forEach((q, i) => {
    const lbl = [i ? '' : f.name, q.name, q.agl ? 'alt. sol' : ''].filter(Boolean).join(' · ');
    out.push(sym('wp', q, '#D1A94A', { n: i + 1, alt: Math.round(q.alt * 3.28084 / 10) * 10,   // mètres DCS → pieds
                                        ...(lbl && { lbl }) }));
  });
  if (f && wps.length){                                    // le vol, sur son départ, tourné vers le point suivant
    const [x0, y0] = pos(wps[0]), [x1, y1] = wps[1] ? pos(wps[1]) : [x0, y0 - 1];
    out.push({ ...sym(f.cat === 'helicopter' ? 'helo' : 'fighter', wps[0], SIDE_COL[f.side] || SIDE_COL.blue),
               a: Math.atan2(x1 - x0, -(y1 - y0)) });
  }
  /* coupe : plafond au-dessus du point le plus haut, largeur sur la longueur de la route */
  const maxFt = Math.max(0, ...wps.map(q => q.alt * 3.28084));
  const nm = wps.slice(1).reduce((s, q, i) => s + Math.hypot(q.x - wps[i].x, q.y - wps[i].y) / 1852, 0);
  const b = { name: base, objs: out, wpN: wps.length + 1, nmPx: nmPxM,
              prof: { ceil: [10000, 20000, 40000, 60000].find(v => v >= maxFt * 1.1) || 60000,
                      range: [10, 20, 40, 80, 160].find(v => v >= nm * 1.08) || 160, linked: wps.length > 1,
                      ...(!onMap && { grid: true }) },
              map: onMap ? { theatre: m.theatre, style: $('mstyle').value || 'topo' } : null, cam: camM,
              magDec: null, past: [], future: [] };
  stash();
  boards.splice(cur + 1, 0, b);
  switchBoard(cur + 1);
  toast(`Mission importée : ${wps.length} point${wps.length > 1 ? 's' : ''} de route, ${m.threats.length} menace`
        + `${m.threats.length > 1 ? 's' : ''}${be ? ', bullseye' : ''}`
        + (onMap ? '' : ' — théâtre sans projection mesurée : planche sans carte, nord de la grille en haut'));
}
$('miz').onclick = () => $('mizfile').click();
$('mizfile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) openMission(f); };

$('about').onclick = () => {
  $('aboutver').textContent = 'v' + APP.version;
  $('aboutcode').hidden = !APP.code; $('aboutcode').href = APP.code || '#';
  $('aboutbox').hidden = false;
};
$('aboutbox').onclick = e => { if (e.target.id === 'aboutbox' || e.target.id === 'aboutclose') $('aboutbox').hidden = true; };

$('split').onclick = () => {
  leaveGesture();
  split = !split; sel = null;
  if (!split && PROF_TOOLS.includes(tool)) setTool('select');
  fit(); commit();
};

/* vue du panneau du bas ; un balayage ne passe pas d'un appareil à l'autre */
$('pane').onchange = e => {
  snapshot();
  prof = { ...prof, pane: e.target.value || undefined, raz: undefined };
  if (prof.pane && PROF_TOOLS.includes(tool)) setTool('select');
  commit();
};
$('rrng').onchange = e => { snapshot(); prof = { ...prof, rrng: +e.target.value }; commit(); };
$('raz').onchange  = e => { snapshot(); prof = { ...prof, raz: +e.target.value }; commit(); };
/* le porteur : l'appareil sélectionné dans la vue de dessus, un seul par planche */
$('own').onclick = () => {
  if (!sel || sel.t !== 'sym' || (SHAPES[sel.k] || {}).g !== 'air' || (sel.v || 'm') !== 'm'){
    toast('Sélectionnez d\'abord un appareil de la vue de dessus (outil Sélection, V)'); return;
  }
  snapshot();
  for (const o of objs) delete o.own;
  sel.own = true;
  commit();
};

/* ---------- mode présentation (lot 5) ----------
   Pour mener un briefing en partage d'écran : plein écran, barres et palette masquées,
   phases au clavier, pointeur laser. Rien de ce qu'on y fait n'entre dans le tableau —
   ni objet, ni historique, ni export. La carte reste mobile : molette, clic droit. */
let presenting = false, laserDown = false, laser = { pts: [], hover: null, stroke: 0 };
const LASER_MS = 1500, LASER_IDLE = 3000;     // durée d'une trace ; le point s'éteint après 3 s d'immobilité
function present(on){
  if (on === presenting) return;
  cancelGesture(); leaveGesture();
  presenting = on; sel = null; laserDown = false; laser = { pts: [], hover: null, stroke: 0 };
  document.body.classList.toggle('present', on);
  if (on){
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    toast('→ ou Espace : phase suivante · ← : précédente · Échap : sortir');
  } else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  presentBadge();
  fit();
}
/* sortir du plein écran par le navigateur (Échap, F11) quitte aussi la présentation */
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && presenting) present(false); });
function presentBadge(){
  $('pbadge').hidden = !presenting;
  if (presenting) $('pbadge').textContent = `${cur + 1} / ${boards.length} · ${boards[cur].name}`;
}
function laserPoint(e){
  const r = cv.getBoundingClientRect(), p = { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() };
  laser.hover = p;
  if (laserDown) laser.pts.push({ ...p, s: laser.stroke });
  requestDraw();
}
/* la trace vivante : ses points de moins de LASER_MS */
function laserTrail(){
  const now = performance.now();
  return laser.pts = laser.pts.filter(p => now - p.t < LASER_MS);
}
function drawLaser(){
  const now = performance.now(), pts = laserTrail(), h = laser.hover, idle = h ? now - h.t : Infinity;
  ctx.save();
  ctx.lineCap = ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.fillStyle = '#FF3B3B';
  for (let i = 1; i < pts.length; i++){
    if (pts[i].s !== pts[i - 1].s) continue;
    const k = 1 - (now - pts[i].t) / LASER_MS;                // la trace pâlit et s'amincit
    ctx.globalAlpha = k; ctx.lineWidth = 2 + 5 * k;
    ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
  }
  if (idle < LASER_IDLE){
    ctx.globalAlpha = Math.min(1, (LASER_IDLE - idle) / 500);
    ctx.shadowColor = '#FF3B3B'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(h.x, h.y, 5, 0, 7); ctx.fill();
  }
  ctx.restore();
  if (pts.length || idle < LASER_IDLE) requestDraw();      // elle s'éteint d'elle-même
}
$('present').onclick = () => present(true);

/* ---------- animation entre phases (lot 7) ----------
   En présentation, passer d'une planche à une autre joue la manœuvre : un objet présent
   des deux côtés (même uid) glisse de sa place à la nouvelle, son cap tourne par le plus
   court chemin ; ce qui n'existe que d'un côté paraît ou disparaît en fondu. Seulement
   entre deux planches du même repère — même théâtre, ou toutes deux sans carte. */
let anim = null;
const ANIM_MS = 1600;
const ease = k => k * k * (3 - 2 * k), HEX = /^#[0-9a-f]{6}$/i;
const sameSpace = (A, B) => !A.map === !B.map && (!A.map || A.map.theatre === B.map.theatre);
function animateTo(i){
  if (i < 0 || i >= boards.length || i === cur) return;
  anim = null;                                           // une transition en cours s'achève d'un coup
  leaveGesture(); stash();
  const A = boards[cur];
  withUids(A.objs);
  load(i); renderTabs(); commit();
  if (!sameSpace(A, boards[i])) return;
  anim = { t0: performance.now(), from: A.objs, camA: A.cam && { ...A.cam } };
  requestDraw();
}
/* l'état de la transition à l'avancement k (0 : planche de départ, 1 : d'arrivée) */
function tweenAt(k){
  const from = new Map(anim.from.map(o => [o.uid, o])), out = [], lerp = (a, b) => a + (b - a) * k;
  for (const b of objs){
    const a = from.get(b.uid);
    if (!a || a.t !== b.t || (a.v || 'm') !== (b.v || 'm')){ out.push({ ...b, __alpha: k }); continue; }
    from.delete(b.uid);
    const o = { ...b };
    for (const key in b) if (key !== 'n' && typeof b[key] === 'number' && typeof a[key] === 'number') o[key] = lerp(a[key], b[key]);
    if (typeof a.a === 'number' && typeof b.a === 'number'){
      const d = ((b.a - a.a) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;   // le plus court chemin
      o.a = a.a + d * k;
    }
    if (a.pts && b.pts && a.pts.length === b.pts.length) o.pts = b.pts.map((p, j) => [lerp(a.pts[j][0], p[0]), lerp(a.pts[j][1], p[1])]);
    if (a.c !== b.c && HEX.test(a.c) && HEX.test(b.c))       // la couleur glisse aussi
      o.c = '#' + [1, 3, 5].map(i => Math.round(lerp(parseInt(a.c.substr(i, 2), 16), parseInt(b.c.substr(i, 2), 16)))
                                      .toString(16).padStart(2, '0')).join('');
    out.push(o);
  }
  for (const a of from.values()) out.unshift({ ...a, __alpha: 1 - k });   // disparus : dessous, en fondu
  return out;
}

$('hide').onclick = () => {
  document.body.classList.toggle('nopal');
  requestAnimationFrame(fit);
};

/* ---------- clavier ---------- */
addEventListener('keydown', e => {
  if (ti.style.display === 'block') return;
  if (presenting){                                           // rien ne s'édite : seules les phases
    const next = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key);
    const prev = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key);
    if (next || prev){ e.preventDefault(); animateTo(cur + (next ? 1 : -1)); }
    else if (e.key === 'Home'){ e.preventDefault(); animateTo(0); }
    else if (e.key === 'End'){ e.preventDefault(); animateTo(boards.length - 1); }
    else if (e.key === 'Escape') present(false);
    else if (e.key === 'F5') e.preventDefault();
    return;
  }
  if (e.key === 'F5' && !e.ctrlKey && !e.shiftKey){ e.preventDefault(); present(true); return; }
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z'){ e.preventDefault(); $(e.shiftKey ? 'redo' : 'undo').click(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'y'){ e.preventDefault(); $('redo').click(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'd'){ e.preventDefault(); $('dup').click(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 's'){ e.preventDefault(); $('save').click(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'o'){ e.preventDefault(); $('open').click(); return; }
  if (e.ctrlKey || e.metaKey) return;

  if (draft && draft.t === 'zone' && e.key === 'Enter'){ finishZone(); return; }
  if (e.key === 'Escape'){ backToSelect(); return; }
  if (e.key === 'PageDown'){ e.preventDefault(); switchBoard(cur + 1); return; }
  if (e.key === 'PageUp'){   e.preventDefault(); switchBoard(cur - 1); return; }
  if (e.key === 'Delete' || e.key === 'Backspace'){
    if (sel && sel.locked) toast(LOCKED);
    else if (sel){ snapshot(); objs.splice(objs.indexOf(sel), 1); sel = null; commit(); }
    return;
  }

  /* écran radar sélectionné : ↑ ↓ changent l'échelle, ← → l'azimut balayé, comme ses
     boutons. Ce sont des réglages, pas une géométrie : un écran ancré les accepte. */
  const sc = sel && sel.t === 'sym' && (SHAPES[sel.k] || {}).scope;
  if (sc && e.key.startsWith('Arrow')){
    e.preventDefault();
    const vert = e.key === 'ArrowUp' || e.key === 'ArrowDown', list = vert ? sc.ranges : sc.azs;
    const f = vert ? 'rng' : 'az', cur = sel[f] ?? sc[f];
    const v = list && list[Math.max(0, Math.min(list.length - 1,
                           list.indexOf(cur) + (e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : -1)))];
    if (v !== undefined && v !== cur){ snapshot(); sel[f] = v; commit(); }
    return;
  }
  /* rotation fine de la sélection au clavier — une forme droite sans tige n'a pas de cap */
  const still = sel && sel.t === 'sym' && SHAPES[sel.k].upright && !SHAPES[sel.k].stem;
  if (sel && sel.t === 'sym' && !still && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')){
    e.preventDefault();
    if (sel.locked){ toast(LOCKED); return; }
    snapshot();
    sel.a += (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? .01745 : .0873);
    commit(); return;
  }
  if (e.key === ' ' && cam){ spaceHeld = true; e.preventDefault(); return; }
  if (cam && (e.key === '+' || e.key === '=')){ const [w, h] = viewSize(); zoomAt(w / 2, h / 2, .5); return; }
  if (cam && e.key === '-'){ const [w, h] = viewSize(); zoomAt(w / 2, h / 2, -.5); return; }
  if (k === 'k'){ $('lock').click(); return; }
  const map = { v:'select', p:'pen', a:'arrow', l:'line', c:'circle', r:'rect', t:'text', e:'erase',
                z:'zone', m:'ruler', h:'pan' };
  if (map[k]) bar.querySelector(`[data-tool="${map[k]}"]`).click();
});

/* ---------- persistance (hors images) ---------- */
function commit(){
  withUids(objs);
  draw();
  $('scale').title = cam ? 'Échelle automatique : distances et caps viennent de la carte'
                  : nmPx ? `Échelle de la planche : 1 NM = ${nmPx.toFixed(1)} px — cliquer pour réétalonner`
                          : 'Échelle non étalonnée : mesurez une distance connue avec la règle, puis cliquez';
  $('scale').classList.toggle('on', !!(cam || nmPx));
  $('scale').textContent = cam ? 'Échelle auto' : 'Échelle';
  $('hdg').textContent = headRef === 'mag' ? 'Cap mag.' : 'Cap vrai';
  $('hdg').classList.toggle('on', headRef === 'mag');
  const dc = cam ? declAt(cam.x, cam.y) : declAt(0, 0);
  $('decl').textContent = dc === null ? 'Décl. ?' : 'Décl. ' + fmtDecl(dc);
  $('decl').title = magDec !== null ? 'Déclinaison saisie pour cette planche — cliquer pour la changer ou revenir au calcul automatique'
    : cam ? 'Déclinaison calculée au centre de la vue par le modèle WMM2025 — cliquer pour saisir celle de votre mission'
    : 'Déclinaison inconnue sans carte — cliquer pour la saisir (celle de votre mission DCS)';
  $('decl').classList.toggle('warn', headRef === 'mag' && dc === null);
  $('ceil').value = prof.ceil; $('range').value = prof.range; $('linked').checked = !!prof.linked;
  syncPane();
  try {
    stash();
    if (DEMO) return;                        // la démo ne touche pas au tableau du visiteur
    localStorage.setItem(KEY, JSON.stringify({ cur, unit, split, showAF, headRef, boards: boardsRecord() }));
  } catch(_){}
}

/* ---------- mode démo : ?demo ouvre un briefing d'exemple, sans rien enregistrer ----------
   C'est la page d'accueil de la démo en ligne : un visiteur voit tout de suite une frappe
   préparée au Caucase — carte, route liée, coupe, deux phases. Coordonnées réelles de
   Batumi, Senaki et Kutaïssi, indépendantes des données d'aérodromes. */
const DEMO = /[?&]demo\b/.test(location.search);
function demoBoards(){
  const P = (lat, lon) => [lon2x(lon), lat2y(lat)];
  const zoom = 8.6, d = v => v / 2 ** (zoom - REF_Z);     // pixels écran -> terrain à ce zoom
  const [bx, by] = P(41.61, 41.60), [sx, sy] = P(42.24, 42.05), [kx, ky] = P(42.18, 42.48);
  const B = '#2F8CFF', R = '#FF4D4D', G = '#D1A94A', O = '#FF8A00', Wh = '#E6EDF5';
  const sym = (k, x, y, a, c, s = 1, extra = {}) =>
    ({ t:'sym', k, x, y, a, s: (SHAPES[k].s0 || 1) * s, c, w:4, n:0, ...extra });
  const ceil = 40000, range = 80;
  /* d'une planche à l'autre, les mêmes objets portent le même uid : l'animation les suit */
  const withUid = (p, list) => list.map((o, i) => ({ ...o, uid: p + i }));
  const yA = ft => groundY() - ft / ceil * (groundY() - PROF_TOP);
  const gx = nm => PROF_L + nm * (PROF_REF_W - PROF_L) / range;
  const common = () => withUid('c', [
    { t:'zone', pts:[[kx + d(20), ky - d(150)], [kx + d(200), ky - d(150)], [kx + d(200), ky + d(20)],
                     [kx + d(20), ky + d(20)]], c:R, w:3, ls:'dot', lbl:'MEZ SA-11' },
    { t:'terrain', v:'p', pts:[[PROF_L, groundY()], [gx(10), yA(2500)], [gx(24), yA(7000)], [gx(32), yA(3500)],
                               [gx(44), yA(9500)], [gx(56), yA(4000)], [gx(66), yA(1500)], [gx(80), groundY()]],
      c:'#7F8C98', w:2, ls:'solid' },
    { t:'dome', v:'p', x1:gx(74), y1:groundY(), x2:gx(80), y2:yA(22000), cx:gx(74), cy:0, c:R, w:3, ls:'dot', lbl:'SA-11' },
    sym('wp', bx + d(40), by - d(10), 0, G, 1, { n:1, alt:3000, lbl:'IP' }),
    sym('wp', sx, sy - d(60), 0, G, 1, { n:2, alt:15000 }),
    sym('wp', kx - d(60), ky + d(40), 0, G, 1, { n:3, alt:500 }),
    sym('sam', kx + d(90), ky - d(60), 0, R, 1, { lbl:'SA-11' }),
    sym('awacs', bx - d(160), by - d(230), 1.57, G, .8, { lbl:'MAGIC' }),
  ]);
  const ingress = [...common(),
    sym('fighter', bx - d(150), by + d(40), .8, B, 1, { lbl:'UZI 1-1', uid:'uzi11' }),   // en mer, en approche
    sym('fighter', bx - d(115), by + d(75), .8, B, 1, { lbl:'UZI 1-2' }),
    { t:'arrow', x1:bx - d(125), y1:by + d(20), x2:sx - d(25), y2:sy - d(45), cx:bx - d(40),
      cy:(by + sy) / 2 - d(30), bent:true, c:B, w:4, ls:'dash', meas:true },
    sym('fighter', gx(9), yA(5500), -.22, B, .9, { v:'p', lbl:'UZI 1-1', uid:'uzi11p' }),   // en montée vers le WP2
  ];
  const attaque = [...common(),
    sym('fighter', kx - d(110), ky + d(20), 1.4, O, 1, { lbl:'UZI 1-1', uid:'uzi11' }),
    { t:'arrow', x1:kx - d(95), y1:ky + d(25), x2:kx + d(60), y2:ky - d(20), cx:kx, cy:ky + d(40),
      bent:true, c:O, w:5, ls:'solid', meas:true },
    sym('target', kx + d(70), ky - d(25), 0, O, 1.1, { lbl:'DÉPÔT' }),
    sym('fighter', gx(66), yA(8000), -.6, O, .9, { v:'p', lbl:'Pop-up', uid:'uzi11p' }),
    sym('bomb', gx(69), yA(5500), .8, O, .8, { v:'p' }),
    sym('blast', gx(71), groundY() - 10, 0, O, .7, { v:'p' }),
  ];
  const view = { x: (bx + kx) / 2, y: (by + ky) / 2 + (ky - by) * .1, z: zoom };
  const board = (name, objs) => ({ name, objs, wpN: 4, nmPx: 0, prof: { ceil, range, linked: true },
    map: { theatre: 'Caucasus', style: 'topo' }, cam: { ...view }, magDec: null, past: [], future: [] });
  /* une planche sans carte : l'écran radar du F/A-18C en TWS, tel qu'on l'explique au
     briefing (docs/RADAR.md) — écran ancré, pistes posées dessus */
  const GR = '#34D399', ink = { w:3 };
  const radar = [
    sym('fa18_tws', 380, 200, 0, GR, .8, { locked:true }),
    sym('fa18_brick', 428, 138, 0, GR, .9),
    sym('fa18_brick', 362, 250, 0, GR, .9),
    sym('fa18_hafu_h', 402, 162, 2.6, R, .9, { ...ink, mark:'ls' }),
    sym('fa18_hafu_u', 344, 140, 3.5, G, .9, { ...ink, mark:'dt2' }),
    sym('fa18_hafu_f', 334, 236, .2, GR, .9, ink),
    sym('fa18_tdc', 428, 138, 0, G, .9, ink),                 // le curseur sur un contact brut
    { t:'text', s:'F/A-18C · RDR ATTK en TWS', x:640, y:110, c:Wh, w:4 },
    { t:'text', s:'étoile : L&S, piste prioritaire', x:640, y:140, c:R, w:2 },
    { t:'text', s:'losange : DT2, deuxième piste', x:640, y:164, c:G, w:2 },
    { t:'text', s:'briques : contacts bruts (HITS)', x:640, y:188, c:GR, w:2 },
  ];
  /* le même exercice au F-16C, lu dans son propre manuel : FCR en TWS */
  const WH = '#E6EDF5';
  const viper = [
    sym('f16_tws', 380, 200, 0, '#4FC3F7', .8, { locked:true }),
    sym('f16_track', 400, 142, 2.4, G, .9, ink),
    sym('f16_systrack', 432, 176, 3.6, WH, .9, { ...ink, mark:'bug' }),
    sym('f16_hot', 352, 238, 0, WH, .9, ink),
    sym('f16_cold', 330, 128, 0, WH, .9, ink),
    sym('f16_cursor', 352, 238, 0, WH, .9, ink),
    { t:'text', s:'F-16C · FCR en TWS', x:640, y:110, c:Wh, w:4 },
    { t:'text', s:'cercle : cible désignée (bugged)', x:640, y:140, c:WH, w:2 },
    { t:'text', s:'jaune : piste TWS · blanc : piste système', x:640, y:164, c:G, w:2 },
    { t:'text', s:'trait sous le carré : cible chaude', x:640, y:188, c:WH, w:2 },
  ];
  const flat = (name, objs) => ({ name, objs, wpN:1, nmPx:0, prof:{ ceil, range, linked:false }, map:null, cam:null,
                                  magDec:null, past:[], future:[] });
  /* l'interception vue par le radar du porteur : trois bandits, trois aspects — de face,
     au travers, qui s'éloigne. Le panneau du bas montre la vue radar liée. */
  const at = (dx, dy) => [view.x + d(dx), view.y + d(dy)];
  const [ox, oy] = at(0, 150), [h1x, h1y] = at(0, -80), [h2x, h2y] = at(130, -30), [h3x, h3y] = at(-110, -50);
  const beamA = Math.atan2(oy - h2y, ox - h2x);            // cap perpendiculaire à la ligne de visée
  const interception = [
    sym('fighter', ox, oy, 0, B, 1, { lbl:'UZI 1-1', own:true }),
    sym('fighter', h1x, h1y, Math.PI, R, 1, { lbl:'BANDIT 1' }),
    sym('fighter', h2x, h2y, beamA, R, 1, { lbl:'BANDIT 2' }),
    sym('fighter', h3x, h3y, 0, R, 1, { lbl:'BANDIT 3' }),
  ];
  return [board('Ingress', ingress), board('Attaque', attaque),
          { ...board('Interception', interception), wpN:1, prof:{ ceil, range, linked:false, pane:'fa18', rrng:40 } },
          flat('Radar F/A-18C', radar), flat('Radar F-16C', viper)];
}

(function boot(){
  let data = null;
  try { data = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(_){}
  if (!data){
    try {
      const v2 = JSON.parse(localStorage.getItem(OLD_KEY) || 'null');
      if (v2 && Array.isArray(v2.objs)) data = { cur:0, boards:[{ name:'Phase 1', objs:v2.objs, wpN:v2.wpN }] };
    } catch(_){}
  }
  boards = (data && Array.isArray(data.boards) && data.boards.length)
    ? data.boards.map(b => ({ name: b.name || 'Phase', objs: Array.isArray(b.objs) ? b.objs : [],
                              wpN: b.wpN || 1, nmPx: b.nmPx || 0, prof: b.prof,
                              map: b.map || null, cam: b.cam || null, magDec: b.magDec ?? null,
                              past: [], future: [] }))
    : [{ name:'Phase 1', objs:[], wpN:1, nmPx:0, past:[], future:[] }];
  if (data && data.unit === 'km'){ unit = 'km'; $('unit').textContent = 'km'; }
  split = !!(data && data.split);
  if (data && data.showAF === false) showAF = false;
  if (data && data.headRef === 'mag') headRef = 'mag';
  if (DEMO){
    boards = demoBoards(); split = true; showAF = true;
    document.body.classList.add('demo');
  }
  load(Math.min(DEMO ? 0 : (data && data.cur) || 0, boards.length - 1));
  renderTabs();
  fit();
  setTool(tool);                           // l'outil d'ouverture, allumé dans la barre
  commit();
  restoreImages();
})();
