FROM node:20-slim

# Instalar pnpm (o usa npm directamente si prefieres)
RUN npm install -g pnpm

# Directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN pnpm install

# Exponer el puerto correcto para Cloud Run
EXPOSE 8080

# Comando para ejecutar en modo desarrollo con el puerto cambiado
CMD ["pnpm", "dev", "--", "--port", "8080", "--host"]
