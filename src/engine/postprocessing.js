import * as THREE from 'three';

// ============================================================================
// POST-PROCESSING — Phase E: ink edges + subtle colour grading
// ============================================================================

export function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (window.innerWidth < 768 && 'ontouchstart' in window);
}

const DOWNSAMPLE = 0.75;

const compositeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const compositeFragmentShader = `
  varying vec2 vUv;

  uniform sampler2D tColor;
  uniform sampler2D tDepth;
  uniform sampler2D tNormal;
  uniform vec2 texelSize;
  uniform float cameraNear;
  uniform float cameraFar;

  uniform vec3 edgeColor;
  uniform float edgeStrength;
  uniform float depthEdgeScale;
  uniform float normalEdgeScale;

  uniform float contrast;
  uniform float saturation;
  uniform float warmth;
  uniform float vignette;
  uniform float grainAmount;
  uniform float time;

  float linearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0;
    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
  }

  float luminance(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float edgeDepth(vec2 uv) {
    float d00 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2(-1.0, -1.0)).r);
    float d10 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2( 0.0, -1.0)).r);
    float d20 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2( 1.0, -1.0)).r);
    float d01 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2(-1.0,  0.0)).r);
    float d21 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2( 1.0,  0.0)).r);
    float d02 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2(-1.0,  1.0)).r);
    float d12 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2( 0.0,  1.0)).r);
    float d22 = linearizeDepth(texture2D(tDepth, uv + texelSize * vec2( 1.0,  1.0)).r);

    float gx = -d00 - 2.0 * d01 - d02 + d20 + 2.0 * d21 + d22;
    float gy = -d00 - 2.0 * d10 - d20 + d02 + 2.0 * d12 + d22;

    return length(vec2(gx, gy));
  }

  float edgeNormal(vec2 uv) {
    vec3 n00 = texture2D(tNormal, uv + texelSize * vec2(-1.0, -1.0)).xyz * 2.0 - 1.0;
    vec3 n10 = texture2D(tNormal, uv + texelSize * vec2( 0.0, -1.0)).xyz * 2.0 - 1.0;
    vec3 n20 = texture2D(tNormal, uv + texelSize * vec2( 1.0, -1.0)).xyz * 2.0 - 1.0;
    vec3 n01 = texture2D(tNormal, uv + texelSize * vec2(-1.0,  0.0)).xyz * 2.0 - 1.0;
    vec3 n21 = texture2D(tNormal, uv + texelSize * vec2( 1.0,  0.0)).xyz * 2.0 - 1.0;
    vec3 n02 = texture2D(tNormal, uv + texelSize * vec2(-1.0,  1.0)).xyz * 2.0 - 1.0;
    vec3 n12 = texture2D(tNormal, uv + texelSize * vec2( 0.0,  1.0)).xyz * 2.0 - 1.0;
    vec3 n22 = texture2D(tNormal, uv + texelSize * vec2( 1.0,  1.0)).xyz * 2.0 - 1.0;

    vec3 gx = -n00 - 2.0 * n01 - n02 + n20 + 2.0 * n21 + n22;
    vec3 gy = -n00 - 2.0 * n10 - n20 + n02 + 2.0 * n12 + n22;

    return length(gx) + length(gy);
  }

  void main() {
    vec3 color = texture2D(tColor, vUv).rgb;

    float depthMag = edgeDepth(vUv) * depthEdgeScale;
    float normalMag = edgeNormal(vUv) * normalEdgeScale;

    // Slight bias toward piece/environment contours; keep board-grid edges softer.
    float edge = clamp(depthMag * 1.35 + normalMag * 0.55, 0.0, 1.0);
    edge = smoothstep(0.06, 0.34, edge) * edgeStrength;

    // Ink-brown darken composite (not pure black)
    vec3 inkComposite = mix(color, edgeColor, edge);
    color = min(color, inkComposite);

    // Subtle colour grading
    float luma = luminance(color);
    color = mix(vec3(luma), color, saturation);
    color = (color - 0.5) * contrast + 0.5;
    color += warmth * vec3(0.06, 0.02, -0.03);

    // Gentle vignette (kept very low)
    vec2 centeredUv = vUv - 0.5;
    float dist = dot(centeredUv, centeredUv) * 2.2;
    color *= 1.0 - vignette * dist;

    // Very light paper-like grain overlay
    float grain = hash(vUv * vec2(1920.0, 1080.0) + time * 0.7) - 0.5;
    color += grain * grainAmount;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.mobile = isMobile();

    if (this.mobile) {
      this.width = 0;
      this.height = 0;
      return;
    }

    this.normalMaterial = new THREE.MeshNormalMaterial();
    this.quadScene = new THREE.Scene();
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.uniforms = {
      tColor: { value: null },
      tDepth: { value: null },
      tNormal: { value: null },
      texelSize: { value: new THREE.Vector2(1 / 512, 1 / 512) },
      cameraNear: { value: camera.near },
      cameraFar: { value: camera.far },

      edgeColor: { value: new THREE.Color(0x2a1808) },
      edgeStrength: { value: 0.21 },
      depthEdgeScale: { value: 1.55 },
      normalEdgeScale: { value: 0.72 },

      contrast: { value: 1.035 },
      saturation: { value: 1.05 },
      warmth: { value: 0.035 },
      vignette: { value: 0.065 },
      grainAmount: { value: 0.01 },
      time: { value: 0 },
    };

    this.compositeMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: compositeVertexShader,
      fragmentShader: compositeFragmentShader,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.compositeMaterial);
    this.quadScene.add(this.quad);

    this.colorTarget = null;
    this.normalTarget = null;
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(w, h) {
    if (this.mobile) return;

    const width = Math.max(1, Math.floor(w * DOWNSAMPLE));
    const height = Math.max(1, Math.floor(h * DOWNSAMPLE));

    if (this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    this.colorTarget?.dispose();
    this.normalTarget?.dispose();

    this.colorTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      colorSpace: THREE.SRGBColorSpace,
      depthBuffer: true,
      stencilBuffer: false,
    });
    this.colorTarget.texture.minFilter = THREE.LinearFilter;
    this.colorTarget.texture.magFilter = THREE.LinearFilter;
    this.colorTarget.depthTexture = new THREE.DepthTexture(width, height, THREE.FloatType);

    this.normalTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.normalTarget.texture.minFilter = THREE.LinearFilter;
    this.normalTarget.texture.magFilter = THREE.LinearFilter;

    this.uniforms.tColor.value = this.colorTarget.texture;
    this.uniforms.tDepth.value = this.colorTarget.depthTexture;
    this.uniforms.tNormal.value = this.normalTarget.texture;
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }

  render(time = 0) {
    if (this.mobile) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
      return;
    }

    this.uniforms.cameraNear.value = this.camera.near;
    this.uniforms.cameraFar.value = this.camera.far;
    this.uniforms.time.value = time;

    // 1) Scene colour + depth
    this.scene.overrideMaterial = null;
    this.renderer.setRenderTarget(this.colorTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // 2) Scene normals
    this.scene.overrideMaterial = this.normalMaterial;
    this.renderer.setRenderTarget(this.normalTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = null;

    // 3) Composite pass
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.quadScene, this.quadCamera);
  }

  dispose() {
    if (this.mobile) return;
    this.colorTarget?.dispose();
    this.normalTarget?.dispose();
    this.normalMaterial?.dispose();
    this.compositeMaterial?.dispose();
    this.quad?.geometry?.dispose();
  }
}
