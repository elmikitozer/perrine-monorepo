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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: 'Dix Huit Zéro Cinq - Un cocktail à partager. Des souvenirs à créer.',
  description:
    "Dix Huit Zéro Cinq est bien plus qu'un cocktail. C'est une histoire que l'on partage, transmise au fil des années, pensée pour accompagner et célébrer les plus beaux moments.",
  icons: {
    icon: '/og.png',
    apple: '/og.png',
  },
  openGraph: {
    title: 'Dix Huit Zéro Cinq - Un cocktail à partager. Des souvenirs à créer.',
    description:
      "Dix Huit Zéro Cinq est bien plus qu'un cocktail. C'est une histoire que l'on partage, transmise au fil des années, pensée pour accompagner et célébrer les plus beaux moments.",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Dix Huit Zéro Cinq - Un cocktail à partager. Des souvenirs à créer.',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dix Huit Zéro Cinq - Un cocktail à partager. Des souvenirs à créer.',
    description:
      "Dix Huit Zéro Cinq est bien plus qu'un cocktail. C'est une histoire que l'on partage, transmise au fil des années, pensée pour accompagner et célébrer les plus beaux moments.",
    images: ['/og.png'],
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

