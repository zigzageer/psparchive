import 'dotenv/config';
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

async function main() {
  const files = [
    { local: 'temp/xmb-bg.webm', blob: 'assets/xmb-bg.webm', type: 'video/webm' },
    { local: 'temp/xmb-bg.mp4', blob: 'assets/xmb-bg.mp4', type: 'video/mp4' },
  ];

  for (const f of files) {
    const data = readFileSync(f.local);
    console.log(`Uploading ${f.local} (${(data.length / 1024).toFixed(1)}kB)...`);
    const { url } = await put(f.blob, data, {
      access: 'public',
      addRandomSuffix: false,
      contentType: f.type,
    });
    console.log(`  -> ${url}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
