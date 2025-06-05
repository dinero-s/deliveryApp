FROM node:20-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./*.json ./
RUN npm install
COPY ./src src/
CMD ["node", "src/index.js"]