// src\server.js

/* eslint-disable import/extensions */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer'; // Import multer
import path from 'path'; // Import path for directory handling
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import listingsRouter from './routes/listing/listingRoutes.js';
import listingsRouterByUser from './routes/listing/listingRoutesByUser.js';
import listingsRouterFormAndFiles from './routes/listing/listingRoutesFormAndFiles.js';
import townsRouter from './routes/townRoutes/townRoutes.js';
import categoriesRouter from './routes/categoryRoutes/categoryRoutes.js';
import userRouter from './routes/userRoutes/userRoutes.js';
import authRouter from './routes/authRoutes/authRoutes.js';
import { PORT } from './config.js';
import testConnection from './helper/msqlTestRouter.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // Loads .env.production file when NODE_ENV=production

// Check if environment variables are loaded correctly
// console.log('check', process.env);

// Set default environment to production if NODE_ENV is not set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const app = express(); // Create an Express application instance
const port = PORT || 5000; // Define the port number the server will listen on

// testuoti msqlTestRouter.js
testConnection();

// Environment-based CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://www.teikas.lt'] // Production. Frontend domain
  // eslint-disable-next-line operator-linebreak
  : // ? ['http://localhost:5173'] // Testing. Fake production for testing in development enviroment
  [
    'http://localhost:5173', // Development. Vite development server. Vite - "fake server".
    // Vite typically runs on port 5173 by default
  ]; // Localhost for development

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // This will allow cookies or authentication headers
  }),
);

// Middleware
// app.use(cors()); // Enable CORS for all requests, allowing access from different domains.
app.use(morgan('dev')); // Log all requests to the console.
// Leidžia serveriui priimti JSON tipo duomenis, o taliau juos persiųsti į req.body objektą.
app.use(express.json()); // Parse JSON-encoded bodies

// /* Ability to display images from front-end

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// */ Ability to display images from front-end

// /* Ability to import files (images) from front-end

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/images/sell'); // Directory for saving uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage }); // Create the multer instance

// */ Ability to import files (images) from front-end

// console.log('listingsRouter:', listingsRouter);
// console.log('townsRouter:', townsRouter);

// Routes
app.use('/api/listings', listingsRouter); // Use the general listings routes
app.use('/api/listings', listingsRouterByUser); // Use the user-specific listings routes
app.use('/api/listings', listingsRouterFormAndFiles); // Use the form-specific post listings routes
app.use('/api/towns', townsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Create an endpoint for file uploads
app.post('../uploads/images/sell', upload.single('photo'), (req, res) => {
  // 'photo' should match the field name in your form
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res
    .status(200)
    .json({ message: 'File uploaded successfully', file: req.file });
});

// Bet koks nenumatytas route'as grąžins 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);
});
