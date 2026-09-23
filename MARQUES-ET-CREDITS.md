# Marques et crédits

## Ce que couvre la licence MIT — et ce qu'elle ne couvre pas

La [licence MIT](LICENSE) couvre **le code source** : chacun peut l'utiliser, le
modifier et le redistribuer, à condition de conserver la mention « © LK Studio ».

Elle **ne couvre pas** :

- les noms **FL Briefing Board**, **FlightLedger** et **LK Studio** ;
- l'écusson FL Briefing Board (`assets/fl-briefing-board-*`), le logo LK Studio
  (`assets/lk-studio-logo.png`) et l'icône FL Creator Missions (`tools/creator.png`).

Ils restent la propriété de LK Studio. Un projet dérivé doit porter un autre nom et
d'autres logos, et ne pas laisser croire qu'il vient de LK Studio.

## Non-affiliation

FL Briefing Board est un projet indépendant, **non affilié à Eagle Dynamics**.
DCS World et les noms des modules et des cartes DCS sont des marques d'Eagle Dynamics SA,
citées ici pour désigner les théâtres auxquels l'outil s'applique.

## Soutiens communautaires

Les soutiens Ko-Fi ou Discord peuvent être remerciés dans les notes du projet, avec
leur accord explicite. Voir [docs/SOUTENIR.md](docs/SOUTENIR.md).

Règle de publication : pseudo seul par défaut, pas de nom réel, pas d'adresse e-mail,
pas d'identifiant Discord complet et pas de montant versé sans accord explicite.

## Données et services tiers

| Élément | Source | Conditions |
|---|---|---|
| Fond topographique | [OpenTopoMap](https://opentopomap.org) — données © contributeurs [OpenStreetMap](https://www.openstreetmap.org/copyright), SRTM | CC-BY-SA, attribution affichée sur la carte |
| Plan routier | [OpenStreetMap](https://www.openstreetmap.org) | ODbL, attribution affichée ; [politique d'usage des tuiles](https://operations.osmfoundation.org/policies/tiles/) |
| Satellite | Esri World Imagery — Esri, Maxar, Earthstar Geographics | conditions d'Esri, attribution affichée |
| Déclinaison magnétique | Modèle magnétique mondial [WMM2025](https://www.ncei.noaa.gov/products/world-magnetic-model), NOAA | domaine public |
| Emprise des théâtres (`theatres.js`) | quatre coordonnées par théâtre, calculées depuis les positions d'aérodromes du projet [DCS Web Viewer](https://github.com/DCS-Web-Editor/dcs-web-viewer-deploy) | bornes géographiques seulement ; **aucune donnée d'aérodrome n'est publiée** |

Les tuiles de carte sont chargées depuis ces services au moment de l'affichage ; aucune
n'est incluse dans ce dépôt.

La source des aérodromes DCS ne publie pas de licence : la couche d'aérodromes est donc
**absente de la version publique**. `tools/build_theatres.py --aerodromes` la produit pour
un usage local, à ne pas redistribuer.
