const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('./.env'));
const apiKey = envConfig['X-RAPIDAPI-KEY'] || envConfig['RAPIDAPI_KEY'];

async function testJSearch() {
  const query = 'Communication & teamwork Presentation skills';
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
  console.log('Fetching:', url);
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  } catch (err) {
    console.error('Error:', err);
  }
}

testJSearch();
