import express, { Router } from "express";
import Authenticator from "./auth";
import { body, param } from "express-validator";
import { User } from "../models/user";
import ErrorHandler from "../helper";
import UserController from "../controllers/userController";
import { UserAlreadyExistsError } from "../errors/userErrors";

/**
 * Represents a class that defines the routes for handling users.
 */
class UserRoutes {
  private router: Router;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;
  private controller: UserController;

  /**
   * Constructs a new instance of the UserRoutes class.
   * @param authenticator The authenticator object used for authentication.
   */
  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new UserController();
    this.initRoutes();
  }

  /**
   * Get the router instance.
   * @returns The router instance.
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Initializes the routes for the user router.
   *
   * @remarks
   * This method sets up the HTTP routes for creating, retrieving, updating, and deleting user data.
   * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
   */
  initRoutes() {
    /**
     * Route for creating a user.
     * It does not require authentication.
     * It requires the following body parameters:
     * - username: string. It cannot be empty
     * - email: string. An existing email cannot be used to create a new user
     * - password: string. It cannot be empty.
     * - role: string
     * It returns a 200 status code.
     */
    this.router.post(
      "/",
      body("username").isString().notEmpty().withMessage("Field 'username' is required"),
      body("email").isEmail().notEmpty().withMessage("Field 'email' is required"),
      body("password").isString().notEmpty().withMessage("Field 'password' is required"),
      body("role")
        .isString()
        .notEmpty()
        .withMessage("Field 'role' is required")
        .isIn(["Resident", "Urban Planner", "Urban Developer"])
        .withMessage(
          "Field 'role' possible values: 'Resident', 'Urban Planner', 'Urban Developer'"
        ),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .createUser(req.body.username, req.body.email, req.body.password, req.body.role)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );

    /**
     * Route for retrieving all users.
     * It requires the user to be logged in and to be an admin.
     * It returns an array of users.
     */
    // this.router.get(
    //   "/",
    //   this.authService.isLoggedIn,
    //   this.authService.isAdmin,
    //   (req: any, res: any, next: any) =>
    //     this.controller
    //       .getUsers()
    //       .then((users: User[]) => res.status(200).json(users))
    //       .catch((err) => next(err))
    // );

    /**
     * Route for retrieving all users of a specific role.
     * It requires the user to be logged in and to be an admin.
     * It expects the role of the users in the request parameters: the role must be one of ("Manager", "Customer", "Admin").
     * It returns an array of users.
     */
    // this.router.get(
    //   "/roles/:role",
    //   this.authService.isLoggedIn,
    //   this.authService.isAdmin,
    //   param("role")
    //     .isString()
    //     .isIn(["Manager", "Customer", "Admin"])
    //     .withMessage("Field 'role' possible values: 'Customer', 'Manager', 'Admin'"),
    //   this.errorHandler.validateRequest,
    //   (req: any, res: any, next: any) =>
    //     this.controller
    //       .getUsersByRole(req.params.role)
    //       .then((users: User[]) => res.status(200).json(users))
    //       .catch((err) => next(err))
    // );

    /**
     * Route for retrieving a user by its email.
     * It requires the user to be authenticated: users can only retrieve their own data.
     * It expects the email of the user in the request parameters: the email must represent an existing user.
     * It returns the user.
     */
    // this.router.get(
    //   "/:email",
    //   this.authService.isLoggedIn,
    //   param("email").isString().notEmpty().withMessage("Param 'email' is required"),
    //   this.errorHandler.validateRequest,
    //   (req: any, res: any, next: any) =>
    //     this.controller
    //       .getUserByEmail(req.user, req.params.email)
    //       .then((user: User) => res.status(200).json(user))
    //       .catch((err) => next(err))
    // );

    /**
     * Route for deleting a user.
     * It requires the user to be authenticated: users can only delete their own data.
     * It expects the email of the user in the request parameters: the email must represent an existing user.
     * It returns a 200 status code.
     */
    this.router.delete(
      "/:email",
      this.authService.isLoggedIn,
      param("email").isEmail().notEmpty().withMessage("Param 'email' is required"),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) =>
        this.controller
          .deleteUser(req.user, req.params.email)
          .then(() => res.status(200).end())
          .catch((err: any) => next(err))
    );

    /**
     * Route for deleting all non-Admin users.
     * It requires the user to be logged in and to be an admin.
     * It returns a 200 status code.
     */
    // this.router.delete(
    //   "/",
    //   this.authService.isLoggedIn,
    //   this.authService.isAdmin,
    //   (req: any, res: any, next: any) =>
    //     this.controller
    //       .deleteAll()
    //       .then(() => res.status(200).end())
    //       .catch((err: any) => next(err))
    // );

    /**
     * Route for updating the information of a user.
     * It requires the user to be authenticated.
     * It expects the email of the user to edit in the request parameters: the email must match the email of the logged in user.
     * It requires the following body parameters:
     * - username: string. It cannot be empty.
     * - email: string. It cannot be empty.
     * It returns the updated user.
     */
    this.router.put(
      "/:email",
      this.authService.isLoggedIn,
      param("email").isEmail().notEmpty().withMessage("Param 'email' is required"),
      body("username").isString().notEmpty().withMessage("Field 'username' is required"),
      body("email").isEmail().notEmpty().withMessage("Field 'email' is required"),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) =>
        this.controller
          .updateUserInfo(req.user, req.body.username, req.body.email, req.params.email)
          .then((user: User) => res.status(200).json(user))
          .catch((err: any) => next(err))
    );
  }
}

/**
 * Represents a class that defines the authentication routes for the application.
 */
class AuthRoutes {
  private router: Router;
  private errorHandler: ErrorHandler;
  private authService: Authenticator;

  /**
   * Constructs a new instance of the UserRoutes class.
   * @param authenticator - The authenticator object used for authentication.
   */
  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.errorHandler = new ErrorHandler();
    this.router = express.Router();
    this.initRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  /**
   * Initializes the authentication routes.
   *
   * @remarks
   * This method sets up the HTTP routes for login, logout, and retrieval of the logged in user.
   * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
   */
  initRoutes() {
    /**
     * Route for logging in a user.
     * It does not require authentication.
     * It expects the following parameters:
     * - email: string. It cannot be empty.
     * - password: string. It cannot be empty.
     * It returns an error if the email represents a non-existing user or if the password is incorrect.
     * It returns the logged in user.
     */
    this.router.post(
      "/",
      body("email").isEmail().notEmpty().withMessage("Field 'email' is required"),
      body("password").isString().notEmpty().withMessage("Field 'password' is required"),
      this.errorHandler.validateRequest,
      (req, res, next) =>
        this.authService
          .login(req, res, next)
          .then((user: User) => res.status(200).json(user))
          .catch((err: any) => {
            res.status(401).json(err);
          })
    );

    /**
     * Route for logging out the currently logged in user.
     * It expects the user to be logged in.
     * It returns a 200 status code.
     */
    this.router.delete("/", this.authService.isLoggedIn, (req, res, next) =>
      this.authService
        .logout(req, res, next)
        .then(() => res.status(200).end())
        .catch((err: any) => next(err))
    );

    /**
     * Route for retrieving the currently logged in user.
     * It expects the user to be logged in.
     * It returns the logged in user.
     */
    this.router.get("/", this.authService.isLoggedIn, (req: any, res: any) =>
      res.status(200).json(req.user)
    );
  }
}

export { UserRoutes, AuthRoutes };
