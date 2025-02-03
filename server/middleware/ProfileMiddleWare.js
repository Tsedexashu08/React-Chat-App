import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Setting up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/profile_pics';
        // making sure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const newFileName = `${Date.now()}${fileExtension}`;
        cb(null, newFileName);
    }
});

// Create the upload middleware
const upload = multer({ storage });

// Combined middleware to handle file uploads and extract file path
export const fileUploadMiddleware = (req, res, next) => {
    upload.single('profile_picture')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed', details: err.message });
        }

        // Extracingt and setting the file path
        if (req.file) {
            req.body.profile_picture = `profile_pics/${req.file.filename}`;
        } else {
            req.body.profile_picture = null; // Handle case where there's no file
        }

        next();
    });
};