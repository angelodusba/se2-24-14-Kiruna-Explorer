class Attachment {
  id: number;
  document_id: number;
  type: string;
  original: boolean;
  path: string;

  constructor(id: number, document_id: number, type: string, original: boolean, path: string) {
    this.id = id;
    this.document_id = document_id;
    this.type = type;
    this.original = original;
    this.path = path;
  }
}

export default Attachment;
