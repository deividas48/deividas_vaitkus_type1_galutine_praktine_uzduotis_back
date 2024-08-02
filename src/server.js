/* eslint-disable import/extensions */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import listingsRouter from './routes/listingRoutes.js';
import townsRouter from './routes/townRoutes.js';
import categoriesRouter from './routes/categoryRoutes.js';
import userRouter from './routes/userRoutes.js';
import { PORT } from './config.js';
import testConnection from './helper/msqlTestRouter.js';

const app = express(); // Create an Express application instance
const port = PORT || 5000; // Define the port number the server will listen on

// testuoti msqlTestRouter.js
testConnection();

// Middleware
app.use(cors()); // Enable CORS for all requests, allowing access from different domains.
app.use(morgan('dev')); // Log all requests to the console.
// Leidžia serveriui priimti JSON tipo duomenis, o taliau juos persiųsti į req.body objektą.
app.use(express.json()); // Parse JSON-encoded bodies

// Routes
app.use('/api/listings', listingsRouter);
app.use('/api/towns', townsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', userRouter);

// Bet koks nenumatytas route'as grąžins 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
