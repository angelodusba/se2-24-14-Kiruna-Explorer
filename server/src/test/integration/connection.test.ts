import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../../index";
import * as db from "../../db/db";
import { cleanup } from "../../db/db";
import ConnectionDAO from "../../dao/connectionDAO";
import DocumentDAO from "../../dao/documentDAO";
import StakeholderDAO from "../../dao/stakeholderDAO";
import TypeDAO from "../../dao/typeDAO";

import Type from "../../models/type";
import Stakeholder from "../../models/stakeholder";
import exp from "constants";

//ERRORS
import {
  InvalidConnectionTypeError,
  ConnectionAlreadyExistsError,
} from "../../errors/connectionErrors";
import { DocumentNotFoundError } from "../../errors/documentErrors";
import { randomInt } from "crypto";

const routePath = "/kirunaexplorer";

const urbanPlanner = {
  username: "urbanplanner",
  email: "urbanplanner@gmail.com",
  password: "urbanplanner",
  role: "Urban Planner",
};

const resident = {
  username: "resident",
  email: "resident@gmail.com",
  password: "resident",
  role: "Resident",
};

let urbanPlannerCookie: string;
let residentCookie: string;

const postUser = async (userInfo: any) => {
  await request(app).post(`${routePath}/users`).send(userInfo).expect(200);
};

const login = async (userInfo: any) => {
  const email = userInfo.email;
  const psw = userInfo.password;
  const userCredentials = { email: email, password: psw };
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`${routePath}/sessions`)
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.header["set-cookie"][0]);
      });
  });
};

beforeAll(async () => {
  await cleanup();
  await postUser(urbanPlanner);
  await postUser(resident);
  urbanPlannerCookie = await login(urbanPlanner);
  residentCookie = await login(resident);
  // Populate DB with types, stakeholders, documents
  const documentDao = new DocumentDAO();
  // Insert three types
  await db.query("INSERT INTO types (name) VALUES ($1)", ["type1"]);
  await db.query("INSERT INTO types (name) VALUES ($1)", ["type2"]);
  await db.query("INSERT INTO types (name) VALUES ($1)", ["type3"]);
  // Insert two stakeholders
  await db.query("INSERT INTO stakeholders (name) VALUES ($1)", [
    "stakeholder1",
  ]);
  await db.query("INSERT INTO stakeholders (name) VALUES ($1)", [
    "stakeholder2",
  ]);
  let stakeholderDao = new StakeholderDAO();
  let typeDao = new TypeDAO();

  let types = await typeDao.getTypes();
  let stakeholders = await stakeholderDao.getStakeholders();

  let type1 = types[0] as Type;
  let type2 = types[1] as Type;
  let type3 = types[2] as Type;
  let stakeholder1 = stakeholders[0] as Stakeholder;
  let stakeholder2 = stakeholders[1] as Stakeholder;
  // Insert three documents
  await documentDao.createDocument(
    "title1",
    "description1",
    type1.id,
    "2022-01-01",
    "scale1",
    null as any,
    "language1",
    "pages1",
    [stakeholder1.id]
  );
  await documentDao.createDocument(
    "title2",
    "description2",
    type2.id,
    "2022-01-02",
    "scale2",
    null as any,
    "language2",
    "pages2",
    [stakeholder2.id]
  );
  await documentDao.createDocument(
    "title3",
    "description3",
    type3.id,
    "2022-01-03",
    "scale3",
    null as any,
    "language3",
    "pages3",
    [stakeholder1.id, stakeholder2.id]
  );
});

afterEach(async () => {
  // Remove all connections
  await db.query("DELETE FROM connections", []);
});

afterAll(async () => {
  await cleanup();
  await db.pool.end();
});

describe("POST kirunaexplorer/connections", () => {
  test("POST /kirunaexplorer/connections - success", async () => {
    let documentDao = new DocumentDAO();
    let documents = await documentDao.getDocumentsNames();
    let document1 = documents[0];
    let document2 = documents[1];
    let document3 = documents[2];
    let connectionDao = new ConnectionDAO();
    await request(app)
      .post(`${routePath}/connections`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        starting_document_id: document1.id,
        connections: [
          {
            connected_document_id: document2.id,
            connection_types: ["direct_conn"],
          },
          {
            connected_document_id: document3.id,
            connection_types: ["collateral_conn"],
          },
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });

  test("POST /kirunaexplorer/connections - fail, no connections", async () => {
    let documentDao = new DocumentDAO();
    let documents = await documentDao.getDocumentsNames();
    let document1 = documents[0];
    await request(app)
      .post(`${routePath}/connections`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        starting_document_id: document1.id,
        connections: [],
      })
      .expect(422)
      .catch((err) => {
        expect(err.message).toContain("Invalid value");
        expect(err.params).toContain("connections");
      });
    //Check if connections were created
    let connectionDao = new ConnectionDAO();
    let connections = await connectionDao.getConnections();
    expect(connections).toEqual([]);
  });

  test("POST /kirunaexplorer/connections - fail, invalid connection type", async () => {
    let documentDao = new DocumentDAO();
    let documents = await documentDao.getDocumentsNames();
    let document1 = documents[0];
    let document2 = documents[1];
    await request(app)
      .post(`${routePath}/connections`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        starting_document_id: document1.id,
        connections: [
          {
            connected_document_id: document2.id,
            connection_types: ["invalid_conn"],
          },
        ],
      })
      .expect(422);

    //Check if connections were created
    let connectionDao = new ConnectionDAO();
    let connections = await connectionDao.getConnections();
    expect(connections).toEqual([]);
  });
  test("POST /kirunaexplorer/connections - fail, document does not exist", async () => {
    let nonExistentID = 1000;
    await request(app)
      .post(`${routePath}/connections`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        starting_document_id: nonExistentID,
        connections: [
          {
            connected_document_id: 1,
            connection_types: ["direct_conn"],
          },
        ],
      })
      .expect(404);

    //Check if connections were created
    let connectionDao = new ConnectionDAO();
    let connections = await connectionDao.getConnections();
    expect(connections).toEqual([]);
  });
  // Test that creation fails if not urban planner
  test("POST /kirunaexplorer/connections - fail, not urban planner", async () => {
    let documentDao = new DocumentDAO();
    let documents = await documentDao.getDocumentsNames();
    let document1 = documents[0];
    let document2 = documents[1];
    await request(app)
      .post(`${routePath}/connections`)
      .set("Cookie", residentCookie)
      .send({
        starting_document_id: document1.id,
        connections: [
          {
            connected_document_id: document2.id,
            connection_types: ["direct_conn"],
          },
        ],
      })
      .expect(401)
      .catch((err) => {
        expect(err.message).toContain("Unauthorized");
      });
    //Check if connections were created
    let connectionDao = new ConnectionDAO();
    let connections = await connectionDao.getConnections();
    expect(connections).toEqual([]);
  });
  // Test that creation fails if not logged in
  test("POST /kirunaexplorer/connections - fail, not logged in", async () => {
    let documentDao = new DocumentDAO();
    let documents = await documentDao.getDocumentsNames();
    let document1 = documents[0];
    let document2 = documents[1];
    await request(app)
      .post(`${routePath}/connections`)
      .send({
        starting_document_id: document1.id,
        connections: [
          {
            connected_document_id: document2.id,
            connection_types: ["direct_conn"],
          },
        ],
      })
      .expect(401)
      .catch((err) => {
        expect(err.message).toContain("Unauthorized");
      });
    //Check if connections were created
    let connectionDao = new ConnectionDAO();
    let connections = await connectionDao.getConnections();
    expect(connections).toEqual([]);
  });
});

describe("GET kirunaexplorer/connections/names", () => {
  test("GET /kirunaexplorer/connections/names - success", async () => {
    await request(app)
      .get(`${routePath}/connections/names`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([
          "direct_conn",
          "collateral_conn",
          "prevision_conn",
          "update_conn",
        ]);
      });
  });
});
