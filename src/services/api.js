/**
 * API service for fetching data from the backend
 */

// Base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions/api' // Use Netlify Functions path in production
  : 'http://localhost:5000/api'; // Use absolute URL in development

/**
 * Fetch all wallpapers from the API
 * @returns {Promise<Array>} Promise that resolves to an array of wallpapers
 */
export const fetchWallpapers = async () => {
  try {
    console.log('Fetching wallpapers from:', `${API_BASE_URL}/wallpapers`);
    
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/wallpapers`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched wallpapers, count:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    // Return an empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

/**
 * Fetch a single wallpaper by ID
 * @param {number} id - The wallpaper ID to fetch
 * @returns {Promise<Object>} Promise that resolves to a wallpaper object
 */
export const fetchWallpaperById = async (id) => {
  try {
    console.log(`Fetching wallpaper with ID: ${id}`);
    // In a real app, we would have a dedicated endpoint for this
    // For now, we'll fetch all wallpapers and find the one we need
    const wallpapers = await fetchWallpapers();
    
    if (!wallpapers || wallpapers.length === 0) {
      throw new Error('No wallpapers available');
    }
    
    const wallpaper = wallpapers.find(w => w.id === parseInt(id));
    
    if (!wallpaper) {
      throw new Error(`Wallpaper with ID ${id} not found`);
    }
    
    return wallpaper;
  } catch (error) {
    console.error(`Error fetching wallpaper with ID ${id}:`, error);
    throw error;
  }
};