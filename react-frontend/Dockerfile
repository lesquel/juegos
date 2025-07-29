# Etapa 2: Servir la app con nginx para Cloud Run
FROM nginx:stable-alpine AS production

# Elimina archivos html por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia archivos de la build
COPY --from=builder /app/dist /usr/share/nginx/html

# Cambia el puerto de nginx a 8080 para Cloud Run
RUN sed -i 's/80;/8080;/g' /etc/nginx/conf.d/default.conf

# Expón el puerto 8080
EXPOSE 8080

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]
