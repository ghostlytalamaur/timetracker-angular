#Stage 1
FROM node:lts-alpine3.10 as build
WORKDIR /usr/src/app
COPY . .
RUN npx yarn install

ARG BUILD_FLAG

RUN npx yarn run build ${BUILD_FLAG}

# Stage 2
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist/apps/time-tracker /usr/share/nginx/html
# COPY dist/apps/time-tracker /usr/share/nginx/html

COPY docker/frontend/00-setup-configs.sh /docker-entrypoint.d/
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENV PORT 80
