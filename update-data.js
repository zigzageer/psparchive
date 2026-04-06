import fs from 'fs';

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
const dataFile = fs.readFileSync('src/data.ts', 'utf8');

// We'll use a simple regex to find the imageUrl and insert backImageUrl after it.
let updatedDataFile = dataFile;

const imageUrlRegex = /"imageUrl":\s*"([^"]+)"/g;
let match;
while ((match = imageUrlRegex.exec(dataFile)) !== null) {
  const frontUrl = match[1];
  let backUrl = null;

  // Try to guess the back URL
  const filename = frontUrl.split('/').pop();
  const baseUrl = frontUrl.substring(0, frontUrl.lastIndexOf('/'));
  
  if (filename.includes('-front')) {
    const guess1 = filename.replace('-front', '-back');
    backUrl = urls.find(u => u.endsWith(guess1));
  } else {
    // e.g. ceramic-white-psp-2000-altar-of-gaming.png
    // -> ceramic-white-back-side-psp-2000-altar-of-gaming.png
    const parts = filename.split('-psp-');
    if (parts.length === 2) {
      const prefix = parts[0];
      const suffix = parts[1];
      const guess2 = `${prefix}-back-side-psp-${suffix}`;
      backUrl = urls.find(u => u.endsWith(guess2));
      
      if (!backUrl) {
        const guess3 = `${prefix}-psp-${suffix.replace('.png', '-back.png')}`;
        backUrl = urls.find(u => u.endsWith(guess3));
      }
    }
  }

  if (backUrl) {
    console.log(`Found back image for ${filename}: ${backUrl}`);
    // Replace the line in the file
    const searchStr = `"imageUrl": "${frontUrl}",`;
    const replaceStr = `"imageUrl": "${frontUrl}",\n        "backImageUrl": "${backUrl}",`;
    updatedDataFile = updatedDataFile.replace(searchStr, replaceStr);
  } else {
    // Try one more generic search: just look for a URL containing the prefix and 'back'
    const prefix = filename.split('-psp-')[0];
    if (prefix) {
      const potentialBacks = urls.filter(u => u.includes(prefix) && (u.includes('back') || u.includes('rear')));
      if (potentialBacks.length === 1) {
        console.log(`Found fuzzy back image for ${filename}: ${potentialBacks[0]}`);
        const searchStr = `"imageUrl": "${frontUrl}",`;
        const replaceStr = `"imageUrl": "${frontUrl}",\n        "backImageUrl": "${potentialBacks[0]}",`;
        updatedDataFile = updatedDataFile.replace(searchStr, replaceStr);
      } else if (potentialBacks.length > 1) {
        console.log(`Multiple fuzzy matches for ${filename}:`, potentialBacks);
      } else {
        console.log(`No back image found for ${filename}`);
      }
    }
  }
}

// Update the type definition
updatedDataFile = updatedDataFile.replace(
  `imageUrl?: string; description: string }[];`,
  `imageUrl?: string; backImageUrl?: string; description: string }[];`
);

fs.writeFileSync('src/data.ts', updatedDataFile);
console.log('Updated src/data.ts');
