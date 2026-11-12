/* ---------------- F/A-18C : les autres pages (lot 27) ----------------
   DCS F/A-18C Early Access Guide (EN), installé avec le module. Chaque page est relevée
   sur l'image d'origine de sa figure, toutes montrées sur un DDI (aucune sur l'AMPCD) :
     SA      figure 98, p. 205 (texte p. 204-205)
     HSI     figure 42, p. 121 (boutons p. 117-120, symboles fig. 68 p. 144, TACAN fig. 62 p. 137)
     AZ/EL   figure 92, p. 180 (texte p. 180-181)
     SMS A/G figure 160, p. 303 (texte p. 303-304)
     ATFLIR  figures 106-107, p. 220-221 (une même image ; texte p. 220-222)
   Le repère est celui du DDI (symbols.js, ddiBezel) : verre à ±0,79. Chaque figure est
   calée sur les 20 boutons de son boîtier ; les places sont en unités du repère. Le
   texte affiché est celui de la figure, valeurs d'exemple comprises. Les pistes et les
   menaces (HAFU, symboles EW, cercles SAM, membres de la liaison) ne font pas partie de
   la page : elles se posent à part, comme sur l'écran RWS. Non dessinés faute de texte
   qui les nomme : sur le HSI, le petit rectangle incliné à l'intérieur de la rose
   (fig. 42 et 68) ; sur la SA, le second cercle pointé relié au symbole EW (fig. 98).
   Les fichiers ecrans/ sont chargés après symbols.js : tout reste dans cette fonction,
   pour ne rien ajouter aux noms globaux que SHAPES et GROUPS. */
(() => {
const YEL = '#D1A94A';                         // jaune des figures (champ du radar, AZ/EL)
const LBL = .062, DAT = .06;                  // tailles mesurées : libellés, données

/* listes [texte, x, y, alignement, taille] */
const texts = (c, list, size = DAT) => { for (const [t, x, y, al, sz] of list) scopeText(c, t, x, y, al || 'center', sz || size); };
const labels = (c, list, size = LBL) => { for (const [t, x, y, al] of list) scopeLabel(c, t, x, y, al || 'center', null, size); };

/* flèche verticale des boutons de point de navigation : de la queue à la pointe */
function arrow(c, x, y0, y1){
  const d = Math.sign(y1 - y0) * .022;
  c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1);
  c.moveTo(x - .012, y1 - d); c.lineTo(x, y1); c.lineTo(x + .012, y1 - d);
  c.stroke();
}
/* losange : le TDC est affecté à cet écran (p. 162, n° 2) */
function tdcDiamond(c, x, y){
  c.beginPath(); c.moveTo(x, y - .022); c.lineTo(x + .022, y); c.lineTo(x, y + .022); c.lineTo(x - .022, y); c.closePath(); c.stroke();
  c.beginPath(); c.arc(x, y, .006, 0, 7); c.fill();
}
/* l'appareil, au centre de la rose (fig. 42 et 98) : un trait vertical, les ailes au
   tiers haut, l'empennage court en bas */
function ownship(c, x, y){
  c.beginPath();
  c.moveTo(x, y - .06); c.lineTo(x, y + .06);
  c.moveTo(x - .058, y - .028); c.lineTo(x + .058, y - .028);
  c.moveTo(x - .02, y + .045); c.lineTo(x + .02, y + .045);
  c.stroke();
}
/* rose des caps : un point tous les 10°, un repère tous les 30° (lettre aux points
   cardinaux, dizaines de degrés sinon), cap en haut (p. 144, n° 1). Les repères sont sur
   le cercle des points (mesuré sur les fig. 42 et 98). */
const at = (x, y, r, b) => [x + Math.sin(b) * r, y - Math.cos(b) * r];
function rose(c, x, y, R, hdg, mini){
  for (let d = 0; d < 360; d += 10){
    const [px, py] = at(x, y, R, (d - hdg) * Math.PI / 180);
    if (d % 30 && !mini){ c.beginPath(); c.arc(px, py, .006, 0, 7); c.fill(); }
    else if (mini){ c.beginPath(); c.arc(px, py, .014, 0, 7); c.fill(); }
    else scopeText(c, { 0:'N', 90:'E', 180:'S', 270:'W' }[d] || String(d / 10), px, py, 'center', LBL);
  }
}

/* ---------- SA, page du haut (fig. 98, p. 205) ----------
   Rose centrée sur l'appareil, rayon 0,585 ; cap de la figure 331,5°. */
const SA = { x: -.017, y: -.002, R: .585 };
function fa18Sa(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  ddiBezel(c);
  c.save();
  c.lineWidth = lw * .35;
  ownship(c, SA.x, SA.y);
  rose(c, SA.x, SA.y, SA.R, sc.hdg, o.mini);
  /* contre-mesures, en bas à gauche : paillettes, leurres, GEN-X 1 et 2 ; la barre se
     vide avec le stock (p. 205) — pleines pour C et F, vides pour O1 et O2 sur la figure */
  sc.cm.forEach(([t, full], i) => {
    const y = .486 + i * .05;
    if (!o.mini) scopeText(c, t, -.556, y, 'right', .05);
    if (full) c.fillRect(-.545, y - .0155, .143, .031);
    else { c.save(); c.setLineDash([.008, .006]); c.strokeRect(-.545, y - .0155, .143, .031); c.restore(); }
  });
  if (o.mini){ c.restore(); return; }
  /* point air-air (bullseye) : un cercle, un trait dessus, un point sur son bord (p. 204) */
  c.beginPath(); c.arc(.061, .228, .029, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(.061, .199); c.lineTo(.061, .164); c.stroke();
  c.beginPath(); c.arc(.033, .226, .009, 0, 7); c.fill();
  tdcDiamond(c, .629, -.674);
  arrow(c, .696, -.131, -.27); arrow(c, .696, -.017, .089);
  texts(c, sc.data);
  labels(c, sc.pb.map(([t, x, y, al]) => [t.replace('{rng}', o.rng ?? sc.rng), x, y, al]));
  c.restore();
}

/* ---------- HSI (fig. 42, p. 121 ; symboles fig. 68, p. 144) ----------
   Cap de la figure 82°, rose de rayon 0,579 autour de l'appareil. */
const HSI = { x: -.010, y: -.008, R: .579 };
/* symbole TACAN : trois bras (fig. 42 ; « TACAN Location Symbol », fig. 62) */
function tacanSym(c, x, y){
  c.beginPath();
  for (let i = 0; i < 3; i++){
    const a = (-150 + i * 120) * Math.PI / 180, n = a + Math.PI / 2;
    const tx = x + Math.cos(a) * .034, ty = y + Math.sin(a) * .034;
    const ia = a - Math.PI / 3;
    c.lineTo(x + Math.cos(ia) * .013, y + Math.sin(ia) * .013);
    c.lineTo(tx - Math.cos(n) * .013, ty - Math.sin(n) * .013);
    c.lineTo(tx + Math.cos(n) * .013, ty + Math.sin(n) * .013);
  }
  c.closePath(); c.stroke();
}
function fa18Hsi(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, { x, y, R } = HSI;
  ddiBezel(c);
  c.save();
  c.lineWidth = lw * .35;
  ownship(c, x, y);
  rose(c, x, y, R, sc.hdg, o.mini);
  const rad = d => (d - sc.hdg) * Math.PI / 180;
  /* ligne de route (CSEL 330°) passant par le point de navigation, flèche au bout dans le
     sens de la route (p. 144-145, n° 4) ; le point, un petit cercle (fig. 42) */
  {
    const [x0, y0, x1, y1] = [.488, .092, -.312, .418], a = Math.atan2(y1 - y0, x1 - x0);
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1);
    for (const s of [-1, 1]) { c.moveTo(x1, y1); c.lineTo(x1 - Math.cos(a + s * .45) * .045, y1 - Math.sin(a + s * .45) * .045); }
    c.stroke();
    c.save(); c.fillStyle = HALO; c.beginPath(); c.arc(.132, .238, .016, 0, 7); c.fill(); c.restore();
    c.beginPath(); c.arc(.132, .238, .016, 0, 7); c.stroke();
  }
  if (o.mini){ c.restore(); return; }
  /* ligne de foi, en haut, et le losange de la route sol (p. 144, n° 2 et 11) */
  c.beginPath(); c.moveTo(x, -.69); c.lineTo(x, -.505); c.stroke();
  c.beginPath(); c.moveTo(x, -.58); c.lineTo(x + .015, -.555); c.lineTo(x, -.53); c.lineTo(x - .015, -.555); c.closePath(); c.stroke();
  /* ADF : un disque sur le pourtour de la rose (p. 143 ; fig. 42) */
  c.beginPath(); c.ellipse(-.04, -.68, .01, .025, 0, 0, 7); c.fill();
  /* repère de cap affiché (HSEL 000°), tangent au pourtour (p. 144, n° 3) */
  {
    const b = rad(sc.hsel), [px, py] = at(x, y, .613, b);
    c.save(); c.translate(px, py); c.rotate(b);
    c.strokeRect(-.0285, -.0115, .057, .023);
    c.beginPath(); c.moveTo(0, -.0115); c.lineTo(0, .0115); c.stroke();
    c.restore();
  }
  /* pointeur de relèvement du point de navigation : triangle cerclé (fig. 42) */
  c.beginPath(); c.moveTo(.203, .44); c.lineTo(.26, .408); c.lineTo(.26, .472); c.closePath(); c.stroke();
  c.beginPath(); c.arc(.238, .44, .011, 0, 7); c.stroke();
  /* TACAN : symbole de la station et pointeur de relèvement « T » au pourtour (fig. 62) */
  tacanSym(c, .005, .418);
  c.beginPath(); c.moveTo(.012, .595); c.lineTo(.036, .645); c.lineTo(-.012, .645); c.closePath();
  c.moveTo(.012, .595); c.lineTo(.012, .645); c.stroke();
  arrow(c, .714, -.163, -.273); arrow(c, .706, -.026, .079);
  texts(c, sc.data);
  labels(c, sc.pb.map(([t, px, py, al]) => [t.replace('{rng}', o.rng ?? sc.rng), px, py, al]));
  c.restore();
}

/* ---------- AZ/EL (fig. 92, p. 180) ----------
   Vue vers l'avant : azimut ±70° sur la largeur du cadre, repères à 30° et 60° ; en haut
   la « fosse » des contacts sans élévation (p. 181) ; le champ du radar en jaune. La
   figure est décalée de 0,005 vers la droite sur son boîtier : ramenée au centre. */
function fa18Azel(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle;
  ddiBezel(c);
  c.save();
  c.lineWidth = lw * .35;
  const [L, T, R, B] = [-.595, -.603, .595, .588];
  c.strokeRect(L, T, R - L, B - T);
  c.beginPath();
  for (const vx of [-.17, 0, .17]){ c.moveTo(vx, T); c.lineTo(vx, B); }
  c.moveTo(L, -.534); c.lineTo(R, -.534);                 // fosse
  c.moveTo(L, -.01); c.lineTo(R, -.01);                   // élévation 0
  for (const d of [-60, -30, 30, 60]){ const vx = d / 70 * R; c.moveTo(vx, -.04); c.lineTo(vx, .02); }
  c.stroke();
  c.strokeStyle = YEL;                                    // champ du radar (p. 180)
  c.strokeRect(-.341, -.372, .682, .577);
  c.strokeStyle = ink;
  if (o.mini){ c.restore(); return; }
  tdcDiamond(c, .634, -.669);
  arrow(c, .718, -.16, -.264); arrow(c, .718, -.03, .079);
  texts(c, sc.data);
  labels(c, sc.pb);
  c.restore();
}

/* ---------- SMS air-sol, bombes classiques (fig. 160, p. 303) ----------
   Silhouette des stations (« wingform ») : un losange par emport, le nombre et le type
   dessous, l'arme choisie encadrée ; obus restants en haut, état de MASTER ARM au
   centre, programme de largage en bas (p. 303-304). La figure est décalée de 0,02 vers
   la droite sur son boîtier : ramenée à l'axe de l'appareil. */
function fa18Sms(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  ddiBezel(c);
  c.save();
  c.lineWidth = lw * .35;
  c.translate(-.02, 0);
  c.beginPath();
  c.moveTo(-.491, -.065); c.lineTo(-.049, -.274); c.lineTo(-.049, -.345); c.lineTo(-.062, -.345);
  c.moveTo(.529, -.067); c.lineTo(.09, -.274); c.lineTo(.09, -.345); c.lineTo(.103, -.345);
  c.stroke();
  for (const [sx, sy] of sc.st){
    c.beginPath(); c.moveTo(sx, sy - .022); c.lineTo(sx + .019, sy); c.lineTo(sx, sy + .022); c.lineTo(sx - .019, sy); c.closePath(); c.stroke();
  }
  if (o.mini){ c.restore(); return; }
  /* attaches des stations : un court trait sous l'aile, au-dessus du losange */
  c.beginPath();
  for (const [sx, sy] of sc.st){ c.moveTo(sx, sy - .036); c.lineTo(sx, sy - .05); }
  c.stroke();
  /* arme choisie : encadrée en haut et sous sa station (n° 1 et 2) */
  c.strokeRect(.156, -.724, .214, .056);
  c.strokeRect(.159, -.103, .153, .04);
  c.beginPath(); c.moveTo(-.037, .287); c.lineTo(.09, .287); c.stroke();   // PROG 1 souligné
  texts(c, sc.data);
  texts(c, sc.prog, .044);
  scopeText(c, 'SAFE', .02, .012, 'center', .075);
  labels(c, sc.pb);
  c.restore();
}

/* ---------- ATFLIR air-sol (fig. 106-107, p. 220-221) ----------
   La vidéo du pod occupe le verre sauf le bandeau du bas ; réticule de grand champ avec
   les repères du champ moyen au bout des branches, vecteur vitesse et ligne d'horizon
   du HUD, point de navigation courant, flèche du nord, repère de pointage (losange). La
   figure est décalée de 0,01 vers la droite sur son boîtier : ramenée au centre. */
const VIDEO = '#0D5A14';                       // teinte moyenne de la vidéo de la figure 107
function fa18Flir(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  ddiBezel(c);
  c.save();
  c.translate(-.01, 0);
  c.fillStyle = VIDEO;
  c.beginPath(); c.roundRect(-.72, -.755, 1.465, 1.295, [.09, .09, 0, 0]); c.fill();
  c.fillStyle = c.strokeStyle;
  c.lineWidth = lw * .5;
  /* réticule (fig. 107) : centre (0,009 ; −0,003), branches de 0,057 à 0,335, butées
     perpendiculaires (repères du champ moyen) */
  const rx = .009, ry = -.003;
  c.beginPath();
  c.moveTo(rx, ry - .057); c.lineTo(rx, ry - .336); c.moveTo(rx, ry + .057); c.lineTo(rx, ry + .338);
  c.moveTo(rx - .057, ry); c.lineTo(rx - .331, ry); c.moveTo(rx + .057, ry); c.lineTo(rx + .332, ry);
  c.moveTo(rx - .09, ry - .381); c.lineTo(rx + .088, ry - .381); c.moveTo(rx - .09, ry + .376); c.lineTo(rx + .088, ry + .376);
  c.moveTo(rx - .366, ry - .091); c.lineTo(rx - .366, ry + .089); c.moveTo(rx + .366, ry - .091); c.lineTo(rx + .366, ry + .089);
  c.stroke();
  if (o.mini){ c.restore(); return; }
  c.lineWidth = lw * .35;
  /* vecteur vitesse et ligne d'horizon, bouts tournés vers le bas (p. 222) */
  c.beginPath(); c.arc(.009, -.206, .022, 0, 7); c.stroke();
  c.beginPath();
  c.moveTo(-.013, -.206); c.lineTo(-.071, -.206); c.moveTo(.031, -.206); c.lineTo(.09, -.206);
  c.moveTo(-.279, -.135); c.lineTo(-.279, -.19); c.lineTo(-.078, -.19);
  c.moveTo(.097, -.19); c.lineTo(.298, -.19); c.lineTo(.298, -.135);
  c.stroke();
  /* point de navigation courant : triangle pointe en bas, son numéro (p. 222) */
  c.beginPath(); c.moveTo(-.124, -.063); c.lineTo(-.075, -.063); c.lineTo(-.0995, -.02); c.closePath(); c.stroke();
  scopeText(c, '1', -.069, -.085, 'center', .045);
  /* flèche du nord : quatre traits couchés sur le sol, vus de biais (p. 221) */
  c.beginPath(); c.moveTo(-.545, -.462); c.lineTo(-.405, -.462); c.stroke();
  c.beginPath();
  c.moveTo(-.508, -.497); c.lineTo(-.508, -.427); c.lineTo(-.47, -.462); c.closePath();
  c.moveTo(-.432, -.497); c.lineTo(-.432, -.427); c.lineTo(-.47, -.462); c.closePath();
  c.fill();
  /* repère de pointage du pod (losange) et TDC affecté à l'écran */
  c.beginPath(); c.moveTo(.017, -.555); c.lineTo(.03, -.54); c.lineTo(.017, -.525); c.lineTo(.004, -.54); c.closePath(); c.stroke();
  tdcDiamond(c, .656, -.671);
  c.strokeRect(.19, -.745, .136, .052);                    // RTCL encadré
  c.strokeRect(-.275, .683, .095, .052);                   // ALG encadré
  texts(c, sc.data);
  labels(c, sc.pb);
  c.restore();
}

const page = (label, draw, scope) => ({ g:'fa18p', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#34D399', draw, scope });

/* libellés des boutons : [texte, x, y] mesurés sur la figure ; « ^ » en colonne,
   « [..] » encadré (scopeLabel). Données : [texte, x, y, alignement, taille]. */
Object.assign(SHAPES, {
  fa18_sa: page('Écran SA', fa18Sa, { page:'sa', hdg:331.5, rng:40, ranges:[5, 10, 20, 40, 80, 160],
    pb: [['MAP', -.495, -.723], ['DCLTR', -.25, -.723], ['SCL/{rng}', -.007, -.723], ['MK2', .236, -.723], ['DCNTR', .474, -.723],
         ['^SENSR', -.72, -.458], ['^C2', -.72, -.21],
         ['^[WYPT]', .691, -.455], ['2', .693, -.093], ['^WPDSG', .683, .30], ['^SEQ1', .683, .517],
         ['EXP', -.495, .702], ['STEP', -.255, .702], ['4346', -.017, .702], ['TXDSG', .223, .702], ['AUTO', .46, .702]],
    cm: [['C: 60', true], ['F: 30', true], ['01:  0', false], ['02:  0', false]],
    data: [['209/28.5', -.66, -.651, 'left'], ['016/ 39.0', .636, -.651, 'right'], ['00:06:14', .633, -.602, 'right'],
           ['MG29', .625, .489, 'right'], ['411 / 168', .625, .538, 'right'], ['BRA 348/10', .625, .584, 'right'],
           ['BE 207/29', .625, .633, 'right']] }),
  fa18_hsi: page('Écran HSI', fa18Hsi, { page:'hsi', hdg:82, hsel:0, rng:10, ranges:[5, 10, 20, 40, 80, 160],
    pb: [['POS/INS', -.495, -.724], ['UPDT', -.251, -.724], ['SCL/{rng}', 0, -.724], ['MK1', .243, -.724], ['DATA', .49, -.724],
         ['^TCN', -.723, -.452], ['^ILS', -.723, -.205], ['^MODE', -.723, .045], ['^VEC', -.723, .282], ['^ACL', -.723, .52],
         ['^[WYPT]', .705, -.46], ['2', .709, -.099], ['^WPDSG', .69, .269], ['^SEQ2', .69, .503],
         ['SENSORS', -.49, .698], ['3125', -.011, .698], ['TIMEUFC', .239, .698], ['AUTO', .468, .698]],
    data: [['258°/  8.1', -.663, -.592, 'left'], ['1:14', -.616, -.548, 'left'], ['TSK', -.616, -.503, 'left'],
           ['230°/  5.4', .646, -.592, 'right'], ['00:00:50', .646, -.548, 'right'], ['10319', .646, -.467, 'right'],
           ['5', .646, -.422, 'right'], ['391T', -.083, -.005, 'right'], ['391G', .061, -.005, 'left'],
           ['09:01:54EI', -.679, .564, 'left'], ['HSEL', -.70, .612, 'left'], ['000°', -.70, .658, 'left'],
           ['5.4C', .655, .569, 'right'], ['CSEL', .655, .612, 'right'], ['330°', .655, .658, 'right']] }),
  fa18_azel: page('Écran AZ/EL', fa18Azel, { page:'azel',
    pb: [['OPR', -.668, -.674, 'left'], ['[FOV]', .253, -.705], ['[ID]', .489, -.705],
         ['^STORES|DSPLY', -.687, -.215], ['^L+S|INT', -.687, .252], ['^AUTO|INT', -.687, .503],
         ['^EL|SCALE', .683, -.45], ['^IFF', .622, -.117], ['^IFF|DCLTR', .687, .515],
         ['EXP', -.485, .688], ['2714', -.005, .688], ['RSET', .24, .69]],
    data: [['ALL', -.238, -.712], ['IFF', -.238, -.66], ['052°', -.005, -.64], ['FULL', .485, -.655], ['15°', .549, -.655, 'left'],
           ['IFF', -.702, -.531, 'left'], ['RDR', -.702, -.488, 'left'], ['RWS', -.702, -.45, 'left'],
           ['0°R', -.464, -.497, 'left'], ['1°U', -.464, -.445, 'left'],
           ['840 VC', .37, -.497, 'left'], ['10.5 RNG', .26, -.44, 'left'], ['HD 186°', .345, -.385, 'left'],
           ['40', .695, -.095], ['IFF', -.24, .64], ['40', -.24, .688], ['-15°', .642, .634, 'right']] }),
  fa18_sms: page('Écran SMS (air-sol)', fa18Sms, { page:'sms',
    st: [[-.34, -.096], [-.192, -.168], [.235, -.168], [.383, -.1]],
    pb: [['68S', -.45, -.69], ['RE', -.215, -.69], ['83B', .018, -.69], ['82XT', .263, -.696],
         ['^MODE', -.672, -.43], ['^MFUZ', -.672, -.193], ['^EFUZ', -.672, .044], ['^DRAG', -.672, .284],
         ['^GUN', .715, -.433], ['^STEP', .715, .043], ['^UFC', .715, .278], ['^SIM', .715, .518],
         ['PROG', -.445, .699], ['TONE', -.21, .699], ['2404', .023, .70], ['DATA', .26, .70]],
    data: [['578', .02, -.466], ['83B', .02, -.245],
           ['14', -.34, -.059, 0, .048], ['68S', -.34, -.017, 0, .048], ['2', -.192, -.123, 0, .048], ['RE', -.192, -.084, 0, .048],
           ['2', .235, -.123, 0, .048], ['82XT', .235, -.084, 0, .048], ['14', .383, -.059, 0, .048], ['68S', .383, -.017, 0, .048],
           ['PROG 1', .027, .263, 0, .049], ['ADV-', -.607, .576, 'left'], ['BIT,BALT,', -.357, .576, 'left']],
    prog: [['MODE', -.287, .349, 'left'], ['MFUZ', -.287, .387, 'left'], ['EFUZ', -.287, .425, 'left'], ['DRAG', -.287, .463, 'left'],
           ['CCIP', -.106, .349, 'left'], ['OFF', -.106, .387, 'left'], ['OFF', -.106, .425, 'left'], ['FF', -.106, .463, 'left'],
           ['QTY', .078, .349, 'left'], ['MULT', .078, .387, 'left'], ['1', .265, .349], ['1', .265, .387]] }),
  fa18_flir: page('Écran ATFLIR (air-sol)', fa18Flir, { page:'flir',
    pb: [['OPR', -.668, -.678, 'left'], ['WFOV', -.475, -.719], ['IR', .015, -.719], ['RTCL', .258, -.719],
         ['^↑ZOOM↓', -.719, -.358], ['^↑FOCUS↓', -.712, .144],
         ['^VVSLV', .714, .03], ['^UFC', .714, .278], ['^SETUP', .714, .516],
         ['WHT', -.475, .71], ['ALG', -.228, .71], ['1811', .01, .71], ['LST', .256, .71], ['DCLTR', .498, .71]],
    data: [['Z1.0', -.47, -.652], ['1° R', .01, -.664], ['1.0', -.687, -.358, 'left'], ['0', -.672, .132], ['-12°', -.56, -.005],
           ['N 36°47.30\'', .678, -.611, 'right'], ['W115°26.99\'', .678, -.567, 'right'], ['ELEV  3472 FT', .678, -.519, 'right'],
           ['GRID 11S PA 383725', .678, -.47, 'right'],
           ['LST', .552, .211, 'left'], ['1688', .563, .256, 'left'], ['1688', .563, .30, 'left'], ['LTD/R', .552, .342, 'left'],
           ['01', .678, .52, 'right'], ['23150', .51, .621],
           ['ADV-', -.639, .576, 'left'], ['BIT,', -.384, .576, 'left'], ['298', -.49, .614], ['M 0.71', -.632, .643, 'left']] }),
});
GROUPS.push(['fa18p', 'Autres pages', 'F/A-18C']);
})();
