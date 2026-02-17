import * as THREE from 'three';
import { createPieceMesh } from './pieces.js';
import { createLimousineInterior } from './environment.js';
import { PostProcessing, isMobile } from './postprocessing.js';
import { InkSplashSystem } from './particles.js';
import {
  createParchmentTexture,
  createSumiBrownTexture,
  createWoodGrainTexture,
} from './textures.js';

// ============================================================================
// MAIN 3D CHESS SCENE
// ============================================================================
export class ChessScene {
  constructor(container, onSquareClick) {
    this.container = container;
    this.onSquareClick = onSquareClick;
    this.pieces = new Map();
    this.squares = [];
    this.selectedSquare = null;
    this.validMoves = [];
    this.hintPiece = null;
    this.hintSquare = null;
    this.showMoveArrow = null;
    this.animatingPieces = [];
    this.cameraShake = 0;
    this.time = 0;
    this.init();
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e0c14);

    // Camera from Black's perspective — adjusts for portrait (phone) screens
    const aspect = w / h;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 200);
    this._setupCamera(aspect);
    this.baseCamPos = this.camera.position.clone();

    this.mobile = isMobile();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.mobile,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(w, h);
    // Cap pixel ratio at 1.5 — higher values destroy performance with post-processing
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = false;
    this.container.appendChild(this.renderer.domElement);

    // =====================================================================
    // LIGHTING — Phase C: 5-layer comprehensive lighting
    // =====================================================================

    // C.1 — Hemisphere ambient: warm cream sky, cool dark ground
    this.hemiLight = new THREE.HemisphereLight(0xe8dcc8, 0x3a3a4a, 1.00);
    this.scene.add(this.hemiLight);

    // C.2 — Reading lamp: warm SpotLight pool on the chessboard
    // Angle PI/4 covers full board corners; penumbra 0.6 for soft falloff
    this.readingLamp = new THREE.SpotLight(0xfff0d0, 15.0);
    this.readingLamp.position.set(0, 4.0, 0.3);
    this.readingLamp.angle = Math.PI / 4;
    this.readingLamp.penumbra = 0.6;
    this.readingLamp.distance = 12;
    this.readingLamp.decay = 1.5;
    this.readingLamp.target.position.set(0, 0, 0.3);
    this.scene.add(this.readingLamp);
    this.scene.add(this.readingLamp.target);

    // C.3 — Camera fill: slightly cool PointLight between camera and board
    // Lower than camera (y=3.5 vs camera y=6) to light piece fronts from the side
    // rather than from above — gives better 3D contour definition
    this.cameraFill = new THREE.PointLight(0xf0ecff, 5.0, 20, 1.0);
    this.cameraFill.position.set(0, 3.5, 5.5);
    this.scene.add(this.cameraFill);

    // C.3b — Steep camera fill: PointLight from steeper overhead angle
    // Supplements primary fill from closer to the camera's own perspective
    this.cameraFillHigh = new THREE.PointLight(0xf0ecff, 5.0, 20, 1.0);
    this.cameraFillHigh.position.set(0, 5.0, 3.5);
    this.scene.add(this.cameraFillHigh);

    // C.4 — Stationary exterior lanterns: warm candle glow at back cabin corners
    const leftLantern = new THREE.PointLight(0xff9030, 2.0, 10, 1.0);
    leftLantern.position.set(-5.5, 1.5, -5.0);
    this.scene.add(leftLantern);

    const rightLantern = new THREE.PointLight(0xff9030, 2.0, 10, 1.0);
    rightLantern.position.set(5.5, 1.5, -5.0);
    this.scene.add(rightLantern);

    this.stationaryLanterns = [leftLantern, rightLantern];
    this.stationaryBaseIntensity = 2.0;  // base for UI control (flicker modulates this)

    // C.5 — Passing exterior lanterns: 3 per side, scrolling along Z
    this.passingBaseIntensity = 0.50;  // base for UI control (flicker*fade modulates this)
    this.passingLanterns = [];
    const spacing = 5.0;
    for (let side = 0; side < 2; side++) {
      const x = side === 0 ? -5.9 : 5.9;
      for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xffaa40, 0, 8, 1.2);
        light.position.set(x, 1.5, -6 + i * spacing + side * 2.5);
        this.scene.add(light);
        this.passingLanterns.push({
          light,
          phase: side * 3.14 + i * 2.09
        });
      }
    }

    // Emissive glow intensities (controllable via lighting panel)
    // Raised from 0.15/0.12 to give warmer self-glow (Ghibli warmth)
    this.boardGlowIntensity = 0.22;
    this.pieceGlowIntensity = 0.20;

    // Build environment
    this.limoRefs = createLimousineInterior(this.scene);

    // Board and pieces
    this.createBoard();
    this.createLabels();

    // Post-processing
    this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);

    // Ink splash particles
    this.inkSplash = new InkSplashSystem(this.scene);

    // Interaction — unified pointer events for click + drag-and-drop
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragState = null;      // { mesh, fromFile, fromRank, origPos }
    this._pointerStart = null;  // { x, y }
    this._isDragging = false;
    this._boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.06);

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    el.addEventListener('pointermove', this.handlePointerMove.bind(this));
    el.addEventListener('pointerup', this.handlePointerUp.bind(this));
    el.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
    this._boundResize = this.handleResize.bind(this);
    window.addEventListener('resize', this._boundResize);

    this.clock = new THREE.Clock();
    this.animate();
  }

  createBoard() {
    // Procedural texture caches (created once) — variation-only, no darkening
    const tableWoodTex = createWoodGrainTexture(0.15);
    const borderWoodTex = createWoodGrainTexture(0.12);
    const parchmentTex = createParchmentTexture();
    const sumiBrownTex = createSumiBrownTexture();

    // Table surface — matte wood, no shininess (Ghibli feel)
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x5a4030, roughness: 0.80, metalness: 0,
      map: tableWoodTex,
    });
    const table = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.1, 6.2), tableMat);
    table.position.y = -0.08;
    this.scene.add(table);

    // Board border — warm wood frame, matte
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0x6a5030, roughness: 0.70, metalness: 0,
      map: borderWoodTex,
    });
    const border = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.06, 5.0), borderMat);
    border.position.y = -0.01;
    this.scene.add(border);

    // Squares — flat PlaneGeometry with noise textures, matte paper feel
    const sqSize = 0.56;
    const sqGeo = new THREE.PlaneGeometry(sqSize - 0.025, sqSize - 0.025);

    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const isLight = (file + rank) % 2 === 1;
        const baseColor = isLight ? 0xd4c4a0 : 0x5a4030;
        const mat = new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: isLight ? 0.85 : 0.80,
          metalness: 0,
          map: isLight ? parchmentTex : sumiBrownTex,
          emissive: isLight ? 0x8a7a60 : 0x3a2818,
          emissiveIntensity: this.boardGlowIntensity
        });
        const sq = new THREE.Mesh(sqGeo, mat);
        sq.rotation.x = -Math.PI / 2;
        sq.position.set((file - 3.5) * sqSize, 0.03, (rank - 3.5) * sqSize);
        sq.userData = { file, rank, isLight, baseColor };
        this.scene.add(sq);
        this.squares.push(sq);
      }
    }
  }

  createLabels() {
    const sqSize = 0.56;
    const boardEdge = 4 * sqSize; // Half the 8-square board width = 2.24

    const createLabel = (text, x, y, z, size = 0.34) => {
      const canvas = document.createElement('canvas');
      const res = 128;
      canvas.width = res;
      canvas.height = res;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, res, res);
      ctx.font = `bold ${Math.floor(res * 0.7)}px Georgia, serif`;
      ctx.fillStyle = '#ffcc35';  // Rich amber-gold — warmer and more golden
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, res / 2, res / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      // MeshBasicMaterial is self-emissive (unaffected by scene lights).
      // fog: false ensures fog doesn't dim labels at board edges.
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        color: 0xffffff,
        fog: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
      mesh.position.set(x, y, z);
      mesh.rotation.x = -Math.PI / 2;
      this.scene.add(mesh);
    };

    // File labels (a-h) — centered within the board border margin (+Z side)
    // Border edge at 2.5, board edge at 2.24. Label center at midpoint = 2.37
    const files = 'abcdefgh';
    const fileLabelZ = boardEdge + 0.13;  // 2.24 + 0.13 = 2.37, well within 2.5 border
    for (let i = 0; i < 8; i++) {
      createLabel(files[i], (i - 3.5) * sqSize, 0.04, fileLabelZ, 0.34);
    }

    // Rank labels (1-8) — centered within the board border margin (left side, -X)
    const rankLabelX = -(boardEdge + 0.13);  // -2.37, well within -2.5 border
    for (let i = 0; i < 8; i++) {
      createLabel(String(i + 1), rankLabelX, 0.04, (i - 3.5) * sqSize, 0.34);
    }
  }

  setPieces(piecesData) {
    this.pieces.forEach(mesh => this.scene.remove(mesh));
    this.pieces.clear();
    this.animatingPieces = [];

    const sqSize = 0.56;
    piecesData.forEach(p => {
      const mesh = createPieceMesh(p.type, p.color);
      mesh.position.set((p.file - 3.5) * sqSize, 0.06, (p.rank - 3.5) * sqSize);
      // Knights face toward the opponent: black knights rotate 180° to face -Z
      if (p.type === 'knight' && p.color === 'black') {
        mesh.rotation.y = Math.PI;
      }
      mesh.userData = { file: p.file, rank: p.rank, color: p.color, type: p.type };
      this.scene.add(mesh);
      this.pieces.set(`${p.file}-${p.rank}`, mesh);
    });

    // Apply current piece glow intensity to newly created pieces
    this._updatePieceGlow(this.pieceGlowIntensity);
  }

  updatePieceAppearance(file, rank, isSelected) {
    const key = `${file}-${rank}`;
    const group = this.pieces.get(key);
    if (!group) return;

    const { color } = group.userData;
    const isWhite = color === 'white';
    const selectedColor = new THREE.Color(0x50b860);
    const normalColor = new THREE.Color(isWhite ? 0xd8d0c0 : 0x3a3530);
    const targetColor = isSelected ? selectedColor : normalColor;

    group.children.forEach(child => {
      if (child.isMesh && child.material?.color) {
        // Skip outline meshes (MeshBasicMaterial with BackSide rendering)
        if (child.material.side === THREE.BackSide) return;
        child.material.color.copy(targetColor);
      }
    });
  }

  animateMove(fromFile, fromRank, toFile, toRank, onComplete) {
    const key = `${fromFile}-${fromRank}`;
    const mesh = this.pieces.get(key);
    if (!mesh) { onComplete?.(); return; }

    const destKey = `${toFile}-${toRank}`;
    const destMesh = this.pieces.get(destKey);
    if (destMesh) {
      this.scene.remove(destMesh);
      this.pieces.delete(destKey);
    }

    const sqSize = 0.56;
    this.animatingPieces.push({
      mesh,
      startX: mesh.position.x,
      startZ: mesh.position.z,
      endX: (toFile - 3.5) * sqSize,
      endZ: (toRank - 3.5) * sqSize,
      progress: 0,
      onComplete
    });

    this.pieces.delete(key);
    this.pieces.set(destKey, mesh);
    mesh.userData.file = toFile;
    mesh.userData.rank = toRank;
  }

  triggerInkSplash(file, rank) {
    const sqSize = 0.56;
    const x = (file - 3.5) * sqSize;
    const z = (rank - 3.5) * sqSize;
    this.inkSplash.emit(x, 0.1, z);
  }

  showCorrectMove(from, to) { this.showMoveArrow = { from, to }; }
  clearCorrectMove() { this.showMoveArrow = null; }
  triggerCameraShake() { this.cameraShake = 0.28; }

  setSelection(selected, valid) {
    if (this.selectedSquare) {
      this.updatePieceAppearance(this.selectedSquare[0], this.selectedSquare[1], false);
    }
    this.selectedSquare = selected;
    this.validMoves = valid || [];
    if (selected) {
      this.updatePieceAppearance(selected[0], selected[1], true);
    }
    this.updateSquareColors();
  }

  setHints(hintPiece, hintSquare) {
    this.hintPiece = hintPiece;
    this.hintSquare = hintSquare;
  }

  clearHints() {
    this.hintPiece = null;
    this.hintSquare = null;
  }

  // Lighting control API — returns current intensities for all controllable lights
  getLightIntensities() {
    return {
      hemisphere: this.hemiLight.intensity,
      readingLamp: this.readingLamp.intensity,
      cameraFill: this.cameraFill.intensity,
      cameraFillHigh: this.cameraFillHigh.intensity,
      stationaryLanterns: this.stationaryBaseIntensity,
      passingLanterns: this.passingBaseIntensity,
      boardGlow: this.boardGlowIntensity,
      pieceGlow: this.pieceGlowIntensity,
    };
  }

  // Set a specific light's intensity by key
  setLightIntensity(key, value) {
    const v = Math.max(0, Math.round(value * 100) / 100);
    switch (key) {
      case 'hemisphere': this.hemiLight.intensity = v; break;
      case 'readingLamp': this.readingLamp.intensity = v; break;
      case 'cameraFill': this.cameraFill.intensity = v; break;
      case 'cameraFillHigh': this.cameraFillHigh.intensity = v; break;
      case 'stationaryLanterns': this.stationaryBaseIntensity = v; break;
      case 'passingLanterns': this.passingBaseIntensity = v; break;
      case 'boardGlow': this.boardGlowIntensity = v; this._updateBoardGlow(v); break;
      case 'pieceGlow': this.pieceGlowIntensity = v; this._updatePieceGlow(v); break;
    }
  }

  _updateBoardGlow(intensity) {
    this.squares.forEach(sq => {
      sq.material.emissiveIntensity = intensity;
    });
  }

  _updatePieceGlow(intensity) {
    this.pieces.forEach(group => {
      group.children.forEach(child => {
        if (child.isMesh && child.material?.emissiveIntensity !== undefined) {
          // Skip outline meshes
          if (child.material.side === THREE.BackSide) return;
          child.material.emissiveIntensity = intensity;
        }
      });
    });
  }

  updateSquareColors() {
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 4);

    this.squares.forEach(sq => {
      const { file, rank, isLight, baseColor } = sq.userData;
      const isSelected = this.selectedSquare?.[0] === file && this.selectedSquare?.[1] === rank;
      const isValid = this.validMoves.some(m => m[0] === file && m[1] === rank);
      const isHintP = this.hintPiece?.[0] === file && this.hintPiece?.[1] === rank;
      const isHintS = this.hintSquare?.[0] === file && this.hintSquare?.[1] === rank;
      const isCorrectFrom = this.showMoveArrow?.from[0] === file && this.showMoveArrow?.from[1] === rank;
      const isCorrectTo = this.showMoveArrow?.to[0] === file && this.showMoveArrow?.to[1] === rank;

      let color = baseColor;

      if (isCorrectFrom) {
        const i = 0.55 + pulse * 0.45;
        color = new THREE.Color(0.2 * i, 0.4 * i, 0.85 * i).getHex();
      } else if (isCorrectTo) {
        const i = 0.7 + pulse * 0.3;
        color = new THREE.Color(0.15 * i, 0.6 * i, 0.95 * i).getHex();
      } else if (isSelected) {
        color = 0x58c858;
      } else if (isValid) {
        color = isLight ? 0x85e085 : 0x48a848;
      } else if (isHintP) {
        color = new THREE.Color(0.85 + pulse * 0.15, 0.65 + pulse * 0.15, 0.1).getHex();
      } else if (isHintS) {
        color = new THREE.Color(0.25, 0.68 + pulse * 0.15, 0.8 + pulse * 0.12).getHex();
      }

      sq.material.color.setHex(color);
    });
  }

  // ---------- Pointer event handlers (unified click + drag-and-drop) ----------

  _updateMouse(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _hitPiece() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const pieceArray = Array.from(this.pieces.values());
    const hits = this.raycaster.intersectObjects(pieceArray, true);
    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj.parent && obj.userData.file === undefined) obj = obj.parent;
      if (obj.userData.file !== undefined) return obj;
    }
    return null;
  }

  _hitSquare() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.squares);
    return hits.length > 0 ? hits[0].object : null;
  }

  handlePointerDown(e) {
    e.preventDefault();
    this._updateMouse(e);
    this._pointerStart = { x: e.clientX, y: e.clientY };
    this._isDragging = false;

    // Check if pointer hit a piece
    const pieceGroup = this._hitPiece();
    if (pieceGroup) {
      const { file, rank } = pieceGroup.userData;
      const mesh = this.pieces.get(`${file}-${rank}`);
      if (mesh) {
        this.dragState = {
          mesh,
          fromFile: file,
          fromRank: rank,
          origPos: mesh.position.clone(),
          origRotY: mesh.rotation.y
        };
        // Capture pointer for reliable move/up events
        this.renderer.domElement.setPointerCapture(e.pointerId);
      }
    }
  }

  handlePointerMove(e) {
    if (!this.dragState || !this._pointerStart) return;

    const dx = e.clientX - this._pointerStart.x;
    const dy = e.clientY - this._pointerStart.y;

    // Require minimum movement to enter drag mode (prevents accidental drags)
    if (!this._isDragging && Math.abs(dx) + Math.abs(dy) > 6) {
      this._isDragging = true;
      // Fire selection on drag start (same as clicking the piece)
      this.onSquareClick(this.dragState.fromFile, this.dragState.fromRank, 'piece');
    }

    if (this._isDragging) {
      this._updateMouse(e);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersection = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this._boardPlane, intersection)) {
        this.dragState.mesh.position.x = intersection.x;
        this.dragState.mesh.position.z = intersection.z;
        this.dragState.mesh.position.y = 0.4; // Elevated above board
      }
    }
  }

  handlePointerUp(e) {
    this._updateMouse(e);

    if (this._isDragging && this.dragState) {
      // --- DRAG DROP ---
      // Snap piece back to original position before processing
      this.dragState.mesh.position.copy(this.dragState.origPos);
      this.dragState.mesh.rotation.y = this.dragState.origRotY;

      // Find what square the pointer is over
      const sq = this._hitSquare();
      if (sq) {
        // Drop on a square → trigger move (same as second click)
        this.onSquareClick(sq.userData.file, sq.userData.rank, 'square');
      } else {
        // Off-board → deselect (click same piece again)
        this.onSquareClick(this.dragState.fromFile, this.dragState.fromRank, 'piece');
      }
    } else if (this.dragState && !this._isDragging) {
      // --- REGULAR CLICK on a piece (no significant movement) ---
      this.onSquareClick(this.dragState.fromFile, this.dragState.fromRank, 'piece');
    } else {
      // --- CLICK on empty area or square (no piece under pointer) ---
      const sq = this._hitSquare();
      if (sq) {
        this.onSquareClick(sq.userData.file, sq.userData.rank, 'square');
      }
    }

    this.dragState = null;
    this._isDragging = false;
    this._pointerStart = null;
    try { this.renderer.domElement.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  handlePointerCancel(e) {
    // Pointer cancelled (e.g., by system) — snap back and clean up
    if (this.dragState) {
      this.dragState.mesh.position.copy(this.dragState.origPos);
      this.dragState.mesh.rotation.y = this.dragState.origRotY;
    }
    this.dragState = null;
    this._isDragging = false;
    this._pointerStart = null;
  }

  _setupCamera(aspect) {
    if (aspect < 0.8) {
      // Portrait phone — pull camera back and widen FOV to fit board
      this.camera.fov = 55;
      this.camera.position.set(0, 10, 9);
    } else {
      // Landscape / desktop — slightly further back than original for more UI room
      this.camera.fov = 38;
      this.camera.position.set(0, 6, 5.8);
    }
    this.camera.lookAt(0, 0, 0.3);
    this.camera.updateProjectionMatrix();
    this.baseCamPos = this.camera.position.clone();
  }

  handleResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this._setupCamera(w / h);
    this.renderer.setSize(w, h);
    this.postProcessing.resize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.time += delta;

    // Piece animations
    this.animatingPieces = this.animatingPieces.filter(anim => {
      anim.progress += delta * 2.4;
      const t = Math.min(anim.progress, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      anim.mesh.position.x = anim.startX + (anim.endX - anim.startX) * eased;
      anim.mesh.position.z = anim.startZ + (anim.endZ - anim.startZ) * eased;
      anim.mesh.position.y = 0.06 + Math.sin(t * Math.PI) * 0.28;

      if (t >= 1) {
        anim.mesh.position.y = 0.06;
        anim.onComplete?.();
        return false;
      }
      return true;
    });

    // Camera shake
    if (this.cameraShake > 0) {
      this.cameraShake -= delta * 1.5;
      const shake = this.cameraShake * 0.06;
      this.camera.position.x = this.baseCamPos.x + (Math.random() - 0.5) * shake;
      this.camera.position.y = this.baseCamPos.y + (Math.random() - 0.5) * shake;
    } else {
      this.camera.position.copy(this.baseCamPos);
    }

    // Subtle car sway
    const sway = Math.sin(this.time * 0.4) * 0.003;
    this.camera.rotation.z = sway;

    // Update square colours for pulsing hints — throttled to ~15fps
    if (this.hintPiece || this.hintSquare || this.showMoveArrow) {
      this._sqTimer = (this._sqTimer || 0) + delta;
      if (this._sqTimer > 0.066) {
        this._sqTimer = 0;
        this.updateSquareColors();
      }
    }

    // Drag wobble — piece hovers and sways while being dragged
    if (this._isDragging && this.dragState) {
      const t = this.time;
      this.dragState.mesh.position.y = 0.4 + Math.sin(t * 4) * 0.03;
      this.dragState.mesh.rotation.y = this.dragState.origRotY + Math.sin(t * 3) * 0.06;
    }

    // C.4 — Stationary lantern flicker (multi-frequency candle)
    for (let i = 0; i < this.stationaryLanterns.length; i++) {
      const lantern = this.stationaryLanterns[i];
      const phase = i * 2.7;
      const flicker = 1.0
        + 0.08 * Math.sin(this.time * 7.3 + phase)
        + 0.05 * Math.sin(this.time * 13.1 + phase * 1.3)
        + 0.03 * Math.sin(this.time * 23.7 + phase * 0.7);
      lantern.intensity = this.stationaryBaseIntensity * Math.max(flicker, 0.85);
    }

    // C.5 — Passing lantern scroll + flicker
    // Lanterns scroll from -Z (ahead) toward +Z (behind) to simulate forward motion
    // Speed: 1.2 units/sec ≈ 20 km/h (treating 12-unit window as ~3m limo panel)
    const scrollSpeed = 1.2;
    const zMin = -7.5;
    const zMax = 7.5;
    const totalRange = zMax - zMin;
    const fadeStart = -5.5;
    const fadeEnd = -7.0;
    const fadeInEnd = 6.0;
    const fadeInStart = 7.0;

    for (let i = 0; i < this.passingLanterns.length; i++) {
      const entry = this.passingLanterns[i];
      // Scroll toward +Z: objects pass from front to back as limo drives forward
      entry.light.position.z += scrollSpeed * delta;

      // Wrap when past the back (+Z end)
      if (entry.light.position.z > zMax) {
        entry.light.position.z -= totalRange;
      }

      const flicker = 1.0
        + 0.10 * Math.sin(this.time * 6.5 + entry.phase)
        + 0.06 * Math.sin(this.time * 11.3 + entry.phase * 1.4);

      const z = entry.light.position.z;
      let fade = 1.0;
      if (z < fadeStart) {
        fade = Math.max((z - fadeEnd) / (fadeStart - fadeEnd), 0);
      } else if (z > fadeInEnd) {
        fade = Math.max((fadeInStart - z) / (fadeInStart - fadeInEnd), 0);
      }

      entry.light.intensity = this.passingBaseIntensity * flicker * fade;
    }

    // Update ink splash particles
    this.inkSplash.update(delta);

    // Render with post-processing
    this.postProcessing.render(this.time);
  }

  dispose() {
    window.removeEventListener('resize', this._boundResize);
    this.postProcessing.dispose();
    this.inkSplash.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
