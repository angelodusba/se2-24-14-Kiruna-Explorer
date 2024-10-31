import crypto from "crypto";
import * as db from "../db/db";
import { Role, User } from "../components/user";
import { UserAlreadyExistsError, UserNotFoundError } from "../errors/userErrors";

/**
 * A class that implements the interaction with the database for all user-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class UserDAO {
  /**
   * Checks whether the information provided during login (username and password) is correct.
   * @param email The email of the user.
   * @param plainPassword The password of the user (in plain text).
   * @returns A Promise that resolves to true if the user is authenticated, false otherwise.
   */
  async getIsUserAuthenticated(email: string, plainPassword: string): Promise<boolean> {
    try {
      const sql = "SELECT email, password, salt FROM users WHERE email = $1";
      const result = await db.query(sql, [email]);
      const row = result.rows[0];

      //If there is no user with the given email, or the user salt is not saved in the database, the user is not authenticated.
      if (!row || row.email !== email || !row.salt) {
        return false;
      }
      //Hashes the plain password using the salt and then compares it with the hashed password stored in the database
      const hashedPassword = crypto.scryptSync(plainPassword, row.salt, 16);
      const passwordHex = Buffer.from(row.password, "hex");
      if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
        return false;
      }
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * Creates a new user and saves their information in the database
   * @param username The username of the user. It must be unique.
   * @param email The email of the user
   * @param password The password of the user. It must be encrypted using a secure algorithm (e.g. scrypt, bcrypt, argon2)
   * @param role The role of the user. It must be one of the three allowed types ("Manager", "Customer", "Admin")
   * @returns A Promise that resolves to true if the user has been created.
   */
  async createUser(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<boolean> {
    try {
      const salt = crypto.randomBytes(16);
      const hashedPassword = crypto.scryptSync(password, salt, 16);
      const sql =
        "INSERT INTO users (username, email, role, password, salt) VALUES ($1, $2, $3, $4, $5)";
      await db.query(sql, [username, email, role, hashedPassword, salt]);
      return true;
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        throw new UserAlreadyExistsError();
      }
      throw new Error(err);
    }
  }

  /**
   * Returns a user object from the database based on the email.
   * @param email The email of the user to retrieve
   * @returns A Promise that resolves the information of the requested user
   */
  async getUserByEmail(email: string): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE email = $1";
      const result = await db.query(sql, [email]);
      const row = result.rows[0];
      if (!row) throw new UserNotFoundError();
      return new User(row.username, row.email, row.role);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Get all users from the database
   * @returns A Promise that resolves to true if the information has been updated
   **/
  async getUsers(): Promise<User[]> {
    try {
      const sql = "SELECT * FROM users";
      const result = await db.query(sql, []);
      const users: User[] = result.rows.map((row) => {
        return new User(row.username, row.email, row.role);
      });
      return users;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Get all users with a specific role from the database
   * @param role The role of the users to retrieve.
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const sql = "SELECT * FROM users WHERE role = $1";
      const result = await db.query(sql, [role]);
      const users: User[] = result.rows.map((row) => {
        return new User(row.username, row.email, row.role);
      });
      return users;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Deletes a user from the database
   * @param email The email of the user to delete
   * @returns A Promise that resolves to true if the user has been deleted
   */
  async deleteUser(email: string): Promise<boolean> {
    try {
      const sql = "DELETE FROM users WHERE username = $1";
      const result = await db.query(sql, [email]);
      if (result.rowCount === 0) {
        throw new UserNotFoundError();
      }
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Deletes all non-Admin users from the database
   * @returns A Promise that resolves to true if the information has been updated
   */
  async deleteAll(): Promise<boolean> {
    try {
      const sql = "DELETE FROM users";
      await db.query(sql, []);
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Updates the personal information of a user
   * @param username The username of the user
   * @param email The email of the user to update
   * @param role The new role of the user
   * @returns A Promise that resolves to the updated User object if the information has been updated
   */
  async updateUserInfo(username: string, email: string, role: Role): Promise<User> {
    try {
      const sql = "UPDATE users SET username = $1, email = $2, role = $3 WHERE email = $4";
      const result = await db.query(sql, [username, email, role, email]);
      if (result.rowCount === 0) {
        throw new UserNotFoundError();
      }
      return new User(username, email, role);
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default UserDAO;
