import { defineType, defineField } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du site',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'languages',
      title: 'Langues disponibles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'code', type: 'string', title: 'Code (fr, en)' },
            { name: 'name', type: 'string', title: 'Nom' },
          ],
        },
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'twitter', type: 'url', title: 'Twitter' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
      ],
    }),
  ],
});



