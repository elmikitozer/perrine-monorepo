'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterCocktailProps {
  socials?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export function FooterCocktail({ socials }: FooterCocktailProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-noir text-blanc py-12 border-t border-blanc/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-safran">Dix Huit Zéro Cinq</h3>
            <p className="text-blanc/70">L&apos;art du cocktail d&apos;exception</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-blanc/70 hover:text-safran transition-colors">
                Accueil
              </Link>
              <Link href="/contact" className="text-blanc/70 hover:text-safran transition-colors">
                Contact
              </Link>
              <Link href="/shop" className="text-blanc/70 hover:text-safran transition-colors">
                Boutique
              </Link>
            </nav>
          </div>

          {/* Socials */}
          {socials && Object.values(socials).some(Boolean) && (
            <div>
              <h4 className="font-bold mb-4">{t('follow')}</h4>
              <div className="flex gap-4">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/70 hover:text-safran transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/70 hover:text-safran transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/70 hover:text-safran transition-colors"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-blanc/10 pt-8 text-center text-blanc/50 text-sm">
          <p>© {new Date().getFullYear()} Dix Huit Zéro Cinq. {t('rights')}.</p>
        </div>
      </div>
    </footer>
  );
}

