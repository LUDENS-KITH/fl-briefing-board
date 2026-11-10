/* FL Briefing Board — bibliothèque de formes.
   Chaque forme se dessine dans un repère normalisé [-1, 1], nez / haut vers -y.
   Aucune image : tout est paramétrique, donc orientable, redimensionnable et
   colorable sans perte. */

/* remplissage léger + contour : lisible de loin, sur fond clair comme sombre */
function body(c){
  c.save(); c.globalAlpha = 0.28; c.fill(); c.restore();
  c.stroke();
}

/* silhouette symétrique : on ne décrit que le côté droit, du nez à la queue.
   Le premier et le dernier point doivent être sur l'axe (x = 0). */
function sil(c, pts){
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts) c.lineTo(x, y);
  for (let i = pts.length - 1; i >= 0; i--) c.lineTo(-pts[i][0], pts[i][1]);
  c.closePath();
}

/* nacelles moteur symétriques */
function pods(c, list){
  for (const [x, y, w, h] of list){
    for (const s of [1, -1]){
      c.beginPath();
      c.rect(s * x - w / 2, y, w, h);
      body(c);
    }
  }
}

const SHAPES = {

  /* ---------------- aéronefs ---------------- */

  /* Les quatre voilures fixes doivent se distinguer d'un coup d'œil, même petites :
     envergure, flèche, nombre de moteurs et taille par défaut sont tous différents. */

  fighter: { g:'air', label:'Chasseur', s0:.85, tile:.50, draw(c){
    sil(c, [[0,-1.05],[.08,-.62],[.11,-.18],[.70,.44],[.70,.58],[.17,.34],[.17,.70],
            [.44,.92],[.44,1.0],[.13,.88],[0,.94]]);
    body(c);
  }},

  bomber: { g:'air', label:'Bombardier', s0:1.3, tile:.30, hit:1.5, draw(c){
    sil(c, [[0,-.95],[.07,-.72],[.08,-.30],[1.42,.30],[1.42,.44],[.10,.40],[.10,.66],
            [.52,.86],[.52,.94],[.09,.84],[0,.90]]);
    body(c);
    pods(c, [[.45,-.14,.10,.27], [.86,.04,.10,.27]]);   // quatre moteurs sous voilure
  }},

  tanker: { g:'air', label:'Ravitailleur', s0:1.25, tile:.32, hit:1.35, ldy:1.55, draw(c){
    sil(c, [[0,-.90],[.17,-.58],[.18,0],[1.18,.18],[1.18,.34],[.21,.36],[.21,.64],
            [.52,.84],[.52,.92],[.17,.82],[0,.88]]);
    body(c);
    pods(c, [[.48,.04,.11,.26], [.84,.11,.11,.26]]);
    c.beginPath();                                       // perche : la marque du ravitailleur
    c.moveTo(0, .88); c.lineTo(0, 1.32);
    c.moveTo(-.22, 1.10); c.lineTo(.22, 1.10);
    c.stroke();
    c.beginPath(); c.arc(0, 1.38, .09, 0, 7); c.stroke();
  }},

  airliner: { g:'air', label:'Civil', s0:1.1, tile:.38, hit:1.25, draw(c){
    sil(c, [[0,-1.0],[.12,-.74],[.13,-.08],[.94,.32],[.94,.46],[.16,.42],[.16,.70],
            [.34,.86],[.34,.94],[.12,.84],[0,.90]]);
    body(c);
    pods(c, [[.44,.02,.14,.30]]);                        // deux gros réacteurs
    c.beginPath();                                       // empennage en T
    c.moveTo(-.52, .98); c.lineTo(.52, .98);
    c.stroke();
  }},

  helo: { g:'air', label:'Hélicoptère', s0:.9, tile:.42, draw(c){
    c.beginPath(); c.ellipse(0, -.18, .32, .50, 0, 0, 7); body(c);
    c.beginPath();                       // poutre de queue
    c.moveTo(-.09, .24); c.lineTo(-.06, .88); c.lineTo(.06, .88); c.lineTo(.09, .24);
    c.closePath(); body(c);
    c.save(); c.globalAlpha = .7;        // disque rotor
    c.beginPath(); c.arc(0, -.18, .86, 0, 7); c.stroke();
    c.restore();
    c.beginPath(); c.moveTo(-.26, .92); c.lineTo(.26, .92); c.stroke();
  }},

  awacs: { g:'air', label:'AWACS', s0:1.15, tile:.36, hit:1.25, draw(c){
    sil(c, [[0,-1.0],[.12,-.74],[.13,-.10],[.96,.34],[.96,.46],[.16,.42],[.16,.70],
            [.36,.86],[.36,.94],[.12,.84],[0,.90]]);
    body(c);
    c.beginPath(); c.ellipse(0, .22, .50, .50, 0, 0, 7); body(c);   // rotodome : la marque AWACS
    c.beginPath(); c.moveTo(-.5, .22); c.lineTo(.5, .22); c.stroke();
  }},

  drone: { g:'air', label:'Drone', s0:.95, tile:.34, hit:1.3, draw(c){
    sil(c, [[0,-.82],[.08,-.64],[.09,-.14],[1.28,-.06],[1.28,.05],[.09,.10],[.07,.62],[0,.66]]);
    body(c);
    c.beginPath();                                       // empennage en V et hélice propulsive
    c.moveTo(0, .55); c.lineTo(.38, .88); c.moveTo(0, .55); c.lineTo(-.38, .88);
    c.moveTo(-.18, .72); c.lineTo(.18, .72);
    c.stroke();
  }},

  /* ---------------- armement et effets ---------------- */

  missile: { g:'arm', label:'Missile', s0:.95, tile:.42, ldy:1.55, draw(c){
    sil(c, [[0,-1],[.08,-.76],[.08,-.44],[.24,-.24],[.08,-.24],[.08,.48],
            [.30,.84],[.30,.94],[.08,.86],[0,.86]]);
    body(c);
    c.save(); c.globalAlpha = .6; c.setLineDash([.14, .12]);   // traînée : le sens de vol
    c.beginPath(); c.moveTo(0, .98); c.lineTo(0, 1.45); c.stroke();
    c.restore();
  }},

  bomb: { g:'arm', label:'Bombe', s0:.8, tile:.44, draw(c){
    sil(c, [[0,-1],[.20,-.84],[.26,-.48],[.26,.18],[.16,.50],[.08,.58],[.08,.62],
            [.50,.66],[.50,1.0],[.08,.92],[0,.92]]);          // ailerons en boîte, bien lisibles
    body(c);
  }},

  blast: { g:'arm', label:'Explosion', s0:1.05, tile:.44, draw(c){
    const star = (R, r, n) => {
      c.beginPath();
      for (let i = 0; i < n * 2; i++){
        const a = i * Math.PI / n - Math.PI / 2, rr = i % 2 ? r : R * (i % 4 ? .82 : 1);
        c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      c.closePath();
    };
    star(1, .52, 10); body(c);
    star(.52, .26, 8); c.fill();
  }},

  splash: { g:'arm', label:'Abattu', s0:1, tile:.46, draw(c){
    c.save(); c.scale(.62, .62);                     // l'appareil touché…
    SHAPES.fighter.draw(c);
    c.restore();
    c.save(); c.lineWidth *= 1.9;                    // …barré : la marque « splash »
    c.beginPath();
    c.moveTo(-.86, -.86); c.lineTo(.86, .86); c.moveTo(.86, -.86); c.lineTo(-.86, .86);
    c.stroke(); c.restore();
  }},

  eject: { g:'arm', label:'Éjection', s0:.95, tile:.44, draw(c){
    c.beginPath();                                       // voilure du parachute
    c.moveTo(-.9, -.3); c.quadraticCurveTo(0, -1.3, .9, -.3);
    c.quadraticCurveTo(.6, -.44, .3, -.3); c.quadraticCurveTo(0, -.44, -.3, -.3);
    c.quadraticCurveTo(-.6, -.44, -.9, -.3);
    body(c);
    c.beginPath();                                       // suspentes
    for (const x of [-.9, -.3, .3, .9]){ c.moveTo(x, -.3); c.lineTo(0, .42); }
    c.stroke();
    c.beginPath(); c.arc(0, .54, .12, 0, 7); c.fill();  // pilote
    c.beginPath(); c.moveTo(0, .66); c.lineTo(0, .96); c.moveTo(-.2, .78); c.lineTo(.2, .78); c.stroke();
  }},

  flares: { g:'arm', label:'Leurres', s0:.95, tile:.44, draw(c){
    const burst = (x, y, r) => {
      c.beginPath();
      for (let i = 0; i < 8; i++){
        const a = i * Math.PI / 4, rr = i % 2 ? r * .4 : r;
        c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      c.closePath(); body(c);
    };
    c.save(); c.globalAlpha = .7; c.setLineDash([.1, .12]);   // éjectés de l'appareil vers l'arrière
    c.beginPath();
    c.moveTo(0, -.9); c.quadraticCurveTo(-.2, -.1, -.6, .5);
    c.moveTo(0, -.9); c.lineTo(0, .7);
    c.moveTo(0, -.9); c.quadraticCurveTo(.2, -.1, .6, .5);
    c.stroke(); c.restore();
    burst(-.6, .5, .32); burst(0, .72, .32); burst(.6, .5, .32);
  }},

  /* ---------------- sol et mer ---------------- */

  tank: { g:'sol', label:'Char', draw(c){
    for (const s of [1, -1]){            // chenilles
      c.beginPath(); c.rect(s * .48 - .16, -.72, .32, 1.44); body(c);
    }
    c.beginPath(); c.rect(-.44, -.66, .88, 1.32); body(c);   // caisse
    c.beginPath(); c.arc(0, .10, .34, 0, 7); body(c);        // tourelle
    c.beginPath(); c.moveTo(0, .02); c.lineTo(0, -1.02); c.stroke();  // canon
  }},

  radar: { g:'sol', label:'Radar', draw(c){
    c.beginPath(); c.moveTo(0, .95); c.lineTo(0, .18); c.stroke();
    c.beginPath(); c.arc(0, .18, .52, Math.PI, 2 * Math.PI); body(c);
    c.save(); c.globalAlpha = .8;        // lobes d'émission
    for (const r of [.70, .88, 1.06]){
      c.beginPath(); c.arc(0, .18, r, Math.PI * 1.18, Math.PI * 1.82); c.stroke();
    }
    c.restore();
  }},

  sam: { g:'sol', label:'Menace SA', tag:'SAM', tile:.26, hit:1.75, draw(c){
    c.save(); c.setLineDash([.16, .13]);                     // cercle d'engagement
    c.beginPath(); c.arc(0, 0, 1.6, 0, 7); c.stroke(); c.restore();
    c.beginPath();
    c.moveTo(-.55, .48); c.lineTo(0, -.62); c.lineTo(.55, .48);
    c.closePath(); body(c);
  }},

  airport: { g:'sol', label:'Aéroport', s0:1.15, tile:.26, hit:1.3, draw(c){
    c.beginPath(); c.rect(-1, -.13, 2, .26); body(c);        // piste principale
    c.save(); c.rotate(-1.0);
    c.beginPath(); c.rect(-.72, -.10, 1.44, .20); body(c);   // piste sécante
    c.restore();
    c.save(); c.globalAlpha = .9; c.setLineDash([.10, .10]);
    c.beginPath(); c.moveTo(-.86, 0); c.lineTo(.86, 0); c.stroke();
    c.restore();
    c.beginPath(); c.rect(-.22, .46, .44, .30); body(c);     // terminal
  }},

  ship: { g:'sol', label:'Navire', draw(c){
    sil(c, [[0,-1],[.26,-.46],[.30,.62],[.20,.92],[0,.96]]);
    body(c);
    c.beginPath(); c.rect(-.17, -.18, .34, .52); body(c);    // superstructure
    c.beginPath(); c.moveTo(0, -.18); c.lineTo(0, -.58); c.stroke();
  }},

  carrier: { g:'sol', label:'Porte-avions', draw(c){
    sil(c, [[0,-1],[.40,-.52],[.44,.64],[.30,.92],[0,.96]]);
    body(c);
    c.save(); c.globalAlpha = .9; c.setLineDash([.12, .12]); // piste oblique
    c.beginPath(); c.moveTo(-.30, .80); c.lineTo(.12, -.82); c.stroke();
    c.restore();
    c.beginPath(); c.rect(.22, -.10, .18, .46); body(c);     // îlot
  }},

  farp: { g:'sol', label:'FARP', draw(c){
    c.beginPath(); c.rect(-.85, -.85, 1.7, 1.7); body(c);
    c.save(); c.lineWidth *= 1.6;                        // le H des hélisurfaces
    c.beginPath();
    c.moveTo(-.36, -.5); c.lineTo(-.36, .5); c.moveTo(.36, -.5); c.lineTo(.36, .5);
    c.moveTo(-.36, 0); c.lineTo(.36, 0);
    c.stroke(); c.restore();
  }},

  /* ---------------- marqueurs tactiques ---------------- */

  friend:  { g:'tac', label:'Ami', draw(c){
    c.beginPath(); c.arc(0, 0, .85, 0, 7); body(c);
  }},

  hostile: { g:'tac', label:'Hostile', draw(c){
    c.beginPath();
    c.moveTo(0,-.95); c.lineTo(.85,0); c.lineTo(0,.95); c.lineTo(-.85,0);
    c.closePath(); body(c);
  }},

  unknown: { g:'tac', label:'Inconnu', draw(c){
    c.beginPath(); c.rect(-.8, -.8, 1.6, 1.6); body(c);
    c.font = '700 1.1px ui-sans-serif, system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('?', 0, .04);
  }},

  wp: { g:'tac', label:'Waypoint', num:true, draw(c){
    c.beginPath();
    c.moveTo(0,-.8); c.lineTo(.8,0); c.lineTo(0,.8); c.lineTo(-.8,0);
    c.closePath(); body(c);
  }},

  target: { g:'tac', label:'Objectif', tile:.42, draw(c){
    c.beginPath(); c.arc(0, 0, .62, 0, 7); c.stroke();
    c.beginPath();
    c.moveTo(-1, 0); c.lineTo(1, 0); c.moveTo(0, -1); c.lineTo(0, 1);
    c.stroke();
  }},

  orbit: { g:'tac', label:'Orbite', draw(c){
    const w = .62, r = .42;
    c.beginPath();
    c.moveTo(-w, -r); c.lineTo(w, -r);
    c.arc(w, 0, r, -Math.PI / 2, Math.PI / 2);
    c.lineTo(-w, r);
    c.arc(-w, 0, r, Math.PI / 2, -Math.PI / 2);
    c.stroke();
  }},

  bullseye: { g:'tac', label:'Bullseye', tag:'BE', hit:1.1, draw(c){
    for (const r of [.34, .67, 1]){ c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); }
    c.beginPath(); c.moveTo(-1.15, 0); c.lineTo(1.15, 0); c.moveTo(0, -1.15); c.lineTo(0, 1.15); c.stroke();
    c.beginPath(); c.arc(0, 0, .1, 0, 7); c.fill();
  }},

  ip: { g:'tac', label:'Point IP', tag:'IP', draw(c){
    c.beginPath(); c.arc(0, 0, .5, 0, 7); body(c);
    c.beginPath();
    c.moveTo(-.9, -.9); c.lineTo(.9, .9); c.moveTo(.9, -.9); c.lineTo(-.9, .9);
    c.stroke();
  }},
};

/* ---------------- vues de profil (coupe) ----------------
   Nez vers la droite (+x), haut vers -y. Une forme sans vue de profil garde sa vue
   de dessus dans la coupe — c'est le cas des marqueurs tactiques, symétriques. */

function poly(c, pts){
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts) c.lineTo(x, y);
  c.closePath();
}
const rotUp = draw => c => { c.rotate(Math.PI / 2); draw(c); };   // vue de dessus couchée

const SIDES = {
  fighter(c){
    poly(c, [[1.05,.02],[.62,-.07],[.42,-.16],[.22,-.22],[.02,-.15],[-.55,-.12],[-.72,-.62],
             [-.92,-.62],[-.9,-.1],[-1,-.02],[-.98,.1],[-.55,.15],[.15,.17],[.55,.1]]);
    body(c);
    c.beginPath(); c.moveTo(-.55, .04); c.lineTo(-.98, .04); c.stroke();          // empennage
  },
  bomber(c){
    poly(c, [[1,0],[.85,-.1],[.6,-.14],[-.6,-.14],[-.78,-.7],[-.98,-.7],[-.95,-.1],
             [-1,.02],[-.9,.1],[.8,.1]]);
    body(c);
    for (const x of [.05, .32]){ c.beginPath(); c.rect(x, .12, .22, .1); body(c); } // réacteurs
  },
  tanker(c){
    poly(c, [[1,.02],[.9,-.1],[.7,-.16],[-.55,-.16],[-.75,-.66],[-.95,-.66],[-.92,-.12],
             [-1,-.05],[-.95,.09],[-.6,.13],[.85,.13]]);
    body(c);
    c.beginPath(); c.rect(.12, .15, .26, .11); body(c);
    c.beginPath(); c.moveTo(-.8, .1); c.lineTo(-1.28, .48); c.stroke();            // perche
  },
  airliner(c){
    poly(c, [[1,.02],[.9,-.1],[.7,-.15],[-.55,-.15],[-.75,-.65],[-.95,-.65],[-.92,-.12],
             [-1,-.05],[-.95,.08],[-.6,.12],[.85,.12]]);
    body(c);
    c.beginPath(); c.rect(.1, .14, .28, .12); body(c);
    c.save(); c.setLineDash([.03, .06]);                                            // hublots
    c.beginPath(); c.moveTo(.72, -.05); c.lineTo(-.5, -.05); c.stroke(); c.restore();
  },
  awacs(c){
    SIDES.airliner(c);
    c.beginPath(); c.moveTo(-.25, -.15); c.lineTo(-.2, -.36); c.moveTo(-.05, -.15); c.lineTo(-.1, -.36);
    c.stroke();
    c.beginPath(); c.ellipse(-.15, -.42, .46, .08, 0, 0, 7); body(c);               // rotodome
  },
  drone(c){
    poly(c, [[.95,.02],[.8,-.12],[.4,-.14],[-.7,-.06],[-.95,-.35],[-1,-.3],[-.85,0],
             [-.95,.2],[-.9,.22],[-.7,.06],[.7,.1]]);
    body(c);
    c.beginPath(); c.moveTo(-1.02, -.14); c.lineTo(-1.02, .14); c.stroke();        // hélice
  },
  helo(c){
    c.beginPath(); c.ellipse(.12, .06, .5, .3, 0, 0, 7); body(c);
    c.beginPath(); c.moveTo(-.34, -.02); c.lineTo(-1, -.12); c.lineTo(-1, -.02); c.lineTo(-.3, .1);
    c.closePath(); body(c);
    c.beginPath(); c.arc(-1, -.16, .16, 0, 7); c.stroke();                          // rotor arrière
    c.beginPath(); c.moveTo(.12, -.24); c.lineTo(.12, -.44);
    c.moveTo(-.85, -.46); c.lineTo(1.05, -.42);                                     // rotor principal
    c.moveTo(-.3, .5); c.lineTo(.62, .5); c.moveTo(-.1, .36); c.lineTo(-.14, .5);
    c.moveTo(.38, .36); c.lineTo(.42, .5);                                          // patins
    c.stroke();
  },
  missile: rotUp(c => SHAPES.missile.draw(c)),
  bomb:    rotUp(c => SHAPES.bomb.draw(c)),
  tank(c){
    poly(c, [[-.9,.1],[.9,.1],[.75,.45],[-.8,.45]]); body(c);
    poly(c, [[-.4,.1],[-.3,-.2],[.3,-.2],[.42,.1]]); body(c);
    c.beginPath(); c.moveTo(.3, -.07); c.lineTo(1.12, -.07); c.stroke();            // canon
    for (const x of [-.6, -.3, 0, .3, .58]){ c.beginPath(); c.arc(x, .38, .08, 0, 7); c.stroke(); }
  },
  ship(c){
    poly(c, [[-1,-.1],[1,-.1],[.8,.3],[-.9,.3]]); body(c);
    c.beginPath(); c.rect(-.35, -.42, .5, .32); body(c);
    c.beginPath(); c.moveTo(-.1, -.42); c.lineTo(-.1, -.8); c.stroke();
  },
  carrier(c){
    poly(c, [[-1,-.15],[1.05,-.15],[.85,.3],[-.95,.3]]); body(c);
    c.beginPath(); c.rect(.2, -.6, .25, .45); body(c);                              // îlot
    c.beginPath(); c.moveTo(.32, -.6); c.lineTo(.32, -.9); c.stroke();
  },
  radar(c){
    c.beginPath(); c.moveTo(0, .9); c.lineTo(0, -.05); c.stroke();                  // mât
    c.beginPath(); c.arc(-.1, -.2, .5, -Math.PI / 2.4, Math.PI / 2.4); body(c);     // antenne
    c.save(); c.globalAlpha = .8;
    for (const r of [.7, .9]){ c.beginPath(); c.arc(-.1, -.2, r, -.5, .5); c.stroke(); }
    c.restore();
  },
  sam(c){
    c.beginPath(); c.rect(-.9, .1, 1.8, .32); body(c);                              // véhicule
    for (const x of [-.6, -.1, .5]){ c.beginPath(); c.arc(x, .48, .1, 0, 7); c.stroke(); }
    c.beginPath(); c.moveTo(-.3, .1); c.lineTo(.1, -.12); c.stroke();               // rampe
    poly(c, [[-.25,-.02],[.75,-.62],[.82,-.55],[-.18,.05]]); body(c);               // missile
  },
};
for (const k in SIDES) if (SHAPES[k]) SHAPES[k].side = SIDES[k];

const GROUPS = [
  ['air', 'Aéronefs'],
  ['arm', 'Armement / Effets'],
  ['sol', 'Sol / Mer'],
  ['tac', 'Tactique'],
];

/* ================= bibliothèque OTAN, comme la carte F10 (lot 19) =================
   DCS dessine ses unités en symboles normalisés (MIL-STD-2525 / APP-6), thème « OTAN »
   de MissionEditor/data/NewMap/images/nato/ : chaque icône est tracée en noir sur un fond
   blanc que le jeu teint à la couleur de la coalition, et le cadre est le même pour les
   deux camps. Le tableau ne publie aucune de ces images : il fait dessiner la norme par
   milsymbol (vendor/), avec le même rendu — fond à la couleur de l'objet, trait noir.

   Champs lus par board.js :
     nato      le code du symbole (SIDC), MIL-STD-2525C ou, à 20 chiffres, 2525D
     natoDraw  à défaut de code, un dessin du projet d'après l'icône DCS (FARP)
     dcs       la clé de l'icône DCS reproduite (P00910000xx de classifier.lua)
     dir       la flèche de direction de la norme suit le cap posé
     ring      cercle d'engagement autour du symbole, comme la silhouette du SAM
     natoK     taille propre du symbole, quand la norme le dessine plus grand (poste de commandement)
     natoOnly  famille DCS sans silhouette : dans la palette en OTAN seulement ; posée puis
               vue en silhouettes, elle prend le dessin de `like` et son repère `silTag`
   Chaque code, chaque clé et chaque écart à l'icône DCS sont dans docs/SYMBOLES.md. */

const NATO_OF = {
  fighter:  ['SFAPMFF--------', '0024', true],
  bomber:   ['SFAPMFB--------', '0027', true],
  tanker:   ['SFAPMFK--------', '0064', true],
  airliner: ['SFAPC----------', 'Aircraft_civilian', true],
  helo:     ['SFAPMHU--------', '0020', true],
  awacs:    ['SFAPMFRW-------', '0056', true],
  drone:    ['SFAPMFQ--------', '0023', true],
  tank:     ['SFGPUCA--------', '0001', true],
  radar:    ['10031000001301005000', '0036', false],
  sam:      ['SFGPUCDM-------', '0009', false],
  ship:     ['SFSPCLDD-------', '0068', true],
  carrier:  ['SFSPCLCV-------', '0065', true],
};
for (const [k, [nato, dcs, dir]] of Object.entries(NATO_OF)) Object.assign(SHAPES[k], { nato, dcs, dir });
SHAPES.sam.ring = true;

/* le FARP : DCS le montre en cercle et T, hors norme (images/common/, clé 0022) */
SHAPES.farp.dcs = '0022';
SHAPES.farp.natoDraw = (c, halo) => {
  c.beginPath(); c.arc(0, 0, .74, 0, 7);
  if (halo){ c.save(); c.strokeStyle = halo; c.lineWidth *= 2.6; c.stroke(); c.restore(); }
  c.fill();
  c.save(); c.strokeStyle = '#000';
  c.stroke();
  c.beginPath(); c.moveTo(-.38, -.36); c.lineTo(.38, -.36); c.moveTo(0, -.36); c.lineTo(0, .44);
  c.lineWidth *= 1.5; c.stroke();
  c.restore();
};

/* les familles de la carte DCS que le tableau n'avait pas : relevées dans classifier.lua */
const DCS_FAMILIES = {
  attack:      { g:'air', label:"Avion d'attaque",         like:'fighter',  silTag:'A',   nato:'SFAPMFA--------', dcs:'0025', dir:true },
  cargo:       { g:'air', label:'Avion de transport',      like:'airliner', silTag:'C',   nato:'SFAPMFC--------', dcs:'0029', dir:true },
  recon:       { g:'air', label:'Reconnaissance',          like:'fighter',  silTag:'R',   nato:'SFAPMFR--------', dcs:'0026', dir:true },
  attack_helo: { g:'air', label:"Hélicoptère d'attaque",   like:'helo',     silTag:'A',   nato:'SFAPMHA--------', dcs:'0021', dir:true },
  ifv:         { g:'sol', label:'Véhicule de combat',      like:'tank',     silTag:'VCI', nato:'SFGPUCIZ-------', dcs:'0002', dir:true },
  artillery:   { g:'sol', label:'Artillerie automotrice',  like:'tank',     silTag:'ART', nato:'SFGPUCFHE------', dcs:'0006', dir:true },
  mlrs:        { g:'sol', label:'Lance-roquettes',         like:'tank',     silTag:'LRM', nato:'SFGPUCFRMS-----', dcs:'0007', dir:true },
  truck:       { g:'sol', label:'Véhicule à roues',        like:'tank',     silTag:'VÉH', nato:'10031000001634000000', dcs:'0005', dir:true },
  aaa:         { g:'sol', label:'Canons antiaériens',      like:'radar',    silTag:'AAA', nato:'SFGPUCDG-------', dcs:'0015', dir:false },
  sam_short:   { g:'sol', label:'SAM courte portée',       like:'sam',      silTag:'SAM-CP', nato:'SFGPUCDML------', dcs:'0011', dir:false, ring:true },
  sam_med:     { g:'sol', label:'SAM moyenne portée',      like:'sam',      silTag:'SAM-MP', nato:'SFGPUCDMM------', dcs:'0012', dir:false, ring:true },
  sam_long:    { g:'sol', label:'SAM longue portée',       like:'sam',      silTag:'SAM-LP', nato:'SFGPUCDMH------', dcs:'0013', dir:false, ring:true },
  cp:          { g:'sol', label:'Poste de commandement',   like:'friend',   silTag:'PC',  natoK:.8, nato:'SFGPUH---------', dcs:'0071', dir:false },
  ew:          { g:'sol', label:'Guerre électronique',     like:'radar',    silTag:'GE',  nato:'SFGPUUMSE------', dcs:'0028', dir:false },
  sub:         { g:'sol', label:'Sous-marin',              like:'ship',     silTag:'SM',  nato:'SFUPS----------', dcs:'0038', dir:true },
};
for (const [k, f] of Object.entries(DCS_FAMILIES)){
  const base = SHAPES[f.like];
  SHAPES[k] = { s0: base.s0, tile: base.tile, hit: base.hit, ldy: base.ldy, ...f, natoOnly: true,
                draw: (c, o) => base.draw(c, o), ...(base.side && { side: base.side }) };
}

/* ================= kit radar =================
   Écrans de bord et symbologie radar, module par module. Tout est dessiné ici, en
   vecteurs, d'après le manuel ED du module : aucune capture du jeu, aucune image de
   manuel. Chaque libellé et chaque symbole cite sa page dans docs/RADAR.md.

   Champs propres à ces formes, lus par board.js :
     upright  la forme ne tourne jamais ; seule sa tige (`stem`) suit le cap `a`
     stem     [début, fin] de la tige de cap, dans le repère [-1, 1]
     fixed    le geste de pose oriente sans redimensionner ; la poignée redimensionne
     under    se pose sous les autres objets, et reste traversable quand une forme est choisie
     box      désignation carrée (demi-côté, en unités du repère) au lieu d'un disque
     smax     échelle maximale (6 par défaut)
     col      couleur donnée à la pose : identité d'un HAFU, encre d'un écran
     track    une piste : peut porter une marque (`mark` sur l'objet) de son module
     mark     la vignette ne pose rien : elle marque la piste touchée (L&S, DT2, cible désignée)
     over     se pose par-dessus ce qu'on touche, sans le saisir (curseur)
     tileA    angle de la vignette, quand une forme se reconnaît à son inclinaison
     scope    écran : page, échelle et azimut par défaut, valeurs proposées au clavier,
              libellés des boutons ; `area` la zone tactique [gauche, haut, droite, bas],
              `span` sa demi-largeur en degrés, `cone(az)` le demi-balayage d'un réglage
              — lus aussi par la vue radar liée */

/* les 20 boutons d'un écran de F/A-18C, numérotés comme dans le manuel ED :
   PB1 → PB5 à gauche de bas en haut, PB6 → PB10 en haut de gauche à droite,
   PB11 → PB15 à droite de haut en bas, PB16 → PB20 en bas de droite à gauche.
   Le MFD du F-16C a ses 20 boutons aux mêmes places, numérotés autrement (MFD_OSB). */
const DDI_PB = (() => {
  const p = {}, k = [-.52, -.26, 0, .26, .52];
  k.forEach((v, i) => {
    p[5 - i]  = { x: -.935, y: v };
    p[6 + i]  = { x: v, y: -.935 };
    p[11 + i] = { x: .935, y: v };
    p[20 - i] = { x: v, y: .935 };
  });
  return p;
})();
/* le verre, mesuré sur les figures (lot 23) : ±0,79 quand les boutons sont à ±0,935 */
const GLASS = .79;

/* place des libellés du F/A-18C, mesurée sur la figure 82 (p. 162) : un libellé n'est pas
   centré sur son bouton, il est rentré vers le verre. [x, y, alignement] */
const DDI_LBL = {
  1: [-.73, .46, 'left'], 2: [-.73, .237, 'left'], 3: [-.73, 0, 'left'], 4: [-.73, -.25, 'left'], 5: [-.73, -.504, 'left'],
  6: [-.47, -.735], 7: [-.25, -.735], 8: [0, -.735], 9: [.25, -.735], 10: [.5, -.735],
  11: [.70, -.481], 12: [.70, -.278], 13: [.70, -.009], 14: [.70, .241], 15: [.70, .485],
  16: [.493, .718], 17: [.246, .718], 18: [0, .718], 19: [-.254, .718], 20: [-.503, .718],
};

/* texte dans le repère [-1, 1] : une police de 10 px ramenée à `size` unités ;
   « \n » passe à la ligne. La police des écrans est étroite : celle du poste est
   resserrée à la chasse mesurée sur les figures. */
const SQUEEZE = .82;
function scopeText(c, s, x, y, al = 'center', size = .062){
  const lines = s.split('\n');
  lines.forEach((t, i) => {
    c.save();
    c.translate(x, y + (i - (lines.length - 1) / 2) * size * 1.15);
    c.scale(size / 10 * SQUEEZE, size / 10);
    c.font = '600 10px ui-monospace, Consolas, monospace';
    c.textAlign = al; c.textBaseline = 'middle';
    c.fillText(t, 0, 0);
    c.restore();
  });
}

/* libellé d'un bouton, comme sur les figures : « ^ » en tête l'écrit en colonne (SET,
   RSET, NCTR du F/A-18C), « | » y sépare deux colonnes (RDR|PRI) ; une ligne entre
   crochets est encadrée, l'option choisie (« [HITS] ») ; « # » en tête l'écrit en vidéo
   inverse, le format affiché du F-16C. `bg` efface d'abord le fond sous le libellé : le
   cadre du F-16C passe derrière ses libellés. */
const CW = .6 * SQUEEZE;                     // chasse d'un caractère, en fraction de la taille
function scopeLabel(c, s, x, y, al = 'center', bg = null, size = .062){
  const vertical = s.startsWith('^'), inverse = s.startsWith('#');
  if (vertical || inverse) s = s.slice(1);
  if (vertical){
    const cols = s.split('|'), step = size * .75, cw = size * CW;
    cols.forEach((col, j) => {
      const boxed = /^\[.*\]$/.test(col), t = col.replace(/^\[|\]$/g, '');
      const cx = x + (j - (cols.length - 1) / 2) * cw * 1.6, h = t.length * step;
      [...t].forEach((ch, i) => scopeText(c, ch, cx, y + (i - (t.length - 1) / 2) * step, 'center', size));
      if (boxed){ c.save(); c.lineWidth *= .8; c.strokeRect(cx - cw * .75, y - h / 2 - size * .1, cw * 1.5, h + size * .2); c.restore(); }
    });
    return;
  }
  const lines = s.split('\n'), step = size * 1.15;
  lines.forEach((raw, i) => {
    const box = /^\[.*\]$/.test(raw), t = raw.replace(/^\[|\]$/g, '');
    const ly = y + (i - (lines.length - 1) / 2) * step;
    const w = t.length * size * CW, x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
    if (bg || inverse){
      c.save(); c.fillStyle = inverse ? c.strokeStyle : bg;
      c.fillRect(x0 - size * .25, ly - size * .6, w + size * .5, size * 1.2); c.restore();
    }
    if (inverse){ c.save(); c.fillStyle = HALO; scopeText(c, t, x, ly, al, size); c.restore(); }
    else scopeText(c, t, x, ly, al, size);
    if (box){ c.save(); c.lineWidth *= .8; c.strokeRect(x0 - size * .15, ly - size * .55, w + size * .3, size * 1.1); c.restore(); }
  });
}

/* boîtier, boutons et verre : gris, indépendants de la couleur choisie */
function ddiBezel(c){
  const lw = c.lineWidth;
  c.save();
  c.lineWidth = lw * .5;
  c.fillStyle = '#161D25'; c.strokeStyle = '#3C4854';
  c.beginPath(); c.roundRect(-1, -1, 2, 2, .09); c.fill(); c.stroke();
  c.fillStyle = '#26303A';
  for (const n in DDI_PB){
    const b = DDI_PB[n];
    c.beginPath(); c.roundRect(b.x - .045, b.y - .045, .09, .09, .02); c.fill(); c.stroke();
  }
  c.fillStyle = HALO;
  c.beginPath(); c.roundRect(-GLASS, -GLASS, 2 * GLASS, 2 * GLASS, .05); c.fill();
  c.restore();
}

/* page RDR ATTK air-air du F/A-18C, en B-scope : la distance croît vers le haut,
   l'azimut de gauche à droite (DCS F/A-18C Early Access Guide, p. 157-177). Les places
   sont mesurées sur les figures 82 (RWS, p. 162), 83 (STT, p. 165) et p. 175 (TWS). */
function fa18Attk(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  ddiBezel(c);
  const [L, T, R, B] = sc.area;                            // zone tactique
  c.save();
  c.lineWidth = lw * .35;
  c.strokeRect(L, T, R - L, B - T);
  c.beginPath(); c.moveTo(0, T); c.lineTo(0, B); c.stroke();       // B-sweep (p. 157)
  if (o.mini){ c.restore(); return; }

  /* bandeau du haut, et graduations d'azimut tous les 30°, en haut et en bas (fig. 82) */
  const band = T + .07, xAz = d => d / sc.span * R;
  c.beginPath(); c.moveTo(L, band); c.lineTo(R, band);
  for (const d of [-60, -30, 0, 30, 60]){
    c.moveTo(xAz(d), band); c.lineTo(xAz(d), band + .078);
    c.moveTo(xAz(d), B); c.lineTo(xAz(d), B - .07);
  }
  c.stroke();
  /* échelle des distances, bord droit : repères au quart, à la moitié, aux trois
     quarts (p. 157) ; valeur choisie à droite du cadre (p. 162, n° 8) */
  for (const f of [.25, .5, .75]){
    const y = B - (B - T) * f;
    c.beginPath(); c.moveTo(R, y); c.lineTo(R - .074, y); c.stroke();
  }
  scopeText(c, String(o.rng ?? sc.rng), R + .016, T + .006, 'left');
  scopeText(c, '0', R + .03, B - .015, 'left', .05);
  /* échelle d'élévation, bord gauche : sept repères, longs aux bouts et au milieu, et
     le chevron d'élévation d'antenne (p. 157 ; places mesurées sur la figure 82) */
  const ey = k => -.013 + k * .101;
  c.beginPath();
  for (let k = -3; k <= 3; k++){
    const long = k === -3 || k === 0 || k === 3;
    c.moveTo(L - (long ? .041 : .022), ey(k)); c.lineTo(long ? L + .081 : L, ey(k));
  }
  c.stroke();
  c.beginPath(); c.moveTo(L + .08, ey(0) - .045); c.lineTo(L + .005, ey(0) - .015); c.lineTo(L + .08, ey(0) + .015); c.stroke();
  if (sc.page !== 'rws'){      // second chevron, à droite, sur les figures TWS et STT
    c.beginPath(); c.moveTo(R - .1, ey(0) - .03); c.lineTo(R - .06, ey(0)); c.lineTo(R - .1, ey(0) + .03); c.stroke();
  }
  /* ligne d'horizon, bouts tournés vers le bas, et vecteur vitesse, reflets du HUD à
     position fixe (p. 163, n° 18-19) */
  const hy = -.217;
  c.beginPath();
  c.moveTo(-.296, hy + .06); c.lineTo(-.296, hy); c.lineTo(-.093, hy);
  c.moveTo(.093, hy); c.lineTo(.296, hy); c.lineTo(.296, hy + .06);
  c.stroke();
  c.beginPath(); c.arc(0, hy, .025, 0, 7); c.stroke();
  c.beginPath();
  c.moveTo(-.07, hy); c.lineTo(-.025, hy); c.moveTo(.025, hy); c.lineTo(.07, hy);
  c.moveTo(0, hy - .025); c.lineTo(0, hy - .055);
  c.stroke();
  /* radar en émission (p. 162, n° 1) ; losange pointé : le TDC est sur cet écran
     (p. 162, n° 2 ; p. 168) */
  scopeText(c, 'OPR', -.689, -.69, 'left');
  const dx = .654, dy = -.679;
  c.beginPath(); c.moveTo(dx, dy - .024); c.lineTo(dx + .024, dy); c.lineTo(dx, dy + .024); c.lineTo(dx - .024, dy); c.closePath(); c.stroke();
  c.beginPath(); c.arc(dx, dy, .007, 0, 7); c.fill();
  /* champs de données, à leur place, avec le texte de la figure : ils changent à chaque
     vol (cap, arme, vitesse, altitude, relèvements), l'étiquette d'un objet porte les vrais */
  for (const [t, x, y, al] of sc.data || []) scopeText(c, t, x, y, al || 'center', .056);
  /* libellés des boutons de la page */
  for (const [n, t] of Object.entries(sc.pb)){
    const [x, y, al] = DDI_LBL[n];
    scopeLabel(c, t.replace('{az}', o.az ?? sc.az), x, y, al || 'center');
  }
  c.restore();
}

/* marques d'une piste : étoile L&S et losange DT2 inscrits dans le HAFU du F/A-18C
   (p. 176), cercle de la cible désignée du F-16C (p. 404, 415). Au trait d'un tableau,
   bien plus épais que celui de l'écran, les jambes d'un chevron hostile couvraient
   l'étoile et le losange : un liseré de la couleur du fond d'écran les en détache. */
const HALO = '#040806';
function inked(c, path, fill){
  const lw = c.lineWidth;
  c.save(); path(); c.strokeStyle = HALO; c.lineWidth = lw * (fill ? .9 : 1.5); c.stroke(); c.restore();
  path();
  if (fill) c.fill(); else { c.save(); c.lineWidth = lw * .6; c.stroke(); c.restore(); }
}
const MARKS = {
  ls(c){
    inked(c, () => {
      c.beginPath();
      for (let i = 0; i < 10; i++){
        const r = i % 2 ? .12 : .29, t = -Math.PI / 2 + i * Math.PI / 5;
        c.lineTo(Math.cos(t) * r, -.14 + Math.sin(t) * r);
      }
      c.closePath();
    }, true);
  },
  dt2(c){
    inked(c, () => { c.beginPath(); c.moveTo(0, -.41); c.lineTo(.27, -.14); c.lineTo(0, .13); c.lineTo(-.27, -.14); c.closePath(); });
  },
  bug(c){ c.beginPath(); c.arc(0, 0, .72, 0, 7); c.stroke(); },
};
/* posée par paintSym en dernier, par-dessus la tige de cap */
const withMark = (c, o) => { if (o && MARKS[o.mark]) MARKS[o.mark](c); };
/* le B-scope du F/A-18C couvre le cône de 140° que l'antenne peut balayer (p. 172) ;
   un réglage d'azimut en donne la largeur totale (p. 163, n° 15) */
const FA18_B = { area: [-.6, -.62, .6, .6], span: 70, cone: az => az / 2 };

/* champs de données des figures, avec leur texte d'exemple : [texte, x, y, alignement].
   Fig. 82 (RWS) : cible C11 et relèvement bullseye du curseur, cap (n° 6), arme (n° 7),
   BRA, vitesse et Mach (n° 16), bullseye de l'appareil, altitude (n° 13). TWS (p. 175)
   et STT (fig. 83) : les champs que leurs figures montrent. */
const FA18_DATA = (() => {
  const top = [['C11', -.694, -.653, 'left'], ['7M 0', .542, -.65]];
  const low = [['7', -.643, .574], ['451', -.522, .62], ['0.78', -.596, .661, 'left'], ['7080', .589, .635, 'right']];
  return {
    rws: [...top, ...low, ['345°/25.0', -.389, -.657], ['057°', .009, -.657], ['BRA  67°/21.9', -.54, .487, 'left'],
          ['300°/31.1', -.007, .643], ['4216', 0, .707]],
    tws: [...top, ...low, ['123°', .009, -.657], ['4635', 0, .707]],
    stt: [...top, ...low, ['330°', .009, -.657], ['155°', -.5, -.585, 'left'], ['3015', 0, .707]],
  };
})();

/* HAFU, moitié haute : l'identification par les capteurs de bord (p. 209-210) */
const hafu = (label, col, draw) => ({ g:'fa18', label, col, track:true, upright:true, fixed:true, stem:[.2, 1.2],
  s0:.55, tile:.5, draw(c){ draw(c); } });

Object.assign(SHAPES, {
  /* ---------------- radar F/A-18C ---------------- */
  fa18_rws: { g:'fa18', label:'Écran RWS', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { ...FA18_B, page:'rws', rng:40, az:140, ranges:[5, 10, 20, 40, 80, 160], azs:[20, 40, 60, 80, 140],
             pb: { 1:'HI\nINTL', 2:'^RDR|PRI', 5:'RWS', 6:'4B 1', 7:'SIL', 8:'ERASE', 11:'↑', 12:'↓', 13:'^SET',
                   14:'^RSET', 15:'^[NCTR]', 16:'DATA', 17:'CHAN', 19:'{az}°', 20:'MODE' },
             data: FA18_DATA.rws } },
  fa18_tws: { g:'fa18', label:'Écran TWS', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { ...FA18_B, page:'tws', rng:40, az:80, ranges:[5, 10, 20, 40, 80, 160], azs:[20, 40, 60, 80],
             pb: { 1:'MED\nINTL', 5:'TWS', 6:'2B 2', 7:'SIL', 8:'[HITS]', 9:'RAID', 11:'↑', 12:'↓',
                   13:'[AUTO]\nMAN', 14:'^RSET', 15:'^[NCTR]', 16:'DATA', 19:'{az}°', 20:'EXP' },
             data: FA18_DATA.tws } },
  fa18_stt: { g:'fa18', label:'Écran STT', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { ...FA18_B, page:'stt', rng:40, ranges:[5, 10, 20, 40, 80, 160],
             pb: { 1:'HI\nINTL', 2:'^RDR|PRI', 5:'RWS', 6:'2B 1', 8:'ERASE', 14:'^RSET', 15:'^[NCTR]',
                   16:'DATA', 17:'CHAN', 20:'MODE' },
             data: FA18_DATA.stt } },

  /* contact brut : une brique pleine (p. 158). raw : désigné, il devient une piste */
  fa18_brick: { g:'fa18', label:'Brique', raw:true, upright:true, fixed:true, s0:.5, tile:.7, col:'#34D399', draw(c){
    c.fillRect(-.45, -.22, .9, .44);
  }},
  /* hémisphère = ami, crochet = inconnu, chevron = hostile ; la tige donne le cap (p. 209) */
  fa18_hafu_f: hafu('Ami', '#34D399', c => { c.beginPath(); c.arc(0, 0, .55, Math.PI, 0); c.stroke(); }),
  fa18_hafu_u: hafu('Inconnu', '#D1A94A', c => {
    c.beginPath(); c.moveTo(-.5, .05); c.lineTo(-.5, -.5); c.lineTo(.5, -.5); c.lineTo(.5, .05); c.stroke();
  }),
  fa18_hafu_h: hafu('Hostile', '#FF4D4D', c => {
    c.beginPath(); c.moveTo(-.55, .05); c.lineTo(0, -.6); c.lineTo(.55, .05); c.stroke();
  }),
  /* L&S, piste prioritaire, et DT2, deuxième piste désignée : des états de la piste,
     pas des objets. La vignette marque le HAFU touché (p. 173, 176-177). Hors d'une
     piste, elle désigne un écho : sa piste HAFU, inconnue faute d'identification, porte
     la marque (p. 176) — newTrack. Les deux ne partagent jamais une piste : désigner la
     DT2 les échange (p. 173) ; keep : la L&S n'est jamais retirée par une autre marque */
  fa18_ls: { g:'fa18', label:'L&S', mark:'ls', keep:true, newTrack:'fa18_hafu_u', tile:.5, draw(c){
    c.beginPath();
    for (let i = 0; i < 10; i++){
      const r = i % 2 ? .18 : .45, t = -Math.PI / 2 + i * Math.PI / 5;
      c.lineTo(Math.cos(t) * r, Math.sin(t) * r);
    }
    c.closePath(); c.fill();
  }},
  fa18_dt2: { g:'fa18', label:'DT2', mark:'dt2', newTrack:'fa18_hafu_u', tile:.5, draw(c){
    c.beginPath(); c.moveTo(0, -.42); c.lineTo(.42, 0); c.lineTo(0, .42); c.lineTo(-.42, 0); c.closePath(); c.stroke();
  }},
  /* curseur d'acquisition du TDC : deux traits verticaux parallèles, l'altitude couverte
     par le balayage au-dessus et au-dessous, en milliers de pieds (p. 164, n° 21 ;
     proportions et texte d'exemple de la figure 82) */
  fa18_tdc: { g:'fa18', label:'Curseur TDC', upright:true, fixed:true, over:true, s0:.6, tile:.55, col:'#D1A94A', draw(c, o){
    c.beginPath(); c.moveTo(-.35, -.32); c.lineTo(-.35, .32); c.moveTo(.35, -.32); c.lineTo(.35, .32); c.stroke();
    if (o && !o.mini){ scopeText(c, '16', 0, -.5, 'center', .3); scopeText(c, '-2', 0, .52, 'center', .3); }
  }},
});
GROUPS.push(['fa18', 'Radar air-air', 'F/A-18C']);           // troisième champ : le module (lot 23)

/* ---------------- radar F-16C ----------------
   DCS F-16C Early Access Guide, « APG-68 Fire Control Radar », p. 374-420. Lu pour
   lui-même : rien n'est repris du F/A-18C. */

/* les 20 boutons d'un MFD de F-16C, numérotés comme dans le manuel ED : OSB 1 → 5 en
   haut de gauche à droite, 6 → 10 à droite de haut en bas, 16 → 20 à gauche de bas en
   haut (p. 394-396, 410). Le rang du bas, 11 → 15 de droite à gauche, n'est recoupé par
   aucun texte : ses libellés sont placés comme sur la figure p. 394. Places des libellés
   mesurées sur cette figure : ceux du haut et du bas sont posés sur le cadre du format. */
const MFD_OSB = (() => {
  const p = {}, top = [-.464, -.233, 0, .228, .458], bot = [-.456, -.228, .005, .241, .464], k = [-.52, -.26, 0, .26, .52];
  for (let i = 0; i < 5; i++){
    p[1 + i]  = { lx: top[i], ly: -.668, al: 'center', on: true };
    p[6 + i]  = { lx: .70, ly: k[i] + .093, al: 'right' };
    p[15 - i] = { lx: bot[i], ly: .665, al: 'center', on: true };
    p[20 - i] = { lx: -.678, ly: i === 3 ? .228 : k[i], al: 'left' };   // « 4B » un peu plus haut (figure)
  }
  return p;
})();

/* page FCR air-air, en B-scope : l'appareil au bas de l'écran, la distance vers le
   haut, l'azimut de gauche à droite (p. 394). Libellés en blanc, échelles à la couleur
   de l'objet. Les places sont mesurées sur les figures p. 394, 397 et 413. */
function f16Fcr(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle, WH = '#E6EDF5';
  ddiBezel(c);
  const [L, T, R, B] = sc.area, hy = (T + B) / 2;
  c.save();
  c.lineWidth = lw * .35;
  /* cadre du format, blanc ; à gauche il s'interrompt aux libellés, à droite à CONT */
  c.strokeStyle = WH; c.fillStyle = WH;
  c.beginPath();
  c.moveTo(L, T); c.lineTo(R, T); c.moveTo(L, B); c.lineTo(R, B);
  if (!o.mini){
    c.moveTo(R, T); c.lineTo(R, -.43); c.moveTo(R, -.37); c.lineTo(R, B);
    for (const [y0, y1] of [[T, -.47], [-.23, -.05], [.056, .177], [.284, .316]]){ c.moveTo(L, y0); c.lineTo(L, y1); }
  }
  c.stroke();
  c.strokeStyle = ink; c.fillStyle = ink;
  /* ligne d'horizon, deux repères tournés vers le sol à ses bouts (p. 396, n° 10) */
  c.beginPath();
  c.moveTo(-.354, hy + .025); c.lineTo(-.354, hy); c.lineTo(.354, hy); c.lineTo(.354, hy + .025);
  c.stroke();
  if (o.mini){ c.restore(); return; }

  /* échelle d'élévation d'antenne, en tirets, repère majeur à 0°, et la position de
     l'antenne en « T » couché (p. 397, n° 20 ; tirets comptés sur les figures) */
  c.beginPath();
  for (let k = -3; k <= 3; k++){
    const yy = hy + k * .1166;
    c.moveTo(k ? -.571 : -.60, yy); c.lineTo(-.536, yy);
  }
  c.moveTo(-.63, hy); c.lineTo(-.585, hy); c.moveTo(-.585, hy - .025); c.lineTo(-.585, hy + .025);
  c.stroke();
  /* repères de distance à ¼, ½ et ¾ de l'échelle, bord droit (p. 397, n° 21) */
  c.beginPath();
  for (const f of [.25, .5, .75]){
    const yy = B - (B - T) * f;
    c.moveTo(R - .04, yy); c.lineTo(R, yy);
  }
  c.stroke();
  /* échelle d'azimut d'antenne, au bas : sept repères, et la position de l'antenne
     (p. 397, n° 23 ; places mesurées sur la figure p. 394) */
  c.beginPath();
  for (let k = -3; k <= 3; k++){ if (k) { c.moveTo(k * .117, .566); c.lineTo(k * .117, .611); } }
  c.moveTo(-.177, .625); c.lineTo(-.117, .625); c.moveTo(-.147, .625); c.lineTo(-.147, .66);
  c.stroke();
  /* largeur de balayage (p. 395-396, n° 8) : A6 = ±60°, toute la largeur ; A3 = ±30°
     et A1 = ±10° tracent leurs limites. Ici centrées : dans l'avion, elles suivent le
     curseur d'acquisition. */
  const az = o.az ?? sc.az;
  if (az < 6){
    const hw = R * az / 6;
    c.beginPath(); c.moveTo(-hw, T + .06); c.lineTo(-hw, B - .15); c.moveTo(hw, T + .06); c.lineTo(hw, B - .15); c.stroke();
  }
  /* symbole de référence de l'appareil, en bas à gauche (p. 394, n° 14) */
  c.beginPath();
  c.moveTo(-.69, .55); c.lineTo(-.69, .63);
  c.moveTo(-.672, .585); c.lineTo(-.65, .628); c.lineTo(-.628, .585); c.lineTo(-.606, .628); c.lineTo(-.584, .585); c.lineTo(-.54, .585);
  c.stroke();
  /* libellés : échelle entre ses flèches OSB 20 et 19 (p. 395, n° 7), puis les boutons */
  c.strokeStyle = WH; c.fillStyle = WH;
  const tri = (yy, up) => {
    const d = up ? -.024 : .024;
    c.beginPath(); c.moveTo(-.693, yy - d); c.lineTo(-.593, yy - d); c.lineTo(-.643, yy + d); c.closePath(); c.stroke();
  };
  tri(-.418, true); tri(-.27, false);
  scopeText(c, String(o.rng ?? sc.rng), -.643, -.344, 'center');
  /* champs de données, avec le texte de la figure p. 394 : relèvement et distance du
     curseur (n° 12), mode AIFF (n° 13), désencombrement de la liaison (n° 15), état de
     l'arme (n° 16) */
  for (const [t, x, y, al] of sc.data || []) scopeText(c, t, x, y, al || 'center', .056);
  for (const [n, t] of Object.entries(sc.pb)){
    const b = MFD_OSB[n];
    scopeLabel(c, t.replace('{az}', az), b.lx, b.ly, b.al, b.on ? HALO : null);
  }
  c.restore();
}

/* piste TWS : le symbole entier tourne avec le cap sol de la cible, un trait figure
   son nez (p. 404, 414) */
function f16Track(c){
  c.fillRect(-.32, -.32, .64, .64);
  c.beginPath(); c.moveTo(0, -.32); c.lineTo(0, -.95); c.stroke();
}

const f16Page = (label, sub, bottom) => ({ g:'f16', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#4FC3F7', draw: f16Fcr,
  /* A6 couvre toute la largeur, ±60° ; A3 ±30°, A1 ±10° (p. 395-396, n° 8) */
  scope: { area: [-.70, -.694, .70, .692], span: 60, cone: az => az * 10,
           page: sub.toLowerCase(), rng:40, az:6, ranges:[5, 10, 20, 40, 80, 160], azs:[1, 3, 6],
           pb: { 1:'CRM', 2:sub, 3:'NORM', 4:'OVRD', 5:'CNTL', 6:'CONT', 18:'A\n{az}', 17:'4\nB',
                 15:bottom[0], 14:bottom[1], 13:bottom[2], 12:bottom[3], 11:bottom[4] },
           data: [['042 11', -.684, .346, 'left'], ['M4', -.684, .418, 'left'], ['NONE', -.523, .606, 'left'], ['RDY', 0, .585]] } });

Object.assign(SHAPES, {
  /* le format affiché, FCR, en vidéo inverse ; au bas, les formats affectés aux boutons
     tels que sur la figure de chaque page (p. 394 ; p. 413) */
  f16_rws: f16Page('Écran FCR RWS', 'RWS', ['SWAP', '#FCR', 'TEST', 'DTE', 'DCLT']),
  f16_tws: f16Page('Écran FCR TWS', 'TWS', ['SWAP', '#FCR', 'FLCS', 'TEST', 'DCLT']),
  /* cible de recherche : carré plein ; la « hot line » dessous = chaude, elle vient
     vers nous ; dessus = froide, elle s'éloigne (p. 404) */
  f16_hot: { g:'f16', label:'Cible chaude', raw:true, rawA:Math.PI, upright:true, fixed:true, s0:.5, tile:.55, col:'#E6EDF5', draw(c){
    c.fillRect(-.3, -.3, .6, .6); c.beginPath(); c.moveTo(0, .3); c.lineTo(0, .8); c.stroke();
  }},
  f16_cold: { g:'f16', label:'Cible froide', raw:true, rawA:0, upright:true, fixed:true, s0:.5, tile:.55, col:'#E6EDF5', draw(c){
    c.fillRect(-.3, -.3, .6, .6); c.beginPath(); c.moveTo(0, -.3); c.lineTo(0, -.8); c.stroke();
  }},
  /* piste en jaune, piste système en blanc (p. 404) */
  f16_track: { g:'f16', label:'Piste TWS', track:true, fixed:true, s0:.55, tile:.5, tileA:-.7, col:'#D1A94A', draw: f16Track },
  f16_systrack: { g:'f16', label:'Piste système', track:true, fixed:true, s0:.55, tile:.5, tileA:-.7, col:'#E6EDF5', draw: f16Track },
  /* cible désignée (bugged, FCR TOI) : un cercle autour de la piste, une seule (p. 404, 415).
     Désignée hors d'une piste, une cible de recherche monte à la piste système qui la
     porte (p. 416 : recherche → piste → système → désignée) ; rawA, son cap : une cible
     chaude vient vers l'appareil */
  f16_bug: { g:'f16', label:'Désignée', mark:'bug', newTrack:'f16_systrack', tile:.5, draw(c){
    c.beginPath(); c.arc(0, 0, .72, 0, 7); c.stroke(); c.fillRect(-.3, -.3, .6, .6);
  }},
  /* curseur d'acquisition A-A : deux traits verticaux parallèles, l'altitude couverte
     en haut à droite, la basse en bleu dessous (p. 396, n° 11 ; figure p. 394) */
  f16_cursor: { g:'f16', label:'Curseur A-A', upright:true, fixed:true, over:true, s0:.6, tile:.55, col:'#E6EDF5', draw(c, o){
    c.beginPath(); c.moveTo(-.35, -.35); c.lineTo(-.35, .35); c.moveTo(.35, -.35); c.lineTo(.35, .35); c.stroke();
    if (o && !o.mini){
      scopeText(c, '31', .5, -.4, 'left', .4);
      c.save(); c.fillStyle = '#4FC3F7'; scopeText(c, '15', .5, .46, 'left', .4); c.restore();
    }
  }},
  /* brouillage : une paire de chevrons jaunes, à l'azimut des émissions (p. 411) */
  f16_jam: { g:'f16', label:'Brouillage', upright:true, fixed:true, s0:.55, tile:.5, col:'#D1A94A', draw(c){
    c.beginPath();
    c.moveTo(-.45, -.05); c.lineTo(0, -.45); c.lineTo(.45, -.05);
    c.moveTo(-.45, .35); c.lineTo(0, -.05); c.lineTo(.45, .35);
    c.stroke();
  }},
  /* bullseye (p. 397, n° 17) */
  f16_bull: { g:'f16', label:'Bullseye', upright:true, fixed:true, s0:.5, tile:.5, col:'#4FC3F7', draw(c){
    c.beginPath(); c.arc(0, 0, .5, 0, 7); c.stroke();
    c.beginPath(); c.arc(0, 0, .14, 0, 7); c.fill();
  }},
});
GROUPS.push(['f16', 'Radar FCR air-air', 'F-16C']);
