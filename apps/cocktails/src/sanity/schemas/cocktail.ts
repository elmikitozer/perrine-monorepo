import { defineType, defineField } from 'sanity';

export const cocktail = defineType({
  name: 'cocktail',
  title: 'Cocktail',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du cocktail',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'English' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.fr',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'fr', type: 'array', of: [{ type: 'block' }], title: 'Français' },
        { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'English' },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'object',
      fields: [
        {
          name: 'fr',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Français',
        },
        {
          name: 'en',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'English',
        },
      ],
    }),
    defineField({
      name: 'recipe',
      title: 'Recette',
      type: 'object',
      fields: [
        {
          name: 'fr',
          type: 'array',
          of: [{ type: 'block' }],
          title: 'Français',
        },
        {
          name: 'en',
          type: 'array',
          of: [{ type: 'block' }],
          title: 'English',
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name.fr',
      media: 'mainImage',
    },
  },
});


