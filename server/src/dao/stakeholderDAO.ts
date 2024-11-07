import * as db from "../db/db";
import Stakeholder from "../models/stakeholder";

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
}

export default StakeholderDAO;
