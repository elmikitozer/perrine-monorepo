/**
 * Emplacement réservé pour un visuel non fourni.
 *
 * Reprend le vocabulaire des cellules sans couverture de l'accueil : cadre en
 * pointillés sur fond neutre, mention discrète en bas à gauche. L'intention est
 * qu'on lise « volontairement vide », pas « image cassée ».
 *
 * Le ratio est imposé pour réserver la hauteur : le jour où l'image arrive,
 * elle prend exactement la place déjà occupée, sans décaler la mise en page.
 *
 * L'accueil porte encore ce balisage en ligne dans src/app/page.tsx. Il devra
 * basculer sur ce composant, ce qui n'a pas été fait ici pour ne pas toucher à
 * une page hors périmètre.
 */

export function PlaceholderFrame({
  label,
  aspectRatio = '3 / 2',
  className,
}: {
  label: string;
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio }}
      className={`relative w-full overflow-hidden bg-neutral-100 ${className ?? ''}`}
    >
      <div className="absolute inset-0 flex items-end border border-dashed border-neutral-300 p-4">
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</span>
      </div>
    </div>
  );
}

export default PlaceholderFrame;
