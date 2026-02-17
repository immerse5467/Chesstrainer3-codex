# Chess Opening Trainer

An interactive chess opening trainer with Okami HD sumi-e ink-wash graphics.

## How to Play

### Option 1: Just open the file (easiest)

1. Download **`chess-trainer.html`** from this repository
2. Open it in **Google Chrome** (double-click it, or drag it into a Chrome window)
3. Play

That's it. Everything is contained in that single file — no installation, no server, no internet connection needed.

### Option 2: Run from source (for developers)

If you want to modify the code or run the dev server with hot reload:

```bash
npm install
npm run dev
```

To rebuild the single-file version after making changes:

```bash
npm run export
```

This produces a fresh `chess-trainer.html`.

### Dependency maintenance

Use the following commands to verify and refresh local dependencies:

```bash
npm install     # install/verify dependencies from package-lock.json
npm run export  # verify production build + regenerate chess-trainer.html
```

If dependency update checks fail in your environment, verify npm/network configuration first:

```bash
npm config list
env | grep -i proxy
```

Then retry with your expected registry/proxy settings.

## Game Modes

- **Learn Mode** — Untimed practice. Take as long as you need. Missed positions are re-queued.
- **Challenge Mode** — 10 timed rounds (25s each). Score points for speed, streaks, and accuracy.
- **Spaced Review** — FSRS-5 spaced repetition. Positions you struggle with appear more often. Progress persists across sessions.

## What's In It

- 85+ positions across 16 opening families (Sicilian, Italian, Ruy Lopez, Caro-Kann, French, QGD, Slav, King's Indian, Nimzo-Indian, Grunfeld, and more)
- Custom GLSL cel-shading with edge detection, bloom, colour grading, and paper texture
- 3D chess pieces, detailed limousine interior, parallax Vegas skyline with neon
- GPU ink splash particles on correct answers
- Japanese pentatonic ambient music (koto, shamisen, pads)
- Progress dashboard with mastery heatmap, session history, and data export/import
- Works on iPhone Safari too (responsive layout, touch controls)

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome (desktop) | Best experience |
| Safari (iPhone/iPad) | Fully functional |
| Firefox, Edge | Should work (WebGL + Web Audio required) |

## Notes

- Your progress is stored in the browser's IndexedDB. Clearing browser data will erase it — use the Progress > Data > Export button to back up.
- The single HTML file is ~1.1 MB because it contains Three.js, Tone.js, React, and all the game code bundled together.
