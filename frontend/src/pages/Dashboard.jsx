import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJob } from '../context/JobContext';
import { useApplication } from '../context/ApplicationContext';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobs, getJobs, loading: jobsLoading } = useJob();
  const { applications, fetchApplications, loading: appsLoading } = useApplication();
  const [isLoading, setIsLoading] = useState(true);

  // Debug log for context values
  useEffect(() => {
    console.log('Dashboard - Auth state:', { user, authLoading });
    console.log('Dashboard - Job state:', { jobs, jobsLoading });
    console.log('Dashboard - Application state:', { applications, appsLoading });
  }, [user, authLoading, jobs, jobsLoading, applications, appsLoading]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // console.log('Dashboard - Loading data for user:', user);
        if (user?.role === 'employer' && user?.id) {
          // console.log('Dashboard - Fetching jobs for employer:', user.id);
          await getJobs({ employerId: user.id });
        } else if (user?.id) {
          // console.log('Dashboard - Fetching applications for user:', user.id);
          await fetchApplications();
        }
      } catch (error) {
        console.error('Dashboard - Error loading data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading, getJobs, fetchApplications]);

  if (authLoading || isLoading || jobsLoading || appsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome, {user?.name}!
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {user?.role === 'employer'
                ? 'Manage your job postings and applications'
                : 'Track your job applications and find new opportunities'}
            </p>
          </div>

          {user?.role === 'employer' ? (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Job Postings</h2>
                <Link
                  to="/jobs/new"
                  className="bg-[#427300] text-white px-4 py-2 rounded-md hover:bg-[#4f8700] transition-colors duration-300"
                >
                  Post New Job
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-[#427300] hover:text-[#4f8700] transition-colors duration-300"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/jobs/${job._id}/screening`}
                        className="bg-[#427300] text-white px-4 py-2 rounded-md hover:bg-[#4f8700] transition-colors duration-300"
                      >
                        Screen Candidates
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-medium text-gray-900">
                  Your Applications
                </h4>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Jobs
                </Link>
              </div>

              {applications.length === 0 ? (
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No applications yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start applying to jobs to see them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h5 className="text-lg font-medium text-gray-900">
                          {application.job.title}
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                          {application.job.company}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                          <Link
                            to={`/jobs/${application.job.id}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View Job
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 