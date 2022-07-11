FROM node:alpine as Builder

RUN mkdir -p /home/opengauss/web
WORKDIR /home/opengauss/web
COPY . /home/opengauss/web

RUN npm install

RUN node --max_old_space_size=9216 node_modules/vite/bin/vite.js build

FROM nginx:1.20.0

COPY --from=Builder /home/opengauss/web/dist/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]


