# Etapa 1: Build con Node
FROM node:20 AS builder

WORKDIR /app

# Copia solo package.json y package-lock.json para aprovechar caché
COPY package.json package-lock.json ./

# Limpia y instala dependencias frescas
RUN rm -rf node_modules && npm install

# Copia el resto de los archivos
COPY . .

# Ejecuta el build
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Cambia el puerto si quieres (opcional)
RUN sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos del build a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
