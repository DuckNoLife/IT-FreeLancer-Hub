const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Dependencies
// Middleware: Authentication

// Registration & Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google Login
router.post('/google', authController.googleLogin);

// Update user role (Requires authentication)
router.put('/update-role', auth, authController.updateRole);

// Forgot Password
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);

// Module export
module.exports = router;