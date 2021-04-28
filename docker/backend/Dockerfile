# Stage 1
# to rebuild builder image run:
# $ docker build -t timetracker-builder .
FROM timetracker-builder as build

ARG BUILD_FLAG

RUN npx yarn workspace @tt/backend build ${BUILD_FLAG}

# Stage 2
FROM build as bundle
WORKDIR /app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/yarn.lock ./

COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist
COPY --from=build /usr/src/app/apps/backend/package.json ./apps/backend/package.json

COPY --from=build /usr/src/app/libs/types/package.json ./libs/types/package.json
COPY --from=build /usr/src/app/libs/types/dist ./libs/types/dist

COPY --from=build /usr/src/app/libs/utils/package.json ./libs/utils/package.json
COPY --from=build /usr/src/app/libs/utils/dist ./libs/utils/dist
RUN npx yarn install

# Stage 3
FROM node:lts-alpine3.10
WORKDIR /app
COPY --from=bundle /app ./
CMD ["node", "apps/backend/dist/main.js"]
