import React from 'react';

const ContentFilters = ({ 
  walletAddress, 
  onFilterChange, 
  currentFilters 
}) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...currentFilters,
      [filterType]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value={walletAddress || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            placeholder="Connected wallet address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Status
          </label>
          <select
            value={currentFilters.nftStatus || 'all'}
            onChange={(e) => handleFilterChange('nftStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Content</option>
            <option value="minted">NFT Minted</option>
            <option value="not-minted">Not Minted</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={currentFilters.contentType || 'all'}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="ai-generated">AI Generated</option>
            <option value="uploaded">Uploaded</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onFilterChange({})}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear All Filters
        </button>
        
        <div className="text-sm text-gray-500">
          {walletAddress ? `Filtering for: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet connected'}
        </div>
      </div>
    </div>
  );
};

export default ContentFilters;
