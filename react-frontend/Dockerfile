# Etapa 1: build
FROM node:20-slim AS builder

WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir la app
RUN npm run build

# Etapa 2: producción con nginx
FROM nginx:stable-alpine AS production

# Cambiar nginx a puerto 8080 para Cloud Run
RUN sed -i 's/80;/8080;/g' /etc/nginx/conf.d/default.conf

# Limpiar y copiar archivos de la build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
