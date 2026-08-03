# syntax=docker/dockerfile:1

# ---------- Etapa 1: build ----------
FROM node:24-alpine AS build

WORKDIR /app

# Las variables VITE_* se resuelven en tiempo de build, no en runtime.
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_CLOUDINARY_CLOUD_NAME=
ARG VITE_CLOUDINARY_UPLOAD_PRESET=
ARG VITE_CLOUDINARY_FOLDER=cpa/archivos
ARG VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER=cpa/archivos

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET \
    VITE_CLOUDINARY_FOLDER=$VITE_CLOUDINARY_FOLDER \
    VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER=$VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER

# Yarn Classic es el gestor único del proyecto.
COPY package.json yarn.lock .yarnrc .npmrc ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- Etapa 2: runtime ----------
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
