# ------------------------------
# Etapa de construcción
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo archivos necesarios para instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app (si aplica)
# Descomenta si usas React, Vite, Astro, etc.
# RUN npm run build

# ------------------------------
# Etapa de producción
# ------------------------------
FROM node:20-alpine

WORKDIR /app

# Copiar los archivos desde la etapa de construcción
COPY --from=builder /app /app

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Cloud Run usa el puerto 8080
ENV PORT=8080

# Expón el puerto 8080
EXPOSE 8080

# Iniciar la app (ajusta si tu comando es diferente)
CMD ["npm", "start"]
