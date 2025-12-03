const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth'); 

// Dependencies
// Middleware: Authentication required for all routes

// Upgrade user account (PRO membership)
router.post('/upgrade-account', auth, paymentController.upgradeToPro);

// Promote job to Premium
router.post('/upgrade-job/:jobId', auth, paymentController.payForJob);

// Module export
module.exports = router;