import { validationResult } from "express-validator";

/**
 * Validates the request object and returns an error if the request object is not formatted properly, according to the middlewares used when defining the request.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware
 * @returns Returns the next middleware if there are no errors or a response with a status code of 422 if there are errors.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const result = errors.array().map((e) => {
      return { error: `Parameter ${e.path} in ${e.location}: ${e.msg}` };
    });
    return res.status(422).json({ errors: result });
  }
  return next();
}

/**
 * Registers the global error handler
 * @param app - The express application
 */
function registerErrorHandler(app) {
  app.use((err, req, res, next) => {
    return res.status(err.customCode || 503).json({
      error: err.customMessage || "Internal Server Error",
      status: err.customCode || 503,
    });
  });
}

export { registerErrorHandler, validateRequest };
