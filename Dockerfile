FROM node:14 as builder
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
WORKDIR /node/app
COPY . .
RUN npm install -g ember-cli
RUN npm install
RUN ember build --environment production


FROM nginx:1.19
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
COPY --from=builder /node/app/dist /usr/share/nginx/html