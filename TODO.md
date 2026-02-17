# Chess Opening Trainer — Master Plan v7

> **READ THIS FILE FIRST every session.** Single source of truth.
>
> **Companion docs** (read only when needed for detail):
> - `CODEBASE.md` — Exhaustive documentation of every implemented feature, file, component
> - `Archived_Notes.md` — Phase A-D history, object/texture catalogues
>
> **DISRUPTION PROTOCOL**: `npm run export` after each phase. If interrupted,
> "Continue from TODO.md" resumes from first unchecked item.

---

## DESIGN VISION

**Every decision — materials, lighting, textures, post-processing, UI — must
serve this vision. When in doubt, re-read this section.**

### The Aesthetic: Where Okami Meets Spirited Away

The scene takes place inside a **Japanese-style limousine** moving through
darkness at night. The player sits across from an unseen opponent, a low table
between them bearing a chessboard. Outside, only blackness and the occasional
passing lantern. Inside, a single warm reading lamp pools golden light onto the
board — the visual and spiritual centre of the scene.

The entire 3D world is rendered in a style at the intersection of three
aesthetic traditions:

1. **Okami HD** — The world appears as though painted onto living washi paper.
   Surfaces carry the organic grain and fibre of handmade paper. Colours are
   rich but never fully saturated, as though applied with mineral pigments
   ground on an ink stone. Toon shading creates discrete light/shadow bands
   rather than smooth gradients, giving every surface a hand-painted quality.
   Edges are drawn with visible ink strokes — the world looks *illustrated*,
   not rendered.

2. **Sumi-e / Washi-e** — The ink-painting tradition. Black is the most
   expressive colour: the black chess pieces should feel like pools of fresh
   sumi ink on paper — deep, rich, slightly warm, with visible brushstroke
   texture in their surface. White pieces are the colour of unbleached washi
   itself — not clinical white but the warm ivory of kozo fibre paper, with
   subtle grain visible in the material. The chessboard reads as a painted
   game board on a scroll, with the warm amber of aged paper for light squares
   and deep sumi-stained brown for dark squares.

3. **Spirited Away (bathhouse & train carriage)** — The environment draws from
   two iconic Ghibli spaces. The **train carriage** gives us the mood: dark
   wood benches, warm incandescent light spilling from a single overhead lamp,
   darkness pressing against translucent panels, the gentle sway of travel.
   **Zeniba's cottage** gives us the warmth: candlelight glow, the comfort of
   well-worn wood, the intimacy of a small lit space in a vast dark world.
   The **bathhouse** gives us the materiality: rich lacquered wood frames,
   warm-toned paper screens, the interplay of amber lamplight on natural
   textures.

### Guiding Principles

- **The board is the sun.** Everything in the scene exists to frame, support,
  and direct attention to the chessboard. It should be the brightest, most
  richly textured, most visually detailed object. The environment is
  atmospheric backdrop.

- **Warmth, not heat.** The palette is warm (ambers, creams, browns, golds)
  but restrained. Think *embers*, not *fire*. The reading lamp casts the warmth
  of a paper lantern, not a spotlight. Colours should feel *aged* and *lived-in*.

- **Paper, not plastic.** Every surface should read as a natural material:
  paper, wood, fabric, ink. Nothing should look smooth, glossy, or synthetic.
  MeshToonMaterial with procedural noise textures is the primary tool. The
  toon shading creates the Okami-like banding, while noise maps add the
  washi-paper grain.

- **Ink defines form.** Sumi-e ink outlines on the chess pieces give them
  their hand-drawn character. The inverted-hull method renders visible dark
  edges that make pieces look illustrated rather than 3D-modelled. Edge
  detection in post-processing extends this to the whole scene.

- **Darkness is a material.** The exterior is absolute black. The shoji
  panels should read as *barriers against the dark* — translucent paper
  with the void pressing behind them. The darkness outside makes the
  interior warmth feel precious and intimate.

- **Minimal geometry, maximal texture.** The geometry of the limo interior
  is deliberately simple and low-poly. All visual richness comes from
  materials, textures, and lighting. This keeps the scene performant
  while achieving a hand-crafted look.

- **No dust particles, no lens effects.** Atmosphere comes entirely from
  warm lighting, material richness, and the darkness outside. The scene
  should feel clean and elegant, like a woodblock print — not a dusty attic.

### Colour Palette

| Name | Hex | Used For | Reference |
|------|-----|----------|-----------|
| Kozo Ivory | `0xd8d0c0` | White piece base | Unbleached kozo washi |
| Aged Parchment | `0xd4c4a0` | Light board squares | Centuries-old scroll paper |
| Sumi Brown | `0x5a4030` | Dark board squares | Sumi ink diluted in brown |
| Ink Black | `0x3a3530` | Black piece base | Fresh sumi ink, warm-toned |
| Lacquer Brown | `0x3a2820` | Wood frames, table legs | Urushi lacquer on hinoki |
| Rich Panel | `0x4a3528` | Wall panels, aprons | Aged keyaki (zelkova) |
| Shoji Cream | `0xc8bc98` | Shoji paper panels | Washi over bamboo lattice |
| Tatami Gold | `0x8a7a58` | Tatami floor mat | Aged rush grass weave |
| Cushion Crimson | `0x6a2828` | Bench cushions | Kimono silk, madder-dyed |
| Ceiling Smoke | `0x2a2420` | Ceiling panels | Soot-darkened cedar |
| Floor Dark | `0x1a1410` | Floor base | Charcoal-stained planks |
| Lamp Gold | `0xfff0d0` | Reading lamp light | Paper lantern glow |
| Label Amber | `#ffcc35` | Board labels (a-h, 1-8) | Gold leaf on lacquerware |

---

## CRITICAL RULES FOR LLM AGENTS

These rules MUST be followed in every session. Violations have caused disasters.

### Workflow

1. **`npm run export`** (NOT `npm run build`) after EVERY code change. This creates
   `chess-trainer.html` — the single-file deliverable the user opens in Chrome.
   `npm run build` ONLY creates `dist/`. `npm run export` creates the actual HTML file.
2. **All assets are procedural** — no image files, no audio files. Everything is
   Canvas textures, DataTextures, or Tone.js synthesis. Required for single-file export.
3. **After completing work, create a PR to the `main` branch directly.**
   Use `gh pr create --base main`. Do NOT just push to a feature branch and leave
   it — the user should receive a PR they can merge, not a branch they have to
   manually handle. Always push your branch first, then create the PR.
4. **The user has strict 5-hour and weekly token limits.** Be efficient:
   - Read files ONCE, don't re-read unnecessarily
   - Make changes in parallel when independent
   - Don't over-explain — be concise
   - If blocked, ask rather than spinning
   - Plan before coding to avoid wasted iterations

### Rendering & Performance

5. **Pixel ratio NEVER above 1.5** with post-processing — higher = unusable perf
6. **Post-processing render targets at 0.75x resolution** to maintain framerate
7. **Mobile: skip ALL post-processing** — use direct rendering only
8. **No array spread `[...a, ...b]` in animation loops** — causes GC jank every frame
9. **Throttle square colour updates to ~15fps** — 64 squares × 60fps is wasteful

### Lighting (LOCKED — Do Not Change Without Permission)

10. **Ambient NEVER below 0.35** — scene becomes gloomy/illegible (0.28 was disaster)
11. **Camera LOCKED**: (0, 6, 5.8) lookAt (0, 0, 0.3) FOV 38 — small changes only
12. **Post-processing contrast max 1.05** — higher darkens darks catastrophically
13. **Vignette max 0.10** — higher eats edges
14. **Black piece base colour ≥ 0x3a3530** — darker = invisible

### Materials & Textures

15. **Texture × Color Multiplication Rule**: Three.js `map` textures MULTIPLY with
    `material.color`: `final = color × texture × light`. ALL textures must be
    "variation-only" (values 0.7-1.0). `material.color` handles actual hue.
16. **Flat surface UV freq 30-50+** — on PlaneGeometry/BoxGeometry, UV spans 0-1 across
    entire face. Noise freq 3 = only 3 bumps = invisible. Need 30-50 for visible grain.
17. **MeshToonMaterial gradientMap**: Must use `THREE.RGBAFormat` + `NearestFilter` +
    `generateMipmaps: false` (r182 WebGL2 `texStorage` path breaks with LuminanceFormat)
18. **SpotLight target must be added to scene** (`scene.add(spotLight.target)`)
19. **Piece material MUST respond to scene lights** — verify by changing ambient.
    MeshToonMaterial (Phong-based) is safe. Custom ShaderMaterial is NOT unless `lights: true`
    with proper light uniforms. This was a v3 disaster — custom ShaderMaterial with hardcoded
    `uLightDir` ignored ALL scene lights.

### Audio

20. **Route ALL synths through reverb** — raw synths to destination sound harsh
21. **Always use high-pass filter (~80Hz)** — prevents sub-bass rumble from low notes
22. **Reverb: ~3s decay, 0.35 wet** — cleaner than 4s/0.45

### Previous Edge Detection Lessons (for Phase E)

23. **Edge detection strength 0.25 is a reasonable start** — 0.4 was too strong and
    created a visible grid on the board. Start conservative, increase to taste.
24. **Edge colour should be warm ink-brown, NOT pure black** — pure black is too harsh

---

## CURRENT STATUS

| Phase | Status | Summary |
|-------|--------|---------|
| A-B | DONE | Stripped to bare minimum, confirmed pitch-black baseline |
| C | DONE | 5-layer lighting (13 lights + 2 emissive), 8-param control panel with OFF/MAX buttons |
| D | DONE | Procedural textures for all surfaces (MeshToonMaterial pieces, washi/wood/fabric/tatami) |
| **E** | **NEXT** | **Post-processing: ink edge detection + colour grading** |
| F | TODO | Final polish, performance, QA |

**Also done**: Portrait warning, fullscreen button, lighting panel (OFF/MAX/value display),
drag-and-drop piece interaction, ink splash particles, procedural Japanese music, progress
dashboard (4 tabs), FSRS-5 spaced repetition, data export/import, 80 positions across 19 openings.

---

## PHASE E: POST-PROCESSING

**Goal**: Add screen-space ink-edge detection and subtle colour grading.
Enhance the hand-painted look without darkening the scene.

**Current state**: `src/engine/postprocessing.js` is an empty stub — renders
directly with `renderer.render(scene, camera)`. Phase E rebuilds from scratch.

**Key file to modify**: `src/engine/postprocessing.js` (28 lines → full pipeline)

### E.1 — Ink Edge Detection (Sobel)

The signature visual — bold sumi-ink outlines on all objects. This is what
gives pieces their final illustrated look (complements inverted hull outlines
from Phase D). The user's reference screenshot shows bold dark outlines as the
key differentiator between "3D render" and "hand-painted illustration".

- [ ] **E.1.1** Rebuild post-processing pipeline in `postprocessing.js`
  - Render scene to offscreen WebGLRenderTarget (0.75x resolution)
  - Generate depth + normal buffers for edge detection
  - Apply Sobel edge detection as full-screen shader pass
  - Composite edges onto scene colour (multiply or darken blend)
  - Bypass entirely on mobile (`isMobile()` already exists in the file)
  - Handle resize: update render target sizes in `resize(w, h)`
- [ ] **E.1.2** Tune edge parameters
  - Edge colour: dark ink-brown ~`0x2a1808` (NOT pure black — too harsh)
  - Start edge strength at ~0.20, increase to taste (0.4 was too strong in past)
  - Edges should look like sumi-ink brush outlines, not CG wireframe
  - Depth edges for silhouettes, normal edges for surface detail
  - Pieces should have bold outlines; board square edges should be subtle
  - Test with and without inverted hull outlines — might want to reduce/remove
    hull outlines if Sobel provides sufficient edges
- [ ] **E.1.3** Build and verify: `npm run export`
  - Confirm edges visible on pieces, board edges, environment shoji frames
  - Confirm scene NOT darkened by the pass (check ambient areas)
  - Confirm mobile still works (no post-processing, direct render)

### E.2 — Colour Grading

Subtle warm colour grade to tie the scene together. Applied AFTER edge compositing.

- [ ] **E.2.1** Add colour grading pass
  - Start **completely neutral**: contrast 1.0, warmth 0.0, saturation 1.0, vignette 0.0
  - Verify the pass changes NOTHING visually before tuning
- [ ] **E.2.2** Incrementally adjust (tiny steps!):
  - Contrast: 1.03–1.05 max (NEVER above 1.05 — darkens darks)
  - Saturation: 1.05 (subtle richness boost)
  - Vignette: 0.05–0.08 max (NEVER above 0.10 — eats board edges)
  - Warmth: slight push toward amber
- [ ] **E.2.3** Build and verify: confirm scene not darkened, board edges still visible

### E.3 — Washi Paper Overlay (Optional)

- [ ] **E.3.1** Test full-screen procedural paper-grain overlay at 3-5% opacity
  - Makes entire scene feel printed on washi paper
  - Can reuse noise functions from textures.js
  - Skip if it reduces legibility or looks gimmicky
- [ ] **E.3.2** Keep or remove based on visual result

### E.4 — Commit & PR

- [ ] **E.4.1** Final `npm run export`, commit, push, create PR to `main`

---

## PHASE F: FINAL POLISH

- [ ] **F.1** Verify all 3 game modes (Learn, Challenge, Spaced Review)
- [ ] **F.2** Verify nav elements (home, mode indicator, opening name)
- [ ] **F.3** Verify mobile (landscape works, portrait shows warning)
- [ ] **F.4** Decide: keep lighting panel or remove for release
- [ ] **F.5** Performance: 60fps desktop, 30fps+ mobile
- [ ] **F.6** Polish texture detail if needed (tatami, shoji, board could use more visible grain)
- [ ] **F.7** Clean up dead stubs (shaders.js)
- [ ] **F.8** Final `npm run export`, commit, push, create PR to `main`

---

## KEY FILES

| File | Lines | Purpose | Phase E Relevance |
|------|-------|---------|-------------------|
| `src/engine/postprocessing.js` | 28 | **Empty stub — REBUILD HERE** | Primary target |
| `src/engine/ChessScene.js` | 708 | Scene, board, lights, animation | Calls `postProcessing.render()` |
| `src/engine/pieces.js` | 453 | Piece geometry + MeshToonMaterial | May adjust hull outlines |
| `src/engine/textures.js` | 267 | All procedural textures | Reuse noise for paper overlay |
| `src/engine/environment.js` | 281 | Limo interior | No changes expected |
| `src/components/ui.jsx` | 1015 | All React UI | No changes expected |
| `src/App.jsx` | 503 | Game logic, state | No changes expected |
| `src/engine/particles.js` | 168 | Ink splash particles | No changes expected |
| `src/audio/AudioManager.js` | 223 | Procedural audio | No changes expected |
| `src/engine/shaders.js` | 8 | Dead stub | Could repurpose or delete |
| `CODEBASE.md` | — | Full feature documentation | Reference for details |
| `Archived_Notes.md` | — | Phase history, object catalogues | Reference for specifics |
