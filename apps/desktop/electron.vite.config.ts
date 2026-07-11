// electron-vite requires this exact filename (it rejects a plain vite.config.ts).
import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

// Workspace packages are consumed as TypeScript SOURCE (no build step) — these
// aliases mirror tsconfig.base.json's paths for the bundler.
const repoRoot = resolve(__dirname, '../..');
const pkg = (name: string) => resolve(repoRoot, `packages/${name}/src`);
const alias = [
  { find: /^@solryn\/shared-types$/, replacement: `${pkg('shared-types')}/index.ts` },
  { find: /^@solryn\/shared-types\//, replacement: `${pkg('shared-types')}/` },
  { find: /^@solryn\/engine$/, replacement: `${pkg('engine')}/index.ts` },
  { find: /^@solryn\/engine\//, replacement: `${pkg('engine')}/` },
  { find: /^@solryn\/systems$/, replacement: `${pkg('systems')}/index.ts` },
  { find: /^@solryn\/systems\//, replacement: `${pkg('systems')}/` },
  { find: /^@solryn\/protocol$/, replacement: `${pkg('protocol')}/index.ts` },
  { find: /^@solryn\/protocol\//, replacement: `${pkg('protocol')}/` },
];

export default defineConfig({
  main: {
    // All node_modules are externalized by default (build.externalizeDeps: true).
    // Exclude ws so it gets bundled into out/main/index.js: packaged builds
    // (Flatpak, electron-builder) then don't need a node_modules/ws at runtime.
    // better-sqlite3 is NOT excluded — it's a native addon Rollup can't inline
    // and must ship as a raw node_modules subtree alongside the app.
    resolve: {
      alias: {
        bufferutil: resolve(__dirname, 'electron/bufferutil-stub.cjs'),
      },
    },
    build: {
      externalizeDeps: { exclude: ['ws'] },
      rollupOptions: { input: { index: resolve(__dirname, 'electron/main.ts') } },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: { input: { index: resolve(__dirname, 'electron/preload.ts') } },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    resolve: { alias },
    plugins: [react()],
    build: {
      rollupOptions: { input: { index: resolve(__dirname, 'src/renderer/index.html') } },
    },
  },
});
