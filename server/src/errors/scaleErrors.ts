const SCALE_ALREADY_EXISTS = "A scale with this name already exists";
/**
 * Represents an error that occurs when a scale is already in use.
 */
class ScaleAlreadyExistsError extends Error {
    customMessage: String;
    customCode: Number;
  
    constructor() {
      super();
      this.customMessage = SCALE_ALREADY_EXISTS;
      this.customCode = 409;
    }
  }
  
  export { ScaleAlreadyExistsError };