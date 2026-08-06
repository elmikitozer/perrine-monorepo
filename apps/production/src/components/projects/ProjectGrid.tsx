import ProjectCard from './ProjectCard';
import type { Project } from '@/types/sanity';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12"
    >
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}
