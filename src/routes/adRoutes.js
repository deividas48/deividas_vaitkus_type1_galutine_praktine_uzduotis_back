import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const adsRouter = express.Router();

const adsColumns = 'id, title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published, main_image_url_1, main_image_url_2, main_image_url_3';

// GET /api/ads - grazina visus skelbimus
adsRouter.get('/', async (_req, res) => {
  // Use the dbQueryWithData function to get the data
  const sql = `SELECT skelbimai.id, skelbimai.title, skelbimai.main_image_url, skelbimai.description, skelbimai.price, skelbimai.phone, skelbimai.type, skelbimai.town_id, skelbimai.user_id, skelbimai.category_id, skelbimai.is_published, skelbimai.main_image_url_1, skelbimai.main_image_url_2, skelbimai.main_image_url_3 FROM skelbimai`;
  const [row, error] = await dbQueryWithData(sql); // gauti duomenys is DB.
  // If there is an error, return it
  if (error) {
    console.warn('get all ads error ===', error);
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
    id,
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
    is_published,
    main_image_url_1,
    main_image_url_2,
    main_image_url_3,
  } = req.body;

  const argArr = [
    id,
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
    is_published,
    main_image_url_1,
    main_image_url_2,
    main_image_url_3,
  ];

  const sql = `INSERT INTO skelbimai (${adsColumns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
adsRouter.delete('/:adID', async (req, res) => {
  // Extracting adID from the route parameters
  const adId = req.params.adID;
  const currentBody = req.body;
  // Use the dbQueryWithData function to get the data
  const sql1 = 'SELECT * FROM skelbimai WHERE id = ?';
  const [row1, error1] = await dbQueryWithData(sql1, [adId]); // gauti duomenys is DB.
  // If there is an error, return it
  if (error1) {
    console.log('error1 ===', error1);
    return res.status(500).json('cannot access');
  }
  console.log('row1 ===', row1);
  const adUserId = row1[0].user_id;

  // Grąžins 404, jei nėra įrašo su tokiu ID
  if (row1.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // jei vartotojas nėra skelbimo savininkas, grąžina 401
  // console.log('Prisijungusio vartotojo ID: ', req.body.userId.toString());
  // Prisijungusio vartotojo ID
  // console.log('Skelbimo savininko ID:', adUserId); // Skelbimo savininko ID
  // if (currentBody.userId !== adUserId) {
  //   return res.status(401).json({ error: 'only owner can delete' });
  // }

  const sql2 = 'UPDATE skelbimai SET is_published=0 WHERE id=? LIMIT 1';

  const [row2, error2] = await dbQueryWithData(sql2, [adId]);

  if (error2) {
    console.warn('ištrinamas įrašas pakeičiant is_published į 0 ===', error2);
    console.warn('error ===', error2.message);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // if (row2.affectedRows === 0) {
  //   console.log('no rows');
  //   return res.status(404).json({ error: `ap with id: '${adId}' was not found` });
  // }

  res.json({ msg: `ad with id '${adId}' was deleted` });
});

export default adsRouter;
