import * as db from "../db/db";

class DocumentDAO {
  /**
   * Creates a new document.
   * @param title - The title of the new document. It must not be null.
   * @param description - The description of the new document. It must not be null.
   * @param type_id - The type of the new document. It must not be null.
   * @param issue_date - The issue date of the new document. It must not be null.
   * @param scale - The scale of the new document. It must not be null.
   * @param location - The location of the document.
   * @param language - The language of the document.
   * @param pages - .
   * @returns A Promise that resolves to true if the document has been created.
   */
  async createDocument(
    title: string,
    description: string,
    type_id: number,
    issue_date: string,
    scale: string,
    location: { lat: number; long: number }[],
    language: string,
    pages: string
  ): Promise<boolean> {
    try {
      if (location.length > 1) {
        //TODO Case of Polygon
      } else {
        //Case of Point
        console.log(location[0].lat, location[0].long);
        const sql = `INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9)`;
        await db.query(sql, [
          title,
          description,
          type_id,
          issue_date,
          scale,
          location[0].lat,
          location[0].long,
          language,
          pages,
        ]);
      }
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default DocumentDAO;
