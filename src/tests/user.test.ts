import request from 'supertest';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import app from '../index.js';
import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { configs } from '../config/env.js';

let randomUser: User;
let validToken: string;
let expiredToken: string;
let invalidToken: string;
const getUserProfileURL = '/api/users/profile';

beforeAll(async () => {
  await AppDataSource.initialize();

  const newUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };
  const savedUser = await AppDataSource.getRepository(User).save(newUser);
  randomUser = savedUser;

  validToken = jwt.sign({ userId: randomUser.id }, configs.auth.JWT_SECRET, {
    expiresIn: '1h',
  });
  expiredToken = jwt.sign({ userId: randomUser.id }, configs.auth.JWT_SECRET, {
    expiresIn: '-1h',
  });
  invalidToken = jwt.sign({ userId: 9999 }, configs.auth.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await AppDataSource.getRepository(User).delete({});
  await AppDataSource.destroy();
});

describe('User test', () => {
  const randomUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };

  it('should register a user', async () => {
    const res = await request(app).post('/api/users/register').send(randomUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered');
  });
});

describe('User profile test', () => {
  it('should retrive a user profile when a valid token is sent', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      id: randomUser.id,
      email: randomUser.email,
      name: randomUser.name,
    });
  });

  it('should not retrive a user profile when a token is not sent', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer `);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No auth token provided');
  });

  it('should not retrive a user profile when a user is not found', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not founf');
  });

  it('should not retrive a user profile when the token is expired', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token has expired');
  });
});