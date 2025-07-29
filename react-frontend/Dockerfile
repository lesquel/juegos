FROM node:20 AS builder

WORKDIR /app

# Copia package.json pero NO package-lock.json
COPY package.json ./

# Elimina package-lock.json si existe (para asegurarnos)
RUN rm -f package-lock.json

# Instalación limpia
RUN npm install

# Copia el resto del código
COPY . .

# Build
RUN npm run build

FROM nginx:stable-alpine

RUN sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
