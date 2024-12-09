import 'express';
import type { User } from './entities/User.ts';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
