import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { client } from '@/sanity/lib/client';
import { sitemapProjectsQuery } from '@/sanity/lib/queries';

interface SitemapProject {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: SitemapProject[] = [];
  try {
    projects = await client.fetch(sitemapProjectsQuery);
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project._updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
