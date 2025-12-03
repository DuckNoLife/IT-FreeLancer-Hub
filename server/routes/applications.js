const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Dependencies
// Middleware: Authentication required for all routes

// Apply for job (Freelancer)
router.post('/', auth, applicationController.applyForJob);

// Get job applications (Client)
router.get('/job/:jobId', auth, applicationController.getJobApplications);

// Get user's applications (Freelancer)
router.get('/my-applications', auth, applicationController.getMyApplications);

// Unlock contact (Client)
router.put('/unlock/:id', auth, applicationController.unlockContact);

// Module export
module.exports = router;