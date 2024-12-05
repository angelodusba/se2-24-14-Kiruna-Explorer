import * as db from "../db/db";
import Stakeholder from "../models/stakeholder";
import { StakeholderAlreadyExistsError } from "../errors/stakeholderErrors";

class StakeholderDAO {
  /**
   * Retrieves all stakeholders from the database.
   * @returns A Promise that resolves to an array of Stakeholder objects.
   */
  async getStakeholders(): Promise<Stakeholder[]> {
    try {
      const sql = "SELECT * FROM stakeholders";
      const result = await db.query(sql);
      const stakeholders: Stakeholder[] = result.rows.map((row) => {
        return new Stakeholder(row.id, row.name);
      });
      return stakeholders;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Creates a new stakeholder.
   * @param name The name of the stakeholder, must not be null.
   * @returns A Promise that resolves to true if the stakeholder has been successfully created.
   * @throws StakeholderAlreadyExistsError If the stakeholder already exists.
   */
  async createStakeholder(
    name: string
  ): Promise<boolean> {
    try {
      const sql = "INSERT INTO stakeholders (name) VALUES ($1)";
      await db.query(sql, [name]);
      return true;
    } catch (err: any) {
      if (err.message.includes("duplicate key value violates unique constraint")) {
        throw new StakeholderAlreadyExistsError();
      }
      throw new Error(err);
    }
  }
}

export default StakeholderDAO;
