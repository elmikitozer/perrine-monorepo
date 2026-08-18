const tileAspects = [
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[1/1]',
  'aspect-[2/3]',
  'aspect-[3/4]',
  'aspect-[4/5]',
];

export default function ProjectDetailSkeleton() {
  return (
    <div className="pb-24 pt-[var(--nav-height)]" aria-hidden="true">
      <header className="px-6 md:px-10">
        <div className="mx-auto max-w-5xl pb-10 pt-8 md:pb-12 md:pt-10">
          <div className="project-skeleton__line w-16" />
          <div className="mt-10 flex flex-col items-center gap-6 md:mt-12">
            <div className="project-skeleton__line h-3 w-56" />
            <div className="flex items-center gap-8">
              <div className="project-skeleton__line w-24" />
              <div className="project-skeleton__line w-20" />
              <div className="project-skeleton__line w-20" />
            </div>
          </div>
        </div>
        <div className="mx-auto h-px max-w-5xl bg-black/10" />
      </header>

      <div className="px-[10px] pt-[10px]">
        <div className="columns-2 [column-gap:10px] md:columns-3 xl:columns-4">
          {tileAspects.map((aspectClass, index) => (
            <div
              key={index}
              className={`project-skeleton mb-[10px] break-inside-avoid ${aspectClass}`}
            >
              <div className="project-skeleton__sheen" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
