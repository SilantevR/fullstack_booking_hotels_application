# Diplom - Netology fullstack js developer

## Booking hotels application - React single page aplication with server built on NestJS .

### Main technologies: TypeScript, MongoDB, Mongoose, React, NestJS, SocketIO, MaterialUI, ReactHookForm, Redux, ReactRouter, VITE, Lerna, Docker, Nginx, Certbot

### Деплой на облаке `https://diplomproject.duckdns.org`

### Техническое задание: `https://github.com/netology-code/fjs-diplom``

## Функционал

- Аутентификация и авторизация,
- Регистрация,
- Создание страниц гостиниц и номеров
- Загрузка фото номеров и гостиниц
- Поиск и бронирование номеров по датам
- Поиск пользователей и создание аккаунтов администратором
- Чаты тех. поддержки, создание/архивация чатов
- Отправка/получение сообщений по протоколу websocket,
- Подгрузка старых сообщений,
- Валидация вводимых пользователем значений.

## Установка

### Как запускать проект локально через Docker?

1. Убедитесь что у вас установлен `docker`, если используете Windows вам потребуется установка `WSL`,
2. Склонируйте репозиторий `git clone https://github.com/SilantevR/fullstack_booking_hotels_application.git`,
3. Перейдите в папку проекта,
4. Выполните команду `docker compose up -d`,
5. После создания и запуска контейнеров, приложение будет доступно на `http://localhost:3000.
6. Зарегистрируйте учетную запись в приложении.

#### Для доступа к полному функционалу приложения потребуется внести учетную запись `администратора` в базу данных

7. Выполните команду `docker ps`,
8. В списке найдите IMAGE с названием `mongo` скопируйте CONTAINER ID,
9. Выполните команду `docker exec -it <CONTAINER ID> mongosh --username <MONGO_INITDB_ROOT_USERNAME> --password`,
10. Введите пароль `<MONGO_INITDB_ROOT_PASSWORD>`,

#### P.S. `<MONGO_INITDB_ROOT_USERNAME>` и `<MONGO_INITDB_ROOT_PASSWORD>` переменные файла .env

11. db.users.insertOne({ name: "Admin", role: "admin", email: "Admin@mail.ru", phone: "+79999999999", password:'$2b$10$sGo9v5TPrUC/yuhNehr8WuS/czlP6n813liaarL3.5apVPqe5VILW' }),
12. Теперь вам доступна учетная запись администратора email: "Admin@mail.ru", password: "123_Aa_123"

### Как запускать проект локально через Lerna?

1. Убедитесь что у вас установлен `node`, `npm`, `git`, `mongodb`,
2. Склонируйте репозиторий `git clone https://github.com/SilantevR/fullstack_booking_hotels_application.git`,
3. Перейдите в папку проекта,
4. Выполните команды `npm install`,
5. Выполните команду `npm run start` чтобы запустить приложение в dev-режиме,
6. Выполните команду `npm run start-client` чтобы запустить только клиент в dev-режиме,
7. Выполните команду `npm run start-server` чтобы запустить только сервер в dev-режиме,

#### Для доступа к полному функционалу приложения потребуется внести учетную запись `администратора` в базу данных

8. Выполните команду `mongosh`,
9. db.users.insertOne({ name: "Admin", role: "admin", email: "Admin@mail.ru", phone: "+79999999999", password:'$2b$10$sGo9v5TPrUC/yuhNehr8WuS/czlP6n813liaarL3.5apVPqe5VILW' }),
10. Теперь вам доступна учетная запись администратора email: "Admin@mail.ru", password: "123_Aa_123"

### Как добавить зависимости через Lerna?

- Чтобы добавить зависимость для клиента и сервера: `npm install <dependency>`

- для клиента: `npm install <dependency> -w client`

- для сервера: `npm install <dependency> -w server`

Добавить dev зависимость, то же самое, но с флагом `-D`: `npm install -D <dependency> -w <package>`
