import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const BLOB_IMAGES_DIR = path.resolve('blob-images');

const pspData = [
  {
    id: 'psp-1000',
    colors: [
      { name: 'Piano Black', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-pb-piano-black-playstation-portable-color-variation.png' },
      { name: 'Ceramic White', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-cw-ceramic-white-playstation-portable-color-variation.png' },
      { name: 'Pink', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_1000-pink.png' },
      { name: 'Metallic Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-1000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/metallic-blue-back-side-psp-1000-altar-of-gaming.png' },
      { name: 'Champagne Gold', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/champagne-gold-psp-1000-altar-of-gaming.png' },
      { name: 'Coca-cola', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/coca-cola-psp-1000-altar-of-gaming.png' },
      { name: 'Metal Gear Solid Portable Ops', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/metal-gear-solid-black-ops-psp-1000-altar-of-gaming.png' },
      { name: 'Signature Model 000001 Tsukimi', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000001-tsukimi-psp-1000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/signature-model-000001-tsukimi-back-side-psp-1000-altar-of-gaming.png' },
      { name: 'Signature Model 000002 Kachofugetsu', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000002-kachofugetsu-psp-1000-altar-of-gaming.png' },
    ]
  },
  {
    id: 'psp-2000',
    colors: [
      { name: 'Piano Black', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-2000-altar-of-gaming-1.png' },
      { name: 'Ceramic White', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/ceramic-white-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/ceramic-white-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Ice Silver', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/ice-silver-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/ice-silver-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Rose Pink', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/rose-pink-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/rose-pink-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Lavender Purple', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/lavender-purple-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/lavender-purple-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Felicia Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/felicia-blue-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/felicia-blue-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Mint Green', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/mint-green-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/mint-green-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Deep Red', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/deep-red-psp-2000-altar-of-gaming.png' },
      { name: 'Matte Bronze', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/matte-bronze-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/matte-bronze-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Metallic Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-2000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/metallic-blue-back-side-psp-2000-altar-of-gaming.png' },
      { name: 'Final Fantasy VII 10th Anniversary', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/final-fantasy-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/final-fantasy-psp-2000-altar-of-gaming-back.png' },
      { name: 'God of War Chains of Olympus', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-chains-of-olympus-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-chains-of-olympus-psp-2000-altar-of-gaming-back.png' },
      { name: 'Mobile Suit Gundam Giren no Yabou', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/mobile-suit-gundam-giren-no-yabou-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/mobile-suit-gundam-giren-no-yabou-psp-2000-altar-of-gaming-back.png' },
      { name: 'Monster Hunter Portable 2nd G Hunter Pack', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-2nd-g-hunter-pack-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-2nd-g-hunter-pack-psp-2000-altar-of-gaming-back.png' },
      { name: 'Spider-Man Edition', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/spider-man-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/spider-man-psp-2000-altar-of-gaming-back.png' },
      { name: 'Star Wars Battlefront Renegade Squadron', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/star-wars-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/star-wars-psp-2000-altar-of-gaming-back.png' },
      { name: 'The Simpsons', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/the-simpson-psp-2000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/the-simpson-psp-2000-altar-of-gaming-back.png' },
    ]
  },
  {
    id: 'psp-3000',
    colors: [
      { name: 'Piano Black', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-3000-altar-of-gaming-1.png' },
      { name: 'Pearl White', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/pearl-white-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/pearl-white-back-cover-psp-3000-altar-of-gaming.png' },
      { name: 'Mystic Silver', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/mystic-silver-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/mystic-silver-back-cover-psp-3000-altar-of-gaming.png' },
      { name: 'Radiant Red', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/radiant-red-psp-3000-altar-of-gaming.png' },
      { name: 'Vibrant Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/vibrant-blue-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/vibrant-blue-back-psp-3000-altar-of-gaming.png' },
      { name: 'Spirited Green', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/spirited-green-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/spirited-green-back-side-psp-3000-altar-of-gaming.png' },
      { name: 'Blossom Pink', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/blossom-pink-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/blossom-pink-back-side-psp-3000-altar-of-gaming.png' },
      { name: 'Bright Yellow', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/bright-yellow-psp-3000-altar-of-gaming.png' },
      { name: 'Lilac Purple', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/lilac-purple-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/lilac-purple-back-side-psp-3000-altar-of-gaming.png' },
      { name: 'Marine Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/marine-blue-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/marine-blue-psp-3000-altar-of-gaming-back.png' },
      { name: 'Turquoise Green', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/turquoise-green-psp-3000-altar-of-gaming.png' },
      { name: 'Red Black Value Pack', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/black-red-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/back-black-red-psp-3000-altar-of-gaming.png' },
      { name: 'White Blue', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-blue-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-blue-back-side-psp-3000-altar-of-gaming.png' },
      { name: 'AKB1 48 Premier', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-AKB148-Premier-front-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-AKB148-Premier-back-altar-of-gaming.png' },
      { name: 'Dissidia 012 Duodecim Final Fantasy', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/dissidia-012-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/dissidia-012-psp-3000-altar-of-gaming-back.png' },
      { name: 'Dissidia Final Fantasy 20th Anniversary', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/dissidia-final-fantasy-20th-anniverasry-psp-3000-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/dissidia-final-fantasy-20th-anniverasry-back-side-psp-3000-altar-of-gaming.png' },
      { name: 'God of War Ghost of Sparta', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-ghost-of-sparta-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-ghost-of-sparta-psp-3000-altar-of-gaming-back.png' },
      { name: 'Gran Turismo Edition', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-gran-turismo-altar-of-gaming.png' },
      { name: 'Gundam Vs Gundam', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gundam-vs-gundam-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/gundam-vs-gundam-psp-3000-altar-of-gaming-back.png' },
      { name: 'Hatsune Miku Project Diva 2nd Pack', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/hatsune-miku-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/hatsune-miku-back-psp_3000-altar-of-gaming.png' },
      { name: 'Kingdom Hearts Birth by Sleep Edition', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/kingdom-heart-birth-by-sleep-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/kingdom-heart-birth-by-sleep-psp-3000-altar-of-gaming-back.png' },
      { name: 'Metal Gear Solid Peace Walker Edition', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/mgs-peace-walker-psp-3000-altar-of-gaming.png' },
      { name: 'Monster Hunter Portable Black Golden Limited', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-blackgolden-limited-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-blackgolden-limited-psp-3000-altar-of-gaming-back.png' },
      { name: 'One Piece Edition', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/one-piece-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/one-piece-psp-3000-altar-of-gaming-back.png' },
      { name: 'Uta No Prince Console', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/uta-no-prince-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/uta-no-prince-psp-3000-altar-of-gaming-back.png' },
      { name: 'Winning Eleven 2010', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/winning-eleven-2010-psp-3000-altar-of-gaming-front.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/winning-eleven-2010-psp-3000-altar-of-gaming-back.png' },
    ]
  },
  {
    id: 'psp-go',
    colors: [
      { name: 'Black', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-go-altar-of-gaming.png' },
      { name: 'White', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-go-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-back-side-psp-go-altar-of-gaming.png' },
    ]
  },
  {
    id: 'psp-street',
    colors: [
      { name: 'Black', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-street-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/black-back-side-psp-street-altar-of-gaming.png' },
      { name: 'White', imageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-street-altar-of-gaming.png', backImageUrl: 'https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-back-side-psp-street-altar-of-gaming.png' },
    ]
  },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    proto.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function getExtension(url) {
  const match = url.match(/\.(\w+)(?:\?|$)/);
  return match ? `.${match[1]}` : '.png';
}

async function main() {
  console.log('Downloading PSP images into blob-images/...\n');
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const model of pspData) {
    for (const color of model.colors) {
      const slug = slugify(color.name);
      const dir = path.join(BLOB_IMAGES_DIR, model.id, slug);
      fs.mkdirSync(dir, { recursive: true });

      const urls = [];
      if (color.imageUrl) urls.push({ url: color.imageUrl, label: 'front' });
      if (color.backImageUrl) urls.push({ url: color.backImageUrl, label: 'back' });

      for (const { url, label } of urls) {
        const ext = getExtension(url);
        const filename = `${label}${ext}`;
        const dest = path.join(dir, filename);

        if (fs.existsSync(dest)) {
          console.log(`  [SKIP] ${model.id}/${slug}/${filename} (exists)`);
          skipped++;
          continue;
        }

        try {
          await downloadFile(url, dest);
          console.log(`  [OK]   ${model.id}/${slug}/${filename}`);
          downloaded++;
        } catch (err) {
          console.error(`  [ERR]  ${model.id}/${slug}/${filename} -> ${err.message}`);
          failed++;
        }
      }
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
