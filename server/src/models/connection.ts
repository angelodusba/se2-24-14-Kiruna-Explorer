class Connection {
  id_doc1: number;
  id_doc2: number;
  direct_conn: boolean;
  collateral_conn: boolean;
  prevision_conn: boolean;
  update_conn: boolean;

  constructor(
    id_doc1: number,
    id_doc2: number,
    direct_conn: boolean = false,
    collateral_conn: boolean = false,
    prevision_conn: boolean = false,
    update_conn: boolean = false
  ) {
    this.id_doc1 = id_doc1;
    this.id_doc2 = id_doc2;
    this.direct_conn = direct_conn;
    this.collateral_conn = collateral_conn;
    this.prevision_conn = prevision_conn;
    this.update_conn = update_conn;
  }
}

export default Connection;
