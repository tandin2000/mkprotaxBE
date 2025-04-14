const dataService = require('../services/dataService');
const bcrypt = require('bcryptjs');

const authController = {
    getLogin: (req, res) => {
        res.render('auth/login', { error: null });
    },

    postLogin: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await dataService.findUser(username);
            
            if (!user) {
                return res.render('auth/login', { 
                    error: 'Invalid username or password' 
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.render('auth/login', { 
                    error: 'Invalid username or password' 
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username
            };

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { 
                error: 'An error occurred during login' 
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/auth/login');
    }
};

module.exports = authController; 