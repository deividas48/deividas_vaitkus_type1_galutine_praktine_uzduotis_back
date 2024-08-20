// src/routes/listingRoutes.js

import express from 'express';
import dbQueryWithData from '../helper/helper.js';

const listingsRouter = express.Router();

const listingsColumns = 'title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published, main_image_url_1, main_image_url_2, main_image_url_3';

// #get_listings. GET /api/listings - returns all listings or listings filtered by category
listingsRouter.get('/', async (req, res) => {
  console.log('Received query params:', req.query);
  // 1. #category_filter. Extract the category query parameter from the request
  const {
    category,
    minPrice,
    maxPrice,
    town,
    type,
    seller,
    page = 1,
    limit = 10,
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
  }); // Log the filters and pagination parameters received

  // 1. #get_listings. Create the base SQL query
  let sql = `SELECT skelbimai.id AS skelbimai_id, skelbimai.title AS skelbimai_title, skelbimai.main_image_url AS skelbimai_main_image_url, skelbimai.description AS skelbimai_description, skelbimai.price AS skelbimai_price, skelbimai.phone AS skelbimai_phone, skelbimai.type AS skelbimai_type, skelbimai.town_id AS skelbimai_town_id, skelbimai.user_id AS skelbimai_user_id, skelbimai.category_id AS skelbimai_category_id, skelbimai.is_published AS skelbimai_is_published, skelbimai.main_image_url_1 AS skelbimai_main_image_url_1, skelbimai.main_image_url_2 AS skelbimai_main_image_url_2, skelbimai.main_image_url_3 AS skelbimai_main_image_url_3, miestai.name AS town_name, kateogrijos.name AS category_name 
  FROM skelbimai
  LEFT JOIN miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN kateogrijos ON skelbimai.category_id = kateogrijos.id
  LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
  WHERE skelbimai.is_published = 1`; // Adding WHERE clause to only show published listings

  // 2. #category_filter. Initialize an array to hold query parameters
  const params = []; // Parameter - link ending for the filters

  if (category && !Number.isNaN(parseInt(category, 10))) {
    sql += ' AND skelbimai.category_id = ?';
    params.push(parseInt(category, 10)); // Ensure it's an integer
  }

  if (minPrice && !Number.isNaN(parseFloat(minPrice))) {
    sql += ' AND skelbimai.price >= ?';
    params.push(parseFloat(minPrice)); // Ensure it's a number
  }

  if (maxPrice && !Number.isNaN(parseFloat(maxPrice))) {
    sql += ' AND skelbimai.price <= ?';
    params.push(parseFloat(maxPrice)); // Ensure it's a number
  }

  if (town && typeof town === 'string') {
    sql += ' AND miestai.name LIKE ?';
    params.push(`%${town}%`); // Add wildcard for partial matches
  }

  if (type && typeof type === 'string') {
    sql += ' AND skelbimai.type LIKE ?';
    params.push(`%${type}%`);
  }

  if (seller && typeof seller === 'string') {
    sql += ' AND vartotojai.name LIKE ?';
    params.push(`%${seller}%`);
  }

  // Calculate the offset for pagination
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  // Add LIMIT and OFFSET for pagination
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit, 10), offset);

  console.log('SQL Query:', sql); // Log the SQL query
  console.log('SQL Params:', params); // Log the query parameters

  try {
    const [rows, error] = await dbQueryWithData(sql, params);

    // Log the rows to see what data is returned from the query
    console.log('SQL Query Results:', rows);

    // 7. #get_listings. If there is an error, log it and return a 400 status with the error message
    if (error) {
      console.warn('get all listings error ===', error);
      console.warn('error ===', error.message);
      return res.status(400).json({ error: error.message });
    }
    // Count total number of listings for pagination
    const countSql = `SELECT COUNT(*) AS total FROM skelbimai WHERE is_published = 1`;
    const [countResult, countError] = await dbQueryWithData(countSql, []);

    if (countError) {
      console.warn('get count error ===', countError);
      return res.status(400).json({ error: countError.message });
    }

    const totalListings = countResult[0].total;
    const totalPages = Math.ceil(totalListings / parseInt(limit, 10));
    console.log('totalPages', totalPages)
    const countSql = `SELECT COUNT(*) AS total ${baseQuery}`;

    res.json({
      success: true, // Flag to indicate successful response
      // Ensure `rows` contains listings data, default to empty array if not
      listings: rows.length ? rows : [],
      totalPages: totalPages || 1, // Ensure totalPages is present, default to 1 if undefined
      currentPage: parseInt(page, 10), // Ensure currentPage is sent back correctly as an integer
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching listings' });
  }
});

// GET /api/listings/:id - returns a single listing
// #1_Get. Extracting listingID from the route parameters (page link parameter)
listingsRouter.get('/:listingID', async (req, res) => {
  // #1.1_Get. 'req.params.listingID' - parameter (/parameter).
  const { listingID } = req.params;
  // #1.2_Get. Before dbQueryWithData function, create a SQL query to get a single listing by ID.
  const sql = `SELECT ${listingsColumns} FROM skelbimai WHERE is_published = 1 AND id = ?`;
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

// POST - creates a new listing
// #1_Post. Create a post request to the /api/listings route
listingsRouter.post('/', async (req, res) => {
  // #1.1_Post. Destructure the request body.
  // 'req.body' - is the data that is sent to the server from the client (frontend).
  const {
    // id is not needed, because it is autoincremented in the DB itself.
    // The variable names below are the same as the names of the columns in the database.
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
    is_published = 1,
    main_image_url_1,
    main_image_url_2,
    main_image_url_3,
  } = req.body;

  // #1.2_Post. Ensure required fields are present
  if (
    !title
    || !description
    || !price
    || !phone
    || !type
    || !town_id
    || !category_id
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // #1.3_Post. Create an array of arguments to pass to the query. The order of the arguments
  // must match the order of the columns in the query below.
  // Variable names in the array below must match the variable names above (req.body object).
  const argArr = [
    // id, // id is autoincremented, so we don't need to pass it
    title,
    main_image_url || null, // null - ensure main_image_url is not undefined,
    // if it is, set it to null
    description,
    price,
    phone,
    type,
    town_id || null, // null - ...
    user_id || null, // null - ...
    category_id,
    is_published,
    main_image_url_1 || null, // null - ...
    main_image_url_2 || null, // null - ...
    main_image_url_3 || null, // null - ...
  ];

  // #1.4_Post. Create a SQL query to insert a new row into the database
  const sql = `INSERT INTO skelbimai (${listingsColumns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // #1.5_Post. Use the dbQueryWithData function to execute the query
  const [row, error] = await dbQueryWithData(sql, argArr); // Make a query to the database.
  // 'sql' - SQL query.
  // The 'argArr' array is populated with the values from the request body (req.body)

  // #1.6_Post. If there is an error, return it
  if (error) {
    console.warn('post rows error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({ error: error.message }); // Show informative error message
  }
  // Return the created listing by filling columns
  // #1.7_Post. Return the created listing
  res.json({ id: row.insertId, ...req.body });
  // columns. 'res.json' - send the response to the client. The id
  //  is autoincremented, ...req.body - the rest of the data from frontend.
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
