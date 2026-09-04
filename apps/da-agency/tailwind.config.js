/** @type {import('tailwindcss').Config} */
module.exports = {
  // Piloté par la classe `dark` sur <html>, posée ou non par src/config/theme.ts.
  // Pas `media` : la variante est un choix de direction artistique, pas une
  // préférence du visiteur.
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Plus de composants partagés : @perrine/ui a été retiré avec la page
    // contact héritée d'un autre site. Ce site n'a que ses propres composants.
  ],
  theme: {
    extend: {
      fontFamily: {
        // Labeur : grotesque neutre, tout le corps de texte.
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Titrage : didone, employé avec retenue (logotype, titres, intertitres).
        display: ['var(--font-display)', 'Didot', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
