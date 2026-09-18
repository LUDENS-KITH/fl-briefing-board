# État du projet — FL Briefing Board

> Document vivant. Dernière mise à jour : **2026-09-18**, version **v1.1**.
> Il répond à une seule question : *où en est le projet, et sur quoi peut-on compter ?*
> Le modèle technique est dans [MODELE.md](MODELE.md).

## 1. Verdict

**Prototype utilisable, jamais employé en conditions réelles.** Toutes les fonctions
annoncées ci-dessous ont été exécutées et observées, aucune ne repose sur une
relecture de code. Ce qui manque à ce jour n'est pas un défaut : c'est un périmètre
volontairement fermé (§5).

Le dépôt est **public depuis le 2026-09-18** :
[LUDENS-KITH/fl-briefing-board](https://github.com/LUDENS-KITH/fl-briefing-board), démo en
ligne sur [ludens-kith.github.io/fl-briefing-board](https://ludens-kith.github.io/fl-briefing-board/?demo)
(GitHub Pages, branche `main`). Un seul test automatique : la déclinaison magnétique contre les valeurs
officielles du NOAA (`node tools/test_magnetic.js`). Pas de déploiement.
C'est cohérent avec son âge — un jour — mais c'est à connaître avant de s'y appuyer.

## 2. Ce qui est vérifié

Vérifications faites en servant le dossier localement et en pilotant l'application
par événements pointeur réels, pas en relisant le code.

| Domaine | Contrôle | Résultat | Date |
|---|---|---|---|
| Chargement | 18 formes, 18 vignettes, 3 groupes | aucune erreur console | 2026-09-17 |
| Pose | poser + orienter d'un seul geste | cap 135°, échelle 1,72 conformes au glissé | 2026-09-17 |
| Flèches | tracé droit puis courbure par la poignée centrale | point de contrôle déplacé, courbe rendue | 2026-09-17 |
| Couleur | recolorer la sélection | flèche passée au rouge sans retracer | 2026-09-17 |
| Préhension | saisir un bombardier **par le bout d'aile** | sélectionné puis déplacé | 2026-09-17 |
| Édition | duplication, suppression par `Suppr` | 1 → 2 → 1 objet | 2026-09-17 |
| Historique | 4 annulations en chaîne après un effacement | retour au vide, aucun saut | 2026-09-17 |
| Export | PNG | `data:image/png` valide, canvas non contaminé | 2026-09-17 |
| Rendu | scène de briefing de 26 objets | conforme, lisible à distance | 2026-09-17 |
| Gomme | clic au milieu d'un trait tracé vite | trait supprimé | 2026-09-17 |
| Gomme | clic dans une zone vide au-dessus d'une carte de fond | carte conservée | 2026-09-17 |
| Image de fond | sélection puis `Suppr` | carte retirée, tableau vide | 2026-09-17 |
| Logo | icône rastérisée à 16 px réels, favicon et en-tête chargés | lisible, chargés | 2026-09-18 |
| Saisie | forme posée puis déplacée **sans changer d'outil** | déplacée, 1 seul objet | 2026-09-18 |
| Saisie | toucher le vide avec une forme choisie | nouvelle forme posée | 2026-09-18 |
| Couleur | choisir le rouge juste après avoir posé une forme bleue | la forme posée reste bleue | 2026-09-18 |
| Historique | toucher une forme sans la bouger | aucune entrée ajoutée | 2026-09-18 |
| Étiquettes | posée, suit la forme déplacée, éditée à l'outil texte, vidée, annulée | conforme | 2026-09-18 |
| Styles | tirets appliqués à la flèche sélectionnée | conforme | 2026-09-18 |
| Zones | refermée sur le 1er point, sous les symboles, étiquetée, sommet déplacé, `Échap` | conforme | 2026-09-18 |
| Règle | 300 px → 20,0 NM après étalonnage ; caps 360° et 090° ; étalonnage annulable | conforme | 2026-09-18 |
| Échelle | carte agrandie ×1,25 | échelle ×1,25 | 2026-09-18 |
| Planches | copie, indépendance, historique propre, renommage, PgPréc/PgSuiv, suppression | conforme | 2026-09-18 |
| Kneeboard | export 768 × 1024, en-tête, textes lisibles, canvas non contaminé | conforme à l'écran | 2026-09-18 |
| Persistance | 21 objets et l'échelle relus après rechargement (servi en HTTP) | conforme | 2026-09-18 |
| Ouverture locale | `file://` dans Chrome sans interface : 28 vignettes, onglets, aucun bandeau d'erreur | conforme | 2026-09-18 |
| Raccourci bureau | créé par `tools\creer-raccourci.ps1`, relu : cible Brave `--app=file:///…`, icône présente | conforme | 2026-09-18 |
| Cotes | trait 300 px → 20,0 NM / 37,0 km ; flèche courbe 22,0 NM contre 20,0 de corde ; caps 360° et 225° | conforme | 2026-09-18 |
| Unité | étalonnage demandé en km ; préférence relue après rechargement | conforme | 2026-09-18 |
| Coupe | chasseur lâché à 25 230 ft → FL250 ; orienté à gauche : retourné, pas sur le dos | conforme | 2026-09-18 |
| Coupe | dôme FL225, bloc FL200 – FL250, relief ; tous sous les symboles | conforme | 2026-09-18 |
| Coupe | règle « 20.0 NM · +20 000 ft » ; outils de coupe sans effet dans le plan | conforme | 2026-09-18 |
| Coupe | plafond et largeur changés : altitudes et distances inchangées ; annulable | conforme | 2026-09-18 |
| Coupe | aucun mélange plan / coupe au clic ; non-régression du plan écran partagé | conforme | 2026-09-18 |
| Kneeboard | plan en haut, coupe en bas, textes lisibles dans les deux | conforme à l'écran | 2026-09-18 |
| Route liée | distances cumulées 0 / 30 / 48 NM ; déplacement en plan → 50 NM ; altitudes tirées et tapées ; annulables | conforme | 2026-09-18 |
| Route liée | messages sans waypoint et sans échelle ; largeur ouverte, une seule annulation | conforme | 2026-09-18 |
| Route liée | relue après rechargement ; présente dans le kneeboard (1 210 px contre 0) | conforme | 2026-09-18 |
| Cartes | 3 fournisseurs chargés et exportables depuis `file://` ; CARTO écarté (image « clé requise ») | conforme | 2026-09-18 |
| Cartes | objets fixes à l'écran quand la carte arrive, suivent zoom et déplacements, saisissables après zoom | conforme | 2026-09-18 |
| Cartes | Batumi → Kutaïssi : 52,2 NM · 049° contre 52,1 NM · 49° vrai (grand cercle) | conforme | 2026-09-18 |
| Cartes | pincement, clic droit, sélection dans le vide ; kneeboard avec carte, coupe et route | conforme | 2026-09-18 |
| Cartes | relue après rechargement ; non-régression complète des planches sans carte | conforme | 2026-09-18 |
| Caps magnétiques | WMM2025 : 100 points NOAA, écart max 0,005° ; le test échoue sur 3 calculs faussés | conforme | 2026-09-18 |
| Caps magnétiques | Batumi → Kutaïssi 049°V / 042°M (auto) / 044°M (5° saisis) ; sans carte ni saisie : rien d'inventé | conforme | 2026-09-18 |
| Caps magnétiques | saisie, lecture, refus, annulation, persistance, pied de page du kneeboard | conforme | 2026-09-18 |
| Démo | `?demo` : deux planches, carte, route liée, coupe ; stockage du visiteur identique à l'octet | conforme | 2026-09-18 |
| Vitrine | signature LK Studio dans le PNG et le kneeboard ; fenêtre À propos | conforme | 2026-09-18 |

## 3. Ce qui n'est pas vérifié

À traiter comme *inconnu*, pas comme *acquis* :

- **le premier lancement réel du raccourci** par Vince : le chargement en `file://`
  est vérifié dans Chrome sans interface, le raccourci est relu, mais la fenêtre Brave
  en mode application n'a pas été ouverte de mon côté ;
- **les cartes dans Brave** : vérifiées dans Chromium (Chrome sans interface et
  aperçu intégré). Les boucliers de Brave pourraient bloquer un fournisseur de tuiles ;
  à voir au premier lancement ;
- **le pincement au doigt réel** : simulé par deux pointeurs, pas sur un écran tactile ;
- **l'usage tactile réel** (doigt, stylet, écran de salle). Le code passe par
  `PointerEvent` et `touch-action: none`, ce qui couvre ces entrées en théorie ;
  aucune séance réelle n'a eu lieu ;
- **le comportement multi-navigateurs** : seul le moteur de l'aperçu intégré
  (Chromium) a servi ;
- **la persistance en `file://`** (double-clic) : elle est désormais observée quand
  la page est servie en HTTP, pas quand elle est ouverte comme fichier local ;
- **le kneeboard dans DCS** : le PNG sort au format 768 × 1024, mais personne ne l'a
  encore chargé dans le cockpit. Le dossier `Saved Games\DCS\Kneeboard\` est cité
  de mémoire, pas vérifié.

## 4. Périmètre livré

**Palette — 28 formes** paramétriques, donc orientables, redimensionnables et
recolorables :

- *Aéronefs* : chasseur, bombardier, ravitailleur, civil, hélicoptère, AWACS, drone ;
- *Armement / Effets* : missile, bombe, explosion, abattu, éjection, leurres ;
- *Sol / Mer* : char, radar, menace sol-air, aéroport, navire, porte-avions, FARP ;
- *Tactique* : ami, hostile, inconnu, waypoint auto-numéroté, objectif, orbite, point IP, bullseye.

**Outils de tracé** : sélection, flèche, trait, crayon libre, cercle, rectangle,
zone hachurée, règle, texte, gomme ; trois styles de trait ; cotes distance et cap
sur traits et flèches, en NM ou en km.

**Coupe** : écran partagé, vue de profil en pieds et niveaux de vol, 14 silhouettes de
profil, altitude affichée et calée sur 500 ft, relief, dôme sol-air, bloc d'altitude,
plafond et largeur réglables par planche.

**Planches** : une par phase, copiées d'un clic, chacune avec son historique et son
échelle. **Exports** : PNG écran, kneeboard DCS 768 × 1024.

**Gestes** : pose orientée en un geste · déplacement · rotation et mise à l'échelle
par poignée · rotation fine au clavier · courbure de flèche · flèche double sens ·
duplication · premier plan · recoloration de la sélection.

**Tableau** : image de fond par glisser-déposer ou collage, fond sombre ou clair,
palette masquable, annuler/rétablir par instantanés, export PNG horodaté,
reprise locale hors images.

## 5. Hors périmètre — décidé, pas oublié

| Absent | Raison |
|---|---|
| Zoom et défilement sans carte | le tableau blanc reste l'écran (décision du 2026-09-17) ; avec une carte, zoom et déplacement sont libres (v0.9) |
| Collaboration temps réel | un meneur dessine, les autres regardent (décision du 2026-09-17) |
| Lien aux données FlightLedger | tableau libre d'abord (décision du 2026-09-17) |
| Carte F10 du jeu | ni extractable ni réutilisable ; cartes réelles des mêmes régions à la place |
| Cartes hors ligne | les tuiles viennent d'Internet ; une carte déjà vue peut manquer sans réseau |
| Sélection multiple, groupes, calques | marque le point de bascule vers Excalidraw (§7) |

## 6. Défauts trouvés et corrigés

Tenus ici parce qu'ils disent quelque chose sur les pièges du code, pas pour la
statistique.

1. **Annuler après un effacement supprimait l'objet précédent** (v0.1). L'historique
   empilait les objets retirés, pas les états. Corrigé par instantanés.
2. **Les quatre voilures fixes étaient indiscernables** à petite taille (v0.2).
   Corrigé en différenciant envergure, flèche, nombre de moteurs et taille par défaut.
3. **La zone de préhension d'un symbole était un cercle centré sur le fuselage**
   (v0.2) : impossible d'attraper un bombardier par son aile ou un cercle SAM par son
   anneau. Corrigé par un rayon propre à chaque forme.
4. **La gomme pouvait supprimer l'image de fond** (v0.2.1) : rendre les images
   sélectionnables les avait rendues effaçables d'un clic dans le vide. La gomme les
   ignore désormais ; une image se retire par sélection puis `Suppr`.
5. **La gomme ratait le milieu d'un trait tracé vite** (v0.2.1) : le test de contact
   ne regardait que les points enregistrés, or un geste rapide n'en produit que
   quelques-uns. Il mesure désormais la distance aux segments. Défaut trouvé en
   vérifiant le correctif n° 4 — pas en relisant le code.
6. **Une forme posée ne se déplaçait pas sans changer d'outil** (v0.4, signalé par
   Vince). Tout le moteur savait déplacer ; c'est l'accès qui manquait : seul l'outil
   sélection le permettait, et rien ne le disait. Le test du 2026-09-17 passait
   parce qu'il **choisissait** l'outil sélection — il vérifiait la fonction, pas le
   chemin qu'un pilote emprunte.
7. **Choisir une couleur repeignait la dernière forme posée** (v0.4) : elle restait
   sélectionnée. Une forme posée est maintenant lâchée.
8. **L'étiquette d'une zone disparaissait sous son contenu** (v0.5) : placée au centre,
   là même où l'on pose le SAM ou l'AWACS qui justifie la zone. Placée en haut.
9. **Kneeboard illisible** (v0.5) : une planche paysage réduite dans une page portrait
   tombait à ~70 %, étiquettes vers 8 px. Les textes gardent désormais leur taille
   écran à l'export.

## 7. Risques connus

- **Point de bascule technique.** Le moteur tient sur un principe simple : un objet
  sélectionné, une poignée. Sélection multiple, groupes ou alignement automatique le
  feraient sortir de son domaine. Le remplaçant identifié est
  [`@excalidraw/excalidraw`](https://github.com/excalidraw/excalidraw) (MIT), au prix
  de silhouettes devenues des SVG figés, donc **non recolorables**. Compromis à peser
  le jour où le besoin apparaît, pas avant.
- **Aucun filet de sécurité automatisé.** Toute évolution se revérifie à la main ;
  le tableau des §2 est la seule mémoire des contrôles passés.
- **Une planche paysage remplit mal un kneeboard portrait** : environ 40 % de la page
  utilisée. Les textes restent lisibles, les symboles rapetissent. Composer les
  planches destinées au cockpit plutôt en hauteur, ou ajouter un jour un cadrage
  manuel de l'export.
- **Seuls les waypoints font la route liée**, dans l'ordre de leurs numéros. Un
  numéro supprimé laisse un trou sans conséquence ; deux routes distinctes sur une
  même planche ne sont pas prévues. Ce qu'on dessine librement dans la coupe (relief,
  menaces, appareils) n'est pas recalé quand la route change.
- **La route n'alerte pas si elle passe sous le relief** : le relief est dessiné à main
  levée, pas tiré d'un modèle de terrain.
- **La version publique n'a pas de couche d'aérodromes** : leur source ne publie aucune
  licence (décision du 2026-09-18). Les cartes montrent les terrains réels ;
  `tools/build_theatres.py --aerodromes` rétablit les noms DCS en local.
- **La coupe a une hauteur fixe** (300 px), pour qu'une altitude reste une altitude
  quand la fenêtre change de taille. Sur un petit écran, la vue de dessus se réduit.
- **La déclinaison calculée est celle du monde réel aujourd'hui**, pas forcément celle
  de DCS : 7,4° E au Caucase selon WMM2025, « environ 5° » selon le manuel du Ka-50. Pour
  des caps identiques au cockpit, **saisir la déclinaison de la mission** (bouton Décl.).
  Le modèle n'est valable que de 2025 à 2030 ; une mission datée de 1944 ou de la guerre
  froide a une déclinaison très différente — la saisir.
- **Les fournisseurs de tuiles sont des services tiers gratuits**, sous conditions
  (attribution, usage raisonnable). Un changement de leur politique peut couper un
  fond du jour au lendemain ; les trois fonds se remplacent entre eux.
- **Piège de nommage dans le modèle** : le champ `s` porte l'échelle sur un symbole
  et la chaîne sur un texte (voir [MODELE.md](MODELE.md) §5). Sans conséquence
  aujourd'hui, à surveiller à chaque ajout de code générique.

## 8. Prochaines étapes envisagées

Aucune n'est engagée ; l'ordre dépend du premier usage réel.

1. Conserver les images glissées d'une ouverture à l'autre (aujourd'hui perdues).
2. Alerte de franchissement du relief par la route liée (le relief dessiné le
   permet, avec la réserve ci-dessus).
3. Debriefing sur trace réelle : poser ces symboles par-dessus la trajectoire
   effectivement volée (ACMI / Tacview) — le seul angle que ni e-Brief ni Excalidraw
   ne peuvent tenir, et FlightLedger possède déjà la donnée.
