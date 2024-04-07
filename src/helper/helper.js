import mysql from 'mysql2/promise';
import { dbConfig } from '../config.js';

// Connect to the database and execute a query
export default async function dbQueryWithData(sql, argArr) {
  let conn;
  try {
    // Connect to the database
    conn = await mysql.createConnection(dbConfig);
    // Execute the query
    const [rows, _fields] = await conn.execute(sql, argArr);
    // Return the data
    return [rows, null];
  } catch (error) {
    // Return the error
    return [null, error];
  } finally {
    // Close the connection
    if (conn) conn.end();
  }
}
