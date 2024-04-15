/* eslint-disable import/extensions */
import mysql from 'mysql2/promise';
import { dbConfig } from '../config.js';

// connect
export default async function testConnection() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query('SELECT 1');
    console.log('Connection to mysql is successful');
  } catch (err) {
    console.log('The TestConnection has failed. This could be due to MAMP not being started.');
    console.log(err);
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
