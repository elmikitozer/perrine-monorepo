import ProjectGrid from '@/components/projects/ProjectGrid';
import { client } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import type { Project } from '@/types/sanity';

// Sans ça, Next prérend cette page une seule fois au build : un Publish dans
// Sanity (réordonner, changer un titre, une image...) n'apparaîtrait jamais
// sur le site sans redéploiement manuel.
export const dynamic = 'force-dynamic';

const ENABLE_ARTIFICIAL_LOADING_DELAY = false;
const ARTIFICIAL_LOADING_DELAY_MS = 1500;

async function waitForSkeletonPreview() {
  if (!ENABLE_ARTIFICIAL_LOADING_DELAY) return;

  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_LOADING_DELAY_MS));
}

async function getProjects(): Promise<Project[]> {
  try {
    await waitForSkeletonPreview();
    return await client.fetch(projectsQuery, {}, { cache: 'no-store' });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="pb-16 pt-[calc(var(--nav-height)+0.625rem)]">
      <h1 className="sr-only">Projets</h1>
      {projects.length === 0 ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm uppercase tracking-wider-custom text-gray-400">
            Aucun projet pour le moment
          </p>
        </div>
      ) : (
        <div className="px-[10px]">
          <ProjectGrid projects={projects} />
        </div>
      )}
    </div>
  );
}
