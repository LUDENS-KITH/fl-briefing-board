/* ---------------- Su-25T : écran TV IT-23M et indicateur SPO-15 ----------------
   DCS World Su-25T Flight Manual (EN), « Su-25T cockpit instruments ». Lu pour
   lui-même : rien n'est repris des autres modules.
   - écran TV IT-23M : p. 26-28, figures 27 (acquisition au « Mercury », p. 26, image
     d'origine 480 × 422 px) et 28 (cible accrochée au « Shkval », p. 27, 485 × 413 px) ;
   - SPO-15LM « Beryoza » : p. 9-10, figure 13 (p. 10, image d'origine 347 × 472 px). */

/* ---- écran TV IT-23M ----
   Repère : pixels de la figure 27 → unités, le verre de 464 px de large (x 6 → 470) à
   ±0,79, centré en (240 ; 198) ; 293,7 px l'unité. Le verre est un rectangle aux coins
   arrondis de ±0,79 × ±0,558. Les figures ne montrent du boîtier que son cadre de métal
   gris autour d'un liseré sombre : c'est tout ce qui est dessiné. La figure 28 est prise de
   biais : ses places sont ramenées dans le repère de la figure 27 par une homographie
   calée sur huit points communs (graduations, case d'assiette, textes fixes ; écart
   résiduel ≈ 3 px). */
const TVP = (x, y) => [(x - 240) / 293.7, (y - 198) / 293.7];
BEZELS.tv = { k: 1.15, dy: -.04 };
const TV_INK = '#121612', TV_W = .79, TV_H = .558;

function tvBezel(c, mini){
  bezelFrame(c, 'tv');
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#A9AAA6'; c.strokeStyle = '#7C7D79';                  // cadre gris (fig. 27, 28)
  c.beginPath(); c.roundRect(-.86, -.70, 1.72, 1.48, .07); c.fill(); c.stroke();
  c.fillStyle = '#C4C5C1';                                              // reflet du haut du cadre (fig. 27)
  c.beginPath(); c.roundRect(-.80, -.685, 1.60, .05, .025); c.fill();
  c.fillStyle = '#26302E'; c.strokeStyle = '#1A201F';                  // liseré sombre autour du tube
  c.beginPath(); c.roundRect(-TV_W - .035, -TV_H - .035, 2 * TV_W + .07, 2 * TV_H + .07, .19); c.fill(); c.stroke();
  c.fillStyle = '#C3D8B3';                                              // image du capteur, vert pâle
  c.beginPath(); c.roundRect(-TV_W, -TV_H, 2 * TV_W, 2 * TV_H, .15); c.fill();
  if (!mini){                                                           // lignes de balayage (fig. 27, 28)
    c.save(); c.clip(); c.fillStyle = '#9FB592'; c.globalAlpha = .35;
    for (let y = -TV_H; y < TV_H; y += .0205) c.fillRect(-TV_W, y, 2 * TV_W, .007);
    c.restore();
  }
  c.restore();
}

/* texte de l'écran TV : police épaisse, chasse large mesurée sur les figures
   (`h` hauteur des capitales, `adv` pas d'un caractère) */
function tvText(c, s, x, y, h, adv, al = 'center'){
  const n = [...s].length, x0 = al === 'left' ? x + adv / 2 : al === 'right' ? x - (n - .5) * adv : x - (n - 1) * adv / 2;
  [...s].forEach((ch, i) => {
    c.save(); c.translate(x0 + i * adv, y); c.scale(h / 7.2 * 1.4, h / 7.2);
    c.font = '700 10px ui-sans-serif, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(ch, 0, .4); c.restore();
  });
}

/* symbologie commune aux deux pages (p. 26-28, fig. 27) :
   - échelle d'azimut en haut, ±40° tous les 10°, longue tous les 20° ; le chevron
     (triangle à tige) donne la direction de visée ; le milieu = l'axe de l'avion ;
   - échelle de site à gauche, de +20° à −90° tous les 10°, le trait long à 0° ; le
     chevron « ◁ » donne le site de visée ; places de +20° à −80° (−90° est sous le coin
     arrondi du tube, hors de la figure) ;
   - à droite de l'échelle de site, l'assiette de l'avion dans sa case ;
   - au centre, le symbole avion du HUD, incliné du roulis (ses deux ailes, un petit trait
     sous chacune) ; la ligne pointillée qui le traverse et ses deux bouts pleins, tels que
     la figure 27 les montre (le manuel ne les nomme pas). La figure 28 les cache derrière
     l'image du char : ils sont repris de la figure 27. */
const TV_AZ0 = .0085, TV_AZ10 = .0664, TV_EL0 = -.099, TV_EL10 = .063, TV_C = [.004, .01];
function tvCommon(c, sc, lw){
  c.lineWidth = lw * .35;
  c.beginPath();
  for (let k = -4; k <= 4; k++){                                        // azimut (fig. 27 : 9 traits)
    const x = TV_AZ0 + k * TV_AZ10;
    c.moveTo(x, -.556); c.lineTo(x, k % 2 ? -.519 : -.499);
  }
  const ax = TV_AZ0 + sc.az / 10 * TV_AZ10;                             // chevron d'azimut
  c.moveTo(ax, -.556); c.lineTo(ax, -.47); c.lineTo(ax - .032, -.429); c.moveTo(ax, -.47); c.lineTo(ax + .032, -.429);
  for (let j = -2; j <= 8; j++){                                        // site (fig. 27 : 11 traits, +20° en haut)
    const y = TV_EL0 + j * TV_EL10;
    c.moveTo(-.797, y); c.lineTo(j === 0 ? -.672 : j % 2 ? -.76 : -.735, y);
  }
  const ey = TV_EL0 - sc.el / 10 * TV_EL10;                             // chevron de site, avec sa tige
  c.moveTo(-.797, ey); c.lineTo(-.698, ey); c.lineTo(-.664, ey - .03); c.lineTo(-.664, ey + .03); c.closePath();
  c.stroke();
  c.strokeRect(-.583, .007, .166, .075);                                // case d'assiette
  tvText(c, sc.pitch, -.432, .045, .046, .045, 'right');
  /* symbole avion, incliné du roulis de la figure */
  c.save(); c.translate(...TV_C); c.rotate(sc.bank * Math.PI / 180);
  c.beginPath();
  for (const s of [-1, 1]){
    c.moveTo(s * .097, 0); c.lineTo(s * .315, 0);
    c.moveTo(s * .125, 0); c.lineTo(s * .125, .016);
  }
  c.stroke(); c.restore();
  /* ligne pointillée et ses deux bouts (fig. 27, pixels d'origine) */
  c.beginPath();
  c.moveTo(...TVP(118.75, 203)); c.lineTo(...TVP(145, 203));
  c.moveTo(...TVP(333.75, 198.25)); c.lineTo(...TVP(360, 198.25));
  const dy = x => 209.25 + (x - 137) * (203.75 - 209.25) / (361 - 137);
  for (const [a, b] of [[137.5, 146], [158.75, 167.5], [180, 190], [200, 207.5], [217.5, 226], [253.75, 266],
                        [297.5, 305], [315, 324], [333.75, 342.5], [352.5, 361]]){
    c.moveTo(...TVP(a, dy(a))); c.lineTo(...TVP(b, dy(b)));
  }
  c.stroke();
}

/* page TV : `sc.page` 'lltv' (fig. 27) ou 'lock' (fig. 28) */
function su25Tv(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  tvBezel(c, o.mini);
  c.save();
  c.strokeStyle = c.fillStyle = TV_INK;
  c.lineCap = 'butt';
  if (o.mini){
    c.lineWidth = lw * .35;
    c.beginPath(); c.moveTo(-.25, -.556); c.lineTo(.27, -.556); c.stroke();
    if (sc.page === 'lock'){ c.setLineDash([.035, .025]); c.strokeRect(TV_C[0] - .195, TV_C[1] - .2, .39, .4); }
    else c.strokeRect(TV_C[0] - .017, TV_C[1] - .017, .034, .034);
    c.restore(); return;
  }
  tvCommon(c, sc, lw);
  c.lineWidth = lw * .35;
  const big = (t, x, y, al) => tvText(c, t, x, y, .05, .068, al);
  if (sc.page === 'lltv'){
    /* fig. 27 : cadre de cible TV au centre (petit carré, cible de 10 m), « 10 » sa
       taille en m, « KC » visée manuelle, « 307р » hauteur radiosonde, « 1.7 » distance
       oblique en km, « 5.5с » temps de vol du missile (p. 26-27) */
    c.strokeRect(TV_C[0] - .017, TV_C[1] - .017, .034, .034);
    tvText(c, '10', -.449, -.439, .027, .031, 'left');
    big('KC', .259, -.41); big('307р', .7065, -.412, 'right');
    big('1.7', -.017, .368); big('5.5с', .536, .361, 'right');
  } else {
    /* fig. 28 : cible accrochée — le cadre de cible TV en pointillés autour d'elle (sa
       moitié basse porte un trait vertical pointillé, seul visible sous le char), « 10 ×23 »
       taille et grossissement, « AC » accrochage, « 424р », « ПР » tir autorisé,
       « 3.5ЛД » distance du télémètre laser, « 11.7с » (p. 27-28) */
    c.save(); c.setLineDash([.014, .01]);
    c.strokeRect(TV_C[0] - .195, TV_C[1] - .2, .39, .4);
    c.beginPath(); c.moveTo(TV_C[0], .054); c.lineTo(TV_C[0], TV_C[1] + .2); c.stroke();
    c.restore();
    tvText(c, '10 ×23', -.449, -.433, .027, .031, 'left');
    big('AC', .257, -.409); big('424р', .705, -.412, 'right');
    /* la ligne du bas est plus serrée que sur la figure 27 (bornes ramenées par
       l'homographie : 3.5ЛД de −0,132 à 0,173, 11.7с de 0,265 à 0,538, ПР de −0,064 à 0,045) */
    tvText(c, 'ПР', -.009, .283, .05, .055); tvText(c, '3.5ЛД', .02, .368, .05, .061);
    tvText(c, '11.7с', .538, .357, .05, .055, 'right');
  }
  c.restore();
}

/* ---- SPO-15LM « Beryoza » (fig. 13, p. 10) ----
   Repère : pixels de l'image d'origine doublée (694 × 944) → unités, centre du boîtier en
   (347 ; 472), 472 px l'unité : la face tient tout le carré en hauteur.
   La situation est celle de la figure, lue p. 10 : menace principale à 50° à gauche
   (lampe 50 jaune), type « П » (intercepteur) allumé, bande de puissance jaune, grand
   cercle rouge = l'avion est accroché, hémisphères « В » et « Н » allumés = même
   altitude ; menace secondaire de type « Х » ; lampes vertes = directions des menaces
   secondaires ; triangle jaune = repère de l'avion sur la bande. */
const SPP = (x, y) => [(x - 347) / 472, (y - 472) / 472];
const SPU = v => v / 472;
BEZELS.spo = { k: .98, dy: 0 };
const SPO = { yel: '#FDCB18', red: '#E02220', grey: '#7A7977', green: '#85BD12', face: '#0B1013', white: '#F4F6F6' };
/* bande de puissance : [angle depuis l'avant (°, sens horaire), rayon (px), allumée],
   centre (343 ; 343) */
const SPO_STRIP = [[-128.6, 164, 0], [-107.9, 163, 0], [-85.4, 161, 0], [-62.3, 162, 0], [-41.2, 161, 1], [-18.9, 164, 1],
  [19.5, 165, 1], [40.4, 159, 1], [62.6, 163, 1], [86.5, 165, 1], [108.3, 165, 1], [130.2, 170, 1], [151.8, 169, 1]];
/* silhouette de l'avion, moitié gauche du nez à la queue ; la droite en miroir (x → 689 − x) */
const SPO_PLANE = [[331, 124], [323, 152], [323, 236], [259, 347], [259, 372], [327, 374], [329, 413], [296, 456],
  [296, 483], [335, 456], [344.5, 481]];

function su25Spo(c, o){
  const lw = c.lineWidth, mini = o.mini;
  bezelFrame(c, 'spo');
  c.save();
  c.lineWidth = lw * .5;
  const disc = (x, y, r, fill, stroke) => {
    c.fillStyle = fill; c.beginPath(); c.arc(...SPP(x, y), SPU(r), 0, 7); c.fill();
    if (stroke){ c.strokeStyle = stroke; c.stroke(); }
  };
  const txt = (t, x, y, size, col) => { const [tx, ty] = SPP(x, y); bezelText(c, t, tx, ty, size, col); };
  /* boîtier noir, liseré octogonal, quatre vis */
  c.fillStyle = SPO.face; c.strokeStyle = '#2A3035';
  c.beginPath(); c.roundRect(...SPP(0, 0), SPU(694), SPU(944), SPU(20)); c.fill(); c.stroke();
  c.strokeStyle = '#6D6A68';
  c.beginPath();
  [[160, 28], [535, 28], [660, 150], [660, 800], [545, 925], [150, 925], [32, 800], [32, 150]].forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](...SPP(x, y)));
  c.closePath(); c.stroke();
  for (const [x, y] of [[45, 65], [645, 65], [55, 895], [640, 895]]){
    disc(x, y, 24, '#67615E', '#3A3634');
    c.save(); c.strokeStyle = '#2A2624'; c.lineWidth = lw * .9;
    c.beginPath(); c.moveTo(...SPP(x - 15, y + 8)); c.lineTo(...SPP(x + 15, y - 8)); c.stroke(); c.restore();
  }
  /* lampes de direction : 10, 30, 50, 90 de chaque côté ; 50 gauche allumée */
  for (const [x, y, t, on] of [[267.5, 90, '10'], [178, 135, '30'], [117, 215, '50', 1], [85, 315, '90'],
                               [417.5, 90, '10'], [510, 135, '30'], [572, 215, '50'], [590, 315, '90']]){
    disc(x, y, on ? 37 : 35, on ? SPO.yel : SPO.grey);
    if (!mini) txt(t, x, y + 2, .078, '#2B2A28');
  }
  /* petites lampes ; vertes = menaces secondaires (fig. 13) */
  for (const [x, y, g] of [[282.5, 150], [213, 186], [168, 245, 1], [145, 322], [402.5, 150, 1], [473, 186, 1],
                           [520, 245], [542, 322], [227.5, 520], [457.5, 520]]) disc(x, y, 11.5, g ? SPO.green : SPO.grey);
  /* cercle rouge : l'avion est accroché */
  disc(345, 340, 112, SPO.red);
  /* bande de puissance */
  for (const [a, r, on] of SPO_STRIP){
    const t = a * Math.PI / 180, [cx, cy] = SPP(343 + Math.sin(t) * r, 343 - Math.cos(t) * r);
    c.save(); c.translate(cx, cy); c.rotate(t); c.fillStyle = on ? SPO.yel : SPO.grey;
    c.beginPath(); c.roundRect(-SPU(24), -SPU(11), SPU(48), SPU(22), SPU(11)); c.fill(); c.restore();
  }
  /* repère de l'avion sur la bande : triangle jaune cerné */
  c.fillStyle = SPO.yel; c.strokeStyle = '#6B4A10';
  c.beginPath(); c.moveTo(...SPP(247.5, 485)); c.lineTo(...SPP(290, 490)); c.lineTo(...SPP(265, 525)); c.closePath(); c.fill(); c.stroke();
  /* voyant de puissance, en haut */
  c.fillStyle = SPO.yel;
  c.beginPath(); c.moveTo(...SPP(339, 66)); c.lineTo(...SPP(349, 66)); c.lineTo(...SPP(355, 107.5)); c.lineTo(...SPP(335, 107.5)); c.closePath(); c.fill();
  /* avion : silhouette blanche sur fond noir */
  { const pts = [...SPO_PLANE, ...SPO_PLANE.slice(0, -1).reverse().map(([x, y]) => [689 - x, y])];
    c.save(); c.fillStyle = SPO.face; c.strokeStyle = SPO.white; c.lineWidth = SPU(5); c.lineJoin = 'miter';
    c.beginPath(); pts.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](...SPP(x, y))); c.closePath();
    c.fill(); c.stroke();
    c.beginPath(); c.moveTo(...SPP(331, 415)); c.lineTo(...SPP(335, 456)); c.moveTo(...SPP(358, 415)); c.lineTo(...SPP(354, 456)); c.stroke();
    c.restore(); }
  /* hémisphères В / Н allumés, dans la silhouette, séparés d'une barre noire */
  { const [hx, hy] = SPP(346, 312), r = SPU(45), g = SPU(6.5);
    c.fillStyle = SPO.yel;
    c.beginPath(); c.arc(hx, hy - g, r, Math.PI, 0); c.closePath(); c.fill();
    c.beginPath(); c.arc(hx, hy + g, r, 0, Math.PI); c.closePath(); c.fill();
    if (!mini){ txt('В', 342.5, 286, .085, '#1A1A1A'); txt('Н', 342.5, 340, .085, '#1A1A1A'); } }
  /* lampes « hémisphère arrière » ◁ ▷ */
  for (const s of [-1, 1]){
    const x = s < 0 ? 187.5 : 502.5;
    disc(x, 572.5, 35, SPO.grey);
    c.fillStyle = SPO.grey; c.strokeStyle = '#201C19'; c.save(); c.lineWidth = SPU(6);
    c.beginPath(); c.moveTo(...SPP(x + s * 12.5, 575)); c.lineTo(...SPP(x - s * 20, 545)); c.lineTo(...SPP(x - s * 20, 605)); c.closePath();
    c.fill(); c.stroke(); c.restore();
  }
  /* types de menace : П (allumé) З Х Н F С ; П et Х écrits en vert (fig. 13) */
  const types = [['П', 105, 178, 1, 1], ['З', 190, 262], ['Х', 275, 348, 0, 1], ['Н', 360, 432], ['F', 444, 517], ['С', 528, 600]];
  for (const [t, x0, x1, on, g] of types){
    const [a, b] = SPP(x0, 640), [d] = SPP(x1, 0);
    c.fillStyle = on ? SPO.yel : SPO.grey; c.beginPath(); c.roundRect(a, b, d - a, SPU(35), SPU(17)); c.fill();
    if (!mini) txt(t, (x0 + x1) / 2, 700, .085, g ? SPO.green : '#494646');
  }
  /* commutateur РУЧН / АВТ sous « КОНТР », molette « НОЧЬ » */
  c.fillStyle = '#6E6E6E'; c.strokeStyle = '#4A4A4A';
  c.beginPath(); [[365, 779], [420, 807.5], [420, 872.5], [365, 900], [310, 872.5], [310, 807.5]].forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](...SPP(x, y)));
  c.closePath(); c.fill(); c.stroke();
  disc(365, 832.5, 30, '#26292C', '#9A9A9A');
  c.fillStyle = '#C8CCCF';
  c.beginPath(); c.moveTo(...SPP(358, 835)); c.lineTo(...SPP(372, 835)); c.lineTo(...SPP(376, 925)); c.lineTo(...SPP(354, 925)); c.closePath(); c.fill();
  disc(365, 925, 11, '#C8CCCF');
  disc(532.5, 840, 52.5, '#201B17', '#5A5450');
  disc(532.5, 840, 36, '#2A2420', '#4A4440');
  if (!mini){
    txt('КОНТР', 362.5, 757.5, .075, SPO.white); txt('НОЧЬ', 532.5, 757.5, .075, SPO.white);
    [...'РУЧН'].forEach((t, i) => txt(t, 280, [797.5, 827.5, 859, 890][i], .068, SPO.white));
    [...'АВТ'].forEach((t, i) => txt(t, 452.5, [807.5, 837.5, 865][i], .068, SPO.white));
  }
  c.restore();
}

const su25Page = (label, draw, scope) => ({ g:'su25t', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#34D399', draw, scope });

Object.assign(SHAPES, {
  /* acquisition au « Mercury » (fig. 27) : visée à −20° d'azimut, −18° de site, assiette
     +4°, roulis de la figure 8,8° à droite */
  su25t_tv_lltv: su25Page('Écran TV (acquisition)', su25Tv, { bez:'tv', page:'lltv', az:-20, el:-18, pitch:'4', bank:8.8 }),
  /* cible accrochée au « Shkval » (fig. 28) : visée à −15° d'azimut, −14° de site,
     assiette −1° */
  su25t_tv_lock: su25Page('Écran TV (cible accrochée)', su25Tv, { bez:'tv', page:'lock', az:-15, el:-14, pitch:'−1', bank:8.8 }),
  su25t_spo15: su25Page('Indicateur SPO-15', su25Spo, { bez:'spo' }),
});
GROUPS.push(['su25t', 'Écrans', 'Su-25T']);
