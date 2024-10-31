import { User } from "../components/user";
import UserDAO from "../dao/userDAO";
import { UnauthorizedUserError } from "../errors/userErrors";

/**
 * Represents a controller for managing users.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class UserController {
  private dao: UserDAO;

  constructor() {
    this.dao = new UserDAO();
  }

  /**
   * Creates a new user.
   * @param username - The username of the new user. It must not be null.
   * @param email - The name of the new user. It must not be null and it must not be already taken.
   * @param password - The password of the new user. It must not be null.
   * @param role - The role of the new user. It must not be null and it can only be one of the three allowed types ("Manager", "Customer", "Admin")
   * @returns A Promise that resolves to true if the user has been created.
   */
  async createUser(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<boolean> {
    return this.dao.createUser(username, email, password, role);
  }

  /**
   * Returns all users.
   * @returns A Promise that resolves to an array of users.
   */
  async getUsers(): Promise<User[]> {
    return this.dao.getUsers();
  }

  /**
   * Returns all users with a specific role.
   * @param role - The role of the users to retrieve.
   * @returns A Promise that resolves to an array of users with the specified role.
   */
  async getUsersByRole(role: string): Promise<User[]> {
    return this.dao.getUsersByRole(role);
  }

  /**
   * Returns a specific user. A user can only retrieve its own information
   * @param email - The email of the user to retrieve. The user must exist.
   * @returns A Promise that resolves to the user with the specified username.
   */
  async getUserByEmail(user: User, email: string): Promise<User> {
    if (user.email !== email) {
      throw new UnauthorizedUserError();
    }
    return this.dao.getUserByEmail(email);
  }

  /**
   * Deletes a specific user
   * Users can only delete their own account
   * @param user - The logged in user
   * @param email - The email of the user to delete. The user must exist.
   * @returns A Promise that resolves to true if the user has been deleted.
   */
  async deleteUser(user: User, email: string): Promise<boolean> {
    const existingUser = await this.dao.getUserByEmail(email);
    if (user.email !== email) {
      throw new UnauthorizedUserError();
    }
    return this.dao.deleteUser(email);
  }

  /**
   * Deletes all users
   * @returns A Promise that resolves to true if all users have been deleted.
   */
  async deleteAll() {
    return this.dao.deleteAll();
  }

  /**
   * Updates the personal information of one user. The user can only update their own information.
   * @param user The user who wants to update their information
   * @param username The new username of the user
   * @param email The email of the user to update. It must be equal to the email of the user parameter.
   * @returns A Promise that resolves to the updated user
   */
  async updateUserInfo(user: User, username: string, email: string): Promise<User> {
    const userToUpdate = await this.dao.getUserByEmail(email);
    if (user.email !== email) {
      throw new UnauthorizedUserError();
    }
    return this.dao.updateUserInfo(username, email, user.role);
  }
}

export default UserController;
