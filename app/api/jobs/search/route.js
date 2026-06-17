import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: "Query parameter is required" }, { status: 400 });
  }

  const apiKey = process.env['X-RAPIDAPI-KEY'] || process.env['RAPIDAPI_KEY'];

  if (!apiKey) {
    return NextResponse.json({ message: "RapidAPI key is not configured on the server" }, { status: 500 });
  }

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error((errData && errData.message) || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("JSearch API Error:", error);
    return NextResponse.json({ message: error.message || "Failed to fetch jobs" }, { status: 500 });
  }
}
