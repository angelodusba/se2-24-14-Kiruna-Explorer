const ATTACHMENT_ALREADY_EXISTS = "Attachment already exists for this document!";

class AttachmentAlreadyExistsError extends Error {
    customMessage: String;
    customCode: Number;
  
    constructor() {
      super();
      this.customMessage = ATTACHMENT_ALREADY_EXISTS;
      this.customCode = 409;
    }
}

export { AttachmentAlreadyExistsError };