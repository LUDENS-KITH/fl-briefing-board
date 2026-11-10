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
