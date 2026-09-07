/**
 * Schéma « Projet » — étape 1 de la mise en place de Sanity.
 *
 * Repris du schéma de référence apps/production/src/sanity/schemas/project.ts
 * (title, slug, cover, order, client, year, gallery, isVisible) et étendu pour
 * le modèle de contenu de LD Productions : sous-titre, lieu, présentation,
 * crédits, et la chaîne vidéo.
 *
 * Trois onglets, parce que trois personnes différentes y touchent :
 *   - Contenu   ce que la cliente saisit et voit sur le site ;
 *   - Film      le master qu'elle dépose et le timecode qu'elle choisit ;
 *   - Technique les dérivés produits par les scripts (boucle, poster, proxy),
 *               en lecture seule et repliés. Ils sont là pour être vérifiés,
 *               pas édités : une valeur saisie à la main serait écrasée au
 *               prochain run.
 *
 * Le master vidéo n'est JAMAIS servi au site : c'est un HEVC 10 bits de
 * plusieurs centaines de Mo qu'aucun navigateur ne lit. Il n'est que la
 * source des dérivés.
 *
 * Les libellés sont en français : c'est ce que la cliente voit dans le studio.
 */

import { defineArrayMember, defineField, defineType } from 'sanity';

/** Métadonnées d'image demandées à Sanity : le LQIP sert de fond flou au chargement. */
const IMAGE_METADATA = ['lqip', 'blurhash'] as const;

const altField = defineField({
  name: 'alt',
  title: 'Texte alternatif',
  type: 'string',
  description:
    'Ce que lit un lecteur d’écran à la place de l’image. Une phrase courte, sans « photo de ».',
});

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'film', title: 'Film' },
    { name: 'technical', title: 'Technique' },
  ],
  fieldsets: [
    {
      name: 'derivatives',
      title: 'Dérivés produits par les scripts',
      description:
        'Remplis automatiquement à partir du master et du point de départ de la boucle. Ne pas modifier à la main : toute valeur saisie ici est écrasée au prochain traitement.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // --- Contenu ---------------------------------------------------------
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      description: 'Tel qu’il s’affiche sur le site. Ex : DIOR HAUTE JOAILLERIE - DIORAMA',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      type: 'slug',
      group: 'content',
      description: 'Généré depuis le titre. Ne plus le changer une fois le projet en ligne : l’adresse serait cassée.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Type d’événement',
      type: 'string',
      group: 'content',
      description: 'Affiché sous le titre. Ex : Showroom, Show production, Gala dinner and show production',
    }),
    defineField({
      name: 'cover',
      title: 'Image de couverture',
      type: 'image',
      group: 'content',
      description: 'Le visuel du projet sur la page d’accueil, recadré en 3:2. Choisir le point d’intérêt pour guider le recadrage.',
      options: { hotspot: true, metadata: [...IMAGE_METADATA] },
      fields: [altField],
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      group: 'content',
      description: 'Plus petit nombre = affiché en premier sur la page d’accueil.',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'content',
      description: 'Ex : Dior, Bosideng, ERL',
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      group: 'content',
      validation: (Rule) => Rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
      group: 'content',
      description: 'Ville, ou lieu de l’événement. Ex : Paris, Villa Dior',
    }),
    defineField({
      name: 'description',
      title: 'Texte de présentation',
      type: 'text',
      group: 'content',
      rows: 6,
      description: 'Quelques lignes : le contexte, ce qui a été fait, ce qu’il faut en retenir.',
    }),
    defineField({
      name: 'credits',
      title: 'Crédits',
      type: 'array',
      group: 'content',
      description: 'Qui doit être crédité, et à quel titre. Ex : Photographie — Pierre MOUTON and Adrien DIRAND',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'credit',
          title: 'Crédit',
          fields: [
            defineField({
              name: 'role',
              title: 'Rôle',
              type: 'string',
              description: 'Ex : Photographie, Réalisation, Direction artistique',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Nom',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'content',
      description: 'Toutes les photos de la fiche projet, dans l’ordre d’affichage. Glisser pour réordonner.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, metadata: [...IMAGE_METADATA] },
          fields: [altField],
        }),
      ],
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible sur le site',
      type: 'boolean',
      group: 'content',
      description: 'Décoché : le projet reste dans le studio mais disparaît du site à la prochaine publication.',
      initialValue: true,
    }),

    // --- Film ------------------------------------------------------------
    defineField({
      name: 'videoMaster',
      title: 'Film (master)',
      type: 'file',
      group: 'film',
      description:
        'Le film en pleine qualité, tel que livré par le monteur. Il n’est jamais montré tel quel sur le site : il sert à fabriquer la boucle d’accueil et la version de lecture.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'loopStart',
      title: 'Début de la boucle (secondes)',
      type: 'number',
      group: 'film',
      description:
        'Moment du film, en secondes, où démarre l’extrait de 8 secondes joué sur la page d’accueil. Sa première image sert aussi de visuel fixe. Ex : 4 pour « à 4 secondes ».',
      validation: (Rule) => Rule.min(0).precision(2),
    }),

    // --- Technique (rempli par script, lecture seule) ---------------------
    defineField({
      name: 'videoLoop',
      title: 'Boucle d’accueil',
      type: 'file',
      group: 'technical',
      fieldset: 'derivatives',
      readOnly: true,
      description: 'Extrait muet de 8 secondes, 1280 px, produit par scripts/extract-loops.mjs.',
      options: { accept: 'video/mp4' },
    }),
    defineField({
      name: 'videoPoster',
      title: 'Image fixe',
      type: 'image',
      group: 'technical',
      fieldset: 'derivatives',
      readOnly: true,
      description: 'Première image de la boucle, produite par scripts/extract-loops.mjs.',
      options: { metadata: [...IMAGE_METADATA] },
    }),
    defineField({
      name: 'videoProxy',
      title: 'Version de lecture',
      type: 'file',
      group: 'technical',
      fieldset: 'derivatives',
      readOnly: true,
      description: 'Le film en H.264 1080p pour le lecteur de la fiche, produit par scripts/transcode-video.mjs.',
      options: { accept: 'video/mp4' },
    }),
  ],
  orderings: [
    {
      title: 'Ordre d’affichage',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Année, plus récent en premier',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      year: 'year',
      order: 'order',
      media: 'cover',
      isVisible: 'isVisible',
    },
    prepare({ title, subtitle, year, order, media, isVisible }) {
      const parts = [year, subtitle].filter(Boolean).join(' · ');
      return {
        title: `${order ?? '?'}. ${title ?? 'Sans titre'}${isVisible === false ? ' (masqué)' : ''}`,
        subtitle: parts,
        media,
      };
    },
  },
});
