import ProjectGridSkeleton from '@/components/projects/ProjectGridSkeleton';

export default function Loading() {
  return (
    <div className="pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <ProjectGridSkeleton />
      </div>
    </div>
  );
}
