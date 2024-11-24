import * as db from "../db/db";
import Type from "../models/type";
import { TypeAlreadyExistsError } from "../errors/typeErrors";

class TypeDAO {
  /**
   * Retrieves all documents types from the database.
   * @returns A Promise that resolves to an array of Type objects.
   */
  async getTypes(): Promise<Type[]> {
    try {
      const sql = "SELECT * FROM types";
      const result = await db.query(sql, []);
      const types: Type[] = result.rows.map((row) => {
        return new Type(row.id, row.name);
      });
      return types;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Creates a new document type.
   * @param name The name of the document type, must not be null.
   * @returns A Promise that resolves to true if the document type has been successfully created.
   * @throws TypeAlreadyExistsError If the document type already exists.
   */
  async createType(
    name: string
  ): Promise<boolean> {
    try {
      const sql = "INSERT INTO types (name) VALUES ($1)";
      await db.query(sql, [name]);
      return true;
    } catch (err: any) {
      if (err.message.includes("duplicate key value violates unique constraint")) {
        throw new TypeAlreadyExistsError();
      }
      throw new Error(err);
    }
  }
}

export default TypeDAO;
