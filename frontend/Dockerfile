FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 4321

CMD ["pnpm", "dev", "--", "--port", "4321", "--host"]
