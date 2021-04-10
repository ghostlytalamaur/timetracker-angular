FROM node:lts-alpine3.10 as build

WORKDIR /usr/src/app

COPY . .

RUN npx yarn install
