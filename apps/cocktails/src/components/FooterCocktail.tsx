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
    <footer className="bg-noir text-blanc py-12 border-t border-blanc/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-safran">Dix Huit Zéro Cinq</h3>
            <p className="text-blanc/70 mb-4">L&apos;art du cocktail d&apos;exception</p>
            
            {/* Alcohol Warning */}
            <div className="bg-orange/10 border border-orange/30 rounded-lg p-4 mt-6">
              <p className="text-orange text-sm font-semibold mb-2">
                ⚠️ {t('alcoholWarning')}
              </p>
              <p className="text-blanc/60 text-xs leading-relaxed">
                {t('alcoholMessage')}
              </p>
            </div>
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

        <div className="border-t border-blanc/10 pt-8 text-center">
          <p className="text-blanc/50 text-sm mb-2">
            © {new Date().getFullYear()} Dix Huit Zéro Cinq. {t('rights')}.
          </p>
          <p className="text-blanc/40 text-xs">
            {t('responsibleDrinking')}
          </p>
        </div>
      </div>
    </footer>
  );
}

