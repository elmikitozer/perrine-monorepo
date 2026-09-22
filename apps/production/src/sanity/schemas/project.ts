import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
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
    // Ordre d'affichage : un rang géré par @sanity/orderable-document-list,
    // que Perrine change en glissant les projets dans la liste du studio.
    orderRankField({ type: 'project', newItemPosition: 'before' }),
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
      name: 'role',
      title: 'Rôle / Mission',
      type: 'string',
      description:
        'Optionnel — ce qui a été fait sur le projet. Ex : Coordination de défilé, Direction artistique, Scénographie',
    }),
    defineField({
      name: 'images',
      title: 'Galerie du projet',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Toutes les photos affichées dans la galerie du projet',
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible sur le site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
