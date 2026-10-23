# Tripto

Навчальний аналог Booking.com. Командний проєкт академії.

**Стек:** Node.js 22 · Express 5 · PostgreSQL 17 · Prisma 6 · Vitest · Docker
Фронтенд (React) — у `client/`, з'явиться на наступних заняттях.

## Структура

```
tripto/
├── docker-compose.yml      # вся інфраструктура: база + API
├── .env.example            # шаблон змінних середовища
├── docs/API.md             # контракт API — спочатку описуємо, потім пишемо
├── client/                 # фронтенд (пізніше)
└── server/
    ├── Dockerfile
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma   # схема бази
    │   ├── seed.js         # наповнення бази
    │   └── data/           # обрізаний датасет Барселони (CSV)
    ├── scripts/            # службові скрипти (обрізка датасету)
    ├── src/
    │   ├── server.js       # запуск сервера
    │   ├── app.js          # Express-застосунок
    │   ├── db.js           # Prisma Client
    │   ├── routes/         # ендпоінти
    │   ├── mappers/        # перетворення даних з БД у відповідь API
    │   └── utils/          # чисті допоміжні функції
    └── tests/
```

## Перший запуск

Потрібні: Git, Docker Desktop (запущений), Node.js 22 (для автодоповнення в редакторі).

```bash
git clone <url> && cd tripto
cp .env.example .env

docker compose up -d --build          # підняти базу і API
docker compose logs -f api            # подивитись логи API (Ctrl+C — вийти)

docker compose exec api npx prisma migrate dev   # створити таблиці
docker compose exec api npx prisma db seed       # наповнити даними
```

Перевірка: <http://localhost:3000/api/health> та <http://localhost:3000/api/listings>

Для автодоповнення в редакторі також виконай `npm install` у папці `server` на своєму комп'ютері.

## Щоденні команди

Усі команди Node/Prisma виконуємо **всередині контейнера** `api`:

| Що | Команда |
|----|---------|
| Запустити все | `docker compose up -d` |
| Зупинити | `docker compose down` |
| Нова міграція після зміни схеми | `docker compose exec api npx prisma migrate dev --name <назва>` |
| Перезаповнити базу | `docker compose exec api npx prisma db seed` |
| Скинути базу повністю | `docker compose exec api npm run db:reset` |
| Тести | `docker compose exec api npm test` |
| Встановити пакет | `docker compose exec api npm install <пакет>` |
| Зайти в базу через psql | `docker compose exec db psql -U tripto` |

Підключення з DBeaver / pgAdmin / VS Code: `localhost:5432`, користувач `tripto`, пароль `tripto`, база `tripto`.

## Коли щось не так

- **Порт 5432 зайнятий** — у тебе встановлений локальний Postgres. Постав `DB_PORT=5433` у `.env`.
- **Додали пакет, а контейнер його не бачить** — `docker compose up -d --build -V` (`-V` перестворює том з node_modules).
- **Сервер не перезапускається після збереження файлу (Windows)** — уже враховано: `nodemon --legacy-watch`. Якщо все одно ні — `docker compose restart api`.
- **`Can't reach database server at localhost:5432` всередині контейнера** — у контейнері хост бази `db`, а не `localhost`.
- **Почати з чистого аркуша** — `docker compose down -v` (видаляє і дані бази!).

## Дані

Дані: [Inside Airbnb](https://insideairbnb.com/), Barcelona, ліцензія [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Для навчання обрізано до ~200 оголошень скриптом `server/scripts/trim-dataset.js`.

## Git-процес

- `main` захищена, зміни — тільки через Pull Request
- Гілки: `feature/<коротко-що>`, наприклад `feature/listing-reviews`
- PR має пройти тести й рев'ю
