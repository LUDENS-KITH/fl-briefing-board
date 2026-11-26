/* Les traces des vols d'une opération sur la carte (lot 32, plan FlightLedger lot 4b).
   Usage : node tools/test_traces.js
   traces.js range ce que FlightLedger rend (GET /board/operations/{id}/tracks) : quelles
   traces se dessinent, une couleur par pilote (pas par vol), ce qui s'écrit au départ, et
   l'emprise des vols cochés pour cadrer la carte. */
const path = require('path');
const TRACES = require(path.join(__dirname, '..', 'traces.js'));

let bad = 0, n = 0;
function eq(label, got, want){
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)){ bad++; console.log(`ÉCHEC ${label} : attendu ${JSON.stringify(want)}, obtenu ${JSON.stringify(got)}`); }
}

const seg = (lat, lon) => [[lat, lon, 1000], [lat + 0.1, lon + 0.1, 1200], [lat + 0.2, lon, 1500]];
const tracks = [
  { flight_id: 'a', pseudo: 'Shoot', callsign: 'Ledger 1-1', aircraft: 'F/A-18C', state: 'ok', segments: [seg(26, 56)] },
  { flight_id: 'b', pseudo: 'Brindille', callsign: 'Ledger 1-2', aircraft: 'F/A-18C', state: 'ok', segments: [seg(26.5, 56.5)] },
  { flight_id: 'c', pseudo: 'Shoot', callsign: null, aircraft: 'F-14B', state: 'ok', segments: [seg(27, 55), seg(27.5, 55.5)] },
  { flight_id: 'd', pseudo: 'Guiness', callsign: 'Rooster 1-1', aircraft: null, state: 'purged', segments: [] },
  { flight_id: 'e', pseudo: 'Lafman', callsign: null, aircraft: null, state: 'ok', segments: [[[25, 54, 0]]] },
  { flight_id: 'f', pseudo: 'Oldman', callsign: null, aircraft: null, state: 'protected', segments: [] },
];
const rows = [{ pseudo: 'Brindille' }, { pseudo: 'Guiness' }, { pseudo: 'Shoot' }];

/* ce qui se dessine : une trace « ok » qui a au moins un tronçon de deux points */
eq('vols dessinables', TRACES.drawable(tracks).map(t => t.flight_id), ['a', 'b', 'c']);
eq('aucune réponse', TRACES.drawable(null), []);
eq('réponse sans traces', TRACES.drawable({}), []);

/* une couleur par pilote : l'ordre du débrief d'abord, puis les pilotes absents du débrief */
const colors = TRACES.pilotColors(rows, tracks);
eq('Brindille, premier du débrief', colors.get('Brindille'), TRACES.COLORS[0]);
eq('Guiness, sans trace, garde son rang', colors.get('Guiness'), TRACES.COLORS[1]);
eq('Shoot', colors.get('Shoot'), TRACES.COLORS[2]);
eq('Lafman, absent du débrief, après', colors.get('Lafman'), TRACES.COLORS[3]);
eq('deux vols du même pilote, une couleur', TRACES.colorOf(colors, tracks[0]), TRACES.colorOf(colors, tracks[2]));
eq('deux pilotes, deux couleurs', TRACES.colorOf(colors, tracks[0]) !== TRACES.colorOf(colors, tracks[1]), true);
const many = Array.from({ length: TRACES.COLORS.length + 2 }, (_, i) => ({ pseudo: 'P' + i }));
const wrap = TRACES.pilotColors(many, []);
eq('au-delà de la palette, les couleurs reprennent', wrap.get('P' + TRACES.COLORS.length), TRACES.COLORS[0]);

/* ce qui s'écrit au départ de la trace : pilote, indicatif, appareil ; rien d'inventé */
eq('étiquette complète', TRACES.label(tracks[0]), 'Shoot · Ledger 1-1 · F/A-18C');
eq('sans indicatif', TRACES.label(tracks[2]), 'Shoot · F-14B');
eq('pilote seul', TRACES.label(tracks[4]), 'Lafman');
/* un indicatif égal au nom du pilote ne se répète pas (vu le 26/11 sur Tripwire : « Guiness · Guiness · F/A-18C Hornet ») */
eq('indicatif égal au pilote, une fois', TRACES.label({ pseudo: 'Guiness', callsign: 'guiness ', aircraft: 'F/A-18C Hornet' }), 'Guiness · F/A-18C Hornet');
eq('indicatif différent, gardé', TRACES.label({ pseudo: 'Shoot', callsign: 'Shoot 1-1', aircraft: 'F/A-18C Hornet' }), 'Shoot · Shoot 1-1 · F/A-18C Hornet');

/* les vols cochés, dans l'ordre de la réponse ; un vol coché sans trace n'apparaît pas */
const shown = new Set(['c', 'a', 'd']);
eq('vols cochés', TRACES.selected(tracks, shown).map(t => t.flight_id), ['a', 'c']);
eq('rien de coché', TRACES.selected(tracks, new Set()), []);
eq('cochés par défaut : tous les dessinables', [...TRACES.defaultShown(tracks)], ['a', 'b', 'c']);

/* l'emprise : sud, ouest, nord, est des vols cochés, pour cadrer la carte */
eq('emprise de deux vols', TRACES.bounds(TRACES.selected(tracks, shown)), [26, 55, 27.7, 56.1]);
eq('emprise vide', TRACES.bounds([]), null);

/* deux pilotes partis du même porte-avions : la seconde étiquette descend d'une ligne ;
   une étiquette ailleurs sur la carte ne bouge pas (Tripwire, 25/11 : Shoot et Guiness superposés) */
eq('même départ : empilées', TRACES.stack([{ x: 100, y: 200, w: 180 }, { x: 102, y: 201, w: 200 }], 25), [200, 226]);
eq('trois au même départ', TRACES.stack([{ x: 0, y: 0, w: 50 }, { x: 0, y: 0, w: 50 }, { x: 0, y: 0, w: 50 }], 25), [0, 25, 50]);
eq('départs éloignés : rien ne bouge', TRACES.stack([{ x: 0, y: 0, w: 50 }, { x: 500, y: 0, w: 50 }, { x: 0, y: 300, w: 50 }], 25), [0, 0, 300]);
eq('aucune étiquette', TRACES.stack([], 25), []);

console.log(`${n} vérifications, ${bad} en échec`);
process.exit(bad ? 1 : 0);
