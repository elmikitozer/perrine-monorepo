const tileHeights = [
  'aspect-[2/3]',
  'aspect-[2/3]',
  'aspect-[2/3]',
  'aspect-[2/3]',
  'aspect-[2/3]',
  'aspect-[2/3]',
];

export default function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3" aria-hidden="true">
      {tileHeights.map((aspectClass, index) => (
        <div key={index} className={`project-skeleton ${aspectClass}`}>
          <div className="project-skeleton__sheen" />
          <div className="project-skeleton__meta">
            <div className="project-skeleton__line w-20" />
            <div className="project-skeleton__line project-skeleton__line--title w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
