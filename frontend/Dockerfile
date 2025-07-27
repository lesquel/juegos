FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Compila tu proyecto Astro para producción
RUN pnpm build

# Expón el puerto que usará Cloud Run (siempre será 8080)
EXPOSE 8080

# Usa "preview" para servir el sitio generado
CMD ["pnpm", "preview", "--port", "8080", "--host"]
