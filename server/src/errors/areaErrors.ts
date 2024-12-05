const AREA_ALREADY_EXISTS = "An area with this name already exists";

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

export { AreaAlreadyExistsError };
