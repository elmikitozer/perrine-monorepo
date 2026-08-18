import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';
import InitialSplash from '@/components/layout/InitialSplash';
import Navigation from '@/components/layout/Navigation';
import './globals.css';

const mullerNext = localFont({
  src: [
    { path: './fonts/MullerNextTrial-Thin.woff2', weight: '100', style: 'normal' },
    { path: './fonts/MullerNextTrial-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/MullerNextTrial-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

// Sur Vercel, VERCEL_PROJECT_PRODUCTION_URL est fourni automatiquement : les URLs
// canoniques et les images de partage restent justes même sans variable manuelle.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3002');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'PV Studio',
  description: 'Perrine Vael Roquere Studio',
  openGraph: {
    title: 'PV Studio',
    description: 'Perrine Vael Roquere Studio',
    images: [{ url: '/images/logo/logotype-a.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/logo/logotype-a.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${mullerNext.variable} font-sans min-h-screen flex flex-col bg-gray-50`}>
        <InitialSplash />
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 px-6 py-8 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/images/monogramme/monogramme-noir.png"
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
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-brand transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-brand transition-colors duration-300"
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
