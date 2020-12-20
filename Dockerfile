FROM node:14-alpine as builder
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
WORKDIR /node/app
COPY . .
RUN npm install -g ember-cli
RUN npm install
RUN ember build --environment production


FROM nginx:1.19-alpine
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
COPY --from=builder /node/app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN apk upgrade &&\
  apk add --update bash tzdata
RUN   rm -rf /tmp/* /var/cache/apk/*
ENV TZ "Europe/Paris"