import * as db from "../db/db";
import { DocumentNotFoundError } from "../errors/documentErrors";
import Attachment from "../models/attachment";
import Coordinates from "../models/coordinates";
import Document from "../models/document";
import Type from "../models/type";
import DocumentCardResponse from "../response/documentCardResponse";
import DocumentLocationResponse from "../response/documentLocationResponse";
import FilteredDocumentsResponse from "../response/filteredDocumentsResponse";

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
        throw new Error("Unable to create the document right now, try again later");
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
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Fetches all the saved documents.
   * @returns A Promise that resolves to an array of Document objects.
   */
  async getAllDocuments(): Promise<Document[]> {
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
                  WHERE D.type_id=T.id
      `;
      const res = await db.query(sql);
      const response = res.rows.map((doc) => {
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
      });
      return response;
    } catch (err: any) {
      throw err;
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
      throw err;
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
   * @returns A promise that resolves to an array of DocumentLocationResponse objects.
   * @throws Throws an error if the query execution fails.
   */
  async getDocumentsLocation(): Promise<DocumentLocationResponse[]> {
    try {
      const sql = `SELECT D.id, D.title, D.type_id, T.name AS type_name,
                    CASE 
                      WHEN location IS NULL THEN NULL
                      WHEN ST_GeometryType(location) = 'ST_Point' THEN 
                        substring(ST_AsText(location) FROM 7 FOR (length(ST_AsText(location)) - 7))
                      WHEN ST_GeometryType(location) = 'ST_Polygon' THEN 
                        substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11))
                    END AS location
                  FROM documents D, types T WHERE D.type_id=T.id
                  ORDER BY D.id`;
      const res = await db.query(sql);
      const response = res.rows.map((doc) => {
        return new DocumentLocationResponse(
          doc.id,
          new Type(doc.type_id, doc.type_name),
          doc.title,
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
      throw err;
    }
  }

  /**
   * Retrieve all the documents that belong to the municipality area.
   * @returns A Promise that resolves to an array of Document objects.
   * @throws Throws an error if the query execution fails.
   */
  async getMunicipalityDocuments(): Promise<Document[]> {
    try {
      const sql = `SELECT D.id, D.title, D.description, D.type_id, T.name AS type_name,
                    D.issue_date, D.scale, D.language, D.pages
                  FROM documents D, types T
                  WHERE D.type_id=T.id AND D.location IS NULL`;
      const res = await db.query(sql);
      return res.rows.map(
        (doc: any) =>
          new Document(
            doc.id,
            doc.title,
            doc.description,
            new Type(doc.type_id, doc.type_name),
            doc.issue_date,
            doc.scale,
            [],
            doc.language,
            doc.pages
          )
      );
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Updates the location of a document in the database.
   * @param documentId - The unique identifier of the document to update.
   * @param location - The new location of the document. It can be a string representing
   *                   a single point ("long lat") or a polygon ("long lat, long lat, ...").
   *                   If empty, the location is set to NULL, indicating the entire municipality area.
   * @returns A promise that resolves to true if the document's location has been successfully updated.
   * @throws DocumentNotFoundError if the document does not exist.
   * @throws Throws an error if the query execution fails.
   */
  async updateDocumentLocation(documentId: number, location: string): Promise<boolean> {
    try {
      let sql = "";
      if (!location || location === "") {
        // Case of entire municipality area
        sql = `UPDATE documents SET location = NULL WHERE id = $1`;
      } else if (location.split(",").length > 1) {
        // Case of Polygon
        sql = `UPDATE documents SET location = ST_SetSRID(ST_GeometryFromText('POLYGON((${location}))'), 4326) WHERE id = $1`;
      } else {
        // Case of single Point
        sql = `UPDATE documents SET location = ST_SetSRID(ST_GeometryFromText('POINT(${location})'), 4326) WHERE id = $1`;
      }
      const res = await db.query(sql, [documentId]);
      if (res.rowCount === 0) {
        throw new DocumentNotFoundError();
      }
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async getDocumentCard(documentId: number): Promise<DocumentCardResponse> {
    try {
      // Fetch document info
      let sql = `SELECT D.id, D.title, D.description, T.id AS type_id, T.name AS type_name,
                    D.issue_date, D.scale, D.language, D.pages,
                    CASE 
                      WHEN location IS NULL THEN NULL
                      WHEN ST_GeometryType(location) = 'ST_Point' THEN 
                        substring(ST_AsText(location) FROM 7 FOR (length(ST_AsText(location)) - 7))
                      WHEN ST_GeometryType(location) = 'ST_Polygon' THEN 
                        substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 10))
                    END AS location
                  FROM documents D, types T
				          WHERE D.type_id=T.id AND D.id=$1;
      `;
      let res = await db.query(sql, [documentId]);
      if (!res || res.rows.length === 0) {
        throw new DocumentNotFoundError();
      }
      const doc = res.rows[0];

      // Fetch stakeholders
      sql = `SELECT ARRAY_AGG(S.name) AS stakeholders
              FROM documents D, documents_stakeholders DS, stakeholders S
              WHERE D.id=DS.document_id AND S.id=DS.stakeholder_id AND D.id=$1
              GROUP BY D.id
      `;
      res = await db.query(sql, [documentId]);
      const stakeholders: string[] = res.rows.length === 1 ? res.rows[0].stakeholders : [];

      // Fetch connections number
      sql = `SELECT COUNT(*) AS conn_num
              FROM connections
              WHERE document_id_1 = $1 OR document_id_2 = $1
      `;
      res = await db.query(sql, [documentId]);
      const conn_num = res.rows.length === 1 ? res.rows[0].conn_num : 0;

      // Fetch attachments
      sql = `SELECT * from attachments WHERE document_id = $1`;
      res = await db.query(sql, [documentId]);
      const attachments = res.rows.map(
        (row) => new Attachment(row.id, row.document_id, row.type, row.original, row.path)
      );

      return new DocumentCardResponse(
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
        doc.pages,
        Number(conn_num),
        stakeholders,
        attachments
      );
    } catch (err: any) {
      throw err;
    }
  }

  async getFilteredDocuments(
    page?: number,
    size?: number,
    sort: string = "title:asc",
    title?: string,
    description?: string,
    start_year?: string,
    end_year?: string,
    scales?: string[],
    types?: number[],
    languages?: string[],
    stakeholders?: number[],
    municipality?: boolean
  ): Promise<FilteredDocumentsResponse> {
    try {
      let params: any[] = [];
      let sql = `SELECT D.id, D.title, D.description, D.type_id, T.name AS type_name,
                      D.issue_date, D.scale, D.language, D.pages, ARRAY_AGG(S.name) AS stakeholders,
                    CASE 
                      WHEN location IS NULL THEN NULL
                      WHEN ST_GeometryType(location) = 'ST_Point' THEN 
                        substring(ST_AsText(location) FROM 7 FOR (length(ST_AsText(location)) - 7))
                      WHEN ST_GeometryType(location) = 'ST_Polygon' THEN 
                        substring(ST_AsText(location) FROM 10 FOR (length(ST_AsText(location)) - 11))
                    END AS location,
                    COUNT(*) OVER () AS total_rows -- Count of all matching rows (ignores LIMIT and OFFSET)
                  FROM documents D INNER JOIN types T ON D.type_id=T.id
                    LEFT JOIN documents_stakeholders DS ON D.id=DS.document_id
                    LEFT JOIN stakeholders S ON S.id=DS.stakeholder_id
                  WHERE 1=1
      `;
      // Add filters to the WHERE clause if parameters are provided
      if (title) {
        params.push(title);
        sql += ` AND D.title ILIKE '%' || $${params.length} || '%'`; // Case-insensitive partial match
      }
      if (description) {
        params.push(description);
        sql += ` AND D.description ILIKE '%' || $${params.length} || '%'`; // Case-insensitive partial match
      }
      // Extract the first 4 characters of the issue_date for year-based comparison
      if (start_year) {
        params.push(Number(start_year));
        sql += ` AND substring(D.issue_date FROM 1 FOR 4) >= $${params.length}`; // Extract year and filter
      }
      if (end_year) {
        params.push(end_year);
        sql += ` AND substring(D.issue_date FROM 1 FOR 4) <= $${params.length}`; // Extract year and filter
      }
      if (scales && scales.length > 0) {
        params.push(scales);
        sql += ` AND D.scale = ANY($${params.length})`; // Filter documents by scale, using array
      }
      if (types && types.length > 0) {
        params.push(types);
        sql += ` AND D.type_id = ANY($${params.length})`; // Filter documents by type, using array
      }
      if (languages && languages.length > 0) {
        params.push(languages);
        sql += ` AND D.language = ANY($${params.length})`; // Filter documents by language, using array
      }
      if (stakeholders && stakeholders.length > 0) {
        params.push(stakeholders);
        sql += ` AND S.id = ANY($${params.length})`;
      }
      if (municipality) {
        sql += ` AND D.location IS NULL`;
      }
      // Add group by clause
      sql += ` GROUP BY D.id, D.title, D.description, D.type_id, T.name, D.issue_date, 
                D.scale, D.language, D.pages`;

      // Sorting logic
      const [sortField, sortOrder] = sort.split(":");
      sql += ` ORDER BY D.${sortField} ${sortOrder.toUpperCase()}`;

      // Pagination logic (LIMIT and OFFSET)
      if (page !== undefined && size !== undefined) {
        const offset = (page - 1) * size; // Calculate offset based on page number
        params.push(size);
        sql += ` LIMIT $${params.length} OFFSET ${offset}`;
      }
      // Retrieve results
      const res = await db.query(sql, params);
      const totalRows: number = res.rows.length > 0 ? res.rows[0].total_rows : 0;
      const totalPages: number = size ? Math.ceil(totalRows / size) : 1;
      const docs: Document[] = res.rows.map(
        (doc) =>
          new Document(
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
          )
      );
      return new FilteredDocumentsResponse(docs, totalRows, totalPages);
    } catch (err: any) {
      throw err;
    }
  }
}

export default DocumentDAO;
