const USER_NOT_FOUND = "The user does not exist";
const USER_ALREADY_EXISTS = "A user with this email already exists";
const UNAUTHORIZED_USER = "You cannot access the information of other users";

/**
 * Represents an error that occurs when a user is not found.
 */
class UserNotFoundError extends Error {
  customMessage: string;
  customCode: number;

  constructor() {
    super();
    this.customMessage = USER_NOT_FOUND;
    this.customCode = 404;
  }
}

/**
 * Represents an error that occurs when a username is already in use.
 */
class UserAlreadyExistsError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = USER_ALREADY_EXISTS;
    this.customCode = 409;
  }
}

/**
 * Represents an error that occurs when a user doesn't have enough priviledges.
 */
class UnauthorizedUserError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = UNAUTHORIZED_USER;
    this.customCode = 401;
  }
}

export { UserNotFoundError, UserAlreadyExistsError, UnauthorizedUserError };
