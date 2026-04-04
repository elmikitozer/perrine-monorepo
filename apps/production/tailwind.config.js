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
      // Palette officielle PV Studio — Pantone Néon coated (approximations hex)
      colors: {
        brand: {
          // Pantone 9284C — rose poudré clair
          100: '#F4B8C8',
          // Pantone 9324C — rose lavande
          200: '#EBC4DE',
          // Pantone 940C / 920C — rose doux
          300: '#F590BE',
          // Pantone 933C — rose vif
          400: '#F572B6',
          // Pantone 934C — rose chaud
          500: '#F050A0',
          // Pantone 927C — rose intense
          600: '#F03098',
          // Pantone 926C — rose corail
          700: '#F04878',
        },
      },
      backgroundImage: {
        // Dégradé principal de la charte (Pantone 9284C → 933C)
        'brand-gradient': 'linear-gradient(135deg, #F4B8C8 0%, #F572B6 100%)',
        // Dégradé horizontal (style étiquette)
        'brand-gradient-h': 'linear-gradient(90deg, #F4B8C8 0%, #F572B6 100%)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'wider-custom': '0.05em',
      },
    },
  },
  plugins: [],
};
