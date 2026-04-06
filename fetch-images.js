const https = require('https');
const fs = require('fs');

https.get('https://altarofgaming.com/playstation-portable-models-color-variations-limited-editions/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('altar.html', data);
    console.log('Saved to altar.html');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
