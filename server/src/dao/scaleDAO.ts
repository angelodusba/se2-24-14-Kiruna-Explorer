import * as db from "../db/db";
import Scale from "../models/scale";
import { ScaleAlreadyExistsError } from "../errors/scaleErrors";

class ScaleDAO{
     /**
   * Retrieves all scales from the database.
   * @returns A Promise that resolves to an array of Scale objects.
   */
    async getScales(): Promise<Scale[]>{
        try{
            const sql = "SELECT * FROM scales"
            const result = await db.query(sql,[])
            const scales : Scale[] = result.rows.map((row) => {
                return new Scale(row.id,row.name);
            });
            return scales;
        }catch(err: any){
            throw new Error(err);
            
            
        }
    }


    /**
   * Creates a new document scale.
   * @param name The format of the document scale, must not be null.
   * @returns A Promise that resolves to true if the document Scake has been successfully created.
   * @throws ScaleAlreadyExistsError If the document type already exists.
   */
    async createScale(
        name:string
    ): Promise<boolean>{
        try{
            const sql= "INSERT INTO scales (name) Values($1)";
            await db.query(sql,[name]);
            return true;
        } catch (err:any){
            if (err.message.includes("duplicate key value violates unique constraint")){
                throw new ScaleAlreadyExistsError();
            }
            throw new Error(err);
        }
    }



}

export default ScaleDAO;