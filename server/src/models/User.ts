/**
 * Represents a user in the system.
 */
class User {
  username: string;  // Unique user ID
  name: string;
  email: string;
  role: Role;        // Use the `Role` enum as the type for `role`
  password: string;

  /**
   * Creates a new instance of the User class.
   * @param username - The user id of the user. This is unique for each user.
   * @param name - The name of the user.
   * @param email - The email of the user.
   * @param role - The role of the user.
   * @param password - The user's password.
   */
  constructor(username: string, name: string, email: string, role: Role, password: string) {
      this.username = username;
      this.name = name;
      this.email = email;
      this.role = role;
      this.password = password;
  }
}

/**
* Represents the role of a user.
* The values present are the only valid values for the role of a user.
*/
enum Role {
  Resident = "Resident",
  UrbanPlanner = "Urban Planner",
  UrbanDeveloper = "Urban Developer",
  Admin = "Admin",
  Visitor = "Visitor"
}

export { User, Role };
