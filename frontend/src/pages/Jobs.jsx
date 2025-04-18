import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useJob } from '../context/JobContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import JobSkeleton from '../components/common/JobSkeleton';

const Jobs = () => {
  const { user } = useAuth();
  const { jobs, getJobs, loading, error } = useJob();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    experience: ''
  });
  const initialFetchDone = useRef(false);

  // Debug log for context values and state changes
  useEffect(() => {
    console.log('Jobs - Component state:', {
      jobsCount: jobs.length,
      loading,
      error,
      userRole: user?.role,
      filters
    });
  }, [jobs, loading, error, user, filters]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Jobs - Fetching jobs with filters:', filters);
        await getJobs(filters);
      } catch (error) {
        console.error('Jobs - Error fetching jobs:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error('Failed to fetch jobs');
      }
    };

    // Only fetch on initial mount or when filters change
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchJobs();
    }
  }, [filters]);

  // Separate effect for filter changes
  useEffect(() => {
    if (initialFetchDone.current) {
      const fetchJobs = async () => {
        try {
          console.log('Jobs - Fetching jobs with filters:', filters);
          await getJobs(filters);
        } catch (error) {
          console.error('Jobs - Error fetching jobs:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          toast.error('Failed to fetch jobs');
        }
      };
      
      fetchJobs();
    }
  }, [filters, getJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log('Jobs - Filter changed:', { name, value });
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredJobs = (jobs || []).filter((job) => {
    if (!job || !job.title) return false;
    
    const matchesSearch = !filters.search || (
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (job.company?.companyName || '').toLowerCase().includes(filters.search.toLowerCase())
    );
    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation = !filters.location || (job.location || '').toLowerCase().includes(filters.location.toLowerCase());
    
    console.log('Jobs - Filtering job:', {
      jobId: job._id,
      title: job.title,
      matchesSearch,
      matchesType,
      matchesLocation
    });
    
    return matchesSearch && matchesType && matchesLocation;
  });

  if (error) {
    console.error('Jobs - Error state:', error);
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          {user?.role === 'employer' && (
            <Link
              to="/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post New Job
            </Link>
          )}
        </div>

        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700"
                >
                  Search
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by title or company"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Type
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Filter by location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill().map((_, index) => <JobSkeleton key={index} />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {job.company?.companyName}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.type}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {job.location}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 