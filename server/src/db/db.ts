import pg from "pg";

// The environment variable is used to determine which database to use.
// If the environment variable is not set, the development database is used.
// A separate database needs to be used for testing to avoid corrupting the development database and ensuring a clean state for each test.
// The environment variable is set in the package.json file in the test script.
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development";
const container = process.env.CONTAINER ? true : false;

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: container ? process.env.POSTGRES_SERVICE : "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
});

// Test the connection
const init = () => {
  pool
    .connect()
    .then((client) => {
      console.log("Connected to PostGIS database");
      client.release();
    })
    .catch((err) => console.error("Error connecting to PostGIS database", err.stack));
};

const query = (text: string, params: any, callback: any) => {
  return pool.query(text, params, callback);
};

export { init, query };
