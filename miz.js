/* FL Briefing Board — lire une mission DCS (.miz), sans dépendance.
   Fonctions pures : tools/test_miz.js les vérifie sous node.

   Une .miz est une archive zip ; son fichier `mission` est une table Lua. On y lit le
   théâtre, les bullseyes, les vols que des joueurs pilotent (groupes dont une unité est
   « Client » ou « Player ») avec leurs points de route, et les menaces : groupes de
   défense aérienne et navires. Les positions DCS sont en mètres, x vers le nord, y vers
   l'est ; toGeo() les porte en latitude/longitude par la projection mesurée du théâtre
   (projections.js, tools/build_projections.py). */

const MIZ = (() => {
  /* ---------- projection transverse de Mercator, WGS84 (série de Krüger) ---------- */
  const R = Math.PI / 180, f = 1 / 298.257223563, n = f / (2 - f), e = 2 * Math.sqrt(n) / (1 + n);
  const A = 6378137 / (1 + n) * (1 + n * n / 4 + n ** 4 / 64 + n ** 6 / 256);
  const AL = [
    n / 2 - 2 * n ** 2 / 3 + 5 * n ** 3 / 16 + 41 * n ** 4 / 180 - 127 * n ** 5 / 288 + 7891 * n ** 6 / 37800,
    13 * n ** 2 / 48 - 3 * n ** 3 / 5 + 557 * n ** 4 / 1440 + 281 * n ** 5 / 630 - 1983433 * n ** 6 / 1935360,
    61 * n ** 3 / 240 - 103 * n ** 4 / 140 + 15061 * n ** 5 / 26880 + 167603 * n ** 6 / 181440,
    49561 * n ** 4 / 161280 - 179 * n ** 5 / 168 + 6601661 * n ** 6 / 7257600,
    34729 * n ** 5 / 80640 - 3418889 * n ** 6 / 1995840,
    212378941 * n ** 6 / 319334400,
  ];
  /* latitude, longitude en degrés → [N, E] en mètres, échelle 1, centrée sur lon0 */
  function tm(lat, lon, lon0){
    const s = Math.sin(lat * R), dl = (lon - lon0) * R;
    const t = Math.sinh(Math.atanh(s) - e * Math.atanh(e * s));
    const xi = Math.atan2(t, Math.cos(dl)), eta = Math.atanh(Math.sin(dl) / Math.sqrt(1 + t * t));
    let N = xi, E = eta;
    AL.forEach((a, j) => {
      const k = 2 * (j + 1);
      N += a * Math.sin(k * xi) * Math.cosh(k * eta);
      E += a * Math.cos(k * xi) * Math.sinh(k * eta);
    });
    return [A * N, A * E];
  }
  /* l'inverse, par la méthode de Newton sur tm() : toujours d'accord avec l'aller */
  function tmInverse(N, E, lon0){
    let lat = N / A / R, lon = lon0 + E / (A * Math.cos(lat * R)) / R;
    for (let k = 0; k < 12; k++){
      const h = 1e-6, [n0, e0] = tm(lat, lon, lon0), [n1, e1] = tm(lat + h, lon, lon0), [n2, e2] = tm(lat, lon + h, lon0);
      const a = (n1 - n0) / h, b = (n2 - n0) / h, c = (e1 - e0) / h, d = (e2 - e0) / h, det = a * d - b * c;
      const dn = N - n0, de = E - e0, dlat = (d * dn - b * de) / det, dlon = (a * de - c * dn) / det;
      lat += dlat; lon += dlon;
      if (Math.abs(dlat) + Math.abs(dlon) < 1e-12) break;
    }
    return [lat, lon];
  }
  /* repère DCS d'un théâtre (x nord, y est, en mètres) ↔ latitude, longitude */
  const toGeo = (p, x, y) => tmInverse((x - p.x0) / p.k0, (y - p.y0) / p.k0, p.lon0);
  const fromGeo = (p, lat, lon) => { const [N, E] = tm(lat, lon, p.lon0); return [p.k0 * N + p.x0, p.k0 * E + p.y0]; };

  /* ---------- table Lua : le sous-ensemble qu'écrit l'éditeur de mission ----------
     Chaque table garde, sous la clé SPAN, sa place dans le texte : l'accolade ouvrante
     (at) et l'étendue de chaque valeur (vals). withDtc() s'en sert pour réécrire une
     valeur sans toucher au reste du fichier. */
  const SPAN = Symbol('span');
  function parseLua(src){
    let i = src.indexOf('=') + 1;                           // « mission = { … } »
    const fail = what => { throw new Error(`table Lua illisible (${what}, caractère ${i})`); };
    function ws(){
      for (;;){
        const c = src[i];
        if (c === ' ' || c === '\n' || c === '\r' || c === '\t') i++;
        else if (c === '-' && src[i + 1] === '-'){
          const long = /^--\[(=*)\[/.exec(src.slice(i, i + 20));
          const end = long ? src.indexOf(']' + long[1] + ']', i) : src.indexOf('\n', i);
          i = end < 0 ? src.length : end + (long ? long[1].length + 2 : 1);
        } else return;
      }
    }
    function str(q){
      let out = ''; i++;
      for (;;){
        const c = src[i++];
        if (c === undefined) fail('chaîne non fermée');
        if (c === q) return out;
        if (c !== '\\'){ out += c; continue; }
        const d = src[i++];
        if (/\d/.test(d)){ const m = /^\d{1,3}/.exec(src.slice(i - 1, i + 2)); out += String.fromCharCode(+m[0]); i += m[0].length - 1; }
        else out += { n:'\n', t:'\t', r:'\r', a:'\x07', b:'\b', f:'\f', v:'\v', '\n':'\n' }[d] ?? d;
      }
    }
    function longStr(){
      const m = /^\[(=*)\[/.exec(src.slice(i, i + 20)), close = ']' + m[1] + ']', start = i + m[0].length;
      const end = src.indexOf(close, start);
      if (end < 0) fail('chaîne longue non fermée');
      i = end + close.length;
      return src.slice(start, end).replace(/^\r?\n/, '');
    }
    function table(){
      const t = {}, vals = {}; let k = 1;
      t[SPAN] = { at: i++, vals };
      for (;;){
        ws();
        if (src[i] === '}'){ i++; return t; }
        let key;
        if (src[i] === '[' && src[i + 1] !== '[' && src[i + 1] !== '='){
          i++; key = value(); ws();
          if (src[i++] !== ']') fail('] attendu');
          ws(); if (src[i++] !== '=') fail('= attendu');
        } else {
          const id = /^[A-Za-z_]\w*\s*=(?!=)/.exec(src.slice(i, i + 80));
          if (id){ i += id[0].length; key = id[0].replace(/\s*=$/, ''); }
          else key = k++;
        }
        ws(); const from = i;
        t[key] = value(); vals[key] = [from, i];
        ws();
        if (src[i] === ',' || src[i] === ';') i++;
      }
    }
    function value(){
      ws();
      const c = src[i];
      if (c === '{') return table();
      if (c === '"' || c === "'") return str(c);
      if (c === '[') return longStr();
      const m = /^(?:true|false|nil|-?0x[0-9a-fA-F]+|-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/.exec(src.slice(i, i + 40));
      if (!m) fail('valeur attendue');
      i += m[0].length;
      return m[0] === 'true' ? true : m[0] === 'false' ? false : m[0] === 'nil' ? null : Number(m[0]);
    }
    return value();
  }
  /* les entrées d'une table numérotée [1], [2]…, dans l'ordre ; list() n'en garde que les valeurs */
  const numbered = t => t && typeof t === 'object'
    ? Object.keys(t).filter(k => /^\d+$/.test(k)).sort((a, b) => a - b).map(k => [k, t[k]]) : [];
  const list = t => numbered(t).map(e => e[1]);

  /* ---------- archive zip : répertoire central, entrées stockées ou « deflate » ---------- */
  /* les entrées telles qu'elles sont rangées, données encore compressées */
  function zipEntries(bytes){
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let p = bytes.length - 22;
    while (p >= 0 && dv.getUint32(p, true) !== 0x06054b50) p--;
    if (p < 0) throw new Error('ce fichier n\'est pas une archive .miz');
    const count = dv.getUint16(p + 10, true), out = [];
    p = dv.getUint32(p + 16, true);
    for (let k = 0; k < count && dv.getUint32(p, true) === 0x02014b50; k++){
      const nlen = dv.getUint16(p + 28, true), at = dv.getUint32(p + 42, true), csize = dv.getUint32(p + 20, true);
      if (csize === 0xFFFFFFFF) throw new Error('archive trop grande (zip64)');
      const s = at + 30 + dv.getUint16(at + 26, true) + dv.getUint16(at + 28, true), nameBytes = bytes.subarray(p + 46, p + 46 + nlen);
      out.push({ name: new TextDecoder().decode(nameBytes), nameBytes, flags: dv.getUint16(p + 8, true),
                 method: dv.getUint16(p + 10, true), time: dv.getUint16(p + 12, true), date: dv.getUint16(p + 14, true),
                 crc: dv.getUint32(p + 16, true), csize, usize: dv.getUint32(p + 24, true), data: bytes.subarray(s, s + csize) });
      p += 46 + nlen + dv.getUint16(p + 30, true) + dv.getUint16(p + 32, true);
    }
    return out;
  }
  async function inflate(e){
    if (e.method === 0) return e.data;
    if (e.method !== 8) throw new Error('compression inconnue dans l\'archive');
    const out = new Blob([e.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(out).arrayBuffer());
  }
  async function unzip(bytes){
    const files = new Map(zipEntries(bytes).map(e => [e.name, e]));
    return async name => files.has(name) ? new TextDecoder().decode(await inflate(files.get(name))) : null;
  }

  /* écrire : les entrées reprises telles quelles, données compressées comprises */
  const CRC = Array.from({ length: 256 }, (_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xEDB88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
  function crc32(u8){ let c = 0xFFFFFFFF; for (const b of u8) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  async function newEntry(name, text){
    const raw = new TextEncoder().encode(text), d = new Date();
    const out = new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const data = new Uint8Array(await new Response(out).arrayBuffer()), nameBytes = new TextEncoder().encode(name);
    return { name, nameBytes, flags: /^[\x20-\x7e]*$/.test(name) ? 0 : 0x800, method: 8, crc: crc32(raw),
             csize: data.length, usize: raw.length, data,
             time: d.getHours() << 11 | d.getMinutes() << 5 | d.getSeconds() >> 1,
             date: (d.getFullYear() - 1980) << 9 | (d.getMonth() + 1) << 5 | d.getDate() };
  }
  function zipBytes(entries){
    const parts = [], dir = []; let off = 0;
    const head = (size, fill) => { const b = new Uint8Array(size), v = new DataView(b.buffer); fill(v); return b; };
    for (const e of entries){
      const flags = e.flags & ~8;                         // tailles connues : pas de descripteur après les données
      const common = v => { v.setUint16(0, 20, true); v.setUint16(2, flags, true); v.setUint16(4, e.method, true);
        v.setUint16(6, e.time, true); v.setUint16(8, e.date, true); v.setUint32(10, e.crc, true);
        v.setUint32(14, e.csize, true); v.setUint32(18, e.usize, true); v.setUint16(22, e.nameBytes.length, true); };
      const loc = head(30, v => { v.setUint32(0, 0x04034b50, true); common(new DataView(v.buffer, 4)); });
      dir.push(head(46, v => { v.setUint32(0, 0x02014b50, true); v.setUint16(4, 20, true); common(new DataView(v.buffer, 6));
                               v.setUint32(42, off, true); }), e.nameBytes);
      parts.push(loc, e.nameBytes, e.data);
      off += 30 + e.nameBytes.length + e.data.length;
    }
    const size = dir.reduce((t, b) => t + b.length, 0);
    const end = head(22, v => { v.setUint32(0, 0x06054b50, true); v.setUint16(8, entries.length, true);
                                v.setUint16(10, entries.length, true); v.setUint32(12, size, true); v.setUint32(16, off, true); });
    const all = new Uint8Array(off + size + 22); let p = 0;
    for (const b of [...parts, ...dir, end]){ all.set(b, p); p += b.length; }
    return all;
  }

  /* ---------- le contenu d'une mission ---------- */
  /* défense aérienne et radars d'alerte, reconnus au type DCS de leurs unités */
  const AIR_DEF = /\bSA-\d|S-300|S-125|S-75|S-200|Buk|Kub|\bTor\b|Osa|Strela|Igla|Stinger|Hawk|Patriot|NASAMS|rapier|Roland|HQ-7|Tunguska|2S6|Shilka|ZSU|ZU-23|Gepard|Vulcan|Avenger|Chaparral|Pantsir|EWR|1L13|55G6|p-19|Dog Ear|SNR|RLS|flak|bofors|KS-19|S-60|SON_9/i;
  const EWR = /EWR|1L13|55G6|Dog Ear/i;
  const CARRIER = /CVN|Stennis|Vinson|Roosevelt|Lincoln|Washington|Truman|Forrestal|KUZNECOW|Kuznetsov|LHA|Tarawa|Invincible|Hermes/i;
  const PLAYER = u => u && (u.skill === 'Client' || u.skill === 'Player');
  /* appareils de soutien de l'IA, reconnus à la tâche de leur groupe (lot 12) */
  const ROLES = { Refueling: 'tanker', AWACS: 'awacs' };
  /* les tâches d'un point de route, déballées : une tâche contrôlée porte la sienne,
     une action enveloppée (WrappedAction) la sienne */
  const pointTasks = p => list((((p || {}).task || {}).params || {}).tasks)
    .map(t => t && t.id === 'ControlledTask' ? ((t.params || {}).task || {}) : t)
    .map(t => t && t.id === 'WrappedAction' ? (((t.params || {}).action) || {}) : t || {});
  /* l'orbite déclarée sur la route (me_action_edit_panel.lua) : Circle autour du point,
     Race-Track du point au suivant, Anchored par sa branche chaude. Son altitude
     gouverne en vol, pas celle du point. */
  function orbitOf(points){
    for (const [i, p] of points.entries()){
      const o = pointTasks(p).find(t => t.id === 'Orbit');
      if (!o) continue;
      const q = o.params || {}, pattern = String(q.pattern || 'Circle');
      const out = { pattern, at: i, to: pattern === 'Race-Track' && points[i + 1] ? i + 1 : null,
                    alt: Number.isFinite(+q.altitude) && q.altitude !== undefined ? +q.altitude : +p.alt || 0 };
      if (pattern === 'Anchored') Object.assign(out, { hot: +q.hotLegDir || 0, len: +q.legLength || 0, width: +q.width || 0 });
      return out;
    }
    return null;
  }
  /* de quoi joindre l'appareil : TACAN (ActivateBeacon) et radio (SetFrequency, sinon le groupe) */
  function contactOf(g, points){
    const acts = points.flatMap(pointTasks);
    const bc = (acts.find(a => a.id === 'ActivateBeacon') || {}).params;
    const sf = (acts.find(a => a.id === 'SetFrequency') || {}).params;
    const mhz = sf && +sf.frequency > 0 ? +sf.frequency / 1e6 : +g.frequency > 0 ? +g.frequency : null;
    return { tacan: bc && bc.channel ? `${bc.channel}${bc.modeChannel || ''}${bc.callsign ? ' ' + bc.callsign : ''}` : '',
             freq: mhz };
  }

  function content(m, dict){
    const say = s => typeof s === 'string' && s.startsWith('DictKey_') ? String(dict[s] ?? '') : String(s ?? '');
    const out = { theatre: String(m.theatre || ''), bullseye: {}, flights: [], threats: [], support: [] };
    const at = (g, units) => ({ x: +(g.x ?? (units[0] || {}).x), y: +(g.y ?? (units[0] || {}).y) });
    for (const side of ['blue', 'red', 'neutrals']){
      const c = (m.coalition || {})[side];
      if (!c) continue;
      if (c.bullseye) out.bullseye[side] = { x: +c.bullseye.x, y: +c.bullseye.y };
      for (const [ci, country] of numbered(c.country)){
        for (const cat of ['plane', 'helicopter'])
          for (const [gi, g] of numbered((country[cat] || {}).group)){
            const units = list(g.units);
            if (!units.some(PLAYER)){
              const role = cat === 'plane' && ROLES[g.task];
              if (!role || !units.length) continue;
              const pts = list((g.route || {}).points);
              out.support.push({ name: say(g.name), side, role, type: String(units[0].type || ''),
                                 points: pts.map(p => ({ x: +p.x, y: +p.y, alt: +p.alt || 0 })),
                                 orbit: orbitOf(pts), ...contactOf(g, pts) });
              continue;
            }
            /* ref : le chemin du groupe dans la table, pour y revenir (withDtc) */
            out.flights.push({ name: say(g.name), side, cat, ref: `${side}/${ci}/${cat}/${gi}`,
                               type: String(units[0].type || ''), units: units.length,
              points: list((g.route || {}).points).map(p => ({ x: +p.x, y: +p.y, alt: +p.alt || 0,
                                                               agl: p.alt_type === 'RADIO', name: say(p.name) })) });
          }
        for (const g of list((country.vehicle || {}).group)){
          const units = list(g.units), types = units.map(u => String(u.type || '')), ad = types.filter(t => AIR_DEF.test(t));
          if (!ad.length) continue;
          out.threats.push({ name: say(g.name), side, ...at(g, units), types, kind: ad.every(t => EWR.test(t)) ? 'radar' : 'sam' });
        }
        for (const g of list((country.ship || {}).group)){
          const units = list(g.units), types = units.map(u => String(u.type || ''));
          out.threats.push({ name: say(g.name), side, ...at(g, units), types,
                             kind: types.some(t => CARRIER.test(t)) ? 'carrier' : 'ship' });
        }
      }
    }
    return out;
  }

  async function readMiz(bytes){
    const get = await unzip(bytes);
    const text = await get('mission');
    if (!text) throw new Error('pas de fichier « mission » dans l\'archive : ce n\'est pas une mission DCS');
    const dict = await get('l10n/DEFAULT/dictionary');
    return content(parseLua(text), dict ? parseLua(dict) : {});
  }

  /* ---------- écrire la route dans la DTC du F/A-18C (lot 9) ----------
     Format de l'éditeur de mission de DCS (MissionEditor/modules/me_managerDTC.lua,
     CoreMods/aircraft/FA-18C/DTC) : une cartouche est un fichier JSON DTC/<nom>.dtc de
     l'archive ; chaque unité la désigne par son nom dans sa table DTC. Points en mètres
     DCS, altitudes en mètres, vitesses en km/h, ETA en secondes depuis minuit. */
  const HORNET = 'FA-18C_hornet', WYPT_MAX = 59, KPH = 463, SUFFIX = ' - FL Briefing';
  const luaStr = s => '"' + String(s).replace(/[\\"]/g, '\\$&').replace(/\n/g, '\\n').replace(/\r/g, '\\r')
    .replace(/[\x00-\x1f]/g, c => '\\' + String(c.charCodeAt(0)).padStart(3, '0')) + '"';
  const luaVal = v => typeof v === 'string' ? luaStr(v) : typeof v !== 'object' ? String(v)
    : '{ ' + (Array.isArray(v) ? v.map((x, k) => `[${k + 1}] = ${luaVal(x)}, `)
                               : Object.entries(v).map(([k, x]) => `[${luaStr(k)}] = ${luaVal(x)}, `)).join('') + '}';
  /* nom de fichier : l'éditeur refuse * / ? < > | \ : " */
  const cartName = s => s.replace(/[*/?<>|\\:"]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 60);

  function hornetCartridge(base, name, theatre, pts, start){
    const data = base ? JSON.parse(JSON.stringify(base.data || {})) : { type: HORNET, name: '' };
    data.terrain = theatre;
    let eta = start;
    const route = {};
    const navPts = pts.map((p, k) => {
      if (k) eta += Math.hypot(p.x - pts[k - 1].x, p.y - pts[k - 1].y) / (KPH / 3.6);
      route['STPT' + p.n] = { route_num: 1, wypt_num: p.n, alt: p.alt, altitudeType: 1, speed: KPH,
                              ETA: Math.round(eta), FIX_Time: false, TGT: false };
      return { id: 'STPT' + p.n, idOA: 'OA' + p.n, idOA_Line: `OA${p.n}Line`, wypt_num: p.n,
               x: p.x, y: p.y, alt: p.alt, altitudeType: 1, velocityType: 3, note: p.note || '', text_note: '',
               R1: true, R1_order: k + 1, R2: false, R3: false,
               isOA: false, OA_Range: 0, OA_Bearing: 0, OA_X: 0, OA_Y: 0, OA_Alt: 0, OA_DeltaX: 0, OA_DeltaY: 0,
               OA_Bearing_Units: 1, OA_Range_Units: 1, OA_Elevation_Units: 1 };
    });
    data.WYPT = { ...(data.WYPT && data.WYPT.NAV_SETTINGS && { NAV_SETTINGS: data.WYPT.NAV_SETTINGS }),
                  NAV_PTS: navPts, NAV_ROUTE: [route, [], []], mirror_NAV_PTS: false, terrain: theatre };
    return { name, type: HORNET, data };
  }

  /* bytes : la mission support ; ref : le vol (readMiz) ; pts : [{ n, x, y, alt, note }],
     x/y en mètres DCS, alt en mètres au-dessus de la mer. Rend une nouvelle archive : la
     mission d'origine n'est jamais modifiée. */
  async function withDtc(bytes, ref, pts){
    if (!pts.length) throw new Error('aucun waypoint à écrire');
    const nums = pts.map(p => p.n);
    if (nums.some(n => !(Number.isInteger(n) && n >= 1 && n <= WYPT_MAX)))
      throw new Error(`le F/A-18C numérote ses waypoints de 1 à ${WYPT_MAX}`);
    if (new Set(nums).size !== nums.length) throw new Error('un numéro de waypoint est en double');
    const entries = zipEntries(bytes), byName = new Map(entries.map(e => [e.name, e]));
    const text = async name => byName.has(name) ? new TextDecoder().decode(await inflate(byName.get(name))) : null;
    const src = await text('mission');
    if (!src) throw new Error('pas de fichier « mission » dans l\'archive : ce n\'est pas une mission DCS');
    const m = parseLua(src), [side, ci, cat, gi] = String(ref).split('/');
    const g = ((((((m.coalition || {})[side] || {}).country || {})[ci] || {})[cat] || {}).group || {})[gi];
    if (!g) throw new Error('vol introuvable dans cette mission');
    const units = list(g.units).filter(u => u && u.type === HORNET);
    if (!units.length) throw new Error('ce vol n\'est pas un F/A-18C : seule sa DTC est écrite');
    /* la cartouche par défaut du chef de vol sert de base : radios et réglages gardés */
    const pick = u => { const c = list((u.DTC || {}).Cartridges); return (c.find(x => x && x.default) || c[0] || {}).name; };
    const baseName = units.map(pick).find(Boolean), baseTxt = baseName ? await text(`DTC/${baseName}.dtc`) : null;
    let base = null;
    try { base = baseTxt && JSON.parse(baseTxt); } catch(_){}
    if (base && base.type !== HORNET) base = null;
    const dict = await text('l10n/DEFAULT/dictionary'), dk = dict ? parseLua(dict) : {};
    const gname = typeof g.name === 'string' && g.name.startsWith('DictKey_') ? String(dk[g.name] ?? '') : String(g.name ?? '');
    const name = base ? (base.name.endsWith(SUFFIX) ? base.name : cartName(base.name) + SUFFIX)
                      : cartName(`FA-18C ${gname}`) + SUFFIX;
    const cart = hornetCartridge(base, name, String(m.theatre || ''), [...pts].sort((a, b) => a.n - b.n), +m.start_time || 0);
    /* la mission : seule la table DTC de chaque Hornet du vol change, le reste octet pour octet */
    const edits = units.map(u => {
      const keep = list((u.DTC || {}).Cartridges).filter(c => c && c.name && c.name !== name)
                     .map(c => ({ name: String(c.name), default: false }));
      const lua = luaVal({ AutoLoad: true, Cartridges: [...keep, { name, default: true }] });
      const s = u[SPAN];
      return s.vals.DTC ? [s.vals.DTC[0], s.vals.DTC[1], lua] : [s.at + 1, s.at + 1, `\n["DTC"] = ${lua},`];
    }).sort((a, b) => b[0] - a[0]);
    let out = src;
    for (const [a, b, t] of edits) out = out.slice(0, a) + t + out.slice(b);
    const file = `DTC/${name}.dtc`, mission = await newEntry('mission', out), dtc = await newEntry(file, JSON.stringify(cart, null, 2));
    const next = entries.filter(e => e.name !== file).map(e => e.name === 'mission' ? mission : e);
    return { bytes: zipBytes([...next, dtc]), cartridge: name, units: units.length };
  }

  return { tm, tmInverse, toGeo, fromGeo, parseLua, list, readMiz, unzip, withDtc, WYPT_MAX };
})();

if (typeof module !== 'undefined') module.exports = MIZ;
