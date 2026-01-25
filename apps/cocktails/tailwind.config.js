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
        display: ['"Fashion Fetish"', 'var(--font-display)', 'system-ui', 'sans-serif'],
        logo: ['"Chantal"', 'system-ui', 'sans-serif'],
        handwritten: ['"DearJoe"', 'cursive'],
      },
      colors: {
        rouge: '#A4161A',
        orange: '#E85D04',
        safran: '#FFBA08',
        noir: '#0E0E0E',
        blanc: '#F5F5F5',
      },
    },
  },
  plugins: [],
};

