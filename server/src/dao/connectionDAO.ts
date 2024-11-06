import * as db from "../db/db";
import Connection, { ConnectionType } from "../models/connection";
import { ConnectionAlreadyExistsError } from "../errors/connectionErrors";
import ConnectionByDocumentIdResponse from "../response/connectionsByDocumentIdResponse";

class ConnectionDAO {
  /**
   * Creates a new connection.
   * @param document_id_1 - The id of the first document. It must not be null.
   * @param document_id_2 - The id of the second document. It must not be null.
   * @param direct_conn - boolean that indicates if the connection is direct or not.
   * @param collateral_conn - boolean that indicates if the connection is collateral or not.
   * @param prevision_conn - boolean that indicates if the connection is prevision or not.
   * @param update_conn - boolean that indicates if the connection is update or not.
   */
  async createConnection(
    document_id_1: number,
    document_id_2: number,
    connection_types: string[]
  ): Promise<boolean> {
    try {
      // Map each connection type to an object with the connection type as the key
      const selectedConnections = Object.values(ConnectionType).reduce((acc, type) => {
        acc[type] = connection_types.includes(type); // Check if type exists in the connection_type array
        return acc;
      }, {} as Record<string, boolean>);

      // Sort document_id_1 and document_id_2 ASC
      if (document_id_1 > document_id_2) {
        const temp = document_id_1;
        document_id_1 = document_id_2;
        document_id_2 = temp;
      }
      const sql = `INSERT INTO connections (document_id_1, document_id_2, direct_conn, collateral_conn, prevision_conn, update_conn) VALUES ($1, $2, $3, $4, $5, $6)`;
      await db.query(sql, [
        document_id_1,
        document_id_2,
        selectedConnections.direct_conn,
        selectedConnections.collateral_conn,
        selectedConnections.prevision_conn,
        selectedConnections.update_conn,
      ]);
      return true;
    } catch (err: any) {
      if (err.message.includes("duplicate key value violates unique constraint")) {
        throw new ConnectionAlreadyExistsError();
      } else {
        throw err;
      }
    }
  }

  /**
   * Get all connections from the database.
   * @returns A Promise that resolves to an array of connections.
   * Connections are formatted as strings.
   */
  async getConnections(): Promise<Connection[]> {
    try {
      const sql = `SELECT * FROM connections`;
      const result = await db.query(sql);
      return result.rows.map((row: any) => {
        // Filter connection types based on row data
        const connectionTypes: string[] = Object.values(ConnectionType).filter((type) => {
          // Check if the corresponding column in the row has a truthy value
          return !!row[type];
        });
        return new Connection(row.document_id_1, row.document_id_2, connectionTypes);
      });
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get all connections of the specified document.
   * @param document_id - The id of the document to filter the connections.
   * @returns A Promise that resolves to an array of connections.
   * Connections are formatted as strings.
   */
  async getConnectionsByDocumentId(document_id: number): Promise<ConnectionByDocumentIdResponse[]> {
    try {
      const sql = `SELECT direct_conn, collateral_conn, prevision_conn, update_conn,
                    CASE 
                      WHEN document_id_1 = $1 THEN document_id_2
                      WHEN document_id_2 = $1 THEN document_id_1
                    END AS document_id
                  FROM connections
                  WHERE document_id_1 = $1 OR document_id_2 = $1;`;
      const result = await db.query(sql, [document_id]);
      return result.rows.map((row: any) => {
        // Filter connection types based on row data
        const connectionTypes: string[] = Object.values(ConnectionType).filter((type) => {
          // Check if the corresponding column in the row has a truthy value
          return !!row[type];
        });
        return new ConnectionByDocumentIdResponse(row.document_id, connectionTypes);
      });
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * From the header of connection table,
   * get the connection names for a document.
   * @param no params
   */
  async getConnectionNames(): Promise<string[]> {
    try {
      const sql = `SELECT column_name FROM information_schema.columns WHERE table_name = 'connections' AND column_name NOT IN ('document_id_1', 'document_id_2')`;
      const result = await db.query(sql, []);
      return result.rows.map((row: { column_name: string }) => row.column_name);
    } catch (err: any) {
      throw err;
    }
  }
}

export default ConnectionDAO;
