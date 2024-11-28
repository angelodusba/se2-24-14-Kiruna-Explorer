const AREA_ALREADY_EXISTS = "An area with this name already exists";
const INVALID_AREA = "Invalid inserted area";

/**
 * Represents an error that occurs when an area is already in use.
 */
class AreaAlreadyExistsError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = AREA_ALREADY_EXISTS;
    this.customCode = 409;
  }
}

/**
 * Represents an error that occurs when an inserted area is empty or has only one point.
 */
class InvalidAreaError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = INVALID_AREA;
    this.customCode = 409;
  }
}

export { AreaAlreadyExistsError, InvalidAreaError };
