import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { JobProvider } from './context/JobContext';
import { ApplicationProvider } from './context/ApplicationContext';
import ToastProvider from './components/common/ToastProvider';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import EditJob from './pages/EditJob';
import CandidateScreening from './pages/CandidateScreening';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminJobs from './pages/AdminJobs';
import AdminApplications from './pages/AdminApplications';
import MakeAdmin from './pages/MakeAdmin';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <ApplicationProvider>
          <Router>
            <ToastProvider />
            <div className="flex flex-col min-h-screen w-full">
              <Navbar />
              <main className="flex-grow w-full bg-gradient-to-b from-gray-50 to-white">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/make-admin" element={<MakeAdmin />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/jobs/new"
                    element={
                      <ProtectedRoute roles={['employer']}>
                        <CreateJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:id/edit"
                    element={
                      <ProtectedRoute roles={['employer']}>
                        <EditJob />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-applications"
                    element={
                      <ProtectedRoute roles={['job_seeker']}>
                        <MyApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/screening"
                    element={
                      <ProtectedRoute roles={['employer']}>
                        <CandidateScreening />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:jobId/screening"
                    element={
                      <ProtectedRoute roles={['employer']}>
                        <CandidateScreening />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/jobs"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/applications"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminApplications />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer />
            <Toaster position="top-right" />
          </Router>
        </ApplicationProvider>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
