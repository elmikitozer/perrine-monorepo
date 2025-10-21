import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header, Footer } from '@perrine/ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Perrine - Direction Artistique',
  description: 'Agence de direction artistique et design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Header siteName="Perrine DA" />
        <main className="flex-1">{children}</main>
        <Footer siteName="Perrine - Direction Artistique" />
      </body>
    </html>
  );
}

