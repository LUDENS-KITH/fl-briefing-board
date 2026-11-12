/* FL Briefing Board — écrans de bord du F-14B (lot 28)
   Heatblur F-14 Tomcat, manuel du module (F-14 Manual.pdf) : TID p. 158 et p. 352-365,
   DDD p. 153-157 et p. 345-351, modes du radar p. 389-397, TWS et AIM-54 p. 484-485.
   Rien d'autre : ni guide tiers, ni capture. Les figures sont des vues du poste en jeu,
   prises de biais : chaque place est relevée sur l'image d'origine de la figure et ramenée
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

const f14Page = (label, draw, scope, more = {}) => ({ g:'f14', label, under:true, upright:true, box:1, s0:5.5, smax:14, tile:.62,
  ldy:1.12, col:'#50C850', draw, scope, ...more });

Object.assign(SHAPES, {
  f14_tid: f14Page('Écran TID (TWS)', f14Tid, { bez:'tid', page:'tws' }),
  f14_ddd: f14Page('Écran DDD (pulse-Doppler)', f14Ddd, { bez:'ddd', page:'pd' }, { col:'#4FA678', s0:6.5 }),
  f14_hsd: f14Page('Écran HSD (NAV)', f14Hsd, { bez:'hsd', page:'nav' }, { g:'f14p' }),
});
GROUPS.push(['f14', 'Écrans du RIO', 'F-14B'], ['f14p', 'Écrans du pilote', 'F-14B']);
