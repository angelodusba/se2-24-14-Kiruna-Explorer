import Area from "../models/area";
import AreaDAO from "../dao/areaDAO";
import Coordinates from "../models/coordinates";
import { InvalidDocumentLocationError } from "../errors/documentErrors";
import DocumentDAO from "../dao/documentDAO";

class AreaController {
  private dao: AreaDAO;
  private documentDAO: DocumentDAO;

  constructor() {
    this.dao = new AreaDAO();
    this.documentDAO = new DocumentDAO();
  }

  /**
   * Retrieves all Areas from the database.
   * @returns A Promise that resolves to an array of Area objects.
   */
  async getAreas(): Promise<Area[]> {
    return this.dao.getAreas();
  }

  /**
   * Create a new named area.
   * @param name Area name.
   * @param location Area location (boundaries).
   * @returns A Promise that resolves to the created area.
   */
  async createArea(name: string, location: Coordinates[]): Promise<Area> {
    // Check if all the location points are inside the municipality area
    const validLocation = await this.documentDAO.validateDocumentLocation(location);
    if (!validLocation) {
      throw new InvalidDocumentLocationError();
    }
    // Convert object array into a comma separated string of coordinates
    const locationStr = location.map((coord) => `${coord.lng} ${coord.lat}`).join(", ");
    return this.dao.createArea(name, locationStr);
  }
}

export default AreaController;
