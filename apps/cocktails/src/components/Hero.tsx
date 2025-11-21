'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: any;
  backgroundVideo?: any;
  cta?: React.ReactNode;
}

export function Hero({ title, subtitle, backgroundImage, backgroundVideo, cta }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-noir">
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
      <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/40 to-noir/90" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-black text-safran mb-6 tracking-tight uppercase"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-blanc/90 max-w-3xl mb-12"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-blanc/50"
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
        </motion.div>
      </div>
    </section>
  );
}


