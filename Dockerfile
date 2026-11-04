FROM node:24-alpine AS builder
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
WORKDIR /node/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.28-alpine
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 TZ="Europe/Paris"
COPY --from=builder /node/app/.output/public /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# hadolint ignore=DL3018
RUN apk upgrade --no-cache && \
    apk add --no-cache bash tzdata
