export class halfConnection {
  document_id: number | undefined;
  connection_types: string[];

  constructor(document_id: number, connection_types: string[]) {
    this.document_id = document_id;
    this.connection_types = connection_types;
  }
}
export class ConnectionList {
  starting_document_id: number | undefined;
  connections: halfConnection[];

  constructor(starting_document_id: number, connections: halfConnection[]) {
    this.starting_document_id = starting_document_id;
    this.connections = connections;
  }
}

export class Connection {
  document_id_1: number;
  document_id_2: number;
  connection_name: string[];

  constructor(
    document_id_1: number,
    document_id_2: number,
    connection_name: string[]
  ) {
    this.document_id_1 = document_id_1;
    this.document_id_2 = document_id_2;
    this.connection_name = connection_name;
  }
}
