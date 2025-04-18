import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/applications/my-applications';
      if (params.jobId) {
        url = `http://localhost:5000/api/applications/job/${params.jobId}`;
      }

      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Applications response:', res.data); // Debug log
      setApplications(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error fetching applications:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Error fetching applications');
      toast.error(err.response?.data?.message || 'Error fetching applications');
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we're using localStorage

  const getMyApplications = useCallback(async () => {
    return fetchApplications();
  }, [fetchApplications]);

  const getJobApplications = useCallback(async (jobId) => {
    return fetchApplications({ jobId });
  }, [fetchApplications]);

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setApplications(applications.map(app => 
        app._id === applicationId ? res.data : app
      ));
      toast.success('Application status updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating application status');
      toast.error('Error updating application status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [applications]);

  const addApplicationNote = useCallback(async (applicationId, note) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.post(
        `http://localhost:5000/api/applications/${applicationId}/notes`,
        { text: note },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setApplications(applications.map(app => 
        app._id === applicationId ? res.data : app
      ));
      toast.success('Note added successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding note');
      toast.error('Error adding note');
      return false;
    } finally {
      setLoading(false);
    }
  }, [applications]);

  const applyForJob = useCallback(async (jobId, formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );

      // Refresh applications after successful submission
      await fetchApplications();
      
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }, [fetchApplications]);

  const value = {
    applications,
    loading,
    error,
    fetchApplications,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    addApplicationNote,
    applyForJob
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}; 