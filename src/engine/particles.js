import * as THREE from 'three';

// ============================================================================
// INK SPLASH PARTICLE SYSTEM
// GPU-accelerated particles for correct-answer celebrations
// ============================================================================

const PARTICLE_COUNT = 80;
const PARTICLE_LIFETIME = 1.5;

const particleVertexShader = `
  attribute float size;
  attribute float life;
  attribute float seed;
  varying float vLife;
  varying float vSeed;

  void main() {
    vLife = life;
    vSeed = seed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vLife;
  varying float vSeed;

  void main() {
    // Circular particle with soft edges
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // Ink splatter shape - irregular edges
    float angle = atan(center.y, center.x);
    float wobble = 0.4 + 0.1 * sin(angle * 5.0 + vSeed * 20.0)
                       + 0.05 * sin(angle * 11.0 + vSeed * 40.0);
    if (dist > wobble) discard;

    // Ink colour - dark with slight warm tint
    float alpha = (1.0 - vLife) * (1.0 - dist / wobble) * 0.8;

    // Mix between dark ink and accent colour based on seed
    vec3 inkColor = mix(
      vec3(0.05, 0.03, 0.02),  // Dark sumi ink
      mix(vec3(0.6, 0.1, 0.1), vec3(0.1, 0.1, 0.5), vSeed),  // Red or blue accent
      0.15 + vSeed * 0.2
    );

    gl_FragColor = vec4(inkColor, alpha);
  }
`;

export class InkSplashSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.elapsed = 0;

    // Buffers
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.velocities = new Float32Array(PARTICLE_COUNT * 3);
    this.sizes = new Float32Array(PARTICLE_COUNT);
    this.lives = new Float32Array(PARTICLE_COUNT);
    this.seeds = new Float32Array(PARTICLE_COUNT);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    geometry.setAttribute('life', new THREE.BufferAttribute(this.lives, 1));
    geometry.setAttribute('seed', new THREE.BufferAttribute(this.seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.points = new THREE.Points(geometry, material);
    this.points.visible = false;
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  emit(worldX, worldY, worldZ) {
    this.active = true;
    this.elapsed = 0;
    this.points.visible = true;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start position at the piece location
      this.positions[i * 3] = worldX;
      this.positions[i * 3 + 1] = worldY + 0.3;
      this.positions[i * 3 + 2] = worldZ;

      // Random velocity - burst upward and outward
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6;
      const speed = 1.5 + Math.random() * 3.0;
      this.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i * 3 + 1] = Math.cos(phi) * speed * 0.8 + 1.0;
      this.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      // Size varies for organic look
      this.sizes[i] = 0.15 + Math.random() * 0.4;

      // Life starts at 0
      this.lives[i] = 0;

      // Random seed for each particle's appearance
      this.seeds[i] = Math.random();
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.size.needsUpdate = true;
    this.points.geometry.attributes.life.needsUpdate = true;
    this.points.geometry.attributes.seed.needsUpdate = true;
  }

  update(delta) {
    if (!this.active) return;

    this.elapsed += delta;
    if (this.elapsed > PARTICLE_LIFETIME) {
      this.active = false;
      this.points.visible = false;
      return;
    }

    const gravity = -4.0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Update life
      this.lives[i] = this.elapsed / PARTICLE_LIFETIME;

      // Physics
      this.velocities[i * 3 + 1] += gravity * delta;

      // Apply velocity
      this.positions[i * 3] += this.velocities[i * 3] * delta;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * delta;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * delta;

      // Grow particles as they age (ink spreading)
      this.sizes[i] *= 1.0 + delta * 0.5;

      // Air resistance
      this.velocities[i * 3] *= 0.98;
      this.velocities[i * 3 + 2] *= 0.98;
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.size.needsUpdate = true;
    this.points.geometry.attributes.life.needsUpdate = true;
  }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.scene.remove(this.points);
  }
}
