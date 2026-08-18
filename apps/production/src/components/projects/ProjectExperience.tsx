'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MasonryGrid from '@/components/layout/MasonryGrid';

interface GalleryItem {
  id: string;
  src: string;
  lqip?: string;
  alt: string;
  ratio?: number;
}

interface ProjectExperienceProps {
  project: {
    slug: string;
    title: string;
    client?: string;
    year?: number;
    role?: string;
  };
  gallery: GalleryItem[];
}

export default function ProjectExperience({ project, gallery }: ProjectExperienceProps) {
  const router = useRouter();

  const meta = [
    project.client ? { label: 'Client', value: project.client } : null,
    project.role ? { label: 'Rôle', value: project.role } : null,
    project.year ? { label: 'Année', value: String(project.year) } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <div className="pb-24 pt-[var(--nav-height)]">
      <header className="rise-in px-6 md:px-10">
        <div className="mx-auto max-w-5xl pb-10 pt-8 md:pb-12 md:pt-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[10px] uppercase tracking-[0.24em] text-gray-400 transition-colors duration-300 hover:text-brand"
          >
            ← Retour
          </button>

          <div className="mt-10 text-center md:mt-12">
            <h1 className="text-2xl font-thin uppercase leading-tight tracking-[0.18em] text-gray-900 md:text-4xl md:tracking-[0.22em]">
              {project.title}
            </h1>

            <dl className="mt-7 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-2 md:mt-9">
              {meta.map((item) => (
                <div key={item.label} className="flex items-baseline gap-2">
                  <dt className="text-[9px] uppercase tracking-[0.22em] text-gray-400">
                    {item.label}
                  </dt>
                  <dd className="text-[10px] uppercase tracking-[0.18em] text-gray-800">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mx-auto h-px max-w-5xl bg-black/10" />
      </header>

      <div className="px-[10px] pt-[10px]">
        <MasonryGrid ratios={gallery.map((item) => item.ratio ?? 3 / 4)} gap={10}>
          {gallery.map((item, index) => (
            <div
              key={item.id}
              className="rise-in absolute inset-0 overflow-hidden bg-[#ece7e9]"
              style={{ animationDelay: `${120 + Math.min(index * 60, 420)}ms` }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
                placeholder={item.lqip ? 'blur' : 'empty'}
                blurDataURL={item.lqip}
                priority={index < 4}
              />
            </div>
          ))}
        </MasonryGrid>
      </div>
    </div>
  );
}
