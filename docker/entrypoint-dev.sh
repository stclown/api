if [ ! -d "node_modules" ]; then
  npm install
fi

chmod +x docker/wait-for-it.sh
docker/wait-for-it.sh mongodb:27017 --strict -- npm run dev