import React from 'react';
import PhotoItem from './PhotoItem';

const MasonryGrid = ({ photos, onPhotoClick, searchQuery, onClearSearch }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        {searchQuery ? (
          <div className="max-w-md">
            <p className="text-gray-300 text-lg font-medium mb-1">No media found matching "{searchQuery}"</p>
            <p className="text-gray-500 text-sm mb-4">Try searching by a different photo name or associated URL</p>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-4 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-gray-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No photos yet</p>
        )}
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-5 gap-0.5 w-full p-0 mx-auto max-w-[2000px]">
      {photos.map((photo) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          onClick={onPhotoClick}
        />
      ))}
    </div>
  );
};

export default MasonryGrid;
