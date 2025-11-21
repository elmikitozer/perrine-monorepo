import { defineType, defineField } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'English' },
      ],
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
    }),
  ],
});


