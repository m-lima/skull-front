docker build -t volume-updater .
docker run \
  --volume skull:/data \
  --rm \
  volume-updater \
  sh -c 'cp -r /web/build/* /data/.'
