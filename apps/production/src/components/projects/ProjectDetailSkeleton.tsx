const imageHeights = [
  'h-[280px]',
  'h-[420px]',
  'h-[340px]',
  'h-[380px]',
  'h-[300px]',
  'h-[440px]',
];

export default function ProjectDetailSkeleton() {
  return (
    <div className="pt-24 pb-16 px-6 md:px-12" aria-hidden="true">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="project-skeleton__line w-32" />
            <div className="project-skeleton__line w-40" />
          </div>
          <div className="project-skeleton__line w-20" />
        </div>

        <div className="columns-1 gap-3 space-y-3 md:columns-2 lg:columns-3">
          {imageHeights.map((heightClass, index) => (
            <div key={index} className={`project-skeleton break-inside-avoid ${heightClass}`}>
              <div className="project-skeleton__sheen" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
