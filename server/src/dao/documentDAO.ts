import * as db from "../db/db";
import { DocumentNotFoundError } from "../errors/documentErrors";
import Coordinates from "../models/coordinates";
import Document from "../models/document";
import Type from "../models/type";
import DocumentLocationResponse from "../response/documentLocationResponse";

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
  ): Promise<{ id: number }> {
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
      // Check for errors
      if (!res.rows || res.rows.length === 0)
        throw new Error(
          "Unable to create the document right now, try again later"
        );
      const document_id = res.rows[0].id;
      // Insert stakeholders connection to document
      for (const stakeholderId of stakeholderIds) {
        sql = `INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES ($1, $2)`;
        await client.query(sql, [document_id, stakeholderId]);
      }
      await client.query("COMMIT");
      return { id: document_id };
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
  async getDocumentById(id: number): Promise<Document> {
    try {
      const sql = `SELECT D.id, D.title, D.description, D.type_id, T.name AS type_name,
                    D.issue_date, D.scale, D.language, D.pages,
                  CASE 
                    WHEN location IS NULL THEN NULL
                    WHEN ST_GeometryType(location) = 'ST_Point' THEN 
                      substring(ST_AsText(location) FROM 7 FOR (length(ST_AsText(location)) - 7))
                    WHEN ST_GeometryType(location) = 'ST_Polygon' THEN 
                      substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11))
                  END AS location
                  FROM documents D, types T
                  WHERE D.type_id=T.id AND D.id = $1`;
      const res = await db.query(sql, [id]);
      if (!res || res.rows.length === 0) {
        throw new DocumentNotFoundError();
      }
      const doc = res.rows[0];
      return new Document(
        doc.id,
        doc.title,
        doc.description,
        new Type(doc.type_id, doc.type_name),
        doc.issue_date,
        doc.scale,
        doc.location
          ? doc.location.split(",").map((coords: string) => {
              const [lng, lat] = coords.split(" ").map(Number);
              return new Coordinates(lng, lat);
            })
          : [],
        doc.language,
        doc.pages
      );
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Retrieves the locations of documents from the database.
   * @returns A promise that resolves to an array of DocumentLocationResponse objects, each containing
   *          a document's ID, type, and location coordinates (if available).
   * @throws Throws an error if the query execution fails.
   */
  async getDocumentsLocation(): Promise<DocumentLocationResponse[]> {
    try {
      const sql = `SELECT D.id, D.type_id, T.name AS type_name,
                    CASE 
                      WHEN location IS NULL THEN NULL
                      WHEN ST_GeometryType(location) = 'ST_Point' THEN 
                        substring(ST_AsText(location) FROM 7 FOR (length(ST_AsText(location)) - 7))
                      WHEN ST_GeometryType(location) = 'ST_Polygon' THEN 
                        substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11))
                    END AS location
                  FROM documents D, types T WHERE D.type_id=T.id`;
      const res = await db.query(sql);
      if (!res || res.rows.length === 0) {
        return [];
      }
      const response = res.rows.map((doc) => {
        return new DocumentLocationResponse(
          doc.id,
          new Type(doc.type_id, doc.type_name),
          doc.location
            ? doc.location.split(",").map((coords: string) => {
                const [lng, lat] = coords.split(" ").map(Number);
                return new Coordinates(lng, lat);
              })
            : []
        );
      });
      return response;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default DocumentDAO;
