import * as THREE from 'three';

// ============================================================================
// PROCEDURAL TEXTURE GENERATION — Phase D (v4: pixel-level grain)
//
// KEY INSIGHT: On flat surfaces (board, table, walls), UV spans 0-1 across the
// whole face. Noise freq 3 = only 3 bumps = invisible. Need freq 30-60 for
// visible grain at pixel level, PLUS lower freq for color patches.
//
// For pieces (LatheGeometry), UV wraps naturally so moderate freq works.
//
// All variation-only (0.7-1.0). material.color handles actual hue.
// 512x512 for 4K clarity.
// ============================================================================

const TEX_SIZE = 512;

function hash(x, y) {
  let n = x * 127.1 + y * 311.7;
  n = Math.sin(n) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x, y, oct = 4, lac = 2.0, gain = 0.5) {
  let v = 0, a = 1.0, f = 1.0, mx = 0;
  for (let i = 0; i < oct; i++) {
    v += a * smoothNoise(x * f, y * f); mx += a; a *= gain; f *= lac;
  }
  return v / mx;
}

function dirNoise(x, y, angle, stretch, oct = 4) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return fbm((c * x + s * y) * stretch, -s * x + c * y, oct);
}

function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

// ============================================================================
// TOON GRADIENT RAMPS
// ============================================================================

function createGradientRamp(steps) {
  const sz = steps.length;
  const data = new Uint8Array(sz * 4);
  for (let i = 0; i < sz; i++) {
    data[i * 4] = Math.round(steps[i][0] * 255);
    data[i * 4 + 1] = Math.round(steps[i][1] * 255);
    data[i * 4 + 2] = Math.round(steps[i][2] * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, sz, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const whiteGradientRamp = createGradientRamp([
  [0.35, 0.32, 0.28],
  [0.52, 0.48, 0.42],
  [0.76, 0.72, 0.64],
  [1.00, 0.97, 0.90],
]);

export const blackGradientRamp = createGradientRamp([
  [0.40, 0.36, 0.30],
  [0.58, 0.52, 0.44],
  [0.78, 0.72, 0.62],
  [1.00, 0.94, 0.82],
]);

// ============================================================================
// Canvas helpers
// ============================================================================

function genCanvas(size, fn) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = fn(x / size, y / size);
      const i = (y * size + x) * 4;
      d[i] = Math.round(clamp(r) * 255);
      d[i + 1] = Math.round(clamp(g) * 255);
      d[i + 2] = Math.round(clamp(b) * 255);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function makeTex(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ============================================================================
// PIECE TEXTURES — Subtle paper grain for Okami/sumi-e look
// NOT dramatic splotches — bold outlines come from Phase E edge detection.
// Pieces use LatheGeometry (u wraps 360°) so moderate freq = visible grain.
// ============================================================================

// White piece: subtle washi paper grain. Range 0.88-1.0
export function createWhiteWashiTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Medium fibre grain (visible across piece surface)
    const fibre = dirNoise(u * 6, v * 6, 0.5, 2.0, 3);
    // Fine paper texture
    const fine = fbm(u * 16, v * 16, 3);
    // Subtle large variation
    const patch = fbm(u * 3, v * 3, 2);
    const n = fibre * 0.35 + fine * 0.35 + patch * 0.30;
    const base = 0.88 + n * 0.12;
    return [base + 0.01, base, base - 0.02];
  }));
}

// Black piece: warm paper grain with modest variation. Range 0.70-1.0
export function createBlackSumiTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Medium ink-wash variation
    const wash = fbm(u * 4, v * 4, 3, 2.0, 0.55);
    // Fine grain
    const fine = fbm(u * 14, v * 14, 3);
    // Subtle large patches
    const patch = fbm(u * 2, v * 2, 2);
    const n = wash * 0.35 + fine * 0.35 + patch * 0.30;
    const base = 0.70 + n * 0.30;
    return [base + 0.01, base, base - 0.03];
  }));
}

// ============================================================================
// BOARD TEXTURES — Visible paper grain at pixel level
// freq 30-50 = fine grain visible on 4K. freq 4-8 = color patches.
// ============================================================================

// Light squares: aged parchment with VISIBLE paper fibre grain
export function createParchmentTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Fine paper fibre grain (PIXEL LEVEL — the key to looking papery)
    const fineGrain = fbm(u * 50, v * 50, 3, 2.0, 0.5);
    // Medium fibre direction
    const fibre = dirNoise(u * 20, v * 20, 0.7, 1.8, 3);
    // Larger age/stain patches for color variation
    const age = fbm(u * 6, v * 6, 2, 2.0, 0.6);
    const n = fineGrain * 0.35 + fibre * 0.30 + age * 0.35;
    const base = 0.82 + n * 0.18;
    return [base + 0.03, base, base - 0.04];
  }));
}

// Dark squares: sumi-stained paper with ink grain
export function createSumiBrownTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Fine ink grain at pixel level
    const grain = fbm(u * 45, v * 45, 3, 2.0, 0.5);
    // Directional ink-wash streaks
    const streak = dirNoise(u * 18, v * 18, 0.1, 2.5, 3);
    // Larger ink pooling patches
    const ink = fbm(u * 5, v * 5, 2, 2.0, 0.55);
    const n = grain * 0.30 + streak * 0.35 + ink * 0.35;
    const base = 0.78 + n * 0.22;
    return [base + 0.02, base, base - 0.04];
  }));
}

// ============================================================================
// ENVIRONMENT TEXTURES — Visible detail at 4K
// ============================================================================

// Wood grain — visible at pixel level for table/border/frames
export function createWoodGrainTexture(amplitude) {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Fine wood grain lines at pixel level
    const fineGrain = dirNoise(u * 40, v * 40, 0.05, 4.0, 3);
    // Wood ring pattern
    const ring = Math.sin(fineGrain * 18 + fbm(u * 4, v * 4, 2) * 3) * 0.5 + 0.5;
    // Medium grain variation
    const med = dirNoise(u * 12, v * 12, 0.05, 3.0, 3);
    const n = ring * 0.40 + fineGrain * 0.30 + med * 0.30;
    const base = (1.0 - amplitude) + n * amplitude;
    return [base + 0.01, base, base - 0.02];
  }));
}

// Shoji washi — visible handmade paper fibre texture
export function createShojiWashiTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Fine paper fibre grain (pixel level)
    const fineF = fbm(u * 50, v * 50, 3);
    // Directional fibre bundles
    const fibre = dirNoise(u * 20, v * 20, 1.2, 2.0, 3);
    // Larger fibre clumps (visible patches in handmade paper)
    const clump = fbm(u * 6, v * 6, 2, 2.0, 0.6);
    const n = fineF * 0.30 + fibre * 0.35 + clump * 0.35;
    const base = 0.82 + n * 0.18;
    return [base + 0.01, base, base - 0.03];
  }));
}

// Fabric weave — visible thread-level crosshatch
export function createFabricWeaveTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Thread-level weave pattern (high freq for 4K visibility)
    const warpH = Math.sin(u * TEX_SIZE * 0.6) * 0.5 + 0.5;
    const weftV = Math.sin(v * TEX_SIZE * 0.6) * 0.5 + 0.5;
    const cell = (Math.floor(u * 64) + Math.floor(v * 64)) % 2;
    const weave = cell ? warpH * 0.7 + weftV * 0.3 : warpH * 0.3 + weftV * 0.7;
    // Organic irregularity
    const noise = fbm(u * 8, v * 8, 2);
    const n = weave * 0.55 + noise * 0.45;
    const base = 0.70 + n * 0.30;
    return [base + 0.03, base - 0.01, base - 0.01];
  }));
}

// Tatami — bold woven rush with visible parallel lines
export function createTatamiTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Rush lines at high pixel frequency
    const rush = Math.sin(v * TEX_SIZE * 1.0) * 0.5 + 0.5;
    // Cross-binding
    const bind = Math.sin(u * TEX_SIZE * 0.18) * 0.5 + 0.5;
    // Strand-level variation (stretched along rush direction)
    const strand = fbm(u * 4, v * 30, 2);
    // Organic irregularity
    const noise = fbm(u * 8, v * 8, 3);
    const n = rush * 0.35 + strand * 0.25 + bind * 0.15 + noise * 0.25;
    const base = 0.72 + n * 0.28;
    return [base + 0.03, base, base - 0.04];
  }));
}

// Floor planks — dark with visible plank grain
export function createFloorTexture() {
  return makeTex(genCanvas(TEX_SIZE, (u, v) => {
    // Fine wood grain at pixel level
    const grain = dirNoise(u * 35, v * 35, 0.0, 4.0, 3);
    // Medium variation
    const med = fbm(u * 12, v * 12, 2);
    // Plank seam lines
    const seam = 1.0 - 0.25 * Math.max(0, 1.0 - Math.abs(Math.sin(v * 6 * Math.PI)) * 10);
    const n = grain * 0.35 + med * 0.30 + seam * 0.35;
    const base = 0.78 + n * 0.22;
    return [base + 0.01, base, base - 0.02];
  }));
}
