'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const pathname = usePathname();

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'fr';
  const newLocale = currentLocale === 'fr' ? 'en' : 'fr';

  const toggleLanguage = () => {
    const newPath = '/' + newLocale + pathname.replace(/^\/(fr|en)/, '');
    window.location.href = newPath || `/${newLocale}`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 bg-blanc/10 backdrop-blur-md border border-blanc/20 rounded-full px-4 py-2 text-blanc hover:bg-blanc/20 transition-colors"
    >
      <span className="font-bold">{currentLocale.toUpperCase()}</span>
      <span className="mx-1">→</span>
      <span className="opacity-70">{newLocale.toUpperCase()}</span>
    </motion.button>
  );
}



