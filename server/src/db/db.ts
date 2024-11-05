import pg, { QueryResult } from "pg";

const container = process.env.CONTAINER ? true : false;

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: container ? process.env.POSTGRES_SERVICE : "localhost",
  port: Number(process.env.POSTGRES_PORT),
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
