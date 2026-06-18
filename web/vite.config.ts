import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev config: port 5173 (locked by start.ps1), proxy /api → :5080.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5080',
        changeOrigin: false,
      },
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1200,
  },
});
