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

/* ---- pages STAT 1 et 2 : relevées dans les fichiers du jeu (contrôle : figures 209, p. 313, et 210, p. 315) ----
   Sources, sous Mods/aircraft/A-10C_2/Cockpit/Scripts/ (lecture seule) :
     P1  MFCD/indicator/STAT/MFCD_page_STAT_Page1.lua    la page 1 elle-même
     CO  MFCD/indicator/STAT/MFCD_page_STAT_common.lua   ce que les pages STAT partagent
     DEF MFCD/indicator/STAT/MFCD_STAT_definitions.lua   LRU, états par défaut, tableau
     UD  MFCD/indicator/MFCD_useful_definitions.lua      boutons, tableau, symbole d'attitude
     SZ  MFCD/indicator/MFCD_sizes.lua  FO  MFCD/indicator/MFCD_fonts.lua
     B15 MFCD/indicator/MFCD_page_OSB_11_15.lua  MAT materials.lua  SYM symbols.lua

   Conversion. Le jeu dessine la page dans un carré de max_pixels_count = 569 px (SZ l.1),
   origine en bas à gauche, y vers le haut (UD l.82-93). Ce carré est le verre entier :
   sur la figure 210 le noir du verre fait 498 px d'image et 20 px du jeu y font 17,9 px
   d'image, soit 498 / 0,89 = 560 px du jeu, le carré à 2 % près. Dans le repère du
   tableau (verre à ±0,79, y vers le bas), le centre du carré au centre du verre :
       x = (px − 284,5) × 1,58 / 569        y = (284,5 − py) × 1,58 / 569
   soit 0,002777 par px du jeu. Contrôle d'échelle sur la figure 210 : les boutons du haut,
   à 0,25 l'un de l'autre, y sont à 318,5 px d'image par unité, et 20 px du jeu à 17,9 px
   d'image : 0,00281 par px du jeu, 1 % près. Une ligne du tableau (TblRowHeight = 20,
   DEF l.181) fait donc 0,0555, ce que mesure aussi la figure 210 (boutons à 0,25).
   Textes : la police 1 (txt_labels_font, FO l.26, l.39, l.46, l.53-57) a une cellule de
   13 × 1,8 = 23,4 px de haut et une chasse de (569 − 60) × 0,779 / 36 = 11,02 px (0,0306) ;
   un texte aligné « …Top » a son centre 11,7 px sous l'ancre, « …Center » sur l'ancre
   (vérifié sur la figure 210 : PREV, THRTL, MFL / FLT-1 retombent à 1 px près).
   Ancres des libellés (UD l.51-75, l.251-270 ; SZ l.12, l.16 ; soi_min/max UD l.377-380) :
   en haut, x de l'OSB (OSB 1 = 110, OSB 3 = 284,5, OSB 5 = 459), y = 539 + 20 = 559 ;
   à droite, x = 539, y de l'OSB (OSB 10 = 469 − 4 × 82,5 = 139) ; à gauche, x = 30.

   État affiché : celui que les Lua écrivent au démarrage (DEF l.125-163) — CICU et ses
   sous-ensembles VALID, CICU en test UN, les autres « - » ; les six stations 1760 n'ont
   pas d'état dans les Lua (il vient du simulateur) : sans arme, STATUS_NA, leur nom
   « 1760-n » (P1 l.76), « - » (P1 l.104, l.134) et le fond blanc (P1 l.53), comme sur la
   figure 209. La ligne choisie est ALL, la première (curseur, CO l.262). */
const A10_PX = 1.58 / 569, A10_HALF = 11.7, A10_CHAR = 11.02, A10_CELL_Y = 23.4 * A10_PX;
const a10X = px => (px - 284.5) * A10_PX, a10Y = py => (284.5 - py) * A10_PX;
/* fonds par état (P1 l.37, l.52-56) et traits MFCD_BLUE (DEF l.236) : les matériaux du jeu
   (MAT l.14-17 : blanc, vert 0/255/50, rouge, bleu 100/100/255) tels que l'écran les rend,
   relevés sur la figure 210 (image d'origine, prise de face) ; le jaune (DEGR) n'est sur
   aucune figure et aucune ligne par défaut ne l'emploie : il n'est pas repris */
const A10_MAT = { w: '#F2F4F2', g: '#2CEB45', r: '#F02424', blue: '#4C5BE6' };
const A10_STAT1 = [
  // [nom tel que DEF l.64-76 l'écrit (8 caractères, le retrait compris), STAT, TEST, fond]
  ['ALL     ', '-', '-', 'w'],          // fond blanc fixe P1 l.36-47 ; « - » P1 l.91, l.114 (DEF l.126, l.142)
  ['CICU    ', 'VALID', 'UN', 'g'],     // VALID DEF l.127, UN DEF l.143 ; P1 l.101, l.123
  [' WP     ', 'VALID', '-', 'g'],      // VALID DEF l.128-132 ; « - » DEF l.144-148, P1 l.116-118
  [' MP     ', 'VALID', '-', 'g'],
  [' DLP    ', 'VALID', '-', 'g'],
  [' GVM    ', 'VALID', '-', 'g'],
  [' ALM    ', 'VALID', '-', 'g'],
  ['1760-3  ', '-', '-', 'w'],          // STATUS_NA : P1 l.53, l.76, l.104 ; TEST_NA P1 l.134
  ['1760-4  ', '-', '-', 'w'],
  ['1760-5  ', '-', '-', 'w'],
  ['1760-7  ', '-', '-', 'w'],
  ['1760-8  ', '-', '-', 'w'],
  ['1760-9  ', '-', '-', 'w'],
];
/* le tableau STAT (DEF l.177-185, l.203-237 ; UD l.707-755) : centre TblCenterX =
   569 / 2 + 6 = 290,5, demi-largeur 150, colonnes à ±49 du centre, première ligne à
   569 − 100 = 469, lignes de 20 ; textes centrés à 290,5 − 99,5, 290,5, 290,5 + 99,5,
   en noir (font_MFCD_BLACK, DEF l.208) ; les en-têtes à une demi-ligne au-dessus. */
function a10StatTable(c, rows, mini){
  const L = a10X(140.5), R = a10X(440.5), T = a10Y(469), H = 20 * A10_PX;
  c.save();
  rows.forEach(([, , , k], i) => { c.fillStyle = A10_MAT[k]; c.fillRect(L, T + i * H, R - L, H); });
  c.strokeStyle = A10_MAT.blue;                                    // addSTAT_Table, DEF l.236
  c.beginPath();
  for (let i = 0; i <= rows.length; i++){ c.moveTo(L, T + i * H); c.lineTo(R, T + i * H); }
  for (const px of [140.5, 241.5, 339.5, 440.5]){ c.moveTo(a10X(px), T); c.lineTo(a10X(px), T + rows.length * H); }
  c.stroke();
  c.restore();
  if (mini) return;
  c.save(); c.fillStyle = HALO;
  rows.forEach(([lru, st, te], i) => {
    const y = a10Y(459 - 20 * i);                                  // TblHdrTxtY − n × 20, DEF l.219
    /* le nom fait 8 caractères centrés sur 191 : il commence à 191 − 4 × 11,02 */
    a10Text(c, lru.trimEnd(), a10X(191 - 4 * A10_CHAR), y, 'left');
    a10Text(c, st, a10X(290.5), y); a10Text(c, te, a10X(390), y);
  });
  c.restore();
  for (const [t, px] of [['LRU', 191], ['STAT', 290.5], ['TEST', 390]]) a10Text(c, t, a10X(px), a10Y(479));   // CO l.270-301
}
/* flèches pleines des OSB 20 (haut) et 19 (bas) : addScrollers(20, 19, 5), CO l.213,
   UD l.569-627, au x de 30 + 5 = 35 ; le glyphe fait 32 × 22 px du jeu dans son
   carré de 36 × 26 (mesuré sur la figure 210) */
function a10Scrollers(c){
  const x = a10X(35), w = 16 * A10_PX, h = 11 * A10_PX;
  for (const [py, s] of [[469, -1], [386.5, 1]]){
    const y = a10Y(py);
    c.beginPath(); c.moveTo(x, y + s * h); c.lineTo(x + w, y - s * h); c.lineTo(x - w, y - s * h); c.closePath(); c.fill();
  }
}
/* SYS_ACTION (SYM l.5) : la puce ronde, un cercle et son point */
function a10Puce(c, x, y){ c.beginPath(); c.arc(x, y, .012, 0, 7); c.stroke(); c.beginPath(); c.arc(x, y, .005, 0, 7); c.fill(); }

/* ce que les deux pages partagent (CO), à la ligne choisie `row` (0 = la première) dont
   le nom `cur` passe entre les flèches ; rang du bas et altitude : ceux de la figure */
function a10StatCommon(c, sc, cur, row){
  const top = a10Y(559 - A10_HALF);                                // CenterTop sous 559
  /* OSB 3 → HMCS : BRANCH_L (SYM l.1) 27 px à gauche du libellé, CO l.8-32 */
  a10Text(c, '→', a10X(284.5 - 27), top); a10Text(c, 'HMCS', a10X(284.5), top);
  /* OSB 5 : puce SYS_ACTION (SYM l.5) 22 px à gauche, puis WS / CHK sur deux lignes, CO l.35-60 */
  a10Puce(c, a10X(459 - 22), top);
  a10Text(c, 'WS', a10X(459), top); a10Text(c, 'CHK', a10X(459), top + A10_CELL_Y);
  /* OSB 10 : ROTARY (SYM l.3) à 539 − 5 = 534, MFL / FLT-1 calé à droite sur 524, CO l.153-179 */
  a10Text(c, '↕', a10X(534), a10Y(139));
  a10Text(c, 'MFL', a10X(524), a10Y(139 + A10_HALF), 'right');
  a10Text(c, 'FLT-1', a10X(524), a10Y(139 - A10_HALF), 'right');
  /* OSB 20 / 19 : les flèches, et entre elles le nom de la ligne choisie, calé à gauche
     sur 20 − 15 = 5, à mi-hauteur des deux boutons, CO l.220-253 */
  a10Scrollers(c);
  a10Text(c, cur, a10X(5), a10Y((469 + 386.5) / 2), 'left');
  /* curseur BRANCH_L sur la ligne choisie, ancré à droite sur 290,5 − 150 − 15 = 125,5,
     20 plus bas par ligne (CO l.256-268) ; son glyphe est centré 10 px à gauche de
     l'ancre (figure 210) */
  a10Text(c, '→', a10X(115.5), a10Y(459 - 20 * row));
  /* journal des pannes : placé à 290,5 − 150 + 5 = 145,5 et 146 (DEF l.189-197) ;
     titre et soulignement (23 « _ », au bas de la même cellule), MFL EMPTY une ligne
     de 23,4 plus bas (CO l.303-333, DEF l.187) */
  a10Text(c, 'MAINT FAULT LOG DISPLAY', a10X(145.5), a10Y(146 - A10_HALF), 'left');
  c.beginPath(); c.moveTo(a10X(146), a10Y(146 - 23)); c.lineTo(a10X(146 + 23 * A10_CHAR), a10Y(146 - 23)); c.stroke();
  a10Text(c, 'MFL EMPTY', a10X(145.5), a10Y(146 - 23.4 - A10_HALF), 'left');
  /* rang du bas, OSB 12-15 : CenterTop à 30 + 2 = 32, fond noir (B15 l.5-23) ; les
     pages affectées sont un réglage du pilote : celles de la figure, la page en cours
     en vidéo inverse ; DCLT (OSB 11) n'y est pas */
  for (const [t, px] of sc.bottom) a10Text(c, t, a10X(px), a10Y(32 - A10_HALF), 'center', A10_SIZE, HALO);
  /* altitude barométrique : milliers calés à droite sur 33, à 32 (UD l.533-545), centaines
     en petit (0,8 × police 1) 4,7 px plus bas (UD l.547-558) ; valeur de la figure */
  a10Text(c, sc.alt[0], a10X(33), a10Y(32 - A10_HALF), 'right', A10_SIZE, HALO);
  a10Text(c, sc.alt[1], a10X(33), a10Y(32 - 4.7 - .8 * A10_HALF), 'left', A10_SIZE * .8);
  /* symbole d'attitude : l'avion au centre du fond noir, 30 + 32 − 21 = 41 et 30 + 33 = 63 (UD l.428-441, B15 l.51) */
  a10Ars(c, a10X(41), a10Y(63));
}

function a10Stat1(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  mfcdBezel(c);
  c.save();
  c.lineWidth = lw * .45;
  a10StatTable(c, A10_STAT1, o.mini);
  if (o.mini){ c.restore(); return; }
  /* OSB 1 → NEXT : BRANCH_L 27 px à gauche, P1 l.5-29 */
  const top = a10Y(559 - A10_HALF);
  a10Text(c, '→', a10X(110 - 27), top); a10Text(c, 'NEXT', a10X(110), top);
  /* OSB 6 RESET, 7 PWR, 8 SLEW, 18 TEST : leurs contrôleurs les cachent quand ALL est
     choisi (CO l.71, l.100, l.130, l.192) ; la figure 209 n'en montre aucun */
  a10StatCommon(c, sc, 'ALL', 0);
  c.restore();
}

/* ---- page STAT 2 : MFCD_page_STAT_Page2.lua (P2) ; contrôle : figure 210, p. 315 ----
   Les LRU TGP à HMCS (P2 l.45-52 : index du jeu moins LRU_1760_9), même tableau que la
   page 1 (P2 l.114, DEF l.230-237). La figure 210 date d'avant l'A-10C II : elle n'a ni
   la ligne HMCS (P2 l.52, l.103-105, l.194-198), ni NEXT à l'OSB 2 (P2 l.30-43), ni
   → HMCS à l'OSB 3 (CO l.8-32) ; les Lua les écrivent, ils sont dessinés. États : ceux
   de la figure 210 (ils viennent du simulateur ; les tests par défaut de DEF l.149-163,
   TGP UN et les autres « - », y retombent) ; HMCS en NC, sans casque (P2 l.196). La
   ligne choisie est THRTL, la 6e : son nom entre les flèches, SLEW à l'OSB 8 (CO l.122-150). */
const A10_STAT2 = [
  // [nom de DEF l.77-89 (8 caractères, le retrait compris), STAT, TEST, fond]
  ['TGP     ', 'OFF', 'UN', 'w'],       // fond P2 l.59-61, STAT P2 l.127-130, TEST DEF l.149 (P2 l.207-209)
  ['LTMFCD  ', 'VALID', 'UN', 'g'],     // P2 l.62-65, l.131-137, TEST P2 l.213-217
  ['RTMFCD  ', 'VALID', 'UN', 'g'],     // P2 l.66-69, l.138-144, l.218-222
  ['HOTAS   ', 'VALID', 'UN', 'g'],     // P2 l.70-73, l.146-152, l.223-227
  [' STICK  ', 'VALID', '-', 'g'],      // P2 l.74-77, l.153-159 ; « - » DEF l.153
  [' THRTL  ', 'VALID', '-', 'g'],      // P2 l.78-81, l.160-166 ; DEF l.154
  [' AHCP   ', 'VALID', '-', 'g'],      // P2 l.82-85, l.167-173 ; DEF l.155
  ['EGI     ', 'OFF', '-', 'w'],        // P2 l.86-90, l.175-180 ; DEF l.156
  ['IFFCC   ', 'OFF', '-', 'w'],        // P2 l.91-94, l.181-184 ; DEF l.157
  ['CDU     ', 'NC', '-', 'r'],         // P2 l.95-99, l.185-189 ; DEF l.158
  ['EPLRS   ', 'NC', '-', 'r'],         // P2 l.100-102, l.190-193 ; DEF l.159
  ['HMCS    ', 'NC', '-', 'r'],         // P2 l.103-105, l.195-198 ; DEF l.160
];
function a10Stat(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  mfcdBezel(c);
  c.save();
  c.lineWidth = lw * .45;
  a10StatTable(c, A10_STAT2, o.mini);
  if (o.mini){ c.restore(); return; }
  const top = a10Y(559 - A10_HALF);
  /* OSB 1 → PREV (P2 l.3-28) ; OSB 2 NEXT, sans flèche : son symbole n'est jamais créé (P2 l.30-43) */
  a10Text(c, '→', a10X(110 - 27), top); a10Text(c, 'PREV', a10X(110), top);
  a10Text(c, 'NEXT', a10X(197.25), top);
  /* OSB 8 : DATA_ENTRY (SYM l.4) à 539 − 5 = 534, SLEW et le taux calés à droite sur 524,
     au y de l'OSB 8, 469 − 2 × 82,5 = 304 (CO l.122-150) ; le taux, 4.0, de la figure 210 */
  a10Text(c, '[]', a10X(534), a10Y(304), 'center', .045);
  a10Text(c, 'SLEW', a10X(524), a10Y(304 + A10_HALF), 'right');
  a10Text(c, sc.slew, a10X(524), a10Y(304 - A10_HALF), 'right');
  /* OSB 6 RESET, 7 PWR, 18 TEST : la figure 210 n'en montre aucun pour THRTL */
  a10StatCommon(c, sc, 'THRTL', 5);
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
  /* pages STAT, relevées dans les Lua du jeu ; rang du bas [texte, x en px du jeu] (B15 l.16)
     et altitude [milliers, centaines] : ceux de la figure de chaque page */
  a10_stat1: a10Other('Écran STAT (page 1)', a10Stat1,
    { page:'stat1', bottom: [['TGP', 110], ['#STAT', 197.25], ['CDU', 284.5], ['MSG', 371.75]], alt: ['02', '1'] }),
  a10_stat: a10Other('Écran STAT (page 2)', a10Stat,
    { page:'stat', bottom: [['TGP', 110], ['MAV', 197.25], ['CDU', 284.5], ['#STAT', 371.75]], alt: ['00', '0'], slew: '4.0' }),
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
