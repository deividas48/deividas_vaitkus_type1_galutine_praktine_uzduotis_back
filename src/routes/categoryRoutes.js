// src/routes/categoryRoutes.js

import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const categoriesRouter = express.Router();

// GET /api/categories - grazina visus kategorijas
categoriesRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT * FROM kateogrijos`;
  const [row, error] = await dbQueryWithData(sql); // gauti duomenys iš DB.
  // If there is an error, return it
  if (error) {
    console.warn('get all categories error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  console.log('row ===', row[0], '...');
  // Return all categories in a form of object
  res.json(row);
});

// GET /api/categories/:id - returns a single category by ID
categoriesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM kateogrijos WHERE id = ?';
  const [row, error] = await dbQueryWithData(sql, [id]);
  if (error) {
    console.warn('get category by id error ===', error);
    return res.status(400).json({ error: 'something went wrong' });
  }
  if (row.length === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(row[0]);
});
// Purposes of '/:id':
// #category_TitleToIdentifyCategory

export default categoriesRouter;
