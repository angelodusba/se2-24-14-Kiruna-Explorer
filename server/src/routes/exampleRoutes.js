import express from "express";
import ExampleController from "../controllers/exampleController.js";
import { validateRequest } from "../helpers.js";
import { param, body } from "express-validator";

function ExampleRoutes() {
  this.router = express.Router();
  this.exampleController = new ExampleController();

  this.getRouter = () => this.router;

  this.initRoutes = function () {
    this.router.get("/", (req, res, next) => {
      this.exampleController
        .exampleFunction()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          next(err);
        });
    });
  };

  this.initRoutes();
}

export default ExampleRoutes;
