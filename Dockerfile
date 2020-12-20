FROM node:14 as builder
WORKDIR /node/app
COPY . .
RUN \
  npm install -g ember-cli &&\
  npm install &&\
  ember build --environment production


FROM nginx:1.19
COPY --from=builder /node/app/dist /usr/share/nginx/html