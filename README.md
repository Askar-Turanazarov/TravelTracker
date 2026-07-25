# 🌍 TravelTracker — Personal Travel Diary by Askar Turanazarov

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend: React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](frontend)
[![Backend: Express](https://img.shields.io/badge/Backend-Express-000000?logo=express)](backend)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)

**TravelTracker** — ваш персональный дневник путешествий. Отмечайте страны и города, которые посетили, следите за прогрессом, сохраняйте даты и заметки. Красивая тёмная тема, интерактивная карта и детальная статистика.

---

## 📑 Содержание

- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Установка и запуск](#-установка-и-запуск)
- [Переменные окружения](#-переменные-окружения)
- [API Endpoints](#-api-endpoints)
- [Структура проекта](#-структура-проекта)
- [Деплой](#-деплой)

---

## ✨ Возможности

- 🔐 **Аутентификация** – регистрация и вход по email/паролю, JWT‑токены (access + refresh).
- 🗺 **Карта мира** – интерактивная Leaflet‑карта с тёмными тайлами, отображающая посещённые страны и города.
- 📊 **Дашборд** – счётчики стран, городов, процента мира, разбивка по регионам, последние визиты.
- 🌍 **Страны** – добавление/удаление стран из списка посещённых, каскадное удаление городов.
- 🏙 **Города** – добавление, редактирование заметок и дат, удаление.
- 👑 **Админ‑панель** – просмотр всех пользователей с пагинацией (только для администраторов).
- 🛡 **Безопасность** – bcrypt‑хэши, refresh‑token rotation, rate limiting, Helmet, CORS.
- 🎨 **Стильный UI** – тёмная тема, стеклянные карточки, анимированный фон.

---

## 🛠 Технологии

| Слой | Технология |
|------|------------|
| **Frontend** | React 18 (Vite), TypeScript, Tailwind CSS, React Router, TanStack Query, Leaflet, Zod |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, Pino, Zod |
| **DevOps** | GitHub Actions (CI/CD), Render/Railway (backend), Vercel/Netlify (frontend) |

---

## 🚀 Установка и запуск

### Требования

- **Node.js** v20+
- **PostgreSQL** 16+ (локально или Docker)
- **npm** 9+

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/traveltracker.git
cd traveltracker

2. Настройка backend

cd backend
npm install
cp .env.example .env   # отредактируйте DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
Запуск PostgreSQL через Docker (опционально):


docker run -d --name traveltracker-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=traveltracker -p 5432:5432 postgres:16
Миграции и заполнение базы:

bash
npx prisma migrate dev --name init
npx prisma db seed

Запуск сервера:

bash
npm run dev
Сервер поднимется на http://localhost:4000. Health‑check: /api/v1/health.

3. Настройка frontend
bash
cd ../frontend
npm install
cp .env.example .env   # укажите VITE_API_URL=http://localhost:4000/api/v1
npm run dev
Приложение откроется на http://localhost:3000.

🔐 Переменные окружения
Backend (backend/.env)
Переменная	Описание	По умолчанию
DATABASE_URL	Строка подключения к PostgreSQL	postgresql://postgres:postgres@localhost:5432/traveltracker
JWT_ACCESS_SECRET	Секрет для access‑токенов	обязательно сменить
JWT_REFRESH_SECRET	Секрет для refresh‑токенов	обязательно сменить
PORT	Порт сервера	4000
NODE_ENV	Окружение	development
ALLOWED_ORIGINS	Разрешённые origin (через запятую)	http://localhost:3000
Frontend (frontend/.env)
Переменная	Описание	По умолчанию
VITE_API_URL	Базовый URL API	http://localhost:4000/api/v1
📡 API Endpoints
Все URL начинаются с /api/v1.
Защищённые эндпоинты требуют заголовок Authorization: Bearer <access_token>.

Аутентификация (/auth)
Метод	Путь	Описание	Защита
POST	/register	Регистрация нового пользователя	❌
POST	/login	Вход	❌ (rate‑limit)
POST	/refresh	Обновление токенов	❌
POST	/logout	Выход (отзыв refresh‑токена)	❌
Справочники (/reference)
Метод	Путь	Описание	Защита
GET	/countries?region=Europe	Список стран (опциональный фильтр)	❌
GET	/cities?country_code=FR	Города по коду страны	❌
Посещённые страны (/visited-countries)
Метод	Путь	Описание	Защита
GET	/	Список стран пользователя	✅
POST	/	Добавить страну ({"country_code":"UZ"})	✅
DELETE	/:id	Удалить страну (каскад)	✅
Посещённые города (/visited-cities)
Метод	Путь	Описание	Защита
GET	/?country_code=UZ	Список городов (опциональный фильтр)	✅
POST	/	Добавить город	✅
PATCH	/:id	Обновить заметку/дату	✅
DELETE	/:id	Удалить город	✅
Дашборд (/dashboard)
Метод	Путь	Описание	Защита
GET	/stats	Статистика пользователя	✅
Администрирование (/admin)
Метод	Путь	Описание	Защита
GET	/users?page=1&limit=20	Все пользователи (пагинация)	✅ (admin)
Пользователь (/users)
Метод	Путь	Описание	Защита
DELETE	/me	Удалить свой аккаунт (требует пароль)	✅
📁 Структура проекта
text
TravelTracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── shared/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
└── README.md
🌐 Деплой
Backend (Render.com)
Подключите репозиторий к Render.

Создайте Web Service, укажите команду сборки npm install && npx prisma generate && npx prisma migrate deploy и команду запуска npm start.

Добавьте все переменные окружения из .env.example.

Frontend (Vercel)
Подключите репозиторий к Vercel.

Укажите корневую папку frontend.

Добавьте переменную окружения VITE_API_URL с URL вашего backend.

📄 Лицензия
MIT © 2026 [Ваше имя или GitHub]

English version below

🌍 TravelTracker — Personal Travel Diary
https://img.shields.io/badge/License-MIT-blue.svg
https://img.shields.io/badge/Frontend-React-61DAFB?logo=react
https://img.shields.io/badge/Backend-Express-000000?logo=express
https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql

TravelTracker is your personal travel diary. Mark countries and cities you've visited, track progress, save dates and notes. Beautiful dark theme, interactive map and detailed statistics.

📑 Table of Contents
Features

Technologies

Installation & Running

Environment Variables

API Endpoints

Project Structure

Deployment

✨ Features
🔐 Authentication – register/login with email/password, JWT tokens (access + refresh).

🗺 World Map – interactive Leaflet map with dark tiles, displaying visited countries and cities.

📊 Dashboard – counters for countries, cities, world percentage, regional breakdown, latest visits.

🌍 Countries – add/remove countries from visited list, cascading deletion of cities.

🏙 Cities – add, edit notes/dates, delete.

👑 Admin Panel – view all users with pagination (admin only).

🛡 Security – bcrypt hashing, refresh‑token rotation, rate limiting, Helmet, CORS.

🎨 Stylish UI – dark theme, glassmorphism cards, animated background.

🛠 Technologies
Layer	Technology
Frontend	React 18 (Vite), TypeScript, Tailwind CSS, React Router, TanStack Query, Leaflet, Zod
Backend	Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, Pino, Zod
DevOps	GitHub Actions (CI/CD), Render/Railway (backend), Vercel/Netlify (frontend)
🚀 Installation & Running
Prerequisites
Node.js v20+

PostgreSQL 16+ (local or Docker)

npm 9+

1. Clone the Repository
bash
git clone https://github.com/your-username/traveltracker.git
cd traveltracker
2. Backend Setup
bash
cd backend
npm install
cp .env.example .env   # edit DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
Start PostgreSQL via Docker (optional):

bash
docker run -d --name traveltracker-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=traveltracker -p 5432:5432 postgres:16
Migrations and Seed:

bash
npx prisma migrate dev --name init
npx prisma db seed
Start Server:

bash
npm run dev
Server will start at http://localhost:4000. Health‑check: /api/v1/health.

3. Frontend Setup
bash
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:4000/api/v1
npm run dev
App will open at http://localhost:3000.

🔐 Environment Variables
Backend (backend/.env)
Variable	Description	Default
DATABASE_URL	PostgreSQL connection string	postgresql://postgres:postgres@localhost:5432/traveltracker
JWT_ACCESS_SECRET	Access token secret	must be changed
JWT_REFRESH_SECRET	Refresh token secret	must be changed
PORT	Server port	4000
NODE_ENV	Environment	development
ALLOWED_ORIGINS	Allowed origins (comma separated)	http://localhost:3000
Frontend (frontend/.env)
Variable	Description	Default
VITE_API_URL	API base URL	http://localhost:4000/api/v1
📡 API Endpoints
Base URL: /api/v1.
Protected endpoints require Authorization: Bearer <access_token>.

Authentication (/auth)
Method	Path	Description	Auth
POST	/register	Register new user	❌
POST	/login	Login	❌ (rate‑limited)
POST	/refresh	Refresh tokens	❌
POST	/logout	Logout (revoke refresh token)	❌
Reference Data (/reference)
Method	Path	Description	Auth
GET	/countries?region=Europe	List countries (optional filter)	❌
GET	/cities?country_code=FR	Cities by country code	❌
Visited Countries (/visited-countries)
Method	Path	Description	Auth
GET	/	User's visited countries	✅
POST	/	Add country ({"country_code":"UZ"})	✅
DELETE	/:id	Remove country (cascade)	✅
Visited Cities (/visited-cities)
Method	Path	Description	Auth
GET	/?country_code=UZ	User's visited cities (optional filter)	✅
POST	/	Add city	✅
PATCH	/:id	Update note/date	✅
DELETE	/:id	Delete city	✅
Dashboard (/dashboard)
Method	Path	Description	Auth
GET	/stats	User statistics	✅
Admin (/admin)
Method	Path	Description	Auth
GET	/users?page=1&limit=20	All users (paginated)	✅ (admin)
User (/users)
Method	Path	Description	Auth
DELETE	/me	Delete own account (requires password)	✅
📁 Project Structure
text
TravelTracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── shared/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
└── README.md
🌐 Deployment
Backend (Render.com)
Connect your repository to Render.

Create a Web Service, set build command npm install && npx prisma generate && npx prisma migrate deploy and start command npm start.

Add all environment variables from .env.example.

Frontend (Vercel)
Connect repository to Vercel.

Set root folder frontend.

Add environment variable VITE_API_URL with your backend URL.

📄 License
MIT © 2026 [Askar Turanazarov / https://github.com/Askar-Turanazarov/TravelTracker]