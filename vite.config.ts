import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // ✅ REQUIRED for GitHub Pages repo subfolder
    base: '/coop/',

    plugins: [
      react(),
      tailwindcss()
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    // ❌ REMOVE old process.env hacks (we don't use them anymore)
    // We now use import.meta.env.VITE_*

    server: {
      hmr: true,
    },
  };
});