/* eslint-disable import/extensions */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import adsRouter from './routes/adRoutes.js';

const app = express(); // Create an Express application instance
const port = 3000; // Define the port number the server will listen on

// Middleware
app.use(cors()); // Enable CORS for all requests, allowing access from different domains.
app.use(morgan('dev')); // Use Morgan logging middleware for detailed request logging in development mode.

// Routes
app.use('/api/ads', adsRouter);

// Server Initialization
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
