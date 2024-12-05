const STAKEHOLDER_ALREADY_EXISTS = "A stakeholder with this name already exists";

/**
 * Represents an error that occurs when a stakeholder is already in use.
 */
class StakeholderAlreadyExistsError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = STAKEHOLDER_ALREADY_EXISTS;
    this.customCode = 409;
  }
}

export { StakeholderAlreadyExistsError };