import * as db from "../db/db";

class DocumentDAO {
  /**
   * Creates a new document.
   * @param title - The title of the new document. It must not be null.
   * @param description - The description of the new document. It must not be null.
   * @param type_id - The type of the new document. It must not be null.
   * @param issue_date - The issue date of the new document. It must not be null.
   * @param scale - The scale of the new document. It must not be null.
   * @param location - The location of the document as "long lat, long lat, ... ".
   * @param language - The language of the document.
   * @param pages - Number of pages of the document.
   * @param stakeholderIds - The stakeholders of the document.
   * @returns A Promise that resolves to true if the document has been created.
   */
  async createDocument(
    title: string,
    description: string,
    type_id: number,
    issue_date: string,
    scale: string,
    location: string,
    language: string,
    pages: string,
    stakeholderIds: number[]
  ): Promise<boolean> {
    const client = await db.pool.connect();
    try {
      let sql = "";
      await client.query("BEGIN");
      if (!location || location === "") {
        // Case of entire municipality area
        sql = `INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) 
                VALUES ($1, $2, $3, $4, $5, NULL, $6, $7) 
                RETURNING id`;
      } else if (location.split(",").length > 1) {
        // Case of Polygon
        sql = `INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) 
       VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_GeometryFromText('POLYGON((${location}))'), 4326), $6, $7)
       RETURNING id`;
      } else {
        // Case of single Point
        sql = `INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) 
         VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_GeometryFromText('POINT(${location})'), 4326), $6, $7)
         RETURNING id`;
      }
      const res = await client.query(sql, [
        title,
        description,
        type_id,
        issue_date,
        scale,
        language,
        pages,
      ]);
      const document_id = res.rows[0].id;
      // Insert stakeholders connection to document
      for (const stakeholderId of stakeholderIds) {
        sql = `INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES ($1, $2)`;
        await client.query(sql, [document_id, stakeholderId]);
      }
      await client.query("COMMIT");
      return true;
    } catch (err: any) {
      await client.query("ROLLBACK");
      throw new Error(err);
    } finally {
      client.release();
    }
  }

  /**
   * Get all documents ids and titles.
   * @returns A Promise that resolves to an array of documents.
   * @throws An error if the documents cannot be retrieved.
   */

  async getDocumentsNames(): Promise<any> {
    try {
      const sql = `SELECT id, title FROM documents`;
      const res = await db.query(sql);
      return res.rows;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Get a document by its id.
   * @param id - The id of the document.
   * @returns A Promise that resolves to the document.
   * @throws An error if the document does not exist.
   */
  async getDocumentById(id: number): Promise<any> {
    try {
      const sql = `SELECT * FROM documents WHERE id = $1`;
      const res = await db.query(sql, [id]);
      return res.rows[0];
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default DocumentDAO;
