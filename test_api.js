const https = require('https');
const key = 'AIzaSyDj1F343etqo59QvzejTddspY9WVRzhBBs';
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});
