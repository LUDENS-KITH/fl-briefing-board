/* Vérifie la géométrie de la vue radar liée (radar.js) sur des cas dont la réponse se
   calcule à la main. Usage : node tools/test_radar.js
   Repère du plan : x vers la droite, y vers le bas, cap 0 = haut, sens horaire. */
const path = require('path');
const { radarContact, radarPicture, aspectText } = require(path.join(__dirname, '..', 'radar.js'));

const R = Math.PI / 180, PX = 10;                         // 10 pixels par mille nautique
const at = (brgDeg, nm) => ({ x: Math.sin(brgDeg * R) * nm * PX, y: -Math.cos(brgDeg * R) * nm * PX });
const own = { x: 0, y: 0, a: 0 };
let bad = 0, n = 0;
function eq(label, got, want, tol = 1e-6){
  n++;
  const ok = typeof want === 'number' ? Math.abs(got - want) <= tol : got === want;
  if (!ok){ bad++; console.log(`ÉCHEC ${label} : attendu ${want}, obtenu ${got}`); }
}

/* droit devant à 20 NM : au centre, à 20 NM */
let c = radarContact(own, { ...at(0, 20), a: 0 }, PX);
eq('droit devant : gisement', c.az, 0);
eq('droit devant : distance', c.nm, 20);

/* 45° à droite, 30 NM */
c = radarContact(own, { ...at(45, 30), a: 0 }, PX);
eq('45° droite : gisement', c.az, 45);
eq('45° droite : distance', c.nm, 30);
eq('45° gauche : gisement', radarContact(own, { ...at(-45, 30), a: 0 }, PX).az, -45);

/* aspect au sens du F-16C (p. 405) : 0 = on voit sa queue, 180 = son nez */
eq('elle s\'éloigne : aspect', radarContact(own, { ...at(0, 20), a: 0 }, PX).aspect, 0);
eq('elle vient vers nous : aspect', radarContact(own, { ...at(0, 20), a: Math.PI }, PX).aspect, 180);
c = radarContact(own, { ...at(0, 20), a: Math.PI / 2 }, PX);           // cap 090 devant nous
eq('au travers : aspect', c.aspect, 90);
eq('au travers : côté', c.side, 'D');                                   // le porteur est à sa droite
eq('au travers : texte', aspectText(c), '9D');
eq('au travers : part radiale', c.radial, 0, 1e-9);
c = radarContact(own, { ...at(0, 20), a: -140 * R }, PX);               // exemple 14L de la p. 405, en miroir
eq('140° : aspect', c.aspect, 140, 1e-9);
eq('140° : côté', c.side, 'G');
eq('140° : chaude', c.hot, true);
eq('140° : texte', aspectText(c), '14G');
eq('de face : part radiale', radarContact(own, { ...at(0, 20), a: Math.PI }, PX).radial, 1);

/* cap de la cible rapporté au porteur : le symbole du B-scope tourne de la différence */
eq('cap relatif', radarContact({ ...own, a: 30 * R }, { ...at(0, 20), a: 100 * R }, PX).rel, 70 * R, 1e-9);

/* l'image : dans le balayage et l'échelle, affiché ; sinon compté */
const opt = { pxPerNm: PX, rangeNm: 40, span: 60, cone: 60 };
let p = radarPicture(own, [{ ...at(0, 20), a: 0 }, { ...at(45, 30), a: 0 }, { ...at(70, 20), a: 0 },
                          { ...at(10, 50), a: 0 }, { ...at(180, 10), a: 0 }], opt);
eq('affichés', p.shown.length, 2);
eq('hors balayage (70° et derrière)', p.outCone, 2);
eq('au-delà de l\'échelle', p.beyond, 1);
eq('droit devant : abscisse', p.shown[0].fx, 0);
eq('droit devant : ordonnée', p.shown[0].fy, .5);
eq('45° : abscisse', p.shown[1].fx, .75);

/* le porteur tourne de 30° à droite : la cible droit devant glisse à gauche */
p = radarPicture({ ...own, a: 30 * R }, [{ ...at(0, 20), a: 0 }], opt);
eq('porteur tourné : gisement', p.shown[0].az, -30);

/* écran plus large que le balayage (F/A-18C : écran ±70°, balayage 60° = ±30°) : la
   position suit l'écran, pas le balayage */
eq('écran ±70°, cible à 20° : abscisse',
   radarPicture(own, [{ ...at(20, 10), a: 0 }], { ...opt, span: 70, cone: 30 }).shown[0].fx, 20 / 70, 1e-9);

/* un balayage réduit (A3 = ±30°) écarte la cible à 45° */
eq('A3 : cible à 45° écartée', radarPicture(own, [{ ...at(45, 30), a: 0 }], { ...opt, cone: 30 }).outCone, 1);

console.log(`${n} vérifications, ${bad} en échec`);
if (bad) process.exit(1);
