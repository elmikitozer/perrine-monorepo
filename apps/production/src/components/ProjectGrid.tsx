import ProjectCard from './ProjectCard';
import type { Project } from '@/types/sanity';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
