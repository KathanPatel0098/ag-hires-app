const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getDashboardStats
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Job management
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Application management
router.get('/applications', getApplications);
router.get('/applications/:id', getApplication);
router.put('/applications/:id', updateApplication);
router.delete('/applications/:id', deleteApplication);

module.exports = router; 