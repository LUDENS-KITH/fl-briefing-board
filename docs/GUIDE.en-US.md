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
`Ctrl+Z` / `Ctrl+Y` / `Ctrl+D` · `Page Up` / `Page Down` boards · `+` / `-` map zoom.

## What It Does Not Do

No zoom or scrolling without a map: the whiteboard is the screen. No real-time
collaboration. No offline map tiles. No multi-selection or groups. Background maps are
not preserved across launches. These are design choices, not omissions; see
[docs/ETAT.md §5](ETAT.md).
