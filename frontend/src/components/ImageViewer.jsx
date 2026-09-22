import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageViewer = ({ photo, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 bg-black/90 backdrop-blur-md overflow-hidden"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
            onClick={onClose}
            aria-label="Close viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content - Click stops propagation so clicking image doesn't close modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative flex flex-col md:flex-row w-full max-w-[1200px] h-[85vh] md:h-[90vh] bg-black shadow-2xl rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container (Left) */}
            <div className="flex-1 flex items-center justify-center bg-black h-1/2 md:h-full border-r border-gray-800 relative group">
              {photo.photo_path.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video
                  src={photo.photo_path}
                  className="max-w-full max-h-full object-contain"
                  style={{ borderRadius: 0 }}
                  autoPlay
                  loop
                  controls
                />
              ) : (
                <img
                  src={photo.photo_path}
                  alt={photo.photo_name}
                  className="max-w-full max-h-full object-contain"
                  style={{ borderRadius: 0 }}
                />
              )}
              {/* Navigation Buttons */}
              {onPrev && (
                <button
                  className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  aria-label="Previous image"
                >

                </button>
              )}
              {onNext && (
                <button
                  className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  aria-label="Next image"
                >

                </button>
              )}
            </div>

            {/* Meta/Link Container (Right) */}
            <div className="w-full md:w-[350px] lg:w-[400px] h-1/2 md:h-full bg-[#262626] flex flex-col">

              {/* Header (Mock User Profile) */}
              <div className="flex items-center p-4 border-b border-gray-700 gap-3">
                <div className="flex items-center justify-center w-full text-white">
                  <span className="text-white text-sm font-semibold">{photo.photo_name}</span>
                </div>
              </div>
              {/* Actions & Link Footer */}
              <div className="border-t border-gray-700 p-4">
                <a
                  href={photo.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 text-white rounded-sm"
                >
                  <em>instagram</em>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewer;
