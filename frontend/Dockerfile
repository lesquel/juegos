# Etapa base
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instalar PNPM (si usas PNPM, opcional)
RUN npm install -g pnpm

# Instalar dependencias
RUN if [ -f pnpm-lock.yaml ]; then pnpm install; \
    elif [ -f package-lock.json ]; then npm install; \
    else echo "No lockfile found!" && exit 1; fi

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de desarrollo de Astro
EXPOSE 4321

# Comando por defecto (modo desarrollo)
CMD ["npm", "run", "dev"]
