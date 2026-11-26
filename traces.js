/* FL Briefing Board — les traces des vols d'une opération FlightLedger (lot 32).
   FlightLedger rend, pour chaque vol de l'opération, une trace simplifiée de sa trajectoire
   mesurée (GET /board/operations/{id}/tracks : tronçons de points [lat, lon, alt_m], 300
   points au plus par vol), son pilote, son indicatif et son appareil. Ce module, sans
   écran, dit ce qui se dessine : les traces lisibles, une couleur par pilote, l'étiquette
   écrite au départ, les vols cochés et leur emprise. operation.js les pose sur la carte.
   Rien n'est gardé : la sélection vit le temps de la page. */

const TRACES = (() => {
  const COLORS = ['#2F8CFF', '#34D399', '#D1A94A', '#FF8A00', '#C084FC', '#4FC3F7', '#F472B6', '#A3E635'];

  /* une trace se dessine si FlightLedger l'a gardée et qu'un tronçon a deux points */
  const drawable = body => ((body && body.tracks) || (Array.isArray(body) ? body : []))
    .filter(t => t && t.state === 'ok' && Array.isArray(t.segments) && t.segments.some(s => s.length >= 2));

  /* une couleur par pilote, dans l'ordre du débrief, puis les pilotes qu'il ne nomme pas */
  function pilotColors(rows, tracks){
    const colors = new Map();
    const add = p => { if (p && !colors.has(p)) colors.set(p, COLORS[colors.size % COLORS.length]); };
    for (const r of rows || []) add(r.pseudo);
    for (const t of tracks || []) add(t.pseudo);
    return colors;
  }
  const colorOf = (colors, t) => colors.get(t.pseudo) || COLORS[0];

  /* pilote · indicatif · appareil : ce que FlightLedger a dit, rien d'inventé */
  /* L'indicatif n'est écrit que s'il dit autre chose que le nom du pilote (souvent le même dans DCS). */
  const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
  const label = t => [t.pseudo, same(t.callsign, t.pseudo) ? null : t.callsign, t.aircraft]
    .map(v => (v == null ? '' : String(v).trim())).filter(Boolean).join(' · ');

  /* Les pilotes d'une opération partent souvent du même terrain ou du même porte-avions : leurs
     étiquettes s'écriraient l'une sur l'autre. Chaque étiquette { x, y, w } (x à gauche, w sa
     largeur) qui en recouvre une déjà placée descend d'une ligne, jusqu'à trouver sa place. */
  function stack(spots, line){
    const placed = [];
    return spots.map(({ x, y, w }) => {
      const hits = py => placed.some(p => x < p.x + p.w && p.x < x + w && Math.abs(py - p.y) < line);
      while (hits(y)) y += line;
      placed.push({ x, y, w });
      return y;
    });
  }

  const defaultShown = tracks => new Set(drawable(tracks).map(t => t.flight_id));
  const selected = (tracks, shown) => drawable(tracks).filter(t => shown.has(t.flight_id));

  /* [sud, ouest, nord, est] des points des traces, ou null */
  function bounds(tracks){
    let s = Infinity, w = Infinity, n = -Infinity, e = -Infinity;
    for (const t of tracks) for (const seg of t.segments) for (const [la, lo] of seg){
      if (la < s) s = la; if (la > n) n = la; if (lo < w) w = lo; if (lo > e) e = lo;
    }
    return s === Infinity ? null : [s, w, n, e];
  }

  return { COLORS, drawable, pilotColors, colorOf, label, stack, defaultShown, selected, bounds };
})();

if (typeof module !== 'undefined') module.exports = TRACES;
