import { defineConfig } from 'vitest/config';

// The relay is a plain Node service (no DOM); run its tests in the node environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
