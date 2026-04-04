'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Lang = 'fr' | 'en';

const content = {
  fr: {
    tagline: 'Le goût des beaux moments',
    subtitle: "Ce site fait la promotion d'une boisson alcoolisée.",
    question: "Vous devez avoir l'âge légal pour y accéder.",
    birthdate: 'Date de naissance',
    day: 'JJ',
    month: 'MM',
    year: 'AAAA',
    enter: 'Entrer',
    remember: 'Se souvenir de moi',
    rememberNote: "Ne cochez pas si l'appareil est partagé ou accessible à des mineurs.",
    legal: "En poursuivant, vous confirmez avoir l'âge légal requis dans votre pays pour consommer de l'alcool.",
    warning: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.",
    share: 'Ne pas partager à une personne de moins de 18 ans.',
    errorEmpty: 'Veuillez remplir tous les champs.',
    errorInvalid: 'Date invalide.',
    errorAge: "Vous devez avoir 18 ans ou plus pour accéder à ce site.",
    decline: "Non, je n'ai pas l'âge légal",
    declineMsg: "Vous devez avoir 18 ans ou plus pour accéder à ce site. Ce site est réservé aux adultes en âge légal de consommer de l'alcool.",
  },
  en: {
    tagline: 'The taste of beautiful moments',
    subtitle: 'This site promotes an alcoholic beverage.',
    question: 'You must be of legal drinking age to access our site.',
    birthdate: 'Date of birth',
    day: 'DD',
    month: 'MM',
    year: 'YYYY',
    enter: 'Enter',
    remember: 'Remember me',
    rememberNote: 'Do not check if the device is shared or accessible to minors.',
    legal: 'By continuing, you confirm that you are of legal drinking age in your country.',
    warning: 'Alcohol abuse is dangerous to your health. Please drink responsibly.',
    share: 'Please do not share with anyone under 18 years of age.',
    errorEmpty: 'Please fill in all fields.',
    errorInvalid: 'Invalid date.',
    errorAge: 'You must be 18 or older to access this site.',
    decline: 'No, I am not of legal age',
    declineMsg: 'You must be 18 years or older to access this site. This site is reserved for adults of legal drinking age.',
  },
};


function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function AgeVerification() {
  const [visible, setVisible] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [lang, setLang] = useState<Lang>('fr');
  const [year, setYear] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const verified = getCookie('age_verified');
    if (!verified) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    }
    // Detect locale from URL
    if (pathname.startsWith('/en')) setLang('en');
  }, [pathname]);

  const handleSubmit = () => {
    setError('');
    if (!year) { setError(t.errorEmpty); return; }
    const y = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (y < 1900 || y > currentYear) { setError(t.errorInvalid); return; }
    if (currentYear - y < 18) { setError(t.errorAge); return; }

    const maxAge = rememberMe ? 60 * 60 * 24 * 365 : 60 * 60 * 24;
    document.cookie = `age_verified=true; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.body.style.overflow = '';
    setVisible(false);

    // Switch locale if needed
    const currentLocale = pathname.startsWith('/en') ? 'en' : 'fr';
    if (lang !== currentLocale) {
      router.push(`/${lang}${pathname.replace(/^\/(fr|en)/, '')}`);
    }
  };

  const t = content[lang];

  if (!visible) return null;

  if (declined) {
    return (
      <div className="fixed inset-0 z-[200] bg-noir flex flex-col items-center justify-center p-8 text-center">
        <div className="absolute inset-0 bg-jaune" />
        <div className="relative z-10 space-y-6 max-w-sm">
          <div className="relative w-44 h-14 mx-auto">
            <Image src="/1805_Logo rouge-jaune_horizontal_clean.png" alt="Dix Huit Zéro Cinq" fill className="object-contain" />
          </div>
          <p className="text-rouge/60 text-sm leading-relaxed mt-4">{t.declineMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] overflow-auto bg-jaune"
    >

      {/* Decorative shapes */}
      <div className="absolute -bottom-16 -left-16 w-72 h-72 opacity-20 pointer-events-none rotate-[20deg]">
        <Image src="/1805_2502_Forme2.png" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-[-40px] right-1/4 w-40 h-40 opacity-10 pointer-events-none -rotate-12">
        <Image src="/1805_2502_Forme.png" alt="" fill className="object-contain" />
      </div>

      {/* Language toggle */}
      <div className="relative z-10 flex justify-end p-5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang('fr')}
            className={`text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full transition-all ${
              lang === 'fr' ? 'text-jaune bg-rouge border border-rouge' : 'text-rouge/50 hover:text-rouge'
            }`}
          >
            FR
          </button>
          <span className="text-rouge/20 text-xs">|</span>
          <button
            onClick={() => setLang('en')}
            className={`text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full transition-all ${
              lang === 'en' ? 'text-jaune bg-rouge border border-rouge' : 'text-rouge/50 hover:text-rouge'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 min-h-[calc(100vh-60px)] flex flex-col lg:flex-row items-center justify-center gap-8 px-6 pb-8 max-w-5xl mx-auto">

        {/* LEFT — Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-md w-full"
        >
          {/* Logo */}
          <div className="relative w-44 h-14 mb-6">
            <Image
              src="/1805_Logo rouge-jaune_horizontal_clean.png"
              alt="Dix Huit Zéro Cinq"
              fill
              className="object-contain object-center lg:object-left"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="font-handwritten text-rouge text-2xl md:text-3xl mb-6 leading-snug">
            {t.tagline}
          </p>

          <div className="w-10 h-px bg-rouge/30 mb-6 mx-auto lg:mx-0" />

          {/* Subtitle */}
          <p className="text-rouge/60 text-sm mb-8 leading-relaxed max-w-xs mx-auto lg:mx-0">
            {t.subtitle} {t.question}
          </p>

          {/* Year input only */}
          <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full max-w-xs mx-auto lg:mx-0 space-y-3 mb-5">
            <label className="text-rouge/50 text-[10px] uppercase tracking-widest block text-center lg:text-left">
              {t.birthdate}
            </label>
            <input
              ref={yearRef}
              type="text"
              inputMode="numeric"
              placeholder={t.year}
              value={year}
              autoFocus
              autoComplete="off"
              name="age-year"
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              className="w-full bg-rouge/10 border border-rouge/30 rounded-xl px-4 py-4 text-rouge text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-rouge focus:border-rouge transition-all placeholder:text-rouge/30"
            />
          </form>

          {/* Remember me */}
          <div className="w-full max-w-xs mx-auto lg:mx-0 mb-5">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-4 h-4 rounded border transition-all ${rememberMe ? 'bg-rouge border-rouge' : 'border-rouge/30 bg-rouge/5'}`} />
                {rememberMe && (
                  <svg className="absolute inset-0 w-4 h-4 text-jaune pointer-events-none" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-rouge/40 text-xs leading-relaxed group-hover:text-rouge/60 transition-colors">
                <span className="text-rouge/60 font-medium">{t.remember}</span> — {t.rememberNote}
              </span>
            </label>
          </div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={error}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xs mx-auto lg:mx-0 text-rouge text-xs text-center py-2 px-4 rounded-lg bg-rouge/10 border border-rouge/30 mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="w-full max-w-xs mx-auto lg:mx-0 space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-rouge hover:bg-rouge-alcool text-jaune font-bold py-4 rounded-full uppercase tracking-wider text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-rouge/30"
            >
              {t.enter}
            </button>
            <button
              onClick={() => setDeclined(true)}
              className="w-full text-rouge/30 hover:text-rouge/60 text-xs py-2 transition-all"
            >
              {t.decline}
            </button>
          </div>

          {/* Legal */}
          <p className="mt-5 text-rouge/30 text-[10px] leading-relaxed max-w-xs mx-auto lg:mx-0 text-center lg:text-left">
            {t.legal}{' '}
            <a
              href={`/${lang}/legal#privacy`}
              className="underline decoration-rouge/20 hover:decoration-rouge/50 transition-colors"
            >
              {lang === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
            </a>
          </p>
        </motion.div>

        {/* RIGHT — Bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="relative flex-shrink-0 w-56 h-72 md:w-72 md:h-96 lg:w-[340px] lg:h-[460px] xl:w-[400px] xl:h-[540px]"
        >
          <Image
            src="/1805_bouteille_fruits_clear.png"
            alt="Dix Huit Zéro Cinq"
            fill
            className="object-contain drop-shadow-[0_20px_60px_rgba(197,25,44,0.35)]"
            priority
          />
        </motion.div>
      </div>

      {/* Footer warning */}
      <div className="relative z-10 border-t border-blanc/[0.05] py-4 px-6">
        <p className="text-rouge/30 text-[10px] text-center max-w-xl mx-auto leading-relaxed">
          {t.warning} — {t.share}
        </p>
      </div>
    </motion.div>
  );
}
