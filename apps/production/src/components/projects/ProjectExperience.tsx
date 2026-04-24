'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { useRouteTransition } from '@/components/layout/RouteTransitionProvider';

interface GalleryItem {
  id: string;
  src: string;
  lqip?: string;
  alt: string;
}

interface ProjectExperienceProps {
  project: {
    slug: string;
    title: string;
    client?: string;
    year?: number;
  };
  gallery: GalleryItem[];
}

export default function ProjectExperience({ project, gallery }: ProjectExperienceProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroImage = gallery[0]?.src ?? null;
  const { hideProjectHero, projectChromeVisible, registerProjectHero, reverseToHomeFromHero } =
    useRouteTransition();

  useEffect(() => {
    registerProjectHero({ slug: project.slug, element: heroRef.current, imageUrl: heroImage });
    return () => registerProjectHero({ slug: project.slug, element: null, imageUrl: null });
  }, [heroImage, project.slug, registerProjectHero]);

  const projectMeta = useMemo(
    () => [
      { label: 'Client', value: project.client || '—' },
      { label: 'Annee', value: project.year ? String(project.year) : '—' },
      { label: 'Slug', value: project.slug },
      { label: 'Images', value: String(gallery.length) },
    ],
    [gallery.length, project.client, project.slug, project.year],
  );

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            className={`rounded-sm border border-black/10 bg-[#fdf8f9] p-6 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-auto transition-opacity duration-500 ${
              projectChromeVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              type="button"
              onClick={reverseToHomeFromHero}
              className="mb-8 rounded-full border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gray-900 transition hover:border-[#F572B6] hover:text-[#F572B6]"
            >
              ← Retour aux projets
            </button>
            <p className="text-[10px] uppercase tracking-[0.26em] text-gray-500">
              {project.client || 'Project'}{project.year ? ` · ${project.year}` : ''}
            </p>
            <h1 className="mt-3 text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-gray-900">
              {project.title}
            </h1>

            <dl className="mt-8 border-t border-black/10">
              {projectMeta.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[96px_1fr] items-start border-b border-black/10 py-3"
                >
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{item.label}</dt>
                  <dd className="text-xs uppercase tracking-[0.14em] text-gray-800">{item.value}</dd>
                </div>
              ))}
            </dl>

          </aside>

          <section
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {gallery.map((item, index) => {
              const isHero = index === 0;
              const isWide = index === 2;
              const aspectClass = isHero ? 'aspect-[2/3]' : isWide ? 'aspect-[16/9]' : 'aspect-[4/5]';

              return (
                <div
                  key={item.id}
                  ref={isHero ? heroRef : null}
                  data-hero-target={isHero ? 'true' : undefined}
                  className={`${isWide ? 'sm:col-span-2' : ''} ${aspectClass} relative overflow-hidden bg-[#e8dde3]`}
                  style={{ visibility: isHero && hideProjectHero ? 'hidden' : 'visible' }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={isWide ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                    className="object-cover"
                    placeholder={item.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.lqip}
                    priority={isHero}
                    loading={isHero ? 'eager' : 'lazy'}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: "url('/images/motifs/jpg/vuittonage_rose.jpg')",
                      backgroundSize: '280px',
                      mixBlendMode: 'soft-light',
                      opacity: 0.16,
                    }}
                  />
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}
