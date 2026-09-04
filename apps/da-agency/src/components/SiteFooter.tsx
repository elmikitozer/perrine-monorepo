/**
 * Pied de page — logo, comptes sociaux, mentions légales, année.
 *
 * Composant serveur : rien ici n'a besoin du navigateur, et le pied de page est
 * rendu sur toutes les pages. Y introduire du JavaScript coûterait un bundle
 * client sur l'accueil comme sur les fiches projet.
 *
 * Toujours sombre, quelle que soit la variante de src/config/theme.ts. Ce n'est
 * pas un parti pris graphique mais une contrainte du logo : le monogramme
 * #C0D3BF fait 1,58:1 sur blanc et 11,4:1 sur neutral-900. En variante A c'est
 * le seul bloc sombre du site ; en B il se fond dans la page et seul le filet
 * haut le sépare. Il ne porte donc aucune classe `dark:` : ses couleurs sont
 * les mêmes dans les deux cas.
 *
 * Le logo est le monogramme seul (scripts/build-logo.mjs) : à 48 px, le mot
 * « Productions » du verrouillage complet ferait 3,7 px de haut. Le monogramme
 * est le même sur tout fond sombre, il n'a pas de déclinaison. Emplacement
 * carré de 48 px, le monogramme y est contenu en entier.
 *
 * Un compte social sans URL n'est pas rendu du tout. Un libellé mort ou un lien
 * vers un compte deviné coûtent plus cher qu'une absence.
 */

import Link from 'next/link';

import { copyrightYear, site } from '@content/site';
import { ui } from '@content/ui';
import { PlaceholderFrame } from './PlaceholderFrame';

/** Emplacement du logo : carré, 48 px. */
const LOGO_SLOT = 'h-12 w-12';

export function SiteFooter() {
  const social = site.social.filter((account) => account.href);

  return (
    <footer className="mt-24 border-t border-neutral-800 bg-neutral-900 px-3 py-10 text-neutral-400 md:mt-32 md:px-4 md:py-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className={LOGO_SLOT}>
          {site.logo ? (
            // Servi tel quel : c'est un WebP sans perte déjà à sa taille, et
            // next/image n'aurait rien à y optimiser. Dimensions déclarées,
            // donc pas de CLS.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.logo.monogram.src}
              alt={site.logo.alt}
              width={site.logo.monogram.width}
              height={site.logo.monogram.height}
              className="h-full w-full object-contain"
            />
          ) : (
            <PlaceholderFrame label={ui.footer.logoPlaceholder} aspectRatio="1 / 1" />
          )}
        </div>

        <nav className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.24em] md:items-end">
          {social.map((account) => (
            <a
              key={account.label}
              href={account.href}
              target="_blank"
              // noopener : la page ouverte ne doit pas garder la main sur
              // celle-ci. noreferrer suit, ces comptes n'ont pas besoin de
              // savoir d'où vient la visite.
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              {account.label}
            </a>
          ))}
          <Link href="/legal" className="transition-colors hover:text-white">
            {ui.footer.legal}
          </Link>
        </nav>
      </div>

      <p className="mt-10 text-[11px] uppercase tracking-[0.24em] text-neutral-500 md:mt-12">
        © {copyrightYear} {site.legalName}
      </p>
    </footer>
  );
}

export default SiteFooter;
