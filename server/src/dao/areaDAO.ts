import * as db from "../db/db";
import Area from "../models/area";
import Coordinates from "../models/coordinates";

class AreaDAO{


    /**
     * Fetches all the saved areas
     * @returns A Promise that resolves to an array of document object.
     */
    async getAllAreas():Promise<Area[]>{
        try{
            const sql= "SELECT * FROM areas"
            const result = await db.query(sql,[])
            const areas : Area[] = result.row.map((row)=>{
                return new Area(row.id,row.name,row.coordinates);
            });
            return areas

        }catch(err: any){
            throw new Error(err);
            
            
        }
    }

}


export default AreaDAO;