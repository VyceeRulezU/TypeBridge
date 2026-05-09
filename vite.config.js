import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: 'manifest.json',
      watchFilePaths: ['src/sidepanel/sidepanel.html'],
    }),
  ],
  build: {
    // Keep it simple. Zero-dependency content.js shouldn't need manualChunks to stay small.
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]'
    }
  },
  test: {
    environment: 'jsdom',
  },
});
