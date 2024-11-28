import app from "../index.js"
import request from "supertest"
import { AppDataSource } from "../config/database.js"
import {faker} from '@faker-js/faker';

beforeAll(async ()=> {
    await AppDataSource.initialize();
})

afterAll(async ()=> {
    await AppDataSource.destroy();
})

describe("User Tests", () => {
    const randomUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName()
    }
    it("should register a User", async () => {
        const res = await request(app).post('/api/users/register').send(randomUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });
})