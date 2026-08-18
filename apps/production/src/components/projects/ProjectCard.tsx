'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import type { Project } from '@/types/sanity';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const imageUrl = project.image
    ? urlForImage(project.image)?.width(1000).quality(78).fit('max').auto('format').url()
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
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover"
          placeholder={project.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={project.image?.asset?.metadata?.lqip ?? undefined}
          priority={index < 4}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#ece7e9]">
          <span className="text-xs uppercase tracking-[0.18em] text-gray-400">{project.title}</span>
        </div>
      )}

      <div className="hover-veil">
        <div className="hover-veil__scrim" />
        <div className="hover-veil__text">
          <p className="text-[11px] uppercase tracking-[0.26em] text-gray-900 md:text-xs">
            {project.title}
          </p>
          {caption && (
            <p className="hover-veil__caption text-[10px] uppercase tracking-[0.2em] text-gray-700">
              {caption}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <article
      className="project-card rise-in group relative h-full w-full overflow-hidden bg-[#ece7e9]"
      style={{ animationDelay: `${80 + Math.min(index * 60, 420)}ms` }}
    >
      {href ? (
        <Link href={href} className="block h-full w-full" onMouseEnter={warmupTransitionAssets}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}
