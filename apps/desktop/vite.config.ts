import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Workspace packages are consumed as TypeScript SOURCE (no build step).
// The codebase imports them under both @epoch/* and the older @solryn/* names,
// so both are aliased to the same source folders.
const repoRoot = resolve(__dirname, '../..');
const pkg = (name: string) => resolve(repoRoot, `packages/${name}/src`);
const names = ['shared-types', 'engine', 'systems', 'protocol'];
const alias = names.flatMap((name) =>
  ['epoch', 'solryn'].flatMap((scope) => [
    { find: new RegExp(`^@${scope}/${name}$`), replacement: `${pkg(name)}/index.ts` },
    { find: new RegExp(`^@${scope}/${name}/`), replacement: `${pkg(name)}/` },
  ]),
);

// Tauri loads the dev server in its window during `tauri dev`,
// and the built files from ../dist during `tauri build`.
export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  resolve: { alias },
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: ['es2021', 'chrome105', 'safari15'],
    minify: process.env.TAURI_ENV_DEBUG ? false : 'esbuild',
    sourcemap: Boolean(process.env.TAURI_ENV_DEBUG),
  },
});
