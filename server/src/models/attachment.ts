

class Attachment{
    id: number;
    document_id: number;
    type: string;
    original: boolean
    path: String;

    constructor(id: number,
        document_id: number,
        type: string,
        original: boolean,
        path: String){
            this.id=id;
            this.document_id=document_id;
            this.type=type;
            this.original=original;
            this.path=path;
        }

}

export default Attachment;