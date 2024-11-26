import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { configs } from '../config/env.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).send({ message: 'No auth token provided' });
    return;
  }
  try {
    if (!configs.auth.JWT_SECRET) {
      throw new Error('Error in verifing the token');
    }
    const decode = jwt.verify(token, configs.auth.JWT_SECRET);
    req.user = decode as { userId: number };
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).send({ message: 'Token has expired' });
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }
      res.status(500).send({ message: 'A server error occured', error });
    }
  }
};