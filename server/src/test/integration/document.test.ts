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
  await db.query("INSERT INTO stakeholders (name) VALUES ($1)", ["stakeholder1"]);
  await db.query("INSERT INTO stakeholders (name) VALUES ($1)", ["stakeholder2"]);
  // Populate DB with municipality area if it doesn't exist yet
  const res = await db.query(`SELECT id, name FROM areas WHERE id = 1`);
  if (res.rows.length === 0) {
    await db.query(
      `
      INSERT INTO areas (name, location) VALUES ($1, 
      ST_SetSRID(ST_GeometryFromText('POLYGON((
      21.9621 67.3562, 22.0589 67.4263, 22.1965 67.5545, 22.3241 67.6468, 
      22.4646 67.7458, 22.5947 67.7798, 22.8129 67.8383, 23.2867 68.1542, 
      23.2603 68.1569, 23.2484 68.1484, 23.2179 68.1466, 23.2013 68.1399, 
      23.1685 68.1331, 23.1524 68.1383, 23.1415 68.1543, 23.147 68.1714, 
      23.1425 68.1795, 23.1576 68.1994, 23.1415 68.2061, 23.1528 68.231, 
      23.1419 68.2479, 23.1095 68.2527, 23.0765 68.2684, 23.0648 68.2806, 
      23.0702 68.2997, 23.0607 68.3058, 23.0375 68.3071, 22.9864 68.3206, 
      22.9706 68.3322, 22.9181 68.3335, 22.8935 68.3487, 22.8761 68.3521, 
      22.8359 68.3661, 22.8465 68.381, 22.8041 68.3929, 22.764 68.3851, 
      22.7384 68.3849, 22.7114 68.3973, 22.6889 68.3995, 22.6903 68.4069, 
      22.6482 68.416, 22.6439 68.4319, 22.5751 68.4218, 22.5562 68.4338, 
      22.5379 68.4342, 22.4964 68.4422, 22.4653 68.4417, 22.4383 68.4597, 
      22.4134 68.4665, 22.3973 68.4639, 22.3667 68.4498, 22.3441 68.4452, 
      22.349 68.4624, 22.3435 68.4706, 22.3499 68.4813, 22.296 68.484, 
      22.2819 68.4796, 22.2517 68.4823, 22.2256 68.4741, 22.2051 68.4797, 
      22.1793 68.4776, 22.1544 68.4702, 22.1277 68.4719, 22.1224 68.4808, 
      22.077 68.4822, 22.0439 68.4795, 22.011 68.4999, 21.9959 68.5217, 
      22.0074 68.5307, 21.9921 68.5338, 21.9677 68.5513, 21.9471 68.5559, 
      21.9275 68.5675, 21.8878 68.5847, 21.842 68.5912, 21.7727 68.5855, 
      21.7221 68.5907, 21.7 68.5972, 21.6991 68.6143, 21.7095 68.6254, 
      21.6972 68.6322, 21.6634 68.6407, 21.6512 68.6506, 21.627 68.6549, 
      21.6241 68.6621, 21.5842 68.6678, 21.5532 68.6772, 21.5099 68.6757, 
      21.4359 68.6899, 21.4215 68.6952, 21.4131 68.7101, 21.4219 68.7157, 
      21.4055 68.7363, 21.4125 68.7483, 21.3915 68.7639, 21.3668 68.7672, 
      21.3256 68.7591, 21.2991 68.7623, 21.2702 68.7797, 21.2536 68.8022, 
      21.2259 68.816, 21.1842 68.8252, 21.1713 68.8336, 21.1447 68.84, 
      21.1295 68.853, 21.078 68.8649, 21.0771 68.8712, 20.9908 68.8973, 
      20.9156 68.8971, 20.9034 68.8998, 20.8802 68.9186, 20.8527 68.9232, 
      20.8452 68.9372, 20.8712 68.9433, 20.8916 68.9414, 20.9137 68.9603, 
      20.9116 68.9688, 20.8838 68.983, 20.8353 68.9958, 20.8134 69.0171, 
      20.775 69.0326, 20.7188 69.0397, 20.7027 69.0444, 20.6594 69.0432, 
      20.5778 69.0526, 20.5486 69.0599, 20.303 69.0526, 20.06 69.0457, 
      20.2378 68.956, 20.3065 68.9261, 20.3218 68.8556, 20.3358 68.8023, 
      20.2738 68.7402, 20.2028 68.6659, 20.0523 68.591, 19.9375 68.5579, 
      20.0258 68.5308, 20.2266 68.4908, 20.1106 68.4438, 19.978 68.3881, 
      19.9213 68.356, 19.7079 68.3938, 19.2685 68.4688, 18.9838 68.5169, 
      18.6212 68.5069, 18.4855 68.5564, 18.4056 68.5818, 18.1259 68.5365, 
      18.1009 68.406, 18.1146 68.3405, 18.1513 68.1987, 18.0958 68.1461, 
      18.0523 68.1082, 17.8998 67.9693, 18.1902 67.8942, 18.3518 67.8543, 
      18.7832 67.852, 18.8374 67.8488, 18.8521 67.8445, 19.005 67.8571, 
      19.0811 67.8513, 19.1304 67.85, 19.1791 67.8508, 19.2376 67.8481, 
      19.322 67.8563, 19.408 67.8521, 19.4511 67.8464, 19.4844 67.8376, 
      19.5383 67.8322, 19.6357 67.828, 19.6418 67.8209, 19.702 67.8132, 
      19.7813 67.8149, 19.8127 67.8013, 19.9217 67.7835, 19.9733 67.7768, 
      20.0003 67.771, 20.091 67.7418, 20.1528 67.7162, 20.2188 67.6891, 
      20.2911 67.6754, 20.3639 67.6591, 20.3925 67.6544, 20.4436 67.6487, 
      20.5148 67.6284, 20.5474 67.6201, 20.5881 67.6079, 20.6616 67.577, 
      20.7431 67.5484, 20.8267 67.5195, 20.9112 67.4935, 21.0383 67.4546, 
      21.1603 67.4063, 21.1908 67.3843, 21.2944 67.3486, 21.4553 67.3206, 
      21.4702 67.324, 21.5813 67.2917, 21.6621 67.2737, 21.7582 67.2653, 
      21.8702 67.2922, 21.9621 67.3562
      ))'), 4326))`,
      ["Municipality area"]
    );
  }
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
        location: [{ lat: 68.4, lng: 21.3 }],
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
      });
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
        location: [{ lat: 68.4, lng: 21.3 }],
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
      .expect(422);
  });

  test("POST /kirunaexplorer/documents - document with out of bounds point", async () => {
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
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("POST /kirunaexplorer/documents - document with correct area", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 23 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(200);
  });

  test("POST /kirunaexplorer/documents - document with area with only one out of bounds point", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 24 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("POST /kirunaexplorer/documents - document with area with all out of bounds points", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 5.4, lng: 8.0 },
      { lat: 6.0, lng: 9.5 },
      { lat: 7.4, lng: 10.0 },
      { lat: 8.6, lng: 11.8 },
      { lat: 5.4, lng: 8.0 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("POST /kirunaexplorer/documents - document with area with open polygon", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 23 },
      { lat: 69, lng: 21.5 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe(
          "The polygon must be closed (first and last points must be identical)"
        );
      });
  });

  test("POST /kirunaexplorer/documents - document with area with not enough points", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe("Location must be an array with at least 3 points.");
      });
  });

  test("POST /kirunaexplorer/documents - document with area with out of range points", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 23 },
      { lat: 68.3, lng: 190 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .post(`${routePath}/documents`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        title: "this is a title",
        description: "This is a description",
        type_id: test_obj.type1,
        issue_date: "01/01/2020",
        scale: "blueprints/effects",
        location: testLocation,
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
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe(
          "Each point in location must have a valid value of 'lat' and 'lng'"
        );
      });
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
        location: [{ lat: 68.4, lng: 21.3 }],
      })
      .expect(200);
    await request(app)
      .get(`${routePath}/documents/${test_obj.document1.id}`)
      .set("Cookie", urbanPlannerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.location).toEqual([{ lat: 68.4, lng: 21.3 }]);
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
      .expect(400);
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

  test("PUT /kirunaexplorer/documents/location - document with out of bounds point", async () => {
    const test_obj = await retrieveInitialData();
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: [{ lat: 5.0, lng: 8.0 }],
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("PUT /kirunaexplorer/documents/location - document with correct area", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 23 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(200);
  });

  test("PUT /kirunaexplorer/documents/location - document with area with only one out of bounds point", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 24 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("PUT /kirunaexplorer/documents/location - document with area with all out of bounds point", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 5.4, lng: 8.0 },
      { lat: 6.0, lng: 9.5 },
      { lat: 7.4, lng: 10.0 },
      { lat: 8.6, lng: 11.8 },
      { lat: 5.4, lng: 8.0 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(
          "The document location can't exceed the municipality area's boundaries"
        );
      });
  });

  test("PUT /kirunaexplorer/documents/location - document with area with open polygon", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.3, lng: 23 },
      { lat: 69, lng: 21.5 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe(
          "The polygon must be closed (first and last points must be identical)"
        );
      });
  });

  test("PUT /kirunaexplorer/documents/location - document with area with not enough points", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe("Location must be an array with at least 3 points.");
      });
  });

  test("PUT /kirunaexplorer/documents/location - document with area with out of range points", async () => {
    const test_obj = await retrieveInitialData();
    const testLocation = [
      { lat: 68, lng: 21.5 },
      { lat: 68.4, lng: 21.3 },
      { lat: 68.6, lng: 190 },
      { lat: 68, lng: 21.5 },
    ];
    await request(app)
      .put(`${routePath}/documents/location`)
      .set("Cookie", urbanPlannerCookie)
      .send({
        id: test_obj.document1.id,
        location: testLocation,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0].msg).toBe(
          "Each point in location must have a valid value of 'lat' and 'lng'"
        );
      });
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
        end_year: "2022",
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
        end_year: "2022",
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
        end_year: "2022",
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
        end_year: "2022",
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid scales", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        scales: ["invalid"],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid types", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        types: ["invalid"],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid languages", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        languages: ["invalid"],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid stakeholders", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        stakeholders: ["invalid"],
      })
      .expect(422);
  });

  test("POST /kirunaexplorer/documents/filtered - invalid municipality", async () => {
    await request(app)
      .post(`${routePath}/documents/filtered?page=1&size=5&sort=title%3Aasc`)
      .send({
        municipality: "invalid",
      })
      .expect(422);
  });
});
