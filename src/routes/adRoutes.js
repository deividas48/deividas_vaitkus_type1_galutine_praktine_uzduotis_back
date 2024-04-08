import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const adsRouter = express.Router();

const adsColumns = 'title, main_image_url, description, price, phone, type, town_id, user_id, category_id';

// GET /api/ads - grazina visus skelbimus
adsRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${adsColumns} FROM skelbimai`;
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
adsRouter.get('/:adID', async (req, res) => {
  // Extracting adID from the route parameters
  const adId = req.params.adID;
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${adsColumns} FROM skelbimai WHERE is_published = 1 AND id = ?`;
  const [row, error] = await dbQueryWithData(sql, [adId]); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get one row error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // Grąžins 404, jei nėra įrašo su tokiu ID
  if (row.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // Return the found ad
  res.json(row);
});

// POST /api/ads - sukuria nauja skelbima
adsRouter.post('/', async (req, res) => {
  // Destructure the request body
  const {
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
  } = req.body;

  const argArr = [
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id];

  const sql = `INSERT INTO skelbimai (${adsColumns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [row, error] = await dbQueryWithData(sql, argArr); // gauti duomenys is DB.

  // If there is an error, return it
  if (error) {
    console.warn('post rows error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  // Return the created ad by filling columns
  res.json({ id: row.insertId, ...req.body });
});

// DELETE /api/ads/:id - istrina skelbima (is_published = false)


export default adsRouter;
