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
    build: {
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
