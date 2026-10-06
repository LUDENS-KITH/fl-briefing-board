# Plan d'action — FL Briefing Board

> Document vivant, ouvert le **2026-09-30** sur la base de la **v1.1.1**.
> Il répond à une seule question : *que construit-on ensuite, dans quel ordre, et
> comment sait-on que c'est fait ?*
> Ce qui existe et ce qui est vérifié : [ETAT.md](ETAT.md). Le contrat du moteur :
> [MODELE.md](MODELE.md).

## 1. Objectif

Faire du tableau un outil qu'un meneur tient pendant toute une séance :
**poser sans rien bousculer, revenir à la sélection sans chercher l'outil, et
enseigner l'emploi du radar de son module sur le même tableau que la manœuvre.**

Les lots 1 à 3 répondent à la demande de Vince du 2026-09-30. Les lots 4 à 8 sont des
propositions, non engagées, rangées par rapport valeur / coût. Le lot 9 répond à la
demande de Vince du 2026-10-06.

## 2. Vue d'ensemble

| Lot | Contenu | Origine | Taille | Dépend de | Version | Statut |
|---|---|---|---|---|---|---|
| 1 | Ancrer une forme · clic droit et `Échap` ramènent à la sélection · ouverture sur la sélection · banc de saisie | demande | S | — | v1.2 | en ligne depuis le 2026-09-30 |
| 2 | Kit radar fixe : gabarits d'écran et symbologie, F/A-18C puis F-16C | demande | M | lot 1 | v1.3 | en ligne le 2026-09-30 |
| 3 | Vue radar liée : ce que voit le radar de l'appareil désigné, en B-scope | demande | M | lot 2 | v1.4 | livré le 2026-09-30 |
| 4 | Enregistrer et ouvrir un briefing en fichier ; images de fond conservées | proposition | S | — | v1.5 | engagé le 2026-09-30, livré |
| 5 | Mode présentation : plein écran, pointeur laser, phases au clavier | proposition | S | lot 1 | v1.6 | engagé le 2026-09-30, livré |
| 6 | Import d'une mission `.miz` | proposition | L | lot 4 | v1.7 | engagé le 2026-09-30, livré |
| 7 | Animation entre phases | proposition | M | — | v1.8 | engagé le 2026-09-30, livré |
| 8 | Cadrage manuel du kneeboard | proposition | S | — | v1.9 | engagé le 2026-09-30, livré |
| 9 | Route du tableau dans la DTC du F/A-18C, par un `.miz` complété | demande | M | lot 6 | v1.10 | livré le 2026-10-06, fusion à valider |

Tailles : **S** une séance de travail, **M** deux ou trois, **L** davantage, avec une
inconnue à lever avant d'écrire du code.

## 3. Méthode commune à tous les lots

Elle reprend ce qui a déjà servi sur ce projet (ETAT §6).

1. **Une phrase d'objectif par lot**, écrite avant de coder. Chaque découverte faite en
   route se juge contre elle : elle entre dans le lot si elle en découle, sinon elle
   devient une ligne de ce plan.
2. **Test rouge d'abord.** Chaque comportement nouveau a son scénario au banc de saisie
   (§4.4) ou, pour une fonction pure, un test `node` comme `tools/test_magnetic.js`. Le
   scénario doit échouer avant le changement ; un test vert par construction ne prouve
   rien. Seuls les scénarios de non-régression, marqués comme tels, passent d'avance.
3. **Vérifier le chemin du pilote, pas la fonction.** Le défaut n° 6 d'ETAT est passé
   parce que le test choisissait lui-même l'outil sélection. Les scénarios partent de
   l'état d'ouverture de l'application.
4. **La documentation fait partie du lot** : [GUIDE.md](GUIDE.md) **et**
   [GUIDE.en-US.md](GUIDE.en-US.md), MODELE.md si le contrat change, lignes datées dans
   ETAT §2, entrée du CHANGELOG, texte d'aide affiché sous le tableau (`#hint`).
5. **La démo suit.** Ce qui se montre entre dans `?demo` : c'est la vitrine LK Studio.
6. **Le dépôt est public.** Une branche et une PR par lot. **Fusionner sur `main`
   publie la démo en ligne** (GitHub Pages) : la fusion attend la validation de Vince.
   Avant chaque poussée, cribler les fichiers : secrets, chemins du poste, données
   sans licence.

## 4. Lot 1 — Ancrer, et revenir à la sélection

**Objectif :** poser et déplacer des formes contre un décor sans jamais le bousculer,
et retrouver l'outil de sélection d'un seul geste.

### 4.1 Constat

Lu dans le code le 2026-09-30 ; à confirmer au banc en ouverture du lot.

- L'application **s'ouvre sur l'outil « chasseur »** (`let tool = 'sym'` dans
  `board.js`) : le premier clic dans le vide pose un chasseur.
- Avec une forme choisie, **toucher une forme existante la saisit** (`grab()`). C'est
  voulu (ETAT §6, défaut n° 6), mais rien ne protège un décor qu'on ne veut plus
  toucher : la zone SAM, le bullseye, la carte glissée en fond.
- **Le bouton de la souris n'est regardé qu'avec une carte** (`pointerdown`). Avec une
  carte, clic droit et clic molette déplacent la carte. **Sans carte, un clic droit
  agit comme un clic gauche** — une forme choisie est posée — et le menu du
  navigateur s'ouvre par-dessus, car il n'est bloqué qu'avec une carte.
- `Échap` désélectionne, ou abandonne une zone en cours de tracé ; il ne change pas
  d'outil.
- L'aide affichée sous le tableau annonce « clic droit pour se déplacer ».

### 4.2 Comportement cible

« Annuler » s'entend ici comme **abandonner le geste ou l'outil en cours**. Le bouton
Annuler de l'historique (`Ctrl+Z`) ne change pas.

| Geste | Effet |
|---|---|
| Clic droit **sans bouger** (moins de 5 px entre l'appui et le relâché) | abandonne le tracé en cours (zone, flèche, trait…), désélectionne, **passe à l'outil Sélection** |
| Clic droit pendant un glissé gauche | annule le glissé : l'objet revient à sa place |
| Clic droit **glissé**, avec une carte | déplace la carte — inchangé |
| Clic droit glissé, sans carte | rien |
| Clic molette | déplace la carte s'il y en a une ; **sans carte, ne pose plus rien** |
| `Échap` | même effet que le clic droit sans bouger ; dans le champ de texte, ferme sans enregistrer (inchangé) |
| Menu du navigateur | **jamais** sur le tableau |
| Ouverture de l'application | **outil Sélection**, aucune vignette de palette allumée |

Le clic droit se décide **au relâché** : l'appui démarre le déplacement de carte comme
aujourd'hui, et un relâché à moins de 5 px du point d'appui devient un retour à la
sélection. Les deux usages cohabitent sans délai ni double-clic.

### 4.3 Ancrage

| | |
|---|---|
| Donnée | un champ `locked: true` sur l'objet. L'historique et la sauvegarde le recopient sans code nouveau : `snap()` copie tous les champs |
| Commande | bouton 📌 dans la barre, à côté de Dupliquer, et touche `K`. Agit sur la sélection, bascule ancré / libre, laisse une entrée d'historique |
| Ce qu'un objet ancré refuse | d'être saisi quand une forme est choisie — on pose **par-dessus** · d'être déplacé · ses poignées (rotation, taille, courbure, sommets) · la gomme · `Suppr` · l'altitude tirée dans la coupe liée pour un waypoint |
| Ce qu'il accepte | d'être sélectionné à l'outil Sélection, pour être libéré · couleur, épaisseur, style de trait · étiquette · premier plan · duplication — **la copie naît libre** |
| Désignation à l'outil Sélection | un objet libre passe devant un objet ancré qui le recouvre ; l'ancré ne se désigne que seul sous le doigt |
| Glisser sur un objet ancré | à l'outil Sélection sur une carte, **déplace la carte** comme dans le vide ; sinon une carte de fond ancrée capterait chaque geste |
| Refus | jamais silencieux : l'aide sous le tableau indique « ancré — 📌 pour libérer » |
| Affichage | sélectionné, un cadre sans poignée et une petite épingle ; **rien dans les exports** PNG et kneeboard |
| Effacer la planche | efface tout, ancré compris : l'action est explicite et déjà confirmée |

**Pourquoi le moteur le supporte.** L'ancrage est une propriété d'un seul objet : il ne
crée ni groupe ni sélection multiple. Le principe « un objet, une poignée » tient, et
le point de bascule vers Excalidraw (ETAT §7) n'est pas franchi.

**Points du code touchés** : `grab()`, la branche `select` de `pointerdown`,
`handleList()`, la gomme, `Suppr`, `routeHit()` et le geste `alt`, `handles()` pour
l'épingle, l'initialisation de l'outil, l'écouteur `contextmenu`, `endPointer()`, le
clavier, `#hint`.

### 4.4 Banc de saisie

Premier filet automatique du moteur, sans dépendance, dans l'esprit du projet :

- une page `tools/banc-saisie.html` charge `index.html` dans un cadre, **envoie de vrais
  `PointerEvent`** — boutons gauche, droit et molette, toucher, glisser — puis lit
  l'état du moteur (`tool`, `sel`, `objs`, `past`) ;
- servie en HTTP local (`python -m http.server`), elle s'exécute dans Chromium sans
  interface ; le résultat se lit dans la page : `OK n/n`, ou la liste des échecs ;
- chaque scénario part de l'état d'ouverture, jamais d'un outil choisi par le test ;
- le banc recharge chaque script à l'adresse exacte que cite la page (`board.js?v=…`) :
  sans cela, le cache du navigateur lui fait juger l'ancien code ;
- les lots suivants y ajoutent leurs scénarios.

### 4.5 Fait quand

Au banc, 15 scénarios. Les 13 nouveaux échouaient sur la v1.1.1 ; les 2 de
non-régression (4 et 15) passaient déjà. Les 15 passent en v1.2 :

1. À l'ouverture : outil Sélection, aucune vignette allumée ; un clic dans le vide ne
   pose rien.
2. Forme choisie, clic droit sans bouger, sans carte : outil Sélection, rien de posé,
   menu du navigateur bloqué.
3. Même chose sur une carte : la carte ne bouge pas.
4. Sur une carte, clic droit glissé : la carte bouge, l'outil ne change pas.
5. Clic molette sans carte : rien n'est posé.
6. Pose en cours, bouton droit enfoncé : la pose est annulée, sans trace dans
   l'historique.
7. Zone en cours de tracé, clic droit : zone abandonnée, sans trace dans l'historique.
8. `Échap` avec une forme choisie : retour à la sélection.
9. `Échap` pendant une zone : zone abandonnée, retour à la sélection.
10. SAM ancré, forme choisie, clic sur le SAM : une nouvelle forme se pose par-dessus,
    le SAM n'a pas bougé.
11. SAM ancré : glisser, poignée, flèches, `Suppr` et gomme restent sans effet, avec un
    message ; une fois libéré, tout fonctionne.
12. Ancré puis `Ctrl+Z` : libre ; `Ctrl+Y` : ancré ; réouverture : toujours ancré.
13. Zone ancrée sur une carte, outil Sélection, glisser dessus : la carte se déplace, la
    zone reste.
14. Sous un SAM ancré, un chasseur libre se saisit à l'outil Sélection.
15. Export PNG et kneeboard : identiques avec ou sans l'objet ancré sélectionné.

Vérifié aussi à la souris réelle dans l'aperçu intégré (Chromium). Reste à Vince : le
clic droit dans Brave en mode application, par le raccourci bureau.

**Documentation** : GUIDE FR et EN-US (clic droit, `Échap`, `K`, ancrage), MODELE §2
(champ `locked`), §3 (outil d'ouverture), §4 (ordre de priorité : bouton droit, objets
ancrés), ETAT §2 et §5, CHANGELOG v1.2, aide `#hint`.

## 5. Lot 2 — Kit radar fixe

**Objectif :** expliquer une page radar d'un module sur le tableau, avec la symbologie
exacte de ce module.

### 5.1 Périmètre

D'abord **deux modules et une page chacun**, parmi les plus volés et les mieux
documentés, tous deux en B-scope :

| Module | Page | Source |
|---|---|---|
| F/A-18C | RDR ATTK air-air : RWS, TWS, STT | *DCS F/A-18C Early Access Guide* (EN, 2024-03-24), « APG-73 Fire Control Radar », p. 156 et suivantes ; « HAFU Symbology », p. 209. Version FR disponible |
| F-16C | FCR, mode CRM : RWS, TWS | *DCS F-16C Early Access Guide* (EN, 2026-08-16), « APG-68 Fire Control Radar », p. 374 et suivantes ; « FCR MFD Format », p. 394 |

Ensuite, un module à la fois : page SA du Hornet, HSD du Viper, F-15E, AH-64D (FCR et
TSD), F-14 (TID et DDD, qui ne sont pas des MFD), Mirage 2000C (VTB). Les avions
Flaming Cliffs n'ont pas de page radar multifonction (affichage tête haute, VSD ou
IT-23) : ils restent hors du kit.

### 5.2 Ce qu'on construit

- **Un écran est une forme de la palette**, pas un type d'objet nouveau : droite
  (`upright`), carrée à la désignation (`box`), posée sous les autres objets (`under`).
  Il porte son échelle (`rng`) et son azimut (`az`), réglés au clavier comme par ses
  boutons, se redimensionne par sa poignée **et s'ancre** (lot 1) pour que les pistes
  se posent dessus sans le bousculer. *Écart au plan initial : un type `scope` aurait
  dupliqué désignation, poignées, sauvegarde et ancrage, déjà acquis par les formes.*
- **Un groupe de palette par module** — « Radar F/A-18C », « Radar F-16C » — qui ne
  contient que les symboles de ce module. Hornet, livré : écrans RWS, TWS et STT,
  brique, HAFU ami, inconnu, hostile (moitié haute), L&S, DT2, curseur TDC. La moitié
  basse du HAFU attend la page SA. Viper, livré : écrans FCR RWS et TWS, cibles de
  recherche chaude et froide, pistes TWS et système, cible désignée, curseur A-A,
  brouillage, bullseye.
- Les symboles restent **paramétriques** (MODELE §8) : recolorables, et **le geste de
  pose oriente la tige de cap** d'un HAFU, sans changer sa taille.
- **L&S et DT2 sont des états de piste**, pas des objets : leur vignette marque le HAFU
  touché, une seule L&S et une seule DT2 par planche (manuel F/A-18C, p. 173 et 176).
  La cible désignée du F-16C suit la même règle (manuel F-16C, p. 404 et 415) ; une
  marque ne se pose que sur une piste de son appareil.
  *Écart au plan initial, trouvé en construisant : posés comme objets, ils saisissaient
  la piste au lieu de s'y inscrire.*
- Un gabarit se pose de préférence **sur une planche sans carte** : sur une carte, un
  objet suit le terrain au gré du zoom, ce qui n'a pas de sens pour un écran de bord.
  La vue liée (lot 3) n'a pas cette limite.

### 5.3 Règles propres au kit

- **Tout est dessiné par nous, en vecteurs, d'après les manuels.** Aucune capture de
  DCS, aucune image extraite d'un manuel : le dépôt est public.
- **Chaque symbole et chaque libellé cite sa source** (manuel, page) dans une table
  `docs/RADAR.md`. Un symbole sans source n'entre pas.
- **Un module à la fois, relu pour lui-même.** Les manuels Flaming Cliffs se recopient
  d'un appareil à l'autre : la symbologie d'un module ne se déduit jamais d'un autre.
- ~~Lecture validée par Vince contre le jeu, avant fusion.~~ Retiré le 2026-09-30 : les
  figures du manuel sont déjà des captures du jeu. Un écart vu en vol ouvre une
  correction.

### 5.4 Fait quand

- Pour chaque module : gabarit et symboles posés, recolorés, orientés, étiquetés,
  ancrés ; exports PNG et kneeboard lisibles.
- Table des sources complète : aucun symbole sans page.
- Une planche « radar » dans `?demo`.

État au 2026-09-30 — **F/A-18C et F-16C** : faits, en ligne (v1.3).
Banc 23/23 ; rendu relu en image (pages, vignettes, démos, kneeboard) ; sources
complètes dans [RADAR.md](RADAR.md). Au kneeboard, un écran seul sur sa planche sort à
la taille utile ; une légende posée à côté le fait rapetisser (cadrage : lot 8).

## 6. Lot 3 — Vue radar liée

**Objectif :** montrer sur l'écran radar ce que produit la géométrie dessinée en vue de
dessus, pour apprendre à lire le B-scope, l'aspect et le travers.

### 6.1 Principe

Même mécanique que la coupe liée à la route (MODELE §1) : **rien n'est stocké, tout est
recalculé à chaque dessin.**

- On désigne **l'appareil porteur** : un aéronef de la vue de dessus, un seul par
  planche, qui porte l'un des modules du lot 2.
- Le panneau du bas, qui affiche aujourd'hui la coupe, affiche **au choix la coupe ou
  le radar**, par un sélecteur dans son bandeau. Pas de troisième panneau : la vue de
  dessus garde sa hauteur.
- Pour chaque aéronef du plan : gisement relatif et distance depuis le porteur,
  projetés en B-scope (azimut en abscisse, distance en ordonnée, tous deux linéaires) ;
  vecteur d'aspect tiré du cap de la cible, rapporté au cap du porteur.
- Hors du cône d'azimut ou au-delà de l'échelle : absent de l'écran, compté en bas
  (« 2 hors cône »).
- Distances réelles sur une carte (`nmAt`) ou sur une planche étalonnée. Sans l'un ni
  l'autre, un message, et rien d'inventé — comme la route liée.

### 6.2 Ce que la vue ne prétend pas

**Elle montre la géométrie, elle ne simule pas la détection.** Aucun modèle de surface
équivalente radar, de fouillis de sol ni de notch calculé : la vue affiche l'**aspect**
au format du F-16C (p. 405), l'hémisphère chaud ou froid (p. 404) et la **part radiale**
de la vitesse de la cible, que juge le filtre Doppler (p. 391), sans décider à la place
du radar si la cible est vue. *Écart au plan initial : les catégories HOT, FLANK, BEAM,
COLD n'ont de bornes dans aucun manuel lu ; la vue ne les invente pas.* L'élévation de l'antenne est ignorée : la vue est en deux dimensions. Un
verdict que le simulateur pourrait contredire serait pire qu'une absence.

### 6.3 Fait quand

- La projection est une fonction pure, testée en `node` comme le magnétisme : cible
  droit devant à 20 NM → au centre, à 20 NM ; à 45° à droite → colonne +45° ; à 70° →
  absente avec un cône de ±60° ; cible au travers → aspect 9, part radiale nulle.
- Déplacer une cible en haut la déplace en bas ; tourner le porteur fait défiler les
  contacts.
- Kneeboard : plan en haut, radar en bas.

État au 2026-09-30 : fait. `node tools/test_radar.js` 26/26, et en échec sur quatre
calculs faussés ; banc 27/27 ; interception relue en image ; kneeboard ; planche
« Interception » dans la démo.

## 7. Propositions — lots 4 à 8

Non engagées. Chacune a son objectif et son critère de fin.

### Lot 4 — Enregistrer et ouvrir un briefing

**Objectif :** préparer un briefing sur un poste et le mener sur un autre, ou le passer
au meneur suivant.

Aujourd'hui seul le PNG sort, et la sauvegarde locale exclut les images. Un fichier
`.json` marqué `fl-briefing-board`, version 1 (planches, réglages, images comprises),
s'enregistre et s'ouvre par un bouton ou par glisser-déposer. Les images de fond
passent en IndexedDB pour survivre au rechargement (ETAT §8, point 1).

*Fait quand :* un briefing enregistré puis ouvert dans un autre profil de navigateur
est identique, images comprises.

État au 2026-09-30 : fait. Vérifié dans Brave sans interface, en `file://` : briefing
enregistré dans un profil, ouvert dans un second profil vierge, identique ; image relue
après rechargement. Banc 31/31.

### Lot 5 — Mode présentation

**Objectif :** mener un briefing en partage d'écran Discord sans que l'interface gêne.

Plein écran, barres et palette masquées, phases au clavier, **pointeur laser** qui
laisse une trace éphémère — hors historique, hors export. `Échap` sort du mode.

*Fait quand :* une séance entière se mène au clavier et à la souris sans rouvrir une
barre.

État au 2026-09-30 : fait. Dans Brave, avec de vrais événements souris et clavier :
entrée au clic, plein écran, laser, phases, sortie par Échap ; banc 34/34.

### Lot 6 — Import d'une mission `.miz`

**Objectif :** partir de la vraie mission : route du vol, bullseye, menaces.

Lecture dans le navigateur, sans dépendance : l'archive est décompressée par
`DecompressionStream`, la table Lua `mission` lue par un petit analyseur. Les
waypoints du groupe joueur deviennent des waypoints numérotés avec leur altitude
(route liée), le bullseye de la coalition un bullseye, les groupes sol-air et les
navires des symboles.

**Inconnue à lever avant d'écrire du code :** passer des coordonnées DCS (des mètres,
dans une projection propre à chaque théâtre) à la carte. Il faut, par théâtre, des
paramètres de projection **publiables** : la source des aérodromes a déjà été écartée
faute de licence. Repli sûr si aucune source ne convient : importer sur une **planche
sans carte**, à l'échelle exacte puisque les coordonnées DCS sont des mètres, nord de
la grille en haut. Ce nord diffère du nord vrai de quelques degrés selon le théâtre :
les caps affichés doivent le dire.

*Fait quand :* une mission de l'escadron importée place sa route au bon endroit,
recoupé sur trois points connus avec la carte F10 du jeu.

État au 2026-09-30 : fait. **L'inconnue est levée** : le fichier du jeu qui déclare la
projection est chiffré, on ne le lit pas ; on la mesure sur les balises de
l'installation (position DCS et latitude/longitude), écart de 4 cm sur 7 théâtres.
Recoupement : au lieu de la carte F10, les points de référence des terrains — départ
piste de Goudaouta à 0,00 km, sept départs parking à 0,3 – 1,1 km. Normandie, Mariannes
1944 et les théâtres non installés passent par le repli : planche sans carte, caps « G ».

### Lot 7 — Animation entre phases

**Objectif :** voir la manœuvre se dérouler (pince, crank, grinder) au lieu de sauter
d'une image à l'autre.

Chaque objet reçoit un identifiant stable, conservé par « + phase ». À la lecture,
positions et caps sont interpolés d'une planche à la suivante ; un objet qui n'existe
que d'un côté apparaît ou disparaît en fondu. Avec la vue radar liée, les contacts se
déplacent sur l'écran pendant la manœuvre.

*Fait quand :* la démo joue son attaque de la phase 1 à la phase 2, et un objet
apparu en phase 2 entre en fondu.

État au 2026-09-30 : fait. Dans Brave, en présentation, → joue Ingress → Attaque : UZI 1-1
glisse de la mer vers l'objectif, la cible et la flèche d'attaque entrent en fondu ; la
vue radar liée suit. Banc 40/40. Les planches créées avant la v1.8 ne partagent pas
d'identifiants : entre elles, la transition se fait en fondu.

### Lot 8 — Cadrage du kneeboard

**Objectif :** remplir la page du kneeboard, dont une planche en paysage n'utilise
aujourd'hui qu'environ 40 % (ETAT §7).

Un cadre portrait 3:4, posé et déplacé sur le plan ; l'export prend ce cadre.

*Fait quand :* un kneeboard cadré occupe toute la page, reste lisible, et a été ouvert
une fois dans DCS — ce qui n'a jamais été fait (ETAT §3).

État au 2026-09-30 : livré, sauf l'ouverture dans DCS, qui demande de lancer le jeu.
- Le 3:4 prévu était faux. Les fichiers du jeu (`Scripts/Aircrafts/_Common/Cockpit/KNEEBOARD`)
  montrent qu'une image du dossier est étirée sur toute la planchette, de proportions
  0,142 × 0,214. La page sort donc en 768 × 1157 ; en 768 × 1024, elle était comprimée
  d'environ 11 % en largeur.
- Le cadre prend les proportions de la zone du plan de la page, sous l'en-tête et
  au-dessus de la coupe : ce qu'il montre est exactement ce que montre la page.
- Banc 44/44. Dans Brave, un cadre posé, déplacé et réduit à la souris donne une page
  qui montre son contenu, lisible, sans le cadre.

### Lot 9 — La route dans la DTC du F/A-18C

**Objectif :** que la route préparée sur le tableau arrive dans l'avion. Le meneur
choisit la mission comme support, le tableau rend une copie dont la cartouche de
données (DTC) des F/A-18C d'un vol porte ces waypoints, et le pilote démarre ses points
chargés, sans outil tiers.

Choisi par Vince le 2026-10-06, de préférence à un export vers l'outil communautaire
DCS-DTC : la DTC native vit dans le `.miz`, elle sert directement la mission que vole
l'escadron. L'export DCS-DTC, pour un pilote seul sur le serveur d'un autre, reste une
idée de suite, non engagée.

**Inconnue levée avant le code : le format.** Lu dans l'éditeur de mission du jeu
(`MissionEditor/modules/me_DTC.lua`, `me_managerDTC.lua`, `CoreMods/aircraft/FA-18C/DTC`)
et sur trois missions réelles qui en portent :
- une cartouche est un fichier JSON `DTC/<nom>.dtc` dans l'archive ; chaque unité la
  désigne par son nom (`DTC = { AutoLoad, Cartridges = { { name, default } } }`) ;
- les waypoints du Hornet (`WYPT.NAV_PTS`) sont en mètres DCS, comme le reste de la
  mission : aucune conversion géographique de plus ;
- 59 waypoints au plus, numérotés à partir de 1 ; trois séquences (`NAV_ROUTE`) ;
  altitude en mètres, `altitudeType` 1 = au-dessus de la mer, 2 = du sol ;
- l'éditeur ne lit d'une cartouche que les rubriques présentes, et ses waypoints
  seulement si son théâtre est celui de la mission ; des missions réelles portent des
  cartouches partielles (radios et contre-mesures seules).

*Fait quand :* une mission de l'escadron passée par ⇩ DTC reste intègre, ne change que
dans la DTC du vol choisi, et ses waypoints reviennent aux positions de la route à
moins de 2 m ; le pilote démarre avec la route chargée.

État au 2026-10-06 : livré, sauf le vol. `node tools/test_miz.js` 83/83 et banc 51/51,
nouveaux tests rouges avant le code. Sur la Sandbox Colchide, la mission relue par
l'interpréteur Lua de DCS ne diffère de l'originale que dans la table `DTC` des
4 Hornet du vol ; la cartouche existante est reprise, waypoints remplacés. Reste à
ouvrir une copie dans l'éditeur, puis à démarrer un Hornet dessus.

## 8. Hors plan

- **Débriefing sur trace Tacview** (ETAT §8) : l'angle le plus différenciant à terme,
  mais il dépend de FlightLedger ; il s'ouvrira comme un chantier à part.
- **Alerte de franchissement du relief** (ETAT §8) : en attente.
- **Collaboration temps réel, sélection multiple, groupes** : hors périmètre, décidé
  (ETAT §5).

## 9. Décisions

**Tranchées dans ce plan** — conventionnelles et réversibles, elles s'appliquent sauf
avis contraire :

| Décision | Raison |
|---|---|
| Clic droit sans bouger et `Échap` ramènent à l'outil Sélection ; clic droit glissé déplace la carte | les deux usages du bouton droit cohabitent, décidés au relâché |
| L'application s'ouvre sur l'outil Sélection | le premier clic ne doit rien poser |
| L'ancrage bloque la géométrie et la suppression, pas le style ni l'étiquette | on ancre pour ne plus bousculer, pas pour figer le briefing |
| Touche `K` pour ancrer | lettre libre ; `Ctrl+Maj+L`, usuel ailleurs, est pris par des gestionnaires de mots de passe |
| La vue radar partage le panneau de la coupe, au choix | la vue de dessus garde sa hauteur |
| La vue radar montre la géométrie, elle ne simule pas la détection | un faux verdict est pire qu'une absence |
| Kit radar dessiné d'après les manuels, chaque symbole sourcé, aucune capture | dépôt public |
| À l'outil Sélection, un objet libre passe devant un objet ancré qui le recouvre | on ancre pour poser et saisir par-dessus |
| Page du kneeboard aux proportions de la planchette DCS, 0,142 × 0,214, et non en 3:4 | le jeu étire toute image à sa planchette ; lu dans ses fichiers |
| Le cadre du kneeboard garde sa largeur ; sa hauteur suit la zone du plan de la page | ce que montre le cadre est exactement ce que montre la page |
| DTC : le numéro du waypoint sur le tableau est celui de l'avion (1 à 59) | ce que le pilote lit au kneeboard est ce qu'il trouve au cockpit ; le Hornet n'accepte pas 0 dans la DTC |
| DTC : chargée au démarrage (`AutoLoad`) pour tous les F/A-18C du vol, la nouvelle cartouche par défaut | le but est de démarrer ses points chargés ; l'ancienne cartouche reste, au choix dans l'éditeur |
| DTC : une cartouche existante sert de base, seuls les waypoints changent | radios, contre-mesures et TACAN sont le travail du concepteur de la mission |
| DTC : le tableau rend une copie, jamais la mission d'origine | une mission de serveur se remplace en connaissance de cause, par celui qui la tient |
| DTC : le F/A-18C d'abord | le seul module dont le format a été lu ; F-16C ensuite, un module à la fois |
| Une marque de piste posée hors d'une piste désigne un écho (piste inconnue du F/A-18C, piste système du F-16C) au lieu d'être refusée | comme au cockpit (F/A-18C p. 176, F-16C p. 416) ; le refus passait pour une panne, signalée par Vince |

**Décidé par Vince :**

| Date | Décision |
|---|---|
| 2026-09-30 | Kit radar : **F/A-18C d'abord, puis F-16C** |
| 2026-09-30 | Lancement du lot 1 |
| 2026-09-30 | Fusions des lots 1 à 3 ; lancement du lot 4 |
| 2026-09-30 | Fusion du lot 4 ; lancement du lot 5 |
| 2026-09-30 | Fusion du lot 5 ; lancement du lot 6 |
| 2026-09-30 | Fusion du lot 6 ; lancement du lot 7 |
| 2026-09-30 | Fusion du lot 7 ; lancement du lot 8 |
| 2026-10-06 | Lot 9 : la route dans la DTC native, par un `.miz` complété, plutôt que par l'outil DCS-DTC ; lancement |

**À trancher par Vince :** la fusion du lot 9, qui publie la v1.10 en ligne.
