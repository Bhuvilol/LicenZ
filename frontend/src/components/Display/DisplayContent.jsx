import React from 'react';
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  ShareIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

/**
 * Main content display component
 */
const DisplayContent = ({ 
  generatedContent, 
  selectedStyle, 
  onMintNFT, 
  onViewContentLibrary,
  copyToClipboard,
  copied,
  setShowFullImage,
  setShowFullHash,
  showFullHash
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <img 
                src={generatedContent.imageUrl} 
                alt={`AI generated content - ${generatedContent.prompt}`}
                className="w-full h-auto rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Image Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                    title="View full size"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => {}} // Download functionality
                    className="w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                    title="Download image"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => {}} // Share functionality
                    className="w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                    title="Share content"
                  >
                    <ShareIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Details Section */}
          <div className="space-y-6">
            {/* Prompt and Style */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Generated Content
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt:</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border">
                    "{generatedContent.prompt}"
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Style:</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {selectedStyle || 'photographic'}
                  </span>
                </div>
              </div>
            </div>

            {/* Generation Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-sm text-gray-600">Model:</span>
                <p className="font-medium text-gray-800">{generatedContent.model || 'Stable Diffusion XL'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Size:</span>
                <p className="font-medium text-gray-800">{generatedContent.width || 1024} × {generatedContent.height || 1024}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Generated:</span>
                <p className="font-medium text-gray-800">
                  {new Date(generatedContent.timestamp || Date.now()).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Hash:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                    {generatedContent.content_hash ? 
                      (showFullHash ? generatedContent.content_hash : `${generatedContent.content_hash.slice(0, 12)}...`) : 
                      'N/A'
                    }
                  </span>
                  <button
                    onClick={() => setShowFullHash(!showFullHash)}
                    className="text-gray-500 hover:text-gray-700 text-xs"
                  >
                    {showFullHash ? 'Show less' : 'Show more'}
                  </button>
                  {generatedContent.content_hash && (
                    <button
                      onClick={() => copyToClipboard(generatedContent.content_hash)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy hash"
                    >
                      {copied ? '✓' : <DocumentDuplicateIcon className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onMintNFT}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Mint as NFT</span>
                <span>🚀</span>
              </button>
              
              <button
                onClick={onViewContentLibrary}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>View in Content Library</span>
                <span>📚</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayContent;


