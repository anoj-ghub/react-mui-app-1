/**
 * @fileoverview Vite configuration for React application build and development
 * @author System
 * @version 1.0.0
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration object
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});