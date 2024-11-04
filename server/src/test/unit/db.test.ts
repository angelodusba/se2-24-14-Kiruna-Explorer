import { PoolClient } from "pg";
import UserDAO from "../../dao/userDAO";
import * as db from "../../db/db";

describe("Test DB", () => {
  let userDAO: UserDAO;

  beforeEach(() => {
    userDAO = new UserDAO();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Invoke the function to clear all mocks
    jest.restoreAllMocks(); // Invoke the function to restore all mocks
  });

  afterAll(async () => {
    await db.cleanup();
    await db.pool.end(); // Close the connection pool
  });

  test("DB connection", async () => {
    const users = await db.query("SELECT * FROM users");
    expect(users.rows.length).toBe(0);
  });
});
