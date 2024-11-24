const TYPE_ALREADY_EXISTS = "A type with this name already exists";

/**
 * Represents an error that occurs when a type is already in use.
 */
class TypeAlreadyExistsError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = TYPE_ALREADY_EXISTS;
    this.customCode = 409;
  }
}

export { TypeAlreadyExistsError };