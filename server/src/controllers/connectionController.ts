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
   * @param connections[i].connected_document_id - Number, The id of the document that the connection goes to.
   * @param connections[i].connection_types - Array of strings, The types of the connection.
   */
  async createConnections(
    starting_document_id: number,
    connections: { connected_document_id: number; connection_types: string[] }[]
  ): Promise<boolean> {
    try {
      for (let i = 0; i < connections.length; i++) {
        await this.dao.createConnection(
          starting_document_id,
          connections[i].connected_document_id,
          connections[i].connection_types
        );
      }
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get all the connections
   * @returns A list of all the connections.
   */
  async getConnections(): Promise<Connection[]> {
    return this.dao.getConnections();
  }

  /**
   * Get the connection names for a document.
   */
  async getConnectionNames(): Promise<string[]> {
    return this.dao.getConnectionNames();
  }
}

export default ConnectionController;
