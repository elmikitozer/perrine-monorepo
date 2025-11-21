'use client';

import { useTranslations } from 'next-intl';

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
    <footer className="bg-noir text-blanc py-16 border-t border-blanc/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold mb-3 text-safran">Dix Huit Zéro Cinq</h3>
            <p className="text-blanc/60 text-sm mb-8">L&apos;art du cocktail d&apos;exception</p>
          </div>

          {/* Socials */}
          {socials && Object.values(socials).some(Boolean) && (
            <div className="text-right">
              <h4 className="font-semibold mb-4 text-blanc/80 text-sm uppercase tracking-wider">{t('follow')}</h4>
              <div className="flex gap-6 justify-end">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/60 hover:text-safran transition-colors text-sm"
                  >
                    Instagram
                  </a>
                )}
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/60 hover:text-safran transition-colors text-sm"
                  >
                    Facebook
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blanc/60 hover:text-safran transition-colors text-sm"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legal & Warning - Style premium discret */}
        <div className="border-t border-blanc/10 pt-8 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-blanc/50 text-xs leading-relaxed max-w-3xl mx-auto">
              {t('alcoholWarning')}. {t('alcoholMessage')}
            </p>
            <p className="text-blanc/40 text-xs">
              {t('responsibleDrinking')}
            </p>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-blanc/40 text-xs">
              © {new Date().getFullYear()} Dix Huit Zéro Cinq. {t('rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

