

export class halfConnection {
    connected_document_id: number;
    connection_name: string;

    constructor(connected_document_id: number, connection_name: string) {
        this.connected_document_id = connected_document_id;
        this.connection_name = connection_name;
    }
}
export class ConnectionList {
    starting_document_id: number;
    connections: halfConnection[];

    constructor(starting_document_id: number, connections: halfConnection[]) {
        this.starting_document_id = starting_document_id;
        this.connections = connections;
    }
}

export class Connection{
    document_id_1: number;
    document_id_2: number;
    connection_name: string;

    constructor(document_id_1: number, document_id_2: number, connection_name: string){
        this.document_id_1 = document_id_1;
        this.document_id_2 = document_id_2;
        this.connection_name = connection_name;
    }
}
