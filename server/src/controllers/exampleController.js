import ExampleDao from "../daos/exampleDao.js";

function ExampleController() {
  this.exampleDao = new ExampleDao();

  /**
   * Example function
   */
  this.exampleFunction = async (params) => {
    const example = await this.exampleDao.doSomething(params);
    return example;
  };
}

export default ExampleController;
