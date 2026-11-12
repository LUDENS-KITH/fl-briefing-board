/* ---------------- A-10C II : les autres pages du MFCD ----------------
   DCS A-10C II Flight Manual (EN), installé avec le module : Maverick p. 410-419,
   état des équipements (STAT) p. 312-316, pod en air-air p. 401-408, profils du DSMS
   p. 326-330. Places mesurées sur l'image d'origine de chaque figure, dans le repère de
   mfcdBezel : les boutons du haut espacés de 0,25, leur rang à y = -0,95 (MFCD_OSB) ;
   l'échelle et le centre sont repris, figure par figure, sur ces cinq boutons.

   Les textes du MFCD : une capitale fait 0,038 de haut et un caractère 0,030 (mesuré
   sur la figure 260) ; a10Text étire scopeText d'autant. Sur la vidéo, chaque texte
   est posé sur un pavé noir, comme dans le jeu. */

const A10_STRETCH = 1.17, A10_SIZE = .057, A10_GREEN = '#22E04A';
function a10Text(c, t, x, y, al = 'center', size = A10_SIZE, bg = null){
  c.save(); c.translate(x, y); c.scale(A10_STRETCH, 1); scopeLabel(c, t, 0, 0, al, bg, size); c.restore();
}
/* pavé noir aux bords donnés, puis le texte centré dedans */
function a10Boxed(c, t, x0, y0, x1, y1, al = 'center', size = A10_SIZE){
  c.save(); c.fillStyle = HALO; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.restore();
  a10Text(c, t, al === 'left' ? x0 + .008 : al === 'right' ? x1 - .008 : (x0 + x1) / 2, (y0 + y1) / 2, al, size);
}
/* un pavé noir sans texte */
function a10Black(c, x0, y0, x1, y1){ c.save(); c.fillStyle = HALO; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.restore(); }
/* la vidéo du capteur remplit le verre ; aucune image n'est reprise : un gris uni */
function a10Video(c, col = '#5C6266'){
  c.save(); c.fillStyle = col; c.beginPath(); c.roundRect(-GLASS, -.80, 2 * GLASS, 1.6, .04); c.fill(); c.restore();
}

/* ---- page Maverick (p. 413-419 ; figure 260, p. 415, reprise en figure 261, p. 418) ----
   Vidéo du missile ; le réticule blanc couvre la vidéo, ouvert au centre (fig. 261,
   n° 1), trois repères de dépression sur la branche basse, 5°, 10° et 15° (n° 2), les
   coins du champ étroit (n° 3), la croix de pointage du missile (n° 5, p. 419). Cadre
   vert ; le nom du profil et la station active en haut à gauche (fig. 260, n° 6, 5) ;
   EO ON, ADJ OFF, SLEW 5.0 à droite (n° 1, 2, 7) ; la zone de tir (DLZ) dans sa
   colonne noire à gauche (n° 4, p. 416) : butées haute et basse, l'agrafe, le chevron
   de distance et sa valeur, le temps de vol (XXX hors de l'agrafe) ; le chronomètre EO
   en bas à droite (n° 3). Valeurs de la figure. */
function a10Mav(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfcdBezel(c);
  c.save();
  a10Video(c);
  c.save(); c.beginPath(); c.roundRect(-GLASS, -.80, 2 * GLASS, 1.6, .04); c.clip();
  c.lineWidth = lw * .5;
  c.strokeStyle = c.fillStyle = A10_WH;
  /* réticule, ouvert au centre (-0,017 ; 0,004) */
  const X = -.017, Y = .004;
  c.beginPath();
  c.moveTo(-GLASS, Y); c.lineTo(X - .04, Y); c.moveTo(X + .04, Y); c.lineTo(GLASS, Y);
  c.moveTo(X, -.80); c.lineTo(X, Y - .044); c.moveTo(X, Y + .04); c.lineTo(X, .80);
  c.stroke();
  /* repères de dépression */
  c.lineWidth = lw * .9;
  c.beginPath();
  for (const y of [.135, .267, .40]){ c.moveTo(X - .031, y); c.lineTo(X + .035, y); }
  c.stroke();
  c.lineWidth = lw * .5;
  /* coins du champ étroit */
  c.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]){
    const bx = -.015 + sx * .40, by = sy * .40;
    c.moveTo(bx - sx * .058, by); c.lineTo(bx, by); c.lineTo(bx, by - sy * .058);
  }
  c.stroke();
  /* croix de pointage */
  c.lineWidth = lw * .7;
  c.beginPath(); c.moveTo(.109, .033); c.lineTo(.109, .29); c.moveTo(-.025, .161); c.lineTo(.245, .161); c.stroke();
  c.restore();
  if (o.mini){ c.restore(); return; }
  c.lineWidth = lw * .45;
  /* colonne noire de la DLZ, cadre vert */
  a10Black(c, -.79, -.474, -.623, .704);
  c.strokeStyle = c.fillStyle = ink;
  c.beginPath();
  c.moveTo(-.542, -.715); c.lineTo(.698, -.715); c.lineTo(.698, .717); c.lineTo(-.732, .717);
  c.moveTo(-.734, -.70); c.lineTo(-.734, -.474);
  c.stroke();
  /* DLZ : butée haute, agrafe, butée basse, chevron et distance, temps de vol */
  c.beginPath();
  c.moveTo(-.755, -.413); c.lineTo(-.684, -.413);
  c.moveTo(-.755, -.036); c.lineTo(-.684, -.036); c.lineTo(-.684, .344); c.lineTo(-.755, .344);
  c.moveTo(-.755, .422); c.lineTo(-.684, .422);
  c.stroke();
  c.beginPath(); c.moveTo(-.673, -.36); c.lineTo(-.633, -.385); c.lineTo(-.633, -.338); c.closePath(); c.fill();
  for (const [t, x0, y0, x1, y1, al, size] of sc.boxes) a10Boxed(c, t, x0, y0, x1, y1, al, size);
  a10Text(c, 'XXX', -.718, .457);
  /* chronomètre EO : un double cadre */
  a10Black(c, .298, .615, .674, .685);
  c.strokeRect(.298, .615, .376, .07); c.strokeRect(.307, .624, .358, .052);
  a10Text(c, 'EO 00:07:00', .486, .65);
  a10Text(c, '4', -.732, .755, 'left', .04);               // le petit « 4 » après « 06 » (figure)
  a10Text(c, '#MAV', -.264, .742, 'center', A10_SIZE, HALO);
  a10Ars(c, -.707, .632);
  c.restore();
}

/* ---- page STAT, page 2 (p. 312-316 ; figure 210, p. 315) ----
   Le tableau des équipements (LRU, STAT, TEST) : vert en service, rouge en panne,
   blanc sans objet (p. 314), le texte en noir ; les sous-ensembles de HOTAS en
   retrait ; la flèche désigne la ligne choisie, THRTL, dont le nom passe entre les
   flèches OSB 20 et 19 et qui ouvre SLEW (OSB 8, p. 316). → PREV revient à la page 1
   (OSB 1), WS CHK (OSB 5). Le journal des pannes (MFL) en bas. Valeurs de la figure. */
const A10_STAT = [
  // [LRU, retrait, STAT, TEST, couleur]
  ['TGP', 0, 'OFF', 'UN', 'w'], ['LTMFCD', 0, 'VALID', 'UN', 'g'], ['RTMFCD', 0, 'VALID', 'UN', 'g'],
  ['HOTAS', 0, 'VALID', 'UN', 'g'], ['STICK', 1, 'VALID', '-', 'g'], ['THRTL', 1, 'VALID', '-', 'g'],
  ['AHCP', 1, 'VALID', '-', 'g'], ['EGI', 0, 'OFF', '-', 'w'], ['IFFCC', 0, 'OFF', '-', 'w'],
  ['CDU', 0, 'NC', '-', 'r'], ['EPLRS', 0, 'NC', '-', 'r'],
];
const A10_ROW = { w: '#F2F4F2', g: '#2CEB45', r: '#F02424' };
function a10Stat(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfcdBezel(c);
  c.save();
  c.lineWidth = lw * .45;
  /* tableau : colonnes à -0,418, -0,139, 0,137, 0,416 ; lignes de 0,0555 depuis -0,509 */
  const X = [-.418, -.139, .137, .416], Y0 = -.509, H = .0555;
  A10_STAT.forEach(([, , , , k], i) => { c.fillStyle = A10_ROW[k]; c.fillRect(X[0], Y0 + i * H, X[3] - X[0], H); });
  c.strokeStyle = '#4C5BE6';
  c.beginPath();
  for (let i = 0; i <= A10_STAT.length; i++){ c.moveTo(X[0], Y0 + i * H); c.lineTo(X[3], Y0 + i * H); }
  for (const x of X.slice(1, 3)){ c.moveTo(x, Y0); c.lineTo(x, Y0 + A10_STAT.length * H); }
  c.stroke();
  if (o.mini){ c.restore(); return; }
  c.fillStyle = HALO;
  A10_STAT.forEach(([lru, ind, st, te], i) => {
    const y = Y0 + (i + .5) * H;
    a10Text(c, lru, ind ? -.375 : -.401, y, 'left');
    a10Text(c, st, -.003, y); a10Text(c, te, .276, y);
  });
  c.strokeStyle = c.fillStyle = ink;
  for (const [t, x, y, al, size] of sc.texts) a10Text(c, t, x, y, al || 'center', size);
  /* flèches OSB 20 et 19, pleines ; puce de WS ; MAINT FAULT LOG DISPLAY souligné */
  c.beginPath(); c.moveTo(-.706, -.549); c.lineTo(-.654, -.48); c.lineTo(-.759, -.48); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-.706, -.244); c.lineTo(-.654, -.314); c.lineTo(-.759, -.314); c.closePath(); c.fill();
  c.beginPath(); c.arc(.407, -.733, .012, 0, 7); c.stroke(); c.beginPath(); c.arc(.407, -.733, .005, 0, 7); c.fill();
  c.beginPath(); c.moveTo(-.406, .457); c.lineTo(.302, .457); c.stroke();
  a10Text(c, '#STAT', .228, .747, 'center', A10_SIZE, HALO);
  a10Ars(c, -.706, .642);
  c.restore();
}

/* ---- pod en air-air (p. 402-404 ; figure 254, p. 404, A-A par défaut) ----
   Le pod en visée avant : la croix blanche allongée de la visée axiale, ouverte au
   centre, et ses quatre coins (p. 403) ; la vidéo du ciel, sombre sur la figure, ici en
   gris uni. CNTL (OSB 1), A-G, STBY, A-A en vidéo inverse, TST, WHOT en haut ; le mode
   laser CMBT ON (OSB 7) ; GAIN (OSB 18) et son niveau « 3G » entre les flèches OSB 20
   et 19 (p. 403, n° 2-4). Le petit carré blanc au-dessus de la croix est tel que sur
   la figure. Valeurs de la figure. */
function a10TgpAa(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfcdBezel(c);
  c.save();
  a10Video(c, '#242627');
  c.lineWidth = lw * .5;
  c.strokeStyle = c.fillStyle = A10_WH;
  const X = -.024, Y = .004;
  c.beginPath();
  for (const s of [-1, 1]){
    c.moveTo(X + s * .041, Y); c.lineTo(X + s * .345, Y);
    c.moveTo(X, Y + s * .041); c.lineTo(X, Y + s * .345);
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]){
    const bx = X + sx * .196, by = Y + sy * .196;
    c.moveTo(bx - sx * .07, by); c.lineTo(bx, by); c.lineTo(bx, by - sy * .07);
  }
  c.stroke();
  if (o.mini){ c.restore(); return; }
  c.fillRect(X - .008, -.64, .016, .016);
  c.lineWidth = lw * .45;
  c.strokeStyle = c.fillStyle = ink;
  for (const [t, x0, y0, x1, y1, al, size] of sc.boxes) a10Boxed(c, t, x0, y0, x1, y1, al, size);
  a10Text(c, '6', -.738, .756, 'left', .04);               // le petit « 6 » après « 05 » (figure)
  a10Text(c, '#A-A', .224, -.733, 'center', A10_SIZE, HALO);
  a10Text(c, '#TGP', -.51, .746, 'center', A10_SIZE, HALO);
  a10Black(c, .42, -.755, .452, -.711);
  c.beginPath(); c.arc(.435, -.733, .012, 0, 7); c.stroke(); c.beginPath(); c.arc(.435, -.733, .005, 0, 7); c.fill();
  /* flèches OSB 20 et 19, pleines */
  c.beginPath(); c.moveTo(-.707, -.545); c.lineTo(-.66, -.48); c.lineTo(-.754, -.48); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-.707, -.248); c.lineTo(-.66, -.314); c.lineTo(-.754, -.314); c.closePath(); c.fill();
  a10Black(c, -.794, .554, -.628, .715);
  a10Ars(c, -.712, .641);
  c.restore();
}

/* ---- DSMS, page principale des profils (p. 326-330 ; figure 217, p. 326) ----
   Le tableau des profils (nom, arme, état), quinze lignes, le profil sélectionné en
   vidéo inverse ; la flèche montre le profil actif ; la barre de défilement blanche à
   droite ; le nom choisi entre les flèches OSB 20 et 19, MOVE entre les flèches
   OSB 6 et 7 ; ACT PRO active le profil, PRO ON le garde dans la liste du HUD.
   Valeurs de la figure. */
const A10_PROF = [['WPNS OFF', '---------', 'ON'], ['M-151', 'M-151', 'ON'], ['MAVERICK', 'MAVERICK', 'ON', true], ['MK-84', 'MK-84', 'ON']];
function a10Prof(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  mfcdBezel(c);
  c.save();
  c.lineWidth = lw * .5;
  c.strokeStyle = c.fillStyle = ink;
  /* tableau : cadre -0,432 → 0,439 en x, -0,584 → 0,638 en y ; colonnes à -0,094 et
     0,264 ; 15 lignes de 0,0667 sous l'en-tête */
  const L = -.432, R = .439, T = -.584, Y0 = -.362, H = .0667, B = .638;
  A10_PROF.forEach(([, , , on], i) => { if (on) c.fillRect(L, Y0 + i * H, R - L, H); });
  c.beginPath();
  c.rect(L, T, R - L, B - T);
  for (let i = 0; i < 15; i++){ c.moveTo(L, Y0 + i * H); c.lineTo(R, Y0 + i * H); }
  for (const x of [-.094, .264]){ c.moveTo(x, Y0); c.lineTo(x, B); }
  c.stroke();
  /* barre de défilement, blanche : flèches creuses et la longue barre entre elles */
  c.strokeStyle = A10_WH;
  c.beginPath();
  c.moveTo(.492, -.362); c.lineTo(.518, -.304); c.lineTo(.466, -.304); c.closePath();
  c.moveTo(.492, .638); c.lineTo(.518, .586); c.lineTo(.466, .586); c.closePath();
  c.stroke();
  c.beginPath(); c.roundRect(.466, -.295, .047, .872, .012); c.stroke();
  if (o.mini){ c.restore(); return; }
  c.strokeStyle = c.fillStyle = ink;
  A10_PROF.forEach(([a, b, s, on], i) => {
    const y = Y0 + (i + .5) * H;
    c.save(); if (on) c.fillStyle = HALO;
    a10Text(c, a, -.386, y, 'left'); a10Text(c, b, -.036, y, 'left'); a10Text(c, s, .30, y, 'left');
    c.restore();
  });
  for (const [t, x, y, al, size] of sc.texts) a10Text(c, t, x, y, al || 'center', size);
  for (const x of [-.695, .702]){
    c.beginPath(); c.moveTo(x, -.549); c.lineTo(x + .047, -.484); c.lineTo(x - .047, -.484); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x, -.252); c.lineTo(x + .047, -.313); c.lineTo(x - .047, -.313); c.closePath(); c.fill();
  }
  for (const [x, y] of [[-.082, -.736], [-.72, .18]]){
    c.beginPath(); c.arc(x, y, .012, 0, 7); c.stroke(); c.beginPath(); c.arc(x, y, .005, 0, 7); c.fill();
  }
  a10Text(c, '#DSMS', -.24, .731, 'center', A10_SIZE, HALO);
  a10Ars(c, -.68, .628);
  c.restore();
}

/* page d'un MFCD : boîtier, contenu propre */
const a10Other = (label, draw, scope) => ({ g:'a10p', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:A10_GREEN, draw, scope: { bez:'mfcd', ...scope } });

Object.assign(SHAPES, {
  /* textes de la figure 260, chacun sur son pavé noir [texte, x0, y0, x1, y1] */
  a10_mav: a10Other('Écran Maverick', a10Mav,
    { page:'mav',
      boxes: [['MAVERICK', -.789, -.762, -.542, -.699], ['9', -.789, -.699, -.759, -.642],
              ['14.1', -.633, -.392, -.506, -.33, 'left'],
              ['EO\nON', .638, -.581, .698, -.452], ['↕', .698, -.555, .728, -.495],
              ['ADJ\nOFF', .578, -.356, .67, -.224], ['↕', .698, -.322, .728, -.262],
              ['SLEW', .565, -.12, .698, -.055], ['5.0', .607, -.055, .698, .012], ['[]', .698, -.085, .728, -.03],
              ['06', -.79, .713, -.742, .774, 'left'], ['TGP', -.549, .713, -.462, .774],
              ['CDU', -.06, .713, .031, .774], ['MSG', .181, .713, .272, .774], ['DCLT', .412, .713, .53, .774]] }),
  /* textes de la figure 210 [texte, x, y, alignement, taille] */
  a10_stat: a10Other('Écran STAT', a10Stat,
    { page:'stat',
      texts: [['→PREV', -.593, -.733, 'left'], ['WS', .437, -.733, 'left'], ['CHK', .47, -.666],
              ['THRTL', -.73, -.397], ['→', -.488, -.205],
              ['LRU', -.282, -.544], ['STAT', -.003, -.544], ['TEST', .276, -.544],
              ['SLEW', .594, -.083], ['4.0', .58, -.017], ['[]', .678, -.05, 'center', .045],
              ['MAINT FAULT LOG DISPLAY', -.406, .428, 'left'], ['MFL EMPTY', -.406, .492, 'left'],
              ['MFL', .603, .381], ['FLT-1', .647, .445, 'right'], ['↕', .678, .413],
              ['00', -.794, .747, 'left'], ['0', -.722, .757, 'left', .04],
              ['TGP', -.505, .747], ['MAV', -.263, .747], ['CDU', -.018, .747]] }),
  /* textes de la figure 254, chacun sur son pavé noir [texte, x0, y0, x1, y1] */
  a10_tgpaa: a10Other('Écran du pod (A-A)', a10TgpAa,
    { page:'tgpaa',
      boxes: [['0Z', -.776, -.765, -.681, -.701], ['→CNTL', -.605, -.765, -.446, -.701], ['A-G', -.322, -.765, -.21, -.701],
              ['STBY', -.09, -.765, .046, -.701], ['TST', .459, -.765, .566, -.701], ['WHOT', .616, -.765, .749, -.701],
              ['WIDE', -.802, -.695, -.664, -.631], ['0', .713, -.695, .749, -.631],
              ['3G', -.779, -.43, -.711, -.366], ['↕GAIN', -.772, -.085, -.603, -.021],
              ['CMBT', .562, -.346, .696, -.282], ['ON', .62, -.28, .696, -.216],
              ['05', -.794, .714, -.742, .778, 'left'], ['MAV', -.318, .714, -.222, .778], ['CDU', -.068, .714, .028, .778],
              ['MSG', .174, .714, .27, .778], ['DCLT', .403, .714, .527, .778]] }),
  /* textes de la figure 217 [texte, x, y, alignement, taille] */
  a10_prof: a10Other('Écran DSMS (profils)', a10Prof,
    { page:'prof',
      texts: [['→STAT', -.566, -.736, 'left'], ['VIEW', -.054, -.736, 'left'], ['PRO', .002, -.671],
              ['PROFILES', .002, -.531], ['MK-84', -.711, -.40], ['MOVE', .717, -.40], ['→', -.488, -.128],
              ['ACT', -.66, .14], ['PRO', -.66, .21], ['PRO', .623, .14], ['ON', .667, .21, 'right'], ['↕', .681, .175],
              ['11', -.759, .731, 'left'], ['5', -.70, .741, 'left', .04],
              ['TAD', -.482, .731], ['TGP', .002, .731], ['STAT', .242, .731]] }),
});
GROUPS.push(['a10p', 'Autres pages', 'A-10C II']);
