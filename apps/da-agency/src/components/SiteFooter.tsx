/**
 * Pied de page — logo, comptes sociaux, mentions légales, année.
 *
 * Composant serveur : rien ici n'a besoin du navigateur, et le pied de page est
 * rendu sur toutes les pages. Y introduire du JavaScript coûterait un bundle
 * client sur l'accueil comme sur les fiches projet.
 *
 * Toujours sombre, quelle que soit la variante de src/config/theme.ts. Ce n'est
 * pas un parti pris graphique mais une contrainte du logo : le monogramme
 * #C0D3BF fait 1,58:1 sur blanc et 11,4:1 sur neutral-900. Il ne porte donc
 * aucune classe `dark:` : ses couleurs sont les mêmes dans les deux cas.
 *
 * Le logo est le monogramme seul (scripts/build-logo.mjs) : à 48 px, le mot
 * « Productions » du verrouillage complet ferait 3,7 px de haut. Emplacement
 * carré de 48 px, le monogramme y est contenu en entier.
 *
 * Hauteur réduite à la demande de la cliente (07/09) : une seule rangée, le
 * copyright sous le logo au lieu d'une troisième ligne, marges divisées par
 * deux. Le pied de page est une signature, pas une section.
 *
 * Un compte social sans URL n'est pas rendu du tout. Un libellé mort ou un lien
 * vers un compte deviné coûtent plus cher qu'une absence.
 */

import Link from 'next/link';

import { copyrightYear, getSiteContent, site } from '@content/site';
import { ui } from '@content/ui';
import { PlaceholderFrame } from './PlaceholderFrame';

/** Emplacement du logo : carré, 48 px. */
const LOGO_SLOT = 'h-12 w-12';

export async function SiteFooter() {
  // Les comptes viennent du studio ; un compte sans URL n'est pas rendu.
  const social = (await getSiteContent()).social.filter((account) => account.href);

  return (
    <footer className="mt-16 border-t border-neutral-800 bg-neutral-900 px-3 py-6 text-neutral-400 md:mt-20 md:px-4 md:py-7">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className={LOGO_SLOT}>
            {site.logo ? (
              // Servi tel quel : WebP sans perte déjà à sa taille, dimensions
              // déclarées, donc pas de CLS.
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
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            © {copyrightYear} {site.legalName}
          </p>
        </div>

        <nav className="flex flex-col items-end gap-2 text-[11px] uppercase tracking-[0.24em]">
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
    </footer>
  );
}

export default SiteFooter;
