FROM node

WORKDIR /web

COPY package.json /web
RUN npm install

RUN curl https://use.fontawesome.com/releases/v5.11.2/fontawesome-free-5.11.2-web.zip -o /fontawesome.zip && \
    unzip /fontawesome.zip -d /font

COPY . /web

RUN cp /web/cfg/Config.prod.ts /web/src/model/Config.ts && \
    mkdir -p /web/public/font/css && \
    mv /font/fontawesome-free-5.11.2-web/css/all.min.css /web/public/font/css/. && \
    mv /font/fontawesome-free-5.11.2-web/webfonts /web/public/font/. && \
    sed -i '' 's~<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous" />~<link rel="stylesheet" href="%PUBLIC_URL%/font/css/all.min.css" />~' /web/public/index.html

# Build
RUN npm run build
