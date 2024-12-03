import app from '../index.js';
import request from 'supertest';
import { AppDataSource } from '../config/database.js';
import { faker } from '@faker-js/faker';

const randomUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
};

const login = '/api/users/login';
const registerEndpoint = '/api/users/register';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('User Tests', () => {
    it("should register a User", async () => {
        const res = await request(app).post(registerEndpoint).send(randomUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it("should not register a User with duplicate email", async () => {
        const res = await request(app).post(registerEndpoint).send(randomUser);
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Email is already taken");
    });

    it("should return 400 for a missing name", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const res = await request(app).post(registerEndpoint).send(invalidUser);
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"name" is required');
    });

    it("should return 400 for missing email", async () => {
        const invalidUser = {
            password: faker.internet.password(),
            name: faker.person.fullName(),
        };
        const res = await request(app).post(registerEndpoint).send(invalidUser);
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"email" is required');
    });

    it("should return 400 for missing password", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            name: faker.person.fullName(),
        };
        const res = await request(app).post(registerEndpoint).send(invalidUser);
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"password" is required');
    });

    it("should return 400 for invalid email format", async () => {
        const invalidUser = {
            email: "notanemail",
            password: faker.internet.password(),
            name: faker.person.fullName(),
        };
        const res = await request(app).post(registerEndpoint).send(invalidUser);
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"email" must be a valid email');
    });

    it("should return 400 for insufficient password length", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            password: "short",
            name: faker.person.fullName(),
        };
        const res = await request(app).post(registerEndpoint).send(invalidUser);
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"password" length must be at least 6 characters long');
    });

describe('user login tests', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app).post(login).send({
      email: randomUser.email,
      password: randomUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Login successful');
    expect(res.body.token).toBeTruthy();
  });

  it('should return 401 for wrong email', async () => {
    const res = await request(app).post(login).send({
      email: 'wrong@email.com',
      password: randomUser.password,
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Login credentials are wrong');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app).post(login).send({
      email: randomUser.email,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Login credentials are wrong');
  });

  it('should return 400 for missing email', async () => {
    const res = await request(app).post(login).send({
      password: randomUser.password,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('"email" is required');
  });

  it('should return 400 for missing password', async () => {
    const res = await request(app).post(login).send({
      email: randomUser.email,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('"password" is required');
  });
});
