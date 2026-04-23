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

  const href = project.slug?.current ? `/projects/${project.slug.current}` : null;
  const hoverPatternUrl = '/images/motifs/jpg/vuittonage_rose.jpg';

  const inner = (
    <>
      {imageUrl ? (
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-45"
            placeholder={project.image?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={project.image?.metadata?.lqip ?? undefined}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-45 mix-blend-multiply"
            style={{
              backgroundImage: `url('${hoverPatternUrl}')`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 30%, rgba(0, 0, 0, 0.45) 52%, rgba(0, 0, 0, 0.12) 68%, rgba(0, 0, 0, 0) 82%)',
              maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 30%, rgba(0, 0, 0, 0.45) 52%, rgba(0, 0, 0, 0.12) 68%, rgba(0, 0, 0, 0) 82%)',
            }}
          />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-[#f572b6]/12 via-[#f572b6]/4 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/50 via-black/18 to-transparent" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end">
            <div className="p-5 w-full relative z-10">
              {project.client && (
                <p className="text-white/80 text-xs tracking-wider-custom uppercase font-light">
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
      className="project-card group relative overflow-hidden bg-gray-100"
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
