const CONNECTION_ALREADY_EXISTS = "A connection with this user already exists";
/**
 * Represents an error that occurs when a connection already exists
 * between two documents.
 */

class ConnectionAlreadyExistsError extends Error {
  customMessage: string;
  customCode: number;

  constructor(document_id_1: number, document_id_2: number) {
    super();
    this.customMessage = CONNECTION_ALREADY_EXISTS
    this.customCode = 409;
  }
}

export { ConnectionAlreadyExistsError };