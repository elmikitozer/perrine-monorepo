/**
 * Conditions d'utilisation.
 *
 * Le texte est celui que la cliente colle dans le studio (Réglages du site,
 * Mentions légales), rendu tel quel. Rien n'est rédigé ici : des conditions
 * d'utilisation inventées engagent la société qui les publie. Tant que le champ
 * est vide, la page n'existe pas (404) et le pied de page ne la lie pas.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getSiteContent } from '@content/site';
import { ui } from '@content/ui';
import { LegalArticle, LegalRichText } from '@/components/LegalArticle';

// Statique malgré la lecture Sanity en `no-store` : voir content/projects.ts.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: ui.footer.terms,
};

export default async function TermsPage() {
  const { termsOfUse } = await getSiteContent();
  if (!termsOfUse) notFound();

  return (
    <LegalArticle title={ui.footer.terms}>
      <LegalRichText value={termsOfUse} />
    </LegalArticle>
  );
}
