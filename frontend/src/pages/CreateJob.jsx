import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../context/JobContext';
import { toast } from 'react-hot-toast';
import FormField from '../components/common/FormField';
import { JobCategories } from '../components/common/JobCategories';

// Define the categories array directly in this file
const categories = [
  { id: 'engineering', name: 'Engineering', icon: '🔧' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌱' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'management', name: 'Management', icon: '👔' },
  { id: 'sales', name: 'Sales', icon: '💰' },
  { id: 'marketing', name: 'Marketing', icon: '📊' },
  { id: 'customer-service', name: 'Customer Service', icon: '👥' },
  { id: 'operations', name: 'Operations', icon: '⚙️' },
  { id: 'research', name: 'Research', icon: '🔬' },
  { id: 'education', name: 'Education', icon: '📚' },
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createJob } = useJob();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: [''],
    skills: [''],
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleArrayChange = (name, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((item, i) => (i === index ? value : item)),
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const addArrayItem = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ''],
    }));
  };

  const removeArrayItem = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.type) {
      newErrors.type = 'Job type is required';
    } else if (!['full-time', 'part-time', 'contract', 'internship'].includes(formData.type)) {
      newErrors.type = 'Invalid job type';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.requirements.some((req) => !req.trim())) {
      newErrors.requirements = 'All requirements must be filled';
    }
    if (formData.skills.some((skill) => !skill.trim())) {
      newErrors.skills = 'All skills must be filled';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      // Format the data to match the backend model
      const jobData = {
        ...formData,
        // Remove empty strings from arrays
        requirements: formData.requirements.filter(req => req.trim()),
        skills: formData.skills.filter(skill => skill.trim()),
        // Parse salary if it's a string
        salary: formData.salary ? {
          min: parseInt(formData.salary.split('-')[0]),
          max: parseInt(formData.salary.split('-')[1]),
          currency: 'USD'
        } : undefined
      };
      
      const success = await createJob(jobData);
      if (success) {
        toast.success('Job created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Job creation error:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Create New Job</h1>
        <p className="mt-2 text-lg text-gray-600">
          Fill in the details to post a new job opportunity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              touched={touched.title}
              placeholder="e.g. Senior Agricultural Engineer"
              required
            />
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              touched={touched.location}
              placeholder="e.g. Remote, New York, etc."
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 ${
                  errors.type && touched.type ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select a job type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              {errors.type && touched.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 ${
                  errors.category && touched.category ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && touched.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            <FormField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              error={errors.salary}
              touched={touched.salary}
              placeholder="e.g. $50,000 - $70,000"
              required
            />
          </div>

          <div className="mt-6">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              touched={touched.description}
              placeholder="Detailed job description..."
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) =>
                    handleArrayChange('requirements', index, e.target.value)
                  }
                  className={`flex-1 rounded-md shadow-sm ${
                    errors.requirements && touched.requirements
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#427300] focus:border-[#427300]'
                  } sm:text-sm text-gray-900`}
                  placeholder={`Requirement ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="mt-2 text-sm text-[#427300] hover:text-[#4f8700]"
            >
              + Add Requirement
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleArrayChange('skills', index, e.target.value)
                  }
                  className={`flex-1 rounded-md shadow-sm ${
                    errors.skills && touched.skills
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#427300] focus:border-[#427300]'
                  } sm:text-sm text-gray-900`}
                  placeholder={`Skill ${index + 1}`}
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('skills', index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('skills')}
              className="mt-2 text-sm text-[#427300] hover:text-[#4f8700]"
            >
              + Add Skill
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#427300] hover:bg-[#4f8700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#427300]"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob; 