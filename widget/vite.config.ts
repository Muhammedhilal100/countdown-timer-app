import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'dist',
    lib: { entry: 'src/main.ts', name: 'CTimerWidget', formats: ['iife'] },
    rollupOptions: { output: { entryFileNames: 'widget.js' } }
  },
  server:{
    port:7012 
  }
});
