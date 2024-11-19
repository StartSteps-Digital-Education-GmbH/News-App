import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    PORT: process.env.PORT || 5000,
}