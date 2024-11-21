# Kiruna Explorer

Repository for the main project of the Software Engineering 2 (2024) course at Politecnico di Torino.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-v1.9.4-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
![Node.js v20 LTS](https://img.shields.io/badge/Node.js-v20%20LTS-brightgreen?style=flat&logo=node.js&logoColor=white)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostGIS](https://img.shields.io/badge/PostGIS-17--3.5-008000?style=flat&logo=postgresql&logoColor=white)](https://postgis.net/)

[![Static Badge](https://img.shields.io/badge/View_on_DockerHub-white?style=for-the-badge&logo=docker&logoSize=auto)]([https://hub.docker.com/](https://hub.docker.com/repository/docker/fpalazz/se2-24-14-kiruna-explorer/general))


## Getting started

In order to get the system up and running you need to:

1. Create a `.env.prod` file in the root directory of the repository, like the following:

```
SECRET=kirunaProdSecret
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=kiruna-db
POSTGRES_SERVICE=db
POSTGRES_PORT=5432
```

2. Execute the following command, always from the root:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up
```

This will start all the containers and, in a few seconds, it will be possible to access the website at the address `http://localhost:8080`.

### Stop the services

In order to stop the containers (without losing data), execute:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod down
```

If you want to both stop the services and erase all data, append the `-v` flag:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod down -v
```
### Default users
There are two default users:

- John, a `Urban Planner` (email: `john@kiruna.com`, password: `12345`)
- Kevin, a `Resident` (email: `kevin@kiruna.com`, password: `12345`)

## Development environment setup

### DB initialization

1. Create a `.env` file in the root directory of the repository, like the following:

```
SECRET=kirunasecret
POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db
POSTGRES_PORT=5432

PGADMIN_EMAIL=kiruna@explorer.com
PGADMIN_PASSWORD=kiruna
```

2. Start the containers with `docker compose up -d`.

3. Connect to pgAdmin web interface at the `localhost:5050` address.

4. Add a new connection to the DB (inside the **hostname** field insert `db`).
5. To stop the containers, run `docker compose down`; if you also want to delete the local database data, execute `docker compose down -v`.

### Test setup

1. Create a `.env.test` file in the root directory of the repository, like the following:

```
SECRET=kirunasecret
POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db
POSTGRES_PORT=5435
```

2. Start the database test container with `docker compose -f docker-compose.test.yml --env-file .env.test up -d`.

3. Run the tests with: `npm run test`.

   > if the database schema inside the container is not updated, stop the container with the command below and execute: `docker compose -f docker-compose.test.yml --env-file .env.test up -d --build`.

4. To stop and delete the database test container, run `docker compose -f docker-compose.test.yml down -v`.
