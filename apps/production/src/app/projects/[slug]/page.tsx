import { notFound } from 'next/navigation';
import ProjectExperience from '@/components/projects/ProjectExperience';
import { client } from '@/sanity/lib/client';
import { projectBySlugQuery } from '@/sanity/lib/queries';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import type { Project } from '@/types/sanity';

interface Props {
  params: { slug: string };
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    return await client.fetch(projectBySlugQuery, { slug });
  } catch {
    return null;
  }
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
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (gallery.length === 0) {
    return (
      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 text-sm">Aucune image disponible.</p>
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
      }}
      gallery={gallery}
    />
  );
}
