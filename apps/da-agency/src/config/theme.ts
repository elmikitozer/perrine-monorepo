/**
 * Variante chromatique du site — un seul point de bascule.
 *
 * Deux variantes complètes ont été préparées le 04/09 pour arbitrage. La
 * cliente a validé B le 07/09 ; A reste en place, documentée et fonctionnelle,
 * mais n'est plus une option à comparer.
 *
 *   A  site clair, pied de page sombre. Le pied de page est le seul bloc en
 *      neutral-900 : c'est ce qui rend le monogramme #C0D3BF lisible (11,4:1)
 *      sans toucher au reste.
 *   B  site entièrement sombre : fond neutral-900, texte clair, photos et
 *      boucles en relief sur le sombre. VALIDÉE.
 *
 * Mécanique : `B` pose la classe `dark` sur <html> (layout.tsx), et Tailwind
 * est en `darkMode: 'class'`. Chaque composant porte ses styles sombres en
 * `dark:` à côté des clairs. En-tête et pied de page sont sombres dans les
 * deux variantes et ne dépendent pas de cette constante.
 */

export type SiteTheme = 'A' | 'B';

export const SITE_THEME: SiteTheme = 'B';

/**
 * Forme du logo dans l'en-tête.
 *
 *   lockup              le monogramme, et « PRODUCTIONS » composé dessous en
 *                       Archivo, capitales, sur la largeur du monogramme.
 *                       Composé et non pris dans l'image : le mot de l'export
 *                       Canva ferait 3,7 px de haut à cette taille. Demande
 *                       explicite de la cliente, 07/09.
 *   monogram-and-name   monogramme et nom en Bodoni côte à côte, variante du
 *                       04/09 conservée pour mémoire.
 *
 * L'en-tête est sombre dans les deux thèmes, comme le pied de page et pour la
 * même raison : le monogramme #C0D3BF fait 1,58:1 sur blanc et 11,4:1 sur
 * neutral-900.
 */
export type HeaderLogo = 'lockup' | 'monogram-and-name';

export const HEADER_LOGO: HeaderLogo = 'lockup';
