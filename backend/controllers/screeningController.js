const Screening = require('../models/Screening');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Get all screenings for a job
exports.getJobScreenings = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Validate jobId
    if (!validateObjectId(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    
    // Check if job exists and user is the employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these screenings' });
    }
    
    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate('userId', 'name email skills')
      .lean();
    
    // Get all screenings for these applications
    const applicationIds = applications.map(app => app._id);
    const screenings = await Screening.find({ applicationId: { $in: applicationIds } })
      .populate('screenedBy', 'name')
      .lean();
    
    // Combine application and screening data
    const applicationsWithScreening = applications.map(application => {
      const screening = screenings.find(s => s.applicationId.toString() === application._id.toString());
      return {
        ...application,
        screening: screening || { status: 'pending', notes: '', screenedAt: null }
      };
    });
    
    res.status(200).json(applicationsWithScreening);
  } catch (error) {
    console.error('Error getting job screenings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get screening for a specific application
exports.getApplicationScreening = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Validate applicationId
    if (!validateObjectId(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Get the application
    const application = await Application.findById(applicationId)
      .populate('userId', 'name email skills')
      .populate('jobId', 'title employerId')
      .lean();
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is authorized (either the applicant or the employer)
    const isApplicant = application.userId._id.toString() === req.user.id;
    const isEmployer = application.jobId.employerId.toString() === req.user.id;
    
    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: 'Not authorized to view this screening' });
    }
    
    // Get the screening
    const screening = await Screening.findOne({ applicationId })
      .populate('screenedBy', 'name')
      .lean();
    
    // Combine application and screening data
    const result = {
      ...application,
      screening: screening || { status: 'pending', notes: '', screenedAt: null }
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting application screening:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update screening for an application
exports.updateScreening = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    
    // Validate applicationId
    if (!validateObjectId(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Validate status
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid screening status' });
    }
    
    // Get the application
    const application = await Application.findById(applicationId)
      .populate('jobId', 'employerId')
      .lean();
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is the employer
    if (application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this screening' });
    }
    
    // Find existing screening or create a new one
    let screening = await Screening.findOne({ applicationId });
    
    if (screening) {
      // Update existing screening
      screening.status = status || screening.status;
      screening.notes = notes !== undefined ? notes : screening.notes;
      screening.screenedBy = req.user.id;
      screening.screenedAt = Date.now();
      await screening.save();
    } else {
      // Create new screening
      screening = await Screening.create({
        applicationId,
        status: status || 'pending',
        notes: notes || '',
        screenedBy: req.user.id,
        screenedAt: Date.now()
      });
    }
    
    // Update the application's screening status
    await Application.findByIdAndUpdate(applicationId, {
      screeningStatus: screening.status
    });
    
    // Populate the screening with user data
    await screening.populate('screenedBy', 'name');
    
    res.status(200).json(screening);
  } catch (error) {
    console.error('Error updating screening:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete screening for an application
exports.deleteScreening = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Validate applicationId
    if (!validateObjectId(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Get the application
    const application = await Application.findById(applicationId)
      .populate('jobId', 'employerId')
      .lean();
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is the employer
    if (application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this screening' });
    }
    
    // Delete the screening
    await Screening.findOneAndDelete({ applicationId });
    
    res.status(200).json({ message: 'Screening deleted successfully' });
  } catch (error) {
    console.error('Error deleting screening:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 