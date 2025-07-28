// Configuración con valores por defecto seguros
const API_URL_DEV = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080";
const API_URL_PROD =
  import.meta.env.VITE_API_URL_PROD ||
  "https://juegos-backend-mot1.onrender.com";
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "development";

export const API_URL =
  ENVIRONMENT === "development" ? API_URL_DEV : API_URL_PROD;

export const environment = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:8080",
  API_URL,
  ENVIRONMENT,
};
