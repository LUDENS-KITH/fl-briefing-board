# Développer — FL Briefing Board

Zéro dépendance, zéro build : on modifie, on recharge la page. Le contrat du moteur est dans [MODELE.md](MODELE.md), l'état vérifié dans [ETAT.md](ETAT.md).

## Structure du projet

```
FL Briefing Board/
├─ index.html        coquille : barre d'outils, palette, styles          (276 l.)
├─ symbols.js        les 28 formes, vues de profil, kit radar           (705 l.)
├─ board.js          le moteur : planches, carte, coupe, route, exports (2 125 l.)
├─ theatres.js       14 théâtres DCS et 791 aérodromes (généré, ne pas retoucher)
├─ magnetic.js       modèle magnétique WMM2025 (généré, ne pas retoucher)
├─ radar.js          vue radar liée : géométrie du B-scope, fonctions pures
├─ assets/           exports du logo (écusson, icône, .ico du raccourci) — ne pas retoucher
├─ tools/
│  ├─ creer-raccourci.ps1  crée le raccourci bureau (mode application)
│  ├─ build_theatres.py régénère theatres.js depuis les données de FlightLedger
│  ├─ build_magnetic.py régénère magnetic.js depuis tools/data/WMM2025.COF (NOAA)
│  ├─ test_magnetic.js  vérifie la déclinaison contre les 100 valeurs de test du NOAA
│  ├─ test_radar.js     vérifie la géométrie de la vue radar liée
│  ├─ banc-saisie.html  banc de saisie : l'application pilotée par de vrais événements
│  ├─ build_logo.py     régénère le logo : maîtres dans FlightLedger_BRAND, exports ici
│  ├─ build_social_preview.py image d'aperçu du dépôt (assets/readme/)
│  └─ logo-preview.html planche de contrôle du logo
├─ LICENSE           MIT pour le code ; noms et logos réservés (MARQUES-ET-CREDITS.md)
├─ CHANGELOG.md      ce qui a changé, version par version
└─ docs/
   ├─ GUIDE.md       guide d'utilisation, geste par geste
   ├─ GUIDE.en-US.md guide d'utilisation en anglais US
   ├─ DEVELOPPER.md  ce fichier
   ├─ ETAT.md        où en est le projet : vérifié, non vérifié, hors périmètre
   ├─ PLAN.md        ce qui vient ensuite : lots, ordre, critères de fin
   ├─ RADAR.md       kit radar : la source de chaque libellé et de chaque symbole
   ├─ MODELE.md      contrat interne : objets, interaction, persistance, ajout d'une forme
   └─ SOUTENIR.md    Ko-Fi, invitations Discord, crédits des soutiens
```

Les scripts restent à la racine délibérément : un sous-dossier `src/`
n'apporterait rien à 2 800 lignes et brouillerait le « double-clic sur `index.html` »
qui fait l'intérêt de l'outil.

## Logo

Écusson de la série des sous-produits FL, frère de FL Creator Missions. Les
fichiers maîtres vivent dans `FlightLedger_BRAND/logo/master-svg/`, comme l'exige
le manuel de marque ; ce projet n'en garde que des copies dans `assets/`. Pour le
modifier : `python tools/build_logo.py`, jamais le SVG à la main.

## Tester

```bash
node tools/test_magnetic.js
node tools/test_radar.js
```

Le premier vérifie la déclinaison magnétique contre les 100 valeurs de test officielles
du NOAA ; le second, la géométrie de la vue radar liée sur des cas calculés à la main.

```bash
python -m http.server 8765
```

puis ouvrir `http://localhost:8765/tools/banc-saisie.html` : le **banc de saisie**.
Chaque scénario ouvre l'application neuve dans un cadre et la pilote par de vrais
`PointerEvent` et `KeyboardEvent`, jamais en appelant le moteur ; le verdict (`OK n/n`,
ou la liste des échecs) s'affiche en haut et dans le titre de l'onglet. Un scénario
nouveau doit échouer avant le changement qu'il couvre ; ceux marqués « non-régression »
passaient déjà et doivent continuer.

Quand un script change, **monter son paramètre de version** dans `index.html`
(`board.js?v=…`) : sans cela, les navigateurs gardent l'ancienne version en cache.

Le reste de l'outil est vérifié en l'exécutant dans un navigateur : voir
[ETAT.md](ETAT.md) pour la liste datée des contrôles.

## Démo

`index.html?demo` ouvre un briefing d'exemple (frappe au Caucase, deux phases, carte,
route liée et coupe) **sans rien enregistrer** : le tableau du visiteur n'est jamais
touché. C'est la page d'accueil de la démo en ligne.
