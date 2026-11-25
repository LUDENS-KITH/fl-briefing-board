/* Les kneeboards d'une mission (lot 31) : rangés par appareil, comme DCS les montre.
   Usage : node tools/test_kneeboards.js [chemin d'un .miz réel]
   Sans argument, le .miz d'Opération Tripwire est cherché à son emplacement habituel ;
   absent, seule la mission fabriquée ici est vérifiée. */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const MIZ = require(path.join(__dirname, '..', 'miz.js'));

let bad = 0, n = 0;
function eq(label, got, want){
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)){ bad++; console.log(`ÉCHEC ${label} : attendu ${JSON.stringify(want)}, obtenu ${JSON.stringify(got)}`); }
}

/* une archive zip minimale ; data : texte ou octets */
function zip(files){
  const locals = [], centrals = []; let off = 0;
  for (const [name, content] of files){
    const raw = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8'), data = zlib.deflateRawSync(raw), nm = Buffer.from(name);
    const loc = Buffer.alloc(30); loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(8, 8);
    loc.writeUInt32LE(zlib.crc32(raw), 14); loc.writeUInt32LE(data.length, 18); loc.writeUInt32LE(raw.length, 22); loc.writeUInt16LE(nm.length, 26);
    const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(8, 10);
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

/* deux places joueur (Hornet et Viper), un ravitailleur IA qui n'en est pas une */
const mission = `mission = {
  ["theatre"] = "Caucasus",
  ["coalition"] = { ["blue"] = { ["country"] = { [1] = {
    ["plane"] = { ["group"] = {
      [1] = { ["name"] = "UZI 1", ["units"] = { [1] = { ["type"] = "FA-18C_hornet", ["skill"] = "Client", ["x"] = 0, ["y"] = 0 } },
              ["route"] = { ["points"] = { [1] = { ["x"] = 0, ["y"] = 0, ["alt"] = 1000 } } } },
      [2] = { ["name"] = "VIPER 1", ["units"] = { [1] = { ["type"] = "F-16C_50", ["skill"] = "Player", ["x"] = 10, ["y"] = 10 } },
              ["route"] = { ["points"] = { [1] = { ["x"] = 10, ["y"] = 10, ["alt"] = 1000 } } } },
      [3] = { ["name"] = "TEXACO", ["task"] = "Refueling", ["units"] = { [1] = { ["type"] = "KC-135", ["skill"] = "High", ["x"] = 5, ["y"] = 5 } },
              ["route"] = { ["points"] = { [1] = { ["x"] = 5, ["y"] = 5, ["alt"] = 6000 } } } },
    } },
  } } } },
}`;
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 4, 5, 6]);

(async () => {
  const bytes = zip([
    ['mission', mission],
    ['KNEEBOARD/IMAGES/page 10.png', PNG],
    ['KNEEBOARD/IMAGES/page 2.png', PNG],
    ['KNEEBOARD/IMAGES/lisez-moi.txt', 'pas une page'],
    ['Kneeboard/FA-18C_hornet/IMAGES/carrier.JPG', JPG],
    ['KNEEBOARD/fa-18c_hornet/case 1.png', PNG],               // casse différente, sans dossier IMAGES
    ['KNEEBOARD/A-10C_2/IMAGES/cas.png', PNG],                  // un appareil sans place joueur
    ['KNEEBOARD/A/B/trop profond.png', PNG],
  ]);
  const m = await MIZ.readMiz(bytes);
  eq('places joueur : types des appareils, sans le ravitailleur IA', m.playerTypes, ['F-16C_50', 'FA-18C_hornet']);
  const pages = await MIZ.kneeboards(bytes);
  eq('pages : images seules, rangement profond refusé', pages.length, 5);
  eq('pages communes dans l\'ordre des numéros', pages.filter(k => !k.type).map(k => k.file), ['page 2.png', 'page 10.png']);
  eq('octets d\'une page relus à l\'identique', Buffer.from(pages.find(k => k.file === 'carrier.JPG').data).equals(JPG), true);
  eq('type d\'image', pages.find(k => k.file === 'carrier.JPG').mime, 'image/jpeg');
  eq('Hornet : communes puis les siennes, toutes casses', MIZ.kneeboardPages(pages, 'FA-18C_hornet').map(k => k.file),
     ['page 2.png', 'page 10.png', 'carrier.JPG', 'case 1.png']);
  eq('Viper : les communes seulement', MIZ.kneeboardPages(pages, 'F-16C_50').map(k => k.file), ['page 2.png', 'page 10.png']);
  eq('par appareil : places joueur d\'abord, puis les pages sans place', MIZ.kneeboardTypes(pages, m.playerTypes),
     [{ type: 'F-16C_50', slot: true, count: 2 }, { type: 'FA-18C_hornet', slot: true, count: 4 },
      { type: 'A-10C_2', slot: false, count: 3 }]);
  eq('sans kneeboard', await MIZ.kneeboards(zip([['mission', mission]])), []);

  /* le .miz réel d'Opération Tripwire (golfe Persique, 4 Hornet) */
  const real = process.argv[2] || 'D:/Projects/_envois/PERSIAN GULF - Operation Tripwire - FA-18C Multi 4 - FlightLedger.miz';
  if (fs.existsSync(real)){
    const b = new Uint8Array(fs.readFileSync(real));
    const tm = await MIZ.readMiz(b), tp = await MIZ.kneeboards(b);
    eq('Tripwire : appareils des places joueur', tm.playerTypes, ['FA-18C_hornet']);
    eq('Tripwire : 13 pages dans l\'archive', tp.length, 13);
    eq('Tripwire : 8 pages communes', tp.filter(k => !k.type).length, 8);
    eq('Tripwire : 9 pages par Hornet', MIZ.kneeboardPages(tp, 'FA-18C_hornet').length, 9);
    eq('Tripwire : par appareil', MIZ.kneeboardTypes(tp, tm.playerTypes),
       [{ type: 'FA-18C_hornet', slot: true, count: 9 }, { type: 'F-15ESE', slot: false, count: 12 }]);
    eq('Tripwire : chaque page est une image lisible', tp.every(k => (k.mime === 'image/png' ? k.data[0] === 0x89 : k.data[0] === 0xff)), true);
  } else console.log(`(Tripwire absent : ${real} — seule la mission fabriquée est vérifiée)`);

  console.log(`${n} vérifications, ${bad} en échec`);
  if (bad) process.exit(1);
})().catch(e => { console.log('ERREUR', e.message); process.exit(1); });
