# se2-24-14-Kiruna-Explorer

Repository for the main project of the Software Engineering 2 (2024) course at Politecnico di Torino

## Getting started

### DB initialization

1. Create a `.env` file in the root directory of the repository, like the following:

```
EXPRESS_PORT=3001
SECRET=kirunasecret

POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db
POSTGRES_SERVICE=db
POSTGRES_PORT=5432
POSTGRES_PORT_TEST=5435

PGADMIN_EMAIL=kiruna@explorer.com
PGADMIN_PASSWORD=kiruna
```

2. Start the containers with `docker compose up -d`.

3. Connect to pgAdmin web interface at the `localhost:5050` address.

4. Add a new connection to the DB (inside the **hostname** field insert `db`).
5. To stop the containers, run `docker compose down`; if you also want to delete the local database data, execute `docker compose down -v`.

## Test setup

1. Create a `.env.test` file in the root directory of the repository, like the following:

```
EXPRESS_PORT=3001
SECRET=kirunasecret

POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db
POSTGRES_SERVICE=db-test
POSTGRES_PORT=5435
```

2. Start the database test container with `docker compose -f docker-compose.test.yml up -d`.

3. Run the tests with: `npm run test`.

   > if the database schema inside the container is not updated, stop the container with the command below and execute: `docker compose -f docker-compose.test.yml up -d --build`.

4. To stop and delete the database test container, run `docker compose -f docker-compose.test.yml down -v`.
