// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure upload folder exists
// const uploadPath = path.join(__dirname, "..", "uploads");

// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Storage config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//         cb(null, uniqueName);
//     },
// });

// // File filter (ONLY images for profile picture)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|webp/;

//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed"), false);
//     }
// };

// const upload = multer({
//     storage,
//     limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
//     fileFilter,
// });

// module.exports = upload;



const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage config
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobhuntly/uploads", // folder name in your Cloudinary account
        allowed_formats: ["jpeg", "jpg", "png", "webp", "pdf"],
        transformation: [{ width: 500, height: 500, crop: "limit" }], // optional: resize on upload
    },
});

// File filter (same as before)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter,
});

module.exports = { upload, cloudinary };