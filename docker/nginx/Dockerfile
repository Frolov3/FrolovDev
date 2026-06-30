FROM nginx:1.27-alpine

COPY docker/nginx/entrypoint.sh /docker-entrypoint.d/30-create-config.sh

RUN chmod +x /docker-entrypoint.d/30-create-config.sh
