import Image from 'next/image';
import Link from 'next/link';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import type { Project } from '@/types/sanity';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image
    ? urlForImage(project.image)?.width(1200).quality(85).url()
    : null;

  const isPortrait =
    project.image?.metadata?.dimensions?.aspectRatio != null &&
    project.image.metadata.dimensions.aspectRatio < 1;

  const href = project.slug?.current ? `/projects/${project.slug.current}` : null;

  const inner = (
    <>
      {imageUrl ? (
        <div className="relative w-full h-full min-h-[280px]">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            placeholder={project.image?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={project.image?.metadata?.lqip ?? undefined}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-end opacity-0 hover:opacity-100">
            <div className="p-4 w-full">
              {project.client && (
                <p className="text-white text-xs tracking-wider-custom uppercase font-light">
                  {project.client}
                </p>
              )}
              <p className="text-white text-sm tracking-wider-custom uppercase font-light mt-1">
                {project.title}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-[280px] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs tracking-wider-custom uppercase">
            {project.title}
          </span>
        </div>
      )}
    </>
  );

  return (
    <article
      className={`project-card relative overflow-hidden bg-gray-100 ${
        isPortrait ? 'row-span-2' : 'row-span-1'
      }`}
    >
      {href ? (
        <Link href={href} className="block w-full h-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}
