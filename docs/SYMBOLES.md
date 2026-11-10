# Symboles OTAN — sources

> Document vivant, ouvert le **2026-11-10** avec la **v1.19** (lot 19, [PLAN.md](PLAN.md)).
> Chaque symbole de la bibliothèque OTAN cite ici son code et l'icône de DCS qu'il
> reproduit. Un symbole sans ligne dans ce tableau n'entre pas dans la bibliothèque :
> `node tools/test_symboles.js` le vérifie.

## D'où viennent les dessins

- **DCS** dessine les unités de la carte F10 et de l'éditeur de mission en symboles
  normalisés, thème « OTAN » : `MissionEditor/data/NewMap/images/nato/` dans
  l'installation du jeu. Chaque type d'unité désigne son icône par une clé
  `mapclasskey`, déclarée avec son libellé dans `MissionEditor/data/NewMap/classifier.lua`
  (libellés en russe, traduits ci-dessous). Relevé sur l'installation du 2026-11-10.
- **Ces images ne sont pas dans le dépôt** : elles appartiennent à Eagle Dynamics. Elles
  ont servi de référence visuelle, comme les figures des manuels pour le kit radar
  ([RADAR.md](RADAR.md)).
- **Le tableau fait dessiner la norme** (MIL-STD-2525C, ou 2525D pour un code à 20
  chiffres) par [milsymbol](https://github.com/spatialillusions/milsymbol) 3.0.4, licence
  MIT, copié dans `vendor/` (empreinte SHA-256 de `milsymbol.js` identique à celle publiée
  par jsDelivr pour la 3.0.4).

## Le rendu de DCS, et celui du tableau

| DCS | Le tableau | Source |
|---|---|---|
| Une icône par clé, **la même pour les deux camps** : le cadre d'un hostile n'est pas un losange | le cadre « ami » de la norme pour tous, quel que soit le camp | un seul fichier par clé dans `nato/` ; seules les icônes de `common/` propres au mode RTS ont une variante bleue et rouge |
| Icône tracée en noir sur un fond blanc opaque, que le jeu teint à la couleur de la coalition | fond à la couleur de l'objet, cadre et signe noirs | pixels des fichiers `nato/` : blanc opaque, noir, transparent autour |
| Certaines icônes sont déclarées tournantes (`rotatable = true`) | le symbole reste droit ; la **flèche de direction** de la norme dit le cap posé, et seulement s'il a été posé (un symbole posé d'un clic n'en a pas) | `classifier.lua` ; la façon dont la carte F10 tourne ces icônes n'a pas été vue à l'écran |
| — | sur fond sombre, un liseré clair autour du symbole : le trait noir s'y perdrait | choix du tableau (la carte DCS est claire) |

## Formes du tableau

| Forme (`k`) | Code (SIDC) | Icône DCS (clé · libellé) | Écart à l'icône DCS |
|---|---|---|---|
| `fighter` | `SFAPMFF--------` | 0024 · chasseur | — |
| `bomber` | `SFAPMFB--------` | 0027 · bombardier | — |
| `tanker` | `SFAPMFK--------` | 0064 · ravitailleur | — |
| `airliner` | `SFAPC----------` | `Aircraft_civilian` · avion civil | « CIV » plus petit |
| `helo` | `SFAPMHU--------` | 0020 · hélicoptère | — |
| `awacs` | `SFAPMFRW-------` | 0056 · avion de guet aérien | — |
| `drone` | `SFAPMFQ--------` | 0023 · drone | — |
| `tank` | `SFGPUCA--------` | 0001 · char | — |
| `radar` | `10031000001301005000` | 0036 · station radar | le signe radar est plus petit et en haut du cadre |
| `sam` | `SFGPUCDM-------` | 0009 · SAM, usage général | cercle d'engagement du tableau gardé |
| `ship` | `SFSPCLDD-------` | 0068 · grand bâtiment (« DD ») | DCS a aussi une icône « bâtiment de surface » (0037), en cadre terrestre : le tableau prend celle du bâtiment de guerre |
| `carrier` | `SFSPCLCV-------` | 0065 · porte-avions | — |
| `farp` | — (dessin du projet) | 0022 · FARP, dans `common/` : cercle et T, hors norme | dessiné par le projet d'après l'icône |

## Familles de la carte DCS, nouvelles dans le tableau

Dans la palette en OTAN seulement. Posées puis vues en silhouettes, elles prennent le
dessin de la forme la plus proche et un repère écrit dessous.

| Forme (`k`) | Code (SIDC) | Icône DCS (clé · libellé) | En silhouettes | Écart à l'icône DCS |
|---|---|---|---|---|
| `attack` | `SFAPMFA--------` | 0025 · avion d'attaque | chasseur, « A » | — |
| `cargo` | `SFAPMFC--------` | 0029 · avion de transport | civil, « C » | — |
| `recon` | `SFAPMFR--------` | 0026 · avion de reconnaissance | chasseur, « R » | — |
| `attack_helo` | `SFAPMHA--------` | 0021 · hélicoptère de combat | hélicoptère, « A » | — |
| `ifv` | `SFGPUCIZ-------` | 0002 · véhicule de combat (aussi 0004, transport de troupes blindé) | char, « VCI » | — |
| `artillery` | `SFGPUCFHE------` | 0006 · artillerie automotrice | char, « ART » | — |
| `mlrs` | `SFGPUCFRMS-----` | 0007 · lance-roquettes multiple | char, « LRM » | — |
| `truck` | `10031000001634000000` | 0005 · automobile | char, « VÉH » | — |
| `aaa` | `SFGPUCDG-------` | 0015 · canons antiaériens (aussi 0016, automoteur antiaérien) | radar, « AAA » | — |
| `sam_short` | `SFGPUCDML------` | 0011 · SAM courte portée | SAM, « SAM-CP » | barres du missile un peu différentes ; cercle d'engagement du tableau |
| `sam_med` | `SFGPUCDMM------` | 0012 · SAM moyenne portée | SAM, « SAM-MP » | idem |
| `sam_long` | `SFGPUCDMH------` | 0013 · SAM longue portée | SAM, « SAM-LP » | idem |
| `cp` | `SFGPUH---------` | 0071 · poste de commandement | marqueur ami, « PC » | — |
| `ew` | `SFGPUUMSE------` | 0028 · moyen de guerre électronique | radar, « GE » | DCS ajoute un trait en zigzag au-dessus de « EW » |
| `sub` | `SFUPS----------` | 0038 · sous-marin | navire, « SM » | — |
| `infantry` | `SFGPUCI--------` | 0201 · « POINT 201 », sans titre dans `classifier.lua` : rectangle barré, que DCS donne aux fantassins et au personnel de pont (lot 21) | char, « INF » | — |
| `ground` | `SFGPU----------` | 0035 · « Friendly Ground Unit » de l'éditeur ; pour un type que l'installation de DCS ne décrit pas (lot 21) | char, « ? » | cadre nu de la norme, sans la languette de l'icône DCS ; DCS a une icône pour chaque type, le tableau ne la connaît pas pour les véhicules de base |

## Sans code, dans les deux bibliothèques

- **Aéroport** : la carte DCS dessine les aérodromes elle-même, sans icône du thème OTAN.
- **Armement et effets** (missile, bombe, explosion, abattu, éjection, leurres) : la
  norme a un code pour le missile de croisière (0040), pas pour ces gestes de briefing.
- **Marqueurs tactiques** (ami, hostile, inconnu, waypoint, objectif, orbite, bullseye,
  IP) : ce sont des repères du briefing, pas des unités.
- **Écrans de bord** : leur symbologie est celle du module ([RADAR.md](RADAR.md)).
- **Vue de profil (coupe)** : la norme ne dessine que la vue de dessus ; la coupe garde
  les silhouettes.

## Import : de l'icône DCS à la famille (lot 21)

Chaque type d'unité d'une mission importée prend la famille de l'icône que la carte F10 lui
donne. La table type → icône (`mapclass.js`) est relevée dans l'installation de DCS par
`tools/build_mapclass.py` ; l'icône → famille est décidée ici, d'après le titre de
`classifier.lua` et, pour les icônes « POINT 2xx » sans titre, d'après leur image et les
types qui les portent.

| Icônes DCS | Famille |
|---|---|
| 0001 | `tank` |
| 0002, 0003 (reconnaissance), 0004 (transport de troupes), 0203 et 0204 (antichar ; BRDM-2 Malyutka, VAB Mephisto) | `ifv` |
| 0005 (« Supply »), 0207 (« Fuel Supply »), 0212 (« Engineers » ; dans DCS, les camions et engins de servitude) | `truck` |
| 0006 | `artillery` |
| 0007, 0208 (lanceurs sol-sol : Scud, M142, TOS-1A) | `mlrs` |
| 0009, 0202, 0213 à 0217 (missile sol-air, sans portée) | `sam` |
| 0010, 0011, 0014, 0017, 0018, 0078, 0079, 0084 à 0088 (courte portée : ближнего действия, малой дальности) | `sam_short` |
| 0012, 0080 à 0082, 0089 (moyenne portée : средней дальности) | `sam_med` |
| 0013 | `sam_long` |
| 0015, 0016, 0205 | `aaa` |
| 0028 | `ew` |
| 0036, 0083 (radar mobile) | `radar` |
| 0045, 0046, 0047, 0050, 0071 | `cp` |
| 0201, `P910000065.png` (« Airborne Troops ») | `infantry` |
| 0035 (« Friendly Ground Unit ») | `ground` |
| 0037, 0039 (« Warship »), 0052 à 0054 (bâtiment d'assaut, destroyer, frégate), 0057, 0211 (navires marchand et civil), 0066 à 0070 | `ship` |
| 0038 | `sub` |
| 0051, 0065 | `carrier` |
| 0020, 0062 (anti-sous-marin), 0096 (reconnaissance) | `helo` |
| aéronefs : 0021 à 0027, 0029, 0056, 0064 | leurs familles du tableau (`attack_helo`, `drone`, `fighter`, `attack`, `recon`, `bomber`, `cargo`, `awacs`, `tanker`) |

**Sans famille** : bâtiment (0076), cargaison (0352), train (0108), avion de lutte
anti-sous-marine (0063), dépôt (0072) ; l'unité prend alors la famille de sa catégorie, et
une icône de dessin (lot 22) un repère « objectif » avec son nom.

Les noms entre guillemets sont ceux que l'éditeur donne aux icônes de dessin
(`images/draw/icons.lua`). Ils ont corrigé deux lectures du lot 19 : **0054 est une
frégate** (« FF » sur son image ; `classifier.lua` la titre SAM moyenne portée, mais la
carte montre l'image), et 0035 l'unité terrestre amie générique.

**Hors de la table** : les véhicules et navires de base de DCS (T-72B, M-2 Bradley, BTR-80…)
ne déclarent leur icône dans aucun fichier lisible ; leur base, `Scripts/Database.edce`, est
chiffrée, et le projet ne la déchiffre pas. Une unité de ces types prend, dans l'ordre : la
famille que dit son nom quand il nomme le système (défenses aériennes, canons
antiaériens, `Soldier`/`Infantry`/`Paratrooper`), comme depuis le lot 6 ; sinon `ground`
(cadre nu) ou `ship`, et le bilan de l'import la compte.

## Laissé de côté

- **Les icônes DCS propres au jeu sans équivalent utile au briefing** : blindage
  (0075), bâtiment (0076), train (0108), ballon de barrage (0109), points de navigation
  et d'objectif (0041 à 0044, 0206 à 0225 hors celles que l'import range, 1206, 1207), cargaison et charge élinguée
  (0351, 0352).
- **Les variantes de SAM que DCS distingue par le châssis et le radar** (0078 à 0089) :
  le lot 21 les range à leur portée (table ci-dessus), sans forme à part.
- **Les icônes voisines d'une famille déjà au tableau** : véhicule de reconnaissance
  (0003, proche du véhicule de combat), SAM canon-missile (0014, proche du SAM courte
  portée), postes de guidage et de contrôle, contrôleur aérien avancé (0045, 0046, 0047,
  0050, proches du poste de commandement). Le lot 21 les range à la famille voisine, sans
  forme à part. (Le lot 19 comptait ici 0054 comme seconde icône du SAM moyenne portée :
  c'est une frégate, voir plus haut.)
- **L'infanterie** : `classifier.lua` ne lui donne aucun titre, mais le lot 21 a lu
  l'icône que DCS donne aux fantassins : 0201, « POINT 201 », un rectangle barré — la
  famille `infantry` ci-dessus.
- **Le thème russe** : lot 20.
