'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 bg-blanc/10 backdrop-blur-md border border-blanc/20 rounded-full px-4 py-2 text-blanc hover:bg-blanc/20 transition-colors"
    >
      <span className="font-bold">{locale.toUpperCase()}</span>
      <span className="mx-1">→</span>
      <span className="opacity-70">{locale === 'fr' ? 'EN' : 'FR'}</span>
    </motion.button>
  );
}


