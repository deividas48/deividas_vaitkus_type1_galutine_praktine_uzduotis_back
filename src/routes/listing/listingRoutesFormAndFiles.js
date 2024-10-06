// src/routes/listing/listingRoutesFormAndFiles.js

import express from 'express';
import multer from 'multer'; // Handles file uploads.
// import fs from 'fs'; // fs: Interacts with the file system (e.g., checking if folders exist).
import path from 'path'; // path and fileURLToPath: Helps resolve file paths correctly.
import { fileURLToPath } from 'url'; // Also helps resolve file paths correctly.
import dbQueryWithData from '../../helper/helper.js';

const listingsRouterFormAndFiles = express.Router();

const listingsColumns = 'title, main_image_url, description, price, phone, type, town_id, user_id, category_id, is_published, list_image_url_1, list_image_url_2, list_image_url_3, list_image_url_4, list_image_url_5, list_image_url_6, list_image_url_7, list_image_url_8, list_image_url_9';

// /* Manages files uploaded from the front-end

// Define __filename and __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url); // log ≈ listingRoutesFormAndFiles.js - the
// current file name
const __dirname = path.dirname(__filename); // log ≈ '/Users/.../Documents/.../src/routes/listing':
// __dirname logs the directory path where listingRoutesFormAndFiles.js is located

// Define the absolute path for the files (images) upload directory
const uploadDir = path.resolve(__dirname, '../../../uploads/images/sell'); // log ≈ '/Users/.../Documents/.../uploads/images/sell'

// Configure multer for file uploads
const storage = multer.diskStorage({
  // When a file is uploaded...
  destination: (req, file, cb) => {
    // Log≈ ...uploadate file example.jpg to directory: /Users/.../Documents/.../uploads/images/sell
    cb(null, uploadDir);
  },

  // When setting the filename...
  filename: (req, file, cb) => {
    // ...set a unique name for the uploaded file
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initializing Multer with the defined storage settings
const upload = multer({ storage });

// */ Manages files uploaded from the front-end

// POST - creates a new listing with file (images) upload
listingsRouterFormAndFiles.post(
  '/',
  upload.array('photos', 10),
  async (req, res) => {
    // req.files contains the array of uploaded files
    // eslint-disable-next-line prefer-destructuring

    // Files (images) from the front-end
    const { files } = req; // or ≈ 'const files = req.files;'

    const {
      title,
      description,
      price,
      phone,
      type,
      town_id,
      user_id,
      category_id,
      is_published = 1,
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

    // Handle file uploads. It's only for files (images) naming.
    const main_image_url = files[0] ? files[0].filename : null;
    // Example: list_image_url_1 is set to '1638316800000-photo1.jpg'.
    const list_image_url_1 = files[1] ? files[1].filename : null;
    const list_image_url_2 = files[2] ? files[2].filename : null;
    const list_image_url_3 = files[3] ? files[3].filename : null;

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
      list_image_url_1 || null, // null - ...
      list_image_url_2 || null, // null - ...
      list_image_url_3 || null, // null - ...
      null, // list_image_url_4
      null, // list_image_url_5
      null, // list_image_url_6
      null, // list_image_url_7
      null, // list_image_url_8
      null, // list_image_url_9
    ];

    // Define the SQL query for inserting the listing into the database
    const sql = `INSERT INTO skelbimai (${listingsColumns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Unique variable names for row and error
    try {
      const [insertedRow, insertError] = await dbQueryWithData(sql, argArr);
      if (insertError) {
        console.warn('Error inserting listing:', insertError);
        return res.status(400).json({ error: insertError.message });
      }

      res.json({ id: insertedRow.insertId, ...req.body });
    } catch (catchError) {
      console.error('Error creating listing:', catchError);
      return res
        .status(500)
        .json({ error: 'An error occurred while creating listing' });
    }
  },
);

export default listingsRouterFormAndFiles;
