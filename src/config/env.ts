import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env';
dotenv.config({ path: envFile });

export const configs = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  database: {
    POSTGRES_HOST: process.env.POSTGRES_HOST || 'postgres',
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432'),
    POSTGRES_USER: process.env.POSTGRES_USER || 'news_admin',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'news_admin',
    POSTGRES_DB: process.env.POSTGRES_DB || 'news_app_db',
  },
  auth: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
