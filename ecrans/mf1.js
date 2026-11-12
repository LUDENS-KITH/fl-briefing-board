/* ---------------- Mirage F1 : scope du radar Cyrano IV ----------------
   DCS: Mirage F1 Flight Manual (Aerges, version 1.0), § 3.18 « Radar », p. 108-130. Lu
   pour lui-même : rien n'est repris des autres modules.
   Places mesurées sur les images d'origine des figures 3-130 (« Radar Before Lock-on »,
   p. 126, 819 × 1049 px) et 3-132 (« Radar After Lock-on », p. 127, 768 × 975 px) ; le
   boîtier éclairé de jour, ses plaques et ses couleurs, sur la figure 3-133 (« Radar »,
   p. 128), même indicateur. Repère : le verre du scope est le disque de rayon 0,79 (GLASS),
   centré sur le cercle du scope de la figure 3-130, (406,2 ; 557,4) px, 334,2 px l'unité.
   La photo est prise un peu de côté : la symbologie, posée sur l'écran au fond du scope, est
   recentrée sur l'axe gravé (p. 112 : « the central vertical axis, engraved on the scope,
   represents the zero relative bearing »), et la figure 3-132 est redressée sur les trois
   traits gravés. */

/* pixels de la figure 3-130 → repère */
const F1P = (x, y) => [(x - 406.2) / 334.2, (y - 557.4) / 334.2];
const F1U = v => v / 334.2;

/* le boîtier déborde le carré : haut de 3,12 unités, il est ramené dans [-1, 1] */
BEZELS.f1 = { k: .64, dy: .0915 };

/* afficheur à sept segments, en italique, comme « E + 00 » (fig. 3-130, n° 9 de la
   fig. 3-133) : `ch` dans 'E0123456789+-', centre (x, y), hauteur h */
const F1_SEG = { 0:'abcdef', 1:'bc', 2:'abdeg', 3:'abcdg', 4:'bcfg', 5:'acdfg', 6:'acdefg', 7:'abc', 8:'abcdefg',
  9:'abcdfg', E:'adefg', '-':'g' };
function f1Seg(c, ch, x, y, h){
  const w = h * .66, t = h * .13, sl = .12, P = (u, v) => [x + u * w / 2 - v * h / 2 * sl, y + v * h / 2];
  const seg = (u0, v0, u1, v1) => { const [a, b] = P(u0, v0), [d, e] = P(u1, v1); c.moveTo(a, b); c.lineTo(d, e); };
  c.save(); c.lineWidth = t; c.lineCap = 'round';
  c.beginPath();
  if (ch === '+'){ seg(-.75, 0, .75, 0); seg(0, -.5, 0, .5); }
  else for (const s of F1_SEG[ch] || ''){
    if (s === 'a') seg(-.8, -1, .8, -1); if (s === 'g') seg(-.8, 0, .8, 0); if (s === 'd') seg(-.8, 1, .8, 1);
    if (s === 'b') seg(1, -.85, 1, -.15); if (s === 'c') seg(1, .15, 1, .85);
    if (s === 'f') seg(-1, -.85, -1, -.15); if (s === 'e') seg(-1, .15, -1, .85);
  }
  c.stroke(); c.restore();
}

/* boîtier de l'indicateur (fig. 3-130, places ; fig. 3-133, teintes) : gris, coin haut
   gauche arrondi, le flanc droit en grande courbe ; vis à collerette verte ; le scope
   dans sa couronne ; les voyants de fonction HA → DB en arc sur leur plaque (p. 109) ;
   en haut à droite trois voyants, celui du milieu barré (n° 1, « inoperative ») ; les
   voyants d'échelle 7 15 35 60 et d'état AP TCH EMI PNE ; l'afficheur d'écart
   d'altitude ; en bas TEST, LUM, sélecteur de fonction, REM, EFF (p. 109). `lit` : les
   voyants allumés sur la figure. */
const F1_FN = [['HA', 278.5, 286, 214, 262.5, 'a'], ['IC', 245, 301.5, 185, 283.5, 'a'], ['TL', 214, 321, 156.5, 304, 'g'],
  ['BZ', 186, 342.5, 127.5, 331.5, 'g'], ['TS', 161.5, 371.5, 101.5, 360, 'g'], ['V1', 138, 401, 79, 391, 'a'],
  ['V2', 120.5, 432.5, 61, 426, 'a'], ['DC', 106, 465, 49, 458.5, 'a'], ['PR', 95, 499, 39, 492.5, 'a'],
  ['AC', 88.5, 534, 34, 527.5, 'a'], ['DB', 86.5, 570, 32.5, 560, 'a']];
const F1_LENS = { a: '#C9C35A', g: '#3F8A57', r: '#8E1B1B' };
function f1Bezel(c, lit = {}, mini = false){
  bezelFrame(c, 'f1');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  const disc = (x, y, r, fill, stroke) => {
    const [cx, cy] = F1P(x, y);
    c.fillStyle = fill; c.beginPath(); c.arc(cx, cy, F1U(r), 0, 7); c.fill();
    if (stroke){ c.strokeStyle = stroke; c.stroke(); }
  };
  const text = (t, x, y, size = .075, col = '#E5E2DD') => { const [tx, ty] = F1P(x, y); bezelText(c, t, tx, ty, size, col); };
  const plate = (x0, y0, x1, y1) => {
    const [a, b] = F1P(x0, y0), [d, e] = F1P(x1, y1);
    c.fillStyle = '#3E3A37'; c.strokeStyle = '#5C5853';
    c.beginPath(); c.roundRect(a, b, d - a, e - b, .015); c.fill(); c.stroke();
  };
  /* boîtier : bord gauche à 12 px (fig. 3-133), haut à 5 px, flanc droit relevé point par
     point sur le ciel de la figure 3-130 ; le bas est celui de l'image */
  c.fillStyle = '#86817B'; c.strokeStyle = '#5F5A55';
  c.beginPath();
  c.moveTo(...F1P(12, 1049)); c.lineTo(...F1P(12, 55)); c.quadraticCurveTo(...F1P(12, 5), ...F1P(62, 5));
  for (const [x, y] of [[440, 5], [455, 10], [536, 90], [619, 180], [672, 240], [719, 300], [756, 360], [782, 420],
                        [800, 480], [813, 540], [820, 600], [825, 660], [825, 1049]]) c.lineTo(...F1P(x, y));
  c.closePath(); c.fill(); c.stroke();
  /* vis : la grosse à fente en haut à gauche, quatre à collerette (verte, bleue en bas à
     gauche sur la fig. 3-133), et les petites */
  const screw = (x, y, r, ring) => {
    if (ring) disc(x, y, r, ring, '#2E2B29');
    disc(x, y, ring ? r * .78 : r, '#55514D', '#3A3734');
    const [sx, sy] = F1P(x, y), d = F1U(r) * (ring ? .55 : .62);
    c.save(); c.strokeStyle = '#2A2725'; c.lineWidth = lw * .9;
    c.beginPath(); c.moveTo(sx - d * .7, sy + d * .7); c.lineTo(sx + d * .7, sy - d * .7); c.stroke(); c.restore();
  };
  screw(155, 160, 33);
  for (const [x, y, col] of [[115, 740, '#2FA53A'], [645, 795, '#2FA53A'], [63, 990, '#3C8FA8'], [750, 990, '#2FA53A']]) screw(x, y, 47, col);
  for (const [x, y] of [[607, 243], [750, 612], [20, 660], [45, 795], [325, 858], [540, 852], [790, 940]]) screw(x, y, 12);
  /* couronne du scope, puis le verre (fig. 3-133 : couronne sombre jusqu'à 0,94) */
  c.fillStyle = '#4A4643'; c.strokeStyle = '#3A3734';
  c.beginPath(); c.arc(0, 0, .94, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#5E5A56';
  c.beginPath(); c.arc(0, 0, F1U(275), 0, 7); c.fill();
  c.fillStyle = HALO;
  c.beginPath(); c.arc(0, 0, GLASS, 0, 7); c.fill();
  /* plaque des voyants de fonction : un arc autour de celui des voyants (centre
     (396,7 ; 572,2) px, rayon 310 px), de DB à HA (fig. 3-133) */
  {
    const [ax, ay] = F1P(396.7, 572.2), r0 = F1U(331), r1 = F1U(382), a0 = Math.PI * 176 / 180, a1 = Math.PI * 244 / 180;
    c.fillStyle = '#7B7873'; c.strokeStyle = '#5A5652';
    c.beginPath(); c.arc(ax, ay, r1, a0, a1); c.arc(ax, ay, r0, a1, a0, true); c.closePath(); c.fill(); c.stroke();
  }
  for (const [t, x, y, lx, ly, lens] of F1_FN){
    disc(x, y, 11, lit[t] ? '#FFF27A' : F1_LENS[lens], '#2E2B29');
    if (lit[t]){ c.save(); c.globalAlpha = .35; disc(x, y, 19, '#FFF27A'); c.restore(); }
    if (!mini) text(t, lx, ly);
  }
  /* trois voyants en haut à droite, celui du milieu barré (fig. 3-133, n° 1) */
  disc(677, 320, 11, F1_LENS.a, '#2E2B29'); disc(677, 350, 11, F1_LENS.g, '#2E2B29'); disc(677, 380, 11, F1_LENS.r, '#2E2B29');
  c.save(); c.strokeStyle = '#E5E2DD'; c.lineWidth = lw * .7;
  c.beginPath(); c.moveTo(...F1P(650, 352)); c.lineTo(...F1P(700, 352)); c.lineTo(...F1P(703, 346)); c.stroke(); c.restore();
  /* échelles 7 15 35 60 (p. 109 ; 15 allumé sur la fig. 3-130) et voyants d'état */
  plate(735, 657, 790, 768);
  for (const [t, x, y] of [['7', 717, 670], ['15', 717, 700], ['35', 715, 728], ['60', 715, 755]]){
    disc(x, y, 11, lit[t] ? '#FFF27A' : F1_LENS.a, '#2E2B29');
    if (lit[t]){ c.save(); c.globalAlpha = .35; disc(x, y, 19, '#FFF27A'); c.restore(); }
    if (!mini) text(t, 760, y);
  }
  plate(732, 816, 800, 925);
  for (const [t, y, lens] of [['AP', 830, 'a'], ['TCH', 856, 'r'], ['EMI', 882, 'r'], ['PNE', 909, 'r']]){
    disc(712, y, 11, F1_LENS[lens], '#2E2B29');
    if (!mini) text(t, 762, y);
  }
  /* afficheur E/D ± écart d'altitude (n° 9) */
  { const [a, b] = F1P(40, 841), [d, e] = F1P(295, 925);
    c.fillStyle = '#2A1414'; c.strokeStyle = '#1A1010'; c.beginPath(); c.roundRect(a, b, d - a, e - b, .03); c.fill(); c.stroke(); }
  if (!mini){
    c.save(); c.strokeStyle = '#FF5C5C';
    for (const [ch, x] of [['E', 77], ['+', 145], ['0', 219], ['0', 257]]){ const [sx, sy] = F1P(x, 879); f1Seg(c, ch, sx, sy, F1U(42)); }
    c.restore();
  }
  /* commandes du bas : plaques, boutons et molettes (p. 109 ; fig. 3-130) */
  for (const [t, x, w] of [['TEST', 168, 70], ['LUM', 280, 56], ['', 400, 90], ['REM', 515, 58], ['EFF', 637, 52]]){
    plate(x - w / 2, 928, x + w / 2, 953);
    if (mini) continue;
    if (t) text(t, x, 941, .066);
    else { const [ax, ay] = F1P(400, 975); c.save(); c.strokeStyle = '#E5E2DD'; c.lineWidth = lw * .6;
           c.beginPath(); c.arc(ax, ay, F1U(48), Math.PI * 1.3, Math.PI * 1.7); c.stroke(); c.restore(); }
  }
  for (const [x, y, r] of [[170, 981, 30], [280, 993, 37], [401, 995, 37], [533, 993, 37], [637, 981, 30]]){
    disc(x, y, r, '#1E1F21', '#4A4643');
    disc(x, y, r * .55, '#2C2D30', '#4A4643');
  }
  { const [a, b] = F1P(530, 963), [d, e] = F1P(536, 978); c.fillStyle = '#E5E2DD'; c.fillRect(a, b, d - a, e - b); }   // index de REM
  c.restore();
}

/* l'écran : la symbologie verte sur le verre, dans le repère du scope.
   - les trois traits gravés : l'axe de l'avion au milieu, deux de part et d'autre
     (p. 112 ; tous sur les fig. 3-130, 3-132, 3-133) ;
   - recherche (fig. 3-130, échelle 15 NM) : les repères de distance, un tous les 5 NM
     (p. 115), l'alidade verticale, segment de 3 km (p. 116, n° 1), deux échos (n° 3) et
     l'horizon (n° 4, p. 118) ;
   - accroché (fig. 3-132) : le balayage s'arrête, la trace vidéo n'est plus qu'une bande
     dans l'axe de l'antenne (p. 116-117), les repères de distance y reparaissent ;
     l'alidade passe à l'horizontale, décalée de 2/3 de sa longueur à gauche de la cible
     (p. 116) ; à droite, le repère de vitesse radiale : un thermomètre de +1800 kt à
     −450 kt, interrompu de 0 à −150 kt, un petit trait horizontal à la vitesse (p. 117,
     n° 1 à 3). */
function f1Scope(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle, lock = sc.page === 'lock';
  f1Bezel(c, sc.lit, o.mini);
  c.save();
  c.lineCap = 'butt';
  /* traits gravés, gris, sur toute la hauteur du verre */
  c.save(); c.strokeStyle = '#8A8F94'; c.lineWidth = lw * .22;
  c.beginPath();
  for (const x of [-.30, 0, .30]){ const h = Math.sqrt(.775 * .775 - x * x); c.moveTo(x, -h); c.lineTo(x, h); }
  c.stroke(); c.restore();
  c.strokeStyle = c.fillStyle = ink;
  const seg = (x0, y0, x1, y1, w = .9) => { c.lineWidth = lw * w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
  if (!lock){
    /* repères de distance (fig. 3-130, n° 2) et horizon (n° 4) */
    seg(-.449, -.557, .281, -.557); seg(-.517, -.174, .279, -.174); seg(-.519, .197, .277, .197);
    seg(-.311, .566, .281, .566);
    seg(-.014, -.027, -.014, .042, 1.25);                  // alidade (n° 1)
    if (!o.mini){ seg(-.054, .239, -.03, .239, 1.2); seg(.012, .262, .043, .262, 1.2); }   // échos (n° 3)
  } else {
    /* bande de la trace vidéo, repères de distance dans la bande, horizon (fig. 3-132) */
    seg(-.099, -.69, -.099, .686); seg(.019, -.694, .019, .688);
    for (const y of [-.552, -.171, .197]) seg(-.104, y, .025, y);
    seg(-.305, .562, .267, .562);
    seg(-.107, .191, -.038, .191, 1.6);                   // alidade horizontale
    if (!o.mini){
      /* vitesse radiale : positive au-dessus du zéro, la coupure de 0 à −150 kt, le bas
         négatif ; le trait de la vitesse de la figure (n° 1 à 3) */
      seg(.497, -.488, .497, -.019, .8); seg(.497, .023, .497, .084, .8);
      seg(.468, -.408, .526, -.408, .8);
    }
  }
  c.restore();
}

const f1Page = (label, scope) => ({ g:'mf1', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#2AE838', draw: f1Scope, scope: { bez:'f1', ...scope } });

Object.assign(SHAPES, {
  /* recherche air-air, HA, échelle 15 NM : voyants HA et 15 allumés (fig. 3-130) */
  mf1_search: f1Page('Scope radar (recherche)', { page:'search', lit: { HA:1, 15:1 } }),
  /* accroché (fig. 3-132) : mêmes voyants */
  mf1_lock: f1Page('Scope radar (accroché)', { page:'lock', lit: { HA:1, 15:1 } }),
});
GROUPS.push(['mf1', 'Radar Cyrano', 'Mirage F1']);
