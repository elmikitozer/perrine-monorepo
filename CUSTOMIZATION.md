# Guide de Personnalisation

Ce guide explique comment personnaliser les 3 sites selon vos besoins.

## Table des matières

1. [Modifier les couleurs et le style](#couleurs-et-style)
2. [Personnaliser les composants](#composants)
3. [Ajouter des schémas Sanity](#schemas-sanity)
4. [Modifier le contenu des pages](#contenu-pages)
5. [Ajouter de nouvelles pages](#nouvelles-pages)

## Couleurs et Style

### Modifier les couleurs d'une application

Chaque application a son propre fichier `tailwind.config.js` avec une palette de couleurs personnalisée.

#### DA Agency
```javascript
// apps/da-agency/tailwind.config.js
theme: {
  extend: {
    colors: {
      // Ajoutez vos couleurs personnalisées
      primary: {
        50: '#...',
        100: '#...',
        // ... jusqu'à 900
      }
    }
  }
}
```

#### Cocktails
Utilise une palette `cocktail` (rouge/orange). Pour changer :

```javascript
// apps/cocktails/tailwind.config.js
colors: {
  cocktail: {
    // Modifiez ces valeurs
    500: '#ef5844',  // Couleur principale
    600: '#dc3a26',  // Hover
    // etc.
  }
}
```

#### Production
Utilise une palette `production` (bleu). Pour changer :

```javascript
// apps/production/tailwind.config.js
colors: {
  production: {
    500: '#0ea5e9',  // Couleur principale
    600: '#0284c7',  // Hover
    // etc.
  }
}
```

### Modifier les polices

Dans chaque fichier `layout.tsx` :

```typescript
// apps/da-agency/src/app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// Dans le body
<body className={`${inter.variable} ${playfair.variable} font-sans`}>
```

Puis dans Tailwind :
```javascript
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'Georgia', 'serif'],
}
```

## Composants

### Modifier les composants partagés

Les composants dans `packages/ui/src/` sont partagés entre toutes les apps.

#### Button
```typescript
// packages/ui/src/Button.tsx

// Ajouter une nouvelle variante
const variantClasses = {
  primary: '...',
  secondary: '...',
  outline: '...',
  ghost: 'bg-transparent hover:bg-gray-100', // Nouvelle variante
};
```

#### Header
```typescript
// Personnaliser le Header pour une app spécifique
// Dans apps/da-agency/src/app/layout.tsx

<Header
  siteName="Perrine DA"
  links={[
    { href: '/', label: 'Accueil' },
    { href: '/projets', label: 'Projets' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ]}
/>
```

#### ContactForm
```typescript
// Ajouter un handler personnalisé
// Dans apps/da-agency/src/app/contact/page.tsx

async function handleSubmit(data: FormData) {
  // Votre logique personnalisée
  await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

<ContactForm onSubmit={handleSubmit} />
```

### Créer un nouveau composant partagé

```typescript
// packages/ui/src/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};
```

Puis l'exporter :
```typescript
// packages/ui/src/index.tsx
export { Card } from './Card';
```

## Schémas Sanity

### Ajouter un nouveau champ à un schéma existant

```typescript
// apps/da-agency/src/sanity/schemas/project.ts

defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
  options: {
    layout: 'tags',
  },
}),
```

### Créer un nouveau schéma

```typescript
// apps/da-agency/src/sanity/schemas/teamMember.ts
import { defineType, defineField } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Membre de l\'équipe',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Fonction',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
```

Puis l'ajouter au schéma :
```typescript
// apps/da-agency/src/sanity/schemas/index.ts
import { teamMember } from './teamMember';

export const schemaTypes = [project, service, page, teamMember];
```

### Types de champs Sanity utiles

```typescript
// Texte simple
{ name: 'title', type: 'string' }

// Texte long
{ name: 'description', type: 'text', rows: 4 }

// Nombre
{ name: 'price', type: 'number' }

// Date
{ name: 'publishedAt', type: 'datetime' }

// URL
{ name: 'website', type: 'url' }

// Email
{ name: 'email', type: 'email' }

// Boolean
{ name: 'featured', type: 'boolean' }

// Liste déroulante
{
  name: 'status',
  type: 'string',
  options: {
    list: [
      { title: 'Brouillon', value: 'draft' },
      { title: 'Publié', value: 'published' },
    ]
  }
}

// Référence à un autre document
{
  name: 'author',
  type: 'reference',
  to: [{ type: 'teamMember' }]
}

// Tableau
{
  name: 'tags',
  type: 'array',
  of: [{ type: 'string' }]
}

// Contenu riche (éditeur)
{
  name: 'content',
  type: 'array',
  of: [{ type: 'block' }]
}

// Image
{
  name: 'image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', type: 'string', title: 'Texte alternatif' }
  ]
}
```

## Contenu Pages

### Modifier la page d'accueil

```typescript
// apps/da-agency/src/app/page.tsx

export default async function Home() {
  return (
    <>
      {/* Modifier le Hero */}
      <section className="py-20">
        <Container>
          <h1 className="text-6xl font-bold">Votre nouveau titre</h1>
          <p className="text-xl">Votre nouveau sous-titre</p>
        </Container>
      </section>

      {/* Ajouter une nouvelle section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <h2 className="text-4xl font-bold mb-12">Nouvelle Section</h2>
          {/* Votre contenu */}
        </Container>
      </section>
    </>
  );
}
```

### Récupérer des données de Sanity

```typescript
// Dans n'importe quelle page ou composant serveur

import { client } from '@/sanity/lib/client';

async function getData() {
  const query = `*[_type == "project"] | order(_createdAt desc)`;
  return await client.fetch(query);
}

export default async function ProjectsPage() {
  const projects = await getData();

  return (
    <Container>
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </Container>
  );
}
```

### Afficher des images Sanity

```typescript
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

<Image
  src={urlFor(project.mainImage).width(800).height(600).url()}
  alt={project.mainImage.alt || project.title}
  width={800}
  height={600}
  className="rounded-lg"
/>
```

## Nouvelles Pages

### Créer une page simple

```typescript
// apps/da-agency/src/app/a-propos/page.tsx

import { Container } from '@perrine/ui';

export const metadata = {
  title: 'À propos - Perrine DA',
  description: 'En savoir plus sur notre agence',
};

export default function AboutPage() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-5xl font-bold mb-8">À propos</h1>
        <p className="text-xl text-gray-600">Votre contenu...</p>
      </Container>
    </section>
  );
}
```

### Créer une page dynamique

```typescript
// apps/da-agency/src/app/projets/[slug]/page.tsx

import { client } from '@/sanity/lib/client';
import { Container } from '@perrine/ui';
import { notFound } from 'next/navigation';

async function getProject(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0]`;
  return await client.fetch(query, { slug });
}

export default async function ProjectPage({
  params
}: {
  params: { slug: string }
}) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <Container>
      <h1 className="text-5xl font-bold mb-8">{project.title}</h1>
      <p>{project.description}</p>
    </Container>
  );
}

// Pour la génération statique
export async function generateStaticParams() {
  const projects = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`);
  return projects.map((project: any) => ({
    slug: project.slug,
  }));
}
```

## Personnaliser les metadata SEO

```typescript
// Page statique
export const metadata = {
  title: 'Mon Titre',
  description: 'Ma description',
  openGraph: {
    title: 'Mon Titre',
    description: 'Ma description',
    images: ['/og-image.jpg'],
  },
};

// Page dynamique
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  return {
    title: `${project.title} - Perrine DA`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [urlFor(project.mainImage).width(1200).height(630).url()],
    },
  };
}
```

## Ajouter une API Route

```typescript
// apps/da-agency/src/app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // Votre logique (envoyer un email, sauvegarder en DB, etc.)
  console.log('Contact form:', data);

  return NextResponse.json({ success: true });
}
```

## Conseils

1. **Testez localement** avant de déployer
2. **Utilisez TypeScript** pour éviter les erreurs
3. **Optimisez les images** avec le composant Next.js Image
4. **Utilisez les Server Components** par défaut (plus rapide)
5. **Créez des composants réutilisables** dans `packages/ui/`
6. **Documentez vos changements** pour faciliter la maintenance

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)

