import Area from "../models/area";
import AreaDAO from "../dao/areaDAO";

class AreaController {
  private dao: AreaDAO;

  constructor() {
    this.dao = new AreaDAO();
  }

  /**
   * Retrieves all Areas from the database.
   * @returns A Promise that resolves to an array of Area objects.
   */
  async getAreas(): Promise<Area[]> {
    return this.dao.getAllAreas();
  }
}

export default AreaController;
