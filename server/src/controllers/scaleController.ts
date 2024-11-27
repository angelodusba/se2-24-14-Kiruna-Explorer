import Scale from "../models/scale";
import ScaleDAO from "../dao/scaleDAO";

/**
 * Represents a controller for managing documents scales.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ScaleController{
    private dao: ScaleDAO
    constructor(){
        this.dao= new ScaleDAO();
    }


    
  /**
   * Retrieves all Scales of documents from the database.
   * @returns A Promise that resolves to an array of Scale objects.
   */
    async getScales():Promise<Scale[]>{
        return this.dao.getScales();
    }


    /**
   * Creates a new Scale for document in the database.
   * @param name - The scale of the document.
   * @returns A Promise that resolves to true if the document scale has been successfully created.
   */
    async createScale(
        name: string
    ): Promise<boolean>{
        return this.dao.createScale(name)
    }

}

export default ScaleController;