import fs from 'fs';

const html = fs.readFileSync('altar.html', 'utf8');
const imgRegex = /<img[^>]+src="([^">]+)"/g;
let match;
const urls = [];
while ((match = imgRegex.exec(html)) !== null) {
  urls.push(match[1]);
}

const uniqueUrls = [...new Set(urls)];
fs.writeFileSync('urls.json', JSON.stringify(uniqueUrls, null, 2));
console.log(`Extracted ${uniqueUrls.length} unique image URLs.`);
