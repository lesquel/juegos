import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist"
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false, // Deshabilitado temporalmente para evitar errores
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@all-games': path.resolve(__dirname, './src/all-games'),
      '@config': path.resolve(__dirname, './src/config'),
      '@models': path.resolve(__dirname, './src/models'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@services': path.resolve(__dirname, './src/services')
    }
  },
  define: {
    'import.meta.env.VITE_API_URL_DEV': JSON.stringify(process.env.VITE_API_URL_DEV || 'http://localhost:8000'),
    'import.meta.env.VITE_API_URL_PROD': JSON.stringify(process.env.VITE_API_URL_PROD || 'https://juegos-backend-mot1.onrender.com'),
    'import.meta.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL || 'http://localhost:8000'),
    'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT || 'development'),
  },
  server: {
    port: 5173,
    host: true
  }
});
