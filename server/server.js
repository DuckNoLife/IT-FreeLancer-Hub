// Dependencies & Configuration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database connection
connectDB();

// Global Middleware
// CORS Configuration: Allow all origins to prevent blockage between Frontend and Backend
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Webhook handling: Must be placed before express.json() 
// Stripe requires the raw body for signature verification.
app.use('/webhook', express.raw({ type: 'application/json' }), require('./routes/webhook')); 

// Body parser middleware (applies to normal API routes)
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/payment'));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});