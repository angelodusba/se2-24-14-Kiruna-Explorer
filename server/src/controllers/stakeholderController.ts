import Stakeholder from "../models/stakeholder";
import StakeholderDAO from "../dao/stakeholderDAO";

/**
 * Represents a controller for managing stakeholders.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class StakeholderController {
  private dao: StakeholderDAO;

  constructor() {
    this.dao = new StakeholderDAO();
  }

  /**
   * Retrieves all stakeholders from the database.
   * @returns A Promise that resolves to an array of Stakeholder objects.
   */
  async getStakeholders(): Promise<Stakeholder[]> {
    return this.dao.getStakeholders();
  }
}

export default StakeholderController;
