// src/routes/listing/listingRoutes.js

import express from 'express';
import multer from 'multer'; // Handles file uploads.
// import fs from 'fs'; // fs: Interacts with the file system (e.g., checking if folders exist).
import path from 'path'; // path and fileURLToPath: Helps resolve file paths correctly.
import { fileURLToPath } from 'url'; // Also helps resolve file paths correctly.
import dbQueryWithData from '../../helper/helper.js';

const listingsRouter = express.Router();

const listingsColumns = 'title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published, list_image_url_1, list_image_url_2, list_image_url_3, list_image_url_4, list_image_url_5, list_image_url_6, list_image_url_7, list_image_url_8, list_image_url_9';

// #get_listings. GET /api/listings - returns all listings or listings filtered by category
listingsRouter.get('/', async (req, res) => {
  // 1. #category_filter. Extract the category query parameter from the request
  // Parameters
  const {
    category,
    minPrice,
    maxPrice,
    town,
    type,
    seller,
    page = 1,
    limit = 10,
    sort = 'date-desc', // Default sorting option
    search,
  } = req.query; // This means the request
  // sent from the front-end in this case query parameters is sent (the link ending)

  console.log('Received filters:', {
    category,
    minPrice,
    maxPrice,
    town,
    type,
    seller,
    page,
    limit,
    sort,
  }); // Log the filters and pagination parameters received

  // Create the base SQL query with filtering conditions
  let baseQuery = `
   FROM skelbimai
   LEFT JOIN miestai ON skelbimai.town_id = miestai.id
   LEFT JOIN kateogrijos ON skelbimai.category_id = kateogrijos.id
   LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
   WHERE skelbimai.is_published = 1
 `; // Adding WHERE clause to only show published listings

  // #category_filter. Initialize an array to hold query parameters
  const params = []; // Parameter - link ending for the filters

  if (category && !Number.isNaN(parseInt(category, 10))) {
    baseQuery += ' AND skelbimai.category_id = ?';
    params.push(parseInt(category, 10)); // Ensure it's an integer
  }

  if (minPrice && !Number.isNaN(parseFloat(minPrice))) {
    baseQuery += ' AND skelbimai.price >= ?';
    params.push(parseFloat(minPrice)); // Ensure it's a number
  }

  if (maxPrice && !Number.isNaN(parseFloat(maxPrice))) {
    baseQuery += ' AND skelbimai.price <= ?';
    params.push(parseFloat(maxPrice)); // Ensure it's a number
  }

  if (town && typeof town === 'string') {
    baseQuery += ' AND miestai.name LIKE ?';
    params.push(`%${town}%`); // Add wildcard for partial matches
  }

  if (type && typeof type === 'string') {
    baseQuery += ' AND skelbimai.type LIKE ?';
    params.push(`%${type}%`);
  }

  if (seller && typeof seller === 'string') {
    baseQuery += ' AND vartotojai.name LIKE ?';
    params.push(`%${seller}%`);
  }

  if (search && search.trim()) {
    baseQuery += ` AND (skelbimai.title LIKE ? OR skelbimai.description LIKE ?)`;
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  // Sort based on the sort option passed from frontend
  let sortQuery = '';
  switch (sort) {
    case 'price-asc':
      sortQuery = ' ORDER BY skelbimai.price ASC';
      break;
    case 'price-desc':
      sortQuery = ' ORDER BY skelbimai.price DESC';
      break;
    case 'date-asc':
      sortQuery = ' ORDER BY skelbimai.created_at ASC';
      break;
    case 'date-desc':
      sortQuery = ' ORDER BY skelbimai.created_at DESC';
      break;
    default:
      sortQuery = ' ORDER BY skelbimai.created_at DESC'; // Default to price-asc
      break;
  }

  // 1. Query to fetch the filtered listings
  const sql = `
 SELECT skelbimai.id AS skelbimai_id, skelbimai.title AS skelbimai_title,
        skelbimai.main_image_url AS skelbimai_main_image_url, skelbimai.description AS skelbimai_description,
        skelbimai.price AS skelbimai_price, skelbimai.phone AS skelbimai_phone, skelbimai.type AS skelbimai_type,
        skelbimai.town_id AS skelbimai_town_id, skelbimai.user_id AS skelbimai_user_id,
        skelbimai.category_id AS skelbimai_category_id, skelbimai.is_published AS skelbimai_is_published,
        skelbimai.list_image_url_1 AS skelbimai_list_image_url_1, skelbimai.list_image_url_2 AS skelbimai_list_image_url_2,
        skelbimai.list_image_url_3 AS skelbimai_list_image_url_3, skelbimai.list_image_url_4 AS skelbimai_list_image_url_4, skelbimai.list_image_url_5 AS skelbimai_list_image_url_5, skelbimai.list_image_url_6 AS skelbimai_list_image_url_6, skelbimai.list_image_url_7 AS skelbimai_list_image_url_7, skelbimai.list_image_url_8 AS skelbimai_list_image_url_8, skelbimai.list_image_url_9 AS skelbimai_list_image_url_9, miestai.name AS town_name, kateogrijos.name AS category_name, vartotojai.avatar_url AS user_photo
 ${baseQuery}
 ${sortQuery}
 LIMIT ? OFFSET ?
`;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  params.push(parseInt(limit, 10), offset);

  try {
    const [rows, error] = await dbQueryWithData(sql, params);

    if (error) {
      console.warn('Error fetching listings:', error.message);
      return res.status(400).json({ error: error.message });
    }

    // 2. Query to fetch the count of filtered listings
    const countSql = `SELECT COUNT(*) AS total ${baseQuery}`;
    const [countResult, countError] = await dbQueryWithData(
      countSql,
      params.slice(0, -2),
    ); // Use the same filters, but exclude LIMIT and OFFSET

    if (countError) {
      console.warn('Error counting listings:', countError.message);
      return res.status(400).json({ error: countError.message });
    }

    const totalListings = countResult[0].total;
    const totalPages = Math.ceil(totalListings / parseInt(limit, 10));

    res.json({
      success: true,
      listings: rows.length ? rows : [],
      totalPages: totalPages || 1,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('Error fetching listings or count:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching listings or count' });
  }
});

// GET /api/listings/:id - returns a single listing

// #1_Get. Extracting listingID from the route parameters (page link parameter)
listingsRouter.get('/:listingID', async (req, res) => {
  // #1.1_Get. Get parameter.
  const { listingID } = req.params;
  // #1.2_Get. Before dbQueryWithData function, create a SQL query to get a single listing by ID.
  const sql = `SELECT ${listingsColumns}, miestai.name AS town_name, 
       miestai.name AS miestai_name,
       kateogrijos.name AS category_name,
       vartotojai.avatar_url AS user_photo, 
       vartotojai.name AS user_name, 
       vartotojai.email AS user_email 
       FROM skelbimai
LEFT JOIN miestai ON skelbimai.town_id = miestai.id
LEFT JOIN kateogrijos ON skelbimai.category_id = kateogrijos.id
LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id 
WHERE is_published = 1 AND skelbimai.id = ?`;
  // #1.3_Get. Use the dbQueryWithData function to get the data from the database.
  const [row, error] = await dbQueryWithData(sql, [listingID]); // Get data from DB.
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

// DELETE /api/listings/:id - istrina skelbima (is_published = false)
// #1_Delete. Use the dbQueryWithData function to get the data
listingsRouter.delete('/:listingID', async (req, res) => {
  // #1.1_Delete. Extracting listingID from the route parameters (page link parameter)
  const { listingID } = req.params;
  // Need?
  const currentBody = req.body;
  // Use the dbQueryWithData function to get the data
  // #1.2_Delete. Create a SQL query to get a single listing by ID.
  const sql1 = `SELECT * FROM skelbimai WHERE id = ?`;
  // #1.3_Delete. Use the dbQueryWithData function to get the data from the database.
  const [row1, error1] = await dbQueryWithData(sql1, [listingID]); // Get data from DB.
  // #1.4_Delete. If there is an error by getting data, return it.
  if (error1) {
    console.log('error1 ===', error1);
    return res.status(500).json('cannot access');
  }
  // #listing_Delete. Print out the first row just to see what the data looks like.
  console.log('row1 ===', row1);
  const listingUserId = row1[0].user_id;

  // Grąžins 404, jei nėra įrašo su tokiu ID
  if (row1.length === 0) {
    console.log('row does not exist');
    return res.status(404).json({ error: 'row does not exist' });
  }

  // jei vartotojas nėra skelbimo savininkas, grąžina 401
  // console.log('Prisijungusio vartotojo ID: ', req.body.userId.toString());
  // Prisijungusio vartotojo ID
  // console.log('Skelbimo savininko ID:', listingUserId); // Skelbimo savininko ID
  // if (currentBody.userId !== listingUserId) {
  //   return res.status(401).json({ error: 'only owner can delete' });
  // }

  const sql2 = 'UPDATE skelbimai SET is_published=0 WHERE id=? LIMIT 1';

  const [row2, error2] = await dbQueryWithData(sql2, [listingID]);

  if (error2) {
    console.warn('ištrinamas įrašas pakeičiant is_published į 0 ===', error2);
    console.warn('error ===', error2.message);
    return res.status(400).json({ error: 'something went wrong' });
  }

  // if (row2.affectedRows === 0) {
  //   console.log('no rows');
  //   return res.status(404).json({ error: `ap with id: '${listingID}' was not found` });
  // }

  res.json({ msg: `listing with id '${listingID}' was deleted` });
});

export default listingsRouter;
