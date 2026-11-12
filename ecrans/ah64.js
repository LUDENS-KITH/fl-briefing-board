/* ---------------- AH-64D Apache : les MPD ----------------
   DCS AH-64D Flight Manual (EN), Eagle Dynamics. Lu pour lui-même : rien n'est repris des
   autres modules. Toutes les figures de pages MPD du manuel sont des captures de 660 × 660
   pixels, du même boîtier au même cadrage (p. 196, 220, 446, 455, 536, 625) : les places
   sont relevées en pixels sur l'image d'origine de ces figures, et l'écran se dessine dans
   ce repère de pixels, ramené au repère des formes par MPD_S (le verre, de 95 à 565 px en
   largeur et de 104 à 577 px en hauteur, est à ±0,79 ; son centre est en 330 ; 340,5 px).

   Le MPD (p. 164-165, figure de la p. 164) : 6¼ × 6¼ pouces, carré. Boutons à fonction
   variable (VAB) : T1 → T6 en haut de gauche à droite, L1 → L6 à gauche et R1 → R6 à droite
   de haut en bas, B1 → B6 en bas de gauche à droite, B1 étant le bouton M. Boutons fixes :
   FCR, WPN à gauche, TSD en bas à gauche, VID, COM à droite, A/C en bas à droite. Bouton
   astérisque à droite en haut ; molettes VID, BRT et sélecteur DAY / NT / MONO. */

const MPD_S = .79 / 236;                     // unités du repère par pixel de la figure
/* boutons mesurés (centres en pixels) sur les figures p. 625 et p. 446 */
const MPD_TOP = [177.5, 239.5, 300.5, 362.5, 424.5, 485.5];         // T1 → T6, y 43
const MPD_BOT = [176, 236, 298, 359.5, 421, 483];                   // B1 (M) → B6, y 630
const MPD_SIDE = [182.5, 240, 297.5, 355.5, 412.5, 470.5];          // L1 → L6 et R1 → R6

/* le boîtier entier va de −1,10 à 1,10 en largeur, de −1,13 (molettes) à 1,06 (boutons
   du bas) en hauteur : ramené dans le carré de la forme */
BEZELS.mpd = { k: .905, dy: .035 };

/* passe dans le repère de pixels de la figure ; la symbologie fine garde son trait */
function mpdPx(c){ c.scale(MPD_S, MPD_S); c.translate(-330, -340.5); }

/* boîtier du MPD (figure p. 164 ; mêmes places sur toutes les figures de pages) : boîtier
   noir, une lèvre grise autour du verre, chaque VAB gris bleuté clair à point blanc dans
   son logement, relié au verre par un trait blanc (en biais sur les côtés), boutons fixes
   noirs à texte blanc, trois molettes claires */
function mpdBezel(c){
  bezelFrame(c, 'mpd');
  const lw = c.lineWidth;
  c.save();
  mpdPx(c);
  c.lineWidth = lw * .5 / MPD_S;
  const rr = (x, y, w, h, r, fill, stroke) => {
    c.fillStyle = fill; c.strokeStyle = stroke;
    c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, r); c.fill(); c.stroke();
  };
  rr(330, 328.5, 656, 657, 24, '#23282A', '#3D4446');                 // boîtier
  c.fillStyle = '#121516';
  for (const [x, y] of [[24, 22], [632, 34], [38, 626], [624, 626]]){ c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); }
  rr(330, 341, 536, 540, 26, '#3A4143', '#5A6264');                 // lèvre autour du verre
  /* traits blancs des VAB vers le verre */
  c.save(); c.strokeStyle = '#DADDE0'; c.lineWidth = 2.2;
  c.beginPath();
  for (const x of MPD_TOP){ c.moveTo(x, 62); c.lineTo(x + 2, 97); }
  for (const x of MPD_BOT){ c.moveTo(x + 1, 586); c.lineTo(x - 1, 610); }
  for (const y of MPD_SIDE){ c.moveTo(52, y); c.lineTo(88, y + 12.5); c.moveTo(608, y); c.lineTo(573, y + 8); }
  c.stroke(); c.restore();
  /* VAB : logement sombre, bouton clair, point blanc */
  const vab = (x, y) => {
    rr(x, y, 52, 52, 6, '#1B2022', '#3A4244');
    rr(x, y, 30, 30, 3, '#A9C3CF', '#7F97A3');
    c.fillStyle = '#F0F4F5'; c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill();
  };
  MPD_TOP.forEach(x => vab(x, 43));
  MPD_BOT.slice(1).forEach(x => vab(x, 630));
  MPD_SIDE.forEach(y => { vab(35, y); vab(625, y); });
  /* boutons fixes (p. 165, n° 6 et 7), astérisque (n° 5, non simulé) */
  for (const [x, y, t] of [[30, 530, 'FCR'], [30, 587, 'WPN'], [110, 631, 'TSD'], [176, 631, 'M'],
                           [549, 633, 'A/C'], [629, 531, 'VID'], [628.5, 590, 'COM'], [632, 131, '*']]){
    rr(x, y, t.length > 1 ? 50 : 40, 38, 5, '#1D2123', '#454C4E');
    bezelText(c, t, x, y + (t === '*' ? 3 : 0), t === '*' ? 30 : 21, '#F2F4F5');
  }
  /* molettes (n° 2, 3, 4) : VID, son repère en haut ; BRT, en haut à gauche ; le
     sélecteur sur DAY */
  for (const [x, y, a] of [[106, 27, -Math.PI / 2], [26, 110, -Math.PI * .75], [552, 30, -Math.PI * .25]]){
    c.fillStyle = '#CCDCE6'; c.strokeStyle = '#7F8C94';
    c.beginPath(); c.arc(x, y, 22, 0, 7); c.fill(); c.stroke();
    c.save(); c.lineWidth = 1.2; c.strokeStyle = '#8C9AA2';
    c.beginPath(); for (let k = 0; k < 20; k++){ const b = k * Math.PI / 10; c.moveTo(x + 18 * Math.cos(b), y + 18 * Math.sin(b)); c.lineTo(x + 22 * Math.cos(b), y + 22 * Math.sin(b)); }
    c.stroke();
    c.strokeStyle = '#111416'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(x - 6 * Math.cos(a), y - 6 * Math.sin(a)); c.lineTo(x + 19 * Math.cos(a), y + 19 * Math.sin(a)); c.stroke();
    c.strokeStyle = '#E8EDF0'; c.lineWidth = 2.5; c.stroke();
    c.restore();
  }
  bezelText(c, 'VID', 68, 32, 22, '#F2F4F5'); bezelText(c, 'BRT', 35, 78, 22, '#F2F4F5');
  bezelText(c, 'DAY', 595, 18, 18, '#F2F4F5'); bezelText(c, '- NT', 594, 38, 18, '#F2F4F5'); bezelText(c, 'MONO', 600, 58, 18, '#F2F4F5');
  c.fillStyle = HALO;                                                 // verre, ±0,79
  c.beginPath(); c.roundRect(94, 104.5, 472, 472, 6); c.fill();
  c.restore();
}

/* tailles de police en pixels de la figure : libellés (capitales de 12 px), chiffres des
   fenêtres (17 px), intermédiaires (15 px) */
const MPD_T = 18.5, MPD_BIG = 26.5, MPD_MID = 23;

/* un libellé : « > » en tête trace la flèche d'un bouton de page au-dessus du texte
   (p. 169 : « Page button … annotated by an arrow ») ; le reste suit scopeLabel
   (« [..] » encadré, « ^ » en colonne, « \n » à la ligne) */
function mpdLabel(c, t, x, y, al = 'center', size = MPD_T, bg = null){
  if (t.startsWith('>')){
    t = t.slice(1);
    const w = t.length * size * CW, x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
    const ay = y - (t.split('\n').length - 1) * size * 1.15 / 2 - 10.5;
    c.beginPath(); c.moveTo(x0, ay); c.lineTo(x0 + w - 3, ay); c.stroke();
    c.beginPath(); c.moveTo(x0 + w + 1, ay); c.lineTo(x0 + w - 7, ay - 3.5); c.lineTo(x0 + w - 7, ay + 3.5); c.closePath(); c.fill();
  }
  scopeLabel(c, t, x, y, al, bg, size);
}
/* une fenêtre d'état aux coins arrondis, fond noir (TSD, ASE, FCR, WPN) */
function mpdWin(c, x0, y0, x1, y1, r = 7, fill = HALO){
  c.save(); c.fillStyle = fill; c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, r); c.fill(); c.restore();
  c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, r); c.stroke();
}
/* flèche creuse : les boutons d'échelle du TSD, les flèches de l'axe du FCR */
function mpdHollowArrow(c, x, y, rot, w = 17, h = 24){
  c.save(); c.translate(x, y); c.rotate(rot);
  const hw = w / 2, sw = w * .2, hh = h * .45;
  c.beginPath();
  c.moveTo(0, -h / 2); c.lineTo(hw, -h / 2 + hh); c.lineTo(sw, -h / 2 + hh); c.lineTo(sw, h / 2);
  c.lineTo(-sw, h / 2); c.lineTo(-sw, -h / 2 + hh); c.lineTo(-hw, -h / 2 + hh); c.closePath();
  c.stroke(); c.restore();
}
/* l'appareil (« Ownship », bleu, p. 196 n° 9 et p. 625 n° 6) : un anneau pointé et sa
   queue décalée à gauche, mesurés sur la figure p. 220 (anneau de 11,4 px) */
const AH64_BLUE = '#35D3F0';
function ah64Ownship(c, x, y){
  c.save(); c.fillStyle = AH64_BLUE;
  c.beginPath(); c.arc(x, y, 11.4, 0, 7); c.arc(x, y, 6.2, 0, 7, true); c.fill();
  c.beginPath(); c.arc(x, y, 2.9, 0, 7); c.fill();
  c.beginPath();
  c.moveTo(x - 7.5, y + 9); c.lineTo(x + 2.5, y + 9); c.lineTo(x + 2.5, y + 17.4); c.lineTo(x - 1.9, y + 17.4);
  c.lineTo(x - 1.9, y + 25.4); c.lineTo(x - 8.1, y + 25.4); c.closePath(); c.fill();
  c.restore();
}
/* entrée commune d'une page : boîtier, repère de pixels, trait fin */
function mpdPage(c, o, body){
  const lw = c.lineWidth;
  mpdBezel(c);
  c.save();
  mpdPx(c);
  c.lineWidth = lw * .35 / MPD_S;
  body(c, !o.mini, lw * .35 / MPD_S);
  c.restore();
}
const ah64Labels = (c, list) => { for (const [t, x, y, al, size] of list) mpdLabel(c, t, x, y, al || 'center', size || MPD_T); };

/* ---- page TSD, phase NAV (p. 196-199, figure p. 196) ----
   Sur la figure, la carte (CHART) est en dessous ; la carte du tableau en tient lieu, comme
   le format STICK de la p. 220 (« no moving map underlay »). Sont dessinés : les libellés
   des boutons, le cap (n° 3), l'état de la grille (n° 13), l'échelle (n° 14), la fenêtre du
   point de navigation (n° 10), l'endurance (n° 18), le vent (n° 19), le cap de commande
   (n° 12), l'appareil (n° 9) hors du mode centré : CTR n'est pas encadré. La route, les
   points et les lignes de grille dépendent du terrain et de la mission : non dessinés. */
function ah64Tsd(c, o){
  mpdPage(c, o, (c, full, lw) => {
    ah64Ownship(c, 331.9, 436.6);
    if (!full) return;
    const ink = c.strokeStyle;
    ah64Labels(c, [
      ['>RPT', 178, 121], ['>PAN', 240, 121], ['>SHOW', 285, 121], ['PP', 371, 121], ['>COORD', 422, 121], ['>UTIL', 482, 121],
      ['>INST', 111, 191, 'left'], ['[SA]', 106, 474, 'left'],
      ['CTR', 560, 306, 'right'], ['FRZ', 560, 362, 'right'], ['CAQ', 560, 420, 'right'], ['ACQ\n[FXD]', 560, 486, 'right'],
      ['[TSD]', 179, 562], ['PHASE\n[NAV]', 236, 552.5], ['>BAM', 288, 562], ['>MAP', 372, 562], ['>RTE', 418, 562], ['>POINT', 478, 562],
    ]);
    c.save(); c.fillStyle = '#F2F4F5'; mpdLabel(c, 'REC', 105, 253, 'left'); c.restore();   // réception : blanc (n° 8)
    /* cap de l'appareil et cap de commande, dans leur cadre arrondi */
    mpdWin(c, 311, 108, 354, 134, 9); scopeText(c, '133', 332.5, 121.5, 'center', MPD_BIG);
    mpdWin(c, 310, 544, 352, 571, 9); scopeText(c, '137', 331, 557.5, 'center', MPD_BIG);
    mpdWin(c, 514, 108, 565, 133, 9); scopeText(c, '10KM', 539.5, 120.5, 'center', MPD_MID);
    /* échelle : deux flèches creuses, la valeur entre elles (R1, R2) */
    mpdHollowArrow(c, 551, 193.5, 0, 17, 24); mpdHollowArrow(c, 551, 246, Math.PI, 17, 24);
    scopeText(c, '50', 550, 219, 'center', MPD_T);
    /* fenêtre du point de navigation, endurance, vent */
    mpdWin(c, 158, 450, 288, 500, 9);
    scopeText(c, 'W01', 166, 466, 'left', MPD_T);
    scopeText(c, '9.1', 255, 466, 'right', MPD_BIG); scopeText(c, 'KM', 283, 466, 'right', MPD_T);
    scopeText(c, '0', 194, 484, 'center', MPD_BIG);
    mpdWin(c, 420, 458, 497, 479, 8);
    scopeText(c, 'EN', 430, 468.5, 'center', MPD_T); scopeText(c, '4:08', 473, 468.5, 'center', MPD_BIG);
    mpdWin(c, 409, 484, 494, 506, 10);
    scopeText(c, 'CALM', 451.5, 495, 'center', MPD_BIG);
    c.strokeStyle = ink;
  });
}

/* ---- page FCR, mode GTM (p. 446-448, figure p. 446 ; secteur p. 455-456) ----
   Secteur de 90° (balayage W) jusqu'à 8 km, l'appareil à la pointe ; arcs à 2, 4, 6 km ;
   repères de distance à 1, 3, 5, 7 km sur les deux bords ; repères des secteurs M (±22,5°),
   N (±15°), Z (±7,5°) et l'axe (0°) sur l'arc extérieur (p. 455-456). Bande de cap de 180°
   graduée tous les 10°, cap au centre, ligne de foi, symbole de l'axe du FCR (n° 2, 4, 5),
   échelle d'élévation : ±25° aux grands traits, −6,25° au trait du milieu (n° 16), fenêtres
   du High Action Display (n° 19) et de l'axe courant / précédent (n° 18, 20). Les cibles
   de la figure sont celles d'un balayage : non dessinées. */
function ah64Fcr(c, o){
  mpdPage(c, o, (c, full, lw) => {
    const ax = 331.5, ay = 511.5, R = 299, at = (deg, r) => [ax + r * Math.sin(deg * Math.PI / 180), ay - r * Math.cos(deg * Math.PI / 180)];
    const rad = d => (d - 90) * Math.PI / 180;
    c.save(); c.lineWidth = lw * 1.5;                                  // le secteur est tracé plus gras (fig.)
    c.beginPath(); c.arc(ax, ay, R, rad(-45), rad(45)); c.stroke();
    for (const k of [.75, .5, .25]){ c.beginPath(); c.arc(ax, ay, R * k, rad(-45), rad(45)); c.stroke(); }
    c.beginPath();
    for (const s of [-1, 1]){ const [x0, y0] = at(45 * s, 20), [x1, y1] = at(45 * s, R); c.moveTo(x0, y0); c.lineTo(x1, y1); }
    c.stroke();
    /* repères des secteurs sur l'arc extérieur, vers l'intérieur */
    c.beginPath();
    for (const d of [-22.5, -15, -7.5, 0, 7.5, 15, 22.5]){ const [x0, y0] = at(d, R), [x1, y1] = at(d, R - 8); c.moveTo(x0, y0); c.lineTo(x1, y1); }
    /* repères de distance, perpendiculaires aux bords, vers l'intérieur ; celui de 5 km
       traverse le bord (fig.) */
    for (const s of [-1, 1]) for (const km of [1, 3, 5, 7]){
      const [x0, y0] = at(45 * s, R * km / 8), out = km === 5 ? 5 * Math.SQRT1_2 : 0;
      c.moveTo(x0 + s * out, y0 + out); c.lineTo(x0 - s * 8 * Math.SQRT1_2, y0 - 8 * Math.SQRT1_2);
    }
    c.stroke();
    c.restore();
    if (!full) return;
    /* bande de cap : 1,29 px par degré, de 210° à 040° autour du cap 309° de la figure ;
       grands traits tous les 30° */
    const hdg = 309, hx = h => 331.6 + (((h - hdg + 540) % 360) - 180) * 1.29;
    c.beginPath();
    for (let h = 210; h <= 400; h += 10){ const x = hx(h % 360), big = h % 30 === 0; c.moveTo(x, big ? 145 : 148); c.lineTo(x, big ? 156 : 153); }
    c.stroke();
    /* « 21 » est coupé au bord sur la figure : il n'en reste que le « 1 » */
    for (const [t, x] of [['1', 210], ['24', 242], ['W', 282], ['33', 361], ['N', 398], ['3', 437]]) scopeText(c, t, x, 136, 'center', MPD_T);
    scopeLabel(c, '309', 331, 134, 'center', HALO, MPD_MID);
    c.beginPath(); c.moveTo(331, 156); c.lineTo(331, 179); c.stroke();                       // ligne de foi
    c.beginPath(); c.arc(312.5, 162, 4.5, 0, 7); c.fill();                                   // axe du FCR
    c.save(); c.strokeStyle = HALO; c.lineWidth = 1.2; c.beginPath(); c.moveTo(312.5, 157.5); c.lineTo(312.5, 166.5); c.stroke(); c.restore();
    /* deux marques sous la bande, visibles sur la figure, que la légende ne nomme pas */
    c.beginPath(); c.moveTo(355, 158.5); c.lineTo(359.5, 165.5); c.lineTo(350.5, 165.5); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(455, 167); c.lineTo(460, 159); c.lineTo(465, 167); c.stroke();
    /* libellés */
    ah64Labels(c, [
      ['C SCP', 179, 122], ['>UTIL', 482, 121],
      ['^NTS', 111, 195], ['^TGT', 110, 364], ['ELEV\n[AUTO]', 106, 421, 'left'],
      ['^ZOOM', 554, 196],['ACQ\n[FXD]', 559, 477.5, 'right'],
    ]);
    scopeText(c, 'RF', 558, 362, 'right', MPD_T); scopeText(c, 'HO', 558, 377, 'right', MPD_T);   // R4, lignes serrées (fig.)
    mpdHollowArrow(c, 110.5, 253.5, -Math.PI / 2, 15, 21); mpdHollowArrow(c, 549, 253.5, Math.PI / 2, 15, 21);
    mpdWin(c, 498, 137, 557, 163, 7); scopeText(c, '25', 550, 150, 'right', MPD_MID);        // cibles détectées (n° 6)
    /* échelle d'élévation : 9 traits tous les 7 px, grands au premier, au sixième, au
       dernier ; le curseur plein à 0° */
    c.beginPath();
    for (let i = 0; i <= 8; i++){ const y = 498 + i * 7, big = i === 0 || i === 5 || i === 8; c.moveTo(96, y); c.lineTo(big ? 110 : 105, y); }
    c.stroke();
    c.beginPath(); c.moveTo(112, 526.5); c.lineTo(121, 521.5); c.lineTo(121, 531.5); c.closePath(); c.fill();
    /* High Action Display : visée et portée à gauche, acquisition et schéma de priorité
       à droite ; au milieu, l'axe courant et l'axe précédent */
    mpdWin(c, 127, 517, 272, 561, 7);
    scopeText(c, 'P-FCR', 134, 528, 'left', MPD_MID); scopeText(c, 'R6.9', 266, 528, 'right', MPD_MID);
    mpdWin(c, 390, 518, 537, 562, 7);
    scopeText(c, 'FXD', 496, 529, 'right', MPD_MID); scopeText(c, 'DEF SCHEME C', 398, 550, 'left', MPD_MID);
    mpdWin(c, 280, 520, 383, 563, 0);
    c.beginPath();
    c.moveTo(322.5, 520); c.lineTo(322.5, 563); c.moveTo(331.3, 520); c.lineTo(331.3, 563);
    c.moveTo(281, 533); c.lineTo(286, 533); c.moveTo(377, 533); c.lineTo(382, 533);
    c.stroke();
    c.strokeRect(317, 535, 21, 15);
  });
}

/* ---- page WPN (p. 536-538, figure p. 536) ----
   L'appareil vu de dessus : le canon dans le nez et sa caisse d'obus (n° 11), les
   lance-roquettes 6PD (n° 13), les lance-missiles à quatre rails (n° 12) — icônes SAL
   (AGM-114K, coiffe barrée) à gauche, RF (AGM-114L, coiffe en V) à droite (p. 586, 610) —,
   le lance-leurres et son compte (n° 14) ; visée, ARM/SAFE, acquisition, codes LST et LRFD
   (n° 6 à 10). Chargement et valeurs : ceux de la figure. */
function ah64Wpn(c, o){
  mpdPage(c, o, (c, full, lw) => {
    const line = pts => { c.beginPath(); c.moveTo(...pts[0]); for (const p of pts.slice(1)) c.lineTo(...p); c.stroke(); };
    /* fuselage avant (le nez arrondi) et arrière, mesurés sur la figure */
    c.beginPath();
    c.moveTo(280, 312); c.lineTo(291, 312); c.lineTo(291, 236);
    c.quadraticCurveTo(291, 221, 305, 220); c.lineTo(312, 219);
    c.quadraticCurveTo(313, 202, 331, 202); c.quadraticCurveTo(349, 202, 350, 219);
    c.lineTo(357, 220); c.quadraticCurveTo(371, 221, 371, 236); c.lineTo(371, 313); c.lineTo(379, 313);
    c.stroke();
    line([[278, 382], [291, 382], [291, 472], [371, 472], [371, 382], [383, 382]]);
    /* canon : tube, tourelle, caisse */
    c.strokeRect(327.5, 213, 5.5, 37); c.strokeRect(320, 251, 22, 31); c.strokeRect(301, 282, 61, 30);
    /* lance-roquettes : caisson à tubes (bord du haut festonné), aile au dehors */
    const pod = x0 => {
      c.strokeRect(x0, 300, 37, 91);
      c.beginPath(); for (let k = 0; k < 5; k++) c.arc(x0 + 3.7 + k * 7.4, 300, 3.7, Math.PI, 0); c.stroke();
    };
    pod(197); pod(427.5);
    c.strokeRect(176, 320.5, 21, 48.5); c.strokeRect(464.5, 320.5, 21.5, 49.5);
    /* rails : un missile (19 px, coiffe arrondie) ou un rail vide (7 px) */
    const missile = (x0, y0, kind) => {
      const x1 = x0 + 19, ym = y0 + 10;
      c.beginPath(); c.moveTo(x0, y0 + 58); c.lineTo(x0, ym); c.arc(x0 + 9.5, ym, 9.5, Math.PI, 0); c.lineTo(x1, y0 + 58); c.closePath(); c.stroke();
      c.beginPath();
      if (kind === 'sal'){ c.moveTo(x0, ym); c.lineTo(x1, ym); }
      else { c.moveTo(x0, ym); c.lineTo(x0 + 9.5, ym + 7.5); c.lineTo(x1, ym); }
      c.stroke();
    };
    const rail = (x0, y0) => c.strokeRect(x0, y0, 7, 50);
    missile(243, 281, 'sal'); rail(271, 289); missile(243, 346, 'sal'); rail(271, 354);
    missile(378, 281, 'rf'); missile(400.5, 281, 'rf'); rail(383.5, 355); missile(400.5, 346, 'rf');
    /* attaches entre caissons, rails et fuselage */
    c.beginPath();
    c.moveTo(234, 316); c.lineTo(243, 316); c.moveTo(234, 375.5); c.lineTo(243, 375.5);
    c.moveTo(262, 315); c.lineTo(271, 315); c.moveTo(262, 380); c.lineTo(271, 380);
    c.moveTo(397, 313.5); c.lineTo(400.5, 313.5); c.moveTo(419.5, 317); c.lineTo(427.5, 317);
    c.moveTo(390.5, 379.5); c.lineTo(400.5, 379.5); c.moveTo(419.5, 376); c.lineTo(427.5, 376);
    c.stroke();
    /* le lance-leurres, dans le fuselage arrière */
    mpdWin(c, 300, 395, 363, 465, 8);
    if (!full) return;
    scopeText(c, '503', 331, 297, 'center', MPD_BIG);
    scopeText(c, '6PD', 215.5, 339, 'center', MPD_MID); scopeText(c, '6PD', 446, 339, 'center', MPD_MID);
    scopeText(c, 'L', 252.5, 316, 'center', MPD_T); scopeText(c, 'L', 252.5, 380, 'center', MPD_T);
    scopeText(c, 'R', 387.5, 322, 'center', MPD_T);
    scopeText(c, 'CHAFF', 331.5, 408, 'center', MPD_T); scopeText(c, '30', 331.5, 431, 'center', MPD_MID);
    scopeText(c, 'SAFE', 331.5, 452, 'center', MPD_BIG);
    /* fenêtres d'état du haut */
    for (const [x0, y0, x1, y1, t] of [[211, 149, 278, 196, 'SIGHT\nTADS'], [384, 149, 451, 196, 'ACQ\nFXD'],
                                       [211, 209, 264, 249, 'LST\nB'], [398, 209, 451, 250, 'LRFD\nA']]){
      mpdWin(c, x0, y0, x1, y1, 8); scopeLabel(c, t, (x0 + x1) / 2, (y0 + y1) / 2, 'center', null, MPD_T);
    }
    mpdWin(c, 296, 143, 366, 192, 9); scopeText(c, 'SAFE', 331, 168, 'center', MPD_BIG);
    ah64Labels(c, [
      ['>CHAN', 178, 121], ['>ASE', 238, 121], ['>CODE', 360, 121], ['>COORD', 422, 121], ['>UTIL', 482, 121],
      ['>BORESIGHT', 106, 418, 'left'], ['GRAYSCALE', 106, 478, 'left'],
      ['TRAIN', 561, 366, 'right'], ['LRFD\n[FIRST]', 561, 432.5, 'right'], ['ACQ\n[FXD]', 561, 488.5, 'right'],
      ['[WPN]', 178, 564], ['GUN', 238, 565], ['MSL', 298, 565], ['RKT', 420, 565], ['MANRNG>\n3000', 481, 557],
    ]);
    c.fillRect(564.5, 346, 6, 39);                                     // barre de TRAIN (n° 15)
  });
}

/* ---- page ASE (p. 625-626, figure p. 625) ----
   Le cercle de l'empreinte ASE autour de l'appareil (n° 6, 7), état et mode des leurres
   (n° 1, 4), cap (n° 2), compte des menaces (n° 3), réglage d'autopage (n° 5), stock de
   leurres (n° 8), cap du point suivant (n° 9). Sans menace : la figure n'en montre pas. */
function ah64Ase(c, o){
  mpdPage(c, o, (c, full, lw) => {
    c.save(); c.lineWidth = lw * 1.5;
    c.beginPath(); c.arc(330.5, 342, 157, 0, 7); c.stroke();
    c.restore();
    ah64Ownship(c, 330.5, 340.5);
    if (!full) return;
    ah64Labels(c, [
      ['CHAFF\n[SAFE]', 179.5, 132], ['>UTIL', 481, 126],
      ['CHAFF MODE\n[PROGRAM]', 104, 202, 'left'], ['AUTOPAGE\n[SEARCH]', 559, 204, 'right'],
      ['[ASE]', 177, 561],
    ]);
    mpdWin(c, 311, 108, 354, 133, 9); scopeText(c, '266', 332.5, 121, 'center', MPD_BIG);
    mpdWin(c, 446, 137.5, 509.5, 181, 9); scopeText(c, 'RLWR', 451, 171.5, 'left', MPD_T); scopeText(c, '0', 501, 171.5, 'center', MPD_T);
    mpdWin(c, 154, 483, 208.5, 529, 9); scopeText(c, 'CHAFF', 181, 496, 'center', MPD_T); scopeText(c, '30', 181, 518, 'center', MPD_MID);
    mpdWin(c, 312, 546, 347, 569, 9); scopeText(c, '0', 337.5, 557.5, 'center', MPD_MID);
  });
}

const ah64Page = (label, draw, page) => ({ g:'ah64', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#34D399', draw, scope:{ page, bez:'mpd' } });

Object.assign(SHAPES, {
  ah64_tsd: ah64Page('Écran TSD (NAV)', ah64Tsd, 'tsd'),
  ah64_fcr: ah64Page('Écran FCR (GTM)', ah64Fcr, 'fcr'),
  ah64_wpn: ah64Page('Écran WPN', ah64Wpn, 'wpn'),
  ah64_ase: ah64Page('Écran ASE', ah64Ase, 'ase'),
});
GROUPS.push(['ah64', 'Écrans MPD', 'AH-64D']);
