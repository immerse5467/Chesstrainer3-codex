import * as THREE from 'three';
import {
  whiteGradientRamp,
  blackGradientRamp,
  createWhiteWashiTexture,
  createBlackSumiTexture,
} from './textures.js';

// ============================================================================
// HIGH-FIDELITY CHESS PIECE GEOMETRY
// Using LatheGeometry with detailed profiles for smooth, recognisable silhouettes
// ============================================================================

const SEG = 32; // Lathe segments for smoothness

// Geometry cache — computed once, reused for every piece instance
const geoCache = {};

// Texture cache — generated once, shared across all pieces
let _whiteWashi = null;
let _blackSumi = null;
function getWhiteWashi() { return _whiteWashi || (_whiteWashi = createWhiteWashiTexture()); }
function getBlackSumi() { return _blackSumi || (_blackSumi = createBlackSumiTexture()); }

// Helper: create a lathe shape from a profile of [radius, height] points
function latheFromProfile(points, segments = SEG) {
  const shape = points.map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(shape, segments);
}

// Helper: smooth Catmull-Rom interpolation between profile points
function smoothProfile(controlPoints, resolution = 20) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map(([r, y]) => new THREE.Vector3(r, y, 0)),
    false, 'catmullrom', 0.5
  );
  const pts = curve.getPoints(resolution);
  return pts.map(p => [Math.max(p.x, 0), p.y]);
}

// ---- PAWN ----
function createPawnGeometry() {
  const profile = smoothProfile([
    [0.00, 0.00],  // centre base
    [0.22, 0.00],  // base edge
    [0.22, 0.03],  // base rim
    [0.18, 0.06],  // base chamfer
    [0.14, 0.08],  // collar bottom
    [0.11, 0.12],  // collar top
    [0.09, 0.18],  // shaft narrow
    [0.10, 0.25],  // shaft mid
    [0.12, 0.30],  // bulge
    [0.14, 0.33],  // neck flare
    [0.12, 0.36],  // neck top
    [0.13, 0.39],  // head base
    [0.14, 0.42],  // head widest
    [0.13, 0.46],  // head upper
    [0.10, 0.49],  // head top
    [0.05, 0.51],  // crown
    [0.00, 0.52],  // tip
  ], 32);
  return latheFromProfile(profile);
}

// ---- ROOK ----
function createRookGeometry() {
  // Main body via lathe
  const profile = smoothProfile([
    [0.00, 0.00],
    [0.24, 0.00],
    [0.24, 0.04],
    [0.20, 0.07],
    [0.16, 0.10],
    [0.15, 0.14],
    [0.16, 0.28],
    [0.17, 0.34],
    [0.19, 0.38],
    [0.22, 0.42],
    [0.22, 0.48],
    [0.20, 0.48],
    [0.20, 0.52],
    [0.22, 0.52],
    [0.22, 0.56],
    [0.00, 0.56],
  ], 28);
  return latheFromProfile(profile);
}

function createRookCrenellations() {
  const group = new THREE.Group();
  // 4 merlons around the top
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const geo = new THREE.BoxGeometry(0.10, 0.10, 0.10);
    const merlon = new THREE.Mesh(geo);
    merlon.position.set(
      Math.cos(angle) * 0.15,
      0.61,
      Math.sin(angle) * 0.15
    );
    group.add(merlon);
  }
  return group;
}

// ---- BISHOP ----
function createBishopGeometry() {
  const profile = smoothProfile([
    [0.00, 0.00],
    [0.22, 0.00],
    [0.22, 0.04],
    [0.18, 0.07],
    [0.15, 0.10],
    [0.12, 0.14],
    [0.10, 0.20],
    [0.09, 0.28],
    [0.10, 0.35],
    [0.12, 0.40],
    [0.13, 0.44],
    [0.12, 0.48],
    [0.10, 0.52],
    [0.07, 0.57],
    [0.04, 0.62],
    [0.06, 0.64],  // mitre bulge
    [0.05, 0.67],
    [0.02, 0.70],
    [0.00, 0.72],
  ], 32);
  return latheFromProfile(profile);
}

function createBishopMitreSlit() {
  // Diagonal slit on the mitre
  const geo = new THREE.BoxGeometry(0.005, 0.12, 0.12);
  const mesh = new THREE.Mesh(geo);
  mesh.position.set(0, 0.64, 0);
  mesh.rotation.z = Math.PI / 6;
  return mesh;
}

// ---- KNIGHT ----
function createKnightGeometry() {
  // The knight is the most complex — built from extruded paths
  const group = new THREE.Group();

  // Base via lathe
  const baseProfile = smoothProfile([
    [0.00, 0.00],
    [0.24, 0.00],
    [0.24, 0.04],
    [0.20, 0.07],
    [0.16, 0.10],
    [0.14, 0.14],
    [0.00, 0.14],
  ], 16);
  const baseGeo = latheFromProfile(baseProfile);

  // Neck — curved cylinder
  const neckShape = new THREE.Shape();
  neckShape.moveTo(-0.08, 0);
  neckShape.lineTo(0.08, 0);
  neckShape.lineTo(0.07, 0.28);
  neckShape.lineTo(-0.07, 0.28);
  neckShape.closePath();

  const neckPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.12, 0.02),
    new THREE.Vector3(0, 0.24, 0.06),
    new THREE.Vector3(0, 0.36, 0.04),
  ]);

  // Use a series of boxes to approximate the neck+head
  const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.24, SEG);
  const neckMesh = new THREE.Mesh(neckGeo);
  neckMesh.position.set(0, 0.26, 0.04);
  neckMesh.rotation.x = -0.35;

  // Head block
  const headGeo = new THREE.BoxGeometry(0.18, 0.26, 0.32);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.set(0, 0.48, 0.14);
  headMesh.rotation.x = -0.35;

  // Round the head top
  const headTopGeo = new THREE.SphereGeometry(0.10, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const headTopMesh = new THREE.Mesh(headTopGeo);
  headTopMesh.position.set(0, 0.58, 0.08);
  headTopMesh.rotation.x = -0.35;

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.14, 0.12, 0.18);
  const snoutMesh = new THREE.Mesh(snoutGeo);
  snoutMesh.position.set(0, 0.42, 0.30);
  snoutMesh.rotation.x = -0.2;

  // Lower jaw
  const jawGeo = new THREE.BoxGeometry(0.12, 0.05, 0.14);
  const jawMesh = new THREE.Mesh(jawGeo);
  jawMesh.position.set(0, 0.37, 0.28);
  jawMesh.rotation.x = -0.1;

  // Ears
  const earGeo = new THREE.ConeGeometry(0.05, 0.14, 8);
  const ear1 = new THREE.Mesh(earGeo);
  ear1.position.set(0.07, 0.64, 0.06);
  ear1.rotation.x = -0.1;
  const ear2 = new THREE.Mesh(earGeo);
  ear2.position.set(-0.07, 0.64, 0.06);
  ear2.rotation.x = -0.1;

  // Mane ridge
  const maneGeo = new THREE.BoxGeometry(0.04, 0.18, 0.06);
  const maneMesh = new THREE.Mesh(maneGeo);
  maneMesh.position.set(0, 0.52, -0.04);
  maneMesh.rotation.x = -0.3;

  return { baseGeo, parts: [neckMesh, headMesh, headTopMesh, snoutMesh, jawMesh, ear1, ear2, maneMesh] };
}

// ---- QUEEN ----
function createQueenGeometry() {
  const profile = smoothProfile([
    [0.00, 0.00],
    [0.25, 0.00],
    [0.25, 0.04],
    [0.21, 0.07],
    [0.17, 0.10],
    [0.14, 0.14],
    [0.12, 0.20],
    [0.11, 0.28],
    [0.10, 0.36],
    [0.11, 0.42],
    [0.13, 0.48],
    [0.15, 0.52],
    [0.14, 0.55],
    [0.12, 0.58],
    [0.10, 0.60],
    [0.08, 0.63],
    [0.04, 0.66],
    [0.00, 0.68],
  ], 36);
  return latheFromProfile(profile);
}

function createQueenCrown() {
  const group = new THREE.Group();
  // Crown points
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.10, 6));
    spike.position.set(
      Math.cos(angle) * 0.10,
      0.72,
      Math.sin(angle) * 0.10
    );
    group.add(spike);
  }
  // Crown orb
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16));
  orb.position.y = 0.74;
  group.add(orb);
  return group;
}

// ---- KING ----
function createKingGeometry() {
  const profile = smoothProfile([
    [0.00, 0.00],
    [0.25, 0.00],
    [0.25, 0.04],
    [0.21, 0.07],
    [0.17, 0.10],
    [0.14, 0.14],
    [0.12, 0.20],
    [0.11, 0.28],
    [0.10, 0.36],
    [0.11, 0.42],
    [0.13, 0.48],
    [0.16, 0.52],
    [0.15, 0.55],
    [0.13, 0.58],
    [0.11, 0.60],
    [0.09, 0.63],
    [0.07, 0.66],
    [0.00, 0.68],
  ], 36);
  return latheFromProfile(profile);
}

function createKingCross() {
  const group = new THREE.Group();
  // Vertical bar
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 0.06));
  vBar.position.y = 0.78;
  group.add(vBar);
  // Horizontal bar
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06));
  hBar.position.y = 0.74;
  group.add(hBar);
  return group;
}

// ============================================================================
// MATERIALS — MeshToonMaterial with gradient ramps + washi/sumi noise
// ============================================================================

function createPieceMaterial(isWhite, isSelected) {
  const selectedColor = 0x50b860;
  const baseColor = isWhite ? 0xd8d0c0 : 0x3a3530;
  const color = isSelected ? selectedColor : baseColor;

  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: isWhite ? whiteGradientRamp : blackGradientRamp,
    map: isWhite ? getWhiteWashi() : getBlackSumi(),
    emissive: isWhite ? 0x9a8a70 : 0x3a2818,
    emissiveIntensity: 0.20,
  });

  return mat;
}

// Ink outline material — dark, unlit, for inverted hull outlines
const _outlineMatWhite = new THREE.MeshBasicMaterial({
  color: 0x1a1008,
  side: THREE.BackSide,
});
const _outlineMatBlack = new THREE.MeshBasicMaterial({
  color: 0x0a0804,
  side: THREE.BackSide,
});

// Cache outline geometries (scaled versions)
const _outlineGeoCache = new WeakMap();

function getOutlineGeometry(srcGeo, scale) {
  if (_outlineGeoCache.has(srcGeo)) return _outlineGeoCache.get(srcGeo);

  const outGeo = srcGeo.clone();
  // Scale position attribute outward along normals
  const pos = outGeo.getAttribute('position');
  const norm = outGeo.getAttribute('normal');
  if (pos && norm) {
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) + norm.getX(i) * scale);
      pos.setY(i, pos.getY(i) + norm.getY(i) * scale);
      pos.setZ(i, pos.getZ(i) + norm.getZ(i) * scale);
    }
    pos.needsUpdate = true;
  }

  _outlineGeoCache.set(srcGeo, outGeo);
  return outGeo;
}

// ============================================================================
// PIECE MESH FACTORY
// ============================================================================
export function createPieceMesh(type, color, isSelected = false) {
  const group = new THREE.Group();
  const isWhite = color === 'white';
  const mat = createPieceMaterial(isWhite, isSelected);
  const outlineMat = isWhite ? _outlineMatWhite : _outlineMatBlack;
  const outlineScale = 0.025; // thicker ink outlines for sumi-e look

  const addMesh = (geo, withOutline = true) => {
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    if (withOutline) {
      const outGeo = getOutlineGeometry(geo, outlineScale);
      const outline = new THREE.Mesh(outGeo, outlineMat);
      group.add(outline);
    }
    return mesh;
  };

  const addMeshAt = (geo, pos, rot, withOutline = false) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    if (rot) mesh.rotation.copy(rot);
    group.add(mesh);
    if (withOutline) {
      const outGeo = getOutlineGeometry(geo, outlineScale);
      const outline = new THREE.Mesh(outGeo, outlineMat);
      outline.position.copy(pos);
      if (rot) outline.rotation.copy(rot);
      group.add(outline);
    }
    return mesh;
  };

  // Use cached geometries — created once, reused for all instances
  switch (type) {
    case 'pawn': {
      if (!geoCache.pawn) geoCache.pawn = createPawnGeometry();
      addMesh(geoCache.pawn);
      break;
    }
    case 'rook': {
      if (!geoCache.rook) geoCache.rook = createRookGeometry();
      if (!geoCache.rookCren) geoCache.rookCren = createRookCrenellations();
      addMesh(geoCache.rook);
      geoCache.rookCren.children.forEach(child => {
        addMeshAt(child.geometry, child.position, child.rotation);
      });
      break;
    }
    case 'bishop': {
      if (!geoCache.bishop) geoCache.bishop = createBishopGeometry();
      if (!geoCache.bishopSlit) geoCache.bishopSlit = createBishopMitreSlit();
      if (!geoCache.bishopFinial) geoCache.bishopFinial = new THREE.SphereGeometry(0.04, 12, 12);
      addMesh(geoCache.bishop);
      const slit = new THREE.Mesh(geoCache.bishopSlit.geometry, new THREE.MeshBasicMaterial({ color: 0x0a0806 }));
      slit.position.copy(geoCache.bishopSlit.position);
      slit.rotation.copy(geoCache.bishopSlit.rotation);
      group.add(slit);
      const finial = new THREE.Mesh(geoCache.bishopFinial, mat);
      finial.position.y = 0.73;
      group.add(finial);
      break;
    }
    case 'knight': {
      if (!geoCache.knight) geoCache.knight = createKnightGeometry();
      const { baseGeo, parts } = geoCache.knight;
      addMesh(baseGeo);
      parts.forEach(part => {
        addMeshAt(part.geometry, part.position, part.rotation);
      });
      break;
    }
    case 'queen': {
      if (!geoCache.queen) geoCache.queen = createQueenGeometry();
      if (!geoCache.queenCrown) geoCache.queenCrown = createQueenCrown();
      addMesh(geoCache.queen);
      geoCache.queenCrown.children.forEach(child => {
        addMeshAt(child.geometry, child.position, child.rotation);
      });
      break;
    }
    case 'king': {
      if (!geoCache.king) geoCache.king = createKingGeometry();
      if (!geoCache.kingCross) geoCache.kingCross = createKingCross();
      addMesh(geoCache.king);
      geoCache.kingCross.children.forEach(child => {
        addMeshAt(child.geometry, child.position, child.rotation);
      });
      break;
    }
  }

  return group;
}
