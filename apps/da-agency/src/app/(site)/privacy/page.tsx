/**
 * Politique de confidentialité.
 *
 * Le texte est celui que la cliente colle dans le studio (Réglages du site,
 * Mentions légales), rendu tel quel. Rien n'est rédigé ici : une politique de
 * confidentialité inventée engage la société qui la publie. Tant que le champ
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
  title: ui.footer.privacy,
};

export default async function PrivacyPage() {
  const { privacyPolicy } = await getSiteContent();
  if (!privacyPolicy) notFound();

  return (
    <LegalArticle title={ui.footer.privacy}>
      <LegalRichText value={privacyPolicy} />
    </LegalArticle>
  );
}
