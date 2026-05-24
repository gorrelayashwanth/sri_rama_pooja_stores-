import https from 'https';

https.get('https://sriramapoojastores-production.up.railway.app/api/v1/products?limit=2', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', (err) => console.log('Error:', err.message));
