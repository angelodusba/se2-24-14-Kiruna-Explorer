import * as db from "../db/db";
import Area from "../models/area";
import Coordinates from "../models/coordinates";
import { AreaAlreadyExistsError, InvalidAreaError } from "../errors/areaErrors";

class AreaDAO{
  /**
   * Fetches all the saved areas
   * @returns A Promise that resolves to an array of Area object.
   */
  async getAreas():Promise<Area[]>{
    try {
      const sql= `SELECT id, name, 
                  substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11)) AS location
                  FROM areas`;
      const result = await db.query(sql,[]);
      const areas : Area[] = result.rows.map((row)=>{
        return new Area(
          row.id,
          row.name,
          row.location.split(",").map((coords: string) => {
            const [lng, lat] = coords.split(" ").map(Number);
            return new Coordinates(lng, lat);
          }));
      });
      return areas;
    } catch(err: any){
      throw new Error(err); 
    }
  }

  /**
   * Creates a new area in the database.
   * @param name - The name of the area, must not be empty.
   * @param location - The location of the area as a comma-separated string of coordinates.
   *                   Must represent a polygon with at least two points.
   * @returns A Promise that resolves to true if the area has been successfully created.
   * @throws InvalidAreaError if the location is empty or does not represent a valid polygon.
   * @throws AreaAlreadyExistsError if an area with the same name already exists.
   */
  async createArea(
    name: string,
    location: string
  ): Promise<boolean> {
    try {
      if (!location || location === "" || location.split(",").length < 2) {
        throw new InvalidAreaError();
      }
      const sql = `INSERT INTO areas (name, location)
                   VALUES ($1, ST_SetSRID(ST_GeometryFromText('POLYGON((${location}))'), 4326))`;
      await db.query(sql, [name]);
      return true;
    } catch (err: any) {
      if (err.message.includes("duplicate key value violates unique constraint")) {
        throw new AreaAlreadyExistsError();
      }
      throw err;
    }
  }
}

export default AreaDAO;
