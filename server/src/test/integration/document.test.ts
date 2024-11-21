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

const retrieveInitialData = async () => {
  // Retrieve the existing data from db needed to perform tests
  const connectionDAO = new ConnectionDAO();
  let stakeholderDao = new StakeholderDAO();
  let typeDao = new TypeDAO();
  const documentDAO = new DocumentDAO();

  let connections = await connectionDAO.getConnectionNames();
  let types = await typeDao.getTypes();
  let stakeholders = await stakeholderDao.getStakeholders();

  let type1 = types[0] as Type;
  let type2 = types[1] as Type;
  let type3 = types[2] as Type;
  let stakeholder1 = stakeholders[0] as Stakeholder;
  let stakeholder2 = stakeholders[1] as Stakeholder;
  let connection_name1 = connections[0];
  let connection_name2 = connections[1];
  // Insert two documents
  await documentDAO.createDocument(
    "title1",
    "description1",
    type1.id,
    "2022-01-01",
    "Text",
    null as any,
    "English",
    "pages1",
    [stakeholder1.id]
  );
  await documentDAO.createDocument(
    "title2",
    "description2",
    type2.id,
    "2022-01-02",
    "Blueprints/material effects",
    null as any,
    "Swedish",
    "pages2",
    [stakeholder2.id]
  );

  let documents = await documentDAO.getDocumentsNames();
  let document1 = documents[0];
  let document2 = documents[1];
  const tmp = {
    type1: type1.id,
    type2: type2.id,
    type3: type3.id,
    stakeholder1: stakeholder1.id,
    stakeholder2: stakeholder2.id,
    connection_name1: connection_name1,
    connection_name2: connection_name2,
    document1: document1,
    document2: document2,
  };
  return tmp;
};

beforeAll(async () => {
  await cleanup();
  await postUser(urbanPlanner);
  await postUser(resident);
  urbanPlannerCookie = await login(urbanPlanner);
  residentCookie = await login(resident);
  // Populate DB with types, stakeholders
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
});

afterAll(async () => {
  await cleanup();
  await db.pool.end();
});

describe("POST kirunaexplorer/documents", () => {
  test("POST /kirunaexplorer/documents - success", async () => {
    // Retrieve existing connection names, types and stakeholders
    const test_obj = await retrieveInitialData();
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: [{ lat: 1.0, lng: 3.0 }],
        language: "",
        pages: "pages",
        stakeholders: [test_obj.stakeholder1, test_obj.stakeholder2],
        connections: [
          {
            connected_document_id: test_obj.document1.id,
            connection_name: test_obj.connection_name1,
          },
          {
            connected_document_id: test_obj.document2.id,
            connection_name: test_obj.connection_name2,
          },
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBeGreaterThan(0);          
      })
  });

  test("POST /kirunaexplorer/documents - unauthorized", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", residentCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: [{ lat: 1.0, lng: 3.0 }],
        language: "",
        pages: {},
        stakeholders: [test_obj.stakeholder1, test_obj.stakeholder2],
        connections: [
          {
            connected_document_id: test_obj.document1.id,
            connection_name: test_obj.connection_name1,
          },
          {
            connected_document_id: test_obj.document2.id,
            connection_name: test_obj.connection_name2,
          },
        ],
      })
      .expect(401);
  });

  test("POST /kirunaexplorer/documents - document with empty title", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: [{ lat: 1.0, lng: 3.0 }],
        language: "",
        pages: {},
        stakeholders: [test_obj.stakeholder1, test_obj.stakeholder2],
        connections: [
          {
            connected_document_id: test_obj.document1.id,
            connection_name: test_obj.connection_name1,
          },
          {
            connected_document_id: test_obj.document2.id,
            connection_name: test_obj.connection_name2,
          },
        ],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents - document with invalid date", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/45/2020",
        scale: "blueprints/effects",
        location: [{ lat: 1.0, lng: 3.0 }],
        language: "",
        pages: {},
        stakeholders: [test_obj.stakeholder1, test_obj.stakeholder2],
        connections: [
          {
            connected_document_id: test_obj.document1.id,
            connection_name: test_obj.connection_name1,
          },
          {
            connected_document_id: test_obj.document2.id,
            connection_name: test_obj.connection_name2,
          },
        ],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents - document with invalid coordinates", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: [{ lat: 1.0, lng: "3.0" }],
        language: "",
        pages: {},
        stakeholders: [test_obj.stakeholder1, test_obj.stakeholder2],
        connections: [
          {
            connected_document_id: test_obj.document1.id,
            connection_name: test_obj.connection_name1,
          },
          {
            connected_document_id: test_obj.document2.id,
            connection_name: test_obj.connection_name2,
          },
        ],
      })
      .expect(422);
  });
});

describe("GET /kirunaexplorer/documents/names", () => {
  test("GET /kirunaexplorer/documents/names - success", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .get(`${routePath}/documents/names`)
      .set("Cookie", urbanPlannerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toContainEqual({
          id: test_obj.document1.id,
          title: test_obj.document1.title,
        });
        expect(res.body).toContainEqual({
          id: test_obj.document2.id,
          title: test_obj.document2.title,
        });
      });
  });
});

describe("GET /kirunaexplorer/documents/:id", () => {
  test("GET /kirunaexplorer/documents/:id - success", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .get(`${routePath}/documents/${test_obj.document1.id}`)
      .set("Cookie", urbanPlannerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(test_obj.document1.title);
      });
  });

  test("GET /kirunaexplorer/documents/:id - not found", async () => {
    await request(app)
      .get(`${routePath}/documents/99999`)
      .set("Cookie", urbanPlannerCookie)
      .expect(404);
  });

  test("GET /kirunaexplorer/documents/:id - invalid id", async () => {
    await request(app)
      .get(`${routePath}/documents/invalid_id`)
      .set("Cookie", urbanPlannerCookie)
      .expect(422);
  });

  test("GET /kirunaexplorer/documents/:id - invalid numeric id", async () => {
    await request(app)
      .get(`${routePath}/documents/-5`)
      .set("Cookie", urbanPlannerCookie)
      .expect(422);
  });
});

describe("PUT /kirunaexplorer/documents/location", () => {
  test("PUT /kirunaexplorer/documents/location - success", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .get(`${routePath}/documents/${test_obj.document1.id}`)
      .set("Cookie", urbanPlannerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.location).toEqual([]);
      });
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(200);
    await request(app)
      .get(`${routePath}/documents/${test_obj.document1.id}`)
      .set("Cookie", urbanPlannerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.location).toEqual([{ lat: 5.0, lng: 8.0 }]);
      });
  });

  test("PUT /kirunaexplorer/documents/location - not found", async () => {
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: 99999,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(404);
  });

  test("PUT /kirunaexplorer/documents/location - empty id", async () => {
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: "",
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(422);
  });

  test("PUT /kirunaexplorer/documents/location - invalid id", async () => {
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: "invalid_id",
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(422);
  });

  test("PUT /kirunaexplorer/documents/location - invalid numeric id", async () => {
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: -5,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(422);
  });

  test("PUT /kirunaexplorer/documents/location - invalid location", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: "invalid_location",
      })
      .expect(422);
  });

  test("PUT /kirunaexplorer/documents/location - invalid location format", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: [{ lat: 5.0, lng: "no" }],
      })
      .expect(422);
  });

  test("PUT /kirunaexplorer/documents/location - not logged in", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .put(`${routePath}/documents/location`)
      .send({
        id: test_obj.document1.id,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(401);
  });

  test("PUT /kirunaexplorer/documents/location - unauthorized", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", residentCookie)
      .send({
        id: test_obj.document1.id,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(401);
  });
});

describe("POST kirunaexplorer/documents/filtered", () => {
  test("POST /kirunaexplorer/documents/filtered - success", async () => {
    await db.query("DELETE FROM documents_stakeholders");
    await db.query("DELETE FROM documents");
    const test_obj = await retrieveInitialData();
    const doc1 = await request(app)
      .get(`${routePath}/documents/${test_obj.document1.id}`)
      .set("Cookie", urbanPlannerCookie);
    const doc2 = await request(app)
      .get(`${routePath}/documents/${test_obj.document2.id}`)
      .set("Cookie", urbanPlannerCookie);
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        title: "title",
        municipality: true,
        start_year: "2022",
        end_year: "2022"
      })
      .expect(200)
      .expect((res) => {
        expect(Number(res.body.totalRows)).toBe(2);
        expect(Number(res.body.totalPages)).toBe(1);
        expect(res.body.docs).toHaveLength(2);
        expect(res.body.docs).toContainEqual(doc1.body);
        expect(res.body.docs).toContainEqual(doc2.body);
      });
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        description: "description2",
        languages: ["Swedish"],
        stakeholders: [test_obj.stakeholder2],
        start_year: "2022",
        end_year: "2022"
      })
      .expect(200)
      .expect((res) => {
        expect(Number(res.body.totalRows)).toBe(1);
        expect(Number(res.body.totalPages)).toBe(1);
        expect(res.body.docs).toHaveLength(1);
        expect(res.body.docs).toContainEqual(doc2.body);
      });
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        types: [test_obj.type1],
        scales: ["Text"],
        stakeholders: [test_obj.stakeholder1],
        start_year: "2022",
        end_year: "2022"
      })
      .expect(200)
      .expect((res) => {
        expect(Number(res.body.totalRows)).toBe(1);
        expect(Number(res.body.totalPages)).toBe(1);
        expect(res.body.docs).toHaveLength(1);
        expect(res.body.docs).toContainEqual(doc1.body);
      });
  });

  test("POST /kirunaexplorer/documents/filtered - invalid page", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=invalid&size=5&sort=title%3Aasc`)
      .send({})
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - negative page", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=-1&size=5&sort=title%3Aasc`)
      .send({})
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid size", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=invalid&sort=title%3Aasc`)
      .send({})
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - too big size", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=22&sort=title%3Aasc`)
      .send({})
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid sort", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=invalid`)
      .send({})
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid year", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        start_year: "202",
        end_year: "2022"          
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid scales", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        scales: ["invalid"]
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid types", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        types: ["invalid"]
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid languages", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        languages: ["invalid"]
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid stakeholders", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        stakeholders: ["invalid"]
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid municipality", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        municipality: "invalid"
      })
      .expect(422);
  });
});