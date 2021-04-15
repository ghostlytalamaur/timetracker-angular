# Stage 1
FROM node:lts-alpine3.10 as build
WORKDIR /usr/src/app
COPY . .
RUN npx yarn install

ARG BUILD_FLAG

RUN npx yarn run build backend ${BUILD_FLAG}

# Stage 2
FROM build as bundle
WORKDIR /app

#COPY --from=build /usr/src/app/decorate-angular-cli.js ./
COPY --from=build /usr/src/app/apps/backend/package.prod.json ./package.json
COPY --from=build /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/dist/apps/backend ./dist/apps/backend/
RUN npx yarn install

# Stage 3
FROM node:lts-alpine3.10
WORKDIR /app
COPY --from=bundle /app ./
CMD ["node", "dist/apps/backend/main.js"]
