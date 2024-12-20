import type { Request, Response } from 'express';
import { AppDataSource } from './config/database.js';

const health = async (req: Request, res: Response) => {
  try {
    if (AppDataSource.isInitialized) {
      res.status(200).send({ status: 'UP', message: 'Service is healthy' });
      return;
    } else {
      res
        .status(500)
        .send({ status: 'DOWN', message: 'Database connection lost' });
      return;
    }
  } catch (error: any) {
    res.status(500).send({
      status: 'DOWN',
      message: 'Healthy check failed',
      error: error.message,
    });
  }
};

export default { health };
