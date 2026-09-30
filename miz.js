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

  /* ---------- table Lua : le sous-ensemble qu'écrit l'éditeur de mission ---------- */
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
      const t = {}; let k = 1; i++;
      for (;;){
        ws();
        if (src[i] === '}'){ i++; return t; }
        if (src[i] === '[' && src[i + 1] !== '[' && src[i + 1] !== '='){
          i++; const key = value(); ws();
          if (src[i++] !== ']') fail('] attendu');
          ws(); if (src[i++] !== '=') fail('= attendu');
          t[key] = value();
        } else {
          const id = /^[A-Za-z_]\w*\s*=(?!=)/.exec(src.slice(i, i + 80));
          if (id){ i += id[0].length; t[id[0].replace(/\s*=$/, '')] = value(); }
          else t[k++] = value();
        }
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
  /* les valeurs d'une table numérotée [1], [2]…, dans l'ordre */
  const list = t => t && typeof t === 'object'
    ? Object.keys(t).filter(k => /^\d+$/.test(k)).sort((a, b) => a - b).map(k => t[k]) : [];

  /* ---------- archive zip : répertoire central, entrées stockées ou « deflate » ---------- */
  async function unzip(bytes){
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let p = bytes.length - 22;
    while (p >= 0 && dv.getUint32(p, true) !== 0x06054b50) p--;
    if (p < 0) throw new Error('ce fichier n\'est pas une archive .miz');
    const count = dv.getUint16(p + 10, true), files = new Map();
    p = dv.getUint32(p + 16, true);
    for (let k = 0; k < count && dv.getUint32(p, true) === 0x02014b50; k++){
      const nlen = dv.getUint16(p + 28, true);
      files.set(new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nlen)),
                { method: dv.getUint16(p + 10, true), size: dv.getUint32(p + 20, true), at: dv.getUint32(p + 42, true) });
      p += 46 + nlen + dv.getUint16(p + 30, true) + dv.getUint16(p + 32, true);
    }
    return async name => {
      const f = files.get(name);
      if (!f) return null;
      const s = f.at + 30 + dv.getUint16(f.at + 26, true) + dv.getUint16(f.at + 28, true), data = bytes.subarray(s, s + f.size);
      if (f.method === 0) return new TextDecoder().decode(data);
      if (f.method !== 8) throw new Error('compression inconnue dans l\'archive');
      const out = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new TextDecoder().decode(await new Response(out).arrayBuffer());
    };
  }

  /* ---------- le contenu d'une mission ---------- */
  /* défense aérienne et radars d'alerte, reconnus au type DCS de leurs unités */
  const AIR_DEF = /\bSA-\d|S-300|S-125|S-75|S-200|Buk|Kub|\bTor\b|Osa|Strela|Igla|Stinger|Hawk|Patriot|NASAMS|rapier|Roland|HQ-7|Tunguska|2S6|Shilka|ZSU|ZU-23|Gepard|Vulcan|Avenger|Chaparral|Pantsir|EWR|1L13|55G6|p-19|Dog Ear|SNR|RLS|flak|bofors|KS-19|S-60|SON_9/i;
  const EWR = /EWR|1L13|55G6|Dog Ear/i;
  const CARRIER = /CVN|Stennis|Vinson|Roosevelt|Lincoln|Washington|Truman|Forrestal|KUZNECOW|Kuznetsov|LHA|Tarawa|Invincible|Hermes/i;
  const PLAYER = u => u && (u.skill === 'Client' || u.skill === 'Player');

  function content(m, dict){
    const say = s => typeof s === 'string' && s.startsWith('DictKey_') ? String(dict[s] ?? '') : String(s ?? '');
    const out = { theatre: String(m.theatre || ''), bullseye: {}, flights: [], threats: [] };
    const at = (g, units) => ({ x: +(g.x ?? (units[0] || {}).x), y: +(g.y ?? (units[0] || {}).y) });
    for (const side of ['blue', 'red', 'neutrals']){
      const c = (m.coalition || {})[side];
      if (!c) continue;
      if (c.bullseye) out.bullseye[side] = { x: +c.bullseye.x, y: +c.bullseye.y };
      for (const country of list(c.country)){
        for (const cat of ['plane', 'helicopter'])
          for (const g of list((country[cat] || {}).group)){
            const units = list(g.units);
            if (!units.some(PLAYER)) continue;
            out.flights.push({ name: say(g.name), side, cat, type: String(units[0].type || ''), units: units.length,
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

  return { tm, tmInverse, toGeo, fromGeo, parseLua, list, readMiz };
})();

if (typeof module !== 'undefined') module.exports = MIZ;
