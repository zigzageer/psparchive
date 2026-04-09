import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';

const BLOB_IMAGES_DIR = path.resolve('blob-images');
const MANIFEST_PATH = path.resolve('src/blob-manifest.json');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif']);

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  if (!fs.existsSync(BLOB_IMAGES_DIR)) {
    console.error('blob-images/ directory not found. Run download-images.js first.');
    process.exit(1);
  }

  console.log('Scanning local blob-images/ for images...');
  const localFiles = walkDir(BLOB_IMAGES_DIR);
  console.log(`Found ${localFiles.length} local images.\n`);

  console.log('Fetching existing blobs...');
  const existingBlobs = new Map();
  let cursor;
  do {
    const result = await list({ cursor, limit: 1000 });
    for (const blob of result.blobs) {
      existingBlobs.set(blob.pathname, blob.url);
    }
    cursor = result.cursor;
  } while (cursor);
  console.log(`Found ${existingBlobs.size} existing blobs.\n`);

  const manifest = {};
  let uploaded = 0;
  let skipped = 0;

  for (const localPath of localFiles) {
    const relativePath = path.relative(BLOB_IMAGES_DIR, localPath).replace(/\\/g, '/');

    if (existingBlobs.has(relativePath)) {
      const url = existingBlobs.get(relativePath);
      console.log(`  [SKIP] ${relativePath} (already in blob)`);
      addToManifest(manifest, relativePath, url);
      skipped++;
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(localPath);
      const contentType = getContentType(localPath);
      const { url } = await put(relativePath, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType,
      });
      console.log(`  [UP]   ${relativePath} -> ${url}`);
      addToManifest(manifest, relativePath, url);
      uploaded++;
    } catch (err) {
      console.error(`  [ERR]  ${relativePath} -> ${err.message}`);
    }
  }

  // Also include any existing blob images not in local (uploaded via other means)
  for (const [pathname, url] of existingBlobs) {
    if (pathname.endsWith('.keep')) continue;
    if (!IMAGE_EXTENSIONS.has(path.extname(pathname).toLowerCase())) continue;
    if (!manifest[getModelFromPath(pathname)]) continue;
    addToManifest(manifest, pathname, url);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to src/blob-manifest.json`);
  console.log(`Uploaded: ${uploaded}, Skipped: ${skipped}`);
}

function addToManifest(manifest, relativePath, url) {
  const parts = relativePath.split('/');
  if (parts.length < 3) return;
  const modelId = parts[0];
  const colorSlug = parts[1];
  const key = `${modelId}/${colorSlug}`;
  if (!manifest[key]) manifest[key] = [];
  if (!manifest[key].includes(url)) manifest[key].push(url);
}

function getModelFromPath(pathname) {
  const parts = pathname.split('/');
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : '';
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
  };
  return types[ext] || 'application/octet-stream';
}

main().catch(console.error);
