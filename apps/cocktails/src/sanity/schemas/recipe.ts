import { defineType, defineField } from 'sanity';

export const recipe = defineType({
  name: 'recipe',
  title: 'Recette',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du cocktail',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
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
      name: 'story',
      title: 'Histoire / Origine',
      type: 'text',
      rows: 4,
      description: 'L\'histoire familiale ou l\'origine de cette recette',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
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
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulté',
      type: 'string',
      options: {
        list: [
          { title: 'Facile', value: 'easy' },
          { title: 'Moyen', value: 'medium' },
          { title: 'Difficile', value: 'hard' },
        ],
      },
    }),
    defineField({
      name: 'prepTime',
      title: 'Temps de préparation (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'servings',
      title: 'Portions',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'ingredient',
              title: 'Ingrédient',
              type: 'string',
            },
            {
              name: 'quantity',
              title: 'Quantité',
              type: 'string',
            },
            {
              name: 'unit',
              title: 'Unité',
              type: 'string',
              options: {
                list: ['ml', 'cl', 'oz', 'cuillère', 'trait', 'pièce', 'au goût'],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'tips',
      title: 'Conseils & Astuces',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'glass',
      title: 'Type de verre',
      type: 'string',
      options: {
        list: [
          'Verre à cocktail',
          'Verre tumbler',
          'Verre highball',
          'Coupe à champagne',
          'Verre à shot',
          'Tasse',
          'Autre',
        ],
      },
    }),
    defineField({
      name: 'garnish',
      title: 'Décoration',
      type: 'string',
      description: 'Par exemple: tranche de citron, menthe fraîche, etc.',
    }),
    defineField({
      name: 'featured',
      title: 'Recette mise en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'image',
    },
  },
});

