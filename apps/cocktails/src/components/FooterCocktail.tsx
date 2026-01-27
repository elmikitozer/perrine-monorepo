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
    <footer className="bg-rouge-alcool/80 backdrop-blur-sm text-blanc py-12 border-t border-blanc/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-logo text-2xl font-black mb-2 text-jaune">Dix Huit Zéro Cinq</h3>
            <p className="font-handwritten no-text-stroke text-jaune/70 text-sm">{t('tagline')}</p>
          </div>

          {/* Center: Contact Info */}
          <div className="text-center space-y-2">
            <p className="text-jaune/80 text-sm font-semibold gap-4 pb-2">{t('company')}</p>
            <p className="text-jaune/70 text-sm">
              101 Rue Damrémont, 75018 Paris
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:hello@dixhuitzerocinq.com"
                className="text-jaune/70 hover:text-jaune transition-colors text-sm hover:underline hover:decoration-jaune"
              >
                hello@dixhuitzerocinq.com
              </a>
            </div>
            {socials?.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blanc/70 hover:text-jaune transition-colors text-sm"
              >
                @dixhuitzerocinq
              </a>
            )}
          </div>

          {/* Right: Warnings & Legal */}
          <div className="text-center md:text-right space-y-3">
            <p className="text-jaune/90 text-xs leading-relaxed">
              {t('alcoholWarning')}. {t('alcoholMessage')}
            </p>
            <p className="text-jaune/90 text-xs">
              {t('responsibleDrinking')}
            </p>
            <p className="text-jaune/90 text-xs pt-2">
              © {new Date().getFullYear()} {t('company')}. {t('rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
