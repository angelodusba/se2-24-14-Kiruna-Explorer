import db from "../db/db.js";
import { ExampleNotFoundError } from "../errors/exampleError.js";
import Example from "../models/example.js";

function ExampleDao() {
  this.db = db;

  /**
   * Example function
   */
  this.exampleFunction = (params) => {
    return new Promise((resolve, reject) => {
      const sql = `sql`;
      this.db.run(sql, [params], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };
}

export default ExampleDao;
