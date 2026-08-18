import MasonryGrid from '@/components/layout/MasonryGrid';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types/sanity';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const ratios = projects.map(
    (project) => project.image?.asset?.metadata?.dimensions?.aspectRatio ?? 3 / 4,
  );

  return (
    <MasonryGrid ratios={ratios} gap={10}>
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </MasonryGrid>
  );
}
