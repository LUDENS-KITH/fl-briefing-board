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
    loc.writeUInt32LE(data.length, 18); loc.writeUInt32LE(raw.length, 22); loc.writeUInt16LE(nm.length, 26);
    const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(stored ? 0 : 8, 10);
    cen.writeUInt32LE(data.length, 20); cen.writeUInt32LE(raw.length, 24); cen.writeUInt16LE(nm.length, 28);
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

  console.log(`${n} vérifications, ${bad} en échec`);
  if (bad) process.exit(1);
})().catch(e => { console.log('ERREUR', e.message); process.exit(1); });
