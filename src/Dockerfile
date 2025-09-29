# Etapa 1: construir la app
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
git 
# Etapa 2: servir con nginx
FROM nginx:alpine
COPY --from=build /app/dist/viajesExpress /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf