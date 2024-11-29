import * as db from "../db/db";
import Area from "../models/area";
import Coordinates from "../models/coordinates";
import { AreaAlreadyExistsError } from "../errors/areaErrors";

class AreaDAO {
  /**
   * Fetches all the saved areas
   * @returns A Promise that resolves to an array of Area object.
   */
  async getAreas(): Promise<Area[]> {
    try {
      const sql = `SELECT id, name, 
                  substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11)) AS location
                  FROM areas`;
      const result = await db.query(sql, []);
      const areas: Area[] = result.rows.map((row) => {
        return new Area(
          row.id,
          row.name,
          row.location.split(",").map((coords: string) => {
            const [lng, lat] = coords.split(" ").map(Number);
            return new Coordinates(lng, lat);
          })
        );
      });
      return areas;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Create a new named area.
   * @param name Area name.
   * @param location Area location (boundaries).
   * @returns A Promise that resolves to the created area.
   */
  async createArea(name: string, location: string): Promise<Area> {
    try {
      const sql = `INSERT INTO areas (name, location) VALUES ($1, 
                    ST_SetSRID(ST_GeometryFromText('POLYGON((${location}))'), 4326))
                    RETURNING id
      `;
      const result = await db.query(sql, [name]);
      if (result.rows.length === 0) {
        throw new Error("An error occurred while creating the area");
      }
      return new Area(
        result.rows[0].id,
        name,
        location.split(",").map((coords: string) => {
          const [lng, lat] = coords.trim().split(" ").map(Number);
          return new Coordinates(lng, lat);
        })
      );
    } catch (err: any) {
      if (err.message.includes('duplicate key value violates unique constraint "areas_name_key"'))
        throw new AreaAlreadyExistsError();
      throw new Error(err);
    }
  }
}

export default AreaDAO;
