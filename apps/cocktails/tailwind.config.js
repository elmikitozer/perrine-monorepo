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
        sans: [
          '"Avenir LT Pro"',
          '"Avenir LT Std"',
          'Avenir',
          '"Fashion Fetish"',
          'system-ui',
          'sans-serif',
        ],
        display: ['"Fashion Fetish"', 'system-ui', 'sans-serif'],
        logo: ['"Chantal"', 'system-ui', 'sans-serif'],
        handwritten: ['"DearJoe"', 'cursive'],
      },
      colors: {
        // Couleurs de base
        jaune: '#ffe500',
        rouge: '#c5192c',
        noir: '#000000',
        gris: '#b2b2b2',
        blanc: '#F5F5F5',
        // Couleurs secondaires
        'rouge-alcool': '#e4032d',
        'orange-fonce': '#e9550c',
        orange: '#f39200',
        'jaune-fonce': '#f8ac00',
        peche: '#f6ab64',
        safran: '#FFBA08',
      },
    },
  },
  plugins: [],
};
