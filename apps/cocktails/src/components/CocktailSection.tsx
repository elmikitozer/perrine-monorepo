'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WaterGlassIcon, WineGlassLogo, ArrowIcon } from '@/components/icons/OtherIcons';

export function CocktailSection() {
  const t = useTranslations('cocktail');

  return (
    <section id="cocktail" className="py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-screen-md lg:max-w-[1000px] xl:max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8 space-y-4"
        >
          <h2 className="font-logo text-5xl md:text-7xl font-black text-rouge">{t('title')}</h2>
          <h3 className="font-handwritten no-text-stroke text-3xl md:text-4xl text-rouge-alcool">
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

          {/* Recette */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative text-center lg:text-left"
          >
            <h3 className="font-handwritten no-text-stroke text-3xl md:text-5xl lg:text-4xl text-rouge mb-6 lg:mb-8">
              {t('tastingTitle')}
            </h3>

            <div className="relative">
              {/* Lignes de texte - flux normal */}
              <div className="flex flex-col gap-3 lg:gap-5">
                <p className="font-handwritten no-text-stroke text-sm md:text-2xl lg:text-3xl text-rouge whitespace-nowrap">
                  {t('iceText')}
                </p>
                <p className="font-handwritten no-text-stroke text-sm md:text-2xl lg:text-3xl text-rouge whitespace-nowrap">
                  {t('mixLine1')}
                </p>
                <p className="font-handwritten no-text-stroke text-sm md:text-2xl lg:text-3xl text-rouge">
                  {t('mixLine2')}
                </p>
                <p className="font-handwritten no-text-stroke text-sm md:text-2xl lg:text-3xl text-rouge whitespace-nowrap">
                  {t('festiveOption')}
                </p>
                <p className="font-handwritten no-text-stroke text-sm md:text-2xl lg:text-3xl text-rouge">
                  {t('servedChilled')}
                </p>
              </div>

              {/* Verre d'eau - en haut à droite */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -right-[1.6rem] -bottom-[2rem] right-2 sm:right-[2rem] md:right-10 lg:-right-6 xl:-right-2 -top-2 md:top-1 lg:-top-6"
              >
                <div className="w-14 h-20 md:w-20 md:h-30 lg:w-28 lg:h-40 text-rouge rotate-6">
                  <WaterGlassIcon />
                </div>
              </motion.div>

              {/* Flèche verre d'eau - entre le verre et "1/3 de cocktail" */}
              <div className="absolute right-[2rem] top-8 sm:right-[6rem] sm:bottom-[2.5rem] sm:w-8 sm:h-6 md:right-28 lg:right-20 xl:right-24 top-10 md:top-10 lg:top-12 xl:top-12 w-8 h-6 md:w-12 md:h-10 lg:w-14 lg:h-12 xl:w-20 xl:h-14 text-rouge rotate-[10deg]">
                <ArrowIcon />
              </div>

              {/* Flèche verre à pied - desktop uniquement */}
              <div className="block absolute right-[1.5rem] bottom-[1.8rem] w-8 h-6 sm:right-[6rem] sm:bottom-[2.5rem] sm:w-8 sm:h-6 text-rouge rotate-[350deg] -scale-y-100 md:block absolute md:right-[6rem] md:bottom-[2.5rem] md:w-12 md:h-10 text-rouge rotate-[350deg] -scale-y-100 lg:block absolute lg:right-[1rem] lg:bottom-[3rem] lg:w-14 lg:h-12 text-rouge rotate-[350deg] -scale-y-100 xl:block absolute xl:right-[3rem] xl:bottom-[3rem] xl:w-20 xl:h-14 text-rouge rotate-[350deg] -scale-y-100">
                <ArrowIcon />
              </div>

              {/* Verre à pied */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block absolute -right-[1.5rem] -bottom-[2.5rem] sm:right-[2rem] sm:-bottom-[2rem] md:right-[2rem] md:-bottom-6 xl:right-[-2.5rem] lg:block absolute lg:right-[-4rem] lg:-bottom-12 xl:right-[-2.5rem]"
              >
                <div className="w-14 h-20 md:w-16 md:h-24 lg:w-24 lg:h-36 text-rouge rotate-12">
                  <WineGlassLogo />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
