import Type from "../models/type";
import TypeDAO from "../dao/typeDAO";
import { UnauthorizedUserError } from "../errors/userErrors";

/**
 * Represents a controller for managing documents types.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class TypeController {
  private dao: TypeDAO;

  constructor() {
    this.dao = new TypeDAO();
  }

  /**
   * Retrieves all types of documents from the database.
   * @returns A Promise that resolves to an array of Type objects.
   */
  async getTypes(): Promise<Type[]> {
    return this.dao.getTypes();
  }

  /**
   * Creates a new type of document in the database.
   * @param name - The name of the document type.
   * @returns A Promise that resolves to true if the document type has been successfully created.
   */
  async createType(
    name: string
  ): Promise<boolean> {
    return this.dao.createType(name);
  }
}

export default TypeController;
