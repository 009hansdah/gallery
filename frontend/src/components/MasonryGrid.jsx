import React from 'react';
import PhotoItem from './PhotoItem';

const MasonryGrid = ({ photos, onPhotoClick }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">No photos yet</p>
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
