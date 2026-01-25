# 4D Visualisation Experiments Catalog

These QBasic programs prototype ways to visualize 4D rotation using stereoscopic split-screen renderings, mixing wireframe lines with point-sampled edges and brightness cues tied to the W axis. The experiments lean on simple rotation matrices and incremental planar rotations and palette tricks to keep motion legible in 320x350 or 640x480 modes while exploring different cues for depth and hidden structure.

This catalog is descriptive and archival. Program descriptions are based on direct reading of the original source code and comments. No source files were modified.

## Program families

### Tesseract wireframe (stereo)

#### [`archive/bas/four01.bas`](four01.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W carried through rotation only, hand-written LINE wireframe in many colors, no explicit performance delay beyond page flipping (frame rate therefore machine-dependent).
- **Experimental intent:** This version prioritizes explicit edge control by spelling out every edge so each can be colored independently. The stereo split gives depth while the full 4D rotation mixes all six planes. The intent reads as a color-rich baseline before later automation or optimization.
- **Relationship:** Closest to `archive/bas/four03.bas` in structure (all edges visible), but this one is manual-edge and multi-color.

#### [`archive/bas/four02.bas`](four02.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W used to find the minimum-W vertex and suppress its incident edges, loop-generated colored LINE wireframe, no explicit performance delay beyond page flipping.
- **Experimental intent:** The code automates edge drawing and tries a visibility heuristic in 4D by skipping edges connected to the farthest W corner. This is a more algorithmic take on the tesseract with an eye toward hidden-edge handling. It remains unoptimized and color-focused.
- **Relationship:** Conceptual predecessor of `archive/bas/four06.bas`; they are near-duplicates with the same hidden-edge heuristic.

#### [`archive/bas/four03.bas`](four03.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W participates in rotation but is not directly encoded perceptually, monochrome LINE wireframe with center marker, dummy loop delay to stabilize frame pacing.
- **Experimental intent:** This version optimizes the same all-edges view and trades color for speed, then adds a manual pause to keep motion readable on faster hardware. The added center dot pins the rotation visually while the stereo pair retains depth cues. It reads as a stability-oriented refinement.
- **Relationship:** Closest to `archive/bas/four01.bas` (all edges visible) but optimized and monochrome with a frame-delay hack.

#### [`archive/bas/four06.bas`](four06.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W used to pick the minimum-W vertex and skip its incident edges, monochrome LINE wireframe with center marker, dummy loop delay for pacing.
- **Experimental intent:** This keeps the hidden-edge heuristic from the earlier automated version but tightens the code for speed and drops to monochrome. The dummy delay suggests the author wanted consistent playback across machines. It is a deliberate optimization pass rather than a conceptual change.
- **Relationship:** Later optimized version of `archive/bas/four02.bas`; near-duplicate with monochrome palette and pacing loop.

### 3D cube in 4D (mono wireframe)

#### [`archive/bas/four04.bas`](four04.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W held at 0 for a 3D box embedded in 4D (not necessarily equal edge lengths), monochrome LINE wireframe with red center dot, dummy loop delay for pacing.
- **Experimental intent:** The program isolates a 3D rectangular prism and rotates it through 4D space while keeping the center of rotation visible. The explicit center marker makes the 4D-induced motion easier to parse. It feels like a diagnostic model for understanding 3D-in-4D movement.
- **Relationship:** Closest to `archive/bas/four05.bas`; near-duplicate structure with the arrow removed.

#### [`archive/bas/four05.bas`](four05.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W held at 0 for a 3D box embedded in 4D (not necessarily equal edge lengths), monochrome LINE wireframe plus a center-to-face arrow, dummy loop delay for pacing.
- **Experimental intent:** This extends the 3D-in-4D cube by adding a direction arrow from the center to a face normal. The arrow helps track orientation drift as the cube is rotated in 4D. It reads as a visualization aid layered on the same base geometry.
- **Relationship:** Closest to `archive/bas/four04.bas`; near-duplicate with added arrow vector and cube-specific setup.

### W-weighted line and edge experiments

#### [`archive/bas/four14.bas`](four14.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W mapped to palette brightness via WSCALE, point-sampled line using `DOTLINE`, uses or anticipates `SLEEP`-based pacing.
- **Experimental intent:** The code tests a single line segment as a minimal stimulus for 4D rotation while modulating brightness by W depth. Dot-sampling the line makes the gradient explicit rather than relying on solid line drawing. The experiment probes whether W-based luminance aids depth perception.
- **Relationship:** Closest to `archive/bas/four15.bas` through the shared W-to-brightness dotline renderer.

#### [`archive/bas/four15.bas`](four15.bas)

- **Features:** Rotation planes XY/XZ/YZ/XW/YW/ZW, stereo split-screen with small XZ yaw, W mapped to palette brightness (inverted in `DOTLINE`), point-sampled edges for all cube lines, nested delay loops for pacing.
- **Experimental intent:** This scales the W-brightness idea to a full 4D cube by drawing edges as dot sequences whose intensity encodes W position. It sacrifices solid lines to make depth gradients visible along each edge. The delay loops suggest careful tuning for viewing comfort.
- **Relationship:** Closest to `archive/bas/four14.bas`; same dotline technique applied to a full tesseract.

### 4D sphere point cloud

#### [`archive/bas/four16.bas`](four16.bas)

- **Features:** Precomputed cumulative rotations in all planes to build a point set (not analytic sampling), runtime rotation only in XW, stereo by XZ yaw with left/right viewports, W < 0 points culled, colored point cloud using palette cycling.
- **Experimental intent:** The program precomputes a dense set of 4D points and then spins them only in the XW plane to highlight that specific rotation. Stereo and color cycling make the resulting point cloud legible despite heavy overplotting. The W cull implies an experiment in simplifying visibility for the observer.
- **Relationship:** No strong direct counterpart in this set.
