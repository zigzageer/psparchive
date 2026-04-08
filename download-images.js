import fs from 'fs';
import https from 'https';
import path from 'path';

// Read the data file
const dataFile = fs.readFileSync('./src/data.ts', 'utf-8');

// Extract all image URLs
const urlRegex = /https:\/\/altarofgaming\.com\/wp-content\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)/g;
const urls = [...new Set(dataFile.match(urlRegex) || [])];

console.log(`Found ${urls.length} unique images to download.`);

const downloadDir = path.join(process.cwd(), 'public', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadImage(url) {
  const fileName = path.basename(url);
  const filePath = path.join(downloadDir, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${fileName} (already exists)`);
    return;
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${fileName}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file async if there is an error
      reject(err);
    });
  });
}

async function main() {
  for (let i = 0; i < urls.length; i++) {
    try {
      await downloadImage(urls[i]);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error downloading ${urls[i]}:`, error.message);
    }
  }
  console.log('Finished downloading images.');
  console.log('You can now update src/data.ts to point to /images/filename.jpg instead of the external URLs.');
}

main();
