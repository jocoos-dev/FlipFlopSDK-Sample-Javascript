FROM nginx:latest

RUN apt-get update
RUN apt-get install -y vim

COPY ./config/default.conf /etc/nginx/conf.d/default.conf
COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./build  /usr/share/nginx/html

RUN chmod 755 -R /usr/share/nginx/html/*