const multer = require('multer')
const path  = require('path');

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Можно загружать только изображения!'), false);
    }
};
const adsDir = path.join(__dirname, '../public/ads');
// Затем storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, adsDir);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Лимит 5MB
});

module.exports = { upload };