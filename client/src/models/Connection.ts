interface HalfConnection {
  document_id: number | undefined;
  connection_types: string[];
}
interface ConnectionList {
  starting_document_id: number | undefined;
  connections: HalfConnection[];
}

interface Connection {
  document_id_1: number;
  document_id_2: number;
  connection_name: string[];
}

export type { HalfConnection, ConnectionList, Connection };
