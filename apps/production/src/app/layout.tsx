import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import './globals.css';

// DM Sans — géométriquement proche de Muller Next, disponible sur Google Fonts.
// Pour passer à Muller Next : acheter les .woff2 sur fontfabric.com
// puis suivre les instructions dans README.md
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PV Studio',
  description: 'Direction artistique mode & fashion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} font-sans min-h-screen flex flex-col bg-gray-50`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="py-8 px-6 md:px-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/monogramme-noir.png"
                alt="PV Studio"
                width={24}
                height={24}
                className="h-5 w-auto opacity-40 mix-blend-multiply"
              />
              <p className="text-xs tracking-wider-custom text-gray-400 uppercase">
                © 2026 PV Studio
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/perrinevaelroquerestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-gray-900 transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-gray-900 transition-colors duration-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
