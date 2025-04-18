const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getJobScreenings,
  getApplicationScreening,
  updateScreening,
  deleteScreening
} = require('../controllers/screeningController');

// Get all screenings for a job (employer only)
router.get('/jobs/:jobId/screenings', protect, authorize('employer'), getJobScreenings);

// Get screening for a specific application (applicant or employer)
router.get('/applications/:applicationId/screening', protect, getApplicationScreening);

// Create or update screening for an application (employer only)
router.put('/applications/:applicationId/screening', protect, authorize('employer'), updateScreening);

// Delete screening for an application (employer only)
router.delete('/applications/:applicationId/screening', protect, authorize('employer'), deleteScreening);

module.exports = router; 