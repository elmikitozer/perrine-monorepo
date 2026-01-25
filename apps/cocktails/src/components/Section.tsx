'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

export function Section({ children, className = '', id, fullWidth = false }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`py-20 md:py-32 ${className}`}
    >
      <div className={fullWidth ? 'w-full' : 'container mx-auto px-4 md:px-6 lg:px-8'}>
        {children}
      </div>
    </motion.section>
  );
}



