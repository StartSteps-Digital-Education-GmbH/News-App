import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../../entities/User.js';
import { AppDataSource } from '../../config/database.js';
import { configs } from '../../config/env.js';

const userRepository = AppDataSource.getRepository(User);

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await userRepository.findOneBy({ email });
    if (userExists) {
      res.status(409).send({ message: 'Email is already taken' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error in creating the user', error });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userExists = await userRepository.findOneBy({ email });

    if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
      res.status(401).send({ message: 'Login credentials are wrong' });
      return;
    }
    if (!configs.auth.JWT_SECRET) {
      throw new Error('Error in generating token');
    }
    const token = jwt.sign({ id: userExists.id }, configs.auth.JWT_SECRET, {
      expiresIn: '1h',
    });
    //TODO: Refresh Token
    res.status(200).send({ message: 'Login successfull', token });
  } catch (error) {
    res.status(500).send({ message: 'Error in login the user', error });
  }
};

const profile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ message: 'Error in getting user Profile', error });
  }
};

export default { register, login, profile };
