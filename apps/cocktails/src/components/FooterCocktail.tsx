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
    <footer className="bg-blanc text-noir py-12 border-t border-noir/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Brand */}
          <div>
            <h3 className="font-display text-2xl font-black mb-2 text-safran">Dix Huit Zéro Cinq</h3>
            <p className="text-noir/60 text-sm">L&apos;art du cocktail d&apos;exception</p>
          </div>

          {/* Right: Warnings & Legal */}
          <div className="text-right space-y-3">
            <p className="text-noir/50 text-xs leading-relaxed">
              {t('alcoholWarning')}. {t('alcoholMessage')}
            </p>
            <p className="text-noir/40 text-xs">
              {t('responsibleDrinking')}
            </p>
            <p className="text-noir/30 text-xs pt-2">
              © {new Date().getFullYear()} Dix Huit Zéro Cinq. {t('rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

