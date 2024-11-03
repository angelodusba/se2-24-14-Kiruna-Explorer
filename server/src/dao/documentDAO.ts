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
   * @param stakeholders - The stakeholders of the document.
   * @returns A Promise that resolves to true if the document has been created.
   */
  async createDocument(
    title: string,
    description: string,
    type_id: number,
    issue_date: string,
    scale: string,
    location: string[],
    language: string,
    pages: string,
    stakeholders: number[]
  ): Promise<boolean> {
    try {
      var document_id: number = 0;
      await db.query("BEGIN", []);
      if (location.length > 1) {
        //TODO Case of Polygon
      } else {
        //Case of Point
        const sql = `INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_GeometryFromText('POINT(${location[0]})'), 4326), $6, $7) RETURNING id`;
        const res = await db.query(sql, [
          title,
          description,
          type_id,
          issue_date,
          scale,
          language,
          pages,
        ]);
        document_id = res.rows[0].id;
      }
      for (var stakeholder of stakeholders) {
        const sql = `INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES ($1, $2)`;
        await db.query(sql, [document_id, stakeholder]);
      }
      await db.query("COMMIT", []);
      return true;
    } catch (err: any) {
      await db.query("ROLLBACK", []);
      throw new Error(err);
    }
  }
}

export default DocumentDAO;
