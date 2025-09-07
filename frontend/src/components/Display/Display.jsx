import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { NFTMintingLoading } from '../LoadingState';
import { useDisplayState } from './useDisplayState';
import DisplayEmptyState from './DisplayEmptyState';
import DisplayContent from './DisplayContent';
import DisplayNFTDetails from './DisplayNFTDetails';
import DisplayFullImageModal from './DisplayFullImageModal';

/**
 * Main Display component for generated content
 * Refactored for better maintainability and readability
 */
const Display = ({ 
  generatedContent, 
  selectedStyle, 
  onMintNFT, 
  isMinting, 
  onViewContentLibrary 
}) => {
  // Use custom hook for state management
  const displayState = useDisplayState(isMinting);

  // Early returns for different states
  if (!generatedContent) {
    return <DisplayEmptyState />;
  }

  if (isMinting) {
    return (
      <NFTMintingLoading 
        progress={displayState.mintingProgress} 
        step={displayState.mintingStep} 
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Content Display */}
      <DisplayContent
        generatedContent={generatedContent}
        selectedStyle={selectedStyle}
        onMintNFT={onMintNFT}
        onViewContentLibrary={onViewContentLibrary}
        copyToClipboard={displayState.copyToClipboard}
        copied={displayState.copied}
        setShowFullImage={displayState.setShowFullImage}
        setShowFullHash={displayState.setShowFullHash}
        showFullHash={displayState.showFullHash}
      />

      {/* NFT Details (if minted) */}
      <DisplayNFTDetails
        generatedContent={generatedContent}
        copyToClipboard={displayState.copyToClipboard}
        copied={displayState.copied}
      />

      {/* Generate More Hint */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
          <SparklesIcon className="w-4 h-4" />
          <span>Scroll down to generate more content</span>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <DisplayFullImageModal
        showFullImage={displayState.showFullImage}
        setShowFullImage={displayState.setShowFullImage}
        generatedContent={generatedContent}
      />
    </div>
  );
};

export default Display;




