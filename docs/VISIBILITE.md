# Visibilité — FL Briefing Board

> Document vivant, ouvert le **2026-10-08** à la demande de Vince : « la mettre plus en
> avant, qu'elle ressorte des moteurs de recherche ».
> Il répond à une seule question : *comment un pilote DCS qui cherche un tableau de
> briefing trouve-t-il FL Briefing Board, le comprend-il en dix secondes, et l'ouvre-t-il ?*
> Les lots de code qui en découlent (14 à 17) sont dans [PLAN.md](PLAN.md).

## 1. Constat au 2026-10-08

Mesuré, pas supposé :

| Point | Constat |
|---|---|
| Moteurs de recherche | « FL Briefing Board » DCS ne renvoie aucun résultat qui concerne l'outil |
| Dépôt GitHub | 0 étoile, 0 release ; 21 vues, 11 visiteurs uniques sur 14 jours, un seul référent (github.com). GitHub **ne compte pas** les visites de la démo, seulement celles du dépôt, et les efface après 14 jours |
| Page de l'application | un titre seul : ni description, ni aperçu de partage (Open Graph), ni données structurées. Le contenu est un canevas : rien à lire pour un robot. Le texte du panneau ⓘ existe dans le HTML, mais masqué |
| Adresse | `ludens-kith.github.io/fl-briefing-board/`, un sous-chemin de GitHub. Un `robots.txt` n'est lu qu'à la racine de l'hôte (`ludens-kith.github.io/robots.txt`, qui répond 404) : celui d'un site projet est ignoré. Search Console n'y accepte qu'une propriété « préfixe d'URL » |
| Langue | interface **en français seulement** (`<html lang="fr">`, aucun mécanisme de langue). Le guide existe en français et en anglais US |
| Atouts déjà en place | les guides sont rendus en vraies pages HTML par GitHub Pages (`docs/GUIDE.html`, `docs/GUIDE.en-US.html`) ; aperçu social du dépôt posé (1280 × 640) ; sujets GitHub posés (`dcs-world`, `briefing`, `kneeboard`, `mission-planning`, `whiteboard`…) ; issues ouvertes ; lien Ko-Fi et Discord dans le panneau ⓘ |

Conclusion : l'outil n'est pas mal référencé, il **n'est pas référencé**. Le travail
commence à zéro, ce qui rend l'ordre des étapes plus important que leur nombre.

## 2. Positionnement

**Les concurrents sont des planificateurs.** CombatFlite, Mission Commander Toolbox,
MissionPlot, Digital Kneeboard Simulator, CombinedOps, FragOrder calculent routes,
carburant, emports, cartes de genou et DTC ; plusieurs travaillent à plusieurs en
ligne. Aucun de ceux recensés n'est **le tableau sur lequel on fait le briefing**.

| | Planificateurs | FL Briefing Board |
|---|---|---|
| Question | « qu'est-ce qu'on charge dans l'avion ? » | « qu'est-ce qu'on explique à la patrouille ? » |
| Force | calcul : carburant, temps, emports, cartes | pédagogie : formes aéro, phases animées, coupe liée à la route, vue radar du module, mode présentation |
| Sortie | kneeboard, DTC | kneeboard, PNG, DTC du F/A-18C, fichier de briefing |

**Règle de discours :** se présenter comme **complémentaire** du planificateur de
l'escadron, jamais contre lui. Ne pas se battre sur le carburant ou les emports.

**Phrase de présentation**

- EN : *The briefing whiteboard for DCS World squadrons. Drop aircraft and threat
  symbols on real theatre maps, link the altitude profile to your route, teach from a
  radar page, then export a kneeboard or your F/A-18C DTC. Free, in your browser,
  nothing to install.*
- FR : *Le tableau de briefing des escadrons DCS World. Posez avions et menaces sur
  les vraies cartes des théâtres, liez la coupe à la route, enseignez depuis l'écran
  radar, puis exportez le kneeboard ou la DTC du F/A-18C. Gratuit, dans le navigateur,
  rien à installer.*

**Mots-clés visés** : *DCS briefing board*, *DCS whiteboard*, *DCS mission briefing
tool*, *DCS kneeboard*, *DCS tactical board* ; *tableau de briefing DCS*.

## 3. L'ordre, et pourquoi

1. **L'adresse d'abord** (décision D1). Changer d'adresse après la promotion coûte
   doublement :
   - le référencement acquis ne suit qu'en partie la redirection ;
   - **les briefings gardés par chaque navigateur sont perdus de fait.** Le tableau
     garde son travail dans le stockage du navigateur (`localStorage`, IndexedDB), qui
     est lié à l'**origine** (le nom d'hôte). Dès qu'un domaine est posé, GitHub Pages
     redirige l'ancienne adresse vers la nouvelle : l'ancienne origine devient
     inatteignable, et son stockage avec. Moins il y a d'utilisateurs le jour de la
     bascule, moins elle coûte.
2. **Le référencement technique** (lot 14) : rendre chaque page lisible et partageable.
3. **Les pages de présentation** (lot 15) : ce qu'on partage et ce qui se classe.
4. **La diffusion francophone** : l'interface est déjà en français.
5. **L'interface anglaise** (lot 16), **puis** la diffusion internationale : envoyer
   le forum ED ou Reddit sur une interface en français gâcherait la première impression,
   qui ne se rejoue pas.
6. **La mesure** (lot 17) en parallèle, dès que D3 est tranchée.

## 4. Décisions à prendre par Vince

| | Question | Recommandation | Pourquoi |
|---|---|---|---|
| D1 | L'adresse | **`briefing.flightledger.io`**, posée **avant** toute promotion | le « FL » du nom renvoie à FlightLedger ; un domaine propre permet `robots.txt`, `sitemap.xml` et une propriété Search Console « domaine ». Alternatives : `briefing.l-k-studio.com`, ou rester sur github.io (rien à faire, mais référencement plafonné). Geste de Vince : un enregistrement DNS `CNAME` vers `ludens-kith.github.io` |
| D2 | L'ordre de diffusion | francophone d'abord, international **après** le lot 16 | voir §3, point 5 |
| D3 | La mesure des visites | **Search Console seule** le premier mois ; un compteur ensuite si le besoin se confirme | gratuit, sans cookie, sans bandeau. Un compteur (Plausible, Umami, Matomo configuré) relève de l'exemption de consentement de la CNIL **s'il est réglé pour** : à choisir et régler, pas à poser à la légère |
| D4 | Les publications | Vince publie ; Claude rédige | une publication engage LK Studio et ne se retire pas vraiment |

## 5. Lots de code (détail dans [PLAN.md](PLAN.md))

| Lot | Contenu | Taille | Dépend de |
|---|---|---|---|
| 14 | Référencement technique : description, aperçu de partage, données structurées, texte lisible, configuration des guides, plan du site | S | D1 conseillée |
| 15 | Pages de présentation FR et EN, liées entre elles, qui ouvrent le tableau | M | lot 14 |
| 16 | Interface en anglais, choisie selon la langue du navigateur et réglable | M-L | — |
| 17 | Mesure : relevé hebdomadaire Search Console et trafic GitHub ; compteur si D3 le décide | S | D1, D3 |
| — | Bascule d'adresse : fichier `CNAME`, bandeau « exportez vos briefings » quelques jours avant, liens du dépôt et des guides mis à jour | S | D1 |

## 6. Gestes hors code, à faire par Vince

| Geste | Quand | Ce que Claude prépare |
|---|---|---|
| Enregistrement DNS du domaine choisi | D1 tranchée | la valeur exacte à saisir, puis la vérification HTTPS |
| Déclarer le site dans **Google Search Console** (et Bing Webmaster Tools, qui reprend la propriété Google) | après la bascule | le fichier ou l'enregistrement de vérification, le plan du site à soumettre |
| Publier une **release GitHub** à chaque version | dès maintenant | les notes, tirées du CHANGELOG (une release apparaît dans les fils GitHub ; aucune n'existe) |
| Enregistrer une **vidéo de 60 à 90 s** | après le lot 15 | le scénario plan par plan : import d'une mission, ravitailleur sur son hippodrome, coupe, vue radar, export DTC |
| Publier les annonces | §7 | les textes FR et EN, adaptés à chaque lieu |

## 7. Diffusion

**Kit** : la phrase de présentation (§2) ; l'aperçu 1280 × 640
(`assets/readme/apercu-social.png`) ; le visuel d'annonce 1080 × 1350 de Vince, pour
Discord et les réseaux ; une capture de la démo ; la vidéo ; le lien de la démo
(`?demo`), qui n'écrit rien chez le visiteur.

| Vague | Où | Quand |
|---|---|---|
| 1 — francophone | Discord des escadrons et partenaires francophones (Team FR, Jaskier…), forum **Check-Six** | après les lots 14 et 15 |
| 2 — internationale | forum ED, section [Utility/Program Mods for DCS World](https://forum.dcs.world/forum/184-utilityprogram-mods-for-dcs-world/), et une réponse dans le fil [Current mission planning tools](https://forum.dcs.world/topic/374602-current-mission-planning-tools/) ; r/hoggit et r/DCSWorld ; Discord Hoggit ; la vidéo sur YouTube | après le lot 16 |

**Règles** :

- lire les règles de chaque lieu avant d'y publier (auto-promotion, balises, jour
  autorisé) ; elles n'ont pas pu être toutes vérifiées ici ;
- une annonce par lieu, pas de copier-coller d'un lieu à l'autre ; répondre aux
  commentaires dans les 48 heures : un auteur présent compte plus que l'annonce ;
- chaque retour devient une issue GitHub ou une ligne du PLAN, et la réponse le dit.

## 8. Garde-fous

- **Marques** : « DCS World » et les noms de modules et de cartes sont des marques
  d'Eagle Dynamics, citées pour désigner l'usage. Jamais de logo ED, jamais
  « officiel » ; la mention de non-affiliation figure sur les pages de présentation
  ([MARQUES-ET-CREDITS.md](../MARQUES-ET-CREDITS.md)).
- **Aérodromes** : la couche des aérodromes n'est pas publiée (source sans licence).
  Captures et vidéo se font **sur la version publique**, jamais sur un poste où
  elle a été régénérée.
- **FlightLedger** : un lien depuis flightledger.io se fait par une PR de
  FlightLedger, hors gel de production.
- **Promettre ce qui est vérifié** : [ETAT.md](ETAT.md) dit « jamais employé en
  conditions réelles ». Les annonces décrivent ce qui marche, avec la démo comme preuve,
  et invitent aux retours.

## 9. Mesure de réussite

Points de départ (2026-10-08) : aucun résultat de recherche, 0 étoile, 11 visiteurs
uniques du dépôt en 14 jours.

| Indicateur | Source | Relevé |
|---|---|---|
| Impressions, clics, requêtes, position sur les mots-clés du §2 | Search Console | hebdomadaire |
| Vues, visiteurs, référents du dépôt | trafic GitHub (perdu après 14 jours : à relever) | hebdomadaire |
| Étoiles, issues ouvertes par des tiers | GitHub | hebdomadaire |
| Visites de l'application | compteur, si D3 le décide | hebdomadaire |

Pas d'objectif chiffré avant un mois de données : on fixera alors des cibles à partir
de la base mesurée, pas d'un chiffre inventé aujourd'hui.

## 10. Journal

| Date | Événement |
|---|---|
| 2026-10-08 | Ouverture : constat, positionnement, ordre, décisions D1 à D4 proposées |
| 2026-10-08 | « GO » de Vince : D1 à D4 retenues comme recommandées. Lots 14 et 15 livrés (v1.14), fusion à valider. D1 attend l'enregistrement DNS de Vince : le DNS de `flightledger.io` est chez Infomaniak |
| 2026-10-08 | Vince pose le CNAME `briefing` → `ludens-kith.github.io.` et vérifie `flightledger.io` pour GitHub Pages (TXT `_github-pages-challenge-ludens-kith`, à garder). v1.14 en ligne, pages servies vérifiées (160/160) |

Sources consultées pour la concurrence : fil
[Current mission planning tools](https://forum.dcs.world/topic/374602-current-mission-planning-tools/),
[Digital Kneeboard Simulator](https://forum.dcs.world/topic/377954-digital-kneeboard-simulator-dcs-mission-card-creator),
[Mission Commander Toolbox](https://forum.dcs.world/topic/383231-operation-flight-planning-introducing-mct/).
