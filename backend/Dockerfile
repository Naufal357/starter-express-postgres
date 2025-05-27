FROM node:18

WORKDIR /app

# 1. Copy package.json DAN package-lock.json
COPY package*.json ./

# 2. Install semua dependencies (termasuk dotenv)
RUN npm install && \
    npm rebuild bcrypt --build-from-source

# 3. Copy seluruh aplikasi (setelah dependencies terinstall)
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]