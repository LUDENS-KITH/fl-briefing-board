/* FL Briefing Board — langue de l'interface (lot 16).
   Le français est la langue source : la page et le code écrivent en français, et tr()
   rend la traduction anglaise quand l'interface est en anglais. La clé est le texte
   français exact ; {0}, {1}… y marquent les valeurs insérées. Un texte sans traduction
   resterait en français à l'écran : tools/test_i18n.js l'interdit, pour la page, pour
   chaque tr() du code et pour les noms des formes, des groupes et des théâtres.
   Les identifiants DCS (types d'appareils, noms de vols et de missions) ne se traduisent
   jamais : ce sont ceux du jeu. */

const LANG_KEY = 'fl-briefing-board-lang';
/* la langue : celle de l'adresse (?lang=en), sinon celle choisie et gardée, sinon celle
   du navigateur — le français pour un navigateur en français, l'anglais pour tout autre */
function pickLang(query, stored, navLangs){
  const q = /[?&]lang=(fr|en)\b/.exec(query || '');
  if (q) return q[1];
  if (stored === 'fr' || stored === 'en') return stored;
  return /^fr\b/i.test((navLangs || [])[0] || 'fr') ? 'fr' : 'en';
}
const LANG = (() => {
  if (typeof location === 'undefined') return 'fr';
  let stored = null;
  try { stored = localStorage.getItem(LANG_KEY); } catch(_){}
  const nav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  return pickLang(location.search, stored, nav);
})();
const LOCALE = LANG === 'en' ? 'en-US' : 'fr-FR';

const EN = {
  /* ---------- page ---------- */
  'FL Briefing Board — tableau de briefing pour DCS World': 'FL Briefing Board — briefing whiteboard for DCS World',
  'FL': 'FL',
  'Briefing Board': 'Briefing Board',
  'FL Briefing Board': 'FL Briefing Board',
  "Démo : rien n'est enregistré. Cliquez pour ouvrir votre propre tableau.": 'Demo: nothing is saved. Click to open your own board.',
  'DÉMO': 'DEMO',
  'Sélectionner / déplacer (V) — sur une carte, glisser dans le vide déplace la carte': 'Select / move (V) — on a map, dragging on empty space pans the map',
  'Main : déplacer la carte (H) — ou clic droit glissé, clic molette, espace + glisser': 'Hand: pan the map (H) — or right-button drag, middle-button drag, space + drag',
  'Flèche — incurvable après tracé (A)': 'Arrow — can be curved once drawn (A)',
  'Trait (L)': 'Line (L)',
  'Crayon libre (P)': 'Freehand pencil (P)',
  'Cercle (C)': 'Circle (C)',
  'Rectangle (R)': 'Rectangle (R)',
  'Zone hachurée — CAP, engagement, interdite (Z) : cliquez les sommets, refermez sur le premier ou double-cliquez': 'Hatched area — CAP, engagement, no-fly (Z): click the vertices, close on the first one or double-click',
  'Règle — distance et cap (M)': 'Ruler — distance and heading (M)',
  'Texte (T)': 'Text (T)',
  'T': 'T',
  "Gomme — supprime l'objet touché (E)": 'Eraser — deletes the object touched (E)',
  'Bleu — ami': 'Blue — friendly',
  'Rouge — hostile': 'Red — hostile',
  'Or': 'Gold',
  'Vert — neutre': 'Green — neutral',
  'Orange': 'Orange',
  'Blanc': 'White',
  'Trait fin': 'Thin line',
  'Trait moyen': 'Medium line',
  'Trait épais': 'Thick line',
  'Trait plein — réel': 'Solid line — actual',
  'Tirets — prévu': 'Dashed — planned',
  'Pointillés — menace, incertain': 'Dotted — threat, uncertain',
  'Dupliquer la sélection (Ctrl+D)': 'Duplicate the selection (Ctrl+D)',
  "Ancrer / libérer la sélection (K) — ancrée, elle ne se déplace plus et ne s'efface plus ; on pose par-dessus": 'Pin / unpin the selection (K) — once pinned, it no longer moves or gets erased; you place on top of it',
  'Accrocher la sélection à un symbole, puis touchez ce symbole (J) — accrochée, elle le suit au zoom, au déplacement, en rotation ; 🔗 de nouveau pour la décrocher': 'Attach the selection to a symbol, then touch that symbol (J) — once attached, it follows it through zoom, moves and rotation; 🔗 again to detach it',
  'Flèche double sens': 'Double-headed arrow',
  'Mettre au premier plan': 'Bring to front',
  'Annuler (Ctrl+Z)': 'Undo (Ctrl+Z)',
  'Rétablir (Ctrl+Y)': 'Redo (Ctrl+Y)',
  'Masquer la palette': 'Hide the palette',
  'Fond clair / sombre': 'Light / dark background',
  'Coupe : vue de profil sous la vue de dessus, altitudes en pieds et niveaux de vol': 'Profile: side view under the top-down view, altitudes in feet and flight levels',
  '⊟ Coupe': '⊟ Profile',
  'Cotes : distance et cap sur les traits et flèches (prochains tracés, et la sélection)': 'Measurements: distance and heading on lines and arrows (the next ones drawn, and the selection)',
  '📐 Cotes': '📐 Measure',
  'Caps vrais ou magnétiques (comme au cockpit DCS)': 'True or magnetic headings (as in the DCS cockpit)',
  'Cap vrai': 'True hdg',
  'Cap mag.': 'Mag. hdg',
  'Déclinaison magnétique de la planche': 'Magnetic declination of the board',
  'Décl. ?': 'Decl. ?',
  'Décl. {0}': 'Decl. {0}',
  'Unité des distances : milles nautiques ou kilomètres': 'Distance unit: nautical miles or kilometers',
  'NM': 'NM',
  'Échelle de la planche': 'Board scale',
  'Échelle': 'Scale',
  'Échelle auto': 'Auto scale',
  'Présenter (F5) : plein écran, barres masquées, phases au clavier, pointeur laser ; Échap pour sortir': 'Present (F5): full screen, toolbars hidden, phases from the keyboard, laser pointer; Esc to exit',
  '▶ Présenter': '▶ Present',
  "Nouveau briefing : repartir d'un tableau vierge — toutes les planches et leurs images sont effacées de ce navigateur, après confirmation ; enregistrez d'abord (⇩ Briefing) pour les garder": 'New briefing: start again from a blank board — every board and its images are erased from this browser, after confirmation; save first (⇩ Briefing) to keep them',
  '✚ Nouveau': '✚ New',
  'Enregistrer le briefing (Ctrl+S) : toutes les planches, images comprises, dans un fichier .json à ouvrir sur un autre poste': 'Save the briefing (Ctrl+S): every board, images included, in a .json file to open on another computer',
  '⇩ Briefing': '⇩ Briefing',
  'Ouvrir un briefing enregistré (Ctrl+O) — remplace le tableau affiché ; un fichier .json se glisse aussi sur la page': 'Open a saved briefing (Ctrl+O) — replaces the board on screen; a .json file can also be dropped on the page',
  '⇧ Ouvrir': '⇧ Open',
  "Importer une mission DCS (.miz) : la route d'un vol, le bullseye, les défenses aériennes et les navires, sur une nouvelle planche — un .miz se glisse aussi sur la page": "Import a DCS mission (.miz): a flight's route, the bullseye, air defenses and ships, on a new board — a .miz can also be dropped on the page",
  '⇧ Mission': '⇧ Mission',
  "Écrire la route de la planche dans la DTC des F/A-18C d'une mission DCS (.miz) : choisissez la mission, puis le vol — le tableau rend une copie, la mission d'origine n'est pas modifiée": "Write the board's route into the F/A-18C DTC of a DCS mission (.miz): pick the mission, then the flight — you get a copy back, the original mission is not modified",
  '⇩ DTC': '⇩ DTC',
  "Exporter la planche en PNG, telle qu'à l'écran": 'Export the board as a PNG, as shown on screen',
  '⇩ PNG': '⇩ PNG',
  "Cadrer le kneeboard : un cadre aux proportions de la page, à déplacer par son bord et agrandir par sa poignée ; l'export kneeboard prend ce qu'il contient. Un second clic l'ôte.": "Frame the kneeboard: a frame with the page's proportions, moved by its edge and enlarged by its handle; the kneeboard export takes what it contains. A second click removes it.",
  '⬚ Cadre': '⬚ Frame',
  "Exporter la planche au format kneeboard DCS (portrait 768 × 1157, aux proportions de la planchette du jeu) : le cadre s'il y en a un, sinon la planche ; à copier dans Saved Games\\DCS\\Kneeboard": 'Export the board as a DCS kneeboard page (portrait 768 × 1157, the proportions of the in-game kneeboard): the frame if there is one, otherwise the board; copy it into Saved Games\\DCS\\Kneeboard',
  '⇩ Kneeboard': '⇩ Kneeboard',
  'Effacer la planche affichée': 'Clear the board on screen',
  'Effacer': 'Clear',
  'À propos — LK Studio': 'About — LK Studio',
  'html:lang': 'FR',
  "Langue de l'interface : passer en anglais": 'Interface language: switch to French',
  'Carte du théâtre DCS en fond — vivante : molette pour zoomer, clic droit pour se déplacer': 'DCS theater map as background — live: mouse wheel to zoom, right-click drag to pan',
  'Sans carte': 'No map',
  'Fond de carte': 'Map background',
  'Topographique': 'Topographic',
  'Satellite': 'Satellite',
  'Plan routier': 'Road map',
  'Aérodromes DCS, sous leur nom DCS': 'DCS airfields, under their DCS name',
  'Aérodromes': 'Airfields',
  'Zoomer (+)': 'Zoom in (+)',
  'Dézoomer (−)': 'Zoom out (−)',
  'Recadrer sur tout le théâtre': 'Fit the whole theater',
  "Panneau du bas : la coupe, ou l'écran radar d'un appareil, calculé depuis la vue de dessus": "Bottom panel: the profile, or an aircraft's radar display, computed from the top-down view",
  'COUPE': 'PROFILE',
  'RADAR F/A-18C': 'RADAR F/A-18C',
  'RADAR F-16C': 'RADAR F-16C',
  "Relief : tracez la crête à main levée, elle se remplit jusqu'au sol": 'Terrain: draw the ridge freehand, it fills down to the ground',
  '⛰ Relief': '⛰ Terrain',
  "Enveloppe sol-air : partez du site au sol, tirez jusqu'à son rayon et son plafond": 'Surface-to-air envelope: start at the site on the ground, drag out to its range and ceiling',
  '◠ Menace SA': '◠ SAM threat',
  "Bloc d'altitude : glissez verticalement entre deux altitudes": 'Altitude block: drag vertically between two altitudes',
  "▤ Bloc d'alt.": '▤ Alt. block',
  'Plafond': 'Ceiling',
  '10 000 ft': '10,000 ft',
  '20 000 ft': '20,000 ft',
  '40 000 ft': '40,000 ft',
  '60 000 ft': '60,000 ft',
  'Largeur': 'Range',
  "La coupe suit les waypoints de la vue de dessus, dans l'ordre de leurs numéros. Tirez un waypoint verticalement pour son altitude, double-cliquez pour la taper.": "The profile follows the top-down view's waypoints, in number order. Drag a waypoint vertically to set its altitude, double-click to type it.",
  'Route liée': 'Linked route',
  'pieds · FL au-dessus de 18 000 ft · altitudes calées sur 500 ft': 'feet · FL above 18,000 ft · altitudes snapped to 500 ft',
  'Porteur du radar : sélectionnez un appareil dans la vue de dessus, puis ce bouton': 'Radar ownship: select an aircraft in the top-down view, then this button',
  '◎ Porteur': '◎ Ownship',
  'html:rrange': 'Range',
  'Balayage': 'Scan',
  'calculé depuis la vue de dessus · ne simule pas la détection': 'computed from the top-down view · does not simulate detection',
  "Choisissez une forme, touchez le vide pour la poser, gardez appuyé pour l'orienter · clic droit ou Échap : retour à la sélection · 📌 ou K : ancrer · 🔗 ou J : accrocher à un symbole · double-clic : étiquette · carte : molette pour zoomer, clic droit glissé pour se déplacer": 'Pick a shape, touch empty space to place it, hold to orient it · right-click or Esc: back to selection · 📌 or K: pin · 🔗 or J: attach to a symbol · double-click: label · map: mouse wheel to zoom, right-click drag to pan',
  'html:moving': '<b>FL Briefing Board has moved</b> to <b>briefing.flightledger.io</b>. Were you using it at the old address (ludens-kith.github.io)? Your briefings stayed there: the recovery page gives them back as a file, to reopen here with ⇧ Open.',
  'Récupérer mes briefings': 'Recover my briefings',
  'Compris': 'Got it',
  'texte puis Entrée': 'text, then Enter',
  'Fermer': 'Close',
  'Quel vol importer ?': 'Which flight to import?',
  'Écusson FL Briefing Board': 'FL Briefing Board patch',
  'html:about-desc': 'The briefing and debriefing board for DCS World squadrons: aviation shapes ready to place, theater maps, a profile linked to the route, magnetic headings, kneeboard export.',
  'LK Studio': 'LK Studio',
  'html:about-studio': '<b>Designed and built by LK Studio</b>, a software studio based in Tours, France.',
  'l-k-studio.com': 'l-k-studio.com',
  'html:about-fl': '<b>FlightLedger</b> — debrief your real flights: logbook, Tacview analysis, squadrons. The briefing prepares the flight; FlightLedger tells what happened. →',
  'Présentation': 'Overview (French)',
  'Overview': 'Overview',
  '· Guides :': '· Guides:',
  'FR': 'FR',
  'EN-US': 'EN-US',
  'Soutenir / Ko-Fi': 'Support / Ko-Fi',
  'Discord': 'Discord',
  "Récupérer les briefings de l'ancienne adresse": 'Recover briefings from the old address',
  'Code source': 'Source code',
  "Licence MIT pour le code · nom et logos réservés à LK Studio · cartes © OpenStreetMap, OpenTopoMap, Esri · modèle magnétique WMM2025 (NOAA) · non affilié à Eagle Dynamics — DCS World est une marque d'Eagle Dynamics SA.": 'MIT license for the code · name and logos reserved to LK Studio · maps © OpenStreetMap, OpenTopoMap, Esri · WMM2025 magnetic model (NOAA) · not affiliated with Eagle Dynamics — DCS World is a trademark of Eagle Dynamics SA.',

  /* ---------- palette : groupes, formes ---------- */
  'Aéronefs': 'Aircraft',
  'Armement / Effets': 'Weapons / Effects',
  'Sol / Mer': 'Ground / Sea',
  'Tactique': 'Tactical',
  'Radar F/A-18C': 'Radar F/A-18C',
  'Radar F-16C': 'Radar F-16C',
  'Chasseur': 'Fighter',
  'Bombardier': 'Bomber',
  'Ravitailleur': 'Tanker',
  'Civil': 'Civilian',
  'Hélicoptère': 'Helicopter',
  'AWACS': 'AWACS',
  'Drone': 'Drone',
  'Missile': 'Missile',
  'Bombe': 'Bomb',
  'Explosion': 'Explosion',
  'Abattu': 'Splash',
  'Éjection': 'Ejection',
  'Leurres': 'Flares',
  'Char': 'Tank',
  'Radar': 'Radar',
  'Menace SA': 'SAM threat',
  'Aéroport': 'Airfield',
  'Navire': 'Ship',
  'Porte-avions': 'Carrier',
  'FARP': 'FARP',
  'Ami': 'Friendly',
  'Hostile': 'Hostile',
  'Inconnu': 'Unknown',
  'Waypoint': 'Waypoint',
  'Objectif': 'Objective',
  'Orbite': 'Orbit',
  'Bullseye': 'Bullseye',
  'Point IP': 'IP',
  'Écran RWS': 'RWS display',
  'Écran TWS': 'TWS display',
  'Écran STT': 'STT display',
  'Brique': 'Brick',
  'L&S': 'L&S',
  'DT2': 'DT2',
  'Curseur TDC': 'TDC cursor',
  'Cible chaude': 'Hot target',
  'Cible froide': 'Cold target',
  'Piste TWS': 'TWS track',
  'Piste système': 'System track',
  'Désignée': 'Bugged',
  'Curseur A-A': 'A-A cursor',
  'Brouillage': 'Jamming',

  /* ---------- théâtres ---------- */
  'Caucase': 'Caucasus',
  'Syrie': 'Syria',
  'Golfe Persique': 'Persian Gulf',
  'Sinaï': 'Sinai',
  'Irak': 'Iraq',
  'Afghanistan': 'Afghanistan',
  'Mariannes': 'Marianas',
  'Mariannes 1944': 'Marianas 1944',
  'Nevada': 'Nevada',
  'Normandie': 'Normandy',
  'La Manche': 'The Channel',
  'Atlantique Sud': 'South Atlantic',
  'Kola': 'Kola',
  'Allemagne (Guerre froide)': 'Germany (Cold War)',

  /* ---------- planches ---------- */
  'Clic : afficher · double-clic : renommer · PgPréc / PgSuiv': 'Click: show · double-click: rename · PgUp / PgDn',
  'Supprimer cette planche': 'Delete this board',
  'Nouvelle planche : copie de celle affichée, à faire évoluer': 'New board: a copy of the one on screen, to build on',
  'Supprimer la planche « {0} » ?': 'Delete the board “{0}”?',
  'Nom de la planche': 'Board name',
  'Effacer la planche « {0} » ?': 'Clear the board “{0}”?',
  'planche': 'board',

  /* ---------- carte, coupe, mesures ---------- */
  '© contributeurs OpenStreetMap · SRTM · style © OpenTopoMap (CC-BY-SA)': '© OpenStreetMap contributors · SRTM · style © OpenTopoMap (CC-BY-SA)',
  'Imagerie © Esri, Maxar, Earthstar Geographics': 'Imagery © Esri, Maxar, Earthstar Geographics',
  '© contributeurs OpenStreetMap': '© OpenStreetMap contributors',
  'SOL': 'GND',
  'Posez au moins deux waypoints dans la vue de dessus : la route va de 1 à 2, 3…': 'Place at least two waypoints in the top-down view: the route runs from 1 to 2, 3…',
  'Étalonnez la vue de dessus (règle, puis Échelle), ou choisissez une carte : sans échelle, pas de distance le long de la route.': 'Calibrate the top-down view (ruler, then Scale), or pick a map: without a scale, there is no distance along the route.',
  /* caps : V vrai, M magnétique, G grille DCS ; côté d'une cible : G gauche, D droite */
  'cap:V': 'T',
  'côté:G': 'L',
  'côté:D': 'R',
  'déclinaison:O': 'W',
  'KNEEBOARD': 'KNEEBOARD',

  /* ---------- vue radar ---------- */
  'Sélectionnez un appareil dans la vue de dessus, puis « Porteur ».': 'Select an aircraft in the top-down view, then “Ownship”.',
  'Il faut une carte, ou une planche étalonnée (bouton Échelle), pour mesurer les distances.': 'A map, or a calibrated board (Scale button), is needed to measure distances.',
  'Porteur : {0} · échelle {1} NM · balayage {2}': 'Ownship: {0} · range {1} NM · scan {2}',
  '{0}. {1} — {2}, {3} · aspect {4} · {5} · radiale {6} %': '{0}. {1} — {2}, {3} · aspect {4} · {5} · radial {6}%',
  'chaude': 'hot',
  'froide': 'cold',
  'au travers': 'beam',
  '… et {0} autres': '… and {0} more',
  "Aucun contact dans le balayage et l'échelle.": 'No contact within the scan and range.',
  '{0} hors balayage': '{0} outside the scan',
  "{0} au-delà de l'échelle": '{0} beyond the range',
  'Radiale : part de sa vitesse le long de la ligne de visée. Proche de 0 % (au travers),': 'Radial: share of its speed along the line of sight. Near 0% (beaming),',
  'le filtre Doppler peut rejeter la cible en regard vers le bas (manuel F-16C, p. 391).': 'the Doppler filter may reject the target when looking down (F-16C manual, p. 391).',

  /* ---------- marques, ancrage, accroche ---------- */
  '{0} est une marque du {1} : pas sur une piste du {2}': '{0} is a {1} mark: not on a {2} track',
  "{0} est une marque du {1} : pas sur l'écran du {2}": '{0} is a {1} mark: not on the {2} display',
  'Cette piste porte la {0} : {1} se pose sur une autre piste': 'This track carries the {0}: {1} goes on another track',
  'Objet ancré — 📌 ou K pour le libérer': 'Pinned object — 📌 or K to unpin it',
  "Sélectionnez d'abord l'objet à ancrer (outil Sélection, V)": 'First select the object to pin (Select tool, V)',
  "Sélectionnez d'abord l'objet à accrocher (outil Sélection, V)": 'First select the object to attach (Select tool, V)',
  "Seuls un symbole ou un texte s'accrochent": 'Only a symbol or a text can be attached',
  'Décroché : il reste à sa place': 'Detached: it stays where it is',
  "Touchez le symbole auquel l'accrocher — Échap pour annuler": 'Touch the symbol to attach it to — Esc to cancel',
  'symbole': 'symbol',
  "Rien d'accroché : touchez un symbole": 'Nothing attached: touch a symbol',
  "Rien d'accroché : l'hôte doit être dans la même vue": 'Nothing attached: the host must be in the same view',
  'Boucle refusée : {0} est déjà accroché à cet objet': 'Loop refused: {0} is already attached to this object',
  'Accroché à {0} : il le suit au zoom, au déplacement, en rotation': 'Attached to {0}: it follows it through zoom, moves and rotation',

  /* ---------- texte, images ---------- */
  'étiquette : indicatif, altitude… puis Entrée': 'label: callsign, altitude… then Enter',
  "{0} images de fond n'ont pas pu être relues": '{0} background images could not be read back',
  "Une image de fond n'a pas pu être relue": 'A background image could not be read back',

  /* ---------- nouveau, échelle, déclinaison ---------- */
  'Le tableau est déjà vierge': 'The board is already blank',
  'Commencer un nouveau briefing ?\n\nLes {0} planches et leurs images seront effacées de ce navigateur, sans retour par Annuler. Pour les garder, annulez puis enregistrez le briefing (⇩ Briefing).': 'Start a new briefing?\n\nThe {0} boards and their images will be erased from this browser, and Undo cannot bring them back. To keep them, cancel, then save the briefing (⇩ Briefing).',
  'Commencer un nouveau briefing ?\n\nLa planche et leurs images seront effacées de ce navigateur, sans retour par Annuler. Pour les garder, annulez puis enregistrez le briefing (⇩ Briefing).': 'Start a new briefing?\n\nThe board and its images will be erased from this browser, and Undo cannot bring them back. To keep them, cancel, then save the briefing (⇩ Briefing).',
  'Nouveau briefing : tableau vierge': 'New briefing: blank board',
  "Sur une carte, l'échelle est automatique : distances et caps viennent de la carte.": 'On a map, the scale is automatic: distances and headings come from the map.',
  "Mesurez d'abord avec la règle (M) une distance que vous connaissez sur la carte, par exemple entre deux waypoints, puis revenez ici.": 'First measure, with the ruler (M), a distance you know on the map, for example between two waypoints, then come back here.',
  'Distance réelle de cette mesure, en kilomètres (km) :': 'Actual distance of this measurement, in kilometers (km):',
  'Distance réelle de cette mesure, en milles nautiques (NM) :': 'Actual distance of this measurement, in nautical miles (NM):',
  'Distance invalide.': 'Invalid distance.',
  'Déclinaison magnétique de cette planche, en degrés : Est positif (6 ou 6E), Ouest négatif (-2 ou 2W).\nRecopiez celle de votre mission DCS pour des caps identiques au cockpit. Laissez vide pour le calcul automatique sur carte (WMM2025).': "Magnetic declination of this board, in degrees: East positive (6 or 6E), West negative (-2 or 2W).\nCopy your DCS mission's value for headings identical to the cockpit. Leave empty for the automatic calculation on a map (WMM2025).",
  'Déclinaison illisible : par exemple 6, 6,5, 6E, 2W ou -2 (entre -30 et 30).': 'Unreadable declination: for example 6, 6.5, 6E, 2W or -2 (between -30 and 30).',
  'Échelle automatique : distances et caps viennent de la carte': 'Automatic scale: distances and headings come from the map',
  'Échelle de la planche : 1 NM = {0} px — cliquer pour réétalonner': 'Board scale: 1 NM = {0} px — click to recalibrate',
  'Échelle non étalonnée : mesurez une distance connue avec la règle, puis cliquez': 'Scale not calibrated: measure a known distance with the ruler, then click',
  'Déclinaison saisie pour cette planche — cliquer pour la changer ou revenir au calcul automatique': 'Declination entered for this board — click to change it or go back to the automatic calculation',
  'Déclinaison calculée au centre de la vue par le modèle WMM2025 — cliquer pour saisir celle de votre mission': "Declination computed at the center of the view by the WMM2025 model — click to enter your mission's",
  'Déclinaison inconnue sans carte — cliquer pour la saisir (celle de votre mission DCS)': "Declination unknown without a map — click to enter it (your DCS mission's)",

  /* ---------- kneeboard ---------- */
  'Planche {0} / {1}': 'Board {0} / {1}',
  ' · caps magnétiques, déclinaison {0}{1}': ' · magnetic headings, declination {0}{1}',
  ' (saisie)': ' (entered)',
  ' · caps vrais': ' · true headings',
  'Planche vide : rien à exporter.': 'Empty board: nothing to export.',

  /* ---------- fichier de briefing ---------- */
  "Ce fichier n'est pas un briefing FL Briefing Board": 'This file is not an FL Briefing Board briefing',
  'Ouvrir ce briefing remplace tout le tableau affiché. Continuer ?': 'Opening this briefing replaces the whole board on screen. Continue?',
  'Briefing ouvert : 1 planche': 'Briefing opened: 1 board',
  'Briefing ouvert : {0} planches': 'Briefing opened: {0} boards',

  /* ---------- mission DCS, DTC ---------- */
  'Mission illisible : {0}': 'Unreadable mission: {0}',
  'Vol sans nom': 'Unnamed flight',
  '{0} · {1} ×{2} · 1 point': '{0} · {1} ×{2} · 1 point',
  '{0} · {1} ×{2} · {3} points': '{0} · {1} ×{2} · {3} points',
  '{0} · {1} · {2} vols pilotables': '{0} · {1} · {2} playable flights',
  'Rien à importer : ni vol pilotable, ni menace, ni bullseye': 'Nothing to import: no playable flight, no threat, no bullseye',
  'alt. sol': 'AGL',
  'Mission importée : {0}': 'Mission imported: {0}',
  '1 point de route': '1 waypoint',
  '{0} points de route': '{0} waypoints',
  '{0} menace': '{0} threat',
  '{0} menaces': '{0} threats',
  'bullseye': 'bullseye',
  '1 ravitailleur': '1 tanker',
  '{0} ravitailleurs': '{0} tankers',
  '{0} AWACS': '{0} AWACS',
  ' — théâtre sans projection mesurée : planche sans carte, nord de la grille en haut': ' — theater with no measured projection: board without a map, grid north up',
  "Aucun waypoint sur cette planche : posez la route avant de l'écrire dans la DTC": 'No waypoint on this board: place the route before writing it into the DTC',
  'Théâtre sans projection mesurée : la route ne peut pas être placée dans la mission': 'Theater with no measured projection: the route cannot be placed in the mission',
  'Planche sans repère DCS : importez la mission (⇧ Mission) ou choisissez une carte': 'Board without a DCS reference: import the mission (⇧ Mission) or pick a map',
  'Mission en {0}, planche en {1} : choisissez une mission du même théâtre': 'Mission on {0}, board on {1}: pick a mission on the same theater',
  "Aucun vol F/A-18C pilotable dans cette mission : la DTC n'est écrite que pour le F/A-18C": 'No playable F/A-18C flight in this mission: the DTC is only written for the F/A-18C',
  'DTC non écrite : {0}': 'DTC not written: {0}',
  'DTC de {0} ({1} F/A-18C) : 1 waypoint — cartouche « {2} »': 'DTC of {0} ({1} F/A-18C): 1 waypoint — cartridge “{2}”',
  'DTC de {0} ({1} F/A-18C) : {2} waypoints — cartouche « {3} »': 'DTC of {0} ({1} F/A-18C): {2} waypoints — cartridge “{3}”',
  'Dans la DTC de quel vol ?': "Into which flight's DTC?",
  '{0} · {1} vols F/A-18C — la route de la planche y sera chargée': "{0} · {1} F/A-18C flights — the board's route will be loaded into it",
  "Sélectionnez d'abord un appareil de la vue de dessus (outil Sélection, V)": 'First select an aircraft in the top-down view (Select tool, V)',
  /* erreurs de miz.js, montrées après « Mission illisible : » ou « DTC non écrite : » */
  "ce fichier n'est pas une archive .miz": 'this file is not a .miz archive',
  'archive trop grande (zip64)': 'archive too large (zip64)',
  "compression inconnue dans l'archive": 'unknown compression in the archive',
  "pas de fichier « mission » dans l'archive : ce n'est pas une mission DCS": 'no “mission” file in the archive: this is not a DCS mission',
  'aucun waypoint à écrire': 'no waypoint to write',
  'un numéro de waypoint est en double': 'a waypoint number is duplicated',
  'vol introuvable dans cette mission': 'flight not found in this mission',
  "ce vol n'est pas un F/A-18C : seule sa DTC est écrite": 'this flight is not an F/A-18C: only the F/A-18C DTC is written',
  'chaîne non fermée': 'unclosed string',
  'chaîne longue non fermée': 'unclosed long string',
  '] attendu': '] expected',
  '= attendu': '= expected',
  'valeur attendue': 'value expected',

  /* ---------- présentation ---------- */
  '→ ou Espace : phase suivante · ← : précédente · Échap : sortir': '→ or Space: next phase · ←: previous · Esc: exit',

  /* ---------- démo ---------- */
  'Attaque': 'Attack',
  'DÉPÔT': 'DEPOT',
  'F/A-18C · RDR ATTK en TWS': 'F/A-18C · RDR ATTK in TWS',
  'étoile : L&S, piste prioritaire': 'star: L&S, priority track',
  'losange : DT2, deuxième piste': 'diamond: DT2, second track',
  'briques : contacts bruts (HITS)': 'bricks: raw hits (HITS)',
  'F-16C · FCR en TWS': 'F-16C · FCR in TWS',
  'cercle : cible désignée (bugged)': 'circle: bugged target',
  'jaune : piste TWS · blanc : piste système': 'yellow: TWS track · white: system track',
  'trait sous le carré : cible chaude': 'line under the square: hot target',
};

/* erreurs de miz.js qui portent une valeur */
const EN_PATTERNS = [
  [/^table Lua illisible \((.+), caractère (\d+)\)$/, (m, what, i) => `unreadable Lua table (${tr(what)}, character ${i})`],
  [/^le F\/A-18C numérote ses waypoints de 1 à (\d+)$/, (m, n) => `the F/A-18C numbers its waypoints from 1 to ${n}`],
];

const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
/* le texte dans la langue de l'interface ; {0}, {1}… reçoivent les valeurs passées */
function tr(s, ...v){
  /* une clé à contexte (« cap:V ») rend en français ce qui suit les deux-points */
  const r = LANG === 'en' && own(EN, s) ? EN[s] : s.replace(/^[a-zàâçéèêîôû]+:(?=\S)/, '');
  return v.length ? r.replace(/\{(\d+)\}/g, (m, i) => (i in v ? String(v[i]) : m)) : r;
}
/* un message venu d'ailleurs (miz.js) : traduit s'il est connu, tel quel sinon */
function trMsg(s){
  if (LANG !== 'en') return s;
  if (own(EN, s)) return EN[s];
  for (const [re, f] of EN_PATTERNS){ const m = re.exec(s); if (m) return f(...m); }
  return s;
}

/* la page dans la langue de l'interface : les blocs marqués data-i18n (un texte avec sa
   mise en forme) par leur clé html:, puis chaque texte et chaque info-bulle par son texte */
function localize(root){
  document.documentElement.lang = LANG;
  if (LANG === 'fr') return;
  document.title = tr(document.title);
  const norm = s => s.replace(/\s+/g, ' ').trim();
  for (const el of root.querySelectorAll('[data-i18n]')){
    const k = 'html:' + el.dataset.i18n;
    if (own(EN, k)) el.innerHTML = EN[k];
  }
  for (const el of root.querySelectorAll('[title], [placeholder], [alt], [aria-label]'))
    for (const a of ['title', 'placeholder', 'alt', 'aria-label'])
      if (el.hasAttribute(a) && own(EN, norm(el.getAttribute(a)))) el.setAttribute(a, EN[norm(el.getAttribute(a))]);
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n =>
    n.parentElement && n.parentElement.closest('script, style, noscript, [data-i18n]')
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  for (let n = walk.nextNode(); n; n = walk.nextNode()){
    const k = norm(n.nodeValue);
    if (k && own(EN, k)){
      const [, lead, trail] = /^(\s*)[\s\S]*?(\s*)$/.exec(n.nodeValue);
      n.nodeValue = lead + EN[k] + trail;
    }
  }
}

/* changer de langue : la langue va dans l'adresse (elle tient même sans stockage) et se
   garde pour les prochaines ouvertures ; la page se recharge, le travail est déjà gardé */
function setLang(l){
  try { localStorage.setItem(LANG_KEY, l); } catch(_){}
  const u = new URL(location.href);
  u.searchParams.set('lang', l);
  location.replace(u.href);
}

if (typeof document !== 'undefined') localize(document.body);
if (typeof module !== 'undefined') module.exports = { EN, EN_PATTERNS, pickLang, tr, trMsg, LANG_KEY };
