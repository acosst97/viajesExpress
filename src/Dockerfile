# Etapa 1: construir la app
FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Etapa 2: servir la app con nginx
FROM nginx:alpine
COPY --from=build /app/dist/viajesExpress /usr/share/nginx/html

# Copia un archivo de configuración personalizado si lo necesitas
COPY nginx.conf /etc/nginx/nginx.conf