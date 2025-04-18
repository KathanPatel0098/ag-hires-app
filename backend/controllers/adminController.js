const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('express-async-handler');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
  const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);
  const recentApplications = await Application.find()
    .populate('applicant', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    stats: {
      totalUsers,
      totalJobs,
      totalApplications,
    },
    recentUsers,
    recentJobs,
    recentApplications,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Only allow changing to admin role if the target user is already an admin
  if (req.body.role === 'admin' && user.role !== 'admin') {
    res.status(403);
    throw new Error('Cannot assign admin role to non-admin users');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    isActive: updatedUser.isActive,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('company', 'name email');
  res.json(jobs);
});

// @desc    Get single job
// @route   GET /api/admin/jobs/:id
// @access  Private/Admin
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name email');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json(job);
});

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private/Admin
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job.title = req.body.title || job.title;
  job.description = req.body.description || job.description;
  job.requirements = req.body.requirements || job.requirements;
  job.location = req.body.location || job.location;
  job.salary.min = req.body.salary.min || job.salary.min;
  job.salary.max = req.body.salary.max || job.salary.max;
  job.salary.currency = req.body.salary.currency || job.salary.currency;
  job.type = req.body.type || job.type;
  job.status = req.body.status || job.status;

  const updatedJob = await job.save();
  res.json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job removed' });
});

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate('applicant', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 });
  res.json(applications);
});

// @desc    Get single application
// @route   GET /api/admin/applications/:id
// @access  Private/Admin
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('applicant', 'name email')
    .populate('job', 'title company');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  res.json(application);
});

// @desc    Update application
// @route   PUT /api/admin/applications/:id
// @access  Private/Admin
const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Validate status if provided
  if (req.body.status) {
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(req.body.status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    application.status = req.body.status;
  }

  application.adminNotes = req.body.adminNotes || application.adminNotes;

  const updatedApplication = await application.save();
  res.json(updatedApplication);
});

// @desc    Delete application
// @route   DELETE /api/admin/applications/:id
// @access  Private/Admin
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  await Application.findByIdAndDelete(req.params.id);
  res.json({ message: 'Application removed' });
});

module.exports = {
  getDashboardStats,
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
}; 