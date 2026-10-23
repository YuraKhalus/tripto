# Образ для РОЗРОБКИ бекенду Tripto.
# Код не копіюється назавжди: docker-compose монтує ./server у /app.

# 1. Базовий образ: Linux (Debian slim) з уже встановленим Node.js 22
FROM node:22-slim

# 2. Prisma потрібен OpenSSL, а в slim-образі його немає
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# 3. Усі наступні команди виконуються в папці /app
WORKDIR /app

# 4. Спочатку копіюємо ЛИШЕ файли залежностей.
#    Docker кешує кожен крок: поки package*.json не змінились,
#    npm ci не запускатиметься заново, і білд займе секунди.
COPY package*.json ./
RUN npm ci

# 5. Тепер решта коду
COPY . .

# 6. Генеруємо Prisma Client під Linux усередині контейнера
#    (якщо схеми ще немає, крок просто пропускається)
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# 7. Порт, який слухає Express (документація; відкриває його compose)
EXPOSE 3000

# 8. Команда за замовчуванням (у compose її перевизначено на npm run dev)
CMD ["npm", "start"]
