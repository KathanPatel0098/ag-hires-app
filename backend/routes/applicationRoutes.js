const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
  addApplicationNote
} = require('../controllers/applicationController');

// All routes are protected
router.use(protect);

// Get all applications for a job (employer only)
router.get('/job/:jobId', authorize('employer'), getJobApplications);

// Get user's applications (job seeker only)
router.get('/my-applications', authorize('job_seeker'), getUserApplications);

// Update application status (employer only)
router.put('/:id/status', authorize('employer'), updateApplicationStatus);

// Add note to application (employer only)
router.post('/:id/notes', authorize('employer'), addApplicationNote);

module.exports = router; 