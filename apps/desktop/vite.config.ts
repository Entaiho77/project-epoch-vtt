import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite options tailored for Tauri to prevent too much magic
  // cleared console on Windows in release
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // using polling since env listening to unix file change events could be unreliable
      usePolling: true,
    },
  },
  build: {
    // Tauri supports es2021
    target: ['es2021', 'chrome100', 'safari13'],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
