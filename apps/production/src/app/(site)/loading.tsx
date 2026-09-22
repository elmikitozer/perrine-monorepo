import ProjectGridSkeleton from '@/components/projects/ProjectGridSkeleton';

export default function Loading() {
  return (
    <div className="px-[10px] pb-16 pt-[calc(var(--nav-height)+0.625rem)]">
      <ProjectGridSkeleton />
    </div>
  );
}
