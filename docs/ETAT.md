# État du projet — FL Briefing Board

> Document vivant. Dernière mise à jour : **2026-10-08**, version **v1.15**.
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
(GitHub Pages, branche `main`). Deux filets automatiques : la déclinaison magnétique contre les valeurs
officielles du NOAA (`node tools/test_magnetic.js`) et, depuis la v1.2, le banc de saisie
(`tools/banc-saisie.html`, 77 scénarios) et la géométrie de la vue radar liée
(`node tools/test_radar.js`, 26 vérifications), et la lecture des missions
(`node tools/test_miz.js`, 46 vérifications). Pas de déploiement.
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
| Banc de saisie | 15 scénarios ; les 13 nouveaux échouent sur la v1.1.1, les 15 passent en v1.2 | conforme | 2026-09-30 |
| Ouverture | outil Sélection, aucune vignette allumée ; un clic dans le vide ne pose rien | conforme | 2026-09-30 |
| Clic droit | sans bouger : retour à la sélection, rien de posé, menu du navigateur bloqué, avec et sans carte ; glissé sur une carte : la carte bouge | conforme | 2026-09-30 |
| Clic droit | pendant une pose ou une zone : geste abandonné, aucune entrée d'historique ; clic molette sans carte : rien de posé | conforme | 2026-09-30 |
| Clic droit | souris réelle dans l'aperçu intégré : chasseur posé, clic droit, outil Sélection, rien de posé | conforme | 2026-09-30 |
| Échap | retour à la sélection ; zone en cours abandonnée sans trace | conforme | 2026-09-30 |
| Ancrage | pose par-dessus ; ni glissé, ni poignée, ni flèches, ni gomme, ni `Suppr` ; message de refus ; libéré, tout revient | conforme | 2026-09-30 |
| Ancrage | annulé, rétabli, relu après réouverture ; forme libre saisie sous une ancrée ; zone ancrée sur carte : glisser déplace la carte | conforme | 2026-09-30 |
| Ancrage | épingle or dessinée à la sélection, absente sans sélection ; PNG et kneeboard identiques avec ou sans sélection | conforme | 2026-09-30 |
| Non-régression | démo : 2 planches, 12 objets, route liée, aucune erreur console ; WMM2025 100/100 | conforme | 2026-09-30 |
| Kit radar F/A-18C | 6 scénarios au banc, rouges avant le moteur (échecs de comportement, pas d'absence), verts après ; 21/21 | conforme | 2026-09-30 |
| Kit radar F/A-18C | écran posé sous les pistes, traversable, pris par son coin, agrandi par sa poignée ; échelle et azimut au clavier, annulables | conforme | 2026-09-30 |
| Kit radar F/A-18C | HAFU orienté au geste sans changer de taille, à sa couleur d'identité ; L&S et DT2 uniques par planche ; curseur TDC posé sur une piste | conforme | 2026-09-30 |
| Kit radar F/A-18C | rendu relu en image : pages RWS, TWS, STT, vignettes, planche de démo, kneeboard | conforme | 2026-09-30 |
| Kit radar F-16C | 2 scénarios au banc : la cible désignée échoue avant le moteur (marques par appareil), passe après ; le réglage au clavier passait déjà, le moteur étant générique ; 23/23 | conforme | 2026-09-30 |
| Kit radar F-16C | rendu relu en image : FCR RWS et TWS, limites de balayage A3, vignettes, planche de démo ; aucune erreur console | conforme | 2026-09-30 |
| Vue radar liée | géométrie : 26 vérifications calculées à la main ; le test attrape quatre calculs faussés (sens du gisement, côtés, aspect pris du nez, abscisse sur le balayage) | conforme | 2026-09-30 |
| Vue radar liée | 4 scénarios au banc, rouges avant le code : message sans porteur, porteur désigné, cible déplacée, porteur tourné de 30°, sans échelle rien d'inventé, panneau non éditable ; 27/27 | conforme | 2026-09-30 |
| Fichier de briefing | 4 scénarios au banc, rouges avant le code : image relue après réouverture ; enregistrer puis ouvrir sur un poste vierge, fichier identique, image comprise, gardé à la réouverture ; fichier étranger refusé ; confirmation avant de remplacer ; nom de planche piégé resté du texte ; 31/31 | conforme | 2026-09-30 |
| Animation entre phases | 3 scénarios au banc, rouges avant le code : uid gardé par « + phase », neuf par Ctrl+D ; à mi-transition, un chasseur à mi-chemin et à une couleur intermédiaire, un bombardier apparu à mi-fondu ; hors présentation, changement instantané ; 40/40 | conforme | 2026-09-30 |
| Animation entre phases | démo dans Brave, vrais événements d'entrée : Ingress → Attaque, trois captures à 22 %, 61 % et fin — UZI 1-1 glisse de la mer vers l'objectif, UZI 1-2 et la flèche d'ingress s'effacent, la cible et la flèche d'attaque entrent en fondu ; vue radar liée : un bandit passe de 40,x NM (au-delà) à 11° puis 0° | conforme | 2026-09-30 |
| Kneeboard cadré | 4 scénarios au banc : cadre posé, déplacé par son bord, agrandi sans changer de proportions, ôté, rétabli par Ctrl+Z ; il remplit exactement la zone du plan de la page, sans carte comme sur carte ; page aux proportions de la planchette DCS ; absent du PNG. Ces trois-là rouges avant le code ; le 4e, absent en présentation, mis en échec en retirant la garde ; 44/44 | conforme | 2026-09-30 |
| Kneeboard cadré | démo dans Brave, vrais événements d'entrée : cadre posé, déplacé par son bord, réduit par sa poignée ; la page 768 × 1157 montre exactement son contenu, sans le cadre ; sans cadre, la planche entière au nouveau format | conforme | 2026-09-30 |
| Marques de piste | 2 scénarios au banc, rouges avant le code, le cas signalé par Vince : écran RWS, brique, hostile — L&S au bout de la tige marque le hostile, sur le fond pose une piste inconnue marquée, sur la brique en fait cette piste, Ctrl+Z la rend ; refus sur l'écran du F-16C, message aux deux noms ; cible chaude désignée → piste système au cap 180° ; 46/46 | conforme | 2026-09-30 |
| Marques de piste | Brave, vrais événements : écrans RWS et TWS, brique, inconnu, hostile ; L&S et DT2 posées à la souris ; étoile et losange lisibles sur les trois HAFU, tige à 0° et à 130° (relu grossi ×4 et à taille réelle) | conforme | 2026-09-30 |
| Marques de piste | L&S et DT2 sur deux pistes : 1 scénario au banc, rouge avant le code — échange dans les deux sens, retrait sur sa propre piste, DT2 refusée sur la seule L&S avec message, L&S sur la DT2 seule qui la promeut ; 47/47 | conforme | 2026-10-01 |
| Marques de piste | démo publiée v1.9.1, Brave, vrais événements : DT2 à 28 px du hostile, sur la brique, sur le fond, retirée, refusée sur l'écran et une piste du F-16C ; cible désignée du F-16C (cibles chaude et froide, fond, refus sur le F/A-18C). Défaut trouvé : DT2 sur la piste L&S effaçait la L&S — corrigé en v1.9.2 | conforme | 2026-10-01 |
| Import de mission | projection des théâtres mesurée sur les balises de l'installation DCS : 7 théâtres, écart moyen 4 cm, 8 cm au pire ; méridiens et échelle ronds (UTM) | conforme | 2026-09-30 |
| Import de mission | `node tools/test_miz.js` : projection et inverse contre pyproj à 1 mm près, table Lua, archive zip ; en échec sur six calculs faussés | conforme | 2026-09-30 |
| Import de mission | missions réelles de l'escadron : départ piste de Goudaouta sur le point de référence du terrain (0,00 km) ; sept départs parking à 0,3 – 1,1 km du point de référence de leur terrain | conforme | 2026-09-30 |
| Import de mission | 3 scénarios au banc, rouges avant le code : choix du vol, route et altitudes, bullseye, SAM, carte, route liée ; planche en grille à l'échelle exacte et caps « G » ; .miz illisible refusé ; 37/37 · deux missions réelles importées dans Brave en `file://`, capture relue | conforme | 2026-09-30 |
| Route dans la DTC | `node tools/test_miz.js` 83/83, rouge avant le code : archive relue par zlib (CRC, tailles), entrées non touchées identiques, mission inchangée hors références `DTC`, cartouche au format de l'éditeur, reprise d'une cartouche existante, réécriture sans doublon, cinq refus | conforme | 2026-10-06 |
| Route dans la DTC | 4 scénarios au banc, rouges avant le code : planche carte et planche sans carte ramenées aux positions DCS d'origine à moins de 2 m, après enregistrement, réouverture et « + phase » ; refus expliqués (pas de route, pas de repère, autre théâtre, aucun F/A-18C) ; choix du vol parmi les seuls Hornet ; mis en échec par deux mutations ; 51/51 | conforme | 2026-10-06 |
| Ravitailleurs et AWACS | `node tools/test_miz.js` 91/91, 8 contrôles nouveaux dont 6 rouges avant le code : tâche Refueling et AWACS lues, ravitailleur sans tâche écarté, route, orbite Race-Track (point suivant) et Anchored (dans une tâche contrôlée, branche chaude), altitude de l'orbite, TACAN, fréquence | conforme | 2026-10-07 |
| Ravitailleurs et AWACS | 1 scénario au banc, rouge sur le moteur d'avant : ravitailleur et AWACS accrochés à leur orbite, routes tiretées, étiquettes (niveau, TACAN, fréquence), orbite Race-Track au milieu de sa branche et dans son axe, bilan ; 65/65. Mission réelle de Vince (« CAUCASUS - Entraînement Sol - FA-18C Multi 4 », 1,4 Mo) dans Brave : Texaco 11 (FL200, TCN 12Y TEX, 251.000) et Overlord 1 (FL250, 260.000) sur leurs orbites | conforme | 2026-10-07 |
| Bandeau de déménagement | 6 scénarios au banc, rouges avant le code : présent sur l'ancienne adresse avec un briefing gardé (nom, date, nouvelle adresse, consigne) ; absent sur un tableau vierge, à une autre adresse, dans la démo ; « Compris » le ferme pour de bon ; « Enregistrer maintenant » télécharge le briefing et le ferme ; 77/77. Rendu vérifié dans Brave | conforme | 2026-10-08 |
| Référencement et présentation | `node tools/test_seo.js` 149/149, rouge avant le code (27 échecs) : titre, description (50 à 160 caractères), canonique, Open Graph et carte Twitter, image de partage présente, texte sans script, liens vers les présentations ; pages `fr/` et `en/` : langue, `hreflang` croisés, données `SoftwareApplication`, boutons vers le tableau et la démo, non-affiliation, un seul `h1`, images avec `alt` et dimensions, aucun lien local cassé ; plan du site, `robots.txt`, réglages Jekyll et `noindex` des six documents de travail. Mutation : un lien d'image et un `hreflang` faussés sont signalés. Dans Brave à 1 440 et 375 px : aucune image cassée, aucun défilement horizontal. Banc 71/71 (non-régression) | conforme | 2026-10-08 |
| Numéros de waypoint | 6 scénarios au banc, rouges avant le code : tout supprimé, le suivant repart de 1 ; le dernier supprimé rend son numéro ; un trou au milieu comblé puis la suite reprend (2, puis 5) ; la copie prend le plus petit libre ; un briefing ouvert au compteur d'avant (`wpN` 9) numérote au plus petit libre ; liens des guides du panneau ⓘ vers la page mise en forme ; 71/71. Dans Brave, vrais clics : 1-2-3-4 posés, 2 supprimé, le suivant porte 2 | conforme | 2026-10-08 |
| Nouveau briefing | 3 scénarios au banc, rouges avant le code : tableau garni (2 planches, image, km) remis à une planche vide, sans carte ni historique, km gardé, vierge à la réouverture, IndexedDB vide ; refus de la confirmation sans effet ; tableau déjà vierge sans question ; Effacer inchangé (non-régression) ; 64/64. Démo dans Brave, vrai clic : boîte de confirmation (« Les 5 planches… »), tableau vierge, message | conforme | 2026-10-07 |
| Accroche | 8 scénarios au banc, rouges avant le code, et un témoin du défaut (non accroché, l'écart à l'orbite change au zoom) : écart écran constant à 0,5 px en zoom avant et arrière ; orbite déplacée, tournée d'un quart de tour (cap du ravitailleur compris), agrandie du double ; ravitailleur glissé resté accroché ; décroche, `Ctrl+Z` / `Ctrl+Y`, réouverture, fichier ; refus (sans sélection, zone, vide, boucle) et `Échap` ; hôte effacé puis rendu ; copie et « + phase » ; chaîne texte → ravitailleur → orbite ; 60/60 | conforme | 2026-10-07 |
| Accroche | démo dans Brave, vrais gestes, en local puis sur la démo publiée v1.11 : écart écran identique aux zooms 7,6, 8,6, 10,1 ; page kneeboard à son zoom (7,86), ravitailleur sur sa branche ; mi-transition Ingress → Attaque ; pointillé vers l'hôte à la sélection | conforme | 2026-10-07 |
| Route dans la DTC | mission réelle Sandbox Colchide (9,7 Mo, cartouche Hornet existante) : `unzip -t` sans erreur ; mission relue par `luae.exe` de DCS, 11 différences, toutes dans la table `DTC` des 4 Hornet du vol choisi ; cartouche d'origine reprise (ALR67, COMM, TCN, réglages de navigation identiques), waypoints aux champs exacts de l'éditeur | conforme | 2026-10-06 |
| Présentation | 3 scénarios au banc, rouges avant le code : barres et palette masquées, tableau pleine largeur, Échap en sort ; phases au clavier, outils et Ctrl+Z muets ; laser hors objets et hors historique, éteint en 1,8 s ; 34/34 | conforme | 2026-09-30 |
| Présentation | Brave sans interface, vrais événements souris et clavier, en `file://` : clic sur ▶ Présenter → plein écran accordé ; laser tracé ; → phase suivante ; Échap quitte plein écran et présentation, les barres reviennent ; capture relue | conforme | 2026-09-30 |
| Fichier de briefing | Brave sans interface, en `file://` comme le raccourci : image déposée relue après rechargement ; briefing de 2 planches enregistré dans un profil, ouvert dans un second profil vierge : identique | conforme | 2026-09-30 |
| Vue radar liée | interception au Caucase : de face 18 · 100 %, au travers 9D · 0 %, qui s'éloigne 3D · 88 % ; tiges et traits de nez dans le bon sens, relus en image agrandie ; kneeboard avec l'écran sous le plan | conforme | 2026-09-30 |

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
- **le kneeboard dans DCS** : aucune page n'a encore été vue dans le cockpit. Son
  format, lui, est lu dans les fichiers du jeu (`Scripts/Aircrafts/_Common/Cockpit/KNEEBOARD`) :
  une image du dossier est étirée sur toute la planchette, de proportions
  0,142 × 0,214 ; la page sort à ces proportions depuis la v1.9. Le dossier
  `Saved Games\DCS\Kneeboard\` existe sur le poste de mesure et y sert déjà ;
- **le clic droit dans Brave en mode application** : vérifié dans Chromium, au banc et
  à la souris réelle ; le menu natif n'a pas pu être observé à l'écran, son blocage est
  vérifié sur l'événement (`defaultPrevented`) ;
- **le retour à la sélection au doigt** : un écran tactile n'a ni clic droit ni `Échap` ;
  il passe par le bouton Sélection (⬈). L'appui long n'a pas été essayé ;
- **l'import sur les théâtres sans balises lues** : Normandie et Mariannes 1944 (sans
  balises), Nevada, La Manche, Atlantique Sud, Allemagne et Irak (non installés sur le
  poste de mesure) passent par une planche sans carte ; relancer
  `tools/build_projections.py` sur une installation qui les a ;
- **les écrans radar face au jeu d'aujourd'hui** : chaque libellé et chaque symbole vient
  du manuel ED ([RADAR.md](RADAR.md)), dont les figures sont des captures du jeu. Seule
  une page modifiée par DCS depuis l'édition du manuel resterait fausse ; un écart vu en
  vol ouvre une correction ;
- **les réglages des écrans radar au doigt** : échelle et azimut se changent au clavier.
- **la DTC écrite par le tableau, dans le jeu** : son format est lu dans l'éditeur de
  mission et sur des cartouches réelles, et la mission produite est relue par
  l'interpréteur Lua de DCS ; mais aucune copie n'a encore été ouverte dans l'éditeur ni
  chargée dans un cockpit. Le chargement au démarrage (`AutoLoad`) et une cartouche qui
  ne contient que les waypoints sont à confirmer au premier vol.

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

**Kit radar F/A-18C** : écrans RDR ATTK en RWS, TWS et STT (20 boutons, libellés
sourcés, B-scope), briques, HAFU ami, inconnu, hostile avec tige de cap, marques L&S et
DT2, curseur TDC. **Kit radar F-16C** : écrans FCR en RWS et TWS, cibles de recherche
chaude et froide, pistes TWS et système, cible désignée, curseur A-A, brouillage,
bullseye. Une planche de démo par appareil.

**Vue radar liée** : l'écran TWS du F/A-18C ou du F-16C d'un porteur, calculé depuis la
vue de dessus ; aspect, hémisphère, part radiale ; cône balayé sur la carte ; planche
« Interception » dans la démo ; au kneeboard.

**Planches** : une par phase, copiées d'un clic, chacune avec son historique et son
échelle. **Exports** : PNG écran, kneeboard DCS 768 × 1157 aux proportions de la
planchette du jeu, cadrable sur le plan.

**Gestes** : pose orientée en un geste · déplacement · rotation et mise à l'échelle
par poignée · rotation fine au clavier · courbure de flèche · flèche double sens ·
duplication · premier plan · recoloration de la sélection · ancrage · retour à la
sélection par clic droit ou `Échap`.

**Tableau** : image de fond par glisser-déposer ou collage, fond sombre ou clair,
palette masquable, annuler/rétablir par instantanés, export PNG horodaté,
reprise locale **images comprises** (IndexedDB) ; **fichier de briefing** `.json` à
enregistrer et ouvrir, images comprises ; **mode présentation** (plein écran, phases au
clavier, pointeur laser) ; **import de mission `.miz`** (route, bullseye, défenses
aériennes, navires) ; **route écrite dans la DTC du F/A-18C** d'une copie de la mission ; **animation entre phases** en présentation ; **cadrage du
kneeboard**.

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
10. **Le kneeboard sortait déformé dans le jeu** (v0.5 à v1.8) : la page faisait
    768 × 1024, soit 3:4, or DCS étire toute image du dossier sur sa planchette,
    0,142 × 0,214. Elle y était comprimée d'environ 11 % en largeur : cercles ovales,
    textes tassés. Trouvé en lisant les fichiers du jeu au lot 8, pas en jeu ; la page
    sort désormais en 768 × 1157.
11. **L&S inutilisable sur l'écran** (v1.3 à v1.9, signalé par Vince). La marque ne se
    posait qu'au toucher exact d'un HAFU ; sur la brique, le fond de l'écran ou le bout
    de la tige, elle était refusée, par un message — « piste du groupe Radar F/A-18C » —
    qui se lisait « écran du F/A-18C ». Et posée, elle ne se voyait pas : au trait épais
    du tableau, les jambes du chevron hostile couvraient l'étoile, et le losange DT2
    disparaissait. La marque désigne désormais un écho comme au cockpit (p. 176), se
    dessine par-dessus la tige avec un liseré. Le banc vérifiait l'état de la piste,
    jamais le dessin ni le geste d'un pilote sur un écran garni.
12. **La DT2 posée sur la piste L&S effaçait la L&S** (v1.3 à v1.9.1), sans un mot : une
    piste ne porte qu'une marque. Dans l'avion, L&S et DT2 sont toujours deux pistes, et
    désigner la DT2 les échange (p. 173). Elles s'échangent désormais ; la DT2 est
    refusée sur la seule L&S. Trouvé en vérifiant la DT2 sur la démo publiée.

## 7. Risques connus

- **Point de bascule technique.** Le moteur tient sur un principe simple : un objet
  sélectionné, une poignée. Sélection multiple, groupes ou alignement automatique le
  feraient sortir de son domaine. Le remplaçant identifié est
  [`@excalidraw/excalidraw`](https://github.com/excalidraw/excalidraw) (MIT), au prix
  de silhouettes devenues des SVG figés, donc **non recolorables**. Compromis à peser
  le jour où le besoin apparaît, pas avant.
- **Un filet de sécurité partiel.** Le banc de saisie couvre le clic droit, `Échap` et
  l'ancrage (v1.2) ; le reste — tracés, coupe, cartes, exports — se revérifie encore à
  la main, et le tableau du §2 reste la mémoire des contrôles passés.
- **Sans cadre, une planche paysage remplit mal un kneeboard portrait** : environ 40 %
  de la page utilisée. Les textes restent lisibles, les symboles rapetissent. C'est à
  cela que sert ⬚ Cadre, depuis la v1.9.
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

## 8. Prochaines étapes

Elles sont tenues dans [PLAN.md](PLAN.md) (ouvert le 2026-09-30) : lots, ordre,
critères de fin et décisions. Les trois pistes notées ici jusque-là y figurent :

1. Conserver les images glissées d'une ouverture à l'autre → fait (v1.5, PLAN lot 4).
2. Alerte de franchissement du relief par la route liée → PLAN §8, en attente.
3. Debriefing sur trace réelle : poser ces symboles par-dessus la trajectoire
   effectivement volée (ACMI / Tacview) — le seul angle que ni e-Brief ni Excalidraw
   ne peuvent tenir, et FlightLedger possède déjà la donnée → PLAN §8, chantier à part.
