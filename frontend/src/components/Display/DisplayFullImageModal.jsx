import React from 'react';

/**
 * Full-screen image modal component
 */
const DisplayFullImageModal = ({ 
  showFullImage, 
  setShowFullImage, 
  generatedContent 
}) => {
  if (!showFullImage) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={() => setShowFullImage(false)}
    >
      <div 
        className="relative max-w-7xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={generatedContent.imageUrl} 
          alt="Generated AI content - Full size"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        
        {/* Close button */}
        <button
          onClick={() => setShowFullImage(false)}
          className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Image info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">"{generatedContent.prompt}"</p>
          <p className="text-xs opacity-70 mt-1">
            Generated on {new Date(generatedContent.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayFullImageModal;



