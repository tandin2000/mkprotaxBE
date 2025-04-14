const dataService = require('../services/dataService');
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

const adminController = {
    getDashboard: async (req, res) => {
        try {
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: null
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.render('admin/dashboard', { 
                settings: {}, 
                news: [], 
                error: 'Error loading data' 
            });
        }
    },

    // Banner operations
    addBanner: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error('Image is required');
            }
            const bannerData = {
                title: req.body.title,
                description: req.body.description,
                url: req.body.url,
                imageUrl: `/uploads/${req.file.filename}`
            };
            await dataService.addBanner(bannerData);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error adding banner:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error adding banner' 
            });
        }
    },

    updateBanner: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const bannerData = {
                title: req.body.title,
                description: req.body.description,
                url: req.body.url
            };
            if (req.file) {
                bannerData.imageUrl = `/uploads/${req.file.filename}`;
            }
            await dataService.updateBanner(id, bannerData);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error updating banner:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error updating banner' 
            });
        }
    },

    deleteBanner: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteBanner(id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error deleting banner:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error deleting banner' 
            });
        }
    },

    // Settings operations
    updateSettings: async (req, res) => {
        try {
            const { 
                facebook,
                instagram,
                tiktok,
                linkedin,
                address,
                city,
                state,
                zipCode,
                phone,
                email,
                mapUrl,
                mondayOpen,
                mondayClose,
                tuesdayOpen,
                tuesdayClose,
                wednesdayOpen,
                wednesdayClose,
                thursdayOpen,
                thursdayClose,
                fridayOpen,
                fridayClose,
                saturdayOpen,
                saturdayClose,
                sundayOpen,
                sundayClose
            } = req.body;

            const settings = await dataService.getSettings();
            
            settings.socialMedia = {
                facebook,
                instagram,
                tiktok,
                linkedin
            };

            settings.location = {
                address,
                city,
                state,
                zipCode,
                phone,
                email,
                mapUrl
            };

            settings.openingHours = {
                monday: { open: mondayOpen, close: mondayClose },
                tuesday: { open: tuesdayOpen, close: tuesdayClose },
                wednesday: { open: wednesdayOpen, close: wednesdayClose },
                thursday: { open: thursdayOpen, close: thursdayClose },
                friday: { open: fridayOpen, close: fridayClose },
                saturday: { open: saturdayOpen, close: saturdayClose },
                sunday: { open: sundayOpen, close: sundayClose }
            };

            await dataService.updateSettings(settings);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error updating settings:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: 'Error updating settings' 
            });
        }
    },

    // News operations
    addNews: async (req, res) => {
        try {
            const { title, url } = req.body;
            if (!title || !url) {
                throw new Error('Title and URL are required');
            }
            await dataService.addNews({ title, url });
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error adding news:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error adding news' 
            });
        }
    },

    updateNews: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { title, url } = req.body;
            if (!title || !url) {
                throw new Error('Title and URL are required');
            }
            await dataService.updateNews(id, { title, url });
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error updating news:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error updating news' 
            });
        }
    },

    deleteNews: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteNews(id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error deleting news:', error);
            const settings = await dataService.getSettings();
            const news = await dataService.getNews();
            res.render('admin/dashboard', { 
                settings, 
                news,
                error: error.message || 'Error deleting news' 
            });
        }
    }
};

module.exports = adminController; 