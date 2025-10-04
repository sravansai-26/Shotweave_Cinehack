import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// --- IMPORT THE DEDICATED POSTCSS PLUGINS ---
// We import the new dedicated PostCSS wrapper for Tailwind:
import tailwindPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer'; 

export default defineConfig({
  // Project root is the current directory (where index.html sits)
  root: '.', 
  plugins: [react()],
  
  // CRITICAL FIX: Use the dedicated PostCSS packages to resolve the "moved" plugin error
  css: {
    postcss: {
      plugins: [
        tailwindPostcss, // This is the correct package for PostCSS integration
        autoprefixer 
      ],
    },
  },
  
  server: {
    port: 3000,
    open: true,
    // Proxy configuration remains correct
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
        '@': path.resolve(__dirname, './src'), 
    },
  },
});