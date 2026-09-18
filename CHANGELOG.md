# Journal des versions — FL Briefing Board

Les dates sont celles de la livraison effective. Chaque version note ce qui a été
**vérifié en exécutant**, pas seulement écrit.

## v1.1 — 2026-09-18

Préparation du dépôt public, vitrine de LK Studio. **Rien n'est encore publié.**

### Ajouté
- **Signature LK Studio** dans chaque export : « FL Briefing Board · LK Studio ·
  l-k-studio.com », sur le PNG et en pied de kneeboard.
- Fenêtre **À propos** (ⓘ) : écusson, logo LK Studio, lien vers l-k-studio.com, passerelle
  vers **FlightLedger**, licence et mentions.
- **Mode démo** (`?demo`) : une frappe préparée au Caucase, deux phases, carte, route liée
  et coupe — **sans jamais toucher au tableau du visiteur**. Badge DÉMO dans la barre.
- **README vitrine**, capture de la démo, **image d'aperçu** du dépôt (1280 × 640),
  **licence MIT**, **MARQUES-ET-CREDITS.md** (noms et logos réservés, non-affiliation,
  sources des cartes et des données).
- Guide d'utilisation (`docs/GUIDE.md`) et guide de développement (`docs/DEVELOPPER.md`),
  extraits de l'ancien README.

### Modifié — décidé par Vince
- **La couche d'aérodromes est retirée de la version publique** : sa source ne publie
  aucune licence. `theatres.js` ne garde que l'emprise de chaque théâtre ; la case
  « Aérodromes » disparaît quand la couche est absente. `--aerodromes` la reproduit en
  local, à ne pas publier.

### Vérifié en exécutant
Démo : deux planches, carte du Caucase, route 0 / 47,9 / 69,8 NM · un objet posé dans la
démo laisse le stockage du visiteur identique à l'octet (284 octets) — une première sonde
qui concluait l'inverse comparait à une valeur perdue au rechargement · signature
présente dans le PNG · fenêtre À propos à l'écran · capture de démo et aperçu relus.

## v1.0 — 2026-09-18

### Ajouté
- **Caps magnétiques** : bouton **Cap vrai / Cap mag.** Les caps portent désormais leur
  référence : `049°V` (vrai, sur une carte), `042°M` (magnétique), sans suffixe sur une
  planche sans carte (haut de l'écran).
- **Déclinaison** : bouton **Décl.** Sur une carte, elle est **calculée au point de
  chaque mesure** par le modèle magnétique mondial **WMM2025** du NOAA (valable jusqu'en
  2030). Une **valeur saisie pour la planche l'emporte** — celle de la mission DCS, pour
  des caps identiques au cockpit (« 6 », « 6,5 », « 6E », « 2W », « -2 »). Annulable.
- Le **kneeboard** indique en pied de page la référence des caps et la déclinaison
  utilisée, saisie ou calculée.
- `tools/build_magnetic.py` génère `magnetic.js` depuis les coefficients officiels
  (`tools/data/WMM2025.COF`, domaine public) ; **`node tools/test_magnetic.js`** le
  vérifie contre les 100 valeurs de test du NOAA. **Premier test automatique du projet.**

### Vérifié en exécutant
100 points de référence NOAA : écart maximal 0,005° (arrondi des valeurs publiées) ·
le test échoue bien sur trois calculs volontairement faussés, dont l'oubli de la
correction d'ellipsoïde (1,2° d'écart) · Batumi → Kutaïssi : 049°V, 042°M avec la
déclinaison calculée (7,0° E au milieu du trajet), 044°M avec 5° saisis · sans carte ni
saisie : cap écran inchangé, bouton « Décl. ? » en orange · sans carte, 6E saisis :
084°M pour un cap écran de 090° · annulation de la saisie · lectures « 6 », « 6,5 »,
« 6E », « 2W », « 2 O », « -2 », vide, refus de « abc » et « 45 » · mode et valeur relus
après rechargement · pied de page du kneeboard · ouverture en `file://`.

### Constaté
Le modèle donne **7,4° E** au centre du Caucase aujourd'hui ; le manuel du Ka-50 écrit
« environ 5° ». DCS n'utilise donc pas forcément la déclinaison réelle du jour : d'où
la saisie par planche, prioritaire.

## v0.9 — 2026-09-18

Décidé par Vince : carte vivante, trois fonds (topographique, satellite, plan routier).

### Ajouté
- **Cartes des 14 théâtres DCS** en fond de la vue de dessus (Caucase, Syrie, Golfe
  Persique, Sinaï, Irak, Afghanistan, Mariannes, Mariannes 1944, Nevada, Normandie,
  La Manche, Atlantique Sud, Kola, Allemagne Guerre froide), cadrées sur l'emprise
  réelle de leurs aérodromes. Ce sont les cartes réelles des régions que DCS
  reproduit : la carte F10 du jeu n'est ni extractable ni réutilisable.
- **Carte vivante** : molette ou pincement pour zoomer ; clic droit, clic molette,
  espace + glisser, outil main (`H`) ou glisser dans le vide à l'outil sélection pour
  se déplacer. **Tout ce qui est posé suit le terrain** ; symboles, textes et traits
  gardent leur taille à l'écran.
- **Échelle et caps automatiques** : distances calculées à la latitude du tracé, plus
  d'étalonnage. Règle, cotes et route liée en profitent.
- **Trois fonds** : topographique (OpenTopoMap, relief), satellite (Esri), plan routier
  (OpenStreetMap). Sources affichées sur la carte et dans les exports.
- **791 aérodromes DCS sous leur nom DCS**, par-dessus la carte (case Aérodromes),
  extraits des données de FlightLedger par `tools/build_theatres.py`.
- **Kneeboard avec la carte** : tuiles chargées avant de dessiner, même emprise qu'à
  l'écran.
- Une planche déjà dessinée qui reçoit une carte est **convertie sans que rien ne
  bouge à l'écran** ; revenir à « Sans carte » fait l'inverse. Annulable.

### Corrigé — trouvés en testant
- Un kneeboard dont la coupe ne contenait que la route liée n'exportait pas la
  coupe : l'export ne regardait que les objets dessinés à la main.
- Relâcher un glisser de carte aurait planté : la fin de geste lisait l'objet
  déplacé, et un glisser de carte n'en a pas. Trouvé en relisant avant d'exécuter.

### Vérifié en exécutant
Sonde des fournisseurs depuis `file://` : OpenStreetMap, OpenTopoMap et Esri
chargés et exportables ; **CARTO écarté**, il renvoie une image « API KEY REQUIRED »
que la sonde déclarait « chargée » — vu en regardant les tuiles · chasseur resté à
(400, 300) quand la carte arrive · zoom à la molette : le point sous le curseur ne
bouge pas · déplacements par sélection et par clic droit, objets inchangés sur le
terrain · saisie d'un symbole après zoom · règle Batumi → Kutaïssi : **52,2 NM · 049°**
contre 52,1 NM · 49° vrai par grand cercle · retour sans carte par annulation, chasseur
à (400, 300) · pincement : zoom +1,00 pour un écart doublé, geste du premier doigt
annulé · satellite · kneeboard avec carte, non contaminé, coupe et route comprises ·
carte, style, zoom et route relus après rechargement · non-régression complète sans
carte · ouverture en `file://` : 14 théâtres listés, aucune erreur.

## v0.8 — 2026-09-18

### Ajouté
- **Coupe liée à la route** : case **Route liée** dans le bandeau de la coupe. La
  route, ce sont les waypoints de la vue de dessus dans l'ordre de leurs numéros ;
  la coupe la trace seule, en **distance cumulée le long de la route**, avec la
  longueur de chaque branche et l'altitude de chaque waypoint.
- **Déplacer un waypoint en haut** recalcule la coupe en bas. **Tirer un waypoint en
  bas**, verticalement, règle son altitude (calée sur 500 ft) ; **double-clic** pour la
  taper (« FL250 », « 25 000 », « 8000 ft »). Un waypoint sans altitude reprend celle
  du précédent, le premier 10 000 ft.
- L'altitude s'affiche aussi **sous le waypoint en vue de dessus**, jointe à son
  étiquette (« IP NORD · 10 000 ft »).
- À l'activation, la **largeur de la coupe s'ouvre** assez pour montrer toute la
  route ; une seule annulation défait l'activation et l'élargissement ensemble.
- Sans deux waypoints, ou sans échelle en vue de dessus, la coupe **le dit** au lieu
  d'inventer une distance.
- La route liée part dans le **kneeboard**, avec la coupe.

### Vérifié en exécutant
Messages sans waypoint et sans échelle · route WP1 0,0 → WP2 30,0 → WP3 48,0 NM à
10 px/NM · largeur ouverte de 40 à 80 NM, défaite puis rétablie en une annulation ·
WP2 tiré à FL255, WP3 en hérite · FL180 tapé sur WP3 · WP2 déplacé en vue de dessus :
30,0 → 50,0 NM, WP3 recalculé · annulations du déplacement puis de l'altitude ·
lecture « FL250 », « 25 000 », « 8000 ft », « fl090 », refus de « abc » · altitude
affichée sous le waypoint du plan · case, largeur et altitudes relues après
rechargement · kneeboard : 1 210 pixels de route dans la bande de coupe, 0 route
déliée · non-régression plan et coupe libre, 40 annulations jusqu'au vide.

## v0.7 — 2026-09-18

Décidé par Vince : écran partagé, pieds et niveaux de vol.

### Ajouté
- **Coupe (vue de profil)** : bouton **⊟ Coupe**, qui partage l'écran — vue de dessus
  en haut, coupe en bas. Axe vertical en pieds, niveaux de vol au-dessus de 18 000 ft ;
  axe horizontal en distance au sol, en NM ou en km.
- **Silhouettes de profil** pour 14 formes : chasseur, bombardier, ravitailleur,
  civil, AWACS, drone, hélicoptère, missile, bombe, char, radar, lanceur sol-air,
  navire, porte-avions. Un appareil orienté vers la gauche est **retourné**, pas mis
  sur le dos. Les marqueurs tactiques gardent leur vue de dessus.
- **Altitude affichée** au-dessus de chaque aéronef ou munition de la coupe, avec son
  indicatif : « HAWG 1-1 · 1 000 ft ». Altitudes **calées sur 500 ft** au lâcher.
- Trois outils propres à la coupe, dans son bandeau : **relief** (crête tracée à main
  levée, remplie jusqu'au sol), **menace sol-air** (dôme posé au sol, rayon et plafond
  affichés), **bloc d'altitude** (tranche pleine largeur, « FL200 – FL250 »).
- **Plafond** (10 000 à 60 000 ft) et **largeur** (10 à 160 NM) réglables par planche.
  Les changer **recale** les objets : une altitude et une distance posées restent
  vraies. Annulable.
- La règle et les cotes, dans la coupe, donnent **distance au sol et écart
  d'altitude** (« 20.0 NM · +20 000 ft ») au lieu d'un cap.
- **Kneeboard** : quand la coupe est ouverte, elle est exportée en bas de page, sous
  le plan, avec des textes à taille lisible.

### Corrigé — trouvés en testant
- Près du sol, l'indicatif placé sous un appareil passait sous la ligne de sol et
  les graduations. Dans la coupe, tout s'écrit au-dessus du symbole.
- Dans le kneeboard, les textes de la coupe tombaient vers 7 px : la bande de coupe
  était réduite à 60 % et héritait du grossissement calculé pour le plan. Elle a
  désormais le sien, graduations comprises.

### Vérifié en exécutant
Chasseur lâché à 25 230 ft → FL250 · orienté à gauche : 180°, retourné · déplacé et
recalé à FL320 · dôme FL225, rayon 5,1 NM · bloc FL200 – FL250 · relief, dôme et bloc
posés sous les symboles · règle de coupe « 20.0 NM · +20 000 ft » · outil de coupe
sans effet dans le plan · plafond 40 000 → 60 000 ft et largeur 40 → 80 NM sans
altérer altitudes ni distances, puis annulés · kneeboard 768 × 1024 plan + coupe ·
écran partagé, plafond et scène relus après rechargement · non-régression du plan
écran partagé ouvert (pose, déplacement, étiquette, flèche, zone, règle étalonnée,
gomme, 30 annulations jusqu'au vide) · aucun mélange entre plan et coupe au clic.

## v0.6 — 2026-09-18

### Ajouté
- **Cotes sur les traits et les flèches** : bouton **📐 Cotes**. Allumé, il cote les
  prochains traits et flèches — distance et cap — et cote ou décote la sélection.
  Sur une flèche courbe, la distance est **celle du chemin tracé** (ce qu'on vole),
  le cap celui du départ vers l'arrivée. La cote se place au milieu du trait, décalée
  vers le haut pour ne pas le masquer.
- **Unité NM / km** : bouton qui bascule toutes les distances — cotes, règle — et la
  question d'étalonnage. 1 NM = 1,852 km. Préférence conservée d'une ouverture à
  l'autre.

### Corrigé — trouvé en relisant le code
- La regex qui retire les accents des noms de fichiers exportés contenait les
  caractères combinants eux-mêmes au lieu de `\u0300-\u036f` : invisibles, et
  réécrits par l'outil d'écriture. Échappement rétabli ; « Égress Öst — phase 2 »
  donne bien `egress-ost-phase-2`.

### Vérifié en exécutant
Trait de 300 px à 15 px/NM : « 20.0 NM · 090° », puis « 37.0 km · 090° » ·
caps 360° (nord) et 225° (sud-ouest) · flèche courbe : 22,0 NM le long du chemin
contre 20,0 NM de corde · cote retirée puis remise sur la sélection · trait tracé
cotes éteintes : non coté · étalonnage demandé en km, 55,56 km sur 300 px → 10 px/NM ·
unité km relue après rechargement · rendu à l'écran des cotes droites et courbes.

## v0.5.1 — 2026-09-18

### Ajouté
- **Raccourci bureau** « FL Briefing Board » : ouvre l'outil dans sa propre fenêtre
  (mode application de Brave, à défaut Chrome, à défaut Edge), avec l'icône de
  l'écusson. `tools/creer-raccourci.ps1` le recrée à la demande.
- `assets/fl-briefing-board.ico` (16 à 256 px), rastérisé depuis l'icône SVG.

### Vérifié en exécutant
Chargement en `file://` (Chrome sans interface) : 28 vignettes, onglets de planche,
aucun bandeau d'erreur — première vérification de l'ouverture locale. Raccourci
relu : cible, arguments et icône existent. Script lisible par Windows PowerShell 5.1
(BOM UTF-8 ajouté, accents corrects à l'exécution).

## v0.5 — 2026-09-18

Les sept suggestions retenues par Vince (« tout »).

### Ajouté
- **Étiquettes attachées** : double-clic sur une forme (ou outil texte sur une forme)
  pour y attacher indicatif, altitude, vitesse. L'étiquette suit la forme quand on la
  déplace ; la vider la supprime. Même geste sur un texte pour le corriger.
- **Planches par phase** : onglets en bas du tableau. « + phase » crée une copie de la
  planche affichée, à faire évoluer ; double-clic pour renommer ; `PgPréc` / `PgSuiv`.
  Chaque planche a sa scène, son historique d'annulation et son échelle.
- **Styles de trait** : plein (réel), tirets (prévu), pointillés (menace, incertain),
  pour flèches, traits, cercles, rectangles, crayon et zones ; applicables à la sélection.
- **Six symboles** : AWACS, drone, éjection (CSAR), leurres, FARP, bullseye. **28 formes.**
- **Zones hachurées** (`Z`) : cliquer les sommets, refermer sur le premier ou
  double-cliquer ; sommets déplaçables ; étiquette en haut de la zone ; placées sous
  les symboles.
- **Règle** (`M`) : distance et cap. En pixels tant que la planche n'est pas étalonnée ;
  bouton **Échelle** pour déclarer la distance réelle d'une mesure en NM. Agrandir la
  carte de fond met l'échelle à jour.
- **Export kneeboard DCS** : PNG portrait 768 × 1024, en-tête avec le nom de la
  planche, cadrage sur le contenu.

### Modifié
- Stockage local `v2` → `v3` (planches). Un tableau `v2` est relu une fois comme
  « Phase 1 ».
- « Effacer » n'efface que la planche affichée.

### Corrigé — trouvés en testant
- L'étiquette d'une zone, placée au centre, disparaissait sous le symbole qu'on y
  pose (« CAP NORD » sous l'AWACS). Elle est placée en haut de la zone.
- Le kneeboard réduisait une planche paysage à ~70 % : étiquettes à ~8 px, illisibles.
  À l'export, les textes gardent au moins leur taille écran.

### Vérifié en exécutant
Non-régression v0.4 (4 contrôles) · étiquette posée, suivie au déplacement, éditée à
l'outil texte, supprimée, annulée · style appliqué à la sélection · zone refermée sur
son premier point, placée sous les symboles, étiquetée, sommet déplacé, tracé annulé
par `Échap` · règle 300 px → 20,0 NM après étalonnage, caps 360° et 090° · étalonnage
annulable · planche ajoutée par copie, déplacement sans effet sur la précédente,
historique propre, renommage, `PgPréc`/`PgSuiv`, suppression · carte agrandie ×1,25 →
échelle ×1,25 · kneeboard 768 × 1024 non contaminé · scène de 21 objets relue après
rechargement de la page.

## v0.4 — 2026-09-18

### Corrigé — signalés par Vince
- **Une forme posée ne se déplaçait pas** sans passer par l'outil sélection (`V`),
  que rien ne signalait : chaque clic posait une nouvelle forme, même sur une forme
  existante. Désormais, avec une forme choisie dans la palette, **toucher une forme
  ou un texte existant le saisit** ; toucher le vide en pose une nouvelle. Le
  curseur passe en « déplacer » au survol. Flèches et carte de fond restent hors de
  cette saisie, pour pouvoir poser un symbole dessus.
- **Choisir une couleur repeignait la forme qu'on venait de poser** au lieu de
  préparer la suivante : elle restait sélectionnée. Une forme posée est maintenant
  lâchée ; on la reprend en la touchant.

### Corrigé — trouvés en testant
- Un simple toucher pour sélectionner laissait une entrée vide dans l'historique :
  l'instantané n'est plus pris qu'au premier mouvement.
- Les scripts portent un numéro de version (`?v=`) : le navigateur servait une
  ancienne copie de `symbols.js` depuis son cache.

### Ajouté
- Groupe **Armement / Effets** : missile (avec traînée indiquant le sens de vol),
  bombe, explosion, abattu (appareil barré, marque « splash »). **22 formes.**

### Vérifié en exécutant
Forme posée puis déplacée sans changer d'outil · toucher le vide pose · toucher sans
bouger n'ajoute rien à l'historique · couleur choisie après une pose ne repeint pas
la forme posée · pose sur carte de fond sans la déplacer · annulation du déplacement ·
rendu des quatre nouveaux symboles.

## v0.3 — 2026-09-18

### Ajouté
- **Logo** : écusson de sous-produit FL, frère de FL Creator Missions — écusson
  hexagonal, nom réparti haut / bas, axe d'attaque courbe (ami → waypoint →
  hostile) sur grille radar. Palette officielle seulement, aucune balise `<text>`,
  conformément au manuel de marque.
- Icône d'onglet et icône dans l'en-tête de la barre d'outils.
- `tools/build_logo.py` régénère le logo : maîtres dans
  `FlightLedger_BRAND/logo/master-svg/`, exports dans `assets/`.
- `tools/logo-preview.html` : planche de contrôle (tailles, fonds clair et sombre,
  16 px rastérisés réellement, comparaison avec Creator).

### Vérifié en exécutant
Planche rendue à 300, 128, 64, 32 et 16 px · icône lisible à 16 px réels ·
favicon et en-tête chargés dans l'application, 18 formes toujours présentes.

## v0.2.1 — 2026-09-17

### Corrigé
- La gomme pouvait supprimer l'**image de fond** : un clic dans une zone vide faisait
  disparaître la carte. Rendre les images sélectionnables (v0.2) les avait rendues
  effaçables. La gomme les ignore désormais ; une image se retire par sélection
  puis `Suppr`.
- La gomme **ratait le milieu d'un trait tracé vite** : le test de contact ne
  regardait que les points enregistrés, et un geste rapide n'en produit que
  quelques-uns. Il mesure désormais la distance aux segments. Trouvé en vérifiant le
  correctif précédent.

### Vérifié en exécutant
Gomme au milieu d'un trait rapide (supprimé) · gomme dans une zone vide au-dessus
d'une carte (carte conservée) · carte retirée par sélection puis `Suppr`.

### Ajouté
- Documentation structurée : [docs/ETAT.md](docs/ETAT.md) (où en est le projet, ce
  qui est vérifié et ce qui ne l'est pas) et [docs/MODELE.md](docs/MODELE.md)
  (schéma des objets, machine d'interaction, persistance, ajout d'une forme).

## v0.2 — 2026-09-17

Bascule de fond : **on pose des formes, on ne les dessine plus**.

### Ajouté
- **Palette de 18 formes** paramétriques rangées en trois groupes — aéronefs
  (chasseur, bombardier, ravitailleur, civil, hélicoptère), sol et mer (char, radar,
  menace sol-air, aéroport, navire, porte-avions), tactique (ami, hostile, inconnu,
  waypoint numéroté, objectif, orbite, point IP).
- **Pose orientée en un seul geste** : appuyer, tirer dans la direction du cap, la
  distance donne la taille.
- **Reprise des objets** : sélection, déplacement, poignée de rotation et d'échelle,
  rotation fine au clavier, duplication, premier plan, suppression.
- **Flèches incurvables** : tracé droit puis courbure par la poignée centrale ; la
  pointe suit la tangente. Mode double sens.
- **Recoloration de la sélection** : une pastille repeint l'objet choisi au lieu
  d'attendre le prochain tracé. Idem pour l'épaisseur.
- Palette masquable ; garde-fou affiché si un fichier ne se charge pas.

### Modifié
- Découpage en trois fichiers : `index.html` (coquille), `symbols.js` (formes),
  `board.js` (moteur).
- Numéro de waypoint replacé **à l'intérieur** du losange.
- Format de stockage local `v1` → `v2` (ajout de l'angle, de l'échelle et du point de
  contrôle). Un tableau `v1` est oublié plutôt que rechargé de travers.

### Corrigé
- **Les quatre voilures fixes étaient indiscernables** à petite taille. Envergure,
  flèche, nombre de moteurs et taille par défaut les séparent désormais ; le
  ravitailleur porte sa perche, le civil son empennage en T, le bombardier ses
  quatre moteurs.
- **La zone de préhension était un cercle centré sur le fuselage** : impossible
  d'attraper un bombardier par son aile ou un cercle SAM par son anneau. Chaque forme
  déclare maintenant son rayon.

### Vérifié en exécutant
Chargement (18 formes, 0 erreur console) · pose orientée (cap 135°, échelle 1,72) ·
courbure de flèche · recoloration · saisie par le bout d'aile · duplication et
suppression · quatre annulations en chaîne · export PNG · scène de 26 objets.

## v0.1 — 2026-09-17

Première version utilisable : fichier unique, zéro dépendance, zéro build.

### Ajouté
- Crayon, flèche, trait, cercle, rectangle, texte, gomme par objet.
- 10 symboles dessinés en code, 6 couleurs de la palette FlightLedger, 3 épaisseurs.
- Image de fond par glisser-déposer ou collage, fond sombre ou clair.
- Annuler / rétablir, export PNG horodaté, reprise locale hors images.

### Corrigé
- **Annuler après un effacement supprimait l'objet précédent** au lieu de restituer
  ce qui venait d'être effacé : l'historique empilait les objets retirés et non les
  états. Remplacé par des instantanés.

### Cadrage retenu le 2026-09-17
Projet autonome hors `FlightLedger_V2` (en production) · tableau libre, sans
dépendance aux données FL · un meneur dessine, les autres regardent.
