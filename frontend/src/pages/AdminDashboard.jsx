import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentJobs(data.recentJobs);
        setRecentApplications(data.recentApplications);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
        toast.error('Error loading dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#427300]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold text-[#427300]">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Jobs</h3>
          <p className="text-3xl font-bold text-[#427300]">{stats?.totalJobs || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Applications</h3>
          <p className="text-3xl font-bold text-[#427300]">{stats?.totalApplications || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {(recentUsers || []).map((user) => (
              <div key={user._id} className="border-b pb-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/admin/users"
            className="mt-4 inline-block text-[#427300] hover:text-[#4f8700]"
          >
            View all users →
          </Link>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            {(recentJobs || []).map((job) => (
              <div key={job._id} className="border-b pb-2">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/admin/jobs"
            className="mt-4 inline-block text-[#427300] hover:text-[#4f8700]"
          >
            View all jobs →
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {(recentApplications || []).map((application) => (
              <div key={application._id} className="border-b pb-2">
                <p className="font-medium">
                  {application.applicant && typeof application.applicant === 'object' 
                    ? application.applicant.name 
                    : 'Unknown User'}
                </p>
                <p className="text-sm text-gray-600">
                  {application.job && typeof application.job === 'object'
                    ? application.job.title
                    : 'Unknown Job'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/admin/applications"
            className="mt-4 inline-block text-[#427300] hover:text-[#4f8700]"
          >
            View all applications →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 