const API_URL_DEV = import.meta.env.VITE_API_URL_DEV;
const API_URL_PROD = import.meta.env.VITE_API_URL_PROD;

if (!API_URL_DEV || !API_URL_PROD) {
  throw new Error("Environment variables VITE_API_URL_DEV and VITE_API_URL_PROD must be set.");
}

export const API_URL =
  import.meta.env.ENVIRONMENT === "development" ? API_URL_DEV : API_URL_PROD;

export const environment = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:8000",
};
