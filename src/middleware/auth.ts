import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { configs } from '../config/env.js';

const userRepository = AppDataSource.getRepository(User);
const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).send({ message: 'No auth Token provided' });
    return;
  }
  try {
    if (!configs.auth.JWT_SECRET) {
      throw new Error('Error in verifying the token');
    }

    const decode = jwt.verify(token, configs.auth.JWT_SECRET) as { id: number };
    const user = await userRepository.findOneBy({ id: decode.id });
    if (!user) {
      res.status(401).send({ message: 'Invalid token: User not found' });
      return;
    }
    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (error: any) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).send({ message: 'Token has expired' });
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }
    }
    res.status(500).send({ message: 'A Server Error occured', error });
    return;
  }
};

export default authMiddleWare;
