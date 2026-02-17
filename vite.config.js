import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    target: ['es2020', 'safari15', 'chrome90'],
    minify: 'esbuild',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // IIFE format so the bundle works when inlined into HTML (no module scope needed)
        format: 'iife',
        // Single chunk — everything in one JS file
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  },
  server: {
    host: true,
    open: true
  }
});
