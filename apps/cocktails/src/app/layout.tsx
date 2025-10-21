import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header, Footer } from '@perrine/ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Cocktails - Recettes Familiales',
  description: 'Découvrez nos recettes de cocktails traditionnels et créatifs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Header siteName="🍸 Cocktails" />
        <main className="flex-1">{children}</main>
        <Footer siteName="Cocktails - Recettes Familiales" />
      </body>
    </html>
  );
}

