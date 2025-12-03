const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Dependencies
// Middleware: Authentication required for protected routes

// Post a new job (Requires auth)
router.post('/', auth, jobController.createJob);

// Get all jobs (Public access)
router.get('/', jobController.getAllJobs);

// Get all jobs posted by the current user (Client dashboard)
router.get('/my-jobs', auth, jobController.getMyJobs);

// Get job details by ID (Public access)
router.get('/:id', jobController.getJobById);

// Close job without hiring (Requires auth, Owner only)
router.put('/:id/close', auth, jobController.closeJobOnly); 

// Close job and mark as hired (Requires auth, Owner only)
router.put('/close/:jobId/:freelancerId', auth, jobController.closeJob);

// Module export
module.exports = router;