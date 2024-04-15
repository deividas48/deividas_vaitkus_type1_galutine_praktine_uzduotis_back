import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const categoriesRouter = express.Router();

// GET /api/categories - grazina visus kategorijas
categoriesRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = 'SELECT * FROM kateogrijos';
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

export default categoriesRouter;
