const express = require('express');
const session = require('express-session');
const path = require('path');
const FileStore = require('session-file-store')(session);
const fs = require('fs-extra');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
fs.ensureDirSync(uploadsDir);

// Ensure sessions directory exists
const sessionsDir = path.join(__dirname, '../data/sessions');
fs.ensureDirSync(sessionsDir);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    store: new FileStore({ path: sessionsDir }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', publicRoutes);

// Home route
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Login page available at: http://localhost:${PORT}/auth/login`);
}); 