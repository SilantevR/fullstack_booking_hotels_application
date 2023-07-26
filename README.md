### Как запускать?

1. Убедитесь что у вас установлен `node` и `npm`,
2. Выполните команды `npm install`, ~~после `npm run bootstrap`чтобы установить зависимости,~~
3. Выполните команду `npm run start` чтобы запустить приложение,
4. Выполните команду `npm run start-client` чтобы запустить только клиент,
5. Выполните команду `npm run start-server` чтобы запустить только сервер

### Как добавить зависимости?

Чтобы добавить зависимость для клиента и сервера
~~`npx lerna add {your_dep}`~~
npm install <dependency>

для клиента
~~`npx lerna add {your_dep} --scope client`~~
npm install <dependency> -w client

для сервера
~~`npx lerna add {your_dep} --scope server`~~
npm install <dependency> -w server

Добавить dev зависимость, то же самое, но с флагом `dev`
~~`npx lerna add {your_dep} --dev --scope client`~~
npm install -D <dependency> -w <package>
