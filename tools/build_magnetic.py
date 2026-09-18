"""Génère magnetic.js : déclinaison magnétique par le modèle magnétique mondial WMM2025.

Source : tools/data/WMM2025.COF, coefficients officiels du NOAA (NCEI), domaine public,
téléchargés le 2026-09-18 depuis
https://www.ncei.noaa.gov/sites/default/files/2024-12/WMM2025COF.zip
Modèle valable de 2025,0 à 2030,0.

Le calcul est vérifié contre les valeurs de test officielles livrées avec le modèle :
node tools/test_magnetic.js

Usage : python tools/build_magnetic.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
COF = HERE / "tools" / "data" / "WMM2025.COF"
OUT = HERE / "magnetic.js"

ENGINE = r"""
/* Déclinaison magnétique (degrés, Est positif) au point (latitude, longitude
   géodésiques), à une date décimale et une altitude en km. Algorithme du rapport
   technique WMM : passage en coordonnées géocentriques, fonctions de Legendre
   quasi-normalisées de Schmidt, champ en sphérique, rotation vers l'ellipsoïde. */
function wmmDeclination(lat, lon, year, alt = 0){
  const N = 12, dt = year - WMM.epoch, deg = Math.PI / 180;
  const g = [], h = [];
  for (let n = 0; n <= N; n++){ g[n] = new Array(n + 1).fill(0); h[n] = new Array(n + 1).fill(0); }
  for (const [n, m, gg, hh, gd, hd] of WMM.coef){ g[n][m] = gg + dt * gd; h[n][m] = hh + dt * hd; }

  const A = 6378.137, f = 1 / 298.257223563, e2 = f * (2 - f), phi = lat * deg;
  const Rc = A / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const p = (Rc + alt) * Math.cos(phi), z = (Rc * (1 - e2) + alt) * Math.sin(phi);
  const r = Math.hypot(p, z), phic = Math.asin(z / r);
  const x = Math.sin(phic), s = Math.max(1e-10, Math.cos(phic)), lam = lon * deg, a = 6371.2;

  const P = [[1]], dP = [[0]];                      // en colatitude : x = cos θ, s = sin θ
  for (let n = 1; n <= N; n++){
    P[n] = []; dP[n] = [];
    for (let m = 0; m <= n; m++){
      if (m === n){
        const k = n === 1 ? 1 : Math.sqrt((2 * n - 1) / (2 * n));
        P[n][n] = k * s * P[n - 1][n - 1];
        dP[n][n] = k * (s * dP[n - 1][n - 1] + x * P[n - 1][n - 1]);
      } else {
        const a1 = (2 * n - 1) / Math.sqrt(n * n - m * m);
        const a2 = Math.sqrt(((n - 1) ** 2 - m * m) / (n * n - m * m));
        const p2 = n - 2 >= m ? P[n - 2][m] : 0, dp2 = n - 2 >= m ? dP[n - 2][m] : 0;
        P[n][m] = a1 * x * P[n - 1][m] - a2 * p2;
        dP[n][m] = a1 * (x * dP[n - 1][m] - s * P[n - 1][m]) - a2 * dp2;
      }
    }
  }

  let X = 0, Y = 0, Z = 0;                          // nord, est, bas — repère géocentrique
  for (let n = 1; n <= N; n++){
    const ar = (a / r) ** (n + 2);
    for (let m = 0; m <= n; m++){
      const cm = Math.cos(m * lam), sm = Math.sin(m * lam), gh = g[n][m] * cm + h[n][m] * sm;
      X += ar * gh * dP[n][m];
      Y += ar * m * (g[n][m] * sm - h[n][m] * cm) * P[n][m];
      Z -= ar * (n + 1) * gh * P[n][m];
    }
  }
  Y /= s;
  const psi = phic - phi, Xg = X * Math.cos(psi) - Z * Math.sin(psi);
  return Math.atan2(Y, Xg) / deg;
}
if (typeof module !== 'undefined') module.exports = { WMM, wmmDeclination };
"""


def main():
    lines = COF.read_text(encoding="ascii").splitlines()
    head = lines[0].split()
    epoch, model = float(head[0]), head[1]
    coef = []
    for ln in lines[1:]:
        if ln.startswith("9999"):
            break
        n, m, g, h, gd, hd = ln.split()
        coef.append([int(n), int(m), float(g), float(h), float(gd), float(hd)])
    assert len(coef) == 90, f"{len(coef)} coefficients au lieu de 90 (degré 12)"
    OUT.write_text(
        "/* Généré par tools/build_magnetic.py — ne pas modifier à la main.\n"
        f"   Modèle magnétique mondial {model} (NOAA, domaine public), époque {epoch},\n"
        "   valable jusqu'en 2030,0. Coefficients : [n, m, g, h, dg/dt, dh/dt]. */\n"
        f"const WMM = {{ model: {json.dumps(model)}, epoch: {epoch}, until: {epoch + 5}, coef: "
        f"{json.dumps(coef, separators=(',', ':'))} }};\n" + ENGINE,
        encoding="utf-8")
    print(f"{model} : {len(coef)} coefficients -> {OUT} ({OUT.stat().st_size} octets)")


if __name__ == "__main__":
    main()
