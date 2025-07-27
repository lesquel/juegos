FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Solo si quieres usar el build para producción
RUN pnpm build

EXPOSE 4321

CMD ["pnpm", "preview", "--port", "4321", "--host"]
