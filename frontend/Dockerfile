FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["pnpm", "dev", "--", "--port", "8080", "--host"]
