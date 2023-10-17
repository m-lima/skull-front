FROM node:16.20.2-buster as web

WORKDIR /web

# Dependencies
COPY package.json package-lock.json /web/
RUN npm install

RUN curl https://use.fontawesome.com/releases/v5.11.2/fontawesome-free-5.11.2-web.zip -o /fontawesome.zip && \
    unzip /fontawesome.zip -d /font

COPY . /web

RUN cp /web/cfg/Config.prod.ts /web/src/model/Config.ts && \
    mkdir -p /web/public/font/css && \
    mv /font/fontawesome-free-5.11.2-web/css/all.min.css /web/public/font/css/. && \
    mv /font/fontawesome-free-5.11.2-web/webfonts /web/public/font/. && \
    mv /web/public/index.html.production /web/public/index.html

# Build
RUN npm run build

# Pack
FROM alpine
COPY --from=web /web/build /web/build
