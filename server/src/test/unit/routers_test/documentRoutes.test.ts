import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../../index";
import * as db from "../../db/db";
import DocumentDAO from "../../dao/documentDAO";
import StakeholderDAO from "../../dao/stakeholderDAO";
import TypeDAO from "../../dao/typeDAO";
import Type from "../../models/type";
import Stakeholder from "../../models/stakeholder";
import dotenv from "dotenv";

const routePath = "/kirunaexplorer";

const urbanPlanner = {
  username: "urbanplanner",
  email: "urbanplanner@gmail.com",
  password: "urbanplanner",
  role: "Urban Planner",
};

dotenv.config({ path: "./.env.test" });

let urbanPlannerCookie: string;

const postUser = async (userInfo: any) => {
  await request(app).post(`${routePath}/users`).send(userInfo).expect(200);
};

const login = async (userInfo: any) => {
  const userCredentials = {
    email: userInfo.email,
    password: userInfo.password,
  };
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`${routePath}/sessions`)
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.header["set-cookie"][0]);
      });
  });
};

const retrieveInitialData = async () => {
  const stakeholderDao = new StakeholderDAO();
  const typeDao = new TypeDAO();
  const documentDAO = new DocumentDAO();

  const types = await typeDao.getTypes();
  const stakeholders = await stakeholderDao.getStakeholders();

  const type1 = types[0] as Type;
  const stakeholder1 = stakeholders[0] as Stakeholder;

  await documentDAO.createDocument(
    "title1",
    "description1",
    type1.id,
    "2022-01-01",
    "scale1",
    "",
    "en",
    "10",
    [stakeholder1.id]
  );

  const documents = await documentDAO.getDocumentsNames();
  return {
    type1: type1.id,
    stakeholder1: stakeholder1.id,
    document1: documents[0],
  };
};

beforeAll(async () => {
  await db.init();
  await db.cleanup();
  await postUser(urbanPlanner);
  urbanPlannerCookie = await login(urbanPlanner);

  await db.query("INSERT INTO types (name) VALUES ($1)", ["type1"]);
  await db.query("INSERT INTO stakeholders (name) VALUES ($1)", [
    "stakeholder1",
  ]);
});

afterAll(async () => {
  await db.cleanup();
  await db.pool.end();
});

describe("DocumentRoutes Tests", () => {
  describe("POST /kirunaexplorer/documents", () => {
    test("POST /kirunaexplorer/documents - success with Point location", async () => {
      const testData = await retrieveInitialData();
      const response = await request(app)
        .post(`${routePath}/documents`)
        .set("Cookie", urbanPlannerCookie)
        .send({
          title: "Point Document",
          description: "Point location document",
          type_id: testData.type1,
          issue_date: "01/01/2023",
          scale: "1:500",
          location: [{ lat: 65.583, lng: 22.183 }],
          language: "en",
          pages: "100",
          stakeholders: [testData.stakeholder1],
        });

      expect(response.status).toBe(200);
    });

    test("POST /kirunaexplorer/documents - success with Polygon location", async () => {
      const testData = await retrieveInitialData();
      const response = await request(app)
        .post(`${routePath}/documents`)
        .set("Cookie", urbanPlannerCookie)
        .send({
          title: "Polygon Document",
          description: "Polygon location document",
          type_id: testData.type1,
          issue_date: "01/01/2023",
          scale: "1:500",
          location: [
            { lat: 65.583, lng: 22.183 },
            { lat: 65.584, lng: 22.184 },
            { lat: 65.585, lng: 22.185 },
            { lat: 65.583, lng: 22.183 },
          ],
          language: "en",
          pages: "100",
          stakeholders: [testData.stakeholder1],
        });

      expect(response.status).toBe(200);
    });

    test("POST /kirunaexplorer/documents - invalid date format", async () => {
      const testData = await retrieveInitialData();
      const response = await request(app)
        .post(`${routePath}/documents`)
        .set("Cookie", urbanPlannerCookie)
        .send({
          title: "Invalid Date Document",
          description: "Invalid date format",
          type_id: testData.type1,
          issue_date: "invalid-date",
          scale: "1:500",
          location: [{ lat: 65.583, lng: 22.183 }],
          language: "en",
          pages: "100",
          stakeholders: [testData.stakeholder1],
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Issue date must be in the format DD/MM/YYYY or MM/YYYY or YYYY.",
          }),
        ])
      );
    });

    test("POST /kirunaexplorer/documents - missing required field (title)", async () => {
      const testData = await retrieveInitialData();
      const response = await request(app)
        .post(`${routePath}/documents`)
        .set("Cookie", urbanPlannerCookie)
        .send({
          description: "Missing title",
          type_id: testData.type1,
          issue_date: "01/01/2023",
          scale: "1:500",
          location: [{ lat: 65.583, lng: 22.183 }],
          language: "en",
          pages: "100",
          stakeholders: [testData.stakeholder1],
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            param: "title",
            msg: "Title must not be empty.",
          }),
        ])
      );
    });
  });

  describe("GET /kirunaexplorer/documents/names", () => {
    test("GET /kirunaexplorer/documents/names - success", async () => {
      const response = await request(app)
        .get(`${routePath}/documents/names`)
        .set("Cookie", urbanPlannerCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("title");
      }
    });
  });

  describe("GET /kirunaexplorer/documents/:id", () => {
    test("GET /kirunaexplorer/documents/:id - success", async () => {
      const testData = await retrieveInitialData();
      const response = await request(app)
        .get(`${routePath}/documents/${testData.document1.id}`)
        .set("Cookie", urbanPlannerCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", testData.document1.title);
      expect(response.body).toHaveProperty("description");
    });

    test("GET /kirunaexplorer/documents/:id - invalid id format", async () => {
      const response = await request(app)
        .get(`${routePath}/documents/invalid_id`)
        .set("Cookie", urbanPlannerCookie);

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            param: "id",
            msg: "Param id must be a number greater than 0.",
          }),
        ])
      );
    });

    test("GET /kirunaexplorer/documents/:id - non-existent id", async () => {
      const response = await request(app)
        .get(`${routePath}/documents/9999`) // Assuming 9999 does not exist
        .set("Cookie", urbanPlannerCookie);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("The document does not exist");
    });
  });

  describe("GET /kirunaexplorer/documents/location", () => {
    test("GET /kirunaexplorer/documents/location - success", async () => {
      const response = await request(app)
        .get(`${routePath}/documents/location`)
        .set("Cookie", urbanPlannerCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("type");
        expect(response.body[0]).toHaveProperty("location");
      }
    });
  });
});
