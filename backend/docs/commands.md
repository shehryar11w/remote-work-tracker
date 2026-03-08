docker exec -it backend-db-1 psql -U postgres -d database_project
docker compose up -d --build 
docker compose down 
docker ps 
docker logs backend-backend-1
npx react-native run-android
npx react-native doctor