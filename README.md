# Online Store

## Технологии:
NestJS + PostgreSQL + TypeORM + Swagger + Docker

Это backend-часть интернет-магазина, разработанная на NestJS с использованием TypeORM для работы с базой данных и Docker для контейнеризации.

---

## 1. Установка зависимостей
Убедись, что у тебя установлены:

Node.js (версия 18 или выше)
Docker и Docker Compose

.env удален из .gitignore

## 2. Запуск с Docker
Собери и запусти контейнеры:

docker-compose up --build

Запуск:
При запуске запустятся миграции и сиды которые создадут пользователя с ролью "admin" и заполнят
таблицы "categories" и "products" случайными товарами(проверяет на уникальность).
Данные для входа в систему:

Email: admin@gmail.com
Пароль: password123
Приложение будет доступно на http://localhost:8000.

## 3. Документация API
API доступно через Swagger по адресу: http://localhost:8000/api.

## 4. 🐳 Docker
Структура контейнеров
db: PostgreSQL база данных.s
migrate: Контейнер для выполнения миграций.
app: Основное приложение.

Команды Docker
Запуск всех сервисов:
docker-compose

Остановка всех сервисов:
docker-compose down

Просмотр логов:
docker-compose logs -f app

## 5. Запуск без Docker
Установка зависимостей:
npm install

Применение миграций:
npm run migration:run

Запуск приложения:
npm run start
