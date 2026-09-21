/**
 * Mail et téléphone de l'agence, en liens `mailto:` et `tel:`.
 *
 * Partagé par le pied de page et la page à propos, qui n'ont ni le même corps
 * ni les mêmes couleurs : le composant rend les liens nus, l'appelant pose le
 * conteneur et les classes. Un champ absent n'est pas rendu.
 */

import type { Contact } from '@content/site';

export function ContactLinks({ contact, className }: { contact: Contact; className?: string }) {
  return (
    <>
      {contact.email && (
        <a href={`mailto:${contact.email}`} className={className}>
          {contact.email}
        </a>
      )}
      {contact.phone && (
        // `tel:` n'accepte ni espaces ni ponctuation : on garde le + et les
        // chiffres. La forme affichée reste celle que la cliente a saisie.
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className={className}>
          {contact.phone}
        </a>
      )}
    </>
  );
}
