# Guide d'utilisation — FL Briefing Board

Tout ce que l'outil sait faire, geste par geste. Pour démarrer : [README](../README.md).

## La palette — 28 formes

| Groupe | Formes |
|---|---|
| Aéronefs | chasseur, bombardier, ravitailleur, civil, hélicoptère, AWACS, drone |
| Armement / Effets | missile, bombe, explosion, abattu (« splash »), éjection, leurres |
| Sol / Mer | char, radar, menace sol-air (avec cercle d'engagement), aéroport, navire, porte-avions, FARP |
| Tactique | ami, hostile, inconnu, waypoint auto-numéroté, objectif, orbite d'attente, point IP, bullseye |

Les quatre voilures fixes sont volontairement **distinctes à petite taille** :
envergure, flèche, nombre de moteurs et taille par défaut diffèrent. Le ravitailleur
porte sa perche, le civil son empennage en T, le bombardier ses quatre moteurs.

Rien n'est une image : chaque forme est **paramétrique**. C'est ce qui la rend
orientable, redimensionnable et **recolorable sans perte**. Pour en ajouter une :
[docs/MODELE.md §8](MODELE.md).

## Kit radar — F/A-18C et F-16C

Deux groupes de la palette, **Radar F/A-18C** et **Radar F-16C**, pour expliquer la
page radar air-air de chaque appareil. Tout est dessiné d'après le manuel ED du module,
et chaque élément cite sa page : [RADAR.md](RADAR.md). Les deux symbologies ne se
mélangent pas : une marque ne se pose que sur une piste de son appareil.

**F/A-18C — page RDR ATTK**

- **Écrans RWS, TWS et STT** : l'écran de bord, ses 20 boutons et leurs libellés, le
  B-scope. Il se pose **sous** les autres objets et reste traversable : choisissez une
  piste, touchez l'écran, elle se pose dessus. Glisser en le posant l'agrandit ;
  ancrez-le (📌) pour ne plus le bousculer. Sélectionné, `↑` `↓` changent l'échelle
  (5 à 160 NM) et `←` `→` l'azimut balayé, comme ses boutons.
- **Pistes** : brique (contact brut), HAFU ami, inconnu ou hostile, posés à leur couleur
  d'identité. Le geste de pose oriente la **tige de cap** sans changer la taille ; la
  poignée tourne et redimensionne.
- **L&S et DT2** ne sont pas des objets mais l'état d'une piste : choisissez-les, puis
  touchez un HAFU — l'étoile ou le losange s'y inscrit. Une seule L&S et une seule DT2
  par planche, comme dans l'avion ; les reposer sur la même piste les retire.
- **Curseur TDC** : deux traits verticaux, posés par-dessus la piste ou la brique
  désignée.
- Le rang de menace, la vitesse ou l'altitude d'une piste vont dans son étiquette
  (double-clic).

**F-16C — page FCR**

- **Écrans FCR RWS et TWS** : libellés des boutons, échelle entre ses flèches, largeur
  de balayage (`←` `→` : A6, A3, A1, dont les limites se tracent), échelle d'élévation
  d'antenne, horizon, repères de distance.
- **Cibles de recherche** chaude (trait dessous) ou froide (trait dessus).
- **Pistes TWS** (jaunes) et **pistes système** (blanches) : le symbole entier tourne
  avec le cap sol de la cible ; le geste de pose l'oriente.
- **Cible désignée** (bugged) : une marque, un cercle autour de la piste, une seule par
  planche.
- **Curseur A-A**, **brouillage** (chevrons) et **bullseye**.

Le radar se prépare de préférence sur une planche **sans carte** : sur une carte, un
écran suivrait le terrain au gré du zoom. La démo en ligne en montre deux (planches
« Radar F/A-18C » et « Radar F-16C »).

## Cartes

La liste en haut à droite de la vue de dessus propose les **14 théâtres DCS**, en
**topographique**, **satellite** ou **plan routier**. Une version locale peut y ajouter
les aérodromes sous leur nom DCS (`python tools/build_theatres.py --aerodromes`). La carte est vivante : molette ou pincement pour zoomer ; clic droit glissé, clic
molette, espace + glisser ou outil main (`H`) pour se déplacer. Tout ce qui est posé
suit le terrain, et **l'échelle est automatique** : plus d'étalonnage.

**Caps vrais ou magnétiques** : bouton **Cap vrai / Cap mag.** La déclinaison est
calculée sur la carte par le modèle magnétique mondial WMM2025 ; bouton **Décl.** pour
saisir celle de votre mission DCS, qui l'emporte — les caps sont alors ceux du cockpit.
Chaque cap porte sa référence : `049°V`, `042°M`.

Ce sont les cartes réelles des régions que DCS reproduit, pas la carte F10 du jeu.
Il faut une connexion Internet pour les charger ; sans réseau, le glisser-déposer
d'une image reste possible.

## Gestes

- **Poser et orienter d'un seul geste** : cliquer la forme dans la palette, appuyer
  sur le tableau et — sans relâcher — tirer dans la direction du cap. La distance
  donne la taille. Un simple clic pose à la taille par défaut, cap au nord.
- **Reprendre** : toucher une forme existante la saisit, sans changer d'outil —
  y compris **par le bout d'aile** ; l'outil sélection (`V`) attrape aussi flèches,
  traits et carte de fond ; la poignée bleue tourne et redimensionne ; `←` `→`
  tournent au degré près (`Maj` pour plus fin).
- **Revenir à la sélection** : clic droit sans bouger, ou `Échap`. Le geste en cours est
  abandonné (zone commencée, forme en cours de pose) et l'outil Sélection reprend la
  main. Glissé, le clic droit déplace toujours la carte. L'application s'ouvre sur
  l'outil Sélection : un premier clic dans le vide ne pose rien.
- **Ancrer** (📌 ou `K`) : la sélection ne se déplace plus, ne tourne plus et ne s'efface
  plus — ni gomme, ni `Suppr`. On pose et on saisit par-dessus sans la bousculer : zone
  SAM, bullseye, image de fond. Couleur, trait et étiquette restent modifiables ; une
  copie naît libre. Pour libérer : outil Sélection, toucher l'objet, puis 📌 ou `K`. Sur
  une carte, glisser sur un objet ancré déplace la carte.
- **Étiqueter** : double-clic sur une forme — « UZI 1-1 · FL250 · 450 kt ». L'étiquette
  suit la forme ; la vider la supprime.
- **Courber une flèche** : la tracer droite, puis tirer la **poignée du milieu**.
- **Styles de trait** : plein = réel, tirets = prévu, pointillés = menace.
- **Zone hachurée** (`Z`) : cliquer les sommets, refermer sur le premier point ou
  double-cliquer. Double-clic dedans pour la nommer (« CAP NORD », « SAM MEZ »).
- **Règle** (`M`) : distance et cap. Mesurer une distance connue, puis **Échelle** pour
  passer en NM ou en km.
- **Cotes** (📐) : distance et cap affichés sur les traits et les flèches. Sur une
  flèche courbe, la distance suit le chemin tracé. Bouton **NM / km** pour l'unité.
- **Planches** : un onglet par phase (ingress, attaque, egress…). « + phase » copie la
  planche affichée ; double-clic pour renommer ; `PgPréc` / `PgSuiv`.
- **Coupe** (⊟) : l'écran se partage, vue de dessus en haut, **vue de profil** en bas.
  Altitudes en pieds, niveaux de vol au-dessus de 18 000 ft, calées sur 500 ft. Les
  appareils y prennent leur silhouette de profil et affichent leur altitude. Le
  bandeau de la coupe offre **relief**, **menace sol-air** (dôme) et **bloc
  d'altitude**, et règle le plafond et la largeur.
- **Route liée** (case du bandeau de coupe) : la coupe suit les waypoints de la vue de
  dessus, dans l'ordre de leurs numéros, en distance cumulée. Tirez un waypoint de la
  coupe verticalement pour son altitude, double-cliquez pour la taper. La vue de
  dessus doit porter une carte, ou être étalonnée.
- **Recolorer** : une pastille de couleur repeint la sélection au lieu d'attendre le
  prochain tracé. Même chose pour l'épaisseur.
- Dupliquer (`Ctrl+D`), premier plan, flèche double sens, supprimer (`Suppr`).
- Crayon libre, trait, cercle, rectangle, texte restent disponibles.
- Image de fond (carte) par **glisser-déposer** ou `Ctrl+V`, redimensionnable. La
  gomme ne la touche pas : elle se retire par sélection puis `Suppr`.
- Annuler / rétablir, export **PNG** horodaté, fond sombre ou clair, palette
  masquable.
- **Kneeboard DCS** : PNG portrait 768 × 1024 à copier dans
  `Saved Games\DCS\Kneeboard\` (non vérifié en jeu à ce jour).

**Raccourcis** — `V` sélection · `A` flèche · `L` trait · `P` crayon · `C` cercle ·
`R` rectangle · `Z` zone · `M` règle · `T` texte · `E` gomme · `H` main · `Ctrl+Z` /
`Ctrl+Y` / `Ctrl+D` · `PgPréc` / `PgSuiv` planches · `+` / `−` zoom de la carte · `K`
ancrer · `Échap` ou clic droit : retour à la sélection.

## Ce qu'il ne fait pas

Pas de zoom ni de défilement sans carte (le tableau blanc, c'est l'écran) · pas de collaboration temps
réel · pas de carte hors ligne · pas de sélection multiple ni de groupes · les
cartes de fond ne sont pas conservées d'une ouverture à l'autre. Ces
absences sont des décisions, pas des oublis : [docs/ETAT.md §5](ETAT.md).
