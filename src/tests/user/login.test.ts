import app from '../../index.js';
import request from 'supertest';
import { AppDataSource } from '../../config/database.js';
import { faker } from '@faker-js/faker';

const randomUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
};

const loginEndpoint = '/api/users/login';

beforeAll(async () => {
  await AppDataSource.initialize();
  await request(app).post('/api/users/register').send(randomUser);
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  await AppDataSource.query('BEGIN');
});

afterEach(async ()=> {
  await AppDataSource.query('ROLLBACK');

})

describe('user login tests', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app).post(loginEndpoint).send({
      email: randomUser.email,
      password: randomUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Login successful');
    expect(res.body.token).toBeTruthy();
  });

  it('should return 401 for wrong email', async () => {
    const res = await request(app).post(loginEndpoint).send({
      email: 'wrong@email.com',
      password: randomUser.password,
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Login credentials are wrong');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app).post(loginEndpoint).send({
      email: randomUser.email,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Login credentials are wrong');
  });

  it('should return 400 for missing email', async () => {
    const res = await request(app).post(loginEndpoint).send({
      password: randomUser.password,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('"email" is required');
  });

  it('should return 400 for missing password', async () => {
    const res = await request(app).post(loginEndpoint).send({
      email: randomUser.email,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('"password" is required');
  });
});
