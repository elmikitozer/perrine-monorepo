'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WaterGlassIcon, WineGlassLogo, ArrowIcon } from '@/components/icons/OtherIcons';

export function CocktailSection() {
  const t = useTranslations('cocktail');

  return (
    <section id="cocktail" className="pt-6 pb-16 md:pt-8 md:pb-24 bg-transparent overflow-hidden">
      <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-screen-md lg:max-w-[1000px] xl:max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8 space-y-4"
        >
          <h2 className="font-logo text-5xl md:text-7xl font-black text-rouge">{t('title')}</h2>
          <h3 className="font-handwritten no-text-stroke text-3xl md:text-4xl text-rouge">
            {t('subtitle')}
          </h3>
          <p className="font-sans text-lg md:text-xl text-rouge/90 leading-relaxed  whitespace-preline">
            {t('description')}
          </p>
        </motion.div>

        {/* Container flex: colonne sur mobile, row sur desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Bouteille */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="relative mx-auto w-64 h-80 md:w-80 md:h-[420px] lg:w-72 lg:h-[400px] xl:w-80 xl:h-[450px] mb-12 md:mb-16 lg:mb-0 lg:flex-shrink-0"
          >
            <Image
              src="/bottle.webp"
              alt={t('title')}
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </motion.div>

          {/* Bloc Dégustation / Recette */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <div className="relative overflow-hidden py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-14">

              {/* === TEXTE RECETTE (z-10 au-dessus des décos) === */}
              <div className="relative z-10 text-center">
                <h3 className="font-handwritten no-text-stroke text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl text-rouge mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8">
                  {t('tastingTitle')}
                </h3>

                <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4">
                  <p className="font-handwritten no-text-stroke text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl text-rouge">
                    {t('iceText')}
                  </p>
                  <p className="font-handwritten no-text-stroke text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl text-rouge">
                    {t('mixLine1')}
                  </p>
                  <p className="font-handwritten no-text-stroke text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl text-rouge">
                    {t('mixLine2')}
                  </p>
                </div>

                <p className="font-handwritten no-text-stroke text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl text-rouge/80 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-6 italic">
                  {t('festiveOption')}
                </p>

                <p className="font-handwritten no-text-stroke text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl text-rouge font-bold mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-6">
                  {t('servedChilled')}
                </p>
              </div>

              {/* === VERRE À PIED (vin) — BAS-GAUCHE, remonté au bout de la flèche === */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute z-0
                  bottom-[5rem] left-[1.5rem]
                  sm:bottom-[6rem] sm:left-[9rem]
                  md:bottom-[7rem] md:left-[9.5rem]
                  lg:bottom-[8rem] lg:left-[3.5rem]
                  xl:bottom-[9rem] xl:left-[4rem]
                  2xl:bottom-[9rem] 2xl:left-[2rem]
                  w-10 h-14
                  sm:w-12 sm:h-[4.5rem]
                  md:w-14 md:h-20
                  lg:w-[4.5rem] lg:h-24
                  xl:w-20 xl:h-28
                  2xl:w-24 2xl:h-36
                  text-rouge -rotate-6"
              >
                <WineGlassLogo />
              </motion.div>

              {/* === FLÈCHE BAS-GAUCHE — inversée, pointe vers le bas/gauche === */}
              <div
                className="absolute z-0
                  bottom-[3.5rem] left-[3.5rem]
                  sm:bottom-[4.5rem] sm:left-[11rem]
                  md:bottom-[5.5rem] md:left-[12rem]
                  lg:bottom-[6rem] lg:left-[6rem]
                  xl:bottom-[7rem] xl:left-[7rem]
                  2xl:bottom-[7rem] 2xl:left-[5.5rem]
                  w-5 h-3.5
                  sm:w-6 sm:h-4
                  md:w-7 md:h-5
                  lg:w-10 lg:h-7
                  xl:w-12 xl:h-8
                  2xl:w-14 2xl:h-10
                  text-rouge rotate-[195deg] -scale-y-100"
              >
                <ArrowIcon />
              </div>

              {/* === VERRE TUMBLER (eau) — DROITE, descendu en face de "1/3 de cocktail" === */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute z-0
                  top-[4rem] right-[.5rem]
                  sm:top-[4.25rem] sm:right-[6.25rem]
                  md:top-[5.5rem] md:right-[7.5rem]
                  lg:top-[5.5rem] lg:right-[1.5rem]
                  xl:top-[6rem] xl:right-[1rem]
                  2xl:top-[6rem] 2xl:right-[0rem]
                  w-12 h-10
                  sm:w-14 sm:h-12
                  md:w-[4.5rem] md:h-14
                  lg:w-[5.5rem] lg:h-[4.5rem]
                  xl:w-24 xl:h-20
                  2xl:w-28 2xl:h-24
                  text-rouge -rotate-6"
              >
                <WaterGlassIcon />
              </motion.div>

              {/* === FLÈCHE DROITE — descendue avec le tumbler === */}
              <div
                className="absolute z-0
                  top-[6rem] right-[3rem]
                  sm:top-[7rem] sm:right-[9rem]
                  md:top-[8.5rem] md:right-[11rem]
                  lg:top-[9.5rem] lg:right-[6rem]
                  xl:top-[10.5rem] xl:right-[5.5rem]
                  2xl:top-[11.5rem] 2xl:right-[5rem]
                  w-5 h-3.5
                  sm:w-6 sm:h-4
                  md:w-7 md:h-5
                  lg:w-10 lg:h-7
                  xl:w-12 xl:h-8
                  2xl:w-14 2xl:h-10
                  text-rouge rotate-[15deg]"
              >
                <ArrowIcon />
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
