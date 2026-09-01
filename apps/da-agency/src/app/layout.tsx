import type { Metadata } from 'next';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

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
  weight: ['400', '500', '600'],
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
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans min-h-screen flex flex-col`}>
        {/*
          Le site n'a pas de logo : le nom EST son identité visuelle. Il est donc
          traité en logotype — didone, capitales, interlettrage très ouvert et
          graisse moyenne, pour que les déliés du Bodoni tiennent à cette échelle
          sans disparaître.

          Le Header et le Footer de @perrine/ui ont été retirés : ils portaient
          le nom d'un autre projet et une navigation en français.
        */}
        <header className="flex items-baseline justify-between px-3 py-6 md:px-4 md:py-8">
          <Link
            href="/"
            className="font-display text-[15px] font-medium uppercase leading-none tracking-[0.34em] transition-opacity hover:opacity-60 md:text-[18px]"
          >
            LD Productions
          </Link>
          <nav>
            <Link
              href="/about"
              className="text-[11px] uppercase tracking-[0.24em] text-neutral-500 transition-colors hover:text-neutral-900"
            >
              About
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
