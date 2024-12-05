const DOCUMENT_NOT_FOUND = "The document does not exist";
const LOCATION_NOT_VALID = "The document location can't exceed the municipality area's boundaries";

/**
 * Represents an error that occurs when a document is not found.
 */
class DocumentNotFoundError extends Error {
  customMessage: string;
  customCode: number;

  constructor() {
    super();
    this.customMessage = DOCUMENT_NOT_FOUND;
    this.customCode = 404;
  }
}

/**
 * Represents an error that occurs when a document location is not valid.
 */
class InvalidDocumentLocationError extends Error {
  customMessage: string;
  customCode: number;

  constructor() {
    super();
    this.customMessage = LOCATION_NOT_VALID;
    this.customCode = 404;
  }
}

export { DocumentNotFoundError, InvalidDocumentLocationError };
