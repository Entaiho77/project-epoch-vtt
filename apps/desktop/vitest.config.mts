/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pkg = (name: string) =>
  fileURLToPath(new URL(`../../packages/${name}/src`, import.meta.url));

// Same source-alias scheme as the web app: bare package + subpaths → package src.
// Both the current @epoch/* and older @solryn/* import names map to the same source.
const epochAlias = ['shared-types', 'engine', 'systems', 'protocol'].flatMap((name) =>
  ['epoch', 'solryn'].flatMap((scope) => [
    { find: new RegExp(`^@${scope}/${name}$`), replacement: `${pkg(name)}/index.ts` },
    { find: new RegExp(`^@${scope}/${name}/`), replacement: `${pkg(name)}/` },
  ]),
);

export default defineConfig({
  plugins: [react()],
  resolve: { alias: epochAlias },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/renderer/test/setup.ts'],
    css: false,
    // Renderer tests AND the shared-package tests (engine/systems) run here.
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      '../../packages/*/src/**/*.{test,spec}.{ts,tsx}',
    ],
  },
});
