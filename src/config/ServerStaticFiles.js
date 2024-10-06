// // src\config\staticFiles.js
// // The file creates ability to reach files (images) from front-end.

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Function to set up static file serving
// export default function setupStaticFiles(app) {
// // Define __dirname for ES modules
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   // Serve static files (images) from the 'uploads' directory
//   app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// }
