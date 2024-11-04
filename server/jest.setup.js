const dotenv = require("dotenv");

const env = dotenv.config({ path: "../.env.test" });
if (env.error) {
  throw new Error("File `.env.test` not found. Please create it.");
}
