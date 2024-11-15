
import * as db from "../db/db";



class AttachmentDAO{

    /**
     * add new attachment to a document
     * document_id: id of the document
     * type: id of the type of the attachment
     * original: boolean value to indicate if the attachment is original or not
     * path: path to the attachment
     * @returns A Promise that resolves to true if the attachment has been successfully added.
     */
    async addAttachment(document_id: number, type: number, original: boolean, path: string): Promise<{id : number}> {

        const client = await db.pool.connect();
        try{
            let sql = "";
            await client.query("BEGIN");
            sql = `INSERT INTO attachments (document_id, type, original, path) VALUES ($1, $2, $3, $4) RETURNING id`;
        
            const res = await client.query(sql, [document_id, type, original, path]);
            //check for errors
            if(!res.rows || res.rows.length === 0)
                throw new Error("Unable to add the attachment right now, try again later");
            const attachment_id = res.rows[0].id;
            await client.query("COMMIT");
            return {id: attachment_id};

        }   
        catch(err: any){
            await client.query("ROLLBACK");
            throw err;
        }
        finally{
            client.release();
        }
    }

    /**
     * get all attachments of a document
     * document_id: id of the document
     * @returns A Promise that resolves to an array of attachments.
     */
    async getAttachments(document_id: number): Promise<any[]> {
        const client = await db.pool.connect();
        try{
            let sql = `SELECT * FROM attachments WHERE document_id=$1`;
            const res = await client.query(sql, [document_id]);
            return res.rows;
        }
        catch(err: any){
            throw err;
        }
        finally{
            client.release();
        }
    }

}

export default AttachmentDAO;