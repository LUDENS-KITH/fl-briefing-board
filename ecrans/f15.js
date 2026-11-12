/* FL Briefing Board — écrans de bord du F-15C (lot 28)
   DCS Flaming Cliffs, F-15C Flight Manual (EN) : VSD p. 35-36 (figure 21) et p. 66-68
   (figure 54, mode LRS) ; TEWS p. 36 (figure 22) et p. 76-80 (figure 63, p. 78).
   Lu pour lui-même : le manuel Flaming Cliffs recopie des phrases d'un appareil à l'autre,
   alors seules les figures du F-15C font foi. Places mesurées sur l'image d'origine de
   chaque figure, ramenées au repère de l'écran (verre à ±0,79). */

/* les deux boîtiers ne sont pas centrés sur leur verre : les commandes du VSD tiennent
   sa gauche, le chanfrein du TEWS sa droite. `dx` recentre le boîtier entier dans le
   carré de la forme, après `k` et `dy` comme les autres boîtiers. */
BEZELS.vsd = { k: .96, dy: .054, dx: .191 };
BEZELS.tews = { k: .866, dy: 0, dx: -.067 };
function f15Frame(c, kind){ bezelFrame(c, kind); c.translate(BEZELS[kind].dx || 0, 0); }

/* texte de l'écran : les figures du F-15C écrivent en linéale (« G 590 », « SD »), pas
   dans la police étroite des autres écrans ; `cap` est la hauteur des capitales mesurée
   sur la figure, en unités du repère */
function f15Text(c, t, x, y, al, cap){
  c.save();
  c.translate(x, y); c.scale(cap / 7.2, cap / 7.2);
  c.font = '500 10px Arial, Helvetica, sans-serif';
  c.textAlign = al || 'center'; c.textBaseline = 'middle';
  c.fillText(t, 0, .4);
  c.restore();
}
function f15Screw(c, x, y, r){
  c.save();
  c.fillStyle = '#55524F'; c.strokeStyle = '#2A2725';
  c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(x - r * .7, y - r * .7); c.lineTo(x + r * .7, y + r * .7);
  c.moveTo(x + r * .7, y - r * .7); c.lineTo(x - r * .7, y + r * .7); c.stroke();
  c.restore();
}

/* ---------------- VSD ----------------
   Boîtier, figure 21 (p. 36), image d'origine 518 × 458 px, verre 393 × 389 px : brun
   noir, quatre vis ; à gauche la bascule CONT/MAN, le bouton SYM BRT – AUTO RDR marqué
   d'une croix, le voyant BRT, le bouton CONT – OFF barré ; en haut deux voyants et BIT ;
   verre aux coins arrondis cerclé d'un filet clair. 248,7 px par unité. */
function vsdBezel(c){
  f15Frame(c, 'vsd');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#1F1A17'; c.strokeStyle = '#3B3633';
  c.beginPath(); c.roundRect(-1.232, -.975, 2.082, 1.842, .04); c.fill(); c.stroke();
  for (const [x, y] of [[-1.152, -.895], [.78, -.895], [-1.152, .754], [.78, .754]]) f15Screw(c, x, y, .036);
  /* voyants du haut, BIT */
  c.strokeStyle = '#D9D6D3';
  for (const x of [-.159, .517]){ c.beginPath(); c.arc(x, -.887, .03, 0, 7); c.stroke(); }
  bezelText(c, 'BIT', .308, -.887, .03, '#B9B5B1');
  /* commandes de gauche */
  bezelText(c, 'CONT', -.99, -.521, .056); bezelText(c, 'MAN', -1.12, -.344, .056);
  c.fillStyle = '#6E6A67'; c.strokeStyle = '#3B3633';
  c.beginPath(); c.arc(-.951, -.33, .06, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#C9C6C3';
  c.beginPath(); c.roundRect(-.968, -.47, .034, .15, .017); c.fill(); c.stroke();
  bezelText(c, 'SYM', -1.12, -.103, .056); bezelText(c, 'BRT', -1.12, -.038, .056);
  bezelText(c, 'AUTO', -.911, -.118, .056); bezelText(c, 'RDR', -.911, -.053, .056);
  const knob = (x, y, mark) => {
    c.fillStyle = '#A9A6A3'; c.strokeStyle = '#5F5C59';
    c.beginPath(); c.arc(x, y, .12, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#C8C5C2'; c.beginPath(); c.arc(x, y, .085, 0, 7); c.fill(); c.stroke();
    c.save(); c.strokeStyle = '#2B2826'; c.lineWidth = lw * .8; c.beginPath(); mark(x, y); c.stroke(); c.restore();
  };
  knob(-.951, .111, (x, y) => { c.moveTo(x - .05, y - .05); c.lineTo(x + .05, y + .05); c.moveTo(x + .05, y - .05); c.lineTo(x - .05, y + .05); });
  c.strokeStyle = '#D9D6D3'; c.beginPath(); c.arc(-1.112, .279, .032, 0, 7); c.stroke();
  bezelText(c, 'BRT', -1.112, .352, .056);
  bezelText(c, 'CONT', -.99, .452, .056); bezelText(c, 'OFF', -1.132, .605, .056);
  knob(-.951, .605, (x, y) => { c.moveTo(x - .065, y - .015); c.lineTo(x + .065, y - .015); c.moveTo(x - .065, y + .015); c.lineTo(x + .065, y + .015); });
  /* verre */
  c.fillStyle = '#4B4744'; c.beginPath(); c.roundRect(-.805, -.797, 1.61, 1.594, .17); c.fill();
  c.fillStyle = '#1F1B18'; c.beginPath(); c.roundRect(-.79, -.782, 1.58, 1.564, .16); c.fill();
  c.restore();
}

/* page LRS, figure 54 (p. 67), image d'origine 433 × 433 px, 270 px par unité : cadre
   carré de quatre cases sur quatre, la croix du milieu ouverte autour du symbole
   d'acquisition ; à gauche l'échelle d'élévation, un repère par tiers de case, les deux
   cercles des bornes d'élévation du TDC et le chevron d'antenne ; ligne d'horizon aux
   bouts tournés vers le bas ; en bas l'échelle d'azimut, le chevron d'antenne et les
   deux cercles des bornes de balayage ; échelle en haut à droite ; barre et PRF, vitesses
   sol et vraie (p. 67). Deux plots (rectangles : hostiles, p. 67). */
function f15Vsd(c, o){
  const sc = SHAPES.f15_vsd.scope, lw = c.lineWidth, ink = c.strokeStyle;
  c.save();
  vsdBezel(c);
  c.strokeStyle = c.fillStyle = ink;
  c.lineWidth = lw * .45;
  const F = .65, G = .325, gap = .163;
  c.strokeRect(-F, -F, 2 * F, 2 * F);
  c.beginPath();
  for (const v of [-G, G]){ c.moveTo(v, -F); c.lineTo(v, F); c.moveTo(-.702, v); c.lineTo(F, v); }
  c.moveTo(0, -F); c.lineTo(0, -gap); c.moveTo(0, gap); c.lineTo(0, F);
  c.moveTo(-.702, 0); c.lineTo(-gap, 0); c.moveTo(gap, 0); c.lineTo(F, 0);
  c.stroke();
  if (o.mini){ c.restore(); return; }

  /* échelle d'élévation : un repère par tiers de case */
  c.beginPath();
  for (let k = -3; k <= 3; k++){ c.moveTo(-.702, k * .108); c.lineTo(-F, k * .108); }
  c.stroke();
  for (const y of [-.217, 0]){ c.beginPath(); c.arc(-.68, y, .026, 0, 7); c.stroke(); }
  f15Text(c, '41', -.628, -.209, 'left', .056);
  f15Text(c, '20', -.617, .002, 'left', .056);
  c.beginPath(); c.moveTo(-.58, .061); c.lineTo(-F, .106); c.lineTo(-.58, .15); c.stroke();
  /* ligne d'horizon */
  c.beginPath();
  c.moveTo(-.406, .087); c.lineTo(-.406, .02); c.lineTo(-.165, .02);
  c.moveTo(.169, .02); c.lineTo(.406, .02); c.lineTo(.406, .091);
  c.stroke();
  /* échelle d'azimut, chevron d'antenne, bornes de balayage */
  c.beginPath();
  for (const x of [-.217, -.113, .109, .213]){ c.moveTo(x, .598); c.lineTo(x, F); }
  c.moveTo(.246, .58); c.lineTo(.276, .648); c.lineTo(.306, .58);
  c.stroke();
  for (const x of [-.62, .62]){ c.beginPath(); c.arc(x, .62, .03, 0, 7); c.stroke(); }
  /* plots et symbole d'acquisition (TDC) */
  c.fillRect(-.298, -.5, .067, .026);
  c.fillRect(.02, -.393, .067, .026);
  c.fillRect(-.037, -.046, .019, .092); c.fillRect(.022, -.046, .019, .092);
  /* textes */
  f15Text(c, String(o.rng ?? sc.rng), .598, -.70, 'right', .056);
  f15Text(c, '2 HI', -.58, .602, 'left', .059);
  f15Text(c, 'G 590', -.58, .698, 'left', .059);
  f15Text(c, 'T 602', .556, .698, 'right', .059);
  c.restore();
}

/* ---------------- TEWS ----------------
   Figure 63 (p. 78), image d'origine 482 × 456 px, verre 330 px de diamètre, 208,9 px
   par unité. Boîtier noir, coin haut droit chanfreiné ; anneau clair autour du verre,
   huit traits blancs tous les 30° hors des axes ; sur les axes, quatre plaques à
   triangle et deux trous ; en haut à gauche un cercle, en bas à gauche le bouton au
   trèfle, à droite le bouton INT ; « TEWS » écrit en colonne ; huit vis. */
function tewsBezel(c){
  f15Frame(c, 'tews');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#0A0F12'; c.strokeStyle = '#2C3236';
  c.beginPath();
  c.moveTo(-1.087, -1.091); c.lineTo(.373, -1.091); c.lineTo(1.221, -.507); c.lineTo(1.221, 1.091); c.lineTo(-1.087, 1.091);
  c.closePath(); c.fill(); c.stroke();
  for (const [x, y] of [[-.991, -.986], [-.991, -.407], [-.991, .967], [-.574, .943], [.555, .943], [1.13, -.278], [1.13, 0], [1.13, .967]])
    f15Screw(c, x, y, .04);
  /* plaques des axes : un « toit » à pans coupés, un triangle tourné vers le verre, deux trous */
  c.strokeStyle = '#3F4448';
  for (let q = 0; q < 4; q++){
    c.save(); c.rotate(q * Math.PI / 2);
    c.beginPath();
    c.moveTo(-.239, -.79); c.lineTo(-.239, -.95); c.lineTo(-.153, -1.034); c.lineTo(.153, -1.034); c.lineTo(.239, -.95); c.lineTo(.239, -.79);
    c.stroke();
    c.beginPath(); c.moveTo(-.105, -.986); c.lineTo(.11, -.986); c.lineTo(.002, -.876); c.closePath(); c.stroke();
    for (const x of [-.167, .168]){ c.beginPath(); c.arc(x, -.914, .045, 0, 7); c.stroke(); }
    c.restore();
  }
  /* traits blancs */
  c.save(); c.strokeStyle = '#E8E8E8'; c.lineWidth = .028; c.lineCap = 'butt';
  c.beginPath();
  for (const d of [30, 60, 120, 150, 210, 240, 300, 330]){
    const a = d * Math.PI / 180, s = Math.sin(a), co = -Math.cos(a);
    c.moveTo(s * .871, co * .871); c.lineTo(s * 1.0, co * 1.0);
  }
  c.stroke(); c.restore();
  /* cercle du haut, bouton au trèfle, bouton INT, nom */
  c.strokeStyle = '#3F4448'; c.beginPath(); c.arc(-.665, -.962, .135, 0, 7); c.stroke();
  c.fillStyle = '#6B6765'; c.strokeStyle = '#3F4448';
  c.beginPath(); c.arc(-.78, .823, .153, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#3A3634';
  for (const a of [-150, -30, 90]){
    const r = a * Math.PI / 180;
    c.beginPath(); c.arc(-.78, .823, .115, r - .52, r + .52); c.arc(-.78, .823, .04, r + .52, r - .52, true); c.closePath(); c.fill();
  }
  c.beginPath(); c.arc(-.78, .823, .025, 0, 7); c.fill();
  c.fillStyle = '#B9B6B3'; c.strokeStyle = '#6E6A67';
  c.beginPath(); c.arc(1.005, .656, .105, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#2A2725'; c.fillRect(.995, .6, .022, .11);
  bezelText(c, 'INT', 1.005, .503, .058, '#E8E8E8');
  [...'TEWS'].forEach((ch, i) => bezelText(c, ch, -.991, .416 + i * .117, .1, '#E8E8E8'));
  /* anneau et verre */
  c.fillStyle = '#8A8683'; c.beginPath(); c.arc(0, 0, .838, 0, 7); c.fill();
  c.fillStyle = '#3A3532'; c.beginPath(); c.arc(0, 0, .81, 0, 7); c.fill();
  c.fillStyle = '#26211E'; c.beginPath(); c.arc(0, 0, .79, 0, 7); c.fill();
  c.restore();
}

/* l'écran, figure 63 (p. 78) : douze points tous les 30° ; au milieu la croix blanche,
   l'appareil ; les menaces de l'exemple du manuel, chacune à sa place : radar
   d'acquisition « SD » du Buk à 12 h, « CS » et « BB » du S-300PS à 1 h, « TP » du
   Neustrashimy à 2 h sous le demi-cercle d'une menace nouvelle, « 50 » de l'A-50 à 3 h
   sous le chapeau d'une menace aérienne, « 29 » du MiG-29 à 10-11 h, menace principale
   dans son losange (p. 78, 80) */
function f15Tews(c, o){
  const lw = c.lineWidth, ink = c.strokeStyle;
  c.save();
  tewsBezel(c);
  c.lineWidth = lw * .45;
  c.save(); c.strokeStyle = A10_WH; c.lineWidth = lw * .7;
  c.beginPath(); c.moveTo(-.094, 0); c.lineTo(.094, 0); c.moveTo(0, -.094); c.lineTo(0, .094); c.stroke();
  c.restore();
  c.strokeStyle = c.fillStyle = ink;
  for (let d = 0; d < 360; d += 30){
    const a = d * Math.PI / 180;
    c.beginPath(); c.arc(Math.sin(a) * .718, -Math.cos(a) * .718, .014, 0, 7); c.fill();
  }
  if (o.mini){ c.restore(); return; }
  const T = (t, x, y) => f15Text(c, t, x, y, 'center', .06);
  const hat = (x, y) => { c.beginPath(); c.moveTo(x - .019, y + .009); c.lineTo(x, y - .009); c.lineTo(x + .019, y + .009); c.stroke(); };
  T('SD', .014, -.622);
  T('CS', .29, -.543); T('BB', .316, -.445);
  T('TP', .52, -.29);
  c.beginPath(); c.arc(.519, -.30, .072, Math.PI + .08, 2 * Math.PI - .08); c.stroke();
  T('50', .625, .024); hat(.622, -.03);
  T('29', -.261, -.26); hat(-.264, -.325);
  c.beginPath(); c.moveTo(-.264, -.354); c.lineTo(-.18, -.27); c.lineTo(-.264, -.186); c.lineTo(-.348, -.27); c.closePath(); c.stroke();
  c.restore();
}

const f15Page = (label, draw, scope, more = {}) => ({ g:'f15', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#7CB40B', draw, scope, ...more });

Object.assign(SHAPES, {
  f15_vsd: f15Page('Écran VSD (LRS)', f15Vsd,
    { bez:'vsd', page:'lrs', rng:40, ranges:[10, 20, 40, 80, 160], area:[-.65, -.65, .65, .65] }),
  f15_tews: f15Page('Écran TEWS', f15Tews, { bez:'tews', page:'tews' }, { col:'#94B44A' }),
});
GROUPS.push(['f15', 'Écrans', 'F-15C']);
