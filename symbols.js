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
