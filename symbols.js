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
              libellés des boutons */

/* les 20 boutons d'un écran de F/A-18C, numérotés comme dans le manuel ED :
   PB1 → PB5 à gauche de bas en haut, PB6 → PB10 en haut de gauche à droite,
   PB11 → PB15 à droite de haut en bas, PB16 → PB20 en bas de droite à gauche */
const DDI_PB = (() => {
  const p = {}, k = [-.52, -.26, 0, .26, .52];
  k.forEach((v, i) => {
    p[5 - i]  = { x: -.935, y: v, lx: -.8, ly: v, al: 'left' };
    p[6 + i]  = { x: v, y: -.935, lx: v, ly: -.775, al: 'center' };
    p[11 + i] = { x: .935, y: v, lx: .8, ly: v, al: 'right' };
    p[20 - i] = { x: v, y: .935, lx: v, ly: .79, al: 'center' };
  });
  return p;
})();

/* texte dans le repère [-1, 1] : une police de 10 px ramenée à `size` unités ;
   « \n » passe à la ligne */
function scopeText(c, s, x, y, al = 'center', size = .062){
  const lines = s.split('\n');
  lines.forEach((t, i) => {
    c.save();
    c.translate(x, y + (i - (lines.length - 1) / 2) * size * 1.15);
    c.scale(size / 10, size / 10);
    c.font = '600 10px ui-monospace, Consolas, monospace';
    c.textAlign = al; c.textBaseline = 'middle';
    c.fillText(t, 0, 0);
    c.restore();
  });
}

/* boîtier, boutons et verre : gris, indépendants de la couleur choisie. Le MFD du
   F-16C a ses 20 boutons aux mêmes places, numérotés autrement (MFD_OSB). */
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
  c.fillStyle = '#040806';
  c.fillRect(-.87, -.87, 1.74, 1.74);
  c.restore();
}

/* page RDR ATTK air-air du F/A-18C, en B-scope : la distance croît vers le haut,
   l'azimut de gauche à droite (DCS F/A-18C Early Access Guide, p. 157-177) */
function fa18Attk(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth;
  ddiBezel(c);
  const L = -.6, R = .6, T = -.62, B = .6;                 // zone tactique
  c.save();
  c.lineWidth = lw * .35;
  c.strokeRect(L, T, R - L, B - T);
  c.beginPath(); c.moveTo(0, T); c.lineTo(0, B); c.stroke();       // B-sweep (p. 157)
  if (o.mini){ c.restore(); return; }

  /* échelle des distances, bord droit : repères au quart, à la moitié, aux trois
     quarts (p. 157) ; valeur choisie en haut à droite (p. 162, n° 8) */
  for (const f of [.25, .5, .75]){
    const y = B - (B - T) * f;
    c.beginPath(); c.moveTo(R, y); c.lineTo(R - .05, y); c.stroke();
  }
  scopeText(c, String(o.rng ?? sc.rng), R, T - .045, 'right');
  scopeText(c, '0', R + .015, B, 'left', .05);
  /* chevron d'élévation d'antenne, bord gauche (p. 157) */
  c.beginPath(); c.moveTo(L + .07, -.04); c.lineTo(L + .02, 0); c.lineTo(L + .07, .04); c.stroke();
  /* ligne d'horizon et vecteur vitesse, reflets du HUD à position fixe (p. 163, n° 18-19) */
  const hy = -.24;
  c.beginPath(); c.moveTo(-.34, hy); c.lineTo(-.1, hy); c.moveTo(.1, hy); c.lineTo(.34, hy); c.stroke();
  c.beginPath(); c.arc(0, hy, .035, 0, 7); c.stroke();
  c.beginPath();
  c.moveTo(-.075, hy); c.lineTo(-.035, hy); c.moveTo(.035, hy); c.lineTo(.075, hy);
  c.moveTo(0, hy - .035); c.lineTo(0, hy - .07);
  c.stroke();
  /* radar en émission (p. 162, n° 1) ; losange pointé : le TDC est sur cet écran
     (p. 162, n° 2 ; p. 168) */
  scopeText(c, 'OPR', -.8, -.7, 'left');
  const dx = .72, dy = -.7;
  c.beginPath(); c.moveTo(dx, dy - .035); c.lineTo(dx + .035, dy); c.lineTo(dx, dy + .035); c.lineTo(dx - .035, dy); c.closePath(); c.stroke();
  c.beginPath(); c.arc(dx, dy, .009, 0, 7); c.fill();
  /* libellés des boutons de la page */
  for (const [n, t] of Object.entries(sc.pb))
    scopeText(c, t.replace('{az}', o.az ?? sc.az), DDI_PB[n].lx, DDI_PB[n].ly, DDI_PB[n].al);
  c.restore();
}

/* marques d'une piste : étoile L&S et losange DT2 inscrits dans le HAFU du F/A-18C
   (p. 176), cercle de la cible désignée du F-16C (p. 404, 415) */
const MARKS = {
  ls(c){
    c.beginPath();
    for (let i = 0; i < 10; i++){
      const r = i % 2 ? .12 : .3, t = -Math.PI / 2 + i * Math.PI / 5;
      c.lineTo(Math.cos(t) * r, -.2 + Math.sin(t) * r);
    }
    c.closePath(); c.fill();
  },
  dt2(c){ c.beginPath(); c.moveTo(0, -.47); c.lineTo(.27, -.2); c.lineTo(0, .07); c.lineTo(-.27, -.2); c.closePath(); c.stroke(); },
  bug(c){ c.beginPath(); c.arc(0, 0, .72, 0, 7); c.stroke(); },
};
const withMark = (c, o) => { if (o && MARKS[o.mark]) MARKS[o.mark](c); };
/* HAFU, moitié haute : l'identification par les capteurs de bord (p. 209-210) */
const hafu = (label, col, draw) => ({ g:'fa18', label, col, track:true, upright:true, fixed:true, stem:[.2, 1.2],
  s0:.55, tile:.5, draw(c, o){ draw(c); withMark(c, o); } });

Object.assign(SHAPES, {
  /* ---------------- radar F/A-18C ---------------- */
  fa18_rws: { g:'fa18', label:'Écran RWS', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { page:'rws', rng:40, az:140, ranges:[5, 10, 20, 40, 80, 160], azs:[20, 40, 60, 80, 140],
             pb: { 1:'HI\nINTL', 5:'RWS', 6:'4B 1', 7:'SIL', 8:'ERASE', 11:'↑', 12:'↓', 13:'SET',
                   14:'RSET', 15:'NCTR', 16:'DATA', 17:'CHAN', 19:'{az}°', 20:'MODE' } } },
  fa18_tws: { g:'fa18', label:'Écran TWS', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { page:'tws', rng:40, az:80, ranges:[5, 10, 20, 40, 80, 160], azs:[20, 40, 60, 80],
             pb: { 1:'HI\nINTL', 5:'TWS', 6:'2B 2', 7:'SIL', 8:'HITS', 9:'RAID', 11:'↑', 12:'↓',
                   13:'AUTO\nMAN', 14:'RSET', 16:'DATA', 19:'{az}°', 20:'EXP' } } },
  fa18_stt: { g:'fa18', label:'Écran STT', under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
    ldy:1.12, col:'#34D399', draw: fa18Attk,
    scope: { page:'stt', rng:40, ranges:[5, 10, 20, 40, 80, 160],
             pb: { 1:'HI\nINTL', 5:'RWS', 6:'2B 1', 8:'ERASE', 15:'NCTR', 16:'DATA', 17:'CHAN', 20:'MODE' } } },

  /* contact brut : une brique pleine (p. 158) */
  fa18_brick: { g:'fa18', label:'Brique', upright:true, fixed:true, s0:.5, tile:.7, col:'#34D399', draw(c){
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
     pas des objets. La vignette marque le HAFU touché (p. 173, 176-177). */
  fa18_ls: { g:'fa18', label:'L&S', mark:'ls', tile:.5, draw(c){
    c.beginPath();
    for (let i = 0; i < 10; i++){
      const r = i % 2 ? .18 : .45, t = -Math.PI / 2 + i * Math.PI / 5;
      c.lineTo(Math.cos(t) * r, Math.sin(t) * r);
    }
    c.closePath(); c.fill();
  }},
  fa18_dt2: { g:'fa18', label:'DT2', mark:'dt2', tile:.5, draw(c){
    c.beginPath(); c.moveTo(0, -.42); c.lineTo(.42, 0); c.lineTo(0, .42); c.lineTo(-.42, 0); c.closePath(); c.stroke();
  }},
  /* curseur d'acquisition du TDC : deux traits verticaux parallèles (p. 158) */
  fa18_tdc: { g:'fa18', label:'Curseur TDC', upright:true, fixed:true, over:true, s0:.6, tile:.55, col:'#D1A94A', draw(c){
    c.beginPath(); c.moveTo(-.16, -.5); c.lineTo(-.16, .5); c.moveTo(.16, -.5); c.lineTo(.16, .5); c.stroke();
  }},
});
GROUPS.push(['fa18', 'Radar F/A-18C']);

/* ---------------- radar F-16C ----------------
   DCS F-16C Early Access Guide, « APG-68 Fire Control Radar », p. 374-420. Lu pour
   lui-même : rien n'est repris du F/A-18C. */

/* les 20 boutons d'un MFD de F-16C, numérotés comme dans le manuel ED : OSB 1 → 5 en
   haut de gauche à droite, 6 → 10 à droite de haut en bas, 16 → 20 à gauche de bas en
   haut (p. 394-396, 410). Le rang du bas, 11 → 15 de droite à gauche, n'est recoupé par
   aucun texte : ses libellés sont placés comme sur la figure p. 394. */
const MFD_OSB = (() => {
  const p = {}, k = [-.52, -.26, 0, .26, .52];
  k.forEach((v, i) => {
    p[1 + i]  = { lx: v, ly: -.79, al: 'center' };
    p[6 + i]  = { lx: .81, ly: v, al: 'right' };
    p[15 - i] = { lx: v, ly: .8, al: 'center' };
    p[20 - i] = { lx: -.81, ly: v, al: 'left' };
  });
  return p;
})();

/* page FCR air-air, en B-scope : l'appareil au bas de l'écran, la distance vers le
   haut, l'azimut de gauche à droite (p. 394). Libellés en blanc, échelles à la couleur
   de l'objet. */
function f16Fcr(c, o){
  const sc = SHAPES[o.k].scope, lw = c.lineWidth, ink = c.strokeStyle, WH = '#E6EDF5';
  ddiBezel(c);
  const L = -.55, R = .62, T = -.64, B = .6, X0 = (L + R) / 2, hy = (T + B) / 2;
  c.save();
  c.lineWidth = lw * .35;
  c.strokeStyle = WH; c.fillStyle = WH;
  c.beginPath(); c.moveTo(-.72, -.72); c.lineTo(.72, -.72); c.moveTo(-.72, .72); c.lineTo(.72, .72); c.stroke();
  c.strokeStyle = ink; c.fillStyle = ink;
  /* ligne d'horizon, deux repères tournés vers le sol à ses bouts (p. 396, n° 10) */
  c.beginPath();
  c.moveTo(X0 - .42, hy); c.lineTo(X0 + .42, hy);
  c.moveTo(X0 - .42, hy); c.lineTo(X0 - .42, hy + .04); c.moveTo(X0 + .42, hy); c.lineTo(X0 + .42, hy + .04);
  c.stroke();
  if (o.mini){ c.restore(); return; }

  /* échelle d'élévation d'antenne : ±60°, repère majeur à 0°, mineurs tous les 10°,
     position en « T » couché (p. 397, n° 20) */
  const ex = L - .06, eh = (B - T) / 2 - .04;
  c.beginPath(); c.moveTo(ex, hy - eh); c.lineTo(ex, hy + eh); c.stroke();
  for (let d = -60; d <= 60; d += 10){
    const yy = hy - d / 60 * eh;
    c.beginPath(); c.moveTo(ex, yy); c.lineTo(ex + (d ? .025 : .05), yy); c.stroke();
  }
  c.beginPath(); c.moveTo(ex - .035, hy); c.lineTo(ex + .06, hy); c.moveTo(ex + .06, hy - .025); c.lineTo(ex + .06, hy + .025); c.stroke();
  /* repères de distance à ¼, ½ et ¾ de l'échelle, bord droit (p. 397, n° 21) */
  for (const f of [.25, .5, .75]){
    const yy = B - (B - T) * f;
    c.beginPath(); c.moveTo(R, yy); c.lineTo(R - .05, yy); c.stroke();
  }
  /* largeur de balayage (p. 395-396, n° 8) : A6 = ±60°, toute la largeur ; A3 = ±30°
     et A1 = ±10° tracent leurs limites. Ici centrées : dans l'avion, elles suivent le
     curseur d'acquisition. */
  const az = o.az ?? sc.az;
  if (az < 6){
    const hw = (R - L) / 2 * az / 6;
    c.beginPath(); c.moveTo(X0 - hw, T); c.lineTo(X0 - hw, B); c.moveTo(X0 + hw, T); c.lineTo(X0 + hw, B); c.stroke();
  }
  /* libellés : échelle entre ses flèches OSB 20 et 19 (p. 395, n° 7), puis les boutons */
  c.strokeStyle = WH; c.fillStyle = WH;
  const tri = (yy, up) => {
    const d = up ? -.03 : .03;
    c.beginPath(); c.moveTo(-.8, yy - d); c.lineTo(-.72, yy - d); c.lineTo(-.76, yy + d); c.closePath(); c.stroke();
  };
  tri(-.58, true); tri(-.26, false);
  scopeText(c, String(o.rng ?? sc.rng), -.81, -.42, 'left');
  for (const [n, t] of Object.entries(sc.pb))
    scopeText(c, t.replace('{az}', az), MFD_OSB[n].lx, MFD_OSB[n].ly, MFD_OSB[n].al);
  c.restore();
}

/* piste TWS : le symbole entier tourne avec le cap sol de la cible, un trait figure
   son nez (p. 404, 414) */
function f16Track(c, o){
  c.fillRect(-.32, -.32, .64, .64);
  c.beginPath(); c.moveTo(0, -.32); c.lineTo(0, -.95); c.stroke();
  withMark(c, o);
}

const f16Page = (label, sub) => ({ g:'f16', label, under:true, upright:true, box:1, s0:4.5, smax:12, tile:.62,
  ldy:1.12, col:'#4FC3F7', draw: f16Fcr,
  scope: { page: sub.toLowerCase(), rng:40, az:6, ranges:[5, 10, 20, 40, 80, 160], azs:[1, 3, 6],
           pb: { 1:'CRM', 2:sub, 3:'NORM', 4:'OVRD', 5:'CNTL', 6:'CONT', 18:'A\n{az}', 17:'4\nB',
                 15:'SWAP', 14:'FCR', 13:'TEST', 12:'DTE', 11:'DCLT' } } });

Object.assign(SHAPES, {
  f16_rws: f16Page('Écran FCR RWS', 'RWS'),
  f16_tws: f16Page('Écran FCR TWS', 'TWS'),
  /* cible de recherche : carré plein ; la « hot line » dessous = chaude, elle vient
     vers nous ; dessus = froide, elle s'éloigne (p. 404) */
  f16_hot: { g:'f16', label:'Cible chaude', upright:true, fixed:true, s0:.5, tile:.55, col:'#E6EDF5', draw(c){
    c.fillRect(-.3, -.3, .6, .6); c.beginPath(); c.moveTo(0, .3); c.lineTo(0, .8); c.stroke();
  }},
  f16_cold: { g:'f16', label:'Cible froide', upright:true, fixed:true, s0:.5, tile:.55, col:'#E6EDF5', draw(c){
    c.fillRect(-.3, -.3, .6, .6); c.beginPath(); c.moveTo(0, -.3); c.lineTo(0, -.8); c.stroke();
  }},
  /* piste en jaune, piste système en blanc (p. 404) */
  f16_track: { g:'f16', label:'Piste TWS', track:true, fixed:true, s0:.55, tile:.5, tileA:-.7, col:'#D1A94A', draw: f16Track },
  f16_systrack: { g:'f16', label:'Piste système', track:true, fixed:true, s0:.55, tile:.5, tileA:-.7, col:'#E6EDF5', draw: f16Track },
  /* cible désignée (bugged, FCR TOI) : un cercle autour de la piste, une seule (p. 404, 415) */
  f16_bug: { g:'f16', label:'Désignée', mark:'bug', tile:.5, draw(c){
    c.beginPath(); c.arc(0, 0, .72, 0, 7); c.stroke(); c.fillRect(-.3, -.3, .6, .6);
  }},
  /* curseur d'acquisition A-A : deux traits verticaux parallèles (p. 396, n° 11) */
  f16_cursor: { g:'f16', label:'Curseur A-A', upright:true, fixed:true, over:true, s0:.6, tile:.55, col:'#E6EDF5', draw(c){
    c.beginPath(); c.moveTo(-.16, -.5); c.lineTo(-.16, .5); c.moveTo(.16, -.5); c.lineTo(.16, .5); c.stroke();
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
GROUPS.push(['f16', 'Radar F-16C']);
