'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { WaterGlassIcon, WineGlassLogo, ArrowIcon } from '@/components/icons/OtherIcons';

interface CocktailSectionProps {
  description: string;
}

export function CocktailSection({ description }: CocktailSectionProps) {
  return (
    <section id="cocktail" className="py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-screen-md lg:max-w-[1000px] xl:max-w-[1100px]">

        {/* Titre manuscrit style flyer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-handwritten no-text-stroke text-4xl md:text-6xl lg:text-7xl text-rouge-alcool leading-tight">
            Chaque verre
            <br />
            raconte une histoire
          </h2>
        </motion.div>

        {/* Histoire / Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6 mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <p className="font-sans text-lg md:text-xl text-rouge/90 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Bouteille avec fruits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="relative mx-auto w-64 h-80 md:w-80 md:h-[420px] lg:w-96 lg:h-[500px] mb-12 md:mb-16"
        >
          <Image
            src="/1805_bouteille_fruits_clear.png"
            alt="Bouteille Dix Huit Zéro Cinq avec fruits"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </motion.div>

        {/* Section Dégustation - style flyer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Titre Dégustation */}
          <h3 className="font-handwritten no-text-stroke text-3xl md:text-5xl text-rouge-alcool text-center mb-8 md:mb-12">
            Dégustation
          </h3>

          {/* Layout avec verres et recette - style flyer */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-10">


            {/* Recette au centre avec tumbler positionné */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative text-center space-y-1 md:space-y-2 flex-1 max-w-xs md:max-w-sm"
            >
              {/* Beaucoup de glaçons avec flèche vers le verre tumbler */}
              <div className="relative inline-flex justify-center">
                <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-3xl text-rouge text-center whitespace-nowrap">
                  Beaucoup de glaçons
                </p>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-1 md:ml-4 w-8 h-6 md:w-20 md:h-14 lg:w-24 lg:h-16 text-rouge-alcool rotate-[10deg]">
                  <ArrowIcon />
                </div>
              </div>
              <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-3xl text-rouge whitespace-nowrap">
                1/3 de cocktail dix-huit zéro cinq
              </p>
              <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-3xl text-rouge">
                2/3 de jus tropical
              </p>

              {/* Verre tumbler positionné en absolu à droite */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -right-9 md:-right-28 lg:-right-48 -top-12 md:-top-28 lg:-top-32"
              >
                <div className="w-14 h-20 md:w-28 md:h-40 lg:w-36 lg:h-52 text-rouge-alcool rotate-6">
                  <WaterGlassIcon />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Option festive - style miroir de "Beaucoup de glaçons" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="relative mt-8 md:mt-12 text-center"
        >
          <div className="relative inline-flex justify-center">
            {/* Flèche à gauche du texte */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 md:mr-4 w-8 h-6 md:w-20 md:h-14 lg:w-24 lg:h-16 text-rouge-alcool rotate-[190deg]">
              <ArrowIcon />
            </div>
            <p className="font-handwritten no-text-stroke text-xl md:text-2xl lg:text-3xl text-rouge text-center whitespace-nowrap">
              Option festive : ajouter 1/3 de pétillant
            </p>
          </div>

          {/* Verre à vin positionné en absolu à gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute left-2 md:-left-10 lg:left-6 -top-12 md:-top-5 lg:-top-6"
          >
            <div className="w-14 h-20 md:w-28 md:h-40 lg:w-36 lg:h-52 text-rouge-alcool -rotate-12">
              <WineGlassLogo />
            </div>
          </motion.div>
        </motion.div>

        {/* À déguster bien frais */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="font-handwritten no-text-stroke text-2xl md:text-3xl lg:text-4xl text-rouge-alcool text-center mt-12 md:mt-16"
        >
          À déguster bien frais !
        </motion.p>

      </div>
    </section>
  );
}
