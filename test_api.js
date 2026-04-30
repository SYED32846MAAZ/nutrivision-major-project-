const https = require('https');
const key = 'AIzaSyBL6fZV4H1o7SfvIiPPQJPRZzo-G3qpAiY';
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});
