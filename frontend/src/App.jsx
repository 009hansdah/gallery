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

  const filteredPhotos = activeCategory === 'general'
    ? photos
    : activeCategory === 'upload' ? [] : photos.filter(p => p.category === activeCategory);

  const handleNext = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    } else {
      setSelectedPhoto(filteredPhotos[0]);
    }
  };

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    } else {
      setSelectedPhoto(filteredPhotos[filteredPhotos.length - 1]);
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
          <MasonryGrid photos={filteredPhotos} onPhotoClick={handlePhotoClick} />
        )}
      </main>

      {/* Floating Bottom Nav Bar */}
      <div className="nav-bar-wrapper">
        <div className="nav-bar-container">
          {/* Home Icon -> General */}
          <button
            onClick={() => setActiveCategory('general')}
            className={`nav-button ${activeCategory === 'general' ? 'active' : ''}`}
          >
            =
          </button>

          {/* Sliders Icon -> Santhal */}
          <button
            onClick={() => setActiveCategory('santhal')}
            className={`nav-button ${activeCategory === 'santhal' ? 'active' : ''}`}
          >
            -
          </button>

          {/* Plus Icon -> Upload */}
          <button
            onClick={() => setActiveCategory('upload')}
            className={`nav-button ${activeCategory === 'upload' ? 'active' : ''}`}
          >
            +
          </button>

          {/* Play/Pause Auto-Scroll */}
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`nav-button ${isAutoScroll ? 'active' : ''}`}
          >
            {isAutoScroll ? '||' : '>'}
          </button>
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
