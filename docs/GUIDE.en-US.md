# User Guide — FL Briefing Board

Everything the board can do, step by step. To start from the project overview, read the
[README](../README.md). The French guide is [GUIDE.md](GUIDE.md).

**Language:** the interface follows your browser's language, English (US) or French. The
**FR** / **EN** button in the toolbar switches it at any time without losing your work,
and your choice is remembered. DCS names (aircraft, weapons, maps, missions) are not
translated.

## Palette — 28 Shapes

| Group | Shapes |
|---|---|
| Aircraft | fighter, bomber, tanker, civilian aircraft, helicopter, AWACS, drone |
| Weapons / Effects | missile, bomb, explosion, splash, ejection, flares |
| Ground / Sea | tank, radar, surface-to-air threat with engagement circle, airfield, ship, carrier, FARP |
| Tactical | friendly, hostile, unknown, auto-numbered waypoint, objective, holding orbit, IP, bullseye |

The four fixed-wing aircraft are intentionally readable at small size: wingspan, sweep,
engine count and default size differ. The tanker carries a boom, the civilian aircraft
has a T-tail, and the bomber has four engines.

Nothing is a bitmap. Every shape is parametric, so it can be rotated, resized and
recolored without quality loss. To add a shape, see [docs/MODELE.md §8](MODELE.md).

## Radar Kit — F/A-18C and F-16C

Two palette groups, **Radar F/A-18C** and **Radar F-16C**, explain each aircraft's
air-to-air radar page. Everything is drawn from the module's ED manual, and every
element cites its page: [RADAR.md](RADAR.md). The two symbologies do not mix: a mark
only goes on a track of its own aircraft.

**F/A-18C — RDR ATTK page**

- **RWS, TWS and STT displays:** the cockpit display, its 20 pushbuttons and their
  labels, the B-scope. A display goes **under** other objects and stays pass-through:
  choose a track, touch the display, and the track lands on it. Dragging while placing
  enlarges it; pin it (📌) so it no longer moves. When selected, `↑` `↓` change the range
  scale (5 to 160 NM) and `←` `→` the azimuth scan, like its pushbuttons.
- **Tracks:** brick (raw hit), friendly, unknown or hostile HAFU, placed in their
  identification color. The placing gesture orients the **heading stem** without
  resizing; the handle rotates and resizes.
- **L&S and DT2** mark a track: choose one, then touch a HAFU — or close to it, the tip
  of its stem is enough —, the star or the diamond is inscribed in it. Touched anywhere
  else, the mark designates a return, as in the cockpit: a brick becomes the HAFU track
  that carries it, the display background gets a new marked unknown track. One L&S and
  one DT2 per board, on two different tracks, as in the aircraft: placing one on the
  other's track swaps them, and the DT2 never replaces the only L&S. Placing a mark again
  on its own track removes it. Never on an F-16C display or track.
- **TDC cursor:** two vertical lines, placed over the designated track or brick.
- Threat rank, speed or altitude of a track go into its label (double-click).

**F-16C — FCR page**

- **FCR RWS and TWS displays:** pushbutton labels, range between its arrows, azimuth
  scan width (`←` `→`: A6, A3, A1, whose limits are drawn), antenna elevation scale,
  horizon line, range marks.
- **Search targets**, hot (line below) or cold (line above).
- **TWS tracks** (yellow) and **system tracks** (white): the whole symbol turns with
  the target's ground track; the placing gesture orients it.
- **Bugged target:** a mark, a circle around the track, one per board. Placed on a
  search target or on the display background, it makes it a bugged system track — a hot
  target keeps its heading, toward the aircraft.
- **A-A cursor**, **jamming** chevrons and **bullseye**.

Prepare radar boards **without a map**: on a map, a display would follow the terrain
as you zoom. The online demo shows two (the "Radar F/A-18C" and "Radar F-16C" boards).

## Importing a DCS Mission

**⇧ Mission**, or drop a `.miz` file on the page: the mission becomes a new board.

- If there are several **playable flights** (groups with a "Client" or "Player"
  aircraft), pick yours in the list.
- The board carries its **route** — numbered waypoints with their name and altitude,
  the flight name on the first —, its coalition's **bullseye**, the **air defences**
  (SAM, AAA, early-warning radars) and the **ships** of both sides, in their side's color
  and under their group name.
- The profile opens with the linked route: the flight profile reads at once. A ground
  altitude (AGL in the editor) is flagged "AGL".
- On theatres whose projection is measured — Caucasus, Syria, Persian Gulf, Sinai,
  Afghanistan, Marianas, Kola —, everything lands **on the map**, to the metre. Elsewhere,
  on a **board without a map** at exact scale, DCS grid north up; its headings then carry
  a "G" (grid).
- Ground units are recognized as air defence by their DCS type; others (tanks,
  trucks…) are not imported.
- AI **tankers** and **AWACS**, recognized by their group's task in the editor
  ("Refueling", "AWACS"), come along too, from both sides: their **route** dashed, their
  **orbit** as a racetrack symbol, and the aircraft attached to it, labelled — "Texaco 11
  · FL200 · TCN 12Y TEX · 251.000". The level is the orbit's, which governs in flight.
  The racetrack is a symbol, not drawn to scale: the mission gives neither a Race-Track's
  width nor a circle's radius, the AI flies them. A Race-Track sits in the middle of its
  leg, from the point carrying the orbit to the next one. Other AI aircraft are not
  imported.

## Loading the Route into the F/A-18C DTC

**⇩ DTC**, then pick the DCS mission (`.miz`) to use as a base: the board's waypoints
are written into the data cartridge (DTC) of the F/A-18Cs of one flight in that
mission. The board hands back a **copy**, `<mission> - FL Briefing.miz`; the original
mission is not modified. The pilot who takes the aircraft starts with the points
loaded, with no third-party tool.

- **Numbers do not change**: waypoint 3 on the board is 3 in the jet (1 to 59). Its
  altitude is the profile's, above sea level, and its label becomes the point's note.
  The points form sequence 1, in number order.
- Several playable F/A-18C flights: pick the one that receives the route.
- **An existing cartridge is the base**: radios, countermeasures, TACAN and navigation
  settings are kept, only the waypoints are replaced. The new cartridge is named
  "*old* - FL Briefing"; the old one stays in the mission. Without a cartridge, the
  flight gets one holding only the waypoints.
- The cartridge is **loaded at start-up** for every F/A-18C in the flight.
- A **DCS reference** is needed: a board on a map, or the board of a mission imported
  without a map (and its phases), and a mission **on the same theatre**.
- Writing again onto the copy replaces the board's cartridge without duplicating it.
- On a server, the mission in rotation is what counts: whoever prepares it puts the copy
  there.
- Only the **F/A-18C** is covered for now.

## Presentation Mode

To lead the briefing over a screen share: **▶ Present** (or `F5`). The board goes full
screen, without toolbar or palette; a discreet tag in the top-right corner shows the
current phase ("2 / 4 · Attack").

- `→`, `Space` or `Page Down`: next phase; `←` or `Page Up`: previous; `Home` and
  `End`: first and last.
- **Moving from one phase to the next is animated**: every aircraft, arrow or area found
  on both boards glides from its old place to the new one — position, heading, color —,
  whatever appears or disappears fades, and the map and linked radar view follow. Build
  the next phase with **+ phase** and move the aircraft there: that is how they are
  recognized from one board to the next. The animation plays between two boards in the
  same frame (same theatre, or both without a map).
- The mouse becomes a **laser pointer**: a red dot follows the cursor, and a left-button
  drag draws a red line that fades out by itself in a second and a half.
- The map still moves: mouse wheel to zoom, right-button drag to pan.
- Nothing can be edited: no tool, no editing shortcut; nothing the laser draws enters
  the board, the undo history or the exports.
- `Esc` leaves, and brings the toolbars back.

## Linked Radar View

The bottom panel shows either the profile or **an aircraft's radar display**, computed
from the top-down board: what the drawn maneuver looks like on the B-scope.

1. Open the profile view (**⊟ Profile**), then pick **RADAR F/A-18C** or **RADAR F-16C**
   in the list that reads **PROFILE**.
2. Select an aircraft on the top-down board, then **◎ Ownship** (the aircraft whose
   radar you read). One ownship per board; its scan cone is drawn dashed on the top-down
   board.
3. Set the **Range** and the azimuth **Scan** in the toolbar.

Every other aircraft on the top-down board becomes a contact, placed by its bearing and
range: move a target or turn the ownship (`←` `→`) and the display follows. On the
F/A-18C a contact is a HAFU whose identification follows its color (red hostile, blue
friendly, anything else unknown); on the F-16C, a TWS track. Its stem or nose line
shows its heading relative to yours.

On the right, each contact is read out: range, bearing, **aspect** in F-16C format (tens
of degrees, L or R side: "9R" beam, "18" nose-on), **hot** or **cold**, and **radial** —
the share of its speed along the line of sight. Near 0 %, the target is beaming: that is
where a Doppler radar may reject it when looking down. Contacts outside the scan or
beyond the range scale are counted.

The view shows geometry; it does not simulate detection. It needs a map or a calibrated
board: without a scale, a message, and nothing made up. The online demo shows one (the
"Interception" board), and the kneeboard carries it under the plan.

## Maps

The selector in the top-right corner offers the **14 DCS theatres**, with topographic,
satellite or road-map backgrounds. A local build can add DCS airfields by name:

```bash
python tools/build_theatres.py --aerodromes
```

The map is live: mouse wheel or pinch to zoom; right-click drag, middle-click drag,
space + drag, or the hand tool (`H`) to pan. Objects stay attached to the terrain, and
scale is automatic: no manual calibration is needed.

**True or magnetic headings:** the **True hdg** / **Mag. hdg** button switches them. Magnetic
declination is computed on the map through NOAA's WMM2025 model. Use the **Decl.**
button to enter the DCS mission declination manually; that value then wins, so displayed
headings match the cockpit. Each heading states its reference: `049°T`, `042°M`.

These are real-world maps of the regions simulated by DCS, not the DCS F10 map. An
Internet connection is required to load map tiles. Without network access, you can still
drag and drop your own background image.

## Gestures

- **Place and orient in one gesture:** choose a shape, press on the board, keep the
  pointer down and drag toward the desired heading. Drag length controls size. A simple
  click places the shape at default size, heading north.
- **Waypoint numbers:** a new waypoint (placed or duplicated) takes the **lowest free
  number** in its view. Delete 2 from a 1-2-3-4 route: the next waypoint is 2, then 5.
  Delete them all and numbering restarts at 1. The others keep their number, so they
  stay those of the imported mission and the DTC.
- **Grab again:** touching an existing shape grabs it without switching tools, including
  by a wingtip. The selection tool (`V`) also grabs arrows, lines and background maps.
  The blue handle rotates and resizes; `←` and `→` rotate by one degree, with `Shift`
  for finer steps.
- **Back to selection:** right-click without moving, or `Esc`. The gesture in progress
  is dropped (an unfinished area, a shape being placed) and the selection tool takes
  over. Dragged, the right button still pans the map. The app opens on the selection
  tool, so a first click on an empty board places nothing.
- **Pin** (📌 or `K`): the selection can no longer be moved, rotated or erased — neither
  by the eraser nor by `Delete`. You place and grab on top of it without disturbing it:
  SAM area, bullseye, background image. Color, line and label stay editable; a
  duplicate is born unpinned. To unpin: selection tool, touch the object, then 📌 or
  `K`. On a map, dragging over a pinned object pans the map.
- **Attach** (🔗 or `J`): a tanker placed on the leg of its racetrack, a track on its
  radar display, stay there. Select the object, 🔗, then touch the symbol that carries
  it — touching the object itself picks the symbol underneath. Once attached, it keeps
  its place on that symbol **at every map zoom** (a symbol keeps its size on screen, so
  what sits on it does too), and follows it when it is moved, rotated or resized,
  heading included. You can still drag or rotate it: it stays attached at its new
  place. 🔗 again detaches it, where it is. When selected, a dotted line joins it to the
  center of its host. A symbol or a text attaches to a symbol; a text can attach to the
  tanker attached to the orbit. A duplicate (`Ctrl+D`) stays attached to the same host;
  deleting the host leaves the object where it is.
- **Label:** double-click a shape, for example `UZI 1-1 · FL250 · 450 kt`. The label
  follows the shape; emptying it removes it.
- **Curve an arrow:** draw it straight, then drag the middle handle.
- **Line styles:** solid = actual, dashed = planned, dotted = threat or uncertain.
- **Hatched area** (`Z`): click vertices, close on the first point or double-click.
  Double-click inside to name it, for example `CAP NORTH` or `SAM MEZ`.
- **Ruler** (`M`): shows distance and heading. Measure a known distance, then use
  **Scale** to switch to NM or km.
- **Measurements** (**📐 Measure**): distance and heading displayed on lines and arrows. Curved
  arrows measure the path, not just the chord. The **NM / km** button changes units.
- **Boards / phases:** one tab per phase: ingress, attack, egress. **+ phase** copies
  the current board; double-click a tab to rename it; `Page Up` / `Page Down` navigate.
- **Profile view** (**⊟ Profile**): split screen with the top-down board above and an altitude
  profile below. Altitudes are in feet, flight levels above 18,000 ft, snapped to
  500 ft. The profile toolbar provides **⛰ Terrain**, **◠ SAM threat** (its dome),
  **▤ Alt. block**, **Ceiling** and **Range**.
- **Linked route:** when enabled, the profile follows top-down waypoints in numerical
  order, using cumulative distance. Drag a waypoint vertically in the profile to set
  altitude; double-click it to type the altitude. The top-down board must have a map
  or a calibrated scale.
- **Recolor:** a color swatch repaints the current selection. The same applies to line
  width.
- Duplicate (`Ctrl+D`), bring to front, double-headed arrow, delete (`Delete`).
- Freehand pencil, line, circle, rectangle and text remain available.
- Background image by drag-and-drop or `Ctrl+V`, resizable, and **kept across
  launches**. The eraser never removes the background image: select it and press
  `Delete`.
- **Save the briefing** (⇩ Briefing, `Ctrl+S`): every board, its settings and its
  images, in a `.json` file. **Open it** (⇧ Open, `Ctrl+O`, or drop the file on the
  page) on another computer, or hand it to the next flight lead: it replaces the board
  on screen, after confirmation. A file that is not a briefing is refused, and the board
  stays as it is.
- **New briefing** (✚ New): the board saves itself in the browser and comes back
  every time you open it. To start from a blank page, ✚ New erases every board and
  its images, after confirmation, and cannot be undone: save first (⇩ Briefing) what you
  want to keep. Unit, true or magnetic heading, background and profile view stay as
  set. **Clear** only empties the board on screen.
- Undo / redo, timestamped PNG export, dark or light background, hideable palette.
- **DCS kneeboard** (⇩ Kneeboard): portrait PNG, 768 × 1157, to copy into
  `Saved Games\DCS\Kneeboard\`. These are the proportions of the in-game kneeboard,
  which stretches any image to its own size: a page with other proportions would come
  out distorted. Without a frame, the page shows the whole board.
- **Frame the kneeboard** (⬚ Frame): a dotted gold frame, with the page's proportions,
  is placed in the middle of the map. Move it by its edge or its title, enlarge it with
  its handle; inside it, you keep working on the map. The export then takes only what
  it contains, across the whole page. One frame per board, copied by "+ phase"; it never
  appears in the PNG or while presenting. A second click on ⬚ Frame removes it. The page
  has not been seen in the cockpit yet.

**Shortcuts:** `V` select · `A` arrow · `L` line · `P` pencil · `C` circle ·
`R` rectangle · `Z` zone · `M` ruler · `T` text · `E` eraser · `H` hand ·
`Ctrl+Z` / `Ctrl+Y` / `Ctrl+D` · `Page Up` / `Page Down` boards · `+` / `-` map zoom ·
`K` pin · `J` attach · `Esc` or right-click: back to selection · `Ctrl+S` save the briefing ·
`Ctrl+O` open one · `F5` present · drop a `.miz`: import the mission.

## What It Does Not Do

No zoom or scrolling without a map: the whiteboard is the screen. No real-time
collaboration. No offline map tiles. No multi-selection or groups. These are design
choices, not omissions; see
[docs/ETAT.md §5](ETAT.md).
