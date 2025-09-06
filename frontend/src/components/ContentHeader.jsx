import React from 'react';

const ContentHeader = ({ contentCount, onRefresh, filteringStatus }) => {
  return (
    
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">
          {contentCount} item{contentCount !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onRefresh}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>
  );
};

export default ContentHeader;
