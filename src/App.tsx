import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import WallpaperDetail from './components/WallpaperDetail';
import { fetchWallpapers } from './services/api';

// Define Wallpaper interface
interface Wallpaper {
  id: number;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  resolution: string;
  views: number;
  downloads: number;
  dateAdded: string;
}

// HomePage component that contains the existing homepage content
const HomePage = () => {
  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState('All');
  // State for the selected sort option
  const [sortOption, setSortOption] = useState('Trending');
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for wallpapers data
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // For navigation to detail page
  const navigate = useNavigate();
  
  // Fetch wallpapers data when component mounts
  useEffect(() => {
    const loadWallpapers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWallpapers();
        setWallpapers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch wallpapers:', err);
        setError('Failed to load wallpapers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWallpapers();
  }, []);
  
  // Get unique categories from wallpapers
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(wallpapers.map(wallpaper => wallpaper.category))]; 
    return ['All', ...uniqueCategories];
  }, [wallpapers]);
  
  // Filter wallpapers based on selected category and search term
  const filteredWallpapers = useMemo(() => {
    // Start with all wallpapers
    let filtered = wallpapers;
    
    // Filter by category if not 'All'
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(wallpaper => wallpaper.category === selectedCategory);
    }
    
    // Filter by search term if not empty
    if (searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(wallpaper => {
        // Check if title contains search term
        const titleMatch = wallpaper.title.toLowerCase().includes(term);
        // Check if any tag contains search term
        const tagMatch = wallpaper.tags.some(tag => tag.toLowerCase().includes(term));
        return titleMatch || tagMatch;
      });
    }
    
    return filtered;
  }, [wallpapers, selectedCategory, searchTerm]);

  // Sort wallpapers based on selected option
  // const sortWallpapers = (wallpapers: any[]) => {
  //   const sorted = [...wallpapers];
  //   switch (sortOption) {
  //     case 'Trending':
  //       return sorted.sort((a, b) => b.views - a.views);
  //     case 'Most Downloads':
  //       return sorted.sort((a, b) => b.downloads - a.downloads);
  //     case 'Newest':
  //       return sorted.sort((a, b) => {
  //         const dateA = new Date(a.dateAdded).getTime();
  //         const dateB = new Date(b.dateAdded).getTime();
  //         return dateB - dateA;
  //       });
  //     case 'Random':
  //       return sorted.sort(() => Math.random() - 0.5);
  //     default:
  //       return sorted;
  //   }
  // };
  const sortedWallpapers = useMemo(() => {
    let sorted = [...filteredWallpapers];
    
    switch(sortOption) {
      case 'Trending':
        return sorted.sort((a, b) => b.views - a.views);
      case 'Most Downloads':
        return sorted.sort((a, b) => b.downloads - a.downloads);
      case 'Newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateAdded).getTime();
          const dateB = new Date(b.dateAdded).getTime();
          return dateB - dateA;
        });
      case 'Random':
        return sorted.sort(() => Math.random() - 0.5);
      default:
        return sorted;
    }
  }, [filteredWallpapers, sortOption]);
  
  // Handle search form submission
  // const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Search is already applied via the searchTerm state
  // };

  // Clear search term
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Navigate to wallpaper detail page
  const handleWallpaperClick = (id: number) => {
    navigate(`/wallpaper/${id}`);
  };

  return (
    <div>
      {/* Category Navigation */}
      <nav className="bg-dark-100 shadow-md sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto space-x-4 py-4 no-scrollbar">
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${selectedCategory === category 
                    ? 'bg-primary-600 text-white font-medium shadow-md' 
                    : 'bg-white text-dark-600 hover:bg-dark-200 hover:text-dark-800'}`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-dark-800">Explore Wallpapers</h2>
                <p className="text-dark-500">
                  Browse our collection of high-quality wallpapers for your desktop and mobile devices.
                </p>
                {searchTerm && (
                  <p className="mt-2 text-primary-600">
                    Showing results for: <span className="font-medium">"{searchTerm}"</span>
                    <button 
                      onClick={handleClearSearch}
                      className="ml-2 text-sm underline hover:text-primary-800 transition-colors duration-200"
                    >
                      Clear search
                    </button>
                  </p>
                )}
              </div>
              
              {/* Sort Options */}
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <label htmlFor="sort-select" className="mr-2 text-dark-600 font-medium">Sort by:</label>
                  <div className="relative">
                    <select
                      id="sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-white border-2 border-dark-200 rounded-lg py-2 pl-3 pr-10 text-dark-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    >
                      <option value="Trending">Trending</option>
                      <option value="Most Downloads">Most Downloads</option>
                      <option value="Newest">Newest</option>
                      <option value="Random">Random</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallpaper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedWallpapers.length > 0 ? (
                sortedWallpapers.map((wallpaper) => (
                <div 
                  key={wallpaper.id} 
                  className="card overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => handleWallpaperClick(wallpaper.id)}
                >
                  <div className="relative pb-[56.25%] overflow-hidden"> {/* 16:9 aspect ratio */}
                    <img 
                      src={wallpaper.thumbnailUrl} 
                      alt={wallpaper.title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-dark-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-lg">
                      {wallpaper.resolution}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 truncate text-dark-800">{wallpaper.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-800 rounded-lg">{wallpaper.category}</span>
                      <div className="flex items-center text-xs text-dark-500">
                        <span className="flex items-center mr-3">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          {wallpaper.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                          {wallpaper.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-dark-100 rounded-xl p-8 max-w-md mx-auto">
                    <svg className="w-16 h-16 text-dark-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-dark-600 text-lg font-medium">
                      {searchTerm ? 
                        `No wallpapers found matching "${searchTerm}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.` : 
                        `No wallpapers found in ${selectedCategory}.`
                      }
                    </p>
                    <p className="text-dark-500 mt-2">Try adjusting your search or category filters.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <>
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-50">
        {/* Header */}
        <header className="bg-dark-800 text-white shadow-lg sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Link to="/" className="text-3xl md:text-4xl font-heading font-bold text-primary-300 hover:text-primary-200 transition-colors duration-200 flex items-center">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                PixelVault
              </Link>
              
              {/* Search Bar - Only show on homepage */}
              <Routes>
                <Route path="/" element={
                  <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                      <input
                        type="text"
                        placeholder="Search by title or tag..."
                        className="w-full px-4 py-2 rounded-l-lg text-dark-800 bg-dark-100 border-2 border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-l-none rounded-r-lg"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Search
                    </button>
                  </form>
                } />
              </Routes>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-dark-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link to="/" className="text-2xl font-heading font-bold text-primary-300 flex items-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  PixelVault
                </Link>
                <p className="text-dark-300 mt-2 text-sm">Your source for premium wallpapers</p>
              </div>
              <div className="text-center md:text-right">
                <div className="flex space-x-4 mb-4 justify-center md:justify-end">
                  <a href="/wallpapers" className="text-dark-300 hover:text-primary-300 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="/wallpapers" className="text-dark-300 hover:text-primary-300 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="/wallpapers" className="text-dark-300 hover:text-primary-300 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
                <p className="text-dark-300 text-sm">&copy; {new Date().getFullYear()} PixelVault. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
    </>
  );
}

export default App;
