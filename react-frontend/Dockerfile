# Etapa 1: build (esta es la que falló porque faltaba)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Instalar dependencias (ajusta si usas yarn o pnpm)
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Etapa 2: producción con nginx
FROM nginx:stable-alpine AS production

# Limpiar archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Cambiar el puerto de nginx a 8080 para Cloud Run
RUN sed -i 's/80;/8080;/g' /etc/nginx/conf.d/default.conf

# Copiar archivos generados en la build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto que Cloud Run espera
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
