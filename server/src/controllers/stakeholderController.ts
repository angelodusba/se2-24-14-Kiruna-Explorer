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

  /**
   * Creates a new stakeholder in the database.
   * @param name - The name of the stakeholder.
   * @returns A Promise that resolves to true if the stakeholder has been successfully created.
   */
  async createStakeholder(
    name: string
  ): Promise<boolean> {
    return this.dao.createStakeholder(name);
  }
}

export default StakeholderController;
