const CONNECTION_ALREADY_EXISTS = "A connection like this already exists";
/**
 * Represents an error that occurs when a connection already exists
 * between two documents.
 */

class ConnectionAlreadyExistsError extends Error {
  customMessage: string;
  customCode: number;

  constructor(document_id_1: number, document_id_2: number, connection_type: string) {
    super();
    this.customMessage = CONNECTION_ALREADY_EXISTS + `: ${document_id_1}, ${document_id_2}, ${connection_type}`;
    this.customCode = 409;
  }
}

const INVALID_CONNECTION_TYPE = "Invalid connection type";
/**
 * Represents an error that occurs when the connection type is invalid.
 */
class InvalidConnectionTypeError extends Error {
  customMessage: string;
  customCode: number;

  constructor() {
    super();
    this.customMessage = INVALID_CONNECTION_TYPE;
    this.customCode = 400;
  }
}

export { ConnectionAlreadyExistsError ,InvalidConnectionTypeError};
