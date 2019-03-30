FROM node

WORKDIR /web

COPY package.json /web
RUN npm install

COPY . /web

RUN cp /web/cfg/Config.prod.ts /web/src/model/Config.ts

# Build
RUN npm run build
