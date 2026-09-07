import type { Metadata } from 'next';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

import { site } from '@content/site';
import { SiteFooter } from '@/components/SiteFooter';
import { HEADER_LOGO, SITE_THEME } from '@/config/theme';

/**
 * Paire typographique.
 *
 * Bodoni Moda (didone) pour le titrage : c'est le registre de la mode et du
 * luxe, celui des maisons que l'agence sert. Employé avec retenue — le
 * logotype, les titres de projet, les intertitres de la page à propos.
 *
 * Archivo (grotesque) pour le labeur : neutre et robuste, choisie pour ne pas
 * concurrencer le didone et rester lisible en paragraphe.
 *
 * Deux familles, pas une de plus.
 */
const display = Bodoni_Moda({
  subsets: ['latin'],
  // 700 pour le titre des fiches projet : la cliente le veut gras.
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
  // Next n'a pas de métriques de repli pour Bodoni Moda et échoue à calculer
  // l'ajustement automatique. On le désactive explicitement plutôt que de
  // laisser une erreur à chaque build : la pile de repli (Didot, Georgia) est
  // déclarée dans tailwind.config.js, et le didone n'est utilisé que sur de
  // courts fragments où un léger décalage au swap reste sans conséquence.
  adjustFontFallback: false,
});

const sans = Archivo({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

// Tout le site est statique, page 404 comprise : le pied de page lit Sanity en
// `no-store` (content/projects.ts) et rendrait sinon chaque route dynamique.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: {
    default: 'LD Productions',
    template: '%s — LD Productions',
  },
  // Pas de `description` : le texte de présentation existe côté client mais
  // n'est pas dans le dépôt. Une meta rédigée ici finirait dans les résultats
  // de recherche sans que personne ne l'ait validée.
  //
  // Site non lancé : on interdit l'indexation. A RETIRER AU LANCEMENT,
  // avec src/app/robots.ts.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // La classe `dark` est le seul effet de la variante B : tout le reste est
    // porté par les classes `dark:` des composants. Voir src/config/theme.ts.
    <html lang="en" className={SITE_THEME === 'B' ? 'dark' : undefined}>
      <body
        className={`${display.variable} ${sans.variable} font-sans min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}
      >
        {/*
          En-tête sombre dans les deux thèmes, comme le pied de page : c'est la
          seule façon de poser le monogramme #C0D3BF sans le recolorer (voir
          src/config/theme.ts).

          Verrouillage (HEADER_LOGO = lockup) : le monogramme sur 72 px de
          large, et « PRODUCTIONS » composé dessous en Archivo, capitales,
          interlettrage réglé pour que le mot couvre exactement la largeur du
          monogramme. Le mot est composé et non pris dans l'image : à cette
          taille, celui de l'export Canva ferait 3,7 px de haut. Mesuré dans le
          navigateur : à 8 px, « PRODUCTIONS » en Archivo fait 59,3 px sans
          interlettrage, et 1,25 px entre les lettres le portent à 72. À 9 px
          il ferait déjà 66,7 px nu, sans place pour l'interlettrage demandé ;
          un monogramme plus étroit imposerait un mot plus petit encore. Le mot
          est masqué aux lecteurs d'écran : l'alt du monogramme nomme le lien.

          Le Header et le Footer de @perrine/ui ont été retirés : ils portaient
          le nom d'un autre projet et une navigation en français. Le pied de
          page du site vit dans src/components/SiteFooter.tsx.
        */}
        {/*
          En-tête collant : il reste en haut de la fenêtre et le contenu passe
          dessous au défilement, ce que son fond opaque permet. `sticky` et non
          `fixed` : il garde sa place dans le flux, donc rien n'est masqué au
          chargement et les pages n'ont pas à compenser sa hauteur. z-30 passe
          au-dessus du voile des tuiles (z-10) et de la vidéo.
        */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-neutral-900 px-3 py-2.5 text-neutral-100 md:px-4 md:py-3">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-60 md:gap-5">
            {site.logo && (
              <span className="flex w-[72px] flex-col items-center gap-[5px]">
                {/*
                  Servi tel quel, comme au pied de page : WebP sans perte déjà
                  à sa taille, dimensions déclarées, pas de CLS.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.logo.monogram.src}
                  alt={site.logo.alt}
                  width={site.logo.monogram.width}
                  height={site.logo.monogram.height}
                  className="h-auto w-full"
                />
                {HEADER_LOGO === 'lockup' && (
                  <span
                    aria-hidden="true"
                    // Interlettrage en pixels, pas en em : il est réglé pour
                    // que « PRODUCTIONS » à 8 px couvre les 72 px du monogramme,
                    // mesuré dans le navigateur. Le pl compense l'espace que
                    // letter-spacing ajoute après la dernière lettre.
                    className="block w-full whitespace-nowrap text-center font-sans text-[8px] uppercase leading-none tracking-[1.25px] pl-[1.25px]"
                  >
                    Productions
                  </span>
                )}
              </span>
            )}
            {(HEADER_LOGO === 'monogram-and-name' || !site.logo) && (
              <span
                // aria-hidden quand le monogramme est là : l'alt nomme déjà le lien,
                // un lecteur d'écran n'a pas à entendre le nom deux fois.
                aria-hidden={site.logo ? true : undefined}
                className="font-display text-[15px] font-medium uppercase leading-none tracking-[0.34em] md:text-[18px]"
              >
                LD Productions
              </span>
            )}
          </Link>
          <nav>
            <Link
              href="/about"
              className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 transition-colors hover:text-white"
            >
              About
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
