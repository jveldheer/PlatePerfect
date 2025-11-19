// Vercel Serverless Function for USDA FoodData Central API
// This keeps your API key secure on the server

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment variable
  const apiKey = process.env.FDC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'FDC API key not configured. Using local database fallback.'
    });
  }

  try {
    const { query, pageSize = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Call USDA FoodData Central API
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error('FDC API error:', error);
      return res.status(response.status).json({
        error: 'FDC API request failed'
      });
    }

    const data = await response.json();

    // Return the data
    return res.status(200).json(data);

  } catch (error) {
    console.error('FDC API error:', error);
    return res.status(500).json({
      error: 'Failed to search food database. Please try again.'
    });
  }
}
