# Diplom - Netology fullstack js developer

## Booking hotels application - React single page aplication with server built on NestJS .

### Main technologies:

![TypeScript](https://img.shields.io/badge/-typescript-0a0a0a?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/-mongodb-0a0a0a?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/-react-0a0a0a?style=for-the-badge&logo=react)
![ReactHookForm](https://img.shields.io/badge/-reacthookform-0a0a0a?style=for-the-badge&logo=reacthookform)
![Redux](https://img.shields.io/badge/-redux-0a0a0a?style=for-the-badge&logo=redux)
![ReactRouter](https://img.shields.io/badge/-reactrouter-0a0a0a?style=for-the-badge&logo=reactrouter)
![Vite](https://img.shields.io/badge/-vite-0a0a0a?style=for-the-badge&logo=vite)
![Lerna](https://img.shields.io/badge/-lerna-0a0a0a?style=for-the-badge&logo=lerna)
![NestJS](https://img.shields.io/badge/-nestjs-0a0a0a?style=for-the-badge&logo=nestjs)
![SoketIO](https://img.shields.io/badge/-socketio-0a0a0a?style=for-the-badge&logo=soketio)
![MaterialUI](https://img.shields.io/badge/-mui-0a0a0a?style=for-the-badge&logo=mui)
![Mongoose](https://img.shields.io/badge/-mongoose-0a0a0a?style=for-the-badge&logo=mongoose)
![Docker](https://img.shields.io/badge/-Docker-0a0a0a?style=for-the-badge&logo=Docker)
![Ubuntu](https://img.shields.io/badge/-Ubuntu-0a0a0a?style=for-the-badge&logo=Ubuntu)
![Nginx](https://img.shields.io/badge/-Nginx-0a0a0a?style=for-the-badge&logo=Nginx)
![letsencrypt](https://img.shields.io/badge/-letsencrypt-0a0a0a?style=for-the-badge&logo=letsencrypt)
<br/>

### Деплой на облаке: https://diplomproject.duckdns.org

### Техническое задание: https://github.com/netology-code/fjs-diplom

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
