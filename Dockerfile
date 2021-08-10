FROM node:14-alpine

COPY . /var/www/html/container/backend/wuala-integrador-backend-woocommerce
WORKDIR /var/www/html/container/backend/wuala-integrador-backend-woocommerce

RUN npm install && \
npm run link

EXPOSE 4000
