FROM node:10-alpine

RUN mkdir -p /opt/app

RUN adduser -S app

RUN mkdir -p /opt/app/dist
RUN mkdir -p /opt/app/node_modules

WORKDIR /opt/app

COPY backend/dist/ ./dist
COPY backend/node_modules/ ./node_modules
COPY frontend/ ./frontend

COPY backend/package.json ./package.json

RUN npm install

RUN chown -R app /opt/app

USER app

EXPOSE 3000

CMD [ "node",  "dist/main.js", "--config=/opt/app/config.json"]
