/**
 * Mentions légales.
 *
 * La page existe et est liée depuis le pied de page, mais elle n'a pas encore
 * de texte : nom de la structure, numéro d'entreprise et adresse viennent de la
 * cliente. Rien n'est rédigé ici en attendant — des mentions légales inventées
 * engagent la société qui les publie.
 *
 * Le jour où le texte arrive, la cliente le saisit dans le studio (Réglages
 * du site, Mentions légales) et il remplace la ligne d'attente sans toucher à
 * ce fichier.
 */

import type { Metadata } from 'next';

import { getSiteContent } from '@content/site';
import { ui } from '@content/ui';
import { LEGAL_PARAGRAPH, LegalArticle } from '@/components/LegalArticle';

// Statique malgré la lecture Sanity en `no-store` : voir content/projects.ts.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: ui.footer.legal,
};

export default async function LegalPage() {
  const site = await getSiteContent();

  return (
    <LegalArticle title={ui.footer.legal}>
      <div className="space-y-4">
        {site.legalNotice.length > 0 ? (
          site.legalNotice.map((paragraph) => (
            <p key={paragraph} className={LEGAL_PARAGRAPH}>
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
            {ui.legal.pending}
          </p>
        )}
      </div>
    </LegalArticle>
  );
}
