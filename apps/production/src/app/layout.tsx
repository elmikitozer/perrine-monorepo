import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'),
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
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="py-8 px-6 md:px-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-[#F572B6] transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-[#F572B6] transition-colors duration-300"
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
