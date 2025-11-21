import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Lilita_One } from 'next/font/google';
import { Navigation } from '@/components';
import type { Metadata } from 'next';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lilitaOne = Lilita_One({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "Dix Huit Zéro Cinq - Le cocktail familial aux saveurs tropicales",
  description:
    "Découvrez l'univers unique de Dix Huit Zéro Cinq, où l'art du cocktail rencontre l'excellence.",
  icons: {
    icon: '/logo1.png',
    apple: '/logo1.png',
  },
  openGraph: {
    title: "Dix Huit Zéro Cinq - Le cocktail familial aux saveurs tropicales",
    description:
      "Découvrez l'univers unique de Dix Huit Zéro Cinq, où l'art du cocktail rencontre l'excellence.",
    images: [
      {
        url: '/images/opengraphThumbnail.webp',
        width: 1200,
        height: 630,
        alt: "Dix Huit Zéro Cinq - Le cocktail familial aux saveurs tropicales",
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dix Huit Zéro Cinq - Le cocktail familial aux saveurs tropicales",
    description:
      "Découvrez l'univers unique de Dix Huit Zéro Cinq, où l'art du cocktail rencontre l'excellence.",
    images: ['/opengraph-image.webp'],
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lilitaOne.variable} font-sans min-h-screen bg-blanc text-noir antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
