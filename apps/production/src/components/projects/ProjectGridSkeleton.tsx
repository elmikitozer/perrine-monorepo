const tileAspects = [
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[2/3]',
  'aspect-[1/1]',
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[2/3]',
  'aspect-[3/4]',
];

export default function ProjectGridSkeleton() {
  return (
    <div
      className="columns-2 [column-gap:10px] md:columns-3 xl:columns-4"
      aria-hidden="true"
    >
      {tileAspects.map((aspectClass, index) => (
        <div
          key={index}
          className={`project-skeleton mb-[10px] break-inside-avoid ${aspectClass}`}
        >
          <div className="project-skeleton__sheen" />
        </div>
      ))}
    </div>
  );
}
