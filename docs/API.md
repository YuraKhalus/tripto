# Tripto API — контракт

Базовий URL: `http://localhost:3000/api`
Інтерактивна документація (Swagger UI): `http://localhost:3000/api/docs`. Її джерело — `server/openapi.yaml`.
Змінюєш чи додаєш ендпоінт — оновлюй і цей файл, і `openapi.yaml` в одному PR.
Формат: JSON. Успішна відповідь має поле `data`, помилка — поле `error`.

```json
{ "data": ... }            // успіх
{ "error": "Listing not found" }   // помилка
```

## Статус-коди

| Код | Коли |
|-----|------|
| 200 | Усе добре |
| 400 | Невалідні вхідні дані (нечисловий id, дата не в тому форматі) |
| 404 | Ресурс не знайдено |
| 500 | Помилка на сервері |

---

## Заняття 1

### `GET /health`
Перевірка, що сервер живий.
```json
{ "status": "ok" }
```

### `GET /listings`
Список оголошень з пагінацією.

| Query | Тип | За замовчуванням | Обмеження |
|-------|-----|------------------|-----------|
| `page` | int | 1 | ≥ 1 |
| `limit` | int | 20 | 1–100 |

```json
{
  "data": [
    {
      "id": 1,
      "name": "Sunny flat in Gràcia",
      "pictureUrl": "https://...",
      "neighbourhood": "la Vila de Gràcia",
      "roomType": "Entire home/apt",
      "accommodates": 4,
      "price": 120,
      "rating": 4.8,
      "reviewsCount": 57,
      "location": { "lat": 41.40, "lng": 2.15 }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 200, "totalPages": 10 }
}
```

### `GET /listings/:id`
Повна інформація про житло разом із хостом.
Помилки: `400` якщо `id` не ціле додатне число, `404` якщо житла немає.

```json
{
  "data": {
    "id": 1,
    "name": "...",
    "description": "...",
    "propertyType": "Entire rental unit",
    "bedrooms": 2,
    "beds": 3,
    "bathroomsText": "1 bath",
    "amenities": ["Wifi", "Kitchen"],
    "minimumNights": 2,
    "price": 120,
    "host": { "id": 7, "name": "Marta", "isSuperhost": true, "pictureUrl": "...", "since": null }
  }
}
```

---

## Домашнє завдання до заняття 3

Кожен учень додає свій ендпоінт. Повний контракт (опис, параметри, помилки, приклад JSON) автор дописує сюди у своєму PR, під таблицею, у тому самому порядку.
Деталі й підказки — у PDF «ДЗ до заняття 3».

| Ендпоінт | Автор | Для чого |
|----------|-------|----------|
| `GET /listings/top-rated?limit=10` | Марко | блок «Найкраще» на головній |
| `GET /listings/:id/reviews` | Оленка | відгуки на сторінці житла |
| `GET /hosts/:id` | Назар | картка господаря |
| `GET /hosts/:id/listings` | Максим | «Інше житло господаря» |
| `GET /neighbourhoods` | Тана | фільтр «Район» на головній |

### `GET /listings/:id/reviews`
Відгуки до житла, від найновіших (за датою, потім за `id`). Пагінація як у `/listings`.
Помилки: `400` якщо `id` не ціле додатне число, `404` якщо житла немає.
Житло є, а відгуків немає → `200` і порожній `data`.

```json
{
  "data": [{ "id": 3402, "reviewerName": "Joel", "date": "2026-09-17", "comments": "..." }],
  "meta": { "page": 1, "limit": 20, "total": 20, "totalPages": 1 }
}
```

---

## Далі (кожен описує свій модуль)

- **Пошук і фільтри** — `GET /listings?city&checkIn&checkOut&guests&priceMin&priceMax&roomType&sort...`
- **Авторизація** — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, OAuth Google/Facebook
- **Бронювання** — `POST /bookings`, `GET /bookings/:id`, `DELETE /bookings/:id`
- **Профіль** — `GET /users/me`, `PATCH /users/me`, `GET /users/me/trips`, `GET /users/me/saved`
- **Обране** — `POST /listings/:id/save`, `DELETE /listings/:id/save`
- **Відгуки користувача** — `POST /listings/:id/reviews`
- **Календар** — `GET /listings/:id/availability?from=YYYY-MM-DD&to=YYYY-MM-DD`: `from` і `to` обов'язкові, `to` ≥ `from`, період до 90 днів; відповідь `[{ "date", "available", "price" }]`
