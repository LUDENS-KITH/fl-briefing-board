# Kit radar — sources

> Document vivant, ouvert le **2026-09-30** avec la **v1.3** : F/A-18C et F-16C.
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
| TWS | les mêmes, OSB 2 `TWS` | p. 413 |

Les libellés du bas nomment les formats affectés aux boutons de l'écran ; la figure
p. 394 montre `SWAP FCR TEST DTE DCLT`, d'autres figures `SWAP FCR FLCS TEST DCLT` (p. 410).
Le kit reprend la première.

### Les symboles

| Symbole | Dessin | Source |
|---|---|---|
| Cible de recherche chaude | carré plein, « hot line » dessous : elle vient vers l'appareil | p. 404 |
| Cible de recherche froide | carré plein, « hot line » dessus : elle s'éloigne | p. 404 |
| Piste TWS | carré plein, jaune, qui tourne avec le cap sol, trait de nez | p. 404, p. 414 |
| Piste système | la même, en blanc | p. 404, p. 414 |
| Cible désignée (bugged, FCR TOI) | cercle autour de la piste ; une seule | p. 404, p. 415 |
| Curseur d'acquisition A-A | deux traits verticaux parallèles | p. 396 n° 11 |
| Brouillage | paire de chevrons jaunes, à l'azimut des émissions | p. 411 |
| Bullseye | cercle et point | p. 397 n° 17 |

### Laissé de côté, faute de source ou de place

- **L'échelle d'azimut d'antenne** du bas (p. 397 n° 23) : l'espacement de ses repères
  n'est pas donné.
- **Les limites de balayage suivent le curseur** dans l'avion (p. 396) ; le kit les
  trace centrées.
- **Les champs de données** : relèvement et distance du curseur, IFF, état de l'arme,
  niveau de désencombrement, données de la cible désignée (p. 396-397, 405). Ils
  changent à chaque vol ; l'étiquette les porte au besoin.
- **Les chiffres d'altitude du curseur** (p. 396 n° 11) et **l'altitude sous une piste**
  (p. 404) : dans l'étiquette.
- **Le symbole de steerpoint** (« wedding cake », p. 397 n° 18) : sa forme n'est pas
  décrite, seulement montrée en petit.
- **Les classes NCTR** et **la cible AIM-120** (p. 404) : prévues avec l'emploi des armes.
