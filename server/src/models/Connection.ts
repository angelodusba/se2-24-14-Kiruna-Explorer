class Connection {
    id_doc1: number;
    id_doc2: number;
    conn_type1: boolean;
    conn_type2: boolean;
    conn_type3: boolean;
    conn_type4: boolean;

    constructor(id_doc1: number, id_doc2: number) {
        this.id_doc1 = id_doc1;
        this.id_doc2 = id_doc2;
        this.conn_type1 = false;
        this.conn_type2 = false;
        this.conn_type3 = false;
        this.conn_type4 = false;
    }
}

export { Connection };
