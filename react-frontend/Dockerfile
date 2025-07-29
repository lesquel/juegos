# Etapa de build
FROM node:20 AS builder

WORKDIR /app

COPY package.json ./

RUN rm -f package-lock.json

RUN npm install

COPY . .

RUN npm run build

# Etapa final: nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx-entrypoint.sh /nginx-entrypoint.sh

RUN chmod +x /nginx-entrypoint.sh

EXPOSE 8080

CMD ["/nginx-entrypoint.sh"]
