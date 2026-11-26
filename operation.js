/* FL Briefing Board — l'opération FlightLedger (lot 31).
   FlightLedger ouvre le Board sur une opération : briefing.flightledger.io/?op=<id>&t=<jeton>.
   Le jeton vaut 15 minutes, pour ce compte et cette opération ; FlightLedger revérifie les
   droits à chaque lecture. Le Board lit alors, sans cookie :
     - la mission jointe (.miz), importée comme d'habitude (vue pilote) ;
     - le débrief : les vols de l'opération et leurs liens vers FlightLedger ;
     - les traces simplifiées des vols, posées sur une planche à part : chaque vol se coche
       « sur la carte », une couleur par pilote (lot 32, traces.js).
   Rien n'est enregistré dans le navigateur pour une opération (OPERATION, NO_STORE dans
   board.js), comme pour la démo ; le jeton quitte la barre d'adresse dès la lecture. */

const OP_API = 'https://api.flightledger.io';
const OP_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const OP = (() => {
  if (typeof OPERATION === 'undefined' || !OPERATION) return null;
  const q = new URLSearchParams(location.search);
  /* l'adresse de l'API se change pour essayer le Board en local, jamais en ligne */
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const st = { id: q.get('op') || '', token: q.get('t') || '', api: (local && q.get('api')) || OP_API,
               title: '', url: '', file: '', debrief: null, tracks: null, shown: new Set(), pages: [], types: [],
               urls: new Map(), base: '', theatre: '', tab: 'kb', type: null, error: '', missionNote: '' };
  /* le jeton quitte la barre d'adresse : il ne se copie pas avec le lien */
  try {
    const u = new URL(location.href);
    u.searchParams.delete('t'); u.searchParams.delete('api');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  } catch(_){}
  return st;
})();

/* un refus de FlightLedger, dit au pilote : jamais un code */
function opRefusal(status, code){
  if (status === 410) return tr("Ce lien du Board a expiré : rouvrez le Board depuis la page de l'opération sur FlightLedger.");
  if (status === 409) return tr("Mission sans fichier : l'opération a choisi une mission du serveur. Joignez le .miz à l'opération sur FlightLedger pour la carte et les kneeboards.");
  if (status === 404) return tr("L'opération n'a pas encore de mission.");
  if (status === 403 && code === 'BOARD_LINK_INVALID') return tr("Ce lien ne correspond à aucune opération : rouvrez le Board depuis la page de l'opération.");
  if (status === 403) return tr("Vous n'avez plus accès au Briefing Board de cette opération.");
  if (status === 0) return tr("FlightLedger ne répond pas : vérifiez votre connexion, puis rouvrez le Board depuis la page de l'opération.");
  return tr('FlightLedger a refusé la lecture ({0}) : rouvrez le Board depuis la page de l\'opération.', status);
}
async function opFetch(what){
  let r;
  try {
    r = await fetch(`${OP.api}/board/operations/${OP.id}/${what}?t=${encodeURIComponent(OP.token)}`,
                    { credentials: 'omit', cache: 'no-store' });
  } catch(_){ throw { status: 0 }; }
  if (!r.ok){
    let body = {};
    try { body = await r.json(); } catch(_){}
    throw { status: r.status, code: body.code || '' };
  }
  return r;
}
/* le nom du fichier, tel que FlightLedger l'a gardé (Content-Disposition) */
function opFilename(r){
  const h = r.headers.get('Content-Disposition') || '';
  const star = /filename\*=utf-8''([^;]+)/i.exec(h), plain = /filename="([^"]+)"/i.exec(h);
  try { if (star) return decodeURIComponent(star[1]); } catch(_){}
  return plain ? plain[1] : 'mission.miz';
}

const opTime = iso => new Date(iso).toLocaleString(LOCALE, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const opEl = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v);
  for (const k of kids) if (k !== null && k !== undefined && k !== false) e.append(k);
  return e;
};

/* ---------- le panneau de l'opération ---------- */
function opRender(){
  const body = $('opbody');
  body.textContent = '';
  $('optitle').textContent = OP.title || tr('Opération FlightLedger');
  const link = $('oplink');
  link.hidden = !OP.url; if (OP.url) link.href = OP.url;
  for (const b of document.querySelectorAll('#optabs button')) b.classList.toggle('on', b.dataset.tab === OP.tab);
  if (OP.error){ body.append(opEl('p', { class: 'operr', role: 'alert' }, OP.error)); return; }
  if (OP.tab === 'kb') opRenderKneeboards(body); else opRenderDebrief(body);
}

function opRenderKneeboards(body){
  if (OP.missionNote){ body.append(opEl('p', { class: 'opnote' }, OP.missionNote)); return; }
  if (!OP.file){ body.append(opEl('p', { class: 'opnote' }, tr('Lecture de la mission…'))); return; }
  if (!OP.pages.length){ body.append(opEl('p', { class: 'opnote' }, tr("Cette mission n'a pas de kneeboard."))); return; }
  const types = OP.types.length ? OP.types : [{ type: null, slot: true, count: OP.pages.length }];
  if (!types.some(t => sameKbType(t.type, OP.type))) OP.type = types[0].type;
  const pick = opEl('div', { class: 'optypes', role: 'group', 'aria-label': tr('Appareil') });
  for (const t of types){
    const label = t.type ? tr(t.count > 1 ? '{0} · {1} pages' : '{0} · {1} page', t.type, t.count)
                         : tr(t.count > 1 ? 'Tous les appareils · {0} pages' : 'Tous les appareils · {0} page', t.count);
    const b = opEl('button', { type: 'button', 'data-type': t.type || '' }, label);
    b.classList.toggle('on', sameKbType(t.type, OP.type));
    if (!t.slot) b.title = tr('Aucune place joueur sur cet appareil dans la mission');
    b.onclick = () => { OP.type = t.type; opRender(); };
    pick.append(b);
  }
  body.append(pick);
  const shown = OP.type ? MIZ.kneeboardPages(OP.pages, OP.type) : OP.pages.filter(k => !k.type);
  body.append(opEl('p', { class: 'opnote' }, tr('Les pages communes, puis celles de l\'appareil, dans l\'ordre des fichiers de la mission.')));
  const grid = opEl('div', { class: 'opkb' });
  shown.forEach((k, i) => {
    const img = opEl('img', { src: opPageUrl(k), alt: k.file, loading: 'lazy' });
    const b = opEl('button', { type: 'button', title: k.file }, img, opEl('span', {}, k.file.replace(/\.(png|jpe?g)$/i, '')));
    b.onclick = () => opView(shown, i);
    grid.append(b);
  });
  body.append(grid);
}
const sameKbType = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();
function opPageUrl(k){
  if (!OP.urls.has(k.name)) OP.urls.set(k.name, URL.createObjectURL(new Blob([k.data], { type: k.mime })));
  return OP.urls.get(k.name);
}
/* la visionneuse : une page à la fois, ← et → pour tourner */
let opViewing = null;
function opView(pages, i){
  opViewing = { pages, i: (i + pages.length) % pages.length };
  const k = pages[opViewing.i];
  $('kbimg').src = opPageUrl(k); $('kbimg').alt = k.file;
  $('kbcap').textContent = tr('{0} — page {1} sur {2}', k.file, opViewing.i + 1, pages.length);
  $('kbview').hidden = false;
}
const opViewClose = () => { $('kbview').hidden = true; opViewing = null; };
function opViewKeys(e){
  if (!opViewing) return;
  if (e.key === 'Escape') opViewClose();
  else if (e.key === 'ArrowLeft') opView(opViewing.pages, opViewing.i - 1);
  else if (e.key === 'ArrowRight') opView(opViewing.pages, opViewing.i + 1);
  else return;
  e.preventDefault(); e.stopPropagation();
}

const OP_STATUS = {
  flew: tr('A volé'), no_flight: tr('Annoncé, sans vol'), unexpected: tr('Venu sans réponse'), window_unknown: tr('Créneau inconnu'),
};
const OP_TRACK = {
  purged: tr('trace effacée : la conservation de son offre est passée'),
  protected: tr("positions brouillées à l'enregistrement"),
  none: tr("pas de trace gardée par l'analyse"),
};
function opRenderDebrief(body){
  const d = OP.debrief;
  if (!d){ body.append(opEl('p', { class: 'opnote' }, OP.debriefNote || tr('Lecture du débrief…'))); return; }
  const t = d.totals || {};
  if (t.flew !== null && t.flew !== undefined)
    body.append(opEl('p', { class: 'opnote' }, tr('{0} annoncés · {1} ont volé · {2} sans vol · {3} venus sans réponse',
                                                    t.declared, t.flew, t.no_flight ?? 0, t.unexpected ?? 0)));
  else body.append(opEl('p', { class: 'opnote' }, tr("L'opération n'a pas de date : ses vols ne se comptent pas encore.")));
  if (d.view === 'own') body.append(opEl('p', { class: 'opnote' }, tr("Vos vols seulement : vous êtes invité hors de l'unité de l'opération.")));
  const ok = TRACES.drawable(OP.tracks), colors = TRACES.pilotColors(d.rows, ok);
  const draw = opEl('button', { type: 'button', class: 'opdraw' }, tr('Traces sur la carte'));
  draw.onclick = () => opDrawTracks(false);
  body.append(draw);
  opDrawState(draw);
  if (OP.tracks && OP.tracks.truncated) body.append(opEl('p', { class: 'opnote' }, tr('Les {0} premiers vols seulement sur la carte.', OP.tracks.max_flights)));
  const trackOf = id => (OP.tracks && OP.tracks.tracks || []).find(x => x.flight_id === id);
  const drawn = new Set(ok.map(x => x.flight_id));
  const list = opEl('ul', { class: 'opflights' });
  for (const row of d.rows || []){
    const mine = ok.some(x => x.pseudo === row.pseudo);
    const swatch = mine ? opEl('span', { class: 'opswatch', style: 'background:' + colors.get(row.pseudo), 'aria-hidden': 'true' }) : null;
    const li = opEl('li', {}, swatch, opEl('b', {}, row.pseudo), ' · ', OP_STATUS[row.status] || row.status);
    if (row.flights && row.flights.length){
      const ul = opEl('ul');
      for (const f of row.flights){
        const what = [f.callsign, f.mission_name].filter(Boolean).join(' · ') || tr('Vol');
        const item = opEl('li', {}, opTime(f.recording_started_at), ' — ', what);
        const tk = f.flight_id && trackOf(f.flight_id);
        if (tk && tk.aircraft) item.append(' · ', tk.aircraft);
        if (f.hidden) item.append(' · ', tr('vol privé'));
        if (f.url) item.append(' · ', opEl('a', { href: f.url, target: '_blank', rel: 'noopener noreferrer' }, tr('Voir le vol sur FlightLedger')));
        if (tk && drawn.has(tk.flight_id)) item.append(' ', opShowBox(tk, draw));
        else if (tk) item.append(opEl('span', { class: 'opdim' }, ' · ' + (OP_TRACK[tk.state] || OP_TRACK.none)));
        ul.append(item);
      }
      li.append(ul);
    }
    list.append(li);
  }
  if (!(d.rows || []).length) body.append(opEl('p', { class: 'opnote' }, tr("Personne n'est encore annoncé sur cette opération.")));
  body.append(list);
}
/* la case « sur la carte » d'un vol : cochée, sa trace est sur la planche des traces */
function opShowBox(tk, draw){
  const box = opEl('input', { type: 'checkbox', 'data-flight': tk.flight_id });
  box.checked = OP.shown.has(tk.flight_id);
  box.onchange = () => {
    if (box.checked) OP.shown.add(tk.flight_id); else OP.shown.delete(tk.flight_id);
    opDrawState(draw);
    /* la planche déjà posée suit la case, sans recadrer : on compare d'un coup d'œil */
    if (boards.some(x => x.name === tr('Traces des vols'))) opDrawTracks(true);
  };
  return opEl('label', { class: 'opshow', title: tr('Dessiner ce vol sur la planche des traces') }, box, tr('sur la carte'));
}
function opDrawState(draw){
  const n = TRACES.selected(OP.tracks, OP.shown).length, any = TRACES.drawable(OP.tracks).length;
  draw.disabled = !n;
  draw.title = n ? tr('Une planche de plus : la mission et la trace de chaque vol coché')
             : any ? tr('Cochez au moins un vol « sur la carte »')
                   : tr("Aucune trace à poser : pas encore de vol analysé, ou traces effacées");
}

/* ---------- les traces sur la carte (lot 4b, lot 32) ----------
   Une planche de plus, la mission clonée dessous, ancrée ; chaque vol coché en trait plein,
   de la couleur de son pilote, « pilote · indicatif · appareil » écrit au départ. Les points
   viennent de FlightLedger, simplifiés (300 au plus par vol), en latitude et longitude : ils
   se posent sur le fond de carte, comme la mission. keep : la planche existe et suit une
   case cochée ou décochée, sa vue ne bouge pas. */
function opDrawTracks(keep){
  const tracks = TRACES.selected(OP.tracks, OP.shown);
  const name = tr('Traces des vols'), at = boards.findIndex(x => x.name === name);
  if (!tracks.length && at < 0) return;
  cancelGesture(); leaveGesture(); stash();
  const src = boards.find(x => x.name === OP.base && x.map) || boards.find(x => x.map && x.name !== name);
  const colors = TRACES.pilotColors(OP.debrief && OP.debrief.rows, TRACES.drawable(OP.tracks)), out = [];
  for (const t of tracks){
    const c = TRACES.colorOf(colors, t);
    for (const seg of t.segments){
      if (seg.length < 2) continue;
      out.push({ t: 'stroke', pts: seg.map(([la, lo]) => [lon2x(lo), lat2y(la)]), c, w: 3, ls: 'solid', locked: true });
    }
    const [la0, lo0] = t.segments.find(seg => seg.length >= 2)[0];
    out.push({ t: 'text', s: TRACES.label(t), x: lon2x(lo0), y: lat2y(la0), c, w: 2, locked: true });
  }
  const box = TRACES.bounds(tracks);
  const cam = keep && at >= 0 ? boards[at].cam : box ? fitCam(box) : boards[cur].cam;
  const under = src ? src.objs.map(o => ({ ...snap(o), locked: true })) : [];
  const b = { name, objs: [...under, ...out], nmPx: 0, prof: { ceil: 40000, range: 80, linked: false },
              map: src ? { ...src.map } : { theatre: OP.theatre || '', style: $('mstyle').value || 'topo' }, cam,
              magDec: src ? src.magDec ?? null : null, past: [], future: [] };
  if (at >= 0){ boards[at] = b; load(at); renderTabs(); commit(); }
  else { boards.splice(cur + 1, 0, b); load(cur + 1); renderTabs(); commit(); }
  if (!keep) toast(tr(tracks.length > 1 ? '{0} traces posées sur la planche « {1} »' : '{0} trace posée sur la planche « {1} »', tracks.length, name));
}

/* ---------- au démarrage ---------- */
async function opMission(){
  let r;
  try { r = await opFetch('mission'); }
  catch (e){
    if (e.status === 409 || e.status === 404) OP.missionNote = opRefusal(e.status, e.code);
    else OP.error = opRefusal(e.status, e.code);
    return;
  }
  const blob = await r.blob(), file = opFilename(r), bytes = new Uint8Array(await blob.arrayBuffer());
  OP.file = file; OP.base = file.replace(/\.miz$/i, '').slice(0, 40) || 'Mission';
  try {
    const m = await MIZ.readMiz(bytes, { designer: false });
    OP.theatre = m.theatre;
    OP.pages = await MIZ.kneeboards(bytes);
    OP.types = MIZ.kneeboardTypes(OP.pages, m.playerTypes);
  } catch(_){ OP.pages = []; OP.types = []; }
  await openMission(new File([blob], file, { type: 'application/octet-stream' }));
}
async function opDebrief(){
  try {
    OP.debrief = await (await opFetch('debrief')).json();
    OP.title = OP.debrief.title; OP.url = OP.debrief.operation_url;
  } catch (e){
    if (e.status === 410 || (e.status === 403 && String(e.code).startsWith('BOARD_LINK'))) OP.error = opRefusal(e.status, e.code);
    else OP.debriefNote = tr("Le débrief de l'opération ne vous est pas ouvert.");
    return;
  }
  try { OP.tracks = await (await opFetch('tracks')).json(); } catch(_){ OP.tracks = null; }
  /* tous les vols tracés sont cochés d'abord ; la sélection ne vit que le temps de la page */
  OP.shown = TRACES.defaultShown(OP.tracks);
}
async function opBoot(){
  document.body.classList.add('operation');
  $('opbtn').hidden = false;
  $('opbox').hidden = false;
  if (!OP_UUID.test(OP.id) || !OP.token){
    OP.error = tr("Ouvrez le Board depuis la page de l'opération sur FlightLedger : ce lien n'en porte pas l'accès.");
    opRender(); return;
  }
  opRender();
  /* la mission et le débrief en même temps : l'un n'attend pas l'autre */
  await Promise.all([opMission().then(opRender), opDebrief().then(opRender)]);
}
if (OP){
  $('opbtn').onclick = () => { $('opbox').hidden = !$('opbox').hidden; };
  $('opclose').onclick = () => { $('opbox').hidden = true; };
  $('kbprev').onclick = () => opViewing && opView(opViewing.pages, opViewing.i - 1);
  $('kbnext').onclick = () => opViewing && opView(opViewing.pages, opViewing.i + 1);
  $('kbclose').onclick = opViewClose;
  $('kbview').onclick = e => { if (e.target.id === 'kbview') opViewClose(); };
  addEventListener('keydown', opViewKeys, true);
  for (const b of document.querySelectorAll('#optabs button')) b.onclick = () => { OP.tab = b.dataset.tab; opRender(); };
  /* changer de langue recharge la page : le jeton y revient le temps du rechargement */
  const reloadLang = setLang;
  setLang = l => {
    try {
      const u = new URL(location.href);
      u.searchParams.set('t', OP.token);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch(_){}
    reloadLang(l);
  };
  opBoot();
}

