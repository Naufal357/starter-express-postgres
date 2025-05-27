# Menjalankan Docker Compose
docker-compose up -d

# Menghentikan Docker Compose
docker-compose stop

# Menghapus container dan volume
docker-compose down -v
   
# Menghapus image
docker-compose rm --force

# Menghapus semua
docker-compose down -v --rmi all --remove-orphans

# Merestart backend
docker-compose restart backend