import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dix Huit Zéro Cinq - L\'art du cocktail d\'exception',
  description: 'Découvrez l\'univers unique de Dix Huit Zéro Cinq, où l\'art du cocktail rencontre l\'excellence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
