const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Dashboard route
router.get('/dashboard', isAuthenticated, isAdmin, adminController.getDashboard);

// Banner routes
router.post('/banners', isAuthenticated, isAdmin, upload.single('image'), adminController.addBanner);
router.put('/banners/:id', isAuthenticated, isAdmin, upload.single('image'), adminController.updateBanner);
router.delete('/banners/:id', isAuthenticated, isAdmin, adminController.deleteBanner);

// Settings routes
router.put('/settings', isAuthenticated, isAdmin, adminController.updateSettings);

// News routes
router.post('/news', isAuthenticated, isAdmin, adminController.addNews);
router.put('/news/:id', isAuthenticated, isAdmin, adminController.updateNews);
router.delete('/news/:id', isAuthenticated, isAdmin, adminController.deleteNews);

module.exports = router; 