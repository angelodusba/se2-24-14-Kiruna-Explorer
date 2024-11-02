import * as db from "../db/db";
import StakeHolder from "../models/stakeHolder";

class StakeHolderDAO {
  async getStakeHolders(): Promise<StakeHolder[]> {
    try {
      const sql = "SELECT * FROM stakeholders";
      const result = await db.query(sql, []);
      const users: StakeHolder[] = result.rows.map((row) => {
        return new StakeHolder(row.id, row.name);
      });
      return users;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default StakeHolderDAO;