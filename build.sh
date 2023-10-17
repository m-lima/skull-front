docker build -t volume-updater . && \
docker run \
  --volume skull-0.1.1:/data \
  --rm \
  volume-updater \
  sh -c 'rm -rf /data/* && cp -r /web/build/* /data/.'
