# Stage 1
# to rebuild builder image run:
# $ docker build -t timetracker-builder .
FROM timetracker-builder as build

ARG BUILD_FLAG

RUN npx yarn workspace @tt/frontend build ${BUILD_FLAG}

# Stage 2
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
# COPY dist/apps/time-tracker /usr/share/nginx/html

COPY docker/frontend/00-setup-configs.sh /docker-entrypoint.d/
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENV PORT 80
