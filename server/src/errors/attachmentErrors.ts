const ATTACHMENT_NOT_FOUND = "The attachment does not exist!";
const ATTACHMENT_ALREADY_EXISTS = "Attachment already exists for this document!";
const ATTACHMENT_NOT_ALLOWED = "Wrong attachment type: only documents and images are allowed!";

class AttachmentNotFoundError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = ATTACHMENT_NOT_FOUND;
    this.customCode = 404;
  }
}

class AttachmentAlreadyExistsError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = ATTACHMENT_ALREADY_EXISTS;
    this.customCode = 409;
  }
}

class AttachmentNotAllowedError extends Error {
  customMessage: String;
  customCode: Number;

  constructor() {
    super();
    this.customMessage = ATTACHMENT_NOT_ALLOWED;
    this.customCode = 415;
  }
}

export { AttachmentNotFoundError, AttachmentAlreadyExistsError, AttachmentNotAllowedError };
