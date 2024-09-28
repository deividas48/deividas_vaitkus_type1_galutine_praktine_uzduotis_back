// src\routes\userRoutes\userRoutes.js

import express from 'express';
import dbQueryWithData from '../../helper/helper.js';

const userRouter = express.Router();

const usersColumns = 'id, name, email, password, avatar_url';

// GET /api/users - grazina visus skelbimus
userRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${usersColumns} FROM vartotojai`;
  const [row, error] = await dbQueryWithData(sql); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get all users error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  console.log('row ===', row[0]);
  // Return all users in a form of object
  res.json(row);
});

// GET /api/users/:id - grazina viena skelbima
userRouter.get('/:userID', async (req, res) => {
  // Extracting userID from the route parameters
  const userId = req.params.userID;
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${usersColumns} FROM vartotojai WHERE id = ?`;
  const [row, error] = await dbQueryWithData(sql, [userId]); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get one row error ===', error);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // Grąžins 404, jei nėra įrašo su tokiu ID
  if (row.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // Return the found user
  res.json(row);
});

// POST /api/users - sukuria nauja skelbima
userRouter.post('/', async (req, res) => {
  // Destructure the request body
  const {
    name, email, password, avatar_url,
  } = req.body;

  const argArr = [name, email, password, avatar_url];

  const sql = `INSERT INTO vartotojai (${usersColumns}) VALUES (NULL, ?, ?, ?, ?)`;
  const [row, error] = await dbQueryWithData(sql, argArr); // gauti duomenys is DB.

  // If there is an error, return it
  if (error) {
    console.warn('post rows error ===', error);
    return res.status(400).json(error.message);
  }
  // Return the created user by filling columns
  res.json({ id: row.insertId, ...req.body });
});

// DELETE /api/users/:id - istrina skelbima (is_published = false)
userRouter.delete('/:userID', async (req, res) => {
  // Extracting userID from the route parameters
  const userId = req.params.userID;

  // First, check if the user exists
  const sql1 = 'SELECT * FROM vartotojai WHERE id = ?';
  const [row1, error1] = await dbQueryWithData(sql1, [userId]);
  // If there is an error in fetching, return it
  if (error1) {
    console.log('error1 ===', error1);
    return res.status(500).json('cannot access');
  }
  console.log('row1 ===', row1);

  // If no user found, return 404
  if (row1.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // If a user is found, proceed with deletion
  const sql2 = 'DELETE FROM vartotojai WHERE id=?';
  const [row2, error2] = await dbQueryWithData(sql2, [userId]);

  // If there is an error in deletion, return it
  if (error2) {
    console.warn('error ===', error2.message);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // After successful deletion, return a confirmation message
  res.json({ msg: `user with id '${userId}' was deleted` });
});

export default userRouter;
