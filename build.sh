docker build -t volume-updater . && \
docker run \
  --volume skull:/data \
  --rm \
  volume-updater \
  sh -c 'rm -rf /data/* && cp -r /web/build/* /data/.'
