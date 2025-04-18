import { useState } from 'react';

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

export const JobCategories = ({ selectedCategories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(newCategories);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#427300]"
      >
        <span className="flex items-center">
          <span className="mr-2">Categories</span>
          {selectedCategories.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#427300] text-white">
              {selectedCategories.length}
            </span>
          )}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                selectedCategories.includes(category.id)
                  ? 'bg-[#427300] text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCategories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return (
              <span
                key={categoryId}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#427300] text-white"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
                <button
                  type="button"
                  onClick={() => toggleCategory(categoryId)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#4f8700]"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
