import StakeHolder from "../models/stakeHolder";
import StakeHolderDAO from "../dao/stakeHolderDAO";
import { UnauthorizedUserError } from "../errors/userErrors";

/**
 * Represents a controller for managing stakeholders.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class StakeHolderController {
  private dao: StakeHolderDAO;

  constructor() {
    this.dao = new StakeHolderDAO();
  }

  /**
   * Retrieves all stakeholders from the database.
   * @returns A Promise that resolves to an array of StakeHolder objects.
   */
  async getStakeHolders(): Promise<StakeHolder[]> {
    return this.dao.getStakeHolders();
  }
}

export default StakeHolderController;