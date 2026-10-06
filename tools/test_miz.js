/* Vérifie miz.js : la projection des théâtres, la lecture d'une table Lua, et la
   lecture d'une mission .miz fabriquée ici, archive zip comprise.
   Usage : node tools/test_miz.js */
const path = require('path'), zlib = require('zlib');
const MIZ = require(path.join(__dirname, '..', 'miz.js'));
const PROJECTIONS = require(path.join(__dirname, '..', 'projections.js'));

let bad = 0, n = 0;
function eq(label, got, want, tol = 0){
  n++;
  const ok = typeof want === 'number' ? Math.abs(got - want) <= tol : JSON.stringify(got) === JSON.stringify(want);
  if (!ok){ bad++; console.log(`ÉCHEC ${label} : attendu ${JSON.stringify(want)}, obtenu ${JSON.stringify(got)}`); }
}

/* 1. projection transverse de Mercator, échelle 1, contre pyproj (référence
   indépendante) : [lat, lon, lon0, N, E] */
const REF = [
  [41.61, 41.6, 33, 4644204.8103, 717165.7868],
  [45.04, 37.4, 33, 4998818.3604, 346684.3935],
  [68.5, 33.0, 21, 7649457.7859, 488374.8470],
  [13.48, 144.8, 147, 1491881.0672, -238252.0025],
  [25.25, 55.36, 57, 2794756.7943, -165236.0305],
  [60.0, 5.0, 21, 6762371.4896, -886889.4841],               // à 16° du méridien central
  [-5.0, 40.0, 39, -552969.8088, 110904.2888],
];
for (const [lat, lon, lon0, N, E] of REF){
  const [gn, ge] = MIZ.tm(lat, lon, lon0);
  eq(`TM ${lat},${lon} : N`, gn, N, 1e-3);
  eq(`TM ${lat},${lon} : E`, ge, E, 1e-3);
  const [blat, blon] = MIZ.tmInverse(gn, ge, lon0);
  eq(`inverse ${lat},${lon} : lat`, blat, lat, 1e-9);
  eq(`inverse ${lat},${lon} : lon`, blon, lon, 1e-9);
}
/* d'un point DCS à la carte, et retour : la projection mesurée du Caucase */
const C = PROJECTIONS.Caucasus;
const [clat, clon] = MIZ.toGeo(C, -356437, 618211);
const [cx, cy] = MIZ.fromGeo(C, clat, clon);
eq('Caucase : aller-retour x', cx, -356437, 1e-3);
eq('Caucase : aller-retour y', cy, 618211, 1e-3);

/* 2. table Lua : chaînes échappées, commentaires, chaîne longue, clés de tous genres */
const L = MIZ.parseLua(`mission = -- en-tête
{
  ["a"] = "dit \\"bonjour\\"\\n\\065", -- commentaire
  --[[ commentaire
       long ]]
  b = [==[ligne ]] encore]==],
  [3] = -1.5e2,
  ["t"] = { [1] = true, [2] = false, [3] = nil; },
  ["p"] = { "x"; "y" , },
  ["vide"] = {},
}`);
eq('chaîne échappée', L.a, 'dit "bonjour"\nA');
eq('chaîne longue', L.b, 'ligne ]] encore');
eq('nombre', L[3], -150);
eq('clés explicites', [L.t[1], L.t[2], L.t[3]], [true, false, null]);
eq('valeurs positionnelles', MIZ.list(L.p), ['x', 'y']);
eq('table vide', L.vide, {});

/* 3. une mission, dans une vraie archive zip */
const mission = `mission =
{
  ["theatre"] = "Caucasus",
  ["coalition"] =
  {
    ["blue"] =
    {
      ["bullseye"] = { ["x"] = -291014, ["y"] = 617414, },
      ["country"] =
      {
        [1] =
        {
          ["name"] = "USA",
          ["plane"] =
          {
            ["group"] =
            {
              [1] =
              {
                ["name"] = "UZI 1",
                ["units"] =
                {
                  [1] = { ["type"] = "FA-18C_hornet", ["skill"] = "Client", ["x"] = -356437, ["y"] = 618211, },
                  [2] = { ["type"] = "FA-18C_hornet", ["skill"] = "Client", ["x"] = -356400, ["y"] = 618250, },
                },
                ["route"] =
                {
                  ["points"] =
                  {
                    [1] = { ["x"] = -356437, ["y"] = 618211, ["alt"] = 13, ["alt_type"] = "BARO", ["name"] = "DictKey_WptName_1", },
                    [2] = { ["x"] = -320000, ["y"] = 640000, ["alt"] = 7620, ["alt_type"] = "BARO", ["name"] = "", },
                    [3] = { ["x"] = -300000, ["y"] = 700000, ["alt"] = 150, ["alt_type"] = "RADIO", ["name"] = "IP", },
                  },
                },
              },
              [2] =
              {
                ["name"] = "Ravitailleur",
                ["units"] = { [1] = { ["type"] = "KC135MPRS", ["skill"] = "High", ["x"] = 0, ["y"] = 0, }, },
                ["route"] = { ["points"] = { [1] = { ["x"] = 0, ["y"] = 0, ["alt"] = 6000, }, }, },
              },
            },
          },
        },
      },
    },
    ["red"] =
    {
      ["bullseye"] = { ["x"] = -250000, ["y"] = 700000, },
      ["country"] =
      {
        [1] =
        {
          ["name"] = "Russia",
          ["vehicle"] =
          {
            ["group"] =
            {
              [1] = { ["name"] = "SA-11 Kutaïssi", ["x"] = -284000, ["y"] = 683000,
                      ["units"] = { [1] = { ["type"] = "SA-11 Buk LN 9A310M1", }, [2] = { ["type"] = "SA-11 Buk SR 9S18M1", }, }, },
              [2] = { ["name"] = "Alerte", ["x"] = -260000, ["y"] = 690000,
                      ["units"] = { [1] = { ["type"] = "1L13 EWR", }, }, },
              [3] = { ["name"] = "Convoi", ["x"] = -270000, ["y"] = 680000,
                      ["units"] = { [1] = { ["type"] = "T-72B", }, }, },
            },
          },
          ["ship"] =
          {
            ["group"] =
            {
              [1] = { ["name"] = "Kouznetsov", ["x"] = -200000, ["y"] = 500000, ["units"] = { [1] = { ["type"] = "KUZNECOW", }, }, },
              [2] = { ["name"] = "Escorte", ["x"] = -205000, ["y"] = 505000, ["units"] = { [1] = { ["type"] = "MOLNIYA", }, }, },
            },
          },
        },
      },
    },
  },
  ["trig"] = { ["func"] = { [1] = "a_out_text(\\"x\\\\ny\\", 10)", }, },
}`;
const dictionary = 'dictionary = { ["DictKey_WptName_1"] = "DÉPART", }';

/* une archive zip minimale : en-têtes locaux, répertoire central, fin de répertoire */
function zip(files){
  const locals = [], centrals = []; let off = 0;
  for (const [name, text, stored] of files){
    const raw = Buffer.from(text, 'utf8'), data = stored ? raw : zlib.deflateRawSync(raw), nm = Buffer.from(name);
    const loc = Buffer.alloc(30); loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(stored ? 0 : 8, 8);
    loc.writeUInt32LE(zlib.crc32(raw), 14); loc.writeUInt32LE(data.length, 18); loc.writeUInt32LE(raw.length, 22); loc.writeUInt16LE(nm.length, 26);
    const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(stored ? 0 : 8, 10);
    cen.writeUInt32LE(zlib.crc32(raw), 16); cen.writeUInt32LE(data.length, 20); cen.writeUInt32LE(raw.length, 24); cen.writeUInt16LE(nm.length, 28);
    cen.writeUInt32LE(off, 42);
    locals.push(loc, nm, data); centrals.push(cen, nm);
    off += 30 + nm.length + data.length;
  }
  const dir = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(off, 16);
  return new Uint8Array(Buffer.concat([...locals, dir, end]));
}

(async () => {
  const m = await MIZ.readMiz(zip([['options', 'options = {}', true], ['mission', mission], ['l10n/DEFAULT/dictionary', dictionary]]));
  eq('théâtre', m.theatre, 'Caucasus');
  eq('bullseye bleu', m.bullseye.blue, { x: -291014, y: 617414 });
  eq('vols joueurs seulement', m.flights.map(f => f.name), ['UZI 1']);
  const f = m.flights[0];
  eq('vol : appareil, nombre, catégorie', [f.type, f.units, f.side, f.cat], ['FA-18C_hornet', 2, 'blue', 'plane']);
  eq('points : noms, dictionnaire compris', f.points.map(p => p.name), ['DÉPART', '', 'IP']);
  eq('points : altitudes et sol', f.points.map(p => [p.alt, p.agl]), [[13, false], [7620, false], [150, true]]);
  eq('menaces : groupes de défense aérienne et navires', m.threats.map(t => [t.name, t.kind, t.side]),
     [['SA-11 Kutaïssi', 'sam', 'red'], ['Alerte', 'radar', 'red'], ['Kouznetsov', 'carrier', 'red'], ['Escorte', 'ship', 'red']]);
  eq('menace : position du groupe', [m.threats[0].x, m.threats[0].y], [-284000, 683000]);

  let err = '';
  try { await MIZ.readMiz(new Uint8Array([1, 2, 3, 4])); } catch (e){ err = e.message; }
  eq('pas une archive : refus', /archive/.test(err), true);
  err = '';
  try { await MIZ.readMiz(zip([['options', 'options = {}', true]])); } catch (e){ err = e.message; }
  eq('archive sans mission : refus', /mission/.test(err), true);

  /* 4. lot 9 : la route écrite dans la DTC des F/A-18C d'une copie de la mission */
  const src = zip([['options', 'options = {}', true], ['mission', mission.replace('["theatre"]', '["start_time"] = 7800,\n  ["theatre"]')],
                   ['l10n/DEFAULT/dictionary', dictionary]]);
  const uzi = (await MIZ.readMiz(src)).flights[0];
  const PTS = [{ n: 1, x: -320000, y: 640000, alt: 7620, note: 'CAP' },
               { n: 2, x: -300000, y: 700000, alt: 150, note: '' },
               { n: 4, x: -300000, y: 640000, alt: 3048, note: 'RETOUR "B"' }];
  const out = await MIZ.withDtc(src, uzi.ref, PTS);
  const CART = 'FA-18C UZI 1 - FL Briefing';
  eq('cartouche : nom', out.cartridge, CART);
  eq('cartouche : appareils servis', out.units, 2);

  /* l'archive rendue, lue par zlib et non par miz.js : CRC, tailles, entrées */
  function entries(u8){
    const b = Buffer.from(u8), files = new Map();
    const e = b.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    let p = b.readUInt32LE(e + 16);
    for (let k = 0; k < b.readUInt16LE(e + 10); k++){
      const method = b.readUInt16LE(p + 10), crc = b.readUInt32LE(p + 16), cs = b.readUInt32LE(p + 20), us = b.readUInt32LE(p + 24);
      const nl = b.readUInt16LE(p + 28), at = b.readUInt32LE(p + 42), name = b.toString('utf8', p + 46, p + 46 + nl);
      const s = at + 30 + b.readUInt16LE(at + 26) + b.readUInt16LE(at + 28), raw = b.subarray(s, s + cs);
      const data = method === 8 ? zlib.inflateRawSync(raw) : raw;
      files.set(name, { data, ok: data.length === us && zlib.crc32(data) === crc, method });
      p += 46 + nl + b.readUInt16LE(p + 30) + b.readUInt16LE(p + 32);
    }
    return files;
  }
  const before = entries(src), after = entries(out.bytes);
  eq('archive : CRC et tailles justes', [...after.values()].every(f => f.ok), true);
  eq('archive : entrées', [...after.keys()], ['options', 'mission', 'l10n/DEFAULT/dictionary', `DTC/${CART}.dtc`]);
  eq('archive : options et dictionnaire intacts', ['options', 'l10n/DEFAULT/dictionary'].every(k => after.get(k).data.equals(before.get(k).data)), true);

  /* la mission : seule la référence de cartouche des deux Hornet change */
  const txt0 = before.get('mission').data.toString('utf8'), txt1 = after.get('mission').data.toString('utf8');
  const DTC_RE = /\n\["DTC"\] = \{ \["AutoLoad"\] = true, \["Cartridges"\] = \{ (\[\d\] = \{ [^{}]*\}, )+\}, \},/g;
  eq('mission : deux références ajoutées', (txt1.match(DTC_RE) || []).length, 2);
  eq('mission : le reste octet pour octet', txt1.replace(DTC_RE, ''), txt0);
  const m1 = MIZ.parseLua(txt1), units = m1.coalition.blue.country[1].plane.group[1].units;
  eq('unité : cartouche chargée au démarrage', units[1].DTC, { AutoLoad: true, Cartridges: { 1: { name: CART, default: true } } });
  eq('ravitailleur : aucune cartouche', m1.coalition.blue.country[1].plane.group[2].units[1].DTC, undefined);
  eq('mission relue : même vol', (await MIZ.readMiz(out.bytes)).flights.map(f => [f.name, f.points.length]), [['UZI 1', 3]]);

  /* la cartouche : format de l'éditeur de mission (CoreMods/aircraft/FA-18C/DTC) */
  const c = JSON.parse(after.get(`DTC/${CART}.dtc`).data.toString('utf8'));
  eq('cartouche : appareil et théâtre', [c.name, c.type, c.data.type, c.data.terrain, c.data.WYPT.terrain],
     [CART, 'FA-18C_hornet', 'FA-18C_hornet', 'Caucasus', 'Caucasus']);
  eq('cartouche : points propres, pas le miroir de la route', c.data.WYPT.mirror_NAV_PTS, false);
  eq('cartouche : un seul rayon, les waypoints', Object.keys(c.data).sort(), ['WYPT', 'name', 'terrain', 'type']);
  const P = c.data.WYPT.NAV_PTS;
  eq('points : numéros du tableau', P.map(p => [p.id, p.wypt_num]), [['STPT1', 1], ['STPT2', 2], ['STPT4', 4]]);
  eq('points : position DCS et altitude en mètres', P.map(p => [p.x, p.y, p.alt, p.altitudeType]),
     [[-320000, 640000, 7620, 1], [-300000, 700000, 150, 1], [-300000, 640000, 3048, 1]]);
  eq('points : note', P.map(p => p.note), ['CAP', '', 'RETOUR "B"']);
  eq('points : séquence 1 dans l\'ordre', P.map(p => [p.R1, p.R1_order, p.R2, p.R3]), [[true, 1, false, false], [true, 2, false, false], [true, 3, false, false]]);
  const R = c.data.WYPT.NAV_ROUTE;
  eq('séquences 2 et 3 vides', [R.length, R[1], R[2]], [3, [], []]);
  /* ETA comme l'éditeur : départ de la mission, puis distance à 463 km/h (250 kt) */
  const leg = Math.hypot(20000, 60000) / (463 / 3.6);
  eq('séquence 1 : ETA du premier point', R[0].STPT1.ETA, 7800);
  eq('séquence 1 : ETA du second point', R[0].STPT2.ETA, Math.round(7800 + leg));
  eq('séquence 1 : vitesse et altitude', [R[0].STPT4.speed, R[0].STPT4.alt, R[0].STPT4.wypt_num, R[0].STPT4.route_num], [463, 3048, 4, 1]);

  /* une cartouche déjà là : on garde radios et réglages, on remplace les waypoints */
  const own = { name: 'Escadron', type: 'FA-18C_hornet',
                data: { type: 'FA-18C_hornet', name: '', terrain: 'Caucasus', COMM: { COMM1: { Channel_1: { frequency: 251 } } },
                        WYPT: { NAV_PTS: [{ id: 'STPT9', wypt_num: 9, x: 0, y: 0 }], NAV_ROUTE: [], mirror_NAV_PTS: false,
                                NAV_SETTINGS: { TACAN: { Channel: 74, OnOff: true } }, terrain: 'Caucasus' } } };
  const withOwn = mission.replace('["type"] = "FA-18C_hornet", ["skill"] = "Client",',
    '["type"] = "FA-18C_hornet", ["skill"] = "Client", ["DTC"] = { ["Cartridges"] = { [1] = { ["default"] = true, ["name"] = "Escadron", }, }, },');
  const src2 = zip([['mission', withOwn], ['DTC/Escadron.dtc', JSON.stringify(own)]]);
  const out2 = await MIZ.withDtc(src2, uzi.ref, PTS), after2 = entries(out2.bytes);
  eq('cartouche reprise : nom', out2.cartridge, 'Escadron - FL Briefing');
  eq('cartouche d\'origine intacte', after2.get('DTC/Escadron.dtc').data.toString('utf8'), JSON.stringify(own));
  const c2 = JSON.parse(after2.get('DTC/Escadron - FL Briefing.dtc').data.toString('utf8'));
  eq('reprise : radios gardées', c2.data.COMM, own.data.COMM);
  eq('reprise : réglages de navigation gardés', c2.data.WYPT.NAV_SETTINGS, own.data.WYPT.NAV_SETTINGS);
  eq('reprise : waypoints remplacés', c2.data.WYPT.NAV_PTS.map(p => p.wypt_num), [1, 2, 4]);
  const u2 = MIZ.parseLua(after2.get('mission').data.toString('utf8')).coalition.blue.country[1].plane.group[1].units;
  eq('unité : l\'ancienne cartouche reste, la nouvelle par défaut', u2[1].DTC,
     { AutoLoad: true, Cartridges: { 1: { name: 'Escadron', default: false }, 2: { name: 'Escadron - FL Briefing', default: true } } });
  eq('unité sans cartouche du même vol : la nouvelle seule', u2[2].DTC, { AutoLoad: true, Cartridges: { 1: { name: 'Escadron - FL Briefing', default: true } } });

  /* réécrire sur la copie : la cartouche du tableau est remplacée, pas doublée */
  const out3 = await MIZ.withDtc(out2.bytes, uzi.ref, PTS.slice(0, 2)), after3 = entries(out3.bytes);
  eq('réécriture : même cartouche', out3.cartridge, 'Escadron - FL Briefing');
  eq('réécriture : une seule entrée par fichier', [...after3.keys()].length, after2.size);
  eq('réécriture : nouveaux points', JSON.parse(after3.get('DTC/Escadron - FL Briefing.dtc').data.toString('utf8')).data.WYPT.NAV_PTS.length, 2);
  const u3 = MIZ.parseLua(after3.get('mission').data.toString('utf8')).coalition.blue.country[1].plane.group[1].units;
  eq('réécriture : références non doublées', u3[1].DTC.Cartridges,
     { 1: { name: 'Escadron', default: false }, 2: { name: 'Escadron - FL Briefing', default: true } });

  /* refus */
  const refus = async (label, fn, re) => { let e = ''; try { await fn(); } catch (x){ e = x.message; } eq(label, re.test(e), true); };
  const colt = zip([['mission', mission.replace(/FA-18C_hornet/g, 'F-16C_50')]]);
  await refus('vol qui n\'est pas un F/A-18C', () => MIZ.withDtc(colt, uzi.ref, PTS), /F\/A-18C/);
  await refus('aucun point', () => MIZ.withDtc(src, uzi.ref, []), /waypoint/);
  await refus('numéro au-delà de 59', () => MIZ.withDtc(src, uzi.ref, [{ n: 60, x: 0, y: 0, alt: 0 }]), /59/);
  await refus('numéro en double', () => MIZ.withDtc(src, uzi.ref, [PTS[0], PTS[0]]), /double/);
  await refus('vol introuvable', () => MIZ.withDtc(src, 'blue/1/plane/9', PTS), /vol/);

  console.log(`${n} vérifications, ${bad} en échec`);
  if (bad) process.exit(1);
})().catch(e => { console.log('ERREUR', e.message); process.exit(1); });
