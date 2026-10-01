/**
 * Gabarit des pages légales — /legal, /privacy, /terms.
 *
 * Un titre et une colonne de 65 caractères, sous la marge haute des autres
 * pages. Les trois pages partagent ce cadre pour ne pas diverger : seul le
 * corps change, paragraphes simples pour /legal, Portable Text pour les deux
 * autres.
 *
 * LegalRichText rend le Portable Text de la cliente sans rien y ajouter. Il ne
 * connaît que ce que l'éditeur du studio propose (src/sanity/schemas/
 * siteSettings.ts) : titres h2 et h3, gras, listes, liens. Le gras est en 500
 * et non en 600 : Archivo n'est chargée qu'en 400 et 500, un 600 serait un
 * faux gras calculé par le navigateur. Il se distingue par la graisse et par
 * la couleur, celle des titres.
 */

import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';

export function LegalArticle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    // Marge haute alignée sur les fiches projet et la page about.
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
      <article className="max-w-[65ch]">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <div className="mt-8 md:mt-10">{children}</div>
      </article>
    </div>
  );
}

/** Corps de texte des pages légales, partagé avec les paragraphes de /legal. */
export const LEGAL_PARAGRAPH = 'text-lg leading-relaxed text-neutral-700 dark:text-neutral-300';

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100';

/*
 * Chaque bloc porte sa propre marge haute, annulée sur le premier : un
 * `space-y-*` sur le parent l'emporterait sur la marge plus large des titres.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={`mt-4 first:mt-0 ${LEGAL_PARAGRAPH}`}>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 text-xl font-medium tracking-tight first:mt-0 md:text-2xl">{children}</h2>
    ),
    h3: ({ children }) => <h3 className={`mt-8 text-lg first:mt-0 ${STRONG}`}>{children}</h3>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className={`mt-4 list-disc space-y-2 pl-6 first:mt-0 ${LEGAL_PARAGRAPH}`}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol className={`mt-4 list-decimal space-y-2 pl-6 first:mt-0 ${LEGAL_PARAGRAPH}`}>{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className={STRONG}>{children}</strong>,
    link: ({ value, children }) => {
      const href: string | undefined = value?.href;
      if (!href) return <>{children}</>;
      // Même règle que les comptes sociaux du pied de page : un lien vers un
      // autre site s'ouvre à part, sans garder la main sur cette page.
      const external = /^https?:/.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline decoration-neutral-400 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-current dark:hover:text-white"
        >
          {children}
        </a>
      );
    },
  },
};

export function LegalRichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
