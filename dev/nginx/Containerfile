FROM nginx

RUN openssl req \
  -x509 \
  -nodes \
  -days 3600 \
  -subj "/C=DE/ST=DE/O=Nordeck/CN=matrix.local" \
  -newkey rsa:2048 \
  -keyout /etc/ssl/private/selfsigned.key \
  -out /etc/ssl/certs/selfsigned.crt

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./public/ /usr/share/nginx/html/
