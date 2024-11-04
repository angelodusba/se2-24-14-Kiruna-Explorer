

export class Connection {
    connected_document_id: number;
    connection_name: string;

    constructor(connected_document_id: number, connection_name: string) {
        this.connected_document_id = connected_document_id;
        this.connection_name = connection_name;
    }
}
export class ConnectionList {
    starting_document_id: number;
    connections: Connection[];

    constructor(starting_document_id: number, connections: Connection[]) {
        this.starting_document_id = starting_document_id;
        this.connections = connections;
    }

    addConnection(connection: Connection) {
        this.connections.push(connection);
    }

    removeConnection(connection: Connection) {
        this.connections = this.connections.filter((conn) => conn !== connection);
    }
}
