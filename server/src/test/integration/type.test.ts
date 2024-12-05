import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../../index";
import * as db from "../../db/db";
import { cleanup } from "../../db/db";

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

describe("GET kirunaexplorer/types", () => {
  test("GET /kirunaexplorer/types - success", async () => {
    await request(app)
      .get(`${routePath}/types`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(3);
        expect(res.body.some((type: any) => type.name === "type1")).toBe(true);
        expect(res.body.some((type: any) => type.name === "type2")).toBe(true);
        expect(res.body.some((type: any) => type.name === "type3")).toBe(true);
        expect(res.body.some((type: any) => type.name === "type4")).toBe(false);
      });
  });
});

describe("POST kirunaexplorer/types", () => {
  test("POST /kirunaexplorer/types - success", async () => {
    await request(app)
      .post(`${routePath}/types`)
      .set("Cookie", urbanPlannerCookie)
      .send({ name: "type4" })
      .expect(200);

    await request(app)
      .get(`${routePath}/types`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(4);
        expect(res.body.some((type: any) => type.name === "type4")).toBe(true);
      });
  });

  test("POST /kirunaexplorer/types - Type already exists", async () => {
    await request(app)
      .post(`${routePath}/types`)
      .set("Cookie", urbanPlannerCookie)
      .send({ name: "type1" })
      .expect(409)
      .expect((res) => {
        expect(res.body.error).toBe("A type with this name already exists");
      });
  });

  test("POST /kirunaexplorer/types - Not logged in", async () => {
    await request(app)
      .post(`${routePath}/types`)
      .send({ name: "type4" })
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe("Unauthenticated user");
      });
  });

  test("POST /kirunaexplorer/types - Not Urban Planner", async () => {
    await request(app)
      .post(`${routePath}/types`)
      .set("Cookie", residentCookie)
      .send({ name: "type4" })
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe("User is not a urban planner");
      });
  });

  test("POST /kirunaexplorer/types - Empty name", async () => {
    await request(app)
      .post(`${routePath}/types`)
      .set("Cookie", urbanPlannerCookie)
      .send({ name: "" })
      .expect(422);
  });
});
