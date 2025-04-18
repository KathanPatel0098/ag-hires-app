import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  currentPassword: Yup.string(),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  company: Yup.string(),
  bio: Yup.string(),
  skills: Yup.array().of(Yup.string()),
  experience: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Job title is required'),
      company: Yup.string().required('Company name is required'),
      duration: Yup.string().required('Duration is required'),
      description: Yup.string()
    })
  ),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required('Degree is required'),
      institution: Yup.string().required('Institution is required'),
      year: Yup.string().required('Year is required')
    })
  )
});

// Custom validation function to be used in the component
const validateForm = (values) => {
  const errors = {};
  
  // Password validation
  if (values.newPassword && !values.currentPassword) {
    errors.currentPassword = 'Current password is required to change password';
  }
  
  // Role-specific validation
  if (values.role === 'employer') {
    if (!values.company) {
      errors.company = 'Company name is required';
    }
    if (!values.bio) {
      errors.bio = 'Company description is required';
    }
  }
  
  return errors;
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    company: user?.company || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    role: user?.role || '',
    experience: user?.experience || [],
    education: user?.education || [],
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log('Form submission started with values:', values);
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const updateData = {
        name: values.name,
        email: values.email,
        bio: values.bio,
        experience: values.experience,
        education: values.education,
      };

      if (values.role === 'employer') {
        updateData.company = values.company;
      } else {
        updateData.skills = values.skills;
      }

      if (values.newPassword) {
        updateData.currentPassword = values.currentPassword;
        updateData.newPassword = values.newPassword;
      }

      console.log('Sending update data:', updateData);
      const result = await updateProfile(updateData);
      console.log('Update result:', result);
      
      if (result) {
        setSuccessMessage('Profile updated successfully');
        resetForm({ values: { ...values, currentPassword: '', newPassword: '', confirmPassword: '' } });
      } else {
        setErrorMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validate={validateForm}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ errors, touched, values, handleSubmit, isSubmitting, submitForm }) => (
                <Form className="space-y-6">
                  {successMessage && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            {successMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.name && touched.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.email && touched.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {values.role === 'employer' && (
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Company Name
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="company"
                            id="company"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.company && touched.company && (
                            <p className="mt-2 text-sm text-red-600">{errors.company}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          name="bio"
                          id="bio"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.bio && touched.bio && (
                          <p className="mt-2 text-sm text-red-600">{errors.bio}</p>
                        )}
                      </div>
                    </div>

                    {values.role === 'job_seeker' && (
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="skills"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Skills
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="skills"
                            id="skills"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter skills separated by commas"
                          />
                          {errors.skills && touched.skills && (
                            <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Leave these fields empty if you don't want to change your password.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.currentPassword && touched.currentPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.newPassword && touched.newPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={submitForm}
                        disabled={isLoading || isSubmitting}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isLoading || isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 