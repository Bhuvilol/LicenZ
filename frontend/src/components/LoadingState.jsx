import React from 'react';
import { 
  ArrowPathIcon, 
  SwatchIcon, 
  ArrowDownTrayIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Simple Loading Spinner
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-purple-500 border-t-transparent ${sizeClasses[size]}`} />
  );
};

// Main Loading State Component
export const LoadingState = ({ 
  type = 'default', 
  message = 'Loading content...', 
  size = 'md'
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'ai':
        return <SwatchIcon className="w-6 h-6 text-purple-500" />;
      case 'nft':
        return <ArrowDownTrayIcon className="w-6 h-6 text-green-500" />;
      case 'blockchain':
        return <ShieldCheckIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <ArrowPathIcon className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="flex items-center gap-3">
        {renderIcon()}
        <LoadingSpinner size={size} />
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// AI Generation Loading Component
export const AIGenerationLoading = ({ message = 'Generating AI content...' }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="flex items-center gap-3">
      <SwatchIcon className="w-6 h-6 text-purple-500" />
      <LoadingSpinner size="lg" />
    </div>
    <div className="text-center">
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
    </div>
  </div>
);

// NFT Minting Loading Component
export const NFTMintingLoading = ({ message = 'Minting NFT...' }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="flex items-center gap-3">
      <ArrowDownTrayIcon className="w-6 h-6 text-green-500" />
      <LoadingSpinner size="lg" />
    </div>
    <div className="text-center">
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Processing blockchain transaction...</p>
    </div>
  </div>
);

export default LoadingState;
