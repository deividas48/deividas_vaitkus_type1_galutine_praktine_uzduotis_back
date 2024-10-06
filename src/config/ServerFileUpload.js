// import multer from 'multer';
// import path from 'path';

// export default function ServerFileUpload() {
//   // Set up multer for file uploads
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, '../uploads/images/sell'); // Directory for saving uploaded images
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//     },
//   });

//   const upload = multer({ storage }); // Create the multer instance
// }
