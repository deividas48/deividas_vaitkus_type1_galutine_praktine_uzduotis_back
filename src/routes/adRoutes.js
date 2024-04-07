import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const adsRouter = express.Router();

// GET /api/ads - grazina visus skelbimus
adsRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = 'SELECT * FROM skelbimai';
  const [row, error] = await dbQueryWithData(sql); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get all trips error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  console.log('row ===', row[0]);
  // Return all ads in a form of object
  res.json(row);
});

// GET /api/ads/:id - grazina viena skelbima
// POST /api/ads - sukuria nauja skelbima
// DELETE /api/ads/:id - istrina skelbima (is_published = false)

export default adsRouter;
