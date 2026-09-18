/* Vérifie magnetic.js contre les valeurs de test officielles du NOAA (WMM2025).
   Usage : node tools/test_magnetic.js
   Sort en erreur si une déclinaison s'écarte de plus de 0,01° (les valeurs de
   référence sont publiées au centième). */
const fs = require('fs'), path = require('path');
const { wmmDeclination } = require(path.join(__dirname, '..', 'magnetic.js'));

const rows = fs.readFileSync(path.join(__dirname, 'data', 'WMM2025_TestValues.txt'), 'latin1')
  .split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#')).map(l => l.trim().split(/\s+/).map(Number));

let worst = 0, bad = 0;
for (const [year, alt, lat, lon, decl] of rows){
  const got = wmmDeclination(lat, lon, year, alt), err = Math.abs(got - decl);
  worst = Math.max(worst, err);
  if (err > 0.01){ bad++; console.log(`ÉCART ${year} ${lat},${lon} alt ${alt} km : attendu ${decl}, obtenu ${got.toFixed(3)}`); }
}
console.log(`${rows.length} points de référence, écart maximal ${worst.toFixed(4)}°, ${bad} hors tolérance`);
if (!rows.length || bad) process.exit(1);          // aucun point lu = échec, pas succès
