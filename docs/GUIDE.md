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

## Cartes

La liste en haut à droite de la vue de dessus propose les **14 théâtres DCS**, en
**topographique**, **satellite** ou **plan routier**. Une version locale peut y ajouter
les aérodromes sous leur nom DCS (`python tools/build_theatres.py --aerodromes`). La carte est vivante : molette ou pincement pour zoomer ; clic droit, clic
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
`Ctrl+Y` / `Ctrl+D` · `PgPréc` / `PgSuiv` planches · `+` / `−` zoom de la carte.

## Ce qu'il ne fait pas

Pas de zoom ni de défilement sans carte (le tableau blanc, c'est l'écran) · pas de collaboration temps
réel · pas de carte hors ligne · pas de sélection multiple ni de groupes · les
cartes de fond ne sont pas conservées d'une ouverture à l'autre. Ces
absences sont des décisions, pas des oublis : [docs/ETAT.md §5](ETAT.md).
