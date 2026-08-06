'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import type { Project } from '@/types/sanity';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image
    ? urlForImage(project.image)?.width(900).quality(78).fit('max').auto('format').url()
    : null;
  const galleryWarmupUrls =
    project.images?.slice(0, 3).map((image) =>
      urlForImage(image)?.width(1400).quality(80).fit('max').auto('format').url(),
    ).filter((url): url is string => Boolean(url)) ?? [];

  const href = project.slug?.current ? `/projects/${project.slug.current}` : null;
  const router = useRouter();
  const warmedUrlsRef = useRef(new Set<string>());

  const warmupTransitionAssets = () => {
    if (!href) return;
    router.prefetch(href);

    const urls = imageUrl ? [imageUrl, ...galleryWarmupUrls] : galleryWarmupUrls;
    urls.forEach((url) => {
      if (warmedUrlsRef.current.has(url)) return;
      warmedUrlsRef.current.add(url);
      const preload = new window.Image();
      preload.decoding = 'async';
      preload.loading = 'eager';
      preload.src = url;
    });
  };

  const caption = [project.client, project.year].filter(Boolean).join(' · ');

  const inner = (
    <>
      {imageUrl ? (
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            placeholder={project.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={project.image?.asset?.metadata?.lqip ?? undefined}
          />
        </div>
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs tracking-wider-custom uppercase">
            {project.title}
          </span>
        </div>
      )}
      <div className="mt-3 min-w-0">
        <p className="truncate text-xs uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 group-hover:text-[#F572B6]">
          {project.title}
        </p>
        {caption && (
          <p className="mt-1 truncate text-[10px] uppercase tracking-[0.18em] text-gray-400">
            {caption}
          </p>
        )}
      </div>
    </>
  );

  return (
    <article className="project-card group relative">
      {href ? (
        <Link
          href={href}
          className="block w-full h-full"
          onMouseEnter={warmupTransitionAssets}
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}
