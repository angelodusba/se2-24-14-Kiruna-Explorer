# se2-24-14-Kiruna-Explorer

Repository for the main project of the Software Engineering 2 (2024) course at Politecnico di Torino

## Getting started

### DB initialization

1. Create a `.env` file in the root directory of the repository, like the following:

```
POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db

PGADMIN_EMAIL=kiruna@explorer.com
PGADMIN_PASSWORD=kiruna
```

2. Start the containers with `docker compose up -d`.

3. Connect to pgAdmin web interface at the `localhost:5050` address.

4. Add a new connection to the DB. Inside the **hostname** field insert the ip address of the db container (you can get it using `docker container inspect postgis`).
