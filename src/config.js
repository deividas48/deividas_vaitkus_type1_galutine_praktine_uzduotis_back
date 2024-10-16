// src\config.js

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

export const { PORT } = process.env;

// console.log('dbConfig ===', dbConfig);
