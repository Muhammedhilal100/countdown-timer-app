import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'https://countdown-timer-app.onrender.com',
      '/proxy': 'https://countdown-timer-app.onrender.com'
    }
  },
  build: { outDir: 'dist' }
});
