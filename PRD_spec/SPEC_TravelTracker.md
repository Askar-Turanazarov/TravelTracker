# SPEC: TravelMap — Техническая спецификация

**Версия документа:** 1.0
**Дата:** 23.07.2026
**Статус:** Ready for Implementation
**Связанный документ:** PRD_TravelTracker.md v1.0

---

## 1. Технологический стек и Архитектурный паттерн

### 1.1 Стек технологий

| Слой | Технология | Обоснование выбора |
|---|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS | Быстрый DX, минимальный бандл без CRA-оверхеда, Tailwind ускоряет портфолио-полировку UI без написания кастомного CSS |
| Карта | Leaflet.js 1.9.x + `react-leaflet` | Легковес (~40KB gzip) в отличие от Mapbox GL/Google Maps, полная поддержка бесплатных тайлов и GeoJSON-слоёв, нет vendor lock-in |
| Тайлы карты | CartoDB Dark Matter (`{s}.basemaps.cartocdn.com/dark_all/`) | Бесплатны для non-commercial/low-volume использования, дают премиальный тёмный визуал «из коробки» |
| Backend | Node.js 20 LTS + Express.js | Единый язык (JS/TS) с фронтендом снижает контекст-свитчинг при соло-разработке, огромная экосистема middleware |
| Язык | TypeScript (strict mode) | Типобезопасность контрактов между слоями, самодокументируемый код — важно для портфолио-ревью |
| База данных | PostgreSQL 16 | Реляционная модель естественна для строгой схемы «пользователь → страны → города» с FK-constraints; нативная поддержка `COUNT DISTINCT`, оконных функций для агрегаций; расширение `pg_trgm` доступно на будущее для autocomplete-поиска |
| ORM / Query Builder | Prisma ORM | Типобезопасные запросы, автогенерация миграций, встроенная защита от SQL-инъекций, читаемые schema-файлы для ревьюеров |
| Аутентификация | JWT (access + refresh), `bcrypt` для хэширования | Stateless-подход упрощает горизонтальное масштабирование API без session-store |
| Валидация | Zod (shared schemas frontend/backend через monorepo-пакет `@travelmap/shared`) | Единый источник истины для форм валидации — устраняет рассинхрон FR-02/FR-03 (enum-валидация стран/городов) |
| Хостинг Backend | Render.com / Railway (free tier) | Нулевой бюджет, встроенный CI из GitHub, managed PostgreSQL на том же провайдере |
| Хостинг Frontend | Vercel / Netlify (free tier) | Автодеплой из GitHub, встроенный CDN, нулевая конфигурация для Vite-проектов |
| CI/CD | GitHub Actions | Бесплатно для публичных репозиториев, нативная интеграция с GitHub |

### 1.2 Архитектурный паттерн

**Клиент-серверная REST-архитектура с чёткой границей слоёв (Layered Architecture) на бэкенде:**

```
Frontend (React SPA)
        │  HTTPS / JSON
        ▼
┌─────────────────────────────────────┐
│           API Gateway Layer          │  Express Router + middleware
│  (auth, rate-limit, CORS, validation)│  (helmet, cors, express-rate-limit)
├─────────────────────────────────────┤
│         Controller Layer             │  HTTP-специфичная логика,
│                                       │  парсинг req/res
├─────────────────────────────────────┤
│          Service Layer               │  Бизнес-логика (agregация,
│                                       │  проверка владения ресурсом)
├─────────────────────────────────────┤
│        Repository Layer (Prisma)     │  Единственный слой, знающий
│                                       │  о структуре БД
└─────────────────────────────────────┘
        │
        ▼
   PostgreSQL 16
```

**Обоснование:** строгое разделение Controller/Service/Repository позволяет unit-тестировать бизнес-логику (Service Layer) без поднятия HTTP-сервера и без реальной БД (мокая Repository), что напрямую поддерживает NFR test coverage ≥70% из PRD.

**Frontend-архитектура:** Feature-Sliced подход — папки по доменным фичам (`features/auth`, `features/map`, `features/dashboard`), а не по техническому типу файла (`components/`, `hooks/` вперемешку). Состояние сервера — через `TanStack Query` (React Query) для кэширования, автоматической инвалидации при мутациях (закрывает FR-05: реактивное обновление статистики без full reload).

---

## 2. Схема базы данных (Data Model)

### 2.1 ER-диаграмма (текстовое представление)

```
┌──────────────────┐        ┌───────────────────────┐        ┌──────────────────┐
│      users        │        │  countries_reference   │        │ cities_reference │
├──────────────────┤        ├───────────────────────┤        ├──────────────────┤
│ id (PK)           │        │ code (PK) CHAR(2)      │───┐    │ id (PK)          │
│ email UNIQUE       │        │ name_en                │   │    │ country_code (FK)│
│ password_hash      │        │ name_ru                │   └───▶│ name             │
│ role               │        │ region                 │        │ latitude         │
│ created_at         │        └───────────────────────┘        │ longitude        │
│ updated_at         │                    ▲                    │ population       │
└──────────────────┘                    │                    └──────────────────┘
        │ 1                              │ FK                          ▲ FK
        │                                │                              │
        │ N                              │                              │
┌──────────────────┐                    │                    ┌──────────────────┐
│ visited_countries  │────────────────────┘                    │  visited_cities   │
├──────────────────┤                                          ├──────────────────┤
│ id (PK)            │                                          │ id (PK)           │
│ user_id (FK)        │──────────────────────────────────────▶│ user_id (FK)      │
│ country_code (FK)   │                                          │ city_id (FK)      │
│ added_at            │                                          │ country_code (FK) │
│ UNIQUE(user_id,     │                                          │ visit_date        │
│   country_code)     │                                          │ note              │
└──────────────────┘                                          │ created_at         │
                                                                 │ updated_at         │
                                                                 │ UNIQUE(user_id,    │
                                                                 │   city_id)         │
                                                                 └──────────────────┘
```

### 2.2 Детальные определения таблиц

#### 2.2.1 `users`

| Колонка | Тип | Constraints | Описание |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Суррогатный ключ, UUID вместо serial int — защита от enumeration-атак через перебор ID в URL |
| `email` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Индексируется автоматически через UNIQUE constraint |
| `password_hash` | `VARCHAR(60)` | `NOT NULL` | bcrypt-хэш фиксированной длины 60 символов |
| `display_name` | `VARCHAR(100)` | `NOT NULL` | Публичное имя в дашборде |
| `role` | `ENUM('traveler', 'admin')` | `NOT NULL DEFAULT 'traveler'` | RBAC-роль (см. PRD п.2.2) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Обновляется триггером `BEFORE UPDATE` |

**Индексы:** `idx_users_email` (создаётся автоматически UNIQUE constraint, но явно указывается для читаемости миграции).

#### 2.2.2 `countries_reference` (статичный seed, read-only в рантайме)

| Колонка | Тип | Constraints | Описание |
|---|---|---|---|
| `code` | `CHAR(2)` | `PRIMARY KEY` | ISO 3166-1 alpha-2, напр. `"FR"`, `"JP"` |
| `name_en` | `VARCHAR(100)` | `NOT NULL` | |
| `name_ru` | `VARCHAR(100)` | `NOT NULL` | Для локализации UI |
| `region` | `VARCHAR(50)` | `NOT NULL` | напр. `"Europe"`, `"Asia"` — используется для фильтров/группировки в UI |
| `centroid_lat` | `DECIMAL(9,6)` | `NOT NULL` | Центроид страны для fallback-отрисовки, если у пользователя добавлена страна без городов |
| `centroid_lng` | `DECIMAL(9,6)` | `NOT NULL` | |

**Seed-источник:** статичный датасет 195 стран-членов ООН (константа для расчёта % в FR-05), загружается миграцией `002_seed_countries.sql`.

#### 2.2.3 `cities_reference` (статичный seed, read-only в рантайме)

| Колонка | Тип | Constraints | Описание |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Числовой ID достаточен — таблица не пользовательских данных, enumeration не угроза |
| `country_code` | `CHAR(2)` | `NOT NULL REFERENCES countries_reference(code)` | |
| `name` | `VARCHAR(150)` | `NOT NULL` | |
| `latitude` | `DECIMAL(9,6)` | `NOT NULL` | |
| `longitude` | `DECIMAL(9,6)` | `NOT NULL` | |
| `population` | `INTEGER` | `NULL` | Используется для ограничения MVP-датасета (population > 100,000, см. PRD Риск 6.1) |

**Индексы:** `idx_cities_country_code ON cities_reference(country_code)` — критичен для FR-03 (фильтрация городов по выбранной стране), ожидаемый паттерн запроса высокочастотный.

**Seed-источник:** subset датасета GeoNames (cities с population > 100k), лицензия CC BY 4.0 совместима с публичным портфолио-репозиторием.

#### 2.2.4 `visited_countries`

| Колонка | Тип | Constraints | Описание |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Каскадное удаление при удалении аккаунта (GDPR, NFR 4.4) |
| `country_code` | `CHAR(2)` | `NOT NULL REFERENCES countries_reference(code)` | |
| `added_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Constraints:** `UNIQUE(user_id, country_code)` — реализует FR-02 (запрет дублей) на уровне БД, не полагаясь только на проверку в Service Layer.

**Индексы:** `idx_visited_countries_user_id ON visited_countries(user_id)` — покрывает основной паттерн запроса «все страны пользователя X».

#### 2.2.5 `visited_cities`

| Колонка | Тип | Constraints | Описание |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `city_id` | `INTEGER` | `NOT NULL REFERENCES cities_reference(id)` | |
| `country_code` | `CHAR(2)` | `NOT NULL REFERENCES countries_reference(code)` | Денормализация намеренная — избегаем JOIN через `cities_reference` при частой агрегации по странам (см. п.2.4 обоснование денормализации) |
| `visit_date` | `DATE` | `NULL` | Опционально по FR-03 |
| `note` | `VARCHAR(500)` | `NULL` | Лимит 500 символов из FR-03 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Constraints:**
- `UNIQUE(user_id, city_id)` — запрет дублей города для одного пользователя.
- `CHECK (char_length(note) <= 500)` — защита на уровне БД дополнительно к валидации на бэкенде (defense in depth).

**Индексы:**
- `idx_visited_cities_user_id ON visited_cities(user_id)` — основной паттерн выборки для дашборда/карты.
- `idx_visited_cities_country_code ON visited_cities(country_code)` — ускоряет агрегацию «города по стране» на дашборде.

### 2.3 Связи (Relationships)

| Связь | Тип | Правило удаления |
|---|---|---|
| `users` → `visited_countries` | 1:N | `ON DELETE CASCADE` (удаление юзера удаляет его записи — GDPR) |
| `users` → `visited_cities` | 1:N | `ON DELETE CASCADE` |
| `countries_reference` → `visited_countries` | 1:N | `ON DELETE RESTRICT` (нельзя удалить страну из справочника, если есть ссылки — защита целостности seed-данных) |
| `countries_reference` → `cities_reference` | 1:N | `ON DELETE RESTRICT` |
| `cities_reference` → `visited_cities` | 1:N | `ON DELETE RESTRICT` |

**Важное уточнение к FR-06 (каскадное удаление страны у пользователя):** каскад в FR-06 относится к бизнес-логике Service Layer (при удалении пользователем своей `visited_countries`-записи, Service явно удаляет связанные `visited_cities` этого же пользователя для этой страны через транзакцию), а не к `ON DELETE CASCADE` на уровне `countries_reference`, которая остаётся защищённой `RESTRICT` как read-only справочник. См. алгоритм в п.4.3.

### 2.4 Обоснование денормализации

Поле `visited_cities.country_code` дублирует данные, доступные через `cities_reference.country_code`. Решение принято осознанно:
- Дашборд-агрегация (FR-05) регулярно фильтрует/группирует города по странам — денормализация избегает JOIN на горячем пути.
- Целостность гарантируется приложением: при вставке в Service Layer `country_code` берётся из `cities_reference` по `city_id`, а не принимается напрямую от клиента (см. API-контракт п.3.4, поле `country_code` отсутствует в теле запроса `POST /visited-cities`).

---

## 3. API Contracts & Endpoints

**Base URL:** `/api/v1`
**Формат:** JSON, `Content-Type: application/json`
**Аутентификация:** `Authorization: Bearer <access_token>` для всех защищённых эндпоинтов.

### 3.1 Общий формат ошибок

Все ошибки возвращаются в едином формате:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human-readable описание для UI",
    "details": null
  }
}
```

| HTTP Status | Когда используется |
|---|---|
| `400 Bad Request` | Некорректная структура запроса, отсутствуют обязательные поля |
| `401 Unauthorized` | Отсутствует/невалиден/истёк JWT |
| `403 Forbidden` | Аутентифицирован, но нет прав на ресурс (не владелец / не admin) |
| `404 Not Found` | Ресурс не существует |
| `409 Conflict` | Нарушение уникальности (дубль email, страны, города) |
| `422 Unprocessable Entity` | Данные не проходят бизнес-валидацию (невалидный ISO-код, city_id не из справочника) |
| `429 Too Many Requests` | Сработал rate limiter |
| `500 Internal Server Error` | Необработанная серверная ошибка (логируется, клиенту не раскрываются детали) |

### 3.2 Auth Endpoints

#### `POST /api/v1/auth/register`

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "traveler@example.com",
  "password": "SecurePass123!",
  "display_name": "Alex Wanderer"
}
```

**Валидация (Zod schema):**
- `email`: валидный email формат, max 255 символов.
- `password`: min 8 символов, минимум 1 цифра, 1 буква (regex `^(?=.*[A-Za-z])(?=.*\d).{8,}$`).
- `display_name`: 2–100 символов, непустая строка после trim.

**Response `201 Created`:**
```json
{
  "user": {
    "id": "3f2a9c1e-...",
    "email": "traveler@example.com",
    "display_name": "Alex Wanderer",
    "role": "traveler"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

**Response `409 Conflict`:**
```json
{ "error": { "code": "EMAIL_ALREADY_EXISTS", "message": "Пользователь с таким email уже существует", "details": null } }
```

---

#### `POST /api/v1/auth/login`

**Request Body:**
```json
{ "email": "traveler@example.com", "password": "SecurePass123!" }
```

**Response `200 OK`:** идентичен структуре `register` (без поля `display_name` не меняется).

**Response `401 Unauthorized`:**
```json
{ "error": { "code": "INVALID_CREDENTIALS", "message": "Неверный email или пароль", "details": null } }
```
*Примечание:* сообщение намеренно одинаковое и для несуществующего email, и для неверного пароля — защита от user enumeration.

**Rate limit:** 5 запросов / 15 минут / IP → при превышении `429 Too Many Requests`.

---

#### `POST /api/v1/auth/refresh`

**Request Body:**
```json
{ "refresh_token": "eyJhbGciOiJIUzI1NiIs..." }
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs... (новый, старый инвалидирован)",
  "expires_in": 900
}
```

**Response `401 Unauthorized`:** если refresh token истёк, отозван или уже был использован (rotation detection — см. п.5.2).

---

#### `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <access_token>`
**Request Body:** `{ "refresh_token": "..." }`
**Response `204 No Content`** — refresh token добавляется в blacklist (таблица `revoked_tokens`, см. п.5.2).

---

### 3.3 Reference Data Endpoints (публичные, read-only)

#### `GET /api/v1/reference/countries`

**Query params:** `?region=Europe` (опционально, фильтр)

**Response `200 OK`:**
```json
{
  "countries": [
    { "code": "FR", "name_en": "France", "name_ru": "Франция", "region": "Europe" },
    { "code": "JP", "name_en": "Japan", "name_ru": "Япония", "region": "Asia" }
  ]
}
```
**Кэширование:** `Cache-Control: public, max-age=86400` — данные статичны, кэшируются на CDN/браузере на сутки.

---

#### `GET /api/v1/reference/cities?country_code=FR`

**Query params:** `country_code` (обязателен, CHAR(2))

**Response `200 OK`:**
```json
{
  "cities": [
    { "id": 4521, "name": "Paris", "latitude": 48.8566, "longitude": 2.3522 },
    { "id": 4522, "name": "Lyon", "latitude": 45.7640, "longitude": 4.8357 }
  ]
}
```

**Response `422 Unprocessable Entity`** если `country_code` не найден в `countries_reference`:
```json
{ "error": { "code": "INVALID_COUNTRY_CODE", "message": "Указанный код страны не найден в справочнике", "details": null } }
```

---

### 3.4 Visited Locations Endpoints (защищённые, JWT обязателен)

#### `GET /api/v1/visited-countries`

Возвращает все страны текущего пользователя (из `req.user.id`, извлечённого из JWT — **не из query/body**, во избежание IDOR).

**Response `200 OK`:**
```json
{
  "countries": [
    { "id": "a1b2...", "country_code": "FR", "name_en": "France", "added_at": "2026-03-15T10:00:00Z" }
  ]
}
```

---

#### `POST /api/v1/visited-countries`

**Request Body:**
```json
{ "country_code": "FR" }
```

**Валидация:** `country_code` должен существовать в `countries_reference` (проверка через Repository, не regex — источник истины БД).

**Response `201 Created`:**
```json
{ "id": "a1b2...", "country_code": "FR", "added_at": "2026-07-23T12:00:00Z" }
```

**Response `409 Conflict`:** если уже добавлена (см. FR-02).
**Response `422 Unprocessable Entity`:** если `country_code` не из справочника.

---

#### `DELETE /api/v1/visited-countries/:id`

**Path params:** `id` (UUID записи `visited_countries`, не `country_code`).

**Бизнес-логика:** см. Алгоритм 4.3 (каскадное удаление городов этой страны у этого же пользователя, обёрнутое в транзакцию).

**Response `200 OK`:**
```json
{ "deleted_country_id": "a1b2...", "cascaded_cities_deleted": 3 }
```

**Response `403 Forbidden`:** если `user_id` записи не совпадает с `req.user.id`.
**Response `404 Not Found`:** если `id` не существует.

---

#### `GET /api/v1/visited-cities`

**Query params (опционально):** `?country_code=FR` — фильтр по стране.

**Response `200 OK`:**
```json
{
  "cities": [
    {
      "id": "c9d8...",
      "city_id": 4521,
      "name": "Paris",
      "country_code": "FR",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "visit_date": "2026-05-01",
      "note": "Первая поездка в Европу",
      "created_at": "2026-05-10T08:00:00Z"
    }
  ]
}
```

---

#### `POST /api/v1/visited-cities`

**Request Body:**
```json
{
  "city_id": 4521,
  "visit_date": "2026-05-01",
  "note": "Первая поездка в Европу"
}
```
*Примечание:* `country_code` **не принимается от клиента** — Service Layer выводит его из `city_id` через `cities_reference` (защита от рассинхрона денормализованного поля, см. п.2.4).

**Валидация:**
- `city_id`: должен существовать в `cities_reference`.
- `visit_date`: формат `YYYY-MM-DD`, не может быть в будущем (`<= today`).
- `note`: max 500 символов.

**Response `201 Created`:** структура как в `GET /visited-cities` (один объект).

**Response `400 Bad Request`:**
```json
{ "error": { "code": "COUNTRY_NOT_ADDED", "message": "Сначала добавьте страну этого города в свой профиль", "details": { "required_country_code": "FR" } } }
```
*(см. FR-03 AC3 — проверка, что родительская страна уже есть в `visited_countries` пользователя, реализована в Service Layer, не constraint'ом БД, т.к. это кросс-табличная бизнес-проверка).*

**Response `409 Conflict`:** город уже добавлен.
**Response `422 Unprocessable Entity`:** `city_id` не из справочника, либо `visit_date` в будущем.

---

#### `PATCH /api/v1/visited-cities/:id`

**Request Body (частичное обновление):**
```json
{ "visit_date": "2026-05-03", "note": "Обновлённая заметка" }
```
*(city_id и country_code неизменяемы после создания — для смены города требуется удалить и создать новую запись, что упрощает инвалидацию кэша и избегает скрытых side-эффектов)*

**Response `200 OK`:** обновлённый объект.
**Response `403 Forbidden`:** не владелец.

---

#### `DELETE /api/v1/visited-cities/:id`

**Response `200 OK`:** `{ "deleted_city_id": "c9d8..." }`
**Response `403 Forbidden`:** не владелец.

---

### 3.5 Dashboard / Statistics Endpoint

#### `GET /api/v1/dashboard/stats`

**Response `200 OK`:**
```json
{
  "total_countries_visited": 12,
  "total_cities_visited": 27,
  "world_percentage": 6.15,
  "countries_by_region": [
    { "region": "Europe", "count": 8 },
    { "region": "Asia", "count": 4 }
  ],
  "latest_visits": [
    { "city_name": "Paris", "country_code": "FR", "visit_date": "2026-05-01" }
  ]
}
```

**Реализация:** один SQL-запрос с CTE (Common Table Expression), см. Алгоритм 4.1. `world_percentage` рассчитывается как `ROUND(total_countries_visited / 195.0 * 100, 2)`, где `195` — константа из `config/constants.ts`, не magic number в SQL.

---

### 3.6 Admin Endpoints

#### `GET /api/v1/admin/users`

**Требует:** `req.user.role === 'admin'`, иначе `403 Forbidden`.

**Query params:** `?page=1&limit=20` (пагинация обязательна — защита от неограниченной выгрузки, NFR производительность).

**Response `200 OK`:**
```json
{
  "users": [
    { "id": "3f2a...", "email": "traveler@example.com", "display_name": "Alex Wanderer", "countries_count": 12, "cities_count": 27, "created_at": "2026-01-10T00:00:00Z" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 143, "total_pages": 8 }
}
```

---

### 3.7 User Account Endpoints

#### `DELETE /api/v1/users/me`

**Требует:** подтверждение паролем в теле запроса (защита от CSRF/случайного удаления):
```json
{ "password": "SecurePass123!" }
```

**Response `204 No Content`** — hard delete каскадно удаляет `visited_countries`, `visited_cities` (см. NFR 4.4, GDPR).
**Response `401 Unauthorized`:** если пароль не совпадает.

---

## 4. Логика модулей и Edge-Cases

### 4.1 Алгоритм: Расчёт статистики дашборда (FR-05)

```sql
WITH country_stats AS (
    SELECT COUNT(DISTINCT vc.country_code) AS total_countries
    FROM visited_countries vc
    WHERE vc.user_id = $1
),
city_stats AS (
    SELECT COUNT(DISTINCT vci.id) AS total_cities
    FROM visited_cities vci
    WHERE vci.user_id = $1
),
region_breakdown AS (
    SELECT cr.region, COUNT(DISTINCT vc.country_code) AS count
    FROM visited_countries vc
    JOIN countries_reference cr ON cr.code = vc.country_code
    WHERE vc.user_id = $1
    GROUP BY cr.region
    ORDER BY count DESC
)
SELECT
    cs.total_countries,
    cts.total_cities,
    ROUND(cs.total_countries::numeric / 195 * 100, 2) AS world_percentage
FROM country_stats cs, city_stats cts;
-- region_breakdown запрашивается отдельным запросом в том же DB-транзакции (read-only, isolation level READ COMMITTED достаточен)
```

**Обоснование:** агрегация выполняется в БД (не в Node.js через выгрузку всех строк), что соответствует NFR 4.1 (< 50мс при 10k записей) — PostgreSQL использует индекс `idx_visited_countries_user_id`/`idx_visited_cities_user_id` для `WHERE user_id = $1`.

### 4.2 Алгоритм: Добавление города с проверкой родительской страны (FR-03)

```
FUNCTION addVisitedCity(userId, cityId, visitDate, note):
    1. city = Repository.findCityById(cityId)
       IF city IS NULL:
           RETURN 422 "INVALID_CITY_ID"

    2. countryAdded = Repository.findVisitedCountry(userId, city.country_code)
       IF countryAdded IS NULL:
           RETURN 400 "COUNTRY_NOT_ADDED" WITH details.required_country_code = city.country_code

    3. IF visitDate IS NOT NULL AND visitDate > TODAY:
           RETURN 422 "VISIT_DATE_IN_FUTURE"

    4. TRY:
           newRecord = Repository.insertVisitedCity({
               userId, cityId,
               countryCode: city.country_code,  -- берётся из справочника, НЕ из клиента
               visitDate, note
           })
       CATCH UniqueConstraintViolation:
           RETURN 409 "CITY_ALREADY_ADDED"

    5. RETURN 201 newRecord
```

### 4.3 Алгоритм: Удаление страны с каскадом городов (FR-06)

**Edge-case:** пользователь удаляет страну, у которой уже есть добавленные города — необходима транзакционная целостность (нельзя оставить "осиротевшие" города, ссылающиеся на страну, которой нет в `visited_countries` пользователя).

```
FUNCTION deleteVisitedCountry(userId, visitedCountryId):
    1. record = Repository.findVisitedCountryById(visitedCountryId)
       IF record IS NULL: RETURN 404
       IF record.user_id != userId: RETURN 403

    2. BEGIN TRANSACTION (isolation: READ COMMITTED)
       2.1. citiesDeleted = Repository.deleteVisitedCitiesByCountry(userId, record.country_code)
            -- DELETE FROM visited_cities WHERE user_id = $1 AND country_code = $2
       2.2. Repository.deleteVisitedCountry(visitedCountryId)
    3. COMMIT

    4. RETURN 200 { deleted_country_id, cascaded_cities_deleted: citiesDeleted.count }

    -- ON ANY ERROR: ROLLBACK, RETURN 500
```

**Frontend edge-case (UX):** перед вызовом DELETE, если у страны есть города (`cities_count > 0` из локального состояния), показать confirm-модалку: *«Будет удалено N городов вместе со страной. Продолжить?»* — не полагаться только на backend-ответ постфактум.

### 4.4 Edge-Case: Гонка при повторном добавлении (race condition)

**Сценарий:** пользователь дважды быстро кликает "Добавить страну" (двойной клик / медленная сеть).

**Митигация:**
- Backend: `UNIQUE(user_id, country_code)` constraint — второй INSERT падает с ошибкой БД, перехватывается и превращается в `409 Conflict`.
- Frontend: кнопка дизейблится (`disabled={isPending}`) сразу после первого клика через `TanStack Query` mutation state, до получения ответа сервера.

### 4.5 Edge-Case: Истёкший access token посреди сессии

```
FUNCTION apiClientInterceptor(request):
    response = fetch(request)
    IF response.status == 401 AND request.url != '/auth/refresh':
        newTokens = POST /auth/refresh WITH storedRefreshToken
        IF newTokens.success:
            retry original request WITH newTokens.access_token
        ELSE:
            clearLocalTokens()
            redirect to /login
    RETURN response
```

### 4.6 Edge-Case: Удаление аккаунта с активной сессией на другом устройстве

При `DELETE /users/me`, все существующие refresh tokens пользователя немедленно инвалидируются (запись в `revoked_tokens` по `user_id`, либо — эффективнее — проверка `EXISTS(SELECT 1 FROM users WHERE id = $1)` при каждом refresh, что естественным образом провалится после hard delete).

### 4.7 Edge-Case: Пустой справочник городов для маленькой страны

Некоторые страны (напр. Ватикан, Монако) могут не иметь городов с population > 100k в seed-датасете. **Решение:** для таких стран `GET /reference/cities?country_code=VA` возвращает пустой массив `{"cities": []}` (не ошибку), а UI формы добавления города показывает состояние *«Крупные города для этой страны не найдены — страна уже отмечена на карте по центроиду»*, ссылаясь на `centroid_lat/lng` из `countries_reference`.

---

## 5. DevOps, Безопасность и Deploy Pipeline

### 5.1 Аутентификация/Авторизация (детали реализации)

- **JWT Payload:** `{ "sub": "<user_id>", "role": "traveler", "iat": ..., "exp": ... }`. Роль включена в токен для быстрой авторизационной проверки middleware без похода в БД на каждый запрос; при этом критичные для владения ресурсом проверки (см. п.4) всегда идут через `WHERE user_id = req.user.sub` на уровне запроса к БД, а не доверяют одному лишь токену для данных.
- **RBAC Middleware:**
  ```
  requireRole('admin') → проверяет req.user.role после requireAuth()
  requireAuth() → верифицирует JWT подпись (HS256, секрет из ENV), декодирует, кладёт в req.user
  ```
- **Секреты:** `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — раздельные секреты для access/refresh токенов (компрометация одного не даёт подделать другой), хранятся в ENV, никогда не коммитятся (см. `.env.example` в репо с плейсхолдерами).

### 5.2 Refresh Token Rotation & Revocation

Таблица `refresh_tokens` (не рассматривалась в основной ER-диаграмме п.2, т.к. служебная):

| Колонка | Тип | Описание |
|---|---|---|
| `token_id` | `UUID PK` | Уникальный ID токена (jti claim в JWT) |
| `user_id` | `UUID FK` | |
| `revoked` | `BOOLEAN DEFAULT false` | |
| `expires_at` | `TIMESTAMPTZ` | |

При каждом `/auth/refresh`: старый `token_id` помечается `revoked=true`, выдаётся новый. Если приходит запрос с уже `revoked=true` токеном — это сигнал возможной компрометации (token reuse detection) → **все** refresh-токены пользователя инвалидируются, требуется повторный логин.

### 5.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml (описание пайплайна)
on: [push, pull_request]
jobs:
  backend-checks:
    steps:
      - checkout
      - setup Node 20
      - npm ci
      - npm run typecheck       # tsc --noEmit
      - npm run lint            # ESLint strict
      - npm run test            # Jest unit + integration (тестовая БД в Docker service)
      - npm run build

  frontend-checks:
    steps:
      - checkout
      - setup Node 20
      - npm ci
      - npm run typecheck
      - npm run lint
      - npm run build
      - lighthouse-ci run       # проверка соответствия NFR 5.1 (Perf/A11y ≥ 90) прямо в CI

deploy:
  needs: [backend-checks, frontend-checks]
  if: github.ref == 'refs/heads/main'
  steps:
    - trigger Render deploy hook (backend)
    - trigger Vercel deploy hook (frontend) — обычно автоматический через GitHub интеграцию
```

**Правило веток:** `main` защищена (branch protection), мердж только через PR с зелёным CI. Прямые пуши запрещены.

### 5.4 Миграции БД

Prisma Migrate — миграции версионируются в `/prisma/migrations`, применяются автоматически при деплое backend (`prisma migrate deploy` как часть start-скрипта, **не** `migrate dev` в production). Seed-скрипты (`prisma/seed.ts`) для справочников запускаются отдельно, один раз при первом деплое, идемпотентны (`ON CONFLICT DO NOTHING` на уровне INSERT).

### 5.5 Мониторинг и логирование

- **Структурированные логи:** JSON-формат через `pino` (быстрее `winston`, важно при free-tier CPU-лимитах хостинга). Обязательные поля: `timestamp`, `level`, `request_id`, `user_id` (если аутентифицирован), `route`, `status_code`, `duration_ms`.
- **Request ID:** middleware генерирует `X-Request-ID` (UUID) на входе, прокидывается через весь request lifecycle и в ответ — упрощает трассировку конкретного запроса при дебаге.
- **Что НЕ логируется:** пароли (даже хэши), полные JWT-токены, содержимое `note` пользователей (потенциально приватные данные — NFR 4.4).
- **Health-check endpoint:** `GET /api/v1/health` → `200 OK { "status": "ok", "db": "connected" }`, используется хостинг-провайдером для liveness-проверок.

### 5.6 Безопасность (Deploy-специфичные меры)

| Мера | Реализация |
|---|---|
| HTTPS-only | Принудительный редирект HTTP→HTTPS на уровне хостинг-платформы (Render/Vercel делают это по умолчанию) |
| Security headers | `helmet` middleware: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` |
| CORS | Whitelist только домена production-фронтенда + `localhost` в dev-окружении, читается из ENV `ALLOWED_ORIGINS` |
| Секреты в ENV | Никогда не в коде/репозитории; на Render/Vercel — через встроенный Secrets Manager платформы |
| Dependency scanning | `npm audit` в CI-пайплайне, блокирует деплой при `high`/`critical` уязвимостях |
| SQL-инъекции | Исключены архитектурно — весь доступ к БД идёт через Prisma (параметризованные запросы), сырой SQL из п.4.1 также выполняется через `prisma.$queryRaw` с параметризацией (`$1`), не строковую конкатенацию |

### 5.7 Окружения (Environments)

| Окружение | Назначение | БД |
|---|---|---|
| `local` | Разработка на машине разработчика | Docker Compose PostgreSQL |
| `staging` (опционально, если позволяет free-tier) | Финальная проверка перед демо ревьюерам | Отдельная Render Postgres instance (free tier limit — 1 БД, может быть объединена с local через ветку) |
| `production` | Публичный портфолио-URL | Render/Railway managed Postgres |

---

*Конец документа SPEC. Документ покрывает полный контракт для немедленного старта разработки согласно Roadmap (PRD п.6.2, Фаза 1: Foundation).*