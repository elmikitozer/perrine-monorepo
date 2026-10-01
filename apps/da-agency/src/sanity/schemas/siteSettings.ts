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
 *
 * Politique de confidentialité et conditions d'utilisation sont en Portable
 * Text : ce sont des documents que la cliente colle depuis un traitement de
 * texte, avec leurs titres, leurs listes et leurs liens. L'éditeur n'offre que
 * ce que les pages savent rendre — deux niveaux de titre (le h1 est le titre
 * de la page), le gras, les listes, les liens.
 */

import { defineArrayMember, defineField, defineType } from 'sanity';

/** Champ d'un document légal collé par la cliente, rendu sur sa propre page. */
function legalDocumentField(name: string, title: string, path: string) {
  return defineField({
    name,
    title,
    type: 'array',
    group: 'legal',
    description: `Rendu tel quel sur la page ${path}, liée depuis le pied de page. Tant que ce champ est vide, la page n'existe pas et son lien n'est pas affiché.`,
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Paragraphe', value: 'normal' },
          { title: 'Titre', value: 'h2' },
          { title: 'Sous-titre', value: 'h3' },
        ],
        lists: [
          { title: 'Puces', value: 'bullet' },
          { title: 'Numéros', value: 'number' },
        ],
        marks: {
          decorators: [{ title: 'Gras', value: 'strong' }],
          annotations: [
            defineArrayMember({
              name: 'link',
              title: 'Lien',
              type: 'object',
              fields: [
                defineField({
                  name: 'href',
                  title: 'Adresse',
                  type: 'url',
                  description: 'Ex : https://www.cnil.fr, mailto:info@ld.productions',
                  validation: (Rule) =>
                    Rule.required().uri({ scheme: ['https', 'http', 'mailto', 'tel'] }),
                }),
              ],
            }),
          ],
        },
      }),
    ],
  });
}

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'about', title: 'À propos', default: true },
    { name: 'social', title: 'Réseaux et contact' },
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
      description: 'Affiché en bas de la page À propos. Tant qu’il manque, rien n’est affiché à sa place.',
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
      name: 'email',
      title: 'Adresse mail',
      type: 'string',
      group: 'social',
      description: 'Affichée dans le pied de page et en bas de la page À propos, cliquable. Ex : info@ld.productions',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'social',
      description:
        'Au format international, affiché tel quel et cliquable sur téléphone. Ex : +33 6 12 34 56 78',
      validation: (Rule) =>
        Rule.regex(/^\+[\d\s().-]{6,}$/).error('Commencer par l’indicatif, ex : +33 6 12 34 56 78'),
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
    legalDocumentField('privacyPolicy', 'Politique de confidentialité', '/privacy'),
    legalDocumentField('termsOfUse', 'Conditions d’utilisation', '/terms'),
  ],
  preview: {
    prepare() {
      return { title: 'Réglages du site' };
    },
  },
});
