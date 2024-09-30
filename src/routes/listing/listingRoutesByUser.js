// src/routes/listing/listingRoutesByUser.js

import express from 'express';
import dbQueryWithData from '../../helper/helper.js';

const listingsRouterByUser = express.Router();

const listingsColumns = 'title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published, main_image_url_1, main_image_url_2, main_image_url_3';

// GET /api/listings/byUser/:userID - returns a single user listings

// #1_Get. Extracting userID from the route parameters (page link parameter)
listingsRouterByUser.get('/byUser/:userID', async (req, res) => {
  // #1.1_Get. Get the parameter from the front-end.
  const { userID } = req.params;
  // #1.2_Get. Before dbQueryWithData function, create a SQL
  // query to get the listings of single user.
  const sql = `SELECT
    ${listingsColumns},
    miestai.name AS town_name,
    kateogrijos.name AS category_name,
    vartotojai.avatar_url AS user_photo,
    vartotojai.name AS user_name,
    vartotojai.email AS user_email
FROM
    skelbimai
LEFT JOIN miestai ON skelbimai.town_id = miestai.id
LEFT JOIN kateogrijos ON skelbimai.category_id = kateogrijos.id
LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
WHERE
    is_published = 1 AND vartotojai.id = ?`;
  // #1.3_Get. Use the dbQueryWithData function to get the data from the database.
  const [row, error] = await dbQueryWithData(sql, [userID]); // Get data from DB.
  // #1.4_Get. If there is an error by getting data, return it.
  if (error) {
    console.warn('get one row error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: error.message });
  }

  // #1.5_Get. Return 404 if no record with the given ID
  if (row.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // #1.6_Get. Return the listing (skelbimą) as an object. This is the response to the client.
  res.json(row);
});

export default listingsRouterByUser;
