#!/bin/sh

# Usa el puerto que da Cloud Run o 8080 por defecto
PORT=${PORT:-8080}

# Reemplaza "listen 80;" por "listen $PORT;" en la config de nginx
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/conf.d/default.conf

# Arranca nginx en primer plano
nginx -g 'daemon off;'
