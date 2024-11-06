import ConnectionDAO from "../dao/connectionDAO";
import Connection from "../models/connection";

/**
 * Represents a controller for managing connections.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */

class ConnectionController {
  private dao: ConnectionDAO;

  constructor() {
    this.dao = new ConnectionDAO();
  }

  /**
   * Creates a number of new connections.
   * @param starting_document_id - The id of the document that the connections start from.
   * @param connections - The list of connections to create.
   */
  async createConnections(
    starting_document_id: number,
    connections: { connected_document_id: number; connection_types: string[] }[]
  ): Promise<boolean> {
    try {
      // Process all connections concurrently
      await Promise.all(
        connections.map(async (connection) => {
          await this.dao.createConnection(
            starting_document_id,
            connection.connected_document_id,
            connection.connection_types
          );
        })
      );
      return true; // Return true if all connections are successfully created
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get all the connections
   * @returns A list of all the connections.
   */
  async getConnections(document_id: number | undefined): Promise<Connection[]> {
    return document_id
      ? this.dao.getConnectionsByDocumentId(document_id)
      : this.dao.getConnections();
  }

  /**
   * Get the connection names for a document.
   */
  async getConnectionNames(): Promise<string[]> {
    return this.dao.getConnectionNames();
  }
}

export default ConnectionController;
