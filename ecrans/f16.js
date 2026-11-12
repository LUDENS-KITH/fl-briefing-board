/* ---------------- F-16C : les autres pages du MFD ----------------
   DCS F-16C Early Access Guide (EN), installé avec le module : HSD p. 358-365, SMS
   p. 366-372, pod de désignation (TGP) p. 495-503, FCR air-sol GM p. 437-444. Le manuel
   ne numérote pas ses figures : chaque écran cite la page de la sienne. Places mesurées
   sur l'image d'origine de la figure (660 px, boîtier compris), dans le repère de
   mfdBezel : le verre à ±0,79, 310 px par unité, centre du verre au pixel (337,5 ; 338)
   de la figure recomposée sur son fond. Les textes de l'écran sont ceux de la figure.

   La police du MFD est plus large que celle des écrans du Hornet : mesurée sur ces
   figures, une capitale fait 0,042 de haut et un caractère occupe 0,043 ; f16Text
   étire scopeText d'autant. Une ligne vide de l'inventaire s'écrit en tirets, plus bas
   que le trait d'union de la police : ils sont tracés (f16Dashes). */

const F16_WIDE = 1.49, F16_SIZE = .064, F16_PITCH = .043, F16_WH = '#E6EDF5', F16_MAG = '#C93BDB';
function f16Text(c, t, x, y, al = 'center', size = F16_SIZE){
  if (/^-+$/.test(t)) return f16Dashes(c, t.length, al === 'left' ? x : x - t.length * F16_PITCH / 2, y);
  c.save(); c.translate(x, y); c.scale(F16_WIDE, 1); scopeText(c, t, 0, 0, al, size); c.restore();
}
function f16Dashes(c, n, x, y){
  c.beginPath();
  for (let k = 0; k < n; k++){ c.moveTo(x + k * .0415 + .009, y + .02); c.lineTo(x + k * .0415 + .036, y + .02); }
  c.stroke();
}
/* libellé : « # » en tête en vidéo inverse (le format affiché), son pavé mesuré sur les
   figures p. 358 et 366 : 0,043 par caractère, 0,066 de haut */
function f16Label(c, t, x, y, al = 'center', bg = null, size = F16_SIZE){
  if (t.startsWith('#')){
    t = t.slice(1);
    const w = t.length * F16_PITCH + .005, x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
    c.save(); c.fillStyle = c.strokeStyle; c.fillRect(x0, y - .033, w, .066); c.fillStyle = HALO;
    f16Text(c, t, x, y, al, size); c.restore();
    return;
  }
  c.save(); c.translate(x, y); c.scale(F16_WIDE, 1); scopeLabel(c, t, 0, 0, al, bg, size); c.restore();
}
/* libellés d'une page : [texte, x, y, alignement] ; la couleur est celle du contexte */
function f16Labels(c, list){ for (const [t, x, y, al, size] of list) f16Label(c, t, x, y, al || 'center', null, size); }
/* le verre seul : ce qui déborde (anneaux du HSD) est coupé au bord de l'écran */
function f16Clip(c){ c.beginPath(); c.roundRect(-GLASS, -GLASS, 2 * GLASS, 2 * GLASS, .1); c.clip(); }

/* symbole de référence de l'appareil, en bas à gauche (HSD p. 358, n° 12) : mesuré sur
   la figure p. 358 */
function f16Ars(c){
  c.beginPath();
  c.moveTo(-.671, .559); c.lineTo(-.671, .684);
  c.moveTo(-.698, .602); c.lineTo(-.671, .602); c.lineTo(-.647, .641); c.lineTo(-.628, .611);
  c.lineTo(-.612, .641); c.lineTo(-.593, .602); c.lineTo(-.555, .602);
  c.stroke();
}
/* échelle entre ses flèches, OSB 20 et 19 (p. 358, n° 7) */
function f16Range(c, rng){
  const tri = (y, up) => {
    const d = up ? -.027 : .027;
    c.beginPath(); c.moveTo(-.698, y - d); c.lineTo(-.595, y - d); c.lineTo(-.647, y + d); c.closePath(); c.stroke();
  };
  tri(-.418, true); tri(-.269, false);
  f16Text(c, String(rng), -.645, -.344);
}

/* ---- HSD (p. 358-361 ; figure p. 358) ----
   Format décentré (DEP) : l'appareil en bas, trois anneaux de distance, l'extérieur à
   l'échelle, les autres aux ⅔ et au ⅓ (n° 6) ; sur l'anneau intérieur, le nord en
   flèche vers l'extérieur, le sud en long trait à cheval, l'est et l'ouest en traits
   courts vers l'intérieur. La figure a le nord à droite : cap 270°. Le volume balayé
   par le FCR, en cyan, à sa distance (40 NM sur 60) et sa largeur (±60°) (n° 8) ; le
   curseur A-A fantôme et son relèvement/distance (n° 9, 10). La route, les menaces et
   les points de la figure appartiennent à sa mission : ils ne sont pas dessinés. */
const F16_HSD = { x: .01, y: .297, R: .897 };
function f16Hsd(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfdBezel(c);
  c.save();
  f16Clip(c);
  c.lineWidth = lw * .35;
  const { x: ox, y: oy, R } = F16_HSD, rng = o.rng ?? sc.rng, fcr = R * sc.fcr / rng;
  /* anneaux de distance */
  c.strokeStyle = c.fillStyle = F16_MAG;
  for (const f of [1, 2 / 3, 1 / 3]){ c.beginPath(); c.arc(ox, oy, R * f, 0, 7); c.stroke(); }
  /* points cardinaux sur l'anneau intérieur, au cap de la figure */
  const r = R / 3, at = (b, d) => [ox + Math.sin(b) * d, oy - Math.cos(b) * d], N = -sc.hdg * Math.PI / 180;
  c.beginPath();
  for (const k of [1, 3]){ const b = N + k * Math.PI / 2, [x1, y1] = at(b, r), [x2, y2] = at(b, r - .032); c.moveTo(x1, y1); c.lineTo(x2, y2); }
  { const b = N + Math.PI, [x1, y1] = at(b, r - .032), [x2, y2] = at(b, r + .032); c.moveTo(x1, y1); c.lineTo(x2, y2); }
  { const [x1, y1] = at(N, r), [x2, y2] = at(N, r + .032); c.moveTo(x1, y1); c.lineTo(x2, y2); }
  c.stroke();
  { const [tx, ty] = at(N, r + .061), [l1, m1] = at(N - .05, r + .032), [l2, m2] = at(N + .05, r + .032);
    c.beginPath(); c.moveTo(tx, ty); c.lineTo(l1, m1); c.lineTo(l2, m2); c.closePath(); c.fill(); }
  /* volume du FCR : ±60° (A6), jusqu'à la distance du FCR */
  c.strokeStyle = c.fillStyle = ink;
  const a6 = Math.PI / 3;
  c.beginPath();
  c.moveTo(ox - Math.sin(a6) * fcr, oy - Math.cos(a6) * fcr); c.lineTo(ox, oy); c.lineTo(ox + Math.sin(a6) * fcr, oy - Math.cos(a6) * fcr);
  c.arc(ox, oy, fcr, -Math.PI / 2 + a6, -Math.PI / 2 - a6, true);
  c.stroke();
  /* l'appareil, cyan : ailes, fuselage, empennage (n° 11) */
  c.beginPath();
  c.moveTo(ox - .036, oy - .007); c.lineTo(ox + .036, oy - .007);
  c.moveTo(ox, oy - .013); c.lineTo(ox, oy + .064);
  c.moveTo(ox - .013, oy + .051); c.lineTo(ox + .013, oy + .051);
  c.stroke();
  if (o.mini){ c.restore(); return; }
  f16Ars(c);
  /* curseur A-A fantôme : deux traits blancs (n° 9) */
  c.strokeStyle = c.fillStyle = F16_WH;
  c.beginPath(); c.moveTo(-.035, -.132); c.lineTo(-.035, -.048); c.moveTo(.055, -.132); c.lineTo(.055, -.048); c.stroke();
  f16Range(c, rng);
  f16Labels(c, sc.labels);
  c.restore();
}

/* ---- SMS, page d'inventaire (p. 366-368 ; figure p. 366, mode navigation) ----
   Le mode du SMS en haut à gauche (n° 1), l'obus restant par dizaines et son type
   (n° 2, 3), puis l'aile vue de face : chaque station en colonne de 7 caractères, à sa
   place, 1, 2, 8, 9 sur deux lignes (rail, missile), 3 à 7 sur trois (p. 367) ; une
   ligne vide s'écrit en tirets. S-J ouvre le largage sélectif (n° 5). Le texte est
   aligné sur une grille de 0,043 par caractère, mesurée sur la figure. */
const F16_INV = [
  // [gauche de la colonne, y de la 1re ligne, lignes]
  [-.71, -.476, ['51GUN']], [-.71, -.387, ['PGU28']],
  [-.1165, -.535, ['1 MAU', '1 AL119', '-------']],                 // station 5
  [-.3685, -.231, ['1 TK370', '-------', '-------']],               // station 4
  [.1365, -.231, ['1 TK370', '-------', '-------']],                // station 6
  [-.5655, -.012, ['1 MAU', '1 TER', '2 GB12']],                    // station 3
  [.3335, -.012, ['1 MAU', '1 BRU', '2 GB38']],                     // station 7
  [-.6765, .233, ['1 MRL', '1 A-9X']], [.4285, .233, ['1 MRL', '1 A-9X']],      // stations 2 et 8
  [-.6765, .410, ['1 MRL', '1 A120C']], [.4285, .410, ['1 MRL', '1 A120C']],    // stations 1 et 9
];
function f16Inv(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  mfdBezel(c);
  c.save();
  c.lineWidth = lw * .35;
  c.strokeStyle = c.fillStyle = F16_WH;
  if (o.mini){
    /* vignette : les lignes vides des stations 4, 5 et 6, en tirets comme sur la figure */
    for (const [x, y] of [[-.1165, -.417], [-.3685, -.172], [-.3685, -.113], [.1365, -.172], [.1365, -.113]]) f16Dashes(c, 7, x, y);
    c.restore(); return;
  }
  for (const [x, y, lines] of F16_INV) lines.forEach((t, i) => f16Text(c, t, x, y + i * .059, 'left'));
  f16Labels(c, sc.labels);
  c.restore();
}

/* ---- TGP, pod de désignation en A-G (p. 495-499 ; figure p. 495) ----
   La vidéo du capteur remplit le verre (ici un gris uni : aucune image n'est reprise),
   la symbologie est blanche, cernée de noir pour se lire sur l'image. Un cadre blanc
   coupé par les libellés ; mode A-G, PTR, WIDE, OVRD, CNTL en haut (n° 1-5) ;
   coordonnées et altitude du SPI, sa qualité HQ (n° 6, 7) ; zoom 1.0X (n° 25) ;
   hauteur radar (n° 8) ; flèche du nord (n° 9) ; LST, MT à gauche (n° 10, 14) ;
   WHOT, NT, SP, CZ, TGT à droite (n° 12, 13, 15, 19, 20) ; indicateur de visée du pod
   (n° 11) ; grand réticule du mode asservi et crochets du champ étroit (n° 16, 18) ;
   longueur du réticule en mètres (n° 17) ; distance estimée E (n° 22), temps restant
   et heure sur l'objectif (n° 23, 24). Petits textes : capitale de 0,033, pas de 0,030. */
const F16_GREY = '#5F656A';
function f16Small(c, t, x, y, al = 'center'){
  c.save(); c.translate(x, y); c.scale(1.28, 1); scopeText(c, t, 0, 0, al, .052); c.restore();
}
/* texte ou trait cerné de noir, comme sur la vidéo */
function f16Ringed(c, paint){
  const col = c.fillStyle, lw = c.lineWidth;
  c.save(); c.fillStyle = c.strokeStyle = HALO; c.lineWidth = lw * 1.9;
  for (const [dx, dy] of [[-.005, 0], [.005, 0], [0, -.005], [0, .005]]){ c.save(); c.translate(dx, dy); paint(); c.restore(); }
  c.restore();
  c.save(); c.fillStyle = c.strokeStyle = col; paint(); c.restore();
}
/* cadre du format : un trait coupé autour de chaque libellé ; [x1, y1, x2, y2, coupures] */
function f16Frame(c, sides){
  c.beginPath();
  for (const [x1, y1, x2, y2, cuts] of sides){
    const hor = y1 === y2, a0 = hor ? x1 : y1, a1 = hor ? x2 : y2;
    let a = a0;
    for (const [g0, g1] of [...cuts, [a1, a1]]){
      if (g0 > a){ hor ? (c.moveTo(a, y1), c.lineTo(g0, y1)) : (c.moveTo(x1, a), c.lineTo(x1, g0)); }
      a = Math.max(a, g1);
    }
  }
  c.stroke();
}
const F16_TGP = { x: .008, y: -.0065 };
function f16Tgp(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfdBezel(c);
  c.save();
  c.fillStyle = F16_GREY;
  c.beginPath(); c.roundRect(-GLASS, -GLASS, 2 * GLASS, 2 * GLASS, .1); c.fill();
  c.strokeStyle = c.fillStyle = F16_WH;
  const { x: X, y: Y } = F16_TGP;
  /* grand réticule (mode asservi) et crochets du champ étroit, en trait épais */
  c.lineWidth = lw * .8;
  f16Ringed(c, () => {
    c.beginPath();
    for (const s of [-1, 1]){
      c.moveTo(X + s * .036, Y); c.lineTo(X + s * .312, Y);
      c.moveTo(X, Y + s * .036); c.lineTo(X, Y + s * .312);
    }
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]){
      const bx = X + sx * .175, by = Y + sy * .175;
      c.moveTo(bx - sx * .071, by); c.lineTo(bx, by); c.lineTo(bx, by - sy * .071);
    }
    c.stroke();
  });
  if (o.mini){ c.restore(); return; }
  c.lineWidth = lw * .4;
  f16Format(c, sc, ink);
  /* indicateur de visée du pod : un petit carré (n° 11) */
  f16Ringed(c, () => c.strokeRect(-.313, -.352, .015, .015));
  /* flèche du nord : la flèche vers le nord, un nœud papillon en travers (n° 9) */
  f16Ringed(c, () => {
    c.beginPath();
    c.moveTo(.464, -.492); c.lineTo(.250, -.514);
    c.moveTo(.272, -.524); c.lineTo(.250, -.514); c.lineTo(.270, -.502);
    c.moveTo(.341, -.533); c.lineTo(.341, -.463); c.lineTo(.396, -.540); c.lineTo(.396, -.469); c.lineTo(.341, -.533);
    c.stroke();
  });
  c.restore();
}

/* cadre et textes d'un format sur image (TGP, carte radar), blancs cernés de noir :
   le cadre est coupé autour de chaque libellé (coupures mesurées sur les figures
   p. 437 et 495 : ±(n × 0,0215 + 0,012) en haut, + 0,004 en bas, ±0,045 au-delà des
   lettres d'une colonne) ; `big` en police du MFD, `data` en petits textes ; le repère
   de l'appareil à la couleur de l'objet. */
function f16Format(c, sc, ink){
  c.save();
  c.strokeStyle = c.fillStyle = F16_WH;
  const half = (t, m) => t.replace(/^[#^]/, '').length * .0215 + m;
  const T = -.716, B = .707, L = -.703, R = .722;
  const vcut = ys => [ys[0] - .045, ys[ys.length - 1] + .045];
  const rcut = sc.big.filter(([, x, , al]) => al === 'right' && x > .65).map(([, , y]) => [y - .04, y + .04]);
  f16Ringed(c, () => f16Frame(c, [
    [L, T, R, T, sc.top.map(([t, x]) => [x - half(t, .012), x + half(t, .012)])],
    [L, B, R, B, sc.bottom.map(([t, x]) => [x - half(t, .004), x + half(t, .004)])],
    [L, T, L, B, [...(sc.leftCut || []), ...sc.left.map(([, ys]) => vcut(ys))].sort((a, b) => a[0] - b[0])],
    [R, T, R, B, [...rcut, ...sc.right.map(([, ys]) => vcut(ys))].sort((a, b) => a[0] - b[0])],
  ]));
  const lab = (t, x, y, al) => f16Ringed(c, () => f16Label(c, t, x, y, al));
  for (const [t, x] of sc.top) lab(t, x, -.684);
  for (const [t, x] of sc.bottom){
    if (t.startsWith('#')) f16Label(c, t, x, .676); else lab(t, x, .676);
  }
  for (const [t, ys] of sc.left) [...t].forEach((ch, i) => lab(ch, -.684, ys[i]));
  for (const [t, ys] of sc.right) [...t].forEach((ch, i) => lab(ch, .70, ys[i]));
  for (const [t, x, y, al] of sc.big) lab(t, x, y, al);
  for (const [t, x, y, al] of sc.data) f16Ringed(c, () => f16Small(c, t, x, y, al || 'center'));
  c.strokeStyle = c.fillStyle = ink;
  f16Ars(c);
  c.restore();
}

/* ---- FCR air-sol, carte GM (p. 437-438 ; figure p. 437) ----
   Carte en PPI : l'appareil au milieu du bas du cadre, la distance croît vers le haut
   (le haut du cadre = l'échelle, 40 NM) ; arcs de distance au ¼, ½, ¾ de l'échelle,
   sur ±60° (A6) ; mesurés sur la figure, centre (0,01 ; 0,707), rayons 0,359, 0,715,
   1,08. La carte radar (l'image) est rendue ici par un gris sombre uni, sur le secteur
   balayé. Curseur d'acquisition : une croix de tout le cadre, ouverte au centre, une
   barrette à 0,18 de part et d'autre. Échelle de gain (crochet et repère, en haut à
   gauche), flèches d'échelle, A6 (largeur), EGM (traitement), BARO, FZ, SP, CZ, TGT ;
   en cyan, l'horizon, les échelles d'élévation et d'azimut de l'antenne et ses repères,
   comme en air-air (p. 396-397). */
const F16_GM = { x: .01, y: .707, R: 1.423 };
function f16Gm(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfdBezel(c);
  c.save();
  const { x: ox, y: oy, R } = F16_GM, a6 = Math.PI / 3;
  /* secteur balayé, dans le cadre */
  c.save();
  c.beginPath(); c.rect(-.703, -.716, 1.425, 1.423); c.clip();
  c.fillStyle = '#2B3238';
  c.beginPath(); c.moveTo(ox, oy); c.arc(ox, oy, 2, -Math.PI / 2 - a6, -Math.PI / 2 + a6); c.closePath(); c.fill();
  c.lineWidth = lw * .4;
  c.strokeStyle = F16_WH;
  for (const f of [.25, .5, .75]){ c.beginPath(); c.arc(ox, oy, R * f * 1.006, -Math.PI / 2 - a6, -Math.PI / 2 + a6); c.stroke(); }
  /* curseur d'acquisition */
  const [cx, cy] = sc.cursor;
  c.beginPath();
  c.moveTo(-.703, cy); c.lineTo(cx - .03, cy); c.moveTo(cx + .03, cy); c.lineTo(.722, cy);
  c.moveTo(cx, -.716); c.lineTo(cx, cy - .03); c.moveTo(cx, cy + .03); c.lineTo(cx, .707);
  for (const s of [-1, 1]){
    c.moveTo(cx + s * .18, cy - .015); c.lineTo(cx + s * .18, cy + .015);
    c.moveTo(cx - .016, cy + s * .178); c.lineTo(cx + .016, cy + s * .178);
  }
  c.stroke();
  c.restore();
  if (o.mini){ c.restore(); return; }
  c.lineWidth = lw * .4;
  /* en cyan : horizon (bouts tournés vers le sol), élévation de l'antenne et son repère,
     azimut de l'antenne et son repère */
  c.strokeStyle = c.fillStyle = ink;
  c.beginPath();
  c.moveTo(-.355, .041); c.lineTo(-.355, .016); c.lineTo(.355, .016); c.lineTo(.355, .041);
  for (let k = -3; k <= 3; k++){ const y = k * .118; c.moveTo(k ? -.578 : -.60, y); c.lineTo(k ? -.535 : -.511, y); }
  c.moveTo(-.634, 0); c.lineTo(-.594, 0); c.moveTo(-.594, -.022); c.lineTo(-.594, .022);
  for (let k = -3; k <= 3; k++){ const x = .01 + k * .119; c.moveTo(x, k ? .584 : .558); c.lineTo(x, .626); }
  c.moveTo(-.134, .64); c.lineTo(-.092, .64); c.moveTo(-.113, .64); c.lineTo(-.113, .681);
  c.stroke();
  c.lineWidth = lw * .4;
  f16Format(c, sc, ink);
  /* échelle de gain : un crochet, le niveau en chevron (p. 437) ; flèches d'échelle */
  c.strokeStyle = c.fillStyle = F16_WH;
  f16Ringed(c, () => {
    c.beginPath();
    c.moveTo(-.631, -.666); c.lineTo(-.678, -.666); c.lineTo(-.678, -.489); c.lineTo(-.631, -.489);
    c.moveTo(-.637, -.556); c.lineTo(-.676, -.53); c.lineTo(-.637, -.508);
    c.stroke();
  });
  f16Ringed(c, () => f16Range(c, o.rng ?? sc.rng));
  c.restore();
}

/* page d'un format du MFD : boîtier, libellés de la figure, contenu propre */
const f16Other = (label, draw, scope) => ({ g:'f16p', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#4FC3F7', draw, scope: { bez:'mfd', ...scope } });

Object.assign(SHAPES, {
  /* libellés de la figure p. 358 : DEP, DCPL, NORM, MSG, CNTL en haut (n° 1-5) ;
     XMT TNDL (n° 26), FZ (n° 15), FR OFF (n° 30), CZ (n° 18) à droite ; le relèvement
     et la distance du curseur fantôme à gauche (n° 10) ; les formats en bas */
  f16_hsd: f16Other('Écran HSD', f16Hsd,
    { page:'hsd', rng:60, fcr:40, hdg:270, ranges:[15, 30, 60, 120, 240],
      labels: [['DEP', -.463, -.682], ['DCPL', -.229, -.682], ['NORM', .005, -.682], ['MSG', .244, -.682], ['CNTL', .478, -.682],
               ['XMT', .715, -.488, 'right'], ['TNDL', .715, -.44, 'right'], ['FZ', .718, -.231, 'right'],
               ['FR', .718, .202, 'right'], ['OFF', .718, .258, 'right'], ['C', .702, .437], ['Z', .702, .487],
               ['276', -.692, .337, 'left', .054], ['13', -.566, .337, 'left', .054],
               ['SWAP', -.458, .679], ['SMS', -.224, .679], ['#HSD', .011, .676], ['TGP', .244, .679], ['DCLT', .478, .679]] }),
  f16_sms: f16Other('Écran SMS (inventaire)', f16Inv,
    { page:'sms', labels: [['STBY', -.463, -.682],
      ['SWAP', -.46, .673], ['#SMS', -.226, .673], ['HSD', .008, .673], ['TGP', .244, .673], ['S-J', .479, .673]] }),
  /* textes de la figure p. 495 ; les lettres des côtés en colonne, à leur hauteur */
  f16_tgp: f16Other('Écran du pod (A-G)', f16Tgp,
    { page:'tgp',
      top: [['A-G', -.464], ['PTR', -.226], ['WIDE', .009], ['OVRD', .245], ['CNTL', .483]],
      bottom: [['SWAP', -.458], ['SMS', -.2225], ['HSD', .0125], ['#TGP', .245], ['DCLT', .481]],
      left: [['LST', [-.518, -.464, -.41]], ['MT', [-.027, .028]]],
      right: [['NT', [-.262, -.208]], ['SP', [-.034, .024]], ['CZ', [.202, .26]], ['TGT', [.395, .453, .511]]],
      big: [['WHOT', .718, -.465, 'right'], ['1.0X', .012, -.596]],
      data: [['035:44.068', -.180, -.611, 'right'], ['037:07.155', -.180, -.567, 'right'], ['+809', -.180, -.512, 'right'],
             ['HQ', -.418, -.469], ['5890', .592, -.598], ['62', .387, -.051], ['E 2.4', -.523, .591, 'left'],
             ['000:19', .613, .531, 'right'], ['0908:27', .613, .589, 'right']] }),
  /* textes de la figure p. 437 : GM, AUTO (bascule d'échelle), NORM, OVRD, CNTL ;
     relèvement/distance du curseur et temps restant en bas */
  f16_gm: f16Other('Écran FCR GM (air-sol)', f16Gm,
    { page:'gm', rng:40, ranges:[10, 20, 40, 80], cursor: [-.197, .067],
      top: [['GM', -.455], ['AUTO', -.228], ['NORM', .006], ['OVRD', .24], ['CNTL', .478]],
      bottom: [['SWAP', -.454], ['#FCR', -.223], ['FLCS', .015], ['TEST', .24], ['DCLT', .48]],
      leftCut: [[-.453, -.234]],
      left: [['A6', [-.025, .027]], ['EGM', [.178, .232, .285]]],
      right: [['BARO', [-.546, -.491, -.436, -.381]], ['CZ', [.202, .256]], ['TGT', [.406, .46, .513]]],
      big: [['FZ', .72, -.23, 'right'], ['SP', .72, .003, 'right']],
      data: [['265 00', -.705, .484, 'left'], ['002:36', .608, .529, 'right']] }),
});
GROUPS.push(['f16p', 'Autres pages', 'F-16C']);
