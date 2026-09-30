/* FL Briefing Board — vue radar liée : la géométrie d'un B-scope, sans rien d'autre.
   Fonctions pures, sans DOM : tools/test_radar.js les vérifie sous node.

   Elle montre ce que la géométrie de la vue de dessus donne sur l'écran radar du
   porteur. Elle ne simule pas la détection : pas de surface équivalente radar, pas de
   fouillis de sol, pas de notch tranché. Elle donne l'aspect, l'hémisphère chaud ou
   froid, et la part de la vitesse de la cible portée par la ligne de visée — la
   grandeur que le filtre Doppler juge (manuel F-16C, p. 391).

   Repère du plan : x vers la droite, y vers le bas ; un cap `a` en radians, 0 = haut,
   sens horaire — celui des formes posées. Tout vit dans RADAR : rien ne s'ajoute aux
   noms globaux de board.js. */

const RADAR = (() => {
  const DEG = 180 / Math.PI;
  /* cap d'un vecteur du plan, en degrés de 0 à 360 */
  const capOf = (dx, dy) => (Math.atan2(dx, -dy) * DEG + 360) % 360;
  /* angle ramené dans ]-180, 180] */
  const wrap180 = d => { const r = ((d % 360) + 540) % 360 - 180; return r === -180 ? 180 : r; };

  /* une cible vue du porteur. own, tgt : { x, y, a } ; pxPerNm : pixels par mille nautique.
     az     gisement relatif, en degrés, + à droite du nez du porteur
     nm     distance
     aspect angle d'aspect de la cible : 0 = on voit sa queue, 180 = son nez (F-16C, p. 405)
     side   'G' ou 'D' : le côté de la cible où se trouve le porteur
     hot    la cible vient vers le porteur, hémisphère chaud (F-16C, p. 404)
     radial part de sa vitesse le long de la ligne de visée, de 0 (au travers) à 1
     rel    cap de la cible rapporté à celui du porteur, en radians : le symbole du
            B-scope tourne de cet angle (F-16C, p. 404) */
  function radarContact(own, tgt, pxPerNm){
    const dx = tgt.x - own.x, dy = tgt.y - own.y;
    const az = wrap180(capOf(dx, dy) - (own.a || 0) * DEG);
    /* direction du porteur vue de la cible, rapportée au nez de la cible */
    const off = wrap180(capOf(-dx, -dy) - (tgt.a || 0) * DEG);
    const aspect = 180 - Math.abs(off);
    return {
      az, nm: Math.hypot(dx, dy) / pxPerNm, aspect, side: off > 0 ? 'D' : 'G', hot: aspect > 90,
      radial: Math.abs(Math.cos(aspect / DEG)), rel: (tgt.a || 0) - (own.a || 0),
    };
  }

  /* l'aspect comme l'écrit le F-16C : en dizaines de degrés, suivi du côté (p. 405) —
     « 9D », « 14G » ; ni côté à 0 ni à 18 */
  function aspectText(c){
    const t = Math.round(c.aspect / 10);
    return t === 0 || t === 18 ? String(t) : t + c.side;
  }

  /* l'image du B-scope : chaque cible est affichée si elle est dans le balayage et dans
     l'échelle, sinon comptée. opt : { pxPerNm, rangeNm, span, cone }
     span  demi-largeur de l'écran en azimut, en degrés
     cone  demi-largeur du balayage choisi, en degrés
     Une cible affichée reçoit fx (-1 à gauche, 1 à droite) et fy (0 au porteur, 1 en haut). */
  function radarPicture(own, tgts, opt){
    const out = { shown: [], outCone: 0, beyond: 0 };
    for (const t of tgts){
      const c = radarContact(own, t, opt.pxPerNm);
      c.src = t;
      if (Math.abs(c.az) > opt.cone) out.outCone++;
      else if (c.nm > opt.rangeNm) out.beyond++;
      else { c.fx = c.az / opt.span; c.fy = c.nm / opt.rangeNm; out.shown.push(c); }
    }
    return out;
  }

  return { radarContact, radarPicture, aspectText };
})();

if (typeof module !== 'undefined') module.exports = RADAR;
