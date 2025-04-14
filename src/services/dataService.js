const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

class DataService {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data');
        this.ensureDataFiles();
    }

    async ensureDataFiles() {
        try {
            // Ensure data directory exists
            await fs.ensureDir(this.dataPath);
            
            // Ensure subdirectories exist
            await fs.ensureDir(path.join(this.dataPath, 'users'));
            await fs.ensureDir(path.join(this.dataPath, 'settings'));
            await fs.ensureDir(path.join(this.dataPath, 'news'));
            await fs.ensureDir(path.join(this.dataPath, 'sessions'));
            
            // Initialize files if they don't exist
            const files = {
                users: path.join(this.dataPath, 'users', 'users.json'),
                settings: path.join(this.dataPath, 'settings', 'settings.json'),
                news: path.join(this.dataPath, 'news', 'news.json')
            };

            for (const [key, filePath] of Object.entries(files)) {
                if (!await fs.pathExists(filePath)) {
                    const initialData = key === 'users' ? [] : (key === 'news' ? [] : {
                        banners: [],
                        openingHours: {
                            monday: { open: '', close: '' },
                            tuesday: { open: '', close: '' },
                            wednesday: { open: '', close: '' },
                            thursday: { open: '', close: '' },
                            friday: { open: '', close: '' },
                            saturday: { open: '', close: '' },
                            sunday: { open: '', close: '' }
                        },
                        socialMedia: {
                            facebook: '',
                            instagram: '',
                            tiktok: '',
                            linkedin: ''
                        },
                        location: {
                            address: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            phone: '',
                            email: '',
                            mapUrl: ''
                        }
                    });
                    await fs.writeJson(filePath, initialData);
                }
            }
        } catch (error) {
            console.error('Error ensuring data files:', error);
            throw error;
        }
    }

    // User operations
    async findUser(username) {
        try {
            const users = await fs.readJson(path.join(this.dataPath, 'users', 'users.json'));
            return users.find(user => user.username === username);
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const users = await fs.readJson(path.join(this.dataPath, 'users', 'users.json'));
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = {
                ...userData,
                password: hashedPassword,
                id: Date.now().toString()
            };
            users.push(newUser);
            await fs.writeJson(path.join(this.dataPath, 'users', 'users.json'), users);
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Settings operations
    async getSettings() {
        try {
            return await fs.readJson(path.join(this.dataPath, 'settings', 'settings.json'));
        } catch (error) {
            console.error('Error getting settings:', error);
            return {
                banners: [],
                openingHours: {
                    monday: { open: '', close: '' },
                    tuesday: { open: '', close: '' },
                    wednesday: { open: '', close: '' },
                    thursday: { open: '', close: '' },
                    friday: { open: '', close: '' },
                    saturday: { open: '', close: '' },
                    sunday: { open: '', close: '' }
                },
                socialMedia: {
                    facebook: '',
                    instagram: '',
                    tiktok: '',
                    linkedin: ''
                },
                location: {
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    phone: '',
                    email: '',
                    mapUrl: ''
                }
            };
        }
    }

    async updateSettings(settings) {
        try {
            await fs.writeJson(path.join(this.dataPath, 'settings', 'settings.json'), settings);
            return settings;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    async addBanner(bannerData) {
        try {
            const settings = await this.getSettings();
            if (!settings.banners) {
                settings.banners = [];
            }
            const newBanner = {
                title: bannerData.title,
                description: bannerData.description,
                url: bannerData.url,
                imageUrl: bannerData.imageUrl
            };
            settings.banners.push(newBanner);
            await this.updateSettings(settings);
            return newBanner;
        } catch (error) {
            console.error('Error adding banner:', error);
            throw error;
        }
    }

    async updateBanner(id, bannerData) {
        try {
            const settings = await this.getSettings();
            if (!settings.banners) {
                settings.banners = [];
            }
            if (id >= 0 && id < settings.banners.length) {
                settings.banners[id] = {
                    ...settings.banners[id],
                    ...bannerData
                };
                await this.updateSettings(settings);
                return settings.banners[id];
            }
            throw new Error('Banner not found');
        } catch (error) {
            console.error('Error updating banner:', error);
            throw error;
        }
    }

    async deleteBanner(id) {
        try {
            const settings = await this.getSettings();
            if (!settings.banners) {
                settings.banners = [];
            }
            if (id >= 0 && id < settings.banners.length) {
                settings.banners.splice(id, 1);
                await this.updateSettings(settings);
                return true;
            }
            throw new Error('Banner not found');
        } catch (error) {
            console.error('Error deleting banner:', error);
            throw error;
        }
    }

    // News operations
    async getNews() {
        try {
            const newsPath = path.join(this.dataPath, 'news', 'news.json');
            if (!await fs.pathExists(newsPath)) {
                await fs.ensureDir(path.join(this.dataPath, 'news'));
                await fs.writeJson(newsPath, []);
                return [];
            }
            const news = await fs.readJson(newsPath);
            return Array.isArray(news) ? news : [];
        } catch (error) {
            console.error('Error getting news:', error);
            return [];
        }
    }

    async addNews(newsData) {
        try {
            const newsPath = path.join(this.dataPath, 'news', 'news.json');
            const news = await this.getNews();
            const newNews = {
                title: newsData.title,
                url: newsData.url
            };
            news.push(newNews);
            await fs.writeJson(newsPath, news);
            return newNews;
        } catch (error) {
            console.error('Error adding news:', error);
            throw error;
        }
    }

    async updateNews(id, newsData) {
        try {
            const newsPath = path.join(this.dataPath, 'news', 'news.json');
            const news = await this.getNews();
            if (id >= 0 && id < news.length) {
                news[id] = {
                    title: newsData.title,
                    url: newsData.url
                };
                await fs.writeJson(newsPath, news);
                return news[id];
            }
            throw new Error('News item not found');
        } catch (error) {
            console.error('Error updating news:', error);
            throw error;
        }
    }

    async deleteNews(id) {
        try {
            const newsPath = path.join(this.dataPath, 'news', 'news.json');
            const news = await this.getNews();
            if (id >= 0 && id < news.length) {
                news.splice(id, 1);
                await fs.writeJson(newsPath, news);
                return true;
            }
            throw new Error('News item not found');
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    }
}

module.exports = new DataService(); 