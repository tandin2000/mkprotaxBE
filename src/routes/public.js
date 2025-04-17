const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());

// Get banner information
router.get('/banner', async (req, res) => {
    try {
        const settingsPath = path.join(__dirname, '../../data/settings/settings.json');
        const settings = await fs.readJson(settingsPath);        
        // Check if banners are enabled globally
        if (settings.bannersEnabled === false || settings.bannersEnabled === "undefined") {
            return res.json({
                status: 'success',
                message: 'Banners are currently disabled',
                data: []
            });
        }

        res.json({
            status: 'success',
            message: 'Banner information retrieved successfully',
            data: settings.banners
        });
    } catch (error) {
        console.error('Error in banner endpoint:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching banner information',
            error: error.message
        });
    }
});

// Get news list
router.get('/news', async (req, res) => {
    try {
        const newsPath = path.join(__dirname, '../../data/news/news.json');
        const news = await fs.readJson(newsPath);
        res.json({
            status: 'success',
            message: 'News retrieved successfully',
            data: news
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching news',
            error: error.message
        });
    }
});

// Get all settings
router.get('/settings', async (req, res) => {
    try {
        const settingsPath = path.join(__dirname, '../../data/settings/settings.json');
        const settings = await fs.readJson(settingsPath);
        res.json({
            status: 'success',
            message: 'Settings retrieved successfully',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching settings',
            error: error.message
        });
    }
});

module.exports = router; 