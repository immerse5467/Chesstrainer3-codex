# Archived Notes — Chess Opening Trainer

> Phase history and detailed reference material.
> **Design vision and colour palette now live at the top of `TODO.md`.**

---

## OBJECT & TEXTURE CATALOGUE (Phase D Reference)

### Chess Pieces

| Property | White Pieces | Black Pieces |
|----------|-------------|--------------|
| **Base colour** | `0xd8d0c0` (kozo ivory) | `0x3a3530` (warm ink black) |
| **Material** | MeshToonMaterial | MeshToonMaterial |
| **Gradient ramp** | 4-step: bright ivory → warm shadow → cool shadow → deep shade | 4-step: dark brown → warm black → cool black → near-black |
| **Diffuse map** | Procedural washi-paper noise (subtle fibre grain) | Procedural sumi-ink noise (wet brushstroke texture) |
| **Emissive** | `0x9a8a70` at 0.20 intensity | `0x3a2818` at 0.20 intensity |
| **Ink outlines** | Inverted hull, dark brown `0x1a1008` | Inverted hull, near-black `0x0a0804` |
| **Outline note** | Only main body lathe gets outlines; sub-parts (knight head, king cross, queen crown, rook crenellations) skip outlines to avoid distortion |

### Chessboard

| Object | Geometry | Colour | Texture |
|--------|----------|--------|---------|
| Light squares | PlaneGeometry | `0xd4c4a0` | Parchment noise, roughness 0.85 |
| Dark squares | PlaneGeometry | `0x5a4030` | Sumi-brown noise, roughness 0.80 |
| Board border | BoxGeometry | `0x6a5030` | Wood grain (amplitude 0.12) |
| Table surface | BoxGeometry | `0x5a4030` | Wood grain (amplitude 0.15) |
| Table legs/aprons | BoxGeometry | `0x3a2820` | Wood grain |
| Board emissive | — | light: `0x8a7a60`, dark: `0x3a2818` | Intensity 0.22 |

### Limo Interior — Side Walls (x = ±6.0)

| Object | Colour | Texture |
|--------|--------|---------|
| Wainscoting | `0x3a2820` | Dark wood grain, roughness 0.75 |
| Divider rail | `0x2e2018` | Dark polished wood |
| Shoji panels | `0xc8bc98` | Washi fibre noise, roughness 0.95, emissive 0.05, dark backing |
| Frame posts/bars | `0x2e2018` | Dark polished wood, roughness 0.70 |

### Limo Interior — Back Wall (z = -7.0)

| Object | Colour | Texture |
|--------|--------|---------|
| Lower panel | `0x4a3528` | Rich wood grain |
| Shoji screen | `0xc8bc98` | Washi, dark backing, emissive |
| Rails/frames | `0x2e2018` | Dark polished wood |

### Limo Interior — Floor, Ceiling, Benches

| Object | Colour | Texture |
|--------|--------|---------|
| Floor | `0x1a1410` | Dark plank grain |
| Tatami | `0x8a7a58` | Rush-grass weave at thread level |
| Ceiling | `0x2a2420` | Soot-darkened cedar grain |
| Bench platform | `0x3a2820` | Dark lacquered wood |
| Bench cushion | `0x6a2828` | Fabric weave, roughness 0.90 |

---

## PHASE HISTORY (COMPLETED)

### Phase A: Strip to Bare Minimum — DONE

All lights deleted. All materials stripped to bare `MeshStandardMaterial()`.
Custom shaders emptied. Post-processing emptied. Board squares flattened to
PlaneGeometry. Scene was pitch black. User confirmed with screenshot.

### Phase B: User Confirms Bare Canvas — DONE

User reviewed screenshot showing pitch-black scene with only self-emissive
gold labels visible. Confirmed all geometry is present and responsive.

### Phase C: Comprehensive Lighting — DONE

Complete 5-layer lighting system built from scratch:
1. Hemisphere ambient — cosy base visibility, warm-cool gradient
2. Reading lamp spotlight — hero light, bright warm pool on the board
3. Camera fill (x2) — reveals piece contours from low and steep angles
4. Stationary lanterns — warm candle glow at the back cabin corners
5. Passing lanterns — moving warm patches on shoji walls = motion illusion

Lighting control panel added for real-time user tuning.

**Final Light Values**:

| # | Type | Colour | Intensity | Position |
|---|------|--------|-----------|----------|
| 1 | HemisphereLight | sky:0xe8dcc8 / gnd:0x3a3a4a | 1.00 | n/a |
| 2 | SpotLight | 0xfff0d0 | 15.0 | (0, 4.0, 0.3) |
| 3 | PointLight | 0xf0ecff | 5.0 | (0, 3.5, 5.5) |
| 3b | PointLight | 0xf0ecff | 5.0 | (0, 5.0, 3.5) |
| 4-5 | PointLight x2 | 0xff9030 | 2.0 | (±5.5, 1.5, -5.0) |
| 6-11 | PointLight x6 | 0xffaa40 | 0.50 | (±5.9, 1.5, scroll) |
| — | Emissive (board) | light:0x8a7a60 / dark:0x3a2818 | 0.22 | n/a |
| — | Emissive (pieces) | white:0x9a8a70 / black:0x3a2818 | 0.20 | n/a |

### Phase D: Textures — DONE

All textures procedurally generated via Canvas (512x512) for single-file export.
Key decisions and iterations:
- v1: Initial — texture × color multiplication caused catastrophic darkening
- v2: Fixed with "variation-only" textures (0.7-1.0 range), raised roughness everywhere
- v3: 512px upgrade, but piece textures were too dramatically splotchy
- v4: Pixel-level grain for flat surfaces (freq 30-50), subtle paper for pieces
- Outline bug fix: Sub-parts skip inverted hull outlines (only main body gets them)

### What Went Wrong in v3 (ShaderMaterial Disaster)

Custom ShaderMaterial (`createWashiMaterial`) ignored all scene lights (hardcoded
`uLightDir`). Combined with ambient 0.28, no fill light, aggressive post-processing
(contrast 1.10, vignette 0.25), near-invisible black pieces (0x2a1c10) — unusable.
Fix: delete all custom shaders, rebuild from MeshStandardMaterial. Lesson:
**MeshToonMaterial is safe (inherits Phong, responds to lights). Custom ShaderMaterial
is NOT safe unless `lights: true` + proper light uniforms.**

---

## TEXTURE MULTIPLICATION RULE (Critical — Phase D Lesson)

Three.js `map` textures MULTIPLY with `material.color`:
`final = color × texture × light`

- ALL textures must be "variation-only": values 0.7-1.0
- `material.color` handles the actual hue
- For dark pieces: texture 0.4-1.0, toon gradient ramp 0.4-1.0 (base color provides darkness)
- 512x512 for 4K monitors
- On flat PlaneGeometry/BoxGeometry, UV 0-1 spans entire face. Need freq 30-50+ for visible grain
