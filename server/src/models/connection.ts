class Connection {
  id_doc1: number;
  id_doc2: number;
  connection_types: string[];

  constructor(id_doc1: number, id_doc2: number, connection_types: string[]) {
    this.id_doc1 = id_doc1;
    this.id_doc2 = id_doc2;
    this.connection_types = connection_types;
  }
}

export enum ConnectionType {
  DIRECT = "direct_conn",
  COLLATERAL = "collateral_conn",
  PREVISION = "prevision_conn",
  UPDATE = "update_conn",
}

export default Connection;
