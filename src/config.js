// src\config.js

import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config(); // Defaults to loading .env in development
}

// Environment-based .env file
const whichEnv = process.env.NODE_ENV === 'production'
  ? dotenv.config({ path: '.env.production' })
  : dotenv.config();

export const dbConfig = {
  user: whichEnv.parsed.DB_USER,
  password: whichEnv.parsed.DB_PASS,
  host: whichEnv.parsed.DB_HOST,
  database: whichEnv.parsed.DB_DATABASE,
  port: whichEnv.parsed.DB_PORT,
};

export const { PORT } = process.env;

// console.log('dbConfig ===', dbConfig, process.env.NODE_ENV);
