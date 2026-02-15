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
          className="text-center mb-12 md:mb-16 space-y-4"
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
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <h3 className="font-handwritten no-text-stroke text-3xl md:text-5xl lg:text-4xl text-rouge text-center lg:text-left mb-6 md:mb-8 lg:mb-6">
                {t('tastingTitle')}
              </h3>

              <div className="flex flex-col md:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 md:gap-6 lg:gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="relative text-center lg:text-left space-y-1 md:space-y-2 flex-1 max-w-xs md:max-w-sm"
                >
                  <div className="relative inline-flex justify-center lg:justify-start">
                    <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-2xl text-rouge text-center lg:text-left whitespace-nowrap">
                      {t('iceText')}
                    </p>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-1 md:ml-4 w-8 h-6 md:w-16 md:h-12 lg:w-20 lg:h-14 text-rouge rotate-[10deg]">
                      <ArrowIcon />
                    </div>
                  </div>
                  <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-2xl text-rouge whitespace-nowrap">
                    {t('mixLine1')}
                  </p>
                  <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-2xl text-rouge">
                    {t('mixLine2')}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -right-9 md:-right-20 lg:-right-2 -top-10 md:-top-14 lg:-top-24"
                  >
                    <div className="w-14 h-20 md:w-20 md:h-28 lg:w-24 lg:h-36 text-rouge rotate-6">
                      <WaterGlassIcon />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative mt-6 md:mt-10 lg:mt-6 text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start">
                <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-2xl text-rouge text-center lg:text-left whitespace-nowrap">
                  {t('festiveOption')}
                </p>
                {/* Flèche à droite du texte sur desktop */}
                <div className="hidden lg:block ml-4 w-20 h-14 text-rouge rotate-[350deg] -scale-y-100">
                  <ArrowIcon />
                </div>
                {/* Verre à pied juste après la flèche sur desktop */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden lg:block -ml-4 mt-28"
                >
                  <div className="w-24 h-36 text-rouge rotate-12">
                    <WineGlassLogo />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="font-handwritten no-text-stroke text-2xl md:text-3xl lg:text-4xl text-rouge text-center mt-12 md:mt-16"
        >
          {t('servedChilled')}
        </motion.p>
      </div>
    </section>
  );
}
