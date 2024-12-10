import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { configs } from './env.js';
import { User } from '../entities/User.js';
import { News } from '../entities/News.js';
import { Bookmark } from '../entities/Bookmark.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configs.database.POSTGRES_HOST,
  port: configs.database.POSTGRES_PORT,
  username: configs.database.POSTGRES_USER,
  password: configs.database.POSTGRES_PASSWORD,
  database: configs.database.POSTGRES_DB,
  entities: [User, News, Bookmark],
  synchronize: true,
  logging: true,
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to Database');
  } catch (error) {
    console.error('Error in connecting to Database', error);
  }
};
