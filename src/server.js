/* eslint-disable import/extensions */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import adsRouter from './routes/adRoutes.js';
import { PORT } from './config.js';

const app = express(); // Create an Express application instance
const port = PORT || 5000; // Define the port number the server will listen on

// Middleware
app.use(cors()); // Enable CORS for all requests, allowing access from different domains.
app.use(morgan('dev')); // Use Morgan logging middleware for detailed request logging in development mode.

// Routes
app.use('/api/ads', adsRouter);

// Bet koks nenumatytas route'as grąžins 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
