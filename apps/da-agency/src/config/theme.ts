/**
 * Variante chromatique du site — un seul point de bascule.
 *
 * Deux variantes complètes, préparées le 04/09 pour arbitrage, aucune n'est
 * choisie :
 *
 *   A  site clair, pied de page sombre. Le pied de page est le seul bloc en
 *      neutral-900 : c'est ce qui rend le monogramme #C0D3BF lisible (11,4:1)
 *      sans toucher au reste.
 *   B  site entièrement sombre : fond neutral-900, texte clair, photos et
 *      boucles en relief sur le sombre.
 *
 * Mécanique : `B` pose la classe `dark` sur <html> (layout.tsx), et Tailwind
 * est en `darkMode: 'class'`. Chaque composant porte ses styles sombres en
 * `dark:` à côté des clairs. Le pied de page, lui, est sombre dans les deux
 * variantes et ne dépend pas de cette constante.
 */

export type SiteTheme = 'A' | 'B';

export const SITE_THEME: SiteTheme = 'A';

/**
 * Forme du logo dans l'en-tête, deux variantes préparées le 04/09 pour
 * arbitrage :
 *
 *   monogram            le monogramme seul, le nom en Bodoni disparaît
 *   monogram-and-name   monogramme et nom côte à côte
 *
 * L'en-tête est sombre dans les deux thèmes, comme le pied de page et pour la
 * même raison : le monogramme #C0D3BF fait 1,58:1 sur blanc et 11,4:1 sur
 * neutral-900. En thème A, en-tête et pied de page encadrent ainsi la page
 * claire de deux bandes sombres de même couleur.
 */
export type HeaderLogo = 'monogram' | 'monogram-and-name';

// Arbitré le 04/09 : monogramme seul.
export const HEADER_LOGO: HeaderLogo = 'monogram';
