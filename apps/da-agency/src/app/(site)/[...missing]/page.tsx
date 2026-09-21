import { notFound } from 'next/navigation';

/**
 * Attrape-tout du groupe (site). Depuis que le studio a son propre layout
 * racine, une URL inconnue n'appartient plus à aucun layout et Next sert son
 * 404 nu. La faire tomber ici rend le 404 dans le layout du site, avec
 * l'en-tête et le pied de page, comme avant.
 */
export default function Missing() {
  notFound();
}
