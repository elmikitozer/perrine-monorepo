'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: any;
  backgroundVideo?: any;
  cta?: React.ReactNode;
}

export function Hero({ title, subtitle, backgroundImage, backgroundVideo, cta }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const cocktailSection = document.getElementById('cocktail');
    if (cocktailSection) {
      if (isMobile) {
        // Mobile: scroll vers le bouton "Découvrir" (tout en bas)
        const ctaButton = cocktailSection.querySelector('a[href="/contact"]');
        if (ctaButton) {
          // Position du bouton + hauteur de viewport pour le mettre en bas
          const buttonRect = ctaButton.getBoundingClientRect();
          const scrollPosition = window.pageYOffset + buttonRect.bottom - window.innerHeight;
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        } else {
          cocktailSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Desktop: scroll normal vers le début de la section
        cocktailSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-blanc">
      {/* Background Media with Parallax Effect */}
      {backgroundVideo ? (
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </motion.video>
      ) : backgroundImage ? (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <Image
            src={urlForImage(backgroundImage).url()}
            alt="Hero background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </motion.div>
      ) : null}

      {/* Gradient Overlay - Plus subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-blanc/60 via-blanc/40 to-blanc/90" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight uppercase"
          style={{ color: '#de4842' }}
        >
          {/* Mobile: 2 lignes */}
          <span className="md:hidden">
            {title && typeof title === 'string' ? (
              <>
                {title.split(' ').slice(0, 2).join(' ')}
                <br />
                {title.split(' ').slice(2).join(' ')}
              </>
            ) : (
              title
            )}
          </span>
          {/* Desktop: 1 ligne */}
          <span className="hidden md:inline">
            {title}
          </span>
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-noir/90 max-w-3xl mb-12"
          >
            {subtitle}
          </motion.p>
        )}

        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cta}
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.a
          href="#cocktail"
          onClick={handleScrollClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-noir/50 hover:text-noir/80 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}


