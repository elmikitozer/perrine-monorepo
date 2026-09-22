import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { siteDescription, siteName, siteUrl } from '@/lib/site';
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
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s — ${siteName}` },
  description: siteDescription,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName,
    title: siteName,
    description: siteDescription,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${mullerNext.variable} font-sans min-h-screen flex flex-col bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
