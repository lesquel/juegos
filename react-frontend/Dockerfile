# Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Production
FROM nginx:stable-alpine
# Cambiar puerto 80 a 8080 para Cloud Run
RUN sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
