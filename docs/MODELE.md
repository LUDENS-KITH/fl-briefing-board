# Modèle d'état — FL Briefing Board

> Contrat interne du moteur, à jour au **2026-09-18** (v1.0).
> À lire avant toute évolution de `board.js` ou `symbols.js`.
> L'état d'avancement du projet est dans [ETAT.md](ETAT.md).

## 1. Vue d'ensemble

Le tableau tient dans trois choses, et rien d'autre :

```
boards[]        les planches (phases) ; une seule est « montée » à la fois
objs[]          la scène de la planche montée : objets ordonnés, du fond vers le dessus
état d'entrée   outil, forme, couleur, épaisseur, style de trait, sélection, geste en cours
past[] future[] l'historique de la planche montée, en instantanés complets
```

Une planche est `{ name, objs, wpN, nmPx, past, future }`. `load(i)` la monte dans
les variables globales, `stash()` les y recopie. Tout le reste du moteur ne connaît
que la planche montée : ajouter les planches n'a changé aucune fonction de dessin ni
de geste.

### Deux vues, un seul moteur

Chaque objet porte sa vue : `v` absent = vue de dessus, `v: 'p'` = coupe. Il n'y a
qu'une liste `objs`, un historique, une sélection. `draw()` dessine le plan découpé à
`planH()`, puis la coupe translatée de `profTop()` ; `locate()` convertit un point
d'écran dans le repère de la vue touchée et fixe `view` ; `topmost()` ne regarde que
les objets de `view`. Tout le reste — poser, déplacer, étiqueter, coter, annuler —
fonctionne dans la coupe sans une ligne de plus.

Le repère de la coupe est **fixe** : hauteur `PROF_H` = 300 px, altitude 0 à
`groundY()`, plafond à `PROF_TOP`, distance 0 à `PROF_L`, `profNmPx()` pixels par NM
calculés sur une largeur de référence de 1 000 px. `altAt(y)` et `yAt(ft)` font la
conversion. Changer plafond ou largeur passe par `reprof()`, qui **recale** chaque
objet de la coupe : ses altitudes et distances restent vraies.

### Carte vivante

Sans carte, `cam = null` et le plan garde son repère écran. Avec une carte, les objets
du plan sont en **pixels Mercator au zoom de référence 12** (`REF_Z`), et la caméra
`{ x, y, z }` dit quel point du terrain est au centre et à quel zoom. `w2s()` et
`s2w()` passent d'un repère à l'autre ; `toScreen(o)` fait une **copie écran** d'un
objet pour le dessiner et le désigner, en gardant l'original dans `__src`.

Règles qui en découlent :

- on **désigne à l'écran** (`topmost` convertit le pointeur et l'objet) : les
  tolérances en pixels restent des pixels écran à tout zoom ;
- on **mesure sur le terrain** : `rulerText` et `measText` lisent `__src`, et
  `nmAt(y)` donne les pixels par NM à la latitude du tracé (Mercator étire vers les
  pôles) ;
- symboles, textes et épaisseurs ne sont **pas** mis à l'échelle ; les positions et
  les géométries (zones, flèches, images) le sont ;
- `convertPlan()` bascule le plan d'un repère à l'autre sans rien déplacer à l'écran ;
- l'historique garde carte et caméra, mais `restore()` ne rend la caméra que si la
  carte change : annuler un déplacement de symbole ne fait pas sauter la vue ;
- l'export kneeboard impose une vue (`vp`) et une caméra le temps de dessiner, après
  avoir chargé les tuiles (`preloadTiles`).

### Caps vrais et magnétiques

`bearing()` rend un cap suffixé : `V` (vrai, sur une carte), `M` (magnétique), rien sur
une planche sans carte (le haut de l'écran n'est pas un nord). En mode magnétique,
`declAt(x, y)` donne la déclinaison au point mesuré : la **saisie de la planche**
(`magDec`) si elle existe, sinon **WMM2025** (`wmmDeclination`, `magnetic.js`) sur une
carte, sinon `null` — et le cap reste alors au cap écran plutôt que d'être inventé.
Cap magnétique = cap vrai − déclinaison Est.

### Vitrine LK Studio et démo

`APP` porte la version et les adresses (studio, FlightLedger, dépôt une fois publié) ;
`SIGNATURE` est apposée sur chaque PNG (`signed()`) et en pied de kneeboard. `DEMO` est
vrai quand l'adresse contient `?demo` : `boot()` monte `demoBoards()` et `commit()`
n'écrit **jamais** dans le stockage — une démo ne doit pas écraser le tableau du visiteur.

### Route liée

La route n'est **pas stockée** dans la coupe. `computeRoute()` la reconstruit à chaque
`draw()` depuis les waypoints du plan triés par numéro : distance cumulée
(`Σ longueur / nmPx`), altitude (`w.alt`, sinon celle du précédent, sinon 10 000 ft).
Elle remplit aussi `routeAlt`, où le plan lit l'altitude à afficher sous chaque
waypoint. La seule donnée ajoutée est `alt` sur un waypoint ; le geste `drag.m = 'alt'`
et l'édition `{ t:'wpalt' }` sont les deux seules façons de l'écrire.

Le canvas ne mémorise rien : **il est entièrement redessiné** à chaque `draw()` à
partir de `objs`. Aucun pixel n'est une source de vérité. C'est ce qui rend
l'annulation, le changement de thème et l'export PNG triviaux.

## 2. La scène — `objs[]`

Douze types d'objets. Champs communs à tous : `t` (type), `c` (couleur CSS),
`w` (épaisseur de trait en pixels). Les objets tracés portent aussi `ls` : `solid`,
`dash` ou `dot`.

| `t` | Champs propres | Sens |
|---|---|---|
| `sym` | `k`, `x`, `y`, `a`, `s`, `n`, `lbl`, `alt` (waypoint) | forme de la palette : clé, position, **angle en radians**, **échelle**, numéro (waypoints), étiquette attachée |
| `arrow` | `x1,y1`, `x2,y2`, `cx,cy`, `bent`, `both`, `meas` | flèche : extrémités, point de contrôle quadratique, courbure assumée, double pointe, cote affichée |
| `line` | identiques à `arrow` | trait, même géométrie sans pointe |
| `rect` | `x1,y1`, `x2,y2` | coins opposés |
| `circle` | `x1,y1`, `x2,y2` | **centre** puis un point du rayon |
| `stroke` | `pts[[x,y]…]` | tracé libre au crayon |
| `zone` | `pts[[x,y]…]`, `lbl` | polygone hachuré fermé ; étiquette en haut |
| `ruler` | `x1,y1`, `x2,y2` | mesure : distance (px ou NM selon `nmPx`) et cap ; dans la coupe, distance au sol et écart d'altitude |
| `terrain` | `pts[[x,y]…]` | coupe : crête du relief, remplie jusqu'au sol |
| `dome` | `x1` (site), `x2` (rayon), `y2` (plafond), `lbl` | coupe : enveloppe sol-air, demi-ellipse posée au sol |
| `block` | `y1`, `y2`, `lbl` | coupe : tranche d'altitude pleine largeur |
| `text` | `s`, `x`, `y` | **`s` est la chaîne**, `x,y` son ancre (ligne de base médiane) |
| `img` | `el`, `x`, `y`, `w2`, `h2`, `w0`, `h0` | image de fond : élément DOM, coin haut-gauche, taille courante, taille d'origine |

**L'ordre du tableau est l'ordre de rendu.** Une image ajoutée entre par `unshift`
(donc au fond) ; le bouton « premier plan » déplace un objet en fin de liste.

### Géométrie d'un symbole

Un `sym` ne stocke aucune forme : seulement une **clé** vers `SHAPES`. La forme est
dessinée dans un repère normalisé `[-1, 1]`, **nez vers `-y`**, puis :

```
translate(x, y) → rotate(a) → scale(SIZE × s)
```

`SIZE = 34` est la demi-taille de référence. `a = 0` pointe au nord. L'épaisseur de
trait est divisée par l'échelle, donc elle **reste constante** quelle que soit la
taille du symbole.

### Géométrie d'une flèche

Toujours une courbe quadratique : `x1,y1` → contrôle `cx,cy` → `x2,y2`. Une flèche
droite n'est pas un cas particulier, c'est une courbe dont le contrôle est au milieu.
Tant que `bent` est faux, déplacer une extrémité **recentre** le contrôle ; dès que
l'utilisateur a tiré la poignée centrale, `bent` passe à vrai et le contrôle ne bouge
plus tout seul. La pointe s'oriente sur la tangente `(x2−cx, y2−cy)`, jamais sur la
corde — sinon elle pointerait de travers sur une courbe prononcée.

## 3. L'état d'entrée

| Variable | Valeurs | Rôle |
|---|---|---|
| `tool` | `sym` `select` `pen` `arrow` `line` `rect` `circle` `zone` `ruler` `text` `erase` | outil courant |
| `ls` | `solid` `dash` `dot` | style de trait des prochains objets — et de la sélection |
| `nmPx` | nombre, 0 = non étalonné | pixels par mille nautique de la planche montée ; fait partie de l'historique |
| `tb` | 1, ou plus pendant l'export | grossissement des textes |
| `unit` | `nm` `km` | unité d'affichage des distances ; préférence globale, persistée |
| `measOn` | booléen | les prochains traits et flèches naissent cotés |
| `cam` | `{ x, y, z }` ou `null` | caméra de la carte de la planche montée ; `null` = sans carte |
| `mapCfg` | `{ theatre, style }` ou `null` | théâtre et fond de la planche montée |
| `showAF` | booléen | aérodromes DCS affichés ; persisté |
| `headRef` | `true` `mag` | référence des caps affichés ; persistée |
| `magDec` | nombre ou `null` | déclinaison saisie pour la planche (° Est positif) ; dans l'historique |
| `split` | booléen | écran partagé plan / coupe ; persisté |
| `prof` | `{ ceil, range, linked }` | plafond (ft), largeur (NM) et route liée de la planche montée ; dans l'historique |
| `view` | `m` `p` | vue du geste en cours, fixée au `pointerdown` et gardée jusqu'au relâché |
| `symKey` | clé de `SHAPES` | forme que posera l'outil `sym` |
| `color`, `width` | couleur FL, 2 / 4 / 8 | valeurs des **prochains** objets — et repeignent la sélection si elle existe |
| `dark` | booléen | fond du tableau ; n'affecte aucun objet |
| `wpN` | entier | prochain numéro de waypoint ; fait partie de l'historique |
| `sel` | objet ou `null` | sélection courante (un seul objet) |
| `draft` | objet ou `null` | objet en cours de tracé, pas encore dans `objs` |
| `drag` | `{m, o, …}` ou `null` | geste en cours sur un objet existant |

### Distances et caps

Une seule source : `nmPx`, pixels par mille nautique de la planche. `distText()`
convertit (1 NM = 1,852 km) et répond en **pixels** tant que la planche n'est pas
étalonnée — jamais un chiffre inventé. `bearing()` donne le cap écran, nord en haut,
de 001° à 360°. Une cote de flèche mesure la **longueur de la courbe**
(`curveLength()`, 32 segments), la règle la distance droite ; toutes deux donnent le
cap du départ vers l'arrivée.

## 4. La machine d'interaction

`pointerdown` applique **un ordre de priorité strict**. Le premier cas qui accepte
consomme l'événement :

```
1. une poignée de la sélection est sous le doigt   → drag (voir table ci-dessous)
   — sauf pendant le tracé d'une zone
2. outil zone                                      → ajoute un sommet / referme
3. outil gomme                                     → supprime l'objet touché, hors image de fond
4. outil sélection                                 → désigne et commence un déplacement
5. outil symbole, sur une forme ou un texte        → saisit et déplace (grab)
6. outil symbole, dans le vide                     → pose la forme, puis drag 'place'
7. outil texte, sur forme / zone / texte           → édite l'étiquette ou le texte (named)
8. outil texte, dans le vide                       → ouvre le champ flottant
9. autres outils (dont règle)                      → commence un draft

Le double-clic, quel que soit l'outil, referme la zone en cours ou ouvre l'édition de
l'étiquette de ce qu'on touche.
```

Les poignées passent avant tout : sans cela, on ne pourrait plus courber une flèche
qui recouvre un autre objet.

`grab()` ne retient que les `sym` et les `text` : flèches, traits et carte de fond
restent traversables, pour qu'on puisse poser un symbole sur une flèche ou sur la
carte. Une forme posée est **lâchée** en fin de geste (`sel = null`) : sinon la
couleur choisie pour la forme suivante la repeindrait.

L'instantané d'historique d'un `drag` est pris **au premier mouvement**, pas au
toucher : sélectionner sans bouger ne laisse aucune entrée vide.

### Modes de `drag`

| `m` | Déclenché par | Effet |
|---|---|---|
| `place` | pose d'un symbole, doigt maintenu | oriente et dimensionne dans le même geste ; en deçà de 14 px, garde les valeurs par défaut |
| `rot` | poignée d'un symbole | même calcul que `place` |
| `move` | outil sélection, ou outil symbole sur une forme existante | translation ; `stroke` translate tous ses points |
| `p1` / `p2` | poignées d'extrémité | déplace une extrémité ; recentre le contrôle si la flèche n'est pas courbée |
| `ctl` | poignée centrale | courbe la flèche et pose `bent` |
| `size` | poignée d'une image | échelle homothétique à partir de `w0`, `h0` ; `nmPx` suit le même rapport |
| `v0`, `v1`… | sommets d'une zone | déplace ce sommet |

Une **zone** ne se crée pas par glissé : chaque `pointerdown` ajoute un sommet au
`draft`, le relâché ne termine rien. Elle se referme sur son premier point, par
double-clic ou `Entrée` ; `Échap` l'abandonne. Elle est insérée **juste au-dessus des
images**, donc sous les symboles qui la justifient.

### Désignation

`hit()` décide si un point touche un objet :

- `sym` : disque de rayon `SIZE × s × (SHAPES[k].hit ?? 1.15)` — le rayon appartient
  à la forme, pour qu'un bombardier s'attrape par l'aile et un SAM par son anneau ;
- `arrow` / `line` : **échantillonnage de la courbe** en 21 points, tolérance 12 px ;
- `rect` : couronne de 12 px autour du contour (l'intérieur ne prend pas) ;
- `circle` : proximité du cercle lui-même, pas du disque ;
- `stroke` : distance aux **segments**, tolérance 13 px — pas aux seuls points
  enregistrés : un geste rapide n'en produit que quelques-uns et le milieu du trait
  doit rester attrapable ;
- `text`, `img` : boîte englobante.

`pick()` parcourt `objs` **de la fin vers le début** : ce qui est au-dessus se
désigne en premier.

## 5. Pièges à connaître

1. **`s` a deux sens.** Échelle sur un `sym`, chaîne de caractères sur un `text`.
   Aucun code générique ne les confond aujourd'hui, mais toute fonction qui
   traiterait « n'importe quel objet » doit tester `t` d'abord.
2. **`w` n'est pas une taille.** Sur un symbole, `w` reste l'épaisseur du trait ;
   la taille est `s`. Les deux se règlent séparément dans la barre.
3. **Un geste avorté ne doit pas laisser d'entrée d'historique.** `snapshot()` est
   appelé *avant* la mutation ; si le tracé se révèle trop court, `endPointer()`
   retire l'instantané par `past.pop()`.
4. **`restore()` annule la sélection.** Un objet sélectionné puis restauré par
   annulation n'est plus le même objet en mémoire : garder une référence à travers
   une annulation est faux.
5. **La gomme ignore les `img`.** Sinon un clic dans une zone vide efface la carte de
   fond. Une image se retire par sélection puis `Suppr`.
6. **`ctx` est réassigné pendant l'export kneeboard** vers un canvas hors écran, et
   `tb` (grossissement des textes) y passe au-dessus de 1. Toute fonction de dessin
   doit lire `ctx` et `tb` au moment de l'appel, jamais les capturer. Le `finally`
   de `kneeboardCanvas()` les remet en place.
7. **Dans la coupe, une silhouette de profil pointe à droite pour `a = 0`**, alors
   qu'une vue de dessus pointe vers le haut. `paintSym`, les poignées et le geste de
   pose tiennent compte des deux conventions ; une silhouette qui vole vers la
   gauche est retournée (`scale(1, -1)`), jamais tournée de 180°.
8. **Une altitude est une position écran.** Tout ce qui change le repère de la coupe
   doit passer par `reprof()` ; modifier `prof` directement fausserait silencieusement
   toutes les altitudes affichées.
9. **Un objet du plan n'est pas en pixels écran quand une carte est chargée.** Toute
   nouvelle fonction qui mesure, désigne ou place doit passer par `toScreen`, `w2s`,
   `s2w` ou `nmAt` — jamais comparer une coordonnée d'objet à celle du pointeur brut.

## 6. Historique

`past` et `future` contiennent des **instantanés complets** : `{ objs, wpN, nmPx }`, où
`objs` est copié objet par objet (`pts` dupliqué en profondeur, `el` partagé par
référence — une image n'est jamais dupliquée). Plafond : 100 entrées.

Ce choix coûte de la mémoire et évite une classe entière de bugs : annuler un
effacement restitue ce qui a été effacé, ce qu'une pile de deltas rendait faux
en v0.1 (voir [ETAT.md](ETAT.md) §6).

## 7. Persistance

| | |
|---|---|
| Clé | `fl-briefing-board-v3` |
| Contenu | `{ cur, unit, split, showAF, headRef, boards: [{ name, wpN, nmPx, prof, map, cam, magDec, objs }] }`, **images exclues** (non sérialisables) ; l'historique n'est pas conservé |
| Écriture | à chaque `commit()` |
| Échec | capturé et ignoré — le tableau reste utilisable, il ne se souvient pas |

La clé porte la version du format. `v1` (jusqu'au 2026-09-17) ignorait `a`, `s`,
`cx`, `cy` : elle n'est **pas** relue, un ancien tableau est simplement oublié plutôt
que rechargé de travers. `v2` (v0.2 à v0.4) est relue **une fois**, si `v3` est
absente, et devient la planche « Phase 1 ».

## 8. Ajouter une forme

Une entrée dans `SHAPES` suffit — la vignette, le groupe et l'outil suivent tout
seuls :

```js
maClé: { g:'air', label:'Mon aéronef', s0:1.1, tile:.38, hit:1.25, draw(c){
  sil(c, [[0,-1], …, [0,.9]]);   // moitié droite, du nez à la queue, axe compris
  body(c);                        // remplissage léger + contour
}},
```

| Champ | Rôle | Défaut |
|---|---|---|
| `g` | groupe : `air`, `sol`, `tac` | requis |
| `label` | nom sous la vignette | requis |
| `draw(c)` | tracé dans le repère `[-1, 1]` | requis |
| `s0` | échelle à la pose | `1` |
| `tile` | échelle dans la vignette | `.45` |
| `hit` | rayon de préhension | `1.15` |
| `num` | affiche un numéro au centre (waypoints) | absent |
| `tag` | étiquette fixe sous la forme | absent |

Aides disponibles : `sil()` (silhouette symétrique décrite d'un seul côté),
`body()` (remplissage léger + contour), `pods()` (nacelles symétriques).
