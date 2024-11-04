import pg, { QueryResult } from "pg";

// The environment variable is used to determine which database to use.
// If the environment variable is not set, the development database is used.
// A separate database needs to be used for testing to avoid corrupting the development database and ensuring a clean state for each test.
// The environment variable is set in the package.json file in the test script.
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "dev";
const container = process.env.CONTAINER ? true : false;

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: container ? process.env.POSTGRES_SERVICE : "localhost",
  port:
    env === "dev"
      ? Number(process.env.POSTGRES_PORT) || 5432
      : Number(process.env.POSTGRES_PORT_TEST) || 5435,
  database: process.env.POSTGRES_DB,
});

// Test the connection
const init = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostGIS database");
    client.release();
  } catch (err: any) {
    console.error("Error connecting to PostGIS database", err.stack);
    throw new Error(err);
  }
};

const query = async (
  text: string,
  params: any[] | undefined = undefined
): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};

const cleanup = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM users");
    await client.query("DELETE FROM connections");
    await client.query("DELETE FROM documents_stakeholders");
    await client.query("DELETE FROM stakeholders");
    await client.query("DELETE FROM documents");
    await client.query("DELETE FROM types");
    await client.query("COMMIT");
  } catch (err: any) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export { init, query, pool, cleanup };
