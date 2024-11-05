const CONNECTION_ALREADY_EXISTS = "A connection with this user already exists";
/**
 * Represents an error that occurs when a connection already exists
 * between two documents.
 */

class ConnectionAlreadyExistsError extends Error {
  customMessage: string;
  customCode: number;

  constructor() {
    super();
    this.customMessage = CONNECTION_ALREADY_EXISTS;
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
