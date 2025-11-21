'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>('fr');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const dayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user already verified (localStorage or sessionStorage)
    const verified = localStorage.getItem('age_verified') || sessionStorage.getItem('age_verified');
    const savedLang = (localStorage.getItem('preferred_language') || sessionStorage.getItem('preferred_language')) as 'fr' | 'en' | null;

    if (!verified) {
      setIsOpen(true);
      // Focus on first input when popup opens
      setTimeout(() => {
        dayInputRef.current?.focus();
      }, 100);
    }

    if (savedLang) {
      setSelectedLanguage(savedLang);
    }
  }, []);

  const calculateAge = (birthDay: number, birthMonth: number, birthYear: number) => {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleSubmit = () => {
    setError('');

    // Validate inputs
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (!day || !month || !year) {
      setError(selectedLanguage === 'fr'
        ? 'Veuillez remplir tous les champs'
        : 'Please fill in all fields');
      return;
    }

    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError(selectedLanguage === 'fr'
        ? 'Date invalide'
        : 'Invalid date');
      return;
    }

    const age = calculateAge(dayNum, monthNum, yearNum);

    if (age < 18) {
      setError(selectedLanguage === 'fr'
        ? 'Vous devez avoir 18 ans ou plus pour accéder à ce site'
        : 'You must be 18 or older to access this site');
      return;
    }

    // Save verification and language preference (only if remember me is checked)
    if (rememberMe) {
      localStorage.setItem('age_verified', 'true');
      localStorage.setItem('preferred_language', selectedLanguage);
    } else {
      sessionStorage.setItem('age_verified', 'true');
      sessionStorage.setItem('preferred_language', selectedLanguage);
    }

    // Redirect to chosen language if different from current
    const currentLocale = pathname.split('/')[1];
    if (currentLocale !== selectedLanguage) {
      router.push(`/${selectedLanguage}`);
    }

    setIsOpen(false);
  };

  const content = {
    fr: {
      title: "Bienvenue",
      subtitle: "Vous devez avoir l'âge légal pour accéder à notre site",
      birthdate: "Date de naissance",
      day: "JJ",
      month: "MM",
      year: "AAAA",
      enter: "Entrer",
      remember: "Se souvenir de moi",
      rememberWarning: "Veuillez ne pas cocher cette case si vous utilisez un appareil partagé ou utilisé par des personnes n'ayant pas l'âge légal.",
      legal: "En poursuivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
      warning: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.",
      shareWarning: "Merci de ne pas partager à une personne âgée de moins de 18 ans.",
    },
    en: {
      title: "Welcome",
      subtitle: "You must be of legal drinking age to access our site",
      birthdate: "Date of birth",
      day: "DD",
      month: "MM",
      year: "YYYY",
      enter: "Enter",
      remember: "Remember me",
      rememberWarning: "Please do not check this box if you are using a shared device or one used by persons under the legal drinking age.",
      legal: "By continuing, you accept our terms of use and privacy policy.",
      warning: "Alcohol abuse is dangerous for your health. Please drink responsibly.",
      shareWarning: "Please do not share with anyone under 18 years of age.",
    },
  };

  const t = content[selectedLanguage];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/95 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-noir to-noir/90 border border-safran/30 rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl"
          >
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-safran mb-4">
                {t.title}
              </h1>
              <p className="text-blanc/70 text-sm leading-relaxed max-w-xs mx-auto">
                {t.subtitle}
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedLanguage('fr')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLanguage === 'fr'
                    ? 'bg-safran text-noir'
                    : 'bg-blanc/10 text-blanc/70 hover:bg-blanc/20'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLanguage === 'en'
                    ? 'bg-safran text-noir'
                    : 'bg-blanc/10 text-blanc/70 hover:bg-blanc/20'
                }`}
              >
                English
              </button>
            </div>

            {/* Date Inputs */}
            <div className="space-y-3 mb-6">
              <label className="block text-blanc/70 text-xs font-medium uppercase tracking-wider text-center">
                {t.birthdate}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  ref={dayInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t.day}
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                  className="bg-blanc/5 border border-blanc/10 rounded-lg px-4 py-3 text-blanc text-center text-sm focus:outline-none focus:ring-1 focus:ring-safran focus:border-safran transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t.month}
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                  className="bg-blanc/5 border border-blanc/10 rounded-lg px-4 py-3 text-blanc text-center text-sm focus:outline-none focus:ring-1 focus:ring-safran focus:border-safran transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t.year}
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="bg-blanc/5 border border-blanc/10 rounded-lg px-4 py-3 text-blanc text-center text-sm focus:outline-none focus:ring-1 focus:ring-safran focus:border-safran transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="mb-6 bg-blanc/5 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-blanc/20 bg-blanc/10 text-safran focus:ring-safran focus:ring-offset-0"
                />
                <span className="text-blanc/70 text-xs leading-relaxed group-hover:text-blanc/90 transition-colors">
                  <span className="font-medium text-blanc/90">{t.remember}</span>
                  <br />
                  <span className="text-blanc/50">{t.rememberWarning}</span>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-orange text-sm text-center mb-4 bg-orange/10 border border-orange/30 rounded-lg py-2 px-4"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-safran hover:bg-orange text-noir font-bold py-4 rounded-full transition-all transform hover:scale-[1.02] mb-6 uppercase tracking-wider text-sm"
            >
              {t.enter}
            </button>

            {/* Legal & Warnings */}
            <div className="space-y-3 text-center">
              <p className="text-blanc/50 text-xs leading-relaxed">
                {t.legal}
              </p>
              <div className="border-t border-blanc/10 pt-3 space-y-2">
                <p className="text-blanc/40 text-xs leading-relaxed">
                  {t.warning}
                </p>
                <p className="text-blanc/30 text-xs">
                  {t.shareWarning}
                </p>
              </div>
              <p className="text-blanc/30 text-xs pt-2">
                © {new Date().getFullYear()} Dix Huit Zéro Cinq
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

