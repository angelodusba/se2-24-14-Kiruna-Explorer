const EXAMPLE_NOT_FOUND = "Example not found";

function ExampleNotFoundError() {
  const error = new Error();
  error.customMessage = EXAMPLE_NOT_FOUND;
  error.customCode = 404;
  return error;
}

export { ExampleNotFoundError };
