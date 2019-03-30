FROM node

WORKDIR /web

COPY package.json /web
RUN npm install

COPY . /web

# Build
RUN npm run build
