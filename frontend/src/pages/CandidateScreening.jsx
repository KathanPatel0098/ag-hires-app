import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJob } from '../context/JobContext';
import { useApplication } from '../context/ApplicationContext';
import { toast } from 'react-hot-toast';
import '../assets/css/CandidateScreening.css';

const CandidateScreening = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentJob, getJobById, jobs, getJobs } = useJob();
  const { applications, fetchApplications, updateApplicationStatus, addApplicationNote } = useApplication();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [screeningNotes, setScreeningNotes] = useState('');
  const [screeningStatus, setScreeningStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [isGeneralScreening, setIsGeneralScreening] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Debug log
        console.log('CandidateScreening - Loading data:', {
          jobId,
          userId: user?.id,
          userRole: user?.role,
          currentJob
        });
        
        // Verify user is an employer
        if (!user || user.role !== 'employer') {
          throw new Error('Unauthorized access');
        }

        // Check if this is the general screening page
        if (jobId === 'screening' || !jobId) {
          setIsGeneralScreening(true);
          
          // Load all jobs for the employer
          await getJobs({ employerId: user.id });
          
          if (!isMounted) return;
          
          // If no jobs, show appropriate message
          if (!jobs || jobs.length === 0) {
            setError('No jobs found. Please post a job first.');
            setIsLoading(false);
            return;
          }
          
          // No specific job selected yet
          setIsLoading(false);
          return;
        }

        // Load job details if not already loaded
        if (!currentJob) {
          await getJobById(jobId);
        }
        
        if (!isMounted) return;
        
        // Check if job exists after loading
        if (!currentJob) {
          throw new Error('Job not found');
        }

        // Verify user owns the job
        if (currentJob.employerId !== user.id) {
          throw new Error('Unauthorized access to this job');
        }

        // Load applications
        const jobApplications = await fetchApplications({ jobId });
        if (!isMounted) return;
        
        console.log('CandidateScreening - Loaded applications:', jobApplications);
      } catch (error) {
        if (!isMounted) return;
        console.error('CandidateScreening - Error loading data:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to load applications');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [jobId, user?.id, user?.role, currentJob, jobs, getJobs, getJobById, fetchApplications]);

  const handleJobSelect = async (job) => {
    try {
      setIsLoading(true);
      setSelectedJob(job);
      
      // Load applications for the selected job
      const jobApplications = await fetchApplications({ jobId: job._id });
      console.log('CandidateScreening - Loaded applications for job:', jobApplications);
      
      setIsLoading(false);
    } catch (error) {
      console.error('CandidateScreening - Error loading applications for job:', error);
      toast.error('Failed to load applications for this job');
      setIsLoading(false);
    }
  };

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
    setScreeningNotes(application.notes || '');
    setScreeningStatus(application.status || 'pending');
  };

  const handleScreeningUpdate = async () => {
    try {
      if (!selectedApplication) return;

      // Update the application status
      const statusUpdated = await updateApplicationStatus(selectedApplication._id, screeningStatus);
      
      // Add a note if provided
      if (screeningNotes && statusUpdated) {
        await addApplicationNote(selectedApplication._id, screeningNotes);
      }

      // Refresh applications
      const jobIdToUse = isGeneralScreening ? selectedJob._id : jobId;
      await fetchApplications({ jobId: jobIdToUse });

      toast.success('Application status updated successfully');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  if (error) {
    return (
      <div className="screening-container">
        <div className="screening-content">
          <div className="error-container">
            <div className="flex">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="error-message">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-primary"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="screening-container">
        <div className="screening-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-4 text-lg text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  // General screening page - show job selection
  if (isGeneralScreening) {
    return (
      <div className="screening-container">
        <div className="screening-content">
          <h2 className="text-2xl font-bold mb-6">Candidate Screening</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h3 className="text-lg font-medium mb-4">Your Jobs</h3>
              <div className="job-list">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => handleJobSelect(job)}
                    className={`job-item ${selectedJob?._id === job._id ? 'selected' : ''}`}
                  >
                    <h4 className="job-title">{job.title}</h4>
                    <p className="job-company">{job.company}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              {selectedJob ? (
                <div className="applications-container">
                  <h3 className="text-lg font-medium mb-4">
                    Applications for {selectedJob.title}
                  </h3>
                  {applications.length > 0 ? (
                    <div className="applications-grid">
                      {applications.map((application) => (
                        <div
                          key={application._id}
                          className={`application-card ${
                            selectedApplication?._id === application._id ? 'selected' : ''
                          }`}
                          onClick={() => handleApplicationSelect(application)}
                        >
                          <div className="application-header">
                            <h4 className="candidate-name">{application.candidateName}</h4>
                            <span className={`status-badge ${application.status}`}>
                              {application.status}
                            </span>
                          </div>
                          <div className="application-details">
                            <p>{application.email}</p>
                            <p className="text-sm text-gray-500">
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No applications found for this job.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Select a job to view applications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Specific job screening page
  return (
    <div className="screening-container">
      <div className="screening-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Applications</h3>
            <div className="applications-list">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className={`application-item ${
                    selectedApplication?._id === application._id ? 'selected' : ''
                  }`}
                  onClick={() => handleApplicationSelect(application)}
                >
                  <h4 className="candidate-name">{application.applicant?.name}</h4>
                  <span className={`status-badge ${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            {selectedApplication ? (
              <div className="application-details">
                <div className="candidate-info">
                  <h3 className="text-xl font-medium mb-4">
                    {selectedApplication.applicant.name}
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Email</label>
                      <p>{selectedApplication.applicant.email}</p>
                    </div>
                    {/* <div className="info-item">
                      <label>Phone</label>
                      <p>{selectedApplication.applicant.phone}</p>
                    </div> */}
                    <div className="info-item">
                      <label>Experience</label>
                      <p>{selectedApplication.applicant.experience} years</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-2">Cover Letter</h4>
                    <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-4">Screening</h4>
                    <div className="space-y-4">
                      <div className="form-group">
                        <label htmlFor="screeningStatus" className="form-label">
                          Status
                        </label>
                        <select
                          id="screeningStatus"
                          value={screeningStatus}
                          onChange={(e) => setScreeningStatus(e.target.value)}
                          className="form-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="screeningNotes" className="form-label">
                          Notes
                        </label>
                        <textarea
                          id="screeningNotes"
                          rows={4}
                          value={screeningNotes}
                          onChange={(e) => setScreeningNotes(e.target.value)}
                          className="form-textarea"
                          placeholder="Add your screening notes here..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleScreeningUpdate}
                          className="btn btn-primary"
                        >
                          Update Screening
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <svg
                  className="empty-state-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="empty-state-text font-medium">
                  No application selected
                </h3>
                <p className="empty-state-text mt-1">
                  Select an application from the list to view details and screen the candidate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateScreening; 