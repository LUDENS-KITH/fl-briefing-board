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
demande de Vince du 2026-10-06, les lots 10 à 12 à celles du 2026-10-07, le lot 13 à celle du 2026-10-08. Les lots 14 à 17
forment le chantier **Visibilité** ([VISIBILITE.md](VISIBILITE.md)), demandé le 2026-10-08 :
proposés, non engagés.

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
| 9 | Route du tableau dans la DTC du F/A-18C, par un `.miz` complété | demande | M | lot 6 | v1.10 | en ligne le 2026-10-06 |
| 10 | Accrocher un symbole à un autre : ravitailleur et hippodrome restent alignés à toute échelle | demande | M | lot 1 | v1.11 | en ligne le 2026-10-07 |
| 11 | Nouveau briefing : repartir d'un tableau vierge, toutes planches et images effacées | demande | S | lot 4 | v1.11 | en ligne le 2026-10-07 |
| 12 | Import `.miz` : ravitailleurs et AWACS, leur route et leur orbite | demande | M | lots 6 et 10 | v1.12 | en ligne le 2026-10-07 |
| 13 | Numéros de waypoint : le plus petit libre, pas un compteur | demande | S | — | v1.13 | en ligne le 2026-10-08 |
| 14 | Visibilité : référencement technique (description, aperçu de partage, données structurées, texte lisible) | demande | S | D1 conseillée | v1.14 | en ligne le 2026-10-08 |
| 15 | Visibilité : pages de présentation FR et EN | demande | M | lot 14 | v1.14 | en ligne le 2026-10-08 |
| 16 | Interface en anglais | demande | M-L | — | v1.17, v1.18 | fait le 2026-10-09 (livraisons 1 et 2) |
| 17 | Visibilité : mesure (relevés Search Console et GitHub, compteur si décidé) | demande | S | D1, D3 | — | proposé le 2026-10-08 |
| 18 | Visibilité : déménagement vers `briefing.flightledger.io` — bandeau d'avertissement, puis bascule avancée au 2026-10-08 | demande | S | D1 | v1.15, v1.16 | bascule le 2026-10-08 |

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

État au 2026-10-06 : en ligne (v1.10, démo publiée vérifiée), sauf le vol. `node tools/test_miz.js` 83/83 et banc 51/51,
nouveaux tests rouges avant le code. Sur la Sandbox Colchide, la mission relue par
l'interpréteur Lua de DCS ne diffère de l'originale que dans la table `DTC` des
4 Hornet du vol ; la cartouche existante est reprise, waypoints remplacés. Reste à
ouvrir une copie dans l'éditeur, puis à démarrer un Hornet dessus.

### Lot 10 — Accrocher un symbole à un autre

**Objectif :** qu'un symbole posé sur un autre y reste — un ravitailleur sur la branche
de son hippodrome, une piste sur son écran radar — quel que soit le zoom de la carte,
et qu'il suive l'autre quand on le déplace, le tourne ou l'agrandit.

Demandé par Vince le 2026-10-07 : « si je crée un hippodrome, que je positionne un
tanker, si je change l'échelle, tankers et hippodrome ne sont plus alignés ».

**Constat, lu dans le code.** Sur une carte, un symbole a deux natures (MODELE §1,
carte vivante) : sa **position** est un point du terrain, qui suit le zoom
(`toScreen()`), sa **taille** est fixe à l'écran (`paintSym()`, `SIZE * s`). Poser le
ravitailleur à 40 px du centre de l'orbite, c'est le poser à 40 px *de terrain* à ce
zoom. Dézoomer d'un cran divise cet écart par deux à l'écran, l'orbite garde sa taille :
le ravitailleur rentre dans la boucle. Sans carte, rien ne bouge au zoom (il n'y en a
pas), mais déplacer ou tourner l'orbite la sépare de son ravitailleur. Les écrans radar
du lot 2 ont le même défaut sur une carte : leurs pistes glissent hors de l'écran.

**Pourquoi pas « ancrer ».** Le mot désigne déjà le 📌 du lot 1 (verrouiller un objet).
Ici, c'est **accrocher** : un lien d'un objet vers un autre.

| | |
|---|---|
| Donnée | un champ `hook: { to, u, v, da }` sur l'objet accroché. `to` est l'`uid` de l'hôte ; `u`, `v` sa place **dans le repère du dessin de l'hôte** — en tailles de symbole (`SIZE * s`), axes tournés avec lui ; `da` son cap relatif. Rien n'est stocké sur l'hôte |
| Placement | la position d'un objet accroché se **déduit** de son hôte à chaque dessin et à chaque désignation, au zoom courant (`settle()`) : elle suit l'échelle exactement comme le dessin de l'hôte |
| Le modifier | le glisser, le tourner, les flèches : il reste accroché, à sa nouvelle place. Le moteur voit qu'il a bougé depuis le dernier placement et recalcule `hook` à partir de sa position |
| Ce qui s'accroche | un symbole ou un texte (tous deux de taille fixe à l'écran) |
| Ce qui porte | un **symbole** de la même vue. Une zone, un cercle, une flèche suivent déjà le terrain : un symbole posé dessus y reste au zoom ; les y accrocher n'apporterait que l'entraînement, hors de ce lot |
| Commande | bouton 🔗 dans la barre, à côté de 📌, et touche `J`. Sélection libre : 🔗, puis toucher l'hôte. Sélection accrochée : 🔗 la décroche, sur place. Chaque accroche et chaque décroche laisse une entrée d'historique |
| Refus | jamais muets : rien de sélectionné · une sélection qui n'est ni symbole ni texte · toucher le vide ou un objet qui n'est pas un symbole · un objet qui lui est déjà accroché (une boucle). L'objet lui-même ne compte pas : toucher le ravitailleur posé sur l'orbite désigne l'orbite dessous. `Échap` et clic droit abandonnent l'accroche en cours |
| Chaîne | un objet accroché peut porter à son tour (le texte « TEXACO » sur le ravitailleur sur l'orbite) ; jamais de boucle |
| Hôte effacé | l'objet accroché reste à sa place, libre ; `Ctrl+Z` rend l'hôte et l'accroche |
| Copie (`Ctrl+D`) | la copie d'un objet accroché reste accrochée au même hôte, à sa place décalée : deux ravitailleurs sur la même orbite. La copie d'un hôte part seule |
| Phases et animation | « + phase » garde l'accroche (les `uid` sont conservés). En transition (lot 7), l'objet accroché suit son hôte interpolé |
| Fichier, sauvegarde, kneeboard | `hook` s'écrit avec l'objet ; l'export kneeboard sur une carte, qui dessine à un autre zoom, replace les objets accrochés à ce zoom |
| Affichage | sélectionné, un objet accroché montre un trait pointillé vers le centre de son hôte ; un hôte sélectionné, vers ses objets accrochés. Une aide d'édition : rien dans les exports |
| Ancré et accroché | indépendants. Un objet ancré et accroché suit son hôte : l'ancrage refuse les gestes, pas l'entraînement |

**Ce n'est pas un groupe** (ETAT §5) : pas de sélection multiple, chaque objet garde sa
poignée et se sélectionne seul ; le lien va d'un objet à un seul hôte.

**Points du code touchés** : `settle()` (nouveau) appelé par `drawFrame()`, `topmost()`
et l'export kneeboard ; la branche `pointerdown` (mode d'accroche), `backToSelect()`,
la duplication, `handles()`, le clavier, la barre, `#hint`, la démo.

**Fait quand** — au banc, scénarios rouges avant le code :

1. Sur une carte, ravitailleur posé sur la branche de l'orbite et accroché : après trois
   crans de zoom avant puis trois arrière, son écart à l'orbite **en pixels écran**,
   rapporté à la taille de l'orbite, n'a pas changé (à 0,5 px près). Non accroché, il
   change (le constat, gardé comme témoin).
2. Sans carte : glisser l'orbite emmène le ravitailleur du même vecteur ; la tourner par
   sa poignée le fait tourner autour d'elle, cap compris ; l'agrandir écarte le
   ravitailleur en proportion.
3. Glisser le ravitailleur accroché : il reste accroché, à sa nouvelle place, qui tient
   ensuite au zoom.
4. 🔗 sur un objet accroché le décroche ; `Ctrl+Z` le raccroche, `Ctrl+Y` le décroche ;
   l'accroche survit à la réouverture et à un fichier enregistré puis rouvert.
5. Refus expliqués : 🔗 sans sélection, 🔗 sur une zone, 🔗 puis le vide, une boucle ;
   toucher l'objet lui-même désigne l'hôte dessous ; `Échap` abandonne l'accroche en
   cours sans rien changer.
6. Hôte supprimé : l'objet accroché reste à sa place ; `Ctrl+Z` rend l'hôte, l'accroche
   tient de nouveau.
7. `Ctrl+D` sur l'objet accroché : la copie suit l'hôte elle aussi ; « + phase » : la
   nouvelle planche garde l'accroche ; en transition, l'objet suit l'hôte.
8. Chaîne : un texte accroché au ravitailleur accroché à l'orbite suit l'orbite.

**Documentation** : GUIDE FR et EN-US, MODELE §2 (champ `hook`) et §4 (accroche),
ETAT §2, CHANGELOG v1.11, aide `#hint`, démo (une orbite et son ravitailleur sur les
planches Ingress et Attaque).

État au 2026-10-07 : en ligne (v1.11, PR #13 fusionnée, démo publiée vérifiée : écart
écran du ravitailleur identique aux zooms 7,6, 8,6, 10,1 et sur la page kneeboard). Banc
60/60, les 8 scénarios rouges avant le code, mis en échec par deux mutations (zoom
ignoré dans le repère de l'hôte, glissé non détecté). La transition entre phases et la
page kneeboard sont vérifiées sur la démo dans Brave, pas au banc.

### Lot 11 — Nouveau briefing

**Objectif :** repartir d'un tableau vierge en un geste, sans traîner le briefing
précédent à chaque ouverture.

Demandé par Vince le 2026-10-07 : « à chaque fois que j'ouvre FL Briefing Board, il est
déjà documenté avec les éléments que j'ai moi-même positionnés ».

**Constat, lu dans le code.** Le tableau s'enregistre à chaque geste dans le navigateur
(`commit()` → `localStorage`, images en IndexedDB) et `boot()` le relit à l'ouverture :
c'est voulu, pour ne rien perdre d'une séance à l'autre. Mais rien ne permet de tout
repartir de zéro : **Effacer** ne vide que la planche affichée — les autres phases, leurs
noms et les images de fond restent. Il faudrait supprimer chaque planche une à une.

| | |
|---|---|
| Commande | bouton **✚ Nouveau** dans la barre, à côté de ⇩ Briefing et ⇧ Ouvrir. Pas de raccourci : `Ctrl+N` appartient au navigateur |
| Confirmation | toujours, en disant ce qui sera perdu (nombre de planches) et comment le garder : annuler, puis ⇩ Briefing. Refusée : rien ne change |
| Effet | une seule planche « Phase 1 », vide, sans carte, sans échelle ni déclinaison saisie, historique vide, outil Sélection ; le stockage du navigateur est réécrit aussitôt et les images de fond retirées d'IndexedDB. La réouverture montre le tableau vierge |
| Gardé | les préférences d'affichage, qui ne sont pas le briefing : NM / km, cap vrai / magnétique, aérodromes, fond sombre ou clair, coupe affichée |
| Déjà vierge | pas de question : un message le dit |
| Démo | remet la démo à blanc dans la page, sans rien écrire chez le visiteur (comme le reste de la démo) |
| Effacer | inchangé : la planche affichée seulement, annulable par `Ctrl+Z` |

Un nouveau briefing ne s'annule pas par `Ctrl+Z` : il remplace tout, comme ⇧ Ouvrir.
D'où la confirmation, et le rappel d'enregistrer d'abord.

**Fait quand** — au banc, scénarios rouges avant le code :

1. Tableau garni (deux planches, un symbole, une image de fond, km) : ✚ Nouveau, confirmé
   → une planche « Phase 1 » vide, sans carte, historique vide, outil Sélection ; l'unité
   reste km ; à la réouverture, toujours vierge ; IndexedDB ne garde plus d'image.
2. Confirmation refusée : planches et objets intacts.
3. Tableau déjà vierge : aucune question, un message.
4. Effacer ne vide toujours que la planche affichée (non-régression).

**Documentation** : GUIDE FR et EN-US, MODELE §7 (persistance), ETAT §2, CHANGELOG
v1.11, README.

État au 2026-10-07 : en ligne (v1.11, PR #13 fusionnée ; vrai clic sur la démo publiée :
confirmation, tableau vierge). Banc 64/64, les 3 scénarios rouges avant le code.

### Lot 12 — Ravitailleurs et AWACS de la mission

**Objectif :** qu'une mission importée montre aussi où trouver le ravitailleur et
l'AWACS : leur position de travail, leur route, leur orbite, et de quoi les joindre.

Demandé par Vince le 2026-10-07, sur sa mission « CAUCASUS - Entraînement Sol - FA-18C
Multi 4 » : « pourquoi je ne peux pas voir les positions du ravitailleur ? de l'AWACS ?
de leurs trajectoires ? »

**Constat.** L'import du lot 6 ne retient des avions que les vols pilotables (une unité
« Client » ou « Player », `miz.js`) ; un appareil piloté par l'ordinateur est écarté,
route comprise. Sur la mission de Vince : *Texaco 11* (KC-135MPRS, tâche `Refueling`,
orbite Race-Track sur son point 1, FL200, TACAN 12Y TEX, 251 MHz) et *Overlord 1*
(E-2C, tâche `AWACS`, orbite Race-Track sur son dernier point) n'apparaissent pas.

**Le format, lu dans l'éditeur du jeu** (`MissionEditor/modules/me_action_edit_panel.lua`)
et sur la mission :
- la tâche d'un groupe (`task`) dit son rôle : `Refueling`, `AWACS` ;
- l'orbite est une tâche `Orbit` posée sur un point de route, `params.pattern` :
  **Circle** autour du point ; **Race-Track** du point au point **suivant** — l'éditeur
  ne le propose pas sans point suivant ; **Anchored**, branche chaude de cap
  `hotLegDir` (radians), longueur `legLength` et largeur `width` (mètres) ;
- `params.altitude` (m) et `params.speed` de l'orbite **gouvernent** en vol, pas ceux du
  point ;
- TACAN : action `ActivateBeacon` (`channel`, `modeChannel`, `callsign`) ; radio : la
  fréquence du groupe (`frequency`, MHz) ou l'action `SetFrequency` (Hz).

| | |
|---|---|
| Ce qui est importé | les groupes d'avions à la tâche `Refueling` (symbole ravitailleur) ou `AWACS` (symbole AWACS), des deux coalitions, à leur couleur. Les autres appareils de l'IA restent écartés : ce lot répond aux appareils de soutien |
| Route | leur route réelle, en trait **tireté** (prévu), de point en point |
| Orbite | un symbole d'orbite posé sur le point qui la porte : Race-Track au milieu de la branche, dans son axe ; Anchored dans l'axe de sa branche chaude ; Circle sur le point. **Un symbole, pas un tracé à l'échelle** : la largeur d'un Race-Track et le rayon d'un Circle sont volés par l'IA, la mission ne les écrit pas. Un Race-Track sans point suivant est posé sur son point, dans l'axe de l'arrivée |
| Appareil | **accroché** à son orbite (lot 10), sur une branche, cap le long de la branche ; sans orbite, sur son premier point, tourné vers le suivant |
| Étiquette | nom du groupe · niveau de l'orbite (sinon du premier point) · TACAN · fréquence — « Texaco 11 · FL200 · TCN 12Y TEX · 251.000 » |
| Cadrage | la carte s'ouvre sur l'emprise de tout ce qui est importé, soutien compris |
| Message | le bilan de l'import compte ravitailleurs et AWACS |

**Fait quand** — tests rouges avant le code :

1. `node tools/test_miz.js` : une mission fabriquée avec un ravitailleur Race-Track, un
   AWACS Anchored et un ravitailleur sans tâche : seuls les deux premiers sont lus, avec
   rôle, coalition, route, orbite (forme, point, altitude, branche ou paramètres),
   TACAN et fréquence ; le ravitailleur sans tâche reste écarté.
2. Au banc, import de cette mission : un symbole ravitailleur et un AWACS, chacun
   accroché à une orbite, leurs routes en tireté, leurs étiquettes ; l'orbite du
   Race-Track est au milieu de sa branche, dans son axe.
3. Sur la mission réelle de Vince, dans Brave : Texaco 11 et Overlord 1 visibles, à leur
   place, étiquetés.

**Documentation** : GUIDE FR et EN-US (import), MODELE (import d'une mission), ETAT §2,
CHANGELOG v1.12.

État au 2026-10-07 : fusionné (#15), v1.12 en ligne ; la mission
de Vince réimportée sur la démo publique montre Texaco 11 et Overlord 1 sur leurs orbites.
`test_miz` 91/91 et banc 65/65, rouges avant le code. Sur la mission de Vince : Texaco 11
et Overlord 1 posés et étiquetés. Constat en passant, sans verdict : son « WP10 - RDV
Tanker » est à 7,6 NM de la branche droite du Texaco, au même niveau ; la largeur réelle
de l'hippodrome n'étant pas écrite, rien ne dit qu'il est hors de l'orbite.

### Lot 13 — Numéros de waypoint

**Objectif :** qu'un waypoint posé après des suppressions prenne un numéro qui suit la
route, pas celui d'un compteur.

Demandé par Vince le 2026-10-08 : « la valeur au centre s'incrémente automatiquement de
+1, même si les waypoints des numéros précédents ont été supprimés ».

**Constat.** Chaque planche gardait un compteur `wpN`, augmenté à chaque pose ou copie
de waypoint, jamais diminué par une suppression (seul « Effacer » le remettait à 1).
Trois effets : des trous dans la numérotation affichée ; ces trous recopiés tels quels
dans la DTC (le waypoint 7 du tableau devient le STPT 7) ; et, après assez de poses et
de suppressions, un compteur au-delà de 59 qui fait refuser l'export DTC d'une planche
de trois points.

| | |
|---|---|
| Règle | un nouveau waypoint, posé ou copié, prend le **plus petit numéro libre** parmi les waypoints de sa vue (plan ou coupe) |
| Les autres | gardent leur numéro : pas de renumérotation, pour rester ceux de la mission importée (« WP10 - RDV Tanker ») et de la DTC |
| Modèle | `wpN` disparaît ; un fichier qui le porte s'ouvre, le champ est ignoré |
| En passant | les liens Guides du panneau ⓘ visaient le Markdown brut (`docs/GUIDE.md`, servi en texte) ; ils visent la page que GitHub Pages en fait (`docs/GUIDE.html`) |

**Fait quand** — tests rouges avant le code, au banc : tout supprimé, le suivant est 1 ;
le dernier supprimé rend son numéro ; un trou au milieu est comblé, puis la suite reprend ;
la copie prend le plus petit libre ; un briefing ouvert avec un vieux compteur numérote au
plus petit libre ; les liens des guides finissent en `.html`.

**Documentation** : GUIDE FR et EN-US (gestes), MODELE (`wpN` retiré), ETAT §2,
CHANGELOG v1.13.

État au 2026-10-08 : fusionné (#17), v1.13 en ligne. Banc 71/71, les 6 scénarios
nouveaux rouges avant le code ; vrais clics dans Brave, en local puis sur la démo
publique (1-2-3-4 posés, 2 supprimé, le suivant porte 2).

### Chantier Visibilité — lots 14 à 17

Demandé par Vince le 2026-10-08 : « la mettre plus en avant, qu'elle ressorte des
moteurs de recherche ». Constat, positionnement, ordre, diffusion et décisions D1 à D4 :
[VISIBILITE.md](VISIBILITE.md). Ici, seulement ce qui se code et comment on sait que
c'est fait.

**Avant tout lot : D1, l'adresse.** Si le domaine change, il change avant la promotion.
Le stockage du navigateur est lié à l'origine, et GitHub Pages redirige l'ancienne
adresse : chaque briefing gardé sur `ludens-kith.github.io` deviendrait inatteignable.
Bascule, si D1 la retient : fichier `CNAME` ; quelques jours avant, un bandeau dans le
tableau « exportez vos briefings (⇩ Briefing) » ; liens du README, des guides, de
SOUTENIR et du dépôt mis à jour ; HTTPS vérifié.

#### Lot 14 — Référencement technique

| | |
|---|---|
| Page du tableau | `<meta name="description">` (FR, 50 à 160 caractères) ; `<link rel="canonical">` sur l'adresse sans paramètre (`?demo` reste un lien, pas une page) ; Open Graph et carte Twitter avec `assets/readme/apercu-social.png` en adresse absolue ; données structurées `SoftwareApplication` (JSON-LD : nom, description, application web, gratuite, langues, éditeur LK Studio) |
| Texte lisible | un bloc de présentation dans le HTML, lisible sans script (`<noscript>` et panneau ⓘ étoffé) : ce que fait l'outil, ses fonctions, les liens des guides |
| Guides | `_config.yml` de Jekyll : titre, description, langue, image, pour que `docs/GUIDE.html` et `docs/GUIDE.en-US.html` portent les mêmes balises ; les documents internes (PLAN, ETAT, MODELE, banc) marqués `noindex` |
| Plan du site | `sitemap.xml` (tableau, démo exclue, guides, présentations) ; `robots.txt` **seulement** si D1 donne un domaine, sinon il serait ignoré |
| Vérification | le fichier de vérification Search Console que Vince obtient en déclarant le site |

**Fait quand** — tests rouges avant le code :

1. `node tools/test_seo.js` lit `index.html` et les guides servis : description
   présente et de la bonne longueur, canonique sans paramètre, image Open Graph en
   adresse absolue qui répond 200 en `image/png`, JSON-LD qui se parse et porte les
   champs attendus, texte de présentation présent hors script.
2. Sur la démo publiée : le validateur de données structurées de Google ne signale
   aucune erreur, et un lien collé dans Discord affiche l'aperçu (capture).
3. Banc de saisie inchangé (non-régression).

#### Lot 15 — Pages de présentation

Deux pages statiques, `en/` et `fr/`, liées par `hreflang`, qui sont l'adresse à partager
et à classer ; le tableau reste à la racine, pour ne pas dérouter ceux qui l'ont en
favori. Contenu : la phrase de présentation, quatre ou cinq fonctions illustrées
(captures de la version publique, courtes animations), le bouton « Ouvrir le tableau »
et « Voir la démo », « complète votre planificateur », une FAQ courte (gratuit ? hors
ligne ? où vont mes données ? quels appareils pour la DTC ?), la mention de
non-affiliation à Eagle Dynamics, LK Studio, Ko-Fi, Discord.

**Fait quand** : `test_seo.js` étendu aux deux pages (titre, description,
`hreflang` croisés, canonique, liens vers le tableau qui répondent 200) ; lisibles sur
téléphone sans défilement horizontal (capture à 375 px de large) ; aucune image ne
montre la couche des aérodromes.

État des lots 14 et 15 au 2026-10-08 : engagés sur le « GO » de Vince, livrés ensemble
(v1.14), fusionnés (#19, correctif #20) et en ligne le 2026-10-08. `test_seo.js` 149/149,
27 échecs avant le code ; captures prises sur la démo publique (sans aérodromes) ; pages
vérifiées dans Brave à 1 440 et 375 px. Adresses sur `ludens-kith.github.io` tant que D1
n'est pas exécutée : la bascule changera la base dans un seul passage, que `test_seo.js`
contrôle. Sur les pages servies, `node tools/test_seo.js <adresse>` 160/160 ; il a
trouvé un défaut que les fichiers ne montraient pas (guides sans `og:image` : la clé
`image` du site n'est pas lue par jekyll-seo-tag), corrigé par #20. Restent : le
validateur de données structurées de Google et l'aperçu collé dans Discord (critère 2
du lot 14), gestes de Vince.

#### Lot 16 — Interface en anglais

Toutes les chaînes affichées (boutons, info-bulles, aide, messages, boîtes de
confirmation, étiquettes d'export) passent par un catalogue FR et EN-US ; la langue suit
celle du navigateur et se règle dans l'interface ; le réglage est gardé ; `<html lang>`
suit. Les identifiants DCS (types, noms de missions) ne se traduisent pas.

**Fait quand** : un test rejoue l'application dans chaque langue et ne trouve aucune
chaîne de l'autre langue à l'écran (texte visible, `title`, messages) ; le banc de saisie
passe dans les deux langues ; les deux guides citent les libellés exacts de leur langue.

Découpé en deux livraisons (« GO » de Vince le 2026-10-09) :

| | |
|---|---|
| Livraison 1 (v1.17) — l'écran | `i18n.js` : dictionnaire FR → EN-US, la clé est le texte français exact, avec ses valeurs insérées `{0}`. `tr()` traduit le code ; `localize()` traduit la page (textes, `title`, `placeholder`, `alt`, `aria-label`, blocs `data-i18n`), le titre de l'onglet et `<html lang>`. Langue : `?lang=` de l'adresse, sinon le choix gardé, sinon le navigateur (français s'il commence par `fr`, anglais sinon). Bouton EN / FR dans la barre : bascule en gardant le travail. Nombres et dates au format de la langue ; caps « T » (true), côtés « L/R », déclinaison « W ». Noms DCS inchangés. Pages de présentation : leurs boutons ouvrent l'outil dans leur langue |
| Livraison 2 — guides et exports | les deux guides citent les libellés exacts de leur langue (le guide anglais cite encore « ▶ Présenter », « ⇧ Ouvrir »…) ; étiquettes d'export (kneeboard, PNG) relues dans chaque langue |

**Fait quand (livraison 1)** — `node tools/test_i18n.js` : chaque texte de la page, chaque
`tr()` du moteur, chaque forme, groupe, théâtre et erreur de `miz.js` a sa traduction ; aucun
texte écrit en dur là où il s'affiche ; mêmes valeurs insérées dans les deux langues ; pas de
clé morte. Au banc, rouges avant le code (5 scénarios) : en anglais, aucun texte français à
l'écran, info-bulles et panneaux fermés compris ; en français, aucun texte anglais ; la démo en
anglais ne dessine aucun mot français (planches, coupe, écrans radar) ; messages et questions
en anglais ; le bouton bascule, garde le choix et le travail. Tout le banc passe dans les deux
langues (`banc-saisie.html?lang=en`).

État au 2026-10-09 : livraison 1 fusionnée (#25), v1.17 en ligne. `test_i18n` 1 624/1 624, et en
échec sur une traduction retirée ou un texte affiché sans `tr()` ; les 5 scénarios rouges sur la
v1.16 (sur la v1.16, la démo dessinait « 29° G · froide · radiale 88 % »), et en échec sur deux
traductions retirées. **Correction** : le « 82/82 en anglais » annoncé avec la v1.17 ne l'était
pas — le lanceur du banc perdait `&lang=en` de l'adresse, et ce passage a tourné en français
(les 5 scénarios de langue, qui choisissent leur langue eux-mêmes, valaient bien). Lanceur
corrigé, il affiche désormais la langue jouée.

**Fait quand (livraison 2)** — `test_i18n` : chaque bouton cité avec son pictogramme dans un guide
existe tel quel à l'écran dans la langue du guide ; aucun libellé de l'autre langue en gras ou
entre guillemets ; les noms des formes lus en **exécutant** `symbols.js` (deux étaient fabriqués
par une fonction et échappaient à la lecture du texte). Au banc : le kneeboard et le PNG
exportés en anglais (en-tête « Board n / m », date au format américain, aucun mot français).

État au 2026-10-09 : livraison 2 fusionnée (#26), v1.18 en ligne ; lot 16 clos. Le vrai passage anglais du banc a
trouvé 3 vérifications écrites en français seulement (pas de défaut de l'outil) ; le relevé des
libellés à l'écran a trouvé un vrai oubli, « Écran FCR RWS » et « Écran FCR TWS » restés en
français dans la palette anglaise, que ni `test_i18n` (lecture du texte) ni le banc (majuscule
accentuée non reconnue) ne voyaient : les deux filets sont corrigés, rouges sur l'oubli, puis
verts. Le guide anglais citait 11 libellés français (« ▶ Présenter », « ⇧ Ouvrir », « ✚ Nouveau »,
« ⬚ Cadre », « ◎ Porteur », « Effacer », « alt. sol »…) : rouge, puis aligné. `test_i18n`
1 914/1 914 ; banc 83/83 en français et 83/83 en anglais, langue jouée affichée ; le scénario des
exports rouge sur la v1.16 (en-tête « Planche… »).

#### Lot 18 — Déménagement vers `briefing.flightledger.io`

Date retenue par Vince le 2026-10-08 : lundi 2026-10-12, puis **avancée au jour même** (« GO » de
Vince le 2026-10-08) : les briefings gardés à l'ancienne adresse se récupèrent par une page
dédiée, au lieu d'un préavis de quatre jours.

| | |
|---|---|
| Bandeau (v1.15) | sur l'ancienne adresse seulement (`ludens-kith.github.io`), hors démo, et seulement si un briefing est gardé dans le navigateur : « **FL Briefing Board déménage le 12 octobre** sur briefing.flightledger.io. Vos briefings gardés dans ce navigateur ne suivront pas : enregistrez-les avec ⇩ Briefing, puis rouvrez-les à la nouvelle adresse avec ⇧ Ouvrir. » Boutons « ⇩ Enregistrer maintenant » (télécharge le fichier de briefing) et « Compris » ; l'un ou l'autre le ferme pour de bon. Masqué en mode présentation |
| Page de récupération | dépôt public [`fl-briefing-board-recuperation`](https://github.com/LUDENS-KITH/fl-briefing-board-recuperation), servi par Pages sur l'**ancienne origine** (`ludens-kith.github.io`), que la redirection du domaine ne touche pas : le stockage du navigateur est lié à l'origine, pas au chemin, donc cette page relit en lecture seule ce que l'ancienne adresse gardait (planches, réglages, images de fond) et le rend en fichier de briefing, à rouvrir avec ⇧ Ouvrir. Hors index |
| Bascule (v1.16) | fichier `CNAME`, domaine déclaré dans les réglages Pages, HTTPS forcé ; base des adresses absolues changée en un passage (`BASE` de `test_seo.js`, seule exception autorisée sur l'ancienne origine : la page de récupération), liens du README, de SOUTENIR et du dépôt ; lien de récupération dans le panneau ⓘ |
| Bandeau (v1.16) | sur la nouvelle adresse seulement, hors démo, sur un tableau vierge, jusqu'au 2026-11-30 : « **FL Briefing Board a déménagé** sur briefing.flightledger.io. Vous l'utilisiez à l'ancienne adresse (ludens-kith.github.io) ? Vos briefings y sont restés : la page de récupération vous les rend en fichier, à rouvrir ici avec ⇧ Ouvrir. » Boutons « Récupérer mes briefings » (ouvre la page de récupération) et « Compris » ; l'un ou l'autre le ferme pour de bon |

**Fait quand** — au banc, rouges avant le code (6 scénarios) : bandeau présent avec le nom, la
date, la nouvelle adresse et la consigne ; absent sur un tableau vierge, à une autre adresse,
dans la démo ; « Compris » le ferme et il ne revient pas à la réouverture ; « Enregistrer
maintenant » télécharge un fichier de briefing qui contient le travail et le ferme. Le 12 :
`node tools/test_seo.js https://briefing.flightledger.io/` sans échec, l'ancienne adresse
redirige, HTTPS valide.

**Fait quand (v1.16)** — au banc, rouges avant le code : bandeau présent sur un tableau vierge à
la nouvelle adresse, avec le nom, l'ancienne adresse et la consigne, et « Récupérer » ouvre la
page de récupération ; absent avec un briefing en cours, à une autre adresse, après novembre,
dans la démo ; « Compris » le ferme pour de bon ; lien du panneau ⓘ. Page de récupération
prouvée sur la vraie ancienne origine : un briefing garni (symbole et image de fond) relu,
téléchargé, puis rouvert intact.

#### Lot 17 — Mesure

Un relevé hebdomadaire, dans un fichier du poste, des chiffres de Search Console
(impressions, clics, requêtes, position) et du trafic GitHub (vues, visiteurs,
référents : GitHub les efface après 14 jours). Si D3 retient un compteur de visites :
réglé pour l'exemption de consentement de la CNIL, sans cookie, déclaré dans le guide.

**Fait quand** : deux relevés successifs écrits et comparables ; si compteur, une
visite de test vue dans son tableau de bord, et aucun cookie posé (vérifié dans le
navigateur).

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
| L'accroche se range dans le repère du dessin de l'hôte, en tailles de symbole, et non en terrain | c'est ce repère que voit le pilote : un symbole garde sa taille à l'écran quand la carte zoome |
| Accrocher : un symbole ou un texte, à un symbole de la même vue | les seuls objets de taille fixe à l'écran ; ce qui suit le terrain (zone, cercle, flèche) y reste déjà |
| Visibilité : l'adresse se décide avant toute promotion | le stockage du navigateur est lié à l'origine : un changement de domaine après coup rend inatteignables les briefings gardés par les visiteurs |
| Visibilité : diffusion internationale après l'interface anglaise | une première impression sur une interface dans une autre langue ne se rejoue pas |
| Visibilité : se présenter comme complémentaire des planificateurs | ils calculent (carburant, emports) ; le tableau sert à expliquer. Les affronter serait perdre sur leur terrain |
| Waypoint : plus petit numéro libre, sans renuméroter les autres | renuméroter casserait l'accord avec la mission importée et les étiquettes qui citent un numéro ; un compteur laissait des trous jusque dans la DTC |
| Import : ravitailleurs et AWACS seulement, à leur tâche DCS | ce sont eux qu'un pilote cherche au briefing ; les autres appareils de l'IA (CAP, cibles) seraient un autre lot |
| Orbite importée en symbole, pas à l'échelle | la mission ne donne ni la largeur d'un Race-Track ni le rayon d'un Circle : les dessiner serait inventer |
| Nouveau briefing : préférences d'affichage gardées, pas de raccourci | ce sont des réglages du poste, pas le briefing ; `Ctrl+N` ouvre une fenêtre du navigateur |
| La copie d'un objet accroché reste accrochée ; touche `J` pour accrocher | deux ravitailleurs sur une orbite ; `J` est libre, `A` est la flèche |
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
| 2026-10-06 | Fusion du lot 9 : v1.10 en ligne |
| 2026-10-07 | Lot 10 : accrocher un symbole à un autre ; lancement |
| 2026-10-07 | Lot 11 : nouveau briefing, dans la même PR que le lot 10 (v1.11) ; lancement |
| 2026-10-07 | Fusion des lots 10 et 11 : v1.11 en ligne |
| 2026-10-07 | Lot 12 : ravitailleurs et AWACS de la mission importée ; lancement |
| 2026-10-07 | Fusion du lot 12 : v1.12 en ligne |
| 2026-10-08 | Lot 13 : numéros de waypoint au plus petit libre ; lancement |
| 2026-10-08 | Fusion du lot 13 : v1.13 en ligne |
| 2026-10-08 | Chantier Visibilité ouvert : lots 14 à 17 proposés, [VISIBILITE.md](VISIBILITE.md) |
| 2026-10-08 | « GO » de Vince : recommandations D1 à D4 retenues ; lots 14 et 15 engagés, livrés en v1.14 |
| 2026-10-08 | D1 : CNAME `briefing.flightledger.io` et domaine `flightledger.io` vérifié pour GitHub Pages (TXT), posés par Vince |
| 2026-10-08 | Fusion des lots 14 et 15 : v1.14 en ligne ; publication Pages bloquée une fois côté GitHub, relancée |
| 2026-10-08 | Lot 18 : bascule fixée au 2026-10-12 par Vince ; bandeau d'avertissement livré (v1.15), fusion à valider |
| 2026-10-08 | Fusion du bandeau : v1.15 en ligne (publication Pages relancée à la main, GitHub ne l'avait pas déclenchée) ; bandeau vu sur l'adresse publique après rechargement d'un briefing gardé |

| 2026-10-08 | « GO » de Vince : bascule avancée au jour même ; page de récupération publiée et prouvée sur l'ancienne origine ; v1.16 |
| 2026-10-09 | Déménagement annoncé sur Discord (édition 014) |
| 2026-10-09 | « GO » de Vince : lot 16 en deux livraisons ; livraison 1 (l'écran en anglais, v1.17) faite, fusion à valider |
| 2026-10-09 | Fusion de la livraison 1 (#25) : v1.17 en ligne, vérifiée sur l'adresse publique ; livraison 2 (guides, exports, v1.18) faite |
| 2026-10-10 | Fusion de la livraison 2 (#26) : v1.18 en ligne, palette FCR et guide anglais vérifiés sur l'adresse publique ; lot 16 clos |
