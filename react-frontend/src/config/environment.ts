// Configuración con valores por defecto seguros - FORZADOS para evitar conflictos
const API_URL_DEV = "http://localhost:8080"; // Forzado
const API_URL_PROD = "https://juegosbackend-910998875911.northamerica-south1.run.app"; // Forzado
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "development";
const WS_URL = import.meta.env.VITE_WS || "ws://localhost:8080";
const WS_URL_PROD = import.meta.env.VITE_WS_PROD || "wss://juegosbackend-910998875911.northamerica-south1.run.app";

// Debug: Mostrar las variables de entorno que se están cargando
if (ENVIRONMENT === "development") {
  console.log('🔍 Environment variables loaded:', {
    VITE_API_URL_DEV: import.meta.env.VITE_API_URL_DEV,
    VITE_API_URL_PROD: import.meta.env.VITE_API_URL_PROD,
    VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    VITE_WS_URL: import.meta.env.VITE_WS,
    VITE_WS_URL_PROD: import.meta.env.VITE_WS_PROD,
    'FORCED_API_URL_DEV': API_URL_DEV,
    'FORCED_API_URL_PROD': API_URL_PROD,
  });
}

export const API_URL =
  ENVIRONMENT === "development" ? API_URL_DEV : API_URL_PROD;

export const environment = {
  BASE_URL: "http://localhost:8080", // Forzado
  API_URL,
  ENVIRONMENT,
  WS_URL,  
  // Para debugging en desarrollo
  isDevelopment: ENVIRONMENT === "development",
  isProduction: ENVIRONMENT === "production",
  
  // Debug info (solo en desarrollo)
  ...(ENVIRONMENT === "development" && {
    debug: {
      loadedFrom: {
        API_URL_DEV: import.meta.env.VITE_API_URL_DEV,
        API_URL_PROD: import.meta.env.VITE_API_URL_PROD,
        BASE_URL: import.meta.env.VITE_BASE_URL,
        ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
        WS_URL: import.meta.env.VITE_WS,
        WS_URL_PROD: import.meta.env.VITE_WS_PROD,
      }
    }
  })
};