const https = require('https');
const key = 'AIzaSyD3Zr7lVo0o0_kEh1yNu_BfWuHHqCJJX-8';
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});
