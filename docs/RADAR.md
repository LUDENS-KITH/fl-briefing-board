# Kit radar — sources

> Document vivant, ouvert le **2026-09-30** avec la **v1.3**.
> Chaque élément du kit radar cite ici sa source. Un symbole ou un libellé sans source
> n'entre pas dans le kit ([PLAN.md](PLAN.md) §5.3).

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
| RWS | PB1 `HI INTL` (PRF) · PB5 `RWS` · PB6 `4B 1` (barres) · PB7 `SIL` · PB8 `ERASE` · PB11 `↑` · PB12 `↓` · PB13 `SET` · PB14 `RSET` · PB15 `NCTR` · PB16 `DATA` · PB17 `CHAN` · PB19 azimut balayé · PB20 `MODE` | figure 82, p. 162-164 |
| TWS | PB1 `HI INTL` · PB5 `TWS` · PB6 `2B 2` · PB7 `SIL` · PB8 `HITS` · PB9 `RAID` · PB11 `↑` · PB12 `↓` · PB13 `AUTO MAN` · PB14 `RSET` · PB16 `DATA` · PB19 azimut · PB20 `EXP` | p. 174-175 |
| STT | PB1 `HI INTL` · PB5 `RWS` · PB6 `2B 1` · PB8 `ERASE` · PB15 `NCTR` · PB16 `DATA` · PB17 `CHAN` · PB20 `MODE` ; pas de flèches d'échelle | figure 83, p. 163 n° 9-10 |

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
| Curseur d'acquisition du TDC | deux traits verticaux parallèles | p. 158, p. 162 n° 21 |

Couleurs d'identité : vert ami, jaune inconnu, rouge hostile (p. 209). Le kit prend le
jaune le plus proche de sa palette, l'or `#D1A94A`.

### Laissé de côté, faute de source

- **Les graduations d'azimut** du bord haut du B-scope : visibles sur les figures 77 à 82,
  leurs valeurs ne sont pas données par le manuel.
- **Les champs de données** : cap, vitesse, altitude, arme, relèvements vers le bullseye
  (p. 160, 162-163). Ils changent à chaque vol ; l'étiquette d'un objet les porte au besoin.
- **Le libellé `CHAN`** est reproduit tel que sur les figures ; le manuel ne l'explique pas.
- **Le rang de menace** au centre d'un HAFU (p. 209) : pas de numéro automatique, il se
  met dans l'étiquette.
- **La moitié basse du HAFU** (identification extérieure, p. 210-211) : prévue avec la
  page SA.

## F-16C — page FCR

À venir (lot 2, second module) : *DCS F-16C Early Access Guide*, « APG-68 Fire Control
Radar », p. 374 et suivantes.
