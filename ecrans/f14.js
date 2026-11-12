/* FL Briefing Board — écrans de bord du F-14B (lot 28)
   Heatblur F-14 Tomcat, manuel du module (F-14 Manual.pdf) : TID p. 158 et p. 352-365,
   DDD p. 153-157 et p. 345-351, modes du radar p. 389-397, TWS et AIM-54 p. 484-485.
   Rien d'autre pour ces trois écrans : ni guide tiers, ni capture. Le VDI du pilote
   (lot 29) suit les fichiers du jeu, recalés sur deux images du jeu (voir son en-tête).
   Les figures sont des vues du poste en jeu, prises de biais : chaque place est relevée sur l'image d'origine de la figure et ramenée
   au repère de l'écran (verre à ±0,79) par l'ovale du verre de cette même figure. */

/* les boîtiers ne sont pas centrés sur leur verre : `dx` recentre le boîtier entier dans
   le carré de la forme, après `k` et `dy` comme les autres boîtiers */
BEZELS.tid = { k: .858, dy: .15, dx: .017 };
BEZELS.ddd = { k: .6, dy: -.013, dx: .045 };
function f14Frame(c, kind){ bezelFrame(c, kind); c.translate(BEZELS[kind].dx || 0, 0); }

/* texte de l'écran : `cap` la hauteur des chiffres, `pitch` le pas d'un caractère,
   mesurés sur la figure ; la police des écrans du RIO est haute et serrée */
function f14Text(c, t, x, y, al, cap, pitch){
  const size = cap / .64;
  c.save(); c.translate(x, y);
  if (pitch) c.scale(pitch / (size * CW), 1);
  scopeText(c, t, 0, 0, al || 'center', size);
  c.restore();
}
function f14Screw(c, x, y, r){
  c.save();
  c.fillStyle = '#4A4B4F'; c.strokeStyle = '#26272A';
  c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(x - r * .6, y); c.lineTo(x + r * .6, y); c.moveTo(x, y - r * .6); c.lineTo(x, y + r * .6); c.stroke();
  c.restore();
}
/* bouton rond cranté, son chapeau blanc et son index noir ; la jupe crantée est blanche
   (CONTRAST, BRIGHT, PULSE VIDEO) ou noire (PULSE GAIN, ERASE) */
function f14Knob(c, x, y, r, a, dark){
  c.save();
  c.fillStyle = dark ? '#1E1F22' : '#D9DADC'; c.strokeStyle = dark ? '#45474C' : '#7C7E82';
  c.beginPath();
  for (let i = 0; i < 48; i++){
    const t = i / 48 * 2 * Math.PI, rr = r * (i % 2 ? .92 : 1);
    c.lineTo(x + Math.cos(t) * rr, y + Math.sin(t) * rr);
  }
  c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#4A4C51'; c.beginPath(); c.arc(x, y, r * .74, 0, 7); c.fill();
  c.fillStyle = '#ECEDEF'; c.strokeStyle = '#8A8C90'; c.beginPath(); c.arc(x, y, r * .6, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#2A2B2F'; c.lineWidth *= 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * .52, y + Math.sin(a) * r * .52); c.stroke();
  c.restore();
}
const f14Lbl = (c, t, x, y, size = .04) => bezelText(c, t, x, y, size, '#D6D7D9');

/* ---------------- TID ----------------
   Boîtier : figure p. 158 (image d'origine 1192 × 1080 px, vue d'ensemble, centre du
   verre (604, 432), rayon 343 px) pour les oreilles, et figure p. 366 (700 × 695 px, vue
   de face, rayon 315 px) pour l'anneau et le bandeau du haut. La p. 158 est prise d'en
   haut : le panneau, devant l'écran enfoncé, y descend de 56 px et s'y élargit d'un
   dixième ; ses places sont ramenées sur la p. 366 (les deux boutons CONTRAST et BRIGHT,
   présents sur les deux, font le recalage). Un anneau autour du verre rond ; au-dessus, le
   bandeau et ses deux oreilles : à gauche la fenêtre d'état de l'INS (1), CONTRAST (2),
   NAV MODE (12), TRACK HOLD (11) ; en haut le tambour de lecture (3) ; à droite BRIGHT (4),
   la fenêtre STEERING (5), DEST (6), CLSN (7) (p. 353-354). Le pupitre du dessous (8, 9,
   10) est un panneau à part : il n'est pas dessiné. Les boutons CONTRAST et BRIGHT sont
   symétriques de part et d'autre du verre sur la p. 485 : le panneau de la p. 158, décalé
   de 8 px vers la gauche par la prise de vue, est recentré de 0,017. */
function tidBezel(c){
  f14Frame(c, 'tid');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  /* bandeau et oreilles */
  c.fillStyle = '#3D3E43'; c.strokeStyle = '#55575C';
  c.beginPath();
  c.moveTo(-1.2, -1.14); c.lineTo(1.132, -1.14); c.lineTo(1.132, -.40); c.lineTo(1.049, .028);
  c.lineTo(-1.045, .028); c.lineTo(-1.2, -.40);
  c.closePath(); c.fill(); c.stroke();
  /* l'anneau (p. 366 et p. 158 : bord extérieur entre 0,84 et 0,89), sous les commandes */
  c.fillStyle = '#34353A'; c.strokeStyle = '#5E6066';
  c.beginPath(); c.arc(0, 0, .87, 0, 7); c.fill(); c.stroke();
  c.save(); c.translate(.017, 0);
  /* fenêtre d'état de l'INS (deux cases), tambour, fenêtre STEERING */
  const win = (x, y, w, h) => {
    c.fillStyle = '#1C1D20'; c.strokeStyle = '#6A6C71'; roundBox(c, x, y, w, h, .015);
    c.fillStyle = '#2E3A4E'; roundBox(c, x, y, w * .72, h * .5, .008);
  };
  c.fillStyle = '#1C1D20'; c.strokeStyle = '#6A6C71'; roundBox(c, -1.029, -.894, .28, .207, .02);
  c.fillStyle = '#26272B'; roundBox(c, -1.029, -.94, .225, .07, .005); roundBox(c, -1.029, -.85, .225, .07, .005);
  win(-.008, -1.043, .166, .092);
  win(.997, -.799, .186, .11);
  f14Lbl(c, 'CONTRAST', -.616, -.917, .039); f14Lbl(c, 'BRIGHT', .572, -.923, .039); f14Lbl(c, 'STEERING', 1.012, -.91, .039);
  f14Knob(c, -.626, -.732, .062, -1.9);
  f14Knob(c, .593, -.732, .062, -.35);
  /* NAV MODE : bouton à index, sur INS ; ses positions et leurs crochets */
  f14Lbl(c, 'NAV MODE', -.906, -.728, .042);
  for (const [t, x, y] of [['ALIGN', -1.07, -.603], ['CAT', -.972, -.629], ['INS', -.896, -.64], ['AHRS', -.792, -.629],
                           ['AM', -.728, -.654], ['CVA', -1.028, -.56], ['IMU', -.74, -.56], ['GND', -1.037, -.495], ['OFF', -.999, -.433]])
    f14Lbl(c, t, x, y, .034);
  c.save(); c.strokeStyle = '#D6D7D9';
  c.beginPath();
  c.moveTo(-1.088, -.575); c.quadraticCurveTo(-1.115, -.53, -1.088, -.483);     // ALIGN : CVA, GND
  c.moveTo(-1.05, -.62); c.lineTo(-1.015, -.665); c.lineTo(-.99, -.648);       // ALIGN – CAT
  c.moveTo(-.812, -.65); c.lineTo(-.78, -.677); c.lineTo(-.752, -.664);        // AHRS – AM
  c.moveTo(-.712, -.63); c.lineTo(-.698, -.598); c.lineTo(-.716, -.57);        // AM – IMU
  c.stroke(); c.restore();
  c.fillStyle = '#1E1F22'; c.strokeStyle = '#55575C';
  c.beginPath(); c.arc(-.879, -.507, .087, 0, 7); c.fill(); c.stroke();
  c.save(); c.translate(-.879, -.507); c.rotate(-.27);
  c.fillStyle = '#2A2B2F'; c.beginPath(); c.roundRect(-.032, -.08, .064, .18, .02); c.fill(); c.stroke();
  c.strokeStyle = '#D6D7D9'; c.lineWidth = lw * .9; c.beginPath(); c.moveTo(0, -.075); c.lineTo(0, .02); c.stroke();
  c.restore();
  /* DEST : bouton à index ; ses positions */
  f14Lbl(c, 'DEST', .867, -.709, .042);
  for (const [t, x, y] of [['1', .717, -.502], ['2', .738, -.571], ['3', .786, -.629], ['FP', .858, -.652], ['IP', .931, -.633],
                           ['ST', .976, -.576], ['HB', .987, -.507], ['MAN', .997, -.44]])
    f14Lbl(c, t, x, y, .034);
  c.fillStyle = '#1E1F22'; c.strokeStyle = '#55575C';
  c.beginPath(); c.arc(.856, -.479, .097, 0, 7); c.fill(); c.stroke();
  c.save(); c.translate(.856, -.479); c.rotate(-.62);
  c.fillStyle = '#2A2B2F'; c.beginPath(); c.roundRect(-.1, -.032, .2, .064, .02); c.fill(); c.stroke();
  c.restore();
  /* TRACK HOLD et CLSN : boutons carrés à voyant */
  for (const [x, w, h] of [[-.952, .166, .15], [.93, .176, .157]]){
    c.fillStyle = '#1C1D20'; c.strokeStyle = '#6A6C71'; roundBox(c, x, -.176, w, h, .015);
    c.fillStyle = '#5B5E63'; c.strokeStyle = '#7C7E82'; roundBox(c, x, -.176, w * .76, h * .7, .01);
  }
  for (const [x, y] of [[-.931, -.012], [-1.159, -.094], [.898, -.012]]) f14Screw(c, x, y, .036);
  c.restore();
  /* vis du bandeau et de l'anneau (p. 366), verre */
  for (const x of [-.385, .385]) f14Screw(c, x, -.868, .036);
  c.strokeStyle = '#6E7076'; c.beginPath(); c.arc(0, 0, .80, 0, 7); c.stroke();
  for (const x of [-.15, .168]) f14Screw(c, x, -.818, .022);
  c.fillStyle = '#0B0C0B';
  c.beginPath(); c.arc(0, 0, GLASS, 0, 7); c.fill();
  c.restore();
}

/* page TWS, figure p. 485 (image d'origine 842 × 750 px ; centre du verre (411, 375),
   390 px en largeur, 340 px en hauteur : la vue est un peu plongeante). Stabilisée sur
   l'avion : l'appareil en bas (p. 355, 358), les limites du balayage en tirets de
   20 NM depuis lui (p. 364) ; trois pistes hostiles, chevron sur point (p. 359), vecteur
   vitesse (p. 363), altitude à gauche et ordre de tir AIM-54 à droite (p. 362-363), la
   piste accrochée plus brillante (p. 358) ; à gauche l'élévation d'antenne entre les
   bornes du balayage, les compteurs de cycle du calculateur, l'état de navigation et
   l'arme choisie (p. 357). */
const F14_HOT = '#E6EDF5';
function f14Tid(c, o){
  const lw = c.lineWidth, ink = c.strokeStyle;
  c.save();
  tidBezel(c);
  c.save();
  c.beginPath(); c.arc(0, 0, GLASS, 0, 7); c.clip();
  c.strokeStyle = c.fillStyle = ink;
  c.lineWidth = lw * .4;
  const oy = .5065;                                         // l'appareil
  c.beginPath(); c.arc(0, oy, .02, 0, 7); c.stroke();
  /* limites du balayage : un tiret, un blanc, de 20 NM chacun (0,285 unité sur la figure) */
  const az = .414, step = .285;                            // 23,7° de part et d'autre
  c.beginPath();
  for (const s of [-1, 1]) for (let d = 0; d < 2.2; d += 2 * step){
    const ux = s * Math.sin(az), uy = -Math.cos(az);
    c.moveTo(ux * d, oy + uy * d); c.lineTo(ux * (d + step), oy + uy * (d + step));
  }
  c.stroke();
  if (o.mini){ c.restore(); c.restore(); return; }
  /* pistes [x, y, altitude, ordre de tir, vecteur, accrochée] */
  for (const [x, y, alt, fo, v, hot] of [[-.132, -.188, '1', '2', .107, 1], [.008, -.142, '2', '1', .095, 0], [.17, -.207, '3', '3', .107, 0]]){
    c.save();
    if (hot) c.strokeStyle = c.fillStyle = F14_HOT;
    c.beginPath(); c.arc(x, y, .006, 0, 7); c.fill();
    c.beginPath();
    c.moveTo(x - .03, y + .0093); c.lineTo(x, y - .023); c.lineTo(x + .03, y + .0093);
    c.moveTo(x, y); c.lineTo(x, y + v);
    c.stroke();
    f14Text(c, alt, x - .04, y + .002, 'center', .038, .021);
    f14Text(c, fo, x + .039, y + .002, 'center', .038, .021);
    c.restore();
  }
  /* lectures */
  const T = (t, x, y) => f14Text(c, t, x, y, 'center', .04, .021);
  T('53', -.603, -.1115); T('-00.0', -.603, -.0534); T('0', -.603, .0046);
  T('347', -.462, .1743); T('442', .596, .0302); T('IN', .407, .2207);
  c.fillStyle = F14_HOT; T('PH6', .363, .2765);
  c.restore();
  c.restore();
}

/* ---------------- DDD ----------------
   Figure p. 408, image d'origine 1705 × 1003 px, vue de face : centre de l'écran
   (1003, 496), rayon 274 px, 0,002884 unité par pixel. L'écran rond, vert, coupé en haut
   et en bas par sa fenêtre ; autour, le panneau central du DDD : voyants ANT TRK, RDROT,
   JAT, IROT et tambour RANGE (p. 346-347), boutons PULSE VIDEO et BRIGHT, bascules
   ASPECT et Vc, boutons PULSE GAIN et ERASE (p. 348-349), vis. Les six boutons de portée
   du dessus (figure p. 153) sont hors de la figure : pas dessinés. */
function dddBezel(c){
  f14Frame(c, 'ddd');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#46484D'; c.strokeStyle = '#6E7076';
  c.beginPath(); c.roundRect(-1.71, -1.433, 3.331, 2.892, .03); c.fill(); c.stroke();
  /* joints entre les plaques */
  c.strokeStyle = '#2E2F33';
  c.beginPath();
  c.moveTo(-1.71, -.164); c.lineTo(-.99, -.164); c.moveTo(.99, -.164); c.lineTo(1.621, -.164);
  c.moveTo(0, .715); c.lineTo(0, 1.459);
  c.stroke();
  /* voyants, tambour */
  for (const [t, x] of [['ANT TRK', -1.451], ['RDROT', -.81], ['JAT', .683], ['IROT', 1.295]]){
    f14Lbl(c, t, x, -1.223, .1);
    c.fillStyle = '#2F4A3E'; c.strokeStyle = '#1E1F22';
    c.beginPath(); c.arc(x, -1.054, .049, 0, 7); c.fill(); c.stroke();
  }
  f14Lbl(c, 'RANGE', -.046, -1.312, .1);
  c.fillStyle = '#26272B'; c.strokeStyle = '#7C7E82'; roundBox(c, -.056, -1.066, .51, .245, .02);
  c.fillStyle = '#3A4466'; roundBox(c, -.051, -1.066, .331, .083, .005);      // vide en pulse-Doppler (p. 346)
  for (const [x, y] of [[-.562, -.857], [.482, -.857], [-.34, 1.119], [.265, 1.119], [-1.552, 1.278], [1.514, 1.278]]) f14Screw(c, x, y, .063);
  /* boutons et bascules */
  f14Lbl(c, 'PULSE VIDEO', -1.312, -.848, .11); f14Knob(c, -1.465, -.554, .2, -Math.PI / 2);
  f14Lbl(c, '+ BRIGHT', 1.246, -.857, .11); f14Knob(c, 1.304, -.554, .2, .45);
  f14Lbl(c, 'ASPECT', -1.479, .043, .09); f14Lbl(c, 'NOSE', -1.479, .159, .075);
  f14Lbl(c, 'BEAM', -1.182, .36, .075); f14Lbl(c, 'TAIL', -1.479, .565, .075);
  f14Lbl(c, 'Vc', 1.405, .043, .09); f14Lbl(c, 'X4', 1.405, .147, .075);
  f14Lbl(c, 'NORM', 1.131, .349, .075); f14Lbl(c, 'VID', 1.419, .585, .075);
  for (const x of [-1.503, 1.425]){
    c.fillStyle = '#1E1F22'; c.strokeStyle = '#3A3B3F'; c.beginPath(); c.arc(x, .36, .1, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#C9CBCF'; c.strokeStyle = '#7C7E82'; roundBox(c, x, .36, .23, .087, .03);
  }
  for (const x of [-1.047, 1.03]){ c.fillStyle = '#2C2D31'; c.strokeStyle = '#3A3B3F'; c.beginPath(); c.arc(x, .043, .1, 0, 7); c.fill(); c.stroke(); }
  f14Lbl(c, 'PULSE', -1.182, .701, .1); f14Lbl(c, 'GAIN', -1.182, .81, .1);
  c.save(); c.strokeStyle = '#D6D7D9'; c.lineWidth = lw * .7;
  c.beginPath();
  for (let d = -150; d <= 30; d += 30){
    const a = d * Math.PI / 180;
    c.moveTo(-1.234 + Math.cos(a) * .2, 1.142 + Math.sin(a) * .2); c.lineTo(-1.234 + Math.cos(a) * .25, 1.142 + Math.sin(a) * .25);
  }
  c.moveTo(-1.234 + .2 * Math.cos(.9), 1.142 + .2 * Math.sin(.9)); c.lineTo(-.94, 1.306);
  c.stroke(); c.restore();
  f14Lbl(c, 'NORM', -.80, 1.306, .075);
  f14Knob(c, -1.234, 1.142, .19, -Math.PI / 2, true);
  f14Lbl(c, 'ERASE', 1.139, .81, .1); f14Knob(c, 1.159, 1.142, .19, -Math.PI / 2, true);
  /* fenêtre : large en haut sous le bandeau des voyants, étroite autour de l'écran */
  c.fillStyle = '#060606';
  c.beginPath(); c.roundRect(-.99, -.712, 1.98, .56, [.15, .15, 0, 0]); c.fill();
  c.beginPath(); c.roundRect(-.842, -.712, 1.684, 1.427, [.15, .15, .12, .12]); c.fill();
  c.restore();
}

/* l'écran en recherche pulse-Doppler : l'azimut en largeur, la vitesse de rapprochement
   en hauteur (p. 350, 392). Le réseau gravé est celui de la figure p. 408 : deux
   verticales à ±30° graduées, la croix du centre, l'échelle d'azimut du bas et ses
   chiffres, les repères des bords et le « 0 » de droite. Les échos et la trace du
   fouillis du lobe principal sont ceux de la figure p. 394 (cibles 1, 2, 3, 5, 6, 7 de
   son tableau p. 395 ; la 4, dans le fouillis, n'apparaît pas), recalés sur ce réseau
   par ses deux verticales et son échelle du bas. */
const F14_GRID = '#0B1610';
function f14Ddd(c, o){
  const lw = c.lineWidth, face = c.strokeStyle;
  c.save();
  dddBezel(c);
  c.save();
  c.beginPath(); c.arc(0, 0, GLASS, 0, 7); c.clip();
  c.fillStyle = face; c.fillRect(-GLASS, -.672, 2 * GLASS, 1.335);
  c.strokeStyle = c.fillStyle = F14_GRID;
  c.lineWidth = lw * .45;
  const X = .29, top = -.558, base = .545;
  c.beginPath();
  for (const x of [-X, X]){
    c.moveTo(x, top); c.lineTo(x, base);
    for (const y of [top, -.337, -.114, .108, .326]){ c.moveTo(x - .026, y); c.lineTo(x + .026, y); }
  }
  c.moveTo(-.56, base); c.lineTo(.56, base);
  for (let k = -5; k <= 5; k++){ if (Math.abs(k) !== 3){ c.moveTo(k * .0943, base); c.lineTo(k * .0943, base + (k ? .052 : .029)); } }
  c.moveTo(-.05, -.006); c.lineTo(.05, -.006); c.moveTo(0, -.053); c.lineTo(0, .041);
  for (const y of [-.384, -.201, -.015, .167, .348]){ c.moveTo(.626, y); c.lineTo(.683, y); }
  c.moveTo(-.709, -.277); c.lineTo(-.658, -.277); c.moveTo(-.709, 0); c.lineTo(-.632, 0); c.moveTo(-.703, .274); c.lineTo(-.657, .274);
  c.stroke();
  if (!o.mini){
    for (const [t, x] of [['30', -.29], ['0', 0], ['30', .288]]) f14Text(c, t, x, .614, 'center', .033, .022);
    f14Text(c, '0', .689, .317, 'center', .023, .016);
    /* trace du fouillis du lobe principal (p. 394) */
    c.beginPath();
    for (let x = -.578; x <= .565; x += .02){
      const y = -.008 + .198 * ((x + .007) / .571) ** 2;
      if (x === -.578) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    /* échos */
    for (const [x, y] of [[-.561, -.101], [-.363, -.101], [-.288, -.067], [.291, .128], [.444, .33], [.551, .427]])
      c.fillRect(x - .0315, y - .0085, .063, .017);
  }
  c.restore();
  c.restore();
}

/* ---------------- HSD du pilote ----------------
   Figure p. 72, image d'origine 1206 × 1080 px, vue de face : verre de 805 × 925 px aux
   coins arrondis, centre (602,5 ; 487,5), 0,001963 unité par pixel (le verre est plus
   haut que large : ±0,79 en largeur, ±0,908 en hauteur). Boîtier : cadre sombre autour
   du verre ; à gauche la plaque usée, le bouton HDG (2), la plaque HDG/BRT, le bouton
   BRT (1) ; à droite le bouton CRS (3), la plaque CRS/TEST, le bouton TEST (4), le
   témoin BIT (5) (p. 73) ; vis. */
BEZELS.hsd = { k: .86, dy: -.103, dx: 0 };
function hsdBezel(c){
  f14Frame(c, 'hsd');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#3A3E48'; c.strokeStyle = '#555A66';
  c.beginPath(); c.roundRect(-1.163, -.957, 2.326, 2.12, .03); c.fill(); c.stroke();
  c.fillStyle = '#23262D'; c.strokeStyle = '#4A4F5A';
  c.beginPath(); c.roundRect(-.869, -.957, 1.738, 1.914, .05); c.fill(); c.stroke();
  for (const [x, y] of [[-1.035, .142], [1.006, .27], [-.967, 1.085], [.937, 1.085]]) f14Screw(c, x, y, .04);
  /* boutons HDG, BRT, CRS : molettes crantées ; plaques */
  const knurl = (x, y, r) => {
    c.fillStyle = '#5E5A52'; c.strokeStyle = '#2A2B2F'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#8D9196'; c.beginPath(); c.arc(x, y, r * .72, 0, 7); c.fill(); c.stroke();
  };
  knurl(-1.065, -.613, .069); knurl(-1.049, -.133, .079); knurl(1.045, -.613, .069);
  for (const [x, w, h, t1, t2] of [[-1.011, .167, .177, 'HDG', 'BRT'], [1.011, .206, .157, 'CRS', 'TEST']]){
    c.fillStyle = '#25272C'; c.strokeStyle = '#6A6E78'; roundBox(c, x, -.352, w, h, .015);
    bezelText(c, t1, x + .005, -.37, .042, '#C9CCD2'); bezelText(c, t2, x + .005, -.297, .042, '#C9CCD2');
    c.save(); c.strokeStyle = '#C9CCD2'; c.beginPath();
    c.moveTo(x - w * .38, -.392); c.lineTo(x - w * .3, -.333); c.lineTo(x + w * .3, -.333); c.lineTo(x + w * .38, -.392);
    c.moveTo(x - w * .38, -.275); c.lineTo(x - w * .3, -.333); c.moveTo(x + w * .3, -.333); c.lineTo(x + w * .38, -.275);
    c.stroke(); c.restore();
  }
  c.fillStyle = '#C8CFB0'; c.strokeStyle = '#6A6E78'; c.beginPath(); c.arc(1.016, -.123, .049, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#0E0F11'; c.beginPath(); c.arc(1.006, .078, .049, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#5C6068';
  for (const a of [-90, 30, 150]){
    const r = a * Math.PI / 180;
    c.beginPath(); c.moveTo(1.006, .078); c.arc(1.006, .078, .036, r - .45, r + .45); c.closePath(); c.fill();
  }
  c.fillStyle = '#050605';
  c.beginPath(); c.roundRect(-GLASS, -.908, 2 * GLASS, 1.816, .137); c.fill();
  c.restore();
}

/* page NAV, figure p. 72 : la rose des caps, centre (604, 504), un trait tous les 5°,
   long aux dizaines (rayons 250-287 px, 261 px pour les courts) ; les chiffres aux 30°
   tournés avec la rose ; N et S dans un losange, E et W ; la barre de route et sa
   flèche sur la route choisie (CRS 000), les quatre repères d'écart, le symbole de
   l'avion au centre ; la croix au-dessus du N et le chevron devant le E, tels que la
   figure les montre ; RNG et CRS en haut (p. 73, 264). */
function f14Hsd(c, o){
  const lw = c.lineWidth, ink = c.strokeStyle;
  c.save();
  hsdBezel(c);
  c.strokeStyle = c.fillStyle = ink;
  c.lineWidth = lw * .45;
  const cx = .003, cy = .032, f = .001963;
  const at = (d, r) => { const a = d * Math.PI / 180; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; };
  c.beginPath();
  for (let d = 0; d < 360; d += 5){
    if (d % 90 === 0) continue;
    const ro = 287 * f, ri = (d % 10 ? 261 : 250) * f;
    if (d % 30){ c.moveTo(...at(d, ri)); c.lineTo(...at(d, ro)); }
    else { c.moveTo(...at(d, 250 * f)); c.lineTo(...at(d, 255 * f)); c.moveTo(...at(d, 281 * f)); c.lineTo(...at(d, ro)); }
  }
  c.stroke();
  if (o.mini){ c.restore(); return; }
  const label = (t, d, r, cap = .038) => {
    const [x, y] = at(d, r);
    c.save(); c.translate(x, y); c.rotate(d * Math.PI / 180); f14Text(c, t, 0, 0, 'center', cap, .025); c.restore();
  };
  for (const d of [30, 60, 120, 150, 210, 240, 300, 330]) label(String(d / 10), d, 268 * f);
  label('E', 90, 268 * f); label('W', 270, 268 * f);
  /* N et S dans leur losange */
  for (const [d, t] of [[0, 'N'], [180, 'S']]){
    const [x, y] = at(d, 268 * f), h = 23 * f;
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + h, y); c.lineTo(x, y + h); c.lineTo(x - h, y); c.closePath(); c.stroke();
    f14Text(c, t, x, y, 'center', .03, .02);
  }
  const P = (x, y) => [(x - 602.5) * f, (y - 487.5) * f];
  c.beginPath();
  /* croix au-dessus du N */
  c.moveTo(...P(588, 180)); c.lineTo(...P(622, 214)); c.moveTo(...P(622, 180)); c.lineTo(...P(588, 214));
  /* barre de route et sa flèche */
  c.moveTo(...P(604, 262)); c.lineTo(...P(604, 381)); c.moveTo(...P(595, 281)); c.lineTo(...P(604, 262)); c.lineTo(...P(613, 281));
  c.moveTo(...P(604, 632)); c.lineTo(...P(604, 749));
  /* repères d'écart */
  for (const x of [460, 533, 677, 750]){ c.moveTo(...P(x, 478)); c.lineTo(...P(x, 531)); c.moveTo(...P(x - 11, 505)); c.lineTo(...P(x + 11, 505)); }
  /* l'avion */
  c.moveTo(...P(572, 500)); c.lineTo(...P(636, 500)); c.moveTo(...P(604, 465)); c.lineTo(...P(604, 543)); c.moveTo(...P(597, 541)); c.lineTo(...P(611, 541));
  /* chevron devant le E */
  c.moveTo(...P(803, 485)); c.lineTo(...P(830, 485)); c.lineTo(...P(853, 506)); c.lineTo(...P(830, 527)); c.lineTo(...P(803, 527));
  c.stroke();
  f14Text(c, 'RNG', ...P(318, 160), 'center', .045, .033);
  f14Text(c, '.', ...P(335, 198), 'center', .045, .033);
  f14Text(c, 'CRS', ...P(891, 160), 'center', .045, .033);
  f14Text(c, '000', ...P(891, 190), 'center', .049, .033);
  c.restore();
}

/* ---------------- VDI du pilote ----------------
   Source : les fichiers du jeu, Mods/aircraft/F14/Cockpit/ (lecture seule), et deux images
   du jeu pour les recaler.
   - Scripts/VerticalDisplayIndicator/Indicator/init.lua l. 50-60 : la page principale (2) =
     BASE + INDICATION + VDI_FOV + OVERLAY + OVERLAY_MASK ;
   - indication_page.lua (repère en milliradians, SetScale(MILLYRADIANS) l. 3) : horizon,
     échelle de tangage, index de roulis, bande de cap ;
   - vdi_fov.lua et overlay_mask.lua (repère FOV : demi-largeur de l'indicateur = 1) : le
     symbole avion et ses repères, les graduations de roulis du bas ;
   - Resources/IndicationTextures/VDI_Elements.tga (2048 × 2048) : chaque symbole est une
     découpe de cette texture (coordonnées citées en pixels de texture) ; CRT_Mask.dds :
     la forme de l'image (overlay.lua l. 45-53) ;
   - materials.lua l. 22-36 : couleurs (symboles VDI_WHITE, ciel LIGHT_GREEN, sol
     DARK_GREEN, trapèzes VDI_VDARKGREEN, graduations de roulis VDI_ROLL_IDX presque noir).
   Conversion des repères :
   - texture → repère des pages : create_textured_box d'indication_page.lua l. 74-107
     (échelle 625, texture 2048) : 1 px de texture = 625 / 2048 = 0,3052 mrad ; les
     chiffres (l. 117-182) ×1,5 sur l'échelle de tangage, ×1 sur la bande de cap ; les
     découpes de vdi_fov.lua et overlay_mask.lua passent par common_defs.lua l. 44-90 :
     largeur de la découpe ramenée à 2 unités FOV (échelle 2048/826 ou 2048/796) ;
   - milliradians → FOV : aucun Lua ne le donne (il dépend de la géométrie 3D du poste) :
     mesuré sur la figure du manuel Heatblur p. 69 (image 863 × 540, de face) : les
     graduations de cap (20,94 mrad pour 10°, l. 566 et 615) y font 39,43 px, le symbole
     avion (FOV) 222 px par unité ⇒ 1 unité FOV = 118 mrad ; même rapport sur l'image de
     Chuck's Guide p. 52 à 3 % près (vue plongeante) ;
   - FOV → tableau : l'image utile (CRT_Mask.dds, posé sur ±1,006 × ±1,006·aspect, lu
     transposé comme le fait le Lua) s'arrête à ±0,947 en largeur : ce bord est le verre,
     ±0,79. 1 unité FOV = 0,8342 ; 1 mrad = 0,00707. L'aspect (GetAspect, l. 119 d'init.lua)
     vient du modèle 3D : mesuré ≈ 1 sur les deux images (graduation de roulis du centre). */
const VDI_U = GLASS / .947, VDI_M = VDI_U / 118;
/* le boîtier, figure p. 69 du manuel Heatblur : 1 px = 0,003758, verre (symbole avion) en
   (432,5 ; 232). Commandes p. 69-70 : HUD BRT (1), VDI BRT (2), VDI CONT (3), poignée
   FILTER (4), HUD TRIM (5), VDI TRIM (6), voyants du VDI (7, p. 70-71). Les voyants
   L FIRE / R FIRE au-dessus (p. 69, 13) sont un autre panneau : pas dessinés. */
BEZELS.vdi = { k: .65, dy: -.134, dx: -.012 };
const vdiP = (x, y) => [(x - 432.5) * .003758, (y - 232) * .003758];
const vdiBox = (c, x0, y0, x1, y1, r) => { const [a, b] = vdiP(x0, y0), [d, e] = vdiP(x1, y1); c.beginPath(); c.roundRect(a, b, d - a, e - b, r); };
/* la forme de l'image, CRT_Mask.dds (un quart, symétrique) */
const VDI_PIC = [[.788, 0], [.787, -.139], [.783, -.285], [.777, -.448], [.769, -.559], [.763, -.64], [.758, -.707], [.749, -.749],
                 [.72, -.772], [.657, -.783], [.574, -.79], [.461, -.799], [.294, -.809], [.144, -.814], [0, -.818]];
function vdiPicture(c){
  c.beginPath();
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]){
    const q = sx * sy > 0 ? VDI_PIC : [...VDI_PIC].reverse();
    for (const [x, y] of q) c.lineTo(sx * x, sy * y);
  }
  c.closePath();
}
function vdiBezel(c){
  f14Frame(c, 'vdi');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  /* panneau, cadre du VDI, anneau noir, liseré, ouverture */
  c.fillStyle = '#41464F'; c.strokeStyle = '#5A606A'; vdiBox(c, 30, -6, 842, 536, .03); c.fill(); c.stroke();
  c.fillStyle = '#4C515C'; vdiBox(c, 182, -6, 688, 528, .06); c.fill(); c.stroke();
  c.fillStyle = '#16171A'; c.strokeStyle = '#2A2C31'; vdiBox(c, 196, 0, 670, 474, .17); c.fill(); c.stroke();
  c.strokeStyle = '#5B5F66'; vdiBox(c, 204, 7, 662, 466, .14); c.stroke();
  c.fillStyle = '#070807'; vdiBox(c, 211, 13, 655, 457, .12); c.fill();
  /* voyants de gauche (7) : onze cases, éteintes, inscriptions orangées */
  c.fillStyle = '#1D1F24'; c.strokeStyle = '#4E525A'; vdiBox(c, 35, 58, 172, 300, .02); c.fill(); c.stroke();
  const leg = ['ADJ A/C', 'LANDING CHK', 'ACL READY', 'A/P CPLR', 'CMD CONTROL', '10 SECONDS', 'TILT', 'VOICE', '', 'AUTO THRO', 'A/P REF'];
  leg.forEach((t, i) => {
    const y = 80 + i * 20.6;
    c.fillStyle = '#2A2C31'; c.strokeStyle = '#121316'; vdiBox(c, 47, y - 8.5, 160, y + 8.5, .008); c.fill(); c.stroke();
    if (t) bezelText(c, t, ...vdiP(103.5, y), .036, '#B0603F');
  });
  /* voyants de droite (7) : WAVE OFF, WING SWEEP, REDUCE SPD et la case sans nom allumés
     en rouge sur la figure, ALT LOW éteint */
  c.fillStyle = '#1D1F24'; c.strokeStyle = '#4E525A'; vdiBox(c, 700, 55, 838, 190, .02); c.fill(); c.stroke();
  [['WAVE OFF', 1], ['WING SWEEP', 1], ['REDUCE SPD', 1], ['', 1], ['ALT LOW', 0]].forEach(([t, on], i) => {
    const y = 76 + i * 20.5;
    c.fillStyle = on ? '#B3302F' : '#3A2C33'; c.strokeStyle = '#121316'; vdiBox(c, 712, y - 8.5, 826, y + 8.5, .02); c.fill(); c.stroke();
    if (t) bezelText(c, t, ...vdiP(769, y), .036, on ? '#5A1414' : '#6E4E58');
  });
  for (const [x, y] of [[76, 305], [136, 305], [705, 186], [818, 186]]) f14Screw(c, ...vdiP(x, y), .022);
  /* plaques des boutons, coins arrondis côté écran */
  c.fillStyle = '#3B3F47'; c.strokeStyle = '#5A606A';
  { const [a, b] = vdiP(48, 316), [d, e] = vdiP(180, 534); c.beginPath(); c.roundRect(a, b, d - a, e - b, [0, .12, 0, 0]); c.fill(); c.stroke(); }
  { const [a, b] = vdiP(688, 316), [d, e] = vdiP(818, 530); c.beginPath(); c.roundRect(a, b, d - a, e - b, [.12, 0, 0, 0]); c.fill(); c.stroke(); }
  /* boutons : chapeau blanc (VDI TRIM rouge) devant sa jupe moletée */
  const knob = (x, y, cap) => {
    const [kx, ky] = vdiP(x, y), r = 21 * .003758;
    c.fillStyle = '#6E6A58'; c.strokeStyle = '#3A3830';
    c.beginPath(); c.arc(kx + .02, ky - .018, r * 1.02, 0, 7); c.fill(); c.stroke();
    c.fillStyle = cap; c.strokeStyle = '#8A8C90';
    c.beginPath(); c.arc(kx, ky, r * .92, 0, 7); c.fill(); c.stroke();
  };
  knob(77, 358, '#D8D9DD'); knob(82, 452, '#D8D9DD'); knob(160, 507, '#D8D9DD'); knob(793, 357, '#D8D9DD'); knob(780, 456, '#9A4A3E');
  const lbl = (t, x, y) => bezelText(c, t, ...vdiP(x, y), .046, '#D6D7D9');
  lbl('HUD', 131, 345); lbl('BRT', 131, 360); lbl('VDI', 131, 430); lbl('BRT', 131, 455); lbl('VDI CONT', 228, 506);
  lbl('HUD', 732, 335); lbl('TRIM', 732, 359); lbl('VDI', 732, 428); lbl('TRIM', 732, 453);
  for (const [x, y, r] of [[87, 397, .024], [783, 397, .024], [822, 438, .024], [330, 511, .03], [550, 511, .03]]) f14Screw(c, ...vdiP(x, y), r);
  /* poignée FILTER (4) : levier clair, lettres FILT…R de la figure */
  c.fillStyle = '#8F8A7E'; c.strokeStyle = '#5A574F';
  c.beginPath(); c.moveTo(...vdiP(772, 232)); c.lineTo(...vdiP(796, 216)); c.lineTo(...vdiP(806, 226)); c.lineTo(...vdiP(800, 318));
  c.lineTo(...vdiP(786, 318)); c.lineTo(...vdiP(784, 252)); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#B9B5AA'; vdiBox(c, 806, 220, 822, 322, .01); c.fill(); c.stroke();
  for (const [t, y] of [['F', 233], ['I', 250], ['L', 268], ['T', 285], ['R', 312]]) bezelText(c, t, ...vdiP(814, y), .036, '#2A2B2F');
  /* verrou du bas : plaque, deux vis, charnière */
  c.fillStyle = '#7A735F'; c.strokeStyle = '#4A4639'; vdiBox(c, 345, 478, 520, 513, .02); c.fill(); c.stroke();
  c.fillStyle = '#5E5949'; vdiBox(c, 395, 474, 475, 500, .005); c.fill(); c.stroke();
  for (const x of [368, 497]) f14Screw(c, ...vdiP(x, 491), .018);
  c.restore();
}

/* chiffres du VDI : découpe (79, 973) de la texture, cellules de 23 × 34 px au pas de 39,
   « 0 » à « 9 » puis « + » et « - » (indication_page.lua l. 123-127) ; tracés en segments
   relevés sur la texture, trait de 4,5 px */
const VDI_GLYPH = {
  '0': [[[3, 1.8], [18, 1.8], [18, 31.8], [3, 31.8], [3, 1.8]]],
  '1': [[[10.5, .5], [10.5, 33.2]]],
  '2': [[[3, 1.8], [18, 1.8], [18, 13.8], [3, 13.8], [3, 31.8], [18, 31.8]]],
  '3': [[[3, 1.8], [18, 1.8], [18, 31.8], [3, 31.8]], [[3, 13.8], [18, 13.8]]],
  '4': [[[1.5, .5], [1.5, 13.8], [17, 13.8]], [[16, .5], [16, 33.2]]],
  '5': [[[19, 1.8], [4, 1.8], [4, 13.8], [19, 13.8], [19, 31.8], [4, 31.8]]],
  '6': [[[17, 1.8], [2, 1.8], [2, 31.8], [17, 31.8], [17, 13.8], [2, 13.8]]],
  '7': [[[4, 1.8], [19, 1.8], [19, 33.2]]],
  '8': [[[4, 1.8], [19, 1.8], [19, 31.8], [4, 31.8], [4, 1.8]], [[4, 13.8], [19, 13.8]]],
  '9': [[[18, 13.8], [3, 13.8], [3, 1.8], [18, 1.8], [18, 33.2]]],
  '+': [[[3, 18.5], [21, 18.5]], [[12, 8], [12, 27]]],
  '-': [[[5, 19], [19, 19]]],
};
/* un nombre centré en (x, y) mrad (create_custom_number_element : signe en tête, pas de
   8 mrad × échelle, l. 129-177) ; `fs` l'échelle des chiffres */
function vdiNumber(c, s, x, y, fs){
  const px = .3052 * fs * VDI_M, step = 8 * fs * VDI_M, x0 = x * VDI_M - (s.length - 1) * step / 2;
  c.save();
  c.lineWidth = 4.5 * px; c.lineCap = 'butt'; c.lineJoin = 'miter';
  [...s].forEach((ch, i) => {
    const gx = x0 + i * step, gy = y * VDI_M;
    c.beginPath();
    for (const line of VDI_GLYPH[ch]) line.forEach(([u, v], j) => c[j ? 'lineTo' : 'moveTo'](gx + (u - 11.5) * px, gy + (v - 17) * px));
    c.stroke();
  });
  c.restore();
}

/* l'image de la page principale, valeurs d'exemple de la capture du jeu de Chuck's Guide
   p. 52 (image 1920 × 1080, verre centré en (927,5 ; 568,5), 1,72 px/mrad en largeur,
   1,68 en hauteur) : inclinaison 7,5°, horizon 6 mrad au-dessus du symbole avion, cap 008
   (le 0 de la bande à 16 mrad à gauche), cap commandé 336. L'échelle de tangage est celle
   des modes A/A et A/G (une ligne tous les 30°, l. 478-527 ; « 130° de tangage affichés »,
   commentaire l. 648-651), celle de la capture : les modes décollage, croisière et appontage
   (l. 387-476) ont en plus des traits courts tous les 10°, absents de l'image. */
const VDI_EX = { roll: 7.5, horizon: -6, hdg: 7.6, cmd: 336 };
function f14Vdi(c, o){
  const lw = c.lineWidth, ink = c.strokeStyle, M = VDI_M, U = VDI_U;
  c.save();
  vdiBezel(c);
  c.save();
  vdiPicture(c); c.clip();
  c.fillStyle = '#050605'; c.fill();
  /* horizon artificiel (l. 310-328) : ciel LIGHT_GREEN au-dessus, sol DARK_GREEN dessous,
     séparés d'un vide de 2 × 2,51 mrad (horizon_gap, l. 325) ; tourne avec l'inclinaison
     (artificial_roll, l. 330-336). Teintes relevées sur la capture (le grain du tube les éclaircit) : ciel à 70 % de
     la symbologie, sol à 28 % */
  c.save();
  c.rotate(VDI_EX.roll * Math.PI / 180);
  c.translate(0, VDI_EX.horizon * M);
  const gap = 2.51 * M;
  c.save(); c.fillStyle = ink;
  c.globalAlpha = .7; c.fillRect(-2, -3, 4, 3 - gap);
  c.globalAlpha = .28; c.fillRect(-2, gap, 4, 3);
  c.restore();
  /* trapèzes du sol (découpe 414, 94, 322 × 176, l. 347-374) : leur place et leur taille
     suivent le vol (contrôleur ground1) ; ceux de la capture, [x, y, largeur] en mrad dans
     le repère de l'écran (le 4e, coupé par le bord, n'en montre qu'un coin) */
  c.restore();
  c.save();
  c.fillStyle = '#020A03'; c.globalAlpha = .55;
  for (const [x, y, w] of [[-84.6, 6, 19.1], [78.8, 29.2, 19.1], [-33.2, 69, 33.8], [-100.1, 112.9, 55]]){
    const h = w * 176 / 322;
    c.save(); c.translate(x * M, y * M); c.rotate(VDI_EX.roll * Math.PI / 180); c.scale(w * M, w * M);
    c.beginPath(); c.moveTo(-.285, -h / w / 2); c.lineTo(.285, -h / w / 2); c.lineTo(.495, h / w / 2); c.lineTo(-.495, h / w / 2); c.closePath(); c.fill();
    c.restore();
  }
  c.restore();
  /* graduations de roulis, fixes (overlay_mask.lua l. 14-21, découpe 302, 1096, 796 × 226,
     coin bas gauche de l'indicateur) : traits presque noirs (VDI_ROLL_IDX) */
  c.save();
  c.strokeStyle = '#050000'; c.globalAlpha = .9; c.lineWidth = .0247; c.lineCap = 'round';
  c.beginPath();
  for (const [a, b, d, e] of [[-.653, .376, -.817, .469], [.654, .376, .818, .469], [-.658, .654, -.784, .779], [.659, .655, .785, .778],
                              [0, .664, 0, .843], [-.407, .704, -.481, .843], [.407, .704, .482, .843], [-.269, .738, -.303, .844],
                              [.269, .737, .303, .844], [-.13, .738, -.146, .844], [.13, .738, .147, .844]]){ c.moveTo(a, b); c.lineTo(d, e); }
  c.stroke(); c.restore();
  c.strokeStyle = c.fillStyle = ink;
  /* symbole avion et repères vitesse / altitude (vdi_fov.lua l. 162-168, découpe 527, 418,
     826 × 39, centre 938, 428) : point, ailes à crochet, barres des bords ; trait 12,5 px */
  const reticle = () => {
    c.save(); c.lineWidth = .0252; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(-.814, .002); c.lineTo(-.61, .002); c.moveTo(.616, .002); c.lineTo(.82, .002);
    c.moveTo(-.315, .002); c.lineTo(-.129, .002); c.lineTo(-.129, .042);
    c.moveTo(.315, .002); c.lineTo(.127, .002); c.lineTo(.127, .042);
    c.stroke();
    c.beginPath(); c.arc(-.001, .001, .0182, 0, 7); c.fill();
    c.restore();
  };
  if (o.mini){ reticle(); c.restore(); c.restore(); return; }
  /* échelle de tangage A/A (l. 478-527) : tous les 30° (52,36 mrad), deux demi-traits à
     ±30 mrad ; au-dessus pleins (découpe 109, 739, plein de -16,8 à +16,8 mrad), dessous
     deux tirets (découpe 217, 894) ; les nombres signés au milieu, chiffres ×1,5 */
  c.save();
  c.rotate(VDI_EX.roll * Math.PI / 180);
  c.translate(0, VDI_EX.horizon * M);
  c.lineCap = 'butt';
  for (let n = -3; n <= 3; n++){
    if (!n) continue;
    const y = -n * 52.36 * M;
    c.save(); c.lineWidth = 1.83 * M; c.beginPath();
    for (const x0 of [-30, 30]){
      const segs = n > 0 ? [[-16.8, 16.8]] : [[-16.9, -1.7], [1.4, 16.6]];
      for (const [a, b] of segs){ c.moveTo((x0 + a) * M, y); c.lineTo((x0 + b) * M, y); }
    }
    c.stroke(); c.restore();
    vdiNumber(c, (n > 0 ? '+' : '-') + 3 * Math.abs(n), 0, -n * 52.36, 1.5);
  }
  /* index de roulis (l. 537-546, découpe 1183, 1190) : barre de 5,5 mrad, de 86,6 à
     154,6 mrad sous le centre, tourne avec l'inclinaison */
  c.translate(0, -VDI_EX.horizon * M);
  c.fillRect(-2.6 * M, 86.6 * M, 5.5 * M, 68 * M);
  c.restore();
  reticle();
  /* bande de cap (l. 566-645) : fenêtre de ±75,4 mrad sur 48-108 mrad (clip_box l. 568),
     2,094 mrad par degré (compass_scale 0,12) ; graduation des dizaines (découpe 1197, 362,
     8 × 38 : 11,6 mrad) et des 5° (découpe 1225, 363 : sa moitié haute) à 101 mrad ; les
     dizaines sous elles à 86 mrad ; ▽ fixe à 103 mrad (découpe 632, 322), ▲ du cap
     commandé à 75 mrad (découpe 679, 321) */
  c.save();
  c.beginPath(); c.rect(-75.4 * M, -108 * M, 150.8 * M, 60 * M); c.clip();
  const d2m = 2 * 87.27 * .12 / 10, hx = h => (((h - VDI_EX.hdg) % 360 + 540) % 360 - 180) * d2m;
  c.beginPath();
  for (let h = 0; h < 360; h += 5){
    const x = hx(h) * M;
    if (Math.abs(x) > 90 * M) continue;
    const w = 1.83 * M;
    if (h % 10) c.rect(x - w / 2, -106.8 * M, w, 5.8 * M);
    else c.rect(x - w / 2, -106.2 * M, w, 10.7 * M);
  }
  c.fill();
  for (let h = 0; h < 360; h += 10) if (Math.abs(hx(h)) < 90) vdiNumber(c, String(h / 10), hx(h), -86, 1);
  c.restore();
  const tri = (x0, y0, pts, hole) => {
    c.beginPath();
    pts.forEach(([u, v], j) => c[j ? 'lineTo' : 'moveTo']((x0 + (u - 21) * .3052) * M, (y0 + (v - 14.5) * .3052) * M));
    c.closePath();
    if (hole) hole.forEach(([u, v], j) => c[j ? 'lineTo' : 'moveTo']((x0 + (u - 21) * .3052) * M, (y0 + (v - 14.5) * .3052) * M));
    c.fill('evenodd');
  };
  tri(0, -103, [[1, 1], [41, 1], [21, 28]], [[13, 7], [28.5, 7], [20.7, 18]]);
  tri(hx(VDI_EX.cmd), -75, [[21, 1], [42, 27], [1, 27]]);
  c.restore();
  c.restore();
}

const f14Page = (label, draw, scope, more = {}) => ({ g:'f14', label, under:true, upright:true, box:1, s0:5.5, smax:14, tile:.62,
  ldy:1.12, col:'#50C850', draw, scope, ...more });

Object.assign(SHAPES, {
  f14_tid: f14Page('Écran TID (TWS)', f14Tid, { bez:'tid', page:'tws' }),
  f14_ddd: f14Page('Écran DDD (pulse-Doppler)', f14Ddd, { bez:'ddd', page:'pd' }, { col:'#4FA678', s0:6.5 }),
  f14_hsd: f14Page('Écran HSD (NAV)', f14Hsd, { bez:'hsd', page:'nav' }, { g:'f14p' }),
  f14_vdi: f14Page('Écran VDI', f14Vdi, { bez:'vdi', page:'aa' }, { g:'f14p' }),
});
GROUPS.push(['f14', 'Écrans du RIO', 'F-14B'], ['f14p', 'Écrans du pilote', 'F-14B']);
