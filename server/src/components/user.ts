/**
 * Represents a user in the system.
 */
class User {
  username: string;
  email: string;
  role: Role;

  /**
   * Creates a new instance of the User class.
   * @param username - The username of the user.
   * @param email - The email of the user. This is unique for each user.
   * @param role - The role of the user.
   */
  constructor(username: string, email: string, role: Role) {
    this.username = username;
    this.email = email;
    this.role = role;
  }
}

/**
 * Represents the role of a user.
 * The values present in this enum are the only valid values for the role of a user.
 */
enum Role {
  URBAN_PLANNER = "UrbanPlanner",
}

export { User, Role };
