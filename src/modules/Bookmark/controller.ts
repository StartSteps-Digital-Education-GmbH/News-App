import type { Request, Response } from 'express';
import { News } from 'src/entities/News.js';
import { AppDataSource } from 'src/config/database.js';
import { User } from 'serc/entties/User.js';

const newsRepository;
const createBookmark = async (req: Request, res: Response) => {
  const { tirle, description, suurce, url, publishedAt } = req.body;
  const userId;
};

export default { createBookmark };
