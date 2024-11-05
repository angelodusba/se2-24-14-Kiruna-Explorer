import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../../index"
import * as db from "../../db/db"
import {cleanup} from "../../db/db"
import ConnectionDAO from "../../dao/connectionDAO"
import DocumentDAO from "../../dao/documentDAO"
import StakeholderDAO from "../../dao/stakeholderDAO"
import TypeDAO from "../../dao/typeDAO"

import Type from "../../models/type"
import Stakeholder from "../../models/stakeholder"

const routePath = "/kirunaexplorer"

const urbanPlanner = {
    username: "urbanplanner",
    email: "urbanplanner@gmail.com",
    password: "urbanplanner",
    role: "Urban Planner"
}

const resident = {
    username: "resident",
    email: "resident@gmail.com",
    password: "resident",
    role: "Resident"
}

let urbanPlannerCookie: string
let residentCookie: string

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

const login = async (userInfo: any) => {
    const email = userInfo.email
    const psw = userInfo.password
    const userCredentials = { email: email, password: psw }
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userCredentials)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

beforeAll(async () => {
    await cleanup()
    await postUser(urbanPlanner)
    await postUser(resident)
    urbanPlannerCookie = await login(urbanPlanner)
    residentCookie = await login(resident)
    // Populate DB with types, stakeholders, documents
    const documentDao = new DocumentDAO();
    // Insert three types
    await db.query("INSERT INTO types (name) VALUES ($1)", ["type1"]);
    await db.query("INSERT INTO types (name) VALUES ($1)", ["type2"]);
    await db.query("INSERT INTO types (name) VALUES ($1)", ["type3"]);
    // Insert two stakeholders
    await db.query("INSERT INTO stakeholders (name) VALUES ($1)", ["stakeholder1"]);
    await db.query("INSERT INTO stakeholders (name) VALUES ($1)", ["stakeholder2"]);
    let stakeholderDao = new StakeholderDAO();
    let typeDao = new TypeDAO();

    let types = await typeDao.getTypes();
    let stakeholders = await stakeholderDao.getStakeholders();

    let type1 = types[0] as Type;
    let type2 = types[1] as Type;
    let type3 = types[2] as Type;
    let stakeholder1 = stakeholders[0] as Stakeholder;
    let stakeholder2 = stakeholders[1] as Stakeholder;
    // Insert two documents
    await documentDao.createDocument("title1", "description1", type1.id, "2022-01-01", "scale1", null as any, "language1", "pages1", [stakeholder1.id]);
    await documentDao.createDocument("title2", "description2", type2.id, "2022-01-02", "scale2", null as any, "language2", "pages2", [stakeholder2.id]);
})

afterAll(async () => {
    await cleanup();
})

describe("GET kirunaexplorer/connections", () => {
    test("GET /kirunaexplorer/connections - success", async () => {
        let documentDao = new DocumentDAO();
        let documents = await documentDao.getDocumentsNames();
        let document1 = documents[0];
        let document2 = documents[1];
        let connectionDao = new ConnectionDAO();
        // Create connection
        await connectionDao.createConnection(document1.id, document2.id, "direct_conn");
        await request(app)
            .get(`${routePath}/connections`)
            .set("Cookie", urbanPlannerCookie)
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual(
                    [
                        {
                            document_id_1: document1.id,
                            document_id_2: document2.id,
                            connection_type: "direct_conn"
                        }
                    ]
                )
            });
    });

});


