# Journal des versions — FL Briefing Board

Les dates sont celles de la livraison effective. Chaque version note ce qui a été
**vérifié en exécutant**, pas seulement écrit.

## v1.8 — 2026-09-30

Lot 7 du [plan d'action](docs/PLAN.md), engagé par Vince : l'animation entre phases.

### Ajouté
- En présentation, **passer d'une phase à l'autre joue la manœuvre** : chaque objet
  présent des deux côtés glisse de sa place à la nouvelle — position, cap par le plus
  court chemin, couleur, points d'un tracé —, ce qui n'existe que d'un côté paraît ou
  disparaît en fondu ; la carte, la route liée et la vue radar suivent. 1,6 s, entre
  deux planches du même repère.
- Chaque objet porte un **identifiant stable**, gardé par « + phase », neuf pour une
  copie Ctrl+D : c'est par lui qu'un appareil se reconnaît d'une planche à l'autre.
- La démo le joue : Ingress → Attaque.
- Banc de saisie : 3 scénarios de plus, 40 en tout.

### Corrigé — trouvé en regardant
- Un appareil recoloré entre deux phases changeait de couleur d'un coup : sa couleur
  glisse désormais aussi.

### Vérifié en exécutant
Banc 40/40, les 3 nouveaux rouges avant le code · démo dans Brave, vrais événements,
trois captures pendant la transition · vue radar liée : un contact passe de 40,x NM à
11° puis 0° pendant la transition.

## v1.7 — 2026-09-30

Lot 6 du [plan d'action](docs/PLAN.md), engagé par Vince : importer une mission DCS.

### Ajouté
- **⇧ Mission**, ou glisser un `.miz` : la mission devient une nouvelle planche — route
  du vol choisi (waypoints numérotés, noms, altitudes, route liée ouverte), bullseye de
  sa coalition, défenses aériennes et navires des deux camps.
- **Projection des théâtres mesurée** (`projections.js`, `tools/build_projections.py`) :
  une Mercator transverse WGS84 ajustée sur les balises de l'installation du jeu, qui
  portent leur position DCS et leur latitude/longitude. Écart de 4 cm sur 7 théâtres.
- Théâtre sans projection mesurée : planche sans carte à l'échelle exacte, nord de la
  grille en haut, caps « G ».
- `miz.js`, sans dépendance : archive zip, table Lua, contenu de la mission ;
  **`node tools/test_miz.js`**, 46 vérifications.
- Banc de saisie : 3 scénarios de plus, 37 en tout.

### Inconnue levée
Le plan voulait des paramètres de projection publiables. Le fichier du jeu qui les
déclare est chiffré : il n'est pas lu. Ils sont mesurés, sur les paires de coordonnées
des balises ; seules quatre valeurs par théâtre sont publiées, et elles tombent sur les
réglages de l'UTM (méridiens entiers, échelle 0,9996).

### Vérifié en exécutant
Projection et inverse contre pyproj à 1 mm · test en échec sur six calculs faussés ·
missions réelles de l'escadron : départ piste de Goudaouta à 0,00 km du point de
référence du terrain, sept départs parking à 0,3 – 1,1 km · deux missions réelles
importées dans Brave en `file://`, capture relue · banc 37/37.

### Constaté
- Une route plus longue que 160 NM dépasse la largeur maximale de la coupe.
- Beaucoup de groupes sur un même terrain serrent leurs étiquettes.

## v1.6 — 2026-09-30

Lot 5 du [plan d'action](docs/PLAN.md), engagé par Vince : le mode présentation.

### Ajouté
- **▶ Présenter** (`F5`) : plein écran, barres, palette, onglets et contrôles de carte
  masqués ; un repère discret dit la phase affichée.
- Phases au clavier : `→`, `Espace`, `PgSuiv` suivante ; `←`, `PgPréc` précédente ;
  `Début`, `Fin`.
- **Pointeur laser** : un point rouge suit la souris ; un glissé bouton gauche trace un
  trait qui s'éteint seul en une seconde et demie. Hors tableau, hors historique, hors
  export.
- La carte reste mobile en présentation ; rien ne s'édite. `Échap` sort, et sortir du
  plein écran par le navigateur sort aussi.
- Banc de saisie : 3 scénarios de plus, 34 en tout.

### Vérifié en exécutant
Banc 34/34, les 3 nouveaux rouges avant le code · Brave sans interface, vrais
événements d'entrée, en `file://` : plein écran accordé au clic, laser, phase suivante,
Échap qui rend les barres ; capture relue.

## v1.5 — 2026-09-30

Lot 4 du [plan d'action](docs/PLAN.md), engagé par Vince : le fichier de briefing.

### Ajouté
- **Enregistrer le briefing** (⇩ Briefing, `Ctrl+S`) : toutes les planches, leurs
  réglages et leurs images dans un fichier `.json` versionné.
- **Ouvrir un briefing** (⇧ Ouvrir, `Ctrl+O`, ou glisser le fichier sur la page) : il
  remplace le tableau affiché après confirmation. Un fichier qui n'est pas un briefing
  est refusé ; d'un fichier reçu, on ne garde que ce que le moteur sait dessiner.
- **Les images de fond sont gardées d'une ouverture à l'autre** : leurs octets vivent
  en IndexedDB. Une image introuvable au démarrage est retirée, et on le dit.
- Banc de saisie : 4 scénarios de plus, 31 en tout.

### Vérifié en exécutant
Banc 31/31, les 4 nouveaux rouges avant le code · Brave sans interface en `file://`,
comme le raccourci bureau : image relue après rechargement ; briefing enregistré dans un
profil, ouvert dans un second profil vierge : identique, image comprise · un nom de
planche piégé en HTML reste du texte · la barre garde sa hauteur.

### Constaté
- La persistance en `file://`, notée non vérifiée depuis la v0.9, l'est désormais, dans
  Brave.

## v1.4 — 2026-09-30

Lot 3 du [plan d'action](docs/PLAN.md) : la vue radar liée.

### Ajouté
- **Vue radar liée** : le panneau du bas montre, au choix, la coupe ou l'écran radar
  TWS d'un **porteur** (F/A-18C ou F-16C), calculé depuis la vue de dessus. Chaque
  aéronef y devient un contact, à son gisement et à sa distance ; sa tige ou son trait
  de nez montre son cap rapporté au porteur. Déplacer une cible ou tourner le porteur
  met l'écran à jour.
- La lecture de chaque contact : distance, gisement, **aspect** au format du F-16C
  (« 9D », « 14G », « 18 »), **chaude**, **froide** ou **au travers**, et **radiale**, la
  part de sa vitesse le long de la ligne de visée. Contacts hors balayage ou au-delà
  de l'échelle comptés.
- Le **cône balayé** du porteur se dessine sur la vue de dessus.
- Planche **« Interception »** dans la démo ; le kneeboard emporte la vue radar.
- `radar.js`, fonctions pures, et **`node tools/test_radar.js`** : 26 vérifications.
- Banc de saisie : 4 scénarios de plus, 27 en tout.

### Écart au plan
- Le plan annonçait les catégories HOT, FLANK, BEAM, COLD. Aucun manuel lu ne donne
  leurs bornes : la vue donne l'aspect chiffré (F-16C, p. 405), l'hémisphère (p. 404)
  et la part radiale, grandeur que juge le filtre Doppler (p. 391), sans trancher.

### Corrigé — trouvés en regardant
- L'écran et la première piste du panneau radar sortaient presque noirs : la couleur
  du trait est posée par `drawObj`, pas par `paintSym`.
- Une cible exactement au travers se lisait « froide » : à 0 % affiché, elle se lit
  désormais « au travers ».

### Vérifié en exécutant
`node tools/test_radar.js` 26/26, et en échec sur quatre calculs volontairement faussés
— dont un que la première version du test laissait passer · banc 27/27 · interception
relue en image, tiges comprises · kneeboard · démo sans erreur console.

## v1.3 — 2026-09-30

Lot 2 du [plan d'action](docs/PLAN.md) : le kit radar, F/A-18C puis F-16C comme décidé
par Vince.

### Ajouté
- **Kit radar F/A-18C**, un groupe de la palette : écrans RDR ATTK en **RWS, TWS et STT**
  (20 boutons et leurs libellés, B-scope, échelle des distances, B-sweep, chevron
  d'élévation, horizon et vecteur vitesse), **briques**, **HAFU** ami, inconnu et
  hostile avec leur **tige de cap**, marques **L&S** et **DT2**, **curseur TDC**.
- Chaque élément cite sa page du manuel ED dans [docs/RADAR.md](docs/RADAR.md) ; ce que
  le manuel ne donne pas n'est pas dessiné, et la liste en est tenue.
- Un écran se pose **sous** les pistes et reste traversable ; `↑` `↓` règlent son
  échelle, `←` `→` son azimut balayé.
- **L&S et DT2 sont des états de piste** : posés sur un HAFU, uniques par planche, comme
  dans l'avion.
- **Kit radar F-16C**, lu dans son propre manuel : écrans FCR en **RWS et TWS**
  (libellés, échelle entre ses flèches, largeur de balayage A6, A3, A1 et ses limites,
  échelle d'élévation d'antenne, horizon, repères de distance), cibles de recherche
  **chaude** et **froide**, **pistes TWS** et **pistes système** qui tournent avec le cap
  sol, **cible désignée**, **curseur A-A**, **brouillage**, **bullseye**.
- Une marque ne se pose que sur une piste **du même appareil**.
- Deux planches dans la démo, **« Radar F/A-18C »** et **« Radar F-16C »** : un écran TWS
  ancré, ses pistes et sa légende.
- Banc de saisie : 8 scénarios de plus, 23 en tout.

### Modifié
- Une forme peut être **droite** (elle ne tourne pas, seule sa tige suit le cap),
  **à taille fixe au geste** (la poignée redimensionne encore), **carrée** à la
  désignation, **posée dessous**, **posée par-dessus** ou porter une **couleur
  d'identité** : champs `upright`, `stem`, `fixed`, `box`, `under`, `over`, `col`
  ([MODELE.md](docs/MODELE.md) §8).
- `draw(c, o)` reçoit l'objet ; une vignette peut être inclinée (`tileA`) : sans cela,
  une piste TWS du F-16C ressemblait à une cible froide.

### Constaté en construisant
- **Un HAFU se saisissait au lieu de recevoir sa L&S** : avec une forme choisie, toucher
  une piste la déplace. L&S et DT2 sont devenus des marques de la piste, ce que dit le
  manuel (p. 173, 176) ; le curseur TDC se pose par-dessus.
- Les premiers scénarios du lot échouaient faute de vignettes, puis parce que la palette
  plantait sur `draw(c)` sans objet : des échecs qui ne prouvaient rien. Le moteur a été
  modifié en deux temps pour qu'ils échouent sur le comportement.

- Le scénario clavier du FCR passait dès que les formes existaient : le moteur était
  déjà générique. Seules les marques par appareil ont demandé du code, et leur scénario
  échouait avant.

### Vérifié en exécutant
Banc 23/23 · rendu relu en image : pages RWS, TWS et STT du F/A-18C, FCR RWS et TWS du
F-16C, vignettes, planches de démo, kneeboard · démo publique v1.2 vérifiée après
fusion du lot 1, aucune erreur console.

## v1.2 — 2026-09-30

Lot 1 du [plan d'action](docs/PLAN.md), demandé par Vince : ancrer une forme, et
retrouver l'outil de sélection d'un clic droit.

### Ajouté
- **Ancrer** (📌 ou `K`) : un objet ancré ne se déplace plus, ne tourne plus et ne
  s'efface plus (gomme, `Suppr`) ; on pose et on saisit par-dessus sans le bousculer.
  Couleur, trait et étiquette restent libres ; une copie naît libre. Sur une carte,
  glisser sur un objet ancré déplace la carte. Annulable, conservé à la réouverture.
- **Retour à la sélection** : un clic droit sans bouger, ou `Échap`, abandonne le geste
  en cours (zone commencée, forme en cours de pose) et reprend l'outil Sélection.
  Glissé, le clic droit déplace toujours la carte.
- **Banc de saisie** (`tools/banc-saisie.html`) : premier filet automatique du moteur,
  15 scénarios pilotés par de vrais événements pointeur et clavier.
- Un refus n'est plus muet : message bref en haut du tableau.

### Modifié
- L'application **s'ouvre sur l'outil Sélection** : le premier clic dans le vide ne pose
  plus de chasseur.
- Le menu du navigateur n'apparaît plus sur le tableau.
- Le clic molette ne sert plus qu'à déplacer la carte.

### Corrigé — trouvé au banc
- **Sans carte, un clic droit posait une forme** et ouvrait le menu du navigateur
  par-dessus : le bouton de la souris n'était regardé qu'avec une carte. Le clic molette
  posait aussi.

### Vérifié en exécutant
Banc : les 13 scénarios nouveaux échouent sur la v1.1.1, les 15 passent en v1.2 · souris
réelle dans l'aperçu intégré : chasseur posé, clic droit, outil Sélection, rien de posé ·
épingle dessinée à la sélection, absente sans sélection ; PNG et kneeboard identiques
avec ou sans sélection · démo sans erreur console · WMM2025 100/100.

### Constaté
Le banc a d'abord jugé l'ancien code : les scripts sont chargés à une adresse versionnée
(`board.js?v=1.1.1`) que le cache du navigateur gardait. Le paramètre passe à `v=1.2`, et
le banc recharge désormais chaque script à l'adresse exacte que cite la page.

## v1.1.1 — 2026-09-23

### Ajouté
- Guide d'utilisation **EN-US** complet : [docs/GUIDE.en-US.md](docs/GUIDE.en-US.md).
- Page **Soutenir / Ko-Fi** : invitations Discord, contreparties recommandées,
  politique de crédits et texte prêt à publier.
- Lien Discord permanent vérifié : `https://discord.gg/cTepFwBPUy`.

### Modifié
- README : liens visibles vers les guides FR/EN-US, la page Ko-Fi et l'invitation
  Discord cliquable.
- Crédits : règle de mention des soutiens communautaires, sans données personnelles
  ni montant publié sans accord explicite.

## v1.1 — 2026-09-18

Publication : dépôt public [LUDENS-KITH/fl-briefing-board](https://github.com/LUDENS-KITH/fl-briefing-board)
et démo en ligne [ludens-kith.github.io/fl-briefing-board](https://ludens-kith.github.io/fl-briefing-board/?demo),
le 2026-09-18 — vitrine de LK Studio. Vérifié depuis l'adresse publique : deux planches,
carte du Caucase et ses tuiles chargées en HTTPS, route liée, aucune erreur.

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
