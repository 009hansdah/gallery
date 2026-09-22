import React from 'react';

const PhotoItem = ({ photo, onClick }) => {
  const isVideo = photo.photo_path.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div 
      className="masonry-item cursor-pointer group relative block"
      onClick={() => onClick(photo)}
    >
      {isVideo ? (
        <video 
          src={photo.photo_path} 
          className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-90"
          style={{ borderRadius: 0 }}
          autoPlay 
          loop 
          muted 
          playsInline
        />
      ) : (
        <img 
          src={photo.photo_path} 
          alt="" 
          className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-90"
          style={{ borderRadius: 0 }}
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default PhotoItem;
