import ProjectGrid from '@/components/ProjectGrid';
import { client } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import type { Project } from '@/types/sanity';

async function getProjects(): Promise<Project[]> {
  try {
    return await client.fetch(projectsQuery);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-gray-400 tracking-wider-custom uppercase text-sm">
              Aucun projet pour le moment
            </p>
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </div>
  );
}
