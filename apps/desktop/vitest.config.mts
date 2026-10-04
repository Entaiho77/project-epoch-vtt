/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pkg = (name: string) =>
  fileURLToPath(new URL(`../../packages/${name}/src`, import.meta.url));

// Same source-alias scheme as the web app: bare package + subpaths → package src.
const epochAlias = [
  { find: /^@epoch\/shared-types$/, replacement: `${pkg('shared-types')}/index.ts` },
  { find: /^@epoch\/shared-types\//, replacement: `${pkg('shared-types')}/` },
  { find: /^@epoch\/engine$/, replacement: `${pkg('engine')}/index.ts` },
  { find: /^@epoch\/engine\//, replacement: `${pkg('engine')}/` },
  { find: /^@epoch\/systems$/, replacement: `${pkg('systems')}/index.ts` },
  { find: /^@epoch\/systems\//, replacement: `${pkg('systems')}/` },
  { find: /^@epoch\/protocol$/, replacement: `${pkg('protocol')}/index.ts` },
  { find: /^@epoch\/protocol\//, replacement: `${pkg('protocol')}/` },
];

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
      'electron/**/*.{test,spec}.ts',
      'src/**/*.{test,spec}.{ts,tsx}',
      '../../packages/*/src/**/*.{test,spec}.{ts,tsx}',
    ],
  },
});
