import { defineType, defineField } from 'sanity';

export const projectProduction = defineType({
  name: 'projectProduction',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL vidéo (YouTube, Vimeo, etc.)',
      type: 'url',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Vidéo', value: 'video' },
          { title: 'Photo', value: 'photo' },
          { title: 'Post-Production', value: 'post-production' },
          { title: 'Animation', value: 'animation' },
          { title: 'Documentaire', value: 'documentary' },
          { title: 'Publicité', value: 'advertising' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Projet mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'mainImage',
    },
  },
});

