const path = require('path');
const fs = require('fs');

// Fallback wallpapers data in case file reading fails
const fallbackWallpapers = [
  {
    id: 1,
    title: "Cosmic Nebula",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
    category: "Space",
    tags: ["galaxy", "stars", "nebula", "cosmos", "purple"],
    resolution: "3840x2160",
    views: 12453,
    downloads: 3782,
    dateAdded: "2023-04-15"
  },
  {
    id: 2,
    title: "Mountain Sunrise",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "Nature",
    tags: ["mountains", "sunrise", "landscape", "scenic", "alps"],
    resolution: "3840x2160",
    views: 9876,
    downloads: 2345,
    dateAdded: "2023-05-20"
  }
];

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Only handle GET requests to /api/wallpapers
  if (event.httpMethod !== 'GET' || event.path !== '/.netlify/functions/api/wallpapers') {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not Found' })
    };
  }

  try {
    // Import the mock data directly
    const { default: mockData } = await import('../../src/mockData.js');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockData)
    };
  } catch (error) {
    console.error('Error loading wallpapers data:', error);
    // Use fallback data if loading fails
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(fallbackWallpapers)
    };
  }
};