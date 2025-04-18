/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#427300',
          'light': '#4f8700',
          'dark': '#345c00',
          'hover': '#42730015',
          'hover-dark': '#42730025',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, rgb(66 115 0 / 0.8), rgb(66 115 0 / 0.7))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

