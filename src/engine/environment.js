import * as THREE from 'three';
import {
  createWoodGrainTexture,
  createShojiWashiTexture,
  createFabricWeaveTexture,
  createTatamiTexture,
  createFloorTexture,
} from './textures.js';

// ============================================================================
// LIMO INTERIOR — Phase D: Textured materials
// Geometry preserved. All textures procedural (Canvas-based).
// ============================================================================

// Texture caches — created once, shared across all environment meshes
let _woodDarkTex = null;
let _woodFrameTex = null;
let _shojiTex = null;
let _fabricTex = null;
let _tatamiTex = null;
let _floorTex = null;

function getWoodDarkTex()  { return _woodDarkTex  || (_woodDarkTex  = createWoodGrainTexture(0.12)); }
function getWoodFrameTex() { return _woodFrameTex || (_woodFrameTex = createWoodGrainTexture(0.10)); }
function getShojiTex()     { return _shojiTex     || (_shojiTex     = createShojiWashiTexture()); }
function getFabricTex()    { return _fabricTex    || (_fabricTex    = createFabricWeaveTexture()); }
function getTatamiTex()    { return _tatamiTex    || (_tatamiTex    = createTatamiTexture()); }
function getFloorTex()     { return _floorTex     || (_floorTex     = createFloorTexture()); }

// Material palette — textured, all matte (no shininess, Ghibli warmth)
const MAT = {
  darkWood: () => new THREE.MeshStandardMaterial({
    color: 0x3a2820, roughness: 0.80, metalness: 0,
    map: getWoodDarkTex(),
  }),
  richPanel: () => new THREE.MeshStandardMaterial({
    color: 0x4a3528, roughness: 0.75, metalness: 0,
    map: getWoodDarkTex(),
  }),
  shoji: () => new THREE.MeshStandardMaterial({
    color: 0xc8bc98, roughness: 0.95, metalness: 0,
    map: getShojiTex(),
    emissive: 0x302818,
    emissiveIntensity: 0.05,
  }),
  frame: () => new THREE.MeshStandardMaterial({
    color: 0x2e2018, roughness: 0.70, metalness: 0,
    map: getWoodFrameTex(),
  }),
  floor: () => new THREE.MeshStandardMaterial({
    color: 0x1a1410, roughness: 0.85, metalness: 0,
    map: getFloorTex(),
  }),
  tatami: () => new THREE.MeshStandardMaterial({
    color: 0x8a7a58, roughness: 0.90, metalness: 0,
    map: getTatamiTex(),
  }),
  cushion: () => new THREE.MeshStandardMaterial({
    color: 0x6a2828, roughness: 0.90, metalness: 0,
    map: getFabricTex(),
  }),
  ceiling: () => new THREE.MeshStandardMaterial({
    color: 0x2a2420, roughness: 0.80, metalness: 0,
    map: getWoodDarkTex(),
  }),
  bench: () => new THREE.MeshStandardMaterial({
    color: 0x3a2820, roughness: 0.80, metalness: 0,
    map: getWoodDarkTex(),
  }),
  wainscot: () => new THREE.MeshStandardMaterial({
    color: 0x3a2820, roughness: 0.75, metalness: 0,
    map: getWoodDarkTex(),
  }),
  // Dark backing behind shoji to simulate exterior darkness
  shojiBacking: () => new THREE.MeshBasicMaterial({
    color: 0x080604,
    transparent: true,
    opacity: 0.6,
  }),
};

export function createLimousineInterior(scene) {

  // FLOOR
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), MAT.floor());
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  const tatami = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 8.0), MAT.tatami());
  tatami.rotation.x = -Math.PI / 2;
  tatami.position.y = -1.1;
  scene.add(tatami);

  // TABLE LEGS
  const legGeo = new THREE.BoxGeometry(0.12, 1.0, 0.12);
  const legMat = MAT.darkWood();
  const legPositions = [
    [-2.9, -0.58, -2.9],
    [ 2.9, -0.58, -2.9],
    [-2.9, -0.58,  2.9],
    [ 2.9, -0.58,  2.9],
  ];
  for (const [x, y, z] of legPositions) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, y, z);
    scene.add(leg);
  }

  // TABLE EDGE TRIM
  const edgeTrim = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.05, 6.4), MAT.frame());
  edgeTrim.position.y = -0.11;
  scene.add(edgeTrim);

  // TABLE APRONS
  const apronMat = MAT.darkWood();
  const frontApron = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.25, 0.06), apronMat);
  frontApron.position.set(0, -0.22, 3.1);
  scene.add(frontApron);
  const leftApron = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 6.2), apronMat);
  leftApron.position.set(-3.1, -0.22, 0);
  scene.add(leftApron);
  const rightApron = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 6.2), apronMat);
  rightApron.position.set(3.1, -0.22, 0);
  scene.add(rightApron);
  const backApron = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.25, 0.06), apronMat);
  backApron.position.set(0, -0.22, -3.1);
  scene.add(backApron);

  // WALLS
  buildSideWall(scene, -6.0);
  buildSideWall(scene,  6.0);
  buildBackWall(scene);

  // BENCHES
  buildBench(scene, -5.0);
  buildBench(scene,  5.0);

  // CEILING
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 16), MAT.ceiling());
  ceiling.position.set(0, 6, 0);
  scene.add(ceiling);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 0.2), MAT.frame());
  beam.position.set(0, 5.85, -2.0);
  scene.add(beam);

  return {};
}

function buildSideWall(scene, xPos) {
  const wallDepth = 12.0;

  const wainscot = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.5, wallDepth), MAT.wainscot()
  );
  wainscot.position.set(xPos, -0.35, 0);
  scene.add(wainscot);

  const divider = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, wallDepth), MAT.frame()
  );
  divider.position.set(xPos, 0.45, 0);
  scene.add(divider);

  // Shoji panel
  const shoji = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 2.0, wallDepth - 0.5), MAT.shoji()
  );
  shoji.position.set(xPos, 1.5, 0);
  scene.add(shoji);

  // Dark backing behind shoji (exterior darkness)
  const backingOffset = xPos > 0 ? 0.05 : -0.05; // place outside of shoji
  const shojiBacking = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 2.0, wallDepth - 0.5), MAT.shojiBacking()
  );
  shojiBacking.position.set(xPos + backingOffset, 1.5, 0);
  scene.add(shojiBacking);

  const frameMat = MAT.frame();
  const frameGeo = new THREE.BoxGeometry(0.15, 2.2, 0.15);

  const frontFrame = new THREE.Mesh(frameGeo, frameMat);
  frontFrame.position.set(xPos, 1.45, wallDepth / 2 - 0.1);
  scene.add(frontFrame);

  const backFrame = new THREE.Mesh(frameGeo, frameMat);
  backFrame.position.set(xPos, 1.45, -(wallDepth / 2 - 0.1));
  scene.add(backFrame);

  const vDivGeo = new THREE.BoxGeometry(0.10, 2.0, 0.06);
  for (const zOff of [-3.6, -1.2, 1.2, 3.6]) {
    const vDiv = new THREE.Mesh(vDivGeo, frameMat);
    vDiv.position.set(xPos, 1.5, zOff);
    scene.add(vDiv);
  }

  const hBarGeo = new THREE.BoxGeometry(0.08, 0.04, wallDepth - 0.6);
  for (const yOff of [0.9, 1.3, 1.7, 2.1]) {
    const hBar = new THREE.Mesh(hBarGeo, frameMat);
    hBar.position.set(xPos, yOff, 0);
    scene.add(hBar);
  }

  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, wallDepth), frameMat
  );
  topRail.position.set(xPos, 2.55, 0);
  scene.add(topRail);
}

function buildBackWall(scene) {
  const z = -7.0;

  const lowerPanel = new THREE.Mesh(
    new THREE.BoxGeometry(12.0, 1.5, 0.08), MAT.richPanel()
  );
  lowerPanel.position.set(0, 0.15, z);
  scene.add(lowerPanel);

  // Back shoji screen
  const shojiScreen = new THREE.Mesh(
    new THREE.BoxGeometry(11.5, 2.5, 0.06), MAT.shoji()
  );
  shojiScreen.position.set(0, 2.25, z);
  scene.add(shojiScreen);

  // Dark backing behind back shoji
  const shojiBacking = new THREE.Mesh(
    new THREE.BoxGeometry(11.5, 2.5, 0.02), MAT.shojiBacking()
  );
  shojiBacking.position.set(0, 2.25, z - 0.05);
  scene.add(shojiBacking);

  const frameMat = MAT.frame();

  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.08, 0.12), frameMat);
  bottomRail.position.set(0, 0.95, z);
  scene.add(bottomRail);

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.08, 0.12), frameMat);
  topRail.position.set(0, 3.55, z);
  scene.add(topRail);

  const leftVert = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.12), frameMat);
  leftVert.position.set(-5.8, 2.25, z);
  scene.add(leftVert);

  const rightVert = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.12), frameMat);
  rightVert.position.set(5.8, 2.25, z);
  scene.add(rightVert);

  const innerVertGeo = new THREE.BoxGeometry(0.08, 2.5, 0.10);
  for (const xOff of [-1.9, 1.9]) {
    const v = new THREE.Mesh(innerVertGeo, frameMat);
    v.position.set(xOff, 2.25, z);
    scene.add(v);
  }

  const hBarGeo = new THREE.BoxGeometry(11.4, 0.04, 0.08);
  for (const yOff of [1.4, 1.9, 2.4, 2.9]) {
    const hBar = new THREE.Mesh(hBarGeo, frameMat);
    hBar.position.set(0, yOff, z);
    scene.add(hBar);
  }
}

function buildBench(scene, xPos) {
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.15, 7.0), MAT.bench()
  );
  platform.position.set(xPos, -0.5, 0);
  scene.add(platform);

  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.12, 6.5), MAT.cushion()
  );
  cushion.position.set(xPos, -0.38, 0);
  scene.add(cushion);
}
