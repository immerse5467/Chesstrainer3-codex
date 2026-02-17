# Chess Opening Trainer — Codebase Documentation

> **Exhaustive reference for humans and LLM coding agents.**
> Every implemented feature, how it works in code, and where to find it.
> Last updated: 2026-02-17

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Build System & Deployment](#build-system--deployment)
3. [File Map](#file-map)
4. [Tech Stack](#tech-stack)
5. [Game Modes & Flow](#game-modes--flow)
6. [3D Scene & Rendering](#3d-scene--rendering)
7. [Lighting System](#lighting-system)
8. [Materials & Textures](#materials--textures)
9. [Chess Piece Geometry](#chess-piece-geometry)
10. [Environment Geometry](#environment-geometry)
11. [Interaction System](#interaction-system)
12. [Animation System](#animation-system)
13. [Audio System](#audio-system)
14. [Particle System](#particle-system)
15. [UI Components](#ui-components)
16. [Opening Database](#opening-database)
17. [Spaced Repetition (FSRS)](#spaced-repetition-fsrs)
18. [Persistence (IndexedDB)](#persistence-indexeddb)
19. [Progress Dashboard](#progress-dashboard)
20. [Mobile Support](#mobile-support)
21. [Post-Processing Pipeline](#post-processing-pipeline)
22. [Known Issues & Polish Needed](#known-issues--polish-needed)
23. [Coordinate System Reference](#coordinate-system-reference)

---

## PROJECT OVERVIEW

A chess opening trainer where the player plays as Black, responding to White's
moves. Features a 3D chessboard inside a Japanese-style limousine, rendered in
an Okami HD / Spirited Away / sumi-e aesthetic. Three game modes: Learn
(untimed), Challenge (timed, 10 rounds), and Spaced Review (FSRS-5 algorithm).

The app is designed to export as a **single self-contained HTML file** that
opens directly in Chrome from the filesystem (no server needed). All assets
are procedurally generated — no image files, no audio files.

---

## BUILD SYSTEM & DEPLOYMENT

### Critical Build Command

```bash
npm run export
```

This runs `vite build && node scripts/bundle-single.js`. It:
1. Builds the React app with Vite (IIFE format, single chunk)
2. Bundles the built JS + CSS into a single `chess-trainer.html` file
3. Runs 4 verification checks (no stray `</script>`, root div before script, no module type, no external src)

**CRITICAL**: You MUST run `npm run export` (not just `npm run build`) after
EVERY code change to update `chess-trainer.html`. The HTML file IS the
deliverable — it's what the user opens to play.

### Build Details

- `vite.config.js`: IIFE output format, single chunk (`inlineDynamicImports: true`), no module scope
- `scripts/bundle-single.js`: Reads `dist/` output, escapes `</script>`, assembles final HTML with proper DOCTYPE, charset, viewport meta, safe-area padding, and inline styles
- Output: `chess-trainer.html` (~1.1 MB) at project root
- Build target: ES2020 + Safari 15 + Chrome 90

### Development

```bash
npm run dev    # Start Vite dev server (hot reload)
npm run build  # Build to dist/ (but doesn't create chess-trainer.html)
npm run export # Build + bundle into chess-trainer.html
```

---

## FILE MAP

```
src/
  App.jsx                    # Main app: game state, screens, timer, hints, scoring
  components/
    ui.jsx                   # All React UI components (1015 lines)
  engine/
    ChessScene.js            # Three.js scene: board, pieces, camera, lights, animation (708 lines)
    pieces.js                # Piece geometry (LatheGeometry) + materials (453 lines)
    environment.js           # Limo interior geometry + materials (281 lines)
    textures.js              # All procedural textures (267 lines)
    postprocessing.js        # Empty stub — renders directly, no passes (28 lines)
    shaders.js               # Empty stub — custom shaders deleted (8 lines)
    particles.js             # Ink splash GPU particle system (168 lines)
  audio/
    AudioManager.js          # All procedural audio via Tone.js (223 lines)
  data/
    openings.js              # 80 positions across 19 opening families (1240 lines)
    chess.js                 # FEN parser (26 lines)
  learning/
    fsrs.js                  # FSRS-5 spaced repetition scheduler (93 lines)
    db.js                    # IndexedDB persistence layer (291 lines)
scripts/
  bundle-single.js           # Single-file HTML bundler (119 lines)
chess-trainer.html           # THE DELIVERABLE — single-file game
Archived_Notes.md            # Design vision, colour palette, phase history
TODO.md                      # Master plan + next phase
CODEBASE.md                  # This file
```

---

## TECH STACK

| Package | Version | Purpose |
|---------|---------|---------|
| react / react-dom | 19.2.4 | UI framework |
| three | 0.182.0 (r182) | 3D rendering |
| tone | 15.1.22 | Procedural audio synthesis |
| vite | 7.3.1 | Build tool |
| tailwindcss | 4.1.18 | CSS utility framework |
| @vitejs/plugin-react | 5.1.3 | React JSX transform |

**No image files. No audio files. Everything procedural.**

---

## GAME MODES & FLOW

### State Machine (App.jsx)

```
screen: 'menu' → 'playing' → 'gameover' → 'menu'
                                ↑
screen: 'menu' → 'progress' → 'menu'
```

### Screens

1. **Menu** (`StartScreen`): Opening selector, 3 mode buttons, high score, fullscreen, progress link
2. **Playing**: 3D board + HUD overlay (nav, stats, prompt, hints, feedback, explanation)
3. **Game Over** (`GameOverScreen`): Score/rounds/streak summary, play again / menu
4. **Progress** (`ProgressDashboard`): 4-tab analytics (Overview, Openings, History, Data)

### Game Modes

| Mode | Component | Timer | Rounds | Scoring | SRS |
|------|-----------|-------|--------|---------|-----|
| **Learn** | Untimed | No | Unlimited (voluntary end) | No | No |
| **Challenge** | Timed (25s/move) | Yes, 100ms ticks | 10 rounds | Yes (100 + time bonus + streak bonus - hint penalty) | No |
| **Spaced Review** | Untimed | No | Until due cards exhausted | No | Yes (FSRS-5, grade 1-4) |

### Round Flow (App.jsx)

1. Position loaded from shuffled queue → FEN parsed → pieces rendered
2. Player clicks piece (must be Black) → valid moves highlighted green
3. Player clicks destination:
   - Correct: chime + ink splash + feedback flash + show correct move (blue) + explanation panel
   - Wrong: error tone + camera shake + streak reset + show correct move (blue) + explanation panel + position re-queued (Learn/Challenge only)
4. After explanation dismissed → next round (or FSRS grade buttons first in Review mode)
5. Challenge: game ends after 10 rounds. Learn: player can leave anytime via home button.

### Hint System (App.jsx lines 375-412)

- **Hint Level 0**: Prompt + shortTip shown
- **Hint Level 1** (after 4s learn / 8s challenge): Correct piece highlighted gold, "Try the golden piece!" message
- **Hint Level 2** (after 8s learn / 14s challenge): Target square highlighted cyan, "Move to the blue square!" message
- Using hints reduces score in Challenge mode: -25 per hint level

### Scoring (Challenge Mode Only)

```
points = 100 + floor(timeLeft * 4) + streak * 12 - hintLevel * 25
minimum = 10
```

Streak bonus at multiples of 5: ascending chime arpeggio.

---

## 3D SCENE & RENDERING

### ChessScene.js — Constructor & Init

- **Renderer**: WebGLRenderer, antialias on desktop only, pixel ratio capped at 1.5
- **Camera**: PerspectiveCamera, FOV 38, position (0, 6, 5.8), lookAt (0, 0, 0.3)
  - Portrait mode (aspect < 0.8): FOV 55, position (0, 10, 9)
- **Scene background**: `0x0e0c14` (near-black dark blue)
- **Shadows disabled** (`shadowMap.enabled = false`)

### Board Creation (ChessScene.js lines 159-208)

- 64 squares: PlaneGeometry (0.535 x 0.535), sqSize = 0.56 spacing
- Light squares: `0xd4c4a0`, roughness 0.85, parchment texture map
- Dark squares: `0x5a4030`, roughness 0.80, sumi-brown texture map
- Both have emissive glow (see Lighting)
- Table: BoxGeometry 6.2 x 0.1 x 6.2, wood grain texture
- Border: BoxGeometry 5.0 x 0.06 x 5.0, wood grain texture

### Labels (ChessScene.js lines 210-258)

- File labels (a-h) and rank labels (1-8)
- 128x128 CanvasTexture, Georgia serif font, `#ffcc35` rich amber-gold
- MeshBasicMaterial (self-emissive, unaffected by lights, `fog: false`)
- Positioned at board border margin (2.37 units from center)

### Piece Placement

- Pieces positioned via `setPieces(piecesData)` from FEN parse
- Position formula: `x = (file - 3.5) * 0.56`, `z = (rank - 3.5) * 0.56`, `y = 0.06`
- Black knights rotated 180° (`Math.PI`) to face opponent
- Stored in `this.pieces` Map keyed by `"file-rank"`

---

## LIGHTING SYSTEM

5-layer lighting system with 13 lights + 2 emissive layers. All controllable
via in-game lighting panel (LightingPanel component in ui.jsx).

### Light Inventory

| # | Type | Colour | Default Intensity | Position | Max | Purpose |
|---|------|--------|-------------------|----------|-----|---------|
| 1 | HemisphereLight | sky 0xe8dcc8 / gnd 0x3a3a4a | 1.00 | n/a | 2.0 | Cosy ambient base |
| 2 | SpotLight | 0xfff0d0 | 15.0 | (0, 4.0, 0.3) → (0, 0, 0.3) | 25.0 | Reading lamp (hero light) |
| 3 | PointLight | 0xf0ecff | 5.0 | (0, 3.5, 5.5) | 10.0 | Camera fill (low angle) |
| 4 | PointLight | 0xf0ecff | 5.0 | (0, 5.0, 3.5) | 10.0 | Camera fill (steep angle) |
| 5-6 | PointLight x2 | 0xff9030 | 2.0 | (±5.5, 1.5, -5.0) | 5.0 | Stationary lanterns (back corners) |
| 7-12 | PointLight x6 | 0xffaa40 | 0.50 | (±5.9, 1.5, scroll) | 5.0 | Passing lanterns (scroll along Z) |

**Emissive Layers** (not lights — material properties):

| Layer | Emissive Colour | Default Intensity | Max | Applied To |
|-------|----------------|-------------------|-----|-----------|
| Board glow | light: 0x8a7a60 / dark: 0x3a2818 | 0.22 | 1.0 | All 64 board squares |
| Piece glow | white: 0x9a8a70 / black: 0x3a2818 | 0.20 | 1.0 | All chess piece meshes |

### Dynamic Light Effects (animate loop)

- **Stationary lantern flicker**: Multi-frequency sine wave (7.3, 13.1, 23.7 Hz), modulates base intensity, floor at 0.85 (ChessScene.js lines 644-653)
- **Passing lantern scroll**: Lanterns move along Z at 1.2 units/sec, wrap at ±7.5, fade in/out at ends. Simulates streetlights passing as limo drives. (ChessScene.js lines 656-690)

### Lighting Control Panel (ui.jsx LightingPanel)

- 8 parameters: Ambient, Lamp, Fill, Fill 2, Lanterns, Passing, Brd Glow, Pc Glow
- Each row: label + max value in brackets + OFF button + `-` button + numeric input + `+` button + MAX button
- OFF = sets to 0, MAX = sets to maximum, +/- uses step size per parameter
- Panel: 250px wide, positioned absolute top-right from stats bar
- API: `sceneRef.current.getLightIntensities()` / `setLightIntensity(key, value)`

---

## MATERIALS & TEXTURES

### Texture Generation (textures.js)

All textures are 512x512 Canvas-based, procedurally generated. No image files.
Uses custom FBM (fractal Brownian motion) noise, directional noise, and hash-based smooth noise.

**Critical Rule**: Textures are "variation-only" (values 0.7-1.0). `material.color`
handles actual hue. Three.js multiplies: `final = color × texture × light`.
Dark absolute values in textures caused catastrophic darkening (learned in Phase D v1).

**Critical Rule for Flat Surfaces**: On PlaneGeometry/BoxGeometry, UV spans 0-1
across the entire face. Noise frequency 3 = only 3 bumps = invisible grain.
Need freq 30-50 for visible pixel-level grain at 4K resolution.

| Texture Function | Used By | Freq Range | Value Range | Key Character |
|-----------------|---------|------------|-------------|---------------|
| `createWhiteWashiTexture()` | White pieces | 3-16 | 0.88-1.0 | Subtle washi paper fibre |
| `createBlackSumiTexture()` | Black pieces | 2-14 | 0.70-1.0 | Warm ink-wash variation |
| `createParchmentTexture()` | Light board squares | 6-50 | 0.82-1.0 | Fine paper grain + age patches |
| `createSumiBrownTexture()` | Dark board squares | 5-45 | 0.78-1.0 | Ink grain + directional streaks |
| `createWoodGrainTexture(amp)` | Table, border, frames | 4-40 | (1-amp)-1.0 | Ring pattern + fine grain |
| `createShojiWashiTexture()` | Shoji panels | 6-50 | 0.82-1.0 | Fibre bundles + fine grain |
| `createFabricWeaveTexture()` | Bench cushions | 8-TEX_SIZE | 0.70-1.0 | Crosshatch weave + organic noise |
| `createTatamiTexture()` | Tatami mats | 4-TEX_SIZE | 0.72-1.0 | Rush lines + strand variation |
| `createFloorTexture()` | Floor | 12-35 | 0.78-1.0 | Plank seam lines + wood grain |

### Toon Gradient Ramps (textures.js)

4-step RGBA DataTextures with NearestFilter (creates discrete toon banding):

- **White ramp**: [0.35,0.32,0.28] → [0.52,0.48,0.42] → [0.76,0.72,0.64] → [1.0,0.97,0.90]
- **Black ramp**: [0.40,0.36,0.30] → [0.58,0.52,0.44] → [0.78,0.72,0.62] → [1.0,0.94,0.82]

**Critical**: Must use `THREE.RGBAFormat` (not LuminanceFormat — broken in r182 WebGL2 `texStorage` path). Must set NearestFilter min+mag, `generateMipmaps: false`.

### Piece Materials (pieces.js)

- **MeshToonMaterial** — inherits from Phong, responds to scene lights, provides toon banding
- `gradientMap`: white or black gradient ramp
- `map`: white washi or black sumi noise texture
- `emissive`: white 0x9a8a70 / black 0x3a2818, intensity 0.20
- Textures cached: created once, shared across all instances

### Environment Materials (environment.js)

All **MeshStandardMaterial** with procedural texture maps:

| Material | Colour | Roughness | Texture | Special |
|----------|--------|-----------|---------|---------|
| darkWood | 0x3a2820 | 0.80 | Wood grain (amp 0.12) | |
| richPanel | 0x4a3528 | 0.75 | Wood grain (amp 0.12) | |
| shoji | 0xc8bc98 | 0.95 | Shoji washi | emissive 0x302818 @ 0.05 |
| frame | 0x2e2018 | 0.70 | Wood grain (amp 0.10) | |
| floor | 0x1a1410 | 0.85 | Floor plank | |
| tatami | 0x8a7a58 | 0.90 | Tatami rush | |
| cushion | 0x6a2828 | 0.90 | Fabric weave | |
| ceiling | 0x2a2420 | 0.80 | Wood grain (amp 0.12) | |
| bench | 0x3a2820 | 0.80 | Wood grain (amp 0.12) | |
| wainscot | 0x3a2820 | 0.75 | Wood grain (amp 0.12) | |
| shojiBacking | 0x080604 | — | None | MeshBasicMaterial, opacity 0.6 |

---

## CHESS PIECE GEOMETRY

### Piece Types (pieces.js)

All pieces use **LatheGeometry** from Catmull-Rom smoothed profiles. 32 lathe segments.
Geometry cached in `geoCache` — computed once per type, reused for all instances.

| Piece | Main Geometry | Additional Parts | Outline |
|-------|--------------|-----------------|---------|
| **Pawn** | LatheGeometry (17 control points, 32 resolution) | None | Main body only |
| **Rook** | LatheGeometry (16 points, 28 res) | 4 box merlons (0.10³) at y=0.61 | Main body only |
| **Bishop** | LatheGeometry (19 points, 32 res) | Mitre slit (thin box, rotated 30°) + finial sphere (r=0.04) | Main body only |
| **Knight** | LatheGeometry base (7 points) | Cylinder neck + box head + sphere top + box snout + box jaw + 2 cone ears + box mane (8 sub-parts) | Base only (sub-parts skip outlines to avoid distortion) |
| **Queen** | LatheGeometry (18 points, 36 res) | 8 cone crown spikes + sphere orb | Main body only |
| **King** | LatheGeometry (18 points, 36 res) | Cross: vertical bar (0.06x0.20x0.06) + horizontal bar (0.18x0.06x0.06) | Main body only |

### Ink Outlines (Inverted Hull Method)

- Outline geometry: clone of source geo, vertices pushed outward along normals by 0.025
- Material: MeshBasicMaterial, BackSide rendering, dark colour (white: 0x1a1008, black: 0x0a0804)
- **Only applied to main body lathe geometries** — sub-parts (knight head boxes, king cross, queen crown, rook crenellations) skip outlines to prevent distortion from overlapping parts
- Outline geometries cached via WeakMap

### Selection Appearance

- Selected piece: colour changed to 0x50b860 (green) via `updatePieceAppearance()`
- Outline meshes (BackSide) are skipped during colour updates

---

## ENVIRONMENT GEOMETRY

### Limo Interior (environment.js)

**Floor**: 18x18 plane at y=-1.2 + 8x8 tatami at y=-1.1

**Table**: 6.2x0.1x6.2 surface + 4 legs (0.12x1.0x0.12) + 6.4x0.05x6.4 edge trim + 4 aprons (front/back/left/right)

**Side Walls** (x = ±6.0, 12 units deep):
- Wainscoting: 0.08 thick, 1.5 tall lower wall
- Divider rail: 0.12 thick, 0.08 tall at y=0.45
- Shoji panels: 0.06 thick, 2.0 tall, 11.5 wide, with dark backing (0.02 thick, opacity 0.6) behind
- Frame posts: 0.15x2.2x0.15 at front/back corners
- 4 vertical dividers at z = -3.6, -1.2, 1.2, 3.6
- 4 horizontal bars at y = 0.9, 1.3, 1.7, 2.1
- Top rail at y=2.55

**Back Wall** (z = -7.0):
- Lower panel: 12.0x1.5x0.08 rich wood
- Shoji screen: 11.5x2.5x0.06 with dark backing
- Bottom/top rails, left/right/inner vertical frames, 4 horizontal bars

**Benches** (x = ±5.0): 2.5x0.15x7.0 wood platform + 2.0x0.12x6.5 cushion

**Ceiling**: 14x0.2x16 at y=6 + beam 12x0.15x0.2 at y=5.85, z=-2.0

---

## INTERACTION SYSTEM

### Unified Pointer Events (ChessScene.js lines 445-565)

Supports both click and drag-and-drop on desktop and mobile:

1. **pointerdown**: Raycast to find piece under pointer. If found, start potential drag. Capture pointer.
2. **pointermove**: If drag distance > 6px, enter drag mode. Fire selection callback. Move piece mesh along board plane (y=0.4, elevated above board).
3. **pointerup**:
   - If was dragging: snap piece back to original position, find square under pointer, fire move callback
   - If was click (no drag): fire piece-click or square-click callback
4. **pointercancel**: Snap piece back, clean up state

**Raycasting**:
- `_hitPiece()`: Intersects all piece groups (recursive), walks up parent chain to find userData
- `_hitSquare()`: Intersects flat square meshes

**Board Plane**: `THREE.Plane(Vector3(0,1,0), -0.06)` — used for dragging projection

---

## ANIMATION SYSTEM

### Piece Move Animation (ChessScene.js lines 302-329, 597-612)

- Cubic ease-in-out: `t < 0.5 ? 4t³ : 1 - (-2t+2)³/2`
- Duration: ~0.42s (progress += delta * 2.4)
- Arc: piece rises to peak y=0.34 (sin curve) during move
- Callback fired on completion (triggers correct/wrong logic)

### Camera Shake (ChessScene.js lines 614-622)

- Triggered on wrong answer: `cameraShake = 0.28`
- Decays: `cameraShake -= delta * 1.5`
- Random displacement: `± shake * 0.06` on x and y

### Car Sway (ChessScene.js line 625-626)

- Subtle camera roll: `sin(time * 0.4) * 0.003` radians on Z
- Continuous — creates illusion of vehicle movement

### Drag Wobble (ChessScene.js lines 638-642)

- While piece is being dragged: vertical bob `0.4 + sin(t*4) * 0.03` and yaw sway `sin(t*3) * 0.06`

### Square Colour Pulsing (ChessScene.js lines 628-635)

- Throttled to ~15fps (0.066s interval) to avoid unnecessary work
- Only active when hints, selection, or correct-move arrows are showing
- Pulse function: `0.5 + 0.5 * sin(time * 4)`

---

## AUDIO SYSTEM

### AudioManager (AudioManager.js)

All sound synthesis via Tone.js — no audio files.

**Instruments**:

| Synth | Type | Purpose | Volume |
|-------|------|---------|--------|
| pad | PolySynth(triangle) | Ambient chord pads | -24 dB |
| pluck | PluckSynth | Koto-like melody | -14 dB |
| bell | MetalSynth | Temple bell (rin) | -26 dB |
| woodBlock | MembraneSynth | UI click sounds | -10 dB |
| chime | PolySynth(sine) | Success/streak chimes | -14 dB |
| errorSynth | Synth(triangle) | Wrong answer tone | -18 dB |
| shamisen | PluckSynth | Low-register sparse accents | -18 dB |

**Signal Chain**: All synths → hiPass (80Hz) → reverb (3.0s decay, 0.35 wet) → destination

**Scale**: Japanese in-sen: D, Eb, G, A, C (extended D3-D5)

**Background Music** (48 BPM):
- Pad chords: 4 chords cycling every 2 measures, 15% velocity
- Koto melody: Pre-composed phrases (8 phrases of 4 notes), 70% play probability, stepwise motion
- Shamisen: Random low-register notes, 40% probability, every whole note
- Temple bell: Very sparse, 30% probability, every 4 measures

**Sound Effects**:

| Event | Method | Sound |
|-------|--------|-------|
| Click (deselect) | `click()` | Wood block G4 64th |
| Pickup piece | `pickup()` | Wood block C5 32nd |
| Place piece | `place()` | Wood block E4 16th |
| Correct answer | `correct()` | D4→A4→D5 ascending chime (150ms apart) |
| Wrong answer | `wrong()` | Eb3 triangle 8th note |
| Hint appear | `hint()` | D5 temple bell, 30% velocity |
| Streak (×5) | `streak()` | D4→G4→A4→C5→D5 rapid ascending chime (70ms apart) |
| Ink splash | `inkSplash()` | G5 temple bell, 18% velocity |
| Music start | `startMusic()` | Starts all 4 music loops |
| Music stop | `stopMusic()` | Stops transport, disposes loops |

---

## PARTICLE SYSTEM

### InkSplashSystem (particles.js)

GPU-accelerated sumi-ink particle burst on correct answers.

- **80 particles** per burst, 1.5s lifetime
- Custom vertex + fragment shaders (ShaderMaterial)
- Burst upward and outward from piece position, gravity -4.0
- Particle shape: circle with irregular wobble edges (sine distortion), creating ink-splatter look
- Colour: mix of dark sumi ink `(0.05, 0.03, 0.02)` with red/blue accent per seed
- Particles grow as they age (ink spreading effect)
- Air resistance on horizontal velocity (0.98 damping)
- Alpha fades with lifetime and distance from center

---

## UI COMPONENTS

### Component Inventory (ui.jsx)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `BrainButton` | 20-50 | Styled button (primary/success/secondary/danger variants, sm/md/lg sizes) |
| `PaperTexture` | 53-64 | SVG fractal noise overlay at 5% opacity (washi paper feel on menus) |
| `PortraitWarning` | 67-115 | Full-screen overlay on mobile portrait — shows rotate icon + message |
| `ChessBoard` | 118-139 | Wrapper for Three.js scene — creates ChessScene, syncs React state to 3D |
| `JapaneseHouseIcon` | 146-168 | Custom SVG: curved Japanese roof, shoji door, eave extensions |
| `FullscreenButton` | 171-220 | Toggle fullscreen via Fullscreen API (shows expand/collapse icon) |
| `GameNav` | 223-250 | Top-left during gameplay: home button + fullscreen + mode label + opening name |
| `LightingPanel` | 253-349 | Collapsible dropdown: 8 light controls with OFF/MAX/+/-/numeric input |
| `StatsBar` | 348-380 | Top-right during gameplay: score/streak/round display + lighting panel |
| `PromptBar` | 383-431 | Bottom during gameplay: question prompt + timer bar + hint messages |
| `Feedback` | 440-457 | Full-screen flash: "Correct" (green) or "Not quite" (red), 450ms duration |
| `Explanation` | 462-511 | Bottom sheet (desktop) / full-screen (mobile): move explanation + continue button / FSRS grade buttons |
| `StartScreen` | 517-624 | Main menu: opening selector dropdown, 3 mode buttons, high score, progress link |
| `GameOverScreen` | 630-688 | Results: score/rounds/streak, "New High Score!" flash, play again / menu |
| `ProgressDashboard` | 712-1005 | 4-tab analytics: Overview (stats + mastery + weak spots), Openings (per-opening detail), History (session log), Data (export/import/reset) |
| `StatCard` | 1007-1014 | Small stat display card for dashboard |

### Styling

- Font: Georgia, "Times New Roman", serif
- Colour scheme: warm dark browns (#1e1610, #0e0c0a), gold accents (#ffd050, #d4a850), cream text (#ede4d0)
- Tailwind 4 utility classes with custom colour values
- Panel style: dark gradient background, 2px warm brown border, rounded-2xl, inner glow shadow
- Buttons: lacquerware-style gradient, 2px border, shadow, active scale+translate feedback

---

## OPENING DATABASE

### Structure (openings.js)

80 positions across 19 opening families. Player is always Black.

**Opening Families**:
1. The Sicilian Defence (5+ positions)
2. The Italian Game
3. The Ruy Lopez
4. The Caro-Kann Defence
5. The French Defence
6. The Queen's Gambit Declined
7. The Slav Defence
8. The King's Indian Defence
9. The Nimzo-Indian Defence
10. The Grünfeld Defence
11. The Scotch Game
12. The Petroff Defence
13. The King's Gambit
14. The Pirc Defence
15. The English Opening
16. The Dutch Defence
17. The Benoni Defence
18. The Scandinavian Defence
19. The Alekhine Defence

### Position Data Structure

```javascript
{
  id: 'sicilian-1',              // Unique ID for FSRS card tracking
  fen: "rnbqkbnr/...",           // FEN string (board position)
  prompt: "White has pushed...",  // Question shown to player
  correct: [{                    // Array of correct moves
    from: [2, 6],                // [file, rank] source
    to: [2, 4]                   // [file, rank] destination
  }],
  san: "1...c5",                 // Standard algebraic notation
  moveNotation: "c7 → c5",      // Human-readable notation
  hintPiece: [2, 6],            // [file, rank] for hint level 1 (gold highlight)
  hintSquare: [2, 4],           // [file, rank] for hint level 2 (cyan highlight)
  shortTip: "Push your c-pawn!", // Brief hint shown initially
  explanation: "This is...",     // Multi-paragraph explanation shown after move
  opening: "The Sicilian Defence" // Opening family name
}
```

### FEN Parser (chess.js)

- `parseFEN(fen)` → array of `{ type, color, file, rank }`
- Rank 7 in FEN = chess rank 8 (Black's back rank)
- Uppercase = white, lowercase = black
- Piece type mapping: K=king, Q=queen, R=rook, B=bishop, N=knight, P=pawn

---

## SPACED REPETITION (FSRS)

### FSRS-5 Algorithm (fsrs.js)

Implementation of the Free Spaced Repetition Scheduler (Anki's latest algorithm).

- 17 pre-tuned weights (w[0]..w[16])
- Request retention: 0.9 (90% recall target)
- Maximum interval: 36,500 days

### Card States

`new` → `learning` (grade 1) or `review` (grade 2-4) → `relearning` (lapse) → `review`

### Grading (Explanation panel in Review mode)

| Grade | Button | Meaning |
|-------|--------|---------|
| 1 | Again | Forgot — reset to learning |
| 2 | Hard | Difficult recall |
| 3 | Good | Normal recall |
| 4 | Easy | Effortless recall |

### Key Functions

- `initStability(grade)`: First review — stability from weights
- `initDifficulty(grade)`: First review — difficulty from weights
- `nextStability(d, s, r, grade)`: Stability after successful recall
- `nextForgetStability(d, s, r)`: Stability after failure (lapse)
- `retrievability(elapsedDays, stability)`: Memory strength estimation
- `nextInterval(stability)`: Days until next review

---

## PERSISTENCE (INDEXEDDB)

### Database Schema (db.js)

Database: `ChessTrainerDB`, version 2

| Store | Key | Indexes | Purpose |
|-------|-----|---------|---------|
| `cards` | `id` (position ID) | due, state, opening | FSRS card state per position |
| `stats` | `id` ('main') | — | Global stats (high score, totals, streak record) |
| `sessions` | auto-increment | date, opening | Session history (mode, rounds, correct/wrong) |
| `reviews` | auto-increment | positionId, date, opening | Per-position review log |

### Data Operations

- **Export**: JSON with version, exportDate, all 4 stores
- **Import**: Validates cards array exists, imports all stores (sessions/reviews get new IDs)
- **Reset**: Clears all 4 stores (with confirmation dialog)
- **Fallback**: If IndexedDB fails, high score falls back to localStorage

---

## PROGRESS DASHBOARD

### 4 Tabs (ProgressDashboard in ui.jsx)

1. **Overview**: Total reviews, accuracy %, high score, best streak. Per-opening mastery grid (color-coded circles + progress bars). Weak spots list (positions with <50% accuracy, min 2 reviews).

2. **Openings**: Per-opening detail cards showing accuracy %, review count, correct count, SRS mastery count.

3. **History**: Recent sessions list (up to 20) with mode, opening, date, correct/total, accuracy %.

4. **Data**: Export JSON backup, import backup, reset all progress (with confirmation).

### Mastery Levels

| Accuracy | Colour | Label |
|----------|--------|-------|
| ≥90% | Green (0x2a6830) | Mastered |
| ≥70% | Light green (0x3a6838) | Strong |
| ≥50% | Amber (0x8a6828) | Learning |
| ≥30% | Orange (0x8a5020) | Developing |
| >0% | Red (0x8a2828) | Needs Work |
| 0% | Dark (0x2a2820) | Not Started |

---

## MOBILE SUPPORT

### Detection

`isMobile()` in postprocessing.js: checks User-Agent for Android/iPhone/iPad/iPod/Mobile OR (width < 768 AND touch support)

### Adaptations

- **Portrait Warning**: Full-screen overlay asking user to rotate to landscape. Shows animated rotate-phone SVG icon.
- **Camera**: Portrait (aspect < 0.8): FOV 55, position (0, 10, 9) vs landscape FOV 38, position (0, 6, 5.8)
- **Antialias**: Disabled on mobile
- **Post-processing**: Skipped entirely on mobile (direct render)
- **Touch**: Pointer events work for both mouse and touch. Pointer capture for reliable drag tracking.
- **Viewport**: `maximum-scale=1.0, user-scalable=no, viewport-fit=cover` + safe-area padding
- **UI**: Responsive sizes throughout (`text-xs sm:text-sm`, `py-2 sm:py-3`, etc.)
- **Explanation panel**: Full-screen centered on mobile (<640px), bottom sheet on desktop

---

## POST-PROCESSING PIPELINE

### Current State: EMPTY STUB

`postprocessing.js` contains only:
- `isMobile()` detection function
- `PostProcessing` class that renders directly (`renderer.render(scene, camera)`)
- No render targets, no shader passes, no edge detection, no colour grading

### Phase E Will Rebuild

The stub was created during Phase A (strip to bare minimum). Phase E will rebuild:
1. Sobel edge detection (ink-brown outlines)
2. Colour grading (contrast, saturation, vignette, warmth)
3. Optional washi paper overlay
4. Mobile bypass (direct render)

---

## KNOWN ISSUES & POLISH NEEDED

### Textures (Phase D, completed but could use more polish)
- Tatami and bench textures: resolution/detail could be higher
- Shoji, wooden walls, table, chessboard: could use more visible detail
- Piece textures are intentionally subtle — designed to look finished once Phase E edge detection is added

### Post-Processing (Phase E, NOT STARTED)
- No edge detection — pieces lack the bold sumi-ink outlines shown in reference screenshots
- No colour grading — scene lacks final warmth/cohesion
- No washi paper overlay effect

### General
- `shaders.js` contains dead stub exports (`createWashiMaterial`, `outlineMaterial`) — can be cleaned up or repurposed in Phase E

---

## COORDINATE SYSTEM REFERENCE

### Chess ↔ 3D Mapping

- **File** (a-h): 0-7, maps to X: `x = (file - 3.5) * 0.56`
  - File 0 (a) → x = -1.96 (right side when viewed from Black's perspective)
  - File 7 (h) → x = +1.96 (left side)
- **Rank** (1-8): 0-7, maps to Z: `z = (rank - 3.5) * 0.56`
  - Rank 0 (1, White's back) → z = -1.96 (far from camera)
  - Rank 7 (8, Black's back) → z = +1.96 (near camera)
- **Y**: Board at y=0.03, pieces at y=0.06, table at y=-0.08

### Camera

- Desktop: position (0, 6, 5.8), looking at (0, 0, 0.3), FOV 38
- Positive Z faces the camera → Black pieces at ranks 7-8 are near camera (correct: player plays Black)
- +X = screen LEFT from player's view (mirrored from intuition due to camera angle)

### FEN ↔ Rank Mapping

FEN row 0 = rank 8 (Black's back rank). Parser iterates rank 7→0 reading rows 0→7.
`rows[7 - rank]` converts between the two systems.
