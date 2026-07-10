import { defineConfig } from 'vitest/config';

// Node-environment tests for the main-process DB layer (against a real sql.js
// instance) and pure renderer logic (canvas geometry). No DOM is needed for
// either — the map canvas rendering itself is verified manually in the app.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['electron/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
  },
});
