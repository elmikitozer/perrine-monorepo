import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'Page À Propos',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texte riche avec paragraphes',
    }),
    defineField({
      name: 'email',
      title: 'Email de contact',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((email: string | undefined) => {
          if (!email) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || 'Email invalide';
        }),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Page À Propos' };
    },
  },
});
