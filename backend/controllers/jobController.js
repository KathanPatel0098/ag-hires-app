const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res) => {
  try {
    // Validate required fields
    const { title, description, location, type, category } = req.body;
    if (!title || !description || !location || !type || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const job = new Job({
      ...req.body,
      company: req.user.id
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { category, type, location, search, limit } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let jobsQuery = Job.find(query)
      .populate('company', 'name companyName')
      .sort({ createdAt: -1 });

    if (limit) {
      jobsQuery = jobsQuery.limit(parseInt(limit));
    }

    const jobs = await jobsQuery;
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name companyName companyDescription companyWebsite')
      .populate({
        path: 'applications',
        populate: {
          path: 'applicant',
          select: 'name email'
        }
      });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner of the job
    if (job.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(job);
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner of the job
    if (job.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private (Job seeker only)
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: req.params.id,
      applicant: req.user.id
    });

    if (existingApplication) {
      // Only allow updates if status is pending
      if (existingApplication.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot update application. Application has already been processed.' 
        });
      }

      // Handle file upload
      let resumePath = existingApplication.resume;
      let resumeFileName = existingApplication.resumeFileName;
      
      if (req.file) {
        resumePath = `/uploads/${req.file.filename}`;
        resumeFileName = req.file.originalname;
      } else if (req.body.resume) {
        // Fallback to URL if file not uploaded
        resumePath = req.body.resume;
      }

      // Update existing application
      if (req.body.coverLetter !== undefined) {
        existingApplication.coverLetter = req.body.coverLetter;
      }
      existingApplication.resume = resumePath;
      existingApplication.resumeFileName = resumeFileName;
      existingApplication.appliedAt = Date.now();

      await existingApplication.save();
      return res.json(existingApplication);
    }

    // Handle file upload for new application
    let resumePath = '';
    let resumeFileName = '';
    
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
      resumeFileName = req.file.originalname;
    } else if (req.body.resume) {
      // Fallback to URL if file not uploaded
      resumePath = req.body.resume;
    } else {
      return res.status(400).json({ message: 'Resume is required' });
    }

    // Create new application with explicit coverLetter handling
    const application = new Application({
      job: req.params.id,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || '',  // Set empty string as default
      resume: resumePath,
      resumeFileName: resumeFileName
    });

    await application.save();

    // Add application to job's applications array
    job.applications.push(application._id);
    await job.save();

    res.json(application);
  } catch (err) {
    console.error('Error applying for job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 