// ============================================================================
// POST-PROCESSING — EMPTIED for pitch-black baseline confirmation
// All shaders and pipeline deleted. Will be rebuilt from scratch.
// ============================================================================

export function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (window.innerWidth < 768 && 'ontouchstart' in window);
}

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  resize() {}

  render() {
    // Direct rendering only — no post-processing
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {}
}
