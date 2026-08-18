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
      // Palette officielle PV Studio — Pantone Néon coated.
      // Valeurs relevées sur le nuancier de la charte (brand-assets/), pas des approximations.
      // Les clés reprennent la référence Pantone : text-brand-933, bg-brand-9284, etc.
      colors: {
        brand: {
          DEFAULT: '#F578C2', // 933 C — rose signature, accent du site
          9284: '#F9B3CB', // rose poudré clair — logotype
          940: '#F799D1', // rose doux
          934: '#DC77C2', // rose orchidée
          927: '#D762B8', // violet rosé
          926: '#F362B8', // magenta
          939: '#FAB7B5', // pêche
          9324: '#EFB6DF', // lavande rosée — logotype
          933: '#F578C2', // rose vif — logotype
          920: '#F293CF', // rose moyen
          941: '#E98FCD', // mauve rosé
        },
      },
      backgroundImage: {
        // Dégradés de la charte
        'brand-gradient': 'linear-gradient(135deg, #F9B3CB 0%, #F578C2 100%)', // 9284 → 933
        'brand-gradient-h': 'linear-gradient(90deg, #F9B3CB 0%, #F578C2 100%)',
        'brand-gradient-magenta': 'linear-gradient(135deg, #F362B8 0%, #D762B8 100%)', // 926 → 927
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
