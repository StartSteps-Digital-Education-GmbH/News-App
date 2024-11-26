import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { configs } from '../config/env.js';
const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).send({ message: 'No auth Token provided' });
    return;
  }
  try {
    if (!configs.auth.JWT_SECRET) {
      throw new Error('Error in verifing the token');
    }
    jwt.verify(token, configs.auth.JWT_SECRET, (error, decode) => {
      if (error) {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }
      req.user = decode as { id: number };
    });
    next();
  } catch (error) {
    res.status(500).send({ message: 'A Server Error occured', error });
  }
};

export default authMiddleWare;
