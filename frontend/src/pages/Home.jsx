import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import bgImage from '../assets/images/home.jpg';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <img
          src={bgImage}
          alt="Tea plantation sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#427300]/40 to-[#427300]/40 mix-blend-multiply"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                Find Your Dream Job Today
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100 drop-shadow">
                Connect with top employers and discover opportunities that match your skills and aspirations.
              </p>
              <div className="mt-10">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#427300] bg-white hover:bg-[#42730015] transition-colors duration-300"
                >
                  Browse Jobs
                </Link>
                {user ? <Link
                  to="/dashboard"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#427300] hover:bg-[#4f8700] transition-colors duration-300"
                >
                  Get Started
                </Link> : <Link
                  to="/register"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#427300] hover:bg-[#4f8700] transition-colors duration-300"
                >
                  Get Started
                </Link>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#427300] text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Easy Job Search
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Find the perfect job with our advanced search and filtering options.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#427300] text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Professional Network
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Connect with top employers and grow your professional network.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#427300] text-white mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Secure Platform
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 