const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); 

// Dependencies
// Middleware: Authentication required for all routes

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile (Phone, Skills)
router.put('/profile', auth, userController.updateProfile);

// Update username
router.put('/username', auth, userController.updateUsername); 

// Update password
router.put('/password', auth, userController.updatePassword);

// Update avatar URL
router.put('/avatar', auth, userController.updateAvatar);

// Module export
module.exports = router;