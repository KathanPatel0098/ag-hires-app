import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);

  // Debug log for initial render and state changes
  useEffect(() => {
    console.log('JobContext - State updated:', {
      jobsCount: jobs.length,
      loading,
      error,
      currentJobId: currentJob?._id
    });
  }, [jobs, loading, error, currentJob]);

  const getJobs = useCallback(async (filters = {}) => {
    console.log('JobContext - getJobs called with filters:', filters);
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `http://localhost:5000/api/jobs?${queryParams}`;
      console.log('JobContext - Fetching jobs from:', url);
      
      const res = await axios.get(url);
      console.log('JobContext - Jobs API response:', {
        count: res.data.length,
        firstJob: res.data[0],
        lastJob: res.data[res.data.length - 1]
      });
      
      setJobs(res.data);
      setError(null);
    } catch (err) {
      console.error('JobContext - Error fetching jobs:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Error fetching jobs');
      toast.error('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobById = async (id) => {
    console.log('JobContext - getJobById called with id:', id);
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/jobs/${id}`;
      console.log('JobContext - Fetching job from:', url);
      
      const res = await axios.get(url);
      console.log('JobContext - Job API response:', {
        id: res.data._id,
        title: res.data.title,
        company: res.data.company
      });
      
      setCurrentJob(res.data);
      setError(null);
    } catch (err) {
      console.error('JobContext - Error fetching job:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Error fetching job');
      toast.error('Error fetching job');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    console.log('createJob called with data:', jobData);
    setLoading(true);
    try {
      console.log('Creating job at:', 'http://localhost:5000/api/jobs');
      const res = await axios.post('http://localhost:5000/api/jobs', jobData);
      console.log('Create job API response:', res.data);
      setJobs([res.data, ...jobs]);
      toast.success('Job created successfully');
      return true;
    } catch (err) {
      console.error('Error creating job:', err);
      const errorMessage = err.response?.data?.message || 'Error creating job';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, jobData) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, jobData);
      setJobs(jobs.map(job => job._id === id ? res.data : job));
      toast.success('Job updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating job');
      toast.error('Error updating job');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
      toast.success('Job deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting job');
      toast.error('Error deleting job');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId, applicationData) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, applicationData);
      toast.success('Application submitted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting application');
      toast.error('Error submitting application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        currentJob,
        loading,
        error,
        getJobs,
        getJobById,
        createJob,
        updateJob,
        deleteJob,
        applyForJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}; 