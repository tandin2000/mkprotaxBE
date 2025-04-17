const dataService = require('../services/dataService');
const bcrypt = require('bcryptjs');

const authController = {
    getLogin: (req, res) => {
        console.log('GET Login - Session:', req.session);
        res.render('auth/login', { error: null });
    },

    postLogin: async (req, res) => {
        const { username, password } = req.body;
        console.log('POST Login attempt - Username:', username);
        console.log('POST Login - Session before:', req.session);

        try {
            const user = await dataService.findUser(username);
            
            if (!user) {
                console.log('Login failed - User not found');
                return res.render('auth/login', { 
                    error: 'Invalid username or password' 
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                console.log('Login failed - Password mismatch');
                return res.render('auth/login', { 
                    error: 'Invalid username or password' 
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username
            };
            
            console.log('Login successful - Session after:', req.session);
            console.log('Session ID:', req.sessionID);

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { 
                error: 'An error occurred during login' 
            });
        }
    },

    logout: (req, res) => {
        console.log('Logout - Session before:', req.session);
        req.session.destroy();
        console.log('Logout - Session destroyed');
        res.redirect('/auth/login');
    }
};

module.exports = authController; 