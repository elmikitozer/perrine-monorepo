import { ui } from '@content/ui';

/**
 * 404 du site. Sans ce fichier, Next sert son 404 par défaut hors de tout
 * layout depuis que le studio a le sien : ni en-tête ni pied de page.
 */
export default function NotFound() {
  return (
    // Marge haute alignée sur les fiches projet et la page about.
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{ui.notFound.title}</h1>
      <p className="mt-8 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 md:mt-10">
        {ui.notFound.body}
      </p>
    </div>
  );
}
