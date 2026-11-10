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

## Sans code, dans les deux bibliothèques

- **Aéroport** : la carte DCS dessine les aérodromes elle-même, sans icône du thème OTAN.
- **Armement et effets** (missile, bombe, explosion, abattu, éjection, leurres) : la
  norme a un code pour le missile de croisière (0040), pas pour ces gestes de briefing.
- **Marqueurs tactiques** (ami, hostile, inconnu, waypoint, objectif, orbite, bullseye,
  IP) : ce sont des repères du briefing, pas des unités.
- **Écrans de bord** : leur symbologie est celle du module ([RADAR.md](RADAR.md)).
- **Vue de profil (coupe)** : la norme ne dessine que la vue de dessus ; la coupe garde
  les silhouettes.

## Laissé de côté

- **Les icônes DCS propres au jeu sans équivalent utile au briefing** : blindage
  (0075), bâtiment (0076), train (0108), ballon de barrage (0109), points de navigation
  et d'objectif (0041 à 0044, 0201 à 0225, 1206, 1207), cargaison et charge élinguée
  (0351, 0352).
- **Les variantes de SAM que DCS distingue par le châssis et le radar** (0078 à 0089) :
  le lot 21 (import) dira s'il faut les distinguer ; ici, la portée suffit.
- **Les icônes voisines d'une famille déjà au tableau** : véhicule de reconnaissance
  (0003, proche du véhicule de combat), SAM canon-missile (0014, proche du SAM courte
  portée), postes de guidage et de contrôle, contrôleur aérien avancé (0045, 0046, 0047,
  0050, proches du poste de commandement), seconde icône du SAM moyenne portée (0054). Le
  lot 21 (import) dira lesquelles méritent une forme à part.
- **L'infanterie** : le plan la prévoyait, mais `classifier.lua` ne déclare aucune icône
  d'infanterie ; elle attend le lot 21, qui lira l'icône que DCS donne aux fantassins.
- **Le thème russe** : lot 20.
