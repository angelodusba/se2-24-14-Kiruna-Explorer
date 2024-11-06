class ConnectionByDocumentIdResponse {
  document_id: number;
  connection_types: string[];

  constructor(document_id: number, connection_types: string[]) {
    this.document_id = document_id;
    this.connection_types = connection_types;
  }
}

export default ConnectionByDocumentIdResponse;
