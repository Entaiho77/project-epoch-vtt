// electron-vite REQUIRES this file be named exactly `electron.vite.config.ts`.
// It hard-rejects a plain `vite.config.ts`, so do not rename it.
import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

// Shared @solryn/* aliases so every build (main, preload, renderer) consumes the
// workspace packages as TypeScript source — matching tsconfig.base.json's `paths`.
// There is no build step for the packages; they are resolved straight from src.
const repoRoot = resolve(__dirname, '../..');
const alias = {
  '@solryn/protocol': resolve(repoRoot, 'packages/protocol/src/index.ts'),
  '@solryn/shared-types': resolve(repoRoot, 'packages/shared-types/src/index.ts'),
  '@solryn/engine': resolve(repoRoot, 'packages/engine/src/index.ts'),
  '@solryn/systems': resolve(repoRoot, 'packages/systems/src/index.ts'),
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'electron/main.ts') },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'electron/preload.ts') },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src'),
    resolve: { alias },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/index.html') },
      },
    },
  },
});
