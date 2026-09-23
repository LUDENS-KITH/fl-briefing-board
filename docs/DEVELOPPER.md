# Développer — FL Briefing Board

Zéro dépendance, zéro build : on modifie, on recharge la page. Le contrat du moteur est dans [MODELE.md](MODELE.md), l'état vérifié dans [ETAT.md](ETAT.md).

## Structure du projet

```
FL Briefing Board/
├─ index.html        coquille : barre d'outils, palette, styles          (174 l.)
├─ symbols.js        les 28 formes, vues de dessus et de profil         (396 l.)
├─ board.js          le moteur : planches, carte, coupe, route, exports (1 632 l.)
├─ theatres.js       14 théâtres DCS et 791 aérodromes (généré, ne pas retoucher)
├─ magnetic.js       modèle magnétique WMM2025 (généré, ne pas retoucher)
├─ assets/           exports du logo (écusson, icône, .ico du raccourci) — ne pas retoucher
├─ tools/
│  ├─ creer-raccourci.ps1  crée le raccourci bureau (mode application)
│  ├─ build_theatres.py régénère theatres.js depuis les données de FlightLedger
│  ├─ build_magnetic.py régénère magnetic.js depuis tools/data/WMM2025.COF (NOAA)
│  ├─ test_magnetic.js  vérifie la déclinaison contre les 100 valeurs de test du NOAA
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
   ├─ MODELE.md      contrat interne : objets, interaction, persistance, ajout d'une forme
   └─ SOUTENIR.md    Ko-Fi, invitations Discord, crédits des soutiens
```

Les trois fichiers restent à la racine délibérément : un sous-dossier `src/`
n'apporterait rien à 1 700 lignes et brouillerait le « double-clic sur `index.html` »
qui fait l'intérêt de l'outil.

## Logo

Écusson de la série des sous-produits FL, frère de FL Creator Missions. Les
fichiers maîtres vivent dans `FlightLedger_BRAND/logo/master-svg/`, comme l'exige
le manuel de marque ; ce projet n'en garde que des copies dans `assets/`. Pour le
modifier : `python tools/build_logo.py`, jamais le SVG à la main.

## Tester

```bash
node tools/test_magnetic.js
```

Vérifie la déclinaison magnétique contre les 100 valeurs de test officielles du NOAA.
Le reste de l'outil est vérifié en l'exécutant dans un navigateur : voir
[ETAT.md](ETAT.md) pour la liste datée des contrôles.

## Démo

`index.html?demo` ouvre un briefing d'exemple (frappe au Caucase, deux phases, carte,
route liée et coupe) **sans rien enregistrer** : le tableau du visiteur n'est jamais
touché. C'est la page d'accueil de la démo en ligne.
