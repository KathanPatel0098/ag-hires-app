const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get all applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner of the job
    if (job.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience education');

    res.json(applications);
  } catch (err) {
    console.error('Error fetching job applications:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job seeker only)
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location type status',
        populate: {
          path: 'company',
          select: 'companyName'
        }
      })
      .select('coverLetter resume resumeFileName status appliedAt job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Error fetching user applications:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job);

    // Check if user is the owner of the job
    if (job.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    console.error('Error updating application status:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Add note to application
// @route   POST /api/applications/:id/notes
// @access  Private (Employer only)
exports.addApplicationNote = async (req, res) => {
  try {
    const { text } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job);

    // Check if user is the owner of the job
    if (job.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.notes.push({
      text,
      addedBy: req.user.id
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error('Error adding note to application:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 