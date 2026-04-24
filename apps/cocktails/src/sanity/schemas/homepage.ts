import { defineType, defineField } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Page d\'accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Section Hero',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre principal',
          type: 'object',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
          ],
        },
        {
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'object',
          fields: [
            { name: 'fr', type: 'text', title: 'Français' },
            { name: 'en', type: 'text', title: 'English' },
          ],
        },
        {
          name: 'backgroundImage',
          title: 'Image de fond',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'backgroundVideo',
          title: 'Vidéo de fond (optionnel)',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
      ],
    }),
    defineField({
      name: 'cocktailSection',
      title: 'Section "Le cocktail"',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'object',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
          ],
        },
        {
          name: 'story',
          title: 'Histoire',
          type: 'object',
          fields: [
            { name: 'fr', type: 'array', of: [{ type: 'block' }], title: 'Français' },
            { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'English' },
          ],
        },
        {
          name: 'bottleImage',
          title: 'Image de la bouteille',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'ctaText',
          title: 'Texte du bouton CTA',
          type: 'object',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
          ],
        },
        {
          name: 'ctaLink',
          title: 'Lien du bouton CTA',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'spiritSection',
      title: 'Section "L\'esprit Dix Huit Zéro Cinq"',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'object',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
          ],
        },
        {
          name: 'content',
          title: 'Contenu',
          type: 'object',
          fields: [
            { name: 'fr', type: 'array', of: [{ type: 'block' }], title: 'Français' },
            { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'English' },
          ],
        },
        {
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }],
        },
      ],
    }),
  ],
});



