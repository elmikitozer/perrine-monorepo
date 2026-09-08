import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectExperience from '@/components/projects/ProjectExperience';
import { client } from '@/sanity/lib/client';
import { projectBySlugQuery } from '@/sanity/lib/queries';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import type { Project } from '@/types/sanity';

const ENABLE_ARTIFICIAL_LOADING_DELAY = false;
const ARTIFICIAL_LOADING_DELAY_MS = 1500;

interface Props {
  params: { slug: string };
}

async function waitForSkeletonPreview() {
  if (!ENABLE_ARTIFICIAL_LOADING_DELAY) return;

  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_LOADING_DELAY_MS));
}

// `cache` évite un second appel Sanity : generateMetadata et la page partagent le résultat.
const getProject = cache(async (slug: string): Promise<Project | null> => {
  try {
    await waitForSkeletonPreview();
    return await client.fetch(projectBySlugQuery, { slug }, { cache: 'no-store' });
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);

  if (!project) {
    return { title: 'Projet introuvable' };
  }

  const title = project.title;
  const description =
    [project.role, project.client, project.year].filter(Boolean).join(' · ') ||
    'Coordination de défilé et direction artistique par Perrine Vaël-Roquère, PV Studio.';

  const cover = project.image ?? project.images?.[0];
  const ogImage = cover
    ? urlForImage(cover)?.width(1200).height(630).quality(80).fit('crop').auto('format').url()
    : null;

  const socialTitle = `${title} — PV Studio`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug?.current ?? params.slug}` },
    openGraph: {
      type: 'article',
      title: socialTitle,
      description,
      url: `/projects/${project.slug?.current ?? params.slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: project.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);

  if (!project) notFound();

  const allImages = project.images && project.images.length > 0
    ? project.images
    : project.image
    ? [project.image]
    : [];

  const gallery = allImages
    .map((img, index) => {
      const src = urlForImage(img)?.width(1400).quality(80).fit('max').auto('format').url();
      if (!src) return null;
      return {
        id: `${project._id}-${index}`,
        src,
        lqip: img.asset?.metadata?.lqip,
        alt: `${project.title} — ${index + 1}`,
        ratio: img.asset?.metadata?.dimensions?.aspectRatio,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (gallery.length === 0) {
    return (
      <div className="px-6 pb-16 pt-[calc(var(--nav-height)+2rem)] md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-gray-400">Aucune image disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectExperience
      project={{
        slug: project.slug?.current || params.slug,
        title: project.title,
        client: project.client,
        year: project.year,
        role: project.role,
      }}
      gallery={gallery}
    />
  );
}
