import * as db from "../db/db";
import StakeHolder from "../models/stakeHolder";

class StakeHolderDAO {
  /**
   * Retrieves all stakeholders from the database.
   * @returns A Promise that resolves to an array of StakeHolder objects.
   */
  async getStakeHolders(): Promise<StakeHolder[]> {
    try {
      const sql = "SELECT * FROM stakeholders";
      const result = await db.query(sql, []);
      const stakeholders: StakeHolder[] = result.rows.map((row) => {
        return new StakeHolder(row.id, row.name);
      });
      return stakeholders;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default StakeHolderDAO;