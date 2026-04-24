import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

  return (
    <div className="pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-sm tracking-wider-custom uppercase font-light">
              {project.title}
            </h1>
            {project.client && (
              <p className="text-xs text-gray-400 tracking-wider-custom uppercase mt-1">
                {project.client}{project.year ? ` — ${project.year}` : ''}
              </p>
            )}
          </div>
          <Link
            href="/"
            className="text-xs tracking-wider-custom uppercase text-gray-400 hover:text-[#F572B6] transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Gallery */}
        {allImages.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune image disponible.</p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3">
            {allImages.map((img, i) => {
              const url = urlForImage(img)?.width(1600).quality(90).url();
              if (!url) return null;
              return (
                <div key={i} className="break-inside-avoid">
                  <Image
                    src={url}
                    alt={`${project.title} — ${i + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.asset?.metadata?.lqip ?? undefined}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
