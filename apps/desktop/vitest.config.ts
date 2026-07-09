import { defineConfig } from 'vitest/config';

// Node-environment tests for the main-process DB layer. The renderer is not
// tested here; this only exercises electron/db.ts against a real sql.js instance.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['electron/**/__tests__/**/*.test.ts'],
  },
});
