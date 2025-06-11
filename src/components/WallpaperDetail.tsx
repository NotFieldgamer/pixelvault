import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchWallpaperById } from '../services/api';

const WallpaperDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [wallpaper, setWallpaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWallpaperById(parseInt(id || '0'));
        setWallpaper(data);
      } catch (err) {
        setError('Failed to load wallpaper details. Please try again later.');
        console.error('Error fetching wallpaper:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallpaper();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl max-w-md mx-auto" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Not found state
  if (!wallpaper) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-dark-100 rounded-xl p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-dark-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">Wallpaper Not Found</h2>
          <p className="text-dark-500 mb-6">The wallpaper you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-200 mb-6 group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all wallpapers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallpaper Image */}
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-dark-100">
            <img 
              src={wallpaper.imageUrl} 
              alt={wallpaper.title} 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Wallpaper Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark-800 mb-2">{wallpaper.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-800 rounded-lg">
                {wallpaper.category}
              </span>
              <span className="text-sm font-medium px-3 py-1 bg-dark-100 text-dark-600 rounded-lg">
                {wallpaper.resolution}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center text-dark-500 mb-1">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span className="text-sm font-medium">Views</span>
                </div>
                <p className="text-xl font-bold text-dark-800">{wallpaper.views.toLocaleString()}</p>
              </div>
              <div className="bg-dark-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center text-dark-500 mb-1">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span className="text-sm font-medium">Downloads</span>
                </div>
                <p className="text-xl font-bold text-dark-800">{wallpaper.downloads.toLocaleString()}</p>
              </div>
            </div>

            {wallpaper.tags && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-dark-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {wallpaper.tags.map((tag: any, index: number) => (
                    <span 
                      key={index} 
                      className="text-xs px-3 py-1 bg-dark-100 text-dark-600 rounded-full hover:bg-dark-200 transition-colors duration-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="relative group">
              <a 
                href={wallpaper.imageUrl} 
                download={`${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}-wallpaper.jpg`}
                onClick={() => console.log(`Download started for wallpaper ID: ${wallpaper.id}`)}
                className="btn-primary w-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-[1.02]"
                aria-label={`Download ${wallpaper.title} wallpaper`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Wallpaper
              </a>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 text-center">
                <div className="bg-dark-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                  Click to download this wallpaper
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-dark-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperDetail;