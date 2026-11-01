import React, { useState, useEffect } from 'react';
import MasonryGrid from './components/MasonryGrid';
import ImageViewer from './components/ImageViewer';
import UploadForm from './components/UploadForm';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/photos/`);
      if (response.ok) {
        let data = await response.json();
        // Fisher-Yates shuffle to randomize media on load
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
        setPhotos(data);
      } else {
        console.error("Failed to fetch photos");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    let intervalId;
    if (isAutoScroll && !selectedPhoto) {
      intervalId = setInterval(() => {
        window.scrollBy(0, 1);
        
        // Loop back to top if we reached the bottom
        if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          window.scrollTo(0, 0);
        }
      }, 30); // Approx 30px per second
    }
    return () => clearInterval(intervalId);
  }, [isAutoScroll, selectedPhoto]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  const categoryPhotos = activeCategory === 'general'
    ? photos
    : activeCategory === 'known'
    ? photos.filter(p => Boolean(p.known))
    : activeCategory === 'upload' ? [] : photos.filter(p => p.category === activeCategory);

  const query = searchQuery.trim().toLowerCase();
  const displayedPhotos = query
    ? (activeCategory === 'upload' ? photos : categoryPhotos).filter(photo => {
        const nameMatch = photo.photo_name && photo.photo_name.toLowerCase().includes(query);
        const urlMatch = photo.photo_url && photo.photo_url.toLowerCase().includes(query);
        return Boolean(nameMatch || urlMatch);
      })
    : categoryPhotos;

  const handleNext = () => {
    if (!selectedPhoto || displayedPhotos.length === 0) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < displayedPhotos.length - 1) {
      setSelectedPhoto(displayedPhotos[currentIndex + 1]);
    } else {
      setSelectedPhoto(displayedPhotos[0]);
    }
  };

  const handlePrev = () => {
    if (!selectedPhoto || displayedPhotos.length === 0) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(displayedPhotos[currentIndex - 1]);
    } else {
      setSelectedPhoto(displayedPhotos[displayedPhotos.length - 1]);
    }
  };



  return (
    <div className="app-container">
      <main className="pt-0.5 pb-0.5">
        {activeCategory === 'upload' || window.location.search.includes('admin=true') ? (
          <UploadForm onUploadSuccess={() => {
            fetchPhotos();
            setActiveCategory('general');
          }} />
        ) : loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse w-8 h-8 bg-gray-300"></div>
          </div>
        ) : (
          <MasonryGrid 
            photos={displayedPhotos} 
            onPhotoClick={handlePhotoClick}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}
      </main>

      {/* Floating Bottom Nav Bar */}
      <div className="nav-bar-wrapper">
        <div className="nav-bar-container">
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 text-gray-400 shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                placeholder="Search photo name or URL..."
                className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-44 sm:w-60"
                autoFocus
              />

              {searchQuery && (
                <span className="text-[11px] text-gray-400 whitespace-nowrap px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  {displayedPhotos.length}
                </span>
              )}

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-white p-0.5 text-xs"
                  title="Clear text"
                  aria-label="Clear text"
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                title="Close search"
                aria-label="Close search"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Home Icon -> General */}
              <button
                onClick={() => setActiveCategory('general')}
                className={`nav-button ${activeCategory === 'general' && !searchQuery ? 'active' : ''}`}
                title="General"
                aria-label="General"
              >
                =
              </button>

              {/* Sliders Icon -> Santhal */}
              <button
                id="nav-santhal-btn"
                onClick={() => setActiveCategory('santhal')}
                className={`nav-button ${activeCategory === 'santhal' ? 'active' : ''}`}
                title="Santhal"
                aria-label="Santhal"
              >
                -
              </button>

              {/* Checkmark Icon -> Known */}
              <button
                id="nav-known-btn"
                onClick={() => setActiveCategory('known')}
                className={`nav-button ${activeCategory === 'known' ? 'active' : ''}`}
                title="Known Media"
                aria-label="Known Media"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Search Icon */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  if (activeCategory === 'upload') {
                    setActiveCategory('general');
                  }
                }}
                className={`nav-button ${searchQuery ? 'active' : ''}`}
                title="Search photo name or URL"
                aria-label="Search photo name or URL"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Plus Icon -> Upload */}
              <button
                onClick={() => {
                  setActiveCategory('upload');
                  setIsSearchOpen(false);
                }}
                className={`nav-button ${activeCategory === 'upload' ? 'active' : ''}`}
                title="Upload Photo"
                aria-label="Upload Photo"
              >
                +
              </button>

              {/* Play/Pause Auto-Scroll */}
              <button
                onClick={() => setIsAutoScroll(!isAutoScroll)}
                className={`nav-button ${isAutoScroll ? 'active' : ''}`}
                title={isAutoScroll ? "Pause scroll" : "Auto scroll"}
                aria-label={isAutoScroll ? "Pause scroll" : "Auto scroll"}
              >
                {isAutoScroll ? '||' : '>'}
              </button>
            </>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <ImageViewer 
          photo={selectedPhoto} 
          onClose={closeViewer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

export default App;
