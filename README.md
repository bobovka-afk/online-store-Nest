# Online Store backend

## Технологии:
NestJS + PostgreSQL + TypeORM + Docker + Swagger

Проект представляет собой бэкенд онлайн-магазина, в котором реализованы следующие функции:

Аутентификация с использованием JWT. Реализован сброс пароль по почте.

Авторизация: Роли пользователей. Администратор может управлять пользователями, выдавая им роли.

Управление товарами: Администратор может создавать, редактировать товары и присваивать им несколько категорий.

Категории товаров: Пользователи могут выбирать категорию товара и просматривать список товаров с возможностью
фильтрации по цене и пагинации.

Корзина: Пользователи могут добавлять товары в корзину и выбирать количество.

Оформление заказа: При оформлении заказа из корзины происходит проверка наличия товара на складе,
и после оформления заказа товар списывается со склада.


## 1. Установка зависимостей
Убедись, что у тебя установлены:

Node.js (версия 18 или выше)
Docker и Docker Compose

.env удален из .gitignore

## 2. Запуск с Docker
Собери и запусти контейнеры:

docker-compose up --build
Автоматически запустятся миграции

Сиды:
npm run seed
Запускает сиды которые создадут пользователя с ролью "admin" и заполнят
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
