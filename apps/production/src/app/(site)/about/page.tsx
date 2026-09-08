import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';
import { siteDescription, siteName } from '@/lib/site';
import { client } from '@/sanity/lib/client';
import { aboutQuery } from '@/sanity/lib/queries';
import type { AboutPage } from '@/types/sanity';

export const dynamic = 'force-dynamic';

async function getAboutData(): Promise<AboutPage | null> {
  try {
    return await client.fetch(aboutQuery);
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'À propos',
  description: siteDescription,
  alternates: { canonical: '/about' },
  openGraph: { title: `À propos — ${siteName}`, url: '/about' },
};

export default async function About() {
  const about = await getAboutData();

  return (
    <div className="px-6 pb-24 pt-[calc(var(--nav-height)+3.5rem)] md:px-10">
      <div className="max-w-2xl mx-auto">
        <AboutContent about={about} />
      </div>
    </div>
  );
}
