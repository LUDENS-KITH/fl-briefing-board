# Écrans de bord — sources

> Document vivant, ouvert le **2026-09-30** avec la **v1.3** : F/A-18C et F-16C ; repris le
> **2026-11-10** avec la **v1.20** (lot 23) : écrans remis au plus près des figures ; la
> **v1.23** (lot 24) y ajoute l'A-10C II, et il devient la table des sources de **tous les
> écrans de bord**, radar ou non. Chaque élément du kit cite ici sa source. Un symbole ou un libellé sans source
> n'entre pas dans le kit ([PLAN.md](PLAN.md) §5.3).

**Règle depuis le lot 23** : un élément **visible sur une figure** du manuel entre, avec
la figure pour source, même si le texte n'en donne pas la valeur ; sa place et son
espacement sont **mesurés sur la figure** (page du PDF rendue sur le poste, jamais dans le
dépôt). Ce qui change à chaque vol (cap, vitesse, altitude, arme, relèvements) est dessiné
**à sa place, avec le texte d'exemple de la figure** : l'étiquette d'un objet porte les
vraies valeurs. Dans la palette, les écrans ont leur onglet **Écrans de bord**, un bouton
par module.

**Le boîtier (lot 27)** : chaque appareil a le sien, relevé sur l'image d'origine de sa
figure — DDI du F/A-18C (figure 82 : coins du haut coupés, bouton NIGHT/DAY/OFF au-dessus
du rang du haut, molettes BRT et CONT), MFD du F-16C (p. 394 : boîtier carré, bascules
GAIN, SYM, BRT, CON aux coins), MFCD de l'A-10C II (figure 228). Un boîtier qui déborde le
carré de la forme est réduit et recentré (`BEZELS` dans `symbols.js`) ; le verre reste à
±0,79 dans le repère de l'écran.

**Comment les places sont mesurées** : la figure est rendue en grand, quadrillée, et ses
repères sont ramenés au repère du kit par les boutons du boîtier (pas de 0,26, boutons à
±0,935). Sur les deux appareils, le verre fait alors ±0,79 : le kit le dessinait à ±0,87.

Tout est **dessiné par le projet, en vecteurs**, d'après la documentation du module :
aucune capture du jeu, aucune image extraite d'un manuel. Les noms de modules et
d'appareils restent la propriété de leurs titulaires ([MARQUES-ET-CREDITS.md](../MARQUES-ET-CREDITS.md)).

## F/A-18C — page RDR ATTK air-air

Source unique : *DCS F/A-18C Early Access Guide* (Eagle Dynamics, anglais, édition du
2024-03-24). Les numéros de page du PDF sont ceux imprimés. Les « n° » renvoient aux
repères numérotés des figures.

### L'écran

| Élément | Dessin | Source |
|---|---|---|
| B-scope : distance vers le haut, azimut de gauche à droite, appareil en bas au centre | zone tactique carrée | p. 157 |
| B-sweep, position instantanée de l'antenne en azimut | trait vertical | p. 157 |
| Chevron d'élévation d'antenne | `<` au bord gauche | p. 157 |
| Échelle des distances, repères à ¼, ½ et ¾ | trois traits au bord droit | p. 157 |
| Échelle affichée : 5, 10, 20, 40, 80 ou 160 NM | nombre en haut à droite | p. 162 n° 8, p. 163 |
| Radar en émission | `OPR` en haut à gauche | p. 162 n° 1 |
| Écran qui a le TDC | losange pointé, en haut à droite | p. 162 n° 2, p. 168 |
| Ligne d'horizon et vecteur vitesse, reflets du HUD à position fixe | trait et symbole de vecteur vitesse | p. 163 n° 18-19 |
| 20 boutons autour de l'écran | carrés gris | p. 158 |
| Verre à ±0,79 du boîtier | mesuré | figure 82 |
| Bandeau sous le bord haut de la zone tactique | trait horizontal | figures 82, 83, p. 175 |
| Graduations d'azimut tous les 30°, en haut sous le bandeau et en bas | cinq traits | figure 82 (valeurs mesurées : 0°, ±30°, ±60° sur un champ de ±70°) |
| Échelle d'élévation au bord gauche : sept repères, longs aux bouts et au milieu, qui débordent du cadre | traits | figure 82 |
| Chevron à droite, à hauteur du chevron d'élévation | `>` | figures 83 (STT) et p. 175 (TWS) ; absent de la figure RWS |
| Bouts de la ligne d'horizon tournés vers le bas | deux traits | figure 82 |
| Champs de données, à leur place, texte d'exemple de la figure | `C11`, `345°/25.0`, cap `057°` (n° 6), arme `7M 0` (n° 7), `BRA 67°/21.9`, vitesse `451` et Mach `0.78` (n° 16), `300°/31.1`, `4216`, altitude `7080` (n° 13), `7` | figure 82, p. 163 ; TWS et STT : les champs que leurs figures montrent (p. 175 ; figure 83, dont `155°`) |

### Numérotation des boutons

PB1 à PB5 à gauche, de bas en haut ; PB6 à PB10 en haut, de gauche à droite ; PB11 à
PB15 à droite, de haut en bas ; PB16 à PB20 en bas, de droite à gauche. Elle est établie
par recoupement :

| Recoupement | Source |
|---|---|
| RWS / TWS au bouton 5, en haut à gauche | p. 172 ; figure 82 n° 20 |
| RAID au bouton 9, quatrième en haut | p. 176 ; figure p. 176 |
| MSI au bouton 14 de la sous-page DATA, quatrième à droite | p. 179 ; figure 87 |
| NCTR au bouton 15, en bas à droite | p. 165 ; figure 82 n° 22 |
| EXP au bouton 20, en bas à gauche | p. 183 (page AZ/EL, même écran) ; figure p. 175 (TWS) |

### Libellés des boutons, page par page

| Page | Libellés | Source |
|---|---|---|
| RWS | PB1 `HI INTL` (PRF) · PB2 `RDR PRI` · PB5 `RWS` · PB6 `4B 1` (barres) · PB7 `SIL` · PB8 `ERASE` · PB11 `↑` · PB12 `↓` · PB13 `SET` · PB14 `RSET` · PB15 `NCTR` · PB16 `DATA` · PB17 `CHAN` · PB19 azimut balayé · PB20 `MODE` | figure 82, p. 162-164 |
| TWS | PB1 `MED INTL` · PB5 `TWS` · PB6 `2B 2` · PB7 `SIL` · PB8 `HITS` · PB9 `RAID` · PB11 `↑` · PB12 `↓` · PB13 `AUTO MAN` · PB14 `RSET` · PB15 `NCTR` · PB16 `DATA` · PB19 azimut · PB20 `EXP` | p. 174-175 |
| STT | PB1 `HI INTL` · PB2 `RDR PRI` · PB5 `RWS` · PB6 `2B 1` · PB8 `ERASE` · PB14 `RSET` · PB15 `NCTR` · PB16 `DATA` · PB17 `CHAN` · PB20 `MODE` ; pas de flèches d'échelle | figure 83 (p. 165), p. 163 n° 9-10 |

Écrits **comme sur les figures** (lot 23) : `SET`, `RSET` et `NCTR` en colonne, `NCTR`
encadré ; `RDR PRI` en deux colonnes à PB2 (figures 82 et 83, sans explication dans le
texte) ; l'option choisie encadrée (`HITS`, `AUTO`, p. 175) ; TWS en `MED INTL` comme sa
figure. Les libellés ne sont pas centrés sur leur bouton : chacun est à la place mesurée
sur la figure 82.

Azimuts proposés au clavier : RWS 20°, 40°, 60°, 80°, 140° (p. 163 n° 15) ; TWS à
deux barres 20°, 40°, 60°, 80° (p. 174).

### Les symboles

| Symbole | Dessin | Source |
|---|---|---|
| Contact brut | brique pleine | p. 158 ; p. 173 (HITS) |
| HAFU ami (bord) | hémisphère, vert | p. 209-210 |
| HAFU inconnu (bord) | crochet, jaune | p. 209-210 |
| HAFU hostile (bord) | chevron, rouge | p. 209-210 |
| Tige de cap d'un HAFU | trait issu du symbole, dans le sens du déplacement | p. 209, p. 173 |
| L&S, piste prioritaire | étoile inscrite dans le HAFU ; une seule | p. 173, p. 176 |
| DT2, deuxième piste | losange inscrit dans le HAFU ; une seule | p. 173, p. 176-177 |
| Désigner un écho | sa piste HAFU porte la marque : une brique ou le fond de l'écran donnent une piste inconnue marquée | p. 173, p. 176 (LTWS) |
| L&S et DT2 sur deux pistes | désigner la DT2 l'échange avec la L&S ; sans L&S ailleurs, la DT2 désignée devient la L&S | p. 173, p. 184 |
| Curseur d'acquisition du TDC | deux traits verticaux parallèles, altitudes couvertes au-dessus et au-dessous (exemple `16` et `-2`) | p. 158, p. 164 n° 21 ; proportions de la figure 82 |

Couleurs d'identité : vert ami, jaune inconnu, rouge hostile (p. 209). Le kit prend le
jaune le plus proche de sa palette, l'or `#D1A94A`.

### Écarts aux figures (lot 23)

Relevés en rendant chaque écran du kit à côté de sa figure, le 2026-11-10 :

| Écart relevé | Page | Corrigé |
|---|---|---|
| Verre trop grand (±0,87 au lieu de ±0,79) | RWS, TWS, STT | oui |
| Pas de bandeau ni de graduations d'azimut | RWS, TWS, STT | oui |
| Échelle d'élévation absente (le chevron seul) | RWS, TWS, STT | oui |
| Libellés centrés sur leurs boutons, et non à leur place | RWS, TWS, STT | oui |
| `SET`, `RSET`, `NCTR` écrits en ligne, `NCTR` non encadré | RWS, TWS, STT | oui |
| `RDR PRI` absent | RWS, STT | oui |
| Options choisies non encadrées (`HITS`, `AUTO`) | TWS | oui |
| `RSET` et `NCTR` absents | STT ; `NCTR` en TWS | oui |
| `HI INTL` au lieu de `MED INTL` | TWS | oui |
| Champs de données absents | RWS, TWS, STT | oui, texte d'exemple |
| Chevron de droite absent | TWS, STT | oui |
| Échelle des distances au-dessus du cadre au lieu d'à côté | RWS, TWS, STT | oui |
| Bouts de l'horizon droits | RWS, TWS, STT | oui |
| Altitudes du curseur absentes | curseur TDC | oui |

**Écarts restants : aucun** pour les trois pages.

### Laissé de côté

- **Le libellé `CHAN`** est reproduit tel que sur les figures ; le manuel ne l'explique pas.
  De même `RDR PRI`, le chevron de droite et le `7` du bas à gauche : dessinés parce
  qu'ils sont sur les figures, sans explication dans le texte.
- **La position du B-sweep** : elle bouge avec l'antenne ; le kit la trace au centre.
- **Le rang de menace** au centre d'un HAFU (p. 209) : pas de numéro automatique, il se
  met dans l'étiquette.
- **La moitié basse du HAFU** (identification extérieure, p. 210-211) : prévue avec la
  page SA.

## Vue radar liée

| Élément | Choix | Source |
|---|---|---|
| Demi-largeur de l'écran du F/A-18C | ±70°, le cône que l'antenne peut balayer | F/A-18C p. 172 (« 140° scannable cone ») |
| Demi-largeur de l'écran du F-16C | ±60°, le balayage A6 | F-16C p. 395-396 n° 8 |
| Balayage d'un réglage | F/A-18C : la moitié de l'azimut choisi ; F-16C : A6 ±60°, A3 ±30°, A1 ±10° | F/A-18C p. 163 n° 15 ; F-16C p. 395-396 |
| Aspect | 0 = on voit la queue de la cible, 180 = son nez ; écrit en dizaines de degrés, avec le côté | F-16C p. 405 |
| Chaude, froide | la cible vient vers le porteur, ou s'en éloigne | F-16C p. 404 |
| Symbole tourné du cap relatif | piste du F-16C « in relation to the ownship » ; tige du HAFU | F-16C p. 404 ; F/A-18C p. 209 |
| Part radiale et filtre Doppler | une cible dont la vitesse radiale passe sous le seuil peut être rejetée en regard vers le bas | F-16C p. 391 ; F/A-18C p. 171 |
| Identité d'un HAFU | la couleur du symbole posé : rouge hostile, bleu ami, sinon inconnue | palette du tableau |

**Non tranché, faute de source** : les bornes des catégories HOT, FLANK, BEAM, COLD, et
le seuil du notch, qui dépend de la vitesse, du regard vers le bas et du réglage MTR.

## F-16C — page FCR air-air

Source unique : *DCS F-16C Early Access Guide* (Eagle Dynamics, anglais, édition du
2026-08-16), « APG-68 Fire Control Radar », p. 374-420. Lu pour lui-même : rien n'est
repris du F/A-18C, dont la symbologie et la numérotation diffèrent.

### L'écran

| Élément | Dessin | Source |
|---|---|---|
| B-scope : appareil au bas de l'écran, distance vers le haut, azimut de gauche à droite | zone sans cadre, entre les deux traits du format | p. 394 |
| Échelle entre ses deux flèches : 5, 10, 20, 40, 80 ou 160 NM en CRM | △ valeur ▽, boutons 20 et 19 | p. 395 n° 7, p. 410 |
| Largeur de balayage : A6 = ±60°, A3 = ±30°, A1 = ±10° | libellé vertical, bouton 18 ; limites tracées en A3 et A1 | p. 395-396 n° 8 |
| Barres en élévation | `4B` vertical, bouton 17 | p. 396 n° 9 |
| Ligne d'horizon, deux repères tournés vers le sol à ses bouts | trait horizontal | p. 396 n° 10 |
| Échelle d'élévation d'antenne : ±60°, repère majeur à 0°, mineurs tous les 10°, position en « T » couché | échelle verticale à gauche | p. 397 n° 20 |
| Repères de distance à ¼, ½ et ¾ de l'échelle | trois traits au bord droit | p. 397 n° 21 |
| Cadre du format, blanc, ses libellés du haut et du bas posés dessus, interrompu à gauche par les libellés et à droite par `CONT` | traits | figure p. 394 |
| Format affiché (`FCR`) en vidéo inverse | pavé blanc, lettres noires | figure p. 394 |
| Échelle d'élévation en tirets, sans trait continu, et la position de l'antenne en « T » couché | tirets | p. 397 n° 20 ; sept tirets comptés sur les figures p. 394 et 397 |
| Échelle d'azimut d'antenne au bas : sept repères et la position de l'antenne | traits | p. 397 n° 23 ; places mesurées sur la figure p. 394 |
| Symbole de référence de l'appareil, en bas à gauche | trait et dents | p. 394 n° 14 |
| Champs de données, texte d'exemple de la figure | relèvement et distance du curseur `042 11` (n° 12), mode AIFF `M4` (n° 13), désencombrement `NONE` (n° 15), état de l'arme `RDY` (n° 16) | figure p. 394 |

### Numérotation des boutons

OSB 1 à 5 en haut, de gauche à droite ; OSB 6 à 10 à droite, de haut en bas ; OSB 16
à 20 à gauche, de bas en haut. Recoupée par : OSB 1 à 5 sur la ligne du haut (figure
p. 394, n° 1 à 5) ; OSB 6, premier à droite (n° 6) ; échelle aux OSB 19 et 20, azimut à
l'OSB 18, barres à l'OSB 17 (p. 410, et figure p. 394 n° 7 à 9, du haut vers le bas à
gauche). **Le rang du bas (OSB 11 à 15, de droite à gauche) n'est recoupé par aucun
texte lu** : le dessin n'en dépend pas, il place ces libellés là où la figure p. 394 les
montre.

### Libellés des boutons

| Page | Libellés | Source |
|---|---|---|
| RWS | OSB 1 `CRM` · OSB 2 `RWS` · OSB 3 `NORM` · OSB 4 `OVRD` · OSB 5 `CNTL` · OSB 6 `CONT` · OSB 20 et 19 échelle · OSB 18 azimut · OSB 17 `4B` · OSB 15 `SWAP` · OSB 14 `FCR` · OSB 13 `TEST` · OSB 12 `DTE` · OSB 11 `DCLT` | figure p. 394, p. 394-396 |
| TWS | les mêmes, OSB 2 `TWS` ; au bas `SWAP FCR FLCS TEST DCLT`, comme sa figure | p. 413 |

Les libellés du bas nomment les formats affectés aux boutons de l'écran ; la figure
p. 394 montre `SWAP FCR TEST DTE DCLT`, d'autres figures `SWAP FCR FLCS TEST DCLT` (p. 410,
p. 413). Chaque page du kit reprend celle de sa figure.

### Les symboles

| Symbole | Dessin | Source |
|---|---|---|
| Cible de recherche chaude | carré plein, « hot line » dessous : elle vient vers l'appareil | p. 404 |
| Cible de recherche froide | carré plein, « hot line » dessus : elle s'éloigne | p. 404 |
| Piste TWS | carré plein, jaune, qui tourne avec le cap sol, trait de nez | p. 404, p. 414 |
| Piste système | la même, en blanc | p. 404, p. 414 |
| Cible désignée (bugged, FCR TOI) | cercle autour de la piste ; une seule | p. 404, p. 415 |
| Désigner une cible de recherche | elle monte à la piste système désignée, cap gardé | p. 416 (recherche → piste → système → désignée) |
| Curseur d'acquisition A-A | deux traits verticaux parallèles, altitudes couvertes à droite (exemple `31`, et `15` en bleu) | p. 396 n° 11 ; figure p. 394 |
| Brouillage | paire de chevrons jaunes, à l'azimut des émissions | p. 411 |
| Bullseye | cercle et point | p. 397 n° 17 |

### Écarts aux figures (lot 23)

Relevés en rendant chaque écran du kit à côté de sa figure, le 2026-11-10 :

| Écart relevé | Page | Corrigé |
|---|---|---|
| Verre trop grand, cadre du format trop petit, libellés hors du cadre | RWS, TWS | oui |
| Échelle d'élévation en trait continu, treize repères serrés | RWS, TWS | oui, tirets de la figure |
| Échelle d'azimut d'antenne absente | RWS, TWS | oui |
| `FCR` non mis en évidence | RWS, TWS | oui, vidéo inverse |
| Flèches et valeur d'échelle trop espacées | RWS, TWS | oui |
| Zone tactique trop petite : les repères de distance n'étaient pas au quart du cadre | RWS, TWS | oui |
| Symbole de référence de l'appareil et champs de données absents | RWS, TWS | oui, texte d'exemple |
| Libellés du bas de la page TWS pris sur la page RWS | TWS | oui |
| Altitudes du curseur absentes | curseur A-A | oui |

**Écarts restants : aucun** pour les deux pages.

### Laissé de côté, faute de source ou de place

- **Les limites de balayage suivent le curseur** dans l'avion (p. 396) ; le kit les
  trace centrées. De même la position de l'antenne en azimut, tracée là où la figure
  p. 394 la montre.
- **L'altitude sous une piste** (p. 404) et **les données de la cible désignée** (p. 405) :
  dans l'étiquette.
- **Le relèvement bullseye du bas à gauche** (p. 397 n° 22) : il remplace le symbole de
  référence de l'appareil selon un réglage ; le kit suit la figure p. 394.
- **Le symbole de steerpoint** (« wedding cake », p. 397 n° 18) : sa forme n'est pas
  décrite, seulement montrée en petit.
- **Les classes NCTR** et **la cible AIM-120** (p. 404) : prévues avec l'emploi des armes.

## A-10C II — pages TAD, pod de désignation (TGP) et DSMS (lot 24)

Source unique : *DCS A-10C II Flight Manual* (Eagle Dynamics, anglais), installé avec le
module : DSMS p. 317-353, TAD p. 354-381, pod p. 382-409. Lu pour lui-même : rien n'est
repris des deux autres modules. Places **mesurées sur les figures 228** (TAD, p. 359),
**246** (pod, page A-G, p. 389) et **211** (DSMS, p. 318), rendues en grand et
quadrillées ; l'unité du kit y est le demi-côté du verre divisé par 0,79.

### Le boîtier (MFCD)

| Élément | Dessin | Source |
|---|---|---|
| 20 boutons : OSB 1 à 5 en haut de gauche à droite, 6 à 10 à droite de haut en bas, 11 à 15 en bas de droite à gauche, 16 à 20 à gauche de bas en haut | carrés gris | p. 359 : CNTL = OSB 1, SPI = OSB 6, DCLT = OSB 11, TAD = OSB 15, MAP = OSB 20 (n° 1 à 18 de la figure 228) |
| Boutons des côtés décalés vers le haut, à −0,52, −0,30, −0,07, +0,17, +0,40 | mesuré | figures 228, 246 et 211 (mêmes rangs : SPI, LSS, station 5 ; HOOK, GAIN, station 3) |
| Bascules ADJ et DSP en haut, CON et BRT en bas, SYM à droite du rang du bas, bouton DAY/NT/OFF à gauche | rectangles gris, cercle | figure 228 |
| Verre à ±0,79 | mesuré | figures 228, 246, 211 |
| Symbole de référence d'attitude en bas à gauche | coupe, horizon aux bouts tournés vers le bas, appareil | p. 384 (« Attitude Reference Symbol ») ; dessin de la figure 228 |
| Page affichée en vidéo inverse au rang du bas, page choisie au rang du haut | pavé vert, lettres noires | figures 228, 246, 211 |

### Page TAD

| Élément | Dessin | Source |
|---|---|---|
| Mode CEN : l'appareil au centre | symbole plein, vu de dessus | p. 357 |
| Anneau extérieur à l'échelle, 90 % de la largeur ; intérieur à la moitié | cercles à 0,711 et 0,354 | p. 356 ; mesurés sur la figure 228 |
| Échelle : 5, 10, 20, 40, 80, 160 NM en CEN, ↑ ↓ au clavier | nombre en haut à droite, plus grand | p. 360 ; texte de la figure (`40`) |
| Repères de l'anneau intérieur : nord en triangle plein, est, sud, ouest en traits | triangle dehors, pointe vers l'appareil ; traits qui croisent l'anneau | p. 357 ; figure 228 (cap 330°, nord à 30° à droite) |
| Cadre des libellés : un trait sous le rang du haut, sur celui du bas, deux traits verticaux | traits interrompus par les libellés | figure 228 |
| Libellés | OSB 1 `→CNTL` · 2 `ALL` (choisi) · 3 `LOFF` · 4 `ACT` · 5 `NONE` · 6 `SPI OFF` · 9 `MGRS↕` · 10 `NET→` · 11 `DCLT` · 12 `STAT` · 13 `TGP` · 14 `DSMS` · 15 `TAD` · 17 `DB FULL` · 18 `HOOK OWN` · 20 `MAP OFF` | figure 228, p. 359-366 |
| Champs de données, texte d'exemple | `BULL`, `231°/022` (bullseye), `NO MAP`, `232°/022/` et `6562` (symbole accroché), `38T KM 86645 83499`, `05` | figure 228, p. 365-366 |

### Symboles du TAD et de la liaison SA

| Symbole | Dessin | Source |
|---|---|---|
| Bullseye | anneaux concentriques autour d'un disque plein | p. 355 |
| Point de navigation | carré pointé, vert | p. 355-356 |
| Point tournant actif | le même, jaune | p. 355 |
| SPI | « pièce montée » à trois étages, blanc sur la figure | p. 356 ; figure 228 |
| Curseur du TAD | deux traits perpendiculaires, vert ; se pose par-dessus | p. 356 |
| Losange du pod | losange vert : où regarde le pod | p. 358 |
| Membre de la patrouille | cercle bleu, son numéro au centre, l'altitude en milliers de pieds dessous (exemple `3`, `15`) | p. 377 |
| Appareil de la liaison SA | cercle vert pointé, altitude dessous | p. 378 |
| Amis au sol (EPLRS) | croix verte | p. 378 |
| Mini-SPI | la pièce montée à deux étages, bleue | p. 378 |

### Page du pod, A-G

| Élément | Dessin | Source |
|---|---|---|
| Vidéo du capteur sous la symbologie | verre gris | figures 243 et 246 |
| Cadre vert, libellés verts sur un pavé noir, symbologie blanche | traits, pavés | figure 246 |
| Réticule de poursuite de zone, coins du grand champ | croix ouverte, quatre coins | fig. 249, p. 396 ; figure 246 |
| Champ, capteur, altitude radar, masque, indice INS | `0Z`, `WIDE`, `WHOT`, `0`, `M1`, `10` | p. 384-385 n° 1, 5, 6, 8, 9 |
| Flèche du nord | « N » fixe, flèche et trait est-ouest | p. 385 n° 7 |
| Gain ou niveau entre les flèches des OSB 19 et 20 | △ `3G` ▽ | p. 396 n° 11 |
| Actions système marquées d'un losange | `TST`, `LSS` | figure 246 |
| Libellés | OSB 1 `→CNTL` · 2 `A-G` (choisi) · 3 `STBY` · 4 `A-A` · 5 `TST` · 6 `LSS` · 7 `LSR↕` · 18 `↕GAIN` · 11 `DCLT` · 12 `MSG` · 13 `CDU` · 14 `MAV` · 15 `TGP` | figure 246, p. 389-396 |
| Champs de données, texte d'exemple | `50F`, `491M`, `AREA`, `L`, `T`, `64.8`, `00:45:55`, `N42 43.789 E042 48.398`, `116813`, `07` | figure 246, p. 389-399 |

| Réticule (palette) | Dessin | Source |
|---|---|---|
| Poursuite de point | croix, carré au centre | fig. 249, p. 396 |
| Marqueur laser | croix, butées au bout des branches | fig. 249, p. 396 |

### Page d'état du DSMS

| Élément | Dessin | Source |
|---|---|---|
| Onze stations en pavés, numéro à côté, quantité dans un petit cadre | cadres verts | p. 317-318, p. 322 (fig. 214) ; figure 211 |
| Stations du profil actif en blanc | pavés blancs, lettres noires | figure 211 (stations 5 et 7) |
| Station 6 au centre, sous son numéro | cadre vide sur la figure | figure 211 |
| Profil actif : mode du HUD, nom souligné, largage, fusée, quantité, intervalle | `CCIP`, `MK-82`, `RIP SGL`, `NOSE`, `QTY 1`, `75 FT` | p. 318-319 |
| Obus restants et mode du canon | `1150 TP` | p. 318 ; figure 211 |
| Chronomètre des Maverick | `EO 00:09:59`, encadré | p. 324 (fig. 215) ; figure 211 |
| Emports de la figure | `ALQ131 D`, `M-151 PMI` ×19, `AGM-65K 117 STBY`, `MK-84`, `MK-82`, `LITENING`, `AIM-9 OFF` ×2 | figure 211 |
| Libellés | OSB 1 `→PROF` · 2 `→MSL` · 4 `→SJET` · 5 `→INV` · 12 `STAT` · 13 `TGP` · 14 `DSMS` (affiché) · 15 `TAD` | figure 211, p. 318 |

### Écarts aux figures

Relevés en rendant chaque page du kit à côté de sa figure, le 2026-11-10 :

| Écart relevé | Page | Corrigé |
|---|---|---|
| Cadre de quantité à deux chiffres (`19`) trop étroit | DSMS | oui |
| Losange de `TST` caché sous son libellé | pod | oui |

**Écarts restants : aucun** pour les trois pages.

### Laissé de côté

- **Le mode DEP** (appareil à 27,5 % du bas, arcs de 130°, p. 357) et **EXP1/EXP2**
  (p. 370-371) : le kit dessine le CEN de la figure 228.
- **La carte sous le TAD** (`MAP`, p. 360) : la planche a déjà la sienne.
- **La ligne d'accroche** jaune tiretée (p. 365) : un trait du tableau la dessine.
- **Les autres pages du pod** (attente, A-A, LSS, p. 386-408) et **du DSMS** (profils,
  inventaire, largage sélectif, missiles, p. 326-353) : la page de chaque figure de
  référence d'abord.
- **Le numéro à côté du point tournant** (p. 355) : dans l'étiquette.

## Bibliothèque des modules (lot 28)

Un fichier par module dans `ecrans/`, chargé après `symbols.js`. Mêmes règles que le
lot 23 : chaque écran est mesuré sur l'image d'origine de sa figure, dans le boîtier de
son appareil relevé sur la même figure, et rendu à côté d'elle (figure, rendu,
superposition) jusqu'à coïncider. Les valeurs affichées sont celles de la figure. Ce
qui appartient au vol de la figure — route, menaces, pistes, image du capteur — n'est
pas dessiné : ce sont des objets à poser, et une image de capteur est rendue par un
aplat.

### F/A-18C — autres pages (DDI)

*DCS F/A-18C Early Access Guide*. Les cinq figures montrent ces pages sur un DDI.

| Écran | Figure | Laissé de côté |
|---|---|---|
| `fa18_sa` SA | fig. 98, p. 205 (texte p. 204-205) ; échelle p. 118 | pistes, symboles EW, cercle SAM, membre PPLI ; un second cercle pointé que le texte ne nomme pas |
| `fa18_hsi` HSI | fig. 42, p. 121 ; boutons p. 117-120 ; symboles fig. 68, p. 144 ; TACAN fig. 62, p. 137 ; ADF p. 143 | la carte mobile ; un petit rectangle que le texte ne nomme pas |
| `fa18_azel` AZ/EL | fig. 92, p. 180 | HAFU et curseur ; les données de la cible L&S de la figure sont gardées |
| `fa18_sms` SMS air-sol | fig. 160, p. 303 | — |
| `fa18_flir` ATFLIR air-sol | fig. 106-107, p. 220-221 | l'image du pod (aplat vert) |

### F-16C — autres pages (MFD)

*DCS F-16C Early Access Guide* ; figures non numérotées, citées par leur page.

| Écran | Figure | Laissé de côté |
|---|---|---|
| `f16_hsd` HSD | p. 358 (texte p. 358-361) ; échelles 15 à 240 | route, menaces, points, lignes de la mission |
| `f16_sms` SMS, inventaire | p. 366 (p. 366-367) | — |
| `f16_tgp` pod de désignation, A-G | p. 495 (p. 495-499) | l'image du pod (aplat gris) |
| `f16_gm` FCR GM air-sol | p. 437 (p. 437-438) ; échelles 10 à 80 | la carte radar (aplat sur le secteur) |

### A-10C II — autres pages (MFCD)

*DCS A-10C II Flight Manual* (EN).

| Écran | Figure | Laissé de côté |
|---|---|---|
| `a10_mav` Maverick | fig. 260, p. 415 ; fig. 261, p. 418 (p. 413-419) | l'image du missile (aplat) |
| `a10_stat` STAT, page 2 | fig. 210, p. 315 (p. 312-316) | la page 1 (fig. 209, image illisible) |
| `a10_tgpaa` pod de désignation, A-A | fig. 254, p. 404 (p. 402-404) | — ; un petit carré blanc que le texte n'explique pas est dessiné tel que la figure le montre |
| `a10_prof` DSMS, profils | fig. 217, p. 326 (p. 326-327) | — |

### AH-64D — écrans MPD

*DCS AH-64D Flight Manual* (EN). Boîtier MPD (`BEZELS.mpd`) d'après la figure p. 164 et
les captures du manuel : VAB T1-T6, L1-L6, R1-R6, B1-B6 (B1 = M, p. 165), boutons FCR,
WPN, TSD, M, A/C, VID, COM et `*`, molettes VID et BRT, sélecteur DAY / NT / MONO.

| Écran | Figure | Laissé de côté |
|---|---|---|
| `ah64_tsd` TSD, NAV | p. 196 (p. 196-199) ; fond du format STICK, p. 220 | le fond de carte, les lignes de grille (dépendent du terrain), route, points, menaces |
| `ah64_fcr` FCR, GTM | p. 446 (p. 446-448) ; secteur p. 455-456 | cibles, PFZ/NFZ, empreinte TADS ; deux marques sous la bande de cap dessinées sans nom (la légende ne les nomme pas) |
| `ah64_wpn` WPN | p. 536 (p. 536-538) ; icônes SAL et RF p. 586, 610 | — |
| `ah64_ase` ASE | p. 625 (p. 625-626) | les menaces |

### F-14B — écrans du RIO et du pilote

Manuel Heatblur (*F-14 Manual*), seule source.

| Écran | Figure | Laissé de côté |
|---|---|---|
| `f14_tid` TID, TWS | écran p. 485 ; symboles p. 355-364 ; boîtier p. 158 et 366, commandes p. 353-354 | le pupitre sous le TID (DISPLAY, TID MODE, RANGE : un panneau à part) ; photos prises de biais, places ramenées par l'ovale du verre |
| `f14_ddd` DDD, pulse-Doppler | boîtier et réseau gravé p. 408, commandes p. 346-349 ; échos p. 394-395 ; mode PD p. 350, 392 | les boutons de portée au-dessus (hors figure) ; la cible 4 de la p. 395, noyée dans le fouillis |
| `f14_hsd` HSD, NAV (pilote) | p. 72-73 ; sous-mode TACAN d'après p. 264 | — ; un chevron « E » et une croix que le manuel n'explique pas sont dessinés tels que la figure les montre |

### F-15C — écrans

*F-15C DCS Flaming Cliffs Flight Manual* (EN) ; ses figures font foi, pas les phrases
recopiées d'autres appareils.

| Écran | Figure | Laissé de côté |
|---|---|---|
| `f15_vsd` VSD, recherche LRS | fig. 54, p. 66-68 ; boîtier fig. 21, p. 35-36 ; portées 10 à 160 | — |
| `f15_tews` TEWS | fig. 63, p. 78 (p. 76-80) | — |

### Mirage F1 — radar Cyrano

*DCS Mirage F1 Flight Manual* (Aerges), § 3.18, p. 108-130. Boîtier (`BEZELS.f1`) haut,
flanc droit en courbe : places de la fig. 3-130, teintes de jour et plaques de la
fig. 3-133 (p. 128).

| Écran | Figure | Laissé de côté |
|---|---|---|
| `mf1_search` scope, recherche (HA, 15 NM) | fig. 3-130, p. 126 | les échos parasites ; l'échelle ne change pas (places connues pour 15 NM seulement) |
| `mf1_lock` scope, accroché | fig. 3-132, p. 127 (p. 116-117) | — ; figure prise de biais, redressée sur les trois traits gravés |

### Su-25T — écrans

*DCS World Su-25T Flight Manual* (EN).

| Écran | Figure | Laissé de côté |
|---|---|---|
| `su25t_tv_lltv` écran TV, acquisition | fig. 27, p. 26 | l'image (fond vert à lignes de balayage) ; la graduation −90°, hors figure |
| `su25t_tv_lock` écran TV, cible accrochée | fig. 28, p. 27 (redressée sur la fig. 27) | l'image ; une ligne pointillée que le manuel ne nomme pas est dessinée telle que la figure la montre |
| `su25t_spo15` indicateur SPO-15 | fig. 13, p. 10 | — |
