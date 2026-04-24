'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { urlFor as urlForImage } from '@/sanity/lib/image';
import { useRouteTransition } from '@/components/layout/RouteTransitionProvider';
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
  const articleRef = useRef<HTMLElement | null>(null);
  const warmedUrlsRef = useRef(new Set<string>());
  const { hiddenHomeSlug, registerHomeCard, startForwardTransition } = useRouteTransition();

  useEffect(() => {
    const slug = project.slug?.current;
    if (!slug) return;

    registerHomeCard(slug, articleRef.current);
    return () => registerHomeCard(slug, null);
  }, [project.slug?.current, registerHomeCard]);

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

  const inner = (
    <>
      {imageUrl ? (
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            placeholder={project.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={project.image?.asset?.metadata?.lqip ?? undefined}
          />
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end bg-gradient-to-t from-black/70 via-[#F572B6]/10 to-transparent">
            <div className="p-5 w-full">
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
      ref={articleRef}
      data-project={project.slug?.current}
      className="project-card relative overflow-hidden bg-gray-100"
      style={{ visibility: hiddenHomeSlug === project.slug?.current ? 'hidden' : 'visible' }}
    >
      {href ? (
        <Link
          href={href}
          className="block w-full h-full"
          onMouseEnter={warmupTransitionAssets}
          onClick={(event) => {
            if (!project.slug?.current || !articleRef.current) return;
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            warmupTransitionAssets();
            startForwardTransition({
              slug: project.slug.current,
              href,
              fromEl: articleRef.current,
              imageUrl: imageUrl ?? null,
            });
          }}
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}
