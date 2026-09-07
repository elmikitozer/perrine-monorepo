/**
 * Accueil — une tuile par projet.
 *
 * Onze tuiles, onze projets, aucune répétition. Chacune mène à sa fiche.
 *
 * L'ordre n'est pas décidé ici : les projets arrivent dans l'ordre du studio
 * Sanity (content/projects.ts), que la cliente règle par glisser-déposer.
 *
 * Même famille visuelle que les deux autres sites du package : grille en fond
 * perdu, gouttières fines, titre au survol en surimpression, aucune légende
 * permanente. La grille est régulière et non en maçonnerie — avec une seule
 * tuile par projet et un ratio commun, la maçonnerie n'aurait rien à équilibrer.
 *
 * Les projets qui ont un film animent leur tuile dès qu'elle entre dans le
 * viewport, sur mobile comme sur desktop ; voir ProjectTile pour la mécanique
 * et son garde-fou reduced-motion.
 */

import { getProjects } from '@content/projects';
import { ProjectTile } from '@/components/ProjectTile';

/** Tuiles chargées sans différé : la première rangée desktop. */
const EAGER_TILES = 3;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    // Fond perdu : ni conteneur centré, ni largeur maximale.
    <ul className="grid w-full grid-cols-1 gap-[3px] px-[3px] pb-[3px] md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectTile key={project.slug} project={project} priority={index < EAGER_TILES} />
      ))}
    </ul>
  );
}
