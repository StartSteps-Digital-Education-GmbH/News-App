import app from '../../index.js';
import request from 'supertest';
import { AppDataSource } from '../../config/database.js';
import { faker } from '@faker-js/faker';

const randomUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
};

const registerEndpoint = '/api/users/register';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('User Register Tests', () => {
  it('should register a User', async () => {
    const res = await request(app).post(registerEndpoint).send(randomUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });
});
