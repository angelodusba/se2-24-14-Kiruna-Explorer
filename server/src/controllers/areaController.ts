import Area from "../models/area";
import AreaDAO from "../dao/areaDAO";


class AreaController{
  private dao: AreaDAO;

  constructor(){
      this.dao= new AreaDAO;
  }

  /**
   * Retrieves all Areas from the database.
   * @returns A Promise that resolves to an array of Area objects.
   */
  async getAreas():Promise<Area[]>{
      return this.dao.getAreas();
  }
  
  /**
   * Creates a new area in the database.
   * @param name - The name of the area, must not be empty.
   * @param location - An array of objects representing the coordinates of the area,
   *                   must represent a polygon with at least two points.
   * @returns A Promise that resolves to true if the area has been successfully created.
   * @throws InvalidAreaError if the location is empty or does not represent a valid polygon.
   * @throws AreaAlreadyExistsError if an area with the same name already exists.
   */
  async createArea(
    name: string,
    location: { lat: number; lng: number }[],
  ): Promise<boolean> {
    // Convert object array into a comma separated string of coordinates
    const locationStr = location.map((coord) => `${coord.lng} ${coord.lat}`).join(", ");
    return this.dao.createArea(name, locationStr);
  }
}

export default AreaController;