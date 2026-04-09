import 'dotenv/config';
import { put, list } from '@vercel/blob';

const pspData = [
  { id: 'psp-1000', colors: ['Piano Black','Ceramic White','Pink','Metallic Blue','Champagne Gold','Coca-cola','Metal Gear Solid Portable Ops','Signature Model 000001 Tsukimi','Signature Model 000002 Kachofugetsu'] },
  { id: 'psp-2000', colors: ['Piano Black','Ceramic White','Ice Silver','Rose Pink','Lavender Purple','Felicia Blue','Mint Green','Deep Red','Matte Bronze','Metallic Blue','Final Fantasy VII 10th Anniversary','God of War Chains of Olympus','Mobile Suit Gundam Giren no Yabou','Monster Hunter Portable 2nd G Hunter Pack','Spider-Man Edition','Star Wars Battlefront Renegade Squadron','The Simpsons'] },
  { id: 'psp-3000', colors: ['Piano Black','Pearl White','Mystic Silver','Radiant Red','Vibrant Blue','Spirited Green','Blossom Pink','Bright Yellow','Lilac Purple','Marine Blue','Turquoise Green','Red Black Value Pack','White Blue','AKB1 48 Premier','Dissidia 012 Duodecim Final Fantasy','Dissidia Final Fantasy 20th Anniversary','God of War Ghost of Sparta','Gran Turismo Edition','Gundam Vs Gundam','Hatsune Miku Project Diva 2nd Pack','Kingdom Hearts Birth by Sleep Edition','Metal Gear Solid Peace Walker Edition','Monster Hunter Portable Black Golden Limited','One Piece Edition','Uta No Prince Console','Winning Eleven 2010'] },
  { id: 'psp-go', colors: ['Black','White'] },
  { id: 'psp-street', colors: ['Black','White'] },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Creating blob folders for all PSP color variations...\n');

  let created = 0;
  let skipped = 0;

  for (const model of pspData) {
    for (const color of model.colors) {
      const slug = slugify(color);
      const path = `${model.id}/${slug}/.keep`;

      try {
        const { url } = await put(path, ' ', { access: 'public', addRandomSuffix: false });
        console.log(`  [OK] ${model.id}/${slug}/  ->  ${url}`);
        created++;
      } catch (err) {
        if (err.message?.includes('already exists')) {
          console.log(`  [SKIP] ${model.id}/${slug}/  (already exists)`);
          skipped++;
        } else {
          console.error(`  [ERR] ${model.id}/${slug}/  ->  ${err.message}`);
        }
      }
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main().catch(console.error);
