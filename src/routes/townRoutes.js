import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const townsRouter = express.Router();

const townsColumns = 'name, population, area';

// GET /api/towns - grazina visus skelbimus
townsRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${townsColumns} FROM miestai`;
  const [row, error] = await dbQueryWithData(sql); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get all towns error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  console.log('row ===', row[0]);
  // Return all towns in a form of object
  res.json(row);
});

// GET /api/towns/:id - grazina viena skelbima
townsRouter.get('/:townID', async (req, res) => {
  // Extracting townID from the route parameters
  const townId = req.params.townID;
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT ${townsColumns} FROM miestai WHERE id = ?`;
  const [row, error] = await dbQueryWithData(sql, [townId]); // gauti duomenys is DB.
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

  // Return the found town
  res.json(row);
});

// POST /api/towns - sukuria nauja skelbima
townsRouter.post('/', async (req, res) => {
  // Destructure the request body
  const {
    // id,
    name,
    population,
    area,
  } = req.body;

  const argArr = [
    // id,
    name,
    population,
    area];

  const sql = `INSERT INTO miestai (${townsColumns}) VALUES (?, ?, ?)`;
  const [row, error] = await dbQueryWithData(sql, argArr); // gauti duomenys is DB.

  // If there is an error, return it
  if (error) {
    console.warn('post rows error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: 'something went wrong' });
  }
  // Return the created town by filling columns
  res.json({ id: row.insertId, ...req.body });
});

// DELETE /api/towns/:id - istrina skelbima (is_published = false)
townsRouter.delete('/:townID', async (req, res) => {
  // Extracting townID from the route parameters
  const townId = req.params.townID;

  // First, check if the town exists
  const sql1 = 'SELECT * FROM miestai WHERE id = ?';
  const [row1, error1] = await dbQueryWithData(sql1, [townId]);
  // If there is an error in fetching, return it
  if (error1) {
    console.log('error1 ===', error1);
    return res.status(500).json('cannot access');
  }
  console.log('row1 ===', row1);

  // If no town found, return 404
  if (row1.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // If a town is found, proceed with deletion
  const sql2 = 'DELETE FROM miestai WHERE id=?';
  const [row2, error2] = await dbQueryWithData(sql2, [townId]);

  // If there is an error in deletion, return it
  if (error2) {
    console.warn('error ===', error2.message);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // After successful deletion, return a confirmation message
  res.json({ msg: `town with id '${townId}' was deleted` });
});

export default townsRouter;
