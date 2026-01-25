'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ContactFormClient({ locale }: { locale: string }) {
  const t = useTranslations('contact');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Placeholder for EmailJS or other email service
    // For now, just simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormState({ name: '', email: '', message: '' });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-noir/80 mb-2">
          {t('name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white border border-noir/20 rounded-xl text-noir placeholder-noir/40 focus:outline-none focus:border-safran focus:ring-2 focus:ring-safran/20 transition-all"
          placeholder={t('name')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-noir/80 mb-2">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white border border-noir/20 rounded-xl text-noir placeholder-noir/40 focus:outline-none focus:border-safran focus:ring-2 focus:ring-safran/20 transition-all"
          placeholder={t('email')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-noir/80 mb-2">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-white border border-noir/20 rounded-xl text-noir placeholder-noir/40 focus:outline-none focus:border-safran focus:ring-2 focus:ring-safran/20 transition-all resize-none"
          placeholder={t('message')}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-safran hover:bg-orange text-noir px-8 py-4 rounded-full font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '...' : t('send')}
      </motion.button>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-safran/20 border border-safran rounded-xl text-noir text-center"
        >
          Message envoyé avec succès !
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rouge/20 border border-rouge rounded-xl text-rouge text-center"
        >
          Une erreur s&apos;est produite. Veuillez réessayer.
        </motion.div>
      )}
    </form>
  );
}

