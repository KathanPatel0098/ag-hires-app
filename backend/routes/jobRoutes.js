const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.use(protect);

// Employer routes
router.post('/', authorize('employer'), createJob);
router.put('/:id', authorize('employer'), updateJob);
router.delete('/:id', authorize('employer'), deleteJob);

// Job seeker routes
router.post('/:id/apply', authorize('job_seeker'), upload.single('resume'), applyForJob);

module.exports = router; 