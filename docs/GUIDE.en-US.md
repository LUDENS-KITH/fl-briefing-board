# User Guide — FL Briefing Board

Everything the board can do, step by step. To start from the project overview, read the
[README](../README.md). The French guide is [GUIDE.md](GUIDE.md).

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
- **L&S and DT2** are not objects but a track state: choose one, then touch a HAFU — the
  star or the diamond is inscribed in it. One L&S and one DT2 per board, as in the
  aircraft; placing the same mark on the same track removes it.
- **TDC cursor:** two vertical lines, placed over the designated track or brick.
- Threat rank, speed or altitude of a track go into its label (double-click).

**F-16C — FCR page**

- **FCR RWS and TWS displays:** pushbutton labels, range between its arrows, azimuth
  scan width (`←` `→`: A6, A3, A1, whose limits are drawn), antenna elevation scale,
  horizon line, range marks.
- **Search targets**, hot (line below) or cold (line above).
- **TWS tracks** (yellow) and **system tracks** (white): the whole symbol turns with
  the target's ground track; the placing gesture orients it.
- **Bugged target:** a mark, a circle around the track, one per board.
- **A-A cursor**, **jamming** chevrons and **bullseye**.

Prepare radar boards **without a map**: on a map, a display would follow the terrain
as you zoom. The online demo shows two (the "Radar F/A-18C" and "Radar F-16C" boards).

## Linked Radar View

The bottom panel shows either the profile or **an aircraft's radar display**, computed
from the top-down board: what the drawn maneuver looks like on the B-scope.

1. Open the profile view (⊟), then pick **RADAR F/A-18C** or **RADAR F-16C** in the
   toolbar list.
2. Select an aircraft on the top-down board, then **◎ Porteur** (radar carrier). One
   carrier per board; its scan cone is drawn dashed on the top-down board.
3. Set the **range** and **azimuth scan** in the toolbar.

Every other aircraft on the top-down board becomes a contact, placed by its bearing and
range: move a target or turn the carrier (`←` `→`) and the display follows. On the
F/A-18C a contact is a HAFU whose identification follows its color (red hostile, blue
friendly, anything else unknown); on the F-16C, a TWS track. Its stem or nose line
shows its heading relative to yours.

On the right, each contact is read out: range, bearing, **aspect** in F-16C format (tens
of degrees, L or R side: "9D" beam, "18" nose-on), **hot** or **cold**, and **radial** —
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

**True or magnetic headings:** use the **True / Mag. heading** button. Magnetic
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
- **Label:** double-click a shape, for example `UZI 1-1 · FL250 · 450 kt`. The label
  follows the shape; emptying it removes it.
- **Curve an arrow:** draw it straight, then drag the middle handle.
- **Line styles:** solid = actual, dashed = planned, dotted = threat or uncertain.
- **Hatched area** (`Z`): click vertices, close on the first point or double-click.
  Double-click inside to name it, for example `CAP NORTH` or `SAM MEZ`.
- **Ruler** (`M`): shows distance and heading. Measure a known distance, then use
  **Scale** to switch to NM or km.
- **Measurements** (📐): distance and heading displayed on lines and arrows. Curved
  arrows measure the path, not just the chord. The **NM / km** button changes units.
- **Boards / phases:** one tab per phase: ingress, attack, egress. **+ phase** copies
  the current board; double-click a tab to rename it; `Page Up` / `Page Down` navigate.
- **Profile view** (⊟): split screen with the top-down board above and an altitude
  profile below. Altitudes are in feet, flight levels above 18,000 ft, snapped to
  500 ft. The profile toolbar provides **terrain**, **SAM threat dome**, **altitude
  block**, ceiling and range controls.
- **Linked route:** when enabled, the profile follows top-down waypoints in numerical
  order, using cumulative distance. Drag a waypoint vertically in the profile to set
  altitude; double-click it to type the altitude. The top-down board must have a map
  or a calibrated scale.
- **Recolor:** a color swatch repaints the current selection. The same applies to line
  width.
- Duplicate (`Ctrl+D`), bring to front, double-headed arrow, delete (`Delete`).
- Freehand pencil, line, circle, rectangle and text remain available.
- Background image by drag-and-drop or `Ctrl+V`, resizable. The eraser never removes
  the background image: select it and press `Delete`.
- Undo / redo, timestamped PNG export, dark or light background, hideable palette.
- **DCS kneeboard:** portrait PNG, 768 × 1024, to copy into
  `Saved Games\DCS\Kneeboard\` (not yet verified in DCS).

**Shortcuts:** `V` select · `A` arrow · `L` line · `P` pencil · `C` circle ·
`R` rectangle · `Z` zone · `M` ruler · `T` text · `E` eraser · `H` hand ·
`Ctrl+Z` / `Ctrl+Y` / `Ctrl+D` · `Page Up` / `Page Down` boards · `+` / `-` map zoom ·
`K` pin · `Esc` or right-click: back to selection.

## What It Does Not Do

No zoom or scrolling without a map: the whiteboard is the screen. No real-time
collaboration. No offline map tiles. No multi-selection or groups. Background maps are
not preserved across launches. These are design choices, not omissions; see
[docs/ETAT.md §5](ETAT.md).
