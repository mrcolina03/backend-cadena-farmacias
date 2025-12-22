# Dockerfile

# Build stage
FROM node:18 AS build
WORKDIR /app

# Definir variables de entorno para la etapa de build (Vite las usa)
# NOTA: Usamos ARG en esta etapa para capturar los valores pasados desde docker-compose
ARG VITE_API_BASE_URL
ARG VITE_API_INVENTARIO_URL
ARG VITE_API_VENTAS_URL          
ARG VITE_API_REPORTES_URL     

# Establecer ENV para que estas variables se inyecten en el código estático de la app
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_INVENTARIO_URL=${VITE_API_INVENTARIO_URL}
ENV VITE_API_VENTAS_URL=${VITE_API_VENTAS_URL}       
ENV VITE_API_REPORTES_URL=${VITE_API_REPORTES_URL}    

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public

# Instala las dependencias.
RUN npm install
COPY . .

# Ejecutar el script de construcción (genera la carpeta 'dist')
# Las variables ENV definidas arriba se usan aquí (VITE_...)
RUN npm run build 

# Deploy with Nginx
FROM nginx:1.25

# Copiar la configuración de Nginx (con el proxy), si usas Nginx para el proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la salida de la etapa de construcción (directorio 'dist' de Vite)
COPY --from=build /app/dist /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]