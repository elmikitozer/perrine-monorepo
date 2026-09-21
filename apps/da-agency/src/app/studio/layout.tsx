/**
 * Layout racine du studio, distinct de celui du site ((site)/layout.tsx).
 *
 * Le studio est un outil plein écran avec sa propre interface : ni en-tête, ni
 * pied de page, ni globals.css — le reset de Tailwind n'a pas à toucher ses
 * styles. Les métadonnées de next-sanity posent le viewport et le noindex.
 */
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
