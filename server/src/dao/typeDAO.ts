import * as db from "../db/db";
import Type from "../models/type";

class TypeDAO {
  /**
   * Retrieves all types from the database.
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
}

export default TypeDAO;