// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.VITE_API_URL_DEV': JSON.stringify(process.env.VITE_API_URL_DEV || 'http://localhost:8000'),
      'import.meta.env.VITE_API_URL_PROD': JSON.stringify(process.env.VITE_API_URL_PROD || 'https://juegos-backend-mot1.onrender.com'),
      'import.meta.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL || 'http://localhost:8000'),
      'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT || 'development'),
    },
    esbuild: {
      // Disable TypeScript checking for build speed and to avoid path issues
      tsconfigRaw: '{}',
      target: 'es2020'
    },
    optimizeDeps: {
      // Force pre-bundling to avoid dynamic imports issues
      include: ['react', 'react-dom']
    },
    build: {
      // Increase the chunk size limit to handle large files
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'query-vendor': ['@tanstack/react-query'],
          }
        }
      }
    },
    ssr: {
      noExternal: ['@tanstack/react-query']
    },
    // Add specific handling for Windows paths
    resolve: {
      preserveSymlinks: false
    }
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  experimental: {
    clientPrerender: true
  }
});
