import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../../index"
import * as db from "../../db/db"
import {cleanup} from "../../db/db"

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
    urbanPlannerCookie = await login(urbanPlanner)
})

afterAll(async () => {
    await cleanup();
    await db.pool.end();
})

describe("POST /users", () => {
    test("POST /users - success", async () => {
        // Create a resident user
        await request(app).post(`${routePath}/users`).send(resident).expect(200);

        //TODO: Uncomment and adjust the following lines once the following route is uncommented and adjusted in userRoutes.ts
        /* const users = await request(app).get(baseURL).set("Cookie", adminCookie).expect(200);
    
        expect(users.body).toHaveLength(2);
    
        let cust = users.body.find((user: any) => user.username === customer.username);
        expect(cust).toBeDefined();
        expect(cust.name).toBe(customer.name);
        expect(cust.surname).toBe(customer.surname);
        expect(cust.role).toBe(customer.role); */
    });

    test("POST /users - Username already exists", async () => {
        await request(app).post(`${routePath}/users`).send(urbanPlanner).expect(409);

        //TODO: Uncomment and adjust the following lines once the following route is uncommented and adjusted in userRoutes.ts
        //const users = await request(app).get(baseURL).set("Cookie", adminCookie).expect(200);
        //expect(users.body).toHaveLength(2);
    });

    test("POST /users - Empty username", async () => {
        await request(app)
            .post(`${routePath}/users`)
            .send({
                username: "",
                email: "urbanplanner@gmail.com",
                password: "urbanplanner",
                role: "Urban Planner"
            })
            .expect(422);
    });

    test("POST /users - Invalid email", async () => {
        await request(app)
            .post(`${routePath}/users`)
            .send({
                username: "username",
                email: "urbanplannergmail",
                password: "urbanplanner",
                role: "Urban Planner"
            })
            .expect(422);
    });

    test("POST /users - Invalid password", async () => {
        await request(app)
            .post(`${routePath}/users`)
            .send({
                username: "username",
                email: "urbanplanner@gmail.com",
                password: 123,
                role: "Urban Planner"
            })
            .expect(422);
    });

    test("POST /users - Invalid role", async () => {
        await request(app)
            .post(`${routePath}/users`)
            .send({
                username: "username",
                email: "urbanplanner@gmail.com",
                password: "urbanplanner",
                role: "something wrong"
            })
            .expect(422);
    });
});

describe("DELETE /users/:email", () => {
    test("DELETE /users/:email - success", async () => {
        await request(app).delete(`${routePath}/users/urbanplanner@gmail.com`).set("Cookie", urbanPlannerCookie).expect(200);
    });

    test("DELETE /users/:email - Unauthorized", async () => {
        await request(app).delete(`${routePath}/users/urbanplanner@gmail.com`).expect(401);
    });

    test("DELETE /users/:email - Invalid email", async () => {
        await request(app).delete(`${routePath}/users/invalid`).set("Cookie", urbanPlannerCookie).expect(422);
    });

    test("DELETE /users/:email - Non existent user", async () => {
        await request(app).delete(`${routePath}/users/idontexist@gmail.com`).set("Cookie", urbanPlannerCookie).expect(404);
    });

    test("DELETE /users/:email - Selected forbidden email", async () => {
        await request(app).delete(`${routePath}/users/resident@gmail.com`).set("Cookie", urbanPlannerCookie).expect(401);
    });
});

describe("PUT /users/:email", () => {
    test("PUT /users/:email - success", async () => {
        await postUser(urbanPlanner);
        const urbanPlannerCookie = await login(urbanPlanner);
        await request(app)
            .put(`${routePath}/users/urbanplanner@gmail.com`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "newUrbanPlanner",
                email: "newurbanplanner@gmail.com"
            })
            .expect(200)
            .expect(res => {
                expect(res.body.username).toBe("newUrbanPlanner");
                expect(res.body.email).toBe("newurbanplanner@gmail.com");
            });
    });

    test("PUT /users/:email - Unauthorized", async () => {
        await request(app)
            .put(`${routePath}/users/urbanplanner@gmail.com`)
            .send({
                username: "newUrbanPlanner",
                email: "newurbanplanner@gmail.com"
            })
            .expect(401);
    });

    test("PUT /users/:email - Invalid param email", async () => {
        await request(app)
            .put(`${routePath}/users/urbanplannergmailcom`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "newUrbanPlanner",
                email: "newurbanplanner@gmail.com"
            })
            .expect(422);
    });

    test("PUT /users/:email - Invalid body email", async () => {
        await request(app)
            .put(`${routePath}/users/urbanplanner@gmail.com`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "newUrbanPlanner",
                email: "newurbanplannergmailcom"
            })
            .expect(422);
    });

    test("PUT /users/:email - Empty body username", async () => {
        await request(app)
            .put(`${routePath}/users/urbanplanner@gmail.com`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "",
                email: "newurbanplanner@gmail.com"
            })
            .expect(422);
    });

    test("PUT /users/:email - Non existent user", async () => {
        await request(app)
            .put(`${routePath}/users/idontexist@gmail.com`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "newUrbanPlanner",
                email: "newurbanplanner@gmail.com"
            })
            .expect(404);
    });

    test("PUT /users/:email - Selected forbidden email", async () => {
        await request(app)
            .put(`${routePath}/users/resident@gmail.com`)
            .set("Cookie", urbanPlannerCookie)
            .send({
                username: "newResident",
                email: "newresident@gmail.com"
            })
            .expect(401);
    });
});

describe("POST /sessions", () => {
    test("POST /sessions - success ", async () => {
        const residentCookie = await login(resident);
        expect(residentCookie).toBeDefined();
    });

    test("POST /sessions - Invalid email", async () => {
        const invalidUser = {
            username: "invalid",
            email: "invalidgmailcom",
            password: "invalid",
            role: "Resident",
        };
        await request(app).post(`${routePath}/sessions`).send(invalidUser).expect(422);
    });

    test("POST /sessions - Empty password", async () => {
        const invalidUser = {
            username: "invalid",
            email: "invalid@gmail.com",
            password: "",
            role: "Resident",
        };
        await request(app).post(`${routePath}/sessions`).send(invalidUser).expect(422);
    });

    test("POST /sessions - Wrong credentials", async () => {
        const invalidUser = {
            username: "invalid",
            email: "invalid@gmail.com",
            password: "invalid",
            role: "Resident",
        };
        await request(app).post(`${routePath}/sessions`).send(invalidUser).expect(401);
    });
});

describe("DELETE /sessions/current", () => {
    test("DELETE /sessions/current - success", async () => {
        const residentCookie = await login(resident);

        //TODO: Uncomment and adjust the following lines once the following route is uncommented and adjusted in userRoutes.ts
        // Get current user
        /* await request(app)
            .get(`${baseURL}/${customer.username}`)
            .set("Cookie", customerCookie)
            .expect(200); */
        // Logout
        await request(app).delete(`${routePath}/sessions`).set("Cookie", residentCookie).expect(200);
        
        //TODO: Uncomment and adjust the following lines once the following route is uncommented and adjusted in userRoutes.ts
        // Expect to be unauthorized
        /* await request(app)
            .get(`${baseURL}/${customer.username}`)
            .set("Cookie", customerCookie)
            .expect(401); */
    });

    test("DELETE /sessions - already logged out", async () => {
        const residentCookie = await login(resident);
        // Logout
        await request(app).delete(`${routePath}/sessions`).set("Cookie", residentCookie).expect(200);
        // Try to logout again
        await request(app).delete(`${routePath}/sessions`).set("Cookie", residentCookie).expect(401);
    });
});

describe("GET /sessions", () => {
    test("GET /sessions - success", async () => {
        const residentCookie = await login(resident);
        await request(app)
            .get(`${routePath}/sessions`)
            .set("Cookie", residentCookie)
            .expect(200)
            .expect((res) => {
                expect(res.body.username).toBe(resident.username);
                expect(res.body.email).toBe(resident.email);
                expect(res.body.role).toBe(resident.role);
            });
    });

    test("GET /sessions - not logged in", async () => {
        await request(app).get(`${routePath}/sessions`).expect(401);
    });
});
