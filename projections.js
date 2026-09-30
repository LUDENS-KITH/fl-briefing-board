/* Généré par tools/build_projections.py — ne pas modifier à la main.
   Projection transverse de Mercator (WGS84) de chaque théâtre DCS, mesurée sur les
   balises d'une installation du jeu, qui portent leur position DCS et leur
   latitude/longitude : x DCS = k0 · N + x0 (nord), y DCS = k0 · E + y0 (est), N et E
   de la projection d'échelle 1 centrée sur lon0. n : balises ; rms et max : écarts
   de l'ajustement, en mètres. */
const PROJECTIONS = {"Afghanistan": {"lon0": 63.0, "k0": 0.9996, "x0": -3759657.0, "y0": -300150.0, "n": 49, "rms": 0.04, "max": 0.07}, "Caucasus": {"lon0": 33.0, "k0": 0.9996, "x0": -4998115.0, "y0": -99517.0, "n": 164, "rms": 0.04, "max": 0.06}, "Kola": {"lon0": 21.0, "k0": 0.9996, "x0": -7543625.0, "y0": -62702.0, "n": 69, "rms": 0.04, "max": 0.06}, "MarianaIslands": {"lon0": 147.0, "k0": 0.9996, "x0": -1491840.0, "y0": 238417.99, "n": 19, "rms": 0.04, "max": 0.06}, "PersianGulf": {"lon0": 57.0, "k0": 0.9996, "x0": -2894933.01, "y0": 75756.0, "n": 101, "rms": 0.04, "max": 0.07}, "SinaiMap": {"lon0": 33.0, "k0": 0.9996, "x0": -3325313.0, "y0": 169222.0, "n": 169, "rms": 0.04, "max": 0.07}, "Syria": {"lon0": 39.0, "k0": 0.9996, "x0": -3879866.0, "y0": 282801.0, "n": 151, "rms": 0.04, "max": 0.07}};
if (typeof module !== 'undefined') module.exports = PROJECTIONS;
