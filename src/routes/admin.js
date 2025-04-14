const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Dashboard route
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Banner routes
router.post('/banners', isAuthenticated, upload.single('image'), adminController.addBanner);
router.put('/banners/:id', isAuthenticated, upload.single('image'), adminController.updateBanner);
router.delete('/banners/:id', isAuthenticated, adminController.deleteBanner);

// News routes
router.post('/news', isAuthenticated, adminController.addNews);
router.put('/news/:id', isAuthenticated, adminController.updateNews);
router.delete('/news/:id', isAuthenticated, adminController.deleteNews);

// Settings route
router.post('/settings', isAuthenticated, adminController.updateSettings);

module.exports = router; 