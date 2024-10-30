# se2-24-14-Kiruna-Explorer

Repository for the main project of the Software Engineering 2 (2024) course at Politecnico di Torino

## Getting started

### DB initialization

1. Create a `.env` file in the root directory of the repository, like the following:

```
EXPRESS_PORT=3001

POSTGRES_USER=kiruna
POSTGRES_PASSWORD=explorer
POSTGRES_DB=kiruna-db
POSTGRES_SERVICE=db
POSTGRES_PORT=5432
POSTGRES_PORT_TEST=5435

PGADMIN_EMAIL=kiruna@explorer.com
PGADMIN_PASSWORD=kiruna
```

2. Start the containers with `docker compose --profile dev up -d`.

3. Connect to pgAdmin web interface at the `localhost:5050` address.

4. Add a new connection to the DB (inside the **hostname** field insert `db`).
5. To stop the containers, run `docker compose --profile dev down`; if you also want to delete the local database data, execute `docker compose --profile dev down -v`.
