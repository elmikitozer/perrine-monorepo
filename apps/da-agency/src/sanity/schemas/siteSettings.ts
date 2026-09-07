/**
 * Réglages du site — document unique (singleton).
 *
 * Tout ce qui n'est pas un projet : le texte de la page à propos, le portrait
 * d'agence, les comptes sociaux, les mentions légales. Un seul document, à
 * l'identifiant fixe `siteSettings`, que la structure du studio ouvre
 * directement (sanity.config.ts) : la cliente ne peut ni en créer un second,
 * ni supprimer celui-ci.
 *
 * Le texte à propos reprend la structure de content/about.ts : des sections
 * avec un intertitre et des paragraphes. Le premier intertitre est le titre de
 * la page (h1), les suivants sont des h2. Trois sections aujourd'hui ; la page
 * en accepte moins, pas plus.
 */

import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'about', title: 'À propos', default: true },
    { name: 'social', title: 'Réseaux' },
    { name: 'legal', title: 'Mentions légales' },
  ],
  fields: [
    defineField({
      name: 'about',
      title: 'Texte de la page À propos',
      type: 'array',
      group: 'about',
      description:
        'Trois sections au plus. La première donne le titre de la page ; son premier paragraphe est mis en avant en gros corps.',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aboutSection',
          title: 'Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Intertitre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Paragraphes',
              type: 'array',
              description: 'Un élément par paragraphe.',
              of: [defineArrayMember({ type: 'text', rows: 5 })],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: { title: 'heading', body: 'body' },
            prepare({ title, body }) {
              const count = Array.isArray(body) ? body.length : 0;
              return { title, subtitle: `${count} paragraphe${count > 1 ? 's' : ''}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait de l’agence',
      type: 'image',
      group: 'about',
      description: 'Affiché en bas de la page À propos, en 3:2. Tant qu’il manque, la page réserve sa place.',
      options: { hotspot: true, metadata: ['lqip', 'blurhash'] },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'social',
      description: 'Adresse complète de la page. Ex : https://www.linkedin.com/company/…',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      group: 'social',
      description: 'Adresse complète du compte. Ex : https://www.instagram.com/…',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'legalNotice',
      title: 'Mentions légales',
      type: 'text',
      group: 'legal',
      rows: 12,
      description:
        'Nom de la structure, numéro d’entreprise, adresse, hébergeur. Un paragraphe par ligne vide. Tant que ce champ est vide, la page /legal affiche une ligne d’attente.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Réglages du site' };
    },
  },
});
