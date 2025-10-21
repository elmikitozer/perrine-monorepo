/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cocktail: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfc9',
          300: '#fcaea4',
          400: '#f87f6f',
          500: '#ef5844',
          600: '#dc3a26',
          700: '#b92e1c',
          800: '#99291b',
          900: '#7f281d',
        },
      },
    },
  },
  plugins: [],
};

