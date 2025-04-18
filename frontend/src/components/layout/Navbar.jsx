import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#427300]">
                AG Hires
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/jobs"
                className="border-transparent text-gray-500 hover:border-[#427300] hover:text-[#427300] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
              >
                Jobs
              </Link>
              {user && (
                <>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin/dashboard"
                      className="border-transparent text-gray-500 hover:border-[#427300] hover:text-[#427300] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="border-transparent text-gray-500 hover:border-[#427300] hover:text-[#427300] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'employer' && (
                    <>
                      <Link
                        to="/jobs/new"
                        className="border-transparent text-gray-500 hover:border-[#427300] hover:text-[#427300] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
                      >
                        Post Job
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative" ref={profileMenuRef}>
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#427300]"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-[#427300] flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {user.role === 'admin' ? (
                      <>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Manage Users
                        </Link>
                        <Link
                          to="/admin/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Manage Jobs
                        </Link>
                        <Link
                          to="/admin/applications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Manage Applications
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                    )}
                    {user.role === 'job_seeker' && (
                      <Link
                        to="/my-applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Applications
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#42730015] hover:text-[#427300]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#427300] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#427300]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#427300] hover:bg-[#4f8700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#427300]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#427300]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/jobs"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#427300] hover:text-[#427300] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            {user && (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#427300] hover:text-[#427300] transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#427300] hover:text-[#427300] transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'employer' && (
                  <>
                    <Link
                      to="/jobs/new"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#427300] hover:text-[#427300] transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#427300] flex items-center justify-center text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-[#427300] hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-[#427300] hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 