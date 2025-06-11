const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

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

// API endpoint to get wallpapers data
app.get('/api/wallpapers', (req, res) => {
  try {
    console.log('API endpoint /api/wallpapers called');
    // Import the wallpapers data directly
    // Note: In a real production app, you would use a database instead
    const wallpapersPath = path.join(__dirname, 'src', 'mockData.js');
    console.log('Reading file from:', wallpapersPath);
    
    // Check if file exists
    if (!fs.existsSync(wallpapersPath)) {
      console.log('File not found, using fallback data');
      return res.json(fallbackWallpapers);
    }
    
    // Read the file content
    let fileContent = fs.readFileSync(wallpapersPath, 'utf8');
    console.log('File content read successfully');
    
    try {
      // Create a more robust parsing approach
      // Extract the array content between the square brackets
      const arrayContent = fileContent.substring(
        fileContent.indexOf('['),
        fileContent.lastIndexOf(']') + 1
      );
      
      // Replace JavaScript syntax with JSON syntax
      const jsonArrayContent = arrayContent
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/,\s*\]/g, ']') // Remove trailing commas
        .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":') // Add quotes around property names
      
      // Parse the JSON string to get the wallpapers array
      const wallpapers = JSON.parse(jsonArrayContent);
      console.log('Successfully parsed wallpapers data, count:', wallpapers.length);
      
      res.json(wallpapers);
    } catch (parseError) {
      console.error('Error parsing wallpapers data:', parseError);
      // Use fallback data if parsing fails
      console.log('Using fallback data due to parsing error');
      res.json(fallbackWallpapers);
    }
  } catch (error) {
    console.error('Error reading wallpapers data:', error);
    // Use fallback data if file reading fails
    console.log('Using fallback data due to file reading error');
    res.json(fallbackWallpapers);
  }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/wallpapers`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});