/**
 * Script d'upload des projets portfolio vers Sanity
 * Usage: node scripts/upload-projects.mjs
 */

import { createClient } from '@sanity/client';
import { createReadStream, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const PHOTOS_DIR = '/Users/mikayay/Downloads/wetransfer_photos-pv_2026-04-03_2220';
const PROJECT_ID = '93a10qqu';
const DATASET = 'production';
const TOKEN = 'sk8me1SUEnqNlqeXSxBRVPOMrNzIK40vcaQulYIgmIsOhs3jWRvc2jhcvxFLWqXO3W1xaVbFdMW6mxqH5hxLohIvYBcUqQhWFlFbYgr68hkDmX1oFFrM8eUKHMMLGepqtVuKhmrbTQbGvtzsp2AEZCzTAVOALas6q0vSzp3LIsxpumClciLe';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.tif'];

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-10-21',
  useCdn: false,
});

function extractClientFromFolderName(folderName) {
  // Extrait le premier mot comme client (ex: "DIOR AW21" -> "Dior")
  const firstWord = folderName.split(' ')[0];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

function extractYearFromFolderName(folderName) {
  const match = folderName.match(/\d{2,4}/);
  if (!match) return null;
  const num = parseInt(match[0]);
  // Si 2 chiffres (ex: 22, 23, 24), on préfixe avec 20
  return num < 100 ? 2000 + num : num;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

async function uploadImage(filePath) {
  const ext = extname(filePath).toLowerCase().replace('.', '');
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    tiff: 'image/tiff',
    tif: 'image/tiff',
  };
  const contentType = mimeTypes[ext] || 'image/jpeg';

  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
    contentType,
  });

  return asset._id;
}

async function projectExists(slug) {
  const result = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]._id`,
    { slug }
  );
  return !!result;
}

async function main() {
  const folders = readdirSync(PHOTOS_DIR).filter((name) => {
    const fullPath = join(PHOTOS_DIR, name);
    return statSync(fullPath).isDirectory();
  });

  console.log(`\n📁 ${folders.length} projets trouvés\n`);

  for (let i = 0; i < folders.length; i++) {
    const folderName = folders[i];
    const folderPath = join(PHOTOS_DIR, folderName);
    const slug = slugify(folderName);

    console.log(`[${i + 1}/${folders.length}] ${folderName}`);

    // Vérifie si le projet existe déjà
    const exists = await projectExists(slug);
    if (exists) {
      console.log(`  ⏭️  Déjà importé, on saute\n`);
      continue;
    }

    // Récupère les fichiers image du dossier
    const files = readdirSync(folderPath)
      .filter((f) => IMAGE_EXTENSIONS.includes(extname(f).toLowerCase()))
      .map((f) => join(folderPath, f))
      .sort();

    if (files.length === 0) {
      console.log(`  ⚠️  Aucune image trouvée, on saute\n`);
      continue;
    }

    console.log(`  📸 ${files.length} image(s) à uploader...`);

    // Upload toutes les images
    const assetIds = [];
    for (const file of files) {
      try {
        const assetId = await uploadImage(file);
        assetIds.push(assetId);
        process.stdout.write('.');
      } catch (err) {
        console.error(`\n  ❌ Erreur sur ${basename(file)}: ${err.message}`);
      }
    }
    console.log('');

    if (assetIds.length === 0) {
      console.log(`  ⚠️  Aucun upload réussi, on saute\n`);
      continue;
    }

    // La première image = cover
    const coverAssetId = assetIds[0];

    // Construit le document projet
    const doc = {
      _type: 'project',
      title: folderName,
      slug: { _type: 'slug', current: slug },
      client: extractClientFromFolderName(folderName),
      year: extractYearFromFolderName(folderName),
      order: i + 1,
      isVisible: true,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: coverAssetId },
      },
      images: assetIds.map((id, idx) => ({
        _type: 'image',
        _key: `img-${idx}`,
        asset: { _type: 'reference', _ref: id },
      })),
    };

    await client.create(doc);
    console.log(`  ✅ Projet créé avec ${assetIds.length} images\n`);
  }

  console.log('🎉 Import terminé !');
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
