import Image from 'next/image';
import InitialSplash from '@/components/layout/InitialSplash';
import Navigation from '@/components/layout/Navigation';
import { personName, siteName, siteUrl } from '@/lib/site';
import { client } from '@/sanity/lib/client';
import { aboutQuery } from '@/sanity/lib/queries';
import type { AboutPage } from '@/types/sanity';

async function getPersonJsonLd() {
  let about: AboutPage | null = null;
  try {
    about = await client.fetch(aboutQuery, {}, { cache: 'no-store' });
  } catch (error) {
    console.error('Error fetching about data for structured data:', error);
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personName,
    url: siteUrl,
    jobTitle: 'Coordination de défilés & direction artistique mode',
    email: about?.email,
    sameAs: [about?.instagram, about?.linkedin].filter(Boolean),
    worksFor: { '@type': 'Organization', name: siteName, url: siteUrl },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = await getPersonJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
              href="https://www.instagram.com/perrinevaelroquerestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-brand transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/perrinevaelroquerestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wider-custom text-gray-400 uppercase hover:text-brand transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
