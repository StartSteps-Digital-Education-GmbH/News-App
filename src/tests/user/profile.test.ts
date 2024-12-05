import request from 'supertest';
import { faker, ne } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import app from '../../index.js';
import { AppDataSource } from '../../config/database.js';
import { User } from '../../entities/User.js';
import { configs } from '../../config/env.js';

let userAcessingProfile: Partial<User>;
let validToken: string;
let expiredToken: string;
let invalidToken: string;
let validTokenForNotRegisteredUser: string;
const getUserProfileURL = '/api/users/profile';

beforeAll(async () => {
  const userRepository = AppDataSource.getRepository(User);
  await AppDataSource.initialize();

  const newUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };

  const response = await request(app).post('/api/users/register').send(newUser);

  if (response.status !== 201) {
    throw new Error('Error in register the user');
  }

  const registeredUser = await userRepository.findOneBy({
    email: newUser.email,
  });

  if (registeredUser) {
    userAcessingProfile = {
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      password: newUser.password,
    };
  }

  if (!userAcessingProfile) {
    throw new Error('User was not saved in the database');
  }

  if (!configs.auth.JWT_SECRET) {
    throw new Error('Error in verifing the token');
  }

  const loggedUser = await request(app)
    .post('/api/users/login')
    .send({ email: userAcessingProfile.email, password: userAcessingProfile.password });

  if (loggedUser.status !== 200) {
    throw new Error('Error in login the user');
  }

  validToken = loggedUser.body.token;
  validTokenForNotRegisteredUser = jwt.sign(
    { id: faker.number.int({max: 1000000}) },
    configs.auth.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );
  invalidToken = jwt.sign({ id: userAcessingProfile.id }, 'invalidJWTSecret', {
    expiresIn: '1h',
  });
  expiredToken = jwt.sign(
    { id: userAcessingProfile.id },
    configs.auth.JWT_SECRET,
    {
      expiresIn: '-1s',
    },
  );
});

afterAll(async () => {
  await AppDataSource.getRepository(User).delete({email: userAcessingProfile.email});
  await AppDataSource.destroy();
});

describe('User profile test', () => {
  it('should retrive a user profile when a valid token is sent', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      id: userAcessingProfile.id,
      email: userAcessingProfile.email,
      name: userAcessingProfile.name,
    });
  });

  it('should not retrive a user profile when a user is not found', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${validTokenForNotRegisteredUser}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should not retrive a user profile when a token is not sent', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer `);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No auth Token provided');
  });

  it('should not retrive a user profile when a invalid token is sent', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });

  it('should not retrive a user profile when the token is expired', async () => {
    const res = await request(app)
      .get(getUserProfileURL)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token has expired');
  });
});
