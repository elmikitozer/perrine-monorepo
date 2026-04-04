import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projet Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du projet',
      type: 'string',
      description: 'Ex: DIOR_SS25_1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'blurhash'] as const,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Plus petit nombre = affiché en premier',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Ex: Dior, Burberry, McQueen',
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible sur le site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title: `${order}. ${title}`,
        media,
      };
    },
  },
});
