import Type from "../models/type";
import TypeDAO from "../dao/typeDAO";
import { UnauthorizedUserError } from "../errors/userErrors";

/**
 * Represents a controller for managing types.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class TypeController {
  private dao: TypeDAO;

  constructor() {
    this.dao = new TypeDAO();
  }

  /**
   * Retrieves all types from the database.
   * @returns A Promise that resolves to an array of Type objects.
   */
  async getTypes(): Promise<Type[]> {
    return this.dao.getTypes();
  }
}

export default TypeController;